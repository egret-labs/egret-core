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

module egret {


    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class NumberUtils {

        /**
         * @language en_US
         * Judge whether it is a numerical value
         * @param value Parameter that needs to be judged
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 判断是否是数值
         * @param value 需要判断的参数
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static isNumber(value:any):boolean {
            return typeof(value) === "number" && !isNaN(value);
        }

        /**
         * @language en_US
         * Obtain the approximate sin value of the corresponding angle value
         * @param value {number} Angle value
         * @returns {number} sin value
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static sin(value:number):number {
            var valueFloor:number = Math.floor(value);
            var valueCeil:number = valueFloor + 1;
            var resultFloor:number = NumberUtils.sinInt(valueFloor);
            var resultCeil:number = NumberUtils.sinInt(valueCeil);

            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        }

        /**
         * @private
         * 
         * @param value 
         * @returns 
         */
        private static sinInt(value:number):number
        {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            if (value < 90) {
                return egret_sin_map[value];
            }
            if (value < 180) {
                return egret_cos_map[value - 90];
            }
            if (value < 270) {
                return -egret_sin_map[value - 180];
            }
            return -egret_cos_map[value - 270];
        }

        /**
         * @language en_US
         * Obtain the approximate cos value of the corresponding angle value
         * @param value {number} Angle value
         * @returns {number} cos value
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static cos(value:number):number {
            var valueFloor:number = Math.floor(value);
            var valueCeil:number = valueFloor + 1;
            var resultFloor:number = NumberUtils.cosInt(valueFloor);
            var resultCeil:number = NumberUtils.cosInt(valueCeil);

            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        }

        /**
         * @private
         * 
         * @param value 
         * @returns 
         */
        private static cosInt(value:number):number
        {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            if (value < 90) {
                return egret_cos_map[value];
            }
            if (value < 180) {
                return -egret_sin_map[value - 90];
            }
            if (value < 270) {
                return -egret_cos_map[value - 180];
            }
            return egret_sin_map[value - 270];
        }

    }
}

var egret_sin_map = {};
var egret_cos_map = {};

var DEG_TO_RAD:number = Math.PI / 180;

for (var NumberUtils_i = 0; NumberUtils_i <= 90; NumberUtils_i++) {
    egret_sin_map[NumberUtils_i] = Math.sin(NumberUtils_i * DEG_TO_RAD);
    egret_cos_map[NumberUtils_i] = Math.cos(NumberUtils_i * DEG_TO_RAD);
}

//对未提供bind的浏览器实现bind机制
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            egret.$error(1029);
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