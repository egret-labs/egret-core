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

///<reference path="DisplayObject.ts" />
///<reference path="Bitmap.ts" />

module ns_egret{
    /**
     * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字
     * @class ns_egret.BitmapText
     */
    export class BitmapText extends DisplayObject {

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

        constructor() {
            super();
        }

        public render(renderContext:RendererContext) {
            if(!this.text)
            {
                return;
            }
            this.text = this.text.toString();
            this._renderText(renderContext);
        }

        //todo:这里对bounds的处理和TextField非常类似，以后考虑重构
        private _renderText(renderContext:RendererContext,forMeasureContentSize:boolean = false){
            this._contentWidth = 0;
            this._contentHeight = 0;
            for (var i = 0, l = this.text.length; i < l; i++) {
                var character = this.text.charAt(i);
                var spriteFrame = this.bitmapFontData[character];
                if (spriteFrame == null) {
                    ns_egret.Logger.fatal("BitmapText：异常的bitmapFontData: ",character);
                }
                var offsetX = spriteFrame.offX;
                var offsetY = spriteFrame.offY;
                var characterWidth = spriteFrame.w;
                if (!forMeasureContentSize){
                    renderContext.drawImage(this.texture,
                        spriteFrame.x, spriteFrame.y, spriteFrame.w, spriteFrame.h,
                        offsetX, offsetY, spriteFrame.w, spriteFrame.h);
                    renderContext.translate(characterWidth, 0);//todo，不支持换行
                }
                this._contentWidth += characterWidth + offsetX;
                if(offsetY + spriteFrame.h > this._contentHeight)
                {
                    this._contentHeight = offsetY + spriteFrame.h;
                }
            }
        }

        public getBounds():ns_egret.Rectangle {
            var renderContext = ns_egret.MainContext.instance.rendererContext;
            this._renderText(renderContext, true);
            var anchorX, anchorY;
            if (this.relativeAnchorPointX != 0 || this.relativeAnchorPointY != 0) {
                anchorX = this._contentWidth * this.relativeAnchorPointX;
                anchorY = this._contentHeight * this.relativeAnchorPointY;
            }
            else {
                anchorX = this.anchorPointX;
                anchorY = this.anchorPointY;
            }
            return Rectangle.identity.initialize(-anchorX, -anchorY,
                this._contentWidth, this._contentHeight);
        }
    }
}
