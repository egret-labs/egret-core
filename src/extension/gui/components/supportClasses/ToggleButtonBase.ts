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
/// <reference path="ButtonBase.ts"/>
/// <reference path="../../events/UIEvent.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.ToggleButtonBase
	 * @classdesc
	 * 切换按钮组件基类
	 * @extends ns_egret.ButtonBase
	 */	
	export class ToggleButtonBase extends ButtonBase{
		/**
		 * @method ns_egret.ToggleButtonBase#constructor
		 */
		public constructor(){
			super();
		}
		
		public _selected:boolean;
		/**
		 * 按钮处于按下状态时为 true，而按钮处于弹起状态时为 false。
		 * @member ns_egret.ToggleButtonBase#selected
		 */		
		public get selected():boolean{
			return this._selected;
		}
		
		public set selected(value:boolean){
			this._setSelected(value);
		}

        public _setSelected(value:boolean):void{
            if (value == this._selected)
                return;

            this._selected = value;
            UIEvent.dispatchUIEvent(this,UIEvent.VALUE_COMMIT);;
            this.invalidateSkinState();
        }
		
		/**
		 * @method ns_egret.ToggleButtonBase#getCurrentSkinState
		 * @returns {string}
		 */
		public getCurrentSkinState():string{
			if (!this.selected)
				return super.getCurrentSkinState();
			else
				return super.getCurrentSkinState() + "AndSelected";
		}
		/**
		 * 是否根据鼠标事件自动变换选中状态,默认true。仅框架内使用。
		 */		
		public _autoSelected:boolean = true;
		/**
		 * @method ns_egret.ToggleButtonBase#buttonReleased
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