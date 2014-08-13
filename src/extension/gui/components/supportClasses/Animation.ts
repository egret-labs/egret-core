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
	 * @class egret.gui.Animation
	 * @classdesc
	 * 数值缓动工具类
	 */
    export class Animation{
        /**
         * 构造函数
		 * @method egret.gui.Animation#constructor
         * @param updateFunction {Function} 动画更新时的回调函数,updateFunction(animation:Animation):void
		 * @param thisObject {an} 
         */
        public constructor(updateFunction:Function,thisObject:any){
            this.updateFunction = updateFunction;
            this.thisObject = thisObject;
        }

        /**
         * 此动画的缓动行为。设置为null意味着不使用缓动，默认值为Ease.sineInOut()
		 * @member egret.gui.Animation#easerFunction
         */
        public easerFunction:Function = Ease.sineInOut;

        private thisObject:any;

        private _isPlaying:boolean
        /**
         * 是否正在播放动画，不包括延迟等待和暂停的阶段
		 * @member egret.gui.Animation#isPlaying
         */
        public get isPlaying():boolean{
            return this._isPlaying;
        }


        private _duration:number = 500;
        /**
         * 动画持续时间,单位毫秒，默认值500
		 * @member egret.gui.Animation#duration
         */
        public get duration():number{
            return this._duration;
        }

        public set duration(value:number){
            this._duration = value;
        }

        private _startDelay:number = 0;

        /**
         * 动画开始播放前的延时时间,单位毫秒,默认0。
		 * @member egret.gui.Animation#startDelay
         */
        public get startDelay():number{
            return this._startDelay;
        }

        public set startDelay(value:number){
            this._startDelay = value;
        }

        private _repeatCount:number = 1;
        /**
         * 动画重复的次数，0代表无限制重复。默认值为1。
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
         * 每次重复播放之间的间隔。第二次及以后的播放开始之前的延迟毫秒数。若要设置第一次之前的延迟时间，请使用startDelay属性。
		 * @member egret.gui.Animation#repeatDelay
         */
        public get repeatDelay():number{
            return this._repeatDelay;
        }

        public set repeatDelay(value:number){
            this._repeatDelay = value;
        }
        /**
         * 随着时间的推移Animation将设置动画的属性和值的列表。对象示例:{p:"x",f:10,t:100}表示，属性名"x"从10改变到100。
		 * @member egret.gui.Animation#motionPaths
         */
        public motionPaths:Array<any> = [];

        private _currentValue:any = {};

        /**
         * 动画到当前时间对应的值。以MotionPath.property为键存储各个MotionPath的当前值。
		 * @member egret.gui.Animation#currentValue
         */
        public get currentValue():any{
            return this._currentValue;
        }

        /**
         * 动画开始播放时的回调函数,只会在首次延迟等待结束时触发一次,若有重复播放，之后将触发repeatFunction。startFunction(animation:Animation):void
		 * @member egret.gui.Animation#startFunction
         */
        public startFunction:Function;
        /**
         * 动画播放结束时的回调函数,可以是正常播放结束，也可以是被调用了end()方法导致结束。注意：stop()方法被调用不会触发这个函数。endFunction(animation:Animation):void
		 * @member egret.gui.Animation#endFunction
         */
        public endFunction:Function;

        /**
         * 动画更新时的回调函数,updateFunction(animation:Animation):void
		 * @member egret.gui.Animation#updateFunction
         */
        public updateFunction:Function;

        /**
         * 动画被停止的回调函数，即stop()方法被调用。stopFunction(animation:Animation):void
		 * @member egret.gui.Animation#stopFunction
         */
        public stopFunction:Function;

        /**
         * 开始正向播放动画,无论何时调用都重新从零时刻开始，若设置了延迟会首先进行等待。
		 * @method egret.gui.Animation#play
         */
        public play():void{
            this.stopAnimation();
            this.start();
        }

        /**
         * 立即跳到指定百分比的动画位置
         */
        private seek(runningTime:number):void{
            runningTime = Math.min(runningTime,this.duration);
            var fraction:number = runningTime/this.duration;
            this.caculateCurrentValue(fraction);
            this.startTime = getTimer() - runningTime - this._startDelay;
            if(this.updateFunction!=null)
                this.updateFunction.call(this.thisObject,this);
        }

        /**
         * 开始播放动画
         */
        private start():void{
            this.playedTimes = 0;
            this._started = true;
            this._isPlaying = false;
            this._currentValue = {};
            this.caculateCurrentValue(0);
            this.startTime = getTimer();
            Animation.currentTime = this.startTime;
            this.doInterval();
            Animation.addAnimation(this);
        }

        /**
         * 直接跳到动画结尾
		 * @method egret.gui.Animation#end
         */
        public end():void{
            if(!this._started){
                this.caculateCurrentValue(0);
                if(this.startFunction!=null){
                    this.startFunction.call(this.thisObject,this);
                }
                if(this.updateFunction!=null){
                    this.updateFunction.call(this.thisObject,this);
                }
            }
            this.caculateCurrentValue(1);
            if(this.updateFunction!=null){
                this.updateFunction.call(this.thisObject,this);
            }
            this.stopAnimation();
            if(this.endFunction!=null){
                this.endFunction.call(this.thisObject,this);
            }
        }

        /**
         * 停止播放动画
		 * @method egret.gui.Animation#stop
         */
        public stop():void{
            this.stopAnimation();
            if(this.stopFunction!=null)
                this.stopFunction.call(this.thisObject,this);
        }
        /**
         * 仅停止播放动画，而不调用stopFunction。
         */
        private stopAnimation():void{
            this.playedTimes = 0;
            this._isPlaying = false;
            this.startTime = 0;
            this._started = false;
            Animation.removeAnimation(this);
        }

        private pauseTime:number = 0;

        private _isPaused:boolean = false;
        /**
         * 正在暂停中
		 * @member egret.gui.Animation#isPaused
         */
        public get isPaused():boolean{
            return this._isPaused;
        }

        /**
         * 暂停播放
		 * @method egret.gui.Animation#pause
         */
        public pause():void{
            if(!this._started)
                return;
            this._isPaused = true;
            this.pauseTime = getTimer();
            this._isPlaying = false;
            Animation.removeAnimation(this);
        }
        /**
         * 继续播放
		 * @method egret.gui.Animation#resume
         */
        public resume():void{
            if(!this._started||!this._isPaused)
                return;
            this._isPaused = false;
            this.startTime += getTimer()-this.pauseTime;
            this.pauseTime = -1;
            Animation.addAnimation(this);
        }

        /**
         * 动画启动时刻
         */
        private startTime:number = 0;

        private _started:boolean = false;

        /**
         * 动画已经开始的标志，包括延迟等待和暂停的阶段。
		 * @member egret.gui.Animation#started
         */
        public get started():boolean{
            return this._started;
        }


        /**
         * 已经播放的次数。
         */
        private playedTimes:number = 0;
        /**
         * 计算当前值并返回动画是否结束
         */
        private doInterval():boolean{
            var delay:number = this.playedTimes>0?this._repeatDelay:this._startDelay;
            var runningTime:number = Animation.currentTime-this.startTime-delay;
            if(runningTime<0){
                return false;
            }
            if(!this._isPlaying){
                this._isPlaying = true;
                if(this.playedTimes==0){
                    if(this.startFunction!=null)
                        this.startFunction.call(this.thisObject,this);
                }
            }
            var fraction:number = this._duration==0?1:Math.min(runningTime,this._duration)/this._duration;
            this.caculateCurrentValue(fraction);
            if(this.updateFunction!=null)
                this.updateFunction.call(this.thisObject,this);
            var isEnded:boolean = runningTime>=this._duration;
            if(isEnded){
                this.playedTimes++;
                this._isPlaying = false;
                this.startTime =  Animation.currentTime;
                if(this._repeatCount==0||this.playedTimes<this._repeatCount){
                    isEnded = false;
                }
                else{
                    Animation.removeAnimation(this);
                    this._started = false;
                    this.playedTimes = 0;
                }
            }
            if(isEnded&&this.endFunction!=null){
                this.endFunction.call(this.thisObject,this);
            }
            return isEnded;
        }

        /**
         * 计算当前值
         */
        private caculateCurrentValue(fraction:number):void{
            if(this.easerFunction)
                fraction = this.easerFunction(fraction);
            var paths:Array<any> = this.motionPaths;
            var length:number = paths.length;
            for(var i:number=0;i<length;i++){
                var motion:any = paths[i];
                this.currentValue[motion.prop] = motion.from+(motion.to-motion.from)*fraction;
            }
        }

        /**
         * 总时间轴的当前时间
         */
        private static currentTime:number = 0;

        private static TIMER_RESOLUTION:number = 1000 / 60;	// 60 fps

        private static registered:boolean;

        /**
         * 正在活动的动画
         */
        private static activeAnimations:Array<any> = [];

        /**
         * 添加动画到队列
         */
        private static addAnimation(animation:Animation):void{
            if(Animation.activeAnimations.indexOf(animation)==-1){
                Animation.activeAnimations.push(animation);
                if (!Animation.registered){
                    Animation.registered = true;
                    Ticker.getInstance().register(Animation.onEnterFrame, null);
                }
            }
        }

        /**
         * 从队列移除动画,返回移除前的索引
         */
        private static removeAnimation(animation:Animation):void{
            var index:number = Animation.activeAnimations.indexOf(animation);
            if(index!=-1){
                Animation.activeAnimations.splice(index,1);
                if(index<=Animation.currentIntervalIndex)
                    Animation.currentIntervalIndex--;
            }
            if(Animation.activeAnimations.length==0&&Animation.registered){
                Animation.registered = false;
                Ticker.getInstance().unregister(Animation.onEnterFrame, null);
            }
        }

        /**
         * 当前正在执行动画的索引
         */
        private static currentIntervalIndex:number = -1;

        /**
         * 计时器触发函数
         */
        private static onEnterFrame(frameTime:number,currentTime:number):void{
            Animation.currentTime = getTimer();
            Animation.currentIntervalIndex = 0;
            while(Animation.currentIntervalIndex<Animation.activeAnimations.length){
                var animation:Animation = Animation.activeAnimations[Animation.currentIntervalIndex];
                var isEnded:boolean = animation.doInterval();
                Animation.currentIntervalIndex++;
            }
            Animation.currentIntervalIndex = -1;
            if(Animation.activeAnimations.length==0&&Animation.registered){
                Animation.registered = false;
                Ticker.getInstance().unregister(Animation.onEnterFrame, null);
            }
        }

    }
}