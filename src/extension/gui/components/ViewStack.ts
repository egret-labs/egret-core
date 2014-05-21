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
/// <reference path="../collections/ICollection.ts"/>
/// <reference path="Group.ts"/>
/// <reference path="../core/IViewStack.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../events/CollectionEvent.ts"/>
/// <reference path="../events/CollectionEventKind.ts"/>
/// <reference path="../events/ElementExistenceEvent.ts"/>
/// <reference path="../events/UIEvent.ts"/>
/// <reference path="../layouts/BasicLayout.ts"/>
/// <reference path="../layouts/supportClasses/LayoutBase.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.ViewStack
	 * @classdesc
	 * 层级堆叠容器,一次只显示一个子对象。
	 * @extends ns_egret.Group
	 * @implements ns_egret.IViewStack
	 * @implements ns_egret.ICollection
	 */
	export class ViewStack extends Group implements IViewStack,ICollection{
		/**
		 * 构造函数
		 * @method ns_egret.ViewStack#constructor
		 */		
		public constructor(){
			super();
			this._setLayout(new BasicLayout());
		}

		/**
		 * 此容器的布局对象为只读,默认限制为BasicLayout。
		 * @member ns_egret.ViewStack#layout
		 */		
		public get layout():LayoutBase{
			return this._layout;
		}
		public set layout(value:LayoutBase){
		}
		
		private _createAllChildren:boolean = false;
		/**
		 * 是否立即初始化化所有子项。false表示当子项第一次被显示时再初始化它。默认值false。
		 * @member ns_egret.ViewStack#createAllChildren
		 */
		public get createAllChildren():boolean{
			return this._createAllChildren;
		}

		public set createAllChildren(value:boolean){
			if(this._createAllChildren==value)
				return;
			this._createAllChildren = value;
			if(this._createAllChildren){
				var elements:Array<any> = this._getElementsContent();
                var length:number = elements.length;
				for(var i:number=0;i<length;i++){
                    var element:IVisualElement = elements[i];
					if(element instanceof DisplayObject&&element.parent!=this){
						this.childOrderingChanged = true;
						this._addToDisplayList(<DisplayObject><any> element);
					}
				}
				if(this.childOrderingChanged)
					this.invalidateProperties();
			}
		}


		private _selectedChild:IVisualElement;
		/**
		 * @member ns_egret.ViewStack#selectedChild
		 */	
		public get selectedChild():IVisualElement{
			var index:number = this.selectedIndex;
			if (index>=0&&index<this.numElements)
				return this.getElementAt(index);
			return null;
		}
		public set selectedChild(value:IVisualElement){
			var index:number = this.getElementIndex(value);
			if(index>=0&&index<this.numElements)
				this._setSelectedIndex(index);
		}
		/**
		 * 未设置缓存选中项的值
		 */
		private static NO_PROPOSED_SELECTION:number = -2;

		/**
		 * 在属性提交前缓存选中项索引
		 */		
		private proposedSelectedIndex:number = ViewStack.NO_PROPOSED_SELECTION;
		
		public _selectedIndex:number = -1;
		/**
		 * @member ns_egret.ViewStack#selectedIndex
		 */	
		public get selectedIndex():number{
			return this.proposedSelectedIndex!=ViewStack.NO_PROPOSED_SELECTION?this.proposedSelectedIndex:this._selectedIndex;
		}
		public set selectedIndex(value:number){
			this._setSelectedIndex(value);
		}
		
		private notifyTabBar:boolean = false;
		/**
		 * 设置选中项索引
		 * @method ns_egret.ViewStack#_setSelectedIndex
		 * @param value {number} 
		 * @param notifyListeners {boolean} 
		 */		
		public _setSelectedIndex(value:number,notifyListeners:boolean=true):void{
			if (value == this.selectedIndex){
				return;
			}
			
			this.proposedSelectedIndex = value;
			this.invalidateProperties();
			UIEvent.dispatchUIEvent(this,UIEvent.VALUE_COMMIT);
			this.notifyTabBar = this.notifyTabBar||notifyListeners;
		}
		
		/**
		 * 添加一个显示元素到容器
		 * @method ns_egret.ViewStack#_elementAdded
		 * @param element {IVisualElement} 
		 * @param index {number} 
		 * @param notifyListeners {boolean} 
		 */		
		public _elementAdded(element:IVisualElement, index:number, notifyListeners:boolean=true):void{
			if(this._createAllChildren){
				if(element instanceof DisplayObject)
					this._addToDisplayList(<DisplayObject><any> element, index);
			}
			if (notifyListeners){
				if (this.hasEventListener(ElementExistenceEvent.ELEMENT_ADD))
                    ElementExistenceEvent.dispatchElementExistenceEvent(this,
                        ElementExistenceEvent.ELEMENT_ADD,element,index);
			}
			
			element.visible = false;
			element.includeInLayout = false;
			if (this.selectedIndex == -1){
				this._setSelectedIndex(index,false);
			}
			else if (index <= this.selectedIndex&&this.initialized){
				this._setSelectedIndex(this.selectedIndex + 1);
			}
			this.dispatchCoEvent(CollectionEventKind.ADD,index,-1,[element.name]);
		}
		
		
		/**
		 * 从容器移除一个显示元素
		 * @method ns_egret.ViewStack#_elementRemoved
		 * @param element {IVisualElement} 
		 * @param index {number} 
		 * @param notifyListeners {boolean} 
		 */		
		public _elementRemoved(element:IVisualElement, index:number, notifyListeners:boolean=true):void{
			super._elementRemoved(element,index,notifyListeners);
			element.visible = true;
			element.includeInLayout = true;
			if (index == this.selectedIndex){
				if (this.numElements > 0){       
					if (index == 0){
						this.proposedSelectedIndex = 0;
						this.invalidateProperties();
					}
					else
						this._setSelectedIndex(0, false);
				}
				else
					this._setSelectedIndex(-1);
			}
			else if (index < this.selectedIndex){
				this._setSelectedIndex(this.selectedIndex - 1);
			}
			this.dispatchCoEvent(CollectionEventKind.REMOVE,index,-1,[element.name]);
		}
		
		/**
		 * 子项显示列表顺序发生改变。
		 */		
		private childOrderingChanged:boolean = false;
		
		/**
		 * @method ns_egret.ViewStack#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			if (this.proposedSelectedIndex != ViewStack.NO_PROPOSED_SELECTION){
				this.commitSelection(this.proposedSelectedIndex);
				this.proposedSelectedIndex = ViewStack.NO_PROPOSED_SELECTION;
			}
			
			if(this.childOrderingChanged){
				this.childOrderingChanged = false;
				var elements:Array<any> = this._getElementsContent();
                var length:number = elements.length;
                for(var i:number=0;i<length;i++){
                    var element:IVisualElement = elements[i];
					if(element instanceof DisplayObject&&element.parent==this){
						this._addToDisplayList(<DisplayObject><any> element);
					}
				}
			}
			
			if(this.notifyTabBar){
				this.notifyTabBar = true;
				this.dispatchEventWith("IndexChanged");//通知TabBar自己的选中项发生改变
			}
		}
		
		private commitSelection(newIndex:number):void{
			var oldIndex:number = this._selectedIndex;
			if(newIndex>=0&&newIndex<this.numElements){
				this._selectedIndex = newIndex;
				if(this._selectedChild&&this._selectedChild.parent==this){
					this._selectedChild.visible = false;
					this._selectedChild.includeInLayout = false;
				}
				this._selectedChild = this.getElementAt(this._selectedIndex);
				this._selectedChild.visible = true;
				this._selectedChild.includeInLayout = true;
				if(this._selectedChild.parent!=this&&this._selectedChild instanceof DisplayObject){
					this._addToDisplayList(<DisplayObject><any> (this._selectedChild));
					if(!this.childOrderingChanged){
						this.childOrderingChanged = true;
					}
				}
			}
			else{
				this._selectedChild = null;
				this._selectedIndex = -1;
			}
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		/**
		 * @member ns_egret.ViewStack#length
		 */	
		public get length():number{
			return this.numElements;
		}
		/**
		 * @method ns_egret.ViewStack#getItemAt
		 * @param index {number} 
		 * @returns {any}
		 */			
		public getItemAt(index:number):any{
			var element:IVisualElement = this.getElementAt(index);
			if(element)
				return element.name;
			return "";
		}
		/**
		 * @method ns_egret.ViewStack#getItemIndex
		 * @param item {any} 
		 * @returns {number}
		 */		
		public getItemIndex(item:any):number{
			var list:Array<any> = this._getElementsContent();
			var length:number = list.length;
			for(var i:number=0;i<length;i++){
				if(list[i].name===item){
					return i;
				}
			}
			return -1;
		}
		
		/**
		 * 抛出事件
		 */		
		private dispatchCoEvent(kind:string = null, location:number = -1,
										 oldLocation:number = -1, items:Array<any> = null,oldItems:Array<any>=null):void{
            CollectionEvent.dispatchCollectionEvent(this,
                CollectionEvent.COLLECTION_CHANGE,kind,location,oldLocation,items,oldItems);
		}

	}
}