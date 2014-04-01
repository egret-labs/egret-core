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
/// <reference path="../../core/EventDispatcher.ts"/>
module ns_egret {
    export class NetContext {
        public static STATE_COMPLETE:string = "XHRLoaderComplete";
        public static GET:string = "GET";
        public static POST:string = "POST";
        public static context:NetContext = null;

        public static getInstance():ns_egret.NetContext {
            if (NetContext.context == null) {
                NetContext.context = new NetContext();
            }
            return NetContext.context;
        }

        public send(request:URLRequest) {
        }
    }

    export class URLRequest {
        public type:string;

        constructor(public url:string, public callback, public thisObj, public method:string = NetContext.GET, public data = undefined) {

        }
    }
}
