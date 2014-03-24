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
///<reference path="../../../egret/texture/Texture.ts"/>
///<reference path="../../../egret/core/Logger.ts"/>
///<reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/debug/DEBUG.ts"/>
module ns_egret {
    export class Scale9Bitmap extends DisplayObject {
        private _defaultPadding:number = 5;
        private _top:number = this._defaultPadding;
        private _bottom:number = this._defaultPadding;
        private _left:number = this._defaultPadding;
        private _right:number = this._defaultPadding;

        private _scaleWidth:number = 0;
        private _scaleHeight:number = 0;

        constructor(private texture:Texture) {
            super();
        }

        public setScaleGrid(top:number = this._defaultPadding, bottom:number = this._defaultPadding, left:number = this._defaultPadding, right:number = this._defaultPadding) {
            if (DEBUG && DEBUG.SCALE_BITMAP_SET_SCALE_GRID) {
                DEBUG.checkSetScaleGrid(this.texture, top, bottom, left, right);
            }
            this._top = top;
            this._bottom = bottom;
            this._left = left;
            this._right = right;

        }

        public setContentSize(width, height) {
            super.setContentSize(width, height);

            if (!this.texture) {
                Logger.fatal("Scale9Bitmap没有纹理");
            }
            if (parseInt(width) > 0) {
                this._scaleWidth = width;
            }
            if (parseInt(height) > 0) {
                this._scaleHeight = height;
            }
        }

        render(renderContext:RendererContext) {
            var locTexture = this.texture;
            var textureWidth = locTexture.getTextureWidth();
            var textureHeight = locTexture.getTextureHeight();
            var contentWidth = this._scaleWidth;
            var contentHeight = this._scaleHeight;
            if(!locTexture || contentWidth == 0 || contentHeight == 0)
            {
                Logger.fatal("ScaleBitmap需要设置ScaleSize");
            }

            //纹理垂直中间距离
            var textureVertical = textureHeight - this._top - this._bottom;
            //纹理水平中间距离
            var textureHorizontal = textureWidth - this._left - this._right;
            //缩放后垂直中间距离
            var contentVertical = contentHeight - this._top - this._bottom;
            //缩放后水平中间距离
            var contentHorizontal = contentWidth - this._left - this._right;

            //左上块
            this.drawImage(renderContext, this.texture,
                0, 0, this._left, this._top,
                0, 0, this._left, this._top);

            //中上块
            renderContext.translate(this._left, 0);
            this.drawImage(renderContext, this.texture,
                this._left, 0, textureHorizontal, this._top,
                0, 0, contentHorizontal, this._top);

            //右上块
            renderContext.translate(contentHorizontal, 0);
            this.drawImage(renderContext, this.texture,
                textureWidth - this._right, 0, this._right, this._top,
                0, 0, this._right, this._top);

            //左中块
            renderContext.translate(-(contentWidth - this._right), this._top);
            this.drawImage(renderContext, this.texture,
                0, this._top, this._left, textureVertical,
                0, 0, this._left, contentVertical);

            //正中块
            renderContext.translate(this._left, 0);
            this.drawImage(renderContext, this.texture,
                this._left, this._top, textureHorizontal, textureVertical,
                0, 0, contentHorizontal, contentVertical);

            //右中块
            renderContext.translate(contentHorizontal, 0);
            this.drawImage(renderContext, this.texture,
                textureWidth - this._right, this._top, this._right, textureVertical,
                0, 0, this._right, contentVertical);

            //左下块
            renderContext.translate(-(contentWidth - this._right), contentVertical);
            this.drawImage(renderContext, this.texture,
                0, textureHeight - this._bottom, this._left, this._bottom,
                0, 0, this._left, this._bottom);

            //中下块
            renderContext.translate(this._left, 0);
            this.drawImage(renderContext, this.texture,
                this._left, textureHeight - this._bottom, textureHorizontal, this._bottom,
                0, 0, contentHorizontal, this._bottom);

            //右下块
            renderContext.translate(contentHorizontal, 0);
            this.drawImage(renderContext, this.texture,
                textureWidth - this._right, textureHeight - this._bottom, this._right, this._bottom,
                0, 0, this._right, this._bottom);
        }

        private drawImage(renderContext, texture:Texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
        {
            if(sourceWidth > 0 && sourceHeight > 0)
            {
                renderContext.drawImage(texture,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    destX, destY, destWidth, destHeight);
            }
        }
    }
}
