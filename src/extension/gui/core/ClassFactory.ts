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


module egret.gui {
	/**
	 * @class egret.gui.ClassFactory
	 * @classdesc ClassFactory 实例是一个“工厂对象”，Egret 可用其生成其他类的实例，每个实例拥有相同的属性。
	 * @extends egret.HashObject
	 */
    export class ClassFactory extends HashObject implements IFactory{

        /**
         * @method egret.gui.ClassFactory#constructor
         * @param generator {any} newInstance() 方法根据工厂对象生成对象时使用的 Class。
         */
        public constructor(generator:any = null){
            super();
            this.generator = generator;
        }
        /**
         * newInstance() 方法根据工厂对象生成对象时使用的 Class。
		 * @member egret.egret#generator
         */
        public generator: any = null;
        /**
         * 生产一个新的实例
		 * @method egret.egret#newInstance
		 * @returns {any}
         */
        public newInstance():any{
            var instance:Object = new this.generator();
            return instance;
        }
    }
}