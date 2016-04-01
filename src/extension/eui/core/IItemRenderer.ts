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
	 * The IItemRenderer interface defines the basic set of APIs
	 * that used for List class.
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 */
	/**
	 * @language zh_CN
	 * 列表类组件的项呈示器接口。
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 */
	export interface IItemRenderer extends UIComponent{
		/**
		 * @language en_US
		 * The data to render or edit.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 要呈示或编辑的数据。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		data:any;
		/**
		 * @language en_US
		 * Contains <code>true</code> if the item renderer
		 * can show itself as selected.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 如果项呈示器可以将其自身显示为已选中，则为 true。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		selected:boolean;
		/**
		 * @language en_US
		 * The index of the item in the data provider
		 * of the host component of the item renderer.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 项呈示器的数据提供程序中的项目索引。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		itemIndex:number;
	}
}