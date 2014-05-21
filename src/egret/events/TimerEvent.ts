/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/** @namespace ns_egret */

/// <reference path="Event.ts"/>

module ns_egret {

    export class TimerEvent extends Event{

        /**
         * 创建一个 Event 对象，其中包含有关 timer 事件的特定信息。
         * @class ns_egret.TimerEvent
         * @classdesc 每当 Timer 对象达到由 Timer.delay 属性指定的间隔时，Timer 对象即会调度 TimerEvent 对象。
         * @param type {string} 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
         * @param bubbles {string} 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
         * @param cancelable {string} 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
         */
        public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
           super(type,bubbles,cancelable);
        }

        /**
         * 每当 Timer 对象达到根据 Timer.delay 属性指定的间隔时调度。
         * @constant {string} ns_egret.TimerEvent.TIMER
         */
        public static TIMER:string = "timer";

        /**
         * 每当它完成 Timer.repeatCount 设置的请求数后调度。
         * @constant {string} ns_egret.TimerEvent.TIMER_COMPLETE
         */
        public static TIMER_COMPLETE:string = "timerComplete";

        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.TimerEvent.dispathTimerEvent
         */
        public static dispatchTimerEvent(target:IEventDispatcher,type:string):void{
            var eventClass:any = TimerEvent;
            Event._dispatchByTarget(eventClass,target,type);
        }
    }
}