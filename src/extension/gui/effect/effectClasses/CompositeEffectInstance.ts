//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////


module egret.gui {
    /**
     * @class egret.gui.CompositeEffectInstance
     * @classdesc
     * CompositeEffectInstance 类用于实现 CompositeEffect 类的实例类
     * @extends egret.gui.EffectInstance
     */
    export class CompositeEffectInstance extends EffectInstance{
        /**
         * @method egret.gui.CompositeEffectInstance#constructor
         */
        public constructor(target:any){
            super(target);
        }
        
        /**
         * 正在播放或者等待播放的EffectInstances
         */
        public _activeEffectQueue:Array<any> = [];
        
        /**
         * @inheritDoc
         */
        public get _actualDuration():number{
            var value:number = NaN;
            if (this.repeatCount > 0){
                value = this._durationWithoutRepeat * this.repeatCount +
                    (this.repeatDelay * (this.repeatCount - 1)) + this.startDelay;
            }
            return value;
        }   
        
        private _playheadTime:number = 0;
        /**
         * @inheritDoc
         */
        public get playheadTime():number{
            return this._playheadTime;
        }
        
        public _setPlayheadTime(value:number){
            if (this._timerAnimation)
                this._timerAnimation.playheadTime = value;
            else
                this._playheadTime = value;
            super._setPlayheadTime(value);
        }

        public _childSets:Array<any> = [];

        /**
         * 不含重复次数的持续时间
         */
        public get _durationWithoutRepeat():number{
            return 0;
        }
        
        public _endEffectCalled:boolean;
        public _timerAnimation:Animation;
        
        /**
         * @inheritDoc
         */
        public play():void{
            this._timerAnimation = new Animation(this.animationUpdate,this);
            this._timerAnimation.duration = this._durationWithoutRepeat;
            this._timerAnimation.motionPaths = [new SimpleMotionPath("timer",0,0)];
            this._timerAnimation.endFunction = this.animationEnd;
            this._timerAnimation.play();
            super.play();
        }
        
        /**
         * @inheritDoc
         */
        public pause():void{   
            super.pause();
            
            if (this._timerAnimation)
                this._timerAnimation.pause();
        }
        
        /**
         * @inheritDoc
         */
        public stop():void{   
            super.stop();
            
            if (this._timerAnimation)
                this._timerAnimation.stop();
        }
        
        /**
         * @inheritDoc
         */
        public end():void{   
            super.end();
            if (this._timerAnimation)
                this._timerAnimation.end();
        }
        
        /**
         * @inheritDoc
         */
        public resume():void{
            super.resume();
            
            if (this._timerAnimation)
                this._timerAnimation.resume();
        }
        
        /**
         * @inheritDoc
         */
        public reverse():void{
            super.reverse();
            this._setPlayReversed(!this.playReversed);
            if (this._timerAnimation)
                this._timerAnimation.reverse();
        }
        
        /**
         * @inheritDoc
         */
        public finishEffect():void{
            this._activeEffectQueue = null;
            super.finishEffect();
        }
        
        /**
         * 向此 Composite 效果添加一组新的子效果。
         * Sequence 效果将按子效果组的添加顺序一次播放一个子效果组。
         * Parallel 效果将同时播放所有子效果组，而不考虑这些子效果组的添加顺序。
         */
        public addChildSet(childSet:Array<any>):void{
            if (childSet){
                var n:number = childSet.length;
                if (n > 0){
                    if (!this._childSets)
                        this._childSets = [ childSet ];
                    else
                        this._childSets.push(childSet);
                    
                    for (var i:number = 0; i < n; i++){
                        childSet[i].addEventListener(EffectEvent.EFFECT_END,
                            this._effectEndHandler,
                            this);
                        childSet[i].parentCompositeEffectInstance = this;
                    }
                }
            }
        }
        
        /**
         * @inheritDoc
         */
        public _playWithNoDuration():void{
            super._playWithNoDuration();
            this.end();
        }
        
        public animationUpdate(animation:Animation):void{
            this._playheadTime = this._timerAnimation ?
                this._timerAnimation.playheadTime :
                this._playheadTime;
        }
        
        public animationEnd(animation:Animation):void{
            this._playheadTime = this._timerAnimation ?
                this._timerAnimation.playheadTime :
                this._playheadTime;
        }
        
        /**
         * 在每个子效果完成播放时调用。子类必须实现此函数。
         */
        public _onEffectEnd(childEffect:IEffectInstance):void{
            
        }
        
        public _effectEndHandler(event:EffectEvent):void{
            this._onEffectEnd(event.effectInstance);
        }
    }
}