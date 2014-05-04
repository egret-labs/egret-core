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

/// <reference path="../../../egret/events/IEventDispatcher.ts"/>
/// <reference path="../core/IVisualElement.ts"/>

module ns_egret {

	export interface IPopUpManager extends IEventDispatcher{
		/**
		 * 模态遮罩的填充颜色
		 */
		modalColor:number;
		
		/**
		 * 模态遮罩的透明度
		 */
		modalAlpha:number;
		
		/**
		 * 弹出一个窗口。<br/>
		 * @param popUp 要弹出的窗口
		 * @param modal 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
		 * @param center 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
		 * @param systemManager 要弹出到的系统管理器。若项目中只含有一个系统管理器，可以留空。
		 */		
		addPopUp(popUp:IVisualElement,modal:boolean=false,center:boolean=true):void;
		
		/**
		 * 移除由addPopUp()方法弹出的窗口。
		 * @param popUp 要移除的窗口
		 */		
		removePopUp(popUp:IVisualElement):void;
		
		/**
		 * 将指定窗口居中显示
		 * @param popUp 要居中显示的窗口
		 */
		centerPopUp(popUp:IVisualElement):void;
		
		/**
		 * 将指定窗口的层级调至最前
		 * @param popUp 要最前显示的窗口
		 */		
		bringToFront(popUp:IVisualElement):void;
		
		/**
		 * 已经弹出的窗口列表
		 */		
		popUpList:Array;
	}
}