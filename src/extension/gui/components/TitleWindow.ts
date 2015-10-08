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


module egret.gui {

	/**
	 * @class egret.gui.TitleWindow
	 * @classdesc
	 * 可移动窗口组件。注意，此窗口必须使用PopUpManager.addPopUp()弹出之后才能移动。
	 * @extends egret.gui.Panel
	 */
	export class TitleWindow extends Panel{
		/**
		 * @method egret.gui.TitleWindow#constructor
		 */
		public constructor(){
			super();
            
			this.addEventListener(TouchEvent.TOUCH_BEGIN,this.onWindowMouseDown,this,true,100);
		}
		/**
		 * 在窗体上按下时前置窗口
		 */		
		private onWindowMouseDown(event:TouchEvent):void{
			if(this.enabled&&this.isPopUp&&event.target!=this.closeButton){
				PopUpManager.bringToFront(this);
			}
		}
		
		/**
		 * [SkinPart]关闭按钮
		 * @member egret.gui.TitleWindow#closeButton
		 */	
        public closeButton: Button = null;
		
		/**
		 * [SkinPart]可移动区域
		 * @member egret.gui.TitleWindow#moveArea
		 */		
        public moveArea: DisplayObject = null;
		
		private _showCloseButton:boolean = true;
		/**
		 * 是否显示关闭按钮,默认true。
		 * @member egret.gui.TitleWindow#showCloseButton
		 */
		public get showCloseButton():boolean{
			return this._showCloseButton;
		}

		public set showCloseButton(value:boolean){
			if(this._showCloseButton==value)
				return;
			this._showCloseButton = value;
			if(this.closeButton)
				this.closeButton.visible = this._showCloseButton;
		}

		private _autoBackToStage:boolean = true;
		/**
		 * 在拖拽窗口时，有可能把窗口完全拖出屏幕外，导致无法点中moveArea而不能拖回屏幕。
		 * 此属性为true时，将会在拖拽结束时，自动调整窗口位置，使moveArea可以被再次点中。
		 * 反之不调整。默认值为true。
		 * @member egret.gui.TitleWindow#autoBackToStage
		 */
		public get autoBackToStage():boolean{
			return this._autoBackToStage;
		}
		public set autoBackToStage(value:boolean){
			this._autoBackToStage = value;
		}


		/**
		 * [覆盖] 添加外观部件时调用
		 * @param partName {string}
		 * @param instance {any} 
		 */
		public partAdded(partName:string, instance:any) : void{
			super.partAdded(partName, instance);
			
			if (instance == this.moveArea){
				this.moveArea.addEventListener(TouchEvent.TOUCH_BEGIN, this.moveArea_mouseDownHandler, this);
			}
			else if (instance == this.closeButton){
				this.closeButton.addEventListener(TouchEvent.TOUCH_TAP, this.closeButton_clickHandler, this);   
				this.closeButton.visible = this._showCloseButton;
			}
		}
		
		/**
		 * [覆盖] 正删除外观部件的实例时调用
		 * @method egret.gui.TitleWindow#partRemoved
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName, instance);
			
			if (instance == this.moveArea)
				this.moveArea.removeEventListener(TouchEvent.TOUCH_BEGIN, this.moveArea_mouseDownHandler, this);
				
			else if (instance == this.closeButton)
				this.closeButton.removeEventListener(TouchEvent.TOUCH_TAP, this.closeButton_clickHandler, this);
		}
		
		/**
		 * @method egret.gui.TitleWindow#closeButton_clickHandler
		 * @param event {TouchEvent} 
		 */
		public closeButton_clickHandler(event:TouchEvent):void{
            CloseEvent.dispatchCloseEvent(this,CloseEvent.CLOSE);
		}
		
		/**
		 * 鼠标按下时的偏移量
		 */		
		private _offsetPointX:number = NaN;
		private _offsetPointY:number = NaN;
		/**
		 * 鼠标在可移动区域按下
		 * @method egret.gui.TitleWindow#moveArea_mouseDownHandler
		 * @param event {TouchEvent} 
		 */		
		public moveArea_mouseDownHandler(event:TouchEvent):void{
			if (this.enabled && this.isPopUp){
				var offsetPoint:Point = this.globalToLocal(event.stageX, event.stageY,egret.$TempPoint);
                this._offsetPointX = offsetPoint.x;
                this._offsetPointY = offsetPoint.y;
				this._UIC_Props_._includeInLayout = false;
				UIGlobals.stage.addEventListener(
					TouchEvent.TOUCH_MOVE, this.moveArea_mouseMoveHandler, this);
				UIGlobals.stage.addEventListener(
					TouchEvent.TOUCH_END, this.moveArea_mouseUpHandler, this);
				UIGlobals.stage.addEventListener(
					Event.LEAVE_STAGE, this.moveArea_mouseUpHandler, this);
			}
		}
		/**
		 * 鼠标拖拽时的移动事件
		 * @method egret.gui.TitleWindow#moveArea_mouseMoveHandler
		 * @param event {TouchEvent} 
		 */		
		public moveArea_mouseMoveHandler(event:TouchEvent):void{
			var pos:Point = this.globalToLocal(event.stageX,event.stageY,egret.$TempPoint);
			this.x += pos.x - this._offsetPointX;
			this.y += pos.y - this._offsetPointY;
		}
		/**
		 * 鼠标在舞台上弹起事件
		 * @method egret.gui.TitleWindow#moveArea_mouseUpHandler
		 * @param event {Event} 
		 */		
		public moveArea_mouseUpHandler(event:Event):void{
			UIGlobals.stage.removeEventListener(
				TouchEvent.TOUCH_MOVE, this.moveArea_mouseMoveHandler, this);
			UIGlobals.stage.removeEventListener(
				TouchEvent.TOUCH_END, this.moveArea_mouseUpHandler, this);
			UIGlobals.stage.removeEventListener(
				Event.LEAVE_STAGE, this.moveArea_mouseUpHandler, this);
			if(this._autoBackToStage){
				this.adjustPosForStage();
			}
			LayoutUtil.adjustRelativeByXY(this);
			this.includeInLayout = true;
		}
		/**
		 * 调整窗口位置，使其可以在舞台中被点中
		 */		
		private adjustPosForStage():void{
			if(!this.moveArea||!this.stage)
				return;
			var pos:Point = this.moveArea.localToGlobal(0,0);
			var stageX:number = pos.x;
			var stageY:number = pos.y;
			if(pos.x+this.moveArea.width<35){
				stageX = 35 - this.moveArea.width;
			}
			if(pos.x>this.stage.stageWidth-20){
				stageX = this.stage.stageWidth-20;
			}
			if(pos.y+this.moveArea.height<20){
				stageY = 20 - this.moveArea.height;
			}
			if(pos.y>this.stage.stageHeight-20){
				stageY = this.stage.stageHeight-20;
			}
			this.x += stageX-pos.x;
			this.y += stageY-pos.y;
		}
	}
}