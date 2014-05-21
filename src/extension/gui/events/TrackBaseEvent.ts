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

/// <reference path="../../../egret/events/Event.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.TrackBaseEvent
	 * @classdesc
	 * 从TrackBase组件分派的事件。
	 * @extends ns_egret.Event
	 */	
	export class TrackBaseEvent extends Event{
		/**
		 * 正在拖拽滑块
		 * @constant ns_egret.TrackBaseEvent.THUMB_DRAG
		 */		
		public static THUMB_DRAG:string = "thumbDrag";
		
		/**
		 * 滑块被按下 
		 * @constant ns_egret.TrackBaseEvent.THUMB_PRESS
		 */		
		public static THUMB_PRESS:string = "thumbPress";
		
		/**
		 * 滑块被放开
		 * @constant ns_egret.TrackBaseEvent.THUMB_RELEASE
		 */		
		public static THUMB_RELEASE:string = "thumbRelease";
		
		/**
		 * 构造函数
		 * @method ns_egret.TrackBaseEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 */		
		public constructor(type:string, bubbles:boolean = false,cancelable:boolean = false){
			super(type, bubbles, cancelable);
		}

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.TrackBaseEvent.dispatchTrackBaseEvent
         */
        public static dispatchTrackBaseEvent(target:IEventDispatcher,type:string):void{
            var eventClass:any = TrackBaseEvent;
            Event._dispatchByTarget(eventClass,target,type);
        }
	}
	
}