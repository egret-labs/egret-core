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


//此文件仅保证程序中的debug代码能够通过编译，不会生成代码，在JS代码压缩阶段，会移除所有debug代码


declare var DEBUG:boolean;
declare var RELEASE:boolean;

module egret {
    export declare function $error(code:number,...params:any[]):void;
    export declare function $warn(code:number,...params:any[]):void;
    export declare function getString(code:number, ...params:any[]):string;
    export declare function $markReadOnly(instance:any,property:string, isProperty?:boolean):void;
    export declare function $markCannotUse(instance:any, property:string, defaultVale:any):void;

    /**
     * @private
     */
    function _getString():string {
        return "";
    }
    egret.getString = _getString;

    function _error(code): void {
        throw new Error("#" + code );//使用这种方式报错能够终止后续代码继续运行
    }

    egret.$error = _error;

    function _warn():void {
    }

    egret.$warn = _warn;

    function _markReadOnly():void {
    }
    egret.$markReadOnly = _markReadOnly;

    function markCannotUse():void {
    }
    egret.$markCannotUse = markCannotUse;
}