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

	export class Bone extends DBObject{
		public static initWithBoneData(boneData:BoneData):Bone{
			var outputBone:Bone = new Bone();
			
			outputBone.name = boneData.name;
			outputBone.inheritRotation = boneData.inheritRotation;
			outputBone.inheritScale = boneData.inheritScale;
			outputBone.origin.copy(boneData.transform);
			
			return outputBone;
		}
		
		/**
		 * AnimationState that slots belong to the bone will be controlled by.
		 * Sometimes, we want slots controlled by a spedific animation state when animation is doing mix or addition.
		 */
		public displayController:string;
		
		/** @private */
		public _boneList:Array<Bone>;
		
		/** @private */
		public _slotList:Array<Slot>;
		
		/** @private */
		public _timelineStateList:Array<TimelineState>;
		
		/**
		 * AnimationState that slots belong to the bone will be controlled by.
		 * Sometimes, we want slots controlled by a spedific animation state when animation is doing mix or addition.
		 */
		//public var displayController:String;
		
		/** @private */
		public _tween:DBTransform;
		
		/** @private */
		public _tweenPivot:Point;
		
		/** @private */
		public _needUpdate:number = 0;
		
		/** @private */
		public _isColorChanged:boolean;
		
		public constructor(){
			super();
			
			this._tween = new DBTransform();
			this._tweenPivot = new Point();
			this._tween.scaleX = this._tween.scaleY = 0;
			
			this._boneList = [];
			this._slotList = [];
			this._timelineStateList = [];
			
			this._needUpdate = 2;
			this._isColorChanged = false;
			
			this.inheritRotation = true;
			this.inheritScale = false;
		}
		
		/**
		 * @inheritDoc
		 */
		public dispose():void{
			if(!this._boneList){
				return;
			}
			
			super.dispose();
			var i:number = this._boneList.length;
			while(i --){
				this._boneList[i].dispose();
			}
			
			i = this._slotList.length;
			while(i --){
				this._slotList[i].dispose();
			}

			this._tween = null;
			this._tweenPivot = null;
			this._boneList = null;
			this._slotList = null;
			this._timelineStateList = null;
		}
		
//骨架装配
		/**
		 * If contains some bone or slot
		 * @param Slot or Bone instance
		 * @return Boolean
		 * @see dragonBones.core.DBObject
		 */
		public contains(child:DBObject):boolean{
			if(!child){
				throw new Error();
			}
			if(child == this){
				return false;
			}
			var ancestor:DBObject = child;
			while(!(ancestor == this || ancestor == null)){
				ancestor = ancestor.parent;
			}
			return ancestor == this;
		}
		
		public addChildBone(childBone:Bone, updateLater:boolean = false):void{
			if(!childBone){
				throw new Error();
			}
			
			if(childBone == this || childBone.contains(this)){
				throw new Error("An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)");
			}
			
			if(childBone.parent == this){
				return;
			}
			
			if(childBone.parent){
				childBone.parent.removeChildBone(childBone, updateLater);
			}

			this._boneList[this._boneList.length] = childBone;
			childBone._setParent(this);
			childBone._setArmature(this._armature);
			
			if(this._armature && !updateLater){
				this._armature._updateAnimationAfterBoneListChanged();
			}
		}
		
		public removeChildBone(childBone:Bone, updateLater:boolean = false):void{
			if(!childBone){
				throw new Error();
			}
			
			var index:number = this._boneList.indexOf(childBone);
			if(index < 0){
				throw new Error();
			}

			this._boneList.splice(index, 1);
			childBone._setParent(null);
			childBone._setArmature(null);
			
			if(this._armature && !updateLater){
				this._armature._updateAnimationAfterBoneListChanged(false);
			}
		}
		
		public addSlot(childSlot:Slot):void{
			if(!childSlot){
				throw new Error();
			}
			
			if(childSlot.parent){
				childSlot.parent.removeSlot(childSlot);
			}

			this._slotList[this._slotList.length] = childSlot;
			childSlot._setParent(this);
			childSlot.setArmature(this._armature);
		}
		
		public removeSlot(childSlot:Slot):void{
			if(!childSlot){
				throw new Error();
			}
			
			var index:number = this._slotList.indexOf(childSlot);
			if(index < 0){
				throw new Error();
			}

			this._slotList.splice(index, 1);
			childSlot._setParent(null);
			childSlot.setArmature(null);
		}
		
		/** @private */
		public _setArmature(value:Armature):void{
			if(this._armature == value){
				return;
			}
			if(this._armature){
				this._armature._removeBoneFromBoneList(this);
				this._armature._updateAnimationAfterBoneListChanged(false);
			}
			this._armature = value;
			if(this._armature){
				this._armature._addBoneToBoneList(this);
			}
			
			var i:number = this._boneList.length;
			while(i --){
				this._boneList[i]._setArmature(this._armature);
			}
			
			i = this._slotList.length;
			while(i --){
				this._slotList[i].setArmature(this._armature);
			}
		}
		
		/**
		 * Get all Bone instance associated with this bone.
		 * @return A Vector.&lt;Slot&gt; instance.
		 * @see dragonBones.Slot
		 */
		public getBones(returnCopy:boolean = true):Array<Bone>{
			return returnCopy?this._boneList.concat():this._boneList;
		}
		
		/**
		 * Get all Slot instance associated with this bone.
		 * @return A Vector.&lt;Slot&gt; instance.
		 * @see dragonBones.Slot
		 */
		public getSlots(returnCopy:boolean = true):Array<Slot>{
			return returnCopy?this._slotList.concat():this._slotList;
		}

//动画
		/**
		 * Force update the bone in next frame even if the bone is not moving.
		 */
		public invalidUpdate():void{
			this._needUpdate = 2;
		}
		
		/** @private */
		public _update(needUpdate:boolean = false):void{
			this._needUpdate --;
			if(needUpdate || this._needUpdate > 0 || (this._parent && this._parent._needUpdate > 0)){
				this._needUpdate = 1;
			}
			else{
				return;
			}
			
			this.blendingTimeline();
			
			this._global.scaleX = (this._origin.scaleX + this._tween.scaleX) * this._offset.scaleX;
			this._global.scaleY = (this._origin.scaleY + this._tween.scaleY) * this._offset.scaleY;
			
			if(this._parent){
				var x:number = this._origin.x + this._offset.x + this._tween.x;
				var y:number = this._origin.y + this._offset.y + this._tween.y;
				var parentMatrix:Matrix = this._parent._globalTransformMatrix;
				
				this._globalTransformMatrix.tx = this._global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
				this._globalTransformMatrix.ty = this._global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
				
				if(this.inheritRotation){
					this._global.skewX = this._origin.skewX + this._offset.skewX + this._tween.skewX + this._parent._global.skewX;
					this._global.skewY = this._origin.skewY + this._offset.skewY + this._tween.skewY + this._parent._global.skewY;
				}
				else{
					this._global.skewX = this._origin.skewX + this._offset.skewX + this._tween.skewX;
					this._global.skewY = this._origin.skewY + this._offset.skewY + this._tween.skewY;
				}
				
				if(this.inheritScale){
					this._global.scaleX *= this._parent._global.scaleX;
					this._global.scaleY *= this._parent._global.scaleY;
				}
			}
			else{
				this._globalTransformMatrix.tx = this._global.x = this._origin.x + this._offset.x + this._tween.x;
				this._globalTransformMatrix.ty = this._global.y = this._origin.y + this._offset.y + this._tween.y;
				
				this._global.skewX = this._origin.skewX + this._offset.skewX + this._tween.skewX;
				this._global.skewY = this._origin.skewY + this._offset.skewY + this._tween.skewY;
			}
			
			this._globalTransformMatrix.a = this._global.scaleX * Math.cos(this._global.skewY);
			this._globalTransformMatrix.b = this._global.scaleX * Math.sin(this._global.skewY);
			this._globalTransformMatrix.c = -this._global.scaleY * Math.sin(this._global.skewX);
			this._globalTransformMatrix.d = this._global.scaleY * Math.cos(this._global.skewX);
		}
		
		/** @private */
		public _updateColor(
			aOffset:number,
			rOffset:number,
			gOffset:number,
			bOffset:number,
			aMultiplier:number,
			rMultiplier:number,
			gMultiplier:number,
			bMultiplier:number,
			colorChanged:boolean
		):void{
			var length:number = this._slotList.length;
			for(var i:number = 0;i < length;i++){
				var childSlot:Slot = this._slotList[i];
				childSlot._updateDisplayColor(
					aOffset, rOffset, gOffset, bOffset,
					aMultiplier, rMultiplier, gMultiplier, bMultiplier
				);
			}

			this._isColorChanged = colorChanged;
		}
		/** @private */
		public _hideSlots():void{
			var length:number = this._slotList.length;
			for(var i:number = 0;i < length;i++){
				var childSlot:Slot = this._slotList[i];
				childSlot._changeDisplay(-1);
			}
		}
		
		/** @private When bone timeline enter a key frame, call this func*/
		public _arriveAtFrame(frame:Frame, timelineState:TimelineState, animationState:AnimationState, isCross:boolean):void{
			var displayControl:boolean = 
				animationState.displayControl &&
				(!this.displayController || this.displayController == animationState.name) &&
				animationState.containsBoneMask(this.name)
			
			if(displayControl){
				var tansformFrame:TransformFrame = <TransformFrame><any> frame;
				var displayIndex:number = tansformFrame.displayIndex;
				var childSlot:Slot;
				var length:number = this._slotList.length;
				for(var i:number = 0;i < length;i++){
					childSlot = this._slotList[i];
					childSlot._changeDisplay(displayIndex);
					childSlot._updateDisplayVisible(tansformFrame.visible);
					if(displayIndex >= 0){
						if(!isNaN(tansformFrame.zOrder) && tansformFrame.zOrder != childSlot._tweenZOrder){
							childSlot._tweenZOrder = tansformFrame.zOrder;
							this._armature._slotsZOrderChanged = true;
						}
					}
				}
				
				if(frame.event && this._armature.hasEventListener(FrameEvent.BONE_FRAME_EVENT)){
					var frameEvent:FrameEvent = new FrameEvent(FrameEvent.BONE_FRAME_EVENT);
					frameEvent.bone = this;
					frameEvent.animationState = animationState;
					frameEvent.frameLabel = frame.event;
					this._armature._eventList.push(frameEvent);
				}
				/*
				if(frame.sound && _soundManager.hasEventListener(SoundEvent.SOUND))
				{
					var soundEvent:SoundEvent = new SoundEvent(SoundEvent.SOUND);
					soundEvent.armature = this._armature;
					soundEvent.animationState = animationState;
					soundEvent.sound = frame.sound;
					_soundManager.dispatchEvent(soundEvent);
				}
				*/
				//[TODO]currently there is only gotoAndPlay belongs to frame action. In future, there will be more.  
				//后续会扩展更多的action，目前只有gotoAndPlay的含义
				if(frame.action) {
					var length1:number = this._slotList.length;
					for(var i1:number = 0;i1 < length1;i1++){
						childSlot = this._slotList[i1];
						var childArmature:Armature = childSlot.childArmature;
						if(childArmature){
							childArmature.animation.gotoAndPlay(frame.action);
						}
					}
				}
			}
		}
		
		/** @private */
		public _addState(timelineState:TimelineState):void{
			if(this._timelineStateList.indexOf(timelineState) < 0){
				this._timelineStateList.push(timelineState);
				this._timelineStateList.sort(this.sortState);
			}
		}
		
		/** @private */
		public _removeState(timelineState:TimelineState):void{
			var index:number = this._timelineStateList.indexOf(timelineState);
			if(index >= 0){
				this._timelineStateList.splice(index, 1);
			}
		}
		
		private blendingTimeline():void{
			var timelineState:TimelineState;
			var transform:DBTransform;
			var pivot:Point;
			var weight:number;
			
			var i:number = this._timelineStateList.length;
			if(i == 1){
				timelineState = this._timelineStateList[0];
				weight = timelineState._animationState.weight * timelineState._animationState.fadeWeight;
				timelineState._weight = weight;
				transform = timelineState._transform;
				pivot = timelineState._pivot;
				
				this._tween.x = transform.x * weight;
				this._tween.y = transform.y * weight;
				this._tween.skewX = transform.skewX * weight;
				this._tween.skewY = transform.skewY * weight;
				this._tween.scaleX = transform.scaleX * weight;
				this._tween.scaleY = transform.scaleY * weight;
				
				this._tweenPivot.x = pivot.x * weight;
				this._tweenPivot.y = pivot.y * weight;
			}
			else if(i > 1){
				var x:number = 0;
				var y:number = 0;
				var skewX:number = 0;
				var skewY:number = 0;
				var scaleX:number = 0;
				var scaleY:number = 0;
				var pivotX:number = 0;
				var pivotY:number = 0;
				
				var weigthLeft:number = 1;
				var layerTotalWeight:number = 0;
				var prevLayer:number = this._timelineStateList[i - 1]._animationState.layer;
				var currentLayer:number = 0;
				
				//Traversal the layer from up to down
				//layer由高到低依次遍历
				
				while(i --){
					timelineState = this._timelineStateList[i];
					
					currentLayer = timelineState._animationState.layer;
					if(prevLayer != currentLayer){
						if(layerTotalWeight >= weigthLeft){
							timelineState._weight = 0;
							break;
						}
						else{
							weigthLeft -= layerTotalWeight;
						}
					}
					prevLayer = currentLayer;
					
					weight = timelineState._animationState.weight * timelineState._animationState.fadeWeight * weigthLeft;
					timelineState._weight = weight;
					if(weight && timelineState._blendEnabled){
						transform = timelineState._transform;
						pivot = timelineState._pivot;
						
						x += transform.x * weight;
						y += transform.y * weight;
						skewX += transform.skewX * weight;
						skewY += transform.skewY * weight;
						scaleX += transform.scaleX * weight;
						scaleY += transform.scaleY * weight;
						pivotX += pivot.x * weight;
						pivotY += pivot.y * weight;
						
						layerTotalWeight += weight;
					}
				}
				
				this._tween.x = x;
				this._tween.y = y;
				this._tween.skewX = skewX;
				this._tween.skewY = skewY;
				this._tween.scaleX = scaleX;
				this._tween.scaleY = scaleY;
				this._tweenPivot.x = pivotX;
				this._tweenPivot.y = pivotY;
			}
		}
		
		private sortState(state1:TimelineState, state2:TimelineState):number{
			return state1._animationState.layer < state2._animationState.layer?-1:1;
		}
		
		/**
		 * Unrecommended API. Recommend use slot.childArmature.
		 */
		public get childArmature():Armature{
			if(this.slot){
				return this.slot.childArmature;
			}
			return null;
		}
		
		/**
		 * Unrecommended API. Recommend use slot.display.
		 */
		public get display():any{
			if(this.slot){
				return this.slot.display;
			}
			return null;
		}
		public set display(value:any){
			if(this.slot){
				this.slot.display = value;
			}
		}
		
		/**
		 * Unrecommended API. Recommend use offset.
		 */
		public get node():DBTransform{
			return this._offset;
		}
		
		
		
		
		/** @private */
		public set visible(value:boolean){
			if(this._visible != value){
				this._visible = value;
				var length:number = this._slotList.length;
				for(var i:number = 0;i < length;i++){
					var childSlot:Slot = this._slotList[i];
					childSlot._updateDisplayVisible(this._visible);
				}
			}
		}
		
		
		
		public get slot():Slot{
			return this._slotList.length > 0?this._slotList[0]:null;
		}
	}
}