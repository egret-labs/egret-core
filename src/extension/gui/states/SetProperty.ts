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

module ns_egret {

	export class SetProperty extends OverrideBase{
		/**
		 * 构造函数
		 */		
		public constructor(){
			super();
		}
		
		/**
		 * 要修改的属性名
		 */		
		public name:string;
		
		/**
		 * 目标实例名
		 */		
		public target:string;
		
		/**
		 * 属性值 
		 */		
		public value:any;
		
		/**
		 * 旧的属性值 
		 */		
		private oldValue:any;
		
		public apply(parent:IContainer):void{   
			var obj:any = this.target==null||this.target==""?parent:parent[this.target];
			if(obj==null)
				return;
			this.oldValue = obj[this.name];
			this.setPropertyValue(obj, this.name, this.value, this.oldValue);
		}
		
		public remove(parent:IContainer):void{   
			var obj:any = this.target==null||this.target==""?parent:parent[this.target];
			if(obj==null)
				return;
			this.setPropertyValue(obj, this.name, this.oldValue, this.oldValue);
			this.oldValue = null;
		}
		
		/**
		 * 设置属性值
		 */		
		private setPropertyValue(obj:any, name:string, value:any,
										  valueForType:any):void{
			if (value === undefined || value === null)
				obj[name] = value;
			else if (typeof(valueForType) == "boolean")
				obj[name] = this.toBoolean(value);
			else
				obj[name] = value;
		}
		/**
		 * 转成Boolean值
		 */		
		private toBoolean(value:any):boolean{
			if (typeof(value) == "string")
				return value.toLowerCase() == "true";
			
			return value != false;
		}
	}
	
}
