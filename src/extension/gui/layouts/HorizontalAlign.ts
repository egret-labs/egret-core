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

	export class HorizontalAlign{
		/**
		 * 将子项与容器的左侧对齐。 
		 */		
		public static LEFT:string = "left";
		/**
		 * 在容器的中心对齐子项。 
		 */		
		public static CENTER:string = "center";
		/**
		 * 将子项与容器的右侧对齐。 
		 */		
		public static RIGHT:string = "right";
		
		/**
		 * 相对于容器对齐子项。这将会以容器宽度为标准，调整所有子项的宽度，使其始终填满容器。
		 */	
		public static JUSTIFY:string = "justify";
		/**
		 * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的内容宽度contentWidth。
		 * 容器的内容宽度是最大子项的大小。如果所有子项都小于容器的宽度，则会将所有子项的大小调整为容器的宽度。 
		 */		
		public static CONTENT_JUSTIFY:string = "contentJustify";
	}
}