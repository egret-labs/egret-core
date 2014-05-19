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
	 * @class ns_egret.ProgressBarDirection
	 * @classdesc
	 * 定义进度条控件增长方向的常量
	 */
	export class ProgressBarDirection{
		/**
		 * 水平从左到右增长
		 * @constant ns_egret.ProgressBarDirection.LEFT_TO_RIGHT
		 */		
		public static LEFT_TO_RIGHT:string = "leftToRight";
		/**
		 * 水平从右到左增长
		 * @constant ns_egret.ProgressBarDirection.RIGHT_TO_LEFT
		 */		
		public static RIGHT_TO_LEFT:string = "rightToLeft";
		/**
		 * 竖直从上到下增长
		 * @constant ns_egret.ProgressBarDirection.TOP_TO_BOTTOM
		 */		
		public static TOP_TO_BOTTOM:string = "topToBottom";
		/**
		 * 竖直从下到上增长
		 * @constant ns_egret.ProgressBarDirection.BOTTOM_TO_TOP
		 */		
		public static BOTTOM_TO_TOP:string = "bottomToTop";
	}
}