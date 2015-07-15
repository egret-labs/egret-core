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

module egret.gui {

	/**
	 * @class egret.gui.ProgressBarDirection
	 * @classdesc
	 * 定义进度条控件增长方向的常量
	 */
	export class ProgressBarDirection{
		/**
		 * 水平从左到右增长
		 * @constant egret.gui.ProgressBarDirection.LEFT_TO_RIGHT
		 */		
		public static LEFT_TO_RIGHT:string = "leftToRight";
		/**
		 * 水平从右到左增长
		 * @constant egret.gui.ProgressBarDirection.RIGHT_TO_LEFT
		 */		
		public static RIGHT_TO_LEFT:string = "rightToLeft";
		/**
		 * 竖直从上到下增长
		 * @constant egret.gui.ProgressBarDirection.TOP_TO_BOTTOM
		 */		
		public static TOP_TO_BOTTOM:string = "topToBottom";
		/**
		 * 竖直从下到上增长
		 * @constant egret.gui.ProgressBarDirection.BOTTOM_TO_TOP
		 */		
		public static BOTTOM_TO_TOP:string = "bottomToTop";
	}
}