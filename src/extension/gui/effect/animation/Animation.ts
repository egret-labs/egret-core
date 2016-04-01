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

/// <reference path="../easing/Sine.ts" />

module egret.gui {
    /**
     * @class egret.gui.Animation
     * @classdesc
     * Animation 类定义在指定的时间段上在属性的开始值和结束值之间发生的动画。
     */
    export class Animation{
        private static TIMER_RESOLUTION:number = 1000 / 60;

        /**
         * @param updateFunction {Function} 动画更新时的回调函数,updateFunction(animation:Animation):void
         * @param thisObject {an}
         * @method egret.gui.Animation#constructor
         */
        public constructor(updateFunction:(animation:Animation)=>void,thisObject:any){
            this.updateFunction = updateFunction;
            this.thisObject = thisObject;
        }

        private static defaultEaser:IEaser = new Sine(.5);
        private _easer:IEaser = Animation.defaultEaser;
        /**
         * 此效果的缓动行为，默认为Sine(.5)
         * @member egret.gui.Animation#easer
         */
        public get easer():IEaser
        {
            return this._easer;
        }

        public set easer(value:IEaser)
        {
            if (!value)
            {
                value = Animation.defaultEaser;
            }
            this._easer = value;
        }

        private thisObject: any = null;

        /**
         * 动画开始播放时的回调函数,只会在首次延迟等待结束时触发一次,若有重复播放，之后将触发repeatFunction。
         * startFunction(animation:Animation):void
         * @member egret.gui.Animation#startFunction
         */
        public startFunction:Function = null;
        /**
         * 动画播放结束时的回调函数,可以是正常播放结束，也可以是被调用了end()方法导致结束。注意：stop()方法被调用不会触发这个函数。
         * endFunction(animation:Animation):void
         * @member egret.gui.Animation#endFunction
         */
        public endFunction:Function = null;
        /**
         * 动画更新时的回调函数,updateFunction(animation:Animation):void
         * @member egret.gui.Animation#updateFunction
         */
        public updateFunction:Function = null;
        /**
         * 动画被停止的回调函数，即stop()方法被调用。stopFunction(animation:Animation):void
         * @member egret.gui.Animation#stopFunction
         */
        public stopFunction:Function = null;
        /**
         * 动画重复的回调函数，repeatFunction(animation:Animation):void
         * @member egret.gui.Animation#repeatFunction
         */
        public repeatFunction:Function = null;

        /**
         * 用于计算当前帧的时间
         */
        private static intervalTime:number = NaN;

        private static activeAnimations:Array<Animation> = new Array<Animation>();
        private static timer:egret.Timer = null;

        private id:number = -1;
        private _doSeek:boolean = false;
        private _isPlaying:boolean = false;
        private _doReverse:boolean = false;
        private _invertValues:boolean = false;
        private startTime:number;
        private started:boolean = false;
        private cycleStartTime:number;
        private delayTime:number = -1;
        private static delayedStartAnims:Array<Animation> = new Array<Animation>();
        private delayedStartTime:number = -1;

        /**
         * 直到 Animation 的当前帧，包含计算的值的对象。
         * 会使用属性名作为键，将这些值存储为 map 值。
         * @member egret.gui.Animation#currentValue
         */
        public currentValue:any;

        /**
         * MotionPath 对象集，它定义随着时间的推移 Animation 将设置动画的属性和值。
         * @member egret.gui.Animation#motionPaths
         */
        public motionPaths:Array<MotionPath>;

        private _playheadTime:number = 0;
        /**
         * 动画的总计已过去时间，包括任何开始延迟和重复。
         * 对于播放了第一个循环的动画，此值将等于 cycleTime 的值。
         * @member egret.gui.Animation#playheadTime
         */
        public get playheadTime():number{
            return this._playheadTime + this.startDelay;
        }
        public set playheadTime(value:number){
            this._invertValues = false;
            this.seek(value, true);
        }
        /**
         * 如果为 true，则表示当前正在播放动画。
         * 除非已播放动画且尚未停止（以编程方式或自动）或暂停它，否则该值为 false。
         * @member egret.gui.Animation#isPlaying
         */
        public get isPlaying():boolean{
            return this._isPlaying;
        }

        /**
         * 动画的时长（以毫秒为单位），不计算由 repeatCount 属性定义的任何重复。
         * @member egret.gui.Animation#duration
         */
        public duration:number = 500;

        private _repeatBehavior:string = RepeatBehavior.LOOP;
        /**
         * 设置重复动画的行为。
         * 重复动画已将 repeatCount 属性设置为 0 或某个大于 1 的值。
         * 此值应该为 RepeatBehavior.LOOP（意味着每次动画按相同的顺序重复）
         * 或 RepeatBehavior.REVERSE（意味着对于每个迭代，动画都倒转方向）。
         * @member egret.gui.Animation#repeatBehavior
         */
        public get repeatBehavior():string{
            return this._repeatBehavior;
        }

        public set repeatBehavior(value:string){
            this._repeatBehavior = value;
        }

        private _repeatCount:number = 1;
        /**
         * 此动画重复的次数。值为 0 意味着它会无限期地重复。默认值为1
         * @member egret.gui.Animation#repeatCount
         */
        public get repeatCount():number{
            return this._repeatCount;
        }

        public set repeatCount(value:number){
            this._repeatCount = value;
        }

        private _repeatDelay:number = 0;
        /**
         * 在每次重复循环开始之前延迟的时间数量（以毫秒为单位）。
         * 将此值设置为一个非零数字会恰好在其结束值处结束上一个动画循环。
         * 但是，不延迟的重复可能会完全跳过该值，因为动画会从在一个循环的结尾附近平滑地过渡到越过下一个循环的开始处。
         * 必须将此属性设置为大于等于 0 的一个值。
         * @member egret.gui.Animation#repeatDelay
         */
        public get repeatDelay():number{
            return this._repeatDelay;
        }

        public set repeatDelay(value:number){
            this._repeatDelay = value;
        }

        private _startDelay:number = 0;
        /**
         * 在动画开始之前等待的时间数量。必须将此属性设置为大于等于 0 的一个值。
         * @member egret.gui.Animation#startDelay
         */
        public get startDelay():number{
            return this._startDelay;
        }

        public set startDelay(value:number){
            this._startDelay = value;
        }

        /**
         * Animation 实例所用的插补器，用于计算属性的开始值和结束值之间的值。
         * @member egret.gui.Animation#interpolator
         */
        public interpolator:IInterpolator = null;

        private _cycleTime:number = 0;
        /**
         * 在当前周期动画中的当前毫秒位置。该值介于 0 和 duration 之间。
         * 动画的“周期”被定义为动画的单一重复，其中 repeatCount 属性用于定义将播放的周期数。
         * 使用 seek() 方法更改动画的位置。
         * @member egret.gui.Animation#cycleTime
         */
        public get cycleTime():number{
            return this._cycleTime;
        }

        private _cycleFraction:number;
        /**
         * 在已应用缓动之后，在动画中已过去的当前部分。
         * 此值在 0 和 1 之间。动画的“周期”被定义为动画的单一重复，其中 repeatCount 属性用于定义将播放的周期数。
         * @member egret.gui.Animation#cycleFraction
         */
        public get cycleFraction():number{
            return this._cycleFraction;
        }


        private _playReversed:boolean;
        /**
         * 如果为 true，则反向播放动画。
         * 如果当前播放动画的方向与 playReversed 的指定值相反，则动画将以动态方式更改方向。
         * @member egret.gui.Animation#playReversed
         */
        public get playReversed():boolean{
            return this._playReversed;
        }

        public set playReversed(value:boolean){
            if (this._isPlaying){
                if (this._invertValues != value){
                    this._invertValues = value;
                    this.seek(this.duration - this._cycleTime, true);
                }
            }
            this._doReverse = value;
            this._playReversed = value;
        }

        /**
         * 添加动画
         */
        private static addAnimation(animation:Animation):void{
            if (animation.motionPaths && animation.motionPaths.length > 0 &&
                animation.motionPaths[0] &&
                (animation.motionPaths[0].property == "width" ||
                    animation.motionPaths[0].property == "height")){
                Animation.activeAnimations.splice(0, 0, animation);
                animation.id = 0;
                for (var i:number = 1; i < Animation.activeAnimations.length; ++i)
                    (<Animation><any> (Animation.activeAnimations[i])).id = i;
            }
            else{
                animation.id = Animation.activeAnimations.length;
                Animation.activeAnimations.push(animation);
            }

            if (!Animation.timer){
                Animation.pulse();
                Animation.timer = new egret.Timer(Animation.TIMER_RESOLUTION);
                Animation.timer.addEventListener(egret.TimerEvent.TIMER, Animation.timerHandler, Animation);
                Animation.timer.start();
            }
            Animation.intervalTime = Animation.currentTime;
            animation.cycleStartTime = Animation.intervalTime;
        }

        private static removeAnimationAt(index:number = 0):void{
            if (index >= 0 && index < Animation.activeAnimations.length){
                Animation.activeAnimations.splice(index, 1);

                var n:number = Animation.activeAnimations.length;
                for (var i:number = index; i < n; i++){
                    var curAnimation:Animation = <Animation><any> (Animation.activeAnimations[i]);
                    curAnimation.id--;
                }
            }
            Animation.stopTimerIfDone();
        }

        private static removeAnimation(animation:Animation):void{
            Animation.removeAnimationAt(animation.id);
        }

        private static timerHandler(event:egret.TimerEvent):void{
            Animation.intervalTime = Animation.pulse();

            var i:number = 0;

            while (i < Animation.activeAnimations.length){
                var incrementIndex:boolean = true;
                var animation:Animation = <Animation><any> (Animation.activeAnimations[i]);
                if (animation)
                    incrementIndex = !animation.doInterval();
                if (incrementIndex)
                    ++i;
            }

            while (Animation.delayedStartAnims.length > 0){
                var anim:Animation = <Animation><any> (Animation.delayedStartAnims[0]);
                var animStartTime:number = anim.delayedStartTime;
                if (animStartTime < Animation.currentTime)
                    if (anim.playReversed)
                        anim.end();
                    else
                        anim.start();
                else
                    break;
            }
        }

        /**
         * 计算插补值，派发更新事件。如果动画结束了则返回true
         */
        private doInterval():boolean{
            var animationEnded:boolean = false;
            var repeated:boolean = false;

            if (this._isPlaying || this._doSeek){
                var currentTime:number = Animation.intervalTime - this.cycleStartTime;
                this._playheadTime = Animation.intervalTime - this.startTime;
                if (currentTime >= this.duration){
                    var numRepeats:number = 2;
                    if ((this.duration + this.repeatDelay) > 0)
                        numRepeats += Math.floor((this._playheadTime - this.duration) / (this.duration + this.repeatDelay));
                    if (this.repeatCount == 0 || numRepeats <= this.repeatCount){
                        if (this.repeatDelay == 0){
                            this._cycleTime = currentTime % this.duration;
                            this.cycleStartTime = Animation.intervalTime - this._cycleTime;
                            currentTime = this._cycleTime;
                            if (this.repeatBehavior == RepeatBehavior.REVERSE){
                                if (this.repeatCount > 1)
                                    this._invertValues = !(numRepeats%2);
                                else
                                    this._invertValues = !this._invertValues;
                            }
                            repeated = true;
                        }
                        else{
                            if (this._doSeek){
                                this._cycleTime = currentTime % (this.duration + this.repeatDelay);
                                if (this._cycleTime > this.duration)
                                    this._cycleTime = this.duration;
                                this.calculateValue(this._cycleTime);
                                this.sendUpdateEvent();
                                return false;
                            }
                            else{
                                this._cycleTime = this.duration;
                                this.calculateValue(this._cycleTime);
                                this.sendUpdateEvent();
                                Animation.removeAnimation(this);
                                var delayTimer:egret.Timer = new egret.Timer(this.repeatDelay, 1);
                                delayTimer.addEventListener(egret.TimerEvent.TIMER, this.repeat, this);
                                delayTimer.start();
                                return false;
                            }
                        }
                    }
                    else if (currentTime > this.duration){
                        currentTime = this.duration;
                        this._playheadTime = this.duration;
                    }
                }
                this._cycleTime = currentTime;

                this.calculateValue(currentTime);

                if (currentTime >= this.duration && !this._doSeek){
                    if (!this.playReversed || this.startDelay == 0){
                        this.end();
                        animationEnded = true;
                    }
                    else{
                        this.stopAnimation();
                        this.addToDelayedAnimations(this.startDelay);
                    }
                }
                else{
                    if (repeated)
                        this.sendAnimationEvent("repeatFunction");
                    this.sendUpdateEvent();
                }
            }
            return animationEnded;
        }

        /**
         * 通知目标对象更新动画
         */
        private sendUpdateEvent():void{
            this.sendAnimationEvent("updateFunction");
        }

        /**
         * 发送动画事件
         */
        private sendAnimationEvent(eventType:string):void{
            if(this[eventType] != null){
                this[eventType].call(this.thisObject,this);
            }
        }

        /**
         * 计算当前值
         */
        private calculateValue(currentTime:number):void{
            var i:number = 0;

            this.currentValue = {};
            if (this.duration == 0){
                for (i = 0; i < this.motionPaths.length; ++i){
                    this.currentValue[this.motionPaths[i].property] =
                        this._invertValues ?
                            this.motionPaths[i].keyframes[0].value :
                            this.motionPaths[i].keyframes[this.motionPaths[i].keyframes.length - 1].value;
                }
                return;
            }

            if (this._invertValues)
                currentTime = this.duration - currentTime;

            this._cycleFraction = this.easer.ease(currentTime/this.duration);

            if (this.motionPaths)
                for (i = 0; i < this.motionPaths.length; ++i)
                    this.currentValue[this.motionPaths[i].property] =
                        this.motionPaths[i].getValue(this._cycleFraction);
        }

        private removeFromDelayedAnimations():void{
            if (this.delayedStartTime>=0){
                for (var i:number = 0; i < Animation.delayedStartAnims.length; ++i){
                    if (Animation.delayedStartAnims[i] == this){
                        Animation.delayedStartAnims.splice(i, 1);
                        break;
                    }
                }
                this.delayedStartTime = -1;
            }
        }

        /**
         * 中断动画，立即跳到动画的结尾，并对 animationTarget 调用 animationEnd() 函数。
         * @method egret.gui.Animation#end
         */
        public end():void{
            if (this.startDelay > 0 && Animation.delayedStartAnims.length > 0){
                this.removeFromDelayedAnimations();
            }

            if (!this.started)
                this.sendAnimationEvent("startFunction");
            if (this.repeatCount > 1 && this.repeatBehavior == "reverse" && (this.repeatCount % 2 == 0))
                this._invertValues = true;

            if (!(this._doReverse && this.startDelay > 0)){
                this.calculateValue(this.duration);
                this.sendUpdateEvent();
            }

            this.sendAnimationEvent("endFunction");

            if (this.isPlaying)
                this.stopAnimation();
            else
                Animation.stopTimerIfDone();
        }

        private static stopTimerIfDone():void{
            if (Animation.timer && Animation.activeAnimations.length == 0 && Animation.delayedStartAnims.length == 0){
                Animation.intervalTime = NaN;
                Animation.timer.reset();
                Animation.timer = null;
            }
        }

        private addToDelayedAnimations(timeToDelay:number):void{
            if (!Animation.timer){
                Animation.pulse();
                Animation.timer = new egret.Timer(Animation.TIMER_RESOLUTION);
                Animation.timer.addEventListener(egret.TimerEvent.TIMER, Animation.timerHandler, Animation);
                Animation.timer.start();
            }
            var animStartTime:number = Animation.currentTime + timeToDelay;
            var insertIndex:number = -1;
            for (var i:number = 0; i < Animation.delayedStartAnims.length; ++i){
                var timeAtIndex:number = Animation.delayedStartAnims[i].delayedStartTime;
                if (animStartTime < timeAtIndex){
                    insertIndex = i;
                    break;
                }
            }
            if (insertIndex >= 0)
                Animation.delayedStartAnims.splice(insertIndex, 0, this);
            else
                Animation.delayedStartAnims.push(this);
            this.delayedStartTime = animStartTime;
        }

        /**
         * 开始动画。如果动画已在播放，则会首先停止它，然后播放它。
         * @method egret.gui.Animation#play
         */
        public play():void{
            this.stopAnimation();
            var i:number = 0;
            var j:number = 0;
            for (i = 0; i < this.motionPaths.length; ++i){
                var keyframes:Array<Keyframe> = this.motionPaths[i].keyframes;
                if (isNaN(keyframes[0].time))
                    keyframes[0].time = 0;
                else if (keyframes[0].time > 0){
                    var startTime:number = keyframes[0].time;
                    keyframes.splice(0, 0, new Keyframe(0, null));
                    keyframes.splice(1, 0, new Keyframe(startTime-1, null));
                    if (this.playReversed){
                        keyframes[0].value = keyframes[2].value;
                        keyframes[1].value = keyframes[2].value;
                    }
                }
                for (j = 1; j < keyframes.length; ++j){
                    if (isNaN(keyframes[j].time))
                        keyframes[j].time = this.duration;
                }
            }
            for (i = 0; i < this.motionPaths.length; ++i)
                this.motionPaths[i]._scaleKeyframes(this.duration);

            if (this._doReverse)
                this._invertValues = true;

            if (this.startDelay > 0 && !this.playReversed)
                this.addToDelayedAnimations(this.startDelay);
            else
                this.start();
        }

        /**
         * 前进到指定位置
         */
        private seek(playheadTime:number, includeStartDelay:boolean = false):void{
            this.startTime = this.cycleStartTime = Animation.intervalTime - playheadTime;
            this._doSeek = true;

            if (!this._isPlaying || this.playReversed){
                var isPlayingTmp:boolean = this._isPlaying;
                Animation.intervalTime = Animation.currentTime;
                if (includeStartDelay && this.startDelay > 0){
                    if (this.delayedStartTime>=0){
                        this.removeFromDelayedAnimations();
                        var postDelaySeekTime:number = playheadTime - this.startDelay;
                        if (this.playReversed)
                            postDelaySeekTime -= this.duration;
                        if (postDelaySeekTime < 0){
                            this.addToDelayedAnimations(this.startDelay - playheadTime);
                            return;
                        }
                        else{
                            playheadTime -= this.startDelay;
                            if (!this.isPlaying)
                                this.start();
                            this.startTime = this.cycleStartTime = Animation.intervalTime - playheadTime;
                            this.doInterval();
                            this._doSeek = false;
                            return;
                        }
                    }
                }
                if (!isPlayingTmp){
                    this.sendAnimationEvent("startFunction");
                    this.setupInterpolation();
                }
                this.startTime = this.cycleStartTime = Animation.intervalTime - playheadTime;
            }
            this.doInterval();
            this._doSeek = false;
        }

        /**
         * 设置数组插补器
         */
        private setupInterpolation():void{
            if (this.interpolator && this.motionPaths)
                for (var i:number = 0; i < this.motionPaths.length; ++i)
                    this.motionPaths[i].interpolator = this.interpolator;
        }

        /**
         * 从当前位置反向播放效果
         * @method egret.gui.Animation#reverse
         */
        public reverse():void{
            if (this._isPlaying){
                this._doReverse = false;
                this.seek(this.duration - this._cycleTime);
                this._invertValues = !this._invertValues;
            }
            else{
                this._doReverse = !this._doReverse;
            }
        }

        /**
         * 在调用 resume() 方法之前暂停该效果。如果在 resume() 之前调用 stop()，则无法继续该动画。
         * @method egret.gui.Animation#pause
         */
        public pause():void{
            if (this.delayedStartTime>=0){
                this.delayTime = this.delayedStartTime - Animation.currentTime;
                this.removeFromDelayedAnimations();
            }
            this._isPlaying = false;
        }

        private stopAnimation():void{
            this.removeFromDelayedAnimations();
            if (this.id >= 0){
                Animation.removeAnimationAt(this.id);
                this.id = -1;
                this._invertValues = false;
                this._isPlaying = false;
            }
        }
        /**
         * 停止播放动画，且结束时不调用 end() 方法。将对 animationTarget 调用 animationStop() 函数。
         * @method egret.gui.Animation#stop
         */
        public stop():void{
            this.stopAnimation();
            this.sendAnimationEvent("stopFunction");
        }

        /**
         * 在效果由 pause() 方法暂停后继续播放效果。
         * @method egret.gui.Animation#resume
         */
        public resume():void{
            this._isPlaying = true;

            if (this.delayTime >= 0){
                this.addToDelayedAnimations(this.delayTime);
            }
            else{
                this.cycleStartTime = Animation.intervalTime - this._cycleTime;
                this.startTime = Animation.intervalTime - this._playheadTime;
                if (this._doReverse){
                    this.reverse();
                    this._doReverse = false;
                }
            }
        }

        private repeat(event:egret.TimerEvent = null):void{
            if (this.repeatBehavior == RepeatBehavior.REVERSE)
                this._invertValues = !this._invertValues;
            this.calculateValue(0);
            this.sendAnimationEvent("repeatFunction");
            this.sendUpdateEvent();
            Animation.addAnimation(this);
        }

        private start(event:egret.TimerEvent = null):void{
            var actualStartTime:number = 0;
            if (!this.playReversed && this.delayedStartTime>=0){
                var overrun:number = Animation.currentTime - this.delayedStartTime;
                if (overrun > 0)
                    actualStartTime = Math.min(overrun, this.duration);
                this.removeFromDelayedAnimations();
            }
            this.sendAnimationEvent("startFunction");
            this.setupInterpolation();
            this.calculateValue(0);
            this.sendUpdateEvent();
            Animation.addAnimation(this);
            this.startTime = this.cycleStartTime;
            this._isPlaying = true;
            if (actualStartTime > 0)
                this.seek(actualStartTime);
            this.started = true;
        }

        private static startTime:number = -1;
        private static _currentTime:number = -1;
        private static pulse():number{
            if (Animation.startTime < 0){
                Animation.startTime = egret.getTimer();
                Animation._currentTime = 0;
                return Animation._currentTime;
            }
            Animation._currentTime = egret.getTimer() - Animation.startTime;
            return Animation._currentTime;
        }

        private static get currentTime():number{
            if (Animation._currentTime < 0){
                return Animation.pulse();
            }
            return Animation._currentTime;
        }
    }
}
