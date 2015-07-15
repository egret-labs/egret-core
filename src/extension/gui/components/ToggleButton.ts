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
	 * @class egret.gui.ToggleButton
	 * @classdesc
	 * 切换按钮
	 * @extends egret.gui.ToggleButtonBase
	 */	
	export class ToggleButton extends ToggleButtonBase{
		/**
		 * 构造函数
		 * @method egret.gui.ToggleButton#constructor
		 */		
		public constructor(){
			super();
            
		}
		/**
		 * [SkinPart]按钮上的文本标签
		 * @member egret.gui.ButtonBase#labelDisplay
		 */
        public iconDisplay: UIAsset = null;

        private _icon: any = null;
		/**
		 * 要在按钮上显示的图标
		 * @member egret.gui.ButtonBase#icon
		 */
		public get icon():any{
			return this._getIcon();
		}

		public _getIcon():any{
			if(this.iconDisplay){
				return this.iconDisplay.source;
			}
			else{
				return this._icon;
			}
		}

		public set icon(value:any){
			this._setIcon(value);
		}

		public _setIcon(value:any):void{
			this._icon = value;
			if(this.iconDisplay){
				this.iconDisplay.source = value;
			}
		}

		/**
		 * [覆盖] 添加外观部件时调用
		 * @param partName {string}
		 * @param instance {any}
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			if(instance==this.iconDisplay){
				this.iconDisplay.source = this._icon;
			}
		}
	}
}