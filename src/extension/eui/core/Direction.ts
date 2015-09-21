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
	 * Defines values for setting the <code>direction</code> property
	 * of the <code>ProgressBar</code> class.
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 * @includeExample  extension/eui/core/DirectionExample.ts
	 */
	/**
	 * @language zh_CN
	 * 定义进度条等控件增长方向的常量
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 * @includeExample  extension/eui/core/DirectionExample.ts
	 */
	export class Direction{
		/**
		 * @language en_US
		 * Specifies left-to-right direction.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 水平从左到右增长
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		public static LTR:string = "ltr";
		/**
		 * @language en_US
		 * Specifies right-to-left direction.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 水平从右到左增长
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		public static RTL:string = "rtl";
		/**
		 * @language en_US
		 * Specifies top-to-bottom direction.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 竖直从上到下增长
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		public static TTB:string = "ttb";
		/**
		 * @language en_US
		 * Specifies bottom-to-top direction.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 竖直从下到上增长
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		public static BTT:string = "btt";
	}
}