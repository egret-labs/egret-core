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


module eui {

	/**
	 * @language en_US
	 * The ToggleButton component defines a toggle button.
	 * Clicking the button toggles it between the up and an down states.
	 * If you click the button while it is in the up state,
	 * it toggles to the down state. You must click the button again
	 * to toggle it back to the up state.
	 * <p>You can get or set this state programmatically
	 * by using the <code>selected</code> property.</p>
	 *
	 * @event egret.Event.CHANGE Dispatched when the <code>selected</code> property
	 * changes for the ToggleButton control.
	 * This event is dispatched only when the
	 * user interacts with the control by touching.
	 *
	 * @state up Button up state
	 * @state down Button down state
	 * @state disabled Button disabled state
	 * @state upAndSelected Up state when the button is selected
	 * @state downAndSelected Down state when the button is selected
	 * @state disabledAndSelected Disabled state when the button is selected
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 * @includeExample  extension/eui/components/ToggleButtonExample.ts
	 */
	/**
	 * @language zh_CN
	 * ToggleButton 组件定义切换按钮。单击该按钮会在弹起状态和按下状态之间进行切换。
	 * 如果在按钮处于弹起状态时单击该按钮，则它会切换到按下状态。必须再次单击该按钮才可将其切换回弹起状态。
	 * <p>可以使用 <code>selected</code> 属性以编程方式获取或设置此状态。</p>
	 *
	 * @event egret.Event.CHANGE ToggleButtonBase 控件的 <code>selected</code> 属性更改时分派。
	 * 仅当用户通过触摸与控件交互时，才分派此事件。
	 *
	 * @state up 按钮弹起状态
	 * @state down 按钮按下状态
	 * @state disabled 按钮禁用状态
	 * @state upAndSelected 按钮选择时的弹起状态
	 * @state downAndSelected 按钮选择时的按下状态
	 * @state disabledAndSelected 按钮选择时的禁用状态
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 * @includeExample  extension/eui/components/ToggleButtonExample.ts
	 */
	export class ToggleButton extends Button{

		/**
		 * @private
		 */
		$selected: boolean = false;
		/**
		 * @language en_US
		 * Contains <code>true</code> if the button is in the down state,
		 * and <code>false</code> if it is in the up state.
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 按钮处于按下状态时为 <code>true</code>，而按钮处于弹起状态时为 <code>false</code>。
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		public get selected():boolean{
			return this.$selected;
		}

		public set selected(value:boolean){
			this.$setSelected(value);
		}

		/**
		 * @private
		 * 
		 * @param value 
		 */
		$setSelected(value:boolean):boolean{
			value = !!value;
			if (value === this.$selected)
				return false;
			this.$selected = value;
			this.invalidateState();
			PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selected");
			return true;
		}

		/**
		 * @inheritDoc
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		protected getCurrentState():string{
			var state = super.getCurrentState();
			if (!this.$selected){
				return state;
			}
			else{
				var selectedState = state + "AndSelected";
				var skin = this.skin;
				if(skin&&skin.hasState(selectedState)){
					return selectedState;
				}
				return state=="disabled"?"disabled":"down";
			}
		}
		/**
		 * @private
		 * 是否根据触摸事件自动变换选中状态,默认true。仅框架内使用。
		 */
		$autoSelected:boolean = true;

		/**
		 * @inheritDoc
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		protected buttonReleased():void{
			if(!this.$autoSelected)
				return;
			this.selected = !this.$selected;
			this.dispatchEventWith(egret.Event.CHANGE);
		}
	}
	registerBindable(ToggleButton.prototype,"selected");
}