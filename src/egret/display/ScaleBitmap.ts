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

/// <reference path="Bitmap.ts"/>
/// <reference path="DisplayObjectContainer.ts"/>
/// <reference path="SpriteSheet.ts"/>
/// <reference path="Texture.ts"/>
/// <reference path="../utils/Logger.ts"/>
/// <reference path="../../jslib/DEBUG.d.ts"/>

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

        public spriteFrame:SpriteSheetFrame;

        constructor(private texture:Texture) {
            super();
            this._top = this._bottom = this._left = this._right = this._defaultPadding;

            this._topLeftBitmap = this._createBitmap();
            this._topMiddleBitmap = this._createBitmap();
            this._topRightBitmap = this._createBitmap();
            this._middleLeftBitmap = this._createBitmap();
            this._middleMiddleBitmap = this._createBitmap();
            this._middleRightBitmap = this._createBitmap();
            this._bottomLeftBitmap = this._createBitmap();
            this._bottomMiddleBitmap = this._createBitmap();
            this._bottomRightBitmap = this._createBitmap();
        }

        private _createBitmap():Bitmap {
            var bitmap = new Bitmap();
            bitmap.texture = this.texture;
            bitmap.spriteFrame = new ns_egret.SpriteSheetFrame();
            this.addChild(bitmap);
            return bitmap;
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

        public set width(value:number) {
            this._explicitWidth = value;
            if (value > 0 && !isNaN(value)) {
                this._scaleWidth = value;
            }
        }

        public set height(value:number) {
            this._explicitHeight = value;
            if (value > 0 && !isNaN(value)) {
                this._scaleHeight = value;
            }
        }

        public _updateTransform():void {
            if (!this.visible) {
                return;
            }
            var locTexture = this.texture;
            var textureWidth;
            var textureHeight;
            if (this.spriteFrame) {
                textureWidth = this.spriteFrame.w;
                textureHeight = this.spriteFrame.h;
            }
            else {
                textureWidth = locTexture._textureWidth;
                textureHeight = locTexture._textureHeight;
            }
            var offsetX = this.spriteFrame ? this.spriteFrame.x : 0;
            var offsetY = this.spriteFrame ? this.spriteFrame.y : 0;


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
            this._topLeftBitmap.spriteFrame.x = 0 + offsetX;
            this._topLeftBitmap.spriteFrame.y = 0 + offsetY;
            this._topLeftBitmap.spriteFrame.w = this._left;
            this._topLeftBitmap.spriteFrame.h = this._top;

            //中上块
            this._topMiddleBitmap.spriteFrame.x = this._left + offsetX;
            this._topMiddleBitmap.spriteFrame.y = 0 + offsetY;
            this._topMiddleBitmap.spriteFrame.w = textureHorizontal;
            this._topMiddleBitmap.spriteFrame.h = this._top;
            this.setChildScaleX(this._topMiddleBitmap, contentHorizontal / textureHorizontal);
            this._topMiddleBitmap.x = this._left;

            //右上块
            this._topRightBitmap.spriteFrame.x = textureWidth - this._right + offsetX;
            this._topRightBitmap.spriteFrame.y = 0 + offsetY;
            this._topRightBitmap.spriteFrame.w = this._right;
            this._topRightBitmap.spriteFrame.h = this._top;
            this._topRightBitmap.x = this._left + contentHorizontal;

            //左中块
            this._middleLeftBitmap.spriteFrame.x = 0 + offsetX;
            this._middleLeftBitmap.spriteFrame.y = this._top + offsetY;
            this._middleLeftBitmap.spriteFrame.w = this._left;
            this._middleLeftBitmap.spriteFrame.h = textureVertical;
            this.setChildScaleY(this._middleLeftBitmap, contentVertical / textureVertical);
            this._middleLeftBitmap.y = this._top;

            //正中块
            this._middleMiddleBitmap.spriteFrame.x = this._left + offsetX;
            this._middleMiddleBitmap.spriteFrame.y = this._top + offsetY;
            this._middleMiddleBitmap.spriteFrame.w = textureHorizontal;
            this._middleMiddleBitmap.spriteFrame.h = textureVertical;
            this.setChildScaleX(this._middleMiddleBitmap, contentHorizontal / textureHorizontal);
            this.setChildScaleY(this._middleMiddleBitmap, contentVertical / textureVertical);
            this._middleMiddleBitmap.x = this._left;
            this._middleMiddleBitmap.y = this._top;

            //右中块
            this._middleRightBitmap.spriteFrame.x = textureWidth - this._right + offsetX;
            this._middleRightBitmap.spriteFrame.y = this._top + offsetY;
            this._middleRightBitmap.spriteFrame.w = this._right;
            this._middleRightBitmap.spriteFrame.h = textureVertical;
            this.setChildScaleY(this._middleRightBitmap, contentVertical / textureVertical);
            this._middleRightBitmap.x = this._left + contentHorizontal;
            this._middleRightBitmap.y = this._top;

            //左下块
            this._bottomLeftBitmap.spriteFrame.x = 0 + offsetX;
            this._bottomLeftBitmap.spriteFrame.y = textureHeight - this._bottom + offsetY;
            this._bottomLeftBitmap.spriteFrame.w = this._left;
            this._bottomLeftBitmap.spriteFrame.h = this._bottom;
            this._bottomLeftBitmap.y = this._top + contentVertical;

            //中下块
            this._bottomMiddleBitmap.spriteFrame.x = this._left + offsetX;
            this._bottomMiddleBitmap.spriteFrame.y = textureHeight - this._bottom + offsetY;
            this._bottomMiddleBitmap.spriteFrame.w = textureHorizontal;
            this._bottomMiddleBitmap.spriteFrame.h = this._bottom;
            this.setChildScaleX(this._bottomMiddleBitmap, contentHorizontal / textureHorizontal);
            this._bottomMiddleBitmap.x = this._left;
            this._bottomMiddleBitmap.y = this._top + contentVertical;

            //右下块
            this._bottomRightBitmap.spriteFrame.x = textureWidth - this._right + offsetX;
            this._bottomRightBitmap.spriteFrame.y = textureHeight - this._bottom + offsetY;
            this._bottomRightBitmap.spriteFrame.w = this._right;
            this._bottomRightBitmap.spriteFrame.h = this._bottom;
            this._bottomRightBitmap.x = this._left + contentHorizontal;
            this._bottomRightBitmap.y = this._top + contentVertical;
            super._updateTransform();
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