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

/// <reference path="IContainer.ts"/>
/// <reference path="IVisualElement.ts"/>

module ns_egret {

	export interface IVisualElementContainer extends IVisualElement,IContainer{
		/**
		 * 从容器中删除所有可视元素。
		 */		
		removeAllElements():void;
		/**
		 * 交换两个指定可视元素的索引。所有其他元素仍位于相同的索引位置。
		 * @param element1 第一个可视元素。
		 * @param element2 第二个可视元素。
		 */		
		swapElements(element1:IVisualElement, element2:IVisualElement):void;
		/**
		 * 交换容器中位于两个指定索引位置的可视元素。所有其他可视元素仍位于相同的索引位置。
		 * @param index1 第一个元素的索引。
		 * @param index2 第二个元素的索引。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 */		
		swapElementsAt(index1:number, index2:number):void;
	}
	
}