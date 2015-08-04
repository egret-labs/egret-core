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

module dragonBones {

	/**
	 * @class dragonBones.FastSlotTimelineState
	 * @classdesc
	 * FastSlotTimelineState 负责计算 Slot 的时间轴动画。
	 * FastSlotTimelineState 实例隶属于 FastAnimationState. FastAnimationState在创建时会为每个包含动作的 Slot生成一个 FastSlotTimelineState 实例.
	 * @see dragonBones.FastAnimation
	 * @see dragonBones.FastAnimationState
	 * @see dragonBones.FastSlot
	 */
	export class FastSlotTimelineState{
		private static HALF_PI:number = Math.PI * 0.5;
		private static DOUBLE_PI:number = Math.PI * 2;
		
		private static _pool:Array<FastSlotTimelineState> = [];
		
		/** @private */
		public static borrowObject():FastSlotTimelineState{
			if(FastSlotTimelineState._pool.length == 0){
				return new FastSlotTimelineState();
			}
			return FastSlotTimelineState._pool.pop();
		}
		
		/** @private */
		public static returnObject(timeline:FastSlotTimelineState):void{
			if(FastSlotTimelineState._pool.indexOf(timeline) < 0){
				FastSlotTimelineState._pool[FastSlotTimelineState._pool.length] = timeline;
			}
			
			timeline.clear();
		}
		
		/** @private */
		public static clear():void{
			var i:number = FastSlotTimelineState._pool.length;
			while(i --){
				FastSlotTimelineState._pool[i].clear();
			}
			FastSlotTimelineState._pool.length = 0;
		}
		
		
		
		public name:string;
		
		/** @private */
		public _weight:number;
		
		//TO DO 干什么用的
		/** @private */
		public _blendEnabled:boolean;
		
		/** @private */
		public _isComplete:boolean;
		
		/** @private */
		public _animationState:FastAnimationState;
		
		private _totalTime:number = 0; //duration
		
		private _currentTime:number = 0;
		private _currentFrameIndex:number = 0;
		private _currentFramePosition:number = 0;
		private _currentFrameDuration:number = 0;
		
		private _tweenEasing:number;
		private _tweenCurve:CurveData;
		private _tweenColor:boolean;
		private _colorChanged:boolean;
		
		//-1: frameLength>1, 0:frameLength==0, 1:frameLength==1
		private _updateMode:number = 0;
		
		private _armature:FastArmature;
		private _animation:FastAnimation;
		private _slot:FastSlot;
		
		private _timelineData:SlotTimeline;
		private _durationColor:ColorTransform;
		
		
		
		public constructor(){
			this._durationColor = new ColorTransform();
		}
		
		private clear():void{
			this._slot = null;
			this._armature = null;
			this._animation = null;
			this._animationState = null;
			this._timelineData = null;
		}
		
	//动画开始结束
		/** @private */
		public fadeIn(slot:FastSlot, animationState:FastAnimationState, timelineData:SlotTimeline):void{
			this._slot = slot;
			this._armature = this._slot.armature;
			this._animation = this._armature.animation;
			this._animationState = animationState;
			this._timelineData = timelineData;
			
			this.name = timelineData.name;
			
			this._totalTime = this._timelineData.duration;
			
			this._isComplete = false;
			this._blendEnabled = false;
			this._tweenColor = false;
			this._currentFrameIndex = -1;
			this._currentTime = -1;
			this._tweenEasing = NaN;
			this._weight = 1;
			
			switch(this._timelineData.frameList.length){
				case 0:
					this._updateMode = 0;
					break;
				
				case 1:
					this._updateMode = 1;
					break;
				
				default:
					this._updateMode = -1;
					break;
			}
		}
		
	//动画进行中
		
		/** @private */
		public updateFade(progress:number):void{
		}
		
		/** @private */
		public update(progress:number):void{
			if(this._updateMode == -1){
				this.updateMultipleFrame(progress);
			}
			else if(this._updateMode == 1){
				this._updateMode = 0;
				this.updateSingleFrame();
			}
		}
		
		private updateMultipleFrame(progress:number):void{
			var currentPlayTimes:number = 0;
			progress /= this._timelineData.scale;
			progress += this._timelineData.offset;
			
			var currentTime:number = this._totalTime * progress;
			var playTimes:number = this._animationState.playTimes;
			if(playTimes == 0){
				this._isComplete = false;
				currentPlayTimes = Math.ceil(Math.abs(currentTime) / this._totalTime) || 1;
				currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
				
				if(currentTime < 0){
					currentTime += this._totalTime;
				}
			}
			else{

				var totalTimes:number = playTimes * this._totalTime;
				if(currentTime >= totalTimes){
					currentTime = totalTimes;
					this._isComplete = true;
				}
				else if(currentTime <= -totalTimes){
					currentTime = -totalTimes;
					this._isComplete = true;
				}
				else{
					this._isComplete = false;
				}
				
				if(currentTime < 0){
					currentTime += totalTimes;
				}
				
				currentPlayTimes = Math.ceil(currentTime / this._totalTime) || 1;
				if(this._isComplete){
					currentTime = this._totalTime;
				}
				else{
					currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
				}
			}
			
			if(this._currentTime != currentTime){
				this._currentTime = currentTime;
				
				var frameList:Array<Frame> = this._timelineData.frameList;
				var prevFrame:SlotFrame;
				var currentFrame:SlotFrame;
				
				for (var i:number = 0, l:number = this._timelineData.frameList.length; i < l; ++i){
					if(this._currentFrameIndex < 0){
						this._currentFrameIndex = 0;
					}
					else if(this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration){
						this._currentFrameIndex ++;
						if(this._currentFrameIndex >= frameList.length){
							if(this._isComplete){
								this._currentFrameIndex --;
								break;
							}
							else{
								this._currentFrameIndex = 0;
							}
						}
					}
					else{
						break;
					}
					currentFrame = <SlotFrame><any> (frameList[this._currentFrameIndex]);
					
					if(prevFrame){
						this._slot._arriveAtFrame(prevFrame, this._animationState);
					}
					
					this._currentFrameDuration = currentFrame.duration;
					this._currentFramePosition = currentFrame.position;
					prevFrame = currentFrame;
				}
				
				if(currentFrame){
					this._slot._arriveAtFrame(currentFrame, this._animationState);
					
					this._blendEnabled = currentFrame.displayIndex >= 0;
					if(this._blendEnabled){
						this.updateToNextFrame(currentPlayTimes);
					}
					else{
						this._tweenEasing = NaN;
						this._tweenColor = false;
					}
				}
				
				if(this._blendEnabled){
					this.updateTween();
				}
			}
		}

		private updateToNextFrame(currentPlayTimes:number = 0):void{
			var nextFrameIndex:number = this._currentFrameIndex + 1;
			if(nextFrameIndex >= this._timelineData.frameList.length){
				nextFrameIndex = 0;
			}
			var currentFrame:SlotFrame = <SlotFrame><any> (this._timelineData.frameList[this._currentFrameIndex]);
			var nextFrame:SlotFrame = <SlotFrame><any> (this._timelineData.frameList[nextFrameIndex]);
			var tweenEnabled:boolean = false;
			if( nextFrameIndex == 0 &&
				(
					this._animationState.playTimes &&
					this._animationState.currentPlayTimes >= this._animationState.playTimes && 
					((this._currentFramePosition + this._currentFrameDuration) / this._totalTime + currentPlayTimes - this._timelineData.offset) * this._timelineData.scale > 0.999999
				)
			){
				this._tweenEasing = NaN;
				tweenEnabled = false;
			}
			else if(currentFrame.displayIndex < 0 || nextFrame.displayIndex < 0){
				this._tweenEasing = NaN;
				tweenEnabled = false;
			}
			else if(this._animationState.autoTween){
				this._tweenEasing = this._animationState.animationData.tweenEasing;
				if(isNaN(this._tweenEasing)){
					this._tweenEasing = currentFrame.tweenEasing;
					this._tweenCurve = currentFrame.curve;
					if(isNaN(this._tweenEasing) && this._tweenCurve == null)    //frame no tween
					{
						tweenEnabled = false;
					}
					else{
						if(this._tweenEasing == 10){
							this._tweenEasing = 0;
						}
						//_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
						tweenEnabled = true;
					}
				}
				else    //animationData overwrite tween
				{
					//_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
					tweenEnabled = true;
				}
			}
			else{
				this._tweenEasing = currentFrame.tweenEasing;
				this._tweenCurve = currentFrame.curve;
				if((isNaN(this._tweenEasing) || this._tweenEasing == 10) && this._tweenCurve == null)   //frame no tween
				{
					this._tweenEasing = NaN;
					tweenEnabled = false;
				}
				else{
					//_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
					tweenEnabled = true;
				}
			}
			
			if(tweenEnabled){
				if(currentFrame.color || nextFrame.color){
					ColorTransformUtil.minus(nextFrame.color || ColorTransformUtil.originalColor, currentFrame.color ||ColorTransformUtil.originalColor, this._durationColor);
					this._tweenColor = 	this._durationColor.alphaOffset != 0 ||
									this._durationColor.redOffset != 0 ||
									this._durationColor.greenOffset != 0 ||
									this._durationColor.blueOffset != 0 ||
									this._durationColor.alphaMultiplier != 0 ||
									this._durationColor.redMultiplier != 0 ||
									this._durationColor.greenMultiplier != 0 ||
									this._durationColor.blueMultiplier != 0;
				}
				else{
					this._tweenColor = false;
				}
			}
			else{
				this._tweenColor = false;
			}
			
			if(!this._tweenColor){
				var targetColor:ColorTransform;
				var colorChanged:boolean;
				
				if(currentFrame.color){
					targetColor = currentFrame.color;
					colorChanged = true;
				}
				else{
					targetColor = ColorTransformUtil.originalColor;
					colorChanged = false;
				}
				if ((this._slot._isColorChanged || colorChanged)){
					if(	!ColorTransformUtil.isEqual(this._slot._colorTransform, targetColor)){
						this._slot._updateDisplayColor(
							targetColor.alphaOffset, 
							targetColor.redOffset, 
							targetColor.greenOffset, 
							targetColor.blueOffset, 
							targetColor.alphaMultiplier, 
							targetColor.redMultiplier, 
							targetColor.greenMultiplier, 
							targetColor.blueMultiplier,
							colorChanged
						);
					}
				}
			}
		}
		
		private updateTween():void{
			var currentFrame:SlotFrame = <SlotFrame><any> (this._timelineData.frameList[this._currentFrameIndex]);
			
			if(this._tweenColor){
				var progress:number = (this._currentTime - this._currentFramePosition) / this._currentFrameDuration;
				if (this._tweenCurve != null){
					progress = this._tweenCurve.getValueByProgress(progress);
				}
				else if(this._tweenEasing){
					progress = MathUtil.getEaseValue(progress, this._tweenEasing);
				}
				if(currentFrame.color){
					this._slot._updateDisplayColor(
						currentFrame.color.alphaOffset 		+ this._durationColor.alphaOffset 		* progress,
						currentFrame.color.redOffset 		+ this._durationColor.redOffset 			* progress,
						currentFrame.color.greenOffset 		+ this._durationColor.greenOffset 		* progress,
						currentFrame.color.blueOffset 		+ this._durationColor.blueOffset 		* progress,
						currentFrame.color.alphaMultiplier 	+ this._durationColor.alphaMultiplier 	* progress,
						currentFrame.color.redMultiplier 	+ this._durationColor.redMultiplier 		* progress,
						currentFrame.color.greenMultiplier 	+ this._durationColor.greenMultiplier 	* progress,
						currentFrame.color.blueMultiplier	+ this._durationColor.blueMultiplier 	* progress,
						true
					);
				}
				else{
					this._slot._updateDisplayColor(
						this._durationColor.alphaOffset 		* progress,
						this._durationColor.redOffset 		* progress,
						this._durationColor.greenOffset 		* progress,
						this._durationColor.blueOffset 		* progress,
						this._durationColor.alphaMultiplier 	* progress + 1,
						this._durationColor.redMultiplier 	* progress + 1,
						this._durationColor.greenMultiplier 	* progress + 1,
						this._durationColor.blueMultiplier 	* progress + 1,
						true
					);
				}
			}
		}
		
		private updateSingleFrame():void{
			var currentFrame:SlotFrame = <SlotFrame><any> (this._timelineData.frameList[0]);
			this._slot._arriveAtFrame(currentFrame, this._animationState);
			this._isComplete = true;
			this._tweenEasing = NaN;
			this._tweenColor = false;
			
			this._blendEnabled = currentFrame.displayIndex >= 0;
			if(this._blendEnabled){
				var targetColor:ColorTransform;
				var colorChanged:boolean;
				if(currentFrame.color){
					targetColor = currentFrame.color;
					colorChanged = true;
				}
				else{
					targetColor = ColorTransformUtil.originalColor;
					colorChanged = false;
				}
				if ((this._slot._isColorChanged || colorChanged)){
					if(	!ColorTransformUtil.isEqual(this._slot._colorTransform, targetColor)){
						this._slot._updateDisplayColor(
							targetColor.alphaOffset, 
							targetColor.redOffset, 
							targetColor.greenOffset, 
							targetColor.blueOffset, 
							targetColor.alphaMultiplier, 
							targetColor.redMultiplier, 
							targetColor.greenMultiplier, 
							targetColor.blueMultiplier,
							colorChanged
						);
					}
				}
			}
		}
		
	}
}