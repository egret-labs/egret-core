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
        protected _keyFrameCount: number;
        protected _frameCount: number;
        protected _position: number;
        protected _duration: number;
        protected _clipDutation: number;
        protected _timeScale: number;
        protected _timeOffset: number;
        protected _timeToFrameSccale: number;
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
            this._isCompleted = false;
            this._currentPlayTimes = 0;
            this._currentTime = 0;
            this._timeline = null;

            this._isReverse = false;
            this._hasAsynchronyTimeline = false;
            this._keyFrameCount = 0;
            this._frameCount = 0;
            this._position = 0;
            this._duration = 0;
            this._clipDutation = 0;
            this._timeScale = 1;
            this._timeOffset = 0;
            this._timeToFrameSccale = 0;
            this._currentFrame = null;
            this._armature = null;
            this._animationState = null;
        }

        protected _onFadeIn(): void { }
        protected _onUpdateFrame(isUpdate: boolean): void { }
        protected _onArriveAtFrame(isUpdate: boolean): void { }

        protected _onCrossFrame(frame: T): void {
            const actions = frame.actions;
            for (let i = 0, l = actions.length; i < l; ++i) {
                const actionData = actions[i];
                if (actionData.slot) {
                    const slot = this._armature.getSlot(actionData.slot.name);
                    if (slot) {
                        const childArmature = slot.childArmature;
                        if (childArmature) {
                            childArmature._action = actionData;
                        }
                    }
                } else if (actionData.bone) {
                    const slots = this._armature.getSlots();
                    for (let i = 0, l = slots.length; i < l; ++i) {
                        const eachChildArmature = slots[i].childArmature;
                        if (eachChildArmature) {
                            eachChildArmature._action = actionData;
                        }
                    }
                } else {
                    this._armature._action = actionData;
                }
            }

            const eventDispatcher = this._armature._display;
            const events = frame.events;
            for (let i = 0, l = events.length; i < l; ++i) {
                const eventData = events[i];

                let eventType = "";
                switch (eventData.type) {
                    case EventType.Frame:
                        eventType = EventObject.FRAME_EVENT;
                        break;

                    case EventType.Sound:
                        eventType = EventObject.SOUND_EVENT;
                        break;
                }

                if (eventDispatcher.hasEvent(eventType)) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.animationState = this._animationState;

                    if (eventData.bone) {
                        eventObject.bone = this._armature.getBone(eventData.bone.name);
                    }

                    if (eventData.slot) {
                        eventObject.slot = this._armature.getSlot(eventData.slot.name);
                    }

                    eventObject.name = eventData.name;
                    eventObject.data = eventData.data;

                    this._armature._bufferEvent(eventObject, eventType);
                }
            }
        }

        protected _setCurrentTime(value: number): boolean {
            let currentPlayTimes = 0;

            if (this._hasAsynchronyTimeline) {
                const playTimes = this._animationState.playTimes;
                const totalTimes = playTimes * this._duration;

                value *= this._timeScale;
                if (this._timeOffset != 0) {
                    value += this._timeOffset * this._clipDutation;
                }

                if (playTimes > 0 && (value >= totalTimes || value <= -totalTimes)) {
                    this._isCompleted = true;
                    currentPlayTimes = playTimes;

                    if (value < 0) {
                        value = 0;
                    } else {
                        value = this._duration;
                    }
                } else {
                    this._isCompleted = false;

                    if (value < 0) {
                        currentPlayTimes = Math.floor(-value / this._duration);
                        value = this._duration - (-value % this._duration);
                    } else {
                        currentPlayTimes = Math.floor(value / this._duration);
                        value %= this._duration;
                    }

                    if (playTimes > 0 && currentPlayTimes > playTimes) {
                        currentPlayTimes = playTimes;
                    }
                }

                value += this._position;
            } else {
                this._isCompleted = this._animationState._timeline._isCompleted;
                currentPlayTimes = this._animationState._timeline._currentPlayTimes;
            }

            if (this._currentTime == value) {
                return false;
            }

            if (this._keyFrameCount == 1 && value > this._position && <any>this != this._animationState._timeline) {
                this._isCompleted = true;
            }

            this._isReverse = this._currentTime > value && this._currentPlayTimes == currentPlayTimes;
            this._currentTime = value;
            this._currentPlayTimes = currentPlayTimes;

            return true;
        }

        public setCurrentTime(value: number): void {
            this._setCurrentTime(value);

            switch (this._keyFrameCount) {
                case 0:
                    break;

                case 1:
                    this._currentFrame = this._timeline.frames[0];
                    this._onArriveAtFrame(false);
                    this._onUpdateFrame(false);
                    break;

                default:
                    this._currentFrame = this._timeline.frames[Math.floor(this._currentTime * this._timeToFrameSccale)];
                    this._onArriveAtFrame(false);
                    this._onUpdateFrame(false);
                    break;
            }

            this._currentFrame = null;
        }

        public fadeIn(armature: Armature, animationState: AnimationState, timelineData: M, time: number): void {
            this._armature = armature;
            this._animationState = animationState;
            this._timeline = timelineData;

            const isMainTimeline = <any>this == this._animationState._timeline;

            this._hasAsynchronyTimeline = isMainTimeline || this._animationState.clip.hasAsynchronyTimeline;
            this._keyFrameCount = this._timeline.frames.length;
            this._frameCount = this._animationState.clip.frameCount;
            this._position = this._animationState._position;
            this._duration = this._animationState._duration;
            this._clipDutation = this._animationState._clipDutation;
            this._timeScale = isMainTimeline ? 1 : (1 / this._timeline.scale);
            this._timeOffset = isMainTimeline ? 0 : this._timeline.offset;
            this._timeToFrameSccale = this._frameCount / this._clipDutation;

            this._onFadeIn();

            this.setCurrentTime(time);
        }

        public fadeOut(): void {
        }

        public update(time: number): void {
            const prevTime = this._currentTime;

            if (!this._isCompleted && this._setCurrentTime(time) && this._keyFrameCount) {
                const currentFrameIndex = this._keyFrameCount > 1 ? Math.floor(this._currentTime * this._timeToFrameSccale) : 0;
                const currentFrame = this._timeline.frames[currentFrameIndex];
                if (this._currentFrame != currentFrame) {
                    if (this._keyFrameCount > 1) {
                        let crossedFrame = this._currentFrame;
                        this._currentFrame = currentFrame;

                        if (this._isReverse) {
                            while (crossedFrame != currentFrame) {
                                if (!crossedFrame) {
                                    const prevFrameIndex = Math.floor(prevTime * this._timeToFrameSccale);
                                    crossedFrame = this._timeline.frames[prevFrameIndex];
                                }

                                this._onCrossFrame(crossedFrame);
                                crossedFrame = crossedFrame.prev;
                            }
                        } else {
                            while (crossedFrame != currentFrame) {
                                if (crossedFrame) {
                                    crossedFrame = crossedFrame.next;
                                } else {
                                    const prevFrameIndex = Math.floor(prevTime * this._timeToFrameSccale);
                                    crossedFrame = this._timeline.frames[prevFrameIndex];
                                }

                                this._onCrossFrame(crossedFrame);
                            }
                        }

                        this._onArriveAtFrame(true);
                    } else {
                        this._currentFrame = currentFrame;
                        this._onCrossFrame(this._currentFrame);
                        this._onArriveAtFrame(true);
                    }
                }

                this._onUpdateFrame(true);
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
            this._tweenEasing = this._currentFrame.tweenEasing;
            this._curve = this._currentFrame.curve;

            if (
                this._keyFrameCount == 1 ||
                (
                    this._currentFrame.next == this._timeline.frames[0] &&
                    (this._tweenEasing != DragonBones.NO_TWEEN || this._curve) &&
                    this._animationState.playTimes > 0 &&
                    this._animationState.currentPlayTimes == this._animationState.playTimes - 1
                )
            ) {
                this._tweenEasing = DragonBones.NO_TWEEN;
                this._curve = null;
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            if (this._tweenEasing != DragonBones.NO_TWEEN && this._currentFrame.duration > 0) {
                this._tweenProgress = (this._currentTime - this._currentFrame.position + this._position) / this._currentFrame.duration;
                if (this._tweenEasing != 0) {
                    this._tweenProgress = TweenTimelineState._getEasingValue(this._tweenProgress, this._tweenEasing);
                }
            } else if (this._curve) {
                this._tweenProgress = (this._currentTime - this._currentFrame.position + this._position) / this._currentFrame.duration;
                this._tweenProgress = TweenTimelineState._getCurveEasingValue(this._tweenProgress, this._curve);
            } else {
                this._tweenProgress = 0;
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