
module egret.gui {

	export class Bounce implements IEaser{
		/**
		 * 构造函数
		 */	
		public constructor(){
		}
		
		public ease(fraction:number):number{
			return this.easeOut(fraction, 0, 1, 1);
		}
		
		public easeOut(t:number, b:number,
									   c:number, d:number):number{
			if ((t /= d) < (1 / 2.75))
				return c * (7.5625 * t * t) + b;
				
			else if (t < (2 / 2.75))
				return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
				
			else if (t < (2.5 / 2.75))
				return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
				
			else
				return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
		}
	}
}