
module egret.gui {

	export class ParallelInstance extends CompositeEffectInstance{
		
		public constructor(target:any){
			super(target);
		}

		/**
		 * 已经完成的效果实例
		 */
		private doneEffectQueue:Array<any>;
		
		/**
		 * 等待播放的效果实例
		 */
		private replayEffectQueue:Array<any>;
		
		private isReversed:boolean = false;	
		private timer:egret.Timer;
		
		/**
		 * @inheritDoc
		 */
		public get durationWithoutRepeat():number{
			var _duration:number = 0;
			
			var n:number = this.childSets.length;
			for (var i:number = 0; i < n; i++){
				var instances:Array<any> = this.childSets[i];
				_duration = Math.max(instances[0].actualDuration, _duration);
			}
			return _duration;
		}
		
		/**
		 * @inheritDoc
		 */
		public _setPlayheadTime(value:number){
			this._setPlayheadTime(value);
			
			var compositeDur:number = (<Parallel><any> (this.effect)).compositeDuration;
			var firstCycleDur:number = compositeDur + this.startDelay + this.repeatDelay;
			var laterCycleDur:number = compositeDur + this.repeatDelay;
			var totalDur:number = firstCycleDur + laterCycleDur * (this.repeatCount - 1);
			var childPlayheadTime:number;
			if (value <= firstCycleDur) {
				childPlayheadTime = Math.min(value - this.startDelay, compositeDur);
				this.playCount = 1;
			}
			else{
				if (value >= totalDur && this.repeatCount != 0){
					childPlayheadTime = compositeDur;
					this.playCount = this.repeatCount;
				}
				else{
					var valueAfterFirstCycle:number = value - firstCycleDur;
					childPlayheadTime = valueAfterFirstCycle % laterCycleDur;
					this.playCount = 1 + valueAfterFirstCycle / laterCycleDur;
				}
			}
			
			for (var i:number = 0; i < this.childSets.length; i++){
				var instances:Array<any> = this.childSets[i];            
				var m:number = instances.length;
				for (var j:number = 0; j < m; j++)
					instances[j].playheadTime = this.playReversed ?
						Math.max(0, (childPlayheadTime - 
							(this.durationWithoutRepeat - instances[j].actualDuration))) :
						childPlayheadTime;
			}

			if (this.playReversed && this.replayEffectQueue != null && this.replayEffectQueue.length > 0){
				var position:number = this.durationWithoutRepeat - this.playheadTime;
				var numDone:number = this.replayEffectQueue.length;	        
				for (i = numDone - 1; i >= 0; i--){
					var childEffect:EffectInstance = this.replayEffectQueue[i];
					if (position <= childEffect.actualDuration){
						if (this.activeEffectQueue == null)
							this.activeEffectQueue = [];
						this.activeEffectQueue.push(childEffect);
						this.replayEffectQueue.splice(i,1);
						
						childEffect.playReversed = this.playReversed;
						childEffect.startEffect();
					}
				}
			}
			
		}
		
		/**
		 * @inheritDoc
		 */
		public play():void{
			this.doneEffectQueue = [];
			this.activeEffectQueue = [];
			this.replayEffectQueue = [];

			super.play();
			
			var n:number = 0;
			var i:number = 0;
			
			n = this.childSets.length;
			for (i = 0; i < n; i++){
				var instances:Array<any> = this.childSets[i];
				
				var m:number = instances.length;
				for (var j:number = 0; j < m && this.activeEffectQueue != null; j++){
					var childEffect:EffectInstance = instances[j];

					if (this.playReversed && childEffect.actualDuration < this.durationWithoutRepeat){
						this.replayEffectQueue.push(childEffect);
						this.startTimer();
					}
					else{
						childEffect.playReversed = this.playReversed;
						this.activeEffectQueue.push(childEffect);
					}
				}		
			}
			
			if (this.activeEffectQueue.length > 0){
				var queueCopy:Array<any> = this.activeEffectQueue.slice(0);
				for (i = 0; i < queueCopy.length; i++){
					queueCopy[i].startEffect();
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public pause():void{	
			super.pause();
			if (this.activeEffectQueue){
				var n:number = this.activeEffectQueue.length;
				for (var i:number = 0; i < n; i++){
					this.activeEffectQueue[i].pause();
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public stop():void{
			this.stopTimer();
			
			if (this.activeEffectQueue){
				var queueCopy:Array<any> = this.activeEffectQueue.concat();
				this.activeEffectQueue = null;
				var n:number = queueCopy.length;
				for (var i:number = 0; i < n; i++){
					if (queueCopy[i])
						queueCopy[i].stop();
				}
			}
			super.stop();
		}
		
		/**
		 * @inheritDoc
		 */
		public resume():void{
			super.resume();
			if (this.activeEffectQueue){
				var n:number = this.activeEffectQueue.length;
				for (var i:number = 0; i < n; i++){
					this.activeEffectQueue[i].resume();
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public reverse():void{
			super.reverse();
			
			var n:number = 0;
			var i:number = 0;
			
			if (this.isReversed){
				n = this.activeEffectQueue.length;
				for (i = 0; i < n; i++){
					this.activeEffectQueue[i].reverse();
				} 
				
				this.stopTimer();
			}
			else{
				this.replayEffectQueue = this.doneEffectQueue.splice(0);
				n = this.activeEffectQueue.length;
				for (i = 0; i < n; i++){
					this.activeEffectQueue[i].reverse();
				} 
				
				this.startTimer();
			}
			
			this.isReversed = !this.isReversed;
		}
		
		/**
		 * @inheritDoc
		 */
		public end():void{
			this.endEffectCalled = true;
			this.stopTimer();
			
			if (this.activeEffectQueue){
				var queueCopy:Array<any> = this.activeEffectQueue.concat();
				this.activeEffectQueue = null;
				var n:number = queueCopy.length;
				for (var i:number = 0; i < n; i++){
					if (queueCopy[i])
						queueCopy[i].end();
				}
			}
			
			super.end();
		}
		
		/**
		 * @inheritDoc
		 */
		public onEffectEnd(childEffect:IEffectInstance):void{
			if (this.endEffectCalled || this.activeEffectQueue == null)
				return;
			
			var n:number = this.activeEffectQueue.length;	
			for (var i:number = 0; i < n; i++){
				if (childEffect == this.activeEffectQueue[i]){
					this.doneEffectQueue.push(childEffect);
					this.activeEffectQueue.splice(i, 1);
					break;
				}
			}	
			
			if (n == 1){
				this.finishRepeat();
			}
		}
		
		private startTimer():void{
			if (!this.timer){
				this.timer = new egret.Timer(10);
				this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerHandler, this);
			}
			this.timer.start();
		}

		private stopTimer():void{
			if (this.timer)
				this.timer.reset();
		}

		private timerHandler(event:egret.TimerEvent):void{
			var position:number = this.durationWithoutRepeat - this.playheadTime;
			var numDone:number = this.replayEffectQueue.length;	
			
			if (numDone == 0){
				this.stopTimer();
				return;
			}
			
			for (var i:number = numDone - 1; i >= 0; i--){
				var childEffect:EffectInstance = this.replayEffectQueue[i];
				
				if (position <= childEffect.actualDuration){
					if (this.activeEffectQueue == null)
						this.activeEffectQueue = [];
					this.activeEffectQueue.push(childEffect);
					this.replayEffectQueue.splice(i,1);
					
					childEffect.playReversed =this.playReversed;
					childEffect.startEffect();
				} 
			}
		}
	}
}