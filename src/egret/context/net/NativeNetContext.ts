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
/// <reference path="../../events/Event.ts"/>
/// <reference path="../../net/URLLoader.ts"/>
/// <reference path="../../net/URLLoaderDataFormat.ts"/>
/// <reference path="../../net/URLRequest.ts"/>
/// <reference path="../../utils/callLater.ts"/>

module ns_egret {

    export class NativeNetContext extends NetContext {

        public constructor() {
            super();
        }


        /**
         * @method ns_egret.HTML5NetContext#proceed
         * @param loader {URLLoader}
         */
        public proceed(loader:URLLoader):void{

            if (loader.dataFormat == URLLoaderDataFormat.TEXTURE) {
                this.loadTexture(loader);
                return;
            }

            callLater(onLoadComplete, this);

            function onLoadComplete() {
                var request:URLRequest = loader._request;
                var content = egret_native.readFileSync(request.url);
                loader.data = content;
                Event.dispatchEvent(loader,Event.COMPLETE);
            };
        }

        private loadTexture(loader:URLLoader):void {

            callLater(onLoadComplete, this);

            function onLoadComplete() {
                var request:URLRequest = loader._request;
                var texture = egret_native.EGTTextureCatche.addTexture(request.url);
                loader.data = texture;
                Event.dispatchEvent(loader,Event.COMPLETE);
            };
        }
    }


}