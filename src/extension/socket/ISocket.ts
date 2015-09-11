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
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export interface ISocket {
        /**
         * @language en_US
         * 连接
         * @method egret.ISocket#connect
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 连接
         * @method egret.ISocket#connect
         * @version Egret 2.4
         * @platform Web,Native
         */
        connect(host:string, port:number):void;

        /**
         * 连接
         * @method egret.ISocket#connect
         */
        connectByUrl(url:string):void;

        /**
         * @language en_US
         * 
         * @param onConnect 
         * @param onClose 
         * @param onSocketData 
         * @param onError 
         * @param thisObject 
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 
         * @param onConnect 
         * @param onClose 
         * @param onSocketData 
         * @param onError 
         * @param thisObject 
         * @version Egret 2.4
         * @platform Web,Native
         */
        addCallBacks(onConnect:Function, onClose:Function, onSocketData:Function, onError:Function, thisObject:any):void;

        /**
         * @language en_US
         * 
         * @param message 
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 
         * @param message 
         * @version Egret 2.4
         * @platform Web,Native
         */
        send(message:any):void;

        /**
         * @language en_US
         * 
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 
         * @version Egret 2.4
         * @platform Web,Native
         */
        close():void;
    }

    /**
     * @language en_US
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * @version Egret 2.4
     * @platform Web,Native
     */
    export var ISocket:{new():ISocket};

}