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
    export class HTML5WebSocket extends EventDispatcher implements ISocket {
        private socket;

        constructor(private host:string, private port:string) {
            super();
            if (!window["WebSocket"]) {
                egret.Logger.fatal("当前浏览器不支持WebSocket");
            }
        }

        public connect():void {
            var socketServerUrl = "ws://" + this.host + ":" + this.port;
            this.socket = new window["WebSocket"](socketServerUrl);
            this._bindEvent();
        }

        private _bindEvent():void {
            var that = this;
            var socket = this.socket;
            socket.onopen = function () {
                that.dispatchEventWith(SocketEventType.OPEN);
            };
            socket.onclose = function () {
                this.dispatchEventWith(SocketEventType.CLOSE);
            };
            socket.onmessage = function (e) {
                that.dispatchEventWith(SocketEventType.MESSAGE, false, e.data);
            };
        }

        public send(message:string):void {
            if(!this.socket) {
                egret.Logger.warning("请先连接Socket");
                return;
            }
            if(this.socket.readyState == 1){
                this.socket.send(message);
            }
            else {
                egret.Logger.warning("Socket连接断开");
            }
        }

        public close():void {
            if(!this.socket) {
                egret.Logger.warning("请先连接Socket");
                return;
            }
            this.socket.close();
        }
    }
}