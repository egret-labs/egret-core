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
/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="../components/IItemRenderer.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.ListEvent
	 * @classdesc
	 * 列表事件
	 * @extends ns_egret.TouchEvent
	 */	
	export class ListEvent extends TouchEvent{
		/**
		 * 指示用户执行了将鼠标指针从控件中某个项呈示器上移开的操作 
		 * @constant ns_egret.ListEvent.ITEM_ROLL_OUT
		 */		
		public static ITEM_ROLL_OUT:string = "itemRollOut";
		
		/**
		 * 指示用户执行了将鼠标指针滑过控件中某个项呈示器的操作。 
		 * @constant ns_egret.ListEvent.ITEM_ROLL_OVER
		 */
		public static ITEM_ROLL_OVER:string = "itemRollOver";
		
		/**
		 * 指示用户执行了将鼠标在某个项呈示器上单击的操作。 
		 * @constant ns_egret.ListEvent.ITEM_CLICK
		 */		
		public static ITEM_CLICK:string = "itemClick";
		
		
		/**
		 * @method ns_egret.ListEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 * @param touchPointID {number} 
		 * @param stageX {number} 
		 * @param stageY {number} 
		 * @param ctrlKey {boolean} 
		 * @param altKey {boolean} 
		 * @param shiftKey {boolean} 
		 * @param buttonDown {boolean} 
		 * @param itemIndex {number} 
		 * @param item {any} 
		 * @param itemRenderer {IItemRenderer} 
		 */
		public constructor(type:string, bubbles:boolean=true, cancelable:boolean=true,
                           touchPointID:number=0,stageX:number=0,stageY:number=0,ctrlKey:boolean = false,
                           altKey:boolean = false,shiftKey:boolean = false,buttonDown:boolean = false,
						   itemIndex:number = -1,item:any = null,itemRenderer:IItemRenderer = null){
			super(type, bubbles, cancelable, touchPointID, stageX, stageY,ctrlKey,altKey,shiftKey,buttonDown);
			
			this.itemIndex = itemIndex;
			this.item = item;
			this.itemRenderer = itemRenderer;
		}
		
		
		/**
		 * 触发鼠标事件的项呈示器数据源项。
		 * @member ns_egret.ListEvent#item
		 */
		public item:any;
		
		/**
		 * 触发鼠标事件的项呈示器。 
		 * @member ns_egret.ListEvent#itemRenderer
		 */		
		public itemRenderer:IItemRenderer;
		
		/**
		 * 触发鼠标事件的项索引
		 * @member ns_egret.ListEvent#itemIndex
		 */		
		public itemIndex:number;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.ListEvent.dispatchListEvent
         */
        public static dispatchListEvent(target:IEventDispatcher,type:string,touchEvent:TouchEvent=null,
                                        itemIndex:number = -1,item:any = null,itemRenderer:IItemRenderer = null):void{
            var eventClass:any = ListEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.touchPointID = touchEvent.touchPointID;
            props._stageX = touchEvent.stageX;
            props._stageY = touchEvent.stageY;
            props.ctrlKey = touchEvent.ctrlKey;
            props.altKey = touchEvent.altKey;
            props.shiftKey = touchEvent.shiftKey;
            props.touchDown = touchEvent.touchDown;
            props.itemIndex = itemIndex;
            props.item = item;
            props.itemRenderer = itemRenderer;
            Event._dispatchByTarget(eventClass,target,type,props);
        }
	}
}