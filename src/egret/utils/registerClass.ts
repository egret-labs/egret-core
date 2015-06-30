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
     * Registers the class information at runtime for a class.This method will add some flags of class and interface to
     * the class definition. After the registration,you can use egret.is() method to do the type checking for the instance
     * of this class.<br/>
     * Note: The value of the custom class flag or interface Flag must not in the type range of Lark framework (from 1 to 2000)
     * or a third party library referenced to your project,it might result in a type check failure.
     * @example the following code shows how to register the class flag for the EventDispatcher class:
     * <code>
     *      egret.registerClass(egret.EventDispatcher,egret.Types.EventDispatcher,[egret.Types.IEventDispatcher]);
     *      var emitter = new egret.EventDispatcher();
     *      egret.log(egret.is(emitter, egret.Types.IEventDispatcher));  //true。
     *      egret.log(egret.is(emitter, egret.Types.EventDispatcher));   //true。
     *      egret.log(egret.is(emitter, egret.Types.Bitmap));   //false。
     * </code>
     * @param classDefinition the class definition to be registered.
     * @param classFlag  a unique identification number of the specific class
     * @param interfaceFlags a list of unique identification numbers of the specific interfaces.
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 为一个类定义注册运行时类信息,用此方法往类定义上注册它自身以及所有接口对应的枚举值。
     * 在运行时，这个类的实例将可以使用 egret.is() 方法传入一个枚举值来判断实例类型。
     * @example 以下代码演示了如何为EventEmitter类注册运行时类信息：
     * <code>
     *      //为lark.EventEmitter类注册运行时类信息，由于它实现了IEventEmitter接口，这里应同时传入两个枚举值。
     *      egret.registerClass(egret.EventDispatcher,egret.Types.EventDispatcher,[egret.Types.IEventDispatcher]);
     *      var emitter = new egret.EventDispatcher();
     *      egret.log(egret.is(emitter, egret.Types.IEventDispatcher));  //true。
     *      egret.log(egret.is(emitter, egret.Types.EventDispatcher));   //true。
     *      egret.log(egret.is(emitter, egret.Types.Bitmap));   //false。
     * </code>
     * 注意：传入的自定义枚举数值范围要避免与Lark框架(1~2000的数值)或其他第三方库的数值范围重合,
     * 否则有可能会导致运行时 egret.is() 方法类型判断错误。
     *
     * @param classDefinition 要注册的类定义。
     * @param classFlag 要注册的类对应的枚举值。
     * @param interfaceFlags 要注册的类所实现的接口的枚举值列表。
     * @version Lark 1.0
     * @platform Web,Native
     */
    export function registerClass(classDefinition:any,classFlag:number,interfaceFlags?:number[]):void{
        if (DEBUG) {
            if(!classDefinition){
                $error(1003, "classDefinition");
            }
            if(!classDefinition.prototype){
                $error(1012,"classDefinition")
            }
            if(egret.isUndefined(classFlag)){
                $error(1003, "classFlag");
            }
        }
        var prototype: any = classDefinition.prototype;
        prototype.__classFlag__ = classFlag;
        var flags = [classFlag];
        if(interfaceFlags){
            flags = flags.concat(interfaceFlags);
        }
        if(prototype.__typeFlags__){
            flags = flags.concat(prototype.__typeFlags__);
        }
        prototype.__typeFlags__ = flags;
    }
}