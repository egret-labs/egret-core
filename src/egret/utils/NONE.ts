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
     * A special member of the number data type that represents a value that is "not set".
     * For example,if you set the width property of TextField to egret.NONE,which will cancel the explicit setting of this
     * property and refresh the line breaks of the TextField.<br/>
     * Because the isNaN() method has some serious performance problems, Lark uses egret.NONE to replace NaN.
     * @version Egret 2.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 空数字。通常用于标识一个数值属性未被外部显式设置。例如对 TextField.width 赋值NONE，将会取消之前显式设置的宽度，从而让TextFiled自动测量一个合适的宽度。
     * 框架内不直接使用NaN，是因为isNaN()方法有严重的性能问题。使用 isNone() 来作为显式设置的判断依据能获得非常高的运行性能。
     * @version Egret 2.0
     * @platform Web,Native
     */
    export var NONE = NaN;//0x8000000;

    /**
     * @language en_US
     * Returns true if the value is egret.NONE(not set).
     * @param value A numeric value or mathematical expression to evaluate.
     * @version Egret 2.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 判断数字是否为NONE
     * @param value 要判断的数字
     * @version Egret 2.0
     * @platform Web,Native
     */
    export function isNone(value:number):boolean{
        return isNaN(value);
        //value = +value;
        //return value !== value;
    }

    /**
     * 
     * @param value 
     * @returns 
     * @version Egret 2.0
     * @platform Web,Native
     */
    export function isUndefined(value:any):boolean {
        return typeof value === "undefined";
    }

    /**
     * 
     * @param value 
     * @returns 
     * @version Egret 2.0
     * @platform Web,Native
     */
    export function getNumber(value:number):number {
        if (DEBUG) {
            if (isNaN(value)) {
                egret.sys.tr(1013);
            }
        }
        return +value || 0;;
    }
}