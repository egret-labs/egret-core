namespace dragonBones {
    /**
     * @private
     */
    export abstract class TimelineData<T extends FrameData<T>> extends BaseObject {
        /**
         * @private
         */
        public scale: number;
        /**
         * @private
         */
        public offset: number;
        /**
         * @private
         */
        public frames: Array<T> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            const self = this;

            self.scale = 1;
            self.offset = 0;

            if (self.frames.length) {
                let prevFrame: T = null;
                for (let i = 0, l = self.frames.length; i < l; ++i) { // Find key frame data.
                    const frame: T = self.frames[i];
                    if (prevFrame && frame != prevFrame) {
                        prevFrame.returnToPool();
                    }
                    prevFrame = frame;
                }

                self.frames.length = 0;
            }
        }
    }
    /**
     * @private
     */
    export class BoneTimelineData extends TimelineData<BoneFrameData> {
        public static cacheFrame(cacheFrames: Array<Matrix>, cacheFrameIndex: number, globalTransformMatrix: Matrix): Matrix {
            const cacheMatrix = cacheFrames[cacheFrameIndex] = new Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);

            return cacheMatrix;
        }
        public static toString(): string {
            return "[Class dragonBones.BoneTimelineData]";
        }


        public bone: BoneData = null;
        public originTransform: Transform = new Transform();
        public cachedFrames: Array<Matrix> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            const self = this;

            super._onClear();

            self.bone = null;
            self.originTransform.identity();

            if (self.cachedFrames.length) {
                self.cachedFrames.length = 0;
            }
        }

        public cacheFrames(cacheFrameCount: number): void {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        }
    }
    /**
     * @private
     */
    export class SlotTimelineData extends TimelineData<SlotFrameData> {
        public static cacheFrame(cacheFrames: Array<Matrix>, cacheFrameIndex: number, globalTransformMatrix: Matrix): Matrix {
            const cacheMatrix = cacheFrames[cacheFrameIndex] = new Matrix();
            cacheMatrix.copyFrom(globalTransformMatrix);

            return cacheMatrix;
        }
        public static toString(): string {
            return "[Class dragonBones.SlotTimelineData]";
        }

        public slot: SlotData = null;
        public cachedFrames: Array<Matrix> = [];

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            const self = this;

            super._onClear();

            self.slot = null;

            if (self.cachedFrames.length) {
                self.cachedFrames.length = 0;
            }
        }

        public cacheFrames(cacheFrameCount: number): void {
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;
        }
    }
    /**
     * @private
     */
    export class FFDTimelineData extends TimelineData<ExtensionFrameData> {
        public static toString(): string {
            return "[Class dragonBones.FFDTimelineData]";
        }

        public displayIndex: number = 0;
        public skin: SkinData = null;
        public slot: SlotDisplayDataSet = null;

        public constructor() {
            super();
        }
        /**
         * @inheritDoc
         */
        protected _onClear(): void {
            const self = this;

            super._onClear();

            self.displayIndex = 0;
            self.skin = null;
            self.slot = null;
        }
    }
}