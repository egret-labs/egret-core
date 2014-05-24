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

/// <reference path="../../../egret/utils/HashObject.ts"/>

module ns_egret {
	/**
	 * @class ns_egret.ClassFactory
	 * @classdesc
	 * @extends ns_egret.HashObject
	 */
    export class ClassFactory extends HashObject{

        /**
		 * @method ns_egret.ClassFactory#constructor
         * @class ns_egret.ClassFactory
         * @classdesc
         * ClassFactory 实例是一个“工厂对象”，Egret 可用其生成其他类的实例，每个实例拥有相同的属性。
         * @param generator {any} newInstance() 方法根据工厂对象生成对象时使用的 Class。
         */
        public constructor(generator:any = null){
            super();
            this.generator = generator;
        }
        /**
         * newInstance() 方法根据工厂对象生成对象时使用的 Class。
		 * @member ns_egret.ns_egret#generator
         */
        public generator:any;
        /**
         * 生产一个新的实例
		 * @method ns_egret.ns_egret#newInstance
		 * @returns {any}
         */
        public newInstance():any{
            var instance:Object = new this.generator();
            return instance;
        }
    }
}