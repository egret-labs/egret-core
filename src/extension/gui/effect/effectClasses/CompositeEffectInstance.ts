
module egret.gui {

	export class CompositeEffectInstance extends EffectInstance{
		public constructor(target:any){
			super(target);
		}
		
		/**
		 * 正在播放或者等待播放的EffectInstances
		 */
		public activeEffectQueue:Array<any> = [];
		
		/**
		 * @inheritDoc
		 */
		public get actualDuration():number{
			var value:number = NaN;
			if (this.repeatCount > 0){
				value = this.durationWithoutRepeat * this.repeatCount +
					(this.repeatDelay * (this.repeatCount - 1)) + this.startDelay;
			}
			return value;
		}   
		
		private _playheadTime:number = 0;
		/**
		 * @inheritDoc
		 */
		public get playheadTime():number{
			return this._playheadTime;
		}
		
		public _setPlayheadTime(value:number){
			if (this.timerAnimation)
				this.timerAnimation.playheadTime = value;
			else
				this._playheadTime = value;
			super._setPlayheadTime(value);
		}

		public childSets:Array<any> = [];
		
		public get durationWithoutRepeat():number{
			return 0;
		}
		
		public endEffectCalled:boolean;
		
		public timerAnimation:Animation;
		
		/**
		 * @inheritDoc
		 */
		public play():void{
			this.timerAnimation = new Animation(this.animationUpdate,this);
			this.timerAnimation.duration = this.durationWithoutRepeat;
			this.timerAnimation.motionPaths = [new SimpleMotionPath("timer",0,0)];
			this.timerAnimation.endFunction = this.animationEnd;
			this.timerAnimation.play();
			super.play();
		}
		
		/**
		 * @inheritDoc
		 */
		public pause():void{   
			super.pause();
			
			if (this.timerAnimation)
				this.timerAnimation.pause();
		}
		
		/**
		 * @inheritDoc
		 */
		public stop():void{   
			super.stop();
			
			if (this.timerAnimation)
				this.timerAnimation.stop();
		}
		
		/**
		 * @inheritDoc
		 */
		public end():void{   
			super.end();
			if (this.timerAnimation)
				this.timerAnimation.end();
		}
		
		/**
		 * @inheritDoc
		 */
		public resume():void{
			super.resume();
			
			if (this.timerAnimation)
				this.timerAnimation.resume();
		}
		
		/**
		 * @inheritDoc
		 */
		public reverse():void{
			super.reverse();
            this._setPlayReversed(!this.playReversed);
			if (this.timerAnimation)
				this.timerAnimation.reverse();
		}
		
		/**
		 * @inheritDoc
		 */
		public finishEffect():void{
			this.activeEffectQueue = null;
			super.finishEffect();
		}
		
		/**
		 * 向此 Composite 效果添加一组新的子效果。
		 * Sequence 效果将按子效果组的添加顺序一次播放一个子效果组。
		 * Parallel 效果将同时播放所有子效果组，而不考虑这些子效果组的添加顺序。
		 */
		public addChildSet(childSet:Array<any>):void{
			if (childSet){
				var n:number = childSet.length;
				if (n > 0){
					if (!this.childSets)
						this.childSets = [ childSet ];
					else
						this.childSets.push(childSet);
					
					for (var i:number = 0; i < n; i++){
						childSet[i].addEventListener(EffectEvent.EFFECT_END,
							this.effectEndHandler,
							this);
						childSet[i].parentCompositeEffectInstance = this;
					}
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public playWithNoDuration():void{
			super.playWithNoDuration();
			this.end();
		}
		
		public animationUpdate(animation:Animation):void{
			this._playheadTime = this.timerAnimation ?
				this.timerAnimation.playheadTime :
				this._playheadTime;
		}
		
		public animationEnd(animation:Animation):void{
			this._playheadTime = this.timerAnimation ?
				this.timerAnimation.playheadTime :
				this._playheadTime;
		}
		
		/**
		 * 在每个子效果完成播放时调用。子类必须实现此函数。
		 */
		public onEffectEnd(childEffect:IEffectInstance):void{
			
		}
		
		public effectEndHandler(event:EffectEvent):void{
			this.onEffectEnd(event.effectInstance);
		}
	}
}