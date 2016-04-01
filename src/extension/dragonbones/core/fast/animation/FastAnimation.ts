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
	 * @class dragonBones.FastAnimation
	 * @classdesc
	 * FastAnimation实例隶属于FastArmature,用于控制FastArmature的动画播放。
	 * 和Animation相比，FastAnimation为了优化性能，不支持动画融合，在开启缓存的情况下，不支持无极的平滑补间
	 * @see dragonBones.FastBone
	 * @see dragonBones.FastArmature
	 * @see dragonBones.FastAnimationState
	 * @see dragonBones.AnimationData.
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
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
	  
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
	  
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
	 */
	export class FastAnimation{
		/**
		 * 所有动画名称列表.
		 * @member {string[]} dragonBones.FastAnimation#animationList
		 */
		public animationList:Array<string>;
		/**
		 * 当前正在运行的动画实例.
		 * @member {FastAnimationState} dragonBones.FastAnimation#animationState
		 */
		public animationState:FastAnimationState = new FastAnimationState();
		/**
		 * 动画缓存管理器.
		 * @member {AnimationCacheManager} dragonBones.FastAnimation#animationCacheManager
		 */
		public animationCacheManager:AnimationCacheManager;
		
		private _armature:FastArmature;
		private _animationDataList:Array<AnimationData>;
		private _animationDataObj:any;
		private _isPlaying:boolean;
		private _timeScale:number;

		/**
		 * 创建一个新的FastAnimation实例并赋给传入的FastArmature实例
		 * @param armature {FastArmature} 骨架实例
		 */
		public constructor(armature:FastArmature){
			this._armature = armature;
			this.animationState._armature = armature;
			this.animationList = [];
			this._animationDataObj = {};

			this._isPlaying = false;
			this._timeScale = 1;
		}
		
		/**
		 * Qualifies all resources used by this Animation instance for garbage collection.
		 */
		public dispose():void{
			if(!this._armature){
				return;
			}
			
			this._armature = null;
			this._animationDataList = null;
			this.animationList = null;
			this.animationState = null;
		}

		/**
		 * 开始播放指定名称的动画。
		 * 要播放的动画将经过指定时间的淡入过程，然后开始播放，同时之前播放的动画会经过相同时间的淡出过程。
		 * @param animationName {string} 指定播放动画的名称.
		 * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
		 * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
		 * @param playTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
		 * @see dragonBones.FastAnimationState.
		 */
		public gotoAndPlay( animationName:string, fadeInTime:number = -1, duration:number = -1, playTimes:number = NaN):FastAnimationState{
			if (!this._animationDataList){
				return null;
			}
			var animationData:AnimationData = this._animationDataObj[animationName];
			if (!animationData){
				return null;
			}
			this._isPlaying = true;
			fadeInTime = fadeInTime < 0?(animationData.fadeTime < 0?0.3:animationData.fadeTime):fadeInTime;
			var durationScale:number;
			if(duration < 0){
				durationScale = animationData.scale < 0?1:animationData.scale;
			}
			else{
				durationScale = duration * 1000 / animationData.duration;
			}
			playTimes = isNaN(playTimes)?animationData.playTimes:playTimes;
			
			//播放新动画
			
			this.animationState._fadeIn(animationData, playTimes, 1 / durationScale, fadeInTime);
			
			if(this._armature.enableCache && this.animationCacheManager){
				this.animationState.animationCache = this.animationCacheManager.getAnimationCache(animationName);
			}
			
			var i:number = this._armature.slotHasChildArmatureList.length;
			while(i--){
				var slot:FastSlot = this._armature.slotHasChildArmatureList[i];
				var childArmature:FastArmature = slot.childArmature;
				if(childArmature){
					childArmature.getAnimation().gotoAndPlay(animationName);
				}
			}
			return this.animationState;
		}

		/**
		 * 播放指定名称的动画并停止于某个时间点
		 * @param animationName {string} 指定播放的动画名称.
		 * @param time {number} 动画停止的绝对时间
		 * @param normalizedTime {number} 动画停止的相对动画总时间的系数，这个参数和time参数是互斥的（例如 0.2：动画停止总时间的20%位置） 默认值：-1 意味着使用绝对时间。
		 * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：0
		 * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
		 * @see dragonBones.FastAnimationState.
		 */
		public gotoAndStop(animationName:string,
						   time:number,
						   normalizedTime:number = -1,
						   fadeInTime:number = 0,
						   duration:number = -1
						   ):FastAnimationState
		{
			if(this.animationState.name != animationName)
			{
				this.gotoAndPlay(animationName,fadeInTime,duration);
			}
			if(normalizedTime >=0)
			{
				this.animationState.setCurrentTime(this.animationState.totalTime * normalizedTime);
			}
			else
			{
				this.animationState.setCurrentTime(time);
			}
			this.animationState.stop();
			return this.animationState;
		}

		/**
		 * 从当前位置继续播放动画
		 */
		public play():void{
			if(!this._animationDataList){
				return;
			}
			if(!this.animationState.name){
				this.gotoAndPlay(this._animationDataList[0].name);
			}
			else if (!this._isPlaying){
				this._isPlaying = true;
			}
			else{
				this.gotoAndPlay(this.animationState.name);
			}
		}

		/**
		 * 暂停动画播放
		 */
		public stop():void{
			this._isPlaying = false;
		}
		
		/** @private */
		public advanceTime(passedTime:number):void{
			if(!this._isPlaying){
				return;
			}
			
			this.animationState._advanceTime(passedTime * this._timeScale);
		}
		
		/**
		 * check if contains a AnimationData by name.
		 * @return Boolean.
		 * @see dragonBones.AnimationData.
		 */
		public hasAnimation(animationName:string):boolean{
			return this._animationDataObj[animationName] != null;
		}

		/**
		 * 时间缩放倍数
		 * @member {number} dragonBones.FastAnimation#timeScale
		 */
		public get timeScale():number
		{
			return this._timeScale;
		}
		public set timeScale(value:number)
		{
			if(isNaN(value) || value < 0)
			{
				value = 1;
			}
			this._timeScale = value;
		}
		/**
		 * 包含的所有动画数据列表
		 * @member {AnimationData[]} dragonBones.FastAnimation#animationDataList
		 * @see dragonBones.AnimationData.
		 */
		public get animationDataList():Array<AnimationData>{
			return this._animationDataList;
		}
		public set animationDataList(value:Array<AnimationData>){
			this._animationDataList = value;
			this.animationList.length = 0;
			var length:number = this._animationDataList.length;
			for(var i:number = 0;i < length;i++){
				var animationData:AnimationData = this._animationDataList[i];
				this.animationList.push(animationData.name);
				this._animationDataObj[animationData.name] = animationData;
			}
		}

		/**
		 * Unrecommended API. Recommend use animationList.
		 */
		public get movementList():Array<string>
		{
			return this.animationList;
		}
		
		/**
		 * Unrecommended API. Recommend use lastAnimationName.
		 */
		public get movementID():string
		{
			return this.lastAnimationName;
		}

		/**
		 * 是否正在播放
		 * @member {boolean} dragonBones.FastAnimation#isPlaying
		 */
		public isPlaying():boolean
		{
			return this._isPlaying && !this.isComplete;
		}

		/**
		 * 是否播放完成.
		 * @member {boolean} dragonBones.FastAnimation#isComplete
		 */
		public get isComplete():boolean
		{
			return this.animationState.isComplete;
		}

		/**
		 * 当前播放动画的实例.
		 * @member {FastAnimationState} dragonBones.FastAnimation#lastAnimationState
		 */
		public get lastAnimationState():FastAnimationState
		{
			return this.animationState;
		}

		/**
		 * 当前播放动画的名字.
		 * @member {string} dragonBones.FastAnimation#lastAnimationName
		 */
		public get lastAnimationName():string
		{
			return this.animationState ? this.animationState.name : null;
		}
	}
}