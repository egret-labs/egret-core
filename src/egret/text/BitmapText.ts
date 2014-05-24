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

/// <reference path="../display/Bitmap.ts"/>
/// <reference path="../display/DisplayObjectContainer.ts"/>
/// <reference path="../display/Texture.ts"/>
/// <reference path="../geom/Rectangle.ts"/>
/// <reference path="../utils/Logger.ts"/>

module ns_egret {
    /**
     * @class BitmapText
     * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字
     */
    export class BitmapText extends DisplayObjectContainer {

        /**
         * 设置文本
         */
        public text:string = "";
//        private current_rendered_text:string;

        /**
         * 纹理对象
         */
        public texture:Texture;

        /**
         * SpriteFrame配置文件，通过egret的Node.js工具生成
         */
        public bitmapFontData;

        private _bitmapPool:Array<Bitmap>;

        constructor() {
            super();
            this._bitmapPool = [];
        }

        public _updateTransform():void {
            if (!this.visible) {
                return;
            }
            this._renderText();
            super._updateTransform();
        }

        //todo:这里对bounds的处理和TextField非常类似，以后考虑重构
        public _renderText(forMeasureContentSize:boolean = false):Rectangle {
            var rect:Rectangle = Rectangle.identity.initialize(0, 0, 0, 0);
            if (!forMeasureContentSize) {
                this.removeChildren();
            }
            for (var i = 0, l = this.text.length; i < l; i++) {
                var character = this.text.charAt(i);
                var spriteFrame = this.bitmapFontData[character];
                if (spriteFrame == null) {
                    ns_egret.Logger.fatal("BitmapText：异常的bitmapFontData: ", character);
                }
                var offsetX = spriteFrame.offX;
                var offsetY = spriteFrame.offY;
                var characterWidth = spriteFrame.w;
                if (!forMeasureContentSize) {//todo，不支持换行
                    var bitmap = this._bitmapPool[i];
                    if (!bitmap) {
                        bitmap = new Bitmap();
                        bitmap.texture = this.texture;
                        this._bitmapPool.push(bitmap);
                    }
                    this.addChild(bitmap);
                    bitmap.spriteFrame = spriteFrame;
                    bitmap.x = rect.width;
                }
                rect.width += characterWidth + offsetX;
                if (offsetY + spriteFrame.h > rect.height) {
                    rect.height = offsetY + spriteFrame.h;
                }
            }
            return rect;
        }

        public _measureBounds():Rectangle {
            return this._renderText(true);
        }
    }
}