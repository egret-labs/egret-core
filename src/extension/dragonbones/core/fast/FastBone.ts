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
	 * @class dragonBones.FastBone
	 * @classdesc
	 * FastBone 实例代表 FastArmature 中的一个骨头。一个FastArmature实例可以由很多 FastBone组成。
	 * FastBone 在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现
	 * 和Bone相比，FastBone不能动态添加子骨骼和子插槽
	 * @extends dragonBones.FastDBObject
	 * @see dragonBones.FastArmature
	 * @see dragonBones.FastSlot
	 * @see dragonBones.BoneData
	 */
	export class FastBone extends FastDBObject{
		public static initWithBoneData(boneData:BoneData):FastBone{
			var outputBone:FastBone = new FastBone();
			
			outputBone.name = boneData.name;
			outputBone.inheritRotation = boneData.inheritRotation;
			outputBone.inheritScale = boneData.inheritScale;
			outputBone.origin.copy(boneData.transform);
			
			return outputBone;
		}
		
		public slotList:Array<FastSlot> = [];
		public boneList:Array<FastBone> = [];
		/** @private */
		public _timelineState:FastBoneTimelineState;
		
		/** @private */
		public _needUpdate:number = 0;
		public _tweenPivot:Point;
		
		public constructor(){
			super();
			this._needUpdate = 2;
			this._tweenPivot = new Point();
		}

		/**
		 * 获取当前骨头包含的所有 FastBone 实例
		 * @param returnCopy {boolean} 是否返回拷贝。默认：true
		 * @returns {FastBone[]}
		 */
		public getBones(returnCopy:boolean = true):Array<FastBone>
		{
			return returnCopy ? this.boneList.concat() : this.boneList;
		}

		/**
		 * 获取当前骨头包含的所有 FastSlot 实例
		 * @param returnCopy {boolean} 是否返回拷贝。默认：true
		 * @returns {FastSlot[]}
		 */
		public getSlots(returnCopy:boolean = true):Array<FastSlot>
		{
			return returnCopy ? this.slotList.concat() : this.slotList;
		}

		/**
		 * @inheritDoc
		 */
		public dispose():void{
			super.dispose();
			this._timelineState = null;
			this._tweenPivot = null;
		}
		
	//动画
		/**
		 * 在下一帧强制更新当前 Bone 实例及其包含的所有 Slot 的动画。
		 */
		public invalidUpdate():void{
			this._needUpdate = 2;
		}
		
		public _calculateRelativeParentTransform():void{
			this._global.copy(this._origin);
			if(this._timelineState){
				this._global.add(this._timelineState._transform);
			}
		}
		
		/** @private */
		public updateByCache():void{
			super.updateByCache();
			this._global = this._frameCache.globalTransform;
			this._globalTransformMatrix = this._frameCache.globalTransformMatrix;
		}
		
		/** @private */
		public update(needUpdate:boolean = false):void{
			this._needUpdate --;
			if(needUpdate || this._needUpdate > 0 || (this._parent && this._parent._needUpdate > 0)){
				this._needUpdate = 1;
			}
			else{
				return;
			}
			this.blendingTimeline();
			//计算global
			this._updateGlobal();
		}
		
		/** @private */
		public _hideSlots():void{
			var length:number = this.slotList.length;
			for(var i:number = 0;i < length;i++){
				var childSlot:FastSlot = this.slotList[i];
				childSlot.hideSlots();
			}
		}

		private blendingTimeline():void
		{
			if(this._timelineState)
			{
				this._tweenPivot.x = this._timelineState._pivot.x;
				this._tweenPivot.y = this._timelineState._pivot.y;
			}
		}

		/** @private When bone timeline enter a key frame, call this func*/
		public arriveAtFrame(frame:Frame, animationState:FastAnimationState):void{
			var childSlot:FastSlot;
			if(frame.event && this.armature.hasEventListener(FrameEvent.BONE_FRAME_EVENT)){
				var frameEvent:FrameEvent = new FrameEvent(FrameEvent.BONE_FRAME_EVENT);
				frameEvent.bone = this;
				frameEvent.animationState = animationState;
				frameEvent.frameLabel = frame.event;
				this.armature._addEvent(frameEvent);
			}
		}

		/**
		 * 不推荐的API,建议使用 slot.childArmature 替代
		 */
		public get childArmature():any
		{
			var s:FastSlot = this.slot;
			if(s)
			{
				return s.childArmature;
			}
			return null;
		}

		/**
		 * 不推荐的API,建议使用 slot.display 替代
		 */
		public get display():any
		{
			var s:FastSlot = this.slot;
			if(s)
			{
				return s.display;
			}
			return null;
		}
		public set display(value:any)
		{
			var s:FastSlot = this.slot;
			if(s)
			{
				s.display = value;
			}
		}
		
		/** @private */
		public set visible(value:boolean)
		{
			if(this._visible != value)
			{
				this._visible = value;
				for(var i:number = 0, len:number = this.armature.slotList.length; i < len; i++)
				{
					if(this.armature.slotList[i].parent == this)
					{
						this.armature.slotList[i]._updateDisplayVisible(this._visible);
					}
				}
			}
		}

		/**
		 * 返回当前 FastBone 实例包含的第一个 FastSlot 实例
		 * @member {FastSlot} dragonBones.FastBone#slot
		 */
		public get slot():FastSlot
		{
			return this.slotList.length > 0 ? this.slotList[0] : null;
		}
	}
}