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

/** @namespace egret */


module egret {

	/**
	 * @class egret.TimerEvent
	 * @classdesc
     * 每当 Timer 对象达到由 Timer.delay 属性指定的间隔时，Timer 对象即会调度 TimerEvent 对象。
	 * @extends egret.Event
     * @link http://docs.egret-labs.org/post/manual/timer/timer.html Timer计时器
	 */
    export class TimerEvent extends Event{

        /**
         * 创建一个 egret.TimerEvent 对象
         * @method egret.TimerEvent#constructor
         * @param type {string} 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
         * @param bubbles {boolean} 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
         */
        public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
           super(type,bubbles,cancelable);
        }

        /**
         * 每当 Timer 对象达到根据 Timer.delay 属性指定的间隔时调度。
		 * @constant {string} egret.TimerEvent.TIMER
         */
        public static TIMER:string = "timer";

        /**
         * 每当它完成 Timer.repeatCount 设置的请求数后调度。
		 * @constant {string} egret.TimerEvent.TIMER_COMPLETE
         */
        public static TIMER_COMPLETE:string = "timerComplete";

        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
		 * @method egret.TimerEvent.dispatchTimerEvent
		 * @param target {egret.IEventDispatcher} 派发事件目标
		 * @param type {string} 事件类型
         */
        public static dispatchTimerEvent(target:IEventDispatcher,type:string):void{
            var eventClass:any = TimerEvent;
            Event._dispatchByTarget(eventClass,target,type);
        }
    }
}