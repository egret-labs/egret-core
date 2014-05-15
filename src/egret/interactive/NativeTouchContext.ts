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

/// <reference path="../core/MainContext.ts"/>
/// <reference path="TouchContext.ts"/>

module ns_egret {


    export class NativeTouchContext extends TouchContext {

        constructor() {
            super();
        }


        public run():void {
        }

    }


}

module egret {


    export function onTouchesBegin(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
        this.executeTouchCallback(num,ids,xs_array,ys_array,ns_egret.MainContext.instance.touchContext.onTouchBegan);
    }

    export function onTouchesMove(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
        this.executeTouchCallback(num,ids,xs_array,ys_array,ns_egret.MainContext.instance.touchContext.onTouchMove);
    }

    export function onTouchesEnd(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
        this.executeTouchCallback(num,ids,xs_array,ys_array,ns_egret.MainContext.instance.touchContext.onTouchEnd);
    }

    export function onTouchesCancel(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {

    }

    export function executeTouchCallback(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>,callback:Function) {
        for (var i = 0; i < num; i++) {
            var id = ids[i];
            var x = xs_array[i];
            var y = ys_array[i];
            callback.call(ns_egret.MainContext.instance.touchContext,x, y,id);
            console.log(ids[i]);
            console.log(xs_array[i]);
            console.log(ys_array[i]);
        }
    }

}