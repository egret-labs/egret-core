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
/// <reference path="../components/IItemRenderer.ts"/>
/// <reference path="../components/ITreeItemRenderer.ts"/>

module ns_egret {

	export class TreeEvent extends Event{
		/**
		 * 节点关闭,注意：只有通过交互操作引起的节点关闭才会抛出此事件。
		 */		
		public static ITEM_CLOSE:string = "itemClose";
		/**
		 * 节点打开,注意：只有通过交互操作引起的节点打开才会抛出此事件。
		 */		
		public static ITEM_OPEN:string = "itemOpen";
		/**
		 * 子节点打开或关闭前一刻分派。可以调用preventDefault()方法阻止节点的状态改变。
		 */		
		public static ITEM_OPENING:string = "itemOpening";
		
		public constructor(type:string, bubbles:boolean=false, cancelable:boolean=true,
								  itemIndex:number = -1,item:any = null,itemRenderer:ITreeItemRenderer = null){
			super(type, bubbles, cancelable);
			this.item = item;
			this.itemRenderer = itemRenderer;
			this.itemIndex = itemIndex;
		}
		
		/**
		 * 触发鼠标事件的项呈示器数据源项。
		 */
		public item:any;
		
		/**
		 * 触发鼠标事件的项呈示器。 
		 */		
		public itemRenderer:ITreeItemRenderer;
		/**
		 * 触发鼠标事件的项索引
		 */		
		public itemIndex:number;
		/**
		 * 当事件类型为ITEM_OPENING时，true表示即将打开节点，反之关闭。
		 */		
		public opening:boolean;
	}
}