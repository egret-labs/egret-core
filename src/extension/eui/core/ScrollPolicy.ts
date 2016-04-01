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

module eui {

	/**
	 * @language en_US
	 * Values for the <code>horizontalCanScroll</code> and
	 * <code>verticalCanScroll</code> properties of the Scroller classes.
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 * @includeExample  extension/eui/core/ScrollPolicyExample.ts
	 */
	/**
	 * @language zh_CN
	 * 滚动条显示策略常量。
	 * Scroller 类的 <code>horizontalCanScroll</code> 和 <code>verticalCanScroll</code> 属性的值。
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 * @includeExample  extension/eui/core/ScrollPolicyExample.ts
	 */
	export class ScrollPolicy{
		/**
		 * @language en_US
		 * Show the scrollbar if the children exceed the owner's dimension.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 如果子项超出父级的尺寸，则允许滚动，反之不允许滚动。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		public static AUTO:string = "auto";
		
		/**
		 * @language en_US
		 * Never show the scrollbar.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 从不允许滚动。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		public static OFF:string = "off";

		/**
		 * @language en_US
		 * Always show the scrollbar.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 总是允许滚动。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		public static ON:string = "on";
	}
}