declare namespace dragonBones {
    /**
     * @private
     */
    class ColorTransform {
        alphaMultiplier: number;
        redMultiplier: number;
        greenMultiplier: number;
        blueMultiplier: number;
        alphaOffset: number;
        redOffset: number;
        greenOffset: number;
        blueOffset: number;
        constructor(alphaMultiplier?: number, redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaOffset?: number, redOffset?: number, greenOffset?: number, blueOffset?: number);
        copyFrom(value: ColorTransform): void;
        copyFromValue(alphaMultiplier: number, redMultiplier: number, greenMultiplier: number, blueMultiplier: number, alphaOffset: number, redOffset: number, greenOffset: number, blueOffset: number): void;
        identity(): void;
    }
}
declare namespace dragonBones {
    class Point {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        copyFrom(value: Point): void;
        clear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    abstract class DataParser {
        protected static readonly DATA_VERSION_2_3: string;
        protected static readonly DATA_VERSION_3_0: string;
        protected static readonly DATA_VERSION_4_0: string;
        protected static readonly DATA_VERSION_4_5: string;
        protected static readonly DATA_VERSION_5_0: string;
        protected static readonly DATA_VERSION_5_1: string;
        protected static readonly DATA_VERSION: string;
        protected static readonly DATA_VERSIONS: Array<string>;
        protected static readonly TEXTURE_ATLAS: string;
        protected static readonly SUB_TEXTURE: string;
        protected static readonly FORMAT: string;
        protected static readonly IMAGE_PATH: string;
        protected static readonly WIDTH: string;
        protected static readonly HEIGHT: string;
        protected static readonly ROTATED: string;
        protected static readonly FRAME_X: string;
        protected static readonly FRAME_Y: string;
        protected static readonly FRAME_WIDTH: string;
        protected static readonly FRAME_HEIGHT: string;
        protected static readonly DRADON_BONES: string;
        protected static readonly USER_DATA: string;
        protected static readonly ARMATURE: string;
        protected static readonly BONE: string;
        protected static readonly IK: string;
        protected static readonly SLOT: string;
        protected static readonly SKIN: string;
        protected static readonly DISPLAY: string;
        protected static readonly ANIMATION: string;
        protected static readonly Z_ORDER: string;
        protected static readonly FFD: string;
        protected static readonly FRAME: string;
        protected static readonly DEFAULT_ACTIONS: string;
        protected static readonly ACTIONS: string;
        protected static readonly EVENTS: string;
        protected static readonly INTS: string;
        protected static readonly FLOATS: string;
        protected static readonly STRINGS: string;
        protected static readonly CANVAS: string;
        protected static readonly TRANSFORM: string;
        protected static readonly PIVOT: string;
        protected static readonly AABB: string;
        protected static readonly COLOR: string;
        protected static readonly VERSION: string;
        protected static readonly COMPATIBLE_VERSION: string;
        protected static readonly FRAME_RATE: string;
        protected static readonly TYPE: string;
        protected static readonly SUB_TYPE: string;
        protected static readonly NAME: string;
        protected static readonly PARENT: string;
        protected static readonly TARGET: string;
        protected static readonly SHARE: string;
        protected static readonly PATH: string;
        protected static readonly LENGTH: string;
        protected static readonly DISPLAY_INDEX: string;
        protected static readonly BLEND_MODE: string;
        protected static readonly INHERIT_TRANSLATION: string;
        protected static readonly INHERIT_ROTATION: string;
        protected static readonly INHERIT_SCALE: string;
        protected static readonly INHERIT_REFLECTION: string;
        protected static readonly INHERIT_ANIMATION: string;
        protected static readonly INHERIT_FFD: string;
        protected static readonly BEND_POSITIVE: string;
        protected static readonly CHAIN: string;
        protected static readonly WEIGHT: string;
        protected static readonly FADE_IN_TIME: string;
        protected static readonly PLAY_TIMES: string;
        protected static readonly SCALE: string;
        protected static readonly OFFSET: string;
        protected static readonly POSITION: string;
        protected static readonly DURATION: string;
        protected static readonly TWEEN_TYPE: string;
        protected static readonly TWEEN_EASING: string;
        protected static readonly TWEEN_ROTATE: string;
        protected static readonly TWEEN_SCALE: string;
        protected static readonly CURVE: string;
        protected static readonly SOUND: string;
        protected static readonly EVENT: string;
        protected static readonly ACTION: string;
        protected static readonly X: string;
        protected static readonly Y: string;
        protected static readonly ROTATION: string;
        protected static readonly SKEW: string;
        protected static readonly SKEW_X: string;
        protected static readonly SKEW_Y: string;
        protected static readonly SCALE_X: string;
        protected static readonly SCALE_Y: string;
        protected static readonly ALPHA_OFFSET: string;
        protected static readonly RED_OFFSET: string;
        protected static readonly GREEN_OFFSET: string;
        protected static readonly BLUE_OFFSET: string;
        protected static readonly ALPHA_MULTIPLIER: string;
        protected static readonly RED_MULTIPLIER: string;
        protected static readonly GREEN_MULTIPLIER: string;
        protected static readonly BLUE_MULTIPLIER: string;
        protected static readonly UVS: string;
        protected static readonly VERTICES: string;
        protected static readonly TRIANGLES: string;
        protected static readonly WEIGHTS: string;
        protected static readonly SLOT_POSE: string;
        protected static readonly BONE_POSE: string;
        protected static readonly GOTO_AND_PLAY: string;
        protected static readonly DEFAULT_NAME: string;
        protected static _getArmatureType(value: string): ArmatureType;
        protected static _getDisplayType(value: string): DisplayType;
        protected static _getBoundingBoxType(value: string): BoundingBoxType;
        protected static _getActionType(value: string): ActionType;
        protected static _getBlendMode(value: string): BlendMode;
        /**
         * @private
         */
        abstract parseDragonBonesData(rawData: any, scale: number): DragonBonesData | null;
        /**
         * @private
         */
        abstract parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        static parseDragonBonesData(rawData: any): DragonBonesData | null;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parsetTextureAtlasData()
         */
        static parseTextureAtlasData(rawData: any, scale?: number): any;
    }
}
declare namespace dragonBones {
    /**
     * 2D 变换。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Transform {
        /**
         * 水平位移。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        x: number;
        /**
         * 垂直位移。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        y: number;
        /**
         * 倾斜。 (以弧度为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        skew: number;
        /**
         * 旋转。 (以弧度为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        rotation: number;
        /**
         * 水平缩放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        scaleX: number;
        /**
         * 垂直缩放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        scaleY: number;
        /**
         * @private
         */
        static readonly PI_D: number;
        /**
         * @private
         */
        static readonly PI_H: number;
        /**
         * @private
         */
        static readonly PI_Q: number;
        /**
         * @private
         */
        static readonly RAD_DEG: number;
        /**
         * @private
         */
        static readonly DEG_RAD: number;
        /**
         * @private
         */
        static normalizeRadian(value: number): number;
        constructor(
            /**
             * 水平位移。
             * @version DragonBones 3.0
             * @language zh_CN
             */
            x?: number, 
            /**
             * 垂直位移。
             * @version DragonBones 3.0
             * @language zh_CN
             */
            y?: number, 
            /**
             * 倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             * @language zh_CN
             */
            skew?: number, 
            /**
             * 旋转。 (以弧度为单位)
             * @version DragonBones 3.0
             * @language zh_CN
             */
            rotation?: number, 
            /**
             * 水平缩放。
             * @version DragonBones 3.0
             * @language zh_CN
             */
            scaleX?: number, 
            /**
             * 垂直缩放。
             * @version DragonBones 3.0
             * @language zh_CN
             */
            scaleY?: number);
        /**
         * @private
         */
        toString(): string;
        /**
         * @private
         */
        copyFrom(value: Transform): Transform;
        /**
         * @private
         */
        copyFromValue(x: number, y: number, rotation: number, skew: number, scaleX: number, scaleY: number): Transform;
        /**
         * @private
         */
        identity(): Transform;
        /**
         * @private
         */
        add(value: Transform): Transform;
        /**
         * @private
         */
        minus(value: Transform): Transform;
        /**
         * 矩阵转换为变换。
         * @param matrix 矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        fromMatrix(matrix: Matrix): Transform;
        /**
         * 转换为矩阵。
         * @param matrix 矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        toMatrix(matrix: Matrix): Transform;
    }
}
declare namespace dragonBones {
    /**
     * 2D 矩阵。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Matrix {
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        /**
         * @private
         */
        toString(): string;
        /**
         * @private
         */
        copyFrom(value: Matrix): Matrix;
        /**
         * @private
         */
        copyFromArray(value: Array<number>, offset?: number): Matrix;
        /**
         * 转换为单位矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        identity(): Matrix;
        /**
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        concat(value: Matrix): Matrix;
        /**
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        invert(): Matrix;
        /**
         * 将矩阵转换应用于指定点。
         * @param x 横坐标。
         * @param y 纵坐标。
         * @param result 应用转换之后的坐标。
         * @params delta 是否忽略 tx，ty 对坐标的转换。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        transformPoint(x: number, y: number, result: {
            x: number;
            y: number;
        }, delta?: boolean): void;
    }
}
declare namespace dragonBones {
    /**
     * 基础对象。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    abstract class BaseObject {
        private static _hashCode;
        private static _defaultMaxCount;
        private static readonly _maxCountMap;
        private static readonly _poolsMap;
        private static _returnObject(object);
        /**
         * @private
         */
        static toString(): string;
        /**
         * 设置每种对象池的最大缓存数量。
         * @param objectConstructor 对象类。
         * @param maxCount 最大缓存数量。 (设置为 0 则不缓存)
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static setMaxCount(objectConstructor: (typeof BaseObject) | null, maxCount: number): void;
        /**
         * 清除对象池缓存的对象。
         * @param objectConstructor 对象类。 (不设置则清除所有缓存)
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static clearPool(objectConstructor?: (typeof BaseObject) | null): void;
        /**
         * 从对象池中创建指定对象。
         * @param objectConstructor 对象类。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static borrowObject<T extends BaseObject>(objectConstructor: {
            new (): T;
        }): T;
        /**
         * 对象的唯一标识。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly hashCode: number;
        private _isInPool;
        /**
         * @private
         */
        protected abstract _onClear(): void;
        /**
         * 清除数据并返还对象池。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        returnToPool(): void;
    }
}
declare namespace dragonBones {
    /**
     * 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    abstract class TextureAtlasData extends BaseObject {
        /**
         * 是否开启共享搜索。
         * @default false
         * @version DragonBones 4.5
         * @language zh_CN
         */
        autoSearch: boolean;
        /**
         * @private
         */
        width: number;
        /**
         * @private
         */
        height: number;
        /**
         * 贴图集缩放系数。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        scale: number;
        /**
         * 贴图集名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * 贴图集图片路径。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        imagePath: string;
        /**
         * @private
         */
        readonly textures: Map<TextureData>;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        copyFrom(value: TextureAtlasData): void;
        /**
         * @private
         */
        abstract createTexture(): TextureData;
        /**
         * @private
         */
        addTexture(value: TextureData): void;
        /**
         * @private
         */
        getTexture(name: string): TextureData | null;
    }
    /**
     * @private
     */
    abstract class TextureData extends BaseObject {
        static createRectangle(): Rectangle;
        rotated: boolean;
        name: string;
        readonly region: Rectangle;
        parent: TextureAtlasData;
        frame: Rectangle | null;
        protected _onClear(): void;
        copyFrom(value: TextureData): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    class ObjectDataParser extends DataParser {
        /**
         * @private
         */
        protected static _getBoolean(rawData: any, key: string, defaultValue: boolean): boolean;
        /**
         * @private
         */
        protected static _getNumber(rawData: any, key: string, defaultValue: number): number;
        /**
         * @private
         */
        protected static _getString(rawData: any, key: string, defaultValue: string): string;
        protected readonly _rawBones: Array<BoneData>;
        protected readonly _cacheBones: Map<Array<BoneData>>;
        protected readonly _meshs: Map<MeshDisplayData>;
        protected readonly _slotChildActions: Map<Array<ActionData>>;
        protected readonly _weightSlotPose: Map<Array<number>>;
        protected readonly _weightBonePoses: Map<Array<number>>;
        protected readonly _weightBoneIndices: Map<Array<number>>;
        protected _rawTextureAtlases: Array<any> | null;
        protected _data: DragonBonesData;
        protected _armature: ArmatureData;
        protected _bone: BoneData;
        protected _slot: SlotData;
        protected _skin: SkinData;
        protected _mesh: MeshDisplayData;
        protected _animation: AnimationData;
        protected _timeline: TimelineData;
        private _prevTweenRotate;
        private _prevRotation;
        private _defalultColorOffset;
        private readonly _helpPoint;
        private readonly _helpTransform;
        private readonly _helpMatrixA;
        private readonly _helpMatrixB;
        private readonly _helpColorTransform;
        private readonly _actionFrames;
        /**
         * @private
         */
        private _getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, t, result);
        /**
         * @private
         */
        private _samplingEasingCurve(curve, samples);
        private _sortActionFrame(a, b);
        private _parseActionDataInFrame(rawData, frameStart, bone, slot);
        private _mergeActionFrame(rawData, frameStart, type, bone, slot);
        private _parseCacheActionFrame(frame);
        /**
         * @private
         */
        protected _parseArmature(rawData: any, scale: number): ArmatureData;
        /**
         * @private
         */
        protected _parseBone(rawData: any): BoneData;
        /**
         * @private
         */
        protected _parseIKConstraint(rawData: any): void;
        /**
         * @private
         */
        protected _parseSlot(rawData: any): SlotData;
        /**
         * @private
         */
        protected _parseSkin(rawData: any): SkinData;
        /**
         * @private
         */
        protected _parseDisplay(rawData: any): DisplayData | null;
        /**
         * @private
         */
        protected _parsePivot(rawData: any, display: ImageDisplayData): void;
        /**
         * @private
         */
        protected _parseMesh(rawData: any, mesh: MeshDisplayData): void;
        /**
         * @private
         */
        protected _parseBoundingBox(rawData: any): BoundingBoxData | null;
        /**
         * @private
         */
        protected _parsePolygonBoundingBox(rawData: any): PolygonBoundingBoxData;
        /**
         * @private
         */
        protected _parseAnimation(rawData: any): AnimationData;
        /**
         * @private
         */
        protected _parseTimeline(rawData: any, type: TimelineType, addIntOffset: boolean, addFloatOffset: boolean, frameValueCount: number, frameParser: (rawData: any, frameStart: number, frameCount: number) => number): TimelineData | null;
        /**
         * @private
         */
        protected _parseBoneTimeline(rawData: any): void;
        /**
         * @private
         */
        protected _parseSlotTimeline(rawData: any): void;
        /**
         * @private
         */
        protected _parseFrame(rawData: any, frameStart: number, frameCount: number, frameArray: Array<number>): number;
        /**
         * @private
         */
        protected _parseTweenFrame(rawData: any, frameStart: number, frameCount: number, frameArray: Array<number>): number;
        /**
         * @private
         */
        protected _parseZOrderFrame(rawData: any, frameStart: number, frameCount: number): number;
        /**
         * @private
         */
        protected _parseBoneFrame(rawData: any, frameStart: number, frameCount: number): number;
        /**
         * @private
         */
        protected _parseSlotDisplayIndexFrame(rawData: any, frameStart: number, frameCount: number): number;
        /**
         * @private
         */
        protected _parseSlotColorFrame(rawData: any, frameStart: number, frameCount: number): number;
        /**
         * @private
         */
        protected _parseSlotFFDFrame(rawData: any, frameStart: number, frameCount: number): number;
        /**
         * @private
         */
        protected _parseActionData(rawData: any, actions: Array<ActionData>, type: ActionType, bone: BoneData | null, slot: SlotData | null): number;
        /**
         * @private
         */
        protected _parseTransform(rawData: any, transform: Transform): void;
        /**
         * @private
         */
        protected _parseColorTransform(rawData: any, color: ColorTransform): void;
        /**
         * @private
         */
        protected _parseArray(rawData: any): void;
        /**
         * @inheritDoc
         */
        parseDragonBonesData(rawData: any, scale?: number): DragonBonesData | null;
        /**
         * @inheritDoc
         */
        parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale?: number): void;
        /**
         * @private
         */
        private static _instance;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        static getInstance(): ObjectDataParser;
    }
}
declare namespace dragonBones {
    /**
     * 事件数据。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    class EventObject extends BaseObject {
        /**
         * 动画开始。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly START: string;
        /**
         * 动画循环播放一次完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly LOOP_COMPLETE: string;
        /**
         * 动画播放完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly COMPLETE: string;
        /**
         * 动画淡入开始。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly FADE_IN: string;
        /**
         * 动画淡入完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly FADE_IN_COMPLETE: string;
        /**
         * 动画淡出开始。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly FADE_OUT: string;
        /**
         * 动画淡出完成。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly FADE_OUT_COMPLETE: string;
        /**
         * 动画帧事件。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly FRAME_EVENT: string;
        /**
         * 动画声音事件。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        static readonly SOUND_EVENT: string;
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        time: number;
        /**
         * 事件类型。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        type: EventStringType;
        /**
         * 事件名称。 (帧标签的名称或声音的名称)
         * @version DragonBones 4.5
         * @language zh_CN
         */
        name: string;
        /**
         * 自定义数据
         * @see dragonBones.CustomData
         * @version DragonBones 5.0
         * @language zh_CN
         */
        data: UserData | null;
        /**
         * 发出事件的骨架。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        armature: Armature;
        /**
         * 发出事件的骨骼。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        bone: Bone | null;
        /**
         * 发出事件的插槽。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        slot: Slot | null;
        /**
         * 发出事件的动画状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        animationState: AnimationState;
        /**
         * @private
         */
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * 基础变换对象。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    abstract class TransformObject extends BaseObject {
        /**
         * @private
         */
        protected static readonly _helpMatrix: Matrix;
        /**
         * @private
         */
        protected static readonly _helpTransform: Transform;
        /**
         * @private
         */
        protected static readonly _helpPoint: Point;
        /**
         * 对象的名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * 相对于骨架坐标系的矩阵。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly globalTransformMatrix: Matrix;
        /**
         * 相对于骨架坐标系的变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly global: Transform;
        /**
         * 相对于骨架或父骨骼坐标系的偏移变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly offset: Transform;
        /**
         * 相对于骨架或父骨骼坐标系的绑定变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         * @readOnly
         * @language zh_CN
         */
        origin: Transform;
        /**
         * 可以用于存储临时数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        userData: any;
        /**
         * @private
         */
        protected _globalDirty: boolean;
        /**
         * @private
         */
        _armature: Armature;
        /**
         * @private
         */
        _parent: Bone;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @internal
         * @private
         */
        _setArmature(value: Armature | null): void;
        /**
         * @internal
         * @private
         */
        _setParent(value: Bone | null): void;
        /**
         * @private
         */
        updateGlobalTransform(): void;
        /**
         * 所属的骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly armature: Armature;
        /**
         * 所属的父骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly parent: Bone;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    class BinaryDataParser extends ObjectDataParser {
        private _binary;
        private _binaryOffset;
        private _inRange(a, min, max);
        private _decodeUTF8(data);
        private _parseBinaryTimeline(type, offset, timelineData?);
        /**
         * @private
         */
        protected _parseMesh(rawData: any, mesh: MeshDisplayData): void;
        /**
         * @private
         */
        protected _parsePolygonBoundingBox(rawData: any): PolygonBoundingBoxData;
        /**
         * @private
         */
        protected _parseAnimation(rawData: any): AnimationData;
        /**
         * @private
         */
        protected _parseArray(rawData: any): void;
        /**
         * @inheritDoc
         */
        parseDragonBonesData(rawData: any, scale?: number): DragonBonesData | null;
    }
}
declare namespace dragonBones {
    /**
     * Egret 贴图集数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class EgretTextureAtlasData extends TextureAtlasData {
        /**
         * @private
         */
        static toString(): string;
        /**
         * Egret 贴图。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        texture: egret.Texture | null;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        createTexture(): TextureData;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        dispose(): void;
    }
    /**
     * @private
     */
    class EgretTextureData extends TextureData {
        static toString(): string;
        texture: egret.Texture;
        /**
         * @private
         */
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    class BuildArmaturePackage {
        dataName: string;
        textureAtlasName: string;
        data: DragonBonesData;
        armature: ArmatureData;
        skin: SkinData | null;
    }
    /**
     * 创建骨架的基础工厂。 (通常只需要一个全局工厂实例)
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    abstract class BaseFactory {
        /**
         * @private
         */
        protected static readonly _objectParser: ObjectDataParser;
        /**
         * @private
         */
        protected static readonly _binaryParser: BinaryDataParser;
        /**
         * 是否开启共享搜索。
         * 如果开启，创建一个骨架时，可以从多个龙骨数据中寻找骨架数据，或贴图集数据中寻找贴图数据。 (通常在有共享导出的数据时开启)
         * @see dragonBones.DragonBonesData#autoSearch
         * @see dragonBones.TextureAtlasData#autoSearch
         * @version DragonBones 4.5
         * @language zh_CN
         */
        autoSearch: boolean;
        /**
         * @private
         */
        protected readonly _dragonBonesDataMap: Map<DragonBonesData>;
        /**
         * @private
         */
        protected readonly _textureAtlasDataMap: Map<Array<TextureAtlasData>>;
        /**
         * @private
         */
        protected _dataParser: DataParser;
        /**
         * 创建一个工厂。 (通常只需要一个全局工厂实例)
         * @param dataParser 龙骨数据解析器，如果不设置，则使用默认解析器。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        constructor(dataParser?: DataParser | null);
        /**
         * @private
         */
        protected _isSupportMesh(): boolean;
        /**
         * @private
         */
        protected _getTextureData(textureAtlasName: string, textureName: string): TextureData | null;
        /**
         * @private
         */
        protected _fillBuildArmaturePackage(dataPackage: BuildArmaturePackage, dragonBonesName: string | null, armatureName: string, skinName: string | null, textureAtlasName: string | null): boolean;
        /**
         * @private
         */
        protected _buildBones(dataPackage: BuildArmaturePackage, armature: Armature): void;
        /**
         * @private
         */
        protected _buildSlots(dataPackage: BuildArmaturePackage, armature: Armature): void;
        /**
         * @private
         */
        protected _getSlotDisplay(dataPackage: BuildArmaturePackage, displayData: DisplayData, rawDisplayData: DisplayData | null, slot: Slot): any;
        /**
         * @private
         */
        protected _replaceSlotDisplay(dataPackage: BuildArmaturePackage, displayData: DisplayData | null, slot: Slot, displayIndex: number): void;
        /**
         * @private
         */
        protected abstract _buildTextureAtlasData(textureAtlasData: TextureAtlasData | null, textureAtlas: any): TextureAtlasData;
        /**
         * @private
         */
        protected abstract _buildArmature(dataPackage: BuildArmaturePackage): Armature;
        /**
         * @private
         */
        protected abstract _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, displays: Array<DisplayData | null>, armature: Armature): Slot;
        /**
         * 解析并添加龙骨数据。
         * @param rawData 需要解析的原始数据。
         * @param name 为数据提供一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @returns DragonBonesData
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        parseDragonBonesData(rawData: any, name?: string | null, scale?: number): DragonBonesData | null;
        /**
         * 解析并添加贴图集数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param textureAtlas 贴图。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @param scale 为贴图集设置一个缩放值。
         * @returns 贴图集数据
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.TextureAtlasData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        parseTextureAtlasData(rawData: any, textureAtlas: any, name?: string | null, scale?: number): TextureAtlasData;
        /**
         * @version DragonBones 5.1
         * @language zh_CN
         */
        updateTextureAtlasData(name: string, textureAtlases: Array<any>): void;
        /**
         * 获取指定名称的龙骨数据。
         * @param name 数据名称。
         * @returns DragonBonesData
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getDragonBonesData(name: string): DragonBonesData | null;
        /**
         * 添加龙骨数据。
         * @param data 龙骨数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        addDragonBonesData(data: DragonBonesData, name?: string | null): void;
        /**
         * 移除龙骨数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeDragonBonesData(name: string, disposeData?: boolean): void;
        /**
         * 获取指定名称的贴图集数据列表。
         * @param name 数据名称。
         * @returns 贴图集数据列表。
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getTextureAtlasData(name: string): Array<TextureAtlasData> | null;
        /**
         * 添加贴图集数据。
         * @param data 贴图集数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        addTextureAtlasData(data: TextureAtlasData, name?: string | null): void;
        /**
         * 移除贴图集数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeTextureAtlasData(name: string, disposeData?: boolean): void;
        /**
         * 清除所有的数据。
         * @param disposeData 是否释放数据。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        clear(disposeData?: boolean): void;
        /**
         * 创建一个骨架。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，当多个龙骨数据中包含同名的骨架数据时，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据名称。
         * @returns 骨架
         * @see dragonBones.ArmatureData
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         * @language zh_CN
         */
        buildArmature(armatureName: string, dragonBonesName?: string | null, skinName?: string | null, textureAtlasName?: string | null): Armature | null;
        changeSkin(armature: Armature, armatureName: string, dragonBonesName?: string | null, skinName?: string | null, exclude?: Array<string> | null): void;
        /**
         * 将骨架的动画替换成其他骨架的动画。 (通常这些骨架应该具有相同的骨架结构)
         * @param toArmature 指定的骨架。
         * @param fromArmatreName 其他骨架的名称。
         * @param fromSkinName 其他骨架的皮肤名称，如果未设置，则使用默认皮肤。
         * @param fromDragonBonesDataName 其他骨架属于的龙骨数据名称，如果未设置，则检索所有的龙骨数据。
         * @param replaceOriginalAnimation 是否替换原有的同名动画。
         * @returns 是否替换成功。
         * @see dragonBones.Armature
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        copyAnimationsToArmature(toArmature: Armature, fromArmatreName: string, fromSkinName?: string | null, fromDragonBonesDataName?: string | null, replaceOriginalAnimation?: boolean): boolean;
        /**
         * 用指定资源替换指定插槽的显示对象。(用 "dragonBonesName/armatureName/slotName/displayName" 的资源替换 "slot" 的显示对象)
         * @param dragonBonesName 指定的龙骨数据名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param displayName 指定的显示对象名称。
         * @param slot 指定的插槽实例。
         * @param displayIndex 要替换的显示对象的索引，如果未设置，则替换当前正在显示的显示对象。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        replaceSlotDisplay(dragonBonesName: string, armatureName: string, slotName: string, displayName: string, slot: Slot, displayIndex?: number): void;
        /**
         * 用指定资源列表替换插槽的显示对象列表。
         * @param dragonBonesName 指定的 DragonBonesData 名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param slot 指定的插槽实例。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        replaceSlotDisplayList(dragonBonesName: string, armatureName: string, slotName: string, slot: Slot): void;
        /**
         * @private
         */
        getAllDragonBonesData(): Map<DragonBonesData>;
        /**
         * @private
         */
        getAllTextureAtlasData(): Map<Array<TextureAtlasData>>;
    }
}
declare namespace dragonBones {
    /**
     * 插槽，附着在骨骼上，控制显示对象的显示状态和属性。
     * 一个骨骼上可以包含多个插槽。
     * 一个插槽中可以包含多个显示对象，同一时间只能显示其中的一个显示对象，但可以在动画播放的过程中切换显示对象实现帧动画。
     * 显示对象可以是普通的图片纹理，也可以是子骨架的显示容器，网格显示对象，还可以是自定义的其他显示对象。
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    abstract class Slot extends TransformObject {
        /**
         * 显示对象受到控制的动画状态或混合组名称，设置为 null 则表示受所有的动画状态控制。
         * @default null
         * @see dragonBones.AnimationState#displayControl
         * @see dragonBones.AnimationState#name
         * @see dragonBones.AnimationState#group
         * @version DragonBones 4.5
         * @language zh_CN
         */
        displayController: string | null;
        /**
         * @readonly
         */
        slotData: SlotData;
        /**
         * @private
         */
        protected _displayDirty: boolean;
        /**
         * @private
         */
        protected _zOrderDirty: boolean;
        /**
         * @private
         */
        protected _visibleDirty: boolean;
        /**
         * @private
         */
        protected _blendModeDirty: boolean;
        /**
         * @private
         */
        _colorDirty: boolean;
        /**
         * @private
         */
        _meshDirty: boolean;
        /**
         * @private
         */
        protected _transformDirty: boolean;
        /**
         * @private
         */
        protected _visible: boolean;
        /**
         * @private
         */
        protected _blendMode: BlendMode;
        /**
         * @private
         */
        protected _displayIndex: number;
        /**
         * @private
         */
        protected _animationDisplayIndex: number;
        /**
         * @private
         */
        _zOrder: number;
        /**
         * @private
         */
        protected _cachedFrameIndex: number;
        /**
         * @private
         */
        _pivotX: number;
        /**
         * @private
         */
        _pivotY: number;
        /**
         * @private
         */
        protected readonly _localMatrix: Matrix;
        /**
         * @private
         */
        readonly _colorTransform: ColorTransform;
        /**
         * @private
         */
        readonly _ffdVertices: Array<number>;
        /**
         * @private
         */
        readonly _displayDatas: Array<DisplayData | null>;
        /**
         * @private
         */
        protected readonly _displayList: Array<any | Armature>;
        /**
         * @private
         */
        protected readonly _meshBones: Array<Bone | null>;
        /**
         * @private
         */
        _rawDisplayDatas: Array<DisplayData | null>;
        /**
         * @private
         */
        protected _displayData: DisplayData | null;
        /**
         * @private
         */
        protected _textureData: TextureData | null;
        /**
         * @private
         */
        _meshData: MeshDisplayData | null;
        /**
         * @private
         */
        protected _boundingBoxData: BoundingBoxData | null;
        /**
         * @private
         */
        protected _rawDisplay: any;
        /**
         * @private
         */
        protected _meshDisplay: any;
        /**
         * @private
         */
        protected _display: any;
        /**
         * @private
         */
        protected _childArmature: Armature | null;
        /**
         * @private
         */
        _cachedFrameIndices: Array<number> | null;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        protected abstract _initDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _disposeDisplay(value: any): void;
        /**
         * @private
         */
        protected abstract _onUpdateDisplay(): void;
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
        protected abstract _updateZOrder(): void;
        /**
         * @private
         */
        abstract _updateVisible(): void;
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
        protected abstract _updateFrame(): void;
        /**
         * @private
         */
        protected abstract _updateMesh(): void;
        /**
         * @private
         */
        protected abstract _updateTransform(isSkinnedMesh: boolean): void;
        /**
         * @private
         */
        protected _isMeshBonesUpdate(): boolean;
        /**
         * @private
         */
        protected _updateDisplayData(): void;
        /**
         * @private
         */
        protected _updateDisplay(): void;
        /**
         * @private
         */
        protected _updateGlobalTransformMatrix(isCache: boolean): void;
        /**
         * @internal
         * @private
         */
        _setArmature(value: Armature | null): void;
        /**
         * @private
         */
        init(slotData: SlotData, displayDatas: Array<DisplayData>, rawDisplay: any, meshDisplay: any): void;
        /**
         * @internal
         * @private
         */
        update(cacheFrameIndex: number): void;
        /**
         * @private
         */
        _setDisplayList(value: Array<any> | null): boolean;
        /**
         * @internal
         * @private
         */
        _setDisplayIndex(value: number, isAnimation?: boolean): boolean;
        /**
         * @internal
         * @private
         */
        _setZorder(value: number): boolean;
        /**
         * @internal
         * @private
         */
        _setColor(value: ColorTransform): boolean;
        /**
         * @private
         */
        updateTransformAndMatrix(): void;
        /**
         * 判断指定的点是否在插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @version DragonBones 5.0
         * @language zh_CN
         */
        containsPoint(x: number, y: number): boolean;
        /**
         * 判断指定的线段与插槽的自定义包围盒是否相交。
         * @param xA 线段起点的水平坐标。（骨架内坐标系）
         * @param yA 线段起点的垂直坐标。（骨架内坐标系）
         * @param xB 线段终点的水平坐标。（骨架内坐标系）
         * @param yB 线段终点的垂直坐标。（骨架内坐标系）
         * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
         * @returns 相交的情况。 [-1: 不相交且线段在包围盒内, 0: 不相交, 1: 相交且有一个交点且终点在包围盒内, 2: 相交且有一个交点且起点在包围盒内, 3: 相交且有两个交点, N: 相交且有 N 个交点]
         * @version DragonBones 5.0
         * @language zh_CN
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
        /**
         * 在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        invalidUpdate(): void;
        /**
         * @language zh_CN
         * 插槽此时的自定义包围盒数据。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        readonly boundingBoxData: BoundingBoxData | null;
        /**
         * @private
         */
        readonly rawDisplay: any;
        /**
         * @private
         */
        readonly meshDisplay: any;
        /**
         * 此时显示的显示对象在显示列表中的索引。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        displayIndex: number;
        /**
         * 包含显示对象或子骨架的显示列表。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        displayList: Array<any>;
        /**
         * 此时显示的显示对象。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        display: any;
        /**
         * 此时显示的子骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         * @language zh_CN
         */
        childArmature: Armature | null;
        /**
         * @deprecated
         * @see #display
         */
        getDisplay(): any;
        /**
         * @deprecated
         * @see #display
         */
        setDisplay(value: any): void;
    }
}
declare namespace dragonBones {
    /**
     * WorldClock 提供时钟支持，为每个加入到时钟的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimateble
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class WorldClock implements IAnimateble {
        /**
         * 一个可以直接使用的全局 WorldClock 实例.
         * @version DragonBones 3.0
         * @language zh_CN
         */
        static readonly clock: WorldClock;
        /**
         * 当前时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        time: number;
        /**
         * 时间流逝速度，用于控制动画变速播放。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        timeScale: number;
        private readonly _animatebles;
        private _clock;
        /**
         * 创建一个新的 WorldClock 实例。
         * 通常并不需要单独创建 WorldClock 实例，可以直接使用 WorldClock.clock 静态实例。
         * (创建更多独立的 WorldClock 实例可以更灵活的为需要更新的 IAnimateble 实例分组，用于控制不同组不同的播放速度)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        constructor(time?: number);
        /**
         * 为所有的 IAnimatable 实例更新时间。
         * @param passedTime 前进的时间。 (以秒为单位，当设置为 -1 时将自动计算当前帧与上一帧的时间差)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        advanceTime(passedTime: number): void;
        /**
         * 是否包含 IAnimatable 实例
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        contains(value: IAnimateble): boolean;
        /**
         * 添加 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        add(value: IAnimateble): void;
        /**
         * 移除 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        remove(value: IAnimateble): void;
        /**
         * 清除所有的 IAnimatable 实例。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        clear(): void;
        /**
         * @inheritDoc
         */
        clock: WorldClock | null;
    }
}
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    const enum TweenState {
        None = 0,
        Once = 1,
        Always = 2,
    }
    /**
     * @internal
     * @private
     */
    abstract class TimelineState extends BaseObject {
        playState: number;
        currentPlayTimes: number;
        currentTime: number;
        protected _tweenState: TweenState;
        protected _frameRate: number;
        protected _frameValueOffset: number;
        protected _frameCount: number;
        protected _frameOffset: number;
        protected _frameIndex: number;
        protected _frameRateR: number;
        protected _position: number;
        protected _duration: number;
        protected _timeScale: number;
        protected _timeOffset: number;
        protected _dragonBonesData: DragonBonesData;
        protected _animationData: AnimationData;
        protected _timelineData: TimelineData | null;
        protected _armature: Armature;
        protected _animationState: AnimationState;
        protected _actionTimeline: TimelineState;
        protected _frameArray: Array<number> | Int16Array;
        protected _frameIntArray: Array<number> | Int16Array;
        protected _frameFloatArray: Array<number> | Int16Array;
        protected _timelineArray: Array<number> | Uint16Array;
        protected _frameIndices: Array<number>;
        protected _onClear(): void;
        protected abstract _onArriveAtFrame(): void;
        protected abstract _onUpdateFrame(): void;
        protected _setCurrentTime(passedTime: number): boolean;
        init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void;
        fadeOut(): void;
        update(passedTime: number): void;
    }
    /**
     * @internal
     * @private
     */
    abstract class TweenTimelineState extends TimelineState {
        private static _getEasingValue(tweenType, progress, easing);
        private static _getEasingCurveValue(progress, samples, count, offset);
        protected _tweenType: TweenType;
        protected _curveCount: number;
        protected _framePosition: number;
        protected _frameDurationR: number;
        protected _tweenProgress: number;
        protected _tweenEasing: number;
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
    }
    /**
     * @internal
     * @private
     */
    abstract class BoneTimelineState extends TweenTimelineState {
        bone: Bone;
        bonePose: BonePose;
        protected _onClear(): void;
    }
    /**
     * @internal
     * @private
     */
    abstract class SlotTimelineState extends TweenTimelineState {
        slot: Slot;
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * Egret 事件。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    class EgretEvent extends egret.Event {
        /**
         * 事件对象。
         * @see dragonBones.EventObject
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly eventObject: EventObject;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#animationState
         */
        readonly animationName: string;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#armature
         */
        readonly armature: Armature;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#bone
         */
        readonly bone: Bone | null;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#slot
         */
        readonly slot: Slot | null;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#animationState
         */
        readonly animationState: AnimationState | null;
        /**
         * @deprecated
         * @see dragonBones.EventObject#name
         */
        readonly frameLabel: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject#name
         */
        readonly sound: string;
        /**
         * @deprecated
         * @see #animationName
         */
        readonly movementID: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.START
         */
        static START: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.LOOP_COMPLETE
         */
        static LOOP_COMPLETE: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.COMPLETE
         */
        static COMPLETE: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FADE_IN
         */
        static FADE_IN: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FADE_IN_COMPLETE
         */
        static FADE_IN_COMPLETE: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FADE_OUT
         */
        static FADE_OUT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FADE_OUT_COMPLETE
         */
        static FADE_OUT_COMPLETE: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        static FRAME_EVENT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        static SOUND_EVENT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        static ANIMATION_FRAME_EVENT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        static BONE_FRAME_EVENT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.FRAME_EVENT
         */
        static MOVEMENT_FRAME_EVENT: string;
        /**
         * @deprecated
         * @see dragonBones.EventObject.SOUND_EVENT
         */
        static SOUND: string;
    }
    /**
     * @inheritDoc
     */
    class EgretArmatureDisplay extends egret.DisplayObjectContainer implements IArmatureProxy, IEventDispatcher {
        private static _cleanBeforeRender();
        /**
         * @internal
         * @private
         */
        _batchEnabled: boolean;
        private _disposeProxy;
        private _armature;
        private _debugDrawer;
        /**
         * @internal
         * @private
         */
        _enableBatch(value: boolean): void;
        /**
         * @private
         */
        debugUpdate(isEnabled: boolean): void;
        /**
         * @inheritDoc
         */
        init(armature: Armature): void;
        /**
         * @inheritDoc
         */
        clear(): void;
        /**
         * @inheritDoc
         */
        dispose(disposeProxy?: boolean): void;
        /**
         * @internal
         * @private
         */
        _dispatchEvent(type: EventStringType, eventObject: EventObject): void;
        /**
         * @inheritDoc
         */
        hasEvent(type: EventStringType): boolean;
        /**
         * @inheritDoc
         */
        addEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void;
        /**
         * @inheritDoc
         */
        removeEvent(type: EventStringType, listener: (event: EgretEvent) => void, target: any): void;
        /**
         * @inheritDoc
         */
        readonly armature: Armature;
        /**
         * @inheritDoc
         */
        readonly animation: Animation;
        /**
         * @deprecated
         * @see dragonBones.Armature#clock
         * @see dragonBones.EgretFactory#clock
         * @see dragonBones.Animation#timescale
         * @see dragonBones.Animation#stop()
         */
        advanceTimeBySelf(on: boolean): void;
    }
    /**
     * @deprecated
     * @see dragonBones.Armature
     */
    type FastArmature = Armature;
    /**
     * @deprecated
     * @see dragonBones.Bone
     */
    type FastBone = Bone;
    /**
     * @deprecated
     * @see dragonBones.Slot
     */
    type FastSlot = Slot;
    /**
     * @deprecated
     * @see dragonBones.Animation
     */
    type FastAnimation = Animation;
    /**
     * @deprecated
     * @see dragonBones.AnimationState
     */
    type FastAnimationState = AnimationState;
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    class Event extends EgretEvent {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    class ArmatureEvent extends EgretEvent {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    class AnimationEvent extends EgretEvent {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    class FrameEvent extends EgretEvent {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretEvent
     */
    class SoundEvent extends EgretEvent {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    class EgretTextureAtlas extends EgretTextureAtlasData {
        /**
         * @private
         */
        static toString(): string;
        constructor(texture: egret.Texture, rawData: any, scale?: number);
    }
    /**
     * @deprecated
     * @see dragonBones.EgretTextureAtlasData
     */
    class EgretSheetAtlas extends EgretTextureAtlas {
    }
    /**
     * @deprecated
     * @see dragonBones.EgretFactory#soundEventManater
     */
    class SoundEventManager {
        /**
         * @deprecated
         * @see dragonBones.EgretFactory#soundEventManater
         */
        static getInstance(): EgretArmatureDisplay;
    }
    /**
     * @deprecated
     * @see dragonBones.Armature#cacheFrameRate
     * @see dragonBones.Armature#enableAnimationCache()
     */
    class AnimationCacheManager {
    }
}
declare namespace dragonBones {
    /**
     * @private
     * @internal
     */
    abstract class Constraint extends BaseObject {
        protected static readonly _helpMatrix: Matrix;
        protected static readonly _helpTransform: Transform;
        protected static readonly _helpPoint: Point;
        target: Bone;
        bone: Bone;
        root: Bone | null;
        protected _onClear(): void;
        abstract update(): void;
    }
    /**
     * @private
     * @internal
     */
    class IKConstraint extends Constraint {
        static toString(): string;
        bendPositive: boolean;
        scaleEnabled: boolean;
        weight: number;
        protected _onClear(): void;
        private _computeA();
        private _computeB();
        update(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架代理接口。
     * @version DragonBones 5.0
     */
    interface IArmatureProxy extends IEventDispatcher {
        /**
         * @private
         */
        init(armature: Armature): void;
        /**
         * @private
         */
        clear(): void;
        /**
         * @language zh_CN
         * 释放代理和骨架。 (骨架会回收到对象池)
         * @version DragonBones 4.5
         */
        dispose(disposeProxy: boolean): void;
        /**
         * @private
         */
        debugUpdate(isEnabled: boolean): void;
        /**
         * @language zh_CN
         * 获取骨架。
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         */
        readonly armature: Armature;
        /**
         * @language zh_CN
         * 获取动画控制器。
         * @see dragonBones.Animation
         * @version DragonBones 4.5
         */
        readonly animation: Animation;
    }
}
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    class BonePose extends BaseObject {
        static toString(): string;
        readonly current: Transform;
        readonly delta: Transform;
        readonly result: Transform;
        protected _onClear(): void;
    }
    /**
     * 动画状态，播放动画时产生，可以对每个播放的动画进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class AnimationState extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * 是否将骨架的骨骼和插槽重置为绑定姿势（如果骨骼和插槽在这个动画状态中没有动画）。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        resetToPose: boolean;
        /**
         * 是否以增加的方式混合。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        additiveBlending: boolean;
        /**
         * 是否对插槽的显示对象有控制权。
         * @see dragonBones.Slot#displayController
         * @version DragonBones 3.0
         * @language zh_CN
         */
        displayControl: boolean;
        /**
         * 是否能触发行为。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        actionEnabled: boolean;
        /**
         * 混合图层。
         * @version DragonBones 3.0
         * @readonly
         * @language zh_CN
         */
        layer: number;
        /**
         * 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        playTimes: number;
        /**
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        timeScale: number;
        /**
         * 混合权重。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        weight: number;
        /**
         * 自动淡出时间。 [-1: 不自动淡出, [0~N]: 淡出时间] (以秒为单位)
         * 当设置一个大于等于 0 的值，动画状态将会在播放完成后自动淡出。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        autoFadeOutTime: number;
        /**
         * @private
         */
        fadeTotalTime: number;
        /**
         * 动画名称。
         * @version DragonBones 3.0
         * @readonly
         * @language zh_CN
         */
        name: string;
        /**
         * 混合组。
         * @version DragonBones 3.0
         * @readonly
         * @language zh_CN
         */
        group: string;
        /**
         * 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @readonly
         * @language zh_CN
         */
        animationData: AnimationData;
        private _timelineDirty;
        /**
         * @internal
         * @private
         * xx: Play Enabled, Fade Play Enabled
         */
        _playheadState: number;
        /**
         * @internal
         * @private
         * -1: Fade in, 0: Fade complete, 1: Fade out;
         */
        _fadeState: number;
        /**
         * @internal
         * @private
         * -1: Fade start, 0: Fading, 1: Fade complete;
         */
        _subFadeState: number;
        /**
         * @internal
         * @private
         */
        _position: number;
        /**
         * @internal
         * @private
         */
        _duration: number;
        private _fadeTime;
        private _time;
        /**
         * @internal
         * @private
         */
        _fadeProgress: number;
        private _weightResult;
        private readonly _boneMask;
        private readonly _boneTimelines;
        private readonly _slotTimelines;
        private readonly _bonePoses;
        private _armature;
        /**
         * @internal
         * @private
         */
        _actionTimeline: ActionTimelineState;
        private _zOrderTimeline;
        /**
         * @private
         */
        protected _onClear(): void;
        private _isDisabled(slot);
        private _advanceFadeTime(passedTime);
        private _blendBoneTimline(timeline);
        /**
         * @private
         * @internal
         */
        init(armature: Armature, animationData: AnimationData, animationConfig: AnimationConfig): void;
        /**
         * @private
         * @internal
         */
        updateTimelines(): void;
        /**
         * @private
         * @internal
         */
        advanceTime(passedTime: number, cacheFrameRate: number): void;
        /**
         * 继续播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        play(): void;
        /**
         * 暂停播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        stop(): void;
        /**
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        fadeOut(fadeOutTime: number, pausePlayhead?: boolean): void;
        /**
         * 是否包含骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        containsBoneMask(name: string): boolean;
        /**
         * 添加骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        addBoneMask(name: string, recursive?: boolean): void;
        /**
         * 删除骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeBoneMask(name: string, recursive?: boolean): void;
        /**
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        removeAllBoneMask(): void;
        /**
         * 是否正在淡入。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        readonly isFadeIn: boolean;
        /**
         * 是否正在淡出。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        readonly isFadeOut: boolean;
        /**
         * 是否淡入完毕。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        readonly isFadeComplete: boolean;
        /**
         * 是否正在播放。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly isPlaying: boolean;
        /**
         * 是否播放完毕。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly isCompleted: boolean;
        /**
         * 当前播放次数。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly currentPlayTimes: number;
        /**
         * 总时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly totalTime: number;
        /**
         * 当前播放的时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        currentTime: number;
        /**
         * @deprecated
         */
        autoTween: boolean;
        /**
         * @deprecated
         * @see #animationData
         */
        readonly clip: AnimationData;
    }
}
declare namespace dragonBones {
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        copyFrom(value: Rectangle): void;
        copyFromValue(x: number, y: number, width: number, height: number): void;
        clear(): void;
    }
}
declare namespace dragonBones {
    /**
     * 播放动画接口。 (Armature 和 WordClock 都实现了该接口)
     * 任何实现了此接口的实例都可以加到 WorldClock 实例中，由 WorldClock 统一更新时间。
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     * @language zh_CN
     */
    interface IAnimateble {
        /**
         * 更新时间。
         * @param passedTime 前进的时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        advanceTime(passedTime: number): void;
        /**
         * 当前所属的 WordClock 实例。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        clock: WorldClock | null;
    }
}
declare namespace dragonBones {
    /**
     * 动画配置，描述播放一个动画所需要的全部信息。
     * @see dragonBones.AnimationState
     * @version DragonBones 5.0
     * @beta
     * @language zh_CN
     */
    class AnimationConfig extends BaseObject {
        static toString(): string;
        /**
         * 是否暂停淡出的动画。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        pauseFadeOut: boolean;
        /**
         * 淡出模式。
         * @default dragonBones.AnimationFadeOutMode.All
         * @see dragonBones.AnimationFadeOutMode
         * @version DragonBones 5.0
         * @language zh_CN
         */
        fadeOutMode: AnimationFadeOutMode;
        /**
         * 淡出缓动方式。
         * @default TweenType.Line
         * @see dragonBones.TweenType
         * @version DragonBones 5.0
         * @language zh_CN
         */
        fadeOutTweenType: TweenType;
        /**
         * 淡出时间。 [-1: 与淡入时间同步, [0~N]: 淡出时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        fadeOutTime: number;
        /**
         * 否能触发行为。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        actionEnabled: boolean;
        /**
         * 是否以增加的方式混合。
         * @default false
         * @version DragonBones 5.0
         * @language zh_CN
         */
        additiveBlending: boolean;
        /**
         * 是否对插槽的显示对象有控制权。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        displayControl: boolean;
        /**
         * 是否暂停淡入的动画，直到淡入过程结束。
         * @default true
         * @version DragonBones 5.0
         * @language zh_CN
         */
        pauseFadeIn: boolean;
        /**
         * 是否将没有动画的对象重置为初始值。
         * @default true
         * @version DragonBones 5.1
         * @language zh_CN
         */
        resetToPose: boolean;
        /**
         * 淡入缓动方式。
         * @default TweenType.Line
         * @see dragonBones.TweenType
         * @version DragonBones 5.0
         * @language zh_CN
         */
        fadeInTweenType: TweenType;
        /**
         * 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @default -1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        playTimes: number;
        /**
         * 混合图层，图层高会优先获取混合权重。
         * @default 0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        layer: number;
        /**
         * 开始时间。 (以秒为单位)
         * @default 0
         * @version DragonBones 5.0
         * @language zh_CN
         */
        position: number;
        /**
         * 持续时间。 [-1: 使用动画数据默认值, 0: 动画停止, (0~N]: 持续时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        duration: number;
        /**
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         * @language zh_CN
         */
        timeScale: number;
        /**
         * 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        fadeInTime: number;
        /**
         * 自动淡出时间。 [-1: 不自动淡出, [0~N]: 淡出时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        autoFadeOutTime: number;
        /**
         * 混合权重。
         * @default 1
         * @version DragonBones 5.0
         * @language zh_CN
         */
        weight: number;
        /**
         * 动画状态名。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        name: string;
        /**
         * 动画数据名。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        animation: string;
        /**
         * 混合组，用于动画状态编组，方便控制淡出。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        group: string;
        /**
         * 骨骼遮罩。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly boneMask: Array<string>;
        /**
         * @private
         */
        protected _onClear(): void;
        clear(): void;
        copyFrom(value: AnimationConfig): void;
        containsBoneMask(name: string): boolean;
        addBoneMask(armature: Armature, name: string, recursive?: boolean): void;
        removeBoneMask(armature: Armature, name: string, recursive?: boolean): void;
    }
}
declare namespace dragonBones {
    /**
     * 动画数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class AnimationData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        frameIntOffset: number;
        /**
         * @private
         */
        frameFloatOffset: number;
        /**
         * @private
         */
        frameOffset: number;
        /**
         * 持续的帧数。 ([1~N])
         * @version DragonBones 3.0
         * @language zh_CN
         */
        frameCount: number;
        /**
         * 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         * @language zh_CN
         */
        playTimes: number;
        /**
         * 持续时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        duration: number;
        /**
         * @private
         */
        scale: number;
        /**
         * 淡入时间。 (以秒为单位)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        fadeInTime: number;
        /**
         * @private
         */
        cacheFrameRate: number;
        /**
         * 数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * @private
         */
        readonly cachedFrames: Array<boolean>;
        /**
         * @private
         */
        readonly boneTimelines: Map<Array<TimelineData>>;
        /**
         * @private
         */
        readonly slotTimelines: Map<Array<TimelineData>>;
        /**
         * @private
         */
        readonly boneCachedFrameIndices: Map<Array<number>>;
        /**
         * @private
         */
        readonly slotCachedFrameIndices: Map<Array<number>>;
        /**
         * @private
         */
        parent: ArmatureData;
        /**
         * @private
         */
        actionTimeline: TimelineData | null;
        /**
         * @private
         */
        zOrderTimeline: TimelineData | null;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        cacheFrames(frameRate: number): void;
        /**
         * @private
         */
        addBoneTimeline(bone: BoneData, timeline: TimelineData): void;
        /**
         * @private
         */
        addSlotTimeline(slot: SlotData, timeline: TimelineData): void;
        /**
         * @private
         */
        getBoneTimelines(name: string): Array<TimelineData> | null;
        /**
         * @private
         */
        getSlotTimeline(name: string): Array<TimelineData> | null;
        /**
         * @private
         */
        getBoneCachedFrameIndices(name: string): Array<number> | null;
        /**
         * @private
         */
        getSlotCachedFrameIndices(name: string): Array<number> | null;
    }
    /**
     * @private
     */
    class TimelineData extends BaseObject {
        static toString(): string;
        type: TimelineType;
        offset: number;
        frameIndicesOffset: number;
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    class CanvasData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        hasBackground: boolean;
        color: number;
        x: number;
        y: number;
        width: number;
        height: number;
        /**
         * @private
         */
        protected _onClear(): void;
    }
    /**
     * 骨架数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class ArmatureData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        isRightTransform: boolean;
        /**
         * 动画帧率。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        frameRate: number;
        /**
         * @private
         */
        type: ArmatureType;
        /**
         * @private
         */
        cacheFrameRate: number;
        /**
         * @private
         */
        scale: number;
        /**
         * 数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * @private
         */
        readonly aabb: Rectangle;
        /**
         * 所有动画数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly animationNames: Array<string>;
        /**
         * @private
         */
        readonly sortedBones: Array<BoneData>;
        /**
         * @private
         */
        readonly sortedSlots: Array<SlotData>;
        /**
         * @private
         */
        readonly defaultActions: Array<ActionData>;
        /**
         * @private
         */
        readonly actions: Array<ActionData>;
        /**
         * 所有骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly bones: Map<BoneData>;
        /**
         * 所有插槽数据。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly slots: Map<SlotData>;
        /**
         * @private
         */
        readonly skins: Map<SkinData>;
        /**
         * 所有动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly animations: Map<AnimationData>;
        /**
         * 所属的龙骨数据。
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        parent: DragonBonesData;
        /**
         * @private
         */
        defaultSkin: SkinData | null;
        /**
         * 获取默认动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        defaultAnimation: AnimationData | null;
        /**
         * @private
         */
        canvas: CanvasData | null;
        /**
         * @private
         */
        userData: UserData | null;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        sortBones(): void;
        /**
         * @private
         */
        cacheFrames(frameRate: number): void;
        /**
         * @private
         */
        setCacheFrame(globalTransformMatrix: Matrix, transform: Transform, arrayOffset?: number): number;
        /**
         * @private
         */
        getCacheFrame(globalTransformMatrix: Matrix, transform: Transform, arrayOffset: number): void;
        /**
         * @private
         */
        addBone(value: BoneData): void;
        /**
         * @private
         */
        addSlot(value: SlotData): void;
        /**
         * @private
         */
        addSkin(value: SkinData): void;
        /**
         * @private
         */
        addAnimation(value: AnimationData): void;
        /**
         * 获取骨骼数据。
         * @param name 骨骼数据名称。
         * @version DragonBones 3.0
         * @see dragonBones.BoneData
         * @language zh_CN
         */
        getBone(name: string): BoneData | null;
        /**
         * 获取插槽数据。
         * @param name 插槽数据名称。
         * @version DragonBones 3.0
         * @see dragonBones.SlotData
         * @language zh_CN
         */
        getSlot(name: string): SlotData | null;
        /**
         * @private
         */
        getSkin(name: string): SkinData | null;
        /**
         * 获取动画数据。
         * @param name 动画数据名称。
         * @version DragonBones 3.0
         * @see dragonBones.AnimationData
         * @language zh_CN
         */
        getAnimation(name: string): AnimationData | null;
    }
    /**
     * 骨骼数据。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class BoneData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        inheritTranslation: boolean;
        /**
         * @private
         */
        inheritRotation: boolean;
        /**
         * @private
         */
        inheritScale: boolean;
        /**
         * @private
         */
        inheritReflection: boolean;
        /**
         * @private
         */
        length: number;
        /**
         * 数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * @private
         */
        readonly transform: Transform;
        /**
         * @private
         */
        readonly constraints: Array<ConstraintData>;
        /**
         * 所属的父骨骼数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        parent: BoneData | null;
        /**
         * @private
         */
        userData: UserData | null;
        /**
         * @private
         */
        protected _onClear(): void;
    }
    /**
     * 插槽数据。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class SlotData extends BaseObject {
        /**
         * @private
         */
        static readonly DEFAULT_COLOR: ColorTransform;
        /**
         * @private
         */
        static createColor(): ColorTransform;
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        blendMode: BlendMode;
        /**
         * @private
         */
        displayIndex: number;
        /**
         * @private
         */
        zOrder: number;
        /**
         * 数据名称。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * 所属的父骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        parent: BoneData;
        /**
         * @private
         */
        color: ColorTransform;
        /**
         * @private
         */
        userData: UserData | null;
        /**
         * @private
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class SkinData extends BaseObject {
        static toString(): string;
        name: string;
        readonly skinSlotNames: Array<string>;
        readonly displays: Map<Array<DisplayData | null>>;
        protected _onClear(): void;
        addDisplay(slotName: string, value: DisplayData | null): void;
        getDisplay(slotName: string, displayName: string): DisplayData | null;
        getDisplays(slotName: string): Array<DisplayData | null> | null;
    }
}
declare namespace dragonBones {
    /**
     * 边界框数据基类。
     * @see dragonBones.RectangleData
     * @see dragonBones.EllipseData
     * @see dragonBones.PolygonData
     * @version DragonBones 5.0
     * @language zh_CN
     */
    abstract class BoundingBoxData extends BaseObject {
        /**
         * 边界框类型。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        type: BoundingBoxType;
        /**
         * 边界框颜色。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        color: number;
        /**
         * 边界框宽。（本地坐标系）
         * @version DragonBones 5.0
         * @language zh_CN
         */
        width: number;
        /**
         * 边界框高。（本地坐标系）
         * @version DragonBones 5.0
         * @language zh_CN
         */
        height: number;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * 是否包含点。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        abstract containsPoint(pX: number, pY: number): boolean;
        /**
         * 是否与线段相交。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        abstract intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA: {
            x: number;
            y: number;
        } | null, intersectionPointB: {
            x: number;
            y: number;
        } | null, normalRadians: {
            x: number;
            y: number;
        } | null): number;
    }
    /**
     * 矩形边界框。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    class RectangleBoundingBoxData extends BoundingBoxData {
        /**
         * @private
         */
        static toString(): string;
        /**
         * Compute the bit code for a point (x, y) using the clip rectangle
         */
        private static _computeOutCode(x, y, xMin, yMin, xMax, yMax);
        /**
         * @private
         */
        static intersectsSegment(xA: number, yA: number, xB: number, yB: number, xMin: number, yMin: number, xMax: number, yMax: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @inherDoc
         */
        containsPoint(pX: number, pY: number): boolean;
        /**
         * @inherDoc
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
    }
    /**
     * 椭圆边界框。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    class EllipseBoundingBoxData extends BoundingBoxData {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        static intersectsSegment(xA: number, yA: number, xB: number, yB: number, xC: number, yC: number, widthH: number, heightH: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @inherDoc
         */
        containsPoint(pX: number, pY: number): boolean;
        /**
         * @inherDoc
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
    }
    /**
     * 多边形边界框。
     * @version DragonBones 5.1
     * @language zh_CN
     */
    class PolygonBoundingBoxData extends BoundingBoxData {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        static intersectsSegment(xA: number, yA: number, xB: number, yB: number, vertices: Array<number> | Float32Array, offset: number, count: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
        /**
         * @private
         */
        count: number;
        /**
         * @private
         */
        offset: number;
        /**
         * @private
         */
        x: number;
        /**
         * @private
         */
        y: number;
        /**
         * 多边形顶点。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        vertices: Array<number> | Float32Array;
        /**
         * @private
         */
        weight: WeightData | null;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @inherDoc
         */
        containsPoint(pX: number, pY: number): boolean;
        /**
         * @inherDoc
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): number;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    abstract class ConstraintData extends BaseObject {
        order: number;
        target: BoneData;
        bone: BoneData;
        root: BoneData | null;
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class IKConstraintData extends ConstraintData {
        static toString(): string;
        bendPositive: boolean;
        scaleEnabled: boolean;
        weight: number;
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    abstract class DisplayData extends BaseObject {
        type: DisplayType;
        name: string;
        path: string;
        readonly transform: Transform;
        parent: ArmatureData;
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class ImageDisplayData extends DisplayData {
        static toString(): string;
        readonly pivot: Point;
        texture: TextureData | null;
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class ArmatureDisplayData extends DisplayData {
        static toString(): string;
        inheritAnimation: boolean;
        readonly actions: Array<ActionData>;
        armature: ArmatureData | null;
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class MeshDisplayData extends ImageDisplayData {
        static toString(): string;
        inheritAnimation: boolean;
        offset: number;
        weight: WeightData | null;
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class BoundingBoxDisplayData extends DisplayData {
        static toString(): string;
        boundingBox: BoundingBoxData | null;
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class WeightData extends BaseObject {
        static toString(): string;
        count: number;
        offset: number;
        readonly bones: Array<BoneData>;
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * 龙骨数据。
     * 一个龙骨数据包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class DragonBonesData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * 是否开启共享搜索。
         * @default false
         * @version DragonBones 4.5
         * @language zh_CN
         */
        autoSearch: boolean;
        /**
         * 动画帧频。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        frameRate: number;
        /**
         * 数据版本。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        version: string;
        /**
         * 数据名称。(该名称与龙骨项目名保持一致)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        name: string;
        /**
         * @private
         */
        readonly frameIndices: Array<number>;
        /**
         * @private
         */
        readonly cachedFrames: Array<number>;
        /**
         * 所有骨架数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly armatureNames: Array<string>;
        /**
         * 所有骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly armatures: Map<ArmatureData>;
        /**
         * @private
         */
        intArray: Array<number> | Int16Array;
        /**
         * @private
         */
        floatArray: Array<number> | Float32Array;
        /**
         * @private
         */
        frameIntArray: Array<number> | Int16Array;
        /**
         * @private
         */
        frameFloatArray: Array<number> | Float32Array;
        /**
         * @private
         */
        frameArray: Array<number> | Int16Array;
        /**
         * @private
         */
        timelineArray: Array<number> | Uint16Array;
        /**
         * @private
         */
        userData: UserData | null;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        addArmature(value: ArmatureData): void;
        /**
         * 获取骨架数据。
         * @param name 骨架数据名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getArmature(name: string): ArmatureData | null;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        dispose(): void;
    }
}
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    class ActionTimelineState extends TimelineState {
        static toString(): string;
        private _onCrossFrame(frameIndex);
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        update(passedTime: number): void;
        setCurrentTime(value: number): void;
    }
    /**
     * @internal
     * @private
     */
    class ZOrderTimelineState extends TimelineState {
        static toString(): string;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
    }
    /**
     * @internal
     * @private
     */
    class BoneAllTimelineState extends BoneTimelineState {
        static toString(): string;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        fadeOut(): void;
    }
    /**
     * @internal
     * @private
     */
    class SlotDislayIndexTimelineState extends SlotTimelineState {
        static toString(): string;
        protected _onArriveAtFrame(): void;
    }
    /**
     * @internal
     * @private
     */
    class SlotColorTimelineState extends SlotTimelineState {
        static toString(): string;
        private _dirty;
        private readonly _current;
        private readonly _delta;
        private readonly _result;
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        fadeOut(): void;
        update(passedTime: number): void;
    }
    /**
     * @internal
     * @private
     */
    class SlotFFDTimelineState extends SlotTimelineState {
        static toString(): string;
        private _dirty;
        private _meshOffset;
        private _frameFloatOffset;
        private _valueCount;
        private _ffdCount;
        private _valueOffset;
        private readonly _current;
        private readonly _delta;
        private readonly _result;
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        init(armature: Armature, animationState: AnimationState, timelineData: TimelineData | null): void;
        fadeOut(): void;
        update(passedTime: number): void;
    }
}
declare namespace dragonBones {
    /**
     * 自定义数据。
     * @version DragonBones 5.0
     * @language zh_CN
     */
    class UserData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * 自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly ints: Array<number>;
        /**
         * 自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly floats: Array<number>;
        /**
         * 自定义字符串。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly strings: Array<string>;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * 获取自定义整数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        getInt(index?: number): number;
        /**
         * 获取自定义浮点数。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        getFloat(index?: number): number;
        /**
         * 获取自定义字符串。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        getString(index?: number): string;
    }
    /**
     * @private
     */
    class ActionData extends BaseObject {
        static toString(): string;
        type: ActionType;
        name: string;
        bone: BoneData | null;
        slot: SlotData | null;
        data: UserData | null;
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * 动画控制器，用来播放动画数据，管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Animation extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * 播放速度。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1.0
         * @version DragonBones 3.0
         * @language zh_CN
         */
        timeScale: number;
        private _animationDirty;
        /**
         * @internal
         * @private
         */
        _timelineDirty: boolean;
        private readonly _animationNames;
        private readonly _animationStates;
        private readonly _animations;
        private _armature;
        private _animationConfig;
        private _lastAnimationState;
        /**
         * @private
         */
        protected _onClear(): void;
        private _fadeOut(animationConfig);
        /**
         * @internal
         * @private
         */
        init(armature: Armature): void;
        /**
         * @internal
         * @private
         */
        advanceTime(passedTime: number): void;
        /**
         * 清除所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        reset(): void;
        /**
         * 暂停播放动画。
         * @param animationName 动画状态的名称，如果未设置，则暂停所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        stop(animationName?: string | null): void;
        /**
         * 通过动画配置来播放动画。
         * @param animationConfig 动画配置。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationConfig
         * @see dragonBones.AnimationState
         * @version DragonBones 5.0
         * @beta
         * @language zh_CN
         */
        playConfig(animationConfig: AnimationConfig): AnimationState | null;
        /**
         * 播放动画。
         * @param animationName 动画数据名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        play(animationName?: string | null, playTimes?: number): AnimationState | null;
        /**
         * 淡入播放动画。
         * @param animationName 动画数据名称。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param fadeInTime 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
         * @param layer 混合图层，图层高会优先获取混合权重。
         * @param group 混合组，用于动画状态编组，方便控制淡出。
         * @param fadeOutMode 淡出模式。
         * @param resetToPose
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationFadeOutMode
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        fadeIn(animationName: string, fadeInTime?: number, playTimes?: number, layer?: number, group?: string | null, fadeOutMode?: AnimationFadeOutMode): AnimationState | null;
        /**
         * 从指定时间开始播放动画。
         * @param animationName 动画数据的名称。
         * @param time 开始时间。 (以秒为单位)
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndPlayByTime(animationName: string, time?: number, playTimes?: number): AnimationState | null;
        /**
         * 从指定帧开始播放动画。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndPlayByFrame(animationName: string, frame?: number, playTimes?: number): AnimationState | null;
        /**
         * 从指定进度开始播放动画。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndPlayByProgress(animationName: string, progress?: number, playTimes?: number): AnimationState | null;
        /**
         * 将动画停止到指定的时间。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndStopByTime(animationName: string, time?: number): AnimationState | null;
        /**
         * 将动画停止到指定的帧。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndStopByFrame(animationName: string, frame?: number): AnimationState | null;
        /**
         * 将动画停止到指定的进度。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0 ~ 1]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         * @language zh_CN
         */
        gotoAndStopByProgress(animationName: string, progress?: number): AnimationState | null;
        /**
         * 获取动画状态。
         * @param animationName 动画状态的名称。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getState(animationName: string): AnimationState | null;
        /**
         * 是否包含动画数据。
         * @param animationName 动画数据的名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         * @language zh_CN
         */
        hasAnimation(animationName: string): boolean;
        /**
         * 动画是否处于播放状态。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly isPlaying: boolean;
        /**
         * 所有动画状态是否均已播放完毕。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly isCompleted: boolean;
        /**
         * 上一个正在播放的动画状态名称。
         * @see #lastAnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly lastAnimationName: string;
        /**
         * 上一个正在播放的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly lastAnimationState: AnimationState | null;
        /**
         * 一个可以快速使用的动画配置实例。
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly animationConfig: AnimationConfig;
        /**
         * 所有动画数据名称。
         * @see #animations
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly animationNames: Array<string>;
        /**
         * 获取所有的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 5.1
         * @language zh_CN
         */
        getStates(): Array<AnimationState>;
        /**
         * 所有动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         * @language zh_CN
         */
        animations: Map<AnimationData>;
        /**
         * @deprecated
         * @see #play()
         * @see #fadeIn()
         * @see #gotoAndPlayByTime()
         * @see #gotoAndPlayByFrame()
         * @see #gotoAndPlayByProgress()
         */
        gotoAndPlay(animationName: string, fadeInTime?: number, duration?: number, playTimes?: number, layer?: number, group?: string | null, fadeOutMode?: AnimationFadeOutMode, pauseFadeOut?: boolean, pauseFadeIn?: boolean): AnimationState | null;
        /**
         * @deprecated
         * @see #gotoAndStopByTime()
         * @see #gotoAndStopByFrame()
         * @see #gotoAndStopByProgress()
         */
        gotoAndStop(animationName: string, time?: number): AnimationState | null;
        /**
         * @deprecated
         * @see #animationNames
         * @see #animations
         */
        readonly animationList: Array<string>;
        /**
         * @deprecated
         * @see #animationNames
         * @see #animations
         */
        readonly animationDataList: Array<AnimationData>;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    const enum BinaryOffset {
        WeigthBoneCount = 0,
        WeigthFloatOffset = 1,
        WeigthBoneIndices = 2,
        MeshVertexCount = 0,
        MeshTriangleCount = 1,
        MeshFloatOffset = 2,
        MeshWeightOffset = 3,
        MeshVertexIndices = 4,
        TimelineScale = 0,
        TimelineOffset = 1,
        TimelineKeyFrameCount = 2,
        TimelineFrameValueCount = 3,
        TimelineFrameValueOffset = 4,
        TimelineFrameOffset = 5,
        FramePosition = 0,
        FrameTweenType = 1,
        FrameTweenEasingOrCurveSampleCount = 2,
        FrameCurveSamples = 3,
        FFDTimelineMeshOffset = 0,
        FFDTimelineFFDCount = 1,
        FFDTimelineValueCount = 2,
        FFDTimelineValueOffset = 3,
        FFDTimelineFloatOffset = 4,
    }
    /**
     * @private
     */
    const enum ArmatureType {
        Armature = 0,
        MovieClip = 1,
        Stage = 2,
    }
    /**
     * @private
     */
    const enum DisplayType {
        Image = 0,
        Armature = 1,
        Mesh = 2,
        BoundingBox = 3,
    }
    /**
     * @language zh_CN
     * 包围盒类型。
     * @version DragonBones 5.0
     */
    const enum BoundingBoxType {
        Rectangle = 0,
        Ellipse = 1,
        Polygon = 2,
    }
    /**
     * @private
     */
    const enum ActionType {
        Play = 0,
        Frame = 10,
        Sound = 11,
    }
    /**
     * @private
     */
    const enum BlendMode {
        Normal = 0,
        Add = 1,
        Alpha = 2,
        Darken = 3,
        Difference = 4,
        Erase = 5,
        HardLight = 6,
        Invert = 7,
        Layer = 8,
        Lighten = 9,
        Multiply = 10,
        Overlay = 11,
        Screen = 12,
        Subtract = 13,
    }
    /**
     * @private
     */
    const enum TweenType {
        None = 0,
        Line = 1,
        Curve = 2,
        QuadIn = 3,
        QuadOut = 4,
        QuadInOut = 5,
    }
    /**
     * @private
     */
    const enum TimelineType {
        Action = 0,
        ZOrder = 1,
        BoneAll = 10,
        BoneT = 11,
        BoneR = 12,
        BoneS = 13,
        BoneX = 14,
        BoneY = 15,
        BoneRotation = 16,
        BoneSkew = 17,
        BoneScaleX = 18,
        BoneScaleY = 19,
        SlotDisplayIndex = 20,
        SlotColor = 21,
        SlotFFD = 22,
        AnimationTime = 40,
        AnimationWeight = 41,
    }
    /**
     * @private
     */
    const enum OffsetMode {
        None = 0,
        Additive = 1,
        Override = 2,
    }
    /**
     * @language zh_CN
     * 动画混合的淡出方式。
     * @version DragonBones 4.5
     */
    const enum AnimationFadeOutMode {
        /**
         * 不淡出动画。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        None = 0,
        /**
         * 淡出同层的动画。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        SameLayer = 1,
        /**
         * 淡出同组的动画。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        SameGroup = 2,
        /**
         * 淡出同层并且同组的动画。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        SameLayerAndGroup = 3,
        /**
         * 淡出所有动画。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        All = 4,
        /**
         * 不替换同名动画。
         * @version DragonBones 5.1
         * @language zh_CN
         */
        Single = 5,
    }
    /**
     * @private
     */
    interface Map<T> {
        [key: string]: T;
    }
    /**
     * @private
     */
    class DragonBones {
        static readonly VERSION: string;
        static readonly ARGUMENT_ERROR: string;
        static yDown: boolean;
        static debug: boolean;
        static debugDraw: boolean;
        static readonly armatures: Array<Armature>;
        static hasArmature(value: Armature): boolean;
        static addArmature(value: Armature): void;
        static removeArmature(value: Armature): void;
    }
}
declare namespace dragonBones {
    /**
     * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Armature extends BaseObject implements IAnimateble {
        /**
         * @private
         */
        static toString(): string;
        private static _onSortSlots(a, b);
        /**
         * 是否继承父骨架的动画状态。
         * @default true
         * @version DragonBones 4.5
         * @language zh_CN
         */
        inheritAnimation: boolean;
        /**
         * @private
         */
        debugDraw: boolean;
        /**
         * 获取骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         * @readonly
         * @language zh_CN
         */
        armatureData: ArmatureData;
        /**
         * 用于存储临时数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        userData: any;
        private _debugDraw;
        private _delayDispose;
        private _lockDispose;
        private _bonesDirty;
        private _slotsDirty;
        private _zOrderDirty;
        private _flipX;
        private _flipY;
        /**
         * @private
         */
        _cacheFrameIndex: number;
        private readonly _bones;
        private readonly _slots;
        private readonly _actions;
        private readonly _events;
        private _animation;
        private _proxy;
        private _display;
        private _eventManager;
        /**
         * @private
         */
        _parent: Slot | null;
        private _clock;
        /**
         * @private
         */
        _replaceTextureAtlasData: TextureAtlasData | null;
        private _replacedTexture;
        /**
         * @private
         */
        protected _onClear(): void;
        private _sortBones();
        private _sortSlots();
        /**
         * @internal
         * @private
         */
        _sortZOrder(slotIndices: Array<number> | Int16Array | null, offset: number): void;
        private _doAction(value);
        /**
         * @internal
         * @private
         */
        _addBoneToBoneList(value: Bone): void;
        /**
         * @internal
         * @private
         */
        _removeBoneFromBoneList(value: Bone): void;
        /**
         * @internal
         * @private
         */
        _addSlotToSlotList(value: Slot): void;
        /**
         * @internal
         * @private
         */
        _removeSlotFromSlotList(value: Slot): void;
        /**
         * @internal
         * @private
         */
        _bufferAction(value: ActionData): void;
        /**
         * @internal
         * @private
         */
        _bufferEvent(value: EventObject, type: string): void;
        /**
         * 释放骨架。 (回收到对象池)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        dispose(): void;
        /**
         * @private
         */
        init(armatureData: ArmatureData, proxy: IArmatureProxy, display: any, eventManager: IEventDispatcher): void;
        /**
         * 更新骨架和动画。
         * @param passedTime 两帧之间的时间间隔。 (以秒为单位)
         * @see dragonBones.IAnimateble
         * @see dragonBones.WorldClock
         * @version DragonBones 3.0
         * @language zh_CN
         */
        advanceTime(passedTime: number): void;
        /**
         * 更新骨骼和插槽。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
         * @param updateSlotDisplay 是否更新插槽的显示对象。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        invalidUpdate(boneName?: string | null, updateSlotDisplay?: boolean): void;
        /**
         * 判断点是否在所有插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @version DragonBones 5.0
         * @language zh_CN
         */
        containsPoint(x: number, y: number): Slot | null;
        /**
         * 判断线段是否与骨架的所有插槽的自定义包围盒相交。
         * @param xA 线段起点的水平坐标。（骨架内坐标系）
         * @param yA 线段起点的垂直坐标。（骨架内坐标系）
         * @param xB 线段终点的水平坐标。（骨架内坐标系）
         * @param yB 线段终点的垂直坐标。（骨架内坐标系）
         * @param intersectionPointA 线段从起点到终点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param intersectionPointB 线段从终点到起点与包围盒相交的第一个交点。（骨架内坐标系）
         * @param normalRadians 碰撞点处包围盒切线的法线弧度。 [x: 第一个碰撞点处切线的法线弧度, y: 第二个碰撞点处切线的法线弧度]
         * @returns 线段从起点到终点相交的第一个自定义包围盒的插槽。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        } | null, intersectionPointB?: {
            x: number;
            y: number;
        } | null, normalRadians?: {
            x: number;
            y: number;
        } | null): Slot | null;
        /**
         * 获取指定名称的骨骼。
         * @param name 骨骼的名称。
         * @returns 骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBone(name: string): Bone | null;
        /**
         * 通过显示对象获取骨骼。
         * @param display 显示对象。
         * @returns 包含这个显示对象的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBoneByDisplay(display: any): Bone | null;
        /**
         * 获取插槽。
         * @param name 插槽的名称。
         * @returns 插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlot(name: string): Slot | null;
        /**
         * 通过显示对象获取插槽。
         * @param display 显示对象。
         * @returns 包含这个显示对象的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlotByDisplay(display: any): Slot | null;
        /**
         * @deprecated
         */
        addBone(value: Bone, parentName?: string | null): void;
        /**
         * @deprecated
         */
        removeBone(value: Bone): void;
        /**
         * @deprecated
         */
        addSlot(value: Slot, parentName: string): void;
        /**
         * @deprecated
         */
        removeSlot(value: Slot): void;
        /**
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图类型。
         * @param texture 贴图。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        replaceTexture(texture: any): void;
        /**
         * 获取所有骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBones(): Array<Bone>;
        /**
         * 获取所有插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlots(): Array<Slot>;
        /**
         * 骨架名称。
         * @see dragonBones.ArmatureData#name
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly name: string;
        /**
         * 获得动画控制器。
         * @see dragonBones.Animation
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly animation: Animation;
        /**
         * 获取事件监听器。
         * @version DragonBones 5.0
         * @language zh_CN
         */
        readonly eventDispatcher: IEventDispatcher;
        /**
         * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        readonly display: any;
        /**
         * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly parent: Slot | null;
        flipX: boolean;
        flipY: boolean;
        /**
         * 动画缓存帧率，当设置的值大于 0 的时，将会开启动画缓存。
         * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
         * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
         * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
         * @see dragonBones.DragonBonesData#frameRate
         * @see dragonBones.ArmatureData#frameRate
         * @version DragonBones 4.5
         * @language zh_CN
         */
        cacheFrameRate: number;
        /**
         * @inheritDoc
         */
        clock: WorldClock | null;
        /**
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图数据。
         * @version DragonBones 4.5
         */
        replacedTexture: any;
        /**
         * @deprecated
         * @see dragonBones.Armature#eventDispatcher
         */
        hasEventListener(type: EventStringType): boolean;
        /**
         * @deprecated
         * @see dragonBones.Armature#eventDispatcher
         */
        addEventListener(type: EventStringType, listener: Function, target: any): void;
        /**
         * @deprecated
         * @see dragonBones.Armature#eventDispatcher
         */
        removeEventListener(type: EventStringType, listener: Function, target: any): void;
        /**
         * @deprecated
         * @see #cacheFrameRate
         */
        enableAnimationCache(frameRate: number): void;
        /**
         * @deprecated
         * @see #display
         */
        getDisplay(): any;
        /**
         * @deprecated
         * @see #cacheFrameRate
         */
        enableCache: boolean;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    type EventStringType = string | "start" | "loopComplete" | "complete" | "fadeIn" | "fadeInComplete" | "fadeOut" | "fadeOutComplete" | "frameEvent" | "soundEvent";
    /**
     * 事件接口。
     * @version DragonBones 4.5
     * @language zh_CN
     */
    interface IEventDispatcher {
        /**
         * @private
         */
        _dispatchEvent(type: EventStringType, eventObject: EventObject): void;
        /**
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        hasEvent(type: EventStringType): boolean;
        /**
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        addEvent(type: EventStringType, listener: Function, target: any): void;
        /**
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        removeEvent(type: EventStringType, listener: Function, target: any): void;
    }
}
declare namespace dragonBones {
    /**
     * Egret 工厂。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class EgretFactory extends BaseFactory {
        /**
         * 一个可以直接使用的全局 WorldClock 实例.
         * @version DragonBones 5.0
         * @language zh_CN
         */
        static readonly clock: WorldClock;
        /**
         * 一个可以直接使用的全局工厂实例。
         * @version DragonBones 4.7
         * @language zh_CN
         */
        static readonly factory: EgretFactory;
        /**
         * @private
         */
        static readonly eventManager: EgretArmatureDisplay;
        /**
         * @private
         */
        static _clockHandler(time: number): boolean;
        /**
         * @private
         */
        protected _isSupportMesh(): boolean;
        /**
         * @private
         */
        protected _buildTextureAtlasData(textureAtlasData: EgretTextureAtlasData | null, textureAtlas: egret.Texture): EgretTextureAtlasData;
        /**
         * @private
         */
        protected _buildArmature(dataPackage: BuildArmaturePackage): Armature;
        /**
         * @private
         */
        protected _buildSlot(dataPackage: BuildArmaturePackage, slotData: SlotData, displays: Array<DisplayData>, armature: Armature): Slot;
        /**
         * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
         * @param armatureName 骨架名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
         * @returns 骨架的显示容器。
         * @see dragonBones.EgretArmatureDisplay
         * @version DragonBones 4.5
         * @language zh_CN
         */
        buildArmatureDisplay(armatureName: string, dragonBonesName?: string | null, skinName?: string | null, textureAtlasName?: string | null): EgretArmatureDisplay | null;
        /**
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param textureAtlasName 指定的贴图集数据名称，如果未设置，将检索所有的贴图集数据。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getTextureDisplay(textureName: string, textureAtlasName?: string | null): egret.Bitmap | null;
        /**
         * 获取全局声音事件管理器。
         * @version DragonBones 4.5
         * @language zh_CN
         */
        readonly soundEventManager: EgretArmatureDisplay;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addDragonBonesData()
         */
        addSkeletonData(dragonBonesData: DragonBonesData, dragonBonesName?: string | null): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getDragonBonesData()
         */
        getSkeletonData(dragonBonesName: string): DragonBonesData | null;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeSkeletonData()
         */
        removeSkeletonData(dragonBonesName: string): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addTextureAtlasData()
         */
        addTextureAtlas(textureAtlasData: TextureAtlasData, dragonBonesName?: string | null): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getTextureAtlasData()
         */
        getTextureAtlas(dragonBonesName: string): TextureAtlasData[] | null;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        removeTextureAtlas(dragonBonesName: string): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#buildArmature()
         */
        buildFastArmature(armatureName: string, dragonBonesName?: string | null, skinName?: string | null): FastArmature | null;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#clear()
         */
        dispose(): void;
        /**
         * @deprecated
         * @see dragonBones.EgretFactory#soundEventManager()
         */
        readonly soundEventManater: EgretArmatureDisplay;
    }
}
declare namespace dragonBones {
    /**
     * Egret 插槽。
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class EgretSlot extends Slot {
        /**
         * @private
         */
        static toString(): string;
        /**
         * 是否更新显示对象的变换属性。
         * 为了更好的性能, 并不会更新 display 的变换属性 (x, y, rotation, scaleX, scaleX), 如果需要正确访问这些属性, 则需要设置为 true 。
         * @default false
         * @version DragonBones 3.0
         * @language zh_CN
         */
        transformUpdateEnabled: boolean;
        private _armatureDisplay;
        private _renderDisplay;
        private _colorFilter;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        protected _initDisplay(value: any): void;
        /**
         * @private
         */
        protected _disposeDisplay(value: any): void;
        /**
         * @private
         */
        protected _onUpdateDisplay(): void;
        /**
         * @private
         */
        protected _addDisplay(): void;
        /**
         * @private
         */
        protected _replaceDisplay(value: any): void;
        /**
         * @private
         */
        protected _removeDisplay(): void;
        /**
         * @private
         */
        protected _updateZOrder(): void;
        /**
         * @internal
         * @private
         */
        _updateVisible(): void;
        /**
         * @private
         */
        protected _updateBlendMode(): void;
        /**
         * @private
         */
        protected _updateColor(): void;
        /**
         * @private
         */
        protected _updateFrame(): void;
        /**
         * @private
         */
        protected _updateMesh(): void;
        /**
         * @private
         */
        protected _updateTransform(isSkinnedMesh: boolean): void;
    }
}
declare namespace dragonBones {
    /**
     * 骨骼，一个骨架中可以包含多个骨骼，骨骼以树状结构组成骨架。
     * 骨骼在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现。
     * @see dragonBones.BoneData
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     * @language zh_CN
     */
    class Bone extends TransformObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @readonly
         */
        offsetMode: OffsetMode;
        /**
         * @internal
         * @private
         */
        readonly animationPose: Transform;
        /**
         * @internal
         * @private
         */
        readonly constraints: Array<Constraint>;
        /**
         * @readonly
         */
        boneData: BoneData;
        /**
         * @internal
         * @private
         */
        _transformDirty: boolean;
        /**
         * @internal
         * @private
         */
        _childrenTransformDirty: boolean;
        /**
         * @internal
         * @private
         */
        _blendDirty: boolean;
        private _localDirty;
        private _visible;
        private _cacheState;
        private _cachedFrameIndex;
        /**
         * @internal
         * @private
         */
        _blendLayer: number;
        /**
         * @internal
         * @private
         */
        _blendLeftWeight: number;
        /**
         * @internal
         * @private
         */
        _blendLayerWeight: number;
        private readonly _bones;
        private readonly _slots;
        /**
         * @internal
         * @private
         */
        _cachedFrameIndices: Array<number> | null;
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        private _updateGlobalTransformMatrix(isCache);
        /**
         * @internal
         * @private
         */
        _setArmature(value: Armature | null): void;
        /**
         * @internal
         * @private
         */
        init(boneData: BoneData): void;
        /**
         * @internal
         * @private
         */
        addConstraint(constraint: Constraint): void;
        /**
         * @internal
         * @private
         */
        update(cacheFrameIndex: number): void;
        /**
         * @internal
         * @private
         */
        updateByConstraint(): void;
        /**
         * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @version DragonBones 3.0
         * @language zh_CN
         */
        invalidUpdate(): void;
        /**
         * 是否包含骨骼或插槽。
         * @returns
         * @see dragonBones.TransformObject
         * @version DragonBones 3.0
         * @language zh_CN
         */
        contains(child: TransformObject): boolean;
        /**
         * 所有的子骨骼。
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getBones(): Array<Bone>;
        /**
         * 所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        getSlots(): Array<Slot>;
        /**
         * 控制此骨骼所有插槽的可见。
         * @default true
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         * @language zh_CN
         */
        visible: boolean;
        /**
         * @deprecated
         * @see #boneData
         * @see #dragonBones.BoneData#length
         */
        readonly length: number;
        /**
         * @deprecated
         * @see dragonBones.Armature#getSlot()
         */
        readonly slot: Slot | null;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 是否包含指定名称的动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function hasMovieGroup(groupName: string): boolean;
    /**
     * @language zh_CN
     * 添加动画组。
     * @param groupData 动画二进制数据。
     * @param textureAtlas 贴图集或贴图集列表。
     * @param groupName 为动画组指定一个名称，如果未设置，则使用数据中的名称。
     * @version DragonBones 4.7
     */
    function addMovieGroup(groupData: ArrayBuffer, textureAtlas: egret.Texture | egret.Texture[], groupName?: string | null): void;
    /**
     * @language zh_CN
     * 移除动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function removeMovieGroup(groupName: string): void;
    /**
     * @language zh_CN
     * 移除所有的动画组。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function removeAllMovieGroup(): void;
    /**
     * @language zh_CN
     * 创建一个动画。
     * @param movieName 动画的名称。
     * @param groupName 动画组的名称，如果未设置，将检索所有的动画组，当多个动画组中包含同名的动画时，可能无法创建出准确的动画。
     * @version DragonBones 4.7
     */
    function buildMovie(movieName: string, groupName?: string | null): Movie | null;
    /**
     * @language zh_CN
     * 获取指定动画组内包含的所有动画名称。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function getMovieNames(groupName: string): string[] | null;
    /**
     * @language zh_CN
     * 动画事件。
     * @version DragonBones 4.7
     */
    class MovieEvent extends egret.Event {
        /**
         * @language zh_CN
         * 动画剪辑开始播放。
         * @version DragonBones 4.7
         */
        static START: string;
        /**
         * @language zh_CN
         * 动画剪辑循环播放一次完成。
         * @version DragonBones 4.7
         */
        static LOOP_COMPLETE: string;
        /**
         * @language zh_CN
         * 动画剪辑播放完成。
         * @version DragonBones 4.7
         */
        static COMPLETE: string;
        /**
         * @language zh_CN
         * 动画剪辑帧事件。
         * @version DragonBones 4.7
         */
        static FRAME_EVENT: string;
        /**
         * @language zh_CN
         * 动画剪辑声音事件。
         * @version DragonBones 4.7
         */
        static SOUND_EVENT: string;
        /**
         * @language zh_CN
         * 事件名称。 (帧标签的名称或声音的名称)
         * @version DragonBones 4.7
         */
        name: string;
        /**
         * @language zh_CN
         * 发出事件的插槽名称。
         * @version DragonBones 4.7
         */
        slotName: string;
        /**
         * @language zh_CN
         * 发出事件的动画剪辑名称。
         * @version DragonBones 4.7
         */
        clipName: string;
        /**
         * @language zh_CN
         * 发出事件的动画。
         * @version DragonBones 4.7
         */
        movie: Movie;
        /**
         * @private
         */
        constructor(type: string);
        /**
         * @private
         */
        readonly armature: any;
        /**
         * @private
         */
        readonly bone: any;
        /**
         * @private
         */
        readonly animationState: any;
        /**
         * @private
         */
        readonly frameLabel: any;
        /**
         * @private
         */
        readonly movementID: any;
    }
    /**
     * @language zh_CN
     * 通过读取缓存的二进制动画数据来更新动画，具有良好的运行性能，同时对内存的占用也非常低。
     * @see dragonBones.buildMovie
     * @version DragonBones 4.7
     */
    class Movie extends egret.DisplayObjectContainer implements IAnimateble {
        private static _cleanBeforeRender();
        /**
         * @language zh_CN
         * 动画的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 4.7
         */
        timeScale: number;
        /**
         * @language zh_CN
         * 动画剪辑的播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * （当再次播放其他动画剪辑时，此值将被重置为 1）
         * @default 1
         * @version DragonBones 4.7
         */
        clipTimeScale: number;
        private _batchEnabled;
        private _isLockDispose;
        private _isDelayDispose;
        private _isStarted;
        private _isPlaying;
        private _isReversing;
        private _isCompleted;
        private _playTimes;
        private _time;
        private _currentTime;
        private _currentPlayTimes;
        private _cacheFrameIndex;
        private _frameSize;
        private _cacheRectangle;
        private _clock;
        private _groupConfig;
        private _config;
        private _clipConfig;
        private _currentFrameConfig;
        private _clipArray;
        private _clipNames;
        private _slots;
        private _childMovies;
        /**
         * @internal
         * @private
         */
        constructor(createMovieHelper: any);
        private _configToEvent(config, event);
        private _onCrossFrame(frameConfig);
        private _updateSlotBlendMode(slot);
        private _updateSlotColor(slot, aM, rM, gM, bM, aO, rO, gO, bO);
        private _updateSlotDisplay(slot);
        private _getSlot(name);
        /**
         * @inheritDoc
         */
        $render(): void;
        /**
         * @inheritDoc
         */
        $measureContentBounds(bounds: egret.Rectangle): void;
        /**
         * @inheritDoc
         */
        $doAddChild(child: egret.DisplayObject, index: number, notifyListeners?: boolean): egret.DisplayObject;
        /**
         * @inheritDoc
         */
        $doRemoveChild(index: number, notifyListeners?: boolean): egret.DisplayObject;
        /**
         * @language zh_CN
         * 释放动画。
         * @version DragonBones 3.0
         */
        dispose(): void;
        /**
         * @inheritDoc
         */
        advanceTime(passedTime: number): void;
        /**
         * @language zh_CN
         * 播放动画剪辑。
         * @param clipName 动画剪辑的名称，如果未设置，则播放默认动画剪辑，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画剪辑。
         * @param playTimes 动画剪辑需要播放的次数。 [-1: 使用动画剪辑默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 4.7
         */
        play(clipName?: string | null, playTimes?: number): void;
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @version DragonBones 4.7
         */
        stop(): void;
        /**
         * @language zh_CN
         * 从指定时间播放动画。
         * @param clipName 动画剪辑的名称。
         * @param time 指定时间。（以秒为单位）
         * @param playTimes 动画剪辑需要播放的次数。 [-1: 使用动画剪辑默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 5.0
         */
        gotoAndPlay(clipName: string | null, time: number, playTimes?: number): void;
        /**
         * @language zh_CN
         * 将动画停止到指定时间。
         * @param clipName 动画剪辑的名称。
         * @param time 指定时间。（以秒为单位）
         * @version DragonBones 5.0
         */
        gotoAndStop(clipName: string | null, time: number): void;
        /**
         * @language zh_CN
         * 是否包含指定动画剪辑。
         * @param clipName 动画剪辑的名称。
         * @version DragonBones 4.7
         */
        hasClip(clipName: string): boolean;
        /**
         * @language zh_CN
         * 动画剪辑是否处正在播放。
         * @version DragonBones 4.7
         */
        readonly isPlaying: boolean;
        /**
         * @language zh_CN
         * 动画剪辑是否均播放完毕。
         * @version DragonBones 4.7
         */
        readonly isComplete: boolean;
        /**
         * @language zh_CN
         * 当前动画剪辑的播放时间。 (以秒为单位)
         * @version DragonBones 4.7
         */
        readonly currentTime: number;
        /**
         * @language zh_CN
         * 当前动画剪辑的总时间。 (以秒为单位)
         * @version DragonBones 4.7
         */
        readonly totalTime: number;
        /**
         * @language zh_CN
         * 当前动画剪辑的播放次数。
         * @version DragonBones 4.7
         */
        readonly currentPlayTimes: number;
        /**
         * @language zh_CN
         * 当前动画剪辑需要播放的次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 4.7
         */
        readonly playTimes: number;
        readonly groupName: string;
        /**
         * @language zh_CN
         * 正在播放的动画剪辑名称。
         * @version DragonBones 4.7
         */
        readonly clipName: string;
        /**
         * @language zh_CN
         * 所有动画剪辑的名称。
         * @version DragonBones 4.7
         */
        readonly clipNames: string[];
        /**
         * @inheritDoc
         */
        clock: WorldClock | null;
        /**
         * @deprecated
         * @see dragonBones.Movie#clock
         * @see dragonBones.EgretFactory#clock
         * @see dragonBones.Movie#timescale
         * @see dragonBones.Movie#stop()
         */
        advanceTimeBySelf(on: boolean): void;
        /**
         * @private
         */
        readonly display: any;
        /**
         * @private
         */
        readonly animation: any;
        /**
         * @private
         */
        readonly armature: any;
        /**
         * @private
         */
        getAnimation(): any;
        /**
         * @private
         */
        getArmature(): any;
        /**
         * @private
         */
        getDisplay(): any;
        /**
         * @private
         */
        hasAnimation(name: string): boolean;
        /**
         * @private
         */
        invalidUpdate(...args: any[]): void;
        /**
         * @private
         */
        readonly lastAnimationName: string;
        /**
         * @private
         */
        readonly animationNames: string[];
        /**
         * @private
         */
        readonly animationList: string[];
    }
}
