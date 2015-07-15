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
	 * @class egret.gui.ViewStack
	 * @classdesc
	 * 层级堆叠容器,一次只显示一个子对象。
	 * @extends egret.gui.Group
	 * @implements egret.gui.IViewStack
	 * @implements egret.gui.ICollection
	 */
	export class ViewStack extends Group implements IViewStack,ICollection{
		/**
		 * 构造函数
		 * @method egret.gui.ViewStack#constructor
		 */		
		public constructor(){
			super();
			this._setLayout(new BasicLayout());
		}

		/**
		 * 此容器的布局对象为只读,默认限制为BasicLayout。
		 * @member egret.gui.ViewStack#layout
		 */		
		public get layout():LayoutBase{
			return this._layout;
		}
		public set layout(value:LayoutBase){
		}
		
		private _createAllChildren:boolean = false;
		/**
		 * 是否立即初始化化所有子项。false表示当子项第一次被显示时再初始化它。默认值false。
		 * @member egret.gui.ViewStack#createAllChildren
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


        private _selectedChild: IVisualElement = null;
		/**
		 * 当前选中的子项
		 * @member egret.gui.ViewStack#selectedChild
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
		 * 当前选中子项的索引
		 * @member egret.gui.ViewStack#selectedIndex
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
		 * @method egret.gui.ViewStack#_setSelectedIndex
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
		 * @param element {IVisualElement}
		 * @param index {number} 
		 * @param notifyListeners {boolean} 
		 */		
		public _elementAdded(element:IVisualElement, index:number, notifyListeners:boolean=true):void{
			if(this._createAllChildren){
                if(element instanceof DisplayObject){
                    var childDO:DisplayObject = <DisplayObject><any> element;
                    this._addToDisplayListAt(childDO,index,notifyListeners);
                }
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
		 * 处理对组件设置的属性
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

		/**
		 *
		 * @param newIndex
		 */
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
		 * 子项数量
		 * @member egret.gui.ViewStack#length
		 */	
		public get length():number{
			return this.numElements;
		}
		/**
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