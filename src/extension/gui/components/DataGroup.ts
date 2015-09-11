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

/// <reference path="../core/ClassFactory.ts" />
/// <reference path="supportClasses/ItemRenderer.ts" />


module egret.gui {

	/**
	 * @class egret.gui.DataGroup
	 * @classdesc
	 * 数据项目的容器基类
	 * 将数据项目转换为可视元素以进行显示。
	 * @extends egret.gui.GroupBase
	 */
	export class DataGroup extends GroupBase{
		/**
		 * 构造函数
		 * @method egret.gui.DataGroup#constructor
		 */
		public constructor(){
			super();
		}

		/**
		 * @method egret.gui.DataGroup.defaultRendererFactory
		 * @param ClassFactory {any}
		 */
        public static defaultRendererFactory:ClassFactory = new ClassFactory(ItemRenderer);
        /**
         * 项呈示器的主机组件
         */
		public _rendererOwner:IItemRendererOwner = null;

		private useVirtualLayoutChanged:boolean = false;

		/**
		 * @member egret.gui.DataGroup#layout
		 */
        public get layout():LayoutBase{
            return this._layout;
        }
		/**
		 * @inheritDoc
		 */
		public set layout(value:LayoutBase){
			if (value == this.layout)
				return;

			if (this.layout){
				this.layout.typicalLayoutRect = null;
				this.layout.removeEventListener("useVirtualLayoutChanged", this.layout_useVirtualLayoutChangedHandler, this);
			}

			if (this.layout && value && (this.layout.useVirtualLayout != value.useVirtualLayout))
				this.changeUseVirtualLayout();
			this._setLayout(value);
			if (value){
				value.typicalLayoutRect = this.typicalLayoutRect;
				value.addEventListener("useVirtualLayoutChanged", this.layout_useVirtualLayoutChangedHandler, this);
			}
		}

		/**
		 * 是否使用虚拟布局标记改变
		 */
		private layout_useVirtualLayoutChangedHandler(event:Event):void{
			this.changeUseVirtualLayout();
		}

		/**
		 * 存储当前可见的项呈示器索引列表
		 */
		private virtualRendererIndices:Array<number>;

		/**
		 * @method egret.gui.DataGroup#setVirtualElementIndicesInView
		 * @param startIndex {number}
		 * @param endIndex {number}
		 */
		public setVirtualElementIndicesInView(startIndex:number, endIndex:number):void{
			if(!this.layout||!this.layout.useVirtualLayout)
				return;
			this.virtualRendererIndices = [];
			for(var i:number=startIndex;i<=endIndex;i++){
				this.virtualRendererIndices.push(i);
			}
			for(var index in this.indexToRenderer){
                index = parseInt(index);
				if(this.virtualRendererIndices.indexOf(index)==-1){
					this.freeRendererByIndex(index);
				}
			}
		}

		/**
		 * @method egret.gui.DataGroup#getVirtualElementAt
		 * @param index {number}
		 * @returns {IVisualElement}
		 */
		public getVirtualElementAt(index:number):IVisualElement{
			if(index<0||index>=this.dataProvider.length)
				return null;
			var element:IVisualElement = this.indexToRenderer[index];
			if(!element){
				var item:any = this.dataProvider.getItemAt(index);
				var renderer:IItemRenderer = this.createVirtualRenderer(index);
				this.indexToRenderer[index] = renderer;
				this.updateRenderer(renderer,index,item);
				if(this.createNewRendererFlag){
					if("validateNow" in renderer)
						(<IInvalidating><any> renderer).validateNow();
					this.createNewRendererFlag = false;
                    RendererExistenceEvent.dispatchRendererExistenceEvent(this,
                        RendererExistenceEvent.RENDERER_ADD,renderer, index, item);
				}
				element = <IVisualElement><any>renderer;
			}
			return element;
		}

		private rendererToClassMap:Array<any> = [];
		private freeRenderers:Array<any> = [];

		/**
		 * 释放指定索引处的项呈示器
		 */
		private freeRendererByIndex(index:number):void{
			if(!this.indexToRenderer[index])
				return;
			var renderer:IItemRenderer = <IItemRenderer> (this.indexToRenderer[index]);
			delete this.indexToRenderer[index];
			if(renderer&&renderer instanceof DisplayObject){
				this.doFreeRenderer(renderer);
			}
		}
		/**
		 * 释放指定的项呈示器
		 */
		private doFreeRenderer(renderer:IItemRenderer):void{
			var rendererFactory:IFactory = this.rendererToClassMap[renderer.hashCode];
            var hashCode:number = rendererFactory.hashCode;
			if(!this.freeRenderers[hashCode]){
				this.freeRenderers[hashCode] = [];
			}
			this.freeRenderers[hashCode].push(renderer);
			(<DisplayObject><any>renderer).visible = false;
		}

		/**
		 * 是否创建了新的项呈示器标志
		 */
		private createNewRendererFlag:boolean = false;

		/**
		 * 标记组件，以便在稍后屏幕更新期间调用该组件的 measure() 方法
		 * @method egret.gui.DataGroup#invalidateSize
		 */
		public invalidateSize():void{
			if(!this.createNewRendererFlag)//虚拟布局时创建子项不需要重新验证
				super.invalidateSize();
		}

		/**
		 * 为指定索引创建虚拟的项呈示器
		 */
		private createVirtualRenderer(index:number):IItemRenderer{
			var item:any = this.dataProvider.getItemAt(index);
			var renderer:IItemRenderer;
			var rendererFactory:IFactory = this.itemToRendererClass(item);
            var hashCode:number = rendererFactory.hashCode;
            var freeRenderers:Array<any> = this.freeRenderers;
			if(freeRenderers[hashCode]&&freeRenderers[hashCode].length>0){
				renderer = freeRenderers[hashCode].pop();
				(<DisplayObject><any> renderer).visible = true;
				return renderer;
			}
			this.createNewRendererFlag = true;
			return this.createOneRenderer(rendererFactory);
		}
		/**
		 * 根据rendererClass创建一个Renderer,并添加到显示列表
		 */
		private createOneRenderer(rendererFactory:IFactory):IItemRenderer{
			var renderer:IItemRenderer;
            var hashCode:number = rendererFactory.hashCode;
            var recycler:Array<IItemRenderer> = this.recyclerDic[hashCode];
			if(recycler){
                renderer = recycler.pop();
				if(recycler.length==0)
					delete this.recyclerDic[hashCode];
			}
			if(!renderer){
				renderer = <IItemRenderer> (rendererFactory.newInstance());
				this.rendererToClassMap[renderer.hashCode] = rendererFactory;
			}
			if(!renderer||!(renderer instanceof DisplayObject))
				return null;
			if(this._itemRendererSkinName){
				this.setItemRenderSkinName(renderer);
			}
			this._addToDisplayList(<DisplayObject><any>renderer);
			renderer.setLayoutBoundsSize(NaN,NaN);
			return renderer;
		}
		/**
		 * 设置项呈示器的默认皮肤
		 */
		private setItemRenderSkinName(renderer:IItemRenderer):void{
			if(!renderer)
				return;
			var comp:SkinnableComponent = <SkinnableComponent> <any>renderer;
			if(comp){
				if(!comp._skinNameExplicitlySet)
					comp.skinName = this._itemRendererSkinName;
			}
			else{
				var client:ISkinnableClient = <ISkinnableClient> <any>renderer;
				if(client&&!client.skinName)
					client.skinName = this._itemRendererSkinName;
			}
		}

		private cleanTimer:Timer = null;
		/**
		 * 虚拟布局结束清理不可见的项呈示器
		 */
		private finishVirtualLayout():void{
			if(!this.virtualLayoutUnderway)
				return;
			this.virtualLayoutUnderway = false;
			var found:boolean = false;
			for(var hashCode in this.freeRenderers){
				if(this.freeRenderers[hashCode].length>0){
					found = true;
					break;
				}
			}
			if(!found)
				return;
			if(!this.cleanTimer){
				this.cleanTimer = new Timer(3000,1);
				this.cleanTimer.addEventListener(TimerEvent.TIMER,this.cleanAllFreeRenderer,this);
			}
			//为了提高持续滚动过程中的性能，防止反复地添加移除子项，这里不直接清理而是延迟后在滚动停止时清理一次。
			this.cleanTimer.reset();
			this.cleanTimer.start();
		}
		/**
		 * 延迟清理多余的在显示列表中的ItemRenderer。
		 */
		private cleanAllFreeRenderer(event:TimerEvent=null):void{
			var renderer:IItemRenderer;
            var freeRenderers:Array<any> = this.freeRenderers;
            for(var hashCode in freeRenderers){
                var list:Array<any> = freeRenderers[hashCode];
                var length:number = list.length;
				for(var i:number=0;i<length;i++){
                    renderer = list[i];
					(<DisplayObject> <any>renderer).visible = true;
					this.recycle(renderer);
				}
			}
			this.freeRenderers = [];
			this.cleanFreeRenderer = false;
		}

		/**
		 * @method egret.gui.DataGroup#getElementIndicesInView
		 * @returns {number}
		 */
		public getElementIndicesInView():Array<number>{
			if(this.layout&&this.layout.useVirtualLayout)
				return this.virtualRendererIndices?this.virtualRendererIndices:[];
			return super.getElementIndicesInView();
		}

		/**
		 * 更改是否使用虚拟布局
		 */
		private changeUseVirtualLayout():void{
			this.useVirtualLayoutChanged = true;
			this.cleanFreeRenderer = true;
			this.removeDataProviderListener();
			this.invalidateProperties();
		}

		private dataProviderChanged:boolean = false;

		private _dataProvider:ICollection = null;
		/**
		 * 列表数据源，请使用实现了ICollection接口的数据类型，例如ArrayCollection
		 * @member egret.gui.DataGroup#dataProvider
		 */
		public get dataProvider():ICollection{
			return this._dataProvider;
		}

		public set dataProvider(value:ICollection){
			if(this._dataProvider==value)
				return;
			this.removeDataProviderListener();
			this._dataProvider = value;
			this.dataProviderChanged = true;
			this.cleanFreeRenderer = true;
			this.invalidateProperties();
			this.invalidateSize();
			this.invalidateDisplayList();
		}
		/**
		 * 移除数据源监听
		 */
		private removeDataProviderListener():void{
			if(this._dataProvider)
				this._dataProvider.removeEventListener(CollectionEvent.COLLECTION_CHANGE,this.onCollectionChange,this);
		}
		/**
		 * 数据源改变事件处理
		 */
		private onCollectionChange(event:CollectionEvent):void{
			switch(event.kind){
				case CollectionEventKind.ADD:
					this.itemAddedHandler(event.items,event.location);
					break;
				case CollectionEventKind.MOVE:
					this.itemMovedHandler(event.items[0],event.location,event.oldLocation);
					break;
				case CollectionEventKind.REMOVE:
					this.itemRemovedHandler(event.items,event.location);
					break;
				case CollectionEventKind.UPDATE:
					this.itemUpdatedHandler(event.items[0],event.location);
					break;
				case CollectionEventKind.REPLACE:
					this.itemRemoved(event.oldItems[0],event.location);
					this.itemAdded(event.items[0], event.location);
					break;
				case CollectionEventKind.RESET:
				case CollectionEventKind.REFRESH:
					if(this.layout&&this.layout.useVirtualLayout){
						for(var index in this.indexToRenderer){
                            index = parseInt(index);
							this.freeRendererByIndex(<number>index);
						}
					}
					this.dataProviderChanged = true;
					this.invalidateProperties();
					break;
			}
			this.invalidateSize();
			this.invalidateDisplayList();
		}

		/**
		 * 数据源添加项目事件处理
		 */
		private itemAddedHandler(items:Array<any>,index:number):void{
			var length:number = items.length;
			for (var i:number = 0; i < length; i++){
				this.itemAdded(items[i], index + i);
			}
			this.resetRenderersIndices();
		}
		/**
		 * 数据源移动项目事件处理
		 */
		private itemMovedHandler(item:any,location:number,oldLocation:number):void{
			this.itemRemoved(item,oldLocation);
			this.itemAdded(item,location);
			this.resetRenderersIndices();
		}
		/**
		 * 数据源移除项目事件处理
		 */
		private itemRemovedHandler(items:Array<any>,location:number):void{
			var length:number = items.length;
			for (var i:number = length-1; i >= 0; i--){
				this.itemRemoved(items[i], location + i);
			}

			this.resetRenderersIndices();
		}
		/**
		 * 添加一项
		 */
		private itemAdded(item:any,index:number):void{
			if (this.layout)
				this.layout.elementAdded(index);

			if (this.layout && this.layout.useVirtualLayout){
                var virtualRendererIndices:Array<any> = this.virtualRendererIndices;
				if (virtualRendererIndices){
					var length:number = virtualRendererIndices.length;
					for (var i:number = 0; i < length; i++){
						var vrIndex:number = virtualRendererIndices[i];
						if (vrIndex >= index)
							virtualRendererIndices[i] = vrIndex + 1;
					}
					this.indexToRenderer.splice(index, 0, null);
				}
				return;
			}
			var rendererFactory:IFactory = this.itemToRendererClass(item);
			var renderer:IItemRenderer = this.createOneRenderer(rendererFactory);
			this.indexToRenderer.splice(index,0,renderer);
			if(!renderer)
				return;
			this.updateRenderer(renderer,index,item);
            RendererExistenceEvent.dispatchRendererExistenceEvent(this,
                RendererExistenceEvent.RENDERER_ADD,renderer, index, item);
		}

		/**
		 * 移除一项
		 */
		private itemRemoved(item:any, index:number):void{
			if (this.layout)
				this.layout.elementRemoved(index);
            var virtualRendererIndices:Array<any> = this.virtualRendererIndices;
			if (virtualRendererIndices && (virtualRendererIndices.length > 0)){
				var vrItemIndex:number = -1;
				var length:number = virtualRendererIndices.length;
				for (var i:number = 0; i < length; i++){
					var vrIndex:number = virtualRendererIndices[i];
					if (vrIndex == index)
						vrItemIndex = i;
					else if (vrIndex > index)
						virtualRendererIndices[i] = vrIndex - 1;
				}
				if (vrItemIndex != -1)
					virtualRendererIndices.splice(vrItemIndex, 1);
			}
			var oldRenderer:IItemRenderer = this.indexToRenderer[index];

			if (this.indexToRenderer.length > index)
				this.indexToRenderer.splice(index, 1);

            RendererExistenceEvent.dispatchRendererExistenceEvent(this,
                RendererExistenceEvent.RENDERER_REMOVE,oldRenderer, index, item);

			if(oldRenderer&&oldRenderer instanceof DisplayObject){
				this.recycle(oldRenderer);
			}
		}

		/**
		 * 对象池字典
		 */
		private recyclerDic:Object = {};
		/**
		 * 回收一个ItemRenderer实例
		 */
		private recycle(renderer:IItemRenderer):void{
			this._removeFromDisplayList(<DisplayObject><any> renderer);
			if("ownerChanged" in renderer){
				(<IVisualElement> <any>renderer).ownerChanged(null);
			}
			var rendererFactory:IFactory = this.rendererToClassMap[renderer.hashCode];
            var hashCode:number = rendererFactory.hashCode;
			if(!this.recyclerDic[hashCode]){
				this.recyclerDic[hashCode] = [];
			}
			this.recyclerDic[hashCode].push(renderer);
		}
		/**
		 * 更新当前所有项的索引
		 */
		private resetRenderersIndices():void{
			if (this.indexToRenderer.length == 0)
				return;

			if (this.layout && this.layout.useVirtualLayout){
                var virtualRendererIndices:Array<any> = this.virtualRendererIndices;
                var length:number =  virtualRendererIndices.length;
				for(var i:number=0;i<length;i++){
                    var index:number = virtualRendererIndices[i];
				    this.resetRendererItemIndex(index);
                }
			}
			else{
				var indexToRendererLength:number = this.indexToRenderer.length;
				for (index = 0; index < indexToRendererLength; index++)
					this.resetRendererItemIndex(index);
			}
		}
		/**
		 * 数据源更新或替换项目事件处理
		 */
		private itemUpdatedHandler(item:any,location:number):void{
			if (this.renderersBeingUpdated)
				return;//防止无限循环

			var renderer:IItemRenderer = this.indexToRenderer[location];
			if(renderer)
				this.updateRenderer(renderer,location,item);
		}
		/**
		 * 调整指定项呈示器的索引值
		 */
		private resetRendererItemIndex(index:number):void{
			var renderer:IItemRenderer = <IItemRenderer> (this.indexToRenderer[index]);
			if (renderer)
				renderer.itemIndex = index;
		}


		/**
		 * 项呈示器改变
		 */
		private itemRendererChanged:boolean = false;
        /**
         * 这里不直接使用Class类型是因为JS里不能用对象作为键，所以需要hashCode。而只有实例对象才有hashCode，Class无法作为键。
         */
		private _itemRenderer:IFactory = null;
		/**
		 * 用于数据项目的项呈示器。该类必须实现 IItemRenderer 接口。<br/>
		 * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
		 * @member egret.gui.DataGroup#itemRenderer
		 */
		public get itemRenderer():IFactory{
			return this._itemRenderer;
		}

		public set itemRenderer(value:IFactory){
			if(this._itemRenderer===value)
				return;
			this._itemRenderer = value;
			this.itemRendererChanged = true;
			this.typicalItemChanged = true;
			this.cleanFreeRenderer = true;
			this.removeDataProviderListener();
			this.invalidateProperties();
		}

		private itemRendererSkinNameChange:boolean = false;

		private _itemRendererSkinName:any = null;
		/**
		 * 条目渲染器的可选皮肤标识符。在实例化itemRenderer时，若其内部没有设置过skinName,则将此属性的值赋值给它的skinName。
		 * 注意:若itemRenderer不是ISkinnableClient，则此属性无效。
		 * @member egret.gui.DataGroup#itemRendererSkinName
		 */
		public get itemRendererSkinName():any{
			return this._itemRendererSkinName;
		}
		public set itemRendererSkinName(value:any){
			if(this._itemRendererSkinName==value)
				return;
			this._itemRendererSkinName = value;
			if(this._itemRendererSkinName&&this.initialized){
				this.itemRendererSkinNameChange = true;
				this.invalidateProperties();
			}
		}


		private _itemRendererFunction:Function = null;
		/**
		 * 为某个特定项目返回一个项呈示器Class的函数。<br/>
		 * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。<br/>
		 * 应该定义一个与此示例函数类似的呈示器函数： <br/>
		 * function myItemRendererFunction(item:Object):IFactory
		 * @member egret.gui.DataGroup#itemRendererFunction
		 */
		public get itemRendererFunction():Function{
			return this._itemRendererFunction;
		}

		public set itemRendererFunction(value:Function){
			if(this._itemRendererFunction==value)
				return;
			this._itemRendererFunction = value;

			this.itemRendererChanged = true;
			this.typicalItemChanged = true;
			this.removeDataProviderListener();
			this.invalidateProperties();
		}
		/**
		 * 为特定的数据项返回项呈示器的工厂实例
		 */
		private itemToRendererClass(item:any):IFactory{
			var rendererFactory:IFactory;
			if(this._itemRendererFunction!=null){
				rendererFactory = this._itemRendererFunction(item);
				if(!rendererFactory)
					rendererFactory = this._itemRenderer;
			}
			else{
				rendererFactory = this._itemRenderer;
			}
			return rendererFactory?rendererFactory:DataGroup.defaultRendererFactory;
		}

		/**
		 * @method egret.gui.DataGroup#createChildren
         * 设置默认的ItemRenderer
		 * @private
		 *
		 */
		public createChildren():void{
			if(!this.layout){
				var _layout:VerticalLayout = new VerticalLayout();
				_layout.gap = 0;
				_layout.horizontalAlign = HorizontalAlign.CONTENT_JUSTIFY;
				this.layout = _layout;
			}
			super.createChildren();
		}


		/**
		 * 处理对组件设置的属性
		 * @method egret.gui.DataGroup#commitProperties
		 */
		public commitProperties():void{
			if(this.itemRendererChanged||this.dataProviderChanged||this.useVirtualLayoutChanged){
				this.removeAllRenderers();
				if(this.layout)
					this.layout.clearVirtualLayoutCache();
				this.setTypicalLayoutRect(null);
				this.useVirtualLayoutChanged = false;
				this.itemRendererChanged = false;
				if(this._dataProvider)
					this._dataProvider.addEventListener(CollectionEvent.COLLECTION_CHANGE,this.onCollectionChange,this);
				if(this.layout&&this.layout.useVirtualLayout){
					this.invalidateSize();
					this.invalidateDisplayList();
				}
				else{
					this.createRenderers();
				}
				if(this.dataProviderChanged){
					this.dataProviderChanged = false;
					this.verticalScrollPosition = this.horizontalScrollPosition = 0;
				}
			}

			super.commitProperties();

			if(this.typicalItemChanged){
				this.typicalItemChanged = false;
				if (this._dataProvider&&this._dataProvider.length > 0){
					this.typicalItem = this._dataProvider.getItemAt(0);
					this.measureRendererSize();
				}
			}
			if(this.itemRendererSkinNameChange){
				this.itemRendererSkinNameChange = false;
				var length:number = this.indexToRenderer.length;
				for(var i:number=0;i<length;i++){
					this.setItemRenderSkinName(this.indexToRenderer[i]);
				}
                var freeRenderers:Array<any> = this.freeRenderers;
				for(var hashCode in freeRenderers){
					var list:Array<any> = freeRenderers[hashCode];
					if(list){
						length = list.length;
						for(i=0;i<length;i++){
							this.setItemRenderSkinName(list[i]);
						}
					}
				}
			}
		}

		/**
		 * 计算组件的默认大小和（可选）默认最小大小
		 * @method egret.gui.DataGroup#measure
		 */
		public measure():void{
			if(this.layout&&this.layout.useVirtualLayout){
				this.ensureTypicalLayoutElement();
			}
			super.measure();
		}

		/**
		 * 正在进行虚拟布局阶段
		 */
		private virtualLayoutUnderway:boolean = false;

		/**
		 * 绘制对象和/或设置其子项的大小和位置
		 * @method egret.gui.DataGroup#updateDisplayList
		 * @param unscaledWidth {number}
		 * @param unscaledHeight {number}
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			if(this._layoutInvalidateDisplayListFlag&&this.layout&&this.layout.useVirtualLayout){
				this.virtualLayoutUnderway = true;
				this.ensureTypicalLayoutElement();
			}
			super.updateDisplayList(unscaledWidth,unscaledHeight);
			if(this.virtualLayoutUnderway)
				this.finishVirtualLayout();
		}

		/**
		 * 用于测试默认大小的数据
		 */
		private typicalItem:any

		private typicalItemChanged:boolean = false;
		/**
		 * 确保测量过默认条目大小。
		 */
		private ensureTypicalLayoutElement():void{
			if (this.layout.typicalLayoutRect)
				return;

			if (this._dataProvider&&this._dataProvider.length > 0){
				this.typicalItem = this._dataProvider.getItemAt(0);
				this.measureRendererSize();
			}
		}

		/**
		 * 测量项呈示器默认尺寸
		 */
		private measureRendererSize():void{
			if(!this.typicalItem){
				this.setTypicalLayoutRect(null);
				return;
			}
			var rendererFactory:IFactory = this.itemToRendererClass(this.typicalItem);
			var typicalRenderer:IItemRenderer = this.createOneRenderer(rendererFactory);
			if(!typicalRenderer){
				this.setTypicalLayoutRect(null);
				return;
			}
			this.createNewRendererFlag = true;
			this.updateRenderer(typicalRenderer,0,this.typicalItem);
			if("validateNow" in typicalRenderer)
				(<IInvalidating> <any>typicalRenderer).validateNow();
			var rect:Rectangle = new Rectangle(0,0,typicalRenderer.preferredWidth,
				typicalRenderer.preferredHeight);
			this.recycle(typicalRenderer);
			this.setTypicalLayoutRect(rect);
			this.createNewRendererFlag = false;
		}

		/**
		 * 项呈示器的默认尺寸
		 */
		private typicalLayoutRect:Rectangle = null;
		/**
		 * 设置项目默认大小
		 */
		private setTypicalLayoutRect(rect:Rectangle):void{
			this.typicalLayoutRect = rect;
			if(this.layout)
				this.layout.typicalLayoutRect = rect;
		}


		/**
		 * 索引到项呈示器的转换数组
		 */
		private indexToRenderer:Array<any> = [];
		/**
		 * 清理freeRenderer标志
		 */
		private cleanFreeRenderer:boolean = false;
		/**
		 * 移除所有项呈示器
		 */
		private removeAllRenderers():void{
			var length:number = this.indexToRenderer.length;
			var renderer:IItemRenderer;
			for(var i:number=0;i<length;i++){
				renderer = this.indexToRenderer[i];
				if(renderer){
					this.recycle(renderer);
                    RendererExistenceEvent.dispatchRendererExistenceEvent(this,
                        RendererExistenceEvent.RENDERER_REMOVE,renderer, renderer.itemIndex, renderer.data);
				}
			}
			this.indexToRenderer = [];
			this.virtualRendererIndices = null;
			if(!this.cleanFreeRenderer)
				return;
			this.cleanAllFreeRenderer();
		}

		/**
		 * 为数据项创建项呈示器
		 */
		private createRenderers():void{
			if(!this._dataProvider)
				return;
			var index:number = 0;
			var length:number = this._dataProvider.length;
			for(var i:number=0;i<length;i++){
				var item:any = this._dataProvider.getItemAt(i);
				var rendererFactory:IFactory = this.itemToRendererClass(item);
				var renderer:IItemRenderer = this.createOneRenderer(rendererFactory);
				if(!renderer)
					continue;
				this.indexToRenderer[index] = renderer;
				this.updateRenderer(renderer,index,item);
                RendererExistenceEvent.dispatchRendererExistenceEvent(this,
                    RendererExistenceEvent.RENDERER_ADD,renderer, index, item);
				index ++;
			}
		}
		/**
		 * 正在更新数据项的标志
		 */
		private renderersBeingUpdated:boolean = false;

		/**
		 * 更新项呈示器
		 * @method egret.gui.DataGroup#updateRenderer
		 * @param renderer {IItemRenderer}
		 * @param itemIndex {number}
		 * @param data {any}
		 * @returns {IItemRenderer}
		 */
		public updateRenderer(renderer:IItemRenderer, itemIndex:number, data:any):IItemRenderer{
			this.renderersBeingUpdated = true;

			if(this._rendererOwner){
				renderer = this._rendererOwner.updateRenderer(renderer,itemIndex,data);
			}
			else {
				if("ownerChanged" in renderer){
					(<IVisualElement><any> renderer).ownerChanged(this);
				}
				renderer.itemIndex = itemIndex;
				renderer.label = this.itemToLabel(data);
				renderer.data = data;
			}

			this.renderersBeingUpdated = false;
			return renderer;
		}

		/**
		 * 返回可在项呈示器中显示的 String。
		 * 若DataGroup被作为SkinnableDataContainer的皮肤组件,此方法将不会执行，被SkinnableDataContainer.itemToLabel()所替代。
		 * @method egret.gui.DataGroup#itemToLabel
		 * @param item {any}
		 * @returns {string}
		 */
		public itemToLabel(item:any):string{
			if (item)
				return item.toString();
			else return " ";
		}

		/**
		 * 返回位于指定索引处的子显示对象实例
		 * @method egret.gui.DataGroup#getElementAt
		 * @param index {number}
		 * @returns {IVisualElement}
		 */
		public getElementAt(index:number):IVisualElement{
			return this.indexToRenderer[index];
		}

		/**
		 * 返回 element 实例的索引位置
		 * @method egret.gui.DataGroup#getElementIndex
		 * @param element {IVisualElement}
		 * @returns {number}
		 */
		public getElementIndex(element:IVisualElement):number{
			if(!element)
				return -1;
			return this.indexToRenderer.indexOf(element);
		}

		/**
		 * 获得对象容器的子对象总数
		 * @member egret.gui.DataGroup#numElements
		 */
		public get numElements():number{
			if(!this._dataProvider)
				return 0;
			return this._dataProvider.length;
		}

		/**
		 * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中
		 * @method egret.gui.DataGroup#addChild
		 * @deprecated
		 * @param child {DisplayObject}
		 * @returns {DisplayObject}
		 */
		public addChild(child:DisplayObject):DisplayObject{
			egret.$error(3004, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中
		 * @method egret.gui.DataGroup#addChildAt
		 * @deprecated
		 * @param child {DisplayObject}
		 * @param index {number}
		 * @returns {DisplayObject}
		 */
		public addChildAt(child:DisplayObject, index:number):DisplayObject{
			egret.$error(3005, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 从 DisplayObjectContainer 实例的子列表中删除指定的 child DisplayObject 实例
		 * @method egret.gui.DataGroup#removeChild
		 * @deprecated
		 * @param child {DisplayObject}
		 * @returns {DisplayObject}
		 */
		public removeChild(child:DisplayObject):DisplayObject{
			egret.$error(3006, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 从 DisplayObjectContainer 的子列表中指定的 index 位置删除子 DisplayObject
		 * @method egret.gui.DataGroup#removeChildAt
		 * @deprecated
		 * @param index {number}
		 * @returns {DisplayObject}
		 */
		public removeChildAt(index:number):DisplayObject{
			egret.$error(3007, egret.sys.tr(3003));
			return null;
		}
		/**
		 * 更改现有子项在显示对象容器中的位置
		 * @method egret.gui.DataGroup#setChildIndex
		 * @deprecated
		 * @param child {DisplayObject}
		 * @param index {number}
		 */
		public setChildIndex(child:DisplayObject, index:number):void{
			egret.$error(3008, egret.sys.tr(3003));
		}
		/**
		 * 交换两个指定子对象的 Z 轴顺序（从前到后顺序）
		 * @method egret.gui.DataGroup#swapChildren
		 * @deprecated
		 * @param child1 {DisplayObject}
		 * @param child2 {DisplayObject}
		 */
		public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
			egret.$error(3009, egret.sys.tr(3003));
		}
		/**
		 * 在子级列表中两个指定的索引位置，交换子对象的 Z 轴顺序（前后顺序）
		 * @method egret.gui.DataGroup#swapChildrenAt
		 * @deprecated
		 * @param index1 {number}
		 * @param index2 {number}
		 */
		public swapChildrenAt(index1:number, index2:number):void{
			egret.$error(3010, egret.sys.tr(3003));
		}

	}
}
