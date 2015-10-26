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
	 * @class egret.gui.PropertyChangeEvent
	 * @classdesc
	 * 对象的一个属性发生更改时传递到事件侦听器的事件
	 * @extends egret.Event
	 */
	export class PropertyChangeEvent extends Event{
		/**
		 * 属性改变 
		 * @constant egret.gui.PropertyChangeEvent.PROPERTY_CHANGE
		 */		
		public static PROPERTY_CHANGE:string = "propertyChange";

		/**
		 * 构造函数
		 * @method egret.gui.PropertyChangeEvent#constructor
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
		 * @member egret.gui.PropertyChangeEvent#kind
		 */		
        public kind: string = null;
		
		/**
		 * 更改后的属性的值。 
		 * @member egret.gui.PropertyChangeEvent#newValue
		 */		
        public newValue: any = null;
		
		/**
		 * 更改后的属性的值。 
		 * @member egret.gui.PropertyChangeEvent#oldValue
		 */
        public oldValue: any = null;
		
		/**
		 * 指定已更改属性的 String、QName 或 int。 
		 * @member egret.gui.PropertyChangeEvent#property
		 */
        public property: any = null;
		
		/**
		 * 发生更改的对象。 
		 * @member egret.gui.PropertyChangeEvent#source
		 */		
        public source: any = null;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.PropertyChangeEvent.dispatchPropertyChangeEvent
         */
        public static dispatchPropertyChangeEvent(target:IEventDispatcher,kind:string = null,
                                                  property:any = null,oldValue:any = null,
                                                  newValue:any = null,source:any = null):boolean{
			var event:PropertyChangeEvent = Event.create(PropertyChangeEvent, PropertyChangeEvent.PROPERTY_CHANGE);
			event.kind = kind;
			event.property = property;
			event.oldValue = oldValue;
			event.newValue = newValue;
			event.source = source;
			var result = target.dispatchEvent(event);
			Event.release(event);
			return result;
        }

		public clean():void {
			super.clean();
			this.kind = null;
			this.newValue = null;
			this.oldValue = null;
			this.property = null;
			this.source = null;
		}
	}
}