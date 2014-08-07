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


module egret.gui {

	/**
	 * @class egret.gui.IUIComponent
	 * @interface
	 * @classdesc
	 * UI组件接口
	 * @extends egret.gui.IVisualElement
	 */	
	export interface IUIComponent extends IVisualElement{
		/**
		 * 组件是否可以接受用户交互。
		 * @member egret.gui.IUIComponent#enabled
		 */
		enabled:boolean;
		/**
		 * PopUpManager将其设置为true,以指示已弹出该组件。
		 * @member egret.gui.IUIComponent#isPopUp
		 */
		isPopUp:boolean;
		/**
		 * 外部显式指定的高度
		 * @member egret.gui.IUIComponent#explicitHeight
		 */
		explicitHeight:number;
		/**
		 * 外部显式指定的宽度
		 * @member egret.gui.IUIComponent#explicitWidth
		 */
		explicitWidth:number;
		/**
		 * 设置组件的宽高，w,h均不包含scale值。此方法不同于直接设置width,height属性，
		 * 不会影响显式标记尺寸属性widthExplicitlySet,_heightExplicitlySet
		 * @method egret.gui.IUIComponent#setActualSize
		 * @param newWidth {number} 
		 * @param newHeight {number} 
		 */		
		setActualSize(newWidth:number, newHeight:number):void;
	}
	
}