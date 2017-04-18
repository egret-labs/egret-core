//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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

namespace eui {

	/**
	 * The RowAlign class defines the possible values for the
	 * <code>rowAlign</code> property of the TileLayout class.
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 * @includeExample  extension/eui/layout/RowAlignExample.ts
	 * @language en_US
	 */
	/**
	 * RowAlign 类为 TileLayout 类的 <code>rowAlign</code> 属性定义可能的值。
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 * @includeExample  extension/eui/layout/RowAlignExample.ts
	 * @language zh_CN
	 */
	export class RowAlign{
		/**
		 * Do not justify the rows.
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 不进行两端对齐。
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public static TOP:string = "top";
		/**
		 * Justify the rows by increasing the vertical gap.
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 通过增大垂直间隙将行两端对齐。
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public static JUSTIFY_USING_GAP:string = "justifyUsingGap";
		
		/**
		 * Justify the rows by increasing the row height.
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 * @language en_US
		 */
		/**
		 * 通过增大行高度将行两端对齐。
		 *
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 * @language zh_CN
		 */
		public static JUSTIFY_USING_HEIGHT:string = "justifyUsingHeight";
	}
}