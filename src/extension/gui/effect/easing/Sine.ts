
module egret.gui {

	export class Sine extends EaseInOutBase{
		/**
		 * 构造函数
		 * @param easeInFraction 缓入过程所占动画播放时间的百分比。剩余即为缓出的时间。
		 */		
		public constructor(easeInFraction:number = 0.5){
			super(easeInFraction);
		}
		
		/**
		 * @inheritDoc
		 */
		public easeIn(fraction:number):number{
			return 1 - Math.cos(fraction * Math.PI/2);
		}
		
		/**
		 * @inheritDoc
		 */
		public easeOut(fraction:number):number{
			return Math.sin(fraction * Math.PI/2);
		}
	}
}