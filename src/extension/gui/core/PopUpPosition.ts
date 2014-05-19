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
	 * @class ns_egret.PopUpPosition
	 * @classdesc
	 * 定义弹出位置的常量值。
	 * 该常量决定目标对象相对于父级组件的弹出位置。
	 */	
	export class PopUpPosition{	
		/**
		 * 在组件上方弹出
		 * @constant ns_egret.PopUpPosition.ABOVE
		 */		
		public static ABOVE:string = "above";
		/**
		 * 在组件下方弹出
		 * @constant ns_egret.PopUpPosition.BELOW
		 */		
		public static BELOW:string = "below";
		/**
		 * 在组件中心弹出
		 * @constant ns_egret.PopUpPosition.CENTER
		 */		
		public static CENTER:string = "center";
		/**
		 * 在组件左上角弹出 
		 * @constant ns_egret.PopUpPosition.TOP_LEFT
		 */		
		public static TOP_LEFT:string = "topLeft";
		/**
		 * 在组件左边弹出
		 * @constant ns_egret.PopUpPosition.LEFT
		 */		
		public static LEFT:string = "left";
		/**
		 * 在组件右边弹出
		 * @constant ns_egret.PopUpPosition.RIGHT
		 */		
		public static RIGHT:string = "right";
		
		
	}
}