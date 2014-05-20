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
	 * @class ns_egret.ColumnAlign
	 * @classdesc
	 * ColumnAlign 类为 TileLayout 类的 columnAlign 属性定义可能的值。
	 */
	export class ColumnAlign{
		/**
		 * 不将行两端对齐。 
		 * @constant ns_egret.ColumnAlign.LEFT
		 */		
		public static LEFT:string = "left";
		
		/**
		 * 通过增大水平间隙将行两端对齐。
		 * @constant ns_egret.ColumnAlign.JUSTIFY_USING_GAP
		 */
		public static JUSTIFY_USING_GAP:string = "justifyUsingGap";
		
		/**
		 * 通过增大行高度将行两端对齐。 
		 * @constant ns_egret.ColumnAlign.JUSTIFY_USING_WIDTH
		 */		
		public static JUSTIFY_USING_WIDTH:string = "justifyUsingWidth";
	}
}