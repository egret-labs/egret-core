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
/// <reference path="../core/IVisualElement.ts"/>

module ns_egret {

	export class PopUpEvent extends Event{
		/**
		 * 添加一个弹出框，在执行完添加之后抛出。
		 */		
		public static ADD_POPUP:string = "addPopUp";
		/**
		 * 移除一个弹出框，在执行完移除之后抛出。
		 */		
		public static REMOVE_POPUP:string = "removePopUp";
		/**
		 * 移动弹出框到最前，在执行完前置之后抛出。
		 */		
		public static BRING_TO_FRONT:string = "bringToFront";
		/**
		 * 构造函数
		 */		
		public constructor(type:string,bubbles:boolean=false,
								   cancelable:boolean=false,popUp:IVisualElement=null,
									modal:boolean = false){
			super(type, bubbles, cancelable);
			this.popUp = popUp;
			this.modal = modal;
		}
		/**
		 * 弹出框对象
		 */		
		public popUp:IVisualElement;
		/**
		 * 弹出窗口是否为模态，此属性仅在事件类型为ADD_POPUP时有效。
		 */		
		public modal:boolean;
	}
}