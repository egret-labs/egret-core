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

        private _connect:boolean =false;
        constructor(host:string = "", port:number = 0) {
            super();
            this._connect = false;
            this._writeMessage = "";
            this._readMessage = "";

            if (MainContext.runtimeType == MainContext.RUNTIME_HTML5) {
                this.socket = new HTML5WebSocket();
            }
            else {
                this.socket = new NativeSocket();
            }
            this.socket.addCallBacks(this.onConnect, this.onClose, this.onSocketData, this);
        }

        public connect(host:string, port:number):void {
            this.socket.connect(host, port);
        }

        private onConnect():void {
            this._connect = true;
            this.dispatchEventWith(egret.Event.CONNECT);
        }

        private onClose():void {
            this.dispatchEventWith(egret.Event.CLOSE);
        }

        private onSocketData(message:string):void {
            this._readMessage += message;

            egret.ProgressEvent.dispatchProgressEvent(this, egret.ProgressEvent.SOCKET_DATA);
        }


        public flush():void {
            if (!this._connect) {
                egret.Logger.warning("请先连接Socket");
                return;
            }
            this.socket.send(this._writeMessage);
            this._writeMessage = "";
            this._isReadSend = false;
        }

        private _isReadSend:boolean = false;
        public writeUTF(message:string):void {
            if (!this._connect) {
                egret.Logger.warning("请先连接Socket");
                return;
            }
            this._writeMessage += message;

            if (this._isReadSend) {
                return;
            }
            this._isReadSend = true;
            egret.callLater(this.flush, this);
        }

        public readUTF():string {
            var message:string = this._readMessage;
            this._readMessage = "";
            return message;
        }

        public get connected():boolean {
            return this._connect;
        }
    }
}