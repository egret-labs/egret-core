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

/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../core/IVisualElementContainer.ts"/>
/// <reference path="../events/ElementExistenceEvent.ts"/>
/// <reference path="../layouts/supportClasses/LayoutBase.ts"/>

module ns_egret {

	export class SkinnableContainer extends SkinnableComponent implements IVisualElementContainer{
		public constructor(){
			super();
		}
		
		/**
		 * @inheritDoc
		 */
		public get hostComponentKey():any{
			return SkinnableContainer;
		}
		
		/**
		 * [SkinPart]实体容器
		 */
		public contentGroup:Group;
		
		/**
		 * 实体容器实例化之前缓存子对象的容器 
		 */		
		public _placeHolderGroup:Group;
		
		/**
		 * 获取当前的实体容器
		 */		
		public get currentContentGroup():Group{          
			if (this.contentGroup==null){
				if (this._placeHolderGroup==null){
					this._placeHolderGroup = new Group();
					this._placeHolderGroup.visible = false;
					this.addToDisplayList(this._placeHolderGroup);
				}
				this._placeHolderGroup.addEventListener(
					ElementExistenceEvent.ELEMENT_ADD, this.contentGroup_elementAddedHandler, this);
				this._placeHolderGroup.addEventListener(
					ElementExistenceEvent.ELEMENT_REMOVE, this.contentGroup_elementRemovedHandler, this);
				return this._placeHolderGroup;
			}
			else{
				return this.contentGroup;    
			}
		}
		
		/**
		 * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。 
		 * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
		 */		
		public set elementsContent(value:Array){
			this.currentContentGroup.elementsContent = value;
		}
		/**
		 * @inheritDoc
		 */
		public get numElements():number{
			return this.currentContentGroup.numElements;
		}
		/**
		 * @inheritDoc
		 */
		public getElementAt(index:number):IVisualElement{
			return this.currentContentGroup.getElementAt(index);
		}
		/**
		 * @inheritDoc
		 */
		public addElement(element:IVisualElement):IVisualElement{
			return this.currentContentGroup.addElement(element);
		}
		/**
		 * @inheritDoc
		 */
		public addElementAt(element:IVisualElement, index:number):IVisualElement{
			return this.currentContentGroup.addElementAt(element,index);
		}
		/**
		 * @inheritDoc
		 */
		public removeElement(element:IVisualElement):IVisualElement{
			return this.currentContentGroup.removeElement(element);
		}
		/**
		 * @inheritDoc
		 */
		public removeElementAt(index:number):IVisualElement{
			return this.currentContentGroup.removeElementAt(index);
		}
		/**
		 * @inheritDoc
		 */
		public removeAllElements():void{
			this.currentContentGroup.removeAllElements();
		}
		/**
		 * @inheritDoc
		 */
		public getElementIndex(element:IVisualElement):number{
			return this.currentContentGroup.getElementIndex(element);
		}
		/**
		 * @inheritDoc
		 */
		public setElementIndex(element:IVisualElement, index:number):void{
			this.currentContentGroup.setElementIndex(element,index);
		}
		/**
		 * @inheritDoc
		 */
		public swapElements(element1:IVisualElement, element2:IVisualElement):void{
			this.currentContentGroup.swapElements(element1,element2);
		}
		/**
		 * @inheritDoc
		 */
		public swapElementsAt(index1:number, index2:number):void{
			this.currentContentGroup.swapElementsAt(index1,index2);
		}
		/**
		 * @inheritDoc
		 */
		public containsElement(element:IVisualElement):boolean{
			return this.currentContentGroup.containsElement(element);
		}
		
		
		/**
		 * contentGroup发生改变时传递的参数
		 */		
		private contentGroupProperties:any = {};
		
		/**
		 * 此容器的布局对象
		 */
		public get layout():LayoutBase{
			return this.contentGroup!=null?
				this.contentGroup.layout:this.contentGroupProperties.layout;	
		}
		
		public set layout(value:LayoutBase){
			if (this.contentGroup!=null){
				this.contentGroup.layout = value;
			}
			else{
				this.contentGroupProperties.layout = value;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName,instance);
			if(instance == this.contentGroup){
				if(this.contentGroupProperties.layout !== undefined){
					this.contentGroup.layout = this.contentGroupProperties.layout;
					this.contentGroupProperties = {};
				}
				if(this._placeHolderGroup){
					this._placeHolderGroup.removeEventListener(
						ElementExistenceEvent.ELEMENT_ADD, this.contentGroup_elementAddedHandler, this);
					this._placeHolderGroup.removeEventListener(
						ElementExistenceEvent.ELEMENT_REMOVE, this.contentGroup_elementRemovedHandler, this);
					var sourceContent:Array = this._placeHolderGroup.getElementsContent().concat();
					for (var i:number = this._placeHolderGroup.numElements; i > 0; i--){
						var element:IVisualElement = this._placeHolderGroup.removeElementAt(0);  
						element.ownerChanged(null);
					}
					this.removeFromDisplayList(this._placeHolderGroup);
					this.contentGroup.elementsContent = sourceContent;
					for (i = sourceContent.numElements; i > 0; i--){
						element = sourceContent[i];  
						element.ownerChanged(this);
					}
					this._placeHolderGroup = null;
				}
				this.contentGroup.addEventListener(
					ElementExistenceEvent.ELEMENT_ADD, this.contentGroup_elementAddedHandler, this);
				this.contentGroup.addEventListener(
					ElementExistenceEvent.ELEMENT_REMOVE, this.contentGroup_elementRemovedHandler, this);
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName,instance);
			if(instance == this.contentGroup){
				this.contentGroup.removeEventListener(
					ElementExistenceEvent.ELEMENT_ADD, this.contentGroup_elementAddedHandler, this);
				this.contentGroup.removeEventListener(
					ElementExistenceEvent.ELEMENT_REMOVE, this.contentGroup_elementRemovedHandler, this);
				this.contentGroupProperties.layout = this.contentGroup.layout;
				this.contentGroup.layout = null;
				if(this.contentGroup.numElements>0){
					this._placeHolderGroup = new Group;
					
					while(this.contentGroup.numElements>0){
						this._placeHolderGroup.addElement(this.contentGroup.getElementAt(0));
					}
					this._placeHolderGroup.addEventListener(
						ElementExistenceEvent.ELEMENT_ADD, this.contentGroup_elementAddedHandler, this);
					this._placeHolderGroup.addEventListener(
						ElementExistenceEvent.ELEMENT_REMOVE, this.contentGroup_elementRemovedHandler, this);
				}
			}
		}
		
		/**
		 * 容器添加元素事件
		 */		
		public contentGroup_elementAddedHandler(event:ElementExistenceEvent):void{
			event.element.ownerChanged(this);
			this.dispatchEvent(event);
		}
		/**
		 * 容器移除元素事件
		 */		
		public contentGroup_elementRemovedHandler(event:ElementExistenceEvent):void{
			event.element.ownerChanged(null);
			this.dispatchEvent(event);
		}

		/**
		 * @inheritDoc
		 */
		public createSkinParts():void{
			this.contentGroup = new Group();
			this.contentGroup.percentWidth = 100;
			this.contentGroup.percentHeight = 100;
			this.addToDisplayList(this.contentGroup);
			this.partAdded("contentGroup",this.contentGroup);
		}
				
		/**
		 * @inheritDoc
		 */
		public removeSkinParts():void{
			this.partRemoved("contentGroup",this.contentGroup);
			this.removeFromDisplayList(this.contentGroup);
			this.contentGroup = null;
		}
	}
}