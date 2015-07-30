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
	export class AnimationCacheManager{
		public cacheGeneratorArmature:ICacheableArmature
		public armatureData:ArmatureData;
		public frameRate:number;
		public animationCacheDic:any = {};
//		public var boneFrameCacheDic:Object = {};
		public slotFrameCacheDic:any = {};
		public constructor(){
		}
		
		public static initWithArmatureData(armatureData:ArmatureData, frameRate:number = 0):AnimationCacheManager{
			var output:AnimationCacheManager = new AnimationCacheManager();
			output.armatureData = armatureData;
			if(frameRate<=0){
				var animationData:AnimationData = armatureData.animationDataList[0];
				if(animationData){
					output.frameRate = animationData.frameRate;
				}
			}
			else{
				output.frameRate = frameRate;
			}
			
			return output;
		}
		
		public initAllAnimationCache():void{
			var length:number = this.armatureData.animationDataList.length;
			for(var i:number = 0;i < length;i++){
				var animationData:AnimationData = this.armatureData.animationDataList[i];
				this.animationCacheDic[animationData.name] = AnimationCache.initWithAnimationData(animationData,this.armatureData);
			}
		}
		
		public initAnimationCache(animationName:string):void{
			this.animationCacheDic[animationName] = AnimationCache.initWithAnimationData(this.armatureData.getAnimationData(animationName),this.armatureData);
		}
		
		public bindCacheUserArmatures(armatures:Array<any>):void{
			var length:number = armatures.length;
			for(var i:number = 0;i < length;i++){
				var armature:FastArmature = armatures[i];
				this.bindCacheUserArmature(armature);
			}
			
		}
		
		public bindCacheUserArmature(armature:FastArmature):void{
			armature.animation.animationCacheManager = this;
			
			var cacheUser:ICacheUser;
//			for each(cacheUser in armature._boneDic)
//			{
//				cacheUser.frameCache = boneFrameCacheDic[cacheUser.name];
//			}
			for( var k in armature._slotDic)
			{
				cacheUser = armature._slotDic[k];
				cacheUser.frameCache = this.slotFrameCacheDic[cacheUser.name];
			}
			/*
			var length:number = armature._slotDic.length;
			for(var i:number = 0;i < length;i++){
				cacheUser = armature._slotDic[i];
				cacheUser.frameCache = this.slotFrameCacheDic[cacheUser.name];
			}
			*/
		}
		
		public setCacheGeneratorArmature(armature:FastArmature):void{
			this.cacheGeneratorArmature = armature;
			
			var cacheUser:ICacheUser;
//			for each(cacheUser in armature._boneDic)
//			{
//				boneFrameCacheDic[cacheUser.name] = new FrameCache();
//			}

			for(var slot in armature._slotDic)
			{
				cacheUser = armature._slotDic[slot];
				this.slotFrameCacheDic[cacheUser.name] = new SlotFrameCache();
			}
			/*
			var length:number = armature._slotDic.length;
			for(var i:number = 0;i < length;i++){
				cacheUser = armature._slotDic[i];
				this.slotFrameCacheDic[cacheUser.name] = new SlotFrameCache();
			}
			*/
			for(var anim in this.animationCacheDic)
			{
				var animationCache:AnimationCache = this.animationCacheDic[anim];
				animationCache.initSlotTimelineCacheDic(armature._slotDic, this.slotFrameCacheDic);
			}
			/*
			var length1:number = this.animationCacheDic.length;
			for(var i1:number = 0;i1 < length1;i1++){
				var animationCache:AnimationCache = this.animationCacheDic[i1];
//				animationCache.initBoneTimelineCacheDic(armature._boneDic, boneFrameCacheDic);
				animationCache.initSlotTimelineCacheDic(armature._slotDic, this.slotFrameCacheDic);
			}
			*/
		}
		
		public generateAllAnimationCache(loop:boolean):void{
			/*
			var length:number = this.animationCacheDic.length;
			for(var i:number = 0;i < length;i++){
				var animationCache:AnimationCache = this.animationCacheDic[i];
				this.generateAnimationCache(animationCache.name);
			}
			*/
			for(var anim in this.animationCacheDic)
			{
				var animationCache:AnimationCache = this.animationCacheDic[anim];
				this.generateAnimationCache(animationCache.name, loop);
			}
		}
		
		public generateAnimationCache(animationName:string, loop:boolean):void{
			var temp:boolean = this.cacheGeneratorArmature.enableCache;
			this.cacheGeneratorArmature.enableCache = false;
			var animationCache:AnimationCache = this.animationCacheDic[animationName];
			if(!animationCache){
				return;
			}

			var animationState:IAnimationState = this.cacheGeneratorArmature.getAnimation().animationState;
			var passTime:number = 1 / this.frameRate;
			if(loop)
			{
				this.cacheGeneratorArmature.getAnimation().gotoAndPlay(animationName,0,-1,0);
			}
			else
			{
				this.cacheGeneratorArmature.getAnimation().gotoAndPlay(animationName,0,-1,1);
			}
			var tempEnableEventDispatch:boolean = this.cacheGeneratorArmature.enableEventDispatch;
			this.cacheGeneratorArmature.enableEventDispatch = false;

			var lastProgress:number;
			do{
				lastProgress = animationState.progress;
				this.cacheGeneratorArmature.advanceTime(passTime);
				animationCache.addFrame();
			}while (animationState.progress >= lastProgress && animationState.progress < 1);

			this.cacheGeneratorArmature.enableEventDispatch = tempEnableEventDispatch;
			this.resetCacheGeneratorArmature();
			this.cacheGeneratorArmature.enableCache = temp;
		}
		
		/**
		 * 将缓存生成器骨架重置，生成动画缓存后调用。
		 */
		public resetCacheGeneratorArmature():void{
			this.cacheGeneratorArmature.resetAnimation();
		}
		
		public getAnimationCache(animationName:string):AnimationCache{
			return this.animationCacheDic[animationName];
		} 
	}
}