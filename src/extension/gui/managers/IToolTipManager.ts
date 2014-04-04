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

	export interface IToolTipManager{
		/**
		 * 当前的IToolTipManagerClient组件
		 */			
		currentTarget:IToolTipManagerClient;
		
		/**
		 * 当前可见的ToolTip显示对象；如果未显示ToolTip，则为 null。
		 */		
		currentToolTip:IToolTip;
		
		/**
		 * 如果为 true，则当用户将鼠标指针移至组件上方时，ToolTipManager会自动显示工具提示。
		 * 如果为 false，则不会显示任何工具提示。
		 */		
		enabled:boolean;
		
		/**
		 * 自工具提示出现时起，ToolTipManager要隐藏此提示前所需等待的时间量（以毫秒为单位）。默认值：10000。
		 */		
		hideDelay:number;
		
		/**
		 * 当第一个ToolTip显示完毕后，若在此时间间隔内快速移动到下一个组件上，
		 * 就直接显示ToolTip而不延迟showDelay。默认值：100。
		 */		
		scrubDelay:number;
		
		/**
		 * 当用户将鼠标移至具有工具提示的组件上方时，等待 ToolTip框出现所需的时间（以毫秒为单位）。
		 * 若要立即显示ToolTip框，请将toolTipShowDelay设为0。默认值：200。
		 */			
		showDelay:number;
		
		/**
		 * 全局默认的创建工具提示要用到的类。
		 */		
		toolTipClass:Class;
		
		/**
		 * 注册需要显示ToolTip的组件
		 * @param target 目标组件
		 * @param oldToolTip 之前的ToolTip数据
		 * @param newToolTip 现在的ToolTip数据
		 */		
		registerToolTip(target:DisplayObject,
													oldToolTip:Object,
													newToolTip:Object):void;
		
		/**
		 * 使用指定的ToolTip数据,创建默认的ToolTip类的实例，然后在舞台坐标中的指定位置显示此实例。
		 * 保存此方法返回的对 ToolTip 的引用，以便将其传递给destroyToolTip()方法销毁实例。
		 * @param toolTipData ToolTip数据
		 * @param x 舞台坐标x
		 * @param y 舞台坐标y
		 * @return 创建的ToolTip实例引用
		 */		
		createToolTip(toolTipData:string, x:number, y:number):IToolTip;

		/**
		 * 销毁由createToolTip()方法创建的ToolTip实例。 
		 * @param toolTip 要销毁的ToolTip实例
		 */		
		destroyToolTip(toolTip:IToolTip):void;
	}
}