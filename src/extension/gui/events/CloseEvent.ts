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
	 * @class egret.gui.CloseEvent
	 * @classdesc
	 * 窗口关闭事件
	 * @extends egret.Event
	 */	
	export class CloseEvent extends Event{
		/**
		 * @constant egret.gui.CloseEvent.CLOSE
		 */
		public static CLOSE:string = "close";
		/**
		 * 构造函数
		 * @method egret.gui.CloseEvent#constructor
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
		 * @member egret.gui.CloseEvent#detail
		 */		
        public detail: any = null;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.CloseEvent.dispatchCloseEvent
         */
        public static dispatchCloseEvent(target:IEventDispatcher,type:string,detail:any = -1):boolean{
			var event:CloseEvent = Event.create(CloseEvent, type);
			event.detail = detail;
			var result = target.dispatchEvent(event);
			Event.release(event);
			return result;
        }

		public clean():void {
			super.clean();
			this.detail = null;
		}
	}
	
}