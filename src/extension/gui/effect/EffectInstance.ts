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


module egret.gui {

    /**
     * @class egret.gui.EffectInstance
     * @classdesc
     * 定义所有效果实例的基类
     * @extends egret.EventDispatcher
     */
    export class EffectInstance extends EventDispatcher implements IEffectInstance{
        /**
         * @method egret.gui.EffectInstance#constructor
         */
        public constructor(target:any){
            super();
            this.target = target;
        }
        
        /**
         * startDelay和repeatDelay的计时器
         */
        public _delayTimer:Timer;
        
        /**
         * delayTimer开始的时间
         */
        private delayStartTime:number = 0;
        
        /**
         * 暂停时delayTimer经过的时间
         */
        private delayElapsedTime:number = 0;
        
        /**
         * 是否显式设置了持续时间
         */
        public durationExplicitlySet:boolean = false;
        
        /**
         * 实例对应效果的复杂效果的实例，如果不是复杂效果则为null
         */
        public parentCompositeEffectInstance:EffectInstance;
        
        /** 
         * 已播放实例的次数。
         */
        public _playCount:number = 0;
        
        /**
         * 调用end()方法结束时，防止效果重复的的标志
         */
        public _stopRepeat:boolean = false;
        
        /**
         * 实际的持续时间包含startDelay，repeatDelay，repeatCount这些值
         */
        public get _actualDuration():number {
            var value:number = NaN;
            
            if (this.repeatCount > 0){
                value = this.duration * this.repeatCount +
                    (this.repeatDelay * (this.repeatCount - 1)) + this.startDelay;
            }
            return value;
        }

        private _duration:number = 500;
        /**
         * 效果的持续时间（以毫秒为单位）。
         * @member egret.gui.EffectInstance#duration
         */
        public get duration():number{
            if (!this.durationExplicitlySet &&
                this.parentCompositeEffectInstance){
                return this.parentCompositeEffectInstance.duration;
            }
            else{
                return this._duration;
            }
        }
        
        public set duration(value:number){
            this.durationExplicitlySet = true;
            this._duration = value;
        }
        
        private _effect:IEffect;
        /**
         * 创建此 IEffectInstance 对象的 IEffect 对象。
         * @member egret.gui.EffectInstance#effect
         */
        public get effect():IEffect{
            return this._effect;
        }
        
        public set effect(value:IEffect){
            this._effect = value;
        }

        /**
         * 效果的当前时间位置。
         * 此属性的值介于 0 和总持续时间（包括该效果的 startDelay、repeatCount 和 repeatDelay）之间。
         * @member egret.gui.EffectInstance#playheadTime
         */
        public get playheadTime():number {
            return Math.max(this._playCount - 1, 0) * (this.duration + this.repeatDelay) +
                (this.playReversed ? 0 : this.startDelay);
        }
        
        public set playheadTime(value:number){
            this._setPlayheadTime(value);
        }

        public _setPlayheadTime(value:number){
            if (this._delayTimer && this._delayTimer.running){
                this._delayTimer.reset();
                if (value < this.startDelay){
                    this._delayTimer = new egret.Timer(this.startDelay - value, 1);
                    this.delayStartTime = egret.getTimer();
                    this._delayTimer.addEventListener(egret.TimerEvent.TIMER, this.delayTimerHandler, this);
                    this._delayTimer.start();
                }
                else{
                    this._playCount = 0;
                    this.play();
                }
            }
        }
        
        private _playReversed:boolean;
        /**
         * 指定效果是否在反向播放，在播放之前设置此属性
         * @member egret.gui.EffectInstance#playReversed
         */
        public get playReversed():boolean{
            return this._playReversed;
        }
        
        public set playReversed(value:boolean) {
            this._setPlayReversed(value);
        }

        public _setPlayReversed(value:boolean){
            this._playReversed = value;
        }
        
        private _repeatCount:number = 0;
        /**
         * 效果的重复次数。可能的值为任何大于等于 0 的整数。
         * @member egret.gui.EffectInstance#repeatCount
         */
        public get repeatCount():number{
            return this._repeatCount;
        }

        public set repeatCount(value:number){
            this._repeatCount = value;
        }
        
        private _repeatDelay:number = 0;
        /**
         * 重复播放效果前需要等待的时间（以毫秒为单位）。
         * @member egret.gui.EffectInstance#repeatDelay
         */
        public get repeatDelay():number{
            return this._repeatDelay;
        }
        
        public set repeatDelay(value:number){
            this._repeatDelay = value;
        }
        
        private _startDelay:number = 0;
        /**
         * 开始播放效果前需要等待的时间（以毫秒为单位）。
         * 此值可以是任何大于或等于 0 的整数。
         * 如果使用 repeatCount 属性重复播放效果，则只在首次播放该效果时应用 startDelay 属性。
         * @member egret.gui.EffectInstance#startDelay
         */
        public get startDelay():number{
            return this._startDelay;
        }
        
        public set startDelay(value:number){
            this._startDelay = value;
        }
        
        private _target:any;
        /**
         * 要应用此效果的对象。
         * @member egret.gui.EffectInstance#target
         */
        public get target():any{
            return this._target;
        }
        
        public set target(value:any){
            this._target = value;
        }

        /**
         * 经过 startDelay 所占用的这段时间后，在目标上播放效果实例。
         * 由 Effect 类调用。在启动 EffectInstance 时，请使用此函数，而非 play() 方法。
         * @method egret.gui.EffectInstance#startEffect
         */
        public startEffect():void{   
            if (this.startDelay > 0 && !this.playReversed){
                this._delayTimer = new egret.Timer(this.startDelay, 1);
                this.delayStartTime = egret.getTimer();
                this._delayTimer.addEventListener(egret.TimerEvent.TIMER, this.delayTimerHandler, this);
                this._delayTimer.start();
            }
            else{
                this.play();
            }
        }

        /**
         * 在目标上播放效果实例。改为调用 startEffect() 方法，以在 EffectInstance 上开始播放效果。
         * <p>在 EffectInstance 的子类中，必须覆盖此方法。
         * 此覆盖必须调用 super.play() 方法，以便从目标中分派 effectStart 事件。</p>
         * @method egret.gui.EffectInstance#play
         */
        public play():void{
            this._playCount++;
            this.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_START, false, false, this));
            if (this.target &&"dispatchEvent" in this.target){
                this.target.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_START, false, false, this));
            }
        }

        /**
         * 暂停效果，直到调用 resume() 方法。
         * @method egret.gui.EffectInstance#pause
         */
        public pause():void{   
            if (this._delayTimer && this._delayTimer.running && !isNaN(this.delayStartTime)){
                this._delayTimer.stop();
                this.delayElapsedTime = egret.getTimer() - this.delayStartTime;
            }
        }

        /**
         * 停止播放效果，使目标保持当前状态。
         * 您需要通过调用 Effect.stop() 方法来调用此方法。在实现过程中，它会调用 finishEffect() 方法。
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         * @method egret.gui.EffectInstance#stop
         */
        public stop():void{   
            if (this._delayTimer)
                this._delayTimer.reset();
            this._stopRepeat = true;
            this.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_STOP, false, false, this));        
            if (this.target && ("dispatchEvent" in this.target))
                this.target.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_STOP, false, false, this));
            this.finishEffect();
        }

        /**
         * 在效果由 pause() 方法暂停后继续播放效果。
         * @method egret.gui.EffectInstance#resume
         */
        public resume():void{
            if (this._delayTimer && !this._delayTimer.running && !isNaN(this.delayElapsedTime)){
                this._delayTimer.delay = !this.playReversed ? this._delayTimer.delay - this.delayElapsedTime : this.delayElapsedTime;
                this.delayStartTime = egret.getTimer();
                this._delayTimer.start();
            }
        }

        /**
         * 从效果的当前位置开始反向播放效果。
         * @method egret.gui.EffectInstance#reverse
         */
        public reverse():void{
            if (this.repeatCount > 0)
                this._playCount = this.repeatCount - this._playCount + 1;
        }

        /**
         * 中断当前播放的效果实例，立即跳转到效果的结束位置。
         * 通过调用 Effect.end() 方法可调用此方法。在实现过程中，它会调用 finishEffect() 方法。
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         * @method egret.gui.EffectInstance#end
         */
        public end():void{
            if (this._delayTimer)
                this._delayTimer.reset();
            this._stopRepeat = true;
            this.finishEffect();
        }

        /**
         * 在完成效果播放时由 end() 方法调用。此函数将为效果目标分派 endEffect 事件。
         * @method egret.gui.EffectInstance#finishEffect
         */
        public finishEffect():void{
            this._playCount = 0;
            this.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_END, false, false, this));
            if (this.target && ("dispatchEvent" in this.target)){
                this.target.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_END,false, false, this));
            }
        }

        /**
         * 每次完成重复效果的迭代播放后调用。
         * @method egret.gui.EffectInstance#finishRepeat
         */
        public finishRepeat():void{
            if (!this._stopRepeat && this._playCount != 0 &&
                (this._playCount < this.repeatCount || this.repeatCount == 0)){
                if (this.repeatDelay > 0){
                    this._delayTimer = new egret.Timer(this.repeatDelay, 1);
                    this.delayStartTime = egret.getTimer();
                    this._delayTimer.addEventListener(egret.TimerEvent.TIMER,
                        this.delayTimerHandler,
                        this);
                    this._delayTimer.start();
                }
                else{
                    this.play();
                }
            }
            else{
                this.finishEffect();
            }
        }
        
        public _playWithNoDuration():void{
            this.duration = 0;
            this.repeatCount = 1;
            this.repeatDelay = 0;
            this.startDelay = 0;
            this.startEffect();
        }
        
        private delayTimerHandler(event:egret.TimerEvent):void{
            this._delayTimer.reset();
            this.delayStartTime = NaN;
            this.delayElapsedTime = NaN;
            this.play();
        }
    }
}