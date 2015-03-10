
module egret.gui {

	export class FadeInstance extends AnimateInstance{
		public constructor(target:any){
			super(target);
			this.autoRemoveTarget = true;
		}
		
		/**
		 * 介于 0.0 和 1.0 之间的 alpha 属性的初始值
		 */
		public alphaFrom:number;
		
		/**
		 * 介于 0.0 和 1.0 之间的 alpha 属性的最终值
		 */
		public alphaTo:number;
		
		public play():void{
			var fromValue:number = this.alphaFrom;
			var toValue:number = this.alphaTo;

			if ("visible" in this.target && !this.target.visible){
				if (isNaN(fromValue))
					fromValue = this.target.alpha;
				if (isNaN(toValue))
					toValue = this.target.alpha;
				if (fromValue == 0 && toValue != 0){
					this.target.alpha = 0;
					this.target.visible = true;
				}
			}
			
			this.motionPaths = [new MotionPath("alpha")];
			this.motionPaths[0].keyframes = [new Keyframe(0, this.alphaFrom),
				new Keyframe(this.duration, this.alphaTo)];
			
			super.play();
		}
	}
}