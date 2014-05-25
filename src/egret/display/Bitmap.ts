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

/// <reference path="../context/renderer/RenderFilter.ts"/>
/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="DisplayObject.ts"/>
/// <reference path="SpriteSheet.ts"/>
/// <reference path="Texture.ts"/>
/// <reference path="../geom/Rectangle.ts"/>

module ns_egret {
	/**
	 * @class ns_egret.Bitmap
	 * @classdesc
     * Bitmap 类表示用于表示位图图像的显示对象。
	 * @extends ns_egret.DisplayObject
	 */
    export class Bitmap extends DisplayObject {

        /**
         * 全部Bitmap是否开启DEBUG模式
		 * @member {boolean} ns_egret.Bitmap.debug
         */
        public static debug:boolean = false;


        /**
         * 单个Bitmap是否开启DEBUG模式
		 * @member {boolean} ns_egret.Bitmap#debug
         */
        public debug:boolean = false;

        /**
         * debug边框颜色，默认值为红色
		 * @member {number} ns_egret.Bitmap#debugColor
         */
        public debugColor:number = 0xff0000;

        /**
         * 渲染采用的SpriteFrame，用来渲染纹理中的一部分
		 * @member {ns_egret.SpriteSheetFrame} ns_egret.Bitmap#spriteFrame
         */
        public spriteFrame:ns_egret.SpriteSheetFrame;

        /**
         * 渲染纹理
		 * @member {ns_egret.Texture} ns_egret.Bitmap#texture
         */
        public texture:Texture;

        constructor() {
            super();
        }

        public _render(renderContext:RendererContext):void {
            var locTexture = this.texture;
            if (locTexture == null) {
                return;
            }
            this._texture_to_render = locTexture;
            var x, y, w, h, offsetX, offsetY;
            if (this.spriteFrame) {
                var rect:ns_egret.SpriteSheetFrame = this.spriteFrame;
                x = rect.x;
                y = rect.y;
                w = rect.w;
                h = rect.h;
                offsetX = rect.offX;
                offsetY = rect.offY;
            }
            else {
                x = 0;
                y = 0;
                w = locTexture._textureWidth;
                h = locTexture._textureHeight;
                offsetX = 0;
                offsetY = 0;
            }

            RenderFilter.getInstance().drawImage(renderContext, this, x, y, w, h, offsetX, offsetY, w, h);
        }

        /**
         * @see egret.DisplayObject.measureBounds
         * @returns {ns_egret.Rectangle}
         * @private
         */
        public _measureBounds():ns_egret.Rectangle {
            var rect:ns_egret.SpriteSheetFrame = this.spriteFrame;
            var x:number = 0;
            var y:number = 0;
            var w:number = 0;
            var h:number = 0;
            if (rect) {
                x = rect.offX;
                y = rect.offY;
                w = rect.w;
                h = rect.h;
            }
            else if (this.texture) {
                w = this.texture._textureWidth;
                h = this.texture._textureHeight;
            }
            return Rectangle.identity.initialize(x,y, w, h);
        }
    }
}