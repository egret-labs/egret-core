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
	 *
	 * @class ns_egret.Injector
     * @classdesc
     * 全局注入管理器，在项目中可以通过此类向框架内部注入指定的类，从而定制或者扩展部分模块的功能。
     */
	export class Injector{
		/**
		 * 储存类的映射规则
		 */		
		private static mapClassDic:any = {};
		
		/**
		 * 以类定义为值进行映射注入，只有第一次请求它的单例时才会被实例化。
		 * @method ns_egret.Injector.mapClass
		 * @param whenAskedFor {any} whenAskedFor 传递类定义或类完全限定名作为需要映射的键。
		 * @param instantiateClass {any} instantiateClass 传递类作为需要映射的值，它的构造函数必须为空。若不为空，请使用Injector.mapValue()方法直接注入实例。
		 * @param named {string} named 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
		 */
		public static mapClass(whenAskedFor:string,instantiateClass:any,named:string=""):void{
			var requestName:string = whenAskedFor+"#"+named;
			this.mapClassDic[requestName] = instantiateClass;
		}
		
		private static mapValueDic:any = {};
		
		/**
		 * 以实例为值进行映射注入,当请求单例时始终返回注入的这个实例。
		 * @method ns_egret.Injector.mapValue
		 * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
		 * @param useValue {any} 传递对象实例作为需要映射的值。
		 * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
		 */		
		public static mapValue(whenAskedFor:string,useValue:any,named:string=""):void{
			var requestName:string = whenAskedFor+"#"+named;
			this.mapValueDic[requestName] = useValue;
		}

		/**
		 * 检查指定的映射规则是否存在
		 * @method ns_egret.Injector.hasMapRule
		 * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
		 * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。
		 * @returns {boolean}
		 */
		public static hasMapRule(whenAskedFor:string,named:string=""):boolean{
			var requestName:string = whenAskedFor+"#"+named;
			if(this.mapValueDic[requestName]||this.mapClassDic[requestName]){
				return true;
			}
			return false;
		}
		/**
		 * 获取指定类映射的单例
		 * @method ns_egret.Injector.getInstance
		 * @param clazz {any} 类定义或类的完全限定名
		 * @param named {string} 可选参数，若在调用mapClass()映射时设置了这个值，则要传入同样的字符串才能获取对应的单例
		 * @returns {any}
		 */		
		public static getInstance(whenAskedFor:string,named:string=""):any{
			var requestName:string = whenAskedFor+"#"+named;
			if(this.mapValueDic[requestName])
				return this.mapValueDic[requestName];
			var returnClass:any = <any> (this.mapClassDic[requestName]);
			if(returnClass){
				var instance:any = new returnClass();
				this.mapValueDic[requestName] = instance;
				delete this.mapClassDic[requestName];
				return instance;
			}
			throw new Error("调用了未配置的注入规则！whenAskedFor#named:"+requestName+"。 请先在项目初始化里配置指定的注入规则，再调用对应单例。");
		}
	}
}