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

module dragonBones {

	/**
	 * @class dragonBones.MathUtil
	 * @classdesc
	 * 内部使用的有关数学计算的工具类
	 */
	export class MathUtil{
		/** @private */
		public static getEaseValue(value:number, easing:number):number{
			var valueEase:number = 1;
			if(easing > 1)    //ease in out
			{
                //valueEase = 0.5 * (1 - NumberUtils.cos(value * Math.PI));
				valueEase = 0.5 * (1 - MathUtil.cos(value * Math.PI));
				easing -= 1;
			}else if (easing > 0)    //ease out
            {
                valueEase = 1 - Math.pow(1 - value, 2);
            }
			else if (easing < 0)    //ease in
			{
				easing *= -1;
				valueEase =  Math.pow(value,2);
			}
			
			return (valueEase - value) * easing + value;
		}

        /**
         * 角度转换为弧度
         */
        public static ANGLE_TO_RADIAN:number = Math.PI / 180;
        /**
         * 弧度转换为角度
         */
        public static RADIAN_TO_ANGLE:number = 180 / Math.PI;

        public static isNumber(value:any):boolean {
            return typeof(value) === "number" && !isNaN(value);
        }

        /**
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         */
        public static sin(value:number):number {
            value *= MathUtil.RADIAN_TO_ANGLE;
            var valueFloor:number = Math.floor(value);
            var valueCeil:number = valueFloor + 1;

            var resultFloor:number = MathUtil.sinInt(valueFloor);
            var resultCeil:number = MathUtil.sinInt(valueCeil);

            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        }

        private static sinInt(value:number):number
        {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            if (value < 90) {
                return db_sin_map[value];
            }
            if (value < 180) {
                return db_sin_map[180 - value];
            }
            if (value < 270) {
                return -db_sin_map[value - 180];
            }
            return -db_sin_map[360 - value];
        }
        /**
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         */
        public static cos(value:number):number {
            return MathUtil.sin(Math.PI/2 - value);
        }
    }
}

var db_sin_map = {};

for (var i = 0; i <= 90; i++) {
    db_sin_map[i] = Math.sin(i * dragonBones.MathUtil.ANGLE_TO_RADIAN);
}