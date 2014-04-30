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

/// <reference path="../../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../../../egret/events/EventDispatcher.ts"/>
/// <reference path="../../../../egret/utils/Dictionary.ts"/>
/// <reference path="../../components/Rect.ts"/>
/// <reference path="../../core/UIGlobals.ts"/>
/// <reference path="../../core/IContainer.ts"/>
/// <reference path="../../core/IInvalidating.ts"/>
/// <reference path="../../core/IUIComponent.ts"/>
/// <reference path="../../core/IVisualElement.ts"/>
/// <reference path="../../core/IVisualElementContainer.ts"/>
/// <reference path="../IPopUpManager.ts"/>
/// <reference path="../ISystemManager.ts"/>

module ns_egret {

	export class PopUpManagerImpl extends EventDispatcher implements IPopUpManager{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		
		private _popUpList:Array = [];
		/**
		 * 已经弹出的窗口列表
		 */		
		public get popUpList():Array{
			return this._popUpList.concat();
		}
		/**
		 * 模态窗口列表
		 */		
		private popUpDataList:Vector.<PopUpData> = new Vector.<PopUpData>();
		/**
		 * 根据popUp获取对应的popUpData
		 */		
		private findPopUpData(popUp:IVisualElement):PopUpData{
			for each(var data:PopUpData in this.popUpDataList){
				if(data.popUp==popUp)
					return data;
			}
			return null;
		}
		
		private static REMOVE_FROM_SYSTEMMANAGER:string = "removeFromSystemManager";
		/**
		 * 弹出一个窗口。<br/>
		 * @param popUp 要弹出的窗口
		 * @param modal 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
		 * @param center 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
		 * @param systemManager 要弹出到的系统管理器。若项目中只含有一个系统管理器，则可以留空。
		 */		
		public addPopUp(popUp:IVisualElement,modal:boolean=false,
								 center:boolean=true,systemManager:ISystemManager=null):void{
			if(!systemManager)
				systemManager = UIGlobals.systemManager;
			if(!systemManager)
				return;
			var data:PopUpData = this.findPopUpData(popUp);
			if(data){
				data.modal = modal;
				popUp.removeEventListener(PopUpManagerImpl.REMOVE_FROM_SYSTEMMANAGER,this.onRemoved,this);
			}
			else{
				data = new PopUpData(popUp,modal);
				this.popUpDataList.push(data);
				this._popUpList.push(popUp);
			}
			systemManager.popUpContainer.addElement(popUp);
			if(center)
				this.centerPopUp(popUp);
			if(popUp is IUIComponent)
				(<IUIComponent> popUp).isPopUp = true;
			if(modal){
				this.invalidateModal(systemManager);
			}
			popUp.addEventListener(PopUpManagerImpl.REMOVE_FROM_SYSTEMMANAGER,this.onRemoved,this);
		}
		
		/**
		 * 从舞台移除
		 */		
		private onRemoved(event:Event):void{
			var index:number = 0;
			for each(var data:PopUpData in this.popUpDataList){
				if(data.popUp==event.target){
					if(data.popUp is IUIComponent)
						(<IUIComponent> (data.popUp)).isPopUp = false;
					data.popUp.removeEventListener(PopUpManagerImpl.REMOVE_FROM_SYSTEMMANAGER,this.onRemoved,this);
					this.popUpDataList.splice(index,1);
					this._popUpList.splice(index,1);
					this.invalidateModal(<ISystemManager> (data.popUp.parent));
					break;
				}
				index++;
			}
		}
		
		
		private _modalColor:number = 0x000000;
		/**
		 * 模态遮罩的填充颜色
		 */
		public get modalColor():number{
			return this._modalColor;
		}
		public set modalColor(value:number){
			if(this._modalColor==value)
				return;
			this._modalColor = value;
			this.invalidateModal(UIGlobals.systemManager);
		}
		
		private _modalAlpha:number = 0.5;
		/**
		 * 模态遮罩的透明度
		 */
		public get modalAlpha():number{
			return this._modalAlpha;
		}
		public set modalAlpha(value:number){
			if(this._modalAlpha==value)
				return;
			this._modalAlpha = value;
			this.invalidateModal(UIGlobals.systemManager);
		}
		
		/**
		 * 模态层失效的SystemManager列表
		 */		
		private invalidateModalList:Vector.<ISystemManager> = new Vector.<ISystemManager>();
		
		private invalidateModalFlag:boolean = false;
		/**
		 * 标记一个SystemManager的模态层失效
		 */		
		private invalidateModal(systemManager:ISystemManager):void{
			if(!systemManager)
				return;
			if(this.invalidateModalList.indexOf(systemManager)==-1)
				this.invalidateModalList.push(systemManager);
			if(!this.invalidateModalFlag){
				this.invalidateModalFlag = true;
				UIGlobals.stage.addEventListener(Event.ENTER_FRAME,this.validateModal,this);
				UIGlobals.stage.addEventListener(Event.RENDER,this.validateModal,this);
				UIGlobals.stage.invalidate();
			}
		}
		
		private validateModal(event:Event):void{
			this.invalidateModalFlag = false;
			UIGlobals.stage.removeEventListener(Event.ENTER_FRAME,this.validateModal,this);
			UIGlobals.stage.removeEventListener(Event.RENDER,this.validateModal,this);
			for each(var sm:ISystemManager in this.invalidateModalList){
				this.updateModal(sm);
			}
			this.invalidateModalList.length = 0;
		}
		
		private modalMaskDic:Dictionary = new Dictionary(true);
		/**
		 * 更新窗口模态效果
		 */		
		private updateModal(systemManager:ISystemManager):void{
			var popUpContainer:IContainer = systemManager.popUpContainer;
			var found:boolean = false;
			for(var i:number = popUpContainer.numElements-1;i>=0;i--){
				var element:IVisualElement = popUpContainer.getElementAt(i);
				var data:PopUpData = this.findPopUpData(element);
				if(data&&data.modal){
					found = true;
					break;
				}
			}
			var modalMask:Rect = this.modalMaskDic[systemManager];
			if(found){
				if(!modalMask){
					this.modalMaskDic[systemManager] = modalMask = new Rect();
					modalMask.top = modalMask.left = modalMask.right = modalMask.bottom = 0;
				}
				(<Rect> modalMask).fillColor = this._modalColor;
				modalMask.alpha = this._modalAlpha;
				if(modalMask.parent==systemManager){
					if(popUpContainer.getElementIndex(modalMask)<i)
						i--;
					popUpContainer.setElementIndex(modalMask,i);
				}
				else{
					popUpContainer.addElementAt(modalMask,i);
				}
			}
			else if(modalMask&&modalMask.parent==systemManager){
				popUpContainer.removeElement(modalMask);
			}
		}
		
		/**
		 * 移除由addPopUp()方法弹出的窗口。
		 * @param popUp 要移除的窗口
		 */		
		public removePopUp(popUp:IVisualElement):void{
			if(popUp && popUp.parent&&this.findPopUpData(popUp)){
				if(popUp.parent is IVisualElementContainer)
					(<IVisualElementContainer> (popUp.parent)).removeElement(popUp);
				else if(popUp instanceof DisplayObject)
					popUp.parent.removeChild(<DisplayObject> popUp);
			}
		}
		
		/**
		 * 将指定窗口居中显示
		 * @param popUp 要居中显示的窗口
		 */
		public centerPopUp(popUp:IVisualElement):void{
			popUp.top = popUp.bottom = popUp.left = popUp.right = NaN;
			popUp.verticalCenter = popUp.horizontalCenter = 0;
			var parent:DisplayObjectContainer = popUp.parent;
			if(parent){
				if(popUp is IInvalidating)
					(<IInvalidating> popUp).validateNow();
				popUp.x = (parent.width-popUp.layoutBoundsWidth)*0.5;
				popUp.y = (parent.height-popUp.layoutBoundsHeight)*0.5;
			}
		}
		
		/**
		 * 将指定窗口的层级调至最前
		 * @param popUp 要最前显示的窗口
		 */		
		public bringToFront(popUp:IVisualElement):void{
			var data:PopUpData = this.findPopUpData(popUp);
			if(data&&popUp.parent is ISystemManager){
				var sm:ISystemManager = <ISystemManager> (popUp.parent);
				sm.popUpContainer.setElementIndex(popUp,sm.popUpContainer.numElements-1);
				this.invalidateModal(sm);
			}
		}
	}
}
import org.flexlite.domUI.core.IVisualElement;

class PopUpData{
	public function PopUpData(popUp:IVisualElement,modal:boolean){
		this.popUp = popUp;
		this.modal = modal;
	}
	
	public popUp:IVisualElement;
	
	public modal:boolean;
}
