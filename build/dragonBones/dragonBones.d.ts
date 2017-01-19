declare namespace dragonBones {
    /**
     * @private
     */
    const enum ArmatureType {
        None = -1,
        Armature = 0,
        MovieClip = 1,
        Stage = 2,
    }
    /**
     * @private
     */
    const enum DisplayType {
        None = -1,
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
        None = -1,
        Rectangle = 0,
        Ellipse = 1,
        Polygon = 2,
    }
    /**
     * @private
     */
    const enum EventType {
        None = -1,
        Frame = 10,
        Sound = 11,
    }
    /**
     * @private
     */
    const enum ActionType {
        None = -1,
        Play = 0,
        Fade = 4,
    }
    /**
     * @private
     */
    const enum BlendMode {
        None = -1,
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
     * @language zh_CN
     * 动画混合的淡出方式。
     * @version DragonBones 4.5
     */
    const enum AnimationFadeOutMode {
        /**
         * @language zh_CN
         * 不淡出动画。
         * @version DragonBones 4.5
         */
        None = 0,
        /**
        * @language zh_CN
         * 淡出同层的动画。
         * @version DragonBones 4.5
         */
        SameLayer = 1,
        /**
         * @language zh_CN
         * 淡出同组的动画。
         * @version DragonBones 4.5
         */
        SameGroup = 2,
        /**
         * @language zh_CN
         * 淡出同层并且同组的动画。
         * @version DragonBones 4.5
         */
        SameLayerAndGroup = 3,
        /**
         * @language zh_CN
         * 淡出所有动画。
         * @version DragonBones 4.5
         */
        All = 4,
    }
    /**
     * @private
     */
    interface Map<T> {
        [key: string]: T;
    }
    /**
     * DragonBones
     */
    class DragonBones {
        /**
         * @private
         */
        static PI_D: number;
        /**
         * @private
         */
        static PI_H: number;
        /**
         * @private
         */
        static PI_Q: number;
        /**
         * @private
         */
        static ANGLE_TO_RADIAN: number;
        /**
         * @private
         */
        static RADIAN_TO_ANGLE: number;
        /**
         * @private
         */
        static SECOND_TO_MILLISECOND: number;
        /**
         * @internal
         * @private
         */
        static NO_TWEEN: number;
        static VERSION: string;
        /**
         * @internal
         * @private
         */
        static ARGUMENT_ERROR: string;
        /**
         * @private
         */
        static debug: boolean;
        /**
         * @private
         */
        static debugDraw: boolean;
        /**
         * @internal
         * @private
         */
        static _armatures: Array<Armature>;
        /**
         * @internal
         * @private
         */
        static hasArmature(value: Armature): boolean;
        /**
         * @internal
         * @private
         */
        static addArmature(value: Armature): void;
        /**
         * @internal
         * @private
         */
        static removeArmature(value: Armature): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 基础对象。
     * @version DragonBones 4.5
     */
    abstract class BaseObject {
        private static _hashCode;
        private static _defaultMaxCount;
        private static _maxCountMap;
        private static _poolsMap;
        private static _returnObject(object);
        /**
         * @language zh_CN
         * 设置每种对象池的最大缓存数量。
         * @param objectConstructor 对象类。
         * @param maxCount 最大缓存数量。 (设置为 0 则不缓存)
         * @version DragonBones 4.5
         */
        static setMaxCount(objectConstructor: typeof BaseObject, maxCount: number): void;
        /**
         * @language zh_CN
         * 清除对象池缓存的对象。
         * @param objectConstructor 对象类。 (不设置则清除所有缓存)
         * @version DragonBones 4.5
         */
        static clearPool(objectConstructor?: typeof BaseObject): void;
        /**
         * @language zh_CN
         * 从对象池中创建指定对象。
         * @param objectConstructor 对象类。
         * @version DragonBones 4.5
         */
        static borrowObject<T extends BaseObject>(objectConstructor: {
            new (): T;
        }): T;
        /**
         * @language zh_CN
         * 对象的唯一标识。
         * @version DragonBones 4.5
         */
        hashCode: number;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected abstract _onClear(): void;
        /**
         * @language zh_CN
         * 清除数据并返还对象池。
         * @version DragonBones 4.5
         */
        returnToPool(): void;
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
    class Rectangle {
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        copyFrom(value: Rectangle): void;
        clear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 2D 变换。
     * @version DragonBones 3.0
     */
    class Transform {
        /**
         * @language zh_CN
         * 水平位移。
         * @version DragonBones 3.0
         */
        x: number;
        /**
         * @language zh_CN
         * 垂直位移。
         * @version DragonBones 3.0
         */
        y: number;
        /**
         * @language zh_CN
         * 水平倾斜。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        skewX: number;
        /**
         * @language zh_CN
         * 垂直倾斜。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        skewY: number;
        /**
         * @language zh_CN
         * 水平缩放。
         * @version DragonBones 3.0
         */
        scaleX: number;
        /**
         * @language zh_CN
         * 垂直缩放。
         * @version DragonBones 3.0
         */
        scaleY: number;
        /**
         * @private
         */
        static normalizeRadian(value: number): number;
        constructor(
            /**
             * @language zh_CN
             * 水平位移。
             * @version DragonBones 3.0
             */
            x?: number, 
            /**
             * @language zh_CN
             * 垂直位移。
             * @version DragonBones 3.0
             */
            y?: number, 
            /**
             * @language zh_CN
             * 水平倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewX?: number, 
            /**
             * @language zh_CN
             * 垂直倾斜。 (以弧度为单位)
             * @version DragonBones 3.0
             */
            skewY?: number, 
            /**
             * @language zh_CN
             * 水平缩放。
             * @version DragonBones 3.0
             */
            scaleX?: number, 
            /**
             * @language zh_CN
             * 垂直缩放。
             * @version DragonBones 3.0
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
         * @language zh_CN
         * 矩阵转换为变换。
         * @param 矩阵。
         * @version DragonBones 3.0
         */
        fromMatrix(matrix: Matrix): Transform;
        /**
         * @language zh_CN
         * 转换为矩阵。
         * @param 矩阵。
         * @version DragonBones 3.0
         */
        toMatrix(matrix: Matrix): Transform;
        /**
         * @language zh_CN
         * 旋转。 (以弧度为单位)
         * @version DragonBones 3.0
         */
        rotation: number;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 2D 矩阵。
     * @version DragonBones 3.0
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
         * @language zh_CN
         * 复制矩阵。
         * @param value 需要复制的矩阵。
         * @version DragonBones 3.0
         */
        copyFrom(value: Matrix): Matrix;
        /**
         * @private
         */
        copyFromArray(value: Array<number>, offset?: number): Matrix;
        /**
         * @language zh_CN
         * 转换为恒等矩阵。
         * @version DragonBones 3.0
         */
        identity(): Matrix;
        /**
         * @language zh_CN
         * 将当前矩阵与另一个矩阵相乘。
         * @param value 需要相乘的矩阵。
         * @version DragonBones 3.0
         */
        concat(value: Matrix): Matrix;
        /**
         * @language zh_CN
         * 转换为逆矩阵。
         * @version DragonBones 3.0
         */
        invert(): Matrix;
        /**
         * @language zh_CN
         * 将矩阵转换应用于指定点。
         * @param x 横坐标。
         * @param y 纵坐标。
         * @param result 应用转换之后的坐标。
         * @params delta 是否忽略 tx，ty 对坐标的转换。
         * @version DragonBones 3.0
         */
        transformPoint(x: number, y: number, result: {
            x: number;
            y: number;
        }, delta?: boolean): void;
    }
}
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
        identity(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * @beta
     * 动画配置，描述播放一个动画所需要的全部信息。
     * @see dragonBones.AnimationState
     * @version DragonBones 5.0
     */
    class AnimationConfig extends BaseObject {
        static toString(): string;
        /**
         * @language zh_CN
         * 是否暂停淡出的动画。
         * @default true
         * @version DragonBones 5.0
         */
        pauseFadeOut: boolean;
        /**
         * @language zh_CN
         * 淡出模式。
         * @default dragonBones.AnimationFadeOutMode.All
         * @see dragonBones.AnimationFadeOutMode
         * @version DragonBones 5.0
         */
        fadeOutMode: AnimationFadeOutMode;
        /**
         * @language zh_CN
         * 淡出时间。 [-1: 与淡入时间同步, [0~N]: 淡出时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         */
        fadeOutTime: number;
        /**
         * @language zh_CN
         * 淡出缓动方式。
         * @default 0
         * @version DragonBones 5.0
         */
        fadeOutEasing: number;
        /**
         * @language zh_CN
         * 是否以增加的方式混合。
         * @default false
         * @version DragonBones 5.0
         */
        additiveBlending: boolean;
        /**
         * @language zh_CN
         * 是否对插槽的显示对象有控制权。
         * @default true
         * @version DragonBones 5.0
         */
        displayControl: boolean;
        /**
         * @language zh_CN
         * 是否暂停淡入的动画，直到淡入过程结束。
         * @default true
         * @version DragonBones 5.0
         */
        pauseFadeIn: boolean;
        /**
         * @language zh_CN
         * 否能触发行为。
         * @default true
         * @version DragonBones 5.0
         */
        actionEnabled: boolean;
        /**
         * @language zh_CN
         * 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @default -1
         * @version DragonBones 5.0
         */
        playTimes: number;
        /**
         * @language zh_CN
         * 混合图层，图层高会优先获取混合权重。
         * @default 0
         * @version DragonBones 5.0
         */
        layer: number;
        /**
         * @language zh_CN
         * 开始时间。 (以秒为单位)
         * @default 0
         * @version DragonBones 5.0
         */
        position: number;
        /**
         * @language zh_CN
         * 持续时间。 [-1: 使用动画数据默认值, 0: 动画停止, (0~N]: 持续时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         */
        duration: number;
        /**
         * @language zh_CN
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        timeScale: number;
        /**
         * @language zh_CN
         * 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         */
        fadeInTime: number;
        /**
         * @language zh_CN
         * 自动淡出时间。 [-1: 不自动淡出, [0~N]: 淡出时间] (以秒为单位)
         * @default -1
         * @version DragonBones 5.0
         */
        autoFadeOutTime: number;
        /**
         * @language zh_CN
         * 淡入缓动方式。
         * @default 0
         * @version DragonBones 5.0
         */
        fadeInEasing: number;
        /**
         * @language zh_CN
         * 权重。
         * @default 1
         * @version DragonBones 5.0
         */
        weight: number;
        /**
         * @language zh_CN
         * 动画状态名。
         * @version DragonBones 5.0
         */
        name: string;
        /**
         * @language zh_CN
         * 动画数据名。
         * @version DragonBones 5.0
         */
        animationName: string;
        /**
         * @language zh_CN
         * 混合组，用于动画状态编组，方便控制淡出。
         * @version DragonBones 5.0
         */
        group: string;
        /**
         * @language zh_CN
         * 骨骼遮罩。
         * @version DragonBones 5.0
         */
        boneMask: Array<string>;
        /**
         * @language zh_CN
         * @version DragonBones 5.0
         */
        animationNames: Array<string>;
        /**
         * @internal
         * @private
         */
        constructor();
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
     * @private
     */
    abstract class FrameData<T> extends BaseObject {
        position: number;
        duration: number;
        prev: T;
        next: T;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    abstract class TweenFrameData<T> extends FrameData<T> {
        private static _getCurvePoint(x1, y1, x2, y2, x3, y3, x4, y4, t, result);
        static samplingEasingCurve(curve: Array<number>, samples: Array<number>): void;
        tweenEasing: number;
        curve: Array<number>;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class AnimationFrameData extends FrameData<AnimationFrameData> {
        static toString(): string;
        actions: Array<ActionData>;
        events: Array<EventData>;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class ZOrderFrameData extends FrameData<ZOrderFrameData> {
        zOrder: Array<number>;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class BoneFrameData extends TweenFrameData<BoneFrameData> {
        static toString(): string;
        tweenScale: boolean;
        tweenRotate: number;
        transform: Transform;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class SlotFrameData extends TweenFrameData<SlotFrameData> {
        static DEFAULT_COLOR: ColorTransform;
        static generateColor(): ColorTransform;
        static toString(): string;
        displayIndex: number;
        color: ColorTransform;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class ExtensionFrameData extends TweenFrameData<ExtensionFrameData> {
        static toString(): string;
        tweens: Array<number>;
        constructor();
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    abstract class TimelineData<T extends FrameData<T>> extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        scale: number;
        /**
         * @private
         */
        offset: number;
        /**
         * @private
         */
        frames: Array<T>;
        /**
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class ZOrderTimelineData extends TimelineData<ZOrderFrameData> {
        static toString(): string;
    }
    /**
     * @private
     */
    class BoneTimelineData extends TimelineData<BoneFrameData> {
        static toString(): string;
        originalTransform: Transform;
        bone: BoneData;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class SlotTimelineData extends TimelineData<SlotFrameData> {
        static toString(): string;
        slot: SlotData;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class FFDTimelineData extends TimelineData<ExtensionFrameData> {
        static toString(): string;
        skin: SkinData;
        slot: SkinSlotData;
        display: DisplayData;
        constructor();
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 动画数据。
     * @version DragonBones 3.0
     */
    class AnimationData extends TimelineData<AnimationFrameData> {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 持续的帧数。
         * @version DragonBones 3.0
         */
        frameCount: number;
        /**
         * @language zh_CN
         * 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         */
        playTimes: number;
        /**
         * @language zh_CN
         * 持续时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        duration: number;
        /**
         * @language zh_CN
         * 淡入时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        fadeInTime: number;
        /**
         * @private
         */
        cacheFrameRate: number;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @private
         */
        zOrderTimeline: TimelineData<ZOrderFrameData>;
        /**
         * @private
         */
        boneTimelines: Map<BoneTimelineData>;
        /**
         * @private
         */
        slotTimelines: Map<SlotTimelineData>;
        /**
         * @private
         */
        ffdTimelines: Map<Map<Map<FFDTimelineData>>>;
        /**
         * @private
         */
        cachedFrames: Array<boolean>;
        /**
         * @private
         */
        boneCachedFrameIndices: Map<Array<number>>;
        /**
         * @private
         */
        slotCachedFrameIndices: Map<Array<number>>;
        /**
         * @internal
         * @private
         */
        constructor();
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
        addBoneTimeline(value: BoneTimelineData): void;
        /**
         * @private
         */
        addSlotTimeline(value: SlotTimelineData): void;
        /**
         * @private
         */
        addFFDTimeline(value: FFDTimelineData): void;
        /**
         * @private
         */
        getBoneTimeline(name: string): BoneTimelineData;
        /**
         * @private
         */
        getSlotTimeline(name: string): SlotTimelineData;
        /**
         * @private
         */
        getFFDTimeline(skinName: string, slotName: string): Map<FFDTimelineData>;
        /**
         * @private
         */
        getBoneCachedFrameIndices(name: string): Array<number>;
        /**
         * @private
         */
        getSlotCachedFrameIndices(name: string): Array<number>;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架数据。
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    class ArmatureData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        private static _onSortSlots(a, b);
        /**
         * @language zh_CN
         * 动画帧率。
         * @version DragonBones 3.0
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
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @private
         */
        aabb: Rectangle;
        /**
         * @language zh_CN
         * 所有骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        bones: Map<BoneData>;
        /**
         * @language zh_CN
         * 所有插槽数据。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        slots: Map<SlotData>;
        /**
         * @private
         */
        skins: Map<SkinData>;
        /**
         * @language zh_CN
         * 所有动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        animations: Map<AnimationData>;
        /**
         * @private
         */
        actions: Array<ActionData>;
        /**
         * @language zh_CN
         * 所属的龙骨数据。
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         */
        parent: DragonBonesData;
        /**
         * @private
         */
        userData: CustomData;
        private _boneDirty;
        private _slotDirty;
        private _animationNames;
        private _sortedBones;
        private _sortedSlots;
        private _bonesChildren;
        private _defaultSkin;
        private _defaultAnimation;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        private _sortBones();
        private _sortSlots();
        /**
         * @private
         */
        cacheFrames(frameRate: number): void;
        /**
         * @private
         */
        setCacheFrame(globalTransformMatrix: Matrix, transform: Transform): number;
        /**
         * @private
         */
        getCacheFrame(globalTransformMatrix: Matrix, transform: Transform, arrayOffset: number): void;
        /**
         * @private
         */
        addBone(value: BoneData, parentName: string): void;
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
         * @language zh_CN
         * 获取骨骼数据。
         * @param name 骨骼数据名称。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        getBone(name: string): BoneData;
        /**
         * @language zh_CN
         * 获取插槽数据。
         * @param name 插槽数据名称。
         * @see dragonBones.SlotData
         * @version DragonBones 3.0
         */
        getSlot(name: string): SlotData;
        /**
         * @private
         */
        getSkin(name: string): SkinData;
        /**
         * @language zh_CN
         * 获取动画数据。
         * @param name 动画数据名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        getAnimation(name: string): AnimationData;
        /**
         * @language zh_CN
         * 所有动画数据名称。
         * @see #armatures
         * @version DragonBones 3.0
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
        readonly defaultSkin: SkinData;
        /**
         * @language zh_CN
         * 获取默认动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
         */
        readonly defaultAnimation: AnimationData;
    }
    /**
     * @language zh_CN
     * 骨骼数据。
     * @see dragonBones.Bone
     * @version DragonBones 3.0
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
        bendPositive: boolean;
        /**
         * @private
         */
        chain: number;
        /**
         * @private
         */
        chainIndex: number;
        /**
         * @private
         */
        weight: number;
        /**
         * @private
         */
        length: number;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @private
         */
        transform: Transform;
        /**
         * @language zh_CN
         * 所属的父骨骼数据。
         * @version DragonBones 3.0
         */
        parent: BoneData;
        /**
         * @private
         */
        ik: BoneData;
        /**
         * @private
         */
        userData: CustomData;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
    }
    /**
     * @language zh_CN
     * 插槽数据。
     * @see dragonBones.Slot
     * @version DragonBones 3.0
     */
    class SlotData extends BaseObject {
        /**
         * @private
         */
        static DEFAULT_COLOR: ColorTransform;
        /**
         * @private
         */
        static generateColor(): ColorTransform;
        /**
         * @private
         */
        static toString(): string;
        /**
         * @private
         */
        displayIndex: number;
        /**
         * @private
         */
        zOrder: number;
        /**
         * @private
         */
        blendMode: BlendMode;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @private
         */
        actions: Array<ActionData>;
        /**
         * @language zh_CN
         * 所属的父骨骼数据。
         * @see dragonBones.BoneData
         * @version DragonBones 3.0
         */
        parent: BoneData;
        /**
         * @private
         */
        color: ColorTransform;
        /**
         * @private
         */
        userData: CustomData;
        /**
         * @internal
         * @private
         */
        constructor();
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
        slots: Map<SkinSlotData>;
        constructor();
        protected _onClear(): void;
        addSlot(value: SkinSlotData): void;
        getSlot(name: string): SkinSlotData;
    }
    /**
     * @private
     */
    class SkinSlotData extends BaseObject {
        static toString(): string;
        displays: Array<DisplayData>;
        meshs: Map<MeshData>;
        slot: SlotData;
        constructor();
        protected _onClear(): void;
        getDisplay(name: string): DisplayData;
        addMesh(value: MeshData): void;
        getMesh(name: string): MeshData;
    }
    /**
     * @private
     */
    class DisplayData extends BaseObject {
        static toString(): string;
        isRelativePivot: boolean;
        type: DisplayType;
        inheritAnimation: boolean;
        name: string;
        path: string;
        share: string;
        pivot: Point;
        transform: Transform;
        texture: TextureData;
        armature: ArmatureData;
        mesh: MeshData;
        boundingBox: BoundingBoxData;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class MeshData extends BaseObject {
        static toString(): string;
        skinned: boolean;
        name: string;
        slotPose: Matrix;
        uvs: Array<number>;
        vertices: Array<number>;
        vertexIndices: Array<number>;
        boneIndices: Array<Array<number>>;
        weights: Array<Array<number>>;
        boneVertices: Array<Array<number>>;
        bones: Array<BoneData>;
        inverseBindPose: Array<Matrix>;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @language zh_CN
     * 自定义包围盒数据。
     * @version DragonBones 5.0
     */
    class BoundingBoxData extends BaseObject {
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
        static segmentIntersectsRectangle(xA: number, yA: number, xB: number, yB: number, xMin: number, yMin: number, xMax: number, yMax: number, intersectionPointA?: {
            x: number;
            y: number;
        }, intersectionPointB?: {
            x: number;
            y: number;
        }, normalRadians?: {
            x: number;
            y: number;
        }): number;
        /**
         * @private
         */
        static segmentIntersectsEllipse(xA: number, yA: number, xB: number, yB: number, xC: number, yC: number, widthH: number, heightH: number, intersectionPointA?: {
            x: number;
            y: number;
        }, intersectionPointB?: {
            x: number;
            y: number;
        }, normalRadians?: {
            x: number;
            y: number;
        }): number;
        /**
         * @private
         */
        static segmentIntersectsPolygon(xA: number, yA: number, xB: number, yB: number, vertices: Array<number>, intersectionPointA?: {
            x: number;
            y: number;
        }, intersectionPointB?: {
            x: number;
            y: number;
        }, normalRadians?: {
            x: number;
            y: number;
        }): number;
        /**
         * @language zh_CN
         * 包围盒类型。
         * @see dragonBones.BoundingBoxType
         * @version DragonBones 5.0
         */
        type: BoundingBoxType;
        /**
         * @language zh_CN
         * 包围盒颜色。
         * @version DragonBones 5.0
         */
        color: number;
        x: number;
        y: number;
        width: number;
        height: number;
        /**
         * @language zh_CN
         * 自定义多边形顶点。
         * @version DragonBones 5.0
         */
        vertices: Array<number>;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @language zh_CN
         * 是否包含点。
         * @version DragonBones 5.0
         */
        containsPoint(pX: number, pY: number): boolean;
        /**
         * @language zh_CN
         * 是否与线段相交。
         * @version DragonBones 5.0
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        }, intersectionPointB?: {
            x: number;
            y: number;
        }, normalRadians?: {
            x: number;
            y: number;
        }): number;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 自定义数据。
     * @version DragonBones 5.0
     */
    class CustomData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 自定义整数。
         * @version DragonBones 5.0
         */
        ints: Array<number>;
        /**
         * @language zh_CN
         * 自定义浮点数。
         * @version DragonBones 5.0
         */
        floats: Array<number>;
        /**
         * @language zh_CN
         * 自定义字符串。
         * @version DragonBones 5.0
         */
        strings: Array<string>;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @language zh_CN
         * 获取自定义整数。
         * @version DragonBones 5.0
         */
        getInt(index?: number): number;
        /**
         * @language zh_CN
         * 获取自定义浮点数。
         * @version DragonBones 5.0
         */
        getFloat(index?: number): number;
        /**
         * @language zh_CN
         * 获取自定义字符串。
         * @version DragonBones 5.0
         */
        getString(index?: number): string;
    }
    /**
     * @private
     */
    class EventData extends BaseObject {
        static toString(): string;
        type: EventType;
        name: string;
        bone: BoneData;
        slot: SlotData;
        data: CustomData;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @private
     */
    class ActionData extends BaseObject {
        static toString(): string;
        type: ActionType;
        bone: BoneData;
        slot: SlotData;
        animationConfig: AnimationConfig;
        constructor();
        protected _onClear(): void;
    }
    /**
     * @language zh_CN
     * 龙骨数据。
     * 一个龙骨数据包含多个骨架数据。
     * @see dragonBones.ArmatureData
     * @version DragonBones 3.0
     */
    class DragonBonesData extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 是否开启共享搜索。
         * @default false
         * @version DragonBones 4.5
         */
        autoSearch: boolean;
        /**
         * @language zh_CN
         * 动画帧频。
         * @version DragonBones 3.0
         */
        frameRate: number;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @language zh_CN
         * 所有骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        armatures: Map<ArmatureData>;
        /**
         * @private
         */
        cachedFrames: Array<number>;
        /**
         * @private
         */
        userData: CustomData;
        private _armatureNames;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        addArmature(value: ArmatureData): void;
        /**
         * @language zh_CN
         * 获取骨架。
         * @param name 骨架数据名称。
         * @see dragonBones.ArmatureData
         * @version DragonBones 3.0
         */
        getArmature(name: string): ArmatureData;
        /**
         * @language zh_CN
         * 所有骨架数据名称。
         * @see #armatures
         * @version DragonBones 3.0
         */
        readonly armatureNames: Array<string>;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeDragonBonesData()
         */
        dispose(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 贴图集数据。
     * @version DragonBones 3.0
     */
    abstract class TextureAtlasData extends BaseObject {
        /**
         * @language zh_CN
         * 是否开启共享搜索。
         * @default false
         * @version DragonBones 4.5
         */
        autoSearch: boolean;
        /**
         * @language zh_CN
         * 贴图集缩放系数。
         * @version DragonBones 3.0
         */
        scale: number;
        /**
         * @private
         */
        width: number;
        /**
         * @private
         */
        height: number;
        /**
         * @language zh_CN
         * 贴图集名称。
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @language zh_CN
         * 贴图集图片路径。
         * @version DragonBones 3.0
         */
        imagePath: string;
        /**
         * @private
         */
        textures: Map<TextureData>;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        abstract generateTexture(): TextureData;
        /**
         * @private
         */
        addTexture(value: TextureData): void;
        /**
         * @private
         */
        getTexture(name: string): TextureData;
        /**
         * @private
         */
        copyFrom(value: TextureAtlasData): void;
    }
    /**
     * @private
     */
    abstract class TextureData extends BaseObject {
        static generateRectangle(): Rectangle;
        rotated: boolean;
        name: string;
        region: Rectangle;
        frame: Rectangle;
        parent: TextureAtlasData;
        constructor();
        protected _onClear(): void;
        copyFrom(value: TextureData): void;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    abstract class DataParser {
        protected static DATA_VERSION_2_3: string;
        protected static DATA_VERSION_3_0: string;
        protected static DATA_VERSION_4_0: string;
        protected static DATA_VERSION_4_5: string;
        protected static DATA_VERSION_5_0: string;
        protected static DATA_VERSION: string;
        protected static DATA_VERSIONS: Array<string>;
        protected static TEXTURE_ATLAS: string;
        protected static SUB_TEXTURE: string;
        protected static FORMAT: string;
        protected static IMAGE_PATH: string;
        protected static WIDTH: string;
        protected static HEIGHT: string;
        protected static ROTATED: string;
        protected static FRAME_X: string;
        protected static FRAME_Y: string;
        protected static FRAME_WIDTH: string;
        protected static FRAME_HEIGHT: string;
        protected static DRADON_BONES: string;
        protected static ARMATURE: string;
        protected static BONE: string;
        protected static IK: string;
        protected static SLOT: string;
        protected static SKIN: string;
        protected static DISPLAY: string;
        protected static ANIMATION: string;
        protected static Z_ORDER: string;
        protected static FFD: string;
        protected static FRAME: string;
        protected static ACTIONS: string;
        protected static EVENTS: string;
        protected static INTS: string;
        protected static FLOATS: string;
        protected static STRINGS: string;
        protected static PIVOT: string;
        protected static TRANSFORM: string;
        protected static AABB: string;
        protected static COLOR: string;
        protected static VERSION: string;
        protected static COMPATIBLE_VERSION: string;
        protected static FRAME_RATE: string;
        protected static TYPE: string;
        protected static SUB_TYPE: string;
        protected static NAME: string;
        protected static PARENT: string;
        protected static TARGET: string;
        protected static SHARE: string;
        protected static PATH: string;
        protected static LENGTH: string;
        protected static DISPLAY_INDEX: string;
        protected static BLEND_MODE: string;
        protected static INHERIT_TRANSLATION: string;
        protected static INHERIT_ROTATION: string;
        protected static INHERIT_SCALE: string;
        protected static INHERIT_ANIMATION: string;
        protected static INHERIT_FFD: string;
        protected static BEND_POSITIVE: string;
        protected static CHAIN: string;
        protected static WEIGHT: string;
        protected static FADE_IN_TIME: string;
        protected static PLAY_TIMES: string;
        protected static SCALE: string;
        protected static OFFSET: string;
        protected static POSITION: string;
        protected static DURATION: string;
        protected static TWEEN_TYPE: string;
        protected static TWEEN_EASING: string;
        protected static TWEEN_ROTATE: string;
        protected static TWEEN_SCALE: string;
        protected static CURVE: string;
        protected static EVENT: string;
        protected static SOUND: string;
        protected static ACTION: string;
        protected static DEFAULT_ACTIONS: string;
        protected static X: string;
        protected static Y: string;
        protected static SKEW_X: string;
        protected static SKEW_Y: string;
        protected static SCALE_X: string;
        protected static SCALE_Y: string;
        protected static ALPHA_OFFSET: string;
        protected static RED_OFFSET: string;
        protected static GREEN_OFFSET: string;
        protected static BLUE_OFFSET: string;
        protected static ALPHA_MULTIPLIER: string;
        protected static RED_MULTIPLIER: string;
        protected static GREEN_MULTIPLIER: string;
        protected static BLUE_MULTIPLIER: string;
        protected static UVS: string;
        protected static VERTICES: string;
        protected static TRIANGLES: string;
        protected static WEIGHTS: string;
        protected static SLOT_POSE: string;
        protected static BONE_POSE: string;
        protected static COLOR_TRANSFORM: string;
        protected static TIMELINE: string;
        protected static IS_GLOBAL: string;
        protected static PIVOT_X: string;
        protected static PIVOT_Y: string;
        protected static Z: string;
        protected static LOOP: string;
        protected static AUTO_TWEEN: string;
        protected static HIDE: string;
        protected static DEFAULT_NAME: string;
        protected static _getArmatureType(value: string): ArmatureType;
        protected static _getDisplayType(value: string): DisplayType;
        protected static _getBoundingBoxType(value: string): BoundingBoxType;
        protected static _getBlendMode(value: string): BlendMode;
        protected static _getActionType(value: string): ActionType;
        protected _isOldData: boolean;
        protected _isGlobalTransform: boolean;
        protected _isAutoTween: boolean;
        protected _animationTweenEasing: number;
        protected _timelinePivot: Point;
        protected _helpPoint: Point;
        protected _helpTransformA: Transform;
        protected _helpTransformB: Transform;
        protected _helpMatrix: Matrix;
        protected _rawBones: Array<BoneData>;
        protected _data: DragonBonesData;
        protected _armature: ArmatureData;
        protected _skin: SkinData;
        protected _skinSlotData: SkinSlotData;
        protected _animation: AnimationData;
        protected _timeline: any;
        constructor();
        /**
         * @private
         */
        abstract parseDragonBonesData(rawData: any, scale: number): DragonBonesData;
        /**
         * @private
         */
        abstract parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number): void;
        private _getTimelineFrameMatrix(animation, timeline, position, transform);
        protected _globalToLocal(armature: ArmatureData): void;
        protected _mergeFrameToAnimationTimeline(framePostion: number, actions: Array<ActionData>, events: Array<EventData>): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parseDragonBonesData()
         */
        static parseDragonBonesData(rawData: any): DragonBonesData;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#parsetTextureAtlasData()
         */
        static parseTextureAtlasData(rawData: any, scale?: number): any;
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
        /**
         * @private
         */
        constructor();
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
        protected _parseIK(rawData: any): void;
        /**
         * @private
         */
        protected _parseSlot(rawData: any, zOrder: number): SlotData;
        /**
         * @private
         */
        protected _parseSkin(rawData: any): SkinData;
        /**
         * @private
         */
        protected _parseSkinSlotData(rawData: any): SkinSlotData;
        /**
         * @private
         */
        protected _parseDisplay(rawData: any): DisplayData;
        /**
         * @private
         */
        protected _parseMesh(rawData: any): MeshData;
        /**
         * @private
         */
        protected _parseBoundingBox(rawData: any): BoundingBoxData;
        /**
         * @private
         */
        protected _parseAnimation(rawData: any): AnimationData;
        /**
         * @private
         */
        protected _parseBoneTimeline(rawData: any): BoneTimelineData;
        /**
         * @private
         */
        protected _parseSlotTimeline(rawData: any): SlotTimelineData;
        /**
         * @private
         */
        protected _parseFFDTimeline(rawData: any): FFDTimelineData;
        /**
         * @private
         */
        protected _parseAnimationFrame(rawData: any, frameStart: number, frameCount: number): AnimationFrameData;
        /**
         * @private
         */
        protected _parseZOrderFrame(rawData: any, frameStart: number, frameCount: number): ZOrderFrameData;
        /**
         * @private
         */
        protected _parseBoneFrame(rawData: Object, frameStart: number, frameCount: number): BoneFrameData;
        /**
         * @private
         */
        protected _parseSlotFrame(rawData: any, frameStart: number, frameCount: number): SlotFrameData;
        /**
         * @private
         */
        protected _parseFFDFrame(rawData: any, frameStart: number, frameCount: number): ExtensionFrameData;
        /**
         * @private
         */
        protected _parseTweenFrame<T extends TweenFrameData<T>>(rawData: any, frame: T, frameStart: number, frameCount: number): void;
        /**
         * @private
         */
        protected _parseFrame<T extends FrameData<T>>(rawData: any, frame: T, frameStart: number, frameCount: number): void;
        /**
         * @private
         */
        protected _parseTimeline<T extends FrameData<T>>(rawData: Object, timeline: TimelineData<T>, frameParser: (rawData: any, frameStart: number, frameCount: number) => T): void;
        /**
         * @private
         */
        protected _parseActionData(rawData: any, actions: Array<ActionData>, bone: BoneData, slot: SlotData): void;
        /**
         * @private
         */
        protected _parseEventData(rawData: any, events: Array<EventData>, bone: BoneData, slot: SlotData): void;
        /**
         * @private
         */
        protected _parseTransform(rawData: Object, transform: Transform): void;
        /**
         * @private
         */
        protected _parseColorTransform(rawData: Object, color: ColorTransform): void;
        /**
         * @inheritDoc
         */
        parseDragonBonesData(rawData: any, scale?: number): DragonBonesData;
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
     * @language zh_CN
     * 骨架代理接口。
     * @version DragonBones 5.0
     */
    interface IArmatureProxy extends IEventDispatcher {
        /**
         * @private
         */
        _onClear(): void;
        /**
         * @private
         */
        _debugDraw(isEnabled: boolean): void;
        /**
         * @language zh_CN
         * 释放代理和骨架。 (骨架会回收到对象池)
         * @version DragonBones 4.5
         */
        dispose(disposeProxy: boolean): void;
        /**
         * @language zh_CN
         * 获取骨架。
         * @readOnly
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         */
        armature: Armature;
        /**
         * @language zh_CN
         * 获取动画控制器。
         * @readOnly
         * @see dragonBones.Animation
         * @version DragonBones 4.5
         */
        animation: Animation;
    }
    /**
     * @deprecated
     * @see dragonBones.IArmatureProxy
     */
    interface IArmatureDisplay extends IArmatureProxy {
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 基础变换对象。
     * @version DragonBones 4.5
     */
    abstract class TransformObject extends BaseObject {
        /**
         * @language zh_CN
         * 对象的名称。
         * @readOnly
         * @version DragonBones 3.0
         */
        name: string;
        /**
         * @language zh_CN
         * 相对于骨架坐标系的矩阵。
         * @readOnly
         * @version DragonBones 3.0
         */
        globalTransformMatrix: Matrix;
        /**
         * @language zh_CN
         * 相对于骨架坐标系的变换。
         * @see dragonBones.Transform
         * @readOnly
         * @version DragonBones 3.0
         */
        global: Transform;
        /**
         * @language zh_CN
         * 相对于骨架或父骨骼坐标系的偏移变换。
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        offset: Transform;
        /**
         * @language zh_CN
         * 相对于骨架或父骨骼坐标系的绑定变换。
         * @readOnly
         * @see dragonBones.Transform
         * @version DragonBones 3.0
         */
        origin: Transform;
        /**
         * @language zh_CN
         * 可以用于存储临时数据。
         * @version DragonBones 3.0
         */
        userData: any;
        /**
         * @private
         */
        _armature: Armature;
        /**
         * @private
         */
        _parent: Bone;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @internal
         * @private
         */
        _setArmature(value: Armature): void;
        /**
         * @internal
         * @private
         */
        _setParent(value: Bone): void;
        /**
         * @language zh_CN
         * 所属的骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        readonly armature: Armature;
        /**
         * @language zh_CN
         * 所属的父骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        readonly parent: Bone;
    }
}
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    const enum BoneTransformDirty {
        None = 0,
        Self = 1,
        All = 2,
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
    class Bone extends TransformObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 是否继承父骨骼的平移。
         * @version DragonBones 3.0
         */
        inheritTranslation: boolean;
        /**
         * @language zh_CN
         * 是否继承父骨骼的旋转。
         * @version DragonBones 3.0
         */
        inheritRotation: boolean;
        /**
         * @language zh_CN
         * 是否继承父骨骼的缩放。
         * @version DragonBones 4.5
         */
        inheritScale: boolean;
        /**
         * @private
         */
        ikBendPositive: boolean;
        /**
         * @language zh_CN
         * 骨骼长度。
         * @version DragonBones 4.5
         */
        length: number;
        /**
         * @private
         */
        ikWeight: number;
        /**
         * @internal
         * @private
         */
        _transformDirty: BoneTransformDirty;
        private _visible;
        private _cachedFrameIndex;
        private _ikChain;
        private _ikChainIndex;
        /**
         * @internal
         * @private
         */
        _updateState: number;
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
        _blendTotalWeight: number;
        /**
         * @internal
         * @private
         */
        _animationPose: Transform;
        private _bones;
        private _slots;
        private _boneData;
        private _ik;
        /**
         * @internal
         * @private
         */
        _cachedFrameIndices: Array<number>;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        /**
         * @private
         */
        private _updateGlobalTransformMatrix();
        /**
         * @private
         */
        private _computeIKA();
        /**
         * @private
         */
        private _computeIKB();
        /**
         * @internal
         * @private
         */
        _init(boneData: BoneData): void;
        /**
         * @internal
         * @private
         */
        _setArmature(value: Armature): void;
        /**
         * @internal
         * @private
         */
        _setIK(value: Bone, chain: number, chainIndex: number): void;
        /**
         * @internal
         * @private
         */
        _update(cacheFrameIndex: number): void;
        /**
         * @language zh_CN
         * 下一帧更新变换。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @version DragonBones 3.0
         */
        invalidUpdate(): void;
        /**
         * @language zh_CN
         * 是否包含骨骼或插槽。
         * @returns
         * @see dragonBones.TransformObject
         * @version DragonBones 3.0
         */
        contains(child: TransformObject): boolean;
        /**
         * @language zh_CN
         * 所有的子骨骼。
         * @version DragonBones 3.0
         */
        getBones(): Array<Bone>;
        /**
         * @language zh_CN
         * 所有的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        getSlots(): Array<Slot>;
        /**
         * @language zh_CN
         * 控制此骨骼所有插槽的可见。
         * @default true
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        visible: boolean;
        /**
         * @deprecated
         * @see dragonBones.Armature#getSlot()
         */
        readonly slot: Slot;
        /**
         * @deprecated
         */
        readonly ikChain: number;
        /**
         * @deprecated
         */
        readonly ikChainIndex: number;
        /**
         * @deprecated
         */
        readonly ik: Bone;
    }
}
declare namespace dragonBones {
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
    abstract class Slot extends TransformObject {
        /**
         * @private
         */
        protected static _helpPoint: Point;
        /**
         * @private
         */
        protected static _helpMatrix: Matrix;
        /**
         * @language zh_CN
         * 显示对象受到控制的动画状态或混合组名称，设置为 null 则表示受所有的动画状态控制。
         * @default null
         * @see dragonBones.AnimationState#displayControl
         * @see dragonBones.AnimationState#name
         * @see dragonBones.AnimationState#group
         * @version DragonBones 4.5
         */
        displayController: string;
        /**
         * @private
         */
        protected _displayDirty: boolean;
        /**
         * @internal
         * @private
         */
        protected _zOrderDirty: boolean;
        /**
         * @private
         */
        protected _blendModeDirty: boolean;
        /**
         * @internal
         * @private
         */
        _colorDirty: boolean;
        /**
         * @internal
         * @private
         */
        _meshDirty: boolean;
        /**
         * @private
         */
        protected _originalDirty: boolean;
        /**
         * @private
         */
        protected _transformDirty: boolean;
        /**
         * @private
         */
        _updateState: number;
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
        protected _localMatrix: Matrix;
        /**
         * @private
         */
        _colorTransform: ColorTransform;
        /**
         * @private
         */
        _ffdVertices: Array<number>;
        /**
         * @private
         */
        protected _displayList: Array<any | Armature>;
        /**
         * @private
         */
        _replacedDisplayDatas: Array<DisplayData>;
        /**
         * @private
         */
        protected _meshBones: Array<Bone>;
        /**
         * @private
         */
        protected _skinSlotData: SkinSlotData;
        /**
         * @private
         */
        protected _displayData: DisplayData;
        /**
         * @private
         */
        protected _replacedDisplayData: DisplayData;
        /**
         * @private
         */
        protected _textureData: TextureData;
        /**
         * @private
         */
        _meshData: MeshData;
        /**
         * @private
         */
        protected _boundingBoxData: BoundingBoxData;
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
        protected _childArmature: Armature;
        /**
         * @private
         */
        _cachedFrameIndices: Array<number>;
        /**
         * @internal
         * @private
         */
        constructor();
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
         * @internal
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
        protected _updateLocalTransformMatrix(): void;
        /**
         * @private
         */
        protected _updateGlobalTransformMatrix(): void;
        /**
         * @private
         */
        _init(skinSlotData: SkinSlotData, rawDisplay: any, meshDisplay: any): void;
        /**
         * @internal
         * @private
         */
        _setArmature(value: Armature): void;
        /**
         * @internal
         * @private
         */
        _update(cacheFrameIndex: number): void;
        /**
         * @private
         */
        _updateTransformAndMatrix(): void;
        /**
         * @private Factory
         */
        _setDisplayList(value: Array<any>): boolean;
        /**
         * @internal
         * @private
         */
        _setDisplayIndex(value: number): boolean;
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
         * @language zh_CN
         * 判断指定的点是否在插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @param color 指定的包围盒颜色。 [0: 与所有包围盒进行判断, N: 仅当包围盒的颜色为 N 时才进行判断]
         * @version DragonBones 5.0
         */
        containsPoint(x: number, y: number): boolean;
        /**
         * @language zh_CN
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
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        }, intersectionPointB?: {
            x: number;
            y: number;
        }, normalRadians?: {
            x: number;
            y: number;
        }): number;
        /**
         * @language zh_CN
         * 在下一帧更新显示对象的状态。
         * @version DragonBones 4.5
         */
        invalidUpdate(): void;
        /**
         * @private
         */
        readonly skinSlotData: SkinSlotData;
        /**
         * @language zh_CN
         * 插槽此时的自定义包围盒数据。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        readonly boundingBoxData: BoundingBoxData;
        /**
         * @private
         */
        readonly rawDisplay: any;
        /**
         * @private
         */
        readonly meshDisplay: any;
        /**
         * @language zh_CN
         * 此时显示的显示对象在显示列表中的索引。
         * @version DragonBones 4.5
         */
        displayIndex: number;
        /**
         * @language zh_CN
         * 包含显示对象或子骨架的显示列表。
         * @version DragonBones 3.0
         */
        displayList: Array<any>;
        /**
         * @language zh_CN
         * 此时显示的显示对象。
         * @version DragonBones 3.0
         */
        display: any;
        /**
         * @language zh_CN
         * 此时显示的子骨架。
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        childArmature: Armature;
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
     * @language zh_CN
     * 骨架，是骨骼动画系统的核心，由显示容器、骨骼、插槽、动画、事件系统构成。
     * @see dragonBones.ArmatureData
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     * @see dragonBones.Animation
     * @version DragonBones 3.0
     */
    class Armature extends BaseObject implements IAnimateble {
        /**
         * @private
         */
        static toString(): string;
        private static _onSortSlots(a, b);
        /**
         * @language zh_CN
         * 是否继承父骨架的动画状态。
         * @default true
         * @version DragonBones 4.5
         */
        inheritAnimation: boolean;
        /**
         * @private
         */
        debugDraw: boolean;
        /**
         * @language zh_CN
         * 用于存储临时数据。
         * @version DragonBones 3.0
         */
        userData: any;
        private _debugDraw;
        private _delayDispose;
        private _lockDispose;
        /**
         * @internal
         * @private
         */
        _bonesDirty: boolean;
        private _slotsDirty;
        private _bones;
        private _slots;
        private _actions;
        private _events;
        /**
         * @private
         */
        _armatureData: ArmatureData;
        /**
         * @private
         */
        _skinData: SkinData;
        private _animation;
        private _proxy;
        private _display;
        private _eventManager;
        /**
         * @internal
         * @private
         */
        _parent: Slot;
        private _clock;
        /**
         * @private
         */
        _replaceTextureAtlasData: TextureAtlasData;
        private _replacedTexture;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        private _sortBones();
        private _sortSlots();
        private _doAction(value);
        /**
         * @private
         */
        _init(armatureData: ArmatureData, skinData: SkinData, proxy: IArmatureProxy, display: any, eventManager: IEventDispatcher): void;
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
         * @private
         */
        _sortZOrder(slotIndices: Array<number>): void;
        /**
         * @private
         */
        _bufferAction(value: ActionData): void;
        /**
         * @internal
         * @private
         */
        _bufferEvent(value: EventObject, type: string): void;
        /**
         * @language zh_CN
         * 释放骨架。 (回收到对象池)
         * @version DragonBones 3.0
         */
        dispose(): void;
        /**
         * @language zh_CN
         * 更新骨架和动画。
         * @param passedTime 两帧之间的时间间隔。 (以秒为单位)
         * @see dragonBones.IAnimateble
         * @see dragonBones.WorldClock
         * @version DragonBones 3.0
         */
        advanceTime(passedTime: number): void;
        /**
         * @language zh_CN
         * 更新骨骼和插槽。 (当骨骼没有动画状态或动画状态播放完成时，骨骼将不在更新)
         * @param boneName 指定的骨骼名称，如果未设置，将更新所有骨骼。
         * @param updateSlotDisplay 是否更新插槽的显示对象。
         * @see dragonBones.Bone
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        invalidUpdate(boneName?: string, updateSlotDisplay?: boolean): void;
        /**
         * @language zh_CN
         * 判断点是否在所有插槽的自定义包围盒内。
         * @param x 点的水平坐标。（骨架内坐标系）
         * @param y 点的垂直坐标。（骨架内坐标系）
         * @version DragonBones 5.0
         */
        containsPoint(x: number, y: number): Slot;
        /**
         * @language zh_CN
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
         */
        intersectsSegment(xA: number, yA: number, xB: number, yB: number, intersectionPointA?: {
            x: number;
            y: number;
        }, intersectionPointB?: {
            x: number;
            y: number;
        }, normalRadians?: {
            x: number;
            y: number;
        }): Slot;
        /**
         * @language zh_CN
         * 获取指定名称的骨骼。
         * @param name 骨骼的名称。
         * @returns 骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        getBone(name: string): Bone;
        /**
         * @language zh_CN
         * 通过显示对象获取骨骼。
         * @param display 显示对象。
         * @returns 包含这个显示对象的骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        getBoneByDisplay(display: any): Bone;
        /**
         * @language zh_CN
         * 获取插槽。
         * @param name 插槽的名称。
         * @returns 插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        getSlot(name: string): Slot;
        /**
         * @language zh_CN
         * 通过显示对象获取插槽。
         * @param display 显示对象。
         * @returns 包含这个显示对象的插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        getSlotByDisplay(display: any): Slot;
        /**
         * @deprecated
         */
        addBone(value: Bone, parentName?: string): void;
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
         * @language zh_CN
         * 替换骨架的主贴图，根据渲染引擎的不同，提供不同的贴图类型。
         * @param texture 贴图。
         * @version DragonBones 4.5
         */
        replaceTexture(texture: any): void;
        /**
         * @language zh_CN
         * 获取所有骨骼。
         * @see dragonBones.Bone
         * @version DragonBones 3.0
         */
        getBones(): Array<Bone>;
        /**
         * @language zh_CN
         * 获取所有插槽。
         * @see dragonBones.Slot
         * @version DragonBones 3.0
         */
        getSlots(): Array<Slot>;
        /**
         * @language zh_CN
         * 骨架名称。
         * @see dragonBones.ArmatureData#name
         * @version DragonBones 3.0
         */
        readonly name: string;
        /**
         * @language zh_CN
         * 获取骨架数据。
         * @see dragonBones.ArmatureData
         * @version DragonBones 4.5
         */
        readonly armatureData: ArmatureData;
        /**
         * @language zh_CN
         * 获得动画控制器。
         * @see dragonBones.Animation
         * @version DragonBones 3.0
         */
        readonly animation: Animation;
        /**
         * @language zh_CN
         * 获取事件监听器。
         * @version DragonBones 5.0
         */
        readonly eventDispatcher: IEventDispatcher;
        /**
         * @language zh_CN
         * 获取显示容器，插槽的显示对象都会以此显示容器为父级，根据渲染平台的不同，类型会不同，通常是 DisplayObjectContainer 类型。
         * @version DragonBones 3.0
         */
        readonly display: any;
        /**
         * @language zh_CN
         * 获取父插槽。 (当此骨架是某个骨架的子骨架时，可以通过此属性向上查找从属关系)
         * @see dragonBones.Slot
         * @version DragonBones 4.5
         */
        readonly parent: Slot;
        /**
         * @language zh_CN
         * 动画缓存帧率，当设置的值大于 0 的时，将会开启动画缓存。
         * 通过将动画数据缓存在内存中来提高运行性能，会有一定的内存开销。
         * 帧率不宜设置的过高，通常跟动画的帧率相当且低于程序运行的帧率。
         * 开启动画缓存后，某些功能将会失效，比如 Bone 和 Slot 的 offset 属性等。
         * @see dragonBones.DragonBonesData#frameRate
         * @see dragonBones.ArmatureData#frameRate
         * @version DragonBones 4.5
         */
        cacheFrameRate: number;
        /**
         * @inheritDoc
         */
        clock: WorldClock;
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
     * @language zh_CN
     * 播放动画接口。 (Armature 和 WordClock 都实现了该接口)
     * 任何实现了此接口的实例都可以加到 WorldClock 实例中，由 WorldClock 统一更新时间。
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    interface IAnimateble {
        /**
        * @language zh_CN
        * 更新时间。
        * @param passedTime 前进的时间。 (以秒为单位)
        * @version DragonBones 3.0
        */
        advanceTime(passedTime: number): void;
        /**
         * @private
         */
        clock: WorldClock;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 动画控制器，用来播放动画数据，管理动画状态。
     * @see dragonBones.AnimationData
     * @see dragonBones.AnimationState
     * @version DragonBones 3.0
     */
    class Animation extends BaseObject {
        private static _sortAnimationState(a, b);
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 动画播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        timeScale: number;
        private _isPlaying;
        private _animationStateDirty;
        /**
         * @internal
         * @private
         */
        _timelineStateDirty: boolean;
        /**
         * @private
         */
        _cacheFrameIndex: number;
        private _animationNames;
        private _animations;
        private _animationStates;
        private _armature;
        private _lastAnimationState;
        private _animationConfig;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        private _fadeOut(animationConfig);
        /**
         * @internal
         * @private
         */
        _init(armature: Armature): void;
        /**
         * @internal
         * @private
         */
        _advanceTime(passedTime: number): void;
        /**
         * @language zh_CN
         * 清除所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        reset(): void;
        /**
         * @language zh_CN
         * 暂停播放动画。
         * @param animationName 动画状态的名称，如果未设置，则暂停所有动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        stop(animationName?: string): void;
        /**
         * @language zh_CN
         * @beta
         * 通过动画配置来播放动画。
         * @param animationConfig 动画配置。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationConfig
         * @see dragonBones.AnimationState
         * @version DragonBones 5.0
         */
        playConfig(animationConfig: AnimationConfig): AnimationState;
        /**
         * @language zh_CN
         * 淡入播放动画。
         * @param animationName 动画数据名称。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @param fadeInTime 淡入时间。 [-1: 使用动画数据默认值, [0~N]: 淡入时间] (以秒为单位)
         * @param layer 混合图层，图层高会优先获取混合权重。
         * @param group 混合组，用于动画状态编组，方便控制淡出。
         * @param fadeOutMode 淡出模式。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationFadeOutMode
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        fadeIn(animationName: string, fadeInTime?: number, playTimes?: number, layer?: number, group?: string, fadeOutMode?: AnimationFadeOutMode): AnimationState;
        /**
         * @language zh_CN
         * 播放动画。
         * @param animationName 动画数据名称，如果未设置，则播放默认动画，或将暂停状态切换为播放状态，或重新播放上一个正在播放的动画。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        play(animationName?: string, playTimes?: number): AnimationState;
        /**
         * @language zh_CN
         * 从指定时间开始播放动画。
         * @param animationName 动画数据的名称。
         * @param time 开始时间。 (以秒为单位)
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndPlayByTime(animationName: string, time?: number, playTimes?: number): AnimationState;
        /**
         * @language zh_CN
         * 从指定帧开始播放动画。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndPlayByFrame(animationName: string, frame?: number, playTimes?: number): AnimationState;
        /**
         * @language zh_CN
         * 从指定进度开始播放动画。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0~1]
         * @param playTimes 播放次数。 [-1: 使用动画数据默认值, 0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndPlayByProgress(animationName: string, progress?: number, playTimes?: number): AnimationState;
        /**
         * @language zh_CN
         * 将动画停止到指定的时间。
         * @param animationName 动画数据的名称。
         * @param time 时间。 (以秒为单位)
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndStopByTime(animationName: string, time?: number): AnimationState;
        /**
         * @language zh_CN
         * 将动画停止到指定的帧。
         * @param animationName 动画数据的名称。
         * @param frame 帧。
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndStopByFrame(animationName: string, frame?: number): AnimationState;
        /**
         * @language zh_CN
         * 将动画停止到指定的进度。
         * @param animationName 动画数据的名称。
         * @param progress 进度。 [0 ~ 1]
         * @returns 对应的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 4.5
         */
        gotoAndStopByProgress(animationName: string, progress?: number): AnimationState;
        /**
         * @language zh_CN
         * 获取动画状态。
         * @param animationName 动画状态的名称。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        getState(animationName: string): AnimationState;
        /**
         * @language zh_CN
         * 是否包含动画数据。
         * @param animationName 动画数据的名称。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        hasAnimation(animationName: string): boolean;
        /**
         * @language zh_CN
         * 动画是否处于播放状态。
         * @version DragonBones 3.0
         */
        readonly isPlaying: boolean;
        /**
         * @language zh_CN
         * 所有动画状态是否均已播放完毕。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        readonly isCompleted: boolean;
        /**
         * @language zh_CN
         * 上一个正在播放的动画状态名称。
         * @see #lastAnimationState
         * @version DragonBones 3.0
         */
        readonly lastAnimationName: string;
        /**
         * @language zh_CN
         * 上一个正在播放的动画状态。
         * @see dragonBones.AnimationState
         * @version DragonBones 3.0
         */
        readonly lastAnimationState: AnimationState;
        /**
         * @language zh_CN
         * 一个可以快速使用的动画配置实例。
         * @see dragonBones.AnimationConfig
         * @version DragonBones 5.0
         */
        readonly animationConfig: AnimationConfig;
        /**
         * @language zh_CN
         * 所有动画数据名称。
         * @see #animations
         * @version DragonBones 4.5
         */
        readonly animationNames: Array<string>;
        /**
         * @language zh_CN
         * 所有动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 4.5
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
        gotoAndPlay(animationName: string, fadeInTime?: number, duration?: number, playTimes?: number, layer?: number, group?: string, fadeOutMode?: AnimationFadeOutMode, pauseFadeOut?: boolean, pauseFadeIn?: boolean): AnimationState;
        /**
         * @deprecated
         * @see #gotoAndStopByTime()
         * @see #gotoAndStopByFrame()
         * @see #gotoAndStopByProgress()
         */
        gotoAndStop(animationName: string, time?: number): AnimationState;
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
        /**
         * @deprecated
         * @see dragonBones.AnimationFadeOutMode.None
         */
        static None: AnimationFadeOutMode;
        /**
         * @deprecated
         * @see dragonBones.AnimationFadeOutMode.SameLayer
         */
        static SameLayer: AnimationFadeOutMode;
        /**
         * @deprecated
         * @see dragonBones.AnimationFadeOutMode.SameGroup
         */
        static SameGroup: AnimationFadeOutMode;
        /**
         * @deprecated
         * @see dragonBones.AnimationFadeOutMode.SameLayerAndGroup
         */
        static SameLayerAndGroup: AnimationFadeOutMode;
        /**
         * @deprecated
         * @see dragonBones.AnimationFadeOutMode.All
         */
        static All: AnimationFadeOutMode;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 动画状态，播放动画时产生，可以对每个播放的动画进行更细致的控制和调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @version DragonBones 3.0
     */
    class AnimationState extends BaseObject {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 是否对插槽的显示对象有控制权。
         * @see dragonBones.Slot#displayController
         * @version DragonBones 3.0
         */
        displayControl: boolean;
        /**
         * @language zh_CN
         * 是否以增加的方式混合。
         * @version DragonBones 3.0
         */
        additiveBlending: boolean;
        /**
         * @language zh_CN
         * 是否能触发行为。
         * @version DragonBones 5.0
         */
        actionEnabled: boolean;
        /**
         * @language zh_CN
         * 播放次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         */
        playTimes: number;
        /**
         * @language zh_CN
         * 播放速度。 [(-N~0): 倒转播放, 0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @version DragonBones 3.0
         */
        timeScale: number;
        /**
         * @language zh_CN
         * 混合权重。
         * @version DragonBones 3.0
         */
        weight: number;
        /**
         * @language zh_CN
         * 自动淡出时间。 [-1: 不自动淡出, [0~N]: 淡出时间] (以秒为单位)
         * 当设置一个大于等于 0 的值，动画状态将会在播放完成后自动淡出。
         * @version DragonBones 3.0
         */
        autoFadeOutTime: number;
        /**
         * @private
         */
        fadeTotalTime: number;
        /**
         * @internal
         * @private
         */
        _playheadState: number;
        /**
         * @internal
         * @private
         */
        _fadeState: number;
        /**
         * @internal
         * @private
         */
        _subFadeState: number;
        /**
         * @internal
         * @private
         */
        _layer: number;
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
        /**
         * @private
         */
        private _fadeTime;
        /**
         * @private
         */
        private _time;
        /**
         * @internal
         * @private
         */
        _fadeProgress: number;
        /**
         * @internal
         * @private
         */
        _weightResult: number;
        /**
         * @private
         */
        private _name;
        /**
         * @internal
         * @private
         */
        private _group;
        /**
         * @private
         */
        private _boneMask;
        /**
         * @private
         */
        private _animationNames;
        /**
         * @private
         */
        private _boneTimelines;
        /**
         * @private
         */
        private _slotTimelines;
        /**
         * @private
         */
        private _ffdTimelines;
        /**
         * @private
         */
        private _animationData;
        /**
         * @private
         */
        private _armature;
        /**
         * @internal
         * @private
         */
        _timeline: AnimationTimelineState;
        /**
         * @private
         */
        private _zOrderTimeline;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @private
         */
        protected _onClear(): void;
        private _advanceFadeTime(passedTime);
        /**
         * @internal
         * @private
         */
        _init(armature: Armature, animationData: AnimationData, animationConfig: AnimationConfig): void;
        /**
         * @internal
         * @private
         */
        _updateTimelineStates(): void;
        /**
         * @internal
         * @private
         */
        _advanceTime(passedTime: number, cacheFrameRate: number): void;
        /**
         * @internal
         * @private
         */
        _isDisabled(slot: Slot): boolean;
        /**
         * @language zh_CN
         * 继续播放。
         * @version DragonBones 3.0
         */
        play(): void;
        /**
         * @language zh_CN
         * 暂停播放。
         * @version DragonBones 3.0
         */
        stop(): void;
        /**
         * @language zh_CN
         * 淡出动画。
         * @param fadeOutTime 淡出时间。 (以秒为单位)
         * @param pausePlayhead 淡出时是否暂停动画。
         * @version DragonBones 3.0
         */
        fadeOut(fadeOutTime: number, pausePlayhead?: boolean): void;
        /**
         * @language zh_CN
         * 是否包含骨骼遮罩。
         * @param name 指定的骨骼名称。
         * @version DragonBones 3.0
         */
        containsBoneMask(name: string): boolean;
        /**
         * @language zh_CN
         * 添加骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否为该骨骼的子骨骼添加遮罩。
         * @version DragonBones 3.0
         */
        addBoneMask(name: string, recursive?: boolean): void;
        /**
         * @language zh_CN
         * 删除骨骼遮罩。
         * @param boneName 指定的骨骼名称。
         * @param recursive 是否删除该骨骼的子骨骼遮罩。
         * @version DragonBones 3.0
         */
        removeBoneMask(name: string, recursive?: boolean): void;
        /**
         * @language zh_CN
         * 删除所有骨骼遮罩。
         * @version DragonBones 3.0
         */
        removeAllBoneMask(): void;
        /**
         * @language zh_CN
         * 混合图层。
         * @version DragonBones 3.0
         */
        readonly layer: number;
        /**
         * @language zh_CN
         * 混合组。
         * @version DragonBones 3.0
         */
        readonly group: string;
        /**
         * @language zh_CN
         * 动画名称。
         * @version DragonBones 3.0
         */
        readonly name: string;
        /**
         * @language zh_CN
         * 动画数据。
         * @see dragonBones.AnimationData
         * @version DragonBones 3.0
         */
        readonly animationData: AnimationData;
        /**
         * @language zh_CN
         * 是否播放完毕。
         * @version DragonBones 3.0
         */
        readonly isCompleted: boolean;
        /**
         * @language zh_CN
         * 是否正在播放。
         * @version DragonBones 3.0
         */
        readonly isPlaying: boolean;
        /**
         * @language zh_CN
         * 当前播放次数。
         * @version DragonBones 3.0
         */
        readonly currentPlayTimes: number;
        /**
         * @language zh_CN
         * 动画的总时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        readonly totalTime: number;
        /**
         * @language zh_CN
         * 动画播放的时间。 (以秒为单位)
         * @version DragonBones 3.0
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
    /**
     * @internal
     * @private
     */
    const enum TweenType {
        None = 0,
        Once = 1,
        Always = 2,
    }
    /**
     * @internal
     * @private
     */
    abstract class TimelineState<T extends FrameData<T>, M extends TimelineData<T>> extends BaseObject {
        _playState: number;
        _currentPlayTimes: number;
        _currentTime: number;
        _timelineData: M;
        protected _frameRate: number;
        protected _keyFrameCount: number;
        protected _frameCount: number;
        protected _position: number;
        protected _duration: number;
        protected _animationDutation: number;
        protected _timeScale: number;
        protected _timeOffset: number;
        protected _currentFrame: T;
        protected _armature: Armature;
        protected _animationState: AnimationState;
        protected _mainTimeline: AnimationTimelineState;
        constructor();
        protected _onClear(): void;
        protected _onUpdateFrame(): void;
        protected _onArriveAtFrame(): void;
        protected _setCurrentTime(passedTime: number): boolean;
        _init(armature: Armature, animationState: AnimationState, timelineData: M): void;
        fadeOut(): void;
        update(passedTime: number): void;
    }
    /**
     * @internal
     * @private
     */
    abstract class TweenTimelineState<T extends TweenFrameData<T>, M extends TimelineData<T>> extends TimelineState<T, M> {
        static _getEasingValue(progress: number, easing: number): number;
        static _getEasingCurveValue(progress: number, samples: Array<number>): number;
        protected _tweenProgress: number;
        protected _tweenEasing: number;
        protected _curve: Array<number>;
        constructor();
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
    }
}
declare namespace dragonBones {
    /**
     * @internal
     * @private
     */
    class AnimationTimelineState extends TimelineState<AnimationFrameData, AnimationData> {
        static toString(): string;
        constructor();
        protected _onCrossFrame(frame: AnimationFrameData): void;
        update(passedTime: number): void;
        setCurrentTime(value: number): void;
    }
    /**
     * @internal
     * @private
     */
    class ZOrderTimelineState extends TimelineState<ZOrderFrameData, ZOrderTimelineData> {
        static toString(): string;
        constructor();
        protected _onArriveAtFrame(): void;
    }
    /**
     * @internal
     * @private
     */
    class BoneTimelineState extends TweenTimelineState<BoneFrameData, BoneTimelineData> {
        static toString(): string;
        bone: Bone;
        private _transformDirty;
        private _tweenTransform;
        private _tweenRotate;
        private _tweenScale;
        private _transform;
        private _durationTransform;
        private _boneTransform;
        private _originalTransform;
        constructor();
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        _init(armature: Armature, animationState: AnimationState, timelineData: BoneTimelineData): void;
        fadeOut(): void;
        update(passedTime: number): void;
    }
    /**
     * @internal
     * @private
     */
    class SlotTimelineState extends TweenTimelineState<SlotFrameData, SlotTimelineData> {
        static toString(): string;
        slot: Slot;
        private _colorDirty;
        private _tweenColor;
        private _color;
        private _durationColor;
        private _slotColor;
        constructor();
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        _init(armature: Armature, animationState: AnimationState, timelineData: SlotTimelineData): void;
        fadeOut(): void;
        update(passedTime: number): void;
    }
    /**
     * @internal
     * @private
     */
    class FFDTimelineState extends TweenTimelineState<ExtensionFrameData, FFDTimelineData> {
        static toString(): string;
        slot: Slot;
        private _ffdDirty;
        private _tweenFFD;
        private _ffdVertices;
        private _durationFFDVertices;
        private _slotFFDVertices;
        constructor();
        protected _onClear(): void;
        protected _onArriveAtFrame(): void;
        protected _onUpdateFrame(): void;
        _init(armature: Armature, animationState: AnimationState, timelineData: FFDTimelineData): void;
        fadeOut(): void;
        update(passedTime: number): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * WorldClock 提供时钟支持，为每个加入到时钟的 IAnimatable 对象更新时间。
     * @see dragonBones.IAnimateble
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    class WorldClock implements IAnimateble {
        private static _clock;
        /**
         * @language zh_CN
         * 一个可以直接使用的全局 WorldClock 实例.
         * @version DragonBones 3.0
         */
        static readonly clock: WorldClock;
        /**
         * @language zh_CN
         * 当前时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        time: number;
        /**
         * @language zh_CN
         * 时间流逝速度，用于控制动画变速播放。 [0: 停止播放, (0~1): 慢速播放, 1: 正常播放, (1~N): 快速播放]
         * @default 1
         * @version DragonBones 3.0
         */
        timeScale: number;
        private _animatebles;
        private _clock;
        /**
         * @language zh_CN
         * 创建一个新的 WorldClock 实例。
         * 通常并不需要单独创建 WorldClock 实例，可以直接使用 WorldClock.clock 静态实例。
         * (创建更多独立的 WorldClock 实例可以更灵活的为需要更新的 IAnimateble 实例分组，用于控制不同组不同的播放速度)
         * @version DragonBones 3.0
         */
        constructor();
        /**
         * @language zh_CN
         * 为所有的 IAnimatable 实例更新时间。
         * @param passedTime 前进的时间。 (以秒为单位，当设置为 -1 时将自动计算当前帧与上一帧的时间差)
         * @version DragonBones 3.0
         */
        advanceTime(passedTime: number): void;
        /**
         * 是否包含 IAnimatable 实例
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        contains(value: IAnimateble): boolean;
        /**
         * @language zh_CN
         * 添加 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        add(value: IAnimateble): void;
        /**
         * @language zh_CN
         * 移除 IAnimatable 实例。
         * @param value IAnimatable 实例。
         * @version DragonBones 3.0
         */
        remove(value: IAnimateble): void;
        /**
         * @language zh_CN
         * 清除所有的 IAnimatable 实例。
         * @version DragonBones 3.0
         */
        clear(): void;
        /**
         * @inheritDoc
         */
        clock: WorldClock;
    }
}
declare namespace dragonBones {
    /**
     * @private
     */
    type EventStringType = string | "start" | "loopComplete" | "complete" | "fadeIn" | "fadeInComplete" | "fadeOut" | "fadeOutComplete" | "frameEvent" | "soundEvent";
    /**
     * @language zh_CN
     * 事件接口。
     * @version DragonBones 4.5
     */
    interface IEventDispatcher {
        /**
         * @internal
         * @private
         */
        _dispatchEvent(type: EventStringType, eventObject: EventObject): void;
        /**
         * @language zh_CN
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @version DragonBones 4.5
         */
        hasEvent(type: EventStringType): boolean;
        /**
         * @language zh_CN
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         */
        addEvent(type: EventStringType, listener: Function, target: any): void;
        /**
         * @language zh_CN
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         */
        removeEvent(type: EventStringType, listener: Function, target: any): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * 事件数据。
     * @version DragonBones 4.5
     */
    class EventObject extends BaseObject {
        /**
         * @language zh_CN
         * 动画开始。
         * @version DragonBones 4.5
         */
        static START: string;
        /**
         * @language zh_CN
         * 动画循环播放一次完成。
         * @version DragonBones 4.5
         */
        static LOOP_COMPLETE: string;
        /**
         * @language zh_CN
         * 动画播放完成。
         * @version DragonBones 4.5
         */
        static COMPLETE: string;
        /**
         * @language zh_CN
         * 动画淡入开始。
         * @version DragonBones 4.5
         */
        static FADE_IN: string;
        /**
         * @language zh_CN
         * 动画淡入完成。
         * @version DragonBones 4.5
         */
        static FADE_IN_COMPLETE: string;
        /**
         * @language zh_CN
         * 动画淡出开始。
         * @version DragonBones 4.5
         */
        static FADE_OUT: string;
        /**
         * @language zh_CN
         * 动画淡出完成。
         * @version DragonBones 4.5
         */
        static FADE_OUT_COMPLETE: string;
        /**
         * @language zh_CN
         * 动画帧事件。
         * @version DragonBones 4.5
         */
        static FRAME_EVENT: string;
        /**
         * @language zh_CN
         * 动画声音事件。
         * @version DragonBones 4.5
         */
        static SOUND_EVENT: string;
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 事件类型。
         * @version DragonBones 4.5
         */
        type: EventStringType;
        /**
         * @language zh_CN
         * 事件名称。 (帧标签的名称或声音的名称)
         * @version DragonBones 4.5
         */
        name: string;
        /**
         * @private
         */
        frame: AnimationFrameData;
        /**
         * @language zh_CN
         * 自定义数据
         * @see dragonBones.CustomData
         * @version DragonBones 5.0
         */
        data: CustomData;
        /**
         * @language zh_CN
         * 发出事件的骨架。
         * @version DragonBones 4.5
         */
        armature: Armature;
        /**
         * @language zh_CN
         * 发出事件的骨骼。
         * @version DragonBones 4.5
         */
        bone: Bone;
        /**
         * @language zh_CN
         * 发出事件的插槽。
         * @version DragonBones 4.5
         */
        slot: Slot;
        /**
         * @language zh_CN
         * 发出事件的动画状态。
         * @version DragonBones 4.5
         */
        animationState: AnimationState;
        /**
         * @internal
         * @private
         */
        constructor();
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
    type BuildArmaturePackage = {
        dataName?: string;
        textureAtlasName?: string;
        data?: DragonBonesData;
        armature?: ArmatureData;
        skin?: SkinData;
    };
    /**
     * @language zh_CN
     * 创建骨架的基础工厂。 (通常只需要一个全局工厂实例)
     * @see dragonBones.DragonBonesData
     * @see dragonBones.TextureAtlasData
     * @see dragonBones.ArmatureData
     * @see dragonBones.Armature
     * @version DragonBones 3.0
     */
    abstract class BaseFactory {
        /**
         * @private
         */
        protected static _defaultParser: ObjectDataParser;
        /**
         * @language zh_CN
         * 是否开启共享搜索。
         * 如果开启，创建一个骨架时，可以从多个龙骨数据中寻找骨架数据，或贴图集数据中寻找贴图数据。 (通常在有共享导出的数据时开启)
         * @see dragonBones.DragonBonesData#autoSearch
         * @see dragonBones.TextureAtlasData#autoSearch
         * @version DragonBones 4.5
         */
        autoSearch: boolean;
        /**
         * @private
         */
        protected _dragonBonesDataMap: Map<DragonBonesData>;
        /**
         * @private
         */
        protected _textureAtlasDataMap: Map<Array<TextureAtlasData>>;
        /**
         * @private
         */
        protected _dataParser: DataParser;
        /**
         * @private
         */
        constructor(dataParser?: DataParser);
        /**
         * @private
         */
        protected _getTextureData(textureAtlasName: string, textureName: string): TextureData;
        /**
         * @private
         */
        protected _fillBuildArmaturePackage(dataPackage: BuildArmaturePackage, dragonBonesName: string, armatureName: string, skinName: string, textureAtlasName: string): boolean;
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
        protected _replaceSlotDisplay(dataPackage: BuildArmaturePackage, displayData: DisplayData, slot: Slot, displayIndex: number): void;
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
        protected abstract _generateSlot(dataPackage: BuildArmaturePackage, skinSlotData: SkinSlotData, armature: Armature): Slot;
        /**
         * @language zh_CN
         * 解析并添加龙骨数据。
         * @param rawData 需要解析的原始数据。 (JSON)
         * @param name 为数据提供一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @returns DragonBonesData
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 4.5
         */
        parseDragonBonesData(rawData: any, name?: string, scale?: number): DragonBonesData;
        /**
         * @language zh_CN
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
         */
        parseTextureAtlasData(rawData: any, textureAtlas: Object, name?: string, scale?: number): TextureAtlasData;
        /**
         * @language zh_CN
         * 获取指定名称的龙骨数据。
         * @param name 数据名称。
         * @returns DragonBonesData
         * @see #parseDragonBonesData()
         * @see #addDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        getDragonBonesData(name: string): DragonBonesData;
        /**
         * @language zh_CN
         * 添加龙骨数据。
         * @param data 龙骨数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #removeDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        addDragonBonesData(data: DragonBonesData, name?: string): void;
        /**
         * @language zh_CN
         * 移除龙骨数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。
         * @see #parseDragonBonesData()
         * @see #getDragonBonesData()
         * @see #addDragonBonesData()
         * @see dragonBones.DragonBonesData
         * @version DragonBones 3.0
         */
        removeDragonBonesData(name: string, disposeData?: boolean): void;
        /**
         * @language zh_CN
         * 获取指定名称的贴图集数据列表。
         * @param name 数据名称。
         * @returns 贴图集数据列表。
         * @see #parseTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        getTextureAtlasData(name: string): Array<TextureAtlasData>;
        /**
         * @language zh_CN
         * 添加贴图集数据。
         * @param data 贴图集数据。
         * @param name 为数据指定一个名称，以便可以通过这个名称获取数据，如果未设置，则使用数据中的名称。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #removeTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        addTextureAtlasData(data: TextureAtlasData, name?: string): void;
        /**
         * @language zh_CN
         * 移除贴图集数据。
         * @param name 数据名称。
         * @param disposeData 是否释放数据。
         * @see #parseTextureAtlasData()
         * @see #getTextureAtlasData()
         * @see #addTextureAtlasData()
         * @see dragonBones.textures.TextureAtlasData
         * @version DragonBones 3.0
         */
        removeTextureAtlasData(name: string, disposeData?: boolean): void;
        /**
         * @language zh_CN
         * 清除所有的数据。
         * @param disposeData 是否释放数据。
         * @version DragonBones 4.5
         */
        clear(disposeData?: boolean): void;
        /**
         * @language zh_CN
         * 创建一个骨架。
         * @param armatureName 骨架数据名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，当多个龙骨数据中包含同名的骨架数据时，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据名称。
         * @returns 骨架
         * @see dragonBones.ArmatureData
         * @see dragonBones.Armature
         * @version DragonBones 3.0
         */
        buildArmature(armatureName: string, dragonBonesName?: string, skinName?: string, textureAtlasName?: string): Armature;
        /**
         * @language zh_CN
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
         */
        copyAnimationsToArmature(toArmature: Armature, fromArmatreName: string, fromSkinName?: string, fromDragonBonesDataName?: string, replaceOriginalAnimation?: boolean): boolean;
        /**
         * @language zh_CN
         * 用指定资源替换插槽的显示对象。
         * @param dragonBonesName 指定的龙骨数据名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param displayName 指定的显示对象名称。
         * @param slot 指定的插槽实例。
         * @param displayIndex 要替换的显示对象的索引，如果未设置，则替换当前正在显示的显示对象。
         * @version DragonBones 4.5
         */
        replaceSlotDisplay(dragonBonesName: string, armatureName: string, slotName: string, displayName: string, slot: Slot, displayIndex?: number): void;
        /**
         * @language zh_CN
         * 用指定资源列表替换插槽的显示对象列表。
         * @param dragonBonesName 指定的 DragonBonesData 名称。
         * @param armatureName 指定的骨架名称。
         * @param slotName 指定的插槽名称。
         * @param slot 指定的插槽实例。
         * @version DragonBones 4.5
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
     * @language zh_CN
     * Egret 贴图集数据。
     * @version DragonBones 3.0
     */
    class EgretTextureAtlasData extends TextureAtlasData {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * Egret 贴图。
         * @version DragonBones 3.0
         */
        texture: egret.Texture;
        /**
         * @private
         */
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
        /**
         * @private
         */
        generateTexture(): TextureData;
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
        constructor();
        /**
         * @inheritDoc
         */
        protected _onClear(): void;
    }
}
declare namespace dragonBones {
    /**
     * @language zh_CN
     * Egret 事件。
     * @version DragonBones 4.5
     */
    class EgretEvent extends egret.Event {
        /**
         * @language zh_CN
         * 事件对象。
         * @see dragonBones.EventObject
         * @version DragonBones 4.5
         */
        readonly eventObject: EventObject;
        /**
         * @internal
         * @private
         */
        constructor(type: EventStringType, bubbles?: boolean, cancelable?: boolean, data?: any);
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#animationName
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
        readonly bone: Bone;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#slot
         */
        readonly slot: Slot;
        /**
         * @deprecated
         * @see #eventObject
         * @see dragonBones.EventObject#animationState
         */
        readonly animationState: AnimationState;
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
    class EgretArmatureDisplay extends egret.DisplayObjectContainer implements IArmatureDisplay, IEventDispatcher {
        private _disposeProxy;
        /**
         * @internal
         * @private
         */
        _armature: Armature;
        private _debugDrawer;
        /**
         * @internal
         * @private
         */
        constructor();
        /**
         * @internal
         * @private
         */
        _onClear(): void;
        /**
         * @internal
         * @private
         */
        _dispatchEvent(type: EventStringType, eventObject: EventObject): void;
        /**
         * @internal
         * @private
         */
        _debugDraw(isEnabled: boolean): void;
        /**
         * @inheritDoc
         */
        dispose(disposeProxy?: boolean): void;
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
     * @language zh_CN
     * Egret 工厂。
     * @version DragonBones 3.0
     */
    class EgretFactory extends BaseFactory {
        private static _factory;
        private static _eventManager;
        /**
         * @private
         */
        static _clock: WorldClock;
        private static _clockHandler(time);
        /**
         * @language zh_CN
         * 一个可以直接使用的全局工厂实例。
         * @version DragonBones 4.7
         */
        static readonly factory: EgretFactory;
        /**
         * @language zh_CN
         * 创建一个工厂。 (通常只需要一个全局工厂实例)
         * @param dataParser 龙骨数据解析器，如果不设置，则使用默认解析器。
         * @version DragonBones 3.0
         */
        constructor(dataParser?: DataParser);
        /**
         * @private
         */
        protected _generateTextureAtlasData(textureAtlasData: EgretTextureAtlasData, textureAtlas: egret.Texture): EgretTextureAtlasData;
        /**
         * @private
         */
        protected _generateArmature(dataPackage: BuildArmaturePackage): Armature;
        /**
         * @private
         */
        protected _generateSlot(dataPackage: BuildArmaturePackage, skinSlotData: SkinSlotData, armature: Armature): Slot;
        /**
         * @language zh_CN
         * 创建一个指定名称的骨架，并使用骨架的显示容器来更新骨架动画。
         * @param armatureName 骨架名称。
         * @param dragonBonesName 龙骨数据名称，如果未设置，将检索所有的龙骨数据，如果多个数据中包含同名的骨架数据，可能无法创建出准确的骨架。
         * @param skinName 皮肤名称，如果未设置，则使用默认皮肤。
         * @param textureAtlasName 贴图集数据名称，如果未设置，则使用龙骨数据。
         * @returns 骨架的显示容器。
         * @see dragonBones.EgretArmatureDisplay
         * @version DragonBones 4.5
         */
        buildArmatureDisplay(armatureName: string, dragonBonesName?: string, skinName?: string, textureAtlasName?: string): EgretArmatureDisplay;
        /**
         * @language zh_CN
         * 获取带有指定贴图的显示对象。
         * @param textureName 指定的贴图名称。
         * @param textureAtlasName 指定的贴图集数据名称，如果未设置，将检索所有的贴图集数据。
         * @version DragonBones 3.0
         */
        getTextureDisplay(textureName: string, textureAtlasName?: string): egret.Bitmap;
        /**
         * @language zh_CN
         * 获取全局声音事件管理器。
         * @version DragonBones 4.5
         */
        readonly soundEventManager: EgretArmatureDisplay;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addDragonBonesData()
         */
        addSkeletonData(dragonBonesData: DragonBonesData, dragonBonesName?: string): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getDragonBonesData()
         */
        getSkeletonData(dragonBonesName: string): DragonBonesData;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeSkeletonData()
         */
        removeSkeletonData(dragonBonesName: string): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#addTextureAtlasData()
         */
        addTextureAtlas(textureAtlasData: TextureAtlasData, dragonBonesName?: string): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#getTextureAtlasData()
         */
        getTextureAtlas(dragonBonesName: string): TextureAtlasData[];
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#removeTextureAtlasData()
         */
        removeTextureAtlas(dragonBonesName: string): void;
        /**
         * @deprecated
         * @see dragonBones.BaseFactory#buildArmature()
         */
        buildFastArmature(armatureName: string, dragonBonesName?: string, skinName?: string): FastArmature;
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
     * @language zh_CN
     * Egret 插槽。
     * @version DragonBones 3.0
     */
    class EgretSlot extends Slot {
        /**
         * @private
         */
        static toString(): string;
        /**
         * @language zh_CN
         * 是否更新显示对象的变换属性。
         * 为了更好的性能, 并不会更新 display 的变换属性 (x, y, rotation, scaleX, scaleX), 如果需要正确访问这些属性, 则需要设置为 true 。
         * @default false
         * @version DragonBones 3.0
         */
        transformUpdateEnabled: boolean;
        private _renderDisplay;
        private _colorFilter;
        /**
         * @internal
         * @private
         */
        constructor();
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
    function addMovieGroup(groupData: ArrayBuffer, textureAtlas: egret.Texture | egret.Texture[], groupName?: string): void;
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
    function buildMovie(movieName: string, groupName?: string): Movie;
    /**
     * @language zh_CN
     * 获取指定动画组内包含的所有动画名称。
     * @param groupName 动画组的名称。
     * @version DragonBones 4.7
     */
    function getMovieNames(groupName: string): string[];
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
        private _timeStamp;
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
        play(clipName?: string, playTimes?: number): void;
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
         * @version DragonBones 4.7
         */
        gotoAndPlay(clipName: string, time: number, playTimes?: number): void;
        /**
         * @language zh_CN
         * 将动画停止到指定时间。
         * @param clipName 动画剪辑的名称。
         * @param time 指定时间。（以秒为单位）
         * @version DragonBones 4.7
         */
        gotoAndStop(clipName: string, time: number): void;
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
        clock: WorldClock;
        /**
         * @language zh_CN
         * 由 Movie 自己来更新动画。
         * @param on 开启或关闭 Movie 自己对动画的更新。
         * @version DragonBones 4.7
         */
        advanceTimeBySelf(on: boolean): void;
    }
}
