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

/// <reference path="../core/Ticker.ts"/>
/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="../events/TimerEvent.ts"/>
/// <reference path="getTimer.ts"/>

module ns_egret {
    export class Timer extends EventDispatcher {

        constructor(delay:number = 1000, repeatCount:number = 0) {
            super();
            this.delay = delay;
            this.repeatCount = repeatCount;
        }

        public delay:number;

        public repeatCount:number;

        private _currentCount:number = 0;

        public currentCount():number{
            return this._currentCount;
        }

        private _running:boolean;

        public running():boolean{
            return this._running;
        }

        public reset():void{
            this.stop();
            this._currentCount = 0;
        }

        public start() {
            if(this._running)
                return;
            this.lastTime = getTimer();
            if (this._currentCount != 0) {
                this._currentCount = 0;
            }
            Ticker.getInstance().register(this.onEnterFrame, this);
            this._running = true;
        }

        public stop() {
            if(!this._running)
                return;
            Ticker.getInstance().unregister(this.onEnterFrame, this);
            this._running = false;
        }

        private static timerEvent:TimerEvent;

        private lastTime:number;

        private onEnterFrame(frameTime:number) {
            if(!Timer.timerEvent){
                Timer.timerEvent = new TimerEvent(TimerEvent.TIMER);
            }
            var timerEvent:TimerEvent = Timer.timerEvent;
            var now = getTimer();
            var passTime = now - this.lastTime;
            if(passTime>this.delay){
                this.lastTime = now;
                this._currentCount++;
                timerEvent._type = TimerEvent.TIMER;
                this.dispatchEvent(timerEvent);
                if (this.repeatCount >0 && this._currentCount >= this.repeatCount) {
                    this.stop();
                    timerEvent._type = TimerEvent.TIMER_COMPLETE;
                    this.dispatchEvent(timerEvent);
                }
            }
        }
    }
}