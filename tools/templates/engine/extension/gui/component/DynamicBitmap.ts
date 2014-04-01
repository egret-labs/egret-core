/// <reference path="../../../egret/display/Bitmap.ts"/>
/// <reference path="../../../egret/resource/ResourceLoader.ts"/>
/// <reference path="../../../egret/texture/TextureCache.ts"/>
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
    export class DynamicBitmap extends Bitmap{
        private _src:string;
        private _onLoadComplete:Function;
        private _onLoadCompleteThisObj:Function;
        private _resource:ResourceLoader;

        public static create(src:string, onLoadComplete:Function = null, onLoadCompleteThisObj = null){
            var result = new DynamicBitmap();
            result.startLoad(src, onLoadComplete, onLoadCompleteThisObj);
            return result;
        }

        public startLoad(src, onLoadComplete, onLoadCompleteThisObj){
            this._src = src;
            this._onLoadComplete = onLoadComplete;
            this._onLoadCompleteThisObj = onLoadCompleteThisObj;
            this._resource = ResourceLoader.create(src,ResourceLoader.DATA_TYPE_IMAGE);
            this._resource.addEventListener(ns_egret.ResourceLoader.LOAD_COMPLETE, this.resourceLoadComplete, this);
            this._resource.load();
        }

        private resourceLoadComplete(){
            this._resource.removeEventListener(ns_egret.ResourceLoader.LOAD_COMPLETE, this.resourceLoadComplete, this);
            this._resource = null;
            this.texture = TextureCache.getInstance().getTexture(this._src);
            if(this._onLoadComplete)
            {
                this._onLoadComplete.call(this._onLoadCompleteThisObj);
                this._onLoadComplete = null;
                this._onLoadCompleteThisObj = null;
            }
        }

        public _measureBounds(){
            if(!this.texture)
            {
                return Rectangle.identity.initialize(0, 0, 0, 0);
            }
            else
            {
                return super._measureBounds();
            }
        }
    }
}