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
/// <reference path="PropertyChangeEventKind.ts"/>

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

        private static reuseEvent:PropertyChangeEvent;
		/**
		 * 返回使用指定属性构建的 PropertyChangeEventKind.UPDATE 类型的新 PropertyChangeEvent。 
		 * @param source 发生更改的对象。
		 * @param property 指定已更改属性的 String、QName 或 int。
		 * @param oldValue 更改前的属性的值。
		 * @param newValue 更改后的属性的值。
		 * @member ns_egret.PropertyChangeEvent.createUpdateEvent
		 */		
		public static createUpdateEvent(
			source:any,
			property:any,
			oldValue:any,
			newValue:any):PropertyChangeEvent{
			var event:PropertyChangeEvent = PropertyChangeEvent.reuseEvent;
            if(!event){
                event = PropertyChangeEvent.reuseEvent =
                    new PropertyChangeEvent(PropertyChangeEvent.PROPERTY_CHANGE);
            }
			event.kind = PropertyChangeEventKind.UPDATE;
			event.oldValue = oldValue;
			event.newValue = newValue;
			event.source = source;
			event.property = property;
			
			return event;
		}
		
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
	}
}