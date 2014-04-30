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

/// <reference path="../../../egret/core/Injector.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../events/PopUpEvent.ts"/>
/// <reference path="impl/PopUpManagerImpl.ts"/>

module ns_egret {

	export class PopUpManager{
		/**
		 * 构造函数
		 */		
		public constructor(){
		}
		
		private static _impl:IPopUpManager;
		/**
		 * 获取单例
		 */		
		private static get impl():IPopUpManager{
			if (!PopUpManager._impl){
				try{
					PopUpManager._impl = Injector.getInstance(IPopUpManager);
				}
				catch(e){
					PopUpManager._impl = new PopUpManagerImpl();
				}
			}
			return PopUpManager._impl;
		}
		
		/**
		 * 模态遮罩的填充颜色
		 */
		public get modalColor():number{
			return PopUpManager.impl.modalColor;
		}
		public set modalColor(value:number){
			PopUpManager.impl.modalColor = value;
		}
		
		/**
		 * 模态遮罩的透明度
		 */
		public get modalAlpha():number{
			return PopUpManager.impl.modalAlpha;
		}
		public set modalAlpha(value:number){
			PopUpManager.impl.modalAlpha = value;
		}
		
		/**
		 * 弹出一个窗口。<br/>
		 * @param popUp 要弹出的窗口
		 * @param modal 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
		 * @param center 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
		 * @param systemManager 要弹出到的系统管理器。若项目中只含有一个系统管理器，可以留空。
		 */		
		public static addPopUp(popUp:IVisualElement,modal:boolean=false,
										center:boolean=true,systemManager:ISystemManager=null):void{
			PopUpManager.impl.addPopUp(popUp,modal,center,systemManager);
			PopUpManager.impl.dispatchEvent(new PopUpEvent(PopUpEvent.ADD_POPUP,false,false,popUp,modal));
		}
		
		/**
		 * 移除由addPopUp()方法弹出的窗口。
		 * @param popUp 要移除的窗口
		 */		
		public static removePopUp(popUp:IVisualElement):void{
			PopUpManager.impl.removePopUp(popUp);
			PopUpManager.impl.dispatchEvent(new PopUpEvent(PopUpEvent.REMOVE_POPUP,false,false,popUp));
		}
		
		/**
		 * 将指定窗口居中显示
		 * @param popUp 要居中显示的窗口
		 */
		public static centerPopUp(popUp:IVisualElement):void{
			PopUpManager.impl.centerPopUp(popUp);
		}
		
		/**
		 * 将指定窗口的层级调至最前
		 * @param popUp 要最前显示的窗口
		 */		
		public static bringToFront(popUp:IVisualElement):void{
			PopUpManager.impl.bringToFront(popUp);
			PopUpManager.impl.dispatchEvent(new PopUpEvent(PopUpEvent.BRING_TO_FRONT,false,false,popUp));
		}
		/**
		 * 已经弹出的窗口列表
		 */		
		public static get popUpList():Array{
			return PopUpManager.impl.popUpList;
		}
		
		/**
		 * 添加事件监听,参考PopUpEvent定义的常量。
		 * @see org.flexlite.domUI.events.PopUpEvent
		 */		
		public static addEventListener(type:string, listener:Function,
												useCapture:boolean = false,
												priority:number = 0,
												useWeakReference:boolean = true):void{
			PopUpManager.impl.addEventListener(type,listener,this,useCapture,priority,useWeakReference);
		}
		/**
		 * 移除事件监听,参考PopUpEvent定义的常量。
		 * @see org.flexlite.domUI.events.PopUpEvent
		 */	
		public static removeEventListener(type:string, listener:Function,
															useCapture:boolean = false):void{
			PopUpManager.impl.removeEventListener(type,listener,this,useCapture);
		}
	}
}