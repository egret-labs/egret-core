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

/// <reference path="../context/net/NetContext.ts"/>
/// <reference path="../core/MainContext.ts"/>
/// <reference path="../events/Event.ts"/>
/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="../texture/TextureCache.ts"/>
/// <reference path="../utils/callLater.ts"/>

module ns_egret {


	/**
	 * @class ns_egret.URLLoader
	 * @classdesc
     * URLLoader 类以文本、二进制数据或 URL 编码变量的形式从 URL 下载数据。在下载文本文件、XML 或其他用于动态数据驱动应用程序的信息时，它很有用。
     * URLLoader 对象会先从 URL 中下载所有数据，然后才将数据用于应用程序中的代码。它会发出有关下载进度的通知，
     * 通过 bytesLoaded 和 bytesTotal 属性以及已调度的事件，可以监视下载进度。
	 * @extends ns_egret.EventDispatcher
	 */
    export class URLLoader extends EventDispatcher {

        private static netContextClass:any;
		/**
		 * @method ns_egret.URLLoader#constructor
		 * @param request {URLRequest} 一个 URLRequest 对象，指定要下载的 URL。
         * 如果省略该参数，则不开始加载操作。如果已指定参数，则立即开始加载操作
		 */
        public constructor(request:URLRequest=null) {
            super();
            if(!URLLoader.netContextClass){
                URLLoader.netContextClass = Injector.getInstance("ns_egret.NetContext");
            }
            var contextClass:any = URLLoader.netContextClass;
            this.netContext = <NetContext> new contextClass(this);
            if(request){
                this.load(request);
            }
        }

        private netContext:NetContext;

		/**
         * 控制是以文本 (URLLoaderDataFormat.TEXT)、原始二进制数据 (URLLoaderDataFormat.BINARY) 还是 URL 编码变量 (URLLoaderDataFormat.VARIABLES) 接收下载的数据。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.IMAGE，则所接收的数据是一个包含位图数据的Texture对象。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
         * 默认值:URLLoaderDataFormat.TEXT
		 * @member {string} ns_egret.URLLoader#dataFormat
		 */
        public dataFormat:string = URLLoaderDataFormat.TEXT;

		/**
         * 从加载操作接收的数据。只有完成加载操作时，才会填充该属性。该数据的格式取决于 dataFormat 属性的设置：
         * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.IMAGE，则所接收的数据是一个包含位图数据的Texture对象。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
		 * @member {any} ns_egret.URLLoader#data
		 */
        public get data():any{
            return this.netContext.data;
        }

        /**
         * 表示所下载数据中的字节总数。正在进行加载操作时该属性为 0，完成操作时会填充该属性。另外，丢失的 Content-Length 标题将会导致 bytesTotal 不确定。
		 * @member {number} ns_egret.URLLoader#bytesTotal
         */
        public get bytesTotal():number{
            return this.netContext.bytesTotal;
        }

        /**
         * 表示加载操作期间到目前为止加载的字节数。
		 * @member {number} ns_egret.URLLoader#bytesLoaded
         */
        public get bytesLoaded():number{
            return this.netContext.bytesLoaded;
        }

		/**
         * 从指定的 URL 发送和加载数据。可以以文本、原始二进制数据或 URL 编码变量格式接收数据，这取决于为 dataFormat 属性所设置的值。
         * 请注意 dataFormat 属性的默认值为文本。如果想将数据发送至指定的 URL，则可以在 URLRequest 对象中设置 data 属性。
		 * @method ns_egret.URLLoader#load
		 * @param request {URLRequest} 
		 */
        public load(request:URLRequest):void {
            this.netContext.load(request,this.dataFormat);
        }
        /**
         * 关闭进行中的加载操作。任何正在进行中的加载操作将立即终止。
		 * @method ns_egret.URLLoader#close
         */
        public close():void{
            this.netContext.close();
        }
    }


}