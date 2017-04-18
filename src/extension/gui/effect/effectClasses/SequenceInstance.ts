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
     * @class egret.gui.SequenceInstance
     * @classdesc
     * SequenceInstance 类用于实现 Sequence 效果的实例类
     * @extends egret.gui.CompositeEffectInstance
     */
    export class SequenceInstance extends CompositeEffectInstance{
        /**
         * @method egret.gui.SequenceInstance#constructor
         */
        public constructor(target:any){
            super(target);
        }

        /**
         * 已播放效果的持续时间
         */
        private currentInstanceDuration:number = 0; 
        
        /**
         * 当前播放的效果实例
         */
        private currentSet:any[];
        private currentSetIndex:number = -1;
        
        private isPaused:boolean = false;
        
        /**
         * @inheritDoc
         */
        public get _durationWithoutRepeat():number{
            let _duration:number = 0;
            
            let n:number = this._childSets.length;
            for (let i:number = 0; i < n; i++){
                let instances:any[] = this._childSets[i];
                _duration += instances[0]._actualDuration;
            }
            
            return _duration;
        }
        
        /**
         * @inheritDoc
         */
        public _setPlayheadTime(value:number){
            this._setPlayheadTime(value);

            let i:number, j:number, k:number, l:number = 0;
            let compositeDur:number = (<Sequence><any> (this.effect)).compositeDuration;
            let firstCycleDur:number = compositeDur + this.startDelay + this.repeatDelay;
            let laterCycleDur:number = compositeDur + this.repeatDelay;
            let totalDur:number = firstCycleDur + laterCycleDur * (this.repeatCount - 1);
            let iterationPlayheadTime:number;
            if (value <= firstCycleDur){
                iterationPlayheadTime = Math.min(value - this.startDelay, compositeDur);
                this._playCount = 1;
            }
            else{
                if (value >= totalDur && this.repeatCount != 0){
                    iterationPlayheadTime = compositeDur;
                    this._playCount = this.repeatCount;
                }
                else{
                    let valueAfterFirstCycle:number = value - firstCycleDur;
                    iterationPlayheadTime = valueAfterFirstCycle % laterCycleDur;
                    iterationPlayheadTime = Math.min(iterationPlayheadTime, compositeDur);
                    this._playCount = 1 + valueAfterFirstCycle / laterCycleDur;
                }
            }
            
            if (this._activeEffectQueue && this._activeEffectQueue.length  > 0){
                let cumulativeDuration:number = 0;
                
                let activeLength:number = this._activeEffectQueue.length;
                for (i = 0; i < activeLength; ++i){
                    let setToCompare:number = this.playReversed ? (activeLength - 1 - i) : i;
                    let childEffectInstances:any[];
                    let startTime:number = cumulativeDuration;
                    let endTime:number = cumulativeDuration + this._childSets[setToCompare][0]._actualDuration;
                    cumulativeDuration = endTime;
                    
                    if (startTime <= iterationPlayheadTime && iterationPlayheadTime <= endTime){
                        this._endEffectCalled = true;
                        
                        if (this.currentSetIndex == setToCompare){
                            for (j = 0; j < this.currentSet.length; j++)
                                this.currentSet[j].playheadTime = (iterationPlayheadTime - startTime);
                        }
                        else if (setToCompare < this.currentSetIndex){
                            if (this.playReversed){
                                for (j = 0; j < this.currentSet.length; j++)
                                    this.currentSet[j].end();

                                for (j = this.currentSetIndex - 1; j > setToCompare; --j){
                                    childEffectInstances = this._activeEffectQueue[j];
                                    for (k = 0; k < childEffectInstances.length; k++){
                                        if (this.playReversed)
                                            childEffectInstances[k].playReversed = true;
                                        childEffectInstances[k].play();
                                        childEffectInstances[k].end();
                                    }
                                }
                            }
                            else{
                                for (j = 0; j < this.currentSet.length; j++){
                                    this.currentSet[j].playheadTime = 0;
                                    this.currentSet[j].stop();
                                }

                                for (j = this.currentSetIndex - 1; j > setToCompare; --j){
                                    childEffectInstances = this._activeEffectQueue[j];
                                    for (k = 0; k < childEffectInstances.length; k++){
                                        childEffectInstances[k].play();
                                        childEffectInstances[k].stop();
                                    }
                                }
                            }
                            this.currentSetIndex = setToCompare;
                            this.playCurrentChildSet();
                            for (k = 0; k < this.currentSet.length; k++){
                                this.currentSet[k].playheadTime = (iterationPlayheadTime - startTime);
                                if (this.isPaused)
                                    this.currentSet[k].pause();
                            }
                        }
                        else{
                            if (this.playReversed){
                                for (j = 0; j < this.currentSet.length; j++){
                                    this.currentSet[j].playheadTime = 0;
                                    this.currentSet[j].stop();
                                }
                                
                                for (k = this.currentSetIndex + 1; k < setToCompare; k++){
                                    childEffectInstances = this._activeEffectQueue[k];
                                    for (l = 0; l < childEffectInstances.length; l++){
                                        childEffectInstances[l].playheadTime = 0;
                                        childEffectInstances[l].stop();
                                    }
                                }                            
                            }
                            else{
                                let currentEffectInstances:any[] = this.currentSet.concat();
                                for (j = 0; j < currentEffectInstances.length; j++)
                                    currentEffectInstances[j].end();
                                
                                for (k = this.currentSetIndex + 1; k < setToCompare; k++){
                                    childEffectInstances = this._activeEffectQueue[k];
                                    for (l = 0; l < childEffectInstances.length; l++){
                                        childEffectInstances[l].play();
                                        childEffectInstances[l].end();
                                    }
                                }
                            }
                            
                            this.currentSetIndex = setToCompare;
                            this.playCurrentChildSet();
                            for (k = 0; k < this.currentSet.length; k++){
                                this.currentSet[k].playheadTime = (iterationPlayheadTime - startTime);
                                if (this.isPaused)
                                    this.currentSet[k].pause();
                            }
                        }
                        this._endEffectCalled = false;
                        break;
                    }
                }
            }
        }
        
        /**
         * @inheritDoc
         */
        public play():void{
            this.isPaused = false;
            this._activeEffectQueue = [];
            this.currentSetIndex = this.playReversed ? this._childSets.length : -1;
            
            let n:number = 0;
            let i:number = 0;

            n = this._childSets.length;
            for (i = 0; i < n; i++){
                let instances:any[] = this._childSets[i];
                this._activeEffectQueue.push(instances);
            }
            
            super.play();
            
            if (this._activeEffectQueue.length == 0){
                this.finishRepeat();
                return;
            }
            this.playNextChildSet();
        }
        
        /**
         * @inheritDoc
         */
        public pause():void{   
            super.pause();
            this.isPaused = true;
            if (this.currentSet && this.currentSet.length > 0){
                let n:number = this.currentSet.length;
                for (let i:number = 0; i < n; i++){
                    this.currentSet[i].pause();
                }
            }
        }
        
        /**
         * @inheritDoc
         */
        public stop():void{
            this.isPaused = false;
            
            if (this._activeEffectQueue && this._activeEffectQueue.length > 0){
                let queueCopy:any[] = this._activeEffectQueue.concat();
                this._activeEffectQueue = null;
                let currentInstances:any[] = queueCopy[this.currentSetIndex];
                if (currentInstances){
                    let currentCount:number = currentInstances.length;
                    
                    for (let i:number = 0; i < currentCount; i++)
                        currentInstances[i].stop();
                }

                let n:number = queueCopy.length;
                for (let j:number = this.currentSetIndex + 1; j < n; j++){
                    let waitingInstances:any[] = queueCopy[j];
                    let m:number = waitingInstances.length;
                    
                    for (let k:number = 0; k < m; k++){
                        let instance:IEffectInstance = waitingInstances[k];
                        instance.effect.deleteInstance(instance);
                    }
                }
            }
            super.stop();
        }   
        
        /**
         * @inheritDoc
         */
        public resume():void{
            super.resume();
            this.isPaused = false;
            if (this.currentSet && this.currentSet.length > 0){
                let n:number = this.currentSet.length;
                for (let i:number = 0; i < n; i++){
                    this.currentSet[i].resume();
                }
            }
        }
        
        /**
         * @inheritDoc
         */
        public reverse():void{
            super.reverse();
            if (this.currentSet && this.currentSet.length > 0){
                let n:number = this.currentSet.length;
                for (let i:number = 0; i < n; i++){
                    this.currentSet[i].reverse();
                }
            }
        }
        
        /**
         * 中断当前正在播放的所有效果，跳过尚未开始播放的所有效果，并立即跳至最终的复合效果。
         * @method egret.gui.SequenceInstance#end
         */
        public end():void{
            this._endEffectCalled = true;
            if (this._activeEffectQueue && this._activeEffectQueue.length > 0){
                let queueCopy:any[] = this._activeEffectQueue.concat();
                this._activeEffectQueue = null;
                
                let currentInstances:any[] = queueCopy[this.currentSetIndex];
                if (currentInstances){
                    let currentCount:number = currentInstances.length;
                    for (let i:number = 0; i < currentCount; i++){
                        currentInstances[i].end();
                    }
                }
                
                let n:number = queueCopy.length;
                for (let j:number = this.currentSetIndex + 1; j < n; j++){
                    let waitingInstances:any[] = queueCopy[j];
                    let m:number = waitingInstances.length;
                    
                    for (let k:number = 0; k < m; k++){
                        (<EffectInstance><any> (waitingInstances[k]))._playWithNoDuration();
                    }
                }
            }
            this.isPaused = false;
            super.end();
        }
        
        /**
         * @inheritDoc
         */
        public _onEffectEnd(childEffect:IEffectInstance):void{
            for (let i:number = 0; i < this.currentSet.length; i++){
                if (childEffect == this.currentSet[i]){
                    this.currentSet.splice(i, 1);
                    break;
                }
            }   
            if (this._endEffectCalled)
                return; 
            
            if (this.currentSet.length == 0){
                if (false == this.playNextChildSet())
                    this.finishRepeat();
            }
        }

        private playCurrentChildSet():void{
            let childEffect:EffectInstance;
            let instances:any[] = this._activeEffectQueue[this.currentSetIndex];
            
            this.currentSet = [];
            
            for (let i:number = 0; i < instances.length; i++){
                childEffect = instances[i];
                
                this.currentSet.push(childEffect);
                childEffect.playReversed = this.playReversed;
                childEffect.startEffect();
            }
            this.currentInstanceDuration += childEffect._actualDuration;
        }
        
        private playNextChildSet(offset:number = 0):boolean{
            if (!this.playReversed){
                if (!this._activeEffectQueue ||
                    this.currentSetIndex++ >= this._activeEffectQueue.length - 1){
                    return false;
                }
            }
            else{
                if (this.currentSetIndex-- <= 0)
                    return false;
            }
            this.playCurrentChildSet();
            return true;
        }
    }
}