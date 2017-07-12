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
//function __extends(d, b) {
//    for (let p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
//    function __() {
//        this.constructor = d;
//    }
//
//    __.prototype = b.prototype;
//    d.prototype = new __();
//}

namespace egret {

    /**
     * Call setter properties of the parent class, instead of the other writing languages, such as super.alpha = 1;
     * @param currentClass The current class class name, non-string
     * @param thisObj The current object. Always this
     * @param type Setter property names need to call
     * @param values Value passed to the parent class
     *
     * @exmaple egret.superSetter(egret.Sprite, this, "alpha", 1);
     * @language en_US
     */
    /**
     * 调用父类的setter属性，代替其他语言的写法，如 super.alpha = 1;
     * @param thisObj 当前对象。永远都this
     * @param currentClass 当前 class 类名，非字符串
     * @param type 需要调用的setter属性名称
     * @param values 传给父类的值
     *
     * @exmaple egret.superSetter(egret.Sprite, this, "alpha", 1);
     * @language zh_CN
     */
    export function superSetter(currentClass:any, thisObj:any, type:string, ...values) {
        let cla = currentClass.prototype;

        let seters;
        if (!currentClass.hasOwnProperty("__sets__")) {
            Object.defineProperty(currentClass, "__sets__", {"value":{}});
        }
        seters = currentClass["__sets__"];

        let setF = seters[type];
        if (setF) {
            return setF.apply(thisObj, values);
        }

        let d = Object.getPrototypeOf(cla);
        if (d == null) {
            return;
        }

        while (!d.hasOwnProperty(type)) {
            d = Object.getPrototypeOf(d);

            if (d == null) {
                return;
            }
        }
        setF = Object.getOwnPropertyDescriptor(d, type).set;
        seters[type] = setF;
        setF.apply(thisObj, values);
    }

    /**
     * Get getter property value of the parent class. Instead of writing in other languages, such as super.alpha;
     * @param currentClass The current class class name, non-string
     * @param thisObj The current object. Always this
     * @param type Setter property names need to call
     * @returns {any} The value returned by the parent
     *
     * @exmaple egret.superGetter(egret.Sprite, this, "alpha");
     * @language en_US
     */
    /**
     * 获取父类的getter属性值。代替其他语言的写法，如 super.alpha;
     * @param thisObj 当前对象。永远都this
     * @param currentClass 当前 class 类名，非字符串
     * @param type 需要调用的setter属性名称
     * @returns {any} 父类返回的值
     *
     * @exmaple egret.superGetter(egret.Sprite, this, "alpha");
     * @language zh_CN
     */
    export function superGetter(currentClass:any, thisObj:any, type:string):any {
        let cla = currentClass.prototype;

        let geters;
        if (!currentClass.hasOwnProperty("__gets__")) {
            Object.defineProperty(currentClass, "__gets__", {"value":{}});
        }
        geters = currentClass["__gets__"];

        let getF = geters[type];
        if (getF) {
            return getF.call(thisObj);
        }

        let d = Object.getPrototypeOf(cla);
        if (d == null) {
            return;
        }

        while (!d.hasOwnProperty(type)) {
            d = Object.getPrototypeOf(d);

            if (d == null) {
                return;
            }
        }
        getF = Object.getOwnPropertyDescriptor(d, type).get;
        geters[type] = getF;
        return getF.call(thisObj);
    }
}