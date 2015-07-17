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

	export class FastBone extends FastDBObject{
		public static initWithBoneData(boneData:BoneData):FastBone{
			var outputBone:FastBone = new FastBone();
			
			outputBone.name = boneData.name;
			outputBone.inheritRotation = boneData.inheritRotation;
			outputBone.inheritScale = boneData.inheritScale;
			outputBone.origin.copy(boneData.transform);
			
			return outputBone;
		}
		
		/** @private */
		public _timelineState:FastBoneTimelineState;
		
		/** @private */
		public _needUpdate:number = 0;
		
		public constructor(){
			super();
			this._needUpdate = 2;
		}
		
		/**
		 * @inheritDoc
		 */
		public dispose():void{
			super.dispose();
			this._timelineState = null;
		}
		
	//动画
		/**
		 * Force update the bone in next frame even if the bone is not moving.
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
			
			//计算global
			this.updateGlobal();
		}
		
		/** @private When bone timeline enter a key frame, call this func*/
		public arriveAtFrame(frame:Frame, animationState:FastAnimationState):void{
			var childSlot:FastSlot;
			if(frame.event && this.armature.hasEventListener(FrameEvent.BONE_FRAME_EVENT)){
				var frameEvent:FrameEvent = new FrameEvent(FrameEvent.BONE_FRAME_EVENT);
				frameEvent.bone = this;
				frameEvent.animationState = animationState;
				frameEvent.frameLabel = frame.event;
				this.armature._eventList.push(frameEvent);
			}
		}
	}
}