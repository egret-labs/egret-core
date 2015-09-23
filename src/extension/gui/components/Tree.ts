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
/// <reference path="./supportClasses/TreeItemRenderer.ts" />

module egret.gui {

	/**
	 * @class egret.gui.Tree
	 * @classdesc
	 * 树状列表组件
	 * @extends egret.gui.List
	 */
	export class Tree extends List{
		/**
		 * 构造函数
		 * @method egret.gui.Tree#constructor
		 */
		public constructor(){
			super();

		}

        public static defaultTreeRendererFactory:ClassFactory = new ClassFactory(TreeItemRenderer);
		/**
		 * 创建该容器的子元素对象
		 * @method egret.gui.Tree#createChildren
		 */
		public createChildren():void{
			if(!this.itemRenderer)
				this.itemRenderer = Tree.defaultTreeRendererFactory;
			super.createChildren();
		}

		/**
		 * 更新项呈示器，以备使用或重用
		 * @method egret.gui.Tree#updateRenderer
		 * @param renderer {IItemRenderer}
		 * @param itemIndex {number}
		 * @param data {any}
		 * @returns {IItemRenderer}
		 */
		public updateRenderer(renderer:IItemRenderer, itemIndex:number, data:any):IItemRenderer{
			if("hasChildren" in renderer&&"hasChildren" in this.dataProvider){
				var treeCollection:ITreeCollection = <ITreeCollection><any> (this.dataProvider);
				var treeRenderer:ITreeItemRenderer = <ITreeItemRenderer><any> renderer;
				treeRenderer.hasChildren = treeCollection.hasChildren(data);
				treeRenderer.opened = treeCollection.isItemOpen(data);
				treeRenderer.depth = treeCollection.getDepth(data);
				treeRenderer.iconSkinName = this.itemToIcon(data);
			}
			return super.updateRenderer(renderer, itemIndex, data);
		}
		/**
		 * 根据数据项返回项呈示器中图标的skinName属性值
		 * @method egret.gui.Tree#itemToIcon
		 * @param data {any}
		 * @returns {any}
		 */
		public itemToIcon(data:any):any{
			if(!data)
				return null;

			if(this._iconFunction!=null)
				return this._iconFunction(data);

			var skinName:any;
			if(data instanceof Object){
				try{
					if(data[this.iconField]){
						skinName = data[this.iconField];
					}
				}
				catch(e){
				}
			}
			return skinName;
		}

		/**
		 * @method egret.gui.Tree#dataGroup_rendererAddHandler
		 * @param event {RendererExistenceEvent}
		 */
		public dataGroup_rendererAddHandler(event:RendererExistenceEvent):void{
			super.dataGroup_rendererAddHandler(event);
			if(event.renderer&&"hasChildren" in event.renderer)
				event.renderer.addEventListener(TreeEvent.ITEM_OPENING,this.onItemOpening,this);
		}
		/**
		 * 节点即将打开
		 */
		private onItemOpening(event:TreeEvent):void{
			var renderer:ITreeItemRenderer = event.itemRenderer;
			var item:any = event.item;
            var dp:ICollection = this._getDataProvider();
			if(!renderer||!dp||!("hasChildren" in dp))
				return;
			if(this.dispatchEvent(event)){
				var opend:boolean = !renderer.opened;
				(<ITreeCollection><any> dp).expandItem(item,opend);
				var type:string = opend?TreeEvent.ITEM_OPEN:TreeEvent.ITEM_CLOSE;
                TreeEvent.dispatchTreeEvent(this,type,renderer.itemIndex,item,renderer);
			}
		}

		/**
		 * @method egret.gui.Tree#dataGroup_rendererRemoveHandler
		 * @param event {RendererExistenceEvent}
		 */
		public dataGroup_rendererRemoveHandler(event:RendererExistenceEvent):void{
			super.dataGroup_rendererRemoveHandler(event);
			if(event.renderer&&"hasChildren" in event.renderer)
				event.renderer.removeEventListener(TreeEvent.ITEM_OPENING,this.onItemOpening,this);
		}
		/**
		 * 图标字段或函数改变标志
		 */
		private iconFieldOrFunctionChanged:boolean = false;

        private _iconField: string = null;
		/**
		 * 数据项中用来确定图标skinName属性值的字段名称。另请参考UIAsset.skinName。
		 * 若设置了iconFunction，则设置此属性无效。
		 * @member egret.gui.Tree#iconField
		 */
		public get iconField():string{
			return this._iconField;
		}
		public set iconField(value:string){
			if(this._iconField==value)
				return;
			this._iconField = value;
			this.iconFieldOrFunctionChanged = true;
			this.invalidateProperties();
		}

        private _iconFunction: Function = null;
		/**
		 * 用户提供的函数，在每个数据项目上运行以确定其图标的skinName值。另请参考UIAsset.skinName。
		 * 示例：iconFunction(item:Object):Object
		 * @member egret.gui.Tree#iconFunction
		 */
		public get iconFunction():Function{
			return this._iconFunction;
		}
		public set iconFunction(value:Function){
			if(this._iconFunction==value)
				return;
			this._iconFunction = value;
			this.iconFieldOrFunctionChanged = true;
			this.invalidateProperties();
		}
		/**
		 * 打开或关闭一个节点,注意，此操作不会抛出open或close事件。
		 * @method egret.gui.Tree#expandItem
		 * @param item {any} 要打开或关闭的节点
		 * @param open {boolean} true表示打开节点，反之关闭。
		 */
		public expandItem(item:any,open:boolean = true):void{
            var dp:ICollection = this._getDataProvider();
            if(!dp||!("hasChildren" in dp))
				return;
			(<ITreeCollection><any> (dp)).expandItem(item,open);
		}
		/**
		 * 指定的节点是否打开
		 * @method egret.gui.Tree#isItemOpen
		 * @param item {any}
		 * @returns {boolean}
		 */
		public isItemOpen(item:any):boolean{
            var dp:ICollection = this._getDataProvider();
			if(!dp||!("hasChildren" in dp))
				return false;
			return (<ITreeCollection><any> (dp)).isItemOpen(item);
		}

		/**
		 * @method egret.gui.Tree#dataProvider_collectionChangeHandler
		 * @param event {CollectionEvent}
		 */
		public dataProvider_collectionChangeHandler(event:CollectionEvent):void{
			super.dataProvider_collectionChangeHandler(event);
			if(event.kind == CollectionEventKind.OPEN||event.kind == CollectionEventKind.CLOSE){
				var renderer:ITreeItemRenderer = this.dataGroup?
					<ITreeItemRenderer><any> (this.dataGroup.getElementAt(event.location)):null;
				if(renderer){
					this.updateRenderer(renderer,event.location,event.items[0]);
					if(event.kind == CollectionEventKind.CLOSE&&this.layout&&this.layout.useVirtualLayout){
						this.layout.clearVirtualLayoutCache();
						this.invalidateSize();
					}
				}
			}
		}

		/**
		 * 处理对组件设置的属性
		 * @method egret.gui.Tree#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			if(this.iconFieldOrFunctionChanged){
				if(this.dataGroup!=null){
					var itemIndex:number;
					if(this.layout && this.layout.useVirtualLayout){
                        var list:Array<number> = this.dataGroup.getElementIndicesInView();
                        var length:number = list.length;
						for (var i:number=0;i<length;i++){
                            var itemIndex:number = list[i];
							this.updateRendererIconProperty(itemIndex);
						}
					}
					else{
						var n:number = this.dataGroup.numElements;
						for (itemIndex = 0; itemIndex < n; itemIndex++){
							this.updateRendererIconProperty(itemIndex);
						}
					}
				}
				this.iconFieldOrFunctionChanged = false;
			}
		}
		/**
		 * 更新指定索引项的图标
		 */
		private updateRendererIconProperty(itemIndex:number):void{
			var renderer:ITreeItemRenderer = <ITreeItemRenderer><any> (this.dataGroup.getElementAt(itemIndex));
			if (renderer)
				renderer.iconSkinName = this.itemToIcon(renderer.data);
		}
	}
}
