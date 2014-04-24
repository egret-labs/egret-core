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
            var context = ns_egret.MainContext.instance.deviceContext;
            context.executeMainLoop(this.update, this);
        }

        private update() {
            var list:Array<any> = this.callBackList.concat();
            var length:number = list.length;
            var thisTime = Ticker.now();
            for (var i:number = 0; i < length; i++) {
                var eventBin:any = list[i];
                var frameTime:number = thisTime - this._time;
                frameTime *= this._timeScale;
                eventBin.listener.call(eventBin.thisObject, frameTime);
            }
            this._time = thisTime;
        }

        private callBackList:Array<any> = [];

        /**
         * 注册帧回调事件，同一函数的重复监听会被忽略。
         * @param listener 帧回调函数,参数返回上一帧和这帧的间隔时间。示例：onEnterFrame(frameTime:number):void
         * @param thisObject 帧回调函数的this对象
         * @param priority 事件优先级，开发者请勿传递 Number.MAX_VALUE 和 Number.MIN_VALUE
         * @stable A-
         */
        public register(listener:Function, thisObject:any, priority = 0) {
            var list:Array<any> = this.callBackList;
            this._insertEventBin(list,listener,thisObject,priority);
        }

        /**
         * 取消侦听enterFrame事件
         * @param listener 事件侦听函数
         * @param thisObject 侦听函数的this对象
         * @stable A-
         */
        public unregister(listener:Function, thisObject:any) {
            var list:Array<any> = this.callBackList;
            this._removeEventBin(list,listener,thisObject);
        }

        /**
         * 在一帧之后调用指定函数
         * @param listener 事件侦听函数
         * @param thisObject 侦听函数的this对象
         */
        public callLater(listener:Function, thisObject, time:number = 0) {
            var that = this;
            var passTime = 0;
            this.register(function (frameTime) {
                if (time == 0) {
                    that.unregister(arguments.callee, thisObject);
                    listener.apply(thisObject);

                }
                else {
                    passTime += frameTime;
                    if (passTime >= time) {
                        that.unregister(arguments.callee, thisObject);
                        listener.apply(thisObject);
                    }
                }
            }, thisObject)
        }

        public setTimeScale(timeScale) {
            this._timeScale = timeScale;
        }

        public getTimeScale() {
            return this._timeScale;
        }

        public pause() {
            this._paused = true;
        }

        public resume() {
            this._paused = false;
        }

        public getFrameRate() {
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