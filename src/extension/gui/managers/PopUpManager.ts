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
	 * @class egret.gui.PopUpManager
	 * @classdesc
	 * 窗口弹出管理器<p/>
	 * 若项目需要自定义弹出框管理器，请实现IPopUpManager接口，
	 * 并在项目初始化前调用Injector.mapClass("egret.gui.IPopUpManager",YourPopUpManager)，
	 * 注入自定义的弹出框管理器类。
	 */	
	export class PopUpManager{
		/**
		 * 构造函数
		 * @method egret.gui.PopUpManager#constructor
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
					PopUpManager._impl = Injector.getInstance("egret.gui.IPopUpManager");
				}
				catch(e){
					PopUpManager._impl = new PopUpManagerImpl();
				}
			}
			return PopUpManager._impl;
		}
		
		/**
		 * 模态遮罩的填充颜色
		 * @member egret.gui.PopUpManager#modalColor
		 */
		public static get modalColor():number{
			return PopUpManager.getImpl().modalColor;
		}
		public static set modalColor(value:number){
			PopUpManager.getImpl().modalColor = value;
		}
		
		/**
		 * 模态遮罩的透明度
		 * @member egret.gui.PopUpManager#modalAlpha
		 */
		public static get modalAlpha():number{
			return PopUpManager.getImpl().modalAlpha;
		}
		public static set modalAlpha(value:number){
			PopUpManager.getImpl().modalAlpha = value;
		}
		
		/**
		 * 弹出一个窗口。<br/>
		 * @method egret.gui.PopUpManager.addPopUp
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
		 * @method egret.gui.PopUpManager.removePopUp
		 * @param popUp {IVisualElement} 要移除的窗口
		 */		
		public static removePopUp(popUp:IVisualElement):void{
			PopUpManager.getImpl().removePopUp(popUp);
            PopUpEvent.dispatchPopUpEvent(PopUpManager.getImpl(),PopUpEvent.REMOVE_POPUP,popUp);
		}
		
		/**
		 * 将指定窗口居中显示
		 * @method egret.gui.PopUpManager.centerPopUp
		 * @param popUp {IVisualElement} 要居中显示的窗口
		 */
		public static centerPopUp(popUp:IVisualElement):void{
			PopUpManager.getImpl().centerPopUp(popUp);
		}
		
		/**
		 * 将指定窗口的层级调至最前
		 * @method egret.gui.PopUpManager.bringToFront
		 * @param popUp {IVisualElement} 要最前显示的窗口
		 */		
		public static bringToFront(popUp:IVisualElement):void{
			PopUpManager.getImpl().bringToFront(popUp);
            PopUpEvent.dispatchPopUpEvent(PopUpManager.getImpl(),PopUpEvent.BRING_TO_FRONT,popUp);
		}
		/**
		 * 已经弹出的窗口列表
		 * @member egret.gui.PopUpManager.popUpList
		 */		
		public static get popUpList():Array<any>{
			return PopUpManager.getImpl().popUpList;
		}
		
		/**
		 * 添加事件监听,参考PopUpEvent定义的常量。
		 * @method egret.gui.PopUpManager.addEventListener
		 * @param type {string}
		 * @param listener {Function} 
		 * @param thisObject {any} 
		 * @param useCapture {boolean} 
		 * @param priority {number} 
		 */		
		public static addEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean = false,priority:number = 0):void{
			PopUpManager.getImpl().addEventListener(type,listener,thisObject,useCapture,priority);
		}
		/**
		 * 移除事件监听,参考PopUpEvent定义的常量。
		 * @method egret.gui.PopUpManager.removeEventListener
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