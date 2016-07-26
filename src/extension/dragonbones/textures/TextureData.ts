namespace dragonBones {
    /**
     * @language zh_CN
     * 贴图集数据。
     * @version DragonBones 3.0
     */
    export abstract class TextureAtlasData extends BaseObject {
        /**
         * @language zh_CN
         * 是否开启共享搜索。 [true: 开启, false: 不开启]
         * @default false
         * @version DragonBones 4.5
         */
        public autoSearch: boolean;
        /**
         * @language zh_CN
         * 贴图集缩放系数。
         * @version DragonBones 3.0
         */
        public scale: number;
        /**
         * @language zh_CN
         * 贴图集名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @language zh_CN
         * 贴图集图片路径。
         * @version DragonBones 3.0
         */
        public imagePath: string;
        /**
         * @private
         */
        public textures: Map<TextureData> = {};
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

            self.autoSearch = false;
            self.scale = 1;
            self.name = null;
            self.imagePath = null;

            for (let i in self.textures) {
                self.textures[i].returnToPool();
                delete self.textures[i];
            }
        }
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        public dispose(): void {
            this.returnToPool();
        }
        /**
         * @private
         */
        public abstract generateTextureData(): TextureData;
        /**
         * @private
         */
        public addTextureData(value: TextureData): void {
            if (value && value.name && !this.textures[value.name]) {
                this.textures[value.name] = value;
                value.parent = this;
            } else {
                throw new Error();
            }
        }
        /**
         * @private
         */
        public getTextureData(name: string): TextureData {
            return this.textures[name];
        }
    }
    /**
     * @private
     */
    export abstract class TextureData extends BaseObject {
        public static generateRectangle(): Rectangle {
            return new Rectangle();
        }

        public rotated: boolean;
        public name: string;
        public frame: Rectangle;
        public parent: TextureAtlasData;
        public region: Rectangle = new Rectangle();

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            const self = this;

            self.rotated = false;
            self.name = null;
            self.frame = null;
            self.parent = null;
            self.region.clear();
        }
    }
}