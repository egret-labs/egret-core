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
     * 返回一个对象的完全限定名<br/>
     * @param value 需要完全限定类名称的对象，可以将任何 TypeScript / JavaScript值传递给此方法，包括所有可用的TypeScript / JavaScript类型、对象实例、原始类型（如number）和类对象
     * @returns {string} 包含完全限定类名称的字符串<br />
     * 在Flash中，此方法返回的是类的全名，如 Bitmap对象返回 flash.display.Bitmap <br/>
     * 在Egret中，由于JavaScript语言自身的限制，Bitmap对象返回 Bitmap而非 ns_egret.Bitmap <br/r>
     * @example
     *  ns_egret.getQualifiedClassName(ns_egret.DisplayObject) //返回 DisplayObject
     *  ns_egret.getQualifiedClassName(new ns_egret.DisplayObject()) //返回 DisplayObject
     *  ns_egret.getQualifiedClassName(19910901) //返回 Number
     *  ns_egret.getQualifiedClassName("Hello,Egret") //返回 String
     */
    export function getQualifiedClassName(value:any) {
        var constructorFunction;
        var constructorString:string;
        if (value.prototype) {
            constructorFunction = value.prototype.constructor;
        }
        else {
            constructorFunction = value.__proto__.constructor;
        }
        if (!__getQualifiedClassName__cache[constructorFunction]) {
            constructorString = constructorFunction.toString();
            var index:number = constructorString.indexOf("(");
            var result:string = constructorString.substring(9, index);
            __getQualifiedClassName__cache[constructorFunction] = result;
        }
        return __getQualifiedClassName__cache[constructorFunction]
    }


    var __getQualifiedClassName__cache:Object = {};


}