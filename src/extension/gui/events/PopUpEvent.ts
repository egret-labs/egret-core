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


module egret.gui {

	/**
	 * @class egret.gui.PopUpEvent
	 * @classdesc
	 * 弹出管理器事件
	 * @extends egret.Event
	 */
	export class PopUpEvent extends Event{
		/**
		 * 添加一个弹出框，在执行完添加之后抛出。
		 * @constant egret.gui.PopUpEvent.ADD_POPUP
		 */		
		public static ADD_POPUP:string = "addPopUp";
		/**
		 * 移除一个弹出框，在执行完移除之后抛出。
		 * @constant egret.gui.PopUpEvent.REMOVE_POPUP
		 */		
		public static REMOVE_POPUP:string = "removePopUp";
		/**
		 * 移动弹出框到最前，在执行完前置之后抛出。
		 * @constant egret.gui.PopUpEvent.BRING_TO_FRONT
		 */		
		public static BRING_TO_FRONT:string = "bringToFront";
		/**
		 * 构造函数
		 * @method egret.gui.PopUpEvent#constructor
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
		 * @member egret.gui.PopUpEvent#popUp
		 */		
        public popUp: IVisualElement = null;
		/**
		 * 弹出窗口是否为模态，此属性仅在事件类型为ADD_POPUP时有效。
		 * @member egret.gui.PopUpEvent#modal
		 */		
		public modal:boolean = false;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.PopUpEvent.dispatchPopUpEvent
         */
        public static dispatchPopUpEvent(target:IEventDispatcher,type:string,
                                         popUp:IVisualElement=null,modal:boolean = false):boolean{
			var event:PopUpEvent = Event.create(PopUpEvent, HTTPStatusEvent.HTTP_STATUS);
			event.popUp = popUp;
			event.modal = modal;
			var result = target.dispatchEvent(event);
			Event.release(event);
			return result;
        }

		public clean():void {
			super.clean();
			this.popUp = null;
		}
	}
}