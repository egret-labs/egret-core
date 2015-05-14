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
     * @class egret.gui.Effect
     * @classdesc
     * 定义所有效果的基类
     * @extends egret.EventDispatcher
     */
    export class Effect extends EventDispatcher implements IEffect{
        /**
         * @method egret.gui.Effect#constructor
         */
        public constructor(target:any = null){
            super();
            this.target = target;
        }
        
        private _instances:Array<any> = [];
        
        private _isPaused:boolean = false;
        
        /**
         * 是否在逆转播放
         * @member egret.gui.Effect#playReversed
         */
        public playReversed:boolean;
        
        private effectStopped:boolean;
        
        /**
         * 效果所属的复杂效果
         */
        public _parentCompositeEffect:Effect;

        private _duration:number = 500;
        public durationExplicitlySet:boolean = false;
        /**
         * 效果的持续时间（以毫秒为单位）。
         * @member egret.gui.Effect#duration
         */
        public get duration():number{
            if (!this.durationExplicitlySet &&
                this._parentCompositeEffect){
                return this._parentCompositeEffect.duration;
            }
            else{
                return this._duration;
            }
        }
        
        public set duration(value:number){
            this.durationExplicitlySet = true;
            this._duration = value;
        }

        /**
         * 一个 Class 类型的对象，用于指定此效果类的效果实例类。
         * <p>Effect 类的所有子类都必须在其构造函数中设置此属性。</p>
         * @member egret.gui.Effect#instanceClass
         */
        public instanceClass:any;
        
        /**
         * 如果当前正在播放效果的任一实例，则为 true；否则，则为 false。
         * @member egret.gui.Effect#isPlaying
         */
        public get isPlaying():boolean{
            return this._instances && this._instances.length > 0;
        }

        /**
         * 是否处于暂停状态，当调用了paused()方法后此属性为true
         * @member egret.gui.Effect#isPaused
         */
        public get isPaused():Boolean
        {
            if(this.isPlaying)
                return this._isPaused;
            else
                return false;
        }
        
        private _perElementOffset:number = 0;
        /**
         * 在效果的第一个目标之后，其他效果目标的附加延迟（以毫秒为单位）。
         * 此值将添加到 startDelay 属性的值中。
         * @member egret.gui.Effect#perElementOffset
         */
        public get perElementOffset():number{
            return this._perElementOffset;
        }

        public set perElementOffset(value:number){
            this._perElementOffset = value;
        }
        
        /**
         * 效果的重复次数。可能的值为任何大于等于 0 的整数。
         * 值为 1 表示播放一次效果。值为 0 表示无限制地循环播放效果，直到通过调用 end() 方法停止播放。
         * @member egret.gui.Effect#repeatCount
         */
        public repeatCount:number = 1;
        
        /**
         * 重复播放效果前需要等待的时间（以毫秒为单位）。可能的值为任何大于等于 0 的整数。
         * @member egret.gui.Effect#repeatDelay
         */
        public repeatDelay:number = 0;

        /**
         * 开始播放效果前需要等待的时间（以毫秒为单位）。
         * 此值可以是任何大于或等于 0 的整数。
         * 如果使用 repeatCount 属性重复播放效果，则只在首次播放效果时应用 startDelay。
         * @member egret.gui.Effect#startDelay
         */
        public startDelay:number = 0;
        
        /**
         * 要应用此效果的对象。当效果触发器触发某个效果时，会自动将 target 属性设置为触发该效果的对象。
         * @member egret.gui.Effect#target
         */
        public get target():any{
            if (this._targets.length > 0)
                return this._targets[0]; 
            else
                return null;
        }
        
        public set target(value:any){
            this._targets.splice(0);
            
            if (value)
                this._targets[0] = value;
        }
        
        private _targets:Array<any> = [];
        /**
         * 一个对象 Array，这些对象都是效果的目标。播放效果时，会对各个目标并行执行效果。
         * 设置 target 属性将替换此 Array 中的所有对象。
         * 设置 targets 属性后，target 属性将返回此 Array 中的第一个项目。
         * @member egret.gui.Effect#targets
         */
        public get targets():Array<any>{
            return this._targets;
        }

        public set targets(value:Array<any>){
            var n:number = value.length;
            for (var i:number = n - 1; i >= 0; i--){
                if (value[i] == null)
                    value.splice(i,1);
            }
            this._targets = value;
        }
        
        private _playheadTime:number = 0;
        /**
         * 效果的当前时间位置。此属性的值介于 0 和总持续时间（包括该效果的 startDelay、repeatCount 和 repeatDelay）之间。
         * @member egret.gui.Effect#playheadTime
         */
        public get playheadTime():number {
            for (var i:number = 0; i < this._instances.length; i++){
                if (this._instances[i])
                    return (<IEffectInstance><any> (this._instances[i])).playheadTime;
            }
            return this._playheadTime;
        }

        public set playheadTime(value:number){
            var started:boolean = false;
            if (this._instances.length == 0){
                this.play();
                started = true;
            }
            for (var i:number = 0; i < this._instances.length; i++){
                if (this._instances[i])
                    (<IEffectInstance><any> (this._instances[i])).playheadTime = value;
            }
            if (started)
                this.pause();
            this._playheadTime = value;
        }

        /**
         * 获取一个目标对象 Array，并对每个目标调用 createInstance() 方法。
         * @method egret.gui.Effect#createInstances
         * @param targets 要使用此效果设置动画的对象的数组。
         * @return 效果的效果实例对象的数组，一个目标一个数组。
         */
        public createInstances(targets:Array<any> = null):Array<any>{
            if (!targets)
                targets = this.targets;
            
            var newInstances:Array<any> = [];
            var offsetDelay:number = 0;
            
            var length:number = targets.length;
            for(var i:number = 0;i < length;i++){
                var target:any = targets[i];
                var newInstance:IEffectInstance = this.createInstance(target);
                if (newInstance){
                    newInstance.startDelay += offsetDelay;
                    offsetDelay += this.perElementOffset;
                    newInstances.push(newInstance);
                }
            }
            
            return newInstances; 
        }

        /**
         * 创建一个效果实例并对其进行初始化。在播放效果实例前，使用此方法（而非 play() 方法）处理效果实例属性。
         *  <p>所创建的效果实例的类型由 instanceClass 属性指定。然后，使用 _initInstance() 方法初始化此实例。
         * 如果该实例是 EffectManager 在效果触发器触发此效果时创建的，
         * 则还需要调用 EffectInstance.initEffect() 方法进一步初始化此效果。</p>
         *  <p>调用 createInstance() 方法不会播放效果。对返回的效果实例调用 startEffect() 方法。</p>
         *  <p>Effect.play() 方法将自动调用此函数。 </p>
         * @method egret.gui.Effect#createInstance
         * @param target 要使用此效果为其设置动画的对象。
         * @return 效果的效果实例对象。
         */
        public createInstance(target:any = null):IEffectInstance{       
            if (!target)
                target = this.target;
            
            var newInstance:IEffectInstance = <IEffectInstance><any> (new this.instanceClass(target));
            this._initInstance(newInstance);
            
            (<egret.EventDispatcher><any> newInstance).addEventListener(EffectEvent.EFFECT_START, this._effectStartHandler, this);
            (<egret.EventDispatcher><any> newInstance).addEventListener(EffectEvent.EFFECT_STOP, this._effectStopHandler, this);
            (<egret.EventDispatcher><any> newInstance).addEventListener(EffectEvent.EFFECT_END, this._effectEndHandler, this);
            
            this._instances.push(newInstance);
            
            return newInstance;
        }
        
        /**
         *  将效果的属性复制到效果实例。 
         *  <p>创建自定义效果时覆盖此方法，将属性从 Effect 类复制到效果实例类。
         * 进行覆盖时，请调用 super.initInstance()。 </p>
         * @param EffectInstance 要初始化的效果实例。
         */
        public _initInstance(instance:IEffectInstance):void{
            instance.duration = this.duration;
            (<any> instance).durationExplicitlySet = this.durationExplicitlySet;
            instance.effect = this;
            instance.repeatCount = this.repeatCount;
            instance.repeatDelay = this.repeatDelay;
            instance.startDelay = this.startDelay;
        }

        /**
         * 删除实例中的事件侦听器，然后从实例列表中删除该实例。
         * @method egret.gui.Effect#deleteInstance
         */
        public deleteInstance(instance:IEffectInstance):void{
            (<egret.EventDispatcher><any> instance).removeEventListener(
                EffectEvent.EFFECT_START, this._effectStartHandler, this);
            (<egret.EventDispatcher><any> instance).removeEventListener(
                EffectEvent.EFFECT_STOP, this._effectStopHandler, this);
            (<egret.EventDispatcher><any> instance).removeEventListener(
                EffectEvent.EFFECT_END, this._effectEndHandler, this);
            
            var n:number = this._instances.length;
            for (var i:number = 0; i < n; i++){
                if (this._instances[i] === instance)
                    this._instances.splice(i, 1);
            }
        }

        /**
         * 开始播放效果。通常在调用 play() 方法之前先调用 end() 方法，以确保在开始播放新效果前已结束先前效果的所有实例。
         * @method egret.gui.Effect#play
         * @param targets 播放此效果的目标对象的数组。如果已指定此参数，则不会使用效果的 targets 属性。
         * @param playReversedFromEnd 如果为 true，则向后播放效果。
         * @return 效果的 EffectInstance 对象的数组，一个目标一个数组。
         */
        public play(targets:Array<any> = null,playReversedFromEnd:boolean = false):Array<any>{
            this.effectStopped = false;
            this._isPaused = false;
            this.playReversed = playReversedFromEnd;
            
            var newInstances:Array<any> = this.createInstances(targets);
            
            var n:number = newInstances.length;
            for (var i:number = 0; i < n; i++) {
                var newInstance:IEffectInstance = <IEffectInstance><any> (newInstances[i]);
                (<any> newInstance).playReversed = playReversedFromEnd;
                newInstance.startEffect();
            }
            return newInstances; 
        }

        /**
         * 暂停效果，直到调用 resume() 方法。
         * @method egret.gui.Effect#pause
         */
        public pause():void{
            if (this.isPlaying && !this._isPaused){
                this._isPaused = true;
                var n:number = this._instances.length;
                for (var i:number = 0; i < n; i++){
                    (<IEffectInstance><any> (this._instances[i])).pause();
                }
            }
        }

        /**
         * 停止播放效果，使效果目标保持当前状态。
         * 与调用 pause() 方法不同，无法先调用 stop() 方法再调用 resume() 方法。
         * 不过，您可以调用 play() 方法重新播放效果。
         * @method egret.gui.Effect#stop
         */
        public stop():void{   
            var n:number = this._instances.length - 1;
            for (var i:number = n; i >= 0; i--){
                var instance:IEffectInstance = <IEffectInstance><any> (this._instances[i]);
                if (instance)
                    instance.stop();
            }
        }

        /**
         * 在效果由 pause() 方法暂停后继续播放效果。
         * @method egret.gui.Effect#resume
         */
        public resume():void{
            if (this.isPlaying && this._isPaused){
                this._isPaused = false;
                var n:number = this._instances.length;
                for (var i:number = 0; i < n; i++){
                    (<IEffectInstance><any> (this._instances[i])).resume();
                }
            }
        }

        /**
         * 逆序播放效果；如果当前正在播放效果，则从该效果的当前位置开始逆序播放。
         * @method egret.gui.Effect#reverse
         */
        public reverse():void{
            if (this.isPlaying){
                var n:number = this._instances.length;
                for (var i:number = 0; i < n; i++){
                    (<IEffectInstance><any> (this._instances[i])).reverse();
                }
            }
        }

        /**
         * 中断当前正在播放的效果，立即跳转到该效果的末尾。调用此方法将调用 EffectInstance.end() 方法。
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         * <p>如果将效果实例作为参数传递，则会中断此实例。
         * 如果没有传入参数，则该效果当前生成的所有效果实例都将中断。</p>
         * @method egret.gui.Effect#end
         */
        public end(effectInstance:IEffectInstance = null):void{
            if (effectInstance){
                effectInstance.end();
            }
            else{
                var n:number = this._instances.length;
                for (var i:number = n - 1; i >= 0; i--){
                    var instance:IEffectInstance = <IEffectInstance><any> (this._instances[i]);
                    if (instance)
                        instance.end();
                }
            }
        }
        
        /**
         * 当效果实例开始播放时调用此方法。
         */
        public _effectStartHandler(event:EffectEvent):void {
            this.dispatchEvent(event);
        }
        
        /**
         * 当效果实例已被 stop() 方法调用停止时调用。
         */
        public _effectStopHandler(event:EffectEvent):void{
            this.dispatchEvent(event);
            this.effectStopped = true;
        }
        
        /**
         * 当效果实例完成播放时调用。
         */
        public _effectEndHandler(event:EffectEvent):void {
            var instance:IEffectInstance = <IEffectInstance><any> (event.effectInstance);
            this.deleteInstance(instance);
            this.dispatchEvent(event);
        }
    }
}