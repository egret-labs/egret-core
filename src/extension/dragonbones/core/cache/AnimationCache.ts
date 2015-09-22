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
	 * @class dragonBones.AnimationCache
	 * @classdesc
	 * AnimationCache 实例是动画缓存的实体，包含一个动画的所有缓存数据。
	 * 每个Slot的缓存数据存在各个SlotTimelineCache中。
	 * 一般来说 AnimationCache 不需要开发者直接操控，而是由AnimationCacheManager代为管理。
	 * @see dragonBones.AnimationCacheManager
	 * @see dragonBones.TimelineCache
	 * @see dragonBones.SlotTimelineCache
	 * @see dragonBones.SlotFrameCache
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
	export class AnimationCache{
		public name:string;
//		public var boneTimelineCacheList:Vector.<BoneTimelineCache> = new Vector.<BoneTimelineCache>();
		public slotTimelineCacheList:Array<SlotTimelineCache> = [];
//		public var boneTimelineCacheDic:Object = {};
		public slotTimelineCacheDic:any = {};
		public frameNum:number = 0;
		public constructor(){
		}
		
		public static initWithAnimationData(animationData:AnimationData,armatureData:ArmatureData):AnimationCache{
			var output:AnimationCache = new AnimationCache();
			output.name = animationData.name;
			
			var boneTimelineList:Array<TransformTimeline> = animationData.timelineList;
			var boneName:string;
			var boneData:BoneData;
			var slotData:SlotData;
			var slotTimelineCache:SlotTimelineCache;
			var slotName:string;
			
			for(var i:number = 0, length:number = boneTimelineList.length; i < length; i++){
				boneName = boneTimelineList[i].name;
				for (var j:number = 0, jlen:number = armatureData.slotDataList.length; j < jlen; j++){
					slotData = armatureData.slotDataList[j];
					slotName = slotData.name;
					if (slotData.parent == boneName){
						if (output.slotTimelineCacheDic[slotName] == null){
							slotTimelineCache = new SlotTimelineCache();
							slotTimelineCache.name = slotName;
							output.slotTimelineCacheList.push(slotTimelineCache);
							output.slotTimelineCacheDic[slotName] = slotTimelineCache;
						}
						
					}
				}
			}
			return output;
		}
		
//		public function initBoneTimelineCacheDic(boneCacheGeneratorDic:Object, boneFrameCacheDic:Object):void
//		{
//			var name:String;
//			for each(var boneTimelineCache:BoneTimelineCache in boneTimelineCacheDic)
//			{
//				name = boneTimelineCache.name;
//				boneTimelineCache.cacheGenerator = boneCacheGeneratorDic[name];
//				boneTimelineCache.currentFrameCache = boneFrameCacheDic[name];
//			}
//		}
		
		public initSlotTimelineCacheDic(slotCacheGeneratorDic:any, slotFrameCacheDic:any):void{
			var name:string;
			for ( var k in this.slotTimelineCacheDic)
			{
				var slotTimelineCache:SlotTimelineCache = this.slotTimelineCacheDic[k];
				name = slotTimelineCache.name;
				slotTimelineCache.cacheGenerator = slotCacheGeneratorDic[name];
				slotTimelineCache.currentFrameCache = slotFrameCacheDic[name];
			}
		}
		
//		public function bindCacheUserBoneDic(boneDic:Object):void
//		{
//			for(var name:String in boneDic)
//			{
//				(boneTimelineCacheDic[name] as BoneTimelineCache).bindCacheUser(boneDic[name]);
//			}
//		}
		
		public bindCacheUserSlotDic(slotDic:any):void{
			for(var name in slotDic){
				(this.slotTimelineCacheDic[name]).bindCacheUser(slotDic[name]);
			}
		}
		
		public addFrame():void{
			this.frameNum++;
//			var boneTimelineCache:BoneTimelineCache;
//			for(var i:int = 0, length:int = boneTimelineCacheList.length; i < length; i++)
//			{
//				boneTimelineCache = boneTimelineCacheList[i];
//				boneTimelineCache.addFrame();
//			}
			
			var slotTimelineCache:SlotTimelineCache;
			for(var i:number = 0, length:number = this.slotTimelineCacheList.length; i < length; i++){
				slotTimelineCache = this.slotTimelineCacheList[i];
				slotTimelineCache.addFrame();
			}
		}
			
		
		public update(progress:number):void{
			var frameIndex:number = Math.floor(progress * (this.frameNum - 1));
			
//			var boneTimelineCache:BoneTimelineCache;
//			for(var i:int = 0, length:int = boneTimelineCacheList.length; i < length; i++)
//			{
//				boneTimelineCache = boneTimelineCacheList[i];
//				boneTimelineCache.update(frameIndex);
//			}
			
			var slotTimelineCache:SlotTimelineCache;
			for(var i:number = 0, length:number = this.slotTimelineCacheList.length; i < length; i++){
				slotTimelineCache = this.slotTimelineCacheList[i];
				slotTimelineCache.update(frameIndex);
			}
		}
	}
}