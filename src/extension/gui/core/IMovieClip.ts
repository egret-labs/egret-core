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

/// <reference path="../../../egret/events/IEventDispatcher.ts"/>

module egret {

	/**
	 * @class egret.IMovieClip
	 * @interface
	 * @classdesc
	 * 影片剪辑接口
	 * @extends egret.IEventDispatcher
	 */
	export interface IMovieClip extends IEventDispatcher{
		/**
		 * 当前播放到的帧索引,从0开始
		 * @member egret.IMovieClip#currentFrame
		 */
		currentFrame:number;
		/**
		 * 动画总帧数
		 * @member egret.IMovieClip#totalFrames
		 */
		totalFrames:number;
		/**
		 * 返回由FrameLabel对象组成的数组。数组包括整个Dxr动画实例的所有帧标签。
		 * @member egret.IMovieClip#frameLabels
		 */		
		frameLabels:Array<any>;
		/**
		 * 是否循环播放,默认为true。
		 * @member egret.IMovieClip#repeatPlay
		 */		
		repeatPlay:boolean;
		/**
		 * 跳到指定帧并播放
		 * @method egret.IMovieClip#gotoAndPlay
		 * @param frame {any} 可以是帧索引或者帧标签，帧索引从0开始。
		 */
		gotoAndPlay(frame:any):void;
		/**
		 * 跳到指定帧并停止
		 * @method egret.IMovieClip#gotoAndStop
		 * @param frame {any} 可以是帧索引或者帧标签，帧索引从0开始。
		 */
		gotoAndStop(frame:any):void;
		/**
		 * 从当期帧开始播放
		 * @method egret.IMovieClip#play
		 */		
		play():void;
		/**
		 * 在当前帧停止播放
		 * @method egret.IMovieClip#stop
		 */		
		stop():void;
		/**
		 * 为指定帧添加回调函数。注意：同一帧只能添加一个回调函数。后添加的回调函数将会覆盖之前的。
		 * @method egret.IMovieClip#addFrameScript
		 * @param frame {number} 要添加回调的帧索引，从0开始。
		 * @param callBack {Function} 回调函数。设置为null，将取消之前添加的回调函数。
		 */		
		addFrameScript(frame:number,callBack:Function):void;
	}
}