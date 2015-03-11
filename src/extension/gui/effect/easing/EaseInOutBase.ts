
module egret.gui {

	export class EaseInOutBase implements IEaser{
		/**
		 * 构造函数
		 * @param easeInFraction 缓入过程所占动画播放时间的百分比。剩余即为缓出的时间。
		 * 默认值为 EasingFraction.IN_OUT，它会缓入前一半时间，并缓出剩余的一半时间。
		 */		
		public constructor(easeInFraction:number = 0.5){
			this.easeInFraction = easeInFraction;
		}
		
		private _easeInFraction:number = .5;
		/**
		 * 缓入过程所占动画播放时间的百分比。剩余即为缓出的时间。
		 * 有效值为 0.0 到 1.0。
		 */		
		public get easeInFraction():number{
			return this._easeInFraction;
		}
		
		public set easeInFraction(value:number){
			this._easeInFraction = value;
		}
		
		public ease(fraction:number):number{
			var easeOutFraction:number = 1 - this._easeInFraction;
			
			if (fraction <= this._easeInFraction && this._easeInFraction > 0)
				return this._easeInFraction * this.easeIn(fraction/this._easeInFraction);
			else
				return this._easeInFraction + easeOutFraction *
					this.easeOut((fraction - this._easeInFraction)/easeOutFraction);
		}
		/**
		 * 在动画的缓入阶段期间计算已经缓动部分要映射到的值。
		 */		
		public easeIn(fraction:number):number{
			return fraction;
		}
		
		/**
		 * 在动画的缓出阶段期间计算已经缓动部分要映射到的值。
		 */		
		public easeOut(fraction:number):number{
			return fraction;
		}
		
	}
}