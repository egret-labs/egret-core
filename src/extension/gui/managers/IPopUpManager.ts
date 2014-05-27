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