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
     * @class dragonBones.Animation
     * @classdesc
     * Animation实例隶属于Armature,用于控制Armature的动画播放。
     * An Animation instance is used to control the animation state of an Armature.
     * @see dragonBones.Bone
     * @see dragonBones.Armature
     * @see dragonBones.AnimationState
     */
	export class Animation{
		public static NONE:string = "none";
		public static SAME_LAYER:string = "sameLayer";
		public static SAME_GROUP:string = "sameGroup";
		public static SAME_LAYER_AND_GROUP:string = "sameLayerAndGroup";
		public static ALL:string = "all";

        /**
         * 标记是否开启自动补间。
         * 设置为 true时，Animation会根据动画数据的内容，在关键帧之间自动补间。设置为false时，所有动画均不补间
         * 默认值：true。
         * @member {boolean} dragonbones.Animation#tweenEnabled
         */
		public tweenEnabled:boolean;
		private _armature:Armature;
		private _animationStateList:Array<AnimationState>;
		private _animationDataList:Array<AnimationData>;
		private _animationList:Array<string>;
		private _isPlaying:boolean;
		private _timeScale:number;

		/** @private */

		public _lastAnimationState:AnimationState;

		/** @private */
		public _isFading:boolean;

		/** @private */
		public _animationStateCount:number = 0;

		
		/**
		 * Creates a new Animation instance and attaches it to the passed Armature.
		 * @param armature An Armature to attach this Animation instance to.
		 */
		public constructor(armature:Armature){
			this._armature = armature;
			this._animationList = [];
			this._animationStateList = [];
			
			this._timeScale = 1;
			this._isPlaying = false;
			
			this.tweenEnabled = true;
		}
		
		/**
		 * Qualifies all resources used by this Animation instance for garbage collection.
		 */
		public dispose():void{
			if(!this._armature){
				return;
			}
			var i:number = this._animationStateList.length;
			while(i --){
				AnimationState._returnObject(this._animationStateList[i]);
			}
			this._animationList.length = 0;
			this._animationStateList.length = 0;
			
			this._armature = null;
			this._animationDataList = null;
			this._animationList = null;
			this._animationStateList = null;
		}
		
		
		/**
		 * Fades the animation with name animation in over a period of time seconds and fades other animations out.
		 * @param animationName The name of the AnimationData to play.
		 * @param fadeInTime A fade time to apply (>= 0), -1 means use xml data's fadeInTime. 
		 * @param duration The duration of that Animation. -1 means use xml data's duration.
		 * @param playTimes Play times(0:loop forever, >=1:play times, -1~-∞:will fade animation after play complete), 默认使用AnimationData.loop.
		 * @param layer The layer of the animation.
		 * @param group The group of the animation.
		 * @param fadeOutMode Fade out mode (none, sameLayer, sameGroup, sameLayerAndGroup, all).
		 * @param pauseFadeOut Pause other animation playing.
		 * @param pauseFadeIn Pause this animation playing before fade in complete.
		 * @return AnimationState.
		 * @see dragonBones.objects.AnimationData.
		 * @see dragonBones.animation.AnimationState.
		 */
		public gotoAndPlay(
			animationName:string, 
			fadeInTime:number = -1, 
			duration:number = -1, 
			playTimes:number = NaN, 
			layer:number = 0, 
			group:string = null,
			fadeOutMode:string = Animation.SAME_LAYER_AND_GROUP,
			pauseFadeOut:boolean = true,
			pauseFadeIn:boolean = true
		):AnimationState{
			if (!this._animationDataList){
				return null;
			}
			var i:number = this._animationDataList.length;
			var animationData:AnimationData;
			while(i --){
				if(this._animationDataList[i].name == animationName){
					animationData = this._animationDataList[i];
					break;
				}
			}
			if (!animationData){
				return null;
			}
			this._isPlaying = true;
			this._isFading = true;
			
			//
			fadeInTime = fadeInTime < 0?(animationData.fadeTime < 0?0.3:animationData.fadeTime):fadeInTime;
			var durationScale:number;
			if(duration < 0){
				durationScale = animationData.scale < 0?1:animationData.scale;
			}
			else{
				durationScale = duration * 1000 / animationData.duration;
			}
			
			playTimes = isNaN(playTimes)?animationData.playTimes:playTimes;
			
	//根据fadeOutMode,选择正确的animationState执行fadeOut
			var animationState:AnimationState;
			switch(fadeOutMode){
				case Animation.NONE:
					break;
				
				case Animation.SAME_LAYER:
					i = this._animationStateList.length;
					while(i --){
						animationState = this._animationStateList[i];
						if(animationState.layer == layer){
							animationState.fadeOut(fadeInTime, pauseFadeOut);
						}
					}
					break;
				
				case Animation.SAME_GROUP:
					i = this._animationStateList.length;
					while(i --){
						animationState = this._animationStateList[i];
						if(animationState.group == group){
							animationState.fadeOut(fadeInTime, pauseFadeOut);
						}
					}
					break;
				
				case Animation.ALL:
					i = this._animationStateList.length;
					while(i --){
						animationState = this._animationStateList[i];
						animationState.fadeOut(fadeInTime, pauseFadeOut);
					}
					break;
				
				case Animation.SAME_LAYER_AND_GROUP:
				default:
					i = this._animationStateList.length;
					while(i --){
						animationState = this._animationStateList[i];
						if(animationState.layer == layer && animationState.group == group ){
							animationState.fadeOut(fadeInTime, pauseFadeOut);
						}
					}
					break;
			}
			
			this._lastAnimationState = AnimationState._borrowObject();
			this._lastAnimationState._layer = layer;
			this._lastAnimationState._group = group;
			this._lastAnimationState.autoTween = this.tweenEnabled;
			this._lastAnimationState._fadeIn(this._armature, animationData, fadeInTime, 1 / durationScale, playTimes, pauseFadeIn);
			
			this.addState(this._lastAnimationState);
			
		//控制子骨架播放同名动画
			var slotList:Array<Slot> = this._armature.getSlots(false);
			i = slotList.length;
			while(i --){
				var slot:Slot = slotList[i];
				if(slot.childArmature){
					slot.childArmature.animation.gotoAndPlay(animationName, fadeInTime);
				}
			}
			
			return this._lastAnimationState;
		}
		
		/**
		 * Control the animation to stop with a specified time. If related animationState haven't been created, then create a new animationState.
		 * @param animationName The name of the animationState.
		 * @param time 
		 * @param normalizedTime 
		 * @param fadeInTime A fade time to apply (>= 0), -1 means use xml data's fadeInTime. 
		 * @param duration The duration of that Animation. -1 means use xml data's duration.
		 * @param layer The layer of the animation.
		 * @param group The group of the animation.
		 * @param fadeOutMode Fade out mode (none, sameLayer, sameGroup, sameLayerAndGroup, all).
		 * @return AnimationState.
		 * @see dragonBones.objects.AnimationData.
		 * @see dragonBones.animation.AnimationState.
		 */
		public gotoAndStop(
			animationName:string, 
			time:number, 
			normalizedTime:number = -1,
			fadeInTime:number = 0, 
			duration:number = -1, 
			layer:number = 0, 
			group:string = null, 
			fadeOutMode:string = Animation.ALL
		):AnimationState{
			var animationState:AnimationState = this.getState(animationName, layer);
			if(!animationState){
				animationState = this.gotoAndPlay(animationName, fadeInTime, duration, NaN, layer, group, fadeOutMode);
			}
			
			if(normalizedTime >= 0){
				animationState.setCurrentTime(animationState.totalTime * normalizedTime);
			}
			else{
				animationState.setCurrentTime(time);
			}
			
			animationState.stop();
			
			return animationState;
		}
		
		/**
		 * Play the animation from the current position.
		 */
		public play():void{
			if (!this._animationDataList || this._animationDataList.length == 0){
				return;
			}
			if(!this._lastAnimationState){
				this.gotoAndPlay(this._animationDataList[0].name);
			}
			else if (!this._isPlaying){
				this._isPlaying = true;
			}
			else{
				this.gotoAndPlay(this._lastAnimationState.name);
			}
		}
		
		public stop():void{
			this._isPlaying = false;
		}
		
		/**
		 * Returns the AnimationState named name.
		 * @return A AnimationState instance.
		 * @see dragonBones.animation.AnimationState.
		 */
		public getState(name:string, layer:number = 0):AnimationState{
			var i:number = this._animationStateList.length;
			while(i --){
				var animationState:AnimationState = this._animationStateList[i];
				if(animationState.name == name && animationState.layer == layer){
					return animationState;
				}
			}
			return null;
		}
		
		/**
		 * check if contains a AnimationData by name.
		 * @return Boolean.
		 * @see dragonBones.animation.AnimationData.
		 */
		public hasAnimation(animationName:string):boolean{
			var i:number = this._animationDataList.length;
			while(i --){
				if(this._animationDataList[i].name == animationName){
					return true;
				}
			}
			
			return false;
		}
		
		/** @private */
		public _advanceTime(passedTime:number):void{
			if(!this._isPlaying){
				return;
			}
			
			var isFading:boolean = false;
			
			passedTime *= this._timeScale;
			var i:number = this._animationStateList.length;
			while(i --){
				var animationState:AnimationState = this._animationStateList[i];
				if(animationState._advanceTime(passedTime)){
					this.removeState(animationState);
				}
				else if(animationState.fadeState != 1){
					isFading = true;
				}
			}
			
			this._isFading = isFading;
		}
		
		/** @private */
		//当动画播放过程中Bonelist改变时触发
		public _updateAnimationStates():void{
			var i:number = this._animationStateList.length;
			while(i --){
				this._animationStateList[i]._updateTimelineStates();
			}
		}
		
		private addState(animationState:AnimationState):void{
			if(this._animationStateList.indexOf(animationState) < 0){
				this._animationStateList.unshift(animationState);
				
				this._animationStateCount = this._animationStateList.length;
			}
		}
		
		private removeState(animationState:AnimationState):void{
			var index:number = this._animationStateList.indexOf(animationState);
			if(index >= 0){
				this._animationStateList.splice(index, 1);
				AnimationState._returnObject(animationState);
				
				if(this._lastAnimationState == animationState){
					if(this._animationStateList.length > 0){
						this._lastAnimationState = this._animationStateList[0];
					}
					else{
						this._lastAnimationState = null;
					}
				}
				
				this._animationStateCount = this._animationStateList.length;
			}
		}
		
		
		
		/**
		* Unrecommended API. Recommend use animationList.
		*/
		public get movementList():Array<string>{
			return this._animationList;
		}
		
		/**
		* Unrecommended API. Recommend use lastAnimationName.
		*/
		public get movementID():string{
			return this.lastAnimationName;
		}
		
		
		
		/**
		 * The last AnimationState this Animation played.
		 * @see dragonBones.objects.AnimationData.
		 */
		public get lastAnimationState():AnimationState{
			return this._lastAnimationState;
		}
		/**
		 * The name of the last AnimationData played.
		 * @see dragonBones.objects.AnimationData.
		 */
		public get lastAnimationName():string{
			return this._lastAnimationState?this._lastAnimationState.name:null;
		}
		
		
		/**
		 * An vector containing all AnimationData names the Animation can play.
		 * @see dragonBones.objects.AnimationData.
		 */
		public get animationList():Array<string>{
			return this._animationList;
		}
		
		
		/**
		 * Is the animation playing.
		 * @see dragonBones.animation.AnimationState.
		 */
		public get isPlaying():boolean{
			return this._isPlaying && !this.isComplete;
		}
		
		/**
		 * Is animation complete.
		 * @see dragonBones.animation.AnimationState.
		 */
		public get isComplete():boolean{
			if(this._lastAnimationState){
				if(!this._lastAnimationState.isComplete){
					return false;
				}
				var i:number = this._animationStateList.length;
				while(i --){
					if(!this._animationStateList[i].isComplete){
						return false;
					}
				}
				return true;
			}
			return true;
		}
		
		
		/**
		 * The amount by which passed time should be scaled. Used to slow down or speed up animations. Defaults to 1.
		 */
		public get timeScale():number{
			return this._timeScale;
		}
		public set timeScale(value:number){
			if(isNaN(value) || value < 0){
				value = 1;
			}
			this._timeScale = value;
		}
		
		/**
		 * The AnimationData list associated with this Animation instance.
		 * @see dragonBones.objects.AnimationData.
		 */
		public get animationDataList():Array<AnimationData>{
			return this._animationDataList;
		}
		public set animationDataList(value:Array<AnimationData>){
			this._animationDataList = value;
			this._animationList.length = 0;

            for(var key in this._animationDataList)
            {
                var animationData:AnimationData = this._animationDataList[key];
                this._animationList[this._animationList.length] = animationData.name;
            }
		}
	}
}