declare module egret {
    /**
     * @private
     */
    var egret_string_code: {};
}

declare var __extends: any;
declare module egret {
    /**
     * @language en_US
     * Call setter properties of the parent class, instead of the other writing languages, such as super.alpha = 1;
     * @param thisObj The current object. Always this
     * @param type Setter property names need to call
     * @param values Value passed to the parent class
     *
     * @exmaple egret.superSetter(this, "alpha", 1);
     */
    /**
     * @language zh_CN
     * 调用父类的setter属性，代替其他语言的写法，如 super.alpha = 1;
     * @param thisObj 当前对象。永远都this
     * @param type 需要调用的setter属性名称
     * @param values 传给父类的值
     *
     * @exmaple egret.superSetter(this, "alpha", 1);
     */
    function superSetter(thisObj: any, type: string, ...values: any[]): any;
    /**
     * @language en_US
     * Get getter property value of the parent class. Instead of writing in other languages, such as super.alpha;
     * @param thisObj 当前对象。永远都this
     * @param type 需要调用的setter属性名称
     * @returns {any} The value returned by the parent
     *
     * @exmaple egret.superGetter(this, "alpha");
     */
    /**
     * @language zh_CN
     * 获取父类的getter属性值。代替其他语言的写法，如 super.alpha;
     * @param thisObj 当前对象。永远都this
     * @param type 需要调用的setter属性名称
     * @returns {any} 父类返回的值
     *
     * @exmaple egret.superGetter(this, "alpha");
     */
    function superGetter(thisObj: any, type: string): any;
}

declare module egret {
    /**
     * @private
     */
    class Logger {
        static ALL: string;
        static DEBUG: string;
        static INFO: string;
        static WARN: string;
        static ERROR: string;
        static OFF: string;
        private static logFuncs;
        /**
         * @private
         * @param logType
         */
        static openLogByType(logType: string): void;
        /**
         * 表示出现了致命错误，开发者必须修复错误
         * @method egret.Logger.fatal
         * @param actionCode {string} 错误信息
         * @param value {Object} 错误描述信息
         */
        static fatal(actionCode: string, value?: Object): void;
        /**
         * 记录正常的Log信息
         * @method egret.Logger.info
         * @param actionCode {string} 错误信息
         * @param value {Object} 错误描述信息
         */
        static info(actionCode: string, value?: Object): void;
        /**
         * 记录可能会出现问题的Log信息
         * @method egret.Logger.warning
         * @param actionCode {string} 错误信息
         * @param value {Object} 错误描述信息
         */
        static warning(actionCode: string, value?: Object): void;
        /**
         * @private
         * @param type
         * @param actionCode
         * @param value
         */
        private static traceToConsole(type, actionCode, value);
        /**
         * @private
         * @param type
         * @param actionCode
         * @param value
         * @returns {string}
         */
        private static getTraceCode(type, actionCode, value);
    }
    /**
     * @private
     */
    function getString(id: number, ...args: any[]): string;
    /**
     * @private
     */
    function $error(code: number, ...args: any[]): void;
    /**
     * @private
     */
    function $warn(code: number, ...args: any[]): void;
}

declare module egret {
    /**
     * @classdesc
     * IHashObject是哈希对象接口。引擎内所有接口的基类,为对象实例提供唯一的hashCode值,提高对象比较的性能。
     * 注意：自定义对象请直接继承HashObject，而不是实现此接口。否则会导致hashCode不唯一。
     * @interface
     * @class egret.IHashObject
     */
    interface IHashObject {
        /**
         * @readOnly
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         * @member {number} egret.IHashObject#hashCode
         */
        hashCode: number;
    }
}

/**
 * @namespace egret
 */
declare module egret {
    /**
     * @class egret.HashObject
     * @classdesc 哈希对象。引擎内所有对象的基类，为对象实例提供唯一的hashCode值,提高对象比较的性能。
     * @implements egret.IHashObject
     */
    class HashObject implements IHashObject {
        /**
         * 创建一个 egret.HashObject 对象
         * @method egret.HashObject#constructor
         */
        constructor();
        /**
         * 哈希计数
         */
        private static hashCount;
        private _hashCode;
        /**
         * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
         * @member {number} egret.HashObject#hashCode
         */
        hashCode: number;
    }
}

declare module egret {
    /**
     * @class egret.Recycler
     * @classdesc
     * 对象缓存复用工具类，可用于构建对象池，一段时间后会自动回收对象。
     * @extends egret.HashObject
     * @includeExample egret/utils/Recycler.ts
     */
    class Recycler extends HashObject {
        /**
         * 创建一个 egret.Recycler 对象
         * @method egret.Recycler#constructor
         * @param autoDisposeTime {number} 多少帧后自动销毁对象，默认值300
         */
        constructor(autoDisposeTime?: number);
        static _callBackList: Array<any>;
        /**
         * 多少帧后自动销毁对象。
         */
        private autoDisposeTime;
        private frameCount;
        _checkFrame(): void;
        private objectPool;
        private _length;
        /**
         * 缓存的对象数量
         * @member {number} egret.Recycler#length
         */
        length: number;
        /**
         * 缓存一个对象以复用
         * @method egret.Recycler#push
         * @param object {any} 需要缓存的对象
         */
        push(object: any): void;
        /**
         * 获取一个缓存的对象
         * @method egret.Recycler#pop
         * @returns {any} 获得的缓存对象
         */
        pop(): any;
        /**
         * 立即清空所有缓存的对象。
         * @method egret.Recycler#dispose
         */
        dispose(): void;
    }
}

declare module egret {
    var __START_TIME: number;
    /**
     * 用于计算相对时间。此方法返回自启动 Egret 引擎以来经过的毫秒数。
     * @method egret.getTimer
     * @returns {number} 启动 Egret 引擎以来经过的毫秒数。
     * @includeExample egret/utils/getTimer.ts
     */
    function getTimer(): number;
}

declare module egret {
    var __callLaterFunctionList: Array<any>;
    var __callLaterThisList: Array<any>;
    var __callLaterArgsList: Array<any>;
    /**
     * 延迟函数到屏幕重绘前执行。
     * @method egret.callLater
     * @param method {Function} 要延迟执行的函数
     * @param thisObject {any} 回调函数的this引用
     * @param ...args {any} 函数参数列表
     * @includeExample egret/utils/callLater.ts
     */
    function callLater(method: Function, thisObject: any, ...args: any[]): void;
    var __callAsyncFunctionList: Array<any>;
    var __callAsyncThisList: Array<any>;
    var __callAsyncArgsList: Array<any>;
    /**
     * 异步调用函数
     * @param method {Function} 要异步调用的函数
     * @param thisObject {any} 函数的this引用
     * @param ...args {any} 函数参数列表
     * @includeExample egret/utils/callLater.ts
     */
    function __callAsync(method: Function, thisObject: any, ...args: any[]): void;
}

declare module egret {
    /**
     * @private
     */
    class RenderCommand {
        static __freeList: Array<RenderCommand>;
        callback: any;
        thisObject: any;
        call(renderContext: RendererContext): void;
        dispose(): void;
        static push(callback: Function, thisObject: any): void;
    }
}

declare module egret {
    /**
     * @private
     * OrientationMode 类为舞台初始旋转模式提供值。
     */
    class OrientationMode {
        /**
         * @private
         * 适配屏幕
         */
        static AUTO: string;
        /**
         * @private
         * 默认竖屏
         */
        static PORTRAIT: string;
        /**
         * @private
         * 默认横屏，舞台顺时针旋转90度
         */
        static LANDSCAPE: string;
        /**
         * @private
         * 默认横屏，舞台逆时针旋转90度
         */
        static LANDSCAPE_FLIPPED: string;
    }
}

declare module egret {
    /**
     * @private
     * 绘图上下文
     */
    interface RenderContext {
        lineWidth: number;
        strokeStyle: any;
        fillStyle: any;
        arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
        quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
        lineTo(x: number, y: number): void;
        fill(fillRule?: string): void;
        closePath(): void;
        rect(x: number, y: number, w: number, h: number): void;
        moveTo(x: number, y: number): void;
        fillRect(x: number, y: number, w: number, h: number): void;
        bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
        stroke(): void;
        strokeRect(x: number, y: number, w: number, h: number): void;
        beginPath(): void;
        arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
        translate(x: number, y: number): void;
        scale(x: number, y: number): void;
        rotate(angle: number): void;
        restore(): void;
        save(): void;
    }
}

declare module egret {
    /**
     * @classdesc
     * Event 类作为创建 Event 对象的基类，当发生事件时，Event 对象将作为参数传递给事件侦听器。
     * Event 类的属性包含有关事件的基本信息，例如事件的类型或者是否可以取消事件的默认行为。
     * 对于许多事件（如由 Event 类常量表示的事件），此基本信息就足够了。但其他事件可能需要更详细的信息。
     * 例如，与触摸关联的事件需要包括有关触摸事件的位置以及在触摸事件期间是否按下了任何键的其他信息。
     * 您可以通过扩展 Event 类（TouchEvent 类执行的操作）将此类其他信息传递给事件侦听器。
     * Egret API 为需要其他信息的常见事件定义多个 Event 子类。与每个 Event 子类关联的事件将在每个类的文档中加以介绍。
     * Event 类的方法可以在事件侦听器函数中使用以影响事件对象的行为。
     * 某些事件有关联的默认行为，通过调用 preventDefault() 方法，您的事件侦听器可以取消此行为。
     * 可以通过调用 stopPropagation() 或 stopImmediatePropagation() 方法，将当前事件侦听器作为处理事件的最后一个事件侦听器。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=114&terms1_id=25&terms2_id=29 Event类
     * @includeExample egret/events/Event.ts
     */
    class Event extends HashObject {
        /**
         * 创建一个作为参数传递给事件侦听器的 egret.Event 对象。
         * @param type {string} 事件的类型，可以作为 Event.type 访问。
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
         * 以下方法会触发此事件：DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
         * @constant {string} egret.Event.ADDED_TO_STAGE
         */
        static ADDED_TO_STAGE: string;
        /**
         * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。
         * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
         * @constant {string} egret.Event.REMOVED_FROM_STAGE
         */
        static REMOVED_FROM_STAGE: string;
        /**
         * 将显示对象添加到显示列表中时调度。以下方法会触发此事件：
         * DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
         * @constant {string} egret.Event.ADDED
         */
        static ADDED: string;
        /**
         * 将要从显示列表中删除显示对象时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。
         * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
         * @constant {string} egret.Event.REMOVED
         */
        static REMOVED: string;
        /**
         * 完成
         * @constant {string} egret.Event.COMPLETE
         */
        static COMPLETE: string;
        /**
         * 循环完成
         * @constant {string} egret.Event.LOOP_COMPLETE
         */
        static LOOP_COMPLETE: string;
        /**
         * 主循环：进入新的一帧
         * @constant {string} egret.Event.ENTER_FRAME
         */
        static ENTER_FRAME: string;
        /**
         * 主循环：开始渲染
         * @constant {string} egret.Event.RENDER
         */
        static RENDER: string;
        /**
         * 主循环：渲染完毕
         * @constant {string} egret.Event.FINISH_RENDER
         */
        static FINISH_RENDER: string;
        /**
         * 主循环：updateTransform完毕
         * @constant {string} egret.Event.FINISH_UPDATE_TRANSFORM
         */
        static FINISH_UPDATE_TRANSFORM: string;
        /**
         * 离开舞台。
         * @constant {string} egret.Event.LEAVE_STAGE
         */
        static LEAVE_STAGE: string;
        /**
         * 舞台尺寸发生改变
         * @constant {string} egret.Event.RESIZE
         */
        static RESIZE: string;
        /**
         * 状态改变
         * @constant {string} egret.Event.CHANGE
         */
        static CHANGE: string;
        /**
         * 游戏激活
         * @constant {string} egret.Event.ACTIVATE
         */
        static ACTIVATE: string;
        /**
         * 取消激活
         * @constant {string} egret.Event.DEACTIVATE
         */
        static DEACTIVATE: string;
        /**
         * Event.CLOSE 常量定义 close 事件对象的 type 属性的值。
         * @constant {string} egret.Event.CLOSE
         */
        static CLOSE: string;
        /**
         * Event.CONNECT 常量定义 connect 事件对象的 type 属性的值。
         * @constant {string} egret.Event.CONNECT
         */
        static CONNECT: string;
        /**
         * Event 事件的数据
         * @member {any} egret.Event.data
         */
        data: any;
        _type: string;
        /**
         * 事件的类型。类型区分大小写。
         * @member {string} egret.Event#type
         */
        type: string;
        _bubbles: boolean;
        /**
         * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
         * @member {boolean} egret.Event#bubbles
         */
        bubbles: boolean;
        private _cancelable;
        /**
         * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
         * @member {boolean} egret.Event#cancelable
         */
        cancelable: boolean;
        _eventPhase: number;
        /**
         * 事件流中的当前阶段。此属性可以包含以下数值：
         * 捕获阶段 (EventPhase.CAPTURING_PHASE)。
         * 目标阶段 (EventPhase.AT_TARGET)。
         * 冒泡阶段 (EventPhase.BUBBLING_PHASE)。
         * @member {boolean} egret.Event#eventPhase
         */
        eventPhase: number;
        _currentTarget: any;
        /**
         * 当前正在使用某个事件侦听器处理 Event 对象的对象。例如，如果用户单击“确定”按钮，
         * 则当前目标可以是包含该按钮的节点，也可以是它的已为该事件注册了事件侦听器的始祖之一。
         * @member {any} egret.Event#currentTarget
         */
        currentTarget: any;
        _target: any;
        /**
         * 事件目标。此属性包含目标节点。例如，如果用户单击“确定”按钮，则目标节点就是包含该按钮的显示列表节点。
         * @member {any} egret.Event#target
         */
        target: any;
        _isDefaultPrevented: boolean;
        /**
         * 检查是否已对事件调用 preventDefault() 方法。
         * @method egret.Event#isDefaultPrevented
         * @returns {boolean} 如果已调用 preventDefault() 方法，则返回 true；否则返回 false。
         */
        isDefaultPrevented(): boolean;
        /**
         * 如果可以取消事件的默认行为，则取消该行为。
         * 许多事件都有默认执行的关联行为。例如，如果用户在文本字段中键入一个字符，则默认行为就是在文本字段中显示该字符。
         * 由于可以取消 TextEvent.TEXT_INPUT 事件的默认行为，因此您可以使用 preventDefault() 方法来防止显示该字符。
         * 注意：当cancelable属性为false时，此方法不可用。
         * @method egret.Event#preventDefault
         */
        preventDefault(): void;
        _isPropagationStopped: boolean;
        /**
         * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 currentTarget 中的任何事件侦听器。
         * 相比之下，stopImmediatePropagation() 方法可以防止对当前节点中和后续节点中的事件侦听器进行处理。
         * 对此方法的其它调用没有任何效果。可以在事件流的任何阶段中调用此方法。
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @method egret.Event#stopPropagation
         */
        stopPropagation(): void;
        _isPropagationImmediateStopped: boolean;
        /**
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。此方法会立即生效，并且会影响当前节点中的事件侦听器。
         * 相比之下，在当前节点中的所有事件侦听器都完成处理之前，stopPropagation() 方法不会生效。
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @method egret.Event#stopImmediatePropagation
         */
        stopImmediatePropagation(): void;
        private isNew;
        _reset(): void;
        __recycle(): void;
        static _dispatchByTarget(EventClass: any, target: IEventDispatcher, type: string, props?: Object, bubbles?: boolean, cancelable?: boolean): boolean;
        static _getPropertyData(EventClass: any): any;
        /**
         * 使用指定的 EventDispatcher 对象来抛出 Event 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param data {any} 事件data
         * @method egret.Event.dispatchEvent
         */
        static dispatchEvent(target: IEventDispatcher, type: string, bubbles?: boolean, data?: any): void;
    }
}

declare module egret {
    /**
     * @class egret.HTTPStatusEvent
     * @classdesc
     * 在网络请求返回 HTTP 状态代码时，应用程序将调度 HTTPStatusEvent 对象。
     * 在错误或完成事件之前，将始终发送 HTTPStatusEvent 对象。HTTPStatusEvent 对象不一定表示错误条件；它仅反映网络堆栈提供的 HTTP 状态代码（如果有的话）。
     * @extends egret.Event
     */
    class HTTPStatusEvent extends Event {
        /**
         * HTTPStatusEvent.HTTP_STATUS 常量定义 httpStatus 事件对象的 type 属性值。
         * @constant {string} egret.HTTPStatusEvent.HTTP_STATUS
         */
        static HTTP_STATUS: string;
        /**
         * 创建一个 egret.HTTPStatusEvent 对象
         * @method egret.HTTPStatusEvent#constructor
         * @param type {string} 事件的类型，可以作为 Event.type 访问。
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        private _status;
        /**
         * 由服务器返回的 HTTP 状态代码。
         * @type {number}
         * @private
         */
        status: number;
        private static httpStatusEvent;
        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.IOErrorEvent.dispatchIOErrorEvent
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param status {number} 由服务器返回的 HTTP 状态代码
         */
        static dispatchHTTPStatusEvent(target: IEventDispatcher, status: number): void;
    }
}

declare module egret {
    /**
     * @class egret.SoundEvent
     * @classdesc
     * 声音相关事件。
     * 有事件：SoundEvent.SOUND_COMPLETE
     * @includeExample egret/events/SoundEvent.ts
     */
    class SoundEvent extends egret.Event {
        /**
         * 在声音完成播放后调度。
         * @constant {string} egret.SoundEvent.SOUND_COMPLETE
         */
        static SOUND_COMPLETE: string;
        /**
         * 创建一个 egret.SoundEvent 对象
         * @param type {string} 事件类型
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    }
}

declare module egret {
    /**
     * @class egret.FocusEvent
     * @classdesc
     * 用户将焦点从显示列表中的一个对象更改到另一个对象时，对象将调度 FocusEvent 对象。目前只支持输入文本。
     * 有四种类型的焦点事件：FocusEvent.FOCUS_IN FocusEvent.FOCUS_OUT
     */
    class FocusEvent extends egret.Event {
        /**
         * 获得焦点
         * @constant {string} egret.FocusEvent.FOCUS_IN
         */
        static FOCUS_IN: string;
        /**
         * 失去焦点
         * @constant {string} egret.FocusEvent.FOCUS_OUT
         */
        static FOCUS_OUT: string;
        /**
         * 创建一个 egret.FocusEvent 对象
         * @param type {string} 事件类型
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param bytesLoaded {number}
         * @param bytesTotal {number}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
    }
}

declare module egret {
    /**
     * @class egret.IOErrorEvent
     * @classdesc IO流事件，当错误导致输入或输出操作失败时调度 IOErrorEvent 对象。
     * @extends egret.Event
     * @includeExample egret/events/IOErrorEvent.ts
     */
    class IOErrorEvent extends Event {
        /**
         * 定义 ioError 事件对象的 type 属性值。
         * @constant {string} egret.IOErrorEvent.IO_ERROR
         */
        static IO_ERROR: string;
        /**
         * 创建一个 egret.IOErrorEvent 对象
         * @method egret.IOErrorEvent#constructor
         * @param type {string} 事件的类型，可以作为 Event.type 访问。
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.IOErrorEvent.dispatchIOErrorEvent
         * @param target {egret.IEventDispatcher} 派发事件目标
         */
        static dispatchIOErrorEvent(target: IEventDispatcher): void;
    }
}

declare module egret {
    /**
     * @class egret.TouchEvent
     * @classdesc
     * 使用 TouchEvent 类，您可以处理设备上那些检测用户与设备之间的接触的事件。
     * 当用户与带有触摸屏的移动电话或平板电脑等设备交互时，用户通常使用手指或指针设备接触屏幕。可使用 TouchEvent 类开发响应基本触摸事件（如单个手指点击）的应用程序。
     * 使用此类中定义的事件类型创建事件侦听器。
     * 注意：当对象嵌套在显示列表中时，触摸事件的目标将是显示列表中可见的最深的可能嵌套对象。此对象称为目标节点。要使目标节点的祖代（祖代是一个包含显示列表中所有目标节点的对象，从舞台到目标节点的父节点均包括在内）接收触摸事件的通知，请对祖代节点使用 EventDispatcher.addEventListener() 并将 type 参数设置为要检测的特定触摸事件。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=117&terms1_id=25&terms2_id=29 触摸事件
     * @includeExample egret/events/TouchEvent.ts
     */
    class TouchEvent extends Event {
        /**
         * 创建一个 egret.TouchEvent 对象，其中包含有关Touch事件的信息。
         * @constructor egret.TouchEvent
         * @param type {string} 事件的类型，可以作为 Event.type 访问。
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
         * @param touchPointID {number} 分配给触摸点的唯一标识号
         * @param stageX {number} 事件发生点在全局舞台坐标中的水平坐标
         * @param stageY {number} 事件发生点在全局舞台坐标中的垂直坐标
         * @param ctrlKey {boolean} 事件发生时ctrl键是否被按下
         * @param altKey {boolean} 事件发生时shift键是否被按下
         * @param shiftKey {boolean} 事件发生时shift键是否被按下
         * @param touchDown {boolean} 表示触摸是否已按下
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, touchPointID?: number, stageX?: number, stageY?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, touchDown?: boolean);
        /**
         * 轻触
         * @constant {string} egret.TouchEvent.TOUCH_TAP
         */
        static TOUCH_TAP: string;
        /**
         * 移动
         * @constant {string} egret.TouchEvent.TOUCH_MOVE
         */
        static TOUCH_MOVE: string;
        /**
         * 开始触摸
         * @constant {string} egret.TouchEvent.TOUCH_BEGIN
         */
        static TOUCH_BEGIN: string;
        /**
         * 在同一对象上结束触摸
         * @constant {string} egret.TouchEvent.TOUCH_END
         */
        static TOUCH_END: string;
        /**
         * 在对象外部结束触摸
         * @constant {string} egret.TouchEvent.TOUCH_RELEASE_OUTSIDE
         */
        static TOUCH_RELEASE_OUTSIDE: string;
        /**
         * 此功能已被废弃
         * @deprecated
         */
        static TOUCH_ROLL_OUT: string;
        /**
         * 此功能已被废弃
         * @deprecated
         */
        static TOUCH_ROLL_OVER: string;
        /**
         * 此功能已被废弃
         * @deprecated
         */
        static TOUCH_OUT: string;
        /**
         * 此功能已被废弃
         * @deprecated
         */
        static TOUCH_OVER: string;
        _stageX: number;
        /**
         * 事件发生点在全局舞台坐标中的水平坐标。
         * @member {number} egret.TouchEvent#stageX
         */
        stageX: number;
        _stageY: number;
        /**
         * 事件发生点在全局舞台坐标中的垂直坐标。
         * @member {number} egret.TouchEvent#stageY
         */
        stageY: number;
        /**
         * 事件发生点相对于currentTarget的水平坐标。
         * @member {number} egret.TouchEvent#localX
         */
        localX: number;
        /**
         * 事件发生点相对于currentTarget的垂直坐标。
         * @member {number} egret.TouchEvent#localY
         */
        localY: number;
        /**
         * 分配给触摸点的唯一标识号
         * @member {number} egret.TouchEvent#touchPointID
         */
        touchPointID: number;
        /**
         * 事件发生时ctrl键是否被按下。 (Mac OS下为 Cmd 或 Ctrl)
         * @deprecated
         * @member {boolean} egret.TouchEvent#ctrlKey
         */
        ctrlKey: boolean;
        /**
         * 事件发生时shift键是否被按下。
         * @deprecated
         * @member {boolean} egret.TouchEvent#shiftKey
         */
        shiftKey: boolean;
        /**
         * 事件发生时alt键是否被按下。
         * @deprecated
         * @member {boolean} egret.TouchEvent#altKey
         */
        altKey: boolean;
        /**
         * 表示触摸已按下 (true) 还是未按下 (false)。
         * @member {boolean} egret.TouchEvent#touchDown
         */
        touchDown: boolean;
        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.TouchEvent.dispatchTouchEvent
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param touchPointID {number} 分配给触摸点的唯一标识号
         * @param stageX {number} 事件发生点在全局舞台坐标中的水平坐标
         * @param stageY {number} 事件发生点在全局舞台坐标中的垂直坐标
         * @param ctrlKey {boolean} 事件发生时ctrl键是否被按下
         * @param altKey {boolean} 事件发生时shift键是否被按下
         * @param shiftKey {boolean} 事件发生时shift键是否被按下
         * @param touchDown {boolean} 表示触摸是否已按下
         */
        static dispatchTouchEvent(target: IEventDispatcher, type: string, touchPointID?: number, stageX?: number, stageY?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, touchDown?: boolean): void;
    }
}

/** @namespace egret */
declare module egret {
    /**
     * @class egret.TimerEvent
     * @classdesc
     * 每当 Timer 对象达到由 Timer.delay 属性指定的间隔时，Timer 对象即会调度 TimerEvent 对象。
     * @extends egret.Event
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=154&terms1_id=25&terms2_id=35 Timer计时器
     * @includeExample egret/events/TimerEvent.ts
     */
    class TimerEvent extends Event {
        /**
         * 创建一个 egret.TimerEvent 对象
         * @method egret.TimerEvent#constructor
         * @param type {string} 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
         * @param bubbles {boolean} 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * 每当 Timer 对象达到根据 Timer.delay 属性指定的间隔时调度。
         * @constant {string} egret.TimerEvent.TIMER
         */
        static TIMER: string;
        /**
         * 每当它完成 Timer.repeatCount 设置的请求数后调度。
         * @constant {string} egret.TimerEvent.TIMER_COMPLETE
         */
        static TIMER_COMPLETE: string;
        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.TimerEvent.dispatchTimerEvent
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         */
        static dispatchTimerEvent(target: IEventDispatcher, type: string): void;
    }
}

declare module egret {
    /**
     * 用户在富文本中单击超链接时，对象将调度 TextEvent 对象。文本事件类型：TextEvent.LINK。
     * @includeExample egret/events/TextEvent.ts
     */
    class TextEvent extends Event {
        /**
         * 创建一个 TextEvent 对象，其中包含有关文本事件的信息。
         * @param type 事件的类型，可以作为 TextEvent.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param text 用户输入的一个或多个文本字符。事件侦听器可以通过 text 属性访问此信息。
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string);
        /**
         * 定义 link 事件对象的 type 属性值。
         */
        static LINK: string;
        /**
         * 在 textInput 事件中，由用户输入的字符或字符序列。
         */
        text: string;
        /**
         * 使用指定的EventDispatcher对象来抛出TextEvent事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type  事件类型
         * @param text  TextEvent对象的text赋值
         */
        static dispatchTextEvent(target: IEventDispatcher, type: string, text: string): void;
    }
}

declare module egret {
    /**
     * @class egret.ProgressEvent
     * @classdesc
     * 当加载操作已开始或套接字已接收到数据时，将调度 ProgressEvent 对象。
     * 有两种类型的进程事件：ProgressEvent.PROGRESS 和 ProgressEvent.SOCKET_DATA。
     */
    class ProgressEvent extends egret.Event {
        /**
         * 定义 progress 事件对象的 type 属性值。
         * @constant {string} egret.ProgressEvent.PROGRESS
         */
        static PROGRESS: string;
        /**
         * 定义 socketData 事件对象的 type 属性值。
         * @constant {string} egret.ProgressEvent.SOCKET_DATA
         */
        static SOCKET_DATA: string;
        /**
         * 在侦听器处理事件时加载的项数或字节数。
         * @member {number} egret.ProgressEvent#bytesLoaded
         */
        bytesLoaded: number;
        /**
         * 如果加载过程成功，将加载的总项数或总字节数。
         * @member {number} egret.ProgressEvent#bytesTotal
         */
        bytesTotal: number;
        /**
         * 创建一个 egret.ProgressEvent 对象
         * @method egret.ProgressEvent#constructor
         * @param type {string} 事件类型
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param bytesLoaded {number}
         * @param bytesTotal {number}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, bytesLoaded?: number, bytesTotal?: number);
        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.ProgressEvent.dispatchIOErrorEvent
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param bytesLoaded {number} 加载的项数或字节数
         * @param bytesTotal {number} 加载的总项数或总字节数
         */
        static dispatchProgressEvent(target: IEventDispatcher, type: string, bytesLoaded?: number, bytesTotal?: number): void;
    }
}

declare module egret {
    /**
     * @class egret.EventPhase
     * @classdesc
     * EventPhase 类可为 Event 类的 eventPhase 属性提供值。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=113&terms1_id=25&terms2_id=29 事件的执行流程
     * @includeExample egret/events/EventPhase.ts
     */
    class EventPhase {
        /**
         * 捕获阶段，是事件流的第一个阶段。
         * @constant {number} egret.EventPhase.CAPTURING_PHASE
         */
        static CAPTURING_PHASE: number;
        /**
         * 目标阶段，是事件流的第二个阶段。
         * @constant {number} egret.EventPhase.AT_TARGET
         */
        static AT_TARGET: number;
        /**
         * 冒泡阶段，是事件流的第三个阶段。
         * @constant {number} egret.EventPhase.BUBBLING_PHASE
         */
        static BUBBLING_PHASE: number;
    }
}

declare module egret {
    /**
     *
     * @class egret.IEventDispatcher
     * @interface
     * @classdesc IEventDispatcher 接口定义用于添加或删除事件侦听器的方法，检查是否已注册特定类型的事件侦听器，并调度事件。
     * 事件目标是 Egret 事件模型的重要组成部分。事件目标是事件如何通过显示列表层次结构这一问题的焦点。当发生鼠标单击或按键等事件时，会将事件对象调度到从显示列表根开始的事件流中。事件对象进行到事件目标的往返行程，在概念上，此往返行程被划分为三个阶段：捕获阶段包括从根到事件目标节点之前的最后一个节点的行程，目标阶段仅包括事件目标节点，冒泡阶段包括到显示列表的根的回程上遇到的任何后续节点。
     * 通常，使用户定义的类能够调度事件的最简单方法是扩展 EventDispatcher。如果无法扩展（即，如果该类已经扩展了另一个类），则可以实现 IEventDispatcher 接口，创建 EventDispatcher 成员，并编写一些简单的挂钩，将调用连接到聚合的 EventDispatcher 中。
     * @includeExample egret/events/IEventDispatcher.ts
     */
    interface IEventDispatcher extends IHashObject {
        /**
         * 添加事件侦听器
         * @param type 事件的类型。
         * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
         * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
         * @param thisObject 侦听函数绑定的this对象
         * @param useCapture 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，
         * 则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。
         * 要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
         * @param  priority 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
         * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
         * @stable A
         */
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * 移除事件侦听器
         * @param type 事件名
         * @param listener 侦听函数
         * @param thisObject 侦听函数绑定的this对象
         * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
         * @stable A
         */
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**
         * 检测是否存在监听器
         * @param type 事件名
         * @returns {*}
         * @stable A
         */
        hasEventListener(type: string): boolean;
        /**
         * 派发事件
         * @param type 事件名
         * @param arg 数据对象
         * @returns {*}
         */
        dispatchEvent(event: Event): boolean;
        /**
         * 检查是否用此 EventDispatcher 对象或其任何始祖为指定事件类型注册了事件侦听器。将指定类型的事件调度给此
         * EventDispatcher 对象或其任一后代时，如果在事件流的任何阶段触发了事件侦听器，则此方法返回 true。
         * hasEventListener() 与 willTrigger() 方法的区别是：hasEventListener() 只检查它所属的对象，
         * 而 willTrigger() 方法检查整个事件流以查找由 type 参数指定的事件。
         * @param type 事件名
         */
        willTrigger(type: string): boolean;
    }
}

declare module egret {
    /**
     *
     * @class egret.EventDispatcher
     * @classdesc
     * EventDispatcher 是 Egret 的事件派发器类，负责进行事件的发送和侦听。
     *
     * 事件目标是事件如何通过显示列表层次结构这一问题的焦点。当发生鼠标单击、触摸或按键等事件时，
     * 引擎会将事件对象调度到从显示列表根开始的事件流中。然后该事件对象在显示列表中前进，直到到达事件目标，
     * 然后从这一点开始其在显示列表中的回程。在概念上，到事件目标的此往返行程被划分为三个阶段：
     * 捕获阶段包括从根到事件目标节点之前的最后一个节点的行程，目标阶段仅包括事件目标节点，冒泡阶段包括回程上遇到的任何后续节点到显示列表的根。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=115&terms1_id=25&terms2_id=29 事件侦听器
     * @includeExample egret/events/EventDispatcher.ts
     */
    class EventDispatcher extends HashObject implements IEventDispatcher {
        /**
         * 创建一个 egret.EventDispatcher 对象
         * EventDispatcher 类是可调度事件的所有类的基类。
         * EventDispatcher 类实现 IEventDispatcher 接口 ，并且是 DisplayObject 类的基类。
         * EventDispatcher 类允许显示列表上的任何对象都是一个事件目标，同样允许使用 IEventDispatcher 接口的方法。
         */
        constructor(target?: IEventDispatcher);
        /**
         * 事件抛出对象
         */
        private _eventTarget;
        /**
         * 引擎内部调用
         * @private
         */
        _eventsMap: Object;
        /**
         * 引擎内部调用
         * @private
         */
        _captureEventsMap: Object;
        /**
         * 添加事件侦听器
         * @method egret.EventDispatcher#addEventListener
         * @param type {string} 事件的类型。
         * @param listener {Function} 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
         * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
         * @param thisObject {any} 侦听函数绑定的this对象
         * @param useCapture {boolean} 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，
         * 则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。
         * 要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
         * @param  priority {number} 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
         * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
         */
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * 在一个事件列表中按优先级插入事件对象
         */
        _insertEventBin(list: Array<any>, listener: Function, thisObject: any, priority: number, display?: any): boolean;
        /**
         * 移除事件侦听器
         * @method egret.EventDispatcher#removeEventListener
         * @param type {string} 事件名
         * @param listener {Function} 侦听函数
         * @param thisObject {any} 侦听函数绑定的this对象
         * @param useCapture {boolean} 是否使用捕获，这个属性只在显示列表中生效。
         */
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**
         * 在一个事件列表中按优先级插入事件对象
         */
        _removeEventBin(list: Array<any>, listener: Function, thisObject: any, display?: any, fromIdx?: number): boolean;
        /**
         * 检测是否存在监听器
         * @method egret.EventDispatcher#hasEventListener
         * @param type {string} 事件类型
         * @returns {boolean}
         * @stable A
         */
        hasEventListener(type: string): boolean;
        /**
         * 检查是否用此 EventDispatcher 对象或其任何始祖为指定事件类型注册了事件侦听器。将指定类型的事件调度给此
         * EventDispatcher 对象或其任一后代时，如果在事件流的任何阶段触发了事件侦听器，则此方法返回 true。
         * hasEventListener() 与 willTrigger() 方法的区别是：hasEventListener() 只检查它所属的对象，
         * 而 willTrigger() 方法检查整个事件流以查找由 type 参数指定的事件。
         * @method egret.EventDispatcher#willTrigger
         * @param type {string} 事件类型
         * @returns {boolean} 是否注册过监听器，如果注册过返回true，反之返回false
         */
        willTrigger(type: string): boolean;
        /**
         * 将事件分派到事件流中。事件目标是对其调用 dispatchEvent() 方法的 EventDispatcher 对象。
         * @method egret.EventDispatcher#dispatchEvent
         * @param event {egret.Event} 调度到事件流中的 Event 对象。如果正在重新分派事件，则会自动创建此事件的一个克隆。 在调度了事件后，其 _eventTarget 属性将无法更改，因此您必须创建此事件的一个新副本以能够重新调度。
         * @returns {boolean} 如果成功调度了事件，则值为 true。值 false 表示失败或对事件调用了 preventDefault()。
         */
        dispatchEvent(event: Event): boolean;
        _notifyListener(event: Event): boolean;
        /**
         * 派发一个包含了特定参数的事件到所有注册了特定类型侦听器的对象中。 这个方法使用了一个内部的事件对象池因避免重复的分配导致的额外开销。
         * @method egret.EventDispatcher#dispatchEventWith
         * @param type {string} 事件类型
         * @param bubbles {boolean} 是否冒泡，默认false
         * @param data {any}附加数据(可选)
         */
        dispatchEventWith(type: string, bubbles?: boolean, data?: Object): void;
    }
}

declare module egret {
    /**
     * @class egret.MovieClipEvent
     * @classdesc
     * 使用 MovieClipEvent 类，可以获取帧标签触发的事件
     */
    class MovieClipEvent extends Event {
        /**
         * 创建一个 egret.MovieClipEvent 对象
         * @method egret.MovieClipEvent#constructor
         * @param type {string} 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
         * @param bubbles {boolean} 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, frameLabel?: string);
        /**
         * 当前的帧标签
         * @type {string}
         */
        frameLabel: string;
        /**
         * 动画的某一帧上有标签时会触发事件
         * @type {string}
         */
        static FRAME_LABEL: string;
        /**
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
           * @method egret.TimerEvent.dispatchMovieClipEvent
           * @param target {egret.IEventDispatcher} 派发事件目标
           * @param type {string} 事件类型
           * @param type {string} 具体的自定义帧事件
         */
        static dispatchMovieClipEvent(target: IEventDispatcher, type: string, frameLabel?: string): void;
    }
}

declare module egret {
    /**
     * @class egret.MainContext
     * @classdesc
     * MainContext是游戏的核心跨平台接口，组合了多个功能Context，并是游戏启动的主入口
     * @extends egret.EventDispatcher
     * @private
     */
    class MainContext extends EventDispatcher {
        constructor();
        /**
         * 渲染Context
         * @member egret.MainContext#rendererContext
         */
        rendererContext: RendererContext;
        /**
         * 触摸Context
         * @member egret.MainContext#touchContext
         */
        touchContext: TouchContext;
        /**
         * 网络Context
         * @member egret.MainContext#netContext
         */
        netContext: NetContext;
        /**
         * 设备divice
         * @member egret.MainContext#deviceContext
         */
        deviceContext: DeviceContext;
        /**
         * 舞台
         * @member egret.MainContext#stage
         */
        stage: Stage;
        static deviceType: string;
        static DEVICE_PC: string;
        static DEVICE_MOBILE: string;
        static runtimeType: string;
        static RUNTIME_HTML5: string;
        static RUNTIME_NATIVE: string;
        private _profileInstance;
        /**
         * 游戏启动，开启主循环，参考Flash的滑动跑道模型
         * @method egret.MainContext#run
         */
        run(): void;
        static __DRAW_COMMAND_LIST: Array<RenderCommand>;
        static __use_new_draw: boolean;
        /**
         * renderLoop阶段，引擎内部使用，暂未实现完全
         */
        static _renderLoopPhase: string;
        /**
         * 滑动跑道模型，渲染部分
         */
        private renderLoop(frameTime);
        private _draw(context);
        private reuseEvent;
        /**
         * 广播EnterFrame事件。
         */
        private broadcastEnterFrame(frameTime);
        /**
         * 广播Render事件。
         */
        private broadcastRender();
        /**
         * 执行callLater回调函数列表
         */
        private doCallLaterList(funcList, thisList, argsList);
        /**
         * 执行callAsync回调函数列表
         */
        private doCallAsyncList();
        /**
         * @member egret.MainContext.instance
         */
        static instance: egret.MainContext;
        private static cachedEvent;
    }
}
declare var testDeviceType: () => boolean;
declare var testRuntimeType: () => boolean;

declare module egret {
    /**
     * @class egret.Profiler
     * @classdesc
     * Profiler是egret的性能检测分析类
     * 请使用 egret.Profiler.getInstance().run();打开性能分析显示。
     * @includeExample egret/utils/Profiler.ts
     */
    class Profiler {
        private static instance;
        /**
         * 返回系统中唯一的Profiler实例。
         * @returns {Profiler}
         */
        static getInstance(): Profiler;
        private _lastTime;
        private _logicPerformanceCost;
        private _renderPerformanceCost;
        private _updateTransformPerformanceCost;
        private _preDrawCount;
        private _calculatePreDrawCount;
        private _txt;
        private _tick;
        private _maxDeltaTime;
        private _totalDeltaTime;
        _isRunning: boolean;
        /**
         * 停止Profiler
         * @method egret.Profiler#stop
         */
        stop(): void;
        /**
         * 启动Profiler
         * @method egret.Profiler#run
         */
        run(): void;
        _drawProfiler(context: RendererContext): void;
        _setTxtFontSize(fontSize: number): void;
        /**
         * @private
         */
        private onEnterFrame(event);
        /**
         * @private
         */
        private onStartRender(event);
        private onFinishUpdateTransform(event);
        /**
         * @private
         */
        private onFinishRender(event);
        /**
         * @private
         */
        private update(frameTime);
        /**
         * @method egret.Profiler#onDrawImage
         * @private
         */
        onDrawImage(): void;
    }
}

declare module egret {
    /**
     * Ticker是egret引擎的心跳控制器，是游戏唯一的时间处理入口。
     * @includeExample egret/context/Ticker.ts
     */
    class Ticker extends EventDispatcher {
        /**
         * 创建一个Ticker对象，不可以创建
         */
        constructor();
        private _timeScale;
        private _paused;
        /**
         * 启动心跳控制器。
         * 这个函数应只在游戏初始化时调用一次
         * @method egret.Ticker#run
         * @stable A
         */
        run(): void;
        private _callIndex;
        private _callList;
        private update(advancedTime);
        private callBackList;
        /**
         * 注册帧回调事件，同一函数的重复监听会被忽略。
         * @method egret.Ticker#register
         * @param listener {Function} 帧回调函数,参数返回上一帧和这帧的间隔时间。示例：onEnterFrame(frameTime:number):void
         * @param thisObject {any} 帧回调函数的this对象
         * @param priority {number} 事件优先级，开发者请勿传递 Number.NEGATIVE_INFINITY 和 Number.POSITIVE_INFINITY
         * @stable A-
         */
        register(listener: Function, thisObject: any, priority?: number): void;
        /**
         * 取消侦听enterFrame事件
         * @method egret.Ticker#unregister
         * @param listener {Function} 事件侦听函数
         * @param thisObject {any} 侦听函数的this对象
         * @stable A-
         */
        unregister(listener: Function, thisObject: any): void;
        /**
         * 在指定的延迟（以毫秒为单位）后运行指定的函数。
         * @method egret.Ticker#setTimeout
         * @param listener {Function}
         * @param thisObject {any}
         * @param delay {number}
         * @param ...parameter {any}
         * @deprecated
         */
        setTimeout(listener: Function, thisObject: any, delay: number, ...parameters: any[]): void;
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
         * @method egret.Ticker#pause
         */
        pause(): void;
        /**
         * 继续
         * @method egret.Ticker#resume
         */
        resume(): void;
        private static instance;
        /**
         * 获取Ticker当前单例
         * @method egret.Ticker.getInstance
         * @returns {Ticker}
         */
        static getInstance(): egret.Ticker;
    }
}

declare module egret {
    /**
     * @class egret.HorizontalAlign
     * @classdesc 水平对齐方式
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=144&terms1_id=25&terms2_id=33 文本布局
     */
    class HorizontalAlign {
        /**
         * 左对齐
         * @constant egret.HorizontalAlign.LEFT
         */
        static LEFT: string;
        /**
         * 右对齐
         * @constant egret.HorizontalAlign.RIGHT
         */
        static RIGHT: string;
        /**
         * 水平居中对齐
         * @constant egret.HorizontalAlign.CENTER
         */
        static CENTER: string;
        /**
         * 水平两端对齐
         * 注意：TextFiled不支持此对齐方式。
         * @constant egret.HorizontalAlign.JUSTIFY
         */
        static JUSTIFY: string;
        /**
         * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容宽度"。
         * 容器的"内容宽度"是最大子项的大小,如果所有子项都小于容器的宽度，则会将所有子项的大小调整为容器的宽度。
         * 注意：TextFiled不支持此对齐方式。
         * @constant egret.HorizontalAlign.CONTENT_JUSTIFY
         */
        static CONTENT_JUSTIFY: string;
    }
}

declare module egret {
    /**
     * @class egret.VerticalAlign
     * @classdesc 垂直对齐方式
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=144&terms1_id=25&terms2_id=33 文本布局
     */
    class VerticalAlign {
        /**
         * 顶对齐
         * @constant egret.VerticalAlign.TOP
         */
        static TOP: string;
        /**
         * 底对齐
         * @constant egret.VerticalAlign.BOTTOM
         */
        static BOTTOM: string;
        /**
         * 垂直居中对齐
         * @constant egret.VerticalAlign.MIDDLE
         */
        static MIDDLE: string;
        /**
         * 垂直两端对齐
         * 注意：TextFiled不支持此对齐方式。
         * @constant egret.VerticalAlign.JUSTIFY
         */
        static JUSTIFY: string;
        /**
         * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容高度"。
         * 容器的"内容高度"是最大子项的大小,如果所有子项都小于容器的高度，则会将所有子项的大小调整为容器的高度。
         * 注意：TextFiled不支持此对齐方式。
         * @constant egret.VerticalAlign.CONTENT_JUSTIFY
         */
        static CONTENT_JUSTIFY: string;
    }
}

declare module egret {
    /**
     * @class egret.Timer
     * @classdesc
     * Timer 类是计时器的接口，它使您能按指定的时间序列运行代码。
     * 使用 start() 方法来启动计时器。为 timer 事件添加事件侦听器，以便将代码设置为按计时器间隔运行。
     * 可以创建 Timer 对象以运行一次或按指定间隔重复运行，从而按计划执行代码。
     * 根据 Egret 的帧速率或运行时环境（可用内存和其他因素），运行时调度事件的间隔可能稍有不同。
     * @extends egret.EventDispatcher
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=posts&id=114 Timer计时器
     *
     * @event egret.TimerEvent.TIMER 每当 Timer 对象达到根据 Timer.delay 属性指定的间隔时调度。
     * @event egret.TimerEvent.TIMER_COMPLETE 每当它完成 Timer.repeatCount 设置的请求数后调度。
     *
     * @includeExample egret/utils/Timer.ts
     */
    class Timer extends EventDispatcher {
        /**
         * 创建一个 egret.Timer 对象
         * @param delay {number} 计时器事件间的延迟（以毫秒为单位）。
         * @param repeatCount {number} 设置的计时器运行总次数。
         */
        constructor(delay: number, repeatCount?: number);
        /**
         * 计时器事件间的延迟（以毫秒为单位）。如果在计时器正在运行时设置延迟间隔，则计时器将按相同的 repeatCount 迭代重新启动。
         * 注意：建议 delay 不要低于 20 毫秒。计时器频率不得超过 60 帧/秒，这意味着低于 16.6 毫秒的延迟可导致出现运行时问题。
         * @member {number} egret.Timer#delay
         */
        delay: number;
        /**
         * 设置的计时器运行总次数。如果重复计数设置为 0，则计时器将持续不断运行，或直至调用了 stop() 方法或节目停止。
         * 如果重复计数不为 0，则将运行计时器，运行次数为指定的次数。如果设置的 repeatCount 总数等于或小于 currentCount，则计时器将停止并且不会再次触发。
         * @member {number} egret.Timer#repeatCount
         */
        repeatCount: number;
        private _currentCount;
        /**
         * 计时器从 0 开始后触发的总次数。如果已重置了计时器，则只会计入重置后的触发次数。
         * @method egret.Timer#currentCount
         */
        currentCount: number;
        private _running;
        /**
         * 计时器的当前状态；如果计时器正在运行，则为 true，否则为 false。
         * @member {boolean} egret.Timer#running
         */
        running: boolean;
        /**
         * 如果计时器正在运行，则停止计时器，并将 currentCount 属性设回为 0，这类似于秒表的重置按钮。然后，在调用 start() 后，将运行计时器实例，运行次数为指定的重复次数（由 repeatCount 值设置）。
         * @method egret.Timer#reset
         */
        reset(): void;
        /**
         * 如果计时器尚未运行，则启动计时器。
         * @method egret.Timer#start
         */
        start(): void;
        /**
         * 停止计时器。如果在调用 stop() 后调用 start()，则将继续运行计时器实例，运行次数为剩余的 重复次数（由 repeatCount 属性设置）。
         * @method egret.Timer#stop
         */
        stop(): void;
        private lastTime;
        private onEnterFrame(frameTime);
    }
}

declare module egret {
    /**
     * 返回一个对象的完全限定名<br/>
     * @method egret.getQualifiedClassName
     * @param value {any} 需要完全限定类名称的对象，可以将任何 TypeScript / JavaScript值传递给此方法，包括所有可用的TypeScript / JavaScript类型、对象实例、原始类型（如number）和类对象
     * @returns {string}
     * @example
     * <pre>
     *  egret.getQualifiedClassName(egret.DisplayObject) //返回 "egret.DisplayObject"
     * </pre>
     * @includeExample egret/utils/getQualifiedClassName.ts
     */
    function getQualifiedClassName(value: any): string;
    /**
    * 返回一个对象的父类完全限定名<br/>
    * @method egret.getQualifiedSuperclassName
    * @param value {any} 需要取得父类的对象，可以将任何 TypeScript / JavaScript值传递给此方法，包括所有可用的TypeScript / JavaScript类型、对象实例、原始类型（如number）和类对象
    * @returns {Function}
    * @example
    * <pre>
    *  egret.getQualifiedSuperclassName(egret.DisplayObjectContainer) //返回 "egret.DisplayObject"
    * </pre>
    */
    function getQualifiedSuperclassName(value: any): string;
}

declare module egret {
    /**
     * 返回 name 参数指定的类的类对象引用。
     * @method egret.getDefinitionByName
     * @param name {string} 类的名称。
     * @returns {any}
     * @example
     * <pre>
     * egret.getDefinitionByName("egret.DisplayObject") //返回 DisplayObject类定义
     * </pre>
     * @includeExample egret/utils/getDefinitionByName.ts
     */
    function getDefinitionByName(name: string): any;
}
declare var __global: any;

declare module egret {
    /**
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
     * @method egret.setTimeout
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
     * @returns {number} 返回索引，可以用于 clearTimeout
     * @includeExample egret/utils/setTimeout.ts
     */
    function setTimeout(listener: Function, thisObject: any, delay: number, ...args: any[]): number;
    /**
     * 清除指定延迟后运行的函数。
     * @method egret.clearTimeout
     * @param key {number} egret.setTimeout所返回的索引
     * @includeExample egret/utils/setTimeout.ts
     */
    function clearTimeout(key: number): void;
}

declare module egret {
    /**
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
     * @method egret.setInterval
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
     * @returns {number} 返回索引，可以用于 clearInterval
     * @includeExample egret/utils/setInterval.ts
     */
    function setInterval(listener: Function, thisObject: any, delay: number, ...args: any[]): number;
    /**
     * 清除指定延迟后运行的函数。
     * @method egret.clearInterval
     * @param key {number} egret.setInterval所返回的索引
     * @includeExample egret/utils/setInterval.ts
     */
    function clearInterval(key: number): void;
}

declare module egret {
    /**
     * 检查指定的应用程序域之内是否存在一个公共定义。该定义可以是一个类、一个命名空间或一个函数的定义。
     * @method egret.hasDefinition
     * @param name {string} 定义的名称。
     * @returns {boolean} 公共定义是否存在
     * @example
     * <pre>
     *  egret.hasDefinition("egret.DisplayObject") //返回 true
     * </pre>
     * @includeExample egret/utils/hasDefinition.ts
     */
    function hasDefinition(name: string): boolean;
}

declare module egret {
    /**
     * 转换数字为颜色字符串
     * @method egret.toColorString
     * @param value {number} 需要转换的颜色值
     * @returns {string} 颜色字符串，例如"#ffffff"。
     * @includeExample egret/utils/toColorString.ts
     */
    function toColorString(value: number): string;
}

declare module egret {
    /**
     * @class egret.Matrix
     * @classdesc
     * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
     * 您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix 对象应用于 Transform 对象的 matrix 属性，然后应用该 Transform 对象作为显示对象的 transform 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。
     * @extends egret.HashObject
     * @includeExample egret/geom/Matrix.ts
     */
    class Matrix extends HashObject {
        /**
         * 创建一个 egret.Matrix 对象
         * @method egret.Matrix#constructor
         * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @param b {number} 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @param c {number} 旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @param tx {number} 沿 x 轴平移每个点的距离。
         * @param ty {number} 沿 y 轴平移每个点的距离。
         */
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        /**
         * 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @member egret.Matrix#a
         */
        a: number;
        /**
         * 旋转或倾斜图像时影响像素沿 y 轴定位的值
         * @member egret.Matrix#b
         */
        b: number;
        /**
         * 旋转或倾斜图像时影响像素沿 x 轴定位的值
         * @member egret.Matrix#c
         */
        c: number;
        /**
         * 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @member egret.Matrix#d
         */
        d: number;
        /**
         * 沿 x 轴平移每个点的距离
         * @member egret.Matrix#tx
         */
        tx: number;
        /**
         * 沿 y 轴平移每个点的距离
         * @member egret.Matrix#ty
         */
        ty: number;
        /**
         * 引擎内部用于函数传递返回值的全局 Matrix 对象，开发者请勿随意修改此对象
         * @member {egret.Matrix} egret.Matrix.identity
         */
        static identity: Matrix;
        /**
         * @private
         */
        static DEG_TO_RAD: number;
        /**
         * 前置矩阵
         * @method egret.Matrix#prepend
         * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param b {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param c {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param tx {number} 沿 x 轴平移每个点的距离
         * @param ty {number} 沿 y 轴平移每个点的距离
         * @returns {egret.Matrix}
         */
        prepend(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        /**
         * 后置矩阵
         * @method egret.Matrix#append
         * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param b {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param c {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param tx {number} 沿 x 轴平移每个点的距离
         * @param ty {number} 沿 y 轴平移每个点的距离
         * @returns {egret.Matrix}
         */
        append(a: number, b: number, c: number, d: number, tx: number, ty: number): Matrix;
        /**
         * 前置矩阵
         * @method egret.Matrix#prependTransform
         * @param x {number} x值
         * @param y {number} y值
         * @param scaleX {number} 水平缩放
         * @param scaleY {number} 垂直缩放
         * @param rotation {number} 旋转
         * @param skewX {number} x方向斜切
         * @param skewY {number} y方向斜切
         * @param regX {number} x值偏移
         * @param regY {number} y值偏移
         * @returns {egret.Matrix}
         */
        prependTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, regX: number, regY: number): Matrix;
        /**
         * 后置矩阵
         * @method egret.Matrix#appendTransform
         * @param x {number} x值
         * @param y {number} y值
         * @param scaleX {number} 水平缩放
         * @param scaleY {number} 垂直缩放
         * @param rotation {number} 旋转
         * @param skewX {number} x方向斜切
         * @param skewY {number} y方向斜切
         * @param regX {number} x值偏移
         * @param regY {number} y值偏移
         * @returns {egret.Matrix}
         */
        appendTransform(x: number, y: number, scaleX: number, scaleY: number, rotation: number, skewX: number, skewY: number, regX: number, regY: number): Matrix;
        /**
         * 对 Matrix 对象应用旋转转换。
         * 矩阵旋转，以角度制为单位
         * @method egret.Matrix#rotate
         * @param angle {number} 角度
         * @returns {egret.Matrix}
         */
        rotate(angle: number): Matrix;
        /**
         * 矩阵斜切，以角度值为单位
         * @method egret.Matrix#skew
         * @param skewX {number} x方向斜切
         * @param skewY {number} y方向斜切
         * @returns {egret.Matrix}
         */
        skew(skewX: number, skewY: number): Matrix;
        /**
         * 矩阵缩放
         * @method egret.Matrix#scale
         * @param x {number} 水平缩放
         * @param y {number} 垂直缩放
         * @returns {egret.Matrix}
         */
        scale(x: number, y: number): Matrix;
        /**
         * 沿 x 和 y 轴平移矩阵，由 x 和 y 参数指定。
         * @method egret.Matrix#translate
         * @param x {number} 沿 x 轴向右移动的量（以像素为单位）。
         * @param y {number} 沿 y 轴向下移动的量（以像素为单位）。
         * @returns {egret.Matrix}
         */
        translate(x: number, y: number): Matrix;
        /**
         * 为每个矩阵属性设置一个值，该值将导致 null 转换。
         * 通过应用恒等矩阵转换的对象将与原始对象完全相同。
         * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
         * @method egret.Matrix#identity
         * @returns {egret.Matrix}
         */
        identity(): Matrix;
        /**
         * 矩阵重置为目标矩阵
         * @method egret.Matrix#identityMatrix
         * @param matrix {egret.Matrix} 重置的目标矩阵
         * @returns {egret.Matrix}
         * @deprecated
         */
        identityMatrix(matrix: Matrix): Matrix;
        /**
         * 执行原始矩阵的逆转换。
         * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
         * @method egret.Matrix#invert
         * @returns {egret.Matrix}
         */
        invert(): Matrix;
        /**
         * 根据一个矩阵，返回某个点在该矩阵上的坐标
         * @method egret.Matrix.transformCoords
         * @param matrix {egret.Matrix}
         * @param x {number}
         * @param y {number}
         * @returns {numberPoint}
         * @stable C 该方法以后可能删除
         * @deprecated
         */
        static transformCoords(matrix: Matrix, x: number, y: number): Point;
        private array;
        /**
         * @private
         */
        toArray(transpose: any): any;
        /**
         * 将 Matrix 的成员设置为指定值
         * @method egret.Matrix#setTo
         * @param aa {number} 要将 Matrix 设置为的值
         * @param ba {number} 要将 Matrix 设置为的值
         * @param ca {number} 要将 Matrix 设置为的值
         * @param da {number} 要将 Matrix 设置为的值
         * @param txa {number} 要将 Matrix 设置为的值
         * @param tya {number} 要将 Matrix 设置为的值
         */
        setTo(aa: number, ba: number, ca: number, da: number, txa: number, tya: number): void;
        /**
         * 将源 Matrix 对象中的所有矩阵数据复制到调用方 Matrix 对象中。
         * @method egret.Matrix#copyFrom
         * @param sourceMatrix {egret.Matrix} 要从中复制数据的 Matrix 对象
         */
        copyFrom(sourceMatrix: Matrix): void;
        /**
         * 返回一个新的 Matrix 对象，它是此矩阵的克隆，带有与所含对象完全相同的副本。
         * @method egret.Matrix#clone
         * @returns {Matrix} 一个 Matrix 对象
         */
        clone(): Matrix;
        /**
         * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
         * @method egret.Matrix#concat
         * @param m {egret.Matrix} 要连接到源矩阵的矩阵
         */
        concat(m: Matrix): void;
        /**
         * 如果给定预转换坐标空间中的点，则此方法返回发生转换后该点的坐标。
         * 与使用 transformPoint() 方法应用的标准转换不同，deltaTransformPoint() 方法的转换不考虑转换参数 tx 和 ty。
         * @method egret.Matrix#deltaTransformPoint
         * @param point {egret.Point} 想要获得其矩阵转换结果的点
         * @returns {egret.Point} 由应用矩阵转换所产生的点
         */
        deltaTransformPoint(point: egret.Point): egret.Point;
        /**
         * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
         * @method egret.Matrix#transformPoint
         * @param point {egret.Point} 想要获得其矩阵转换结果的点
         * @returns {egret.Point} 由应用矩阵转换所产生的点
         */
        transformPoint(point: egret.Point): egret.Point;
        /**
         * 返回列出该 Matrix 对象属性的文本值。
         * @method egret.Matrix#toString
         * @returns {egret.Point} 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
         */
        toString(): string;
        /**
         * 包括用于缩放、旋转和转换的参数。当应用于矩阵时，该方法会基于这些参数设置矩阵的值。
         * @method egret.Matrix#createBox
         * @param scaleX {number} 水平缩放所用的系数
         * @param scaleY {number} 垂直缩放所用的系数
         * @param rotation {number} 旋转量（以弧度为单位）
         * @param tx {number} 沿 x 轴向右平移（移动）的像素数
         * @param ty {number} 沿 y 轴向下平移（移动）的像素数
         */
        createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        /**
         * 创建 Graphics 类的 beginGradientFill() 和 lineGradientStyle() 方法所需的矩阵的特定样式。
         * 宽度和高度被缩放为 scaleX/scaleY 对，而 tx/ty 值偏移了宽度和高度的一半。
         * @method egret.Matrix#createGradientBox
         * @param width {number} 渐变框的宽度
         * @param height {number} 渐变框的高度
         * @param rotation {number} 旋转量（以弧度为单位）
         * @param tx {number} 沿 x 轴向右平移的距离（以像素为单位）。此值将偏移 width 参数的一半
         * @param ty {number} 沿 y 轴向下平移的距离（以像素为单位）。此值将偏移 height 参数的一半
         */
        createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
    }
}

declare module egret {
    /**
     * @class egret.Point
     * @classdesc
     * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
     * @extends egret.HashObject
     * @includeExample egret/geom/Point.ts
     */
    class Point extends HashObject {
        /**
         * 引擎内部用于函数传递返回值的全局 Point 对象，开发者请勿随意修改此对象
         * @member {egret.Point} egret.Point.identity
         */
        static identity: Point;
        /**
         * 创建一个 egret.Point 对象
         * @method egret.Point#constructor
         * @param x {number} 该对象的x属性值，默认为0
         * @param y {number} 该对象的y属性值，默认为0
         */
        constructor(x?: number, y?: number);
        /**
         * 该点的水平坐标。默认值为 0。
         * @constant {number} egret.Point#x
         */
        x: number;
        /**
         * 该点的垂直坐标。默认值为 0。
         * @constant {number} egret.Point#y
         */
        y: number;
        /**
         * 克隆点对象
         * @method egret.Point#clone
         * @returns {egret.Point}
         */
        clone(): Point;
        /**
         * 确定两个点是否相同。如果两个点具有相同的 x 和 y 值，则它们是相同的点。
         * @method egret.Point#equals
         * @param {egret.Point} toCompare 要比较的点。
         * @returns {boolean} 如果该对象与此 Point 对象相同，则为 true 值，如果不相同，则为 false。
         */
        equals(toCompare: Point): boolean;
        /**
         * 返回 pt1 和 pt2 之间的距离。
         * @method egret.Point#distance
         * @param p1 {egret.Point} 第一个点
         * @param p2 {egret.Point} 第二个点
         * @returns {number} 第一个点和第二个点之间的距离。
         */
        static distance(p1: egret.Point, p2: egret.Point): number;
        /**
         * 将 Point 的成员设置为指定值
         * @method egret.Point#setTo
         * @param xa {number} 要将 Point 设置为的值
         * @param ya {number} 要将 Point 设置为的值
         */
        setTo(xa: number, ya: number): void;
        /**
         * 将源 Point 对象中的所有点数据复制到调用方 Point 对象中。
         * @method egret.Point#copyFrom
         * @param sourcePoint {egret.Point} 要从中复制数据的 Point 对象
         */
        copyFrom(sourcePoint: Point): void;
        /**
         * 从 (0,0) 到此点的线段长度。
         * @method egret.Point#length
         */
        length: number;
        /**
         * 将另一个点的坐标添加到此点的坐标以创建一个新点。
         * @method egret.Point#add
         * @param v {egret.Point} 要添加的点。
         * @returns {egret.Point} 新点。
         */
        add(v: Point): Point;
        /**
         * 确定两个指定点之间的点。
         * 参数 f 确定新的内插点相对于参数 pt1 和 pt2 指定的两个端点所处的位置。参数 f 的值越接近 1.0，则内插点就越接近第一个点（参数 pt1）。参数 f 的值越接近 0，则内插点就越接近第二个点（参数 pt2）。
         * @method egret.Point.interpolate
         * @param pt1 {egret.Point} 第一个点。
         * @param pt2 {egret.Point} 第二个点。
         * @param f {number} 两个点之间的内插级别。表示新点将位于 pt1 和 pt2 连成的直线上的什么位置。如果 f=1，则返回 pt1；如果 f=0，则返回 pt2。
         * @returns {egret.Point} 新的内插点。
         */
        static interpolate(pt1: Point, pt2: Point, f: number): Point;
        /**
         * 将 (0,0) 和当前点之间的线段缩放为设定的长度。
         * @method egret.Point#normalize
         * @param thickness {number} 缩放值。例如，如果当前点为 (0,5) 并且您将它规范化为 1，则返回的点位于 (0,1) 处。
         */
        normalize(thickness: number): void;
        /**
         * 按指定量偏移 Point 对象。dx 的值将添加到 x 的原始值中以创建新的 x 值。dy 的值将添加到 y 的原始值中以创建新的 y 值。
         * @method egret.Point#offset
         * @param dx {number} 水平坐标 x 的偏移量。
         * @param dy {number} 水平坐标 y 的偏移量。
         */
        offset(dx: number, dy: number): void;
        /**
         * 将一对极坐标转换为笛卡尔点坐标。
         * @method egret.Point.polar
         * @param len {number} 极坐标对的长度。
         * @param angle {number} 极坐标对的角度（以弧度表示）。
         */
        static polar(len: number, angle: number): Point;
        /**
         * 从此点的坐标中减去另一个点的坐标以创建一个新点。
         * @method egret.Point#subtract
         * @param v {egret.Point} 要减去的点。
         * @returns {egret.Point} 新点。
         */
        subtract(v: Point): Point;
        /**
         * 返回包含 x 和 y 坐标的值的字符串。该字符串的格式为 "(x=x, y=y)"，因此为点 23,17 调用 toString() 方法将返回 "(x=23, y=17)"。
         * @method egret.Point#toString
         * @returns {string} 坐标的字符串表示形式。
         */
        toString(): string;
    }
}

declare module egret {
    /**
     * @class egret.Rectangle
     * @classdesc 矩形类
     * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     * 但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。
     * @extends egret.HashObject
     * @includeExample egret/geom/Rectangle.ts
     */
    class Rectangle extends HashObject {
        /**
         * 创建一个 egret.Rectangle 对象。
         * 其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。如果调用此函数时不使用任何参数，将创建一个 x、y、width 和 height 属性均设置为 0 的矩形。
         * @method egret.Rectangle#constructor
         * @param x {number} 矩形左上角的 x 坐标。
         * @param y {number} 矩形左上角的 y 坐标。
         * @param width {number} 矩形的宽度（以像素为单位）。
         * @param height {number} 矩形的高度（以像素为单位）。
         */
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
         * 矩形左上角的 x 坐标。
         * @member {number} egret.Rectangle#x
         */
        x: number;
        /**
         * 矩形左上角的 y 坐标。
         * @member {number} egret.Rectangle#y
         */
        y: number;
        /**
         * 矩形的宽度（以像素为单位）。
         * @member {number} egret.Rectangle#width
         */
        width: number;
        /**
         * 矩形的高度（以像素为单位）。
         * @member {number} egret.Rectangle#height
         */
        height: number;
        /**
         * 矩形左上角的 x 坐标。
         * @member {number} egret.Rectangle#left
         */
        left: number;
        /**
         * x 和 width 属性的和。
         * @member {number} egret.Rectangle#right
         */
        right: number;
        /**
         * 矩形左上角的 y 坐标。
         * @member {number} egret.Rectangle#top
         */
        top: number;
        /**
         * y 和 height 属性的和。
         * @member {number} egret.Rectangle#bottom
         */
        bottom: number;
        /**
         * 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置。
         * @member {number} egret.Rectangle#topLeft
         */
        topLeft: Point;
        /**
         * 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置。
         * @member {number} egret.Rectangle#bottomRight
         */
        bottomRight: Point;
        /**
         * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
         * @method egret.Rectangle#initialize
         * @param x {number} 矩形的x轴
         * @param y {number} 矩形的y轴
         * @param width {number} 矩形的宽度
         * @param height {number} 矩形的高度
         * @returns {egret.Rectangle}
         * @deprecated
         */
        initialize(x: number, y: number, width: number, height: number): Rectangle;
        /**
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * @method egret.Rectangle#contains
         * @param x {number} 检测点的x轴
         * @param y {number} 检测点的y轴
         * @returns {boolean} 如果检测点位于矩形内，返回true，否则，返回false
         */
        contains(x: number, y: number): boolean;
        /**
         * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
         * @method egret.Rectangle#intersects
         * @param toIntersect {egret.Rectangle} 要与此 Rectangle 对象比较的 Rectangle 对象。
         * @returns {boolean} 如果两个矩形相交，返回true，否则返回false
         */
        intersects(toIntersect: Rectangle): boolean;
        /**
         * 将 Rectangle 对象的所有属性设置为 0。
         * @method egret.Rectangle#setEmpty
         */
        setEmpty(): void;
        /**
         * 克隆矩形对象
         * @method egret.Rectangle#clone
         * @returns {egret.Rectangle} 返回克隆后的矩形
         */
        clone(): Rectangle;
        /**
         * 引擎内部用于函数传递返回值的全局 Rectangle 对象，开发者请勿随意修改此对象
         * @member {egret.Rectangle} egret.Rectangle.identity
         */
        static identity: Rectangle;
        /**
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
         * @method egret.Rectangle#containsPoint
         * @param point {egret.Point} 包含点对象
         * @returns {boolean} 如果包含，返回true，否则返回false
         */
        containsPoint(point: Point): boolean;
        /**
         * 将 Rectangle 的成员设置为指定值
         * @method egret.Rectangle#setTo
         * @param xa {number} 要将 Rectangle 设置为的值
         * @param ya {number} 要将 Rectangle 设置为的值
         * @param widtha {number} 要将 Rectangle 设置为的值
         * @param heighta {number} 要将 Rectangle 设置为的值
         */
        setTo(xa: number, ya: number, widtha: number, heighta: number): void;
        /**
         * 将源 Rectangle 对象中的所有矩形数据复制到调用方 Rectangle 对象中
         * @method egret.Rectangle#copyFrom
         * @param sourceRect {egret.Rectangle} 要从中复制数据的 Rectangle 对象
         */
        copyFrom(sourceRect: Rectangle): void;
        /**
         * 按指定量增加 Rectangle 对象的大小（以像素为单位）
         * 保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
         * @method egret.Rectangle#inflate
         * @param dx {number} Rectangle 对象横向增加的值。
         * @param dy {number} Rectangle 对象纵向增加的值。
         */
        inflate(dx: number, dy: number): void;
        /**
         * 确定此 Rectangle 对象是否为空
         * @method egret.Rectangle#isEmpty
         * @returns {boolean} 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false
         */
        isEmpty(): boolean;
        /**
         * 确定此 Rectangle 对象内是否包含由 rect 参数指定的 Rectangle 对象。
         * 如果一个 Rectangle 对象完全在另一个 Rectangle 的边界内，我们说第二个 Rectangle 包含第一个 Rectangle。
         * @method egret.Rectangle#containsRect
         * @param rect {egret.Rectangle} 所检查的 Rectangle 对象
         * @returns {boolean} 如果此 Rectangle 对象包含您指定的 Rectangle 对象，则返回 true 值，否则返回 false。
         */
        containsRect(rect: egret.Rectangle): boolean;
        /**
         * 确定在 toCompare 参数中指定的对象是否等于此 Rectangle 对象。
         * 此方法将某个对象的 x、y、width 和 height 属性与此 Rectangle 对象所对应的相同属性进行比较。
         * @method egret.Rectangle#equals
         * @param toCompare {egret.Rectangle} 要与此 Rectangle 对象进行比较的矩形
         * @returns {boolean} 如果对象具有与此 Rectangle 对象完全相同的 x、y、width 和 height 属性值，则返回 true 值，否则返回 false。
         */
        equals(toCompare: Rectangle): boolean;
        /**
         * 增加 Rectangle 对象的大小。此方法与 Rectangle.inflate() 方法类似，只不过它采用 Point 对象作为参数。
         * @method egret.Rectangle#inflatePoint
         * @param point {egret.Point} 此 Point 对象的 x 属性用于增加 Rectangle 对象的水平尺寸。y 属性用于增加 Rectangle 对象的垂直尺寸。
         */
        inflatePoint(point: Point): void;
        /**
         * 如果在 toIntersect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。
         * 如果矩形不相交，则此方法返回一个空的 Rectangle 对象，其属性设置为 0。
         * @method egret.Rectangle#intersection
         * @param toIntersect {egret.Rectangle} 要与此 Rectangle 对象比较的 Rectangle 对象。
         * @returns {egret.Rectangle} 等于交集区域的 Rectangle 对象。如果该矩形不相交，则此方法返回一个空的 Rectangle 对象；即，其 x、y、width 和 height 属性均设置为 0 的矩形。
         */
        intersection(toIntersect: Rectangle): Rectangle;
        /**
         * 按指定量调整 Rectangle 对象的位置（由其左上角确定）。
         * @method egret.Rectangle#offset
         * @param dx {number} 将 Rectangle 对象的 x 值移动此数量。
         * @param dy {number} 将 Rectangle 对象的 t 值移动此数量。
         */
        offset(dx: number, dy: number): void;
        /**
         * 将 Point 对象用作参数来调整 Rectangle 对象的位置。此方法与 Rectangle.offset() 方法类似，只不过它采用 Point 对象作为参数。
         * @method egret.Rectangle#offsetPoint
         * @param point {egret.Point} 要用于偏移此 Rectangle 对象的 Point 对象。
         */
        offsetPoint(point: Point): void;
        /**
         * 生成并返回一个字符串，该字符串列出 Rectangle 对象的水平位置和垂直位置以及高度和宽度。
         * @method egret.Rectangle#toString
         * @returns {string} 一个字符串，它列出了 Rectangle 对象的下列各个属性的值：x、y、width 和 height。
         */
        toString(): string;
        /**
         * 通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
         * @method egret.Rectangle#union
         * @param toUnion {egret.Rectangle} 要添加到此 Rectangle 对象的 Rectangle 对象。
         * @returns {egret.Rectangle} 充当两个矩形的联合的新 Rectangle 对象。
         */
        union(toUnion: Rectangle): Rectangle;
    }
}

declare module egret {
    /**
     * @class egret.ColorTransform
     * @classdesc
     * 可使用 ColorTransform 类调整显示对象的颜色值。可以将颜色调整或颜色转换应用于所有四种通道：红色、绿色、蓝色和 Alpha 透明度。
     * 当 ColorTransform 对象应用于显示对象时，将按如下方法为每个颜色通道计算新值：
     * 新红色值 = (旧红色值 * redMultiplier) + redOffset
     * 新绿色值 = (旧绿色值 * greenMultiplier) + greenOffset
     * 新蓝色值 = (旧蓝色值 * blueMultiplier) + blueOffset
     * 新 Alpha 值 = (旧 Alpha 值 * alphaMultiplier) + alphaOffset
     * @extends egret.HashObject
     * @private
     */
    class ColorTransform extends HashObject {
        /**
         * 创建一个 egret.ColorTransform 对象
         * @method egret.ColorTransform#constructor
         * @param redMultiplier {number} 红色乘数的值，在 0 到 1 范围内。
         * @param greenMultiplier {number} 绿色乘数的值，在 0 到 1 范围内。
         * @param blueMultiplier {number} 蓝色乘数的值，在 0 到 1 范围内。
         * @param alphaMultiplier {number} Alpha 透明度乘数的值，在 0 到 1 范围内。
         * @param redOffset {number} 红色通道值的偏移量，在 -255 到 255 范围内。
         * @param greenOffset {number} 绿色通道值的偏移量，在 -255 到 255 范围内。
         * @param blueOffset {number} 蓝色通道值的偏移量，在 -255 到 255 范围内。
         * @param alphaOffset {number} Alpha 透明度通道值的偏移量，在 -255 到 255 范围内。
         */
        constructor(redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaMultiplier?: number, redOffset?: number, greenOffset?: number, blueOffset?: number, alphaOffset?: number);
        /**
         * @private
         */
        _alphaMultiplier: number;
        /**
         * 与 Alpha 透明度通道值相乘的十进制值。
         * @member {number} egret.ColorTransform#alphaMultiplier
         * @default 1
         */
        alphaMultiplier: number;
        /**
         * @private
         */
        _alphaOffset: number;
        /**
         * -255 到 255 之间的数字，加到 Alpha 透明度通道值和 alphaMultiplier 值的乘积上。
         * @member {number} egret.ColorTransform#alphaOffset
         * @default 0
         */
        alphaOffset: number;
        /**
         * @private
         */
        _blueMultiplier: number;
        /**
         * 与蓝色通道值相乘的十进制值。
         * @member {number} egret.ColorTransform#blueMultiplier
         * @default 1
         */
        blueMultiplier: number;
        /**
         * @private
         */
        _blueOffset: number;
        /**
         * -255 到 255 之间的数字，加到蓝色通道值和 blueMultiplier 值的乘积上。
         * @member {number} egret.ColorTransform#blueOffset
         * @default 0
         */
        blueOffset: number;
        /**
         * @private
         */
        _greenMultiplier: number;
        /**
         * 与绿色通道值相乘的十进制值。
         * @member {number} egret.ColorTransform#greenMultiplier
         * @default 1
         */
        greenMultiplier: number;
        /**
         * @private
         */
        _greenOffset: number;
        /**
         * -255 到 255 之间的数字，加到绿色通道值和 greenMultiplier 值的乘积上。
         * @member {number} egret.ColorTransform#greenOffset
         * @default 0
         */
        greenOffset: number;
        /**
         * @private
         */
        _redMultiplier: number;
        /**
         * 与红色通道值相乘的十进制值。
         * @member {number} egret.ColorTransform#redMultiplier
         * @default 1
         */
        redMultiplier: number;
        /**
         * @private
         */
        _redOffset: number;
        /**
         * -255 到 255 之间的数字，加到红色通道值和 redMultiplier 值的乘积上。
         * @member {number} egret.ColorTransform#redOffset
         * @default 0
         */
        redOffset: number;
        /**
         * ColorTransform 对象的 RGB 颜色值。
         * @member {number} egret.ColorTransform#color
         */
        color: number;
        identityColorTransform(colorTransform: ColorTransform): void;
        /**
         * 将 second 参数指定的 ColorTransform 对象与当前 ColorTransform 对象连接，并将当前对象设置为结果，即两个颜色转换的相加组合
         * @method egret.ColorTransform#concat
         * @param second {egret.ColorTransform} 要与当前 ColorTransform 对象合并的 ColorTransform 对象
         */
        concat(second: egret.ColorTransform): void;
        /**
         * 设置字符串格式并将其返回，该字符串描述 ColorTransform 对象的所有属性
         * @method egret.ColorTransform#toString
         */
        toString(): string;
    }
}

declare module egret {
    /**
     * @class egret.Transform
     * @classdesc
     * 利用 Transform 类，可以访问可应用于显示对象的颜色调整属性和二维转换对象。
     * @extends egret.HashObject
     * @private
     */
    class Transform extends HashObject {
        private _display;
        constructor(display: DisplayObject);
        private _matrix;
        private _matrix2;
        /**
         * 一个 Matrix 对象，其中包含更改显示对象的缩放、旋转和平移的值。
         * @member {number} egret.Transform#matrix
         */
        matrix: Matrix;
        private _setMatrix(value);
        /**
         * @private
         */
        _colorTransform: ColorTransform;
        private _colorTransform2;
        /**
         * 一个 ColorTransform 对象，其中包含整体调整显示对象颜色的值。
         * @member {egret.ColorTransform} egret.Transform#colorTransform
         */
        colorTransform: ColorTransform;
        private _setColorTransform(value);
    }
}

declare module egret {
    /**
     * @deprecated
     * @private
     */
    class SAXParser extends HashObject {
        static _instance: SAXParser;
        /**
         * @deprecated
         */
        static getInstance(): SAXParser;
        private _parser;
        private _xmlDict;
        private _isSupportDOMParser;
        constructor();
        /**
         * @deprecated
         */
        parserXML(textxml: string): any;
    }
}

declare module egret {
    /**
     * @class egret.StageDelegate
     * @classdesc
     * StageDelegate负责处理屏幕适配策略
     * @extends egret.HashObject
     * @private
     */
    class StageDelegate extends HashObject {
        private static instance;
        /**
         * @method egret.StageDelegate.getInstance
         * @returns {StageDelegate}
         */
        static getInstance(): StageDelegate;
        /**
         * @deprecated
         */
        static canvas_name: string;
        /**
         */
        static egret_root_div: string;
        static canvas_div_name: string;
        private _designWidth;
        private _designHeight;
        _scaleX: number;
        _scaleY: number;
        _offSetY: number;
        private _resolutionPolicy;
        _stageWidth: number;
        _stageHeight: number;
        /**
         * @method egret.StageDelegate#constructor
         */
        constructor();
        /**
         * 设置舞台的宽高
         * @method egret.StageDelegate#setDesignSize
         * @param width {number}
         * @param height {number}
         */
        setDesignSize(width: number, height: number): void;
        /**
         * @param resolutionPolic {any}
         */
        _setResolutionPolicy(resolutionPolicy: ResolutionPolicy): void;
        /**
         * @method egret.StageDelegate#getScaleX
         */
        getScaleX(): number;
        /**
         * @method egret.StageDelegate#getScaleY
         */
        getScaleY(): number;
        /**
         * @method egret.StageDelegate#getOffSetY
         */
        getOffSetY(): number;
    }
    /**
     * @private
     */
    class ResolutionPolicy {
        private _containerStrategy;
        private _contentStrategy;
        constructor(containerStg: any, contentStg: any);
        /**
         * @method egret.ResolutionPolicy#init
         * @param view {egret.StageDelegate}
         */
        init(view: StageDelegate): void;
        /**
         * @method egret.ResolutionPolicy#_apply
         * @param view {any}
         * @param designedResolutionWidth {any}
         * @param designedResolutionHeigh {any}
         */
        _apply(view: any, designedResolutionWidth: any, designedResolutionHeight: any): void;
        $setEgretSize(stageW: number, stageH: number, styleW: number, styleH: number, clientWidth: number, clientHeight: number, shouldRotate: boolean, orientation: string): void;
        /**
         * 显示区域分辨率宽
         * @returns {number}
         */
        _getClientWidth(): number;
        /**
         * 显示区域分辨率高
         * @returns {number}
         */
        _getClientHeight(): number;
    }
    /**
     * @private
     */
    class ContainerStrategy {
        /**
         * @constant egret.ContainerStrategy.EQUAL_TO_FRAME
         */
        static EQUAL_TO_FRAME: any;
        /**
         * @method egret.ContainerStrategy.initialize
         */
        static initialize(): void;
        /**
         * @method egret.ContainerStrategy#init
         * @param vie {any}
         */
        init(view: any): void;
        /**
         * @method egret.ContainerStrategy#_apply
         * @param view {any}
         * @param designedWidth {any}
         * @param designedHeigh {any}
         */
        _apply(view: any, designedWidth: any, designedHeight: any): void;
        _setupContainer(): void;
    }
    /**
     * @classdesc
     * @extends egret.ContainerStrategy
     * @private
     */
    class EqualToFrame extends ContainerStrategy {
        _apply(view: any): void;
    }
    /**
     * @private
     */
    class ContentStrategy {
        $stageWidth: number;
        $stageHeight: number;
        $displayWidth: number;
        $displayHeight: number;
        /**
         * @method egret.ContentStrategy#init
         * @param vie {any}
         */
        init(view: any): void;
        /**
         * @method egret.ContentStrategy#_apply
         * @param delegate {egret.StageDelegate}
         * @param designedResolutionWidth {number}
         * @param designedResolutionHeight {number}
         */
        _apply(delegate: egret.StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number, clientWidth: number, clientHeight: number): void;
        /**
         * 显示区域分辨率宽
         * @returns {number}
         */
        _getClientWidth(): number;
        /**
         * 显示区域分辨率高
         * @returns {number}
         */
        _getClientHeight(): number;
    }
    /**
     * @class egret.FixedHeight
     * @classdesc
     * @extends egret.ContentStrategy
     * @private
     */
    class FixedHeight extends ContentStrategy {
        private minWidth;
        /**
         * 构造函数
         * @param minWidth 最终游戏内适配的最小stageWidth，默认没有最小宽度
         */
        constructor(minWidth?: number);
        /**
         * @method egret.FixedHeight#_apply
         * @param delegate {any}
         * @param designedResolutionWidth {any}
         * @param designedResolutionHeight {any}
         */
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number, clientWidth: number, clientHeight: number): void;
    }
    /**
     * @class egret.FixedWidth
     * @classdesc
     * @extends egret.ContentStrategy
     * @private
     */
    class FixedWidth extends ContentStrategy {
        private minHeight;
        /**
         * 构造函数
         * @param minHeight 最终游戏内适配的最小stageHeight，默认没有最小高度
         */
        constructor(minHeight?: number);
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number, clientWidth: number, clientHeight: number): void;
    }
    /**
     * @class egret.NoScale
     * @classdesc
     * @extends egret.ContentStrategy
     * @private
     */
    class NoScale extends ContentStrategy {
        constructor();
        /**
         * @method egret.NoScale#_apply
         * @param delegate {egret.StageDelegate}
         * @param designedResolutionWidth {number}
         * @param designedResolutionHeight {number}
         */
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number, clientWidth: number, clientHeight: number): void;
    }
    /**
     * @private
     */
    class ShowAll extends ContentStrategy {
        constructor();
        /**
         * @method egret.NoScale#_apply
         * @param delegate {egret.StageDelegate}
         * @param designedResolutionWidth {number}
         * @param designedResolutionHeight {number}
         */
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number, clientWidth: number, clientHeight: number): void;
    }
    /**
     * @private
     */
    class FullScreen extends ContentStrategy {
        constructor();
        /**
         * @method egret.NoScale#_apply
         * @param delegate {egret.StageDelegate}
         * @param designedResolutionWidth {number}
         * @param designedResolutionHeight {number}
         */
        _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number, clientWidth: number, clientHeight: number): void;
    }
}

declare module egret {
    /**
     * @classdesc
     * @extends egret.HashObject
     * @private
     */
    class RenderFilter extends HashObject {
        constructor();
        private static instance;
        /**
         * @method egret.egret.getInstance
         * @returns {RenderFilter}
         */
        static getInstance(): RenderFilter;
        _drawAreaList: Array<Rectangle>;
        private _defaultDrawAreaList;
        private _originalData;
        /**
         * @method egret.egret#addDrawArea
         * @param area {egret.Rectangle}
         */
        addDrawArea(area: egret.Rectangle): void;
        /**
         * @method egret.egret#clearDrawArea
         */
        clearDrawArea(): void;
        private static identityRectangle;
        /**
         * 先检查有没有不需要绘制的区域，再把需要绘制的区域绘制出来
         * @method egret.egret#drawImage
         * @param renderContext {any}
         * @param data {RenderData}
         * @param sourceX {number}
         * @param sourceY {number}
         * @param sourceWidth {number}
         * @param sourceHeight {number}
         * @param destX {number}
         * @param destY {number}
         * @param destWidth {number}
         * @param destHeight {number}
         */
        drawImage(renderContext: RendererContext, data: RenderData, sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, repeat?: any): void;
        private ignoreRender(data, rect, destX, destY);
        /**
         * @method egret.egret#getDrawAreaList
         * @returns {Rectangle}
         */
        getDrawAreaList(): Array<Rectangle>;
        /**
         * 改变尺寸时使用
         */
        private onResize();
    }
    /**
     * @private
     * 用于显示对象的接口定义，开发者不需要用到该类
     */
    interface RenderData {
        /**
         * @member egret.RenderData#_worldTransform
         */
        _worldTransform: egret.Matrix;
        /**
         * @member egret.RenderData#_worldBounds
         */
        _worldBounds: egret.Rectangle;
        _texture_to_render: egret.Texture;
        _getSize(resultRect: Rectangle): egret.Rectangle;
    }
}

declare module egret {
    /**
     * @classdesc 注入器
     * @class egret.Injector
     * @includeExample egret/utils/Injector.ts
     */
    class Injector {
        /**
         * 储存类的映射规则
         */
        private static mapClassDic;
        /**
         * 以类定义为值进行映射注入，当第一次用getInstance()请求它的单例时才会被实例化。
         * @method egret.Injector.mapClass
         * @param whenAskedFor {any} whenAskedFor 传递类定义或类完全限定名作为需要映射的键。
         * @param instantiateClass {any} instantiateClass 传递类作为需要映射的值，它的构造函数必须为空。若不为空，请使用Injector.mapValue()方法直接注入实例。
         * @param named {string} named 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
         */
        static mapClass(whenAskedFor: any, instantiateClass: any, named?: string): void;
        /**
         * 获取完全限定类名
         */
        private static getKey(hostComponentKey);
        private static mapValueDic;
        /**
         * 以实例为值进行映射注入,当用getInstance()请求单例时始终返回注入的这个实例。
         * @method egret.Injector.mapValue
         * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
         * @param useValue {any} 传递对象实例作为需要映射的值。
         * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
         */
        static mapValue(whenAskedFor: any, useValue: any, named?: string): void;
        /**
         * 检查指定的映射规则是否存在
         * @method egret.Injector.hasMapRule
         * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
         * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。
         * @returns {boolean} 指定的映射规则是否存在
         */
        static hasMapRule(whenAskedFor: any, named?: string): boolean;
        /**
         * 获取指定类映射的单例，注意:这个方法总是返回全局唯一的实例，不会重复创建。
         * @method egret.Injector.getInstance
         * @param clazz {any} 类定义或类的完全限定名
         * @param named {string} 可选参数，若在调用mapClass()映射时设置了这个值，则要传入同样的字符串才能获取对应的单例
         * @returns {any} 获取指定类映射的单例
         */
        static getInstance(clazz: any, named?: string): any;
    }
}

declare module egret {
    /**
     * @private
     */
    const enum BitmapFilterQuality {
        /**
         * 定义低品质滤镜设置
         * @private
         */
        LOW = 1,
        /**
         * 定义中等品质滤镜设置
         * @private
         */
        MEDIUM = 2,
        /**
         * 定义高品质滤镜设置
         * @private
         */
        HIGH = 3,
    }
}

declare module egret {
    /**
     * @private
     */
    class Filter extends HashObject {
        type: string;
    }
}

declare module egret {
    /**
     * @class egret.BlurFilter
     * @classdesc
     * 可使用 BlurFilter 类将模糊视觉效果应用于显示对象。模糊效果可以柔化图像的细节。
     * @extends egret.Filter
     * @private
     */
    class BlurFilter extends Filter {
        blurX: number;
        blurY: number;
        /**
         * 创建一个 egret.BlurFilter 对象
         * @method egret.BlurFilter#constructor
         * @param blurX {number} 水平模糊量。有效值为 0 到 255（浮点）。
         * @param blurY {number} 垂直模糊量。有效值为 0 到 255（浮点）。
         */
        constructor(blurX: number, blurY: number);
    }
}

declare module egret {
    /**
     * @class egret.ColorMatrixFilter
     * @classdesc
     * 使用 ColorMatrixFilter 类可以将 4 x 5 矩阵转换应用于输入图像上的每个像素的 RGBA 颜色和 Alpha 值，以生成具有一组新的 RGBA 颜色和 Alpha 值的结果。
     * @extends egret.Filter
     * @private
     */
    class ColorMatrixFilter extends Filter {
        /**
         * @private
         */
        _matrix: Array<number>;
        private _matrix2;
        /**
         * 创建一个 egret.ColorMatrixFilter 对象
         * @method egret.ColorMatrixFilter#constructor
         * @param matrix {Array<number>} 由 20 个项目（排列成 4 x 5 矩阵）组成的数组。
         */
        constructor(matrix?: Array<number>);
        /**
         * 由 20 个项目组成的数组，适用于 4 x 5 颜色转换。
         * @member egret.ColorMatrixFilter#matrix
         */
        matrix: Array<number>;
        private _setMatrix(value);
    }
}

declare module egret {
    /**
     * @class egret.GlowFilter
     * @classdesc
     * 使用 GlowFilter 类可以对显示对象应用发光效果。在投影滤镜的 distance 和 angle 属性设置为 0 时，发光滤镜与投影滤镜极为相似。
     * @extends egret.Filter
     * @private
     */
    class GlowFilter extends Filter {
        color: number;
        alpha: number;
        blurX: number;
        blurY: number;
        strength: number;
        quality: number;
        inner: boolean;
        knockout: boolean;
        _red: number;
        _green: number;
        _blue: number;
        /**
         * 创建一个 egret.GlowFilter 对象
         * @method egret.GlowFilter#constructor
         * @param color {number} 光晕颜色，采用十六进制格式 0xRRGGBB。默认值为 0xFF0000。
         * @param alpha {number} 颜色的 Alpha 透明度值。有效值为 0 到 1。例如，0.25 设置透明度值为 25%。
         * @param blurX {number} 水平模糊量。有效值为 0 到 255（浮点）。
         * @param blurY {number} 垂直模糊量。有效值为 0 到 255（浮点）。
         * @param strength {number} 印记或跨页的强度。该值越高，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现。
         * @param quality {number} 应用滤镜的次数。
         * @param inner {boolean} 指定发光是否为内侧发光。值 true 指定发光是内侧发光。值 false 指定发光是外侧发光（对象外缘周围的发光）。暂未实现。
         * @param knockout {number} 指定对象是否具有挖空效果。值为 true 将使对象的填充变为透明，并显示文档的背景颜色。暂未实现。
         */
        constructor(color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean);
    }
}

declare module egret {
    /**
     * @class egret.DropShadowFilter
     * @classdesc
     * 可使用 DropShadowFilter 类向显示对象添加投影。
     * @extends egret.GlowFilter
     * @private
     */
    class DropShadowFilter extends GlowFilter {
        distance: number;
        angle: number;
        /**
         * 创建一个 egret.DropShadowFilter 对象
         * @method egret.DropShadowFilter#constructor
         * @param distance {number} 阴影的偏移距离，以像素为单位。
         * @param angle {number} 阴影的角度，0 到 360 度（浮点）。
         * @param color {number} 光晕颜色，采用十六进制格式 0xRRGGBB。默认值为 0xFF0000。
         * @param alpha {number} 颜色的 Alpha 透明度值。有效值为 0 到 1。例如，0.25 设置透明度值为 25%。
         * @param blurX {number} 水平模糊量。有效值为 0 到 255（浮点）。
         * @param blurY {number} 垂直模糊量。有效值为 0 到 255（浮点）。
         * @param strength {number} 印记或跨页的强度。该值越高，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现。
         * @param quality {number} 应用滤镜的次数。
         * @param inner {boolean} 指定发光是否为内侧发光。值 true 指定发光是内侧发光。值 false 指定发光是外侧发光（对象外缘周围的发光）。暂未实现。
         * @param knockout {number} 指定对象是否具有挖空效果。值为 true 将使对象的填充变为透明，并显示文档的背景颜色。暂未实现。
         */
        constructor(distance?: number, angle?: number, color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean, hideObject?: boolean);
    }
}

declare module egret {
    /**
     * @class egret.BlendMode
     * @classdesc
     * 提供混合模式可视效果的常量值的类。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=48 BlendMode实例代码
     * @includeExample egret/display/BlendMode.ts
     */
    class BlendMode {
        /**
         * 该显示对象出现在背景前面。显示对象的像素值会覆盖背景的像素值。在显示对象为透明的区域，背景是可见的。
         * @constant {string} egret.BlendMode.NORMAL
         */
        static NORMAL: string;
        /**
         * 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF。此设置通常用于使两个对象间的加亮溶解产生动画效果。
         * 例如，如果显示对象的某个像素的 RGB 值为 0xAAA633，背景像素的 RGB 值为 0xDD2200，则显示像素的结果 RGB 值为 0xFFC833（因为 0xAA + 0xDD > 0xFF，0xA6 + 0x22 = 0xC8，且 0x33 + 0x00 = 0x33）。
         * @constant {string} egret.BlendMode.ADD
         */
        static ADD: string;
        /**
         * 根据显示对象的 Alpha 值擦除背景。Alpha 值不为0的区域将被擦除。
         * @constant {string} egret.BlendMode.ERASE
         */
        static ERASE: string;
        /**
         * 根据显示对象的 Alpha 值擦除背景。Alpha 值为0的区域将被擦除。
         * 注意：由于 CanvasAPI 的限制，只会保留 Alpha 值不为1的区域。
         * @constant {string} egret.BlendMode.ERASE_REVERSE
         * @deprecated
         */
        static ERASE_REVERSE: string;
    }
}

declare module egret {
    /**
     * @private
     */
    class DisplayObjectProperties {
        _name: string;
        _explicitWidth: number;
        _explicitHeight: number;
        _x: number;
        _y: number;
        _scaleX: number;
        _scaleY: number;
        _anchorOffsetX: number;
        _anchorOffsetY: number;
        _anchorX: number;
        _anchorY: number;
        _rotation: number;
        _alpha: number;
        _skewX: number;
        _skewY: number;
        _blendMode: string;
        /**
         * 每个显示对象初始化时默认的 touchEnabled 属性值
         * @default false
         */
        static defaultTouchEnabled: boolean;
        _touchEnabled: boolean;
        _visible: boolean;
        _worldAlpha: number;
        _scrollRect: Rectangle;
        _cacheAsBitmap: boolean;
        _parent: DisplayObjectContainer;
        _stage: Stage;
        _needDraw: boolean;
        /**
         * beta功能，请勿调用此方法
         */
        _filters: Array<Filter>;
        _hasWidthSet: boolean;
        _hasHeightSet: boolean;
        _normalDirty: boolean;
        _sizeDirty: boolean;
        _isContainer: boolean;
        constructor();
    }
}

declare module egret {
    /**
     * @private
     */
    class DisplayObjectPrivateProperties {
        _cacheBounds: egret.Rectangle;
        _hitTestPointTexture: RenderTexture;
        _rectW: number;
        _rectH: number;
        _cacheDirty: boolean;
        constructor();
    }
}

declare module egret {
    /**
     * @class egret.DisplayObject
     * @extends egret.EventDispatcher
     * @classdesc DisplayObject 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时显示的所有对象。使用 DisplayObjectContainer 类排列显示列表中的显示对象。
     * DisplayObjectContainer 对象可以有子显示对象，而其他显示对象是“叶”节点，只有父级和同级，没有子级。
     * DisplayObject 类支持基本功能（如对象的 x 和 y 位置），也支持更高级的对象属性（如它的转换矩阵），所有显示对象都继承自 DisplayObject 类。
     * DisplayObject 类包含若干广播事件。通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。
     * 若只有一个目标，则会将事件侦听器限制为只能放置到该目标上（在某些情况下，可放置到显示列表中该目标的祖代上），这意味着您可以向任何 DisplayObject 实例添加侦听器来侦听广播事件。
     * 任何继承自DisplayObject的类都必须实现以下方法
     * _render();
     * _measureBounds()
     * 不允许重写以下方法
     * _draw();
     * getBounds();
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=102&terms1_id=25&terms2_id=27 显示对象的基本概念
     * @includeExample egret/display/DisplayObject.ts
     *
     * @event egret.Event.ADDED 将显示对象添加到显示列表中时调度。
     * @event egret.Event.ADDED_TO_STAGE 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
     * @event egret.Event.REMOVED 将要从显示列表中删除显示对象时调度。
     * @event egret.Event.REMOVED_FROM_STAGE 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
     * @event egret.Event.ENTER_FRAME [广播事件] 播放头进入新帧时调度。
     * @event egret.Event.RENDER [广播事件] 将要更新和呈现显示列表时调度。
     * @event egret.Event.TOUCH_BEGIN [触摸事件] 触摸开始时调度。
     * @event egret.Event.TOUCH_MOVE [触摸事件] 触摸移动时调度。
     * @event egret.Event.TOUCH_END [触摸事件] 触摸结束时调度。
     * @event egret.Event.TOUCH_TAP [触摸事件] 单击时调度。
     */
    class DisplayObject extends EventDispatcher implements RenderData {
        _DO_Props_: DisplayObjectProperties;
        private _DO_Privs_;
        /**
         * 创建一个 egret.DisplayObject 对象
         */
        constructor();
        _texture_to_render: Texture;
        _worldTransform: egret.Matrix;
        _worldBounds: egret.Rectangle;
        __hack_local_matrix: any;
        _sizeChangeCallBack: Function;
        _sizeChangeCallTarget: any;
        _setDirty(): void;
        /**
         * @private
         */
        getDirty(): boolean;
        _setParentSizeDirty(): void;
        _setSizeDirty(): void;
        _clearDirty(): void;
        _clearSizeDirty(): void;
        /**
         * 表示 DisplayObject 的实例名称。
         * 通过调用父显示对象容器的 getChildByName() 方法，可以在父显示对象容器的子列表中标识该对象。
         * @member {string} egret.DisplayObject#name
         */
        name: string;
        /**
         * 表示包含此显示对象的 DisplayObjectContainer 对象。
         * 使用 parent 属性可以指定高于显示列表层次结构中当前显示对象的显示对象的相对路径。
         * @member {egret.DisplayObjectContainer} egret.DisplayObject#parent
         */
        parent: DisplayObjectContainer;
        _parentChanged(parent: DisplayObjectContainer): void;
        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @member {number} egret.DisplayObject#x
         */
        x: number;
        _setX(value: number): void;
        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
         * @member {number} egret.DisplayObject#y
         */
        y: number;
        _setY(value: number): void;
        /**
         * 表示从注册点开始应用的对象的水平缩放比例（百分比）。
         * 缩放本地坐标系统将更改 x 和 y 属性值，这些属性值是以整像素定义的。
         * 默认值为 1，即不缩放。
         * @member {number} egret.DisplayObject#scaleX
         * @default 1
         */
        scaleX: number;
        /**
         * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。
         * 缩放本地坐标系统将更改 x 和 y 属性值，这些属性值是以整像素定义的。
         * 默认值为 1，即不缩放。
         * @member {number} egret.DisplayObject#scaleY
         * @default 1
         */
        scaleY: number;
        /**
         * 表示从对象绝对锚点X。
         * @member {number} egret.DisplayObject#anchorOffsetX
         * @default 0
         */
        anchorOffsetX: number;
        /**
         * 表示从对象绝对锚点Y。
         * @member {number} egret.DisplayObject#anchorOffsetY
         * @default 0
         */
        anchorOffsetY: number;
        /**
         * 表示从对象相对锚点X。
         * @member {number} egret.DisplayObject#anchorX
         * @default 0
         * @deprecated
         */
        anchorX: number;
        _setAnchorX(value: number): void;
        /**
         * 表示从对象相对锚点Y。
         * @member {number} egret.DisplayObject#anchorY
         * @default 0
         * @deprecated
         */
        anchorY: number;
        _setAnchorY(value: number): void;
        /**
         * 显示对象是否可见。
         * 不可见的显示对象已被禁用。例如，如果实例的 visible=false，则无法单击该对象。
         * 默认值为 true 可见
         * @member {boolean} egret.DisplayObject#visible
         */
        visible: boolean;
        _setVisible(value: boolean): void;
        /**
         * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
         * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。对于此范围之外的值，可以通过加上或减去 360 获得该范围内的值。例如，my_video.rotation = 450语句与 my_video.rotation = 90 是相同的。
         * @member {number} egret.DisplayObject#rotation
         * @default 0 默认值为 0 不旋转。
         */
        rotation: number;
        /**
         * 表示指定对象的 Alpha 透明度值。
         * 有效值为 0（完全透明）到 1（完全不透明）。alpha 设置为 0 的显示对象是活动的，即使它们不可见。
         * @member {number} egret.DisplayObject#alpha
         * @default 1
         */
        alpha: number;
        _setAlpha(value: number): void;
        /**
         * 表示DisplayObject的x方向斜切
         * @member {number} egret.DisplayObject#skewX
         * @default 0
         */
        skewX: number;
        /**
         * 表示DisplayObject的y方向斜切
         * @member {number} egret.DisplayObject#skewY
         * @default 0
         */
        skewY: number;
        /**
         * 指定此对象是否接收鼠标/触摸事件
         * @member {boolean} egret.DisplayObject#touchEnabled
         * @default false 默认为 false 即不可以接收。
         */
        touchEnabled: boolean;
        _setTouchEnabled(value: boolean): void;
        /**
         * BlendMode 类中的一个值，用于指定要使用的混合模式。
         * 内部绘制位图的方法有两种。 如果启用了混合模式或外部剪辑遮罩，则将通过向矢量渲染器添加有位图填充的正方形来绘制位图。 如果尝试将此属性设置为无效值，则运行时会将此值设置为 BlendMode.NORMAL。
         * @member {string} egret.DisplayObject#blendMode
         */
        blendMode: string;
        /**
         * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
         *  @member {egret.Rectangle} egret.DisplayObject#scrollRect
         */
        scrollRect: Rectangle;
        _setScrollRect(value: Rectangle): void;
        /**
         * 测量宽度
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         */
        measuredWidth: number;
        /**
         * 测量高度
         * @returns {number}
         * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
         */
        measuredHeight: number;
        /**
         * 显式设置宽度
         * @returns {number}
         */
        explicitWidth: number;
        /**
         * 显式设置高度
         * @returns {number}
         */
        explicitHeight: number;
        /**
         * 表示显示对象的宽度，以像素为单位。
         * 宽度是根据显示对象内容的范围来计算的。优先顺序为 显式设置宽度 > 测量宽度。
         * @member {number} egret.DisplayObject#width
         * @returns {number}
         */
        width: number;
        _getWidth(): number;
        /**
         * 表示显示对象的高度，以像素为单位。
         * 高度是根据显示对象内容的范围来计算的。优先顺序为 显式设置高度 > 测量高度。
         * @member {number} egret.DisplayObject#height
         * @returns {number}
         */
        height: number;
        _getHeight(): number;
        /**
         * @inheritDoc
         */
        _setWidth(value: number): void;
        /**
         * @inheritDoc
         */
        _setHeight(value: number): void;
        /**
         * 调用显示对象被指定的 mask 对象遮罩。
         * 要确保当舞台缩放时蒙版仍然有效，mask 显示对象必须处于显示列表的活动部分。但不绘制 mask 对象本身。
         * 将 mask 设置为 null 可删除蒙版。
         */
        mask: Rectangle;
        /**
         * @private
         */
        worldAlpha: number;
        /**
         * @private
         * @param renderContext
         */
        _draw(renderContext: RendererContext): void;
        private static color;
        private static colorMatrixFilter;
        _setGlobalFilters(renderContext: RendererContext): void;
        _removeGlobalFilters(renderContext: RendererContext): void;
        _hasFilters(): boolean;
        _pushMask(renderContext: RendererContext): void;
        _popMask(renderContext: RendererContext): void;
        /**
         * @private
         */
        private drawCacheTexture(renderContext);
        /**
         * 强制每帧执行_draw函数
         * @public
         * @member {string} egret.DisplayObject#blendMode
         */
        needDraw: boolean;
        /**
         * @private
         * @param renderContext
         */
        _updateTransform(): void;
        /**
         * 计算全局数据
         * @private
         */
        _calculateWorldTransform(): void;
        /**
         * @private
         * @param renderContext
         */
        _render(renderContext: RendererContext): void;
        /**
         * 获取显示对象的测量边界
         * @method egret.DisplayObject#getBounds
         * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
         * @param calculateAnchor {boolean} 可选参数，是否会计算锚点。
         * @returns {Rectangle}
         */
        getBounds(resultRect?: Rectangle, calculateAnchor?: boolean): egret.Rectangle;
        private destroyCacheBounds();
        /**
         * @private
         * @returns {Matrix}
         */
        private static identityMatrixForGetConcatenated;
        _getConcatenatedMatrix(): egret.Matrix;
        /**
         * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
         * 此方法允许您将任何给定的 x 和 y 坐标从相对于特定显示对象原点 (0,0) 的值（本地坐标）转换为相对于舞台原点的值（全局坐标）。
         * @method egret.DisplayObject#localToGlobal
         * @param x {number} 本地x坐标
         * @param y {number} 本地y坐标
         * @param resultPoint {Point} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
         * @returns {egret.Point} 具有相对于舞台的坐标的 Point 对象。
         */
        localToGlobal(x?: number, y?: number, resultPoint?: Point): Point;
        /**
         * 将指定舞台坐标（全局）转换为显示对象（本地）坐标。
         * @method egret.DisplayObject#globalToLocal
         * @param x {number} 全局x坐标
         * @param y {number} 全局y坐标
         * @param resultPoint {Point} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
         * @returns {egret.Point} 具有相对于显示对象的坐标的 Point 对象。
         */
        globalToLocal(x?: number, y?: number, resultPoint?: Point): Point;
        /**
         * 检测指定坐标是否在显示对象内
         * @method egret.DisplayObject#hitTest
         * @param x {number} 检测坐标的x轴
         * @param y {number} 检测坐标的y轴
         * @param ignoreTouchEnabled {boolean} 是否忽略 touchEnabled 属性
         * @returns {*}
         */
        hitTest(x: number, y: number, ignoreTouchEnabled?: boolean): DisplayObject;
        /**
         * 计算显示对象，以确定它是否与 x 和 y 参数指定的点重叠或相交。x 和 y 参数指定舞台的坐标空间中的点，而不是包含显示对象的显示对象容器中的点（除非显示对象容器是舞台）。
         * 注意，不要在大量物体中使用精确碰撞像素检测，这会带来巨大的性能开销
         * @method egret.DisplayObject#hitTestPoint
         * @param x {number}  要测试的此对象的 x 坐标。
         * @param y {number}  要测试的此对象的 y 坐标。
         * @param shapeFlag {boolean} 是检查对象 (true) 的实际像素，还是检查边框 (false) 的实际像素。
         * @returns {boolean} 如果显示对象与指定的点重叠或相交，则为 true；否则为 false。
         * @platform Web
         */
        hitTestPoint(x: number, y: number, shapeFlag?: boolean): boolean;
        _getMatrix(parentMatrix?: Matrix): Matrix;
        _getSize(resultRect: Rectangle): Rectangle;
        /**
         * 测量显示对象坐标与大小
         */
        _measureSize(resultRect: Rectangle): egret.Rectangle;
        /**
         * 测量显示对象坐标，这个方法需要子类重写
         * @returns {egret.Rectangle}
         * @private
         */
        _measureBounds(): egret.Rectangle;
        _getOffsetPoint(): egret.Point;
        _onAddToStage(): void;
        _onRemoveFromStage(): void;
        /**
         * 显示对象的舞台。
         * 例如，您可以创建多个显示对象并加载到显示列表中，每个显示对象的 stage 属性是指相同的 Stage 对象。
         * 如果显示对象未添加到显示列表，则其 stage 属性会设置为 null。
         * @member {number} egret.DisplayObject#stage
         * @returns {egret.Stage}
         */
        stage: Stage;
        static _enterFrameCallBackList: Array<any>;
        static _renderCallBackList: Array<any>;
        /**
         * @inheritDoc
         */
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * @inheritDoc
         */
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**
         * @inheritDoc
         */
        dispatchEvent(event: Event): boolean;
        _dispatchPropagationEvent(event: Event, list: Array<DisplayObject>, targetIndex?: number): void;
        /**
         * @inheritDoc
         */
        willTrigger(type: string): boolean;
        /**
         * 如果设置为 true，则 egret 运行时将缓存显示对象的内部位图表示形式。此缓存可以提高包含复杂矢量内容的显示对象的性能。
         * 具有已缓存位图的显示对象的所有矢量数据都将被绘制到位图而不是主显示。像素按一对一与父对象进行映射。如果位图的边界发生更改，则将重新创建位图而不会拉伸它。
         * 除非将 cacheAsBitmap 属性设置为 true，否则不会创建内部位图。
         * @member {number} egret.DisplayObject#cacheAsBitmap
         */
        cacheAsBitmap: boolean;
        /**
         * @private
         */
        renderTexture: RenderTexture;
        _makeBitmapCache(): boolean;
        _setCacheDirty(dirty?: boolean): void;
        /**
         * @private
         */
        static getTransformBounds(bounds: egret.Rectangle, mtx: egret.Matrix): egret.Rectangle;
        /**
         * @private
         */
        filters: Array<Filter>;
        private _transform;
        /**
         * @private
         */
        transform: Transform;
    }
}

declare module egret {
    /**
     * @extends egret.DisplayObject
     * @class egret.DisplayObjectContainer
     * @classdesc
     * DisplayObjectContainer 类是可用作显示列表中显示对象容器的所有对象的基类。
     * 该显示列表管理运行时中显示的所有对象。使用 DisplayObjectContainer 类排列显示列表中的显示对象。每个 DisplayObjectContainer 对象都有自己的子级列表，用于组织对象的 Z 轴顺序。Z 轴顺序是由前至后的顺序，可确定哪个对象绘制在前，哪个对象绘制在后等。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=108&terms1_id=25&terms2_id=28 显示容器的概念与实现
     * @includeExample egret/display/DisplayObjectContainer.ts
     */
    class DisplayObjectContainer extends DisplayObject {
        static __EVENT__ADD_TO_STAGE_LIST: Array<DisplayObject>;
        static __EVENT__REMOVE_FROM_STAGE_LIST: Array<DisplayObject>;
        /**
         * 创建一个 egret.DisplayObjectContainer 对象
         */
        constructor();
        _touchChildren: boolean;
        /**
         * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
         * 默认值为 true 即可以接收。
         * @member {boolean} egret.DisplayObjectContainer#touchChildren
         */
        touchChildren: boolean;
        _children: Array<DisplayObject>;
        /**
         * 返回此对象的子项数目。
         * @member {number} egret.DisplayObjectContainer#numChildren
         */
        numChildren: number;
        /**
         * 更改现有子项在显示对象容器中的位置。这会影响子对象的分层。
         * @method egret.DisplayObjectContainer#setChildIndex
         * @param child {egret.DisplayObject} 要为其更改索引编号的 DisplayObject 子实例。
         * @param index {number} 生成的 child 显示对象的索引编号。当新的索引编号小于0或大于已有子元件数量时，新加入的DisplayObject对象将会放置于最上层。
         */
        setChildIndex(child: DisplayObject, index: number): void;
        private doSetChildIndex(child, index);
        /**
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。子项将被添加到该 DisplayObjectContainer 实例中其他所有子项的前（上）面。（要将某子项添加到特定索引位置，请使用 addChildAt() 方法。）
         * @method egret.DisplayObjectContainer#addChild
         * @param child {egret.DisplayObject} 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
         * @returns {egret.DisplayObject} 在 child 参数中传递的 DisplayObject 实例。
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。该子项将被添加到指定的索引位置。索引为 0 表示该 DisplayObjectContainer 对象的显示列表的后（底）部。如果索引值为-1，则表示该DisplayObjectContainer 对象的显示列表的前（上）部。
         * @method egret.DisplayObjectContainer#addChildAt
         * @param child {egret.DisplayObject} 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
         * @param index {number} 添加该子项的索引位置。 如果指定当前占用的索引位置，则该位置以及所有更高位置上的子对象会在子级列表中上移一个位置。
         * @returns {egret.DisplayObject} 在 child 参数中传递的 DisplayObject 实例。
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        _doAddChild(child: DisplayObject, index: number, notifyListeners?: boolean): DisplayObject;
        /**
         * 将一个 DisplayObject 子实例从 DisplayObjectContainer 实例中移除。
         * @method egret.DisplayObjectContainer#removeChild
         * @param child {egret.DisplayObject} 要删除的 DisplayObject 实例。
         * @returns {egret.DisplayObject} 在 child 参数中传递的 DisplayObject 实例。
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         * 从 DisplayObjectContainer 的子列表中指定的 index 位置删除子 DisplayObject。
         * @method egret.DisplayObjectContainer#removeChildAt
         * @param index {number} 要删除的 DisplayObject 的子索引。
         * @returns {egret.DisplayObject} 已删除的 DisplayObject 实例。
         */
        removeChildAt(index: number): DisplayObject;
        _doRemoveChild(index: number, notifyListeners?: boolean): DisplayObject;
        /**
         * 返回位于指定索引处的子显示对象实例。
         * @method egret.DisplayObjectContainer#getChildAt
         * @param index {number} 子对象的索引位置。
         * @returns {egret.DisplayObject} 位于指定索引位置处的子显示对象。
         */
        getChildAt(index: number): DisplayObject;
        /**
         * 确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身。搜索包括整个显示列表（其中包括此 DisplayObjectContainer 实例）。孙项、曾孙项等，每项都返回 true。
         * @method egret.DisplayObjectContainer#contains
         * @param child {egret.DisplayObject} 要测试的子对象。
         * @returns {boolean} 如果指定的显示对象为DisplayObjectContainer该实例本身，则返回true，如果指定的显示对象为当前实例子项，则返回false。
         */
        contains(child: DisplayObject): boolean;
        /**
         * 在子级列表中两个指定的索引位置，交换子对象的 Z 轴顺序（前后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
         * @method egret.DisplayObjectContainer#swapChildrenAt
         * @param index1 {number} 第一个子对象的索引位置。
         * @param index2 {number} 第二个子对象的索引位置。
         */
        swapChildrenAt(index1: number, index2: number): void;
        /**
         * 交换两个指定子对象的 Z 轴顺序（从前到后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
         * @method egret.DisplayObjectContainer#swapChildren
         * @param child1 {egret.DisplayObject} 第一个子对象。
         * @param child2 {egret.DisplayObject} 第二个子对象。
         */
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        private _swapChildrenAt(index1, index2);
        /**
         * 返回 DisplayObject 的 child 实例的索引位置。
         * @method egret.DisplayObjectContainer#getChildIndex
         * @param child {egret.DisplayObject} 要标识的 DisplayObject 实例。
         * @returns {number} 要标识的子显示对象的索引位置。
         */
        getChildIndex(child: egret.DisplayObject): number;
        /**
         * 从 DisplayObjectContainer 实例的子级列表中删除所有 child DisplayObject 实例。
         * @method egret.DisplayObjectContainer#removeChildren
         */
        removeChildren(): void;
        _updateTransform(): void;
        _render(renderContext: RendererContext): void;
        /**
         * @see egret.DisplayObject._measureBounds
         * @returns {null}
         * @private
         */
        _measureBounds(): egret.Rectangle;
        /**
         * 检测指定坐标是否在显示对象内
         * @method egret.DisplayObjectContainer#hitTest
         * @see egret.DisplayObject.hitTest
         * @param x {number} 检测坐标的x轴
         * @param y {number} 检测坐标的y轴
         * @param ignoreTouchEnabled {boolean} 是否忽略TouchEnabled
         * @returns {egret.DisplayObject} 返回所发生碰撞的DisplayObject对象
         */
        hitTest(x: number, y: number, ignoreTouchEnabled?: boolean): DisplayObject;
        _onAddToStage(): void;
        _onRemoveFromStage(): void;
        /**
         * 返回具有指定名称的子显示对象。
         * @method egret.DisplayObjectContainer#getChildByName
         * @param name {string} 要返回的子项的名称。
         * @returns {egret.DisplayObject} 具有指定名称的子显示对象。
         */
        getChildByName(name: string): DisplayObject;
    }
}

declare module egret {
    /**
     * @classdesc
     * StageScaleMode 类为 Stage.scaleMode 属性提供值。
     * @class egret.StageScaleMode
     * @includeExample egret/display/StageScaleMode.ts
     */
    class StageScaleMode {
        /**
         * 指定整个应用程序填满指定区域，不会发生扭曲，但有可能会进行一些裁切，同时保持应用程序的原始高宽比。
         * @member {string} egret.StageScaleMode.NO_BORDER
         */
        static NO_BORDER: string;
        /**
         * 指定应用程序的大小是固定的，因此，即使在更改播放器窗口大小时，它仍然保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
         * @member {string} egret.StageScaleMode.NO_SCALE
         */
        static NO_SCALE: string;
        /**
         * 指定整个应用程序在指定区域中可见，且不会发生扭曲，同时保持应用程序的原始高宽比。应用程序的两侧可能会显示边框。
         * @member {string} egret.StageScaleMode.SHOW_ALL
         */
        static SHOW_ALL: string;
        /**
         * 指定整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲。
         * @member {string} egret.StageScaleMode.EXACT_FIT
         */
        static EXACT_FIT: string;
    }
}

declare module egret {
    /**
     * @class egret.Stage
     * @classdesc
     * * Stage 类代表主绘图区，表示显示 Egret 内容的整个区域。
     * 可以以全局方式访问 Stage 对象(egret.MainContext.instance.stage)。也可以利用 DisplayObject 实例的 stage 属性进行访问。
     * Stage 类具有多个祖代类 -- DisplayObjectContainer、DisplayObject 和 EventDispatcher，属性和方法便是从这些类继承而来的。从这些继承的许多属性和方法不适用于 Stage 对象。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=202&terms1_id=59&terms2_id=69 深入了解屏幕适配
     * @includeExample egret/display/Stage.ts
     */
    class Stage extends DisplayObjectContainer {
        static _invalidateRenderFlag: boolean;
        /**
         * 是否会派发 RESIZE 事件
         */
        _changeSizeDispatchFlag: boolean;
        /**
         * 调用 invalidate() 方法后，在显示列表下次呈现时，Egret 会向每个已注册侦听 render 事件的显示对象发送一个 render 事件。
         * 每次您希望 Egret 发送 render 事件时，都必须调用 invalidate() 方法。
         * @method egret.Stage#invalidate
         */
        invalidate(): void;
        /**
         * 创建一个 egret.Stage 对象
         * @param width {number} 舞台宽度
         * @param height {number} 舞台高度
         */
        constructor(width?: number, height?: number);
        private _scaleMode;
        /**
         * 屏幕适配策略，可以通过 egret.Stage.registerScaleMode 方法扩展
         * 一个 StageScaleMode 类中指定要使用哪种缩放模式的值。以下是有效值：
         * StageScaleMode.EXACT_FIT -- 整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲，应用程序可能会拉伸或压缩显示。
         * StageScaleMode.SHOW_ALL -- 整个应用程序在指定区域中可见，且不发生扭曲，同时保持应用程序的原始高宽比。应用程序的可能会显示边框。
         * StageScaleMode.NO_BORDER -- 整个应用程序填满指定区域，不发生扭曲，但有可能进行一些裁切，同时保持应用程序的原始高宽比。
         * StageScaleMode.NO_SCALE -- 整个应用程序的大小固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。
         * @member {number} egret.Stage#scaleMode
         */
        scaleMode: string;
        private _orientation;
        /**
         * 屏幕显示方式
         * 一个 egret.OrientationMode 类中指定要使用哪种显示方式。以下是有效值：
         * egret.OrientationMode.AUTO -- 应用始终跟随屏幕的方向显示，始终保证由上往下看。
         * egret.OrientationMode.PORTRAIT -- 应用始终保持竖屏模式，即横屏看时，屏幕由左往右看。
         * egret.OrientationMode.LANDSCAPE -- 应用始终保持横屏模式，即竖屏看时，屏幕显示由右往左。
         * egret.OrientationMode.LANDSCAPE_FLIPPED -- 应用始终保持横屏模式，即竖屏看时，屏幕显示由左往右。
         * @platform Web
         * @version 2.4
         */
        orientation: string;
        /**
         * 当屏幕尺寸改变时调用
         * @method egret.Stage#changeSize
         */
        changeSize(): void;
        /**
         * 设置屏幕适配策略
         */
        $setResolutionPolicy(): void;
        private _stageWidth;
        /**
         * 舞台宽度（坐标系宽度，非设备宽度）
         * @member {number} egret.Stage#stageWidth
         */
        stageWidth: number;
        private _stageHeight;
        /**
         * 舞台高度（坐标系高度，非设备高度）
         * @member {number} egret.Stage#stageHeight
         */
        stageHeight: number;
        private _frameRate;
        /**
         * 获取并设置舞台的帧速率。帧速率是指每秒显示的帧数。
         * 注意：需设置为可以被60整除的数
         * @member {number} egret.Stage#frameRate
         */
        frameRate: number;
        /**
         * @member egret.Stage#hitTest
         * @see egret.DisplayObject#hitTest
         * @param x
         * @param y
         * @returns {egret.DisplayObject}
         * @private
         */
        hitTest(x: any, y: any, ignoreTouchEnabled?: boolean): DisplayObject;
        /**
         * 返回舞台尺寸范围
         * @member egret.Stage#getBounds
         * @see egret.DisplayObject#getBounds
         * @param resultRect {egret.Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
         * @returns {egret.Rectangle}
         */
        getBounds(resultRect?: Rectangle): Rectangle;
        _updateTransform(): void;
        /**
         * @private
         */
        focus: DisplayObject;
        /**
         * @private
         */
        static SCALE_MODE_ENUM: any;
        /**
         * 设置屏幕适配模式
         * @param key {string} 键值
         * @param value {egret.ContentStrategy} 适配模式
         * @param override {boolean} 是否覆盖
         * @method egret.Stage#registerScaleMode
         * @private
         */
        static registerScaleMode(key: string, value: ContentStrategy, override?: boolean): void;
    }
}

declare module egret {
    /**
     * @private
     */
    class ScrollViewProperties {
        _verticalScrollPolicy: string;
        _horizontalScrollPolicy: string;
        _scrollLeft: number;
        _scrollTop: number;
        _hCanScroll: boolean;
        _vCanScroll: boolean;
        _lastTouchPosition: egret.Point;
        _touchStartPosition: egret.Point;
        _scrollStarted: boolean;
        _lastTouchTime: number;
        _lastTouchEvent: TouchEvent;
        _velocitys: Array<{
            x: number;
            y: number;
        }>;
        _isHTweenPlaying: boolean;
        _isVTweenPlaying: boolean;
        _hScrollTween: Tween;
        _vScrollTween: Tween;
        _bounces: boolean;
    }
}

declare module egret {
    /**
     * @class egret.ScrollView
     * @classdesc
     * ScrollView 是用于滑动的辅助类，将一个显示对象传入构造函数即可。可以在指定的尺寸范围内显示超过该范围的显示对象。并可以在此范围内随意拖动。
     * @extends egret.DisplayObjectContainer
     * @includeExample egret/display/ScrollView.ts
     */
    class ScrollView extends DisplayObjectContainer {
        _ScrV_Props_: ScrollViewProperties;
        /**
         * 开始滚动的阈值，当触摸点偏离初始触摸点的距离超过这个值时才会触发滚动
         * @member {number} egret.ScrollView#scrollBeginThreshold
         */
        scrollBeginThreshold: number;
        /**
         * 滚动速度，这个值为需要的速度与默认速度的比值。
         * 取值范围为 scrollSpeed > 0 赋值为 2 时，速度是默认速度的 2 倍
         * @member {number} egret.ScrollView#scrollSpeed
         */
        scrollSpeed: number;
        /**
         * 是否启用回弹，当启用回弹后，ScrollView中内容在到达边界后允许继续拖动，在用户拖动操作结束后，再反弹回边界位置
         * @default true
         * @version Egret 2.4
         */
        bounces: boolean;
        /**
         * 创建一个 egret.ScrollView 对象
         * @method egret.ScrollView#constructor
         * @param content {egret.DisplayObject} 需要滚动的对象
         */
        constructor(content?: DisplayObject);
        _content: DisplayObject;
        /**
         * 设置需要滚动的对象
         * @method egret.ScrollView#setContent
         * @param content {egret.DisplayObject} 需要滚动的对象
         */
        setContent(content: DisplayObject): void;
        /**
         * 移除滚动的对象
         * @method egret.ScrollView#removeContent
         */
        removeContent(): void;
        /**
         * 垂直滚动条显示策略，on/off/auto。
         * @member egret.ScrollView#verticalScrollPolicy
         */
        verticalScrollPolicy: string;
        /**
         * 水平滚动条显示策略，on/off/auto。
         * @member egret.ScrollView#horizontalScrollPolicy
         */
        horizontalScrollPolicy: string;
        /**
         * 获取或设置水平滚动位置,
         * @member {number} egret.ScrollView#scrollLeft
         * @returns {number}
         */
        scrollLeft: number;
        /**
         * 获取或设置垂直滚动位置,
         * @member {number} egret.ScrollView#scrollTop
         * @returns {number}
         */
        scrollTop: number;
        /**
         * 设置滚动位置
         * @method egret.ScrollView#setScrollPosition
         * @param top {number} 垂直滚动位置
         * @param left {number} 水平滚动位置
         * @param isOffset {boolean} 可选参数，默认是false，是否是滚动增加量，如 top=1 代表往上滚动1像素
         */
        setScrollPosition(top: number, left: number, isOffset?: boolean): void;
        private _validatePosition(top?, left?);
        /**
         * @inheritDoc
         */
        _setWidth(value: number): void;
        /**
         * @inheritDoc
         */
        _setHeight(value: number): void;
        _updateContentPosition(): void;
        _checkScrollPolicy(): boolean;
        private __checkScrollPolicy(policy, contentLength, viewLength);
        _addEvents(): void;
        _removeEvents(): void;
        _onTouchBegin(e: TouchEvent): void;
        private delayTouchBeginEvent;
        private touchBeginTimer;
        _onTouchBeginCapture(event: TouchEvent): void;
        private _onTouchEndCapture(event);
        private _onTouchBeginTimer();
        private dispatchPropagationEvent(event);
        _dispatchPropagationEvent(event: Event, list: Array<DisplayObject>, targetIndex?: number): void;
        _onTouchMove(event: TouchEvent): void;
        _onTouchEnd(event: TouchEvent): void;
        _onEnterFrame(event: Event): void;
        private _logTouchEvent(e);
        private _getPointChange(e);
        private _calcVelocitys(e);
        _getContentWidth(): number;
        _getContentHeight(): number;
        /**
         * @private
         */
        getMaxScrollLeft(): number;
        /**
         * @private
         */
        getMaxScrollTop(): number;
        private static weight;
        private _moveAfterTouchEnd();
        _onTweenFinished(tw: Tween): void;
        _onScrollStarted(): void;
        _onScrollFinished(): void;
        /**
         * @private
         */
        setScrollTop(scrollTop: number, duration?: number): egret.Tween;
        /**
         * @private
         */
        setScrollLeft(scrollLeft: number, duration?: number): egret.Tween;
        private getAnimationDatas(pixelsPerMS, curPos, maxPos);
        private cloneTouchEvent(event);
        private throwNotSupportedError();
        /**
         * @private
         * @method egret.ScrollView#addChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         * @private
         * @method egret.ScrollView#addChildAt
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
         * @private
         * @method egret.ScrollView#removeChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         * @private
         * @method egret.ScrollView#removeChildAt
         * @deprecated
         * @param index {number}
         * @returns {DisplayObject}
         */
        removeChildAt(index: number): DisplayObject;
        /**
         * @private
         * @method egret.ScrollView#setChildIndex
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         */
        setChildIndex(child: DisplayObject, index: number): void;
        /**
         * @private
         * @method egret.ScrollView#swapChildren
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         */
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
         * @private
         * @method egret.ScrollView#swapChildrenAt
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         */
        swapChildrenAt(index1: number, index2: number): void;
        /**
         * @inheritDoc
         */
        hitTest(x: number, y: number, ignoreTouchEnabled?: boolean): DisplayObject;
    }
}

declare module egret {
    /**
     * @class egret.BitmapFillMode
     * @classdesc
     * BitmapFillMode 类定义Bitmap的图像填充方式。
     * BitmapFillMode 类定义了调整大小模式的一个枚举，这些模式确定 Bitmap 如何填充由布局系统指定的尺寸。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=134&terms1_id=25&terms2_id=31 纹理的填充方式
     * @includeExample egret/display/BitmapFillMode.ts
     */
    class BitmapFillMode {
        /**
         * 重复位图以填充区域。
         * @constant {string} egret.BitmapFillMode.REPEAT
         */
        static REPEAT: string;
        /**
         * 位图填充拉伸以填充区域。
         * @constant {string} egret.BitmapFillMode.SCALE
         */
        static SCALE: string;
    }
}

declare module egret {
    /**
     * @class egret.Bitmap
     * @classdesc
     * Bitmap 类表示用于表示位图图像的显示对象。这些图像可以是使用 Bitmap() 构造函数创建的图像。
     * 利用 Bitmap() 构造函数，可以创建包含对 Texture 对象的引用的 Bitmap 对象。创建了 Bitmap 对象后，使用父 DisplayObjectContainer 实例的 addChild() 或 addChildAt() 方法将位图放在显示列表中。
     * 一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 Texture 引用，与转换属性或旋转属性无关。由于能够创建引用相同 Texture 对象的多个 Bitmap 对象，因此，多个显示对象可以使用相同的复杂 Texture 对象，而不会因为每个显示对象实例使用一个 Texture 对象而产生内存开销。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=132&terms1_id=25&terms2_id=31&t3_id=132 创建位图
     * @extends egret.DisplayObject
     * @includeExample egret/display/Bitmap.ts
     */
    class Bitmap extends DisplayObject {
        private static renderFilter;
        /**
         * 创建一个 egret.Bitmap 对象以引用指定的 Texture 对象
         * @param texture {Texture} 纹理
         */
        constructor(texture?: Texture);
        private _texture;
        /**
         * 渲染纹理
         * @member {egret.Texture} egret.Bitmap#texture
         */
        texture: Texture;
        /**
         * 矩形区域，它定义位图对象的九个缩放区域。此属性仅当fillMode为BitmapFillMode.SCALE时有效。
         * scale9Grid的x、y、width、height分别代表九宫图中中间那块的左上点的x、y以及中间方块的宽高。
         * @member {egret.Rectangle} egret.Bitmap#scale9Grid
         */
        scale9Grid: Rectangle;
        /**
         * 确定位图填充尺寸的方式。
         * 设置为 BitmapFillMode.REPEAT时，位图将重复以填充区域；BitmapFillMode.SCALE时，位图将拉伸以填充区域。
         * 默认值：BitmapFillMode.SCALE。
         * @member {string} egret.Bitmap#fillMode
         */
        fillMode: string;
        _render(renderContext: RendererContext): void;
        static _drawBitmap(renderContext: RendererContext, destW: number, destH: number, thisObject: any): void;
        /**
         * 绘制平铺位图
         */
        private static drawRepeatImage(renderContext, data, destWidth, destHeight, repeat);
        /**
         * 绘制九宫格位图
         */
        private static drawScale9GridImage(renderContext, data, scale9Grid, destWidth, destHeight);
        /**
         * @see egret.DisplayObject.measureBounds
         * @returns {egret.Rectangle}
         * @private
         */
        _measureBounds(): egret.Rectangle;
    }
}

declare module egret {
    /**
     * @classdesc
     * @class egret.BitmapText
     * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字。
     * @extends egret.DisplayObject
     * @includeExample egret/text/BitmapText.ts
     */
    class BitmapText extends DisplayObject {
        /**
         * 创建一个 egret.BitmapText 对象
         */
        constructor();
        /**
         * 设置文本
         */
        private _text;
        private _textChanged;
        /**
         * 显示的文本内容
         * @member {string} egret.BitmapText#text
         */
        text: string;
        $setText(value: string): void;
        _font: BitmapFont;
        private _fontChanged;
        /**
         * BitmapFont对象，缓存了所有文本的位图纹理
         * @member {egret.BitmapFont} egret.BitmapText#font
         */
        font: BitmapFont;
        $setFont(value: BitmapFont): void;
        _letterSpacing: number;
        /**
         * 字符之间的距离
         * @default 0
         * @version 1.7.2
         * @param value
         */
        letterSpacing: number;
        _setLetterSpacing(value: number): void;
        _lineSpacing: number;
        /**
         * 行与行之间的距离
         * @default 0
         * @version 1.7.2
         * @param value
         */
        lineSpacing: number;
        _setLineSpacing(value: number): void;
        _setSizeDirty(): void;
        /**
         * @private
         */
        static EMPTY_FACTOR: number;
        _render(renderContext: RendererContext): void;
        _measureBounds(): egret.Rectangle;
        private _textWidth;
        private _textHeight;
        private _textOffsetX;
        private _textOffsetY;
        private textLinesChange;
        private _textLines;
        _lineHeights: Array<number>;
        _getTextLines(): Array<string>;
    }
}

declare module egret {
    class GradientType {
        /**
         * 用于指定线性渐变填充的值
         * @method egret.GradientType.LINEAR
         */
        static LINEAR: string;
        /**
         * 用于指定放射状渐变填充的值
         * @method egret.GradientType.RADIAL
         */
        static RADIAL: string;
    }
}

declare module egret {
    /**
     * @class egret.Graphics
     * @classdesc
     * Graphics 类包含一组可用来创建矢量形状的方法。支持绘制的显示对象包括 Sprite 和 Shape 对象。这些类中的每一个类都包括 graphics 属性，该属性是一个 Graphics 对象。
     * 以下是为便于使用而提供的一些辅助函数：drawRect()、drawRoundRect()、drawCircle() 和 drawEllipse()。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=136&terms1_id=25&terms2_id=32&t3_id=136  绘制矩形
     * @includeExample egret/display/Graphics.ts
     */
    class Graphics {
        /**
         * 记录下当前fillStyle以便实现渐变色时候获取
         * 注：当前没有考虑save和restore的情况
         * @private
         */
        static _currentFillStyle: any;
        _renderContext: RenderContext;
        private commandQueue;
        private strokeStyle;
        private fillStyle;
        _dirty: boolean;
        private lineX;
        private lineY;
        private _endLineCommand;
        private _endFillCommand;
        /**
         * 创建一个 egret.Graphics 对象
         */
        constructor();
        /**
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * @method egret.Graphics#beginFill
         * @param color {number} 填充的颜色
         * @param alpha {number} 填充的 Alpha 值
         */
        beginFill(color: number, alpha?: number): void;
        _parseColor(color: number, alpha: number): string;
        private _setStyle(fillStyle);
        /**
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * 注：该方法目前仅支持H5 Canvas
         * @method egret.Graphics#beginFill
         * @param type {string} 用于指定要使用哪种渐变类型的 GradientType 类的值：GradientType.LINEAR 或 GradientType.RADIAL。
         * @param colors {Array} 渐变中使用的 RGB 十六进制颜色值的数组（例如，红色为 0xFF0000，蓝色为 0x0000FF，等等）。对于每种颜色，请在 alphas 和 ratios 参数中指定对应值。
         * @param alphas {Array} colors 数组中对应颜色的 alpha 值数组。
         * @param ratios {Array} 颜色分布比率的数组。
         * @param matrix {egret.Matrix} 一个由 egret.Matrix 类定义的转换矩阵。egret.Matrix 类包括 createGradientBox() 方法，通过该方法可以方便地设置矩阵，以便与 beginGradientFill() 方法一起使用
         * @platform Web
         */
        beginGradientFill(type: string, colors: Array<number>, alphas: Array<number>, ratios: Array<number>, matrix?: egret.Matrix): void;
        private getGradient(type, colors, alphas, ratios, matrix);
        /**
         * 绘制一个矩形
         * @method egret.Graphics#drawRect
         * @param x {number} 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y {number} 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width {number} 矩形的宽度（以像素为单位）。
         * @param height {number} 矩形的高度（以像素为单位）。
         */
        drawRect(x: number, y: number, width: number, height: number): void;
        /**
         * 绘制一个圆。
         * @method egret.Graphics#drawCircle
         * @param x {number} 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y {number} 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param r {number} 圆的半径（以像素为单位）。
         */
        drawCircle(x: number, y: number, r: number): void;
        /**
         * 绘制一个圆角矩形
         * @method egret.Graphics#drawRoundRect
         * @param x {number} 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y {number} 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width {number} 矩形的宽度（以像素为单位）。
         * @param height {number} 矩形的高度（以像素为单位）。
         * @param ellipseWidth {number} 用于绘制圆角的椭圆的宽度（以像素为单位）。
         * @param ellipseHeight {number} 用于绘制圆角的椭圆的高度（以像素为单位）。 （可选）如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
         */
        drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight?: number): void;
        /**
         * 绘制一个椭圆。
         * @method egret.Graphics#drawEllipse
         * @param x {number} 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y {number} 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @param width {number} 矩形的宽度（以像素为单位）。
         * @param height {number} 矩形的高度（以像素为单位）。
         */
        drawEllipse(x: number, y: number, width: number, height: number): void;
        /**
         * 指定一种线条样式以用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
         * @method egret.Graphics#lineStyle
         * @param thickness {number} 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
         * @param color {number} 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
         * @param alpha {number} 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
         * @param pixelHinting {boolean} 布尔型值，指定是否提示笔触采用完整像素。它同时影响曲线锚点的位置以及线条笔触大小本身。在 pixelHinting 设置为 true 的情况下，线条宽度会调整到完整像素宽度。在 pixelHinting 设置为 false 的情况下，对于曲线和直线可能会出现脱节。暂未实现。
         * @param scaleMode {string} 用于指定要使用的比例模式。暂未实现。
         * @param caps {string} 用于指定线条末端处端点类型的 CapsStyle 类的值。暂未实现。
         * @param joints {string} 指定用于拐角的连接外观的类型。暂未实现。
         * @param miterLimit {number} 用于表示剪切斜接的极限值的数字。暂未实现。
         */
        lineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number): void;
        /**
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。
         * @method egret.Graphics#lineTo
         * @param x {number} 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y {number} 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         */
        lineTo(x: number, y: number): void;
        /**
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。当前绘图位置随后设置为 (anchorX, anchorY)。
         * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法，则当前绘图位置的默认值为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * 绘制的曲线是二次贝塞尔曲线。二次贝塞尔曲线包含两个锚点和一个控制点。该曲线内插这两个锚点，并向控制点弯曲。
         * @method egret.Graphics#curveTo
         * @param controlX {number} 一个数字，指定控制点相对于父显示对象注册点的水平位置。
         * @param controlY {number} 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
         * @param anchorX {number} 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
         * @param anchorY {number} 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
         */
        curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        /**
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。三次贝塞尔曲线由两个锚点和两个控制点组成。该曲线内插这两个锚点，并向两个控制点弯曲。
         * @method egret.Graphics#curveTo
         * @param controlX1 {number} 指定首个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY1 {number} 指定首个控制点相对于父显示对象的注册点的垂直位置。
         * @param controlX2 {number} 指定第二个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY2 {number} 指定第二个控制点相对于父显示对象的注册点的垂直位置。
         * @param anchorX {number} 指定锚点相对于父显示对象的注册点的水平位置。
         * @param anchorY {number} 指定锚点相对于父显示对象的注册点的垂直位置。
         */
        cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        /**
         * 将当前绘图位置移动到 (x, y)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * @method egret.Graphics#moveTo
         * @param x {number} 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y {number} 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         */
        moveTo(x: number, y: number): void;
        /**
         * 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。
         * @method egret.Graphics#clear
         */
        clear(): void;
        /**
         * 对从上一次调用 beginFill()方法之后添加的直线和曲线应用填充。
         * @method egret.Graphics#endFill
         */
        endFill(): void;
        _beginDraw(renderContext: RendererContext): void;
        _endDraw(renderContext: RendererContext): void;
        _draw(renderContext: RendererContext): void;
        private _firstCheck;
        private _minX;
        private _minY;
        private _maxX;
        private _maxY;
        _checkRect(x: number, y: number, w: number, h: number): void;
        private _lastX;
        private _lastY;
        _checkPoint(x: number, y: number): void;
        _measureBounds(): egret.Rectangle;
        private _createEndFillCommand();
        private _fill();
        private _createEndLineCommand();
        private _pushCommand(cmd);
    }
}

declare module egret {
    /**
     * @class egret.Shape
     * @classdesc 此类用于使用 Egret 绘图应用程序编程接口 (API) 创建简单形状。Shape 类包括 graphics 属性，该属性使您可以从 Graphics 类访问方法。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=136&terms1_id=25&terms2_id=32 Shape绘制矢量图
     * @includeExample egret/display/Shape.ts
     */
    class Shape extends egret.DisplayObject {
        /**
         * 创建一个 egret.Shape 对象
         */
        constructor();
        private _graphics;
        /**
         * 获取 Shape 中的 Graphics 对象。
         * @member {egret.Graphics} egret.Shape#graphics
         */
        graphics: Graphics;
        _draw(renderContext: RendererContext): void;
        _render(renderContext: RendererContext): void;
        _measureBounds(): egret.Rectangle;
    }
}

declare module egret {
    /**
     * @extends egret.DisplayObjectContainer
     * @class egret.Sprite
     * @classdesc Sprite 类是基本显示列表构造块：一个可显示图形并且也可包含子项的显示列表节点。Sprite 对象与影片剪辑类似，但没有时间轴。Sprite 是不需要时间轴的对象的相应基类。例如，Sprite 将是通常不使用时间轴的用户界面 (UI) 组件的逻辑基类。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=102&terms1_id=25&terms2_id=27 显示对象的基本概念
     * @includeExample egret/display/Sprite.ts
     */
    class Sprite extends DisplayObjectContainer {
        /**
         * 创建一个 egret.Sprite 对象
         */
        constructor();
        private _graphics;
        /**
         * 获取 Sprite 中的 Graphics 对象。
         * 指定属于此 sprite 的 Graphics 对象，在此 sprite 中可执行矢量绘图命令。
         * @member {egret.Graphics} egret.Sprite#graphics
         */
        graphics: Graphics;
        _draw(renderContext: RendererContext): void;
        _render(renderContext: RendererContext): void;
        _measureBounds(): egret.Rectangle;
        /**
         * @inheritDoc
         */
        hitTest(x: number, y: number, ignoreTouchEnabled?: boolean): DisplayObject;
    }
}

declare module egret {
    /**
     * @private
     */
    class TextFieldUtils {
        /**
         * 获取第一个绘制的行数
         * @param textfield 文本
         * @returns {number} 行数，从0开始
         * @private
         */
        static _getStartLine(textfield: egret.TextField): number;
        /**
         * 获取水平比例
         * @param textfield 文本
         * @returns {number} 水平比例
         * @private
         */
        static _getHalign(textfield: egret.TextField): number;
        static _getTextHeight(textfield: egret.TextField): number;
        /**
         * 获取垂直比例
         * @param textfield 文本
         * @returns {number} 垂直比例
         * @private
         */
        static _getValign(textfield: egret.TextField): number;
        /**
         * 根据x、y获取文本项
         * @param textfield 文本
         * @param x x坐标值
         * @param y y坐标值
         * @returns 文本单项
         * @private
         */
        static _getTextElement(textfield: egret.TextField, x: number, y: number): ITextElement;
        /**
         * 获取文本点击块
         * @param textfield 文本
         * @param x x坐标值
         * @param y y坐标值
         * @returns 文本点击块
         * @private
         */
        static _getHit(textfield: egret.TextField, x: number, y: number): IHitTextElement;
        /**
         * 获取当前显示多少行
         * @param textfield 文本
         * @returns {number} 显示的行数
         * @private
         */
        static _getScrollNum(textfield: egret.TextField): number;
    }
}

declare module egret {
    /**
     * @private
     */
    class TextFieldProperties {
        _type: string;
        _text: string;
        _displayAsPassword: boolean;
        _fontFamily: string;
        _size: number;
        _italic: boolean;
        _bold: boolean;
        _textColorString: string;
        _textColor: number;
        _strokeColorString: string;
        _strokeColor: number;
        _stroke: number;
        _border: boolean;
        _borderColor: number;
        _background: boolean;
        _backgroundColor: number;
        _textAlign: string;
        _verticalAlign: string;
        _textMaxWidth: number;
        _textMaxHeight: number;
        _maxChars: number;
        _scrollV: number;
        _lineSpacing: number;
        _numLines: number;
        _multiline: boolean;
        _wordWrap: boolean;
        _restrictAnd: string;
        _restrictNot: string;
        constructor();
    }
}

declare module egret {
    /**
     * @private
     */
    interface IHitTextElement {
        lineIndex: number;
        textElementIndex: number;
    }
    /**
     * @private
     */
    interface ITextStyle {
        textColor?: number;
        strokeColor?: number;
        size?: number;
        stroke?: number;
        bold?: boolean;
        italic?: boolean;
        fontFamily?: string;
        href?: string;
    }
    /**
     * 用于建立多种样式混合文本的基本结构，主要用于设置 textFlow 属性
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=146&terms1_id=25&terms2_id=33&t3_id=146 多种样式文本混合
     */
    interface ITextElement {
        /**
         * 文本内容
         */
        text: string;
        /**
         * 文本样式
         */
        style?: ITextStyle;
    }
    /**
     * @private
     */
    interface IWTextElement extends ITextElement {
        width: number;
    }
    /**
     * 文本最终解析的一行数据格式
     * @private
     */
    interface ILineElement {
        /**
         * 文本占用宽度
         */
        width: number;
        /**
         * 文本占用高度
         */
        height: number;
        /**
         * 当前文本字符总数量（包括换行符）
         */
        charNum: number;
        /**
         * 是否含有换行符
         */
        hasNextLine: boolean;
        /**
         * 本行文本内容
         */
        elements: Array<IWTextElement>;
    }
}

declare module egret {
    /**
     * @class egret.TextField
     * @classdesc
     * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
     * 如果开发者希望所有平台完全无差异，请使用BitmapText
     * @extends egret.DisplayObject
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=141&terms1_id=25&terms2_id=33 创建文本
     * @event egret.TextEvent.LINK 点击链接后调度。
     * @includeExample egret/text/TextField.ts
     */
    class TextField extends DisplayObject {
        /**
         * @private
         */
        static default_fontFamily: string;
        private isInput();
        _inputEnabled: boolean;
        _setTouchEnabled(value: boolean): void;
        private _inputUtils;
        /**
         * 文本字段的类型。
         * 以下 TextFieldType 常量中的任一个：TextFieldType.DYNAMIC（指定用户无法编辑的动态文本字段），或 TextFieldType.INPUT（指定用户可以编辑的输入文本字段）。
         * 默认值为 dynamic。
         * @member {string} egret.TextField#type
         */
        type: string;
        _setType(value: string): void;
        /**
         * 作为文本字段中当前文本的字符串
         * @member {string} egret.TextField#text
         */
        text: string;
        _getText(): string;
        _setSizeDirty(): void;
        _setTextDirty(): void;
        _setBaseText(value: string): void;
        _setText(value: string): void;
        /**
         * 指定文本字段是否是密码文本字段。
         * 如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
         * 默认值为 false。
         * @member {boolean} egret.TextInput#displayAsPassword
         */
        displayAsPassword: boolean;
        _setDisplayAsPassword(value: boolean): void;
        /**
         * 使用此文本格式的文本的字体名称，以字符串形式表示。
         * 默认值 Arial。
         * @member {any} egret.TextField#fontFamily
         */
        fontFamily: string;
        _setFontFamily(value: string): void;
        /**
         * 使用此文本格式的文本的大小（以像素为单位）。
         * 默认值为 30。
         * @member {number} egret.TextField#size
         */
        size: number;
        _setSize(value: number): void;
        /**
         * 表示使用此文本格式的文本是否为斜体。
         * 如果值为 true，则文本为斜体；false，则为不使用斜体。
         * 默认值为 false。
         * @member {boolean} egret.TextField#italic
         * @platform Web
         */
        italic: boolean;
        _setItalic(value: boolean): void;
        /**
         * 指定文本是否为粗体字。
         * 如果值为 true，则文本为粗体字；false，则为非粗体字。
         * 默认值为 false。
         * @member {boolean} egret.TextField#bold
         * @platform Web
         */
        bold: boolean;
        _setBold(value: boolean): void;
        /**
         * 表示文本的颜色。
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         * 默认值为 0xFFFFFF。
         * @member {number} egret.TextField#textColor
         */
        textColor: number;
        _setTextColor(value: number): void;
        /**
         * 表示文本的描边颜色。
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         * 默认值为 0x000000。
         * @member {number} egret.TextField#strokeColor
         */
        strokeColor: number;
        _setStrokeColor(value: number): void;
        /**
         * 表示描边宽度。
         * 0为没有描边。
         * 默认值为 0。
         * @member {number} egret.TextField#stroke
         */
        stroke: number;
        _setStroke(value: number): void;
        /**
         * 文本水平对齐方式
         * 使用HorizontalAlign定义的常量。
         * 默认值为 HorizontalAlign.LEFT。
         * @member {string} egret.TextField#textAlign
         */
        textAlign: string;
        _setTextAlign(value: string): void;
        /**
         * 文本垂直对齐方式。
         * 使用VerticalAlign定义的常量。
         * 默认值为 VerticalAlign.TOP。
         * @member {string} egret.TextField#verticalAlign
         */
        verticalAlign: string;
        _setVerticalAlign(value: string): void;
        /**
         * @private
         */
        maxWidth: any;
        /**
         * 文本字段中最多可包含的字符数（即用户输入的字符数）。
         * 脚本可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。
         * 默认值为 0。
         */
        maxChars: number;
        _setMaxChars(value: number): void;
        /**
         * 文本在文本字段中的垂直位置。scrollV 属性可帮助用户定位到长篇文章的特定段落，还可用于创建滚动文本字段。
         * 垂直滚动的单位是行，而水平滚动的单位是像素。
         * 如果显示的第一行是文本字段中的第一行，则 scrollV 设置为 1（而非 0）。
         * @param value
         */
        scrollV: number;
        /**
         * scrollV 的最大值
         * @returns {number}
         */
        maxScrollV: number;
        /**
         * @private
         */
        selectionBeginIndex: number;
        /**
         * @private
         */
        selectionEndIndex: number;
        /**
         * @private
         */
        caretIndex: number;
        _setSelection(beginIndex: number, endIndex: number): void;
        /**
         * 行间距
         * 一个整数，表示行与行之间的垂直间距量。
         * 默认值为 0。
         * @member {number} egret.TextField#lineSpacing
         */
        lineSpacing: number;
        _setLineSpacing(value: number): void;
        _getLineHeight(): number;
        /**
         * 文本行数。
         * @member {number} egret.TextField#numLines
         */
        numLines: number;
        /**
         * 表示字段是否为多行文本字段。注意，此属性仅在type为TextFieldType.INPUT时才有效。
         * 如果值为 true，则文本字段为多行文本字段；如果值为 false，则文本字段为单行文本字段。在类型为 TextFieldType.INPUT 的字段中，multiline 值将确定 Enter 键是否创建新行（如果值为 false，则将忽略 Enter 键）。
         * 默认值为 false。
         * @member {boolean} egret.TextField#multiline
         */
        multiline: boolean;
        _setMultiline(value: boolean): void;
        /**
         * @language en_US
         * Indicates a user can enter into the text field character set. If you restrict property is null, you can enter any character. If you restrict property is an empty string, you can not enter any character. If you restrict property is a string of characters, you can enter only characters in the string in the text field. The string is scanned from left to right. You can use a hyphen (-) to specify a range. Only restricts user interaction; a script may put any text into the text field. <br/>
         * If the string of characters caret (^) at the beginning, all characters are initially accepted, then the string are excluded from receiving ^ character. If the string does not begin with a caret (^) to, any characters are initially accepted and then a string of characters included in the set of accepted characters. <br/>
         * The following example allows only uppercase characters, spaces, and numbers in the text field: <br/>
         * My_txt.restrict = "A-Z 0-9"; <br/>
         * The following example includes all characters except lowercase letters: <br/>
         * My_txt.restrict = "^ a-z"; <br/>
         * If you need to enter characters \ ^, use two backslash "\\ -" "\\ ^": <br/>
         * Can be used anywhere in the string ^ to rule out including characters and switch between characters, but can only be used to exclude a ^. The following code includes only uppercase letters except uppercase Q: <br/>
         * My_txt.restrict = "A-Z ^ Q"; <br/>
         * @version Egret 2.4
         * @platform Web,Native
         * @default null
         */
        /**
         * @language zh_CN
         * 表示用户可输入到文本字段中的字符集。如果 restrict 属性的值为 null，则可以输入任何字符。如果 restrict 属性的值为空字符串，则不能输入任何字符。如果 restrict 属性的值为一串字符，则只能在文本字段中输入该字符串中的字符。从左向右扫描该字符串。可以使用连字符 (-) 指定一个范围。只限制用户交互；脚本可将任何文本放入文本字段中。<br/>
         * 如果字符串以尖号 (^) 开头，则先接受所有字符，然后从接受字符集中排除字符串中 ^ 之后的字符。如果字符串不以尖号 (^) 开头，则最初不接受任何字符，然后将字符串中的字符包括在接受字符集中。<br/>
         * 下例仅允许在文本字段中输入大写字符、空格和数字：<br/>
         * my_txt.restrict = "A-Z 0-9";<br/>
         * 下例包含除小写字母之外的所有字符：<br/>
         * my_txt.restrict = "^a-z";<br/>
         * 如果需要输入字符 \ ^，请使用2个反斜杠 "\\-" "\\^" ：<br/>
         * 可在字符串中的任何位置使用 ^，以在包含字符与排除字符之间进行切换，但是最多只能有一个 ^ 用来排除。下面的代码只包含除大写字母 Q 之外的大写字母：<br/>
         * my_txt.restrict = "A-Z^Q";<br/>
         * @version Egret 2.4
         * @platform Web,Native
         * @default null
         */
        restrict: string;
        _setWidth(value: number): void;
        _setHeight(value: number): void;
        private _bgGraphics;
        /**
         * 指定文本字段是否具有边框。
         * 如果为 true，则文本字段具有边框。如果为 false，则文本字段没有边框。
         * 使用 borderColor 属性来设置边框颜色。
         * 默认值为 false。
         * @member {boolean} egret.TextField#border
         */
        border: boolean;
        /**
         * 文本字段边框的颜色。默认值为 0x000000（黑色）。
         * 即使当前没有边框，也可检索或设置此属性，但只有当文本字段已将 border 属性设置为 true 时，才可以看到颜色。
         * @member {number} egret.TextField#borderColor
         */
        borderColor: number;
        /**
         * 指定文本字段是否具有背景填充。
         * 如果为 true，则文本字段具有背景填充。如果为 false，则文本字段没有背景填充。
         * 使用 backgroundColor 属性来设置文本字段的背景颜色。
         * 默认值为 false。
         * @member {boolean} egret.TextField#background
         */
        background: boolean;
        /**
         * 文本字段背景的颜色。默认值为 0xFFFFFF（白色）。
         * 即使当前没有背景，也可检索或设置此属性，但只有当文本字段已将 background 属性设置为 true 时，才可以看到颜色。
         * @member {number} egret.TextField#backgroundColor
         */
        backgroundColor: number;
        private fillBackground();
        /**
         * @private
         */
        setFocus(): void;
        _TF_Props_: TextFieldProperties;
        /**
         * 创建一个 egret.TextField 对象
         */
        constructor();
        _onRemoveFromStage(): void;
        _onAddToStage(): void;
        _updateBaseTransform(): void;
        _updateTransform(): void;
        _draw(renderContext: RendererContext): void;
        /**
         * @see egret.DisplayObject._render
         * @param renderContext
         */
        _render(renderContext: RendererContext): void;
        /**
         * 测量显示对象坐标与大小
         */
        _measureBounds(): egret.Rectangle;
        private _isFlow;
        /**
         * 设置富文本
         * @param textArr 富文本数据
         * @see http://edn.egret.com/cn/index.php/article/index/id/146
         */
        textFlow: Array<egret.ITextElement>;
        private changeToPassText(text);
        private _textArr;
        private _isArrayChanged;
        private setMiddleStyle(textArr);
        /**
         * 文本的宽度，以像素为单位。
         * @member {number} egret.TextField#textWidth
         */
        textWidth: number;
        /**
         * 文本的高度，以像素为单位。
         * @member {number} egret.TextField#textHeight
         */
        textHeight: number;
        /**
         * 将 newText 参数指定的字符串追加到文本字段的文本的末尾。
         * @method {number} egret.TextField#appendText
         * @param newText {string} 要追加到现有文本末尾的字符串
         */
        appendText(newText: string): void;
        /**
         * 将 newElement 参数指定的文本内容追加到文本字段的文本的末尾。
         * @method {number} egret.TextField#appendElement
         * @param newElement {egret.ITextElement} 要追加到现有文本末尾的文本内容
         */
        appendElement(newElement: egret.ITextElement): void;
        private _linesArr;
        _getLinesArr(): Array<egret.ILineElement>;
        /**
         * @private
         */
        /**
         * @private
         */
        wordWrap: boolean;
        _isTyping: boolean;
        /**
         * @private
         * @param renderContext
         * @returns {Rectangle}
         */
        private drawText(renderContext);
        private _addEvent();
        private _removeEvent();
        private onTapHandler(e);
    }
}

declare module egret {
    /**
     * @class egret.HtmlTextParser
     * @classdesc 将html格式文本转换为可赋值给 egret.TextField#textFlow 属性的对象
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=146&terms1_id=25&terms2_id=33&t3_id=146 多种样式文本混合
     * @includeExample egret/text/HtmlTextParser.ts
     */
    class HtmlTextParser {
        /**
         * 创建一个 egret.HtmlTextParser 对象
         */
        constructor();
        private _replaceArr;
        private initReplaceArr();
        private replaceSpecial(value);
        private resutlArr;
        /**
         * 将html格式文本转换为可赋值给 egret.TextField#textFlow 属性的对象
         * @param htmltext {string} html文本
         * @method egret.HtmlTextParser#parser
         * @returns {Array<egret.ITextElement>} 可赋值给 egret.TextField#textFlow 属性的对象
         */
        parser(htmltext: string): Array<egret.ITextElement>;
        private addToResultArr(value);
        private changeStringToObject(str);
        private getHeadReg();
        private addProperty(info, head, value);
        private stackArray;
        private addToArray(infoStr);
    }
}

declare module egret {
    /**
     * @class egret.TextFieldType
     * @classdesc
     * TextFieldType 类是在设置 TextField 类的 type 属性时使用的常数值的枚举。
     */
    class TextFieldType {
        /**
         * 用于指定动态文本
         * @constant {string} egret.TextFieldType.DYNAMIC
         */
        static DYNAMIC: string;
        /**
         * 用于指定输入文本
         * @constant {string} egret.TextFieldType.INPUT
         */
        static INPUT: string;
    }
}

declare module egret {
    /**
     * @class egret.SpriteSheet
     * @classdesc SpriteSheet 是一张由多个子位图拼接而成的集合位图，它包含多个 Texture 对象。
     * 每一个 Texture 都共享 SpriteSheet 的集合位图，但是指向它的不同的区域。
     * 在WebGL / OpenGL上，这种做法可以显著提升性能
     * 同时，SpriteSheet可以很方便的进行素材整合，降低HTTP请求数量
     * SpriteSheet 格式的具体规范可以参见此文档  https://github.com/egret-labs/egret-core/wiki/Egret-SpriteSheet-Specification
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=135&terms1_id=25&terms2_id=31 纹理集的使用
     * @includeExample egret/display/SpriteSheet.ts
     */
    class SpriteSheet extends HashObject {
        /**
         * 创建一个 egret.SpriteSheet 对象
         * @param texture {Texture} 纹理
         */
        constructor(texture: Texture);
        /**
         * 表示bitmapData.width
         */
        private _sourceWidth;
        /**
         * 表示bitmapData.height
         */
        private _sourceHeight;
        /**
         * 表示这个SpriteSheet的位图区域在bitmapData上的起始位置x。
         */
        private _bitmapX;
        /**
         * 表示这个SpriteSheet的位图区域在bitmapData上的起始位置y。
         */
        private _bitmapY;
        /**
         * 共享的位图数据
         */
        private texture;
        /**
         * 纹理缓存字典
         */
        _textureMap: Object;
        /**
         * 根据指定纹理名称获取一个缓存的 Texture 对象
         * @method egret.SpriteSheet#getTexture
         * @param name {string} 缓存这个 Texture 对象所使用的名称
         * @returns {egret.Texture} Texture 对象
         */
        getTexture(name: string): Texture;
        /**
         * 为 SpriteSheet 上的指定区域创建一个新的 Texture 对象并缓存它
         * @method egret.SpriteSheet#createTexture
         * @param name {string} 缓存这个 Texture 对象所使用的名称，如果名称已存在，将会覆盖之前的 Texture 对象
         * @param bitmapX {number} 纹理区域在 bitmapData 上的起始坐标x
         * @param bitmapY {number} 纹理区域在 bitmapData 上的起始坐标y
         * @param bitmapWidth {number} 纹理区域在 bitmapData 上的宽度
         * @param bitmapHeight {number} 纹理区域在 bitmapData 上的高度
         * @param offsetX {number} 原始位图的非透明区域 x 起始点
         * @param offsetY {number} 原始位图的非透明区域 y 起始点
         * @param textureWidth {number} 原始位图的高度，若不传入，则使用 bitmapWidth 的值。
         * @param textureHeight {number} 原始位图的宽度，若不传入，则使用 bitmapHeight 的值。
         * @returns {egret.Texture} 创建的 Texture 对象
         */
        createTexture(name: string, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX?: number, offsetY?: number, textureWidth?: number, textureHeight?: number): Texture;
        /**
         * 销毁 SpriteSheet 对象所持有的纹理对象
         * @method egret.SpriteSheet#dispose
         */
        dispose(): void;
    }
}

declare module egret {
    /**
     * @private
     */
    class InputController extends HashObject {
        private stageText;
        private _text;
        private _isFocus;
        constructor();
        init(text: TextField): void;
        _addStageText(): void;
        _removeStageText(): void;
        _getText(): string;
        _setText(value: string): void;
        private focusHandler(event);
        private blurHandler(event);
        private onMouseDownHandler(event);
        private onStageDownHandler(event);
        private updateTextHandler(event);
        private resetText();
        _hideInput(): void;
        _updateTransform(): void;
        _updateProperties(): void;
    }
}

declare module egret {
    /**
     * @classdesc
     * @class egret.BitmapFont
     * 位图字体,是一个字体的纹理集，通常作为BitmapText.font属性的值。
     * @see http://bbs.egret-labs.org/thread-918-1-1.html TextureMerger
     * @see http://bbs.egret-labs.org/forum.php?mod=viewthread&tid=251 文本(含位图字体具体用法)
     * @extends egret.SpriteSheet
     * @includeExample egret/text/BitmapFont.ts
     */
    class BitmapFont extends SpriteSheet {
        /**
         * 创建一个 egret.BitmapFont 对象
         * @param texture {egret.Texture} 使用TextureMerger生成的纹理集
         * @param config {any} 使用TextureMerger生成的配置数据
         */
        constructor(texture: Texture, config: any);
        private charList;
        /**
         * 通过 name 属性获取对应纹理
         * @param name {string} name属性
         * @method egret.BitmapFont#getTexture
         * @returns {egret.Texture}
         */
        getTexture(name: string): Texture;
        private firstCharHeight;
        _getFirstCharHeight(): number;
        private parseConfig(fntText);
        private getConfigByKey(configText, key);
    }
}

declare module egret {
    /**
     * @class egret.MovieClip
     * @classdesc 影片剪辑，可以通过影片剪辑播放序列帧动画。MovieClip 类从以下类继承而来：DisplayObject 和 EventDispatcher。不同于 DisplayObject 对象，MovieClip 对象拥有一个时间轴。
     * @extends egret.DisplayObject
     * @event egret.Event.COMPLETE 动画播放完成。
     * @event egret.Event.LOOP_COMPLETE 动画循环播放完成。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=151&terms1_id=25&terms2_id=34 MovieClip序列帧动画
     * @includeExample egret/display/MovieClip.ts
     */
    class MovieClip extends DisplayObject {
        private _isAddedToStage;
        private static renderFilter;
        _textureToRender: Texture;
        _movieClipData: MovieClipData;
        private _frames;
        private _totalFrames;
        _frameLabels: any[];
        private _labelStartFrame;
        private _labelEndFrame;
        _frameEvents: any[];
        private _frameIntervalTime;
        _eventPool: string[];
        private _isPlaying;
        private _isStopped;
        private _playTimes;
        _currentFrameNum: number;
        _nextFrameNum: number;
        private _displayedKeyFrameNum;
        private _passedTime;
        /**
         * 创建一个 egret.MovieClip 对象。创建 MovieClip 之后，调用舞台上的显示对象容器的addElement方法。
         * @method egret.MovieClip#constructor
         * @param movieClipData {MovieClipData} 被引用的 MovieClipData 对象
         */
        constructor(movieClipData?: MovieClipData);
        _init(): void;
        _reset(): void;
        private _initFrame();
        _render(renderContext: RendererContext): void;
        _measureBounds(): egret.Rectangle;
        _onAddToStage(): void;
        _onRemoveFromStage(): void;
        /**
         * 返回帧标签为指定字符串的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelByName
         * @param labelName {string} 帧标签名
         * @param ignoreCase {boolean} 是否忽略大小写，可选参数，默认false
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        _getFrameLabelByName(labelName: string, ignoreCase?: boolean): FrameLabel;
        /**
         * 根据帧标签，设置开始和结束的帧数
         */
        private _setFrameLabelFrames(labelName);
        /**
         * 返回指定序号的帧的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelByFrame
         * @param frame {number} 帧序号
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        _getFrameLabelByFrame(frame: number): FrameLabel;
        /**
         * 返回指定序号的帧对应的FrameLabel对象，如果当前帧没有标签，则返回前面最近的有标签的帧的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelForFrame
         * @param frame {number} 帧序号
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        _getFrameLabelForFrame(frame: number): FrameLabel;
        /**
         * 继续播放当前动画
         * @method egret.MovieClip#play
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数(MovieClip初始播放次数设置为1)，
         */
        play(playTimes?: number): void;
        /**
         * 暂停播放动画
         * @method egret.MovieClip#stop
         */
        stop(): void;
        /**
         * 将播放头移到前一帧并停止
         * @method egret.MovieClip#prevFrame
         */
        prevFrame(): void;
        /**
         * 跳到后一帧并停止
         * @method egret.MovieClip#prevFrame
         */
        nextFrame(): void;
        /**
         * 将播放头移到指定帧并播放
         * @method egret.MovieClip#gotoAndPlay
         * @param frame {any} 指定帧的帧号或帧标签
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数，
         */
        gotoAndPlay(frame: any, playTimes?: number): void;
        /**
         * 将播放头移到指定帧并停止
         * @method egret.MovieClip#gotoAndPlay
         * @param frame {any} 指定帧的帧号或帧标签
         */
        gotoAndStop(frame: any): void;
        private _gotoFrame(frame);
        private _advanceTime(advancedTime);
        _advanceFrame(): void;
        private _constructFrame();
        private _handlePendingEvent();
        /**
         * MovieClip 实例中帧的总数
         * @member {number} egret.MovieClip#totalFrames
         */
        totalFrames: number;
        /**
         * MovieClip 实例当前播放的帧的序号
         * @member {number} egret.MovieClip#currentFrame
         */
        currentFrame: number;
        /**
         * MovieClip 实例当前播放的帧的标签。如果当前帧没有标签，则 currentFrameLabel返回null。
         * @member {number} egret.MovieClip#currentFrame
         */
        currentFrameLabel: string;
        /**
         * 当前播放的帧对应的标签，如果当前帧没有标签，则currentLabel返回包含标签的先前帧的标签。如果当前帧和先前帧都不包含标签，currentLabel返回null。
         * @member {number} egret.MovieClip#currentFrame
         */
        currentLabel: string;
        /**
         * MovieClip 实例的帧频
         * @member {number} egret.MovieClip#frameRate
         */
        frameRate: number;
        /**
         * MovieClip 实例当前是否正在播放
         * @member {boolean} egret.MovieClip#isPlaying
         */
        isPlaying: boolean;
        /**
         * MovieClip数据源
         * @member {any} egret.MovieClip#movieClipData
         */
        movieClipData: MovieClipData;
        private _setMovieClipData(value);
        private setPlayTimes(value);
        private setIsStopped(value);
    }
}

declare module egret {
    /**
     * @private
     */
    class FrameLabel extends EventDispatcher {
        private _name;
        private _frame;
        private _end;
        constructor(name: string, frame: number, end?: any);
        /**
         * 标签名
         * @member {string} egret.FrameLabel#name
         */
        name: string;
        /**
         * 标签所在帧序号
         * @member {number} egret.FrameLabel#frame
         */
        frame: number;
        /**
         * 标签对应的结束帧序号
         * @member {number} egret.FrameLabel#frame
         */
        end: number;
        /**
         * 复制当前帧标签对象
         * @method egret.FrameLabel#clone
         */
        clone(): FrameLabel;
    }
}

declare module egret {
    /**
     * @class egret.MovieClipData
     * @classdesc 使用 MovieClipData 类，您可以创建 MovieClip 对象和处理 MovieClip 对象的数据。MovieClipData 一般由MovieClipDataFactory生成
     * @extends egret.HashObject
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=151&terms1_id=25&terms2_id=34 MovieClip序列帧动画
     */
    class MovieClipData extends HashObject {
        /**
         * MovieClip数据
         */
        _mcData: any;
        /**
         * 总帧数
         */
        numFrames: number;
        /**
         * 帧数据列表
         */
        frames: any[];
        /**
         * 帧标签列表
         */
        labels: any[];
        /**
         * 帧事件列表
         */
        events: any[];
        /**
         * 帧率
         */
        frameRate: number;
        /**
         * 纹理数据
         */
        textureData: any;
        /**
         * 纹理集
         */
        spriteSheet: SpriteSheet;
        /**
         * 创建一个 egret.MovieClipData 对象
         */
        constructor();
        _init(mcData: any, textureData: any, spriteSheet: SpriteSheet): void;
        /**
         * 根据指定帧序号获取该帧对应的关键帧数据
         * @method egret.MovieClipData#getKeyFrameData
         * @param frame {number} 帧序号
         * @returns {any} 帧数据对象
         */
        getKeyFrameData(frame: number): any;
        /**
         * 根据指定帧序号获取该帧对应的Texture对象
         * @method egret.MovieClipData#getTextureByFrame
         * @param frame {number} 帧序号
         * @returns {egret.Texture} Texture对象
         */
        getTextureByFrame(frame: number): Texture;
        private getTextureByResName(resName);
        _isDataValid(): boolean;
        _isTextureValid(): boolean;
        _fillMCData(mcData: any): void;
        private _fillFramesData(framesData);
        private _fillFrameLabelsData(frameLabelsData);
        private _fillFrameEventsData(frameEventsData);
        /**
         * MovieClip数据源
         * @member {any} egret.MovieClip#dataSource
         */
        mcData: MovieClipData;
        private _setMCData(value);
    }
}

declare module egret {
    /**
     * @class egret.MovieClipDataFactory
     * @classdesc 使用 MovieClipDataFactory 类，可以生成 MovieClipData 对象用于创建MovieClip
     * @extends egret.EventDispatcher
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=151&terms1_id=25&terms2_id=34 MovieClip序列帧动画
     */
    class MovieClipDataFactory extends EventDispatcher {
        /**
         * 是否开启缓存
         * @member {boolean} egret.MovieClipDataFactory#enableCache
         */
        enableCache: boolean;
        _mcDataSet: any;
        _spriteSheet: SpriteSheet;
        _mcDataCache: any;
        /**
         * 创建一个 egret.MovieClipDataFactory 对象
         * @param movieClipDataSet {any} MovieClip数据集，该数据集必须由Egret官方工具生成
         * @param texture {Texture} 纹理
         */
        constructor(movieClipDataSet?: any, texture?: Texture);
        /**
         * 清空缓存
         * @method egret.MovieClipDataFactory#clearCache
         */
        clearCache(): void;
        /**
         * 根据名字生成一个MovieClipData实例。可以用于创建MovieClip。
         * @method egret.MovieClipDataFactory#generateMovieClipData
         * @param movieClipName {string} MovieClip名字. 可选参数，默认为"", 相当于取第一个MovieClip数据
         * @returns {MovieClipData} 生成的MovieClipData对象
         */
        generateMovieClipData(movieClipName?: string): MovieClipData;
        private _findFromCache(movieClipName, cache);
        private _fillData(movieClipName, movieClip, cache);
        /**
         * MovieClip数据集
         * @member {any} egret.MovieClipDataFactory#mcDataSet
         */
        mcDataSet: any;
        /**
         * MovieClip需要使用的纹理图
         * @member {Texture} egret.MovieClipDataFactory#texture
         */
        texture: Texture;
        /**
         * 由纹理图生成的精灵表
         * @member {SpriteSheet} egret.MovieClipDataFactory#spriteSheet
         */
        spriteSheet: SpriteSheet;
        private setTexture(value);
    }
}

declare module egret {
    /**
     * @classdesc
     * @extends egret.EventDispatcher
     * @private
     */
    class StageText extends EventDispatcher {
        constructor();
        _textfield: egret.TextField;
        _setTextField(textfield: egret.TextField): void;
        /**
         * @returns {string}
         */
        _getText(): string;
        /**
         * @param value {string}
         */
        _setText(value: string): void;
        /**
         * @param type {string}
         */
        _setTextType(type: string): void;
        /**
         * @returns {string}
         */
        _getTextType(): string;
        _show(multiline: boolean, size: number, width: number, height: number): void;
        _add(): void;
        _remove(): void;
        _hide(): void;
        _addListeners(): void;
        _removeListeners(): void;
        _scaleX: number;
        _scaleY: number;
        _setScale(x: number, y: number): void;
        changePosition(x: number, y: number): void;
        _size: number;
        _setSize(value: number): void;
        _color: string;
        _setTextColor(value: string): void;
        _fontFamily: string;
        _setTextFontFamily(value: string): void;
        _bold: boolean;
        _setBold(value: boolean): void;
        _italic: boolean;
        _setItalic(value: boolean): void;
        _textAlign: string;
        _setTextAlign(value: string): void;
        _verticalAlign: string;
        _setVerticalAlign(value: string): void;
        _visible: boolean;
        _setVisible(value: boolean): void;
        _width: number;
        _setWidth(value: number): void;
        _height: number;
        _setHeight(value: number): void;
        _multiline: boolean;
        _setMultiline(value: boolean): void;
        _maxChars: number;
        _setMaxChars(value: number): void;
        _resetStageText(): void;
        _initElement(x: number, y: number, cX: number, cY: number): void;
        _removeInput(): void;
        static create(): StageText;
        /**
         * @private
         *
         */
        $onBlur(): void;
    }
}

declare module egret {
    /**
     * @class egret.URLRequestMethod
     * @classdesc URLRequestMethod 类提供了一些值，这些值可指定在将数据发送到服务器时，
     * URLRequest 对象应使用 POST 方法还是 GET 方法。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=162&terms1_id=25&terms2_id=37 POST与GET
     * @includeExample egret/net/URLRequestMethod.ts
     */
    class URLRequestMethod {
        /**
         * 表示 URLRequest 对象是一个 GET。
         * @constant {string} egret.URLRequestMethod.GET
         */
        static GET: string;
        /**
         * 表示 URLRequest 对象是一个 POST。
         * @constant {string} egret.URLRequestMethod.POST
         */
        static POST: string;
    }
}

declare module egret {
    /**
     * @class egret.URLLoaderDataFormat
     * @classdesc URLLoaderDataFormat 类提供了一些用于指定如何接收已下载数据的值。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=161&terms1_id=25&terms2_id=37 读取不同数据格式
     * @includeExample egret/net/URLLoaderDataFormat.ts
     */
    class URLLoaderDataFormat {
        /**
         * 指定以原始二进制数据形式接收下载的数据。
         * @constant {string} egret.URLLoaderDataFormat.BINARY
         * @platform Web
         */
        static BINARY: string;
        /**
         * 指定以文本形式接收已下载的数据。
         * @constant {string} egret.URLLoaderDataFormat.TEXT
         */
        static TEXT: string;
        /**
         * 指定以 URL 编码变量形式接收下载的数据。
         * @constant {string} egret.URLLoaderDataFormat.VARIABLES
         */
        static VARIABLES: string;
        /**
         * 指定以位图纹理形式接收已下载的数据。
         * @constant {string} egret.URLLoaderDataFormat.TEXTURE
         */
        static TEXTURE: string;
        /**
         * 指定以声音形式接收已下载的数据。
         * @constant {string} egret.URLLoaderDataFormat.SOUND
         */
        static SOUND: string;
    }
}

declare module egret {
    /**
     * @class egret.URLVariables
     * @classdesc
     * 使用 URLVariables 类可以在应用程序和服务器之间传输变量。
     * 将 URLVariables 对象与 URLLoader 类的方法、URLRequest 类的 data 属性一起使用。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=163&terms1_id=25&terms2_id=37 发送带参数的请求
     * @includeExample egret/net/URLVariables.ts
     */
    class URLVariables extends HashObject {
        /**
         * 创建一个 egret.URLVariables 对象
         * @method egret.URLVariables#constructor
         * @param source {String} 包含名称/值对的 URL 编码的字符串。
         */
        constructor(source?: string);
        /**
         * 此 URLVariables 储存的键值对数据对象。
         * @member egret.URLVariables#variables
         */
        variables: Object;
        /**
         * 将变量字符串转换为此 URLVariables.variables 对象的属性。
         * @method egret.URLVariables#decode
         * @param source {string} 包含名称/值对的 URL 编码的字符串。
         */
        decode(source: string): void;
        /**
         * 以 MIME 内容编码格式 application/x-www-form-urlencoded 返回包含所有可枚举变量的字符串。
         * @method egret.URLVariables#toString
         */
        toString(): string;
        private encodeValue(key, value);
        private encodeArray(key, value);
    }
}

declare module egret {
    /**
     * @class egret.URLRequestHeader
     * @classdesc
     * URLRequestHeader 对象封装了一个 HTTP 请求标头并由一个名称/值对组成。URLRequestHeader 对象在 URLRequest 类的 requestHeaders 属性中使用。
     * 注意：由于浏览器兼容性原因，在 html5 中并未实现
     * @includeExample egret/net/URLRequestHeader.ts
     */
    class URLRequestHeader {
        /**
         * HTTP 请求标头名称，如 Content-Type
         * @member {string} egret.URLRequestHeader#name
         */
        name: string;
        /**
         * 与 name 属性相关联的值，如 text/plain
         * @member {string} egret.URLRequestHeader#value
         */
        value: string;
        /**
         * 创建一个 egret.URLRequestHeader 对象
         * @param name HTTP 请求标头名称
         * @param value 与 name 属性相关联的值
         */
        constructor(name: string, value: string);
    }
}

declare module egret {
    /**
     * @class egret.URLRequest
     * @classdesc URLRequest 类可捕获单个 HTTP 请求中的所有信息。
     * @extends egret.HashObject
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=160&terms1_id=25&terms2_id=37 构建通信请求
     * @includeExample egret/net/URLRequest.ts
     */
    class URLRequest extends HashObject {
        /**
         * 创建一个 egret.URLRequest 对象
         * @method egret.URLRequest#constructor
         * @param url {string} 进行网络请求的地址
         */
        constructor(url?: string);
        /**
         * 一个对象，它包含将随 URL 请求一起传输的数据。
         * 该属性与 method 属性配合使用。当 method 值为 GET 时，将使用 HTTP 查询字符串语法将 data 值追加到 URLRequest.url 值。
         * 当 method 值为 POST（或 GET 之外的任何值）时，将在 HTTP 请求体中传输 data 值。
         * URLRequest API 支持二进制 POST，并支持 URL 编码变量和字符串。该数据对象可以是 ByteArray、URLVariables 或 String 对象。
         * 该数据的使用方式取决于所用对象的类型：
         * 如果该对象为 ByteArray 对象，则 ByteArray 对象的二进制数据用作 POST 数据。对于 GET，不支持 ByteArray 类型的数据。
         * 如果该对象是 URLVariables 对象，并且该方法是 POST，则使用 x-www-form-urlencoded 格式对变量进行编码，并且生成的字符串会用作 POST 数据。
         * 如果该对象是 URLVariables 对象，并且该方法是 GET，则 URLVariables 对象将定义要随 URLRequest 对象一起发送的变量。
         * 否则，该对象会转换为字符串，并且该字符串会用作 POST 或 GET 数据。
         * @member {any} egret.URLRequest#data
         */
        data: any;
        /**
         * 请求方式，有效值为URLRequestMethod.GET 或 URLRequestMethod.POST。
         * @member {string} egret.URLRequest#method
         */
        method: string;
        /**
         * 所请求的 URL。
         * @member {string} egret.URLRequest#url
         */
        url: string;
        /**
         * 要追加到 HTTP 请求的 HTTP 请求标头的数组。该数组由 URLRequestHeader 对象组成。
         * 数组中的每一对象必须是包含一个名称字符串和一个值字符串的 URLRequestHeader 对象。
         * 由于浏览器兼容性原因，该属性在 html5 中并未实现
         * @member {Array} egret.URLRequest#requestHeaders
         */
        requestHeaders: Array<URLRequestHeader>;
    }
}

declare module egret {
    /**
     * @class egret.URLLoader
     * @classdesc
     * URLLoader 类以文本、二进制数据或 URL 编码变量的形式从 URL 下载数据。在下载文本文件、XML 或其他用于动态数据驱动应用程序的信息时，它很有用。
     * URLLoader 对象会先从 URL 中下载所有数据，然后才将数据用于应用程序中的代码。
     * @extends egret.EventDispatcher
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=160&terms1_id=25&terms2_id=37 构建通信请求
     * @event egret.Event.COMPLETE 加载完成后调度。
     * @event egret.IOErrorEvent.IO_ERROR 加载错误后调度。
     * @includeExample egret/net/URLLoader.ts
     */
    class URLLoader extends EventDispatcher {
        /**
         * 创建一个 egret.URLLoader 对象
         * @method egret.URLLoader#constructor
         * @param request {URLRequest} 一个 URLRequest 对象，指定要下载的 URL。
         * 如果省略该参数，则不开始加载操作。如果已指定参数，则立即开始加载操作
         */
        constructor(request?: URLRequest);
        /**
         * 控制是以文本 (URLLoaderDataFormat.TEXT)、原始二进制数据 (URLLoaderDataFormat.BINARY) 还是 URL 编码变量 (URLLoaderDataFormat.VARIABLES) 接收下载的数据。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
         * 如果 dataFormat 属性的值是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
         * 默认值:URLLoaderDataFormat.TEXT
         * @member {string} egret.URLLoader#dataFormat
         */
        dataFormat: string;
        /**
         * 从加载操作接收的数据。只有完成加载操作时，才会填充该属性。该数据的格式取决于 dataFormat 属性的设置：
         * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
         * 如果 dataFormat 属性是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
         * @member {any} egret.URLLoader#data
         */
        data: any;
        _request: URLRequest;
        /**
         * 从指定的 URL 发送和加载数据。可以以文本、原始二进制数据或 URL 编码变量格式接收数据，这取决于为 dataFormat 属性所设置的值。
         * 请注意 dataFormat 属性的默认值为文本。如果想将数据发送至指定的 URL，则可以在 URLRequest 对象中设置 data 属性。
         * @method egret.URLLoader#load
         * @param request {URLRequest}  一个 URLRequest 对象，指定要下载的 URL。
         */
        load(request: URLRequest): void;
        _status: number;
        __recycle(): void;
    }
}

declare module egret {
    /**
     * @class egret.Texture
     * @classdesc 纹理类是对不同平台不同的图片资源的封装
     * 在HTML5中，资源是一个HTMLElement对象
     * 在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理id
     * Texture类封装了这些底层实现的细节，开发者只需要关心接口即可
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=135&terms1_id=25&terms2_id=31 纹理集的使用
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=123&terms1_id=25&terms2_id=30 获取资源的几种方式
     * @includeExample egret/display/Texture.ts
     */
    class Texture extends HashObject {
        /**
         * 创建一个 egret.Texture 对象
         */
        constructor();
        /**
         * 表示这个纹理在 bitmapData 上的 x 起始位置
         */
        _bitmapX: number;
        /**
         * 表示这个纹理在 bitmapData 上的 y 起始位置
         */
        _bitmapY: number;
        /**
         * 表示这个纹理在 bitmapData 上的宽度
         */
        _bitmapWidth: number;
        /**
         * 表示这个纹理在 bitmapData 上的高度
         */
        _bitmapHeight: number;
        /**
         * 表示这个纹理显示了之后在 x 方向的渲染偏移量
         */
        _offsetX: number;
        /**
         * 表示这个纹理显示了之后在 y 方向的渲染偏移量
         */
        _offsetY: number;
        /**
         * 纹理宽度
         */
        _textureWidth: number;
        /**
         * 纹理宽度
         * @member {number} egret.Texture#textureWidth
         */
        textureWidth: number;
        /**
         * 纹理高度
         */
        _textureHeight: number;
        /**
         * 纹理高度
         * @member {number} egret.Texture#textureHeight
         */
        textureHeight: number;
        /**
         * 表示bitmapData.width
         */
        _sourceWidth: number;
        /**
         * 表示bitmapData.height
         */
        _sourceHeight: number;
        _bitmapData: any;
        _setBitmapData(value: any): void;
        /**
         * 获取某一点像素的颜色值
         * @method egret.Texture#getPixel32
         * @param x {number} 像素点的X轴坐标
         * @param y {number} 像素点的Y轴坐标
         * @returns {number} 指定像素点的颜色值
         * @platform Web
         */
        getPixel32(x: number, y: number): number[];
        /**
         * 销毁纹理对象
         * @method egret.Texture#dispose
         */
        dispose(): void;
        _clone(): Texture;
        /**
         * @private
         */
        draw(context: any, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, renderType: any): void;
        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null。
         * native只支持 "image/png" 和 "image/jpeg"；Web中由于各个浏览器的实现不一样，因此建议也只用这2种。
         * @param type 转换的类型，如  "image/png"。
         * @param rect 需要转换的区域
         * @returns {any} base64字符串
         * @version Egret 2.4
         */
        toDataURL(type: string, rect?: egret.Rectangle): string;
        /**
         * 裁剪指定区域并保存成图片。
         * native只支持 "image/png" 和 "image/jpeg"；Web中由于各个浏览器的实现不一样，因此建议也只用这2种。
         * @param type 转换的类型，如  "image/png"
         * @param filePath 图片的名称的路径（主目录为游戏的私有空间，路径中不能有 "../"，Web只支持传名称。）
         * @param rect 需要转换的区域
         * @version Egret 2.4
         * @platform Native
         */
        saveToFile(type: string, filePath: string, rect?: egret.Rectangle): void;
        _drawForCanvas(context: CanvasRenderingContext2D, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, renderType: any): void;
        _drawForNative(context: any, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, renderType: any): void;
        _drawRepeatImageForNative(context: any, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, repeat: any): void;
        _drawRepeatImageForCanvas(context: CanvasRenderingContext2D, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, repeat: any): void;
        _disposeForCanvas(): void;
        _disposeForNative(): void;
        /**
         * @private
         */
        static deleteWebGLTexture(texture: Texture): void;
        /**
         * @private
         */
        static createBitmapData(url: string, callback: (code: number, bitmapData: any) => void): void;
        /**
         * 当从其他站点加载一个图片时，指定是否启用跨域资源共享(CORS)，默认值为null。
         * 可以设置为"anonymous","use-credentials"或null。
         */
        static crossOrigin: string;
        static _createBitmapDataForCanvasAndWebGl(url: string, callback: (code: number, bitmapData: any) => void): void;
        static _onLoad(url: any, bitmapData: any): void;
        static _onError(url: any, bitmapData: any): void;
        static _createBitmapDataForNative(url: string, callback: (code: number, bitmapData: any) => void): void;
        private static _addToCallbackList(url, callback);
        private static _bitmapDataFactory;
        private static _bitmapCallbackMap;
    }
}
declare module egret_native {
    module Texture {
        function addTexture(filePath: string): any;
        function addTextureAsyn(filePath: string, promise: any): any;
        function addTextureUnsyn(filePath: string, promise: any): any;
        function removeTexture(filePath: string): void;
    }
}

declare module egret {
    /**
     * @class egret.RenderTexture
     * @classdesc
     * RenderTexture 是动态纹理类，他实现了将显示对象及其子对象绘制成为一个纹理的功能
     * @extends egret.Texture
     * @includeExample egret/display/RenderTexture.ts
     */
    class RenderTexture extends Texture {
        /**
         * @private
         */
        renderContext: any;
        /**
         * 创建一个 egret.RenderTexture 对象
         */
        constructor();
        /**
         * @private
         */
        init(): void;
        /**
         * @private
         */
        static identityRectangle: egret.Rectangle;
        /**
         * 将指定显示对象绘制为一个纹理
         * @method egret.RenderTexture#drawToTexture
         * @param displayObject {egret.DisplayObject} 需要绘制的显示对象
         * @param clipBounds {egret.Rectangle} 绘制矩形区域
         * @param scale {number} 缩放比例
         */
        drawToTexture(displayObject: egret.DisplayObject, clipBounds?: Rectangle, scale?: number): boolean;
        /**
         * @private
         */
        setSize(width: number, height: number): void;
        /**
         * @private
         */
        begin(): void;
        /**
         * @private
         */
        end(): void;
        /**
         * 销毁 RenderTexture 对象
         * @method egret.RenderTexture#dispose
         */
        dispose(): void;
        private static _pool;
        /**
         * @private
         */
        static create(): RenderTexture;
        /**
         * @private
         */
        static release(value: RenderTexture): void;
    }
}

declare module egret {
    /**
     * @class egret.RendererContext
     * @classdesc
     * RenderContext是游戏的渲染上下文。
     * 这是一个抽象基类，制定主要的接口
     * @extends egret.HashObject
     * @private
     */
    class RendererContext extends HashObject {
        /**
         * 渲染全部纹理的时间开销
         * @member egret.RendererContext#renderCost
         */
        renderCost: number;
        _matrixA: number;
        _matrixB: number;
        _matrixC: number;
        _matrixD: number;
        _matrixTx: number;
        _matrixTy: number;
        /**
         * 绘制纹理的缩放比率，默认值为1
         * @member egret.RendererContext#texture_scale_factor
         */
        _texture_scale_factor: number;
        texture_scale_factor: number;
        _setTextureScaleFactor(value: number): void;
        /**
         * 是否对图像使用平滑处理
         * 该特性目前只支持Canvas
         * @platform Web
         */
        static imageSmoothingEnabled: boolean;
        private profiler;
        /**
         * @method egret.RendererContext#constructor
         */
        constructor();
        /**
         * @method egret.RendererContext#clearScreen
         * @private
         */
        clearScreen(): void;
        /**
         * 清除Context的渲染区域
         * @method egret.RendererContext#clearRect
         * @param x {number}
         * @param y {number}
         * @param w {number}
         * @param h {numbe}
         */
        clearRect(x: number, y: number, w: number, h: number): void;
        /**
         * 绘制图片
         * @method egret.RendererContext#drawImage
         * @param texture {Texture}
         * @param sourceX {any}
         * @param sourceY {any}
         * @param sourceWidth {any}
         * @param sourceHeight {any}
         * @param destX {any}
         * @param destY {any}
         * @param destWidth {any}
         * @param destHeigh {any}
         */
        drawImage(texture: Texture, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any, repeat?: string): void;
        /**
         * 绘制9宫图片
         * @method egret.RendererContext#drawImageScale9
         * @param texture {Texture}
         * @param sourceX {any}
         * @param sourceY {any}
         * @param sourceWidth {any}
         * @param sourceHeight {any}
         * @param destX {any}
         * @param destY {any}
         * @param destWidth {any}
         * @param destHeigh {any}
         */
        drawImageScale9(texture: Texture, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, offX: any, offY: any, destWidth: any, destHeight: any, rect: any): boolean;
        _addOneDraw(): void;
        /**
         * 变换Context的当前渲染矩阵
         * @method egret.RendererContext#setTransform
         * @param matrix {egret.Matri}
         */
        setTransform(matrix: egret.Matrix): void;
        /**
         * 设置渲染alpha
         * @method egret.RendererContext#setAlpha
         * @param value {number}
         * @param blendMode {egret.BlendMod}
         */
        setAlpha(value: number, blendMode: string): void;
        /**
         * 设置渲染文本参数
         * @method egret.RendererContext#setupFont
         * @param textField {TextField}
         */
        setupFont(textField: TextField, style?: egret.ITextStyle): void;
        /**
         * 测量文本
         * @method egret.RendererContext#measureText
         * @param text {string}
         * @returns {number}
         * @stable B 参数很可能会需要调整，和setupFont整合
         */
        measureText(text: string): number;
        /**
         * 绘制文本
         * @method egret.RendererContext#drawText
         * @param textField {egret.TextField}
         * @param text {string}
         * @param x {number}
         * @param y {number}
         * @param maxWidth {numbe}
         */
        drawText(textField: egret.TextField, text: string, x: number, y: number, maxWidth: number, style?: egret.ITextStyle): void;
        strokeRect(x: any, y: any, w: any, h: any, color: any): void;
        pushMask(mask: Rectangle): void;
        popMask(): void;
        onRenderStart(): void;
        onRenderFinish(): void;
        createLinearGradient(x0: number, y0: number, x1: number, y1: number): CanvasGradient;
        createRadialGradient(x0: number, y0: number, r0: number, x1: number, y1: number, r1: number): CanvasGradient;
        setGlobalFilters(filterData: Array<Filter>): void;
        drawCursor(x1: number, y1: number, x2: number, y2: number): void;
        static createRendererContext(canvas: any): RendererContext;
        static blendModesForGL: any;
        private static initBlendMode();
        /**
         * 设置 gl 模式下的blendMode，canvas模式下不会生效
         * @method egret.RendererContext#registerBlendModeForGL
         * @param key {string} 键值
         * @param src {number} 源颜色因子
         * @param dst {number} 目标颜色因子
         * @param override {boolean} 是否覆盖
         */
        static registerBlendModeForGL(key: string, src: number, dst: number, override?: boolean): void;
    }
}

declare module egret {
    /**
     * @private
     */
    class InteractionMode {
        /**
         * 使用鼠标交互模式。
         */
        static MOUSE: string;
        /**
         * 使用触摸交互模式。
         */
        static TOUCH: string;
        /**
         * 当前Egret使用的交互模式。
         */
        static mode: string;
    }
}

declare module egret {
    /**
     *
     * @class egret.TouchContext
     * @classdesc TouchContext是egret的触摸Context
     * @private
     */
    class TouchContext extends HashObject {
        private _currentTouchTarget;
        maxTouches: number;
        private touchDownTarget;
        touchingIdentifiers: Array<any>;
        /**
         * @private
         */
        $rotation: number;
        constructor();
        /**
         * 启动触摸检测
         * @method egret.TouchContext#run
         */
        run(): void;
        getTouchData(identifier: any, x: any, y: any): any;
        dispatchEvent(type: string, data: any): void;
        onTouchBegan(x: number, y: number, identifier: number): void;
        private lastTouchX;
        private lastTouchY;
        onTouchMove(x: number, y: number, identifier: number): void;
        onTouchEnd(x: number, y: number, identifier: number): void;
    }
}

declare module egret {
    /**
     * @class egret.NetContext
     * @classdesc
     * @extends egret.HashObject
     * @private
     */
    class NetContext extends HashObject {
        constructor();
        proceed(loader: URLLoader): void;
        static _getUrl(request: URLRequest): string;
        getChangeList(): Array<any>;
        /**
         * 获取虚拟url
         * @param url
         * @returns {string}
         */
        getVirtualUrl(url: string): string;
    }
}

declare module egret {
    /**
     * @classdesc
     * @extends egret.HashObject
     * @private
     */
    class DeviceContext extends HashObject {
        constructor();
        executeMainLoop(callback: Function, thisObject: any): void;
        setFrameRate(frameRate: number): void;
    }
}

declare module egret {
    /**
     * @includeExample egret/context/external/ExternalInterface.ts
     */
    class ExternalInterface {
        /**
         * 将信息传递给 Egret 外层容器。
         * 如果该容器是 HTML 页，则此方法不可用。
         * 如果该容器是某个 App 容器，该容器将处理该事件。
         * @method egret.ExternalInterface#call
         * @param functionName {string} 用于调用函数的名称
         * @param value {string} 传递的函数的参数
         */
        static call(functionName: string, value: string): void;
        /**
         * 添加外层容器调用侦听，该容器将传递一个字符串给 Egret 容器
         * 如果该容器是 HTML 页，则此方法不可用。
         * @method egret.ExternalInterface#addCallBack
         * @param functionName {string} 用于调用函数的名称
         * @param listener {Function} 要调用的函数
         */
        static addCallback(functionName: string, listener: Function): void;
    }
}

declare module egret {
    /**
     * 这个类是HTML5的WebWrapper的第一个版本
     * @private
     */
    class Browser extends HashObject {
        private static instance;
        private trans;
        private ua;
        static getInstance(): Browser;
        webPSupport: boolean;
        /**
         * @deprecated
         * @returns {boolean}
         */
        isMobile: boolean;
        /**
         * 判断是否是ios
         * @returns {boolean}
         */
        isIOS(): boolean;
        /**
         * 获取ios版本
         * @returns {string}
         */
        getIOSVersion(): string;
        constructor();
        getUserAgent(): string;
        private header;
        /**
         * 获取当前浏览器对应style类型
         * @type {string}
         */
        getTrans(style: string, judge?: boolean): string;
        /**
         * 获取当前浏览器的类型
         * @returns {string}
         */
        private getHeader(style);
        $new(x: any): any;
        $(x: any): any;
        translate(a: any): string;
        rotate(a: any): string;
        scale(a: any): string;
        skew(a: any): string;
    }
}

declare module egret {
    /**
     * @includeExample egret/context/localStorage/localStorage.ts
     */
    class localStorage {
        /**
         * 读取数据
         * @method egret.localStorage.getItem
         * @param key {string} 要读取的键名称
         */
        static getItem(key: string): string;
        /**
         * 保存数据
         * @method egret.localStorage.setItem
         * @param key {string} 要保存的键名称
         * @param value {string} 要保存的值
         * @returns {boolean} 数据保存是否成功
         */
        static setItem(key: string, value: string): boolean;
        /**
         * 删除数据
         * @method egret.localStorage.removeItem
         * @param key {string} 要删除的键名称
         */
        static removeItem(key: string): void;
        /**
         * 将所有数据清空
         * @method egret.localStorage.clear
         */
        static clear(): void;
    }
}

declare module egret {
    /**
     * @class egret.XML
     * @classdesc
     * XML文件解析工具，它将XML文件解析为标准的JSON对象返回。
     * 用法类似JSON.parse(),传入一个XML字符串给XML.parse()，将能得到一个标准JSON对象。
     * 示例：
     * <pre>
     *      <root value="abc">
     *          <item value="item0"/>
     *          <item value="item1"/>
     *      </root>
     * </pre>
     * 将解析为:
     * <pre>
     *      {
     *          "name": "root",
     *          "$value": "abc",
     *          "children": [
     *              {"name": "item", "$value": "item0"},
     *              {"name": "item", "$value": "item1"}
     *          ]
     *      }
     * </pre>
     * 其中XML上的属性节点都使用$+"属性名"的方式表示,子节点都存放在children属性的列表里，name表示节点名称。
     * @includeExample egret/utils/XML.ts
     */
    class XML {
        /**
         * 解析一个XML字符串为JSON对象。
         * @method egret.XML.parse
         * @param value {string} 要解析的XML字符串。
         * @returns {any} 解析完后的JSON对象
         * @platform Web
         */
        static parse(value: string): any;
        private static parseNode(node);
        /**
         *
         * 查找xml上符合节点路径的所有子节点。
         * @method egret.XML.findChildren
         * @param xml {any} 要查找的XML节点。
         * @param path {string} 子节点路径，例如"item.node"
         * @param result {egret.Array<any>} 可选参数，传入一个数组用于存储查找的结果。这样做能避免重复创建对象。
         * @returns {any} 节点路径的所有子节点
         * @platform Web
         */
        static findChildren(xml: any, path: string, result?: Array<any>): Array<any>;
        /**
         * @private
         * @method egret.XML.findByPath
         * @param xml {any}
         * @param path {string}
         * @param result {egret.Array<any>}
         * @platform Web
         */
        private static findByPath(xml, path, result);
        /**
         * 获取一个XML节点上的所有属性名列表
         * @method egret.XML.getAttributes
         * @param xml {any} 要查找的XML节点。
         * @param result {egret.Array<any>} 可选参数，传入一个数组用于存储查找的结果。这样做能避免重复创建对象。
         * @returns {string} 节点上的所有属性名列表
         * @platform Web
         */
        static getAttributes(xml: any, result?: Array<any>): Array<string>;
    }
}

declare module egret {
    /**
     * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
     * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
     * @class egret.Endian
     * @classdesc
     */
    class Endian {
        /**
         * 表示多字节数字的最低有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @constant {string} egret.Endian.LITTLE_ENDIAN
         */
        static LITTLE_ENDIAN: string;
        /**
         * 表示多字节数字的最高有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @constant {string} egret.Endian.BIG_ENDIAN
         */
        static BIG_ENDIAN: string;
    }
    /**
     * @class egret.ByteArray
     * @classdesc
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级 开发人员。
     * @includeExample egret/utils/ByteArray.ts
     */
    class ByteArray {
        private static SIZE_OF_BOOLEAN;
        private static SIZE_OF_INT8;
        private static SIZE_OF_INT16;
        private static SIZE_OF_INT32;
        private static SIZE_OF_UINT8;
        private static SIZE_OF_UINT16;
        private static SIZE_OF_UINT32;
        private static SIZE_OF_FLOAT32;
        private static SIZE_OF_FLOAT64;
        private BUFFER_EXT_SIZE;
        private data;
        private _position;
        private write_position;
        /**
         * 更改或读取数据的字节顺序；egret.Endian.BIG_ENDIAN 或 egret.Endian.LITTLE_ENDIAN。
         * @default egret.Endian.BIG_ENDIAN
         * @member egret.ByteArray#endian
         */
        endian: string;
        /**
         * 创建一个 egret.ByteArray 对象以引用指定的 ArrayBuffer 对象
         * @param buffer {ArrayBuffer} 数据源
         */
        constructor(buffer?: ArrayBuffer);
        private _setArrayBuffer(buffer);
        /**
         * @private
         */
        buffer: ArrayBuffer;
        /**
         * @private
         */
        dataView: DataView;
        /**
         * @private
         */
        bufferOffset: number;
        /**
         * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
         * @member {number} egret.ByteArray#position
         */
        position: number;
        /**
         * ByteArray 对象的长度（以字节为单位）。
         * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
         * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
         * @member {number} egret.ByteArray#length
         */
        length: number;
        /**
         * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
         * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
         * @member {number} egret.ByteArray#bytesAvailable
         */
        bytesAvailable: number;
        /**
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。
         * @method egret.ByteArray#clear
         */
        clear(): void;
        /**
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @return 如果字节不为零，则返回 true，否则返回 false
         * @method egret.ByteArray#readBoolean
         */
        readBoolean(): boolean;
        /**
         * 从字节流中读取带符号的字节
         * @return 介于 -128 和 127 之间的整数
         * @method egret.ByteArray#readByte
         */
        readByte(): number;
        /**
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @method egret.ByteArray#readBytes
         */
        readBytes(bytes: ByteArray, offset?: number, length?: number): void;
        /**
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @return 双精度（64 位）浮点数
         * @method egret.ByteArray#readDouble
         */
        readDouble(): number;
        /**
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @return 单精度（32 位）浮点数
         * @method egret.ByteArray#readFloat
         */
        readFloat(): number;
        /**
         * 从字节流中读取一个带符号的 32 位整数
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @method egret.ByteArray#readFloat
         */
        readInt(): number;
        /**
         * 使用指定的字符集从字节流中读取指定长度的多字节字符串
         * @param length 要从字节流中读取的字节数
         * @param charSet 表示用于解释字节的字符集的字符串。可能的字符集字符串包括 "shift-jis"、"cn-gb"、"iso-8859-1"”等
         * @return UTF-8 编码的字符串
         * @method egret.ByteArray#readMultiByte
         */
        /**
         * 从字节流中读取一个带符号的 16 位整数
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数
         * @method egret.ByteArray#readShort
         */
        readShort(): number;
        /**
         * 从字节流中读取无符号的字节
         * @return 介于 0 和 255 之间的 32 位无符号整数
         * @method egret.ByteArray#readUnsignedByte
         */
        readUnsignedByte(): number;
        /**
         * 从字节流中读取一个无符号的 32 位整数
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数
         * @method egret.ByteArray#readUnsignedInt
         */
        readUnsignedInt(): number;
        /**
         * 从字节流中读取一个无符号的 16 位整数
         * @return 介于 0 和 65535 之间的 16 位无符号整数
         * @method egret.ByteArray#readUnsignedShort
         */
        readUnsignedShort(): number;
        /**
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @return UTF-8 编码的字符串
         * @method egret.ByteArray#readUTF
         */
        readUTF(): string;
        /**
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length 指明 UTF-8 字节长度的无符号短整型数
         * @return 由指定长度的 UTF-8 字节组成的字符串
         * @method egret.ByteArray#readUTFBytes
         */
        readUTFBytes(length: number): string;
        /**
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @method egret.ByteArray#writeBoolean
         */
        writeBoolean(value: boolean): void;
        /**
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value 一个 32 位整数。低 8 位将被写入字节流
         * @method egret.ByteArray#writeByte
         */
        writeByte(value: number): void;
        /**
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
         * @param bytes ByteArray 对象
         * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length 一个无符号整数，表示在缓冲区中的写入范围
         * @method egret.ByteArray#writeBytes
         */
        writeBytes(bytes: ByteArray, offset?: number, length?: number): void;
        /**
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value 双精度（64 位）浮点数
         * @method egret.ByteArray#writeDouble
         */
        writeDouble(value: number): void;
        /**
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value 单精度（32 位）浮点数
         * @method egret.ByteArray#writeFloat
         */
        writeFloat(value: number): void;
        /**
         * 在字节流中写入一个带符号的 32 位整数
         * @param value 要写入字节流的整数
         * @method egret.ByteArray#writeInt
         */
        writeInt(value: number): void;
        /**
         * 使用指定的字符集将多字节字符串写入字节流
         * @param value 要写入的字符串值
         * @param charSet 表示要使用的字符集的字符串。可能的字符集字符串包括 "shift-jis"、"cn-gb"、"iso-8859-1"”等
         * @method egret.ByteArray#writeMultiByte
         */
        /**
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value 32 位整数，该整数的低 16 位将被写入字节流
         * @method egret.ByteArray#writeShort
         */
        writeShort(value: number): void;
        /**
         * 在字节流中写入一个无符号的 32 位整数
         * @param value 要写入字节流的无符号整数
         * @method egret.ByteArray#writeUnsignedInt
         */
        writeUnsignedInt(value: number): void;
        /**
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value 要写入的字符串值
         * @method egret.ByteArray#writeUTF
         */
        writeUTF(value: string): void;
        /**
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value 要写入的字符串值
         * @method egret.ByteArray#writeUTFBytes
         */
        writeUTFBytes(value: string): void;
        toString(): string;
        /**
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        _writeUint8Array(bytes: Uint8Array, validateBuffer?: boolean): void;
        /**
         * @private
         */
        validate(len: number): boolean;
        /**********************/
        /**********************/
        private validateBuffer(len, needReplace?);
        /**
         * UTF-8 Encoding/Decoding
         */
        private encodeUTF8(str);
        private decodeUTF8(data);
        private encoderError(code_point);
        private decoderError(fatal, opt_code_point?);
        private EOF_byte;
        private EOF_code_point;
        private inRange(a, min, max);
        private div(n, d);
        private stringToCodePoints(string);
    }
}

declare module egret {
    /**
     * 获取浏览器或者Runtime参数，如果没有设置返回空字符串
     * 在浏览器中相当于获取url中参数，在Runtime获取对应setOption参数
     * @method egret.getOption
     * @param key {string} 参数key
     * @private
     */
    function getOption(key: string): string;
}

declare module egret {
    /**
     * @class egret.Tween
     * @classdesc
     * Tween是Egret的动画缓动类
     * @extends egret.EventDispatcher
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=150&terms1_id=25&terms2_id=34 Tween缓动动画
     * @includeExample egret/tween/Tween.ts
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
        private static _tweens;
        private static IGNORE;
        private static _plugins;
        private static _inited;
        private _target;
        private _useTicks;
        private ignoreGlobalPause;
        private loop;
        private pluginData;
        private _curQueueProps;
        private _initQueueProps;
        private _steps;
        private _actions;
        private paused;
        private duration;
        private _prevPos;
        private position;
        private _prevPosition;
        private _stepPosition;
        private passive;
        /**
         * 激活一个对象，对其添加 Tween 动画
         * @param target {any} 要激活 Tween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false
         */
        static get(target: any, props?: any, pluginData?: any, override?: boolean): Tween;
        /**
         * 删除一个对象上的全部 Tween 动画
         * @method egret.Tween.removeTweens
         * @param target  需要移除 Tween 的对象
         */
        static removeTweens(target: any): void;
        /**
         * 暂停某个对象的所有 Tween
         * @param target 要暂停 Tween 的对象
         */
        static pauseTweens(target: any): void;
        /**
         * 继续播放某个对象的所有缓动
         * @param target 要继续播放 Tween 的对象
         */
        static resumeTweens(target: any): void;
        private static tick(delta, paused?);
        private static _register(tween, value);
        /**
         * 删除所有 Tween
         */
        static removeAllTweens(): void;
        /**
         * 创建一个 egret.Tween 对象
         * @private
         */
        constructor(target: any, props: any, pluginData: any);
        private initialize(target, props, pluginData);
        private setPosition(value, actionsMode?);
        private _runActions(startPos, endPos, includeStart?);
        private _updateTargetProps(step, ratio);
        /**
         * 设置是否暂停
         * @method egret.Tween#setPaused
         * @param value {boolean} 是否暂停
         * @returns Tween对象本身
         */
        setPaused(value: boolean): Tween;
        private _cloneProps(props);
        private _addStep(o);
        private _appendQueueProps(o);
        private _addAction(o);
        private _set(props, o);
        /**
         * 等待指定毫秒后执行下一个动画
         * @method egret.Tween#wait
         * @param duration {number} 要等待的时间，以毫秒为单位
         * @param passive {boolean} 等待期间属性是否会更新
         * @returns Tween对象本身
         */
        wait(duration: number, passive?: boolean): Tween;
        /**
         * 将指定显示对象的属性修改为指定值
         * @method egret.Tween#to
         * @param props {Object} 对象的属性集合
         * @param duration {number} 持续时间
         * @param ease {egret.Ease} 缓动算法
         * @returns {egret.Tween} Tween对象本身
         */
        to(props: any, duration?: number, ease?: Function): Tween;
        /**
         * 执行回调函数
         * @method egret.Tween#call
         * @param callback {Function} 回调方法
         * @param thisObj {any} 回调方法this作用域
         * @param params {Array<any>} 回调方法参数
         * @returns {egret.Tween} Tween对象本身
         */
        call(callback: Function, thisObj?: any, params?: Array<any>): Tween;
        /**
         * 设置当前target的属性，并返回当前tween对象
         * @param props {any} 参数
         * @param target {any} 要激活 Tween 的对象
         * @returns {Tween} 当前tween对象
         */
        set(props: any, target?: any): Tween;
        /**
         * 执行
         * @method egret.Tween#play
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         */
        play(tween?: Tween): Tween;
        /**
         * 暂停
         * @method egret.Tween#pause
         * @param tween {egret.Tween} 需要操作的 Tween 对象，默认this
         * @returns {egret.Tween} Tween对象本身
         */
        pause(tween?: Tween): Tween;
        /**
         * @method egret.Tween#tick
         * @param delta {number}
         * @private
         */
        tick(delta: number): void;
    }
}

declare module egret {
    /**
     * 缓动函数集合，使用不同的缓动函数使得动画按照对应的方程进行
     * @see http://bbs.egret-labs.org/thread-392-1-1.html Tween和Ease
     */
    class Ease {
        constructor();
        static get(amount: any): Function;
        static getPowIn(pow: any): Function;
        static getPowOut(pow: any): Function;
        static getPowInOut(pow: any): Function;
        static quadIn: Function;
        static quadOut: Function;
        static quadInOut: Function;
        static cubicIn: Function;
        static cubicOut: Function;
        static cubicInOut: Function;
        static quartIn: Function;
        static quartOut: Function;
        static quartInOut: Function;
        static quintIn: Function;
        static quintOut: Function;
        static quintInOut: Function;
        static sineIn(t: any): number;
        static sineOut(t: any): number;
        static sineInOut(t: any): number;
        static getBackIn(amount: any): Function;
        static backIn: Function;
        static getBackOut(amount: any): Function;
        static backOut: Function;
        static getBackInOut(amount: any): Function;
        static backInOut: Function;
        static circIn(t: any): number;
        static circOut(t: any): number;
        static circInOut(t: any): number;
        static bounceIn(t: any): number;
        static bounceOut(t: any): number;
        static bounceInOut(t: any): number;
        static getElasticIn(amplitude: any, period: any): Function;
        static elasticIn: Function;
        static getElasticOut(amplitude: any, period: any): Function;
        static elasticOut: Function;
        static getElasticInOut(amplitude: any, period: any): Function;
        static elasticInOut: Function;
    }
}

/**
 * Created by yjtx on 15-5-18.
 */
declare module egret {
    /**
     * @private
     */
    interface IAudio {
        _setCurrentTime(value: number): void;
        _getCurrentTime(): number;
        _setVolume(value: number): void;
        _getVolume(): number;
        _setLoop(value: boolean): void;
        _play(type?: string): void;
        _pause(): void;
        _load(): void;
        _preload(type: string, callback?: Function, thisObj?: any): void;
        _addEventListener(type: string, listener: Function, useCapture?: boolean): void;
        _removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
        _destroy(): void;
    }
}

declare module egret {
    /**
     * @class egret.Sound
     * @classdesc Sound 类允许您在应用程序中使用声音。
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=157&terms1_id=25&terms2_id=36 播放音频
     * @event egret.SoundEvent.SOUND_COMPLETE 在声音完成播放后调度。
     * @includeExample egret/media/Sound.ts
     */
    class Sound extends egret.EventDispatcher {
        /**
         * 背景音乐
         * @constant egret.Sound.MUSIC
         */
        static MUSIC: string;
        /**
         * 音效
         * @constant egret.Sound.EFFECT
         */
        static EFFECT: string;
        /**
         * @private
         * @deprecated
         * @type {string}
         */
        path: string;
        /**
         * 创建一个 egret.Sound 对象
         */
        constructor();
        /**
         * audio音频对象
         * @member {any} egret.Sound#audio
         */
        private audio;
        /**
         * 类型，默认为 egret.Sound.EFFECT。
         * 在 native 和 runtime 环境下，背景音乐同时只能播放一个，音效长度尽量不要太长。
         * @member {any} egret.Sound#audio
         */
        type: string;
        /**
         * 当播放声音时，position 属性表示声音文件中当前播放的位置（以毫秒为单位）。
         * h5支持，native不支持
         * @returns {number}
         * @platform Web
         */
        position: number;
        /**
         * 播放声音
         * @param loop  是否循环播放，默认为false
         * @param position  是否从刚开始播放 h5支持，native不支持
         */
        play(loop?: boolean, position?: number): void;
        private _pauseTime;
        /**
         * 声音停止播放
         */
        stop(): void;
        /**
         * 暂停声音
         */
        pause(): void;
        /**
         * 继续从上次暂停的位置播放
         * h5支持，native不支持
         * @platform Web
         */
        resume(): void;
        /**
         * @private
         * 重新加载声音
         * @deprecated
         */
        load(): void;
        private _listeners;
        /**
         * 添加事件监听
         * h5支持，native不支持
         * @param type 事件类型
         * @param listener 监听函数
         * @param thisObj 侦听函数绑定的this对象
         * @platform Web,Native
         */
        addEventListener(type: string, listener: Function, thisObject: any): void;
        /**
         * 移除事件监听
         * h5支持，native不支持
         * @param type 事件类型
         * @param listener 监听函数
         * @param thisObj 侦听函数绑定的this对象
         * @platform Web,Native
         */
        removeEventListener(type: string, listener: Function, thisObject: any): void;
        private getVirtualType(type);
        /**
         * 音量范围从 0（静音）至 1（最大音量）。
         * h5支持，native不支持
         * @returns number
         * @platform Web
         */
        volume: number;
        /**
         * @private
         * @deprecated
         * 设置音量
         * @param value 值需大于0 小于等于 1
         */
        setVolume(value: number): void;
        /**
         * @private
         * @deprecated
         * 获取当前音量值
         * @returns number
         */
        getVolume(): number;
        /**
         * 将声音文件加载到内存，
         * native中使用，html5里为空实现
         * @param type 声音类型
         * @param callback 回调函数
         * @param thisObj 侦听函数绑定的this对象
         */
        preload(type: string, callback?: Function, thisObj?: any): void;
        _setAudio(value: IAudio): void;
        /**
         * 释放当前音频
         * native中使用，html5里为空实现
         */
        destroy(): void;
    }
}

declare module egret {
    class NumberUtils {
        /**
         * @private
         */
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
        private static cosInt(value);
    }
}
declare var egret_sin_map: {};
declare var egret_cos_map: {};

declare module egret {
    /**
     * @private
     */
    class PromiseObject {
        private static promiseObjectList;
        onSuccessFunc: Function;
        onSuccessThisObject: any;
        onErrorFunc: Function;
        onErrorThisObject: any;
        downloadingSizeFunc: Function;
        downloadingSizeThisObject: any;
        constructor();
        static create(): any;
        private onSuccess(...args);
        private onError(...args);
        private downloadingSize(...args);
        private destroy();
    }
}

declare module egret {
    /**
     * @private
     */
    interface IVersionController {
        fetchVersion(): void;
        checkIsNewVersion(url: string): boolean;
        saveVersion(url: string): void;
        /**
         * 获取所有有变化的文件
         * @returns {Array<string>}
         */
        getChangeList(): Array<string>;
        getVirtualUrl(url: string): string;
    }
}

