
module egret.gui {

	export class Fade extends Animate{
		public constructor(target:any=null){
			super(target);
			this.instanceClass = FadeInstance;
		}
		
		public alphaFrom:number;

		public alphaTo:number;
		
		public initInstance(instance:IEffectInstance):void{
			super.initInstance(instance);
			
			var fadeInstance:FadeInstance = <FadeInstance><any> instance;
			fadeInstance.alphaFrom = this.alphaFrom;
			fadeInstance.alphaTo = this.alphaTo;
		}
	}
}