
module egret.gui {

	export class MotionPath{
		
		/**
		 * 构造函数
		 * @param property 要设置动画的目标上属性的名称。
		 */
		public constructor(property:string = null){
			this.property = property;
		}
		
		/**
		 * 要设置动画的效果目标上属性的名称。
		 */
		public property:string;

		public interpolator:IInterpolator = NumberInterpolator.getInstance();
		
		/**
		 * 表示属性在动画过程中所采用的时间/值对的 Keyframe 对象序列。
		 */
		public keyframes:Array<Keyframe>;
		
		
		/**
		 * 返回此 MotionPath 对象的副本（包含每个关键帧的副本）。
		 */
		public clone():MotionPath{
			var mp:MotionPath = new MotionPath(this.property);
			mp.interpolator = this.interpolator;
			if (this.keyframes !== null){
				mp.keyframes = new Array<Keyframe>();
				for (var i:number = 0; i < this.keyframes.length; ++i)
					mp.keyframes[i] = this.keyframes[i].clone();
			}
			return mp;
		}
		
		/**
		 * 计算每一个关键帧的timeFraction值
		 */
		public scaleKeyframes(duration:number):void{
			var n:number = this.keyframes.length;
			for (var i:number = 0; i < n; ++i){
				var kf:Keyframe = this.keyframes[i];
				kf.timeFraction = kf.time / duration;
			}
		}
		
		/**
		 * 给定已过去时间部分的情况下，计算并返回一个内插值。
		 * 该函数决定该部分所处于的关键帧时间间隔，
		 * 然后在该时间间隔内插补该时间间隔的定界关键帧值之间的值。
		 * @param fraction 效果的总体持续时间部分（从 0.0 到 1.0 之间的值）。
		 * @return 内插值
		 */
		public getValue(fraction:number):any{
			if (!this.keyframes)
				return null;
			var n:number = this.keyframes.length;
			if (n == 2 && this.keyframes[1].timeFraction == 1){
				var easedF:number = (this.keyframes[1].easerFunction!=null) ? 
					this.keyframes[1].easerFunction(fraction) : 
					fraction;
				return this.interpolator.interpolate(easedF, this.keyframes[0].value,
					this.keyframes[1].value);
			}
			if (isNaN(this.keyframes[0].timeFraction))
				this.scaleKeyframes(this.keyframes[this.keyframes.length-1].time);
			var prevT:number = 0;
			var prevValue:any = this.keyframes[0].value;
			for (var i:number = 1; i < n; ++i){
				var kf:Keyframe = this.keyframes[i];
				if (fraction >= prevT && fraction < kf.timeFraction){
					var t:number = (fraction - prevT) / (kf.timeFraction - prevT);
					var easedT:number = (kf.easerFunction!=null) ? kf.easerFunction(t) : t;
					return this.interpolator.interpolate(easedT, prevValue, kf.value);
				}
				prevT = kf.timeFraction;
				prevValue = kf.value;
			}
			return this.keyframes[n-1].value;
		}
	}
}