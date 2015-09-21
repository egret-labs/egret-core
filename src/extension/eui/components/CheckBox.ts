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
	 * The CheckBox component consists of an optional label and a small box
	 * that can contain a check mark or not.<p/>
	 *
	 * When a user clicks a CheckBox component or its associated text,
	 * the CheckBox component sets its <code>selected</code> property
	 * to <code>true</code> for checked, and to <code>false</code> for unchecked.
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
     * @includeExample extension/eui/components/CheckboxExample.ts
	 */
	/**
	 * @language zh_CN
	 * CheckBox 组件包含一个可选标签和一个小方框，该方框内可以包含/不包含复选标记。<p/>
	 * 用户单击 CheckBox 组件或其关联文本时，CheckBox 组件会将其 selected 属性设置为 true（表示选中）或 false（表示取消选中）。
	 *
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
     * @includeExample extension/eui/components/CheckboxExample.ts
	 */
	export class CheckBox extends ToggleButton{
		/**
		 * @language en_US
		 * Constructor.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 创建一个CheckBox
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		public constructor(){
			super();
		}
	}

}