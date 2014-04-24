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
/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../../../egret/events/TouchEvent.ts"/>
/// <reference path="../../../../egret/events/TimerEvent.ts"/>
/// <reference path="../../../../egret/text/TextAlign.ts"/>
/// <reference path="../../../../egret/utils/Timer.ts"/>
/// <reference path="../Label.ts"/>
/// <reference path="../SkinnableComponent.ts"/>
/// <reference path="../../core/UIGlobals.ts"/>
/// <reference path="../../core/IDisplayText.ts"/>
/// <reference path="../../events/UIEvent.ts"/>
/// <reference path="../../../../egret/interactive/InteractionMode.ts"/>

module ns_egret {

	export class ButtonBase extends SkinnableComponent{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
			this.touchChildren = false;
			this.addHandlers();
		}
		
		/**
		 * 已经开始过不断抛出buttonDown事件的标志
		 */		
		private _downEventFired:boolean = false;
		
		/**
		 * 重发buttonDown事件计时器 
		 */		
		private autoRepeatTimer:Timer;
		
		/**
		 * [SkinPart]按钮上的文本标签
		 */
		public labelDisplay:IDisplayText;

		
		private _autoRepeat:boolean = false;
		/**
		 * 指定在用户按住鼠标按键时是否重复分派 buttonDown 事件。
		 */		
		public get autoRepeat():boolean{
			return this._autoRepeat;
		}
		
		public set autoRepeat(value:boolean){
			if (value == this._autoRepeat)
				return;
			
			this._autoRepeat = value;
			this.checkAutoRepeatTimerConditions(this.isDown());
		}
		
		private _repeatDelay:number = 35;
		/**
		 * 在第一个 buttonDown 事件之后，以及相隔每个 repeatInterval 重复一次 buttonDown 事件之前，需要等待的毫秒数。
		 */
		public get repeatDelay():number{
			return this._repeatDelay;
		}

		public set repeatDelay(value:number){
			this._repeatDelay = value;
		}
		
		private _repeatInterval:number = 35;

		/**
		 * 用户在按钮上按住鼠标时，buttonDown 事件之间相隔的毫秒数。
		 */		
		public get repeatInterval():number{
			return this._repeatInterval;
		}

		public set repeatInterval(value:number){
			this._repeatInterval = value;
		}


		private _hovered:boolean = false;
		/**
		 * 指示鼠标指针是否位于按钮上。
		 */
		public get hovered():boolean{
			return this._hovered;
		}

		public set hovered(value:boolean){
			if (value == this._hovered)
				return;
			this._hovered = value;
			this.invalidateSkinState();
			this.checkButtonDownConditions();
		}

		private _keepDown:boolean = false;
		
		/**
		 * 强制让按钮停在鼠标按下状态,此方法不会导致重复抛出buttonDown事件,仅影响皮肤State。
		 * @param down 是否按下
		 */				
		public keepDown(down:boolean):void{
			if (this._keepDown == down)
				return;
			this._keepDown = down;
			this.invalidateSkinState();
		}
		
		
		private _label:string = "";
		/**
		 * 要在按钮上显示的文本
		 */		
		public set label(value:string){
			this._label = value;
			if(this.labelDisplay){
				this.labelDisplay.text = value;
			}
		}
		
		public get label():string          {
			if(this.labelDisplay){
				return this.labelDisplay.text;
			}
			else{
				return this._label;
			}
		}
		
		private _mouseCaptured:boolean = false; 
		/**
		 * 指示第一次分派 MouseEvent.MOUSE_DOWN 时，是否按下鼠标以及鼠标指针是否在按钮上。
		 */		
		public get mouseCaptured():boolean{
			return this._mouseCaptured;
		}
		
		public set mouseCaptured(value:boolean){
			if (value == this._mouseCaptured)
				return;
			
			this._mouseCaptured = value;        
			this.invalidateSkinState();
			if (!value)
				this.removeStageMouseHandlers();
			this.checkButtonDownConditions();
		}
		
		private _stickyHighlighting:boolean = false;
		/**
		 * 如果为 false，则按钮会在用户按下它时显示其鼠标按下时的外观，但在用户将鼠标拖离它时将改为显示鼠标经过的外观。
		 * 如果为 true，则按钮会在用户按下它时显示其鼠标按下时的外观，并在用户将鼠标拖离时继续显示此外观。
		 */
		public get stickyHighlighting():boolean{
			return this._stickyHighlighting
		}

		public set stickyHighlighting(value:boolean){
			if (value == this._stickyHighlighting)
				return;

			this._stickyHighlighting = value;
			this.invalidateSkinState();
			this.checkButtonDownConditions();
		}


		/**
		 * 开始抛出buttonDown事件
		 */		
		private checkButtonDownConditions():void{
			var isCurrentlyDown:boolean = this.isDown();
			if (this._downEventFired != isCurrentlyDown){
				if (isCurrentlyDown){
					this.dispatchEvent(new UIEvent(UIEvent.BUTTON_DOWN));
				}
				
				this._downEventFired = isCurrentlyDown;
				this.checkAutoRepeatTimerConditions(isCurrentlyDown);
			}
		}
		
		/**
		 * 添加鼠标事件监听
		 */		
		public addHandlers():void{
			this.addEventListener(TouchEvent.TOUCH_ROLL_OVER, this.mouseEventHandler, this);
			this.addEventListener(TouchEvent.TOUCH_ROLL_OUT, this.mouseEventHandler, this);
			this.addEventListener(TouchEvent.TOUCH_BEGAN, this.mouseEventHandler, this);
			this.addEventListener(TouchEvent.TOUCH_END, this.mouseEventHandler, this);
			this.addEventListener(TouchEvent.TOUCH_TAP, this.mouseEventHandler, this);
		}
		
		/**
		 * 添加舞台鼠标弹起事件监听
		 */		
		private addStageMouseHandlers():void{
			UIGlobals.stage.addEventListener(TouchEvent.TOUCH_END,this.stage_mouseUpHandler,this);
			
			UIGlobals.stage.addEventListener(Event.LEAVE_STAGE,this.stage_mouseUpHandler,this);
		}
		
		/**
		 * 移除舞台鼠标弹起事件监听
		 */	
		private removeStageMouseHandlers():void{
			UIGlobals.stage.removeEventListener(TouchEvent.TOUCH_END,this.stage_mouseUpHandler,this);
			
			UIGlobals.stage.removeEventListener(Event.LEAVE_STAGE,this.stage_mouseUpHandler,this);
		}
		
		/**
		 * 按钮是否是按下的状态
		 */		
		private isDown():boolean{
			if (!this.enabled)
				return false;
			
			if (this.mouseCaptured && (this.hovered || this.stickyHighlighting))
				return true;
			return false;
		}
		
		
		/**
		 * 检查需要启用还是关闭重发计时器
		 */		
		private checkAutoRepeatTimerConditions(buttonDown:boolean):void{
			var needsTimer:boolean = this.autoRepeat && buttonDown;
			var hasTimer:boolean = this.autoRepeatTimer != null;
			
			if (needsTimer == hasTimer)
				return;
			
			if (needsTimer)
				this.startTimer();
			else
				this.stopTimer();
		}
		
		/**
		 * 启动重发计时器
		 */		
		private startTimer():void{
			this.autoRepeatTimer = new Timer(1);
			this.autoRepeatTimer.delay = this._repeatDelay;
			this.autoRepeatTimer.addEventListener(TimerEvent.TIMER, this.autoRepeat_timerDelayHandler, this);
			this.autoRepeatTimer.start();
		}
		
		/**
		 * 停止重发计时器
		 */		
		private stopTimer():void{
			this.autoRepeatTimer.stop();
			this.autoRepeatTimer = null;
		}
		
		
		/**
		 * 鼠标事件处理
		 */	
		public mouseEventHandler(event:Event):void{
			var touchEvent:TouchEvent = <TouchEvent> event;
			switch (event.type){
				case TouchEvent.TOUCH_ROLL_OVER:{
					if (touchEvent.touchDown && !this.mouseCaptured)
						return;
					this.hovered = true;
					break;
				}

				case TouchEvent.TOUCH_ROLL_OUT:{
					this.hovered = false;
					break;
				}

				case TouchEvent.TOUCH_BEGAN:{
					this.addStageMouseHandlers();
                    if(InteractionMode.mode==InteractionMode.TOUCH)
                        this.hovered = true;
					this.mouseCaptured = true;
					break;
				}
					
				case TouchEvent.TOUCH_END:{
					if (event.target == this){
						this.hovered = true;

						if (this.mouseCaptured){
							this.buttonReleased();
							this.mouseCaptured = false;
						}
					}
					break;
				}
				case TouchEvent.TOUCH_TAP:{
					if (!this.enabled)
						event.stopImmediatePropagation();
					else
						this.clickHandler(<TouchEvent> event);
					return;
				}
			}
		}
		
		/**
		 * 按钮弹起事件
		 */		
		public buttonReleased():void{
		}
		
		/**
		 * 按钮点击事件
		 */		
		public clickHandler(event:TouchEvent):void{
		}
		
		/**
		 * 舞台上鼠标弹起事件
		 */		
		private stage_mouseUpHandler(event:Event):void{
			if (event.target == this)
				return;
			
			this.mouseCaptured = false;
		}
		
		/**
		 * 自动重发计时器首次延迟结束事件
		 */		
		private autoRepeat_timerDelayHandler(event:TimerEvent):void{
			this.autoRepeatTimer.reset();
			this.autoRepeatTimer.removeEventListener( TimerEvent.TIMER, this.autoRepeat_timerDelayHandler, this);
			
			this.autoRepeatTimer.delay = this._repeatInterval;
			this.autoRepeatTimer.addEventListener( TimerEvent.TIMER, this.autoRepeat_timerHandler, this);
			this.autoRepeatTimer.start();
		}
		
		/**
		 * 自动重发buttonDown事件
		 */		
		private autoRepeat_timerHandler(event:TimerEvent):void{
			this.dispatchEvent(new UIEvent(UIEvent.BUTTON_DOWN));
		}
		
		/**
		 * @inheritDoc
		 */
		public getCurrentSkinState():string{
			if (!this.enabled)
				return super.getCurrentSkinState();
			
			if (this.isDown()||this._keepDown)
				return "down";

			if (InteractionMode.mode==InteractionMode.MOUSE&&(this.hovered || this.mouseCaptured))
				return "over";

			return "up";
		}
		
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.labelDisplay){
				this.labelDisplay.text = this._label;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public commitProperties():void{
			super.commitProperties();
			if(this.createLabelIfNeedChanged){
				this.createLabelIfNeedChanged = false;
				if(this.createLabelIfNeed){
					this.createSkinParts();
					this.invalidateSize();
					this.invalidateDisplayList();
				}
				else{
					this.removeSkinParts();
				}
			}
		}
		
		private _createLabelIfNeed:boolean = true;
		
		private createLabelIfNeedChanged:boolean = false;
		/**
		 * 如果皮肤不提供labelDisplay子项，自己是否创建一个，默认为true。
		 */
		public get createLabelIfNeed():boolean{
			return this._createLabelIfNeed;
		}

		public set createLabelIfNeed(value:boolean){
			if(value==this._createLabelIfNeed)
				return;
			this._createLabelIfNeed = value;
			this.createLabelIfNeedChanged = true;
			this.invalidateProperties();
		}
		/**
		 * 创建过label的标志
		 */
		private hasCreatedLabel:boolean = false;
		
		/**
		 * @inheritDoc
		 */
		public createSkinParts():void{
			if(this.hasCreatedLabel||!this._createLabelIfNeed)
				return;
			this.hasCreatedLabel = true;
			var text:Label = new Label();
			text.textAlign = TextAlign.CENTER;
			text.verticalAlign = VerticalAlign.MIDDLE;
			text.maxDisplayedLines = 1;
			text.left = 10;
			text.right = 10;
			text.top = 2;
			text.bottom = 2;
			this.addToDisplayList(text);
			this.labelDisplay = text;
			this.partAdded("labelDisplay",this.labelDisplay);
		}
		
		/**
		 * @inheritDoc
		 */
		public removeSkinParts():void{
			if(!this.hasCreatedLabel)
				return;
			this.hasCreatedLabel = false;
			if(!this.labelDisplay)
				return;
			this._label = this.labelDisplay.text;
			this.partRemoved("labelDisplay",this.labelDisplay);
			this.removeFromDisplayList(<DisplayObject> (this.labelDisplay));
			this.labelDisplay = null;
		}
		
	}
	
}
