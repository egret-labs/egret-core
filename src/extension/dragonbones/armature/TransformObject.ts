namespace dragonBones {
    /**
     * @language zh_CN
     * 基础变换对象。
     * @version DragonBones 4.5
     */
    export abstract class TransformObject extends BaseObject {
        /**
         * @language zh_CN
         * 可以用于存储临时数据。
         * @version DragonBones 3.0
         */
        public userData: any;
        /**
         * @language zh_CN
         * 对象的名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @language zh_CN
         * 相对于骨架坐标系的矩阵。
         * @version DragonBones 3.0
         */
        public globalTransformMatrix: Matrix;
        /**
         * @language zh_CN
         * 相对于骨架坐标系的变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        public global: Transform = new Transform();
        /**
         * @language zh_CN
         * 相对于骨架或父骨骼坐标系的绑定变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        public origin: Transform = new Transform();
        /**
         * @language zh_CN
         * 相对于骨架或父骨骼坐标系的偏移变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        public offset: Transform = new Transform();
        /**
         * @private
         */
        public _armature: Armature;
        /**
         * @private
         */
        public _parent: Bone;
        /**
         * @private
         */
        protected _globalTransformMatrix: Matrix = new Matrix();
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
            this.userData = null;
            this.name = null;
            this.globalTransformMatrix = this._globalTransformMatrix;
            this.global.identity();
            this.origin.identity();
            this.offset.identity();

            this._armature = null;
            this._parent = null;
            this._globalTransformMatrix.identity();
        }
        /**
         * @private
         */
        public _setArmature(value: Armature): void {
            this._armature = value;
        }
        /**
         * @private
         */
        public _setParent(value: Bone): void {
            this._parent = value;
        }
        /**
         * @language zh_CN
         * 所属的骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        public get armature(): Armature {
            return this._armature;
        }
        /**
         * @language zh_CN
         * 所属的父骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        public get parent(): Bone {
            return this._parent;
        }
    }
}