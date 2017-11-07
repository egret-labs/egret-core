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

    /**
     * @private
     * Mesh 渲染节点
     */
    export class MeshNode extends RenderNode {

        public constructor(){
            super();
            this.type = RenderNodeType.MeshNode;
            this.vertices = [];
            this.uvs = [];
            this.indices = [];
        }
        /**
         * 要绘制的位图
         */
        public image:BitmapData = null;
        /**
         * 控制在缩放时是否对位图进行平滑处理。
         */
        public smoothing:boolean = true;
        /**
         * 图片宽度。WebGL渲染使用
         */
        public imageWidth:number;
        /**
         * 图片高度。WebGL渲染使用
         */
        public imageHeight:number;
        /**
         * 相对偏移矩阵。
         */
        public matrix:egret.Matrix;
        /**
         * UV 坐标。
         */
        public uvs:number[];
        /**
         * 顶点坐标。
         */
        public vertices:number[];
        /**
         * 顶点索引。
         */
        public indices:number[];
        /**
         * 顶点索引。
         */
        public bounds:Rectangle = new Rectangle();
        /**
         * 使用的混合模式
         */
        public blendMode: number = null;
        /**
         * 相对透明度
         */
        public alpha: number = NaN;
        /**
         * 颜色变换滤镜
         */
        public filter: ColorMatrixFilter = null;
        /**
         * 翻转
         */
        public rotated: boolean = false;
        /**
         * 绘制一次位图
         */
        public drawMesh(sourceX:number, sourceY:number, sourceW:number, sourceH:number,
                         drawX:number, drawY:number, drawW:number, drawH:number):void {
            this.drawData.push(sourceX, sourceY, sourceW, sourceH, drawX, drawY, drawW, drawH);
            this.renderCount++;
        }

        /**
         * 在显示对象的$updateRenderNode()方法被调用前，自动清空自身的drawData数据。
         */
        public cleanBeforeRender():void{
            super.cleanBeforeRender();
            this.image = null;
            this.matrix = null;
        }
    }
}