namespace dragonBones {
    /**
     * @private
     */
    export class AnimationTimelineState extends TimelineState<AnimationFrameData, AnimationData> {
        public static toString(): string {
            return "[Class dragonBones.AnimationTimelineState]";
        }

        private _isStarted: boolean;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this._isStarted = false;
        }

        protected _onCrossFrame(frame: AnimationFrameData): void {
            const self = this;

            const actions = frame.actions;
            for (let i = 0, l = actions.length; i < l; ++i) {
                const actionData = actions[i];
                if (actionData.slot) {
                    const slot = self._armature.getSlot(actionData.slot.name);
                    if (slot) {
                        const childArmature = slot.childArmature;
                        if (childArmature) {
                            childArmature._action = actionData;
                        }
                    }
                } else if (actionData.bone) {
                    const slots = self._armature.getSlots();
                    for (let i = 0, l = slots.length; i < l; ++i) {
                        const eachChildArmature = slots[i].childArmature;
                        if (eachChildArmature) {
                            eachChildArmature._action = actionData;
                        }
                    }
                } else {
                    self._armature._action = actionData;
                }
            }

            const eventDispatcher = self._armature._display;
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
                    eventObject.animationState = self._animationState;

                    if (eventData.bone) {
                        eventObject.bone = self._armature.getBone(eventData.bone.name);
                    }

                    if (eventData.slot) {
                        eventObject.slot = self._armature.getSlot(eventData.slot.name);
                    }

                    eventObject.name = eventData.name;
                    eventObject.data = eventData.data;

                    self._armature._bufferEvent(eventObject, eventType);
                }
            }
        }

        public update(time: number): void {
            const self = this;

            const prevPlayTimes = self._currentPlayTimes;
            const eventDispatcher = self._armature._display;

            if (!self._isStarted && time != 0) {
                self._isStarted = true;

                if (eventDispatcher.hasEvent(EventObject.START)) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.animationState = self._animationState;
                    self._armature._bufferEvent(eventObject, EventObject.START);
                }
            }

            super.update(time);

            if (prevPlayTimes != self._currentPlayTimes) {
                const eventType = self._isCompleted ? EventObject.COMPLETE : EventObject.LOOP_COMPLETE;

                if (eventDispatcher.hasEvent(eventType)) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.animationState = self._animationState;
                    self._armature._bufferEvent(eventObject, eventType);
                }
            }
        }
    }
    /**
     * @private
     */
    export class BoneTimelineState extends TweenTimelineState<BoneFrameData, BoneTimelineData> {
        public static toString(): string {
            return "[Class dragonBones.BoneTimelineState]";
        }

        public bone: Bone;

        private _tweenTransform: number;
        private _tweenRotate: number;
        private _tweenScale: number;
        private _boneTransform: Transform;
        private _originTransform: Transform;
        private _transform: Transform = new Transform();
        private _currentTransform: Transform = new Transform();
        private _durationTransform: Transform = new Transform();

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            const self = this;

            super._onClear();

            self.bone = null;

            self._tweenTransform = TweenType.None;
            self._tweenRotate = TweenType.None;
            self._tweenScale = TweenType.None;
            self._boneTransform = null;
            self._originTransform = null;
            self._transform.identity();
            self._currentTransform.identity();
            self._durationTransform.identity();
        }

        protected _onFadeIn(): void {
            const self = this;

            self._originTransform = self._timeline.originTransform;
            self._boneTransform = self.bone._animationPose;
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            const self = this;

            super._onArriveAtFrame(isUpdate);

            self._currentTransform.copyFrom(self._currentFrame.transform);

            self._tweenTransform = TweenType.Once;
            self._tweenRotate = TweenType.Once;
            self._tweenScale = TweenType.Once;

            if (self._keyFrameCount > 1 && (self._tweenEasing != DragonBones.NO_TWEEN || self._curve)) {
                const nextFrame = self._currentFrame.next;
                const nextTransform = nextFrame.transform;

                // Transform.
                self._durationTransform.x = nextTransform.x - self._currentTransform.x;
                self._durationTransform.y = nextTransform.y - self._currentTransform.y;
                if (self._durationTransform.x != 0 || self._durationTransform.y != 0) {
                    self._tweenTransform = TweenType.Always;
                }

                // Rotate.
                const tweenRotate = self._currentFrame.tweenRotate;
                if (tweenRotate == tweenRotate) {
                    if (tweenRotate) {
                        if (tweenRotate > 0 ? nextTransform.skewY >= self._currentTransform.skewY : nextTransform.skewY <= self._currentTransform.skewY) {
                            const rotate = tweenRotate > 0 ? tweenRotate - 1 : tweenRotate + 1;
                            self._durationTransform.skewX = nextTransform.skewX - self._currentTransform.skewX + DragonBones.PI_D * rotate;
                            self._durationTransform.skewY = nextTransform.skewY - self._currentTransform.skewY + DragonBones.PI_D * rotate;
                        } else {
                            self._durationTransform.skewX = nextTransform.skewX - self._currentTransform.skewX + DragonBones.PI_D * tweenRotate;
                            self._durationTransform.skewY = nextTransform.skewY - self._currentTransform.skewY + DragonBones.PI_D * tweenRotate;
                        }
                    } else {
                        self._durationTransform.skewX = Transform.normalizeRadian(nextTransform.skewX - self._currentTransform.skewX);
                        self._durationTransform.skewY = Transform.normalizeRadian(nextTransform.skewY - self._currentTransform.skewY);
                    }

                    if (self._durationTransform.skewX != 0 || self._durationTransform.skewY != 0) {
                        self._tweenRotate = TweenType.Always;
                    }
                } else {
                    self._durationTransform.skewX = 0;
                    self._durationTransform.skewY = 0;
                }

                // Scale.
                if (self._currentFrame.tweenScale) {
                    self._durationTransform.scaleX = nextTransform.scaleX - self._currentTransform.scaleX;
                    self._durationTransform.scaleY = nextTransform.scaleY - self._currentTransform.scaleY;
                    if (self._durationTransform.scaleX != 0 || self._durationTransform.scaleY != 0) {
                        self._tweenScale = TweenType.Always;
                    }
                } else {
                    self._durationTransform.scaleX = 0;
                    self._durationTransform.scaleY = 0;
                }
            } else {
                self._durationTransform.x = 0;
                self._durationTransform.y = 0;
                self._durationTransform.skewX = 0;
                self._durationTransform.skewY = 0;
                self._durationTransform.scaleX = 0;
                self._durationTransform.scaleY = 0;
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            const self = this;

            if (self._tweenTransform || self._tweenRotate || self._tweenScale) {
                super._onUpdateFrame(isUpdate);

                if (self._tweenTransform) {
                    if (self._tweenTransform == TweenType.Once) {
                        self._tweenTransform = TweenType.None;
                    }

                    if (self._animationState.additiveBlending) { // Additive blending.
                        self._transform.x = self._currentTransform.x + self._durationTransform.x * self._tweenProgress;
                        self._transform.y = self._currentTransform.y + self._durationTransform.y * self._tweenProgress;
                    } else { // Normal blending.
                        self._transform.x = self._originTransform.x + self._currentTransform.x + self._durationTransform.x * self._tweenProgress;
                        self._transform.y = self._originTransform.y + self._currentTransform.y + self._durationTransform.y * self._tweenProgress;
                    }
                }

                if (self._tweenRotate) {
                    if (self._tweenRotate == TweenType.Once) {
                        self._tweenRotate = TweenType.None;
                    }

                    if (self._animationState.additiveBlending) { // Additive blending.
                        self._transform.skewX = self._currentTransform.skewX + self._durationTransform.skewX * self._tweenProgress;
                        self._transform.skewY = self._currentTransform.skewY + self._durationTransform.skewY * self._tweenProgress;
                    } else { // Normal blending.
                        self._transform.skewX = self._originTransform.skewX + self._currentTransform.skewX + self._durationTransform.skewX * self._tweenProgress;
                        self._transform.skewY = self._originTransform.skewY + self._currentTransform.skewY + self._durationTransform.skewY * self._tweenProgress;
                    }
                }

                if (self._tweenScale) {
                    if (self._tweenScale == TweenType.Once) {
                        self._tweenScale = TweenType.None;
                    }

                    if (self._animationState.additiveBlending) { // Additive blending.
                        self._transform.scaleX = self._currentTransform.scaleX + self._durationTransform.scaleX * self._tweenProgress;
                        self._transform.scaleY = self._currentTransform.scaleY + self._durationTransform.scaleY * self._tweenProgress;
                    } else { // Normal blending.
                        self._transform.scaleX = self._originTransform.scaleX * (self._currentTransform.scaleX + self._durationTransform.scaleX * self._tweenProgress);
                        self._transform.scaleY = self._originTransform.scaleY * (self._currentTransform.scaleY + self._durationTransform.scaleY * self._tweenProgress);
                    }
                }

                self.bone.invalidUpdate();
            }
        }

        public fadeOut(): void {
            const self = this;

            self._transform.skewX = Transform.normalizeRadian(self._transform.skewX);
            self._transform.skewY = Transform.normalizeRadian(self._transform.skewY);
        }

        public update(time: number): void {
            const self = this;

            super.update(time);

            // Blend animation state.
            const weight = self._animationState._weightResult;

            if (weight > 0) {
                if (self.bone._blendIndex == 0) {
                    self._boneTransform.x = self._transform.x * weight;
                    self._boneTransform.y = self._transform.y * weight;
                    self._boneTransform.skewX = self._transform.skewX * weight;
                    self._boneTransform.skewY = self._transform.skewY * weight;
                    self._boneTransform.scaleX = (self._transform.scaleX - 1) * weight + 1;
                    self._boneTransform.scaleY = (self._transform.scaleY - 1) * weight + 1;
                } else {
                    self._boneTransform.x += self._transform.x * weight;
                    self._boneTransform.y += self._transform.y * weight;
                    self._boneTransform.skewX += self._transform.skewX * weight;
                    self._boneTransform.skewY += self._transform.skewY * weight;
                    self._boneTransform.scaleX += (self._transform.scaleX - 1) * weight;
                    self._boneTransform.scaleY += (self._transform.scaleY - 1) * weight;
                }

                self.bone._blendIndex++;

                const fadeProgress = self._animationState._fadeProgress;
                if (fadeProgress < 1) {
                    self.bone.invalidUpdate();
                }
            }
        }
    }
    /**
     * @private
     */
    export class SlotTimelineState extends TweenTimelineState<SlotFrameData, SlotTimelineData> {
        public static toString(): string {
            return "[Class dragonBones.SlotTimelineState]";
        }

        public slot: Slot;

        private _colorDirty: boolean;
        private _tweenColor: number;
        private _slotColor: ColorTransform;
        private _color: ColorTransform = new ColorTransform();
        private _durationColor: ColorTransform = new ColorTransform();

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            const self = this;

            super._onClear();

            self.slot = null;

            self._colorDirty = false;
            self._tweenColor = TweenType.None;
            self._slotColor = null;
            self._color.identity();
            self._durationColor.identity();
        }

        protected _onFadeIn(): void {
            this._slotColor = this.slot._colorTransform;
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            const self = this;

            super._onArriveAtFrame(isUpdate);

            if (self._animationState._isDisabled(self.slot)) {
                self._tweenEasing = DragonBones.NO_TWEEN;
                self._curve = null;
                self._tweenColor = TweenType.None;
                return;
            }

            if (self.slot._displayDataSet) {
                const displayIndex = self._currentFrame.displayIndex;
                if (self.slot.displayIndex >= 0 && displayIndex >= 0) {
                    if (self.slot._displayDataSet.displays.length > 1) {
                        self.slot._setDisplayIndex(displayIndex);
                    }
                } else {
                    self.slot._setDisplayIndex(displayIndex);
                }

                self.slot._updateMeshData(true);
            }

            if (self._currentFrame.displayIndex >= 0) {
                self._tweenColor = TweenType.None;

                const currentColor = self._currentFrame.color;

                if (self._keyFrameCount > 1 && (self._tweenEasing != DragonBones.NO_TWEEN || self._curve)) {
                    const nextFrame = self._currentFrame.next;
                    const nextColor = nextFrame.color;
                    if (currentColor != nextColor && nextFrame.displayIndex >= 0) {
                        self._durationColor.alphaMultiplier = nextColor.alphaMultiplier - currentColor.alphaMultiplier;
                        self._durationColor.redMultiplier = nextColor.redMultiplier - currentColor.redMultiplier;
                        self._durationColor.greenMultiplier = nextColor.greenMultiplier - currentColor.greenMultiplier;
                        self._durationColor.blueMultiplier = nextColor.blueMultiplier - currentColor.blueMultiplier;
                        self._durationColor.alphaOffset = nextColor.alphaOffset - currentColor.alphaOffset;
                        self._durationColor.redOffset = nextColor.redOffset - currentColor.redOffset;
                        self._durationColor.greenOffset = nextColor.greenOffset - currentColor.greenOffset;
                        self._durationColor.blueOffset = nextColor.blueOffset - currentColor.blueOffset;

                        if (
                            self._durationColor.alphaMultiplier != 0 ||
                            self._durationColor.redMultiplier != 0 ||
                            self._durationColor.greenMultiplier != 0 ||
                            self._durationColor.blueMultiplier != 0 ||
                            self._durationColor.alphaOffset != 0 ||
                            self._durationColor.redOffset != 0 ||
                            self._durationColor.greenOffset != 0 ||
                            self._durationColor.blueOffset != 0
                        ) {
                            self._tweenColor = TweenType.Always;
                        }
                    }
                }

                if (self._tweenColor == TweenType.None) {
                    self._durationColor.alphaMultiplier = currentColor.alphaMultiplier - self._slotColor.alphaMultiplier;
                    self._durationColor.redMultiplier = currentColor.redMultiplier - self._slotColor.redMultiplier;
                    self._durationColor.greenMultiplier = currentColor.greenMultiplier - self._slotColor.greenMultiplier;
                    self._durationColor.blueMultiplier = currentColor.blueMultiplier - self._slotColor.blueMultiplier;
                    self._durationColor.alphaOffset = currentColor.alphaOffset - self._slotColor.alphaOffset;
                    self._durationColor.redOffset = currentColor.redOffset - self._slotColor.redOffset;
                    self._durationColor.greenOffset = currentColor.greenOffset - self._slotColor.greenOffset;
                    self._durationColor.blueOffset = currentColor.blueOffset - self._slotColor.blueOffset;
                    if (
                        self._durationColor.alphaMultiplier != 0 ||
                        self._durationColor.redMultiplier != 0 ||
                        self._durationColor.greenMultiplier != 0 ||
                        self._durationColor.blueMultiplier != 0 ||
                        self._durationColor.alphaOffset != 0 ||
                        self._durationColor.redOffset != 0 ||
                        self._durationColor.greenOffset != 0 ||
                        self._durationColor.blueOffset != 0
                    ) {
                        self._tweenColor = TweenType.Once;
                    }
                }
            } else {
                self._tweenEasing = DragonBones.NO_TWEEN;
                self._curve = null;
                self._tweenColor = TweenType.None;
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            const self = this;

            super._onUpdateFrame(isUpdate);

            if (self._tweenColor) {
                if (self._tweenColor == TweenType.Once) {
                    self._tweenColor = TweenType.None;
                }

                const currentColor = self._currentFrame.color;
                self._color.alphaMultiplier = currentColor.alphaMultiplier + self._durationColor.alphaMultiplier * self._tweenProgress;
                self._color.redMultiplier = currentColor.redMultiplier + self._durationColor.redMultiplier * self._tweenProgress;
                self._color.greenMultiplier = currentColor.greenMultiplier + self._durationColor.greenMultiplier * self._tweenProgress;
                self._color.blueMultiplier = currentColor.blueMultiplier + self._durationColor.blueMultiplier * self._tweenProgress;
                self._color.alphaOffset = currentColor.alphaOffset + self._durationColor.alphaOffset * self._tweenProgress;
                self._color.redOffset = currentColor.redOffset + self._durationColor.redOffset * self._tweenProgress;
                self._color.greenOffset = currentColor.greenOffset + self._durationColor.greenOffset * self._tweenProgress;
                self._color.blueOffset = currentColor.blueOffset + self._durationColor.blueOffset * self._tweenProgress;

                self._colorDirty = true;
            }
        }

        public fadeOut(): void {
            this._tweenColor = TweenType.None;
        }

        public update(time: number): void {
            const self = this;

            super.update(time);

            // Fade animation.
            if (self._tweenColor != TweenType.None || self._colorDirty) {
                const weight = self._animationState._weightResult;
                if (weight > 0) {
                    const fadeProgress = self._animationState._fadeProgress;
                    if (fadeProgress < 1) {
                        self._slotColor.alphaMultiplier += (self._color.alphaMultiplier - self._slotColor.alphaMultiplier) * fadeProgress;
                        self._slotColor.redMultiplier += (self._color.redMultiplier - self._slotColor.redMultiplier) * fadeProgress;
                        self._slotColor.greenMultiplier += (self._color.greenMultiplier - self._slotColor.greenMultiplier) * fadeProgress;
                        self._slotColor.blueMultiplier += (self._color.blueMultiplier - self._slotColor.blueMultiplier) * fadeProgress;
                        self._slotColor.alphaOffset += (self._color.alphaOffset - self._slotColor.alphaOffset) * fadeProgress;
                        self._slotColor.redOffset += (self._color.redOffset - self._slotColor.redOffset) * fadeProgress;
                        self._slotColor.greenOffset += (self._color.greenOffset - self._slotColor.greenOffset) * fadeProgress;
                        self._slotColor.blueOffset += (self._color.blueOffset - self._slotColor.blueOffset) * fadeProgress;

                        self.slot._colorDirty = true;
                    } else if (self._colorDirty) {
                        self._colorDirty = false;
                        self._slotColor.alphaMultiplier = self._color.alphaMultiplier;
                        self._slotColor.redMultiplier = self._color.redMultiplier;
                        self._slotColor.greenMultiplier = self._color.greenMultiplier;
                        self._slotColor.blueMultiplier = self._color.blueMultiplier;
                        self._slotColor.alphaOffset = self._color.alphaOffset;
                        self._slotColor.redOffset = self._color.redOffset;
                        self._slotColor.greenOffset = self._color.greenOffset;
                        self._slotColor.blueOffset = self._color.blueOffset;

                        self.slot._colorDirty = true;
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    export class FFDTimelineState extends TweenTimelineState<ExtensionFrameData, FFDTimelineData> {
        public static toString(): string {
            return "[Class dragonBones.FFDTimelineState]";
        }

        public slot: Slot;

        private _tweenFFD: number;
        private _slotFFDVertices: Array<number>;
        private _durationFFDFrame: ExtensionFrameData;
        private _ffdVertices: Array<number> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            const self = this;

            super._onClear();

            self.slot = null;

            self._tweenFFD = TweenType.None;
            self._slotFFDVertices = null;

            if (self._durationFFDFrame) {
                self._durationFFDFrame.returnToPool();
                self._durationFFDFrame = null;
            }

            if (self._ffdVertices.length) {
                self._ffdVertices.length = 0;
            }
        }

        protected _onFadeIn(): void {
            const self = this;

            self._slotFFDVertices = self.slot._ffdVertices;

            self._durationFFDFrame = BaseObject.borrowObject(ExtensionFrameData);
            self._durationFFDFrame.tweens.length = self._slotFFDVertices.length;
            self._ffdVertices.length = self._slotFFDVertices.length;

            for (let i = 0, l = self._durationFFDFrame.tweens.length; i < l; ++i) {
                self._durationFFDFrame.tweens[i] = 0;
            }

            for (let i = 0, l = self._ffdVertices.length; i < l; ++i) {
                self._ffdVertices[i] = 0;
            }
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            const self = this;

            super._onArriveAtFrame(isUpdate);

            self._tweenFFD = TweenType.None;

            if (self._tweenEasing != DragonBones.NO_TWEEN || self._curve) {
                self._tweenFFD = self._updateExtensionKeyFrame(self._currentFrame, self._currentFrame.next, self._durationFFDFrame);
            }

            if (self._tweenFFD == TweenType.None) {
                const currentFFDVertices = self._currentFrame.tweens;
                for (let i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    if (self._slotFFDVertices[i] != currentFFDVertices[i]) {
                        self._tweenFFD = TweenType.Once;
                        break;
                    }
                }
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            const self = this;

            super._onUpdateFrame(isUpdate);

            if (self._tweenFFD != TweenType.None) {
                if (self._tweenFFD == TweenType.Once) {
                    self._tweenFFD = TweenType.None;
                }

                const currentFFDVertices = self._currentFrame.tweens;
                const nextFFDVertices = self._durationFFDFrame.tweens;
                for (let i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    self._ffdVertices[i] = currentFFDVertices[i] + nextFFDVertices[i] * self._tweenProgress;
                }

                self.slot._ffdDirty = true;
            }
        }

        public update(time: number): void {
            const self = this;

            super.update(time);

            // Blend animation.
            const weight = self._animationState._weightResult;
            if (weight > 0) {
                if (self.slot._blendIndex == 0) {
                    for (let i = 0, l = self._ffdVertices.length; i < l; ++i) {
                        self._slotFFDVertices[i] = self._ffdVertices[i] * weight;
                    }
                } else {
                    for (let i = 0, l = self._ffdVertices.length; i < l; ++i) {
                        self._slotFFDVertices[i] += self._ffdVertices[i] * weight;
                    }
                }

                self.slot._blendIndex++;

                const fadeProgress = self._animationState._fadeProgress;
                if (fadeProgress < 1) {
                    self.slot._ffdDirty = true;
                }
            }
        }
    }
}