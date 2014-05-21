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
	 * @class ns_egret.MoveEvent
	 * @classdesc
	 * 移动事件
	 * @extends ns_egret.Event
	 */
	export class MoveEvent extends Event{
		/**
		 * @constant ns_egret.MoveEvent.MOVE
		 */
		public static MOVE:string = "move";
		
		/**
		 * @method ns_egret.MoveEvent#constructor
		 * @param type {string} 
		 * @param oldX {number} 
		 * @param oldY {number} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 */
		public constructor(type:string, oldX:number = NaN, oldY:number = NaN, 
								  bubbles:boolean = false,
								  cancelable:boolean = false){
			super(type, bubbles, cancelable);
			
			this.oldX = oldX;
			this.oldY = oldY;
		}
		
		/**
		 * 旧的组件X
		 * @member ns_egret.MoveEvent#oldX
		 */
		public oldX:number;
		
		/**
		 * 旧的组件Y
		 * @member ns_egret.MoveEvent#oldY
		 */
		public oldY:number;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.MoveEvent.dispatchMoveEvent
         */
        public static dispatchMoveEvent(target:IEventDispatcher,oldX:number = NaN, oldY:number = NaN):void{
            var eventClass:any = MoveEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.oldX = oldX;
            props.oldY = oldY;
            Event._dispatchByTarget(eventClass,target,MoveEvent.MOVE,props);
        }
	}
}