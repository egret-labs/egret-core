
module egret.gui {

	export class EffectInstance extends egret.EventDispatcher implements IEffectInstance{
		
		public constructor(target:any){
			super();
			this.target = target;
		}
		
		/**
		 *  startDelay和repeatDelay的计时器
		 */
		public delayTimer:egret.Timer;
		
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
		public playCount:number = 0;
		
		/**
		 * 调用end()方法结束时，防止效果重复的的标志
		 */
		public stopRepeat:boolean = false;
		
		/**
		 * 实际的持续时间包含startDelay，repeatDelay，repeatCount这些值
		 */
		public get actualDuration():number {
			var value:number = NaN;
			
			if (this.repeatCount > 0){
				value = this.duration * this.repeatCount +
					(this.repeatDelay * (this.repeatCount - 1)) + this.startDelay;
			}
			return value;
		}
		
		/**
		 * @inheritDoc
		 */
		public get className():string{
			var name:string = egret.getQualifiedClassName(this);
			var index:number = name.indexOf("::");
			if (index != -1)
				name = name.substr(index + 2);
			return name;
		}
		
		private _duration:number = 500;
		/**
		 * @inheritDoc
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
		 * @inheritDoc
		 */
		public get effect():IEffect{
			return this._effect;
		}
		
		public set effect(value:IEffect){
			this._effect = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public get playheadTime():number {
			return Math.max(this.playCount - 1, 0) * (this.duration + this.repeatDelay) +
				(this.playReversed ? 0 : this.startDelay);
		}
		
		public set playheadTime(value:number){
            this._setPlayheadTime(value);
		}

        public _setPlayheadTime(value:number){
            if (this.delayTimer && this.delayTimer.running){
                this.delayTimer.reset();
                if (value < this.startDelay){
                    this.delayTimer = new egret.Timer(this.startDelay - value, 1);
                    this.delayStartTime = egret.getTimer();
                    this.delayTimer.addEventListener(egret.TimerEvent.TIMER, this.delayTimerHandler, this);
                    this.delayTimer.start();
                }
                else{
                    this.playCount = 0;
                    this.play();
                }
            }
        }
		
		private _playReversed:boolean;
		/**
		 * 内部指定效果是否在反向播放，在播放之前设置此属性
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
		 * @inheritDoc
		 */
		public get repeatCount():number{
			return this._repeatCount;
		}

		public set repeatCount(value:number){
			this._repeatCount = value;
		}
		
		private _repeatDelay:number = 0;
		/**
		 * @inheritDoc
		 */
		public get repeatDelay():number{
			return this._repeatDelay;
		}
		
		public set repeatDelay(value:number){
			this._repeatDelay = value;
		}
		
		private _startDelay:number = 0;
		/**
		 * @inheritDoc
		 */
		public get startDelay():number{
			return this._startDelay;
		}
		
		public set startDelay(value:number){
			this._startDelay = value;
		}
		
		private _target:any;
		/**
		 * @inheritDoc
		 */
		public get target():any{
			return this._target;
		}
		
		public set target(value:any){
			this._target = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public startEffect():void{   
			if (this.startDelay > 0 && !this.playReversed){
				this.delayTimer = new egret.Timer(this.startDelay, 1);
				this.delayStartTime = egret.getTimer();
				this.delayTimer.addEventListener(egret.TimerEvent.TIMER, this.delayTimerHandler, this);
				this.delayTimer.start();
			}
			else{
				this.play();
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public play():void{
			this.playCount++;
			this.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_START, false, false, this));
			if (this.target &&"dispatchEvent" in this.target){
				this.target.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_START, false, false, this));
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public pause():void{   
			if (this.delayTimer && this.delayTimer.running && !isNaN(this.delayStartTime)){
				this.delayTimer.stop();
				this.delayElapsedTime = egret.getTimer() - this.delayStartTime;
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public stop():void{   
			if (this.delayTimer)
				this.delayTimer.reset();
			this.stopRepeat = true;
			this.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_STOP, false, false, this));        
			if (this.target && ("dispatchEvent" in this.target))
				this.target.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_STOP, false, false, this));
			this.finishEffect();
		}
		
		/**
		 * @inheritDoc
		 */
		public resume():void{
			if (this.delayTimer && !this.delayTimer.running && !isNaN(this.delayElapsedTime)){
				this.delayTimer.delay = !this.playReversed ? this.delayTimer.delay - this.delayElapsedTime : this.delayElapsedTime;
				this.delayStartTime = egret.getTimer();
				this.delayTimer.start();
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public reverse():void{
			if (this.repeatCount > 0)
				this.playCount = this.repeatCount - this.playCount + 1;
		}
		
		/**
		 * @inheritDoc
		 */
		public end():void{
			if (this.delayTimer)
				this.delayTimer.reset();
			this.stopRepeat = true;
			this.finishEffect();
		}
		
		/**
		 * @inheritDoc
		 */
		public finishEffect():void{
			this.playCount = 0;
			this.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_END, false, false, this));
			if (this.target && ("dispatchEvent" in this.target)){
				this.target.dispatchEvent(new EffectEvent(EffectEvent.EFFECT_END,false, false, this));
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public finishRepeat():void{
			if (!this.stopRepeat && this.playCount != 0 &&
				(this.playCount < this.repeatCount || this.repeatCount == 0)){
				if (this.repeatDelay > 0){
					this.delayTimer = new egret.Timer(this.repeatDelay, 1);
					this.delayStartTime = egret.getTimer();
					this.delayTimer.addEventListener(egret.TimerEvent.TIMER,
						this.delayTimerHandler,
						this);
					this.delayTimer.start();
				}
				else{
					this.play();
				}
			}
			else{
				this.finishEffect();
			}
		}
		
		public playWithNoDuration():void{
			this.duration = 0;
			this.repeatCount = 1;
			this.repeatDelay = 0;
			this.startDelay = 0;
			this.startEffect();
		}
		
		private delayTimerHandler(event:egret.TimerEvent):void{
			this.delayTimer.reset();
			this.delayStartTime = NaN;
			this.delayElapsedTime = NaN;
			this.play();
		}
	}
}