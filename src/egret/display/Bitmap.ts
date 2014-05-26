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

        public constructor() {
            super();
        }

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

        private _spriteFrame:ns_egret.SpriteSheetFrame;
        /**
         * 这个API已废弃,将删除SpriteSheetFrame类。
         * @deprecated
         */
        public get spriteFrame():ns_egret.SpriteSheetFrame{
            return this._spriteFrame;
        }
        public set spriteFrame(value:SpriteSheetFrame){
            this._spriteFrame = value;
            if(this.texture){
                this.texture._startX = value.x;
                this.texture._startY = value.y;
                this.texture._textureHeight = value.h;
                this.texture._textureWidth = value.w;
                this.texture._offsetX = value.offX;
                this.texture._offsetY = value.offY;
            }
        }

        /**
         * 渲染纹理
		 * @member {ns_egret.Texture} ns_egret.Bitmap#texture
         */
        public texture:Texture;

        public _render(renderContext:RendererContext):void {
            var texture = this.texture;
            if (!texture) {
                this._texture_to_render = null;
                return;
            }
            this._texture_to_render = texture;
            var w:number = texture._textureWidth;
            var h:number = texture._textureHeight;
            RenderFilter.getInstance().drawImage(renderContext, this, texture._startX, texture._startY,
                w, h, texture._offsetX, texture._offsetY, w, h);
        }

        /**
         * @see egret.DisplayObject.measureBounds
         * @returns {ns_egret.Rectangle}
         * @private
         */
        public _measureBounds():ns_egret.Rectangle {
            var texture:Texture = this.texture;
            if(!texture){
                return super._measureBounds();
            }
            var x:number = texture._offsetX;
            var y:number = texture._offsetY;
            var w:number = texture._textureWidth;
            var h:number = texture._textureHeight;
            return Rectangle.identity.initialize(x,y, w, h);
        }
    }
}