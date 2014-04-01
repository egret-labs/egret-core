///<reference path="../../../egret/display/DisplayObjectContainer.ts"/>
///<reference path="../../../egret/display/Bitmap.ts"/>
///<reference path="../../../egret/texture/TextureCache.ts"/>
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
module ns_egret{
    export class ProgressBar extends DisplayObjectContainer{
        private _bg:Bitmap;
        private _bar:Bitmap;
        private _barWidth:number;

        private _percentage;

        /**
         * 百分比  0 - 100
         * @returns {*}
         */
        public get percentage():number {
            return this._percentage;
        }

        public set percentage(value:number) {
            this._percentage = value;

            this.setProgress(this._percentage, 100);
        }

        constructor(barTextureName:string, bgTextureName:string = "") {
            super();
            if(bgTextureName != "")
            {
                this._bg = Bitmap.initWithTexture(TextureCache.getInstance().getTexture(bgTextureName));
                this.addChild(this._bg);
            }
            var texture = TextureCache.getInstance().getTexture(barTextureName);
            this._barWidth = texture.getTextureWidth();
            this._bar = Bitmap.initWithTexture(texture);
            this.addChild(this._bar);
            var mask:any = {x:0, y:0, width:this._barWidth, height:texture.getTextureHeight()};
            this._bar.mask = mask;
        }

        public setOffset(x:number, y:number):void{
            this._bar.x = x;
            this._bar.y = y;
        }

        public setProgress(current:number, total:number):void{
            this._percentage = current / total * 100;
            this._bar.mask.width = this._barWidth * current / total;
        }
    }
}