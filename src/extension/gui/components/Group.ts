//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module egret.gui {

	/**
	 * @class egret.gui.Group
	 * @classdesc
	 * 自动布局容器
	 * @extends egret.gui.GroupBase
	 * @implements egret.gui.IVisualElementContainer
	 */
	export class Group extends GroupBase implements IVisualElementContainer{
		/**
		 * @method egret.gui.Group#constructor
		 */
		public constructor(){
			super();
		}
		
		/**
		 * createChildren()方法已经执行过的标志
		 */		
		private createChildrenCalled:boolean = false;
		
		/**
		 * 创建子对象
		 * @method egret.gui.Group#createChildren
		 */
		public createChildren():void{
			super.createChildren();
			this.createChildrenCalled = true;
			if(this.elementsContentChanged){
				this.elementsContentChanged = false;
				this.setElementsContent(this._elementsContent);
			}
		}
		
		/**
		 * elementsContent改变标志 
		 */		
		private  elementsContentChanged:boolean = false;
		
		private _elementsContent:Array<any> = [];
		/**
		 * 返回子元素列表
		 */
		public _getElementsContent():Array<any>{
			return this._elementsContent;
		}

		/**
		 * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
		 * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
		 */		
		public set elementsContent(value:Array<any>){
			if(value==null)
				value = [];
			if(value==this._elementsContent)
				return;
			if (this.createChildrenCalled){
				this.setElementsContent(value);
			}
			else{
				this.elementsContentChanged = true;
				for (var i:number = this._elementsContent.length - 1; i >= 0; i--){
					this._elementRemoved(this._elementsContent[i], i);
				}
				this._elementsContent = value;
			}
		}
		
		/**
		 * 设置容器子对象列表
		 */		
		private setElementsContent(value:Array<any>):void{
			var i:number;
			
			for (i = this._elementsContent.length - 1; i >= 0; i--){
				this._elementRemoved(this._elementsContent[i], i);
			}
			
			this._elementsContent = value.concat();
			
			var n:number = this._elementsContent.length;
			for (i = 0; i < n; i++){   
				var elt:IVisualElement = this._elementsContent[i];
				
				if(elt.parent&&"removeElement" in elt.parent)
					(<IVisualElementContainer><any> (elt.parent)).removeElement(elt);
				else if(elt.owner&&"removeElement" in elt.owner)
					(<IContainer> (elt.owner)).removeElement(elt);
				
				this._elementAdded(elt, i);
			}
		}
		
		
		
		/**
		 * 获得容器中的子对象数
		 * @member egret.gui.Group#numElements
		 */
		public get numElements():number{
			return this._elementsContent.length;
		}
		
		/**
		 * 返回指定索引处的可视元素
		 * @method egret.gui.Group#getElementAt
		 * @param index {number} 
		 * @returns {IVisualElement}
		 */
		public getElementAt(index:number):IVisualElement{
			this.checkForRangeError(index);
			return this._elementsContent[index];
		}
		
		private checkForRangeError(index:number, addingElement:boolean = false):void{
			var maxIndex:number = this._elementsContent.length - 1;
			
			if (addingElement)
				maxIndex++;
			
			if (index < 0 || index > maxIndex)
				egret.$error(3011, index);
		}
		/**
		 * 将可视元素添加到此容器中
		 * @method egret.gui.Group#addElement
		 * @param element {IVisualElement} 
		 * @returns {IVisualElement}
		 */
		public addElement(element:IVisualElement):IVisualElement{
			var index:number = this.numElements;
			
			if (element.parent ==<DisplayObjectContainer><any>this)
				index = this.numElements-1;
			
			return this.addElementAt(element, index);
		}
		/**
		 * 将可视元素添加到此容器中
		 * @method egret.gui.Group#addElementAt
		 * @param element {IVisualElement} 
		 * @param index {number} 
		 * @returns {IVisualElement}
		 */
		public addElementAt(element:IVisualElement, index:number):IVisualElement{
			if (element == this)
				return element;
			
			this.checkForRangeError(index, true);
			
			var host:any = element.owner;
			if (host == this||element.parent==this){
				this.setElementIndex(element, index);
				return element;
			}
			else if(host&&"removeElement" in host){
				(<IContainer> (element.owner)).removeElement(element);
			}
			
			this._elementsContent.splice(index, 0, element);
			
			if (!this.elementsContentChanged)
				this._elementAdded(element, index);
			
			return element;
		}
		/**
		 * 从此容器的子列表中删除指定的可视元素
		 * @method egret.gui.Group#removeElement
		 * @param element {IVisualElement} 
		 * @returns {IVisualElement}
		 */
		public removeElement(element:IVisualElement):IVisualElement{
			return this.removeElementAt(this.getElementIndex(element));
		}
		/**
		 * 从容器中的指定索引位置删除可视元素
		 * @method egret.gui.Group#removeElementAt
		 * @param index {number} 
		 * @returns {IVisualElement}
		 */
		public removeElementAt(index:number):IVisualElement{
			this.checkForRangeError(index);
			
			var element:IVisualElement = this._elementsContent[index];
			
			if (!this.elementsContentChanged)
				this._elementRemoved(element, index);
			
			this._elementsContent.splice(index, 1);
			
			return element;
		}
		/**
		 * 删除容器中的所有子元素
		 * @method egret.gui.Group#removeAllElements
		 */
		public removeAllElements():void{
			for (var i:number = this.numElements - 1; i >= 0; i--){
				this.removeElementAt(i);
			}
		}
		
		/**
		 * 返回可视元素的索引位置
		 * @method egret.gui.Group#getElementIndex
		 * @param element {IVisualElement} 
		 * @returns {number}
		 */
		public getElementIndex(element:IVisualElement):number{
			return this._elementsContent.indexOf(element);
		}
		/**
		 * 在可视容器中更改现有可视元素的位置
		 * @method egret.gui.Group#setElementIndex
		 * @param element {IVisualElement} 
		 * @param index {number} 
		 */
		public setElementIndex(element:IVisualElement, index:number):void{
			this.checkForRangeError(index);
			
			var oldIndex:number = this.getElementIndex(element);
			if (oldIndex==-1||oldIndex == index)
				return;
			
			if (!this.elementsContentChanged)
				this._elementRemoved(element, oldIndex, false);
			
			this._elementsContent.splice(oldIndex, 1);
			this._elementsContent.splice(index, 0, element);
			
			if (!this.elementsContentChanged)
				this._elementAdded(element, index, false);
		}
		/**
		 * 交换两个指定可视元素的索引
		 * @method egret.gui.Group#swapElements
		 * @param element1 {IVisualElement} 
		 * @param element2 {IVisualElement} 
		 */
		public swapElements(element1:IVisualElement, element2:IVisualElement):void{
			this.swapElementsAt(this.getElementIndex(element1), this.getElementIndex(element2));
		}
		/**
		 * 交换容器中位于两个指定索引位置的可视元素
		 * @method egret.gui.Group#swapElementsAt
		 * @param index1 {number} 
		 * @param index2 {number} 
		 */
		public swapElementsAt(index1:number, index2:number):void{
			this.checkForRangeError(index1);
			this.checkForRangeError(index2);
			
			if (index1 > index2){
				var temp:number = index2;
				index2 = index1;
				index1 = temp; 
			}
			else if (index1 == index2)
				return;

            var elementsContent:Array<IVisualElement> = this._elementsContent;
			
			var element1:IVisualElement = elementsContent[index1];
			var element2:IVisualElement = elementsContent[index2];
			if (!this.elementsContentChanged){
				this._elementRemoved(element1, index1, false);
				this._elementRemoved(element2, index2, false);
			}

            elementsContent[index1] = element2;
            elementsContent[index2] = element1;

			if (!this.elementsContentChanged){
				this._elementAdded(element2, index1, false);
				this._elementAdded(element1, index2, false);
			}
		}
		/**
		 * 添加一个显示元素到容器
		 * @param element {IVisualElement}
		 * @param index {number} 
		 * @param notifyListeners {boolean} 
		 */		
		public _elementAdded(element:IVisualElement, index:number, notifyListeners:boolean = true):void{
            if(element instanceof DisplayObject){
                var childDO:DisplayObject = <DisplayObject><any> element;
                this._addToDisplayListAt(childDO,index,notifyListeners);
            }

			if (notifyListeners){
				if (this.hasEventListener(ElementExistenceEvent.ELEMENT_ADD))
                    ElementExistenceEvent.dispatchElementExistenceEvent(this,
                        ElementExistenceEvent.ELEMENT_ADD, element, index)
			}
			
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		/**
		 * 从容器移除一个显示元素
		 * @param element {IVisualElement}
		 * @param index {number} 
		 * @param notifyListeners {boolean} 
		 */		
		public _elementRemoved(element:IVisualElement, index:number, notifyListeners:boolean = true):void{
			if (notifyListeners){        
				if (this.hasEventListener(ElementExistenceEvent.ELEMENT_REMOVE))
                    ElementExistenceEvent.dispatchElementExistenceEvent(this,
                        ElementExistenceEvent.ELEMENT_REMOVE, element, index);
			}

            if(element instanceof DisplayObject&&element.parent==this){
                var childDO:DisplayObject = <DisplayObject><any> element;
                this._removeFromDisplayList(childDO,notifyListeners);
            }

			this.invalidateSize();
			this.invalidateDisplayList();
		}

		/**
		 * 将可视元素添加到此容器中
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */		
		public addChild(child:DisplayObject):DisplayObject{
			egret.$error(3004, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 将可视元素添加到此容器中
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */		
		public addChildAt(child:DisplayObject, index:number):DisplayObject{
			egret.$error(3005, egret.sys.tr(3003));
			return null;
		}
		/**从此容器的子列表中删除指定的可视元素
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */		
		public removeChild(child:DisplayObject):DisplayObject{
			egret.$error(3006, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 从此容器的子列表中删除指定的可视元素
		 * @method egret.gui.Group#removeChildAt
		 * @deprecated
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */		
		public removeChildAt(index:number):DisplayObject{
			egret.$error(3007, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 在可视容器中更改现有可视元素的位置
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 */		
		public setChildIndex(child:DisplayObject, index:number):void{
			egret.$error(3008, egret.sys.tr(3003));
		}
		/**
		 * 交换两个指定可视元素的索引
		 * @deprecated
		 * @param child1 {DisplayObject} 
		 * @param child2 {DisplayObject} 
		 */		
		public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
			egret.$error(3009, egret.sys.tr(3003));
		}
		/**
		 * 交换容器中位于两个指定索引位置的可视元素
		 * @method egret.gui.Group#swapChildrenAt
		 * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
		 */		
		public swapChildrenAt(index1:number, index2:number):void{
			egret.$error(3010, egret.sys.tr(3003));
		}
	}
}