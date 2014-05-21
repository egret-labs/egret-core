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

/// <reference path="RendererContext.ts"/>
/// <reference path="../../core/HashObject.ts"/>
/// <reference path="../../core/Profiler.ts"/>
/// <reference path="../../display/Graphics.ts"/>
/// <reference path="../../geom/Matrix.ts"/>
/// <reference path="../../geom/Rectangle.ts"/>
/// <reference path="../../text/TextField.ts"/>
/// <reference path="../../texture/Texture.ts"/>
/// <reference path="../NativeContext.d.ts"/>

module ns_egret {
    /**
     * RenderContext是游戏的渲染上下文。
     * 这是一个抽象基类，制定主要的接口
     * @stable B 当编写WebGLContext和OpenGLContext时，RendererContext的接口有可能会发生变化，以兼容基于GPU模式的渲染方式，一些设计理念会参考PIXI.js
     * @roadmap 这个接口的重构和实现其他Context是引擎的重点工作
     */
    export class NativeRendererContext extends HashObject{


        /**
         * 渲染全部纹理的时间开销
         * @readonly
         */
        public renderCost:number = 0;

        /**
         * 绘制纹理的缩放比率，默认值为1
         */
        public texture_scale_factor:number = 1;

        public constructor() {
            super();
        }

        /**
         * @private
         */
        public clearScreen() {
            egret_native.Graphics.clearScreen(255,255,255);
        }


        /**
         * 清除Context的渲染区域
         * @param x
         * @param y
         * @param w
         * @param h
         */
        public clearRect(x:number, y:number, w:number, h:number) {
        }

        /**
         * 绘制图片
         * @param texture
         * @param sourceX
         * @param sourceY
         * @param sourceWidth
         * @param sourceHeight
         * @param destX
         * @param destY
         * @param destWidth
         * @param destHeight
         */
        public drawImage(texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {

            egret_native.Graphics.drawImage(texture,sourceX,sourceY,sourceWidth,sourceHeight,destX,destY,destWidth,destHeight);

            Profiler.getInstance().onDrawImage();
        }

        /**
         * 变换Context的当前渲染矩阵
         * @param matrix
         * @stable A
         */
        public setTransform(matrix:ns_egret.Matrix) {
            egret_native.Graphics.setTransform(matrix.a,matrix.b,matrix.c,matrix.d,matrix.tx,matrix.ty);
        }

        /**
         * @stable C 这个方法以后会和restore一起删除，移动到HTML5CanvasContext的具体实现中，而不是作为一个接口
         */
        public save() {

        }

        /**
         * @stable C 这个方法以后会和save一起删除，移动到HTML5CanvasContext的具体实现中，而不是作为一个接口
         */
        public restore() {

        }

        /**
         * 设置渲染alpha
         * @param value
         * @stable A
         */
        public setAlpha(value:number, blendMode:ns_egret.BlendMode) {
            egret_native.Graphics.setGlobalAlpha(value);
        }


        /**
         * 设置渲染文本参数
         * @param font
         * @param textAlign
         * @param textBaseline
         */
        public setupFont(textField:TextField):void {
//            egret_native.Label.createLable("/system/fonts/DroidSansFallback.ttf",textField.size,"");
        }


        /**
         * 测量文本
         * @param text
         * @returns {Rectangle}
         * @stable B 参数很可能会需要调整，和setupFont整合
         */
        public measureText(text):Rectangle {
            var rect:Rectangle = Rectangle.identity;
            return rect;
        }

        /**
         * 绘制文本
         * @param text
         * @param x
         * @param y
         * @param maxWidth
         */
        public drawText(textField:ns_egret.TextField,text:string, x:number, y:number, maxWidth:number) {
            Profiler.getInstance().onDrawImage();
        }

        /**
         * 矩形遮罩
         * @param x
         * @param y
         * @param w
         * @param h
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
}