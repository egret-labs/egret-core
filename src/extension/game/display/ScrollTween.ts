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
     * @private
     */
    export class ScrollEase {
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
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quintOut = ScrollEase.getPowOut(5);

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
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static quartOut = ScrollEase.getPowOut(4);

    }

	/**
     * @language en_US
     * ScrollTween is the animation easing class of Egret
     * @see http://docs.egret-labs.org/post/manual/anim/tween.html Tween缓动动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/tween/ScrollTween.ts
     * @private
	 */
	/**
     * @language zh_CN
     * Tween是Egret的动画缓动类
     * @see http://docs.egret-labs.org/post/manual/anim/tween.html ScrollTween ease animation
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/tween/ScrollTween.ts
     * @private
	 */
    export class ScrollTween extends EventDispatcher {

        /**
         * @private
         */
        private static _tweens:ScrollTween[] = [];
        /**
         * @private
         */
        private static IGNORE = {};
        /**
         * @private
         */
        private static _plugins = {};
        /**
         * @private
         */
        private static _inited = false;

        /**
         * @private
         */
        private _target:any = null;
        /**
         * @private
         */
        private _useTicks:boolean = false;
        /**
         * @private
         */
        private ignoreGlobalPause:boolean = false;
        /**
         * @private
         */
        private loop:boolean = false;
        /**
         * @private
         */
        private pluginData = null;
        /**
         * @private
         */
        private _curQueueProps;
        /**
         * @private
         */
        private _initQueueProps;
        /**
         * @private
         */
        private _steps:any[] = null;
        /**
         * @private
         */
        private _actions:any[] = null;
        /**
         * @private
         */
        private paused:boolean = false;
        /**
         * @private
         */
        private duration:number = 0;
        /**
         * @private
         */
        private _prevPos:number = -1;
        /**
         * @private
         */
        private position:number = null;
        /**
         * @private
         */
        private _prevPosition:number = 0;
        /**
         * @private
         */
        private _stepPosition:number = 0;
        /**
         * @private
         */
        private passive:boolean = false;

		/**
         * @language en_US
         * Activate an object and add a ScrollTween animation to the object
         * @param target {any} The object to be activated
         * @param props {any} Parameters, support loop onChange onChangeObj
         * @param pluginData {any} Write realized
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * @version Egret 2.4
         * @platform Web,Native
		 */
		/**
         * @language zh_CN
         * 激活一个对象，对其添加 ScrollTween 动画
         * @param target {any} 要激活 ScrollTween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public static get(target:any, props:any = null, pluginData:any = null, override:boolean = false):ScrollTween {
            if (override) {
                ScrollTween.removeTweens(target);
            }
            return new ScrollTween(target, props, pluginData);
        }

		/**
         * @language en_US
         * Delete all ScrollTween animations from an object
		 * @param target The object whose ScrollTween to be deleted
         * @version Egret 2.4
         * @platform Web,Native
		 */
		/**
         * @language zh_CN
         * 删除一个对象上的全部 ScrollTween 动画
		 * @param target  需要移除 ScrollTween 的对象
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public static removeTweens(target:any):void {
            if (!target.tween_count) {
                return;
            }
            var tweens:ScrollTween[] = ScrollTween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        }

        /**
         * @private
         * 
         * @param delta 
         * @param paused 
         */
        private static tick(timeStamp:number, paused = false):boolean {
            var delta = timeStamp - ScrollTween._lastTime;
            ScrollTween._lastTime = timeStamp;

            var tweens:ScrollTween[] = ScrollTween._tweens.concat();
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween:ScrollTween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.tick(tween._useTicks ? 1 : delta);
            }
            return false;
        }

        private static _lastTime:number = 0;
        /**
         * @private
         * 
         * @param tween 
         * @param value 
         */
        private static _register(tween:ScrollTween, value:boolean):void {
            var target:any = tween._target;
            var tweens:ScrollTween[] = ScrollTween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
                if (!ScrollTween._inited) {
                    ScrollTween._lastTime = egret.getTimer();
                    sys.$ticker.$startTick(ScrollTween.tick, null);
                    ScrollTween._inited = true;
                }
            } else {
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
        }

        /**
         * 创建一个 egret.ScrollTween 对象
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(target:any, props:any, pluginData:any) {
            super();
            this.initialize(target, props, pluginData);
        }

        /**
         * @private
         * 
         * @param target 
         * @param props 
         * @param pluginData 
         */
        private initialize(target:any, props:any, pluginData:any):void {
            this._target = target;
            if (props) {
                this._useTicks = props.useTicks;
                this.ignoreGlobalPause = props.ignoreGlobalPause;
                this.loop = props.loop;
                props.onChange && this.addEventListener("change", props.onChange, props.onChangeObj);
                if (props.override) {
                    ScrollTween.removeTweens(target);
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
                ScrollTween._register(this, true);
            }
            if (props && props.position != null) {
                this.setPosition(props.position);
            }
        }

        /**
         * @private
         * 
         * @param value 
         * @param actionsMode 
         * @returns 
         */
        private setPosition(value:number):boolean {
            if (value < 0) {
                value = 0;
            }

            //正常化位置
            var t:number = value;
            var end:boolean = false;
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


            this.position = this._prevPos = t;
            this._prevPosition = value;

            if (this._target) {
                if (end) {
                    //结束
                    this._updateTargetProps(null, 1);
                } else if (this._steps.length > 0) {
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

            this.dispatchEventWith("change");
            return end;
        }

        /**
         * @private
         * 
         * @param startPos 
         * @param endPos 
         * @param includeStart 
         */
        private _runActions(startPos:number, endPos:number, includeStart:boolean = false) {
            var sPos:number = startPos;
            var ePos:number = endPos;
            var i:number = -1;
            var j:number = this._actions.length;
            var k:number = 1;
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
        }

        /**
         * @private
         * 
         * @param step 
         * @param ratio 
         */
        private _updateTargetProps(step:any, ratio:number) {
            var p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                this.passive = false;
                p0 = p1 = this._curQueueProps;
            } else {
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
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof(v0) != "number")) {
                    v = ratio == 1 ? v1 : v0;
                } else {
                    v = v0 + (v1 - v0) * ratio;
                }

                var ignore = false;
                if (arr = ScrollTween._plugins[n]) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, !!step && p0 == p1, !step);
                        if (v2 == ScrollTween.IGNORE) {
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

        }

		/**
         * @language en_US
         * Whether setting is paused
		 * @param value {boolean} Whether to pause
		 * @returns ScrollTween object itself
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
        public setPaused(value:boolean):ScrollTween {
            this.paused = value;
            ScrollTween._register(this, !value);
            return this;
        }

        /**
         * @private
         * 
         * @param props 
         * @returns 
         */
        private _cloneProps(props):any {
            var o = {};
            for (var n in props) {
                o[n] = props[n];
            }
            return o;
        }

        /**
         * @private
         * 
         * @param o 
         * @returns 
         */
        private _addStep(o):ScrollTween {
            if (o.d > 0) {
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        }

        /**
         * @private
         * 
         * @param o 
         * @returns 
         */
        private _appendQueueProps(o):any {
            var arr, oldValue, i, l, injectProps;
            for (var n in o) {
                if (egret.sys.isUndefined(this._initQueueProps[n])) {
                    oldValue = this._target[n];
                    //设置plugins
                    if (arr = ScrollTween._plugins[n]) {
                        for (i = 0, l = arr.length; i < l; i++) {
                            oldValue = arr[i].init(this, n, oldValue);
                        }
                    }
                    this._initQueueProps[n] = this._curQueueProps[n] = (oldValue === undefined) ? null : oldValue;
                } else {
                    oldValue = this._curQueueProps[n];
                }
            }

            for (var n in o) {
                oldValue = this._curQueueProps[n];
                if (arr = ScrollTween._plugins[n]) {
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
        }

        /**
         * @private
         * 
         * @param o 
         * @returns 
         */
        private _addAction(o):ScrollTween {
            o.t = this.duration;
            this._actions.push(o);
            return this;
        }

		/**
         * @language en_US
         * Modify the property of the specified display object to a specified value
		 * @param props {Object} Property set of an object
		 * @param duration {number} Duration
		 * @param ease {egret.ScrollEase} Easing algorithm
		 * @returns {egret.ScrollTween} ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
		 */
		/**
         * @language zh_CN
         * 将指定显示对象的属性修改为指定值
		 * @param props {Object} 对象的属性集合
		 * @param duration {number} 持续时间
		 * @param ease {egret.ScrollEase} 缓动算法
		 * @returns {egret.ScrollTween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public to(props, duration?:number, ease:Function = undefined):ScrollTween {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            return this._addStep({d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props))});
        }

		/**
         * @language en_US
         * Execute callback function
		 * @param callback {Function} Callback method
		 * @param thisObj {any} this action scope of the callback method
		 * @param params {Array<any>} Parameter of the callback method
		 * @returns {egret.ScrollTween} ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
		 */
		/**
         * @language zh_CN
         * 执行回调函数
		 * @param callback {Function} 回调方法
		 * @param thisObj {any} 回调方法this作用域
		 * @param params {Array<any>} 回调方法参数
		 * @returns {egret.ScrollTween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public call(callback:Function, thisObj:any = undefined, params:Array<any> = undefined):ScrollTween {
            return this._addAction({f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target});
        }

		/**
		 * @method egret.ScrollTween#tick
		 * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public tick(delta:number):void {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        }
    }
}
