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
     * @class dragonBones.Animation
     * @classdesc
     * Animation实例隶属于Armature,用于控制Armature的动画播放。
     * @see dragonBones.Bone
     * @see dragonBones.Armature
     * @see dragonBones.AnimationState
     * @see dragonBones.AnimationData
     *
     * @example
       <pre>
       //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");

        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        armatureDisplay.x = 200;
        armatureDisplay.y = 500;
        //把它添加到舞台上
        this.addChild(armatureDisplay);


        
        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName:string = armature.animation.animationList[0];

        var animation:dragonBones.Animation = armature.animation;

        //gotoAndPlay的用法：动画播放，播放一遍
        animation.gotoAndPlay(curAnimationName,0,-1,1);

        //gotoAndStop的用法：
        //curAnimationName = armature.animation.animationList[1];
        //动画停在第二个动画的第0.2秒的位置
        //animation.gotoAndStop(curAnimationName,0.2);
        //动画停在第二个动画的一半的位置，如果第三个参数大于0，会忽略第二个参数
        //animation.gotoAndStop(curAnimationName,0, 0.5);
        //继续播放
        //animation.play();
        //暂停播放
        //animation.stop();

        //动画融合
        //animation.gotoAndPlay(curAnimationName,0,-1,0,0,"group1");

        //var animationState:dragonBones.AnimationState = armature.animation.getState(curAnimationName);
        //animationState.addBoneMask("neck",true);
        //播放第二个动画， 放到group "Squat"里
        //curAnimationName = armature.animation.animationList[1];
        //armature.animation.gotoAndPlay(curAnimationName,0,-1,0,0,"group2",dragonBones.Animation.SAME_GROUP);
        //animationState = armature.animation.getState(curAnimationName);
        //animationState.addBoneMask("hip",true);//“hip”是骨架的根骨骼的名字
        //animationState.removeBoneMask("neck",true);
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
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
		 * @member {boolean} dragonBones.Animation#tweenEnabled
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
		 * 创建一个新的Animation实例并赋给传入的Armature实例
		 * @param armature {Armature} 骨架实例
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
		 * 回收Animation实例用到的所有资源
		 */
		public dispose():void{
			if(!this._armature){
				return;
			}
			
			this._resetAnimationStateList();
			
			this._animationList.length = 0;
			
			this._armature = null;
			this._animationDataList = null;
			this._animationList = null;
			this._animationStateList = null;
		}
		
		public _resetAnimationStateList():void
		{
			var i:number = this._animationStateList.length;
			var animationState:AnimationState;
			while(i --)
			{
				animationState = this._animationStateList[i];
				animationState._resetTimelineStateList();
				AnimationState._returnObject(animationState);
			}
			this._animationStateList.length = 0;
		}
		
		/**
		 * 开始播放指定名称的动画。
		 * 要播放的动画将经过指定时间的淡入过程，然后开始播放，同时之前播放的动画会经过相同时间的淡出过程。
		 * @param animationName {string} 指定播放动画的名称.
		 * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
		 * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
		 * @param playTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
		 * @param layer {number} 动画所处的层
		 * @param group {string} 动画所处的组
		 * @param fadeOutMode {string} 动画淡出模式 (none, sameLayer, sameGroup, sameLayerAndGroup, all).默认值：sameLayerAndGroup
		 * @param pauseFadeOut {boolean} 动画淡出时暂停播放
		 * @param pauseFadeIn {boolean} 动画淡入时暂停播放
		 * @returns {AnimationState} 动画播放状态实例
		 * @see dragonBones.AnimationState.
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
			var needUpdate:boolean = this._isPlaying == false;
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
			if(needUpdate)
			{
				this._armature.advanceTime(0);
			}
			
			return this._lastAnimationState;
		}
		
		/**
		 * 播放指定名称的动画并停止于某个时间点
		 * @param animationName {string} 指定播放的动画名称.
		 * @param time {number} 动画停止的绝对时间
		 * @param normalizedTime {number} 动画停止的相对动画总时间的系数，这个参数和time参数是互斥的（例如 0.2：动画停止总时间的20%位置） 默认值：-1 意味着使用绝对时间。
		 * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：0
		 * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
		 * @param layer {string} 动画所处的层
		 * @param group {string} 动画所处的组
		 * @param fadeOutMode {string} 动画淡出模式 (none, sameLayer, sameGroup, sameLayerAndGroup, all).默认值：sameLayerAndGroup
		 * @returns {AnimationState} 动画播放状态实例
		 * @see dragonBones.AnimationState.
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
		 * 从当前位置继续播放动画
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

		/**
		 * 暂停动画播放
		 */
		public stop():void{
			this._isPlaying = false;
		}
		
		/**
		 * 获得指定名称的 AnimationState 实例.
		 * @returns {AnimationState} AnimationState 实例.
		 * @see dragonBones..AnimationState.
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
		 * 检查是否包含指定名称的动画.
		 * @returns {boolean}.
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
		* 不推荐的API.推荐使用 animationList.
		*/
		public get movementList():Array<string>{
			return this._animationList;
		}
		
		/**
		* 不推荐的API.推荐使用 lastAnimationName.
		*/
		public get movementID():string{
			return this.lastAnimationName;
		}
		
		/**
		 * 最近播放的 AnimationState 实例。
		 * @member {AnimationState} dragonBones.Animation#lastAnimationState
		 * @see dragonBones.AnimationState
		 */
		public get lastAnimationState():AnimationState{
			return this._lastAnimationState;
		}

		/**
		 * 最近播放的动画名称.
		 * @member {string} dragonBones.Animation#lastAnimationName
		 */
		public get lastAnimationName():string{
			return this._lastAnimationState?this._lastAnimationState.name:null;
		}

        /**
		 * 所有动画名称列表.
		 * @member {string[]} dragonBones.Animation#animationList
		 */
		public get animationList():Array<string>{
			return this._animationList;
		}
		
		
		/**
		 * 是否正在播放
		 * @member {boolean} dragonBones.Animation#isPlaying
		 */
		public get isPlaying():boolean{
			return this._isPlaying && !this.isComplete;
		}
		
		/**
		 * 最近播放的动画是否播放完成.
		 * @member {boolean} dragonBones.Animation#isComplete
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
		 * 时间缩放倍数
		 * @member {number} dragonBones.Animation#timeScale
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
		 * 包含的所有动画数据列表
		 * @member {AnimationData[]} dragonBones.Animation#animationDataList
		 * @see dragonBones.AnimationData.
		 */
		public get animationDataList():Array<AnimationData>{
			return this._animationDataList;
		}
		public set animationDataList(value:Array<AnimationData>){
			this._animationDataList = value;
			this._animationList.length = 0;

            for(var i:number = 0,len:number = this._animationDataList.length; i < len; i++)
            {
                var animationData:AnimationData = this._animationDataList[i];
                this._animationList[this._animationList.length] = animationData.name;
            }
		}
	}
}