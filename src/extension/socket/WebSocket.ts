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
    export class WebSocket extends egret.EventDispatcher {
        private socket:ISocket;

        private _writeMessage:string = "";
        private _readMessage:string = "";

        private _connected:boolean = false;

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

        private onSocketData(message:string):void {
            this._readMessage += message;

            egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.SOCKET_DATA);
        }

        /**
         * 对套接字输出缓冲区中积累的所有数据进行刷新
         * @method egret.WebSocket#flush
         */
        public flush():void {
            if (!this._connected) {
                egret.Logger.warning("请先连接Socket");
                return;
            }
            this.socket.send(this._writeMessage);
            this._writeMessage = "";
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
                egret.Logger.warning("请先连接Socket");
                return;
            }
            this._writeMessage += message;

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
            var message:string = this._readMessage;
            this._readMessage = "";
            return message;
        }

        /**
         * [只读] 表示此 Socket 对象目前是否已连接
         */
        public get connected():boolean {
            return this._connected;
        }
    }
}