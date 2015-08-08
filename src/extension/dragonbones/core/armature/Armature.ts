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
     * @class dragonBones.Armature
     * @classdesc
     * Armature 是 DragonBones 骨骼动画系统的核心。他包含需要加到场景的显示对象，所有的骨骼逻辑和动画系统
     * A Armature instance is the core of the skeleton animation system. It contains the object to display, all sub-bones and the object animation(s).
     * @extends dragonBones.EventDispatcher
     * @see dragonBones.ArmatureData
     * @example
     * <pre>
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
		//把它添加到舞台上
		this.addChild(armatureDisplay);
		//取得这个Armature动画列表中的第一个动画的名字
		var curAnimationName = armature.animation.animationList[0];
		//播放这个动画，gotoAndPlay参数说明,具体详见Animation类
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
	export class Armature extends EventDispatcher implements IAnimatable{
		public __dragonBonesData:DragonBonesData;
		
		
		/**
		 * The instance dispatch sound event.
		 */
		private static _soundManager:SoundEventManager = SoundEventManager.getInstance();

        /**
         * 骨架名。
         * 骨架名一般等于 ArmatureData 的名字
         * 默认值：true。
         * @member {string} dragonBones.Armature#name
         */
		public name:string;

        /**
         * 存储额外的用户数据。
         * @member {any} dragonBones.Armature#userData
         */
		public userData:any;

		/** @private Set it to true when slot's zorder changed*/
		public _slotsZOrderChanged:boolean;
		
		/** @private Store event needed to dispatch in current frame. When advanceTime execute complete, dispath them.*/
		public _eventList:Array<Event>;
		
		
		/** @private Store slots based on slots' zOrder*/
		public _slotList:Array<Slot>;
		
		/** @private Store bones based on bones' hierarchy (From root to leaf)*/
		public _boneList:Array<Bone>;
		
		private _delayDispose:boolean;
		private _lockDispose:boolean;
		
		/** @private */
		public _armatureData:ArmatureData;

        /**
         * 骨架数据。
         * @member {ArmatureData} dragonBones.Armature#armatureData
         */
		public get armatureData():ArmatureData{
			return this._armatureData;
		}

		/** @private */
		public _display:any;

        /**
         * 骨架显示对象。骨架创建出来后，需要把该显示对象加到场景中才能显示骨架。
         * 使用根据不同的渲染引擎，显示对象的类型可能不同。
         * @member {any} dragonBones.Armature#display
         */
		public get display():any{
			return this._display;
		}

        /**
         * 不推荐的API,使用 display 属性代替。
         */
        public getDisplay():any
        {
            return this._display;
        }

		/** @private */
		public _animation:Animation;

        /**
         * 骨架的动画实例。
         * @member {Animation} dragonBones.Armature#animation
         */
		public get animation():Animation{
			return this._animation;
		}

		public constructor(display:any){
			super();
			this._display = display;
			
			this._animation = new Animation(this);
			
			this._slotsZOrderChanged = false;
			
			this._slotList = [];
			this._boneList = [];
			this._eventList = [];
			
			this._delayDispose = false;
			this._lockDispose = false;
			
			this._armatureData = null;
		}

        /**
         * 清理骨架实例
         */
		public dispose():void{
			this._delayDispose = true;
			if(!this._animation || this._lockDispose){
				return;
			}
			
			this.userData = null;
			
			this._animation.dispose();
			var i:number = this._slotList.length;
			while(i --){
				this._slotList[i].dispose();
			}
			i = this._boneList.length;
			while(i --){
				this._boneList[i].dispose();
			}

			this._armatureData = null;
			this._animation = null;
			this._slotList = null;
			this._boneList = null;
			this._eventList = null;
			
			//_display = null;
		}

        /**
         * 在下一帧强制更新指定名称的 Bone 及其包含的所有 Slot 的动画。
         * @param boneName {string} 骨头名。 默认值：null，相当于更新所有骨头。
         */
		public invalidUpdate(boneName:string = null):void{
			if(boneName){
				var bone:Bone = this.getBone(boneName);
				if(bone){
					bone.invalidUpdate();
				}
			}
			else{
				var i:number = this._boneList.length;
				while(i --){
					this._boneList[i].invalidUpdate();
				}
			}
		}

        /**
         * 使用这个方法更新动画状态。一般来说，这个方法需要在 ENTERFRAME 事件的响应函数中被调用
         * @param passedTime 动画向前播放的时间（单位：秒）
         */
		public advanceTime(passedTime:number):void{
			this._lockDispose = true;
			
			this._animation._advanceTime(passedTime);
			
			passedTime *= this._animation.timeScale;    //_animation's time scale will impact childArmature
			
			var isFading:boolean = this._animation._isFading;

			var i:number = this._boneList.length;
			while(i --){
				var bone:Bone = this._boneList[i];
				bone._update(isFading);
			}
			
			i = this._slotList.length;
			while(i --){
				var slot:Slot = this._slotList[i];
				slot._update();
				if(slot._isShowDisplay){
					var childArmature:Armature = slot.childArmature;
					if(childArmature){
						childArmature.advanceTime(passedTime);
					}
				}
			}
			
			if(this._slotsZOrderChanged){
				this.updateSlotsZOrder();
				
				if(this.hasEventListener(ArmatureEvent.Z_ORDER_UPDATED)){
					this.dispatchEvent(new ArmatureEvent(ArmatureEvent.Z_ORDER_UPDATED));
				}
			}
			
			if(this._eventList.length > 0){
                for(var i:number = 0,len:number = this._eventList.length; i< len; i++)
                {
                    var event:Event = this._eventList[i];
                    this.dispatchEvent(event);
                }
				this._eventList.length = 0;
			}
			
			this._lockDispose = false;
			if(this._delayDispose){
				this.dispose();
			}
		}

		public resetAnimation():void
		{
			this.animation.stop();
			this.animation._resetAnimationStateList();
			
			for(var i:number = 0,len:number = this._boneList.length; i < len; i++)
			{
				this._boneList[i]._removeAllStates();
			}
		}

        /**
         * 获取骨架包含的所有插槽
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {Slot[]}
         */
		public getSlots(returnCopy:boolean = true):Array<Slot>{
			return returnCopy?this._slotList.concat():this._slotList;
		}

        /**
         * 获取指定名称的 Slot
         * @param slotName {string} Slot名称
         * @returns {Slot}
         */
		public getSlot(slotName:string):Slot{
			var length:number = this._slotList.length;
			for(var i:number = 0;i < length;i++){
				var slot:Slot = this._slotList[i];
				if(slot.name == slotName){
					return slot;
				}
			}
			return null;
		}

        /**
         * 获取包含指定显示对象的 Slot
         * @param displayObj {any} 显示对象实例
         * @returns {Slot}
         */
		public getSlotByDisplay(displayObj:any):Slot{
			if(displayObj){
				var length:number = this._slotList.length;
				for(var i:number = 0;i < length;i++){
					var slot:Slot = this._slotList[i];
					if(slot.display == displayObj){
						return slot;
					}
				}
			}
			return null;
		}

        /**
         * 为指定名称的 Bone 添加一个子 Slot
         * @param slot {Slot} Slot 实例
         * @param boneName {string}
         * @see dragonBones.Bone
         */
		public addSlot(slot:Slot, boneName:string):void{
			var bone:Bone = this.getBone(boneName);
			if (bone){
				bone.addSlot(slot);
			}
			else{
				throw new Error();
			}
		}

        /**
         * 移除指定的Slot
         * @param slot {Slot} Slot 实例
         */
		public removeSlot(slot:Slot):void{
			if(!slot || slot.armature != this){
				throw new Error();
			}
			
			slot.parent.removeSlot(slot);
		}

        /**
         * 移除指定名称的Slot
         * @param slotName {string} Slot 名称
         * @returns {Slot} 被成功移除的 Slot 实例
         */
		public removeSlotByName(slotName:string):Slot{
			var slot:Slot = this.getSlot(slotName);
			if(slot){
				this.removeSlot(slot);
			}
			return slot;
		}

        /**
         * 获取骨架包含的所有Bone
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {Bone[]}
         */
		public getBones(returnCopy:boolean = true):Array<Bone>{
			return returnCopy?this._boneList.concat():this._boneList;
		}

        /**
         * 获取指定名称的 Bone
         * @param boneName {string} Bone名称
         * @returns {Bone}
         */
		public getBone(boneName:string):Bone{
			var length:number = this._boneList.length;
			for(var i:number = 0;i < length;i++){
				var bone:Bone = this._boneList[i];
				if(bone.name == boneName){
					return bone;
				}
			}
			return null;
		}

        /**
         * 获取包含指定显示对象的 Bone
         * @param display {any} 显示对象实例
         * @returns {Bone}
         */
		public getBoneByDisplay(display:any):Bone{
			var slot:Slot = this.getSlotByDisplay(display);
			return slot?slot.parent:null;
		}

        /**
         * 在骨架中为指定名称的 Bone 添加一个子 Bone
         * @param bone {Bone} Bone 实例
         * @param parentName {string} 父骨头名称 默认：null
         * @param updateLater {boolean} 是否延迟更新 默认：false，当需要一次添加很多Bone时，开启延迟更新能够提高效率
         */
		public addBone(bone:Bone, parentName:string = null, updateLater:boolean = false):void{
			var parentBone:Bone;
			if(parentName){
				parentBone = this.getBone(parentName);
				if (!parentBone){
					throw new Error();
				}
			}
			
			if(parentBone){
				parentBone.addChildBone(bone, updateLater);
			}
			else{
				if(bone.parent){
					bone.parent.removeChildBone(bone, updateLater);
				}
				bone._setArmature(this);
                if(!updateLater)
                {
                    this._updateAnimationAfterBoneListChanged();
                }
			}
		}



        /**
         * 移除指定的 Bone
         * @param bone {Bone} Bone 实例
         * @param updateLater {boolean} 是否延迟更新 默认：false，当需要一次移除很多Bone时，开启延迟更新能够提高效率
         */
		public removeBone(bone:Bone, updateLater:boolean = false):void{
			if(!bone || bone.armature != this){
				throw new Error();
			}
			
			if(bone.parent){
				bone.parent.removeChildBone(bone, updateLater);
			}
			else{
				bone._setArmature(null);
                if(!updateLater)
                {
                    this._updateAnimationAfterBoneListChanged(false);
                }
			}
		}

        /**
         * 移除指定名称的 Bone
         * @param boneName {string} Bone 名称
         * @returns {Bone} 被成功移除的 Bone 实例
         */
		public removeBoneByName(boneName:string):Bone{
			var bone:Bone = this.getBone(boneName);
			if(bone){
				this.removeBone(bone);
			}
			return bone;
		}
		
		/** @private */
		public _addBoneToBoneList(bone:Bone):void{
			if(this._boneList.indexOf(bone) < 0){
				this._boneList[this._boneList.length] = bone;
			}
		}
		
		/** @private */
		public _removeBoneFromBoneList(bone:Bone):void{
			var index:number = this._boneList.indexOf(bone);
			if(index >= 0){
				this._boneList.splice(index, 1);
			}
		}
		
		/** @private */
		public _addSlotToSlotList(slot:Slot):void{
			if(this._slotList.indexOf(slot) < 0){
				this._slotList[this._slotList.length] = slot;
			}
		}
		
		/** @private */
		public _removeSlotFromSlotList(slot:Slot):void{
			var index:number = this._slotList.indexOf(slot);
			if(index >= 0){
				this._slotList.splice(index, 1);
			}
		}
		
		/**
		 * 按照显示层级为所有 Slot 排序
		 */
		public updateSlotsZOrder():void{
			this._slotList.sort(this.sortSlot);
			var i:number = this._slotList.length;
			while(i --){
				var slot:Slot = this._slotList[i];
				if(slot._isShowDisplay){
					//_display 实际上是container, 这个方法就是把原来的显示对象放到container中的第一个
					slot._addDisplayToContainer(this._display);
				}
			}
			
			this._slotsZOrderChanged = false;
		}

		public _updateAnimationAfterBoneListChanged(ifNeedSortBoneList:boolean = true):void{
			if(ifNeedSortBoneList){
				this.sortBoneList();
			}
			this._animation._updateAnimationStates();
		}
		
		private sortBoneList():void{
			var i:number = this._boneList.length;
			if(i == 0){
				return;
			}
			var helpArray:Array<any> = [];
			while(i --){
				var level:number = 0;
				var bone:Bone = this._boneList[i];
				var boneParent:Bone = bone;
				while(boneParent){
					level ++;
					boneParent = boneParent.parent;
				}
				helpArray[i] = [level, bone];
			}
			
			helpArray.sort(ArmatureData.sortBoneDataHelpArrayDescending);
			
			i = helpArray.length;

			while(i --){
				this._boneList[i] = helpArray[i][1];
			}
			
			helpArray.length = 0;
		}

		/** @private When AnimationState enter a key frame, call this func*/
		public _arriveAtFrame(frame:Frame, timelineState:TimelineState, animationState:AnimationState, isCross:boolean):void{
			if(frame.event && this.hasEventListener(FrameEvent.ANIMATION_FRAME_EVENT)){
				var frameEvent:FrameEvent = new FrameEvent(FrameEvent.ANIMATION_FRAME_EVENT);
				frameEvent.animationState = animationState;
				frameEvent.frameLabel = frame.event;
				this._eventList.push(frameEvent);
			}
			
			if(frame.sound && Armature._soundManager.hasEventListener(SoundEvent.SOUND))
			{
				var soundEvent:SoundEvent = new SoundEvent(SoundEvent.SOUND);
				soundEvent.armature = this;
				soundEvent.animationState = animationState;
				soundEvent.sound = frame.sound;
				Armature._soundManager.dispatchEvent(soundEvent);
			}
			
			//[TODO]currently there is only gotoAndPlay belongs to frame action. In future, there will be more.  
			//后续会扩展更多的action，目前只有gotoAndPlay的含义
			if(frame.action){
				if(animationState.displayControl){
					this.animation.gotoAndPlay(frame.action);
				}
			}
		}

		private sortSlot(slot1:Slot, slot2:Slot):number{
			return slot1.zOrder < slot2.zOrder?1: -1;
		}

		/**
		 * 获取Animation实例
		 * @returns {any} Animation实例
		 */
		public getAnimation():any
		{
			return this._animation;
		}

	}
}