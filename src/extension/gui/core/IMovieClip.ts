/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../../egret/events/IEventDispatcher.ts"/>

module ns_egret {

	export interface IMovieClip extends IEventDispatcher{
		/**
		 * 当前播放到的帧索引,从0开始
		 */
		currentFrame:number;
		/**
		 * 动画总帧数
		 */
		totalFrames:number;
		/**
		 * 返回由FrameLabel对象组成的数组。数组包括整个Dxr动画实例的所有帧标签。
		 */		
		frameLabels:Array;
		/**
		 * 是否循环播放,默认为true。
		 */		
		repeatPlay:boolean;
		/**
		 * 跳到指定帧并播放
		 * @param frame 可以是帧索引或者帧标签，帧索引从0开始。
		 */
		gotoAndPlay(frame:any):void;
		/**
		 * 跳到指定帧并停止
		 * @param frame 可以是帧索引或者帧标签，帧索引从0开始。
		 */
		gotoAndStop(frame:any):void;
		/**
		 * 从当期帧开始播放
		 */		
		play():void;
		/**
		 * 在当前帧停止播放
		 */		
		stop():void;
		/**
		 * 为指定帧添加回调函数。注意：同一帧只能添加一个回调函数。后添加的回调函数将会覆盖之前的。
		 * @param frame 要添加回调的帧索引，从0开始。
		 * @param callBack 回调函数。设置为null，将取消之前添加的回调函数。
		 */		
		addFrameScript(frame:number,callBack:Function):void;
	}
}