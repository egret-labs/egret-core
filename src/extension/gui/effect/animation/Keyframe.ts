
module egret.gui {

	export class Keyframe{
		/**
		 * 构造函数
		 * @param time 以毫秒为单位的时间，此关键帧的效果目标应该在此时间处具有 value 参数指定的值。
		 * @param value 效果目标在给定的 time 处应该具有的值。
		 * @param valueBy 可选参数，如果提供该可选参数，
		 * 则可以通过将 valueBy 与 MotionPath 对象的关键帧集合中的前一个关键帧的 value 相加来动态地计算 value。
		 * 如果是序列中的第一个 Keyframe，则会忽略此值
		 * 
		 */
		public constructor(time:number = NaN, 
								 value:any = null, valueBy:any = null){
			this.value = value;
			this.time = time;
			this.valueBy = valueBy;
		}
		
		/**
		 * 返回此 Keyframe 对象的副本。
		 */
		public clone():Keyframe{
			var kf:Keyframe = new Keyframe(this.time, this.value, this.valueBy);
			kf.easerFunction = this.easerFunction;
			kf.timeFraction = this.timeFraction;
			return kf;
		}
		
		/**
		 * 效果目标的属性在 time 属性指定的时间处所应该具有的值。
		 */
		public value:any;
		
		/**
		 * 以毫秒为单位的时间，此关键帧的效果目标应该在此时间处具有 value 属性指定的值。
		 * 此时间与用此关键帧定义的效果的起始时间相关。
		 */
		public time:number;
		
		public timeFraction:number;
		
		/**
		 * 对运动路径中前一个 Keyframe 对象与此 Keyframe 对象之间的运动所应用的缓动行为。
		 * 默认情况下，缓动是线性的，或者根本就没有缓动。 
		 */
		public easerFunction:Function;
		
		/**
		 * 用于计算此关键帧或前一个关键帧中的 value 的可选参数（如果已指定）。
		 * 如果在前一个关键帧中未设置 value，但此关键帧中同时定义了 value 和 valueBy，
		 * 则前一个关键帧中的 value 可以通过以此关键帧中的 value 减去此关键帧中的 valueBy 来计算。
		 */
		public valueBy:any;
	}
}