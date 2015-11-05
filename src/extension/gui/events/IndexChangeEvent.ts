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
	 * @class egret.gui.IndexChangeEvent
	 * @classdesc
	 * 索引改变事件
	 * @extends egret.Event
	 */	
	export class IndexChangeEvent extends Event{
		/**
		 * 指示索引已更改 
		 * @constant egret.gui.IndexChangeEvent.CHANGE
		 */		
		public static CHANGE:string = "change";
		
		/**
		 * 指示索引即将更改,可以通过调用preventDefault()方法阻止索引发生更改
		 * @constant egret.gui.IndexChangeEvent.CHANGING
		 */
		public static CHANGING:string = "changing";
		
		/**
		 * @method egret.gui.IndexChangeEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 * @param oldIndex {number} 
		 * @param newIndex {number} 
		 */
		public constructor(type:string, bubbles:boolean = false,
										 cancelable:boolean = false,
										 oldIndex:number = -1,
										 newIndex:number = -1){
			super(type, bubbles, cancelable);
			
			this.oldIndex = oldIndex;
			this.newIndex = newIndex;
		}
		
		/**
		 * 进行更改之后的从零开始的索引。
		 * @member egret.gui.IndexChangeEvent#newIndex
		 */
		public newIndex:number = NaN;
		
		/**
		 * 进行更改之前的从零开始的索引。
		 * @member egret.gui.IndexChangeEvent#oldIndex
		 */		
		public oldIndex:number = NaN;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.IndexChangeEvent.dispatchIndexChangeEvent
         */
        public static dispatchIndexChangeEvent(target:IEventDispatcher,type:string,
                                               oldIndex:number = -1,newIndex:number = -1,cancelable:boolean = false):boolean{
			var event:IndexChangeEvent = Event.create(IndexChangeEvent, type);
			event.oldIndex = oldIndex;
			event.newIndex = newIndex;
			var result = target.dispatchEvent(event);
			Event.release(event);
			return result;
        }

		public clean():void {
			super.clean();
			this.oldIndex = NaN;
			this.newIndex = NaN;
		}
	}
}