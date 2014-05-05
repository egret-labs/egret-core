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

/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="../components/IItemRenderer.ts"/>

module ns_egret {

	export class ListEvent extends TouchEvent{
		/**
		 * 指示用户执行了将鼠标指针从控件中某个项呈示器上移开的操作 
		 */		
		public static ITEM_ROLL_OUT:string = "itemRollOut";
		
		/**
		 * 指示用户执行了将鼠标指针滑过控件中某个项呈示器的操作。 
		 */
		public static ITEM_ROLL_OVER:string = "itemRollOver";
		
		/**
		 * 指示用户执行了将鼠标在某个项呈示器上单击的操作。 
		 */		
		public static ITEM_CLICK:string = "itemClick";
		
		
		public constructor(type:string, bubbles:boolean=true, cancelable:boolean=true,
                           touchPointID:number=0,stageX:number=0,stageY:number=0,ctrlKey:Boolean = false,
                           altKey:Boolean = false,shiftKey:Boolean = false,buttonDown:Boolean = false,
						   itemIndex:number = -1,item:any = null,itemRenderer:IItemRenderer = null){
			super(type, bubbles, cancelable, touchPointID, stageX, stageY,ctrlKey,altKey,shiftKey,buttonDown);
			
			this.itemIndex = itemIndex;
			this.item = item;
			this.itemRenderer = itemRenderer;
		}
		
		
		/**
		 * 触发鼠标事件的项呈示器数据源项。
		 */
		public item:any;
		
		/**
		 * 触发鼠标事件的项呈示器。 
		 */		
		public itemRenderer:IItemRenderer;
		
		/**
		 * 触发鼠标事件的项索引
		 */		
		public itemIndex:number;
	}
}