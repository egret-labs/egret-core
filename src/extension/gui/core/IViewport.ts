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

	export interface IViewport extends IVisualElement{
		/**
		 * 视域的内容的宽度。
		 * 如果 clipAndEnabledScrolling 为 true， 则视域的 contentWidth 为水平滚动定义限制，
		 * 且视域的实际宽度定义可见的内容量。要在内容中水平滚动， 请在 0 和 contentWidth - width 
		 * 之间更改 horizontalScrollPosition。 
		 */		
		contentWidth:number;
		
		/**
		 * 视域的内容的高度。
		 * 如果 clipAndEnabledScrolling 为 true，则视域的 contentHeight 为垂直滚动定义限制，
		 * 且视域的实际高度定义可见的内容量。要在内容中垂直滚动，请在 0 和 contentHeight - height 
		 * 之间更改 verticalScrollPosition。
		 */		
		contentHeight:number;
		
		/**
		 * 可视区域水平方向起始点
		 */		
		horizontalScrollPosition:number;
		
		/**
		 * 可视区域竖直方向起始点
		 */		
		verticalScrollPosition:number;
		
		/**
		 * 返回要添加到视域的当前 horizontalScrollPosition 的数量，以按请求的滚动单位进行滚动。
		 * @param navigationUnit 要滚动的数量。该值必须是NavigationUnit 常量之一
		 */		
		getHorizontalScrollPositionDelta(navigationUnit:number):number;
		
		/**
		 * 回要添加到视域的当前 verticalScrollPosition 的数量，以按请求的滚动单位进行滚动。
		 * @param navigationUnit 要滚动的数量。该值必须是NavigationUnit 常量之一
		 */		
		getVerticalScrollPositionDelta(navigationUnit:number):number;
		
		/**
		 * 如果为 true，指定将子代剪切到视区的边界。如果为 false，则容器子代会从容器边界扩展过去，而不管组件的大小规范。默认false
		 */		
		clipAndEnableScrolling:boolean;
	}
	
}