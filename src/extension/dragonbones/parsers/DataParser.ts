namespace dragonBones {
    /**
     * @private
     */
    export abstract class DataParser {
        protected static DATA_VERSION_2_3: string = "2.3";
        protected static DATA_VERSION_3_0: string = "3.0";
        protected static DATA_VERSION_4_0: string = "4.0";
        protected static DATA_VERSION: string = "4.5";

        protected static TEXTURE_ATLAS: string = "TextureAtlas";
        protected static SUB_TEXTURE: string = "SubTexture";
        protected static FORMAT: string = "format";;
        protected static IMAGE_PATH: string = "imagePath";
        protected static WIDTH: string = "width";
        protected static HEIGHT: string = "height";
        protected static ROTATED: string = "rotated";
        protected static FRAME_X: string = "frameX";
        protected static FRAME_Y: string = "frameY";
        protected static FRAME_WIDTH: string = "frameWidth";
        protected static FRAME_HEIGHT: string = "frameHeight";

        protected static DRADON_BONES: string = "dragonBones";
        protected static ARMATURE: string = "armature";
        protected static BONE: string = "bone";
        protected static IK: string = "ik";
        protected static SLOT: string = "slot";
        protected static SKIN: string = "skin";
        protected static DISPLAY: string = "display";
        protected static ANIMATION: string = "animation";
        protected static FFD: string = "ffd";
        protected static FRAME: string = "frame";

        protected static PIVOT: string = "pivot";
        protected static TRANSFORM: string = "transform";
        protected static COLOR: string = "color";
        protected static FILTER: string = "filter";

        protected static VERSION: string = "version";
        protected static IS_GLOBAL: string = "isGlobal";
        protected static FRAME_RATE: string = "frameRate";
        protected static TYPE: string = "type";
        protected static NAME: string = "name";
        protected static PARENT: string = "parent";
        protected static LENGTH: string = "length";
        protected static DATA: string = "data";
        protected static DISPLAY_INDEX: string = "displayIndex";
        protected static Z_ORDER: string = "z";
        protected static BLEND_MODE: string = "blendMode";
        protected static INHERIT_TRANSLATION: string = "inheritTranslation";
        protected static INHERIT_ROTATION: string = "inheritRotation";
        protected static INHERIT_SCALE: string = "inheritScale";
        protected static TARGET: string = "target";
        protected static BEND_POSITIVE: string = "bendPositive";
        protected static CHAIN: string = "chain";
        protected static WEIGHT: string = "weight";

        protected static FADE_IN_TIME: string = "fadeInTime";
        protected static PLAY_TIMES: string = "playTimes";
        protected static SCALE: string = "scale";
        protected static OFFSET: string = "offset";
        protected static POSITION: string = "position";
        protected static DURATION: string = "duration";
        protected static TWEEN_EASING: string = "tweenEasing";
        protected static TWEEN_ROTATE: string = "tweenRotate";
        protected static TWEEN_SCALE: string = "tweenScale";
        protected static CURVE: string = "curve";
        protected static EVENT: string = "event";
        protected static SOUND: string = "sound";
        protected static ACTION: string = "action";
        protected static ACTIONS: string = "actions";

        protected static X: string = "x";
        protected static Y: string = "y";
        protected static SKEW_X: string = "skX";
        protected static SKEW_Y: string = "skY";
        protected static SCALE_X: string = "scX";
        protected static SCALE_Y: string = "scY";

        protected static ALPHA_OFFSET: string = "aO";
        protected static RED_OFFSET: string = "rO";
        protected static GREEN_OFFSET: string = "gO";
        protected static BLUE_OFFSET: string = "bO";
        protected static ALPHA_MULTIPLIER: string = "aM";
        protected static RED_MULTIPLIER: string = "rM";
        protected static GREEN_MULTIPLIER: string = "gM";
        protected static BLUE_MULTIPLIER: string = "bM";

        protected static UVS: string = "uvs";
        protected static VERTICES: string = "vertices";
        protected static TRIANGLES: string = "triangles";
        protected static WEIGHTS: string = "weights";
        protected static SLOT_POSE: string = "slotPose";
        protected static BONE_POSE: string = "bonePose";

        protected static TWEEN: string = "tween";
        protected static KEY: string = "key";

        protected static COLOR_TRANSFORM: string = "colorTransform";
        protected static TIMELINE: string = "timeline";
        protected static PIVOT_X: string = "pX";
        protected static PIVOT_Y: string = "pY";
        protected static LOOP: string = "loop";
        protected static AUTO_TWEEN: string = "autoTween";
        protected static HIDE: string = "hide";

        protected static RECTANGLE: string = "rectangle";
        protected static ELLIPSE: string = "ellipse";

        protected static _getArmatureType(value: string): ArmatureType {
            switch (value.toLowerCase()) {
                case "stage":
                    return ArmatureType.Armature;

                case "armature":
                    return ArmatureType.Armature;

                case "movieClip":
                    return ArmatureType.MovieClip;

                default:
                    return ArmatureType.Armature;
            }
        }

        protected static _getDisplayType(value: string): DisplayType {
            switch (value.toLowerCase()) {
                case "image":
                    return DisplayType.Image;

                case "armature":
                    return DisplayType.Armature;

                case "mesh":
                    return DisplayType.Mesh;

                default:
                    return DisplayType.Image;
            }
        }

        protected static _getBlendMode(value: string): BlendMode {
            switch (value.toLowerCase()) {
                case "normal":
                    return BlendMode.Normal;

                case "add":
                    return BlendMode.Add;

                case "alpha":
                    return BlendMode.Alpha;

                case "darken":
                    return BlendMode.Darken;

                case "difference":
                    return BlendMode.Difference;

                case "erase":
                    return BlendMode.Erase;

                case "hardlight":
                    return BlendMode.HardLight;

                case "invert":
                    return BlendMode.Invert;

                case "layer":
                    return BlendMode.Layer;

                case "lighten":
                    return BlendMode.Lighten;

                case "multiply":
                    return BlendMode.Multiply;

                case "overlay":
                    return BlendMode.Overlay;

                case "screen":
                    return BlendMode.Screen;

                case "subtract":
                    return BlendMode.Subtract;

                default:
                    return BlendMode.Normal;
            }
        }

        protected static _getActionType(value: string): ActionType {
            switch (value.toLowerCase()) {
                case "play":
                    return ActionType.Play;

                case "stop":
                    return ActionType.Stop;

                case "gotoandplay":
                    return ActionType.GotoAndPlay;

                case "gotoandstop":
                    return ActionType.GotoAndStop;

                case "fadein":
                    return ActionType.FadeIn;

                case "fadeout":
                    return ActionType.FadeOut;

                default:
                    return ActionType.FadeIn;
            }
        }

        protected _data: DragonBonesData = null;
        protected _armature: ArmatureData = null;
        protected _skin: SkinData = null;
        protected _slotDisplayDataSet: SlotDisplayDataSet = null;
        protected _mesh: MeshData = null;
        protected _animation: AnimationData = null;
        protected _timeline: any = null;

        protected _isParentCooriinate: boolean = false;
        protected _isAutoTween: boolean = false;
        protected _animationTweenEasing: number = 0;
        protected _armatureScale: number = 1;
        protected _helpPoint: Point = new Point();
        protected _helpTransform: Transform = new Transform();
        protected _helpMatrix: Matrix = new Matrix();
        protected _rawBones: Array<BoneData> = [];

        public constructor() { }
        /**
         * @private
         */
        public abstract parseDragonBonesData(rawData: any, scale: number): DragonBonesData;
        /**
         * @private
         */
        public abstract parseTextureAtlasData(rawData: any, textureAtlasData: TextureAtlasData, scale: number): void;

        private _getTimelineFrameMatrix(animation: AnimationData, timeline: BoneTimelineData, position: number, transform: Transform): void {
            const frameIndex = Math.floor(position * animation.frameCount / animation.duration);
            if (timeline.frames.length == 1 || frameIndex >= timeline.frames.length) {
                transform.copyFrom(timeline.frames[0].transform);
            } else {
                const frame = timeline.frames[frameIndex];
                let tweenProgress = 0;

                if (frame.duration > 0 && frame.tweenEasing != DragonBones.NO_TWEEN) {
                    tweenProgress = (position - frame.position) / frame.duration;
                    if (frame.tweenEasing != 0) {
                        tweenProgress = TweenTimelineState._getEasingValue(tweenProgress, frame.tweenEasing);
                    }
                } else if (frame.curve) {
                    tweenProgress = (position - frame.position) / frame.duration;
                    tweenProgress = TweenTimelineState._getCurveEasingValue(tweenProgress, frame.curve);
                }

                transform.copyFrom(frame.next.transform);
                transform.minus(frame.transform);

                transform.x = frame.transform.x + transform.x * tweenProgress;
                transform.y = frame.transform.y + transform.y * tweenProgress;
                transform.skewX = frame.transform.skewX + transform.skewX * tweenProgress;
                transform.skewY = frame.transform.skewY + transform.skewY * tweenProgress;
                transform.scaleX = frame.transform.scaleX + transform.scaleX * tweenProgress;
                transform.scaleY = frame.transform.scaleY + transform.scaleY * tweenProgress;
                transform.add(timeline.originTransform);
            }
        }

        protected _globalToLocal(armature: ArmatureData): void {
            const bones = armature.sortedBones.reverse();
            for (let i = 0, l = bones.length; i < l; ++i) {
                const bone = bones[i];

                if (bone.parent) {
                    bone.parent.transform.toMatrix(this._helpMatrix);
                    this._helpMatrix.transformPoint(bone.transform.x, bone.transform.y, bone.transform);
                    bone.transform.rotation += bone.transform.rotation - bone.parent.transform.rotation;
                }
            }

            for (let i in armature.animations) {
                const animation = armature.animations[i];
                const timelines = animation.boneTimelines;

                for (let i in timelines) {
                    const timeline = timelines[i];

                    if (timeline.bone.parent) {
                        const parentTimeline = animation.getBoneTimeline(timeline.bone.parent.name);

                        for (let i = 0, l = timeline.frames.length; i < l; ++i) {
                            const frame = timeline.frames[i];
                            this._getTimelineFrameMatrix(animation, parentTimeline, frame.position, this._helpTransform);
                            frame.transform.add(timeline.originTransform);
                            this._helpTransform.toMatrix(this._helpMatrix);
                            this._helpMatrix.transformPoint(frame.transform.x, frame.transform.y, frame.transform);
                            frame.transform.rotation += frame.transform.rotation - this._helpTransform.rotation;
                        }
                    }

                    this._helpTransform.copyFrom(timeline.originTransform);

                    for (let i = 0, l = timeline.frames.length; i < l; ++i) {
                        const frame = timeline.frames[i];
                        frame.transform.add(this._helpTransform);
                        frame.transform.minus(timeline.bone.transform);

                        if (i == 0) {
                            timeline.originTransform.copyFrom(frame.transform);
                            frame.transform.identity();
                        } else {
                            frame.transform.minus(timeline.originTransform);
                        }
                    }
                }
            }
        }
        /**
         * 不推荐使用
         * @see #dragonBones.BaseFactory.parseDragonBonesData()
         */
        public static parseDragonBonesData(rawData: any): DragonBonesData {
            return ObjectDataParser.getInstance().parseDragonBonesData(rawData);
        }
        /**
         * 不推荐使用
         * @see #dragonBones.BaseFactory.parsetTextureAtlasData()
         */
        public static parseTextureAtlasData(rawData: any, scale: number = 1): any {
            let textureAtlasData: any = {};
            let subTextureFrame: Rectangle = null;

            let subTextureList: any = rawData[DataParser.SUB_TEXTURE];
            for (let i = 0, len = subTextureList.length; i < len; i++) {
                let subTextureObject = subTextureList[i];
                let subTextureName = subTextureObject[DataParser.NAME];
                let subTextureRegion = new Rectangle();
                subTextureRegion.x = subTextureObject[DataParser.X] / scale;
                subTextureRegion.y = subTextureObject[DataParser.Y] / scale;
                subTextureRegion.width = subTextureObject[DataParser.WIDTH] / scale;
                subTextureRegion.height = subTextureObject[DataParser.HEIGHT] / scale;

                if (DataParser.FRAME_WIDTH in subTextureObject) {
                    subTextureFrame = new Rectangle();
                    subTextureFrame.x = subTextureObject[DataParser.FRAME_X] / scale;
                    subTextureFrame.y = subTextureObject[DataParser.FRAME_Y] / scale;
                    subTextureFrame.width = subTextureObject[DataParser.FRAME_WIDTH] / scale;
                    subTextureFrame.height = subTextureObject[DataParser.FRAME_HEIGHT] / scale;
                } else {
                    subTextureFrame = null;
                }

                textureAtlasData[subTextureName] = { region: subTextureRegion, frame: subTextureFrame, rotated: false };
            }

            return textureAtlasData;
        }
    }
}