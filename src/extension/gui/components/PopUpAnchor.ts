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
/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/geom/Point.ts"/>
/// <reference path="../../../egret/geom/Rectangle.ts"/>
/// <reference path="../../../egret/utils/callLater.ts"/>
/// <reference path="supportClasses/Animation.ts"/>
/// <reference path="../core/IInvalidating.ts"/>
/// <reference path="../core/IUIComponent.ts"/>
/// <reference path="../core/IVisualElement.ts"/>
/// <reference path="../core/PopUpPosition.ts"/>
/// <reference path="../core/UIComponent.ts"/>
/// <reference path="../managers/PopUpManager.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.PopUpAnchor
	 * @classdesc
	 * PopUpAnchor组件用于定位布局中的弹出控件或下拉控件
	 * @extends ns_egret.UIComponent
	 */	
	export class PopUpAnchor extends UIComponent{
		/**
		 * 构造函数
		 * @method ns_egret.PopUpAnchor#constructor
		 */		
		public constructor(){
			super();
			this.addEventListener(Event.ADDED_TO_STAGE, this.addedToStageHandler, this);
			this.addEventListener(Event.REMOVED_FROM_STAGE, this.removedFromStageHandler, this);
		}
		/**
		 * popUp已经弹出的标志
		 */		
		private popUpIsDisplayed:boolean = false;
		/**
		 * 自身已经添加到舞台标志
		 */		
		private addedToStage:boolean = false;
		
		private _popUpHeightMatchesAnchorHeight:boolean = false;
		/**
		 * 如果为 true，则将popUp控件的高度设置为 PopUpAnchor的高度值。
		 * @member ns_egret.PopUpAnchor#popUpHeightMatchesAnchorHeight
		 */
		public get popUpHeightMatchesAnchorHeight():boolean{
			return this._popUpHeightMatchesAnchorHeight;
		}
		public set popUpHeightMatchesAnchorHeight(value:boolean){
			if (this._popUpHeightMatchesAnchorHeight == value)
				return;
			
			this._popUpHeightMatchesAnchorHeight = value;
			
			this.invalidateDisplayList();
		}
		
		private _popUpWidthMatchesAnchorWidth:boolean = false;
		/**
		 * 如果为true，则将popUp控件的宽度设置为PopUpAnchor的宽度值。
		 * @member ns_egret.PopUpAnchor#popUpWidthMatchesAnchorWidth
		 */		
		public get popUpWidthMatchesAnchorWidth():boolean{
			return this._popUpWidthMatchesAnchorWidth;
		}
		public set popUpWidthMatchesAnchorWidth(value:boolean){
			if (this._popUpWidthMatchesAnchorWidth == value)
				return;
			
			this._popUpWidthMatchesAnchorWidth = value;
			
			this.invalidateDisplayList();
		}
		
		private _displayPopUp:boolean = false;
		/**
		 * 如果为 true，则将popUp对象弹出。若为false，关闭弹出的popUp。
		 * @member ns_egret.PopUpAnchor#displayPopUp
		 */		
		public get displayPopUp():boolean{
			return this._displayPopUp;
		}
		public set displayPopUp(value:boolean){
			if (this._displayPopUp == value)
				return;
			
			this._displayPopUp = value;
			this.addOrRemovePopUp();
		}
		
		
		private _popUp:IVisualElement;
		/**
		 * 要弹出或移除的目标显示对象。
		 * @member ns_egret.PopUpAnchor#popUp
		 */		
		public get popUp():IVisualElement{ 
			return this._popUp 
		}
		public set popUp(value:IVisualElement){
			if (this._popUp == value)
				return;
			
			this._popUp = value;
			
			this.dispatchEventWith("popUpChanged");
		}
		
		private _popUpPosition:string = PopUpPosition.TOP_LEFT;
		/**
		 * popUp相对于PopUpAnchor的弹出位置。请使用PopUpPosition里定义的常量。默认值TOP_LEFT。
		 * @see org.flexlite.domUI.core.PopUpPosition
		 * @member ns_egret.PopUpAnchor#popUpPosition
		 */		
		public get popUpPosition():string{
			return this._popUpPosition;
		}
		public set popUpPosition(value:string){
			if (this._popUpPosition == value)
				return;
			
			this._popUpPosition = value;
			this.invalidateDisplayList();    
		}
		
		/**
		 * @method ns_egret.PopUpAnchor#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth, unscaledHeight);                
			this.applyPopUpTransform(unscaledWidth, unscaledHeight);            
		}
		/**
		 * 手动刷新popUp的弹出位置和尺寸。
		 * @method ns_egret.PopUpAnchor#updatePopUpTransform
		 */		
		public updatePopUpTransform():void{
			this.applyPopUpTransform(this.width, this.height);
		}
		/**
		 * 计算popUp的弹出位置
		 */		
		private calculatePopUpPosition():Point{
			var registrationPoint:Point = Point.identity;
			switch(this._popUpPosition){
				case PopUpPosition.BELOW:
					registrationPoint.x = 0;
					registrationPoint.y = this.height;
					break;
				case PopUpPosition.ABOVE:
					registrationPoint.x = 0;
					registrationPoint.y = -this.popUp.layoutBoundsHeight;
					break;
				case PopUpPosition.LEFT:
					registrationPoint.x = -this.popUp.layoutBoundsWidth;
					registrationPoint.y = 0;
					break;
				case PopUpPosition.RIGHT:
					registrationPoint.x = this.width;
					registrationPoint.y = 0;
					break;            
				case PopUpPosition.CENTER:
					registrationPoint.x = (this.width - this.popUp.layoutBoundsWidth)*0.5;
					registrationPoint.y = (this.height - this.popUp.layoutBoundsHeight)*0.5;
					break;            
				case PopUpPosition.TOP_LEFT:
					break;
			}
			registrationPoint = this.localToGlobal(registrationPoint.x,registrationPoint.y,registrationPoint);
			registrationPoint = this.popUp.parent.globalToLocal(registrationPoint.x,registrationPoint.y,registrationPoint);
			return registrationPoint;
		}
		
		/**
		 * 正在播放动画的标志
		 */		
		private inAnimation:boolean = false;
        /**
         * 动画类实例
         */
        private animator:Animation = null;

		private _openDuration:number = 250;
		/**
		 * 窗口弹出的动画时间(以毫秒为单位)，设置为0则直接弹出窗口而不播放动画效果。默认值250。
		 * @member ns_egret.PopUpAnchor#openDuration
		 */
		public get openDuration():number{
			return this._openDuration;
		}
		
		public set openDuration(value:number){
			this._openDuration = value;
		}
		
		private _closeDuration:number = 150;
		/**
		 * 窗口关闭的动画时间(以毫秒为单位)，设置为0则直接关闭窗口而不播放动画效果。默认值150。
		 * @member ns_egret.PopUpAnchor#closeDuration
		 */
		public get closeDuration():number{
			return this._closeDuration;
		}

		public set closeDuration(value:number){
			this._closeDuration = value;
		}

		/**
		 * 动画开始播放触发的函数
		 */		
		private animationStartHandler(animation:Animation):void{
			this.inAnimation = true;
			if(this.popUp&&"enabled" in this.popUp)
				(<IUIComponent><any> (this.popUp)).enabled = false;
		}

		/**
		 * 动画播放过程中触发的更新数值函数
		 */		
		private animationUpdateHandler(animation:Animation):void{
            var rect:Rectangle = (<DisplayObject><any> (this.popUp))._scrollRect;
            var x:number = Math.round(animation.currentValue["x"]);
            var y:number = Math.round(animation.currentValue["y"]);
            if(rect){
                rect.x = x;
                rect.y = y;
                rect.width = this.popUp.width;
                rect.height = this.popUp.height;
            }
            else{
                (<DisplayObject><any> (this.popUp))._scrollRect = new Rectangle(x,y,
                    this.popUp.width, this.popUp.height)
            }
		}
		
		/**
		 * 动画播放完成触发的函数
		 */		
		private animationEndHandler(animation:Animation):void{
			this.inAnimation = false;
			if(this.popUp&&"enabled" in this.popUp)
				(<IUIComponent><any> (this.popUp)).enabled = true;
			(<DisplayObject><any> (this.popUp)).scrollRect = null;
			if(!this.popUpIsDisplayed){
				PopUpManager.removePopUp(this.popUp);
				this.popUp.ownerChanged(null);
			}
		}
		
		/**
		 * 添加或移除popUp
		 */		
		private addOrRemovePopUp():void{
			if (!this.addedToStage||!this.popUp)
				return;
			
			if (this.popUp.parent == null && this.displayPopUp){
				PopUpManager.addPopUp(this.popUp,false,false);
				this.popUp.ownerChanged(this);
				this.popUpIsDisplayed = true;
				if(this.inAnimation)
					this.animator.end();
				if(this.initialized){
					this.applyPopUpTransform(this.width, this.height);
					if(this._openDuration>0)
						this.startAnimation();
				}
				else{
					callLater(function():void{
						if(this.openDuration>0)
							this.startAnimation();
					},this);
				}
			}
			else if (this.popUp.parent != null && !this.displayPopUp){
				this.removeAndResetPopUp();
			}
		}
		/**
		 * 移除并重置popUp
		 */		
		private removeAndResetPopUp():void{
			if(this.inAnimation)
				this.animator.end();
			this.popUpIsDisplayed = false;
			if(this._closeDuration>0){
				this.startAnimation();
			}
			else{
				PopUpManager.removePopUp(this.popUp);
				this.popUp.ownerChanged(null);
			}
		}
		/**
		 * 对popUp应用尺寸和位置调整
		 */		
		private applyPopUpTransform(unscaledWidth:number, unscaledHeight:number):void{
			if (!this.popUpIsDisplayed)
				return;
			if (this.popUpWidthMatchesAnchorWidth)
				this.popUp.width = unscaledWidth;
			if (this.popUpHeightMatchesAnchorHeight)
				this.popUp.height = unscaledHeight;
			if("validateNow" in this.popUp)
				(<IInvalidating><any> (this.popUp)).validateNow();
			var popUpPoint:Point = this.calculatePopUpPosition();
			this.popUp.x = popUpPoint.x;
			this.popUp.y = popUpPoint.y;
		}
		/**
		 * 开始播放动画
		 */		
		private startAnimation():void{
            if(!this.animator){
                this.animator = new Animation(this.animationUpdateHandler,this);
                this.animator.endFunction = this.animationEndHandler;
                this.animator.startFunction = this.animationStartHandler;
            }
			this.animator.motionPaths = this.createMotionPath();
			if(this.popUpIsDisplayed){
				this.animator.duration = this._openDuration;
			}
			else{
				this.animator.duration = this._closeDuration;
			}
			this.animator.play();
		}
		
		private valueRange:number = 1;
		/**
		 * 创建动画轨迹
		 */		
		private createMotionPath():Array<any>{
			var xPath:any = {prop:"x"};
			var yPath:any = {prop:"y"};
			var path:Array<any> = [xPath,yPath];
			switch(this._popUpPosition){
				case PopUpPosition.TOP_LEFT:
				case PopUpPosition.CENTER:
				case PopUpPosition.BELOW:
					xPath.from = xPath.to = 0;
					yPath.from = this.popUp.height;
					yPath.to = 0;
					this.valueRange = this.popUp.height;
					break;
				case PopUpPosition.ABOVE:
					xPath.from = xPath.to = 0;
					yPath.from = -this.popUp.height;
					yPath.to = 0;
					this.valueRange = this.popUp.height;
					break;
				case PopUpPosition.LEFT:
					yPath.from = yPath.to = 0;
					xPath.from = -this.popUp.width;
					xPath.to = 0;
					this.valueRange = this.popUp.width;
					break;
				case PopUpPosition.RIGHT:
					yPath.from = yPath.to = 0;
					xPath.from = this.popUp.width;
					xPath.to = 0;
					this.valueRange = this.popUp.width;
					break;    
				default:
					this.valueRange = 1;
					break;
			}
			this.valueRange = Math.abs(this.valueRange);
			if(!this.popUpIsDisplayed){
				var tempValue:number = xPath.from;
				xPath.from = xPath.to;
				xPath.to = tempValue;
				tempValue = yPath.from;
				yPath.from = yPath.to;
				yPath.to = tempValue;
			}
			return path;
		}
		/**
		 * 添加到舞台事件
		 */		
		private addedToStageHandler(event:Event):void{
			this.addedToStage = true;
			callLater(this.checkPopUpState,this);
		}
		
		/**
		 * 延迟检查弹出状态，防止堆栈溢出。
		 */		
		private checkPopUpState():void{
			if(this.addedToStage){
				this.addOrRemovePopUp();    
			}
			else{
				if (this.popUp != null && (<DisplayObject><any> (this.popUp)).parent != null)
					this.removeAndResetPopUp();
			}
		}
		
		/**
		 * 从舞台移除事件
		 */		
		private removedFromStageHandler(event:Event):void{
			this.addedToStage = false;
			callLater(this.checkPopUpState,this);
		}
		
	}
}