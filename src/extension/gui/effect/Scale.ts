
module egret.gui {

	export class Scale extends AnimateTransform{
		public constructor(target:any=null){
			super(target);
			this.instanceClass = AnimateTransformInstance;
		}
		
		/**
		 * 在 y 方向上的起始比例因子。比例值为 0.0 时无效。
		 */
		public scaleYFrom:number;

		/**
		 * 在 y 方向上的结束比例因子。比例值为 0.0 时无效。
		 */
		public scaleYTo:number;

		/**
		 * 在 y 方向上按其缩放对象的因子。
		 */
		public scaleYBy:number;
		
		/**
		 * 在 x 方向上的起始比例因子。比例值为 0.0 时无效。
		 */
		public scaleXFrom:number;

		/**
		 * 在 x 方向上的结束比例因子。比例值为 0.0 时无效。
		 */
		public scaleXTo:number;

		/**
		 * 在 x 方向上按其缩放对象的因子。
		 */
		public scaleXBy:number;
		
		public createInstance(target:any = null):IEffectInstance{
			this.motionPaths = new Array<MotionPath>();
			return super.createInstance(target);
		}

		public initInstance(instance:IEffectInstance):void{
			this.addMotionPath("scaleX", this.scaleXFrom, this.scaleXTo, this.scaleXBy);
			this.addMotionPath("scaleY", this.scaleYFrom, this.scaleYTo, this.scaleYBy);
			super.initInstance(instance);
		}    
	}
}