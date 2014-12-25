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

	export class WorldClock implements IAnimatable{
		/**
		 * A global static WorldClock instance ready to use.
		 */
		public static clock:WorldClock = new WorldClock();
		
		private _animatableList:Array<IAnimatable>;
		
		private _time:number;
		public get time():number{
			return this._time;
		}
		
		private _timeScale:number;
		/**
		 * The time scale to apply to the number of second passed to the advanceTime() method.
		 * @param A Number to use as a time scale.
		 */
		public get timeScale():number{
			return this._timeScale;
		}
		public set timeScale(value:number){
			if(isNaN(value) || value < 0){
				value = 1;
			}
			this._timeScale = value;
		}
		
		/**
		 * Creates a new WorldClock instance. (use the static var WorldClock.clock instead).
		 */
		public constructor(time:number = -1, timeScale:number = 1){
			this._time = time >= 0?time: new Date().getTime() * 0.001;
			this._timeScale = isNaN(timeScale)?1:timeScale;
			this._animatableList = [];
		}
		
		/** 
		 * Returns true if the IAnimatable instance is contained by WorldClock instance.
		 * @param An IAnimatable instance (Armature or custom)
		 * @return true if the IAnimatable instance is contained by WorldClock instance.
		 */
		public contains(animatable:IAnimatable):boolean{
			return this._animatableList.indexOf(animatable) >= 0;
		}
		
		/**
		 * Add a IAnimatable instance (Armature or custom) to this WorldClock instance.
		 * @param An IAnimatable instance (Armature, WorldClock or custom)
		 */
		public add(animatable:IAnimatable):void{
			if (animatable && this._animatableList.indexOf(animatable) == -1){
				this._animatableList.push(animatable);
			}
		}
		
		/**
		 * Remove a IAnimatable instance (Armature or custom) from this WorldClock instance.
		 * @param An IAnimatable instance (Armature or custom)
		 */
		public remove(animatable:IAnimatable):void{
			var index:number = this._animatableList.indexOf(animatable);
			if (index >= 0){
				this._animatableList[index] = null;
			}
		}
		
		/**
		 * Remove all IAnimatable instance (Armature or custom) from this WorldClock instance.
		 */
		public clear():void{
			this._animatableList.length = 0;
		}
		
		/**
		 * Update all registered IAnimatable instance animations using this method typically in an ENTERFRAME Event or with a Timer.
		 * @param The amount of second to move the playhead ahead.
		 */
		public advanceTime(passedTime:number = -1):void{
			if(passedTime < 0){
				passedTime = new Date().getTime() - this._time;
			}
			passedTime *= this._timeScale;
			
			this._time += passedTime;
			
			var length:number = this._animatableList.length;
			if(length == 0){
				return;
			}
			var currentIndex:number = 0;
			
			for(var i:number = 0;i < length;i ++){
				var animatable:IAnimatable = this._animatableList[i];
				if(animatable){
					if(currentIndex != i){
						this._animatableList[currentIndex] = animatable;
						this._animatableList[i] = null;
					}
					animatable.advanceTime(passedTime);
					currentIndex ++;
				}
			}
			
			if (currentIndex != i){
				length = this._animatableList.length;
				while(i < length){
					this._animatableList[currentIndex ++] = this._animatableList[i ++];
				}
				this._animatableList.length = currentIndex;
			}
		}
	}
}