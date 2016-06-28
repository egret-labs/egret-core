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
var egret;
(function (egret) {
    /**
     * @language en_US
     * Easing function set. Different easing functions are used to make an animation proceed according to the corresponding equation
     * @see http://edn.egret.com/cn/index.php/article/index/id/53 Easing effect Demo
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 缓动函数集合，使用不同的缓动函数使得动画按照对应的方程进行
     * @see http://edn.egret.com/cn/index.php/article/index/id/53 缓动效果演示
     * @version Egret 2.4
     * @platform Web,Native
     */
    var Ease = (function () {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Ease() {
            egret.$error(1014);
        }
        var d = __define,c=Ease,p=c.prototype;
        /**
         * @language en_US
         * get.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.get = function (amount) {
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
            };
        };
        /**
         * @language en_US
         * get pow in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get pow in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.getPowIn = function (pow) {
            return function (t) {
                return Math.pow(t, pow);
            };
        };
        /**
         * @language en_US
         * get pow out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get pow out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.getPowOut = function (pow) {
            return function (t) {
                return 1 - Math.pow(1 - t, pow);
            };
        };
        /**
         * @language en_US
         * get pow in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get pow in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.getPowInOut = function (pow) {
            return function (t) {
                if ((t *= 2) < 1)
                    return 0.5 * Math.pow(t, pow);
                return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
            };
        };
        /**
         * @language en_US
         * sine in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * sine in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.sineIn = function (t) {
            return 1 - Math.cos(t * Math.PI / 2);
        };
        /**
         * @language en_US
         * sine out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * sine out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.sineOut = function (t) {
            return Math.sin(t * Math.PI / 2);
        };
        /**
         * @language en_US
         * sine in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * sine in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.sineInOut = function (t) {
            return -0.5 * (Math.cos(Math.PI * t) - 1);
        };
        /**
         * @language en_US
         * get back in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get back in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.getBackIn = function (amount) {
            return function (t) {
                return t * t * ((amount + 1) * t - amount);
            };
        };
        /**
         * @language en_US
         * get back out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get back out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.getBackOut = function (amount) {
            return function (t) {
                return (--t * t * ((amount + 1) * t + amount) + 1);
            };
        };
        /**
         * @language en_US
         * get back in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get back in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.getBackInOut = function (amount) {
            amount *= 1.525;
            return function (t) {
                if ((t *= 2) < 1)
                    return 0.5 * (t * t * ((amount + 1) * t - amount));
                return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
            };
        };
        /**
         * @language en_US
         * circ in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * circ in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.circIn = function (t) {
            return -(Math.sqrt(1 - t * t) - 1);
        };
        /**
         * @language en_US
         * circ out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * circ out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.circOut = function (t) {
            return Math.sqrt(1 - (--t) * t);
        };
        /**
         * @language en_US
         * circ in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * circ in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.circInOut = function (t) {
            if ((t *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - t * t) - 1);
            }
            return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
        };
        /**
         * @language en_US
         * bounce in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * bounce in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.bounceIn = function (t) {
            return 1 - Ease.bounceOut(1 - t);
        };
        /**
         * @language en_US
         * bounce out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * bounce out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.bounceOut = function (t) {
            if (t < 1 / 2.75) {
                return (7.5625 * t * t);
            }
            else if (t < 2 / 2.75) {
                return (7.5625 * (t -= 1.5 / 2.75) * t + 0.75);
            }
            else if (t < 2.5 / 2.75) {
                return (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375);
            }
            else {
                return (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375);
            }
        };
        /**
         * @language en_US
         * bounce in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * bounce in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.bounceInOut = function (t) {
            if (t < 0.5)
                return Ease.bounceIn(t * 2) * .5;
            return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
        };
        /**
         * @language en_US
         * get elastic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get elastic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.getElasticIn = function (amplitude, period) {
            var pi2 = Math.PI * 2;
            return function (t) {
                if (t == 0 || t == 1)
                    return t;
                var s = period / pi2 * Math.asin(1 / amplitude);
                return -(amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
            };
        };
        /**
         * @language en_US
         * get elastic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get elastic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.getElasticOut = function (amplitude, period) {
            var pi2 = Math.PI * 2;
            return function (t) {
                if (t == 0 || t == 1)
                    return t;
                var s = period / pi2 * Math.asin(1 / amplitude);
                return (amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * pi2 / period) + 1);
            };
        };
        /**
         * @language en_US
         * get elastic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get elastic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.getElasticInOut = function (amplitude, period) {
            var pi2 = Math.PI * 2;
            return function (t) {
                var s = period / pi2 * Math.asin(1 / amplitude);
                if ((t *= 2) < 1)
                    return -0.5 * (amplitude * Math.pow(2, 10 * (t -= 1)) * Math.sin((t - s) * pi2 / period));
                return amplitude * Math.pow(2, -10 * (t -= 1)) * Math.sin((t - s) * pi2 / period) * 0.5 + 1;
            };
        };
        /**
         * @language en_US
         * quad in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quad in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.quadIn = Ease.getPowIn(2);
        /**
         * @language en_US
         * quad out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quad out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.quadOut = Ease.getPowOut(2);
        /**
         * @language en_US
         * quad in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quad in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.quadInOut = Ease.getPowInOut(2);
        /**
         * @language en_US
         * cubic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * cubic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.cubicIn = Ease.getPowIn(3);
        /**
         * @language en_US
         * cubic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * cubic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.cubicOut = Ease.getPowOut(3);
        /**
         * @language en_US
         * cubic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * cubic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.cubicInOut = Ease.getPowInOut(3);
        /**
         * @language en_US
         * quart in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quart in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.quartIn = Ease.getPowIn(4);
        /**
         * @language en_US
         * quart out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quart out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.quartOut = Ease.getPowOut(4);
        /**
         * @language en_US
         * quart in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quart in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.quartInOut = Ease.getPowInOut(4);
        /**
         * @language en_US
         * quint in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quint in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.quintIn = Ease.getPowIn(5);
        /**
         * @language en_US
         * quint out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quint out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.quintOut = Ease.getPowOut(5);
        /**
         * @language en_US
         * quint in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quint in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.quintInOut = Ease.getPowInOut(5);
        /**
         * @language en_US
         * back in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * back in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.backIn = Ease.getBackIn(1.7);
        /**
         * @language en_US
         * back out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * back out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.backOut = Ease.getBackOut(1.7);
        /**
         * @language en_US
         * back in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * back in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.backInOut = Ease.getBackInOut(1.7);
        /**
         * @language en_US
         * elastic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * elastic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.elasticIn = Ease.getElasticIn(1, 0.3);
        /**
         * @language en_US
         * elastic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * elastic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.elasticOut = Ease.getElasticOut(1, 0.3);
        /**
         * @language en_US
         * elastic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * elastic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        Ease.elasticInOut = Ease.getElasticInOut(1, 0.3 * 1.5);
        return Ease;
    }());
    egret.Ease = Ease;
    egret.registerClass(Ease,'egret.Ease');
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    /**
     * @language en_US
     * Tween is the animation easing class of Egret
     * @see http://edn.egret.com/cn/docs/page/576 Tween ease animation
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
     */
    /**
     * @language zh_CN
     * Tween是Egret的动画缓动类
     * @see http://edn.egret.com/cn/docs/page/576 Tween缓动动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
     */
    var Tween = (function (_super) {
        __extends(Tween, _super);
        /**
         * 创建一个 egret.Tween 对象
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Tween(target, props, pluginData) {
            _super.call(this);
            /**
             * @private
             */
            this._target = null;
            /**
             * @private
             */
            this._useTicks = false;
            /**
             * @private
             */
            this.ignoreGlobalPause = false;
            /**
             * @private
             */
            this.loop = false;
            /**
             * @private
             */
            this.pluginData = null;
            /**
             * @private
             */
            this._steps = null;
            /**
             * @private
             */
            this._actions = null;
            /**
             * @private
             */
            this.paused = false;
            /**
             * @private
             */
            this.duration = 0;
            /**
             * @private
             */
            this._prevPos = -1;
            /**
             * @private
             */
            this.position = null;
            /**
             * @private
             */
            this._prevPosition = 0;
            /**
             * @private
             */
            this._stepPosition = 0;
            /**
             * @private
             */
            this.passive = false;
            this.initialize(target, props, pluginData);
        }
        var d = __define,c=Tween,p=c.prototype;
        /**
         * @language en_US
         * Activate an object and add a Tween animation to the object
         * @param target {any} The object to be activated
         * @param props {any} Parameters, support loop onChange onChangeObj
         * @param pluginData {any} Write realized
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * Not recommended, you can use Tween.removeTweens(target) instead.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 激活一个对象，对其添加 Tween 动画
         * @param target {any} 要激活 Tween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false。
         * 不建议使用，可使用 Tween.removeTweens(target) 代替。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Tween.get = function (target, props, pluginData, override) {
            if (props === void 0) { props = null; }
            if (pluginData === void 0) { pluginData = null; }
            if (override === void 0) { override = false; }
            if (override) {
                Tween.removeTweens(target);
            }
            return new Tween(target, props, pluginData);
        };
        /**
         * @language en_US
         * Delete all Tween animations from an object
         * @param target The object whose Tween to be deleted
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 删除一个对象上的全部 Tween 动画
         * @param target  需要移除 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        Tween.removeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        };
        /**
         * @language en_US
         * Pause all Tween animations of a certain object
         * @param target The object whose Tween to be paused
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 暂停某个对象的所有 Tween
         * @param target 要暂停 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        Tween.pauseTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = egret.Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                }
            }
        };
        /**
         * @language en_US
         * Resume playing all easing of a certain object
         * @param target The object whose Tween to be resumed
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 继续播放某个对象的所有缓动
         * @param target 要继续播放 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        Tween.resumeTweens = function (target) {
            if (!target.tween_count) {
                return;
            }
            var tweens = egret.Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = false;
                }
            }
        };
        /**
         * @private
         *
         * @param delta
         * @param paused
         */
        Tween.tick = function (timeStamp, paused) {
            if (paused === void 0) { paused = false; }
            var delta = timeStamp - Tween._lastTime;
            Tween._lastTime = timeStamp;
            var tweens = Tween._tweens.concat();
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.tick(tween._useTicks ? 1 : delta);
            }
            return false;
        };
        /**
         * @private
         *
         * @param tween
         * @param value
         */
        Tween._register = function (tween, value) {
            var target = tween._target;
            var tweens = Tween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
                if (!Tween._inited) {
                    Tween._lastTime = egret.getTimer();
                    egret.sys.$ticker.$startTick(Tween.tick, null);
                    Tween._inited = true;
                }
            }
            else {
                if (target) {
                    target.tween_count--;
                }
                var i = tweens.length;
                while (i--) {
                    if (tweens[i] == tween) {
                        tweens.splice(i, 1);
                        return;
                    }
                }
            }
        };
        /**
         * @language en_US
         * Delete all Tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 删除所有 Tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        Tween.removeAllTweens = function () {
            var tweens = Tween._tweens;
            for (var i = 0, l = tweens.length; i < l; i++) {
                var tween = tweens[i];
                tween.paused = true;
                tween._target.tweenjs_count = 0;
            }
            tweens.length = 0;
        };
        /**
         * @private
         *
         * @param target
         * @param props
         * @param pluginData
         */
        p.initialize = function (target, props, pluginData) {
            this._target = target;
            if (props) {
                this._useTicks = props.useTicks;
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                props.onChange && this.addEventListener("change", props.onChange, props.onChangeObj);
                if (props.override) {
                    Tween.removeTweens(target);
                }
            }
            this.pluginData = pluginData || {};
            this._curQueueProps = {};
            this._initQueueProps = {};
            this._steps = [];
            this._actions = [];
            if (props && props.paused) {
                this.paused = true;
            }
            else {
                Tween._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position, Tween.NONE);
            }
        };
        /**
         * @private
         *
         * @param value
         * @param actionsMode
         * @returns
         */
        p.setPosition = function (value, actionsMode) {
            if (actionsMode === void 0) { actionsMode = 1; }
            if (value < 0) {
                value = 0;
            }
            //正常化位置
            var t = value;
            var end = false;
            if (t >= this.duration) {
                if (this.loop) {
                    t = t % this.duration;
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }
            var prevPos = this._prevPos;
            this.position = this._prevPos = t;
            this._prevPosition = value;
            if (this._target) {
                if (end) {
                    //结束
                    this._updateTargetProps(null, 1);
                }
                else if (this._steps.length > 0) {
                    // 找到新的tween
                    for (var i = 0, l = this._steps.length; i < l; i++) {
                        if (this._steps[i].t > t) {
                            break;
                        }
                    }
                    var step = this._steps[i - 1];
                    this._updateTargetProps(step, (this._stepPosition = t - step.t) / step.d);
                }
            }
            if (end) {
                this.setPaused(true);
            }
            //执行actions
            if (actionsMode != 0 && this._actions.length > 0) {
                if (this._useTicks) {
                    this._runActions(t, t);
                }
                else if (actionsMode == 1 && t < prevPos) {
                    if (prevPos != this.duration) {
                        this._runActions(prevPos, this.duration);
                    }
                    this._runActions(0, t, true);
                }
                else {
                    this._runActions(prevPos, t);
                }
            }
            this.dispatchEventWith("change");
            return end;
        };
        /**
         * @private
         *
         * @param startPos
         * @param endPos
         * @param includeStart
         */
        p._runActions = function (startPos, endPos, includeStart) {
            if (includeStart === void 0) { includeStart = false; }
            var sPos = startPos;
            var ePos = endPos;
            var i = -1;
            var j = this._actions.length;
            var k = 1;
            if (startPos > endPos) {
                //把所有的倒置
                sPos = endPos;
                ePos = startPos;
                i = j;
                j = k = -1;
            }
            while ((i += k) != j) {
                var action = this._actions[i];
                var pos = action.t;
                if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                    action.f.apply(action.o, action.p);
                }
            }
        };
        /**
         * @private
         *
         * @param step
         * @param ratio
         */
        p._updateTargetProps = function (step, ratio) {
            var p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            }
            else {
                this.passive = !!step.v;
                //不更新props.
                if (this.passive) {
                    return;
                }
                //使用ease
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }
            for (var n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                    v = ratio == 1 ? v1 : v0;
                }
                else {
                    v = v0 + (v1 - v0) * ratio;
                }
                var ignore = false;
                if (arr = Tween._plugins[n]) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == Tween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    this._target[n] = v;
                }
            }
        };
        /**
         * @language en_US
         * Whether setting is paused
         * @param value {boolean} Whether to pause
         * @returns Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置是否暂停
         * @param value {boolean} 是否暂停
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setPaused = function (value) {
            this.paused = value;
            Tween._register(this, !value);
            return this;
        };
        /**
         * @private
         *
         * @param props
         * @returns
         */
        p._cloneProps = function (props) {
            var o = {};
            for (var n in props) {
                o[n] = props[n];
            }
            return o;
        };
        /**
         * @private
         *
         * @param o
         * @returns
         */
        p._addStep = function (o) {
            if (o.d > 0) {
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        };
        /**
         * @private
         *
         * @param o
         * @returns
         */
        p._appendQueueProps = function (o) {
            var arr, oldValue, i, l, injectProps;
            for (var n in o) {
                if (this._initQueueProps[n] === undefined) {
                    oldValue = this._target[n];
                    //设置plugins
                    if (arr = Tween._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                }
                else {
                    oldValue = this._curQueueProps[n];
                }
            }
            for (var n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = Tween._plugins[n]) {
                    injectProps = injectProps || {};
                    for (i = 0, l = arr.length; i < l; i++) {
                        if (arr[i].step) {
                            arr[i].step(this, n, oldValue, o[n], injectProps);
                        }
                    }
                }
                this._curQueueProps[n] = o[n];
            }
            if (injectProps) {
                this._appendQueueProps(injectProps);
            }
            return this._curQueueProps;
        };
        /**
         * @private
         *
         * @param o
         * @returns
         */
        p._addAction = function (o) {
            o.t = this.duration;
            this._actions.push(o);
            return this;
        };
        /**
         * @private
         *
         * @param props
         * @param o
         */
        p._set = function (props, o) {
            for (var n in props) {
                o[n] = props[n];
            }
        };
        /**
         * @language en_US
         * Wait the specified milliseconds before the execution of the next animation
         * @param duration {number} Waiting time, in milliseconds
         * @param passive {boolean} Whether properties are updated during the waiting time
         * @returns Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等待指定毫秒后执行下一个动画
         * @param duration {number} 要等待的时间，以毫秒为单位
         * @param passive {boolean} 等待期间属性是否会更新
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.wait = function (duration, passive) {
            if (duration == null || duration <= 0) {
                return this;
            }
            var o = this._cloneProps(this._curQueueProps);
            return this._addStep({ d: duration, p0: o, p1: o, v: passive });
        };
        /**
         * @language en_US
         * Modify the property of the specified object to a specified value
         * @param props {Object} Property set of an object
         * @param duration {number} Duration
         * @param ease {egret.Ease} Easing algorithm
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param duration {number} 持续时间
         * @param ease {egret.Ease} 缓动算法
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.to = function (props, duration, ease) {
            if (ease === void 0) { ease = undefined; }
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            return this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
        };
        /**
         * @language en_US
         * Execute callback function
         * @param callback {Function} Callback method
         * @param thisObj {any} this action scope of the callback method
         * @param params {Array<any>} Parameter of the callback method
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @example
         * <pre>
         *  egret.Tween.get(display).call(function (a:number, b:string) {
         *      console.log("a: " + a); // the first parameter passed 233
         *      console.log("b: " + b); // the second parameter passed “hello”
         *  }, this, [233, "hello"]);
         * </pre>
         */
        /**
         * @language zh_CN
         * 执行回调函数
         * @param callback {Function} 回调方法
         * @param thisObj {any} 回调方法this作用域
         * @param params {Array<any>} 回调方法参数
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @example
         * <pre>
         *  egret.Tween.get(display).call(function (a:number, b:string) {
         *      console.log("a: " + a); //对应传入的第一个参数 233
         *      console.log("b: " + b); //对应传入的第二个参数 “hello”
         *  }, this, [233, "hello"]);
         * </pre>
         */
        p.call = function (callback, thisObj, params) {
            if (thisObj === void 0) { thisObj = undefined; }
            if (params === void 0) { params = undefined; }
            return this._addAction({ f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target });
        };
        /**
         * Now modify the properties of the specified object to the specified value
         * @param props {Object} Property set of an object
         * @param target The object whose Tween to be resumed
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * 立即将指定对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param target 要继续播放 Tween 的对象
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.set = function (props, target) {
            if (target === void 0) { target = null; }
            //更新当前数据，保证缓动流畅性
            this._appendQueueProps(props);
            return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
        };
        /**
         * @language en_US
         * Execute
         * @param tween {egret.Tween} The Tween object to be operated. Default: this
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 执行
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.play = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [false]);
        };
        /**
         * @language en_US
         * Pause
         * @param tween {egret.Tween} The Tween object to be operated. Default: this
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 暂停
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.pause = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [true]);
        };
        /**
         * @method egret.Tween#tick
         * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.tick = function (delta) {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        };
        /**
         * 不做特殊处理
         * @constant {number} egret.Tween.NONE
         * @private
         */
        Tween.NONE = 0;
        /**
         * 循环
         * @constant {number} egret.Tween.LOOP
         * @private
         */
        Tween.LOOP = 1;
        /**
         * 倒序
         * @constant {number} egret.Tween.REVERSE
         * @private
         */
        Tween.REVERSE = 2;
        /**
         * @private
         */
        Tween._tweens = [];
        /**
         * @private
         */
        Tween.IGNORE = {};
        /**
         * @private
         */
        Tween._plugins = {};
        /**
         * @private
         */
        Tween._inited = false;
        Tween._lastTime = 0;
        return Tween;
    }(egret.EventDispatcher));
    egret.Tween = Tween;
    egret.registerClass(Tween,'egret.Tween');
})(egret || (egret = {}));
