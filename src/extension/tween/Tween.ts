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
     * Tween is the animation easing class of Egret
     * @see http://docs.egret-labs.org/post/manual/anim/tween.html Tween缓动动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
	 */
	/**
     * @language zh_CN
     * Tween是Egret的动画缓动类
     * @see http://docs.egret-labs.org/post/manual/anim/tween.html Tween ease animation
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
	 */
    export class Tween extends EventDispatcher {
		/**
         * 不做特殊处理
		 * @constant {number} egret.Tween.NONE
         * @private
		 */
        private static NONE = 0;
		/**
         * 循环
		 * @constant {number} egret.Tween.LOOP
         * @private
		 */
        private static LOOP = 1;
		/**
         * 倒序
		 * @constant {number} egret.Tween.REVERSE
         * @private
		 */
        private static REVERSE = 2;

        /**
         * @private
         */
        private static _tweens:Tween[] = [];
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
         * Activate an object and add a Tween animation to the object
         * @param target {any} The object to be activated
         * @param props {any} Parameters, support loop onChange onChangeObj
         * @param pluginData {any} Write realized
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * @version Egret 2.4
         * @platform Web,Native
		 */
		/**
         * @language zh_CN
         * 激活一个对象，对其添加 Tween 动画
         * @param target {any} 要激活 Tween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false
         * @version Egret 2.4
         * @platform Web,Native
		 */
        public static get(target:any, props:any = null, pluginData:any = null, override:boolean = false):Tween {
            if (override) {
                Tween.removeTweens(target);
            }
            return new Tween(target, props, pluginData);
        }

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
        public static removeTweens(target:any):void {
            if (!target.tween_count) {
                return;
            }
            var tweens:Tween[] = Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                    tweens.splice(i, 1);
                }
            }
            target.tween_count = 0;
        }

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
        public static pauseTweens(target:any):void {
            if (!target.tween_count) {
                return;
            }
            var tweens:egret.Tween[] = egret.Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = true;
                }
            }
        }

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
        public static resumeTweens(target:any):void {
            if (!target.tween_count) {
                return;
            }
            var tweens:egret.Tween[] = egret.Tween._tweens;
            for (var i = tweens.length - 1; i >= 0; i--) {
                if (tweens[i]._target == target) {
                    tweens[i].paused = false;
                }
            }
        }

        /**
         * @private
         * 
         * @param delta 
         * @param paused 
         */
        private static tick(timeStamp:number, paused = false):boolean {
            var delta = timeStamp - Tween._lastTime;
            Tween._lastTime = timeStamp;

            var tweens:Tween[] = Tween._tweens.concat();
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween:Tween = tweens[i];
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
        private static _register(tween:Tween, value:boolean):void {
            var target:any = tween._target;
            var tweens:Tween[] = Tween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count > 0 ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
                if (!Tween._inited) {
                    Tween._lastTime = egret.getTimer();
                    sys.$ticker.$startTick(Tween.tick, null);
                    Tween._inited = true;
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
        public static removeAllTweens():void {
            var tweens:Tween[] = Tween._tweens;
            for (var i = 0, l = tweens.length; i < l; i++) {
                var tween:Tween = tweens[i];
                tween.paused = true;
                tween._target.tweenjs_count = 0;
            }
            tweens.length = 0;
        }

        /**
         * 创建一个 egret.Tween 对象
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
        }

        /**
         * @private
         * 
         * @param value 
         * @param actionsMode 
         * @returns 
         */
        private setPosition(value:number, actionsMode:number = 1):boolean {
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


            var prevPos = this._prevPos;
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

            //执行actions
            if (actionsMode != 0 && this._actions.length > 0) {
                if (this._useTicks) {
                    this._runActions(t, t);
                } else if (actionsMode == 1 && t < prevPos) {
                    if (prevPos != this.duration) {
                        this._runActions(prevPos, this.duration);
                    }
                    this._runActions(0, t, true);
                } else {
                    this._runActions(prevPos, t);
                }
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

        }

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
        public setPaused(value:boolean):Tween {
            this.paused = value;
            Tween._register(this, !value);
            return this;
        }

        /**
         * @private
         * 
         * @param props 
         * @returns 
         */
        private _cloneProps(props:any):any {
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
        private _addStep(o):Tween {
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
                    if (arr = Tween._plugins[n]) {
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
        }

        /**
         * @private
         * 
         * @param o 
         * @returns 
         */
        private _addAction(o):Tween {
            o.t = this.duration;
            this._actions.push(o);
            return this;
        }

        /**
         * @private
         * 
         * @param props 
         * @param o 
         */
        private _set(props:any, o):void {
            for (var n in props) {
                o[n] = props[n];
            }
        }

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
        public wait(duration:number, passive?:boolean):Tween {
            if (duration == null || duration <= 0) {
                return this;
            }
            var o = this._cloneProps(this._curQueueProps);
            return this._addStep({d: duration, p0: o, p1: o, v: passive});
        }

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
        public to(props:any, duration?:number, ease:Function = undefined):Tween {
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
		 * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
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
		 */
        public call(callback:Function, thisObj:any = undefined, params:Array<any> = undefined):Tween {
            return this._addAction({f: callback, p: params ? params : [], o: thisObj ? thisObj : this._target});
        }

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
        public set(props:any, target = null):Tween {
            return this._addAction({f: this._set, o: this, p: [props, target ? target : this._target]});
        }

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
        public play(tween?:Tween):Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [false]);
        }

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
        public pause(tween?:Tween):Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, tween, [true]);
        }

		/**
		 * @method egret.Tween#tick
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
