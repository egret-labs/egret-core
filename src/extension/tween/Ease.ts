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
     * @language en_US
     * Easing function set. Different easing functions are used to make an animation proceed according to the corresponding equation
     * @see http://bbs.egret-labs.org/thread-392-1-1.html Tween and Ease
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 缓动函数集合，使用不同的缓动函数使得动画按照对应的方程进行
     * @see http://bbs.egret-labs.org/thread-392-1-1.html Tween和Ease
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class Ease {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor() {
            egret.$error(1014);
        }

        /**
         * 
         * @param amount 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static get(amount):Function {
            if (amount < -1) {
                amount = -1;
            }
            if (amount > 1) {
                amount = 1;
            }
            return function (t) {
                if (amount == 0) {
                    return t;
                }
                if (amount < 0) {
                    return t * (t * -amount + 1 + amount);
                }
                return t * ((2 - t) * amount + (1 - amount));
            }
        }

        /**
         * 
         * @param pow 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getPowIn(pow):Function {
            return function (t) {
                return Math.pow(t, pow);
            }
        }

        /**
         * 
         * @param pow 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getPowOut(pow):Function {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            }
        }

        /**
         * 
         * @param pow 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getPowInOut(pow):Function {
            return function (t) {
                if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
                return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            }
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quadIn:Function = Ease.getPowIn(2);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quadOut:Function = Ease.getPowOut(2);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quadInOut:Function = Ease.getPowInOut(2);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static cubicIn:Function = Ease.getPowIn(3);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static cubicOut:Function = Ease.getPowOut(3);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static cubicInOut:Function = Ease.getPowInOut(3);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quartIn:Function = Ease.getPowIn(4);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quartOut:Function = Ease.getPowOut(4);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quartInOut:Function = Ease.getPowInOut(4);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quintIn:Function = Ease.getPowIn(5);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quintOut:Function = Ease.getPowOut(5);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quintInOut:Function = Ease.getPowInOut(5);

        /**
         * 
         * @param t 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static sineIn(t):number {
            return 1 - Math.cos(t * Math.PI / 2);
        }

        /**
         * 
         * @param t 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static sineOut(t):number {
            return Math.sin(t * Math.PI / 2);
        }

        /**
         * 
         * @param t 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static sineInOut(t):number {
            return -0.5 * (Math.cos(Math.PI * t) - 1)
        }

        /**
         * 
         * @param amount 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getBackIn(amount):Function {
            return function (t) {
                return t * t * ((amount + 1) * t - amount);
            }
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static backIn = Ease.getBackIn(1.7);

        /**
         * 
         * @param amount 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getBackOut(amount):Function {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            }
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static backOut = Ease.getBackOut(1.7);

        /**
         * 
         * @param amount 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getBackInOut(amount):Function {
            amount *= 1.525;
            return function (t) {
                if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
                return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
            }
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static backInOut = Ease.getBackInOut(1.7);

        /**
         * 
         * @param t 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static circIn(t):number {
            return -(Math.sqrt(1 - t * t) - 1);
        }

        /**
         * 
         * @param t 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static circOut(t):number {
            return Math.sqrt(1 - (--t) * t);
        }

        /**
         * 
         * @param t 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static circInOut(t):number {
            if ((t *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        }

        /**
         * 
         * @param t 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static bounceIn(t):number {
            return 1 - Ease.bounceOut(1 - t);
        }

        /**
         * 
         * @param t 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static bounceOut(t):number {
            if (t < 1 / 2.75) {
                return (7.5625 * t * t);
            } else if (t < 2 / 2.75) {
                return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            } else if (t < 2.5 / 2.75) {
                return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            } else {
                return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }
        }

        /**
         * 
         * @param t 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static bounceInOut(t):number {
            if (t < 0.5) return Ease.bounceIn(t * 2) * .5;
            return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        }

        /**
         * 
         * @param amplitude 
         * @param period 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getElasticIn(amplitude, period):Function {
            var pi2 = Math.PI * 2;
            return function (t) {
                if (t == 0 || t == 1) return t;
                var s = period / pi2 * Math.asin(1 / amplitude);
                return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            }
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static elasticIn = Ease.getElasticIn(1, 0.3);

        /**
         * 
         * @param amplitude 
         * @param period 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getElasticOut(amplitude, period):Function {
            var pi2 = Math.PI * 2;
            return function (t) {
                if (t == 0 || t == 1) return t;
                var s = period / pi2 * Math.asin(1 / amplitude);
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
            }
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static elasticOut = Ease.getElasticOut(1, 0.3);

        /**
         * 
         * @param amplitude 
         * @param period 
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static getElasticInOut(amplitude, period):Function {
            var pi2 = Math.PI * 2;
            return function (t) {
                var s = period / pi2 * Math.asin(1 / amplitude);
                if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
                return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
            }
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
    }
}