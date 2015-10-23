declare module dragonBones {
    /**
     * @class dragonBones.DragonBones
     * @classdesc
     * DragonBones
     */
    class DragonBones {
        /**
         * DragonBones当前数据格式版本
         */
        static DATA_VERSION: string;
        /**
         *
         */
        static PARENT_COORDINATE_DATA_VERSION: string;
        static VERSION: string;
        constructor();
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.Animation
     * @classdesc
     * Animation实例隶属于Armature,用于控制Armature的动画播放。
     * @see dragonBones.Bone
     * @see dragonBones.Armature
     * @see dragonBones.AnimationState
     * @see dragonBones.AnimationData
     *
     * @example
       <pre>
       //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");

        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        armatureDisplay.x = 200;
        armatureDisplay.y = 500;
        //把它添加到舞台上
        this.addChild(armatureDisplay);


        
        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName:string = armature.animation.animationList[0];

        var animation:dragonBones.Animation = armature.animation;

        //gotoAndPlay的用法：动画播放，播放一遍
        animation.gotoAndPlay(curAnimationName,0,-1,1);

        //gotoAndStop的用法：
        //curAnimationName = armature.animation.animationList[1];
        //动画停在第二个动画的第0.2秒的位置
        //animation.gotoAndStop(curAnimationName,0.2);
        //动画停在第二个动画的一半的位置，如果第三个参数大于0，会忽略第二个参数
        //animation.gotoAndStop(curAnimationName,0, 0.5);
        //继续播放
        //animation.play();
        //暂停播放
        //animation.stop();

        //动画融合
        //animation.gotoAndPlay(curAnimationName,0,-1,0,0,"group1");

        //var animationState:dragonBones.AnimationState = armature.animation.getState(curAnimationName);
        //animationState.addBoneMask("neck",true);
        //播放第二个动画， 放到group "Squat"里
        //curAnimationName = armature.animation.animationList[1];
        //armature.animation.gotoAndPlay(curAnimationName,0,-1,0,0,"group2",dragonBones.Animation.SAME_GROUP);
        //animationState = armature.animation.getState(curAnimationName);
        //animationState.addBoneMask("hip",true);//“hip”是骨架的根骨骼的名字
        //animationState.removeBoneMask("neck",true);
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class Animation {
        static NONE: string;
        static SAME_LAYER: string;
        static SAME_GROUP: string;
        static SAME_LAYER_AND_GROUP: string;
        static ALL: string;
        /**
         * 标记是否开启自动补间。
         * 设置为 true时，Animation会根据动画数据的内容，在关键帧之间自动补间。设置为false时，所有动画均不补间
         * 默认值：true。
         * @member {boolean} dragonBones.Animation#tweenEnabled
         */
        tweenEnabled: boolean;
        private _armature;
        private _animationStateList;
        private _animationDataList;
        private _animationList;
        private _isPlaying;
        private _timeScale;
        /** @private */
        _lastAnimationState: AnimationState;
        /** @private */
        _isFading: boolean;
        /** @private */
        _animationStateCount: number;
        /**
         * 创建一个新的Animation实例并赋给传入的Armature实例
         * @param armature {Armature} 骨架实例
         */
        constructor(armature: Armature);
        /**
         * 回收Animation实例用到的所有资源
         */
        dispose(): void;
        _resetAnimationStateList(): void;
        /**
         * 开始播放指定名称的动画。
         * 要播放的动画将经过指定时间的淡入过程，然后开始播放，同时之前播放的动画会经过相同时间的淡出过程。
         * @param animationName {string} 指定播放动画的名称.
         * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
         * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         * @param playTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
         * @param layer {number} 动画所处的层
         * @param group {string} 动画所处的组
         * @param fadeOutMode {string} 动画淡出模式 (none, sameLayer, sameGroup, sameLayerAndGroup, all).默认值：sameLayerAndGroup
         * @param pauseFadeOut {boolean} 动画淡出时暂停播放
         * @param pauseFadeIn {boolean} 动画淡入时暂停播放
         * @returns {AnimationState} 动画播放状态实例
         * @see dragonBones.AnimationState.
         */
        gotoAndPlay(animationName: string, fadeInTime?: number, duration?: number, playTimes?: number, layer?: number, group?: string, fadeOutMode?: string, pauseFadeOut?: boolean, pauseFadeIn?: boolean): AnimationState;
        /**
         * 播放指定名称的动画并停止于某个时间点
         * @param animationName {string} 指定播放的动画名称.
         * @param time {number} 动画停止的绝对时间
         * @param normalizedTime {number} 动画停止的相对动画总时间的系数，这个参数和time参数是互斥的（例如 0.2：动画停止总时间的20%位置） 默认值：-1 意味着使用绝对时间。
         * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：0
         * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         * @param layer {string} 动画所处的层
         * @param group {string} 动画所处的组
         * @param fadeOutMode {string} 动画淡出模式 (none, sameLayer, sameGroup, sameLayerAndGroup, all).默认值：sameLayerAndGroup
         * @returns {AnimationState} 动画播放状态实例
         * @see dragonBones.AnimationState.
         */
        gotoAndStop(animationName: string, time: number, normalizedTime?: number, fadeInTime?: number, duration?: number, layer?: number, group?: string, fadeOutMode?: string): AnimationState;
        /**
         * 从当前位置继续播放动画
         */
        play(): void;
        /**
         * 暂停动画播放
         */
        stop(): void;
        /**
         * 获得指定名称的 AnimationState 实例.
         * @returns {AnimationState} AnimationState 实例.
         * @see dragonBones..AnimationState.
         */
        getState(name: string, layer?: number): AnimationState;
        /**
         * 检查是否包含指定名称的动画.
         * @returns {boolean}.
         */
        hasAnimation(animationName: string): boolean;
        /** @private */
        _advanceTime(passedTime: number): void;
        /** @private */
        _updateAnimationStates(): void;
        private addState(animationState);
        private removeState(animationState);
        /**
        * 不推荐的API.推荐使用 animationList.
        */
        movementList: Array<string>;
        /**
        * 不推荐的API.推荐使用 lastAnimationName.
        */
        movementID: string;
        /**
         * 最近播放的 AnimationState 实例。
         * @member {AnimationState} dragonBones.Animation#lastAnimationState
         * @see dragonBones.AnimationState
         */
        lastAnimationState: AnimationState;
        /**
         * 最近播放的动画名称.
         * @member {string} dragonBones.Animation#lastAnimationName
         */
        lastAnimationName: string;
        /**
         * 所有动画名称列表.
         * @member {string[]} dragonBones.Animation#animationList
         */
        animationList: Array<string>;
        /**
         * 是否正在播放
         * @member {boolean} dragonBones.Animation#isPlaying
         */
        isPlaying: boolean;
        /**
         * 最近播放的动画是否播放完成.
         * @member {boolean} dragonBones.Animation#isComplete
         */
        isComplete: boolean;
        /**
         * 时间缩放倍数
         * @member {number} dragonBones.Animation#timeScale
         */
        timeScale: number;
        /**
         * 包含的所有动画数据列表
         * @member {AnimationData[]} dragonBones.Animation#animationDataList
         * @see dragonBones.AnimationData.
         */
        animationDataList: Array<AnimationData>;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.AnimationState
     * @classdesc
     * AnimationState 实例由 Animation 实例播放动画时产生， 可以对单个动画的播放进行最细致的调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     *
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        armatureDisplay.x = 200;
        armatureDisplay.y = 500;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
      
        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName:string = armature.animation.animationList[0];
        //播放这个动画
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //获取animationState可以对动画进行更多控制；
        var animationState:dragonBones.AnimationState = armature.animation.getState(curAnimationName);
      
        //下面的代码实现人物的脖子和头动，但是其他部位不动
        animationState.addBoneMask("neck",true);
        //下面的代码实现人物的身体动，但是脖子和头不动
        //animationState.addBoneMask("hip",true);//“hip”是骨架的根骨骼的名字
        //animationState.removeBoneMask("neck",true);
        //下面的代码实现动画幅度减小的效果
        //animationState.weight = 0.5;
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
           dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class AnimationState {
        private static _pool;
        /** @private */
        static _borrowObject(): AnimationState;
        /** @private */
        static _returnObject(animationState: AnimationState): void;
        /** @private */
        static _clear(): void;
        /**
         * 标记是否控制display的切换。
         * 设置为 true时，该 AnimationState 会控制display的切换
         * 默认值：true。
         * @member {boolean} dragonBones.AnimationState#displayControl
         * @see dragonBones.Bone#displayController
         * @see dragonBones.Bone#display
         */
        displayControl: boolean;
        additiveBlending: boolean;
        /**
         * 标记动画播放完毕时是否自动淡出。
         * 默认值：true。
         * @member {boolean} dragonBones.AnimationState#autoFadeOut
         */
        autoFadeOut: boolean;
        /**
         * 淡出时间。
         * @member {number} dragonBones.AnimationState#fadeOutTime
         */
        fadeOutTime: number;
        /**
         * 动画权重(0~1)。
         * 默认值：1。
         * @member {number} dragonBones.AnimationState#weight
         */
        weight: number;
        /**
         * 是否自动补间。
         * @member {boolean} dragonBones.AnimationState#autoTween
         */
        autoTween: boolean;
        /**
         * 动画循环播放时，从最后一帧到第一帧是否自动补间。
         * 默认值：true
         * @member {boolean} dragonBones.AnimationState#lastFrameAutoTween
         */
        lastFrameAutoTween: boolean;
        /** @private */
        _layer: number;
        /** @private */
        _group: string;
        private _armature;
        private _timelineStateList;
        private _slotTimelineStateList;
        private _boneMasks;
        private _isPlaying;
        private _time;
        private _currentFrameIndex;
        private _currentFramePosition;
        private _currentFrameDuration;
        private _pausePlayheadInFade;
        private _isFadeOut;
        private _fadeTotalWeight;
        private _fadeWeight;
        private _fadeCurrentTime;
        private _fadeBeginTime;
        private _name;
        private _clip;
        private _isComplete;
        private _currentPlayTimes;
        private _totalTime;
        private _currentTime;
        private _lastTime;
        private _fadeState;
        private _fadeTotalTime;
        private _timeScale;
        private _playTimes;
        constructor();
        private clear();
        _resetTimelineStateList(): void;
        /**
         * 检查指定名称的骨头是否在遮罩中。只有在遮罩中的骨头动画才会被播放
         * @param boneName {string} dragonBones.AnimationState#containsBoneMask
         * @returns {boolean}
         */
        containsBoneMask(boneName: string): boolean;
        /**
         * 将一个骨头加入遮罩。只有加入遮罩的骨头的动画才会被播放，如果没有骨头加入遮罩，则所有骨头的动画都会播放。通过这个API可以实现只播放角色的一部分.
         * @param boneName {string} 骨头名称.
         * @param ifInvolveChildBones {boolean} 是否影响子骨头。默认值：true.
         * @returns {AnimationState} 动画播放状态实例
         */
        addBoneMask(boneName: string, ifInvolveChildBones?: boolean): AnimationState;
        /**
         * 将一个指定名称的骨头从遮罩中移除.
         * @param boneName {string} 骨头名称.
         * @param ifInvolveChildBones {boolean} 是否影响子骨头。默认值：true.
         * @returns {AnimationState} 动画播放状态实例
         */
        removeBoneMask(boneName: string, ifInvolveChildBones?: boolean): AnimationState;
        /**
         * 清空骨头遮罩.
         * @returns {AnimationState} 动画播放状态实例
         */
        removeAllMixingTransform(): AnimationState;
        private addBoneToBoneMask(boneName);
        private removeBoneFromBoneMask(boneName);
        /**
         * @private
         * Update timeline state based on mixing transforms and clip.
         */
        _updateTimelineStates(): void;
        private addTimelineState(timelineName);
        private removeTimelineState(timelineState);
        private addSlotTimelineState(timelineName);
        private removeSlotTimelineState(timelineState);
        /**
         * 播放当前动画。如果动画已经播放完毕, 将不会继续播放.
         * @returns {AnimationState} 动画播放状态实例
         */
        play(): AnimationState;
        /**
         * 暂停当前动画的播放。
         * @returns {AnimationState} 动画播放状态实例
         */
        stop(): AnimationState;
        /** @private */
        _fadeIn(armature: Armature, clip: AnimationData, fadeTotalTime: number, timeScale: number, playTimes: number, pausePlayhead: boolean): AnimationState;
        /**
         * 淡出当前动画
         * @param fadeTotalTime {number} 淡出时间
         * @param pausePlayhead {boolean} 淡出时动画是否暂停。
         */
        fadeOut(fadeTotalTime: number, pausePlayhead: boolean): AnimationState;
        /** @private */
        _advanceTime(passedTime: number): boolean;
        private advanceFadeTime(passedTime);
        private advanceTimelinesTime(passedTime);
        private updateMainTimeline(isThisComplete);
        private hideBones();
        setAdditiveBlending(value: boolean): AnimationState;
        setAutoFadeOut(value: boolean, fadeOutTime?: number): AnimationState;
        setWeight(value: number): AnimationState;
        setFrameTween(autoTween: boolean, lastFrameAutoTween: boolean): AnimationState;
        setCurrentTime(value: number): AnimationState;
        setTimeScale(value: number): AnimationState;
        setPlayTimes(value?: number): AnimationState;
        /**
         * 动画的名字
         * @member {string} dragonBones.AnimationState#name
         */
        name: string;
        /**
         * 动画所在的层
         * @member {number} dragonBones.AnimationState#layer
         */
        layer: number;
        /**
         * 动画所在的组
         * @member {string} dragonBones.AnimationState#group
         */
        group: string;
        /**
         * 动画包含的动画数据
         * @member {AnimationData} dragonBones.AnimationState#clip
         */
        clip: AnimationData;
        /**
         * 是否播放完成
         * @member {boolean} dragonBones.AnimationState#isComplete
         */
        isComplete: boolean;
        /**
         * 是否正在播放
         * @member {boolean} dragonBones.AnimationState#isPlaying
         */
        isPlaying: boolean;
        /**
         * 当前播放次数
         * @member {number} dragonBones.AnimationState#currentPlayTimes
         */
        currentPlayTimes: number;
        /**
         * 动画总时长（单位：秒）
         * @member {number} dragonBones.AnimationState#totalTime
         */
        totalTime: number;
        /**
         * 动画当前播放时间（单位：秒）
         * @member {number} dragonBones.AnimationState#currentTime
         */
        currentTime: number;
        fadeWeight: number;
        fadeState: number;
        fadeTotalTime: number;
        /**
         * 时间缩放系数。用于调节动画播放速度
         * @member {number} dragonBones.AnimationState#timeScale
         */
        timeScale: number;
        /**
         * 播放次数 (0:循环播放， >0:播放次数)
         * @member {number} dragonBones.AnimationState#playTimes
         */
        playTimes: number;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.IAnimatable
     * @classdesc
     * 可播放动画组件接口，Armature 和 WordClock都实现了该接口
     * 实现该接口的实例可以加到WorldClock时钟中统一由时钟控制动画的播放
     * @see dragonBones.WorldClock
     * @see dragonBones.Armature
     */
    interface IAnimatable {
        /**
         * 使用这个方法更新动画状态。一般来说，这个方法需要在 ENTERFRAME 事件的响应函数中被调用
         * @param passedTime 动画向前播放的时间（单位：秒）
         */
        advanceTime(passedTime: number): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.IAnimationState
     * @classdesc
     * 动画状态接口，目前只在动画缓存管理器中生成动画数据时使用
     * @see dragonBones.AnimationCacheManager
     */
    interface IAnimationState {
        progress: number;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.SlotTimelineState
     * @classdesc
     * SlotTimelineState 负责计算 Slot 的时间轴动画。
     * SlotTimelineState 实例隶属于 AnimationState. AnimationState在创建时会为每个包含动作的 Slot生成一个 SlotTimelineState 实例.
     * @see dragonBones.Animation
     * @see dragonBones.AnimationState
     * @see dragonBones.Slot
     */
    class SlotTimelineState {
        private static HALF_PI;
        private static DOUBLE_PI;
        private static _pool;
        /** @private */
        static _borrowObject(): SlotTimelineState;
        /** @private */
        static _returnObject(timeline: SlotTimelineState): void;
        /** @private */
        static _clear(): void;
        name: string;
        /** @private */
        _weight: number;
        /** @private */
        _blendEnabled: boolean;
        /** @private */
        _isComplete: boolean;
        /** @private */
        _animationState: AnimationState;
        private _totalTime;
        private _currentTime;
        private _currentFrameIndex;
        private _currentFramePosition;
        private _currentFrameDuration;
        private _tweenEasing;
        private _tweenCurve;
        private _tweenColor;
        private _rawAnimationScale;
        private _updateMode;
        private _armature;
        private _animation;
        private _slot;
        private _timelineData;
        private _durationColor;
        constructor();
        private clear();
        /** @private */
        _fadeIn(slot: Slot, animationState: AnimationState, timelineData: SlotTimeline): void;
        /** @private */
        _fadeOut(): void;
        /** @private */
        _update(progress: number): void;
        private updateMultipleFrame(progress);
        private updateToNextFrame(currentPlayTimes?);
        private updateTween();
        private updateSingleFrame();
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.TimelineState
     * @classdesc
     * TimelineState 负责计算 Bone 的时间轴动画。
     * TimelineState 实例隶属于 AnimationState. AnimationState在创建时会为每个包含动作的 Bone生成一个 TimelineState 实例.
     * @see dragonBones.Animation
     * @see dragonBones.AnimationState
     * @see dragonBones.Bone
     */
    class TimelineState {
        private static HALF_PI;
        private static DOUBLE_PI;
        private static _pool;
        /** @private */
        static _borrowObject(): TimelineState;
        /** @private */
        static _returnObject(timeline: TimelineState): void;
        /** @private */
        static _clear(): void;
        name: string;
        /** @private */
        _weight: number;
        /** @private */
        _transform: DBTransform;
        /** @private */
        _pivot: Point;
        /** @private */
        _isComplete: boolean;
        /** @private */
        _animationState: AnimationState;
        private _totalTime;
        private _currentTime;
        private _lastTime;
        private _currentFrameIndex;
        private _currentFramePosition;
        private _currentFrameDuration;
        private _tweenEasing;
        private _tweenTransform;
        private _tweenScale;
        private _tweenColor;
        private _tweenCurve;
        private _rawAnimationScale;
        private _updateMode;
        private _armature;
        private _animation;
        private _bone;
        private _timelineData;
        private _originTransform;
        private _originPivot;
        private _durationTransform;
        private _durationPivot;
        private _durationColor;
        constructor();
        private clear();
        /** @private */
        _fadeIn(bone: Bone, animationState: AnimationState, timelineData: TransformTimeline): void;
        /** @private */
        _fadeOut(): void;
        /** @private */
        _update(progress: number): void;
        private updateMultipleFrame(progress);
        private updateToNextFrame(currentPlayTimes?);
        private updateTween();
        private updateSingleFrame();
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.WorldClock
     * @classdesc
     * WorldClock 提供时钟的支持，为控制每个加入时钟的 IAnimatable 对象正确的播放动画。
     * 一般来说，每当 Armature 被创建出来后，只需要将之加入 WorldClock,之后只需要控制 WorldClock 的前进，就可以实现所有 Armature 的动画前进了
     * @see dragonBones.IAnimatable
     * @see dragonBones.Armature
     */
    class WorldClock implements IAnimatable {
        /**
         * 可以直接使用的全局静态时钟实例.
         * @type dragonBones.WorldClock
         */
        static clock: WorldClock;
        private _animatableList;
        private _time;
        time: number;
        private _timeScale;
        /**
         * 时间缩放系数。用于实现动画的变速播放
         * @member {number} dragonBones.WorldClock#timeScale
         */
        timeScale: number;
        /**
         * 创建一个新的 WorldClock 实例。
         * 一般来说，不需要单独创建 WorldClock 的实例，可以直接使用 WorldClock.clock 静态实例就可以了。
         * @param time {number} 开始时间
         * @param timeScale {number} 时间缩放系数
         */
        constructor(time?: number, timeScale?: number);
        /**
         * 检查是否包含指定的 IAnimatable 实例
         * @param animatable {IAnimatable} IAnimatable 实例
         * @returns {boolean}
         */
        contains(animatable: IAnimatable): boolean;
        /**
         * 将一个 IAnimatable 实例加入到时钟
         * @param animatable {IAnimatable} IAnimatable 实例
         */
        add(animatable: IAnimatable): void;
        /**
         * 将一个 IAnimatable 实例从时钟中移除
         * @param animatable {IAnimatable} IAnimatable 实例
         */
        remove(animatable: IAnimatable): void;
        /**
         * 从时钟中移除所有的 IAnimatable 实例.
         */
        clear(): void;
        /**
         * 更新所有包含的 IAnimatable 实例，将他们的动画向前播放指定的时间。一般来说，这个方法需要在 ENTERFRAME 事件的响应函数中被调用
         * @param passedTime {number} 前进的时间，默认值为-1，DragonBones会自动为你计算当前帧与上一帧的时间差
         */
        advanceTime(passedTime?: number): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.EventDispatcher
     * @classdesc
     * 事件派发者
     */
    class EventDispatcher extends egret.EventDispatcher {
        constructor(target?: egret.IEventDispatcher);
    }
}
declare module dragonBones {
    /**
     *
     *
     * @example
       <pre>
        private exampleEvent():void
        {
            //获取动画数据
            var skeletonData = RES.getRes("skeleton");
            //获取纹理集数据
            var textureData = RES.getRes("textureConfig");
            //获取纹理集图片
            var texture = RES.getRes("texture");

            //创建一个工厂，用来创建Armature
            var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
            //把动画数据添加到工厂里
            factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
            //把纹理集数据和图片添加到工厂里
            factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

            //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
            var armatureName:string = skeletonData.armature[0].name;
            //从工厂里创建出Armature
            var armature:dragonBones.Armature = factory.buildArmature(armatureName);
            //获取装载Armature的容器
            var armatureDisplay = armature.display;
            armatureDisplay.x = 200;
            armatureDisplay.y = 400;
            //把它添加到舞台上
            this.addChild(armatureDisplay);

            //监听事件时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
            //监听骨骼时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.onFrameEvent,this);
            //监听动画完成事件
            armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
            //监听动画开始事件
            armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
            //监听循环动画，播放完一遍的事件
            armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
            //监听声音事件
            var soundManager:dragonBones.SoundEventManager = dragonBones.SoundEventManager.getInstance();
            soundManager.addEventListener(dragonBones.SoundEvent.SOUND, this.onSoundEvent,this);

            //取得这个Armature动画列表中的第一个动画的名字
            var curAnimationName = armature.animation.animationList[0];
            //播放一遍动画
            armature.animation.gotoAndPlay(curAnimationName,0,-1,1);

            //把Armature添加到心跳时钟里
            dragonBones.WorldClock.clock.add(armature);
            //心跳时钟开启
            egret.Ticker.getInstance().register(function (advancedTime) {
                dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
            }, this);
        }
        private onFrameEvent(evt: dragonBones.FrameEvent):void
        {
            //打印出事件的类型，和事件的帧标签
            console.log(evt.type, evt.frameLabel);
        }

        private onAnimationEvent(evt: dragonBones.AnimationEvent):void
        {
            switch(evt.type)
            {
                case dragonBones.AnimationEvent.START:
                     break;
                case dragonBones.AnimationEvent.LOOP_COMPLETE:
                     break;
                case dragonBones.AnimationEvent.COMPLETE:
                     //动画完成后销毁这个armature
                     this.removeChild(evt.armature.display);
                     dragonBones.WorldClock.clock.remove(evt.armature);
                     evt.armature.dispose();
                     break;
            }
        }

        private onSoundEvent(evt: dragonBones.SoundEvent):void
        {
            //播放声音
            var flySound:egret.Sound = RES.getRes(evt.sound);
            console.log("soundEvent",evt.sound);
        }

       </pre>
     */
    class SoundEventManager extends EventDispatcher {
        private static _instance;
        static getInstance(): SoundEventManager;
        constructor();
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.Armature
     * @classdesc
     * Armature 是 DragonBones 骨骼动画系统的核心。他包含需要加到场景的显示对象，所有的骨骼逻辑和动画系统
     * A Armature instance is the core of the skeleton animation system. It contains the object to display, all sub-bones and the object animation(s).
     * @extends dragonBones.EventDispatcher
     * @see dragonBones.ArmatureData
     * @example
     * <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");

        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay参数说明,具体详见Animation类
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);

        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class Armature extends EventDispatcher implements IAnimatable {
        __dragonBonesData: DragonBonesData;
        /**
         * The instance dispatch sound event.
         */
        private static _soundManager;
        /**
         * 骨架名。
         * 骨架名一般等于 ArmatureData 的名字
         * 默认值：true。
         * @member {string} dragonBones.Armature#name
         */
        name: string;
        /**
         * 存储额外的用户数据。
         * @member {any} dragonBones.Armature#userData
         */
        userData: any;
        /** @private Set it to true when slot's zorder changed*/
        _slotsZOrderChanged: boolean;
        /** @private Store event needed to dispatch in current frame. When advanceTime execute complete, dispath them.*/
        _eventList: Array<Event>;
        /** @private Store slots based on slots' zOrder*/
        _slotList: Array<Slot>;
        /** @private Store bones based on bones' hierarchy (From root to leaf)*/
        _boneList: Array<Bone>;
        private _delayDispose;
        private _lockDispose;
        /** @private */
        _armatureData: ArmatureData;
        /**
         * 骨架数据。
         * @member {ArmatureData} dragonBones.Armature#armatureData
         */
        armatureData: ArmatureData;
        /** @private */
        _display: any;
        /**
         * 骨架显示对象。骨架创建出来后，需要把该显示对象加到场景中才能显示骨架。
         * 使用根据不同的渲染引擎，显示对象的类型可能不同。
         * @member {any} dragonBones.Armature#display
         */
        display: any;
        /**
         * 不推荐的API,使用 display 属性代替。
         */
        getDisplay(): any;
        /** @private */
        _animation: Animation;
        /**
         * 骨架的动画实例。
         * @member {Animation} dragonBones.Armature#animation
         */
        animation: Animation;
        constructor(display: any);
        /**
         * 清理骨架实例
         */
        dispose(): void;
        /**
         * 在下一帧强制更新指定名称的 Bone 及其包含的所有 Slot 的动画。
         * @param boneName {string} 骨头名。 默认值：null，相当于更新所有骨头。
         */
        invalidUpdate(boneName?: string): void;
        /**
         * 使用这个方法更新动画状态。一般来说，这个方法需要在 ENTERFRAME 事件的响应函数中被调用
         * @param passedTime 动画向前播放的时间（单位：秒）
         */
        advanceTime(passedTime: number): void;
        resetAnimation(): void;
        /**
         * 获取骨架包含的所有插槽
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {Slot[]}
         */
        getSlots(returnCopy?: boolean): Array<Slot>;
        /**
         * 获取指定名称的 Slot
         * @param slotName {string} Slot名称
         * @returns {Slot}
         */
        getSlot(slotName: string): Slot;
        /**
         * 获取包含指定显示对象的 Slot
         * @param displayObj {any} 显示对象实例
         * @returns {Slot}
         */
        getSlotByDisplay(displayObj: any): Slot;
        /**
         * 为指定名称的 Bone 添加一个子 Slot
         * @param slot {Slot} Slot 实例
         * @param boneName {string}
         * @see dragonBones.Bone
         */
        addSlot(slot: Slot, boneName: string): void;
        /**
         * 移除指定的Slot
         * @param slot {Slot} Slot 实例
         */
        removeSlot(slot: Slot): void;
        /**
         * 移除指定名称的Slot
         * @param slotName {string} Slot 名称
         * @returns {Slot} 被成功移除的 Slot 实例
         */
        removeSlotByName(slotName: string): Slot;
        /**
         * 获取骨架包含的所有Bone
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {Bone[]}
         */
        getBones(returnCopy?: boolean): Array<Bone>;
        /**
         * 获取指定名称的 Bone
         * @param boneName {string} Bone名称
         * @returns {Bone}
         */
        getBone(boneName: string): Bone;
        /**
         * 获取包含指定显示对象的 Bone
         * @param display {any} 显示对象实例
         * @returns {Bone}
         */
        getBoneByDisplay(display: any): Bone;
        /**
         * 在骨架中为指定名称的 Bone 添加一个子 Bone
         * @param bone {Bone} Bone 实例
         * @param parentName {string} 父骨头名称 默认：null
         * @param updateLater {boolean} 是否延迟更新 默认：false，当需要一次添加很多Bone时，开启延迟更新能够提高效率
         */
        addBone(bone: Bone, parentName?: string, updateLater?: boolean): void;
        /**
         * 移除指定的 Bone
         * @param bone {Bone} Bone 实例
         * @param updateLater {boolean} 是否延迟更新 默认：false，当需要一次移除很多Bone时，开启延迟更新能够提高效率
         */
        removeBone(bone: Bone, updateLater?: boolean): void;
        /**
         * 移除指定名称的 Bone
         * @param boneName {string} Bone 名称
         * @returns {Bone} 被成功移除的 Bone 实例
         */
        removeBoneByName(boneName: string): Bone;
        /** @private */
        _addBoneToBoneList(bone: Bone): void;
        /** @private */
        _removeBoneFromBoneList(bone: Bone): void;
        /** @private */
        _addSlotToSlotList(slot: Slot): void;
        /** @private */
        _removeSlotFromSlotList(slot: Slot): void;
        /**
         * 按照显示层级为所有 Slot 排序
         */
        updateSlotsZOrder(): void;
        _updateAnimationAfterBoneListChanged(ifNeedSortBoneList?: boolean): void;
        private sortBoneList();
        /** @private When AnimationState enter a key frame, call this func*/
        _arriveAtFrame(frame: Frame, timelineState: TimelineState, animationState: AnimationState, isCross: boolean): void;
        private sortSlot(slot1, slot2);
        /**
         * 获取Animation实例
         * @returns {any} Animation实例
         */
        getAnimation(): any;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.Matrix
     * @classdesc
     * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix 对象应用于 Transform 对象的 matrix 属性，然后应用该 Transform 对象作为显示对象的 transform 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。
     * 这些转换类型统称为仿射转换。仿射转换在转换时保持线条笔直，因此平行线保持平行。
     * 转换矩阵对象为具有如下内容的 3 x 3 的矩阵：
     *  a  c  tx
     *  b  d  ty
     *  u  v  w
     * 在传统的转换矩阵中，u、v 和 w 属性具有其他功能。Matrix 类只能在二维空间中操作，因此始终假定属性值 u 和 v 为 0.0，属性值 w 为 1.0。矩阵的有效值如下：
     *  a  c  tx
     *  b  d  ty
     *  0  0  1
     * 您可以获取和设置 Matrix 对象的全部六个其他属性的值：a、b、c、d、tx 和 ty。
     * Matrix 类支持四种主要类型的转换：平移、缩放、旋转和倾斜。您可以使用特定的方法来设置这些转换的其中三个，如下表中所述：
     * 转换	              矩阵值                      说明
     * 平移（置换）	                            将图像 tx 像素向右移动，将 ty 像素向下移动。
     *                   1  0  tx
     *                   0  1  ty
     *                   0  0  1
     * 缩放                                     将每个像素的位置乘以 x 轴的 sx 和 y 轴的 sy，从而调整图像的大小。
     *                   Sx  0  0
     *                   0  Sy  0
     *                   0  0   1
     * 旋转                                     将图像旋转一个以弧度为单位的角度 q。
     *                   cos(q)  -sin(q)  0
     *                   sin(q)  cos(q)   0
     *                   0         0      1
     * 倾斜或剪切                               以平行于 x 轴或 y 轴的方向逐渐滑动图像。Matrix 对象的 b 属性表示斜角沿 y 轴的正切；Matrix 对象的 c 属性表示斜角沿 x 轴的正切。
     *                  0        tan(skewX) 0
     *                  tan(skewY)  0       0
     *                   0          0       1
     * 每个转换函数都将更改当前矩阵的属性，所以您可以有效地合并多个转换。为此，请先调用多个转换函数，再将矩阵应用于其显示对象目标（通过使用该显示对象的 transform 属性）。
     */
    class Matrix {
        /**
         * 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @member {number} dragonBones.Matrix#a
         */
        a: number;
        /**
         * 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @member {number} dragonBones.Matrix#b
         */
        b: number;
        /**
         *旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @member {number} dragonBones.Matrix#c
         */
        c: number;
        /**
         *缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @member {number} dragonBones.Matrix#d
         */
        d: number;
        /**
         *沿 x 轴平移每个点的距离。
         * @member {number} dragonBones.Matrix#tx
         */
        tx: number;
        /**
         *沿 y 轴平移每个点的距离。
         * @member {number} dragonBones.Matrix#ty
         */
        ty: number;
        /**
         *构造函数，实例化一个Matrix，默认为是一个单位矩阵
         */
        constructor();
        /**
         *执行原始矩阵的逆转换。逆矩阵和单位矩阵相乘会得到的单位矩阵
         */
        invert(): void;
        /**
         *将某个矩阵与当前矩阵相乘，从而将这两个矩阵的几何效果有效地结合在一起。
         * 右乘，其几何意义是将两次几何变换变成一次
         * @param m
         */
        concat(m: Matrix): void;
        copyFrom(m: Matrix): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.DBTransform
     * @classdesc
     * Dragonbones中使用的transform
     * 可以表示位移，旋转，缩放三种属性
     */
    class DBTransform {
        /**
         * x坐标值
         * @member {number} dragonBones.DBTransform#x
         */
        x: number;
        /**
         * y坐标值
         * @member {number} dragonBones.DBTransform#y
         */
        y: number;
        /**
         * x方向的斜切，一般和skewY一起变化，可以表示旋转
         * @member {number} dragonBones.DBTransform#skewX
         */
        skewX: number;
        /**
         * y方向的斜切，一般和skewX一起变化，可以表示旋转
         * @member {number} dragonBones.DBTransform#skewY
         */
        skewY: number;
        /**
         * x方向的缩放
         * @member {number} dragonBones.DBTransform#scaleX
         */
        scaleX: number;
        /**
         * y方向的缩放
         * @member {number} dragonBones.DBTransform#scaleY
         */
        scaleY: number;
        /**
         * 旋转，用弧度表示
         * @member {number} dragonBones.DBTransform#rotation
         */
        rotation: number;
        /**
         * 创建一个 DBTransform 实例.
         */
        constructor();
        /**
         * 拷贝传入的transfrom实例的所有属性
         * @param node
         */
        copy(transform: DBTransform): void;
        /**
         * transform加法
         * @param node
         */
        add(transform: DBTransform): void;
        /**
         * transform减法
         * @param node
         */
        minus(transform: DBTransform): void;
        normalizeRotation(): void;
        /**
         * 把DBTransform的所有属性转成用String类型表示
         * @return 一个字符串包含有DBTransform的所有属性
         */
        toString(): string;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.DBObject
     * @classdesc
     * DBObject 是 Bone 和 Slot 的基类
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     */
    class DBObject {
        name: string;
        /**
         * 存储额外的用户数据。
         * @member {any} dragonBones.DBObject#userData
         */
        userData: any;
        /**
         * 是否继承父亲的旋转属性。
         * @member {boolean} dragonBones.DBObject#inheritRotation
         */
        inheritRotation: boolean;
        /**
         * 是否继承父亲的缩放属性。
         * @member {boolean} dragonBones.DBObject#inheritScale
         */
        inheritScale: boolean;
        /**
         * 是否继承父亲的平移属性。
         * @member {boolean} dragonBones.DBObject#inheritTranslation
         */
        inheritTranslation: boolean;
        /** @private */
        _global: DBTransform;
        /** @private */
        _globalTransformMatrix: Matrix;
        static _tempParentGlobalTransformMatrix: Matrix;
        static _tempParentGlobalTransform: DBTransform;
        /**
         * 相对世界坐标的 DBTransform 实例。
         * @member {DBTransform} dragonBones.DBObject#global
         */
        global: DBTransform;
        /** @private */
        _origin: DBTransform;
        /**
         * 骨架数据中的原始的相对父亲的 DBTransform 实例。
         * @member {DBTransform} dragonBones.DBObject#origin
         */
        origin: DBTransform;
        /** @private */
        _offset: DBTransform;
        /**
         * 用于运行时动态调整的 DBTransform 实例。
         * @member {DBTransform} dragonBones.DBObject#offset
         */
        offset: DBTransform;
        /** @private */
        _visible: boolean;
        /** @private */
        _armature: Armature;
        /**
         * The armature this DBObject instance belongs to.
         */
        armature: Armature;
        /** @private */
        _setArmature(value: Armature): void;
        /** @private */
        _parent: Bone;
        /**
         * Indicates the Bone instance that directly contains this DBObject instance if any.
         */
        parent: Bone;
        /** @private */
        _setParent(value: Bone): void;
        constructor();
        /**
         * 清理使用的资源用于垃圾回收
         */
        dispose(): void;
        _calculateRelativeParentTransform(): void;
        _calculateParentTransform(): any;
        _updateGlobal(): any;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.Bone
     * @classdesc
     * Bone 实例代表 Armature 中的一个骨头。一个Armature实例可以由很多 Bone组成。
     * Bone 在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现
     * @extends dragonBones.DBObject
     * @see dragonBones.Armature
     * @see dragonBones.Slot
     * @see dragonBones.BoneData
     *
     * @example
       <pre>
        //获取动画数据 本例使用Knight例子.
        //资源下载地址http://dragonbones.github.io/download_forwarding.html?download_url=downloads/dragonbonesdemos_v2.4.zip
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
        //这个资源需要自己准备
        var horseHat = RES.getRes("horseHat");
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[1].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        armatureDisplay.x = 200;
        armatureDisplay.y = 300;
        this.addChild(armatureDisplay);

        //以下四句代码，实现给骨骼添加slot的功能
        //1.获取马头的骨骼
        var horseHead:dragonBones.Bone = armature.getBone("horseHead");
        //2.创建一个slot
        var horseHatSlot:dragonBones.EgretSlot = new dragonBones.EgretSlot();
        //3.给这个slot赋一个图片
        horseHatSlot.display = new egret.Bitmap(horseHat);
        //4.把这个slot添加到骨骼上
        horseHead.addSlot(horseHatSlot);

        //以下3句代码，实现了子骨骼的获取和播放子骨架的动画
        //1.获取包含子骨架的骨骼
        var weaponBone:dragonBones.Bone = armature.getBone("armOutside");
        //2.获取骨骼上的子骨架
        var childArmature:dragonBones.Armature = weaponBone.childArmature;
        //3.播放子骨架的动画
        childArmature.animation.gotoAndPlay("attack_sword_1",0,-1,0);


        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);

        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class Bone extends DBObject {
        /**
         * The instance dispatch sound event.
         */
        private static _soundManager;
        static initWithBoneData(boneData: BoneData): Bone;
        /**
         * display控制者的名字，该名字对应一个 AnimationState 实例。
         * 当动画中有多个 AnimationState 存在时，我们可以通过指定 displayController 实现只有某个 AnimationState 能够控制 display 的切换。
         * 默认值：null。意味着所有 AnimationState 都能控制display的切换
         * @member {string} dragonBones.Bone#displayController
         * @see dragonBones.AnimationState.
         */
        displayController: string;
        /**
         * 标记是否将offset中的平移分量作用到子骨头
         * 默认值：true
         * @member {true} dragonBones.Bone#applyOffsetTranslationToChild
         * @see dragonBones.Bone#offset
         */
        applyOffsetTranslationToChild: boolean;
        /**
         * 标记是否将offset中的旋转分量作用到子骨头
         * 默认值：true
         * @member {true} dragonBones.Bone#applyOffsetRotationToChild
         * @see dragonBones.Bone#offset
         */
        applyOffsetRotationToChild: boolean;
        /**
         * 标记是否将offset中的缩放分量作用到子骨头
         * 默认值：true
         * @member {true} dragonBones.Bone#applyOffsetScaleToChild
         * @see dragonBones.Bone#offset
         */
        applyOffsetScaleToChild: boolean;
        /** @private */
        _boneList: Array<Bone>;
        /** @private */
        _slotList: Array<Slot>;
        /** @private */
        _timelineStateList: Array<TimelineState>;
        /** @private */
        _tween: DBTransform;
        /** @private */
        _tweenPivot: Point;
        /** @private */
        _needUpdate: number;
        /** @private */
        _isColorChanged: boolean;
        /** @private */
        _globalTransformForChild: DBTransform;
        /** @private */
        _globalTransformMatrixForChild: Matrix;
        private _tempGlobalTransformForChild;
        private _tempGlobalTransformMatrixForChild;
        constructor();
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * 检查是否包含指定的 Bone 或者 Slot
         * @param child {DBObject} Bone 实例 或者 Slot 实例
         * @returns {boolean}
         */
        contains(child: DBObject): boolean;
        /**
         * 添加指定的 Bone 实例做为当前 Bone 实例的子骨头
         * @param childBone {Bone} 需要添加的 Bone 实例
         * @param updateLater {boolean} 是否延迟更新。默认false。当需要一次性添加很多 Bone 时，开启延迟更新能够提高效率
         */
        addChildBone(childBone: Bone, updateLater?: boolean): void;
        /**
         * 从当前 Bone 实例中移除指定的子骨头
         * @param childBone {Bone} 需要移除的 Bone 实例
         * @param updateLater {boolean} 是否延迟更新。默认false。当需要一次性移除很多 Bone 时，开启延迟更新能够提高效率
         */
        removeChildBone(childBone: Bone, updateLater?: boolean): void;
        /**
         * 向当前 Bone 实例中添加指定的 Slot 实例
         * @param childSlot {Slot} 需要添加的 Slot 实例
         */
        addSlot(childSlot: Slot): void;
        /**
         * 从当前 Bone 实例中移除指定的 Slot 实例
         * @param childSlot {Slot} 需要移除的 Slot 实例
         */
        removeSlot(childSlot: Slot): void;
        /** @private */
        _setArmature(value: Armature): void;
        /**
         * 获取当前骨头包含的所有 Bone 实例
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {Bone[]}
         */
        getBones(returnCopy?: boolean): Array<Bone>;
        /**
         * 获取当前骨头包含的所有 Slot 实例
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {Slot[]}
         */
        getSlots(returnCopy?: boolean): Array<Slot>;
        /**
         * 在下一帧强制更新当前 Bone 实例及其包含的所有 Slot 的动画。
         */
        invalidUpdate(): void;
        _calculateRelativeParentTransform(): void;
        /** @private */
        _update(needUpdate?: boolean): void;
        /** @private */
        _updateColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number, colorChanged: boolean): void;
        /** @private */
        _hideSlots(): void;
        /** @private When bone timeline enter a key frame, call this func*/
        _arriveAtFrame(frame: Frame, timelineState: TimelineState, animationState: AnimationState, isCross: boolean): void;
        /** @private */
        _addState(timelineState: TimelineState): void;
        /** @private */
        _removeState(timelineState: TimelineState): void;
        /** @private */
        _removeAllStates(): void;
        private blendingTimeline();
        private sortState(state1, state2);
        /**
         * 不推荐的API,建议使用 slot.childArmature 替代
         */
        childArmature: Armature;
        /**
         * 不推荐的API,建议使用 slot.display 替代
         */
        display: any;
        /**
         * 不推荐的API,建议使用 offset 替代
         */
        node: DBTransform;
        /** @private */
        visible: boolean;
        /**
         * 返回当前 Bone 实例包含的第一个 Slot 实例
         * @member {Slot} dragonBones.Bone#slot
         */
        slot: Slot;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.ITextureAltas
     * @classdesc
     * 纹理集的接口
     */
    interface IArmature extends IAnimatable {
        getAnimation(): any;
        resetAnimation(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.Slot
     * @classdesc
     * Slot 实例是骨头上的一个插槽，是显示图片的容器。
     * 一个 Bone 上可以有多个Slot，每个Slot中同一时间都会有一张图片用于显示，不同的Slot中的图片可以同时显示。
     * 每个 Slot 中可以包含多张图片，同一个 Slot 中的不同图片不能同时显示，但是可以在动画进行的过程中切换，用于实现帧动画。
     * @extends dragonBones.DBObject
     * @see dragonBones.Armature
     * @see dragonBones.Bone
     * @see dragonBones.SlotData
     *
     * @example
       <pre>
        //获取动画数据 本例使用Knight例子.
        //资源下载地址http://dragonbones.github.io/download_forwarding.html?download_url=downloads/dragonbonesdemos_v2.4.zip
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
        //这个资源需要自己准备
        var horseHat = RES.getRes("horseHat");
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[1].name;
        //从工厂里创建出Armature
        var armature:dragonBones.Armature = factory.buildArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        armatureDisplay.x = 200;
        armatureDisplay.y = 300;
        this.addChild(armatureDisplay);

        //以下四句代码，实现给骨骼添加slot的功能
        //1.获取马头的骨骼
        var horseHead:dragonBones.Bone = armature.getBone("horseHead");
        //2.创建一个slot
        var horseHatSlot:dragonBones.EgretSlot = new dragonBones.EgretSlot();
        //3.给这个slot赋一个图片
        horseHatSlot.display = new egret.Bitmap(horseHat);
        //4.把这个slot添加到骨骼上
        horseHead.addSlot(horseHatSlot);

        //以下3句代码，实现了子骨骼的获取和播放子骨架的动画
        //1.获取包含子骨架的骨骼
        var weaponBone:dragonBones.Bone = armature.getBone("armOutside");
        //2.获取骨骼上的子骨架
        var childArmature:dragonBones.Armature = weaponBone.childArmature;
        //3.播放子骨架的动画
        childArmature.animation.gotoAndPlay("attack_sword_1",0,-1,0);


        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);

        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class Slot extends DBObject {
        /** @private Need to keep the reference of DisplayData. When slot switch displayObject, it need to restore the display obect's origional pivot. */
        _displayDataList: Array<DisplayData>;
        /** @private */
        _originZOrder: number;
        /** @private */
        _tweenZOrder: number;
        /** @private */
        _offsetZOrder: number;
        /** @private */
        _originDisplayIndex: number;
        _displayList: Array<any>;
        _currentDisplayIndex: number;
        _colorTransform: ColorTransform;
        _currentDisplay: any;
        _isShowDisplay: boolean;
        _blendMode: string;
        _isColorChanged: boolean;
        _needUpdate: boolean;
        _timelineStateList: Array<SlotTimelineState>;
        constructor(self: Slot);
        /**
         * 通过传入 SlotData 初始化Slot
         * @param slotData
         */
        initWithSlotData(slotData: SlotData): void;
        /**
         * @inheritDoc
         */
        dispose(): void;
        private sortState(state1, state2);
        /** @private */
        _addState(timelineState: SlotTimelineState): void;
        /** @private */
        _removeState(timelineState: SlotTimelineState): void;
        /** @private */
        setArmature(value: Armature): void;
        /** @private */
        _update(): void;
        _calculateRelativeParentTransform(): void;
        private updateChildArmatureAnimation();
        /** @private */
        _changeDisplay(displayIndex?: number): void;
        /** @private
         * Updates the display of the slot.
         */
        _updateSlotDisplay(): void;
        /** @private */
        visible: boolean;
        /**
         * 显示对象列表(包含 display 或者 子骨架)
         * @member {any[]} dragonBones.Slot#displayList
         */
        displayList: Array<any>;
        /**
         * 当前的显示对象(可能是 display 或者 子骨架)
         * @member {any} dragonBones.Slot#display
         */
        display: any;
        /**
         * 不推荐的 API. 使用 display 属性代替
         */
        getDisplay(): any;
        /**
         * Unrecommended API. Please use .display = instead.
         * @returns {any}
         */
        setDisplay(value: any): void;
        /**
         * 当前的子骨架
         * @member {Armature} dragonBones.Slot#childArmature
         */
        childArmature: Armature;
        /**
         * 显示顺序。(支持小数用于实现动态插入slot)
         * @member {number} dragonBones.Slot#zOrder
         */
        zOrder: number;
        /**
         * 混合模式
         * @member {string} dragonBones.Slot#blendMode
         */
        blendMode: string;
        /**
         * @private
         */
        _updateDisplay(value: any): void;
        /**
         * @private
         */
        _getDisplayIndex(): number;
        /**
         * @private
         * Adds the original display object to another display object.
         * @param container
         * @param index
         */
        _addDisplayToContainer(container: any, index?: number): void;
        /**
         * @private
         * remove the original display object from its parent.
         */
        _removeDisplayFromContainer(): void;
        /**
         * @private
         * Updates the transform of the slot.
         */
        _updateTransform(): void;
        /**
         * @private
         */
        _updateDisplayVisible(value: boolean): void;
        /**
         * @private
         * Updates the color of the display object.
         * @param a
         * @param r
         * @param g
         * @param b
         * @param aM
         * @param rM
         * @param gM
         * @param bM
         */
        _updateDisplayColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number, colorChanged?: boolean): void;
        /**
         * @private
         * Update the blend mode of the display object.
         * @param value The blend mode to use.
         */
        _updateDisplayBlendMode(value: string): void;
        /** @private When bone timeline enter a key frame, call this func*/
        _arriveAtFrame(frame: Frame, timelineState: SlotTimelineState, animationState: AnimationState, isCross: boolean): void;
        _updateGlobal(): any;
        _resetToOrigin(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.AnimationCache
     * @classdesc
     * AnimationCache 实例是动画缓存的实体，包含一个动画的所有缓存数据。
     * 每个Slot的缓存数据存在各个SlotTimelineCache中。
     * 一般来说 AnimationCache 不需要开发者直接操控，而是由AnimationCacheManager代为管理。
     * @see dragonBones.AnimationCacheManager
     * @see dragonBones.TimelineCache
     * @see dragonBones.SlotTimelineCache
     * @see dragonBones.SlotFrameCache
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
        //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
        </pre>
     */
    class AnimationCache {
        name: string;
        slotTimelineCacheList: Array<SlotTimelineCache>;
        slotTimelineCacheDic: any;
        frameNum: number;
        constructor();
        static initWithAnimationData(animationData: AnimationData, armatureData: ArmatureData): AnimationCache;
        initSlotTimelineCacheDic(slotCacheGeneratorDic: any, slotFrameCacheDic: any): void;
        bindCacheUserSlotDic(slotDic: any): void;
        addFrame(): void;
        update(progress: number): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.AnimationCacheManager
     * @classdesc
     * AnimationCacheManager 实例是动画缓存管理器，他可以为一个或多个同类型的Armature生成动画缓存数据，从而提高动画运行效率。
     * 目前AnimationCacheManager只支持对FastArmatrue生成缓存，以后会扩展为对任何实现ICacheableArmature接口的Armature生成缓存。
     * @see dragonBones.ICacheableArmature
     * @see dragonBones.FastArmature
     * @see dragonBones.AnimationCache
     * @see dragonBones.FrameCache
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class AnimationCacheManager {
        cacheGeneratorArmature: ICacheableArmature;
        armatureData: ArmatureData;
        frameRate: number;
        animationCacheDic: any;
        slotFrameCacheDic: any;
        constructor();
        /**
         * 通过ArmatrueData创建并初始化AnimationCacheManager。
         * AnimationCacheManager的创建需要依赖ArmatrueData。
         * @param armatureData {ArmatureData} 骨架数据实例。
         * @param frameRate {number} 帧频。帧频决定生成数据缓存的采样率。
         * @see dragonBones.ArmatureData.
         */
        static initWithArmatureData(armatureData: ArmatureData, frameRate?: number): AnimationCacheManager;
        /**
         * 为所有动画初始化AnimationCache实例。在生成动画缓存之前需要调用这个API生成相应的AnimationCache实例
         * @see dragonBones.AnimationCache.
         */
        initAllAnimationCache(): void;
        /**
         * 指定动画名，初始化AnimationCache实例。在生成动画缓存之前需要调用这个API生成相应的AnimationCache实例
         * @param animationName {string} 动画名。
         * @see dragonBones.AnimationCache.
         */
        initAnimationCache(animationName: string): void;
        /**
         * 绑定Armature列表做为动画缓存的使用者。
         * 在为Armature生成动画缓存之前，需要将其绑定为动画缓存的使用者
         * @param armatures {Array<any>} 骨架列表。
         * @see dragonBones.ICacheableArmature.
         */
        bindCacheUserArmatures(armatures: Array<any>): void;
        /**
         * 绑定制定Armature做为动画缓存的使用者。
         * 在为Armature生成动画缓存之前，需要将其绑定为动画缓存的使用者
         * @param armatures {FastArmature} 要绑定为缓存使用者的骨架对象。
         * @see dragonBones.ICacheableArmature.
         */
        bindCacheUserArmature(armature: FastArmature): void;
        /**
         * 设置指定的Armature做为动画缓存的生成器。（同一个Armature可以既是缓存使用者，也是缓存生成器）
         * 在为Armature生成动画缓存之前，需要设置动画缓存的生成器
         * @param armatures {FastArmature} 要设置为缓存生成器的骨架对象。
         * @see dragonBones.ICacheableArmature.
         */
        setCacheGeneratorArmature(armature: FastArmature): void;
        /**
         * 生成所有动画缓存数据。生成之后，所有绑定CacheUser的Armature就都能够使用这些缓存了。
         * 在为调用这个API生成动画缓存之前，需要：
         * 1.调用API initAllAnimationCache 初始化AnimationCache实例
         * 2.调用API setCacheGeneratorArmature 设置动画缓存的生成器,
         * 3.调用API bindCacheUserArmatures 绑定动画缓存的使用者
         * @param loop {boolean} 要生成缓存的动画是否需要循环播放。如果该动画在播放时只需要播放一次，则设置为false。如果需要播放大于一次，则设置为true。
         * @see dragonBones.AnimationCache
         */
        generateAllAnimationCache(loop: boolean): void;
        /**
         * 生成指定动画缓存数据。生成之后，所有绑定CacheUser的Armature就都能够使用这些缓存了。
         * 在为调用这个API生成动画缓存之前，需要：
         * 1.调用API initAnimationCache 初始化AnimationCache实例
         * 2.调用API setCacheGeneratorArmature 设置动画缓存的生成器,
         * 3.调用API bindCacheUserArmatures 绑定动画缓存的使用者
         * @param animationName {string} 要生成缓存的动画名。
         * @param loop {boolean} 要生成缓存的动画是否需要循环播放。如果该动画在播放时只需要播放一次，则设置为false。如果需要播放大于一次，则设置为true。
         * @see dragonBones.AnimationCache
         */
        generateAnimationCache(animationName: string, loop: boolean): void;
        /**
         * 将缓存生成器骨架重置，生成动画缓存后调用。
         * @see dragonBones.ICacheableArmature
         */
        resetCacheGeneratorArmature(): void;
        /**
         * 获取制定名称的AnimationCache实例。
         * @param animationName {string} 动画名。
         * @see dragonBones.AnimationCache
         */
        getAnimationCache(animationName: string): AnimationCache;
    }
}
declare module dragonBones {
    /**
     *
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class FrameCache {
        private static ORIGIN_TRAMSFORM;
        private static ORIGIN_MATRIX;
        globalTransform: DBTransform;
        globalTransformMatrix: Matrix;
        constructor();
        copy(frameCache: FrameCache): void;
        clear(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.ICacheUser
     * @classdesc
     * ICacheUser 接口定义了可以使用帧缓存的接口。
     * 目前只有FastSlot实现了该接口。
     * @see dragonBones.FastSlot
     * @see dragonBones.ISlotCacheGenerator
     */
    interface ICacheUser {
        name: string;
        frameCache: FrameCache;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.ICacheableArmature
     * @classdesc
     * ICacheableArmature 接口定义了可以使用缓存的Armature的接口。
     * 目前只有FastArmature实现了该接口。
     * @see dragonBones.FastArmature
     * @see dragonBones.IArmature
     */
    interface ICacheableArmature extends IArmature {
        enableCache: boolean;
        enableEventDispatch: boolean;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.ISlotCacheGenerator
     * @classdesc
     * ICacheUser 接口定义了可以生成Slot帧缓存的接口。
     * 目前只有FastSlot实现了该接口。
     * @see dragonBones.FastSlot
     * @see dragonBones.ICacheUser
     */
    interface ISlotCacheGenerator extends ICacheUser {
        global: DBTransform;
        globalTransformMatrix: Matrix;
        colorChanged: boolean;
        colorTransform: ColorTransform;
        displayIndex: number;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.SlotFrameCache
     * @classdesc
     * SlotFrameCache 存储了Slot的帧缓存数据。
     * @see dragonBones.FastSlot
     * @see dragonBones.ICacheUser
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class SlotFrameCache extends FrameCache {
        colorTransform: ColorTransform;
        displayIndex: number;
        constructor();
        copy(frameCache: FrameCache): void;
        clear(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.TimelineCache
     * @classdesc
     * TimelineCache 是时间轴缓存基类存。
     * @see dragonBones.SlotTimelineCache
     * @see dragonBones.FrameCache
     * @see dragonBones.ICacheUser
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class TimelineCache {
        name: string;
        frameCacheList: Array<FrameCache>;
        currentFrameCache: FrameCache;
        constructor();
        addFrame(): void;
        update(frameIndex?: number): void;
        bindCacheUser(cacheUser: ICacheUser): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.SlotTimelineCache
     * @classdesc
     * SlotTimelineCache 存储了Slot的时间轴缓存数据。
     * @see dragonBones.TimelineCache
     * @see dragonBones.SlotFrameCache
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class SlotTimelineCache extends TimelineCache {
        cacheGenerator: ISlotCacheGenerator;
        constructor();
        addFrame(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.Event
     * @classdesc
     * 事件
     */
    class Event extends egret.Event {
        /**
         * 创建一个Event实例
         * @param type 事件的类型
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.AnimationEvent
     * @extends dragonBones.Event
     * @classdesc
     * 动画事件
     *
     * @example
       <pre>
        private exampleEvent():void
        {
            //获取动画数据
            var skeletonData = RES.getRes("skeleton");
            //获取纹理集数据
            var textureData = RES.getRes("textureConfig");
            //获取纹理集图片
            var texture = RES.getRes("texture");

            //创建一个工厂，用来创建Armature
            var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
            //把动画数据添加到工厂里
            factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
            //把纹理集数据和图片添加到工厂里
            factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

            //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
            var armatureName:string = skeletonData.armature[0].name;
            //从工厂里创建出Armature
            var armature:dragonBones.Armature = factory.buildArmature(armatureName);
            //获取装载Armature的容器
            var armatureDisplay = armature.display;
            armatureDisplay.x = 200;
            armatureDisplay.y = 400;
            //把它添加到舞台上
            this.addChild(armatureDisplay);

            //监听事件时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
            //监听骨骼时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.onFrameEvent,this);
            //监听动画完成事件
            armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
            //监听动画开始事件
            armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
            //监听循环动画，播放完一遍的事件
            armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
            //监听声音事件
            var soundManager:dragonBones.SoundEventManager = dragonBones.SoundEventManager.getInstance();
            soundManager.addEventListener(dragonBones.SoundEvent.SOUND, this.onSoundEvent,this);

            //取得这个Armature动画列表中的第一个动画的名字
            var curAnimationName = armature.animation.animationList[0];
            //播放一遍动画
            armature.animation.gotoAndPlay(curAnimationName,0,-1,1);

            //把Armature添加到心跳时钟里
            dragonBones.WorldClock.clock.add(armature);
            //心跳时钟开启
            egret.Ticker.getInstance().register(function (advancedTime) {
                dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
            }, this);
        }
        private onFrameEvent(evt: dragonBones.FrameEvent):void
        {
            //打印出事件的类型，和事件的帧标签
            console.log(evt.type, evt.frameLabel);
        }

        private onAnimationEvent(evt: dragonBones.AnimationEvent):void
        {
            switch(evt.type)
            {
                case dragonBones.AnimationEvent.START:
                     break;
                case dragonBones.AnimationEvent.LOOP_COMPLETE:
                     break;
                case dragonBones.AnimationEvent.COMPLETE:
                     //动画完成后销毁这个armature
                     this.removeChild(evt.armature.display);
                     dragonBones.WorldClock.clock.remove(evt.armature);
                     evt.armature.dispose();
                     break;
            }
        }

        private onSoundEvent(evt: dragonBones.SoundEvent):void
        {
            //播放声音
            var flySound:egret.Sound = RES.getRes(evt.sound);
            console.log("soundEvent",evt.sound);
        }

       </pre>
     */
    class AnimationEvent extends Event {
        /**
         * 不推荐使用.
         */
        static MOVEMENT_CHANGE: string;
        /**
         * 当动画缓入的时候派发
         */
        static FADE_IN: string;
        /**
         * 当动画缓出的时候派发
         */
        static FADE_OUT: string;
        /**
         * 当动画开始播放时派发
         */
        static START: string;
        /**
         * 当动画停止时派发
         */
        static COMPLETE: string;
        /**
         * 当动画播放完一轮后派发
         */
        static LOOP_COMPLETE: string;
        /**
         * 当动画缓入完成时派发
         */
        static FADE_IN_COMPLETE: string;
        /**
         * 当动画缓出结束后派发
         */
        static FADE_OUT_COMPLETE: string;
        /**
         * 不推荐的API.
         * @member {string} dragonBones.AnimationEvent#movementID
         */
        movementID: string;
        /**
         * animationState 的实例.
         * @member {dragonBones.AnimationState} dragonBones.AnimationEvent#animationState
         */
        animationState: any;
        /**
         * 配发出事件的骨架
         * @member {dragonBones.Armature} dragonBones.AnimationEvent#armature
         */
        armature: Armature;
        /**
         * 获取动画的名字
         * @returns {string}
         * @member {string} dragonBones.AnimationEvent#animationName
         */
        animationName: string;
        /**
         * 创建一个新的 AnimationEvent 的实例
         * @param type 事件的类型
         * @param cancelable
         */
        constructor(type: string, cancelable?: boolean);
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.ArmatureEvent
     * @extends dragonBones.Event
     * @classdesc
     * 骨架事件
     */
    class ArmatureEvent extends Event {
        /**
         * 当zOrder成功更新后派发
         */
        static Z_ORDER_UPDATED: string;
        /**
         * 创建一个 ArmatureEvent 的实例
         * @param type 事件类型
         */
        constructor(type: string);
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.FrameEvent
     * @extends dragonBones.Event
     * @classdesc
     * 帧事件
     *
     * @example
     * <pre>
     *  private exampleEvent():void
        {
            //获取动画数据
            var skeletonData = RES.getRes("skeleton");
            //获取纹理集数据
            var textureData = RES.getRes("textureConfig");
            //获取纹理集图片
            var texture = RES.getRes("texture");

            //创建一个工厂，用来创建Armature
            var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
            //把动画数据添加到工厂里
            factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
            //把纹理集数据和图片添加到工厂里
            factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

            //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
            var armatureName:string = skeletonData.armature[0].name;
            //从工厂里创建出Armature
            var armature:dragonBones.Armature = factory.buildArmature(armatureName);
            //获取装载Armature的容器
            var armatureDisplay = armature.display;
            armatureDisplay.x = 200;
            armatureDisplay.y = 400;
            //把它添加到舞台上
            this.addChild(armatureDisplay);

            //监听事件时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
            //监听骨骼时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.onFrameEvent,this);
            //监听动画完成事件
            armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
            //监听动画开始事件
            armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
            //监听循环动画，播放完一遍的事件
            armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
            //监听声音事件
            var soundManager:dragonBones.SoundEventManager = dragonBones.SoundEventManager.getInstance();
            soundManager.addEventListener(dragonBones.SoundEvent.SOUND, this.onSoundEvent,this);

            //取得这个Armature动画列表中的第一个动画的名字
            var curAnimationName = armature.animation.animationList[0];
            //播放一遍动画
            armature.animation.gotoAndPlay(curAnimationName,0,-1,1);

            //把Armature添加到心跳时钟里
            dragonBones.WorldClock.clock.add(armature);
            //心跳时钟开启
            egret.Ticker.getInstance().register(function (advancedTime) {
                dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
            }, this);
        }
        private onFrameEvent(evt: dragonBones.FrameEvent):void
        {
            //打印出事件的类型，和事件的帧标签
            console.log(evt.type, evt.frameLabel);
        }

        private onAnimationEvent(evt: dragonBones.AnimationEvent):void
        {
            switch(evt.type)
            {
                case dragonBones.AnimationEvent.START:
                     break;
                case dragonBones.AnimationEvent.LOOP_COMPLETE:
                     break;
                case dragonBones.AnimationEvent.COMPLETE:
                     //动画完成后销毁这个armature
                     this.removeChild(evt.armature.display);
                     dragonBones.WorldClock.clock.remove(evt.armature);
                     evt.armature.dispose();
                     break;
            }
        }

        private onSoundEvent(evt: dragonBones.SoundEvent):void
        {
            //播放声音
            var flySound:egret.Sound = RES.getRes(evt.sound);
            console.log("soundEvent",evt.sound);
        }

     * </pre>
     */
    class FrameEvent extends Event {
        static MOVEMENT_FRAME_EVENT: string;
        /**
         * 当动画播放到一个关键帧时派发
         */
        static ANIMATION_FRAME_EVENT: string;
        /**
         *
         */
        static BONE_FRAME_EVENT: string;
        /**
         * 当前的帧标签
         * @member {string} dragonBones.FrameEvent#frameLabel
         */
        frameLabel: string;
        bone: any;
        /**
         * 派发这个事件的骨架
         * @member {dragonBones.Armature} dragonBones.FrameEvent#armature
         */
        armature: Armature;
        /**
         * animationState的实例
         * @member {dragonBones.AnimationState} dragonBones.FrameEvent#animationState
         */
        animationState: any;
        /**
         * 创建一个新的 FrameEvent 实例
         * @param type 事件类型
         * @param cancelable
         */
        constructor(type: string, cancelable?: boolean);
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.SoundEvent
     * @extends dragonBones.Event
     * @classdesc
     * 声音事件
     *
     * @example
       <pre>
        private exampleEvent():void
        {
            //获取动画数据
            var skeletonData = RES.getRes("skeleton");
            //获取纹理集数据
            var textureData = RES.getRes("textureConfig");
            //获取纹理集图片
            var texture = RES.getRes("texture");

            //创建一个工厂，用来创建Armature
            var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
            //把动画数据添加到工厂里
            factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
            //把纹理集数据和图片添加到工厂里
            factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));

            //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
            var armatureName:string = skeletonData.armature[0].name;
            //从工厂里创建出Armature
            var armature:dragonBones.Armature = factory.buildArmature(armatureName);
            //获取装载Armature的容器
            var armatureDisplay = armature.display;
            armatureDisplay.x = 200;
            armatureDisplay.y = 400;
            //把它添加到舞台上
            this.addChild(armatureDisplay);

            //监听事件时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.ANIMATION_FRAME_EVENT, this.onFrameEvent,this);
            //监听骨骼时间轴上的事件
            armature.addEventListener(dragonBones.FrameEvent.BONE_FRAME_EVENT, this.onFrameEvent,this);
            //监听动画完成事件
            armature.addEventListener(dragonBones.AnimationEvent.COMPLETE, this.onAnimationEvent,this);
            //监听动画开始事件
            armature.addEventListener(dragonBones.AnimationEvent.START, this.onAnimationEvent,this);
            //监听循环动画，播放完一遍的事件
            armature.addEventListener(dragonBones.AnimationEvent.LOOP_COMPLETE, this.onAnimationEvent,this);
            //监听声音事件
            var soundManager:dragonBones.SoundEventManager = dragonBones.SoundEventManager.getInstance();
            soundManager.addEventListener(dragonBones.SoundEvent.SOUND, this.onSoundEvent,this);

            //取得这个Armature动画列表中的第一个动画的名字
            var curAnimationName = armature.animation.animationList[0];
            //播放一遍动画
            armature.animation.gotoAndPlay(curAnimationName,0,-1,1);

            //把Armature添加到心跳时钟里
            dragonBones.WorldClock.clock.add(armature);
            //心跳时钟开启
            egret.Ticker.getInstance().register(function (advancedTime) {
                dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
            }, this);
        }
        private onFrameEvent(evt: dragonBones.FrameEvent):void
        {
            //打印出事件的类型，和事件的帧标签
            console.log(evt.type, evt.frameLabel);
        }

        private onAnimationEvent(evt: dragonBones.AnimationEvent):void
        {
            switch(evt.type)
            {
                case dragonBones.AnimationEvent.START:
                     break;
                case dragonBones.AnimationEvent.LOOP_COMPLETE:
                     break;
                case dragonBones.AnimationEvent.COMPLETE:
                     //动画完成后销毁这个armature
                     this.removeChild(evt.armature.display);
                     dragonBones.WorldClock.clock.remove(evt.armature);
                     evt.armature.dispose();
                     break;
            }
        }

        private onSoundEvent(evt: dragonBones.SoundEvent):void
        {
            //播放声音
            var flySound:egret.Sound = RES.getRes(evt.sound);
            console.log("soundEvent",evt.sound);
        }

       </pre>
     */
    class SoundEvent extends Event {
        /**
         * Dispatched when the animation of the animation enter a frame containing sound labels.
         */
        static SOUND: string;
        /**
         * The armature that is the target of this event.
         */
        armature: Armature;
        animationState: AnimationState;
        sound: string;
        /**
         * Creates a new SoundEvent instance.
         * @param type
         * @param cancelable
         */
        constructor(type: string, cancelable?: boolean);
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.BaseFactory
     * @classdesc
     * 工厂的基类
     * @extends dragonBones.EventDispatcher
     *
     * @example
       <pre>
         //获取动画数据
         var skeletonData = RES.getRes("skeleton");
         //获取纹理集数据
         var textureData = RES.getRes("textureConfig");
         //获取纹理集图片
         var texture = RES.getRes("texture");
      
         //创建一个工厂，用来创建Armature
         var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
         //把动画数据添加到工厂里
         factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
         //把纹理集数据和图片添加到工厂里
         factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
         //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
         var armatureName:string = skeletonData.armature[0].name;
         //从工厂里创建出Armature
         var armature:dragonBones.Armature = factory.buildArmature(armatureName);
         //获取装载Armature的容器
         var armatureDisplay = armature.display;
         //把它添加到舞台上
         this.addChild(armatureDisplay);
         //取得这个Armature动画列表中的第一个动画的名字
         var curAnimationName = armature.animation.animationList[0];
         //播放这个动画，gotoAndPlay参数说明,具体详见Animation类
         //第一个参数 animationName {string} 指定播放动画的名称.
         //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
         //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
         armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
         //把Armature添加到心跳时钟里
         dragonBones.WorldClock.clock.add(armature);
         //心跳时钟开启
         egret.Ticker.getInstance().register(function (advancedTime) {
             dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
         }, this);
       </pre>
     */
    class BaseFactory extends EventDispatcher {
        static _helpMatrix: Matrix;
        /** @private */
        dragonBonesDataDic: any;
        /** @private */
        textureAtlasDic: any;
        constructor(self: BaseFactory);
        /**
         * 释放资源
         * @param  disposeData {boolean} (optional) 是否释放所有内部的引用
         */
        dispose(disposeData?: boolean): void;
        /**
         * 根据名字获取一个DragonBonesData
         * @param name {string} 想要获取的DragonBonesData的名字
         * @returns {dragonBones.DragonBonesData} 返回指定名字的DragonBonesData（如果存在的话）
         */
        getDragonBonesData(name: string): DragonBonesData;
        /**
         * 根据名字获取一个DragonBonesData（不推荐使用）
         * 建议使用方法getDragonBonesData来代替这个方法
         */
        getSkeletonData(name: string): DragonBonesData;
        /**
         * 添加一个DragonBonesData实例
         * @param data {dragonBones.DragonBonesData} 一个DragonBonesData实例
         * @param name {string} (optional) DragonBonesData的名字
         */
        addDragonBonesData(data: DragonBonesData, name?: string): void;
        /**
         * 添加一个DragonBonesData实例（不推荐使用）
         * 建议使用方法addDragonBonesData来代替
         */
        addSkeletonData(data: DragonBonesData, name?: string): void;
        /**
         * 根据名字移除一个DragonBonesData实例.
         * @param name {string} 想要移除的DragonBonesData的名字
         */
        removeDragonBonesData(name: string): void;
        /**
         * 根据名字移除一个DragonBonesData实例.（不推荐使用）
         * 建议使用方法removeDragonBonesData代替
         */
        removeSkeletonData(name: string): void;
        /**
         * 根据名字获取纹理集TextureAtlas
         * @param name {string} 需要获取的纹理集TextureAtlas的名字
         * @returns {any} 纹理集TextureAtlas
         */
        getTextureAtlas(name: string): any;
        /**
         * 添加一个纹理集
         * @param textureAtlas {any} 需要被添加的纹理集
         * @param name {string} (optional) 需要被添加的纹理集的名字
         */
        addTextureAtlas(textureAtlas: any, name?: string): void;
        /**
         * 移除指定名字的纹理集
         * @param name {string} 需要移除的纹理集的名字
         */
        removeTextureAtlas(name: string): void;
        /**
         * 获取TextureDisplay
         * @param textureName {string} 纹理的名字
         * @param textureAtlasName {string} 纹理集的名字
         * @param pivotX {number} 轴点的x坐标
         * @param pivotY {number} 轴点的y坐标
         * @returns {any} 返回的TextureDisplay
         */
        getTextureDisplay(textureName: string, textureAtlasName?: string, pivotX?: number, pivotY?: number): any;
        /**
         * 构建骨架
         * 一般情况下dragonBonesData和textureAtlas是一对一的，通过相同的key对应。
         * TO DO 以后会支持一对多的情况
         * @param armatureName 骨架的名字
         * @param fromDragonBonesDataName 骨架数据的名字 可选参数
         * @param fromTextureAtlasName 纹理集的名字 可选参数
         * @param skinName 皮肤的名字 可选参数
         * @returns {*}
         */
        buildArmature(armatureName: string, fromDragonBonesDataName?: string, fromTextureAtlasName?: string, skinName?: string): Armature;
        /**
         * 构建fast骨架
         * 一般情况下dragonBonesData和textureAtlas是一对一的，通过相同的key对应。
         * TO DO 以后会支持一对多的情况
         * @param armatureName 骨架的名字
         * @param fromDragonBonesDataName 骨架数据的名字 可选参数
         * @param fromTextureAtlasName 纹理集的名字 可选参数
         * @param skinName 皮肤的名字 可选参数
         * @returns {*}
         */
        buildFastArmature(armatureName: string, fromDragonBonesDataName?: string, fromTextureAtlasName?: string, skinName?: string): FastArmature;
        /**
         * 用dragonBones数据，骨架数据，纹理集数据来构建骨架
         * @param dragonBonesData dragonBones数据
         * @param armatureData 骨架数据
         * @param textureAtlas 纹理集
         * @param skinName 皮肤名称 可选参数
         * @returns {Armature}
         */
        buildArmatureUsingArmatureDataFromTextureAtlas(dragonBonesData: DragonBonesData, armatureData: ArmatureData, textureAtlas: any, skinName?: string): Armature;
        /**
         * 用dragonBones数据，骨架数据，纹理集数据来构建骨架
         * @param dragonBonesData dragonBones数据
         * @param armatureData 骨架数据
         * @param textureAtlas 纹理集
         * @param skinName 皮肤名称 可选参数
         * @returns {Armature}
         */
        buildFastArmatureUsingArmatureDataFromTextureAtlas(dragonBonesData: DragonBonesData, armatureData: ArmatureData, textureAtlas: any, skinName?: string): FastArmature;
        /**
         * 拷贝动画到骨架中
         * 暂时不支持ifRemoveOriginalAnimationList为false的情况
         * @param toArmature  拷贝到的那个骨架
         * @param fromArmatreName 从哪个骨架里拷贝，骨架的名字
         * @param fromDragonBonesDataName 从哪个DragonBones数据中拷贝，Dragonbones数据的名字
         * @param ifRemoveOriginalAnimationList 是否移除原骨架里的动画，暂时不支持为false的情况
         * @returns {boolean}
         */
        copyAnimationsToArmature(toArmature: Armature, fromArmatreName: string, fromDragonBonesDataName?: string, ifRemoveOriginalAnimationList?: boolean): boolean;
        private fillBuildArmatureDataPackageArmatureInfo(armatureName, dragonBonesDataName, outputBuildArmatureDataPackage);
        private fillBuildArmatureDataPackageTextureInfo(fromTextureAtlasName, outputBuildArmatureDataPackage);
        private findFirstDragonBonesData();
        private findFirstTextureAtlas();
        _buildBones(armature: Armature): void;
        _buildSlots(armature: Armature, skinName: string, textureAtlas: any): void;
        _buildFastBones(armature: FastArmature): void;
        _buildFastSlots(armature: FastArmature, skinName: string, textureAtlas: any): void;
        /**
         * @private
         * Generates an Armature instance.
         * @returns {dragonBones.Armature} Armature An Armature instance.
         */
        _generateArmature(): Armature;
        /**
         * @private
         * Generates an Slot instance.
         * @returns {dragonBones.Slot} Slot An Slot instance.
         */
        _generateSlot(): Slot;
        /**
         * @private
         * Generates an Armature instance.
         * @returns {dragonBones.Armature} Armature An Armature instance.
         */
        _generateFastArmature(): FastArmature;
        /**
         * @private
         * Generates an Slot instance.
         * @returns {dragonBones.Slot} Slot An Slot instance.
         */
        _generateFastSlot(): FastSlot;
        /**
         * @private
         * Generates a DisplayObject
         * @param textureAtlas {any} The TextureAtlas.
         * @param fullName {string} A qualified name.
         * @param pivotX {number} A pivot x based value.
         * @param pivotY {number} A pivot y based value.
         * @returns {any}
         */
        _generateDisplay(textureAtlas: any, fullName: string, pivotX: number, pivotY: number): any;
    }
    class BuildArmatureDataPackage {
        dragonBonesDataName: string;
        dragonBonesData: DragonBonesData;
        armatureData: ArmatureData;
        textureAtlas: any;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.FastArmature
     * @classdesc
     * FastArmature 是 DragonBones 高效率的骨骼动画系统。他能缓存动画数据，大大减少动画播放的计算
     * 不支持动态添加Bone和Slot，换装请通过更换Slot的dispaly或子骨架childArmature来实现
     * @extends dragonBones.EventDispatcher
     * @see dragonBones.ArmatureData
     *
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class FastArmature extends EventDispatcher implements ICacheableArmature {
        /**
         * The name should be same with ArmatureData's name
         */
        name: string;
        /**
         * An object that can contain any user extra data.
         */
        userData: any;
        private _enableCache;
        /**
         * 保证CacheManager是独占的前提下可以开启，开启后有助于性能提高
         */
        isCacheManagerExclusive: boolean;
        /** @private */
        _animation: FastAnimation;
        /** @private */
        _display: any;
        /** @private Store bones based on bones' hierarchy (From root to leaf)*/
        boneList: Array<FastBone>;
        _boneDic: any;
        /** @private Store slots based on slots' zOrder*/
        slotList: Array<FastSlot>;
        _slotDic: any;
        slotHasChildArmatureList: Array<FastSlot>;
        _enableEventDispatch: boolean;
        __dragonBonesData: DragonBonesData;
        _armatureData: ArmatureData;
        _slotsZOrderChanged: boolean;
        _eventList: Array<any>;
        private _delayDispose;
        private _lockDispose;
        private useCache;
        constructor(display: any);
        /**
         * Cleans up any resources used by this instance.
         */
        dispose(): void;
        /**
         * Update the animation using this method typically in an ENTERFRAME Event or with a Timer.
         * @param The amount of second to move the playhead ahead.
         */
        advanceTime(passedTime: number): void;
        /**
         * 开启动画缓存
         * @param  {number} 帧速率，每秒缓存多少次数据，越大越流畅,若值小于零会被设置为动画数据中的默认帧率
         * @param  {Array<any>} 需要缓存的动画列表，如果为null，则全部动画都缓存
         * @param  {boolean} 动画是否是循环动画，仅在3.0以下的数据格式使用，如果动画不是循环动画请设置为false，默认为true。
         * @return {AnimationCacheManager}  返回缓存管理器，可以绑定到其他armature以减少内存
         */
        enableAnimationCache(frameRate: number, animationList?: Array<any>, loop?: boolean): AnimationCacheManager;
        /**
         * 获取指定名称的 Bone
         * @param boneName {string} Bone名称
         * @returns {FastBone}
         */
        getBone(boneName: string): FastBone;
        /**
         * 获取指定名称的 Slot
         * @param slotName {string} Slot名称
         * @returns {FastSlot}
         */
        getSlot(slotName: string): FastSlot;
        /**
         * 获取包含指定显示对象的 Bone
         * @param display {any} 显示对象实例
         * @returns {FastBone}
         */
        getBoneByDisplay(display: any): FastBone;
        /**
         * 获取包含指定显示对象的 Slot
         * @param displayObj {any} 显示对象实例
         * @returns {FastSlot}
         */
        getSlotByDisplay(displayObj: any): FastSlot;
        /**
         * 获取骨架包含的所有插槽
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {FastSlot[]}
         */
        getSlots(returnCopy?: boolean): Array<FastSlot>;
        _updateBonesByCache(): void;
        /**
         * 在骨架中为指定名称的 FastBone 添加一个子 FastBone.
         * 和Armature不同,FastArmature的这个方法不能在运行时动态添加骨骼
         * @param bone {FastBone} FastBone 实例
         * @param parentName {string} 父骨头名称 默认：null
         */
        addBone(bone: FastBone, parentName?: string): void;
        /**
         * 为指定名称的 FastBone 添加一个子 FastSlot.
         * 和Armature不同,FastArmature的这个方法不能在运行时动态添加插槽
         * @param slot {FastSlot} FastSlot 实例
         * @param boneName {string}
         * @see dragonBones.Bone
         */
        addSlot(slot: FastSlot, parentBoneName: string): void;
        /**
         * 按照显示层级为所有 Slot 排序
         */
        updateSlotsZOrder(): void;
        private sortBoneList();
        /** @private When AnimationState enter a key frame, call this func*/
        arriveAtFrame(frame: Frame, animationState: FastAnimationState): void;
        invalidUpdate(boneName?: string): void;
        resetAnimation(): void;
        private sortSlot(slot1, slot2);
        /**
         * 获取FastAnimation实例
         * @returns {any} FastAnimation实例
         */
        getAnimation(): any;
        /**
         * ArmatureData.
         * @see dragonBones.ArmatureData.
         */
        armatureData: ArmatureData;
        /**
         * An Animation instance
         * @see dragonBones.Animation
         */
        animation: FastAnimation;
        /**
         * Armature's display object. It's instance type depends on render engine. For example "flash.display.DisplayObject" or "startling.display.DisplayObject"
         */
        display: any;
        enableCache: boolean;
        enableEventDispatch: boolean;
        _addEvent(event: Event): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.FastDBObject
     * @classdesc
     * FastDBObject 是 FastBone 和 FastSlot 的基类
     * @see dragonBones.FastBone
     * @see dragonBones.FastSlot
     */
    class FastDBObject {
        private _name;
        /**
         * An object that can contain any user extra data.
         */
        userData: any;
        /**
         *
         */
        inheritRotation: boolean;
        /**
         *
         */
        inheritScale: boolean;
        /**
         *
         */
        inheritTranslation: boolean;
        /** @private */
        _global: DBTransform;
        /** @private */
        _globalTransformMatrix: Matrix;
        /** @private */
        _globalBackup: DBTransform;
        /** @private */
        _globalTransformMatrixBackup: Matrix;
        static _tempParentGlobalTransform: DBTransform;
        _frameCache: FrameCache;
        /** @private */
        updateByCache(): void;
        /** @private */
        switchTransformToBackup(): void;
        /**
         * The armature this DBObject instance belongs to.
         */
        armature: FastArmature;
        /** @private */
        _origin: DBTransform;
        /** @private */
        _visible: boolean;
        /** @private */
        _parent: FastBone;
        /** @private */
        setParent(value: FastBone): void;
        constructor();
        /**
         * Cleans up any resources used by this DBObject instance.
         */
        dispose(): void;
        private static tempOutputObj;
        _calculateParentTransform(): any;
        _updateGlobal(): any;
        _calculateRelativeParentTransform(): void;
        name: string;
        /**
         * This DBObject instance global transform instance.
         * @see dragonBones.DBTransform
         */
        global: DBTransform;
        globalTransformMatrix: Matrix;
        /**
         * This DBObject instance related to parent transform instance.
         * @see dragonBones.DBTransform
         */
        origin: DBTransform;
        /**
         * Indicates the Bone instance that directly contains this DBObject instance if any.
         */
        parent: FastBone;
        visible: boolean;
        frameCache: FrameCache;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.FastBone
     * @classdesc
     * FastBone 实例代表 FastArmature 中的一个骨头。一个FastArmature实例可以由很多 FastBone组成。
     * FastBone 在骨骼动画体系中是最重要的逻辑单元之一，负责动画中的平移旋转缩放的实现
     * 和Bone相比，FastBone不能动态添加子骨骼和子插槽
     * @extends dragonBones.FastDBObject
     * @see dragonBones.FastArmature
     * @see dragonBones.FastSlot
     * @see dragonBones.BoneData
     */
    class FastBone extends FastDBObject {
        static initWithBoneData(boneData: BoneData): FastBone;
        slotList: Array<FastSlot>;
        boneList: Array<FastBone>;
        /** @private */
        _timelineState: FastBoneTimelineState;
        /** @private */
        _needUpdate: number;
        _tweenPivot: Point;
        constructor();
        /**
         * 获取当前骨头包含的所有 FastBone 实例
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {FastBone[]}
         */
        getBones(returnCopy?: boolean): Array<FastBone>;
        /**
         * 获取当前骨头包含的所有 FastSlot 实例
         * @param returnCopy {boolean} 是否返回拷贝。默认：true
         * @returns {FastSlot[]}
         */
        getSlots(returnCopy?: boolean): Array<FastSlot>;
        /**
         * @inheritDoc
         */
        dispose(): void;
        /**
         * 在下一帧强制更新当前 Bone 实例及其包含的所有 Slot 的动画。
         */
        invalidUpdate(): void;
        _calculateRelativeParentTransform(): void;
        /** @private */
        updateByCache(): void;
        /** @private */
        update(needUpdate?: boolean): void;
        /** @private */
        _hideSlots(): void;
        private blendingTimeline();
        /** @private When bone timeline enter a key frame, call this func*/
        arriveAtFrame(frame: Frame, animationState: FastAnimationState): void;
        /**
         * 不推荐的API,建议使用 slot.childArmature 替代
         */
        childArmature: any;
        /**
         * 不推荐的API,建议使用 slot.display 替代
         */
        display: any;
        /** @private */
        visible: boolean;
        /**
         * 返回当前 FastBone 实例包含的第一个 FastSlot 实例
         * @member {FastSlot} dragonBones.FastBone#slot
         */
        slot: FastSlot;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.FastSlot
     * @classdesc
     * FastSlot 实例是骨头上的一个插槽，是显示图片的容器。
     * 一个 FastBone 上可以有多个FastSlot，每个FastSlot中同一时间都会有一张图片用于显示，不同的FastSlot中的图片可以同时显示。
     * 每个 FastSlot 中可以包含多张图片，同一个 FastSlot 中的不同图片不能同时显示，但是可以在动画进行的过程中切换，用于实现帧动画。
     * @extends dragonBones.DBObject
     * @see dragonBones.FastArmature
     * @see dragonBones.FastBone
     * @see dragonBones.SlotData
     */
    class FastSlot extends FastDBObject implements ISlotCacheGenerator {
        /** @private Need to keep the reference of DisplayData. When slot switch displayObject, it need to restore the display obect's origional pivot. */
        _displayDataList: Array<DisplayData>;
        /** @private */
        _originZOrder: number;
        /** @private */
        _tweenZOrder: number;
        /** @private */
        _offsetZOrder: number;
        /** @private */
        _originDisplayIndex: number;
        _displayList: Array<any>;
        _currentDisplayIndex: number;
        _colorTransform: ColorTransform;
        _isColorChanged: boolean;
        _currentDisplay: any;
        _blendMode: string;
        hasChildArmature: boolean;
        constructor(self: FastSlot);
        /**
         * 通过传入 SlotData 初始化FastSlot
         * @param slotData
         */
        initWithSlotData(slotData: SlotData): void;
        /**
         * @inheritDoc
         */
        dispose(): void;
        /** @private */
        updateByCache(): void;
        /** @private */
        _update(): void;
        _calculateRelativeParentTransform(): void;
        initDisplayList(newDisplayList: Array<any>): void;
        private clearCurrentDisplay();
        /** @private */
        _changeDisplayIndex(displayIndex?: number): void;
        private changeSlotDisplay(value);
        private initCurrentDisplay(slotIndex?);
        /** @private */
        visible: boolean;
        /**
         * 显示对象列表(包含 display 或者 子骨架)
         * @member {any[]} dragonBones.FastSlot#displayList
         */
        displayList: Array<any>;
        /**
         * 当前的显示对象(可能是 display 或者 子骨架)
         * @member {any} dragonBones.FastSlot#display
         */
        display: any;
        /**
         * 当前的子骨架
         * @member {FastArmature} dragonBones.Slot#childArmature
         */
        childArmature: any;
        /**
         * 显示顺序。(支持小数用于实现动态插入slot)
         * @member {number} dragonBones.FastSlot#zOrder
         */
        zOrder: number;
        /**
         * 混合模式
         * @member {string} dragonBones.FastSlot#blendMode
         */
        blendMode: string;
        colorTransform: ColorTransform;
        displayIndex: number;
        colorChanged: boolean;
        /**
         * @private
         */
        _updateDisplay(value: any): void;
        /**
         * @private
         */
        _getDisplayIndex(): number;
        /**
         * @private
         * Adds the original display object to another display object.
         * @param container
         * @param index
         */
        _addDisplayToContainer(container: any, index?: number): void;
        /**
         * @private
         * remove the original display object from its parent.
         */
        _removeDisplayFromContainer(): void;
        /**
         * @private
         * Updates the transform of the slot.
         */
        _updateTransform(): void;
        /**
         * @private
         */
        _updateDisplayVisible(value: boolean): void;
        /**
         * @private
         * Updates the color of the display object.
         * @param a
         * @param r
         * @param g
         * @param b
         * @param aM
         * @param rM
         * @param gM
         * @param bM
         */
        _updateDisplayColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number, colorChanged?: boolean): void;
        /**
         * @private
         * Update the blend mode of the display object.
         * @param value The blend mode to use.
         */
        _updateDisplayBlendMode(value: string): void;
        /** @private When slot timeline enter a key frame, call this func*/
        _arriveAtFrame(frame: Frame, animationState: FastAnimationState): void;
        /** @private */
        hideSlots(): void;
        _updateGlobal(): any;
        _resetToOrigin(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.FastAnimation
     * @classdesc
     * FastAnimation实例隶属于FastArmature,用于控制FastArmature的动画播放。
     * 和Animation相比，FastAnimation为了优化性能，不支持动画融合，在开启缓存的情况下，不支持无极的平滑补间
     * @see dragonBones.FastBone
     * @see dragonBones.FastArmature
     * @see dragonBones.FastAnimationState
     * @see dragonBones.AnimationData.
     *
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class FastAnimation {
        /**
         * 所有动画名称列表.
         * @member {string[]} dragonBones.FastAnimation#animationList
         */
        animationList: Array<string>;
        /**
         * 当前正在运行的动画实例.
         * @member {FastAnimationState} dragonBones.FastAnimation#animationState
         */
        animationState: FastAnimationState;
        /**
         * 动画缓存管理器.
         * @member {AnimationCacheManager} dragonBones.FastAnimation#animationCacheManager
         */
        animationCacheManager: AnimationCacheManager;
        private _armature;
        private _animationDataList;
        private _animationDataObj;
        private _isPlaying;
        private _timeScale;
        /**
         * 创建一个新的FastAnimation实例并赋给传入的FastArmature实例
         * @param armature {FastArmature} 骨架实例
         */
        constructor(armature: FastArmature);
        /**
         * Qualifies all resources used by this Animation instance for garbage collection.
         */
        dispose(): void;
        /**
         * 开始播放指定名称的动画。
         * 要播放的动画将经过指定时间的淡入过程，然后开始播放，同时之前播放的动画会经过相同时间的淡出过程。
         * @param animationName {string} 指定播放动画的名称.
         * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
         * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         * @param playTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
         * @see dragonBones.FastAnimationState.
         */
        gotoAndPlay(animationName: string, fadeInTime?: number, duration?: number, playTimes?: number): FastAnimationState;
        /**
         * 播放指定名称的动画并停止于某个时间点
         * @param animationName {string} 指定播放的动画名称.
         * @param time {number} 动画停止的绝对时间
         * @param normalizedTime {number} 动画停止的相对动画总时间的系数，这个参数和time参数是互斥的（例如 0.2：动画停止总时间的20%位置） 默认值：-1 意味着使用绝对时间。
         * @param fadeInTime {number} 动画淡入时间 (>= 0), 默认值：0
         * @param duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         * @see dragonBones.FastAnimationState.
         */
        gotoAndStop(animationName: string, time: number, normalizedTime?: number, fadeInTime?: number, duration?: number): FastAnimationState;
        /**
         * 从当前位置继续播放动画
         */
        play(): void;
        /**
         * 暂停动画播放
         */
        stop(): void;
        /** @private */
        advanceTime(passedTime: number): void;
        /**
         * check if contains a AnimationData by name.
         * @return Boolean.
         * @see dragonBones.AnimationData.
         */
        hasAnimation(animationName: string): boolean;
        /**
         * 时间缩放倍数
         * @member {number} dragonBones.FastAnimation#timeScale
         */
        timeScale: number;
        /**
         * 包含的所有动画数据列表
         * @member {AnimationData[]} dragonBones.FastAnimation#animationDataList
         * @see dragonBones.AnimationData.
         */
        animationDataList: Array<AnimationData>;
        /**
         * Unrecommended API. Recommend use animationList.
         */
        movementList: Array<string>;
        /**
         * Unrecommended API. Recommend use lastAnimationName.
         */
        movementID: string;
        /**
         * 是否正在播放
         * @member {boolean} dragonBones.FastAnimation#isPlaying
         */
        isPlaying(): boolean;
        /**
         * 是否播放完成.
         * @member {boolean} dragonBones.FastAnimation#isComplete
         */
        isComplete: boolean;
        /**
         * 当前播放动画的实例.
         * @member {FastAnimationState} dragonBones.FastAnimation#lastAnimationState
         */
        lastAnimationState: FastAnimationState;
        /**
         * 当前播放动画的名字.
         * @member {string} dragonBones.FastAnimation#lastAnimationName
         */
        lastAnimationName: string;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.FastAnimationState
     * @classdesc
     * FastAnimationState 实例代表播放的动画， 可以对单个动画的播放进行最细致的调节。
     * @see dragonBones.Animation
     * @see dragonBones.AnimationData
     * @example
       <pre>
        //获取动画数据
        var skeletonData = RES.getRes("skeleton");
        //获取纹理集数据
        var textureData = RES.getRes("textureConfig");
        //获取纹理集图片
        var texture = RES.getRes("texture");
      
        //创建一个工厂，用来创建Armature
        var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
        //把动画数据添加到工厂里
        factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        //把纹理集数据和图片添加到工厂里
        factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
      
        //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
        var armatureName:string = skeletonData.armature[0].name;
        //从工厂里创建出Armature
        var armature:dragonBones.FastArmature = factory.buildFastArmature(armatureName);
        //获取装载Armature的容器
        var armatureDisplay = armature.display;
        //把它添加到舞台上
        this.addChild(armatureDisplay);
        
        //以60fps的帧率开启动画缓存，缓存所有的动画数据
        var animationCachManager:dragonBones.AnimationCacheManager = armature.enableAnimationCache(60);
      
       //取得这个Armature动画列表中的第一个动画的名字
        var curAnimationName = armature.animation.animationList[0];
        //播放这个动画，gotoAndPlay各个参数说明
        //第一个参数 animationName {string} 指定播放动画的名称.
        //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
        //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
        //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
        armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
        //把Armature添加到心跳时钟里
        dragonBones.WorldClock.clock.add(armature);
        //心跳时钟开启
        egret.Ticker.getInstance().register(function (advancedTime) {
            dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
        }, this);
       </pre>
     */
    class FastAnimationState implements IAnimationState {
        animationCache: AnimationCache;
        /**
         * 是否自动补间。
         * @member {boolean} dragonBones.AnimationState#autoTween
         */
        autoTween: boolean;
        private _progress;
        _armature: FastArmature;
        private _boneTimelineStateList;
        private _slotTimelineStateList;
        animationData: AnimationData;
        name: string;
        private _time;
        private _currentFrameIndex;
        private _currentFramePosition;
        private _currentFrameDuration;
        private _currentPlayTimes;
        private _totalTime;
        private _currentTime;
        private _lastTime;
        private _isComplete;
        private _isPlaying;
        private _timeScale;
        private _playTimes;
        private _fading;
        _fadeTotalTime: number;
        constructor();
        dispose(): void;
        /**
         * 播放当前动画。如果动画已经播放完毕, 将不会继续播放.
         * @returns {FastAnimationState} 动画播放状态实例
         */
        play(): FastAnimationState;
        /**
         * 暂停当前动画的播放。
         * @returns {AnimationState} 动画播放状态实例
         */
        stop(): FastAnimationState;
        setCurrentTime(value: number): FastAnimationState;
        _resetTimelineStateList(): void;
        /** @private */
        _fadeIn(aniData: AnimationData, playTimes: number, timeScale: number, fadeTotalTime: number): void;
        /**
         * @private
         * Update timeline state based on mixing transforms and clip.
         */
        _updateTimelineStateList(): void;
        /** @private */
        _advanceTime(passedTime: number): void;
        private advanceTimelinesTime(passedTime);
        private updateTransformTimeline(progress);
        private updateMainTimeline(isThisComplete);
        private setTimeScale(value);
        private setPlayTimes(value?);
        /**
         * 播放次数 (0:循环播放， >0:播放次数)
         * @member {number} dragonBones.FastAnimationState#playTimes
         */
        playTimes: number;
        /**
         * 当前播放次数
         * @member {number} dragonBones.FastAnimationState#currentPlayTimes
         */
        currentPlayTimes: number;
        /**
         * 是否播放完成
         * @member {boolean} dragonBones.FastAnimationState#isComplete
         */
        isComplete: boolean;
        /**
         * 是否正在播放
         * @member {boolean} dragonBones.FastAnimationState#isPlaying
         */
        isPlaying: boolean;
        /**
         * 动画总时长（单位：秒）
         * @member {number} dragonBones.FastAnimationState#totalTime
         */
        totalTime: number;
        /**
         * 动画当前播放时间（单位：秒）
         * @member {number} dragonBones.FastAnimationState#currentTime
         */
        currentTime: number;
        /**
         * 是否使用缓存
         * @member {boolean} dragonBones.FastAnimationState#isUseCache
         */
        isUseCache(): boolean;
        private hideBones();
        /**
         * 动画播放进度
         * @member {number} dragonBones.FastAnimationState#progress
         */
        progress: number;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.FastBoneTimelineState
     * @classdesc
     * FastBoneTimelineState 负责计算 Bone 的时间轴动画。
     * FastBoneTimelineState 实例隶属于 FastAnimationState. FastAnimationState在创建时会为每个包含动作的 FastBone生成一个 FastBoneTimelineState 实例.
     * @see dragonBones.FastAnimation
     * @see dragonBones.FastAnimationState
     * @see dragonBones.FastBone
     */
    class FastBoneTimelineState {
        private static _pool;
        /** @private */
        static borrowObject(): FastBoneTimelineState;
        /** @private */
        static returnObject(timeline: FastBoneTimelineState): void;
        /** @private */
        static clear(): void;
        name: string;
        private _totalTime;
        private _currentTime;
        private _lastTime;
        private _currentFrameIndex;
        private _currentFramePosition;
        private _currentFrameDuration;
        private _bone;
        private _timelineData;
        private _durationTransform;
        private _tweenTransform;
        private _tweenEasing;
        private _tweenCurve;
        private _updateMode;
        private _transformToFadein;
        /** @private */
        _animationState: FastAnimationState;
        /** @private */
        _isComplete: boolean;
        /** @private */
        _transform: DBTransform;
        _durationPivot: Point;
        _originPivot: Point;
        _pivot: Point;
        constructor();
        private clear();
        /** @private */
        fadeIn(bone: FastBone, animationState: FastAnimationState, timelineData: TransformTimeline): void;
        /** @private */
        updateFade(progress: number): void;
        /** @private */
        update(progress: number): void;
        private updateSingleFrame();
        private updateMultipleFrame(progress);
        private updateToNextFrame(currentPlayTimes?);
        private updateTween();
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.FastSlotTimelineState
     * @classdesc
     * FastSlotTimelineState 负责计算 Slot 的时间轴动画。
     * FastSlotTimelineState 实例隶属于 FastAnimationState. FastAnimationState在创建时会为每个包含动作的 Slot生成一个 FastSlotTimelineState 实例.
     * @see dragonBones.FastAnimation
     * @see dragonBones.FastAnimationState
     * @see dragonBones.FastSlot
     */
    class FastSlotTimelineState {
        private static HALF_PI;
        private static DOUBLE_PI;
        private static _pool;
        /** @private */
        static borrowObject(): FastSlotTimelineState;
        /** @private */
        static returnObject(timeline: FastSlotTimelineState): void;
        /** @private */
        static clear(): void;
        name: string;
        /** @private */
        _weight: number;
        /** @private */
        _blendEnabled: boolean;
        /** @private */
        _isComplete: boolean;
        /** @private */
        _animationState: FastAnimationState;
        private _totalTime;
        private _currentTime;
        private _currentFrameIndex;
        private _currentFramePosition;
        private _currentFrameDuration;
        private _tweenEasing;
        private _tweenCurve;
        private _tweenColor;
        private _colorChanged;
        private _updateMode;
        private _armature;
        private _animation;
        private _slot;
        private _timelineData;
        private _durationColor;
        constructor();
        private clear();
        /** @private */
        fadeIn(slot: FastSlot, animationState: FastAnimationState, timelineData: SlotTimeline): void;
        /** @private */
        updateFade(progress: number): void;
        /** @private */
        update(progress: number): void;
        private updateMultipleFrame(progress);
        private updateToNextFrame(currentPlayTimes?);
        private updateTween();
        private updateSingleFrame();
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.Point
     * @classdesc
     * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
     * 下面的代码在 (0,0) 处创建一个点：
     *   var myPoint:Point = new Point();
     */
    class Point {
        /**
         *该点的水平坐标。
         * @member {number} dragonBones.Point#x
         */
        x: number;
        /**
         *该点的垂直坐标。
         * @member {number} dragonBones.Point#y
         */
        y: number;
        /**
         *创建一个新点。
         * @param x 该点的水平坐标。
         * @param y 该点的垂直坐标。
         */
        constructor(x?: number, y?: number);
        /**
         *返回包含 x 和 y 坐标的值的字符串。
         * @returns {string}
         */
        toString(): string;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones
     * @classdesc
     * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     */
    class Rectangle {
        /**
         * 矩形左上角的 x 坐标。
         * @member {number} dragonBones.Rectangle#x
         */
        x: number;
        /**
         * 矩形左上角的 y 坐标。
         * @member {number} dragonBones.Rectangle#y
         */
        y: number;
        /**
         * 矩形的宽度（以像素为单位）
         * @member {number} dragonBones.Rectangle#width
         */
        width: number;
        /**
         * 矩形的高度（以像素为单位）。
         * @member {number} dragonBones.Rectangle#height
         */
        height: number;
        /**
         *创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度（以像素为单位）
         * @param height 矩形的高度（以像素为单位）。
         */
        constructor(x?: number, y?: number, width?: number, height?: number);
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.Timeline
     * @classdesc
     * 保存时间轴相关的数据，包括关键帧，持续时间，时间缩放
     */
    class Timeline {
        /**
         * 持续时间，单位是帧
         * @member {number} dragonBones.Timeline#duration
         */
        duration: number;
        /**
         * 时间缩放，设置为2，时间放慢一倍，设置为0.5，时间加快一倍，默认为1
         * @member {number} dragonBones.Timeline#scale
         */
        scale: number;
        private _frameList;
        /**
         * 初始化数据duration为0，scale为1
         */
        constructor();
        dispose(): void;
        /**
         * 添加一个关键帧数据
         * @param frame 关键帧数据
         * @see extension.dragonbones.model.Frame
         */
        addFrame(frame: Frame): void;
        /**
         * 获取关键帧列表
         * @returns {Array<Frame>}
         */
        frameList: Array<Frame>;
    }
}
declare module dragonBones {
    /**
     * @class dragonbones.AnimationData
     * @extends dragonbones.Timeline
     * @classdesc
     * 保存动画数据
     */
    class AnimationData extends Timeline {
        /**
         * 动画的名字
         * @member {string} dragonBones.AnimationData#name
         */
        name: string;
        /**
         * 动画的帧率，表示每一秒钟播放多少帧
         * @member {number} dragonBones.AnimationData#frameRate
         */
        frameRate: number;
        /**
         * 动画过渡时间，表示从其他动画过渡到这个动画需要的时间
         * @member {number} dragonBones.AnimationData#fadeTime
         */
        fadeTime: number;
        /**
         * 	播放次数 0为一直播放，默认为0
         * @member {number} dragonBones.AnimationData#playTimes
         */
        playTimes: number;
        /**
         * 动画的缓动参数，取值范围是[-1,2],其中[-1, 0)表示缓进，(0, 1]表示缓出(1, 2]表示缓进缓出，0表示不缓动，线性渐变
         * 这个参数会被帧数据中的tweenEasing覆盖
         * @member {number} dragonBones.AnimationData#tweenEasing
         */
        tweenEasing: number;
        /**
         * 是否开启缓动，默认是true，就是开启缓动
         * @member {boolean} dragonBones.AnimationData#autoTween
         */
        autoTween: boolean;
        /**
         * 最后一帧持续的帧数
         * @member {number} dragonBones.AnimationData#lastFrameDuration
         */
        lastFrameDuration: number;
        hideTimelineNameMap: Array<string>;
        hideSlotTimelineNameMap: Array<string>;
        private _timelineList;
        /**
         * 时间轴列表
         * @returns {Array<TransformTimeline>}
         */
        timelineList: Array<TransformTimeline>;
        private _slotTimelineList;
        slotTimelineList: Array<SlotTimeline>;
        /**
         * 创建一个AnimationData实例
         */
        constructor();
        /**
         * 释放资源
         */
        dispose(): void;
        /**
         * 根据时间轴的名字获取时间轴数据
         * @param timelineName 时间轴的名字
         * @returns {*} 时间轴数据
         */
        getTimeline(timelineName: string): TransformTimeline;
        /**
         * 添加一个时间轴数据
         * @param timeline 需要被添加的时间轴数据
         */
        addTimeline(timeline: TransformTimeline): void;
        getSlotTimeline(timelineName: string): SlotTimeline;
        addSlotTimeline(timeline: SlotTimeline): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.ArmatureData
     * @classdesc
     * armature数据 一个armature数据包含一个角色的骨骼，皮肤，动画的数据
     * @see  dragonBones.BoneData
     * @see  dragonBones.SkinData
     * @see  dragonBones.AnimationData
     */
    class ArmatureData {
        /**
         * armature数据的名字
         * @member {string} dragonBones.ArmatureData#name
         */
        name: string;
        private _boneDataList;
        private _skinDataList;
        private _slotDataList;
        private _animationDataList;
        static sortBoneDataHelpArray(object1: any, object2: any): number;
        static sortBoneDataHelpArrayDescending(object1: any, object2: any): number;
        /**
         * 创建一个ArmatureData实例
         */
        constructor();
        setSkinData(skinName: String): void;
        /**
         * 释放资源
         */
        dispose(): void;
        /**
         * 根据骨骼的名字获取到骨骼数据
         * @param boneName 骨骼的名字
         * @returns {*} 骨骼数据
         */
        getBoneData(boneName: string): BoneData;
        getSlotData(slotName: string): SlotData;
        /**
         * 根据皮肤的名字获取到皮肤数据
         * @param skinName  皮肤的名字
         * @returns {*}  皮肤数据
         */
        getSkinData(skinName: string): SkinData;
        /**
         * 根据动画的名字获取动画数据
         * @param animationName 动画的名字
         * @returns {*} 动画数据
         */
        getAnimationData(animationName: string): AnimationData;
        /**
         *添加一个骨骼数据
         * @param boneData
         */
        addBoneData(boneData: BoneData): void;
        addSlotData(slotData: SlotData): void;
        /**
         * 添加一个皮肤数据
         * @param skinData
         */
        addSkinData(skinData: SkinData): void;
        /**
         * 添加一个动画数据
         * @param animationData
         */
        addAnimationData(animationData: AnimationData): void;
        /**
         * 对骨骼按照骨骼数的层级关系排序
         */
        sortBoneDataList(): void;
        /**
         * 获取骨骼数据列表
         * @returns {Array<BoneData>}
         */
        boneDataList: Array<BoneData>;
        slotDataList: Array<SlotData>;
        /**
         * 获取皮肤数据列表
         * @returns {Array<SkinData>}
         */
        skinDataList: Array<SkinData>;
        /**
         * 获得动画数据列表
         * @returns {Array<AnimationData>}
         */
        animationDataList: Array<AnimationData>;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.BoneData
     * @classdesc
     * 骨骼数据
     */
    class BoneData {
        /**
         * 骨骼的名字
         * @member {string} dragonBones.BoneData#name
         */
        name: string;
        /**
         * 父骨骼的名字
         * @member {string} dragonBones.BoneData#parent
         */
        parent: string;
        /**
         * 长度，目前没什么用，默认值为0
         * @member {number} dragonBones.BoneData#length
         */
        length: number;
        /**
         * 绝对的transform
         * @member {dragonBones.DBTransform} dragonBones.BoneData#global
         */
        global: DBTransform;
        /**
         * 相对的transform
         * @member {dragonBones.DBTransform} dragonBones.BoneData#transform
         */
        transform: DBTransform;
        /**
         * 是否继承父骨骼的缩放属性
         * @member {boolean} dragonBones.BoneData#inheritScale
         */
        inheritScale: boolean;
        /**
         * 是否继承父骨骼的旋转属性
         * @member {boolean} dragonBones.BoneData#inheritRotation
         */
        inheritRotation: boolean;
        /**
         * 初始化各个属性
         */
        constructor();
        /**
         *释放资源
         */
        dispose(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.ColorTransform
     * @classdesc
     * 表示颜色的transform
     */
    class ColorTransform {
        /**
         * 透明度增幅，计算时用乘法
         * @member {number} dragonBones.ColorTransform#alphaMultiplier
         */
        alphaMultiplier: number;
        /**
         * 透明度偏移，计算时用加法
         * @member {number} dragonBones.ColorTransform#alphaOffset
         */
        alphaOffset: number;
        /**
         * 蓝色值增幅，计算时用乘法
         * @member {number} dragonBones.ColorTransform#buleMultiplier
         */
        blueMultiplier: number;
        /**
         *蓝色值偏移，计算时用加法
         * @member {number} dragonBones.ColorTransform#buleOffset
         */
        blueOffset: number;
        /**
         *绿色值增幅，计算时用乘法
         * @member {number} dragonBones.ColorTransform#greenMultiplier
         */
        greenMultiplier: number;
        /**
         *绿色值偏移，计算时用加法
         * @member {number} dragonBones.ColorTransform#greenOffset
         */
        greenOffset: number;
        /**
         *红色值增幅，计算时用乘法
         * @member {number} dragonBones.ColorTransform#redMultiplier
         */
        redMultiplier: number;
        /**
         *红色值偏移，计算时用加法
         * @member {number} dragonBones.ColorTransform#redOffset
         */
        redOffset: number;
        constructor();
    }
}
declare module dragonBones {
    class CurveData {
        private static SamplingTimes;
        private static SamplingStep;
        private _dataChanged;
        private _pointList;
        sampling: Array<Point>;
        constructor();
        getValueByProgress(progress: number): number;
        refreshSampling(): void;
        private bezierCurve(t, outputPoint);
        pointList: Array<any>;
        isCurve(): boolean;
        point1: Point;
        point2: Point;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.DisplayData
     * @classdesc
     * 显示对象的数据，目前支持图片和子骨架
     */
    class DisplayData {
        /**
         * 子骨架类型
         */
        static ARMATURE: string;
        /**
         * 图片类型
         */
        static IMAGE: string;
        /**
         * 显示对象的名字
         * @member {string} dragonBones.DisplayData#name
         */
        name: string;
        /**
         * 显示对象的类型，枚举型，目前支持图片IMAGE和子骨架ARMATURE
         * @member {string} dragonBones.DisplayData#type
         */
        type: string;
        /**
         * 变换矩阵Transform表示位移，旋转，缩放，三种属性
         * @member {dragonBones.DBTransform} dragonBones.DisplayData#transform
         */
        transform: DBTransform;
        /**
         * 注册点，旋转中心
         * @member {dragonBones.Point} dragonBones.DisplayData#pivot
         */
        pivot: Point;
        /**
         * 初始化变换矩阵为单位矩阵
         * 注册点为{0，0}点
         */
        constructor();
        /**
         * 释放资源
         */
        dispose(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.DragonBonesData
     * @classdesc
     * DragonBones的数据，包含了骨架数据和显示对象数据
     */
    class DragonBonesData {
        /**
         * DrabonBones数据的名字
         * @member {string} dragonBones.DragonBonesData#name
         */
        name: string;
        /**
         * 数据的类型，是否是全局数据
         * @member {boolean} dragonBones.DragonBonesData#isGlobal
         */
        isGlobal: boolean;
        private _armatureDataList;
        private _displayDataDictionary;
        /**
         * 构造函数，实例化一个DragonBonesData类
         */
        constructor();
        /**
         * 释放资源
         */
        dispose(): void;
        /**
         * 获取所有的骨架数据
         * @returns {Array<ArmatureData>}
         */
        armatureDataList: Array<ArmatureData>;
        /**
         * 通过骨架的名字获取骨架的数据
         * @param armatureName 想要获取的骨架的名字
         * @returns {*} 骨架数据 ArmatureData
         */
        getArmatureDataByName(armatureName: string): ArmatureData;
        /**
         * 添加一个骨架数据
         * @param armatureData
         */
        addArmatureData(armatureData: ArmatureData): void;
        /**
         * 移除一个骨架数据
         * @param armatureData
         */
        removeArmatureData(armatureData: ArmatureData): void;
        /**
         * 根据骨架的名字，移除该骨架的数据
         * @param armatureName 想要移除的骨架的名字
         */
        removeArmatureDataByName(armatureName: string): void;
        /**
         * 根据名字获取显示对象数据
         * @param name 想要获取的显示对象数据的名字
         * @returns {any} 显示对象数据 DisplayData
         */
        getDisplayDataByName(name: string): DisplayData;
        /**
         *添加一个显示对象数据
         * @param displayData 需要被添加的显示对象数据
         */
        addDisplayData(displayData: DisplayData): void;
        /**
         *根据显示对象的名字移除该显示对象数据
         * @param name 显示对象的名字
         */
        removeDisplayDataByName(name: string): void;
        /**
         *移除所有的显示对象数据
         */
        removeAllDisplayData(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.Frame
     * @classdesc
     *关键帧数据
     */
    class Frame {
        /**
         *位置
         * @member {number} dragonBones.Frame#position
         */
        position: number;
        /**
         *持续时间
         * @member {number} dragonBones.Frame#duration
         */
        duration: number;
        /**
         *帧标签
         * @member {string} dragonBones.Frame#action
         */
        action: string;
        /**
         *帧事件
         * @member {string} dragonBones.Frame#event
         */
        event: string;
        /**
         *帧声音
         * @member {string} dragonBones.Frame#sound
         */
        sound: string;
        curve: CurveData;
        /**
         *构造函数
         */
        constructor();
        /**
         *释放资源
         */
        dispose(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.SkinData
     * @classdesc
     * 皮肤数据，皮肤是由一些插槽组成，每个插槽都有一个骨骼控制，骨骼的运动带动插槽的运动形成动画，
     * 插槽里可以放置显示对象，目前支持的显示对象有图片和子骨架两种
     */
    class SkinData {
        /**
         * 皮肤数据的名字
         * @member {string} dragonBones.SkinData#name
         */
        name: string;
        private _slotDataList;
        /**
         * 构造函数，实例化一个SkinData类
         */
        constructor();
        /**
         * 释放资源
         */
        dispose(): void;
        /**
         * 根据插槽的名字获取插槽数据
         * @param slotName 想要获取的插槽的名字
         * @returns {*} 返回的插槽数据
         */
        getSlotData(slotName: string): SlotData;
        /**
         * 添加一个插槽数据
         * @param slotData
         */
        addSlotData(slotData: SlotData): void;
        /**
         * 获取所有的插槽数据
         * @returns {Array<SlotData>}
         */
        slotDataList: Array<SlotData>;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.SlotData
     * @classdesc
     * 插槽数据，插槽是由骨骼控制的，可以装入显示对象的容器，显示对象可以是图片或者子骨架
     * 插槽可插入一个或者多个显示对象，但是同一时刻只能显示一个显示对象
     * 插槽支持关键帧动画，如果有多个显示对象，可以指定哪一帧显示哪一个显示对象
     */
    class SlotData {
        /**
         * 插槽数据的名字
         * @member {string} dragonBones.SlotData#name
         */
        name: string;
        /**
         * 绑定的骨骼的名字，一个插槽仅受一个骨骼控制
         * @member {string} dragonBones.SlotData#parent
         */
        parent: string;
        /**
         * z轴排序，z轴是垂直于屏幕的轴，zOrder约小，越靠里
         * 所以如果有重叠，zOrder大的插槽会挡住zOrder小的插槽
         * @member {number} dragonBones.SlotData#zOrder
         */
        zOrder: number;
        /**
         * 混合模式
         * @member {string} dragonBones.SlotData#blendMode
         */
        blendMode: string;
        /**
         * 初始的显示图片的序号
         * @member {string} dragonBones.SlotData#displayIndex
         */
        displayIndex: number;
        private _displayDataList;
        /**
         * 构造函数，实例化一个SlotData类
         */
        constructor();
        /**
         * 释放资源
         */
        dispose(): void;
        /**
         * 添加一个显示对象数据
         * @param displayData
         */
        addDisplayData(displayData: DisplayData): void;
        /**
         * 根据显示对象的名字获取显示对象数据
         * @param displayName 想要获取的显示对象的名字
         * @returns {*} 返回显示对象昂数据，如果没有返回null
         */
        getDisplayData(displayName: string): DisplayData;
        /**
         * 获取所有的显示对象
         * @returns {Array<DisplayData>}
         */
        displayDataList: Array<DisplayData>;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.SlotFrame
     * @extends dragonBones.Frame
     * @classdesc
     * 插槽的关键帧数据，包含
     * 插槽的显示序号，可见度，zOrder，colorTransform数据
     */
    class SlotFrame extends Frame {
        /**
         * NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
         * 缓动值，
         * 当值为NaN时，没有缓动
         * 当值为10时，为自动
         * 当值为[-1,0)时，为缓进
         * 当值为0时，为线性缓动
         * 当值为(0, 1]时，为缓出
         * 当值为(1, 2]时，为缓进缓出
         * @member {number} dragonBones.TransformFrame#tweenEasing
         */
        tweenEasing: number;
        /**
         *绑定到该插槽的显示序号，当插槽有多个显示对象时，指定显示哪一个显示对象
         * @member {number} dragonBones.SlotFrame#displayIndex
         */
        displayIndex: number;
        /**
         *是否可见
         * @member {boolean} dragonBones.SlotFrame#visible
         */
        visible: boolean;
        /**
         *绑定到该插槽的zOrder值
         * @member {number} dragonBones.SlotFrame#zOrder
         */
        zOrder: number;
        /**
         *绑定到插槽的颜色transform，颜色的transform可以表示颜色在红蓝绿透明四个通道的变化
         * @member {dragonBones.ColorTransform} dragonBones.SlotFrame#color
         */
        color: ColorTransform;
        /**
         *构造函数，实例化一个SlotFrame
         */
        constructor();
        /**
         *释放资源
         */
        dispose(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.SlotTimeline
     * @extends dragonBones.Timeline
     * @classdesc
     * 插槽的时间轴数据，包含一个和多个关键帧数据
     */
    class SlotTimeline extends Timeline {
        /**
         *时间轴的名称
         * @member {string} dragonBones.SlotTimeline#name
         */
        name: string;
        /**
         * 是否有动画
         * @member {boolean} dragonBones.SlotTimeline#transformed
         */
        transformed: boolean;
        /**
         * 偏移量
         * @member {number} dragonBones.SlotTimeline#offset
         */
        offset: number;
        /**
         * 构造函数，实例化一个SlotTimeline
         */
        constructor();
        /**
         * 释放资源
         */
        dispose(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.TransformFrame
     * @extends dragonBones.Frame
     * @classdesc
     * 骨骼的关键帧数据，包含骨骼的缓动，旋转，transform数据和
     * 插槽的显示序号，可见度，zOrder，colorTransform数据
     */
    class TransformFrame extends Frame {
        /**
         * NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
         * 缓动值，
         * 当值为NaN时，没有缓动
         * 当值为10时，为自动
         * 当值为[-1,0)时，为缓进
         * 当值为0时，为线性缓动
         * 当值为(0, 1]时，为缓出
         * 当值为(1, 2]时，为缓进缓出
         * @member {number} dragonBones.TransformFrame#tweenEasing
         */
        tweenEasing: number;
        /**
         * 旋转几圈
         * @member {number} dragonBones.TransformFrame#tweenRotate
         */
        tweenRotate: number;
        /**
         * 补间是否对Scale起作用
         * @member {boolean} dragonBones.TransformFrame#tweenScale
         */
        tweenScale: boolean;
        /**
         *绑定到该骨骼的插槽的显示序号，当插槽有多个显示对象时，指定显示哪一个显示对象
         * @member {number} dragonBones.TransformFrame#displayIndex
         */
        displayIndex: number;
        /**
         *是否可见
         * @member {boolean} dragonBones.TransformFrame#visible
         */
        visible: boolean;
        /**
         *绑定到该骨骼的插槽的zOrder值
         * @member {number} dragonBones.TransformFrame#zOrder
         */
        zOrder: number;
        /**
         *全局的transform
         * @member {dragonBones.DBTransform} dragonBones.TransformFrame#global
         */
        global: DBTransform;
        /**
         *骨骼的transform，transform可以表示位移，旋转，缩放三种属性
         * @member {dragonBones.DBTransform} dragonBones.TransformFrame#transform
         */
        transform: DBTransform;
        /**
         *注册点，骨骼的旋转中心
         * @member {dragonBones.Point} dragonBones.TransformFrame#pivot
         */
        pivot: Point;
        /**
         *绑定到骨骼的插槽的颜色transform，颜色的transform可以表示颜色在红蓝绿透明四个通道的变化
         * @member {dragonBones.ColorTransform} dragonBones.TransformFrame#color
         */
        color: ColorTransform;
        /**
         *缩放的偏移
         * @member {dragonBones.Point} dragonBones.TransformFrame#scaleOffset
         */
        scaleOffset: Point;
        /**
         *构造函数，实例化一个TransformFrame
         */
        constructor();
        /**
         *释放资源
         */
        dispose(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.TransformTimeline
     * @extends dragonBones.Timeline
     * @classdesc
     * 骨骼的时间轴数据，包含一个和多个关键帧数据
     */
    class TransformTimeline extends Timeline {
        /**
         *时间轴的名称
         * @member {string} dragonBones.TransformTimeline#name
         */
        name: string;
        /**
         * 是否有动画
         * @member {boolean} dragonBones.TransformTimeline#transformed
         */
        transformed: boolean;
        /**
         * 第一帧的Transform
         * @member {dragonBones.DBTransform} dragonBones.TransformTimeline#originTransform
         */
        originTransform: DBTransform;
        /**
         * 第一帧的骨头的轴点
         * @member {dragonBones.Point} dragonBones.TransformTimeline#originPivot
         */
        originPivot: Point;
        /**
         * 偏移量
         * @member {number} dragonBones.TransformTimeline#offset
         */
        offset: number;
        /**
         * 构造函数，实例化一个TransformTimeline
         */
        constructor();
        /**
         * 释放资源
         */
        dispose(): void;
    }
}
declare module dragonBones {
    /**
     *@class dragonBones.DataParser
     * @classdesc
     * 老版本数据解析
     */
    class Data3Parser {
        private static tempDragonBonesData;
        static parseDragonBonesData(rawDataToParse: any): DragonBonesData;
        private static parseArmatureData(armatureDataToParse, frameRate);
        private static parseBoneData(boneObject);
        private static parseSkinData(skinObject);
        private static parseSkinSlotData(slotObject);
        private static parseSlotData(slotObject);
        private static parseDisplayData(displayObject);
        /** @private */
        private static parseAnimationData(animationObject, frameRate);
        private static parseSlotTimeline(timelineObject, duration, frameRate);
        private static parseSlotFrame(frameObject, frameRate);
        private static parseTransformTimeline(timelineObject, duration, frameRate);
        private static parseTransformFrame(frameObject, frameRate);
        private static parseTimeline(timelineObject, outputTimeline);
        private static parseFrame(frameObject, outputFrame, frameRate?);
        private static parseTransform(transformObject, transform, pivot?);
        private static parseColorTransform(colorTransformObject, colorTransform);
        private static getBoolean(data, key, defaultValue);
        private static getNumber(data, key, defaultValue);
    }
}
declare module dragonBones {
    /**
     *@class dragonBones.DataParser
     * @classdesc
     * 数据解析
     *
     * @example
       <pre>
         //获取动画数据
         var skeletonData = RES.getRes("skeleton");
         //获取纹理集数据
         var textureData = RES.getRes("textureConfig");
         //获取纹理集图片
         var texture = RES.getRes("texture");
      
         //创建一个工厂，用来创建Armature
         var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
         //把动画数据添加到工厂里
         factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
         //把纹理集数据和图片添加到工厂里
         factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
         //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
         var armatureName:string = skeletonData.armature[0].name;
         //从工厂里创建出Armature
         var armature:dragonBones.Armature = factory.buildArmature(armatureName);
         //获取装载Armature的容器
         var armatureDisplay = armature.display;
         //把它添加到舞台上
         this.addChild(armatureDisplay);
         //取得这个Armature动画列表中的第一个动画的名字
         var curAnimationName = armature.animation.animationList[0];
         //播放这个动画，gotoAndPlay参数说明,具体详见Animation类
         //第一个参数 animationName {string} 指定播放动画的名称.
         //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
         //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
         //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
         armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
      
         //把Armature添加到心跳时钟里
         dragonBones.WorldClock.clock.add(armature);
         //心跳时钟开启
         egret.Ticker.getInstance().register(function (advancedTime) {
             dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
         }, this);
       </pre>
     */
    class DataParser {
        private static tempDragonBonesData;
        /**
         *解析纹理集数据
         * @param rawData纹理集数据xml或者json
         * @param scale纹理资源的缩放，默认为1，不缩放
         * @returns {any}返回纹理集数据，存放TexutrueData的字典类型
         */
        static parseTextureAtlasData(rawData: any, scale?: number): any;
        /**
         * 解析DragonBones的数据，xml或者json，该数据包含了骨骼，皮肤，动画的数据
         * @param rawDataToParse DragonBones的数据，xml或者json格式
         * @returns {DragonBonesData} 返回DragonBones引擎使用的数据格式
         */
        static parseDragonBonesData(rawDataToParse: any): DragonBonesData;
        private static parseArmatureData(armatureDataToParse, frameRate);
        private static parseBoneData(boneObject);
        private static parseSkinData(skinObject);
        private static parseSlotData(slotObject);
        private static parseSlotDisplayData(slotObject);
        private static parseDisplayData(displayObject);
        /** @private */
        private static parseAnimationData(animationObject, frameRate);
        private static parseTransformTimeline(timelineObject, duration, frameRate);
        private static parseSlotTimeline(timelineObject, duration, frameRate);
        private static parseTransformFrame(frameObject, frameRate);
        private static parseSlotFrame(frameObject, frameRate);
        private static parseTimeline(timelineObject, outputTimeline);
        private static parseFrame(frameObject, outputFrame, frameRate?);
        private static parseTransform(transformObject, transform, pivot?);
        private static parseColorTransform(colorTransformObject, colorTransform);
        private static getBoolean(data, key, defaultValue);
        private static getNumber(data, key, defaultValue);
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.ITextureAltas
     * @classdesc
     * 纹理集的接口
     */
    interface ITextureAtlas {
        /**
         * 这个ITextureAtlas的名字
         */
        name: string;
        /**
         * 释放资源
         */
        dispose(): void;
        /**
         * 获得纹理集TextureAltas中的由name指定的资源的那块矩形区域
         * @param name 资源的名字
         * @return Rectangle 资源的矩形区域
         */
        getRegion(name: string): Rectangle;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.TextureData
     * @classdesc
     * 纹理数据
     *
     * @example
     * <pre>
     *   //获取动画数据
     *   var skeletonData = RES.getRes("skeleton");
     *   //获取纹理集数据
     *   var textureData = RES.getRes("textureConfig");
     *   //获取纹理集图片
     *   var texture = RES.getRes("texture");
     *
     *   //创建一个工厂，用来创建Armature
     *   var factory:dragonBones.EgretFactory = new dragonBones.EgretFactory();
     *   //把动画数据添加到工厂里
     *   factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
     *   //把纹理集数据和图片添加到工厂里
     *   factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
     *   //获取Armature的名字，dragonBones4.0的数据可以包含多个骨架，这里取第一个Armature
     *   var armatureName:string = skeletonData.armature[0].name;
     *   //从工厂里创建出Armature
     *   var armature:dragonBones.Armature = factory.buildArmature(armatureName);
     *   //获取装载Armature的容器
     *   var armatureDisplay = armature.display;
     *   //把它添加到舞台上
     *   this.addChild(armatureDisplay);
     *   //取得这个Armature动画列表中的第一个动画的名字
     *   var curAnimationName = armature.animation.animationList[0];
     *   //播放这个动画，gotoAndPlay参数说明,具体详见Animation类
     *   //第一个参数 animationName {string} 指定播放动画的名称.
     *   //第二个参数 fadeInTime {number} 动画淡入时间 (>= 0), 默认值：-1 意味着使用动画数据中的淡入时间.
     *   //第三个参数 duration {number} 动画播放时间。默认值：-1 意味着使用动画数据中的播放时间.
     *   //第四个参数 layTimes {number} 动画播放次数(0:循环播放, >=1:播放次数, NaN:使用动画数据中的播放时间), 默认值：NaN
     *   armature.animation.gotoAndPlay(curAnimationName,0.3,-1,0);
     *
     *   //把Armature添加到心跳时钟里
     *   dragonBones.WorldClock.clock.add(armature);
     *   //心跳时钟开启
     *   egret.Ticker.getInstance().register(function (advancedTime) {
     *       dragonBones.WorldClock.clock.advanceTime(advancedTime / 1000);
     *   }, this);
     * </pre>
     */
    class TextureData {
        /**
         * 区域
         * @member {dragonBones.Rectangle} dragonBones.TextureData#region
         */
        region: Rectangle;
        /**
         * 帧的区域
         * @member {dragonBones.Rectangle} dragonBones.TextureData#frame
         */
        frame: Rectangle;
        /**
         *是否有旋转
         */
        rotated: boolean;
        /**
         *创建一个 TextureData 实例
         * @param region 区域
         * @param frame 帧的区域
         * @param rotated
         */
        constructor(region: Rectangle, frame: Rectangle, rotated: boolean);
    }
}
declare module dragonBones {
    class ColorTransformUtil {
        static originalColor: ColorTransform;
        static cloneColor(color: ColorTransform): ColorTransform;
        static isEqual(color1: ColorTransform, color2: ColorTransform): boolean;
        static minus(color1: ColorTransform, color2: ColorTransform, outputColor: ColorTransform): void;
        constructor();
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.ConstValues
     * @classdesc
     *定义了常用的常量
     */
    class ConstValues {
        /**
         * 角度转换为弧度
         */
        static ANGLE_TO_RADIAN: number;
        /**
         * 弧度转换为角度
         */
        static RADIAN_TO_ANGLE: number;
        /**
         *龙骨
         */
        static DRAGON_BONES: string;
        /**
         * 骨架
         */
        static ARMATURE: string;
        /**
         *皮肤
         */
        static SKIN: string;
        /**
         * 骨骼
         */
        static BONE: string;
        /**
         * 插槽
         */
        static SLOT: string;
        /**
         * 显示对象
         */
        static DISPLAY: string;
        /**
         * 动画
         */
        static ANIMATION: string;
        /**
         * 时间轴
         */
        static TIMELINE: string;
        /**
         * 帧
         */
        static FRAME: string;
        /**
         * 变换
         */
        static TRANSFORM: string;
        /**
         * 颜色变换
         */
        static COLOR_TRANSFORM: string;
        static COLOR: string;
        /**
         * 矩形
         */
        static RECTANGLE: string;
        /**
         * 椭圆
         */
        static ELLIPSE: string;
        /**
         * 纹理集
         */
        static TEXTURE_ATLAS: string;
        /**
         * 子纹理
         */
        static SUB_TEXTURE: string;
        /**
         * 旋转
         */
        static A_ROTATED: string;
        /**
         * 帧的x坐标
         */
        static A_FRAME_X: string;
        /**
         * 帧的y坐标
         */
        static A_FRAME_Y: string;
        /**
         * 帧的宽度
         */
        static A_FRAME_WIDTH: string;
        /**
         * 帧的高度
         */
        static A_FRAME_HEIGHT: string;
        /**
         * 版本
         */
        static A_VERSION: string;
        /**
         * 图片路径
         */
        static A_IMAGE_PATH: string;
        /**
         * 帧速率
         */
        static A_FRAME_RATE: string;
        /**
         * 名字
         */
        static A_NAME: string;
        /**
         * 是否是全局
         */
        static A_IS_GLOBAL: string;
        /**
         * 父亲
         */
        static A_PARENT: string;
        /**
         * 长度
         */
        static A_LENGTH: string;
        /**
         * 类型
         */
        static A_TYPE: string;
        /**
         * 缓入事件
         */
        static A_FADE_IN_TIME: string;
        /**
         * 持续时长
         */
        static A_DURATION: string;
        /**
         * 缩放
         */
        static A_SCALE: string;
        /**
         * 偏移
         */
        static A_OFFSET: string;
        /**
         * 循环
         */
        static A_LOOP: string;
        static A_PLAY_TIMES: string;
        /**
         * 事件
         */
        static A_EVENT: string;
        /**
         * 事件参数
         */
        static A_EVENT_PARAMETERS: string;
        /**
         * 声音
         */
        static A_SOUND: string;
        /**
         * 动作
         */
        static A_ACTION: string;
        /**
         * 隐藏
         */
        static A_HIDE: string;
        /**
         * 自动补间
         */
        static A_AUTO_TWEEN: string;
        /**
         * 补间缓动
         */
        static A_TWEEN_EASING: string;
        /**
         * 补间旋转
         */
        static A_TWEEN_ROTATE: string;
        /**
         * 补间缩放
         */
        static A_TWEEN_SCALE: string;
        /**
         * 显示对象序号
         */
        static A_DISPLAY_INDEX: string;
        /**
         * z轴
         */
        static A_Z_ORDER: string;
        /**
         * 混合模式
         */
        static A_BLENDMODE: string;
        /**
         * 宽度
         */
        static A_WIDTH: string;
        /**
         * 高度
         */
        static A_HEIGHT: string;
        /**
         * 继承缩放
         */
        static A_INHERIT_SCALE: string;
        /**
         * 继承旋转
         */
        static A_INHERIT_ROTATION: string;
        /**
         * x轴
         */
        static A_X: string;
        /**
         * y轴
         */
        static A_Y: string;
        /**
         * x方向斜切
         */
        static A_SKEW_X: string;
        /**
         * y方向斜切
         */
        static A_SKEW_Y: string;
        /**
         * x方向缩放
         */
        static A_SCALE_X: string;
        /**
         * y方向缩放
         */
        static A_SCALE_Y: string;
        /**
         * 轴点的x坐标
         */
        static A_PIVOT_X: string;
        /**
         * 轴点的y坐标
         */
        static A_PIVOT_Y: string;
        /**
         * 透明度的偏移
         */
        static A_ALPHA_OFFSET: string;
        /**
         * 红色的偏移
         */
        static A_RED_OFFSET: string;
        /**
         * 绿色的偏移
         */
        static A_GREEN_OFFSET: string;
        /**
         * 蓝色的偏移
         */
        static A_BLUE_OFFSET: string;
        /**
         * 透明度的倍数
         */
        static A_ALPHA_MULTIPLIER: string;
        /**
         * 红色的倍数
         */
        static A_RED_MULTIPLIER: string;
        /**
         * 绿色的倍数
         */
        static A_GREEN_MULTIPLIER: string;
        /**
         * 蓝色的倍数
         */
        static A_BLUE_MULTIPLIER: string;
        /**
         * 动画曲线
         */
        static A_CURVE: string;
        /**
         * x方向缩放的偏移
         */
        static A_SCALE_X_OFFSET: string;
        /**
         * y方向的偏移
         */
        static A_SCALE_Y_OFFSET: string;
        /**
         * 缩放模式
         */
        static A_SCALE_MODE: string;
        /**
         * 旋转修正
         */
        static A_FIXED_ROTATION: string;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.DBDataUtil
     * @classdesc
     * DragonBons的数据工具类，提供一些对数据处理的静态方法
     */
    class DBDataUtil {
        /**
         * 把ArmatureData的绝对数据转成成相对数据
         * @param armatureData
         */
        static transformArmatureData(armatureData: ArmatureData): void;
        /**
         * 转换骨架数据中的动画数据
         * 把动画数据中的绝对的数据转换成相对的数据
         * @param armatureData
         */
        static transformArmatureDataAnimations(armatureData: ArmatureData): void;
        /**
         *
         * @param animationData
         * @param armatureData
         */
        static transformRelativeAnimationData(animationData: AnimationData, armatureData: ArmatureData): void;
        /**
         * 把动画数据中的绝对的数据转换成相对的数据
         * @param animationData 动画数据
         * @param armatureData 骨架数据
         * @param isGlobalData 是否是绝对数据
         */
        static transformAnimationData(animationData: AnimationData, armatureData: ArmatureData, isGlobalData: boolean): void;
        private static setFrameTransform(animationData, armatureData, boneData, frame);
        private static getTimelineTransform(timeline, position, retult, isGlobal);
        /**
         * 添加进隐藏的时间轴
         * @param animationData
         * @param armatureData
         */
        static addHideTimeline(animationData: AnimationData, armatureData: ArmatureData, addHideSlot?: boolean): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.MathUtil
     * @classdesc
     * 内部使用的有关数学计算的工具类
     */
    class MathUtil {
        /** @private */
        static getEaseValue(value: number, easing: number): number;
        /**
         * 角度转换为弧度
         */
        static ANGLE_TO_RADIAN: number;
        /**
         * 弧度转换为角度
         */
        static RADIAN_TO_ANGLE: number;
        static isNumber(value: any): boolean;
        /**
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         */
        static sin(value: number): number;
        private static sinInt(value);
        /**
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         */
        static cos(value: number): number;
    }
}
declare var db_sin_map: {};
declare module dragonBones {
    /**
     * @class dragonBones.TransformUtils
     * @classdesc
     * 提供了一些常用的转换的静态方法
     */
    class TransformUtil {
        private static HALF_PI;
        private static DOUBLE_PI;
        private static _helpTransformMatrix;
        private static _helpParentTransformMatrix;
        /**
         * 全局坐标系转成成局部坐标系
         * @param transform 全局坐标系下的变换
         * @param parent 父亲的坐标变换
         */
        static globalToLocal(transform: DBTransform, parent: DBTransform): void;
        /**
         *把transform数据转成成矩阵数据
         * @param transform 需要转换的transform数据
         * @param matrix 转换后的矩阵数据
         * @param keepScale 是否保持缩放
         */
        static transformToMatrix(transform: DBTransform, matrix: Matrix, keepScale?: boolean): void;
        /**
         *把 矩阵数据转成成transform数据
         * @param matrix 需要转换的矩阵数据
         * @param transform 转换后的transform数据
         * @param scaleXF x方向的缩放
         * @param scaleYF y方向的缩放
         */
        static matrixToTransform(matrix: Matrix, transform: DBTransform, scaleXF: Boolean, scaleYF: Boolean): void;
        /**
         * 标准化弧度值，把弧度制换算到[-PI，PI]之间
         * @param radian 输入一个弧度值
         * @returns {number} 输出标准化后的弧度制
         */
        static formatRadian(radian: number): number;
        /**
         *  确保角度在-180到180之间
         */
        static normalizeRotation(rotation: number): number;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.EgretFactory
     * @extends dragonBones.BaseFactory
     * @classdesc
     * Egret引擎中DragonBones工厂的基类实现
     */
    class EgretFactory extends BaseFactory {
        constructor();
        /** @private */
        _generateArmature(): Armature;
        /** @private */
        _generateSlot(): Slot;
        /** @private */
        _generateDisplay(textureAtlas: EgretTextureAtlas, fullName: string, pivotX: number, pivotY: number): any;
        _generateFastArmature(): FastArmature;
        _generateFastSlot(): FastSlot;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.EgretSlot
     * @extends dragonBones.Slot
     * @classdesc
     * egret引擎使用的插槽
     */
    class EgretFastSlot extends FastSlot {
        private _egretDisplay;
        /**
         * 创建一个新的 EgretSlot 实例
         */
        constructor();
        /**
         * 释放资源
         */
        dispose(): void;
        /** @private */
        _updateDisplay(value: any): void;
        /** @private */
        _getDisplayIndex(): number;
        /** @private */
        _addDisplayToContainer(container: any, index?: number): void;
        /** @private */
        _removeDisplayFromContainer(): void;
        /** @private */
        _updateTransform(): void;
        /** @private */
        _updateDisplayVisible(value: boolean): void;
        /** @private */
        _updateDisplayColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number, colorChanged?: boolean): void;
        /** @private */
        _updateDisplayBlendMode(value: string): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.EgretSheetAtlas
     * @implements dragonBones.ITextureAtlas
     * @classdesc
     * Egret 引擎使用的sheet纹理集
     */
    class EgretSheetAtlas implements ITextureAtlas {
        texture: egret.Texture;
        private textureData;
        private static Region;
        /**
         * 纹理集的名称
         * @member {string} dragonBones.EgretSheetAtlas#name
         */
        name: string;
        /**
         * 纹理集的缩放
         * @member {number} dragonBones.EgretSheetAtlas#scale
         */
        scale: number;
        /**
         * spriteSheet
         * @member {egret.SpriteSheet} dragonBones.EgretSheetAtlas#spriteSheet
         */
        spriteSheet: egret.SpriteSheet;
        private _textureDatas;
        /**
         * 创建一个新的EgretSheetAltas 实例
         * @param texture 纹理
         * @param textureData 纹理数据
         * @param scale 缩放
         */
        constructor(texture: egret.Texture, textureData: any, scale?: number);
        /**
         *通过纹理的名字来获取纹理
         * @param fullName 纹理的名字
         * @returns {egret.Texture} 获取到的纹理
         */
        getTexture(fullName: string): egret.Texture;
        /**
         *释放资源
         */
        dispose(): void;
        /**
         * 根据子纹理的名字获取子纹理的矩形区域
         * @param subTextureName 子纹理的名字
         * @returns {*} 获取到的矩形区域
         */
        getRegion(subTextureName: string): Rectangle;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.EgretSlot
     * @extends dragonBones.Slot
     * @classdesc
     * egret引擎使用的插槽
     */
    class EgretSlot extends Slot {
        private _egretDisplay;
        /**
         * 创建一个新的 EgretSlot 实例
         */
        constructor();
        /**
         * 释放资源
         */
        dispose(): void;
        /** @private */
        _updateDisplay(value: any): void;
        /** @private */
        _getDisplayIndex(): number;
        /** @private */
        _addDisplayToContainer(container: any, index?: number): void;
        /** @private */
        _removeDisplayFromContainer(): void;
        /** @private */
        _updateTransform(): void;
        /** @private */
        _updateDisplayVisible(value: boolean): void;
        /** @private */
        _updateDisplayColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number, colorChange?: boolean): void;
        /** @private */
        _updateDisplayBlendMode(value: string): void;
        _calculateRelativeParentTransform(): void;
    }
}
declare module dragonBones {
    /**
     * @class dragonBones.EgretTextureAtlas
     * @implements dragonBones.ITextureAtlas
     * @classdesc
     * egret引擎使用的纹理集
     */
    class EgretTextureAtlas implements ITextureAtlas {
        texture: egret.Texture;
        private textureAtlasRawData;
        /**
         * 名字
         * @member {string} dragonBones.EgretTextureAtlas#name
         */
        name: string;
        /**
         * 缩放
         * @member {number} dragonBones.EgretTextureAtlas#scale
         */
        scale: number;
        /**
         * spriteSheet
         * @member {egert.SpriteSheet} dragonBones.EgretTextureAtlas#spriteSheet
         */
        spriteSheet: egret.SpriteSheet;
        private _textureDatas;
        static rotatedDic: any;
        /**
         * 创建一个新的EgretTextureAtlas实例
         * @param texture 纹理集
         * @param textureAtlasRawData 纹理集数据
         * @param scale 缩放
         */
        constructor(texture: egret.Texture, textureAtlasRawData: any, scale?: number);
        /**
         * 根据名字获取纹理
         * @param fullName 纹理的名字
         * @returns {egret.Texture} 获取到的纹理
         */
        getTexture(fullName: string): egret.Texture;
        /**
         * 释放资源
         */
        dispose(): void;
        /**
         * 根据子纹理的名字获取子纹理所在的实际矩形区域
         * @param subTextureName 子纹理的名字
         * @returns {*} 子纹理所在的矩形区域
         */
        getRegion(subTextureName: string): Rectangle;
        /**
         * 根据子纹理的名字获取子纹理所在的真实矩形区域
         * @param subTextureName 子纹理的名字
         * @returns {*} 子纹理所在的矩形区域
         */
        getFrame(subTextureName: string): Rectangle;
        private parseData(textureAtlasRawData);
    }
}
