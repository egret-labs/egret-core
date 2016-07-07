namespace dragonBones {
    /**
     * @private
     */
    export class ObjectDataParser extends DataParser {
        /**
         * @private
         */
        protected static _getBoolean(rawData: any, key: string, defaultValue: boolean): boolean {
            if (key in rawData) {
                const value = rawData[key];
                const valueType = typeof value;
                if (valueType == "boolean") {
                    return value;
                } else if (valueType == "string") {
                    switch (value) {
                        case "0":
                        case "NaN":
                        case "":
                        case "false":
                        case "null":
                        case "undefined":
                            return false;

                        default:
                            return true;
                    }
                } else {
                    return Boolean(value);
                }
            }

            return defaultValue;
        }
        /**
         * @private
         */
        protected static _getNumber(rawData: any, key: string, defaultValue: number): number {
            if (key in rawData) {
                const value = rawData[key];
                if (value == null || value == "NaN") {
                    return defaultValue;
                }

                return Number(value);
            }

            return defaultValue;
        }
        /**
         * @private
         */
        protected static _getString(rawData: any, key: string, defaultValue: string): string {
            if (key in rawData) {
                return String(rawData[key]);
            }

            return defaultValue;
        }
        /**
         * @private
         */
        protected static _getParameter(rawData: Array<any>, index: number, defaultValue: any): any {
            if (rawData.length > index) {
                return rawData[index];
            }

            return defaultValue;
        }
        /**
         * @private
         */
        public constructor() {
            super();
        }
        /**
         * @private
         */
        protected _parseArmature(rawData: any): ArmatureData {
            const armature = BaseObject.borrowObject(ArmatureData);
            armature.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            armature.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, this._data.frameRate);

            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] == "string") {
                armature.type = ObjectDataParser._getArmatureType(rawData[ObjectDataParser.TYPE]);
            } else {
                armature.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, ArmatureType.Armature);
            }

            this._armature = armature;
            this._rawBones.length = 0;

            if (ObjectDataParser.BONE in rawData) {
                const bones = <Array<any>>rawData[ObjectDataParser.BONE];
                for (let i = 0, l = bones.length; i < l; ++i) {
                    const boneObject = bones[i];
                    const bone = this._parseBone(boneObject);
                    armature.addBone(bone, ObjectDataParser._getString(boneObject, ObjectDataParser.PARENT, null));
                    this._rawBones.push(bone);
                }
            }

            if (ObjectDataParser.IK in rawData) {
                const iks = <Array<any>>rawData[ObjectDataParser.IK];
                for (let i = 0, l = iks.length; i < l; ++i) {
                    this._parseIK(iks[i]);
                }
            }

            if (ObjectDataParser.SLOT in rawData) {
                const slots = <Array<any>>rawData[ObjectDataParser.SLOT];
                for (let i = 0, l = slots.length; i < l; ++i) {
                    armature.addSlot(this._parseSlot(slots[i]));
                }
            }

            if (ObjectDataParser.SKIN in rawData) {
                const skins = <Array<any>>rawData[ObjectDataParser.SKIN];
                for (let i = 0, l = skins.length; i < l; ++i) {
                    armature.addSkin(this._parseSkin(skins[i]));
                }
            }

            if (ObjectDataParser.ANIMATION in rawData) {
                const animations = <Array<any>>rawData[ObjectDataParser.ANIMATION];
                for (let i = 0, l = animations.length; i < l; ++i) {
                    armature.addAnimation(this._parseAnimation(animations[i]));
                }
            }

            this._armature = null;
            this._rawBones.length = 0;

            if (this._isParentCooriinate && ObjectDataParser._getBoolean(rawData, ObjectDataParser.IS_GLOBAL, true)) {
                this._globalToLocal(armature);
            }

            return armature;
        }
        /**
         * @private
         */
        protected _parseBone(rawData: any): BoneData {
            const bone = BaseObject.borrowObject(BoneData);
            bone.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            bone.inheritTranslation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_TRANSLATION, true);
            bone.inheritRotation = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_ROTATION, true);
            bone.inheritScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.INHERIT_SCALE, true);
            bone.length = ObjectDataParser._getNumber(rawData, ObjectDataParser.LENGTH, 0) * this._armatureScale;

            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], bone.transform);
            }

            if (this._isParentCooriinate) {
                bone.inheritRotation = true;
                bone.inheritScale = false;
            }

            return bone;
        }
        /**
         * @private
         */
        protected _parseIK(rawData: any): void {
            const bone = this._armature.getBone(ObjectDataParser._getString(rawData, (ObjectDataParser.BONE in rawData) ? ObjectDataParser.BONE : ObjectDataParser.NAME, null));
            if (bone) {
                bone.ik = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.TARGET, null));
                bone.bendPositive = ObjectDataParser._getBoolean(rawData, ObjectDataParser.BEND_POSITIVE, true);
                bone.chain = ObjectDataParser._getNumber(rawData, ObjectDataParser.CHAIN, 0);
                bone.weight = ObjectDataParser._getNumber(rawData, ObjectDataParser.WEIGHT, 1);

                if (bone.chain > 0 && bone.parent && !bone.parent.ik) {
                    bone.parent.ik = bone.ik;
                    bone.parent.chainIndex = 0;
                    bone.parent.chain = 0;
                    bone.chainIndex = 1;
                } else {
                    bone.chain = 0;
                    bone.chainIndex = 0;
                }
            }
        }
        /**
         * @private
         */
        protected _parseSlot(rawData: any): SlotData {
            const slot = BaseObject.borrowObject(SlotData);
            slot.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            slot.parent = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.PARENT, null));
            slot.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            slot.zOrder = ObjectDataParser._getNumber(rawData, ObjectDataParser.Z_ORDER, this._armature.sortedSlots.length);

            if (ObjectDataParser.COLOR in rawData) {
                slot.color = SlotData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR], slot.color);
            } else {
                slot.color = SlotData.DEFAULT_COLOR;
            }

            if (ObjectDataParser.BLEND_MODE in rawData && typeof rawData[ObjectDataParser.BLEND_MODE] == "string") {
                slot.blendMode = ObjectDataParser._getBlendMode(rawData[ObjectDataParser.BLEND_MODE]);
            } else {
                slot.blendMode = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLEND_MODE, BlendMode.Normal);
            }

            if (this._isParentCooriinate) {
                if (ObjectDataParser.COLOR_TRANSFORM in rawData) {
                    slot.color = SlotData.generateColor();
                    this._parseColorTransform(rawData[ObjectDataParser.COLOR_TRANSFORM], slot.color);
                } else {
                    slot.color = SlotData.DEFAULT_COLOR;
                }
            }

            return slot;
        }
        /**
         * @private
         */
        protected _parseSkin(rawData: any): SkinData {
            const skin = BaseObject.borrowObject(SkinData);
            skin.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "__default") || "__default";

            if (ObjectDataParser.SLOT in rawData) {
                this._skin = skin;

                const slots = <Array<any>>rawData[ObjectDataParser.SLOT];
                for (let i = 0, l = slots.length; i < l; ++i) {
                    if (this._isParentCooriinate) {
                        this._armature.addSlot(this._parseSlot(slots[i]));
                    }

                    skin.addSlot(this._parseSlotDisplaySet(slots[i]));
                }

                this._skin = null;
            }

            return skin;
        }
        /**
         * @private
         */
        protected _parseSlotDisplaySet(rawData: any): SlotDisplayDataSet {
            const slotDisplayDataSet = BaseObject.borrowObject(SlotDisplayDataSet);
            slotDisplayDataSet.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));

            if (ObjectDataParser.DISPLAY in rawData) {
                const displayObjectSet = <Array<any>>rawData[ObjectDataParser.DISPLAY];
                const displayDataSet = slotDisplayDataSet.displays;

                this._slotDisplayDataSet = slotDisplayDataSet;

                for (let i = 0, l = displayObjectSet.length; i < l; ++i) {
                    displayDataSet.push(this._parseDisplay(displayObjectSet[i]));
                }

                this._slotDisplayDataSet = null;
            }

            return slotDisplayDataSet;
        }
        /**
         * @private
         */
        protected _parseDisplay(rawData: any): DisplayData {
            const display = BaseObject.borrowObject(DisplayData);
            display.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            if (ObjectDataParser.TYPE in rawData && typeof rawData[ObjectDataParser.TYPE] == "string") {
                display.type = ObjectDataParser._getDisplayType(rawData[ObjectDataParser.TYPE]);
            } else {
                display.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, DisplayType.Image);
            }

            display.isRelativePivot = true;
            if (ObjectDataParser.PIVOT in rawData) {
                const pivotObject = rawData[ObjectDataParser.PIVOT];
                display.pivot.x = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.X, 0);
                display.pivot.y = ObjectDataParser._getNumber(pivotObject, ObjectDataParser.Y, 0);
            } else if (this._isParentCooriinate) {
                const transformObject = rawData[ObjectDataParser.TRANSFORM];
                display.isRelativePivot = false;
                display.pivot.x = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_X, 0) * this._armatureScale;
                display.pivot.y = ObjectDataParser._getNumber(transformObject, ObjectDataParser.PIVOT_Y, 0) * this._armatureScale;
            } else {
                display.pivot.x = 0.5;
                display.pivot.y = 0.5;
            }

            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], display.transform);
            }

            switch (display.type) {
                case DisplayType.Image:
                    break;

                case DisplayType.Armature:
                    break;

                case DisplayType.Mesh:
                    display.meshData = this._parseMesh(rawData);
                    break;
            }

            return display;
        }
        /**
         * @private
         */
        protected _parseMesh(rawData: any): MeshData {
            const mesh = BaseObject.borrowObject(MeshData);

            const rawVertices = <Array<number>>rawData[ObjectDataParser.VERTICES];
            const rawUVs = <Array<number>>rawData[ObjectDataParser.UVS];
            const rawTriangles = <Array<number>>rawData[ObjectDataParser.TRIANGLES];

            const numVertices = Math.floor(rawVertices.length / 2);
            const numTriangles = Math.floor(rawTriangles.length / 3);

            const inverseBindPose = new Array<Matrix>(this._armature.sortedBones.length);

            mesh.skinned = (ObjectDataParser.WEIGHTS in rawData) && (<Array<number>>rawData[ObjectDataParser.WEIGHTS]).length > 0;
            mesh.uvs.length = numVertices * 2;
            mesh.vertices.length = numVertices * 2;
            mesh.vertexIndices.length = numTriangles * 3;

            if (mesh.skinned) {
                mesh.boneIndices.length = numVertices;
                mesh.weights.length = numVertices;
                mesh.boneVertices.length = numVertices;

                if (ObjectDataParser.SLOT_POSE in rawData) {
                    const rawSlotPose = <Array<number>>rawData[ObjectDataParser.SLOT_POSE];
                    mesh.slotPose.a = rawSlotPose[0];
                    mesh.slotPose.b = rawSlotPose[1];
                    mesh.slotPose.c = rawSlotPose[2];
                    mesh.slotPose.d = rawSlotPose[3];
                    mesh.slotPose.tx = rawSlotPose[4];
                    mesh.slotPose.ty = rawSlotPose[5];
                }

                if (ObjectDataParser.BONE_POSE in rawData) {
                    const rawBonePose = <Array<number>>rawData[ObjectDataParser.BONE_POSE];
                    for (let i = 0, l = rawBonePose.length; i < l; i += 7) {
                        const rawBoneIndex = rawBonePose[i];
                        const boneMatrix = inverseBindPose[rawBoneIndex] = new Matrix();
                        boneMatrix.a = rawBonePose[i + 1];
                        boneMatrix.b = rawBonePose[i + 2];
                        boneMatrix.c = rawBonePose[i + 3];
                        boneMatrix.d = rawBonePose[i + 4];
                        boneMatrix.tx = rawBonePose[i + 5];
                        boneMatrix.ty = rawBonePose[i + 6];
                        boneMatrix.invert();
                    }
                }
            }

            for (let i = 0, iW = 0, l = rawVertices.length; i < l; i += 2) {
                const iN = i + 1;
                const vertexIndex = i / 2;

                let x = mesh.vertices[i] = rawVertices[i] * this._armatureScale;
                let y = mesh.vertices[iN] = rawVertices[iN] * this._armatureScale;
                mesh.uvs[i] = rawUVs[i];
                mesh.uvs[iN] = rawUVs[iN];

                if (mesh.skinned) {
                    const rawWeights = <Array<number>>rawData[ObjectDataParser.WEIGHTS];
                    const numBones = rawWeights[iW];
                    const indices = mesh.boneIndices[vertexIndex] = new Array<number>(numBones);
                    const weights = mesh.weights[vertexIndex] = new Array<number>(numBones);
                    const boneVertices = mesh.boneVertices[vertexIndex] = new Array<number>(numBones * 2);

                    mesh.slotPose.transformPoint(x, y, this._helpPoint);
                    x = mesh.vertices[i] = this._helpPoint.x;
                    y = mesh.vertices[iN] = this._helpPoint.y;

                    for (let iB = 0; iB < numBones; ++iB) {
                        const iI = iW + 1 + iB * 2;
                        const rawBoneIndex = rawWeights[iI];
                        const boneData = this._rawBones[rawBoneIndex];

                        let boneIndex = mesh.bones.indexOf(boneData);
                        if (boneIndex < 0) {
                            boneIndex = mesh.bones.length;
                            mesh.bones[boneIndex] = boneData;
                            mesh.inverseBindPose[boneIndex] = inverseBindPose[rawBoneIndex];
                        }

                        mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint);

                        indices[iB] = boneIndex;
                        weights[iB] = rawWeights[iI + 1];
                        boneVertices[iB * 2] = this._helpPoint.x;
                        boneVertices[iB * 2 + 1] = this._helpPoint.y;
                    }

                    iW += numBones * 2 + 1;
                }
            }

            for (let i = 0, l = rawTriangles.length; i < l; ++i) {
                mesh.vertexIndices[i] = rawTriangles[i];
            }

            return mesh;
        }
        /**
         * @private
         */
        protected _parseAnimation(rawData: any): AnimationData {
            const animation = BaseObject.borrowObject(AnimationData);
            animation.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, "__default") || "__default";
            animation.frameCount = Math.max(ObjectDataParser._getNumber(rawData, ObjectDataParser.DURATION, 1), 1);
            animation.position = ObjectDataParser._getNumber(rawData, ObjectDataParser.POSITION, 0) / this._armature.frameRate;
            animation.duration = animation.frameCount / this._armature.frameRate;
            animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.PLAY_TIMES, 1);
            animation.fadeInTime = ObjectDataParser._getNumber(rawData, ObjectDataParser.FADE_IN_TIME, 0);

            this._animation = animation;

            const animationName = ObjectDataParser._getString(rawData, ObjectDataParser.ANIMATION, null);
            if (animationName) {
                animation.animation = this._armature.getAnimation(animationName);
                if (!animation.animation) {
                    //
                }

                return animation;
            }

            this._parseTimeline(rawData, animation, this._parseAnimationFrame);

            if (ObjectDataParser.BONE in rawData) {
                const boneTimelines = <Array<any>>rawData[ObjectDataParser.BONE];
                for (let i = 0, l = boneTimelines.length; i < l; ++i) {
                    animation.addBoneTimeline(this._parseBoneTimeline(boneTimelines[i]));
                }
            }

            if (ObjectDataParser.SLOT in rawData) {
                const slotTimelines = <Array<any>>rawData[ObjectDataParser.SLOT];
                for (let i = 0, l = slotTimelines.length; i < l; ++i) {
                    animation.addSlotTimeline(this._parseSlotTimeline(slotTimelines[i]));
                }
            }

            if (ObjectDataParser.FFD in rawData) {
                const ffdTimelines = <Array<any>>rawData[ObjectDataParser.FFD];
                for (let i = 0, l = ffdTimelines.length; i < l; ++i) {
                    animation.addFFDTimeline(this._parseFFDTimeline(ffdTimelines[i]));
                }
            }

            if (this._isParentCooriinate) {
                this._isAutoTween = ObjectDataParser._getBoolean(rawData, ObjectDataParser.AUTO_TWEEN, true);
                this._animationTweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, 0) || 0;
                animation.playTimes = ObjectDataParser._getNumber(rawData, ObjectDataParser.LOOP, 1);

                if (ObjectDataParser.TIMELINE in rawData) {
                    const timelines = <Array<any>>rawData[ObjectDataParser.TIMELINE];
                    for (let i = 0, l = timelines.length; i < l; ++i) {
                        animation.addBoneTimeline(this._parseBoneTimeline(timelines[i]));
                    }

                    for (let i = 0, l = timelines.length; i < l; ++i) {
                        animation.addSlotTimeline(this._parseSlotTimeline(timelines[i]));
                    }
                }
            } else {
                this._isAutoTween = false;
                this._animationTweenEasing = 0;
            }

            for (let i in this._armature.bones) {
                const bone = this._armature.bones[i];
                if (!animation.getBoneTimeline(bone.name))  // Add default bone timeline for cache if do not have one.
                {
                    const boneTimeline = BaseObject.borrowObject(BoneTimelineData);
                    const boneFrame = BaseObject.borrowObject(BoneFrameData);
                    boneTimeline.bone = bone;
                    boneTimeline.frames[0] = boneFrame;
                    animation.addBoneTimeline(boneTimeline);
                }
            }

            for (let i in this._armature.slots) {
                const slot = this._armature.slots[i];
                if (!animation.getSlotTimeline(slot.name)) // Add default slot timeline for cache if do not have one.
                {
                    const slotTimeline = BaseObject.borrowObject(SlotTimelineData);
                    const slotFrame = BaseObject.borrowObject(SlotFrameData);
                    slotTimeline.slot = slot;
                    slotFrame.displayIndex = slot.displayIndex;
                    //slotFrame.zOrder = -2;

                    if (slot.color == SlotData.DEFAULT_COLOR) {
                        slotFrame.color = SlotFrameData.DEFAULT_COLOR;
                    } else {
                        slotFrame.color = SlotFrameData.generateColor();
                        slotFrame.color.copyFrom(slot.color);
                    }

                    slotTimeline.frames[0] = slotFrame;
                    animation.addSlotTimeline(slotTimeline);

                    if (this._isParentCooriinate) {
                        slotFrame.displayIndex = -1;
                    }
                }
            }

            this._animation = null;

            return animation;
        }
        /**
         * @private
         */
        protected _parseBoneTimeline(rawData: any): BoneTimelineData {
            const timeline = BaseObject.borrowObject(BoneTimelineData);
            timeline.bone = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));

            this._parseTimeline(rawData, timeline, this._parseBoneFrame);

            const originTransform = timeline.originTransform;
            let prevFrame = null;

            for (let i = 0, l = timeline.frames.length; i < l; ++i) {
                const frame = timeline.frames[i];
                if (!prevFrame) {
                    originTransform.copyFrom(frame.transform);
                    frame.transform.identity();
                } else if (prevFrame != frame) {
                    frame.transform.minus(originTransform);
                }

                prevFrame = frame;
            }

            if (timeline.scale != 1 || timeline.offset != 0) {
                this._animation.hasAsynchronyTimeline = true;
            }

            return timeline;
        }
        /**
         * @private
         */
        protected _parseSlotTimeline(rawData: any): SlotTimelineData {
            const timeline = BaseObject.borrowObject(SlotTimelineData);
            timeline.slot = this._armature.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null));

            this._parseTimeline(rawData, timeline, this._parseSlotFrame);

            if (timeline.scale != 1 || timeline.offset != 0) {
                this._animation.hasAsynchronyTimeline = true;
            }

            return timeline;
        }
        /**
         * @private
         */
        protected _parseFFDTimeline(rawData: any): FFDTimelineData {
            const timeline = BaseObject.borrowObject(FFDTimelineData);
            timeline.skin = this._armature.getSkin(ObjectDataParser._getString(rawData, ObjectDataParser.SKIN, null));
            timeline.slot = timeline.skin.getSlot(ObjectDataParser._getString(rawData, ObjectDataParser.SLOT, null)); // NAME;

            const meshName = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
            for (let i = 0, l = timeline.slot.displays.length; i < l; ++i) {
                const displayData = timeline.slot.displays[i];
                if (displayData.meshData && displayData.name == meshName) {
                    timeline.displayIndex = i; // rawData[DISPLAY_INDEX];
                    this._mesh = displayData.meshData;
                    break;
                }
            }

            this._parseTimeline(rawData, timeline, this._parseFFDFrame);

            this._mesh = null;

            return timeline;
        }
        /**
         * @private
         */
        protected _parseAnimationFrame(rawData: any, frameStart: number, frameCount: number): AnimationFrameData {
            const frame = BaseObject.borrowObject(AnimationFrameData);

            this._parseFrame(rawData, frame, frameStart, frameCount);

            if (ObjectDataParser.ACTION in rawData) {
                this._parseActionData(rawData, frame.actions, null, null);
            }

            if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
                this._parseEventData(rawData, frame.events, null, null);
            }

            return frame;
        }
        /**
         * @private
         */
        protected _parseBoneFrame(rawData: Object, frameStart: number, frameCount: number): BoneFrameData {
            const frame = BaseObject.borrowObject(BoneFrameData);
            frame.parent = this._armature.getBone(ObjectDataParser._getString(rawData, ObjectDataParser.PARENT, null));
            frame.tweenRotate = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_ROTATE, 0);
            frame.tweenScale = ObjectDataParser._getBoolean(rawData, ObjectDataParser.TWEEN_SCALE, true);

            this._parseTweenFrame(rawData, frame, frameStart, frameCount);

            if (ObjectDataParser.TRANSFORM in rawData) {
                this._parseTransform(rawData[ObjectDataParser.TRANSFORM], frame.transform);
            }

            const bone = (<BoneTimelineData>this._timeline).bone;

            if ((ObjectDataParser.EVENT in rawData) || (ObjectDataParser.SOUND in rawData)) {
                this._parseEventData(rawData, frame.events, bone, null);
                this._animation.hasBoneTimelineEvent = true;
            }

            if (ObjectDataParser.ACTION in rawData) {
                const slot = this._armature.getSlot(bone.name);
                this._parseActionData(rawData, frame.actions, bone, slot);
                this._animation.hasBoneTimelineEvent = true;
            }

            return frame;
        }
        /**
         * @private
         */
        protected _parseSlotFrame(rawData: any, frameStart: number, frameCount: number): SlotFrameData {
            const frame = BaseObject.borrowObject(SlotFrameData);
            frame.displayIndex = ObjectDataParser._getNumber(rawData, ObjectDataParser.DISPLAY_INDEX, 0);
            //frame.zOrder = _getNumber(rawData, Z_ORDER, -1); // TODO zorder

            this._parseTweenFrame(rawData, frame, frameStart, frameCount);

            if (ObjectDataParser.COLOR in rawData || ObjectDataParser.COLOR_TRANSFORM in rawData) {
                frame.color = SlotFrameData.generateColor();
                this._parseColorTransform(rawData[ObjectDataParser.COLOR] || rawData[ObjectDataParser.COLOR_TRANSFORM], frame.color);
            } else {
                frame.color = SlotFrameData.DEFAULT_COLOR;
            }

            if (this._isParentCooriinate) {
                if (ObjectDataParser._getBoolean(rawData, ObjectDataParser.HIDE, false)) {
                    frame.displayIndex = -1;
                }
            } else if (ObjectDataParser.ACTION in rawData) {
                const slot = (<SlotTimelineData>this._timeline).slot;
                this._parseActionData(rawData, frame.actions, slot.parent, slot);
            }

            return frame;
        }
        /**
         * @private
         */
        protected _parseFFDFrame(rawData: any, frameStart: number, frameCount: number): ExtensionFrameData {
            const frame = BaseObject.borrowObject(ExtensionFrameData);
            frame.type = ObjectDataParser._getNumber(rawData, ObjectDataParser.TYPE, ExtensionType.FFD);

            this._parseTweenFrame(rawData, frame, frameStart, frameCount);

            const rawVertices = <Array<number>>rawData[ObjectDataParser.VERTICES];
            const offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0);
            let x = 0;
            let y = 0;
            for (let i = 0, l = this._mesh.vertices.length; i < l; i += 2) {
                if (i < offset || i - offset >= rawVertices.length) {
                    x = 0;
                    y = 0;
                } else {
                    x = rawVertices[i - offset] * this._armatureScale;
                    y = rawVertices[i + 1 - offset] * this._armatureScale;
                }

                if (this._mesh.skinned) {
                    this._mesh.slotPose.transformPoint(x, y, this._helpPoint, true);
                    x = this._helpPoint.x;
                    y = this._helpPoint.y;

                    const boneIndices = this._mesh.boneIndices[i / 2];
                    for (let iB = 0, lB = boneIndices.length; iB < lB; ++iB) {
                        const boneIndex = boneIndices[iB];
                        this._mesh.inverseBindPose[boneIndex].transformPoint(x, y, this._helpPoint, true);
                        frame.tweens.push(this._helpPoint.x, this._helpPoint.y);
                    }
                } else {
                    frame.tweens.push(x, y);
                }
            }

            return frame;
        }
        /**
         * @private
         */
        protected _parseTweenFrame<T extends TweenFrameData<T>>(rawData: any, frame: T, frameStart: number, frameCount: number): void {
            this._parseFrame(rawData, frame, frameStart, frameCount);

            if (ObjectDataParser.TWEEN_EASING in rawData) {
                frame.tweenEasing = ObjectDataParser._getNumber(rawData, ObjectDataParser.TWEEN_EASING, DragonBones.NO_TWEEN);
            } else if (this._isParentCooriinate) {
                frame.tweenEasing = this._isAutoTween ? this._animationTweenEasing : DragonBones.NO_TWEEN;
            }

            if (ObjectDataParser.CURVE in rawData) {
                frame.curve = TweenFrameData.samplingCurve(rawData[ObjectDataParser.CURVE], frameCount);
            }
        }
        /**
         * @private
         */
        protected _parseFrame<T extends FrameData<T>>(rawData: any, frame: T, frameStart: number, frameCount: number): void {
            frame.position = frameStart / this._armature.frameRate;
            frame.duration = frameCount / this._armature.frameRate;
        }
        /**
         * @private
         */
        protected _parseTimeline<T extends FrameData<T>>(rawData: Object, timeline: TimelineData<T>, frameParser: (rawData: any, frameStart: number, frameCount: number) => T): void {
            timeline.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, 1);
            timeline.offset = ObjectDataParser._getNumber(rawData, ObjectDataParser.OFFSET, 0);

            this._timeline = timeline;

            if (ObjectDataParser.FRAME in rawData) {
                const rawFrames = <Array<any>>rawData[ObjectDataParser.FRAME];
                if (rawFrames.length) {
                    if (rawFrames.length == 1) {
                        timeline.frames.length = 1;
                        timeline.frames[0] = frameParser.call(this, rawFrames[0], 0, ObjectDataParser._getNumber(rawFrames[0], ObjectDataParser.DURATION, 1));
                    } else {
                        timeline.frames.length = this._animation.frameCount + 1;

                        let frameStart = 0;
                        let frameCount = 0;
                        let frame: T = null;
                        let prevFrame: T = null;

                        for (let i = 0, iW = 0, l = this._animation.frameCount + 1; i < l; ++i) {
                            if (frameStart + frameCount <= i && iW < rawFrames.length) {
                                const frameObject = rawFrames[iW++];
                                frameStart = i;
                                frameCount = ObjectDataParser._getNumber(frameObject, ObjectDataParser.DURATION, 1);
                                frame = frameParser.call(this, frameObject, frameStart, frameCount);

                                if (prevFrame) {
                                    prevFrame.next = frame;
                                    frame.prev = prevFrame;

                                    if (this._isParentCooriinate) {
                                        if (prevFrame instanceof TweenFrameData && frameObject[ObjectDataParser.DISPLAY_INDEX] == -1) {
                                            (<TweenFrameData<T>><any>prevFrame).tweenEasing = DragonBones.NO_TWEEN;
                                        }
                                    }
                                }

                                prevFrame = frame;
                            }

                            timeline.frames[i] = frame;
                        }

                        frame.duration = this._animation.duration - frame.position; // Modify last frame duration

                        frame = timeline.frames[0];
                        prevFrame.next = frame;
                        frame.prev = prevFrame;

                        if (this._isParentCooriinate) {
                            if (prevFrame instanceof TweenFrameData && rawFrames[0][ObjectDataParser.DISPLAY_INDEX] == -1) {
                                (<TweenFrameData<T>><any>prevFrame).tweenEasing = DragonBones.NO_TWEEN;
                            }
                        }
                    }
                }
            }

            this._timeline = null;
        }
        /**
         * @private
         */
        protected _parseActionData(rawData: any, actions: Array<ActionData>, bone: BoneData, slot: SlotData): void {
            const actionsObject = rawData[ObjectDataParser.ACTION];
            if (typeof actionsObject == "string") {
                const actionData = BaseObject.borrowObject(ActionData);
                actionData.type = ActionType.FadeIn;
                actionData.data = [actionsObject, -1, -1];
                actionData.bone = bone;
                actionData.slot = slot;
                actions.push(actionData);
            } else if (actionsObject instanceof Array) {
                for (let i = 0, l = actionsObject.length; i < l; ++i) {
                    const actionObject = <Array<any>>actionsObject[i];
                    const actionData = BaseObject.borrowObject(ActionData);
                    const actionType = actionObject[0];
                    if (typeof actionType == "string") {
                        actionData.type = ObjectDataParser._getActionType(actionType);
                    } else {
                        actionData.type = ObjectDataParser._getParameter(actionObject, 0, ActionType.FadeIn);
                    }

                    switch (actionData.type) {
                        case ActionType.Play:
                            actionData.data = [
                                ObjectDataParser._getParameter(actionObject, 1, null), // animationName
                                ObjectDataParser._getParameter(actionObject, 2, -1), // playTimes
                            ];
                            break;

                        case ActionType.Stop:
                            actionData.data = [
                                ObjectDataParser._getParameter(actionObject, 1, null) // animation
                            ];
                            break;

                        case ActionType.GotoAndPlay:
                            actionData.data = [
                                ObjectDataParser._getParameter(actionObject, 1, null), // animationName
                                ObjectDataParser._getParameter(actionObject, 2, 0), // time
                                ObjectDataParser._getParameter(actionObject, 3, -1) // playTimes
                            ];
                            break;

                        case ActionType.GotoAndStop:
                            actionData.data = [
                                ObjectDataParser._getParameter(actionObject, 1, null), // animationName
                                ObjectDataParser._getParameter(actionObject, 2, 0), // time
                            ];
                            break;

                        case ActionType.FadeIn:
                            actionData.data = [
                                ObjectDataParser._getParameter(actionObject, 1, null), // animationName
                                ObjectDataParser._getParameter(actionObject, 2, -1), // fadeInTime
                                ObjectDataParser._getParameter(actionObject, 3, -1) // playTimes
                            ];
                            break;

                        case ActionType.FadeOut:
                            actionData.data = [
                                ObjectDataParser._getParameter(actionObject, 1, null), // animationName
                                ObjectDataParser._getParameter(actionObject, 2, 0) // fadeOutTime
                            ];
                            break;
                    }

                    actionData.bone = bone;
                    actionData.slot = slot;
                    actions.push(actionData);
                }
            }
        }
        /**
         * @private
         */
        protected _parseEventData(rawData: any, events: Array<EventData>, bone: BoneData, slot: SlotData): void {
            if (ObjectDataParser.SOUND in rawData) {
                const soundEventData = BaseObject.borrowObject(EventData);
                soundEventData.type = EventType.Sound;
                soundEventData.name = rawData[ObjectDataParser.SOUND];
                soundEventData.bone = bone;
                soundEventData.slot = slot;
                events.push(soundEventData);
            }

            if (ObjectDataParser.EVENT in rawData) {
                const eventData = BaseObject.borrowObject(EventData);
                eventData.type = EventType.Frame;
                eventData.name = rawData[ObjectDataParser.EVENT];
                eventData.bone = bone;
                eventData.slot = slot;

                if (ObjectDataParser.DATA in rawData) {
                    eventData.data = rawData[ObjectDataParser.DATA];
                }

                events.push(eventData);
            }
        }
        /**
         * @private
         */
        protected _parseTransform(rawData: Object, transform: Transform): void {
            transform.x = ObjectDataParser._getNumber(rawData, ObjectDataParser.X, 0) * this._armatureScale;
            transform.y = ObjectDataParser._getNumber(rawData, ObjectDataParser.Y, 0) * this._armatureScale;
            transform.skewX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_X, 0) * DragonBones.ANGLE_TO_RADIAN;
            transform.skewY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SKEW_Y, 0) * DragonBones.ANGLE_TO_RADIAN;
            transform.scaleX = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_X, 1);
            transform.scaleY = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE_Y, 1);
        }
        /**
         * @private
         */
        protected _parseColorTransform(rawData: Object, color: ColorTransform): void {
            color.alphaMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_MULTIPLIER, 100) * 0.01;
            color.redMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_MULTIPLIER, 100) * 0.01;
            color.greenMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_MULTIPLIER, 100) * 0.01;
            color.blueMultiplier = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_MULTIPLIER, 100) * 0.01;
            color.alphaOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.ALPHA_OFFSET, 0);
            color.redOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.RED_OFFSET, 0);
            color.greenOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.GREEN_OFFSET, 0);
            color.blueOffset = ObjectDataParser._getNumber(rawData, ObjectDataParser.BLUE_OFFSET, 0);
        }
        /**
         * @inheritDoc
         */
        public parseDragonBonesData(rawData: any, scale: number = 1): DragonBonesData {
            if (rawData) {
                const version = ObjectDataParser._getString(rawData, ObjectDataParser.VERSION, null);
                this._isParentCooriinate = version == ObjectDataParser.DATA_VERSION_2_3 || version == ObjectDataParser.DATA_VERSION_3_0;
                this._armatureScale = scale;

                if (version == ObjectDataParser.DATA_VERSION || this._isParentCooriinate) {
                    const data = BaseObject.borrowObject(DragonBonesData);
                    data.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                    data.frameRate = ObjectDataParser._getNumber(rawData, ObjectDataParser.FRAME_RATE, 24);

                    if (ObjectDataParser.ARMATURE in rawData) {
                        this._data = data;
                        const armatures = <Array<any>>rawData[ObjectDataParser.ARMATURE];
                        for (let i = 0, l = armatures.length; i < l; ++i) {
                            data.addArmature(this._parseArmature(armatures[i]));
                        }

                        this._data = null;
                    }

                    return data;
                } else {
                    throw new Error("Nonsupport data version.");
                }
            } else {
                throw new Error();
            }

            // return null;
        }
        /**
         * @inheritDoc
         */
        public parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number = 0): TextureAtlasData {
            if (rawData) {
                // format
                textureAtlasData.name = ObjectDataParser._getString(rawData, ObjectDataParser.NAME, null);
                textureAtlasData.imagePath = ObjectDataParser._getString(rawData, ObjectDataParser.IMAGE_PATH, null);

                if (scale > 0) {
                    textureAtlasData.scale = scale;
                } else {
                    scale = textureAtlasData.scale = ObjectDataParser._getNumber(rawData, ObjectDataParser.SCALE, textureAtlasData.scale);
                }

                scale = 1 / scale;

                if (ObjectDataParser.SUB_TEXTURE in rawData) {
                    const textures = <Array<any>>rawData[ObjectDataParser.SUB_TEXTURE];
                    for (let i = 0, l = textures.length; i < l; ++i) {
                        const textureObject = textures[i];
                        const textureData = textureAtlasData.generateTextureData();
                        textureData.name = ObjectDataParser._getString(textureObject, ObjectDataParser.NAME, null);
                        textureData.rotated = ObjectDataParser._getBoolean(textureObject, ObjectDataParser.ROTATED, false);
                        textureData.region.x = ObjectDataParser._getNumber(textureObject, ObjectDataParser.X, 0) * scale;
                        textureData.region.y = ObjectDataParser._getNumber(textureObject, ObjectDataParser.Y, 0) * scale;
                        textureData.region.width = ObjectDataParser._getNumber(textureObject, ObjectDataParser.WIDTH, 0) * scale;
                        textureData.region.height = ObjectDataParser._getNumber(textureObject, ObjectDataParser.HEIGHT, 0) * scale;

                        const frameWidth = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_WIDTH, -1);
                        const frameHeight = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_HEIGHT, -1);
                        if (frameWidth > 0 && frameHeight > 0) {
                            textureData.frame = TextureData.generateRectangle();
                            textureData.frame.x = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_X, 0) * scale;
                            textureData.frame.y = ObjectDataParser._getNumber(textureObject, ObjectDataParser.FRAME_Y, 0) * scale;
                            textureData.frame.width = frameWidth * scale;
                            textureData.frame.height = frameHeight * scale;
                        }

                        textureAtlasData.addTextureData(textureData);
                    }
                }

                return textureAtlasData;
            } else {
                throw new Error();
            }

            // return null;
        }

        /**
         * @private
         */
        private static _instance: ObjectDataParser = null;
        /**
         * @private
         */
        public static getInstance(): ObjectDataParser {
            if (!ObjectDataParser._instance) {
                ObjectDataParser._instance = new ObjectDataParser();
            }

            return ObjectDataParser._instance;
        }
    }
}