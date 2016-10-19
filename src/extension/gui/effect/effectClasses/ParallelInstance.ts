//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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


namespace egret.gui {
    /**
     * @class egret.gui.ParallelInstance
     * @classdesc
     * ParallelInstance 类用于实现 Parallel 效果的实例类
     * @extends egret.gui.CompositeEffectInstance
     */
    export class ParallelInstance extends CompositeEffectInstance{
        /**
         * @method egret.gui.ParallelInstance#constructor
         */
        public constructor(target:any){
            super(target);
        }

        /**
         * 已经完成的效果实例
         */
        private doneEffectQueue:any[];
        
        /**
         * 等待播放的效果实例
         */
        private replayEffectQueue:any[];
        
        private isReversed:boolean = false;    
        private timer:egret.Timer;
        
        /**
         * @inheritDoc
         */
        public get _durationWithoutRepeat():number{
            let _duration:number = 0;
            
            let n:number = this._childSets.length;
            for (let i:number = 0; i < n; i++){
                let instances:any[] = this._childSets[i];
                _duration = Math.max(instances[0]._actualDuration, _duration);
            }
            return _duration;
        }
        
        /**
         * @inheritDoc
         */
        public _setPlayheadTime(value:number){
            this._setPlayheadTime(value);
            
            let compositeDur:number = (<Parallel><any> (this.effect)).compositeDuration;
            let firstCycleDur:number = compositeDur + this.startDelay + this.repeatDelay;
            let laterCycleDur:number = compositeDur + this.repeatDelay;
            let totalDur:number = firstCycleDur + laterCycleDur * (this.repeatCount - 1);
            let childPlayheadTime:number;
            if (value <= firstCycleDur) {
                childPlayheadTime = Math.min(value - this.startDelay, compositeDur);
                this._playCount = 1;
            }
            else{
                if (value >= totalDur && this.repeatCount != 0){
                    childPlayheadTime = compositeDur;
                    this._playCount = this.repeatCount;
                }
                else{
                    let valueAfterFirstCycle:number = value - firstCycleDur;
                    childPlayheadTime = valueAfterFirstCycle % laterCycleDur;
                    this._playCount = 1 + valueAfterFirstCycle / laterCycleDur;
                }
            }
            
            for (let i:number = 0; i < this._childSets.length; i++){
                let instances:any[] = this._childSets[i];
                let m:number = instances.length;
                for (let j:number = 0; j < m; j++)
                    instances[j].playheadTime = this.playReversed ?
                        Math.max(0, (childPlayheadTime - 
                            (this._durationWithoutRepeat - instances[j]._actualDuration))) :
                        childPlayheadTime;
            }

            if (this.playReversed && this.replayEffectQueue != null && this.replayEffectQueue.length > 0){
                let position:number = this._durationWithoutRepeat - this.playheadTime;
                let numDone:number = this.replayEffectQueue.length;
                for (let i = numDone - 1; i >= 0; i--){
                    let childEffect:EffectInstance = this.replayEffectQueue[i];
                    if (position <= childEffect._actualDuration){
                        if (this._activeEffectQueue == null)
                            this._activeEffectQueue = [];
                        this._activeEffectQueue.push(childEffect);
                        this.replayEffectQueue.splice(i,1);
                        
                        childEffect.playReversed = this.playReversed;
                        childEffect.startEffect();
                    }
                }
            }
            
        }
        
        /**
         * @inheritDoc
         */
        public play():void{
            this.doneEffectQueue = [];
            this._activeEffectQueue = [];
            this.replayEffectQueue = [];

            super.play();
            
            let n:number = 0;
            let i:number = 0;
            
            n = this._childSets.length;
            for (i = 0; i < n; i++){
                let instances:any[] = this._childSets[i];
                
                let m:number = instances.length;
                for (let j:number = 0; j < m && this._activeEffectQueue != null; j++){
                    let childEffect:EffectInstance = instances[j];

                    if (this.playReversed && childEffect._actualDuration < this._durationWithoutRepeat){
                        this.replayEffectQueue.push(childEffect);
                        this.startTimer();
                    }
                    else{
                        childEffect.playReversed = this.playReversed;
                        this._activeEffectQueue.push(childEffect);
                    }
                }        
            }
            
            if (this._activeEffectQueue.length > 0){
                let queueCopy:any[] = this._activeEffectQueue.slice(0);
                for (i = 0; i < queueCopy.length; i++){
                    queueCopy[i].startEffect();
                }
            }
        }
        
        /**
         * @inheritDoc
         */
        public pause():void{    
            super.pause();
            if (this._activeEffectQueue){
                let n:number = this._activeEffectQueue.length;
                for (let i:number = 0; i < n; i++){
                    this._activeEffectQueue[i].pause();
                }
            }
        }
        
        /**
         * @inheritDoc
         */
        public stop():void{
            this.stopTimer();
            
            if (this._activeEffectQueue){
                let queueCopy:any[] = this._activeEffectQueue.concat();
                this._activeEffectQueue = null;
                let n:number = queueCopy.length;
                for (let i:number = 0; i < n; i++){
                    if (queueCopy[i])
                        queueCopy[i].stop();
                }
            }
            super.stop();
        }
        
        /**
         * @inheritDoc
         */
        public resume():void{
            super.resume();
            if (this._activeEffectQueue){
                let n:number = this._activeEffectQueue.length;
                for (let i:number = 0; i < n; i++){
                    this._activeEffectQueue[i].resume();
                }
            }
        }
        
        /**
         * @inheritDoc
         */
        public reverse():void{
            super.reverse();
            
            let n:number = 0;
            let i:number = 0;
            
            if (this.isReversed){
                n = this._activeEffectQueue.length;
                for (i = 0; i < n; i++){
                    this._activeEffectQueue[i].reverse();
                } 
                
                this.stopTimer();
            }
            else{
                this.replayEffectQueue = this.doneEffectQueue.splice(0);
                n = this._activeEffectQueue.length;
                for (i = 0; i < n; i++){
                    this._activeEffectQueue[i].reverse();
                } 
                
                this.startTimer();
            }
            
            this.isReversed = !this.isReversed;
        }
        
        /**
         * @inheritDoc
         */
        public end():void{
            this._endEffectCalled = true;
            this.stopTimer();
            
            if (this._activeEffectQueue){
                let queueCopy:any[] = this._activeEffectQueue.concat();
                this._activeEffectQueue = null;
                let n:number = queueCopy.length;
                for (let i:number = 0; i < n; i++){
                    if (queueCopy[i])
                        queueCopy[i].end();
                }
            }
            
            super.end();
        }
        
        /**
         * @inheritDoc
         */
        public _onEffectEnd(childEffect:IEffectInstance):void{
            if (this._endEffectCalled || this._activeEffectQueue == null)
                return;
            
            let n:number = this._activeEffectQueue.length;
            for (let i:number = 0; i < n; i++){
                if (childEffect == this._activeEffectQueue[i]){
                    this.doneEffectQueue.push(childEffect);
                    this._activeEffectQueue.splice(i, 1);
                    break;
                }
            }    
            
            if (n == 1){
                this.finishRepeat();
            }
        }
        
        private startTimer():void{
            if (!this.timer){
                this.timer = new egret.Timer(10);
                this.timer.addEventListener(egret.TimerEvent.TIMER, this.timerHandler, this);
            }
            this.timer.start();
        }

        private stopTimer():void{
            if (this.timer)
                this.timer.reset();
        }

        private timerHandler(event:egret.TimerEvent):void{
            let position:number = this._durationWithoutRepeat - this.playheadTime;
            let numDone:number = this.replayEffectQueue.length;
            
            if (numDone == 0){
                this.stopTimer();
                return;
            }
            
            for (let i:number = numDone - 1; i >= 0; i--){
                let childEffect:EffectInstance = this.replayEffectQueue[i];
                
                if (position <= childEffect._actualDuration){
                    if (this._activeEffectQueue == null)
                        this._activeEffectQueue = [];
                    this._activeEffectQueue.push(childEffect);
                    this.replayEffectQueue.splice(i,1);
                    
                    childEffect.playReversed =this.playReversed;
                    childEffect.startEffect();
                } 
            }
        }
    }
}