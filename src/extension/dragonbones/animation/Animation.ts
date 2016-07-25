namespace dragonBones {
    /**
     * @language zh_CN
     * 动画混合时，使用的淡出方式。
     * @see dragonBones.Animation#fadeIn()
     * @version DragonBones 4.5
     */
    export const enum AnimationFadeOutMode {
        /**
         * @language zh_CN
         * 不淡出动画。
         * @version DragonBones 4.5
         */
        None = 0,
        /**
        * @language zh_CN
         * 淡出同层的动画。
         * @version DragonBones 4.5
         */
        SameLayer = 1,
        /**
         * @language zh_CN
         * 淡出同组的动画。
         * @version DragonBones 4.5
         */
        SameGroup = 2,
        /**
         * @language zh_CN
         * 淡出同层并且同组的动画。
         * @version DragonBones 4.5
         */
        SameLayerAndGroup = 3,
        /**
         * @language zh_CN
         * 淡出所有动画。
         * @version DragonBones 4.5
         */
        All = 4
    }
    /**
     * @language zh_CN
     * 播放动画组件接口。 (Armature 和 WordClock 都实现了该接口)
     * 任何实现了此接口的实例都可以加到 WorldClock 时钟中，由时钟统一控制动画的播放。
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    export interface IAnimateble {
        /**
        * @language zh_CN
        * 更新一个指定的时间。
        * @param passedTime 前进的时间。 (以秒为单位)
        * @version DragonBones 3.0
        */
        advanceTime(passedTime: number): void;
    }
    /**
     * @language zh_CN
     * 动画控制器，用来播放动画数据，管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    export class Animation extends BaseObject {
        /**
         * @private
         */
        protected static _sortAnimationState(a: AnimationState, b: AnimationState): number {
            return a.layer > b.layer ? 1 : -1;
        }
        /**
         * @private
         */
        public static toString(): string {
            return "[Class dragonBones.Animation]";
        }

        /**
         * @language zh_CN
         * 动画的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        public timeScale: number;
        /**
         * @private Armature Slot
         */
        public _animationStateDirty: boolean;
        /**
         * @private Armature Slot
         */
        public _timelineStateDirty: boolean;
        /**
         * @private Factory
         */
        public _armature: Armature;
        /**
         * @private
         */
        protected _isPlaying: boolean;
        /**
         * @private
         */
        protected _time: number;
        /**
         * @private
         */
        protected _lastAnimationState: AnimationState;
        /**
         * @private
         */
        protected _animations: Map<AnimationData> = {};
        /**
         * @private
         */
        protected _animationNames: Array<string> = [];
        /**
         * @private
         */
        protected _animationStates: Array<AnimationState> = [];
        /**
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            const self = this;

            self.timeScale = 1;

            self._animationStateDirty = false;
            self._timelineStateDirty = false;
            self._armature = null;

            self._isPlaying = false;
            self._time = 0;
            self._lastAnimationState = null;

            for (let i in self._animations) {
                delete self._animations[i];
            }

            if (self._animationNames.length) {
                self._animationNames.length = 0;
            }

            for (let i = 0, l = self._animationStates.length; i < l; ++i) {
                self._animationStates[i].returnToPool();
            }

            self._animationStates.length = 0;
        }
        /**
         * @private
         */
        protected _fadeOut(fadeOutTime: number, layer: number, group: string, fadeOutMode: AnimationFadeOutMode, pauseFadeOut: boolean): void {
            const self = this;

            let i = 0, l = self._animationStates.length;
            let animationState: AnimationState = null;

            switch (fadeOutMode) {
                case AnimationFadeOutMode.None:
                    break;

                case AnimationFadeOutMode.SameLayer:
                    for (; i < l; ++i) {
                        animationState = self._animationStates[i];
                        if (animationState.layer == layer) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;

                case AnimationFadeOutMode.SameGroup:
                    for (; i < l; ++i) {
                        animationState = self._animationStates[i];
                        if (animationState.group == group) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;

                case AnimationFadeOutMode.All:
                    for (; i < l; ++i) {
                        animationState = self._animationStates[i];
                        animationState.fadeOut(fadeOutTime, pauseFadeOut);
                    }
                    break;

                case AnimationFadeOutMode.SameLayerAndGroup:
                    for (; i < l; ++i) {
                        animationState = self._animationStates[i];
                        if (animationState.layer == layer && animationState.group == group) {
                            animationState.fadeOut(fadeOutTime, pauseFadeOut);
                        }
                    }
                    break;
            }
        }
        /**
         * @private
         */
        public _updateFFDTimelineStates(): void {
            const self = this;

            for (let i = 0, l = self._animationStates.length; i < l; ++i) {
                self._animationStates[i]._updateFFDTimelineStates();
            }
        }
        /**
         * @private
         */
        public _advanceTime(passedTime: number): void {
            const self = this;

            if (!self._isPlaying) {
                return;
            }

            if (passedTime < 0) {
                passedTime = -passedTime;
            }

            const animationStateCount = self._animationStates.length;
            if (animationStateCount == 1) {
                const animationState = self._animationStates[0];
                if (animationState._isFadeOutComplete) {
                    animationState.returnToPool();
                    self._animationStates.length = 0;
                    self._animationStateDirty = true;
                    self._lastAnimationState = null;
                } else {
                    if (self._timelineStateDirty) {
                        animationState._updateTimelineStates();
                    }

                    animationState._advanceTime(passedTime, 1, 0);
                }
            } else if (animationStateCount > 1) {
                let prevLayer = self._animationStates[0]._layer;
                let weightLeft = 1;
                let layerTotalWeight = 0;
                let layerIndex = 1;

                for (let i = 0, r = 0; i < animationStateCount; ++i) {
                    const animationState = self._animationStates[i];
                    if (animationState._isFadeOutComplete) {
                        r++;
                        animationState.returnToPool();

                        if (self._lastAnimationState == animationState) {
                            if (i - r >= 0) {
                                self._lastAnimationState = self._animationStates[i - r];
                            } else {
                                self._lastAnimationState = null;
                            }
                        }
                    } else {
                        if (r > 0) {
                            self._animationStates[i - r] = animationState;
                        }

                        if (prevLayer != animationState._layer) {
                            prevLayer = animationState._layer;

                            if (layerTotalWeight >= weightLeft) {
                                weightLeft = 0;
                            } else {
                                weightLeft -= layerTotalWeight;
                            }

                            layerTotalWeight = 0;
                        }

                        if (self._timelineStateDirty) {
                            animationState._updateTimelineStates();
                        }

                        animationState._advanceTime(passedTime, weightLeft, layerIndex);

                        if (animationState._weightResult != 0) {
                            layerTotalWeight += animationState._weightResult;
                            layerIndex++;
                        }
                    }

                    if (i == animationStateCount - 1 && r > 0) {
                        self._animationStates.length -= r;
                    }
                }
            }

            self._timelineStateDirty = false;
        }
        /**
         * @language zh_CN
         * 清除所有正在播放的动画状态。
         * @version DragonBones 4.5
         */
        public reset(): void {
            const self = this;

            self._isPlaying = false;
            self._lastAnimationState = null;

            for (let i = 0, l = self._animationStates.length; i < l; ++i) {
                self._animationStates[i].returnToPool();
            }

            self._animationStates.length = 0;
        }
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @param animationName 动画状态的名称，如果未设置，则暂停所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public stop(animationName: string = null): void {
            if (animationName) {
                const animationState = this.getState(animationName);
                if (animationState) {
                    animationState.stop();
                }
            } else {
                this._isPlaying = false;
            }
        }
        /**
         * @language zh_CN
         * 播放动画。
         * @param animationName 动画数据的名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。 
         * @param playTimes 动画需要播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public play(animationName: string = null, playTimes: number = -1): AnimationState {
            const self = this;

            let animationState: AnimationState = null;
            if (animationName) {
                animationState = self.fadeIn(animationName, 0, playTimes, 0, null, AnimationFadeOutMode.All);
            } else if (!self._lastAnimationState) {
                const defaultAnimation = self._armature.armatureData.defaultAnimation;
                if (defaultAnimation) {
                    animationState = self.fadeIn(defaultAnimation.name, 0, playTimes, 0, null, AnimationFadeOutMode.All);
                }
            } else if (!self._isPlaying) {
                self._isPlaying = true;
            } else {
                animationState = self.fadeIn(self._lastAnimationState.name, 0, playTimes, 0, null, AnimationFadeOutMode.All);
            }

            return animationState;
        }
        /**
         * @language zh_CN
         * 淡入播放指定名称的动画。
         * @param animationName 动画数据的名称。
         * @param playTimes 循环播放的次数。 [-1: 使用数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param fadeInTime 淡入的时间。 [-1: 使用数据默认值, [0~N]: N 秒淡入完毕] (以秒为单位)
         * @param layer 混合的图层，图层高会优先获取混合权重。
         * @param group 混合的组，用于给动画状态编组，方便混合淡出控制。
         * @param fadeOutMode 淡出的模式。
         * @param additiveBlending 以叠加的形式混合。
         * @param displayControl 是否对显示对象属性可控。
         * @param pauseFadeOut 暂停需要淡出的动画。
         * @param pauseFadeIn 暂停需要淡入的动画，直到淡入结束才开始播放。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationFadeOutMode
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public fadeIn(
            animationName: string, fadeInTime: number = -1, playTimes: number = -1,
            layer: number = 0, group: string = null, fadeOutMode: AnimationFadeOutMode = AnimationFadeOutMode.SameLayerAndGroup,
            additiveBlending: boolean = false, displayControl: boolean = true,
            pauseFadeOut: boolean = true, pauseFadeIn: boolean = true
        ): AnimationState {
            const self = this;

            const clipData = self._animations[animationName];
            if (!clipData) {
                self._time = 0;
                console.warn("No animation.", " Armature: " + self._armature.name, " Animation: " + animationName);
                return null;
            }

            self._isPlaying = true;

            if (fadeInTime != fadeInTime || fadeInTime < 0) {
                if (self._lastAnimationState) {
                    fadeInTime = clipData.fadeInTime;
                } else {
                    fadeInTime = 0;
                }
            }

            if (playTimes < 0) {
                playTimes = clipData.playTimes;
            }

            self._fadeOut(fadeInTime, layer, group, fadeOutMode, pauseFadeOut);

            self._lastAnimationState = BaseObject.borrowObject(AnimationState);
            self._lastAnimationState._layer = layer;
            self._lastAnimationState._group = group;
            self._lastAnimationState.additiveBlending = additiveBlending;
            self._lastAnimationState.displayControl = displayControl;
            self._lastAnimationState._fadeIn(
                self._armature, clipData.animation || clipData, animationName,
                playTimes, clipData.position, clipData.duration, self._time, 1 / clipData.scale, fadeInTime,
                pauseFadeIn
            );
            self._animationStates.push(self._lastAnimationState);
            self._animationStateDirty = true;
            self._time = 0;

            if (self._animationStates.length > 1) {
                self._animationStates.sort(Animation._sortAnimationState);
            }

            const slots = self._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                if (slot.inheritAnimation) {
                    const childArmature = slot.childArmature;
                    if (
                        childArmature &&
                        childArmature.animation.hasAnimation(animationName) &&
                        !childArmature.animation.getState(animationName)
                    ) {
                        childArmature.animation.fadeIn(animationName);
                    }
                }
            }

            self._armature.advanceTime(0);

            return self._lastAnimationState;
        }
        /**
         * @language zh_CN
         * 指定名称的动画从指定时间开始播放。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @param playTimes 动画循环播放的次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndPlayByTime(animationName: string, time: number = 0, playTimes: number = -1): AnimationState {
            this._time = time;

            return this.fadeIn(animationName, 0, playTimes, 0, null, AnimationFadeOutMode.All);
        }
        /**
         * @language zh_CN
         * 指定名称的动画从指定帧开始播放。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @param playTimes 动画循环播放的次数。[-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndPlayByFrame(animationName: string, frame: number = 0, playTimes: number = -1): AnimationState {
            const clipData = this._animations[animationName];
            if (clipData) {
                this._time = clipData.duration * frame / clipData.frameCount;
            }

            return this.fadeIn(animationName, 0, playTimes, 0, null, AnimationFadeOutMode.All);
        }
        /**
         * @language zh_CN
         * 指定名称的动画从指定进度开始播放。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @param playTimes 动画循环播放的次数。[-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndPlayByProgress(animationName: string, progress: number = 0, playTimes: number = -1): AnimationState {
            const clipData = this._animations[animationName];
            if (clipData) {
                this._time = clipData.duration * Math.max(progress, 0);
            }

            return this.fadeIn(animationName, 0, playTimes, 0, null, AnimationFadeOutMode.All);
        }
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的时间并停止。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndStopByTime(animationName: string, time: number = 0): AnimationState {
            const animationState = this.gotoAndPlayByTime(animationName, time, 1);
            if (animationState) {
                this._isPlaying = false;
                animationState.stop();
            }

            return animationState;
        }
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的帧并停止。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndStopByFrame(animationName: string, frame: number = 0): AnimationState {
            const animationState = this.gotoAndPlayByFrame(animationName, frame, 1);
            if (animationState) {
                this._isPlaying = false;
                animationState.stop();
            }

            return animationState;
        }
        /**
         * @language zh_CN
         * 播放指定名称的动画到指定的进度并停止。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @returns 返回控制这个动画数据的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        public gotoAndStopByProgress(animationName: string, progress: number = 0): AnimationState {
            const animationState = this.gotoAndPlayByProgress(animationName, progress, 1);
            if (animationState) {
                this._isPlaying = false;
                animationState.stop();
            }

            return animationState;
        }
        /**
         * @language zh_CN
         * 获取指定名称的动画状态。
         * @param animationName 动画状态的名称。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public getState(animationName: string): AnimationState {
            for (let i = 0, l = this._animationStates.length; i < l; ++i) {
                const animationState = this._animationStates[i];
                if (animationState.name == animationName) {
                    return animationState;
                }
            }

            return null;
        }
        /**
         * @language zh_CN
         * 是否包含指定名称的动画数据。
         * @param animationName 动画数据的名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        public hasAnimation(animationName: string): boolean {
            return this._animations[animationName] != null;
        }
        /**
         * @language zh_CN
         * 动画是否处于播放状态。
         * @version DragonBones 3.0
         */
        public get isPlaying(): boolean {
            return this._isPlaying;
        }
        /**
         * @language zh_CN
         * 所有动画状态是否均已播放完毕。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public get isCompleted(): boolean {
            const self = this;

            if (self._lastAnimationState) {
                if (!self._lastAnimationState.isCompleted) {
                    return false;
                }

                for (let i = 0, l = self._animationStates.length; i < l; ++i) {
                    if (!self._animationStates[i].isCompleted) {
                        return false;
                    }
                }
            }

            return true;
        }
        /**
         * @language zh_CN
         * 上一个正在播放的动画状态的名称。
         * @see #lastAnimationState
         * @version DragonBones 3.0
         */
        public get lastAnimationName(): string {
            return this._lastAnimationState ? this._lastAnimationState.name : null;
        }
        /**
         * @language zh_CN
         * 上一个正在播放的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        public get lastAnimationState(): AnimationState {
            return this._lastAnimationState;
        }
        /**
         * @language zh_CN
         * 所有动画数据名称。
         * @see #animations
         * @version DragonBones 4.5
         */
        public get animationNames(): Array<string> {
            return this._animationNames;
        }
        /**
         * @language zh_CN
         * 所有的动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         */
        public get animations(): Map<AnimationData> {
            return this._animations;
        }
        public set animations(value: Map<AnimationData>) {
            const self = this;

            if (self._animations == value) {
                return;
            }

            for (let i in self._animations) {
                delete self._animations[i];
            }

            self._animationNames.length = 0;

            if (value) {
                for (let i in value) {
                    self._animations[i] = value[i];
                    self._animationNames.push(i);
                }
            }
        }

        /**
         * @deprecated
         * @see #play()
         * @see #fadeIn()
         * @see #gotoAndPlayByTime()
         * @see #gotoAndPlayByFrame()
         * @see #gotoAndPlayByProgress()
         */
        public gotoAndPlay(
            animationName: string, fadeInTime: number = -1, duration: number = -1, playTimes: number = -1,
            layer: number = 0, group: string = null, fadeOutMode: AnimationFadeOutMode = AnimationFadeOutMode.SameLayerAndGroup,
            pauseFadeOut: boolean = true, pauseFadeIn: boolean = true
        ): AnimationState {
            const animationState = this.fadeIn(animationName, fadeInTime, playTimes, layer, group, fadeOutMode, false, true, pauseFadeOut, pauseFadeIn);
            if (animationState && duration && duration > 0) {
                animationState.timeScale = animationState.totalTime / duration;
            }

            return animationState;
        }
        /**
         * @deprecated
         * @see #gotoAndStopByTime()
         * @see #gotoAndStopByFrame()
         * @see #gotoAndStopByProgress()
         */
        public gotoAndStop(animationName: string, time: number = 0): AnimationState {
            return this.gotoAndStopByTime(animationName, time);
        }
        /**
         * @deprecated
         * @see #animationNames
         * @see #animations
         */
        public get animationList(): Array<string> {
            return this._animationNames;
        }
        /**
         * @language zh_CN
         * @deprecated
         * @see #animationNames
         * @see #animations
         */
        public get animationDataList(): Array<AnimationData> {
            const list: AnimationData[] = [];
            for (let i = 0, l = this._animationNames.length; i < l; ++i) {
                list.push(this._animations[this._animationNames[i]]);
            }

            return list;
        }
    }
}