namespace dragonBones {
    /**
     * @private
     */
    export const enum ArmatureType {
        Armature = 0,
        MovieClip = 1,
        Stage = 2
    }
    /**
     * @private
     */
    export const enum DisplayType {
        Image = 0,
        Armature = 1,
        Mesh = 2
    }
    /**
     * @private
     */
    export const enum ExtensionType {
        FFD = 0,
        AdjustColor = 10,
        BevelFilter = 11,
        BlurFilter = 12,
        DropShadowFilter = 13,
        GlowFilter = 14,
        GradientBevelFilter = 15,
        GradientGlowFilter = 16
    }
    /**
     * @private
     */
    export const enum EventType {
        Frame = 0,
        Sound = 1
    }
    /**
     * @private
     */
    export const enum ActionType {
        Play = 0,
        Stop = 1,
        GotoAndPlay = 2,
        GotoAndStop = 3,
        FadeIn = 4,
        FadeOut = 5
    }
    /**
     * @private
     */
    export const enum BlendMode {
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
        Subtract = 13
    }
    /**
     * @private
     */
    export interface Map<T> {
        [key: string]: T
    }
    /**
     * DragonBones
     */
    export class DragonBones {
        public static PI_D: number = Math.PI * 2;
        public static PI_H: number = Math.PI / 2;
        public static PI_Q: number = Math.PI / 4;
        public static ANGLE_TO_RADIAN: number = Math.PI / 180;
        public static RADIAN_TO_ANGLE: number = 180 / Math.PI;
        public static SECOND_TO_MILLISECOND: number = 1000;
        public static NO_TWEEN: number = 100;

        public static VERSION: string = "4.5.10";

        public constructor() { }
    }
}