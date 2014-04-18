/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/// <reference path="../events/EventDispatcher.ts"/>

module ns_egret {
    /**
     * Ticker是egret引擎的心跳控制器，是游戏唯一的时间处理入口。开发者务必不要使用setTimeout / setInterval 等方法，而是统一使用Ticker
     * @stable A
     * todo:GitHub文档，介绍心跳控制器的作用
     */
    export class Ticker extends ns_egret.EventDispatcher {


        /**
         * 获取当前系统时间的时间戳
         * @stable A
         */
        public static now = function () {
            return new Date().getTime();
        };

        static requestAnimationFrame:Function = window["requestAnimationFrame"] ||
            window["webkitRequestAnimationFrame"] ||
            window["mozRequestAnimationFrame"] ||
            window["oRequestAnimationFrame"] ||
            window["msRequestAnimationFrame"] ||
            //如果全都没有，使用setTimeout实现
            function (callback) {
                return window.setTimeout(callback, 1000 / Ticker.getInstance().getFrameRate());
            };


        private _time:number;
        private _timeScale:number = 1;
        private _paused:Boolean = false;
        private _frameRate:number = 60;

        /**
         * 启动心跳控制器。
         * 这个函数应只在游戏初始化时调用一次
         * @stable A
         */
        public run() {
            this._time = Ticker.now();
            Ticker.requestAnimationFrame.call(window, this.enterFrame)
        }

        private enterFrame() {
            Ticker.requestAnimationFrame.call(window, Ticker.instance.enterFrame)
            Ticker.instance.update();

        }

        private update() {
            if (!this._eventDataList || this._paused) return;
            var thisTime = Ticker.now();
            var l = this._eventDataList.length;
            for (var i:number = 0; i < l; i++) {
                var obj = this._eventDataList[i];
                if (!obj) {
                    continue;
                }
                if (obj.eventName == "enterFrame"
                    && (!(this instanceof DisplayObject) || this._isUseCapture == obj.useCapture)) {
                    var dt = thisTime - this._time;
                    dt *= this._timeScale;
                    obj.func.call(obj.thisObj, dt);
                }
            }
            this._time = thisTime;
        }

        /**
         * 注册侦听enterFrame事件，这是对EventDispatcher.addEventListener("enterFrame")的一层封装
         * @param func 事件侦听函数
         * @param thisObj 侦听函数的this对象
         * @param priority 事件优先级，开发者请勿传递 Number.MAX_VALUE 和 Number.MIN_VALUE
         * @stable A-
         */
        public register(func:Function, thisObj, priority = 0) {
            super.addEventListener("enterFrame", func, thisObj, false, priority);
        }

        /**
         * 取消侦听enterFrame事件
         * @param func 事件侦听函数
         * @param thisObj 侦听函数的this对象
         * @stable A-
         */
        public unregister(func:Function, thisObj) {
            super.removeEventListener("enterFrame", func, thisObj, false);
        }

        /**
         * 在一帧之后调用指定函数
         * @param func 事件侦听函数
         * @param thisObj 侦听函数的this对象
         */
        public callLater(func:Function, thisObj, time:number = 0) {
            var that = this;
            var passTime = 0;
            this.register(function (dt) {
                if (time == 0) {
                    that.unregister(arguments.callee, thisObj);
                    func.apply(thisObj);

                }
                else {
                    passTime += dt;
                    if (passTime >= time) {
                        that.unregister(arguments.callee, thisObj);
                        func.apply(thisObj);
                    }
                }
            }, thisObj)
        }

        public setTimeScale(timeScale) {
            this._timeScale = timeScale;
        }

        public getTimeScale() {
            return this._timeScale;
        }

        public pause(){
            this._paused = true;
        }

        public resume(){
            this._paused = false;
        }

        public getFrameRate(){
            return this._frameRate;
        }



        private static instance:ns_egret.Ticker;
        public static getInstance():ns_egret.Ticker {
            if (Ticker.instance == null) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        }
    }
}