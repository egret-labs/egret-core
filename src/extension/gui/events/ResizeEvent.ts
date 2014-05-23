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
/// <reference path="../../../egret/events/IEventDispatcher.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.ResizeEvent
	 * @classdesc
	 * 尺寸改变事件
	 * @extends ns_egret.Event
	 */
	export class ResizeEvent extends Event{
		/**
		 * @constant ns_egret.ResizeEvent.RESIZE
		 */
		public static RESIZE:string = "resize";
		
		/**
		 * @method ns_egret.ResizeEvent#constructor
		 * @param type {string} 
		 * @param oldWidth {number} 
		 * @param oldHeight {number} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 */
		public constructor(type:string,oldWidth:number = NaN, oldHeight:number = NaN,
									bubbles:boolean = false, cancelable:boolean = false){
			super(type, bubbles, cancelable);
			
			this.oldWidth = oldWidth;
			this.oldHeight = oldHeight;
		}
		
		/**
		 * 旧的高度 
		 * @member ns_egret.ResizeEvent#oldHeight
		 */
		public oldHeight:number;
		
		/**
		 * 旧的宽度 
		 * @member ns_egret.ResizeEvent#oldWidth
		 */
		public oldWidth:number;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.ResizeEvent.dispatchResizeEvent
         */
        public static dispatchResizeEvent(target:IEventDispatcher,oldWidth:number = NaN, oldHeight:number = NaN):void {
            var eventClass:any = ResizeEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.oldWidth = oldWidth;
            props.oldHeight = oldHeight;
            Event._dispatchByTarget(eventClass, target, ResizeEvent.RESIZE, props);
        }
	}
}