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

/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="../core/DragSource.ts"/>

module ns_egret {

	export class DragEvent extends TouchEvent{
		/**
		 * 拖拽开始,此事件由启动拖拽的组件自身抛出。
		 */		
		public static DRAG_START:string = "dragStart";
		/**
		 * 拖拽完成，此事件由拖拽管理器在启动拖拽的组件上抛出。
		 */		
		public static DRAG_COMPLETE:string = "dragComplete";
		
		/**
		 * 在目标区域放下拖拽的数据,此事件由拖拽管理器在经过的目标组件上抛出。
		 */		
		public static DRAG_DROP:string = "dragDrop";
		/**
		 * 拖拽进入目标区域，此事件由拖拽管理器在经过的目标组件上抛出。
		 */		
		public static DRAG_ENTER:string = "dragEnter";
		/**
		 * 拖拽移出目标区域，此事件由拖拽管理器在经过的目标组件上抛出。
		 */		
		public static DRAG_EXIT:string = "dragExit";
		/**
		 * 拖拽经过目标区域，相当于MouseOver事件，此事件由拖拽管理器在经过的目标组件上抛出。
		 */		
		public static DRAG_OVER:string = "dragOver";
		
		
		/**
		 * 创建一个 Event 对象，其中包含有关鼠标事件的信息。将 Event 对象作为参数传递给事件侦听器。
		 * @param type 事件类型；指示引发事件的动作。
		 * @param bubbles 指定该事件是否可以在显示列表层次结构得到冒泡处理。
		 * @param cancelable 指定是否可以防止与事件相关联的行为。
		 * @param dragInitiator 启动拖拽的组件。
		 * @param dragSource 包含正在拖拽数据的DragSource对象。
		 * @param ctrlKey 指示是否已按下 Ctrl 键。
		 * @param altKey 指示是否已按下 Alt 键。
		 * @param shiftKey 指示是否已按下 Shift 键。
		 */		
		public constructor(type:string, bubbles:boolean = false,
								  cancelable:boolean = true,
								  dragInitiator:DisplayObject = null,
								  dragSource:DragSource = null,
								  ctrlKey:boolean = false,
								  altKey:boolean = false,
								  shiftKey:boolean = false){
			super(type, bubbles, cancelable);
			
			this.dragInitiator = dragInitiator;
			this.dragSource = dragSource;
			this.ctrlKey = ctrlKey;
			this.altKey = altKey;
			this.shiftKey = shiftKey;
		}
		/**
		 * 启动拖拽的组件
		 */		
		public dragInitiator:DisplayObject;
		/**
		 * 包含正在拖拽数据的DragSource对象。
		 */		
		public dragSource:DragSource;
	}
	
}
