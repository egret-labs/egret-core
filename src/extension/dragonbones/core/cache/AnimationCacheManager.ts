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

	export class AnimationCacheManager{
		public cacheGeneratorArmature:FastArmature
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
			this.cacheGeneratorArmature.animation.gotoAndPlay(animationName,0,-1,1);
			var animationState:FastAnimationState = this.cacheGeneratorArmature.animation.animationState;
			var passTime:number = 1 / this.frameRate;
			this.cacheGeneratorArmature._disableEventDispatch = true;
			this.cacheGeneratorArmature._cacheLoop = loop;
			do{
				this.cacheGeneratorArmature.advanceTime(passTime);
				animationCache.addFrame();
			}while (!animationState.isComplete);
			this.cacheGeneratorArmature._cacheLoop = false;
			this.cacheGeneratorArmature._disableEventDispatch = false;
			this.cacheGeneratorArmature._eventList.length = 0;
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