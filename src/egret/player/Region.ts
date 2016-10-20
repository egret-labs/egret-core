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

    let regionPool:Region[] = [];

    /**
     * @private
     */
    export class Region {

        /**
         * @private
         * 释放一个Region实例到对象池
         */
        public static release(region:Region):void {
            regionPool.push(region);
        }

        /**
         * @private
         * 从对象池中取出或创建一个新的Region对象。
         * 建议对于一次性使用的对象，均使用此方法创建，而不是直接new一个。
         * 使用完后调用对应的release()静态方法回收对象，能有效减少对象创建数量造成的性能开销。
         */
        public static create():Region {
            let region = regionPool.pop();
            if (!region) {
                region = new Region();
            }
            return region;
        }

        /**
         * @private
         */
        public minX:number = 0;
        /**
         * @private
         */
        public minY:number = 0;
        /**
         * @private
         */
        public maxX:number = 0;
        /**
         * @private
         */
        public maxY:number = 0;

        /**
         * @private
         */
        public width:number = 0;
        /**
         * @private
         */
        public height:number = 0;
        /**
         * @private
         */
        public area:number = 0;

        /**
         * @private
         * 是否发生移动
         */
        moved:boolean = false;

        /**
         * @private
         */
        public setTo(minX:number, minY:number, maxX:number, maxY:number):Region {
            this.minX = minX;
            this.minY = minY;
            this.maxX = maxX;
            this.maxY = maxY;
            this.updateArea();
            return this;
        }
        /**
         * @private
         * 把所有值都取整
         */
        public intValues(){
            this.minX = Math.floor(this.minX);
            this.minY = Math.floor(this.minY);
            this.maxX = Math.ceil(this.maxX);
            this.maxY = Math.ceil(this.maxY);
            this.updateArea();
        }

        /**
         * @private
         */
        public updateArea():void {
            this.width = this.maxX - this.minX;
            this.height = this.maxY - this.minY;
            this.area = this.width * this.height;
        }

        /**
         * @private
         * 注意！由于性能优化，此方法不判断自身是否为空，必须在外部确认自身和目标区域都不为空再调用合并。否则结果始终从0，0点开始。
         */
        public union(target:Region):void {
            if (this.minX > target.minX) {
                this.minX = target.minX;
            }
            if (this.minY > target.minY) {
                this.minY = target.minY;
            }
            if (this.maxX < target.maxX) {
                this.maxX = target.maxX;
            }
            if (this.maxY < target.maxY) {
                this.maxY = target.maxY;
            }
            this.updateArea();
        }

        /**
         * @private
         * 注意！由于性能优化，此方法不判断自身是否为空，必须在外部确认自身和目标区域都不为空再调用合并。否则结果始终从0，0点开始。
         */
        public intersect(target:Region):void {
            if (this.minX < target.minX) {
                this.minX = target.minX;
            }
            if (this.maxX > target.maxX) {
                this.maxX = target.maxX;
            }
            if (this.minX >= this.maxX) {
                this.setEmpty();
                return;
            }
            if (this.minY < target.minY) {
                this.minY = target.minY;
            }

            if (this.maxY > target.maxY) {
                this.maxY = target.maxY;
            }
            if (this.minY >= this.maxY) {
                this.setEmpty();
                return;
            }
            this.updateArea();
        }

        /**
         * @private
         */
        private setEmpty():void {
            this.minX = 0;
            this.minY = 0;
            this.maxX = 0;
            this.maxY = 0;
            this.width = 0;
            this.height = 0;
            this.area = 0;
        }

        /**
         * @private
         * 确定此 Region 对象是否为空。
         */
        public isEmpty():boolean {
            return this.width <= 0 || this.height <= 0;
        }

        /**
         * @private
         */
        public intersects(target:Region):boolean {
            if(this.isEmpty()) {
                return false;
            }
            let max = this.minX > target.minX ? this.minX : target.minX;
            let min = this.maxX < target.maxX ? this.maxX : target.maxX;
            if (max > min) {
                return false;
            }

            max = this.minY > target.minY ? this.minY : target.minY;
            min = this.maxY < target.maxY ? this.maxY : target.maxY;
            return max <= min;
        }

        /**
         * @private
         */
        public updateRegion(bounds:Rectangle, matrix:Matrix):void {
            if(bounds.width == 0 || bounds.height == 0) {
                //todo 理论上应该是空
                this.setEmpty();
                return;
            }
            let m = matrix;
            let a = m.a;
            let b = m.b;
            let c = m.c;
            let d = m.d;
            let tx = m.tx;
            let ty = m.ty;
            let x = bounds.x;
            let y = bounds.y;
            let xMax = x + bounds.width;
            let yMax = y + bounds.height;
            let minX:number, minY:number, maxX:number, maxY:number;
            //优化，通常情况下不缩放旋转的对象占多数，直接加上偏移量即可。
            if (a == 1.0 && b == 0.0 && c == 0.0 && d == 1.0) {
                minX = x + tx - 1;
                minY = y + ty - 1;
                maxX = xMax + tx + 1;
                maxY = yMax + ty + 1;
            }
            else {
                let x0 = a * x + c * y + tx;
                let y0 = b * x + d * y + ty;
                let x1 = a * xMax + c * y + tx;
                let y1 = b * xMax + d * y + ty;
                let x2 = a * xMax + c * yMax + tx;
                let y2 = b * xMax + d * yMax + ty;
                let x3 = a * x + c * yMax + tx;
                let y3 = b * x + d * yMax + ty;

                let tmp = 0;

                if (x0 > x1) {
                    tmp = x0;
                    x0 = x1;
                    x1 = tmp;
                }
                if (x2 > x3) {
                    tmp = x2;
                    x2 = x3;
                    x3 = tmp;
                }

                minX = (x0 < x2 ? x0 : x2) - 1;
                maxX = (x1 > x3 ? x1 : x3) + 1;

                if (y0 > y1) {
                    tmp = y0;
                    y0 = y1;
                    y1 = tmp;
                }
                if (y2 > y3) {
                    tmp = y2;
                    y2 = y3;
                    y3 = tmp;
                }

                minY = (y0 < y2 ? y0 : y2) - 1;
                maxY = (y1 > y3 ? y1 : y3) + 1;
            }
            this.minX = minX;
            this.minY = minY;
            this.maxX = maxX;
            this.maxY = maxY;
            this.width = maxX - minX;
            this.height = maxY - minY;
            this.area = this.width * this.height;
        }
    }
}

