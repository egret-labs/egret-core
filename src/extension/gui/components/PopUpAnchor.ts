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
	 * @class egret.gui.PopUpAnchor
	 * @classdesc
	 * PopUpAnchor组件用于定位布局中的弹出控件或下拉控件
	 * @extends egret.gui.UIComponent
	 */	
	export class PopUpAnchor extends UIComponent{
		/**
		 * 构造函数
		 * @method egret.gui.PopUpAnchor#constructor
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
		 * @member egret.gui.PopUpAnchor#popUpHeightMatchesAnchorHeight
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
		 * @member egret.gui.PopUpAnchor#popUpWidthMatchesAnchorWidth
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
		 * @member egret.gui.PopUpAnchor#displayPopUp
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
		
		
		private _popUp:IVisualElement = null;
		/**
		 * 要弹出或移除的目标显示对象。
		 * @member egret.gui.PopUpAnchor#popUp
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
        private _relativeToStage = false;
		private _popUpPosition:string = PopUpPosition.TOP_LEFT;
		/**
		 * popUp相对于PopUpAnchor的弹出位置。请使用PopUpPosition里定义的常量。默认值TOP_LEFT。
		 * @member egret.gui.PopUpAnchor#popUpPosition
		 */		
		public get popUpPosition():string{
			return this._popUpPosition;
		}
		public set popUpPosition(value:string){
			if (this._popUpPosition == value)
				return;
            this._relativeToStage = value == PopUpPosition.SCREEN_CENTER;
			this._popUpPosition = value;
			this.invalidateDisplayList();    
		}
		
		/**
		 * @method egret.gui.PopUpAnchor#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth, unscaledHeight);                
			this.applyPopUpTransform(unscaledWidth, unscaledHeight);            
		}
		/**
		 * 手动刷新popUp的弹出位置和尺寸。
		 * @method egret.gui.PopUpAnchor#updatePopUpTransform
		 */		
		public updatePopUpTransform():void{
			this.applyPopUpTransform(this.width, this.height);
		}
		/**
		 * 计算popUp的弹出位置
		 */		
		private calculatePopUpPosition():Point{
            var registrationPoint: Point = Point.identity;
            switch (this._popUpPosition) {
                case PopUpPosition.SCREEN_CENTER:
                    //由popup manager负责居中显示
                    break;
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
            registrationPoint = this.localToGlobal(registrationPoint.x, registrationPoint.y, registrationPoint);
            registrationPoint = this.popUp.parent.globalToLocal(registrationPoint.x, registrationPoint.y, registrationPoint);  
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
		 * @member egret.gui.PopUpAnchor#openDuration
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
		 * @member egret.gui.PopUpAnchor#closeDuration
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
                (<DisplayObject><any> (this.popUp))._setScrollRect(rect);
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
                PopUpManager.addPopUp(this.popUp, this._relativeToStage, this._relativeToStage);
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
		private createMotionPath():Array<MotionPath>{
			var xPath:SimpleMotionPath = new SimpleMotionPath("x");
			var yPath:SimpleMotionPath = new SimpleMotionPath("y");
			var path:Array<MotionPath> = [xPath,yPath];
			switch(this._popUpPosition){
				case PopUpPosition.TOP_LEFT:
				case PopUpPosition.CENTER:
				case PopUpPosition.BELOW:
					xPath.valueFrom = xPath.valueTo = 0;
					yPath.valueFrom = this.popUp.height;
					yPath.valueTo = 0;
					this.valueRange = this.popUp.height;
					break;
				case PopUpPosition.ABOVE:
					xPath.valueFrom = xPath.valueTo = 0;
					yPath.valueFrom = -this.popUp.height;
					yPath.valueTo = 0;
					this.valueRange = this.popUp.height;
					break;
				case PopUpPosition.LEFT:
					yPath.valueFrom = yPath.valueTo = 0;
					xPath.valueFrom = -this.popUp.width;
					xPath.valueTo = 0;
					this.valueRange = this.popUp.width;
					break;
				case PopUpPosition.RIGHT:
					yPath.valueFrom = yPath.valueTo = 0;
					xPath.valueFrom = this.popUp.width;
					xPath.valueTo = 0;
					this.valueRange = this.popUp.width;
					break;    
				default:
					this.valueRange = 1;
					break;
			}
			this.valueRange = Math.abs(this.valueRange);
			if(!this.popUpIsDisplayed){
				var tempValue:number = xPath.valueFrom;
				xPath.valueFrom = xPath.valueTo;
				xPath.valueTo = tempValue;
				tempValue = yPath.valueFrom;
				yPath.valueFrom = yPath.valueTo;
				yPath.valueTo = tempValue;
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