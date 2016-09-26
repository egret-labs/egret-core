declare module egret {
    /**
     * @language en_US
     * Easing function set. Different easing functions are used to make an animation proceed according to the corresponding equation
     * @see http://edn.egret.com/cn/index.php/article/index/id/53 Easing effect Demo
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 缓动函数集合，使用不同的缓动函数使得动画按照对应的方程进行
     * @see http://edn.egret.com/cn/index.php/article/index/id/53 缓动效果演示
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
         * @language en_US
         * get.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static get(amount: any): Function;
        /**
         * @language en_US
         * get pow in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get pow in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getPowIn(pow: any): Function;
        /**
         * @language en_US
         * get pow out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get pow out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getPowOut(pow: any): Function;
        /**
         * @language en_US
         * get pow in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get pow in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getPowInOut(pow: any): Function;
        /**
         * @language en_US
         * quad in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quad in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quadIn: Function;
        /**
         * @language en_US
         * quad out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quad out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quadOut: Function;
        /**
         * @language en_US
         * quad in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quad in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quadInOut: Function;
        /**
         * @language en_US
         * cubic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * cubic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static cubicIn: Function;
        /**
         * @language en_US
         * cubic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * cubic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static cubicOut: Function;
        /**
         * @language en_US
         * cubic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * cubic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static cubicInOut: Function;
        /**
         * @language en_US
         * quart in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quart in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quartIn: Function;
        /**
         * @language en_US
         * quart out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quart out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quartOut: Function;
        /**
         * @language en_US
         * quart in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quart in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quartInOut: Function;
        /**
         * @language en_US
         * quint in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quint in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quintIn: Function;
        /**
         * @language en_US
         * quint out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quint out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quintOut: Function;
        /**
         * @language en_US
         * quint in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * quint in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quintInOut: Function;
        /**
         * @language en_US
         * sine in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * sine in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static sineIn(t: any): number;
        /**
         * @language en_US
         * sine out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * sine out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static sineOut(t: any): number;
        /**
         * @language en_US
         * sine in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * sine in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static sineInOut(t: any): number;
        /**
         * @language en_US
         * get back in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get back in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getBackIn(amount: any): Function;
        /**
         * @language en_US
         * back in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * back in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static backIn: Function;
        /**
         * @language en_US
         * get back out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get back out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getBackOut(amount: any): Function;
        /**
         * @language en_US
         * back out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * back out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static backOut: Function;
        /**
         * @language en_US
         * get back in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get back in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getBackInOut(amount: any): Function;
        /**
         * @language en_US
         * back in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * back in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static backInOut: Function;
        /**
         * @language en_US
         * circ in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * circ in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static circIn(t: any): number;
        /**
         * @language en_US
         * circ out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * circ out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static circOut(t: any): number;
        /**
         * @language en_US
         * circ in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * circ in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static circInOut(t: any): number;
        /**
         * @language en_US
         * bounce in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * bounce in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static bounceIn(t: any): number;
        /**
         * @language en_US
         * bounce out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * bounce out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static bounceOut(t: any): number;
        /**
         * @language en_US
         * bounce in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * bounce in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static bounceInOut(t: any): number;
        /**
         * @language en_US
         * get elastic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get elastic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getElasticIn(amplitude: any, period: any): Function;
        /**
         * @language en_US
         * elastic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * elastic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static elasticIn: Function;
        /**
         * @language en_US
         * get elastic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get elastic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getElasticOut(amplitude: any, period: any): Function;
        /**
         * @language en_US
         * elastic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * elastic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static elasticOut: Function;
        /**
         * @language en_US
         * get elastic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * get elastic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getElasticInOut(amplitude: any, period: any): Function;
        /**
         * @language en_US
         * elastic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * elastic in out。请查看示例
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
     * @see http://edn.egret.com/cn/docs/page/576 Tween ease animation
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
     */
    /**
     * @language zh_CN
     * Tween是Egret的动画缓动类
     * @see http://edn.egret.com/cn/docs/page/576 Tween缓动动画
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
         * Not recommended, you can use Tween.removeTweens(target) instead.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 激活一个对象，对其添加 Tween 动画
         * @param target {any} 要激活 Tween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false。
         * 不建议使用，可使用 Tween.removeTweens(target) 代替。
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
         * @example
         * <pre>
         *  egret.Tween.get(display).call(function (a:number, b:string) {
         *      console.log("a: " + a); // the first parameter passed 233
         *      console.log("b: " + b); // the second parameter passed “hello”
         *  }, this, [233, "hello"]);
         * </pre>
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
         * @example
         * <pre>
         *  egret.Tween.get(display).call(function (a:number, b:string) {
         *      console.log("a: " + a); //对应传入的第一个参数 233
         *      console.log("b: " + b); //对应传入的第二个参数 “hello”
         *  }, this, [233, "hello"]);
         * </pre>
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
declare module egret.tween {
    type EaseType = 'quadIn' | 'quadOut' | 'quadOut' | 'quadInOut' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'quartIn' | 'quartOut' | 'quartInOut' | 'quintIn' | 'quintOut' | 'quintInOut' | 'sineIn' | 'sineOut' | 'sineInOut' | 'backIn' | 'backOut' | 'backInOut' | 'circIn' | 'circOut' | 'circInOut' | 'bounceIn' | 'bounceOut' | 'bounceInOut' | 'elasticIn' | 'elasticOut' | 'elasticInOut';
    /**
     * @language en_US
     * Abstract class, Indicate the base action.
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 抽象类，表示一个基本动作
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    abstract class BasePath extends EventDispatcher {
        /**
         * @language en_US
         * the name of this action.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 动作的名称
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        name: string;
    }
    /**
     * @language en_US
     * Indicate the to action. See <code>Tween.to</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 表示一个to动作，参见<code>Tween.to</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    class To extends BasePath {
        /**
         * @language en_US
         * Property set of an object
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对象的属性集合
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        props: Object;
        /**
         * @language en_US
         * Duration
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 持续时间
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        duration: number;
        /**
         * @language en_US
         * Easing algorithm
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 缓动算法
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        ease: EaseType | Function;
    }
    /**
     * @language en_US
     * Indicate the wait action. See <code>Tween.wait</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 表示一个wait动作，参见<code>Tween.wait</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    class Wait extends BasePath {
        /**
         * @language en_US
         * Duration
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 持续时间
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        duration: number;
        /**
         * @language en_US
         * Whether properties are updated during the waiting time
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等待期间属性是否会更新
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        passive: boolean;
    }
    /**
     * @language en_US
     * Indicate the set action. See <code>Tween.set</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 表示一个set动作，参见<code>Tween.set</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    class Set extends BasePath {
        /**
         * @language en_US
         * Property set of an object
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对象的属性集合
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        props: Object;
    }
    /**
     * @language en_US
     * Indicate the tick action. See <code>Tween.tick</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 表示一个tick动作，参见<code>Tween.tick</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    class Tick extends BasePath {
        /**
         * @language en_US
         * Delta time
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 增加的时间
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        delta: number;
    }
    /**
     * @language en_US
     * TweenItem is a wrapper for Tween, which can set the behavior of Tween by setting attributes and adding Path.
     *
     * @event pathComplete Dispatched when some Path has complete.
     * @event complete Dispatched when all Paths has complete.
     *
     * @defaultProperty props
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * TweenItem是对Tween的包装器，能通过设置属性和添加Path的方式设置Tween的行为。
     * 通常用于使用在EXML中定义组件的动画。
     *
     * @event pathComplete 当某个Path执行完毕时会派发此事件。
     * @event complete 当所有Path执行完毕时会派发此事件。
     *
     * @defaultProperty props
     * @version Egret 3.1.8
     * @platform Web,Native
     */
    /**
     * Use in exml:
     * ```
     * 	<tween:TweenItem target="{this.button}">
     * 		<tween:props>
     * 			<e:Object loop="{true}"/>
     * 		</tween:props>
     * 		<tween:paths>
     * 			<e:Array>
     * 				<tween:To duration="500">
     * 					<tween:props>
     * 						<e:Object x="{100}" y="{200}" />
     * 					</tween:props>
     * 				</tween:To>
     * 				<tween:Wait duration="1000" />
     * 				<tween:To duration="1000">
     * 					<tween:props>
     * 						<e:Object x="{200}" y="{100}" />
     * 					</tween:props>
     * 				</tween:To>
     * 			</e:Array>
     * 		</tween:paths>
     * 	</tween:TweenItem>
     * ```
     */
    class TweenItem extends EventDispatcher {
        private tween;
        constructor();
        /**
         * @private
         */
        private _props;
        /**
         * @language en_US
         * The Tween's props.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * Tween的props参数。
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        props: any;
        /**
         * @private
         */
        private _target;
        /**
         * @language en_US
         * The Tween's target.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * Tween的target参数。
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        target: any;
        /**
         * @private
         */
        private _paths;
        /**
         * @language en_US
         * The Actions in Tween.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * TweenItem中添加的行为。
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        paths: BasePath[];
        /**
         * @language en_US
         * Play the Tween
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 播放Tween
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        play(): void;
        /**
         * @language en_US
         * Pause the Tween
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 暂停Tween
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        pause(): void;
        private createTween();
        private applyPaths();
        private applyPath(path);
        private pathComplete(path);
    }
    /**
     * @language en_US
     * TweenGroup is a collection of TweenItem that can be played in parallel with each Item
     *
     * @event itemComplete Dispatched when some TweenItem has complete.
     * @event complete Dispatched when all TweenItems has complete.
     *
     * @version Egret 3.1.8
     * @platform Web,Native
     * @includeExample extension/tween/TweenWrapper.ts
     */
    /**
     * @language zh_CN
     * TweenGroup是TweenItem的集合，可以并行播放每一个Item
     * @version Egret 3.1.8
     * @platform Web,Native
     * @includeExample extension/tween/TweenWrapper.ts
     */
    class TweenGroup extends EventDispatcher {
        private completeCount;
        constructor();
        /**
         * @private
         */
        private _items;
        /**
         * @language en_US
         * The Array that TweenItems in TweenGroup.
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * TweenGroup要控制的TweenItem集合。
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        items: TweenItem[];
        private registerEvent(add);
        /**
         * @language en_US
         * Play the all TweenItems
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 播放所有的TweenItem
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        play(): void;
        /**
         * @language en_US
         * Pause the all TweenItems
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 暂停播放所有的TweenItem
         * @version Egret 3.1.8
         * @platform Web,Native
         */
        pause(): void;
        private itemComplete(e);
    }
}
