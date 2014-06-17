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

/// <reference path="../context/Ticker.ts"/>
/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="../utils/Logger.ts"/>

module egret {
    export class Tween extends EventDispatcher {
        public static NONE = 0;
        public static LOOP = 1;
        public static REVERSE = 2;

        private static _tweens:Tween[] = [];
        private static IGNORE = {};
        private static _plugins = {};
        private static _inited = false;

        private _target:any = null;
        private _useTicks:boolean = false;
        private ignoreGlobalPause:boolean = false;
        private loop:boolean = false;
        private pluginData = null;
        private _curQueueProps;
        private _initQueueProps;
        private _steps:any[] = null;
        private _actions:any[] = null;
        private paused:boolean = false;
        private duration:number = 0;
        private _prevPos:number = -1;
        private position:number = null;
        private _prevPosition:number = 0;
        private _stepPosition:number = 0;
        private passive:boolean = false;

        public static get(target, props = null, pluginData = null, override = false):Tween {
            if (override) {
                Tween.removeTweens(target);
            }
            return new Tween(target, props, pluginData);
        }

        public static removeTweens(target):void {
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

        private static tick(delta, paused = false):void {
            var tweens:Tween[] = Tween._tweens.concat();
            for (var i = tweens.length - 1; i >= 0; i--) {
                var tween:Tween = tweens[i];
                if ((paused && !tween.ignoreGlobalPause) || tween.paused) {
                    continue;
                }
                tween.tick(tween._useTicks ? 1 : delta);
            }
        }

        private static _register(tween:Tween, value:boolean):void {
            var target:any = tween._target;
            var tweens:Tween[] = Tween._tweens;
            if (value) {
                if (target) {
                    target.tween_count = target.tween_count ? target.tween_count + 1 : 1;
                }
                tweens.push(tween);
                if (!Tween._inited) {
                    Ticker.getInstance().register(Tween.tick, null);
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

        public static removeAllTweens():void {
            var tweens:Tween[] = Tween._tweens;
            for (var i = 0, l = tweens.length; i < l; i++) {
                var tween:Tween = tweens[i];
                tween.paused = true;
                tween._target.tweenjs_count = 0;
            }
            tweens.length = 0;
        }

        constructor(target, props, pluginData) {
            super();
            this.initialize(target, props, pluginData);
        }

        private initialize(target, props:any, pluginData):void {
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

            if (end) {
                this.setPaused(true);
            }

            this.dispatchEventWith("change");
            return end;
        }

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

        public setPaused(value:boolean):Tween {
            this.paused = value;
            Tween._register(this, !value);
            return this;
        }

        private _cloneProps(props):any {
            var o = {};
            for (var n in props) {
                o[n] = props[n];
            }
            return o;
        }

        private _addStep(o):Tween {
            if (o.d > 0) {
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        }

        private _appendQueueProps(o):any {
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

        private _addAction(o):Tween {
            o.t = this.duration;
            this._actions.push(o);
            return this;
        }

        private _set(props, o):void {
            for (var n in props) {
                o[n] = props[n];
            }
        }

        public wait(duration:number, passive = false):Tween {
            if (duration == null || duration <= 0) {
                return this;
            }
            var o = this._cloneProps(this._curQueueProps);
            return this._addStep({d: duration, p0: o, p1: o, v: passive});
        }

        public to(props, duration:number, ease = undefined):Tween {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            return this._addStep({d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props))});
        }

        public call(callback:Function, thisObj = undefined, params = undefined):Tween {
            return this._addAction({f: callback, p: params ? params : [this], o: thisObj ? thisObj : this._target});
        }

        public set(props, target = null):Tween {
            return this._addAction({f: this._set, o: this, p: [props, target ? target : this._target]});
        }

        public play(tween:Tween):Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, [false], tween);
        }

        public pause(tween:Tween):Tween {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, [true], tween);
        }

        public tick(delta:number):void {
            if (this.paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        }
    }
}
