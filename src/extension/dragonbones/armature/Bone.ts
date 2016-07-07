namespace dragonBones {
    /**
     * @private
     */
    export const enum BoneTransformDirty {
        None = 0,
        Self = 1,
        All = 2
    }

    /**
     * @language zh_CN
     * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
     * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    export class Bone extends TransformObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[Class dragonBones.Bone]";
        }

        /**
         * @language zh_CN
         * 是否继承父骨骼的平移。 [true: 继承, false: 不继承] (默认: true)
         * @version DragonBones 3.0
         */
        public inheritTranslation: boolean;
        /**
         * @language zh_CN
         * 是否继承父骨骼的旋转。 [true: 继承, false: 不继承] (默认: true)
         * @version DragonBones 3.0
         */
        public inheritRotation: boolean;
        /**
         * @language zh_CN
         * 是否继承父骨骼的缩放。 [true: 继承, false: 不继承] (默认: true)
         * @version DragonBones 4.5
         */
        public inheritScale: boolean;
        /**
         * @language zh_CN
         * IK 约束时骨骼方向是否为顺时针方向。 [true: 顺时针, false: 逆时针]  (默认: true)
         * @version DragonBones 4.5
         */
        public ikBendPositive: boolean;
        /**
         * @language zh_CN
         * IK 约束的权重。 (默认: 1)
         * @version DragonBones 4.5
         */
        public ikWeight: number;
        /**
         * @language zh_CN
         * 骨骼长度。 (默认: 0)
         * @version DragonBones 4.5
         */
        public length: number;
        /**
         * @private
         */
        public _transformDirty: BoneTransformDirty;
        /**
         * @private
         */
        public _blendIndex: number;
        /**
         * @private
         */
        public _cacheFrames: Array<Matrix>;
        /**
         * @private
         */
        public _animationPose: Transform = new Transform();
        /**
         * @private
         */
        private _visible: boolean;
        /**
         * @private
         */
        private _ikChain: number;
        /**
         * @private
         */
        private _ikChainIndex: number;
        /**
         * @private
         */
        private _ik: Bone;
        /**
         * @private
         */
        private _bones: Array<Bone> = [];
        /**
         * @private
         */
        private _slots: Array<Slot> = [];
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

            this.inheritTranslation = false;
            this.inheritRotation = false;
            this.inheritScale = false;
            this.ikBendPositive = false;
            this.ikWeight = 0;
            this.length = 0;

            this._transformDirty = BoneTransformDirty.All; // Update
            this._blendIndex = 0;
            this._cacheFrames = null;
            this._animationPose.identity();

            this._visible = true;
            this._ikChain = 0;
            this._ikChainIndex = 0;
            this._ik = null;

            if (this._bones.length) {
                this._bones.length = 0;
            }

            if (this._slots.length) {
                this._slots.length = 0;
            }
        }
        /**
         * @private
         */
        private _updateGlobalTransformMatrix(): void {
            if (this._parent) {
                const parentRotation = this._parent.global.skewY; // Only inherit skew y
                const parentMatrix = this._parent.globalTransformMatrix;

                if (this.inheritScale) {
                    if (!this.inheritRotation) {
                        this.global.skewX -= parentRotation;
                        this.global.skewY -= parentRotation;
                    }

                    this.global.toMatrix(this.globalTransformMatrix);
                    this.globalTransformMatrix.concat(parentMatrix);

                    if (!this.inheritTranslation) {
                        this.globalTransformMatrix.tx = this.global.x;
                        this.globalTransformMatrix.ty = this.global.y;
                    }

                    this.global.fromMatrix(this.globalTransformMatrix);
                } else {
                    if (this.inheritTranslation) {
                        const x = this.global.x;
                        const y = this.global.y;
                        this.global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
                        this.global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
                    }

                    if (this.inheritRotation) {
                        this.global.skewX += parentRotation;
                        this.global.skewY += parentRotation;
                    }

                    this.global.toMatrix(this.globalTransformMatrix);
                }
            } else {
                this.global.toMatrix(this.globalTransformMatrix);
            }
        }
        /**
         * @private
         */
        private _computeIKA(): void {
            const ikGlobal = this._ik.global;
            const x = this.globalTransformMatrix.a * this.length;
            const y = this.globalTransformMatrix.b * this.length;

            const ikRadian =
                (
                    Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) +
                    this.offset.skewY -
                    this.global.skewY * 2 +
                    Math.atan2(y, x)
                ) * this.ikWeight; // Support offset.

            this.global.skewX += ikRadian;
            this.global.skewY += ikRadian;
            this.global.toMatrix(this.globalTransformMatrix);
        }
        /**
         * @private
         */
        private _computeIKB(): void {
            const parentGlobal = this._parent.global;
            const ikGlobal = this._ik.global;

            const x = this.globalTransformMatrix.a * this.length;
            const y = this.globalTransformMatrix.b * this.length;

            const lLL = x * x + y * y;
            const lL = Math.sqrt(lLL);

            let dX = this.global.x - parentGlobal.x;
            let dY = this.global.y - parentGlobal.y;
            const lPP = dX * dX + dY * dY;
            const lP = Math.sqrt(lPP);

            dX = ikGlobal.x - parentGlobal.x;
            dY = ikGlobal.y - parentGlobal.y;
            const lTT = dX * dX + dY * dY;
            const lT = Math.sqrt(lTT);

            let ikRadianA = 0;
            if (lL + lP <= lT || lT + lL <= lP || lT + lP <= lL) {
                ikRadianA = Math.atan2(ikGlobal.y - parentGlobal.y, ikGlobal.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
                if (lL + lP <= lT) {
                } else if (lP < lL) {
                    ikRadianA += Math.PI;
                }
            } else {
                const h = (lPP - lLL + lTT) / (2 * lTT);
                const r = Math.sqrt(lPP - h * h * lTT) / lT;
                const hX = parentGlobal.x + (dX * h);
                const hY = parentGlobal.y + (dY * h);
                const rX = -dY * r;
                const rY = dX * r;

                if (this.ikBendPositive) {
                    this.global.x = hX - rX;
                    this.global.y = hY - rY;
                } else {
                    this.global.x = hX + rX;
                    this.global.y = hY + rY;
                }

                ikRadianA = Math.atan2(this.global.y - parentGlobal.y, this.global.x - parentGlobal.x) + this._parent.offset.skewY; // Support offset.
            }

            ikRadianA = (ikRadianA - parentGlobal.skewY) * this.ikWeight;

            parentGlobal.skewX += ikRadianA;
            parentGlobal.skewY += ikRadianA;
            parentGlobal.toMatrix(this._parent.globalTransformMatrix);

            const ikRadianB =
                (
                    Math.atan2(ikGlobal.y - this.global.y, ikGlobal.x - this.global.x) + this.offset.skewY -
                    this.global.skewY * 2 + Math.atan2(y, x)
                ) * this.ikWeight; // Support offset.

            this.global.skewX += ikRadianB;
            this.global.skewY += ikRadianB;
            this.global.x = parentGlobal.x + Math.cos(parentGlobal.skewY) * lP;
            this.global.y = parentGlobal.y + Math.sin(parentGlobal.skewY) * lP;
            this.global.toMatrix(this.globalTransformMatrix);
        }
        /**
         * @inheritDoc
         */
        public _setArmature(value: Armature): void {
            if (this._armature == value) {
                return;
            }

            this._ik = null;

            let oldSlots: Array<Slot> = null;
            let oldBones: Array<Bone> = null;

            if (this._armature) {
                oldSlots = this.getSlots();
                oldBones = this.getBones();
                this._armature._removeBoneFromBoneList(this);
            }

            this._armature = value;

            if (this._armature) {
                this._armature._addBoneToBoneList(this);
            }

            if (oldSlots) {
                for (let i = 0, l = oldSlots.length; i < l; ++i) {
                    const slot = oldSlots[i];
                    if (slot.parent == this) {
                        slot._setArmature(this._armature);
                    }
                }
            }

            if (oldBones) {
                for (let i = 0, l = oldBones.length; i < l; ++i) {
                    const bone = oldBones[i];
                    if (bone.parent == this) {
                        bone._setArmature(this._armature);
                    }
                }
            }
        }
        /**
         * @private
         */
        public _setIK(value: Bone, chain: number, chainIndex: number): void {
            if (value) {
                if (chain == chainIndex) {
                    let chainEnd = this._parent;
                    if (chain && chainEnd) {
                        chain = 1;
                    } else {
                        chain = 0;
                        chainIndex = 0;
                        chainEnd = this;
                    }

                    if (chainEnd == value || chainEnd.contains(value)) {
                        value = null;
                        chain = 0;
                        chainIndex = 0;
                    } else {
                        let ancestor = value;
                        while (ancestor.ik && ancestor.ikChain) {
                            if (chainEnd.contains(ancestor.ik)) {
                                value = null;
                                chain = 0;
                                chainIndex = 0;
                                break;
                            }

                            ancestor = ancestor.parent;
                        }
                    }
                }
            } else {
                chain = 0;
                chainIndex = 0;
            }

            this._ik = value;
            this._ikChain = chain;
            this._ikChainIndex = chainIndex;

            if (this._armature) {
                this._armature._bonesDirty = true;
            }
        }
        /**
         * @private
         */
        public _update(cacheFrameIndex: number): void {
            this._blendIndex = 0;

            if (cacheFrameIndex >= 0) {
                const cacheFrame = this._cacheFrames[cacheFrameIndex];

                if (this.globalTransformMatrix == cacheFrame) // Same cache.
                {
                    this._transformDirty = BoneTransformDirty.None;
                } else if (cacheFrame) { // Has been Cached.
                    this._transformDirty = BoneTransformDirty.All; // For update children and ik children.
                    this.globalTransformMatrix = cacheFrame;
                } else if (
                    this._transformDirty == BoneTransformDirty.All ||
                    (this._parent && this._parent._transformDirty != BoneTransformDirty.None) ||
                    (this._ik && this.ikWeight > 0 && this._ik._transformDirty != BoneTransformDirty.None)
                ) {
                    this._transformDirty = BoneTransformDirty.All; // For update children and ik children.
                    this.globalTransformMatrix = this._globalTransformMatrix;
                } else if (this.globalTransformMatrix != this._globalTransformMatrix) { // Same cache but not cached yet.
                    this._transformDirty = BoneTransformDirty.None;
                    this._cacheFrames[cacheFrameIndex] = this.globalTransformMatrix;
                } else {
                    this._transformDirty = BoneTransformDirty.Self;
                    this.globalTransformMatrix = this._globalTransformMatrix;
                }
            } else if (
                this._transformDirty == BoneTransformDirty.All ||
                (this._parent && this._parent._transformDirty) ||
                (this._ik && this.ikWeight > 0 && this._ik._transformDirty != BoneTransformDirty.None)
            ) {
                this._transformDirty = BoneTransformDirty.All; // For update children and ik children.
                this.globalTransformMatrix = this._globalTransformMatrix;
            }

            if (this._transformDirty != BoneTransformDirty.None) {
                if (this._transformDirty == BoneTransformDirty.All) {
                    this._transformDirty = BoneTransformDirty.Self;
                } else {
                    this._transformDirty = BoneTransformDirty.None;
                }

                if (this.globalTransformMatrix == this._globalTransformMatrix) {
                    /*this.global.copyFrom(this.origin).add(this.offset).add(this._animationPose);*/
                    this.global.x = this.origin.x + this.offset.x + this._animationPose.x;
                    this.global.y = this.origin.y + this.offset.y + this._animationPose.y;
                    this.global.skewX = this.origin.skewX + this.offset.skewX + this._animationPose.skewX;
                    this.global.skewY = this.origin.skewY + this.offset.skewY + this._animationPose.skewY;
                    this.global.scaleX = this.origin.scaleX * this.offset.scaleX * this._animationPose.scaleX;
                    this.global.scaleY = this.origin.scaleY * this.offset.scaleY * this._animationPose.scaleY;

                    this._updateGlobalTransformMatrix();

                    if (this._ik && this._ikChainIndex == this._ikChain && this.ikWeight > 0) {
                        if (this.inheritTranslation && this._ikChain > 0 && this._parent) {
                            this._computeIKB();
                        } else {
                            this._computeIKA();
                        }
                    }

                    if (cacheFrameIndex >= 0) {
                        this.globalTransformMatrix = BoneTimelineData.cacheFrame(this._cacheFrames, cacheFrameIndex, this._globalTransformMatrix);
                    }
                }
            }
        }
        /**
         * @language zh_CN
         * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @version DragonBones 3.0
         */
        public invalidUpdate(): void {
            this._transformDirty = BoneTransformDirty.All;
        }
        /**
         * @language zh_CN
         * 是否包含某个指定的骨骼或插槽。
         * @return [true: 包含，false: 不包含]
         * @see dragonBones.TransformObject
         * @version DragonBones 3.0
         */
        public contains(child: TransformObject): boolean {
            if (child) {
                if (child == this) {
                    return false;
                }

                let ancestor = child;
                while (ancestor != this && ancestor) {
                    ancestor = ancestor.parent;
                }

                return ancestor == this;
            }

            return false;
        }
        /**
         * @language zh_CN
         * 所有的子骨骼。
         * @version DragonBones 3.0
         */
        public getBones(): Array<Bone> {
            this._bones.length = 0;

            const bones = this._armature.getBones();
            for (let i = 0, l = bones.length; i < l; ++i) {
                const bone = bones[i];
                if (bone.parent == this) {
                    this._bones.push(bone);
                }
            }

            return this._bones;
        }
        /**
         * @language zh_CN
         * 所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        public getSlots(): Array<Slot> {
            this._slots.length = 0;

            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                if (slot.parent == this) {
                    this._slots.push(slot);
                }
            }

            return this._slots;
        }
        /**
         * @private
         */
        public get ikChain(): number {
            return this._ikChain;
        }
        /**
         * @private
         */
        public get ikChainIndex(): number {
            return this._ikChainIndex;
        }
        /**
         * @language zh_CN
         * 当前的 IK 约束目标。
         * @version DragonBones 4.5
         */
        public get ik(): Bone {
            return this._ik;
        }
        /**
         * @language zh_CN
         * 控制此骨骼所有插槽的显示。 (默认: true)
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        public get visible(): boolean {
            return this._visible;
        }
        public set visible(value: boolean) {
            if (this._visible == value) {
                return;
            }

            this._visible = value;
            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                if (slot._parent == this) {
                    slot._updateVisible();
                }
            }
        }

        /**
         * 不推荐使用
         * @see dragonBones.Armature#getSlot()
         */
        public get slot(): Slot {
            const slots = this._armature.getSlots();
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slot = slots[i];
                if (slot.parent == this) {
                    return slot;
                }
            }

            return null;
        }
    }
}