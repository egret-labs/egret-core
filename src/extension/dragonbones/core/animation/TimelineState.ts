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
     * @class dragonBones.TimelineState
     * @classdesc
     * TimelineState 负责计算 Bone 的时间轴动画。
     * TimelineState 实例隶属于 AnimationState. AnimationState在创建时会为每个包含动作的 Bone生成一个 TimelineState 实例.
     * @see dragonBones.Animation
     * @see dragonBones.AnimationState
     * @see dragonBones.Bone
     */
	export class TimelineState{
		private static HALF_PI:number = Math.PI * 0.5;
		private static DOUBLE_PI:number = Math.PI * 2;
		
		private static _pool:Array<TimelineState> =[];
		
		/** @private */
		public static _borrowObject():TimelineState{
			if(TimelineState._pool.length == 0){
				return new TimelineState();
			}
			return TimelineState._pool.pop();
		}
		
		/** @private */
		public static _returnObject(timeline:TimelineState):void{
			if(TimelineState._pool.indexOf(timeline) < 0){
				TimelineState._pool[TimelineState._pool.length] = timeline;
			}
			
			timeline.clear();
		}
		
		/** @private */
		public static _clear():void{
			var i:number = TimelineState._pool.length;
			while(i --){
				TimelineState._pool[i].clear();
			}
			TimelineState._pool.length = 0;
		}
		
		public name:string;
		
		/** @private */
		public _weight:number;
		
		/** @private */
		public _transform:DBTransform;
		
		/** @private */
		public _pivot:Point;
		
		/** @private */
		public _isComplete:boolean;
		
		/** @private */
		public _animationState:AnimationState;
		
		private _totalTime:number = 0; //duration
		
		private _currentTime:number = 0;
        private _lastTime: number = 0;
		private _currentFrameIndex:number = 0;
		private _currentFramePosition:number = 0;
		private _currentFrameDuration:number = 0;
		
		private _tweenEasing:number;
		private _tweenTransform:boolean;
		private _tweenScale:boolean;
		private _tweenColor:boolean;
		private _tweenCurve:CurveData;
		
		private _rawAnimationScale:number;
		
		//-1: frameLength>1, 0:frameLength==0, 1:frameLength==1
		private _updateMode:number = 0;
		
		private _armature:Armature;
		private _animation:Animation;
		private _bone:Bone;
		
		private _timelineData:TransformTimeline;
		private _originTransform:DBTransform;
		private _originPivot:Point;
		
		private _durationTransform:DBTransform;
		private _durationPivot:Point;
		private _durationColor:ColorTransform;
		
		
		public constructor(){
			this._transform = new DBTransform();
			this._pivot = new Point();
			
			this._durationTransform = new DBTransform();
			this._durationPivot = new Point();
			this._durationColor = new ColorTransform();
		}
		
		private clear():void{
			if(this._bone){
				this._bone._removeState(this);
				this._bone = null;
			}
			this._armature = null;
			this._animation = null;
			this._animationState = null;
			this._timelineData = null;
			this._originTransform = null;
			this._originPivot = null;
		}
		
	//动画开始结束
		/** @private */
		public _fadeIn(bone:Bone, animationState:AnimationState, timelineData:TransformTimeline):void{
			this._bone = bone;
			this._armature = this._bone.armature;
			this._animation = this._armature.animation;
			this._animationState = animationState;
			this._timelineData = timelineData;
			this._originTransform = this._timelineData.originTransform;
			this._originPivot = this._timelineData.originPivot;
			
			this.name = timelineData.name;
			
			this._totalTime = this._timelineData.duration;
			this._rawAnimationScale = this._animationState.clip.scale;
			
			this._isComplete = false;
			this._tweenTransform = false;
			this._tweenScale = false;
			this._currentFrameIndex = -1;
			this._currentTime = -1;
			this._tweenEasing = NaN;
			this._weight = 1;
			
			this._transform.x = 0;
			this._transform.y = 0;
			this._transform.scaleX = 1;
			this._transform.scaleY = 1;
			this._transform.skewX = 0;
			this._transform.skewY = 0;
			this._pivot.x = 0;
			this._pivot.y = 0;
			
			this._durationTransform.x = 0;
			this._durationTransform.y = 0;
			this._durationTransform.scaleX = 1;
			this._durationTransform.scaleY = 1;
			this._durationTransform.skewX = 0;
			this._durationTransform.skewY = 0;
			this._durationPivot.x = 0;
			this._durationPivot.y = 0;
			
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
			
			this._bone._addState(this);
		}
		
		/** @private */
		public _fadeOut():void{
			this._transform.skewX = TransformUtil.formatRadian(this._transform.skewX);
			this._transform.skewY = TransformUtil.formatRadian(this._transform.skewY);
		}
		
	//动画进行中
		
		/** @private */
		public _update(progress:number):void{
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
                if(currentTime>=0)
                {
                    currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                }
                else
                {
                    currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                }

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
				else
                {
                    if(currentTime>=0)
                    {
                        currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                    }
                    else
                    {
                        currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                    }
				}
			}
			
			if(this._currentTime != currentTime){
				this._lastTime = this._currentTime;
                this._currentTime = currentTime;
				
				var frameList:Array<Frame> = this._timelineData.frameList;
				var prevFrame:TransformFrame;
				var currentFrame:TransformFrame;
				
				for (var i:number = 0, l:number = this._timelineData.frameList.length; i < l; ++i){
					if(this._currentFrameIndex < 0){
						this._currentFrameIndex = 0;
					}
					else if(this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration || this._currentTime < this._lastTime){
						this._currentFrameIndex ++;
                        this._lastTime = this._currentTime;
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
					currentFrame = <TransformFrame><any> (frameList[this._currentFrameIndex]);
					
					if(prevFrame){
						this._bone._arriveAtFrame(prevFrame, this, this._animationState, true);
					}
					
					this._currentFrameDuration = currentFrame.duration;
					this._currentFramePosition = currentFrame.position;
					prevFrame = currentFrame;
				}
				
				if(currentFrame){
					this._bone._arriveAtFrame(currentFrame, this, this._animationState, false);
					this.updateToNextFrame(currentPlayTimes);
				}
				this.updateTween();
			}
		}
		
		private updateToNextFrame(currentPlayTimes:number = 0):void{
			var nextFrameIndex:number = this._currentFrameIndex + 1;
			if(nextFrameIndex >= this._timelineData.frameList.length){
				nextFrameIndex = 0;
			}
			var currentFrame:TransformFrame = <TransformFrame><any> (this._timelineData.frameList[this._currentFrameIndex]);
			var nextFrame:TransformFrame = <TransformFrame><any> (this._timelineData.frameList[nextFrameIndex]);
			var tweenEnabled:boolean = false;
			if(
				nextFrameIndex == 0 &&
				(
					!this._animationState.lastFrameAutoTween ||
					(
						this._animationState.playTimes &&
						this._animationState.currentPlayTimes >= this._animationState.playTimes && 
						((this._currentFramePosition + this._currentFrameDuration) / this._totalTime + currentPlayTimes - this._timelineData.offset) * this._timelineData.scale > 0.999999
					)
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
				this._tweenEasing = this._animationState.clip.tweenEasing;
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
				if((isNaN(this._tweenEasing) || this._tweenEasing == 10) && this._tweenCurve == null)  //frame no tween
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
				//transform
				this._durationTransform.x = nextFrame.transform.x - currentFrame.transform.x;
				this._durationTransform.y = nextFrame.transform.y - currentFrame.transform.y;
				this._durationTransform.skewX = nextFrame.transform.skewX - currentFrame.transform.skewX;
				this._durationTransform.skewY = nextFrame.transform.skewY - currentFrame.transform.skewY;
				
				this._durationTransform.scaleX = nextFrame.transform.scaleX - currentFrame.transform.scaleX + nextFrame.scaleOffset.x;
				this._durationTransform.scaleY = nextFrame.transform.scaleY - currentFrame.transform.scaleY + nextFrame.scaleOffset.y;
				
				this._durationTransform.normalizeRotation();
				if(nextFrameIndex == 0){
					this._durationTransform.skewX = TransformUtil.formatRadian(this._durationTransform.skewX);
					this._durationTransform.skewY = TransformUtil.formatRadian(this._durationTransform.skewY);
				}
				
				this._durationPivot.x = nextFrame.pivot.x - currentFrame.pivot.x;
				this._durationPivot.y = nextFrame.pivot.y - currentFrame.pivot.y;
				
				if(
					this._durationTransform.x ||
					this._durationTransform.y ||
					this._durationTransform.skewX ||
					this._durationTransform.skewY ||
					this._durationTransform.scaleX ||
					this._durationTransform.scaleY ||
					this._durationPivot.x ||
					this._durationPivot.y
				){
					this._tweenTransform = true;
					this._tweenScale = currentFrame.tweenScale;
				}
				else{
					this._tweenTransform = false;
					this._tweenScale = false;
				}
			}
			else{
				this._tweenTransform = false;
				this._tweenScale = false;
			}
			
			if(!this._tweenTransform){
				if(this._animationState.additiveBlending){
					this._transform.x = currentFrame.transform.x;
					this._transform.y = currentFrame.transform.y;
					this._transform.skewX = currentFrame.transform.skewX;
					this._transform.skewY = currentFrame.transform.skewY;
					this._transform.scaleX = currentFrame.transform.scaleX;
					this._transform.scaleY = currentFrame.transform.scaleY;
					
					this._pivot.x = currentFrame.pivot.x;
					this._pivot.y = currentFrame.pivot.y;
				}
				else{
					this._transform.x = this._originTransform.x + currentFrame.transform.x;
					this._transform.y = this._originTransform.y + currentFrame.transform.y;
					this._transform.skewX = this._originTransform.skewX + currentFrame.transform.skewX;
					this._transform.skewY = this._originTransform.skewY + currentFrame.transform.skewY;
					this._transform.scaleX = this._originTransform.scaleX * currentFrame.transform.scaleX;
					this._transform.scaleY = this._originTransform.scaleY * currentFrame.transform.scaleY;
					
					this._pivot.x = this._originPivot.x + currentFrame.pivot.x;
					this._pivot.y = this._originPivot.y + currentFrame.pivot.y;
				}
				
				this._bone.invalidUpdate();
			}
			else if(!this._tweenScale){
				if(this._animationState.additiveBlending){
					this._transform.scaleX = currentFrame.transform.scaleX;
					this._transform.scaleY = currentFrame.transform.scaleY;
				}
				else{
					this._transform.scaleX = this._originTransform.scaleX * currentFrame.transform.scaleX;
					this._transform.scaleY = this._originTransform.scaleY * currentFrame.transform.scaleY;
				}
			}
		}
		
		private updateTween():void{
			
			var currentFrame:TransformFrame = <TransformFrame><any> (this._timelineData.frameList[this._currentFrameIndex]);
			if(this._tweenTransform){

				var progress:number = (this._currentTime - this._currentFramePosition) / this._currentFrameDuration;
				if(this._tweenCurve != null)
				{
					progress = this._tweenCurve.getValueByProgress(progress);
				}
				else if(this._tweenEasing){
					progress = MathUtil.getEaseValue(progress, this._tweenEasing);
				}
				var currentTransform:DBTransform = currentFrame.transform;
				var currentPivot:Point = currentFrame.pivot;
				if(this._animationState.additiveBlending){
					//additive blending
					this._transform.x = currentTransform.x + this._durationTransform.x * progress;
					this._transform.y = currentTransform.y + this._durationTransform.y * progress;
					this._transform.skewX = currentTransform.skewX + this._durationTransform.skewX * progress;
					this._transform.skewY = currentTransform.skewY + this._durationTransform.skewY * progress;
					if(this._tweenScale){
						this._transform.scaleX = currentTransform.scaleX + this._durationTransform.scaleX * progress;
						this._transform.scaleY = currentTransform.scaleY + this._durationTransform.scaleY * progress;
					}
					
					this._pivot.x = currentPivot.x + this._durationPivot.x * progress;
					this._pivot.y = currentPivot.y + this._durationPivot.y * progress;
				}
				else{
					//normal blending
					this._transform.x = this._originTransform.x + currentTransform.x + this._durationTransform.x * progress;
					this._transform.y = this._originTransform.y + currentTransform.y + this._durationTransform.y * progress;
					this._transform.skewX = this._originTransform.skewX + currentTransform.skewX + this._durationTransform.skewX * progress;
					this._transform.skewY = this._originTransform.skewY + currentTransform.skewY + this._durationTransform.skewY * progress;
					if(this._tweenScale){
						this._transform.scaleX = this._originTransform.scaleX * currentTransform.scaleX + this._durationTransform.scaleX * progress;
						this._transform.scaleY = this._originTransform.scaleY * currentTransform.scaleY + this._durationTransform.scaleY * progress;
					}
					
					this._pivot.x = this._originPivot.x + currentPivot.x + this._durationPivot.x * progress;
					this._pivot.y = this._originPivot.y + currentPivot.y + this._durationPivot.y * progress;
				}
				
				this._bone.invalidUpdate();
			}
		}
		
		private updateSingleFrame():void{
			var currentFrame:TransformFrame = <TransformFrame><any> (this._timelineData.frameList[0]);
			this._bone._arriveAtFrame(currentFrame, this, this._animationState, false);
			this._isComplete = true;
			this._tweenEasing = NaN;
			this._tweenTransform = false;
			this._tweenScale = false;
			this._tweenColor = false;
			
            /**
             * <使用绝对数据>
             * 单帧的timeline，第一个关键帧的transform为0
             * timeline.originTransform = firstFrame.transform;
             * eachFrame.transform = eachFrame.transform - timeline.originTransform;
             * firstFrame.transform == 0;
             *
             * <使用相对数据>
             * 使用相对数据时，timeline.originTransform = 0，第一个关键帧的transform有可能不为 0
             */
			if(this._animationState.additiveBlending){
                this._transform.x = currentFrame.transform.x;
                this._transform.y = currentFrame.transform.y;
                this._transform.skewX = currentFrame.transform.skewX;
                this._transform.skewY = currentFrame.transform.skewY;
                this._transform.scaleX = currentFrame.transform.scaleX;
                this._transform.scaleY = currentFrame.transform.scaleY;

                this._pivot.x = currentFrame.pivot.x;
                this._pivot.y = currentFrame.pivot.y;
			}
			else{
                this._transform.x = this._originTransform.x + currentFrame.transform.x;
                this._transform.y = this._originTransform.y + currentFrame.transform.y;
                this._transform.skewX = this._originTransform.skewX + currentFrame.transform.skewX;
                this._transform.skewY = this._originTransform.skewY + currentFrame.transform.skewY;
                this._transform.scaleX = this._originTransform.scaleX * currentFrame.transform.scaleX;
                this._transform.scaleY = this._originTransform.scaleY * currentFrame.transform.scaleY;

                this._pivot.x = this._originPivot.x + currentFrame.pivot.x;
                this._pivot.y = this._originPivot.y + currentFrame.pivot.y;
			}
			
			this._bone.invalidUpdate();
		}
	}
}