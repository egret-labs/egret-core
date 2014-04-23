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

	export class ScrollPolicy{
		/**
		 * 如果子项超出所有者的尺寸，则显示滚动栏。在显示滚动条时并不会因滚动条尺寸而调整所有者的尺寸，因此这可能会导致 scrollbar 遮蔽控件或容器的内容。
		 */		
		public static AUTO:string = "auto";
		
		/**
		 * 从不显示滚动栏。 
		 */		
		public static OFF:string = "off";
		
		/**
		 * 总是显示滚动栏。scrollbar 的尺寸将自动添加至所有者内容的尺寸，以便在未显式指定所有者尺寸时确定该尺寸。
		 */		
		public static ON:string = "on";
	}
}