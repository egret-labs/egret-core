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

	/**
	 * @class ns_egret.IPopUpManager
	 * @interface
	 * @classdesc
	 * 窗口弹出管理器接口。若项目需要自定义弹出框管理器，请实现此接口，
	 * 并在项目初始化前调用Injector.mapClass("ns_egret.IPopUpManager",YourPopUpManager)，
	 * 注入自定义的弹出框管理器类。
	 * @extends ns_egret.IEventDispatcher
	 */
	export interface IPopUpManager extends IEventDispatcher{
		/**
		 * 模态遮罩的填充颜色
		 * @member ns_egret.IPopUpManager#modalColor
		 */
		modalColor:number;
		
		/**
		 * 模态遮罩的透明度
		 * @member ns_egret.IPopUpManager#modalAlpha
		 */
		modalAlpha:number;
		
		/**
		 * 弹出一个窗口。<br/>
		 * @method ns_egret.IPopUpManager#addPopUp
		 * @param popUp {IVisualElement} 要弹出的窗口
		 * @param modal? {boolean} 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
		 * @param center? {boolean} 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
		 */		
		addPopUp(popUp:IVisualElement,modal?:boolean,center?:boolean):void;
		
		/**
		 * 移除由addPopUp()方法弹出的窗口。
		 * @method ns_egret.IPopUpManager#removePopUp
		 * @param popUp {IVisualElement} 要移除的窗口
		 */		
		removePopUp(popUp:IVisualElement):void;
		
		/**
		 * 将指定窗口居中显示
		 * @method ns_egret.IPopUpManager#centerPopUp
		 * @param popUp {IVisualElement} 要居中显示的窗口
		 */
		centerPopUp(popUp:IVisualElement):void;
		
		/**
		 * 将指定窗口的层级调至最前
		 * @method ns_egret.IPopUpManager#bringToFront
		 * @param popUp {IVisualElement} 要最前显示的窗口
		 */		
		bringToFront(popUp:IVisualElement):void;
		
		/**
		 * 已经弹出的窗口列表
		 * @member ns_egret.IPopUpManager#popUpList
		 */		
		popUpList:Array<any>;
	}
}