/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {
    /**
     * @class egret.RendererContext
     * @classdesc
     * RenderContext是游戏的渲染上下文。
     * 这是一个抽象基类，制定主要的接口
     * @extends egret.HashObject
     */
    export class RendererContext extends HashObject {


        /**
         * 渲染全部纹理的时间开销
         * @member egret.RendererContext#renderCost
         */
        public renderCost:number = 0;

        /**
         * 是否是webGL模式
         * @member egret.RendererContext#isWebGLMode
         */
        public isWebGLMode:boolean = false;

        /**
         * 绘制纹理的缩放比率，默认值为1
         * @member egret.RendererContext#texture_scale_factor
         */
        public texture_scale_factor:number = 1;

        /**
         * @method egret.RendererContext#constructor
         */
        public constructor() {
            super();
        }

        /**
         * @method egret.RendererContext#clearScreen
         * @private
         */
        public clearScreen() {
        }


        /**
         * 清除Context的渲染区域
         * @method egret.RendererContext#clearRect
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {numbe}
         */
        public clearRect(x:number, y:number, w:number, h:number) {

        }

        /**
         * 绘制图片
         * @method egret.RendererContext#drawImage
         * @param texture {Texture}
         * @param sourceX {any}
         * @param sourceY {any}
         * @param sourceWidth {any}
         * @param sourceHeight {any}
         * @param destX {any}
         * @param destY {any}
         * @param destWidth {any}
         * @param destHeigh {any}
         */
        public drawImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {
            Profiler.getInstance().onDrawImage();
        }

        /**
         * 变换Context的当前渲染矩阵
         * @method egret.RendererContext#setTransform
         * @param matrix {egret.Matri}
         */
        public setTransform(matrix:egret.Matrix) {

        }

        /**
         * @method egret.RendererContext#save
         * @stable C 这个方法以后会和restore一起删除，移动到HTML5CanvasContext的具体实现中，而不是作为一个接口
         */
        public save() {

        }

        /**
         * @method egret.RendererContext#restore
         * @stable C 这个方法以后会和save一起删除，移动到HTML5CanvasContext的具体实现中，而不是作为一个接口
         */
        public restore() {

        }

        /**
         * 设置渲染alpha
         * @method egret.RendererContext#setAlpha
         * @param value {number}
         * @param blendMode {egret.BlendMod}
         */
        public setAlpha(value:number, blendMode:egret.BlendMode) {

        }


        /**
         * 设置渲染文本参数
         * @method egret.RendererContext#setupFont
         * @param textField {TextField}
         */
        public setupFont(textField:TextField):void {

        }


        /**
         * 测量文本
         * @method egret.RendererContext#measureText
         * @param text {string}
         * @returns {number}
         * @stable B 参数很可能会需要调整，和setupFont整合
         */
        public measureText(text:string):number {
            return 0;
        }

        /**
         * 绘制文本
         * @method egret.RendererContext#drawText
         * @param textField {egret.TextField}
         * @param text {string}
         * @param x {number}
         * @param y {number}
         * @param maxWidth {numbe}
         */
        public drawText(textField:egret.TextField, text:string, x:number, y:number, maxWidth:number) {
            Profiler.getInstance().onDrawImage();
        }

        /**
         * 矩形遮罩
         * @method egret.RendererContext#clip
         * @param x {any}
         * @param y {any}
         * @param w {any}
         */
        public clip(x, y, w, h) {
        }


        public strokeRect(x, y, w, h, color) {
        }
    }


    /**
     * @class egret.BlendMode
     * @classdesc
     */
    export class BlendMode {

        /**
         * @member egret.BlendMode#value
         */
        public value:string;

        constructor(private type) {
            switch (type) {
                case "add":
                case "layer":
                    this.value = "lighter";
                    break;
                default:
                    this.value = "source-over";
            }
        }

//            updateContext(ctx){
//                if (this.type == "add"){
//                    ctx.globalCompositeOperation = "lighter";
//                }
//            }


        static NORMAL = new BlendMode("normal");
        static ADD = new BlendMode("add");
        static LAYER = new BlendMode("layer");

        /**
         * @method egret.BlendMode.getBlendMode
         * @param typ {any}
         */
        public static getBlendMode(type) {
            if (!type) {
                return egret.BlendMode.NORMAL;
            }
            return egret.BlendMode[type.toUpperCase()];
        }
    }


}