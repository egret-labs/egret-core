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

/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../../../egret/events/EventDispatcher.ts"/>
/// <reference path="../../../../egret/geom/Rectangle.ts"/>
/// <reference path="../../components/supportClasses/GroupBase.ts"/>
/// <reference path="../../events/PropertyChangeEvent.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.LayoutBase
	 * @classdesc
	 * 容器布局基类
	 * @extends ns_egret.EventDispatcher
	 */
	export class LayoutBase extends EventDispatcher{
		/**
		 * @method ns_egret.LayoutBase#constructor
		 */
		public constructor(){
			super();
		}
		
		private _target:GroupBase;
		/**
		 * 目标容器
		 * @member ns_egret.LayoutBase#target
		 */		
		public get target():GroupBase{
			return this._target;
		}
		
		public set target(value:GroupBase){
			if (this._target == value)
				return;
			this._target = value;
			this.clearVirtualLayoutCache();
		}
		

		private _useVirtualLayout:boolean = false;
		/**
		 * 若要配置容器使用虚拟布局，请为与容器关联的布局的 useVirtualLayout 属性设置为 true。
		 * 只有布局设置为 VerticalLayout、HorizontalLayout 
		 * 或 TileLayout 的 DataGroup 或 SkinnableDataContainer 
		 * 才支持虚拟布局。不支持虚拟化的布局子类必须禁止更改此属性。
		 * @member ns_egret.LayoutBase#useVirtualLayout
		 */
		public get useVirtualLayout():boolean{
			return this._useVirtualLayout;
		}
		
		public set useVirtualLayout(value:boolean){
			if (this._useVirtualLayout == value)
				return;
			
			this._useVirtualLayout = value;
			this.dispatchEventWith("useVirtualLayoutChanged");
			
			if (this._useVirtualLayout && !value) 
				this.clearVirtualLayoutCache();
			if (this.target)
				this.target.invalidateDisplayList();
		}
		
		private _typicalLayoutRect:Rectangle;
		
		/**
		 * 由虚拟布局所使用，以估计尚未滚动到视图中的布局元素的大小。 
		 * @member ns_egret.LayoutBase#typicalLayoutRect
		 */
		public get typicalLayoutRect():Rectangle{
			return this._typicalLayoutRect;
		}
		
		public set typicalLayoutRect(value:Rectangle){
			if(this._typicalLayoutRect==value)
				return;
			this._typicalLayoutRect = value;
			if (this.target)
				this.target.invalidateSize();
		}
        /**
         * 滚动条位置改变
         * @method ns_egret.LayoutBase#scrollPositionChanged
         */
        public scrollPositionChanged():void{
        }
		
		/**
		 * 清理虚拟布局缓存的数据
		 * @method ns_egret.LayoutBase#clearVirtualLayoutCache
		 */		
		public clearVirtualLayoutCache():void{
		}
		/**
		 * 在已添加布局元素之后且在验证目标的大小和显示列表之前，由目标调用。
		 * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。 
		 * @method ns_egret.LayoutBase#elementAdded
		 * @param index {number} 
		 */		
		public elementAdded(index:number):void{
		}
		/**
		 * 必须在已删除布局元素之后且在验证目标的大小和显示列表之前，由目标调用此方法。
		 * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。 
		 * @method ns_egret.LayoutBase#elementRemoved
		 * @param index {number} 
		 */		
		public elementRemoved(index:number):void{
		}
		
		/**
		 * 测量组件尺寸大小
		 * @method ns_egret.LayoutBase#measure
		 */		
		public measure():void{
		}
		/**
		 * 更新显示列表
		 * @method ns_egret.LayoutBase#updateDisplayList
		 * @param width {number} 
		 * @param height {number} 
		 */		
		public updateDisplayList(width:number, height:number):void{
		} 
	}
}