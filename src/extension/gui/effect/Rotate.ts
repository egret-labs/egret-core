
module egret.gui {

	export class Rotate extends AnimateTransform{
		public constructor(target:any=null){
			super(target);
			this.instanceClass = AnimateTransformInstance;
		}
		
		/** 
		 * 目标对象的起始旋转角度
		 */
		public angleFrom:number;
		
		/** 
		 * 目标对象的结束旋转角度
		 */
		public angleTo:number;
		
		/** 
		 * 旋转目标对象的度数
		 */
		public angleBy:number;
		
		public createInstance(target:any = null):IEffectInstance{
			this.motionPaths = new Array<MotionPath>();
			return super.createInstance(target);
		}
		
		public initInstance(instance:IEffectInstance):void{
			this.addMotionPath("rotation", this.angleFrom, this.angleTo, this.angleBy);
			super.initInstance(instance);
		}    
	}
}