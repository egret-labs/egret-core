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

    var __getDefinitionByName__cache = {};
    /**
     * 返回 name 参数指定的类的类对象引用。
     * @param name 类的名称。
     * @returns {any} 返回 name 参数指定的类的类对象引用。
     */
    export function getDefinitionByName(name:String):any{
        if(!name)
            return null;
        var target:any = __getDefinitionByName__cache[name];
        if(target){
            return target;
        }
        var paths:Array<string> = name.split(".");
        var length:number = paths.length;
        target = window;
        for(var i:number=0;i<length;i++){
            var path:string = paths[i];
            target = target[path];
            if(!target){
                return null;
            }
        }
        __getDefinitionByName__cache[name] = target;
        return target;
    }
}