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

	export class OverrideBase implements IOverride{
		public constructor() {
            super();
        }
		public initialize(parent:IStateClient):void {
		}
		
		public apply(parent:IContainer):void {
			
		}
		
		public remove(parent:IContainer):void {
			if(parent===null)
            {

            }
		}
		/**
		 * 从对象初始化，这是一个便利方法
		 */		
		public initializeFromObject(properties:any):any{
			for (var p:string in properties){
				this[p] = properties[p];
			}
			return this;
		}
		
	}
	
}