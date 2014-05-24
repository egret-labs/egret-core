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

/// <reference path="../../../egret/utils/Injector.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../events/PopUpEvent.ts"/>
/// <reference path="IPopUpManager.ts"/>
/// <reference path="impl/PopUpManagerImpl.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.PopUpManager
	 * @classdesc
	 * 窗口弹出管理器<p/>
	 * 若项目需要自定义弹出框管理器，请实现IPopUpManager接口，
	 * 并在项目初始化前调用Injector.mapClass("ns_egret.IPopUpManager",YourPopUpManager)，
	 * 注入自定义的弹出框管理器类。
	 */	
	export class PopUpManager{
		/**
		 * 构造函数
		 * @method ns_egret.PopUpManager#constructor
		 */		
		public constructor(){
		}
		
		private static _impl:IPopUpManager;
		/**
		 * 获取单例
		 */		
		private static getImpl():IPopUpManager{
			if (!PopUpManager._impl){
				try{
					PopUpManager._impl = Injector.getInstance("ns_egret.IPopUpManager");
				}
				catch(e){
					PopUpManager._impl = new PopUpManagerImpl();
				}
			}
			return PopUpManager._impl;
		}
		
		/**
		 * 模态遮罩的填充颜色
		 * @member ns_egret.PopUpManager#modalColor
		 */
		public get modalColor():number{
			return PopUpManager.getImpl().modalColor;
		}
		public set modalColor(value:number){
			PopUpManager.getImpl().modalColor = value;
		}
		
		/**
		 * 模态遮罩的透明度
		 * @member ns_egret.PopUpManager#modalAlpha
		 */
		public get modalAlpha():number{
			return PopUpManager.getImpl().modalAlpha;
		}
		public set modalAlpha(value:number){
			PopUpManager.getImpl().modalAlpha = value;
		}
		
		/**
		 * 弹出一个窗口。<br/>
		 * @method ns_egret.PopUpManager.addPopUp
		 * @param popUp {IVisualElement} 要弹出的窗口
		 * @param modal {boolean} 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
		 * @param center {boolean} 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
		 */		
		public static addPopUp(popUp:IVisualElement,modal:boolean=false,center:boolean=true):void{
			PopUpManager.getImpl().addPopUp(popUp,modal,center);
            PopUpEvent.dispatchPopUpEvent(PopUpManager.getImpl(),PopUpEvent.ADD_POPUP,popUp,modal);
		}
		
		/**
		 * 移除由addPopUp()方法弹出的窗口。
		 * @method ns_egret.PopUpManager.removePopUp
		 * @param popUp {IVisualElement} 要移除的窗口
		 */		
		public static removePopUp(popUp:IVisualElement):void{
			PopUpManager.getImpl().removePopUp(popUp);
            PopUpEvent.dispatchPopUpEvent(PopUpManager.getImpl(),PopUpEvent.REMOVE_POPUP,popUp);
		}
		
		/**
		 * 将指定窗口居中显示
		 * @method ns_egret.PopUpManager.centerPopUp
		 * @param popUp {IVisualElement} 要居中显示的窗口
		 */
		public static centerPopUp(popUp:IVisualElement):void{
			PopUpManager.getImpl().centerPopUp(popUp);
		}
		
		/**
		 * 将指定窗口的层级调至最前
		 * @method ns_egret.PopUpManager.bringToFront
		 * @param popUp {IVisualElement} 要最前显示的窗口
		 */		
		public static bringToFront(popUp:IVisualElement):void{
			PopUpManager.getImpl().bringToFront(popUp);
            PopUpEvent.dispatchPopUpEvent(PopUpManager.getImpl(),PopUpEvent.BRING_TO_FRONT,popUp);
		}
		/**
		 * 已经弹出的窗口列表
		 * @member ns_egret.PopUpManager.popUpList
		 */		
		public static get popUpList():Array<any>{
			return PopUpManager.getImpl().popUpList;
		}
		
		/**
		 * 添加事件监听,参考PopUpEvent定义的常量。
		 * @method ns_egret.PopUpManager.addEventListener
		 * @see org.flexlite.domUI.events.PopUpEvent
		 * @param type {string} 
		 * @param listener {Function} 
		 * @param thisObject {any} 
		 * @param useCapture {boolean} 
		 * @param priority {number} 
		 */		
		public static addEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean = false,priority:number = 0):void{
			PopUpManager.getImpl().addEventListener(type,listener,this,useCapture,priority);
		}
		/**
		 * 移除事件监听,参考PopUpEvent定义的常量。
		 * @method ns_egret.PopUpManager.removeEventListener
		 * @see org.flexlite.domUI.events.PopUpEvent
		 * @param type {string} 
		 * @param listener {Function} 
		 * @param thisObject {any} 
		 * @param useCapture {boolean} 
		 */	
		public static removeEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean = false):void{
			PopUpManager.getImpl().removeEventListener(type,listener,thisObject,useCapture);
		}
	}
}