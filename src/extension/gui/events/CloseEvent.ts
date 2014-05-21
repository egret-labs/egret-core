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
	 * @class ns_egret.CloseEvent
	 * @classdesc
	 * 窗口关闭事件
	 * @extends ns_egret.Event
	 */	
	export class CloseEvent extends Event{
		/**
		 * @constant ns_egret.CloseEvent.CLOSE
		 */
		public static CLOSE:string = "close";
		/**
		 * 构造函数
		 * @method ns_egret.CloseEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 * @param detail {any} 
		 */		
		public constructor(type:string, bubbles:boolean = false,
								   cancelable:boolean = false, detail:any = -1){
			super(type, bubbles, cancelable);
			
			this.detail = detail;
		}
		/**
		 * 触发关闭事件的细节。某些窗口组件用此属性来区分窗口中被点击的按钮。
		 * @member ns_egret.CloseEvent#detail
		 */		
		public detail:any;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.CloseEvent.dispatchCloseEvent
         */
        public static dispatchCloseEvent(target:IEventDispatcher,type:string,detail:any = -1):void{
            var eventClass:any = CloseEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.detail = detail;
            Event._dispatchByTarget(eventClass,target,type,false,props)
        }
	}
	
}