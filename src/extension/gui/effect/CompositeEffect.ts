
module egret.gui {

	export class CompositeEffect extends Effect{
		
		public constructor(target:any = null){
			super(target);
			this.instanceClass = CompositeEffectInstance;
		}   
		
		private childTargets:Array<any>;
		
		private _children:Array<any> = [];
		/**
		 * 包含此 CompositeEffect 的子效果的数组。
		 */
		public get children():Array<any>{
			return this._children;
		}
		public set children(value:Array<any>){
			var i:number = 0;
			if (this._children)
				for (i = 0; i < this._children.length; ++i)
					if (this._children[i])
						(<Effect><any> (this._children[i])).parentCompositeEffect = null;
			this._children = value;
			if (this._children)
				for (i = 0; i < this._children.length; ++i)
					if (this._children[i])
						(<Effect><any> (this._children[i])).parentCompositeEffect = this;
		}
		
		/**
		 * 返回此效果的持续时间，由所有子效果的持续时间进行定义。
		 * 这会考虑所有子效果的 startDelay 和重复信息，以及其持续时间，并返回相应的结果。
		 */
		public get compositeDuration():number{
			return this.duration;
		}

		/**
		 * @inheritDoc
		 */
		public createInstance(target:any = null):IEffectInstance{
			if (!this.childTargets)
				this.childTargets = [ target ];
			
			var newInstance:IEffectInstance = super.createInstance(target);
			
			this.childTargets = null;
			
			return newInstance;
		}
		
		/**
		 * @inheritDoc
		 */
		public createInstances(targets:Array<any> = null):Array<any>{
			if (!targets)
				targets = this.targets;
			
			this.childTargets = targets;
			var newInstance:IEffectInstance = this.createInstance();
			this.childTargets = null;
			return newInstance ? [ newInstance ] : [];
		}
		
		/**
		 * @inheritDoc
		 */
		public initInstance(instance:IEffectInstance):void{
			super.initInstance(instance);
			
			var compInst:CompositeEffectInstance = <CompositeEffectInstance><any> instance;
			
			var targets:any = this.childTargets;
			if (!(targets instanceof Array))
				targets = [ targets ];
			
			if (this.children){
				var n:number = this.children.length;
				for (var i:number = 0; i < n; i++){
					var childEffect:Effect = this.children[i];
					
					if (childEffect.targets.length == 0){
						compInst.addChildSet(
							this.children[i].createInstances(targets));  
					}
					else{
						compInst.addChildSet(
							this.children[i].createInstances(childEffect.targets));
					}   
				}
			}       
		}   
		
		/**
		 * 将新的子效果添加到此复合效果。
		 * Sequence 效果按照子效果的添加顺序播放子效果，一次播放一个。
		 * Parallel 效果同时播放所有子效果；添加子效果的顺序无关紧要。
		 */
		public addChild(childEffect:IEffect):void{
			this.children.push(childEffect);
			(<Effect><any> childEffect).parentCompositeEffect = this;
		}
	}
}