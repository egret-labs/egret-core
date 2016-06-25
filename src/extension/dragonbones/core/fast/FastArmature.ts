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
	 * @class dragonBones.FastArmature
     * @classdesc
     * FastArmature 是 DragonBones 高效率的骨骼动画系统。他能缓存动画数据，大大减少动画播放的计算
     * 不支持动态添加Bone和Slot，换装请通过更换Slot的dispaly或子骨架childArmature来实现
     * @extends dragonBones.EventDispatcher
     * @see dragonBones.ArmatureData
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
	export class FastArmature extends EventDispatcher implements ICacheableArmature{
		/**
		 * The name should be same with ArmatureData's name
		 */
		public name:string;
		/**
		 * An object that can contain any user extra data.
		 */
		public userData:any;
		
		
		private _enableCache:boolean;
		
		/**
		 * 保证CacheManager是独占的前提下可以开启，开启后有助于性能提高
		 */
        public isCacheManagerExclusive: boolean = false;
        public _cacheFrameIndex: number = -1;

		
		/** @private */
		public _animation:FastAnimation;
		
		/** @private */
		public _display:any;
		
		/** @private Store bones based on bones' hierarchy (From root to leaf)*/
		public boneList:Array<FastBone>;
		public _boneDic:any;
        
		private _boneIKList:Array<Array<FastBone>> = [];
        /** @private ik*/
		public _ikList:Array<FastIKConstraint>;//Vector.<IKConstraint>;
		/** @private Store slots based on slots' zOrder*/
		public slotList:Array<FastSlot>;
		public _slotDic:any;
		
        /** @private data version 4.5 and upper*/
        public _skewEnable:boolean;
        
		public slotHasChildArmatureList:Array<FastSlot>;
		
		public _enableEventDispatch:boolean = true;

		public __dragonBonesData:DragonBonesData;
		public _armatureData:ArmatureData;
		public _slotsZOrderChanged:boolean;
		public _eventList:Array<any>;
		
		private _delayDispose:boolean;
        private _lockDispose: boolean;
        /** @private*/
        public _useCache: boolean = true;
        /** @private*/
        public _isFrameCached: boolean = false;

		public constructor(display:any){
			super();
			this._display = display;
			this._animation = new FastAnimation(this);
			this._slotsZOrderChanged = false;
			this._armatureData = null;
			
			this.boneList = [];
			this._boneDic = {};
			this.slotList = [];
			this._slotDic = {};
			this.slotHasChildArmatureList = [];
			
			this._eventList = [];
			this._ikList = [];
			this._delayDispose = false;
			this._lockDispose = false;
			
		}
		
		/**
		 * Cleans up any resources used by this instance.
		 */
		public dispose():void{
			this._delayDispose = true;
			if(!this._animation || this._lockDispose){
				return;
			}
			
			this.userData = null;
			
			this._animation.dispose();
			var i:number = this.slotList.length;
			while(i --){
				this.slotList[i].dispose();
			}
			i = this.boneList.length;
			while(i --){
				this.boneList[i].dispose();
			}
			i = this._ikList.length;
            while (i--) {
                this._ikList[i].dispose();
            }
            
			this.slotList.length = 0;
			this.boneList.length = 0;
			
			this._armatureData = null;
			this._animation = null;
			this.slotList = null;
			this.boneList = null;
			this._eventList = null;
			this._ikList = null;
		}
		
		/**
		 * Update the animation using this method typically in an ENTERFRAME Event or with a Timer.
		 * @param The amount of second to move the playhead ahead.
		 */
		
        public advanceTime(passedTime: number): void{
            this._lockDispose = true;
            this._isFrameCached = false;
			this._animation.advanceTime(passedTime);
			
			var bone:FastBone;
			var slot:FastSlot;
			var i:number = 0;
            var len:number = this._boneIKList.length;
            var j:number;
            var jLen:number;
            
            if (this._isFrameCached) {
				if(!this._useCache){
					this._useCache = true;
				}
				i = this.slotList.length;
				while(i --){
					slot = this.slotList[i];
					slot.updateByCache(this._cacheFrameIndex);
                }
			}
			else{
				if(this._useCache){
					this._useCache = false;
					/*i = this.slotList.length;
					while(i --){
						slot = this.slotList[i];
						slot.switchTransformToBackup();
					}*/
				}
				
                for (i = 0; i < len; i++) 
                {
					for (j = 0, jLen = this._boneIKList[i].length; j < jLen; j++)
					{
						bone = this._boneIKList[i][j];
						if(bone.isIKConstraint){
							var ikCon:FastIKConstraint = this._ikList[i-1];
							if(ikCon.bones[0].name == bone.name){
								bone.update();
								bone.rotationIK = bone.global.rotation;
								if(ikCon.bones.length>1){
									ikCon.bones[1].update();
									ikCon.bones[1].rotationIK = ikCon.bones[1].global.rotation;
								}
								ikCon.compute();
							}
							bone.adjustGlobalTransformMatrixByIK();
						}else{
							bone.update();
							bone.rotationIK = bone.global.rotation;
						}
					}
					/*if(i != 0)
					{
						this._ikList[i-1].compute();
						for (j = 0, jLen = this._boneIKList[i].length; j < jLen; j++) {
							bone = this._boneIKList[i][j];
							bone.adjustGlobalTransformMatrixByIK();
						}
					}else{
						for (j = 0, jLen = this._boneIKList[i].length; j < jLen; j++)
						{
							bone = this._boneIKList[i][j];
							bone.update();
							bone.rotationIK = bone.global.rotation;
						}
					}*/
                }
				
				i = this.slotList.length;
				while(i --){
					slot = this.slotList[i];
					slot._update();
				}
			}
			
			i = this.slotHasChildArmatureList.length;
			while(i--){
				slot = this.slotHasChildArmatureList[i];
				var childArmature:FastArmature = slot.childArmature;
				if(childArmature){
					childArmature.advanceTime(passedTime);
				}
			}
			
			if(this._slotsZOrderChanged){
				this.updateSlotsZOrder();
            }

            // Modify Fast mode by duanchunlei
            if (!this._isFrameCached) {
                var animationCache = this._animation.animationState.animationCache;
                if (animationCache) {
                    animationCache.addFrame(this._cacheFrameIndex, this);
                }
            }
			
			while(this._eventList.length > 0){
				this.dispatchEvent(this._eventList.shift());
            }

            this._lockDispose = false;
            if (this._delayDispose) {
                this.dispose();
            }
        }

		/**
		 * 开启动画缓存
		 * @param  {number} 帧速率，每秒缓存多少次数据，越大越流畅,若值小于零会被设置为动画数据中的默认帧率
		 * @param  {Array<any>} 需要缓存的动画列表，如果为null，则全部动画都缓存
		 * @param  {boolean} 动画是否是循环动画，仅在3.0以下的数据格式使用，如果动画不是循环动画请设置为false，默认为true。
		 * @return {AnimationCacheManager}  返回缓存管理器，可以绑定到其他armature以减少内存
		 */
        public enableAnimationCache(frameRate: number, animationList: Array<any> = null, loop: boolean = true): AnimationCacheManager{
        
            // Modify Fast mode by duanchunlei
            var animationCacheManager: AnimationCacheManager = this._armatureData._cacheManager;
            if (animationCacheManager) {
                //animationCacheManager.bindCacheUserArmature(this);
                this.enableCache = true;
                return animationCacheManager;
            }

            this._armatureData._cacheManager = animationCacheManager = AnimationCacheManager.initWithArmatureData(this.armatureData, frameRate);
			/*if(animationList){
				var length:number = animationList.length;
				for(var i:number = 0;i < length;i++){
					var animationName:string = animationList[i];
					animationCacheManager.initAnimationCache(animationName);
				}
			}*/
			//else{
				animationCacheManager.initAllAnimationCache();
            //}

			//animationCacheManager.setCacheGeneratorArmature(this);
			//animationCacheManager.generateAllAnimationCache(loop);
			
			//animationCacheManager.bindCacheUserArmature(this);
			this.enableCache = true;
			return animationCacheManager;
		}

		/**
		 * 获取指定名称的 Bone
		 * @param boneName {string} Bone名称
		 * @returns {FastBone}
		 */
		public getBone(boneName:string):FastBone
		{
			return this._boneDic[boneName];
		}
		/**
		 * 获取指定名称的 Slot
		 * @param slotName {string} Slot名称
		 * @returns {FastSlot}
		 */
		public getSlot(slotName:string):FastSlot
		{
			return this._slotDic[slotName];
		}

		/**
		 * 获取包含指定显示对象的 Bone
		 * @param display {any} 显示对象实例
		 * @returns {FastBone}
		 */
		public getBoneByDisplay(display:any):FastBone
		{
			var slot:FastSlot = this.getSlotByDisplay(display);
			return slot?slot.parent:null;
		}

		/**
		 * 获取包含指定显示对象的 Slot
		 * @param displayObj {any} 显示对象实例
		 * @returns {FastSlot}
		 */
		public getSlotByDisplay(displayObj:any):FastSlot
		{
			if(displayObj)
			{
				for(var i:number = 0,len:number = this.slotList.length; i < len; i++)
				{
					if(this.slotList[i].display == displayObj)
					{
						return this.slotList[i];
					}
				}
			}
			return null;
		}

		/**
		 * 获取骨架包含的所有插槽
		 * @param returnCopy {boolean} 是否返回拷贝。默认：true
		 * @returns {FastSlot[]}
		 */
		public getSlots(returnCopy:boolean = true):Array<FastSlot>
		{
			return returnCopy?this.slotList.concat():this.slotList;
		}

		public _updateBonesByCache():void{
			var i:number = this.boneList.length;
			var bone:FastBone;
			while(i --){
				bone = this.boneList[i];
				bone.update();
			}
		}


		/**
		 * 在骨架中为指定名称的 FastBone 添加一个子 FastBone.
		 * 和Armature不同,FastArmature的这个方法不能在运行时动态添加骨骼
		 * @param bone {FastBone} FastBone 实例
		 * @param parentName {string} 父骨头名称 默认：null
		 */
		public addBone(bone:FastBone, parentName:string = null):void{
			var parentBone:FastBone;
			if(parentName){
				parentBone = this.getBone(parentName);
				parentBone.boneList.push(bone);
			}
			bone.armature = this;
			bone.parentBoneData = parentBone;
			this.boneList.unshift(bone);
            this._boneDic[bone.name] = bone;
		}

		/**
		 * 为指定名称的 FastBone 添加一个子 FastSlot.
		 * 和Armature不同,FastArmature的这个方法不能在运行时动态添加插槽
		 * @param slot {FastSlot} FastSlot 实例
		 * @param boneName {string}
		 * @see dragonBones.Bone
		 */
		public addSlot(slot:FastSlot, parentBoneName:string):void{
			var bone:FastBone = this.getBone(parentBoneName);
			if(bone){
				slot.armature = this;
				slot.setParent(bone);
				bone.slotList.push(slot);
				slot._addDisplayToContainer(this.display);
				this.slotList.push(slot);
				this._slotDic[slot.name] = slot;
				if(slot.hasChildArmature){
					this.slotHasChildArmatureList.push(slot);
				}
			}
			else{
				throw new Error();
			}
		}

		/**
		 * 按照显示层级为所有 Slot 排序
		 */
		public updateSlotsZOrder():void{
			this.slotList.sort(this.sortSlot);
			var i:number = this.slotList.length;
			while(i --){
				var slot:FastSlot = this.slotList[i];
				slot._addDisplayToContainer(this._display);
			}
			
			this._slotsZOrderChanged = false;
		}
		
		private sortBoneList():void{
			var i:number = this.boneList.length;
			if(i == 0){
				return;
			}
			var helpArray:Array<any> = [];
			while(i --){
				var level:number = 0;
				var bone:FastBone = this.boneList[i];
				var boneParent:FastBone = bone;
				while(boneParent){
					level ++;
					boneParent = boneParent.parent;
				}
				helpArray[i] = [level, bone];
			}
			
			helpArray.sort(ArmatureData.sortBoneDataHelpArrayDescending);
			
			i = helpArray.length;
			
			while(i --){
				this.boneList[i] = helpArray[i][1];
			}
			
			helpArray.length = 0;
		}
		
		/** @private When AnimationState enter a key frame, call this func*/
        public arriveAtFrame(frame: Frame, animationState: FastAnimationState): void{
			if(frame.event && this.hasEventListener(FrameEvent.ANIMATION_FRAME_EVENT)){
				var frameEvent:FrameEvent = new FrameEvent(FrameEvent.ANIMATION_FRAME_EVENT);
				frameEvent.animationState = animationState;
                frameEvent.frameLabel = frame.event;
                frameEvent.bone = frame.bone? this.getBone(frame.bone): null;
				this._addEvent(frameEvent);
			}

			if(frame.action){
				this.animation.gotoAndPlay(frame.action);
			}
		}
		
		public invalidUpdate(boneName:string = null):void
		{
			if(boneName)
			{
				var bone:FastBone = this.getBone(boneName);
				if(bone)
				{
					bone.invalidUpdate();
				}
			}
			else
			{
				var i:number = this.boneList.length;
				while(i --)
				{
					this.boneList[i].invalidUpdate();
				}
			}
		}

		public resetAnimation():void{
			this.animation.animationState._resetTimelineStateList();
			var length:number = this.boneList.length;
			for(var i:number = 0;i < length;i++){
				var boneItem:FastBone = this.boneList[i];
				boneItem._timelineState = null;
			}
			this.animation.stop();
		}
		
		private sortSlot(slot1:FastSlot, slot2:FastSlot):number{
			return slot1.zOrder < slot2.zOrder?1: -1;
		}

		/**
		 * 获取FastAnimation实例
		 * @returns {any} FastAnimation实例
		 */
		public getAnimation():any
		{
			return this._animation;
		}

		/**
		 * ArmatureData.
		 * @see dragonBones.ArmatureData.
		 */
		public get armatureData():ArmatureData{
			return this._armatureData;
		}
		
		/**
		 * An Animation instance
		 * @see dragonBones.Animation
		 */
		public get animation():FastAnimation{
			return this._animation;
		}
		
		/**
		 * Armature's display object. It's instance type depends on render engine. For example "flash.display.DisplayObject" or "startling.display.DisplayObject"
		 */
		public get display():any{
			return this._display;
		}

		public get enableCache():boolean
		{
			return this._enableCache;
		}
		public set enableCache(value:boolean)
		{
			this._enableCache = value;
		}
		
		public get enableEventDispatch():boolean
		{
			return this._enableEventDispatch;
		}
		public set enableEventDispatch(value:boolean)
		{
			this._enableEventDispatch = value;
		}
		
		public _addEvent(event:Event):void
		{
			if (this._enableEventDispatch)
			{
				this._eventList.push(event);
			}			
		}
        
        public getIKs(returnCopy:boolean = true):Array<FastIKConstraint>
		{
			return returnCopy ? this._ikList.concat(): this._ikList;
		}
		
		public buildIK():void
		{
			var ikConstraintData:IKData;
			this._ikList.length = 0;
			for (var i:number = 0, len:number = this._armatureData.ikDataList.length; i < len; i++)
			{
				ikConstraintData = this._armatureData.ikDataList[i];
				this._ikList.push(new FastIKConstraint(ikConstraintData, this));
			}
		}
		
		public updateBoneCache():void
		{
			this.boneList.reverse();
			var temp:any = { };
			var ikConstraintsCount:number = this._ikList.length;
			var arrayCount:number = ikConstraintsCount + 1;
			var i:number;
			var len:number;
			var j:number;
			var jLen:number;
			var bone:FastBone;
			var currentBone:FastBone;
			
			this._boneIKList = [];
			while (this._boneIKList.length < arrayCount)
			{
				this._boneIKList[this._boneIKList.length] = [];
			}
			
			temp[this.boneList[0].name] = 0;
			for (i = 0, len = this._ikList.length; i < len; i++) 
			{
				temp[this._ikList[i].bones[0].name] = i+1;
			}
			next:
			for (i = 0, len = this.boneList.length; i < len; i++)
			{
				bone = this.boneList[i];
				currentBone = bone;
				while (currentBone)
				{
                    if(currentBone.parent == null)
                    {
                        temp[currentBone.name] = 0;
                    }
					if (temp.hasOwnProperty(currentBone.name))
					{
						this._boneIKList[temp[currentBone.name]].push(bone);
						continue next;
					}
					currentBone = currentBone.parent;
				}
			}
		}
		
		public getIKTargetData(bone:FastBone):Array<FastIKConstraint>
		{
			var target:Array<FastIKConstraint> = [];
			var ik:FastIKConstraint; 
			for (var i:number = 0, len:number = this._ikList.length; i < len; i++)
			{
				ik = this._ikList[i];
				if(bone.name == ik.target.name){
					target.push(ik);
				}
			}
			return target;
		}
	}
}