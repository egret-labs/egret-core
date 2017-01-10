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


namespace egret {
    /**
     * Easing function set. Different easing functions are used to make an animation proceed according to the corresponding equation
     * @see http://edn.egret.com/cn/index.php/article/index/id/53 Easing effect Demo
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 缓动函数集合，使用不同的缓动函数使得动画按照对应的方程进行
     * @see http://edn.egret.com/cn/index.php/article/index/id/53 缓动效果演示
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
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
         * get.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static get(amount: number) {
            if (amount < -1) {
                amount = -1;
            }
            if (amount > 1) {
                amount = 1;
            }
            return function (t: number) {
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
         * get pow in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get pow in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static getPowIn(pow: number) {
            return function (t: number) {
                return Math.pow(t, pow);
            }
        }

        /**
         * get pow out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get pow out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static getPowOut(pow: number) {
            return function (t: number) {
                return 1 - Math.pow(1 - t, pow);
            }
        }

        /**
         * get pow in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get pow in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static getPowInOut(pow: number) {
            return function (t: number) {
                if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
                return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            }
        }

        /**
         * quad in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quad in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static quadIn = Ease.getPowIn(2);
        /**
         * quad out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quad out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static quadOut = Ease.getPowOut(2);
        /**
         * quad in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quad in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static quadInOut = Ease.getPowInOut(2);
        /**
         * cubic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * cubic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static cubicIn = Ease.getPowIn(3);
        /**
         * cubic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * cubic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static cubicOut = Ease.getPowOut(3);
        /**
         * cubic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * cubic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static cubicInOut = Ease.getPowInOut(3);
        /**
         * quart in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quart in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static quartIn = Ease.getPowIn(4);
        /**
         * quart out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quart out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static quartOut = Ease.getPowOut(4);
        /**
         * quart in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quart in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static quartInOut = Ease.getPowInOut(4);
        /**
         * quint in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quint in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static quintIn = Ease.getPowIn(5);
        /**
         * quint out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quint out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static quintOut = Ease.getPowOut(5);
        /**
         * quint in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quint in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static quintInOut = Ease.getPowInOut(5);

        /**
         * sine in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * sine in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static sineIn(t: number) {
            return 1 - Math.cos(t * Math.PI / 2);
        }

        /**
         * sine out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * sine out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static sineOut(t: number) {
            return Math.sin(t * Math.PI / 2);
        }

        /**
         * sine in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * sine in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static sineInOut(t: number) {
            return -0.5 * (Math.cos(Math.PI * t) - 1)
        }

        /**
         * get back in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get back in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static getBackIn(amount: number) {
            return function (t: number) {
                return t * t * ((amount + 1) * t - amount);
            }
        }

        /**
         * back in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * back in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static backIn = Ease.getBackIn(1.7);

        /**
         * get back out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get back out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static getBackOut(amount: number) {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            }
        }

        /**
         * back out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * back out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static backOut = Ease.getBackOut(1.7);

        /**
         * get back in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get back in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static getBackInOut(amount: number) {
            amount *= 1.525;
            return function (t: number) {
                if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
                return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
            }
        }

        /**
         * back in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * back in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static backInOut = Ease.getBackInOut(1.7);

        /**
         * circ in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * circ in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static circIn(t: number) {
            return -(Math.sqrt(1 - t * t) - 1);
        }

        /**
         * circ out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * circ out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static circOut(t: number) {
            return Math.sqrt(1 - (--t) * t);
        }

        /**
         * circ in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * circ in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static circInOut(t: number) {
            if ((t *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        }

        /**
         * bounce in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * bounce in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static bounceIn(t: number) {
            return 1 - Ease.bounceOut(1 - t);
        }

        /**
         * bounce out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * bounce out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static bounceOut(t: number) {
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
         * bounce in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * bounce in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static bounceInOut(t: number) {
            if (t < 0.5) return Ease.bounceIn(t * 2) * .5;
            return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        }

        /**
         * get elastic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get elastic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static getElasticIn(amplitude: number, period: number) {
            let pi2 = Math.PI * 2;
            return function (t: number) {
                if (t == 0 || t == 1) return t;
                let s = period / pi2 * Math.asin(1 / amplitude);
                return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            }
        }

        /**
         * elastic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * elastic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static elasticIn = Ease.getElasticIn(1, 0.3);

        /**
         * get elastic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get elastic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static getElasticOut(amplitude: number, period: number) {
            let pi2 = Math.PI * 2;
            return function (t: number) {
                if (t == 0 || t == 1) return t;
                let s = period / pi2 * Math.asin(1 / amplitude);
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
            }
        }

        /**
         * elastic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * elastic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static elasticOut = Ease.getElasticOut(1, 0.3);

        /**
         * get elastic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get elastic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static getElasticInOut(amplitude: number, period: number) {
            let pi2 = Math.PI * 2;
            return function (t: number) {
                let s = period / pi2 * Math.asin(1 / amplitude);
                if ((t *= 2) < 1) return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
                return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
            }
        }

        /**
         * elastic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * elastic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
    }
}