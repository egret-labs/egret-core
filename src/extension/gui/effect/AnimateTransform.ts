
module egret.gui {

	export class AnimateTransform extends Animate{
		public constructor(target:any=null){
			super(target);
			this.instanceClass = AnimateTransformInstance;
		}
		
		/**
		 * 指定在转换效果开始播放时，该效果是否围绕目标的中心 (width/2, height/2) 发生。
		 * 如果未设置该标志，转换中心将由对象的转换中心 (transformX, transformY, transformZ) 和此效果中的 transformX, transformY, transformZ 属性决定。
		 * 也就是说，转换中心就是目标对象的转换中心，其中的任何 transformX、transformY、transformZ 属性（如果已设置）都将由效果中的这些值覆盖。
		 */
		public autoCenterTransform:boolean = false;
		
		/**
		 * 设置转换中心的 x 坐标（由 autoCenterTransform 属性覆盖时除外）。 
		 */
		public transformX:number;
		
		/**
		 * 设置转换中心的 y 坐标（由 autoCenterTransform 属性覆盖时除外）。 
		 */
		public transformY:number;
		
		private getOwningParallelEffect():Parallel{
			var prevParent:Parallel = null;
			var parent:Effect = this.parentCompositeEffect;
			while (parent){
				if (parent instanceof Sequence)
					break;
				prevParent = <Parallel><any> parent;
				parent = parent.parentCompositeEffect;
			}
			return prevParent;
		}
		
		public createInstance(target:any = null):IEffectInstance{       
			if (!target)
				target = this.target;
			
			var sharedInstance:IEffectInstance = null;
			var topmostParallel:Parallel = this.getOwningParallelEffect();
			if (topmostParallel != null)
				sharedInstance = <IEffectInstance><any> (AnimateTransform.getSharedInstance(topmostParallel, target));
			if (!sharedInstance){
				var newInstance:IEffectInstance = super.createInstance(target);
				if (topmostParallel)
					AnimateTransform.storeSharedInstance(topmostParallel, target, newInstance);
				return newInstance;
			}
			else{
				this.initInstance(sharedInstance);
				return null;
			}
		}
		
		public effectStartHandler(event:EffectEvent):void{
			super.effectStartHandler(event);
			var topmostParallel:Parallel = this.getOwningParallelEffect();
			if (topmostParallel != null)
				AnimateTransform.removeSharedInstance(topmostParallel, event.effectInstance.target);
		}
		
		/**
		 * 获取转换中心
		 */
		private computeTransformCenterForTarget(target:any, valueMap:any = null):egret.Point    {
			var computedTransformCenter:egret.Point;
			if (this.autoCenterTransform){
				var w:number = (valueMap != null && valueMap["width"] !== undefined) ?
					valueMap["width"] :
					target.width;
				var h:number = (valueMap != null && valueMap["height"] !== undefined) ?
					valueMap["height"] :
					target.height;
				computedTransformCenter = new egret.Point(w/2, h/2);
			}
			else{
				computedTransformCenter = new egret.Point(0,0);
				if (!isNaN(this.transformX))
					computedTransformCenter.x = this.transformX; 
				if (!isNaN(this.transformY))
					computedTransformCenter.y = this.transformY; 
			}
			return computedTransformCenter;
		}
		
		private insertKeyframe(keyframes:Array<Keyframe>, newKF:Keyframe):void{
			for (var i:number = 0; i < keyframes.length; i++){
				if (keyframes[i].time > newKF.time){
					keyframes.splice(i, 0, newKF);
					return;
				}
			}
			keyframes.push(newKF);
		}
		
		public addMotionPath(property:string,
										   valueFrom:number = NaN, valueTo:number = NaN, valueBy:number = NaN):void{
			if (isNaN(valueFrom)){
				if (!isNaN(valueTo) && !isNaN(valueBy))
					valueFrom = valueTo - valueBy;
			}
			var mp:MotionPath = new MotionPath(property);
			mp.keyframes = [new Keyframe(0, valueFrom), new Keyframe(this.duration, valueTo, valueBy)];
			mp.keyframes[1].easer = this.easer;
			
			if (this.motionPaths){
				var n:number = this.motionPaths.length;
				for (var i:number = 0; i < n; i++){
					var prop:MotionPath = <MotionPath><any> (this.motionPaths[i]);
					if (prop.property == mp.property){
						for (var j:number = 0; j < mp.keyframes.length; j++){
							this.insertKeyframe(prop.keyframes, mp.keyframes[j]);
						}
						return;
					}
				}
			}
			else{
				this.motionPaths = new Array<MotionPath>();
			}
			this.motionPaths.push(mp);
		}

        private isValidValue(value:any):boolean{
            return (typeof(value) == "number" && !isNaN(value)) ||
                (!(typeof(value) == "number") && value !== null);
        }
		
		public initInstance(instance:IEffectInstance):void{
			var i:number = 0;
			var adjustedDuration:number = this.duration;
			
			var transformInstance:AnimateTransformInstance =
				<AnimateTransformInstance><any> instance;

			if (this.motionPaths){            
				var instanceAnimProps:Array<any> = [];
				for (i = 0; i < this.motionPaths.length; ++i){
					instanceAnimProps[i] = this.motionPaths[i].clone();
					var mp:MotionPath = <MotionPath><any> (instanceAnimProps[i]);
					if (mp.keyframes){
						for (var j:number = 0; j < mp.keyframes.length; ++j){
							var kf:Keyframe = <Keyframe><any> (mp.keyframes[j]);
							if (isNaN(kf.time))
								kf.time = this.duration;
							if (this.startDelay != 0)
								kf.time += this.startDelay;
						}
						adjustedDuration = Math.max(adjustedDuration, 
							mp.keyframes[mp.keyframes.length - 1].time);
					}
				}
				var globalStartTime:number = this.getGlobalStartTime();
				for (i = 0; i < instanceAnimProps.length; ++i)
					transformInstance.addMotionPath(instanceAnimProps[i], globalStartTime);
			}

			if (transformInstance.initialized)
				return;
			transformInstance.initialized = true;
			
			if (!this.autoCenterTransform)
				transformInstance.transformCenter = 
					this.computeTransformCenterForTarget(instance.target);
			transformInstance.autoCenterTransform = this.autoCenterTransform;
			
			var tmpStartDelay:number = this.startDelay;
			this.startDelay = 0;
			var tmpAnimProps:Array<MotionPath> = this.motionPaths;
			this.motionPaths = null;
			super.initInstance(instance);
			this.startDelay = tmpStartDelay;
			this.motionPaths = tmpAnimProps;
			transformInstance.duration = Math.max(this.duration, adjustedDuration);
		}
		
		private getGlobalStartTime():number{
			var globalStartTime:number = 0;
			var parent:Effect = this.parentCompositeEffect;
			while (parent){
				globalStartTime += parent.startDelay;
				if (parent instanceof Sequence){
					var sequence:Sequence = <Sequence><any> parent;
					for (var i:number = 0; i < sequence.children.length; ++i)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            {
						var child:Effect = sequence.children[i];
						if (child == this)
							break;
						if (child instanceof CompositeEffect)
							globalStartTime += (<CompositeEffect><any> child).compositeDuration;
						else
							globalStartTime += child.startDelay + 
								(child.duration * child.repeatCount) +
								(child.repeatDelay + (child.repeatCount - 1));
					}
				}
				parent = parent.parentCompositeEffect;
			}        
			return globalStartTime;
		}
		
		private static sharedObjectMaps:any = {};
		private static sharedObjectRefcounts:any = {};
		/**
		 * 获取共享的实例
		 */
		private static getSharedInstance(topmostParallel:Parallel , target:any):IEffectInstance{
			if (topmostParallel != null){
				var sharedObjectMap:any = AnimateTransform.sharedObjectMaps[topmostParallel.hashCode];
				if (sharedObjectMap != null)
					return sharedObjectMap[target.hashCode];
			}
			return null;
		}
		
		private static removeSharedInstance(topmostParallel:Parallel , target:any):void{
			if (topmostParallel != null){
				var sharedObjectMap:any = AnimateTransform.sharedObjectMaps[topmostParallel.hashCode];
				if (!sharedObjectMap)
					return;
				if (sharedObjectMap[target.hashCode]){
					delete sharedObjectMap[target.hashCode];
					AnimateTransform.sharedObjectRefcounts[topmostParallel.hashCode] -= 1;
					if (AnimateTransform.sharedObjectRefcounts[topmostParallel.hashCode] <= 0){
						delete AnimateTransform.sharedObjectMaps[topmostParallel.hashCode];
						delete AnimateTransform.sharedObjectRefcounts[topmostParallel.hashCode];
					}
				}
			}
		}
		
		private static storeSharedInstance(topmostParallel:Parallel , target:any , effectInstance:IEffectInstance):void{
			if (topmostParallel != null){
				var sharedObjectMap:any = AnimateTransform.sharedObjectMaps[topmostParallel.hashCode];
				if (!sharedObjectMap){
					sharedObjectMap = {};
					AnimateTransform.sharedObjectMaps[topmostParallel.hashCode] = sharedObjectMap;
				}
				if (!sharedObjectMap[target.hashCode]){
					if (!AnimateTransform.sharedObjectRefcounts[topmostParallel.hashCode])
						AnimateTransform.sharedObjectRefcounts[topmostParallel.hashCode] = 1;
					else
						AnimateTransform.sharedObjectRefcounts[topmostParallel.hashCode] += 1;
				}                
				sharedObjectMap[target.hashCode] = effectInstance;
			}
		}
		
	}
}