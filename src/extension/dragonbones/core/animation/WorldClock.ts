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
     * @class dragonBones.WorldClock
     * @classdesc
     * WorldClock 提供时钟的支持，为控制每个加入时钟的 IAnimatable 对象正确的播放动画。
     * 一般来说，每当 Armature 被创建出来后，只需要将之加入 WorldClock,之后只需要控制 WorldClock 的前进，就可以实现所有 Armature 的动画前进了
     * @see dragonBones.IAnimatable
     * @see dragonBones.Armature
     */
	export class WorldClock implements IAnimatable{
        /**
         * 可以直接使用的全局静态时钟实例.
         * @type dragonBones.WorldClock
         */
		public static clock:WorldClock = new WorldClock();
		
		private _animatableList:Array<IAnimatable>;
		
		private _time:number;
		public get time():number{
			return this._time;
		}
		
		private _timeScale:number;

        /**
         * 时间缩放系数。用于实现动画的变速播放
         * @member {number} dragonBones.WorldClock#timeScale
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
         * 创建一个新的 WorldClock 实例。
         * 一般来说，不需要单独创建 WorldClock 的实例，可以直接使用 WorldClock.clock 静态实例就可以了。
         * @param time {number} 开始时间
         * @param timeScale {number} 时间缩放系数
         */
		public constructor(time:number = -1, timeScale:number = 1){
			this._time = time >= 0?time: new Date().getTime() * 0.001;
			this._timeScale = isNaN(timeScale)?1:timeScale;
			this._animatableList = [];
		}

        /**
         * 检查是否包含指定的 IAnimatable 实例
         * @param animatable {IAnimatable} IAnimatable 实例
         * @returns {boolean}
         */
		public contains(animatable:IAnimatable):boolean{
			return this._animatableList.indexOf(animatable) >= 0;
		}

        /**
         * 将一个 IAnimatable 实例加入到时钟
         * @param animatable {IAnimatable} IAnimatable 实例
         */
		public add(animatable:IAnimatable):void{
			if (animatable && this._animatableList.indexOf(animatable) == -1){
				this._animatableList.push(animatable);
			}
		}

        /**
         * 将一个 IAnimatable 实例从时钟中移除
         * @param animatable {IAnimatable} IAnimatable 实例
         */
		public remove(animatable:IAnimatable):void{
			var index:number = this._animatableList.indexOf(animatable);
			if (index >= 0){
				this._animatableList[index] = null;
			}
		}
		
		/**
		 * 从时钟中移除所有的 IAnimatable 实例.
		 */
		public clear():void{
			this._animatableList.length = 0;
		}

        /**
         * 更新所有包含的 IAnimatable 实例，将他们的动画向前播放指定的时间。一般来说，这个方法需要在 ENTERFRAME 事件的响应函数中被调用
         * @param passedTime {number} 前进的时间，默认值为-1，DragonBones会自动为你计算当前帧与上一帧的时间差
         */
		public advanceTime(passedTime:number = -1):void{
			if(passedTime < 0){
				passedTime = new Date().getTime() * 0.001 - this._time;
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