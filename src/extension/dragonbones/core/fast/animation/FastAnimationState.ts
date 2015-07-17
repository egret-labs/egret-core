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

	export class FastAnimationState{
//		private static var _pool:Vector.<FastAnimationState> = new Vector.<FastAnimationState>;
//		
//		/** @private */
//		dragonBones_internal static function borrowObject():FastAnimationState
//		{
//			if(_pool.length == 0)
//			{
//				return new FastAnimationState();
//			}
//			return _pool.pop();
//		}
//		
//		/** @private */
//		dragonBones_internal static function returnObject(animationState:FastAnimationState):void
//		{
//			animationState.dispose();
//			
//			if(_pool.indexOf(animationState) < 0)
//			{
//				_pool[_pool.length] = animationState;
//			}
//		}
//		
//		/** @private */
//		dragonBones_internal static function clear():void
//		{
//			var i:int = _pool.length;
//			while(i --)
//			{
//				_pool[i].clear();
//			}
//			_pool.length = 0;
//		}
		
		
		public animationCache:AnimationCache;
		/**
		 * If auto genterate tween between keyframes.
		 */
		public autoTween:boolean;
		public progress:number;
		public _armature:FastArmature;
		
		private _boneTimelineStateList:Array<FastBoneTimelineState> = [];
		private _slotTimelineStateList:Array<FastSlotTimelineState> = [];
		public animationData:AnimationData;
		
		public name:string;
		private _time:number;//秒
		private _currentFrameIndex:number = 0;
		private _currentFramePosition:number = 0;
		private _currentFrameDuration:number = 0;
		
		private _currentPlayTimes:number = 0;
		private _totalTime:number = 0;//毫秒
		private _currentTime:number = 0;
		private _lastTime:number = 0;
		
		private _isComplete:boolean;
		private _isPlaying:boolean;
		private _timeScale:number;
		private _playTimes:number = 0;
		
		private _fading:boolean = false;
		private _listenCompleteEvent:boolean;
		private _listenLoopCompleteEvent:boolean;
		
		public _fadeTotalTime:number;
		
		
		public constructor(){
		}
		
		public dispose():void{
			this.resetTimelineStateList();
			this._armature = null;
		}
		
		public resetTimelineStateList():void{
			var i:number = this._boneTimelineStateList.length;
			while(i --){
				FastBoneTimelineState.returnObject(this._boneTimelineStateList[i]);
			}
			this._boneTimelineStateList.length = 0;
			
			i = this._slotTimelineStateList.length;
			while(i --){
				FastSlotTimelineState.returnObject(this._slotTimelineStateList[i]);
			}
			this._slotTimelineStateList.length = 0;
		}
		
		/** @private */
		public fadeIn(aniData:AnimationData, playTimes:number, timeScale:number, fadeTotalTime:number):void{
			this.animationData = aniData;
			
			this.name = this.animationData.name;
			this._totalTime = this.animationData.duration;
			this.autoTween = aniData.autoTween;
			this.setTimeScale(timeScale);
			this.setPlayTimes(playTimes);
			
			//reset
			this._isComplete = false;
			this._currentFrameIndex = -1;
			this._currentPlayTimes = -1;
			if(Math.round(this._totalTime * this.animationData.frameRate * 0.001) < 2){
				this._currentTime = this._totalTime;
			}
			else{
				this._currentTime = -1;
			}

			this._fadeTotalTime = fadeTotalTime * this._timeScale;
			this._fading = this._fadeTotalTime>0;
			//default
			this._isPlaying = true;
			
			this._listenCompleteEvent = this._armature.hasEventListener(AnimationEvent.COMPLETE);
			
			if(this._armature.enableCache && this.animationCache && this._fading && this._boneTimelineStateList){
				this.updateTransformTimeline(this.progress, false);
			}
			
			this._time = 0;
			this.progress = 0;
			
			this.updateTimelineStateList();
			this.hideBones();
			return;
		}
		
		/**
		 * @private
		 * Update timeline state based on mixing transforms and clip.
		 */
		public updateTimelineStateList():void{	
			this.resetTimelineStateList();
			var timelineName:string;
			var length:number = this.animationData.timelineList.length;
			for(var i:number = 0;i < length;i++){
				var boneTimeline:TransformTimeline = this.animationData.timelineList[i];
				timelineName = boneTimeline.name;
				var bone:FastBone = this._armature.getBone(timelineName);
				if(bone){
					var boneTimelineState:FastBoneTimelineState = FastBoneTimelineState.borrowObject();
					boneTimelineState.fadeIn(bone, this, boneTimeline);
					this._boneTimelineStateList.push(boneTimelineState);
				}
			}
			
			var length1:number = this.animationData.slotTimelineList.length;
			for(var i1:number = 0;i1 < length1;i1++){
				var slotTimeline:SlotTimeline = this.animationData.slotTimelineList[i1];
				timelineName = slotTimeline.name;
				var slot:FastSlot = this._armature.getSlot(timelineName);
				if(slot && slot.displayList.length > 0){
					var slotTimelineState:FastSlotTimelineState = FastSlotTimelineState.borrowObject();
					slotTimelineState.fadeIn(slot, this, slotTimeline);
					this._slotTimelineStateList.push(slotTimelineState);
				}
			}
		}
		
		/** @private */
		public advanceTime(passedTime:number, loop:boolean):void{
			passedTime *= this._timeScale;
			if(this._fading){
				//计算progress
				this._time += passedTime;
				this.progress = this._time / this._fadeTotalTime;
				if(this.progress >= 1){
					this.progress = 0;
					this._time = 0;
					this._fading = false;
				}
			}
			
			if(this._fading){
				//update boneTimelie
				var length:number = this._boneTimelineStateList.length;
				for(var i:number = 0;i < length;i++){
					var timeline:FastBoneTimelineState = this._boneTimelineStateList[i];
					timeline.updateFade(this.progress);
				}
				//update slotTimelie
				var length1:number = this._slotTimelineStateList.length;
				for(var i1:number = 0;i1 < length1;i1++){
					var slotTimeline:FastSlotTimelineState = this._slotTimelineStateList[i1];
					slotTimeline.updateFade(this.progress);
				}
			}
			else{
				this.advanceTimelinesTime(passedTime, loop);
			}
		}
		
		private advanceTimelinesTime(passedTime:number, loop:boolean):void{
			this._time += passedTime;
			
			//计算是否已经播放完成isThisComplete

			var loopCompleteFlg:boolean = false;
			var isThisComplete:boolean = false;
			var currentPlayTimes:number = 0;
			var currentTime:number = this._time * 1000;
			if( this._playTimes == 0 || //无限循环
				currentTime < this._playTimes * this._totalTime) //没有播放完毕
			{
				isThisComplete = false;
				
				this.progress = currentTime / this._totalTime;
				currentPlayTimes = Math.ceil(this.progress) || 1;
				this.progress -= Math.floor(this.progress);
				currentTime %= this._totalTime;
			}
			else{
				currentPlayTimes = this._playTimes;
				currentTime = this._totalTime;
				isThisComplete = true;
				this.progress = 1;
			}
			
			this._isComplete = isThisComplete;

			if(this.isUseCache()){
				this.animationCache.update(this.progress);
			}
			else{
				this.updateTransformTimeline(this.progress, loop);
			}
			
			//update main timeline
			if(this._currentTime != currentTime){
				if(this._currentPlayTimes != currentPlayTimes)    //check loop complete
				{
					if(this._currentPlayTimes > 0 && currentPlayTimes > 1){
						loopCompleteFlg = true;
					}
					this._currentPlayTimes = currentPlayTimes;
				}
				
				this._lastTime = this._currentTime;
				this._currentTime = currentTime;
				this.updateMainTimeline(isThisComplete);
			}
			
			//抛事件
			var event:AnimationEvent;
			if(this._listenCompleteEvent && this._isComplete){
				event = new AnimationEvent(AnimationEvent.COMPLETE);
				event.animationState = this;
				this._armature._eventList.push(event);
			}
			else if(this._listenLoopCompleteEvent && loopCompleteFlg){
				event = new AnimationEvent(AnimationEvent.LOOP_COMPLETE);
				event.animationState = this;
				this._armature._eventList.push(event);
			}
		}
		
		private updateTransformTimeline(progress:number, loop:boolean):void{
			var i:number = this._boneTimelineStateList.length;
			var boneTimeline:FastBoneTimelineState;
			var slotTimeline:FastSlotTimelineState;
			
			if(this._isComplete) // 性能优化
			{
				//update boneTimelie
				while(i--){
					boneTimeline = this._boneTimelineStateList[i];
					boneTimeline.update(progress, loop);
					this._isComplete = boneTimeline._isComplete && this._isComplete;
					
				}
				
				i = this._slotTimelineStateList.length;
				
				//update slotTimelie
				while(i--){
					slotTimeline = this._slotTimelineStateList[i];
					slotTimeline.update(progress, loop);
					this._isComplete = slotTimeline._isComplete && this._isComplete;

				}
			}
			else{
				//update boneTimelie
				while(i--){
					boneTimeline = this._boneTimelineStateList[i];
					boneTimeline.update(progress, loop);
				}
				
				i = this._slotTimelineStateList.length;
				
				//update slotTimelie
				while(i--){
					slotTimeline = this._slotTimelineStateList[i];
					slotTimeline.update(progress, loop);
				}
			}
		}
		
		private updateMainTimeline(isThisComplete:boolean):void{
			var frameList:Array<Frame> = this.animationData.frameList;
			if(frameList.length > 0){
				var prevFrame:Frame;
				var currentFrame:Frame;
				for (var i:number = 0, l:number = this.animationData.frameList.length; i < l; ++i){
					if(this._currentFrameIndex < 0){
						this._currentFrameIndex = 0;
					}
					else if(this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration || this._currentTime < this._lastTime){
						this._lastTime = this._currentTime;
						this._currentFrameIndex ++;
						if(this._currentFrameIndex >= frameList.length){
							if(isThisComplete){
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
					currentFrame = frameList[this._currentFrameIndex];
					
					if(prevFrame){
						this._armature.arriveAtFrame(prevFrame, this);
					}
					
					this._currentFrameDuration = currentFrame.duration;
					this._currentFramePosition = currentFrame.position;
					prevFrame = currentFrame;
				}
				
				if(currentFrame){
					this._armature.arriveAtFrame(currentFrame, this);
				}
			}
		}
		
		private setTimeScale(value:number):void{
			if(isNaN(value) || value == Infinity){
				value = 1;
			}
			this._timeScale = value;
			return;
		}
		
		private setPlayTimes(value:number = 0):void{
			//如果动画只有一帧  播放一次就可以
			if(Math.round(this._totalTime * 0.001 * this.animationData.frameRate) < 2){
				this._playTimes = value < 0?-1:1;
			}
			else{
				this._playTimes = value < 0?-value:value;
			}
			return;
		}
		
		/**
		 * playTimes Play times(0:loop forever, 1~+∞:play times, -1~-∞:will fade animation after play complete).
		 */
		public get playTimes():number{
			return this._playTimes;
		}
		
		/**
		 * Current animation played times
		 */
		public get currentPlayTimes():number{
			return this._currentPlayTimes < 0 ? 0 : this._currentPlayTimes;
		}
		
		/**
		 * Is animation complete.
		 */
		public get isComplete():boolean{
			return this._isComplete; 
		}
		
		/**
		 * Is animation playing.
		 */
		public get isPlaying():boolean{
			return (this._isPlaying && !this._isComplete);
		}
		
		/**
		 * The length of the animation clip in seconds.
		 */
		public get totalTime():number{
			return this._totalTime * 0.001;
		}
		
		/**
		 * The current time of the animation.
		 */
		public get currentTime():number{
			return this._currentTime < 0 ? 0 : this._currentTime * 0.001;
		}
		
		
		public isUseCache():boolean{
			return this._armature.enableCache && this.animationCache && !this._fading;
		}
		
		private hideBones():void{
			var length:number = this.animationData.hideTimelineNameMap.length;
			for(var i:number = 0;i < length;i++){
				var timelineName:string = this.animationData.hideTimelineNameMap[i];
				
				var slot:FastSlot = this._armature.getSlot(timelineName);
				if(slot){
					slot.hideSlots();
				}
			}
		}
	}
}