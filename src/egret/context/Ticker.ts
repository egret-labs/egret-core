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


module egret {
    /**
     * Ticker是egret引擎的心跳控制器，是游戏唯一的时间处理入口。开发者务必不要使用Ticker,应该使用egret.Timer。
     */
    export class Ticker extends EventDispatcher {

        public constructor(){
            super();
            if (Ticker.instance != null) {
                egret.Logger.fatalWithErrorId(1002);
            }
        }

        private _timeScale:number = 1;
        private _paused:boolean = false;

        /**
         * 启动心跳控制器。
         * 这个函数应只在游戏初始化时调用一次
         * @method egret.Ticker#run
         * @stable A
         */
        public run():void {
            __START_TIME = new Date().getTime();
            var context = egret.MainContext.instance.deviceContext;
            context.executeMainLoop(this.update, this);
        }

        private _callIndex:number = -1;
        private _callList:Array<any>;
        private update(advancedTime:number):void {
            if (this._paused){
                return;
            }
            var frameTime:number = advancedTime * this._timeScale;

            frameTime *= this._timeScale;
            this._callList = this.callBackList.concat();
            this._callIndex = 0;
            for (; this._callIndex < this._callList.length; this._callIndex++) {
                var eventBin:any = this._callList[this._callIndex];
                eventBin.listener.call(eventBin.thisObject, frameTime);
            }

            this._callIndex = -1;
            this._callList = null;
        }

        private callBackList:Array<any> = [];

        /**
         * 注册帧回调事件，同一函数的重复监听会被忽略。
         * @method egret.Ticker#register
         * @param listener {Function} 帧回调函数,参数返回上一帧和这帧的间隔时间。示例：onEnterFrame(frameTime:number):void
         * @param thisObject {any} 帧回调函数的this对象
         * @param priority {number} 事件优先级，开发者请勿传递 Number.NEGATIVE_INFINITY 和 Number.POSITIVE_INFINITY
         * @stable A-
         */
        public register(listener:Function, thisObject:any, priority:number = 0):void {
            var list:Array<any> = this.callBackList;
            this._insertEventBin(list, listener, thisObject, priority);
        }

        /**
         * 取消侦听enterFrame事件
         * @method egret.Ticker#unregister
         * @param listener {Function} 事件侦听函数
         * @param thisObject {any} 侦听函数的this对象
         * @stable A-
         */
        public unregister(listener:Function, thisObject:any):void {
            var list:Array<any> = this.callBackList;
            this._removeEventBin(list, listener, thisObject);

            if (this._callList && this._callIndex > -1) {
                this._removeEventBin(this._callList, listener, thisObject, null, this._callIndex + 1);
            }
        }

        /**
         * 在指定的延迟（以毫秒为单位）后运行指定的函数。
         * @method egret.Ticker#setTimeout
         * @param listener {Function}
         * @param thisObject {any}
         * @param delay {number}
         * @param ...parameter {any}
         * @deprecated
         */
        public setTimeout(listener:Function, thisObject, delay:number, ...parameters):void {
            Logger.warningWithErrorId(1003);
            egret.setTimeout.apply(null, [listener,thisObject,delay].concat(parameters));
        }

        /**
         * @method egret.Ticker#setTimeScale
         * @param timeScale {number}
         */
        public setTimeScale(timeScale:number):void {
            this._timeScale = timeScale;
        }

        /**
         * @method egret.Ticker#getTimeScale
         */
        public getTimeScale():number {
            return this._timeScale;
        }

        /**
         * @method egret.Ticker#pause
         */
        public pause():void {
            this._paused = true;
        }

        /**
         * @method egret.Ticker#resume
         */
        public resume():void {
            this._paused = false;
        }

        private static instance:egret.Ticker;

        /**
         * @method egret.Ticker.getInstance
         * @returns {Ticker}
         */
        public static getInstance():egret.Ticker {
            if (Ticker.instance == null) {
                Ticker.instance = new Ticker();
            }
            return Ticker.instance;
        }
    }
}