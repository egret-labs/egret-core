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

module ns_egret {

	/**
	 * @class ns_egret.PropertyChangeEvent
	 * @classdesc
	 * 对象的一个属性发生更改时传递到事件侦听器的事件
	 * @extends ns_egret.Event
	 */
	export class PropertyChangeEvent extends Event{
		/**
		 * 属性改变 
		 * @constant ns_egret.PropertyChangeEvent.PROPERTY_CHANGE
		 */		
		public static PROPERTY_CHANGE:string = "propertyChange";

		/**
		 * 构造函数
		 * @method ns_egret.PropertyChangeEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 * @param kind {string} 
		 * @param property {any} 
		 * @param oldValue {any} 
		 * @param newValue {any} 
		 * @param source {any} 
		 */		
		public constructor(type:string, bubbles:boolean = false,
											cancelable:boolean = false,
											kind:string = null,
											property:any = null, 
											oldValue:any = null,
											newValue:any = null,
											source:any = null){
			super(type, bubbles, cancelable);
			
			this.kind = kind;
			this.property = property;
			this.oldValue = oldValue;
			this.newValue = newValue;
			this.source = source;
		}
		
		/**
		 * 指定更改的类型。可能的值为 PropertyChangeEventKind.UPDATE、PropertyChangeEventKind.DELETE 和 null。 
		 * @member ns_egret.PropertyChangeEvent#kind
		 */		
		public kind:string;
		
		/**
		 * 更改后的属性的值。 
		 * @member ns_egret.PropertyChangeEvent#newValue
		 */		
		public newValue:any;
		
		/**
		 * 更改后的属性的值。 
		 * @member ns_egret.PropertyChangeEvent#oldValue
		 */
		public oldValue:any;
		
		/**
		 * 指定已更改属性的 String、QName 或 int。 
		 * @member ns_egret.PropertyChangeEvent#property
		 */
		public property:any;
		
		/**
		 * 发生更改的对象。 
		 * @member ns_egret.PropertyChangeEvent#source
		 */		
		public source:any;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.PropertyChangeEvent.dispatchPropertyChangeEvent
         */
        public static dispatchPropertyChangeEvent(target:IEventDispatcher,kind:string = null,
                                                  property:any = null,oldValue:any = null,
                                                  newValue:any = null,source:any = null):void{
            var eventClass:any = PropertyChangeEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.kind = kind;
            props.property = property;
            props.oldValue = oldValue;
            props.newValue = newValue;
            props.source = source;
            Event._dispatchByTarget(eventClass,target,PropertyChangeEvent.PROPERTY_CHANGE,props);
        }
	}
}