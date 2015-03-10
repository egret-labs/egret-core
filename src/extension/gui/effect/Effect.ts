
module egret.gui {

	export class Effect extends egret.EventDispatcher implements IEffect{
		public constructor(target:any = null){
			super();
			this.target = target;
		}
		
		private _instances:Array<any> = [];
		
		private _isPaused:boolean = false;
		
		/**
		 * 是否在逆转播放
		 */
		public playReversed:boolean;
		
		private effectStopped:boolean;
		
		/**
		 * 效果所属的复杂效果
		 */
		public parentCompositeEffect:Effect;
		
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
		public durationExplicitlySet:boolean = false;
		/**
		 * @inheritDoc
		 */
		public get duration():number{
			if (!this.durationExplicitlySet &&
				this.parentCompositeEffect){
				return this.parentCompositeEffect.duration;
			}
			else{
				return this._duration;
			}
		}
		
		public set duration(value:number){
			this.durationExplicitlySet = true;
			this._duration = value;
		}

		/**
		 * 一个 Class 类型的对象，用于指定此效果类的效果实例类。
		 * <p>Effect 类的所有子类都必须在其构造函数中设置此属性。</p>
		 */
		public instanceClass:any;
		
		/**
		 * @inheritDoc
		 */
		public get isPlaying():boolean{
			return this._instances && this._instances.length > 0;
		}

        /**
         * 是否处于暂停状态，当调用了paused()方法后此属性为true
         */
        public get isPaused():Boolean
        {
            if(this.isPlaying)
                return this._isPaused;
            else
                return false;
        }
		
		private _perElementOffset:number = 0;
		/**
		 * @inheritDoc
		 */
		public get perElementOffset():number{
			return this._perElementOffset;
		}

		public set perElementOffset(value:number){
			this._perElementOffset = value;
		}
		
		/**
		 * 效果的重复次数。可能的值为任何大于等于 0 的整数。
		 * 值为 1 表示播放一次效果。值为 0 表示无限制地循环播放效果，直到通过调用 end() 方法停止播放。
		 */
		public repeatCount:number = 1;
		
		/**
		 * 重复播放效果前需要等待的时间（以毫秒为单位）。可能的值为任何大于等于 0 的整数。
		 */
		public repeatDelay:number = 0;

		/**
		 * 开始播放效果前需要等待的时间（以毫秒为单位）。
		 * 此值可以是任何大于或等于 0 的整数。
		 * 如果使用 repeatCount 属性重复播放效果，则只在首次播放效果时应用 startDelay。
		 */
		public startDelay:number = 0;
		
		/**
		 * @inheritDoc
		 */
		public get target():any{
			if (this._targets.length > 0)
				return this._targets[0]; 
			else
				return null;
		}
		
		public set target(value:any){
			this._targets.splice(0);
			
			if (value)
				this._targets[0] = value;
		}
		
		private _targets:Array<any> = [];
		/**
		 * @inheritDoc
		 */
		public get targets():Array<any>{
			return this._targets;
		}

		public set targets(value:Array<any>){
			var n:number = value.length;
			for (var i:number = n - 1; i >= 0; i--){
				if (value[i] == null)
					value.splice(i,1);
			}
			this._targets = value;
		}
		
		private _playheadTime:number = 0;
		/**
		 * @inheritDoc
		 */
		public get playheadTime():number {
			for (var i:number = 0; i < this._instances.length; i++){
				if (this._instances[i])
					return (<IEffectInstance><any> (this._instances[i])).playheadTime;
			}
			return this._playheadTime;
		}
		public set playheadTime(value:number){
			var started:boolean = false;
			if (this._instances.length == 0){
				this.play();
				started = true;
			}
			for (var i:number = 0; i < this._instances.length; i++){
				if (this._instances[i])
					(<IEffectInstance><any> (this._instances[i])).playheadTime = value;
			}
			if (started)
				this.pause();
			this._playheadTime = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public createInstances(targets:Array<any> = null):Array<any>{
			if (!targets)
				targets = this.targets;
			
			var newInstances:Array<any> = [];
			var offsetDelay:number = 0;
			
			var length:number = targets.length;
			for(var i:number = 0;i < length;i++){
				var target:any = targets[i];
				var newInstance:IEffectInstance = this.createInstance(target);
				if (newInstance){
					newInstance.startDelay += offsetDelay;
					offsetDelay += this.perElementOffset;
					newInstances.push(newInstance);
				}
			}
			
			return newInstances; 
		}
		
		/**
		 * @inheritDoc
		 */
		public createInstance(target:any = null):IEffectInstance{       
			if (!target)
				target = this.target;
			
			var newInstance:IEffectInstance = <IEffectInstance><any> (new this.instanceClass(target));
			this.initInstance(newInstance);
			
			(<egret.EventDispatcher><any> newInstance).addEventListener(EffectEvent.EFFECT_START, this.effectStartHandler, this);
			(<egret.EventDispatcher><any> newInstance).addEventListener(EffectEvent.EFFECT_STOP, this.effectStopHandler, this);
			(<egret.EventDispatcher><any> newInstance).addEventListener(EffectEvent.EFFECT_END, this.effectEndHandler, this);
			
			this._instances.push(newInstance);
			
			return newInstance;
		}
		
		/**
		 *  将效果的属性复制到效果实例。 
		 *  <p>创建自定义效果时覆盖此方法，将属性从 Effect 类复制到效果实例类。
		 * 进行覆盖时，请调用 super.initInstance()。 </p>
		 *  @param EffectInstance 要初始化的效果实例。
		 */
		public initInstance(instance:IEffectInstance):void{
			instance.duration = this.duration;
			(<any> instance).durationExplicitlySet = this.durationExplicitlySet;
			instance.effect = this;
			instance.repeatCount = this.repeatCount;
			instance.repeatDelay = this.repeatDelay;
			instance.startDelay = this.startDelay;
		}
		
		/**
		 * @inheritDoc
		 */
		public deleteInstance(instance:IEffectInstance):void{
			(<egret.EventDispatcher><any> instance).removeEventListener(
				EffectEvent.EFFECT_START, this.effectStartHandler, this);
			(<egret.EventDispatcher><any> instance).removeEventListener(
				EffectEvent.EFFECT_STOP, this.effectStopHandler, this);
			(<egret.EventDispatcher><any> instance).removeEventListener(
				EffectEvent.EFFECT_END, this.effectEndHandler, this);
			
			var n:number = this._instances.length;
			for (var i:number = 0; i < n; i++){
				if (this._instances[i] === instance)
					this._instances.splice(i, 1);
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public play(targets:Array<any> = null,playReversedFromEnd:boolean = false):Array<any>{
			this.effectStopped = false;
			this._isPaused = false;
			this.playReversed = playReversedFromEnd;
			
			var newInstances:Array<any> = this.createInstances(targets);
			
			var n:number = newInstances.length;
			for (var i:number = 0; i < n; i++) {
				var newInstance:IEffectInstance = <IEffectInstance><any> (newInstances[i]);
				(<any> newInstance).playReversed = playReversedFromEnd;
				newInstance.startEffect();
			}
			return newInstances; 
		}
		
		/**
		 * @inheritDoc
		 */
		public pause():void{
			if (this.isPlaying && !this._isPaused){
				this._isPaused = true;
				var n:number = this._instances.length;
				for (var i:number = 0; i < n; i++){
					(<IEffectInstance><any> (this._instances[i])).pause();
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public stop():void{   
			var n:number = this._instances.length - 1;
			for (var i:number = n; i >= 0; i--){
				var instance:IEffectInstance = <IEffectInstance><any> (this._instances[i]);
				if (instance)
					instance.stop();
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public resume():void{
			if (this.isPlaying && this._isPaused){
				this._isPaused = false;
				var n:number = this._instances.length;
				for (var i:number = 0; i < n; i++){
					(<IEffectInstance><any> (this._instances[i])).resume();
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public reverse():void{
			if (this.isPlaying){
				var n:number = this._instances.length;
				for (var i:number = 0; i < n; i++){
					(<IEffectInstance><any> (this._instances[i])).reverse();
				}
			}
		}
		
		/**
		 * @inheritDoc
		 */
		public end(effectInstance:IEffectInstance = null):void{
			if (effectInstance){
				effectInstance.end();
			}
			else{
				var n:number = this._instances.length;
				for (var i:number = n - 1; i >= 0; i--){
					var instance:IEffectInstance = <IEffectInstance><any> (this._instances[i]);
					if (instance)
						instance.end();
				}
			}
		}
		
		/**
		 * 当效果实例开始播放时调用此方法。
		 */
		public effectStartHandler(event:EffectEvent):void {
			this.dispatchEvent(event);
		}
		
		/**
		 * 当效果实例已被 stop() 方法调用停止时调用。
		 */
		public effectStopHandler(event:EffectEvent):void{
			this.dispatchEvent(event);
			this.effectStopped = true;
		}
		
		/**
		 * 当效果实例完成播放时调用。
		 */
		public effectEndHandler(event:EffectEvent):void {
			var instance:IEffectInstance = <IEffectInstance><any> (event.effectInstance);
			this.deleteInstance(instance);
			this.dispatchEvent(event);
		}
	}
}