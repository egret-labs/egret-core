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

	/**
	 * @class ns_egret.ElementExistenceEvent
	 * @classdesc
	 * Group添加或移除元素时分派的事件。
	 * @extends ns_egret.Event
	 */	
	export class ElementExistenceEvent extends Event{
		/**
		 * 元素添加 
		 * @constant ns_egret.ElementExistenceEvent.ELEMENT_ADD
		 */		
		public static ELEMENT_ADD:string = "elementAdd";
		/**
		 * 元素移除 
		 * @constant ns_egret.ElementExistenceEvent.ELEMENT_REMOVE
		 */		
		public static ELEMENT_REMOVE:string = "elementRemove";

		/**
		 * @member ns_egret.ElementExistenceEvent#constructor
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
		 * @member ns_egret.ElementExistenceEvent#index
		 */		
		public index:number;
		
		/**
		 * 对已添加或删除的视觉元素的引用。 
		 * @member ns_egret.ElementExistenceEvent#element
		 */		
		public element:IVisualElement;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.ElementExistenceEvent.dispatchElementExistenceEvent
         */
        public static dispatchElementExistenceEvent(target:IEventDispatcher,type:string,
                                                    element:IVisualElement = null,index:number = -1):void{
            var eventClass:any = ElementExistenceEvent;
            var props:any = eventClass._props;
            if(!props)
                props = eventClass._props = {};
            props.element = element;
            props.index = index;
            Event._dispatchByTarget(eventClass,target,type,false,props)
        }
	}
	
}