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
	 * @class ns_egret.NavigationUnit
	 * @classdesc
	 * NavigationUnit 类为 IViewport 类的getVerticalScrollPositionDelta() 
	 * 和 getHorizontalScrollPositionDelta() 方法定义可能的值。 
	 */	
	export class NavigationUnit{
		/**
		 * 导航到文档的开头。 
		 * @constant ns_egret.NavigationUnit.HOME
		 */		
		public static HOME:number = 36;
		/**
		 * 导航到文档的末尾。 
		 * @constant ns_egret.NavigationUnit.END
		 */		
		public static END:number = 35;
		/**
		 * 向上导航一行或向上“步进”。 
		 * @constant ns_egret.NavigationUnit.UP
		 */		
		public static UP:number = 38;
		/**
		 * 向上导航一行或向上“步进”。
		 * @constant ns_egret.NavigationUnit.DOWN
		 */		
		public static DOWN:number = 40;
		/**
		 * 向上导航一行或向上“步进”。 
		 * @constant ns_egret.NavigationUnit.LEFT
		 */		
		public static LEFT:number = 37;
		/**
		 * 向右导航一行或向右“步进”。
		 * @constant ns_egret.NavigationUnit.RIGHT
		 */		
		public static RIGHT:number = 39;
		/**
		 * 向上导航一页。
		 * @constant ns_egret.NavigationUnit.PAGE_UP
		 */		
		public static PAGE_UP:number = 33;
		/**
		 * 向下导航一页。
		 * @constant ns_egret.NavigationUnit.PAGE_DOWN
		 */		
		public static PAGE_DOWN:number = 34;
		/**
		 * 向左导航一页。
		 * @constant ns_egret.NavigationUnit.PAGE_LEFT
		 */		
		public static PAGE_LEFT:number = 0x2397;
		/**
		 * 向左导航一页。
		 * @constant ns_egret.NavigationUnit.PAGE_RIGHT
		 */		
		public static PAGE_RIGHT:number = 0x2398;
	}
}