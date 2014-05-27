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

/// <reference path="IItemRenderer.ts"/>
/// <reference path="supportClasses/ToggleButtonBase.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.TabBarButton
	 * @classdesc
	 * 选项卡组件的按钮条目
	 * @extends ns_egret.ToggleButtonBase
	 * @implements ns_egret.IItemRenderer
	 */	
	export class TabBarButton extends ToggleButtonBase implements IItemRenderer{
		
		/**
		 * @method ns_egret.TabBarButton#constructor
		 */
		public constructor(){
			super();
            this.hostComponentKey = "ns_egret.TabBarButton";
		}
		
		private _allowDeselection:boolean = true;
		/**
		 * 如果为 true，用户单击当前选定的按钮时即会将其取消选择。
		 * 如果为 false，用户必须选择不同的按钮才可取消选择当前选定的按钮。
		 * @member ns_egret.TabBarButton#allowDeselection
		 */		
		public get allowDeselection():boolean{
			return this._allowDeselection;
		}
		
		public set allowDeselection(value:boolean){
			this._allowDeselection = value;
		}
		
		private _data:any;
		/**
		 * @member ns_egret.TabBarButton#data
		 */
		public get data():any{
			return this._data;
		}
		
		public set data(value:any){
			this._data = value;
			this.dispatchEventWith("dataChange");
		}
		
		private _itemIndex:number;
		/**
		 * @member ns_egret.TabBarButton#itemIndex
		 */
		public get itemIndex():number{
			return this._itemIndex;
		}
		
		public set itemIndex(value:number){
			this._itemIndex = value;
		}

		/**
		 * @inheritDoc
		 */
		public _setLabel(value:string){
			if (value != this._getLabel()){
				super._setLabel(value);
				
				if (this.labelDisplay)
					this.labelDisplay.text = this._getLabel();
			}
		}
		
		/**
		 * @method ns_egret.TabBarButton#buttonReleased
		 */
		public buttonReleased():void{
			if (this.selected && !this.allowDeselection)
				return;
			
			super.buttonReleased();
		}
	}
	
}