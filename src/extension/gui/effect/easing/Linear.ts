
module egret.gui {

	export class Linear implements IEaser{
		/**
		 * 构造函数
		 * @param easeInFraction 在加速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
		 * @param easeOutFraction 在减速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
		 */		
		public constructor(easeInFraction:number = 0, easeOutFraction:number = 0){
			this.easeInFraction = easeInFraction;
			this.easeOutFraction = easeOutFraction;
		}
		
		private _easeInFraction:number = 0;
		/**
		 * 在加速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
		 */		
		public get easeInFraction():number{
			return this._easeInFraction;
		}
		
		public set easeInFraction(value:number){
			this._easeInFraction = value;
		}
		
		private _easeOutFraction:number = 0;
		/**
		 * 在减速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
		 */		
		public get easeOutFraction():number{
			return this._easeOutFraction;
		}
		
		public set easeOutFraction(value:number){
			this._easeOutFraction = value;
		}
		
		public ease(fraction:number):number{
			
			if (this.easeInFraction == 0 && this.easeOutFraction == 0)
				return fraction;
			
			var runRate:number = 1 / (1 - this.easeInFraction/2 - this.easeOutFraction/2);
			if (fraction < this.easeInFraction)
				return fraction * runRate * (fraction / this.easeInFraction) / 2;
			if (fraction > (1 - this.easeOutFraction)){
				var decTime:number = fraction - (1 - this.easeOutFraction);
				var decProportion:number = decTime / this.easeOutFraction;
				return runRate * (1 - this.easeInFraction/2 - this.easeOutFraction +
					decTime * (2 - decProportion) / 2);
			}
			return runRate * (fraction - this.easeInFraction/2);
		}
	}
}