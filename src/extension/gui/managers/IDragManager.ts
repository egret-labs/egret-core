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
module ns_egret {

	export interface IDragManager{
		/**
		 * 正在拖拽的标志
		 */		
		isDragging:boolean;
		
		/**
		 * 启动拖拽操作。请在MouseDown事件里执行此方法。
		 * @param dragInitiator 启动拖拽的组件
		 * @param dragSource 拖拽的数据源
		 * @param dragImage 拖拽过程中显示的图像
		 * @param xOffset dragImage相对dragInitiator的x偏移量,默认0。
		 * @param yOffset dragImage相对dragInitiator的y偏移量,默认0。
		 * @param imageAlpha dragImage的透明度，默认0.5。
		 */		
		doDrag(
			dragInitiator:InteractiveObject, 
			dragSource:DragSource, 
			dragImage:DisplayObject = null,
			xOffset:number = 0,
			yOffset:number = 0,
			imageAlpha:number = 0.5):void;

		/**
		 * 接受拖拽的数据源。通常在dragEnter事件处理函数调用此方法。
		 * 传入target后，若放下数据源。target将能监听到dragDrop事件。
		 */		
		acceptDragDrop(target:InteractiveObject):void;

		/**
		 * 结束拖拽
		 */		
		endDrag():void;
	}
}