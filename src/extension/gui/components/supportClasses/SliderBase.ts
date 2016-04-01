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
	 * @class egret.gui.SliderBase
	 * @classdesc
	 * 滑块控件基类
	 * @extends egret.gui.TrackBase
	 */
	export class SliderBase extends TrackBase{
		/**
		 * 构造函数
		 * @method egret.gui.SliderBase#constructor
		 */	
		public constructor(){
			super();
			this.maximum = 10;
		}
		
		/**
		 * [SkinPart]轨道高亮显示对象
		 * @member egret.gui.SliderBase#trackHighlight
		 */		
        public trackHighlight: DisplayObject = null;
		
		private _showTrackHighlight:boolean = true;
		
		/**
		 * 是否启用轨道高亮效果。默认值为true。
		 * 注意，皮肤里的子部件trackHighlight要同时为非空才能显示高亮效果。
		 * @member egret.gui.SliderBase#showTrackHighlight
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
        private animator: Animation = null;
		
		private _pendingValue:number = 0;
		/**
		 * 释放鼠标按键时滑块将具有的值。无论liveDragging是否为true，在滑块拖动期间始终更新此属性。
		 * 而value属性在当liveDragging为false时，只在鼠标释放时更新一次。
		 * @member egret.gui.SliderBase#pendingValue
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
		 * 在 value 属性改变时为该属性设置后备存储，并调度 valueCommit 事件
		 * @method egret.gui.SliderBase#setValue
		 * @param value {number} 
		 */
		public setValue(value:number):void{
			this._pendingValue = value;
			
			super.setValue(value);
		}
		/**
		 * 动画播放更新数值
		 */	
		public _animationUpdateHandler(animation:Animation):void{
			this.pendingValue = animation.currentValue["value"];
		}
		/**
		 * 动画播放结束时要到达的value。
		 */		
		private slideToValue:number = NaN;
		/**
		 * 动画播放完毕
		 */	
		private animationEndHandler(animation:Animation):void{
			this.setValue(this.slideToValue);
			
			this.dispatchEventWith(Event.CHANGE);
            UIEvent.dispatchUIEvent(this,UIEvent.CHANGE_END);
		}
		/**
		 * 停止播放动画
		 */	
		private stopAnimation():void{
			this.animator.stop();
			
			this.setValue(this.nearestValidValue(this.pendingValue, this.snapInterval));
			
			this.dispatchEventWith(Event.CHANGE);
            UIEvent.dispatchUIEvent(this,UIEvent.CHANGE_END);
		}
		
		/**
		 * @method egret.gui.SliderBase#thumb_mouseDownHandler
		 * @param event {TouchEvent} 
		 */
		public thumb_mouseDownHandler(event:TouchEvent):void{
			if (this.animator && this.animator.isPlaying)
				this.stopAnimation();
			
			super.thumb_mouseDownHandler(event);
		}
		
		private _liveDragging:boolean = true;
		/**
		 * 如果为 true，则将在沿着轨道拖动滑块时，而不是在释放滑块按钮时，提交此滑块的值。
		 * @member egret.gui.SliderBase#liveDragging
		 */
		public get liveDragging():boolean{
			return this._liveDragging;
		}
		
		public set liveDragging(value:boolean){
			this._liveDragging = value;
		}
		
		/**
		 * @method egret.gui.SliderBase#updateWhenMouseMove
		 */
		public updateWhenMouseMove():void{      
			if(!this.track)
				return;
			
			var pos:Point = this.track.globalToLocal(this._moveStageX, this._moveStageY, egret.$TempPoint);
			var newValue:number = this.pointToValue(pos.x - this._clickOffsetX,pos.y - this._clickOffsetY);
			newValue = this.nearestValidValue(newValue, this.snapInterval);
			
			if (newValue != this.pendingValue){
                TrackBaseEvent.dispatchTrackBaseEvent(this,TrackBaseEvent.THUMB_DRAG);
				if (this.liveDragging == true){
					this.setValue(newValue);
					this.dispatchEventWith(Event.CHANGE);
				}
				else{
					this.pendingValue = newValue;
				}
			}
		}
		
		/**
		 * @method egret.gui.SliderBase#stage_mouseUpHandler
		 * @param event {Event} 
		 */
		public stage_mouseUpHandler(event:Event):void{
			super.stage_mouseUpHandler(event);
			if ((this.liveDragging == false) && (this.value != this.pendingValue)){
				this.setValue(this.pendingValue);
				this.dispatchEventWith(Event.CHANGE);
			}
		}
		
		/**
		 * @method egret.gui.SliderBase#track_mouseDownHandler
		 * @param event {TouchEvent} 
		 */
		public track_mouseDownHandler(event:TouchEvent):void{
			if (!this.enabled)
				return;
			var thumbW:number = (this.thumb) ? this.thumb.width : 0;
			var thumbH:number = (this.thumb) ? this.thumb.height : 0;
			var offsetX:number = event.stageX - (thumbW / 2);
			var offsetY:number = event.stageY - (thumbH / 2);
			var p:Point = this.track.globalToLocal(offsetX, offsetY,egret.$TempPoint);
			
			var newValue:number = this.pointToValue(p.x, p.y);
			newValue = this.nearestValidValue(newValue, this.snapInterval);

			if (newValue != this.pendingValue){
				if (this.slideDuration != 0){
					if (!this.animator){
						this.animator = new Animation(this._animationUpdateHandler,this);
						this.animator.endFunction = this.animationEndHandler;
					}
					if (this.animator.isPlaying)
						this.stopAnimation();
					this.slideToValue = newValue;
					this.animator.duration = this.slideDuration *
						(Math.abs(this.pendingValue - this.slideToValue) / (this.maximum - this.minimum));
					this.animator.motionPaths = [
                        new SimpleMotionPath("value",this.pendingValue,this.slideToValue)
                    ];
					UIEvent.dispatchUIEvent(this,UIEvent.CHANGE_START);
					this.animator.play();
				}
				else{
					this.setValue(newValue);
					this.dispatchEventWith(Event.CHANGE);
				}
			}
		}
		
		/**
		 * 正删除外观部件的实例时调用
		 * @method egret.gui.SliderBase#partAdded
		 * @param partName {string} 
		 * @param instance {any} 
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