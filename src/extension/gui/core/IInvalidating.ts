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
	 * @class ns_egret.IInvalidating
	 * @interface
	 * @classdesc
	 * 拥有失效验证机制组件接口
	 */
	export interface IInvalidating{
		/**
		 * 标记提交过需要延迟应用的属性
		 * @method ns_egret.IInvalidating#invalidateProperties
		 */			
		invalidateProperties():void;
		/**
		 * 标记提交过需要验证组件尺寸
		 * @method ns_egret.IInvalidating#invalidateSize
		 */	
		invalidateSize():void;
		/**
		 * 标记需要验证显示列表
		 * @method ns_egret.IInvalidating#invalidateDisplayList
		 */	
		invalidateDisplayList():void;
		/**
		 * 立即应用组件及其子项的所有属性 
		 * @method ns_egret.IInvalidating#validateNow
		 * @param skipDisplayList? {boolean} 是否跳过显示列表验证阶段,默认false
		 */		
		validateNow(skipDisplayList?:boolean):void;
	}
}