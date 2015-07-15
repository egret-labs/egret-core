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
	 * @class egret.gui.UIGlobals
	 * @classdesc
	 */
	export class UIGlobals{

		private static _stage:Stage;
		/**
		 * 舞台引用，当第一个UIComponent添加到舞台时此属性被自动赋值
		 * @member egret.gui.UIGlobals.stage
		 */		
		public static get stage():Stage{
			return UIGlobals._stage;
		}
		/**
		 * 已经初始化完成标志
		 */		
		private static initlized:boolean = false;
		/**
		 * 初始化管理器
		 * @param stage {Stage}
		 */		
		public static _initlize(stage:Stage):void{
			if(UIGlobals.initlized)
				return;
            UIGlobals._stage = stage;
            UIGlobals._layoutManager = new LayoutManager();
            UIGlobals.initlized = true;
		}
		/**
		 * 延迟渲染布局管理器 
		 */
		public static _layoutManager:LayoutManager;
		/**
		 * 系统管理器列表
		 */		
		public static _uiStage:IUIStage;
		/**
		 * 顶级应用容器
		 * @member egret.gui.UIGlobals.uiStage
		 */
		public static get uiStage():IUIStage{
			return UIGlobals._uiStage;
		}
	}
}