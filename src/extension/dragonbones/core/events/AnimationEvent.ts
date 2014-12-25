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

	export class AnimationEvent extends Event{
		/**
		 * 不推荐使用.
		 */
		public static get MOVEMENT_CHANGE():string{
			return AnimationEvent.FADE_IN;
		}
		
		/**
		 * Dispatched when the playback of an animation fade in.
		 */
		public static FADE_IN:string = "fadeIn";
		
		/**
		 * Dispatched when the playback of an animation fade out.
		 */
		public static FADE_OUT:string = "fadeOut";
		
		/**
		 * Dispatched when the playback of an animation starts.
		 */
		public static START:string = "start";
		
		/**
		 * Dispatched when the playback of a animation stops.
		 */
		public static COMPLETE:string = "complete";
		
		/**
		 * Dispatched when the playback of a animation completes a loop.
		 */
		public static LOOP_COMPLETE:string = "loopComplete";
		
		/**
		 * Dispatched when the playback of an animation fade in complete.
		 */
		public static FADE_IN_COMPLETE:string = "fadeInComplete";
		
		/**
		 * Dispatched when the playback of an animation fade out complete.
		 */
		public static FADE_OUT_COMPLETE:string = "fadeOutComplete";
		
		/**
		 * 不推荐的API.
		 */
		public get movementID():string{
			return this.animationName;
		}
		
		/**
		 * The animationState instance.
		 */
		public animationState:AnimationState;
		
		/**
		 * The armature that is the taget of this event.
		 */
		public get armature():Armature{
			return <Armature><any> (this.target);
		}
		
		public get animationName():string{
			return this.animationState.name;
		}
		
		/**
		 * Creates a new AnimationEvent instance.
		 * @param type
		 * @param cancelable
		 */
		public constructor(type:string, cancelable:boolean = false){
			super(type);
		}
	}
}