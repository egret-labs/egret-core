namespace dragonBones {
    /**
     * @private
     */
    export class ActionData extends BaseObject {
        public static toString(): string {
            return "[Class dragonBones.ActionData]";
        }

        public type: ActionType;
        public data: Array<any>;
        public bone: BoneData;
        public slot: SlotData;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            this.type = ActionType.Play;
            this.data = null;
            this.bone = null;
            this.slot = null;
        }
    }
    /**
     * @private
     */
    export class EventData extends BaseObject {
        public static toString(): string {
            return "[Class dragonBones.EventData]";
        }

        public type: EventType;
        public name: string;
        public data: any;
        public bone: BoneData;
        public slot: SlotData;

        public constructor() {
            super();
        }

        protected _onClear(): void {
            this.type = EventType.Frame;
            this.name = null;
            this.data = null;
            this.bone = null;
            this.slot = null;
        }
    }
    /**
     * @private
     */
    export abstract class FrameData<T> extends BaseObject {
        public position: number;
        public duration: number;
        public prev: T;
        public next: T;

        public actions: Array<ActionData> = [];
        public events: Array<EventData> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            this.position = 0;
            this.duration = 0;
            this.prev = null;
            this.next = null;

            if (this.actions.length) {
                for (let i = 0, l = this.actions.length; i < l; ++i) {
                    this.actions[i].returnToPool();
                }

                this.actions.length = 0;
            }

            if (this.events.length) {
                for (let i = 0, l = this.events.length; i < l; ++i) {
                    this.events[i].returnToPool();
                }

                this.events.length = 0;
            }
        }
    }
    /**
     * @private
     */
    export abstract class TweenFrameData<T> extends FrameData<T> {
        public static samplingCurve(curve: Array<number>, frameCount: number): Array<number> {
            if (curve.length == 0 || frameCount == 0) {
                return null;
            }

            const samplingTimes = frameCount + 2;
            const samplingStep = 1 / samplingTimes;
            const sampling = new Array<number>((samplingTimes - 1) * 2);

            //
            curve.unshift(0, 0);
            curve.push(1, 1);

            let stepIndex = 0;
            for (let i = 0; i < samplingTimes - 1; ++i) {
                const step = samplingStep * (i + 1);
                while (curve[stepIndex + 6] < step) // stepIndex + 3 * 2
                {
                    stepIndex += 6; // stepIndex += 3 * 2
                }

                const x1 = curve[stepIndex];
                const x4 = curve[stepIndex + 6];

                const t = (step - x1) / (x4 - x1);
                const l_t = 1 - t;

                const powA = l_t * l_t;
                const powB = t * t;

                const kA = l_t * powA;
                const kB = 3 * t * powA;
                const kC = 3 * l_t * powB;
                const kD = t * powB;

                sampling[i * 2] = kA * x1 + kB * curve[stepIndex + 2] + kC * curve[stepIndex + 4] + kD * x4;
                sampling[i * 2 + 1] = kA * curve[stepIndex + 1] + kB * curve[stepIndex + 3] + kC * curve[stepIndex + 5] + kD * curve[stepIndex + 7];
            }

            return sampling;
        }

        public tweenEasing: number;
        public curve: Array<number>;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.tweenEasing = 0;
            this.curve = null;
        }
    }

    /**
     * @private
     */
    export class AnimationFrameData extends FrameData<AnimationFrameData> {
        public static toString(): string {
            return "[Class dragonBones.AnimationFrameData]";
        }

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();
        }
    }
    /**
     * @private
     */
    export class BoneFrameData extends TweenFrameData<BoneFrameData> {
        public static toString(): string {
            return "[Class dragonBones.BoneFrameData]";
        }

        public tweenScale: boolean;
        public tweenRotate: number;
        public parent: BoneData;
        public transform: Transform = new Transform();

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.tweenScale = false;
            this.tweenRotate = 0;
            this.parent = null;
            this.transform.identity();
        }
    }
    /**
     * @private
     */
    export class SlotFrameData extends TweenFrameData<SlotFrameData> {
        public static DEFAULT_COLOR: ColorTransform = new ColorTransform();
        public static generateColor(): ColorTransform {
            return new ColorTransform();
        }
        public static toString(): string {
            return "[Class dragonBones.SlotFrameData]";
        }

        public displayIndex: number;
        public zOrder: number;
        public color: ColorTransform;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.displayIndex = 0;
            this.zOrder = 0;
            this.color = null;
        }
    }
    /**
     * @private
     */
    export class ExtensionFrameData extends TweenFrameData<ExtensionFrameData> {
        public static toString(): string {
            return "[Class dragonBones.ExtensionFrameData]";
        }

        public type: ExtensionType;
        public tweens: Array<number> = [];
        public keys: Array<number> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            super._onClear();

            this.type = ExtensionType.FFD;

            if (this.tweens.length) {
                this.tweens.length = 0;
            }

            if (this.keys.length) {
                this.keys.length = 0;
            }
        }
    }
}