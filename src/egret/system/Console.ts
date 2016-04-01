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

declare module egret {

    /**
     * @language en_US
     * Writes an error message to the console if the assertion is false. If the assertion is true, nothing will happen.
     * @param assertion Any boolean expression. If the assertion is false, the message will get written to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     */
    /**
     * @language zh_CN
     * 判断参数assertion是否为true，若为false则抛出异常并且在console输出相应信息，反之什么也不做。
     * @param assertion 一个 boolean 表达式，若结果为false，则抛出错误并输出信息。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外可选信息
     */
    function assert(assertion?:boolean, message?:string, ...optionalParams:any[]):void;
    /**
     * @language en_US
     * Writes a warning message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     */
    /**
     * @language zh_CN
     * 输出一个警告信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     */
    function warn(message?:any, ...optionalParams:any[]):void;
    /**
     * @language en_US
     * Writes an error message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     */
    /**
     * @language zh_CN
     * 输出一个错误信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     */
    function error(message?:any, ...optionalParams:any[]): void;
    /**
     * @language en_US
     * Writes an message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     */
    /**
     * @language zh_CN
     * 输出一个日志信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     */
    function log(message?:any, ...optionalParams:any[]):void;
}
