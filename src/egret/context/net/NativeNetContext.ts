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

/// <reference path="NetContext.ts"/>
/// <reference path="../../net/URLLoader.ts"/>
/// <reference path="../../texture/TextureCache.ts"/>
/// <reference path="../../utils/callLater.ts"/>

module ns_egret {

    export class NativeNetContext extends NetContext {

        public constructor() {
            super();
        }


        /**
         * @method ns_egret.HTML5NetContext#send
         * @param request {URLReques}
         */
        public send(request:URLRequest) {

            function onLoadComplete() {
                var content = egret_native.readFileSync(request.url);
                ns_egret.TextureCache.getInstance().addTextData(request.url, content);
                request.callback.call(request.thisObj, content);
            }

            if (request.type == URLLoader.DATA_TYPE_IMAGE) {
                this.loadImage(request);
                return;
            }

            callLater(onLoadComplete, this)

        }

        private loadImage(request:ns_egret.URLRequest):void {

            function onLoadComplete() {
                var _texture = egret_native.EGTTextureCatche.addTexture(request.url);
                ns_egret.TextureCache.getInstance().addTexture(request.url, _texture);
                request.callback.call(request.thisObj, _texture);

            };


            callLater(onLoadComplete, this);
        }
    }


}