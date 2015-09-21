declare module egret {
    /**
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    class FrameLabel extends EventDispatcher {
        /**
         * @private
         */
        private _name;
        /**
         * @private
         */
        private _frame;
        /**
         * @private
         */
        private _end;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(name: string, frame: number, end?: number);
        /**
         * @language en_US
         * Frame number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 标签名
         * @version Egret 2.4
         * @platform Web,Native
         */
        name: string;
        /**
         * @language en_US
         * Frame serial number of the label
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 标签所在帧序号
         * @version Egret 2.4
         * @platform Web,Native
         */
        frame: number;
        /**
         * @language en_US
         * Frame serial number, the end of the label
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 标签对应的结束帧序号
         * @version Egret 2.4
         * @platform Web,Native
         */
        end: number;
        /**
         * @language en_US
         * Duplicate the current frame label object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 复制当前帧标签对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        clone(): FrameLabel;
    }
}
declare module egret {
    /**
    * @language en_US
    * @version Egret 2.4
    * @platform Web,Native
    * @includeExample extension/game/display/MovieClip.ts
    */
    /**
     * @language zh_CN
     * 影片剪辑，可以通过影片剪辑播放序列帧动画。MovieClip 类从以下类继承而来：DisplayObject 和 EventDispatcher。不同于 DisplayObject 对象，MovieClip 对象拥有一个时间轴。
     * @extends egret.DisplayObject
     * @event egret.Event.COMPLETE 动画播放完成。
     * @event egret.Event.LOOP_COMPLETE 动画循环播放完成。
     * @see http://edn.egret.com/cn/index.php/article/index/id/151 MovieClip序列帧动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/display/MovieClip.ts
     */
    class MovieClip extends DisplayObject {
        $bitmapData: Texture;
        $movieClipData: MovieClipData;
        /**
         * @private
         */
        private frames;
        /**
         * @private
         */
        $totalFrames: number;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        frameLabels: any[];
        /**
         * @private
         */
        $frameLabelStart: number;
        /**
         * @private
         */
        $frameLabelEnd: number;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        frameEvents: any[];
        /**
         * @private
         */
        private frameIntervalTime;
        /**
         * @private
         */
        $eventPool: string[];
        $isPlaying: boolean;
        /**
         * @private
         */
        private isStopped;
        /**
         * @private
         */
        private playTimes;
        /**
         * @private
         */
        $currentFrameNum: number;
        /**
         * @private
         */
        $nextFrameNum: number;
        /**
         * @private
         */
        private displayedKeyFrameNum;
        /**
         * @private
         */
        private passedTime;
        /**
         * 创建新的 MovieClip 实例。创建 MovieClip 之后，调用舞台上的显示对象容器的addElement方法。
         * @param movieClipData {movieClipData} 被引用的 movieClipData 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(movieClipData?: MovieClipData);
        /**
         * @private
         *
         */
        $init(): void;
        /**
         * @private
         *
         */
        $reset(): void;
        /**
         * @private
         *
         */
        private _initFrame();
        /**
         * @private
         */
        $render(context: sys.RenderContext): void;
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
        /**
         * @private
         *
         * @param stage
         * @param nestLevel
         */
        $onAddToStage(stage: Stage, nestLevel: number): void;
        /**
         * @private
         *
         */
        $onRemoveFromStage(): void;
        /**
         * @private
         * 返回帧标签为指定字符串的FrameLabel对象
         * @param labelName {string} 帧标签名
         * @param ignoreCase {boolean} 是否忽略大小写，可选参数，默认false
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        private getFrameLabelByName(labelName, ignoreCase?);
        /**
         * @private
         * 根据帧标签，设置开始和结束的帧数
         * @param labelName {string} 帧标签名
         */
        private getFrameStartEnd(labelName);
        /**
         * @private
         * 返回指定序号的帧的FrameLabel对象
         * @param frame {number} 帧序号
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        private getFrameLabelByFrame(frame);
        /**
         * @private
         * 返回指定序号的帧对应的FrameLabel对象，如果当前帧没有标签，则返回前面最近的有标签的帧的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelForFrame
         * @param frame {number} 帧序号
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        private getFrameLabelForFrame(frame);
        /**
         * 继续播放当前动画
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数(MovieClip初始播放次数设置为1)，
         * @version Egret 2.4
         * @platform Web,Native
         */
        play(playTimes?: number): void;
        /**
         * 暂停播放动画
         * @version Egret 2.4
         * @platform Web,Native
         */
        stop(): void;
        /**
         * 将播放头移到前一帧并停止
         * @version Egret 2.4
         * @platform Web,Native
         */
        prevFrame(): void;
        /**
         * 跳到后一帧并停止
         * @version Egret 2.4
         * @platform Web,Native
         */
        nextFrame(): void;
        /**
         * 将播放头移到指定帧并播放
         * @param frame {any} 指定帧的帧号或帧标签
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数，
         * @version Egret 2.4
         * @platform Web,Native
         */
        gotoAndPlay(frame: any, playTimes?: number): void;
        /**
         * 将播放头移到指定帧并停止
         * @param frame {any} 指定帧的帧号或帧标签
         * @version Egret 2.4
         * @platform Web,Native
         */
        gotoAndStop(frame: any): void;
        /**
         * @private
         *
         * @param frame
         */
        private gotoFrame(frame);
        /**
         * @private
         */
        private lastTime;
        /**
         * @private
         *
         * @param advancedTime
         * @returns
         */
        private advanceTime(timeStamp);
        /**
         * @private
         *
         */
        private advanceFrame();
        /**
         * @private
         *
         */
        private constructFrame();
        /**
         * @private
         *
         */
        private handlePendingEvent();
        /**
         * MovieClip 实例中帧的总数
         * @version Egret 2.4
         * @platform Web,Native
         */
        totalFrames: number;
        /**
         * MovieClip 实例当前播放的帧的序号
         * @version Egret 2.4
         * @platform Web,Native
         */
        currentFrame: number;
        /**
         * MovieClip 实例当前播放的帧的标签。如果当前帧没有标签，则 currentFrameLabel返回null。
         * @version Egret 2.4
         * @platform Web,Native
         */
        currentFrameLabel: string;
        /**
         * 当前播放的帧对应的标签，如果当前帧没有标签，则currentLabel返回包含标签的先前帧的标签。如果当前帧和先前帧都不包含标签，currentLabel返回null。
         * @version Egret 2.4
         * @platform Web,Native
         */
        currentLabel: string;
        /**
         * MovieClip 实例的帧频
         * @version Egret 2.4
         * @platform Web,Native
         */
        frameRate: number;
        /**
         * MovieClip 实例当前是否正在播放
         * @version Egret 2.4
         * @platform Web,Native
         */
        isPlaying: boolean;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * MovieClip数据源
         */
        movieClipData: MovieClipData;
        /**
         * @private
         *
         * @param value
         */
        private setMovieClipData(value);
        /**
         * @private
         *
         * @param value
         */
        private setPlayTimes(value);
        /**
         * @private
         *
         * @param value
         */
        private setIsStopped(value);
    }
}
declare module egret {
    /**
     * @classdesc 使用 MovieClipData 类，您可以创建 MovieClip 对象和处理 MovieClip 对象的数据。MovieClipData 一般由MovieClipDataFactory生成
     * @see http://docs.egret-labs.org/post/manual/displaycon/movieclip.html MovieClip序列帧动画
     * @version Egret 2.4
     * @platform Web,Native
     */
    class MovieClipData extends HashObject {
        /**
         * @private
         * MovieClip数据
         */
        $mcData: any;
        /**
         * 总帧数
         * @version Egret 2.4
         * @platform Web,Native
         */
        numFrames: number;
        /**
         * 帧数据列表
         * @version Egret 2.4
         * @platform Web,Native
         */
        frames: any[];
        /**
         * 帧标签列表
         * @version Egret 2.4
         * @platform Web,Native
         */
        labels: any[];
        /**
         * 帧事件列表
         * @version Egret 2.4
         * @platform Web,Native
         */
        events: any[];
        /**
         * 帧率
         * @version Egret 2.4
         * @platform Web,Native
         */
        frameRate: number;
        /**
         * 纹理数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        textureData: any;
        /**
         * 纹理集
         * @version Egret 2.4
         * @platform Web,Native
         */
        spriteSheet: SpriteSheet;
        /**
         * 创建一个 egret.MovieClipData 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * @private
         *
         * @param mcData
         * @param textureData
         * @param spriteSheet
         */
        $init(mcData: any, textureData: any, spriteSheet: SpriteSheet): void;
        /**
         * 根据指定帧序号获取该帧对应的关键帧数据
         * @param frame {number} 帧序号
         * @returns {any} 帧数据对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        getKeyFrameData(frame: number): any;
        /**
         * 根据指定帧序号获取该帧对应的Texture对象
         * @param frame {number} 帧序号
         * @returns {egret.Texture} Texture对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        getTextureByFrame(frame: number): Texture;
        /**
         * @private
         *
         * @param resName
         * @returns
         */
        private getTextureByResName(resName);
        /**
         * @private
         *
         * @returns
         */
        $isDataValid(): boolean;
        /**
         * @private
         *
         * @returns
         */
        $isTextureValid(): boolean;
        /**
         * @private
         *
         * @param mcData
         */
        $fillMCData(mcData: any): void;
        /**
         * @private
         *
         * @param framesData
         */
        private fillFramesData(framesData);
        /**
         * @private
         *
         * @param frameLabelsData
         */
        private fillFrameLabelsData(frameLabelsData);
        /**
         * @private
         *
         * @param frameEventsData
         */
        private fillFrameEventsData(frameEventsData);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * MovieClip数据源
         */
        mcData: MovieClipData;
        /**
         * @private
         *
         * @param value
         */
        private setMCData(value);
    }
}
declare module egret {
    /**
     * @classdesc 使用 MovieClipDataFactory 类，可以生成 MovieClipData 对象用于创建MovieClip
     * @see http://docs.egret-labs.org/post/manual/displaycon/movieclip.html MovieClip序列帧动画
     * @version Egret 2.4
     * @platform Web,Native
     */
    class MovieClipDataFactory extends EventDispatcher {
        /**
         * 是否开启缓存
         * @version Egret 2.4
         * @platform Web,Native
         */
        enableCache: boolean;
        /**
         * @private
         */
        $mcDataSet: any;
        /**
         * @private
         */
        $spriteSheet: SpriteSheet;
        /**
         * @private
         */
        $mcDataCache: any;
        /**
         * 创建一个 egret.MovieClipDataFactory 对象
         * @param movieClipDataSet {any} MovieClip数据集，该数据集必须由Egret官方工具生成
         * @param texture {Texture} 纹理
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(movieClipDataSet?: any, texture?: Texture);
        /**
         * 清空缓存
         * @version Egret 2.4
         * @platform Web,Native
         */
        clearCache(): void;
        /**
         * 根据名字生成一个MovieClipData实例。可以用于创建MovieClip。
         * @param movieClipName {string} MovieClip名字. 可选参数，默认为"", 相当于取第一个MovieClip数据
         * @returns {MovieClipData} 生成的MovieClipData对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        generateMovieClipData(movieClipName?: string): MovieClipData;
        /**
         * @private
         *
         * @param movieClipName
         * @param cache
         * @returns
         */
        private findFromCache(movieClipName, cache);
        /**
         * @private
         *
         * @param movieClipName
         * @param movieClip
         * @param cache
         */
        private fillData(movieClipName, movieClip, cache);
        /**
         * MovieClip数据集
         * @version Egret 2.4
         * @platform Web,Native
         */
        mcDataSet: any;
        /**
         * MovieClip需要使用的纹理图
         */
        texture: Texture;
        /**
         * 由纹理图生成的精灵表
         * @version Egret 2.4
         * @platform Web,Native
         */
        spriteSheet: SpriteSheet;
        /**
         * @private
         *
         * @param value
         */
        private setTexture(value);
    }
}
declare module egret {
    /**
     * @language en_US
     * When the movieClip's current frame have a frameLabel, dispatches MovieClipEvent object. FrameLabel Event type: MovieClipEvent.FRAME_LABEL
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 当动画的当前帧有事件，将调度 MovieClipEvent 对象。帧事件类型 MovieClipEvent.FRAME_LABEL.
     * @version Egret 2.4
     * @platform Web,Native
     */
    class MovieClipEvent extends Event {
        /**
         * @language en_US
         * TextEvent create an object that contains information about movieClip events.
         * @param type Type of event, you can access the MovieClipEvent.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determine whether the Event object can be canceled. The default value is false.
         * @param frameLabel When the current frame have a frameLabel, the event listeners can access this information through the frameLabel property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 MovieClipEvent 对象，其中包含有关帧事件的信息。
         * @param type 事件的类型，可以作为 MovieClipEvent.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param frameLabel 动画上的帧事件。事件侦听器可以通过 frameLabel 属性访问此信息。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, frameLabel?: string);
        /**
         * @language en_US
         * Dispatched whenever the current frame have a frameLabel.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 动画的当前帧上有事件时调度
         * @version Egret 2.4
         * @platform Web,Native
         */
        static FRAME_LABEL: string;
        /**
         * @language en_US
         * In MovieClipEvent.FRAME_LABEL event, event corresponding string.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在 MovieClipEvent.FRAME_LABEL 事件中，event对应的字符串。
         * @version Egret 2.4
         * @platform Web,Native
         */
        frameLabel: string;
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown MovieClipEvent. The objects will be thrown in the object cache pool for the next round robin.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param text  MovieClipEvent object frameLabel
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出 MovieClipEvent 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type  事件类型
         * @param text  MovieClipEvent 对象的 frameLabel 赋值
         * @version Egret 2.4
         * @platform Web,Native
         */
        static dispatchMovieClipEvent(target: IEventDispatcher, type: string, frameLabel?: string): boolean;
    }
}
declare module egret {
    class ScrollEase {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         *
         * @param amount
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static get(amount: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quintOut: Function;
        /**
         *
         * @param pow
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getPowOut(pow: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quartOut: Function;
    }
    /**
     * @language en_US
     * ScrollTween is the animation easing class of Egret
     * @see http://docs.egret-labs.org/post/manual/anim/tween.html Tween缓动动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/tween/ScrollTween.ts
     */
    /**
     * @language zh_CN
     * Tween是Egret的动画缓动类
     * @see http://docs.egret-labs.org/post/manual/anim/tween.html ScrollTween ease animation
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/tween/ScrollTween.ts
     */
    class ScrollTween extends EventDispatcher {
        /**
         * @private
         */
        private static _tweens;
        /**
         * @private
         */
        private static IGNORE;
        /**
         * @private
         */
        private static _plugins;
        /**
         * @private
         */
        private static _inited;
        /**
         * @private
         */
        private _target;
        /**
         * @private
         */
        private _useTicks;
        /**
         * @private
         */
        private ignoreGlobalPause;
        /**
         * @private
         */
        private loop;
        /**
         * @private
         */
        private pluginData;
        /**
         * @private
         */
        private _curQueueProps;
        /**
         * @private
         */
        private _initQueueProps;
        /**
         * @private
         */
        private _steps;
        /**
         * @private
         */
        private _actions;
        /**
         * @private
         */
        private paused;
        /**
         * @private
         */
        private duration;
        /**
         * @private
         */
        private _prevPos;
        /**
         * @private
         */
        private position;
        /**
         * @private
         */
        private _prevPosition;
        /**
         * @private
         */
        private _stepPosition;
        /**
         * @private
         */
        private passive;
        /**
         * @language en_US
         * Activate an object and add a ScrollTween animation to the object
         * @param target {any} The object to be activated
         * @param props {any} Parameters, support loop onChange onChangeObj
         * @param pluginData {any} Write realized
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 激活一个对象，对其添加 ScrollTween 动画
         * @param target {any} 要激活 ScrollTween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false
         * @version Egret 2.4
         * @platform Web,Native
         */
        static get(target: any, props?: any, pluginData?: any, override?: boolean): ScrollTween;
        /**
         * @language en_US
         * Delete all ScrollTween animations from an object
         * @param target The object whose ScrollTween to be deleted
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 删除一个对象上的全部 ScrollTween 动画
         * @param target  需要移除 ScrollTween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        static removeTweens(target: any): void;
        /**
         * @private
         *
         * @param delta
         * @param paused
         */
        private static tick(timeStamp, paused?);
        private static _lastTime;
        /**
         * @private
         *
         * @param tween
         * @param value
         */
        private static _register(tween, value);
        /**
         * 创建一个 egret.ScrollTween 对象
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(target: any, props: any, pluginData: any);
        /**
         * @private
         *
         * @param target
         * @param props
         * @param pluginData
         */
        private initialize(target, props, pluginData);
        /**
         * @private
         *
         * @param value
         * @param actionsMode
         * @returns
         */
        private setPosition(value);
        /**
         * @private
         *
         * @param startPos
         * @param endPos
         * @param includeStart
         */
        private _runActions(startPos, endPos, includeStart?);
        /**
         * @private
         *
         * @param step
         * @param ratio
         */
        private _updateTargetProps(step, ratio);
        /**
         * @language en_US
         * Whether setting is paused
         * @param value {boolean} Whether to pause
         * @returns ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置是否暂停
         * @param value {boolean} 是否暂停
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        setPaused(value: boolean): ScrollTween;
        /**
         * @private
         *
         * @param props
         * @returns
         */
        private _cloneProps(props);
        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _addStep(o);
        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _appendQueueProps(o);
        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _addAction(o);
        /**
         * @language en_US
         * Modify the property of the specified display object to a specified value
         * @param props {Object} Property set of an object
         * @param duration {number} Duration
         * @param ease {egret.ScrollEase} Easing algorithm
         * @returns {egret.ScrollTween} ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定显示对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param duration {number} 持续时间
         * @param ease {egret.ScrollEase} 缓动算法
         * @returns {egret.ScrollTween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        to(props: any, duration?: number, ease?: Function): ScrollTween;
        /**
         * @language en_US
         * Execute callback function
         * @param callback {Function} Callback method
         * @param thisObj {any} this action scope of the callback method
         * @param params {Array<any>} Parameter of the callback method
         * @returns {egret.ScrollTween} ScrollTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 执行回调函数
         * @param callback {Function} 回调方法
         * @param thisObj {any} 回调方法this作用域
         * @param params {Array<any>} 回调方法参数
         * @returns {egret.ScrollTween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        call(callback: Function, thisObj?: any, params?: Array<any>): ScrollTween;
        /**
         * @method egret.ScrollTween#tick
         * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        tick(delta: number): void;
    }
}
declare module egret {
    /**
     * @language en_US
     * ScrollView auxiliary classes for slides, you will pass a display object constructor. It can display more than the range display object within the specified size range. And can easily drag in this range.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/display/ScrollView.ts
     */
    /**
     * @language zh_CN
     * ScrollView 是用于滑动的辅助类，将一个显示对象传入构造函数即可。可以在指定的尺寸范围内显示超过该范围的显示对象。并可以在此范围内随意拖动。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/display/ScrollView.ts
     */
    class ScrollView extends DisplayObjectContainer {
        /**
         * @private
         */
        _ScrV_Props_: ScrollViewProperties;
        /**
         * @language en_US
         * Start rolling threshold when the touch point from the initial touch point at a distance exceeding this value will trigger roll
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 开始滚动的阈值，当触摸点偏离初始触摸点的距离超过这个值时才会触发滚动
         * @version Egret 2.4
         * @platform Web,Native
         */
        scrollBeginThreshold: number;
        /**
         * @language en_US
         * Scrolling speed, the speed is required and the default speed ratio.
         * The range of scrollSpeed> 0 assigned to 2:00, the speed is 2 times the default speed
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 滚动速度，这个值为需要的速度与默认速度的比值。
         * 取值范围为 scrollSpeed > 0 赋值为 2 时，速度是默认速度的 2 倍
         * @version Egret 2.4
         * @platform Web,Native
         */
        scrollSpeed: number;
        /**
         * @language en_US
         * Whether to enable rebound, rebound When enabled, ScrollView contents allowed to continue to drag the border after arriving at the end user drag operation, and then bounce back boundary position
         * @default true
         * @version Egret 2.4
         */
        /**
         * @language zh_CN
         * 是否启用回弹，当启用回弹后，ScrollView中内容在到达边界后允许继续拖动，在用户拖动操作结束后，再反弹回边界位置
         * @default true
         * @version Egret 2.4
         */
        bounces: boolean;
        /**
         * @language en_US
         * Create a egret.ScrollView objects
         * @param content {egret.DisplayObject} You need to scroll object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.ScrollView 对象
         * @param content {egret.DisplayObject} 需要滚动的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(content?: DisplayObject);
        /**
         * @private
         */
        _content: DisplayObject;
        /**
         * @language en_US
         * Set to scroll object
         * @param content {egret.DisplayObject} You need to scroll object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置需要滚动的对象
         * @param content {egret.DisplayObject} 需要滚动的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        setContent(content: DisplayObject): void;
        /**
         * @language en_US
         * Remove rolling objects
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 移除滚动的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeContent(): void;
        /**
         * @language en_US
         * Vertical scroll bar display policy, on / off / auto.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 垂直滚动条显示策略，on/off/auto。
         * @version Egret 2.4
         * @platform Web,Native
         */
        verticalScrollPolicy: string;
        /**
         * @language en_US
         * The horizontal scroll bar display policy, on / off / auto.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 水平滚动条显示策略，on/off/auto。
         * @version Egret 2.4
         * @platform Web,Native
         */
        horizontalScrollPolicy: string;
        /**
         * @language en_US
         * Gets or sets the horizontal scroll position
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取或设置水平滚动位置,
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        scrollLeft: number;
        /**
         * @language en_US
         * Gets or sets the vertical scroll position
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取或设置垂直滚动位置,
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        scrollTop: number;
        /**
         * @language en_US
         * Set scroll position
         * @param top {number} The vertical scroll position
         * @param left {number} The horizontal scroll position
         * @param isOffset {boolean} Optional parameter, the default is false, whether it is the amount of scrolling increase as top = 1 on behalf of one pixel scroll up
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置滚动位置
         * @param top {number} 垂直滚动位置
         * @param left {number} 水平滚动位置
         * @param isOffset {boolean} 可选参数，默认是false，是否是滚动增加量，如 top=1 代表往上滚动1像素
         * @version Egret 2.4
         * @platform Web,Native
         */
        setScrollPosition(top: number, left: number, isOffset?: boolean): void;
        /**
         * @private
         *
         * @param top
         * @param left
         */
        private _validatePosition(top?, left?);
        /**
         * @private
         * @inheritDoc
         */
        $setWidth(value: number): boolean;
        /**
         * @private
         * @inheritDoc
         */
        $setHeight(value: number): boolean;
        /**
         * @private
         *
         */
        _updateContentPosition(): void;
        /**
         * @private
         *
         * @returns
         */
        _checkScrollPolicy(): boolean;
        /**
         * @private
         *
         * @param policy
         * @param contentLength
         * @param viewLength
         * @returns
         */
        private __checkScrollPolicy(policy, contentLength, viewLength);
        /**
         * @private
         *
         * @returns
         */
        _addEvents(): void;
        /**
         * @private
         *
         * @returns
         */
        _removeEvents(): void;
        private _tempStage;
        /**
         * @private
         *
         * @param e
         */
        _onTouchBegin(e: TouchEvent): void;
        /**
         * @private
         */
        private delayTouchBeginEvent;
        /**
         * @private
         */
        private touchBeginTimer;
        /**
         * @private
         *
         * @param event
         */
        _onTouchBeginCapture(event: TouchEvent): void;
        /**
         * @private
         *
         * @param event
         * @returns
         */
        private _onTouchEndCapture(event);
        /**
         * @private
         *
         */
        private _onTouchBeginTimer();
        /**
         * @private
         *
         * @param event
         * @returns
         */
        private dispatchPropagationEvent(event);
        /**
         * @private
         *
         * @param event
         * @returns
         */
        _onTouchMove(event: TouchEvent): void;
        /**
         * @private
         *
         * @param event
         * @returns
         */
        _onTouchEnd(event: TouchEvent): void;
        /**
         * @private
         *
         * @param event
         * @returns
         */
        _onEnterFrame(event: Event): void;
        /**
         * @private
         *
         * @param e
         * @returns
         */
        private _logTouchEvent(e);
        /**
         * @private
         *
         * @param e
         * @returns
         */
        private _getPointChange(e);
        /**
         * @private
         *
         * @param e
         * @returns
         */
        private _calcVelocitys(e);
        /**
         * @private
         *
         * @returns
         */
        _getContentWidth(): number;
        /**
         * @private
         *
         * @returns
         */
        _getContentHeight(): number;
        /**
         * @language en_US
         * The left side of the maximum distance
         * @returns The left side of the maximum distance
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 距离左侧的最大值
         * @returns 距离左侧最大值
         * @version Egret 2.4
         * @platform Web,Native
         */
        getMaxScrollLeft(): number;
        /**
         * @language en_US
         * Above the maximum distance
         * @returns Above the maximum distance
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 距离上方最大值
         * @returns 距离上方最大值
         * @version Egret 2.4
         * @platform Web,Native
         */
        getMaxScrollTop(): number;
        /**
         * @private
         */
        private static weight;
        /**
         * @private
         *
         */
        private _moveAfterTouchEnd();
        /**
         * @private
         *
         * @param tw
         */
        private onTweenFinished(tw);
        /**
         * @private
         *
         * @returns
         */
        _onScrollStarted(): void;
        /**
         * @private
         *
         * @returns
         */
        _onScrollFinished(): void;
        /**
         * @language en_US
         * Set the scroll position above the distance
         * @param scrollTop Position above distance
         * @param duration Easing of time, in milliseconds
         * @returns Get tween vertical scrolling
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置滚动距离上方的位置
         * @param scrollTop 距离上方的位置
         * @param duration 缓动时间，毫秒单位
         * @returns 获取垂直滚动的tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        setScrollTop(scrollTop: number, duration?: number): void;
        /**
         * @language en_US
         * Set the scroll position from the left side
         * @param scrollLeft From the position on the left side
         * @param duration Get tween vertical scrolling
         * @returns Gets the horizontal scroll tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置滚动距离左侧的位置
         * @param scrollLeft 距离左侧的位置
         * @param duration 缓动时间，毫秒单位
         * @returns 获取水平滚动的tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        setScrollLeft(scrollLeft: number, duration?: number): void;
        /**
         * @private
         *
         * @param pixelsPerMS
         * @param curPos
         * @param maxPos
         * @returns
         */
        private getAnimationDatas(pixelsPerMS, curPos, maxPos);
        /**
         * @private
         *
         * @param event
         * @returns
         */
        private cloneTouchEvent(event);
        /**
         * @private
         *
         * @returns
         */
        private throwNotSupportedError();
        /**
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         * @version Egret 2.4
         * @platform Web,Native
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         * @version Egret 2.4
         * @platform Web,Native
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         * @deprecated
         * @param index {number}
         * @returns {DisplayObject}
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeChildAt(index: number): DisplayObject;
        /**
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        setChildIndex(child: DisplayObject, index: number): void;
        /**
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         * @version Egret 2.4
         * @platform Web,Native
         */
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        swapChildrenAt(index1: number, index2: number): void;
    }
}
declare module egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    class ScrollViewProperties {
        /**
         * @private
         */
        _verticalScrollPolicy: string;
        /**
         * @private
         */
        _horizontalScrollPolicy: string;
        /**
         * @private
         */
        _scrollLeft: number;
        /**
         * @private
         */
        _scrollTop: number;
        /**
         * @private
         */
        _hCanScroll: boolean;
        /**
         * @private
         */
        _vCanScroll: boolean;
        /**
         * @private
         */
        _lastTouchPosition: egret.Point;
        /**
         * @private
         */
        _touchStartPosition: egret.Point;
        /**
         * @private
         */
        _scrollStarted: boolean;
        /**
         * @private
         */
        _lastTouchTime: number;
        /**
         * @private
         */
        _lastTouchEvent: TouchEvent;
        /**
         * @private
         */
        _velocitys: Array<{
            x: number;
            y: number;
        }>;
        /**
         * @private
         */
        _isHTweenPlaying: boolean;
        /**
         * @private
         */
        _isVTweenPlaying: boolean;
        /**
         * @private
         */
        _hScrollTween: ScrollTween;
        /**
         * @private
         */
        _vScrollTween: ScrollTween;
        /**
         * @private
         */
        _bounces: boolean;
    }
}
declare module egret {
    /**
     * @language en_US
     * The URLRequest class captures all of the information in a single HTTP request.
     * @see http://docs.egret-labs.org/post/manual/net/createconnect.html Build communication request
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequest.ts
     */
    /**
     * @language zh_CN
     * URLRequest 类可捕获单个 HTTP 请求中的所有信息。
     * @see http://docs.egret-labs.org/post/manual/net/createconnect.html 构建通信请求
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequest.ts
     */
    class URLRequest extends HashObject {
        /**
         * @language en_US
         * Create an egret.URLRequest object
         * @param url {string} Addresses for URL requests
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.URLRequest 对象
         * @param url {string} 进行网络请求的地址
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(url?: string);
        /**
         * @language en_US
         * An object contains data to be transmitted with the URL request.
         * This property is used in conjunction with the method property.  When the value of method is GET, the value of data is appended to the value of URLRequest.url, using HTTP query-string syntax.
         * When the method value is POST (or any value other than GET), the value of data is transmitted in the body of the HTTP request.
         * The URLRequest API supports  binary POST, URL-encoded variables, as well as strings. The data object can be a ByteArray, URLVariables, or String object. The way in which the data is used depends on the type of object used: If the object is a ByteArray object, the binary data of the ByteArray object is used as POST data. For GET, data of ByteArray type is not supported.
         * If the object is a URLVariables object and the method is POST, then the variables are encoded using x-www-form-urlencoded format and the resulting string is used as POST data.
         * If the object is a URLVariables object and the method is GET, the URLVariables object will define variables to be sent with the URLRequest object.
         * Otherwise, the object is converted into a string, and the string is used as the POST or GET data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个对象，它包含将随 URL 请求一起传输的数据。
         * 该属性与 method 属性配合使用。当 method 值为 GET 时，将使用 HTTP 查询字符串语法将 data 值追加到 URLRequest.url 值。
         * 当 method 值为 POST（或 GET 之外的任何值）时，将在 HTTP 请求体中传输 data 值。
         * URLRequest API 支持二进制 POST，并支持 URL 编码变量和字符串。该数据对象可以是 ByteArray、URLVariables 或 String 对象。
         * 该数据的使用方式取决于所用对象的类型：
         * 如果该对象为 ByteArray 对象，则 ByteArray 对象的二进制数据用作 POST 数据。对于 GET，不支持 ByteArray 类型的数据。
         * 如果该对象是 URLVariables 对象，并且该方法是 POST，则使用 x-www-form-urlencoded 格式对变量进行编码，并且生成的字符串会用作 POST 数据。
         * 如果该对象是 URLVariables 对象，并且该方法是 GET，则 URLVariables 对象将定义要随 URLRequest 对象一起发送的变量。
         * 否则，该对象会转换为字符串，并且该字符串会用作 POST 或 GET 数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        data: any;
        /**
         * @language en_US
         * Request method, valid values are URLRequestMethod.GET or URLRequestMethod.POST.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 请求方式，有效值为URLRequestMethod.GET 或 URLRequestMethod.POST。
         * @version Egret 2.4
         * @platform Web,Native
         */
        method: string;
        /**
         * @language en_US
         * The requested URL.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 所请求的 URL。
         * @version Egret 2.4
         * @platform Web,Native
         */
        url: string;
        /**
         * @language en_US
         * The array of HTTP request headers to be appended to the HTTP request. The array is composed of URLRequestHeader objects.
         * Each object in the array must be a URLRequestHeader object that contains a name string and a value string.
         * Because of browser compatibility, this property has not been achieved in html5
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要追加到 HTTP 请求的 HTTP 请求标头的数组。该数组由 URLRequestHeader 对象组成。
         * 数组中的每一对象必须是包含一个名称字符串和一个值字符串的 URLRequestHeader 对象。
         * 由于浏览器兼容性原因，该属性在 html5 中并未实现
         * @version Egret 2.4
         * @platform Web,Native
         */
        requestHeaders: Array<URLRequestHeader>;
    }
}
declare module egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    interface NetContext extends HashObject {
        /**
         *
         * @param loader
         * @version Egret 2.4
         * @platform Web,Native
         */
        proceed(loader: URLLoader): void;
    }
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var NetContext: {
        new (): NetContext;
        getNetContext(): NetContext;
    };
    /**
     * @private
     *
     * @param request
     * @returns
     */
    function $getUrl(request: URLRequest): string;
}
declare module egret {
    /**
     * @language en_US
     * UThe URLLoader class downloads data from a URL as text, binary data, or URL-encoded variables.  It is useful for downloading text files, XML, or other information to be used in a dynamic, data-driven application.
     * A URLLoader object downloads all of the data from a URL before making it available to code in the applications. It sends out notifications about the progress of the download,
     * which you can monitor through bytesLoaded and bytesTotal properties, as well as through dispatched events.
     * @see http://docs.egret-labs.org/post/manual/net/createconnect.html Build communication request
     * @event egret.Event.COMPLETE Dispatched when the net request is complete.
     * @event egret.IOErrorEvent.IO_ERROR io error.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLLoader.ts
     */
    /**
     * @language zh_CN
     * URLLoader 类以文本、二进制数据或 URL 编码变量的形式从 URL 下载数据。在下载文本文件、XML 或其他用于动态数据驱动应用程序的信息时，它很有用。
     * URLLoader 对象会先从 URL 中下载所有数据，然后才将数据用于应用程序中的代码。它会发出有关下载进度的通知，
     * 通过 bytesLoaded 和 bytesTotal 属性以及已调度的事件，可以监视下载进度。
     * @see http://docs.egret-labs.org/post/manual/net/createconnect.html 构建通信请求
     * @event egret.Event.COMPLETE 加载完成后调度。
     * @event egret.IOErrorEvent.IO_ERROR 加载错误后调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLLoader.ts
     */
    class URLLoader extends EventDispatcher {
        /**
         * @language en_US
         * Create an egret.URLLoader object
         * @param request {URLRequest} A URLRequest object specifies the URL to be downloaded.
         * If this parameter is omitted, no load operation begins. If a parameter is specified, the load operation begins immediately
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建 egret.URLLoader 对象
         * @param request {URLRequest} 一个 URLRequest 对象，指定要下载的 URL。
         * 如果省略该参数，则不开始加载操作。如果已指定参数，则立即开始加载操作
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(request?: URLRequest);
        /**
         * @language en_US
         * Control whether the downloaded data is received as text (URLLoaderDataFormat.TEXT), raw binary data (URLLoaderDataFormat.BINARY), or URL-encoded variables (URLLoaderDataFormat.VARIABLES).
         * If the value of the dataFormat property is URLLoaderDataFormat.TEXT, the received data is a string containing the text of the loaded file.
         * If the value of the dataFormat property is URLLoaderDataFormat.BINARY, the received data is a ByteArray object containing the raw binary data.
         * If the value of the dataFormat property is URLLoaderDataFormat.TEXTURE, the received data is a Texture object containing the bitmap data.
         * If the value of the dataFormat property is URLLoaderDataFormat.VARIABLES, the received data is a URLVariables object containing the URL-encoded variables.
         * The default value is URLLoaderDataFormat.TEXT.
         * @default egret.URLLoaderDataFormat.TEXT
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 控制是以文本 (URLLoaderDataFormat.TEXT)、原始二进制数据 (URLLoaderDataFormat.BINARY) 还是 URL 编码变量 (URLLoaderDataFormat.VARIABLES) 接收下载的数据。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
         * @default egret.URLLoaderDataFormat.TEXT
         * @version Egret 2.4
         * @platform Web,Native
         */
        dataFormat: string;
        /**
         * @language en_US
         * The data received from the load operation. This property is populated only when the load operation is complete. The format of the data depends on the setting of the dataFormat property:
         * If the dataFormat property is URLLoaderDataFormat.TEXT, the received data is a string containing the text of the loaded file.
         * If the dataFormat property is URLLoaderDataFormat.BINARY, the received data is a ByteArray object containing the raw binary data.
         * If the dataFormat property is URLLoaderDataFormat.TEXTURE, the received data is a Texture object containing the bitmap data.
         * If the dataFormat property is URLLoaderDataFormat.VARIABLES, the received data is a URLVariables object containing the URL-encoded variables.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从加载操作接收的数据。只有完成加载操作时，才会填充该属性。该数据的格式取决于 dataFormat 属性的设置：
         * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        data: any;
        /**
         * @private
         */
        _request: URLRequest;
        /**
         * @language en_US
         * Send and load data from the specified URL. The data can be received as text, raw binary data, or URL-encoded variables, depending on the value you set for the dataFormat property.
         * Note that the default value of the dataFormat property is text. If you want to send data to the specified URL, you can set the data property in the URLRequest object.
         * @param request {URLRequest}  A URLRequest object specifies the URL to be downloaded.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从指定的 URL 发送和加载数据。可以以文本、原始二进制数据或 URL 编码变量格式接收数据，这取决于为 dataFormat 属性所设置的值。
         * 请注意 dataFormat 属性的默认值为文本。如果想将数据发送至指定的 URL，则可以在 URLRequest 对象中设置 data 属性。
         * @param request {URLRequest}  一个 URLRequest 对象，指定要下载的 URL。
         * @version Egret 2.4
         * @platform Web,Native
         */
        load(request: URLRequest): void;
        /**
         * @private
         */
        _status: number;
        /**
         * @private
         *
         */
        __recycle(): void;
    }
}
declare module egret {
    /**
     * @language en_US
     * The URLLoaderDataFormat class provides values that specify how downloaded data is received.
     * @see http://docs.egret-labs.org/post/manual/net/netformat.html Read different data format
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLLoaderDataFormat.ts
     */
    /**
     * @language zh_CN
     * URLLoaderDataFormat 类提供了一些用于指定如何接收已下载数据的值。
     * @see http://docs.egret-labs.org/post/manual/net/netformat.html 读取不同数据格式
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLLoaderDataFormat.ts
     */
    class URLLoaderDataFormat {
        /**
         * @language en_US
         * Specify that downloaded data is received as raw binary data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定以原始二进制数据形式接收下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static BINARY: string;
        /**
         * @language en_US
         * Specify that downloaded data is received as text.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定以文本形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TEXT: string;
        /**
         * @language en_US
         * Specify that downloaded data is received as URL-encoded variables.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定以 URL 编码变量形式接收下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static VARIABLES: string;
        /**
         * @language en_US
         * Specify that downloaded data is received as bitmap texture.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定以位图纹理形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static TEXTURE: string;
        /**
         * @language en_US
         * Specify that downloaded data is received as sound.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定以声音形式接收已下载的数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static SOUND: string;
    }
}
declare module egret {
    /**
     * @language en_US
     * A URLRequestHeader object encapsulates a single HTTP request header and consists of a name/value pair.  URLRequestHeader objects are used in the requestHeaders property of the URLRequest class.
     * Note: Because of browser compatibility, this property has not been achieved in html5
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequestHeader.ts
     */
    /**
     * @language zh_CN
     * URLRequestHeader 对象封装了一个 HTTP 请求标头并由一个名称/值对组成。URLRequestHeader 对象在 URLRequest 类的 requestHeaders 属性中使用。
     * 注意：由于浏览器兼容性原因，在 html5 中并未实现
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequestHeader.ts
     */
    class URLRequestHeader {
        /**
         * @language en_US
         * HTTP request header name, such as Content-Type
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * HTTP 请求标头名称，如 Content-Type
         * @version Egret 2.4
         * @platform Web,Native
         */
        name: string;
        /**
         * @language en_US
         * The values associated with the name property (such as text/plain).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 与 name 属性相关联的值，如 text/plain
         * @version Egret 2.4
         * @platform Web,Native
         */
        value: string;
        /**
         * @language en_US
         * Create an egret.URLRequestHeader object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.URLRequestHeader 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(name: string, value: string);
    }
}
declare module egret {
    /**
     * @language en_US
     * The URLRequestMethod class provides values that specify whether the
     * URLRequest object should use the POST method or the GET method when sending data to a server.
     * @see http://docs.egret-labs.org/post/manual/net/postget.html POST与GET
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequestMethod.ts
     */
    /**
     * @language zh_CN
     * URLRequestMethod 类提供了一些值，这些值可指定在将数据发送到服务器时，
     * URLRequest 对象应使用 POST 方法还是 GET 方法。
     * @see http://docs.egret-labs.org/post/manual/net/postget.html POST与GET
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLRequestMethod.ts
     */
    class URLRequestMethod {
        /**
         * @language en_US
         * Specify that the URLRequest object is a GET.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 URLRequest 对象是一个 GET。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static GET: string;
        /**
         * @language en_US
         * Specify that the URLRequest object is a POST.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 URLRequest 对象是一个 POST。
         * @version Egret 2.4
         * @platform Web,Native
         */
        static POST: string;
    }
}
declare module egret {
    /**
     * @language en_US
     * The URLVariables class allows you to transfer variables between an application and a server.
     * Use URLVariables objects with methods of the URLLoader class and the data property of the URLRequest class.
     * @see http://docs.egret-labs.org/post/manual/net/senddata.html Send the request with parameters
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLVariables.ts
     */
    /**
     * @language zh_CN
     * 使用 URLVariables 类可以在应用程序和服务器之间传输变量。
     * 将 URLVariables 对象与 URLLoader 类的方法、URLRequest 类的 data 属性一起使用。
     * @see http://docs.egret-labs.org/post/manual/net/senddata.html 发送带参数的请求
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/net/URLVariables.ts
     */
    class URLVariables extends HashObject {
        /**
         * @language en_US
         * Create an egret.URLVariable object
         * @param source {String} A URL-encoded string containing name/value pairs.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.URLVariables 对象
         * @param source {String} 包含名称/值对的 URL 编码的字符串。
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(source?: string);
        /**
         * @language en_US
         * Key-value pair data object saved in this URLVariables object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 此 URLVariables 储存的键值对数据对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        variables: Object;
        /**
         * @language en_US
         * Convert the variable string into the property of this URLVariables.variables object.
         * @param source {string}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将变量字符串转换为此 URLVariables.variables 对象的属性。
         * @param source {string}
         * @version Egret 2.4
         * @platform Web,Native
         */
        decode(source: string): void;
        /**
         * @language en_US
         * Return a string containing all enumerable variables using  the MIME content encoding format : application/x-www-form-urlencoded.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 以 MIME 内容编码格式 application/x-www-form-urlencoded 返回包含所有可枚举变量的字符串。
         * @version Egret 2.4
         * @platform Web,Native
         */
        toString(): string;
        /**
         * @private
         *
         * @param key
         * @param value
         */
        private encodeValue(key, value);
        /**
         * @private
         *
         * @param key
         * @param value
         */
        private encodeArray(key, value);
    }
}
declare module egret {
    /**
    * @language en_US
    * @version Egret 2.4
    * @platform Web,Native
    * @includeExample extension/game/player/Ticker.ts
    */
    /**
     * @language zh_CN
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/player/Ticker.ts
     */
    class Ticker extends EventDispatcher {
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        private _timeScale;
        private _paused;
        private _callIndex;
        private _callList;
        private _lastTime;
        private update(timeStamp);
        private callBackList;
        /**
         * 注册帧回调事件，同一函数的重复监听会被忽略。
         * @method egret.Ticker#register
         * @param listener {Function} 帧回调函数,参数返回上一帧和这帧的间隔时间。示例：onEnterFrame(frameTime:number):void
         * @param thisObject {any} 帧回调函数的this对象
         * @param priority {number} 事件优先级，开发者请勿传递 Number.NEGATIVE_INFINITY 和 Number.POSITIVE_INFINITY
         * @version Egret 2.4
         * @platform Web,Native
         * @deprecated
         */
        register(listener: Function, thisObject: any, priority?: number): void;
        /**
         * 取消侦听enterFrame事件
         * @method egret.Ticker#unregister
         * @param listener {Function} 事件侦听函数
         * @param thisObject {any} 侦听函数的this对象
         * @version Egret 2.4
         * @platform Web,Native
         * @deprecated
         */
        unregister(listener: Function, thisObject: any): void;
        /**
         * @deprecated
         * @param timeScale {number}
         * @private
         */
        setTimeScale(timeScale: number): void;
        /**
         * @deprecated
         * @method egret.Ticker#getTimeScale
         * @private
         */
        getTimeScale(): number;
        /**
         * 暂停
         * @deprecated
         * @method egret.Ticker#pause
         */
        pause(): void;
        /**
         * 继续
         * @deprecated
         * @method egret.Ticker#resume
         */
        resume(): void;
        /**
         * @private
         */
        private static instance;
        /**
         * @method egret.Ticker.getInstance
         * @returns {Ticker}
         * @version Egret 2.4
         * @platform Web,Native
         * @deprecated
         */
        static getInstance(): egret.Ticker;
    }
}
declare module egret {
    /**
     * @class egret.MainContext
     * @classdesc
     * MainContext是游戏的核心跨平台接口，组合了多个功能Context，并是游戏启动的主入口
     * @extends egret.EventDispatcher
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    class MainContext extends EventDispatcher {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * 渲染Context
         * @member egret.MainContext#rendererContext
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * 触摸Context
         * @member egret.MainContext#touchContext
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * 网络Context
         * @member egret.MainContext#netContext
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * 设备divice
         * @member egret.MainContext#deviceContext
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * 舞台
         * @member egret.MainContext#stage
         * @version Egret 2.4
         * @platform Web,Native
         */
        stage: Stage;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static deviceType: string;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static DEVICE_PC: string;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static DEVICE_MOBILE: string;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static runtimeType: string;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static RUNTIME_HTML5: string;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static RUNTIME_NATIVE: string;
        /**
         * 游戏启动，开启主循环，参考Flash的滑动跑道模型
         * @method egret.MainContext#run
         * @version Egret 2.4
         * @platform Web,Native
         */
        run(): void;
        /**
         * @private
         */
        private static _instance;
        /**
         * @method egret.Ticker.getInstance
         * @returns {Ticker}
         * @version Egret 2.4
         * @platform Web,Native
         */
        static instance: egret.MainContext;
    }
}
declare var testDeviceType1: () => boolean;
declare var testRuntimeType1: () => boolean;
declare module egret {
    /**
     * @language en_US
     * Tool class for object cache repeat use, which can be used to construct an object pool. Objects are automatically recycled after a certain duration.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/Recycler.ts
     */
    /**
     * @language zh_CN
     * 对象缓存复用工具类，可用于构建对象池，一段时间后会自动回收对象。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/Recycler.ts
     */
    class Recycler extends HashObject {
        /**
         * @language en_US
         * Create an egret.Recycler object
         * @param autoDisposeTime {number} Number of frames when objects are destroyed automatically. Default value: 300
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.Recycler 对象
         * @param autoDisposeTime {number} 多少帧后自动销毁对象，默认值300
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(autoDisposeTime?: number);
        /**
         * @private
         */
        static _callBackList: Array<any>;
        static $init(): void;
        static onUpdate(timeStamp: number): boolean;
        /**
         * @private
         * 多少帧后自动销毁对象。
         */
        private autoDisposeTime;
        /**
         * @private
         */
        private frameCount;
        /**
         * @private
         *
         */
        $checkFrame(): void;
        /**
         * @private
         */
        private objectPool;
        /**
         * @private
         */
        private _length;
        /**
         * @language en_US
         * Number of cached objects"
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 缓存的对象数量
         * @version Egret 2.4
         * @platform Web,Native
         */
        length: number;
        /**
         * @language en_US
         * Cache an object for repeat use
         * @param object {any} The object to be cached
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 缓存一个对象以复用
         * @param object {any} 需要缓存的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        push(object: any): void;
        /**
         * @language en_US
         * Obtain a cached object
         * @returns {any} The obtained cached object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取一个缓存的对象
         * @returns {any} 获得的缓存对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        pop(): any;
        /**
         * @language en_US
         * Immediately clear all cached objects.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 立即清空所有缓存的对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        dispose(): void;
    }
}
declare module egret {
    /**
     * @language en_US
     * Specified function after a specified delay run (in milliseconds).
     * @param listener {Function} Listener function
     * @param thisObject {any} this object
     * @param delay {number} Delay time, in milliseconds
     * @param ...args {any} Parameter list
     * @returns {number} Return index which can be used for clearInterval
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/setInterval.ts
     */
    /**
     * @language zh_CN
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
     * @returns {number} 返回索引，可以用于 clearInterval
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/setInterval.ts
     */
    function setInterval(listener: Function, thisObject: any, delay: number, ...args: any[]): number;
    /**
     * @language en_US
     * Clear function to run after a specified delay.
     * @param key {number} Index that egret.setInterval returns
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/setInterval.ts
     */
    /**
     * @language zh_CN
     * 清除指定延迟后运行的函数。
     * @param key {number} egret.setInterval所返回的索引
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/setInterval.ts
     */
    function clearInterval(key: number): void;
}
declare module egret {
    /**
     * @language en_US
     * Run the designated function in specified delay (in milliseconds).
     * @param listener {Function} Listener function
     * @param thisObject {any} this object
     * @param delay {number} Delay time, in milliseconds
     * @param ...args {any} Parameter list
     * @returns {number} Return index which can be used for clearTimeout
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/setTimeout.ts
     */
    /**
     * @language zh_CN
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
     * @returns {number} 返回索引，可以用于 clearTimeout
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/setTimeout.ts
     */
    function setTimeout(listener: Function, thisObject: any, delay: number, ...args: any[]): number;
    /**
     * @language en_US
     * Function run after the specified delay is cleared.
     * @param key {number} Index that egret.setTimeout returns
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 清除指定延迟后运行的函数。
     * @param key {number} egret.setTimeout所返回的索引
     * @version Egret 2.4
     * @platform Web,Native
     */
    function clearTimeout(key: number): void;
}
