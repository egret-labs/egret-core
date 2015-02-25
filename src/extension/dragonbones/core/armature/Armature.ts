/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module dragonBones {

    /**
     * @class dragonBones.Armature
     * @classdesc
     * Armature 是 DragonBones 骨骼动画系统的核心。他包含需要加到场景的显示对象，所有的骨骼逻辑和动画系统
     * A Armature instance is the core of the skeleton animation system. It contains the object to display, all sub-bones and the object animation(s).
     * @extends dragonBones.EventDispatcher
     */

	export class Armature extends EventDispatcher implements IAnimatable{
		public __dragonBonesData:DragonBonesData;
		
		
		/**
		 * The instance dispatch sound event.
		 */
		//private static const _soundManager:SoundEventManager = SoundEventManager.getInstance();

		/**
		 * The name should be same with ArmatureData's name
		 */
		public name:string;

		/**
		 * An object that can contain any user extra data.
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
		 * ArmatureData.
		 * @see dragonBones.objects.ArmatureData.
		 */
		public get armatureData():ArmatureData{
			return this._armatureData;
		}

		/** @private */
		public _display:any;
		/**
		 * Armature's display object. It's instance type depends on render engine. For example "flash.display.DisplayObject" or "startling.display.DisplayObject"
		 */
		public get display():any{
			return this._display;
		}

        /**
         * Unrecommended API. Please use .display instead.
         * @returns {any}
         */
        public getDisplay():any
        {
            return this._display;
        }

		/** @private */
		public _animation:Animation;
		/**
		 * An Animation instance
		 * @see dragonBones.animation.Animation
		 */
		public get animation():Animation{
			return this._animation;
		}

		/**
		 * Creates a Armature blank instance.
		 * @param Instance type of this object varies from flash.display.DisplayObject to startling.display.DisplayObject and subclasses.
		 * @see #display
		 */
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
		 * Cleans up any resources used by this instance.
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
		 * Force update bones and slots. (When bone's animation play complete, it will not update) 
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
		 * Update the animation using this method typically in an ENTERFRAME Event or with a Timer.
		 * @param The amount of second to move the playhead ahead.
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
                for(var key in this._eventList)
                {
                    var event:Event = this._eventList[key];
                    this.dispatchEvent(event);
                }
				this._eventList.length = 0;
			}
			
			this._lockDispose = false;
			if(this._delayDispose){
				this.dispose();
			}
		}

		/**
		 * Get all Slot instance associated with this armature.
		 * @param if return Vector copy
		 * @return A Vector.&lt;Slot&gt; instance.
		 * @see dragonBones.Slot
		 */
		public getSlots(returnCopy:boolean = true):Array<Slot>{
			return returnCopy?this._slotList.concat():this._slotList;
		}

		/**
		 * Retrieves a Slot by name
		 * @param The name of the Bone to retrieve.
		 * @return A Slot instance or null if no Slot with that name exist.
		 * @see dragonBones.Slot
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
		 * Gets the Slot associated with this DisplayObject.
		 * @param Instance type of this object varies from flash.display.DisplayObject to startling.display.DisplayObject and subclasses.
		 * @return A Slot instance or null if no Slot with that DisplayObject exist.
		 * @see dragonBones.Slot
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
		 * Add a slot to a bone as child.
		 * @param slot A Slot instance
		 * @param boneName bone name
		 * @see dragonBones.core.DBObject
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
		 * Remove a Slot instance from this Armature instance.
		 * @param The Slot instance to remove.
		 * @see dragonBones.Slot
		 */
		public removeSlot(slot:Slot):void{
			if(!slot || slot.armature != this){
				throw new Error();
			}
			
			slot.parent.removeSlot(slot);
		}

		/**
		 * Remove a Slot instance from this Armature instance.
		 * @param The name of the Slot instance to remove.
		 * @see dragonBones.Slot
		 */
		public removeSlotByName(slotName:string):Slot{
			var slot:Slot = this.getSlot(slotName);
			if(slot){
				this.removeSlot(slot);
			}
			return slot;
		}
		
		/**
		 * Get all Bone instance associated with this armature.
		 * @param if return Vector copy
		 * @return A Vector.&lt;Bone&gt; instance.
		 * @see dragonBones.Bone
		 */
		public getBones(returnCopy:boolean = true):Array<Bone>{
			return returnCopy?this._boneList.concat():this._boneList;
		}

		/**
		 * Retrieves a Bone by name
		 * @param The name of the Bone to retrieve.
		 * @return A Bone instance or null if no Bone with that name exist.
		 * @see dragonBones.Bone
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
		 * Gets the Bone associated with this DisplayObject.
		 * @param Instance type of this object varies from flash.display.DisplayObject to startling.display.DisplayObject and subclasses.
		 * @return A Bone instance or null if no Bone with that DisplayObject exist..
		 * @see dragonBones.Bone
		 */
		public getBoneByDisplay(display:any):Bone{
			var slot:Slot = this.getSlotByDisplay(display);
			return slot?slot.parent:null;
		}
		
		/**
		 * Add a Bone instance to this Armature instance.
		 * @param A Bone instance.
		 * @param (optional) The parent's name of this Bone instance.
		 * @see dragonBones.Bone
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
		 * Remove a Bone instance from this Armature instance.
		 * @param The Bone instance to remove.
		 * @see	dragonBones.Bone
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
		 * Remove a Bone instance from this Armature instance.
		 * @param The name of the Bone instance to remove.
		 * @see dragonBones.Bone
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
		 * Sort all slots based on zOrder
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
			/*
			if(frame.sound && _soundManager.hasEventListener(SoundEvent.SOUND))
			{
				var soundEvent:SoundEvent = new SoundEvent(SoundEvent.SOUND);
				soundEvent.armature = this;
				soundEvent.animationState = animationState;
				soundEvent.sound = frame.sound;
				_soundManager.dispatchEvent(soundEvent);
			}
			*/
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

	}
}