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
/// <reference path="../core/IVisualElement.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.PopUpEvent
	 * @classdesc
	 * 弹出管理器事件
	 * @extends ns_egret.Event
	 */
	export class PopUpEvent extends Event{
		/**
		 * 添加一个弹出框，在执行完添加之后抛出。
		 * @constant ns_egret.PopUpEvent.ADD_POPUP
		 */		
		public static ADD_POPUP:string = "addPopUp";
		/**
		 * 移除一个弹出框，在执行完移除之后抛出。
		 * @constant ns_egret.PopUpEvent.REMOVE_POPUP
		 */		
		public static REMOVE_POPUP:string = "removePopUp";
		/**
		 * 移动弹出框到最前，在执行完前置之后抛出。
		 * @constant ns_egret.PopUpEvent.BRING_TO_FRONT
		 */		
		public static BRING_TO_FRONT:string = "bringToFront";
		/**
		 * 构造函数
		 * @method ns_egret.PopUpEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 * @param popUp {IVisualElement} 
		 * @param modal {boolean} 
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
		 * @member ns_egret.PopUpEvent#popUp
		 */		
		public popUp:IVisualElement;
		/**
		 * 弹出窗口是否为模态，此属性仅在事件类型为ADD_POPUP时有效。
		 * @member ns_egret.PopUpEvent#modal
		 */		
		public modal:boolean;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.PopUpEvent.dispatchPopUpEvent
         */
        public static dispatchPopUpEvent(target:IEventDispatcher,type:string,
                                         popUp:IVisualElement=null,modal:boolean = false):void{
            var eventClass:any = PopUpEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.popUp = popUp;
            props.modal = modal;
            Event._dispatchByTarget(eventClass,target,type,props);
        }
	}
}