
module egret.gui {

	export class Move extends AnimateTransform{
		public constructor(target:any=null){
			super(target);
			this.instanceClass = AnimateTransformInstance;
		}
		
		/** 
		 * 按其修改目标的 y 位置的像素数目。此值可以为负值
		 */
		public yBy:number;
		
		/** 
		 * 目标的初始 y 位置
		 */
		public yFrom:number;

		/** 
		 * 目标的最终 y 位置
		 */
		public yTo:number;
		
		/** 
		 * 按其修改目标的 x 位置的像素数目
		 */
		public xBy:number;
		
		/** 
		 * 目标的初始 x 位置
		 */
		public xFrom:number;
		
		/** 
		 * 最终 x
		 */
		public xTo:number;

		public createInstance(target:any = null):IEffectInstance{
			this.motionPaths = new Array<MotionPath>();
			return super.createInstance(target);
		}
		
		public initInstance(instance:IEffectInstance):void{
			this.addMotionPath("translationX", this.xFrom, this.xTo, this.xBy);
			this.addMotionPath("translationY", this.yFrom, this.yTo, this.yBy);
			super.initInstance(instance);
		}    
	}
}