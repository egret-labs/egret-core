namespace dragonBones {
    /**
     * @private
     */
    export type BuildArmaturePackage = { dataName?: string, data?: DragonBonesData, armature?: ArmatureData, skin?: SkinData };

    /**
     * @language zh_CN
     * 生成骨架的基础工厂。
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    export abstract class BaseFactory {
        /**
         * @language zh_CN
         * 是否开启共享搜索。 [true: 开启, false: 不开启] (默认: false)
         * 如果开启，创建一个骨架时，可以从多个龙骨数据中寻找骨架数据，或贴图集数据中寻找贴图数据。 (通常在有共享导出的数据时开启)
         * @see dragonBones.objects.DragonBonesData#autoSearch
         * @see dragonBones.objects.TextureAtlasData#autoSearch
         * @version DragonBones 4.5
         */
        public autoSearch: boolean = false;
        /**
         * @private
         */
        protected _objectDataParser: ObjectDataParser = new ObjectDataParser();
        /**
         * @private
         */
        protected _dragonBonesDataMap: Map<DragonBonesData> = {};
        /**
         * @private
         */
        protected _textureAtlasDataMap: Map<Array<TextureAtlasData>> = {};
        /** 
         * @private 
         */
        public constructor() {
        }
        /** 
         * @private 
         */
        protected _getTextureData(dragonBonesName: string, textureName: string): TextureData {
            let textureAtlasDataList = this._textureAtlasDataMap[dragonBonesName];
            if (textureAtlasDataList) {
                for (let i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                    const textureData = textureAtlasDataList[i].getTextureData(textureName);
                    if (textureData) {
                        return textureData;
                    }
                }
            }

            if (this.autoSearch) {
                for (let i in this._textureAtlasDataMap) {
                    textureAtlasDataList = this._textureAtlasDataMap[i];
                    for (let j = 0, lJ = textureAtlasDataList.length; j < lJ; ++j) {
                        const textureAtlasData = textureAtlasDataList[j];
                        if (textureAtlasData.autoSearch) {
                            const textureData = textureAtlasData.getTextureData(textureName);
                            if (textureData) {
                                return textureData;
                            }
                        }
                    }
                }
            }

            return null;
        }
        /**
         * @private
         */
        protected _fillBuildArmaturePackage(dragonBonesName: string, armatureName: string, skinName: string, dataPackage: BuildArmaturePackage): boolean {
            if (dragonBonesName) {
                const dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
                if (dragonBonesData) {
                    const armatureData = dragonBonesData.getArmature(armatureName);
                    if (armatureData) {
                        dataPackage.dataName = dragonBonesName;
                        dataPackage.data = dragonBonesData;
                        dataPackage.armature = armatureData;
                        dataPackage.skin = armatureData.getSkin(skinName);
                        if (!dataPackage.skin) {
                            dataPackage.skin = armatureData.defaultSkin;
                        }

                        return true;
                    }
                }
            }

            if (!dragonBonesName || this.autoSearch) {
                for (let eachDragonBonesName in this._dragonBonesDataMap) {
                    const dragonBonesData = this._dragonBonesDataMap[eachDragonBonesName];
                    if (!dragonBonesName || dragonBonesData.autoSearch) {
                        const armatureData = dragonBonesData.getArmature(armatureName);
                        if (armatureData) {
                            dataPackage.dataName = eachDragonBonesName;
                            dataPackage.data = dragonBonesData;
                            dataPackage.armature = armatureData;
                            dataPackage.skin = armatureData.getSkin(skinName);
                            if (!dataPackage.skin) {
                                dataPackage.skin = armatureData.defaultSkin;
                            }

                            return true;
                        }
                    }
                }
            }

            return false;
        }
        /**
         * @private
         */
        protected _buildBones(dataPackage: BuildArmaturePackage, armature: Armature): void {
            const bones = dataPackage.armature.sortedBones;

            for (let i = 0, l = bones.length; i < l; ++i) {
                const boneData = bones[i];
                const bone = BaseObject.borrowObject(Bone);

                bone.name = boneData.name;
                bone.inheritTranslation = boneData.inheritTranslation;
                bone.inheritRotation = boneData.inheritRotation;
                bone.inheritScale = boneData.inheritScale;
                bone.length = boneData.length;
                bone.origin.copyFrom(boneData.transform);

                if (boneData.parent) {
                    armature.addBone(bone, boneData.parent.name);
                } else {
                    armature.addBone(bone);
                }

                if (boneData.ik) {
                    bone.ikBendPositive = boneData.bendPositive;
                    bone.ikWeight = boneData.weight;
                    bone._setIK(armature.getBone(boneData.ik.name), boneData.chain, boneData.chainIndex);
                }
            }
        }
        /**
         * @private
         */
        protected _buildSlots(dataPackage: BuildArmaturePackage, armature: Armature): void {
            const currentSkin = dataPackage.skin;
            const defaultSkin = dataPackage.armature.defaultSkin;
            const slotDisplayDataSetMap: Map<SlotDisplayDataSet> = {};

            for (let i in defaultSkin.slots) {
                const slotDisplayDataSet = defaultSkin.slots[i];
                slotDisplayDataSetMap[slotDisplayDataSet.slot.name] = slotDisplayDataSet;
            }

            if (currentSkin != defaultSkin) {
                for (let i in currentSkin.slots) {
                    const slotDisplayDataSet = currentSkin.slots[i];
                    slotDisplayDataSetMap[slotDisplayDataSet.slot.name] = slotDisplayDataSet;
                }
            }

            const slots = dataPackage.armature.sortedSlots;
            for (let i = 0, l = slots.length; i < l; ++i) {
                const slotData = slots[i];
                const slotDisplayDataSet = slotDisplayDataSetMap[slotData.name];
                if (!slotDisplayDataSet) {
                    continue;
                }

                const slot = this._generateSlot(dataPackage, slotDisplayDataSet);

                slot._displayDataSet = slotDisplayDataSet;
                slot._setDisplayIndex(slotData.displayIndex);
                slot._setBlendMode(slotData.blendMode);
                slot._setColor(slotData.color);

                slot._replacedDisplayDataSet.length = slot._displayDataSet.displays.length;

                armature.addSlot(slot, slotData.parent.name);
            }
        }
        /**
         * @private
         */
        protected _replaceSlotDisplay(dataPackage: BuildArmaturePackage, displayData: DisplayData, slot: Slot, displayIndex: number): void {
            if (displayIndex < 0) {
                displayIndex = slot.displayIndex;
            }

            if (displayIndex >= 0) {
                const displayList = slot.displayList; // Copy.
                if (displayList.length <= displayIndex) {
                    displayList.length = displayIndex + 1;
                }

                if (!displayData.textureData) {
                    displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                }

                if (displayData.type == DisplayType.Armature) {
                    const childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
                    displayList[displayIndex] = childArmature;
                } else {
                    if (slot._replacedDisplayDataSet.length <= displayIndex) {
                        slot._replacedDisplayDataSet.length = displayIndex + 1;
                    }

                    slot._replacedDisplayDataSet[displayIndex] = displayData;

                    if (displayData.meshData) {
                        displayList[displayIndex] = slot.MeshDisplay;
                    } else {
                        displayList[displayIndex] = slot.rawDisplay;
                    }
                }

                slot.displayList = displayList;
                slot.invalidUpdate();
            }
        }
        /** 
         * @private 
         */
        protected abstract _generateTextureAtlasData(textureAtlasData: TextureAtlasData, textureAtlas: any): TextureAtlasData;
        /** 
         * @private 
         */
        protected abstract _generateArmature(dataPackage: BuildArmaturePackage): Armature;
        /** 
         * @private 
         */
        protected abstract _generateSlot(dataPackage: BuildArmaturePackage, slotDisplayDataSet: SlotDisplayDataSet): Slot;
        /**
         * @language zh_CN
         * 解析并添加龙骨数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param dragonBonesName 为数据提供一个名称，以便可以通过这个名称来获取数据，如果不提供，则使用数据中的名称。 (默认: null)
         * @return DragonBonesData
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         */
        public parseDragonBonesData(rawData: any, dragonBonesName: string = null): DragonBonesData {
            const dragonBonesData = this._objectDataParser.parseDragonBonesData(rawData);
            this.addDragonBonesData(dragonBonesData, dragonBonesName);

            return dragonBonesData;
        }
        /**
         * @language zh_CN
         * 解析并添加贴图集数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param textureAtlas 贴图集数据。 (BitmapData 或 ATF 或 DisplayObject)
         * @param name 为数据指定一个名称，以便可以通过这个名称来访问数据，如果不提供，则使用数据中的名称。 (默认: null)
         * @param scale 为贴图集设置一个缩放值。 (默认: 0 不缩放)
         * @return 贴图集数据
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         */
        public parseTextureAtlasData(rawData: any, textureAtlas: Object, name: string = null, scale: number = 0): TextureAtlasData {
            const textureAtlasData = this._generateTextureAtlasData(null, null);
            this._objectDataParser.parseTextureAtlasData(rawData, textureAtlasData, scale);

            this._generateTextureAtlasData(textureAtlasData, textureAtlas);
            this.addTextureAtlasData(textureAtlasData, name);
            return textureAtlasData;
        }
        /**
         * @language zh_CN
         * 获取指定名称的龙骨数据。
         * @param name 数据名称。
         * @return DragonBonesData
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.objects.DragonBonesData
         * @version DragonBones 3.0
         */
        public getDragonBonesData(name: string): DragonBonesData {
            return this._dragonBonesDataMap[name];
        }
        /**
         * @language zh_CN
         * 添加龙骨数据。
         * @param data 龙骨数据。
         * @param dragonBonesName 为数据指定一个名称，以便可以通过这个名称来访问数据，如果不提供，则使用数据中的名称。 (默认: null)
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.objects.DragonBonesData
         * @version DragonBones 3.0
         */
        public addDragonBonesData(data: DragonBonesData, dragonBonesName: string = null): void {
            if (data) {
                dragonBonesName = dragonBonesName || data.name;
                if (dragonBonesName) {
                    if (!this._dragonBonesDataMap[dragonBonesName]) {
                        this._dragonBonesDataMap[dragonBonesName] = data;
                    } else {
                        console.warn("Same name data.");
                    }
                } else {
                    console.warn("Unnamed data.");
                }
            } else {
                throw new Error();
            }
        }
        /**
         * @language zh_CN
         * 移除龙骨数据。
         * @param dragonBonesName 数据名称。
         * @param disposeData 是否释放数据。 [false: 释放, true: 不释放] (默认: true)
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.objects.DragonBonesData
         * @version DragonBones 3.0
         */
        public removeDragonBonesData(dragonBonesName: string, disposeData: boolean = true): void {
            const dragonBonesData = this._dragonBonesDataMap[dragonBonesName];
            if (dragonBonesData) {
                if (disposeData) {
                    dragonBonesData.returnToPool();
                }

                delete this._dragonBonesDataMap[dragonBonesName];
            }
        }
        /**
         * @language zh_CN
         * 获取指定名称的贴图集数据列表。
         * @param dragonBonesName 数据名称。
         * @return 贴图集数据列表。
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        public getTextureAtlasData(dragonBonesName: string): Array<TextureAtlasData> {
            return this._textureAtlasDataMap[dragonBonesName];
        }
        /**
         * @language zh_CN
         * 添加贴图集数据。
         * @param data 贴图集数据。
         * @param dragonBonesName 为数据指定一个名称，以便可以通过这个名称来访问数据，如果不提供，则使用数据中的名称。 (默认: null)
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        public addTextureAtlasData(data: TextureAtlasData, dragonBonesName: string = null): void {
            if (data) {
                dragonBonesName = dragonBonesName || data.name;
                if (dragonBonesName) {
                    const textureAtlasList = this._textureAtlasDataMap[dragonBonesName] = this._textureAtlasDataMap[dragonBonesName] || [];
                    if (textureAtlasList.indexOf(data) < 0) {
                        textureAtlasList.push(data);
                    }
                } else {
                    console.warn("Unnamed data.");
                }
            } else {
                throw new Error();
            }
        }
        /**
         * @language zh_CN
         * 移除贴图集数据。
         * @param dragonBonesName 数据名称。
         * @param disposeData 是否释放数据。 [false: 释放, true: 不释放] (默认: true)
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        public removeTextureAtlasData(dragonBonesName: string, disposeData: boolean = true): void {
            const textureAtlasDataList = this._textureAtlasDataMap[dragonBonesName];
            if (textureAtlasDataList) {
                if (disposeData) {
                    for (let i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                        textureAtlasDataList[i].returnToPool();
                    }
                }

                delete this._textureAtlasDataMap[dragonBonesName];
            }
        }
        /**
         * @language zh_CN
         * 清除所有的数据。
         * @param disposeData 是否释放数据。 [false: 释放, true: 不释放] (默认: true)
         * @version DragonBones 4.5
         */
        public clear(disposeData: Boolean = true): void {

            for (let i in this._dragonBonesDataMap) {
                if (disposeData) {
                    this._dragonBonesDataMap[i].returnToPool();
                }

                delete this._dragonBonesDataMap[i];
            }

            for (let i in this._textureAtlasDataMap) {
                if (disposeData) {
                    const textureAtlasDataList = this._textureAtlasDataMap[i];
                    for (let i = 0, l = textureAtlasDataList.length; i < l; ++i) {
                        textureAtlasDataList[i].returnToPool();
                    }
                }

                delete this._textureAtlasDataMap[i];
            }
        }
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果不提供此名称，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。 (默认: null)
         * @param skinName 皮肤名称。 (默认: null)
         * @return 骨架
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        public buildArmature(armatureName: string, dragonBonesName: string = null, skinName: string = null): Armature {
            const dataPackage: BuildArmaturePackage = {};
            if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, skinName, dataPackage)) {
                const armature = this._generateArmature(dataPackage);
                this._buildBones(dataPackage, armature);
                this._buildSlots(dataPackage, armature);

                // Update armature pose
                armature.advanceTime(0);

                return armature;
            }

            return null;
        }
        /**
         * @language zh_CN
         * 将指定骨架的动画替换成其他骨架的动画。 (通常这些骨架应该具有相同的骨架结构)
         * @param toArmature 指定的骨架。
         * @param fromArmatreName 其他骨架的名称。
         * @param fromSkinName 其他骨架的皮肤名称。 (默认: null)
         * @param fromDragonBonesDataName 其他骨架属于的龙骨数据名称。 (默认: null)
         * @param ifRemoveOriginalAnimationList 是否移除原有的动画。 [true: 移除, false: 不移除] (默认: true)
         * @return 是否替换成功。 [true: 成功, false: 不成功]
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         */
        public copyAnimationsToArmature(
            toArmature: Armature, fromArmatreName: string, fromSkinName: string = null,
            fromDragonBonesDataName: string = null, ifRemoveOriginalAnimationList: boolean = true
        ): boolean {
            const dataPackage: BuildArmaturePackage = {};
            if (this._fillBuildArmaturePackage(fromDragonBonesDataName, fromArmatreName, fromSkinName, dataPackage)) {
                const fromArmatureData = dataPackage.armature;
                if (ifRemoveOriginalAnimationList) {
                    toArmature.animation.animations = fromArmatureData.animations;
                } else {
                    const animations: Map<AnimationData> = {};
                    for (let animationName in toArmature.animation.animations) {
                        animations[animationName] = toArmature.animation.animations[animationName];
                    }

                    for (let animationName in fromArmatureData.animations) {
                        animations[animationName] = fromArmatureData.animations[animationName];
                    }

                    toArmature.animation.animations = animations;
                }

                if (dataPackage.skin) {
                    const slots = toArmature.getSlots();
                    for (let i = 0, l = slots.length; i < l; ++i) {
                        const toSlot = slots[i];
                        const toSlotDisplayList = toSlot.displayList;
                        for (let i = 0, l = toSlotDisplayList.length; i < l; ++i) {
                            const toDisplayObject = toSlotDisplayList[i];
                            if (toDisplayObject instanceof Armature) {
                                const displays = dataPackage.skin.getSlot(toSlot.name).displays;
                                if (i < displays.length) {
                                    const fromDisplayData = displays[i];
                                    if (fromDisplayData.type == DisplayType.Armature) {
                                        this.copyAnimationsToArmature(<Armature>toDisplayObject, fromDisplayData.name, fromSkinName, fromDragonBonesDataName, ifRemoveOriginalAnimationList);
                                    }
                                }
                            }
                        }
                    }

                    return true;
                }
            }

            return false;
        }
        /**
         * @language zh_CN
         * 将指定插槽的显示对象替换为指定资源创造出的显示对象。
         * @param dragonBonesName 指定的龙骨数据名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param displayName 指定的显示对象名称。
         * @param slot 指定的插槽实例。
         * @param displayIndex 要替换的显示对象的索引，如果未指定索引则替换当前正在显示的显示对象。 (默认: -1)
         * @version DragonBones 4.5
         */
        public replaceSlotDisplay(dragonBonesName: string, armatureName: string, slotName: string, displayName: string, slot: Slot, displayIndex: number = -1): void {
            const dataPackage: BuildArmaturePackage = {};
            if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, null, dataPackage)) {
                const slotDisplayDataSet = dataPackage.skin.getSlot(slotName);
                if (slotDisplayDataSet) {
                    for (let i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                        const displayData = slotDisplayDataSet.displays[i];
                        if (displayData.name == displayName) {
                            this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex);
                            break;
                        }
                    }
                }
            }
        }
        /**
         * @language zh_CN
         * 将指定插槽的显示对象列表替换为指定资源创造出的显示对象列表。
         * @param dragonBonesName 指定的 DragonBonesData 名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param slot 指定的插槽实例。
         * @version DragonBones 4.5
         */
        public replaceSlotDisplayList(dragonBonesName: string, armatureName: string, slotName: string, slot: Slot): void {
            const dataPackage: BuildArmaturePackage = {};
            if (this._fillBuildArmaturePackage(dragonBonesName, armatureName, null, dataPackage)) {
                const slotDisplayDataSet = dataPackage.skin.getSlot(slotName);
                if (slotDisplayDataSet) {
                    let displayIndex = 0;

                    for (let i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                        const displayData = slotDisplayDataSet.displays[i];
                        this._replaceSlotDisplay(dataPackage, displayData, slot, displayIndex++);
                    }
                }
            }
        }
    }
}