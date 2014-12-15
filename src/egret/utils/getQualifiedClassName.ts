/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

module egret {
    /**
     * 返回一个对象的完全限定名<br/>
	 * @method egret.getQualifiedClassName
     * @param value {any} 需要完全限定类名称的对象，可以将任何 TypeScript / JavaScript值传递给此方法，包括所有可用的TypeScript / JavaScript类型、对象实例、原始类型（如number）和类对象
	 * @returns {string}
     * @example
     *  egret.getQualifiedClassName(egret.DisplayObject) //返回 "egret.DisplayObject"
     */
    export function getQualifiedClassName(value:any):string {
        var prototype: any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if(prototype.hasOwnProperty("__class__")){
            return prototype["__class__"];
        }
        var constructorString:string = prototype.constructor.toString();
        var index:number = constructorString.indexOf("(");
        var className:string = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }

    
     /**
     * 返回一个对象的父类完全限定名<br/>
     * @method egret.getQualifiedSuperclassName
     * @param value {any} 需要取得父类的对象，可以将任何 TypeScript / JavaScript值传递给此方法，包括所有可用的TypeScript / JavaScript类型、对象实例、原始类型（如number）和类对象
     * @returns {Function}
     * @example
     *  egret.getQualifiedSuperclassName(egret.DisplayObjectContainer) //返回 "egret.DisplayObject"
     */
    export function getQualifiedSuperclassName(value: any):string {
        var prototype: any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__superclass__")) {
            return prototype["__superclass__"];
        }
        var superProto = Object.getPrototypeOf(prototype);
        if (superProto == null)
            return null;
        var superClass = getQualifiedClassName(superProto.constructor);
        if (!superClass)
            return null;
        Object.defineProperty(prototype, "__superclass__", {
            value: superClass,
            enumerable: false,
            writable: true
        });
        return superClass;
    }
}
