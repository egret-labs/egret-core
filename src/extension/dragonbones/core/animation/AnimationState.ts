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


module dragonBones {

    /**
     * @class dragonBones.AnimationState
     * @classdesc
     * AnimationState 实例由 Animation 实例播放动画时产生， 用于控制单个动画的播放。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     */
	export class AnimationState{
		private static _pool:Array<AnimationState> =[];
		
		/** @private */
		public static _borrowObject():AnimationState{
			if(AnimationState._pool.length == 0){
				return new AnimationState();
			}
			return AnimationState._pool.pop();
		}
		
		/** @private */
		public static _returnObject(animationState:AnimationState):void{
			animationState.clear();
			
			if(AnimationState._pool.indexOf(animationState) < 0){
				AnimationState._pool[AnimationState._pool.length] = animationState;
			}
		}
		
		/** @private */
		public static _clear():void{
			var i:number = AnimationState._pool.length;
			while(i --){
				AnimationState._pool[i].clear();
			}
			AnimationState._pool.length = 0;
			
			TimelineState._clear();
		}

        /**
		 * 标记是否控制display的切换。
		 * 设置为 true时，该 AnimationState 会控制display的切换
		 * 默认值：true。
		 * @member {boolean} dragonBones.AnimationState#displayControl
		 * @see dragonBones.Bone#displayController
		 * @see dragonBones.Bone#display
		 */
		public displayControl:boolean;

		public additiveBlending:boolean;

        /**
		 * 标记动画播放完毕时是否自动淡出。
		 * 默认值：true。
		 * @member {boolean} dragonBones.AnimationState#autoFadeOut
		 */
		public autoFadeOut:boolean;

        /**
		 * 淡出时间。
		 * @member {number} dragonBones.AnimationState#fadeOutTime
		 */
		public fadeOutTime:number;

        /**
		 * 动画权重(0~1)。
		 * 默认值：1。
		 * @member {number} dragonBones.AnimationState#weight
		 */
		public weight:number;

        /**
		 * 是否自动补间。
		 * @member {boolean} dragonBones.AnimationState#autoTween
		 */
		public autoTween:boolean;

        /**
		 * 动画循环播放时，从最后一帧到第一帧是否自动补间。
		 * 默认值：true
		 * @member {boolean} dragonBones.AnimationState#lastFrameAutoTween
		 */
		public lastFrameAutoTween:boolean;
		
		/** @private */
		public _layer:number = 0;
		/** @private */
		public _group:string;
		
		private _armature:Armature;
		private _timelineStateList:Array<TimelineState>;
		private _boneMasks:Array<string>;
		
		private _isPlaying:boolean;
		private _time:number;
		private _currentFrameIndex:number = 0;
		private _currentFramePosition:number = 0;
		private _currentFrameDuration:number = 0;
		
		//Fadein 的时候是否先暂停
		private _pausePlayheadInFade:boolean;
		private _isFadeOut:boolean;
		//最终的真实权重值
		private _fadeTotalWeight:number;
		//受fade影响的动作权重系数，在fadein阶段他的值会由0变为1，在fadeout阶段会由1变为0
		private _fadeWeight:number;
		private _fadeCurrentTime:number;
		private _fadeBeginTime:number;
		
		private _name:string;
		private _clip:AnimationData;
		private _isComplete:boolean;
		private _currentPlayTimes:number = 0;
		private _totalTime:number = 0;
		private _currentTime:number = 0;
		//-1 beforeFade, 0 fading, 1 fadeComplete
		private _fadeState:number = 0;
		private _fadeTotalTime:number;
		
		//时间缩放参数， 各帧duration数据不变的情况下，让传入时间*timeScale 实现durationScale
		private _timeScale:number;
		private _playTimes:number = 0;
		
		public constructor(){ 
			this._timelineStateList =[];
			this._boneMasks = [];
		}
		
		private clear():void{
			var i:number = this._timelineStateList.length;
			while(i --){
				TimelineState._returnObject(this._timelineStateList[i]);
			}
			this._timelineStateList.length = 0;
			this._boneMasks.length = 0;
			
			this._armature = null;
			this._clip = null;
		}
		
//骨架装配

        /**
		 * 检查指定名称的骨头是否在遮罩中。只有在遮罩中的骨头动画才会被播放
		 * @param boneName {string} dragonBones.AnimationState#containsBoneMask
		 * @returns {boolean}
		 */
		public containsBoneMask(boneName:string):boolean{
			return this._boneMasks.length == 0 || this._boneMasks.indexOf(boneName) >= 0;
		}
		
		/**
		 * 将一个骨头加入遮罩。只有加入遮罩的骨头的动画才会被播放，如果没有骨头加入遮罩，则所有骨头的动画都会播放。通过这个API可以实现只播放角色的一部分.
		 * @param boneName {string} 骨头名称.
		 * @param ifInvolveChildBones {boolean} 是否影响子骨头。默认值：true.
		 * @returns {AnimationState} 动画播放状态实例
		 */
		public addBoneMask(boneName:string, ifInvolveChildBones:boolean = true):AnimationState{
			this.addBoneToBoneMask(currentBone.name);
			
			if(ifInvolveChildBones){
				var currentBone:Bone = this._armature.getBone(boneName);
				if(currentBone){
					var boneList:Array<Bone> = this._armature.getBones(false);
					var i:number = boneList.length;
					while(i--){
						var tempBone:Bone = boneList[i];
						if(currentBone.contains(tempBone)){
							this.addBoneToBoneMask(currentBone.name);
						}
					}
				}
			}
			
			this._updateTimelineStates();
			return this;
		}
		
		/**
		 * 将一个指定名称的骨头从遮罩中移除.
		 * @param boneName {string} 骨头名称.
		 * @param ifInvolveChildBones {boolean} 是否影响子骨头。默认值：true.
		 * @returns {AnimationState} 动画播放状态实例
		 */
		public removeBoneMask(boneName:string, ifInvolveChildBones:boolean = true):AnimationState{
			this.removeBoneFromBoneMask(boneName);
			
			if(ifInvolveChildBones){
				var currentBone:Bone = this._armature.getBone(boneName);
				if(currentBone){
					var boneList:Array<Bone> = this._armature.getBones(false);
					var i:number = boneList.length;
					while(i--){
						var tempBone:Bone = boneList[i];
						if(currentBone.contains(tempBone)){
							this.removeBoneFromBoneMask(currentBone.name);
						}
					}
				}
			}
			this._updateTimelineStates();
			
			return this;
		}

        /**
		 * 清空骨头遮罩.
		 * @returns {AnimationState} 动画播放状态实例
		 */
		public removeAllMixingTransform():AnimationState{
			this._boneMasks.length = 0;
			this._updateTimelineStates();
			return this;
		}
		
		private addBoneToBoneMask(boneName:string):void{
			if(this._clip.getTimeline(boneName) && this._boneMasks.indexOf(boneName)<0){
				this._boneMasks.push(boneName);
			}
		}
		
		private removeBoneFromBoneMask(boneName:string):void{
			var index:number = this._boneMasks.indexOf(boneName);
			if(index >= 0){
				this._boneMasks.splice(index, 1);
			}
		}
	
		/**
		 * @private
		 * Update timeline state based on mixing transforms and clip.
		 */
		public _updateTimelineStates():void{
			var timelineState:TimelineState;
			var i:number = this._timelineStateList.length;
			while(i --){
				timelineState = this._timelineStateList[i];
				if(!this._armature.getBone(timelineState.name)){
					this.removeTimelineState(timelineState);
				}
			}
			
			if(this._boneMasks.length > 0){
				i = this._timelineStateList.length;
				while(i --){
					timelineState = this._timelineStateList[i];
					if(this._boneMasks.indexOf(timelineState.name) < 0){
						this.removeTimelineState(timelineState);
					}
				}

                for(var key in this._boneMasks)
                {
                    var timelineName:string = this._boneMasks[key];
                    this.addTimelineState(timelineName);
                }
			}
			else{
                for(var key in this._clip.timelineList)
                {
                    var timeline:TransformTimeline = this._clip.timelineList[key];
                    this.addTimelineState(timeline.name);
                }
			}
		}
		
		private addTimelineState(timelineName:string):void{
			var bone:Bone = this._armature.getBone(timelineName);
			if(bone){
                for(var key in this._timelineStateList)
                {
                    var eachState:TimelineState = this._timelineStateList[key];
                    if(eachState.name == timelineName){
                        return;
                    }
                }
				var timelineState:TimelineState = TimelineState._borrowObject();
				timelineState._fadeIn(bone, this, this._clip.getTimeline(timelineName));
				this._timelineStateList.push(timelineState);
			}
		}
		
		private removeTimelineState(timelineState:TimelineState):void{
			var index:number = this._timelineStateList.indexOf(timelineState);
			this._timelineStateList.splice(index, 1);
			TimelineState._returnObject(timelineState);
		}
		
	//动画
		/**
		 * 播放当前动画。如果动画已经播放完毕, 将不会继续播放.
		 * @returns {AnimationState} 动画播放状态实例
		 */
		public play():AnimationState{
			this._isPlaying = true;
			return this;
		}
		
		/**
		 * 暂停当前动画的播放。
		 * @returns {AnimationState} 动画播放状态实例
		 */
		public stop():AnimationState{
			this._isPlaying = false;
			return this;
		}
		
		/** @private */
		public _fadeIn(armature:Armature, clip:AnimationData, fadeTotalTime:number, timeScale:number, playTimes:number, pausePlayhead:boolean):AnimationState{
			this._armature = armature;
			this._clip = clip;
			this._pausePlayheadInFade = pausePlayhead;
			
			this._name = this._clip.name;
			this._totalTime = this._clip.duration;
			
			this.autoTween = this._clip.autoTween;
			
			this.setTimeScale(timeScale);
			this.setPlayTimes(playTimes);
			
			//reset
			this._isComplete = false;
			this._currentFrameIndex = -1;
			this._currentPlayTimes = -1;
			if(Math.round(this._totalTime * this._clip.frameRate * 0.001) < 2 || timeScale == Infinity){
				this._currentTime = this._totalTime;
			}
			else{
				this._currentTime = -1;
			}
			this._time = 0;
			this._boneMasks.length = 0;
			
			//fade start
			this._isFadeOut = false;
			this._fadeWeight = 0;
			this._fadeTotalWeight = 1;
			this._fadeState = -1;
			this._fadeCurrentTime = 0;
			this._fadeBeginTime = this._fadeCurrentTime;
			this._fadeTotalTime = fadeTotalTime * this._timeScale;
			
			//default
			this._isPlaying = true;
			this.displayControl = true;
			this.lastFrameAutoTween = true;
			this.additiveBlending = false;
			this.weight = 1;
			this.fadeOutTime = fadeTotalTime;
			
			this._updateTimelineStates();
			return this;
		}
		
		/**
		 * 淡出当前动画
		 * @param fadeTotalTime {number} 淡出时间
		 * @param pausePlayhead {boolean} 淡出时动画是否暂停。
		 */
		public fadeOut(fadeTotalTime:number, pausePlayhead:boolean):AnimationState{
			if(!this._armature){
				return null;
			}
			
			if(isNaN(fadeTotalTime) || fadeTotalTime < 0){
				fadeTotalTime = 0;
			}
			this._pausePlayheadInFade = pausePlayhead;
			
			if(this._isFadeOut){
				if(fadeTotalTime > this._fadeTotalTime / this._timeScale - (this._fadeCurrentTime - this._fadeBeginTime)){
					//如果已经在淡出中，新的淡出需要更长的淡出时间，则忽略
					//If the animation is already in fade out, the new fade out will be ignored.
					return this;
				}
			}
			else{
				//第一次淡出
				//The first time to fade out.
                for(var key in this._timelineStateList)
                {
                    var timelineState:TimelineState = this._timelineStateList[key];
                    timelineState._fadeOut();
                }
			}
			
			//fade start
			this._isFadeOut = true;
			this._fadeTotalWeight = this._fadeWeight;
			this._fadeState = -1;
			this._fadeBeginTime = this._fadeCurrentTime;
			this._fadeTotalTime = this._fadeTotalWeight >= 0?fadeTotalTime * this._timeScale:0;
			
			//default
			this.displayControl = false;
			
			return this;
		}
		
		/** @private */
		public _advanceTime(passedTime:number):boolean{
			passedTime *= this._timeScale;
			
			this.advanceFadeTime(passedTime);
			
			if(this._fadeWeight){
				this.advanceTimelinesTime(passedTime);
			}
			
			return this._isFadeOut && this._fadeState == 1;
		}
		
		private advanceFadeTime(passedTime:number):void{
			var fadeStartFlg:boolean = false;
			var fadeCompleteFlg:boolean = false;
			
			if(this._fadeBeginTime >= 0){
				var fadeState:number = this._fadeState;
				this._fadeCurrentTime += passedTime < 0?-passedTime:passedTime;
				if(this._fadeCurrentTime >= this._fadeBeginTime + this._fadeTotalTime){
					//fade完全结束之后触发 
					//TODO 研究明白为什么要下次再触发
					if(
						this._fadeWeight == 1 || 
						this._fadeWeight == 0
					){
						fadeState = 1;
						if (this._pausePlayheadInFade){
							this._pausePlayheadInFade = false;
							this._currentTime = -1;
						}
					}
					
					this._fadeWeight = this._isFadeOut?0:1;
				}
				else if(this._fadeCurrentTime >= this._fadeBeginTime){
					//fading
					fadeState = 0;
					//暂时只支持线性淡入淡出
					//Currently only support Linear fadein and fadeout
					this._fadeWeight = (this._fadeCurrentTime - this._fadeBeginTime) / this._fadeTotalTime * this._fadeTotalWeight;
					if(this._isFadeOut){
						this._fadeWeight = this._fadeTotalWeight - this._fadeWeight;
					}
				}
				else{
					//before fade
					fadeState = -1;
					this._fadeWeight = this._isFadeOut?1:0;
				}
				
				if(this._fadeState != fadeState){
					//_fadeState == -1 && (fadeState == 0 || fadeState == 1)
					if(this._fadeState == -1){
						fadeStartFlg = true;
					}
					
					//(_fadeState == -1 || _fadeState == 0) && fadeState == 1
					if(fadeState == 1){
						fadeCompleteFlg = true;
					}
					this._fadeState = fadeState;
				}
			}
			
			var event:AnimationEvent;
			
			if(fadeStartFlg){
				if(this._isFadeOut){
					if(this._armature.hasEventListener(AnimationEvent.FADE_OUT)){
						event = new AnimationEvent(AnimationEvent.FADE_OUT);
						event.animationState = this;
						this._armature._eventList.push(event);
					}
				}
				else{
					//动画开始，先隐藏不需要的骨头
					this.hideBones();
					
					if(this._armature.hasEventListener(AnimationEvent.FADE_IN)){
						event = new AnimationEvent(AnimationEvent.FADE_IN);
						event.animationState = this;
						this._armature._eventList.push(event);
					}
				}
			}
			
			if(fadeCompleteFlg){
				if(this._isFadeOut){
					if(this._armature.hasEventListener(AnimationEvent.FADE_OUT_COMPLETE)){
						event = new AnimationEvent(AnimationEvent.FADE_OUT_COMPLETE);
						event.animationState = this;
						this._armature._eventList.push(event);
					}
				}
				else{
					if(this._armature.hasEventListener(AnimationEvent.FADE_IN_COMPLETE)){
						event = new AnimationEvent(AnimationEvent.FADE_IN_COMPLETE);
						event.animationState = this;
						this._armature._eventList.push(event);
					}
				}
			}
		}
		
		private advanceTimelinesTime(passedTime:number):void{
			if(this._isPlaying && !this._pausePlayheadInFade){
				this._time += passedTime;
			}
			
			var startFlg:boolean = false;
			var completeFlg:boolean = false;
			var loopCompleteFlg:boolean = false;
			var isThisComplete:boolean = false;
			var currentPlayTimes:number = 0;
			var currentTime:number = this._time * 1000;
			if(this._playTimes == 0){
				isThisComplete = false;
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
				var totalTimes:number = this._playTimes * this._totalTime;
				if(currentTime >= totalTimes){
					currentTime = totalTimes;
					isThisComplete = true;
				}
				else if(currentTime <= -totalTimes){
					currentTime = -totalTimes;
					isThisComplete = true;
				}
				else{
					isThisComplete = false;
				}
				
				if(currentTime < 0){
					currentTime += totalTimes;
				}
				
				currentPlayTimes = Math.ceil(currentTime / this._totalTime) || 1;

                if(currentTime>=0)
                {
                    currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                }
                else
                {
                    currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                }

				if(isThisComplete){
					currentTime = this._totalTime;
				}
			}
			
			//update timeline
			this._isComplete = isThisComplete;
			var progress:number = this._time * 1000 / this._totalTime;

            for(var key in this._timelineStateList) {
                var timeline:TimelineState = this._timelineStateList[key];
                timeline._update(progress);
                this._isComplete = timeline._isComplete && this._isComplete;
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
				
				if(this._currentTime < 0)    //check start
				{
					startFlg = true;
				}
				
				if(this._isComplete)    //check complete
				{
					completeFlg = true;
				}
				
				this._currentTime = currentTime;
				/*
				if(isThisComplete)
				{
				currentTime = _totalTime * 0.999999;
				}
				//[0, _totalTime)
				*/
				this.updateMainTimeline(isThisComplete);
			}
			
			var event:AnimationEvent;
			if(startFlg){
				if(this._armature.hasEventListener(AnimationEvent.START)){
					event = new AnimationEvent(AnimationEvent.START);
					event.animationState = this;
					this._armature._eventList.push(event);
				}
			}
			
			if(completeFlg){
				if(this._armature.hasEventListener(AnimationEvent.COMPLETE)){
					event = new AnimationEvent(AnimationEvent.COMPLETE);
					event.animationState = this;
					this._armature._eventList.push(event);
				}
				if(this.autoFadeOut){
					this.fadeOut(this.fadeOutTime, true);
				}
			}
			else if(loopCompleteFlg){
				if(this._armature.hasEventListener(AnimationEvent.LOOP_COMPLETE)){
					event = new AnimationEvent(AnimationEvent.LOOP_COMPLETE);
					event.animationState = this;
					this._armature._eventList.push(event);
				}
			}
		}
		
		private updateMainTimeline(isThisComplete:boolean):void{
			var frameList:Array<Frame> = this._clip.frameList;
			if(frameList.length > 0){
				var prevFrame:Frame;
				var currentFrame:Frame;
				for (var i:number = 0, l:number = this._clip.frameList.length; i < l; ++i){
					if(this._currentFrameIndex < 0){
						this._currentFrameIndex = 0;
					}
					else if(this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration){
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
						this._armature._arriveAtFrame(prevFrame, null, this, true);
					}
					
					this._currentFrameDuration = currentFrame.duration;
					this._currentFramePosition = currentFrame.position;
					prevFrame = currentFrame;
				}
				
				if(currentFrame){
					this._armature._arriveAtFrame(currentFrame, null, this, false);
				}
			}
		}
		
		private hideBones():void{

            for(var key in this._clip.hideTimelineNameMap)
            {
                var timelineName:string = this._clip.hideTimelineNameMap[key];
                var bone:Bone = this._armature.getBone(timelineName);
                if(bone){
                    bone._hideSlots();
                }
            }
		}
		
	//属性访问
		public setAdditiveBlending(value:boolean):AnimationState{
			this.additiveBlending = value;
			return this;
		}
		
		
		public setAutoFadeOut(value:boolean, fadeOutTime:number = -1):AnimationState{
			this.autoFadeOut = value;
			if(fadeOutTime >= 0){
				this.fadeOutTime = fadeOutTime * this._timeScale;
			}
			return this;
		}
		
		public setWeight(value:number):AnimationState{
			if(isNaN(value) || value < 0){
				value = 1;
			}
			this.weight = value;
			return this;
		}
		
		public setFrameTween(autoTween:boolean, lastFrameAutoTween:boolean):AnimationState{
			this.autoTween = autoTween;
			this.lastFrameAutoTween = lastFrameAutoTween;
			return this;
		}
		
		public setCurrentTime(value:number):AnimationState{
			if(value < 0 || isNaN(value)){
				value = 0;
			}
			this._time = value;
			this._currentTime = this._time * 1000;
			return this;
		}
		
		public setTimeScale(value:number):AnimationState{
			if(isNaN(value) || value == Infinity){
				value = 1;
			}
			this._timeScale = value;
			return this;
		}
		
		public setPlayTimes(value:number = 0):AnimationState{
			//如果动画只有一帧  播放一次就可以
			if(Math.round(this._totalTime * 0.001 * this._clip.frameRate) < 2){
				this._playTimes = value < 0?-1:1;
			}
			else{
				this._playTimes = value < 0?-value:value;
			}
			this.autoFadeOut = value < 0?true:false;
			return this;
		}
		
		/**
		 * 动画的名字
		 * @member {string} dragonBones.AnimationState#name
		 */
		public get name():string{
			return this._name;
		}

        /**
		 * 动画所在的层
		 * @member {number} dragonBones.AnimationState#layer
		 */
		public get layer():number{
			return this._layer;
		}

        /**
		 * 动画所在的组
		 * @member {string} dragonBones.AnimationState#group
		 */
		public get group():string{
			return this._group;
		}

        /**
		 * 动画包含的动画数据
		 * @member {AnimationData} dragonBones.AnimationState#clip
		 */
		public get clip():AnimationData{
			return this._clip;
		}

        /**
		 * 是否播放完成
		 * @member {boolean} dragonBones.AnimationState#isComplete
		 */
		public get isComplete():boolean{
			return this._isComplete; 
		}

        /**
		 * 是否正在播放
		 * @member {boolean} dragonBones.AnimationState#isPlaying
		 */
		public get isPlaying():boolean{
			return (this._isPlaying && !this._isComplete);
		}

        /**
		 * 当前播放次数
		 * @member {number} dragonBones.AnimationState#currentPlayTimes
		 */
		public get currentPlayTimes():number{
			return this._currentPlayTimes < 0 ? 0 : this._currentPlayTimes;
		}

        /**
		 * 动画总时长（单位：秒）
		 * @member {number} dragonBones.AnimationState#totalTime
		 */
		public get totalTime():number{
			return this._totalTime * 0.001;
		}

        /**
		 * 动画当前播放时间（单位：秒）
		 * @member {number} dragonBones.AnimationState#currentTime
		 */
		public get currentTime():number{
			return this._currentTime < 0 ? 0 : this._currentTime * 0.001;
		}

		public get fadeWeight():number{
			return this._fadeWeight;
		}
		
		public get fadeState():number{
			return this._fadeState;
		}
		
		public get fadeTotalTime():number{
			return this._fadeTotalTime;
		}

        /**
		 * 时间缩放系数。用于调节动画播放速度
		 * @member {number} dragonBones.AnimationState#timeScale
		 */
		public get timeScale():number{
			return this._timeScale;
		}

        /**
		 * 播放次数 (0:循环播放， >0:播放次数)
		 * @member {number} dragonBones.AnimationState#playTimes
		 */
		public get playTimes():number{
			return this._playTimes;
		}
	}
}