namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 工厂。
     * @version DragonBones 3.0
     */
    export class EgretFactory extends BaseFactory {
        /**
         * @language zh_CN
         * 创建一个工厂。
         * @version DragonBones 3.0
         */
        public constructor() {
            super();

            if (!Armature._soundEventManager) {
                Armature._soundEventManager = new EgretArmatureDisplay();
            }
        }
        /**
         * @private
         */
        protected _generateTextureAtlasData(textureAtlasData: EgretTextureAtlasData, textureAtlas: egret.Texture): EgretTextureAtlasData {
            if (textureAtlasData) {
                textureAtlasData.texture = textureAtlas;
            } else {
                textureAtlasData = BaseObject.borrowObject(EgretTextureAtlasData);
            }

            return textureAtlasData;
        }
        /**
         * @private
         */
        protected _generateArmature(dataPackage: BuildArmaturePackage): Armature {
            const armature = BaseObject.borrowObject(Armature);
            const armatureDisplayContainer = new EgretArmatureDisplay();

            armature._armatureData = dataPackage.armature;
            armature._skinData = dataPackage.skin;
            armature._animation = BaseObject.borrowObject(Animation);
            armature._display = armatureDisplayContainer;

            armatureDisplayContainer._armature = armature;
            armature._animation._armature = armature;

            armature.animation.animations = dataPackage.armature.animations;

            return armature;
        }
        /**
         * @private
         */
        protected _generateSlot(dataPackage: BuildArmaturePackage, slotDisplayDataSet: SlotDisplayDataSet): Slot {
            const slot = BaseObject.borrowObject(EgretSlot);
            const slotData = slotDisplayDataSet.slot;
            const displayList = [];

            slot.name = slotData.name;
            slot._rawDisplay = new egret.Bitmap();

            for (let i = 0, l = slotDisplayDataSet.displays.length; i < l; ++i) {
                const displayData = slotDisplayDataSet.displays[i];
                switch (displayData.type) {
                    case DisplayType.Image:
                        if (!displayData.textureData) {
                            displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                        }

                        displayList.push(slot._rawDisplay);
                        break;

                    case DisplayType.Mesh:
                        if (!displayData.textureData) {
                            displayData.textureData = this._getTextureData(dataPackage.dataName, displayData.name);
                        }

                        if (egret.Capabilities.renderMode == "webgl") {
                            if (!slot._meshDisplay) {
                                slot._meshDisplay = new egret.Mesh();
                            }

                            displayList.push(slot._meshDisplay);
                        } else {
                            displayList.push(slot._rawDisplay);
                        }
                        break;

                    case DisplayType.Armature:
                        const childArmature = this.buildArmature(displayData.name, dataPackage.dataName);
                        if (childArmature) {
                            if (slotData.actions.length > 0) {
                                childArmature._action = slotData.actions[slotData.actions.length - 1];
                            } else {
                                childArmature.animation.play();
                            }
                        }

                        displayList.push(childArmature);
                        break;

                    default:
                        displayList.push(null);
                        break;
                }
            }

            slot._setDisplayList(displayList);

            return slot;
        }
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @returns 骨架的显示容器。
         * @see dragonBones.IArmatureDisplayContainer
         * @version DragonBones 4.5
         */
        public buildArmatureDisplay(armatureName: string, dragonBonesName: string = null, skinName: string = null): EgretArmatureDisplay {
            const armature = this.buildArmature(armatureName, dragonBonesName, skinName);
            const armatureDisplay = armature ? <EgretArmatureDisplay>armature._display : null;
            if (armatureDisplay) {
                armatureDisplay.advanceTimeBySelf(true);
            }

            return armatureDisplay;
        }
        /**
         * @language zh_CN
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param dragonBonesName 指定的龙骨数据名称，如果未设置，将检索所有的龙骨数据。
         * @version DragonBones 3.0
         */
        public getTextureDisplay(textureName: string, dragonBonesName: string = null): egret.Bitmap {
            const textureData = <EgretTextureData>this._getTextureData(dragonBonesName, textureName);
            if (textureData) {
                return new egret.Bitmap(textureData.texture);
            }

            return null;
        }
        /**
         * @language zh_CN
         * 获取全局声音事件管理器。
         * @version DragonBones 4.5
         */
        public get soundEventManater(): EgretArmatureDisplay {
            return <EgretArmatureDisplay>Armature._soundEventManager;
        }

        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addDragonBonesData()
         */
        public addSkeletonData(dragonBonesData: DragonBonesData, dragonBonesName: string = null): void {
            this.addDragonBonesData(dragonBonesData, dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getDragonBonesData()
         */
        public getSkeletonData(dragonBonesName: string) {
            return this.getDragonBonesData(dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeSkeletonData()
         */
        public removeSkeletonData(dragonBonesName: string): void {
            this.removeDragonBonesData(dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addTextureAtlasData()
         */
        public addTextureAtlas(textureAtlasData: TextureAtlasData, dragonBonesName: string = null): void {
            this.addTextureAtlasData(textureAtlasData, dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getTextureAtlasData()
         */
        public getTextureAtlas(dragonBonesName: string) {
            return this.getTextureAtlasData(dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        public removeTextureAtlas(dragonBonesName: string): void {
            this.removeTextureAtlasData(dragonBonesName);
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#buildArmature()
         */
        public buildFastArmature(armatureName: string, dragonBonesName: string = null, skinName: string = null): FastArmature {
            return this.buildArmature(armatureName, dragonBonesName, skinName);
        }
    }
}