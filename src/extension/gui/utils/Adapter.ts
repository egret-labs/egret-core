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


module egret.gui {
    /**
     * @language en_US
     * Conduct mapping injection with class definition as the value.
     * @param whenAskedFor {any} whenAskedFor passes class definition or fully qualified name of the class as the key to map.
     * @param adapterClass {any} adapterClass passes the class as a value to be mapped, and its constructor function must be empty.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 以类定义为值进行映射注入。
     * @param whenAskedFor {any} whenAskedFor 传递类定义或类完全限定名作为需要映射的键。
     * @param adapterClass {any} adapterClass 传递类作为需要映射的值，它的构造函数必须为空。
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function registerAdapter(whenAskedFor:string, adapterClass:any) {
        instance.mapClass(whenAskedFor, adapterClass);
    }

    /**
     * @private
     * @param type
     * @returns {any}
     */
    export function $getAdapter(whenAskedFor:string):any {
        return instance.getInstance(whenAskedFor);
    }

    /**
     * @language en_US
     * Injector
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    /**
     * @language zh_CN
     * 注入器
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    export class Adapter {
        /**
         * @private
         * 储存类的映射规则
         */
        private mapClassDic:any = {};


        public mapClass(whenAskedFor:any, instantiateClass:any, named:string = ""):void {
            var requestName:string = this.getKey(whenAskedFor) + "#" + named;
            this.mapClassDic[requestName] = instantiateClass;
        }

        /**
         * @private
         * 获取完全限定类名
         */
        private getKey(hostComponentKey:any):string {
            if (typeof(hostComponentKey) == "string")
                return <string> hostComponentKey;
            return getQualifiedClassName(hostComponentKey);
        }

        /**
         * @private
         */
        private mapValueDic:any = {};

        /**
         * @language en_US
         * Get a singleton mapped by the specified class. Note: This method always returns a globally unique instance, and will not create repeatedly.
         * @param clazz {any} Class definition or fully qualified name of the class
         * @param named {string} Optional. If this value is set when calling mapClass () mapping, the same character string needs to be import ed in order to obtain the corresponding singleton
         * @returns {any} Get a singleton mapped by the specified class
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取指定类映射的单例，注意:这个方法总是返回全局唯一的实例，不会重复创建。
         * @param clazz {any} 类定义或类的完全限定名
         * @param named {string} 可选参数，若在调用mapClass()映射时设置了这个值，则要传入同样的字符串才能获取对应的单例
         * @returns {any} 获取指定类映射的单例
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getInstance(clazz:any, named:string = ""):any {
            var requestName:string = this.getKey(clazz) + "#" + named;
            if (this.mapValueDic[requestName])
                return this.mapValueDic[requestName];
            var returnClass:any = <any> (this.mapClassDic[requestName]);
            if (returnClass) {
                var instance:any = new returnClass();
                this.mapValueDic[requestName] = instance;
                delete this.mapClassDic[requestName];
                return instance;
            }
            egret.$error(1028, requestName);
        }
    }

    /**
     * Resource单例
     */
    var instance:Adapter = new Adapter();
}