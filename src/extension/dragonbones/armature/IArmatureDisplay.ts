namespace dragonBones {
    /**
     * @language zh_CN
     * 骨架显示容器和事件的接口。
     * @see dragonBones.Armature#display
     * @version DragonBones 4.5
     */
    export interface IArmatureDisplay extends IEventDispatcher {
        /**
         * @language zh_CN
         * 由显示容器来更新骨架和动画。
         * @param on 开启或关闭显示容器对骨架与动画的更新。
         * @version DragonBones 4.5
         */
        advanceTimeBySelf(on: boolean): void;
        /**
         * @language zh_CN
         * 释放显示对象和骨架。 (骨架会回收到内存池)
         * @version DragonBones 4.5
         */
        dispose(): void;
        /**
         * @language zh_CN
         * 获取使用这个显示容器的骨架。 (只读)
         * @see dragonBones.Armature
         * @version DragonBones 4.5
         */
        armature: Armature;
        /**
         * @language zh_CN
         * 获取使用骨架的动画控制器。 (只读)
         * @see dragonBones.Animation
         * @version DragonBones 4.5
         */
        animation: Animation;
    }
}