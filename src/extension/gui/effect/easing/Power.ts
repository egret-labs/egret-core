
module egret.gui {

	export class Power extends EaseInOutBase{
		
		private _exponent:number;
		/**
		 * 在缓动计算中使用的指数。exponent 属性的值越大，加速和减速的速率越快。
		 */		
		public get exponent():number{
			return this._exponent;
		}
		
		public set exponent(value:number){
			this._exponent = value;
		}
		
		/**
		 * 构造函数
		 * @param easeInFraction 在加速阶段中整个持续时间的部分，在 0.0 和 1.0 之间。
		 * @param exponent 在缓动计算中使用的指数。exponent 属性的值越大，加速和减速的速率越快。
		 * 
		 */		
		public constructor(easeInFraction:number = 0.5, exponent:number = 2){
			super(easeInFraction);
			this.exponent = exponent;
		}
		
		/**
		 * @inheritDoc
		 */
		public easeIn(fraction:number):number{
			return Math.pow(fraction, this._exponent);
		}
		
		/**
		 * @inheritDoc
		 */
		public easeOut(fraction:number):number{
			return 1 - Math.pow((1 - fraction), this._exponent);
		}
	}
}