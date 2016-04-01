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
     * When a network request returns an HTTP status code, the application dispatches HTTPStatusEvent objects.
     * Before error or completion events will always send HTTPStatusEvent object. HTTPStatusEvent object does not necessarily indicate an error condition; it simply reflects the HTTP status code provided by the network stack (if any).
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 在网络请求返回 HTTP 状态代码时，应用程序将调度 HTTPStatusEvent 对象。
     * 在错误或完成事件之前，将始终发送 HTTPStatusEvent 对象。HTTPStatusEvent 对象不一定表示错误条件；它仅反映网络堆栈提供的 HTTP 状态代码（如果有的话）。
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class HTTPStatusEvent extends Event {

        /**
         * @language en_US
         * HTTPStatusEvent.HTTP_STATUS constant defines the value of the type property httpStatus event object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * HTTPStatusEvent.HTTP_STATUS 常量定义 httpStatus 事件对象的 type 属性值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static HTTP_STATUS:string = "httpStatus";

        /**
         * @language en_US
         * Create a egret.HTTPStatusEvent objects
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.HTTPStatusEvent 对象
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
            super(type, bubbles, cancelable);
        }

        /**
         * @private
         */
        private _status:number = 0;
        /**
         * @language en_US
         * he server returns the HTTP status code.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由服务器返回的 HTTP 状态代码。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get status():number {
            return this._status;
        }

        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown Event. The objects will be thrown in the object cache pool for the next round robin.
         * @param target {egret.IEventDispatcher} Distribute event target
         * @param status {number} The server returns the HTTP status code
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param status {number} 由服务器返回的 HTTP 状态代码
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static dispatchHTTPStatusEvent(target:IEventDispatcher, status:number):boolean {
            var event:HTTPStatusEvent = Event.create(HTTPStatusEvent, HTTPStatusEvent.HTTP_STATUS);
            event._status = status;
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }
    }
}