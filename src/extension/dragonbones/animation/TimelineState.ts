namespace dragonBones {
    /**
     * @private
     */
    export class AnimationTimelineState extends TimelineState<AnimationFrameData, AnimationData> {
        /**
         * @private
         */
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

        public update(time: number): void {
            const prevPlayTimes = this._currentPlayTimes;
            const eventDispatcher = this._armature._display;

            if (!this._isStarted && time != 0) {
                this._isStarted = true;

                if (eventDispatcher.hasEvent(EventObject.START)) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.animationState = this._animationState;
                    this._armature._bufferEvent(eventObject, EventObject.START);
                }
            }

            super.update(time);

            if (prevPlayTimes != this._currentPlayTimes) {
                const eventType = this._isCompleted ? EventObject.COMPLETE : EventObject.LOOP_COMPLETE;

                if (eventDispatcher.hasEvent(eventType)) {
                    const eventObject = BaseObject.borrowObject(EventObject);
                    eventObject.animationState = this._animationState;
                    this._armature._bufferEvent(eventObject, eventType);
                }
            }
        }
    }
    /**
     * @private
     */
    export class BoneTimelineState extends TweenTimelineState<BoneFrameData, BoneTimelineData> {
        /**
         * @private
         */
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
            super._onClear();

            this.bone = null;

            this._tweenTransform = TweenType.None;
            this._tweenRotate = TweenType.None;
            this._tweenScale = TweenType.None;
            this._boneTransform = null;
            this._originTransform = null;
            this._transform.identity();
            this._currentTransform.identity();
            this._durationTransform.identity();
        }

        protected _onFadeIn(): void {
            this._originTransform = this._timeline.originTransform;
            this._boneTransform = this.bone._animationPose;
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            super._onArriveAtFrame(isUpdate);

            this._currentTransform.copyFrom(this._currentFrame.transform);

            this._tweenTransform = TweenType.Once;
            this._tweenRotate = TweenType.Once;
            this._tweenScale = TweenType.Once;

            if (this._keyFrameCount > 1 && (this._tweenEasing != DragonBones.NO_TWEEN || this._curve)) {
                const nextFrame = this._currentFrame.next;
                const nextTransform = nextFrame.transform;

                // Transform
                this._durationTransform.x = nextTransform.x - this._currentTransform.x;
                this._durationTransform.y = nextTransform.y - this._currentTransform.y;
                if (this._durationTransform.x != 0 || this._durationTransform.y != 0) {
                    this._tweenTransform = TweenType.Always;
                }

                // Rotate
                const tweenRotate = this._currentFrame.tweenRotate;
                if (tweenRotate == tweenRotate) {
                    if (tweenRotate) {
                        if (tweenRotate > 0 ? nextTransform.skewY >= this._currentTransform.skewY : nextTransform.skewY <= this._currentTransform.skewY) {
                            const rotate = tweenRotate > 0 ? tweenRotate - 1 : tweenRotate + 1;
                            this._durationTransform.skewX = nextTransform.skewX - this._currentTransform.skewX + DragonBones.PI_D * rotate;
                            this._durationTransform.skewY = nextTransform.skewY - this._currentTransform.skewY + DragonBones.PI_D * rotate;
                        } else {
                            this._durationTransform.skewX = nextTransform.skewX - this._currentTransform.skewX + DragonBones.PI_D * tweenRotate;
                            this._durationTransform.skewY = nextTransform.skewY - this._currentTransform.skewY + DragonBones.PI_D * tweenRotate;
                        }
                    } else {
                        this._durationTransform.skewX = Transform.normalizeRadian(nextTransform.skewX - this._currentTransform.skewX);
                        this._durationTransform.skewY = Transform.normalizeRadian(nextTransform.skewY - this._currentTransform.skewY);
                    }

                    if (this._durationTransform.skewX != 0 || this._durationTransform.skewY != 0) {
                        this._tweenRotate = TweenType.Always;
                    }
                } else {
                    this._durationTransform.skewX = 0;
                    this._durationTransform.skewY = 0;
                }

                // Scale
                if (this._currentFrame.tweenScale) {
                    this._durationTransform.scaleX = nextTransform.scaleX - this._currentTransform.scaleX;
                    this._durationTransform.scaleY = nextTransform.scaleY - this._currentTransform.scaleY;
                    if (this._durationTransform.scaleX != 0 || this._durationTransform.scaleY != 0) {
                        this._tweenScale = TweenType.Always;
                    }
                } else {
                    this._durationTransform.scaleX = 0;
                    this._durationTransform.scaleY = 0;
                }
            } else {
                this._durationTransform.x = 0;
                this._durationTransform.y = 0;
                this._durationTransform.skewX = 0;
                this._durationTransform.skewY = 0;
                this._durationTransform.scaleX = 0;
                this._durationTransform.scaleY = 0;
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            if (this._tweenTransform || this._tweenRotate || this._tweenScale) {
                super._onUpdateFrame(isUpdate);

                if (this._tweenTransform) {
                    if (this._tweenTransform == TweenType.Once) {
                        this._tweenTransform = TweenType.None;
                    }

                    if (this._animationState.additiveBlending) { // Additive blending
                        this._transform.x = this._currentTransform.x + this._durationTransform.x * this._tweenProgress;
                        this._transform.y = this._currentTransform.y + this._durationTransform.y * this._tweenProgress;
                    } else { // Normal blending
                        this._transform.x = this._originTransform.x + this._currentTransform.x + this._durationTransform.x * this._tweenProgress;
                        this._transform.y = this._originTransform.y + this._currentTransform.y + this._durationTransform.y * this._tweenProgress;
                    }
                }

                if (this._tweenRotate) {
                    if (this._tweenRotate == TweenType.Once) {
                        this._tweenRotate = TweenType.None;
                    }

                    if (this._animationState.additiveBlending) { // Additive blending
                        this._transform.skewX = this._currentTransform.skewX + this._durationTransform.skewX * this._tweenProgress;
                        this._transform.skewY = this._currentTransform.skewY + this._durationTransform.skewY * this._tweenProgress;
                    } else { // Normal blending
                        this._transform.skewX = this._originTransform.skewX + this._currentTransform.skewX + this._durationTransform.skewX * this._tweenProgress;
                        this._transform.skewY = this._originTransform.skewY + this._currentTransform.skewY + this._durationTransform.skewY * this._tweenProgress;
                    }
                }

                if (this._tweenScale) {
                    if (this._tweenScale == TweenType.Once) {
                        this._tweenScale = TweenType.None;
                    }

                    if (this._animationState.additiveBlending) { // Additive blending
                        this._transform.scaleX = this._currentTransform.scaleX + this._durationTransform.scaleX * this._tweenProgress;
                        this._transform.scaleY = this._currentTransform.scaleY + this._durationTransform.scaleY * this._tweenProgress;
                    } else { // Normal blending
                        this._transform.scaleX = this._originTransform.scaleX * (this._currentTransform.scaleX + this._durationTransform.scaleX * this._tweenProgress);
                        this._transform.scaleY = this._originTransform.scaleY * (this._currentTransform.scaleY + this._durationTransform.scaleY * this._tweenProgress);
                    }
                }

                this.bone.invalidUpdate();
            }
        }

        public fadeOut(): void {
            this._transform.skewX = Transform.normalizeRadian(this._transform.skewX);
            this._transform.skewY = Transform.normalizeRadian(this._transform.skewY);
        }

        public update(time: number): void {
            super.update(time);

            // Blend animation state
            const weight = this._animationState._weightResult;

            if (weight > 0) {
                if (this.bone._blendIndex == 0) {
                    this._boneTransform.x = this._transform.x * weight;
                    this._boneTransform.y = this._transform.y * weight;
                    this._boneTransform.skewX = this._transform.skewX * weight;
                    this._boneTransform.skewY = this._transform.skewY * weight;
                    this._boneTransform.scaleX = (this._transform.scaleX - 1) * weight + 1;
                    this._boneTransform.scaleY = (this._transform.scaleY - 1) * weight + 1;
                } else {
                    this._boneTransform.x += this._transform.x * weight;
                    this._boneTransform.y += this._transform.y * weight;
                    this._boneTransform.skewX += this._transform.skewX * weight;
                    this._boneTransform.skewY += this._transform.skewY * weight;
                    this._boneTransform.scaleX += (this._transform.scaleX - 1) * weight;
                    this._boneTransform.scaleY += (this._transform.scaleY - 1) * weight;
                }

                this.bone._blendIndex++;

                const fadeProgress = this._animationState._fadeProgress;
                if (fadeProgress < 1) {
                    this.bone.invalidUpdate();
                }
            }
        }
    }
    /**
     * @private
     */
    export class SlotTimelineState extends TweenTimelineState<SlotFrameData, SlotTimelineData> {
        /**
         * @private
         */
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
            super._onClear();

            this.slot = null;

            this._colorDirty = false;
            this._tweenColor = TweenType.None;
            this._slotColor = null;
            this._color.alphaMultiplier = 1;
            this._color.redMultiplier = 1;
            this._color.greenMultiplier = 1;
            this._color.blueMultiplier = 1;
            this._color.alphaOffset = 0;
            this._color.redOffset = 0;
            this._color.greenOffset = 0;
            this._color.blueOffset = 0;
            this._durationColor.alphaMultiplier = 1;
            this._durationColor.redMultiplier = 1;
            this._durationColor.greenMultiplier = 1;
            this._durationColor.blueMultiplier = 1;
            this._durationColor.alphaOffset = 0;
            this._durationColor.redOffset = 0;
            this._durationColor.greenOffset = 0;
            this._durationColor.blueOffset = 0;
        }

        protected _onFadeIn(): void {
            this._slotColor = this.slot._colorTransform;
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            super._onArriveAtFrame(isUpdate);

            if (this._animationState._isDisabled(this.slot)) {
                this._tweenEasing = DragonBones.NO_TWEEN;
                this._curve = null;
                this._tweenColor = TweenType.None;
                return;
            }

            if (this.slot._displayDataSet) {
                const displayIndex = this._currentFrame.displayIndex;
                if (this.slot.displayIndex >= 0 && displayIndex >= 0) {
                    if (this.slot._displayDataSet.displays.length > 1) {
                        this.slot._setDisplayIndex(displayIndex);
                    }
                } else {
                    this.slot._setDisplayIndex(displayIndex);
                }

                this.slot._updateMeshData(true);
            }

            if (this._currentFrame.displayIndex >= 0) {
                this._tweenColor = TweenType.None;

                const currentColor = this._currentFrame.color;

                if (this._keyFrameCount > 1 && (this._tweenEasing != DragonBones.NO_TWEEN || this._curve)) {
                    const nextFrame = this._currentFrame.next;
                    const nextColor = nextFrame.color;
                    if (currentColor != nextColor && nextFrame.displayIndex >= 0) {
                        this._durationColor.alphaMultiplier = nextColor.alphaMultiplier - currentColor.alphaMultiplier;
                        this._durationColor.redMultiplier = nextColor.redMultiplier - currentColor.redMultiplier;
                        this._durationColor.greenMultiplier = nextColor.greenMultiplier - currentColor.greenMultiplier;
                        this._durationColor.blueMultiplier = nextColor.blueMultiplier - currentColor.blueMultiplier;
                        this._durationColor.alphaOffset = nextColor.alphaOffset - currentColor.alphaOffset;
                        this._durationColor.redOffset = nextColor.redOffset - currentColor.redOffset;
                        this._durationColor.greenOffset = nextColor.greenOffset - currentColor.greenOffset;
                        this._durationColor.blueOffset = nextColor.blueOffset - currentColor.blueOffset;

                        if (
                            this._durationColor.alphaMultiplier != 0 ||
                            this._durationColor.redMultiplier != 0 ||
                            this._durationColor.greenMultiplier != 0 ||
                            this._durationColor.blueMultiplier != 0 ||
                            this._durationColor.alphaOffset != 0 ||
                            this._durationColor.redOffset != 0 ||
                            this._durationColor.greenOffset != 0 ||
                            this._durationColor.blueOffset != 0
                        ) {
                            this._tweenColor = TweenType.Always;
                        }
                    }
                }

                if (this._tweenColor == TweenType.None) {
                    this._durationColor.alphaMultiplier = currentColor.alphaMultiplier - this._slotColor.alphaMultiplier;
                    this._durationColor.redMultiplier = currentColor.redMultiplier - this._slotColor.redMultiplier;
                    this._durationColor.greenMultiplier = currentColor.greenMultiplier - this._slotColor.greenMultiplier;
                    this._durationColor.blueMultiplier = currentColor.blueMultiplier - this._slotColor.blueMultiplier;
                    this._durationColor.alphaOffset = currentColor.alphaOffset - this._slotColor.alphaOffset;
                    this._durationColor.redOffset = currentColor.redOffset - this._slotColor.redOffset;
                    this._durationColor.greenOffset = currentColor.greenOffset - this._slotColor.greenOffset;
                    this._durationColor.blueOffset = currentColor.blueOffset - this._slotColor.blueOffset;
                    if (
                        this._durationColor.alphaMultiplier != 0 ||
                        this._durationColor.redMultiplier != 0 ||
                        this._durationColor.greenMultiplier != 0 ||
                        this._durationColor.blueMultiplier != 0 ||
                        this._durationColor.alphaOffset != 0 ||
                        this._durationColor.redOffset != 0 ||
                        this._durationColor.greenOffset != 0 ||
                        this._durationColor.blueOffset != 0
                    ) {
                        this._tweenColor = TweenType.Once;
                    }
                }
            } else {
                this._tweenEasing = DragonBones.NO_TWEEN;
                this._curve = null;
                this._tweenColor = TweenType.None;
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            super._onUpdateFrame(isUpdate);

            if (this._tweenColor) {
                if (this._tweenColor == TweenType.Once) {
                    this._tweenColor = TweenType.None;
                }

                const currentColor = this._currentFrame.color;
                this._color.alphaMultiplier = currentColor.alphaMultiplier + this._durationColor.alphaMultiplier * this._tweenProgress;
                this._color.redMultiplier = currentColor.redMultiplier + this._durationColor.redMultiplier * this._tweenProgress;
                this._color.greenMultiplier = currentColor.greenMultiplier + this._durationColor.greenMultiplier * this._tweenProgress;
                this._color.blueMultiplier = currentColor.blueMultiplier + this._durationColor.blueMultiplier * this._tweenProgress;
                this._color.alphaOffset = currentColor.alphaOffset + this._durationColor.alphaOffset * this._tweenProgress;
                this._color.redOffset = currentColor.redOffset + this._durationColor.redOffset * this._tweenProgress;
                this._color.greenOffset = currentColor.greenOffset + this._durationColor.greenOffset * this._tweenProgress;
                this._color.blueOffset = currentColor.blueOffset + this._durationColor.blueOffset * this._tweenProgress;

                this._colorDirty = true;
            }
        }

        public fadeOut(): void {
            this._tweenColor = TweenType.None;
        }

        public update(time: number): void {
            super.update(time);

            if (this._tweenColor != TweenType.None || this._colorDirty) {
                const weight = this._animationState._weightResult;
                if (weight > 0) {
                    const fadeProgress = this._animationState._fadeProgress;
                    if (fadeProgress < 1) {
                        this._slotColor.alphaMultiplier += (this._color.alphaMultiplier - this._slotColor.alphaMultiplier) * fadeProgress;
                        this._slotColor.redMultiplier += (this._color.redMultiplier - this._slotColor.redMultiplier) * fadeProgress;
                        this._slotColor.greenMultiplier += (this._color.greenMultiplier - this._slotColor.greenMultiplier) * fadeProgress;
                        this._slotColor.blueMultiplier += (this._color.blueMultiplier - this._slotColor.blueMultiplier) * fadeProgress;
                        this._slotColor.alphaOffset += (this._color.alphaOffset - this._slotColor.alphaOffset) * fadeProgress;
                        this._slotColor.redOffset += (this._color.redOffset - this._slotColor.redOffset) * fadeProgress;
                        this._slotColor.greenOffset += (this._color.greenOffset - this._slotColor.greenOffset) * fadeProgress;
                        this._slotColor.blueOffset += (this._color.blueOffset - this._slotColor.blueOffset) * fadeProgress;

                        this.slot._colorDirty = true;
                    } else if (this._colorDirty) {
                        this._colorDirty = false;
                        this._slotColor.alphaMultiplier = this._color.alphaMultiplier;
                        this._slotColor.redMultiplier = this._color.redMultiplier;
                        this._slotColor.greenMultiplier = this._color.greenMultiplier;
                        this._slotColor.blueMultiplier = this._color.blueMultiplier;
                        this._slotColor.alphaOffset = this._color.alphaOffset;
                        this._slotColor.redOffset = this._color.redOffset;
                        this._slotColor.greenOffset = this._color.greenOffset;
                        this._slotColor.blueOffset = this._color.blueOffset;

                        this.slot._colorDirty = true;
                    }
                }
            }
        }
    }
    /**
     * @private
     */
    export class FFDTimelineState extends TweenTimelineState<ExtensionFrameData, FFDTimelineData> {
        /**
         * @private
         */
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
            super._onClear();

            this.slot = null;

            this._tweenFFD = TweenType.None;
            this._slotFFDVertices = null;

            if (this._durationFFDFrame) {
                this._durationFFDFrame.returnToPool();
                this._durationFFDFrame = null;
            }

            if (this._ffdVertices.length) {
                this._ffdVertices.length = 0;
            }
        }

        protected _onFadeIn(): void {
            this._slotFFDVertices = this.slot._ffdVertices;

            this._durationFFDFrame = BaseObject.borrowObject(ExtensionFrameData);
            this._durationFFDFrame.tweens.length = this._slotFFDVertices.length;
            this._ffdVertices.length = this._slotFFDVertices.length;

            for (let i = 0, l = this._durationFFDFrame.tweens.length; i < l; ++i) {
                this._durationFFDFrame.tweens[i] = 0;
            }

            for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
                this._ffdVertices[i] = 0;
            }
        }

        protected _onArriveAtFrame(isUpdate: boolean): void {
            super._onArriveAtFrame(isUpdate);

            this._tweenFFD = TweenType.None;

            if (this._tweenEasing != DragonBones.NO_TWEEN || this._curve) {
                this._tweenFFD = this._updateExtensionKeyFrame(this._currentFrame, this._currentFrame.next, this._durationFFDFrame);
            }

            if (this._tweenFFD == TweenType.None) {
                const currentFFDVertices = this._currentFrame.tweens;
                for (let i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    if (this._slotFFDVertices[i] != currentFFDVertices[i]) {
                        this._tweenFFD = TweenType.Once;
                        break;
                    }
                }
            }
        }

        protected _onUpdateFrame(isUpdate: boolean): void {
            super._onUpdateFrame(isUpdate);

            if (this._tweenFFD != TweenType.None) {
                if (this._tweenFFD == TweenType.Once) {
                    this._tweenFFD = TweenType.None;
                }

                const currentFFDVertices = this._currentFrame.tweens;
                const nextFFDVertices = this._durationFFDFrame.tweens;
                for (let i = 0, l = currentFFDVertices.length; i < l; ++i) {
                    this._ffdVertices[i] = currentFFDVertices[i] + nextFFDVertices[i] * this._tweenProgress;
                }

                this.slot._ffdDirty = true;
            }
        }

        public update(time: number): void {
            super.update(time);

            const weight = this._animationState._weightResult;
            if (weight > 0) {
                if (this.slot._blendIndex == 0) {
                    for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._slotFFDVertices[i] = this._ffdVertices[i] * weight;
                    }
                } else {
                    for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._slotFFDVertices[i] += this._ffdVertices[i] * weight;
                    }
                }

                this.slot._blendIndex++;

                const fadeProgress = this._animationState._fadeProgress;
                if (fadeProgress < 1) {
                    this.slot._ffdDirty = true;
                }
            }
        }
    }
}