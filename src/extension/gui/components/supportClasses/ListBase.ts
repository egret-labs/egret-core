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
	 * @class egret.gui.ListBase
	 * @classdesc
	 * 支持选择内容的所有组件的基类。 
	 * @extends egret.gui.SkinnableDataContainer
	 */
	export class ListBase extends SkinnableDataContainer{
		/**
		 * 未选中任何项时的索引值 
		 * @constant egret.gui.ListBase.NO_SELECTION
		 */		
		public static NO_SELECTION:number = -1;
		
		/**
		 * 未设置缓存选中项的值
		 * @constant egret.gui.ListBase.NO_PROPOSED_SELECTION
		 */
		public static NO_PROPOSED_SELECTION:number = -2;
		/**
		 * 自定义的选中项
		 * @constant egret.gui.ListBase.CUSTOM_SELECTED_ITEM
		 */		
		public static CUSTOM_SELECTED_ITEM:number = -3;
		
		/**
		 * 构造函数
		 * @method egret.gui.ListBase#constructor
		 */
		public constructor(){
			super();
		}
		
		/**
		 * 正在进行所有数据源的刷新操作
		 * @member egret.gui.ListBase#_doingWholesaleChanges
		 */		
		public _doingWholesaleChanges:boolean = false;
		
		private dataProviderChanged:boolean = false;

        public _setDataProvider(value):void{
            if (this.dataProvider)
                this.dataProvider.removeEventListener(CollectionEvent.COLLECTION_CHANGE,
                    this.dataProvider_collectionChangeHandler,this);

            this.dataProviderChanged = true;
            this._doingWholesaleChanges = true;

            if (value)
                value.addEventListener(CollectionEvent.COLLECTION_CHANGE,
                    this.dataProvider_collectionChangeHandler,this);

            super._setDataProvider(value);
            this.invalidateProperties();
        }

        /**
         * 布局对象
		 * @member egret.gui.ListBase#layout
         */
        public get layout():LayoutBase{
            return (this.dataGroup)
                ? this.dataGroup.layout
                : this._dataGroupProperties.layout;
        }
		/**
		 * @inheritDoc
		 */
		public set layout(value:LayoutBase){
			if (value && this.useVirtualLayout)
				value.useVirtualLayout = true;
			
			this._setLayout(value);
		}
		
		
		private _labelField:string = "label";
		
        private labelFieldOrFunctionChanged: boolean = false; 
		
		/**
		 * 数据项如果是一个对象，此属性为数据项中用来显示标签文字的字段名称。
		 * 若设置了labelFunction，则设置此属性无效。
		 * @member egret.gui.ListBase#labelField
		 */		
		public get labelField():string{
			return this._labelField;
		}
		
		public set labelField(value:string){
            this._setLabelField(value);
		}

        public _setLabelField(value:string){
            if (value == this._labelField)
                return;
            this._labelField = value;
            this.labelFieldOrFunctionChanged = true;
            this.invalidateProperties();
        }

        private _labelFunction: Function = null; 
		
		/**
		 * 用户提供的函数，在每个项目上运行以确定其标签。
		 * 示例：function labelFunc(item:Object):String 。
		 * @member egret.gui.ListBase#labelFunction
		 */		
		public get labelFunction():Function{
			return this._labelFunction;
		}
		
		public set labelFunction(value:Function){
			this._setLabelFunction(value);
		}

        public _setLabelFunction(value:Function):void{
            if (value == this._labelFunction)
                return;

            this._labelFunction = value;
            this.labelFieldOrFunctionChanged = true;
            this.invalidateProperties();
        }
		
		public _requireSelection:boolean = false;
		
		private requireSelectionChanged:boolean = false;
		
		/**
		 * 如果为 true，则必须始终在控件中选中数据项目。<br/>
		 * 如果该值为 true，则始终将 selectedIndex 属性设置为 0 和 (dataProvider.length - 1) 之间的一个值。 
		 * @member egret.gui.ListBase#requireSelection
		 */		
		public get requireSelection():boolean{
			return this._requireSelection;
		}
		
		public set requireSelection(value:boolean){
			this._setRequireSelection(value);
		}

        public _setRequireSelection(value:boolean):void{
            if (value == this._requireSelection)
                return;

            this._requireSelection = value;

            if (value){
                this.requireSelectionChanged = true;
                this.invalidateProperties();
            }
        }
		
		/**
		 * 在属性提交前缓存真实的选中项的值
		 */
		public _proposedSelectedIndex:number = ListBase.NO_PROPOSED_SELECTION;
		
		public _selectedIndex:number = ListBase.NO_SELECTION;
		
		/**
		 * 选中项目的基于 0 的索引。<br/>
		 * 或者如果未选中项目，则为-1。设置 selectedIndex 属性会取消选择当前选定的项目并选择指定索引位置的数据项目。 <br/>
		 * 当用户通过与控件交互来更改 selectedIndex 属性时，此控件将分派 change 和 changing 事件。<br/>
		 * 当以编程方式更改 selectedIndex 属性的值时，此控件不分派 change 和 changing 事件。
		 * @member egret.gui.ListBase#selectedIndex
		 */		
		public get selectedIndex():number{
			return this._getSelectedIndex();
		}

        public _getSelectedIndex():number{
            if (this._proposedSelectedIndex != ListBase.NO_PROPOSED_SELECTION)
                return this._proposedSelectedIndex;

            return this._selectedIndex;
        }
		
		public set selectedIndex(value:number){
			this._setSelectedIndex(value, false);
		}
		
		/**
		 * 是否允许自定义的选中项
		 */
		public _allowCustomSelectedItem:boolean = false;
		/**
		 * 索引改变后是否需要抛出事件 
		 */
		public _dispatchChangeAfterSelection:boolean = false;
		
		/**
		 * 设置选中项
		 */
		public _setSelectedIndex(value:number, dispatchChangeEvent:boolean = false):void{
			if (value == this.selectedIndex){
				return;
			}
			
			if (dispatchChangeEvent)
				this._dispatchChangeAfterSelection = (this._dispatchChangeAfterSelection || dispatchChangeEvent);
			this._proposedSelectedIndex = value;
			this.invalidateProperties();
		}
		
		
		/**
		 *  在属性提交前缓存真实选中项的数据源
		 */
        public _pendingSelectedItem: any = undefined;
		
        private _selectedItem: any = null;
		
		/**
		 * 当前已选中的项目。设置此属性会取消选中当前选定的项目并选择新指定的项目。<br/>
		 * 当用户通过与控件交互来更改 selectedItem 属性时，此控件将分派 change 和 changing 事件。<br/>
		 * 当以编程方式更改 selectedItem 属性的值时，此控件不分派 change 和 changing 事件。
		 * @member egret.gui.ListBase#selectedItem
		 */		
		public get selectedItem():any{
			if (this._pendingSelectedItem !== undefined)
				return this._pendingSelectedItem;
			
			if (this._allowCustomSelectedItem && this.selectedIndex == ListBase.CUSTOM_SELECTED_ITEM)
				return this._selectedItem;
			
			if (this.selectedIndex == ListBase.NO_SELECTION || this.dataProvider == null)
				return undefined;
			
			return this.dataProvider.length > this.selectedIndex ? this.dataProvider.getItemAt(this.selectedIndex) : undefined;
		}
		
		public set selectedItem(value:any){
			this._setSelectedItem(value, false);
		}
		
		/**
		 * 设置选中项数据源
		 * @method egret.gui.ListBase#_setSelectedItem
		 * @param value {any} 
		 * @param dispatchChangeEvent {boolean} 
		 */
		public _setSelectedItem(value:any, dispatchChangeEvent:boolean = false):void{
			if (this.selectedItem === value)
				return;
			
			if (dispatchChangeEvent)
				this._dispatchChangeAfterSelection = (this._dispatchChangeAfterSelection || dispatchChangeEvent);
			
			this._pendingSelectedItem = value;
			this.invalidateProperties();
		}
		
		private _useVirtualLayout:boolean = false;
		
		/**
		 * 是否使用虚拟布局,默认flase
		 * @member egret.gui.ListBase#useVirtualLayout
		 */
		public get useVirtualLayout():boolean{
			return this._getUseVirtualLayout();
		}

        public _getUseVirtualLayout():boolean{
            return (this.layout) ? this.layout.useVirtualLayout : this._useVirtualLayout;
        }
		
		public set useVirtualLayout(value:boolean){
            this._setUseVirtualLayout(value);
		}

        public _setUseVirtualLayout(value:boolean):void{
            if (value == this.useVirtualLayout)
                return;

            this._useVirtualLayout = value;
            if (this.layout)
                this.layout.useVirtualLayout = value;
        }
		
		
		/**
		 * 处理对组件设置的属性
		 * @method egret.gui.ListBase#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			
			if (this.dataProviderChanged){
				this.dataProviderChanged = false;
				this._doingWholesaleChanges = false;
				
				if (this.selectedIndex >= 0 && this.dataProvider && this.selectedIndex < this.dataProvider.length)
					this.itemSelected(this.selectedIndex, true);
				else if (this.requireSelection)
					this._proposedSelectedIndex = 0;
				else
					this._setSelectedIndex(-1, false);
			}
			
			if (this.requireSelectionChanged){
				this.requireSelectionChanged = false;
				
				if (this.requireSelection &&
					this.selectedIndex == ListBase.NO_SELECTION &&
					this.dataProvider &&
					this.dataProvider.length > 0){
					this._proposedSelectedIndex = 0;
				}
			}
			
			if (this._pendingSelectedItem !== undefined){
				if (this.dataProvider)
					this._proposedSelectedIndex = this.dataProvider.getItemIndex(this._pendingSelectedItem);
				else
					this._proposedSelectedIndex = ListBase.NO_SELECTION;
				
				
				if (this._allowCustomSelectedItem && this._proposedSelectedIndex == -1){
					this._proposedSelectedIndex = ListBase.CUSTOM_SELECTED_ITEM;
					this._selectedItem = this._pendingSelectedItem;
				}
				
				this._pendingSelectedItem = undefined;
			}
			
			var changedSelection:boolean = false;
			if (this._proposedSelectedIndex != ListBase.NO_PROPOSED_SELECTION)
				changedSelection = this.commitSelection();
			
			if (this.selectedIndexAdjusted){
				this.selectedIndexAdjusted = false;
				if (!changedSelection){
                    UIEvent.dispatchUIEvent(this,UIEvent.VALUE_COMMIT);
				}
			}
			
			if (this.labelFieldOrFunctionChanged){
				if (this.dataGroup!=null){
					var itemIndex:number;
					
					if (this.layout && this.layout.useVirtualLayout){
                        var list:Array<number> = this.dataGroup.getElementIndicesInView();
                        var length:number = list.length;
						for (var i:number = 0;i<length;i++){
                            var itemIndex:number = list[i];
							this.updateRendererLabelProperty(itemIndex);
						}
					}
					else{
						var n:number = this.dataGroup.numElements;
						for (itemIndex = 0; itemIndex < n; itemIndex++){
							this.updateRendererLabelProperty(itemIndex);
						}
					}
				}
				
				this.labelFieldOrFunctionChanged = false; 
			}
		}
		
		/**
		 *  更新项呈示器文字标签
		 */
		private updateRendererLabelProperty(itemIndex:number):void{
			var renderer:IItemRenderer = <IItemRenderer><any> (this.dataGroup.getElementAt(itemIndex));
			if (renderer)
				renderer.label = this.itemToLabel(renderer.data); 
		}
		
		/**
		 * 添加外观部件时调用
		 * @method egret.gui.ListBase#partAdded
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.dataGroup){
				if (this._useVirtualLayout && this.dataGroup.layout)
					this.dataGroup.layout.useVirtualLayout = true;
				
				this.dataGroup.addEventListener(
					RendererExistenceEvent.RENDERER_ADD, this.dataGroup_rendererAddHandler, this);
				this.dataGroup.addEventListener(
					RendererExistenceEvent.RENDERER_REMOVE, this.dataGroup_rendererRemoveHandler, this);
			}
		}
		
		/**
		 * 正删除外观部件的实例时调用
		 * @method egret.gui.ListBase#partRemoved
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partRemoved(partName:string, instance:any):void{        
			super.partRemoved(partName, instance);
			
			if (instance == this.dataGroup){
				this.dataGroup.removeEventListener(
					RendererExistenceEvent.RENDERER_ADD, this.dataGroup_rendererAddHandler, this);
				this.dataGroup.removeEventListener(
					RendererExistenceEvent.RENDERER_REMOVE, this.dataGroup_rendererRemoveHandler, this);
			}
		}
		
		/**
		 * 更新项呈示器，以备使用或重用
		 * @method egret.gui.ListBase#updateRenderer
		 * @param renderer {IItemRenderer} 
		 * @param itemIndex {number} 
		 * @param data {any} 
		 * @returns {IItemRenderer}
		 */
		public updateRenderer(renderer:IItemRenderer, itemIndex:number, data:any):IItemRenderer{
			this.itemSelected(itemIndex, this._isItemIndexSelected(itemIndex));
			return super.updateRenderer(renderer, itemIndex, data); 
		}
		
		/**
		 * 如果有一个数据项目，则返回呈示器应该显示的正确文本，同时将 labelField 和 labelFunction 属性考虑在内
		 * @method egret.gui.ListBase#itemToLabel
		 * @param item {any} 
		 * @returns {string}
		 */
		public itemToLabel(item:any):string{
			if (this._labelFunction != null)
				return this._labelFunction(item);
			
			if (typeof(item) == "string")
				return <string> item;
			
			if (item instanceof XML){
				try{
					if (item[this.labelField].length() != 0)
						item = item[this.labelField];
				}
				catch(e){
				}
			}
			else if (item instanceof Object){
				try{
					if (item[this.labelField] != null)
						item = item[this.labelField];
				}
				catch(e){
				}
			}
			
			if (typeof(item) == "string")
				return <string> item;
			
			try{
				if (item !== null)
					return item.toString();
			}
			catch(e){
			}
			
			return " ";
		}
		
		/**
		 * 选中或取消选中项目时调用。子类必须覆盖此方法才可设置选中项。 
		 * @method egret.gui.ListBase#itemSelected
		 * @param index {number} 已选中的项目索引。
		 * @param selected {boolean} true为选中，false取消选中
		 */		
		public itemSelected(index:number, selected:boolean):void{
			if(!this.dataGroup)
				return;
			var renderer:IItemRenderer = <IItemRenderer><any> (this.dataGroup.getElementAt(index));
			if(renderer==null)
				return;
			renderer.selected = selected;
		}
		
		/**
		 * 返回指定索引是否等于当前选中索引
		 */
		public _isItemIndexSelected(index:number):boolean{        
			return index == this.selectedIndex;
		}
		
		/**
		 * 提交选中项属性，返回是否成功提交，false表示被取消
		 * @method egret.gui.ListBase#commitSelection
		 * @param dispatchChangedEvents {boolean} 
		 * @returns {boolean}
		 */		
		public commitSelection(dispatchChangedEvents:boolean = true):boolean{
			var maxIndex:number = this.dataProvider ? this.dataProvider.length - 1 : -1;
			var oldSelectedIndex:number = this._selectedIndex;
			var e:IndexChangeEvent;
			
			if (!this._allowCustomSelectedItem || this._proposedSelectedIndex != ListBase.CUSTOM_SELECTED_ITEM){
				if (this._proposedSelectedIndex < ListBase.NO_SELECTION)
					this._proposedSelectedIndex = ListBase.NO_SELECTION;
				if (this._proposedSelectedIndex > maxIndex)
					this._proposedSelectedIndex = maxIndex;
				if (this.requireSelection && this._proposedSelectedIndex == ListBase.NO_SELECTION && 
					this.dataProvider && this.dataProvider.length > 0){
					this._proposedSelectedIndex = ListBase.NO_PROPOSED_SELECTION;
					this._dispatchChangeAfterSelection = false;
					return false;
				}
			}
			
			var tmpProposedIndex:number = this._proposedSelectedIndex;
			
			if (this._dispatchChangeAfterSelection){
                var result:boolean = IndexChangeEvent.dispatchIndexChangeEvent(this,
                    IndexChangeEvent.CHANGING,this._selectedIndex,this._proposedSelectedIndex,true);
				if (!result){
					this.itemSelected(this._proposedSelectedIndex, false);
					this._proposedSelectedIndex = ListBase.NO_PROPOSED_SELECTION;
					this._dispatchChangeAfterSelection = false;
					return false;
				}
				
			}
			
			this._selectedIndex = tmpProposedIndex;
			this._proposedSelectedIndex = ListBase.NO_PROPOSED_SELECTION;
			
			if (oldSelectedIndex != ListBase.NO_SELECTION)
				this.itemSelected(oldSelectedIndex, false);
			if (this._selectedIndex != ListBase.NO_SELECTION)
				this.itemSelected(this._selectedIndex, true);
		
			//子类若需要自身抛出Change事件，而不是在此处抛出，可以设置dispatchChangedEvents为false
			if (dispatchChangedEvents){
				if (this._dispatchChangeAfterSelection){
                    IndexChangeEvent.dispatchIndexChangeEvent(this,
                        IndexChangeEvent.CHANGE,oldSelectedIndex,this._selectedIndex);
					this._dispatchChangeAfterSelection = false;
				}
                UIEvent.dispatchUIEvent(this,UIEvent.VALUE_COMMIT);;
			}
			
			return true;
		}
		
		private selectedIndexAdjusted:boolean = false;
		/**
		 * 仅调整选中索引值而不更新选中项,即在提交属性阶段itemSelected方法不会被调用，也不会触发changing和change事件。
		 * @method egret.gui.ListBase#adjustSelection
		 * @param newIndex {number} 新索引。
		 * @param add {boolean} 如果已将项目添加到组件，则为 true；如果已删除项目，则为 false。
		 */		
		public adjustSelection(newIndex:number, add:boolean=false):void{
			if (this._proposedSelectedIndex != ListBase.NO_PROPOSED_SELECTION)
				this._proposedSelectedIndex = newIndex;
			else
				this._selectedIndex = newIndex;
			this.selectedIndexAdjusted = true;
			this.invalidateProperties();
		}
		
		/**
		 * 数据项添加
		 * @method egret.gui.ListBase#itemAdded
		 * @param index {number} 
		 */
		public itemAdded(index:number):void{
			if (this._doingWholesaleChanges)
				return;
			
			if (this.selectedIndex == ListBase.NO_SELECTION){
				if (this.requireSelection)
					this.adjustSelection(index,true);
			}
			else if (index <= this.selectedIndex){
				this.adjustSelection(this.selectedIndex + 1,true);
			}
		}
		
		/**
		 * 数据项移除
		 * @method egret.gui.ListBase#itemRemoved
		 * @param index {number} 
		 */
		public itemRemoved(index:number):void{
			if (this.selectedIndex == ListBase.NO_SELECTION || this._doingWholesaleChanges)
				return;
			
			if (index == this.selectedIndex){
				if (this.requireSelection && this.dataProvider && this.dataProvider.length > 0){       
					if (index == 0){
						this._proposedSelectedIndex = 0;
						this.invalidateProperties();
					}
					else 
						this._setSelectedIndex(0, false);
				}
				else
					this.adjustSelection(-1,false);
			}
			else if (index < this.selectedIndex){
				this.adjustSelection(this.selectedIndex - 1,false);
			}
		}
		
		
		/**
		 * 项呈示器被添加
		 * @method egret.gui.ListBase#dataGroup_rendererAddHandler
		 * @param event {RendererExistenceEvent} 
		 */
		public dataGroup_rendererAddHandler(event:RendererExistenceEvent):void{
			var renderer:DisplayObject = <DisplayObject><any> (event.renderer);
			
			if (renderer == null)
				return;
			
			renderer.addEventListener(TouchEvent.TOUCH_ROLL_OVER, this.item_mouseEventHandler, this);
			renderer.addEventListener(TouchEvent.TOUCH_ROLL_OUT, this.item_mouseEventHandler, this);
		}
		/**
		 * 项呈示器被移除
		 * @method egret.gui.ListBase#dataGroup_rendererRemoveHandler
		 * @param event {RendererExistenceEvent} 
		 */		
		public dataGroup_rendererRemoveHandler(event:RendererExistenceEvent):void{
			var renderer:DisplayObject = <DisplayObject> <any>(event.renderer);
			
			if (renderer == null)
				return;
			
			renderer.removeEventListener(TouchEvent.TOUCH_ROLL_OVER, this.item_mouseEventHandler, this);
			renderer.removeEventListener(TouchEvent.TOUCH_ROLL_OUT, this.item_mouseEventHandler, this);
		}
		
		private static TYPE_MAP:any = {rollOver:"itemRollOver",
			rollOut:"itemRollOut"};
		
		/**
		 * 项呈示器鼠标事件
		 */		
		private item_mouseEventHandler(event:TouchEvent):void{
			var type:string = event.type;
			type = ListBase.TYPE_MAP[type];
			if (this.hasEventListener(type)){
				var itemRenderer:IItemRenderer = <IItemRenderer><any> (event.currentTarget);
				this._dispatchListEvent(event,type,itemRenderer);
			}
		}
		/**
		 * 抛出列表事件
		 * @method egret.gui.ListBase#_dispatchListEvent
		 * @param touchEvent {TouchEvent} 相关联的鼠标事件
		 * @param type {string} 事件名称
		 * @param itemRenderer {IItemRenderer} 关联的条目渲染器实例
		 */		
		public _dispatchListEvent(touchEvent:TouchEvent,type:string,itemRenderer:IItemRenderer):void{
			var itemIndex:number = -1;
			if (itemRenderer)
				itemIndex = itemRenderer.itemIndex;
			else
				itemIndex = this.dataGroup.getElementIndex(<IVisualElement> (touchEvent.currentTarget));

            var item:any = this.dataProvider.getItemAt(itemIndex);
            ListEvent.dispatchListEvent(this,
                type,touchEvent,itemIndex,item,itemRenderer);
		}
		
		/**
		 * 数据源发生改变
		 * @method egret.gui.ListBase#dataProvider_collectionChangeHandler
		 * @param event {CollectionEvent} 
		 */
		public dataProvider_collectionChangeHandler(event:CollectionEvent):void{
			var items:Array<any> = event.items;
			if (event.kind == CollectionEventKind.ADD){
				var length:number = items.length;
				for (var i:number = 0; i < length; i++){
					this.itemAdded(event.location + i);
				}
			}
			else if (event.kind == CollectionEventKind.REMOVE){
				length = items.length;
				for (i = length-1; i >= 0; i--){
					this.itemRemoved(event.location + i);
				}
			}
			else if (event.kind == CollectionEventKind.MOVE){
				this.itemRemoved(event.oldLocation);
				this.itemAdded(event.location);
			}
			else if (event.kind == CollectionEventKind.RESET){
				if (this.dataProvider.length == 0){
					this._setSelectedIndex(ListBase.NO_SELECTION, false);
				}
				else{
					this.dataProviderChanged = true; 
					this.invalidateProperties(); 
				}
			}
			else if (event.kind == CollectionEventKind.REFRESH){
				this.dataProviderRefreshed();
			}
		}

		/**
		 * 数据源刷新
		 */
		public dataProviderRefreshed():void{
			this._setSelectedIndex(ListBase.NO_SELECTION, false);
		}
	}
}