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
///<reference path="../../../egret/display/DisplayObjectContainer.ts"/>
///<reference path="../../../egret/display/Bitmap.ts"/>
/// <reference path="../../../egret/debug/DEBUG.ts"/>
module ns_egret {
    export class Scale9Bitmap extends DisplayObjectContainer {
        private _defaultPadding:number = 5;
        private _top:number;
        private _bottom:number;
        private _left:number;
        private _right:number;

        private _scaleWidth:number = 0;
        private _scaleHeight:number = 0;

        private _topLeftBitmap:ns_egret.Bitmap;
        private _topMiddleBitmap:ns_egret.Bitmap;
        private _topRightBitmap:ns_egret.Bitmap;

        private _middleLeftBitmap:ns_egret.Bitmap;
        private _middleMiddleBitmap:ns_egret.Bitmap;
        private _middleRightBitmap:ns_egret.Bitmap;

        private _bottomLeftBitmap:ns_egret.Bitmap;
        private _bottomMiddleBitmap:ns_egret.Bitmap;
        private _bottomRightBitmap:ns_egret.Bitmap;

        constructor(private texture:Texture) {
            super();
            this._top = this._bottom = this._left = this._right = this._defaultPadding;

            this._topLeftBitmap = Bitmap.initWithTexture(texture);
            this._topLeftBitmap.spriteFrame = new ns_egret.SpriteSheetFrame();
            this.addChild(this._topLeftBitmap);

            this._topMiddleBitmap = Bitmap.initWithTexture(texture);
            this._topMiddleBitmap.spriteFrame = new ns_egret.SpriteSheetFrame();
            this.addChild(this._topMiddleBitmap);

            this._topRightBitmap = Bitmap.initWithTexture(texture);
            this._topRightBitmap.spriteFrame = new ns_egret.SpriteSheetFrame();
            this.addChild(this._topRightBitmap);

            this._middleLeftBitmap = Bitmap.initWithTexture(texture);
            this._middleLeftBitmap.spriteFrame = new ns_egret.SpriteSheetFrame();
            this.addChild(this._middleLeftBitmap);

            this._middleMiddleBitmap = Bitmap.initWithTexture(texture);
            this._middleMiddleBitmap.spriteFrame = new ns_egret.SpriteSheetFrame();
            this.addChild(this._middleMiddleBitmap);

            this._middleRightBitmap = Bitmap.initWithTexture(texture);
            this._middleRightBitmap.spriteFrame = new ns_egret.SpriteSheetFrame();
            this.addChild(this._middleRightBitmap);

            this._bottomLeftBitmap = Bitmap.initWithTexture(texture);
            this._bottomLeftBitmap.spriteFrame = new ns_egret.SpriteSheetFrame();
            this.addChild(this._bottomLeftBitmap);

            this._bottomMiddleBitmap = Bitmap.initWithTexture(texture);
            this._bottomMiddleBitmap.spriteFrame = new ns_egret.SpriteSheetFrame();
            this.addChild(this._bottomMiddleBitmap);

            this._bottomRightBitmap = Bitmap.initWithTexture(texture);
            this._bottomRightBitmap.spriteFrame = new ns_egret.SpriteSheetFrame();
            this.addChild(this._bottomRightBitmap);
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

        public updateTransform() {
            if (!this.visible) {
                return;
            }
            var locTexture = this.texture;
            var textureWidth = locTexture.getTextureWidth();
            var textureHeight = locTexture.getTextureHeight();
            var contentWidth = this._scaleWidth;
            var contentHeight = this._scaleHeight;
            if (!locTexture || contentWidth == 0 || contentHeight == 0) {
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
            this._topLeftBitmap.spriteFrame.x = 0;
            this._topLeftBitmap.spriteFrame.y = 0;
            this._topLeftBitmap.spriteFrame.w = this._left;
            this._topLeftBitmap.spriteFrame.h = this._top;

            //中上块
            this._topMiddleBitmap.spriteFrame.x = this._left;
            this._topMiddleBitmap.spriteFrame.y = 0;
            this._topMiddleBitmap.spriteFrame.w = textureHorizontal;
            this._topMiddleBitmap.spriteFrame.h = this._top;
            this.setChildScaleX(this._topMiddleBitmap, contentHorizontal / textureHorizontal);
            this._topMiddleBitmap.x = this._left;

            //右上块
            this._topRightBitmap.spriteFrame.x = textureWidth - this._right;
            this._topRightBitmap.spriteFrame.y = 0;
            this._topRightBitmap.spriteFrame.w = this._right;
            this._topRightBitmap.spriteFrame.h = this._top;
            this._topRightBitmap.x = this._left + contentHorizontal;

            //左中块
            this._middleLeftBitmap.spriteFrame.x = 0;
            this._middleLeftBitmap.spriteFrame.y = this._top;
            this._middleLeftBitmap.spriteFrame.w = this._left;
            this._middleLeftBitmap.spriteFrame.h = textureVertical;
            this.setChildScaleY(this._middleLeftBitmap, contentVertical / textureVertical);
            this._middleLeftBitmap.y = this._top;

            //正中块
            this._middleMiddleBitmap.spriteFrame.x = this._left;
            this._middleMiddleBitmap.spriteFrame.y = this._top;
            this._middleMiddleBitmap.spriteFrame.w = textureHorizontal;
            this._middleMiddleBitmap.spriteFrame.h = textureVertical;
            this.setChildScaleX(this._middleMiddleBitmap, contentHorizontal / textureHorizontal);
            this.setChildScaleY(this._middleMiddleBitmap, contentVertical / textureVertical);
            this._middleMiddleBitmap.x = this._left;
            this._middleMiddleBitmap.y = this._top;

            //右中块
            this._middleRightBitmap.spriteFrame.x = textureWidth - this._right;
            this._middleRightBitmap.spriteFrame.y = this._top;
            this._middleRightBitmap.spriteFrame.w = this._right;
            this._middleRightBitmap.spriteFrame.h = textureVertical;
            this.setChildScaleY(this._middleRightBitmap, contentVertical / textureVertical);
            this._middleRightBitmap.x = this._left + contentHorizontal;
            this._middleRightBitmap.y = this._top;

            //左下块
            this._bottomLeftBitmap.spriteFrame.x = 0;
            this._bottomLeftBitmap.spriteFrame.y = textureHeight - this._bottom;
            this._bottomLeftBitmap.spriteFrame.w = this._left;
            this._bottomLeftBitmap.spriteFrame.h = this._bottom;
            this._bottomLeftBitmap.y = this._top + contentVertical;

            //中下块
            this._bottomMiddleBitmap.spriteFrame.x = this._left;
            this._bottomMiddleBitmap.spriteFrame.y = textureHeight - this._bottom;
            this._bottomMiddleBitmap.spriteFrame.w = textureHorizontal;
            this._bottomMiddleBitmap.spriteFrame.h = this._bottom;
            this.setChildScaleX(this._bottomMiddleBitmap, contentHorizontal / textureHorizontal);
            this._bottomMiddleBitmap.x = this._left;
            this._bottomMiddleBitmap.y = this._top + contentVertical;

            //右下块
            this._bottomRightBitmap.spriteFrame.x = textureWidth - this._right;
            this._bottomRightBitmap.spriteFrame.y = textureHeight - this._bottom;
            this._bottomRightBitmap.spriteFrame.w = this._right;
            this._bottomRightBitmap.spriteFrame.h = this._bottom;
            this._bottomRightBitmap.x = this._left + contentHorizontal;
            this._bottomRightBitmap.y = this._top + contentVertical;
            super.updateTransform();
        }

        private setChildScaleX(child:ns_egret.Bitmap, scaleX:number):void {
            if (scaleX < 0) {
                scaleX = 0;
            }
            child.scaleX = scaleX;
        }

        private setChildScaleY(child:ns_egret.Bitmap, scaleY:number):void {
            if (scaleY < 0) {
                scaleY = 0;
            }
            child.scaleY = scaleY;
        }
    }
}
