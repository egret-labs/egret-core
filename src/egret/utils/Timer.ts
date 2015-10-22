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
     * The Timer class is the interface to timers, which let you run code on a specified time sequence. Use the start()
     * method to start a timer. Add an event listener for the timer event to set up code to be run on the timer interval.<br/>
     * You can create Timer objects to run once or repeat at specified intervals to execute code on a schedule. Depending
     * on the framerate or the runtime environment (available memory and other factors), the runtime may dispatchEvent events at
     * slightly offset intervals.
     * @see egret.TimerEvent
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/Timer.ts
     */
    /**
     * @language zh_CN
     * Timer 类是计时器的接口，它使您能按指定的时间序列运行代码。
     * 使用 start() 方法来启动计时器。为 timer 事件添加事件侦听器，以便将代码设置为按计时器间隔运行。
     * 可以创建 Timer 对象以运行一次或按指定间隔重复运行，从而按计划执行代码。
     * 根据 Egret 的帧速率或运行时环境（可用内存和其他因素），运行时调度事件的间隔可能稍有不同。
     * @see egret.TimerEvent
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/Timer.ts
     */
    export class Timer extends EventDispatcher {

        /**
         * @language en_US
         * Constructs a new Timer object with the specified delay and repeatCount states.
         * @param delay The delay between timer events, in milliseconds. A delay lower than 20 milliseconds is not recommended.
         * Timer frequency is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
         * @param repeatCount Specifies the number of repetitions. If zero, the timer repeats indefinitely.If nonzero,
         * the timer runs the specified number of times and then stops.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的 delay 和 repeatCount 状态构造新的 Timer 对象。
         * @param delay 计时器事件间的延迟（以毫秒为单位）。建议 delay 不要低于 20 毫秒。计时器频率不得超过 60 帧/秒，这意味着低于 16.6 毫秒的延迟可导致出现运行时问题。
         * @param repeatCount 指定重复次数。如果为零，则计时器将持续不断重复运行。如果不为 0，则将运行计时器，运行次数为指定的次数，然后停止。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(delay:number, repeatCount:number = 0) {
            super();
            this.delay = delay;
            this.repeatCount = +repeatCount|0;
        }

        /**
         * @private
         */
        private _delay:number = 0;
		/**
         * @language en_US
         * The delay between timer events, in milliseconds. A delay lower than 20 milliseconds is not recommended.<br/>
         * Note: Timer frequency is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 计时器事件间的延迟（以毫秒为单位）。如果在计时器正在运行时设置延迟间隔，则计时器将按相同的 repeatCount 迭代重新启动。<br/>
         * 注意：建议 delay 不要低于 20 毫秒。计时器频率不得超过 60 帧/秒，这意味着低于 16.6 毫秒的延迟可导致出现运行时问题。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get delay():number{
            return this._delay;
        }
        public set delay(value:number){
            //value = +value||0;
            if(value<1){
                value = 1;
            }
            if(this._delay==value){
                return;
            }
            this._delay = value;
            this.lastCount = this.updateInterval = Math.round(60*value);
        }

		/**
         * @language en_US
         * The total number of times the timer is set to run. If the repeat count is set to 0, the timer continues indefinitely,
         * until the stop() method is invoked or the program stops. If the repeat count is nonzero, the timer runs the specified
         * number of times. If repeatCount is set to a total that is the same or less then currentCount the timer stops and will not fire again.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置的计时器运行总次数。如果重复计数设置为 0，则计时器将持续不断运行，或直至调用了 stop() 方法或节目停止。
         * 如果重复计数不为 0，则将运行计时器，运行次数为指定的次数。如果设置的 repeatCount 总数等于或小于 currentCount，则计时器将停止并且不会再次触发。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public repeatCount:number;

        /**
         * @private
         */
        private _currentCount:number = 0;

		/**
         * @language en_US
         * The total number of times the timer has fired since it started at zero. If the timer has been reset, only the fires since the reset are counted.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 计时器从 0 开始后触发的总次数。如果已重置了计时器，则只会计入重置后的触发次数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get currentCount():number {
            return this._currentCount;
        }

        /**
         * @private
         */
        private _running:boolean = false;

		/**
         * @language en_US
         * The timer's current state; true if the timer is running, otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 计时器的当前状态；如果计时器正在运行，则为 true，否则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get running():boolean{
            return this._running;
        }

		/**
         * @language en_US
         * Stops the timer, if it is running, and sets the currentCount property back to 0, like the reset button of a stopwatch.
         * Then, when start() is called, the timer instance runs for the specified number of repetitions, as set by the repeatCount value.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果计时器正在运行，则停止计时器，并将 currentCount 属性设回为 0，这类似于秒表的重置按钮。然后，在调用 start() 后，将运行计时器实例，运行次数为指定的重复次数（由 repeatCount 值设置）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public reset():void{
            this.stop();
            this._currentCount = 0;
        }

		/**
         * @language en_US
         * Starts the timer, if it is not already running.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果计时器尚未运行，则启动计时器。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public start() {
            if(this._running)
                return;
            this.lastCount = this.updateInterval;
            sys.$ticker.$startTick(this.$update,this);
            this._running = true;
        }

		/**
         * @language en_US
         * Stops the timer. When start() is called after stop(), the timer instance runs for the remaining number of
         * repetitions, as set by the repeatCount property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 停止计时器。如果在调用 stop() 后调用 start()，则将继续运行计时器实例，运行次数为剩余的 重复次数（由 repeatCount 属性设置）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public stop() {
            if(!this._running)
                return;
            stopTick(this.$update,this);
            this._running = false;
        }

        /**
         * @private
         */
        private updateInterval:number = 1000;
        /**
         * @private
         */
        private lastCount:number = 1000;

        /**
         * @private
         * Ticker以60FPS频率刷新此方法
         */
        $update(timeStamp:number):boolean {
            this.lastCount -= 1000;
            if(this.lastCount>0){
                return false;
            }
            this.lastCount += this.updateInterval;
            this._currentCount++;
            var complete = (this.repeatCount > 0 && this._currentCount >= this.repeatCount);
            TimerEvent.dispatchTimerEvent(this,TimerEvent.TIMER);
            if (complete) {
                this.stop();
                TimerEvent.dispatchTimerEvent(this,TimerEvent.TIMER_COMPLETE);
            }
            return false;
        }
    }

    if(DEBUG){
        egret.$markReadOnly(Timer,"currentCount");
        egret.$markReadOnly(Timer,"running");
    }
}