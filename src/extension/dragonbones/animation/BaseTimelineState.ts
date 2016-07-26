namespace dragonBones {
    /**
     * @private
     */
    export const enum TweenType {
        None = 0,
        Once = 1,
        Always = 2
    }
    /**
     * @private
     */
    export abstract class TimelineState<T extends FrameData<T>, M extends TimelineData<T>> extends BaseObject {
        public _isCompleted: boolean;
        public _currentPlayTimes: number;
        public _currentTime: number;
        public _timeline: M;

        protected _isReverse: boolean;
        protected _hasAsynchronyTimeline: boolean;
        protected _frameRate: number;
        protected _keyFrameCount: number;
        protected _frameCount: number;
        protected _position: number;
        protected _duration: number;
        protected _animationDutation: number;
        protected _timeScale: number;
        protected _timeOffset: number;
        protected _currentFrame: T;
        protected _armature: Armature;
        protected _animationState: AnimationState;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            const self = this;

            self._isCompleted = false;
            self._currentPlayTimes = 0;
            self._currentTime = 0;
            self._timeline = null;

            self._isReverse = false;
            self._hasAsynchronyTimeline = false;
            self._frameRate = 0;
            self._keyFrameCount = 0;
            self._frameCount = 0;
            self._position = 0;
            self._duration = 0;
            self._animationDutation = 0;
            self._timeScale = 1;
            self._timeOffset = 0;
            self._currentFrame = null;
            self._armature = null;
            self._animationState = null;
        }

        protected _onFadeIn(): void { }
        protected _onUpdateFrame(isUpdate: boolean): void { }
        protected _onArriveAtFrame(isUpdate: boolean): void { }
        protected _onCrossFrame(frame: T): void { }

        protected _setCurrentTime(value: number): boolean {
            const self = this;

            let currentPlayTimes = 0;

            if (self._hasAsynchronyTimeline) {
                const playTimes = self._animationState.playTimes;
                const totalTimes = playTimes * self._duration;

                value *= self._timeScale;
                if (self._timeOffset != 0) {
                    value += self._timeOffset * self._animationDutation;
                }

                if (playTimes > 0 && (value >= totalTimes || value <= -totalTimes)) {
                    self._isCompleted = true;
                    currentPlayTimes = playTimes;

                    if (value < 0) {
                        value = 0;
                    } else {
                        value = self._duration;
                    }
                } else {
                    self._isCompleted = false;

                    if (value < 0) {
                        currentPlayTimes = Math.floor(-value / self._duration);
                        value = self._duration - (-value % self._duration);
                    } else {
                        currentPlayTimes = Math.floor(value / self._duration);
                        value %= self._duration;
                    }

                    if (playTimes > 0 && currentPlayTimes > playTimes) {
                        currentPlayTimes = playTimes;
                    }
                }

                value += self._position;
            } else {
                self._isCompleted = self._animationState._timeline._isCompleted;
                currentPlayTimes = self._animationState._timeline._currentPlayTimes;
            }

            if (self._currentTime == value) {
                return false;
            }

            if (self._keyFrameCount == 1 && value > self._position && <any>this != self._animationState._timeline) {
                self._isCompleted = true;
            }

            self._isReverse = self._currentTime > value && self._currentPlayTimes == currentPlayTimes;
            self._currentTime = value;
            self._currentPlayTimes = currentPlayTimes;

            return true;
        }

        public setCurrentTime(value: number): void {
            const self = this;

            self._setCurrentTime(value);

            switch (self._keyFrameCount) {
                case 0:
                    break;

                case 1:
                    self._currentFrame = self._timeline.frames[0];
                    self._onArriveAtFrame(false);
                    self._onUpdateFrame(false);
                    break;

                default:
                    self._currentFrame = self._timeline.frames[Math.floor(self._currentTime * self._frameRate)];
                    self._onArriveAtFrame(false);
                    self._onUpdateFrame(false);
                    break;
            }

            self._currentFrame = null;
        }

        public fadeIn(armature: Armature, animationState: AnimationState, timelineData: M, time: number): void {
            const self = this;

            self._armature = armature;
            self._animationState = animationState;
            self._timeline = timelineData;

            const isMainTimeline = <any>this == self._animationState._timeline;

            self._hasAsynchronyTimeline = isMainTimeline || self._animationState.animationData.hasAsynchronyTimeline;
            self._frameRate = self._armature.armatureData.frameRate;
            self._keyFrameCount = self._timeline.frames.length;
            self._frameCount = self._animationState.animationData.frameCount;
            self._position = self._animationState._position;
            self._duration = self._animationState._duration;
            self._animationDutation = self._animationState.animationData.duration;
            self._timeScale = isMainTimeline ? 1 : (1 / self._timeline.scale);
            self._timeOffset = isMainTimeline ? 0 : self._timeline.offset;

            self._onFadeIn();

            self.setCurrentTime(time);
        }

        public fadeOut(): void { }

        public update(time: number): void {
            const self = this;

            const prevTime = self._currentTime;

            if (!self._isCompleted && self._setCurrentTime(time) && self._keyFrameCount) {
                const currentFrameIndex = self._keyFrameCount > 1 ? Math.floor(self._currentTime * self._frameRate) : 0;
                const currentFrame = self._timeline.frames[currentFrameIndex];
                if (self._currentFrame != currentFrame) {
                    if (self._keyFrameCount > 1) {
                        let crossedFrame = self._currentFrame;
                        self._currentFrame = currentFrame;

                        if (!crossedFrame) {
                            const prevFrameIndex = Math.floor(prevTime * self._frameRate);
                            crossedFrame = self._timeline.frames[prevFrameIndex];
                            if (!self._isReverse && prevTime <= crossedFrame.position) {
                                crossedFrame = crossedFrame.prev;
                            }
                        }

                        if (self._isReverse) {
                            while (crossedFrame != currentFrame) {
                                self._onCrossFrame(crossedFrame);
                                crossedFrame = crossedFrame.prev;
                            }
                        } else {
                            while (crossedFrame != currentFrame) {
                                crossedFrame = crossedFrame.next;
                                self._onCrossFrame(crossedFrame);
                            }
                        }

                        self._onArriveAtFrame(true);
                    } else {
                        self._currentFrame = currentFrame;
                        self._onCrossFrame(self._currentFrame);
                        self._onArriveAtFrame(true);
                    }
                }

                self._onUpdateFrame(true);
            }
        }
    }
    /**
     * @private
     */
    export abstract class TweenTimelineState<T extends TweenFrameData<T>, M extends TimelineData<T>> extends TimelineState<T, M> {
        public static _getEasingValue(progress: number, easing: number): number {
            let value = 1;
            if (easing > 2) {
                return progress;
            } else if (easing > 1) { // Ease in out.
                value = 0.5 * (1 - Math.cos(progress * Math.PI));
                easing -= 1;
            } else if (easing > 0) { // Ease out.
                value = 1 - Math.pow(1 - progress, 2);
            } else if (easing >= -1) { // Ease in.
                easing *= -1;
                value = Math.pow(progress, 2);
            } else if (easing >= -2) { // Ease out in.
                easing *= -1;
                value = Math.acos(1 - progress * 2) / Math.PI;
                easing -= 1;
            } else {
                return progress;
            }

            return (value - progress) * easing + progress;
        }

        public static _getCurveEasingValue(progress: number, sampling: Array<number>): number {
            let x = 0;
            let y = 0;
            for (let i = 0, l = sampling.length; i < l; i += 2) {
                x = sampling[i];
                y = sampling[i + 1];
                if (x >= progress) {
                    if (i == 0) {
                        return y * progress / x;
                    } else {
                        const xP = sampling[i - 2];
                        const yP = sampling[i - 1]; // i - 2 + 1
                        return yP + (y - yP) * (progress - xP) / (x - xP);
                    }
                }
            }

            return y + (1 - y) * (progress - x) / (1 - x);
        }

        protected _tweenProgress: number;
        protected _tweenEasing: number;
        protected _curve: Array<number>;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this._tweenProgress = 0;
            this._tweenEasing = DragonBones.NO_TWEEN;
            this._curve = null;
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            const self = this;
            
            self._tweenEasing = self._currentFrame.tweenEasing;
            self._curve = self._currentFrame.curve;

            if (
                self._keyFrameCount == 1 ||
                (
                    self._currentFrame.next == self._timeline.frames[0] &&
                    (self._tweenEasing != DragonBones.NO_TWEEN || self._curve) &&
                    self._animationState.playTimes > 0 &&
                    self._animationState.currentPlayTimes == self._animationState.playTimes - 1
                )
            ) {
                self._tweenEasing = DragonBones.NO_TWEEN;
                self._curve = null;
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            const self = this;

            if (self._tweenEasing != DragonBones.NO_TWEEN && self._currentFrame.duration > 0) {
                self._tweenProgress = (self._currentTime - self._currentFrame.position + self._position) / self._currentFrame.duration;
                if (self._tweenEasing != 0) {
                    self._tweenProgress = TweenTimelineState._getEasingValue(self._tweenProgress, self._tweenEasing);
                }
            } else if (self._curve) {
                self._tweenProgress = (self._currentTime - self._currentFrame.position + self._position) / self._currentFrame.duration;
                self._tweenProgress = TweenTimelineState._getCurveEasingValue(self._tweenProgress, self._curve);
            } else {
                self._tweenProgress = 0;
            }
        }

        protected _updateExtensionKeyFrame(current: ExtensionFrameData, next: ExtensionFrameData, result: ExtensionFrameData): number {
            let tweenType = TweenType.None;

            if (current.type == next.type) {
                for (let i = 0, l = current.tweens.length; i < l; ++i) {
                    const tweenDuration = next.tweens[i] - current.tweens[i];
                    result.tweens[i] = tweenDuration;

                    if (tweenDuration != 0) {
                        tweenType = TweenType.Always;
                    }
                }
            }

            if (tweenType == TweenType.None) {
                if (result.type != current.type) {
                    tweenType = TweenType.Once;
                    result.type = current.type;
                }

                if (result.tweens.length != current.tweens.length) {
                    tweenType = TweenType.Once;
                    result.tweens.length = current.tweens.length;
                }

                if (result.keys.length != current.keys.length) {
                    tweenType = TweenType.Once;
                    result.keys.length = current.keys.length;
                }

                for (let i = 0, l = current.keys.length; i < l; ++i) {
                    const key = current.keys[i];
                    if (result.keys[i] != key) {
                        tweenType = TweenType.Once;
                        result.keys[i] = key;
                    }
                }
            }

            return tweenType;
        }
    }
}