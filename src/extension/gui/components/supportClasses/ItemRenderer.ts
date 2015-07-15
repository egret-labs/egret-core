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
	 * @class egret.gui.ItemRenderer
	 * @classdesc
	 * 项呈示器基类
	 * @extends egret.gui.ButtonBase
	 * @implements egret.gui.IItemRenderer
	 */
	export class ItemRenderer extends ButtonBase implements IItemRenderer{
		/**
		 * 构造函数
		 * @method egret.gui.ItemRenderer#constructor
		 */
		public constructor(){
			super();
			this.touchChildren = true;
            
		}
		
		private dataChangedFlag:boolean = false;
        private _data: any = null;
		/**
		 * @member egret.gui.ItemRenderer#data
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
		 * @method egret.gui.ItemRenderer#dataChanged
		 */		
		public dataChanged():void{
			
		}
		
		private _selected:boolean = false;
		/**
		 * @member egret.gui.ItemRenderer#selected
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
		 * @member egret.gui.ItemRenderer#itemIndex
		 */
		public get itemIndex():number{
			return this._itemIndex;
		}
		
		public set itemIndex(value:number){
			this._itemIndex = value;
		}
		
		/**
		 * 处理对组件设置的属性
		 * @method egret.gui.ItemRenderer#commitProperties
		 */
		public commitProperties():void{
			super.commitProperties();
			if (this.dataChangedFlag){
				this.dataChangedFlag = false;
				this.dataChanged();
			}
		}
		
		/**
		 * 返回要应用到呈示器的状态的名称
		 * @method egret.gui.ItemRenderer#getCurrentSkinState
		 * @returns {string}
		 */
		public getCurrentSkinState():string{
			if(this._selected)
				return "down";
			return super.getCurrentSkinState();
		}
		
	}
}