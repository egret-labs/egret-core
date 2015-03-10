
module egret.gui {

	export class SimpleMotionPath extends MotionPath{
		
		/**
		 * 构造函数。您可以同时指定 valueFrom 和 valueTo 参数，
		 * 也可以在指定 valueBy 参数的同时指定 valueFrom 或 valueTo 参数。
		 * 如果忽略这些参数，则会从效果目标计算它们。
		 *  @param property 正在设置动画的属性的名称。
		 *  @param valueFrom 属性的初始值。
		 *  @param valueTo 属性的最终值。
		 *  @param valueBy 用于指定 delta 的可选参数，该 delta 用于计算 from 或 to 值（如果其中一个值被忽略）。
		 */    
		public constructor(property:string = null, 
										 valueFrom:any = null, valueTo:any = null, 
										 valueBy:any = null){
			super();
			this.property = property;
			this.keyframes = [new Keyframe(0, valueFrom), new Keyframe(NaN, valueTo, valueBy)];
		}
		
		/**
		 * 动画过程中属性的起始值。 
		 */
		public get valueFrom():any{
			return this.keyframes[0].value;
		}
		public set valueFrom(value:any){
			this.keyframes[0].value = value;
		}
		
		/**
		 * 已命名的属性将要设置动画的值。 
		 */
		public get valueTo():any{
			return this.keyframes[this.keyframes.length -1].value;
		}
		public set valueTo(value:any){
			this.keyframes[this.keyframes.length - 1].value = value;
		}
		
		/**
		 * 可指定用于计算 valueFrom 或 valueTo 值的 delta 的可选属性。
		 */
		public get valueBy():any{
			return this.keyframes[this.keyframes.length - 1].valueBy;
		}
		public set valueBy(value:any){
			this.keyframes[this.keyframes.length - 1].valueBy = value;
		}
	}
}