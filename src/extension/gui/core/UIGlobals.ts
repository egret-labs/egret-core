/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of UIGlobals software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and UIGlobals permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../../egret/display/Stage.ts"/>
/// <reference path="../managers/ISystemManager.ts"/>
/// <reference path="../managers/LayoutManager.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.UIGlobals
	 * @classdesc
	 */
	export class UIGlobals{

		private static _stage:Stage;
		/**
		 * 舞台引用，当第一个UIComponent添加到舞台时此属性被自动赋值
		 * @member ns_egret.UIGlobals.stage
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
		 * @method ns_egret.UIGlobals._initlize
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
		 * @member ns_egret.UIGlobals._layoutManager
		 */		
		public static _layoutManager:LayoutManager;
		/**
		 * 系统管理器列表
		 */		
		public static _systemManager:ISystemManager;
		/**
		 * 顶级应用容器
		 * @member ns_egret.UIGlobals.systemManager
		 */
		public static get systemManager():ISystemManager{
			return this._systemManager;
		}
	}
}