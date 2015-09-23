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

module eui.sys {
    /**
     * @private
     * 需要记录的历史速度的最大次数。
     */
    var MAX_VELOCITY_COUNT = 4;
    /**
     * @private
     * 记录的历史速度的权重列表。
     */
    var VELOCITY_WEIGHTS:number[] = [1, 1.33, 1.66, 2];
    /**
     * @private
     * 当前速度所占的权重。
     */
    var CURRENT_VELOCITY_WEIGHT = 2.33;
    /**
     * @private
     * 最小的改变速度，解决浮点数精度问题。
     */
    var MINIMUM_VELOCITY = 0.02;
    /**
     * @private
     * 当容器自动滚动时要应用的摩擦系数
     */
    var FRICTION = 0.998;
    /**
     * @private
     * 当容器自动滚动时并且滚动位置超出容器范围时要额外应用的摩擦系数
     */
    var EXTRA_FRICTION = 0.95;
    /**
     * @private
     * 摩擦系数的自然对数
     */
    var FRICTION_LOG = Math.log(FRICTION);

    /**
     * @private
     *
     * @param ratio
     * @returns
     */
    function easeOut(ratio:number):number {
        var invRatio:number = ratio - 1.0;
        return invRatio * invRatio * invRatio + 1;
    }

    /**
     * @private
     * 一个工具类,用于容器的滚屏拖动操作，计算在一段时间持续滚动后释放，应该继续滚动到的值和缓动时间。
     * 使用此工具类，您需要创建一个 ScrollThrown 实例,并在滚动发生时调用start()方法，然后在触摸移动过程中调用update()更新当前舞台坐标。
     * 内部将会启动一个计时器定时根据当前位置计算出速度值，并缓存下来最后4个值。当停止滚动时，再调用finish()方法，
     * 将立即停止记录位移，并将计算出的最终结果存储到 Thrown.scrollTo 和 Thrown.duration 属性上。
     */
    export class TouchScroll {

        /**
         * @private
         * 创建一个 TouchScroll 实例
         * @param updateFunction 滚动位置更新回调函数
         */
        public constructor(updateFunction:(scrollPos:number)=>void, endFunction:()=>void, target:egret.IEventDispatcher) {
            if (DEBUG && !updateFunction) {
                egret.$error(1003, "updateFunction");
            }
            this.updateFunction = updateFunction;
            this.endFunction = endFunction;
            this.target = target;
            this.animation = new sys.Animation(this.onScrollingUpdate, this);
            this.animation.endFunction = this.finishScrolling;
            this.animation.easerFunction = easeOut;
        }

        /**
         * @private
         * 当前容器滚动外界可调节的系列
         */
        $scrollFactor = 1.0;

        /**
         * @private
         */
        private target:egret.IEventDispatcher;
        /**
         * @private
         */
        private updateFunction:(scrollPos:number)=>void;
        /**
         * @private
         */
        private endFunction:()=>void;

        /**
         * @private
         */
        private previousTime:number = 0;
        /**
         * @private
         */
        private velocity:number = 0;
        /**
         * @private
         */
        private previousVelocity:number[] = [];
        /**
         * @private
         */
        private currentPosition:number = 0;
        /**
         * @private
         */
        private previousPosition:number = 0;
        /**
         * @private
         */
        private currentScrollPos:number = 0;
        /**
         * @private
         */
        private maxScrollPos:number = 0;
        /**
         * @private
         * 触摸按下时的偏移量
         */
        private offsetPoint:number = 0;
        /**
         * @private
         * 停止触摸时继续滚动的动画实例
         */
        private animation:sys.Animation;

        /**
         * @private
         * 正在播放缓动动画的标志。
         */
        public isPlaying():boolean {
            return this.animation.isPlaying;
        }

        /**
         * @private
         * 如果正在执行缓动滚屏，停止缓动。
         */
        public stop():void {
            this.animation.stop();
            egret.stopTick(this.onTick, this);
            this.started = false;
        }

        private started:boolean = true;

        /**
         * @private
         * true表示已经调用过start方法。
         */
        public isStarted():boolean {
            return this.started;
        }

        /**
         * @private
         * 开始记录位移变化。注意：当使用完毕后，必须调用 finish() 方法结束记录，否则该对象将无法被回收。
         * @param touchPoint 起始触摸位置，以像素为单位，通常是stageX或stageY。
         */
        public start(touchPoint:number, scrollValue:number, maxScrollValue:number):void {
            this.started = true;
            this.velocity = 0;
            this.previousVelocity.length = 0;
            this.previousTime = egret.getTimer();
            this.previousPosition = this.currentPosition = touchPoint;
            this.offsetPoint = scrollValue + touchPoint;
            egret.startTick(this.onTick, this);
        }

        /**
         * @private
         * 更新当前移动到的位置
         * @param touchPoint 当前触摸位置，以像素为单位，通常是stageX或stageY。
         */
        public update(touchPoint:number, maxScrollValue:number):void {
            maxScrollValue = Math.max(maxScrollValue, 0);
            this.currentPosition = touchPoint;
            this.maxScrollPos = maxScrollValue;
            var scrollPos = this.offsetPoint - touchPoint;
            if (scrollPos < 0) {
                scrollPos *= 0.5;
            }
            if (scrollPos > maxScrollValue) {
                scrollPos = (scrollPos + maxScrollValue) * 0.5
            }
            this.currentScrollPos = scrollPos;
            this.updateFunction.call(this.target, scrollPos);
        }

        /**
         * @private
         * 停止记录位移变化，并计算出目标值和继续缓动的时间。
         * @param currentScrollPos 容器当前的滚动值。
         * @param maxScrollPos 容器可以滚动的最大值。当目标值不在 0~maxValue之间时，将会应用更大的摩擦力，从而影响缓动时间的长度。
         */
        public finish(currentScrollPos:number, maxScrollPos:number):void {
            egret.stopTick(this.onTick, this);
            this.started = false;
            var sum = this.velocity * CURRENT_VELOCITY_WEIGHT;
            var previousVelocityX = this.previousVelocity;
            var length = previousVelocityX.length;
            var totalWeight = CURRENT_VELOCITY_WEIGHT;
            for (var i = 0; i < length; i++) {
                var weight = VELOCITY_WEIGHTS[i];
                sum += previousVelocityX[0] * weight;
                totalWeight += weight;
            }

            var pixelsPerMS = sum / totalWeight;
            var absPixelsPerMS = Math.abs(pixelsPerMS);
            var duration = 0;
            var posTo = 0;
            if (absPixelsPerMS > MINIMUM_VELOCITY) {
                posTo = currentScrollPos + (pixelsPerMS - MINIMUM_VELOCITY) / FRICTION_LOG * 2 * this.$scrollFactor;
                if (posTo < 0 || posTo > maxScrollPos) {
                    posTo = currentScrollPos;
                    while (Math.abs(pixelsPerMS) > MINIMUM_VELOCITY) {
                        posTo -= pixelsPerMS;
                        if (posTo < 0 || posTo > maxScrollPos) {
                            pixelsPerMS *= FRICTION * EXTRA_FRICTION;
                        }
                        else {
                            pixelsPerMS *= FRICTION;
                        }
                        duration++;
                    }
                }
                else {
                    duration = Math.log(MINIMUM_VELOCITY / absPixelsPerMS) / FRICTION_LOG;
                }
            }
            else {
                posTo = currentScrollPos;
            }
            if (this.target["$getThrowInfo"]) {
                var event:eui.ScrollerThrowEvent = this.target["$getThrowInfo"](currentScrollPos, posTo);
                posTo = event.toPos;
            }
            if (duration > 0) {
                this.throwTo(posTo, duration);
            }
            else {
                this.finishScrolling();
            }
        }

        /**
         * @private
         *
         * @param timeStamp
         * @returns
         */
        private onTick(timeStamp:number):boolean {
            var timeOffset = timeStamp - this.previousTime;
            if (timeOffset > 10) {
                var previousVelocity = this.previousVelocity;
                if (previousVelocity.length >= MAX_VELOCITY_COUNT) {
                    previousVelocity.shift();
                }
                this.velocity = (this.currentPosition - this.previousPosition) / timeOffset;
                previousVelocity.push(this.velocity);
                this.previousTime = timeStamp;
                this.previousPosition = this.currentPosition;
            }
            return true;
        }

        /**
         * @private
         *
         * @param animation
         */
        private finishScrolling(animation?:Animation):void {
            var hsp = this.currentScrollPos;
            var maxHsp = this.maxScrollPos;
            var hspTo = hsp;
            if (hsp < 0) {
                hspTo = 0;
            }
            if (hsp > maxHsp) {
                hspTo = maxHsp;
            }
            this.throwTo(hspTo, 300);
        }

        /**
         * @private
         * 缓动到水平滚动位置
         */
        private throwTo(hspTo:number, duration:number = 500):void {
            var hsp = this.currentScrollPos;
            if (hsp == hspTo) {
                this.endFunction.call(this.target);
                return;
            }
            var animation = this.animation;
            animation.duration = duration;
            animation.from = hsp;
            animation.to = hspTo;
            animation.play();
        }

        /**
         * @private
         * 更新水平滚动位置
         */
        private onScrollingUpdate(animation:Animation):void {
            this.currentScrollPos = animation.currentValue;
            this.updateFunction.call(this.target, animation.currentValue);
        }
    }
}