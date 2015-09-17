//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module egret {

	/**
     * @language en_US
     * UThe URLLoader class downloads data from a URL as text, binary data, or URL-encoded variables.  It is useful for downloading text files, XML, or other information to be used in a dynamic, data-driven application.
     * A URLLoader object downloads all of the data from a URL before making it available to code in the applications. It sends out notifications about the progress of the download,
     * which you can monitor through bytesLoaded and bytesTotal properties, as well as through dispatched events.
     * @see http://docs.egret-labs.org/post/manual/net/createconnect.html Build communication request
     * @event egret.Event.COMPLETE Dispatched when the net request is complete.
     * @event egret.IOErrorEvent.IO_ERROR io error. 
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLLoader.ts
	 */
	/**
     * @language zh_CN
     * URLLoader 类以文本、二进制数据或 URL 编码变量的形式从 URL 下载数据。在下载文本文件、XML 或其他用于动态数据驱动应用程序的信息时，它很有用。
     * URLLoader 对象会先从 URL 中下载所有数据，然后才将数据用于应用程序中的代码。它会发出有关下载进度的通知，
     * 通过 bytesLoaded 和 bytesTotal 属性以及已调度的事件，可以监视下载进度。
     * @see http://docs.egret-labs.org/post/manual/net/createconnect.html 构建通信请求
     * @event egret.Event.COMPLETE 加载完成后调度。 
     * @event egret.IOErrorEvent.IO_ERROR 加载错误后调度。 
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLLoader.ts
	 */
    export class URLLoader extends EventDispatcher {

		/**
         * @language en_US
         * Create an egret.URLLoader object
		 * @param request {URLRequest} A URLRequest object specifies the URL to be downloaded.
         * If this parameter is omitted, no load operation begins. If a parameter is specified, the load operation begins immediately
         * @version Egret 2.4
         * @platform Web,Native
		 */
		/**
         * @language zh_CN
         * 创建 egret.URLLoader 对象
		 * @param request {URLRequest} 一个 URLRequest 对象，指定要下载的 URL。
         * 如果省略该参数，则不开始加载操作。如果已指定参数，则立即开始加载操作
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public constructor(request:URLRequest=null) {
            super();
            if(request){
                this.load(request);
            }
        }

		/**
         * @language en_US
         * Control whether the downloaded data is received as text (URLLoaderDataFormat.TEXT), raw binary data (URLLoaderDataFormat.BINARY), or URL-encoded variables (URLLoaderDataFormat.VARIABLES).
         * If the value of the dataFormat property is URLLoaderDataFormat.TEXT, the received data is a string containing the text of the loaded file.
         * If the value of the dataFormat property is URLLoaderDataFormat.BINARY, the received data is a ByteArray object containing the raw binary data.
         * If the value of the dataFormat property is URLLoaderDataFormat.TEXTURE, the received data is a Texture object containing the bitmap data.
         * If the value of the dataFormat property is URLLoaderDataFormat.VARIABLES, the received data is a URLVariables object containing the URL-encoded variables.
         * The default value is URLLoaderDataFormat.TEXT.
         * @default egret.URLLoaderDataFormat.TEXT
         * @version Egret 2.4
         * @platform Web,Native
		 */
        /**
         * @language zh_CN
         * 控制是以文本 (URLLoaderDataFormat.TEXT)、原始二进制数据 (URLLoaderDataFormat.BINARY) 还是 URL 编码变量 (URLLoaderDataFormat.VARIABLES) 接收下载的数据。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
         * @default egret.URLLoaderDataFormat.TEXT
         * @version Egret 2.4
         * @platform Web,Native
         */
        public dataFormat:string = URLLoaderDataFormat.TEXT;

		/**
         * @language en_US
         * The data received from the load operation. This property is populated only when the load operation is complete. The format of the data depends on the setting of the dataFormat property:
         * If the dataFormat property is URLLoaderDataFormat.TEXT, the received data is a string containing the text of the loaded file.
         * If the dataFormat property is URLLoaderDataFormat.BINARY, the received data is a ByteArray object containing the raw binary data.
         * If the dataFormat property is URLLoaderDataFormat.TEXTURE, the received data is a Texture object containing the bitmap data.
         * If the dataFormat property is URLLoaderDataFormat.VARIABLES, the received data is a URLVariables object containing the URL-encoded variables.
         * @version Egret 2.4
         * @platform Web,Native
		 */
		/**
         * @language zh_CN
         * 从加载操作接收的数据。只有完成加载操作时，才会填充该属性。该数据的格式取决于 dataFormat 属性的设置：
         * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public data:any = null;

        /**
         * @private
         */
        public _request:URLRequest = null;

		/**
         * @language en_US
         * Send and load data from the specified URL. The data can be received as text, raw binary data, or URL-encoded variables, depending on the value you set for the dataFormat property.
         * Note that the default value of the dataFormat property is text. If you want to send data to the specified URL, you can set the data property in the URLRequest object.
         * @param request {URLRequest}  A URLRequest object specifies the URL to be downloaded.
         * @version Egret 2.4
         * @platform Web,Native
         */
		/**
         * @language zh_CN
         * 从指定的 URL 发送和加载数据。可以以文本、原始二进制数据或 URL 编码变量格式接收数据，这取决于为 dataFormat 属性所设置的值。
         * 请注意 dataFormat 属性的默认值为文本。如果想将数据发送至指定的 URL，则可以在 URLRequest 对象中设置 data 属性。
		 * @param request {URLRequest}  一个 URLRequest 对象，指定要下载的 URL。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public load(request:URLRequest):void {
            this._request = request;
            this.data = null;

            egret.NetContext.getNetContext().proceed(this);
        }

        /**
         * @private
         */
        public _status:number = -1;


        /**
         * @private
         * 
         */
        public __recycle():void {
            this._request = null;
            this.data = null;
        }

    }


}