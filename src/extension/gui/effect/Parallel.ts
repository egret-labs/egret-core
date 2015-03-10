
module egret.gui {

	export class Parallel extends CompositeEffect{
		public constructor(target:any = null){
			super(target);
			this.instanceClass = ParallelInstance;
		}
		
		/**
		 * @inheritDoc
		 */
		public get compositeDuration():number{
			var parallelDuration:number = 0;
			for (var i:number = 0; i < this.children.length; ++i){
				var childDuration:number;
				var child:Effect = <Effect><any> (this.children[i]);
				if (child instanceof CompositeEffect)
					childDuration = (<CompositeEffect><any> child).compositeDuration;
				else
					childDuration = child.duration;
				childDuration = 
					childDuration * child.repeatCount +
					(child.repeatDelay * (child.repeatCount - 1)) +
					child.startDelay;
				parallelDuration = Math.max(parallelDuration, childDuration);
			}
			return parallelDuration;
		}
	}
}