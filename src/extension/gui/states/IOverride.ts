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

/// <reference path="../core/IContainer.ts"/>
/// <reference path="../core/IStateClient.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.IOverride
	 * @interface
	 * @classdesc
	 * IOverride 接口用于视图状态覆盖。State 类 overrides 属性数组中的所有条目均必须实现此接口。
	 */	
	export interface IOverride{
		/**
		 * 初始化覆盖。在第一次调用 apply() 方法之前调用此方法，因此将覆盖的一次性初始化代码放在此方法中。 
		 * @method ns_egret.IOverride#initialize
		 * @param parent {IStateClient} 
		 */		 
		initialize(parent:IStateClient):void;
		/**
		 * 应用覆盖。将保留原始值，以便以后可以在 remove() 方法中恢复该值。 
		 * @method ns_egret.IOverride#apply
		 * @param parent {IContainer} 
		 */			
		apply(parent:IContainer):void;
		/**
		 * 删除覆盖。在 apply() 方法中记住的值将被恢复。 
		 * @method ns_egret.IOverride#remove
		 * @param parent {IContainer} 
		 */		
		remove(parent:IContainer):void;
	}
}