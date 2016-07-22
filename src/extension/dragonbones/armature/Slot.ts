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
            super._onClear();

            const disposeDisplayList: Array<any> = [];

            for (let i = 0, l = this._displayList.length; i < l; ++i) {
                const eachDisplay = this._displayList[i];
                if (
                    eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay &&
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
                    this._disposeDisplay(eachDisplay);
                }
            }

            if (this._meshDisplay && this._meshDisplay != this._rawDisplay) { // May be _meshDisplay and _rawDisplay is the same one.
                this._disposeDisplay(this._meshDisplay);
            }

            if (this._rawDisplay) {
                this._disposeDisplay(this._rawDisplay);
            }

            this.inheritAnimation = true;
            this.displayController = null;

            this._colorDirty = false;
            this._ffdDirty = false;
            this._blendIndex = 0;
            this._zOrder = 0;
            this._displayDataSet = null;
            this._meshData = null;
            this._cacheFrames = null;
            this._rawDisplay = null;
            this._meshDisplay = null;
            this._colorTransform.identity();

            if (this._ffdVertices.length) {
                this._ffdVertices.length = 0;
            }

            if (this._replacedDisplayDataSet.length) {
                this._replacedDisplayDataSet.length = 0;
            }

            this._displayDirty = false;
            this._blendModeDirty = false;
            this._originDirty = false;
            this._transformDirty = false;
            this._displayIndex = 0;
            this._blendMode = BlendMode.Normal;
            this._display = null;
            this._childArmature = null;
            this._localMatrix.identity();

            if (this._displayList.length) {
                this._displayList.length = 0;
            }

            if (this._meshBones.length) {
                this._meshBones.length = 0;
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
            const prevDisplay = this._display || this._rawDisplay;
            const prevChildArmature = this._childArmature;

            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._display = this._displayList[this._displayIndex];
                if (this._display instanceof Armature) {
                    this._childArmature = <Armature>this._display;
                    this._display = this._childArmature._display;
                } else {
                    this._childArmature = null;
                }
            } else {
                this._display = null;
                this._childArmature = null;
            }

            const currentDisplay = this._display || this._rawDisplay;

            if (currentDisplay != prevDisplay) {
                this._onUpdateDisplay();

                if (prevDisplay) {
                    this._replaceDisplay(prevDisplay);
                } else {
                    this._addDisplay();
                }

                this._blendModeDirty = true;
                this._colorDirty = true;
            }

            // Update origin.
            if (this._displayDataSet && this._displayIndex >= 0 && this._displayIndex < this._displayDataSet.displays.length) {
                this.origin.copyFrom(this._displayDataSet.displays[this._displayIndex].transform);
                this._originDirty = true;
            }

            // Update meshData.
            this._updateMeshData(false);

            // Update frame.
            if (currentDisplay == this._rawDisplay || currentDisplay == this._meshDisplay) {
                this._updateFrame();
            }

            // Update child armature.
            if (this._childArmature != prevChildArmature) {
                if (prevChildArmature) {
                    prevChildArmature._parent = null; // Update child armature parent.
                    if (this.inheritAnimation) {
                        prevChildArmature.animation.reset();
                    }
                }

                if (this._childArmature) {
                    this._childArmature._parent = this; // Update child armature parent.
                    if (this.inheritAnimation) {

                        // Set child armature frameRate.
                        const cacheFrameRate = this._armature.cacheFrameRate;
                        if (cacheFrameRate) {
                            this._childArmature.cacheFrameRate = cacheFrameRate;
                        }

                        this._childArmature.animation.play();
                    }
                }
            }
        }
        /**
         * @private
         */
        protected _updateLocalTransformMatrix(): void {
            this.global.copyFrom(this.origin).add(this.offset).toMatrix(this._localMatrix);
        }
        /**
         * @private
         */
        protected _updateGlobalTransformMatrix(): void {
            this.globalTransformMatrix.copyFrom(this._localMatrix);
            this.globalTransformMatrix.concat(this._parent.globalTransformMatrix);
            this.global.fromMatrix(this.globalTransformMatrix);
        }
        /**
         * @inheritDoc
         */
        public _setArmature(value: Armature): void {
            if (this._armature == value) {
                return;
            }

            if (this._armature) {
                this._armature._removeSlotFromSlotList(this);
            }

            this._armature = value;

            this._onUpdateDisplay();

            if (this._armature) {
                this._armature._addSlotToSlotList(this);
                this._addDisplay();
            } else {
                this._removeDisplay();
            }
        }
        /**
         * @private Armature
         */
        public _updateMeshData(isTimelineUpdate: Boolean): void {
            const prevMeshData = this._meshData;

            if (this._display == this._meshDisplay && this._displayDataSet && this._displayIndex >= 0 && this._displayIndex < this._displayDataSet.displays.length) {
                this._meshData = this._displayDataSet.displays[this._displayIndex].meshData;
            } else {
                this._meshData = null;
            }

            if (this._meshData != prevMeshData) {
                if (this._meshData) {
                    if (this._meshData.skinned) {
                        this._meshBones.length = this._meshData.bones.length;

                        for (let i = 0, l = this._meshBones.length; i < l; ++i) {
                            this._meshBones[i] = this._armature.getBone(this._meshData.bones[i].name);
                        }

                        let ffdVerticesCount = 0;
                        for (let i = 0, l = this._meshData.boneIndices.length; i < l; ++i) {
                            ffdVerticesCount += this._meshData.boneIndices[i].length;
                        }

                        this._ffdVertices.length = ffdVerticesCount * 2;
                    } else {
                        this._meshBones.length = 0;
                        this._ffdVertices.length = this._meshData.vertices.length;
                    }

                    for (let i = 0, l = this._ffdVertices.length; i < l; ++i) {
                        this._ffdVertices[i] = 0;
                    }

                    this._ffdDirty = true;
                } else {
                    this._meshBones.length = 0;
                    this._ffdVertices.length = 0;
                }

                if (isTimelineUpdate) {
                    this._armature.animation._updateFFDTimelineStates();
                }
            }
        }

        /**
         * @private Armature
         */
        public _update(cacheFrameIndex: number): void {
            this._blendIndex = 0;

            if (this._displayDirty) {
                this._displayDirty = false;
                this._updateDisplay();
            }

            if (!this._display) {
                return;
            }

            if (this._blendModeDirty) {
                this._blendModeDirty = false;
                this._updateBlendMode();
            }

            if (this._colorDirty) {
                this._colorDirty = false;
                this._updateColor();
            }

            if (this._meshData) {
                if (this._ffdDirty || (this._meshData.skinned && this._isMeshBonesUpdate())) {
                    this._ffdDirty = false;

                    this._updateMesh();
                }

                if (this._meshData.skinned) {
                    return;
                }
            }

            if (this._originDirty) {
                this._originDirty = false;
                this._transformDirty = true;
                this._updateLocalTransformMatrix();
            }

            if (cacheFrameIndex >= 0) {
                const cacheFrame = this._cacheFrames[cacheFrameIndex];
                if (this.globalTransformMatrix == cacheFrame) { // Same cache.
                    this._transformDirty = false;
                } else if (cacheFrame) { // Has been Cached.
                    this._transformDirty = true;
                    this.globalTransformMatrix = cacheFrame;
                } else if (this._transformDirty || this._parent._transformDirty != BoneTransformDirty.None) { // Dirty.
                    this._transformDirty = true;
                    this.globalTransformMatrix = this._globalTransformMatrix;
                } else if (this.globalTransformMatrix != this._globalTransformMatrix) { // Same cache but not cached yet.
                    this._transformDirty = false;
                    this._cacheFrames[cacheFrameIndex] = this.globalTransformMatrix;
                } else { // Dirty.
                    this._transformDirty = true;
                    this.globalTransformMatrix = this._globalTransformMatrix;
                }
            } else if (this._transformDirty || this._parent._transformDirty != BoneTransformDirty.None) { // Dirty.
                this._transformDirty = true;
                this.globalTransformMatrix = this._globalTransformMatrix;
            }

            if (this._transformDirty) {
                this._transformDirty = false;

                if (this.globalTransformMatrix == this._globalTransformMatrix) {
                    this._updateGlobalTransformMatrix();

                    if (cacheFrameIndex >= 0) {
                        this.globalTransformMatrix = SlotTimelineData.cacheFrame(this._cacheFrames, cacheFrameIndex, this._globalTransformMatrix);
                    }
                }

                this._updateTransform();
            }
        }

        /**
         * @private Factory
         */
        public _setDisplayList(value: Array<any>): Boolean {
            if (value && value.length) {
                if (this._displayList.length != value.length) {
                    this._displayList.length = value.length;
                }

                for (let i = 0, l = this._displayList.length; i < l; ++i) { // Retain input render displays.
                    const eachDisplay = value[i];
                    if (
                        eachDisplay && eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay && !(eachDisplay instanceof Armature) &&
                        this._displayList.indexOf(eachDisplay) < 0
                    ) {
                        this._initDisplay(eachDisplay);
                    }

                    this._displayList[i] = eachDisplay;
                }
            } else if (this._displayList.length) {
                this._displayList.length = 0;
            }

            if (this._displayIndex >= 0 && this._displayIndex < this._displayList.length) {
                this._displayDirty = this._display != this._displayList[this._displayIndex];
            } else {
                this._displayDirty = this._display != null;
            }

            return this._displayDirty;
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
            const backupDisplayList = this._displayList.concat(); // Copy.
            const disposeDisplayList = [];

            if (this._setDisplayList(value)) {
                this._update(-1);
            }

            // Release replaced render displays.
            for (let i = 0, l = backupDisplayList.length; i < l; ++i) {
                let eachDisplay = backupDisplayList[i];
                if (
                    eachDisplay != this._rawDisplay && eachDisplay != this._meshDisplay &&
                    this._displayList.indexOf(eachDisplay) < 0 &&
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
                    this._disposeDisplay(eachDisplay);
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
            if (this._display == value) {
                return;
            }

            const displayListLength = this._displayList.length;
            if (this._displayIndex < 0 && displayListLength == 0) {  // Emprty.
                this._displayIndex = 0;
            }

            if (this._displayIndex < 0) {
                return;
            } else {
                const replaceDisplayList = this.displayList; // Copy.
                if (displayListLength <= this._displayIndex) {
                    replaceDisplayList.length = this._displayIndex + 1;
                }

                replaceDisplayList[this._displayIndex] = value;
                this.displayList = replaceDisplayList;
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