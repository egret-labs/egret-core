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
	 * 不支持动画融合，在开启缓存的情况下，不支持无极的平滑补间
	 *
	 * @example
     * <pre>
	 * //获取动画数据
     *  var skeletonData = RES.getRes("skeleton");
     *  //获取纹理集数据
     *  var textureData = RES.getRes("textureConfig");
     *  //获取纹理集图片
     *  var texture = RES.getRes("texture");
	 *
     *  //创建一个工厂，用来创建Armature
     *  var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
     *  //把动画数据添加到工厂里
     *  factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
     *  //把纹理集数据和图片添加到工厂里
     *  factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
	 *
     *  //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
     *  var armatureName:string = skeletonData.armature[0].name;
     *  //从工厂里创建出Armature
     *  var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
     *  //获取装载Armature的容器
     *  var armatureDisplay = armature.display;
     *  //把它添加到舞台上
     *  this.addChild(armatureDisplay);
     *  
     *  //以60fps的帧率开启动画缓存，缓存所有的动画数据
     *  var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
	 *
     * //取得这个Armature动画列表中的第一个动画的名字
     *  var curAnimationName = armature.animation.animationList[0];
     *  //播放这个动画，gotoAndPlay各个参数说明
     *  //第一个参数 animationName {string} 指定播放动画的名称.
     *  //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
     *  //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
     *  //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
     *  armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
	 *
     *  //把Armature添加到心跳时钟里
     *  dragonBones.WorldClock.clock.add(armature);
     *  //心跳时钟开启
     *  egret.Ticker.getInstance().register(function (advancedTime) {
     *      dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
     *  }, this);
     *  </pre>
	 */
	export class FastAnimation{
		public animationList:Array<string>;
		public animationState:FastAnimationState = new FastAnimationState();
		public animationCacheManager:AnimationCacheManager;
		
		private _armature:FastArmature;
		private _animationDataList:Array<AnimationData>;
		private _animationDataObj:any;
		private _isPlaying:boolean;
		private _timeScale:number;
		
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
		 * Play the animation from the current position.
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
		 * @see dragonBones.animation.AnimationData.
		 */
		public hasAnimation(animationName:string):boolean{
			return this._animationDataObj[animationName] != null;
		}
		
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
		 * The AnimationData list associated with this Animation instance.
		 * @see dragonBones.objects.AnimationData.
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

		public isPlaying():boolean
		{
			return this._isPlaying && !this.isComplete;
		}

		public get isComplete():boolean
		{
			return this.animationState.isComplete;
		}
		
		public get lastAnimationState():FastAnimationState
		{
			return this.animationState;
		}

		public get lastAnimationName():string
		{
			return this.animationState ? this.animationState.name : null;
		}
	}
}