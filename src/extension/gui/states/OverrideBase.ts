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

/// <reference path="../../../egret/core/HashObject.ts"/>
/// <reference path="../core/IContainer.ts"/>
/// <reference path="../core/IStateClient.ts"/>
/// <reference path="IOverride.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.OverrideBase
	 * @classdesc
	 * OverrideBase 类是视图状态所用的 override 类的基类。
	 * @extends ns_egret.HashObject
	 * @implements ns_egret.IOverride
	 */	
	export class OverrideBase extends HashObject implements IOverride{
		/**
		 * @method ns_egret.OverrideBase#constructor
		 */
		public constructor() {
            super();
        }
		/**
		 * @method ns_egret.OverrideBase#initialize
		 * @param parent {IStateClient} 
		 */
		public initialize(parent:IStateClient):void {
		}
		
		/**
		 * @method ns_egret.OverrideBase#apply
		 * @param parent {IContainer} 
		 */
		public apply(parent:IContainer):void {
			
		}
		
		/**
		 * @method ns_egret.OverrideBase#remove
		 * @param parent {IContainer} 
		 */
		public remove(parent:IContainer):void {
			if(parent===null)
            {

            }
		}
		/**
		 * 从对象初始化，这是一个便利方法
		 * @method ns_egret.OverrideBase#initializeFromObject
		 * @param properties {any} 
		 * @returns {any}
		 */		
		public initializeFromObject(properties:any):any{
			for (var p in properties){
				this[p] = properties[p];
			}
			return this;
		}
		
	}
	
}