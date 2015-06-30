//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module egret {

    /**
	 * @language en_US
     * Injector
     */
    /**
	 * @language zh_CN
     * 注入器
     */
	export class Injector{
		/**
		 * 储存类的映射规则
		 */		
		private static mapClassDic:any = {};
		
		/**
		 * @language en_US
		 * Conduct mapping injection with class definition as the value. It will be instantiated only when it's singleton is requested for the first time by using getInstance ().
		 * @param whenAskedFor {any} whenAskedFor passes class definition or fully qualified name of the class as the key to map.
		 * @param instantiateClass {any} instantiateClass passes the class as a value to be mapped, and its constructor function must be empty. If not empty, use Injector.mapValue () method to directly inject the instance.
		 * @param named {string} named, optional parameter. When the same class serves as the key to map multiple rules, this parameter can be imported to distinguish different mappings. Import the same parameters when calling getInstance () method.
		 */
		/**
		 * @language zh_CN
		 * 以类定义为值进行映射注入，当第一次用getInstance()请求它的单例时才会被实例化。
		 * @param whenAskedFor {any} whenAskedFor 传递类定义或类完全限定名作为需要映射的键。
		 * @param instantiateClass {any} instantiateClass 传递类作为需要映射的值，它的构造函数必须为空。若不为空，请使用Injector.mapValue()方法直接注入实例。
		 * @param named {string} named 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
		 */
		public static mapClass(whenAskedFor:any,instantiateClass:any,named:string=""):void{
			var requestName:string = this.getKey(whenAskedFor)+"#"+named;
			this.mapClassDic[requestName] = instantiateClass;
		}
		
		/**
		 * 获取完全限定类名
		 */		
		private static getKey(hostComponentKey:any):string{
			if(typeof(hostComponentKey)=="string")
				return <string> hostComponentKey;
			return getQualifiedClassName(hostComponentKey);
		}
		
		private static mapValueDic:any = {};
		
		/**
		 * @language en_US
		 * Conduct mapping injection with instance as the value, and always return this injected instance when a singleton is requested by using getInstance ().
		 * @param whenAskedFor {any} Pass class definition or fully qualified name of the class as the key to map.
		 * @param useValue {any} Pass object instance as a value to be mapped.
		 * @param named {string} Optional. When the same class serves as the key to map multiple rules, this parameter can be imported to distinguish different mappings. Import the same parameters when calling getInstance () method.
		 */
		/**
		 * @language zh_CN
		 * 以实例为值进行映射注入,当用getInstance()请求单例时始终返回注入的这个实例。
		 * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
		 * @param useValue {any} 传递对象实例作为需要映射的值。
		 * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
		 */
		public static mapValue(whenAskedFor:any,useValue:any,named:string=""):void{
			var requestName:string = this.getKey(whenAskedFor)+"#"+named;
			this.mapValueDic[requestName] = useValue;
		}

		/**
		 * @language en_US
		 * Check whether there is any specified mapping rule
		 * @param whenAskedFor {any} Pass class definition or fully qualified name of the class as the key to map.
		 * @param named {string} Optional. When the same class serves as the key to map multiple rules, this parameter can be imported to distinguish different mappings.
		 * @returns {boolean} Whether there is any specified mapping rule
		 */
		/**
		 * @language zh_CN
		 * 检查指定的映射规则是否存在
		 * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
		 * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。
		 * @returns {boolean} 指定的映射规则是否存在
		 */
		public static hasMapRule(whenAskedFor:any,named:string=""):boolean{
			var requestName:string = this.getKey(whenAskedFor)+"#"+named;
			if(this.mapValueDic[requestName]||this.mapClassDic[requestName]){
				return true;
			}
			return false;
		}
		/**
		 * @language en_US
		 * Get a singleton mapped by the specified class. Note: This method always returns a globally unique instance, and will not create repeatedly.
		 * @param clazz {any} Class definition or fully qualified name of the class
		 * @param named {string} Optional. If this value is set when calling mapClass () mapping, the same character string needs to be import ed in order to obtain the corresponding singleton
		 * @returns {any} Get a singleton mapped by the specified class
		 */
		/**
		 * @language zh_CN
		 * 获取指定类映射的单例，注意:这个方法总是返回全局唯一的实例，不会重复创建。
		 * @param clazz {any} 类定义或类的完全限定名
		 * @param named {string} 可选参数，若在调用mapClass()映射时设置了这个值，则要传入同样的字符串才能获取对应的单例
		 * @returns {any} 获取指定类映射的单例
		 */
		public static getInstance(clazz:any,named:string=""):any{
			var requestName:string = this.getKey(clazz)+"#"+named;
			if(this.mapValueDic[requestName])
				return this.mapValueDic[requestName];
			var returnClass:any = <any> (this.mapClassDic[requestName]);
			if(returnClass){
				var instance:any = new returnClass();
				this.mapValueDic[requestName] = instance;
				delete this.mapClassDic[requestName];
				return instance;
			}
			throw new Error(getString(1028, requestName));
		}
	}
}