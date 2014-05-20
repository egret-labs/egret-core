/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../egret/events/IEventDispatcher.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.ILayoutManagerClient
	 * @interface
	 * @classdesc
	 * 使用布局管理器的组件接口
	 * @extends ns_egret.IEventDispatcher
	 */
	export interface ILayoutManagerClient extends IEventDispatcher{
		/**
		 * 验证组件的属性
		 * @method ns_egret.ILayoutManagerClient#validateProperties
		 */		
		validateProperties():void;
		/**
		 * 验证组件的尺寸
		 * @method ns_egret.ILayoutManagerClient#validateSize
		 * @param recursive? {boolean} 
		 */		
		validateSize(recursive?:boolean):void;
		/**
		 * 验证子项的位置和大小，并绘制其他可视内容
		 * @method ns_egret.ILayoutManagerClient#validateDisplayList
		 */		
		validateDisplayList():void;
		/**
		 * 在显示列表的嵌套深度
		 * @member ns_egret.ILayoutManagerClient#nestLevel
		 */		
		nestLevel:number;
		/**
		 * 是否完成初始化。此标志只能由 LayoutManager 修改。
		 * @member ns_egret.ILayoutManagerClient#initialized
		 */		
		initialized:boolean;
		/**
		 * 一个标志，用于确定某个对象是否正在等待分派其updateComplete事件。此标志只能由 LayoutManager 修改。
		 * @member ns_egret.ILayoutManagerClient#updateCompletePendingFlag
		 */		
		updateCompletePendingFlag:boolean;
		/**
		 * 父级显示对象
		 * @member ns_egret.ILayoutManagerClient#parent
		 */		
		parent:DisplayObjectContainer;
	}
}