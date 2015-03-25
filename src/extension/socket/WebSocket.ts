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
module egret {
    /**
     * @class egret.WebSocket
     * @classdesc
     * egret.WebSocket 类启用代码以建立传输控制协议 (TCP) 套接字连接，用于发送和接收字符串或二进制数据。
     * 要使用 egret.WebSocket 类的方法，请先使用构造函数 new egret.WebSocket 创建一个 egret.WebSocket 对象。
     * 套接字以异步方式传输和接收数据。
     * @link http://docs.egret-labs.org/jkdoc/manual-net-websocket.html WebSocket
     */
    export class WebSocket extends egret.EventDispatcher {
        /**
         * 以字符串格式发送和接收数据
         */
        public static TYPE_STRING:string = "webSocketTypeString";
        /**
         * 以二进制格式发送和接收数据
         */
        public static TYPE_BINARY:string = "webSocketTypeBinary";

        private socket:ISocket;

        private _writeMessage:string = "";
        private _readMessage:string = "";

        private _connected:boolean = false;

        /**
         * 创建一个 egret.WebSocket 对象
         * 参数为预留参数，现版本暂不处理，连接地址和端口号在 connect 函数中传入
         */
        constructor(host:string = "", port:number = 0) {
            super();
            this._connected = false;
            this._writeMessage = "";
            this._readMessage = "";

            if (MainContext.runtimeType == MainContext.RUNTIME_HTML5) {
                this.socket = new HTML5WebSocket();
            }
            else {
                this.socket = new NativeSocket();
            }
            this.socket.addCallBacks(this.onConnect, this.onClose, this.onSocketData, this.onError, this);
        }

        /**
         * 将套接字连接到指定的主机和端口
         * @param host 要连接到的主机的名称或 IP 地址
         * @param port 要连接到的端口号
         * @method egret.WebSocket#connect
         */
        public connect(host:string, port:number):void {
            this.socket.connect(host, port);
        }

        /**
         * 关闭套接字
         * @method egret.WebSocket#close
         */
        public close():void {
            this.socket.close();
        }

        private onConnect():void {
            this._connected = true;
            this.dispatchEventWith(egret.Event.CONNECT);
        }

        private onClose():void {
            this._connected = false;
            this.dispatchEventWith(egret.Event.CLOSE);
        }

        private onError():void {
            this.dispatchEventWith(egret.IOErrorEvent.IO_ERROR);
        }

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
         * 对套接字输出缓冲区中积累的所有数据进行刷新
         * @method egret.WebSocket#flush
         */
        public flush():void {
            if (!this._connected) {
                egret.Logger.warningWithErrorId(3101);
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

        private _isReadySend:boolean = false;

        /**
         * 将字符串数据写入套接字
         * @param message 要写入套接字的字符串
         * @method egret.WebSocket#writeUTF
         */
        public writeUTF(message:string):void {
            if (!this._connected) {
                egret.Logger.warningWithErrorId(3101);
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
         * 从套接字读取一个 UTF-8 字符串
         * @returns {string}
         * @method egret.WebSocket#readUTF
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

        private _readByte:ByteArray;
        private _writeByte:ByteArray;
        private _bytesWrite:boolean = false;

        /**
         * 从指定的字节数组写入一系列字节。写入操作从 offset 指定的位置开始。
         * 如果省略了 length 参数，则默认长度 0 将导致该方法从 offset 开始写入整个缓冲区。
         * 如果还省略了 offset 参数，则写入整个缓冲区。
         * @param bytes 要从中读取数据的 ByteArray 对象
         * @param offset ByteArray 对象中从零开始的偏移量，应由此开始执行数据写入
         * @param length 要写入的字节数。默认值 0 导致从 offset 参数指定的值开始写入整个缓冲区
         * @method egret.WebSocket#writeBytes
         */
        public writeBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void {
            if (!this._connected) {
                egret.Logger.warningWithErrorId(3101);
                return;
            }
            if (!this._writeByte) {
                egret.Logger.warningWithErrorId(3102);
                return;
            }
            this._bytesWrite = true;
            this._writeByte.writeBytes(bytes, offset, length);
            this.flush();
        }

        /**
         * 从套接字读取 length 参数指定的数据字节数。从 offset 所表示的位置开始，将这些字节读入指定的字节数组
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset 数据读取的偏移量应从该字节数组中开始
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @method egret.WebSocket#readBytes
         */
        public readBytes(bytes:ByteArray, offset:number = 0, length:number = 0):void {
            if (!this._readByte) {
                egret.Logger.warningWithErrorId(3102);
                return;
            }
            this._readByte.position = 0;
            this._readByte.readBytes(bytes, offset, length);
            this._readByte.clear();
        }

        /**
         * 表示此 Socket 对象目前是否已连接
         */
        public get connected():boolean {
            return this._connected;
        }

        private _type:string = WebSocket.TYPE_STRING;

        public get type():string {
            return this._type;
        }

        /**
         * 发送和接收数据的格式，默认是字符串格式
         */
        public set type(value:string) {
            this._type = value;
            if (value == WebSocket.TYPE_BINARY && !this._writeByte) {
                this._readByte = new ByteArray();
                this._writeByte = new ByteArray();
            }
        }
    }
}