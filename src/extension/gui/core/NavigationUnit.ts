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

/// <reference path="../../../egret/ui/Keyboard.ts"/>

module ns_egret {

	export class NavigationUnit{
		/**
		 * 导航到文档的开头。 
		 */		
		public static HOME:number = Keyboard.HOME;
		/**
		 * 导航到文档的末尾。 
		 */		
		public static END:number = Keyboard.END;
		/**
		 * 向上导航一行或向上“步进”。 
		 */		
		public static UP:number = Keyboard.UP;
		/**
		 * 向上导航一行或向上“步进”。
		 */		
		public static DOWN:number = Keyboard.DOWN;
		/**
		 * 向上导航一行或向上“步进”。 
		 */		
		public static LEFT:number = Keyboard.LEFT;
		/**
		 * 向右导航一行或向右“步进”。
		 */		
		public static RIGHT:number = Keyboard.RIGHT;
		/**
		 * 向上导航一页。
		 */		
		public static PAGE_UP:number = Keyboard.PAGE_UP;
		/**
		 * 向下导航一页。
		 */		
		public static PAGE_DOWN:number = Keyboard.PAGE_DOWN;
		/**
		 * 向左导航一页。
		 */		
		public static PAGE_LEFT:number = 0x2397;
		/**
		 * 向左导航一页。
		 */		
		public static PAGE_RIGHT:number = 0x2398;
	}
}
