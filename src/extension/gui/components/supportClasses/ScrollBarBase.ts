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

/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../../../egret/events/TouchEvent.ts"/>
/// <reference path="../../../../egret/events/TimerEvent.ts"/>
/// <reference path="../../../../egret/geom/Point.ts"/>
/// <reference path="../../../../egret/utils/Timer.ts"/>
/// <reference path="../Button.ts"/>
/// <reference path="../../core/UIGlobals.ts"/>
/// <reference path="../../core/IViewport.ts"/>
/// <reference path="../../effects/animation/Animation.ts"/>
/// <reference path="../../effects/animation/MotionPath.ts"/>
/// <reference path="../../effects/easing/IEaser.ts"/>
/// <reference path="../../effects/easing/Linear.ts"/>
/// <reference path="../../effects/easing/Sine.ts"/>
/// <reference path="../../events/PropertyChangeEvent.ts"/>
/// <reference path="../../events/ResizeEvent.ts"/>
/// <reference path="../../events/UIEvent.ts"/>

module ns_egret {

	export class ScrollBarBase extends TrackBase{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		
		/**
		 * [SkinPart]减小滚动条值的按钮
		 */		
		public decrementButton:Button;
		
		/**
		 * [SkinPart]增大滚动条值的按钮
		 */	
		public incrementButton:Button;
		
		
		private _animator:Animation = null;
		/**
		 * 动画类实例
		 */		
		private get animator():Animation{
			if (this._animator)
				return this._animator;
			this._animator = new Animation(this.animationUpdateHandler);
			this._animator.endFunction = this.animationEndHandler;
			return this._animator;
		}
		
		/**
		 * 用户在操作系统中可以设置将鼠标滚轮每滚动一个单位应滚动多少行。
		 * 当使用鼠标滚轮滚动此组件的目标容器时，true表示根据用户系统设置的值滚动对应的行数。
		 * false则忽略系统设置，始终只滚动一行。默认值为true。
		 */
		public useMouseWheelDelta:boolean

		/**
		 * 正在步进增大值的标志
		 */		
		private steppingDown:boolean;
		/**
		 * 正在步进减小值的标志
		 */		
		private steppingUp:boolean;
		
		/**
		 * 正在步进改变值的标志
		 */		
		private isStepping:boolean;
		
		private animatingOnce:boolean;
		
		/**
		 * 滚动动画用到的缓动类
		 */		
		private static linearEaser:IEaser = new Linear();
		private static easyInLinearEaser:IEaser = new Linear(.1);
		private static deceleratingSineEaser:IEaser = new Sine(0);
		
		/**
		 * 记录当前滚动方向的标志
		 */		
		private trackScrollDown:boolean;
		
		/**
		 * 当鼠标按住轨道时用于循环滚动的计时器
		 */		
		private trackScrollTimer:Timer;
		
		/**
		 * 在鼠标按住轨道的滚动过程中记录滚动的位置
		 */		
		private trackPosition:Point = new Point();
		
		/**
		 * 正在进行鼠标按住轨道滚动过程的标志
		 */		
		private trackScrolling:boolean = false;
		
		/**
		 * @inheritDoc
		 */
		public set minimum(value:number){
			if (value == super.minimum)
				return;
			
			super.minimum = value;
			this.invalidateSkinState();
		}
		
		/**
		 * @inheritDoc
		 */
		public set maximum(value:number){
			if (value == super.maximum)
				return;
			
			super.maximum = value;
			this.invalidateSkinState();
		}
		
		/**
		 * @inheritDoc
		 */
		public set snapInterval(value:number){
			super.snapInterval = value;
			this.pageSizeChanged = true;
		}
		
		private _pageSize:number = 20;
		
		/**
		 * 翻页大小改变标志
		 */		
		private pageSizeChanged:boolean = false;
		
		/**
		 * 翻页大小,调用 changeValueByPage() 方法时 value 属性值的改变量。
		 */	
		public get pageSize():number{
			return this._pageSize;
		}
		
		public set pageSize(value:number){
			if (value == this._pageSize)
				return;
			
			this._pageSize = value;
			this.pageSizeChanged = true;
			
			this.invalidateProperties();
			this.invalidateDisplayList();
		}
		
		
		private _smoothScrolling:boolean = true;

		/**
		 * 翻页和步进时滚动条是否播放平滑的动画。
		 */		
		public get smoothScrolling():boolean{
			return this._smoothScrolling;
		}

		public set smoothScrolling(value:boolean){
			this._smoothScrolling = value;
		}

		
		private _repeatInterval:number = 35;

		/**
		 * 用户在轨道上按住鼠标时，page 事件之间相隔的毫秒数。
		 */		
		public get repeatInterval():number{
			return this._repeatInterval;
		}

		public set repeatInterval(value:number){
			this._repeatInterval = value;
		}

		
		private _fixedThumbSize:boolean = false;

		/**
		 * 如果为 true，则沿着滚动条的滑块的大小将不随滚动条最大值改变。
		 */		
		public get fixedThumbSize():boolean{
			return this._fixedThumbSize;
		}

		public set fixedThumbSize(value:boolean){
			if(this._fixedThumbSize == value)
				return;
			this._fixedThumbSize = value;
			this.invalidateDisplayList();
		}

		
		private _repeatDelay:number = 500;

		/**
		 * 在第一个 page 事件之后直到后续的 page 事件发生之间相隔的毫秒数。
		 */		
		public get repeatDelay():number{
			return this._repeatDelay;
		}

		public set repeatDelay(value:number){
			this._repeatDelay = value;
		}

		
		private _autoThumbVisibility:boolean = true;

		/**
		 * 如果为 true（默认值），则无论何时更新滑块的大小，都将重置滑块的可见性。
		 */		
		public get autoThumbVisibility():boolean{
			return this._autoThumbVisibility;
		}

		public set autoThumbVisibility(value:boolean){
			if(this._autoThumbVisibility == value)
				return;
			this._autoThumbVisibility = value;
			this.invalidateDisplayList();
		}

		
		private _viewport:IViewport;
		
		/**
		 * 由此滚动条控制的可滚动组件。
		 */
		public get viewport():IViewport{
			return this._viewport;
		}
		public set viewport(value:IViewport){
			if (value == this._viewport)
				return;
			
			if (this._viewport)  {
				this._viewport.removeEventListener(PropertyChangeEvent.PROPERTY_CHANGE, this.viewport_propertyChangeHandler, this);
				this._viewport.removeEventListener(ResizeEvent.RESIZE, this.viewportResizeHandler, this);
				this._viewport.clipAndEnableScrolling = false;
			}
			
			this._viewport = value;
			
			if (this._viewport)  {
				this._viewport.addEventListener(PropertyChangeEvent.PROPERTY_CHANGE, this.viewport_propertyChangeHandler, this);
				this._viewport.addEventListener(ResizeEvent.RESIZE, this.viewportResizeHandler, this);
				this._viewport.clipAndEnableScrolling = true;
			}
		}
		
		/**
		 * 开始播放动画
		 */		
		public startAnimation(duration:number, valueTo:number, 
										easer:IEaser, startDelay:number = 0):void{
			this.animator.stop();
			this.animator.duration = duration;
			this.animator.easer = easer;
			this.animator.motionPaths = new <MotionPath>[
				new MotionPath("value", this.value, valueTo)];
			this.animator.startDelay = startDelay;
			this.animator.play();
		}
		
		/**
		 * 根据指定数值返回最接近snapInterval的整数倍的数值
		 */		
		private nearestValidSize(size:number):number{
			var interval:number = this.snapInterval;
			if (interval == 0)
				return size;
			
			var validSize:number = Math.round(size / interval) * interval
			return (Math.abs(validSize) < interval) ? interval : validSize;
		}
		
		/**
		 * @inheritDoc
		 */
		public commitProperties():void{
			super.commitProperties();
			
			if (this.pageSizeChanged){
				this._pageSize = this.nearestValidSize(this._pageSize);
				this.pageSizeChanged = false;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName, instance);
			
			if (instance == this.decrementButton){
				this.decrementButton.addEventListener(UIEvent.BUTTON_DOWN,
					this.button_buttonDownHandler,
					this);
				this.decrementButton.addEventListener(TouchEvent.TOUCH_ROLL_OVER,
					this.button_rollOverHandler,
					this);
				this.decrementButton.addEventListener(TouchEvent.TOUCH_ROLL_OUT,
					this.button_rollOutHandler,
					this);
				this.decrementButton.autoRepeat = true;
			}
			else if (instance == this.incrementButton){
				this.incrementButton.addEventListener(UIEvent.BUTTON_DOWN,
					this.button_buttonDownHandler,
					this);
				this.incrementButton.addEventListener(TouchEvent.TOUCH_ROLL_OVER,
					this.button_rollOverHandler,
					this);
				this.incrementButton.addEventListener(TouchEvent.TOUCH_ROLL_OUT,
					this.button_rollOutHandler,
					this);
				this.incrementButton.autoRepeat = true;
			}
			else if (instance == this.track){
				this.track.addEventListener(TouchEvent.TOUCH_ROLL_OVER,
					this.track_rollOverHandler,
					this);
				this.track.addEventListener(TouchEvent.TOUCH_ROLL_OUT,
					this.track_rollOutHandler,
					this);
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public partRemoved(partName:string, instance:any):void{
			super.partRemoved(partName, instance);
			
			if (instance == this.decrementButton){
				this.decrementButton.removeEventListener(UIEvent.BUTTON_DOWN,
					this.button_buttonDownHandler,
					this);
				this.decrementButton.removeEventListener(TouchEvent.TOUCH_ROLL_OVER,
					this.button_rollOverHandler,
					this);
				this.decrementButton.removeEventListener(TouchEvent.TOUCH_ROLL_OUT,
					this.button_rollOutHandler,
					this);
			}
			else if (instance == this.incrementButton){
				this.incrementButton.removeEventListener(UIEvent.BUTTON_DOWN,
					this.button_buttonDownHandler,
					this);
				this.incrementButton.removeEventListener(TouchEvent.TOUCH_ROLL_OVER,
					this.button_rollOverHandler,
					this);
				this.incrementButton.removeEventListener(TouchEvent.TOUCH_ROLL_OUT,
					this.button_rollOutHandler,
					this);
			}
			else if (instance == this.track){
				this.track.removeEventListener(TouchEvent.TOUCH_ROLL_OVER,
					this.track_rollOverHandler,
					this);
				this.track.removeEventListener(TouchEvent.TOUCH_ROLL_OUT, 
					this.track_rollOutHandler, 
					this);
			}
		}
		
		/**
		 * 从 value 增加或减去 pageSize。每次增加后，新的 value 是大于当前 value 的 pageSize 的最接近倍数。<br/>
		 * 每次减去后，新的 value 是小于当前 value 的 pageSize 的最接近倍数。value 的最小值是 pageSize。
		 * @param increase 翻页操作是增加 (true) 还是减少 (false) value。
		 */		
		public changeValueByPage(increase:boolean = true):void{
			var val:number;
			if (increase)
				val = Math.min(this.value + this.pageSize, this.maximum);
			else
				val = Math.max(this.value - this.pageSize, this.minimum);
			if (this._smoothScrolling){
				this.startAnimation(this._repeatInterval, val, ScrollBarBase.linearEaser);
			}
			else{
				this.setValue(val);
				this.dispatchEvent(new Event(Event.CHANGE));
			}
		}
		
		/**
		 * 目标视域组件属性发生改变
		 */		
		private viewport_propertyChangeHandler(event:PropertyChangeEvent):void{
			switch(event.property) {
				case "contentWidth": 
					this.viewportContentWidthChangeHandler(event);
					break;
				
				case "contentHeight": 
					this.viewportContentHeightChangeHandler(event);
					break;
				
				case "horizontalScrollPosition":
					this.viewportHorizontalScrollPositionChangeHandler(event);
					break;
				
				case "verticalScrollPosition":
					this.viewportVerticalScrollPositionChangeHandler(event);
					break;
			}
		}
		
		/**
		 * 目标视域组件尺寸发生改变
		 */		
		public viewportResizeHandler(event:ResizeEvent):void{
		}
		
		/**
		 * 目标视域组件的内容宽度发生改变。
		 */		
		public viewportContentWidthChangeHandler(event:PropertyChangeEvent):void{
		}
		
		/**
		 * 目标视域组件的内容高度发生改变。
		 */		
		public viewportContentHeightChangeHandler(event:PropertyChangeEvent):void{
		}
		
		/**
		 * 目标视域组件的水平方向滚动条位置发生改变
		 */		
		public viewportHorizontalScrollPositionChangeHandler(event:PropertyChangeEvent):void{
		}  
		
		/**
		 * 目标视域组件的垂直方向滚动条位置发生改变
		 */		
		public viewportVerticalScrollPositionChangeHandler(event:PropertyChangeEvent):void{
		} 
		
		/**
		 * 鼠标在滑块按下事件
		 */		
		public thumb_mouseDownHandler(event:TouchEvent) : void{
			
			this.stopAnimation();
			
			super.thumb_mouseDownHandler(event);
		}
		
		/**
		 * 鼠标在两端按钮上按住不放的事件
		 */		
		public button_buttonDownHandler(event:Event):void{
			if (!this.isStepping)
				this.stopAnimation();
			var increment:boolean = (event.target == this.incrementButton);
			if (!this.isStepping && 
				((increment && this.value < this.maximum) ||
					(!increment && this.value > this.minimum))){
				this.dispatchEvent(new UIEvent(UIEvent.CHANGE_START));
				this.isStepping = true;
				UIGlobals.stage.addEventListener(TouchEvent.TOUCH_END, 
					this.button_buttonUpHandler, 
					this, false,0,true);
				UIGlobals.stage.addEventListener(
					Event.LEAVE_STAGE, this.button_buttonUpHandler, this,false,0,true);
			}
			if (!this.steppingDown && !this.steppingUp){
				this.changeValueByStep(increment);
				if (this._smoothScrolling &&
					((increment && this.value < this.maximum) ||
						(!increment && this.value > this.minimum))){
					this.animateStepping(increment ? this.maximum : this.minimum, 
						Math.max(this.pageSize/10, this.stepSize));
				}
				return;
			}
		}
		
		/**
		 * 鼠标在两端按钮上弹起的事件
		 */		
		public button_buttonUpHandler(event:Event):void{
			if (this.steppingDown || this.steppingUp){
				
				this.stopAnimation();
				
				this.dispatchEvent(new UIEvent(UIEvent.CHANGE_END));
				
				this.steppingUp = this.steppingDown = false;
				this.isStepping = false;
			}
			else if (this.isStepping){
				
				this.dispatchEvent(new UIEvent(UIEvent.CHANGE_END));
				this.isStepping = false;
			}
			
			UIGlobals.stage.removeEventListener(TouchEvent.TOUCH_END, 
				this.button_buttonUpHandler, 
				this);
			UIGlobals.stage.removeEventListener(
				Event.LEAVE_STAGE, this.button_buttonUpHandler, this);
		}
		
		/**
		 * @inheritDoc
		 */
		public track_mouseDownHandler(event:TouchEvent):void{
			if (!this.enabled)
				return;
			this.stopAnimation();
			this.trackPosition = this.track.globalToLocal(new Point(event.stageX, event.stageY));
			if (event.shiftKey){
				var thumbW:number = (this.thumb) ? this.thumb.layoutBoundsWidth : 0;
				var thumbH:number = (this.thumb) ? this.thumb.layoutBoundsHeight : 0;
				this.trackPosition.x -= (thumbW / 2);
				this.trackPosition.y -= (thumbH / 2);        
			}
			
			var newScrollValue:number = this.pointToValue(this.trackPosition.x, this.trackPosition.y);
			this.trackScrollDown = (newScrollValue > this.value);
			
			if (event.shiftKey){
				var adjustedValue:number = this.nearestValidValue(newScrollValue, this.snapInterval);
				if (this._smoothScrolling && 
					this.slideDuration != 0 && 
					(this.maximum - this.minimum) != 0){
					this.dispatchEvent(new UIEvent(UIEvent.CHANGE_START));
					
					this.startAnimation(this.slideDuration * 
						(Math.abs(this.value - newScrollValue) / (this.maximum - this.minimum)),
						adjustedValue, ScrollBarBase.deceleratingSineEaser);
					this.animatingOnce = true;
				}
				else{
					this.setValue(adjustedValue);
					this.dispatchEvent(new Event(Event.CHANGE));
				}
				return;
			}
			
			this.dispatchEvent(new UIEvent(UIEvent.CHANGE_START));
			
			this.animatingOnce = false;
			
			this.changeValueByPage(this.trackScrollDown);
			
			this.trackScrolling = true;
			UIGlobals.stage.addEventListener(TouchEvent.TOUCH_MOVE, 
				this.track_mouseMoveHandler, 
				this, false,0,true);      
			UIGlobals.stage.addEventListener(TouchEvent.TOUCH_END, 
				this.track_mouseUpHandler, 
				this, false,0,true);
			UIGlobals.stage.addEventListener(Event.LEAVE_STAGE, 
				this.track_mouseUpHandler, 
				this,false,0,true);
			if (!this.trackScrollTimer){
				this.trackScrollTimer = new Timer(this._repeatDelay, 1);
				this.trackScrollTimer.addEventListener(TimerEvent.TIMER, 
					this.trackScrollTimerHandler, 
					this);
			} 
			else{
				this.trackScrollTimer.delay = this._repeatDelay;
				this.trackScrollTimer.repeatCount = 1;
			}
			this.trackScrollTimer.start();
		}
		
		/**
		 * 计算并播放翻页动画
		 */		
		public animatePaging(newValue:number, pageSize:number):void{
			this.animatingOnce = false;
			
			this.startAnimation(
				this._repeatInterval * (Math.abs(newValue - this.value) / pageSize),
				newValue, ScrollBarBase.linearEaser);
		}
		
		/**
		 * 播放步进动画
		 */		
		public animateStepping(newValue:number, stepSize:number):void{
			this.steppingDown = (newValue > this.value);
			this.steppingUp = !this.steppingDown;
			var denominator:number = (stepSize != 0) ? stepSize : 1; 
			var duration:number = this._repeatInterval * 
				(Math.abs(newValue - this.value) / denominator);
			
			var easer:IEaser;
			if (duration > 5000)
				easer = new Linear(500/duration);
			else
				easer = ScrollBarBase.easyInLinearEaser;
			this.startAnimation(duration, newValue, easer, this._repeatDelay);
		}
		
		/**
		 * 动画播放过程中触发的更新数值函数
		 */		
		private animationUpdateHandler(animation:Animation):void{
			this.setValue(animation.currentValue["value"]);
		}
		
		/**
		 * 动画播放完成触发的函数
		 */		
		private animationEndHandler(animation:Animation):void{
			if (this.trackScrolling)
				this.trackScrolling = false;
			if (this.steppingDown || this.steppingUp){
				this.changeValueByStep(this.steppingDown);
				
				this.animator.startDelay = 0;
				return;
			}
			this.setValue(this.nearestValidValue(this.value, this.snapInterval));
			this.dispatchEvent(new Event(Event.CHANGE));
			if (this.animatingOnce){
				this.dispatchEvent(new UIEvent(UIEvent.CHANGE_END));
				this.animatingOnce = false;
			}
		}
		
		/**
		 * 立即停止动画的播放
		 */		
		public stopAnimation():void{
			if (this.animator.isPlaying)
				this.animationEndHandler(this.animator);
			this.animator.stop();
		}
		
		/**
		 * 在轨道上按住shift并按下鼠标后，滑块滑动到按下点的计时器触发函数
		 */		
		private trackScrollTimerHandler(event:Event):void{
			var newScrollValue:number = this.pointToValue(this.trackPosition.x, this.trackPosition.y);
			if(newScrollValue==this.value)
				return;
			var fixedThumbSize:boolean = this._fixedThumbSize !== false;
			if (this.trackScrollDown){
				var range:number = this.maximum - this.minimum;
				if (range == 0)
					return;
				
				if ((this.value + this.pageSize) > newScrollValue &&
					(!fixedThumbSize || this.nearestValidValue(newScrollValue, this.pageSize) != this.maximum))
					return;
			}
			else if (newScrollValue > this.value){
				return;
			}
			
			if (this._smoothScrolling){
				var valueDelta:number = Math.abs(this.value - newScrollValue);
				var pages:number;
				var pageToVal:number;
				if (newScrollValue > this.value){
					pages = this.pageSize != 0 ? 
						<number> (valueDelta / this.pageSize) :
						valueDelta;
					if (fixedThumbSize && this.nearestValidValue(newScrollValue, this.pageSize) == this.maximum)
						pageToVal = this.maximum;
					else
						pageToVal = this.value + (pages * this.pageSize);
				}
				else{
					pages = this.pageSize != 0 ? 
						<number> (Math.ceil(valueDelta / this.pageSize)) :
						valueDelta;
					pageToVal = Math.max(this.minimum, this.value - (pages * this.pageSize));
				}
				this.animatePaging(pageToVal, this.pageSize);
				return;
			}
			
			var oldValue:number = this.value;
			
			this.changeValueByPage(this.trackScrollDown);
			
			if (this.trackScrollTimer && this.trackScrollTimer.repeatCount == 1){
				this.trackScrollTimer.delay = this._repeatInterval;
				this.trackScrollTimer.repeatCount = 0;
			}
		}
		
		/**
		 * 轨道上鼠标移动事件
		 */		
		private track_mouseMoveHandler(event:TouchEvent):void{
			if (this.trackScrolling){
				var pt:Point = new Point(event.stageX, event.stageY);
				
				this.trackPosition = this.track.globalToLocal(pt);
			}
		}
		
		/**
		 * 轨道上鼠标弹起事件
		 */		
		private track_mouseUpHandler(event:Event):void{
			this.trackScrolling = false;
			
			UIGlobals.stage.removeEventListener(TouchEvent.TOUCH_MOVE, 
				this.track_mouseMoveHandler, 
				this);      
			UIGlobals.stage.removeEventListener(TouchEvent.TOUCH_END, 
				this.track_mouseUpHandler, 
				this);
			UIGlobals.stage.removeEventListener(Event.LEAVE_STAGE, 
				this.track_mouseUpHandler, 
				this);
			if (this._smoothScrolling){
				if (!this.animatingOnce){
					if (this.trackScrollTimer && this.trackScrollTimer.running){
						if (this.animator.isPlaying)
							this.animatingOnce = true;
						else
							this.dispatchEvent(new UIEvent(UIEvent.CHANGE_END));
					}
					else{
						this.stopAnimation();
						this.dispatchEvent(new UIEvent(UIEvent.CHANGE_END));
					}
				}
			}
			else{
				this.dispatchEvent(new UIEvent(UIEvent.CHANGE_END));
			}
			
			if (this.trackScrollTimer)
				this.trackScrollTimer.reset();
		}
		
		/**
		 * 鼠标经过轨道触发函数
		 */		
		private track_rollOverHandler(event:TouchEvent):void{
			if (this.trackScrolling && this.trackScrollTimer)
				this.trackScrollTimer.start();
		}
		
		/**
		 * 鼠标移出轨道时触发的函数
		 */		
		private track_rollOutHandler(event:TouchEvent):void{
			if (this.trackScrolling && this.trackScrollTimer)
				this.trackScrollTimer.stop();
		}
		
		/**
		 * 鼠标经过两端按钮时触发函数
		 */		
		private button_rollOverHandler(event:TouchEvent):void{
			if (this.steppingUp || this.steppingDown)
				this.animator.resume();
		}
		
		/**
		 * 鼠标移出两端按钮是触发函数
		 */		
		private button_rollOutHandler(event:TouchEvent):void{
			if (this.steppingUp || this.steppingDown)
				this.animator.pause();
		}
	}
	
}