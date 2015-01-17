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


    export class NumberUtils {

        public static isNumber(value:any):boolean {
            return typeof(value) === "number" && !isNaN(value);
        }

        public static sin(value:number):number {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            if (value < 90) {
                return egret_sin_map[NumberUtils.toDecimal(value)];
            }
            if (value < 180) {
                return egret_cos_map[NumberUtils.toDecimal(value-90)];
            }
            if (value < 270) {
                return -egret_sin_map[NumberUtils.toDecimal(value-180)];
            }
            return -egret_cos_map[NumberUtils.toDecimal(value-270)];
        }

        public static cos(value:number):number {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            if (value < 90) {
                return egret_cos_map[NumberUtils.toDecimal(value)];
            }
            if (value < 180) {
                return -egret_sin_map[NumberUtils.toDecimal(value-90)];
            }
            if (value < 270) {
                return -egret_cos_map[NumberUtils.toDecimal(value-180)];
            }
            return egret_sin_map[NumberUtils.toDecimal(value-270)];
        }

        public static toDecimal(x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return;
            }
            f = Math.round(x * 10) / 10;
            return f;
        }
    }
}

var egret_sin_map = {};
var egret_cos_map = {};

var i = 0;
while (i <= 90) {
    i = egret.NumberUtils.toDecimal(i);
    egret_sin_map[i] = Math.sin(i * egret.Matrix.DEG_TO_RAD);
    egret_cos_map[i] = Math.cos(i * egret.Matrix.DEG_TO_RAD);
    i += 0.1;
}

//对未提供bind的浏览器实现bind机制
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1),
            fToBind = this,
            fNOP = function () {
            },
            fBound = function () {
                return fToBind.apply(this instanceof fNOP && oThis
                        ? this
                        : oThis,
                    aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}