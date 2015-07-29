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