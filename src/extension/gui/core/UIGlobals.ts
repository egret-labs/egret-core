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

	export class UIGlobals{
		/**
		 * 一个全局标志，控制在某些鼠标操作或动画特效播放时，是否开启updateAfterEvent()，开启时能增加平滑的体验感,但是会提高屏幕渲染(Render事件)的频率。默认为true。
		 */		
		public static useUpdateAfterEvent:boolean = true;
		
		private static _stage:Stage;
		/**
		 * 舞台引用，当第一个UIComponent添加到舞台时此属性被自动赋值
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
		 */		
		public static initlize(stage:Stage):void{
			if(UIGlobals.initlized)
				return;
            UIGlobals._stage = stage;
            UIGlobals.layoutManager = new LayoutManager();
            UIGlobals.initlized = true;
		}
		/**
		 * 延迟渲染布局管理器 
		 */		
		public static layoutManager:LayoutManager;
		/**
		 * 系统管理器列表
		 */		
		public static _systemManagers:Array<ISystemManager> = new Array<ISystemManager>();
		/**
		 * 顶级应用容器
		 */
		public static get systemManager():ISystemManager{
			for(var i:number=UIGlobals._systemManagers.length-1;i>=0;i--){
				if(UIGlobals._systemManagers[i].stage)
					return UIGlobals._systemManagers[i];
			}
			return null;
		}
	}
}