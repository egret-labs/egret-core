declare namespace egret {
    /**
     * Easing function set. Different easing functions are used to make an animation proceed according to the corresponding equation
     * @see http://edn.egret.com/cn/index.php/article/index/id/53 Easing effect Demo
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 缓动函数集合，使用不同的缓动函数使得动画按照对应的方程进行
     * @see http://edn.egret.com/cn/index.php/article/index/id/53 缓动效果演示
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    class Ease {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         * get.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static get(amount: number): (t: number) => number;
        /**
         * get pow in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get pow in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static getPowIn(pow: number): (t: number) => number;
        /**
         * get pow out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get pow out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static getPowOut(pow: number): (t: number) => number;
        /**
         * get pow in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get pow in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static getPowInOut(pow: number): (t: number) => number;
        /**
         * quad in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quad in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static quadIn: (t: number) => number;
        /**
         * quad out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quad out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static quadOut: (t: number) => number;
        /**
         * quad in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quad in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static quadInOut: (t: number) => number;
        /**
         * cubic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * cubic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static cubicIn: (t: number) => number;
        /**
         * cubic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * cubic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static cubicOut: (t: number) => number;
        /**
         * cubic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * cubic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static cubicInOut: (t: number) => number;
        /**
         * quart in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quart in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static quartIn: (t: number) => number;
        /**
         * quart out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quart out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static quartOut: (t: number) => number;
        /**
         * quart in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quart in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static quartInOut: (t: number) => number;
        /**
         * quint in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quint in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static quintIn: (t: number) => number;
        /**
         * quint out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quint out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static quintOut: (t: number) => number;
        /**
         * quint in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * quint in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static quintInOut: (t: number) => number;
        /**
         * sine in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * sine in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static sineIn(t: number): number;
        /**
         * sine out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * sine out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static sineOut(t: number): number;
        /**
         * sine in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * sine in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static sineInOut(t: number): number;
        /**
         * get back in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get back in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static getBackIn(amount: number): (t: number) => number;
        /**
         * back in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * back in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static backIn: (t: number) => number;
        /**
         * get back out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get back out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static getBackOut(amount: number): (t: any) => number;
        /**
         * back out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * back out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static backOut: (t: any) => number;
        /**
         * get back in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get back in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static getBackInOut(amount: number): (t: number) => number;
        /**
         * back in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * back in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static backInOut: (t: number) => number;
        /**
         * circ in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * circ in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static circIn(t: number): number;
        /**
         * circ out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * circ out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static circOut(t: number): number;
        /**
         * circ in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * circ in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static circInOut(t: number): number;
        /**
         * bounce in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * bounce in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static bounceIn(t: number): number;
        /**
         * bounce out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * bounce out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static bounceOut(t: number): number;
        /**
         * bounce in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * bounce in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static bounceInOut(t: number): number;
        /**
         * get elastic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get elastic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static getElasticIn(amplitude: number, period: number): (t: number) => number;
        /**
         * elastic in.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * elastic in。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static elasticIn: (t: number) => number;
        /**
         * get elastic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get elastic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static getElasticOut(amplitude: number, period: number): (t: number) => number;
        /**
         * elastic out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * elastic out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static elasticOut: (t: number) => number;
        /**
         * get elastic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * get elastic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static getElasticInOut(amplitude: number, period: number): (t: number) => number;
        /**
         * elastic in out.See example.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * elastic in out。请查看示例
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static elasticInOut: (t: number) => number;
    }
}
declare namespace egret {
    /**
     * Tween is the animation easing class of Egret
     * @see http://edn.egret.com/cn/docs/page/576 Tween ease animation
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
     * @language en_US
     */
    /**
     * Tween是Egret的动画缓动类
     * @see http://edn.egret.com/cn/docs/page/576 Tween缓动动画
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/tween/Tween.ts
     * @language zh_CN
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
         * Activate an object and add a Tween animation to the object
         * @param target {any} The object to be activated
         * @param props {any} Parameters, support loop onChange onChangeObj
         * @param pluginData {any} Write realized
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * Not recommended, you can use Tween.removeTweens(target) instead.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 激活一个对象，对其添加 Tween 动画
         * @param target {any} 要激活 Tween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false。
         * 不建议使用，可使用 Tween.removeTweens(target) 代替。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static get(target: any, props?: {
            loop?: boolean;
            onChange?: Function;
            onChangeObj?: any;
        }, pluginData?: any, override?: boolean): Tween;
        /**
         * Delete all Tween animations from an object
         * @param target The object whose Tween to be deleted
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 删除一个对象上的全部 Tween 动画
         * @param target  需要移除 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static removeTweens(target: any): void;
        /**
         * Pause all Tween animations of a certain object
         * @param target The object whose Tween to be paused
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 暂停某个对象的所有 Tween
         * @param target 要暂停 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static pauseTweens(target: any): void;
        /**
         * Resume playing all easing of a certain object
         * @param target The object whose Tween to be resumed
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 继续播放某个对象的所有缓动
         * @param target 要继续播放 Tween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
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
         * Delete all Tween
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 删除所有 Tween
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
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
        setPosition(value: number, actionsMode?: number): boolean;
        /**
         * @private
         *
         * @param startPos
         * @param endPos
         * @param includeStart
         */
        private _runAction(action, startPos, endPos, includeStart?);
        /**
         * @private
         *
         * @param step
         * @param ratio
         */
        private _updateTargetProps(step, ratio);
        /**
         * Whether setting is paused
         * @param value {boolean} Whether to pause
         * @returns Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置是否暂停
         * @param value {boolean} 是否暂停
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
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
         * Wait the specified milliseconds before the execution of the next animation
         * @param duration {number} Waiting time, in milliseconds
         * @param passive {boolean} Whether properties are updated during the waiting time
         * @returns Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 等待指定毫秒后执行下一个动画
         * @param duration {number} 要等待的时间，以毫秒为单位
         * @param passive {boolean} 等待期间属性是否会更新
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        wait(duration: number, passive?: boolean): Tween;
        /**
         * Modify the property of the specified object to a specified value
         * @param props {Object} Property set of an object
         * @param duration {number} Duration
         * @param ease {egret.Ease} Easing algorithm
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将指定对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param duration {number} 持续时间
         * @param ease {egret.Ease} 缓动算法
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        to(props: any, duration?: number, ease?: Function): Tween;
        /**
         * Execute callback function
         * @param callback {Function} Callback method
         * @param thisObj {any} this action scope of the callback method
         * @param params {any[]} Parameter of the callback method
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
         * @language en_US
         */
        /**
         * 执行回调函数
         * @param callback {Function} 回调方法
         * @param thisObj {any} 回调方法this作用域
         * @param params {any[]} 回调方法参数
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
         * @language zh_CN
         */
        call(callback: Function, thisObj?: any, params?: any[]): Tween;
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
         * Execute
         * @param tween {egret.Tween} The Tween object to be operated. Default: this
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 执行
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        play(tween?: Tween): Tween;
        /**
         * Pause
         * @param tween {egret.Tween} The Tween object to be operated. Default: this
         * @returns {egret.Tween} Tween object itself
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 暂停
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        pause(tween?: Tween): Tween;
        /**
         * @method egret.Tween#tick
         * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        $tick(delta: number): void;
    }
}
declare namespace egret.tween {
    type EaseType = 'quadIn' | 'quadOut' | 'quadOut' | 'quadInOut' | 'cubicIn' | 'cubicOut' | 'cubicInOut' | 'quartIn' | 'quartOut' | 'quartInOut' | 'quintIn' | 'quintOut' | 'quintInOut' | 'sineIn' | 'sineOut' | 'sineInOut' | 'backIn' | 'backOut' | 'backInOut' | 'circIn' | 'circOut' | 'circInOut' | 'bounceIn' | 'bounceOut' | 'bounceInOut' | 'elasticIn' | 'elasticOut' | 'elasticInOut';
    /**
     * Abstract class, Indicate the base action.
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 抽象类，表示一个基本动作
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language zh_CN
     */
    abstract class BasePath extends EventDispatcher {
        /**
         * the name of this action.
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 动作的名称
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        name: string;
    }
    /**
     * Indicate the to action. See <code>Tween.to</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 表示一个to动作，参见<code>Tween.to</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language zh_CN
     */
    class To extends BasePath {
        /**
         * Property set of an object
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 对象的属性集合
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        props: Object;
        /**
         * Duration
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 持续时间
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        duration: number;
        /**
         * Easing algorithm
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 缓动算法
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        ease: EaseType | Function;
    }
    /**
     * Indicate the wait action. See <code>Tween.wait</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 表示一个wait动作，参见<code>Tween.wait</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language zh_CN
     */
    class Wait extends BasePath {
        /**
         * Duration
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 持续时间
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        duration: number;
        /**
         * Whether properties are updated during the waiting time
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 等待期间属性是否会更新
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        passive: boolean;
    }
    /**
     * Indicate the set action. See <code>Tween.set</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 表示一个set动作，参见<code>Tween.set</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language zh_CN
     */
    class Set extends BasePath {
        /**
         * Property set of an object
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 对象的属性集合
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        props: Object;
    }
    /**
     * Indicate the tick action. See <code>Tween.tick</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 表示一个tick动作，参见<code>Tween.tick</code>
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language zh_CN
     */
    class Tick extends BasePath {
        /**
         * Delta time
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 增加的时间
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        delta: number;
    }
    /**
     * TweenItem is a wrapper for Tween, which can set the behavior of Tween by setting attributes and adding Path.
     *
     * @event pathComplete Dispatched when some Path has complete.
     * @event complete Dispatched when all Paths has complete.
     *
     * @defaultProperty props
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language en_US
     */
    /**
     * TweenItem是对Tween的包装器，能通过设置属性和添加Path的方式设置Tween的行为。
     * 通常用于使用在EXML中定义组件的动画。
     *
     * @event pathComplete 当某个Path执行完毕时会派发此事件。
     * @event complete 当所有Path执行完毕时会派发此事件。
     *
     * @defaultProperty props
     * @version Egret 3.1.8
     * @platform Web,Native
     * @language zh_CN
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
         * The Tween's props.
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * Tween的props参数。
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        props: any;
        /**
         * @private
         */
        private _target;
        /**
         * The Tween's target.
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * Tween的target参数。
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        target: any;
        /**
         * @private
         */
        private _paths;
        /**
         * The Actions in Tween.
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * TweenItem中添加的行为。
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        paths: BasePath[];
        /**
         * Play the Tween
         * @time The starting position, the default is from the last position to play
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 播放Tween
         * @time 播放的起始位置, 默认为从上次位置继续播放
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        play(time?: number): void;
        /**
         * Pause the Tween
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 暂停Tween
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        pause(): void;
        /**
         * Stop the Tween
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 停止Tween
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        stop(): void;
        private createTween();
        private applyPaths();
        private applyPath(path);
        private pathComplete(path);
    }
    /**
     * TweenGroup is a collection of TweenItem that can be played in parallel with each Item
     *
     * @event itemComplete Dispatched when some TweenItem has complete.
     * @event complete Dispatched when all TweenItems has complete.
     *
     * @version Egret 3.1.8
     * @platform Web,Native
     * @includeExample extension/tween/TweenWrapper.ts
     * @language en_US
     */
    /**
     * TweenGroup是TweenItem的集合，可以并行播放每一个Item
     * @version Egret 3.1.8
     * @platform Web,Native
     * @includeExample extension/tween/TweenWrapper.ts
     * @language zh_CN
     */
    class TweenGroup extends EventDispatcher {
        private completeCount;
        constructor();
        /**
         * @private
         */
        private _items;
        /**
         * The Array that TweenItems in TweenGroup.
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * TweenGroup要控制的TweenItem集合。
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        items: TweenItem[];
        private registerEvent(add);
        /**
         * Play the all TweenItems
         * @time The starting position, the default is from the last position to play。If use 0, the group will play from the start position.
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 播放所有的TweenItem
         * @time 播放的起始位置, 默认为从上次位置继续播放。如果为0，则从起始位置开始播放。
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        play(time?: number): void;
        /**
         * Pause the all TweenItems
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 暂停播放所有的TweenItem
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        pause(): void;
        /**
         * Stop the all TweenItems
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 停止所有的TweenItem
         * @version Egret 3.1.8
         * @platform Web,Native
         * @language zh_CN
         */
        stop(): void;
        private itemComplete(e);
    }
}
