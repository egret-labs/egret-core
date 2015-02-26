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
	 * @class dragonBones.FrameEvent
	 * @extends dragonBones.Event
	 * @classdesc
	 * 帧事件
	 */
	export class FrameEvent extends Event{
		public static get MOVEMENT_FRAME_EVENT():string{
			return  FrameEvent.ANIMATION_FRAME_EVENT;
		}
		
		/**
		 * 当动画播放到一个关键帧时派发
		 */
		public static ANIMATION_FRAME_EVENT:string = "animationFrameEvent";
		
		/**
		 *
		 */
		public static BONE_FRAME_EVENT:string ="boneFrameEvent";
		
		/**
		 * 当前的帧标签
		 * @member {string} dragonBones.FrameEvent#frameLabel
		 */
		public frameLabel:string;
		
		public bone:Bone;
		
		/**
		 * 派发这个事件的骨架
		 * @member {dragonBones.Armature} dragonBones.FrameEvent#armature
		 */
		public get armature():Armature{
			return <Armature><any> (this.target);
		}
		
		/**
		 * animationState的实例
		 * @member {dragonBones.AnimationState} dragonBones.FrameEvent#animationState
		 */
		public animationState:AnimationState;
		
		/**
		 * 创建一个新的 FrameEvent 实例
		 * @param type 事件类型
		 * @param cancelable
		 */
		public constructor(type:string, cancelable:boolean = false){
			super(type);
		}
	}
}