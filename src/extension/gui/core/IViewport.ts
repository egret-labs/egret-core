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

/// <reference path="IVisualElement.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.IViewport
	 * @interface
	 * @classdesc
	 * 支持视区的组件接口
	 * @extends ns_egret.IVisualElement
	 */	
	export interface IViewport extends IVisualElement{
		/**
		 * 视域的内容的宽度。
		 * 如果 clipAndEnabledScrolling 为 true， 则视域的 contentWidth 为水平滚动定义限制，
		 * 且视域的实际宽度定义可见的内容量。要在内容中水平滚动， 请在 0 和 contentWidth - width 
		 * 之间更改 horizontalScrollPosition。 
		 * @member ns_egret.IViewport#contentWidth
		 */		
		contentWidth:number;
		
		/**
		 * 视域的内容的高度。
		 * 如果 clipAndEnabledScrolling 为 true，则视域的 contentHeight 为垂直滚动定义限制，
		 * 且视域的实际高度定义可见的内容量。要在内容中垂直滚动，请在 0 和 contentHeight - height 
		 * 之间更改 verticalScrollPosition。
		 * @member ns_egret.IViewport#contentHeight
		 */		
		contentHeight:number;
		
		/**
		 * 可视区域水平方向起始点
		 * @member ns_egret.IViewport#horizontalScrollPosition
		 */		
		horizontalScrollPosition:number;
		
		/**
		 * 可视区域竖直方向起始点
		 * @member ns_egret.IViewport#verticalScrollPosition
		 */		
		verticalScrollPosition:number;
		
		/**
		 * 如果为 true，指定将子代剪切到视区的边界。如果为 false，则容器子代会从容器边界扩展过去，而不管组件的大小规范。默认false
		 * @member ns_egret.IViewport#clipAndEnableScrolling
		 */		
		clipAndEnableScrolling:boolean;
	}
	
}