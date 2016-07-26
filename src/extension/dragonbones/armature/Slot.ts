namespace dragonBones {
    /**
     * @language zh_CN
     * 插槽，附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     */
    export abstract class Slot extends TransformObject {
        /**
         * @language zh_CN
         * 子骨架是否继承父骨架的动画。 [true: 继承, false: 不继承]
         * @default true
         * @version DragonBones 4.5
         */
        public inheritAnimation: boolean;
        /**
         * @language zh_CN
         * 显示对象受到控制的对象，应设置为动画状态的名称或组名称，设置为 null 则表示受所有的动画状态控制。
         * @default null
         * @see dragonBones.AnimationState#displayControl
         * @see dragonBones.AnimationState#name
         * @see dragonBones.AnimationState#group
         * @version DragonBones 4.5
         */
        public displayController: string;
        /**
         * @private
         */
        public _colorDirty: boolean;
        /**
         * @private
         */
        public _ffdDirty: boolean;
        /**
         * @private
         */
        public _blendIndex: number;
        /**
         * @private
         */
        public _zOrder: number;
        /**
         * @private
         */
        public _displayDataSet: SlotDisplayDataSet;
        /**
         * @private
         */
        public _meshData: MeshData;
        /**
         * @private
         */
        public _cacheFrames: Array<Matrix>;
        /**
         * @private
         */
        public _rawDisplay: any;
        /**
         * @private
         */
        public _meshDisplay: any;
        /**
         * @private
         */
        public _colorTransform: ColorTransform = new ColorTransform();
        /**
         * @private
         */
        public _ffdVertices: Array<number> = [];
        /**
         * @private
         */
        public _replacedDisplayDataSet: Array<DisplayData> = [];
        /**
         * @private
         */
        protected _displayDirty: boolean;
        /**
         * @private
         */
        protected _blendModeDirty: boolean;
        /**
         * @private
         */
        protected _originDirty: boolean;
        /**
         * @private
         */
        protected _transformDirty: boolean;
        /**
         * @private
         */
        protected _displayIndex: number;
        /**
         * @private
         */
        protected _blendMode: BlendMode;
        /**
         * @private
         */
        protected _display: any;
        /**
         * @private
         */
        protected _childArmature: Armature;
        /**
         * @private
         */
        protected _localMatrix: Matrix = new Matrix();
        /**
         * @private
         */
        protected _displayList: Array<any | Armature> = [];
        /**
         * @private
         */
        protected _meshBones: Array<Bone> = [];
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

            super._onClear();

            const disposeDisplayList: Array<any> = [];

            for (let i = 0, l = self._displayList.length; i < l; ++i) {
                const eachDisplay = self._displayList[i];
                if (
                    eachDisplay != self._rawDisplay && eachDisplay != self._meshDisplay &&
                    disposeDisplayList.indexOf(eachDisplay) < 0
                ) {
                    disposeDisplayList.push(eachDisplay);
                }
            }

            for (let i = 0, l = disposeDisplayList.length; i < l; ++i) {
                const eachDisplay = disposeDisplayList[i];
                if (eachDisplay instanceof Armature) {
                    (<Armature>eachDisplay).returnToPool();
                } else {
                    self._disposeDisplay(eachDisplay);
                }
            }

            if (self._meshDisplay && self._meshDisplay != self._rawDisplay) { // May be _meshDisplay and _rawDisplay is the same one.
                self._disposeDisplay(self._meshDisplay);
            }

            if (self._rawDisplay) {
                self._disposeDisplay(self._rawDisplay);
            }

            self.inheritAnimation = true;
            self.displayController = null;

            self._colorDirty = false;
            self._ffdDirty = false;
            self._blendIndex = 0;
            self._zOrder = 0;
            self._displayDataSet = null;
            self._meshData = null;
            self._cacheFrames = null;
            self._rawDisplay = null;
            self._meshDisplay = null;
            self._colorTransform.identity();

            if (self._ffdVertices.length) {
                self._ffdVertices.length = 0;
            }

            if (self._replacedDisplayDataSet.length) {
                self._replacedDisplayDataSet.length = 0;
            }

            self._displayDirty = false;
            self._blendModeDirty = false;
            self._originDirty = false;
            self._transformDirty = false;
            self._displayIndex = 0;
            self._blendMode = BlendMode.Normal;
            self._display = null;
            self._childArmature = null;
            self._localMatrix.identity();

            if (self._displayList.length) {
                self._displayList.length = 0;
            }

            if (self._meshBones.length) {
                self._meshBones.length = 0;
            }
        }

        /**
         * @private
         */
        protected abstract _onUpdateDisplay(): void;
        /**
         * @private
         */
        protected abstract _initDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _addDisplay(): void;
        /**
         * @private
         */
        protected abstract _replaceDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _removeDisplay(): void;
        /**
         * @private
         */
        protected abstract _disposeDisplay(value: any): void;
        /**
         * @private Bone
         */
        public abstract _updateVisible(): void;
        /**
         * @private
         */
        protected abstract _updateBlendMode(): void;
        /**
         * @private
         */
        protected abstract _updateColor(): void;
        /**
         * @private
         */
        protected abstract _updateFilters(): void;
        /**
         * @private
         */
        protected abstract _updateFrame(): void;
        /**
         * @private
         */
        protected abstract _updateMesh(): void;
        /**
         * @private
         */
        protected abstract _updateTransform(): void;

        /**
         * @private
         */
        private _isMeshBonesUpdate(): Boolean {
            for (let i = 0, l = this._meshBones.length; i < l; ++i) {
                if (this._meshBones[i]._transformDirty != BoneTransformDirty.None) {
                    return true;
                }
            }

            return false;
        }
        /**
         * @private
         */
        protected _updateDisplay(): void {
            const self = this;

            const prevDisplay = self._display || self._rawDisplay;
            const prevChildArmature = self._childArmature;

            if (self._displayIndex >= 0 && self._displayIndex < self._displayList.length) {
                self._display = self._displayList[self._displayIndex];
                if (self._display instanceof Armature) {
                    self._childArmature = <Armature>self._display;
                    self._display = self._childArmature._display;
                } else {
                    self._childArmature = null;
                }
            } else {
                self._display = null;
                self._childArmature = null;
            }

            const currentDisplay = self._display || self._rawDisplay;

            if (currentDisplay != prevDisplay) {
                self._onUpdateDisplay();

                if (prevDisplay) {
                    self._replaceDisplay(prevDisplay);
                } else {
                    self._addDisplay();
                }

                self._blendModeDirty = true;
                self._colorDirty = true;
            }

            // Update origin.
            if (self._displayDataSet && self._displayIndex >= 0 && self._displayIndex < self._displayDataSet.displays.length) {
                self.origin.copyFrom(self._displayDataSet.displays[self._displayIndex].transform);
                self._originDirty = true;
            }

            // Update meshData.
            self._updateMeshData(false);

            // Update frame.
            if (currentDisplay == self._rawDisplay || currentDisplay == self._meshDisplay) {
                self._updateFrame();
            }

            // Update child armature.
            if (self._childArmature != prevChildArmature) {
                if (prevChildArmature) {
                    prevChildArmature._parent = null; // Update child armature parent.
                    if (self.inheritAnimation) {
                        prevChildArmature.animation.reset();
                    }
                }

                if (self._childArmature) {
                    self._childArmature._parent = this; // Update child armature parent.
                    if (self.inheritAnimation) {

                        // Set child armature frameRate.
                        const cacheFrameRate = self._armature.cacheFrameRate;
                        if (cacheFrameRate) {
                            self._childArmature.cacheFrameRate = cacheFrameRate;
                        }

                        const slotData = self._armature.armatureData.getSlot(self.name);
                        if (slotData.actions.length > 0) {
                            self._childArmature._action = slotData.actions[slotData.actions.length - 1];
                        } else {
                            self._childArmature.animation.play();
                        }
                    }
                }
            }
        }
        /**
         * @private
         */
        protected _updateLocalTransformMatrix(): void {
            const self = this;

            self.global.copyFrom(self.origin).add(self.offset).toMatrix(self._localMatrix);
        }
        /**
         * @private
         */
        protected _updateGlobalTransformMatrix(): void {
            const self = this;

            self.globalTransformMatrix.copyFrom(self._localMatrix);
            self.globalTransformMatrix.concat(self._parent.globalTransformMatrix);
            self.global.fromMatrix(self.globalTransformMatrix);
        }
        /**
         * @inheritDoc
         */
        public _setArmature(value: Armature): void {
            const self = this;

            if (self._armature == value) {
                return;
            }

            if (self._armature) {
                self._armature._removeSlotFromSlotList(this);
            }

            self._armature = value;

            self._onUpdateDisplay();

            if (self._armature) {
                self._armature._addSlotToSlotList(this);
                self._addDisplay();
            } else {
                self._removeDisplay();
            }
        }
        /**
         * @private Armature
         */
        public _updateMeshData(isTimelineUpdate: Boolean): void {
            const self = this;

            const prevMeshData = self._meshData;

            if (self._display == self._meshDisplay && self._displayDataSet && self._displayIndex >= 0 && self._displayIndex < self._displayDataSet.displays.length) {
                self._meshData = self._displayDataSet.displays[self._displayIndex].meshData;
            } else {
                self._meshData = null;
            }

            if (self._meshData != prevMeshData) {
                if (self._meshData) {
                    if (self._meshData.skinned) {
                        self._meshBones.length = self._meshData.bones.length;

                        for (let i = 0, l = self._meshBones.length; i < l; ++i) {
                            self._meshBones[i] = self._armature.getBone(self._meshData.bones[i].name);
                        }

                        let ffdVerticesCount = 0;
                        for (let i = 0, l = self._meshData.boneIndices.length; i < l; ++i) {
                            ffdVerticesCount += self._meshData.boneIndices[i].length;
                        }

                        self._ffdVertices.length = ffdVerticesCount * 2;
                    } else {
                        self._meshBones.length = 0;
                        self._ffdVertices.length = self._meshData.vertices.length;
                    }

                    for (let i = 0, l = self._ffdVertices.length; i < l; ++i) {
                        self._ffdVertices[i] = 0;
                    }

                    self._ffdDirty = true;
                } else {
                    self._meshBones.length = 0;
                    self._ffdVertices.length = 0;
                }

                if (isTimelineUpdate) {
                    self._armature.animation._updateFFDTimelineStates();
                }
            }
        }

        /**
         * @private Armature
         */
        public _update(cacheFrameIndex: number): void {
            const self = this;

            self._blendIndex = 0;

            if (self._displayDirty) {
                self._displayDirty = false;
                self._updateDisplay();
            }

            if (!self._display) {
                return;
            }

            if (self._blendModeDirty) {
                self._blendModeDirty = false;
                self._updateBlendMode();
            }

            if (self._colorDirty) {
                self._colorDirty = false;
                self._updateColor();
            }

            if (self._meshData) {
                if (self._ffdDirty || (self._meshData.skinned && self._isMeshBonesUpdate())) {
                    self._ffdDirty = false;

                    self._updateMesh();
                }

                if (self._meshData.skinned) {
                    return;
                }
            }

            if (self._originDirty) {
                self._originDirty = false;
                self._transformDirty = true;
                self._updateLocalTransformMatrix();
            }

            if (cacheFrameIndex >= 0) {
                const cacheFrame = self._cacheFrames[cacheFrameIndex];
                if (self.globalTransformMatrix == cacheFrame) { // Same cache.
                    self._transformDirty = false;
                } else if (cacheFrame) { // Has been Cached.
                    self._transformDirty = true;
                    self.globalTransformMatrix = cacheFrame;
                } else if (self._transformDirty || self._parent._transformDirty != BoneTransformDirty.None) { // Dirty.
                    self._transformDirty = true;
                    self.globalTransformMatrix = self._globalTransformMatrix;
                } else if (self.globalTransformMatrix != self._globalTransformMatrix) { // Same cache but not cached yet.
                    self._transformDirty = false;
                    self._cacheFrames[cacheFrameIndex] = self.globalTransformMatrix;
                } else { // Dirty.
                    self._transformDirty = true;
                    self.globalTransformMatrix = self._globalTransformMatrix;
                }
            } else if (self._transformDirty || self._parent._transformDirty != BoneTransformDirty.None) { // Dirty.
                self._transformDirty = true;
                self.globalTransformMatrix = self._globalTransformMatrix;
            }

            if (self._transformDirty) {
                self._transformDirty = false;

                if (self.globalTransformMatrix == self._globalTransformMatrix) {
                    self._updateGlobalTransformMatrix();

                    if (cacheFrameIndex >= 0) {
                        self.globalTransformMatrix = SlotTimelineData.cacheFrame(self._cacheFrames, cacheFrameIndex, self._globalTransformMatrix);
                    }
                }

                self._updateTransform();
            }
        }

        /**
         * @private Factory
         */
        public _setDisplayList(value: Array<any>): Boolean {
            const self = this;

            if (value && value.length) {
                if (self._displayList.length != value.length) {
                    self._displayList.length = value.length;
                }

                for (let i = 0, l = self._displayList.length; i < l; ++i) { // Retain input render displays.
                    const eachDisplay = value[i];
                    if (
                        eachDisplay && eachDisplay != self._rawDisplay && eachDisplay != self._meshDisplay && !(eachDisplay instanceof Armature) &&
                        self._displayList.indexOf(eachDisplay) < 0
                    ) {
                        self._initDisplay(eachDisplay);
                    }

                    self._displayList[i] = eachDisplay;
                }
            } else if (self._displayList.length) {
                self._displayList.length = 0;
            }

            if (self._displayIndex >= 0 && self._displayIndex < self._displayList.length) {
                self._displayDirty = self._display != self._displayList[self._displayIndex];
            } else {
                self._displayDirty = self._display != null;
            }

            return self._displayDirty;
        }
        /**
         * @private Factory
         */
        public _setDisplayIndex(value: number): boolean {
            if (this._displayIndex == value) {
                return false;
            }

            this._displayIndex = value;
            this._displayDirty = true;

            return this._displayDirty;
        }
        /**
         * @private Factory
         */
        public _setBlendMode(value: BlendMode): boolean {
            if (this._blendMode == value) {
                return false;
            }

            this._blendMode = value;
            this._blendModeDirty = true;

            return true;
        }
        /**
         * @private Factory
         */
        public _setColor(value: ColorTransform): boolean {
            this._colorTransform.copyFrom(value);
            this._colorDirty = true;

            return true;
        }
        /**
         * @language zh_CN
         * 在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         */
        public invalidUpdate(): void {
            this._displayDirty = true;
        }
        /**
         * @private
         */
        public get rawDisplay(): any {
            return this._rawDisplay;
        }
        /**
         * @private
         */
        public get MeshDisplay(): any {
            return this._meshDisplay;
        }
        /**
         * @language zh_CN
         * 此时显示的显示对象在显示列表中的索引。
         * @version DragonBones 4.5
         */
        public get displayIndex(): number {
            return this._displayIndex;
        }
        public set displayIndex(value: number) {
            if (this._setDisplayIndex(value)) {
                this._update(-1);
            }
        }
        /**
         * @language zh_CN
         * 包含显示对象或子骨架的显示列表。
         * @version DragonBones 3.0
         */
        public get displayList(): Array<any> {
            return this._displayList.concat();
        }
        public set displayList(value: Array<any>) {
            const self = this;

            const backupDisplayList = self._displayList.concat(); // Copy.
            const disposeDisplayList = [];

            if (self._setDisplayList(value)) {
                self._update(-1);
            }

            // Release replaced render displays.
            for (let i = 0, l = backupDisplayList.length; i < l; ++i) {
                let eachDisplay = backupDisplayList[i];
                if (
                    eachDisplay != self._rawDisplay && eachDisplay != self._meshDisplay &&
                    self._displayList.indexOf(eachDisplay) < 0 &&
                    disposeDisplayList.indexOf(eachDisplay) < 0
                ) {
                    disposeDisplayList.push(eachDisplay);
                }
            }

            for (let i = 0, l = disposeDisplayList.length; i < l; ++i) {
                let eachDisplay = disposeDisplayList[i];
                if (eachDisplay instanceof Armature) {
                    <Armature>(eachDisplay).returnToPool();
                } else {
                    self._disposeDisplay(eachDisplay);
                }
            }
        }
        /**
         * @language zh_CN
         * 此时显示的显示对象。
         * @version DragonBones 3.0
         */
        public get display(): any {
            return this._display;
        }
        public set display(value: any) {
            const self = this;

            if (self._display == value) {
                return;
            }

            const displayListLength = self._displayList.length;
            if (self._displayIndex < 0 && displayListLength == 0) {  // Emprty.
                self._displayIndex = 0;
            }

            if (self._displayIndex < 0) {
                return;
            } else {
                const replaceDisplayList = self.displayList; // Copy.
                if (displayListLength <= self._displayIndex) {
                    replaceDisplayList.length = self._displayIndex + 1;
                }

                replaceDisplayList[self._displayIndex] = value;
                self.displayList = replaceDisplayList;
            }
        }
        /**
         * @language zh_CN
         * 此时显示的子骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        public get childArmature(): Armature {
            return this._childArmature;
        }
        public set childArmature(value: Armature) {
            if (this._childArmature == value) {
                return;
            }

            this.display = value;
        }

        /**
         * @deprecated
         * @see #display
         */
        public getDisplay(): any {
            return this._display;
        }
        /**
         * @deprecated
         * @see #display
         */
        public setDisplay(value: any) {
            this.display = value;
        }
    }
}