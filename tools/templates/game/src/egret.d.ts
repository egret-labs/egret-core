/// <reference path="../../egret/src/jslib/DEBUG.d.ts" />
/// <reference path="../../egret/src/jslib/Utils.d.ts" />
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @classdesc
    * IHashObject是哈希对象接口。引擎内所有接口的基类,为对象实例提供唯一的hashCode值,提高对象比较的性能。
    * 注意：自定义对象请直接继承HashObject，而不是实现此接口。否则会导致hashCode不唯一。
    * @interface
    * @class ns_egret.IHashObject
    */
    interface IHashObject {
        /**
        * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
        * @member {number} ns_egret.IHashObject#hashCode
        */
        hashCode: number;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.HashObject
    * @classdesc
    * @implements ns_egret.IHashObject
    */
    class HashObject implements IHashObject {
        /**
        * @method ns_egret.HashObject#constructor
        * @class ns_egret.HashObject
        * @classdesc 哈希对象。引擎内所有对象的基类，为对象实例提供唯一的hashCode值,提高对象比较的性能。
        */
        constructor();
        /**
        * 哈希计数
        */
        private static hashCount;
        private _hashCode;
        /**
        * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
        * @member {number} ns_egret.HashObject#hashCode
        */
        public hashCode : number;
    }
}
declare module ns_egret {
    /**
    * 对象缓存复用工具类，可用于构建对象池，一段时间后会自动回收对象。
    */
    class Recycler extends HashObject {
        constructor(autoDisposeTime?: number);
        static _callBackList: any[];
        /**
        * 多少帧后自动销毁对象。
        */
        private autoDisposeTime;
        private frameCount;
        public _checkFrame(): void;
        private objectPool;
        private _length;
        /**
        * 缓存的对象数量
        */
        public length : number;
        /**
        * 缓存一个对象以复用
        * @param object
        */
        public push(object: any): void;
        /**
        * 获取一个缓存的对象
        */
        public pop(): any;
        /**
        * 立即清空所有缓存的对象。
        */
        public dispose(): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    var __START_TIME: number;
    /**
    * 用于计算相对时间。此方法返回自启动 Egret 引擎以来经过的毫秒数。
    */
    function getTimer(): number;
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    var __callLaterFunctionList: any[];
    var __callLaterThisList: any[];
    var __callLaterArgsList: any[];
    /**
    * 延迟函数到屏幕重绘前执行。
    * @param method 要延迟执行的函数
    * @param thisObject 回调函数的this引用
    * @param args 函数参数列表
    */
    function callLater(method: Function, thisObject: any, ...args: any[]): void;
}
declare module ns_egret {
    /**
    *
    * @class ns_egret.IEventDispatcher
    * @interface
    * @classdesc IEventDispatcher是egret的事件派发器接口，负责进行事件的发送和侦听。
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
declare module ns_egret {
    class Event extends HashObject {
        /**
        * @class ns_egret.Event
        * @classdesc
        * Event 类作为创建 Event 对象的基类，当发生事件时，Event 对象将作为参数传递给事件侦听器。
        *
        * Event 类的属性包含有关事件的基本信息，例如事件的类型或者是否可以取消事件的默认行为。
        *
        * 对于许多事件（如由 Event 类常量表示的事件），此基本信息就足够了。但其他事件可能需要更详细的信息。
        * 例如，与触摸关联的事件需要包括有关触摸事件的位置以及在触摸事件期间是否按下了任何键的其他信息。
        * 您可以通过扩展 Event 类（TouchEvent 类执行的操作）将此类其他信息传递给事件侦听器。
        * Egret API 为需要其他信息的常见事件定义多个 Event 子类。与每个 Event 子类关联的事件将在每个类的文档中加以介绍。
        *
        * Event 类的方法可以在事件侦听器函数中使用以影响事件对象的行为。
        * 某些事件有关联的默认行为，通过调用 preventDefault() 方法，您的事件侦听器可以取消此行为。
        * 可以通过调用 stopPropagation() 或 stopImmediatePropagation() 方法，将当前事件侦听器作为处理事件的最后一个事件侦听器。
        * @param {string} type 事件的类型，可以作为 Event.type 访问。
        * @param bubbles{boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
        * @param cancelable{boolean} 确定是否可以取消 Event 对象。默认值为 false。
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
        * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
        * 以下方法会触发此事件：DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
        * @constant {string} ns_egret.Event.ADDED_TO_STAGE
        */
        static ADDED_TO_STAGE: string;
        /**
        * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。
        * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
        * @constant {string} ns_egret.Event.REMOVED_FROM_STAGE
        */
        static REMOVED_FROM_STAGE: string;
        /**
        * 将显示对象添加到显示列表中时调度。以下方法会触发此事件：
        * DisplayObjectContainer.addChild()、DisplayObjectContainer.addChildAt()。
        * @constant {string} ns_egret.Event.ADDED
        */
        static ADDED: string;
        /**
        * 将要从显示列表中删除显示对象时调度。DisplayObjectContainer 类的以下两个方法会生成此事件：removeChild() 和 removeChildAt()。
        * 如果必须删除某个对象来为新对象提供空间，则 DisplayObjectContainer 对象的下列方法也会生成此事件：addChild()、addChildAt() 和 setChildIndex()。
        * @constant {string} ns_egret.Event.REMOVED
        */
        static REMOVED: string;
        /**
        * 完成
        * @constant {string} ns_egret.Event.COMPLETE
        */
        static COMPLETE: string;
        /**
        * 主循环：进入新的一帧
        * @constant {string} ns_egret.Event.ENTER_FRAME
        */
        static ENTER_FRAME: string;
        /**
        * 主循环：开始渲染
        * @constant {string} ns_egret.Event.RENDER
        */
        static RENDER: string;
        /**
        * 主循环：渲染完毕
        * @constant {string} ns_egret.Event.FINISH_RENDER
        */
        static FINISH_RENDER: string;
        /**
        * 主循环：updateTransform完毕
        * @constant {string} ns_egret.Event.FINISH_UPDATE_TRANSFORM
        */
        static FINISH_UPDATE_TRANSFORM: string;
        /**
        * 离开舞台，参考Flash的Event.MOUSE_LEAVE
        * @constant {string} ns_egret.Event.LEAVE_STAGE
        */
        static LEAVE_STAGE: string;
        /**
        * 舞台尺寸发生改变
        * @constant {string} ns_egret.Event.RESIZE
        */
        static RESIZE: string;
        /**
        * 状态改变
        * @constant {string} ns_egret.Event.CHANGE
        */
        static CHANGE: string;
        public data: any;
        public _type: string;
        /**
        * 事件的类型。类型区分大小写。
        * @member {string} ns_egret.Event#type
        */
        public type : string;
        public _bubbles: boolean;
        /**
        * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
        * @member {boolean} ns_egret.Event#bubbles
        */
        public bubbles : boolean;
        private _cancelable;
        /**
        * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
        * @member {boolean} ns_egret.Event#cancelable
        */
        public cancelable : boolean;
        public _eventPhase: number;
        /**
        * 事件流中的当前阶段。此属性可以包含以下数值：
        * 捕获阶段 (EventPhase.CAPTURING_PHASE)。
        * 目标阶段 (EventPhase.AT_TARGET)。
        * 冒泡阶段 (EventPhase.BUBBLING_PHASE)。
        * @member {boolean} ns_egret.Event#eventPhase
        */
        public eventPhase : number;
        private _currentTarget;
        /**
        * 当前正在使用某个事件侦听器处理 Event 对象的对象。例如，如果用户单击“确定”按钮，
        * 则当前目标可以是包含该按钮的节点，也可以是它的已为该事件注册了事件侦听器的始祖之一。
        * @member {any} ns_egret.Event#currentTarget
        */
        public currentTarget : any;
        public _setCurrentTarget(target: any): void;
        public _target: any;
        /**
        * 事件目标。此属性包含目标节点。例如，如果用户单击“确定”按钮，则目标节点就是包含该按钮的显示列表节点。
        * @member {any} ns_egret.Event#target
        */
        public target : any;
        private _isDefaultPrevented;
        /**
        * 检查是否已对事件调用 preventDefault() 方法。
        * @method ns_egret.Event#isDefaultPrevented
        * @returns {boolean} 如果已调用 preventDefault() 方法，则返回 true；否则返回 false。
        */
        public isDefaultPrevented(): boolean;
        /**
        * 如果可以取消事件的默认行为，则取消该行为。
        * 许多事件都有默认执行的关联行为。例如，如果用户在文本字段中键入一个字符，则默认行为就是在文本字段中显示该字符。
        * 由于可以取消 TextEvent.TEXT_INPUT 事件的默认行为，因此您可以使用 preventDefault() 方法来防止显示该字符。
        * 注意：当cancelable属性为false时，此方法不可用。
        * @method ns_egret.Event#preventDefault
        */
        public preventDefault(): void;
        public _isPropagationStopped: boolean;
        /**
        * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 (currentTarget) 中的任何事件侦听器。
        * 相比之下，stopImmediatePropagation() 方法可以防止对当前节点中和后续节点中的事件侦听器进行处理。
        * 对此方法的其它调用没有任何效果。可以在事件流的任何阶段中调用此方法。
        * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
        * @method ns_egret.Event#stopPropagation
        */
        public stopPropagation(): void;
        public _isPropagationImmediateStopped: boolean;
        /**
        * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。此方法会立即生效，并且会影响当前节点中的事件侦听器。
        * 相比之下，在当前节点中的所有事件侦听器都完成处理之前，stopPropagation() 方法不会生效。
        * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
        * @method ns_egret.Event#stopImmediatePropagation
        */
        public stopImmediatePropagation(): void;
        private isNew;
        public _reset(): void;
        static _dispatchByTarget(EventClass: any, target: IEventDispatcher, type: string, props?: Object, bubbles?: boolean, cancelable?: boolean): boolean;
        static _getPropertyData(EventClass: any): any;
        /**
        * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.Event.dispatchEvent
        */
        static dispatchEvent(target: IEventDispatcher, type: string, bubbles?: boolean, data?: any): void;
    }
}
declare module ns_egret {
    class IOErrorEvent extends Event {
        static IO_ERROR: string;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
        * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.IOErrorEvent.dispathIOErrorEvent
        */
        static dispatchIOErrorEvent(target: IEventDispatcher): void;
    }
}
declare module ns_egret {
    /**
    *
    * @class ns_egret.EventDispatcher
    * @classdesc
    * EventDispatcher是egret的事件派发器类，负责进行事件的发送和侦听。
    * @extends ns_egret.HashObject
    * @implements ns_egret.IEventDispatcher
    *
    */
    class EventDispatcher extends HashObject implements IEventDispatcher {
        /**
        * EventDispatcher 类是可调度事件的所有类的基类。EventDispatcher 类实现 IEventDispatcher 接口
        * ，并且是 DisplayObject 类的基类。EventDispatcher 类允许显示列表上的任何对象都是一个事件目标，
        * 同样允许使用 IEventDispatcher 接口的方法。
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
        public _eventsMap: Object;
        /**
        * 引擎内部调用
        * @private
        */
        public _captureEventsMap: Object;
        /**
        * 引擎内部调用
        * @private
        */
        public _isUseCapture: boolean;
        /**
        * 添加事件侦听器
        * @method ns_egret.EventDispatcher#addEventListener
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
        public addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
        * 在一个事件列表中按优先级插入事件对象
        */
        public _insertEventBin(list: any[], listener: Function, thisObject: any, priority: number): boolean;
        /**
        * 移除事件侦听器
        * @method ns_egret.EventDispatcher#removeEventListener
        * @param type {string} 事件名
        * @param listener {Function} 侦听函数
        * @param thisObject {any} 侦听函数绑定的this对象
        * @param useCapture {boolean} 是否使用捕获，这个属性只在显示列表中生效。
        */
        public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        /**
        * 在一个事件列表中按优先级插入事件对象
        */
        public _removeEventBin(list: any[], listener: Function, thisObject: any): boolean;
        /**
        * 检测是否存在监听器
        * @method ns_egret.EventDispatcher#hasEventListener
        * @param type 事件名
        * @returns {boolean}
        * @stable A
        */
        public hasEventListener(type: string): boolean;
        /**
        * 检查是否用此 EventDispatcher 对象或其任何始祖为指定事件类型注册了事件侦听器。将指定类型的事件调度给此
        * EventDispatcher 对象或其任一后代时，如果在事件流的任何阶段触发了事件侦听器，则此方法返回 true。
        * hasEventListener() 与 willTrigger() 方法的区别是：hasEventListener() 只检查它所属的对象，
        * 而 willTrigger() 方法检查整个事件流以查找由 type 参数指定的事件。
        * @method ns_egret.EventDispatcher#willTrigger
        * @param type 事件名
        * @returns {boolean}
        */
        public willTrigger(type: string): boolean;
        /**
        * 将事件分派到事件流中。事件目标是对其调用 dispatchEvent() 方法的 EventDispatcher 对象。
        * @method ns_egret.EventDispatcher#dispatchEvent
        * @param event {ns_egret.Event} 调度到事件流中的 Event 对象。如果正在重新分派事件，则会自动创建此事件的一个克隆。 在调度了事件后，其 _eventTarget 属性将无法更改，因此您必须创建此事件的一个新副本以能够重新调度。
        * @returns {boolean} 如果成功调度了事件，则值为 true。值 false 表示失败或对事件调用了 preventDefault()。
        */
        public dispatchEvent(event: Event): boolean;
        public _notifyListener(event: Event): boolean;
        private static eventRecycler;
        /**
        * 派发一个包含了特定参数的事件到所有注册了特定类型侦听器的对象中。 这个方法使用了一个内部的事件对象池因避免重复的分配导致的额外开销。
        * @method ns_egret.EventDispatcher#dispatchEventWith
        * @param type {string} 事件类型
        * @param bubbles {boolean} 是否冒泡，默认false
        * @param data {any}附加数据(可选)
        */
        public dispatchEventWith(type: string, bubbles?: boolean, data?: Object): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Ticker
    * @classdesc
    * Ticker是egret引擎的心跳控制器，是游戏唯一的时间处理入口。开发者务必不要使用setTimeout / setInterval 等方法，而是统一使用Ticker
    * @extends ns_egret.EventDispatcher
    */
    class Ticker extends EventDispatcher {
        private _timeScale;
        private _paused;
        /**
        * 启动心跳控制器。
        * 这个函数应只在游戏初始化时调用一次
        * @method ns_egret.Ticker#run
        * @stable A
        */
        public run(): void;
        private update(advancedTime);
        private callBackList;
        /**
        * 注册帧回调事件，同一函数的重复监听会被忽略。
        * @method ns_egret.Ticker#register
        * @param listener {Function} 帧回调函数,参数返回上一帧和这帧的间隔时间。示例：onEnterFrame(frameTime:number):void
        * @param thisObject {any} 帧回调函数的this对象
        * @param priority {any} 事件优先级，开发者请勿传递 Number.MAX_VALUE 和 Number.MIN_VALUE
        * @stable A-
        */
        public register(listener: Function, thisObject: any, priority?: number): void;
        /**
        * 取消侦听enterFrame事件
        * @method ns_egret.Ticker#unregister
        * @param listener {Function} 事件侦听函数
        * @param thisObject {an} 侦听函数的this对象
        * @stable A-
        */
        public unregister(listener: Function, thisObject: any): void;
        /**
        * 在指定的延迟（以毫秒为单位）后运行指定的函数。
        * @method ns_egret.Ticker#setTimeout
        * @param listener {Function}
        * @param thisObject {any}
        * @param delay {Number}
        * @param ...parameter {any}
        */
        public setTimeout(listener: Function, thisObject: any, delay: Number, ...parameters: any[]): void;
        /**
        * @method ns_egret.Ticker#setTimeScale
        * @param timeScale {number}
        */
        public setTimeScale(timeScale: number): void;
        /**
        * @method ns_egret.Ticker#getTimeScale
        */
        public getTimeScale(): number;
        /**
        * @method ns_egret.Ticker#pause
        */
        public pause(): void;
        /**
        * @method ns_egret.Ticker#resume
        */
        public resume(): void;
        private static instance;
        /**
        * @method ns_egret.Ticker.getInstance
        * @returns {Ticker}
        */
        static getInstance(): Ticker;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.DeviceContext
    * @classdesc
    * @extends ns_egret.HashObject
    */
    class DeviceContext extends HashObject {
        /**
        * @member ns_egret.DeviceContext#frameRate
        */
        public frameRate: number;
        /**
        * @method ns_egret.DeviceContext#constructor
        */
        constructor();
        /**
        * @method ns_egret.DeviceContext#executeMainLoop
        * @param callback {Function}
        * @param thisObject {any}
        */
        public executeMainLoop(callback: Function, thisObject: any): void;
    }
}
declare module ns_egret {
    /**
    *
    * @class ns_egret.TouchContext
    * @classdesc TouchContext是egret的触摸Context
    */
    class TouchContext extends HashObject {
        private _currentTouchTarget;
        public maxTouches: number;
        private touchDownTarget;
        constructor();
        /**
        * 启动触摸检测
        * @method ns_egret.TouchContext#run
        */
        public run(): void;
        public getTouchData(identifier: any, x: any, y: any): any;
        public dispatchEvent(type: string, data: any): void;
        public onTouchBegan(x: number, y: number, identifier: number): void;
        public onTouchMove(x: number, y: number, identifier: number): void;
        public onTouchEnd(x: number, y: number, identifier: number): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.URLLoaderDataFormat
    * @classdesc
    */
    class URLLoaderDataFormat {
        /**
        * 指定以原始二进制数据形式接收下载的数据。
        * @constant {string} ns_egret.URLLoaderDataFormat.BINARY
        */
        static BINARY: string;
        /**
        * 指定以文本形式接收已下载的数据。
        * @constant {string} ns_egret.URLLoaderDataFormat.TEXT
        */
        static TEXT: string;
        /**
        * 指定以 URL 编码变量形式接收下载的数据。
        * @constant {string} ns_egret.URLLoaderDataFormat.VARIABLES
        */
        static VARIABLES: string;
        /**
        * 指定以位图纹理形式接收已下载的数据。
        * @constant {string} ns_egret.URLLoaderDataFormat.TEXTURE
        */
        static TEXTURE: string;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.URLRequestMethod
    * @classdesc
    */
    class URLRequestMethod {
        /**
        * 表示 URLRequest 对象是一个 GET。
        * @constant {string} ns_egret.URLRequestMethod.GET
        */
        static GET: string;
        /**
        * 表示 URLRequest 对象是一个 POST。
        * @constant {string} ns_egret.URLRequestMethod.POST
        */
        static POST: string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.URLRequest
    * @classdesc
    * @extends ns_egret.HashObject
    */
    class URLRequest extends HashObject {
        /**
        * @method ns_egret.URLRequest#constructor
        * @param url {string}
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
        * @member {any} ns_egret.URLRequest#data
        */
        public data: any;
        /**
        * 请求方式，有效值为URLRequestMethod.GET 或 URLRequestMethod.POST。
        * @member {string} ns_egret.URLRequest#method
        */
        public method: string;
        /**
        * 所请求的 URL。
        * @member {string} ns_egret.URLRequest#url
        */
        public url: string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.URLLoader
    * @classdesc
    * URLLoader 类以文本、二进制数据或 URL 编码变量的形式从 URL 下载数据。在下载文本文件、XML 或其他用于动态数据驱动应用程序的信息时，它很有用。
    * URLLoader 对象会先从 URL 中下载所有数据，然后才将数据用于应用程序中的代码。它会发出有关下载进度的通知，
    * 通过 bytesLoaded 和 bytesTotal 属性以及已调度的事件，可以监视下载进度。
    * @extends ns_egret.EventDispatcher
    */
    class URLLoader extends EventDispatcher {
        /**
        * @method ns_egret.URLLoader#constructor
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
        * @member {string} ns_egret.URLLoader#dataFormat
        */
        public dataFormat: string;
        /**
        * 从加载操作接收的数据。只有完成加载操作时，才会填充该属性。该数据的格式取决于 dataFormat 属性的设置：
        * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXT，则所接收的数据是一个包含已加载文件文本的字符串。
        * 如果 dataFormat 属性是 URLLoaderDataFormat.BINARY，则所接收的数据是一个包含原始二进制数据的 ByteArray 对象。
        * 如果 dataFormat 属性是 URLLoaderDataFormat.TEXTURE，则所接收的数据是一个包含位图数据的Texture对象。
        * 如果 dataFormat 属性是 URLLoaderDataFormat.VARIABLES，则所接收的数据是一个包含 URL 编码变量的 URLVariables 对象。
        * @member {any} ns_egret.URLLoader#data
        */
        public data: any;
        public _request: URLRequest;
        /**
        * 从指定的 URL 发送和加载数据。可以以文本、原始二进制数据或 URL 编码变量格式接收数据，这取决于为 dataFormat 属性所设置的值。
        * 请注意 dataFormat 属性的默认值为文本。如果想将数据发送至指定的 URL，则可以在 URLRequest 对象中设置 data 属性。
        * @method ns_egret.URLLoader#load
        * @param request {URLRequest}
        */
        public load(request: URLRequest): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.NetContext
    * @classdesc
    * @extends ns_egret.HashObject
    */
    class NetContext extends HashObject {
        constructor();
        public proceed(loader: URLLoader): void;
    }
}
declare module ns_egret {
    /**
    * @class Texture
    * 纹理类是对不同平台不同的图片资源的封装
    * 在HTML5中，资源是一个HTMLElement对象
    * 在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理id
    * Texture类封装了这些底层实现的细节，开发者只需要关心接口即可
    */
    class Texture extends HashObject {
        constructor();
        public offsetX: number;
        public offsetY: number;
        public _textureWidth: number;
        public _textureHeight: number;
        public _bitmapData: any;
        public bitmapData : any;
        public getTextureWidth(): number;
        public getTextureHeight(): number;
        static createWithBase64(base64: string): Texture;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Point
    * @classdesc
    * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
    * @extends ns_egret.HashObject
    */
    class Point extends HashObject {
        static identity: Point;
        /**
        * @method ns_egret.Point#constructor
        * @param x {number}
        * @param y {number}
        */
        constructor(x?: number, y?: number);
        /**
        * 该点的水平坐标。默认值为 0。
        * @constant ns_egret.Point#x
        */
        public x: number;
        /**
        * 该点的垂直坐标。默认值为 0。
        * @constant ns_egret.Point#y
        */
        public y: number;
        /**
        * 克隆点对象
        * @method ns_egret.Point#clone
        * @returns {Point}
        */
        public clone(): Point;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Rectangle
    * @classdesc
    * 矩形类
    * @extends ns_egret.HashObject
    */
    class Rectangle extends HashObject {
        constructor(x?: number, y?: number, width?: number, height?: number);
        /**
        * 矩形x坐标
        * @constant ns_egret.Rectangle#x
        */
        public x: number;
        /**
        * 矩形y坐标
        * @constant ns_egret.Rectangle#y
        */
        public y: number;
        /**
        * 矩形宽度
        * @member ns_egret.Rectangle#width
        */
        public width: number;
        /**
        * 矩形高度
        * @member ns_egret.Rectangle#height
        */
        public height: number;
        /**
        * x和width的和
        * @member ns_egret.Rectangle#right
        */
        public right : number;
        /**
        * y和height的和
        * @member ns_egret.Rectangle#bottom
        */
        public bottom : number;
        /**
        * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
        * @param x
        * @param y
        * @param width
        * @param height
        * @returns {ns_egret.Rectangle}
        */
        public initialize(x: number, y: number, width: number, height: number): Rectangle;
        /**
        * 判断某坐标点是否存在于矩形内
        * @method ns_egret.Rectangle#contains
        * @param x {number}
        * @param y {number}
        * @returns {boolean}
        */
        public contains(x: number, y: number): boolean;
        /**
        * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
        * @method ns_egret.Rectangle#intersects
        * @param toIntersect {Rectangle} 要与此 Rectangle 对象比较的 Rectangle 对象。
        * @returns {boolean}
        */
        public intersects(toIntersect: Rectangle): boolean;
        /**
        * 克隆矩形对象
        * @method ns_egret.Rectangle#clone
        * @stable C 倾向于废除此API，方式开发者滥用，降低游戏性能
        */
        public clone(): Rectangle;
        /**
        * 引擎内部用于函数传递返回值的全局矩形对象，开发者请勿随意修改此对象
        * @method ns_egret.Rectangle.identity
        * @param new Rectangle(0 {any}
        * @param 0 {any}
        * @param 0 {any}
        */
        static identity: Rectangle;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Matrix
    * @classdesc
    * 2D矩阵类，包括常见矩阵算法
    * @extends ns_egret.HashObject
    */
    class Matrix extends HashObject {
        public a: number;
        public b: number;
        public c: number;
        public d: number;
        public tx: number;
        public ty: number;
        /**
        * @constructor
        * @param public a {any}
        * @param public b {any}
        * @param public c {any}
        * @param public d {any}
        * @param public tx {any}
        * @param public ty {any}
        */
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        static identity: Matrix;
        static DEG_TO_RAD: number;
        /**
        * 前置矩阵
        * @param a
        * @param b
        * @param c
        * @param d
        * @param tx
        * @param ty
        * @returns {ns_egret.Matrix}
        */
        public prepend(a: any, b: any, c: any, d: any, tx: any, ty: any): Matrix;
        /**
        * 后置矩阵
        * @param a
        * @param b
        * @param c
        * @param d
        * @param tx
        * @param ty
        * @returns {ns_egret.Matrix}
        */
        public append(a: any, b: any, c: any, d: any, tx: any, ty: any): Matrix;
        /**
        * 前置矩阵
        * @param matrix
        * @returns {ns_egret.Matrix}
        */
        public prependMatrix(matrix: any): Matrix;
        /**
        * 后置矩阵
        * @param matrix
        * @returns {ns_egret.Matrix}
        */
        public appendMatrix(matrix: any): Matrix;
        /**
        * 前置矩阵
        * @param matrix
        * @returns {ns_egret.Matrix}
        */
        public prependTransform(x: any, y: any, scaleX: any, scaleY: any, rotation: any, skewX: any, skewY: any, regX: any, regY: any): Matrix;
        /**
        * 后置矩阵
        * @param matrix
        * @returns {ns_egret.Matrix}
        */
        public appendTransform(x: any, y: any, scaleX: any, scaleY: any, rotation: any, skewX: any, skewY: any, regX: any, regY: any): Matrix;
        /**
        * @method ns_egret.Matrix#appendTransformFromDisplay
        * @param target {ns_egret.DisplayObjec}
        */
        public appendTransformFromDisplay(target: DisplayObject): Matrix;
        /**
        * 矩阵旋转，以角度制为单位
        * @param angle
        * @returns {ns_egret.Matrix}
        */
        public rotate(angle: any): Matrix;
        /**
        * 矩阵斜切，以角度值为单位
        * @param skewX
        * @param skewY
        * @returns {ns_egret.Matrix}
        */
        public skew(skewX: any, skewY: any): Matrix;
        /**
        * 矩阵缩放
        * @param x
        * @param y
        * @returns {ns_egret.Matrix}
        */
        public scale(x: any, y: any): Matrix;
        /**
        * 矩阵唯一
        * @param x
        * @param y
        * @returns {ns_egret.Matrix}
        */
        public translate(x: any, y: any): Matrix;
        /**
        * 矩阵重置
        * @returns {ns_egret.Matrix}
        */
        public identity(): Matrix;
        /**
        * 矩阵翻转
        */
        public invert: () => Matrix;
        public isIdentity(): boolean;
        public transformPoint(x: any, y: any, pt: any): any;
        public decompose(target: any): any;
        /**
        * 根据一个矩阵，返回某个点在该矩阵上的坐标
        * @param matrix
        * @param x
        * @param y
        * @returns {Point}
        * @stable C 该方法以后可能删除
        */
        static transformCoords(matrix: Matrix, x: number, y: number): Point;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * 转换数字为颜色字符串
    */
    function toColorString(value: number): string;
}
declare module ns_egret {
    /**
    * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
    * 如果开发者希望所有平台完全无差异，请使用BitmapText
    * @todo GitHub 为什么文本渲染存在差异以及如何规避
    */
    class TextField extends DisplayObject {
        /**
        * 显示文本
        */
        public text: string;
        /**
        * 字体
        */
        public fontFamily: string;
        /**
        * 字号
        */
        public size: number;
        public _textColorString: string;
        private _textColor;
        /**
        * 文字颜色
        */
        public textColor : number;
        public _strokeColorString: string;
        private _strokeColor;
        /**
        * 描边颜色
        */
        public strokeColor : number;
        /**
        * 描边宽度，0为没有描边
        */
        public stroke: number;
        /**
        * 文本水平对齐方式,使用HorizontalAlign定义的常量，默认值HorizontalAlign.LEFT。
        * @stable B API名称可能修改
        */
        public textAlign: string;
        /**
        * 文本垂直对齐方式,使用VerticalAlign定义的常量，默认值VerticalAlign.TOP。
        * @stable B API名称可能修改
        */
        public verticalAlign: string;
        /**
        * 文本基准线
        * @stable B 可能移除，用户不需要设置这个属性。
        */
        public textBaseline: any;
        public maxWidth: any;
        /**
        * 行间距
        */
        public lineSpacing: number;
        /**
        * 字符间距
        */
        public letterSpacing: number;
        private _numLines;
        /**
        * 文本行数
        */
        public numLines : number;
        private __hackIgnoreDrawText;
        constructor();
        /**
        * @see egret.DisplayObject.render
        * @param renderContext
        */
        public _render(renderContext: RendererContext): void;
        /**
        * 测量显示对象坐标与大小
        */
        public _measureBounds(): Rectangle;
        /**
        * @private
        * @param renderContext
        * @returns {Rectangle}
        */
        private drawText(renderContext, forMeasureContentSize?);
        /**
        * 渲染单行文字
        * @private
        * @param renderContext
        * @param text
        * @param y
        * @private
        */
        public _drawTextLine(renderContext: RendererContext, text: any, y: any, maxWidth: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Profiler
    * @classdesc
    * Profiler是egret的性能检测分析类
    * @todo GitHub文档，如何使用Profiler
    */
    class Profiler {
        private static instance;
        static getInstance(): Profiler;
        private _lastTime;
        private _logicPerformanceCost;
        private _renderPerformanceCost;
        private _updateTransformPerformanceCost;
        private _preDrawCount;
        private _txt;
        private _tick;
        private _maxDeltaTime;
        private _totalDeltaTime;
        /**
        * 启动Profiler
        * @method ns_egret.Profiler#run
        */
        public run(): void;
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
        * @method ns_egret.Profiler#onDrawImage
        * @private
        */
        public onDrawImage(): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.RendererContext
    * @classdesc
    * RenderContext是游戏的渲染上下文。
    * 这是一个抽象基类，制定主要的接口
    * @extends ns_egret.HashObject
    */
    class RendererContext extends HashObject {
        /**
        * 渲染全部纹理的时间开销
        * @member ns_egret.RendererContext#renderCost
        */
        public renderCost: number;
        /**
        * 绘制纹理的缩放比率，默认值为1
        * @member ns_egret.RendererContext#texture_scale_factor
        */
        public texture_scale_factor: number;
        /**
        * @method ns_egret.RendererContext#constructor
        */
        constructor();
        /**
        * @method ns_egret.RendererContext#clearScreen
        * @private
        */
        public clearScreen(): void;
        /**
        * 清除Context的渲染区域
        * @method ns_egret.RendererContext#clearRect
        * @param x {number}
        * @param y {number}
        * @param w {number}
        * @param h {numbe}
        */
        public clearRect(x: number, y: number, w: number, h: number): void;
        /**
        * 绘制图片
        * @method ns_egret.RendererContext#drawImage
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
        public drawImage(texture: Texture, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any): void;
        /**
        * 变换Context的当前渲染矩阵
        * @method ns_egret.RendererContext#setTransform
        * @param matrix {ns_egret.Matri}
        */
        public setTransform(matrix: Matrix): void;
        /**
        * @method ns_egret.RendererContext#save
        * @stable C 这个方法以后会和restore一起删除，移动到HTML5CanvasContext的具体实现中，而不是作为一个接口
        */
        public save(): void;
        /**
        * @method ns_egret.RendererContext#restore
        * @stable C 这个方法以后会和save一起删除，移动到HTML5CanvasContext的具体实现中，而不是作为一个接口
        */
        public restore(): void;
        /**
        * 设置渲染alpha
        * @method ns_egret.RendererContext#setAlpha
        * @param value {number}
        * @param blendMode {ns_egret.BlendMod}
        */
        public setAlpha(value: number, blendMode: BlendMode): void;
        /**
        * 设置渲染文本参数
        * @method ns_egret.RendererContext#setupFont
        * @param textField {TextField}
        */
        public setupFont(textField: TextField): void;
        /**
        * 测量文本
        * @method ns_egret.RendererContext#measureText
        * @param text {any}
        * @returns {number}
        * @stable B 参数很可能会需要调整，和setupFont整合
        */
        public measureText(text: any): number;
        /**
        * 绘制文本
        * @method ns_egret.RendererContext#drawText
        * @param textField {ns_egret.TextField}
        * @param text {string}
        * @param x {number}
        * @param y {number}
        * @param maxWidth {numbe}
        */
        public drawText(textField: TextField, text: string, x: number, y: number, maxWidth: number): void;
        /**
        * 矩形遮罩
        * @method ns_egret.RendererContext#clip
        * @param x {any}
        * @param y {any}
        * @param w {any}
        */
        public clip(x: any, y: any, w: any, h: any): void;
        /**
        * @param x
        * @param y
        * @param w
        * @param h
        * @param color
        * @stable D 这个API是个临时添加的，会被尽快删除
        */
        public strokeRect(x: any, y: any, w: any, h: any, color: any): void;
    }
    /**
    * @class ns_egret.BlendMode
    * @classdesc
    */
    class BlendMode {
        private type;
        /**
        * @member ns_egret.BlendMode#value
        */
        public value: string;
        constructor(type: any);
        static NORMAL: BlendMode;
        static ADD: BlendMode;
        static LAYER: BlendMode;
        /**
        * @method ns_egret.BlendMode.getBlendMode
        * @param typ {any}
        */
        static getBlendMode(type: any): any;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.SoundContext
    * @classdesc
    * @extends ns_egret.HashObject
    */
    class SoundContext extends HashObject {
        /**
        * @method ns_egret.SoundContext.getInstance
        * @returns {SoundContext}
        */
        static getInstance(): SoundContext;
        /**
        * @member ns_egret.SoundContext.isMusicPlaying
        */
        static isMusicPlaying: boolean;
        /**
        * @method ns_egret.SoundContext#constructor
        */
        constructor();
        /**
        * @method ns_egret.SoundContext#preloadSound
        * @param pat {any}
        */
        public preloadSound(path: any): void;
        /**
        * @method ns_egret.SoundContext#playMusic
        * @param path {any}
        * @param loop {any}
        */
        public playMusic(path: any, loop?: boolean): void;
        /**
        * @method ns_egret.SoundContext#stopMusic
        * @param releaseDat {any}
        */
        public stopMusic(releaseData: any): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.Logger
    * @classdesc
    * Logger是引擎的日志处理模块入口
    * @stable B 目前Logger的接口设计没有问题，但是考虑到跨平台，需要将其改为一个Context，并且允许开发者自由扩展以实现自身游戏的日志分析收集需求
    * todo:GitHub文档，如何利用日志帮助游戏持续改进
    */
    class Logger {
        /**
        * 表示出现了致命错误，开发者必须修复错误
        * @method ns_egret.Logger.fatal
        * @param actionCode {string}
        * @param value {Object}
        */
        static fatal(actionCode: string, value?: Object): void;
        /**
        * 记录正常的Log信息
        * @method ns_egret.Logger.info
        * @param actionCode {string}
        * @param value {Object}
        */
        static info(actionCode: string, value?: Object): void;
        /**
        * 记录可能会出现问题的Log信息
        * @method ns_egret.Logger.warning
        * @param actionCode {string}
        * @param value {Object}
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
}
declare module ns_egret {
    /**
    * DisplayObjectContainer 类是显示列表中显示对象容器。
    */
    class DisplayObjectContainer extends DisplayObject {
        constructor();
        public _touchChildren: boolean;
        /**
        * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
        */
        public touchChildren : boolean;
        public _children: DisplayObject[];
        public numChildren : number;
        /**
        * 修改 容器内子元件的 层级
        * @param child 容器的子元件
        * @param index 新的层级 <0或者>=元件数量，都加入到最上层
        */
        public setChildIndex(child: DisplayObject, index: number): void;
        private doSetChildIndex(child, index);
        /**
        * @inheritDoc
        */
        public addChild(child: DisplayObject): DisplayObject;
        /**
        * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。
        * todo:GitHub 显示列表
        * @param child 子显示对象
        * @param index 加载的顺序，默认为-1，加载到最前面
        */
        public addChildAt(child: DisplayObject, index: number): DisplayObject;
        public _doAddChild(child: DisplayObject, index: number, notifyListeners?: boolean): DisplayObject;
        /**
        * 将一个 DisplayObject 子实例从 DisplayObjectContainer 实例中移除。
        * @param child
        */
        public removeChild(child: DisplayObject): DisplayObject;
        public removeChildAt(index: number): DisplayObject;
        public _doRemoveChild(index: number, notifyListeners?: boolean): DisplayObject;
        /**
        * 通过索引获取显示对象
        * @param index
        * @returns {*}
        */
        public getChildAt(index: number): DisplayObject;
        /**
        *  确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身。搜索包括整个显示列表（其中包括此 DisplayObjectContainer 实例）。孙项、曾孙项等，每项都返回 true。
        * @param child 要测试的子对象。
        */
        public contains(child: DisplayObject): boolean;
        /**
        * 根据子对象的name属性获取对象
        * @param name
        * @returns {null}
        */
        public getChildByName(name: string): DisplayObject;
        public swapChildrenAt(index1: number, index2: number): void;
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        private _swapChildrenAt(index1, index2);
        /**
        * 获得 容器内元件的层级
        * @param child
        * @returns -1不在容器内 >=0 在容器里
        */
        public getChildIndex(child: DisplayObject): number;
        /**
        * 移除所有显示对象
        */
        public removeChildren(): void;
        public _updateTransform(): void;
        public _render(renderContext: RendererContext): void;
        /**
        * @see egret.DisplayObject._measureBounds
        * @returns {null}
        * @private
        */
        public _measureBounds(): Rectangle;
        /**
        * @see egret.DisplayObject.hitTest
        * @param x
        * @param y
        * @returns {DisplayObject}
        */
        public hitTest(x: number, y: number, ignoreTouchEnabled?: boolean): DisplayObject;
        public _onAddToStage(): void;
        public _onRemoveFromStage(): void;
    }
}
declare module ns_egret {
    class Stage extends DisplayObjectContainer {
        static _invalidateRenderFlag: boolean;
        /**
        * 调用 invalidate() 方法后，在显示列表下次呈现时，Egret 会向每个已注册侦听 render 事件的显示对象发送一个 render 事件。
        * 每次您希望 Egret 发送 render 事件时，都必须调用 invalidate() 方法。
        */
        public invalidate(): void;
        constructor(width: number, height: number);
        /**
        * 设置舞台宽高
        */
        public _setStageSize(width: number, height: number): void;
        private _stageWidth;
        /**
        * 舞台宽度（坐标系宽度，非设备宽度）
        */
        public stageWidth : number;
        private _stageHeight;
        /**
        * 舞台高度（坐标系高度，非设备高度）
        */
        public stageHeight : number;
        /**
        * @see egret.DisplayObject.hitTest
        * @param x
        * @param y
        * @returns {DisplayObject}
        */
        public hitTest(x: any, y: any): DisplayObject;
        /**
        * @see egret.DisplayObject.getBounds
        * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
        * @returns {Rectangle}
        */
        public getBounds(resultRect?: Rectangle): Rectangle;
        public _updateTransform(): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.MainContext
    * @classdesc
    * MainContext是游戏的核心跨平台接口，组合了多个功能Context，并是游戏启动的主入口
    * @extends ns_egret.EventDispatcher
    */
    class MainContext extends EventDispatcher {
        constructor();
        /**
        * 渲染Context
        * @member ns_egret.MainContext#rendererContext
        */
        public rendererContext: RendererContext;
        /**
        * 触摸Context
        * @member ns_egret.MainContext#touchContext
        */
        public touchContext: TouchContext;
        /**
        * 声音Context
        * @member ns_egret.MainContext#soundContext
        */
        public soundContext: SoundContext;
        /**
        * 网络Context
        * @member ns_egret.MainContext#netContext
        */
        public netContext: NetContext;
        /**
        * 设备divice
        * @member ns_egret.MainContext#deviceContext
        */
        public deviceContext: DeviceContext;
        /**
        * 舞台
        * @member ns_egret.MainContext#stage
        */
        public stage: Stage;
        /**
        * 游戏启动，开启主循环，参考Flash的滑动跑道模型
        * @method ns_egret.MainContext#run
        */
        public run(): void;
        /**
        * 滑动跑道模型，渲染部分
        */
        private renderLoop(frameTime);
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
        private doCallLaterList();
        /**
        * @member ns_egret.MainContext.instance
        */
        static instance: MainContext;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.RenderFilter
    * @classdesc
    * @extends ns_egret.HashObject
    */
    class RenderFilter extends HashObject {
        constructor();
        private static instance;
        /**
        * @method ns_egret.ns_egret.getInstance
        * @returns {RenderFilter}
        */
        static getInstance(): RenderFilter;
        public _drawAreaList: Rectangle[];
        private _defaultDrawAreaList;
        private _originalData;
        /**
        * @method ns_egret.ns_egret#addDrawArea
        * @param area {ns_egret.Rectangle}
        */
        public addDrawArea(area: Rectangle): void;
        /**
        * @method ns_egret.ns_egret#clearDrawArea
        */
        public clearDrawArea(): void;
        /**
        * 先检查有没有不需要绘制的区域，再把需要绘制的区域绘制出来
        * @method ns_egret.ns_egret#drawImage
        * @param renderContext {any}
        * @param data {RenderData}
        * @param sourceX {any}
        * @param sourceY {any}
        * @param sourceWidth {any}
        * @param sourceHeight {any}
        * @param destX {any}
        * @param destY {any}
        * @param destWidth {any}
        * @param destHeight {any}
        */
        public drawImage(renderContext: any, data: RenderData, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any): void;
        private ignoreRender(data, rect, destX, destY);
        /**
        * @method ns_egret.ns_egret#getDrawAreaList
        * @returns {Rectangle}
        */
        public getDrawAreaList(): Rectangle[];
    }
    /**
    * @class ns_egret.RenderData
    * @interface
    * @classdesc
    */
    interface RenderData {
        /**
        * @member ns_egret.RenderData#worldTransform
        */
        worldTransform: Matrix;
        /**
        * @member ns_egret.RenderData#worldBounds
        */
        worldBounds: Rectangle;
        _texture_to_render: Texture;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.HTML5CanvasRenderer
    * @classdesc
    * @extends ns_egret.RendererContext
    */
    class HTML5CanvasRenderer extends RendererContext {
        private canvas;
        /**
        * @member ns_egret.HTML5CanvasRenderer#canvasContext
        */
        public canvasContext: any;
        private _matrixA;
        private _matrixB;
        private _matrixC;
        private _matrixD;
        private _matrixTx;
        private _matrixTy;
        public _transformTx: number;
        public _transformTy: number;
        private blendValue;
        constructor(canvas: any);
        public clearScreen(): void;
        public clearRect(x: number, y: number, w: number, h: number): void;
        public drawImage(texture: Texture, sourceX: any, sourceY: any, sourceWidth: any, sourceHeight: any, destX: any, destY: any, destWidth: any, destHeight: any): void;
        public setTransform(matrix: Matrix): void;
        public save(): void;
        public restore(): void;
        public setAlpha(alpha: number, blendMode: BlendMode): void;
        public setupFont(textField: TextField): void;
        public measureText(text: any): number;
        public drawText(textField: TextField, text: string, x: number, y: number, maxWidth: number): void;
        public clip(x: any, y: any, w: any, h: any): void;
        public strokeRect(x: any, y: any, w: any, h: any, color: any): void;
    }
}
declare module ns_egret {
    class RenderTexture extends Texture {
        private cacheCanvas;
        constructor();
        public drawToTexture(displayObject: DisplayObject): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    class NumberUtils {
        static isNumber(value: any): Boolean;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.DisplayObject
    * @extends ns_egret.EventDispatcher
    * @classdesc 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时显示的所有对象。使用 DisplayObjectContainer 类排列显示列表中的显示对象。
    *
    * DisplayObjectContainer 对象可以有子显示对象，而其他显示对象是“叶”节点，只有父级和同级，没有子级。
    *
    * DisplayObject 类支持基本功能（如对象的 x 和 y 位置），也支持更高级的对象属性（如它的转换矩阵），所有显示对象都继承自 DisplayObject 类。
    *
    * DisplayObject 类包含若干广播事件。通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。
    *
    * 若只有一个目标，则会将事件侦听器限制为只能放置到该目标上（在某些情况下，可放置到显示列表中该目标的祖代上），这意味着您可以向任何 DisplayObject 实例添加侦听器来侦听广播事件。
    *
    * 任何继承自DisplayObject的类都必须实现以下方法
    * _render();
    * _measureBounds()
    * 不允许重写以下方法
    * _draw();
    * getBounds();
    *
    */
    class DisplayObject extends EventDispatcher implements RenderData {
        constructor();
        public name: string;
        public _texture_to_render: Texture;
        public _parent: DisplayObjectContainer;
        /**
        * 11111
        * @event ns_egret.Event.event:ADDED_TO_STAGE
        */
        private _cacheAsBitmap;
        /**
        * 表示包含此显示对象的 DisplayObjectContainer 对象
        * @member {ns_egret.DisplayObjectContainer} ns_egret.DisplayObject#parent
        */
        public parent : DisplayObjectContainer;
        /**
        * 仅供框架内部调用。
        */
        public _parentChanged(parent: DisplayObjectContainer): void;
        public _x: number;
        /**
        * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
        * @member {number} ns_egret.DisplayObject#x
        */
        public x : number;
        public _y: number;
        /**
        * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
        * @member {number} ns_egret.DisplayObject#y
        */
        public y : number;
        /**
        * 表示从注册点开始应用的对象的水平缩放比例（百分比）。
        * @member {number} ns_egret.DisplayObject#scaleX
        * @default 1
        */
        public _scaleX: number;
        public scaleX : number;
        /**
        * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。
        * @member {number} ns_egret.DisplayObject#scaleY
        * @default 1
        */
        public _scaleY: number;
        public scaleY : number;
        /**
        * 表示从对象绝对锚点X。
        * @member {number} ns_egret.DisplayObject#anchorOffsetX
        * @default 0
        */
        public _anchorOffsetX: number;
        public anchorOffsetX : number;
        /**
        * 表示从对象绝对锚点Y。
        * @member {number} ns_egret.DisplayObject#anchorOffsetY
        * @default 0
        */
        public _anchorOffsetY: number;
        public anchorOffsetY : number;
        /**
        * 表示从对象相对锚点X。
        * @member {number} ns_egret.DisplayObject#anchorX
        * @default 0
        */
        public _anchorX: number;
        public anchorX : number;
        /**
        * 表示从对象相对锚点Y。
        * @member {number} ns_egret.DisplayObject#anchorY
        * @default 0
        */
        public _anchorY: number;
        public anchorY : number;
        /**
        * 显示对象是否可见。
        * @member {boolean} ns_egret.DisplayObject#x
        */
        public visible: boolean;
        /**
        * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位
        * @member {number} ns_egret.DisplayObject#rotation
        * @default 0
        */
        public _rotation: number;
        public rotation : number;
        /**
        * 表示指定对象的 Alpha 透明度值
        * @member {number} ns_egret.DisplayObject#alpha
        *  @default 1
        */
        public _alpha: number;
        public alpha : number;
        /**
        * 表示DisplayObject的x方向斜切
        * @member {number} ns_egret.DisplayObject#skewX
        * @default 0
        */
        private _skewX;
        public skewX : number;
        /**
        * 表示DisplayObject的y方向斜切
        * @member {number} ns_egret.DisplayObject#skewY
        * @default 0
        */
        private _skewY;
        public skewY : number;
        public _touchEnabled: boolean;
        /**
        * 指定此对象是否接收鼠标/触摸事件
        * @member {boolean} ns_egret.DisplayObject#touchEnabled
        * @default true
        */
        public touchEnabled : boolean;
        public blendMode: BlendMode;
        public _scrollRect: Rectangle;
        /**
        * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
        *  @member {ns_egret.Rectangle} ns_egret.DisplayObject#scrollRect
        */
        public scrollRect : Rectangle;
        /**
        * 测量宽度
        * @returns {number}
        */
        public measuredWidth : number;
        /**
        * 测量高度
        * @returns {number}
        */
        public measuredHeight : number;
        public _explicitWidth: number;
        /**
        * 显式设置宽度
        * @returns {number}
        */
        public explicitWidth : number;
        public _explicitHeight: number;
        /**
        * 显式设置高度
        * @returns {number}
        */
        public explicitHeight : number;
        /**
        * 宽度，优先顺序为 显式设置宽度 > 测量宽度
        * @returns {number}
        */
        /**
        * 显式设置宽度
        * @param value
        */
        public width : number;
        /**
        * 高度，优先顺序为 显式设置高度 > 测量高度
        * @returns {number}
        */
        /**
        * 显式设置高度
        * @param value
        */
        public height : number;
        private _hasWidthSet;
        /**
        * @inheritDoc
        */
        public _setWidth(value: number): void;
        private _hasHeightSet;
        /**
        * @inheritDoc
        */
        public _setHeight(value: number): void;
        /**
        * 调用显示对象被指定的 mask 对象遮罩
        */
        public mask: Rectangle;
        public worldTransform: Matrix;
        public worldBounds: Rectangle;
        public worldAlpha: number;
        /**
        * @private
        * @param renderContext
        */
        public _draw(renderContext: RendererContext): void;
        private drawCacheTexture(renderContext);
        /**
        * @private
        * @param renderContext
        */
        public _updateTransform(): void;
        /**
        * @private
        * @param renderContext
        */
        public _render(renderContext: RendererContext): void;
        private _cacheBounds;
        /**
        * 获取显示对象的测量边界
        * @method ns_egret.DisplayObject#getBounds
        * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
        * @returns {Rectangle}
        */
        public getBounds(resultRect?: Rectangle): Rectangle;
        private destroyCacheBounds();
        /**
        * @private
        * @returns {Matrix}
        */
        private static identityMatrixForGetConcatenated;
        public _getConcatenatedMatrix(): Matrix;
        /**
        * 将 point 对象从显示对象的（本地）坐标转换为舞台（全局）坐标。
        * @method ns_egret.DisplayObject#localToGlobal
        * @param x {number} 本地x坐标
        * @param y {number} 本地y坐标
        * @param resultPoint {Point} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
        * @returns {ns_egret.Point}
        */
        public localToGlobal(x?: number, y?: number, resultPoint?: Point): Point;
        /**
        * 将指定舞台坐标（全局）转换为显示对象（本地）坐标。
        * @method ns_egret.DisplayObject#globalToLocal
        * @param x {number} 全局x坐标
        * @param y {number} 全局y坐标
        * @param resultPoint {Point} 可选参数，传入用于保存结果的Point对象，避免重复创建对象。
        * @returns {ns_egret.Point}
        */
        public globalToLocal(x?: number, y?: number, resultPoint?: Point): Point;
        /**
        * 检测指定坐标是否在显示对象内
        * @method ns_egret.DisplayObject#hitTest
        * @param x {number}
        * @param y {number}
        * @param ignoreTouchEnabled 是否忽略TouchEnabled
        * @returns {*}
        */
        public hitTest(x: number, y: number, ignoreTouchEnabled?: boolean): DisplayObject;
        public _getMatrix(): Matrix;
        /**
        * 测量显示对象坐标，这个方法需要子类重写
        * @returns {ns_egret.Rectangle}
        * @private
        */
        public _measureBounds(): Rectangle;
        public _getOffsetPoint(): Point;
        public _onAddToStage(): void;
        public _onRemoveFromStage(): void;
        public _stage: Stage;
        /**
        * 获取舞台对象。当该显示对象不在舞台上时，此属性返回 undefined
        * @returns {ns_egret.Stage}
        */
        public stage : Stage;
        static _enterFrameCallBackList: any[];
        static _renderCallBackList: any[];
        public addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
        public dispatchEvent(event: Event): boolean;
        public willTrigger(type: string): boolean;
        public cacheAsBitmap(bool: boolean): void;
        static getTransformBounds(bounds: Rectangle, mtx: Matrix): Rectangle;
    }
}
declare module ns_egret {
    class TouchEvent extends Event {
        /**
        * 创建一个作为参数传递给事件侦听器的 Event 对象。
        * @class ns_egret.TouchEvent
        * @classdesc TouchEvent数据类
        * @param type {string} 事件的类型，可以作为 Event.type 访问。
        * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
        * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, touchPointID?: number, stageX?: number, stageY?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, touchDown?: boolean);
        /**
        * 轻触，参考Flash的MouseEvent.CLICK
        * @constant {string} ns_egret.TouchEvent.TOUCH_TAP
        */
        static TOUCH_TAP: string;
        /**
        * 移动，参考FLash的MouseEvent.MOVE
        * @constant {string} ns_egret.TouchEvent.TOUCH_MOVE
        */
        static TOUCH_MOVE: string;
        /**
        * 开始触摸,参考Flash的MouseEvent.MOUSE_DOWN
        * @constant {string} ns_egret.TouchEvent.TOUCH_BEGAN
        */
        static TOUCH_BEGAN: string;
        /**
        * 在同一对象上结束触摸,参考Flash的MouseEvent.MOUSE_UP
        * @constant {string} ns_egret.TouchEvent.TOUCH_END
        */
        static TOUCH_END: string;
        /**
        * 在对象外部结束触摸，参考Flash的MouseEvent.RELEASE_OUTSIDE
        * @constant {string} ns_egret.TouchEvent.TOUCH_RELEASE_OUTSIDE
        */
        static TOUCH_RELEASE_OUTSIDE: string;
        /**
        * 移动，参考FLash的MouseEvent.MOVE
        * @member ns_egret.TouchEvent.TOUCH_MOVE
        */
        static TOUCH_ROLL_OUT: string;
        /**
        * 移动，参考FLash的MouseEvent.MOVE
        * @member ns_egret.TouchEvent.TOUCH_MOVE
        */
        static TOUCH_ROLL_OVER: string;
        /**
        * 移动，参考FLash的MouseEvent.MOVE
        */
        static TOUCH_OUT: string;
        /**
        * 移动，参考FLash的MouseEvent.MOVE
        * @member ns_egret.TouchEvent.TOUCH_MOVE
        */
        static TOUCH_OVER: string;
        public _stageX: number;
        /**
        * 事件发生点在全局舞台坐标中的水平坐标。
        * @member {number} ns_egret.TouchEvent#stageX
        */
        public stageX : number;
        public _stageY: number;
        /**
        * 事件发生点在全局舞台坐标中的垂直坐标。
        * @member {number} ns_egret.TouchEvent#stageY
        */
        public stageY : number;
        private _localX;
        /**
        * 事件发生点相对于currentTarget的水平坐标。
        * @member {number} ns_egret.TouchEvent#localX
        */
        public localX : number;
        private _localY;
        /**
        * 事件发生点相对于currentTarget的垂直坐标。
        * @member {number} ns_egret.TouchEvent#localY
        */
        public localY : number;
        /**
        * 分配给触摸点的唯一标识号
        */
        public touchPointID: number;
        /**
        * 事件发生时ctrl键是否被按下。 (Mac OS下为 Cmd 或 Ctrl)
        */
        public ctrlKey: boolean;
        /**
        * 事件发生时shift键是否被按下。
        */
        public shiftKey: boolean;
        /**
        * 事件发生时alt键是否被按下。
        */
        public altKey: boolean;
        /**
        * 表示触摸已按下 (true) 还是未按下 (false)。
        */
        public touchDown: boolean;
        public _setCurrentTarget(target: any): void;
        /**
        * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.TouchEvent.dispathTouchEvent
        */
        static dispatchTouchEvent(target: IEventDispatcher, type: string, touchPointID?: number, stageX?: number, stageY?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, touchDown?: boolean): void;
    }
}
declare module ns_egret {
    class TimerEvent extends Event {
        /**
        * 创建一个 Event 对象，其中包含有关 timer 事件的特定信息。
        * @class ns_egret.TimerEvent
        * @classdesc 每当 Timer 对象达到由 Timer.delay 属性指定的间隔时，Timer 对象即会调度 TimerEvent 对象。
        * @param type {string} 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
        * @param bubbles {string} 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
        * @param cancelable {string} 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
        * 每当 Timer 对象达到根据 Timer.delay 属性指定的间隔时调度。
        * @constant {string} ns_egret.TimerEvent.TIMER
        */
        static TIMER: string;
        /**
        * 每当它完成 Timer.repeatCount 设置的请求数后调度。
        * @constant {string} ns_egret.TimerEvent.TIMER_COMPLETE
        */
        static TIMER_COMPLETE: string;
        /**
        * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.TimerEvent.dispathTimerEvent
        */
        static dispatchTimerEvent(target: IEventDispatcher, type: string): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * EventPhase 类可为 Event 类的 eventPhase 属性提供值。
    */
    class EventPhase {
        /**
        * 捕获阶段，是事件流的第一个阶段。
        */
        static CAPTURING_PHASE: number;
        /**
        * 目标阶段，是事件流的第二个阶段。
        */
        static AT_TARGET: number;
        /**
        * 冒泡阶段，是事件流的第三个阶段。
        */
        static BUBBLING_PHASE: number;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.HorizontalAlign
    * @classdesc
    */
    class HorizontalAlign {
        /**
        * 左对齐
        * @constant ns_egret.HorizontalAlign.LEFT
        */
        static LEFT: string;
        /**
        * 右对齐
        * @constant ns_egret.HorizontalAlign.RIGHT
        */
        static RIGHT: string;
        /**
        * 水平居中对齐
        * @constant ns_egret.HorizontalAlign.CENTER
        */
        static CENTER: string;
        /**
        * 水平两端对齐
        * @constant ns_egret.HorizontalAlign.JUSTIFY
        */
        static JUSTIFY: string;
        /**
        * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容宽度"。
        * 容器的"内容宽度"是最大子项的大小,如果所有子项都小于容器的宽度，则会将所有子项的大小调整为容器的宽度。
        * 注意：TextFiled不支持此对齐方式。
        * @constant ns_egret.HorizontalAlign.CONTENT_JUSTIFY
        */
        static CONTENT_JUSTIFY: string;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.VerticalAlign
    * @classdesc
    */
    class VerticalAlign {
        /**
        * 顶对齐
        * @constant ns_egret.VerticalAlign.TOP
        */
        static TOP: string;
        /**
        * 底对齐
        * @constant ns_egret.VerticalAlign.BOTTOM
        */
        static BOTTOM: string;
        /**
        * 垂直居中对齐
        * @constant ns_egret.VerticalAlign.MIDDLE
        */
        static MIDDLE: string;
        /**
        * 垂直两端对齐
        * @constant ns_egret.VerticalAlign.JUSTIFY
        */
        static JUSTIFY: string;
        /**
        * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容高度"。
        * 容器的"内容高度"是最大子项的大小,如果所有子项都小于容器的高度，则会将所有子项的大小调整为容器的高度。
        * 注意：TextFiled不支持此对齐方式。
        * @constant ns_egret.VerticalAlign.CONTENT_JUSTIFY
        */
        static CONTENT_JUSTIFY: string;
    }
}
declare module ns_egret {
    class Timer extends EventDispatcher {
        constructor(delay?: number, repeatCount?: number);
        public delay: number;
        public repeatCount: number;
        private _currentCount;
        public currentCount(): number;
        private _running;
        public running(): boolean;
        public reset(): void;
        public start(): void;
        public stop(): void;
        private lastTime;
        private onEnterFrame(frameTime);
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * 在window上需要读取的命名空间属性列表
    */
    var __moduleNameList: string[];
    /**
    * 需要重新刷新类名的标志
    */
    var __invalidateModuleFlag: boolean;
    /**
    * 返回一个对象的完全限定名<br/>
    * @param value 需要完全限定类名称的对象，可以将任何 TypeScript / JavaScript值传递给此方法，包括所有可用的TypeScript / JavaScript类型、对象实例、原始类型（如number）和类对象
    * @returns {string} 包含完全限定类名称的字符串<br />
    * @example
    *  ns_egret.getQualifiedClassName(ns_egret.DisplayObject) //返回 "ns_egret.DisplayObject"
    */
    function getQualifiedClassName(value: any): string;
}
declare var __global: any;
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * 返回 name 参数指定的类的类对象引用。
    * @param name 类的名称。
    * @returns {any} 返回 name 参数指定的类的类对象引用。
    * @example
    * ns_egret.getDefinitionByName("ns_egret.DisplayObject") //返回 DisplayObject类定义
    */
    function getDefinitionByName(name: string): any;
}
declare module ns_egret {
    /**
    * 检查指定的应用程序域之内是否存在一个公共定义。该定义可以是一个类、一个命名空间或一个函数的定义。
    * @param name 定义的名称。
    * @returns {boolean} 如果指定的定义存在，则返回 true 值；否则，返回 false。
    * @example
    * ns_egret.hasDefinition("ns_egret.DisplayObject") //返回 true
    */
    function hasDefinition(name: string): boolean;
}
declare module ns_egret {
    /**
    * @class ns_egret.StageDelegate
    * @classdesc
    * StageDelegate负责处理屏幕适配策略
    * 有关屏幕适配策略，更多信息请了解 GitHub:理解egret的GameLauncher
    * @stable B 目前StageDelegate和HTML5有一定的耦合关系，之后会对其解耦，保证NativeApp的正确运行
    * @extends ns_egret.HashObject
    */
    class StageDelegate extends HashObject {
        private static instance;
        /**
        * @method ns_egret.StageDelegate.getInstance
        * @returns {StageDelegate}
        */
        static getInstance(): StageDelegate;
        /**
        * @member ns_egret.StageDelegate.canvas_name
        */
        static canvas_name: string;
        /**
        * @member ns_egret.StageDelegate.canvas_div_name
        */
        static canvas_div_name: string;
        private _designWidth;
        private _designHeight;
        private _originalDesignWidth;
        private _originalDesignHeight;
        public _scaleX: number;
        public _scaleY: number;
        private _frame;
        private _resolutionPolicy;
        /**
        * @method ns_egret.StageDelegate#constructor
        */
        constructor();
        /**
        * @method ns_egret.StageDelegate#setFrameSize
        * @param width {any}
        * @param heigh {any}
        */
        public setFrameSize(width: any, height: any): void;
        /**
        * @method ns_egret.StageDelegate#setDesignSize
        * @param width {any}
        * @param height {any}
        * @param resolutionPolicy {any}
        */
        public setDesignSize(width: any, height: any, resolutionPolicy: any): void;
        /**
        * @method ns_egret.StageDelegate#setResolutionPolicy
        * @param resolutionPolic {any}
        */
        public setResolutionPolicy(resolutionPolicy: any): void;
        /**
        * @method ns_egret.StageDelegate#getScaleX
        */
        public getScaleX(): number;
        /**
        * @method ns_egret.StageDelegate#getScaleY
        */
        public getScaleY(): number;
    }
    /**
    * @class ns_egret.ResolutionPolicy
    * @classdesc
    */
    class ResolutionPolicy {
        /**
        * @constant ns_egret.ResolutionPolicy.FIXED_HEIGHT
        */
        static FIXED_HEIGHT: number;
        /**
        * @constant ns_egret.ResolutionPolicy.FIXED_WIDTH
        */
        static FIXED_WIDTH: number;
        private _containerStrategy;
        private _contentStrategy;
        constructor(containerStg: any, contentStg: any);
        /**
        * @method ns_egret.ResolutionPolicy#init
        * @param vie {any}
        */
        public init(view: any): void;
        /**
        * @method ns_egret.ResolutionPolicy#_apply
        * @param view {any}
        * @param designedResolutionWidth {any}
        * @param designedResolutionHeigh {any}
        */
        public _apply(view: any, designedResolutionWidth: any, designedResolutionHeight: any): void;
        /**
        * @method ns_egret.ResolutionPolicy#setContainerStrategy
        * @param containerSt {any}
        */
        public setContainerStrategy(containerStg: any): void;
        /**
        * @method ns_egret.ResolutionPolicy#setContentStrategy
        * @param contentSt {any}
        */
        public setContentStrategy(contentStg: any): void;
    }
    /**
    * @class ns_egret.ContainerStrategy
    * @classdesc
    */
    class ContainerStrategy {
        /**
        * @constant ns_egret.ContainerStrategy.EQUAL_TO_FRAME
        */
        static EQUAL_TO_FRAME: any;
        /**
        * @method ns_egret.ContainerStrategy.initialize
        */
        static initialize(): void;
        /**
        * @method ns_egret.ContainerStrategy#init
        * @param vie {any}
        */
        public init(view: any): void;
        /**
        * @method ns_egret.ContainerStrategy#_apply
        * @param view {any}
        * @param designedWidth {any}
        * @param designedHeigh {any}
        */
        public _apply(view: any, designedWidth: any, designedHeight: any): void;
        public _setupContainer(): void;
    }
    /**
    * @class ns_egret.EqualToFrame
    * @classdesc
    * @extends ns_egret.ContainerStrategy
    */
    class EqualToFrame extends ContainerStrategy {
        public _apply(view: any): void;
    }
    /**
    * @class ns_egret.ContentStrategy
    * @classdesc
    */
    class ContentStrategy {
        /**
        * @constant ns_egret.ContentStrategy.FIXED_HEIGHT
        */
        static FIXED_HEIGHT: ContentStrategy;
        /**
        * @constant ns_egret.ContentStrategy.FIXED_WIDTH
        */
        static FIXED_WIDTH: ContentStrategy;
        /**
        * @method ns_egret.ContentStrategy.initialize
        */
        static initialize(): void;
        /**
        * @method ns_egret.ContentStrategy#init
        * @param vie {any}
        */
        public init(view: any): void;
        /**
        * @method ns_egret.ContentStrategy#_apply
        * @param delegate {ns_egret.StageDelegate}
        * @param designedResolutionWidth {number}
        * @param designedResolutionHeight {number}
        */
        public _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
    }
    /**
    * @class ns_egret.FixedHeight
    * @classdesc
    * @extends ns_egret.ContentStrategy
    */
    class FixedHeight extends ContentStrategy {
        /**
        * @method ns_egret.FixedHeight#_apply
        * @param delegate {any}
        * @param designedResolutionWidth {any}
        * @param designedResolutionHeight {any}
        */
        public _apply(delegate: any, designedResolutionWidth: any, designedResolutionHeight: any): void;
    }
    /**
    * @class ns_egret.FixedWidth
    * @classdesc
    * @extends ns_egret.ContentStrategy
    */
    class FixedWidth extends ContentStrategy {
        /**
        * @method ns_egret.FixedWidth#_apply
        * @param delegate {ns_egret.StageDelegate}
        * @param designedResolutionWidth {any}
        * @param designedResolutionHeight {any}
        */
        public _apply(delegate: StageDelegate, designedResolutionWidth: any, designedResolutionHeight: any): void;
    }
    /**
    * @class ns_egret.FixedSize
    * @classdesc
    * @extends ns_egret.ContentStrategy
    */
    class FixedSize extends ContentStrategy {
        private width;
        private height;
        constructor(width: any, height: any);
        /**
        * @method ns_egret.FixedSize#_apply
        * @param delegate {ns_egret.StageDelegate}
        * @param designedResolutionWidth {number}
        * @param designedResolutionHeight {number}
        */
        public _apply(delegate: StageDelegate, designedResolutionWidth: number, designedResolutionHeight: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Injector
    */
    class Injector {
        /**
        * 储存类的映射规则
        */ 
        private static mapClassDic;
        /**
        * 以类定义为值进行映射注入，当第一次用getInstance()请求它的单例时才会被实例化。
        * @method ns_egret.Injector.mapClass
        * @param {any} whenAskedFor 传递类定义或类完全限定名作为需要映射的键。
        * @param {any} instantiateClass 传递类作为需要映射的值，它的构造函数必须为空。若不为空，请使用Injector.mapValue()方法直接注入实例。
        * @param {string} named 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
        */
        static mapClass(whenAskedFor: any, instantiateClass: any, named?: string): void;
        /**
        * 获取完全限定类名
        */ 
        private static getKey(hostComponentKey);
        private static mapValueDic;
        /**
        * 以实例为值进行映射注入,当用getInstance()请求单例时始终返回注入的这个实例。
        * @method ns_egret.Injector.mapValue
        * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
        * @param useValue {any} 传递对象实例作为需要映射的值。
        * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
        */ 
        static mapValue(whenAskedFor: any, useValue: any, named?: string): void;
        /**
        * 检查指定的映射规则是否存在
        * @method ns_egret.Injector.hasMapRule
        * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
        * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。
        */
        static hasMapRule(whenAskedFor: any, named?: string): boolean;
        /**
        * 获取指定类映射的单例，注意:这个方法总是返回全局唯一的实例，不会重复创建。
        * @method ns_egret.Injector.getInstance
        * @param clazz {any} 类定义或类的完全限定名
        * @param named {string} 可选参数，若在调用mapClass()映射时设置了这个值，则要传入同样的字符串才能获取对应的单例
        */ 
        static getInstance(clazz: any, named?: string): any;
    }
}
declare module ns_egret {
    /**
    * @class SpriteSheet类是位图SpriteSheet的配置文件。包括一组SpriteSheetFrame
    * 每一个Bitmap对象都可以设置其SpriteSheetFrame，实现显示纹理的特定区域
    * 在WebGL / OpenGL上，这种做法可以显著提升性能
    * 同时，SpriteSheet可以很方便的进行素材整合，降低HTTP请求数量
    * todo: GitHub egret的SpriteSheet
    */
    class SpriteSheet extends HashObject {
        private frames;
        constructor(data: any);
        /**
        * 获取指定的SpriteFrame
        * @param spriteFrameName
        * @returns {*}
        */
        public getFrame(spriteFrameName: any): any;
        /**
        * 这个API已经被完全废弃，会尽快删除
        * @param data
        * @returns {SpriteSheet}
        * @stable D
        */
        static parseFromDragonBones(data: any): SpriteSheet;
    }
    class SpriteSheetFrame {
        /**
        * 表示这个Frame在Sheet上的x位置
        */
        public x: number;
        /**
        * 表示这个Frame在Sheet上的y位置
        */
        public y: number;
        /**
        * 表示这个Frame在Sheet上的宽度
        */
        public w: number;
        /**
        * 表示这个Frame在Sheet上的高度
        */
        public h: number;
        /**
        * 表示这个Frame显示了之后需要在x方向的渲染偏移量
        */
        public offX: number;
        /**
        * 表示这个Frame显示了之后需要在y方向的渲染偏移量
        */
        public offY: number;
    }
}
declare module ns_egret {
    class Bitmap extends DisplayObject {
        /**
        * 全部Bitmap是否开启DEBUG模式
        * @stable B 这个API以后可能会被移动到一个单独的负责各种DEBUG参数的枚举类中
        */
        static debug: boolean;
        /**
        * 单个Bitmap是否开启DEBUG模式
        * @stable B 这个API以后可能会被移动到一个单独的负责各种DEBUG参数的枚举类中
        */
        public debug: boolean;
        /**
        * debug边框颜色，默认值为红色
        */
        public debugColor: number;
        /**
        * 渲染采用的SpriteFrame，用来渲染纹理中的一部分
        */
        public spriteFrame: SpriteSheetFrame;
        /**
        * 渲染纹理
        */
        public texture: Texture;
        constructor();
        public _render(renderContext: RendererContext): void;
        /**
        * @see egret.DisplayObject.measureBounds
        * @returns {Rectangle}
        * @private
        */
        public _measureBounds(): Rectangle;
    }
}
declare module ns_egret {
    /**
    * @class BitmapText
    * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字
    */
    class BitmapText extends DisplayObjectContainer {
        /**
        * 设置文本
        */
        public text: string;
        /**
        * 纹理对象
        */
        public texture: Texture;
        /**
        * SpriteFrame配置文件，通过egret的Node.js工具生成
        */
        public bitmapFontData: any;
        private _bitmapPool;
        constructor();
        public _updateTransform(): void;
        public _renderText(forMeasureContentSize?: boolean): Rectangle;
        public _measureBounds(): Rectangle;
    }
}
declare module ns_egret {
    class Graphics {
        private renderContext;
        private canvasContext;
        private commandQueue;
        constructor(renderContext: RendererContext);
        public beginFill(color: number, alpha: number): void;
        private _setStyle(colorStr);
        public drawRect(x: number, y: number, width: number, height: number): void;
        /**
        * @param thickness {number} 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
        * @param color {number} 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
        * @param alpha 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
        * @param pixelHinting 布尔型值，指定是否提示笔触采用完整像素。它同时影响曲线锚点的位置以及线条笔触大小本身。在 pixelHinting 设置为 true 的情况下，线条宽度会调整到完整像素宽度。在 pixelHinting 设置为 false 的情况下，对于曲线和直线可能会出现脱节。
        * @param scaleMode
        * @param caps
        * @param joints
        * @param miterLimit
        */
        public lineStyle(thickness?: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number): void;
        /**
        * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。如果正在其中绘制的显示对象包含用 Flash 绘图工具创建的内容，则调用 lineTo() 方法将在该内容下面进行绘制。如果在对 moveTo() 方法进行任何调用之前调用了 lineTo()，则当前绘图的默认位置为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
        * @param x
        * @param y
        */
        public lineTo(x: number, y: number): void;
        public clear(): void;
        public endFill(): void;
        public _draw(): void;
    }
}
declare module ns_egret {
    class Shape extends DisplayObject {
        constructor();
        private _graphics;
        public graphics : Graphics;
        public _render(renderContext: RendererContext): void;
    }
    class ShapeRect extends Shape {
        private _color;
        private _colorDirty;
        private _sizeDirty;
        constructor();
        public color : number;
        public alpha : number;
        /**
        * 宽度，优先顺序为 显式设置宽度 > 测量宽度
        * @returns {number}
        */
        /**
        * 显式设置宽度
        * @param value
        */
        public width : number;
        /**
        * 高度，优先顺序为 显式设置高度 > 测量高度
        * @returns {number}
        */
        /**
        * 显式设置高度
        * @param value
        */
        public height : number;
        public _render(renderContext: RendererContext): void;
    }
}
declare module ns_egret {
    /**
    * 这个类是HTML5的WebWrapper的第一个版本
    * @stable C 目前只是实现需求，大部分API需要考虑重新设计
    */
    class Browser extends HashObject {
        private static instance;
        private pfx;
        private type;
        private trans;
        private ua;
        private isHD;
        public isMobile: boolean;
        static getInstance(): Browser;
        constructor();
        public $new(x: any): any;
        public $(x: any): any;
        public translate: (a: any) => string;
        public rotate: (a: any) => string;
        public scale(a: any): string;
        public skew(a: any): string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.StageText
    * @classdesc
    * @extends ns_egret.HashObject
    */
    class StageText extends HashObject {
        private div;
        private inputElement;
        constructor();
        /**
        * @method ns_egret.StageText#getText
        * @returns {string}
        */
        public _getText(): string;
        /**
        * @method ns_egret.StageText#setText
        * @param value {string}
        */
        public _setText(value: string): void;
        /**
        * @method ns_egret.StageText#setTextType
        * @param type {string}
        */
        public _setTextType(type: string): void;
        /**
        * @method ns_egret.StageText#getTextType
        * @returns {string}
        */
        public _getTextType(): string;
        /**
        * @method ns_egret.StageText#open
        * @param x {number}
        * @param y {number}
        * @param width {number}
        * @param height {number}
        */
        public _open(x: number, y: number, width?: number, height?: number): void;
        /**
        * @method ns_egret.StageText#remove
        */
        public _remove(): void;
    }
}
declare module ns_egret {
    class TextInput extends DisplayObject {
        private _domInputSprite;
        private _edTxt;
        private _delegate;
        private _placeholderText;
        private _edFontSize;
        private _textColor;
        private _placeholderFontSize;
        private _placeholderColor;
        private _preX;
        private _preY;
        private stageText;
        public _onAddToStage(): void;
        public setText(value: string): void;
        public getText(): string;
        public setTextType(type: string): void;
        public getTextType(): string;
        private onMouseDownHandler(event);
        public _onRemoveFromStage(): void;
        public _measureBounds(): Rectangle;
        public hitTest(x: any, y: any, ignoreTouchEnabled?: boolean): DisplayObject;
    }
    class TextInputDegelete {
        public editBoxEditingDidBegin(sender: any): void;
        public editBoxEditingDidEnd(sender: any): void;
        public editBoxTextChanged(sender: any, text: any): void;
        public editBoxReturn(sender: any): void;
    }
}
declare module ns_egret {
    /**
    * MovieClip是位图动画序列类，由FlashPro + egret插件生成配置文件
    */
    class MovieClip extends DisplayObjectContainer {
        public data: any;
        public texture: Texture;
        private _frameData;
        private _resPool;
        private _currentFrameIndex;
        private _currentFrameName;
        private _totalFrame;
        private _interval;
        private _currentInterval;
        private _isPlaying;
        private _passTime;
        private _oneFrameTime;
        constructor(data: any, texture: Texture);
        /**
        * 播放指定动画
        * @param frameName
        */
        public gotoAndPlay(frameName: string): void;
        /**
        * 播放并暂停指定动画
        * @param frameName
        */
        public gotoAndStop(frameName: string): void;
        private checkHasFrame(name);
        /**
        * 暂停动画
        */
        public stop(): void;
        private update(frameTime);
        private playNextFrame(needShow?);
        private getBitmap(name);
        public release(): void;
        public getCurrentFrameIndex(): number;
        public getTotalFrame(): number;
        /**
        * 设置间隔
        * @param value
        */
        public setInterval(value: number): void;
        /**
        * 判断当前动画是否正在播放
        * @stable D 这个API需要改为 isPlaying()
        * @returns {Boolean}
        */
        public getIsPlaying(): boolean;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.URLVariables
    * @classdesc
    * 使用 URLVariables 类可以在应用程序和服务器之间传输变量。
    * 将 URLVariables 对象与 URLLoader 类的方法、URLRequest 类的 data 属性一起使用。
    * @extends ns_egret.HashObject
    */
    class URLVariables extends HashObject {
        /**
        * @method ns_egret.URLVariables#constructor
        * @param source {String} 包含名称/值对的 URL 编码的字符串。
        */
        constructor(source?: string);
        /**
        * 此 URLVariables 储存的键值对数据对象。
        * @member ns_egret.URLVariables#variables
        */
        public variables: Object;
        /**
        * 将变量字符串转换为此 URLVariables.variables 对象的属性。
        * @method ns_egret.URLVariables#decode
        * @param source {string}
        */
        public decode(source: string): void;
        /**
        * 以 MIME 内容编码格式 application/x-www-form-urlencoded 返回包含所有可枚举变量的字符串。
        * @method ns_egret.URLVariables#toString
        */
        public toString(): string;
    }
}
declare module ns_egret {
    /**
    * 纹理的缓存和管理类
    * @class ns_egret.TextureCache
    */
    class TextureCache extends HashObject {
        private static instance;
        static getInstance(): TextureCache;
        public prefix: string;
        private _textures;
        private _data;
        constructor();
        /**
        * 添加纹理
        * @param key
        * @param texture
        */
        public addTexture(key: any, texture: Texture): void;
        /**
        * 删除纹理
        * @param key
        */
        public removeTexture(key: string): void;
        /**
        * 获取纹理
        * @param key
        * @returns {*}
        */
        public getTexture(key: string): Texture;
        /**
        * 添加SpriteSheet
        * @param key
        * @param spriteSheet
        * @param texture
        * @stable B 由于SpriteSheet和纹理往往是对应的，正在考虑将addSpriteSheet和addTexture合并
        */
        public addTextData(key: string, data: string): void;
        /**
        * 移除SpriteSheet
        * @param key
        */
        public removeTextData(key: string): void;
        /**
        * 获取SpriteSheet
        * @param key
        * @returns {*}
        */
        public getTextData(key: string): any;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
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
declare module ns_egret {
    class Scale9Bitmap extends DisplayObjectContainer {
        private texture;
        private _defaultPadding;
        private _top;
        private _bottom;
        private _left;
        private _right;
        private _scaleWidth;
        private _scaleHeight;
        private _topLeftBitmap;
        private _topMiddleBitmap;
        private _topRightBitmap;
        private _middleLeftBitmap;
        private _middleMiddleBitmap;
        private _middleRightBitmap;
        private _bottomLeftBitmap;
        private _bottomMiddleBitmap;
        private _bottomRightBitmap;
        public spriteFrame: SpriteSheetFrame;
        constructor(texture: Texture);
        private _createBitmap();
        public setScaleGrid(top?: number, bottom?: number, left?: number, right?: number): void;
        public width : number;
        public height : number;
        public _updateTransform(): void;
        private setChildScaleX(child, scaleX);
        private setChildScaleY(child, scaleY);
    }
}
declare module ns_egret {
    class SAXParser extends HashObject {
        static _instance: SAXParser;
        static getInstance(): SAXParser;
        private _parser;
        private _xmlDict;
        private _isSupportDOMParser;
        constructor();
        /**
        *解析xml
        */
        public parse(textxml: string): any;
        /**
        * 解析tilemap
        */
        public tmxParse(textxml: string, isXMLString?: boolean): any;
        private parserXML(textxml);
        private parseNode(node);
        private parseArray(node);
        private parseDict(node);
        /**
        * 获取文件名
        */
        public getName(filePath: string): string;
        /**
        * 获取文件扩展名
        */
        public getExt(filePath: string): string;
        public getList(key: string): any;
    }
}
declare module ns_egret {
    class XML {
        private _xmlStr;
        /**
        * 必须是 xml格式的字符串
        * @param xmlStr  xml格式的字符串
        */
        constructor();
        /**
        * 解析 xml文件
        * @param xmlDoc
        * @private
        */
        public _ansXML(xmlDoc: any): void;
        static create(url: any): XML;
    }
}
declare module ns_egret {
    class Tween extends EventDispatcher {
        static NONE: number;
        static LOOP: number;
        static REVERSE: number;
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
        static get(target: any, props?: any, pluginData?: any, override?: boolean): Tween;
        static removeTweens(target: any): void;
        private static tick(delta, paused?);
        private static _register(tween, value);
        static removeAllTweens(): void;
        constructor(target: any, props: any, pluginData: any);
        private initialize(target, props, pluginData);
        private setPosition(value, actionsMode?);
        private _runActions(startPos, endPos, includeStart?);
        private _updateTargetProps(step, ratio);
        public setPaused(value: boolean): Tween;
        private _cloneProps(props);
        private _addStep(o);
        private _appendQueueProps(o);
        private _addAction(o);
        private _set(props, o);
        public wait(duration: number, passive?: boolean): Tween;
        public to(props: any, duration: number, ease?: any): Tween;
        public call(callback: Function, thisObj?: any, params?: any): Tween;
        public set(props: any, target?: any): Tween;
        public play(tween: Tween): Tween;
        public pause(tween: Tween): Tween;
        public tick(delta: number): void;
    }
}
declare module ns_egret {
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
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    class TMX {
        static TILE_HORIZONTAL_FLAG: number;
        static TILE_VERTICAL_FLAG: number;
        static TILE_DIAGONAL_FLAG: number;
        static TILE_FLIPPED_ALL: number;
        static TILE_FLIPPED_MASK: number;
        static LAYER_ATTRIB_NONE: number;
        static LAYER_ATTRIB_BASE64: number;
        static LAYER_ATTRIB_GZIP: number;
        static LAYER_ATTRIB_ZLIB: number;
        static PROPERTY_NONE: number;
        static PROPERTY_MAP: number;
        static PROPERTY_LAYER: number;
        static PROPERTY_OBJECTGROUP: number;
        static PROPERTY_OBJECT: number;
        static PROPERTY_TILE: number;
        static ORIENTATION_ORTHO: number;
        static ORIENTATION_HEX: number;
        static ORIENTATION_ISO: number;
    }
}
declare module ns_egret {
    class TMXMapInfo {
        private _orientation;
        private _mapWidth;
        private _mapHeight;
        private _tileWidth;
        private _tileHeight;
        private _layers;
        private _tileSets;
        private _objectGroups;
        private _parentGID;
        private _storingCharacters;
        private _properties;
        private _TMXFileName;
        private _currentString;
        private _tileProperties;
        static createWithFile(tmxFile: string): TMXMapInfo;
        public initWithTMXFile(tmxFile: any): void;
        private internalInit(tmxFileName);
        private parseXMLFile(tmxFile);
        private parsePointsString(pointsString);
        public getOrientation(): any;
        public setOrientation(value: any): void;
        public getProperties(): any[];
        public setProperties(value: any): void;
        public getTilesets(): TMXTilesetInfo[];
        public setTilesets(value: TMXTilesetInfo): void;
        public getParentGID(): number;
        public setParentGID(value: any): void;
        public getLayers(): TMXLayerInfo[];
        public setLayers(value: TMXLayerInfo): void;
        public getObjectGroups(): any[];
        public setObjectGroups(value: any): void;
        public getTileProperties(): any[];
        public setTileProperties(value: any): void;
        public getTileWidth(): number;
        public getTileHeight(): number;
        public getMapWidth(): number;
        public getMapHeight(): number;
    }
    class TMXTilesetInfo {
        public name: string;
        public firstGid: any;
        public spacing: number;
        public margin: any;
        public tileWidth: number;
        public tileHeight: number;
        public sourceImage: string;
        public imageWidth: number;
        public imageHeight: number;
        public rectForGID(gid: any): Point;
    }
    class TMXObjectGroup {
        private _groupName;
        private _positionOffsetX;
        private _positionOffsetY;
        private _properties;
        private _objects;
        public getGroupName(): string;
        public setGroupName(value: string): void;
        public getPositionOffsetX(): number;
        public setPositionOffsetX(value: any): void;
        public getPositionOffsetY(): number;
        public setPositionOffsetY(value: any): void;
        public getProperties(): any[];
        public setProperties(value: any): void;
        public getObjects(): any[];
        public addObject(value: any): void;
    }
    class TMXLayerInfo {
        public name: string;
        public layerWidth: number;
        public layerHeight: number;
        public visible: boolean;
        public opacity: number;
        public _tiles: any;
        public layerX: number;
        public layerY: number;
        public ownTiles: any;
        public _minGID: number;
        public _maxGID: number;
        private _properties;
        public getProperties(): any;
        public setProperties(value: any): void;
    }
}
declare module ns_egret {
    class TMXLayer extends DisplayObjectContainer {
        private _texture;
        private _layerWidth;
        private _layerHeight;
        private _mapTileWidth;
        private _mapTileHeight;
        private _tiles;
        private _tileSet;
        private _layerOrientation;
        private _properties;
        private _layerName;
        private _opacity;
        private _minGID;
        private _maxGID;
        static create(tilesetInfo: TMXTilesetInfo, layerInfo: TMXLayerInfo, mapInfo: TMXMapInfo): TMXLayer;
        public initWithTilesetInfo(tilesetInfo: TMXTilesetInfo, layerInfo: TMXLayerInfo, mapInfo: TMXMapInfo): void;
        private calculateLayerOffset(x, y);
        public setupTiles(): void;
        private appendTileForGID(gid, x, y);
        private reusedTileWithRect(rect);
        private setupTileSprite(sprite, x, y, gid);
        public getPositionAt(x: number, y: number): Point;
        private positionForIsoAt(x, y);
        private positionForOrthoAt(x, y);
        private positionForHexAt(x, y);
        /**
        * 通过坐标获取GID
        */
        public getTileGIDAt(x: any, y: any): number;
        public getProperties(): any;
        public setProperties(value: any): void;
        public getProperty(propertyName: any): any;
        public getLayerName(): string;
    }
}
declare module ns_egret {
    class TMXTiledMap extends DisplayObjectContainer {
        public mapInfo: TMXMapInfo;
        public viewPortWidth: number;
        static createWithFile(tmxFile: string): TMXTiledMap;
        public initWithTMXFile(tmxFile: string): void;
        private buildWithMapInfo(mapInfo);
        private parseLayer(layerInfo, mapInfo);
        private tilesetForLayer(layerInfo, mapInfo);
        public getLayer(layerName: string): TMXLayer;
        public getObjectGroup(groupName: string): any;
        public propertiesForGID(value: any): any;
        public getProperty(propertyName: any): any;
        public setMoveX(x: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ICollection
    * @interface
    * @classdesc
    * 列表的集合类数据源对象接口
    * @extends ns_egret.IEventDispatcher
    */
    interface ICollection extends IEventDispatcher {
        /**
        * 此集合中的项目数。0 表示不包含项目，而 -1 表示长度未知。
        * @member ns_egret.ICollection#length
        */ 
        length: number;
        /**
        * 获取指定索引处的项目。
        * @method ns_egret.ICollection#getItemAt
        * @throws RangeError 如果索引小于 0 或大于长度。
        * @param index {number}
        * @returns {any}
        */ 
        getItemAt(index: number): any;
        /**
        * 如果项目位于列表中,返回该项目的索引。否则返回-1。
        * @method ns_egret.ICollection#getItemIndex
        * @param item {any}
        * @returns {number}
        */ 
        getItemIndex(item: any): number;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.CollectionEvent
    * @classdesc
    * 集合类型数据改变事件
    * @extends ns_egret.Event
    */
    class CollectionEvent extends Event {
        /**
        * 集合类数据发生改变
        * @constant ns_egret.CollectionEvent.COLLECTION_CHANGE
        */
        static COLLECTION_CHANGE: string;
        /**
        * @method ns_egret.CollectionEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        * @param kind {string}
        * @param location {number}
        * @param oldLocation {number}
        * @param items {Array<any>}
        * @param oldItems {Array<any>}
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, kind?: string, location?: number, oldLocation?: number, items?: any[], oldItems?: any[]);
        /**
        * 指示发生的事件类型。此属性值可以是 CollectionEventKind 类中的一个值，也可以是 null，用于指示类型未知。
        * @member ns_egret.CollectionEvent#kind
        */
        public kind: string;
        /**
        * 受事件影响的项目的列表
        * @member ns_egret.CollectionEvent#items
        */
        public items: any[];
        /**
        * 仅当kind的值为CollectionEventKind.REPLACE时，表示替换前的项目列表
        * @member ns_egret.CollectionEvent#oldItems
        */
        public oldItems: any[];
        /**
        * 如果 kind 值为 CollectionEventKind.ADD、 CollectionEventKind.MOVE、
        * CollectionEventKind.REMOVE 或 CollectionEventKind.REPLACE，
        * CollectionEventKind.UPDATE
        * 则此属性为 items 属性中指定的项目集合中零号元素的的索引。
        * @member ns_egret.CollectionEvent#location
        */
        public location: number;
        /**
        * 如果 kind 的值为 CollectionEventKind.MOVE，
        * 则此属性为 items 属性中指定的项目在目标集合中原来位置的从零开始的索引。
        * @member ns_egret.CollectionEvent#oldLocation
        */
        public oldLocation: number;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.CollectionEvent.dispatchCollectionEvent
        */
        static dispatchCollectionEvent(target: IEventDispatcher, type: string, kind?: string, location?: number, oldLocation?: number, items?: any[], oldItems?: any[]): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.CollectionEventKind
    * @classdesc
    * 定义  CollectionEvent 类 kind 属性的有效值的常量。
    * 这些常量指示对集合进行的更改类型。
    */
    class CollectionEventKind {
        /**
        * 指示集合添加了一个或多个项目。
        * @constant ns_egret.CollectionEventKind.ADD
        */ 
        static ADD: string;
        /**
        * 指示项目已从 CollectionEvent.oldLocation确定的位置移动到 location确定的位置。
        * @constant ns_egret.CollectionEventKind.MOVE
        */ 
        static MOVE: string;
        /**
        * 指示集合应用了排序或/和筛选。
        * @constant ns_egret.CollectionEventKind.REFRESH
        */ 
        static REFRESH: string;
        /**
        * 指示集合删除了一个或多个项目。
        * @constant ns_egret.CollectionEventKind.REMOVE
        */ 
        static REMOVE: string;
        /**
        * 指示已替换由 CollectionEvent.location 属性确定的位置处的项目。
        * @constant ns_egret.CollectionEventKind.REPLACE
        */ 
        static REPLACE: string;
        /**
        * 指示集合已彻底更改，需要进行重置。
        * @constant ns_egret.CollectionEventKind.RESET
        */ 
        static RESET: string;
        /**
        * 指示集合中一个或多个项目进行了更新。受影响的项目将存储在  CollectionEvent.items 属性中。
        * @constant ns_egret.CollectionEventKind.UPDATE
        */ 
        static UPDATE: string;
        /**
        * 指示集合中某个节点的子项列表已打开，通常应用于Tree的数据源XMLCollection。
        * @constant ns_egret.CollectionEventKind.OPEN
        */ 
        static OPEN: string;
        /**
        * 指示集合中某个节点的子项列表已关闭，通常应用于Tree的数据源XMLCollection。
        * @constant ns_egret.CollectionEventKind.CLOSE
        */ 
        static CLOSE: string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ArrayCollection
    * @classdesc
    * 数组的集合类数据结构包装器
    * 通常作为列表组件的数据源，使用这种数据结构包装普通数组，
    * 能在数据源发生改变的时候主动通知视图刷新变更的数据项
    * @extends ns_egret.EventDispatcher
    * @implements ns_egret.ICollection
    */
    class ArrayCollection extends EventDispatcher implements ICollection {
        /**
        * 构造函数
        * @method ns_egret.ArrayCollection#constructor
        * @param source {Array<any>} 数据源
        */
        constructor(source?: any[]);
        private _source;
        /**
        * 数据源
        * 通常情况下请不要直接调用Array的方法操作数据源，否则对应的视图无法收到数据改变的通知。
        * 若对数据源进行了排序或过滤等操作，请手动调用refresh()方法刷新数据。<br/>
        * @member ns_egret.ArrayCollection#source
        */
        public source : any[];
        /**
        * 在对数据源进行排序或过滤操作后可以手动调用此方法刷新所有数据,以更新视图。
        * @method ns_egret.ArrayCollection#refresh
        */
        public refresh(): void;
        /**
        * 是否包含某项数据
        * @method ns_egret.ArrayCollection#contains
        * @param item {any}
        * @returns {boolean}
        */
        public contains(item: any): boolean;
        /**
        * 检测索引是否超出范围
        */
        private checkIndex(index);
        /**
        * @member ns_egret.ArrayCollection#length
        */
        public length : number;
        /**
        * 向列表末尾添加指定项目。等效于 addItemAt(item, length)。
        * @method ns_egret.ArrayCollection#addItem
        * @param item {any}
        */
        public addItem(item: any): void;
        /**
        * 在指定的索引处添加项目。
        * 任何大于已添加项目的索引的项目索引都会增加 1。
        * @method ns_egret.ArrayCollection#addItemAt
        * @throws RangeError 如果索引小于 0 或大于长度。
        * @param item {any}
        * @param index {number}
        */
        public addItemAt(item: any, index: number): void;
        /**
        * @method ns_egret.ArrayCollection#getItemAt
        * @param index {number}
        * @returns {any}
        */
        public getItemAt(index: number): any;
        /**
        * @method ns_egret.ArrayCollection#getItemIndex
        * @param item {any}
        * @returns {number}
        */
        public getItemIndex(item: any): number;
        /**
        * 通知视图，某个项目的属性已更新。
        * @method ns_egret.ArrayCollection#itemUpdated
        * @param item {any}
        */
        public itemUpdated(item: any): void;
        /**
        * 删除列表中的所有项目。
        * @method ns_egret.ArrayCollection#removeAll
        */
        public removeAll(): void;
        /**
        * 删除指定索引处的项目并返回该项目。原先位于此索引之后的所有项目的索引现在都向前移动一个位置。
        * @method ns_egret.ArrayCollection#removeItemAt
        * @throws RangeError 如果索引小于 0 或大于长度。
        * @param index {number}
        * @returns {any}
        */
        public removeItemAt(index: number): any;
        /**
        * 替换在指定索引处的项目，并返回该项目。
        * @method ns_egret.ArrayCollection#replaceItemAt
        * @throws RangeError 如果索引小于 0 或大于长度。
        * @param item {any}
        * @param index {number}
        * @returns {any}
        */
        public replaceItemAt(item: any, index: number): any;
        /**
        * 用新数据源替换原始数据源，此方法与直接设置source不同，它不会导致目标视图重置滚动位置。
        * @method ns_egret.ArrayCollection#replaceAll
        * @param newSource {Array<any>} 新的数据源
        */
        public replaceAll(newSource: any[]): void;
        /**
        * 移动一个项目
        * 在oldIndex和newIndex之间的项目，
        * 若oldIndex小于newIndex,索引会减1
        * 若oldIndex大于newIndex,索引会加1
        * @method ns_egret.ArrayCollection#moveItemAt
        * @param oldIndex {number}
        * @param newIndex {number}
        * @returns {any}
        * @throws RangeError 如果索引小于 0 或大于长度。
        */
        public moveItemAt(oldIndex: number, newIndex: number): any;
        /**
        * 抛出事件
        */
        private dispatchCoEvent(kind?, location?, oldLocation?, items?, oldItems?);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ITreeCollection
    * @interface
    * @classdesc
    * Tree组件的集合类数据源对象接口
    * @extends ns_egret.ICollection
    */
    interface ITreeCollection extends ICollection {
        /**
        * 检查指定的节点是否含有子节点
        * @method ns_egret.ITreeCollection#hasChildren
        * @param item {any} 要检查的节点
        * @returns {boolean}
        */ 
        hasChildren(item: any): boolean;
        /**
        * 指定的节点是否打开
        * @method ns_egret.ITreeCollection#isItemOpen
        * @param item {any}
        * @returns {boolean}
        */ 
        isItemOpen(item: any): boolean;
        /**
        * 打开或关闭一个节点
        * @method ns_egret.ITreeCollection#expandItem
        * @param item {any} 要打开或关闭的节点
        * @param open? {boolean} true表示打开节点，反之关闭。
        */ 
        expandItem(item: any, open?: boolean): void;
        /**
        * 获取节点的深度
        * @method ns_egret.ITreeCollection#getDepth
        * @param item {any}
        * @returns {number}
        */ 
        getDepth(item: any): number;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ObjectCollection
    * @classdesc
    * Object的集合类数据结构包装器,通常作为Tree组件的数据源。
    * @extends ns_egret.EventDispatcher
    * @implements ns_egret.ICollection
    * @implements ns_egret.ITreeCollection
    */
    class ObjectCollection extends EventDispatcher implements ICollection, ITreeCollection {
        /**
        * 构造函数
        * @method ns_egret.ObjectCollection#constructor
        * @param childrenKey {string} 要从item中获取子项列表的属性名,属性值为一个数组或Vector。
        * @param parentKey {string} 要从item中获取父级项的属性名
        */ 
        constructor(childrenKey?: string, parentKey?: string);
        /**
        * 要从item中获取子项列表的属性名
        */ 
        private childrenKey;
        /**
        * 要从item中获取父级项的属性名
        */ 
        private parentKey;
        private _source;
        /**
        * 数据源。注意：设置source会同时清空openNodes。
        * @member ns_egret.ObjectCollection#source
        */
        public source : any;
        /**
        * 要显示的节点列表
        */ 
        private nodeList;
        private _openNodes;
        /**
        * 处于展开状态的节点列表
        * @member ns_egret.ObjectCollection#openNodes
        */
        public openNodes : any[];
        /**
        * @member ns_egret.ObjectCollection#length
        */
        public length : number;
        /**
        * @method ns_egret.ObjectCollection#getItemAt
        * @param index {number}
        * @returns {any}
        */
        public getItemAt(index: number): any;
        /**
        * @method ns_egret.ObjectCollection#getItemIndex
        * @param item {any}
        * @returns {number}
        */
        public getItemIndex(item: any): number;
        /**
        * 通知视图，某个项目的属性已更新。
        * @method ns_egret.ObjectCollection#itemUpdated
        * @param item {any}
        */
        public itemUpdated(item: any): void;
        /**
        * 删除指定节点
        * @method ns_egret.ObjectCollection#removeItem
        * @param item {any}
        */
        public removeItem(item: any): void;
        private _showRoot;
        /**
        * 是否显示根节点,默认false。
        * @member ns_egret.ObjectCollection#showRoot
        */
        public showRoot : boolean;
        /**
        * 添加打开的节点到列表
        */ 
        private addChildren(parent, list);
        /**
        * @method ns_egret.ObjectCollection#hasChildren
        * @param item {any}
        * @returns {boolean}
        */ 
        public hasChildren(item: any): boolean;
        /**
        * @method ns_egret.ObjectCollection#isItemOpen
        * @param item {any}
        * @returns {boolean}
        */ 
        public isItemOpen(item: any): boolean;
        /**
        * @method ns_egret.ObjectCollection#expandItem
        * @param item {any}
        * @param open {boolean}
        */ 
        public expandItem(item: any, open?: boolean): void;
        /**
        * 打开一个节点
        */ 
        private openNode(item);
        /**
        * 关闭一个节点
        */ 
        private closeNode(item);
        /**
        * @method ns_egret.ObjectCollection#getDepth
        * @param item {any}
        * @returns {number}
        */ 
        public getDepth(item: any): number;
        /**
        * 刷新数据源。
        * @method ns_egret.ObjectCollection#refresh
        */ 
        public refresh(): void;
        /**
        * 抛出事件
        */ 
        private dispatchCoEvent(kind?, location?, oldLocation?, items?, oldItems?);
        /**
        * 一个工具方法，给parent的子项以及子孙项赋值父级引用。
        * @method ns_egret.ObjectCollection.assignParent
        * @param parent {any} 要遍历子项的parent对象。
        * @param childrenKey {string} 要从parent中获取子项列表的属性名,属性值为一个数组或Vector。
        * @param parentKey {string} 要给子项赋值父级引用的属性名。
        */
        static assignParent(parent: any, childrenKey?: string, parentKey?: string): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ILayoutElement
    * @interface
    * @classdesc
    * 可布局元素接口
    * @extends ns_egret.IEventDispatcher
    */
    interface ILayoutElement extends IEventDispatcher {
        /**
        * 指定此组件是否包含在父容器的布局中。若为false，则父级容器在测量和布局阶段都忽略此组件。默认值为true。
        * 注意，visible属性与此属性不同，设置visible为false，父级容器仍会对其布局。
        * @member ns_egret.ILayoutElement#includeInLayout
        */ 
        includeInLayout: boolean;
        /**
        * 距父级容器离左边距离
        * @member ns_egret.ILayoutElement#left
        */ 
        left: number;
        /**
        * 距父级容器右边距离
        * @member ns_egret.ILayoutElement#right
        */
        right: number;
        /**
        * 距父级容器顶部距离
        * @member ns_egret.ILayoutElement#top
        */
        top: number;
        /**
        * 距父级容器底部距离
        * @member ns_egret.ILayoutElement#bottom
        */ 
        bottom: number;
        /**
        * 在父级容器中距水平中心位置的距离
        * @member ns_egret.ILayoutElement#horizontalCenter
        */ 
        horizontalCenter: number;
        /**
        * 在父级容器中距竖直中心位置的距离
        * @member ns_egret.ILayoutElement#verticalCenter
        */ 
        verticalCenter: number;
        /**
        * 相对父级容器宽度的百分比
        * @member ns_egret.ILayoutElement#percentWidth
        */ 
        percentWidth: number;
        /**
        * 相对父级容器高度的百分比
        * @member ns_egret.ILayoutElement#percentHeight
        */ 
        percentHeight: number;
        /**
        * 组件的首选x坐标,常用于父级的measure()方法中
        * @member ns_egret.ILayoutElement#preferredX
        */ 
        preferredX: number;
        /**
        * 组件的首选y坐标,常用于父级的measure()方法中
        * @member ns_egret.ILayoutElement#preferredY
        */
        preferredY: number;
        /**
        * 组件水平方向起始坐标
        * @member ns_egret.ILayoutElement#layoutBoundsX
        */ 
        layoutBoundsX: number;
        /**
        * 组件竖直方向起始坐标
        * @member ns_egret.ILayoutElement#layoutBoundsY
        */ 
        layoutBoundsY: number;
        /**
        * 组件的首选宽度,常用于父级的measure()方法中
        * 按照：外部显式设置宽度>测量宽度 的优先级顺序返回宽度
        * 注意:此数值已经包含了scaleX的值
        * @member ns_egret.ILayoutElement#preferredWidth
        */ 
        preferredWidth: number;
        /**
        * 组件的首选高度,常用于父级的measure()方法中
        * 按照：外部显式设置高度>测量高度 的优先级顺序返回高度
        * 注意:此数值已经包含了scaleY的值
        * @member ns_egret.ILayoutElement#preferredHeight
        */
        preferredHeight: number;
        /**
        * 组件的布局宽度,常用于父级的updateDisplayList()方法中
        * 按照：布局宽度>外部显式设置宽度>测量宽度 的优先级顺序返回宽度
        * 注意:此数值已经包含了scaleX的值
        * @member ns_egret.ILayoutElement#layoutBoundsWidth
        */ 
        layoutBoundsWidth: number;
        /**
        * 组件的布局高度,常用于父级的updateDisplayList()方法中
        * 按照：布局高度>外部显式设置高度>测量高度 的优先级顺序返回高度
        * 注意:此数值已经包含了scaleY的值
        * @member ns_egret.ILayoutElement#layoutBoundsHeight
        */ 
        layoutBoundsHeight: number;
        /**
        * 表示从注册点开始应用的对象的水平缩放比例（百分比）。默认注册点为 (0,0)。1.0 等于 100% 缩放。
        * @member ns_egret.ILayoutElement#scaleX
        */ 
        scaleX: number;
        /**
        * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。默认注册点为 (0,0)。1.0 是 100% 缩放。
        * @member ns_egret.ILayoutElement#scaleY
        */ 
        scaleY: number;
        /**
        * 组件的最大测量宽度,仅影响measuredWidth属性的取值范围。
        * @member ns_egret.ILayoutElement#maxWidth
        */ 
        maxWidth: number;
        /**
        * 组件的最小测量宽度,此属性设置为大于maxWidth的值时无效。仅影响measuredWidth属性的取值范围。
        * @member ns_egret.ILayoutElement#minWidth
        */
        minWidth: number;
        /**
        * 组件的最大测量高度,仅影响measuredHeight属性的取值范围。
        * @member ns_egret.ILayoutElement#maxHeight
        */
        maxHeight: number;
        /**
        * 组件的最小测量高度,此属性设置为大于maxHeight的值时无效。仅影响measuredHeight属性的取值范围。
        * @member ns_egret.ILayoutElement#minHeight
        */
        minHeight: number;
        /**
        * 设置组件的布局宽高,此值应已包含scaleX,scaleY的值
        * @method ns_egret.ILayoutElement#setLayoutBoundsSize
        * @param width {number}
        * @param height {number}
        */ 
        setLayoutBoundsSize(width: number, height: number): void;
        /**
        * 设置组件的布局位置
        * @method ns_egret.ILayoutElement#setLayoutBoundsPosition
        * @param x {number}
        * @param y {number}
        */ 
        setLayoutBoundsPosition(x: number, y: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IVisualElement
    * @interface
    * @classdesc
    * 可视元素接口
    * @extends ns_egret.ILayoutElement
    */ 
    interface IVisualElement extends ILayoutElement {
        /**
        * 此IVisualElement对象的所有者。<br/>
        * 0.默认情况下，owner指向parent属性的值。<br/>
        * 1.当此对象被PopUpAnchor组件弹出时，owner指向PopUpAnchor<br/>
        * 2.当此对象作为皮肤内contentGroup的子项时，owner指向主机组件SkinnableContainer<br/>
        * 3.当此对象作为ItemRenderer时，owner指向DataGroup或者主机组件SkinnableDataContainer<br/>
        * 4.当此对象作为非显示对象容器IContainer的子项时,owner指向IContainer。
        * @member ns_egret.IVisualElement#owner
        */ 
        owner: any;
        /**
        * owner属性由框架内部管理，请不要自行改变它的值，否则可能引发未知的问题。
        * @method ns_egret.IVisualElement#ownerChanged
        * @param value {Object}
        */ 
        ownerChanged(value: Object): void;
        /**
        * 元素名称。此属性在TabNavigator里作为选项卡显示的字符串。
        * @member ns_egret.IVisualElement#name
        */ 
        name: string;
        /**
        * 此组件的父容器或组件。
        * 只有可视元素应该具有 parent 属性。
        * 非可视项目应该使用其他属性引用其所属对象。
        * 一般而言，非可视对象使用 owner 属性引用其所属对象。
        * @member ns_egret.IVisualElement#parent
        */
        parent: DisplayObjectContainer;
        /**
        * 控制此可视元素的可见性。如果为 true，则对象可见。
        * @member ns_egret.IVisualElement#visible
        */ 
        visible: boolean;
        /**
        * 表示指定对象的 Alpha 透明度值。有效值为 0（完全透明）到 1（完全不透明）。默认值为 1。alpha 设置为 0 的显示对象是活动的，即使它们不可见。
        * @member ns_egret.IVisualElement#alpha
        */ 
        alpha: number;
        /**
        * 组件宽度
        * @member ns_egret.IVisualElement#width
        */ 
        width: number;
        /**
        * 组件高度
        * @member ns_egret.IVisualElement#height
        */ 
        height: number;
        /**
        * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
        * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer
        * 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer
        * 的子级将继承逆时针旋转 90 度的坐标系。对象的坐标指的是注册点的位置。
        * @constant ns_egret.IVisualElement#x
        */ 
        x: number;
        /**
        * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
        * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer
        * 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer
        * 的子级将继承逆时针旋转 90 度的坐标系。对象的坐标指的是注册点的位置。
        * @constant ns_egret.IVisualElement#y
        */ 
        y: number;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IContainer
    * @interface
    * @classdesc
    * 容器接口
    */
    interface IContainer {
        /**
        * 此容器中的可视元素的数量。
        * 可视元素包括实现 IVisualElement 接口的类，
        * @member ns_egret.IContainer#numElements
        */ 
        numElements: number;
        /**
        * 返回指定索引处的可视元素。
        * @method ns_egret.IContainer#getElementAt
        * @param index {number} 要检索的元素的索引。
        * @throws RangeError 如果在子列表中不存在该索引位置。
        * @returns {IVisualElement}
        */ 
        getElementAt(index: number): IVisualElement;
        /**
        * 将可视元素添加到此容器中。
        * 如果添加的可视元素已有一个不同的容器作为父项，则该元素将会从其他容器中删除。
        * @method ns_egret.IContainer#addElement
        * @param element {IVisualElement} 要添加为此容器的子项的可视元素。
        * @returns {IVisualElement}
        */ 
        addElement(element: IVisualElement): IVisualElement;
        /**
        * 将可视元素添加到此容器中。该元素将被添加到指定的索引位置。索引 0 代表显示列表中的第一个元素。
        * 如果添加的可视元素已有一个不同的容器作为父项，则该元素将会从其他容器中删除。
        * @method ns_egret.IContainer#addElementAt
        * @param element {IVisualElement} 要添加为此可视容器的子项的元素。
        * @param index {number} 将该元素添加到的索引位置。如果指定当前占用的索引位置，则该位置以及所有更高位置上的子对象会在子级列表中上移一个位置。
        * @throws RangeError 如果在子列表中不存在该索引位置。
        * @returns {IVisualElement}
        */ 
        addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
        * 从此容器的子列表中删除指定的可视元素。
        * 在该可视容器中，位于该元素之上的所有元素的索引位置都减少 1。
        * @method ns_egret.IContainer#removeElement
        * @param element {IVisualElement} 要从容器中删除的元素。
        * @returns {IVisualElement}
        */ 
        removeElement(element: IVisualElement): IVisualElement;
        /**
        * 从容器中的指定索引位置删除可视元素。
        * 在该可视容器中，位于该元素之上的所有元素的索引位置都减少 1。
        * @method ns_egret.IContainer#removeElementAt
        * @param index {number} 要删除的元素的索引。
        * @throws RangeError 如果在子列表中不存在该索引位置。
        * @returns {IVisualElement}
        */ 
        removeElementAt(index: number): IVisualElement;
        /**
        * 返回可视元素的索引位置。若不存在，则返回-1。
        * @method ns_egret.IContainer#getElementIndex
        * @param element {IVisualElement} 可视元素。
        * @returns {number}
        */ 
        getElementIndex(element: IVisualElement): number;
        /**
        * 在可视容器中更改现有可视元素的位置。
        * @method ns_egret.IContainer#setElementIndex
        * @param element {IVisualElement} 要为其更改索引编号的元素。
        * @param index {number} 元素的最终索引编号。
        * @throws RangeError 如果在子列表中不存在该索引位置。
        */ 
        setElementIndex(element: IVisualElement, index: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ISystemManager
    * @interface
    * @classdesc
    * @extends ns_egret.IEventDispatcher
    */
    interface ISystemManager extends IEventDispatcher {
        /**
        * 弹出窗口层容器。
        * @member ns_egret.ISystemManager#popUpContainer
        */ 
        popUpContainer: IContainer;
        /**
        * 工具提示层容器。
        * @member ns_egret.ISystemManager#toolTipContainer
        */ 
        toolTipContainer: IContainer;
        /**
        * 鼠标样式层容器。
        * @member ns_egret.ISystemManager#cursorContainer
        */ 
        cursorContainer: IContainer;
        /**
        * 舞台引用
        * @member ns_egret.ISystemManager#stage
        */ 
        stage: Stage;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.UIGlobals
    * @classdesc
    */
    class UIGlobals {
        private static _stage;
        /**
        * 舞台引用，当第一个UIComponent添加到舞台时此属性被自动赋值
        * @member ns_egret.UIGlobals.stage
        */ 
        static stage : Stage;
        /**
        * 已经初始化完成标志
        */ 
        private static initlized;
        /**
        * 初始化管理器
        * @method ns_egret.UIGlobals._initlize
        * @param stage {Stage}
        */ 
        static _initlize(stage: Stage): void;
        /**
        * 延迟渲染布局管理器
        * @member ns_egret.UIGlobals._layoutManager
        */ 
        static _layoutManager: LayoutManager;
        /**
        * 系统管理器列表
        */ 
        static _systemManager: ISystemManager;
        /**
        * 顶级应用容器
        * @member ns_egret.UIGlobals.systemManager
        */
        static systemManager : ISystemManager;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.UIEvent
    * @classdesc
    * UI事件
    * @extends ns_egret.Event
    */
    class UIEvent extends Event {
        /**
        * @method ns_egret.UIEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
        * 组件初始化开始
        * @constant ns_egret.UIEvent.INITIALIZE
        */ 
        static INITIALIZE: string;
        /**
        * 组件创建完成
        * @constant ns_egret.UIEvent.CREATION_COMPLETE
        */ 
        static CREATION_COMPLETE: string;
        /**
        * 组件的一次三个延迟验证渲染阶段全部完成
        * @constant ns_egret.UIEvent.UPDATE_COMPLETE
        */ 
        static UPDATE_COMPLETE: string;
        /**
        * 当用户按下ButtonBase控件时分派。如果 autoRepeat属性为 true，则只要按钮处于按下状态，就将重复分派此事件。
        * @constant ns_egret.UIEvent.BUTTON_DOWN
        */ 
        static BUTTON_DOWN: string;
        /**
        * 改变结束
        * @constant ns_egret.UIEvent.CHANGE_END
        */ 
        static CHANGE_END: string;
        /**
        * 改变开始
        * @constant ns_egret.UIEvent.CHANGE_START
        */ 
        static CHANGE_START: string;
        /**
        * 正在改变中
        * @constant ns_egret.UIEvent.CHANGING
        */ 
        static CHANGING: string;
        /**
        * 值发生改变
        * @constant ns_egret.UIEvent.VALUE_COMMIT
        */ 
        static VALUE_COMMIT: string;
        /**
        * SkinnableComponent皮肤发生改变
        * @constant ns_egret.UIEvent.SKIN_CHANGED
        */ 
        static SKIN_CHANGED: string;
        /**
        * UIAsset的content属性解析完成
        * @constant ns_egret.UIEvent.CONTENT_CHANGED
        */
        static CONTENT_CHANGED: string;
        /**
        * 下拉框弹出事件
        * @constant ns_egret.UIEvent.OPEN
        */ 
        static OPEN: string;
        /**
        * 下拉框关闭事件
        * @constant ns_egret.UIEvent.CLOSE
        */ 
        static CLOSE: string;
        /**
        * UIMoveClip一次播放完成事件。仅当UIMovieClip.totalFrames>1时会抛出此事件。
        * @constant ns_egret.UIEvent.PLAY_COMPLETE
        */ 
        static PLAY_COMPLETE: string;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.UIEvent.dispatchUIEvent
        */
        static dispatchUIEvent(target: IEventDispatcher, type: string): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ILayoutManagerClient
    * @interface
    * @classdesc
    * 使用布局管理器的组件接口
    * @extends ns_egret.IEventDispatcher
    */
    interface ILayoutManagerClient extends IEventDispatcher {
        /**
        * 验证组件的属性
        * @method ns_egret.ILayoutManagerClient#validateProperties
        */ 
        validateProperties(): void;
        /**
        * 验证组件的尺寸
        * @method ns_egret.ILayoutManagerClient#validateSize
        * @param recursive? {boolean}
        */ 
        validateSize(recursive?: boolean): void;
        /**
        * 验证子项的位置和大小，并绘制其他可视内容
        * @method ns_egret.ILayoutManagerClient#validateDisplayList
        */ 
        validateDisplayList(): void;
        /**
        * 在显示列表的嵌套深度
        * @member ns_egret.ILayoutManagerClient#nestLevel
        */ 
        nestLevel: number;
        /**
        * 是否完成初始化。此标志只能由 LayoutManager 修改。
        * @member ns_egret.ILayoutManagerClient#initialized
        */ 
        initialized: boolean;
        /**
        * 一个标志，用于确定某个对象是否正在等待分派其updateComplete事件。此标志只能由 LayoutManager 修改。
        * @member ns_egret.ILayoutManagerClient#updateCompletePendingFlag
        */ 
        updateCompletePendingFlag: boolean;
        /**
        * 父级显示对象
        * @member ns_egret.ILayoutManagerClient#parent
        */ 
        parent: DisplayObjectContainer;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.DepthQueue
    * @classdesc
    * 显示列表嵌套深度排序队列
    */
    class DepthQueue {
        /**
        * @method ns_egret.DepthQueue#constructor
        */
        constructor();
        /**
        * 深度队列
        */
        private depthBins;
        /**
        * 最小深度
        */
        private minDepth;
        /**
        * 最大深度
        */
        private maxDepth;
        /**
        * 插入一个元素
        * @method ns_egret.DepthQueue#insert
        * @param client {ILayoutManagerClient}
        */ 
        public insert(client: ILayoutManagerClient): void;
        /**
        * 从队列尾弹出深度最大的一个对象
        * @method ns_egret.DepthQueue#pop
        * @returns {ILayoutManagerClient}
        */ 
        public pop(): ILayoutManagerClient;
        /**
        * 从队列首弹出深度最小的一个对象
        * @method ns_egret.DepthQueue#shift
        * @returns {ILayoutManagerClient}
        */ 
        public shift(): ILayoutManagerClient;
        /**
        * 移除大于等于指定组件层级的元素中最大的元素
        * @method ns_egret.DepthQueue#removeLargestChild
        * @param client {ILayoutManagerClient}
        * @returns {any}
        */
        public removeLargestChild(client: ILayoutManagerClient): any;
        /**
        * 移除大于等于指定组件层级的元素中最小的元素
        * @method ns_egret.DepthQueue#removeSmallestChild
        * @param client {ILayoutManagerClient}
        * @returns {any}
        */
        public removeSmallestChild(client: ILayoutManagerClient): any;
        /**
        * 移除一个元素
        * @method ns_egret.DepthQueue#remove
        * @param client {ILayoutManagerClient}
        * @param level {number}
        * @returns {ILayoutManagerClient}
        */
        public remove(client: ILayoutManagerClient, level?: number): ILayoutManagerClient;
        /**
        * 清空队列
        * @method ns_egret.DepthQueue#removeAll
        */ 
        public removeAll(): void;
        /**
        * 队列是否为空
        * @method ns_egret.DepthQueue#isEmpty
        * @returns {boolean}
        */ 
        public isEmpty(): boolean;
    }
    /**
    * @class ns_egret.DepthBin
    * @classdesc
    * 列表项
    */
    class DepthBin {
        /**
        * @member ns_egret.DepthBin#length
        */
        public length: number;
        /**
        * @member ns_egret.DepthBin#items
        */
        public items: any;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.LayoutManager
    * @classdesc
    * 布局管理器
    * @extends ns_egret.EventDispatcher
    */
    class LayoutManager extends EventDispatcher {
        /**
        * @method ns_egret.LayoutManager#constructor
        */
        constructor();
        private targetLevel;
        /**
        * 需要抛出组件初始化完成事件的对象
        */ 
        private updateCompleteQueue;
        private invalidatePropertiesFlag;
        private invalidateClientPropertiesFlag;
        private invalidatePropertiesQueue;
        /**
        * 标记组件提交过属性
        * @method ns_egret.LayoutManager#invalidateProperties
        * @param client {ILayoutManagerClient}
        */ 
        public invalidateProperties(client: ILayoutManagerClient): void;
        /**
        * 使提交的属性生效
        */ 
        private validateProperties();
        private invalidateSizeFlag;
        private invalidateClientSizeFlag;
        private invalidateSizeQueue;
        /**
        * 标记需要重新测量尺寸
        * @method ns_egret.LayoutManager#invalidateSize
        * @param client {ILayoutManagerClient}
        */ 
        public invalidateSize(client: ILayoutManagerClient): void;
        /**
        * 测量属性
        */ 
        private validateSize();
        private invalidateDisplayListFlag;
        private invalidateDisplayListQueue;
        /**
        * 标记需要重新测量尺寸
        * @method ns_egret.LayoutManager#invalidateDisplayList
        * @param client {ILayoutManagerClient}
        */ 
        public invalidateDisplayList(client: ILayoutManagerClient): void;
        /**
        * 测量属性
        */ 
        private validateDisplayList();
        /**
        * 是否已经添加了事件监听
        */ 
        private listenersAttached;
        /**
        * 添加事件监听
        */ 
        private attachListeners();
        /**
        * 执行属性应用
        */ 
        private doPhasedInstantiationCallBack(event?);
        private doPhasedInstantiation();
        /**
        * 立即应用所有延迟的属性
        * @method ns_egret.LayoutManager#validateNow
        */ 
        public validateNow(): void;
        /**
        * 使大于等于指定组件层级的元素立即应用属性
        * @method ns_egret.LayoutManager#validateClient
        * @param target {ILayoutManagerClient} 要立即应用属性的组件
        * @param skipDisplayList {boolean} 是否跳过更新显示列表阶段
        */ 
        public validateClient(target: ILayoutManagerClient, skipDisplayList?: boolean): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.IInvalidating
    * @interface
    * @classdesc
    * 拥有失效验证机制组件接口
    */
    interface IInvalidating {
        /**
        * 标记提交过需要延迟应用的属性
        * @method ns_egret.IInvalidating#invalidateProperties
        */ 
        invalidateProperties(): void;
        /**
        * 标记提交过需要验证组件尺寸
        * @method ns_egret.IInvalidating#invalidateSize
        */ 
        invalidateSize(): void;
        /**
        * 标记需要验证显示列表
        * @method ns_egret.IInvalidating#invalidateDisplayList
        */ 
        invalidateDisplayList(): void;
        /**
        * 立即应用组件及其子项的所有属性
        * @method ns_egret.IInvalidating#validateNow
        * @param skipDisplayList? {boolean} 是否跳过显示列表验证阶段,默认false
        */ 
        validateNow(skipDisplayList?: boolean): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IUIComponent
    * @interface
    * @classdesc
    * UI组件接口
    * @extends ns_egret.IVisualElement
    */ 
    interface IUIComponent extends IVisualElement {
        /**
        * 组件是否可以接受用户交互。
        * @member ns_egret.IUIComponent#enabled
        */
        enabled: boolean;
        /**
        * PopUpManager将其设置为true,以指示已弹出该组件。
        * @member ns_egret.IUIComponent#isPopUp
        */
        isPopUp: boolean;
        /**
        * 外部显式指定的高度
        * @member ns_egret.IUIComponent#explicitHeight
        */
        explicitHeight: number;
        /**
        * 外部显式指定的宽度
        * @member ns_egret.IUIComponent#explicitWidth
        */
        explicitWidth: number;
        /**
        * 设置组件的宽高，w,h均不包含scale值。此方法不同于直接设置width,height属性，
        * 不会影响显式标记尺寸属性widthExplicitlySet,_heightExplicitlySet
        * @method ns_egret.IUIComponent#setActualSize
        * @param newWidth {number}
        * @param newHeight {number}
        */ 
        setActualSize(newWidth: number, newHeight: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.MoveEvent
    * @classdesc
    * 移动事件
    * @extends ns_egret.Event
    */
    class MoveEvent extends Event {
        /**
        * @constant ns_egret.MoveEvent.MOVE
        */
        static MOVE: string;
        /**
        * @method ns_egret.MoveEvent#constructor
        * @param type {string}
        * @param oldX {number}
        * @param oldY {number}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        */
        constructor(type: string, oldX?: number, oldY?: number, bubbles?: boolean, cancelable?: boolean);
        /**
        * 旧的组件X
        * @member ns_egret.MoveEvent#oldX
        */
        public oldX: number;
        /**
        * 旧的组件Y
        * @member ns_egret.MoveEvent#oldY
        */
        public oldY: number;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.MoveEvent.dispatchMoveEvent
        */
        static dispatchMoveEvent(target: IEventDispatcher, oldX?: number, oldY?: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.PropertyChangeEvent
    * @classdesc
    * 对象的一个属性发生更改时传递到事件侦听器的事件
    * @extends ns_egret.Event
    */
    class PropertyChangeEvent extends Event {
        /**
        * 属性改变
        * @constant ns_egret.PropertyChangeEvent.PROPERTY_CHANGE
        */ 
        static PROPERTY_CHANGE: string;
        /**
        * 构造函数
        * @method ns_egret.PropertyChangeEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        * @param kind {string}
        * @param property {any}
        * @param oldValue {any}
        * @param newValue {any}
        * @param source {any}
        */ 
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, kind?: string, property?: any, oldValue?: any, newValue?: any, source?: any);
        /**
        * 指定更改的类型。可能的值为 PropertyChangeEventKind.UPDATE、PropertyChangeEventKind.DELETE 和 null。
        * @member ns_egret.PropertyChangeEvent#kind
        */ 
        public kind: string;
        /**
        * 更改后的属性的值。
        * @member ns_egret.PropertyChangeEvent#newValue
        */ 
        public newValue: any;
        /**
        * 更改后的属性的值。
        * @member ns_egret.PropertyChangeEvent#oldValue
        */
        public oldValue: any;
        /**
        * 指定已更改属性的 String、QName 或 int。
        * @member ns_egret.PropertyChangeEvent#property
        */
        public property: any;
        /**
        * 发生更改的对象。
        * @member ns_egret.PropertyChangeEvent#source
        */ 
        public source: any;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.PropertyChangeEvent.dispatchPropertyChangeEvent
        */
        static dispatchPropertyChangeEvent(target: IEventDispatcher, kind?: string, property?: any, oldValue?: any, newValue?: any, source?: any): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.PropertyChangeEventKind
    * @classdesc
    * PropertyChangeEventKind 类定义 PropertyChangeEvent 类的 kind 属性的常量值。
    */
    class PropertyChangeEventKind {
        /**
        * 指示该属性的值已更改。
        * @constant ns_egret.PropertyChangeEventKind.UPDATE
        */ 
        static UPDATE: string;
        /**
        * 指示该属性已从此对象中删除。
        * @constant ns_egret.PropertyChangeEventKind.DELETE
        */
        static DELETE: string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ResizeEvent
    * @classdesc
    * 尺寸改变事件
    * @extends ns_egret.Event
    */
    class ResizeEvent extends Event {
        /**
        * @constant ns_egret.ResizeEvent.RESIZE
        */
        static RESIZE: string;
        /**
        * @method ns_egret.ResizeEvent#constructor
        * @param type {string}
        * @param oldWidth {number}
        * @param oldHeight {number}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        */
        constructor(type: string, oldWidth?: number, oldHeight?: number, bubbles?: boolean, cancelable?: boolean);
        /**
        * 旧的高度
        * @member ns_egret.ResizeEvent#oldHeight
        */
        public oldHeight: number;
        /**
        * 旧的宽度
        * @member ns_egret.ResizeEvent#oldWidth
        */
        public oldWidth: number;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.ResizeEvent.dispatchResizeEvent
        */
        static dispatchResizeEvent(target: IEventDispatcher, oldWidth?: number, oldHeight?: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.UIComponent
    * @classdesc
    * 显示对象基类
    * @extends ns_egret.DisplayObjectContainer
    * @implements ns_egret.IUIComponent
    * @implements ns_egret.ILayoutManagerClient
    * @implements ns_egret.ILayoutElement
    * @implements ns_egret.IInvalidating
    * @implements ns_egret.IVisualElement
    */
    class UIComponent extends DisplayObjectContainer implements IUIComponent, ILayoutManagerClient, ILayoutElement, IInvalidating, IVisualElement {
        /**
        * 构造函数
        * @method ns_egret.UIComponent#constructor
        */ 
        constructor();
        /**
        * 添加到舞台
        */ 
        private onAddedToStage(e);
        private _id;
        /**
        * 组件 ID。此值将作为对象的实例名称，因此不应包含任何空格或特殊字符。应用程序中的每个组件都应具有唯一的 ID。
        * @constant ns_egret.UIComponent#id
        */ 
        public id : string;
        private _isPopUp;
        /**
        * @member ns_egret.UIComponent#isPopUp
        */
        public isPopUp : boolean;
        private _owner;
        /**
        * @member ns_egret.UIComponent#owner
        */
        public owner : any;
        /**
        * @method ns_egret.UIComponent#ownerChanged
        * @param value {any}
        */
        public ownerChanged(value: any): void;
        private _updateCompletePendingFlag;
        /**
        * @member ns_egret.UIComponent#updateCompletePendingFlag
        */ 
        public updateCompletePendingFlag : boolean;
        private _initialized;
        /**
        * @member ns_egret.UIComponent#initialized
        */
        public initialized : boolean;
        /**
        * _initialize()方法被调用过的标志。
        */ 
        private initializeCalled;
        /**
        * 初始化组件
        * @method ns_egret.UIComponent#_initialize
        */
        public _initialize(): void;
        /**
        * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
        * 请务必调用super.createChildren()以完成父类组件的初始化
        * @method ns_egret.UIComponent#createChildren
        */ 
        public createChildren(): void;
        /**
        * 子项创建完成
        * @method ns_egret.UIComponent#childrenCreated
        */ 
        private childrenCreated();
        private _nestLevel;
        /**
        * @member ns_egret.UIComponent#nestLevel
        */ 
        public nestLevel : number;
        /**
        * @method ns_egret.UIComponent#addChild
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */
        public addChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.UIComponent#addChildAt
        * @param child {DisplayObject}
        * @param index {number}
        * @returns {DisplayObject}
        */
        public addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
        * 即将添加一个子项
        * @method ns_egret.UIComponent#_addingChild
        * @param child {DisplayObject}
        */ 
        public _addingChild(child: DisplayObject): void;
        /**
        * 已经添加一个子项
        */ 
        public _childAdded(child: DisplayObject): void;
        /**
        * @method ns_egret.UIComponent#removeChild
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */
        public removeChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.UIComponent#removeChildAt
        * @param index {number}
        * @returns {DisplayObject}
        */
        public removeChildAt(index: number): DisplayObject;
        /**
        * 已经移除一个子项
        */
        public _childRemoved(child: DisplayObject): void;
        /**
        * 检查属性失效标记并应用
        */ 
        private checkInvalidateFlag(event?);
        public _enabled: boolean;
        /**
        * @member ns_egret.UIComponent#enabled
        */
        public enabled : boolean;
        /**
        * 属性提交前组件旧的宽度
        */ 
        private oldWidth;
        public _width: number;
        public _setWidth(value: number): void;
        /**
        * @member ns_egret.UIComponent#width
        */
        /**
        * 组件宽度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
        */ 
        public width : number;
        /**
        * 属性提交前组件旧的高度
        */
        private oldHeight;
        public _height: number;
        public _setHeight(value: number): void;
        /**
        * @member ns_egret.UIComponent#height
        */
        /**
        * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
        */ 
        public height : number;
        /**
        * 过滤NaN数字
        */ 
        private escapeNaN(number);
        /**
        * @member ns_egret.UIComponent#scaleX
        */
        /**
        * @inheritDoc
        */
        public scaleX : number;
        public _setScaleX(value: number): void;
        /**
        * @member ns_egret.UIComponent#scaleY
        */
        /**
        * @inheritDoc
        */
        public scaleY : number;
        public _setScaleY(value: number): void;
        private _minWidth;
        /**
        * @member ns_egret.UIComponent#minWidth
        */
        public minWidth : number;
        private _maxWidth;
        /**
        * @member ns_egret.UIComponent#maxWidth
        */
        public maxWidth : number;
        private _minHeight;
        /**
        * @member ns_egret.UIComponent#minHeight
        */
        public minHeight : number;
        private _maxHeight;
        /**
        * @member ns_egret.UIComponent#maxHeight
        */
        public maxHeight : number;
        private _measuredWidth;
        /**
        * 组件的默认宽度（以像素为单位）。此值由 measure() 方法设置。
        * @member ns_egret.UIComponent#measuredWidth
        */ 
        public measuredWidth : number;
        private _measuredHeight;
        /**
        * 组件的默认高度（以像素为单位）。此值由 measure() 方法设置。
        * @member ns_egret.UIComponent#measuredHeight
        */
        public measuredHeight : number;
        /**
        * @method ns_egret.UIComponent#setActualSize
        * @param w {number}
        * @param h {number}
        */
        public setActualSize(w: number, h: number): void;
        /**
        * 属性提交前组件旧的X
        * @member ns_egret.UIComponent#oldX
        */
        private oldX;
        /**
        * @constant ns_egret.UIComponent#x
        */
        /**
        * @inheritDoc
        */
        public x : number;
        /**
        * 属性提交前组件旧的Y
        * @member ns_egret.UIComponent#oldY
        */
        private oldY;
        /**
        * @constant ns_egret.UIComponent#y
        */
        /**
        * @inheritDoc
        */
        public y : number;
        /**
        * @member ns_egret.UIComponent#_invalidatePropertiesFlag
        */
        public _invalidatePropertiesFlag: boolean;
        /**
        * @method ns_egret.UIComponent#invalidateProperties
        */ 
        public invalidateProperties(): void;
        /**
        * @method ns_egret.UIComponent#validateProperties
        */ 
        public validateProperties(): void;
        /**
        * @member ns_egret.UIComponent#_invalidateSizeFlag
        */
        public _invalidateSizeFlag: boolean;
        /**
        * @method ns_egret.UIComponent#invalidateSize
        */ 
        public invalidateSize(): void;
        /**
        * @method ns_egret.UIComponent#validateSize
        * @param recursive {boolean}
        */ 
        public validateSize(recursive?: boolean): void;
        /**
        * 上一次测量的首选宽度
        * @member ns_egret.UIComponent#_oldPreferWidth
        */ 
        public _oldPreferWidth: number;
        /**
        * 上一次测量的首选高度
        * @member ns_egret.UIComponent#_oldPreferHeight
        */ 
        public _oldPreferHeight: number;
        /**
        * 测量组件尺寸，返回尺寸是否发生变化
        */ 
        private measureSizes();
        /**
        * @member ns_egret.UIComponent#_invalidateDisplayListFlag
        */
        public _invalidateDisplayListFlag: boolean;
        /**
        * @method ns_egret.UIComponent#invalidateDisplayList
        */ 
        public invalidateDisplayList(): void;
        /**
        * @method ns_egret.UIComponent#validateDisplayList
        */ 
        public validateDisplayList(): void;
        /**
        * @member ns_egret.UIComponent#_validateNowFlag
        */
        public _validateNowFlag: boolean;
        /**
        * @method ns_egret.UIComponent#validateNow
        * @param skipDisplayList {boolean}
        */ 
        public validateNow(skipDisplayList?: boolean): void;
        /**
        * 标记父级容器的尺寸和显示列表为失效
        * @method ns_egret.UIComponent#invalidateParentSizeAndDisplayList
        */ 
        public invalidateParentSizeAndDisplayList(): void;
        /**
        * 更新显示列表
        * @method ns_egret.UIComponent#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */ 
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
        * 是否可以跳过测量尺寸阶段,返回true则不执行measure()方法
        * @method ns_egret.UIComponent#canSkipMeasurement
        * @returns {boolean}
        */ 
        public canSkipMeasurement(): boolean;
        /**
        * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
        * @method ns_egret.UIComponent#commitProperties
        */ 
        public commitProperties(): void;
        /**
        * 测量组件尺寸
        * @method ns_egret.UIComponent#measure
        */ 
        public measure(): void;
        /**
        *  抛出移动事件
        */
        private dispatchMoveEvent();
        /**
        * 子项的xy位置发生改变
        */
        public _childXYChanged(): void;
        /**
        *  抛出尺寸改变事件
        */
        private dispatchResizeEvent();
        /**
        * 抛出属性值改变事件
        * @method ns_egret.UIComponent#dispatchPropertyChangeEvent
        * @param prop {string} 改变的属性名
        * @param oldValue {any} 属性的原始值
        * @param value {any} 属性的新值
        */ 
        public dispatchPropertyChangeEvent(prop: string, oldValue: any, value: any): void;
        public _includeInLayout: boolean;
        /**
        * @member ns_egret.UIComponent#includeInLayout
        */
        public includeInLayout : boolean;
        private _left;
        /**
        * @member ns_egret.UIComponent#left
        */
        public left : number;
        private _right;
        /**
        * @member ns_egret.UIComponent#right
        */
        public right : number;
        private _top;
        /**
        * @member ns_egret.UIComponent#top
        */
        public top : number;
        private _bottom;
        /**
        * @member ns_egret.UIComponent#bottom
        */ 
        public bottom : number;
        private _horizontalCenter;
        /**
        * @member ns_egret.UIComponent#horizontalCenter
        */
        public horizontalCenter : number;
        private _verticalCenter;
        /**
        * @member ns_egret.UIComponent#verticalCenter
        */
        public verticalCenter : number;
        private _percentWidth;
        /**
        * @member ns_egret.UIComponent#percentWidth
        */
        public percentWidth : number;
        private _percentHeight;
        /**
        * @member ns_egret.UIComponent#percentHeight
        */
        public percentHeight : number;
        /**
        * 父级布局管理器设置了组件的宽度标志，尺寸设置优先级：自动布局>显式设置>自动测量
        * @member ns_egret.UIComponent#_layoutWidthExplicitlySet
        */
        public _layoutWidthExplicitlySet: boolean;
        /**
        * 父级布局管理器设置了组件的高度标志，尺寸设置优先级：自动布局>显式设置>自动测量
        * @member ns_egret.UIComponent#_layoutHeightExplicitlySet
        */
        public _layoutHeightExplicitlySet: boolean;
        /**
        * @method ns_egret.UIComponent#setLayoutBoundsSize
        * @param layoutWidth {number}
        * @param layoutHeight {number}
        */ 
        public setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void;
        /**
        * @method ns_egret.UIComponent#setLayoutBoundsPosition
        * @param x {number}
        * @param y {number}
        */ 
        public setLayoutBoundsPosition(x: number, y: number): void;
        /**
        * @member ns_egret.UIComponent#preferredWidth
        */ 
        public preferredWidth : number;
        /**
        * @member ns_egret.UIComponent#preferredHeight
        */
        public preferredHeight : number;
        /**
        * @member ns_egret.UIComponent#preferredX
        */ 
        public preferredX : number;
        /**
        * @member ns_egret.UIComponent#preferredY
        */
        public preferredY : number;
        /**
        * @member ns_egret.UIComponent#layoutBoundsX
        */
        public layoutBoundsX : number;
        /**
        * @member ns_egret.UIComponent#layoutBoundsY
        */
        public layoutBoundsY : number;
        /**
        * @member ns_egret.UIComponent#layoutBoundsWidth
        */ 
        public layoutBoundsWidth : number;
        /**
        * 组件的布局高度,常用于父级的updateDisplayList()方法中
        * 按照：布局高度>外部显式设置高度>测量高度 的优先级顺序返回高度
        * @member ns_egret.UIComponent#layoutBoundsHeight
        */ 
        public layoutBoundsHeight : number;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.PopUpPosition
    * @classdesc
    * 定义弹出位置的常量值。
    * 该常量决定目标对象相对于父级组件的弹出位置。
    */ 
    class PopUpPosition {
        /**
        * 在组件上方弹出
        * @constant ns_egret.PopUpPosition.ABOVE
        */ 
        static ABOVE: string;
        /**
        * 在组件下方弹出
        * @constant ns_egret.PopUpPosition.BELOW
        */ 
        static BELOW: string;
        /**
        * 在组件中心弹出
        * @constant ns_egret.PopUpPosition.CENTER
        */ 
        static CENTER: string;
        /**
        * 在组件左上角弹出
        * @constant ns_egret.PopUpPosition.TOP_LEFT
        */ 
        static TOP_LEFT: string;
        /**
        * 在组件左边弹出
        * @constant ns_egret.PopUpPosition.LEFT
        */ 
        static LEFT: string;
        /**
        * 在组件右边弹出
        * @constant ns_egret.PopUpPosition.RIGHT
        */ 
        static RIGHT: string;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.ScrollPolicy
    * @classdesc
    * 滚动条显示策略常量
    */
    class ScrollPolicy {
        /**
        * 如果子项超出父级的尺寸，则允许滚动，反之不允许滚动。
        * @constant ns_egret.ScrollPolicy.AUTO
        */ 
        static AUTO: string;
        /**
        * 从不允许滚动。
        * @constant ns_egret.ScrollPolicy.OFF
        */ 
        static OFF: string;
        /**
        * 总是允许滚动。
        * @constant ns_egret.ScrollPolicy.ON
        */ 
        static ON: string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ClassFactory
    * @classdesc
    * @extends ns_egret.HashObject
    */
    class ClassFactory extends HashObject {
        /**
        * @method ns_egret.ClassFactory#constructor
        * @class ns_egret.ClassFactory
        * @classdesc
        * ClassFactory 实例是一个“工厂对象”，Egret 可用其生成其他类的实例，每个实例拥有相同的属性。
        * @param generator {any} newInstance() 方法根据工厂对象生成对象时使用的 Class。
        */
        constructor(generator?: any);
        /**
        * newInstance() 方法根据工厂对象生成对象时使用的 Class。
        * @member ns_egret.ns_egret#generator
        */
        public generator: any;
        /**
        * 生产一个新的实例
        * @method ns_egret.ns_egret#newInstance
        * @returns {any}
        */
        public newInstance(): any;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IStateClient
    * @interface
    * @classdesc
    * 具有视图状态的组件接口
    * @extends ns_egret.IEventDispatcher
    */
    interface IStateClient extends IEventDispatcher {
        /**
        * 组件的当前视图状态。将其设置为 "" 或 null 可将组件重置回其基本状态。
        * @member ns_egret.IStateClient#currentState
        */ 
        currentState: string;
        /**
        * 为此组件定义的视图状态。
        * @member ns_egret.IStateClient#states
        */ 
        states: any[];
        /**
        * 返回是否含有指定名称的视图状态
        * @method ns_egret.IStateClient#hasState
        * @param stateName {string} 要检测的视图状态名称
        * @returns {boolean}
        */ 
        hasState(stateName: string): boolean;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IOverride
    * @interface
    * @classdesc
    * IOverride 接口用于视图状态覆盖。State 类 overrides 属性数组中的所有条目均必须实现此接口。
    */ 
    interface IOverride {
        /**
        * 初始化覆盖。在第一次调用 apply() 方法之前调用此方法，因此将覆盖的一次性初始化代码放在此方法中。
        * @method ns_egret.IOverride#initialize
        * @param parent {IStateClient}
        */ 
        initialize(parent: IStateClient): void;
        /**
        * 应用覆盖。将保留原始值，以便以后可以在 remove() 方法中恢复该值。
        * @method ns_egret.IOverride#apply
        * @param parent {IContainer}
        */ 
        apply(parent: IContainer): void;
        /**
        * 删除覆盖。在 apply() 方法中记住的值将被恢复。
        * @method ns_egret.IOverride#remove
        * @param parent {IContainer}
        */ 
        remove(parent: IContainer): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.OverrideBase
    * @classdesc
    * OverrideBase 类是视图状态所用的 override 类的基类。
    * @extends ns_egret.HashObject
    * @implements ns_egret.IOverride
    */ 
    class OverrideBase extends HashObject implements IOverride {
        /**
        * @method ns_egret.OverrideBase#constructor
        */
        constructor();
        /**
        * @method ns_egret.OverrideBase#initialize
        * @param parent {IStateClient}
        */
        public initialize(parent: IStateClient): void;
        /**
        * @method ns_egret.OverrideBase#apply
        * @param parent {IContainer}
        */
        public apply(parent: IContainer): void;
        /**
        * @method ns_egret.OverrideBase#remove
        * @param parent {IContainer}
        */
        public remove(parent: IContainer): void;
        /**
        * 从对象初始化，这是一个便利方法
        * @method ns_egret.OverrideBase#initializeFromObject
        * @param properties {any}
        * @returns {any}
        */ 
        public initializeFromObject(properties: any): any;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.ISkinAdapter
    * @interface
    * @classdesc
    * 皮肤适配器接口。
    * 若项目需要自定义可设置外观组件的skinName属性的解析规则，需要实现这个接口，
    * 然后调用Injector.mapClass("ns_egret.ISkinAdapter",YourSkinAdapter)注入到框架即可。
    */
    interface ISkinAdapter {
        /**
        * 获取皮肤显示对象
        * @method ns_egret.ISkinAdapter#getSkin
        * @param skinName {any} 待解析的皮肤标识符
        * @param hostComponentKey {string} 主机组件标识符
        * @returns {any} 皮肤对象实例
        */
        getSkin(skinName: any, hostComponentKey: string): any;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.DefaultSkinAdapter
    * @classdesc
    * 默认的ISkinAdapter接口实现
    * @implements ns_egret.ISkinAdapter
    */
    class DefaultSkinAdapter implements ISkinAdapter {
        /**
        * 构造函数
        * @method ns_egret.DefaultSkinAdapter#constructor
        */
        constructor();
        /**
        * 获取皮肤显示对象
        * @method ns_egret.ISkinAdapter#getSkin
        * @param skinName {any} 待解析的皮肤标识符
        * @param hostComponentKey {string} 主机组件标识符
        * @returns {any} 皮肤对象实例
        */
        public getSkin(skinName: any, hostComponentKey: string): any;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.SkinBasicLayout
    * @classdesc
    * 皮肤简单布局类。当SkinnableComponent的皮肤不是ISkinPartHost对象时启用。以提供子项的简单布局。
    * @extends ns_egret.HashObject
    */
    class SkinBasicLayout extends HashObject {
        /**
        * @method ns_egret.SkinBasicLayout#constructor
        */
        constructor();
        private _target;
        /**
        * 目标布局对象
        * @member ns_egret.SkinBasicLayout#target
        */
        public target : SkinnableComponent;
        /**
        * 测量组件尺寸大小
        * @method ns_egret.SkinBasicLayout#measure
        */
        public measure(): void;
        /**
        * 更新显示列表
        * @method ns_egret.SkinBasicLayout#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ISkin
    * @interface
    * @classdesc
    * 皮肤对象接口。只有实现此接口的皮肤会被匹配公开同名变量,并注入到主机组件上。
    */
    interface ISkin {
        /**
        * 主机组件引用,仅当皮肤被应用后才会对此属性赋值
        * @member ns_egret.ISkin#hostComponent
        */ 
        hostComponent: SkinnableComponent;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.SkinPartEvent
    * @classdesc
    * 皮肤组件附加移除事件
    * @extends ns_egret.Event
    */
    class SkinPartEvent extends Event {
        /**
        * 附加皮肤公共子部件
        * @constant ns_egret.SkinPartEvent.PART_ADDED
        */ 
        static PART_ADDED: string;
        /**
        * 移除皮肤公共子部件
        * @constant ns_egret.SkinPartEvent.PART_REMOVED
        */ 
        static PART_REMOVED: string;
        /**
        * @method ns_egret.SkinPartEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        * @param partName {string}
        * @param instance {any}
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, partName?: string, instance?: any);
        /**
        * 被添加或移除的皮肤组件实例
        * @member ns_egret.SkinPartEvent#instance
        */ 
        public instance: any;
        /**
        * 被添加或移除的皮肤组件的实例名
        * @member ns_egret.SkinPartEvent#partName
        */ 
        public partName: string;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.SkinPartEvent.dispatchSkinPartEvent
        */
        static dispatchSkinPartEvent(target: IEventDispatcher, type: string, partName?: string, instance?: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.SkinnableComponent
    * @classdesc
    * 复杂可设置外观组件的基类，接受ISkin类或任何显示对象作为皮肤。
    * 当皮肤为ISkin时，将自动匹配两个实例内同名的公开属性(显示对象)，
    * 并将皮肤的属性引用赋值到此类定义的同名属性(必须没有默认值)上,
    * 如果要对公共属性添加事件监听或其他操作，
    * 请覆盖partAdded()和partRemoved()方法
    * @extends ns_egret.SkinnableComponent
    */
    class SkinnableComponent extends UIComponent {
        /**
        * 构造函数
        * @method ns_egret.SkinnableComponent#constructor
        */ 
        constructor();
        /**
        * 主机组件标识符。用于唯一确定一个组件的名称。
        * 在解析skinName时，会把此属性的值传递给ISkinAdapter.getSkin()方法，以参与皮肤解析的规则判断。
        * 用户自定义的组件若不对此属性赋值，将会继承父级的标识符定义。
        * @member {string} ns_egret.SkinnableComponent#hostComponentKey
        */
        public hostComponentKey: string;
        /**
        * 外部显式设置了皮肤名
        */
        public _skinNameExplicitlySet: any;
        public _skinName: any;
        /**
        * 皮肤标识符。可以为Class,String,或DisplayObject实例等任意类型，具体规则由项目注入的素材适配器决定，
        * 适配器根据此属性值解析获取对应的显示对象，并赋值给skin属性。
        * @member ns_egret.SkinnableComponent#skinName
        */
        public skinName : any;
        public _skin: any;
        /**
        * 皮肤对象实例。
        * @member ns_egret.SkinnableComponent#skin
        */
        public skin : any;
        private createChildrenCalled;
        /**
        * @method ns_egret.SkinnableComponent#createChildren
        */
        public createChildren(): void;
        /**
        * 皮肤解析适配器
        */
        private static skinAdapter;
        /**
        * 解析skinName
        */
        private parseSkinName();
        /**
        * 获取皮肤适配器
        */
        private getSkinAdapter();
        /**
        * 附加皮肤
        * @method ns_egret.SkinnableComponent#attachSkin
        * @param skin {any}
        */ 
        public attachSkin(skin: any): void;
        /**
        * 匹配皮肤和主机组件的公共变量，并完成实例的注入。此方法在附加皮肤时会自动执行一次。
        * 若皮肤中含有延迟实例化的子部件，在子部件实例化完成时需要从外部再次调用此方法,完成注入。
        * @method ns_egret.SkinnableComponent#findSkinParts
        */ 
        public findSkinParts(): void;
        /**
        * 卸载皮肤
        * @method ns_egret.SkinnableComponent#detachSkin
        * @param skin {any}
        */ 
        public detachSkin(skin: any): void;
        /**
        * 若皮肤是ISkin,则调用此方法附加皮肤中的公共部件
        * @method ns_egret.SkinnableComponent#partAdded
        * @param partName {string}
        * @param instance {any}
        */ 
        public partAdded(partName: string, instance: any): void;
        /**
        * 若皮肤是ISkin，则调用此方法卸载皮肤之前注入的公共部件
        * @method ns_egret.SkinnableComponent#partRemoved
        * @param partName {string}
        * @param instance {any}
        */ 
        public partRemoved(partName: string, instance: any): void;
        private stateIsDirty;
        /**
        * 标记当前需要重新验证皮肤状态
        * @method ns_egret.SkinnableComponent#invalidateSkinState
        */ 
        public invalidateSkinState(): void;
        /**
        * 子类覆盖此方法,应用当前的皮肤状态
        * @method ns_egret.SkinnableComponent#validateSkinState
        */ 
        public validateSkinState(): void;
        private _autoMouseEnabled;
        /**
        * 在enabled属性发生改变时是否自动开启或禁用鼠标事件的响应。默认值为true。
        * @member ns_egret.SkinnableComponent#autoTouchEnabled
        */
        public autoTouchEnabled : boolean;
        /**
        * 外部显式设置的mouseChildren属性值
        */ 
        private explicitMouseChildren;
        /**
        * @member ns_egret.SkinnableComponent#touchChildren
        */
        /**
        * @inheritDoc
        */ 
        public touchChildren : boolean;
        /**
        * 外部显式设置的mouseEnabled属性值
        */ 
        private explicitMouseEnabled;
        /**
        * @member ns_egret.SkinnableComponent#touchEnabled
        */
        /**
        * @inheritDoc
        */ 
        public touchEnabled : boolean;
        /**
        * @member ns_egret.SkinnableComponent#enabled
        */
        /**
        * @inheritDoc
        */
        public enabled : boolean;
        public _setEnabled(value: boolean): void;
        /**
        * 返回组件当前的皮肤状态名称,子类覆盖此方法定义各种状态名
        * @method ns_egret.SkinnableComponent#getCurrentSkinState
        * @returns {string}
        */ 
        public getCurrentSkinState(): string;
        /**
        * @method ns_egret.SkinnableComponent#commitProperties
        */
        public commitProperties(): void;
        private skinLayout;
        /**
        * 启用或禁用组件自身的布局。通常用在当组件的皮肤不是ISkinPartHost，又需要自己创建子项并布局时。
        */ 
        public _setSkinLayoutEnabled(value: boolean): void;
        public _childXYChanged(): void;
        public measure(): void;
        /**
        * @method ns_egret.SkinnableComponent#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
        * 添加对象到显示列表，此接口仅框架内部使用,
        * 如果需要管理子项，若有，请使用容器的addElementAt()方法,非法使用有可能造成无法自动布局。
        */
        public _addToDisplayList(child: DisplayObject, index?: number): void;
        /**
        * 从显示列表移除对象,此接口仅框架内部使用,
        * 如果需要管理子项，若有，请使用容器的removeElement()方法,非法使用有可能造成无法自动布局。
        */
        public _removeFromDisplayList(child: DisplayObject): DisplayObject;
        private static errorStr;
        /**
        * @method ns_egret.SkinnableComponent#addChild
        * @deprecated
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */
        public addChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.SkinnableComponent#addChildAt
        * @deprecated
        * @param child {DisplayObject}
        * @param index {number}
        * @returns {DisplayObject}
        */
        public addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
        * @method ns_egret.SkinnableComponent#removeChild
        * @deprecated
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */
        public removeChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.SkinnableComponent#removeChildAt
        * @deprecated
        * @param index {number}
        * @returns {DisplayObject}
        */
        public removeChildAt(index: number): DisplayObject;
        /**
        * @method ns_egret.SkinnableComponent#setChildIndex
        * @deprecated
        * @param child {DisplayObject}
        * @param index {number}
        */
        public setChildIndex(child: DisplayObject, index: number): void;
        /**
        * @method ns_egret.SkinnableComponent#swapChildren
        * @deprecated
        * @param child1 {DisplayObject}
        * @param child2 {DisplayObject}
        */
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
        * @method ns_egret.SkinnableComponent#swapChildrenAt
        * @deprecated
        * @param index1 {number}
        * @param index2 {number}
        */
        public swapChildrenAt(index1: number, index2: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.AddItems
    * @classdesc
    * 添加显示元素
    * @extends ns_egret.OverrideBase
    */ 
    class AddItems extends OverrideBase {
        /**
        * 添加父级容器的底层
        * @constant ns_egret.AddItems.FIRST
        */ 
        static FIRST: string;
        /**
        * 添加在父级容器的顶层
        * @constant ns_egret.AddItems.LAST
        */ 
        static LAST: string;
        /**
        * 添加在相对对象之前
        * @constant ns_egret.AddItems.BEFORE
        */ 
        static BEFORE: string;
        /**
        * 添加在相对对象之后
        * @constant ns_egret.AddItems.AFTER
        */ 
        static AFTER: string;
        /**
        * 构造函数
        * @method ns_egret.AddItems#constructor
        */ 
        constructor();
        /**
        * 要添加到的属性
        * @member ns_egret.AddItems#propertyName
        */ 
        public propertyName: string;
        /**
        * 添加的位置
        * @member ns_egret.AddItems#position
        */ 
        public position: string;
        /**
        * 相对的显示元素的实例名
        * @member ns_egret.AddItems#relativeTo
        */ 
        public relativeTo: string;
        /**
        * 目标实例名
        * @member ns_egret.AddItems#target
        */ 
        public target: string;
        /**
        * @method ns_egret.AddItems#initialize
        * @param parent {IStateClient}
        */
        public initialize(parent: IStateClient): void;
        /**
        * @method ns_egret.AddItems#apply
        * @param parent {IContainer}
        */
        public apply(parent: IContainer): void;
        /**
        * @method ns_egret.AddItems#remove
        * @param parent {IContainer}
        */
        public remove(parent: IContainer): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.SetProperty
    * @classdesc
    * 设置属性
    * @extends ns_egret.OverrideBase
    */ 
    class SetProperty extends OverrideBase {
        /**
        * 构造函数
        * @method ns_egret.SetProperty#constructor
        */ 
        constructor();
        /**
        * 要修改的属性名
        * @member ns_egret.SetProperty#name
        */ 
        public name: string;
        /**
        * 目标实例名
        * @member ns_egret.SetProperty#target
        */ 
        public target: string;
        /**
        * 属性值
        * @member ns_egret.SetProperty#value
        */ 
        public value: any;
        /**
        * 旧的属性值
        */ 
        private oldValue;
        /**
        * @method ns_egret.SetProperty#apply
        * @param parent {IContainer}
        */
        public apply(parent: IContainer): void;
        /**
        * @method ns_egret.SetProperty#remove
        * @param parent {IContainer}
        */
        public remove(parent: IContainer): void;
        /**
        * 设置属性值
        */ 
        private setPropertyValue(obj, name, value, valueForType);
        /**
        * 转成Boolean值
        */ 
        private toBoolean(value);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.State
    * @classdesc
    * State 类定义视图状态，即组件的特定视图。
    * @extends ns_egret.HashObject
    */
    class State extends HashObject {
        /**
        * @method ns_egret.State#constructor
        * @param properties {any}
        */
        constructor(properties?: any);
        /**
        * 已经初始化标志
        */ 
        private initialized;
        /**
        * 视图状态的名称。给定组件的状态名称必须唯一。必须设置此属性。
        * @member ns_egret.State#name
        */ 
        public name: string;
        /**
        * 该视图状态的覆盖，表现为实现 IOverride 接口的对象的数组。
        * 这些覆盖在进入状态时按顺序应用，在退出状态时按相反的顺序删除。
        * @member ns_egret.State#overrides
        */ 
        public overrides: any[];
        /**
        * 此视图状态作为 String 数组所属的状态组。
        * @member ns_egret.State#stateGroups
        */ 
        public stateGroups: any[];
        /**
        * 初始化视图
        * @method ns_egret.State#initialize
        * @param parent {IStateClient}
        */ 
        public initialize(parent: IStateClient): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.IAssetAdapter
    * @interface
    * @classdesc
    * 素材适配器接口。
    * 若项目需要自定义UIAsset.source的解析规则，需要实现这个接口，
    * 然后调用Injector.mapClass("ns_egret.IAssetAdapter",YourAssetAdapter)注入到框架即可。
    */
    interface IAssetAdapter {
        /**
        * 解析素材
        * @method ns_egret.IAssetAdapter#getAsset
        * @param source {any} 待解析的新素材标识符
        * @param compFunc {Function} 解析完成回调函数，示例：compFunc(content:any,source:any):void;
        * 回调参数content接受两种类型：DisplayObject或Texture。
        * @param thisObject {any} compFunc的this引用
        * @param oldContent any 旧的内容对象,传入值有可能为null。
        * 对于某些类型素材，例如MovieClip，可以重用传入的显示对象,只修改其数据再返回。
        */
        getAsset(source: any, compFunc: Function, thisObject: any, oldContent: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.DefaultAssetAdapter
    * @classdesc
    * 默认的IAssetAdapter接口实现
    * @implements ns_egret.IAssetAdapter
    */
    class DefaultAssetAdapter implements IAssetAdapter {
        /**
        * 构造函数
        * @method ns_egret.DefaultSkinAdapter#constructor
        */
        constructor();
        /**
        * 解析素材
        * @method ns_egret.DefaultAssetAdapter#getAsset
        * @param source {any} 待解析的新素材标识符
        * @param compFunc {Function} 解析完成回调函数，示例：compFunc(content:any,source:any):void;
        * 回调参数content接受两种类型：DisplayObject或Texture。
        * @param thisObject {any} compFunc的this引用
        * @param oldContent any 旧的内容对象,传入值有可能为null。
        * 对于某些类型素材，例如MovieClip，可以重用传入的显示对象,只修改其数据再返回。
        */
        public getAsset(source: any, compFunc: Function, thisObject: any, oldContent: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.UIAsset
    * @classdesc
    * 素材包装器。<p/>
    * 注意：UIAsset仅在添content时测量一次初始尺寸， 请不要在外部直接修改content尺寸，
    * 若做了引起content尺寸发生变化的操作, 需手动调用UIAsset的invalidateSize()进行重新测量。
    * @extends ns_egret.UIComponent
    * @implements ns_egret.ISkinnableClient
    */
    class UIAsset extends UIComponent {
        /**
        * @method ns_egret.UIAsset#constructor
        */
        constructor();
        private sourceChanged;
        public _source: any;
        /**
        * 皮肤标识符。可以为Class,String,或DisplayObject实例等任意类型，具体规则由项目注入的素材适配器决定，
        * 适配器根据此属性值解析获取对应的显示对象，并赋值给content属性。
        * @member ns_egret.UIAsset#source
        */ 
        public source : any;
        public _content: any;
        /**
        * 解析source得到的对象，通常为显示对象或Texture。
        * @member ns_egret.UIAsset#content
        */
        public content : any;
        private createChildrenCalled;
        /**
        * @method ns_egret.UIAsset#createChildren
        */
        public createChildren(): void;
        /**
        * 皮肤解析适配器
        */ 
        private static assetAdapter;
        private contentReused;
        /**
        * 解析source
        */ 
        private parseSkinName();
        /**
        * 获取资源适配器
        */
        private getAdapter();
        /**
        * 皮肤发生改变
        */
        private contentChanged(content, source);
        public measure(): void;
        /**
        * @method ns_egret.UIAsset#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        public _render(renderContext: RendererContext): void;
        /**
        * @see egret.DisplayObject.measureBounds
        * @returns {Rectangle}
        * @private
        */
        public _measureBounds(): Rectangle;
        private static errorStr;
        /**
        * @method ns_egret.UIAsset#addChild
        * @deprecated
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */ 
        public addChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.UIAsset#addChildAt
        * @deprecated
        * @param child {DisplayObject}
        * @param index {number}
        * @returns {DisplayObject}
        */ 
        public addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
        * @method ns_egret.UIAsset#removeChild
        * @deprecated
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */ 
        public removeChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.UIAsset#removeChildAt
        * @deprecated
        * @param index {number}
        * @returns {DisplayObject}
        */ 
        public removeChildAt(index: number): DisplayObject;
        /**
        * @method ns_egret.UIAsset#setChildIndex
        * @deprecated
        * @param child {DisplayObject}
        * @param index {number}
        */ 
        public setChildIndex(child: DisplayObject, index: number): void;
        /**
        * @method ns_egret.UIAsset#swapChildren
        * @deprecated
        * @param child1 {DisplayObject}
        * @param child2 {DisplayObject}
        */ 
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
        * @method ns_egret.UIAsset#swapChildrenAt
        * @deprecated
        * @param index1 {number}
        * @param index2 {number}
        */ 
        public swapChildrenAt(index1: number, index2: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IDisplayText
    * @interface
    * @classdesc
    * 简单文本显示控件接口。
    * @extends ns_egret.IUIComponent
    */
    interface IDisplayText extends IUIComponent {
        /**
        * 此文本组件所显示的文本。
        * @member ns_egret.IDisplayText#text
        */
        text: string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ButtonBase
    * @classdesc
    * 按钮组件基类
    * @extends ns_egret.SkinnableComponent
    */ 
    class ButtonBase extends SkinnableComponent {
        /**
        * 构造函数
        * @method ns_egret.ButtonBase#constructor
        */ 
        constructor();
        /**
        * 已经开始过不断抛出buttonDown事件的标志
        */ 
        private _downEventFired;
        /**
        * 重发buttonDown事件计时器
        */ 
        private autoRepeatTimer;
        /**
        * [SkinPart]按钮上的文本标签
        * @member ns_egret.ButtonBase#labelDisplay
        */
        public labelDisplay: IDisplayText;
        private _autoRepeat;
        /**
        * 指定在用户按住鼠标按键时是否重复分派 buttonDown 事件。
        * @member ns_egret.ButtonBase#autoRepeat
        */ 
        public autoRepeat : boolean;
        private _repeatDelay;
        /**
        * 在第一个 buttonDown 事件之后，以及相隔每个 repeatInterval 重复一次 buttonDown 事件之前，需要等待的毫秒数。
        * @member ns_egret.ButtonBase#repeatDelay
        */
        public repeatDelay : number;
        private _repeatInterval;
        /**
        * 用户在按钮上按住鼠标时，buttonDown 事件之间相隔的毫秒数。
        * @member ns_egret.ButtonBase#repeatInterval
        */ 
        public repeatInterval : number;
        private _hovered;
        /**
        * 指示鼠标指针是否位于按钮上。
        * @member ns_egret.ButtonBase#hovered
        */
        public hovered : boolean;
        private _keepDown;
        /**
        * 强制让按钮停在鼠标按下状态,此方法不会导致重复抛出buttonDown事件,仅影响皮肤State。
        * @method ns_egret.ButtonBase#_keepDown
        * @param down {boolean} 是否按下
        */ 
        public _setKeepDown(down: boolean): void;
        private _label;
        /**
        * 要在按钮上显示的文本
        * @member ns_egret.ButtonBase#label
        */
        public label : string;
        public _getLabel(): string;
        public _setLabel(value: string): void;
        private _mouseCaptured;
        /**
        * 指示第一次分派 MouseEvent.MOUSE_DOWN 时，是否按下鼠标以及鼠标指针是否在按钮上。
        * @member ns_egret.ButtonBase#mouseCaptured
        */ 
        public mouseCaptured : boolean;
        private _stickyHighlighting;
        /**
        * 如果为 false，则按钮会在用户按下它时显示其鼠标按下时的外观，但在用户将鼠标拖离它时将改为显示鼠标经过的外观。
        * 如果为 true，则按钮会在用户按下它时显示其鼠标按下时的外观，并在用户将鼠标拖离时继续显示此外观。
        * @member ns_egret.ButtonBase#stickyHighlighting
        */
        public stickyHighlighting : boolean;
        /**
        * 开始抛出buttonDown事件
        */ 
        private checkButtonDownConditions();
        /**
        * 添加鼠标事件监听
        * @method ns_egret.ButtonBase#addHandlers
        */ 
        public addHandlers(): void;
        /**
        * 添加舞台鼠标弹起事件监听
        */ 
        private addStageMouseHandlers();
        /**
        * 移除舞台鼠标弹起事件监听
        */ 
        private removeStageMouseHandlers();
        /**
        * 按钮是否是按下的状态
        */ 
        private isDown();
        /**
        * 检查需要启用还是关闭重发计时器
        */ 
        private checkAutoRepeatTimerConditions(buttonDown);
        /**
        * 启动重发计时器
        */ 
        private startTimer();
        /**
        * 停止重发计时器
        */ 
        private stopTimer();
        /**
        * 鼠标事件处理
        * @method ns_egret.ButtonBase#mouseEventHandler
        * @param event {Event}
        */ 
        public mouseEventHandler(event: Event): void;
        /**
        * 按钮弹起事件
        * @method ns_egret.ButtonBase#buttonReleased
        */ 
        public buttonReleased(): void;
        /**
        * 按钮点击事件
        * @method ns_egret.ButtonBase#clickHandler
        * @param event {TouchEvent}
        */ 
        public clickHandler(event: TouchEvent): void;
        /**
        * 舞台上鼠标弹起事件
        */ 
        private stage_mouseUpHandler(event);
        /**
        * 自动重发计时器首次延迟结束事件
        */ 
        private autoRepeat_timerDelayHandler(event);
        /**
        * 自动重发buttonDown事件
        */ 
        private autoRepeat_timerHandler(event);
        /**
        * @method ns_egret.ButtonBase#getCurrentSkinState
        * @returns {string}
        */
        public getCurrentSkinState(): string;
        /**
        * @method ns_egret.ButtonBase#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ToggleButtonBase
    * @classdesc
    * 切换按钮组件基类
    * @extends ns_egret.ButtonBase
    */ 
    class ToggleButtonBase extends ButtonBase {
        /**
        * @method ns_egret.ToggleButtonBase#constructor
        */
        constructor();
        public _selected: boolean;
        /**
        * 按钮处于按下状态时为 true，而按钮处于弹起状态时为 false。
        * @member ns_egret.ToggleButtonBase#selected
        */ 
        public selected : boolean;
        public _setSelected(value: boolean): void;
        /**
        * @method ns_egret.ToggleButtonBase#getCurrentSkinState
        * @returns {string}
        */
        public getCurrentSkinState(): string;
        /**
        * 是否根据鼠标事件自动变换选中状态,默认true。仅框架内使用。
        */ 
        public _autoSelected: boolean;
        /**
        * @method ns_egret.ToggleButtonBase#buttonReleased
        */
        public buttonReleased(): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.TextBase
    * @classdesc
    * 文本基类,实现对文本的自动布局，样式属性设置。
    * @extends ns_egret.UIComponent
    * @implements ns_egret.IDisplayText
    */ 
    class TextBase extends UIComponent implements IDisplayText {
        /**
        * @method ns_egret.TextBase#constructor
        */
        constructor();
        /**
        * 默认的文本测量宽度
        * @constant ns_egret.TextBase.DEFAULT_MEASURED_WIDTH
        */ 
        static DEFAULT_MEASURED_WIDTH: number;
        /**
        * 默认的文本测量高度
        * @constant ns_egret.TextBase.DEFAULT_MEASURED_HEIGHT
        */ 
        static DEFAULT_MEASURED_HEIGHT: number;
        /**
        * 呈示此文本的内部 TextField
        */ 
        public _textField: TextField;
        private fontFamilyChanged;
        private _fontFamily;
        /**
        * 字体名称 。默认值：SimSun
        * @member ns_egret.TextBase#fontFamily
        */
        public fontFamily : string;
        private sizeChanged;
        private _size;
        /**
        * 字号大小,默认值12 。
        * @member ns_egret.TextBase#size
        */
        public size : number;
        private textAlignChanged;
        private _textAlign;
        /**
        * 文字的水平对齐方式 ,请使用TextAlign中定义的常量。
        * 默认值：TextFormatAlign.LEFT。
        * @member ns_egret.TextBase#textAlign
        */
        public textAlign : string;
        private verticalAlignChanged;
        private _verticalAlign;
        /**
        * 文字的垂直对齐方式 ,请使用VerticalAlign中定义的常量。
        * 默认值：VerticalAlign.TOP。
        * @member ns_egret.TextBase#verticalAlign
        */
        public verticalAlign : string;
        private lineSpacingChanged;
        private _lineSpacing;
        /**
        * 行间距
        * @member ns_egret.TextBase#lineSpacing
        */
        public lineSpacing : number;
        private letterSpacingChanged;
        private _letterSpacing;
        /**
        * 字符间距
        * @member ns_egret.TextBase#letterSpacing
        */
        public letterSpacing : number;
        private textColorChanged;
        private _textColor;
        /**
        * @member ns_egret.TextBase#textColor
        */
        public textColor : number;
        /**
        * @member ns_egret.TextBase#_textChanged
        */
        public _textChanged: boolean;
        public _text: string;
        /**
        * @member ns_egret.TextBase#text
        */
        public text : string;
        /**
        * @method ns_egret.TextBase#createChildren
        */
        public createChildren(): void;
        /**
        * @method ns_egret.TextBase#commitProperties
        */
        public commitProperties(): void;
        /**
        * 检查是否创建了textField对象，没有就创建一个。
        */ 
        private checkTextField();
        private createTextField();
        /**
        * @method ns_egret.TextBase#measure
        */
        public measure(): void;
        /**
        * 更新显示列表
        * @method ns_egret.TextBase#$updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */ 
        public $updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
        * @method ns_egret.TextBase#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IViewport
    * @interface
    * @classdesc
    * 支持视区的组件接口
    * @extends ns_egret.IVisualElement
    */ 
    interface IViewport extends IVisualElement {
        /**
        * 视域的内容的宽度。
        * 如果 clipAndEnabledScrolling 为 true， 则视域的 contentWidth 为水平滚动定义限制，
        * 且视域的实际宽度定义可见的内容量。要在内容中水平滚动， 请在 0 和 contentWidth - width
        * 之间更改 horizontalScrollPosition。
        * @member ns_egret.IViewport#contentWidth
        */ 
        contentWidth: number;
        /**
        * 视域的内容的高度。
        * 如果 clipAndEnabledScrolling 为 true，则视域的 contentHeight 为垂直滚动定义限制，
        * 且视域的实际高度定义可见的内容量。要在内容中垂直滚动，请在 0 和 contentHeight - height
        * 之间更改 verticalScrollPosition。
        * @member ns_egret.IViewport#contentHeight
        */ 
        contentHeight: number;
        /**
        * 可视区域水平方向起始点
        * @member ns_egret.IViewport#horizontalScrollPosition
        */ 
        horizontalScrollPosition: number;
        /**
        * 可视区域竖直方向起始点
        * @member ns_egret.IViewport#verticalScrollPosition
        */ 
        verticalScrollPosition: number;
        /**
        * 如果为 true，指定将子代剪切到视区的边界。如果为 false，则容器子代会从容器边界扩展过去，而不管组件的大小规范。默认false
        * @member ns_egret.IViewport#clipAndEnableScrolling
        */ 
        clipAndEnableScrolling: boolean;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.LayoutBase
    * @classdesc
    * 容器布局基类
    * @extends ns_egret.EventDispatcher
    */
    class LayoutBase extends EventDispatcher {
        /**
        * @method ns_egret.LayoutBase#constructor
        */
        constructor();
        private _target;
        /**
        * 目标容器
        * @member ns_egret.LayoutBase#target
        */ 
        public target : GroupBase;
        private _useVirtualLayout;
        /**
        * 若要配置容器使用虚拟布局，请为与容器关联的布局的 useVirtualLayout 属性设置为 true。
        * 只有布局设置为 VerticalLayout、HorizontalLayout
        * 或 TileLayout 的 DataGroup 或 SkinnableDataContainer
        * 才支持虚拟布局。不支持虚拟化的布局子类必须禁止更改此属性。
        * @member ns_egret.LayoutBase#useVirtualLayout
        */
        public useVirtualLayout : boolean;
        private _typicalLayoutRect;
        /**
        * 由虚拟布局所使用，以估计尚未滚动到视图中的布局元素的大小。
        * @member ns_egret.LayoutBase#typicalLayoutRect
        */
        public typicalLayoutRect : Rectangle;
        /**
        * 滚动条位置改变
        * @method ns_egret.LayoutBase#scrollPositionChanged
        */
        public scrollPositionChanged(): void;
        /**
        * 清理虚拟布局缓存的数据
        * @method ns_egret.LayoutBase#clearVirtualLayoutCache
        */ 
        public clearVirtualLayoutCache(): void;
        /**
        * 在已添加布局元素之后且在验证目标的大小和显示列表之前，由目标调用。
        * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。
        * @method ns_egret.LayoutBase#elementAdded
        * @param index {number}
        */ 
        public elementAdded(index: number): void;
        /**
        * 必须在已删除布局元素之后且在验证目标的大小和显示列表之前，由目标调用此方法。
        * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。
        * @method ns_egret.LayoutBase#elementRemoved
        * @param index {number}
        */ 
        public elementRemoved(index: number): void;
        /**
        * 测量组件尺寸大小
        * @method ns_egret.LayoutBase#measure
        */ 
        public measure(): void;
        /**
        * 更新显示列表
        * @method ns_egret.LayoutBase#updateDisplayList
        * @param width {number}
        * @param height {number}
        */ 
        public updateDisplayList(width: number, height: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.BasicLayout
    * @classdesc
    * 基本布局
    * @extends ns_egret.LayoutBase
    */
    class BasicLayout extends LayoutBase {
        /**
        * @method ns_egret.BasicLayout#constructor
        */
        constructor();
        /**
        * 此布局不支持虚拟布局，设置这个属性无效
        */ 
        public useVirtualLayout : boolean;
        private _mouseWheelSpeed;
        /**
        * 鼠标滚轮每次滚动时目标容器的verticalScrollPosition
        * 或horizontalScrollPosition改变的像素距离。必须大于0， 默认值20。
        * @member ns_egret.BasicLayout#mouseWheelSpeed
        */
        public mouseWheelSpeed : number;
        /**
        * @method ns_egret.BasicLayout#getElementBoundsLeftOfScrollRect
        * @param scrollRect {Rectangle}
        * @returns {Rectangle}
        */
        public getElementBoundsLeftOfScrollRect(scrollRect: Rectangle): Rectangle;
        /**
        * @method ns_egret.BasicLayout#getElementBoundsRightOfScrollRect
        * @param scrollRect {Rectangle}
        * @returns {Rectangle}
        */
        public getElementBoundsRightOfScrollRect(scrollRect: Rectangle): Rectangle;
        /**
        * @method ns_egret.BasicLayout#getElementBoundsAboveScrollRect
        * @param scrollRect {Rectangle}
        * @returns {Rectangle}
        */
        public getElementBoundsAboveScrollRect(scrollRect: Rectangle): Rectangle;
        /**
        * @method ns_egret.BasicLayout#getElementBoundsBelowScrollRect
        * @param scrollRect {Rectangle}
        * @returns {Rectangle}
        */
        public getElementBoundsBelowScrollRect(scrollRect: Rectangle): Rectangle;
        /**
        * @method ns_egret.BasicLayout#measure
        */
        public measure(): void;
        /**
        * @method ns_egret.BasicLayout#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.GroupBase
    * @classdesc
    * 自动布局容器基类
    * @extends ns_egret.UIComponent
    * @implements ns_egret.IViewport
    */
    class GroupBase extends UIComponent implements IViewport {
        /**
        * @method ns_egret.GroupBase#constructor
        */
        constructor();
        /**
        * @method ns_egret.GroupBase#createChildren
        */
        public createChildren(): void;
        private _contentWidth;
        /**
        * @member ns_egret.GroupBase#contentWidth
        */
        public contentWidth : number;
        private setContentWidth(value);
        private _contentHeight;
        /**
        * @member ns_egret.GroupBase#contentHeight
        */
        public contentHeight : number;
        private setContentHeight(value);
        /**
        * 设置 contentWidth 和 contentHeight 属性，此方法由Layout类调用
        * @method ns_egret.GroupBase#setContentSize
        * @private
        *
        * @param width {number}
        * @param height {number}
        */
        public setContentSize(width: number, height: number): void;
        public _layout: LayoutBase;
        /**
        * 此容器的布局对象
        * @member ns_egret.GroupBase#layout
        */
        public layout : LayoutBase;
        public _setLayout(value: LayoutBase): void;
        private _clipAndEnableScrolling;
        /**
        * 如果为 true，指定将子代剪切到视区的边界。如果为 false，则容器子代会从容器边界扩展过去，而不管组件的大小规范。默认false
        * @member ns_egret.GroupBase#clipAndEnableScrolling
        */
        public clipAndEnableScrolling : boolean;
        private _horizontalScrollPosition;
        /**
        * 可视区域水平方向起始点
        * @member ns_egret.GroupBase#horizontalScrollPosition
        */
        public horizontalScrollPosition : number;
        private _verticalScrollPosition;
        /**
        * 可视区域竖直方向起始点
        * @member ns_egret.GroupBase#verticalScrollPosition
        */
        public verticalScrollPosition : number;
        /**
        * 滚动条位置改变
        */
        private scrollPositionChanged();
        /**
        * 更新可视区域
        * @param w {number}
        * @param h {number}
        */
        private updateScrollRect(w, h);
        /**
        * @method ns_egret.GroupBase#measure
        */
        public measure(): void;
        /**
        * 在更新显示列表时是否需要更新布局标志
        * @member ns_egret.GroupBase#_layoutInvalidateDisplayListFlag
        */
        public _layoutInvalidateDisplayListFlag: boolean;
        /**
        * 标记需要更新显示列表但不需要更新布局
        * @method ns_egret.GroupBase#_invalidateDisplayListExceptLayout
        */
        public _invalidateDisplayListExceptLayout(): void;
        /**
        * @method ns_egret.GroupBase#invalidateDisplayList
        */
        public invalidateDisplayList(): void;
        /**
        * @method ns_egret.GroupBase#_childXYChanged
        */
        public _childXYChanged(): void;
        /**
        * 在测量尺寸时是否需要测量布局的标志
        * @member ns_egret.GroupBase#_layoutInvalidateSizeFlag
        */
        public _layoutInvalidateSizeFlag: boolean;
        /**
        * 标记需要更新显示列表但不需要更新布局
        * @method ns_egret.GroupBase#_invalidateSizeExceptLayout
        */
        public _invalidateSizeExceptLayout(): void;
        /**
        * @method ns_egret.GroupBase#invalidateSize
        */
        public invalidateSize(): void;
        /**
        * @method ns_egret.GroupBase#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
        * 此容器中的可视元素的数量。
        * @member ns_egret.GroupBase#numElements
        */
        public numElements : number;
        /**
        * 返回指定索引处的可视元素。
        * @method ns_egret.GroupBase#getElementAt
        * @param index {number} 要检索的元素的索引。
        * @throws RangeError 如果在子列表中不存在该索引位置。
        * @returns {IVisualElement}
        */
        public getElementAt(index: number): IVisualElement;
        /**
        * 返回可视元素的索引位置。若不存在，则返回-1。
        * @method ns_egret.GroupBase#getElementIndex
        * @param element {IVisualElement} 可视元素。
        * @returns {number}
        */
        public getElementIndex(element: IVisualElement): number;
        /**
        * 返回在容器可视区域内的布局元素索引列表,此方法忽略不是布局元素的普通的显示对象
        * @method ns_egret.GroupBase#getElementIndicesInView
        * @returns {number}
        */
        public getElementIndicesInView(): number[];
        /**
        * 在支持虚拟布局的容器中，设置容器内可见的子元素索引范围。此方法在不支持虚拟布局的容器中无效。
        * 通常在即将连续调用getVirtualElementAt()之前需要显式设置一次，以便容器提前释放已经不可见的子元素。
        * @method ns_egret.GroupBase#setVirtualElementIndicesInView
        * @param startIndex {number} 可视元素起始索引
        * @param endIndex {number} 可视元素结束索引
        */
        public setVirtualElementIndicesInView(startIndex: number, endIndex: number): void;
        /**
        * 支持useVirtualLayout属性的布局类在updateDisplayList()中使用此方法来获取“处于视图中”的布局元素
        * @method ns_egret.GroupBase#getVirtualElementAt
        * @param index {number} 要检索的元素的索引。
        * @returns {IVisualElement}
        */
        public getVirtualElementAt(index: number): IVisualElement;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IItemRenderer
    * @interface
    * @classdesc
    * 列表类组件的项呈示器接口
    * @extends ns_egret.ILayoutElement
    */
    interface IItemRenderer extends ILayoutElement {
        /**
        * 要呈示或编辑的数据。
        * @member ns_egret.IItemRenderer#data
        */ 
        data: any;
        /**
        * 如果项呈示器可以将其自身显示为已选中，则包含 true。
        * @member ns_egret.IItemRenderer#selected
        */ 
        selected: boolean;
        /**
        * 项呈示器的主机组件的数据提供程序中的项目索引。
        * @member ns_egret.IItemRenderer#itemIndex
        */ 
        itemIndex: number;
        /**
        * 要在项呈示器中显示的 String。
        * @member ns_egret.IItemRenderer#label
        */ 
        label: string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ItemRenderer
    * @classdesc
    * 项呈示器基类
    * @extends ns_egret.ButtonBase
    * @implements ns_egret.IItemRenderer
    */
    class ItemRenderer extends ButtonBase implements IItemRenderer {
        /**
        * @method ns_egret.ItemRenderer#constructor
        */
        constructor();
        private dataChangedFlag;
        private _data;
        /**
        * @member ns_egret.ItemRenderer#data
        */
        public data : any;
        /**
        * 子类复写此方法以在data数据源发生改变时跟新显示列表。
        * 与直接复写_data的setter方法不同，它会确保在皮肤已经附加完成后再被调用。
        * @method ns_egret.ItemRenderer#dataChanged
        */ 
        public dataChanged(): void;
        private _selected;
        /**
        * @member ns_egret.ItemRenderer#selected
        */
        public selected : boolean;
        private _itemIndex;
        /**
        * @member ns_egret.ItemRenderer#itemIndex
        */
        public itemIndex : number;
        /**
        * @method ns_egret.ItemRenderer#commitProperties
        */
        public commitProperties(): void;
        /**
        * @method ns_egret.ItemRenderer#getCurrentSkinState
        * @returns {string}
        */
        public getCurrentSkinState(): string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ITreeItemRenderer
    * @interface
    * @classdesc
    * 树状列表组件的项呈示器接口
    * @extends ns_egret.IItemRenderer
    */
    interface ITreeItemRenderer extends IItemRenderer {
        /**
        * 图标的皮肤名
        * @member ns_egret.ITreeItemRenderer#iconSkinName
        */
        iconSkinName: any;
        /**
        * 缩进深度。0表示顶级节点，1表示第一层子节点，以此类推。
        * @member ns_egret.ITreeItemRenderer#depth
        */
        depth: number;
        /**
        * 是否含有子节点。
        * @member ns_egret.ITreeItemRenderer#hasChildren
        */
        hasChildren: boolean;
        /**
        * 节点是否处于开启状态。
        * @member ns_egret.ITreeItemRenderer#opened
        */
        opened: boolean;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ISkinnableClient
    * @interface
    * @classdesc
    * 可设置外观的组件接口
    * @extends ns_egret.IVisualElement
    */
    interface ISkinnableClient extends IVisualElement {
        /**
        * 皮肤标识符。可以为Class,String,或DisplayObject实例等任意类型。
        * 具体规则由项目注入的ISkinAdapter决定，皮肤适配器将在运行时解析此标识符，然后返回皮肤对象给组件。
        * @member ns_egret.ISkinnableClient#skinName
        */ 
        skinName: any;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.TreeEvent
    * @classdesc
    * Tree事件
    * @extends ns_egret.Event
    */
    class TreeEvent extends Event {
        /**
        * 节点关闭,注意：只有通过交互操作引起的节点关闭才会抛出此事件。
        * @constant ns_egret.TreeEvent.ITEM_CLOSE
        */ 
        static ITEM_CLOSE: string;
        /**
        * 节点打开,注意：只有通过交互操作引起的节点打开才会抛出此事件。
        * @constant ns_egret.TreeEvent.ITEM_OPEN
        */ 
        static ITEM_OPEN: string;
        /**
        * 子节点打开或关闭前一刻分派。可以调用preventDefault()方法阻止节点的状态改变。
        * @constant ns_egret.TreeEvent.ITEM_OPENING
        */ 
        static ITEM_OPENING: string;
        /**
        * @method ns_egret.TreeEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        * @param itemIndex {number}
        * @param item {any}
        * @param itemRenderer {ITreeItemRenderer}
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, itemIndex?: number, item?: any, itemRenderer?: ITreeItemRenderer);
        /**
        * 触发鼠标事件的项呈示器数据源项。
        * @member ns_egret.TreeEvent#item
        */
        public item: any;
        /**
        * 触发鼠标事件的项呈示器。
        * @member ns_egret.TreeEvent#itemRenderer
        */ 
        public itemRenderer: ITreeItemRenderer;
        /**
        * 触发鼠标事件的项索引
        * @member ns_egret.TreeEvent#itemIndex
        */ 
        public itemIndex: number;
        /**
        * 当事件类型为ITEM_OPENING时，true表示即将打开节点，反之关闭。
        * @member ns_egret.TreeEvent#opening
        */ 
        public opening: boolean;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.TreeEvent.dispatchTreeEvent
        */
        static dispatchTreeEvent(target: IEventDispatcher, type: string, itemIndex?: number, item?: any, itemRenderer?: ITreeItemRenderer, opening?: boolean): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.TreeItemRenderer
    * @classdesc
    * Tree组件的项呈示器基类
    * @extends ns_egret.ItemRenderer
    * @implements ns_egret.ITreeItemRenderer
    */
    class TreeItemRenderer extends ItemRenderer implements ITreeItemRenderer {
        /**
        * 构造函数
        * @method ns_egret.TreeItemRenderer#constructor
        */ 
        constructor();
        private onItemMouseDown(event);
        /**
        * [SkinPart]图标显示对象
        * @member ns_egret.TreeItemRenderer#iconDisplay
        */
        public iconDisplay: ISkinnableClient;
        /**
        * [SkinPart]子节点开启按钮
        * @member ns_egret.TreeItemRenderer#disclosureButton
        */
        public disclosureButton: ToggleButtonBase;
        /**
        * [SkinPart]用于调整缩进值的容器对象。
        * @member ns_egret.TreeItemRenderer#contentGroup
        */
        public contentGroup: DisplayObject;
        private _indentation;
        /**
        * 子节点相对父节点的缩进值，以像素为单位。默认17。
        * @member ns_egret.TreeItemRenderer#indentation
        */
        public indentation : number;
        private _iconSkinName;
        /**
        * @member ns_egret.TreeItemRenderer#iconSkinName
        */
        public iconSkinName : any;
        private _depth;
        /**
        * @member ns_egret.TreeItemRenderer#depth
        */
        public depth : number;
        private _hasChildren;
        /**
        * @member ns_egret.TreeItemRenderer#hasChildren
        */
        public hasChildren : boolean;
        private _isOpen;
        /**
        * @member ns_egret.TreeItemRenderer#opened
        */
        public opened : boolean;
        /**
        * @method ns_egret.TreeItemRenderer#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
        /**
        * @method ns_egret.TreeItemRenderer#partRemoved
        * @param partName {string}
        * @param instance {any}
        */
        public partRemoved(partName: string, instance: any): void;
        /**
        * 鼠标在disclosureButton上按下
        * @method ns_egret.TreeItemRenderer#disclosureButton_mouseDownHandler
        * @param event {TouchEvent}
        */ 
        public disclosureButton_mouseDownHandler(event: TouchEvent): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Animation
    * @classdesc
    * 数值缓动工具类
    */
    class Animation {
        /**
        * 构造函数
        * @method ns_egret.Animation#constructor
        * @param updateFunction {Function} 动画更新时的回调函数,updateFunction(animation:Animation):void
        * @param thisObject {an}
        */
        constructor(updateFunction: Function, thisObject: any);
        /**
        * 此动画的缓动行为。设置为null意味着不使用缓动，默认值为Ease.sineInOut()
        * @member ns_egret.Animation#easerFunction
        */
        public easerFunction: Function;
        private thisObject;
        private _isPlaying;
        /**
        * 是否正在播放动画，不包括延迟等待和暂停的阶段
        * @member ns_egret.Animation#isPlaying
        */
        public isPlaying : boolean;
        private _duration;
        /**
        * 动画持续时间,单位毫秒，默认值500
        * @member ns_egret.Animation#duration
        */
        public duration : number;
        private _startDelay;
        /**
        * 动画开始播放前的延时时间,单位毫秒,默认0。
        * @member ns_egret.Animation#startDelay
        */
        public startDelay : number;
        private _repeatCount;
        /**
        * 动画重复的次数，0代表无限制重复。默认值为1。
        * @member ns_egret.Animation#repeatCount
        */
        public repeatCount : number;
        private _repeatDelay;
        /**
        * 每次重复播放之间的间隔。第二次及以后的播放开始之前的延迟毫秒数。若要设置第一次之前的延迟时间，请使用startDelay属性。
        * @member ns_egret.Animation#repeatDelay
        */
        public repeatDelay : number;
        /**
        * 随着时间的推移Animation将设置动画的属性和值的列表。对象示例:{p:"x",f:10,t:100}表示，属性名"x"从10改变到100。
        * @member ns_egret.Animation#motionPaths
        */
        public motionPaths: any[];
        private _currentValue;
        /**
        * 动画到当前时间对应的值。以MotionPath.property为键存储各个MotionPath的当前值。
        * @member ns_egret.Animation#currentValue
        */
        public currentValue : any;
        /**
        * 动画开始播放时的回调函数,只会在首次延迟等待结束时触发一次,若有重复播放，之后将触发repeatFunction。startFunction(animation:Animation):void
        * @member ns_egret.Animation#startFunction
        */
        public startFunction: Function;
        /**
        * 动画播放结束时的回调函数,可以是正常播放结束，也可以是被调用了end()方法导致结束。注意：stop()方法被调用不会触发这个函数。endFunction(animation:Animation):void
        * @member ns_egret.Animation#endFunction
        */
        public endFunction: Function;
        /**
        * 动画更新时的回调函数,updateFunction(animation:Animation):void
        * @member ns_egret.Animation#updateFunction
        */
        public updateFunction: Function;
        /**
        * 动画被停止的回调函数，即stop()方法被调用。stopFunction(animation:Animation):void
        * @member ns_egret.Animation#stopFunction
        */
        public stopFunction: Function;
        /**
        * 开始正向播放动画,无论何时调用都重新从零时刻开始，若设置了延迟会首先进行等待。
        * @method ns_egret.Animation#play
        */
        public play(): void;
        /**
        * 立即跳到指定百分比的动画位置
        */
        private seek(runningTime);
        /**
        * 开始播放动画
        */
        private start();
        /**
        * 直接跳到动画结尾
        * @method ns_egret.Animation#end
        */
        public end(): void;
        /**
        * 停止播放动画
        * @method ns_egret.Animation#stop
        */
        public stop(): void;
        /**
        * 仅停止播放动画，而不调用stopFunction。
        */
        private stopAnimation();
        private pauseTime;
        private _isPaused;
        /**
        * 正在暂停中
        * @member ns_egret.Animation#isPaused
        */
        public isPaused : boolean;
        /**
        * 暂停播放
        * @method ns_egret.Animation#pause
        */
        public pause(): void;
        /**
        * 继续播放
        * @method ns_egret.Animation#resume
        */
        public resume(): void;
        /**
        * 动画启动时刻
        */
        private startTime;
        private _started;
        /**
        * 动画已经开始的标志，包括延迟等待和暂停的阶段。
        * @member ns_egret.Animation#started
        */
        public started : boolean;
        /**
        * 已经播放的次数。
        */
        private playedTimes;
        /**
        * 计算当前值并返回动画是否结束
        */
        private doInterval();
        /**
        * 计算当前值
        */
        private caculateCurrentValue(fraction);
        /**
        * 总时间轴的当前时间
        */
        private static currentTime;
        private static TIMER_RESOLUTION;
        private static registered;
        /**
        * 正在活动的动画
        */
        private static activeAnimations;
        /**
        * 添加动画到队列
        */
        private static addAnimation(animation);
        /**
        * 从队列移除动画,返回移除前的索引
        */
        private static removeAnimation(animation);
        /**
        * 当前正在执行动画的索引
        */
        private static currentIntervalIndex;
        /**
        * 计时器触发函数
        */
        private static onEnterFrame(frameTime, currentTime);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Range
    * @classdesc
    * 范围选取组件,该组件包含一个值和这个值所允许的最大最小约束范围。
    * @extends ns_egret.SkinnableComponent
    */ 
    class Range extends SkinnableComponent {
        /**
        * 构造函数
        * @method ns_egret.Range#constructor
        */
        constructor();
        public _maximum: number;
        /**
        * 最大有效值改变标志
        */
        private maxChanged;
        /**
        * 最大有效值
        * @member ns_egret.Range#maximum
        */
        public maximum : number;
        public _setMaximun(value: number): void;
        public _minimum: number;
        /**
        * 最小有效值改变标志
        */
        private minChanged;
        /**
        * 最小有效值
        * @member ns_egret.Range#minimum
        */
        public minimum : number;
        public _setMinimun(value: number): void;
        private _stepSize;
        /**
        * 单步大小改变的标志
        */
        private stepSizeChanged;
        /**
        * 调用 changeValueByStep() 方法时 value 属性更改的单步大小。默认值为 1。<br/>
        * 除非 snapInterval 为 0，否则它必须是 snapInterval 的倍数。<br/>
        * 如果 stepSize 不是倍数，则会将它近似到大于或等于 snapInterval 的最近的倍数。<br/>
        * @member ns_egret.Range#stepSize
        */
        public stepSize : number;
        private _value;
        private _changedValue;
        /**
        * 此范围的当前值改变标志
        */
        private valueChanged;
        /**
        * 此范围的当前值。
        * @member ns_egret.Range#value
        */
        public value : number;
        public _setValue(newValue: number): void;
        public _getValue(): number;
        private _snapInterval;
        private snapIntervalChanged;
        private _explicitSnapInterval;
        /**
        * snapInterval 属性定义 value 属性的有效值。如果为非零，则有效值为 minimum 与此属性的整数倍数之和，且小于或等于 maximum。 <br/>
        * 例如，如果 minimum 为 10，maximum 为 20，而此属性为 3，则可能的有效值为 10、13、16、19 和 20。<br/>
        * 如果此属性的值为零，则仅会将有效值约束到介于 minimum 和 maximum 之间（包括两者）。<br/>
        * 此属性还约束 stepSize 属性（如果设置）的有效值。如果未显式设置此属性，但设置了 stepSize，则 snapInterval 将默认为 stepSize。<br/>
        * @member ns_egret.Range#snapInterval
        */
        public snapInterval : number;
        /**
        * @method ns_egret.Range#commitProperties
        */
        public commitProperties(): void;
        /**
        * 修正stepSize到最接近snapInterval的整数倍
        */
        private nearestValidSize(size);
        /**
        * 修正输入的值为有效值
        * @method ns_egret.Range#nearestValidValue
        * @param value {number} 输入值。
        * @param interval {number} snapInterval 的值，或 snapInterval 的整数倍数。
        * @returns {number}
        */
        public nearestValidValue(value: number, interval: number): number;
        /**
        * 设置当前值。此方法假定调用者已经使用了 nearestValidValue() 方法来约束 value 参数
        * @method ns_egret.Range#setValue
        * @param value {number} value属性的新值
        */
        public setValue(value: number): void;
        /**
        * 按 stepSize增大或减小当前值
        * @method ns_egret.Range#changeValueByStep
        * @param increase {boolean} 若为 true，则向value增加stepSize，否则减去它。
        */
        public changeValueByStep(increase?: boolean): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Button
    * @classdesc
    * 按钮控件
    * @extends ns_egret.ButtonBase
    */ 
    class Button extends ButtonBase {
        /**
        * @method ns_egret.Button#constructor
        */
        constructor();
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.TrackBaseEvent
    * @classdesc
    * 从TrackBase组件分派的事件。
    * @extends ns_egret.Event
    */ 
    class TrackBaseEvent extends Event {
        /**
        * 正在拖拽滑块
        * @constant ns_egret.TrackBaseEvent.THUMB_DRAG
        */ 
        static THUMB_DRAG: string;
        /**
        * 滑块被按下
        * @constant ns_egret.TrackBaseEvent.THUMB_PRESS
        */ 
        static THUMB_PRESS: string;
        /**
        * 滑块被放开
        * @constant ns_egret.TrackBaseEvent.THUMB_RELEASE
        */ 
        static THUMB_RELEASE: string;
        /**
        * 构造函数
        * @method ns_egret.TrackBaseEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        */ 
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.TrackBaseEvent.dispatchTrackBaseEvent
        */
        static dispatchTrackBaseEvent(target: IEventDispatcher, type: string): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.TrackBase
    * @classdesc
    * TrackBase类是具有一个轨道和一个或多个滑块按钮的组件的一个基类，如 Slider 和 ScrollBar。
    * @extends ns_egret.Range
    */ 
    class TrackBase extends Range {
        /**
        * @method ns_egret.TrackBase#constructor
        */
        constructor();
        private _slideDuration;
        /**
        * 在轨道上单击以移动滑块时，滑动动画持续的时间（以毫秒为单位）。<br/>
        * 此属性用于 Slider 和 ScrollBar。对于 Slider，在轨道上的任何单击将导致生成使用此样式的一个动画，同时滑块将移到单击的位置。<br/>
        * 对于 ScrollBar，仅当按住 Shift 键并单击轨道时才使用此样式，这会导致滑块移到单击的位置。<br/>
        * 未按下 Shift 键时单击 ScrollBar 轨道将导致出现分页行为。<br/>
        * 按住 Shift 键并单击时，必须也对 ScrollBar 设置 smoothScrolling 属性才可以实现动画行为。<br/>
        * 此持续时间是整个滑过轨道的总时间，实际滚动会根据距离相应缩短。
        * @member ns_egret.TrackBase#slideDuration
        */ 
        public slideDuration : number;
        /**
        * [SkinPart]实体滑块组件
        * @member ns_egret.TrackBase#thumb
        */ 
        public thumb: Button;
        /**
        * [SkinPart]实体轨道组件
        * @member ns_egret.TrackBase#track
        */
        public track: Button;
        /**
        * 最大有效值
        * @member ns_egret.TrackBase#maximum
        */
        /**
        * @inheritDoc
        */
        public maximum : number;
        /**
        * 最小有效值
        * @member ns_egret.TrackBase#minimum
        */
        /**
        * @inheritDoc
        */
        public minimum : number;
        /**
        * 此范围的当前值。
        * @member ns_egret.TrackBase#value
        */
        /**
        * @inheritDoc
        */
        public value : number;
        /**
        * @method ns_egret.TrackBase#setValue
        * @param value {number}
        */
        public setValue(value: number): void;
        /**
        * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值。
        * @method ns_egret.TrackBase#pointToValue
        * @param x {number} 相对于轨道原点的位置的x坐标。
        * @param y {number} 相对于轨道原点的位置的y坐标。
        * @returns {number}
        */ 
        public pointToValue(x: number, y: number): number;
        /**
        * @method ns_egret.TrackBase#changeValueByStep
        * @param increase {boolean}
        */
        public changeValueByStep(increase?: boolean): void;
        /**
        * @method ns_egret.TrackBase#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
        /**
        * @method ns_egret.TrackBase#partRemoved
        * @param partName {string}
        * @param instance {any}
        */
        public partRemoved(partName: string, instance: any): void;
        /**
        * @method ns_egret.TrackBase#updateDisplayList
        * @param w {number}
        * @param h {number}
        */
        public updateDisplayList(w: number, h: number): void;
        /**
        * 记录鼠标在thumb上按下的位置
        */ 
        public _clickOffsetX: number;
        public _clickOffsetY: number;
        /**
        * 更新皮肤部件（通常为滑块）的大小和可见性。<br/>
        * 子类覆盖此方法以基于 minimum、maximum 和 value 属性更新滑块的大小、位置和可见性。
        * @method ns_egret.TrackBase#updateSkinDisplayList
        */ 
        public updateSkinDisplayList(): void;
        /**
        * 添加到舞台时
        */ 
        private addedToStageHandler(event);
        /**
        * 轨道尺寸改变事件
        */ 
        private track_resizeHandler(event);
        /**
        * 滑块尺寸改变事件
        */ 
        private thumb_resizeHandler(event);
        /**
        * 滑块三个阶段的延迟布局更新完毕事件
        */ 
        private thumb_updateCompleteHandler(event);
        /**
        * 滑块按下事件
        * @method ns_egret.TrackBase#thumb_mouseDownHandler
        * @param event {TouchEvent}
        */ 
        public thumb_mouseDownHandler(event: TouchEvent): void;
        /**
        * 当鼠标拖动thumb时，需要更新value的标记。
        */ 
        private needUpdateValue;
        /**
        * 拖动thumb过程中触发的EnterFrame事件
        */ 
        private onEnterFrame(event);
        /**
        * 当thumb被拖动时更新值，此方法每帧只被调用一次，比直接在鼠标移动事件里更新性能更高。
        * @method ns_egret.TrackBase#updateWhenMouseMove
        */ 
        public updateWhenMouseMove(): void;
        public _moveStageX: number;
        public _moveStageY: number;
        /**
        * 鼠标移动事件
        * @method ns_egret.TrackBase#stage_mouseMoveHandler
        * @param event {TouchEvent}
        */ 
        public stage_mouseMoveHandler(event: TouchEvent): void;
        /**
        * 鼠标弹起事件
        * @method ns_egret.TrackBase#stage_mouseUpHandler
        * @param event {Event}
        */ 
        public stage_mouseUpHandler(event: Event): void;
        /**
        * 轨道被按下事件
        * @method ns_egret.TrackBase#track_mouseDownHandler
        * @param event {TouchEvent}
        */ 
        public track_mouseDownHandler(event: TouchEvent): void;
        private mouseDownTarget;
        /**
        * 当在组件上按下鼠标时记录被按下的子显示对象
        */ 
        private mouseDownHandler(event);
        /**
        * 当鼠标弹起时，若不是在mouseDownTarget上弹起，而是另外的子显示对象上弹起时，额外抛出一个鼠标单击事件。
        */ 
        private system_mouseUpSomewhereHandler(event);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.SliderBase
    * @classdesc
    * 滑块控件基类
    * @extends ns_egret.TrackBase
    */
    class SliderBase extends TrackBase {
        /**
        * 构造函数
        * @method ns_egret.SliderBase#constructor
        */ 
        constructor();
        /**
        * [SkinPart]轨道高亮显示对象
        * @member ns_egret.SliderBase#trackHighlight
        */ 
        public trackHighlight: DisplayObject;
        private _showTrackHighlight;
        /**
        * 是否启用轨道高亮效果。默认值为true。
        * 注意，皮肤里的子部件trackHighlight要同时为非空才能显示高亮效果。
        * @member ns_egret.SliderBase#showTrackHighlight
        */
        public showTrackHighlight : boolean;
        /**
        * 动画实例
        */ 
        private animator;
        private _pendingValue;
        /**
        * 释放鼠标按键时滑块将具有的值。无论liveDragging是否为true，在滑块拖动期间始终更新此属性。
        * 而value属性在当liveDragging为false时，只在鼠标释放时更新一次。
        * @member ns_egret.SliderBase#pendingValue
        */
        public pendingValue : number;
        /**
        * @method ns_egret.SliderBase#setValue
        * @param value {number}
        */
        public setValue(value: number): void;
        /**
        * 动画播放更新数值
        */ 
        private animationUpdateHandler(animation);
        /**
        * 动画播放结束时要到达的value。
        */ 
        private slideToValue;
        /**
        * 动画播放完毕
        */ 
        private animationEndHandler(animation);
        /**
        * 停止播放动画
        */ 
        private stopAnimation();
        /**
        * @method ns_egret.SliderBase#thumb_mouseDownHandler
        * @param event {TouchEvent}
        */
        public thumb_mouseDownHandler(event: TouchEvent): void;
        private _liveDragging;
        /**
        * 如果为 true，则将在沿着轨道拖动滑块时，而不是在释放滑块按钮时，提交此滑块的值。
        * @member ns_egret.SliderBase#liveDragging
        */
        public liveDragging : boolean;
        /**
        * @method ns_egret.SliderBase#updateWhenMouseMove
        */
        public updateWhenMouseMove(): void;
        /**
        * @method ns_egret.SliderBase#stage_mouseUpHandler
        * @param event {Event}
        */
        public stage_mouseUpHandler(event: Event): void;
        /**
        * @method ns_egret.SliderBase#track_mouseDownHandler
        * @param event {TouchEvent}
        */
        public track_mouseDownHandler(event: TouchEvent): void;
        /**
        * @method ns_egret.SliderBase#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Label
    * @classdesc
    * 一行或多行不可编辑的文本控件
    * @extends ns_egret.TextBase
    */
    class Label extends TextBase {
        /**
        * @method ns_egret.Label#constructor
        */
        constructor();
        /**
        * 一个验证阶段完成
        */ 
        private updateCompleteHandler(event);
        private _maxDisplayedLines;
        /**
        * 最大显示行数,0或负值代表不限制。
        * @member ns_egret.Label#maxDisplayedLines
        */
        public maxDisplayedLines : number;
        /**
        * 上一次测量的宽度
        */ 
        private lastUnscaledWidth;
        private _padding;
        /**
        * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
        * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
        * @member ns_egret.Label#padding
        */
        public padding : number;
        private _paddingLeft;
        /**
        * 文字距离左边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.Label#paddingLeft
        */
        public paddingLeft : number;
        private _paddingRight;
        /**
        * 文字距离右边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.Label#paddingRight
        */
        public paddingRight : number;
        private _paddingTop;
        /**
        * 文字距离顶部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.Label#paddingTop
        */
        public paddingTop : number;
        private _paddingBottom;
        /**
        * 文字距离底部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.Label#paddingBottom
        */
        public paddingBottom : number;
        /**
        * @method ns_egret.Label#measure
        */
        public measure(): void;
        /**
        * 特殊情况，组件尺寸由父级决定，要等到父级UpdateDisplayList的阶段才能测量
        */ 
        private isSpecialCase();
        /**
        * 使用指定的宽度进行测量
        */ 
        private measureUsingWidth(w);
        /**
        * @method ns_egret.Label#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Rect
    * @classdesc
    * 矩形绘图元素。矩形的角可以是圆角,此组件可响应鼠标事件。
    * @extends ns_egret.UIComponent
    */
    class Rect extends UIComponent {
        /**
        * 构造函数
        * @method ns_egret.Rect#constructor
        */ 
        constructor();
        private shapeRect;
        /**
        * @method ns_egret.Rect#createChildren
        */
        public createChildren(): void;
        private _fillColor;
        /**
        * 填充颜色
        * @member ns_egret.Rect#fillColor
        */
        public fillColor : number;
        private _fillAlpha;
        /**
        * 填充透明度,默认值为0。
        * @member ns_egret.Rect#fillAlpha
        */
        public fillAlpha : number;
        private _strokeColor;
        /**
        * 边框颜色,注意：当strokeAlpha为0时，不显示边框。
        * @member ns_egret.Rect#strokeColor
        */
        public strokeColor : number;
        private _strokeAlpha;
        /**
        * 边框透明度，默认值为0。
        * @member ns_egret.Rect#strokeAlpha
        */
        public strokeAlpha : number;
        private _strokeWeight;
        /**
        * 边框粗细(像素),注意：当strokeAlpha为0时，不显示边框。
        * @member ns_egret.Rect#strokeWeight
        */
        public strokeWeight : number;
        /**
        * @method ns_egret.Rect#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ToggleButton
    * @classdesc
    * 切换按钮
    * @extends ns_egret.ToggleButtonBase
    */ 
    class ToggleButton extends ToggleButtonBase {
        /**
        * 构造函数
        * @method ns_egret.ToggleButton#constructor
        */ 
        constructor();
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.CheckBox
    * @classdesc
    * 复选框
    * @extends ns_egret.ToggleButtonBase
    */ 
    class CheckBox extends ToggleButtonBase {
        /**
        * 构造函数
        * @method ns_egret.CheckBox#constructor
        */ 
        constructor();
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.RadioButton
    * @classdesc
    * 单选按钮
    * @extends ns_egret.ToggleButtonBase
    */
    class RadioButton extends ToggleButtonBase {
        /**
        * 构造函数
        * @method ns_egret.RadioButton#constructor
        */
        constructor();
        /**
        * 在RadioButtonGroup中的索引
        * @member ns_egret.RadioButton#_indexNumber
        */ 
        public _indexNumber: number;
        /**
        * 所属的RadioButtonGroup
        * @member ns_egret.RadioButton#_radioButtonGroup
        */ 
        public _radioButtonGroup: RadioButtonGroup;
        /**
        * @member ns_egret.RadioButton#enabled
        */
        /**
        * @inheritDoc
        */
        public enabled : boolean;
        /**
        * 存储根据groupName自动创建的RadioButtonGroup列表
        */ 
        private static automaticRadioButtonGroups;
        private _group;
        /**
        * 此单选按钮所属的组。同一个组的多个单选按钮之间互斥。
        * 若不设置此属性，则根据groupName属性自动创建一个唯一的RadioButtonGroup。
        * @member ns_egret.RadioButton#group
        */ 
        public group : RadioButtonGroup;
        private groupChanged;
        private _groupName;
        /**
        * 所属组的名称,具有相同组名的多个单选按钮之间互斥。默认值:"radioGroup"。
        * 可以把此属性当做设置组的一个简便方式，作用与设置group属性相同,。
        * @member ns_egret.RadioButton#groupName
        */ 
        public groupName : string;
        /**
        * @inheritDoc
        */
        public _setSelected(value: boolean): void;
        private _value;
        /**
        * 与此单选按钮关联的自定义数据。
        * 当被点击时，所属的RadioButtonGroup对象会把此属性赋值给ItemClickEvent.item属性并抛出事件。
        * @member ns_egret.RadioButton#value
        */ 
        public value : any;
        /**
        * @method ns_egret.RadioButton#commitProperties
        */
        public commitProperties(): void;
        /**
        * @method ns_egret.RadioButton#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
        * @method ns_egret.RadioButton#buttonReleased
        */
        public buttonReleased(): void;
        /**
        * 添此单选按钮加到组
        */ 
        private addToGroup();
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IVisualElementContainer
    * @interface
    * @classdesc
    * 具有管理IVisualElement子显示对象的容器接口
    * @extends ns_egret.IVisualElement
    * @extends ns_egret.IContainer
    */ 
    interface IVisualElementContainer extends IVisualElement, IContainer {
        /**
        * 从容器中删除所有可视元素。
        * @method ns_egret.IVisualElementContainer#removeAllElements
        */ 
        removeAllElements(): void;
        /**
        * 交换两个指定可视元素的索引。所有其他元素仍位于相同的索引位置。
        * @method ns_egret.IVisualElementContainer#swapElements
        * @param element1 {IVisualElement} 第一个可视元素。
        * @param element2 {IVisualElement} 第二个可视元素。
        */ 
        swapElements(element1: IVisualElement, element2: IVisualElement): void;
        /**
        * 交换容器中位于两个指定索引位置的可视元素。所有其他可视元素仍位于相同的索引位置。
        * @method ns_egret.IVisualElementContainer#swapElementsAt
        * @param index1 {number} 第一个元素的索引。
        * @param index2 {number} 第二个元素的索引。
        * @throws RangeError 如果在子列表中不存在该索引位置。
        */ 
        swapElementsAt(index1: number, index2: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.RadioButtonGroup
    * @classdesc
    * 单选按钮组
    * @extends ns_egret.EventDispatcher
    */
    class RadioButtonGroup extends EventDispatcher {
        /**
        * 构造函数
        * @method ns_egret.RadioButtonGroup#constructor
        */ 
        constructor();
        private static groupCount;
        /**
        * 组名
        * @member ns_egret.RadioButtonGroup#_name
        */ 
        public _name: string;
        /**
        * 单选按钮列表
        */ 
        private radioButtons;
        private _enabled;
        /**
        * 组件是否可以接受用户交互。默认值为true。设置此属性将影响组内所有单选按钮。
        * @member ns_egret.RadioButtonGroup#enabled
        */ 
        public enabled : boolean;
        /**
        * 组内单选按钮数量
        * @member ns_egret.RadioButtonGroup#numRadioButtons
        */ 
        public numRadioButtons : number;
        private _selectedValue;
        /**
        * 当前被选中的单选按钮的value属性值。注意，此属性仅当目标RadioButton在显示列表时有效。
        * @member ns_egret.RadioButtonGroup#selectedValue
        */ 
        public selectedValue : any;
        private _selection;
        /**
        * 当前被选中的单选按钮引用,注意，此属性仅当目标RadioButton在显示列表时有效。
        * @member ns_egret.RadioButtonGroup#selection
        */ 
        public selection : RadioButton;
        /**
        * 获取指定索引的单选按钮
        * @method ns_egret.RadioButtonGroup#getRadioButtonAt
        * @param index {number} 单选按钮的索引
        * @returns {RadioButton}
        */ 
        public getRadioButtonAt(index: number): RadioButton;
        /**
        * 添加单选按钮到组内
        * @method ns_egret.RadioButtonGroup#_addInstance
        * @param instance {RadioButton}
        */
        public _addInstance(instance: RadioButton): void;
        /**
        * 从组里移除单选按钮
        * @method ns_egret.RadioButtonGroup#_removeInstance
        * @param instance {RadioButton}
        */ 
        public _removeInstance(instance: RadioButton): void;
        /**
        * 执行从组里移除单选按钮
        */ 
        private doRemoveInstance(instance, addListener?);
        /**
        * 设置选中的单选按钮
        * @method ns_egret.RadioButtonGroup#_setSelection
        * @param value {RadioButton}
        * @param fireChange {boolean}
        */ 
        public _setSelection(value: RadioButton, fireChange?: boolean): void;
        /**
        * 改变选中项
        */ 
        private changeSelection(index, fireChange?);
        /**
        * 显示对象深度排序
        */ 
        private breadthOrderCompare(a, b);
        /**
        * 单选按钮添加到显示列表
        */ 
        private radioButton_addedHandler(event);
        /**
        * 单选按钮从显示列表移除
        */ 
        private radioButton_removedHandler(event);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ElementExistenceEvent
    * @classdesc
    * Group添加或移除元素时分派的事件。
    * @extends ns_egret.Event
    */ 
    class ElementExistenceEvent extends Event {
        /**
        * 元素添加
        * @constant ns_egret.ElementExistenceEvent.ELEMENT_ADD
        */ 
        static ELEMENT_ADD: string;
        /**
        * 元素移除
        * @constant ns_egret.ElementExistenceEvent.ELEMENT_REMOVE
        */ 
        static ELEMENT_REMOVE: string;
        /**
        * @member ns_egret.ElementExistenceEvent#constructor
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, element?: IVisualElement, index?: number);
        /**
        * 指向已添加或删除元素的位置的索引。
        * @member ns_egret.ElementExistenceEvent#index
        */ 
        public index: number;
        /**
        * 对已添加或删除的视觉元素的引用。
        * @member ns_egret.ElementExistenceEvent#element
        */ 
        public element: IVisualElement;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.ElementExistenceEvent.dispatchElementExistenceEvent
        */
        static dispatchElementExistenceEvent(target: IEventDispatcher, type: string, element?: IVisualElement, index?: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Group
    * @classdesc
    * 自动布局容器
    * @extends ns_egret.GroupBase
    * @implements ns_egret.IVisualElementContainer
    */
    class Group extends GroupBase implements IVisualElementContainer {
        /**
        * @method ns_egret.Group#constructor
        */
        constructor();
        /**
        * createChildren()方法已经执行过的标志
        */ 
        private createChildrenCalled;
        /**
        * @method ns_egret.Group#createChildren
        */
        public createChildren(): void;
        /**
        * elementsContent改变标志
        */ 
        private elementsContentChanged;
        private _elementsContent;
        /**
        * 返回子元素列表
        */
        public _getElementsContent(): any[];
        /**
        * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
        * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
        */ 
        public elementsContent : any[];
        /**
        * 设置容器子对象列表
        */ 
        private setElementsContent(value);
        /**
        * @member ns_egret.Group#numElements
        */
        public numElements : number;
        /**
        * @method ns_egret.Group#getElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public getElementAt(index: number): IVisualElement;
        private checkForRangeError(index, addingElement?);
        /**
        * @method ns_egret.Group#addElement
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public addElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.Group#addElementAt
        * @param element {IVisualElement}
        * @param index {number}
        * @returns {IVisualElement}
        */
        public addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
        * @method ns_egret.Group#removeElement
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public removeElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.Group#removeElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public removeElementAt(index: number): IVisualElement;
        /**
        * @method ns_egret.Group#removeAllElements
        */
        public removeAllElements(): void;
        /**
        * @method ns_egret.Group#getElementIndex
        * @param element {IVisualElement}
        * @returns {number}
        */
        public getElementIndex(element: IVisualElement): number;
        /**
        * @method ns_egret.Group#setElementIndex
        * @param element {IVisualElement}
        * @param index {number}
        */
        public setElementIndex(element: IVisualElement, index: number): void;
        /**
        * @method ns_egret.Group#swapElements
        * @param element1 {IVisualElement}
        * @param element2 {IVisualElement}
        */
        public swapElements(element1: IVisualElement, element2: IVisualElement): void;
        /**
        * @method ns_egret.Group#swapElementsAt
        * @param index1 {number}
        * @param index2 {number}
        */
        public swapElementsAt(index1: number, index2: number): void;
        /**
        * 添加一个显示元素到容器
        * @method ns_egret.Group#_elementAdded
        * @param element {IVisualElement}
        * @param index {number}
        * @param notifyListeners {boolean}
        */ 
        public _elementAdded(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        /**
        * 从容器移除一个显示元素
        * @method ns_egret.Group#_elementRemoved
        * @param element {IVisualElement}
        * @param index {number}
        * @param notifyListeners {boolean}
        */ 
        public _elementRemoved(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        /**
        * 添加对象到显示列表
        */ 
        public _addToDisplayList(child: DisplayObject, index?: number): void;
        private static errorStr;
        /**
        * @method ns_egret.Group#addChild
        * @deprecated
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */ 
        public addChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.Group#addChildAt
        * @deprecated
        * @param child {DisplayObject}
        * @param index {number}
        * @returns {DisplayObject}
        */ 
        public addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
        * @method ns_egret.Group#removeChild
        * @deprecated
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */ 
        public removeChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.Group#removeChildAt
        * @deprecated
        * @param index {number}
        * @returns {DisplayObject}
        */ 
        public removeChildAt(index: number): DisplayObject;
        /**
        * @method ns_egret.Group#setChildIndex
        * @deprecated
        * @param child {DisplayObject}
        * @param index {number}
        */ 
        public setChildIndex(child: DisplayObject, index: number): void;
        /**
        * @method ns_egret.Group#swapChildren
        * @deprecated
        * @param child1 {DisplayObject}
        * @param child2 {DisplayObject}
        */ 
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
        * @method ns_egret.Group#swapChildrenAt
        * @deprecated
        * @param index1 {number}
        * @param index2 {number}
        */ 
        public swapChildrenAt(index1: number, index2: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IViewStack
    * @interface
    * @classdesc
    * 层级堆叠容器接口
    */
    interface IViewStack {
        /**
        * 当前可见子元素的索引。索引从0开始。
        * @member ns_egret.IViewStack#selectedIndex
        */ 
        selectedIndex: number;
        /**
        * 当前可见的子元素。
        * @member ns_egret.IViewStack#selectedChild
        */
        selectedChild: IVisualElement;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ViewStack
    * @classdesc
    * 层级堆叠容器,一次只显示一个子对象。
    * @extends ns_egret.Group
    * @implements ns_egret.IViewStack
    * @implements ns_egret.ICollection
    */
    class ViewStack extends Group implements IViewStack, ICollection {
        /**
        * 构造函数
        * @method ns_egret.ViewStack#constructor
        */ 
        constructor();
        /**
        * 此容器的布局对象为只读,默认限制为BasicLayout。
        * @member ns_egret.ViewStack#layout
        */ 
        public layout : LayoutBase;
        private _createAllChildren;
        /**
        * 是否立即初始化化所有子项。false表示当子项第一次被显示时再初始化它。默认值false。
        * @member ns_egret.ViewStack#createAllChildren
        */
        public createAllChildren : boolean;
        private _selectedChild;
        /**
        * @member ns_egret.ViewStack#selectedChild
        */ 
        public selectedChild : IVisualElement;
        /**
        * 未设置缓存选中项的值
        */
        private static NO_PROPOSED_SELECTION;
        /**
        * 在属性提交前缓存选中项索引
        */ 
        private proposedSelectedIndex;
        public _selectedIndex: number;
        /**
        * @member ns_egret.ViewStack#selectedIndex
        */ 
        public selectedIndex : number;
        private notifyTabBar;
        /**
        * 设置选中项索引
        * @method ns_egret.ViewStack#_setSelectedIndex
        * @param value {number}
        * @param notifyListeners {boolean}
        */ 
        public _setSelectedIndex(value: number, notifyListeners?: boolean): void;
        /**
        * 添加一个显示元素到容器
        * @method ns_egret.ViewStack#_elementAdded
        * @param element {IVisualElement}
        * @param index {number}
        * @param notifyListeners {boolean}
        */ 
        public _elementAdded(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        /**
        * 从容器移除一个显示元素
        * @method ns_egret.ViewStack#_elementRemoved
        * @param element {IVisualElement}
        * @param index {number}
        * @param notifyListeners {boolean}
        */ 
        public _elementRemoved(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        /**
        * 子项显示列表顺序发生改变。
        */ 
        private childOrderingChanged;
        /**
        * @method ns_egret.ViewStack#commitProperties
        */
        public commitProperties(): void;
        private commitSelection(newIndex);
        /**
        * @member ns_egret.ViewStack#length
        */ 
        public length : number;
        /**
        * @method ns_egret.ViewStack#getItemAt
        * @param index {number}
        * @returns {any}
        */ 
        public getItemAt(index: number): any;
        /**
        * @method ns_egret.ViewStack#getItemIndex
        * @param item {any}
        * @returns {number}
        */ 
        public getItemIndex(item: any): number;
        /**
        * 抛出事件
        */ 
        private dispatchCoEvent(kind?, location?, oldLocation?, items?, oldItems?);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.StateChangeEvent
    * @classdesc
    * 视图状态改变事件
    * @extends ns_egret.Event
    */ 
    class StateChangeEvent extends Event {
        /**
        * 当前视图状态已经改变
        * @constant ns_egret.StateChangeEvent.CURRENT_STATE_CHANGE
        */ 
        static CURRENT_STATE_CHANGE: string;
        /**
        * 当前视图状态即将改变
        * @constant ns_egret.StateChangeEvent.CURRENT_STATE_CHANGING
        */ 
        static CURRENT_STATE_CHANGING: string;
        /**
        * @method ns_egret.StateChangeEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        * @param oldState {string}
        * @param newState {string}
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, oldState?: string, newState?: string);
        /**
        * 组件正在进入的视图状态的名称。
        * @member ns_egret.StateChangeEvent#newState
        */ 
        public newState: string;
        /**
        * 组件正在退出的视图状态的名称。
        * @member ns_egret.StateChangeEvent#oldState
        */ 
        public oldState: string;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.StateChangeEvent.dispatchStateChangeEvent
        */
        static dispatchStateChangeEvent(target: IEventDispatcher, type: string, oldState?: string, newState?: string): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Skin
    * @classdesc
    * 含有视图状态功能的皮肤基类。注意：为了减少嵌套层级，此皮肤没有继承显示对象，若需要显示对象版本皮肤，请使用Skin。
    * @see org.flexlite.domUI.components.supportClasses.Skin
    * @extends ns_egret.EventDispatcher
    * @implements ns_egret.IStateClient
    * @implements ns_egret.ISkin
    * @implements ns_egret.IContainer
    */
    class Skin extends EventDispatcher implements IStateClient, ISkin, IContainer {
        /**
        * 构造函数
        * @method ns_egret.Skin#constructor
        */ 
        constructor();
        /**
        * 组件的最大测量宽度,仅影响measuredWidth属性的取值范围。
        * @member ns_egret.Skin#maxWidth
        */ 
        public maxWidth: number;
        /**
        * 组件的最小测量宽度,此属性设置为大于maxWidth的值时无效。仅影响measuredWidth属性的取值范围。
        * @member ns_egret.Skin#minWidth
        */
        public minWidth: number;
        /**
        * 组件的最大测量高度,仅影响measuredHeight属性的取值范围。
        * @member ns_egret.Skin#maxHeight
        */
        public maxHeight: number;
        /**
        * 组件的最小测量高度,此属性设置为大于maxHeight的值时无效。仅影响measuredHeight属性的取值范围。
        * @member ns_egret.Skin#minHeight
        */
        public minHeight: number;
        /**
        * 组件宽度
        * @member ns_egret.Skin#width
        */
        public width: number;
        /**
        * 组件高度
        * @member ns_egret.Skin#height
        */
        public height: number;
        private _initialized;
        /**
        * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
        * 请务必调用super.createChildren()以完成父类组件的初始化
        * @method ns_egret.Skin#createChildren
        */
        public createChildren(): void;
        private _hostComponent;
        /**
        * @member ns_egret.Skin#hostComponent
        */
        /**
        * @inheritDoc
        */
        public hostComponent : SkinnableComponent;
        public _setHostComponent(value: SkinnableComponent): void;
        private _elementsContent;
        /**
        * 返回子元素列表
        */
        public _getElementsContent(): any[];
        /**
        * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
        * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
        */ 
        public elementsContent : any[];
        /**
        * @member ns_egret.Skin#numElements
        */
        public numElements : number;
        /**
        * @method ns_egret.Skin#getElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public getElementAt(index: number): IVisualElement;
        private checkForRangeError(index, addingElement?);
        /**
        * @method ns_egret.Skin#addElement
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public addElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.Skin#addElementAt
        * @param element {IVisualElement}
        * @param index {number}
        * @returns {IVisualElement}
        */
        public addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
        * @method ns_egret.Skin#removeElement
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public removeElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.Skin#removeElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public removeElementAt(index: number): IVisualElement;
        /**
        * @method ns_egret.Skin#getElementIndex
        * @param element {IVisualElement}
        * @returns {number}
        */
        public getElementIndex(element: IVisualElement): number;
        /**
        * @method ns_egret.Skin#setElementIndex
        * @param element {IVisualElement}
        * @param index {number}
        */
        public setElementIndex(element: IVisualElement, index: number): void;
        /**
        * 添加一个显示元素到容器
        * @method ns_egret.Skin#_elementAdded
        * @param element {IVisualElement}
        * @param index {number}
        * @param notifyListeners {boolean}
        */ 
        public _elementAdded(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        /**
        * 从容器移除一个显示元素
        * @method ns_egret.Skin#_elementRemoved
        * @param element {IVisualElement}
        * @param index {number}
        * @param notifyListeners {boolean}
        */ 
        public _elementRemoved(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        private _states;
        /**
        * 为此组件定义的视图状态。
        * @member ns_egret.StateClientHelper#states
        */
        public states : any[];
        public _setStates(value: any[]): void;
        /**
        * 当前视图状态发生改变的标志
        */
        private currentStateChanged;
        private _currentState;
        /**
        * 存储还未验证的视图状态
        */
        private requestedCurrentState;
        /**
        * 组件的当前视图状态。将其设置为 "" 或 null 可将组件重置回其基本状态。
        * @member ns_egret.StateClientHelper#currentState
        */
        public currentState : string;
        /**
        * 返回是否含有指定名称的视图状态
        * @method ns_egret.Skin#hasState
        * @param stateName {string}
        * @returns {boolean}
        */
        public hasState(stateName: string): boolean;
        /**
        * 返回默认状态
        */
        private getDefaultState();
        /**
        * 应用当前的视图状态。子类覆盖此方法在视图状态发生改变时执行相应更新操作。
        * @method ns_egret.Skin#commitCurrentState
        */
        public commitCurrentState(): void;
        /**
        * 通过名称返回视图状态
        */
        private getState(stateName);
        /**
        * 移除指定的视图状态以及所依赖的所有父级状态，除了与新状态的共同状态外
        */
        private removeState(stateName);
        /**
        * 应用新状态
        */
        private applyState(stateName);
        private initialized;
        /**
        * 初始化所有视图状态
        * @method ns_egret.StateClientHelper#initializeStates
        */
        public initializeStates(): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IItemRendererOwner
    * @interface
    * @classdesc
    * 项呈示器的主机组件接口
    */ 
    interface IItemRendererOwner {
        /**
        * 更新项呈示器数据
        * @method ns_egret.IItemRendererOwner#updateRenderer
        * @param renderer {IItemRenderer}
        * @param itemIndex {number}
        * @param data {any}
        * @returns {IItemRenderer}
        */ 
        updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer;
    }
}
declare module ns_egret {
    /**
    * @classdesc
    * IFactory 接口定义工厂类（如 ClassFactory）必须实现的接口。
    * IFactory 类型的对象是“工厂对象”，Egret使用它来生成另一类的多个实例（每个实例具有相同的属性）。
    * @interface
    * @class ns_egret.IFactory
    * @extends ns_egret.IHashObject
    */
    interface IFactory extends IHashObject {
        /**
        * 创建某一类（由实现 IFactory 的类确定）的实例。
        * @method ns_egret.IFactory#newInstance
        * @returns {any}
        */
        newInstance(): any;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.RendererExistenceEvent
    * @classdesc
    * 在DataGroup添加或删除项呈示器时分派的事件。
    * @extends ns_egret.Event
    */ 
    class RendererExistenceEvent extends Event {
        /**
        * 添加了项呈示器
        * @constant ns_egret.RendererExistenceEvent.RENDERER_ADD
        */ 
        static RENDERER_ADD: string;
        /**
        * 移除了项呈示器
        * @constant ns_egret.RendererExistenceEvent.RENDERER_REMOVE
        */ 
        static RENDERER_REMOVE: string;
        /**
        * @method ns_egret.RendererExistenceEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        * @param renderer {IItemRenderer}
        * @param index {number}
        * @param data {any}
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, renderer?: IItemRenderer, index?: number, data?: any);
        /**
        * 呈示器的数据项目。
        * @member ns_egret.RendererExistenceEvent#data
        */ 
        public data: any;
        /**
        * 指向已添加或删除项呈示器的位置的索引。
        * @member ns_egret.RendererExistenceEvent#index
        */ 
        public index: number;
        /**
        * 对已添加或删除的项呈示器的引用。
        * @member ns_egret.RendererExistenceEvent#renderer
        */ 
        public renderer: IItemRenderer;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.RendererExistenceEvent.dispatchRendererExistenceEvent
        */
        static dispatchRendererExistenceEvent(target: IEventDispatcher, type: string, renderer?: IItemRenderer, index?: number, data?: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.VerticalLayout
    * @classdesc
    * 垂直布局
    * @extends ns_egret.LayoutBase
    */
    class VerticalLayout extends LayoutBase {
        /**
        * @method ns_egret.VerticalLayout#constructor
        */
        constructor();
        private _horizontalAlign;
        /**
        * 布局元素的水平对齐策略。参考HorizontalAlign定义的常量。
        * @member ns_egret.VerticalLayout#horizontalAlign
        */
        public horizontalAlign : string;
        private _verticalAlign;
        /**
        * 布局元素的竖直对齐策略。参考VerticalAlign定义的常量。
        * 注意：此属性设置为CONTENT_JUSTIFY始终无效。当useVirtualLayout为true时，设置JUSTIFY也无效。
        * @member ns_egret.VerticalLayout#verticalAlign
        */
        public verticalAlign : string;
        private _gap;
        /**
        * 布局元素之间的垂直空间（以像素为单位）
        * @member ns_egret.VerticalLayout#gap
        */
        public gap : number;
        private _padding;
        /**
        * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
        * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
        * @member ns_egret.VerticalLayout#padding
        */
        public padding : number;
        private _paddingLeft;
        /**
        * 容器的左边缘与布局元素的左边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.VerticalLayout#paddingLeft
        */
        public paddingLeft : number;
        private _paddingRight;
        /**
        * 容器的右边缘与布局元素的右边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.VerticalLayout#paddingRight
        */
        public paddingRight : number;
        private _paddingTop;
        /**
        * 容器的顶边缘与第一个布局元素的顶边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.VerticalLayout#paddingTop
        */
        public paddingTop : number;
        private _paddingBottom;
        /**
        * 容器的底边缘与最后一个布局元素的底边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.VerticalLayout#paddingBottom
        */
        public paddingBottom : number;
        /**
        * 标记目标容器的尺寸和显示列表失效
        */
        private invalidateTargetSizeAndDisplayList();
        /**
        * @method ns_egret.VerticalLayout#measure
        */
        public measure(): void;
        /**
        * 测量使用虚拟布局的尺寸
        */
        private measureVirtual();
        /**
        * 测量使用真实布局的尺寸
        */
        private measureReal();
        /**
        * @method ns_egret.VerticalLayout#updateDisplayList
        * @param width {number}
        * @param height {number}
        */
        public updateDisplayList(width: number, height: number): void;
        /**
        * 虚拟布局使用的子对象尺寸缓存
        */
        private elementSizeTable;
        /**
        * 获取指定索引的起始位置
        */
        private getStartPosition(index);
        /**
        * 获取指定索引的元素尺寸
        */
        private getElementSize(index);
        /**
        * 获取缓存的子对象尺寸总和
        */
        private getElementTotalSize();
        /**
        * @method ns_egret.VerticalLayout#elementAdded
        * @param index {number}
        */
        public elementAdded(index: number): void;
        /**
        * @method ns_egret.VerticalLayout#elementRemoved
        * @param index {number}
        */
        public elementRemoved(index: number): void;
        /**
        * @method ns_egret.VerticalLayout#clearVirtualLayoutCache
        */
        public clearVirtualLayoutCache(): void;
        /**
        * 折半查找法寻找指定位置的显示对象索引
        */
        private findIndexAt(y, i0, i1);
        /**
        * 虚拟布局使用的当前视图中的第一个元素索引
        */
        private startIndex;
        /**
        * 虚拟布局使用的当前视图中的最后一个元素的索引
        */
        private endIndex;
        /**
        * 视图的第一个和最后一个元素的索引值已经计算好的标志
        */
        private indexInViewCalculated;
        /**
        * @method ns_egret.VerticalLayout#scrollPositionChanged
        */
        public scrollPositionChanged(): void;
        /**
        * 获取视图中第一个和最后一个元素的索引,返回是否发生改变
        */
        private getIndexInView();
        /**
        * 子对象最大宽度
        */
        private maxElementWidth;
        /**
        * 更新使用虚拟布局的显示列表
        */
        private updateDisplayListVirtual(width, height);
        /**
        * 更新使用真实布局的显示列表
        */
        private updateDisplayListReal(width, height);
        /**
        * 为每个可变尺寸的子项分配空白区域
        * @method ns_egret.VerticalLayout.flexChildrenProportionally
        * @param spaceForChildren {number}
        * @param spaceToDistribute {number}
        * @param totalPercent {number}
        * @param childInfoArray {Array<any>}
        */
        static flexChildrenProportionally(spaceForChildren: number, spaceToDistribute: number, totalPercent: number, childInfoArray: any[]): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.DataGroup
    * @classdesc
    * 数据项目的容器基类
    * 将数据项目转换为可视元素以进行显示。
    * @extends ns_egret.GroupBase
    */
    class DataGroup extends GroupBase {
        /**
        * 构造函数
        * @method ns_egret.DataGroup#constructor
        */ 
        constructor();
        /**
        * @method ns_egret.DataGroup.defaultRendererFactory
        * @param ClassFactory {any}
        */
        static defaultRendererFactory: ClassFactory;
        /**
        * 项呈示器的主机组件
        */
        public _rendererOwner: IItemRendererOwner;
        private useVirtualLayoutChanged;
        /**
        * @member ns_egret.DataGroup#layout
        */
        /**
        * @inheritDoc
        */
        public layout : LayoutBase;
        /**
        * 是否使用虚拟布局标记改变
        */ 
        private layout_useVirtualLayoutChangedHandler(event);
        /**
        * 存储当前可见的项呈示器索引列表
        */ 
        private virtualRendererIndices;
        /**
        * @method ns_egret.DataGroup#setVirtualElementIndicesInView
        * @param startIndex {number}
        * @param endIndex {number}
        */
        public setVirtualElementIndicesInView(startIndex: number, endIndex: number): void;
        /**
        * @method ns_egret.DataGroup#getVirtualElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public getVirtualElementAt(index: number): IVisualElement;
        private rendererToClassMap;
        private freeRenderers;
        /**
        * 释放指定索引处的项呈示器
        */ 
        private freeRendererByIndex(index);
        /**
        * 释放指定的项呈示器
        */ 
        private doFreeRenderer(renderer);
        /**
        * 是否创建了新的项呈示器标志
        */ 
        private createNewRendererFlag;
        /**
        * @method ns_egret.DataGroup#invalidateSize
        */
        public invalidateSize(): void;
        /**
        * 为指定索引创建虚拟的项呈示器
        */ 
        private createVirtualRenderer(index);
        /**
        * 根据rendererClass创建一个Renderer,并添加到显示列表
        */ 
        private createOneRenderer(rendererFactory);
        /**
        * 设置项呈示器的默认皮肤
        */ 
        private setItemRenderSkinName(renderer);
        private cleanTimer;
        /**
        * 虚拟布局结束清理不可见的项呈示器
        */ 
        private finishVirtualLayout();
        /**
        * 延迟清理多余的在显示列表中的ItemRenderer。
        */ 
        private cleanAllFreeRenderer(event?);
        /**
        * @method ns_egret.DataGroup#getElementIndicesInView
        * @returns {number}
        */
        public getElementIndicesInView(): number[];
        /**
        * 更改是否使用虚拟布局
        */ 
        private changeUseVirtualLayout();
        private dataProviderChanged;
        private _dataProvider;
        /**
        * 列表数据源，请使用实现了ICollection接口的数据类型，例如ArrayCollection
        * @member ns_egret.DataGroup#dataProvider
        */
        public dataProvider : ICollection;
        /**
        * 移除数据源监听
        */ 
        private removeDataProviderListener();
        /**
        * 数据源改变事件处理
        */ 
        private onCollectionChange(event);
        /**
        * 数据源添加项目事件处理
        */ 
        private itemAddedHandler(items, index);
        /**
        * 数据源移动项目事件处理
        */ 
        private itemMovedHandler(item, location, oldLocation);
        /**
        * 数据源移除项目事件处理
        */ 
        private itemRemovedHandler(items, location);
        /**
        * 添加一项
        */ 
        private itemAdded(item, index);
        /**
        * 移除一项
        */ 
        private itemRemoved(item, index);
        /**
        * 对象池字典
        */ 
        private recyclerDic;
        /**
        * 回收一个ItemRenderer实例
        */ 
        private recycle(renderer);
        /**
        * 更新当前所有项的索引
        */ 
        private resetRenderersIndices();
        /**
        * 数据源更新或替换项目事件处理
        */ 
        private itemUpdatedHandler(item, location);
        /**
        * 调整指定项呈示器的索引值
        */ 
        private resetRendererItemIndex(index);
        /**
        * 项呈示器改变
        */ 
        private itemRendererChanged;
        private _itemRenderer;
        /**
        * 用于数据项目的项呈示器。该类必须实现 IItemRenderer 接口。<br/>
        * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
        * @member ns_egret.DataGroup#itemRenderer
        */
        public itemRenderer : IFactory;
        private itemRendererSkinNameChange;
        private _itemRendererSkinName;
        /**
        * 条目渲染器的可选皮肤标识符。在实例化itemRenderer时，若其内部没有设置过skinName,则将此属性的值赋值给它的skinName。
        * 注意:若itemRenderer不是ISkinnableClient，则此属性无效。
        * @member ns_egret.DataGroup#itemRendererSkinName
        */
        public itemRendererSkinName : any;
        private _itemRendererFunction;
        /**
        * 为某个特定项目返回一个项呈示器Class的函数。<br/>
        * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。<br/>
        * 应该定义一个与此示例函数类似的呈示器函数： <br/>
        * function myItemRendererFunction(item:Object):IFactory
        * @member ns_egret.DataGroup#itemRendererFunction
        */ 
        public itemRendererFunction : Function;
        /**
        * 为特定的数据项返回项呈示器的工厂实例
        */ 
        private itemToRendererClass(item);
        /**
        * @method ns_egret.DataGroup#createChildren
        * 设置默认的ItemRenderer
        * @private
        *
        */ 
        public createChildren(): void;
        /**
        * @method ns_egret.DataGroup#commitProperties
        */
        public commitProperties(): void;
        /**
        * @method ns_egret.DataGroup#measure
        */
        public measure(): void;
        /**
        * 正在进行虚拟布局阶段
        */ 
        private virtualLayoutUnderway;
        /**
        * @method ns_egret.DataGroup#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
        * 用于测试默认大小的数据
        */
        private typicalItem;
        private typicalItemChanged;
        /**
        * 确保测量过默认条目大小。
        */
        private ensureTypicalLayoutElement();
        /**
        * 测量项呈示器默认尺寸
        */ 
        private measureRendererSize();
        /**
        * 项呈示器的默认尺寸
        */ 
        private typicalLayoutRect;
        /**
        * 设置项目默认大小
        */ 
        private setTypicalLayoutRect(rect);
        /**
        * 索引到项呈示器的转换数组
        */ 
        private indexToRenderer;
        /**
        * 清理freeRenderer标志
        */ 
        private cleanFreeRenderer;
        /**
        * 移除所有项呈示器
        */ 
        private removeAllRenderers();
        /**
        * 为数据项创建项呈示器
        */ 
        private createRenderers();
        /**
        * 正在更新数据项的标志
        */ 
        private renderersBeingUpdated;
        /**
        * 更新项呈示器
        * @method ns_egret.DataGroup#updateRenderer
        * @param renderer {IItemRenderer}
        * @param itemIndex {number}
        * @param data {any}
        * @returns {IItemRenderer}
        */ 
        public updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer;
        /**
        * 返回可在项呈示器中显示的 String。
        * 若DataGroup被作为SkinnableDataContainer的皮肤组件,此方法将不会执行，被SkinnableDataContainer.itemToLabel()所替代。
        * @method ns_egret.DataGroup#itemToLabel
        * @param item {any}
        * @returns {string}
        */ 
        public itemToLabel(item: any): string;
        /**
        * @method ns_egret.DataGroup#getElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public getElementAt(index: number): IVisualElement;
        /**
        * @method ns_egret.DataGroup#getElementIndex
        * @param element {IVisualElement}
        * @returns {number}
        */
        public getElementIndex(element: IVisualElement): number;
        /**
        * @member ns_egret.DataGroup#numElements
        */
        public numElements : number;
        private static errorStr;
        /**
        * @method ns_egret.DataGroup#addChild
        * @deprecated
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */ 
        public addChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.DataGroup#addChildAt
        * @deprecated
        * @param child {DisplayObject}
        * @param index {number}
        * @returns {DisplayObject}
        */ 
        public addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
        * @method ns_egret.DataGroup#removeChild
        * @deprecated
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */ 
        public removeChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.DataGroup#removeChildAt
        * @deprecated
        * @param index {number}
        * @returns {DisplayObject}
        */ 
        public removeChildAt(index: number): DisplayObject;
        /**
        * @method ns_egret.DataGroup#setChildIndex
        * @deprecated
        * @param child {DisplayObject}
        * @param index {number}
        */ 
        public setChildIndex(child: DisplayObject, index: number): void;
        /**
        * @method ns_egret.DataGroup#swapChildren
        * @deprecated
        * @param child1 {DisplayObject}
        * @param child2 {DisplayObject}
        */ 
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
        * @method ns_egret.DataGroup#swapChildrenAt
        * @deprecated
        * @param index1 {number}
        * @param index2 {number}
        */ 
        public swapChildrenAt(index1: number, index2: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.SkinnableContainer
    * @classdesc
    * 可设置外观的容器的基类
    * @extends ns_egret.SkinnableComponent
    * @implements ns_egret.IVisualElementContainer
    */
    class SkinnableContainer extends SkinnableComponent implements IVisualElementContainer {
        /**
        * @method ns_egret.SkinnableContainer#constructor
        */
        constructor();
        /**
        * [SkinPart]实体容器
        * @member ns_egret.SkinnableContainer#contentGroup
        */
        public contentGroup: Group;
        /**
        * 实体容器实例化之前缓存子对象的容器
        */
        public _placeHolderGroup: Group;
        public a: any;
        /**
        * 获取当前的实体容器
        */
        public _getCurrentContentGroup(): Group;
        /**
        * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
        * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
        */
        public elementsContent : any[];
        /**
        * @member ns_egret.SkinnableContainer#numElements
        */
        public numElements : number;
        /**
        * @method ns_egret.SkinnableContainer#getElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public getElementAt(index: number): IVisualElement;
        /**
        * @method ns_egret.SkinnableContainer#addElement
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public addElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.SkinnableContainer#addElementAt
        * @param element {IVisualElement}
        * @param index {number}
        * @returns {IVisualElement}
        */
        public addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
        * @method ns_egret.SkinnableContainer#removeElement
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public removeElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.SkinnableContainer#removeElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public removeElementAt(index: number): IVisualElement;
        /**
        * @method ns_egret.SkinnableContainer#removeAllElements
        */
        public removeAllElements(): void;
        /**
        * @method ns_egret.SkinnableContainer#getElementIndex
        * @param element {IVisualElement}
        * @returns {number}
        */
        public getElementIndex(element: IVisualElement): number;
        /**
        * @method ns_egret.SkinnableContainer#setElementIndex
        * @param element {IVisualElement}
        * @param index {number}
        */
        public setElementIndex(element: IVisualElement, index: number): void;
        /**
        * @method ns_egret.SkinnableContainer#swapElements
        * @param element1 {IVisualElement}
        * @param element2 {IVisualElement}
        */
        public swapElements(element1: IVisualElement, element2: IVisualElement): void;
        /**
        * @method ns_egret.SkinnableContainer#swapElementsAt
        * @param index1 {number}
        * @param index2 {number}
        */
        public swapElementsAt(index1: number, index2: number): void;
        /**
        * contentGroup发生改变时传递的参数
        */
        private contentGroupProperties;
        /**
        * 此容器的布局对象
        * @member ns_egret.SkinnableContainer#layout
        */
        public layout : LayoutBase;
        /**
        * @method ns_egret.SkinnableContainer#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
        /**
        * @method ns_egret.SkinnableContainer#partRemoved
        * @param partName {string}
        * @param instance {any}
        */
        public partRemoved(partName: string, instance: any): void;
        /**
        * 容器添加元素事件
        * @method ns_egret.SkinnableContainer#_contentGroup_elementAddedHandler
        * @param event {ElementExistenceEvent}
        */
        public _contentGroup_elementAddedHandler(event: ElementExistenceEvent): void;
        /**
        * 容器移除元素事件
        * @method ns_egret.SkinnableContainer#_contentGroup_elementRemovedHandler
        * @param event {ElementExistenceEvent}
        */
        public _contentGroup_elementRemovedHandler(event: ElementExistenceEvent): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.SkinnableDataContainer
    * @classdesc
    * 可设置外观的数据项目容器基类
    * @extends ns_egret.SkinnableComponent
    * @implements ns_egret.IItemRendererOwner
    */
    class SkinnableDataContainer extends SkinnableComponent implements IItemRendererOwner {
        /**
        * 构造函数
        * @method ns_egret.SkinnableDataContainer#constructor
        */ 
        constructor();
        /**
        * @method ns_egret.SkinnableDataContainer#updateRenderer
        * @param renderer {IItemRenderer}
        * @param itemIndex {number}
        * @param data {any}
        * @returns {IItemRenderer}
        */
        public updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer;
        /**
        * 返回可在项呈示器中显示的 String
        * @method ns_egret.SkinnableDataContainer#itemToLabel
        * @param item {any}
        * @returns {string}
        */ 
        public itemToLabel(item: any): string;
        /**
        * [SkinPart]数据项目容器实体
        * @member ns_egret.SkinnableDataContainer#dataGroup
        */ 
        public dataGroup: DataGroup;
        /**
        * dataGroup发生改变时传递的参数
        */ 
        public _dataGroupProperties: any;
        /**
        * 列表数据源，请使用实现了ICollection接口的数据类型，例如ArrayCollection
        * @member ns_egret.SkinnableDataContainer#dataProvider
        */ 
        public dataProvider : ICollection;
        public _getDataProvider(): ICollection;
        public _setDataProvider(value: ICollection): void;
        /**
        * 用于数据项目的项呈示器。该类必须实现 IItemRenderer 接口。 <br/>
        * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
        * @member ns_egret.SkinnableDataContainer#itemRenderer
        */ 
        public itemRenderer : any;
        /**
        * 条目渲染器的可选皮肤标识符。在实例化itemRenderer时，若其内部没有设置过skinName,则将此属性的值赋值给它的skinName。
        * 注意:若itemRenderer不是ISkinnableClient，则此属性无效。
        * @member ns_egret.SkinnableDataContainer#itemRendererSkinName
        */ 
        public itemRendererSkinName : any;
        /**
        * 为某个特定项目返回一个项呈示器Class的函数。 <br/>
        * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。 <br/>
        * 应该定义一个与此示例函数类似的呈示器函数： <br/>
        * function myItemRendererFunction(item:Object):IFactory
        * @member ns_egret.SkinnableDataContainer#itemRendererFunction
        */ 
        public itemRendererFunction : Function;
        /**
        * 布局对象
        * @member ns_egret.SkinnableDataContainer#layout
        */ 
        public layout : LayoutBase;
        public _setLayout(value: LayoutBase): void;
        /**
        * @method ns_egret.SkinnableDataContainer#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
        /**
        * @method ns_egret.SkinnableDataContainer#partRemoved
        * @param partName {string}
        * @param instance {any}
        */
        public partRemoved(partName: string, instance: any): void;
        /**
        * @method ns_egret.SkinnableDataContainer#addEventListener
        * @param type {string}
        * @param listener {Function}
        * @param thisObject {any}
        * @param useCapture {boolean}
        * @param priority {number}
        */
        public addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
        * @method ns_egret.SkinnableDataContainer#removeEventListener
        * @param type {string}
        * @param listener {Function}
        * @param thisObject {any}
        * @param useCapture {boolean}
        */
        public removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IndexChangeEvent
    * @classdesc
    * 索引改变事件
    * @extends ns_egret.Event
    */ 
    class IndexChangeEvent extends Event {
        /**
        * 指示索引已更改
        * @constant ns_egret.IndexChangeEvent.CHANGE
        */ 
        static CHANGE: string;
        /**
        * 指示索引即将更改,可以通过调用preventDefault()方法阻止索引发生更改
        * @constant ns_egret.IndexChangeEvent.CHANGING
        */
        static CHANGING: string;
        /**
        * @method ns_egret.IndexChangeEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        * @param oldIndex {number}
        * @param newIndex {number}
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, oldIndex?: number, newIndex?: number);
        /**
        * 进行更改之后的从零开始的索引。
        * @member ns_egret.IndexChangeEvent#newIndex
        */
        public newIndex: number;
        /**
        * 进行更改之前的从零开始的索引。
        * @member ns_egret.IndexChangeEvent#oldIndex
        */ 
        public oldIndex: number;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.IndexChangeEvent.dispatchIndexChangeEvent
        */
        static dispatchIndexChangeEvent(target: IEventDispatcher, type: string, oldIndex?: number, newIndex?: number, cancelable?: boolean): boolean;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ListEvent
    * @classdesc
    * 列表事件
    * @extends ns_egret.TouchEvent
    */ 
    class ListEvent extends TouchEvent {
        /**
        * 指示用户执行了将鼠标指针从控件中某个项呈示器上移开的操作
        * @constant ns_egret.ListEvent.ITEM_ROLL_OUT
        */ 
        static ITEM_ROLL_OUT: string;
        /**
        * 指示用户执行了将鼠标指针滑过控件中某个项呈示器的操作。
        * @constant ns_egret.ListEvent.ITEM_ROLL_OVER
        */
        static ITEM_ROLL_OVER: string;
        /**
        * 指示用户执行了将鼠标在某个项呈示器上单击的操作。
        * @constant ns_egret.ListEvent.ITEM_CLICK
        */ 
        static ITEM_CLICK: string;
        /**
        * @method ns_egret.ListEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        * @param touchPointID {number}
        * @param stageX {number}
        * @param stageY {number}
        * @param ctrlKey {boolean}
        * @param altKey {boolean}
        * @param shiftKey {boolean}
        * @param buttonDown {boolean}
        * @param itemIndex {number}
        * @param item {any}
        * @param itemRenderer {IItemRenderer}
        */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, touchPointID?: number, stageX?: number, stageY?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, buttonDown?: boolean, itemIndex?: number, item?: any, itemRenderer?: IItemRenderer);
        /**
        * 触发鼠标事件的项呈示器数据源项。
        * @member ns_egret.ListEvent#item
        */
        public item: any;
        /**
        * 触发鼠标事件的项呈示器。
        * @member ns_egret.ListEvent#itemRenderer
        */ 
        public itemRenderer: IItemRenderer;
        /**
        * 触发鼠标事件的项索引
        * @member ns_egret.ListEvent#itemIndex
        */ 
        public itemIndex: number;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.ListEvent.dispatchListEvent
        */
        static dispatchListEvent(target: IEventDispatcher, type: string, touchEvent?: TouchEvent, itemIndex?: number, item?: any, itemRenderer?: IItemRenderer): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ListBase
    * @classdesc
    * 支持选择内容的所有组件的基类。
    * @extends ns_egret.SkinnableDataContainer
    */
    class ListBase extends SkinnableDataContainer {
        /**
        * 未选中任何项时的索引值
        * @constant ns_egret.ListBase.NO_SELECTION
        */ 
        static NO_SELECTION: number;
        /**
        * 未设置缓存选中项的值
        * @constant ns_egret.ListBase.NO_PROPOSED_SELECTION
        */
        static NO_PROPOSED_SELECTION: number;
        /**
        * 自定义的选中项
        * @constant ns_egret.ListBase.CUSTOM_SELECTED_ITEM
        */ 
        static CUSTOM_SELECTED_ITEM: number;
        /**
        * @method ns_egret.ListBase#constructor
        */
        constructor();
        /**
        * 正在进行所有数据源的刷新操作
        * @member ns_egret.ListBase#_doingWholesaleChanges
        */ 
        public _doingWholesaleChanges: boolean;
        private dataProviderChanged;
        public _setDataProvider(value: any): void;
        /**
        * 布局对象
        * @member ns_egret.ListBase#layout
        */
        /**
        * @inheritDoc
        */
        public layout : LayoutBase;
        private _labelField;
        private labelFieldOrFunctionChanged;
        /**
        * 数据项如果是一个对象，此属性为数据项中用来显示标签文字的字段名称。
        * 若设置了labelFunction，则设置此属性无效。
        * @member ns_egret.ListBase#labelField
        */ 
        public labelField : string;
        public _setLabelField(value: string): void;
        private _labelFunction;
        /**
        * 用户提供的函数，在每个项目上运行以确定其标签。
        * 示例：function labelFunc(item:Object):String 。
        * @member ns_egret.ListBase#labelFunction
        */ 
        public labelFunction : Function;
        public _setLabelFunction(value: Function): void;
        public _requireSelection: boolean;
        private requireSelectionChanged;
        /**
        * 如果为 true，则必须始终在控件中选中数据项目。<br/>
        * 如果该值为 true，则始终将 selectedIndex 属性设置为 0 和 (dataProvider.length - 1) 之间的一个值。
        * @member ns_egret.ListBase#requireSelection
        */ 
        public requireSelection : boolean;
        public _setRequireSelection(value: boolean): void;
        /**
        * 在属性提交前缓存真实的选中项的值
        */
        public _proposedSelectedIndex: number;
        public _selectedIndex: number;
        /**
        * 选中项目的基于 0 的索引。<br/>
        * 或者如果未选中项目，则为-1。设置 selectedIndex 属性会取消选择当前选定的项目并选择指定索引位置的数据项目。 <br/>
        * 当用户通过与控件交互来更改 selectedIndex 属性时，此控件将分派 change 和 changing 事件。<br/>
        * 当以编程方式更改 selectedIndex 属性的值时，此控件不分派 change 和 changing 事件。
        * @member ns_egret.ListBase#selectedIndex
        */ 
        public selectedIndex : number;
        public _getSelectedIndex(): number;
        /**
        * 是否允许自定义的选中项
        * @member ns_egret.ListBase#_allowCustomSelectedItem
        */ 
        public _allowCustomSelectedItem: boolean;
        /**
        * 索引改变后是否需要抛出事件
        * @member ns_egret.ListBase#_dispatchChangeAfterSelection
        */ 
        public _dispatchChangeAfterSelection: boolean;
        /**
        * 设置选中项
        */
        public _setSelectedIndex(value: number, dispatchChangeEvent?: boolean): void;
        /**
        *  在属性提交前缓存真实选中项的数据源
        */
        public _pendingSelectedItem: any;
        private _selectedItem;
        /**
        * 当前已选中的项目。设置此属性会取消选中当前选定的项目并选择新指定的项目。<br/>
        * 当用户通过与控件交互来更改 selectedItem 属性时，此控件将分派 change 和 changing 事件。<br/>
        * 当以编程方式更改 selectedItem 属性的值时，此控件不分派 change 和 changing 事件。
        * @member ns_egret.ListBase#selectedItem
        */ 
        public selectedItem : any;
        /**
        * 设置选中项数据源
        * @method ns_egret.ListBase#_setSelectedItem
        * @param value {any}
        * @param dispatchChangeEvent {boolean}
        */
        public _setSelectedItem(value: any, dispatchChangeEvent?: boolean): void;
        private _useVirtualLayout;
        /**
        * 是否使用虚拟布局,默认flase
        * @member ns_egret.ListBase#useVirtualLayout
        */
        public useVirtualLayout : boolean;
        public _getUseVirtualLayout(): boolean;
        public _setUseVirtualLayout(value: boolean): void;
        /**
        * @method ns_egret.ListBase#commitProperties
        */
        public commitProperties(): void;
        /**
        *  更新项呈示器文字标签
        */
        private updateRendererLabelProperty(itemIndex);
        /**
        * @method ns_egret.ListBase#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
        /**
        * @method ns_egret.ListBase#partRemoved
        * @param partName {string}
        * @param instance {any}
        */
        public partRemoved(partName: string, instance: any): void;
        /**
        * @method ns_egret.ListBase#updateRenderer
        * @param renderer {IItemRenderer}
        * @param itemIndex {number}
        * @param data {any}
        * @returns {IItemRenderer}
        */
        public updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer;
        /**
        * @method ns_egret.ListBase#itemToLabel
        * @param item {any}
        * @returns {string}
        */
        public itemToLabel(item: any): string;
        /**
        * 选中或取消选中项目时调用。子类必须覆盖此方法才可设置选中项。
        * @method ns_egret.ListBase#itemSelected
        * @param index {number} 已选中的项目索引。
        * @param selected {boolean} true为选中，false取消选中
        */ 
        public itemSelected(index: number, selected: boolean): void;
        /**
        * 返回指定索引是否等于当前选中索引
        */
        public _isItemIndexSelected(index: number): boolean;
        /**
        * 提交选中项属性，返回是否成功提交，false表示被取消
        * @method ns_egret.ListBase#commitSelection
        * @param dispatchChangedEvents {boolean}
        * @returns {boolean}
        */ 
        public commitSelection(dispatchChangedEvents?: boolean): boolean;
        private selectedIndexAdjusted;
        /**
        * 仅调整选中索引值而不更新选中项,即在提交属性阶段itemSelected方法不会被调用，也不会触发changing和change事件。
        * @method ns_egret.ListBase#adjustSelection
        * @param newIndex {number} 新索引。
        * @param add {boolean} 如果已将项目添加到组件，则为 true；如果已删除项目，则为 false。
        */ 
        public adjustSelection(newIndex: number, add?: boolean): void;
        /**
        * 数据项添加
        * @method ns_egret.ListBase#itemAdded
        * @param index {number}
        */
        public itemAdded(index: number): void;
        /**
        * 数据项移除
        * @method ns_egret.ListBase#itemRemoved
        * @param index {number}
        */
        public itemRemoved(index: number): void;
        /**
        * 项呈示器被添加
        * @method ns_egret.ListBase#dataGroup_rendererAddHandler
        * @param event {RendererExistenceEvent}
        */
        public dataGroup_rendererAddHandler(event: RendererExistenceEvent): void;
        /**
        * 项呈示器被移除
        * @method ns_egret.ListBase#dataGroup_rendererRemoveHandler
        * @param event {RendererExistenceEvent}
        */ 
        public dataGroup_rendererRemoveHandler(event: RendererExistenceEvent): void;
        private static TYPE_MAP;
        /**
        * 项呈示器鼠标事件
        */ 
        private item_mouseEventHandler(event);
        /**
        * 抛出列表事件
        * @method ns_egret.ListBase#_dispatchListEvent
        * @param touchEvent {TouchEvent} 相关联的鼠标事件
        * @param type {string} 事件名称
        * @param itemRenderer {IItemRenderer} 关联的条目渲染器实例
        */ 
        public _dispatchListEvent(touchEvent: TouchEvent, type: string, itemRenderer: IItemRenderer): void;
        /**
        * 数据源发生改变
        * @method ns_egret.ListBase#dataProvider_collectionChangeHandler
        * @param event {CollectionEvent}
        */
        public dataProvider_collectionChangeHandler(event: CollectionEvent): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Panel
    * @classdesc
    * 带有标题，内容区域的面板组件
    * @extends ns_egret.SkinnableContainer
    */ 
    class Panel extends SkinnableContainer {
        /**
        * 构造函数
        * @method ns_egret.Panel#constructor
        */
        constructor();
        /**
        * [SkinPart]标题显示对象
        * @member ns_egret.Panel#titleDisplay
        */
        public titleDisplay: IDisplayText;
        private _title;
        /**
        * 标题内容改变
        */
        private titleChanged;
        /**
        * 标题文本内容
        * @member ns_egret.Panel#title
        */
        public title : string;
        /**
        * @method ns_egret.Panel#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.CloseEvent
    * @classdesc
    * 窗口关闭事件
    * @extends ns_egret.Event
    */ 
    class CloseEvent extends Event {
        /**
        * @constant ns_egret.CloseEvent.CLOSE
        */
        static CLOSE: string;
        /**
        * 构造函数
        * @method ns_egret.CloseEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        * @param detail {any}
        */ 
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, detail?: any);
        /**
        * 触发关闭事件的细节。某些窗口组件用此属性来区分窗口中被点击的按钮。
        * @member ns_egret.CloseEvent#detail
        */ 
        public detail: any;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.CloseEvent.dispatchCloseEvent
        */
        static dispatchCloseEvent(target: IEventDispatcher, type: string, detail?: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.PopUpEvent
    * @classdesc
    * 弹出管理器事件
    * @extends ns_egret.Event
    */
    class PopUpEvent extends Event {
        /**
        * 添加一个弹出框，在执行完添加之后抛出。
        * @constant ns_egret.PopUpEvent.ADD_POPUP
        */ 
        static ADD_POPUP: string;
        /**
        * 移除一个弹出框，在执行完移除之后抛出。
        * @constant ns_egret.PopUpEvent.REMOVE_POPUP
        */ 
        static REMOVE_POPUP: string;
        /**
        * 移动弹出框到最前，在执行完前置之后抛出。
        * @constant ns_egret.PopUpEvent.BRING_TO_FRONT
        */ 
        static BRING_TO_FRONT: string;
        /**
        * 构造函数
        * @method ns_egret.PopUpEvent#constructor
        * @param type {string}
        * @param bubbles {boolean}
        * @param cancelable {boolean}
        * @param popUp {IVisualElement}
        * @param modal {boolean}
        */ 
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, popUp?: IVisualElement, modal?: boolean);
        /**
        * 弹出框对象
        * @member ns_egret.PopUpEvent#popUp
        */ 
        public popUp: IVisualElement;
        /**
        * 弹出窗口是否为模态，此属性仅在事件类型为ADD_POPUP时有效。
        * @member ns_egret.PopUpEvent#modal
        */ 
        public modal: boolean;
        /**
        * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
        * @method ns_egret.PopUpEvent.dispatchPopUpEvent
        */
        static dispatchPopUpEvent(target: IEventDispatcher, type: string, popUp?: IVisualElement, modal?: boolean): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.IPopUpManager
    * @interface
    * @classdesc
    * 窗口弹出管理器接口。若项目需要自定义弹出框管理器，请实现此接口，
    * 并在项目初始化前调用Injector.mapClass("ns_egret.IPopUpManager",YourPopUpManager)，
    * 注入自定义的弹出框管理器类。
    * @extends ns_egret.IEventDispatcher
    */
    interface IPopUpManager extends IEventDispatcher {
        /**
        * 模态遮罩的填充颜色
        * @member ns_egret.IPopUpManager#modalColor
        */
        modalColor: number;
        /**
        * 模态遮罩的透明度
        * @member ns_egret.IPopUpManager#modalAlpha
        */
        modalAlpha: number;
        /**
        * 弹出一个窗口。<br/>
        * @method ns_egret.IPopUpManager#addPopUp
        * @param popUp {IVisualElement} 要弹出的窗口
        * @param modal? {boolean} 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
        * @param center? {boolean} 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
        */ 
        addPopUp(popUp: IVisualElement, modal?: boolean, center?: boolean): void;
        /**
        * 移除由addPopUp()方法弹出的窗口。
        * @method ns_egret.IPopUpManager#removePopUp
        * @param popUp {IVisualElement} 要移除的窗口
        */ 
        removePopUp(popUp: IVisualElement): void;
        /**
        * 将指定窗口居中显示
        * @method ns_egret.IPopUpManager#centerPopUp
        * @param popUp {IVisualElement} 要居中显示的窗口
        */
        centerPopUp(popUp: IVisualElement): void;
        /**
        * 将指定窗口的层级调至最前
        * @method ns_egret.IPopUpManager#bringToFront
        * @param popUp {IVisualElement} 要最前显示的窗口
        */ 
        bringToFront(popUp: IVisualElement): void;
        /**
        * 已经弹出的窗口列表
        * @member ns_egret.IPopUpManager#popUpList
        */ 
        popUpList: any[];
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.PopUpManagerImpl
    * @classdesc
    * 窗口弹出管理器实现类
    * @extends ns_egret.EventDispatcher
    * @implements ns_egret.IPopUpManager
    */
    class PopUpManagerImpl extends EventDispatcher implements IPopUpManager {
        /**
        * 构造函数
        * @method ns_egret.PopUpManagerImpl#constructor
        */
        constructor();
        private _popUpList;
        /**
        * 已经弹出的窗口列表
        * @member ns_egret.PopUpManagerImpl#popUpList
        */
        public popUpList : any[];
        /**
        * 模态窗口列表
        */
        private popUpDataList;
        /**
        * 根据popUp获取对应的popUpData
        */
        private findPopUpData(popUp);
        private static REMOVE_FROM_SYSTEMMANAGER;
        /**
        * 弹出一个窗口。<br/>
        * @method ns_egret.PopUpManagerImpl#addPopUp
        * @param popUp {IVisualElement} 要弹出的窗口
        * @param modal {boolean} 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
        * @param center {boolean} 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
        */
        public addPopUp(popUp: IVisualElement, modal?: boolean, center?: boolean): void;
        /**
        * 从舞台移除
        */
        private onRemoved(event);
        private _modalColor;
        /**
        * 模态遮罩的填充颜色
        * @member ns_egret.PopUpManagerImpl#modalColor
        */
        public modalColor : number;
        private _modalAlpha;
        /**
        * 模态遮罩的透明度
        * @member ns_egret.PopUpManagerImpl#modalAlpha
        */
        public modalAlpha : number;
        private invalidateModalFlag;
        /**
        * 标记一个SystemManager的模态层失效
        */
        private invalidateModal();
        private validateModal(event);
        private modalMask;
        /**
        * 更新窗口模态效果
        */
        private updateModal(systemManager);
        /**
        * 移除由addPopUp()方法弹出的窗口。
        * @method ns_egret.PopUpManagerImpl#removePopUp
        * @param popUp {IVisualElement} 要移除的窗口
        */
        public removePopUp(popUp: IVisualElement): void;
        /**
        * 将指定窗口居中显示
        * @method ns_egret.PopUpManagerImpl#centerPopUp
        * @param popUp {IVisualElement} 要居中显示的窗口
        */
        public centerPopUp(popUp: IVisualElement): void;
        /**
        * 将指定窗口的层级调至最前
        * @method ns_egret.PopUpManagerImpl#bringToFront
        * @param popUp {IVisualElement} 要最前显示的窗口
        */
        public bringToFront(popUp: IVisualElement): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.PopUpManager
    * @classdesc
    * 窗口弹出管理器<p/>
    * 若项目需要自定义弹出框管理器，请实现IPopUpManager接口，
    * 并在项目初始化前调用Injector.mapClass("ns_egret.IPopUpManager",YourPopUpManager)，
    * 注入自定义的弹出框管理器类。
    */ 
    class PopUpManager {
        /**
        * 构造函数
        * @method ns_egret.PopUpManager#constructor
        */ 
        constructor();
        private static _impl;
        /**
        * 获取单例
        */ 
        private static getImpl();
        /**
        * 模态遮罩的填充颜色
        * @member ns_egret.PopUpManager#modalColor
        */
        public modalColor : number;
        /**
        * 模态遮罩的透明度
        * @member ns_egret.PopUpManager#modalAlpha
        */
        public modalAlpha : number;
        /**
        * 弹出一个窗口。<br/>
        * @method ns_egret.PopUpManager.addPopUp
        * @param popUp {IVisualElement} 要弹出的窗口
        * @param modal {boolean} 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
        * @param center {boolean} 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
        */ 
        static addPopUp(popUp: IVisualElement, modal?: boolean, center?: boolean): void;
        /**
        * 移除由addPopUp()方法弹出的窗口。
        * @method ns_egret.PopUpManager.removePopUp
        * @param popUp {IVisualElement} 要移除的窗口
        */ 
        static removePopUp(popUp: IVisualElement): void;
        /**
        * 将指定窗口居中显示
        * @method ns_egret.PopUpManager.centerPopUp
        * @param popUp {IVisualElement} 要居中显示的窗口
        */
        static centerPopUp(popUp: IVisualElement): void;
        /**
        * 将指定窗口的层级调至最前
        * @method ns_egret.PopUpManager.bringToFront
        * @param popUp {IVisualElement} 要最前显示的窗口
        */ 
        static bringToFront(popUp: IVisualElement): void;
        /**
        * 已经弹出的窗口列表
        * @member ns_egret.PopUpManager.popUpList
        */ 
        static popUpList : any[];
        /**
        * 添加事件监听,参考PopUpEvent定义的常量。
        * @method ns_egret.PopUpManager.addEventListener
        * @see org.flexlite.domUI.events.PopUpEvent
        * @param type {string}
        * @param listener {Function}
        * @param thisObject {any}
        * @param useCapture {boolean}
        * @param priority {number}
        */ 
        static addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
        * 移除事件监听,参考PopUpEvent定义的常量。
        * @method ns_egret.PopUpManager.removeEventListener
        * @see org.flexlite.domUI.events.PopUpEvent
        * @param type {string}
        * @param listener {Function}
        * @param thisObject {any}
        * @param useCapture {boolean}
        */ 
        static removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.LayoutUtil
    * @classdesc
    * 布局工具类
    */
    class LayoutUtil {
        /**
        * 根据对象当前的xy坐标调整其相对位置属性，使其在下一次的父级布局中过程中保持当前位置不变。
        * @method ns_egret.LayoutUtil.adjustRelativeByXY
        * @param element {IVisualElement} 要调整相对位置属性的对象
        * @param parent {DisplayObjectContainer} element的父级容器。若不设置，则取element.parent的值。若两者的值都为空，则放弃调整。
        */ 
        static adjustRelativeByXY(element: IVisualElement, parent?: DisplayObjectContainer): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.TitleWindow
    * @classdesc
    * 可移动窗口组件。注意，此窗口必须使用PopUpManager.addPopUp()弹出之后才能移动。
    * @extends ns_egret.Panel
    */
    class TitleWindow extends Panel {
        /**
        * @method ns_egret.TitleWindow#constructor
        */
        constructor();
        /**
        * 在窗体上按下时前置窗口
        */ 
        private onWindowMouseDown(event);
        /**
        * [SkinPart]关闭按钮
        * @member ns_egret.TitleWindow#closeButton
        */ 
        public closeButton: Button;
        /**
        * [SkinPart]可移动区域
        * @member ns_egret.TitleWindow#moveArea
        */ 
        public moveArea: DisplayObject;
        private _showCloseButton;
        /**
        * 是否显示关闭按钮,默认true。
        * @member ns_egret.TitleWindow#showCloseButton
        */
        public showCloseButton : boolean;
        private _autoBackToStage;
        /**
        * 在拖拽窗口时，有可能把窗口完全拖出屏幕外，导致无法点中moveArea而不能拖回屏幕。
        * 此属性为true时，将会在拖拽结束时，自动调整窗口位置，使moveArea可以被再次点中。
        * 反之不调整。默认值为true。
        * @member ns_egret.TitleWindow#autoBackToStage
        */
        public autoBackToStage : boolean;
        /**
        * @method ns_egret.TitleWindow#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
        /**
        * @method ns_egret.TitleWindow#partRemoved
        * @param partName {string}
        * @param instance {any}
        */
        public partRemoved(partName: string, instance: any): void;
        /**
        * @method ns_egret.TitleWindow#closeButton_clickHandler
        * @param event {TouchEvent}
        */
        public closeButton_clickHandler(event: TouchEvent): void;
        /**
        * 鼠标按下时的偏移量
        */ 
        private _offsetPointX;
        private _offsetPointY;
        /**
        * 鼠标在可移动区域按下
        * @method ns_egret.TitleWindow#moveArea_mouseDownHandler
        * @param event {TouchEvent}
        */ 
        public moveArea_mouseDownHandler(event: TouchEvent): void;
        /**
        * 鼠标拖拽时的移动事件
        * @method ns_egret.TitleWindow#moveArea_mouseMoveHandler
        * @param event {TouchEvent}
        */ 
        public moveArea_mouseMoveHandler(event: TouchEvent): void;
        /**
        * 鼠标在舞台上弹起事件
        * @method ns_egret.TitleWindow#moveArea_mouseUpHandler
        * @param event {Event}
        */ 
        public moveArea_mouseUpHandler(event: Event): void;
        /**
        * 调整窗口位置，使其可以在舞台中被点中
        */ 
        private adjustPosForStage();
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Alert
    * @classdesc
    * 弹出对话框，可能包含消息、标题、按钮（“确定”、“取消”、“是”和“否”的任意组合)。
    * @extends ns_egret.TitleWindow
    */
    class Alert extends TitleWindow {
        /**
        * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为firstButton。
        * @constant ns_egret.Alert.FIRST_BUTTON
        */ 
        static FIRST_BUTTON: string;
        /**
        * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为secondButton。
        * @constant ns_egret.Alert.SECOND_BUTTON
        */ 
        static SECOND_BUTTON: string;
        /**
        * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为closeButton。
        * @constant ns_egret.Alert.CLOSE_BUTTON
        */ 
        static CLOSE_BUTTON: string;
        /**
        * 弹出Alert控件的静态方法。在Alert控件中选择一个按钮，将关闭该控件。
        * @method ns_egret.Alert.show
        * @param text {string} 要显示的文本内容字符串。
        * @param title {string} 对话框标题
        * @param closeHandler {Function} 按下Alert控件上的任意按钮时的回调函数。示例:closeHandler(event:CloseEvent);
        * event的detail属性包含 Alert.FIRST_BUTTON、Alert.SECOND_BUTTON和Alert.CLOSE_BUTTON。
        * @param firstButtonLabel {string} 第一个按钮上显示的文本。
        * @param secondButtonLabel {string} 第二个按钮上显示的文本，若为null，则不显示第二个按钮。
        * @param modal {boolean} 是否启用模态。即禁用弹出框以下的鼠标事件。默认true。
        * @param center {boolean} 是否居中。默认true。
        * @returns {Alert}
        */ 
        static show(text?: string, title?: string, closeHandler?: Function, firstButtonLabel?: string, secondButtonLabel?: string, modal?: boolean, center?: boolean): Alert;
        /**
        * 构造函数，请通过静态方法Alert.show()来创建对象实例。
        * @method ns_egret.Alert#constructor
        */ 
        constructor();
        private _firstButtonLabel;
        /**
        * 第一个按钮上显示的文本
        * @member ns_egret.Alert#firstButtonLabel
        */
        public firstButtonLabel : string;
        private _secondButtonLabel;
        /**
        * 第二个按钮上显示的文本
        * @member ns_egret.Alert#secondButtonLabel
        */
        public secondButtonLabel : string;
        private _contentText;
        /**
        * 文本内容
        * @member ns_egret.Alert#contentText
        */
        public contentText : string;
        /**
        * 对话框关闭回调函数
        */
        private closeHandler;
        /**
        * 关闭事件
        */ 
        private onClose(event);
        /**
        * @method ns_egret.Alert#closeButton_clickHandler
        * @param event {TouchEvent}
        */
        public closeButton_clickHandler(event: TouchEvent): void;
        /**
        * [SkinPart]文本内容显示对象
        * @member ns_egret.Alert#contentDisplay
        */ 
        public contentDisplay: IDisplayText;
        /**
        * [SkinPart]第一个按钮，通常是"确定"。
        * @member ns_egret.Alert#firstButton
        */ 
        public firstButton: Button;
        /**
        * [SkinPart]第二个按钮，通常是"取消"。
        * @member ns_egret.Alert#secondButton
        */ 
        public secondButton: Button;
        /**
        * @method ns_egret.Alert#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
        /**
        * @method ns_egret.Alert#partRemoved
        * @param partName {string}
        * @param instance {any}
        */ 
        public partRemoved(partName: string, instance: any): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.ProgressBarDirection
    * @classdesc
    * 定义进度条控件增长方向的常量
    */
    class ProgressBarDirection {
        /**
        * 水平从左到右增长
        * @constant ns_egret.ProgressBarDirection.LEFT_TO_RIGHT
        */ 
        static LEFT_TO_RIGHT: string;
        /**
        * 水平从右到左增长
        * @constant ns_egret.ProgressBarDirection.RIGHT_TO_LEFT
        */ 
        static RIGHT_TO_LEFT: string;
        /**
        * 竖直从上到下增长
        * @constant ns_egret.ProgressBarDirection.TOP_TO_BOTTOM
        */ 
        static TOP_TO_BOTTOM: string;
        /**
        * 竖直从下到上增长
        * @constant ns_egret.ProgressBarDirection.BOTTOM_TO_TOP
        */ 
        static BOTTOM_TO_TOP: string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.ProgressBar
    * @classdesc
    * 进度条控件。
    * @extends ns_egret.Range
    */
    class ProgressBar extends Range {
        /**
        * @method ns_egret.ProgressBar#constructor
        */
        constructor();
        /**
        * [SkinPart]进度高亮显示对象。
        * @member ns_egret.ProgressBar#thumb
        */
        public thumb: DisplayObject;
        /**
        * [SkinPart]轨道显示对象，用于确定thumb要覆盖的区域。
        * @member ns_egret.ProgressBar#track
        */
        public track: DisplayObject;
        /**
        * [SkinPart]进度条文本
        * @member ns_egret.ProgressBar#labelDisplay
        */
        public labelDisplay: Label;
        private _labelFunction;
        /**
        * 进度条文本格式化回调函数。示例：labelFunction(value:Number,maximum:Number):String;
        * @member ns_egret.ProgressBar#labelFunction
        */
        public labelFunction : Function;
        /**
        * 将当前value转换成文本
        * @method ns_egret.ProgressBar#valueToLabel
        * @param value {number}
        * @param maximum {number}
        * @returns {string}
        */
        public valueToLabel(value: number, maximum: number): string;
        private _slideDuration;
        /**
        * value改变时调整thumb长度的缓动动画时间，单位毫秒。设置为0则不执行缓动。默认值500。
        * @member ns_egret.ProgressBar#slideDuration
        */
        public slideDuration : number;
        private _direction;
        /**
        * 进度条增长方向。请使用ProgressBarDirection定义的常量。默认值：ProgressBarDirection.LEFT_TO_RIGHT。
        * @member ns_egret.ProgressBar#direction
        */
        public direction : string;
        /**
        * 动画实例
        */
        private animator;
        /**
        * 动画播放结束时要到达的value。
        */
        private slideToValue;
        /**
        * 进度条的当前值。
        * 注意：当组件添加到显示列表后，若slideDuration不为0。设置此属性，并不会立即应用。而是作为目标值，开启缓动动画缓慢接近。
        * 若需要立即重置属性，请先设置slideDuration为0，或者把组件从显示列表移除。
        * @member ns_egret.ProgressBar#value
        */
        public value : number;
        /**
        * 动画播放更新数值
        */
        private animationUpdateHandler(animation);
        /**
        * @method ns_egret.ProgressBar#setValue
        * @param value {number}
        */
        public setValue(value: number): void;
        /**
        * @method ns_egret.ProgressBar#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
        * @method ns_egret.ProgressBar#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
        /**
        * @method ns_egret.ProgressBar#partRemoved
        * @param partName {string}
        * @param instance {any}
        */
        public partRemoved(partName: string, instance: any): void;
        private trackResizedOrMoved;
        /**
        * track的位置或尺寸发生改变
        */
        private onTrackResizeOrMove(event);
        /**
        * @method ns_egret.ProgressBar#commitProperties
        */
        public commitProperties(): void;
        /**
        * 更新皮肤部件大小和可见性。
        * @method ns_egret.ProgressBar#updateSkinDisplayList
        */
        public updateSkinDisplayList(): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.HSlider
    * @classdesc
    * 水平滑块控件
    * @extends ns_egret.SliderBase
    */ 
    class HSlider extends SliderBase {
        /**
        * 构造函数
        * @method ns_egret.HSlider#constructor
        */ 
        constructor();
        /**
        * @method ns_egret.HSlider#pointToValue
        * @param x {number}
        * @param y {number}
        * @returns {number}
        */
        public pointToValue(x: number, y: number): number;
        /**
        * @method ns_egret.HSlider#updateSkinDisplayList
        */
        public updateSkinDisplayList(): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.VSlider
    * @classdesc
    * 垂直滑块控件
    * @extends ns_egret.SliderBase
    */
    class VSlider extends SliderBase {
        /**
        * 构造函数
        * @method ns_egret.VSlider#constructor
        */ 
        constructor();
        /**
        * @method ns_egret.VSlider#pointToValue
        * @param x {number}
        * @param y {number}
        * @returns {number}
        */
        public pointToValue(x: number, y: number): number;
        /**
        * @method ns_egret.VSlider#updateSkinDisplayList
        */
        public updateSkinDisplayList(): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.List
    * @classdesc
    * 列表组件
    * @extends ns_egret.ListBase
    */
    class List extends ListBase {
        /**
        * @method ns_egret.List#constructor
        */
        constructor();
        /**
        * @method ns_egret.List#createChildren
        */
        public createChildren(): void;
        /**
        * 是否使用虚拟布局,默认true
        * @member ns_egret.List#useVirtualLayout
        */ /**
        * @inheritDoc
        */
        public useVirtualLayout : boolean;
        private _allowMultipleSelection;
        /**
        * 是否允许同时选中多项
        * @member ns_egret.List#allowMultipleSelection
        */
        public allowMultipleSelection : boolean;
        private _selectedIndices;
        private _proposedSelectedIndices;
        /**
        * 当前选中的一个或多个项目的索引列表
        * @member ns_egret.List#selectedIndices
        */ 
        public selectedIndices : number[];
        /**
        * @member ns_egret.List#selectedIndex
        */
        public selectedIndex : number;
        /**
        * 当前选中的一个或多个项目的数据源列表
        * @member ns_egret.List#selectedItems
        */ 
        public selectedItems : Object[];
        /**
        * 设置多个选中项
        */
        public _setSelectedIndices(value: number[], dispatchChangeEvent?: boolean): void;
        /**
        * @method ns_egret.List#commitProperties
        */
        public commitProperties(): void;
        /**
        * @method ns_egret.List#commitSelection
        * @param dispatchChangedEvents {boolean}
        * @returns {boolean}
        */
        public commitSelection(dispatchChangedEvents?: boolean): boolean;
        /**
        * 是否是有效的索引
        */
        private isValidIndex(item, index, v);
        /**
        * 提交多项选中项属性
        * @method ns_egret.List#commitMultipleSelection
        */
        public commitMultipleSelection(): void;
        public _isItemIndexSelected(index: number): boolean;
        /**
        * @method ns_egret.List#dataGroup_rendererAddHandler
        * @param event {RendererExistenceEvent}
        */
        public dataGroup_rendererAddHandler(event: RendererExistenceEvent): void;
        /**
        * @method ns_egret.List#dataGroup_rendererRemoveHandler
        * @param event {RendererExistenceEvent}
        */
        public dataGroup_rendererRemoveHandler(event: RendererExistenceEvent): void;
        /**
        * 是否捕获ItemRenderer以便在MouseUp时抛出ItemClick事件
        */
        public _captureItemRenderer: boolean;
        private mouseDownItemRenderer;
        /**
        * 鼠标在项呈示器上按下
        * @method ns_egret.List#item_mouseDownHandler
        * @param event {TouchEvent}
        */
        public item_mouseDownHandler(event: TouchEvent): void;
        /**
        * 计算当前的选中项列表
        */
        private calculateSelectedIndices(index, shiftKey, ctrlKey);
        /**
        * 鼠标在项呈示器上弹起，抛出ItemClick事件。
        */ 
        private item_mouseUpHandler(event);
        /**
        * 鼠标在舞台上弹起
        */ 
        private stage_mouseUpHandler(event);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.PopUpAnchor
    * @classdesc
    * PopUpAnchor组件用于定位布局中的弹出控件或下拉控件
    * @extends ns_egret.UIComponent
    */ 
    class PopUpAnchor extends UIComponent {
        /**
        * 构造函数
        * @method ns_egret.PopUpAnchor#constructor
        */ 
        constructor();
        /**
        * popUp已经弹出的标志
        */ 
        private popUpIsDisplayed;
        /**
        * 自身已经添加到舞台标志
        */ 
        private addedToStage;
        private _popUpHeightMatchesAnchorHeight;
        /**
        * 如果为 true，则将popUp控件的高度设置为 PopUpAnchor的高度值。
        * @member ns_egret.PopUpAnchor#popUpHeightMatchesAnchorHeight
        */
        public popUpHeightMatchesAnchorHeight : boolean;
        private _popUpWidthMatchesAnchorWidth;
        /**
        * 如果为true，则将popUp控件的宽度设置为PopUpAnchor的宽度值。
        * @member ns_egret.PopUpAnchor#popUpWidthMatchesAnchorWidth
        */ 
        public popUpWidthMatchesAnchorWidth : boolean;
        private _displayPopUp;
        /**
        * 如果为 true，则将popUp对象弹出。若为false，关闭弹出的popUp。
        * @member ns_egret.PopUpAnchor#displayPopUp
        */ 
        public displayPopUp : boolean;
        private _popUp;
        /**
        * 要弹出或移除的目标显示对象。
        * @member ns_egret.PopUpAnchor#popUp
        */ 
        public popUp : IVisualElement;
        private _popUpPosition;
        /**
        * popUp相对于PopUpAnchor的弹出位置。请使用PopUpPosition里定义的常量。默认值TOP_LEFT。
        * @see org.flexlite.domUI.core.PopUpPosition
        * @member ns_egret.PopUpAnchor#popUpPosition
        */ 
        public popUpPosition : string;
        /**
        * @method ns_egret.PopUpAnchor#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
        * 手动刷新popUp的弹出位置和尺寸。
        * @method ns_egret.PopUpAnchor#updatePopUpTransform
        */ 
        public updatePopUpTransform(): void;
        /**
        * 计算popUp的弹出位置
        */ 
        private calculatePopUpPosition();
        /**
        * 正在播放动画的标志
        */ 
        private inAnimation;
        /**
        * 动画类实例
        */
        private animator;
        private _openDuration;
        /**
        * 窗口弹出的动画时间(以毫秒为单位)，设置为0则直接弹出窗口而不播放动画效果。默认值250。
        * @member ns_egret.PopUpAnchor#openDuration
        */
        public openDuration : number;
        private _closeDuration;
        /**
        * 窗口关闭的动画时间(以毫秒为单位)，设置为0则直接关闭窗口而不播放动画效果。默认值150。
        * @member ns_egret.PopUpAnchor#closeDuration
        */
        public closeDuration : number;
        /**
        * 动画开始播放触发的函数
        */ 
        private animationStartHandler(animation);
        /**
        * 动画播放过程中触发的更新数值函数
        */ 
        private animationUpdateHandler(animation);
        /**
        * 动画播放完成触发的函数
        */ 
        private animationEndHandler(animation);
        /**
        * 添加或移除popUp
        */ 
        private addOrRemovePopUp();
        /**
        * 移除并重置popUp
        */ 
        private removeAndResetPopUp();
        /**
        * 对popUp应用尺寸和位置调整
        */ 
        private applyPopUpTransform(unscaledWidth, unscaledHeight);
        /**
        * 开始播放动画
        */ 
        private startAnimation();
        private valueRange;
        /**
        * 创建动画轨迹
        */ 
        private createMotionPath();
        /**
        * 添加到舞台事件
        */ 
        private addedToStageHandler(event);
        /**
        * 延迟检查弹出状态，防止堆栈溢出。
        */ 
        private checkPopUpState();
        /**
        * 从舞台移除事件
        */ 
        private removedFromStageHandler(event);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.DropDownController
    * @classdesc
    * 用于处理因用户交互而打开和关闭下拉列表的操作的控制器
    * @extends ns_egret.EventDispatcher
    */ 
    class DropDownController extends EventDispatcher {
        /**
        * 构造函数
        * @method ns_egret.DropDownController#constructor
        */ 
        constructor();
        /**
        * 鼠标按下标志
        */ 
        private mouseIsDown;
        private _openButton;
        /**
        * 下拉按钮实例
        * @member ns_egret.DropDownController#openButton
        */ 
        public openButton : ButtonBase;
        /**
        * 要考虑作为下拉列表的点击区域的一部分的显示对象列表。
        * 在包含项列出的任何组件内进行鼠标单击不会自动关闭下拉列表。
        * @member ns_egret.DropDownController#hitAreaAdditions
        */ 
        public hitAreaAdditions: DisplayObject[];
        private _dropDown;
        /**
        * 下拉区域显示对象
        * @member ns_egret.DropDownController#dropDown
        */ 
        public dropDown : DisplayObject;
        private _isOpen;
        /**
        * 下拉列表已经打开的标志
        * @member ns_egret.DropDownController#isOpen
        */ 
        public isOpen : boolean;
        private _closeOnResize;
        /**
        * 如果为 true，则在调整舞台大小时会关闭下拉列表。
        * @member ns_egret.DropDownController#closeOnResize
        */ 
        public closeOnResize : boolean;
        private _rollOverOpenDelay;
        private rollOverOpenDelayTimer;
        /**
        * 指定滑过锚点按钮时打开下拉列表要等待的延迟（以毫秒为单位）。
        * 如果设置为 NaN，则下拉列表会在单击时打开，而不是在滑过时打开。默认值NaN
        * @member ns_egret.DropDownController#rollOverOpenDelay
        */ 
        public rollOverOpenDelay : number;
        /**
        * 添加触发下拉列表打开的事件监听
        */ 
        private addOpenTriggers();
        /**
        * 移除触发下拉列表打开的事件监听
        */ 
        private removeOpenTriggers();
        /**
        * 添加触发下拉列表关闭的事件监听
        */ 
        private addCloseTriggers();
        /**
        * 移除触发下拉列表关闭的事件监听
        */ 
        private removeCloseTriggers();
        /**
        * 添加舞台尺寸改变的事件监听
        */ 
        private addCloseOnResizeTrigger();
        /**
        * 移除舞台尺寸改变的事件监听
        */
        private removeCloseOnResizeTrigger();
        /**
        * 检查鼠标是否在DropDown或者openButton区域内。
        */ 
        private isTargetOverDropDownOrOpenButton(target);
        /**
        * 打开下拉列表
        * @method ns_egret.DropDownController#openDropDown
        */ 
        public openDropDown(): void;
        /**
        * 执行打开下拉列表
        */ 
        private openDropDownHelper();
        /**
        * 关闭下拉列表
        * @method ns_egret.DropDownController#closeDropDown
        * @param commit {boolean}
        */ 
        public closeDropDown(commit: boolean): void;
        /**
        * openButton上按下鼠标事件
        * @method ns_egret.DropDownController#_openButton_buttonDownHandler
        * @param event {Event}
        */ 
        public _openButton_buttonDownHandler(event: Event): void;
        /**
        * openButton上鼠标经过事件
        * @method ns_egret.DropDownController#_openButton_rollOverHandler
        * @param event {TouchEvent}
        */ 
        public _openButton_rollOverHandler(event: TouchEvent): void;
        /**
        * openButton上鼠标移出事件
        */ 
        private openButton_rollOutHandler(event);
        /**
        * 到达鼠标移入等待延迟打开的时间。
        */ 
        private rollOverDelay_timerCompleteHandler(event);
        /**
        * 舞台上鼠标按下事件
        * @method ns_egret.DropDownController#stage_mouseDownHandler
        * @param event {Event}
        */ 
        public stage_mouseDownHandler(event: Event): void;
        /**
        * 舞台上鼠标移动事件
        * @method ns_egret.DropDownController#stage_mouseMoveHandler
        * @param event {Event}
        */ 
        public stage_mouseMoveHandler(event: Event): void;
        /**
        * 舞台上鼠标弹起事件
        * @method ns_egret.DropDownController#stage_mouseUpHandler_noRollOverOpenDelay
        * @param event {Event}
        */ 
        public stage_mouseUpHandler_noRollOverOpenDelay(event: Event): void;
        /**
        * 舞台上鼠标弹起事件
        * @method ns_egret.DropDownController#stage_mouseUpHandler
        * @param event {Event}
        */ 
        public stage_mouseUpHandler(event: Event): void;
        /**
        * 舞台尺寸改变事件
        * @method ns_egret.DropDownController#stage_resizeHandler
        * @param event {Event}
        */ 
        public stage_resizeHandler(event: Event): void;
        /**
        * 舞台上鼠标滚轮事件
        */ 
        private stage_mouseWheelHandler(event);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.DropDownListBase
    * @classdesc
    * 下拉列表控件基类
    * @extends ns_egret.List
    */ 
    class DropDownListBase extends List {
        /**
        * 构造函数
        * @method ns_egret.DropDownListBase#constructor
        */ 
        constructor();
        /**
        * [SkinPart]下拉区域显示对象
        * @member ns_egret.DropDownListBase#dropDown
        */ 
        public dropDown: DisplayObject;
        /**
        * [SkinPart]下拉触发按钮
        * @member ns_egret.DropDownListBase#openButton
        */ 
        public openButton: ButtonBase;
        /**
        * @constant ns_egret.DropDownListBase.PAGE_SIZE
        */
        static PAGE_SIZE: number;
        /**
        * 文本改变标志
        */ 
        public _labelChanged: boolean;
        /**
        * @inheritDoc
        */
        public _setDataProvider(value: ICollection): void;
        /**
        * @inheritDoc
        */
        public _setLabelField(value: string): void;
        /**
        * @inheritDoc
        */
        public _setLabelFunction(value: Function): void;
        private _dropDownController;
        /**
        * 下拉控制器
        * @member ns_egret.DropDownListBase#dropDownController
        */ 
        public dropDownController : DropDownController;
        /**
        * 下拉列表是否已经已打开
        * @member ns_egret.DropDownListBase#isDropDownOpen
        */ 
        public isDropDownOpen : boolean;
        private _userProposedSelectedIndex;
        /**
        * @method ns_egret.DropDownListBase#commitProperties
        */
        public commitProperties(): void;
        /**
        * @method ns_egret.DropDownListBase#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
        /**
        * @method ns_egret.DropDownListBase#partRemoved
        * @param partName {string}
        * @param instance {any}
        */
        public partRemoved(partName: string, instance: any): void;
        /**
        * @method ns_egret.DropDownListBase#getCurrentSkinState
        * @returns {string}
        */
        public getCurrentSkinState(): string;
        /**
        * @method ns_egret.DropDownListBase#commitSelection
        * @param dispatchChangedEvents {boolean}
        * @returns {boolean}
        */
        public commitSelection(dispatchChangedEvents?: boolean): boolean;
        /**
        * @method ns_egret.DropDownListBase#_isItemIndexSelected
        * @param index {number}
        * @returns {boolean}
        */
        public _isItemIndexSelected(index: number): boolean;
        /**
        * 打开下拉列表并抛出UIEvent.OPEN事件。
        * @method ns_egret.DropDownListBase#openDropDown
        */ 
        public openDropDown(): void;
        /**
        * 关闭下拉列表并抛出UIEvent.CLOSE事件。
        * @method ns_egret.DropDownListBase#closeDropDown
        * @param commit {boolean}
        */ 
        public closeDropDown(commit: boolean): void;
        /**
        * 更新选中项的提示文本
        * @method ns_egret.DropDownListBase#updateLabelDisplay
        * @param displayItem {any}
        */ 
        public updateLabelDisplay(displayItem?: any): void;
        /**
        * 改变高亮的选中项
        * @method ns_egret.DropDownListBase#_changeHighlightedSelection
        * @param newIndex {number}
        * @param scrollToTop {boolean}
        */ 
        public _changeHighlightedSelection(newIndex: number, scrollToTop?: boolean): void;
        /**
        * @method ns_egret.DropDownListBase#dataProvider_collectionChangeHandler
        * @param event {CollectionEvent}
        */
        public dataProvider_collectionChangeHandler(event: CollectionEvent): void;
        /**
        * @method ns_egret.DropDownListBase#item_mouseDownHandler
        * @param event {TouchEvent}
        */
        public item_mouseDownHandler(event: TouchEvent): void;
        /**
        * 控制器抛出打开列表事件
        * @method ns_egret.DropDownListBase#_dropDownController_openHandler
        * @param event {UIEvent}
        */ 
        public _dropDownController_openHandler(event: UIEvent): void;
        /**
        * 打开列表后组件一次失效验证全部完成
        * @method ns_egret.DropDownListBase#_open_updateCompleteHandler
        * @param event {UIEvent}
        */ 
        public _open_updateCompleteHandler(event: UIEvent): void;
        /**
        * 控制器抛出关闭列表事件
        * @method ns_egret.DropDownListBase#dropDownController_closeHandler
        * @param event {UIEvent}
        */ 
        public dropDownController_closeHandler(event: UIEvent): void;
        /**
        * 关闭列表后组件一次失效验证全部完成
        */ 
        private close_updateCompleteHandler(event);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Tree
    * @classdesc
    * 树状列表组件
    * @extends ns_egret.List
    */
    class Tree extends List {
        /**
        * 构造函数
        * @method ns_egret.Tree#constructor
        */ 
        constructor();
        /**
        * @method ns_egret.Tree#createChildren
        */
        public createChildren(): void;
        /**
        * @method ns_egret.Tree#updateRenderer
        * @param renderer {IItemRenderer}
        * @param itemIndex {number}
        * @param data {any}
        * @returns {IItemRenderer}
        */
        public updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer;
        /**
        * 根据数据项返回项呈示器中图标的skinName属性值
        * @method ns_egret.Tree#itemToIcon
        * @param data {any}
        * @returns {any}
        */ 
        public itemToIcon(data: any): any;
        /**
        * @method ns_egret.Tree#dataGroup_rendererAddHandler
        * @param event {RendererExistenceEvent}
        */
        public dataGroup_rendererAddHandler(event: RendererExistenceEvent): void;
        /**
        * 节点即将打开
        */ 
        private onItemOpening(event);
        /**
        * @method ns_egret.Tree#dataGroup_rendererRemoveHandler
        * @param event {RendererExistenceEvent}
        */
        public dataGroup_rendererRemoveHandler(event: RendererExistenceEvent): void;
        /**
        * 图标字段或函数改变标志
        */ 
        private iconFieldOrFunctionChanged;
        private _iconField;
        /**
        * 数据项中用来确定图标skinName属性值的字段名称。另请参考UIAsset.skinName。
        * 若设置了iconFunction，则设置此属性无效。
        * @member ns_egret.Tree#iconField
        */ 
        public iconField : string;
        private _iconFunction;
        /**
        * 用户提供的函数，在每个数据项目上运行以确定其图标的skinName值。另请参考UIAsset.skinName。
        * 示例：iconFunction(item:Object):Object
        * @member ns_egret.Tree#iconFunction
        */ 
        public iconFunction : Function;
        /**
        * 打开或关闭一个节点,注意，此操作不会抛出open或close事件。
        * @method ns_egret.Tree#expandItem
        * @param item {any} 要打开或关闭的节点
        * @param open {boolean} true表示打开节点，反之关闭。
        */ 
        public expandItem(item: any, open?: boolean): void;
        /**
        * 指定的节点是否打开
        * @method ns_egret.Tree#isItemOpen
        * @param item {any}
        * @returns {boolean}
        */ 
        public isItemOpen(item: any): boolean;
        /**
        * @method ns_egret.Tree#dataProvider_collectionChangeHandler
        * @param event {CollectionEvent}
        */
        public dataProvider_collectionChangeHandler(event: CollectionEvent): void;
        /**
        * @method ns_egret.Tree#commitProperties
        */
        public commitProperties(): void;
        /**
        * 更新指定索引项的图标
        */ 
        private updateRendererIconProperty(itemIndex);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.DropDownList
    * @classdesc
    * 不可输入的下拉列表控件。带输入功能的下拉列表控件，请使用ComboBox。
    * @see org.flexlite.domUI.components.ComboBox
    * @extends ns_egret.DropDownListBase
    */ 
    class DropDownList extends DropDownListBase {
        /**
        * 构造函数
        * @method ns_egret.DropDownList#constructor
        */ 
        constructor();
        /**
        * [SkinPart]选中项文本
        * @member ns_egret.DropDownList#labelDisplay
        */ 
        public labelDisplay: IDisplayText;
        private _prompt;
        /**
        * 当没有选中项时在DropDownList上要显示的字符串。<p/>
        * 它通常是一个类似于“请选择一项...”的文本。当下拉列表中的某个项目被选中后，会被替换为该选定项目中的文本。
        * @member ns_egret.DropDownList#prompt
        */ 
        public prompt : string;
        /**
        * @method ns_egret.DropDownList#partAdded
        * @param partName {string}
        * @param instance {any}
        */
        public partAdded(partName: string, instance: any): void;
        /**
        * @method ns_egret.DropDownList#updateLabelDisplay
        * @param displayItem {any}
        */
        public updateLabelDisplay(displayItem?: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.TabBarButton
    * @classdesc
    * 选项卡组件的按钮条目
    * @extends ns_egret.ToggleButtonBase
    * @implements ns_egret.IItemRenderer
    */ 
    class TabBarButton extends ToggleButtonBase implements IItemRenderer {
        /**
        * @method ns_egret.TabBarButton#constructor
        */
        constructor();
        private _allowDeselection;
        /**
        * 如果为 true，用户单击当前选定的按钮时即会将其取消选择。
        * 如果为 false，用户必须选择不同的按钮才可取消选择当前选定的按钮。
        * @member ns_egret.TabBarButton#allowDeselection
        */ 
        public allowDeselection : boolean;
        private _data;
        /**
        * @member ns_egret.TabBarButton#data
        */
        public data : any;
        private _itemIndex;
        /**
        * @member ns_egret.TabBarButton#itemIndex
        */
        public itemIndex : number;
        /**
        * @inheritDoc
        */
        public _setLabel(value: string): void;
        /**
        * @method ns_egret.TabBarButton#buttonReleased
        */
        public buttonReleased(): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.TabBar
    * @classdesc
    * 选项卡组件
    * @extends ns_egret.ListBase
    */ 
    class TabBar extends ListBase {
        /**
        * 构造函数
        * @method ns_egret.TabBar#constructor
        */ 
        constructor();
        /**
        * requireSelection改变标志
        */
        private requireSelectionChanged_tabBar;
        /**
        * @method ns_egret.TabBar#c
        * @param value {boolea}
        */
        public c(value: boolean): void;
        /**
        * @inheritDoc
        */
        public _setDataProvider(value: ICollection): void;
        /**
        * 鼠标点击的选中项改变
        */ 
        private onIndexChanged(event);
        /**
        * ViewStack选中项发生改变
        */ 
        private onViewStackIndexChange(event);
        /**
        * @method ns_egret.TabBar#commitProperties
        */
        public commitProperties(): void;
        /**
        * @method ns_egret.TabBar#dataGroup_rendererAddHandler
        * @param event {RendererExistenceEvent}
        */
        public dataGroup_rendererAddHandler(event: RendererExistenceEvent): void;
        /**
        * @method ns_egret.TabBar#dataGroup_rendererRemoveHandler
        * @param event {RendererExistenceEvent}
        */
        public dataGroup_rendererRemoveHandler(event: RendererExistenceEvent): void;
        /**
        * 鼠标在条目上按下
        */ 
        private item_clickHandler(event);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.Scroller
    * @classdesc
    * 滚动条组件
    * @extends ns_egret.UIComponent
    * @implements ns_egret.IVisualElementContainer
    */ 
    class Scroller extends UIComponent implements IVisualElementContainer {
        /**
        * 构造函数
        * @method ns_egret.Scroller#constructor
        */
        constructor();
        /**
        * @method ns_egret.Scroller#measure
        */
        public measure(): void;
        /**
        * @method ns_egret.Scroller#updateDisplayList
        * @param unscaledWidth {number}
        * @param unscaledHeight {number}
        */
        public updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        private _verticalScrollPolicy;
        /**
        * 垂直滚动条显示策略，参见ScrollPolicy类定义的常量。
        * @member ns_egret.Scroller#verticalScrollPolicy
        */
        public verticalScrollPolicy : string;
        private _horizontalScrollPolicy;
        /**
        * 水平滚动条显示策略，参见ScrollPolicy类定义的常量。
        * @member ns_egret.Scroller#horizontalScrollPolicy
        */
        public horizontalScrollPolicy : string;
        private _viewport;
        /**
        * 要滚动的视域组件。
        * @member ns_egret.Scroller#viewport
        */
        public viewport : IViewport;
        /**
        * 安装并初始化视域组件
        */
        private installViewport();
        /**
        * 卸载视域组件
        */
        private uninstallViewport();
        /**
        * 鼠标按下时的偏移量
        */
        private _offsetPointX;
        private _offsetPointY;
        private _horizontalCanScroll;
        private _verticalCanScroll;
        private checkScrollPolicy();
        private onTouchBegan(event);
        private onTouchMove(event);
        private onTouchEnd(event);
        private static VELOCITY_WEIGHTS;
        private static easeOut(ratio);
        private _previousTouchTime;
        private _velocityX;
        private _velocityY;
        private _previousVelocityX;
        private _previousVelocityY;
        private _currentTouchX;
        private _currentTouchY;
        private _previousTouchX;
        private _previousTouchY;
        public _startTouchX: number;
        public _startTouchY: number;
        public _startHorizontalScrollPosition: number;
        public _startVerticalScrollPosition: number;
        private enterFrameHandler(event);
        private checkHorizontalScrollPosition();
        private checkVerticalScrollPosition();
        private static animationData;
        private getAnimationDatas(pixelsPerMS, curPos, maxPos);
        /**
        * 停止触摸时继续滚动的动画实例
        */
        private horizontalAnimator;
        private finishScrollingHorizontally(animation?);
        /**
        * 缓动到水平滚动位置
        * @method ns_egret.Scroller#throwHorizontally
        * @param hspTo {number}
        * @param duration {number}
        */
        public throwHorizontally(hspTo: number, duration?: number): void;
        /**
        * 更新水平滚动位置
        */
        private horizontalUpdateHandler(animation);
        /**
        * 滚动回正确位置的动画实例
        */
        private verticalAnimator;
        private finishScrollingVertically(animation?);
        /**
        * 缓动到垂直滚动位置
        * @method ns_egret.Scroller#throwVertically
        * @param vspTo {number}
        * @param duration {number}
        */
        public throwVertically(vspTo: number, duration?: number): void;
        /**
        * 更新垂直滚动位置
        */
        private verticalUpdateHandler(animation);
        /**
        * @member ns_egret.Scroller#numElements
        */
        public numElements : number;
        /**
        * 抛出索引越界异常
        */
        private throwRangeError(index);
        /**
        * @method ns_egret.Scroller#getElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public getElementAt(index: number): IVisualElement;
        /**
        * @method ns_egret.Scroller#getElementIndex
        * @param element {IVisualElement}
        * @returns {number}
        */
        public getElementIndex(element: IVisualElement): number;
        /**
        * @method ns_egret.Scroller#containsElement
        * @param element {IVisualElement}
        * @returns {boolean}
        */
        public containsElement(element: IVisualElement): boolean;
        private throwNotSupportedError();
        /**
        * @method ns_egret.Scroller#addElement
        * @deprecated
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public addElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.Scroller#addElementAt
        * @deprecated
        * @param element {IVisualElement}
        * @param index {number}
        * @returns {IVisualElement}
        */
        public addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
        * @method ns_egret.Scroller#removeElement
        * @deprecated
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public removeElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.Scroller#removeElementAt
        * @deprecated
        * @param index {number}
        * @returns {IVisualElement}
        */
        public removeElementAt(index: number): IVisualElement;
        /**
        * @method ns_egret.Scroller#removeAllElements
        * @deprecated
        */
        public removeAllElements(): void;
        /**
        * @method ns_egret.Scroller#setElementIndex
        * @deprecated
        * @param element {IVisualElement}
        * @param index {number}
        */
        public setElementIndex(element: IVisualElement, index: number): void;
        /**
        * @method ns_egret.Scroller#swapElements
        * @deprecated
        * @param element1 {IVisualElement}
        * @param element2 {IVisualElement}
        */
        public swapElements(element1: IVisualElement, element2: IVisualElement): void;
        /**
        * @method ns_egret.Scroller#swapElementsAt
        * @deprecated
        * @param index1 {number}
        * @param index2 {number}
        */
        public swapElementsAt(index1: number, index2: number): void;
        /**
        * @method ns_egret.Scroller#addChild
        * @deprecated
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */
        public addChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.Scroller#addChildAt
        * @deprecated
        * @param child {DisplayObject}
        * @param index {number}
        * @returns {DisplayObject}
        */
        public addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
        * @method ns_egret.Scroller#removeChild
        * @deprecated
        * @param child {DisplayObject}
        * @returns {DisplayObject}
        */
        public removeChild(child: DisplayObject): DisplayObject;
        /**
        * @method ns_egret.Scroller#removeChildAt
        * @deprecated
        * @param index {number}
        * @returns {DisplayObject}
        */
        public removeChildAt(index: number): DisplayObject;
        /**
        * @method ns_egret.Scroller#setChildIndex
        * @deprecated
        * @param child {DisplayObject}
        * @param index {number}
        */
        public setChildIndex(child: DisplayObject, index: number): void;
        /**
        * @method ns_egret.Scroller#swapChildren
        * @deprecated
        * @param child1 {DisplayObject}
        * @param child2 {DisplayObject}
        */
        public swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
        * @method ns_egret.Scroller#swapChildrenAt
        * @deprecated
        * @param index1 {number}
        * @param index2 {number}
        */
        public swapChildrenAt(index1: number, index2: number): void;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.ColumnAlign
    * @classdesc
    * ColumnAlign 类为 TileLayout 类的 columnAlign 属性定义可能的值。
    */
    class ColumnAlign {
        /**
        * 不将行两端对齐。
        * @constant ns_egret.ColumnAlign.LEFT
        */ 
        static LEFT: string;
        /**
        * 通过增大水平间隙将行两端对齐。
        * @constant ns_egret.ColumnAlign.JUSTIFY_USING_GAP
        */
        static JUSTIFY_USING_GAP: string;
        /**
        * 通过增大行高度将行两端对齐。
        * @constant ns_egret.ColumnAlign.JUSTIFY_USING_WIDTH
        */ 
        static JUSTIFY_USING_WIDTH: string;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.RowAlign
    * @classdesc
    * RowAlign 类为 TileLayout 类的 rowAlign 属性定义可能的值。
    */
    class RowAlign {
        /**
        * 不进行两端对齐。
        * @constant ns_egret.RowAlign.TOP
        */
        static TOP: string;
        /**
        * 通过增大垂直间隙将行两端对齐。
        * @constant ns_egret.RowAlign.JUSTIFY_USING_GAP
        */ 
        static JUSTIFY_USING_GAP: string;
        /**
        * 通过增大行高度将行两端对齐。
        * @constant ns_egret.RowAlign.JUSTIFY_USING_HEIGHT
        */
        static JUSTIFY_USING_HEIGHT: string;
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module ns_egret {
    /**
    * @class ns_egret.TileOrientation
    * @classdesc
    * TileOrientation 类为 TileLayout 类的 orientation 属性定义可能的值。
    */
    class TileOrientation {
        /**
        * 逐行排列元素。
        * @constant ns_egret.TileOrientation.ROWS
        */ 
        static ROWS: string;
        /**
        * 逐列排列元素。
        * @constant ns_egret.TileOrientation.COLUMNS
        */
        static COLUMNS: string;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.HorizontalLayout
    * @classdesc
    * 水平布局
    * @extends ns_egret.LayoutBase
    */
    class HorizontalLayout extends LayoutBase {
        /**
        * @method ns_egret.HorizontalLayout#constructor
        */
        constructor();
        private _horizontalAlign;
        /**
        * 布局元素的水平对齐策略。参考HorizontalAlign定义的常量。
        * 注意：此属性设置为CONTENT_JUSTIFY始终无效。当useVirtualLayout为true时，设置JUSTIFY也无效。
        * @member ns_egret.HorizontalLayout#horizontalAlign
        */
        public horizontalAlign : string;
        private _verticalAlign;
        /**
        * 布局元素的竖直对齐策略。参考VerticalAlign定义的常量。
        * @member ns_egret.HorizontalLayout#verticalAlign
        */
        public verticalAlign : string;
        private _gap;
        /**
        * 布局元素之间的水平空间（以像素为单位）
        * @member ns_egret.HorizontalLayout#gap
        */
        public gap : number;
        private _padding;
        /**
        * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
        * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
        * @member ns_egret.HorizontalLayout#padding
        */
        public padding : number;
        private _paddingLeft;
        /**
        * 容器的左边缘与布局元素的左边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.HorizontalLayout#paddingLeft
        */
        public paddingLeft : number;
        private _paddingRight;
        /**
        * 容器的右边缘与布局元素的右边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.HorizontalLayout#paddingRight
        */
        public paddingRight : number;
        private _paddingTop;
        /**
        * 容器的顶边缘与第一个布局元素的顶边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.HorizontalLayout#paddingTop
        */
        public paddingTop : number;
        private _paddingBottom;
        /**
        * 容器的底边缘与最后一个布局元素的底边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.HorizontalLayout#paddingBottom
        */
        public paddingBottom : number;
        /**
        * 标记目标容器的尺寸和显示列表失效
        */ 
        private invalidateTargetSizeAndDisplayList();
        /**
        * @method ns_egret.HorizontalLayout#measure
        */
        public measure(): void;
        /**
        * 测量使用虚拟布局的尺寸
        */ 
        private measureVirtual();
        /**
        * 测量使用真实布局的尺寸
        */ 
        private measureReal();
        /**
        * @method ns_egret.HorizontalLayout#updateDisplayList
        * @param width {number}
        * @param height {number}
        */
        public updateDisplayList(width: number, height: number): void;
        /**
        * 虚拟布局使用的子对象尺寸缓存
        */ 
        private elementSizeTable;
        /**
        * 获取指定索引的起始位置
        */ 
        private getStartPosition(index);
        /**
        * 获取指定索引的元素尺寸
        */ 
        private getElementSize(index);
        /**
        * 获取缓存的子对象尺寸总和
        */ 
        private getElementTotalSize();
        /**
        * @method ns_egret.HorizontalLayout#elementAdded
        * @param index {number}
        */
        public elementAdded(index: number): void;
        /**
        * @method ns_egret.HorizontalLayout#elementRemoved
        * @param index {number}
        */
        public elementRemoved(index: number): void;
        /**
        * @method ns_egret.HorizontalLayout#clearVirtualLayoutCache
        */
        public clearVirtualLayoutCache(): void;
        /**
        * 折半查找法寻找指定位置的显示对象索引
        */ 
        private findIndexAt(x, i0, i1);
        /**
        * 虚拟布局使用的当前视图中的第一个元素索引
        */ 
        private startIndex;
        /**
        * 虚拟布局使用的当前视图中的最后一个元素的索引
        */ 
        private endIndex;
        /**
        * 视图的第一个和最后一个元素的索引值已经计算好的标志
        */ 
        private indexInViewCalculated;
        /**
        * @method ns_egret.HorizontalLayout#scrollPositionChanged
        */
        public scrollPositionChanged(): void;
        /**
        * 获取视图中第一个和最后一个元素的索引,返回是否发生改变
        */ 
        private getIndexInView();
        /**
        * 子对象最大宽度
        */ 
        private maxElementHeight;
        /**
        * 更新使用虚拟布局的显示列表
        */ 
        private updateDisplayListVirtual(width, height);
        /**
        * 更新使用真实布局的显示列表
        */ 
        private updateDisplayListReal(width, height);
        /**
        * 为每个可变尺寸的子项分配空白区域
        * @method ns_egret.HorizontalLayout.flexChildrenProportionally
        * @param spaceForChildren {number}
        * @param spaceToDistribute {number}
        * @param totalPercent {number}
        * @param childInfoArray {Array<any>}
        */ 
        static flexChildrenProportionally(spaceForChildren: number, spaceToDistribute: number, totalPercent: number, childInfoArray: any[]): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.TileLayout
    * @classdesc
    * 格子布局
    * @extends ns_egret.LayoutBase
    */
    class TileLayout extends LayoutBase {
        /**
        * 构造函数
        * @method ns_egret.TileLayout#constructor
        */ 
        constructor();
        /**
        * 标记horizontalGap被显式指定过
        */
        private explicitHorizontalGap;
        private _horizontalGap;
        /**
        * 列之间的水平空间（以像素为单位）。
        * @member ns_egret.TileLayout#horizontalGap
        */ 
        public horizontalGap : number;
        /**
        * 标记verticalGap被显式指定过
        */ 
        private explicitVerticalGap;
        private _verticalGap;
        /**
        * 行之间的垂直空间（以像素为单位）。
        * @member ns_egret.TileLayout#verticalGap
        */ 
        public verticalGap : number;
        private _columnCount;
        /**
        * 实际列计数。
        * @member ns_egret.TileLayout#columnCount
        */ 
        public columnCount : number;
        private _requestedColumnCount;
        /**
        * 要显示的列数。设置为0表示自动确定列计数,默认值0。<br/>
        * 注意:当orientation为TileOrientation.COLUMNS(逐列排列元素)且taget被显式设置宽度时，此属性无效。
        * @member ns_egret.TileLayout#requestedColumnCount
        */
        public requestedColumnCount : number;
        private _rowCount;
        /**
        * 实际行计数。
        * @member ns_egret.TileLayout#rowCount
        */ 
        public rowCount : number;
        private _requestedRowCount;
        /**
        * 要显示的行数。设置为0表示自动确定行计数,默认值0。<br/>
        * 注意:当orientation为TileOrientation.ROWS(即逐行排列元素,此为默认值)且target被显式设置高度时，此属性无效。
        * @member ns_egret.TileLayout#requestedRowCount
        */
        public requestedRowCount : number;
        /**
        * 外部显式指定的列宽
        */
        private explicitColumnWidth;
        private _columnWidth;
        /**
        * 实际列宽（以像素为单位）。 若未显式设置，则从根据最宽的元素的宽度确定列宽度。
        * @member ns_egret.TileLayout#columnWidth
        */ /**
        *  @private
        */
        public columnWidth : number;
        /**
        * 外部显式指定的行高
        */ 
        private explicitRowHeight;
        private _rowHeight;
        /**
        * 行高（以像素为单位）。 如果未显式设置，则从元素的高度的最大值确定行高度。
        * @member ns_egret.TileLayout#rowHeight
        */ /**
        *  @private
        */
        public rowHeight : number;
        private _padding;
        /**
        * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
        * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
        * @member ns_egret.TileLayout#padding
        */
        public padding : number;
        private _paddingLeft;
        /**
        * 容器的左边缘与布局元素的左边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.TileLayout#paddingLeft
        */
        public paddingLeft : number;
        private _paddingRight;
        /**
        * 容器的右边缘与布局元素的右边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.TileLayout#paddingRight
        */
        public paddingRight : number;
        private _paddingTop;
        /**
        * 容器的顶边缘与第一个布局元素的顶边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.TileLayout#paddingTop
        */
        public paddingTop : number;
        private _paddingBottom;
        /**
        * 容器的底边缘与最后一个布局元素的底边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
        * @member ns_egret.TileLayout#paddingBottom
        */
        public paddingBottom : number;
        private _horizontalAlign;
        /**
        * 指定如何在水平方向上对齐单元格内的元素。
        * 支持的值有 HorizontalAlign.LEFT、HorizontalAlign.CENTER、
        * HorizontalAlign.RIGHT、HorizontalAlign.JUSTIFY。
        * 默认值：HorizontalAlign.JUSTIFY
        * @member ns_egret.TileLayout#horizontalAlign
        */ 
        public horizontalAlign : string;
        private _verticalAlign;
        /**
        * 指定如何在垂直方向上对齐单元格内的元素。
        * 支持的值有 VerticalAlign.TOP、VerticalAlign.MIDDLE、
        * VerticalAlign.BOTTOM、VerticalAlign.JUSTIFY。
        * 默认值：VerticalAlign.JUSTIFY。
        * @member ns_egret.TileLayout#verticalAlign
        */ 
        public verticalAlign : string;
        private _columnAlign;
        /**
        * 指定如何将完全可见列与容器宽度对齐。
        * 设置为 ColumnAlign.LEFT 时，它会关闭列两端对齐。在容器的最后一列和右边缘之间可能存在部分可见的列或空白。这是默认值。
        * 设置为 ColumnAlign.JUSTIFY_USING_GAP 时，horizontalGap 的实际值将增大，
        * 这样最后一个完全可见列右边缘会与容器的右边缘对齐。仅存在一个完全可见列时，
        * horizontalGap 的实际值将增大，这样它会将任何部分可见列推到容器的右边缘之外。
        * 请注意显式设置 horizontalGap 属性不会关闭两端对齐。它仅确定初始间隙值。两端对齐可能会增大它。
        * 设置为 ColumnAlign.JUSTIFY_USING_WIDTH 时，columnWidth 的实际值将增大，
        * 这样最后一个完全可见列右边缘会与容器的右边缘对齐。请注意显式设置 columnWidth 属性不会关闭两端对齐。
        * 它仅确定初始列宽度值。两端对齐可能会增大它。
        * @member ns_egret.TileLayout#columnAlign
        */ 
        public columnAlign : string;
        private _rowAlign;
        /**
        * @member ns_egret.TileLayout#rowAlign
        */
        /**
        * 指定如何将完全可见行与容器高度对齐。
        * 设置为 RowAlign.TOP 时，它会关闭列两端对齐。在容器的最后一行和底边缘之间可能存在部分可见的行或空白。这是默认值。
        *
        * 设置为 RowAlign.JUSTIFY_USING_GAP 时，verticalGap 的实际值会增大，
        * 这样最后一个完全可见行底边缘会与容器的底边缘对齐。仅存在一个完全可见行时，verticalGap 的值会增大，
        * 这样它会将任何部分可见行推到容器的底边缘之外。请注意，显式设置 verticalGap
        * 不会关闭两端对齐，而只是确定初始间隙值。两端对齐接着可以增大它。
        *
        * 设置为 RowAlign.JUSTIFY_USING_HEIGHT 时，rowHeight 的实际值会增大，
        * 这样最后一个完全可见行底边缘会与容器的底边缘对齐。请注意，显式设置 rowHeight
        * 不会关闭两端对齐，而只是确定初始行高度值。两端对齐接着可以增大它。
        */ 
        public rowAlign : string;
        private _orientation;
        /**
        * 指定是逐行还是逐列排列元素。
        * @member ns_egret.TileLayout#orientation
        */ 
        public orientation : string;
        /**
        * 标记目标容器的尺寸和显示列表失效
        */ 
        private invalidateTargetSizeAndDisplayList();
        /**
        * @method ns_egret.TileLayout#measure
        */
        public measure(): void;
        /**
        * 计算行和列的尺寸及数量
        */ 
        private calculateRowAndColumn(explicitWidth, explicitHeight);
        /**
        * 缓存的最大子对象宽度
        */ 
        private maxElementWidth;
        /**
        * 缓存的最大子对象高度
        */ 
        private maxElementHeight;
        /**
        * 更新最大子对象尺寸
        */ 
        private updateMaxElementSize();
        /**
        * 更新虚拟布局的最大子对象尺寸
        */ 
        private updateMaxElementSizeVirtual();
        /**
        * 更新真实布局的最大子对象尺寸
        */ 
        private updateMaxElementSizeReal();
        /**
        * @method ns_egret.TileLayout#clearVirtualLayoutCache
        */
        public clearVirtualLayoutCache(): void;
        /**
        * 当前视图中的第一个元素索引
        */ 
        private startIndex;
        /**
        * 当前视图中的最后一个元素的索引
        */ 
        private endIndex;
        /**
        * 视图的第一个和最后一个元素的索引值已经计算好的标志
        */ 
        private indexInViewCalculated;
        /**
        * @method ns_egret.TileLayout#scrollPositionChanged
        */
        public scrollPositionChanged(): void;
        /**
        * 获取视图中第一个和最后一个元素的索引,返回是否发生改变
        */ 
        private getIndexInView();
        /**
        * @method ns_egret.TileLayout#updateDisplayList
        * @param width {number}
        * @param height {number}
        */
        public updateDisplayList(width: number, height: number): void;
        /**
        * 为单个元素布局
        */ 
        private sizeAndPositionElement(element, cellX, cellY, cellWidth, cellHeight);
        /**
        * 为两端对齐调整间隔或格子尺寸
        */ 
        private adjustForJustify(width, height);
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.SystemContainer
    * @classdesc
    * SystemManager的虚拟子容器
    * @implements ns_egret.IContainer
    */
    class SystemContainer implements IContainer {
        /**
        * 构造函数
        * @method ns_egret.SystemContainer#constructor
        * @param owner {ISystemManager}
        * @param lowerBoundReference {string}
        * @param upperBoundReference {strin}
        */ 
        constructor(owner: ISystemManager, lowerBoundReference: string, upperBoundReference: string);
        /**
        * 实体容器
        */ 
        private owner;
        /**
        * 容器下边界属性
        */ 
        private lowerBoundReference;
        /**
        * 容器上边界属性
        */ 
        private upperBoundReference;
        /**
        * @member ns_egret.SystemContainer#numElements
        */
        public numElements : number;
        private raw_getElementAt;
        private raw_addElementAt;
        private raw_getElementIndex;
        private raw_removeElement;
        private raw_removeElementAt;
        private raw_setElementIndex;
        /**
        * @method ns_egret.SystemContainer#getElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public getElementAt(index: number): IVisualElement;
        /**
        * @method ns_egret.SystemContainer#addElement
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public addElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.SystemContainer#addElementAt
        * @param element {IVisualElement}
        * @param index {number}
        * @returns {IVisualElement}
        */
        public addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
        * @method ns_egret.SystemContainer#removeElement
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public removeElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.SystemContainer#removeElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public removeElementAt(index: number): IVisualElement;
        /**
        * @method ns_egret.SystemContainer#getElementIndex
        * @param element {IVisualElement}
        * @returns {number}
        */
        public getElementIndex(element: IVisualElement): number;
        /**
        * @method ns_egret.SystemContainer#setElementIndex
        * @param element {IVisualElement}
        * @param index {number}
        */
        public setElementIndex(element: IVisualElement, index: number): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.SystemManager
    * @classdesc
    * 系统管理器，应用程序顶级容器。
    * 通常情况下，一个程序应该只含有唯一的系统管理器,并且所有的组件都包含在它内部。
    * 它负责管理弹窗，鼠标样式，工具提示的显示层级，以及过滤鼠标和键盘事件为可以取消的。
    * @extends ns_egret.Group
    * @implements ns_egret.ISystemManager
    */ 
    class SystemManager extends Group implements ISystemManager {
        /**
        * 构造函数
        * @method ns_egret.SystemManager#constructor
        */ 
        constructor();
        /**
        * 添加到舞台
        */ 
        private onAddToStage(event?);
        /**
        * 从舞台移除
        */ 
        private onRemoveFromStage(event);
        /**
        * 舞台尺寸改变
        */ 
        private onResize(event?);
        /**
        * @constant ns_egret.SystemManager#x
        */
        /**
        * @inheritDoc
        */
        public x : number;
        /**
        * @constant ns_egret.SystemManager#y
        */
        /**
        * @inheritDoc
        */
        public y : number;
        /**
        * @member ns_egret.SystemManager#width
        */
        /**
        * @inheritDoc
        */
        public width : number;
        /**
        * @member ns_egret.SystemManager#height
        */
        /**
        * @inheritDoc
        */
        public height : number;
        /**
        * @member ns_egret.SystemManager#scaleX
        */
        /**
        * @inheritDoc
        */
        public scaleX : number;
        /**
        * @member ns_egret.SystemManager#scaleY
        */
        /**
        * @inheritDoc
        */
        public scaleY : number;
        /**
        * @method ns_egret.SystemManager#setActualSize
        * @param w {number}
        * @param h {number}
        */
        public setActualSize(w: number, h: number): void;
        /**
        * @method ns_egret.SystemManager#setLayoutBoundsPosition
        * @param x {number}
        * @param y {number}
        */
        public setLayoutBoundsPosition(x: number, y: number): void;
        /**
        * @method ns_egret.SystemManager#setLayoutBoundsSize
        * @param layoutWidth {number}
        * @param layoutHeight {number}
        */
        public setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void;
        /**
        * 布局对象,SystemManager只接受BasicLayout
        * @member ns_egret.SystemManager#layout
        */ 
        public layout : LayoutBase;
        private _popUpContainer;
        /**
        * 弹出窗口层容器。
        * @member ns_egret.SystemManager#popUpContainer
        */ 
        public popUpContainer : IContainer;
        private _toolTipContainer;
        /**
        * 工具提示层容器。
        * @member ns_egret.SystemManager#toolTipContainer
        */ 
        public toolTipContainer : IContainer;
        private _cursorContainer;
        /**
        * 鼠标样式层容器。
        * @member ns_egret.SystemManager#cursorContainer
        */ 
        public cursorContainer : IContainer;
        private _noTopMostIndex;
        /**
        * 弹出窗口层的起始索引(包括)
        */ 
        private noTopMostIndex;
        private _topMostIndex;
        /**
        * 弹出窗口层结束索引(不包括)
        */ 
        private topMostIndex;
        private _toolTipIndex;
        /**
        * 工具提示层结束索引(不包括)
        */ 
        private toolTipIndex;
        private _cursorIndex;
        /**
        * 鼠标样式层结束索引(不包括)
        */ 
        private cursorIndex;
        /**
        * @method ns_egret.SystemManager#addElement
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public addElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.SystemManager#addElementAt
        * @param element {IVisualElement}
        * @param index {number}
        * @returns {IVisualElement}
        */
        public addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
        * @method ns_egret.SystemManager#removeElement
        * @param element {IVisualElement}
        * @returns {IVisualElement}
        */
        public removeElement(element: IVisualElement): IVisualElement;
        /**
        * @method ns_egret.SystemManager#removeElementAt
        * @param index {number}
        * @returns {IVisualElement}
        */
        public removeElementAt(index: number): IVisualElement;
        /**
        * @method ns_egret.SystemManager#removeAllElements
        */
        public removeAllElements(): void;
        /**
        * @method ns_egret.SystemManager#_elementRemoved
        * @param element {IVisualElement}
        * @param index {number}
        * @param notifyListeners {boolean}
        */
        public _elementRemoved(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        private raw_getElementAt(index);
        private raw_addElement(element);
        private raw_addElementAt(element, index);
        private raw_removeElement(element);
        private raw_removeElementAt(index);
        private raw_removeAllElements();
        private raw_getElementIndex(element);
        private raw_setElementIndex(element, index);
        private raw_swapElements(element1, element2);
        private raw_swapElementsAt(index1, index2);
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module dragonBones {
    module geom {
        class Point {
            public x: number;
            public y: number;
            constructor(x?: number, y?: number);
            public toString(): string;
        }
        class Rectangle {
            public x: number;
            public y: number;
            public width: number;
            public height: number;
            constructor(x?: number, y?: number, width?: number, height?: number);
        }
        class Matrix {
            public a: number;
            public b: number;
            public c: number;
            public d: number;
            public tx: number;
            public ty: number;
            constructor();
            public invert(): void;
        }
        class ColorTransform {
            public alphaMultiplier: number;
            public alphaOffset: number;
            public blueMultiplier: number;
            public blueOffset: number;
            public greenMultiplier: number;
            public greenOffset: number;
            public redMultiplier: number;
            public redOffset: number;
            constructor();
        }
    }
    module events {
        class Event {
            public type: string;
            public target: EventDispatcher;
            constructor(type: string);
        }
        class AnimationEvent extends Event {
            static FADE_IN: string;
            static FADE_OUT: string;
            static START: string;
            static COMPLETE: string;
            static LOOP_COMPLETE: string;
            static FADE_IN_COMPLETE: string;
            static FADE_OUT_COMPLETE: string;
            public animationState: animation.AnimationState;
            public armature: Armature;
            constructor(type: string);
        }
        class ArmatureEvent extends Event {
            static Z_ORDER_UPDATED: string;
            constructor(type: string);
        }
        class FrameEvent extends Event {
            static ANIMATION_FRAME_EVENT: string;
            static BONE_FRAME_EVENT: string;
            public animationState: animation.AnimationState;
            public armature: Armature;
            public bone: Bone;
            public frameLabel: string;
            constructor(type: string);
        }
        class SoundEvent extends Event {
            static SOUND: string;
            static BONE_FRAME_EVENT: string;
            public animationState: animation.AnimationState;
            public armature: Armature;
            public sound: string;
            constructor(type: string);
        }
        class EventDispatcher {
            private _listenersMap;
            constructor();
            public hasEventListener(type: string): boolean;
            public addEventListener(type: string, listener: Function): void;
            public removeEventListener(type: string, listener: Function): void;
            public removeAllEventListeners(type: string): void;
            public dispatchEvent(event: Event): void;
        }
        class SoundEventManager extends EventDispatcher {
            private static _instance;
            static getInstance(): SoundEventManager;
            constructor();
        }
    }
    module animation {
        interface IAnimatable {
            advanceTime(passedTime: number): void;
        }
        class WorldClock implements IAnimatable {
            static clock: WorldClock;
            public time: number;
            public timeScale: number;
            private _animatableList;
            constructor();
            public contains(animatable: IAnimatable): boolean;
            public add(animatable: IAnimatable): void;
            public remove(animatable: IAnimatable): void;
            public clear(): void;
            public advanceTime(passedTime: number): void;
        }
        class TimelineState {
            private static HALF_PI;
            private static _pool;
            static _borrowObject(): TimelineState;
            /** @private */
            static _returnObject(timeline: TimelineState): void;
            /** @private */
            static _clear(): void;
            static getEaseValue(value: number, easing: number): number;
            public transform: objects.DBTransform;
            public pivot: geom.Point;
            public tweenActive: boolean;
            private _updateState;
            private _animationState;
            private _bone;
            private _timeline;
            private _currentFrame;
            private _currentFramePosition;
            private _currentFrameDuration;
            private _durationTransform;
            private _durationPivot;
            private _durationColor;
            private _originTransform;
            private _originPivot;
            private _tweenEasing;
            private _tweenTransform;
            private _tweenColor;
            private _totalTime;
            constructor();
            public fadeIn(bone: Bone, animationState: AnimationState, timeline: objects.TransformTimeline): void;
            public fadeOut(): void;
            public update(progress: number): void;
            private clear();
        }
        class AnimationState {
            private static _pool;
            /** @private */
            static _borrowObject(): AnimationState;
            /** @private */
            static _returnObject(animationState: AnimationState): void;
            /** @private */
            static _clear(): void;
            public enabled: boolean;
            public tweenEnabled: boolean;
            public blend: boolean;
            public group: string;
            public weight: number;
            public name: string;
            public clip: objects.AnimationData;
            public loopCount: number;
            public loop: number;
            public layer: number;
            public isPlaying: boolean;
            public isComplete: boolean;
            public totalTime: number;
            public currentTime: number;
            public timeScale: number;
            public displayControl: boolean;
            /** @private */
            public _timelineStates: any;
            /** @private */
            public _fadeWeight: number;
            private _armature;
            private _currentFrame;
            private _mixingTransforms;
            private _fadeState;
            private _fadeInTime;
            private _fadeOutTime;
            private _fadeOutBeginTime;
            private _fadeOutWeight;
            private _fadeIn;
            private _fadeOut;
            private _pauseBeforeFadeInComplete;
            constructor();
            public fadeIn(armature: Armature, clip: objects.AnimationData, fadeInTime: number, timeScale: number, loop: number, layer: number, displayControl: boolean, pauseBeforeFadeInComplete: boolean): void;
            public fadeOut(fadeOutTime: number, pause?: boolean): void;
            public play(): void;
            public stop(): void;
            public getMixingTransform(timelineName: string): number;
            public addMixingTransform(timelineName: string, type?: number, recursive?: boolean): void;
            public removeMixingTransform(timelineName?: string, recursive?: boolean): void;
            public advanceTime(passedTime: number): boolean;
            private updateTimelineStates();
            private addTimelineState(timelineName);
            private removeTimelineState(timelineName);
            private clear();
        }
        class Animation {
            static NONE: string;
            static SAME_LAYER: string;
            static SAME_GROUP: string;
            static SAME_LAYER_AND_GROUP: string;
            static ALL: string;
            public tweenEnabled: boolean;
            public timeScale: number;
            public animationNameList: string[];
            /** @private */
            public _animationLayer: AnimationState[][];
            /** @private */
            public _lastAnimationState: AnimationState;
            private _armature;
            private _isPlaying;
            public getLastAnimationName(): string;
            public getLastAnimationState(): AnimationState;
            private _animationDataList;
            public getAnimationDataList(): objects.AnimationData[];
            public setAnimationDataList(value: objects.AnimationData[]): void;
            public getIsPlaying(): boolean;
            public getIsComplete(): boolean;
            constructor(armature: Armature);
            public dispose(): void;
            public gotoAndPlay(animationName: string, fadeInTime?: number, duration?: number, loop?: number, layer?: number, group?: string, fadeOutMode?: string, displayControl?: boolean, pauseFadeOut?: boolean, pauseFadeIn?: boolean): AnimationState;
            public play(): void;
            public stop(): void;
            public getState(name: string, layer?: number): AnimationState;
            public hasAnimation(animationName: string): boolean;
            public advanceTime(passedTime: number): void;
            private addLayer(layer);
            private addState(animationState);
            private removeState(animationState);
        }
    }
    module objects {
        class DBTransform {
            public x: number;
            public y: number;
            public skewX: number;
            public skewY: number;
            public scaleX: number;
            public scaleY: number;
            constructor();
            public getRotation(): number;
            public setRotation(value: number): void;
            public copy(transform: DBTransform): void;
            public toString(): string;
        }
        class Frame {
            public position: number;
            public duration: number;
            public action: string;
            public event: string;
            public sound: string;
            constructor();
            public dispose(): void;
        }
        class TransformFrame extends Frame {
            public tweenEasing: number;
            public tweenRotate: number;
            public displayIndex: number;
            public zOrder: number;
            public visible: boolean;
            public global: DBTransform;
            public transform: DBTransform;
            public pivot: geom.Point;
            public color: geom.ColorTransform;
            constructor();
            public dispose(): void;
        }
        class Timeline {
            public duration: number;
            public scale: number;
            private _frameList;
            public getFrameList(): Frame[];
            constructor();
            public dispose(): void;
            public addFrame(frame: Frame): void;
        }
        class TransformTimeline extends Timeline {
            static HIDE_TIMELINE: TransformTimeline;
            public transformed: boolean;
            public offset: number;
            public originTransform: DBTransform;
            public originPivot: geom.Point;
            constructor();
            public dispose(): void;
        }
        class AnimationData extends Timeline {
            public frameRate: number;
            public name: string;
            public loop: number;
            public tweenEasing: number;
            public fadeInTime: number;
            private _timelines;
            public getTimelines(): any;
            constructor();
            public dispose(): void;
            public getTimeline(timelineName: string): TransformTimeline;
            public addTimeline(timeline: TransformTimeline, timelineName: string): void;
        }
        class DisplayData {
            static ARMATURE: string;
            static IMAGE: string;
            public name: string;
            public type: string;
            public transform: DBTransform;
            public pivot: geom.Point;
            constructor();
            public dispose(): void;
        }
        class SlotData {
            public name: string;
            public parent: string;
            public zOrder: number;
            public blendMode: string;
            private _displayDataList;
            public getDisplayDataList(): DisplayData[];
            constructor();
            public dispose(): void;
            public addDisplayData(displayData: DisplayData): void;
            public getDisplayData(displayName: string): DisplayData;
        }
        class BoneData {
            public name: string;
            public parent: string;
            public length: number;
            public global: DBTransform;
            public transform: DBTransform;
            public scaleMode: number;
            public fixedRotation: boolean;
            constructor();
            public dispose(): void;
        }
        class SkinData {
            public name: string;
            private _slotDataList;
            public getSlotDataList(): SlotData[];
            constructor();
            public dispose(): void;
            public getSlotData(slotName: string): SlotData;
            public addSlotData(slotData: SlotData): void;
        }
        class ArmatureData {
            public name: string;
            private _boneDataList;
            public getBoneDataList(): BoneData[];
            private _skinDataList;
            public getSkinDataList(): SkinData[];
            private _animationDataList;
            public getAnimationDataList(): AnimationData[];
            constructor();
            public dispose(): void;
            public getBoneData(boneName: string): BoneData;
            public getSkinData(skinName: string): SkinData;
            public getAnimationData(animationName: string): AnimationData;
            public addBoneData(boneData: BoneData): void;
            public addSkinData(skinData: SkinData): void;
            public addAnimationData(animationData: AnimationData): void;
            public sortBoneDataList(): void;
            private sortBoneData(object1, object2);
        }
        class SkeletonData {
            public name: string;
            private _subTexturePivots;
            public getArmatureNames(): string[];
            private _armatureDataList;
            public getArmatureDataList(): ArmatureData[];
            constructor();
            public dispose(): void;
            public getArmatureData(armatureName: string): ArmatureData;
            public addArmatureData(armatureData: ArmatureData): void;
            public removeArmatureData(armatureData: ArmatureData): void;
            public removeArmatureDataByName(armatureName: string): void;
            public getSubTexturePivot(subTextureName: string): geom.Point;
            public addSubTexturePivot(x: number, y: number, subTextureName: string): geom.Point;
            public removeSubTexturePivot(subTextureName: string): void;
        }
        class DataParser {
            static parseTextureAtlasData(rawData: any, scale?: number): any;
            static parseSkeletonData(rawData: any): SkeletonData;
            private static parseArmatureData(armatureObject, data, frameRate);
            private static parseBoneData(boneObject);
            private static parseSkinData(skinObject, data);
            private static parseSlotData(slotObject, data);
            private static parseDisplayData(displayObject, data);
            private static parseAnimationData(animationObject, armatureData, frameRate);
            private static parseTimeline(timelineObject, timeline, frameParser, frameRate);
            private static parseTransformTimeline(timelineObject, duration, frameRate);
            private static parseFrame(frameObject, frame, frameRate);
            private static parseMainFrame(frameObject, frameRate);
            private static parseTransformFrame(frameObject, frameRate);
            private static parseTransform(transformObject, transform, pivot?);
        }
    }
    module display {
        interface IDisplayBridge {
            getVisible(): boolean;
            setVisible(value: boolean): void;
            getDisplay(): any;
            setDisplay(value: any): void;
            dispose(): void;
            updateTransform(matrix: geom.Matrix, transform: objects.DBTransform): void;
            updateColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number): void;
            addDisplay(container: any, index: number): void;
            removeDisplay(): void;
            updateBlendMode(blendMode: string): void;
        }
    }
    module textures {
        interface ITextureAtlas {
            name: string;
            dispose(): void;
            getRegion(subTextureName: string): geom.Rectangle;
        }
    }
    module factorys {
        class BaseFactory extends events.EventDispatcher {
            /** @private */
            public _dataDic: any;
            /** @private */
            public _textureAtlasDic: any;
            /** @private */
            public _textureAtlasLoadingDic: any;
            /** @private */
            public _currentDataName: string;
            /** @private */
            public _currentTextureAtlasName: string;
            constructor();
            public getSkeletonData(name: string): objects.SkeletonData;
            public addSkeletonData(data: objects.SkeletonData, name?: string): void;
            public removeSkeletonData(name: string): void;
            public getTextureAtlas(name: string): any;
            public addTextureAtlas(textureAtlas: textures.ITextureAtlas, name?: string): void;
            public removeTextureAtlas(name: string): void;
            public dispose(disposeData?: boolean): void;
            public buildArmature(armatureName: string, animationName: string, skeletonName: string, textureAtlasName: string, skinName: string): Armature;
            public getTextureDisplay(textureName: string, textureAtlasName: string, pivotX: number, pivotY: number): Object;
            /** @private */
            public _generateArmature(): Armature;
            /** @private */
            public _generateSlot(): Slot;
            /** @private */
            public _generateDisplay(textureAtlas: textures.ITextureAtlas, fullName: string, pivotX: number, pivotY: number): any;
        }
    }
    module utils {
        class ConstValues {
            static ANGLE_TO_RADIAN: number;
            static DRAGON_BONES: string;
            static ARMATURE: string;
            static SKIN: string;
            static BONE: string;
            static SLOT: string;
            static DISPLAY: string;
            static ANIMATION: string;
            static TIMELINE: string;
            static FRAME: string;
            static TRANSFORM: string;
            static COLOR_TRANSFORM: string;
            static TEXTURE_ATLAS: string;
            static SUB_TEXTURE: string;
            static A_VERSION: string;
            static A_IMAGE_PATH: string;
            static A_FRAME_RATE: string;
            static A_NAME: string;
            static A_PARENT: string;
            static A_LENGTH: string;
            static A_TYPE: string;
            static A_FADE_IN_TIME: string;
            static A_DURATION: string;
            static A_SCALE: string;
            static A_OFFSET: string;
            static A_LOOP: string;
            static A_EVENT: string;
            static A_SOUND: string;
            static A_ACTION: string;
            static A_HIDE: string;
            static A_TWEEN_EASING: string;
            static A_TWEEN_ROTATE: string;
            static A_DISPLAY_INDEX: string;
            static A_Z_ORDER: string;
            static A_BLENDMODE: string;
            static A_WIDTH: string;
            static A_HEIGHT: string;
            static A_SCALE_MODE: string;
            static A_FIXED_ROTATION: string;
            static A_X: string;
            static A_Y: string;
            static A_SKEW_X: string;
            static A_SKEW_Y: string;
            static A_SCALE_X: string;
            static A_SCALE_Y: string;
            static A_PIVOT_X: string;
            static A_PIVOT_Y: string;
            static A_ALPHA_OFFSET: string;
            static A_RED_OFFSET: string;
            static A_GREEN_OFFSET: string;
            static A_BLUE_OFFSET: string;
            static A_ALPHA_MULTIPLIER: string;
            static A_RED_MULTIPLIER: string;
            static A_GREEN_MULTIPLIER: string;
            static A_BLUE_MULTIPLIER: string;
        }
        class TransformUtil {
            private static DOUBLE_PI;
            private static _helpMatrix;
            static transformPointWithParent(transform: objects.DBTransform, parent: objects.DBTransform): void;
            static transformToMatrix(transform: objects.DBTransform, matrix: geom.Matrix): void;
            static formatRadian(radian: number): number;
        }
        class DBDataUtil {
            private static _helpTransform1;
            private static _helpTransform2;
            static transformArmatureData(armatureData: objects.ArmatureData): void;
            static transformArmatureDataAnimations(armatureData: objects.ArmatureData): void;
            static transformAnimationData(animationData: objects.AnimationData, armatureData: objects.ArmatureData): void;
            static getTimelineTransform(timeline: objects.TransformTimeline, position: number, retult: objects.DBTransform): void;
            static addHideTimeline(animationData: objects.AnimationData, armatureData: objects.ArmatureData): void;
        }
    }
    /** @private */
    class DBObject {
        public name: string;
        public fixedRotation: boolean;
        public global: objects.DBTransform;
        public origin: objects.DBTransform;
        public offset: objects.DBTransform;
        public tween: objects.DBTransform;
        public parent: Bone;
        public armature: Armature;
        /** @private */
        public _globalTransformMatrix: geom.Matrix;
        /** @private */
        public _isDisplayOnStage: boolean;
        /** @private */
        public _scaleType: number;
        /** @private */
        public _isColorChanged: boolean;
        /** @private */
        public _visible: boolean;
        public getVisible(): boolean;
        public setVisible(value: boolean): void;
        /** @private */
        public _setParent(value: Bone): void;
        /** @private */
        public _setArmature(value: Armature): void;
        constructor();
        public dispose(): void;
        /** @private */
        public _update(): void;
    }
    class Slot extends DBObject {
        /** @private */
        public _dislayDataList: objects.DisplayData[];
        /** @private */
        public _displayBridge: display.IDisplayBridge;
        /** @private */
        public _isDisplayOnStage: boolean;
        /** @private */
        public _originZOrder: number;
        /** @private */
        public _tweenZorder: number;
        private _isHideDisplay;
        private _offsetZOrder;
        private _displayIndex;
        public _blendMode: string;
        public getZOrder(): number;
        public setZOrder(value: number): void;
        public getDisplay(): any;
        public setDisplay(value: any): void;
        public getBlendMode(): string;
        public setBlendMode(value: string): void;
        public getChildArmature(): Armature;
        public setChildArmature(value: Armature): void;
        /** @private */
        public _displayList: any[];
        public getDisplayList(): any[];
        public setDisplayList(value: any[]): void;
        private _setDisplay(display);
        /** @private */
        public _changeDisplay(displayIndex: number): void;
        public setVisible(value: boolean): void;
        /** @private */
        public _setArmature(value: Armature): void;
        constructor(displayBrideg: display.IDisplayBridge);
        public dispose(): void;
        /** @private */
        public _update(): void;
        /** @private */
        public _updateVisible(value: boolean): void;
        private updateChildArmatureAnimation();
    }
    class Bone extends DBObject {
        private static _soundManager;
        public scaleMode: number;
        public displayController: string;
        public slot: Slot;
        /** @private */
        public _tweenPivot: geom.Point;
        private _children;
        public setVisible(value: boolean): void;
        /** @private */
        public _setArmature(value: Armature): void;
        constructor();
        public dispose(): void;
        public contains(child: DBObject): boolean;
        public addChild(child: DBObject): void;
        public removeChild(child: DBObject): void;
        public getSlots(): Slot[];
        /** @private */
        public _arriveAtFrame(frame: objects.Frame, timelineState: animation.TimelineState, animationState: animation.AnimationState, isCross: boolean): void;
        /** @private */
        public _updateColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number, isColorChanged: boolean): void;
    }
    class Armature extends events.EventDispatcher implements animation.IAnimatable {
        private static _soundManager;
        public name: string;
        public animation: animation.Animation;
        /** @private */
        public _slotsZOrderChanged: boolean;
        /** @private */
        public _slotList: Slot[];
        /** @private */
        public _boneList: Bone[];
        /** @private */
        public _eventList: events.Event[];
        private _display;
        public getDisplay(): any;
        constructor(display: any);
        public dispose(): void;
        public advanceTime(passedTime: number): void;
        public getSlots(returnCopy?: boolean): Slot[];
        public getBones(returnCopy?: boolean): Bone[];
        public getSlot(slotName: string): Slot;
        public getSlotByDisplay(display: Object): Slot;
        public removeSlot(slot: Slot): void;
        public removeSlotByName(slotName: string): void;
        public getBone(boneName: string): Bone;
        public getBoneByDisplay(display: Object): Bone;
        public removeBone(bone: Bone): void;
        public removeBoneByName(boneName: string): void;
        public addChild(object: DBObject, parentName: string): void;
        public updateSlotsZOrder(): void;
        /** @private */
        public _addDBObject(object: DBObject): void;
        /** @private */
        public _removeDBObject(object: DBObject): void;
        /** @private */
        public _sortBoneList(): void;
        /** @private */
        public _arriveAtFrame(frame: objects.Frame, timelineState: animation.TimelineState, animationState: animation.AnimationState, isCross: boolean): void;
        private sortSlot(slot1, slot2);
        private sortBone(object1, object2);
    }
}
/**
* Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
* to any person obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without restriction, including
* without limitation the rights to use, copy, modify, merge, publish, distribute,
* sublicense, and/or sell copies of the Software, and to permit persons to whom
* the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included
* in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
* FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
* ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
declare module dragonBones {
    module display {
        class DragonBonesEgretBridge implements IDisplayBridge {
            private static RADIAN_TO_ANGLE;
            private _display;
            public getVisible(): boolean;
            public setVisible(value: boolean): void;
            public getDisplay(): any;
            public setDisplay(value: any): void;
            constructor();
            public dispose(): void;
            public updateTransform(matrix: geom.Matrix, transform: objects.DBTransform): void;
            public updateColor(aOffset: number, rOffset: number, gOffset: number, bOffset: number, aMultiplier: number, rMultiplier: number, gMultiplier: number, bMultiplier: number): void;
            public updateBlendMode(blendMode: string): void;
            public addDisplay(container: any, index: number): void;
            public removeDisplay(): void;
        }
    }
    module textures {
        class EgretTextureAtlas implements ITextureAtlas {
            public texture: any;
            public name: string;
            public scale: number;
            public spriteSheet: ns_egret.SpriteSheet;
            constructor(texture: any, textureAtlasRawData: any, scale?: number);
            public dispose(): void;
            public getRegion(subTextureName: string): geom.Rectangle;
            private parseData(textureAtlasRawData);
        }
    }
    module factorys {
        class EgretFactory extends BaseFactory {
            constructor();
            /** @private */
            public _generateArmature(): Armature;
            /** @private */
            public _generateSlot(): Slot;
            /** @private */
            public _generateDisplay(textureAtlas: textures.EgretTextureAtlas, fullName: string, pivotX: number, pivotY: number): any;
        }
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.HTML5DeviceContext
    * @classdesc
    * @extends ns_egret.DeviceContext
    */
    class HTML5DeviceContext extends DeviceContext {
        private _time;
        /**
        * @member ns_egret.HTML5DeviceContext#frameRate
        */
        public frameRate: number;
        public s: any;
        /**
        * @method ns_egret.HTML5DeviceContext#constructor
        */
        constructor();
        static requestAnimationFrame: Function;
        /**
        * @method ns_egret.HTML5DeviceContext#executeMainLoop
        * @param callback {Function}
        * @param thisObject {any}
        */
        public executeMainLoop(callback: Function, thisObject: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.HTML5SoundContext
    * @classdesc
    * @extends ns_egret.SoundContext
    */
    class HTML5SoundContext extends SoundContext {
        private _soundList;
        private _capabilities;
        private _soundSupported;
        private _canPlay;
        private _supportedFormat;
        private _playingMusicName;
        constructor();
        private _checkCanPlay(capabilities);
        /**
        * @method ns_egret.HTML5SoundContext#preloadSound
        * @param pat {any}
        */
        public preloadSound(path: any): void;
        private _getSupportedAudioFormat();
        private isFormatSupported(ext);
        private _getExtFromFullPath(fullpath);
        /**
        * @method ns_egret.HTML5SoundContext#playMusic
        * @param path {any}
        * @param loop {any}
        */
        public playMusic(path: any, loop?: boolean): void;
        /**
        * @method ns_egret.HTML5SoundContext#stopMusic
        * @param releaseDat {any}
        */
        public stopMusic(releaseData: any): void;
    }
}
declare module ns_egret {
    /**
    * @class ns_egret.HTML5NetContext
    * @classdesc
    * @extends ns_egret.NetContext
    */
    class HTML5NetContext extends NetContext {
        constructor();
        public proceed(loader: URLLoader): void;
        private getXHR();
        private setResponseType(xhr, responseType);
        private loadTexture(loader);
    }
}
declare module ns_egret {
    class HTML5TouchContext extends TouchContext {
        private canvas;
        constructor(canvas: HTMLCanvasElement);
        public run(): void;
        private _onTouchBegin(event);
        private _onTouchMove(event);
        private _onTouchEnd(event);
        private getLocation(canvas, event);
    }
}
