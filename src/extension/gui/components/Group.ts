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
/// <reference path="supportClasses/GroupBase.ts"/>
/// <reference path="../core/IContainer.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../core/IVisualElementContainer.ts"/>
/// <reference path="../events/DragEvent.ts"/>
/// <reference path="../events/ElementExistenceEvent.ts"/>

module ns_egret {

	export class Group extends GroupBase implements IVisualElementContainer{
		public constructor(){
			super();
		}
		
		private _hasMouseListeners:boolean = false;
		
		/**
		 * 是否添加过鼠标事件监听
		 */  
		private set hasMouseListeners(value:boolean):void{
			if (this._mouseEnabledWhereTransparent){
				this.invalidateDisplayListExceptLayout();
			}
			this._hasMouseListeners = value;
		}
		
		/**
		 * 鼠标事件的监听个数 
		 */	
		private mouseEventReferenceCount:number;
		
		private _mouseEnabledWhereTransparent:boolean = true;
		
		/**
		 *  是否允许透明区域也响应鼠标事件,默认true
		 */
		public get mouseEnabledWhereTransparent():boolean{
			return this._mouseEnabledWhereTransparent;
		}
		
		public set mouseEnabledWhereTransparent(value:boolean):void{
			if (value == this._mouseEnabledWhereTransparent)
				return;
			
			this._mouseEnabledWhereTransparent = value;
			
			if (this._hasMouseListeners)
				this.invalidateDisplayListExceptLayout();
		}
		
		/**
		 * @inheritDoc
		 */
		public addEventListener(type:string, listener:Function,
												  useCapture:boolean = false, priority:number = 0,
												  useWeakReference:boolean = false):void{
			super.addEventListener(type, listener,this, useCapture, priority, 
				useWeakReference);
			switch (type){
				
				case TouchEvent.TOUCH_TAP:
				case TouchEvent.DOUBLE_CLICK:
				case TouchEvent.TOUCH_BEGAN:
				case TouchEvent.TOUCH_MOVE:
				case TouchEvent.TOUCH_OVER:
				case TouchEvent.TOUCH_OUT:
				case TouchEvent.TOUCH_ROLL_OUT:
				case TouchEvent.TOUCH_ROLL_OVER:
				case TouchEvent.TOUCH_END:
				case TouchEvent.MOUSE_WHEEL:
				case DragEvent.DRAG_ENTER:
				case DragEvent.DRAG_OVER:
				case DragEvent.DRAG_DROP:
				case DragEvent.DRAG_EXIT:
					if (++this.mouseEventReferenceCount > 0)
						this.hasMouseListeners = true;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public removeEventListener( type:string, listener:Function,
													  useCapture:boolean = false):void{
			super.removeEventListener(type, listener,this, useCapture);
			
			switch (type){
				
				case TouchEvent.TOUCH_TAP:
				case TouchEvent.DOUBLE_CLICK:
				case TouchEvent.TOUCH_BEGAN:
				case TouchEvent.TOUCH_MOVE:
				case TouchEvent.TOUCH_OVER:
				case TouchEvent.TOUCH_OUT:
				case TouchEvent.TOUCH_ROLL_OUT:
				case TouchEvent.TOUCH_ROLL_OVER:
				case TouchEvent.TOUCH_END:
				case TouchEvent.MOUSE_WHEEL:
					if (--this.mouseEventReferenceCount == 0)
						this.hasMouseListeners = false;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
			this.drawBackground();
		}
		/**
		 * 绘制鼠标点击区域
		 */		
		private drawBackground():void{
			if (!this._mouseEnabledWhereTransparent || !this._hasMouseListeners)
				return;
			this.graphics.clear();
			if (this.width==0 || this.height==0)
				return;
			this.graphics.beginFill(0xFFFFFF, 0);
			if (this.layout && this.layout.clipAndEnableScrolling)
				this.graphics.drawRect(this.layout.horizontalScrollPosition, this.layout.verticalScrollPosition, this.width, this.height);
			else{
				const tileSize:number = 4096;
				for (var x:number = 0; x < this.width; x += this.tileSize)
					for (var y:number = 0; y < this.height; y += this.tileSize){
						var tileWidth:number = Math.min(this.width - x, this.tileSize);
						var tileHeight:number = Math.min(this.height - y, this.tileSize);
						this.graphics.drawRect(x, y, tileWidth, tileHeight); 
					}
			}
			
			this.graphics.endFill();
		}	
		

		/**
		 * createChildren()方法已经执行过的标志
		 */		
		private createChildrenCalled:boolean = false;
		
		/**
		 * @inheritDoc
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
		
		private _elementsContent:Array = [];
		/**
		 * 返回子元素列表
		 */		
		public getElementsContent():Array{
			return this._elementsContent;
		}

		/**
		 * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
		 * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
		 */		
		public set elementsContent(value:Array):void{
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
					this.elementRemoved(this._elementsContent[i], i);
				}
				this._elementsContent = value;
			}
		}
		
		/**
		 * 设置容器子对象列表
		 */		
		private setElementsContent(value:Array):void{
			var i:number;
			
			for (i = this._elementsContent.length - 1; i >= 0; i--){
				this.elementRemoved(this._elementsContent[i], i);
			}
			
			this._elementsContent = value.concat();
			
			var n:number = this._elementsContent.length;
			for (i = 0; i < n; i++){   
				var elt:IVisualElement = this._elementsContent[i];
				
				if(elt.parent instanceof IVisualElementContainer)
					(<IVisualElementContainer> (elt.parent)).removeElement(elt);
				else if(elt.owner instanceof IContainer)
					(<IContainer> (elt.owner)).removeElement(elt);
				
				this.elementAdded(elt, i);
			}
		}
		
		
		
		/**
		 * @inheritDoc
		 */
		public get numElements():number{
			return this._elementsContent.length;
		}
		
		/**
		 * @inheritDoc
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
				throw new RangeError("索引:\""+index+"\"超出可视元素索引范围");
		}
		/**
		 * @inheritDoc
		 */
		public addElement(element:IVisualElement):IVisualElement{
			var index:number = this.numElements;
			
			if (element.parent == this)
				index = this.numElements-1;
			
			return this.addElementAt(element, index);
		}
		/**
		 * @inheritDoc
		 */
		public addElementAt(element:IVisualElement, index:number):IVisualElement{
			if (element == this)
				return element;
			
			this.checkForRangeError(index, true);
			
			var host:DisplayObject = element.parent; 
			if (host == this){
				this.setElementIndex(element, index);
				return element;
			}
			else if (host instanceof IVisualElementContainer){
				(<IVisualElementContainer> host).removeElement(element);
			}
			else if(element.owner instanceof IContainer){
				(<IContainer> (element.owner)).removeElement(element);
			}
			
			this._elementsContent.splice(index, 0, element);
			
			if (!this.elementsContentChanged)
				this.elementAdded(element, index);
			
			return element;
		}
		/**
		 * @inheritDoc
		 */
		public removeElement(element:IVisualElement):IVisualElement{
			return this.removeElementAt(this.getElementIndex(element));
		}
		/**
		 * @inheritDoc
		 */
		public removeElementAt(index:number):IVisualElement{
			this.checkForRangeError(index);
			
			var element:IVisualElement = this._elementsContent[index];
			
			if (!this.elementsContentChanged)
				this.elementRemoved(element, index);
			
			this._elementsContent.splice(index, 1);
			
			return element;
		}
		/**
		 * @inheritDoc
		 */
		public removeAllElements():void{
			for (var i:number = this.numElements - 1; i >= 0; i--){
				this.removeElementAt(i);
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public getElementIndex(element:IVisualElement):number{
			return this._elementsContent.indexOf(element);
		}
		/**
		 * @inheritDoc
		 */
		public setElementIndex(element:IVisualElement, index:number):void{
			this.checkForRangeError(index);
			
			var oldIndex:number = this.getElementIndex(element);
			if (oldIndex==-1||oldIndex == index)
				return;
			
			if (!this.elementsContentChanged)
				this.elementRemoved(element, oldIndex, false);
			
			this._elementsContent.splice(oldIndex, 1);
			this._elementsContent.splice(index, 0, element);
			
			if (!this.elementsContentChanged)
				this.elementAdded(element, index, false);
		}
		/**
		 * @inheritDoc
		 */
		public swapElements(element1:IVisualElement, element2:IVisualElement):void{
			this.swapElementsAt(this.getElementIndex(element1), this.getElementIndex(element2));
		}
		/**
		 * @inheritDoc
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
			
			var element1:IVisualElement = this._elementsContent[index1];
			var element2:IVisualElement = this._elementsContent[index2];
			if (!this.elementsContentChanged){
				this.elementRemoved(element1, index1, false);
				this.elementRemoved(element2, index2, false);
			}
			
			this._elementsContent.splice(index2, 1);
			this._elementsContent.splice(index1, 1);
			
			this._elementsContent.splice(index1, 0, element2);
			this._elementsContent.splice(index2, 0, element1);
			
			if (!this.elementsContentChanged){
				this.elementAdded(element2, index1, false);
				this.elementAdded(element1, index2, false);
			}
		}
		/**
		 * 添加一个显示元素到容器
		 */		
		public elementAdded(element:IVisualElement, index:number, notifyListeners:boolean = true):void{
			if(element instanceof DisplayObject)
				this.addToDisplayList(<DisplayObject> element, index);
			
			if (notifyListeners){
				if (this.hasEventListener(ElementExistenceEvent.ELEMENT_ADD))
					this.dispatchEvent(new ElementExistenceEvent(
						ElementExistenceEvent.ELEMENT_ADD, false, false, element, index));
			}
			
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		/**
		 * 从容器移除一个显示元素
		 */		
		public elementRemoved(element:IVisualElement, index:number, notifyListeners:boolean = true):void{
			if (notifyListeners){        
				if (this.hasEventListener(ElementExistenceEvent.ELEMENT_REMOVE))
					this.dispatchEvent(new ElementExistenceEvent(
						ElementExistenceEvent.ELEMENT_REMOVE, false, false, element, index));
			}
			
			var childDO:DisplayObject = <DisplayObject> element; 
			if (childDO && childDO.parent == this){
				super.removeChild(childDO);
			}
			
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		
		/**
		 * 添加对象到显示列表
		 */		
		public addToDisplayList(child:DisplayObject, index:number = -1):void{
			if (child.parent == this)
				super.setChildIndex(child, index != -1 ? index : super.numChildren - 1);
			else
				super.addChildAt(child, index != -1 ? index : super.numChildren);
		}
		
		private static errorStr:string = "在此组件中不可用，若此组件为容器类，请使用";
		[Deprecated] 
		/**
		 * addChild()在此组件中不可用，若此组件为容器类，请使用addElement()代替
		 */		
		public addChild(child:DisplayObject):DisplayObject{
			throw(new Error("addChild()"+Group.errorStr+"addElement()代替"));
		}
		[Deprecated] 
		/**
		 * addChildAt()在此组件中不可用，若此组件为容器类，请使用addElementAt()代替
		 */		
		public addChildAt(child:DisplayObject, index:number):DisplayObject{
			throw(new Error("addChildAt()"+Group.errorStr+"addElementAt()代替"));
		}
		[Deprecated] 
		/**
		 * removeChild()在此组件中不可用，若此组件为容器类，请使用removeElement()代替
		 */		
		public removeChild(child:DisplayObject):DisplayObject{
			throw(new Error("removeChild()"+Group.errorStr+"removeElement()代替"));
		}
		[Deprecated] 
		/**
		 * removeChildAt()在此组件中不可用，若此组件为容器类，请使用removeElementAt()代替
		 */		
		public removeChildAt(index:number):DisplayObject{
			throw(new Error("removeChildAt()"+Group.errorStr+"removeElementAt()代替"));
		}
		[Deprecated] 
		/**
		 * setChildIndex()在此组件中不可用，若此组件为容器类，请使用setElementIndex()代替
		 */		
		public setChildIndex(child:DisplayObject, index:number):void{
			throw(new Error("setChildIndex()"+Group.errorStr+"setElementIndex()代替"));
		}
		[Deprecated] 
		/**
		 * swapChildren()在此组件中不可用，若此组件为容器类，请使用swapElements()代替
		 */		
		public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
			throw(new Error("swapChildren()"+Group.errorStr+"swapElements()代替"));
		}
		[Deprecated] 
		/**
		 * swapChildrenAt()在此组件中不可用，若此组件为容器类，请使用swapElementsAt()代替
		 */		
		public swapChildrenAt(index1:number, index2:number):void{
			throw(new Error("swapChildrenAt()"+Group.errorStr+"swapElementsAt()代替"));
		}
	}
}