namespace dragonBones {
    /**
     * @language zh_CN
     * 动画数据。
     * @version DragonBones 3.0
     */
    export class AnimationData extends TimelineData<AnimationFrameData> {
        /**
         * @private
         */
        public static toString(): string {
            return "[Class dragonBones.AnimationData]";
        }

        /**
         * @private
         */
        public hasAsynchronyTimeline: boolean;
        /**
         * @private
         */
        public hasBoneTimelineEvent: boolean;
        /**
         * @language zh_CN
         * 持续的帧数。
         * @version DragonBones 3.0
         */
        public frameCount: number;
        /**
         * @language zh_CN
         * 循环播放的次数。 [0: 无限循环播放, [1~N]: 循环播放 N 次]
         * @version DragonBones 3.0
         */
        public playTimes: number;
        /**
         * @language zh_CN
         * 开始的时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public position: number;
        /**
         * @language zh_CN
         * 持续的时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public duration: number;
        /**
         * @language zh_CN
         * 淡入混合的时间。 (以秒为单位)
         * @version DragonBones 3.0
         */
        public fadeInTime: number;
        /**
         * @private
         */
        public cacheTimeToFrameScale: number;
        /**
         * @language zh_CN
         * 数据名称。
         * @version DragonBones 3.0
         */
        public name: string;
        /**
         * @private
         */
        public animation: AnimationData;
        /**
         * @private
         */
        public boneTimelines: Map<BoneTimelineData> = {};
        /**
         * @private
         */
        public slotTimelines: Map<SlotTimelineData> = {};
        /**
         * @private
         */
        public ffdTimelines: Map<Map<Map<FFDTimelineData>>> = {}; // skin slot displayIndex
        /**
         * @private
         */
        public cachedFrames: Array<boolean> = [];
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

            this.hasAsynchronyTimeline = false;
            this.cacheTimeToFrameScale = 0;
            this.position = 0;
            this.duration = 0;
            this.playTimes = 0;
            this.fadeInTime = 0;
            this.name = null;
            this.animation = null;

            for (let i in this.boneTimelines) {
                this.boneTimelines[i].returnToPool();
                delete this.boneTimelines[i];
            }

            for (let i in this.slotTimelines) {
                this.slotTimelines[i].returnToPool();
                delete this.slotTimelines[i];
            }

            for (let i in this.ffdTimelines) {
                for (let j in this.ffdTimelines[i]) {
                    for (let k in this.ffdTimelines[i][j]) {
                        this.ffdTimelines[i][j][k].returnToPool();
                    }
                }

                delete this.ffdTimelines[i];
            }

            if (this.cachedFrames.length) {
                this.cachedFrames.length = 0;
            }
        }
        /**
         * @private
         */
        public cacheFrames(value: number): void {
            if (this.animation) {
                return;
            }

            const cacheFrameCount = Math.max(Math.floor(this.frameCount * this.scale * value), 1);

            this.cacheTimeToFrameScale = cacheFrameCount / (this.duration + 0.000001);
            this.cachedFrames.length = 0;
            this.cachedFrames.length = cacheFrameCount;

            for (let i in this.boneTimelines) {
                this.boneTimelines[i].cacheFrames(cacheFrameCount);
            }

            for (let i in this.slotTimelines) {
                this.slotTimelines[i].cacheFrames(cacheFrameCount);
            }
        }
        /**
         * @private
         */
        public addBoneTimeline(value: BoneTimelineData): void {
            if (value && value.bone && !this.boneTimelines[value.bone.name]) {
                this.boneTimelines[value.bone.name] = value;
            } else {
                throw new Error();
            }
        }
        /**
         * @private
         */
        public addSlotTimeline(value: SlotTimelineData): void {
            if (value && value.slot && !this.slotTimelines[value.slot.name]) {
                this.slotTimelines[value.slot.name] = value;
            } else {
                throw new Error();
            }
        }
        /**
         * @private
         */
        public addFFDTimeline(value: FFDTimelineData): void {
            if (value && value.skin && value.slot) {
                const skin = this.ffdTimelines[value.skin.name] = this.ffdTimelines[value.skin.name] || {};
                const slot = skin[value.slot.slot.name] = skin[value.slot.slot.name] || {};
                if (!slot[value.displayIndex]) {
                    slot[value.displayIndex] = value;
                } else {
                    throw new Error();
                }
            } else {
                throw new Error();
            }
        }
        /**
         * @private
         */
        public getBoneTimeline(name: string): BoneTimelineData {
            return this.boneTimelines[name];
        }
        /**
         * @private
         */
        public getSlotTimeline(name: string): SlotTimelineData {
            return this.slotTimelines[name];
        }
        /**
         * @private
         */
        public getFFDTimeline(skinName: string, slotName: string, displayIndex: number): FFDTimelineData {
            const skin = this.ffdTimelines[skinName];
            if (skin) {
                const slot = skin[slotName];
                if (slot) {
                    return slot[displayIndex];
                }
            }

            return null;
        }
    }
}