
module egret.gui {

	export class Elastic implements IEaser{
		public constructor(){
		}
		
		public ease(fraction:number):number{
			return this.easeOut(fraction, 0, 1, 1);
		}
		
		public easeOut(t:number, b:number,
									   c:number, d:number,
									   a:number = 0, p:number = 0):number{
			if (t == 0)
				return b;
			
			if ((t /= d) == 1)
				return b + c;
			
			if (!p)
				p = d * 0.3;
			
			var s:number;
			if (!a || a < Math.abs(c)){
				a = c;
				s = p / 4;
			}
			else{
				s = p / (2 * Math.PI) * Math.asin(c / a);
			}
			
			return a * Math.pow(2, -10 * t) *
				Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
		}

	}
}