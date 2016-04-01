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
     * The egret.WebSocket class enables code to establish a TCP socket connection, for sending and receiving character string or binary data.
     * To use the methods of the egret.WebSocket class, first use the constructor function new egret.WebSocket to create an egret.WebSocket object.
     * The socket transmits and receives data in asynchronous mode.
     * @event egret.Event.CONNECT Successfully connect to the server。
     * @event egret.ProgressEvent.SOCKET_DATA Receiving server data。
     * @event egret.Event.CLOSE Dispatched when the server closes the connection.
     * @event egret.ProgressEvent Dispatched when an IO error causes a send or load operation to fail.
     * @see http://edn.egret.com/cn/index.php/article/index/id/164 WebSocket
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/socket/WebSocket.ts
     */
    /**
     * @language zh_CN
     * egret.WebSocket 类启用代码以建立传输控制协议 (TCP) 套接字连接，用于发送和接收字符串或二进制数据。
     * 要使用 egret.WebSocket 类的方法，请先使用构造函数 new egret.WebSocket 创建一个 egret.WebSocket 对象。
     * 套接字以异步方式传输和接收数据。
     * @event egret.Event.CONNECT 连接服务器成功。
     * @event egret.ProgressEvent.SOCKET_DATA 接收服务器数据。
     * @event egret.Event.CLOSE 在服务器关闭连接时调度。
     * @event egret.IOErrorEvent.IO_ERROR 在出现输入/输出错误并导致发送或加载操作失败时调度。。
     * @see http://edn.egret.com/cn/index.php/article/index/id/164 WebSocket
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/socket/WebSocket.ts
     */
    export class WebSocket extends egret.EventDispatcher {
        /**
         * @language en_US
         * Send and receive data in character string format
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 以字符串格式发送和接收数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static TYPE_STRING:string = "webSocketTypeString";
        /**
         * @language en_US
         * Send and receive data in binary format
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 以二进制格式发送和接收数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static TYPE_BINARY:string = "webSocketTypeBinary";

        /**
         * @private
         */
        private socket:ISocket;

        /**
         * @private
         */
        private _writeMessage:string = "";
        /**
         * @private
         */
        private _readMessage:string = "";

        /**
         * @private
         */
        private _connected:boolean = false;

        /**
         * @language en_US
         * Create an egret.WebSocket object
         * This parameter is reserved for later versions. The connection address and port number are imported in the connect function
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.WebSocket 对象
         * 参数为预留参数，现版本暂不处理，连接地址和端口号在 connect 函数中传入
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(host:string = "", port:number = 0) {
            super();
            this._connected = false;
            this._writeMessage = "";
            this._readMessage = "";

            this.socket = new egret.ISocket();
            this.socket.addCallBacks(this.onConnect, this.onClose, this.onSocketData, this.onError, this);
        }

        /**
         * @language en_US
         * Connect the socket to the specified host and port number
         * @param host Name or IP address of the host to be connected
         * @param port Port number to be connected
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将套接字连接到指定的主机和端口
         * @param host 要连接到的主机的名称或 IP 地址
         * @param port 要连接到的端口号
         * @version Egret 2.4
         * @platform Web,Native
         */
        public connect(host:string, port:number):void {
            this.socket.connect(host, port);
        }

        /**
         * 根据提供的url连接
         * @param url 全地址。如ws://echo.websocket.org:80
         */
        public connectByUrl(url:string):void {
            this.socket.connectByUrl(url);
        }

        /**
         * @language en_US
         * Closesocket
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 关闭套接字
         * @version Egret 2.4
         * @platform Web,Native
         */
        public close():void {
            this.socket.close();
        }

        /**
         * @private
         * 
         */
        private onConnect():void {
            this._connected = true;
            this.dispatchEventWith(egret.Event.CONNECT);
        }

        /**
         * @private
         * 
         */
        private onClose():void {
            this._connected = false;
            this.dispatchEventWith(egret.Event.CLOSE);
        }

        /**
         * @private
         * 
         */
        private onError():void {
            this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
        }

        /**
         * @private
         * 
         * @param message 
         */
        private onSocketData(message:any):void {
            if (typeof message == "string") {
                this._readMessage += message;
            }
            else {
                this._readByte._writeUint8Array(new Uint8Array(message));
            }
            egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.SOCKET_DATA);
        }

        /**
         * @language en_US
         * Refresh all data accumulated in the output buffer area of the socket
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对套接字输出缓冲区中积累的所有数据进行刷新
         * @version Egret 2.4
         * @platform Web,Native
         */
        public flush():void {
            if (!this._connected) {
                egret.$warn(3101);
                return;
            }
            if (this._writeMessage) {
                this.socket.send(this._writeMessage);
                this._writeMessage = "";
            }
            if (this._bytesWrite) {
                this.socket.send(this._writeByte.buffer);
                this._bytesWrite = false;
                this._writeByte.clear();
            }
            this._isReadySend = false;
        }

        /**
         * @private
         */
        private _isReadySend:boolean = false;

        /**
         * @language en_US
         * Write data in character string in the socket
         * @param message The character string to be written in the socket
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将字符串数据写入套接字
         * @param message 要写入套接字的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        public writeUTF(message:string):void {
            if (!this._connected) {
                egret.$warn(3101);
                return;
            }
            if (this._type == WebSocket.TYPE_BINARY) {
                this._bytesWrite = true;
                this._writeByte.writeUTF(message);
            }
            else {
                this._writeMessage += message;
            }

            this.flush();
            return;
            if (this._isReadySend) {
                return;
            }
            this._isReadySend = true;
            egret.callLater(this.flush, this);
        }

        /**
         * @language en_US
         * Read a UTF-8 character string from the socket
         * @returns {string}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从套接字读取一个 UTF-8 字符串
         * @returns {string}
         * @version Egret 2.4
         * @platform Web,Native
         */
        public readUTF():string {
            var message:string;
            if (this._type == WebSocket.TYPE_BINARY) {
                this._readByte.position = 0;
                message = this._readByte.readUTF();
                this._readByte.clear();
            }
            else {
                message = this._readMessage;
                this._readMessage = "";
            }
            return message;
        }

        /**
         * @private
         */
        private _readByte:ByteArray;
        /**
         * @private
         */
        private _writeByte:ByteArray;
        /**
         * @private
         */
        private _bytesWrite:boolean = false;

        /**
         * @language en_US
         * Write a series of bytes from the specified byte array. The writing operation starts from the location expressed by offset.
         * If the length parameter is ignored, the default length 0 indicates that data is written from offset in the entire buffer area.
         * If the offset parameter is ignored, data is written in the entire buffer area.
         * @param bytes The ByteArray object where data is read from
         * @param offset Zero-based offset in the ByteArray object. From here start performing data writing
         * @param length Number of bytes to be written Default value 0 indicates data is written in the entire buffer area from the value specified by the offset parameter
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从指定的字节数组写入一系列字节。写入操作从 offset 指定的位置开始。
         * 如果省略了 length 参数，则默认长度 0 将导致该方法从 offset 开始写入整个缓冲区。
         * 如果还省略了 offset 参数，则写入整个缓冲区。
         * @param bytes 要从中读取数据的 ByteArray 对象
         * @param offset ByteArray 对象中从零开始的偏移量，应由此开始执行数据写入
         * @param length 要写入的字节数。默认值 0 导致从 offset 参数指定的值开始写入整个缓冲区
         * @version Egret 2.4
         * @platform Web,Native
         */
        public writeBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void {
            if (!this._connected) {
                egret.$warn(3101);
                return;
            }
            if (!this._writeByte) {
                egret.$warn(3102);
                return;
            }
            this._bytesWrite = true;
            this._writeByte.writeBytes(bytes, offset, length);
            this.flush();
        }

        /**
         * @language en_US
         * Read data byte number specified by the length parameter from the socket. Read these bytes into the specified byte array starting from the location expressed by offset.
         * @param bytes The ByteArray object that data is read into
         * @param offset The offset for data reading starts from this byte array
         * @param length Byte number to be read Default value 0 indicates reading all available data
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从套接字读取 length 参数指定的数据字节数。从 offset 所表示的位置开始，将这些字节读入指定的字节数组
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset 数据读取的偏移量应从该字节数组中开始
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        public readBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void {
            if (!this._readByte) {
                egret.$warn(3102);
                return;
            }
            this._readByte.position = 0;
            this._readByte.readBytes(bytes, offset, length);
            this._readByte.clear();
        }

        /**
         * @language en_US
         * Indicates whether the Socket object is connected currently
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示此 Socket 对象目前是否已连接
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get connected():boolean {
            return this._connected;
        }

        /**
         * @private
         */
        private _type:string = WebSocket.TYPE_STRING;

        /**
         * @language en_US
         * Format for sending and receiving data. The default setting is the character string format
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 发送和接收数据的格式，默认是字符串格式
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get type():string {
            return this._type;
        }

        public set type(value:string) {
            this._type = value;
            if (value == WebSocket.TYPE_BINARY && !this._writeByte) {
                this._readByte = new ByteArray();
                this._writeByte = new ByteArray();
            }
        }
    }
}
