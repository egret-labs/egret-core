
module egret.gui {

	export interface IEaser{
		/**
		 * 输入动画播放的当前时刻点，返回转换过后映射的时刻点。
		 * @param fraction 动画播放的当前时刻点，从 0.0 到 1.0。
		 */		
		ease(fraction:number):number;
	}
}