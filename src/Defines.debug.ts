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


//此文件仅在调试版本中加载，发行版中会自动排除这个js文件，并移除代码中的所有DEBUG和RELEASE常量。
//代码中若需要编写只在调试版运行或只在发行版运行的代码，可以参考如下代码块写法：
//
//  if(DEBUG){
//      console.log("debug");
//  }
//  if(RELEASE){
//      console.log("release");
//  }
//
//以上代码块在发行版中会简化只有一个语句的代码块:
//
//  console.log("release");
//

declare var DEBUG:boolean;
declare var RELEASE:boolean;

this["DEBUG"] = true;
this["RELEASE"] = false;

module egret {
    export declare function $error(code:number, ...params:any[]):void;

    export declare function $warn(code:number, ...params:any[]):void;

    export declare function getString(code:number, ...params:any[]):string;

    export declare function $markReadOnly(instance:any, property:string, isProperty?:boolean):void;
    export declare function $markCannotUse(instance:any, property:string, defaultVale:any):void;

    /**
     * @private
     */
    function _getString(code:number, ...params:any[]):string {
        return egret.sys.tr.apply(egret.sys, arguments);
    }
    egret.getString = _getString;

    function _error(code:number, ...params:any[]):void {
        var text:string = egret.sys.tr.apply(null, arguments);
        if (DEBUG) {
            egret.sys.$logToFPS("Error #" + code + ": " + text)
        }
        throw new Error("#" + code + ": " + text);//使用这种方式报错能够终止后续代码继续运行
    }

    egret.$error = _error;

    function _warn(code:number, ...params:any[]):void {
        var text:string = egret.sys.tr.apply(null, arguments);
        if (DEBUG) {
            egret.sys.$logToFPS("Warning #" + code + ": " + text)
        }
        egret.warn("Warning #" + code + ": " + text);
    }

    egret.$warn = _warn;

    function _markReadOnly(instance:any, property:string, isProperty:boolean = true):void {
        var data:PropertyDescriptor = Object.getOwnPropertyDescriptor(isProperty ? instance.prototype : instance, property);
        if (data == null) {
            console.log(instance);
            return;
        }
        data.set = function (value:any) {
            if (isProperty) {
                egret.$warn(1010, getQualifiedClassName(instance), property);
            }
            else {
                egret.$warn(1014, getQualifiedClassName(instance), property);
            }
        };
        Object.defineProperty(instance.prototype, property, data);
    }

    egret.$markReadOnly = _markReadOnly;

    function markCannotUse(instance:any, property:string, defaultValue:any):void {
        Object.defineProperty(instance.prototype, property, {
            get: function () {
                egret.$warn(1009, getQualifiedClassName(instance), property);
                return defaultValue;
            },
            set: function (value) {
                egret.$error(1009, getQualifiedClassName(instance), property);
            },
            enumerable: true,
            configurable: true
        });
    }
    egret.$markCannotUse = markCannotUse;
}

