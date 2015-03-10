
module egret.gui {

	export interface IInterpolator{
		
		/**
		 * 如果有在 0.0 和 1.0 之间的某个动画的已过去部分，以及要插补的开始值和结束值，则返回内插值。
		 * @param fraction 动画的已过去部分，在 0.0 和 1.0 之间。
		 * @param startValue 插值的开始值。
		 * @param endValue 插值的结束值。
		 * @return 内插值。
		 */
		interpolate(fraction:number, startValue:any, endValue:any):any;
		
		/**
		 * 如果有一个基值和一个要添加到它的值，则返回该操作的结果。
		 * @param baseValue 插值的开始值。
		 * @param incrementValue  应用到 baseValue 的更改。
		 * @return 内插值。
		 */
		increment(baseValue:any, incrementValue:any):any;
		
		/**
		 * 如果有一个基值和一个从其减去的值，则返回该减量操作的结果。
		 * @param baseValue 插值的开始值。
		 * @param decrementValue  应用到 baseValue 的更改。
		 * @return  内插值。
		 */
		decrement(baseValue:any, decrementValue:any):any;
	}
}