//////////////////////////////////////////////////////////////////////////////////////
//
//  The MIT License (MIT)
//
//  Copyright (c) 2015-present, Dom Chen.
//  All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy of
//  this software and associated documentation files (the "Software"), to deal in the
//  Software without restriction, including without limitation the rights to use, copy,
//  modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
//  and to permit persons to whom the Software is furnished to do so, subject to the
//  following conditions:
//
//      The above copyright notice and this permission notice shall be included in all
//      copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
//  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
//  PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
//  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
//  OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
//  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//////////////////////////////////////////////////////////////////////////////////////


namespace ts {

    /**
     * @private
     */
    let getDefinitionByNameCache = {};

    /**
     * Returns a reference to the class object of the class specified by the name parameter.
     * @param name The name of a class.
     */
    export function getDefinitionByName(name:string):any {
        if (!name)
            return null;
        let definition = getDefinitionByNameCache[name];
        if (definition) {
            return definition;
        }
        let paths = name.split(".");
        let length = paths.length;
        definition = __global;
        for (let i = 0; i < length; i++) {
            let path = paths[i];
            definition = definition[path];
            if (!definition) {
                return null;
            }
        }
        getDefinitionByNameCache[name] = definition;
        return definition;
    }

    /**
     * Return the fully qualified class name of an object
     * @param value The object for which a fully qualified class name is desired. Any JavaScript value may be passed to
     * this method including all available JavaScript types, object instances, primitive types such as number, and class objects.
     * @returns A string containing the fully qualified class name.
     */
    export function getQualifiedClassName(value:any):string {
        let type = typeof value;
        if (!value || (type != "object" && !value.prototype)) {
            return type;
        }
        let prototype:any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        let constructorString:string = prototype.constructor.toString().trim();
        let index:number = constructorString.indexOf("(");
        let className:string = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }

    /**
     * Returns the fully qualified class name of the base class of the object specified by the value parameter.
     * @param value The object for which a parent class is desired. Any JavaScript value may be passed to this method including
     * all available JavaScript types, object instances, primitive types such as number, and class objects.
     * @returns  A fully qualified base class name, or null if none exists.
     */
    export function getQualifiedSuperclassName(value:any):string {
        if (!value || (typeof value != "object" && !value.prototype)) {
            return null;
        }
        let prototype:any = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        let superProto = Object.getPrototypeOf(prototype);
        if (!superProto) {
            return null;
        }
        let superClass = getQualifiedClassName(superProto.constructor);
        if (!superClass) {
            return null;
        }
        return superClass;
    }

    /**
     * Indicates whether an object is a instance of the class or interface specified as the parameter.This method can indicate
     * whether an object is a instance of the specific interface even though the interface does not exist at JavaScript runtime.
     * @param instance the instance to be checked.
     * @param typeName the string value representing a specific class or interface.
     * @returns A value of true if the object is a instance of the class or interface specified as the parameter.
     * @example
     * <pre>
     *     var instance = new ts.Sprite();
     *     console.log(ts.is(instance,"ts.Sprite"))                  // true
     *     console.log(ts.is(instance,"ts.DisplayObjectContainer"))  // true, because ts.DisplayObjectContainer is the superclass of ts.Sprite.
     *     console.log(ts.is(instance,"ts.Bitmap"))                  // false, because ts.Bitmap is not the superclass of ts.Sprite.
     * </pre>
     */
    export function is(instance:any, typeName:string):boolean {
        if (!instance || typeof instance != "object") {
            return false;
        }
        let prototype:any = Object.getPrototypeOf(instance);
        let types = prototype ? prototype.__types__ : null;
        if (!types) {
            return false;
        }
        return (types.indexOf(typeName) !== -1);
    }
}

var __global = this.__global || this;
