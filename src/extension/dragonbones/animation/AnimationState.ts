namespace dragonBones {
    /**
     * @language zh_CN
     * 动画状态，播放动画时产生，可以对单个动画的播放进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    export class AnimationState extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[Class dragonBones.AnimationState]";
        }

        /**
         * @language zh_CN
         * 是否对插槽的颜色，显示序列索引，深度排序，行为等拥有控制的权限。
         * @see dragonBones.Slot#displayController
         * @version DragonBones 3.0
         */
        public displayControl: boolean;
        /**
         * @language zh_CN
         * 是否以叠加的方式混合动画。
         * @version DragonBones 3.0
         */
        public additiveBlending: boolean;
        /**
         * @language zh_CN
         * 需要播放的次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         */
        public playTimes: number;
        /**
         * @language zh_CN
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        public timeScale: number;
        /**
         * @language zh_CN
         * 进行动画混合时的权重。
         * @default 1
         * @version DragonBones 3.0
         */
        public weight: number;
        /**
         * @language zh_CN
         * 自动淡出时需要的时间，当设置一个大于等于 0 的值，动画状态将会在播放完成后自动淡出。 (以秒为单位)
         * @default -1
         * @version DragonBones 3.0
         */
        public autoFadeOutTime: number;
        /**
         * @private
         */
        public fadeTotalTime: number;
        /**
         * @private Animation
         */
        public _isFadeOutComplete: boolean;
        /**
         * @private Animation
         */
        public _layer: number;
        /**
         * @private TimelineState
         */
        public _position: number;
        /**
         * @private TimelineState
         */
        public _duration: number;
        /**
         * @private Animation, TimelineState
         */
        public _weightResult: number;
        /**
         * @private Animation, TimelineState
         */
        public _fadeProgress: number;
        /**
         * @private Animation TimelineState
         */
        public _group: string;
        /**
         * @private TimelineState
         */
        public _timeline: AnimationTimelineState;
        /**
         * @private
         */
        private _isPlaying: boolean;
        /**
         * @private
         */
        private _isPausePlayhead: boolean;
        /**
         * @private
         */
        private _isFadeOut: boolean;
        /**
         * @private
         */
        private _currentPlayTimes: number;
        /**
         * @private
         */
        private _fadeTime: number;
        /**
         * @private
         */
        private _time: number;
        /**
         * @private
         */
        private _name: string;
        /**
         * @private
         */
        private _armature: Armature;
        /**
         * @private
         */
        private _animationData: AnimationData;
        /**
         * @private
         */
        private _boneMask: Array<string> = [];
        /**
         * @private
         */
        private _boneTimelines: Array<BoneTimelineState> = [];
        /**
         * @private
         */
        private _slotTimelines: Array<SlotTimelineState> = [];
        /**
         * @private
         */
        private _ffdTimelines: Array<FFDTimelineState> = [];
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

            self.displayControl = true;
            self.additiveBlending = false;
            self.playTimes = 1;
            self.timeScale = 1;
            self.weight = 1;
            self.autoFadeOutTime = -1;
            self.fadeTotalTime = 0;

            self._isFadeOutComplete = false;
            self._layer = 0;
            self._position = 0;
            self._duration = 0;
            self._weightResult = 0;
            self._fadeProgress = 0;
            self._group = null;

            if (self._timeline) {
                self._timeline.returnToPool();
                self._timeline = null;
            }

            self._isPlaying = true;
            self._isPausePlayhead = false;
            self._isFadeOut = false;
            self._currentPlayTimes = 0;
            self._fadeTime = 0;
            self._time = 0;
            self._name = null;
            self._armature = null;
            self._animationData = null;

            if (self._boneMask.length) {
                self._boneMask.length = 0;
            }

            for (let i = 0, l = self._boneTimelines.length; i < l; ++i) {
                self._boneTimelines[i].returnToPool();
            }

            for (let i = 0, l = self._slotTimelines.length; i < l; ++i) {
                self._slotTimelines[i].returnToPool();
            }

            for (let i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                self._ffdTimelines[i].returnToPool();
            }

            self._boneTimelines.length = 0;
            self._slotTimelines.length = 0;
            self._ffdTimelines.length = 0;
        }
        /**
         * @private
         */
        private _advanceFadeTime(passedTime: number): void {
            const self = this;

            if (passedTime < 0) {
                passedTime = -passedTime;
            }

            self._fadeTime += passedTime;

            let fadeProgress = 0;
            if (self._fadeTime >= self.fadeTotalTime) { // Fade complete.
                fadeProgress = self._isFadeOut ? 0 : 1;
            } else if (self._fadeTime > 0) { // Fading.
                fadeProgress = self._isFadeOut ? (1 - self._fadeTime / self.fadeTotalTime) : (self._fadeTime / self.fadeTotalTime);
            } else { // Before fade.
                fadeProgress = self._isFadeOut ? 1 : 0;
            }

            if (self._fadeProgress != fadeProgress) {
                self._fadeProgress = fadeProgress;

                const eventDispatcher = self._armature._display;

                if (self._fadeTime <= passedTime) {
                    if (self._isFadeOut) {
                        if (eventDispatcher.hasEvent(EventObject.FADE_OUT)) {
                            const event = BaseObject.borrowObject(EventObject);
                            event.animationState = this;
                            self._armature._bufferEvent(event, EventObject.FADE_OUT);
                        }
                    } else {
                        if (eventDispatcher.hasEvent(EventObject.FADE_IN)) {
                            const event = BaseObject.borrowObject(EventObject);
                            event.animationState = this;
                            self._armature._bufferEvent(event, EventObject.FADE_IN);
                        }
                    }
                }

                if (self._fadeTime >= self.fadeTotalTime) {
                    if (self._isFadeOut) {
                        self._isFadeOutComplete = true;

                        if (eventDispatcher.hasEvent(EventObject.FADE_OUT_COMPLETE)) {
                            const event = BaseObject.borrowObject(EventObject);
                            event.animationState = this;
                            self._armature._bufferEvent(event, EventObject.FADE_OUT_COMPLETE);
                        }
                    } else {
                        self._isPausePlayhead = false;

                        if (eventDispatcher.hasEvent(EventObject.FADE_IN_COMPLETE)) {
                            const event = BaseObject.borrowObject(EventObject);
                            event.animationState = this;
                            self._armature._bufferEvent(event, EventObject.FADE_IN_COMPLETE);
                        }
                    }
                }
            }
        }
        /**
         * @private
         */
        public _isDisabled(slot: Slot): boolean {
            if (
                this.displayControl &&
                (
                    !slot.displayController ||
                    slot.displayController == this._name ||
                    slot.displayController == this._group
                )
            ) {
                return false;
            }

            return true;
        }
        /**
         * @private
         */
        public _fadeIn(
            armature: Armature, clip: AnimationData, animationName: string,
            playTimes: number, position: number, duration: number, time: number, timeScale: number, fadeInTime: number,
            pausePlayhead: boolean
        ): void {
            const self = this;

            self._armature = armature;
            self._animationData = clip;
            self._name = animationName;

            self.playTimes = playTimes;
            self.timeScale = timeScale;
            self.fadeTotalTime = fadeInTime;

            self._position = position;
            self._duration = duration;
            self._time = time;
            self._isPausePlayhead = pausePlayhead;
            if (self.fadeTotalTime == 0) {
                self._fadeProgress = 0.999999;
            }

            self._timeline = BaseObject.borrowObject(AnimationTimelineState);
            self._timeline.fadeIn(self._armature, self, self._animationData, self._time);

            self._updateTimelineStates();
        }
        /**
         * @private
         */
        public _updateTimelineStates(): void {
            const self = this;

            let time = self._time;
            if (!self._animationData.hasAsynchronyTimeline) {
                time = self._timeline._currentTime;
            }

            const boneTimelineStates: Map<BoneTimelineState> = {};
            const slotTimelineStates: Map<SlotTimelineState> = {};

            for (let i = 0, l = self._boneTimelines.length; i < l; ++i) {
                const boneTimelineState = self._boneTimelines[i];
                boneTimelineStates[boneTimelineState.bone.name] = boneTimelineState;
            }

            const bones = self._armature.getBones();
            for (let i = 0, l = bones.length; i < l; ++i) {
                const bone = bones[i];
                const boneTimelineName = bone.name;
                const boneTimelineData = self._animationData.getBoneTimeline(boneTimelineName);

                if (boneTimelineData && self.containsBoneMask(boneTimelineName)) {
                    let boneTimelineState = boneTimelineStates[boneTimelineName];
                    if (boneTimelineState) {
                        delete boneTimelineStates[boneTimelineName];
                    } else {
                        boneTimelineState = BaseObject.borrowObject(BoneTimelineState);
                        boneTimelineState.bone = bone;
                        boneTimelineState.fadeIn(self._armature, this, boneTimelineData, time);
                        self._boneTimelines.push(boneTimelineState);
                    }
                }
            }

            for (let i in boneTimelineStates) {
                const boneTimelineState = boneTimelineStates[i];
                boneTimelineState.bone.invalidUpdate();
                self._boneTimelines.splice(self._boneTimelines.indexOf(boneTimelineState), 1);
                boneTimelineState.returnToPool();
            }

            //
            for (let i = 0, l = self._slotTimelines.length; i < l; ++i) {
                const slotTimelineState = self._slotTimelines[i];
                slotTimelineStates[slotTimelineState.slot.name] = slotTimelineState;
            }

            const slots = self._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                const slotTimelineName = slot.name;
                const parentTimelineName = slot.parent.name;
                const slotTimelineData = self._animationData.getSlotTimeline(slotTimelineName);

                if (slotTimelineData && self.containsBoneMask(parentTimelineName) && !self._isFadeOut) {
                    let slotTimelineState = slotTimelineStates[slotTimelineName];
                    if (slotTimelineState) {
                        delete slotTimelineStates[slotTimelineName];
                    } else {
                        slotTimelineState = BaseObject.borrowObject(SlotTimelineState);
                        slotTimelineState.slot = slot;
                        slotTimelineState.fadeIn(self._armature, this, slotTimelineData, time);
                        self._slotTimelines.push(slotTimelineState);
                    }
                }
            }

            for (let i in slotTimelineStates) {
                const slotTimelineState = slotTimelineStates[i];
                self._slotTimelines.splice(self._slotTimelines.indexOf(slotTimelineState), 1);
                slotTimelineState.returnToPool();
            }

            self._updateFFDTimelineStates();
        }
        /**
         * @private
         */
        public _updateFFDTimelineStates(): void {
            const self = this;

            let time = self._time;
            if (!self._animationData.hasAsynchronyTimeline) {
                time = self._timeline._currentTime;
            }

            const ffdTimelineStates: Map<FFDTimelineState> = {};

            for (let i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                const ffdTimelineState = self._ffdTimelines[i];
                ffdTimelineStates[ffdTimelineState.slot.name] = ffdTimelineState;
            }

            const slots = self._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                const slotTimelineName = slot.name;
                const parentTimelineName = slot.parent.name;

                if (slot._meshData) {
                    const ffdTimelineData = self._animationData.getFFDTimeline(self._armature._skinData.name, slotTimelineName, slot.displayIndex);
                    if (ffdTimelineData && self.containsBoneMask(parentTimelineName)) { // && !_isFadeOut
                        let ffdTimelineState = ffdTimelineStates[slotTimelineName];
                        if (ffdTimelineState) {
                            delete ffdTimelineStates[slotTimelineName];
                        } else {
                            ffdTimelineState = BaseObject.borrowObject(FFDTimelineState);
                            ffdTimelineState.slot = slot;
                            ffdTimelineState.fadeIn(self._armature, this, ffdTimelineData, time);
                            self._ffdTimelines.push(ffdTimelineState);
                        }
                    } else {
                        for (let iF = 0, lF = slot._ffdVertices.length; iF < lF; ++iF) {
                            slot._ffdVertices[iF] = 0;
                        }

                        slot._ffdDirty = true;
                    }
                }
            }

            for (let i in ffdTimelineStates) {
                const ffdTimelineState = ffdTimelineStates[i];
                ffdTimelineState.slot._ffdDirty = true;
                self._ffdTimelines.splice(self._ffdTimelines.indexOf(ffdTimelineState), 1);
                ffdTimelineState.returnToPool();
            }
        }
        /**
         * @private
         */
        public _advanceTime(passedTime: number, weightLeft: number, index: number): void {
            const self = this;

            if (passedTime != 0) { // Fading.
                self._advanceFadeTime(passedTime);
            }

            // Update time.
            passedTime *= self.timeScale;
            if (passedTime != 0 && self._isPlaying && !self._isPausePlayhead) {
                self._time += passedTime;
            }

            // Blend weight.
            self._weightResult = self.weight * self._fadeProgress * weightLeft;

            if (self._weightResult != 0) {
                const isCacheEnabled = self._fadeProgress >= 1 && index == 0 && self._armature.cacheFrameRate > 0;
                const cacheTimeToFrameScale = self._animationData.cacheTimeToFrameScale;
                let isUpdatesTimeline = true;
                let isUpdatesBoneTimeline = true;
                let time = isCacheEnabled ? (Math.floor(self._time * cacheTimeToFrameScale) / cacheTimeToFrameScale) : self._time; // Cache time internval.

                // Update main timeline.                
                self._timeline.update(time);
                if (!self._animationData.hasAsynchronyTimeline) {
                    time = self._timeline._currentTime;
                }

                if (isCacheEnabled) {
                    const cacheFrameIndex = Math.floor(self._timeline._currentTime * cacheTimeToFrameScale);

                    if (self._armature._cacheFrameIndex == cacheFrameIndex) { // Same cache.
                        isUpdatesTimeline = false;
                        isUpdatesBoneTimeline = false;
                    } else {
                        self._armature._cacheFrameIndex = cacheFrameIndex;

                        if (self._armature._animation._animationStateDirty) { // Update _cacheFrames.
                            self._armature._animation._animationStateDirty = false;

                            for (let i = 0, l = self._boneTimelines.length; i < l; ++i) {
                                const boneTimeline = self._boneTimelines[i];
                                boneTimeline.bone._cacheFrames = (<BoneTimelineData>boneTimeline._timeline).cachedFrames;
                            }

                            for (let i = 0, l = self._slotTimelines.length; i < l; ++i) {
                                const slotTimeline = self._slotTimelines[i];
                                slotTimeline.slot._cacheFrames = (<SlotTimelineData>slotTimeline._timeline).cachedFrames;
                            }
                        }

                        if (self._animationData.cachedFrames[cacheFrameIndex]) { // Cached.
                            isUpdatesBoneTimeline = false;
                        } else { // Cache.
                            self._animationData.cachedFrames[cacheFrameIndex] = true;
                        }
                    }
                } else {
                    self._armature._cacheFrameIndex = -1;
                }

                if (isUpdatesTimeline) {
                    if (isUpdatesBoneTimeline) {
                        for (let i = 0, l = self._boneTimelines.length; i < l; ++i) {
                            self._boneTimelines[i].update(time);
                        }
                    }

                    for (let i = 0, l = self._slotTimelines.length; i < l; ++i) {
                        self._slotTimelines[i].update(time);
                    }

                    for (let i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                        self._ffdTimelines[i].update(time);
                    }
                }
            }

            if (self.autoFadeOutTime >= 0 && self._fadeProgress >= 1 && self._timeline._isCompleted) {
                self.fadeOut(self.autoFadeOutTime);
            }
        }
        /**
         * @language zh_CN
         * 继续播放。
         * @version DragonBones 3.0
         */
        public play(): void {
            this._isPlaying = true;
        }
        /**
         * @language zh_CN
         * 暂停播放。
         * @version DragonBones 3.0
         */
        public stop(): void {
            this._isPlaying = false;
        }

        /**
         * @language zh_CN
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。 [true: 暂停, false: 不暂停]
         * @version DragonBones 3.0
         */
        public fadeOut(fadeOutTime: number, pausePlayhead: boolean = true): void {
            const self = this;

            if (fadeOutTime < 0 || fadeOutTime != fadeOutTime) {
                fadeOutTime = 0;
            }

            self._isPausePlayhead = pausePlayhead;

            if (self._isFadeOut) {
                if (fadeOutTime > fadeOutTime - self._fadeTime) {
                    // If the animation is already in fade out, the new fade out will be ignored.
                    return;
                }
            } else {
                self._isFadeOut = true;

                if (fadeOutTime == 0 || self._fadeProgress <= 0) {
                    self._fadeProgress = 0.000001;
                }

                for (let i = 0, l = self._boneTimelines.length; i < l; ++i) {
                    self._boneTimelines[i].fadeOut();
                }

                for (let i = 0, l = self._slotTimelines.length; i < l; ++i) {
                    self._slotTimelines[i].fadeOut();
                }
            }

            self.displayControl = false;
            self.fadeTotalTime = self._fadeProgress > 0.000001 ? fadeOutTime / self._fadeProgress : 0;
            self._fadeTime = self.fadeTotalTime * (1 - self._fadeProgress);
        }
        /**
         * @language zh_CN
         * 是否包含指定的骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         */
        public containsBoneMask(name: string): boolean {
            return !this._boneMask.length || this._boneMask.indexOf(name) >= 0;
        }
        /**
         * @language zh_CN
         * 添加指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         */
        public addBoneMask(name: string, recursive: boolean = true): void {
            const self = this;

            const currentBone = self._armature.getBone(name);
            if (!currentBone) {
                return;
            }

            if (
                self._boneMask.indexOf(name) < 0 &&
                self._animationData.getBoneTimeline(name)
            ) { // Add mixing
                self._boneMask.push(name);
            }

            if (recursive) {
                const bones = self._armature.getBones();
                for (let i = 0, l = bones.length; i < l; ++i) {
                    const bone = bones[i];
                    const boneName = bone.name;
                    if (
                        self._boneMask.indexOf(boneName) < 0 &&
                        self._animationData.getBoneTimeline(boneName) &&
                        currentBone.contains(bone)
                    ) { // Add recursive mixing.
                        self._boneMask.push(boneName)
                    }
                }
            }

            self._updateTimelineStates();
        }
        /**
         * @language zh_CN
         * 删除指定的骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         */
        public removeBoneMask(name: string, recursive: boolean = true): void {
            const self = this;

            const index = self._boneMask.indexOf(name);
            if (index >= 0) { // Remove mixing
                self._boneMask.splice(index, 1);
            }

            if (recursive) {
                const currentBone = self._armature.getBone(name);
                if (currentBone) {
                    const bones = self._armature.getBones();
                    for (let i = 0, l = bones.length; i < l; ++i) {
                        const bone = bones[i];
                        const boneName = bone.name;
                        const index = self._boneMask.indexOf(boneName);
                        if (
                            index >= 0 &&
                            currentBone.contains(bone)
                        ) { // Remove recursive mixing.
                            self._boneMask.splice(index, 1);
                        }
                    }
                }
            }

            self._updateTimelineStates();
        }
        /**
         * @language zh_CN
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         */
        public removeAllBoneMask(): void {
            this._boneMask.length = 0;
            this._updateTimelineStates();
        }
        /**
         * @language zh_CN
         * 动画图层。
         * @see dragonBones.Animation#fadeIn()
         * @version DragonBones 3.0
         */
        public get layer(): number {
            return this._layer;
        }
        /**
         * @language zh_CN
         * 动画组。
         * @see dragonBones.Animation#fadeIn()
         * @version DragonBones 3.0
         */
        public get group(): string {
            return this._group;
        }
        /**
         * @language zh_CN
         * 动画名称。
         * @see dragonBones.AnimationData#name
         * @version DragonBones 3.0
         */
        public get name(): string {
            return this._name;
        }
        /**
         * @language zh_CN
         * 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        public get animationData(): AnimationData {
            return this._animationData;
        }
        /**
         * @language zh_CN
         * 是否播放完毕。
         * @version DragonBones 3.0
         */
        public get isCompleted(): Boolean {
            return this._timeline._isCompleted;
        }

        /**
         * @language zh_CN
         * 是否正在播放。
         * @version DragonBones 3.0
         */
        public get isPlaying(): Boolean {
            return (this._isPlaying && !this._timeline._isCompleted);
        }

        /**
         * @language zh_CN
         * 当前动画的播放次数。
         * @version DragonBones 3.0
         */
        public get currentPlayTimes(): number {
            return this._currentPlayTimes;
        }

        /**
         * @language zh_CN
         * 当前动画的总时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public get totalTime(): number {
            return this._duration;
        }
        /**
         * @language zh_CN
         * 当前动画的播放时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public get currentTime(): number {
            return this._timeline._currentTime;
        }
        public set currentTime(value: number) {
            const self = this;

            if (value < 0 || value != value) {
                value = 0;
            }

            self._time = value;
            self._timeline.setCurrentTime(self._time);

            if (self._weightResult != 0) {
                let time = self._time;
                if (!self._animationData.hasAsynchronyTimeline) {
                    time = self._timeline._currentTime;
                }

                for (let i = 0, l = self._boneTimelines.length; i < l; ++i) {
                    self._boneTimelines[i].setCurrentTime(time);
                }

                for (let i = 0, l = self._slotTimelines.length; i < l; ++i) {
                    self._slotTimelines[i].setCurrentTime(time);
                }

                for (let i = 0, l = self._ffdTimelines.length; i < l; ++i) {
                    self._ffdTimelines[i].setCurrentTime(time);
                }
            }
        }

        /**
         * @deprecated
         */
        public autoTween: boolean = false;

        /**
         * @deprecated
         * @see #animationData
         * @version DragonBones 3.0
         */
        public get clip(): AnimationData {
            return this._animationData;
        }
    }
}