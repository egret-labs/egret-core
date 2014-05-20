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
	 * @class ns_egret.StateChangeEvent
	 * @classdesc
	 * 视图状态改变事件
	 * @extends ns_egret.Event
	 */	
	export class StateChangeEvent extends Event{
		/**
		 * 当前视图状态已经改变 
		 * @constant ns_egret.StateChangeEvent.CURRENT_STATE_CHANGE
		 */		
		public static CURRENT_STATE_CHANGE:string = "currentStateChange";
		/**
		 * 当前视图状态即将改变
		 * @constant ns_egret.StateChangeEvent.CURRENT_STATE_CHANGING
		 */		
		public static CURRENT_STATE_CHANGING:string = "currentStateChanging";
		
		/**
		 * @method ns_egret.StateChangeEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 * @param oldState {string} 
		 * @param newState {string} 
		 */
		public constructor(type:string, bubbles:boolean = false,
										 cancelable:boolean = false,
										 oldState:string = null,
										 newState:string = null){
			super(type, bubbles, cancelable);
			
			this.oldState = oldState;
			this.newState = newState;
		}
		/**
		 * 组件正在进入的视图状态的名称。
		 * @member ns_egret.StateChangeEvent#newState
		 */		
		public newState:string;
		
		/**
		 * 组件正在退出的视图状态的名称。
		 * @member ns_egret.StateChangeEvent#oldState
		 */		
		public oldState:string;
	}
	
}