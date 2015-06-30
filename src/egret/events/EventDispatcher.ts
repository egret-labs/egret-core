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
     * @private
     */
    const enum Keys{
        eventTarget,
        eventsMap,
        captureEventsMap,
        notifyLevel
    }


    var ONCE_EVENT_LIST:egret.sys.EventBin[] = [];

    /**
     * @language en_US
     * The EventDispatcher class is the base class for all classes that dispatchEvent events. The EventDispatcher class implements
     * the IEventDispatcher interface and is the base class for the DisplayObject class. The EventDispatcher class allows
     * any object on the display list to be an event target and as such, to use the methods of the IEventDispatcher interface.
     * Event targets are an important part of the Lark event model. The event target serves as the focal point for how events
     * flow through the display list hierarchy. When an event such as a touch tap, Lark emits an event object into the
     * event flow from the root of the display list. The event object then makes its way through the display list until it
     * reaches the event target, at which point it begins its return trip through the display list. This round-trip journey
     * to the event target is conceptually divided into three phases: <br/>
     * the capture phase comprises the journey from the root to the last node before the event target's node, the target
     * phase comprises only the event target node, and the bubbling phase comprises any subsequent nodes encountered on
     * the return trip to the root of the display list. In general, the easiest way for a user-defined class to gain event
     * emitting capabilities is to extend EventDispatcher. If this is impossible (that is, if the class is already extending
     * another class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member, and write simple
     * hooks to route calls into the aggregated EventDispatcher.
     * @see egret.IEventDispatcher
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * EventDispatcher 是 Lark 的事件派发器类，负责进行事件的发送和侦听。
     * 事件目标是事件如何通过显示列表层次结构这一问题的焦点。当发生鼠标单击、触摸或按键等事件时，
     * 框架会将事件对象调度到从显示列表根开始的事件流中。然后该事件对象在显示列表中前进，直到到达事件目标，
     * 然后从这一点开始其在显示列表中的回程。在概念上，到事件目标的此往返行程被划分为三个阶段：
     * 捕获阶段包括从根到事件目标节点之前的最后一个节点的行程，目标阶段仅包括事件目标节点，冒泡阶段包括回程上遇到的任何后续节点到显示列表的根。
     * 通常，使用户定义的类能够调度事件的最简单方法是扩展 EventDispatcher。如果无法扩展（即，如果该类已经扩展了另一个类），则可以实现
     * IEventDispatcher 接口，创建 EventDispatcher 成员，并编写一些简单的映射，将调用连接到聚合的 EventDispatcher 中。
     * @see egret.IEventDispatcher
     * @version Lark 1.0
     * @platform Web,Native
     */
    export class EventDispatcher extends HashObject implements IEventDispatcher {

        /**
         * @language en_US
         * create an instance of the EventDispatcher class.
         * @param target The target object for events emitted to the EventDispatcher object. This parameter is used when
         * the EventDispatcher instance is aggregated by a class that implements IEventDispatcher; it is necessary so that the
         * containing object can be the target for events. Do not use this parameter in simple cases in which a class extends EventDispatcher.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 EventDispatcher 类的实例
         * @param target 此 EventDispatcher 所抛出事件对象的 target 指向。此参数主要用于一个实现了 IEventDispatcher 接口的自定义类，
         * 以便抛出的事件对象的 target 属性可以指向自定义类自身。请勿在直接继承 EventDispatcher 的情况下使用此参数。
         * @version Lark 1.0
         * @platform Web,Native
         */
        public constructor(target:IEventDispatcher = null) {
            super();
            this.$EventDispatcher = {
                0: target ? target : this,
                1: {},
                2: {},
                3: 0
            };
        }

        /**
         * @private
         */
        $EventDispatcher:Object;

        $getEventMap(useCapture?:boolean) {
            var values = this.$EventDispatcher;
            var eventMap:any = useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
            return eventMap;
        }

        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        public addEventListener(type:string, listener:(event:Event)=>void, thisObject:any, useCapture?:boolean, priority?:number):void {
            this.$addListener(type, listener, thisObject, useCapture, priority);
        }

        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        public once(type:string, listener:(event:Event)=>void, thisObject:any, useCapture?:boolean, priority?:number):void {
            this.$addListener(type, listener, thisObject, useCapture, priority, true);
        }

        /**
         * @private
         */
        $addListener(type:string, listener:(event:Event)=>void, thisObject:any, useCapture?:boolean, priority?:number, emitOnce?:boolean):void {
            if (DEBUG && !listener) {
                $error(1003, "listener");
            }
            var values = this.$EventDispatcher;
            var eventMap:any = useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
            var list:egret.sys.EventBin[] = eventMap[type];
            if (!list) {
                list = eventMap[type] = [];
            }
            else if (values[Keys.notifyLevel] !== 0) {
                eventMap[type] = list = list.concat();
            }
            priority = +priority | 0;
            var insertIndex = -1;
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    return;
                }
                if (insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                }
            }
            var eventBin:sys.EventBin = {
                type: type, listener: listener, thisObject: thisObject, priority: priority,
                target: this, useCapture: useCapture, emitOnce: !!emitOnce
            };
            if (insertIndex !== -1) {
                list.splice(insertIndex, 0, eventBin);
            }
            else {
                list.push(eventBin);
            }
        }

        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        public removeEventListener(type:string, listener:(event:Event)=>void, thisObject:any, useCapture?:boolean):void {

            var values = this.$EventDispatcher;
            var eventMap:Object = useCapture ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
            var list:egret.sys.EventBin[] = eventMap[type];
            if (!list) {
                return;
            }
            if (values[Keys.notifyLevel] !== 0) {
                eventMap[type] = list = list.concat();
            }
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    list.splice(i, 1);
                    break;
                }
            }
            if (list.length == 0) {
                eventMap[type] = null;
            }
        }
        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        public hasEventListener(type:string):boolean {
            var values = this.$EventDispatcher;
            return (values[Keys.eventsMap][type] || values[Keys.captureEventsMap][type]);
        }

        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        public willTrigger(type:string):boolean {
            return this.hasEventListener(type);
        }


        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        public dispatchEvent(event:Event):boolean {
            event.$target = event.$currentTarget = this.$EventDispatcher[Keys.eventTarget];
            return this.$notifyListener(event, false);
        }

        /**
         * @private
         */
        $notifyListener(event:Event,capturePhase:boolean):boolean {
            var values = this.$EventDispatcher;
            var eventMap:Object = capturePhase ? values[Keys.captureEventsMap] : values[Keys.eventsMap];
            var list:egret.sys.EventBin[] = eventMap[event.$type];
            if (!list) {
                return true;
            }
            var length = list.length;
            if (length == 0) {
                return true;
            }
            var onceList = ONCE_EVENT_LIST;
            //做个标记，防止外部修改原始数组导致遍历错误。这里不直接调用list.concat()因为emit()方法调用通常比on()等方法频繁。
            values[Keys.notifyLevel]++;
            for (var i = 0; i < length; i++) {
                var eventBin = list[i];
                eventBin.listener.call(eventBin.thisObject, event);
                if (eventBin.emitOnce) {
                    onceList.push(eventBin);
                }
                if (event.$isPropagationImmediateStopped) {
                    break;
                }
            }
            values[Keys.notifyLevel]--;
            while (onceList.length) {
                eventBin = onceList.pop();
                eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
            }
            return !event.$isDefaultPrevented;
        }

        /**
         * @inheritDoc
         * @version Lark 1.0
         * @platform Web,Native
         */
        public dispatchEventWith(type:string, bubbles?:boolean, cancelable?:boolean, data?:any):boolean {
            if (bubbles || this.hasEventListener(type)) {
                var event:Event = Event.create(Event, type, bubbles, cancelable);
                event.data = data;
                var result = this.dispatchEvent(event);
                Event.release(event);
                return result;
            }
            return true;
        }
    }

    registerClass(EventDispatcher, Types.EventDispatcher, [Types.IEventDispatcher]);
}

module egret.sys {
    /**
     * @private
     * 事件信息对象
     */
    export interface EventBin {
        /**
         * @private
         */
        type:string;
        /**
         * @private
         */
        listener: (event:Event)=>void;
        /**
         * @private
         */
        thisObject:any;
        /**
         * @private
         */
        priority:number;
        /**
         * @private
         */
        target:IEventDispatcher;
        /**
         * @private
         */
        useCapture:boolean;
        /**
         * @private
         */
        emitOnce:boolean;
    }
}