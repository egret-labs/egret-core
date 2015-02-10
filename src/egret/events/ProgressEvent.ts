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
     * @class egret.ProgressEvent
     * @classdesc
     * 当加载操作已开始或套接字已接收到数据时，将调度 ProgressEvent 对象。
     * 有两种类型的进程事件：ProgressEvent.PROGRESS 和 ProgressEvent.SOCKET_DATA。
     */
    export class ProgressEvent extends egret.Event {

        /**
         * @constant {string} egret.ProgressEvent.PROGRESS
         */
        public static PROGRESS:string = "progress";

        /**
         * @constant {string} egret.ProgressEvent.SOCKET_DATA
         */
        public static SOCKET_DATA:string = "socketData";

        /**
         * 在侦听器处理事件时加载的项数或字节数。
         * @member {number} egret.ProgressEvent#bytesLoaded
         */
        public bytesLoaded:number = 0;
        /**
         * 如果加载过程成功，将加载的总项数或总字节数。
         * @member {number} egret.ProgressEvent#bytesTotal
         */
        public bytesTotal:number = 0;

        /**
         * 创建一个 egret.ProgressEvent 对象
         * @method egret.ProgressEvent#constructor
         * @param type {string} 事件类型
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param bytesLoaded {number}
         * @param bytesTotal {number}
         */
        public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, bytesLoaded:number = 0, bytesTotal:number = 0) {
            super(type, bubbles, cancelable);

            this.bytesLoaded = bytesLoaded;
            this.bytesTotal = bytesTotal;
        }

        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.ProgressEvent.dispatchIOErrorEvent
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param bytesLoaded {number} 加载的项数或字节数
         * @param bytesTotal {number} 加载的总项数或总字节数
         */
        public static dispatchProgressEvent(target:IEventDispatcher, type:string, bytesLoaded:number = 0, bytesTotal:number = 0):void {
            Event._dispatchByTarget(ProgressEvent, target, type, {"bytesLoaded":bytesLoaded, "bytesTotal":bytesTotal});
        }
    }
}