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

/// <reference path="registerClass.ts" />



declare var global;
declare var __global;
if (typeof global == 'undefined') {
    var global: any = window;
}
if (typeof __global == 'undefined') {
    var __global = global;
}

let __define = this && this.__define || function (o, p, g, s) { Object.defineProperty(o, p, { configurable: true, enumerable: true, get: g, set: s }) };

namespace egret {

    export type Nullable<T> = T | null;
    
    /**
     * The HashObject class is the base class for all objects in the Egret framework.The HashObject
     * class includes a hashCode property, which is a unique identification number of the instance.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export interface IHashObject {
        /**
         * a unique identification number assigned to this instance.
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         * @language en_US
         */
        /**
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         * @version Egret 2.4
         * @platform Web,Native
         * @readOnly
         * @language zh_CN
         */
        hashCode: number;
    }

    /**
     * @private
     * 哈希计数
     */
    export let $hashCount: number = 1;

    /**
     * The HashObject class is the base class for all objects in the Egret framework.The HashObject
     * class includes a hashCode property, which is a unique identification number of the instance.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export class HashObject implements IHashObject {

        /**
         * Initializes a HashObject
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 HashObject 对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor() {
            this.$hashCode = $hashCount++;
        }

        /**
         * @private
         */
        $hashCode: number;
        /**
         * a unique identification number assigned to this instance.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get hashCode(): number {
            return this.$hashCode;
        }
    }
}