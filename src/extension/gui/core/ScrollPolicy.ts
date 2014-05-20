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

	/**
	 * @class ns_egret.ScrollPolicy
	 * @classdesc
	 * 滚动条显示策略常量
	 */
	export class ScrollPolicy{
		/**
		 * 如果子项超出父级的尺寸，则允许滚动，反之不允许滚动。
		 * @constant ns_egret.ScrollPolicy.AUTO
		 */		
		public static AUTO:string = "auto";
		
		/**
		 * 从不允许滚动。
		 * @constant ns_egret.ScrollPolicy.OFF
		 */		
		public static OFF:string = "off";
		
		/**
		 * 总是允许滚动。
		 * @constant ns_egret.ScrollPolicy.ON
		 */		
		public static ON:string = "on";
	}
}