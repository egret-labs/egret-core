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

    var __getDefinitionByName__cache:Object = {};
    /**
     * 返回 name 参数指定的类的类对象引用。
     * @param name 类的名称。
     * @returns {any} 返回 name 参数指定的类的类对象引用。
     * @example
     * ns_egret.getDefinitionByName("ns_egret.DisplayObject") //返回 DisplayObject类定义
     */
    export function getDefinitionByName(name:string):any{
        if(!name)
            return null;
        var definition:any = __getDefinitionByName__cache[name];
        if(definition){
            return definition;
        }
        var paths:Array<string> = name.split(".");
        var length:number = paths.length;
        definition = window;
        for(var i:number=0;i<length;i++){
            var path:string = paths[i];
            definition = definition[path];
            if(!definition){
                return null;
            }
        }
        __getDefinitionByName__cache[name] = definition;
        return definition;
    }
}