/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

module ns_egret {
    /**
     * 在window上需要读取的命名空间属性列表
     */
    export var __moduleNameList:Array<string> = ["ns_egret","dragonBones"];

    /**
     * 需要重新刷新类名的标志
     */
    export var __invalidateModuleFlag:boolean = true;

    var __functionNameCache:any = {};
    /**
     * 返回一个对象的完全限定名<br/>
     * @param value 需要完全限定类名称的对象，可以将任何 TypeScript / JavaScript值传递给此方法，包括所有可用的TypeScript / JavaScript类型、对象实例、原始类型（如number）和类对象
     * @returns {string} 包含完全限定类名称的字符串<br />
     * @example
     *  ns_egret.getQualifiedClassName(ns_egret.DisplayObject) //返回 "ns_egret.DisplayObject"
     */
    export function getQualifiedClassName(value:any):string {
        var constructorFunction:any = value.prototype ? value.prototype.constructor : value.__proto__.constructor;
        if(constructorFunction.__class__){
            return constructorFunction.__class__;
        }
        if(__invalidateModuleFlag){
            updateModules();
            __invalidateModuleFlag = false;
            if(constructorFunction.__class__){
                return constructorFunction.__class__;
            }
        }
        var key:string = constructorFunction.toString();
        var className:string = __functionNameCache[key];
        if(!className){
            __functionNameCache[key] = className = getFunctionName(constructorFunction);
        }
        return className;
    }



    function getFunctionName(constructorFunction:Function):string{
        var constructorString:string = constructorFunction.toString();
        var index:number = constructorString.indexOf("(");
        return constructorString.substring(9, index);
    }

    function updateModules():void{
//      var t:number = getTimer();
        var list:Array<string> = ns_egret.__moduleNameList;
        var length:number = list.length;
        for(var i:number=0;i<length;i++){
            var key:string = list[i];
            var value:any = __global[key];
            if(value&&typeof(value)=="object"&&value.__proto__&&
                getFunctionName(value.__proto__.constructor)=="Object"){
                setModuleName(value,key);
            }
        }

//        t = getTimer()-t;
//        console.log("updateModules: "+t+"ms");
    }

    function setModuleName(ns:any,name:string):void{
        for(var key in ns){
            var value:any = ns[key];
            var type:string = typeof(value);
            if(type=="function"){
                if(!value.prototype){
                    continue;
                }
                var func:any = value.prototype.constructor;
                if(!func.__class__){
                    func.__class__ = name+"."+getFunctionName(func);
                }
            }
            else if(type=="object"&&!(value instanceof Array)){
                setModuleName(value,name+"."+key);
            }
        }
    }


}

var __global = __global || this;
