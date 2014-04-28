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
/// <reference path="../../../egret/events/TimerEvent.ts"/>
/// <reference path="../../../egret/geom/Rectangle.ts"/>
/// <reference path="../../../egret/utils/Timer.ts"/>
/// <reference path="../collections/ICollection.ts"/>
/// <reference path="supportClasses/GroupBase.ts"/>
/// <reference path="supportClasses/ItemRenderer.ts"/>
/// <reference path="../core/IInvalidating.ts"/>
/// <reference path="../core/ILayoutElement.ts"/>
/// <reference path="../core/ISkinnableClient.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../events/CollectionEvent.ts"/>
/// <reference path="../events/CollectionEventKind.ts"/>
/// <reference path="../events/RendererExistenceEvent.ts"/>
/// <reference path="../layouts/HorizontalAlign.ts"/>
/// <reference path="../layouts/VerticalLayout.ts"/>
/// <reference path="../layouts/supportClasses/LayoutBase.ts"/>

module ns_egret {

	export class DataGroup extends GroupBase{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}

        private static defaultRendererFactory:ClassFactory = new ClassFactory(ItemRenderer);
		
		private _rendererOwner:IItemRendererOwner;
		/**
		 * 项呈示器的主机组件
		 */
		public get rendererOwner():IItemRendererOwner{
			return this._rendererOwner;
		}

		public set rendererOwner(value:IItemRendererOwner){
			this._rendererOwner = value;
		}
		
		
		private useVirtualLayoutChanged:boolean = false;
		
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
			super.layout = value;    
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
		private virtualRendererIndices:Array;
		
		public setVirtualElementIndicesInView(startIndex:number, endIndex:number):void{
			if(!this.layout||!this.layout.useVirtualLayout)
				return;
			this.virtualRendererIndices = [];
			for(var i:number=startIndex;i<=endIndex;i++){
				this.virtualRendererIndices.push(i);
			}
			for(var index:any in this.indexToRenderer){
				if(this.virtualRendererIndices.indexOf(index)==-1){
					this.freeRendererByIndex(index);
				}
			}
		}
		
		/**
		 * @inheritDoc
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
					if(renderer instanceof IInvalidating)
						(<IInvalidating> renderer).validateNow();
					this.createNewRendererFlag = false;
					this.dispatchEvent(new RendererExistenceEvent(RendererExistenceEvent.RENDERER_ADD, 
						false, false, renderer, index, item));
				}
				element = <IVisualElement> renderer;
			}
			return element;
		}
		
		private rendererToClassMap:Array = [];
		private freeRenderers:Array = [];
		
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
			(<DisplayObject> renderer).visible = false;
		}
		
		/**
		 * 是否创建了新的项呈示器标志 
		 */		
		private createNewRendererFlag:boolean = false;
		
		/**
		 * @inheritDoc
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
            var freeRenderers:Array = this.freeRenderers;
			if(freeRenderers[hashCode]&&freeRenderers[hashCode].length>0){
				renderer = freeRenderers[hashCode].pop();
				(<DisplayObject> renderer).visible = true;
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
			if(this.recyclerDic[hashCode]){
				var hasExtra:boolean = false;
				for(var key:any in this.recyclerDic[hashCode]){
					if(!renderer){
						renderer = <IItemRenderer> key;
					}
					else{
						hasExtra = true;
						break;
					}
				}
				delete this.recyclerDic[rendererFactory][renderer];
				if(!hasExtra)
					delete this.recyclerDic[rendererFactory];
			}
			if(!renderer){
				renderer = new <IItemRenderer> (rendererFactory());
				this.rendererToClassMap[renderer.hashCode] = rendererFactory;
			}
			if(!renderer||!(renderer instanceof DisplayObject))
				return null;
			if(this._itemRendererSkinName){
				this.setItemRenderSkinName(renderer);
			}
			super.addChild(<DisplayObject> renderer);
			renderer.setLayoutBoundsSize(NaN,NaN);
			return renderer;
		}
		/**
		 * 设置项呈示器的默认皮肤
		 */		
		private setItemRenderSkinName(renderer:IItemRenderer):void{
			if(!renderer)
				return;
			var comp:SkinnableComponent = <SkinnableComponent> renderer;
			if(comp){
				if(!comp.skinNameExplicitlySet)
					comp.skinName = this._itemRendererSkinName;
			}
			else{
				var client:ISkinnableClient = <ISkinnableClient> renderer;
				if(client&&!client.skinName)
					client.skinName = this._itemRendererSkinName;
			}
		}
		
		private cleanTimer:Timer;
		/**
		 * 虚拟布局结束清理不可见的项呈示器
		 */		
		private finishVirtualLayout():void{
			if(!this.virtualLayoutUnderway)
				return;
			this.virtualLayoutUnderway = false;
			var found:boolean = false;
			for(var hashCode:number in this.freeRenderers){
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
            var freeRenderers:Array = this.freeRenderers;
            for(var hashCode:number in freeRenderers){
                var list:Array = freeRenderers[hashCode];
                var length:number = list.length;
				for(var i:number=0;i<length;i++){
                    renderer = list[i];
					(<DisplayObject> renderer).visible = true;
					this.recycle(renderer);
				}
			}
			this.freeRenderers = [];
			this.cleanFreeRenderer = false;
		}
		
		/**
		 * @inheritDoc
		 */
		public getElementIndicesInView():Array{
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
		
		private _dataProvider:ICollection;
		/**
		 * 列表数据源，请使用实现了ICollection接口的数据类型，例如ArrayCollection
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
						for(var index:any in this.indexToRenderer){
							this.freeRendererByIndex(index);
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
		private itemAddedHandler(items:Array,index:number):void{
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
		private itemRemovedHandler(items:Array,location:number):void{
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
				if (this.virtualRendererIndices){
					const virtualRendererIndicesLength:number = this.virtualRendererIndices.length;
					for (var i:number = 0; i < this.virtualRendererIndicesLength; i++){
						const vrIndex:number = this.virtualRendererIndices[i];
						if (this.vrIndex >= index)
							this.virtualRendererIndices[i] = this.vrIndex + 1;
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
			this.dispatchEvent(new RendererExistenceEvent(RendererExistenceEvent.RENDERER_ADD, 
				false, false, renderer, index, item));
			
		}
		
		/**
		 * 移除一项
		 */		
		private itemRemoved(item:any, index:number):void{
			if (this.layout)
				this.layout.elementRemoved(index);
			if (this.virtualRendererIndices && (this.virtualRendererIndices.length > 0)){
				var vrItemIndex:number = -1; 
				const virtualRendererIndicesLength:number = this.virtualRendererIndices.length;
				for (var i:number = 0; i < this.virtualRendererIndicesLength; i++){
					const vrIndex:number = this.virtualRendererIndices[i];
					if (this.vrIndex == index)
						vrItemIndex = i;
					else if (this.vrIndex > index)
						this.virtualRendererIndices[i] = this.vrIndex - 1;
				}
				if (vrItemIndex != -1)
					this.virtualRendererIndices.splice(vrItemIndex, 1);
			}
			const oldRenderer:IItemRenderer = this.indexToRenderer[index];
			
			if (this.indexToRenderer.length > index)
				this.indexToRenderer.splice(index, 1);
			
			this.dispatchEvent(new RendererExistenceEvent(
				RendererExistenceEvent.RENDERER_REMOVE, false, false, this.oldRenderer, index, item));
			
			if(this.oldRenderer&&this.oldRenderer instanceof DisplayObject){
				this.recycle(this.oldRenderer);
				this.dispatchEvent(new RendererExistenceEvent(RendererExistenceEvent.RENDERER_REMOVE, 
					false, false, this.oldRenderer, this.oldRenderer.itemIndex, this.oldRenderer.data));
			}
		}
		
		/**
		 * 对象池字典
		 */		
		private recyclerDic:Array = [];
		/**
		 * 回收一个ItemRenderer实例
		 */		
		private recycle(renderer:IItemRenderer):void{
			super.removeChild(<DisplayObject> renderer);
			if(renderer instanceof IVisualElement){
				(<IVisualElement> renderer).ownerChanged(null);
			}
			var rendererFactory:IFactory = this.rendererToClassMap[renderer.hashCode];
            var hashCode:number = rendererFactory.hashCode;
			if(!this.recyclerDic[hashCode]){
				this.recyclerDic[hashCode] = new Recycler();
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
				for each (var index:number in this.virtualRendererIndices)
				this.resetRendererItemIndex(index);
			}
			else{
				const indexToRendererLength:number = this.indexToRenderer.length;
				for (index = 0; index < this.indexToRendererLength; index++)
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
		private itemRendererChanged:boolean;
		
		private _itemRenderer:IFactory;
		/**
		 * 用于数据项目的项呈示器。该类必须实现 IItemRenderer 接口。<br/>
		 * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
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
		
		private _itemRendererSkinName:any;
		/**
		 * 条目渲染器的可选皮肤标识符。在实例化itemRenderer时，若其内部没有设置过skinName,则将此属性的值赋值给它的skinName。
		 * 注意:若itemRenderer不是ISkinnableClient，则此属性无效。
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


		private _itemRendererFunction:Function;
		/**
		 * 为某个特定项目返回一个项呈示器Class的函数。<br/>
		 * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。<br/>
		 * 应该定义一个与此示例函数类似的呈示器函数： <br/>
		 * function myItemRendererFunction(item:Object):IFactory
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
		 * @private
		 * 设置默认的ItemRenderer
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
		 * @inheritDoc
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
				var client:ISkinnableClient;
				var comp:SkinnableComponent;
				for(var i:number=0;i<length;i++){
					this.setItemRenderSkinName(this.indexToRenderer[i]);
				}
                var freeRenderers:Array = this.freeRenderers;
				for(var hashCode:number in freeRenderers){
					var list:Array = freeRenderers[hashCode];
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
		 * @inheritDoc
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
		 * @inheritDoc
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			if(this.layoutInvalidateDisplayListFlag&&this.layout&&this.layout.useVirtualLayout){
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
			if(typicalRenderer instanceof IInvalidating)
				(<IInvalidating> typicalRenderer).validateNow();
			var rect:Rectangle = new Rectangle(0,0,typicalRenderer.preferredWidth,
				typicalRenderer.preferredHeight);
			this.recycle(typicalRenderer);
			this.setTypicalLayoutRect(rect);
			this.createNewRendererFlag = false;
		} 
		
		/**
		 * 项呈示器的默认尺寸
		 */		
		private typicalLayoutRect:Rectangle;
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
		private indexToRenderer:Array = [];
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
					this.dispatchEvent(new RendererExistenceEvent(RendererExistenceEvent.RENDERER_REMOVE, 
						false, false, renderer, renderer.itemIndex, renderer.data));
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
				this.dispatchEvent(new RendererExistenceEvent(RendererExistenceEvent.RENDERER_ADD, 
					false, false, renderer, index, item));
				index ++;
			}
		}
		/**
		 * 正在更新数据项的标志
		 */		
		private renderersBeingUpdated:boolean = false;
		
		/**
		 * 更新项呈示器
		 */		
		public updateRenderer(renderer:IItemRenderer, itemIndex:number, data:any):IItemRenderer{
			this.renderersBeingUpdated = true;
			
			if(this._rendererOwner){
				renderer = this._rendererOwner.updateRenderer(renderer,itemIndex,data);
			}
			else {
				if(renderer instanceof IVisualElement){
					(<IVisualElement> renderer).ownerChanged(this);
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
		 */		
		public itemToLabel(item:any):string{
			if (item)
				return item.toString();
			else return " ";
		}
		
		/**
		 * @inheritDoc
		 */
		public getElementAt(index:number):IVisualElement{
			return this.indexToRenderer[index];
		}
		
		/**
		 * @inheritDoc
		 */
		public getElementIndex(element:IVisualElement):number{
			if(!element)
				return -1;
			return this.indexToRenderer.indexOf(element);
		}
		
		/**
		 * @inheritDoc
		 */
		public get numElements():number{
			if(!this._dataProvider)
				return 0;
			return this._dataProvider.length;
		}
		
		private static errorStr:string = "在此组件中不可用，若此组件为容器类，请使用";
		[Deprecated] 
		/**
		 * addChild()在此组件中不可用，若此组件为容器类，请使用addElement()代替
		 */		
		public addChild(child:DisplayObject):DisplayObject{
			throw(new Error("addChild()"+DataGroup.errorStr+"addElement()代替"));
		}
		[Deprecated] 
		/**
		 * addChildAt()在此组件中不可用，若此组件为容器类，请使用addElementAt()代替
		 */		
		public addChildAt(child:DisplayObject, index:number):DisplayObject{
			throw(new Error("addChildAt()"+DataGroup.errorStr+"addElementAt()代替"));
		}
		[Deprecated] 
		/**
		 * removeChild()在此组件中不可用，若此组件为容器类，请使用removeElement()代替
		 */		
		public removeChild(child:DisplayObject):DisplayObject{
			throw(new Error("removeChild()"+DataGroup.errorStr+"removeElement()代替"));
		}
		[Deprecated] 
		/**
		 * removeChildAt()在此组件中不可用，若此组件为容器类，请使用removeElementAt()代替
		 */		
		public removeChildAt(index:number):DisplayObject{
			throw(new Error("removeChildAt()"+DataGroup.errorStr+"removeElementAt()代替"));
		}
		[Deprecated] 
		/**
		 * setChildIndex()在此组件中不可用，若此组件为容器类，请使用setElementIndex()代替
		 */		
		public setChildIndex(child:DisplayObject, index:number):void{
			throw(new Error("setChildIndex()"+DataGroup.errorStr+"setElementIndex()代替"));
		}
		[Deprecated] 
		/**
		 * swapChildren()在此组件中不可用，若此组件为容器类，请使用swapElements()代替
		 */		
		public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
			throw(new Error("swapChildren()"+DataGroup.errorStr+"swapElements()代替"));
		}
		[Deprecated] 
		/**
		 * swapChildrenAt()在此组件中不可用，若此组件为容器类，请使用swapElementsAt()代替
		 */		
		public swapChildrenAt(index1:number, index2:number):void{
			throw(new Error("swapChildrenAt()"+DataGroup.errorStr+"swapElementsAt()代替"));
		}
		
	}
}