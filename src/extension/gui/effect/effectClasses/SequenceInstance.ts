
module egret.gui {

	export class SequenceInstance extends CompositeEffectInstance{

		public constructor(target:any){
			super(target);
		}

		/**
		 * 已播放效果的持续时间
		 */
		private currentInstanceDuration:number = 0; 
		
		/**
		 * 当前播放的效果实例
		 */
		private currentSet:Array<any>;
		private currentSetIndex:number = -1;
		
		private isPaused:boolean = false;
		
		/**
		 * @inheritDoc
		 */
		public get durationWithoutRepeat():number{
			var _duration:number = 0;
			
			var n:number = this.childSets.length;
			for (var i:number = 0; i < n; i++){
				var instances:Array<any> = this.childSets[i];
				_duration += instances[0].actualDuration;
			}
			
			return _duration;
		}
		
		/**
		 * @inheritDoc
		 */
		public _setPlayheadTime(value:number){
            this._setPlayheadTime(value);

			var i:number, j:number, k:number, l:number = 0;
			var compositeDur:number = (<Sequence><any> (this.effect)).compositeDuration;
			var firstCycleDur:number = compositeDur + this.startDelay + this.repeatDelay;
			var laterCycleDur:number = compositeDur + this.repeatDelay;
			var totalDur:number = firstCycleDur + laterCycleDur * (this.repeatCount - 1);
			var iterationPlayheadTime:number;
			if (value <= firstCycleDur){
				iterationPlayheadTime = Math.min(value - this.startDelay, compositeDur);
				this.playCount = 1;
			}
			else{
				if (value >= totalDur && this.repeatCount != 0){
					iterationPlayheadTime = compositeDur;
					this.playCount = this.repeatCount;
				}
				else{
					var valueAfterFirstCycle:number = value - firstCycleDur;
					iterationPlayheadTime = valueAfterFirstCycle % laterCycleDur;
					iterationPlayheadTime = Math.min(iterationPlayheadTime, compositeDur);
					this.playCount = 1 + valueAfterFirstCycle / laterCycleDur;
				}
			}
			
			if (this.activeEffectQueue && this.activeEffectQueue.length  > 0){
				var cumulativeDuration:number = 0;
				
				var activeLength:number = this.activeEffectQueue.length;
				for (i = 0; i < activeLength; ++i){
					var setToCompare:number = this.playReversed ? (activeLength - 1 - i) : i;
					var childEffectInstances:Array<any>;
					var startTime:number = cumulativeDuration;
					var endTime:number = cumulativeDuration + this.childSets[setToCompare][0].actualDuration;
					cumulativeDuration = endTime;
					
					if (startTime <= iterationPlayheadTime && iterationPlayheadTime <= endTime){
						this.endEffectCalled = true;
						
						if (this.currentSetIndex == setToCompare){
							for (j = 0; j < this.currentSet.length; j++)
								this.currentSet[j].playheadTime = (iterationPlayheadTime - startTime);
						}
						else if (setToCompare < this.currentSetIndex){
							if (this.playReversed){
								for (j = 0; j < this.currentSet.length; j++)
									this.currentSet[j].end();

								for (j = this.currentSetIndex - 1; j > setToCompare; --j){
									childEffectInstances = this.activeEffectQueue[j];
									for (k = 0; k < childEffectInstances.length; k++){
										if (this.playReversed)
											childEffectInstances[k].playReversed = true;
										childEffectInstances[k].play();
										childEffectInstances[k].end();
									}
								}
							}
							else{
								for (j = 0; j < this.currentSet.length; j++){
									this.currentSet[j].playheadTime = 0;
									this.currentSet[j].stop();
								}

								for (j = this.currentSetIndex - 1; j > setToCompare; --j){
									childEffectInstances = this.activeEffectQueue[j];
									for (k = 0; k < childEffectInstances.length; k++){
										childEffectInstances[k].play();
										childEffectInstances[k].stop();
									}
								}
							}
							this.currentSetIndex = setToCompare;
							this.playCurrentChildSet();
							for (k = 0; k < this.currentSet.length; k++){
								this.currentSet[k].playheadTime = (iterationPlayheadTime - startTime);
								if (this.isPaused)
									this.currentSet[k].pause();
							}
						}
						else{
							if (this.playReversed){
								for (j = 0; j < this.currentSet.length; j++){
									this.currentSet[j].playheadTime = 0;
									this.currentSet[j].stop();
								}
								
								for (k = this.currentSetIndex + 1; k < setToCompare; k++){
									childEffectInstances = this.activeEffectQueue[k];                          
									for (l = 0; l < childEffectInstances.length; l++){
										childEffectInstances[l].playheadTime = 0;
										childEffectInstances[l].stop();
									}
								}                            
							}
							else{
								var currentEffectInstances:Array<any> = this.currentSet.concat();
								for (j = 0; j < currentEffectInstances.length; j++)
									currentEffectInstances[j].end();
								
								for (k = this.currentSetIndex + 1; k < setToCompare; k++){
									childEffectInstances = this.activeEffectQueue[k];                          
									for (l = 0; l < childEffectInstances.length; l++){
										childEffectInstances[l].play();
										childEffectInstances[l].end();
									}
								}
							}
							
							this.currentSetIndex = setToCompare;
							this.playCurrentChildSet();
							for (k = 0; k < this.currentSet.length; k++){
								this.currentSet[k].playheadTime = (iterationPlayheadTime - startTime);
								if (this.isPaused)
									this.currentSet[k].pause();
							}
						}
						this.endEffectCalled = false;
						break;
					}
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public play():void{
			this.isPaused = false;
			this.activeEffectQueue = [];
			this.currentSetIndex = this.playReversed ? this.childSets.length : -1;
			
			var n:number = 0;
			var i:number = 0;
			var m:number = 0;
			var j:number = 0;

			n = this.childSets.length;
			for (i = 0; i < n; i++){
				var instances:Array<any> = this.childSets[i];
				this.activeEffectQueue.push(instances);
			}
			
			super.play();
			
			if (this.activeEffectQueue.length == 0){
				this.finishRepeat();
				return;
			}
			this.playNextChildSet();
		}
		
		/**
		 * @inheritDoc
		 */
		public pause():void{   
			super.pause();
			this.isPaused = true;
			if (this.currentSet && this.currentSet.length > 0){
				var n:number = this.currentSet.length;
				for (var i:number = 0; i < n; i++){
					this.currentSet[i].pause();
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public stop():void{
			this.isPaused = false;
			
			if (this.activeEffectQueue && this.activeEffectQueue.length > 0){
				var queueCopy:Array<any> = this.activeEffectQueue.concat();
				this.activeEffectQueue = null;
				var currentInstances:Array<any> = queueCopy[this.currentSetIndex];
				if (currentInstances){
					var currentCount:number = currentInstances.length;
					
					for (var i:number = 0; i < currentCount; i++)
						currentInstances[i].stop();
				}

				var n:number = queueCopy.length;
				for (var j:number = this.currentSetIndex + 1; j < n; j++){
					var waitingInstances:Array<any> = queueCopy[j];
					var m:number = waitingInstances.length;
					
					for (var k:number = 0; k < m; k++){
						var instance:IEffectInstance = waitingInstances[k];
						instance.effect.deleteInstance(instance);
					}
				}
			}
			super.stop();
		}   
		
		/**
		 * @inheritDoc
		 */
		public resume():void{
			super.resume();
			this.isPaused = false;
			if (this.currentSet && this.currentSet.length > 0){
				var n:number = this.currentSet.length;
				for (var i:number = 0; i < n; i++){
					this.currentSet[i].resume();
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public reverse():void{
			super.reverse();
			if (this.currentSet && this.currentSet.length > 0){
				var n:number = this.currentSet.length;
				for (var i:number = 0; i < n; i++){
					this.currentSet[i].reverse();
				}
			}
		}
		
		/**
		 * 中断当前正在播放的所有效果，跳过尚未开始播放的所有效果，并立即跳至最终的复合效果。
		 */
		public end():void{
			this.endEffectCalled = true;
			if (this.activeEffectQueue && this.activeEffectQueue.length > 0){
				var queueCopy:Array<any> = this.activeEffectQueue.concat();
				this.activeEffectQueue = null;
				
				var currentInstances:Array<any> = queueCopy[this.currentSetIndex];
				if (currentInstances){
					var currentCount:number = currentInstances.length;                
					for (var i:number = 0; i < currentCount; i++){
						currentInstances[i].end();
					}
				}
				
				var n:number = queueCopy.length;
				for (var j:number = this.currentSetIndex + 1; j < n; j++){
					var waitingInstances:Array<any> = queueCopy[j];
					var m:number = waitingInstances.length;
					
					for (var k:number = 0; k < m; k++){
						(<EffectInstance><any> (waitingInstances[k])).playWithNoDuration();
					}
				}
			}
			this.isPaused = false;
			super.end();
		}
		
		/**
		 * @inheritDoc
		 */
		public onEffectEnd(childEffect:IEffectInstance):void{
			for (var i:number = 0; i < this.currentSet.length; i++){
				if (childEffect == this.currentSet[i]){
					this.currentSet.splice(i, 1);
					break;
				}
			}   
			if (this.endEffectCalled)
				return; 
			
			if (this.currentSet.length == 0){
				if (false == this.playNextChildSet())
					this.finishRepeat();
			}
		}

		private playCurrentChildSet():void{
			var childEffect:EffectInstance;
			var instances:Array<any> = this.activeEffectQueue[this.currentSetIndex];
			
			this.currentSet = [];
			
			for (var i:number = 0; i < instances.length; i++){
				childEffect = instances[i];
				
				this.currentSet.push(childEffect);
				childEffect.playReversed = this.playReversed;
				childEffect.startEffect();
			}
			this.currentInstanceDuration += childEffect.actualDuration;
		}
		
		private playNextChildSet(offset:number = 0):boolean{
			if (!this.playReversed){
				if (!this.activeEffectQueue ||
					this.currentSetIndex++ >= this.activeEffectQueue.length - 1){
					return false;
				}
			}
			else{
				if (this.currentSetIndex-- <= 0)
					return false;
			}
			this.playCurrentChildSet();
			return true;
		}
	}
}