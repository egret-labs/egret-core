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
	 * @class egret.gui.IVisualElementContainer
	 * @interface
	 * @classdesc
	 * 具有管理IVisualElement子显示对象的容器接口
	 * @extends egret.gui.IVisualElement
	 * @extends egret.gui.IContainer
	 */	
	export interface IVisualElementContainer extends IVisualElement,IContainer{
		/**
		 * 从容器中删除所有可视元素。
		 * @method egret.gui.IVisualElementContainer#removeAllElements
		 */		
		removeAllElements():void;
		/**
		 * 交换两个指定可视元素的索引。所有其他元素仍位于相同的索引位置。
		 * @method egret.gui.IVisualElementContainer#swapElements
		 * @param element1 {IVisualElement} 第一个可视元素。
		 * @param element2 {IVisualElement} 第二个可视元素。
		 */		
		swapElements(element1:IVisualElement, element2:IVisualElement):void;
		/**
		 * 交换容器中位于两个指定索引位置的可视元素。所有其他可视元素仍位于相同的索引位置。
		 * @method egret.gui.IVisualElementContainer#swapElementsAt
		 * @param index1 {number} 第一个元素的索引。
		 * @param index2 {number} 第二个元素的索引。
		 * @throws RangeError 如果在子列表中不存在该索引位置。
		 */		
		swapElementsAt(index1:number, index2:number):void;
	}
	
}