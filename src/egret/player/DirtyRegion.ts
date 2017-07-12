//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret.sys {

    if (DEBUG) {
        function isF(num:number):boolean {
            return num % 1 !== 0;
        }
    }

    /**
     * @private
     */
    function unionArea(r1:Region, r2:Region):number {
        let minX = r1.minX < r2.minX ? r1.minX : r2.minX;
        let minY = r1.minY < r2.minY ? r1.minY : r2.minY;
        let maxX = r1.maxX > r2.maxX ? r1.maxX : r2.maxX;
        let maxY = r1.maxY > r2.maxY ? r1.maxY : r2.maxY;
        return (maxX - minX) * (maxY - minY);
    }

    /**
     * @private
     * 脏矩形计算工具类
     */
    export class DirtyRegion {

        public constructor(root:DisplayObject) {
            this.root = root;
        }

        /**
         * @private
         */
        private root:DisplayObject;
        /**
         * @private
         */
        private dirtyList:Region[] = [];
        /**
         * @private
         */
        private hasClipRect:boolean = false;
        /**
         * @private
         */
        private clipWidth:number = 0;
        /**
         * @private
         */
        private clipHeight:number = 0;
        /**
         * @private
         */
        private clipArea:number = 0;
        /**
         * @private
         */
        private clipRectChanged:boolean = false;

        /**
         * @private
         * 设置剪裁边界，超过边界的节点将跳过绘制。
         */
        public setClipRect(width:number, height:number):void {
            this.hasClipRect = true;
            this.clipRectChanged = true;
            this.clipWidth = Math.ceil(width);
            this.clipHeight = Math.ceil(height);
            this.clipArea = this.clipWidth * this.clipHeight;
        }

        /**
         * @private
         * 添加一个脏矩形区域，返回是否添加成功，当矩形为空或者在屏幕之外时返回false。
         */
        public addRegion(target:Region):boolean {
            let minX = target.minX, minY = target.minY, maxX = target.maxX, maxY = target.maxY;
            if (this.hasClipRect) {
                if (minX < 0) {
                    minX = 0;
                }
                if (minY < 0) {
                    minY = 0;
                }
                if (maxX > this.clipWidth) {
                    maxX = this.clipWidth;
                }
                if (maxY > this.clipHeight) {
                    maxY = this.clipHeight;
                }
            }
            if (minX >= maxX || minY >= maxY) {
                return false;
            }
            if (this.clipRectChanged) {
                return true;
            }
            let dirtyList = this.dirtyList;
            let region:Region = Region.create();
            dirtyList.push(region.setTo(minX, minY, maxX, maxY));
            if (this.$dirtyRegionPolicy != egret.DirtyRegionPolicy.OFF) {
                this.mergeDirtyList(dirtyList);
            }
            return true;
        }

        /**
         * @private
         */
        public clear():void {
            let dirtyList = this.dirtyList;
            let length = dirtyList.length;
            for (let i = 0; i < length; i++) {
                Region.release(dirtyList[i]);
            }
            dirtyList.length = 0;
        }

        /**
         * @private
         * 获取最终的脏矩形列表
         */
        public getDirtyRegions():Region[] {
            let dirtyList = this.dirtyList;
            if (this.$dirtyRegionPolicy == egret.DirtyRegionPolicy.OFF) {
                this.clipRectChanged = true;//阻止所有的addRegion()
                this.clear();
                let region:Region = Region.create();
                if (this.hasClipRect) {
                    dirtyList.push(region.setTo(0, 0, this.clipWidth, this.clipHeight));
                }
                else {
                    let bounds = this.root.$getOriginalBounds();
                    dirtyList.push(region.setTo(bounds.x, bounds.y, bounds.width, bounds.height));
                }
            }
            else if (this.clipRectChanged) {
                this.clipRectChanged = false;
                this.clear();
                let region:Region = Region.create();
                dirtyList.push(region.setTo(0, 0, this.clipWidth, this.clipHeight));
            }
            else {
                while (this.mergeDirtyList(dirtyList)) {
                }
            }
            let numDirty = this.dirtyList.length;
            if (numDirty > 0) {
                for (let i = 0; i < numDirty; i++) {
                    this.dirtyList[i].intValues();
                }
            }
            return this.dirtyList;
        }

        /**
         * @private
         * 合并脏矩形列表
         */
        private mergeDirtyList(dirtyList:Region[]):boolean {
            let length = dirtyList.length;
            if (length < 2) {
                return false;
            }
            let hasClipRect = this.hasClipRect;
            let bestDelta = length > 3 ? Number.POSITIVE_INFINITY : 0;
            let mergeA = 0;
            let mergeB = 0;
            let totalArea = 0;
            for (let i = 0; i < length - 1; i++) {
                let regionA = dirtyList[i];
                hasClipRect && (totalArea += regionA.area);
                for (let j = i + 1; j < length; j++) {
                    let regionB = dirtyList[j];
                    let delta = unionArea(regionA, regionB) - regionA.area - regionB.area;
                    if (bestDelta > delta) {
                        mergeA = i;
                        mergeB = j;
                        bestDelta = delta;
                    }
                }
            }
            if (hasClipRect && (totalArea / this.clipArea) > 0.95) {//当脏矩形的面积已经超过屏幕95%时，直接放弃后续的所有标记。
                this.clipRectChanged = true;
            }
            if (mergeA != mergeB) {
                let region = dirtyList[mergeB];
                dirtyList[mergeA].union(region);
                Region.release(region);
                dirtyList.splice(mergeB, 1);
                return true;
            }
            return false;
        }

        private $dirtyRegionPolicy:string = egret.DirtyRegionPolicy.ON;

        public setDirtyRegionPolicy(policy:string):void {
            this.$dirtyRegionPolicy = policy;
        }


    }

}