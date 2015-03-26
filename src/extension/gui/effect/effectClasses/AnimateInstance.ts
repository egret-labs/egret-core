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
     * @class egret.gui.AnimateInstance
     * @classdesc
     * AnimateInstance 类用于实现 Animate 效果的实例类
     * @extends egret.gui.EffectInstance
     */
    export class AnimateInstance extends EffectInstance{
        /**
         * @method egret.gui.AnimateInstance#constructor
         */
        public constructor(target:any){
            super(target);
        }

        /**
         * animation实例
         */
        public animation:Animation;
        
        /**
         * 样式属性的字典
         */
        private isStyleMap:any = {};
        
        private _seekTime:number = 0;
        private reverseAnimation:boolean;
        private numUpdateListeners:number = 0;
        
        private oldWidth:number;
        private oldHeight:number;
        
        private disabledConstraintsMap:any;
        
        private _motionPaths:Array<MotionPath>;
        /**
         * MotionPath 对象集，它定义随着时间的推移 Animation 将设置动画的属性和值。
         * @member egret.gui.AnimateInstance#motionPaths
         */
        public get motionPaths():Array<MotionPath>{
            return this._motionPaths;
        }
        public set motionPaths(value:Array<MotionPath>){
            if (!this._motionPaths)
                this._motionPaths = value;
        }
        
        /**
         * 如果为 true，则对目标对象禁用任何布局约束。效果完成时，将还原这些属性。
         * @member egret.gui.AnimateInstance#disableLayout
         */
        public disableLayout:boolean;

        private _easer:IEaser;
        /**
         * 此效果的缓动行为
         * @member egret.gui.AnimateInstance#easer
         */
        public get easer():IEaser
        {
            return this._easer;
        }

        public set easer(value:IEaser)
        {
            this._easer = value;
        }
        
        private _interpolator:IInterpolator;
        /**
         * Animation 实例所用的插补器，用于计算属性的开始值和结束值之间的值。
         * @member egret.gui.AnimateInstance#interpolator
         */
        public get interpolator():IInterpolator{
            return this._interpolator;
        }

        public set interpolator(value:IInterpolator){
            this._interpolator = value;
            
        }
        
        private _repeatBehavior:string;
        /**
         * 设置重复动画的行为。
         * 重复动画已将 repeatCount 属性设置为 0 或某个大于 1 的值。
         * 此值应该为 RepeatBehavior.LOOP（意味着每次动画按相同的顺序重复）
         * 或 RepeatBehavior.REVERSE（意味着对于每个迭代，动画都倒转方向）。
         * @member egret.gui.AnimateInstance#repeatBehavior
         */
        public get repeatBehavior():string{
            return this._repeatBehavior;
        }

        public set repeatBehavior(value:string){
            this._repeatBehavior = value;
        }

        public  _setPlayReversed(value:boolean){
            super._setPlayReversed(value);
            if (value && this.animation)
                this.animation.reverse();
            this.reverseAnimation = value;
        }
        
        /**
         *  @inheritDoc
         */
        public get playheadTime():number {
            return this.animation ? this.animation.playheadTime : this._seekTime;
        }
        
        public set playheadTime(value:number){
            if (this.animation)
                this.animation.playheadTime = value;
            this._seekTime = value;
        } 
        
        /**
         * @inheritDoc
         */
        public pause():void{
            super.pause();
            
            if (this.animation)
                this.animation.pause();
        }

        /**
         * @inheritDoc
         */
        public stop():void{
            super.stop();
            
            if (this.animation)
                this.animation.stop();
        }   
        
        /**
         * @inheritDoc
         */
        public resume():void{
            super.resume();
            
            if (this.animation)
                this.animation.resume();
        }

        /**
         * @inheritDoc
         */
        public reverse():void{
            super.reverse();
            
            if (this.animation)
                this.animation.reverse();
            
            this.reverseAnimation = !this.reverseAnimation;
        }

        /**
         * @inheritDoc
         */
        public end():void{
            if (this.animation){
                this.animation.end();
                this.animation = null;
            }
            super.end();
        }
        
        /**
         * @inheritDoc
         */
        public startEffect():void{
            //TODO?
            this.play();
        }
        
        /**
         * @inheritDoc
         */
        public play():void{
            super.play();
            
            if (!this.motionPaths || this.motionPaths.length == 0){
                var timer:egret.Timer = new egret.Timer(this.duration, 1);
                timer.addEventListener(egret.TimerEvent.TIMER, this.noopAnimationHandler, this);
                timer.start();
                return;
            }
            
            this.isStyleMap = new Array<any>(this.motionPaths.length);        
            
            var addWidthMP:boolean;
            var addHeightMP:boolean;
            var i:number = 0;
            var j:number = 0;
            for (i = 0; i < this.motionPaths.length; ++i){
                var mp:MotionPath = <MotionPath><any> (this.motionPaths[i]);
                var keyframes:Array<Keyframe> = mp.keyframes;
                if (!keyframes)
                    continue;
                
                if (this.interpolator)
                    mp.interpolator = this.interpolator;
                if (this.duration > 0)
                    for (j = 0; j < keyframes.length; ++j)
                        if (!isNaN(keyframes[j].time))
                            this.duration = Math.max(this.duration, keyframes[j].time);
            }
            
            if (addWidthMP)
                this.motionPaths.push(new SimpleMotionPath("width"));
            if (addHeightMP)
                this.motionPaths.push(new SimpleMotionPath("height"));
            
            this.animation = new Animation(this.animationUpdate,this);
            this.animation.duration = this.duration;
            this.animation.startFunction = this.animationStart;
            this.animation.endFunction = this.animationEnd;
            this.animation.stopFunction = this.animationStop;
            this.animation.repeatFunction = this.animationRepeat;
            this.animation.motionPaths = this.motionPaths;
            
            if (this.reverseAnimation)
                this.animation.playReversed = true;
            this.animation.interpolator = this.interpolator;
            this.animation.repeatCount = this.repeatCount;
            this.animation.repeatDelay = this.repeatDelay;
            this.animation.repeatBehavior = this.repeatBehavior;
            this.animation.easer = this.easer;
            this.animation.startDelay = this.startDelay;
            
            this.animation.play();
            if (this._seekTime > 0)
                this.animation.playheadTime = this._seekTime;
        }
        
        /**
         * 应用动画对应的属性值
         * @method egret.gui.AnimateInstance#applyValues
         */
        public applyValues(anim:Animation):void{
            for (var i:number = 0; i < this.motionPaths.length; ++i){
                var prop:string = this.motionPaths[i].property;
                this.setValue(prop, anim.currentValue[prop]);
            }
        }

        public _isValidValue(value:any):boolean{
            return (typeof(value) == "number" && !isNaN(value)) ||
                (!(typeof(value) == "number") && value !== null);
        }
        
        /**
         * 遍历motionPaths，用计算的值替换null。
         */
        private finalizeValues():void{
            var j:number = 0;
            var prevValue:any;
            for (var i:number = 0; i < this.motionPaths.length; ++i){
                var motionPath:MotionPath = <MotionPath><any> (this.motionPaths[i]);
                var keyframes:Array<Keyframe> = motionPath.keyframes;
                if (!keyframes || keyframes.length == 0)
                    continue;
                if (!this._isValidValue(keyframes[0].value)){
                    if (keyframes.length > 0 &&
                        this._isValidValue(keyframes[1].valueBy) &&
                        this._isValidValue(keyframes[1].value)){
                        keyframes[0].value = motionPath.interpolator.decrement(
                            keyframes[1].value, keyframes[1].valueBy);
                    }
                    else{
                        keyframes[0].value = this.getCurrentValue(motionPath.property);
                    }
                }
                
                prevValue = keyframes[0].value;
                for (j = 1; j < keyframes.length; ++j){
                    var kf:Keyframe = <Keyframe><any> (keyframes[j]);
                    if (!this._isValidValue(kf.value)){
                        if (this._isValidValue(kf.valueBy))
                            kf.value = motionPath.interpolator.increment(prevValue, kf.valueBy);
                        else{
                            if (j <= (keyframes.length - 2) &&
                                this._isValidValue(keyframes[j+1].value) &&
                                this._isValidValue(keyframes[j+1].valueBy)){
                                kf.value = motionPath.interpolator.decrement(
                                    keyframes[j+1].value, keyframes[j+1].valueBy);
                            }
                            else{
                                kf.value = prevValue;
                            }
                        }
                    }
                    prevValue = kf.value;
                }
            }
        }
        
        public animationStart(animation:Animation):void{
            if (this.disableLayout){
                this.cacheConstraints();
            }
            else if (this.disabledConstraintsMap){
                for (var constraint in this.disabledConstraintsMap)
                    this.cacheConstraint(constraint);
                this.disabledConstraintsMap = null;
            }
            this.finalizeValues();
        }
        
        public animationUpdate(animation:Animation):void{
            this.applyValues(animation);
            if (this.numUpdateListeners > 0){
                var event:EffectEvent = new EffectEvent(EffectEvent.EFFECT_UPDATE);
                event.effectInstance = this;
                this.dispatchEvent(event);
            }
        }
        
        public animationRepeat(animation:Animation):void{
            var event:EffectEvent = new EffectEvent(EffectEvent.EFFECT_REPEAT);
            event.effectInstance = this;
            this.dispatchEvent(event);
        }    
        
        private animationCleanup():void{
            if (this.disableLayout){
                this.reenableConstraints();
            }
        }
        
        public animationEnd(animation:Animation):void{
            this.animationCleanup();
            this.finishEffect();
        }
        
        public animationStop(animation:Animation):void{
            this.animationCleanup();
        }
        
        private noopAnimationHandler(event:egret.TimerEvent):void{
            this.finishEffect();
        }

        public addEventListener(type:string, listener:Function, thisObject:any, useCapture:boolean = false, priority:number = 0):void {
            super.addEventListener(type, listener, thisObject, useCapture, priority);
            if (type == EffectEvent.EFFECT_UPDATE)
                ++this.numUpdateListeners;
        }

        public removeEventListener(type:string, listener:Function, useCapture:boolean=false):void{
            super.removeEventListener(type, listener,this, useCapture);
            if (type == EffectEvent.EFFECT_UPDATE)
                --this.numUpdateListeners;
        }

        private constraintsHolder:any;

        /**
         * 恢复布局属性
         */
        private reenableConstraint(name:string):any{
            var value:any = this.constraintsHolder[name];
            if (value !== undefined){
                if (name in this.target)
                    this.target[name] = value;
                else
                    this.target.setStyle(name, value);
                delete this.constraintsHolder[name];
            }
            return value;
        }

        /**
         * 恢复所有布局属性
         */
        private reenableConstraints():void{
            if (this.constraintsHolder){
                var left:any = this.reenableConstraint("left");
                var right:any = this.reenableConstraint("right");
                var top:any = this.reenableConstraint("top");
                var bottom:any = this.reenableConstraint("bottom");
                this.reenableConstraint("horizontalCenter");
                this.reenableConstraint("verticalCenter");
                this.constraintsHolder = null;
                if (left != undefined && right != undefined && "explicitWidth" in this.target)
                    this.target.width = this.oldWidth;            
                if (top != undefined && bottom != undefined && "explicitHeight" in this.target)
                    this.target.height = this.oldHeight;
            }
        }

        /**
         * 缓存布局属性
         */
        private cacheConstraint(name:string):any{
            var isProperty:boolean = (name in this.target);
            var value:any;
            if (isProperty)
                value = this.target[name];
            else
                value = this.target.getStyle(name);
            if (!isNaN(value) && value != null){
                if (!this.constraintsHolder)
                    this.constraintsHolder = {};
                this.constraintsHolder[name] = value;
                if (isProperty)
                    this.target[name] = NaN;
                else if ("setStyle" in this.target)
                    this.target.setStyle(name, undefined);
            }
            return value;
        }

        /**
         * 缓存所有布局属性
         */
        private cacheConstraints():void{
            var left:any = this.cacheConstraint("left");
            var right:any = this.cacheConstraint("right");
            var top:any = this.cacheConstraint("top");
            var bottom:any = this.cacheConstraint("bottom");
            this.cacheConstraint("verticalCenter");
            this.cacheConstraint("horizontalCenter");
            if (left != undefined && right != undefined && "explicitWidth" in this.target){
                var w:number = this.target.width;    
                this.oldWidth = this.target.explicitWidth;
                this.target.width = w;
            }
            if (top != undefined && bottom != undefined && "explicitHeight" in this.target){
                var h:number = this.target.height;
                this.oldHeight = this.target.explicitHeight;
                this.target.height = h;
            }
        }
        
        public _setupStyleMapEntry(property:string):void{
            if (this.isStyleMap[property] == undefined){
                if (property in this.target){
                    this.isStyleMap[property] = false;
                }
                else{
                    try {
                        this.target.getStyle(property);
                        this.isStyleMap[property] = true;
                    }
                    catch (err){
                        throw new Error("propNotPropOrStyle"); 
                    }
                }            
            }
        }
        
        public setValue(property:string, value:any):void{
            this._setupStyleMapEntry(property);
            if (!this.isStyleMap[property])
                this.target[property] = value;
            else
                this.target.setStyle(property, value);
        }
        
        public getCurrentValue(property:string):any{
            this._setupStyleMapEntry(property);
            if (!this.isStyleMap[property])
                return this.target[property];
            else
                return this.target.getStyle(property);
        }
    }
}