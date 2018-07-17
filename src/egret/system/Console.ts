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

declare namespace egret {

    /**
     * Writes a warning message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     * @language en_US
     */
    /**
     * 输出一个警告信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     * @language zh_CN
     */
    function warn(message?:any, ...optionalParams:any[]):void;
    /**
     * Writes an error message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     * @language en_US
     */
    /**
     * 输出一个错误信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     * @language zh_CN
     */
    function error(message?:any, ...optionalParams:any[]): void;
    /**
     * Writes an message to the console.
     * @param message the message written to the console
     * @param optionalParams the extra messages written to the console
     * @language en_US
     */
    /**
     * 输出一个日志信息到控制台。
     * @param message 要输出到控制台的信息
     * @param optionalParams 要输出到控制台的额外信息
     * @language zh_CN
     */
    function log(message?:any, ...optionalParams:any[]):void;
}
