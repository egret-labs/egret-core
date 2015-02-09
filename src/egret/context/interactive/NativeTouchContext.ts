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
     * @private
     */
    export class NativeTouchContext extends TouchContext {

        constructor() {
            super();
        }


        public run():void {
        }

    }


}

module egret_native {


    export function onTouchesBegin(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
        this.executeTouchCallback(num,ids,xs_array,ys_array,egret.MainContext.instance.touchContext.onTouchBegan);
    }

    export function onTouchesMove(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
        this.executeTouchCallback(num,ids,xs_array,ys_array,egret.MainContext.instance.touchContext.onTouchMove);
    }

    export function onTouchesEnd(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {
        this.executeTouchCallback(num,ids,xs_array,ys_array,egret.MainContext.instance.touchContext.onTouchEnd);
    }

    export function onTouchesCancel(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>) {

    }

    export function executeTouchCallback(num:number, ids:Array<any>, xs_array:Array<any>, ys_array:Array<any>,callback:Function) {
        for (var i = 0; i < num; i++) {
            var id = ids[i];
            var x = xs_array[i];
            var y = ys_array[i];
            callback.call(egret.MainContext.instance.touchContext,x, y,id);
        }
    }

}