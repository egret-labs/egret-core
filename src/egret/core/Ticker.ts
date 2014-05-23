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

/// <reference path="MainContext.ts"/>
/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="../utils/callLater.ts"/>
/// <reference path="../utils/getTimer.ts"/>

module ns_egret {
    /**
     * @class ns_egret.Ticker
     * @classdesc
     * Ticker是egret引擎的心跳控制器，是游戏唯一的时间处理入口。开发者务必不要使用setTimeout / setInterval 等方法，而是统一使用Ticker
     * @extends ns_egret.EventDispatcher
     */
    export class Ticker extends EventDispatcher {


        private _timeScale:number = 1;
        private _paused:boolean = false;

        /**
         * 启动心跳控制器。
         * 这个函数应只在游戏初始化时调用一次
         * @method ns_egret.Ticker#run
         * @stable A
         */
        public run():void {
            __START_TIME = new Date().getTime();
            var context = ns_egret.MainContext.instance.deviceContext;
            context.executeMainLoop(this.update, this);
        }

        private update(advancedTime:number):void {
            var list:Array<any> = this.callBackList.concat();
            var length:number = list.length;

            var frameTime:number = advancedTime * this._timeScale;

            frameTime *= this._timeScale;
            for (var i:number = 0; i < length; i++) {
                var eventBin:any = list[i];
                eventBin.listener.call(eventBin.thisObject, frameTime);
            }
        }

        private callBackList:Array<any> = [];

        /**
         * 注册帧回调事件，同一函数的重复监听会被忽略。
         * @method ns_egret.Ticker#register
         * @param listener {Function} 帧回调函数,参数返回上一帧和这帧的间隔时间。示例：onEnterFrame(frameTime:number):void
         * @param thisObject {any} 帧回调函数的this对象
         * @param priority {any} 事件优先级，开发者请勿传递 Number.MAX_VALUE 和 Number.MIN_VALUE
         * @stable A-
         */
        public register(listener:Function, thisObject:any, priority = 0):void {
            var list:Array<any> = this.callBackList;
            this._insertEventBin(list, listener, thisObject, priority);
        }

        /**
         * 取消侦听enterFrame事件
         * @method ns_egret.Ticker#unregister
         * @param listener {Function} 事件侦听函数
         * @param thisObject {an} 侦听函数的this对象
         * @stable A-
         */
        public unregister(listener:Function, thisObject:any):void {
            var list:Array<any> = this.callBackList;
            this._removeEventBin(list, listener, thisObject);
        }

        /**
         * 在指定的延迟（以毫秒为单位）后运行指定的函数。
         * @method ns_egret.Ticker#setTimeout
         * @param listener {Function}
         * @param thisObject {any}
         * @param delay {Number}
         * @param ...parameter {any}
         */
        public setTimeout(listener:Function, thisObject, delay:Number, ...parameters):void {
            var that = this;
            var passTime = 0;
            this.register(function (frameTime) {
                if (delay == 0) {
                    that.unregister(arguments.callee, thisObject);
                    listener.apply(thisObject, parameters);

                }
                else {
                    passTime += frameTime;
                    if (passTime >= delay) {
                        that.unregister(arguments.callee, thisObject);
                        listener.apply(thisObject, parameters);
                    }
                }
            }, thisObject)
        }

        /**
         * @method ns_egret.Ticker#setTimeScale
         * @param timeScale {number}
         */
        public setTimeScale(timeScale:number):void {
            this._timeScale = timeScale;
        }

        /**
         * @method ns_egret.Ticker#getTimeScale
         */
        public getTimeScale():number {
            return this._timeScale;
        }

        /**
         * @method ns_egret.Ticker#pause
         */
        public pause():void {
            this._paused = true;
        }

        /**
         * @method ns_egret.Ticker#resume
         */
        public resume():void {
            this._paused = false;
        }

        private static instance:ns_egret.Ticker;

        /**
         * @method ns_egret.Ticker.getInstance
         * @returns {Ticker}
         */
        public static getInstance():ns_egret.Ticker {
            if (Ticker.instance == null) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        }
    }
}