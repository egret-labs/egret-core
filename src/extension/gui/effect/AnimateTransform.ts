/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret.gui {

    /**
     * @class egret.gui.AnimateTransform
     * @classdesc
     * AnimateTransform 效果控制目标对象上所有与转换相关的动画。
     * @extends egret.gui.Animate
     */
    export class AnimateTransform extends Animate{
        /**
         * @method egret.gui.AnimateTransform#constructor
         */
        public constructor(target:any=null){
            super(target);
            this.instanceClass = AnimateTransformInstance;
        }
        
        /**
         * 指定在转换效果开始播放时，该效果是否围绕目标的中心发生。
         * 如果未设置该标志，转换中心将由此效果中的 transformX, transformY属性决定。
         * @member egret.gui.AnimateTransform#autoCenterTransform
         */
        public autoCenterTransform:boolean = false;
        
        /**
         * 设置转换中心的 x 坐标（由 autoCenterTransform 属性覆盖时除外）。
         * @member egret.gui.AnimateTransform#transformX
         */
        public transformX:number;
        
        /**
         * 设置转换中心的 y 坐标（由 autoCenterTransform 属性覆盖时除外）。
         * @member egret.gui.AnimateTransform#transformY
         */
        public transformY:number;

        /**
         * 获取效果所属的复合效果
         */
        private getOwningParallelEffect():Parallel{
            var prevParent:Parallel = null;
            var parent:Effect = this._parentCompositeEffect;
            while (parent){
                if (parent instanceof Sequence)
                    break;
                prevParent = <Parallel><any> parent;
                parent = parent._parentCompositeEffect;
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
                this._initInstance(sharedInstance);
                return null;
            }
        }
        
        public _effectStartHandler(event:EffectEvent):void{
            super._effectStartHandler(event);
            var topmostParallel:Parallel = this.getOwningParallelEffect();
            if (topmostParallel != null)
                AnimateTransform.removeSharedInstance(topmostParallel, event.effectInstance.target);
        }
        
        /**
         * 计算目标的转换中心
         */
        private computeTransformCenterForTarget(target:any, valueMap:any = null):egret.Point{
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

        /**
         * 插入关键帧
         */
        private insertKeyframe(keyframes:Array<Keyframe>, newKF:Keyframe):void{
            for (var i:number = 0; i < keyframes.length; i++){
                if (keyframes[i].time > newKF.time){
                    keyframes.splice(i, 0, newKF);
                    return;
                }
            }
            keyframes.push(newKF);
        }

        /**
         * 添加一个运动路径
         * @param property
         * @param valueFrom
         * @param valueTo
         * @param valueBy
         * @private
         */
        public _addMotionPath(property:string,
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

        public _initInstance(instance:IEffectInstance):void{
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
            super._initInstance(instance);
            this.startDelay = tmpStartDelay;
            this.motionPaths = tmpAnimProps;
            transformInstance.duration = Math.max(this.duration, adjustedDuration);
            if(getQualifiedClassName(this) != getQualifiedClassName(AnimateTransform))
                transformInstance.easer = AnimateTransform.linearEaser;
        }

        /**子效果默认的缓动函数*/
        private static linearEaser:Linear = new Linear();
        
        private getGlobalStartTime():number{
            var globalStartTime:number = 0;
            var parent:Effect = this._parentCompositeEffect;
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
                parent = parent._parentCompositeEffect;
            }        
            return globalStartTime;
        }

        //储存作用于同一个目标的转换效果共享的实例，
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