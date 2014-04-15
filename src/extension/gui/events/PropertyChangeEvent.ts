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

	export class PropertyChangeEvent extends Event{
		/**
		 * 属性改变 
		 */		
		public static PROPERTY_CHANGE:string = "propertyChange";
		
		/**
		 * 返回使用指定属性构建的 PropertyChangeEventKind.UPDATE 类型的新 PropertyChangeEvent。 
		 * @param source 发生更改的对象。
		 * @param property 指定已更改属性的 String、QName 或 int。
		 * @param oldValue 更改前的属性的值。
		 * @param newValue 更改后的属性的值。
		 */		
		public static createUpdateEvent(
			source:any,
			property:any,
			oldValue:any,
			newValue:any):PropertyChangeEvent{
			var event:PropertyChangeEvent =
				new PropertyChangeEvent(this.PROPERTY_CHANGE);
			
			event.kind = PropertyChangeEventKind.UPDATE;
			event.oldValue = oldValue;
			event.newValue = newValue;
			event.source = source;
			event.property = property;
			
			return event;
		}
		
		/**
		 * 构造函数
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
		 */		
		public kind:string;
		
		/**
		 * 更改后的属性的值。 
		 */		
		public newValue:any;
		
		/**
		 * 更改后的属性的值。 
		 */
		public oldValue:any;
		
		/**
		 * 指定已更改属性的 String、QName 或 int。 
		 */
		public property:any;
		
		/**
		 * 发生更改的对象。 
		 */		
		public source:any;
	}
}