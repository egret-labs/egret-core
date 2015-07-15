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
	 * @class egret.gui.ILayoutManagerClient
	 * @interface
	 * @classdesc
	 * 使用布局管理器的组件接口
	 * @extends egret.IEventDispatcher
	 */
	export interface ILayoutManagerClient extends IEventDispatcher{
		/**
		 * 验证组件的属性
		 * @method egret.gui.ILayoutManagerClient#validateProperties
		 */		
		validateProperties():void;
		/**
		 * 验证组件的尺寸
		 * @method egret.gui.ILayoutManagerClient#validateSize
		 * @param recursive? {boolean} 
		 */		
		validateSize(recursive?:boolean):void;
		/**
		 * 验证子项的位置和大小，并绘制其他可视内容
		 * @method egret.gui.ILayoutManagerClient#validateDisplayList
		 */		
		validateDisplayList():void;
		/**
		 * 在显示列表的嵌套深度
		 * @member egret.gui.ILayoutManagerClient#nestLevel
		 */		
		nestLevel:number;
		/**
		 * 是否完成初始化。此标志只能由 LayoutManager 修改。
		 * @member egret.gui.ILayoutManagerClient#initialized
		 */		
		initialized:boolean;
		/**
		 * 一个标志，用于确定某个对象是否正在等待分派其updateComplete事件。此标志只能由 LayoutManager 修改。
		 * @member egret.gui.ILayoutManagerClient#updateCompletePendingFlag
		 */		
		updateCompletePendingFlag:boolean;
		/**
		 * 父级显示对象
		 * @member egret.gui.ILayoutManagerClient#parent
		 */		
		parent:DisplayObjectContainer;
	}
}