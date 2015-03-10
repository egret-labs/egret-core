
module egret.gui {

	export class Sequence extends CompositeEffect{
		public constructor(target:any=null){
			super(target);
			this.instanceClass = SequenceInstance;
		}
		
		/**
		 * @inheritDoc
		 */
		public get compositeDuration():number{
			var sequenceDuration:number = 0;
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
				sequenceDuration += childDuration;
			}
			return sequenceDuration;
		}
	}
}