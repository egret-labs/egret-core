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

	export interface IToolTipManagerClient extends IEventDispatcher{
		/**
		 * 此组件的工具提示数据。<br/>
		 * 此属性将赋值给工具提示显示对象的toolTipData属性。通常给此属性直接赋值一个String。<br/>
		 * 当组件的toolTipClass为空时，ToolTipManager将采用注入的默认工具提示类创建显示对象。<br/>
		 * 若toolTipClass不为空时，ToolTipManager将使用指定的toolTipClass创建显示对象。
		 */		
		toolTip:Object;
		
		/**
		 * 创建工具提示显示对象要用到的类,要实现IToolTip接口。ToolTip默认会被禁用鼠标事件。
		 * 若此属性为空，ToolTipManager将采用默认的工具提示类创建显示对象。<br/>
		 */		
		toolTipClass:any;
		
		/**
		 * toolTip弹出位置，请使用PopUpPosition定义的常量，若不设置或设置了非法的值，则弹出位置跟随鼠标。
		 */		
		toolTipPosition:string;
		/**
		 * toolTip弹出位置的偏移量
		 */		
		toolTipOffset:Point;
	}
	
}
