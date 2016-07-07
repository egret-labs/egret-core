namespace dragonBones {
    /**
     * @language zh_CN
     * 龙骨数据，包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    export class DragonBonesData extends BaseObject {
        /**
         * @private
         */
        public static toString(): string {
            return "[Class dragonBones.DragonBonesData]";
        }

        /**
         * @language zh_CN
         * 是否开启共享搜索。 [true: 开启, false: 不开启] (默认: false)
         * @see dragonBones.objects.ArmatureData
         * @version DragonBones 4.5
         */
        public autoSearch: boolean;
        /**
         * @language zh_CN
         * 动画帧频。
         * @version DragonBones 3.0
         */
        public frameRate: number;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @language zh_CN
         * 所有的骨架数据。
         * @see dragonBones.objects.ArmatureData
         * @version DragonBones 3.0
         */
        public armatures: Map<ArmatureData> = {};

        private _armatureNames: Array<string> = [];
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
            this.autoSearch = false;
            this.frameRate = 0;
            this.name = null;

            for (let i in this.armatures) {
                this.armatures[i].returnToPool();
                delete this.armatures[i];
            }

            if (this._armatureNames.length) {
                this._armatureNames.length = 0;
            }
        }

        /**
         * @language zh_CN
         * 获取指定名称的骨架。
         * @param name 骨架数据骨架名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        public getArmature(name: string): ArmatureData {
            return this.armatures[name];
        }

        /**
         * @private
         */
        public addArmature(value: ArmatureData): void {
            if (value && value.name && !this.armatures[value.name]) {
                this.armatures[value.name] = value;
                this._armatureNames.push(value.name);
            } else {
                throw new Error();
            }
        }

        /**
         * @language zh_CN
         * 所有的骨架数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         */
        public get armatureNames(): Array<string> {
            return this._armatureNames;
        }
    }
}