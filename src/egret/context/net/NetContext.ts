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

/// <reference path="../../core/HashObject.ts"/>
/// <reference path="../../core/MainContext.ts"/>

module ns_egret {
	/**
	 * @class ns_egret.NetContext
	 * @classdesc
	 * @extends ns_egret.HashObject
	 */
    export class NetContext extends HashObject{
		/**
		 * @constant ns_egret.NetContext.STATE_COMPLETE
		 */
        public static STATE_COMPLETE:string = "XHRLoaderComplete";
		/**
		 * @constant ns_egret.NetContext.GET
		 */
        public static GET:string = "GET";
		/**
		 * @constant ns_egret.NetContext.POST
		 */
        public static POST:string = "POST";

		/**
		 * @method ns_egret.NetContext#constructor
		 */
        public constructor(){
            super();
        }

		/**
		 * @method ns_egret.NetContext.getInstance
		 * @returns {NetContext}
		 */
        public static getInstance():ns_egret.NetContext {
            return ns_egret.MainContext.instance.netContext;
        }

		/**
		 * @method ns_egret.NetContext#send
		 * @param request {URLReques} 
		 */
        public send(request:URLRequest) {
        }
    }

	/**
	 * @class ns_egret.URLRequest
	 * @classdesc
	 */
    export class URLRequest {
		/**
		 * @member ns_egret.URLRequest#type
		 */
        public type:string;


		/**
		 * @member ns_egret.URLRequest#prefix
		 */
        public prefix:string = "";

		/**
		 * @method ns_egret.URLRequest#constructor
		 * @param public url {string} 
		 * @param public callback {any} 
		 * @param public thisObj {any} 
		 * @param public method {string} 
		 * @param public data {any} 
		 */
        constructor(public url:string, public callback, public thisObj, public method:string = NetContext.GET, public data = undefined) {

        }
    }
}