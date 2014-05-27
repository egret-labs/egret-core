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
         * BitmapTextSpriteSheet对象，缓存了所有文本的位图纹理
         */
        public spriteSheet:BitmapTextSpriteSheet;


        /**
         * 已经废弃
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