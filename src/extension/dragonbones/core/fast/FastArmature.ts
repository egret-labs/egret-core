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

	export class FastArmature extends EventDispatcher implements IAnimatable{
		/**
		 * The name should be same with ArmatureData's name
		 */
		public name:string;
		/**
		 * An object that can contain any user extra data.
		 */
		public userData:any;
		
		
		public enableCache:boolean;
		
		/**
		 * 保证CacheManager是独占的前提下可以开启，开启后有助于性能提高
		 */
		public isCacheManagerExclusive:boolean = false;
		
		/** @private */
		public _animation:FastAnimation;
		
		/** @private */
		public _display:any;
		
		/** @private Store bones based on bones' hierarchy (From root to leaf)*/
		public boneList:Array<FastBone>;
		public _boneDic:any;
		
		/** @private Store slots based on slots' zOrder*/
		public slotList:Array<FastSlot>;
		public _slotDic:any;
		
		public slotHasChildArmatureList:Array<FastSlot>;
		
		public __dragonBonesData:DragonBonesData;
		public _armatureData:ArmatureData;
		public _slotsZOrderChanged:boolean;
		public _eventList:Array<any>;
		public _disableEventDispatch:boolean;
		public _cacheLoop:boolean;
		
		private _delayDispose:boolean;
		private _lockDispose:boolean;
		private useCache:boolean = true;
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
			
			this.slotList.length = 0;
			this.boneList.length = 0;
			
			this._armatureData = null;
			this._animation = null;
			this.slotList = null;
			this.boneList = null;
			this._eventList = null;
			
		}
		
		/**
		 * Update the animation using this method typically in an ENTERFRAME Event or with a Timer.
		 * @param The amount of second to move the playhead ahead.
		 */
		
		public advanceTime(passedTime:number):void{
			this._lockDispose = true;
			this._animation.advanceTime(passedTime, this._cacheLoop);
			
			var bone:FastBone;
			var slot:FastSlot;
			var i:number = 0;
			if(this._animation.animationState.isUseCache()){
				if(!this.useCache){
					this.useCache = true;
				}
				i = this.slotList.length;
				while(i --){
					slot = this.slotList[i];
					slot.updateByCache();
				}
			}
			else{
				if(this.useCache){
					this.useCache = false;
					i = this.slotList.length;
					while(i --){
						slot = this.slotList[i];
						slot.switchTransformToBackup();
					}
				}
				
				i = this.boneList.length;
				while(i --){
					bone = this.boneList[i];
					bone.update();
				}
				
				i = this.slotList.length;
				while(i --){
					slot = this.slotList[i];
					slot._update();
				}
			}
			
			i = this.slotHasChildArmatureList.length;
			while(i--){
				slot = this.slotList[i];
				var childArmature:FastArmature = slot.childArmature;
				if(childArmature){
					childArmature.advanceTime(passedTime);
				}
			}
			
			if(this._slotsZOrderChanged){
				this.updateSlotsZOrder();
			}
			
			while(this._eventList.length > 0 && !this._disableEventDispatch){
				this.dispatchEvent(this._eventList.shift());
			}
			
			this._lockDispose = false;
			if(this._delayDispose){
				this.dispose();
			}
		}

		public enableAnimationCache(frameRate:number, animationList:Array<any> = null, loop:boolean = true):AnimationCacheManager{
			var animationCacheManager:AnimationCacheManager = AnimationCacheManager.initWithArmatureData(this.armatureData,frameRate);
			if(animationList){
				var length:number = animationList.length;
				for(var i:number = 0;i < length;i++){
					var animationName:string = animationList[i];
					animationCacheManager.initAnimationCache(animationName);
				}
			}
			else{
				animationCacheManager.initAllAnimationCache();
			}
			animationCacheManager.setCacheGeneratorArmature(this);
			animationCacheManager.generateAllAnimationCache(loop);
			
			animationCacheManager.bindCacheUserArmature(this);
			this.enableCache = true;
			return animationCacheManager;
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
		 * Add a Bone instance to this Armature instance.
		 * @param A Bone instance.
		 * @param (optional) The parent's name of this Bone instance.
		 * @see dragonBones.Bone
		 */
		public addBone(bone:FastBone, parentName:string = null):void{
			var parentBone:FastBone;
			if(parentName){
				parentBone = this.getBone(parentName);
			}
			bone.armature = this;
			bone.setParent(parentBone);
			this.boneList.unshift(bone);
			this._boneDic[bone.name] = bone;
		}
		
		/**
		 * Add a slot to a bone as child.
		 * @param slot A Slot instance
		 * @param boneName bone name
		 * @see dragonBones.core.DBObject
		 */
		public addSlot(slot:FastSlot, parentBoneName:string):void{
			var bone:FastBone = this.getBone(parentBoneName);
			if(bone){
				slot.armature = this;
				slot.setParent(bone);
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
		 * Sort all slots based on zOrder
		 */
		public updateSlotsZOrder():void{
			this.slotList.sort(this.sortSlot);
			var i:number = this.slotList.length;
			while(i --){
				var slot:FastSlot = this.slotList[i];
				if (slot._frameCache && (<SlotFrameCache><any> (slot._frameCache)).displayIndex >= 0){
					slot._addDisplayToContainer(this._display);
				}
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
		public arriveAtFrame(frame:Frame, animationState:FastAnimationState):void{
			if(frame.event && this.hasEventListener(FrameEvent.ANIMATION_FRAME_EVENT)){
				var frameEvent:FrameEvent = new FrameEvent(FrameEvent.ANIMATION_FRAME_EVENT);
				frameEvent.animationState = animationState;
				frameEvent.frameLabel = frame.event;
				this._eventList.push(frameEvent);
			}

			if(frame.action){
				this.animation.gotoAndPlay(frame.action);
			}
		}
		
		public resetAnimation():void{
			this.animation.animationState.resetTimelineStateList();
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
		 * ArmatureData.
		 * @see dragonBones.objects.ArmatureData.
		 */
		public get armatureData():ArmatureData{
			return this._armatureData;
		}
		
		/**
		 * An Animation instance
		 * @see dragonBones.animation.Animation
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
		
		
		public getBone(boneName:string):FastBone{
			return this._boneDic[boneName];
		}
		public getSlot(slotName:string):FastSlot{
			return this._slotDic[slotName];
		}
	}
}