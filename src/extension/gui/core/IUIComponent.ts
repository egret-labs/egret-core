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
module ns_egret {

	export interface IUIComponent extends IVisualElement{
		/**
		 * 组件是否可以接受用户交互。
		 */
		enabled:boolean;
		/**
		 * PopUpManager将其设置为true,以指示已弹出该组件。
		 */
		isPopUp:boolean;
		/**
		 * 外部显式指定的高度
		 */
		explicitHeight:number;
		/**
		 * 外部显式指定的宽度
		 */
		explicitWidth:number;
		/**
		 * 设置组件的宽高，w,h均不包含scale值。此方法不同于直接设置width,height属性，
		 * 不会影响显式标记尺寸属性widthExplicitlySet,_heightExplicitlySet
		 */		
		setActualSize(newWidth:number, newHeight:number):void;
		/**
		 * 当鼠标在组件上按下时，是否能够自动获得焦点的标志。注意：UIComponent的此属性默认值为false。
		 */		
		focusEnabled:boolean;
		/**
		 * 设置当前组件为焦点对象
		 */		
		setFocus():void;
		/**
		 * 所属的系统管理器
		 */		
		systemManager:ISystemManager;
	}
	
}
