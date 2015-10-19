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
	 * @class egret.gui.SkinnableDataContainer
	 * @classdesc
	 * 可设置外观的数据项目容器基类
	 * @extends egret.gui.SkinnableComponent
	 * @implements egret.gui.IItemRendererOwner
	 */
	export class SkinnableDataContainer extends SkinnableComponent implements IItemRendererOwner{
		/**
		 * 构造函数
		 * @method egret.gui.SkinnableDataContainer#constructor
		 */
		public constructor(){
			super();

		}

		/**
		 * 更新项呈示器，以备使用或重用
		 * @method egret.gui.SkinnableDataContainer#updateRenderer
		 * @param renderer {IItemRenderer}
		 * @param itemIndex {number}
		 * @param data {any}
		 * @returns {IItemRenderer}
		 */
		public updateRenderer(renderer:IItemRenderer, itemIndex:number, data:any):IItemRenderer{
			if("ownerChanged" in renderer){
				(<IVisualElement> <any> renderer).ownerChanged(this);
			}
			renderer.itemIndex = itemIndex;
			renderer.label = this.itemToLabel(data);
			renderer.data = data;
			return renderer;
		}

		/**
		 * 返回可在项呈示器中显示的 String
		 * @method egret.gui.SkinnableDataContainer#itemToLabel
		 * @param item {any}
		 * @returns {string}
		 */
		public itemToLabel(item:any):string{
			if (item !== null)
				return item.toString();
			else return " ";
		}

		/**
		 * [SkinPart]数据项目容器实体
		 * @member egret.gui.SkinnableDataContainer#dataGroup
		 */
		public dataGroup: DataGroup = null;
		/**
		 * dataGroup发生改变时传递的参数
		 */
		public _dataGroupProperties:any = {};

		/**
		 * 列表数据源，请使用实现了ICollection接口的数据类型，例如ArrayCollection
		 * @member egret.gui.SkinnableDataContainer#dataProvider
		 */
		public get dataProvider():ICollection{
			return this._getDataProvider();
		}

		public _getDataProvider():ICollection{
			return this.dataGroup!=null
				? this.dataGroup.dataProvider
				: this._dataGroupProperties.dataProvider;
		}

		public set dataProvider(value:ICollection){
			this._setDataProvider(value);
		}

		public _setDataProvider(value:ICollection):void{
			if (this.dataGroup==null){
				this._dataGroupProperties.dataProvider = value;
			}
			else{
				this.dataGroup.dataProvider = value;
			}
		}

		/**
		 * 用于数据项目的项呈示器。该类必须实现 IItemRenderer 接口。 <br/>
		 * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
		 * @member egret.gui.SkinnableDataContainer#itemRenderer
		 */
		public get itemRenderer():IFactory{
			return (this.dataGroup)
				? this.dataGroup.itemRenderer
				: this._dataGroupProperties.itemRenderer;
		}

		public set itemRenderer(value:IFactory){
			if (this.dataGroup==null){
				this._dataGroupProperties.itemRenderer = value;
			}
			else{
				this.dataGroup.itemRenderer = value;
			}
		}

		/**
		 * 条目渲染器的可选皮肤标识符。在实例化itemRenderer时，若其内部没有设置过skinName,则将此属性的值赋值给它的skinName。
		 * 注意:若itemRenderer不是ISkinnableClient，则此属性无效。
		 * @member egret.gui.SkinnableDataContainer#itemRendererSkinName
		 */
		public get itemRendererSkinName():any{
			return (this.dataGroup)
				? this.dataGroup.itemRendererSkinName
				: this._dataGroupProperties.itemRendererSkinName;
		}

		public set itemRendererSkinName(value:any){
			if (this.dataGroup==null){
				this._dataGroupProperties.itemRendererSkinName = value;
			}
			else{
				this.dataGroup.itemRendererSkinName = value;
			}
		}

		/**
		 * 为某个特定项目返回一个项呈示器Class的函数。 <br/>
		 * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。 <br/>
		 * 应该定义一个与此示例函数类似的呈示器函数： <br/>
		 * function myItemRendererFunction(item:Object):IFactory
		 * @member egret.gui.SkinnableDataContainer#itemRendererFunction
		 */
		public get itemRendererFunction():Function{
			return (this.dataGroup)
				? this.dataGroup.itemRendererFunction
				: this._dataGroupProperties.itemRendererFunction;
		}

		public set itemRendererFunction(value:Function){
			if (this.dataGroup==null){
				this._dataGroupProperties.itemRendererFunction = value;
			}
			else{
				this.dataGroup.itemRendererFunction = value;
			}
		}

		/**
		 * 布局对象
		 * @member egret.gui.SkinnableDataContainer#layout
		 */
		public get layout():LayoutBase{
			return (this.dataGroup)
				? this.dataGroup.layout
				: this._dataGroupProperties.layout;
		}

		public set layout(value:LayoutBase){
			this._setLayout(value);
		}

		public _setLayout(value:LayoutBase):void{
			if (this.dataGroup==null){
				this._dataGroupProperties.layout = value;
			}
			else{
				this.dataGroup.layout = value;
			}
		}

		/**
		 * @copy egret.gui.GroupBase#autoLayout
		 */
		public get autoLayout():boolean
		{
			if (this.dataGroup)
				return this.dataGroup.autoLayout;
			else
			{
				var v:any = this._dataGroupProperties.autoLayout;
				return (v === undefined) ? true : v;
			}
		}

		public set autoLayout(value:boolean)
		{
			if (this.dataGroup==null){
				this._dataGroupProperties.autoLayout = value;
			}
			else{
				this.dataGroup.autoLayout = value;
			}

		}

		/**
		 * [覆盖] 添加外观部件时调用
		 * @method egret.gui.SkinnableDataContainer#partAdded
		 * @param partName {string}
		 * @param instance {any}
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);

			if (instance == this.dataGroup){
				if (this._dataGroupProperties.layout !== undefined){
					this.dataGroup.layout = this._dataGroupProperties.layout;
				}

				if (this._dataGroupProperties.autoLayout !== undefined){
					this.dataGroup.autoLayout = this._dataGroupProperties.autoLayout;
				}

				if (this._dataGroupProperties.dataProvider !== undefined){
					this.dataGroup.dataProvider = this._dataGroupProperties.dataProvider;
				}

				if (this._dataGroupProperties.itemRenderer !== undefined){
					this.dataGroup.itemRenderer = this._dataGroupProperties.itemRenderer;
				}

				if (this._dataGroupProperties.itemRendererSkinName !== undefined){
					this.dataGroup.itemRendererSkinName = this._dataGroupProperties.itemRendererSkinName;
				}

				if (this._dataGroupProperties.itemRendererFunction !== undefined){
					this.dataGroup.itemRendererFunction = this._dataGroupProperties.itemRendererFunction;
				}

				this.dataGroup._rendererOwner = this;
				this._dataGroupProperties = {};

				if (this.hasEventListener(RendererExistenceEvent.RENDERER_ADD)){
					this.dataGroup.addEventListener(
						RendererExistenceEvent.RENDERER_ADD, this.dispatchEvent, this);
				}

				if (this.hasEventListener(RendererExistenceEvent.RENDERER_REMOVE)){
					this.dataGroup.addEventListener(
						RendererExistenceEvent.RENDERER_REMOVE, this.dispatchEvent, this);
				}
			}
		}

		/**
		 * [覆盖] 正删除外观部件的实例时调用
		 * @method egret.gui.SkinnableDataContainer#partRemoved
		 * @param partName {string}
		 * @param instance {any}
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName, instance);

			if (instance == this.dataGroup){
				this.dataGroup.removeEventListener(
					RendererExistenceEvent.RENDERER_ADD, this.dispatchEvent, this);
				this.dataGroup.removeEventListener(
					RendererExistenceEvent.RENDERER_REMOVE, this.dispatchEvent, this);
				var newDataGroupProperties:any = {};
				newDataGroupProperties.layout = this.dataGroup.layout;
				newDataGroupProperties.autoLayout = this.dataGroup.autoLayout;
				newDataGroupProperties.dataProvider = this.dataGroup.dataProvider;
				newDataGroupProperties.itemRenderer = this.dataGroup.itemRenderer;
				newDataGroupProperties.itemRendererSkinName = this.dataGroup.itemRendererSkinName;
				newDataGroupProperties.itemRendererFunction = this.dataGroup.itemRendererFunction;
				this._dataGroupProperties = newDataGroupProperties;
				this.dataGroup._rendererOwner = null;
				this.dataGroup.dataProvider = null;
				this.dataGroup.layout = null;
			}
		}

		/**
		 * 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知
		 * @method egret.gui.SkinnableDataContainer#addEventListener
		 * @param type {string}
		 * @param listener {Function}
		 * @param thisObject {any}
		 * @param useCapture {boolean}
		 * @param priority {number}
		 */
		public addEventListener(type:string, listener:Function,thisObject:any,  useCapture:boolean=false, priority:number=0) : void{
			super.addEventListener(type, listener,thisObject, useCapture, priority);

			if (type == RendererExistenceEvent.RENDERER_ADD && this.dataGroup){
				this.dataGroup.addEventListener(
					RendererExistenceEvent.RENDERER_ADD, this.dispatchEvent, this);
			}

			if (type == RendererExistenceEvent.RENDERER_REMOVE && this.dataGroup){
				this.dataGroup.addEventListener(
					RendererExistenceEvent.RENDERER_REMOVE, this.dispatchEvent, this);
			}
		}

		/**
		 * 从 EventDispatcher 对象中删除侦听器
		 * @method egret.gui.SkinnableDataContainer#removeEventListener
		 * @param type {string}
		 * @param listener {Function}
		 * @param thisObject {any}
		 * @param useCapture {boolean}
		 */
		public removeEventListener(type:string, listener:Function, thisObject:any, useCapture:boolean=false) : void{
			super.removeEventListener(type, listener,thisObject, useCapture);

			if (type == RendererExistenceEvent.RENDERER_ADD && this.dataGroup){
				if (!this.hasEventListener(RendererExistenceEvent.RENDERER_ADD)){
					this.dataGroup.removeEventListener(
						RendererExistenceEvent.RENDERER_ADD, this.dispatchEvent, this);
				}
			}

			if (type == RendererExistenceEvent.RENDERER_REMOVE && this.dataGroup){
				if (!this.hasEventListener(RendererExistenceEvent.RENDERER_REMOVE)){
					this.dataGroup.removeEventListener(
						RendererExistenceEvent.RENDERER_REMOVE, this.dispatchEvent, this);
				}
			}
		}
	}
}