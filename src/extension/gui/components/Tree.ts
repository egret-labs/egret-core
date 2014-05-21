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

/// <reference path="../../../egret/utils/XML.ts"/>
/// <reference path="../collections/ICollection.ts"/>
/// <reference path="../collections/ITreeCollection.ts"/>
/// <reference path="IItemRenderer.ts"/>
/// <reference path="ITreeItemRenderer.ts"/>
/// <reference path="List.ts"/>
/// <reference path="supportClasses/TreeItemRenderer.ts"/>
/// <reference path="../events/CollectionEvent.ts"/>
/// <reference path="../events/CollectionEventKind.ts"/>
/// <reference path="../events/RendererExistenceEvent.ts"/>
/// <reference path="../events/TreeEvent.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.Tree
	 * @classdesc
	 * 树状列表组件
	 * @extends ns_egret.List
	 */
	export class Tree extends List{
		/**
		 * 构造函数
		 * @method ns_egret.Tree#constructor
		 */		
		public constructor(){
			super();
		}
		
		/**
		 * @method ns_egret.Tree#createChildren
		 */
		public createChildren():void{
			if(!this.itemRenderer)
				this.itemRenderer = TreeItemRenderer;
			super.createChildren();
		}
		
		/**
		 * @method ns_egret.Tree#updateRenderer
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
		 * @method ns_egret.Tree#itemToIcon
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
		 * @method ns_egret.Tree#dataGroup_rendererAddHandler
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
		 * @method ns_egret.Tree#dataGroup_rendererRemoveHandler
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
		
		private _iconField:string;
		/**
		 * 数据项中用来确定图标skinName属性值的字段名称。另请参考UIAsset.skinName。
		 * 若设置了iconFunction，则设置此属性无效。
		 * @member ns_egret.Tree#iconField
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
		
		private _iconFunction:Function;
		/**
		 * 用户提供的函数，在每个数据项目上运行以确定其图标的skinName值。另请参考UIAsset.skinName。
		 * 示例：iconFunction(item:Object):Object
		 * @member ns_egret.Tree#iconFunction
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
		 * @method ns_egret.Tree#expandItem
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
		 * @method ns_egret.Tree#isItemOpen
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
		 * @method ns_egret.Tree#dataProvider_collectionChangeHandler
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
		 * @method ns_egret.Tree#commitProperties
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