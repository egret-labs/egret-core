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


module dragonBones {
    /** @private */
    export class FFDTimelineState {
        private static _pool: Array<FFDTimelineState> = [];
		
        /** @private */
        public static _borrowObject(): FFDTimelineState {
            if (FFDTimelineState._pool.length == 0) {
                return new FFDTimelineState();
            }
            return FFDTimelineState._pool.pop();
        }
		
        /** @private */
        public static _returnObject(timeline: FFDTimelineState): void {
            if (FFDTimelineState._pool.indexOf(timeline) < 0) {
                FFDTimelineState._pool[FFDTimelineState._pool.length] = timeline;
            }

            timeline.clear();
        }
		
        /** @private */
        public static _clear(): void {
            var i: number = FFDTimelineState._pool.length;
            while (i--) {
                FFDTimelineState._pool[i].clear();
            }
            FFDTimelineState._pool.length = 0;
        }
        
        /** @private */
        public skin: string = null;
        public name: string = null;
        public displayIndex:number = 0;
		
        public _isComplete: boolean = false;
        public _animationState: AnimationState = null;

        private _totalTime: number = 0;
        private _currentTime: number = 0;
        private _currentFrameIndex: number = 0;
        private _currentFramePosition: number = 0;
        private _currentFrameDuration: number = 0;

        private _tweenEasing: number = NaN;
        private _tweenCurve: CurveData = null;
        private _tweenVertices: boolean = false;
        private _offset: number = 0;
        private _durationVertices: Array<number> = [];
        private _updateVertices: Array<number> = [];
        private _rawAnimationScale: number = 1;

        private _updateMode: number = 0;
        
        private _slot: Slot = null;

        private _timelineData: FFDTimeline = null;
        
        public constructor() {
        }

        private clear(): void {
            this._slot = null;
            this._animationState = null;
            this._timelineData = null;
        }
		
        //动画开始结束
        /** @private */
        public _fadeIn(slot: Slot, animationState: AnimationState, timelineData: FFDTimeline): void {
            this._slot = slot;
            this._animationState = animationState;
            this._timelineData = timelineData;

            this.name = timelineData.name;
            this.skin = timelineData.skin;
            this.displayIndex = timelineData.displayIndex;

            this._totalTime = this._timelineData.duration;
            this._rawAnimationScale = this._animationState.clip.scale;

            this._isComplete = false;
            this._currentFrameIndex = -1;
            this._currentTime = -1;
            this._tweenEasing = NaN;

            switch (this._timelineData.frameList.length) {
                case 0:
                    this._updateMode = 0;
                    break;

                case 1:
                    this._updateMode = 1;
                    break;

                default:
                    this._updateMode = -1;
                    break;
            }
        }
		
        /** @private */
        public _fadeOut(): void {
        }
		
        //动画进行中
		
        /** @private */
        public _update(progress: number): void {
            if (this._updateMode == -1) {
                this.updateMultipleFrame(progress);
            }
            else if (this._updateMode == 1) {
                this._updateMode = 0;
                this.updateSingleFrame();
            }
        }

        private updateMultipleFrame(progress: number): void {
            var currentPlayTimes: number = 0;
            progress /= this._timelineData.scale;
            progress += this._timelineData.offset;

            var currentTime: number = this._totalTime * progress;
            var playTimes: number = this._animationState.playTimes;
            if (playTimes == 0) {
                this._isComplete = false;
                currentPlayTimes = Math.ceil(Math.abs(currentTime) / this._totalTime) || 1;
                if (currentTime >= 0) {
                    currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                }
                else {
                    currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                }

                if (currentTime < 0) {
                    currentTime += this._totalTime;
                }
            }
            else {
                var totalTimes: number = playTimes * this._totalTime;
                if (currentTime >= totalTimes) {
                    currentTime = totalTimes;
                    this._isComplete = true;
                }
                else if (currentTime <= -totalTimes) {
                    currentTime = -totalTimes;
                    this._isComplete = true;
                }
                else {
                    this._isComplete = false;
                }

                if (currentTime < 0) {
                    currentTime += totalTimes;
                }

                currentPlayTimes = Math.ceil(currentTime / this._totalTime) || 1;
                if (this._isComplete) {
                    currentTime = this._totalTime;
                }
                else {
                    if (currentTime >= 0) {
                        currentTime -= Math.floor(currentTime / this._totalTime) * this._totalTime;
                    }
                    else {
                        currentTime -= Math.ceil(currentTime / this._totalTime) * this._totalTime;
                    }
                }
            }

            if (this._currentTime != currentTime) {
                this._currentTime = currentTime;

                var frameList: Array<Frame> = this._timelineData.frameList;
                var prevFrame: SlotFrame;
                var currentFrame: SlotFrame;

                for (var i: number = 0, l: number = this._timelineData.frameList.length; i < l; ++i) {
                    if (this._currentFrameIndex < 0) {
                        this._currentFrameIndex = 0;
                    }
                    else if (this._currentTime < this._currentFramePosition || this._currentTime >= this._currentFramePosition + this._currentFrameDuration) {
                        this._currentFrameIndex++;
                        if (this._currentFrameIndex >= frameList.length) {
                            if (this._isComplete) {
                                this._currentFrameIndex--;
                                break;
                            }
                            else {
                                this._currentFrameIndex = 0;
                            }
                        }
                    }
                    else {
                        break;
                    }
                    currentFrame = <SlotFrame><any>(frameList[this._currentFrameIndex]);

                    this._currentFrameDuration = currentFrame.duration;
                    this._currentFramePosition = currentFrame.position;
                    prevFrame = currentFrame;
                }

                if (currentFrame) {
                    this.updateToNextFrame(currentPlayTimes);
                }

                if (this._tweenEasing == this._tweenEasing) {
                    this.updateTween();
                }
            }
        }

        private updateToNextFrame(currentPlayTimes: number = 0): void {
            var nextFrameIndex: number = this._currentFrameIndex + 1;
            if (nextFrameIndex >= this._timelineData.frameList.length) {
                nextFrameIndex = 0;
            }
            var currentFrame: FFDFrame = <FFDFrame><any>(this._timelineData.frameList[this._currentFrameIndex]);
            var nextFrame: FFDFrame = <FFDFrame><any>(this._timelineData.frameList[nextFrameIndex]);
            var tweenEnabled: boolean = false;
            if (
                nextFrameIndex == 0 &&
                (
                    !this._animationState.lastFrameAutoTween ||
                    (
                        this._animationState.playTimes &&
                        this._animationState.currentPlayTimes >= this._animationState.playTimes &&
                        ((this._currentFramePosition + this._currentFrameDuration) / this._totalTime + currentPlayTimes - this._timelineData.offset) * this._timelineData.scale > 0.999999
                    )
                )
            ) {
                this._tweenEasing = NaN;
                tweenEnabled = false;
            }
            else if (this._animationState.autoTween) {
                this._tweenEasing = this._animationState.clip.tweenEasing;
                if (isNaN(this._tweenEasing)) {
                    this._tweenEasing = currentFrame.tweenEasing;
                    this._tweenCurve = currentFrame.curve;
                    if (isNaN(this._tweenEasing) && this._tweenCurve == null)    //frame no tween
                    {
                        tweenEnabled = false;
                    }
                    else {
                        if (this._tweenEasing == 10) {
                            this._tweenEasing = 0;
                        }
                        //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                        tweenEnabled = true;
                    }
                }
                else    //animationData overwrite tween
                {
                    //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                    tweenEnabled = true;
                }
            }
            else {
                this._tweenEasing = currentFrame.tweenEasing;
                this._tweenCurve = currentFrame.curve;
                if ((isNaN(this._tweenEasing) || this._tweenEasing == 10) && this._tweenCurve == null)  //frame no tween
                {
                    this._tweenEasing = NaN;
                    tweenEnabled = false;
                }
                else {
                    //_tweenEasing [-1, 0) 0 (0, 1] (1, 2]
                    tweenEnabled = true;
                }
            }

            if (tweenEnabled) {
                this._offset = currentFrame.offset < nextFrame.offset ? currentFrame.offset : nextFrame.offset;
                var end = currentFrame.offset + currentFrame.vertices.length > nextFrame.offset + nextFrame.vertices.length ?
                    currentFrame.offset + currentFrame.vertices.length :
                    nextFrame.offset + nextFrame.vertices.length;
                this._durationVertices.length = end - this._offset;

                var curVertex: number;
                var nextVertex: number;
                this._tweenVertices = false;
                for (var i = this._offset; i < end; i++) {
                    curVertex = 0;
                    nextVertex = 0;
                    if (currentFrame.offset <= i && currentFrame.vertices.length + currentFrame.offset > i) {
                        curVertex = Number(currentFrame.vertices[i - currentFrame.offset]);
                    }
                    if (nextFrame.offset <= i && nextFrame.vertices.length + nextFrame.offset > i) {
                        nextVertex = Number(nextFrame.vertices[i - nextFrame.offset]);
                    }
                    this._durationVertices[i - this._offset] = nextVertex - curVertex;

                    if (this._durationVertices[i - this._offset] != 0) {
                        this._tweenVertices = true;
                    }
                }
            }
            else {
                this._tweenVertices = false;
                this._slot._updateFFD(currentFrame.vertices, currentFrame.offset);
            }
        }

        private updateTween(): void {
            var currentFrame = this._timelineData.frameList[this._currentFrameIndex] as FFDFrame;
            if (this._tweenVertices && this._animationState.displayControl) {
                var progress: number = (this._currentTime - this._currentFramePosition) / this._currentFrameDuration;
                if (this._tweenCurve != null) {
                    progress = this._tweenCurve.getValueByProgress(progress);
                }
                if (this._tweenEasing) {
                    progress = MathUtil.getEaseValue(progress, this._tweenEasing);
                }

                var end = this._offset + this._durationVertices.length;
                this._updateVertices.length = this._durationVertices.length;
                var curVertex: number;
                for (var i = this._offset; i < end; i++) {
                    curVertex = 0;
                    if (currentFrame.offset <= i && currentFrame.vertices.length + currentFrame.offset > i) {
                        curVertex = Number(currentFrame.vertices[i - currentFrame.offset]);
                    }
                    this._updateVertices[i - this._offset] = curVertex + this._durationVertices[i - this._offset] * progress;

                }
                this._slot._updateFFD(this._updateVertices, this._offset);
            }
        }

        private updateSingleFrame(): void {
            var currentFrame = this._timelineData.frameList[0] as FFDFrame;
            this._isComplete = true;
            this._tweenEasing = NaN;
            this._tweenVertices = false;

            if (this._animationState.displayControl) {
                this._slot._updateFFD(currentFrame.vertices, currentFrame.offset);
            }
        }


    }
}