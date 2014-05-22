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
     * IHashObject是哈希对象接口。引擎内所有接口的基类,为对象实例提供唯一的hashCode值,提高对象比较的性能。
     * 注意：自定义对象请直接继承HashObject，而不是实现此接口。否则会导致hashCode不唯一。
     * @interface
     * @class ns_egret.IHashObject
     */
    export interface IHashObject {
        /**
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         * @member {number} ns_egret.IHashObject#hashCode
         */
        hashCode:number;
    }
}