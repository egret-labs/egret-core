declare module egret {
    /**
     * @language en_US
     * Easing function set. Different easing functions are used to make an animation proceed according to the corresponding equation
     * @see http://bbs.egret-labs.org/thread-392-1-1.html Tween and Ease
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 缓动函数集合，使用不同的缓动函数使得动画按照对应的方程进行
     * @see http://bbs.egret-labs.org/thread-392-1-1.html Tween和Ease
     * @version Egret 2.4
     * @platform Web,Native
     */
    class Ease {
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
         *
         * @param pow
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getPowIn(pow: any): Function;
        /**
         *
         * @param pow
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getPowOut(pow: any): Function;
        /**
         *
         * @param pow
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getPowInOut(pow: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quadIn: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quadOut: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quadInOut: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static cubicIn: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static cubicOut: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static cubicInOut: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quartIn: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quartOut: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quartInOut: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quintIn: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quintOut: Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quintInOut: Function;
        /**
         *
         * @param t
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static sineIn(t: any): number;
        /**
         *
         * @param t
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static sineOut(t: any): number;
        /**
         *
         * @param t
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static sineInOut(t: any): number;
        /**
         *
         * @param amount
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getBackIn(amount: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static backIn: Function;
        /**
         *
         * @param amount
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getBackOut(amount: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static backOut: Function;
        /**
         *
         * @param amount
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getBackInOut(amount: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static backInOut: Function;
        /**
         *
         * @param t
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static circIn(t: any): number;
        /**
         *
         * @param t
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static circOut(t: any): number;
        /**
         *
         * @param t
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static circInOut(t: any): number;
        /**
         *
         * @param t
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static bounceIn(t: any): number;
        /**
         *
         * @param t
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static bounceOut(t: any): number;
        /**
         *
         * @param t
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static bounceInOut(t: any): number;
        /**
         *
         * @param amplitude
         * @param period
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getElasticIn(amplitude: any, period: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static elasticIn: Function;
        /**
         *
         * @param amplitude
         * @param period
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getElasticOut(amplitude: any, period: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static elasticOut: Function;
        /**
         *
         * @param amplitude
         * @param period
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getElasticInOut(amplitude: any, period: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static elasticInOut: Function;
    }
}
declare module egret {
    /**
     * @language en_US
     * Tween is the animation easing class of Egret
     * @see http://docs.egret-labs.org/post/manual/anim/tween.html Tween缓动动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
     */
    /**
     * @language zh_CN
     * Tween是Egret的动画缓动类
     * @see http://docs.egret-labs.org/post/manual/anim/tween.html Tween ease animation
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
     */
    class Tween extends EventDispatcher {
        /**
         * 不做特殊处理
         * @constant {number} egret.Tween.NONE
         * @private
         */
        private static NONE;
        /**
         * 循环
         * @constant {number} egret.Tween.LOOP
         * @private
         */
        private static LOOP;
        /**
         * 倒序
         * @constant {number} egret.Tween.REVERSE
         * @private
         */
        private static REVERSE;
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
         * Activate an object and add a Tween animation to the object
         * @param target {any} The object to be activated
         * @param props {any} Parameters, support loop onChange onChangeObj
         * @param pluginData {any} Write realized
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 激活一个对象，对其添加 Tween 动画
         * @param target {any} 要激活 Tween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false
         * @version Egret 2.4
         * @platform Web,Native
         */
        static get(target: any, props?: any, pluginData?: any, override?: boolean): Tween;
        /**
         * @language en_US
         * Delete all Tween animations from an object
         * @param target The object whose Tween to be deleted
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 删除一个对象上的全部 Tween 动画
         * @param target  需要移除 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        static removeTweens(target: any): void;
        /**
         * @language en_US
         * Pause all Tween animations of a certain object
         * @param target The object whose Tween to be paused
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 暂停某个对象的所有 Tween
         * @param target 要暂停 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        static pauseTweens(target: any): void;
        /**
         * @language en_US
         * Resume playing all easing of a certain object
         * @param target The object whose Tween to be resumed
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 继续播放某个对象的所有缓动
         * @param target 要继续播放 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        static resumeTweens(target: any): void;
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
         * @language en_US
         * Delete all Tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 删除所有 Tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        static removeAllTweens(): void;
        /**
         * 创建一个 egret.Tween 对象
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
        private setPosition(value, actionsMode?);
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
         * @returns Tween object itself
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
        setPaused(value: boolean): Tween;
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
         * @private
         *
         * @param props
         * @param o
         */
        private _set(props, o);
        /**
         * @language en_US
         * Wait the specified milliseconds before the execution of the next animation
         * @param duration {number} Waiting time, in milliseconds
         * @param passive {boolean} Whether properties are updated during the waiting time
         * @returns Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等待指定毫秒后执行下一个动画
         * @param duration {number} 要等待的时间，以毫秒为单位
         * @param passive {boolean} 等待期间属性是否会更新
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        wait(duration: number, passive?: boolean): Tween;
        /**
         * @language en_US
         * Modify the property of the specified object to a specified value
         * @param props {Object} Property set of an object
         * @param duration {number} Duration
         * @param ease {egret.Ease} Easing algorithm
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param duration {number} 持续时间
         * @param ease {egret.Ease} 缓动算法
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        to(props: any, duration?: number, ease?: Function): Tween;
        /**
         * @language en_US
         * Execute callback function
         * @param callback {Function} Callback method
         * @param thisObj {any} this action scope of the callback method
         * @param params {Array<any>} Parameter of the callback method
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 执行回调函数
         * @param callback {Function} 回调方法
         * @param thisObj {any} 回调方法this作用域
         * @param params {Array<any>} 回调方法参数
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        call(callback: Function, thisObj?: any, params?: Array<any>): Tween;
        /**
         * Now modify the properties of the specified object to the specified value
         * @param props {Object} Property set of an object
         * @param target The object whose Tween to be resumed
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * 立即将指定对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param target 要继续播放 Tween 的对象
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        set(props: any, target?: any): Tween;
        /**
         * @language en_US
         * Execute
         * @param tween {egret.Tween} The Tween object to be operated. Default: this
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 执行
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        play(tween?: Tween): Tween;
        /**
         * @language en_US
         * Pause
         * @param tween {egret.Tween} The Tween object to be operated. Default: this
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 暂停
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        pause(tween?: Tween): Tween;
        /**
         * @method egret.Tween#tick
         * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        tick(delta: number): void;
    }
}
