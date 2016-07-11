namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 贴图集数据。
     * @version DragonBones 3.0
     */
    export class EgretTextureAtlasData extends TextureAtlasData {
        /**
         * @private
         */
        public static toString(): string {
            return "[Class dragonBones.EgretTextureAtlasData]";
        }
        /**
         * @language zh_CN
         * Egret 贴图。
         * @version DragonBones 3.0
         */
        public texture: egret.Texture;
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

            if (this.texture) {
                //this.texture.dispose();
                this.texture = null;
            }
        }
        /**
         * @private
         */
        public generateTextureData(): TextureData {
            return BaseObject.borrowObject(EgretTextureData);
        }
    }
    /**
     * @private
     */
    export class EgretTextureData extends TextureData {
        public static toString(): string {
            return "[Class dragonBones.EgretTextureData]";
        }

        public texture: egret.Texture;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            if (this.texture) {
                this.texture.dispose();
                this.texture = null;
            }
        }
    }
}