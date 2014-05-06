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

/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="../../../egret/geom/Point.ts"/>
/// <reference path="../core/UIGlobals.ts"/>
/// <reference path="../events/CloseEvent.ts"/>
/// <reference path="../managers/PopUpManager.ts"/>
/// <reference path="../utils/LayoutUtil.ts"/>

module ns_egret {

	export class TitleWindow extends Panel{
		public constructor(){
			super();
			this.addEventListener(TouchEvent.TOUCH_BEGAN,this.onWindowMouseDown,this,true,100);
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
		 */	
		public closeButton:Button;
		
		/**
		 * [SkinPart]可移动区域
		 */		
		public moveArea:DisplayObject;
		
		private _showCloseButton:boolean = true;
		/**
		 * 是否显示关闭按钮,默认true。
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
		 */
		public get autoBackToStage():boolean{
			return this._autoBackToStage;
		}
		public set autoBackToStage(value:boolean){
			this._autoBackToStage = value;
		}


		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any) : void{
			super.partAdded(partName, instance);
			
			if (instance == this.moveArea){
				this.moveArea.addEventListener(TouchEvent.TOUCH_BEGAN, this.moveArea_mouseDownHandler, this);
			}
			else if (instance == this.closeButton){
				this.closeButton.addEventListener(TouchEvent.TOUCH_TAP, this.closeButton_clickHandler, this);   
				this.closeButton.visible = this._showCloseButton;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName, instance);
			
			if (instance == this.moveArea)
				this.moveArea.removeEventListener(TouchEvent.TOUCH_BEGAN, this.moveArea_mouseDownHandler, this);
				
			else if (instance == this.closeButton)
				this.closeButton.removeEventListener(TouchEvent.TOUCH_TAP, this.closeButton_clickHandler, this);
		}
		
		public closeButton_clickHandler(event:TouchEvent):void{
			this.dispatchEvent(new CloseEvent(CloseEvent.CLOSE));
		}
		
		/**
		 * 鼠标按下时的偏移量
		 */		
		private offsetPoint:Point;
		/**
		 * 鼠标在可移动区域按下
		 */		
		public moveArea_mouseDownHandler(event:TouchEvent):void{
			if (this.enabled && this.isPopUp){
				this.offsetPoint = this.globalToLocal(new Point(event.stageX, event.stageY));
				this._includeInLayout = false;
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
		 */		
		public moveArea_mouseMoveHandler(event:TouchEvent):void{
			var pos:Point = this.globalToLocal(new Point(event.stageX,event.stageY));
			this.x += pos.x - this.offsetPoint.x;
			this.y += pos.y - this.offsetPoint.y;
			if(UIGlobals.useUpdateAfterEvent)
				event.updateAfterEvent();
		}
		/**
		 * 鼠标在舞台上弹起事件
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
			this.offsetPoint = null;
			LayoutUtil.adjustRelativeByXY(this);
			this.includeInLayout = true;
		}
		/**
		 * 调整窗口位置，使其可以在舞台中被点中
		 */		
		private adjustPosForStage():void{
			if(!this.moveArea||!this.stage)
				return;
			var pos:Point = this.moveArea.localToGlobal(new Point());
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
