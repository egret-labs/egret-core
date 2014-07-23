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

    var __setTimeout__cache:any = {};
    var __setTimeout__index:number = 0;

    export function setTimeout(callback:Function, thisObj:any, time:number, ...args):number {
        var data = {callback: callback, thisObj: thisObj, time: time, params: args};
        if (__setTimeout__index == 0) {
            Ticker.getInstance().register(timeoutUpdate, null);
        }
        __setTimeout__index++;
        __setTimeout__cache[__setTimeout__index] = data;
        return __setTimeout__index;
    }

    export function clearTimeout(num:number):void {
        delete __setTimeout__cache[num];
    }

    function timeoutUpdate(dt:number):void {
        for (var key in __setTimeout__cache) {
            var data = __setTimeout__cache[key];
            data.time -= dt;
            if (data.time <= 0) {
                data.callback.apply(data.thisObj, data.params);
                delete __setTimeout__cache[key];
            }
        }
    }
}