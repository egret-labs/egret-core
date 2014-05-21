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

/// <reference path="../IItemRenderer.ts"/>
/// <reference path="ButtonBase.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.ItemRenderer
	 * @classdesc
	 * 项呈示器基类
	 * @extends ns_egret.ButtonBase
	 * @implements ns_egret.IItemRenderer
	 */
	export class ItemRenderer extends ButtonBase implements IItemRenderer{
		/**
		 * @method ns_egret.ItemRenderer#constructor
		 */
		public constructor(){
			super();
			this.touchChildren = true;
		}
		
		private dataChangedFlag:boolean = false;
		private _data:any;
		/**
		 * @member ns_egret.ItemRenderer#data
		 */
		public get data():any{
			return this._data;
		}

		public set data(value:any){
			//这里不能加if(_data==value)return;的判断，会导致数据源无法刷新的问题
			this._data = value;
			if(this.initialized||this.parent){
				this.dataChangedFlag = false;
				this.dataChanged();
			}
			else{
				this.dataChangedFlag = true;
				this.invalidateProperties();
			}
		}
		/**
		 * 子类复写此方法以在data数据源发生改变时跟新显示列表。
		 * 与直接复写_data的setter方法不同，它会确保在皮肤已经附加完成后再被调用。
		 * @method ns_egret.ItemRenderer#dataChanged
		 */		
		public dataChanged():void{
			
		}
		
		private _selected:boolean = false;
		/**
		 * @member ns_egret.ItemRenderer#selected
		 */
		public get selected():boolean{
			return this._selected;
		}
		
		public set selected(value:boolean){
			if(this._selected==value)
				return;
			this._selected = value;
			this.invalidateSkinState();
		}
		
		private _itemIndex:number = -1;
		/**
		 * @member ns_egret.ItemRenderer#itemIndex
		 */
		public get itemIndex():number{
			return this._itemIndex;
		}
		
		public set itemIndex(value:number){
			this._itemIndex = value;
		}
		
		/**
		 * @method ns_egret.ItemRenderer#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			if (this.dataChangedFlag){
				this.dataChangedFlag = false;
				this.dataChanged();
			}
		}
		
		/**
		 * @method ns_egret.ItemRenderer#getCurrentSkinState
		 * @returns {string}
		 */
		public getCurrentSkinState():string{
			if(this._selected)
				return "down";
			return super.getCurrentSkinState();
		}
		
	}
}