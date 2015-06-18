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
     * A ProgressEvent object is emitted when a load operation has begun. These events are usually generated when data are
     * loaded into an application.
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 当加载操作已开始,将调度 ProgressEvent 事件。这些事件通常在数据加载到应用程序中时生成。
     * @version Lark 1.0
     * @platform Web,Native
     */
    export class ProgressEvent extends Event {

        /**
         * @language en_US
         * Emitted when data is received as the download operation progresses.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在下载操作过程中收到数据时调度。
         * @version Lark 1.0
         * @platform Web,Native
         */
        public static PROGRESS:string = "progress";

        /**
         * @language en_US
         * The number of items or bytes loaded when the listener processes the event.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在侦听器处理事件时加载的项数或字节数。
         * @version Lark 1.0
         * @platform Web,Native
         */
        public bytesLoaded:number = 0;
        /**
         * @language en_US
         * The total number of items or bytes that will be loaded if the loading process succeeds.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果加载过程成功，将加载的总项数或总字节数。
         * @version Lark 1.0
         * @platform Web,Native
         */
        public bytesTotal:number = 0;

        /**
         * @language en_US
         * Creates an Event object that contains information about progress events.
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through the inherited bubbles property.
         * @param cancelable Determines whether the Event object can be canceled. Event listeners can access this information through the inherited cancelable property.
         * @param bytesLoaded The number of items or bytes loaded when the listener processes the event.
         * @param bytesTotal The total number of items or bytes that will be loaded if the loading process succeeds.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 ProgressEvent 对象
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param bytesLoaded 加载的项数或字节数
         * @param bytesTotal 加载的总项数或总字节数
         * @version Lark 1.0
         * @platform Web,Native
         */
        public constructor(type:string, bubbles?:boolean, cancelable?:boolean, bytesLoaded?:number, bytesTotal?:number) {
            super(type, bubbles, cancelable);

            this.bytesLoaded = +bytesLoaded || 0;
            this.bytesTotal = +bytesTotal || 0;
        }

        /**
         * @language en_US
         * uses a specified target to dispatchEvent an event. Using this method can reduce the number of
         * reallocate event objects, which allows you to get better code execution performance.
         * @param target the event target
         * @param type the type of event
         * @param bytesLoaded The number of items or bytes loaded when the listener processes the event.
         * @param bytesTotal The total number of items or bytes that will be loaded if the loading process succeeds.
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventEmitter对象来抛出事件对象。使用此方法能够减少事件对象创建的数量，从而获得更高的代码运行性能。
         * @param target 派发事件目标
         * @param type 事件类型
         * @param bytesLoaded 加载的项数或字节数
         * @param bytesTotal 加载的总项数或总字节数
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Lark 1.0
         * @platform Web,Native
         */
        public static emitProgressEvent(target:IEventDispatcher, type:string, bytesLoaded?:number, bytesTotal?:number):boolean {
            var event = Event.create(ProgressEvent, type);
            event.bytesLoaded = +bytesLoaded || 0;
            event.bytesTotal = +bytesTotal || 0;
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }
    }

    registerClass(ProgressEvent, Types.ProgressEvent);
}