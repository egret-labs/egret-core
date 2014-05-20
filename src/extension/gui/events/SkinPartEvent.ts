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

	/**
	 * @class ns_egret.SkinPartEvent
	 * @classdesc
	 * 皮肤组件附加移除事件
	 * @extends ns_egret.Event
	 */
	export class SkinPartEvent extends Event{
		/**
		 * 附加皮肤公共子部件 
		 * @constant ns_egret.SkinPartEvent.PART_ADDED
		 */		
		public static PART_ADDED:string = "partAdded";
		/**
		 * 移除皮肤公共子部件 
		 * @constant ns_egret.SkinPartEvent.PART_REMOVED
		 */		
		public static PART_REMOVED:string = "partRemoved";
		
		/**
		 * @method ns_egret.SkinPartEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public constructor(type:string, bubbles:boolean = false,
									  cancelable:boolean = false,
									  partName:string = null, 
									  instance:any = null) {
			super(type, bubbles, cancelable);
			
			this.partName = partName;
			this.instance = instance;
		}
		
		/**
		 * 被添加或移除的皮肤组件实例
		 * @member ns_egret.SkinPartEvent#instance
		 */    
		public instance:any;
		
		/**
		 * 被添加或移除的皮肤组件的实例名
		 * @member ns_egret.SkinPartEvent#partName
		 */   
		public partName:string;
	}
}