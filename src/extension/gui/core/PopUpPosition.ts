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
	 * @class egret.gui.PopUpPosition
	 * @classdesc
	 * 定义弹出位置的常量值。
	 * 该常量决定目标对象相对于父级组件的弹出位置。
	 */	
	export class PopUpPosition{	
		/**
		 * 在组件上方弹出
		 * @constant egret.gui.PopUpPosition.ABOVE
		 */		
		public static ABOVE:string = "above";
		/**
		 * 在组件下方弹出
		 * @constant egret.gui.PopUpPosition.BELOW
		 */		
		public static BELOW:string = "below";
		/**
		 * 在组件中心弹出
		 * @constant egret.gui.PopUpPosition.CENTER
		 */		
		public static CENTER:string = "center";
		/**
		 * 在组件左上角弹出 
		 * @constant egret.gui.PopUpPosition.TOP_LEFT
		 */		
		public static TOP_LEFT:string = "topLeft";
		/**
		 * 在组件左边弹出
		 * @constant egret.gui.PopUpPosition.LEFT
		 */		
		public static LEFT:string = "left";
		/**
		 * 在组件右边弹出
		 * @constant egret.gui.PopUpPosition.RIGHT
		 */		
		public static RIGHT:string = "right";
        
		/**
		 * 在屏幕中心弹出
		 * @constant egret.gui.PopUpPosition.SCREEN_CENTER
		 */		
        public static SCREEN_CENTER: string = "screenCenter";
		
	}
}