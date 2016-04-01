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
	 * @class egret.gui.ElementExistenceEvent
	 * @classdesc
	 * Group添加或移除元素时分派的事件。
	 * @extends egret.Event
	 */	
	export class ElementExistenceEvent extends Event{
		/**
		 * 元素添加 
		 * @constant egret.gui.ElementExistenceEvent.ELEMENT_ADD
		 */		
		public static ELEMENT_ADD:string = "elementAdd";
		/**
		 * 元素移除 
		 * @constant egret.gui.ElementExistenceEvent.ELEMENT_REMOVE
		 */		
		public static ELEMENT_REMOVE:string = "elementRemove";

		/**
		 * @member egret.gui.ElementExistenceEvent#constructor
		 */
		public constructor(
			type:string, bubbles:boolean = false,
			cancelable:boolean = false,
			element:IVisualElement = null, 
			index:number = -1){
			super(type, bubbles, cancelable);
			
			this.element = element;
			this.index = index;
		}
		
		/**
		 * 指向已添加或删除元素的位置的索引。 
		 * @member egret.gui.ElementExistenceEvent#index
		 */		
		public index:number = NaN;
		
		/**
		 * 对已添加或删除的视觉元素的引用。 
		 * @member egret.gui.ElementExistenceEvent#element
		 */		
        public element: IVisualElement = null;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.ElementExistenceEvent.dispatchElementExistenceEvent
         */
        public static dispatchElementExistenceEvent(target:IEventDispatcher,type:string,
                                                    element:IVisualElement = null,index:number = -1):boolean{
			var event:ElementExistenceEvent = Event.create(ElementExistenceEvent, type);
			event.element = element;
			event.index = index;
			var result = target.dispatchEvent(event);
			Event.release(event);
			return result;
        }

		public clean():void {
			super.clean();
			this.element = null;
			this.index = NaN;
		}
	}
	
}