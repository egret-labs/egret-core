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
	 * @class ns_egret.IContainer
	 * @interface
	 * @classdesc
	 * 容器接口
	 */
	export interface IContainer{
		/**
		 * 此容器中的可视元素的数量。
		 * 可视元素包括实现 IVisualElement 接口的类，
		 * @member ns_egret.IContainer#numElements
		 */		
		numElements:number;
		/**
		 * 返回指定索引处的可视元素。
		 * @method ns_egret.IContainer#getElementAt
		 * @param index {number} 要检索的元素的索引。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 * @returns {IVisualElement}
		 */		
		getElementAt(index:number):IVisualElement
		/**
		 * 将可视元素添加到此容器中。
		 * 如果添加的可视元素已有一个不同的容器作为父项，则该元素将会从其他容器中删除。
		 * @method ns_egret.IContainer#addElement
		 * @param element {IVisualElement} 要添加为此容器的子项的可视元素。
		 * @returns {IVisualElement}
		 */		
		addElement(element:IVisualElement):IVisualElement;
		/**
		 * 将可视元素添加到此容器中。该元素将被添加到指定的索引位置。索引 0 代表显示列表中的第一个元素。 
		 * 如果添加的可视元素已有一个不同的容器作为父项，则该元素将会从其他容器中删除。
		 * @method ns_egret.IContainer#addElementAt
		 * @param element {IVisualElement} 要添加为此可视容器的子项的元素。
		 * @param index {number} 将该元素添加到的索引位置。如果指定当前占用的索引位置，则该位置以及所有更高位置上的子对象会在子级列表中上移一个位置。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 * @returns {IVisualElement}
		 */		
		addElementAt(element:IVisualElement, index:number):IVisualElement;
		/**
		 * 从此容器的子列表中删除指定的可视元素。
		 * 在该可视容器中，位于该元素之上的所有元素的索引位置都减少 1。
		 * @method ns_egret.IContainer#removeElement
		 * @param element {IVisualElement} 要从容器中删除的元素。
		 * @returns {IVisualElement}
		 */		
		removeElement(element:IVisualElement):IVisualElement;
		/**
		 * 从容器中的指定索引位置删除可视元素。
		 * 在该可视容器中，位于该元素之上的所有元素的索引位置都减少 1。
		 * @method ns_egret.IContainer#removeElementAt
		 * @param index {number} 要删除的元素的索引。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 * @returns {IVisualElement}
		 */		
		removeElementAt(index:number):IVisualElement;
		/**
		 * 返回可视元素的索引位置。若不存在，则返回-1。
		 * @method ns_egret.IContainer#getElementIndex
		 * @param element {IVisualElement} 可视元素。
		 * @returns {number}
		 */		
		getElementIndex(element:IVisualElement):number;
		/**
		 * 在可视容器中更改现有可视元素的位置。
		 * @method ns_egret.IContainer#setElementIndex
		 * @param element {IVisualElement} 要为其更改索引编号的元素。
		 * @param index {number} 元素的最终索引编号。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 */		
		setElementIndex(element:IVisualElement, index:number):void;
		
	}
}