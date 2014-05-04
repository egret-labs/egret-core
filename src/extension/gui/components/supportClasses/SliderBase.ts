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

/// <reference path="../../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../../egret/events/Event.ts"/>
/// <reference path="../../../../egret/events/TouchEvent.ts"/>
/// <reference path="../../../../egret/geom/Point.ts"/>
/// <reference path="../../core/UIGlobals.ts"/>
/// <reference path="../../effects/animation/Animation.ts"/>
/// <reference path="../../effects/animation/MotionPath.ts"/>
/// <reference path="../../effects/easing/Sine.ts"/>
/// <reference path="../../events/TrackBaseEvent.ts"/>
/// <reference path="../../events/UIEvent.ts"/>

module ns_egret {

	export class SliderBase extends TrackBase{
		/**
		 * 构造函数
		 */	
		public constructor(){
			super();
			this.maximum = 10;
		}
		
		/**
		 * [SkinPart]轨道高亮显示对象
		 */		
		public trackHighlight:DisplayObject;
		
		private _showTrackHighlight:boolean = true;
		
		/**
		 * 是否启用轨道高亮效果。默认值为true。
		 * 注意，皮肤里的子部件trackHighlight要同时为非空才能显示高亮效果。
		 */
		public get showTrackHighlight():boolean{
			return this._showTrackHighlight;
		}
		
		public set showTrackHighlight(value:boolean){
			if(this._showTrackHighlight==value)
				return;
			this._showTrackHighlight = value;
			if(this.trackHighlight)
				this.trackHighlight.visible = value;
			this.invalidateDisplayList();
		}

		
		/**
		 * 动画实例
		 */	
		private animator:Animation = null;
		
		/**
		 * @inheritDoc
		 */
		public get maximum():number{
			return super.maximum;
		}
		
		private _pendingValue:number = 0;
		/**
		 * 释放鼠标按键时滑块将具有的值。无论liveDragging是否为true，在滑块拖动期间始终更新此属性。
		 * 而value属性在当liveDragging为false时，只在鼠标释放时更新一次。
		 */
		public get pendingValue():number{
			return this._pendingValue;
		}
		public set pendingValue(value:number){
			if (value == this._pendingValue)
				return;
			this._pendingValue = value;
			this.invalidateDisplayList();
		}
		
		/**
		 * @inheritDoc
		 */
		public setValue(value:number):void{
			this._pendingValue = value;
			
			super.setValue(value);
		}
		/**
		 * 动画播放更新数值
		 */	
		private animationUpdateHandler(animation:Animation):void{
			this.pendingValue = animation.currentValue["value"];
		}
		/**
		 * 动画播放结束时要到达的value。
		 */		
		private slideToValue:number;
		/**
		 * 动画播放完毕
		 */	
		private animationEndHandler(animation:Animation):void{
			this.setValue(this.slideToValue);
			
			this.dispatchEvent(new Event(Event.CHANGE));
			this.dispatchEvent(new UIEvent(UIEvent.CHANGE_END));
		}
		/**
		 * 停止播放动画
		 */	
		private stopAnimation():void{
			this.animator.stop();
			
			this.setValue(this.nearestValidValue(this.pendingValue, this.snapInterval));
			
			this.dispatchEvent(new Event(Event.CHANGE));
			this.dispatchEvent(new UIEvent(UIEvent.CHANGE_END));
		}
		
		/**
		 * @inheritDoc
		 */
		public thumb_mouseDownHandler(event:TouchEvent):void{
			if (this.animator && this.animator.isPlaying)
				this.stopAnimation();
			
			super.thumb_mouseDownHandler(event);
		}
		
		private _liveDragging:boolean = true;
		/**
		 * 如果为 true，则将在沿着轨道拖动滑块时，而不是在释放滑块按钮时，提交此滑块的值。
		 */
		public get liveDragging():boolean{
			return this._liveDragging;
		}
		
		public set liveDragging(value:boolean){
			this._liveDragging = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public updateWhenMouseMove():void{      
			if(!this.track)
				return;
			
			var pos:Point = this.track.globalToLocal(UIGlobals.stage.mouseX, UIGlobals.stage.mouseY);
			var newValue:number = this.pointToValue(pos.x - this.clickOffset.x,pos.y - this.clickOffset.y);
			newValue = this.nearestValidValue(newValue, this.snapInterval);
			
			if (newValue != this.pendingValue){
				this.dispatchEvent(new TrackBaseEvent(TrackBaseEvent.THUMB_DRAG));
				if (this.liveDragging == true){
					this.setValue(newValue);
					this.dispatchEvent(new Event(Event.CHANGE));
				}
				else{
					this.pendingValue = newValue;
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public stage_mouseUpHandler(event:Event):void{
			super.stage_mouseUpHandler(event);
			if ((this.liveDragging == false) && (this.value != this.pendingValue)){
				this.setValue(this.pendingValue);
				this.dispatchEvent(new Event(Event.CHANGE));
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public track_mouseDownHandler(event:TouchEvent):void{
			if (!this.enabled)
				return;
			var thumbW:number = (this.thumb) ? this.thumb.width : 0;
			var thumbH:number = (this.thumb) ? this.thumb.height : 0;
			var offsetX:number = event.stageX - (thumbW / 2);
			var offsetY:number = event.stageY - (thumbH / 2);
			var p:Point = this.track.globalToLocal(offsetX, offsetY);
			
			var newValue:number = this.pointToValue(p.x, p.y);
			newValue = this.nearestValidValue(newValue, this.snapInterval);
			
			if (newValue != this.pendingValue){
				if (this.slideDuration != 0){
					if (!this.animator){
						this.animator = new Animation(this.animationUpdateHandler);
						this.animator.endFunction = this.animationEndHandler;
					}
					if (this.animator.isPlaying)
						this.stopAnimation();
					this.slideToValue = newValue;
					this.animator.duration = this.slideDuration * 
						(Math.abs(this.pendingValue - this.slideToValue) / (this.maximum - this.minimum));
					this.animator.motionPaths = [{p:"value", f:this.pendingValue, t:this.slideToValue}];
					this.dispatchEvent(new UIEvent(UIEvent.CHANGE_START));
					this.animator.play();
				}
				else{
					this.setValue(newValue);
					this.dispatchEvent(new Event(Event.CHANGE));
				}
			}
			
		}
		
		/**
		 * @inheritDoc
		 */
		public partAdded(partName:string, instance:any):void{
			super.partAdded(partName,instance);
			if(instance == this.trackHighlight){
				this.trackHighlight.touchEnabled = false;
				if(this.trackHighlight instanceof DisplayObjectContainer)
					(<DisplayObjectContainer> (this.trackHighlight)).touchChildren = false;
				this.trackHighlight.visible = this._showTrackHighlight;
			}
		}
	}
	
}
