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
	 * @class egret.Timer
	 * @classdesc
	 * @extends egret.EventDispatcher
	 */
    export class Timer extends EventDispatcher {

        constructor(delay:number, repeatCount:number = 0) {
            super();
            this.delay = delay;
            this.repeatCount = repeatCount;
        }

		/**
		 * @member {number} egret.Timer#delay
		 */
        public delay:number;

		/**
		 * @member {number} egret.Timer#repeatCount
		 */
        public repeatCount:number;

        private _currentCount:number = 0;

		/**
		 * @method egret.Timer#currentCount
		 * @returns {number}
		 */
        public currentCount():number{
            return this._currentCount;
        }

        private _running:boolean;

		/**
		 * @member {boolean} egret.Timer#running
		 */
        public get running():boolean{
            return this._running;
        }

		/**
		 * @method egret.Timer#reset
		 */
        public reset():void{
            this.stop();
            this._currentCount = 0;
        }

		/**
		 * @method egret.Timer#start
		 */
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

		/**
		 * @method egret.Timer#stop
		 */
        public stop() {
            if(!this._running)
                return;
            Ticker.getInstance().unregister(this.onEnterFrame, this);
            this._running = false;
        }

        private lastTime:number;

        private onEnterFrame(frameTime:number) {
            var now = getTimer();
            var passTime = now - this.lastTime;
            if(passTime>this.delay){
                this.lastTime = now;
                this._currentCount++;
                TimerEvent.dispatchTimerEvent(this,TimerEvent.TIMER);
                if (this.repeatCount >0 && this._currentCount >= this.repeatCount) {
                    this.stop();
                    TimerEvent.dispatchTimerEvent(this,TimerEvent.TIMER_COMPLETE);
                }
            }
        }
    }
}