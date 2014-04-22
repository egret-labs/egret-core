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
module ns_egret {

	export interface ILayoutManagerClient extends IEventDispatcher{
		/**
		 * 验证组件的属性
		 */		
		validateProperties():void;
		/**
		 * 验证组件的尺寸
		 */		
		validateSize(recursive:boolean = false):void;
		/**
		 * 验证子项的位置和大小，并绘制其他可视内容
		 */		
		validateDisplayList():void;
		/**
		 * 在显示列表的嵌套深度
		 */		
		nestLevel:number;
		/**
		 * 是否完成初始化。此标志只能由 LayoutManager 修改。
		 */		
		initialized:boolean;
		/**
		 * 一个标志，用于确定某个对象是否正在等待分派其updateComplete事件。此标志只能由 LayoutManager 修改。
		 */		
		updateCompletePendingFlag:boolean;
		/**
		 * 父级显示对象
		 */		
		parent:DisplayObjectContainer;
        /**
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。
         */
        hashCode:number;
	}
}