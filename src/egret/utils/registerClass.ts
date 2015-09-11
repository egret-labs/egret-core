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
     * Registers the runtime class information for a class.This method adds some strings which represent the class name or
     * some interface names to the class definition. After the registration,you can use egret.is() method to do the type checking
     * for the instance of this class.<br/>
     * Note:If you use the TypeScript programming language, the egret command line tool will automatically generate the registration code line.
     * You don't need to manually call this method.
     *
     * @example the following code shows how to register the runtime class information for the EventDispatcher class and do the type checking:
     * <pre>
     *      egret.registerClass(egret.EventDispatcher,"egret.EventDispatcher",["egret.IEventDispatcher"]);
     *      var dispatcher = new egret.EventDispatcher();
     *      egret.log(egret.is(dispatcher, "egret.IEventDispatcher"));  //true。
     *      egret.log(egret.is(dispatcher, "egret.EventDispatcher"));   //true。
     *      egret.log(egret.is(dispatcher, "egret.Bitmap"));   //false。
     * </pre>
     * @param classDefinition the class definition to be registered.
     * @param className  a unique identification string of the specific class
     * @param interfaceNames a list of unique identification string of the specific interfaces.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 为一个类定义注册运行时类信息,用此方法往类定义上注册它自身以及所有接口对应的字符串。
     * 在运行时，这个类的实例将可以使用 egret.is() 方法传入一个字符串来判断实例类型。
     * @example 以下代码演示了如何为EventDispatcher类注册运行时类信息并判断类型：
     * <pre>
     *      //为egret.EventDispatcher类注册运行时类信息，由于它实现了IEventDispatcher接口，这里应同时传入接口名对应的字符串。
     *      egret.registerClass(egret.EventDispatcher,"egret.EventDispatcher",["egret.IEventDispatcher"]);
     *      var dispatcher = new egret.EventDispatcher();
     *      egret.log(egret.is(dispatcher, "egret.IEventDispatcher"));  //true。
     *      egret.log(egret.is(dispatcher, "egret.EventDispatcher"));   //true。
     *      egret.log(egret.is(dispatcher, "egret.Bitmap"));   //false。
     * </pre>
     * 注意：若您使用 TypeScript 来编写程序，egret 命令行会自动帮您生成类信息注册代码行到最终的 Javascript 文件中。因此您不需要手动调用此方法。
     *
     * @param classDefinition 要注册的类定义。
     * @param className 要注册的类名。
     * @param interfaceNames 要注册的类所实现的接口名列表。
     * @version Egret 2.4
     * @platform Web,Native
     */
    export function registerClass(classDefinition:any, className:string, interfaceNames?:string[]):void {
        if (DEBUG) {
            if (!classDefinition) {
                $error(1003, "classDefinition");
            }
            if (!classDefinition.prototype) {
                $error(1012, "classDefinition")
            }
            if (className === void 0) {
                $error(1003, "className");
            }
        }
        var prototype:any = classDefinition.prototype;
        prototype.__class__ = className;
        var types = [className];
        if (interfaceNames) {
            types = types.concat(interfaceNames);
        }
        var superTypes = prototype.__types__;
        if (prototype.__types__) {
            var length = superTypes.length;
            for(var i=0;i<length;i++){
                var name = superTypes[i];
                if(types.indexOf(name)==-1){
                    types.push(name);
                }
            }
        }
        prototype.__types__ = types;
    }
}