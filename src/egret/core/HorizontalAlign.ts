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
	 * @class ns_egret.HorizontalAlign
	 * @classdesc
	 */
	export class HorizontalAlign{
        /**
         * 左对齐
		 * @constant ns_egret.HorizontalAlign.LEFT
         */
        public static LEFT:string = "left";

        /**
         * 右对齐
		 * @constant ns_egret.HorizontalAlign.RIGHT
         */
        public static RIGHT:string = "right";

        /**
         * 水平居中对齐
		 * @constant ns_egret.HorizontalAlign.CENTER
         */
        public static CENTER:string = "center";

		/**
		 * 水平两端对齐
		 * @constant ns_egret.HorizontalAlign.JUSTIFY
		 */
		public static JUSTIFY:string = "justify";

		/**
		 * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容宽度"。
		 * 容器的"内容宽度"是最大子项的大小,如果所有子项都小于容器的宽度，则会将所有子项的大小调整为容器的宽度。
         * 注意：TextFiled不支持此对齐方式。
		 * @constant ns_egret.HorizontalAlign.CONTENT_JUSTIFY
		 */
		public static CONTENT_JUSTIFY:string = "contentJustify";
	}
}