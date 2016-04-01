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
     * When a user clicks a hyperlink rich text object dispatches TextEvent object. Text Event Type: TextEvent.LINK.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TextEvent.ts
     */
    /**
     * @language zh_CN
     * 用户在富文本中单击超链接时，对象将调度 TextEvent 对象。文本事件类型：TextEvent.LINK。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TextEvent.ts
     */
    export class TextEvent extends Event {

        /**
         * @language en_US
         * TextEvent create an object that contains information about text events.
         * @param type Type of event, you can access the TextEvent.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determine whether the Event object can be canceled. The default value is false.
         * @param text One or more characters of text entered by the user. Event listeners can access this information through the text property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 TextEvent 对象，其中包含有关文本事件的信息。
         * @param type 事件的类型，可以作为 TextEvent.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param text 用户输入的一个或多个文本字符。事件侦听器可以通过 text 属性访问此信息。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, text:string = "") {
            super(type, bubbles, cancelable);

            this.text = text;
        }

        /**
         * @language en_US
         * It defines the value of the type property of a link event object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 定义 link 事件对象的 type 属性值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static LINK:string = "link";

        /**
         * @language en_US
         * In TextEvent.LINK event, event corresponding string.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在 TextEvent.LINK 事件中，event对应的字符串。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public text:string;

        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown TextEvent. The objects will be thrown in the object cache pool for the next round robin.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param text  Text TextEvent object assignment
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出TextEvent事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type  事件类型
         * @param text  TextEvent对象的text赋值
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static dispatchTextEvent(target:IEventDispatcher, type:string, text:string):boolean {
            var event:TextEvent = Event.create(TextEvent, type);
            event.text = text;
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;

        }
    }
}