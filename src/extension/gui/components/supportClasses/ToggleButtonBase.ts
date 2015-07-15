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
	 * @class egret.gui.ToggleButtonBase
	 * @classdesc
	 * 切换按钮组件基类
	 * @extends egret.gui.ButtonBase
	 */	
	export class ToggleButtonBase extends ButtonBase{
		/**
		 * 构造函数
		 * @method egret.gui.ToggleButtonBase#constructor
		 */
		public constructor(){
			super();
		}

		/**
		 *
		 * @type {boolean}
		 * @private
		 */
        public _selected: boolean = false;
		/**
		 * 按钮处于按下状态时为 true，而按钮处于弹起状态时为 false。
		 * @member egret.gui.ToggleButtonBase#selected
		 */		
		public get selected():boolean{
			return this._selected;
		}
		
		public set selected(value:boolean){
			this._setSelected(value);
		}

		/**
		 *
		 * @param value
		 * @private
		 */
        public _setSelected(value:boolean):void{
            if (value == this._selected)
                return;

            this._selected = value;
            UIEvent.dispatchUIEvent(this,UIEvent.VALUE_COMMIT);;
            this.invalidateSkinState();
        }
		
		/**
		 * 返回要应用到外观的状态的名称
		 * @method egret.gui.ToggleButtonBase#getCurrentSkinState
		 * @returns {string}
		 */
		public getCurrentSkinState():string{
			var state:string = super.getCurrentSkinState();
			if (!this.selected){
				return state;
			}
			else{
				var selectedState:string = state + "AndSelected";
				var skin:IStateClient = this.skin
				if(skin&&skin.hasState(selectedState)){
					return selectedState;
				}
				return state=="disabled"?"disabled":"down";
			}
		}
		/**
		 * 是否根据鼠标事件自动变换选中状态,默认true。仅框架内使用。
		 * @private
		 */		
		public _autoSelected:boolean = true;

		/**
		 * 当在用户单击按钮之后处理 MouseEvent.MOUSE_UP 事件时，将调用此方法
		 */
		public buttonReleased():void{
			super.buttonReleased();
			if(!this._autoSelected||!this.enabled)
				return;
			this.selected = !this.selected;
			this.dispatchEventWith(Event.CHANGE);
		}
	}
	
}