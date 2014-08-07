/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret.gui {

	/**
	 * @class egret.gui.IContainer
	 * @interface
	 * @classdesc
	 * 容器接口
	 */
	export interface IContainer{
		/**
		 * 此容器中的可视元素的数量。
		 * 可视元素包括实现 IVisualElement 接口的类，
		 * @member egret.gui.IContainer#numElements
		 */		
		numElements:number;
		/**
		 * 返回指定索引处的可视元素。
		 * @method egret.gui.IContainer#getElementAt
		 * @param index {number} 要检索的元素的索引。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 * @returns {IVisualElement}
		 */		
		getElementAt(index:number):IVisualElement
		/**
		 * 将可视元素添加到此容器中。
		 * 如果添加的可视元素已有一个不同的容器作为父项，则该元素将会从其他容器中删除。
		 * @method egret.gui.IContainer#addElement
		 * @param element {IVisualElement} 要添加为此容器的子项的可视元素。
		 * @returns {IVisualElement}
		 */		
		addElement(element:IVisualElement):IVisualElement;
		/**
		 * 将可视元素添加到此容器中。该元素将被添加到指定的索引位置。索引 0 代表显示列表中的第一个元素。 
		 * 如果添加的可视元素已有一个不同的容器作为父项，则该元素将会从其他容器中删除。
		 * @method egret.gui.IContainer#addElementAt
		 * @param element {IVisualElement} 要添加为此可视容器的子项的元素。
		 * @param index {number} 将该元素添加到的索引位置。如果指定当前占用的索引位置，则该位置以及所有更高位置上的子对象会在子级列表中上移一个位置。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 * @returns {IVisualElement}
		 */		
		addElementAt(element:IVisualElement, index:number):IVisualElement;
		/**
		 * 从此容器的子列表中删除指定的可视元素。
		 * 在该可视容器中，位于该元素之上的所有元素的索引位置都减少 1。
		 * @method egret.gui.IContainer#removeElement
		 * @param element {IVisualElement} 要从容器中删除的元素。
		 * @returns {IVisualElement}
		 */		
		removeElement(element:IVisualElement):IVisualElement;
		/**
		 * 从容器中的指定索引位置删除可视元素。
		 * 在该可视容器中，位于该元素之上的所有元素的索引位置都减少 1。
		 * @method egret.gui.IContainer#removeElementAt
		 * @param index {number} 要删除的元素的索引。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 * @returns {IVisualElement}
		 */		
		removeElementAt(index:number):IVisualElement;
		/**
		 * 返回可视元素的索引位置。若不存在，则返回-1。
		 * @method egret.gui.IContainer#getElementIndex
		 * @param element {IVisualElement} 可视元素。
		 * @returns {number}
		 */		
		getElementIndex(element:IVisualElement):number;
		/**
		 * 在可视容器中更改现有可视元素的位置。
		 * @method egret.gui.IContainer#setElementIndex
		 * @param element {IVisualElement} 要为其更改索引编号的元素。
		 * @param index {number} 元素的最终索引编号。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 */		
		setElementIndex(element:IVisualElement, index:number):void;
		
	}
}