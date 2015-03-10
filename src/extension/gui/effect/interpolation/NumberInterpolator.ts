
module egret.gui {

	export class NumberInterpolator implements IInterpolator{
		public constructor(){
		}
		
		private static theInstance:NumberInterpolator;

		public static getInstance():NumberInterpolator{
			if (!NumberInterpolator.theInstance)
				NumberInterpolator.theInstance = new NumberInterpolator();
			return NumberInterpolator.theInstance;
		}
		
		public interpolate(fraction:number, startValue:any, endValue:any):any{
			if (fraction == 0)
				return startValue;
			else if (fraction == 1)
				return endValue;
			return <number><any> startValue + (fraction * (<number><any> endValue - <number><any> startValue));
		}
		
		public increment(baseValue:any, incrementValue:any):any{
			return <number><any> baseValue + <number><any> incrementValue;
		}
		
		public decrement(baseValue:any, decrementValue:any):any{
			return <number><any> baseValue - <number><any> decrementValue;
		}
	}
}