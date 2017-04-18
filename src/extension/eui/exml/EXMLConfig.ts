//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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

namespace eui.sys {

    /**
     * @private
     * EUI 命名空间
     */
    export let NS_S:string = "http://ns.egret.com/eui";
    /**
     * @private
     * Wing命名空间
     */
    export let NS_W:string = "http://ns.egret.com/wing";
    let coreClasses:string[] = ["Point","Matrix","Rectangle"];
    let basicTypes:string[] = ["Array", "boolean", "string", "number"];

    let MODULE_NAME = "eui.";

    let hashCount = 0;

    let properties: any = {};

    /**
     * @private
     */
    export class EXMLConfig {

        /**
         * @private
         */
        $describe(instance:any):any {
            if (!instance) {
                return null;
            }
            let prototype = Object.getPrototypeOf(instance);
            if (!prototype) {
                return null;
            }
            let info:any;
            if(prototype.hasOwnProperty("__hashCode__")){

                info = properties[prototype.__hashCode__];
                if(info){
                    return info;
                }
            }

            let superProto = Object.getPrototypeOf(prototype);
            if (!superProto) {
                return null;
            }

            let superInstance = getInstanceOf(superProto.constructor);
            let superInfo = this.$describe(superInstance);
            if (superInfo) {
                let factory = function():void {
                }

                factory.prototype = superInfo;
                info = new factory();
            }
            else {
                info = {};
            }
            if(DEBUG){
                info.__class__ = prototype.constructor.name;
            }
            let keys = Object.keys(prototype).concat(Object.keys(instance));
            let length = keys.length;
            let meta = instance.__meta__;
            for (let i = 0; i < length; i++) {
                let key = keys[i];
                if (key == "constructor" || key.charAt(0) == "_" || key.charAt(0) == "$") {
                    continue;
                }
                let resultType:string;
                if (meta && meta[key]) {
                    resultType = meta[key];
                }
                else if (isArray(instance[key])) {
                    resultType = "Array";
                }
                else {
                    resultType = typeof instance[key];
                    if (resultType == "function") {
                        continue;
                    }
                    if (basicTypes.indexOf(resultType) == -1) {
                        resultType = "any";
                    }
                }
                info[key] = resultType;
            }
            if (Object.getPrototypeOf(superProto)) {
                prototype.__hashCode__ = hashCount++;
                properties[prototype.__hashCode__] = info;
            }
            return info;
        }

        /**
         * @private
         * 根据类的短名ID和命名空间获取完整类名(以"."分隔)
         * @param id 类的短名ID
         * @param ns 命名空间
         */
        public getClassNameById(id:string, ns:string):string {
            if(ns==NS_S){
                if (id == "Object") {
                    return id;
                }
                if(coreClasses.indexOf(id)!=-1){
                    return "egret."+id;
                }
            }

            let name:string = "";
            if (basicTypes.indexOf(id) != -1) {
                return id;
            }
            if (ns == NS_W) {

            }
            else if (!ns || ns == NS_S) {
                name = MODULE_NAME + id;
            }
            else {
                name = ns.substring(0, ns.length - 1) + id
            }
            if (!getPrototypeOf(name)) {
                name = "";
            }
            return name;
        }

        /**
         * @private
         * 根据ID获取对应的默认属性
         * @param id 类的短名ID
         * @param ns 命名空间
         * @return 默认属性名
         */
        public getDefaultPropById(id:string, ns:string):string {
            let className:string = this.getClassNameById(id, ns);
            let prototype = getPrototypeOf(className);
            let property:string;
            if (prototype) {
                property = prototype.__defaultProperty__;
            }
            return property?property:"";
        }

        /**
         * @private
         * 获取指定属性的类型,返回基本数据类型："boolean","string","number","any"。
         * @param property 属性名
         * @param className 要查询的完整类名
         */
        public getPropertyType(property:string, className:string):string {
            if (className == "Object") {
                return "any";
            }
            let resultType:string = "";
            let prototype = getPrototypeOf(className);
            if (prototype) {
                if (!prototype.hasOwnProperty("__hashCode__")) {
                    let clazz = egret.getDefinitionByName(className);
                    let instance = getInstanceOf(clazz);
                    if (!instance) {
                        if (DEBUG) {
                            egret.$warn(2104, className);
                        }
                        return resultType;
                    }
                    this.$describe(instance);
                }
                let info = properties[prototype.__hashCode__];
                if (info) {
                    resultType = info[property];
                }
            }
            return resultType;
        }
    }

    /**
     * @private
     * 判断一个对象是数组
     */
    function isArray(o:any):boolean {
        return Object.prototype.toString.call(o) === '[object Array]';
    }

    /**
     * @private
     * 获取一个类名对应的prototype引用
     */
    function getPrototypeOf(className:string):any {
        let clazz = egret.getDefinitionByName(className);
        if (!clazz) {
            return null;
        }
        return clazz.prototype;
    }

    /**
     * @private
     * 创建一个类名对应的实例
     */
    function getInstanceOf(clazz:any):any {
        if (!clazz) {
            return null;
        }
        let instance:any;
        if(DEBUG){
            try {
                instance = new clazz();
            }
            catch (e) {
                egret.error(e);
                return null;
            }
        }else{
            instance = new clazz();
        }

        return instance;
    }

}
