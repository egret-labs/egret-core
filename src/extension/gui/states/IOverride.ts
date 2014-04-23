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

	export interface IOverride{
		/**
		 * 初始化覆盖。在第一次调用 apply() 方法之前调用此方法，因此将覆盖的一次性初始化代码放在此方法中。 
		 */		 
		initialize(parent:IStateClient):void;
		/**
		 * 应用覆盖。将保留原始值，以便以后可以在 remove() 方法中恢复该值。 
		 */			
		apply(parent:IContainer):void;
		/**
		 * 删除覆盖。在 apply() 方法中记住的值将被恢复。 
		 */		
		remove(parent:IContainer):void;
	}
}
