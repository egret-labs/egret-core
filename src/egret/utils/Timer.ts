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

module ns_egret {
    export class Timer extends EventDispatcher {
        private _preTime:number;
        private _passTime:number;
        private _actionTimes:number;
        private _delay:number = 1000;
        private _repeatCount:number = -1;

        constructor(delay:number = 1000, repeatCount:number = -1) {
            super();
            this._delay = delay;
            this._repeatCount = repeatCount;
        }

        public start() {
            this._preTime = Ticker.now();
            if (this._actionTimes != 0) {
                this._actionTimes = 0;
            }
            Ticker.getInstance().register(this.onEnterFrame, this);
        }

        public stop() {
            Ticker.getInstance().unregister(this.onEnterFrame, this);
        }

        private static timerEvent:TimerEvent;

        private onEnterFrame(frameTime:number) {
            if(!Timer.timerEvent){
                Timer.timerEvent = new TimerEvent(TimerEvent.TIMER);
            }
            var timerEvent:TimerEvent = Timer.timerEvent;
            var now = Ticker.now();
            this._passTime = now - this._preTime;
            while (this._passTime > this._delay) {
                this._passTime -= this._delay;
                timerEvent._type = TimerEvent.TIMER;
                this.dispatchEvent(timerEvent);
                this._actionTimes++;
                if (this._repeatCount != -1 && this._actionTimes >= this._repeatCount) {
                    this.stop();
                    timerEvent._type = TimerEvent.TIMER_COMPLETE;
                    this.dispatchEvent(timerEvent);
                    break;
                }
                this._preTime = now;
            }
        }
    }
}