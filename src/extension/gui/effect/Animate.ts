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
     * @class egret.gui.Animate
     * @classdesc
     * Animate 效果可设置各个值之间的任意属性集的动画。通过设置 motionPaths 属性，指定要设置动画的属性和值。
     * @extends egret.gui.Effect
     */
    export class Animate extends Effect{
        /**
         * @method egret.gui.Animate#constructor
         */
        public constructor(target:any = null){
            super(target);
            this.instanceClass = AnimateInstance;
        }
        
        private numUpdateListeners:number = 0;

        private _motionPaths:Array<MotionPath>;
        /**
         * MotionPath 对象的 Array，其中的每个对象都带有正在设置动画的属性的名称以及该属性在动画过程中所采用的值。
         * 此 Array 优先于 Animate 的子类中所声明的任何属性。
         * 例如，如果此 Array 是直接在 Move 效果上设置的，则会忽略 Move 效果的任何属性（如 xFrom）。
         * @member egret.gui.Animate#motionPaths
         */
        public get motionPaths():Array<MotionPath>{
            return this._motionPaths;
        }

        public set motionPaths(value:Array<MotionPath>){
            this._motionPaths = value;
        }

        private _easer:IEaser;
        /**
         * 此效果的缓动行为，默认为Sine(.5)
         * @member egret.gui.Animate#easer
         */
        public get easer():IEaser
        {
            return this._easer;
        }

        public set easer(value:IEaser)
        {
            this._easer = value;
        }

        
        private _interpolator:IInterpolator = null;
        /**
         * 此效果计算属性的起始值和结束值之间的值所用的插补器。
         * 默认情况下，NumberInterpolator 类处理内插值.
         * @member egret.gui.Animate#interpolator
         */
        public get interpolator():IInterpolator{
            return this._interpolator;
        }
        
        public set interpolator(value:IInterpolator){
            this._interpolator = value;
        }
        
        private _repeatBehavior:string = RepeatBehavior.LOOP;
        /**
         * 一种重复效果的行为。RepeatBehavior类中定义的常量。默认为RepeatBehavior.LOOP
         * @member egret.gui.Animate#repeatBehavior
         */
        public get repeatBehavior():string{
            return this._repeatBehavior;
        }
        
        public set repeatBehavior(value:string){
            this._repeatBehavior = value;
        }
        
        private _disableLayout:boolean = false;
        /**
         * 如果为 true，则对目标对象禁用任何布局约束。效果完成时，将还原这些属性。
         * @member egret.gui.Animate#disableLayout
         */
        public get disableLayout():boolean{
            return this._disableLayout;
        }
        
        public set disableLayout(value:boolean){
            this._disableLayout = value;
        }

        /**
         * @method egret.gui.Animate#_initInstance
         */
        public _initInstance(instance:IEffectInstance):void{
            super._initInstance(instance);
            
            var animateInstance:AnimateInstance = <AnimateInstance><any> instance;
            
            animateInstance.addEventListener(EffectEvent.EFFECT_REPEAT, this.animationEventHandler, this);
            if (this.numUpdateListeners > 0)
                animateInstance.addEventListener(EffectEvent.EFFECT_UPDATE, this.animationEventHandler, this);
            
                animateInstance.easer = this.easer;
            
            if (this.interpolator)
                animateInstance.interpolator = this.interpolator;
            
            if (isNaN(this.repeatCount))
                animateInstance.repeatCount = this.repeatCount;
            
            animateInstance.repeatBehavior = this.repeatBehavior;
            animateInstance.disableLayout = this.disableLayout;
            
            if (this.motionPaths){
                animateInstance.motionPaths = new Array<MotionPath>();
                for (var i:number = 0; i < this.motionPaths.length; ++i)
                    animateInstance.motionPaths[i] = this.motionPaths[i].clone();
            }
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
        
        /**
         * 派发动画事件
         */
        private animationEventHandler(event:EffectEvent):void{
            this.dispatchEvent(event);
        }
    }
}