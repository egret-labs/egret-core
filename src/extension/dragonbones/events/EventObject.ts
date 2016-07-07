namespace dragonBones {
    /**
     * @language zh_CN
     * 事件接口。
     * @version DragonBones 4.5
     */
    export interface IEventDispatcher {
        /**
         * @private
         */
        _onClear(): void;
        /**
         * @private
         */
        _dispatchEvent(eventObject: EventObject): void;
        /**
         * @language zh_CN
         * 是否包含指定类型的事件。
         * @param type 事件类型。
         * @return  [true: 包含, false: 不包含]
         * @version DragonBones 4.5
         */
        hasEvent(type: string): boolean;
        /**
         * @language zh_CN
         * 添加事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         */
        addEvent(type: string, listener: Function, target: any): void;
        /**
         * @language zh_CN
         * 移除事件。
         * @param type 事件类型。
         * @param listener 事件回调。
         * @version DragonBones 4.5
         */
        removeEvent(type: string, listener: Function, target: any): void;
    }
    /**
     * @language zh_CN
     * 事件数据。
     * @version DragonBones 4.5
     */
    export class EventObject extends BaseObject {
        /**
         * @language zh_CN
         * 动画开始。
         * @version DragonBones 4.5
         */
        public static START: string = "start";
        /**
         * @language zh_CN
         * 动画循环播放一次完成。
         * @version DragonBones 4.5
         */
        public static LOOP_COMPLETE: string = "loopComplete";
        /**
         * @language zh_CN
         * 动画播放完成。
         * @version DragonBones 4.5
         */
        public static COMPLETE: string = "complete";
        /**
         * @language zh_CN
         * 动画淡入开始。
         * @version DragonBones 4.5
         */
        public static FADE_IN: string = "fadeIn";
        /**
         * @language zh_CN
         * 动画淡入完成。
         * @version DragonBones 4.5
         */
        public static FADE_IN_COMPLETE: string = "fadeInComplete";
        /**
         * @language zh_CN
         * 动画淡出开始。
         * @version DragonBones 4.5
         */
        public static FADE_OUT: string = "fadeOut";
        /**
         * @language zh_CN
         * 动画淡出完成。
         * @version DragonBones 4.5
         */
        public static FADE_OUT_COMPLETE: string = "fadeOutComplete";
        /**
         * @language zh_CN
         * 动画帧事件。
         * @version DragonBones 4.5
         */
        public static FRAME_EVENT: string = "frameEvent";
        /**
         * @language zh_CN
         * 动画声音事件。
         * @version DragonBones 4.5
         */
        public static SOUND_EVENT: string = "soundEvent";
        /**
         * @private
         */
        public static toString(): string {
            return "[Class dragonBones.EventObject]";
        }

        /**
         * @language zh_CN
         * 事件类型。
         * @version DragonBones 4.5
         */
        public type: string;
        /**
         * @language zh_CN
         * 事件名称。 (帧标签的名称或声音的名称)
         * @version DragonBones 4.5
         */
        public name: string;
        /**
         * @language zh_CN
         * 扩展的数据
         * @version DragonBones 4.5
         */
        public data: any;
        /**
         * @language zh_CN
         * 发出事件的骨架
         * @version DragonBones 4.5
         */
        public armature: Armature;
        /**
         * @language zh_CN
         * 发出事件的骨骼
         * @version DragonBones 4.5
         */
        public bone: Bone;
        /**
         * @language zh_CN
         * 发出事件的插槽
         * @version DragonBones 4.5
         */
        public slot: Slot;
        /**
         * @language zh_CN
         * 发出事件的动画状态
         * @version DragonBones 4.5
         */
        public animationState: AnimationState;
        /**
         * @language zh_CN
         * 用户数据
         * @version DragonBones 4.5
         */
        public userData: any;
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
            this.type = null;
            this.name = null;
            this.data = null;
            this.armature = null;
            this.bone = null;
            this.slot = null;
            this.animationState = null;
            this.userData = null;
        }
    }
}