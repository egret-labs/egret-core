/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../core/HashObject.ts"/>
/// <reference path="../../core/Profiler.ts"/>
/// <reference path="../../geom/Matrix.ts"/>
/// <reference path="../../text/TextField.ts"/>
/// <reference path="../../texture/Texture.ts"/>

module ns_egret {
    /**
	 * @class ns_egret.RendererContext
     * @classdesc
     * RenderContext是游戏的渲染上下文。
     * 这是一个抽象基类，制定主要的接口
	 * @extends ns_egret.HashObject
     */
    export class RendererContext extends HashObject{


        /**
         * 渲染全部纹理的时间开销
		 * @member ns_egret.RendererContext#renderCost
         */
        public renderCost:number = 0;

        /**
         * 绘制纹理的缩放比率，默认值为1
		 * @member ns_egret.RendererContext#texture_scale_factor
         */
        public texture_scale_factor:number = 1;

		/**
		 * @method ns_egret.RendererContext#constructor
		 */
        public constructor() {
            super();
        }

        /**
		 * @method ns_egret.RendererContext#clearScreen
         * @private
         */
        public clearScreen() {
        }


        /**
         * 清除Context的渲染区域
		 * @method ns_egret.RendererContext#clearRect
         * @param x {number} 
         * @param y {number} 
         * @param w {number} 
         * @param h {numbe} 
         */
        public clearRect(x:number, y:number, w:number, h:number) {

        }

        /**
         * 绘制图片
		 * @method ns_egret.RendererContext#drawImage
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
		 * @method ns_egret.RendererContext#setTransform
         * @param matrix {ns_egret.Matri} 
         */
        public setTransform(matrix:ns_egret.Matrix) {

        }

        /**
		 * @method ns_egret.RendererContext#save
         * @stable C 这个方法以后会和restore一起删除，移动到HTML5CanvasContext的具体实现中，而不是作为一个接口
         */
        public save() {

        }

        /**
		 * @method ns_egret.RendererContext#restore
         * @stable C 这个方法以后会和save一起删除，移动到HTML5CanvasContext的具体实现中，而不是作为一个接口
         */
        public restore() {

        }

        /**
         * 设置渲染alpha
		 * @method ns_egret.RendererContext#setAlpha
         * @param value {number} 
		 * @param blendMode {ns_egret.BlendMod} 
         */
        public setAlpha(value:number, blendMode:ns_egret.BlendMode) {

        }


        /**
         * 设置渲染文本参数
		 * @method ns_egret.RendererContext#setupFont
         * @param textField {TextField} 
         */
        public setupFont(textField:TextField):void {

        }


        /**
         * 测量文本
		 * @method ns_egret.RendererContext#measureText
         * @param text {any} 
		 * @returns {number}
         * @stable B 参数很可能会需要调整，和setupFont整合
         */
        public measureText(text):number {
            return 0;
        }

        /**
         * 绘制文本
		 * @method ns_egret.RendererContext#drawText
         * @param textField {ns_egret.TextField} 
         * @param text {string} 
         * @param x {number} 
         * @param y {number} 
		 * @param maxWidth {numbe} 
         */
        public drawText(textField:ns_egret.TextField,text:string, x:number, y:number, maxWidth:number) {
            Profiler.getInstance().onDrawImage();
        }

        /**
         * 矩形遮罩
		 * @method ns_egret.RendererContext#clip
         * @param x {any} 
         * @param y {any} 
         * @param w {any} 
         */
        public clip(x, y, w, h) {
        }

        /**
         * @param x
         * @param y
         * @param w
         * @param h
         * @param color
         * @stable D 这个API是个临时添加的，会被尽快删除
         */
            strokeRect(x, y, w, h, color) {
        }
    }


	/**
	 * @class ns_egret.BlendMode
	 * @classdesc
	 */
    export class BlendMode {

		/**
		 * @member ns_egret.BlendMode#value
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
		 * @method ns_egret.BlendMode.getBlendMode
		 * @param typ {any} 
		 */
        public static getBlendMode(type) {
            if (!type) {
                return ns_egret.BlendMode.NORMAL;
            }
            return ns_egret.BlendMode[type.toUpperCase()];
        }
    }


}