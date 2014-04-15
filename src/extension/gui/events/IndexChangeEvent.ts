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

	export class IndexChangeEvent extends Event{
		/**
		 * 指示索引已更改 
		 */		
		public static CHANGE:string = "change";
		
		/**
		 * 指示索引即将更改,可以通过调用preventDefault()方法阻止索引发生更改
		 */
		public static CHANGING:string = "changing";
		
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
		 */
		public newIndex:number;
		
		/**
		 * 进行更改之前的从零开始的索引。
		 */		
		public oldIndex:number;
	}
}