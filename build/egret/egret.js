//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
this["DEBUG"] = true;
this["RELEASE"] = false;
var egret;
(function (egret) {
    /**
     * @private
     */
    function _getString(code) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        return egret.sys.tr.apply(egret.sys, arguments);
    }
    egret.getString = _getString;
    function _error(code) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var text = egret.sys.tr.apply(null, arguments);
        if (DEBUG) {
            egret.sys.$logToFPS("Error #" + code + ": " + text);
        }
        throw new Error("#" + code + ": " + text); //使用这种方式报错能够终止后续代码继续运行
    }
    egret.$error = _error;
    function _warn(code) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var text = egret.sys.tr.apply(null, arguments);
        if (DEBUG) {
            egret.sys.$logToFPS("Warning #" + code + ": " + text);
        }
        egret.warn("Warning #" + code + ": " + text);
    }
    egret.$warn = _warn;
    function _markReadOnly(instance, property, isProperty) {
        if (isProperty === void 0) { isProperty = true; }
        var data = Object.getOwnPropertyDescriptor(isProperty ? instance.prototype : instance, property);
        if (data == null) {
            console.log(instance);
            return;
        }
        data.set = function (value) {
            if (isProperty) {
                egret.$warn(1010, egret.getQualifiedClassName(instance), property);
            }
            else {
                egret.$warn(1014, egret.getQualifiedClassName(instance), property);
            }
        };
        Object.defineProperty(instance.prototype, property, data);
    }
    egret.$markReadOnly = _markReadOnly;
    function markCannotUse(instance, property, defaultValue) {
        Object.defineProperty(instance.prototype, property, {
            get: function () {
                egret.$warn(1009, egret.getQualifiedClassName(instance), property);
                return defaultValue;
            },
            set: function (value) {
                egret.$error(1009, egret.getQualifiedClassName(instance), property);
            },
            enumerable: true,
            configurable: true
        });
    }
    egret.$markCannotUse = markCannotUse;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Registers the runtime class information for a class.This method adds some strings which represent the class name or
     * some interface names to the class definition. After the registration,you can use egret.is() method to do the type checking
     * for the instance of this class.<br/>
     * Note:If you use the TypeScript programming language, the egret command line tool will automatically generate the registration code line.
     * You don't need to manually call this method.
     *
     * @example the following code shows how to register the runtime class information for the EventDispatcher class and do the type checking:
     * <pre>
     *      egret.registerClass(egret.EventDispatcher,"egret.EventDispatcher",["egret.IEventDispatcher"]);
     *      var dispatcher = new egret.EventDispatcher();
     *      egret.log(egret.is(dispatcher, "egret.IEventDispatcher"));  //true。
     *      egret.log(egret.is(dispatcher, "egret.EventDispatcher"));   //true。
     *      egret.log(egret.is(dispatcher, "egret.Bitmap"));   //false。
     * </pre>
     * @param classDefinition the class definition to be registered.
     * @param className  a unique identification string of the specific class
     * @param interfaceNames a list of unique identification string of the specific interfaces.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 为一个类定义注册运行时类信息,用此方法往类定义上注册它自身以及所有接口对应的字符串。
     * 在运行时，这个类的实例将可以使用 egret.is() 方法传入一个字符串来判断实例类型。
     * @example 以下代码演示了如何为EventDispatcher类注册运行时类信息并判断类型：
     * <pre>
     *      //为egret.EventDispatcher类注册运行时类信息，由于它实现了IEventDispatcher接口，这里应同时传入接口名对应的字符串。
     *      egret.registerClass(egret.EventDispatcher,"egret.EventDispatcher",["egret.IEventDispatcher"]);
     *      var dispatcher = new egret.EventDispatcher();
     *      egret.log(egret.is(dispatcher, "egret.IEventDispatcher"));  //true。
     *      egret.log(egret.is(dispatcher, "egret.EventDispatcher"));   //true。
     *      egret.log(egret.is(dispatcher, "egret.Bitmap"));   //false。
     * </pre>
     * 注意：若您使用 TypeScript 来编写程序，egret 命令行会自动帮您生成类信息注册代码行到最终的 Javascript 文件中。因此您不需要手动调用此方法。
     *
     * @param classDefinition 要注册的类定义。
     * @param className 要注册的类名。
     * @param interfaceNames 要注册的类所实现的接口名列表。
     * @version Egret 2.4
     * @platform Web,Native
     */
    function registerClass(classDefinition, className, interfaceNames) {
        if (DEBUG) {
            if (!classDefinition) {
                egret.$error(1003, "classDefinition");
            }
            if (!classDefinition.prototype) {
                egret.$error(1012, "classDefinition");
            }
            if (className === void 0) {
                egret.$error(1003, "className");
            }
        }
        var prototype = classDefinition.prototype;
        prototype.__class__ = className;
        var types = [className];
        if (interfaceNames) {
            types = types.concat(interfaceNames);
        }
        var superTypes = prototype.__types__;
        if (prototype.__types__) {
            var length = superTypes.length;
            for (var i = 0; i < length; i++) {
                var name = superTypes[i];
                if (types.indexOf(name) == -1) {
                    types.push(name);
                }
            }
        }
        prototype.__types__ = types;
    }
    egret.registerClass = registerClass;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
/// <reference path="registerclass.ts" />
function __extends(d, b) {
    for (var p in b)
        if (b.hasOwnProperty(p))
            d[p] = b[p];
    function __() {
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
}
var __define = this.__define || function (o, p, g, s) { Object.defineProperty(o, p, { configurable: true, enumerable: true, get: g, set: s }); };
var egret;
(function (egret) {
    /**
     * @private
     * 哈希计数
     */
    egret.$hashCount = 1;
    /**
     * @language en_US
     * The HashObject class is the base class for all objects in the Egret framework.The HashObject
     * class includes a hashCode property, which is a unique identification number of the instance.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Egret顶级对象。框架内所有对象的基类，为对象实例提供唯一的hashCode值。
     * @version Egret 2.4
     * @platform Web,Native
     */
    var HashObject = (function () {
        /**
         * @language en_US
         * Initializes a HashObject
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 HashObject 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        function HashObject() {
            this.$hashCode = egret.$hashCount++;
        }
        var d = __define,c=HashObject,p=c.prototype;
        d(p, "hashCode"
            /**
             * @language en_US
             * a unique identification number assigned to this instance.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 返回此对象唯一的哈希值,用于唯一确定一个对象。hashCode为大于等于1的整数。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$hashCode;
            }
        );
        return HashObject;
    })();
    egret.HashObject = HashObject;
    egret.registerClass(HashObject,'egret.HashObject',["egret.IHashObject"]);
    if (DEBUG) {
        egret.$markReadOnly(HashObject, "hashCode");
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var ONCE_EVENT_LIST = [];
    /**
     * @language en_US
     * The EventDispatcher class is the base class for all classes that dispatchEvent events. The EventDispatcher class implements
     * the IEventDispatcher interface and is the base class for the DisplayObject class. The EventDispatcher class allows
     * any object on the display list to be an event target and as such, to use the methods of the IEventDispatcher interface.
     * Event targets are an important part of the Egret event model. The event target serves as the focal point for how events
     * flow through the display list hierarchy. When an event such as a touch tap, Egret dispatches an event object into the
     * event flow from the root of the display list. The event object then makes its way through the display list until it
     * reaches the event target, at which point it begins its return trip through the display list. This round-trip journey
     * to the event target is conceptually divided into three phases: <br/>
     * the capture phase comprises the journey from the root to the last node before the event target's node, the target
     * phase comprises only the event target node, and the bubbling phase comprises any subsequent nodes encountered on
     * the return trip to the root of the display list. In general, the easiest way for a user-defined class to gain event
     * dispatching capabilities is to extend EventDispatcher. If this is impossible (that is, if the class is already extending
     * another class), you can instead implement the IEventDispatcher interface, create an EventDispatcher member, and write simple
     * hooks to route calls into the aggregated EventDispatcher.
     * @see egret.IEventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/EventDispatcher.ts
     */
    /**
     * @language zh_CN
     * EventDispatcher 是 Egret 的事件派发器类，负责进行事件的发送和侦听。
     * 事件目标是事件如何通过显示列表层次结构这一问题的焦点。当发生鼠标单击、触摸或按键等事件时，
     * 框架会将事件对象调度到从显示列表根开始的事件流中。然后该事件对象在显示列表中前进，直到到达事件目标，
     * 然后从这一点开始其在显示列表中的回程。在概念上，到事件目标的此往返行程被划分为三个阶段：
     * 捕获阶段包括从根到事件目标节点之前的最后一个节点的行程，目标阶段仅包括事件目标节点，冒泡阶段包括回程上遇到的任何后续节点到显示列表的根。
     * 通常，使用户定义的类能够调度事件的最简单方法是扩展 EventDispatcher。如果无法扩展（即，如果该类已经扩展了另一个类），则可以实现
     * IEventDispatcher 接口，创建 EventDispatcher 成员，并编写一些简单的映射，将调用连接到聚合的 EventDispatcher 中。
     * @see egret.IEventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/EventDispatcher.ts
     */
    var EventDispatcher = (function (_super) {
        __extends(EventDispatcher, _super);
        /**
         * @language en_US
         * create an instance of the EventDispatcher class.
         * @param target The target object for events dispatched to the EventDispatcher object. This parameter is used when
         * the EventDispatcher instance is aggregated by a class that implements IEventDispatcher; it is necessary so that the
         * containing object can be the target for events. Do not use this parameter in simple cases in which a class extends EventDispatcher.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 EventDispatcher 类的实例
         * @param target 此 EventDispatcher 所抛出事件对象的 target 指向。此参数主要用于一个实现了 IEventDispatcher 接口的自定义类，
         * 以便抛出的事件对象的 target 属性可以指向自定义类自身。请勿在直接继承 EventDispatcher 的情况下使用此参数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function EventDispatcher(target) {
            if (target === void 0) { target = null; }
            _super.call(this);
            this.$EventDispatcher = {
                0: target ? target : this,
                1: {},
                2: {},
                3: 0
            };
        }
        var d = __define,c=EventDispatcher,p=c.prototype;
        /**
         * @private
         *
         * @param useCapture
         */
        p.$getEventMap = function (useCapture) {
            var values = this.$EventDispatcher;
            var eventMap = useCapture ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
            return eventMap;
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.addEventListener = function (type, listener, thisObject, useCapture, priority) {
            this.$addListener(type, listener, thisObject, useCapture, priority);
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.once = function (type, listener, thisObject, useCapture, priority) {
            this.$addListener(type, listener, thisObject, useCapture, priority, true);
        };
        /**
         * @private
         */
        p.$addListener = function (type, listener, thisObject, useCapture, priority, dispatchOnce) {
            if (DEBUG && !listener) {
                egret.$error(1003, "listener");
            }
            var values = this.$EventDispatcher;
            var eventMap = useCapture ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
            var list = eventMap[type];
            if (!list) {
                list = eventMap[type] = [];
            }
            else if (values[3 /* notifyLevel */] !== 0) {
                eventMap[type] = list = list.concat();
            }
            this.$insertEventBin(list, type, listener, thisObject, useCapture, priority, dispatchOnce);
        };
        p.$insertEventBin = function (list, type, listener, thisObject, useCapture, priority, dispatchOnce) {
            priority = +priority | 0;
            var insertIndex = -1;
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    return false;
                }
                if (insertIndex == -1 && bin.priority < priority) {
                    insertIndex = i;
                }
            }
            var eventBin = {
                type: type, listener: listener, thisObject: thisObject, priority: priority,
                target: this, useCapture: useCapture, dispatchOnce: !!dispatchOnce
            };
            if (insertIndex !== -1) {
                list.splice(insertIndex, 0, eventBin);
            }
            else {
                list.push(eventBin);
            }
            return true;
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.removeEventListener = function (type, listener, thisObject, useCapture) {
            var values = this.$EventDispatcher;
            var eventMap = useCapture ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
            var list = eventMap[type];
            if (!list) {
                return;
            }
            if (values[3 /* notifyLevel */] !== 0) {
                eventMap[type] = list = list.concat();
            }
            this.$removeEventBin(list, listener, thisObject);
            if (list.length == 0) {
                eventMap[type] = null;
            }
        };
        p.$removeEventBin = function (list, listener, thisObject) {
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var bin = list[i];
                if (bin.listener == listener && bin.thisObject == thisObject && bin.target == this) {
                    list.splice(i, 1);
                    return true;
                }
            }
            return false;
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.hasEventListener = function (type) {
            var values = this.$EventDispatcher;
            return !!(values[1 /* eventsMap */][type] || values[2 /* captureEventsMap */][type]);
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.willTrigger = function (type) {
            return this.hasEventListener(type);
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.dispatchEvent = function (event) {
            event.$currentTarget = this.$EventDispatcher[0 /* eventTarget */];
            event.$setTarget(event.$currentTarget);
            return this.$notifyListener(event, false);
        };
        /**
         * @private
         */
        p.$notifyListener = function (event, capturePhase) {
            var values = this.$EventDispatcher;
            var eventMap = capturePhase ? values[2 /* captureEventsMap */] : values[1 /* eventsMap */];
            var list = eventMap[event.$type];
            if (!list) {
                return true;
            }
            var length = list.length;
            if (length == 0) {
                return true;
            }
            var onceList = ONCE_EVENT_LIST;
            //做个标记，防止外部修改原始数组导致遍历错误。这里不直接调用list.concat()因为dispatch()方法调用通常比on()等方法频繁。
            values[3 /* notifyLevel */]++;
            for (var i = 0; i < length; i++) {
                var eventBin = list[i];
                eventBin.listener.call(eventBin.thisObject, event);
                if (eventBin.dispatchOnce) {
                    onceList.push(eventBin);
                }
                if (event.$isPropagationImmediateStopped) {
                    break;
                }
            }
            values[3 /* notifyLevel */]--;
            while (onceList.length) {
                eventBin = onceList.pop();
                eventBin.target.removeEventListener(eventBin.type, eventBin.listener, eventBin.thisObject, eventBin.useCapture);
            }
            return !event.$isDefaultPrevented;
        };
        /**
         * @language en_US
         * Distribute a specified event parameters.
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param data {any} data
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 派发一个指定参数的事件。
         * @param type {string} 事件类型
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param data {any} 事件data
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.dispatchEventWith = function (type, bubbles, data) {
            if (bubbles || this.hasEventListener(type)) {
                var event = egret.Event.create(egret.Event, type, bubbles);
                event.data = data;
                var result = this.dispatchEvent(event);
                egret.Event.release(event);
                return result;
            }
            return true;
        };
        return EventDispatcher;
    })(egret.HashObject);
    egret.EventDispatcher = EventDispatcher;
    egret.registerClass(EventDispatcher,'egret.EventDispatcher',["egret.IEventDispatcher"]);
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     * 格式化旋转角度的值
     */
    function clampRotation(value) {
        value %= 360;
        if (value > 180) {
            value -= 360;
        }
        else if (value < -180) {
            value += 360;
        }
        return value;
    }
    /**
     * @language en_US
     * The DisplayObject class is the base class for all objects that can be placed on the display list. The display list
     * manages all objects displayed in the runtime. Use the DisplayObjectContainer class to arrange the display
     * objects in the display list. DisplayObjectContainer objects can have child display objects, while other display objects,
     * such as Shape and TextField objects, are "leaf" nodes that have only parents and siblings, no children.
     * The DisplayObject class supports basic functionality like the x and y position of an object, as well as more advanced
     * properties of the object such as its transformation matrix.<br/>
     * The DisplayObject class contains several broadcast events.Normally, the target of any particular event is a specific
     * DisplayObject instance. For example, the target of an added event is the specific DisplayObject instance that was added
     * to the display list. Having a single target restricts the placement of event listeners to that target and in some cases
     * the target's ancestors on the display list. With broadcast events, however, the target is not a specific DisplayObject
     * instance, but rather all DisplayObject instances, including those that are not on the display list. This means that you
     * can add a listener to any DisplayObject instance to listen for broadcast events.
     *
     * @event egret.Event.ADDED Dispatched when a display object is added to the display list.
     * @event egret.Event.ADDED_TO_STAGE Dispatched when a display object is added to the on stage display list, either directly or through the addition of a sub tree in which the display object is contained.
     * @event egret.Event.REMOVED Dispatched when a display object is about to be removed from the display list.
     * @event egret.Event.REMOVED_FROM_STAGE Dispatched when a display object is about to be removed from the display list, either directly or through the removal of a sub tree in which the display object is contained.
     * @event egret.Event.ENTER_FRAME [broadcast event] Dispatched when the playhead is entering a new frame.
     * @event egret.Event.RENDER [broadcast event] Dispatched when the display list is about to be updated and rendered.
     * @event egret.TouchEvent.TOUCH_MOVE Dispatched when the user touches the device, and is continuously dispatched until the point of contact is removed.
     * @event egret.TouchEvent.TOUCH_BEGIN Dispatched when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_END Dispatched when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_TAP Dispatched when the user lifts the point of contact over the same DisplayObject instance on which the contact was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display object on a mobile phone or tablet with a touch screen).
     * @event egret.TouchEvent.TOUCH_RELEASE_OUTSIDE Dispatched when the user lifts the point of contact over the different DisplayObject instance on which the contact was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display object on a mobile phone or tablet with a touch screen).
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObject.ts
     */
    /**
     * @language zh_CN
     * DisplayObject 类是可放在显示列表中的所有对象的基类。该显示列表管理运行时中显示的所有对象。使用 DisplayObjectContainer 类排列
     * 显示列表中的显示对象。DisplayObjectContainer 对象可以有子显示对象，而其他显示对象（如 Shape 和 TextField 对象）是“叶”节点，没有子项，只有父级和
     * 同级。DisplayObject 类有一些基本的属性（如确定坐标位置的 x 和 y 属性），也有一些高级的对象属性（如 Matrix 矩阵变换）。<br/>
     * DisplayObject 类包含若干广播事件。通常，任何特定事件的目标均为一个特定的 DisplayObject 实例。例如，added 事件的目标是已添加到显示列表
     * 的目标 DisplayObject 实例。若只有一个目标，则会将事件侦听器限制为只能监听在该目标上（在某些情况下，可监听在显示列表中该目标的祖代上）。
     * 但是对于广播事件，目标不是特定的 DisplayObject 实例，而是所有 DisplayObject 实例（包括那些不在显示列表中的实例）。这意味着您可以向任何
     * DisplayObject 实例添加侦听器来侦听广播事件。
     *
     * @event egret.Event.ADDED 将显示对象添加到显示列表中时调度。
     * @event egret.Event.ADDED_TO_STAGE 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
     * @event egret.Event.REMOVED 将要从显示列表中删除显示对象时调度。
     * @event egret.Event.REMOVED_FROM_STAGE 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
     * @event egret.Event.ENTER_FRAME [广播事件] 播放头进入新帧时调度。
     * @event egret.Event.RENDER [广播事件] 将要更新和呈现显示列表时调度。
     * @event egret.TouchEvent.TOUCH_MOVE 当用户触碰设备时进行调度，而且会连续调度，直到接触点被删除。
     * @event egret.TouchEvent.TOUCH_BEGIN 当用户第一次触摸启用触摸的设备时（例如，用手指触摸配有触摸屏的移动电话或平板电脑）调度。
     * @event egret.TouchEvent.TOUCH_END 当用户移除与启用触摸的设备的接触时（例如，将手指从配有触摸屏的移动电话或平板电脑上抬起）调度。
     * @event egret.TouchEvent.TOUCH_TAP 当用户在启用触摸设备上的已启动接触的同一 DisplayObject 实例上抬起接触点时（例如，在配有触摸屏的移动电话或平板电脑的显示对象上的某一点处按下并释放手指）调度。
     * @event egret.TouchEvent.TOUCH_RELEASE_OUTSIDE 当用户在启用触摸设备上的已启动接触的不同 DisplayObject 实例上抬起接触点时（例如，在配有触摸屏的移动电话或平板电脑的显示对象上的某一点处按下并释放手指）调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObject.ts
     */
    var DisplayObject = (function (_super) {
        __extends(DisplayObject, _super);
        /**
         * @language en_US
         * Initializes a DisplayObject object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个显示对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        function DisplayObject() {
            _super.call(this);
            /**
             * @private
             * 能够含有子项的类将子项列表存储在这个属性里。
             */
            this.$children = null;
            /**
             * @private
             */
            this.$parent = null;
            /**
             * @private
             */
            this.$stage = null;
            /**
             * @private
             * 这个对象在显示列表中的嵌套深度，舞台为1，它的子项为2，子项的子项为3，以此类推。当对象不在显示列表中时此属性值为0.
             */
            this.$nestLevel = 0;
            /**
             * @private
             */
            this.$visible = true;
            /**
             * @private
             * cacheAsBitmap创建的缓存位图节点。
             */
            this.$displayList = null;
            /**
             * @private
             */
            this.$alpha = 1;
            this.$touchEnabled = DisplayObject.defaultTouchEnabled;
            /**
             * @private
             */
            this.$scrollRect = null;
            /**
             * @private
             */
            this.$blendMode = 0;
            /**
             * @private
             * 被遮罩的对象
             */
            this.$maskedObject = null;
            /**
             * @private
             */
            this.$mask = null;
            /**
             * @private
             */
            this.$maskRect = null;
            /**
             * @private
             */
            this.$parentDisplayList = null;
            /**
             * @private
             * 是否需要重绘的标志，此属性在渲染时会被访问，所以单独声明一个直接的变量。
             */
            this.$isDirty = false;
            /**
             * @private
             * 这个对象在舞台上的整体透明度
             */
            this.$renderAlpha = 1;
            /**
             * @private
             * 相对于显示列表根节点或位图缓存根节点上的矩阵对象
             */
            this.$renderMatrix = new egret.Matrix();
            /**
             * @private
             * 此显示对象自身（不包括子项）在显示列表根节点或位图缓存根节点上的显示尺寸。
             */
            this.$renderRegion = null;
            this.$displayFlags = 880 /* InitFlags */;
            this.$DisplayObject = {
                0: 1,
                1: 1,
                2: 0,
                3: 0,
                4: 0,
                5: "",
                6: new egret.Matrix(),
                7: new egret.Matrix(),
                8: new egret.Matrix(),
                9: new egret.Rectangle(),
                10: new egret.Rectangle(),
                11: false,
                12: 0,
                13: 0,
                14: NaN,
                15: NaN,
                16: 0,
                17: 0 //skewYdeg
            };
        }
        var d = __define,c=DisplayObject,p=c.prototype;
        /**
         * @private
         * 添加一个标志量
         */
        p.$setFlags = function (flags) {
            this.$displayFlags |= flags;
        };
        /**
         * @private
         * 移除一个标志量
         */
        p.$removeFlags = function (flags) {
            this.$displayFlags &= ~flags;
        };
        /**
         * @private
         * 沿着显示列表向上移除标志量，如果标志量没被设置过就停止移除。
         */
        p.$removeFlagsUp = function (flags) {
            if (!this.$hasAnyFlags(flags)) {
                return;
            }
            this.$removeFlags(flags);
            var parent = this.$parent;
            if (parent) {
                parent.$removeFlagsUp(flags);
            }
        };
        /**
         * @private
         * 是否含有指定的所有标志量
         */
        p.$hasFlags = function (flags) {
            return (this.$displayFlags & flags) == flags;
        };
        /**
         * @private
         * 沿着显示列表向上传递标志量，如果标志量已经被设置过就停止传递。
         */
        p.$propagateFlagsUp = function (flags) {
            if (this.$hasFlags(flags)) {
                return;
            }
            this.$setFlags(flags);
            var parent = this.$parent;
            if (parent) {
                parent.$propagateFlagsUp(flags);
            }
        };
        /**
         * @private
         * 沿着显示列表向下传递标志量，非容器直接设置自身的flag，此方法会在 DisplayObjectContainer 中被覆盖。
         */
        p.$propagateFlagsDown = function (flags) {
            this.$setFlags(flags);
        };
        /**
         * @private
         * 是否含有多个标志量其中之一。
         */
        p.$hasAnyFlags = function (flags) {
            return !!(this.$displayFlags & flags);
        };
        /**
         * @private
         * 标记矩阵失效
         */
        p.invalidateMatrix = function () {
            this.$setFlags(8 /* InvalidMatrix */);
            this.invalidatePosition();
        };
        /**
         * @private
         * 标记这个显示对象在父级容器的位置发生了改变。
         */
        p.invalidatePosition = function () {
            this.$invalidateTransform();
            this.$propagateFlagsDown(16 /* InvalidConcatenatedMatrix */ |
                32 /* InvalidInvertedConcatenatedMatrix */);
            if (this.$parent) {
                this.$parent.$propagateFlagsUp(4 /* InvalidBounds */);
            }
        };
        d(p, "name"
            /**
             * @language en_US
             * Indicates the instance name of the DisplayObject. The object can be identified in the child list of its parent
             * display object container by calling the getChildByName() method of the display object container.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示 DisplayObject 的实例名称。
             * 通过调用父显示对象容器的 getChildByName() 方法，可以在父显示对象容器的子列表中标识该对象。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$DisplayObject[5 /* name */];
            }
            ,function (value) {
                this.$DisplayObject[5 /* name */] = value;
            }
        );
        d(p, "parent"
            /**
             * @language en_US
             * Indicates the DisplayObjectContainer object that contains this display object. Use the parent property to specify
             * a relative path to display objects that are above the current display object in the display list hierarchy.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示包含此显示对象的 DisplayObjectContainer 对象。
             * 使用 parent 属性可以指定高于显示列表层次结构中当前显示对象的显示对象的相对路径。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$parent;
            }
        );
        /**
         * @private
         * 设置父级显示对象
         */
        p.$setParent = function (parent) {
            if (this.$parent == parent) {
                return false;
            }
            this.$parent = parent;
            return true;
        };
        /**
         * @private
         * 显示对象添加到舞台
         */
        p.$onAddToStage = function (stage, nestLevel) {
            this.$stage = stage;
            this.$nestLevel = nestLevel;
            egret.Sprite.$EVENT_ADD_TO_STAGE_LIST.push(this);
        };
        /**
         * @private
         * 显示对象从舞台移除
         */
        p.$onRemoveFromStage = function () {
            this.$nestLevel = 0;
            egret.Sprite.$EVENT_REMOVE_FROM_STAGE_LIST.push(this);
        };
        d(p, "stage"
            /**
             * @language en_US
             * The Stage of the display object. you can create and load multiple display objects into the display list, and
             * the stage property of each display object refers to the same Stage object.<br/>
             * If a display object is not added to the display list, its stage property is set to null.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 显示对象的舞台。
             * 例如，您可以创建多个显示对象并加载到显示列表中，每个显示对象的 stage 属性是指向相同的 Stage 对象。<br/>
             * 如果显示对象未添加到显示列表，则其 stage 属性会设置为 null。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$stage;
            }
        );
        d(p, "matrix"
            /**
             * @language en_US
             * A Matrix object containing values that alter the scaling, rotation, and translation of the display object.<br/>
             * Note: to change the value of a display object's matrix, you must make a copy of the entire matrix object, then copy
             * the new object into the matrix property of the display object.
             * @example the following code increases the tx value of a display object's matrix
             * <pre>
             *     var myMatrix:Matrix = myDisplayObject.matrix;
             *     myMatrix.tx += 10;
             *     myDisplayObject.matrix = myMatrix;
             * </pre>
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 一个 Matrix 对象，其中包含更改显示对象的缩放、旋转和平移的值。<br/>
             * 注意：要改变一个显示对象矩阵的值，您必引用整个矩阵对象，然后将它重新赋值给显示对象的 matrix 属性。
             * @example 以下代码改变了显示对象矩阵的tx属性值：
             * <pre>
             *     var myMatrix:Matrix = myDisplayObject.matrix;
             *     myMatrix.tx += 10;
             *     myDisplayObject.matrix = myMatrix;
             * </pre>
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getMatrix().clone();
            }
            ,function (value) {
                this.$setMatrix(value);
            }
        );
        /**
         * @private
         * 获取矩阵
         */
        p.$getMatrix = function () {
            var values = this.$DisplayObject;
            if (this.$hasFlags(8 /* InvalidMatrix */)) {
                values[6 /* matrix */].$updateScaleAndRotation(values[0 /* scaleX */], values[1 /* scaleY */], values[2 /* skewX */], values[3 /* skewY */]);
                this.$removeFlags(8 /* InvalidMatrix */);
            }
            return values[6 /* matrix */];
        };
        /**
         * @private
         * 设置矩阵
         */
        p.$setMatrix = function (matrix, useProperties) {
            if (useProperties === void 0) { useProperties = true; }
            var values = this.$DisplayObject;
            var m = values[6 /* matrix */];
            if (m.equals(matrix)) {
                return false;
            }
            m.copyFrom(matrix);
            if (useProperties) {
                values[0 /* scaleX */] = m.$getScaleX();
                values[1 /* scaleY */] = m.$getScaleY();
                values[2 /* skewX */] = matrix.$getSkewX();
                values[3 /* skewY */] = matrix.$getSkewY();
                values[16 /* skewXdeg */] = clampRotation(values[2 /* skewX */] * 180 / Math.PI);
                values[17 /* skewYdeg */] = clampRotation(values[3 /* skewY */] * 180 / Math.PI);
                values[4 /* rotation */] = clampRotation(values[3 /* skewY */] * 180 / Math.PI);
            }
            this.$removeFlags(8 /* InvalidMatrix */);
            this.invalidatePosition();
            return true;
        };
        /**
         * @private
         * 获得这个显示对象以及它所有父级对象的连接矩阵。
         */
        p.$getConcatenatedMatrix = function () {
            var matrix = this.$DisplayObject[7 /* concatenatedMatrix */];
            if (this.$hasFlags(16 /* InvalidConcatenatedMatrix */)) {
                if (this.$parent) {
                    this.$parent.$getConcatenatedMatrix().$preMultiplyInto(this.$getMatrix(), matrix);
                }
                else {
                    matrix.copyFrom(this.$getMatrix());
                }
                var values = this.$DisplayObject;
                var offsetX = values[12 /* anchorOffsetX */];
                var offsetY = values[13 /* anchorOffsetY */];
                var rect = this.$scrollRect;
                if (rect) {
                    matrix.$preMultiplyInto(egret.$TempMatrix.setTo(1, 0, 0, 1, -rect.x - offsetX, -rect.y - offsetY), matrix);
                }
                else if (offsetX != 0 || offsetY != 0) {
                    matrix.$preMultiplyInto(egret.$TempMatrix.setTo(1, 0, 0, 1, -offsetX, -offsetY), matrix);
                }
                if (this.$displayList) {
                    this.$displayList.$renderRegion.moved = true;
                }
                if (this.$renderRegion) {
                    this.$renderRegion.moved = true;
                }
                this.$removeFlags(16 /* InvalidConcatenatedMatrix */);
            }
            return matrix;
        };
        /**
         * @private
         * 获取链接矩阵
         */
        p.$getInvertedConcatenatedMatrix = function () {
            var values = this.$DisplayObject;
            if (this.$hasFlags(32 /* InvalidInvertedConcatenatedMatrix */)) {
                this.$getConcatenatedMatrix().$invertInto(values[8 /* invertedConcatenatedMatrix */]);
                this.$removeFlags(32 /* InvalidInvertedConcatenatedMatrix */);
            }
            return values[8 /* invertedConcatenatedMatrix */];
        };
        d(p, "x"
            /**
             * @language en_US
             * Indicates the x coordinate of the DisplayObject instance relative to the local coordinates of the parent
             * DisplayObjectContainer.<br/>
             * If the object is inside a DisplayObjectContainer that has transformations, it is in
             * the local coordinate system of the enclosing DisplayObjectContainer. Thus, for a DisplayObjectContainer
             * rotated 90° counterclockwise, the DisplayObjectContainer's children inherit a coordinate system that is
             * rotated 90° counterclockwise. The object's coordinates refer to the registration point position.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。<br/>
             * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。
             * 因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getX();
            }
            ,function (value) {
                this.$setX(value);
            }
        );
        /**
         * @private
         * 获取x坐标
         */
        p.$getX = function () {
            return this.$DisplayObject[6 /* matrix */].tx;
        };
        /**
         * @private
         * 设置x坐标
         */
        p.$setX = function (value) {
            value = egret.sys.getNumber(value);
            var m = this.$DisplayObject[6 /* matrix */];
            if (value == m.tx) {
                return false;
            }
            m.tx = value;
            this.invalidatePosition();
            return true;
        };
        d(p, "y"
            /**
             * @language en_US
             * Indicates the y coordinate of the DisplayObject instance relative to the local coordinates of the parent
             * DisplayObjectContainer. <br/>
             * If the object is inside a DisplayObjectContainer that has transformations, it is in
             * the local coordinate system of the enclosing DisplayObjectContainer. Thus, for a DisplayObjectContainer rotated
             * 90° counterclockwise, the DisplayObjectContainer's children inherit a coordinate system that is rotated 90°
             * counterclockwise. The object's coordinates refer to the registration point position.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。<br/>
             * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer 的本地坐标系中。
             * 因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer 的子级将继承逆时针旋转 90 度的坐标系。
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getY();
            }
            ,function (value) {
                this.$setY(value);
            }
        );
        /**
         * @private
         * 获取y坐标
         */
        p.$getY = function () {
            return this.$DisplayObject[6 /* matrix */].ty;
        };
        /**
         * @private
         * 设置y坐标
         */
        p.$setY = function (value) {
            value = egret.sys.getNumber(value);
            var m = this.$DisplayObject[6 /* matrix */];
            if (value == m.ty) {
                return false;
            }
            m.ty = value;
            this.invalidatePosition();
            return true;
        };
        d(p, "scaleX"
            /**
             * @language en_US
             * Indicates the horizontal scale (percentage) of the object as applied from the registration point. <br/>
             * The default 1.0 equals 100% scale.
             * @default 1
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示从注册点开始应用的对象的水平缩放比例（百分比）。<br/>
             * 1.0 等于 100% 缩放。
             * @default 1
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getScaleX();
            }
            ,function (value) {
                this.$setScaleX(value);
            }
        );
        /**
         * @private
         *
         * @returns
         */
        p.$getScaleX = function () {
            return this.$DisplayObject[0 /* scaleX */];
        };
        /**
         * @private
         * 设置水平缩放值
         */
        p.$setScaleX = function (value) {
            value = egret.sys.getNumber(value);
            var values = this.$DisplayObject;
            if (value == values[0 /* scaleX */]) {
                return false;
            }
            values[0 /* scaleX */] = value;
            this.invalidateMatrix();
            return true;
        };
        d(p, "scaleY"
            /**
             * @language en_US
             * Indicates the vertical scale (percentage) of an object as applied from the registration point of the object.
             * 1.0 is 100% scale.
             * @default 1
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。1.0 是 100% 缩放。
             * @default 1
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getScaleY();
            }
            ,function (value) {
                this.$setScaleY(value);
            }
        );
        /**
         * @private
         *
         * @returns
         */
        p.$getScaleY = function () {
            return this.$DisplayObject[1 /* scaleY */];
        };
        /**
         * @private
         * 设置垂直缩放值
         */
        p.$setScaleY = function (value) {
            value = egret.sys.getNumber(value);
            if (value == this.$DisplayObject[1 /* scaleY */]) {
                return false;
            }
            this.$DisplayObject[1 /* scaleY */] = value;
            this.invalidateMatrix();
            return true;
        };
        d(p, "rotation"
            /**
             * @language en_US
             * Indicates the rotation of the DisplayObject instance, in degrees, from its original orientation. Values from
             * 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation. Values outside
             * this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement
             * myDisplayObject.rotation = 450 is the same as myDisplayObject.rotation = 90.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示 DisplayObject 实例距其原始方向的旋转程度，以度为单位。
             * 从 0 到 180 的值表示顺时针方向旋转；从 0 到 -180 的值表示逆时针方向旋转。对于此范围之外的值，可以通过加上或
             * 减去 360 获得该范围内的值。例如，myDisplayObject.rotation = 450语句与 myDisplayObject.rotation = 90 是相同的。
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getRotation();
            }
            ,function (value) {
                this.$setRotation(value);
            }
        );
        /**
         * @private
         *
         * @returns
         */
        p.$getRotation = function () {
            return this.$DisplayObject[4 /* rotation */];
        };
        p.$setRotation = function (value) {
            value = egret.sys.getNumber(value);
            value = clampRotation(value);
            var values = this.$DisplayObject;
            if (value == values[4 /* rotation */]) {
                return false;
            }
            var delta = value - values[4 /* rotation */];
            var angle = delta / 180 * Math.PI;
            values[2 /* skewX */] += angle;
            values[3 /* skewY */] += angle;
            values[4 /* rotation */] = value;
            this.invalidateMatrix();
            return true;
        };
        d(p, "skewX"
            /**
             * 表示DisplayObject的x方向斜切
             * @member {number} egret.DisplayObject#skewX
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$DisplayObject[16 /* skewXdeg */];
            }
            ,function (value) {
                this.$setSkewX(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setSkewX = function (value) {
            value = egret.sys.getNumber(value);
            var values = this.$DisplayObject;
            if (value == values[16 /* skewXdeg */]) {
                return false;
            }
            values[16 /* skewXdeg */] = value;
            value = clampRotation(value);
            value = value / 180 * Math.PI;
            values[2 /* skewX */] = value;
            this.invalidateMatrix();
            return true;
        };
        d(p, "skewY"
            /**
             * 表示DisplayObject的y方向斜切
             * @member {number} egret.DisplayObject#skewY
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$DisplayObject[17 /* skewYdeg */];
            }
            ,function (value) {
                this.$setSkewY(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setSkewY = function (value) {
            value = egret.sys.getNumber(value);
            var values = this.$DisplayObject;
            if (value == values[17 /* skewYdeg */]) {
                return false;
            }
            values[17 /* skewYdeg */] = value;
            value = clampRotation(value);
            value = value / 180 * Math.PI;
            values[3 /* skewY */] = value;
            this.invalidateMatrix();
            return true;
        };
        d(p, "width"
            /**
             * @language en_US
             * Indicates the width of the display object, in pixels. The width is calculated based on the bounds of the content
             * of the display object.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示显示对象的宽度，以像素为单位。宽度是根据显示对象内容的范围来计算的。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getWidth();
            }
            ,function (value) {
                this.$setWidth(value);
            }
        );
        /**
         * @private
         * 获取显示宽度
         */
        p.$getWidth = function () {
            return isNaN(this.$getExplicitWidth()) ? this.$getOriginalBounds().width : this.$getExplicitWidth();
            //return this.$getTransformedBounds(this.$parent, $TempRectangle).width;
        };
        /**
         * @private
         *
         * @returns
         */
        p.$getExplicitWidth = function () {
            return this.$DisplayObject[14 /* explicitWidth */];
        };
        /**
         * @private
         * 设置显示宽度
         */
        p.$setWidth = function (value) {
            this.$DisplayObject[14 /* explicitWidth */] = isNaN(value) ? NaN : value;
            value = +value;
            if (value < 0) {
                return false;
            }
            if (false) {
                var values = this.$DisplayObject;
                var originalBounds = this.$getOriginalBounds();
                var bounds = this.$getTransformedBounds(this.$parent, egret.$TempRectangle);
                var angle = values[4 /* rotation */] / 180 * Math.PI;
                var baseWidth = originalBounds.$getBaseWidth(angle);
                if (!baseWidth) {
                    return false;
                }
                var baseHeight = originalBounds.$getBaseHeight(angle);
                values[1 /* scaleY */] = bounds.height / baseHeight;
                values[0 /* scaleX */] = value / baseWidth;
            }
            this.invalidateMatrix();
            return true;
        };
        d(p, "height"
            /**
             * @language en_US
             * Indicates the height of the display object, in pixels. The height is calculated based on the bounds of the
             * content of the display object.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示显示对象的高度，以像素为单位。高度是根据显示对象内容的范围来计算的。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getHeight();
            }
            ,function (value) {
                this.$setHeight(value);
            }
        );
        /**
         * @private
         * 获取显示高度
         */
        p.$getHeight = function () {
            return isNaN(this.$getExplicitHeight()) ? this.$getOriginalBounds().height : this.$getExplicitHeight();
            //return this.$getTransformedBounds(this.$parent, $TempRectangle).height;
        };
        /**
         * @private
         *
         * @returns
         */
        p.$getExplicitHeight = function () {
            return this.$DisplayObject[15 /* explicitHeight */];
        };
        /**
         * @private
         * 设置显示高度
         */
        p.$setHeight = function (value) {
            this.$DisplayObject[15 /* explicitHeight */] = isNaN(value) ? NaN : value;
            value = +value;
            if (value < 0) {
                return false;
            }
            if (false) {
                var values = this.$DisplayObject;
                var originalBounds = this.$getOriginalBounds();
                var bounds = this.$getTransformedBounds(this.$parent, egret.$TempRectangle);
                var angle = values[4 /* rotation */] / 180 * Math.PI;
                var baseHeight = originalBounds.$getBaseHeight(angle);
                if (!baseHeight) {
                    return false;
                }
                var baseWidth = originalBounds.$getBaseWidth(angle);
                values[1 /* scaleY */] = value / baseHeight;
                values[0 /* scaleX */] = bounds.width / baseWidth;
            }
            this.invalidateMatrix();
            return true;
        };
        d(p, "measuredWidth"
            /**
             * 测量宽度
             * @returns {number}
             * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getOriginalBounds().width;
            }
        );
        d(p, "measuredHeight"
            /**
             * 测量高度
             * @returns {number}
             * @member {egret.Rectangle} egret.DisplayObject#measuredWidth
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getOriginalBounds().height;
            }
        );
        d(p, "anchorOffsetX"
            /**
             * @language en_US
             * X represents the object of which is the anchor.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示从对象绝对锚点X。
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$DisplayObject[12 /* anchorOffsetX */];
            }
            ,function (value) {
                this.$setAnchorOffsetX(value);
            }
        );
        /**
         * @private
         *
         * @param value
         * @returns
         */
        p.$setAnchorOffsetX = function (value) {
            value = egret.sys.getNumber(value);
            if (value == this.$DisplayObject[12 /* anchorOffsetX */]) {
                return false;
            }
            this.$DisplayObject[12 /* anchorOffsetX */] = value;
            this.invalidatePosition();
            return true;
        };
        d(p, "anchorOffsetY"
            /**
             * @language en_US
             * Y represents the object of which is the anchor.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示从对象绝对锚点Y。
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$DisplayObject[13 /* anchorOffsetY */];
            }
            ,function (value) {
                this.$setAnchorOffsetY(value);
            }
        );
        /**
         * @private
         *
         * @param value
         * @returns
         */
        p.$setAnchorOffsetY = function (value) {
            value = egret.sys.getNumber(value);
            if (value == this.$DisplayObject[13 /* anchorOffsetY */]) {
                return false;
            }
            this.$DisplayObject[13 /* anchorOffsetY */] = value;
            this.invalidatePosition();
            return true;
        };
        d(p, "visible"
            /**
             * @language en_US
             * Whether or not the display object is visible. Display objects that are not visible are disabled. For example,
             * if visible=false for an DisplayObject instance, it cannot receive touch or other user input.
             * @default true
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 显示对象是否可见。不可见的显示对象将被禁用。例如，如果实例的 visible 为 false，则无法接受触摸或用户交互操作。
             * @default true
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$visible;
            }
            ,function (value) {
                this.$setVisible(value);
            }
        );
        p.$setVisible = function (value) {
            value = !!value;
            if (value == this.$visible) {
                return false;
            }
            this.$visible = value;
            this.$invalidateTransform();
            return true;
        };
        d(p, "cacheAsBitmap"
            /**
             * @language en_US
             * If set to true, Egret runtime caches an internal bitmap representation of the display object. This caching can
             * increase performance for display objects that contain complex vector content. After you set the cacheAsBitmap
             * property to true, the rendering does not change, however the display object performs pixel snapping automatically.
             * The execution speed can be significantly faster depending on the complexity of the content.The cacheAsBitmap
             * property is best used with display objects that have mostly static content and that do not scale and rotate frequently.<br/>
             * Note: The display object will not create the bitmap caching when the memory exceeds the upper limit,even if you set it to true.
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 如果设置为 true，则 Egret 运行时将缓存显示对象的内部位图表示形式。此缓存可以提高包含复杂矢量内容的显示对象的性能。
             * 将 cacheAsBitmap 属性设置为 true 后，呈现并不更改，但是，显示对象将自动执行像素贴紧。执行速度可能会大大加快，
             * 具体取决于显示对象内容的复杂性。最好将 cacheAsBitmap 属性与主要具有静态内容且不频繁缩放或旋转的显示对象一起使用。<br/>
             * 注意：在内存超过上限的情况下，即使将 cacheAsBitmap 属性设置为 true，显示对象也不使用位图缓存。
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$DisplayObject[11 /* cacheAsBitmap */];
            }
            ,function (value) {
                value = !!value;
                this.$DisplayObject[11 /* cacheAsBitmap */] = value;
                var hasDisplayList = !!this.$displayList;
                if (hasDisplayList == value) {
                    return;
                }
                if (value) {
                    var displayList = egret.sys.DisplayList.create(this);
                    if (displayList) {
                        this.$displayList = displayList;
                        if (this.$parentDisplayList) {
                            displayList.setDevicePixelRatio(this.$parentDisplayList.$ratioMatrix.a);
                            this.$parentDisplayList.markDirty(displayList);
                        }
                        this.$cacheAsBitmapChanged();
                    }
                }
                else {
                    egret.sys.DisplayList.release(this.$displayList);
                    this.$displayList = null;
                    this.$cacheAsBitmapChanged();
                }
            }
        );
        /**
         * @private
         * cacheAsBitmap属性改变
         */
        p.$cacheAsBitmapChanged = function () {
            var parentCache = this.$displayList || this.$parentDisplayList;
            if (this.$renderRegion) {
                parentCache.markDirty(this);
            }
            this.$propagateFlagsDown(16 /* InvalidConcatenatedMatrix */ |
                32 /* InvalidInvertedConcatenatedMatrix */);
        };
        d(p, "alpha"
            /**
             * @language en_US
             * Indicates the alpha transparency value of the object specified. Valid values are 0 (fully transparent) to 1 (fully opaque).
             * The default value is 1. Display objects with alpha set to 0 are active, even though they are invisible.
             * @default 1
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示指定对象的 Alpha 透明度值。
             * 有效值为 0（完全透明）到 1（完全不透明）。alpha 设置为 0 的显示对象是可触摸的，即使它们不可见。
             * @default 1
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$alpha;
            }
            ,function (value) {
                this.$setAlpha(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setAlpha = function (value) {
            value = egret.sys.getNumber(value);
            if (value == this.$alpha) {
                return false;
            }
            this.$alpha = value;
            this.$propagateFlagsDown(64 /* InvalidConcatenatedAlpha */);
            this.$invalidate();
            return true;
        };
        /**
         * @private
         * 获取这个显示对象跟它所有父级透明度的乘积
         */
        p.$getConcatenatedAlpha = function () {
            if (this.$hasFlags(64 /* InvalidConcatenatedAlpha */)) {
                if (this.$parent) {
                    var parentAlpha = this.$parent.$getConcatenatedAlpha();
                    this.$renderAlpha = parentAlpha * this.$alpha;
                }
                else {
                    this.$renderAlpha = this.$alpha;
                }
                this.$removeFlags(64 /* InvalidConcatenatedAlpha */);
            }
            return this.$renderAlpha;
        };
        d(p, "touchEnabled"
            /**
             * @language en_US
             * Specifies whether this object receives touch or other user input. The default value is false, which means that
             * by default any DisplayObject instance that is on the display list cannot receive touch events. If touchEnabled is
             * set to false, the instance does not receive any touch events (or other user input events). Any children of
             * this instance on the display list are not affected. To change the touchEnabled behavior for all children of
             * an object on the display list, use DisplayObjectContainer.touchChildren.
             * @see egret.DisplayObjectContainer#touchChildren
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 指定此对象是否接收触摸或其他用户输入。默认值为 false，这表示默认情况下，显示列表上的任何 DisplayObject 实例都不会接收触摸事件或
             * 其他用户输入事件。如果将 touchEnabled 设置为 false，则实例将不接收任何触摸事件（或其他用户输入事件）。显示列表上的该实例的任
             * 何子级都不会受到影响。要更改显示列表上对象的所有子级的 touchEnabled 行为，请使用 DisplayObjectContainer.touchChildren。
             * @see egret.DisplayObjectContainer#touchChildren
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getTouchEnabled();
            }
            ,function (value) {
                this.$setTouchEnabled(value);
            }
        );
        /**
         * @private
         *
         * @returns
         */
        p.$getTouchEnabled = function () {
            return this.$touchEnabled;
        };
        /**
         * @private
         */
        p.$setTouchEnabled = function (value) {
            if (this.$touchEnabled == value) {
                return false;
            }
            this.$touchEnabled = value;
            return true;
        };
        d(p, "scrollRect"
            /**
             * @language en_US
             * The scroll rectangle bounds of the display object. The display object is cropped to the size defined by the rectangle,
             * and it scrolls within the rectangle when you change the x and y properties of the scrollRect object. A scrolled display
             * object always scrolls in whole pixel increments.You can scroll an object left and right by setting the x property of
             * the scrollRect Rectangle object. You can scroll an object up and down by setting the y property of the scrollRect
             * Rectangle object. If the display object is rotated 90° and you scroll it left and right, the display object actually
             * scrolls up and down.<br/>
             *
             * Note: to change the value of a display object's scrollRect, you must make a copy of the entire scrollRect object, then copy
             * the new object into the scrollRect property of the display object.
             * @example the following code increases the x value of a display object's scrollRect
             * <pre>
             *     var myRectangle:Rectangle = myDisplayObject.scrollRect;
             *     myRectangle.x += 10;
             *     myDisplayObject.scrollRect = myRectangle;
             * </pre>
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 显示对象的滚动矩形范围。显示对象被裁切为矩形定义的大小，当您更改 scrollRect 对象的 x 和 y 属性时，它会在矩形内滚动。
             * 滚动的显示对象始终以整像素为增量进行滚动。您可以通过设置 scrollRect Rectangle 对象的 x 属性来左右滚动对象， 还可以通过设置
             * scrollRect 对象的 y 属性来上下滚动对象。如果显示对象旋转了 90 度，并且您左右滚动它，则实际上显示对象会上下滚动。<br/>
             *
             * 注意：要改变一个显示对象 scrollRect 属性的值，您必引用整个 scrollRect 对象，然后将它重新赋值给显示对象的 scrollRect 属性。
             * @example 以下代码改变了显示对象 scrollRect 的 x 属性值：
             * <pre>
             *     var myRectangle:Rectangle = myDisplayObject.scrollRect;
             *     myRectangle.x += 10;
             *     myDisplayObject.scrollRect = myRectangle;//设置完scrollRect的x、y、width、height值之后，一定要对myDisplayObject重新赋值scrollRect，不然会出问题。
             * </pre>
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$scrollRect;
            }
            ,function (value) {
                this.$setScrollRect(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setScrollRect = function (value) {
            if (!value && !this.$scrollRect) {
                return false;
            }
            if (value) {
                if (!this.$scrollRect) {
                    this.$scrollRect = new egret.Rectangle();
                }
                this.$scrollRect.copyFrom(value);
            }
            else {
                this.$scrollRect = null;
            }
            this.invalidatePosition();
            return true;
        };
        d(p, "blendMode"
            /**
             * @language en_US
             * A value from the BlendMode class that specifies which blend mode to use. Determine how a source image (new one)
             * is drawn on the target image (old one).<br/>
             * If you attempt to set this property to an invalid value, Egret runtime set the value to BlendMode.NORMAL.
             * @default egret.BlendMode.NORMAL
             * @see egret.BlendMode
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * BlendMode 枚举中的一个值，用于指定要使用的混合模式，确定如何将一个源（新的）图像绘制到目标（已有）的图像上<br/>
             * 如果尝试将此属性设置为无效值，则运行时会将此值设置为 BlendMode.NORMAL。
             * @default egret.BlendMode.NORMAL
             * @see egret.BlendMode
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return egret.sys.numberToBlendMode(this.$blendMode);
            }
            ,function (value) {
                var mode = egret.sys.blendModeToNumber(value);
                if (mode == this.$blendMode) {
                    return;
                }
                this.$blendMode = mode;
                this.$invalidateTransform();
            }
        );
        d(p, "mask"
            /**
             * @language en_US
             * The calling display object is masked by the specified mask object. To ensure that masking works when the Stage
             * is scaled, the mask display object must be in an active part of the display list. The mask object itself is not drawn.
             * Set mask to null to remove the mask. To be able to scale a mask object, it must be on the display list. To be
             * able to drag a mask object , it must be on the display list.<br/>
             * Note: A single mask object cannot be used to mask more than one calling display object. When the mask is assigned
             * to a second display object, it is removed as the mask of the first object, and that object's mask property becomes null.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 调用显示对象被指定的 mask 对象遮罩。要确保当舞台缩放时蒙版仍然有效，mask 显示对象必须处于显示列表的活动部分。
             * 但不绘制 mask 对象本身。将 mask 设置为 null 可删除蒙版。要能够缩放遮罩对象，它必须在显示列表中。要能够拖动蒙版
             * 对象，它必须在显示列表中。<br/>
             * 注意：单个 mask 对象不能用于遮罩多个执行调用的显示对象。在将 mask 分配给第二个显示对象时，会撤消其作为第一个对象的遮罩，
             * 该对象的 mask 属性将变为 null。
             *
             * 下面例子为 mask 为 Rectangle 类型对象，这种情况下，修改 mask 的值后，一定要对 myDisplayObject 重新赋值 mask，不然会出问题。
             * @example 以下代码改变了显示对象 mask 的 x 属性值：
             * <pre>
             *     var myMask:Rectangle = myDisplayObject.mask;
             *     myMask.x += 10;
             *     myDisplayObject.mask = myMask;//设置完 mask 的x、y、width、height值之后，一定要对myDisplayObject重新赋值 mask，不然会出问题。
             * </pre>
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$mask ? this.$mask : this.$maskRect;
            }
            ,function (value) {
                if (value === this) {
                    return;
                }
                if (value) {
                    if (value instanceof DisplayObject) {
                        if (value == this.$mask) {
                            return;
                        }
                        if (value.$maskedObject) {
                            value.$maskedObject.mask = null;
                        }
                        value.$maskedObject = this;
                        this.$mask = value;
                        this.$maskRect = null;
                    }
                    else {
                        this.$setMaskRect(value);
                        this.$mask = null;
                    }
                }
                else {
                    this.$mask = null;
                    this.$maskRect = null;
                }
                this.$invalidateTransform();
            }
        );
        p.$setMaskRect = function (value) {
            if (!value && !this.$maskRect) {
                return false;
            }
            if (value) {
                if (!this.$maskRect) {
                    this.$maskRect = new egret.Rectangle();
                }
                this.$maskRect.copyFrom(value);
            }
            else {
                this.$maskRect = null;
            }
            this.invalidatePosition();
            return true;
        };
        /**
         * @language en_US
         * Returns a rectangle that defines the area of the display object relative to the coordinate system of the targetCoordinateSpace object.
         * @param targetCoordinateSpace The display object that defines the coordinate system to use.
         * @param resultRect A reusable instance of Rectangle for saving the results. Passing this parameter can reduce the number of reallocate objects
         *, which allows you to get better code execution performance..
         * @returns The rectangle that defines the area of the display object relative to the targetCoordinateSpace object's coordinate system.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回一个矩形，该矩形定义相对于 targetCoordinateSpace 对象坐标系的显示对象区域。
         * @param targetCoordinateSpace 定义要使用的坐标系的显示对象。
         * @param resultRect 一个用于存储结果的可复用Rectangle实例，传入此参数能够减少内部创建对象的次数，从而获得更高的运行性能。
         * @returns 定义与 targetCoordinateSpace 对象坐标系统相关的显示对象面积的矩形。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getTransformedBounds = function (targetCoordinateSpace, resultRect) {
            targetCoordinateSpace = targetCoordinateSpace || this;
            return this.$getTransformedBounds(targetCoordinateSpace, resultRect);
        };
        /**
         * @language en_US
         * Obtain measurement boundary of display object
         * @param resultRect {Rectangle} Optional. It is used to import Rectangle object for saving results, preventing duplicate object creation.
         * @param calculateAnchor {boolean} Optional. It is used to determine whether to calculate anchor point.
         * @returns {Rectangle}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取显示对象的测量边界
         * @param resultRect {Rectangle} 可选参数，传入用于保存结果的Rectangle对象，避免重复创建对象。
         * @param calculateAnchor {boolean} 可选参数，是否会计算锚点。
         * @returns {Rectangle}
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getBounds = function (resultRect, calculateAnchor) {
            if (calculateAnchor === void 0) { calculateAnchor = true; }
            resultRect = this.$getTransformedBounds(this, resultRect);
            if (calculateAnchor) {
                var values = this.$DisplayObject;
                if (values[12 /* anchorOffsetX */] != 0 || values[13 /* anchorOffsetY */] != 0) {
                    resultRect.x -= values[12 /* anchorOffsetX */];
                    resultRect.y -= values[13 /* anchorOffsetY */];
                }
            }
            return resultRect;
        };
        /**
         * @private
         */
        p.$getTransformedBounds = function (targetCoordinateSpace, resultRect) {
            var bounds = this.$getOriginalBounds();
            if (!resultRect) {
                resultRect = new egret.Rectangle();
            }
            resultRect.copyFrom(bounds);
            if (targetCoordinateSpace == this || resultRect.isEmpty()) {
                return resultRect;
            }
            var m;
            if (targetCoordinateSpace) {
                m = egret.$TempMatrix;
                var invertedTargetMatrix = targetCoordinateSpace.$getInvertedConcatenatedMatrix();
                invertedTargetMatrix.$preMultiplyInto(this.$getConcatenatedMatrix(), m);
            }
            else {
                m = this.$getConcatenatedMatrix();
            }
            m.$transformBounds(resultRect);
            return resultRect;
        };
        /**
         * @language en_US
         * Converts the point object from the Stage (global) coordinates to the display object's (local) coordinates.
         * @param stageX the x value in the global coordinates
         * @param stageY the y value in the global coordinates
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns A Point object with coordinates relative to the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将从舞台（全局）坐标转换为显示对象的（本地）坐标。
         * @param stageX 舞台坐标x
         * @param stageY 舞台坐标y
         * @param resultPoint 一个用于存储结果的可复用 Point 实例，传入此参数能够减少内部创建对象的次数，从而获得更高的运行性能。
         * @returns 具有相对于显示对象的坐标的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.globalToLocal = function (stageX, stageY, resultPoint) {
            if (stageX === void 0) { stageX = 0; }
            if (stageY === void 0) { stageY = 0; }
            var m = this.$getInvertedConcatenatedMatrix();
            return m.transformPoint(stageX, stageY, resultPoint);
        };
        /**
         * @language en_US
         * Converts the point object from the display object's (local) coordinates to the Stage (global) coordinates.
         * @param localX the x value in the local coordinates
         * @param localY the x value in the local coordinates
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns  A Point object with coordinates relative to the Stage.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将显示对象的（本地）坐标转换为舞台（全局）坐标。
         * @param localX 本地坐标 x
         * @param localY 本地坐标 y
         * @param resultPoint 一个用于存储结果的可复用 Point 实例，传入此参数能够减少内部创建对象的次数，从而获得更高的运行性能。
         * @returns 一个具有相对于舞台坐标的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.localToGlobal = function (localX, localY, resultPoint) {
            if (localX === void 0) { localX = 0; }
            if (localY === void 0) { localY = 0; }
            var m = this.$getConcatenatedMatrix();
            return m.transformPoint(localX, localY, resultPoint);
        };
        /**
         * @private
         * 标记自身的测量尺寸失效
         */
        p.$invalidateContentBounds = function () {
            this.$invalidate();
            this.$setFlags(2 /* InvalidContentBounds */);
            this.$propagateFlagsUp(4 /* InvalidBounds */);
        };
        /**
         * @private
         * 获取显示对象占用的矩形区域集合，通常包括自身绘制的测量区域，如果是容器，还包括所有子项占据的区域。
         */
        p.$getOriginalBounds = function () {
            var bounds = this.$DisplayObject[9 /* bounds */];
            if (this.$hasFlags(4 /* InvalidBounds */)) {
                bounds.copyFrom(this.$getContentBounds());
                this.$measureChildBounds(bounds);
                this.$removeFlags(4 /* InvalidBounds */);
                if (this.$displayList) {
                    this.$displayList.$renderRegion.moved = true;
                }
            }
            return bounds;
        };
        /**
         * @private
         * 测量子项占用的矩形区域
         * @param bounds 测量结果存储在这个矩形对象内
         */
        p.$measureChildBounds = function (bounds) {
        };
        /**
         * @private
         */
        p.$getContentBounds = function () {
            var bounds = this.$DisplayObject[10 /* contentBounds */];
            if (this.$hasFlags(2 /* InvalidContentBounds */)) {
                this.$measureContentBounds(bounds);
                if (this.$renderRegion) {
                    this.$renderRegion.moved = true;
                }
                this.$removeFlags(2 /* InvalidContentBounds */);
            }
            return bounds;
        };
        /**
         * @private
         * 测量自身占用的矩形区域，注意：此测量结果并不包括子项占据的区域。
         * @param bounds 测量结果存储在这个矩形对象内
         */
        p.$measureContentBounds = function (bounds) {
        };
        /**
         * @private
         * 标记此显示对象需要重绘。此方法会触发自身的cacheAsBitmap重绘。如果只是矩阵改变，自身显示内容并不改变，应该调用$invalidateTransform().
         * @param notiryChildren 是否标记子项也需要重绘。传入false或不传入，将只标记自身需要重绘。注意:当子项cache时不会继续向下标记
         */
        p.$invalidate = function (notifyChildren) {
            if (!this.$renderRegion || this.$hasFlags(256 /* DirtyRender */)) {
                return;
            }
            this.$setFlags(256 /* DirtyRender */);
            var displayList = this.$displayList ? this.$displayList : this.$parentDisplayList;
            if (displayList) {
                displayList.markDirty(this);
            }
        };
        /**
         * @private
         * 标记自身以及所有子项在父级中变换叠加的显示内容失效。此方法不会触发自身的cacheAsBitmap重绘。
         * 通常用于矩阵改变或从显示列表添加和移除时。若自身的显示内容已经改变需要重绘，应该调用$invalidate()。
         */
        p.$invalidateTransform = function () {
            if (this.$hasFlags(512 /* DirtyChildren */)) {
                return;
            }
            this.$setFlags(512 /* DirtyChildren */);
            var displayList = this.$displayList;
            if ((displayList || this.$renderRegion) && this.$parentDisplayList) {
                this.$parentDisplayList.markDirty(displayList || this);
            }
        };
        /**
         * @private
         * 更新对象在舞台上的显示区域和透明度,返回显示区域是否发生改变。
         */
        p.$update = function (bounds) {
            this.$removeFlagsUp(768 /* Dirty */);
            this.$getConcatenatedAlpha();
            //必须在访问moved属性前调用以下两个方法，因为moved属性在以下两个方法内重置。
            var concatenatedMatrix = this.$getConcatenatedMatrix();
            var renderBounds = bounds || this.$getContentBounds();
            var displayList = this.$displayList || this.$parentDisplayList;
            var region = this.$renderRegion;
            if (!displayList) {
                region.setTo(0, 0, 0, 0);
                region.moved = false;
                return false;
            }
            if (!region.moved && !displayList.$ratioChanged) {
                return false;
            }
            region.moved = false;
            var matrix = this.$renderMatrix;
            matrix.copyFrom(concatenatedMatrix);
            var root = displayList.root;
            if (root !== this.$stage) {
                this.$getConcatenatedMatrixAt(root, matrix);
            }
            displayList.$ratioMatrix.$preMultiplyInto(matrix, matrix);
            region.updateRegion(renderBounds, matrix);
            return true;
        };
        /**
         * @private
         * 获取相对于指定根节点的连接矩阵。
         * @param root 根节点显示对象
         * @param matrix 目标显示对象相对于舞台的完整连接矩阵。
         */
        p.$getConcatenatedMatrixAt = function (root, matrix) {
            var invertMatrix = root.$getInvertedConcatenatedMatrix();
            if (invertMatrix.a === 0 || invertMatrix.d === 0) {
                var target = this;
                var rootLevel = root.$nestLevel;
                matrix.identity();
                while (target.$nestLevel > rootLevel) {
                    var rect = target.$scrollRect;
                    if (rect) {
                        matrix.concat(egret.$TempMatrix.setTo(1, 0, 0, 1, -rect.x, -rect.y));
                    }
                    matrix.concat(target.$getMatrix());
                    target = target.$parent;
                }
            }
            else {
                invertMatrix.$preMultiplyInto(matrix, matrix);
            }
        };
        /**
         * @private
         * 执行渲染,绘制自身到屏幕
         */
        p.$render = function (context) {
        };
        /**
         * @private
         */
        p.$hitTest = function (stageX, stageY) {
            var values = this.$DisplayObject;
            if (!this.$renderRegion || !this.$visible || values[0 /* scaleX */] == 0 || values[1 /* scaleY */] == 0) {
                return null;
            }
            var m = this.$getInvertedConcatenatedMatrix();
            if (m.a == 0 && m.b == 0 && m.c == 0 && m.d == 0) {
                return null;
            }
            var bounds = this.$getContentBounds();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            if (bounds.contains(localX, localY)) {
                if (!this.$children) {
                    var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
                    if (rect && !rect.contains(localX, localY)) {
                        return null;
                    }
                    if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                        return null;
                    }
                }
                return this;
            }
            return null;
        };
        /**
         * @language en_US
         * Calculate the display object to determine whether it overlaps or crosses with the points specified by the x and y parameters. The x and y parameters specify the points in the coordinates of the stage, rather than the points in the display object container that contains display objects (except the situation where the display object container is a stage).
         * Note: Don't use accurate pixel collision detection on a large number of objects. Otherwise, this will cause serious performance deterioration.
         * @param x {number}  x coordinate of the object to be tested.
         * @param y {number}  y coordinate of the object to be tested.
         * @param shapeFlag {boolean} Whether to check the actual pixel of object (true) or check that of border (false).Write realized.
         * @returns {boolean} If display object overlaps or crosses with the specified point, it is true; otherwise, it is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 计算显示对象，以确定它是否与 x 和 y 参数指定的点重叠或相交。x 和 y 参数指定舞台的坐标空间中的点，而不是包含显示对象的显示对象容器中的点（除非显示对象容器是舞台）。
         * 注意，不要在大量物体中使用精确碰撞像素检测，这回带来巨大的性能开销
         * @param x {number}  要测试的此对象的 x 坐标。
         * @param y {number}  要测试的此对象的 y 坐标。
         * @param shapeFlag {boolean} 是检查对象 (true) 的实际像素，还是检查边框 (false) 的实际像素。
         * @returns {boolean} 如果显示对象与指定的点重叠或相交，则为 true；否则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.hitTestPoint = function (x, y, shapeFlag) {
            if (!shapeFlag) {
                var values = this.$DisplayObject;
                if (values[0 /* scaleX */] == 0 || values[1 /* scaleY */] == 0) {
                    return false;
                }
                var m = this.$getInvertedConcatenatedMatrix();
                var bounds = this.getBounds();
                var localX = m.a * x + m.c * y + m.tx;
                var localY = m.b * x + m.d * y + m.ty;
                if (bounds.contains(localX, localY)) {
                    //这里不考虑设置mask的情况
                    var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
                    if (rect && !rect.contains(localX, localY)) {
                        return false;
                    }
                    return true;
                }
                return false;
            }
            else {
                var m = this.$getInvertedConcatenatedMatrix();
                var localX = m.a * x + m.c * y + m.tx;
                var localY = m.b * x + m.d * y + m.ty;
                var rectangle = egret.Rectangle.create();
                rectangle.setTo(localX, localY, 3, 3);
                var renderTexture = new egret.RenderTexture();
                renderTexture.drawToTexture(this, rectangle);
                var context = renderTexture["context"];
                var data;
                try {
                    data = context.getImageData(0, 0, 1, 1).data;
                }
                catch (e) {
                    throw new Error(egret.sys.tr(1040));
                }
                var result = true;
                if (data[3] === 0) {
                    result = false;
                }
                egret.Rectangle.release(rectangle);
                renderTexture.dispose();
                return result;
            }
        };
        /**
         * @private
         */
        p.$addListener = function (type, listener, thisObject, useCapture, priority, dispatchOnce) {
            _super.prototype.$addListener.call(this, type, listener, thisObject, useCapture, priority, dispatchOnce);
            var isEnterFrame = (type == egret.Event.ENTER_FRAME);
            if (isEnterFrame || type == egret.Event.RENDER) {
                var list = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
                if (list.indexOf(this) == -1) {
                    list.push(this);
                }
            }
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.removeEventListener = function (type, listener, thisObject, useCapture) {
            _super.prototype.removeEventListener.call(this, type, listener, thisObject, useCapture);
            var isEnterFrame = (type == egret.Event.ENTER_FRAME);
            if ((isEnterFrame || type == egret.Event.RENDER) && !this.hasEventListener(type)) {
                var list = isEnterFrame ? DisplayObject.$enterFrameCallBackList : DisplayObject.$renderCallBackList;
                var index = list.indexOf(this);
                if (index !== -1) {
                    list.splice(index, 1);
                }
            }
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.dispatchEvent = function (event) {
            if (!event.$bubbles) {
                return _super.prototype.dispatchEvent.call(this, event);
            }
            var list = this.$getPropagationList(this);
            var targetIndex = list.length * 0.5;
            event.$setTarget(this);
            this.$dispatchPropagationEvent(event, list, targetIndex);
            return !event.$isDefaultPrevented;
        };
        /**
         * @private
         * 获取事件流列表。注意：Egret框架的事件流与Flash实现并不一致。
         *
         * 事件流有三个阶段：捕获，目标，冒泡。
         * Flash里默认的的事件监听若不开启useCapture将监听目标和冒泡阶段。若开始capture将只能监听捕获当不包括目标的事件。
         * 可以在Flash中写一个简单的测试：实例化一个非容器显示对象，例如TextField。分别监听useCapture为true和false时的鼠标事件。
         * 点击后将只有useCapture为false的回调函数输出信息。也就带来一个问题「Flash的捕获阶段不能监听到最内层对象本身，只在父级列表有效」。
         *
         * 而HTML里的事件流设置useCapture为true时是能监听到目标阶段的，也就是目标阶段会被触发两次，在捕获和冒泡过程各触发一次。这样可以避免
         * 前面提到的监听捕获无法监听目标本身的问题。
         *
         * Egret最终采用了HTML里目标节点触发两次的事件流方式。
         */
        p.$getPropagationList = function (target) {
            var list = [];
            while (target) {
                list.push(target);
                target = target.$parent;
            }
            var captureList = list.concat();
            captureList.reverse(); //使用一次reverse()方法比多次调用unshift()性能高。
            list = captureList.concat(list);
            return list;
        };
        /**
         * @private
         */
        p.$dispatchPropagationEvent = function (event, list, targetIndex) {
            var length = list.length;
            var captureIndex = targetIndex - 1;
            for (var i = 0; i < length; i++) {
                var currentTarget = list[i];
                event.$currentTarget = currentTarget;
                if (i < captureIndex)
                    event.$eventPhase = 1 /* CAPTURING_PHASE */;
                else if (i == targetIndex || i == captureIndex)
                    event.$eventPhase = 2 /* AT_TARGET */;
                else
                    event.$eventPhase = 3 /* BUBBLING_PHASE */;
                currentTarget.$notifyListener(event, i < targetIndex);
                if (event.$isPropagationStopped || event.$isPropagationImmediateStopped) {
                    return;
                }
            }
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.willTrigger = function (type) {
            var parent = this;
            while (parent) {
                if (parent.hasEventListener(type))
                    return true;
                parent = parent.$parent;
            }
            return false;
        };
        /**
         * @private
         * @language en_US
         * The default touchEnabled property of DisplayObject
         * @default false
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @private
         * @language zh_CN
         * 显示对象默认的 touchEnabled 属性
         * @default false
         * @version Egret 2.5
         * @platform Web,Native
         */
        DisplayObject.defaultTouchEnabled = false;
        /**
         * @private
         */
        DisplayObject.$enterFrameCallBackList = [];
        /**
         * @private
         */
        DisplayObject.$renderCallBackList = [];
        return DisplayObject;
    })(egret.EventDispatcher);
    egret.DisplayObject = DisplayObject;
    egret.registerClass(DisplayObject,'egret.DisplayObject',["egret.sys.Renderable"]);
    if (DEBUG) {
        egret.$markReadOnly(DisplayObject, "parent");
        egret.$markReadOnly(DisplayObject, "stage");
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The Bitmap class represents display objects that represent bitmap images.
     * The Bitmap() constructor allows you to create a Bitmap object that contains a reference to a BitmapData object.
     * After you create a Bitmap object, use the addChild() or addChildAt() method of the parent DisplayObjectContainer
     * instance to place the bitmap on the display list.A Bitmap object can share its texture reference among several
     * Bitmap objects, independent of translation or rotation properties. Because you can create multiple Bitmap objects
     * that reference the same texture object, multiple display objects can use the same complex texture object
     * without incurring the memory overhead of a texture object for each display object instance.
     *
     * @see egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Bitmap.ts
     */
    /**
     * @language zh_CN
     * Bitmap 类表示用于显示位图图片的显示对象。
     * 利用 Bitmap() 构造函数，可以创建包含对 BitmapData 对象引用的 Bitmap 对象。创建了 Bitmap 对象后，
     * 使用父级 DisplayObjectContainer 实例的 addChild() 或 addChildAt() 方法可以将位图放在显示列表中。
     * 一个 Bitmap 对象可在若干 Bitmap 对象之中共享其 texture 引用，与缩放或旋转属性无关。
     * 由于能够创建引用相同 texture 对象的多个 Bitmap 对象，因此，多个显示对象可以使用相同的 texture 对象，
     * 而不会因为每个显示对象实例使用一个 texture 对象而产生额外内存开销。
     *
     * @see egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Bitmap.ts
     */
    var Bitmap = (function (_super) {
        __extends(Bitmap, _super);
        /**
         * @language en_US
         * Initializes a Bitmap object to refer to the specified BitmapData|Texture object.
         * @param value The BitmapData|Texture object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个引用指定 BitmapData|Texture 实例的 Bitmap 对象
         * @param value 被引用的 BitmapData|Texture 实例
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Bitmap(value) {
            _super.call(this);
            /**
             * @private
             */
            this.$scale9Grid = null;
            /**
             * @private
             */
            this.$fillMode = "scale";
            /**
             * @private
             */
            this.$smoothing = true;
            this._pixelHitTest = false;
            this.$renderRegion = new egret.sys.Region();
            this.$Bitmap = {
                0: null,
                1: null,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: true,
                11: NaN,
                12: NaN //explicitBitmapHeight,
            };
            this.$setBitmapData(value);
        }
        var d = __define,c=Bitmap,p=c.prototype;
        /**
         * @private
         * 显示对象添加到舞台
         */
        p.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            var bitmapData = this.$Bitmap[0 /* bitmapData */];
            if (bitmapData) {
                if (bitmapData instanceof egret.Texture) {
                    egret.Texture.$addDisplayObject(this, bitmapData._bitmapData.hashCode);
                }
                else {
                    egret.Texture.$addDisplayObject(this, bitmapData.hashCode);
                }
            }
        };
        /**
         * @private
         * 显示对象从舞台移除
         */
        p.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            var bitmapData = this.$Bitmap[0 /* bitmapData */];
            if (bitmapData) {
                if (bitmapData instanceof egret.Texture) {
                    egret.Texture.$removeDisplayObject(this, bitmapData._bitmapData.hashCode);
                }
                else {
                    egret.Texture.$removeDisplayObject(this, bitmapData.hashCode);
                }
            }
        };
        d(p, "bitmapData"
            /**
             * @language en_US
             * The BitmapData object being referenced.
             * If you pass the constructor of type Texture or last set for texture, this value returns null.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 被引用的 BitmapData 对象。
             * 如果传入构造函数的类型为 Texture 或者最后设置的为 texture，则此值返回 null。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                var value = this.$Bitmap[0 /* bitmapData */];
                if (value instanceof egret.Texture) {
                    return null;
                }
                else {
                    return value;
                }
            }
            ,function (value) {
                this.$setBitmapData(value);
            }
        );
        d(p, "texture"
            /**
             * @language en_US
             * The Texture object being referenced.
             * If you pass the constructor of type BitmapData or last set for bitmapData, this value returns null.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 被引用的 Texture 对象。
             * 如果传入构造函数的类型为 BitmapData 或者最后设置的为 bitmapData，则此值返回 null。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                var value = this.$Bitmap[0 /* bitmapData */];
                if (value instanceof egret.Texture) {
                    return value;
                }
                else {
                    return null;
                }
            }
            ,function (value) {
                this.$setBitmapData(value);
            }
        );
        /**
         * @private
         */
        p.$setBitmapData = function (value) {
            var values = this.$Bitmap;
            var oldBitmapData = values[0 /* bitmapData */];
            if (value == oldBitmapData) {
                return false;
            }
            values[0 /* bitmapData */] = value;
            if (value) {
                this.$refreshImageData();
            }
            else {
                this.setImageData(null, 0, 0, 0, 0, 0, 0, 0, 0);
                this.$invalidateContentBounds();
                return true;
            }
            if (this.$stage) {
                if (oldBitmapData) {
                    if (oldBitmapData instanceof egret.Texture) {
                        egret.Texture.$addDisplayObject(this, oldBitmapData._bitmapData.hashCode);
                    }
                    else {
                        egret.Texture.$addDisplayObject(this, oldBitmapData.hashCode);
                    }
                }
                if (value instanceof egret.Texture) {
                    egret.Texture.$addDisplayObject(this, value._bitmapData.hashCode);
                }
                else {
                    egret.Texture.$addDisplayObject(this, value.hashCode);
                }
            }
            this.$invalidateContentBounds();
            return true;
        };
        /**
         * @private
         */
        p.$refreshImageData = function () {
            var values = this.$Bitmap;
            var bitmapData = values[0 /* bitmapData */];
            if (bitmapData) {
                if (bitmapData instanceof egret.Texture) {
                    var texture = bitmapData;
                    this.setImageData(texture._bitmapData, texture._bitmapX, texture._bitmapY, texture._bitmapWidth, texture._bitmapHeight, texture._offsetX, texture._offsetY, texture.$getTextureWidth(), texture.$getTextureHeight());
                }
                else {
                    this.setImageData(bitmapData, 0, 0, bitmapData.width, bitmapData.height, 0, 0, bitmapData.width, bitmapData.height);
                }
            }
        };
        /**
         * @private
         */
        p.setImageData = function (image, clipX, clipY, clipWidth, clipHeight, offsetX, offsetY, width, height) {
            var values = this.$Bitmap;
            values[1 /* image */] = image;
            values[2 /* clipX */] = clipX;
            values[3 /* clipY */] = clipY;
            values[4 /* clipWidth */] = clipWidth;
            values[5 /* clipHeight */] = clipHeight;
            values[6 /* offsetX */] = offsetX;
            values[7 /* offsetY */] = offsetY;
            values[8 /* width */] = width;
            values[9 /* height */] = height;
        };
        d(p, "scale9Grid"
            /**
             * @language en_US
             * Represent a Rectangle Area that the 9 scale area of Image.
             * Notice: This property is valid only when <code>fillMode</code>
             * is <code>BitmapFillMode.SCALE</code>.
             *
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 矩形区域，它定义素材对象的九个缩放区域。
             * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
             *
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$scale9Grid;
            }
            ,function (value) {
                this.$scale9Grid = value;
                this.$invalidateContentBounds();
            }
        );
        d(p, "fillMode"
            /**
             * @language en_US
             * Determines how the bitmap fills in the dimensions.
             * <p>When set to <code>BitmapFillMode.REPEAT</code>, the bitmap
             * repeats to fill the region.</p>
             * <p>When set to <code>BitmapFillMode.SCALE</code>, the bitmap
             * stretches to fill the region.</p>
             *
             * @default <code>BitmapFillMode.SCALE</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web
             */
            /**
             * @language zh_CN
             * 确定位图填充尺寸的方式。
             * <p>设置为 <code>BitmapFillMode.REPEAT</code>时，位图将重复以填充区域。</p>
             * <p>设置为 <code>BitmapFillMode.SCALE</code>时，位图将拉伸以填充区域。</p>
             *
             * @default <code>BitmapFillMode.SCALE</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web
             */
            ,function () {
                return this.$fillMode;
            }
            ,function (value) {
                this.$setFillMode(value);
            }
        );
        p.$setFillMode = function (value) {
            if (value == this.$fillMode) {
                return false;
            }
            this.$fillMode = value;
            return true;
        };
        d(p, "smoothing"
            /**
             * @language en_US
             * Whether or not the bitmap is smoothed when scaled.
             * @default true。
             * @version Egret 2.4
             * @platform Web
             */
            /**
             * @language zh_CN
             * 控制在缩放时是否对位图进行平滑处理。
             * @default true。
             * @version Egret 2.4
             * @platform Web
             */
            ,function () {
                return this.$smoothing;
            }
            ,function (value) {
                value = !!value;
                if (value == this.$smoothing) {
                    return;
                }
                this.$smoothing = value;
                this.$invalidate();
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setWidth = function (value) {
            //value = +value || 0;
            var values = this.$Bitmap;
            if (value < 0 || value == values[11 /* explicitBitmapWidth */]) {
                return false;
            }
            values[11 /* explicitBitmapWidth */] = value;
            this.$invalidateContentBounds();
            return true;
        };
        /**
         * @private
         *
         * @param value
         */
        p.$setHeight = function (value) {
            //value = +value || 0;
            var values = this.$Bitmap;
            if (value < 0 || value == values[12 /* explicitBitmapHeight */]) {
                return false;
            }
            values[12 /* explicitBitmapHeight */] = value;
            this.$invalidateContentBounds();
            return true;
        };
        /**
         * @private
         * 获取显示宽度
         */
        p.$getWidth = function () {
            var values = this.$Bitmap;
            return isNaN(values[11 /* explicitBitmapWidth */]) ? this.$getContentBounds().width : values[11 /* explicitBitmapWidth */];
        };
        /**
         * @private
         * 获取显示宽度
         */
        p.$getHeight = function () {
            var values = this.$Bitmap;
            return isNaN(values[12 /* explicitBitmapHeight */]) ? this.$getContentBounds().height : values[12 /* explicitBitmapHeight */];
        };
        /**
         * @private
         */
        p.$measureContentBounds = function (bounds) {
            var values = this.$Bitmap;
            if (values[1 /* image */]) {
                var values = this.$Bitmap;
                var w = !isNaN(values[11 /* explicitBitmapWidth */]) ? values[11 /* explicitBitmapWidth */] : values[8 /* width */];
                var h = !isNaN(values[12 /* explicitBitmapHeight */]) ? values[12 /* explicitBitmapHeight */] : values[9 /* height */];
                bounds.setTo(0, 0, w, h);
            }
            else {
                w = !isNaN(values[11 /* explicitBitmapWidth */]) ? values[11 /* explicitBitmapWidth */] : 0;
                h = !isNaN(values[12 /* explicitBitmapHeight */]) ? values[12 /* explicitBitmapHeight */] : 0;
                bounds.setTo(0, 0, w, h);
            }
        };
        /**
         * @private
         */
        p.$render = function (context) {
            var values = this.$Bitmap;
            if (values[1 /* image */]) {
                var destW = !isNaN(values[11 /* explicitBitmapWidth */]) ? values[11 /* explicitBitmapWidth */] : values[8 /* width */];
                var destH = !isNaN(values[12 /* explicitBitmapHeight */]) ? values[12 /* explicitBitmapHeight */] : values[9 /* height */];
                Bitmap.$drawImage(context, values[1 /* image */], values[2 /* clipX */], values[3 /* clipY */], values[4 /* clipWidth */], values[5 /* clipHeight */], values[6 /* offsetX */], values[7 /* offsetY */], values[8 /* width */], values[9 /* height */], destW, destH, this.scale9Grid || values[0 /* bitmapData */]["scale9Grid"], this.fillMode, this.$smoothing);
            }
        };
        d(p, "pixelHitTest"
            /**
             * @language en_US
             * Specifies whether this object use precise hit testing by checking the alpha value of each pixel.If pixelHitTest
             * is set to true,the transparent area of the bitmap will be touched through.<br/>
             * Note:If the image is loaded from cross origin,that we can't access to the pixel data,so it might cause
             * the pixelHitTest property invalid.
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 是否开启精确像素碰撞。设置为true显示对象本身的透明区域将能够被穿透。<br/>
             * 注意：若图片资源是以跨域方式从外部服务器加载的，将无法访问图片的像素数据，而导致此属性失效。
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._pixelHitTest;
            }
            ,function (value) {
                this._pixelHitTest = !!value;
            }
        );
        p.$hitTest = function (stageX, stageY) {
            var target = _super.prototype.$hitTest.call(this, stageX, stageY);
            if (target && this._pixelHitTest) {
                target = this.hitTestPixel(stageX, stageY);
            }
            return target;
        };
        /**
         * @private
         */
        p.hitTestPixel = function (stageX, stageY) {
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var context;
            var data;
            var displayList = this.$displayList;
            if (displayList) {
                context = displayList.renderContext;
                try {
                    data = context.getImageData(localX - displayList.offsetX, localY - displayList.offsetY, 1, 1).data;
                }
                catch (e) {
                    console.log(this.$Bitmap[0 /* bitmapData */]);
                    throw new Error(egret.sys.tr(1039));
                }
            }
            else {
                context = egret.sys.hitTestRenderContext;
                context.surface.width = context.surface.height = 3;
                context.translate(1 - localX, 1 - localY);
                this.$render(context);
                try {
                    data = context.getImageData(1, 1, 1, 1).data;
                }
                catch (e) {
                    console.log(this.$Bitmap[0 /* bitmapData */]);
                    throw new Error(egret.sys.tr(1039));
                }
            }
            if (data[3] === 0) {
                return null;
            }
            return this;
        };
        /**
         * @private
         *
         * @param context
         * @param texture
         * @param destW
         * @param destH
         * @param scale9Grid
         * @param fillMode
         * @param smoothing
         */
        Bitmap.$drawImage = function (context, image, clipX, clipY, clipWidth, clipHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH, scale9Grid, fillMode, smoothing) {
            if (!image) {
                return;
            }
            context.imageSmoothingEnabled = smoothing;
            if (scale9Grid) {
                Bitmap.$drawScale9GridImage(context, image, scale9Grid, clipX, clipY, clipWidth, clipHeight, offsetX, offsetY, textureWidth, textureHeight, destW, destH);
            }
            else if (fillMode == egret.BitmapFillMode.SCALE) {
                var tsX = destW / textureWidth;
                var tsY = destH / textureHeight;
                context.drawImage(image, clipX, clipY, clipWidth, clipHeight, offsetX * tsX, offsetY * tsY, tsX * clipWidth, tsY * clipHeight);
            }
            else if (fillMode == egret.BitmapFillMode.CLIP) {
                var tempW = Math.min(textureWidth, destW);
                var tempH = Math.min(textureHeight, destH);
                context.drawImage(image, clipX, clipY, tempW / egret.$TextureScaleFactor, tempH / egret.$TextureScaleFactor, offsetX, offsetY, tempW, tempH);
            }
            else {
                var tempImage = image;
                var tempCanvas;
                if (tempImage.width != clipWidth || tempImage.height != clipHeight || egret.$TextureScaleFactor != 1) {
                    tempCanvas = egret.sys.surfaceFactory.create(true);
                    tempCanvas.width = textureWidth;
                    tempCanvas.height = textureHeight;
                    tempCanvas.renderContext.drawImage(tempImage, clipX, clipY, clipWidth, clipHeight, offsetX, offsetY, clipWidth * egret.$TextureScaleFactor, clipHeight * egret.$TextureScaleFactor);
                    tempImage = tempCanvas;
                }
                var pattern = context.createPattern(tempImage, "repeat");
                context.beginPath();
                context.rect(0, 0, destW, destH);
                context.fillStyle = pattern;
                context.fill();
                if (tempCanvas) {
                    egret.sys.surfaceFactory.release(tempCanvas);
                }
            }
        };
        /**
         * @private
         * 绘制九宫格位图
         */
        Bitmap.$drawScale9GridImage = function (context, image, scale9Grid, clipX, clipY, clipWidth, clipHeight, offsetX, offsetY, textureWidth, textureHeight, surfaceWidth, surfaceHeight) {
            var imageWidth = clipWidth;
            var imageHeight = clipHeight;
            surfaceWidth = surfaceWidth - (textureWidth - clipWidth * egret.$TextureScaleFactor);
            surfaceHeight = surfaceHeight - (textureHeight - clipHeight * egret.$TextureScaleFactor);
            var targetW0 = scale9Grid.x - offsetX;
            var targetH0 = scale9Grid.y - offsetY;
            var sourceW0 = targetW0 / egret.$TextureScaleFactor;
            var sourceH0 = targetH0 / egret.$TextureScaleFactor;
            var sourceW1 = scale9Grid.width / egret.$TextureScaleFactor;
            var sourceH1 = scale9Grid.height / egret.$TextureScaleFactor;
            //防止空心的情况出现。
            if (sourceH1 == 0) {
                sourceH1 = 1;
                if (sourceH0 >= imageHeight) {
                    sourceH0--;
                }
            }
            if (sourceW1 == 0) {
                sourceW1 = 1;
                if (sourceW0 >= imageWidth) {
                    sourceW0--;
                }
            }
            var sourceX0 = clipX;
            var sourceX1 = sourceX0 + sourceW0;
            var sourceX2 = sourceX1 + sourceW1;
            var sourceW2 = imageWidth - sourceW0 - sourceW1;
            var sourceY0 = clipY;
            var sourceY1 = sourceY0 + sourceH0;
            var sourceY2 = sourceY1 + sourceH1;
            var sourceH2 = imageHeight - sourceH0 - sourceH1;
            var targetW2 = sourceW2 * egret.$TextureScaleFactor;
            var targetH2 = sourceH2 * egret.$TextureScaleFactor;
            if ((sourceW0 + sourceW2) * egret.$TextureScaleFactor > surfaceWidth || (sourceH0 + sourceH2) * egret.$TextureScaleFactor > surfaceHeight) {
                context.drawImage(image, clipX, clipY, clipWidth, clipHeight, offsetX, offsetY, surfaceWidth, surfaceHeight);
                return;
            }
            var targetX0 = offsetX;
            var targetX1 = targetX0 + targetW0;
            var targetX2 = targetX0 + (surfaceWidth - targetW2);
            var targetW1 = surfaceWidth - targetW0 - targetW2;
            var targetY0 = offsetY;
            var targetY1 = targetY0 + targetH0;
            var targetY2 = targetY0 + surfaceHeight - targetH2;
            var targetH1 = surfaceHeight - targetH0 - targetH2;
            //
            //             x0     x1     x2
            //          y0 +------+------+------+
            //             |      |      |      | h0
            //             |      |      |      |
            //          y1 +------+------+------+
            //             |      |      |      | h1
            //             |      |      |      |
            //          y2 +------+------+------+
            //             |      |      |      | h2
            //             |      |      |      |
            //             +------+------+------+
            //                w0     w1     w2
            //
            if (sourceH0 <= 0 || sourceH1 <= 0 || sourceH2 <= 0 || sourceW0 <= 0 || sourceW1 <= 0 || sourceW2 <= 0 || (sourceW0 + sourceW1 + sourceW2) > imageWidth || (sourceH0 + sourceH1 + sourceH2) > imageHeight) {
                if (DEBUG)
                    egret.$warn(1018);
                return;
            }
            context.drawImage(image, sourceX0, sourceY0, sourceW0, sourceH0, targetX0, targetY0, targetW0, targetH0);
            context.drawImage(image, sourceX1, sourceY0, sourceW1, sourceH0, targetX1, targetY0, targetW1, targetH0);
            context.drawImage(image, sourceX2, sourceY0, sourceW2, sourceH0, targetX2, targetY0, targetW2, targetH0);
            context.drawImage(image, sourceX0, sourceY1, sourceW0, sourceH1, targetX0, targetY1, targetW0, targetH1);
            context.drawImage(image, sourceX1, sourceY1, sourceW1, sourceH1, targetX1, targetY1, targetW1, targetH1);
            context.drawImage(image, sourceX2, sourceY1, sourceW2, sourceH1, targetX2, targetY1, targetW2, targetH1);
            context.drawImage(image, sourceX0, sourceY2, sourceW0, sourceH2, targetX0, targetY2, targetW0, targetH2);
            context.drawImage(image, sourceX1, sourceY2, sourceW1, sourceH2, targetX1, targetY2, targetW1, targetH2);
            context.drawImage(image, sourceX2, sourceY2, sourceW2, sourceH2, targetX2, targetY2, targetW2, targetH2);
        };
        return Bitmap;
    })(egret.DisplayObject);
    egret.Bitmap = Bitmap;
    egret.registerClass(Bitmap,'egret.Bitmap');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The BitmapFillMode class defines the image fill mode of Bitmap.
     * The BitmapFillMode class defines a pattern enumeration for adjusting size. These patterns determine how Bitmap fill the size designated by the layout system.
     * @see http://docs.egret-labs.org/post/manual/bitmap/bitmapfillmode.html Texture filling way
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BitmapFillMode.ts
     */
    /**
     * @language zh_CN
     * BitmapFillMode 类定义Bitmap的图像填充方式。
     * BitmapFillMode 类定义了调整大小模式的一个枚举，这些模式确定 Bitmap 如何填充由布局系统指定的尺寸。
     * @see http://docs.egret-labs.org/post/manual/bitmap/bitmapfillmode.html 纹理的填充方式
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BitmapFillMode.ts
     */
    var BitmapFillMode = (function () {
        function BitmapFillMode() {
        }
        var d = __define,c=BitmapFillMode,p=c.prototype;
        /**
         * @language en_US
         * Repeat the bitmap to fill area.
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 重复位图以填充区域。
         * @version Egret 2.4
         * @platform Web
         */
        BitmapFillMode.REPEAT = "repeat";
        /**
         * @language en_US
         * Scale bitmap fill to fill area.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 位图填充拉伸以填充区域。
         * @version Egret 2.4
         * @platform Web,Native
         */
        BitmapFillMode.SCALE = "scale";
        /**
         * @language en_US
         * The bitmap ends at the edge of the region.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在区域的边缘处截断不显示位图。
         * @version Egret 2.4
         * @platform Web,Native
         */
        BitmapFillMode.CLIP = "clip";
        return BitmapFillMode;
    })();
    egret.BitmapFillMode = BitmapFillMode;
    egret.registerClass(BitmapFillMode,'egret.BitmapFillMode');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    //混合模式在Web端只有部分被支持，在 Native 中全部都支持。
    //目前所有平台的浏览器都支持的有：Layer,Alpha,Normal,Add,ERASE。
    //IOS中的所有浏览器以及Android内的部分浏览器还支持：Multiply,Screen,Lighten,Darken,Difference,Overlay,HardLight。
    //仅在 Native 端支持的有：Subtract,Invert。
    /**
     * @language en_US
     * A class that provides constant values for visual blend mode effects. These constants are used in the blendMode
     * property of the DisplayObject class.
     * @see egret.DisplayObject#blendMode
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BlendMode.ts
     */
    /**
     * @language zh_CN
     * 提供混合模式可视效果的常量值的类,通常用于 DisplayObject 的 blendMode 属性上。
     * @see egret.DisplayObject#blendMode
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/BlendMode.ts
     */
    var BlendMode = (function () {
        function BlendMode() {
        }
        var d = __define,c=BlendMode,p=c.prototype;
        /**
         * @language en_US
         * The display object appears in front of the background. Pixel values of the display object override the pixel
         * values of the background. Where the display object is transparent, the background is visible.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 该显示对象出现在背景前面。显示对象的像素值会覆盖背景的像素值。在显示对象为透明的区域，背景是可见的。
         * @version Egret 2.4
         * @platform Web,Native
         */
        BlendMode.NORMAL = "normal";
        /**
         * @language en_US
         * Adds the values of the constituent colors of the display object to the colors of its background, applying a
         * ceiling of 0xFF. This setting is commonly used for animating a lightening dissolve between two objects.<br/>
         * For example, if the display object has a pixel with an RGB value of 0xAAA633, and the background pixel has an
         * RGB value of 0xDD2200, the resulting RGB value for the displayed pixel is 0xFFC833 (because 0xAA + 0xDD > 0xFF,
         * 0xA6 + 0x22 = 0xC8, and 0x33 + 0x00 = 0x33).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将显示对象的原色值添加到它的背景颜色中，上限值为 0xFF。此设置通常用于使两个对象间的加亮溶解产生动画效果。<br/>
         * 例如，如果显示对象的某个像素的 RGB 值为 0xAAA633，背景像素的 RGB 值为 0xDD2200，则显示像素的结果 RGB 值为 0xFFC833
         * （因为 0xAA + 0xDD > 0xFF，0xA6 + 0x22 = 0xC8，且 0x33 + 0x00 = 0x33）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        BlendMode.ADD = "add";
        /**
         * @language en_US
         * Erases the background based on the alpha value of the display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据显示对象的 Alpha 值擦除背景。Alpha 值不为0的区域将被擦除。
         * @version Egret 2.4
         * @platform Web,Native
         */
        BlendMode.ERASE = "erase";
        return BlendMode;
    })();
    egret.BlendMode = BlendMode;
    egret.registerClass(BlendMode,'egret.BlendMode');
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var blendModeString = ["normal", "add", "erase"];
        var blendModeNumber = {};
        var length = blendModeString.length;
        for (var i = 0; i < length; i++) {
            var str = blendModeString[i];
            blendModeNumber[str] = i;
        }
        /**
         * @private
         * 转换 blendMode 字符串为数字。
         */
        function blendModeToNumber(blendMode) {
            var num = blendModeNumber[blendMode];
            return egret.sys.isUndefined(num) ? 0 : num;
        }
        sys.blendModeToNumber = blendModeToNumber;
        /**
         * @private
         * 转换数字为 blendMode 字符串。
         */
        function numberToBlendMode(blendMode) {
            var str = blendModeString[blendMode];
            return egret.sys.isUndefined(str) ? "normal" : str;
        }
        sys.numberToBlendMode = numberToBlendMode;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The DisplayObjectContainer class is a basic display list building block: a display list node that can contain children.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObjectContainer.ts
     */
    /**
     * @language zh_CN
     * DisplayObjectContainer 类是基本显示列表构造块：一个可包含子项的显示列表节点。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObjectContainer.ts
     */
    var DisplayObjectContainer = (function (_super) {
        __extends(DisplayObjectContainer, _super);
        /**
         * @language en_US
         * Creates a new DisplayObjectContainer instance.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 实例化一个容器
         * @version Egret 2.4
         * @platform Web,Native
         */
        function DisplayObjectContainer() {
            _super.call(this);
            this.$touchChildren = true;
            this.$children = [];
        }
        var d = __define,c=DisplayObjectContainer,p=c.prototype;
        /**
         * @private
         */
        p.$propagateFlagsDown = function (flags) {
            if (this.$hasFlags(flags)) {
                return;
            }
            this.$setFlags(flags);
            var children = this.$children;
            for (var i = 0; i < children.length; i++) {
                children[i].$propagateFlagsDown(flags);
            }
        };
        d(p, "numChildren"
            /**
             * @inheritDoc
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$children.length;
            }
        );
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.addChild = function (child) {
            var index = this.$children.length;
            if (child.$parent == this)
                index--;
            return this.$doAddChild(child, index);
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.addChildAt = function (child, index) {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length;
                if (child.$parent == this) {
                    index--;
                }
            }
            return this.$doAddChild(child, index);
        };
        /**
         * @private
         */
        p.$doAddChild = function (child, index, notifyListeners) {
            if (notifyListeners === void 0) { notifyListeners = true; }
            if (DEBUG) {
                if (child == this) {
                    egret.$error(1005);
                }
                else if ((child instanceof egret.DisplayObjectContainer) && child.contains(this)) {
                    egret.$error(1004);
                }
            }
            var host = child.$parent;
            if (host == this) {
                this.doSetChildIndex(child, index);
                return child;
            }
            if (host) {
                host.removeChild(child);
            }
            this.$children.splice(index, 0, child);
            child.$setParent(this);
            var stage = this.$stage;
            if (stage) {
                child.$onAddToStage(stage, this.$nestLevel + 1);
            }
            if (notifyListeners) {
                child.dispatchEventWith(egret.Event.ADDED, true);
            }
            if (stage) {
                var list = DisplayObjectContainer.$EVENT_ADD_TO_STAGE_LIST;
                while (list.length) {
                    var childAddToStage = list.shift();
                    if (childAddToStage.$stage && notifyListeners) {
                        childAddToStage.dispatchEventWith(egret.Event.ADDED_TO_STAGE);
                    }
                }
            }
            var displayList = this.$displayList || this.$parentDisplayList;
            this.assignParentDisplayList(child, displayList, displayList);
            child.$propagateFlagsDown(624 /* DownOnAddedOrRemoved */);
            this.$propagateFlagsUp(4 /* InvalidBounds */);
            this.$childAdded(child, index);
            return child;
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.contains = function (child) {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child.$parent;
            }
            return false;
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getChildAt = function (index) {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$children[index];
            }
            else {
                DEBUG && egret.$error(1007);
                return null;
            }
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getChildIndex = function (child) {
            return this.$children.indexOf(child);
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getChildByName = function (name) {
            var children = this.$children;
            var length = children.length;
            var displayObject;
            for (var i = 0; i < length; i++) {
                displayObject = children[i];
                if (displayObject.name == name) {
                    return displayObject;
                }
            }
            return null;
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.removeChild = function (child) {
            var index = this.$children.indexOf(child);
            if (index >= 0) {
                return this.$doRemoveChild(index);
            }
            else {
                DEBUG && egret.$error(1006);
                return null;
            }
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.removeChildAt = function (index) {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$doRemoveChild(index);
            }
            else {
                DEBUG && egret.$error(1007);
                return null;
            }
        };
        /**
         * @private
         */
        p.$doRemoveChild = function (index, notifyListeners) {
            if (notifyListeners === void 0) { notifyListeners = true; }
            index = +index | 0;
            var children = this.$children;
            var child = children[index];
            this.$childRemoved(child, index);
            if (notifyListeners) {
                child.dispatchEventWith(egret.Event.REMOVED, true);
            }
            if (this.$stage) {
                child.$onRemoveFromStage();
                var list = DisplayObjectContainer.$EVENT_REMOVE_FROM_STAGE_LIST;
                while (list.length > 0) {
                    var childAddToStage = list.shift();
                    if (notifyListeners) {
                        childAddToStage.dispatchEventWith(egret.Event.REMOVED_FROM_STAGE);
                    }
                    childAddToStage.$stage = null;
                }
            }
            var displayList = this.$displayList || this.$parentDisplayList;
            this.assignParentDisplayList(child, displayList, null);
            child.$propagateFlagsDown(624 /* DownOnAddedOrRemoved */);
            child.$setParent(null);
            var indexNow = children.indexOf(child);
            children.splice(indexNow, 1);
            this.$propagateFlagsUp(4 /* InvalidBounds */);
            return child;
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setChildIndex = function (child, index) {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length - 1;
            }
            this.doSetChildIndex(child, index);
        };
        /**
         * @private
         */
        p.doSetChildIndex = function (child, index) {
            var lastIndex = this.$children.indexOf(child);
            if (lastIndex < 0) {
                DEBUG && egret.$error(1006);
            }
            if (lastIndex == index) {
                return;
            }
            this.$childRemoved(child, lastIndex);
            //从原来的位置删除
            this.$children.splice(lastIndex, 1);
            //放到新的位置
            this.$children.splice(index, 0, child);
            this.$childAdded(child, index);
            child.$invalidateTransform();
            this.$propagateFlagsUp(4 /* InvalidBounds */);
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.swapChildrenAt = function (index1, index2) {
            index1 = +index1 | 0;
            index2 = +index2 | 0;
            if (index1 >= 0 && index1 < this.$children.length && index2 >= 0 && index2 < this.$children.length) {
                this.doSwapChildrenAt(index1, index2);
            }
            else {
                DEBUG && egret.$error(1007);
            }
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.swapChildren = function (child1, child2) {
            var index1 = this.$children.indexOf(child1);
            var index2 = this.$children.indexOf(child2);
            if (index1 == -1 || index2 == -1) {
                DEBUG && egret.$error(1006);
            }
            else {
                this.doSwapChildrenAt(index1, index2);
            }
        };
        /**
         * @private
         */
        p.doSwapChildrenAt = function (index1, index2) {
            if (index1 > index2) {
                var temp = index2;
                index2 = index1;
                index1 = temp;
            }
            else if (index1 == index2) {
                return;
            }
            var list = this.$children;
            var child1 = list[index1];
            var child2 = list[index2];
            this.$childRemoved(child1, index1);
            this.$childRemoved(child2, index2);
            list[index1] = child2;
            list[index2] = child1;
            this.$childAdded(child2, index1);
            this.$childAdded(child1, index2);
            child1.$invalidateTransform();
            child2.$invalidateTransform();
            this.$propagateFlagsUp(4 /* InvalidBounds */);
        };
        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.removeChildren = function () {
            var children = this.$children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.$doRemoveChild(i);
            }
        };
        /**
         * @private
         * 一个子项被添加到容器内，此方法不仅在操作addChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        p.$childAdded = function (child, index) {
        };
        /**
         * @private
         * 一个子项从容器内移除，此方法不仅在操作removeChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        p.$childRemoved = function (child, index) {
        };
        /**
         * @private
         */
        p.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            var children = this.$children;
            var length = children.length;
            nestLevel++;
            for (var i = 0; i < length; i++) {
                var child = this.$children[i];
                child.$onAddToStage(stage, nestLevel);
            }
        };
        /**
         * @private
         *
         */
        p.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            var children = this.$children;
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var child = children[i];
                child.$onRemoveFromStage();
            }
        };
        /**
         * @private
         */
        p.$measureChildBounds = function (bounds) {
            var children = this.$children;
            var length = children.length;
            if (length == 0) {
                return;
            }
            var xMin = 0, xMax = 0, yMin = 0, yMax = 0;
            var found = false;
            for (var i = -1; i < length; i++) {
                var childBounds = i == -1 ? bounds : children[i].$getTransformedBounds(this, egret.$TempRectangle);
                if (childBounds.isEmpty()) {
                    continue;
                }
                if (found) {
                    xMin = Math.min(xMin, childBounds.x);
                    xMax = Math.max(xMax, childBounds.x + childBounds.width);
                    yMin = Math.min(yMin, childBounds.y);
                    yMax = Math.max(yMax, childBounds.y + childBounds.height);
                }
                else {
                    found = true;
                    xMin = childBounds.x;
                    xMax = xMin + childBounds.width;
                    yMin = childBounds.y;
                    yMax = yMin + childBounds.height;
                }
            }
            bounds.setTo(xMin, yMin, xMax - xMin, yMax - yMin);
        };
        d(p, "touchChildren"
            /**
             * @inheritDoc
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getTouchChildren();
            }
            ,function (value) {
                this.$setTouchChildren(!!value);
            }
        );
        /**
         * @private
         *
         * @returns
         */
        p.$getTouchChildren = function () {
            return this.$touchChildren;
        };
        /**
         * @private
         */
        p.$setTouchChildren = function (value) {
            if (this.$touchChildren == value) {
                return false;
            }
            this.$touchChildren = value;
            return true;
        };
        /**
         * @private
         * 标记此显示对象需要重绘。此方法会触发自身的cacheAsBitmap重绘。如果只是矩阵改变，自身显示内容并不改变，应该调用$invalidateTransform().
         * @param notiryChildren 是否标记子项也需要重绘。传入false或不传入，将只标记自身需要重绘。通常只有alpha属性改变会需要通知子项重绘。
         */
        p.$invalidate = function (notifyChildren) {
            _super.prototype.$invalidate.call(this, notifyChildren);
            if (!notifyChildren) {
                return;
            }
            var cacheRoot = this.$displayList || this.$parentDisplayList;
            var children = this.$children;
            if (children) {
                for (var i = children.length - 1; i >= 0; i--) {
                    this.markChildDirty(children[i], cacheRoot);
                }
            }
        };
        /**
         * @private
         * 标记自身以及所有子项在父级中变换叠加的显示内容失效。此方法不会触发自身的cacheAsBitmap重绘。
         * 通常用于矩阵改变或从显示列表添加和移除时。若自身的显示内容已经改变需要重绘，应该调用$invalidate()。
         */
        p.$invalidateTransform = function () {
            this.markChildDirty(this, this.$parentDisplayList);
        };
        /**
         * @private
         */
        p.markChildDirty = function (child, parentCache) {
            if (child.$hasFlags(512 /* DirtyChildren */)) {
                return;
            }
            child.$setFlags(512 /* DirtyChildren */);
            var displayList = child.$displayList;
            if ((displayList || child.$renderRegion) && parentCache) {
                parentCache.markDirty(displayList || child);
            }
            if (displayList) {
                return;
            }
            var children = child.$children;
            if (children) {
                for (var i = children.length - 1; i >= 0; i--) {
                    this.markChildDirty(children[i], parentCache);
                }
            }
        };
        /**
         * @private
         */
        p.$cacheAsBitmapChanged = function () {
            _super.prototype.$cacheAsBitmapChanged.call(this);
            var cacheRoot = this.$displayList || this.$parentDisplayList;
            var children = this.$children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.assignParentDisplayList(children[i], cacheRoot, cacheRoot);
            }
        };
        /**
         * @private
         */
        p.assignParentDisplayList = function (child, parentCache, newParent) {
            child.$parentDisplayList = newParent;
            child.$setFlags(512 /* DirtyChildren */);
            var displayList = child.$displayList;
            if ((child.$renderRegion || displayList) && parentCache) {
                parentCache.markDirty(displayList || child);
            }
            if (displayList) {
                return;
            }
            var children = child.$children;
            if (children) {
                for (var i = children.length - 1; i >= 0; i--) {
                    this.assignParentDisplayList(children[i], parentCache, newParent);
                }
            }
        };
        /**
         * @private
         */
        p.$hitTest = function (stageX, stageY) {
            if (!this.$visible) {
                return null;
            }
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
            if (rect && !rect.contains(localX, localY)) {
                return null;
            }
            if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                return null;
            }
            var children = this.$children;
            var found = false;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (child.$maskedObject) {
                    continue;
                }
                var target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if (target.$touchEnabled) {
                        break;
                    }
                    else {
                        target = null;
                    }
                }
            }
            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
                return this;
            }
            if (found) {
                return this;
            }
            return _super.prototype.$hitTest.call(this, stageX, stageY);
        };
        /**
         * @private
         * 子项有可能会被cache而导致标记失效。重写此方法,以便在赋值时对子项深度遍历标记脏区域
         */
        p.$setAlpha = function (value) {
            value = egret.sys.getNumber(value);
            if (value == this.$alpha) {
                return false;
            }
            this.$alpha = value;
            this.$propagateFlagsDown(64 /* InvalidConcatenatedAlpha */);
            this.$invalidate();
            this.$invalidateAllChildren();
            return true;
        };
        p.$invalidateAllChildren = function () {
            var children = this.$children;
            if (children) {
                for (var i = children.length - 1; i >= 0; i--) {
                    var child = children[i];
                    child.$invalidate();
                    if (child.$children) {
                        child.$invalidateAllChildren();
                    }
                }
            }
        };
        /**
         * @private
         */
        DisplayObjectContainer.$EVENT_ADD_TO_STAGE_LIST = [];
        /**
         * @private
         */
        DisplayObjectContainer.$EVENT_REMOVE_FROM_STAGE_LIST = [];
        return DisplayObjectContainer;
    })(egret.DisplayObject);
    egret.DisplayObjectContainer = DisplayObjectContainer;
    egret.registerClass(DisplayObjectContainer,'egret.DisplayObjectContainer');
    if (DEBUG) {
        egret.$markReadOnly(DisplayObjectContainer, "numChildren");
    }
})(egret || (egret = {}));
var egret;
(function (egret) {
    var GradientType = (function () {
        function GradientType() {
        }
        var d = __define,c=GradientType,p=c.prototype;
        /**
         * 用于指定线性渐变填充的值
         * @method egret.GradientType.LINEAR
         */
        GradientType.LINEAR = "linear";
        /**
         * 用于指定放射状渐变填充的值
         * @method egret.GradientType.RADIAL
         */
        GradientType.RADIAL = "radial";
        return GradientType;
    })();
    egret.GradientType = GradientType;
    egret.registerClass(GradientType,'egret.GradientType');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The Graphics class contains a set of methods for creating vector shape. Display objects that support drawing include Sprite and Shape objects. Each class in these classes includes the graphics attribute that is a Graphics object.
     * The following auxiliary functions are provided for ease of use: drawRect(), drawRoundRect(), drawCircle(), and drawEllipse().
     * @see http://docs.egret-labs.org/post/manual/graphics/drawrect.html  Draw Rectangle
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Graphics.ts
     */
    /**
     * @language zh_CN
     * Graphics 类包含一组可用来创建矢量形状的方法。支持绘制的显示对象包括 Sprite 和 Shape 对象。这些类中的每一个类都包括 graphics 属性，该属性是一个 Graphics 对象。
     * 以下是为便于使用而提供的一些辅助函数：drawRect()、drawRoundRect()、drawCircle() 和 drawEllipse()。
     * @see http://docs.egret-labs.org/post/manual/graphics/drawrect.html  绘制矩形
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Graphics.ts
     */
    var Graphics = (function (_super) {
        __extends(Graphics, _super);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Graphics() {
            _super.call(this);
            /**
             * @private
             */
            this.$renderContext = null;
            /**
             * @private
             */
            this.strokeStyleColor = null;
            /**
             * @private
             */
            this.fillStyle = null;
            /**
             * @private
             */
            this._dirty = false;
            /**
             * @private
             */
            this.lineX = 0;
            /**
             * @private
             */
            this.lineY = 0;
            /**
             * @private
             */
            this._firstCheck = true;
            /**
             * @private
             */
            this._minX = 0;
            /**
             * @private
             */
            this._minY = 0;
            /**
             * @private
             */
            this._maxX = 0;
            /**
             * @private
             */
            this._maxY = 0;
            this.$renderContext = new egret.GraphicsRenderContext();
        }
        var d = __define,c=Graphics,p=c.prototype;
        d(p, "graphicsRenderContext"
            /**
             * @private
             */
            ,function () {
                return this.$renderContext;
            }
        );
        /**
         * @private
         */
        p.$hitTest = function (stageX, stageY) {
            var target = this.$renderContext.$targetDisplay;
            var m = target.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var context = egret.sys.hitTestRenderContext;
            context.surface.width = context.surface.height = 3;
            context.translate(1 - localX, 1 - localY);
            this.$renderContext.$render(context, true);
            var data = context.getImageData(1, 1, 1, 1).data;
            if (data[3] === 0) {
                return null;
            }
            return target;
        };
        /**
         * @private
         */
        p.$measureContentBounds = function (bounds) {
            this.$renderContext.$measureContentBounds(bounds);
        };
        /**
         * @private
         */
        p.$render = function (context) {
            this.$renderContext.$render(context);
        };
        /**
         * @language en_US
         * Specify a simple single color fill that will be used for subsequent calls to other Graphics methods (for example, lineTo() and drawCircle()) when drawing.
         * Calling the clear() method will clear the fill.
         * @param color {number} Filled color
         * @param alpha {number} Filled Alpha value
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * @param color {number} 填充的颜色
         * @param alpha {number} 填充的 Alpha 值
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.beginFill = function (color, alpha) {
            if (alpha === void 0) { alpha = 1; }
            this.fillStyle = this._parseColor(color, alpha);
            this._setStyle(this.fillStyle);
        };
        /**
         * @private
         *
         * @param color
         * @param alpha
         * @returns
         */
        p._parseColor = function (color, alpha) {
            var _colorBlue = color & 0x0000FF;
            var _colorGreen = (color & 0x00ff00) >> 8;
            var _colorRed = color >> 16;
            return "rgba(" + _colorRed + "," + _colorGreen + "," + _colorBlue + "," + alpha + ")";
        };
        /**
         * @private
         *
         * @param colorStr
         */
        p._setStyle = function (colorStr) {
            this.$renderContext.fillStyle = colorStr;
            this.$renderContext.beginPath();
        };
        /**
         * @language en_US
         * Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
         * Calling the clear() method clears the fill.
         * Note: Only support on Canvas
         * @param type A value from the GradientType class that specifies which gradient type to use: GradientType.LINEAR or GradientType.RADIAL.
         * @param colors An array of RGB hexadecimal color values used in the gradient; for example, red is 0xFF0000, blue is 0x0000FF, and so on. You can specify up to 15 colors. For each color, specify a corresponding value in the alphas and ratios parameters.
         * @param alphas An array of alpha values for the corresponding colors in the colors array;
         * @param ratios An array of color distribution ratios; valid values are 0-255.
         * @param matrix A transformation matrix as defined by the flash.geom.Matrix class. The flash.geom.Matrix class includes a createGradientBox() method, which lets you conveniently set up the matrix for use with the beginGradientFill() method.
         * @platform Web
         * @version Egret 2.4
         */
        /**
         * @language zh_CN
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * 注：该方法目前仅支持H5 Canvas
         * @param type 用于指定要使用哪种渐变类型的 GradientType 类的值：GradientType.LINEAR 或 GradientType.RADIAL。
         * @param colors 渐变中使用的 RGB 十六进制颜色值的数组（例如，红色为 0xFF0000，蓝色为 0x0000FF，等等）。对于每种颜色，请在 alphas 和 ratios 参数中指定对应值。
         * @param alphas colors 数组中对应颜色的 alpha 值数组。
         * @param ratios 颜色分布比率的数组。有效值为 0 到 255。
         * @param matrix 一个由 egret.Matrix 类定义的转换矩阵。egret.Matrix 类包括 createGradientBox() 方法，通过该方法可以方便地设置矩阵，以便与 beginGradientFill() 方法一起使用
         * @platform Web
         * @version Egret 2.4
         */
        p.beginGradientFill = function (type, colors, alphas, ratios, matrix) {
            if (matrix === void 0) { matrix = null; }
            var gradient = this.getGradient(type, colors, alphas, ratios, matrix);
            this.fillStyle = gradient;
            this._setStyle(this.fillStyle);
        };
        p.getGradient = function (type, colors, alphas, ratios, matrix) {
            var surface = egret.sys.surfaceFactory.create(true);
            var context = surface.renderContext;
            var m = new egret.Matrix();
            if (matrix) {
                m.a = matrix.a * 819.2;
                m.b = matrix.b * 819.2;
                m.c = matrix.c * 819.2;
                m.d = matrix.d * 819.2;
                m.tx = matrix.tx;
                m.ty = matrix.ty;
            }
            else {
                //默认值
                m.a = 100;
                m.d = 100;
            }
            var gradient;
            if (type == egret.GradientType.LINEAR) {
                gradient = context.createLinearGradient(-1, 0, 1, 0);
            }
            else {
                gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
            }
            //todo colors alphas ratios数量不一致情况处理
            var l = colors.length;
            for (var i = 0; i < l; i++) {
                gradient.addColorStop(ratios[i] / 255, this._parseColor(colors[i], alphas[i]));
            }
            gradient["matrix"] = m;
            egret.sys.surfaceFactory.release(surface);
            return gradient;
        };
        /**
         * @language en_US
         * Draw a rectangle
         * @param x {number} x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y {number} y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width {number} Width of the rectangle (in pixels).
         * @param height {number} Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个矩形
         * @param x {number} 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y {number} 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width {number} 矩形的宽度（以像素为单位）。
         * @param height {number} 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.drawRect = function (x, y, width, height) {
            if (DEBUG) {
                if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
                    egret.$error(1013);
                }
            }
            this.$renderContext.beginPath();
            this.$renderContext.rect(x, y, width, height);
            this.$renderContext.closePath();
        };
        /**
         * @language en_US
         * Draw a circle.
         * @param x {number} x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y {number} y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param r {number} Radius of the circle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个圆。
         * @param x {number} 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y {number} 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param r {number} 圆的半径（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.drawCircle = function (x, y, r) {
            if (DEBUG) {
                if (isNaN(x) || isNaN(y) || isNaN(r)) {
                    egret.$error(1013);
                }
            }
            this.$renderContext.beginPath();
            this.$renderContext.arc(x, y, r, 0, Math.PI * 2);
            this.$renderContext.closePath();
        };
        /**
         * @language en_US
         * Draw a rectangle with rounded corners.
         * @param x {number} x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y {number} y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width {number} Width of the rectangle (in pixels).
         * @param height {number} Height of the rectangle (in pixels).
         * @param ellipseWidth {number} Width used to draw an ellipse with rounded corners (in pixels).
         * @param ellipseHeight {number} Height used to draw an ellipse with rounded corners (in pixels). (Optional) If no value is specified, the default value matches the value of the ellipseWidth parameter.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个圆角矩形。
         * @param x {number} 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y {number} 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width {number} 矩形的宽度（以像素为单位）。
         * @param height {number} 矩形的高度（以像素为单位）。
         * @param ellipseWidth {number} 用于绘制圆角的椭圆的宽度（以像素为单位）。
         * @param ellipseHeight {number} 用于绘制圆角的椭圆的高度（以像素为单位）。 （可选）如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.drawRoundRect = function (x, y, width, height, ellipseWidth, ellipseHeight) {
            if (DEBUG) {
                if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
                    egret.$error(1013);
                }
            }
            var _x = x; //控制X偏移
            var _y = y; //控制Y偏移
            var _w = width;
            var _h = height;
            var _ew = ellipseWidth / 2;
            var _eh = ellipseHeight ? ellipseHeight / 2 : _ew;
            var right = _x + _w;
            var bottom = _y + _h;
            var ax = right;
            var ay = bottom - _eh;
            this.$renderContext.beginPath();
            this.$renderContext.moveTo(ax, ay);
            this.$renderContext.quadraticCurveTo(right, bottom, right - _ew, bottom);
            this.$renderContext.lineTo(_x + _ew, bottom);
            this.$renderContext.quadraticCurveTo(_x, bottom, _x, bottom - _eh);
            this.$renderContext.lineTo(_x, _y + _eh);
            this.$renderContext.quadraticCurveTo(_x, _y, _x + _ew, _y);
            this.$renderContext.lineTo(right - _ew, _y);
            this.$renderContext.quadraticCurveTo(right, _y, right, _y + _eh);
            this.$renderContext.lineTo(ax, ay);
            this.$renderContext.closePath();
        };
        /**
         * @language en_US
         * Draw an ellipse.
         * @param x {number} A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y {number} A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @param width {number} Width of the rectangle (in pixels).
         * @param height {number} Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个椭圆。
         * @param x {number} 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y {number} 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @param width {number} 矩形的宽度（以像素为单位）。
         * @param height {number} 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.drawEllipse = function (x, y, width, height) {
            if (DEBUG) {
                if (isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height)) {
                    egret.$error(1013);
                }
            }
            var _x = x + width / 2; //控制X偏移
            var _y = y + height / 2; //控制Y偏移
            var r = (width > height) ? width : height; //选宽高较大者做为arc半径参数
            var ratioX = width / r; //横轴缩放比率
            var ratioY = height / r; //纵轴缩放比率
            r /= 2;
            this.$renderContext.scale(ratioX, ratioY); //进行缩放(均匀压缩)
            this.$renderContext.beginPath();
            this.$renderContext.arc(_x / ratioX, _y / ratioY, r, 0, 2 * Math.PI);
            this.$renderContext.closePath();
            this.$renderContext.scale(1 / ratioX, 1 / ratioY); //缩放回去
        };
        /**
         * @language en_US
         * Specify a line style that will be used for subsequent calls to Graphics methods such as lineTo() and drawCircle().
         * @param thickness {number} An integer, indicating the thickness of the line in points. Valid values are 0 to 255. If a number is not specified, or if the parameter is undefined, a line is not drawn. If a value less than 0 is passed, the default value is 0. Value 0 indicates hairline thickness; the maximum thickness is 255. If a value greater than 255 is passed, the default value is 255.
         * @param color {number} A hexadecimal color value of the line (for example, red is 0xFF0000, and blue is 0x0000FF, etc.). If no value is specified, the default value is 0x000000 (black). Optional.
         * @param alpha {number} Indicates Alpha value of the line's color. Valid values are 0 to 1. If no value is specified, the default value is 1 (solid). If the value is less than 0, the default value is 0. If the value is greater than 1, the default value is 1.
         * @param pixelHinting {boolean} A boolean value that specifies whether to hint strokes to full pixels. This affects both the position of anchors of a curve and the line stroke size itself. With pixelHinting set to true, the line width is adjusted to full pixel width. With pixelHinting set to false, disjoints can appear for curves and straight lines.
         * @param scaleMode {string} Specifies the scale mode to be used
         * @param caps {string} Specifies the value of the CapsStyle class of the endpoint type at the end of the line.
         * @param joints {string} Specifies the type of joint appearance of corner.
         * @param miterLimit {number} Indicates the limit number of cut miter.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定一种线条样式以用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
         * @param thickness {number} 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
         * @param color {number} 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
         * @param alpha {number} 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
         * @param pixelHinting {boolean} 布尔型值，指定是否提示笔触采用完整像素。它同时影响曲线锚点的位置以及线条笔触大小本身。在 pixelHinting 设置为 true 的情况下，线条宽度会调整到完整像素宽度。在 pixelHinting 设置为 false 的情况下，对于曲线和直线可能会出现脱节。
         * @param scaleMode {string} 用于指定要使用的比例模式
         * @param caps {string} 用于指定线条末端处端点类型的 CapsStyle 类的值。
         * @param joints {string} 指定用于拐角的连接外观的类型。
         * @param miterLimit {number} 用于表示剪切斜接的极限值的数字。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.lineStyle = function (thickness, color, alpha, pixelHinting, scaleMode, caps, joints, miterLimit) {
            if (thickness === void 0) { thickness = NaN; }
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1.0; }
            if (pixelHinting === void 0) { pixelHinting = false; }
            if (scaleMode === void 0) { scaleMode = "normal"; }
            if (caps === void 0) { caps = null; }
            if (joints === void 0) { joints = null; }
            if (miterLimit === void 0) { miterLimit = 3; }
            if (this.strokeStyleColor) {
                this._createEndLineCommand();
            }
            this.strokeStyleColor = this._parseColor(color, alpha);
            this.moveTo(this.lineX, this.lineY);
            if (thickness <= 0) {
                thickness = 1;
            }
            this.$renderContext.lineWidth = thickness;
            this.$renderContext.strokeStyle = this.strokeStyleColor;
            this.$renderContext.beginPath();
        };
        /**
         * @language en_US
         * Draw a straight line from the current drawing position to (x, y) using the current line style; the current drawing position is then set to (x, y).
         * @param x {number} A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y {number} A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。
         * @param x {number} 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y {number} 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.lineTo = function (x, y) {
            this.lineX = x;
            this.lineY = y;
            this.$renderContext.lineTo(x, y);
        };
        /**
         * @language en_US
         * Draw a quadratic Bezier curve from the current drawing position to (anchorX, anchorY) using the current line style according to the control points specified by (controlX, controlY). The current drawing position is then set to (anchorX, anchorY).
         * If the curveTo() method is called before the moveTo() method, the default value of the current drawing position is (0, 0). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * The drawn curve is a quadratic Bezier curve. A quadratic Bezier curve contains two anchor points and one control point. The curve interpolates the two anchor points and bends to the control point.
         * @param controlX {number} A number indicating the horizontal position of the control point, relative to the registration point of the parent display object.
         * @param controlY {number} A number indicating the vertical position of the control point, relative to the registration point of the parent display object.
         * @param anchorX {number} A number indicating the horizontal position of the next anchor point, relative to the registration point of the parent display object.
         * @param anchorY {number} A number indicating the vertical position of the next anchor point, relative to the registration point of the parent display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。当前绘图位置随后设置为 (anchorX, anchorY)。
         * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法，则当前绘图位置的默认值为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * 绘制的曲线是二次贝塞尔曲线。二次贝塞尔曲线包含两个锚点和一个控制点。该曲线内插这两个锚点，并向控制点弯曲。
         * @param controlX {number} 一个数字，指定控制点相对于父显示对象注册点的水平位置。
         * @param controlY {number} 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
         * @param anchorX {number} 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
         * @param anchorY {number} 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.curveTo = function (controlX, controlY, anchorX, anchorY) {
            this.lineX = anchorX;
            this.lineY = anchorY;
            this.$renderContext.quadraticCurveTo(controlX, controlY, anchorX, anchorY);
        };
        /**
         * @language en_US
         * adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending
         * at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
         * @param x The x coordinate of the arc's center.
         * @param y The y coordinate of the arc's center.
         * @param radius The arc's radius.
         * @param startAngle The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
         * @param endAngle The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
         * @param anticlockwise if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一段圆弧路径。圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
         * @param x 圆弧中心（圆心）的 x 轴坐标。
         * @param y 圆弧中心（圆心）的 y 轴坐标。
         * @param radius 圆弧的半径。
         * @param startAngle 圆弧的起始点， x轴方向开始计算，单位以弧度表示。
         * @param endAngle 圆弧的重点， 单位以弧度表示。
         * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.drawArc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            this.lineX = Math.cos(endAngle) + x;
            this.lineY = Math.sin(endAngle) + y;
            this.$renderContext.arc(x, y, radius, startAngle, endAngle, anticlockwise);
        };
        /**
         * @language en_US
         * Draws a cubic Bezier curve from the current drawing position to the specified anchor. Cubic Bezier curves consist of two anchor points and two control points. The curve interpolates the two anchor points and two control points to the curve.
         * @param controlX1 {number} Specifies the first control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY1 {number} Specifies the first control point relative to the registration point of the parent display the vertical position of the object.
         * @param controlX2 {number} Specify the second control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY2 {number} Specify the second control point relative to the registration point of the parent display the vertical position of the object.
         * @param anchorX {number} Specifies the anchor point relative to the registration point of the parent display the horizontal position of the object.
         * @param anchorY {number} Specifies the anchor point relative to the registration point of the parent display the vertical position of the object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。三次贝塞尔曲线由两个锚点和两个控制点组成。该曲线内插这两个锚点，并向两个控制点弯曲。
         * @param controlX1 {number} 指定首个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY1 {number} 指定首个控制点相对于父显示对象的注册点的垂直位置。
         * @param controlX2 {number} 指定第二个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY2 {number} 指定第二个控制点相对于父显示对象的注册点的垂直位置。
         * @param anchorX {number} 指定锚点相对于父显示对象的注册点的水平位置。
         * @param anchorY {number} 指定锚点相对于父显示对象的注册点的垂直位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.cubicCurveTo = function (controlX1, controlY1, controlX2, controlY2, anchorX, anchorY) {
            this.lineX = anchorX;
            this.lineY = anchorY;
            this.$renderContext.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
        };
        /**
         * @language en_US
         * Move the current drawing position to (x, y). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * @param x {number} A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y {number} A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将当前绘图位置移动到 (x, y)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * @param x {number} 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y {number} 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.moveTo = function (x, y) {
            this.lineX = x;
            this.lineY = y;
            this.$renderContext.moveTo(x, y);
        };
        /**
         * @language en_US
         * Clear graphics that are drawn to this Graphics object, and reset fill and line style settings.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clear = function () {
            this.lineX = 0;
            this.lineY = 0;
            this.strokeStyleColor = null;
            this.fillStyle = null;
            this._minX = 0;
            this._minY = 0;
            this._maxX = 0;
            this._maxY = 0;
            this._firstCheck = true;
            this._dirty = true;
            this.$renderContext.clear();
        };
        /**
         * @language en_US
         * Apply fill to the lines and curves added after the previous calling to the beginFill() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对从上一次调用 beginFill()方法之后添加的直线和曲线应用填充。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.endFill = function () {
            if (this.fillStyle != null || this.strokeStyleColor != null) {
                this._fill();
                this.fillStyle = null;
                this.$renderContext.fillStyle = null;
                this.$renderContext.strokeStyle = null;
            }
        };
        /**
         * @private
         *
         */
        p._createEndFillCommand = function () {
            this.$renderContext.fill();
            this.$renderContext.closePath();
        };
        /**
         * @private
         *
         */
        p._fill = function () {
            if (this.fillStyle) {
                this._createEndFillCommand();
            }
            if (this.strokeStyleColor) {
                this._createEndLineCommand();
            }
        };
        /**
         * @private
         *
         */
        p._createEndLineCommand = function () {
            this.$renderContext.stroke();
            this.$renderContext.closePath();
        };
        return Graphics;
    })(egret.HashObject);
    egret.Graphics = Graphics;
    egret.registerClass(Graphics,'egret.Graphics');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var vector = { x: 0, y: 0 };
    var vector1 = { x: 0, y: 0 };
    var vector3 = { x: 0, y: 0 };
    /**
     * @private
     * 格式化弧线角度的值
     */
    function clampAngle(value) {
        value %= PI * 2;
        if (value < 0) {
            value += PI * 2;
        }
        return value;
    }
    /**
     * @private
     * 两个点距离
     */
    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
    /**
     * @private
     * 取两点之间的向量
     */
    function getVector(x1, y1, x2, y2, v) {
        var l = distance(x1, y1, x2, y2);
        v.x = (x2 - x1) / l;
        v.y = (y2 - y1) / l;
    }
    /**
     * @private
     * @language en_US
     * The Graphics class contains a set of methods that you can use to create a vector shape. the Shape object that support
     * drawing includes a graphics property that is a Graphics object. The following are among those helper functions provided
     * @see egret.Shape
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @private
     * @language zh_CN
     * Graphics 类包含一组可用来创建矢量形状的方法。Shape是支持矢量绘制的显示对象。它含有一个 graphics 属性，该属性是一个 Graphics 对象。
     * @see egret.Shape
     * @version Egret 2.4
     * @platform Web,Native
     */
    var GraphicsRenderContext = (function (_super) {
        __extends(GraphicsRenderContext, _super);
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        function GraphicsRenderContext() {
            _super.call(this);
            /**
             * @private
             */
            this._maxLineWidth = 1;
            /**
             * @private
             * 绘图命令列表
             */
            this.$commands = [];
            this.reset();
        }
        var d = __define,c=GraphicsRenderContext,p=c.prototype;
        /**
         * @language en_US
         * creates a radial gradient given by the coordinates of the two circles represented by the parameters.
         * This method returns a radial GraphicsGradient.
         * @param x0 The x axis of the coordinate of the start circle.
         * @param y0 The y axis of the coordinate of the start circle.
         * @param r0 The radius of the start circle.
         * @param x1 The x axis of the coordinate of the end circle.
         * @param y1 The y axis of the coordinate of the end circle.
         * @param r1 The radius of the end circle.
         * @see egret.GraphicsGradient
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据参数确定的两个圆的坐标，创建一个放射性渐变。该方法返回一个放射性的 GraphicsGradient。
         * @param x0 开始圆形的 x 轴坐标。
         * @param y0 开始圆形的 y 轴坐标。
         * @param r0 开始圆形的半径。
         * @param x1 结束圆形的 x 轴坐标。
         * @param y1 结束圆形的 y 轴坐标。
         * @param r1 结束圆形的半径。
         * @see egret.GraphicsGradient
         * @version Egret 2.4
         * @platform Web,Native
         */
        GraphicsRenderContext.createRadialGradient = function (x0, y0, r0, x1, y1, r1) {
            return egret.sys.sharedRenderContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
        };
        /**
         * @language en_US
         * reates a gradient along the line given by the coordinates represented by the parameters.This method returns a linear GraphicsGradient.
         * @see egret.GraphicsGradient
         * @param x0 The x axis of the coordinate of the start point.
         * @param y0 The y axis of the coordinate of the start point.
         * @param x1 The x axis of the coordinate of the end point.
         * @param y1 The y axis of the coordinate of the end point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个沿参数坐标指定的直线的渐变。该方法返回一个线性的 GraphicsGradient 对象。
         * @param x0 起点的 x 轴坐标。
         * @param y0 起点的 y 轴坐标。
         * @param x1 终点的 x 轴坐标。
         * @param y1 终点的 y 轴坐标。
         * @see egret.GraphicsGradient
         * @version Egret 2.4
         * @platform Web,Native
         */
        GraphicsRenderContext.createLinearGradient = function (x0, y0, x1, y1) {
            return egret.sys.sharedRenderContext.createLinearGradient(x0, y0, x1, y1);
        };
        /**
         * @language en_US
         * creates a pattern using the specified image (BitmapData). It repeats the source in the directions specified by
         * the repetition argument. This method returns a GraphicsPattern.
         * @param bitmapData A BitmapData instance to be used as image to repeat.
         * @param repetition  indicating how to repeat the image. Possible values are:
         * "repeat" (both directions),
         * "repeat-x" (horizontal only),
         * "repeat-y" (vertical only), or
         * "no-repeat" (neither).
         * @see egret.GraphicsPattern
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 基于指定的源图象(BitmapData)创建一个模板，通过repetition参数指定源图像在什么方向上进行重复，返回一个GraphicsPattern对象。
         * @param bitmapData 做为重复图像源的 BitmapData 对象。
         * @param repetition 指定如何重复图像。
         * 可能的值有："repeat" (两个方向重复),"repeat-x" (仅水平方向重复),"repeat-y" (仅垂直方向重复),"no-repeat" (不重复).
         * @see egret.GraphicsPattern
         * @version Egret 2.4
         * @platform Web,Native
         */
        GraphicsRenderContext.createPattern = function (bitmapData, repetition) {
            return egret.sys.sharedRenderContext.createPattern(bitmapData, repetition);
        };
        d(p, "fillStyle"
            /**
             * @language en_US
             * specifies the color or style to use inside shapes.
             * @default "#000000"
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 设置要在图形内部填充的颜色或样式
             * @default "#000000"
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._fillStyle;
            }
            ,function (value) {
                if (typeof value == "number") {
                    value = egret.toColorString(value);
                }
                this._fillStyle = value;
                this.pushCommand(5 /* fillStyle */, arguments);
            }
        );
        d(p, "lineWidth"
            /**
             * @language en_US
             * sets the thickness of lines in pixels.
             * setting zero, negative, Infinity and NaN values are ignored
             * @default 1
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 设置线条粗细，以像素为单位。设置为0，负数，Infinity 或 NaN 将会被忽略。
             * @default 1
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._lineWidth;
            }
            ,function (value) {
                this._lineWidth = value;
                if (!isNaN(value)) {
                    this._maxLineWidth = Math.max(this._maxLineWidth, value);
                }
                else {
                    this._maxLineWidth = 0;
                }
                this.pushCommand(3 /* lineWidth */, arguments);
            }
        );
        d(p, "lineCap"
            /**
             * @language en_US
             * determines how the end points of every line are drawn. There are three possible values for this property and those are:<br/>
             * <ul>
             * <li>"butt": The ends of lines are squared off at the endpoints.</li>
             * <li>"round": The ends of lines are rounded.</li>
             * <li>"square": The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness.</li>
             * </ul>
             * @default "butt"
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 指定如何绘制每一条线段末端的属性。有3个可能的值，分别是：<br/>
             * <ul>
             * <li>"butt": 线段末端以方形结束。</li>
             * <li>"round": 线段末端以圆形结束。</li>
             * <li>"square": 线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。</li>
             * </ul>
             * @default "butt"
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._lineCap;
            }
            ,function (value) {
                this._lineCap = value;
                this.pushCommand(1 /* lineCap */, arguments);
            }
        );
        d(p, "strokeStyle"
            /**
             * @language en_US
             * specifies the color or style to use for the lines around shapes.
             * @default "#000000"
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 设置要在图形边线填充的颜色或样式
             * @default "#000000"
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._strokeStyle;
            }
            ,function (value) {
                var tmpValue = value;
                if (typeof tmpValue == "number") {
                    tmpValue = egret.toColorString(tmpValue);
                }
                this._strokeStyle = tmpValue;
                this.pushCommand(4 /* strokeStyle */, arguments);
            }
        );
        d(p, "lineJoin"
            /**
             * @language en_US
             * specifies the type of joint appearance used at angles.There are three possible values for this property and those are:<br/>
             * <ul>
             * <li>"round": Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint
             * of connected segments. The radius for these rounded corners is equal to the line width.</li>
             * <li>"bevel": Fills an additional triangular area between the common endpoint of connected segments, and the separate
             * outside rectangular corners of each segment.</li>
             * <li>"miter": Connected segments are joined by extending their outside edges to connect at a single point, with the
             * effect of filling an additional lozenge-shaped area. This setting is effected by the miterLimit property.</li>
             * </ul>
             * @default "miter"
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 指定用于拐角的连接外观的类型,有3个可能的值，分别是：<br/>
             * <ul>
             * <li>"round": 圆角连接</li>
             * <li>"bevel": 斜角连接。</li>
             * <li>"miter": 尖角连接。当使用尖角模式时，还可以同时使用 miterLimit 参数限制尖角的长度。</li>
             * </ul>
             * @default "miter"
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._lineJoin;
            }
            ,function (value) {
                this._lineJoin = value;
                this.pushCommand(2 /* lineJoin */, arguments);
            }
        );
        d(p, "miterLimit"
            /**
             * @language en_US
             * A number that indicates the limit at which a miter is cut off.
             * @default 10
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 用于表示剪切斜接的极限值的数字。
             * @default 10
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._miterLimit;
            }
            ,function (value) {
                this._miterLimit = value;
                this.pushCommand(0 /* miterLimit */, arguments);
            }
        );
        /**
         *
         * @param x0
         * @param y0
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.scale = function (x0, y0) {
            this.pushCommand(19 /* scale */, arguments);
        };
        /**
         * @language en_US
         * adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending
         * at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
         * @param x The x coordinate of the arc's center.
         * @param y The y coordinate of the arc's center.
         * @param radius The arc's radius.
         * @param startAngle The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
         * @param endAngle The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
         * @param anticlockwise if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一段圆弧路径。圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
         * @param x 圆弧中心（圆心）的 x 轴坐标。
         * @param y 圆弧中心（圆心）的 y 轴坐标。
         * @param radius 圆弧的半径。
         * @param startAngle 圆弧的起始点， x轴方向开始计算，单位以弧度表示。
         * @param endAngle 圆弧的重点， 单位以弧度表示。
         * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.arc = function (x, y, radius, startAngle, endAngle, anticlockwise) {
            this.pushCommand(6 /* arc */, arguments);
            if (radius < 0) {
                return;
            }
            if (anticlockwise) {
                this.arcBounds(x, y, radius, endAngle, startAngle);
            }
            else {
                this.arcBounds(x, y, radius, startAngle, endAngle);
            }
        };
        /**
         * @private
         * 测量圆弧的矩形大小
         */
        p.arcBounds = function (x, y, radius, startAngle, endAngle) {
            startAngle = clampAngle(startAngle);
            endAngle = clampAngle(endAngle);
            if (Math.abs(startAngle - endAngle) < 0.01) {
                this.extendByPoint(x - radius, y - radius);
                this.extendByPoint(x + radius, y + radius);
                return;
            }
            if (startAngle > endAngle) {
                endAngle += TwoPI;
            }
            var startX = Math.cos(startAngle) * radius;
            var endX = Math.cos(endAngle) * radius;
            var xMin = Math.min(startX, endX);
            var xMax = Math.max(startX, endX);
            var startY = Math.sin(startAngle) * radius;
            var endY = Math.sin(endAngle) * radius;
            var yMin = Math.min(startY, endY);
            var yMax = Math.max(startY, endY);
            if (startAngle <= PI && endAngle >= PI) {
                xMin = -radius;
            }
            if (startAngle <= TwoPI && endAngle >= TwoPI) {
                xMax = radius;
            }
            if (startAngle <= PacPI && endAngle >= PacPI) {
                yMin = -radius;
            }
            if (startAngle <= HalfPI && endAngle >= HalfPI) {
                yMax = radius;
            }
            this.extendByPoint(xMin + x, yMin + y);
            this.extendByPoint(xMax + x, yMax + y);
        };
        /**
         * @language en_US
         * adds a quadratic Bézier curve to the path. It requires two points. The first point is a control point and the
         * second one is the end point. The starting point is the last point in the current path, which can be changed using
         * moveTo() before creating the quadratic Bézier curve.
         * @param cpx The x axis of the coordinate for the control point.
         * @param cpy The y axis of the coordinate for the control point.
         * @param x The x axis of the coordinate for the end point.
         * @param y The y axis of the coordinate for the end point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一段二次贝塞尔曲线路径。它需要2个点。 第一个点是控制点，第二个点是终点。 起始点是当前路径最新的点，当创建二次贝赛尔曲线之前，可以使用 moveTo() 方法进行改变。
         * @param cpx 控制点的 x 轴坐标。
         * @param cpy 控制点的 y 轴坐标。
         * @param x 终点的 x 轴坐标。
         * @param y 终点的 y 轴坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.quadraticCurveTo = function (cpx, cpy, x, y) {
            this.pushCommand(7 /* quadraticCurveTo */, arguments);
            this.checkMoveTo();
            this.extendByPoint(cpx, cpy);
            this.extendByPoint(x, y);
        };
        /**
         * @language en_US
         * adds a cubic Bézier curve to the path. It requires three points. The first two points are control points and
         * the third one is the end point. The starting point is the last point in the current path, which can be changed
         * using moveTo() before creating the Bézier curve.
         * @param cp1x The x axis of the coordinate for the first control point.
         * @param cp1y The y axis of the coordinate for first control point.
         * @param cp2x The x axis of the coordinate for the second control point.
         * @param cp2y The y axis of the coordinate for the second control point.
         * @param x The x axis of the coordinate for the end point.
         * @param y The y axis of the coordinate for the end point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一段三次贝赛尔曲线路径。该方法需要三个点。 第一、第二个点是控制点，第三个点是结束点。起始点是当前路径的最后一个点，
         * 绘制贝赛尔曲线前，可以通过调用 moveTo() 进行修改。
         * @param cp1x 第一个控制点的 x 轴坐标。
         * @param cp1y 第一个控制点的 y 轴坐标。
         * @param cp2x 第二个控制点的 x 轴坐标。
         * @param cp2y 第二个控制点的 y 轴坐标。
         * @param x 结束点的 x 轴坐标。
         * @param y 结束点的 y 轴坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.bezierCurveTo = function (cp1x, cp1y, cp2x, cp2y, x, y) {
            this.pushCommand(14 /* bezierCurveTo */, arguments);
            this.checkMoveTo();
            this.extendByPoint(cp1x, cp1y);
            this.extendByPoint(cp2x, cp2y);
            this.extendByPoint(x, y);
        };
        /**
         * @language en_US
         * connects the last point in the sub-path to the x, y coordinates with a straight line
         * @param x The x axis of the coordinate for the end of the line.
         * @param y The y axis of the coordinate for the end of the line.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用直线连接子路径的终点到x，y坐标。
         * @param x 直线终点的 x 轴坐标。
         * @param y 直线终点的 y 轴坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.lineTo = function (x, y) {
            this.pushCommand(8 /* lineTo */, arguments);
            this.checkMoveTo();
            this.extendByPoint(x, y);
        };
        /**
         * @language en_US
         * fills the current or given path with the current fill style using the non-zero or even-odd winding rule.
         * @param fillRule The algorithm by which to determine if a point is inside a path or outside a path. Possible values:
         * "nonzero": The non-zero winding rule, which is the default rule.
         * "evenodd": The even-odd winding rule.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据当前的填充样式，填充当前或已存在的路径的方法。采取非零环绕或者奇偶环绕规则。
         * @param fillRule 一种算法，决定点是在路径内还是在路径外。允许的值：
         * "nonzero": 非零环绕规则， 默认的规则。
         * "evenodd": 奇偶环绕规则。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.fill = function (fillRule) {
            this.pushCommand(9 /* fill */, arguments);
            this.hasFill = true;
        };
        /**
         * @language en_US
         * causes the point of the pen to move back to the start of the current sub-path. It tries to add a straight line
         * (but does not actually draw it) from the current point to the start. If the shape has already been closed or
         * has only one point, this function does nothing.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使笔点返回到当前子路径的起始点。它尝试从当前点到起始点绘制一条直线。如果图形已经是封闭的或者只有一个点，那么此方法不会做任何操作。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.closePath = function () {
            this.pushCommand(10 /* closePath */, arguments);
        };
        /**
         * @language en_US
         * creates a path for a rectangle at position (x, y) with a size that is determined by width and height. Those
         * four points are connected by straight lines and the sub-path is marked as closed, so that you can fill or stroke this rectangle.
         * @param x The x axis of the coordinate for the rectangle starting point.
         * @param y The y axis of the coordinate for the rectangle starting point.
         * @param w The rectangle's width.
         * @param h The rectangle's height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一段矩形路径，矩形的起点位置是 (x, y) ，尺寸为 width 和 height。矩形的4个点通过直线连接，子路径做为闭合的标记，所以你可以填充或者描边矩形。
         * @param x 矩形起点的 x 轴坐标。
         * @param y 矩形起点的 y 轴坐标。
         * @param width 矩形的宽度。
         * @param height 矩形的高度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.rect = function (x, y, width, height) {
            this.pushCommand(11 /* rect */, arguments);
            this.extendByPoint(x, y);
            this.extendByPoint(x + width, y + height);
        };
        /**
         * @language en_US
         * moves the starting point of a new sub-path to the (x, y) coordinates.
         * @param x The x axis of the point.
         * @param y The y axis of the point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将一个新的子路径的起始点移动到(x，y)坐标
         * @param x 点的 x 轴
         * @param y 点的 y 轴
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.moveTo = function (x, y) {
            this.pushCommand(12 /* moveTo */, arguments);
            this.moveToX = x;
            this.moveToY = y;
            this.hasMoved = true;
        };
        /**
         * @language en_US
         * draws a filled rectangle at (x, y) position whose size is determined by width and height and whose style is
         * determined by the fillStyle attribute.
         * @param x The x axis of the coordinate for the rectangle starting point.
         * @param y The y axis of the coordinate for the rectangle starting point.
         * @param w The rectangle's width.
         * @param h The rectangle's height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个填充矩形。矩形的起点在 (x, y) 位置，矩形的尺寸是 width 和 height ，fillStyle 属性决定矩形的样式。
         * @param x 矩形起始点的 x 轴坐标。
         * @param y 矩形起始点的 y 轴坐标。
         * @param width 矩形的宽度。
         * @param height 矩形的高度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.fillRect = function (x, y, width, height) {
            this.pushCommand(13 /* fillRect */, arguments);
            this.extendByPoint(x, y);
            this.extendByPoint(x + width, y + height);
            this.hasFill = true;
        };
        /**
         * @language en_US
         * strokes the current or given path with the current stroke style.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据当前的画线样式，绘制当前或已经存在的路径的方法。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.stroke = function () {
            this.pushCommand(15 /* stroke */, arguments);
            this.hasStroke = true;
        };
        /**
         * @language en_US
         * paints a rectangle which has a starting point at (x, y) and has a w width and an h height onto the surface,
         * using the current stroke style.
         * @param x The x axis of the coordinate for the rectangle starting point.
         * @param y The y axis of the coordinate for the rectangle starting point.
         * @param w The rectangle's width.
         * @param h The rectangle's height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用当前的绘画样式，描绘一个起点在 (x, y) 、宽度为 w 、高度为 h 的矩形的方法。
         * @param x 矩形起点的 x 轴坐标。
         * @param y 矩形起点的 y 轴坐标。
         * @param width 矩形的宽度。
         * @param height 矩形的高度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.strokeRect = function (x, y, width, height) {
            this.pushCommand(16 /* strokeRect */, arguments);
            this.hasStroke = true;
            this.extendByPoint(x, y);
            this.extendByPoint(x + width, y + height);
        };
        /**
         * @language en_US
         * starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清空子路径列表开始一个新路径。 当你想创建一个新的路径时，调用此方法。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.beginPath = function () {
            this.pushCommand(17 /* beginPath */, arguments);
            this.hasMoved = false;
            this.moveToX = NaN;
            this.moveToY = NaN;
        };
        /**
         * @language en_US
         * adds an arc to the path with the given control points and radius, connected to the previous point by a straight line.
         * @param x1 The x axis of the coordinate for the first control point.
         * @param y1 The y axis of the coordinate for the first control point.
         * @param x2 The x axis of the coordinate for the second control point.
         * @param y2 The y axis of the coordinate for the second control point.
         * @param radius The arc's radius.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据控制点和半径绘制一段圆弧路径，使用直线连接前一个点。
         * @param x1 第一个控制点的 x 轴坐标。
         * @param y1 第一个控制点的 y 轴坐标。
         * @param x2 第二个控制点的 x 轴坐标。
         * @param y2 第二个控制点的 y 轴坐标。
         * @param radius 圆弧的半径。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.arcTo = function (x1, y1, x2, y2, radius) {
            this.pushCommand(18 /* arcTo */, arguments);
            if (isNaN(this.moveToX)) {
                return;
            }
            this.checkMoveTo();
            getVector(this.moveToX, this.moveToY, x1, y1, vector1);
            getVector(x2, y2, x1, y1, vector3);
            //角平分线
            vector.x = vector1.x + vector3.x;
            vector.y = vector1.y + vector3.y;
            //角平分向量归1
            getVector(vector.x, vector.y, 0, 0, vector);
            //向量夹角
            var cross = vector1.x * vector.x + vector1.y * vector.y;
            var l1 = distance(vector1.x, vector1.y, 0, 0);
            var l2 = distance(vector.x, vector.y, 0, 0);
            var cos = cross / (l1 * l2);
            var a = Math.acos(cos);
            var l = radius / Math.sin(a);
            //圆心
            var centerX = x1 + vector.x * l;
            var centerY = y1 + vector.y * l;
            var L10 = radius / Math.tan(a);
            var x10 = x1 + vector1.x * L10;
            var y10 = y1 + vector1.y * L10;
            var x12 = x1 + vector3.x * L10;
            var y12 = y1 + vector3.y * L10;
            getVector(centerX, centerY, x10, y10, vector);
            var startAngle = Math.atan2(vector.y, vector.x);
            getVector(centerX, centerY, x12, y12, vector);
            var endAngle = Math.atan2(vector.y, vector.x);
            var offset = endAngle - startAngle;
            offset = clampAngle(offset);
            if (offset > PI) {
                var temp = endAngle;
                endAngle = startAngle;
                startAngle = temp;
            }
            this.arcBounds(centerX, centerY, radius, startAngle, endAngle);
        };
        /**
         * @language en_US
         * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clear = function () {
            this.reset();
            this.$commands.length = 0;
            this.$targetDisplay.$invalidateContentBounds();
        };
        /**
         * @private
         *
         */
        p.reset = function () {
            this._fillStyle = null;
            this._lineCap = "butt";
            this._lineJoin = "miter";
            this._lineWidth = 1;
            this._maxLineWidth = 1;
            this._miterLimit = 10;
            this._strokeStyle = null;
            this.hasMoved = false;
            this.minX = 0;
            this.minY = 0;
            this.maxX = 0;
            this.maxY = 0;
            this.isFirst = true;
            this.moveToX = NaN;
            this.moveToY = NaN;
            this.hasStroke = false;
            this.hasFill = false;
        };
        /**
         * @private
         */
        p.pushCommand = function (graphicsType, args) {
            this.$commands.push({ type: graphicsType, arguments: args });
            this.$targetDisplay.$invalidateContentBounds();
        };
        /**
         * @private
         */
        p.checkMoveTo = function () {
            if (this.hasMoved) {
                this.hasMoved = false;
                this.extendByPoint(this.moveToX, this.moveToY);
            }
        };
        /**
         * @private
         */
        p.extendByPoint = function (x, y) {
            if (this.isFirst) {
                this.isFirst = false;
                this.maxX = this.minX = x;
                this.maxY = this.minY = y;
            }
            else {
                this.minX = Math.min(this.minX, x);
                this.minY = Math.min(this.minY, y);
                this.maxX = Math.max(this.maxX, x);
                this.maxY = Math.max(this.maxY, y);
            }
        };
        /**
         * @private
         */
        p.$measureContentBounds = function (bounds) {
            if ((!this.hasFill && this._fillStyle == null) && (!this.hasStroke && this._strokeStyle == null)) {
                bounds.setEmpty();
                return;
            }
            if (this.hasStroke || this._strokeStyle) {
                var lineWidth = this._maxLineWidth;
                var half = lineWidth * 0.5;
            }
            else {
                half = lineWidth = 0;
            }
            bounds.setTo(this.minX - half, this.minY - half, this.maxX - this.minX + lineWidth, this.maxY - this.minY + lineWidth);
        };
        /**
         * @private
         */
        p.$render = function (context, forHitTest) {
            context.save();
            context.fillStyle = "#000000";
            context.lineCap = "butt";
            context.lineJoin = "miter";
            context.lineWidth = 1;
            context.miterLimit = 10;
            context.strokeStyle = "#000000";
            context.beginPath(); //清理之前的缓存的路径
            var map = context["graphicsMap"];
            if (!map) {
                map = mapGraphicsFunction(context);
            }
            var commands = this.$commands;
            var length = commands.length;
            if (forHitTest) {
                for (var i = 0; i < length; i++) {
                    var command = commands[i];
                    if (command.type == 5 /* fillStyle */ || command.type == 4 /* strokeStyle */) {
                        map[command.type].apply(context, ["rgba(1,1,1,1)"]);
                    }
                    else {
                        map[command.type].apply(context, command.arguments);
                    }
                }
            }
            else {
                for (var i = 0; i < length; i++) {
                    var command = commands[i];
                    map[command.type].apply(context, command.arguments);
                }
            }
            if (this._strokeStyle && this._maxLineWidth > 0) {
                map[15 /* stroke */].apply(context, []);
                map[10 /* closePath */].apply(context, []);
            }
            if (this._fillStyle) {
                map[9 /* fill */].apply(context, []);
                map[10 /* closePath */].apply(context, []);
            }
            context.restore();
        };
        return GraphicsRenderContext;
    })(egret.HashObject);
    egret.GraphicsRenderContext = GraphicsRenderContext;
    egret.registerClass(GraphicsRenderContext,'egret.GraphicsRenderContext');
    /**
     * @private
     *
     * @param context
     * @returns
     */
    function mapGraphicsFunction(context) {
        var map = context["graphicsMap"] = {};
        map[6 /* arc */] = context.arc;
        map[18 /* arcTo */] = context.arcTo;
        map[17 /* beginPath */] = context.beginPath;
        map[14 /* bezierCurveTo */] = context.bezierCurveTo;
        map[10 /* closePath */] = context.closePath;
        map[9 /* fill */] = context.fill;
        map[13 /* fillRect */] = context.fillRect;
        map[8 /* lineTo */] = context.lineTo;
        map[12 /* moveTo */] = context.moveTo;
        map[7 /* quadraticCurveTo */] = context.quadraticCurveTo;
        map[11 /* rect */] = context.rect;
        map[15 /* stroke */] = context.stroke;
        map[16 /* strokeRect */] = context.strokeRect;
        map[19 /* scale */] = context.scale;
        map[3 /* lineWidth */] = function (value) {
            context.lineWidth = value;
        };
        map[0 /* miterLimit */] = function (value) {
            context.miterLimit = value;
        };
        map[5 /* fillStyle */] = function (value) {
            context.fillStyle = value;
        };
        map[1 /* lineCap */] = function (value) {
            context.lineCap = value;
        };
        map[2 /* lineJoin */] = function (value) {
            context.lineJoin = value;
        };
        map[4 /* strokeStyle */] = function (value) {
            context.strokeStyle = value;
        };
        return map;
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    egret.$TextureScaleFactor = 1;
    /**
     * @language en_US
     * The Texture class encapsulates different image resources on different platforms.
     * In HTML5, resource is an HTMLElement object
     * In OpenGL / WebGL, resource is a texture ID obtained after the GPU is submitted
     * The Texture class encapsulates the details implemented on the underlayer. Developers just need to focus on interfaces
     * @see http://docs.egret-labs.org/post/manual/bitmap/textures.html The use of texture packs
     * @see http://docs.egret-labs.org/post/manual/loader/getres.html Several ways of access to resources
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Texture.ts
     */
    /**
     * @language zh_CN
     * 纹理类是对不同平台不同的图片资源的封装
     * 在HTML5中，资源是一个HTMLElement对象
     * 在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理id
     * Texture类封装了这些底层实现的细节，开发者只需要关心接口即可
     * @see http://docs.egret-labs.org/post/manual/bitmap/textures.html 纹理集的使用
     * @see http://docs.egret-labs.org/post/manual/loader/getres.html 获取资源的几种方式
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Texture.ts
     */
    var Texture = (function (_super) {
        __extends(Texture, _super);
        /**
         * @language en_US
         * Create an egret.Texture object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.Texture 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Texture() {
            _super.call(this);
            /**
             * @private
             * 表示这个纹理在 bitmapData 上的 x 起始位置
             */
            this._bitmapX = 0;
            /**
             * @private
             * 表示这个纹理在 bitmapData 上的 y 起始位置
             */
            this._bitmapY = 0;
            /**
             * @private
             * 表示这个纹理在 bitmapData 上的宽度
             */
            this._bitmapWidth = 0;
            /**
             * @private
             * 表示这个纹理在 bitmapData 上的高度
             */
            this._bitmapHeight = 0;
            /**
             * @private
             * 表示这个纹理显示了之后在 x 方向的渲染偏移量
             */
            this._offsetX = 0;
            /**
             * @private
             * 表示这个纹理显示了之后在 y 方向的渲染偏移量
             */
            this._offsetY = 0;
            /**
             * @private
             * 纹理宽度
             */
            this._textureWidth = 0;
            /**
             * @private
             * 纹理高度
             */
            this._textureHeight = 0;
            /**
             * @private
             * 表示bitmapData.width
             */
            this._sourceWidth = 0;
            /**
             * @private
             * 表示bitmapData.height
             */
            this._sourceHeight = 0;
            /**
             * @private
             */
            this._bitmapData = null;
        }
        var d = __define,c=Texture,p=c.prototype;
        d(p, "textureWidth"
            /**
             * @language en_US
             * Texture width, read only
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 纹理宽度，只读属性，不可以设置
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getTextureWidth();
            }
        );
        p.$getTextureWidth = function () {
            return this._textureWidth;
        };
        d(p, "textureHeight"
            /**
             * @language en_US
             * Texture height, read only
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 纹理高度，只读属性，不可以设置
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getTextureHeight();
            }
        );
        p.$getTextureHeight = function () {
            return this._textureHeight;
        };
        p.$getScaleBitmapWidth = function () {
            return this._bitmapWidth * egret.$TextureScaleFactor;
        };
        p.$getScaleBitmapHeight = function () {
            return this._bitmapHeight * egret.$TextureScaleFactor;
        };
        d(p, "bitmapData"
            /**
             * @language en_US
             * The BitmapData object being referenced.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 被引用的 BitmapData 对象。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._bitmapData;
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p._setBitmapData = function (value) {
            this._bitmapData = value;
            var w = value.width * egret.$TextureScaleFactor;
            var h = value.height * egret.$TextureScaleFactor;
            this.$initData(0, 0, w, h, 0, 0, w, h, w, h);
        };
        /**
         * @private
         * 设置Texture数据
         * @param bitmapX
         * @param bitmapY
         * @param bitmapWidth
         * @param bitmapHeight
         * @param offsetX
         * @param offsetY
         * @param textureWidth
         * @param textureHeight
         * @param sourceWidth
         * @param sourceHeight
         */
        p.$initData = function (bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, sourceWidth, sourceHeight) {
            var scale = egret.$TextureScaleFactor;
            this._bitmapX = bitmapX / scale;
            this._bitmapY = bitmapY / scale;
            this._bitmapWidth = bitmapWidth / scale;
            this._bitmapHeight = bitmapHeight / scale;
            this._offsetX = offsetX;
            this._offsetY = offsetY;
            this._textureWidth = textureWidth;
            this._textureHeight = textureHeight;
            this._sourceWidth = sourceWidth;
            this._sourceHeight = sourceHeight;
            //tudo
            if (this._bitmapData) {
                Texture.$invalidate(this._bitmapData.hashCode);
            }
        };
        /**
         * @language en_US
         * Obtain the color value of a pixel point
         * @param x {number} The x coordinate of a pixel point
         * @param y {number} The y coordinate of a pixel point
         * @returns {number} Color value of a specified pixel point
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取某一点像素的颜色值
         * @param x {number} 像素点的X轴坐标
         * @param y {number} 像素点的Y轴坐标
         * @returns {number} 指定像素点的颜色值
         * @version Egret 2.4
         * @platform Web
         */
        p.getPixel32 = function (x, y) {
            throw new Error();
        };
        /**
         * @language en_US
         * Convert base64 string, if the picture (or pictures included) cross-border or null
         * @param type Type conversions, such as "image / png"
         * @param rect The need to convert the area
         * @param smoothing Whether to convert data to the smoothing process
         * @returns {any} base64 string
         * @version Egret 2.4
         */
        /**
         * @language zh_CN
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如  "image/png"
         * @param rect 需要转换的区域
         * @returns {any} base64字符串
         * @version Egret 2.4
         */
        p.toDataURL = function (type, rect) {
            throw new Error();
        };
        /**
         * @language en_US
         * Crop designated area and save it as image.
         * native support only "image / png" and "image / jpeg"; Web browser because of the various implementations are not the same, it is recommended to use only these two kinds.
         * @param type Type conversions, such as "image / png"
         * @param filePath The path name of the image (the home directory for the game's private space, the path can not have "../",Web supports only pass names.)
         * @param rect The need to convert the area
         * @version Egret 2.4
         * @platform Native
         */
        /**
         * @language zh_CN
         * 裁剪指定区域并保存成图片。
         * native只支持 "image/png" 和 "image/jpeg"；Web中由于各个浏览器的实现不一样，因此建议也只用这2种。
         * @param type 转换的类型，如  "image/png"
         * @param filePath 图片的名称的路径（主目录为游戏的私有空间，路径中不能有 "../"，Web只支持传名称。）
         * @param rect 需要转换的区域
         * @version Egret 2.4
         * @platform Native
         */
        p.saveToFile = function (type, filePath, rect) {
            throw new Error();
        };
        /**
         * @language en_US
         * dispose texture
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放纹理
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.dispose = function () {
            if (this._bitmapData) {
                Texture.$dispose(this._bitmapData.hashCode);
                //console.log("dispose Texture");
                this._bitmapData = null;
            }
        };
        Texture.$addDisplayObject = function (displayObject, bitmapDataHashCode) {
            var hashCode = bitmapDataHashCode;
            if (!Texture._displayList[hashCode]) {
                Texture._displayList[hashCode] = [displayObject];
                return;
            }
            var tempList = Texture._displayList[hashCode];
            if (tempList.indexOf(displayObject) < 0) {
                tempList.push(displayObject);
            }
        };
        Texture.$removeDisplayObject = function (displayObject, bitmapDataHashCode) {
            var hashCode = bitmapDataHashCode;
            if (!Texture._displayList[hashCode]) {
                return;
            }
            var tempList = Texture._displayList[hashCode];
            var index = tempList.indexOf(displayObject);
            if (index >= 0) {
                tempList.splice(index);
            }
        };
        Texture.$invalidate = function (bitmapDataHashCode) {
            var hashCode = bitmapDataHashCode;
            if (!Texture._displayList[hashCode]) {
                return;
            }
            var tempList = Texture._displayList[hashCode];
            for (var i = 0; i < tempList.length; i++) {
                if (tempList[i] instanceof egret.Bitmap) {
                    tempList[i].$refreshImageData();
                }
                tempList[i].$invalidateContentBounds();
            }
        };
        Texture.$dispose = function (bitmapDataHashCode) {
            var hashCode = bitmapDataHashCode;
            if (!Texture._displayList[hashCode]) {
                return;
            }
            var tempList = Texture._displayList[hashCode];
            for (var i = 0; i < tempList.length; i++) {
                if (tempList[i] instanceof egret.Bitmap) {
                    tempList[i].$Bitmap[1 /* image */] = null;
                }
                tempList[i].$invalidateContentBounds();
            }
        };
        Texture._displayList = {};
        return Texture;
    })(egret.HashObject);
    egret.Texture = Texture;
    egret.registerClass(Texture,'egret.Texture');
    if (DEBUG) {
        egret.$markReadOnly(Texture, "textureWidth");
        egret.$markReadOnly(Texture, "textureHeight");
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var blendModes = ["source-over", "lighter", "destination-out"];
    var defaultCompositeOp = "source-over";
    /**
     * @language en_US
     * RenderTexture is a dynamic texture
     * @extends egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/RenderTexture.ts
     */
    /**
     * @language zh_CN
     * RenderTexture 是动态纹理类，他实现了将显示对象及其子对象绘制成为一个纹理的功能
     * @extends egret.Texture
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/RenderTexture.ts
     */
    var RenderTexture = (function (_super) {
        __extends(RenderTexture, _super);
        function RenderTexture() {
            _super.call(this);
            this.$displayListMap = {};
        }
        var d = __define,c=RenderTexture,p=c.prototype;
        /**
         * @language en_US
         * The specified display object is drawn as a texture
         * @param displayObject {egret.DisplayObject} the display to draw
         * @param clipBounds {egret.Rectangle} clip rect
         * @param scale {number} scale factor
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定显示对象绘制为一个纹理
         * @param displayObject {egret.DisplayObject} 需要绘制的显示对象
         * @param clipBounds {egret.Rectangle} 绘制矩形区域
         * @param scale {number} 缩放比例
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.drawToTexture = function (displayObject, clipBounds, scale) {
            if (scale === void 0) { scale = 1; }
            if (clipBounds && (clipBounds.width == 0 || clipBounds.height == 0)) {
                return false;
            }
            if (this.rootDisplayList) {
                egret.sys.DisplayList.release(this.rootDisplayList);
                this.rootDisplayList = null;
            }
            if (this.context) {
                egret.sys.surfaceFactory.release(this.context.surface);
            }
            var bounds = clipBounds || displayObject.$getOriginalBounds();
            if (bounds.width == 0 || bounds.height == 0) {
                return false;
            }
            scale /= egret.$TextureScaleFactor;
            var width = (bounds.x + bounds.width);
            var height = (bounds.y + bounds.height);
            if (clipBounds) {
                width = bounds.width;
                height = bounds.height;
            }
            this.context = this.createRenderContext(width, height);
            if (!this.context) {
                return false;
            }
            var root = new egret.DisplayObjectContainer();
            this.rootDisplayList = egret.sys.DisplayList.create(root);
            root.$displayList = this.rootDisplayList;
            root.$children.push(displayObject);
            var hasRenderRegion = displayObject.$renderRegion;
            if (!hasRenderRegion) {
                displayObject.$renderRegion = egret.sys.Region.create();
            }
            var parent = displayObject.$parent;
            displayObject.$parent = null;
            this.$saveParentDisplayList(displayObject);
            this.$update(displayObject);
            displayObject.$parent = parent;
            if (!hasRenderRegion) {
                egret.sys.Region.release(displayObject.$renderRegion);
                displayObject.$renderRegion = null;
            }
            var renderMatrix = displayObject.$renderMatrix;
            var invertMatrix = egret.Matrix.create();
            renderMatrix.$invertInto(invertMatrix);
            //应用裁切
            if (clipBounds) {
                invertMatrix.translate(-clipBounds.x, -clipBounds.y);
            }
            //应用缩放
            if (scale) {
                invertMatrix.scale(scale, scale);
            }
            this.context.clearRect(0, 0, width, height);
            this.context.setTransform(invertMatrix.a, invertMatrix.b, invertMatrix.c, invertMatrix.d, invertMatrix.tx, invertMatrix.ty);
            var drawCalls = this.drawDisplayObject(root, this.context, invertMatrix);
            egret.Matrix.release(invertMatrix);
            this._setBitmapData(this.context.surface);
            //设置纹理参数,todo 优化性能
            this.$initData(0, 0, width, height, 0, 0, width, height, width, height);
            this.$reset(displayObject);
            this.$displayListMap = {};
            return true;
        };
        p.$saveParentDisplayList = function (displayObject) {
            this.$displayListMap[displayObject.$hashCode] = displayObject.$displayList;
            displayObject.$displayList = this.rootDisplayList;
            if (displayObject instanceof egret.DisplayObjectContainer) {
                var children = displayObject.$children;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var child = children[i];
                    this.$saveParentDisplayList(child);
                }
            }
        };
        p.$update = function (displayObject) {
            if (displayObject.$renderRegion) {
                displayObject.$renderRegion.moved = true;
                displayObject.$update();
            }
            if (displayObject instanceof egret.DisplayObjectContainer) {
                var children = displayObject.$children;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var child = children[i];
                    this.$update(child);
                }
            }
        };
        p.$reset = function (displayObject) {
            displayObject.$displayList = this.$displayListMap[displayObject.$hashCode];
            if (displayObject instanceof egret.DisplayObjectContainer) {
                var children = displayObject.$children;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var child = children[i];
                    this.$reset(child);
                }
            }
        };
        p.drawDisplayObject = function (displayObject, context, rootMatrix) {
            var drawCalls = 0;
            var node;
            var globalAlpha;
            if (displayObject.$renderRegion) {
                node = displayObject;
                globalAlpha = displayObject.$renderAlpha;
            }
            if (node) {
                drawCalls++;
                context.globalAlpha = globalAlpha;
                var m = node.$renderMatrix;
                if (rootMatrix) {
                    context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    node.$render(context);
                    context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx, rootMatrix.ty);
                }
                else {
                    context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                    node.$render(context);
                }
            }
            var children = displayObject.$children;
            if (children) {
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var child = children[i];
                    if (!child.$visible || child.$alpha <= 0 || child.$maskedObject) {
                        continue;
                    }
                    if (child.$blendMode !== 0 || child.$mask) {
                        drawCalls += this.drawWithClip(child, context, rootMatrix);
                    }
                    else if (child.$scrollRect || child.$maskRect) {
                        drawCalls += this.drawWithScrollRect(child, context, rootMatrix);
                    }
                    else {
                        drawCalls += this.drawDisplayObject(child, context, rootMatrix);
                    }
                }
            }
            return drawCalls;
        };
        p.drawWithClip = function (displayObject, context, rootMatrix) {
            var drawCalls = 0;
            var hasBlendMode = (displayObject.$blendMode !== 0);
            if (hasBlendMode) {
                var compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }
            var scrollRect = displayObject.$scrollRect;
            var mask = displayObject.$mask;
            //计算scrollRect和mask的clip区域是否需要绘制，不需要就直接返回，跳过所有子项的遍历。
            var maskRegion;
            var displayMatrix = displayObject.$getConcatenatedMatrix();
            if (mask) {
                var bounds = mask.$getOriginalBounds();
                maskRegion = egret.sys.Region.create();
                maskRegion.updateRegion(bounds, mask.$getConcatenatedMatrix());
            }
            var region;
            if (scrollRect) {
                region = egret.sys.Region.create();
                region.updateRegion(scrollRect, displayMatrix);
            }
            if (region && maskRegion) {
                region.intersect(maskRegion);
                egret.sys.Region.release(maskRegion);
            }
            else if (!region && maskRegion) {
                region = maskRegion;
            }
            if (region) {
                if (region.isEmpty()) {
                    egret.sys.Region.release(region);
                    return drawCalls;
                }
            }
            else {
                region = egret.sys.Region.create();
                bounds = displayObject.$getOriginalBounds();
                region.updateRegion(bounds, displayObject.$getConcatenatedMatrix());
            }
            //绘制显示对象自身，若有scrollRect，应用clip
            var displayContext = this.createRenderContext(region.width, region.height);
            if (!displayContext) {
                drawCalls += this.drawDisplayObject(displayObject, context, rootMatrix);
                egret.sys.Region.release(region);
                return drawCalls;
            }
            if (scrollRect) {
                var m = displayMatrix;
                displayContext.setTransform(m.a, m.b, m.c, m.d, m.tx - region.minX, m.ty - region.minY);
                displayContext.beginPath();
                displayContext.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
                displayContext.clip();
            }
            displayContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
            var rootM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
            drawCalls += this.drawDisplayObject(displayObject, displayContext, rootM);
            egret.Matrix.release(rootM);
            //绘制遮罩
            if (mask) {
                var maskContext = this.createRenderContext(region.width, region.height);
                if (!maskContext) {
                    drawCalls += this.drawDisplayObject(displayObject, context, rootMatrix);
                    egret.sys.surfaceFactory.release(displayContext.surface);
                    egret.sys.Region.release(region);
                    return drawCalls;
                }
                maskContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                rootM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                var calls = this.drawDisplayObject(mask, maskContext, rootM);
                egret.Matrix.release(rootM);
                if (calls > 0) {
                    drawCalls += calls;
                    displayContext.globalCompositeOperation = "destination-in";
                    displayContext.setTransform(1, 0, 0, 1, 0, 0);
                    displayContext.globalAlpha = 1;
                    displayContext.drawImage(maskContext.surface, 0, 0);
                }
                egret.sys.surfaceFactory.release(maskContext.surface);
            }
            //绘制结果到屏幕
            if (drawCalls > 0) {
                drawCalls++;
                if (hasBlendMode) {
                    context.globalCompositeOperation = compositeOp;
                }
                context.setTransform(1, 0, 0, 1, region.minX, region.minY);
                context.drawImage(displayContext.surface, 0, 0);
                if (hasBlendMode) {
                    context.globalCompositeOperation = defaultCompositeOp;
                }
            }
            egret.sys.surfaceFactory.release(displayContext.surface);
            egret.sys.Region.release(region);
            return drawCalls;
        };
        p.drawWithScrollRect = function (displayObject, context, rootMatrix) {
            var drawCalls = 0;
            var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            if (scrollRect.width == 0 || scrollRect.height == 0) {
                return drawCalls;
            }
            var m = displayObject.$getConcatenatedMatrix();
            var region = egret.sys.Region.create();
            if (!scrollRect.isEmpty()) {
                region.updateRegion(scrollRect, m);
            }
            if (region.isEmpty()) {
                egret.sys.Region.release(region);
                return drawCalls;
            }
            //绘制显示对象自身
            context.save();
            if (rootMatrix) {
                context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx, rootMatrix.ty);
                context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            else {
                context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            context.beginPath();
            context.rect(0, 0, scrollRect.width, scrollRect.height);
            context.clip();
            if (rootMatrix) {
                context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx, rootMatrix.ty);
            }
            drawCalls += this.drawDisplayObject(displayObject, context, rootMatrix);
            context.restore();
            egret.sys.Region.release(region);
            return drawCalls;
        };
        p.createRenderContext = function (width, height) {
            var surface = egret.sys.surfaceFactory.create(true);
            if (!surface) {
                return null;
            }
            surface.width = Math.max(257, width);
            surface.height = Math.max(257, height);
            return surface.renderContext;
        };
        p.dispose = function () {
            _super.prototype.dispose.call(this);
            if (this.rootDisplayList) {
                egret.sys.DisplayList.release(this.rootDisplayList);
                this.rootDisplayList = null;
            }
            if (this.context) {
                egret.sys.surfaceFactory.release(this.context.surface);
            }
        };
        return RenderTexture;
    })(egret.Texture);
    egret.RenderTexture = RenderTexture;
    egret.registerClass(RenderTexture,'egret.RenderTexture');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * This class is used to create lightweight shapes using the drawing application program interface (API). The Shape
     * class includes a graphics property, which lets you access methods from the Graphics class.
     * @see egret.Graphics
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Shape.ts
     */
    /**
     * @language zh_CN
     * 此类用于使用绘图应用程序编程接口 (API) 创建简单形状。Shape 类含有 graphics 属性，通过该属性您可以访问各种矢量绘图方法。
     * @see egret.Graphics
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Shape.ts
     */
    var Shape = (function (_super) {
        __extends(Shape, _super);
        /**
         * @language en_US
         * Creates a new Shape object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 Shape 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Shape() {
            _super.call(this);
            this.$graphics = new egret.Graphics();
            this.$graphics.$renderContext.$targetDisplay = this;
            this.$renderRegion = new egret.sys.Region();
        }
        var d = __define,c=Shape,p=c.prototype;
        d(p, "graphics"
            /**
             * @language en_US
             * Specifies the Graphics object belonging to this Shape object, where vector drawing commands can occur.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 获取 Shape 中的 Graphics 对象。可通过此对象执行矢量绘图命令。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$graphics;
            }
        );
        /**
         * @private
         */
        p.$measureContentBounds = function (bounds) {
            this.$graphics.$measureContentBounds(bounds);
        };
        p.$hitTest = function (stageX, stageY) {
            var target = _super.prototype.$hitTest.call(this, stageX, stageY);
            if (target == this) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }
            return target;
        };
        /**
         * @private
         */
        p.$render = function (context) {
            this.$graphics.$render(context);
        };
        return Shape;
    })(egret.DisplayObject);
    egret.Shape = Shape;
    egret.registerClass(Shape,'egret.Shape');
    if (DEBUG) {
        egret.$markReadOnly(Shape, "graphics");
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The Sprite class is a basic display list building block: a display list node that can contain children.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Sprite.ts
     */
    /**
     * @language zh_CN
     * Sprite 类是基本显示列表构造块：一个可包含子项的显示列表节点。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Sprite.ts
     */
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        /**
         * @language en_US
         * Creates a new Sprite instance.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 实例化一个容器
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Sprite() {
            _super.call(this);
            this.$graphics = new egret.Graphics();
            this.$graphics.$renderContext.$targetDisplay = this;
            this.$renderRegion = new egret.sys.Region();
        }
        var d = __define,c=Sprite,p=c.prototype;
        d(p, "graphics"
            /**
             * @language en_US
             * Specifies the Graphics object belonging to this Shape object, where vector drawing commands can occur.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 获取 Shape 中的 Graphics 对象。可通过此对象执行矢量绘图命令。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$graphics;
            }
        );
        p.$hitTest = function (stageX, stageY) {
            if (!this.$visible) {
                return null;
            }
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
            if (rect && !rect.contains(localX, localY)) {
                return null;
            }
            if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                return null;
            }
            var children = this.$children;
            var found = false;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (child.$maskedObject) {
                    continue;
                }
                var target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if (target.$touchEnabled) {
                        break;
                    }
                    else {
                        target = null;
                    }
                }
            }
            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
                return this;
            }
            if (found) {
                return this;
            }
            target = egret.DisplayObject.prototype.$hitTest.call(this, stageX, stageY);
            if (target) {
                target = this.$graphics.$hitTest(stageX, stageY);
            }
            return target;
        };
        /**
         * @private
         */
        p.$measureContentBounds = function (bounds) {
            this.$graphics.$measureContentBounds(bounds);
        };
        /**
         * @private
         */
        p.$render = function (context) {
            this.$graphics.$render(context);
        };
        return Sprite;
    })(egret.DisplayObjectContainer);
    egret.Sprite = Sprite;
    egret.registerClass(Sprite,'egret.Sprite');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * SpriteSheet is a mosaic of multiple sub-bitmaps, comprising a plurality of Texture objects.
     * Each Texture object shares the set bitmap of SpriteSheet, but it points to its different areas.
     * On WebGL / OpenGL, this operation can significantly improve performance.
     * At the same time, SpriteSheet can carry out material integration easily to reduce the number of HTTP requests
     * For specification of the SpriteSheet format, see the document https://github.com/egret-labs/egret-core/wiki/Egret-SpriteSheet-Specification
     * @see http://docs.egret-labs.org/post/manual/bitmap/textures.html The use of texture packs
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/SpriteSheet.ts
     */
    /**
     * @language zh_CN
     * SpriteSheet 是一张由多个子位图拼接而成的集合位图，它包含多个 Texture 对象。
     * 每一个 Texture 都共享 SpriteSheet 的集合位图，但是指向它的不同的区域。
     * 在WebGL / OpenGL上，这种做法可以显著提升性能
     * 同时，SpriteSheet可以很方便的进行素材整合，降低HTTP请求数量
     * SpriteSheet 格式的具体规范可以参见此文档  https://github.com/egret-labs/egret-core/wiki/Egret-SpriteSheet-Specification
     * @see http://docs.egret-labs.org/post/manual/bitmap/textures.html 纹理集的使用
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/SpriteSheet.ts
     */
    var SpriteSheet = (function (_super) {
        __extends(SpriteSheet, _super);
        /**
         * @language en_US
         * Create an egret.SpriteSheet object
         * @param texture {Texture} Texture
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.SpriteSheet 对象
         * @param texture {Texture} 纹理
         * @version Egret 2.4
         * @platform Web,Native
         */
        function SpriteSheet(texture) {
            _super.call(this);
            /**
             * @private
             * 表示这个SpriteSheet的位图区域在bitmapData上的起始位置x。
             */
            this._bitmapX = 0;
            /**
             * @private
             * 表示这个SpriteSheet的位图区域在bitmapData上的起始位置y。
             */
            this._bitmapY = 0;
            /**
             * @private
             * 纹理缓存字典
             */
            this._textureMap = {};
            this.texture = texture;
            this._bitmapX = texture._bitmapX - texture._offsetX;
            this._bitmapY = texture._bitmapY - texture._offsetY;
        }
        var d = __define,c=SpriteSheet,p=c.prototype;
        /**
         * @language en_US
         * Obtain a cached Texture object according to the specified texture name
         * @param name {string} Cache the name of this Texture object
         * @returns {egret.Texture} The Texture object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据指定纹理名称获取一个缓存的 Texture 对象
         * @param name {string} 缓存这个 Texture 对象所使用的名称
         * @returns {egret.Texture} Texture 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getTexture = function (name) {
            return this._textureMap[name];
        };
        /**
         * @language en_US
         * Create a new Texture object for the specified area on SpriteSheet and cache it
         * @param name {string} Cache the name of this Texture object. If the name already exists, the previous Texture object will be overwrited.
         * @param bitmapX {number} Starting coordinate x of texture area on bitmapData
         * @param bitmapY {number} Starting coordinate y of texture area on bitmapData
         * @param bitmapWidth {number} Width of texture area on bitmapData
         * @param bitmapHeight {number} Height of texture area on bitmapData
         * @param offsetX {number} Starting point x for a non-transparent area of the original bitmap
         * @param offsetY {number} Starting point y for a non-transparent area of the original bitmap
         * @param textureWidth {number} Width of the original bitmap. If it is not passed, use the bitmapWidth  value.
         * @param textureHeight {number} Height of the original bitmap. If it is not passed, use the bitmapHeight value.
         * @returns {egret.Texture} The created Texture object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 为 SpriteSheet 上的指定区域创建一个新的 Texture 对象并缓存它
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
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.createTexture = function (name, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight) {
            if (offsetX === void 0) { offsetX = 0; }
            if (offsetY === void 0) { offsetY = 0; }
            if (egret.sys.isUndefined(textureWidth)) {
                textureWidth = offsetX + bitmapWidth;
            }
            if (egret.sys.isUndefined(textureHeight)) {
                textureHeight = offsetY + bitmapHeight;
            }
            var texture = new egret.Texture();
            texture._bitmapData = this.texture._bitmapData;
            texture.$initData(this._bitmapX + bitmapX, this._bitmapY + bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight, this.texture._sourceWidth, this.texture._sourceHeight);
            this._textureMap[name] = texture;
            return texture;
        };
        /**
         * @language en_US
         * dispose texture
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放纹理
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.dispose = function () {
            if (this.texture) {
                this.texture.dispose();
            }
        };
        return SpriteSheet;
    })(egret.HashObject);
    egret.SpriteSheet = SpriteSheet;
    egret.registerClass(SpriteSheet,'egret.SpriteSheet');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The Stage class represents the main drawing area.The Stage object is not globally accessible. You need to access
     * it through the stage property of a DisplayObject instance.<br/>
     * The Stage class has several ancestor classes — Sprite, DisplayObject, and EventDispatcher — from which it inherits
     * properties and methods. Many of these properties and methods are inapplicable to Stage objects.
     * @event egret.Event.RESIZE Dispatched when the stageWidth or stageHeight property of the Stage object is changed.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Stage.ts
     */
    /**
     * @language zh_CN
     * Stage 类代表主绘图区。
     * 可以利用 DisplayObject 实例的 stage 属性进行访问。<br/>
     * Stage 类具有多个祖代类: Sprite、DisplayObject 和 EventDispatcher，属性和方法便是从这些类继承而来的。
     * 从这些继承的许多属性和方法不适用于 Stage 对象。
     * @event egret.Event.RESIZE 当stageWidth或stageHeight属性发生改变时调度
     * @event egret.Event.DEACTIVATE 当stage失去焦点后调度
     * @event egret.Event.ACTIVATE 当stage获得焦点后调度
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Stage.ts
     */
    var Stage = (function (_super) {
        __extends(Stage, _super);
        /**
         * @private
         * Stage不许允许自行实例化
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Stage() {
            _super.call(this);
            /**
             * @private
             */
            this.$stageWidth = 0;
            /**
             * @private
             */
            this.$stageHeight = 0;
            /**
             * @private
             */
            this.implMap = {};
            this.$scaleMode = egret.StageScaleMode.SHOW_ALL;
            this.$orientation = egret.OrientationMode.AUTO;
            this.$maxTouches = 99;
            this.$dirtyRegionPolicy = egret.DirtyRegionPolicy.ON;
            this.$stage = this;
            this.$nestLevel = 1;
        }
        var d = __define,c=Stage,p=c.prototype;
        d(p, "frameRate"
            /**
             * @language en_US
             * Gets and sets the frame rate of the stage. The frame rate is defined as frames per second. Valid range for the
             * frame rate is from 0.01 to 1000 frames per second.<br/>
             * Note: setting the frameRate property of one Stage object changes the frame rate for all Stage objects
             * @default 30
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 获取并设置舞台的帧速率。帧速率是指每秒显示的帧数。帧速率的有效范围为每秒 0.01 到 60 个帧。<br/>
             * 注意: 修改任何一个Stage的frameRate属性都会同步修改其他Stage的帧率。
             * @default 30
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return egret.sys.$ticker.$frameRate;
            }
            ,function (value) {
                egret.sys.$ticker.$setFrameRate(value);
            }
        );
        d(p, "stageWidth"
            /**
             * @language en_US
             * Indicates the width of the stage, in pixels.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 舞台的当前宽度（以像素为单位）。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$stageWidth;
            }
        );
        d(p, "stageHeight"
            /**
             * @language en_US
             * Indicates the height of the stage, in pixels.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 舞台的当前高度（以像素为单位）。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$stageHeight;
            }
        );
        /**
         * @language en_US
         * After you call the invalidate() method, when the display list is next rendered, the Egret runtime sends a render
         * event to each display object that has registered to listen for the render event. You must call the invalidate()
         * method each time you want the Egret runtime to send render events.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 调用 invalidate() 方法后，在显示列表下次呈现时，Egret 会向每个已注册侦听 Event.RENDER 事件的显示对象发送一个 Event.RENDER 事件。
         * 每次您希望 Egret 发送 Event.RENDER 事件时，都必须调用 invalidate() 方法。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.invalidate = function () {
            egret.sys.$invalidateRenderFlag = true;
        };
        /**
         * @language en_US
         * Adds an interface-name-to-implementation-class mapping to the registry.
         * @param interfaceName the interface name to register. For example："eui.IAssetAdapter","eui.Theme"
         * @param instance the instance to register.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 注册一个接口实现。
         * @param interfaceName 注入的接口名称。例如："eui.IAssetAdapter","eui.Theme"
         * @param instance 实现此接口的实例。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.registerImplementation = function (interfaceName, instance) {
            this.implMap[interfaceName] = instance;
        };
        /**
         * @language en_US
         * Returns the singleton instance of the implementation class that was registered for the specified interface.
         * This method is usually called by egret framework.
         * @param interfaceName The interface name to identify. For example："eui.IAssetAdapter","eui.Theme"
         * @returns the singleton instance of the implementation class
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取一个接口实现。此方法通常由框架内部调用。获取项目注入的自定义实现实例。
         * @param interfaceName 要获取的接口名称。例如："eui.IAssetAdapter","eui.Theme"
         * @returns 返回实现此接口的实例。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getImplementation = function (interfaceName) {
            return this.implMap[interfaceName];
        };
        d(p, "scaleMode"
            /**
             * @language en_US
             * A StageScaleMode class that specifies which scale mode to use. The following are valid values:<br/>
             * <ul>
             * <li>StageScaleMode.EXACT_FIT -- The entire application be visible in the specified area without trying to preserve the original aspect ratio. Distortion can occur, the application may be stretched or compressed.</li>
             * <li>StageScaleMode.SHOW_ALL -- The entire application is visible in the specified area without distortion while maintaining the application of the original aspect ratio. Applications may display border.</li>
             * <li>StageScaleMode.NO_SCALE -- The size of the entire application is fixed, so that even if the size of the player window changes, it remains unchanged. If the player window is smaller than the content, it may do some trimming.</li>
             * <li>StageScaleMode.NO_BORDER -- Keep the original aspect ratio scaling application content, after scaling a narrow direction of application content to fill the viewport players on both sides in the other direction may exceed the viewport and the player is cut.</li>
             * <li>StageScaleMode.FIXED_WIDTH -- Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant width, height may change.</li>
             * <li>StageScaleMode.FIXED_HEIGHT -- Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant height, width may change.</li>
             * </ul>
             * @default egret.StageScaleMode.SHOW_ALL
             */
            /**
             * @language zh_CN
             * 一个 StageScaleMode 类中指定要使用哪种缩放模式的值。以下是有效值：<br/>
             * <ul>
             * <li>StageScaleMode.EXACT_FIT -- 整个应用程序在指定区域中可见，但不尝试保持原始高宽比。可能会发生扭曲，应用程序可能会拉伸或压缩显示。</li>
             * <li>StageScaleMode.SHOW_ALL -- 整个应用程序在指定区域中可见，且不发生扭曲，同时保持应用程序的原始高宽比。应用程序的可能会显示边框。</li>
             * <li>StageScaleMode.NO_SCALE -- 整个应用程序的大小固定，因此，即使播放器窗口的大小更改，它也会保持不变。如果播放器窗口比内容小，则可能进行一些裁切。</li>
             * <li>StageScaleMode.NO_BORDER -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容的较窄方向填满播放器视口，另一个方向的两侧可能会超出播放器视口而被裁切。</li>
             * <li>StageScaleMode.FIXED_WIDTH -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始宽度不变，高度可能会改变。</li>
             * <li>StageScaleMode.FIXED_HEIGHT -- 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始高度不变，宽度可能会改变。</li>
             * </ul>
             * @default egret.StageScaleMode.SHOW_ALL
             */
            ,function () {
                return this.$scaleMode;
            }
            ,function (value) {
                if (this.$scaleMode == value) {
                    return;
                }
                this.$scaleMode = value;
                this.$screen.updateScreenSize();
            }
        );
        d(p, "orientation"
            /**
             * @language en_US
             * Horizontal and vertical screen display screen, can only be set under the current Native in the configuration file. A egret.OrientationMode class that specifies which display mode to use. The following are valid values:<br/>
             * <ul>
             * <li>egret.OrientationMode.AUTO -- Always follow the direction of application display screen, always guaranteed by the look down.</li>
             * <li>egret.OrientationMode.PORTRAIT -- Applications remain portrait mode, namely horizontal screen look, the screen from left to right.</li>
             * <li>egret.OrientationMode.LANDSCAPE -- Applications remain horizontal screen mode, namely vertical screen, the screen from right to left.</li>
             * <li>egret.OrientationMode.LANDSCAPE_FLIPPED -- Applications remain horizontal screen mode, namely vertical screen, the screen from left to right.</li>
             * </ul>
             * @platform Web
             * @version 2.4
             */
            /**
             * @language zh_CN
             * 屏幕横竖屏显示方式，目前 Native 下只能在配置文件里设置。一个 egret.OrientationMode 类中指定要使用哪种显示方式。以下是有效值：<br/>
             * <ul>
             * <li>egret.OrientationMode.AUTO -- 应用始终跟随屏幕的方向显示，始终保证由上往下看。</li>
             * <li>egret.OrientationMode.PORTRAIT -- 应用始终保持竖屏模式，即横屏看时，屏幕由左往右看。</li>
             * <li>egret.OrientationMode.LANDSCAPE -- 应用始终保持横屏模式，即竖屏看时，屏幕显示由右往左。</li>
             * <li>egret.OrientationMode.LANDSCAPE_FLIPPED -- 应用始终保持横屏模式，即竖屏看时，屏幕显示由左往右。</li>
             * </ul>
             * @platform Web
             * @version 2.4
             */
            ,function () {
                return this.$orientation;
            }
            ,function (value) {
                if (this.$orientation == value) {
                    return;
                }
                this.$orientation = value;
                this.$screen.updateScreenSize();
            }
        );
        d(p, "textureScaleFactor"
            /**
             * @language en_US
             * Draw texture zoom ratio
             * @default 1
             */
            /**
             * @language zh_CN
             * 绘制纹理的缩放比率，默认值为1
             * @default 1
             */
            ,function () {
                return egret.$TextureScaleFactor;
            }
            ,function (value) {
                egret.$TextureScaleFactor = value;
            }
        );
        d(p, "maxTouches"
            /**
             * @language en_US
             * Set the number of screens can simultaneously touch. Above this amount will not be triggered in response.
             * @default 99
             */
            /**
             * @language zh_CN
             * 设置屏幕同时可以触摸的数量。高于这个数量将不会被触发响应。
             * @default 99
             */
            ,function () {
                return this.$maxTouches;
            }
            ,function (value) {
                if (this.$maxTouches == value) {
                    return;
                }
                this.$maxTouches = value;
                this.$screen.updateMaxTouches();
            }
        );
        d(p, "dirtyRegionPolicy"
            ,function () {
                return this.$dirtyRegionPolicy;
            }
            /**
             * @language en_US
             * Set dirty region policy
             * One of the constants defined by egret.DirtyRegionPolicy
             * @version Egret 2.5.5
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 设置脏矩形策略
             * egret.DirtyRegionPolicy 定义的常量之一
             * @version Egret 2.5.5
             * @platform Web,Native
             */
            ,function (policy) {
                if (this.$dirtyRegionPolicy != policy) {
                    this.$dirtyRegionPolicy = policy;
                    this.$displayList.setDirtyRegionPolicy(policy);
                }
            }
        );
        /**
         * @language en_US
         * Set resolution size
         * @param width width
         * @param height height
         * @version Egret 2.5.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置分辨率尺寸
         * @param width 宽度
         * @param height 高度
         * @version Egret 2.5.5
         * @platform Web,Native
         */
        p.setContentSize = function (width, height) {
            this.$screen.setContentSize(width, height);
        };
        return Stage;
    })(egret.DisplayObjectContainer);
    egret.Stage = Stage;
    egret.registerClass(Stage,'egret.Stage');
    if (DEBUG) {
        egret.$markCannotUse(Stage, "alpha", 1);
        egret.$markCannotUse(Stage, "visible", true);
        egret.$markCannotUse(Stage, "x", 0);
        egret.$markCannotUse(Stage, "y", 0);
        egret.$markCannotUse(Stage, "scaleX", 1);
        egret.$markCannotUse(Stage, "scaleY", 1);
        egret.$markCannotUse(Stage, "rotation", 0);
        egret.$markCannotUse(Stage, "cacheAsBitmap", false);
        egret.$markCannotUse(Stage, "scrollRect", null);
        egret.$markCannotUse(Stage, "filters", null);
        egret.$markCannotUse(Stage, "blendMode", null);
        egret.$markCannotUse(Stage, "touchEnabled", true);
        egret.$markCannotUse(Stage, "matrix", null);
    }
    if (DEBUG) {
        egret.$markReadOnly(Stage, "stageWidth");
        egret.$markReadOnly(Stage, "stageHeight");
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The Event class is used as the base class for the creation of Event objects, which are passed as parameters to event
     * listeners when an event occurs.The properties of the Event class carry basic information about an event, such as
     * the event's type or whether the event's default behavior can be canceled. For many events, such as the events represented
     * by the Event class constants, this basic information is sufficient. Other events, however, may require more detailed
     * information. Events associated with a touch tap, for example, need to include additional information about the
     * location of the touch event. You can pass such additional information to event listeners by extending the Event class,
     * which is what the TouchEvent class does. Egret API defines several Event subclasses for common events that require
     * additional information. Events associated with each of the Event subclasses are described in the documentation for
     * each class.The methods of the Event class can be used in event listener functions to affect the behavior of the event
     * object. Some events have an associated default behavior. Your event listener can cancel this behavior by calling the
     * preventDefault() method. You can also make the current event listener the last one to process an event by calling
     * the stopPropagation() or stopImmediatePropagation() method.
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/Event.ts
     */
    /**
     * @language zh_CN
     * Event 类作为创建事件实例的基类，当发生事件时，Event 实例将作为参数传递给事件侦听器。Event 类的属性包含有关事件的基本信息，例如事件
     * 的类型或者是否可以取消事件的默认行为。对于许多事件（如由 Event 类常量表示的事件），此基本信息就足够了。但其他事件可能需要更详细的信息。
     * 例如，与触摸关联的事件需要包括有关触摸事件的位置信息。您可以通过扩展 Event 类（TouchEvent 类执行的操作）将此类其他信息传递给事件侦听器。
     * Egret API 为需要其他信息的常见事件定义多个 Event 子类。与每个 Event 子类关联的事件将在每个类的文档中加以介绍。Event 类的方法可以在
     * 事件侦听器函数中使用以影响事件对象的行为。某些事件有关联的默认行为，通过调用 preventDefault() 方法，您的事件侦听器可以取消此行为。
     * 可以通过调用 stopPropagation() 或 stopImmediatePropagation() 方法，将当前事件侦听器作为处理事件的最后一个事件侦听器。
     * @see egret.EventDispatcher
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/Event.ts
     */
    var Event = (function (_super) {
        __extends(Event, _super);
        /**
         * @language en_US
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param data the optional data associated with this event
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param data 与此事件对象关联的可选数据。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Event(type, bubbles, cancelable, data) {
            _super.call(this);
            /**
             * @private
             */
            this.$eventPhase = 2;
            /**
             * @private
             */
            this.$currentTarget = null;
            /**
             * @private
             */
            this.$target = null;
            /**
             * @private
             */
            this.$isDefaultPrevented = false;
            /**
             * @private
             */
            this.$isPropagationStopped = false;
            /**
             * @private
             */
            this.$isPropagationImmediateStopped = false;
            this.$type = type;
            this.$bubbles = !!bubbles;
            this.$cancelable = !!cancelable;
            this.data = data;
        }
        var d = __define,c=Event,p=c.prototype;
        d(p, "type"
            /**
             * @language en_US
             * The type of event. The type is case-sensitive.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 事件的类型。类型区分大小写。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$type;
            }
        );
        d(p, "bubbles"
            /**
             * @language en_US
             * Indicates whether an event is a bubbling event.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示事件是否为冒泡事件。如果事件可以冒泡，则此值为 true；否则为 false。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$bubbles;
            }
        );
        d(p, "cancelable"
            /**
             * @language en_US
             * Indicates whether the behavior associated with the event can be prevented. If the behavior can be
             * canceled, this value is true; otherwise it is false.
             * @see #preventDefault()
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示是否可以阻止与事件相关联的行为。如果可以取消该行为，则此值为 true；否则为 false。
             * @see #preventDefault()
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$cancelable;
            }
        );
        d(p, "eventPhase"
            /**
             * @language en_US
             * The current phase in the event flow. This property can contain the following numeric values:
             * The capture phase (EventPhase.CAPTURING_PHASE).
             * The target phase (EventPhase.AT_TARGET)
             * The bubbling phase (EventPhase.BUBBLING_PHASE).
             * @see egret.EventPhase
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 事件流中的当前阶段。此属性可以包含以下数值：
             * 捕获阶段 (EventPhase.CAPTURING_PHASE)。
             * 目标阶段 (EventPhase.AT_TARGET)。
             * 冒泡阶段 (EventPhase.BUBBLING_PHASE)。
             * @see egret.EventPhase
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$eventPhase;
            }
        );
        d(p, "currentTarget"
            /**
             * @language en_US
             * The object that is actively processing the Event object with an event listener. For example, if a
             * user clicks an OK button, the current target could be the node containing that button or one of its ancestors
             * that has registered an event listener for that event.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 当前正在使用某个事件侦听器处理 Event 对象的对象。例如，如果用户单击“确定”按钮，
             * 则当前目标可以是包含该按钮的节点，也可以是它的已为该事件注册了事件侦听器的始祖之一。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$currentTarget;
            }
        );
        d(p, "target"
            /**
             * @language en_US
             * The event target. This property contains the target node. For example, if a user clicks an OK button,
             * the target node is the display list node containing that button.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 事件目标。此属性包含目标节点。例如，如果用户单击“确定”按钮，则目标节点就是包含该按钮的显示列表节点。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$target;
            }
        );
        p.$setTarget = function (target) {
            this.$target = target;
            return true;
        };
        /**
         * @language en_US
         * Checks whether the preventDefault() method has been called on the event. If the preventDefault() method has been
         * called, returns true; otherwise, returns false.
         * @returns If preventDefault() has been called, returns true; otherwise, returns false.
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 检查是否已对事件调用 preventDefault() 方法。
         * @returns 如果已调用 preventDefault() 方法，则返回 true；否则返回 false。
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.isDefaultPrevented = function () {
            return this.$isDefaultPrevented;
        };
        /**
         * @language en_US
         * Cancels an event's default behavior if that behavior can be canceled.Many events have associated behaviors that
         * are carried out by default. For example, if a user types a character into a text input, the default behavior
         * is that the character is displayed in the text input. Because the TextEvent.TEXT_INPUT event's default behavior
         * can be canceled, you can use the preventDefault() method to prevent the character from appearing.
         * You can use the Event.cancelable property to check whether you can prevent the default behavior associated with
         * a particular event. If the value of Event.cancelable is true, then preventDefault() can be used to cancel the event;
         * otherwise, preventDefault() has no effect.
         * @see #cancelable
         * @see #isDefaultPrevented
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果可以取消事件的默认行为，则取消该行为。
         * 许多事件都有默认执行的关联行为。例如，如果用户在文本字段中键入一个字符，则默认行为就是在文本字段中显示该字符。
         * 由于可以取消 TextEvent.TEXT_INPUT 事件的默认行为，因此您可以使用 preventDefault() 方法来防止显示该字符。
         * 您可以使用 Event.cancelable 属性来检查是否可以防止与特定事件关联的默认行为。如果 Event.cancelable 的值为 true，
         * 则可以使用 preventDefault() 来取消事件；否则，preventDefault() 无效。
         * @see #cancelable
         * @see #isDefaultPrevented
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.preventDefault = function () {
            if (this.$cancelable)
                this.$isDefaultPrevented = true;
        };
        /**
         * @language en_US
         * Prevents processing of any event listeners in nodes subsequent to the current node in the event flow. This method
         * does not affect any event listeners in the current node (currentTarget). In contrast, the stopImmediatePropagation()
         * method prevents processing of event listeners in both the current node and subsequent nodes. Additional calls to this
         * method have no effect. This method can be called in any phase of the event flow.<br/>
         * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
         * @see #stopImmediatePropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 防止对事件流中当前节点的后续节点中的所有事件侦听器进行处理。此方法不会影响当前节点 currentTarget 中的任何事件侦听器。
         * 相比之下，stopImmediatePropagation() 方法可以防止对当前节点中和后续节点中的事件侦听器进行处理。
         * 对此方法的其它调用没有任何效果。可以在事件流的任何阶段中调用此方法。<br/>
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @see #stopImmediatePropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.stopPropagation = function () {
            if (this.$bubbles)
                this.$isPropagationStopped = true;
        };
        /**
         * @language en_US
         * Prevents processing of any event listeners in the current node and any subsequent nodes in the event flow.
         * This method takes effect immediately, and it affects event listeners in the current node. In contrast, the
         * stopPropagation() method doesn't take effect until all the event listeners in the current node finish processing.<br/>
         * Note: This method does not cancel the behavior associated with this event; see preventDefault() for that functionality.
         * @see #stopPropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 防止对事件流中当前节点中和所有后续节点中的事件侦听器进行处理。此方法会立即生效，并且会影响当前节点中的事件侦听器。
         * 相比之下，在当前节点中的所有事件侦听器都完成处理之前，stopPropagation() 方法不会生效。<br/>
         * 注意：此方法不会取消与此事件相关联的行为；有关此功能的信息，请参阅 preventDefault()。
         * @see #stopPropagation()
         * @see #preventDefault()
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.stopImmediatePropagation = function () {
            if (this.$bubbles)
                this.$isPropagationImmediateStopped = true;
        };
        /**
         * @language en_US
         * This method will be called automatically when you pass the event object as the parameters to the Event.release() method.
         * If your custom event is designed for reusable,you should override this method to make sure all the references to external
         * objects are cleaned. if not,it may cause memory leaking.
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当事件实例传递给Event.release()静态方法时，实例上的clean()方法将会被自动调用。
         * 若此自定义事件的实例设计为可以循环复用的，为了避免引起内存泄露，自定义事件需要覆盖此方法来确保实例被缓存前断开对外部对象的一切引用。
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clean = function () {
            this.data = this.$currentTarget = null;
            this.$setTarget(null);
        };
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown Event. Objects thrown objects will be cached in the pool for the next round robin.
         * @param target the event target
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param data {any} data
         * @method egret.Event.dispatchEvent
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的 EventDispatcher 对象来抛出 Event 事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param data {any} 事件data
         * @method egret.Event.dispatchEvent
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.dispatchEvent = function (target, type, bubbles, data) {
            if (bubbles === void 0) { bubbles = false; }
            var event = Event.create(Event, type, bubbles);
            var props = Event._getPropertyData(Event);
            if (data != undefined) {
                props.data = data;
            }
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        };
        /**
         * @private
         *
         * @param EventClass
         * @returns
         */
        Event._getPropertyData = function (EventClass) {
            var props = EventClass._props;
            if (!props)
                props = EventClass._props = {};
            return props;
        };
        /**
         * @language en_US
         * Gets one event instance from the object pool or create a new one. We highly recommend using the Event.create()
         * and Event.release() methods to create and release an event object,it can reduce the number of reallocate objects,
         * which allows you to get better code execution performance.<br/>
         * Note: If you want to use this method to initialize your custom event object,you must make sure the constructor
         * of your custom event is the same as the constructor of egret.Event.
         * @param EventClass Event Class。
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @example
         * <pre>
         *    var event = Event.create(Event,type, bubbles);
         *    event.data = data;    //optional,initializes custom data here
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的事件实例。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
         * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
         * 注意：若使用此方法来创建自定义事件的实例，自定义的构造函数参数列表必须跟Event类一致。
         * @param EventClass Event类名。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @example
         * <pre>
         *    var event = Event.create(Event,type, bubbles);
         *    event.data = data;  //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.create = function (EventClass, type, bubbles, cancelable) {
            var eventPool = EventClass.eventPool;
            if (!eventPool) {
                eventPool = EventClass.eventPool = [];
            }
            if (eventPool.length) {
                var event = eventPool.pop();
                event.$type = type;
                event.$bubbles = !!bubbles;
                event.$cancelable = !!cancelable;
                event.$isDefaultPrevented = false;
                event.$isPropagationStopped = false;
                event.$isPropagationImmediateStopped = false;
                event.$eventPhase = 2 /* AT_TARGET */;
                return event;
            }
            return new EventClass(type, bubbles, cancelable);
        };
        /**
         * @language en_US
         * Releases an event object and cache it into the object pool.We highly recommend using the Event.create()
         * and Event.release() methods to create and release an event object,it can reduce the number of reallocate objects,
         * which allows you to get better code execution performance.<br/>
         * Note: The parameters of this method only accepts an instance created by the Event.create() method.
         * if not,it may throw an error.
         * @example
         * <pre>
         *    var event = Event.create(Event,type, bubbles);
         *    event.data = data; //optional,initializes custom data here
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个事件对象，并缓存到对象池。我们建议您尽可能使用Event.create()和Event.release() 这一对方法来创建和释放事件对象，
         * 这一对方法会将事件实例在内部缓存下来供下次循环使用，减少对象的创建次数,从而获得更高的代码运行性能。<br/>
         * 注意：此方法只能传入由Event.create()创建的事件实例，传入非法对象实例可能会导致报错。
         * @example
         * <pre>
         *    var event = Event.create(Event,type, bubbles);
         *    event.data = data;   //可选，若指定义事件上需要附加其他参数，可以在获取实例后在此处设置。
         *    this.dispatchEvent(event);
         *    Event.release(event);
         * </pre>
         * @see #clean()
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.release = function (event) {
            event.clean();
            var EventClass = Object.getPrototypeOf(event).constructor;
            EventClass.eventPool.push(event);
        };
        /**
         * @language en_US
         * Dispatched when a display object is added to the on stage display list, either directly or through the addition
         * of a sub tree in which the display object is contained.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在将显示对象直接添加到舞台显示列表或将包含显示对象的子树添加至舞台显示列表中时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.ADDED_TO_STAGE = "addedToStage";
        /**
         * @language en_US
         * Dispatched when a display object is about to be removed from the display list, either directly or through the removal
         * of a sub tree in which the display object is contained.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在从显示列表中直接删除显示对象或删除包含显示对象的子树时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.REMOVED_FROM_STAGE = "removedFromStage";
        /**
         * @language en_US
         * Dispatched when a display object is added to the display list.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将显示对象添加到显示列表中时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.ADDED = "added";
        /**
         * @language en_US
         * Dispatched when a display object is about to be removed from the display list.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将要从显示列表中删除显示对象时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.REMOVED = "removed";
        /**
         * @language en_US
         * [broadcast event] Dispatched when the playhead is entering a new frame.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [广播事件] 进入新的一帧,监听此事件将会在下一帧开始时触发一次回调。这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.ENTER_FRAME = "enterFrame";
        /**
         * @language en_US
         * Dispatched when the display list is about to be updated and rendered.
         * Note: Every time you want to receive a render event,you must call the stage.invalidate() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 渲染事件，监听此事件将会在本帧末即将开始渲染的前一刻触发回调，这是一个广播事件，可以在任何一个显示对象上监听，无论它是否在显示列表中。
         * 注意：每次您希望 Egret 发送 Event.RENDER 事件时，都必须调用 stage.invalidate() 方法，由于每帧只会触发一次屏幕刷新，
         * 若在 Event.RENDER 回调函数执行期间再次调用stage.invalidate()，将会被忽略。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.RENDER = "render";
        /**
         * @language en_US
         * Dispatched when the size of stage or UIComponent is changed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 舞台尺寸或UI组件尺寸发生改变
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.RESIZE = "resize";
        /**
         * @language en_US
         * Dispatched when the value or selection of a property is chaned.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 属性值或状态发生改变。通常是按钮的选中状态，或者列表的选中项索引改变。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.CHANGE = "change";
        /**
         * @language en_US
         * Dispatched when the value or selection of a property is going to change.you can cancel this by calling the
         * preventDefault() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 属性值或状态即将发生改变,通常是按钮的选中状态，或者列表的选中项索引改变。可以通过调用 preventDefault() 方法阻止索引发生更改。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.CHANGING = "changing";
        /**
         * @language en_US
         * Dispatched when the net request is complete.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 网络请求加载完成
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.COMPLETE = "complete";
        /**
         * @language en_US
         * Dispatched when loop completed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 循环完成
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.LOOP_COMPLETE = "loopComplete";
        /**
         * @language en_US
         * Dispatched when the TextInput instance gets focus.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * TextInput实例获得焦点
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.FOCUS_IN = "focusIn";
        /**
         * @language en_US
         * Dispatched when the TextInput instance loses focus.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * TextInput实例失去焦点
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.FOCUS_OUT = "focusOut";
        /**
         * @language en_US
         * Dispatched when the playback is ended.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 动画声音等播放完成
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.ENDED = "ended";
        /**
         * 游戏激活
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.ACTIVATE = "activate";
        /**
         * 取消激活
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.DEACTIVATE = "deactivate";
        /**
         * Event.CLOSE 常量定义 close 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.CLOSE = "close";
        /**
         * Event.CONNECT 常量定义 connect 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.CONNECT = "connect";
        /**
         * Event.LEAVE_STAGE 常量定义 leaveStage 事件对象的 type 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.LEAVE_STAGE = "leaveStage";
        /**
         * Event.SOUND_COMPLETE 常量定义 在声音完成播放后调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Event.SOUND_COMPLETE = "soundComplete";
        return Event;
    })(egret.HashObject);
    egret.Event = Event;
    egret.registerClass(Event,'egret.Event');
    if (DEBUG) {
        egret.$markReadOnly(Event, "type");
        egret.$markReadOnly(Event, "bubbles");
        egret.$markReadOnly(Event, "cancelable");
        egret.$markReadOnly(Event, "eventPhase");
        egret.$markReadOnly(Event, "currentTarget");
        egret.$markReadOnly(Event, "target");
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * When the user changes the focus from one object in the display list to another object, the object dispatches a FocusEvent object. Currently only supports input text.
     * Focus events: FocusEvent.FOCUS_IN FocusEvent.FOCUS_OUT
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 用户将焦点从显示列表中的一个对象更改到另一个对象时，对象将调度 FocusEvent 对象。目前只支持输入文本。
     * 焦点事件：FocusEvent.FOCUS_IN FocusEvent.FOCUS_OUT
     * @version Egret 2.4
     * @platform Web,Native
     */
    var FocusEvent = (function (_super) {
        __extends(FocusEvent, _super);
        /**
         * @language en_US
         * Create a egret.FocusEvent objects
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.FocusEvent 对象
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function FocusEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            _super.call(this, type, bubbles, cancelable);
        }
        var d = __define,c=FocusEvent,p=c.prototype;
        /**
         * @language en_US
         * Gets focus
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获得焦点
         * @version Egret 2.4
         * @platform Web,Native
         */
        FocusEvent.FOCUS_IN = "focusIn";
        /**
         * @language en_US
         * Loses focus
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 失去焦点
         * @version Egret 2.4
         * @platform Web,Native
         */
        FocusEvent.FOCUS_OUT = "focusOut";
        return FocusEvent;
    })(egret.Event);
    egret.FocusEvent = FocusEvent;
    egret.registerClass(FocusEvent,'egret.FocusEvent');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The GeolocationEvent represents the position and altitude of the device on Earth,
     * and show errors occurred while getting the location of the device.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Geolocation.ts
     */
    /**
     * @language zh_CN
     * GeolocationEvent 提供设备的地理位置信息和获取位置时发生的错误信息
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Geolocation.ts
     */
    var GeolocationEvent = (function (_super) {
        __extends(GeolocationEvent, _super);
        function GeolocationEvent() {
            _super.apply(this, arguments);
        }
        var d = __define,c=GeolocationEvent,p=c.prototype;
        /**
         * @language en_US
         * The acquisition of the location information failed because of app don't have permission.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由于用户拒绝访问位置信息，获取位置信息失败
         * @version Egret 2.4
         * @platform Web,Native
         */
        GeolocationEvent.PERMISSION_DENIED = "permissionDenied";
        /**
         * @language en_US
         * The acquisition of the location failed because at least one internal source of position returned an internal error.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设备位置服务不可用或者超时等原因没有得到位置信息
         * @version Egret 2.4
         * @platform Web,Native
         */
        GeolocationEvent.UNAVAILABLE = "unavailable";
        return GeolocationEvent;
    })(egret.Event);
    egret.GeolocationEvent = GeolocationEvent;
    egret.registerClass(GeolocationEvent,'egret.GeolocationEvent');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * When a network request returns an HTTP status code, the application dispatches HTTPStatusEvent objects.
     * Before error or completion events will always send HTTPStatusEvent object. HTTPStatusEvent object does not necessarily indicate an error condition; it simply reflects the HTTP status code provided by the network stack (if any).
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 在网络请求返回 HTTP 状态代码时，应用程序将调度 HTTPStatusEvent 对象。
     * 在错误或完成事件之前，将始终发送 HTTPStatusEvent 对象。HTTPStatusEvent 对象不一定表示错误条件；它仅反映网络堆栈提供的 HTTP 状态代码（如果有的话）。
     * @version Egret 2.4
     * @platform Web,Native
     */
    var HTTPStatusEvent = (function (_super) {
        __extends(HTTPStatusEvent, _super);
        /**
         * @language en_US
         * Create a egret.HTTPStatusEvent objects
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.HTTPStatusEvent 对象
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function HTTPStatusEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            _super.call(this, type, bubbles, cancelable);
            /**
             * @private
             */
            this._status = 0;
        }
        var d = __define,c=HTTPStatusEvent,p=c.prototype;
        d(p, "status"
            /**
             * @language en_US
             * he server returns the HTTP status code.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 由服务器返回的 HTTP 状态代码。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._status;
            }
        );
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown Event. The objects will be thrown in the object cache pool for the next round robin.
         * @param target {egret.IEventDispatcher} Distribute event target
         * @param status {number} The server returns the HTTP status code
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param status {number} 由服务器返回的 HTTP 状态代码
         * @version Egret 2.4
         * @platform Web,Native
         */
        HTTPStatusEvent.dispatchHTTPStatusEvent = function (target, status) {
            var event = egret.Event.create(HTTPStatusEvent, HTTPStatusEvent.HTTP_STATUS);
            event._status = status;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * @language en_US
         * HTTPStatusEvent.HTTP_STATUS constant defines the value of the type property httpStatus event object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * HTTPStatusEvent.HTTP_STATUS 常量定义 httpStatus 事件对象的 type 属性值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        HTTPStatusEvent.HTTP_STATUS = "httpStatus";
        return HTTPStatusEvent;
    })(egret.Event);
    egret.HTTPStatusEvent = HTTPStatusEvent;
    egret.registerClass(HTTPStatusEvent,'egret.HTTPStatusEvent');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * @classdesc IO流事件，当错误导致输入或输出操作失败时调度 IOErrorEvent 对象。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/IOErrorEvent.ts
     */
    /**
     * @language zh_CN
     * @classdesc IO流事件，当错误导致输入或输出操作失败时调度 IOErrorEvent 对象。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/IOErrorEvent.ts
     */
    var IOErrorEvent = (function (_super) {
        __extends(IOErrorEvent, _super);
        /**
         * @language en_US
         * Create a egret.IOErrorEvent objects
         * @param type {string} Type of event, accessible as Event.type.
         * @param bubbles {boolean} Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable {boolean} Determine whether the Event object can be canceled. The default value is false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.IOErrorEvent 对象
         * @param type {string} 事件的类型，可以作为 Event.type 访问。
         * @param bubbles {boolean} 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable {boolean} 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function IOErrorEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            _super.call(this, type, bubbles, cancelable);
        }
        var d = __define,c=IOErrorEvent,p=c.prototype;
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown Event. The objects will be thrown in the object cache pool for the next round robin.
         * @param target {egret.IEventDispatcher} Distribute event target
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @version Egret 2.4
         * @platform Web,Native
         */
        IOErrorEvent.dispatchIOErrorEvent = function (target) {
            var event = egret.Event.create(IOErrorEvent, IOErrorEvent.IO_ERROR);
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * @language en_US
         * io error
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * io发生错误
         * @version Egret 2.4
         * @platform Web,Native
         */
        IOErrorEvent.IO_ERROR = "ioError";
        return IOErrorEvent;
    })(egret.Event);
    egret.IOErrorEvent = IOErrorEvent;
    egret.registerClass(IOErrorEvent,'egret.IOErrorEvent');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * MotionEvent represents the device's movement
     * Acceleration and accelerationIncludingGravity to represents the device's acceleration
     * RotationRate to represents the device's rotation
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Motion.ts
     */
    /**
     * @language zh_CN
     * MotionEvent 类呈现设备运动的具体信息
     * Acceleration 和 accelerationIncludingGravity 呈现设备三个维度的加速度信息
     * RotationRate 呈现设备的旋转状态信息
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Motion.ts
     */
    var MotionEvent = (function (_super) {
        __extends(MotionEvent, _super);
        function MotionEvent() {
            _super.apply(this, arguments);
        }
        var d = __define,c=MotionEvent,p=c.prototype;
        return MotionEvent;
    })(egret.Event);
    egret.MotionEvent = MotionEvent;
    egret.registerClass(MotionEvent,'egret.MotionEvent');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The OrientationEvent provides information from the physical orientation of the device.
     * Note: Currently, Browsers on the iOS and Android does not handle the coordinates the same way.
     * Take care about this while using them.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/DeviceOrientation.ts
     */
    /**
     * @language zh_CN
     * OrientationEvent 提供设备的方向信息
     * 注意: 目前各个浏览器和操作系统处理方向的方式不完全相同，请根据使用场景做相应的校正，
     * 比如使用两次方向数据的变化而不是直接使用方向的值
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/DeviceOrientation.ts
     */
    var OrientationEvent = (function (_super) {
        __extends(OrientationEvent, _super);
        function OrientationEvent() {
            _super.apply(this, arguments);
        }
        var d = __define,c=OrientationEvent,p=c.prototype;
        return OrientationEvent;
    })(egret.Event);
    egret.OrientationEvent = OrientationEvent;
    egret.registerClass(OrientationEvent,'egret.OrientationEvent');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * When a load operation has begun or a socket has received data, ProgressEvent object is dispatched.
     * There are two types of progress events: ProgressEvent.PROGRESS and ProgressEvent.SOCKET_DATA.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 当加载操作已开始或套接字已接收到数据时，将调度 ProgressEvent 对象。
     * 有两种类型的进程事件：ProgressEvent.PROGRESS 和 ProgressEvent.SOCKET_DATA。
     * @version Egret 2.4
     * @platform Web,Native
     */
    var ProgressEvent = (function (_super) {
        __extends(ProgressEvent, _super);
        /**
         * @language en_US
         * 创建一个 egret.ProgressEvent 对象
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param bytesLoaded {number} Number of items or bytes loaded
         * @param bytesTotal {number} The total number of items or bytes loaded
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.ProgressEvent 对象
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param bytesLoaded {number} 加载的项数或字节数
         * @param bytesTotal {number} 加载的总项数或总字节数
         * @version Egret 2.4
         * @platform Web,Native
         */
        function ProgressEvent(type, bubbles, cancelable, bytesLoaded, bytesTotal) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            if (bytesLoaded === void 0) { bytesLoaded = 0; }
            if (bytesTotal === void 0) { bytesTotal = 0; }
            _super.call(this, type, bubbles, cancelable);
            /**
             * @language en_US
             * Number of items or bytes when the listener processes the event。
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 在侦听器处理事件时加载的项数或字节数。
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.bytesLoaded = 0;
            /**
             * @language en_US
             * If the loading process succeeds, the total number or the total number of bytes that will be loaded term.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 如果加载过程成功，将加载的总项数或总字节数。
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.bytesTotal = 0;
            this.bytesLoaded = bytesLoaded;
            this.bytesTotal = bytesTotal;
        }
        var d = __define,c=ProgressEvent,p=c.prototype;
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown Event. The objects will be thrown in the object cache pool for the next round robin.
         * @param target {egret.IEventDispatcher} Distribute event target
         * @param type  The type of the event, accessible as Event.type.
         * @param bytesLoaded {number} Number of items or bytes loaded
         * @param bytesTotal {number} The total number of items or bytes loaded
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {string} 事件类型
         * @param bytesLoaded {number} 加载的项数或字节数
         * @param bytesTotal {number} 加载的总项数或总字节数
         * @version Egret 2.4
         * @platform Web,Native
         */
        ProgressEvent.dispatchProgressEvent = function (target, type, bytesLoaded, bytesTotal) {
            if (bytesLoaded === void 0) { bytesLoaded = 0; }
            if (bytesTotal === void 0) { bytesTotal = 0; }
            var event = egret.Event.create(ProgressEvent, type);
            event.bytesLoaded = bytesLoaded;
            event.bytesTotal = bytesTotal;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * @language en_US
         * Changes in the loading progress
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 加载进度发生变化
         * @version Egret 2.4
         * @platform Web,Native
         */
        ProgressEvent.PROGRESS = "progress";
        /**
         * @language en_US
         * Get the data
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取到数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        ProgressEvent.SOCKET_DATA = "socketData";
        return ProgressEvent;
    })(egret.Event);
    egret.ProgressEvent = ProgressEvent;
    egret.registerClass(ProgressEvent,'egret.ProgressEvent');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * When the direction of the stage of change, Stage object dispatches StageOrientationEvent object.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/StageOrientationEvent.ts
     */
    /**
     * @language zh_CN
     * 当舞台的方向更改时，Stage 对象将调度 StageOrientationEvent 对象。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/StageOrientationEvent.ts
     */
    var StageOrientationEvent = (function (_super) {
        __extends(StageOrientationEvent, _super);
        /**
         * @language en_US
         * Creating contains specific information related to the event and the stage direction of StageOrientationEvent object.
         * @param type Event types:StageOrientationEvent.ORIENTATION_CHANGE
         * @param bubbles It indicates whether the Event object participates in the bubbling stage of the event flow.
         * @param cancelable It indicates whether the Event object can be canceled.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建包含与舞台方向事件相关的特定信息的 StageOrientationEvent 对象。
         * @param type 事件的类型：StageOrientationEvent.ORIENTATION_CHANGE
         * @param bubbles 表示 Event 对象是否参与事件流的冒泡阶段。
         * @param cancelable 表示是否可以取消 Event 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function StageOrientationEvent(type, bubbles, cancelable) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            _super.call(this, type, bubbles, cancelable);
        }
        var d = __define,c=StageOrientationEvent,p=c.prototype;
        /**
         * @language en_US
         * 派发一个屏幕旋转的事件。
         * @param target {egret.IEventDispatcher} 派发事件目标
         * @param type {egret.IEventDispatcher} 派发事件类型
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 派发一个屏幕旋转的事件。
         * @param target {egret.IEventDispatcher} Distribute event target
         * @param type {egret.IEventDispatcher} Distribute event type
         * @version Egret 2.4
         * @platform Web,Native
         */
        StageOrientationEvent.dispatchStageOrientationEvent = function (target, type) {
            var event = egret.Event.create(StageOrientationEvent, type);
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * @language en_US
         * After screen rotation distribute events.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 屏幕旋转后派发的事件。
         * @version Egret 2.4
         * @platform Web,Native
         */
        StageOrientationEvent.ORIENTATION_CHANGE = "orientationChange";
        return StageOrientationEvent;
    })(egret.Event);
    egret.StageOrientationEvent = StageOrientationEvent;
    egret.registerClass(StageOrientationEvent,'egret.StageOrientationEvent');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * When a user clicks a hyperlink rich text object dispatches TextEvent object. Text Event Type: TextEvent.LINK.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TextEvent.ts
     */
    /**
     * @language zh_CN
     * 用户在富文本中单击超链接时，对象将调度 TextEvent 对象。文本事件类型：TextEvent.LINK。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TextEvent.ts
     */
    var TextEvent = (function (_super) {
        __extends(TextEvent, _super);
        /**
         * @language en_US
         * TextEvent create an object that contains information about text events.
         * @param type Type of event, you can access the TextEvent.type.
         * @param bubbles Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determine whether the Event object can be canceled. The default value is false.
         * @param text One or more characters of text entered by the user. Event listeners can access this information through the text property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 TextEvent 对象，其中包含有关文本事件的信息。
         * @param type 事件的类型，可以作为 TextEvent.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param text 用户输入的一个或多个文本字符。事件侦听器可以通过 text 属性访问此信息。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function TextEvent(type, bubbles, cancelable, text) {
            if (bubbles === void 0) { bubbles = false; }
            if (cancelable === void 0) { cancelable = false; }
            if (text === void 0) { text = ""; }
            _super.call(this, type, bubbles, cancelable);
            this.text = text;
        }
        var d = __define,c=TextEvent,p=c.prototype;
        /**
         * @language en_US
         * EventDispatcher object using the specified event object thrown TextEvent. The objects will be thrown in the object cache pool for the next round robin.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param text  Text TextEvent object assignment
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出TextEvent事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type  事件类型
         * @param text  TextEvent对象的text赋值
         * @version Egret 2.4
         * @platform Web,Native
         */
        TextEvent.dispatchTextEvent = function (target, type, text) {
            var event = egret.Event.create(TextEvent, type);
            event.text = text;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * @language en_US
         * It defines the value of the type property of a link event object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 定义 link 事件对象的 type 属性值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        TextEvent.LINK = "link";
        return TextEvent;
    })(egret.Event);
    egret.TextEvent = TextEvent;
    egret.registerClass(TextEvent,'egret.TextEvent');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * A Timer object dispatches a TimerEvent objects whenever the Timer object reaches the interval specified by the Timer.delay property.
     * @see egret.Timer
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TimerEvent.ts
     */
    /**
     * @language zh_CN
     * 每当 Timer 对象达到由 Timer.delay 属性指定的间隔时，Timer 对象即会调度 TimerEvent 对象。
     * @see egret.Timer
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TimerEvent.ts
     */
    var TimerEvent = (function (_super) {
        __extends(TimerEvent, _super);
        /**
         * @language en_US
         * Creates an Event object with specific information relevant to timer events.
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param cancelable Determines whether the Event object can be canceled. Event listeners can access this information
         * through the inherited cancelable property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 Event 对象，其中包含有关 timer 事件的特定信息。
         * @param type 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
         * @param bubbles 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
         * @param cancelable 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function TimerEvent(type, bubbles, cancelable) {
            _super.call(this, type, bubbles, cancelable);
        }
        var d = __define,c=TimerEvent,p=c.prototype;
        /**
         * @language en_US
         * Instructs Egret runtime to render after processing of this event completes, if the display list has been modified.
         * @example
         * <pre>
         *    function onTimer(event:TimerEvent):void {
         *        if (40 < mySp.x && mySp.x < 375) {
         *            mySp.x-= 50;
         *        } else {
         *            mySp.x=374;
         *        }
         *        event.updateAfterEvent();
         *    }
         *
         *    var moveTimer:Timer=new Timer(50,250);
         *    moveTimer.addEventListener(TimerEvent.TIMER,onTimer);
         *    moveTimer.start();
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果已修改显示列表，调用此方法将会忽略帧频限制，在此事件处理完成后立即重绘屏幕。
         * @example
         * <pre>
         *    function onTimer(event:TimerEvent):void {
         *        if (40 < mySp.x && mySp.x < 375) {
         *            mySp.x-= 50;
         *        } else {
         *            mySp.x=374;
         *        }
         *        event.updateAfterEvent();
         *    }
         *
         *    var moveTimer:Timer=new Timer(50,250);
         *    moveTimer.addEventListener(TimerEvent.TIMER,onTimer);
         *    moveTimer.start();
         * </pre>
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.updateAfterEvent = function () {
            egret.sys.$requestRenderingFlag = true;
        };
        /**
         * @language en_US
         * uses a specified target to dispatchEvent an event. Using this method can reduce the number of
         * reallocate event objects, which allows you to get better code execution performance.
         * @param target the event target
         * @param type The type of the event. Event listeners can access this information through the inherited type property.
         * @param bubbles Determines whether the Event object bubbles. Event listeners can access this information through
         * the inherited bubbles property.
         * @param cancelable Determines whether the Event object can be canceled. Event listeners can access this information
         * through the inherited cancelable property.
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 事件派发目标
         * @param type 事件的类型。事件侦听器可以通过继承的 type 属性访问此信息。
         * @param bubbles 确定 Event 对象是否冒泡。事件侦听器可以通过继承的 bubbles 属性访问此信息。
         * @param cancelable 确定是否可以取消 Event 对象。事件侦听器可以通过继承的 cancelable 属性访问此信息。
         * @see egret.Event.create()
         * @see egret.Event.release()
         * @version Egret 2.4
         * @platform Web,Native
         */
        TimerEvent.dispatchTimerEvent = function (target, type, bubbles, cancelable) {
            var event = egret.Event.create(TimerEvent, type, bubbles, cancelable);
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * @language en_US
         * Dispatched whenever a Timer object reaches an interval specified according to the Timer.delay property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 每当 Timer 对象达到根据 Timer.delay 属性指定的间隔时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        TimerEvent.TIMER = "timer";
        /**
         * @language en_US
         * Dispatched whenever it has completed the number of requests set by Timer.repeatCount.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 每当它完成 Timer.repeatCount 设置的请求数后调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        TimerEvent.TIMER_COMPLETE = "timerComplete";
        return TimerEvent;
    })(egret.Event);
    egret.TimerEvent = TimerEvent;
    egret.registerClass(TimerEvent,'egret.TimerEvent');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var pointPool = [];
    var DEG_TO_RAD = Math.PI / 180;
    /**
     * @language en_US
     * The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal
     * axis and y represents the vertical axis.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Point.ts
     */
    /**
     * @language zh_CN
     * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Point.ts
     */
    var Point = (function (_super) {
        __extends(Point, _super);
        /**
         * @language en_US
         * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.Point 对象.若不传入任何参数，将会创建一个位于（0，0）位置的点。
         * @param x 该对象的x属性值，默认为0
         * @param y 该对象的y属性值，默认为0
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Point(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            _super.call(this);
            this.x = x;
            this.y = y;
        }
        var d = __define,c=Point,p=c.prototype;
        /**
         * @language en_US
         * Releases a point instance to the object pool
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个Point实例到对象池
         * @version Egret 2.4
         * @platform Web,Native
         */
        Point.release = function (point) {
            if (!point) {
                return;
            }
            pointPool.push(point);
        };
        /**
         * @language en_US
         * get a point instance from the object pool or create a new one.
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的Point对象。
         * @param x 该对象的x属性值，默认为0
         * @param y 该对象的y属性值，默认为0
         * @version Egret 2.4
         * @platform Web,Native
         */
        Point.create = function (x, y) {
            var point = pointPool.pop();
            if (!point) {
                point = new Point();
            }
            return point.setTo(x, y);
        };
        d(p, "length"
            /**
             * @language en_US
             * The length of the line segment from (0,0) to this point.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 从 (0,0) 到此点的线段长度。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }
        );
        /**
         * @language en_US
         * Sets the members of Point to the specified values
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Point 的成员设置为指定值
         * @param x 该对象的x属性值
         * @param y 该对象的y属性值
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setTo = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        /**
         * @language en_US
         * Creates a copy of this Point object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 克隆点对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clone = function () {
            return new Point(this.x, this.y);
        };
        /**
         * @language en_US
         * Determines whether two points are equal. Two points are equal if they have the same x and y values.
         * @param toCompare The point to be compared.
         * @returns A value of true if the object is equal to this Point object; false if it is not equal.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定两个点是否相同。如果两个点具有相同的 x 和 y 值，则它们是相同的点。
         * @param toCompare 要比较的点。
         * @returns 如果该对象与此 Point 对象相同，则为 true 值，如果不相同，则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.equals = function (toCompare) {
            return this.x == toCompare.x && this.y == toCompare.y;
        };
        /**
         * @language en_US
         * Returns the distance between pt1 and pt2.
         * @param p1 The first point.
         * @param p2 The second point.
         * @returns The distance between the first and second points.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回 pt1 和 pt2 之间的距离。
         * @param p1 第一个点
         * @param p2 第二个点
         * @returns 第一个点和第二个点之间的距离。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Point.distance = function (p1, p2) {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        };
        /**
         * @language en_US
         * Copies all of the point data from the source Point object into the calling Point object.
         * @param sourcePoint The Point object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将源 Point 对象中的所有点数据复制到调用方 Point 对象中。
         * @param sourcePoint 要从中复制数据的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.copyFrom = function (sourcePoint) {
            this.x = sourcePoint.x;
            this.y = sourcePoint.y;
        };
        /**
         * @language en_US
         * Adds the coordinates of another point to the coordinates of this point to create a new point.
         * @param v The point to be added.
         * @returns The new point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将另一个点的坐标添加到此点的坐标以创建一个新点。
         * @param v 要添加的点。
         * @returns 新点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.add = function (v) {
            return new Point(this.x + v.x, this.y + v.y);
        };
        /**
         * @language en_US
         * Determines a point between two specified points.
         * The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2. The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1). The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
         * @param pt1 The first point.
         * @param pt2 The second point.
         * @param f The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
         * @returns The new interpolated point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定两个指定点之间的点。
         * 参数 f 确定新的内插点相对于参数 pt1 和 pt2 指定的两个端点所处的位置。参数 f 的值越接近 1.0，则内插点就越接近第一个点（参数 pt1）。参数 f 的值越接近 0，则内插点就越接近第二个点（参数 pt2）。
         * @param pt1 第一个点。
         * @param pt2 第二个点。
         * @param f 两个点之间的内插级别。表示新点将位于 pt1 和 pt2 连成的直线上的什么位置。如果 f=1，则返回 pt1；如果 f=0，则返回 pt2。
         * @returns 新的内插点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Point.interpolate = function (pt1, pt2, f) {
            var f1 = 1 - f;
            return new Point(pt1.x * f + pt2.x * f1, pt1.y * f + pt2.y * f1);
        };
        /**
         * @language en_US
         * Scales the line segment between (0,0) and the current point to a set length.
         * @param thickness The scaling value. For example, if the current point is (0,5), and you normalize it to 1, the point returned is at (0,1).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 (0,0) 和当前点之间的线段缩放为设定的长度。
         * @param thickness 缩放值。例如，如果当前点为 (0,5) 并且您将它规范化为 1，则返回的点位于 (0,1) 处。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.normalize = function (thickness) {
            if (this.x != 0 || this.y != 0) {
                var relativeThickness = thickness / this.length;
                this.x *= relativeThickness;
                this.y *= relativeThickness;
            }
        };
        /**
         * @language en_US
         * Offsets the Point object by the specified amount. The value of dx is added to the original value of x to create the new x value. The value of dy is added to the original value of y to create the new y value.
         * @param dx The amount by which to offset the horizontal coordinate, x.
         * @param dy The amount by which to offset the vertical coordinate, y.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 按指定量偏移 Point 对象。dx 的值将添加到 x 的原始值中以创建新的 x 值。dy 的值将添加到 y 的原始值中以创建新的 y 值。
         * @param dx 水平坐标 x 的偏移量。
         * @param dy 水平坐标 y 的偏移量。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        /**
         * @language en_US
         * Converts a pair of polar coordinates to a Cartesian point coordinate.
         * @param len The length coordinate of the polar pair.
         * @param angle The angle, in radians, of the polar pair.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将一对极坐标转换为笛卡尔点坐标。
         * @param len 极坐标对的长度。
         * @param angle 极坐标对的角度（以弧度表示）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Point.polar = function (len, angle) {
            return new Point(len * egret.NumberUtils.cos(angle / DEG_TO_RAD), len * egret.NumberUtils.sin(angle / DEG_TO_RAD));
        };
        /**
         * @language en_US
         * Subtracts the coordinates of another point from the coordinates of this point to create a new point.
         * @param v The point to be subtracted.
         * @returns The new point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从此点的坐标中减去另一个点的坐标以创建一个新点。
         * @param v 要减去的点。
         * @returns 新点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.subtract = function (v) {
            return new Point(this.x - v.x, this.y - v.y);
        };
        /**
         * @language en_US
         * Returns a string that contains the values of the x and y coordinates. The string has the form "(x=x, y=y)", so calling the toString() method for a point at 23,17 would return "(x=23, y=17)".
         * @returns The string representation of the coordinates.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回包含 x 和 y 坐标的值的字符串。该字符串的格式为 "(x=x, y=y)"，因此为点 23,17 调用 toString() 方法将返回 "(x=23, y=17)"。
         * @returns 坐标的字符串表示形式。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.toString = function () {
            return "(x=" + this.x + ", y=" + this.y + ")";
        };
        return Point;
    })(egret.HashObject);
    egret.Point = Point;
    egret.registerClass(Point,'egret.Point');
    if (DEBUG) {
        egret.$markReadOnly(Point, "length");
    }
    /**
     * @private
     * 仅供框架内复用，要防止暴露引用到外部。
     */
    egret.$TempPoint = new Point();
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
/// <reference path="../geom/point.ts" />
var egret;
(function (egret) {
    var localPoint = new egret.Point();
    /**
     * @language en_US
     * The TouchEvent class lets you handle events on devices that detect user contact with the device (such as a finger
     * on a touch screen).When a user interacts with a device such as a mobile phone or tablet with a touch screen, the
     * user typically touches the screen with his or her fingers or a pointing device. You can develop applications that
     * respond to basic touch events (such as a single finger tap) with the TouchEvent class. Create event listeners using
     * the event types defined in this class.
     * Note: When objects are nested on the display list, touch events target the deepest possible nested object that is
     * visible in the display list. This object is called the target node. To have a target node's ancestor (an object
     * containing the target node in the display list) receive notification of a touch event, use EventDispatcher.addEventListener()
     * on the ancestor node with the type parameter set to the specific touch event you want to detect.
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TouchEvent.ts
     */
    /**
     * @language zh_CN
     * 使用 TouchEvent 类，您可以处理设备上那些检测用户与设备之间的接触的事件。
     * 当用户与带有触摸屏的移动电话或平板电脑等设备交互时，用户通常使用手指或指针设备接触屏幕。可使用 TouchEvent
     * 类开发响应基本触摸事件（如单个手指点击）的应用程序。使用此类中定义的事件类型创建事件侦听器。
     * 注意：当对象嵌套在显示列表中时，触摸事件的目标将是显示列表中可见的最深的可能嵌套对象。
     * 此对象称为目标节点。要使目标节点的祖代（祖代是一个包含显示列表中所有目标节点的对象，从舞台到目标节点的父节点均包括在内）
     * 接收触摸事件的通知，请对祖代节点使用 EventDispatcher.on() 并将 type 参数设置为要检测的特定触摸事件。
     *
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/events/TouchEvent.ts
     */
    var TouchEvent = (function (_super) {
        __extends(TouchEvent, _super);
        /**
         * @language en_US
         * Creates an Event object that contains information about touch events.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param stageX The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @param stageY The vertical coordinate at which the event occurred in global Stage coordinates.
         * @param touchPointID A unique identification number assigned to the touch point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 TouchEvent 对象，其中包含有关Touch事件的信息
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param stageX 事件发生点在全局舞台坐标系中的水平坐标
         * @param stageY 事件发生点在全局舞台坐标系中的垂直坐标
         * @param touchPointID 分配给触摸点的唯一标识号
         * @version Egret 2.4
         * @platform Web,Native
         */
        function TouchEvent(type, bubbles, cancelable, stageX, stageY, touchPointID) {
            _super.call(this, type, bubbles, cancelable);
            this.targetChanged = true;
            /**
             * @language en_US
             * Whether the touch is pressed (true) or not pressed (false).
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示触摸已按下 (true) 还是未按下 (false)。
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.touchDown = false;
            this.$initTo(stageX, stageY, touchPointID);
        }
        var d = __define,c=TouchEvent,p=c.prototype;
        /**
         * @private
         */
        p.$initTo = function (stageX, stageY, touchPointID) {
            this.touchPointID = +touchPointID || 0;
            this.$stageX = +stageX || 0;
            this.$stageY = +stageY || 0;
        };
        d(p, "stageX"
            /**
             * @language en_US
             * The horizontal coordinate at which the event occurred in global Stage coordinates.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 事件发生点在全局舞台坐标中的水平坐标。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$stageX;
            }
        );
        d(p, "stageY"
            /**
             * @language en_US
             * The vertical coordinate at which the event occurred in global Stage coordinates.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 事件发生点在全局舞台坐标中的垂直坐标。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$stageY;
            }
        );
        d(p, "localX"
            /**
             * @language en_US
             * The horizontal coordinate at which the event occurred relative to the display object.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 事件发生点相对于所属显示对象的水平坐标。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                if (this.targetChanged) {
                    this.getLocalXY();
                }
                return this._localX;
            }
        );
        d(p, "localY"
            /**
             * @language en_US
             * The vertical coordinate at which the event occurred relative to the display object.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 事件发生点相对于所属显示对象的垂直坐标。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                if (this.targetChanged) {
                    this.getLocalXY();
                }
                return this._localY;
            }
        );
        /**
         * @private
         */
        p.getLocalXY = function () {
            this.targetChanged = false;
            var m = this.$target.$getInvertedConcatenatedMatrix();
            m.transformPoint(this.$stageX, this.$stageY, localPoint);
            this._localX = localPoint.x;
            this._localY = localPoint.y;
        };
        p.$setTarget = function (target) {
            this.$target = target;
            this.targetChanged = !!target;
            return true;
        };
        /**
         * @language en_US
         * Instructs Egret runtime to render after processing of this event completes, if the display list has been modified.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果已修改显示列表，调用此方法将会忽略帧频限制，在此事件处理完成后立即重绘屏幕。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.updateAfterEvent = function () {
            egret.sys.$requestRenderingFlag = true;
        };
        /**
         * @language en_US
         * uses a specified target to dispatchEvent an event. Using this method can reduce the number of
         * reallocate event objects, which allows you to get better code execution performance.
         * @param target the event target
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @param stageX The horizontal coordinate at which the event occurred in global Stage coordinates.
         * @param stageY The vertical coordinate at which the event occurred in global Stage coordinates.
         * @param touchPointID A unique identification number (as an int) assigned to the touch point.
         *
         * @see egret.Event.create()
         * @see egret.Event.release()
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的EventDispatcher对象来抛出Event事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @param target 派发事件目标
         * @param type 事件的类型，可以作为 Event.type 访问。
         * @param bubbles 确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @param stageX 事件发生点在全局舞台坐标系中的水平坐标
         * @param stageY 事件发生点在全局舞台坐标系中的垂直坐标
         * @param touchPointID 分配给触摸点的唯一标识号
         *
         * @see egret.Event.create()
         * @see egret.Event.release()
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        TouchEvent.dispatchTouchEvent = function (target, type, bubbles, cancelable, stageX, stageY, touchPointID, touchDown) {
            if (touchDown === void 0) { touchDown = false; }
            if (!bubbles && !target.hasEventListener(type)) {
                return true;
            }
            var event = egret.Event.create(TouchEvent, type, bubbles, cancelable);
            event.$initTo(stageX, stageY, touchPointID);
            event.touchDown = touchDown;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * @language en_US
         * Dispatched when the user touches the device, and is continuously dispatched until the point of contact is removed.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当用户触碰设备时进行调度，而且会连续调度，直到接触点被删除。
         * @version Egret 2.4
         * @platform Web,Native
         */
        TouchEvent.TOUCH_MOVE = "touchMove";
        /**
         * @language en_US
         * Dispatched when the user first contacts a touch-enabled device (such as touches a finger to a mobile phone or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当用户第一次触摸启用触摸的设备时（例如，用手指触摸配有触摸屏的移动电话或平板电脑）调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        TouchEvent.TOUCH_BEGIN = "touchBegin";
        /**
         * @language en_US
         * Dispatched when the user removes contact with a touch-enabled device (such as lifts a finger off a mobile phone
         * or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当用户移除与启用触摸的设备的接触时（例如，将手指从配有触摸屏的移动电话或平板电脑上抬起）调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        TouchEvent.TOUCH_END = "touchEnd";
        /**
         * @language en_US
         * Dispatched when the user lifts the point of contact over the same DisplayObject instance on which the contact
         * was initiated on a touch-enabled device.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当用户在触摸设备上与开始触摸的同一 DisplayObject 实例上抬起接触点时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        TouchEvent.TOUCH_TAP = "touchTap";
        /**
         * @language en_US
         * Dispatched when the user lifts the point of contact over the different DisplayObject instance on which the contact
         * was initiated on a touch-enabled device (such as presses and releases a finger from a single point over a display
         * object on a mobile phone or tablet with a touch screen).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当用户在触摸设备上与开始触摸的不同 DisplayObject 实例上抬起接触点时调度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        TouchEvent.TOUCH_RELEASE_OUTSIDE = "touchReleaseOutside";
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        TouchEvent.TOUCH_ROLL_OUT = "touchRollOut";
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        TouchEvent.TOUCH_ROLL_OVER = "touchRollOver";
        return TouchEvent;
    })(egret.Event);
    egret.TouchEvent = TouchEvent;
    egret.registerClass(TouchEvent,'egret.TouchEvent');
    if (DEBUG) {
        egret.$markReadOnly(TouchEvent, "stageX");
        egret.$markReadOnly(TouchEvent, "stageY");
        egret.$markReadOnly(TouchEvent, "localX");
        egret.$markReadOnly(TouchEvent, "localY");
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var Filter = (function (_super) {
        __extends(Filter, _super);
        function Filter() {
            _super.apply(this, arguments);
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.type = null;
        }
        var d = __define,c=Filter,p=c.prototype;
        return Filter;
    })(egret.HashObject);
    egret.Filter = Filter;
    egret.registerClass(Filter,'egret.Filter');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var BlurFilter = (function (_super) {
        __extends(BlurFilter, _super);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function BlurFilter(blurX, blurY) {
            _super.call(this);
            this.blurX = blurX;
            this.blurY = blurY;
            this.type = "blur";
        }
        var d = __define,c=BlurFilter,p=c.prototype;
        return BlurFilter;
    })(egret.Filter);
    egret.BlurFilter = BlurFilter;
    egret.registerClass(BlurFilter,'egret.BlurFilter');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var ColorMatrixFilter = (function (_super) {
        __extends(ColorMatrixFilter, _super);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function ColorMatrixFilter(matrix) {
            if (matrix === void 0) { matrix = null; }
            _super.call(this);
            /**
             * @private
             */
            this.$matrix = [];
            /**
             * @private
             */
            this.matrix2 = [];
            this.type = "colorTransform";
            this.setMatrix(matrix);
        }
        var d = __define,c=ColorMatrixFilter,p=c.prototype;
        d(p, "matrix"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                for (var i = 0; i < 20; i++) {
                    this.matrix2[i] = this.$matrix[i];
                }
                return this.matrix2;
            }
            ,function (value) {
                this.setMatrix(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.setMatrix = function (value) {
            for (var i = 0; i < 20; i++) {
                this.$matrix[i] = (value && value[i]) || 0;
            }
        };
        return ColorMatrixFilter;
    })(egret.Filter);
    egret.ColorMatrixFilter = ColorMatrixFilter;
    egret.registerClass(ColorMatrixFilter,'egret.ColorMatrixFilter');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @class egret.GlowFilter
     * @classdesc
     * 使用 GlowFilter 类可以对显示对象应用发光效果。在投影滤镜的 distance 和 angle 属性设置为 0 时，发光滤镜与投影滤镜极为相似。
     * @extends egret.Filter
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var GlowFilter = (function (_super) {
        __extends(GlowFilter, _super);
        /**
         * 初始化 GlowFilter 对象
         * @method egret.GlowFilter#constructor
         * @param color {number} 光晕颜色，采用十六进制格式 0xRRGGBB。默认值为 0xFF0000。
         * @param alpha {number} 颜色的 Alpha 透明度值。有效值为 0 到 1。例如，0.25 设置透明度值为 25%。
         * @param blurX {number} 水平模糊量。有效值为 0 到 255（浮点）。
         * @param blurY {number} 垂直模糊量。有效值为 0 到 255（浮点）。
         * @param strength {number} 印记或跨页的强度。该值越高，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。
         * @param quality {number} 应用滤镜的次数。
         * @param inner {boolean} 指定发光是否为内侧发光。值 true 指定发光是内侧发光。值 false 指定发光是外侧发光（对象外缘周围的发光）。暂未实现。
         * @param knockout {number} 指定对象是否具有挖空效果。值为 true 将使对象的填充变为透明，并显示文档的背景颜色。暂未实现。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout) {
            if (color === void 0) { color = 0xFF0000; }
            if (alpha === void 0) { alpha = 1.0; }
            if (blurX === void 0) { blurX = 6.0; }
            if (blurY === void 0) { blurY = 6.0; }
            if (strength === void 0) { strength = 2; }
            if (quality === void 0) { quality = 1; }
            if (inner === void 0) { inner = false; }
            if (knockout === void 0) { knockout = false; }
            _super.call(this);
            this.color = color;
            this.alpha = alpha;
            this.blurX = blurX;
            this.blurY = blurY;
            this.strength = strength;
            this.quality = quality;
            this.inner = inner;
            this.knockout = knockout;
            this.type = "glow";
            this.$blue = color & 0x0000FF;
            this.$green = (color & 0x00ff00) >> 8;
            this.$red = color >> 16;
        }
        var d = __define,c=GlowFilter,p=c.prototype;
        return GlowFilter;
    })(egret.Filter);
    egret.GlowFilter = GlowFilter;
    egret.registerClass(GlowFilter,'egret.GlowFilter');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @class egret.DropShadowFilter
     * @classdesc
     * 可使用 DropShadowFilter 类向显示对象添加投影。
     * @extends egret.GlowFilter
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var DropShadowFilter = (function (_super) {
        __extends(DropShadowFilter, _super);
        /**
         * 初始化 DropShadowFilter 对象
         * @method egret.GlowFilter#constructor
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
         * @version Egret 2.4
         * @platform Web,Native
         */
        function DropShadowFilter(distance, angle, color, alpha, blurX, blurY, strength, quality, inner, knockout, hideObject) {
            if (distance === void 0) { distance = 4.0; }
            if (angle === void 0) { angle = 45; }
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1.0; }
            if (blurX === void 0) { blurX = 4.0; }
            if (blurY === void 0) { blurY = 4.0; }
            if (strength === void 0) { strength = 1.0; }
            if (quality === void 0) { quality = 1; }
            if (inner === void 0) { inner = false; }
            if (knockout === void 0) { knockout = false; }
            if (hideObject === void 0) { hideObject = false; }
            _super.call(this, color, alpha, blurX, blurY, strength, quality, inner, knockout);
            this.distance = distance;
            this.angle = angle;
        }
        var d = __define,c=DropShadowFilter,p=c.prototype;
        return DropShadowFilter;
    })(egret.GlowFilter);
    egret.DropShadowFilter = DropShadowFilter;
    egret.registerClass(DropShadowFilter,'egret.DropShadowFilter');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var DEG_TO_RAD = Math.PI / 180;
    /**
     * @private
     */
    function cos(angle) {
        switch (angle) {
            case HalfPI:
            case -PacPI:
                return 0;
            case PI:
            case -PI:
                return -1;
            case PacPI:
            case -HalfPI:
                return 0;
            default:
                return Math.cos(angle);
        }
    }
    /**
     * @private
     */
    function sin(angle) {
        switch (angle) {
            case HalfPI:
            case -PacPI:
                return 1;
            case PI:
            case -PI:
                return 0;
            case PacPI:
            case -HalfPI:
                return -1;
            default:
                return Math.sin(angle);
        }
    }
    var matrixPool = [];
    /**
     * @language en_US
     * The Matrix class represents a transformation matrix that determines how to map points from one coordinate space to
     * another. You can perform various graphical transformations on a display object by setting the properties of a Matrix
     * object, applying that Matrix object to the matrix property of a display object, These transformation functions include
     * translation (x and y repositioning), rotation, scaling, and skewing.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Matrix.ts
     */
    /**
     * @language zh_CN
     * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
     * 您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix
     * 对象应用于显示对象的 matrix 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Matrix.ts
     */
    var Matrix = (function (_super) {
        __extends(Matrix, _super);
        /**
         * @language en_US
         * Creates a new Matrix object with the specified parameters.
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定参数创建一个 Matrix 对象
         * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @param tx 沿 x 轴平移每个点的距离。
         * @param ty 沿 y 轴平移每个点的距离。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Matrix(a, b, c, d, tx, ty) {
            if (a === void 0) { a = 1; }
            if (b === void 0) { b = 0; }
            if (c === void 0) { c = 0; }
            if (d === void 0) { d = 1; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            _super.call(this);
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }
        var d = __define,c=Matrix,p=c.prototype;
        /**
         * @language en_US
         * Releases a matrix instance to the object pool
         * @param matrix matrix that Needs to be recycled
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个Matrix实例到对象池
         * @param matrix 需要回收的 matrix
         * @version Egret 2.4
         * @platform Web,Native
         */
        Matrix.release = function (matrix) {
            if (!matrix) {
                return;
            }
            matrixPool.push(matrix);
        };
        /**
         * @language en_US
         * get a matrix instance from the object pool or create a new one.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的Matrix对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Matrix.create = function () {
            var matrix = matrixPool.pop();
            if (!matrix) {
                matrix = new Matrix();
            }
            return matrix;
        };
        /**
         * @language en_US
         * Returns a new Matrix object that is a clone of this matrix, with an exact copy of the contained object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回一个新的 Matrix 对象，它是此矩阵的克隆，带有与所含对象完全相同的副本。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clone = function () {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        };
        /**
         * @language en_US
         * Concatenates a matrix with the current matrix, effectively combining the geometric effects of the two. In mathematical
         * terms, concatenating two matrixes is the same as combining them using matrix multiplication.
         * @param other The matrix to be concatenated to the source matrix.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。在数学术语中，将两个矩阵连接起来与使用矩阵乘法将它们结合起来是相同的。
         * @param other 要连接到源矩阵的矩阵。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.concat = function (other) {
            var a = this.a * other.a;
            var b = 0.0;
            var c = 0.0;
            var d = this.d * other.d;
            var tx = this.tx * other.a + other.tx;
            var ty = this.ty * other.d + other.ty;
            if (this.b !== 0.0 || this.c !== 0.0 || other.b !== 0.0 || other.c !== 0.0) {
                a += this.b * other.c;
                d += this.c * other.b;
                b += this.a * other.b + this.b * other.d;
                c += this.c * other.a + this.d * other.c;
                tx += this.ty * other.c;
                ty += this.tx * other.b;
            }
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        };
        /**
         * @language en_US
         * Copies all of the matrix data from the source Point object into the calling Matrix object.
         * @param other  The Matrix object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将源 Matrix 对象中的所有矩阵数据复制到调用方 Matrix 对象中。
         * @param other 要拷贝的目标矩阵
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.copyFrom = function (other) {
            this.a = other.a;
            this.b = other.b;
            this.c = other.c;
            this.d = other.d;
            this.tx = other.tx;
            this.ty = other.ty;
            return this;
        };
        /**
         * @language en_US
         * Sets each matrix property to a value that causes a null transformation. An object transformed by applying an
         * identity matrix will be identical to the original. After calling the identity() method, the resulting matrix
         * has the following properties: a=1, b=0, c=0, d=1, tx=0, ty=0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 为每个矩阵属性设置一个值，该值将导致矩阵无转换。通过应用恒等矩阵转换的对象将与原始对象完全相同。
         * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.identity = function () {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
        };
        /**
         * @language en_US
         * Performs the opposite transformation of the original matrix. You can apply an inverted matrix to an object to
         * undo the transformation performed when applying the original matrix.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 执行原始矩阵的逆转换。
         * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.invert = function () {
            this.$invertInto(this);
        };
        /**
         * @private
         */
        p.$invertInto = function (target) {
            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;
            var tx = this.tx;
            var ty = this.ty;
            if (b == 0 && c == 0) {
                target.b = target.c = 0;
                if (a == 0 || d == 0) {
                    target.a = target.d = target.tx = target.ty = 0;
                }
                else {
                    a = target.a = 1 / a;
                    d = target.d = 1 / d;
                    target.tx = -a * tx;
                    target.ty = -d * ty;
                }
                return;
            }
            var determinant = a * d - b * c;
            if (determinant == 0) {
                target.identity();
                return;
            }
            determinant = 1 / determinant;
            var k = target.a = d * determinant;
            b = target.b = -b * determinant;
            c = target.c = -c * determinant;
            d = target.d = a * determinant;
            target.tx = -(k * tx + c * ty);
            target.ty = -(b * tx + d * ty);
        };
        /**
         * @language en_US
         * Applies a rotation transformation to the Matrix object.
         * The rotate() method alters the a, b, c, and d properties of the Matrix object.
         * @param angle The rotation angle in radians.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对 Matrix 对象应用旋转转换。
         * rotate() 方法将更改 Matrix 对象的 a、b、c 和 d 属性。
         * @param angle 以弧度为单位的旋转角度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.rotate = function (angle) {
            angle = +angle;
            if (angle !== 0) {
                var u = cos(angle);
                var v = sin(angle);
                var ta = this.a;
                var tb = this.b;
                var tc = this.c;
                var td = this.d;
                var ttx = this.tx;
                var tty = this.ty;
                this.a = ta * u - tb * v;
                this.b = ta * v + tb * u;
                this.c = tc * u - td * v;
                this.d = tc * v + td * u;
                this.tx = ttx * u - tty * v;
                this.ty = ttx * v + tty * u;
            }
        };
        /**
         * @language en_US
         * Applies a scaling transformation to the matrix. The x axis is multiplied by sx, and the y axis it is multiplied by sy.
         * The scale() method alters the a and d properties of the Matrix object.
         * @param sx A multiplier used to scale the object along the x axis.
         * @param sy A multiplier used to scale the object along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对矩阵应用缩放转换。x 轴乘以 sx，y 轴乘以 sy。
         * scale() 方法将更改 Matrix 对象的 a 和 d 属性。
         * @param sx 用于沿 x 轴缩放对象的乘数。
         * @param sy 用于沿 y 轴缩放对象的乘数。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.scale = function (sx, sy) {
            if (sx !== 1) {
                this.a *= sx;
                this.c *= sx;
                this.tx *= sx;
            }
            if (sy !== 1) {
                this.b *= sy;
                this.d *= sy;
                this.ty *= sy;
            }
        };
        /**
         * @language en_US
         * Sets the members of Matrix to the specified values
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Matrix 的成员设置为指定值
         * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @param b 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @param c 旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @param tx 沿 x 轴平移每个点的距离。
         * @param ty 沿 y 轴平移每个点的距离。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setTo = function (a, b, c, d, tx, ty) {
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
            return this;
        };
        /**
         * @language en_US
         * Returns the result of applying the geometric transformation represented by the Matrix object to the specified point.
         * @param pointX The x coordinate for which you want to get the result of the Matrix transformation.
         * @param pointY The y coordinate for which you want to get the result of the Matrix transformation.
         * @param resultPoint A reusable instance of Point for saving the results. Passing this parameter can reduce the
         * number of reallocate objects, which allows you to get better code execution performance.
         * @returns The point resulting from applying the Matrix transformation.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
         * @param pointX 想要获得其矩阵转换结果的点的x坐标。
         * @param pointY 想要获得其矩阵转换结果的点的y坐标。
         * @param resultPoint 框架建议尽可能减少创建对象次数来优化性能，可以从外部传入一个复用的Point对象来存储结果，若不传入将创建一个新的Point对象返回。
         * @returns 由应用矩阵转换所产生的点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.transformPoint = function (pointX, pointY, resultPoint) {
            var x = this.a * pointX + this.c * pointY + this.tx;
            var y = this.b * pointX + this.d * pointY + this.ty;
            if (resultPoint) {
                resultPoint.setTo(x, y);
                return resultPoint;
            }
            return new egret.Point(x, y);
        };
        /**
         * @language en_US
         * Translates the matrix along the x and y axes, as specified by the dx and dy parameters.
         * @param dx The amount of movement along the x axis to the right, in pixels.
         * @param dy The amount of movement down along the y axis, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 沿 x 和 y 轴平移矩阵，由 dx 和 dy 参数指定。
         * @param dx 沿 x 轴向右移动的量（以像素为单位）。
         * @param dy 沿 y 轴向下移动的量（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.translate = function (dx, dy) {
            this.tx += dx;
            this.ty += dy;
        };
        /**
         * @language en_US
         * Determines whether two matrixes are equal.
         * @param other The matrix to be compared.
         * @returns A value of true if the object is equal to this Matrix object; false if it is not equal.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否与另一个矩阵数据相等
         * @param other 要比较的另一个矩阵对象。
         * @returns 是否相等，ture表示相等。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.equals = function (other) {
            return this.a == other.a && this.b == other.b &&
                this.c == other.c && this.d == other.d &&
                this.tx == other.tx && this.ty == other.ty;
        };
        /**
         * @language en_US
         * prepend matrix
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @returns matrix
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 前置矩阵
         * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param b 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param c 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param tx 沿 x 轴平移每个点的距离
         * @param ty 沿 y 轴平移每个点的距离
         * @returns 矩阵自身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.prepend = function (a, b, c, d, tx, ty) {
            var tx1 = this.tx;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                var a1 = this.a;
                var c1 = this.c;
                this.a = a1 * a + this.b * c;
                this.b = a1 * b + this.b * d;
                this.c = c1 * a + this.d * c;
                this.d = c1 * b + this.d * d;
            }
            this.tx = tx1 * a + this.ty * c + tx;
            this.ty = tx1 * b + this.ty * d + ty;
            return this;
        };
        /**
         * @language en_US
         * append matrix
         * @param a The value that affects the positioning of pixels along the x axis when scaling or rotating an image.
         * @param b The value that affects the positioning of pixels along the y axis when rotating or skewing an image.
         * @param c The value that affects the positioning of pixels along the x axis when rotating or skewing an image.
         * @param d The value that affects the positioning of pixels along the y axis when scaling or rotating an image..
         * @param tx The distance by which to translate each point along the x axis.
         * @param ty The distance by which to translate each point along the y axis.
         * @returns matrix
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 后置矩阵
         * @param a 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param b 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param c 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param d 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param tx 沿 x 轴平移每个点的距离
         * @param ty 沿 y 轴平移每个点的距离
         * @returns 矩阵自身
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.append = function (a, b, c, d, tx, ty) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                this.a = a * a1 + b * c1;
                this.b = a * b1 + b * d1;
                this.c = c * a1 + d * c1;
                this.d = c * b1 + d * d1;
            }
            this.tx = tx * a1 + ty * c1 + this.tx;
            this.ty = tx * b1 + ty * d1 + this.ty;
            return this;
        };
        /**
         * @language en_US
         * Given a point in the pretransform coordinate space, returns the coordinates of that point after the transformation occurs.
         * Unlike the standard transformation applied using the transformPoint() method, the deltaTransformPoint() method's transformation does not consider the translation parameters tx and ty.
         * @param point The point for which you want to get the result of the matrix transformation.
         * @returns The point resulting from applying the matrix transformation.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果给定预转换坐标空间中的点，则此方法返回发生转换后该点的坐标。
         * 与使用 transformPoint() 方法应用的标准转换不同，deltaTransformPoint() 方法的转换不考虑转换参数 tx 和 ty。
         * @param point 想要获得其矩阵转换结果的点
         * @returns 由应用矩阵转换所产生的点
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.deltaTransformPoint = function (point) {
            var self = this;
            var x = self.a * point.x + self.c * point.y;
            var y = self.b * point.x + self.d * point.y;
            return new egret.Point(x, y);
        };
        /**
         * @language en_US
         * Returns a text value listing the properties of the Matrix object.
         * @returns A string containing the values of the properties of the Matrix object: a, b, c, d, tx, and ty.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
         * @returns 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.toString = function () {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        };
        /**
         * @language en_US
         * Includes parameters for scaling, rotation, and translation. When applied to a matrix it sets the matrix's values based on those parameters.
         * @param scaleX The factor by which to scale horizontally.
         * @param scaleY The factor by which scale vertically.
         * @param rotation The amount to rotate, in radians.
         * @param tx The number of pixels to translate (move) to the right along the x axis.
         * @param ty The number of pixels to translate (move) down along the y axis.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 包括用于缩放、旋转和转换的参数。当应用于矩阵时，该方法会基于这些参数设置矩阵的值。
         * @param scaleX 水平缩放所用的系数
         * @param scaleY 垂直缩放所用的系数
         * @param rotation 旋转量（以弧度为单位）
         * @param tx 沿 x 轴向右平移（移动）的像素数
         * @param ty 沿 y 轴向下平移（移动）的像素数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.createBox = function (scaleX, scaleY, rotation, tx, ty) {
            if (rotation === void 0) { rotation = 0; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            var self = this;
            if (rotation !== 0) {
                rotation = rotation / DEG_TO_RAD;
                var u = egret.NumberUtils.cos(rotation);
                var v = egret.NumberUtils.sin(rotation);
                self.a = u * scaleX;
                self.b = v * scaleY;
                self.c = -v * scaleX;
                self.d = u * scaleY;
            }
            else {
                self.a = scaleX;
                self.b = 0;
                self.c = 0;
                self.d = scaleY;
            }
            self.tx = tx;
            self.ty = ty;
        };
        /**
         * @language en_US
         * Creates the specific style of matrix expected by the beginGradientFill() and lineGradientStyle() methods of the Graphics class.
         * Width and height are scaled to a scaleX/scaleY pair and the tx/ty values are offset by half the width and height.
         * @param width The width of the gradient box.
         * @param height The height of the gradient box.
         * @param rotation The amount to rotate, in radians.
         * @param tx The distance, in pixels, to translate to the right along the x axis. This value is offset by half of the width parameter.
         * @param ty The distance, in pixels, to translate down along the y axis. This value is offset by half of the height parameter.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建 Graphics 类的 beginGradientFill() 和 lineGradientStyle() 方法所需的矩阵的特定样式。
         * 宽度和高度被缩放为 scaleX/scaleY 对，而 tx/ty 值偏移了宽度和高度的一半。
         * @param width 渐变框的宽度
         * @param height 渐变框的高度
         * @param rotation 旋转量（以弧度为单位）
         * @param tx 沿 x 轴向右平移的距离（以像素为单位）。此值将偏移 width 参数的一半
         * @param ty 沿 y 轴向下平移的距离（以像素为单位）。此值将偏移 height 参数的一半
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.createGradientBox = function (width, height, rotation, tx, ty) {
            if (rotation === void 0) { rotation = 0; }
            if (tx === void 0) { tx = 0; }
            if (ty === void 0) { ty = 0; }
            this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
        };
        /**
         * @private
         */
        p.$transformBounds = function (bounds) {
            var a = this.a;
            var b = this.b;
            var c = this.c;
            var d = this.d;
            var tx = this.tx;
            var ty = this.ty;
            var x = bounds.x;
            var y = bounds.y;
            var xMax = x + bounds.width;
            var yMax = y + bounds.height;
            var x0 = a * x + c * y + tx;
            var y0 = b * x + d * y + ty;
            var x1 = a * xMax + c * y + tx;
            var y1 = b * xMax + d * y + ty;
            var x2 = a * xMax + c * yMax + tx;
            var y2 = b * xMax + d * yMax + ty;
            var x3 = a * x + c * yMax + tx;
            var y3 = b * x + d * yMax + ty;
            var tmp = 0;
            if (x0 > x1) {
                tmp = x0;
                x0 = x1;
                x1 = tmp;
            }
            if (x2 > x3) {
                tmp = x2;
                x2 = x3;
                x3 = tmp;
            }
            bounds.x = Math.floor(x0 < x2 ? x0 : x2);
            bounds.width = Math.ceil((x1 > x3 ? x1 : x3) - bounds.x);
            if (y0 > y1) {
                tmp = y0;
                y0 = y1;
                y1 = tmp;
            }
            if (y2 > y3) {
                tmp = y2;
                y2 = y3;
                y3 = tmp;
            }
            bounds.y = Math.floor(y0 < y2 ? y0 : y2);
            bounds.height = Math.ceil((y1 > y3 ? y1 : y3) - bounds.y);
        };
        /**
         * @private
         */
        p.getDeterminant = function () {
            return this.a * this.d - this.b * this.c;
        };
        /**
         * @private
         */
        p.$getScaleX = function () {
            var m = this;
            if (m.a == 1 && m.b == 0) {
                return 1;
            }
            var result = Math.sqrt(m.a * m.a + m.b * m.b);
            return this.getDeterminant() < 0 ? -result : result;
        };
        /**
         * @private
         */
        p.$getScaleY = function () {
            var m = this;
            if (m.c == 0 && m.d == 1) {
                return 1;
            }
            var result = Math.sqrt(m.c * m.c + m.d * m.d);
            return this.getDeterminant() < 0 ? -result : result;
        };
        /**
         * @private
         */
        p.$getSkewX = function () {
            return Math.atan2(this.d, this.c) - (PI / 2);
        };
        /**
         * @private
         */
        p.$getSkewY = function () {
            return Math.atan2(this.b, this.a);
        };
        /**
         * @private
         */
        p.$updateScaleAndRotation = function (scaleX, scaleY, skewX, skewY) {
            if ((skewX == 0 || skewX == TwoPI) && (skewY == 0 || skewY == TwoPI)) {
                this.a = scaleX;
                this.b = this.c = 0;
                this.d = scaleY;
                return;
            }
            var u = cos(skewX);
            var v = sin(skewX);
            if (skewX == skewY) {
                this.a = u * scaleX;
                this.b = v * scaleX;
            }
            else {
                this.a = cos(skewY) * scaleX;
                this.b = sin(skewY) * scaleX;
            }
            this.c = -v * scaleY;
            this.d = u * scaleY;
        };
        /**
         * @private
         * target = other * this
         */
        p.$preMultiplyInto = function (other, target) {
            var a = other.a * this.a;
            var b = 0.0;
            var c = 0.0;
            var d = other.d * this.d;
            var tx = other.tx * this.a + this.tx;
            var ty = other.ty * this.d + this.ty;
            if (other.b !== 0.0 || other.c !== 0.0 || this.b !== 0.0 || this.c !== 0.0) {
                a += other.b * this.c;
                d += other.c * this.b;
                b += other.a * this.b + other.b * this.d;
                c += other.c * this.a + other.d * this.c;
                tx += other.ty * this.c;
                ty += other.tx * this.b;
            }
            target.a = a;
            target.b = b;
            target.c = c;
            target.d = d;
            target.tx = tx;
            target.ty = ty;
        };
        return Matrix;
    })(egret.HashObject);
    egret.Matrix = Matrix;
    egret.registerClass(Matrix,'egret.Matrix');
    /**
     * @private
     * 仅供框架内复用，要防止暴露引用到外部。
     */
    egret.$TempMatrix = new Matrix();
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var rectanglePool = [];
    /**
     * @language en_US
     * A Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its
     * width and its height.<br/>
     * The x, y, width, and height properties of the Rectangle class are independent of each other; changing the value of
     * one property has no effect on the others. However, the right and bottom properties are integrally related to those
     * four properties. For example, if you change the value of the right property, the value of the width property changes;
     * if you change the bottom property, the value of the height property changes.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Rectangle.ts
     */
    /**
     * @language zh_CN
     * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。<br/>
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     * 但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width
     * 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Rectangle.ts
     */
    var Rectangle = (function (_super) {
        __extends(Rectangle, _super);
        /**
         * @language en_US
         * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified
         * width and height parameters.
         * @param x The x coordinate of the top-left corner of the rectangle.
         * @param y The y coordinate of the top-left corner of the rectangle.
         * @param width The width of the rectangle, in pixels.
         * @param height The height of the rectangle, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Rectangle(x, y, width, height) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            _super.call(this);
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
        var d = __define,c=Rectangle,p=c.prototype;
        /**
         * @language en_US
         * Releases a rectangle instance to the object pool.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个Rectangle实例到对象池
         * @version Egret 2.4
         * @platform Web,Native
         */
        Rectangle.release = function (rect) {
            if (!rect) {
                return;
            }
            rectanglePool.push(rect);
        };
        /**
         * @language en_US
         * get a rectangle instance from the object pool or create a new one.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的Rectangle对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Rectangle.create = function () {
            var rect = rectanglePool.pop();
            if (!rect) {
                rect = new Rectangle();
            }
            return rect;
        };
        d(p, "right"
            /**
             * @language en_US
             * The sum of the x and width properties.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * x 和 width 属性的和。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.x + this.width;
            }
            ,function (value) {
                this.width = value - this.x;
            }
        );
        d(p, "bottom"
            /**
             * @language en_US
             * The sum of the y and height properties.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * y 和 height 属性的和。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.y + this.height;
            }
            ,function (value) {
                this.height = value - this.y;
            }
        );
        d(p, "left"
            /**
             * @language en_US
             * The x coordinate of the top-left corner of the rectangle. Changing the left property of a Rectangle object has
             * no effect on the y and height properties. However it does affect the width property, whereas changing the x value
             * does not affect the width property.
             * The value of the left property is equal to the value of the x property.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 矩形左上角的 x 坐标。更改 Rectangle 对象的 left 属性对 y 和 height 属性没有影响。但是，它会影响 width 属性，而更改 x 值不会影响 width 属性。
             * left 属性的值等于 x 属性的值。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.x;
            }
            ,function (value) {
                this.width += this.x - value;
                this.x = value;
            }
        );
        d(p, "top"
            /**
             * @language en_US
             * The y coordinate of the top-left corner of the rectangle. Changing the top property of a Rectangle object has
             * no effect on the x and width properties. However it does affect the height property, whereas changing the y
             * value does not affect the height property.<br/>
             * The value of the top property is equal to the value of the y property.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 矩形左上角的 y 坐标。更改 Rectangle 对象的 top 属性对 x 和 width 属性没有影响。但是，它会影响 height 属性，而更改 y 值不会影响 height 属性。<br/>
             * top 属性的值等于 y 属性的值。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.y;
            }
            ,function (value) {
                this.height += this.y - value;
                this.y = value;
            }
        );
        d(p, "topLeft"
            /**
             * @language en_US
             * The location of the Rectangle object's top-left corner, determined by the x and y coordinates of the point.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return new egret.Point(this.left, this.top);
            }
            ,function (value) {
                this.top = value.y;
                this.left = value.x;
            }
        );
        d(p, "bottomRight"
            /**
             * @language en_US
             * The location of the Rectangle object's bottom-right corner, determined by the values of the right and bottom properties.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return new egret.Point(this.right, this.bottom);
            }
            ,function (value) {
                this.bottom = value.y;
                this.right = value.x;
            }
        );
        /**
         * @language en_US
         * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
         * @param sourceRect The Rectangle object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将源 Rectangle 对象中的所有矩形数据复制到调用方 Rectangle 对象中。
         * @param sourceRect 要从中复制数据的 Rectangle 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.copyFrom = function (sourceRect) {
            this.x = sourceRect.x;
            this.y = sourceRect.y;
            this.width = sourceRect.width;
            this.height = sourceRect.height;
            return this;
        };
        /**
         * @language en_US
         * Sets the members of Rectangle to the specified values
         * @param x The x coordinate of the top-left corner of the rectangle.
         * @param y The y coordinate of the top-left corner of the rectangle.
         * @param width The width of the rectangle, in pixels.
         * @param height The height of the rectangle, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Rectangle 的成员设置为指定值
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setTo = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        };
        /**
         * @language en_US
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         * @param x The x coordinate (horizontal position) of the point.
         * @param y The y coordinate (vertical position) of the point.
         * @returns A value of true if the Rectangle object contains the specified point; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * @param x 检测点的x轴
         * @param y 检测点的y轴
         * @returns 如果检测点位于矩形内，返回true，否则，返回false
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.contains = function (x, y) {
            return this.x <= x &&
                this.x + this.width >= x &&
                this.y <= y &&
                this.y + this.height >= y;
        };
        /**
         * @language en_US
         * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns
         * the area of intersection as a Rectangle object. If the rectangles do not intersect, this method returns an empty
         * Rectangle object with its properties set to 0.
         * @param toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
         * @returns A Rectangle object that equals the area of intersection. If the rectangles do not intersect, this method
         * returns an empty Rectangle object; that is, a rectangle with its x, y, width, and height properties set to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果在 toIntersect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。如果矩形不相交，
         * 则此方法返回一个空的 Rectangle 对象，其属性设置为 0。
         * @param toIntersect 要对照比较以查看其是否与此 Rectangle 对象相交的 Rectangle 对象。
         * @returns 等于交集区域的 Rectangle 对象。如果该矩形不相交，则此方法返回一个空的 Rectangle 对象；即，其 x、y、width 和
         * height 属性均设置为 0 的矩形。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.intersection = function (toIntersect) {
            return this.clone().$intersectInPlace(toIntersect);
        };
        /**
         * @language en_US
         * Increases the size of the Rectangle object by the specified amounts, in pixels.
         * The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
         * @param dx The value to be added to the left and the right of the Rectangle object.
         * @param dy The value to be added to the top and the bottom of the Rectangle.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 按指定量增加 Rectangle 对象的大小（以像素为单位）
         * 保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
         * @param dx Rectangle 对象横向增加的值。
         * @param dy Rectangle 对象纵向增加的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.inflate = function (dx, dy) {
            this.x -= dx;
            this.width += 2 * dx;
            this.y -= dy;
            this.height += 2 * dy;
        };
        /**
         * @private
         */
        p.$intersectInPlace = function (clipRect) {
            var x0 = this.x;
            var y0 = this.y;
            var x1 = clipRect.x;
            var y1 = clipRect.y;
            var l = Math.max(x0, x1);
            var r = Math.min(x0 + this.width, x1 + clipRect.width);
            if (l <= r) {
                var t = Math.max(y0, y1);
                var b = Math.min(y0 + this.height, y1 + clipRect.height);
                if (t <= b) {
                    this.setTo(l, t, r - l, b - t);
                    return this;
                }
            }
            this.setEmpty();
            return this;
        };
        /**
         * @language en_US
         * Determines whether the object specified in the toIntersect parameter intersects with this Rectangle object.
         * This method checks the x, y, width, and height properties of the specified Rectangle object to see if it
         * intersects with this Rectangle object.
         * @param toIntersect The Rectangle object to compare against this Rectangle object.
         * @returns A value of true if the specified object intersects with this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle
         * 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
         * @param toIntersect 要与此 Rectangle 对象比较的 Rectangle 对象。
         * @returns 如果两个矩形相交，返回true，否则返回false
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.intersects = function (toIntersect) {
            return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right)
                && Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
        };
        /**
         * @language en_US
         * Determines whether or not this Rectangle object is empty.
         * @returns A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定此 Rectangle 对象是否为空。
         * @returns 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.isEmpty = function () {
            return this.width <= 0 || this.height <= 0;
        };
        /**
         * @language en_US
         * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Rectangle 对象的所有属性设置为 0。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setEmpty = function () {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        };
        /**
         * @language en_US
         * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
         * @returns A new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回一个新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
         * @returns 新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clone = function () {
            return new Rectangle(this.x, this.y, this.width, this.height);
        };
        /**
         * @language en_US
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         * This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
         * @param point The point, as represented by its x and y coordinates.
         * @returns A value of true if the Rectangle object contains the specified point; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point 包含点对象
         * @returns 如果包含，返回true，否则返回false
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.containsPoint = function (point) {
            if (this.x < point.x
                && this.x + this.width > point.x
                && this.y < point.y
                && this.y + this.height > point.y) {
                return true;
            }
            return false;
        };
        /**
         * @language en_US
         * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object.
         * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
         * @param rect The Rectangle object being checked.
         * @returns A value of true if the Rectangle object that you specify is contained by this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定此 Rectangle 对象内是否包含由 rect 参数指定的 Rectangle 对象。
         * 如果一个 Rectangle 对象完全在另一个 Rectangle 的边界内，我们说第二个 Rectangle 包含第一个 Rectangle。
         * @param rect 所检查的 Rectangle 对象
         * @returns 如果此 Rectangle 对象包含您指定的 Rectangle 对象，则返回 true 值，否则返回 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.containsRect = function (rect) {
            var r1 = rect.x + rect.width;
            var b1 = rect.y + rect.height;
            var r2 = this.x + this.width;
            var b2 = this.y + this.height;
            return (rect.x >= this.x) && (rect.x < r2) && (rect.y >= this.y) && (rect.y < b2) && (r1 > this.x) && (r1 <= r2) && (b1 > this.y) && (b1 <= b2);
        };
        /**
         * @language en_US
         * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object.
         * This method compares the x, y, width, and height properties of an object against the same properties of this Rectangle object.
         * @param The rectangle to compare to this Rectangle object.
         * @returns A value of true if the object has exactly the same values for the x, y, width, and height properties as this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定在 toCompare 参数中指定的对象是否等于此 Rectangle 对象。
         * 此方法将某个对象的 x、y、width 和 height 属性与此 Rectangle 对象所对应的相同属性进行比较。
         * @param toCompare 要与此 Rectangle 对象进行比较的矩形。
         * @returns 如果对象具有与此 Rectangle 对象完全相同的 x、y、width 和 height 属性值，则返回 true 值，否则返回 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.equals = function (toCompare) {
            if (this === toCompare) {
                return true;
            }
            return this.x === toCompare.x && this.y === toCompare.y
                && this.width === toCompare.width && this.height === toCompare.height;
        };
        /**
         * @language en_US
         * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
         * @param point 此 Point 对象的 x 属性用于增加 Rectangle 对象的水平尺寸。y 属性用于增加 Rectangle 对象的垂直尺寸。
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 增加 Rectangle 对象的大小。此方法与 Rectangle.inflate() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.inflatePoint = function (point) {
            this.inflate(point.x, point.y);
        };
        /**
         * @language en_US
         * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
         * @param dx Moves the x value of the Rectangle object by this amount.
         * @param dy Moves the y value of the Rectangle object by this amount.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 按指定量调整 Rectangle 对象的位置（由其左上角确定）。
         * @param dx 将 Rectangle 对象的 x 值移动此数量。
         * @param dy 将 Rectangle 对象的 t 值移动此数量。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.offset = function (dx, dy) {
            this.x += dx;
            this.y += dy;
        };
        /**
         * @language en_US
         * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
         * @param point A Point object to use to offset this Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Point 对象用作参数来调整 Rectangle 对象的位置。此方法与 Rectangle.offset() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point 要用于偏移此 Rectangle 对象的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.offsetPoint = function (point) {
            this.offset(point.x, point.y);
        };
        /**
         * @language en_US
         * Builds and returns a string that lists the horizontal and vertical positions and the width and height of the Rectangle object.
         * @returns A string listing the value of each of the following properties of the Rectangle object: x, y, width, and height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 生成并返回一个字符串，该字符串列出 Rectangle 对象的水平位置和垂直位置以及高度和宽度。
         * @returns 一个字符串，它列出了 Rectangle 对象的下列各个属性的值：x、y、width 和 height。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.toString = function () {
            return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
        };
        /**
         * @language en_US
         * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
         * @param toUnion A Rectangle object to add to this Rectangle object.
         * @returns A new Rectangle object that is the union of the two rectangles.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
         * @param toUnion 要添加到此 Rectangle 对象的 Rectangle 对象。
         * @returns 充当两个矩形的联合的新 Rectangle 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.union = function (toUnion) {
            var result = this.clone();
            if (toUnion.isEmpty()) {
                return result;
            }
            if (result.isEmpty()) {
                result.copyFrom(toUnion);
                return result;
            }
            var l = Math.min(result.x, toUnion.x);
            var t = Math.min(result.y, toUnion.y);
            result.setTo(l, t, Math.max(result.right, toUnion.right) - l, Math.max(result.bottom, toUnion.bottom) - t);
            return result;
        };
        /**
         * @private
         */
        p.$getBaseWidth = function (angle) {
            var u = Math.abs(Math.cos(angle));
            var v = Math.abs(Math.sin(angle));
            return u * this.width + v * this.height;
        };
        /**
         * @private
         */
        p.$getBaseHeight = function (angle) {
            var u = Math.abs(Math.cos(angle));
            var v = Math.abs(Math.sin(angle));
            return v * this.width + u * this.height;
        };
        return Rectangle;
    })(egret.HashObject);
    egret.Rectangle = Rectangle;
    egret.registerClass(Rectangle,'egret.Rectangle');
    /**
     * @private
     * 仅供框架内复用，要防止暴露引用到外部。
     */
    egret.$TempRectangle = new Rectangle();
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.$locale_strings = egret.$locale_strings || {};
    egret.$locale_strings["en_US"] = egret.$locale_strings["en_US"] || {};
    var locale_strings = egret.$locale_strings["en_US"];
    //core  1000-1999
    locale_strings[1001] = "Could not find Egret entry class: {0}。";
    locale_strings[1002] = "Egret entry class '{0}' must inherit from egret.DisplayObject.";
    locale_strings[1003] = "Parameter {0} must be non-null.";
    locale_strings[1004] = "An object cannot be added as a child to one of it's children (or children's children, etc.).";
    locale_strings[1005] = "An object cannot be added as a child of itself.";
    locale_strings[1006] = "The supplied DisplayObject must be a child of the caller.";
    locale_strings[1007] = "An index specified for a parameter was out of range.";
    locale_strings[1008] = "Instantiate singleton error，singleton class {0} can not create multiple instances.";
    locale_strings[1009] = "the Class {0} cannot use the property \"{1}\"";
    locale_strings[1010] = "the property \"{1}\" of the Class \"{0}\" is readonly";
    locale_strings[1011] = "Stream Error. URL: {0}";
    locale_strings[1012] = "The type of parameter {0} must be Class.";
    locale_strings[1013] = "Variable assignment is NaN, please see the code!";
    locale_strings[1014] = "the constant \"{1}\" of the Class \"{0}\" is read-only";
    locale_strings[1015] = "xml not found!";
    locale_strings[1016] = "{0}has been obsoleted";
    locale_strings[1017] = "The format of JSON file is incorrect: {0}\ndata: {1}";
    locale_strings[1018] = "the scale9Grid is not correct";
    locale_strings[1022] = "{0} ArgumentError";
    locale_strings[1023] = "This method is not available in the ScrollView!";
    locale_strings[1025] = "end of the file";
    locale_strings[1026] = "! EncodingError The code point {0} could not be encoded.";
    locale_strings[1027] = "DecodingError";
    locale_strings[1028] = ". called injection is not configured rule: {0}, please specify configuration during its initial years of injection rule, and then call the corresponding single case.";
    locale_strings[1029] = "Function.prototype.bind - what is trying to be bound is not callable";
    locale_strings[1033] = "Photos can not be used across domains toDataURL to convert base64";
    locale_strings[1034] = "Music file decoding failed: \"{0}\", please use the standard conversion tool reconversion under mp3.";
    locale_strings[1035] = "Native does not support this feature!";
    locale_strings[1036] = "Sound has stopped, please recall Sound.play () to play the sound!";
    locale_strings[1037] = "Non-load the correct blob!";
    locale_strings[1038] = "XML format error!";
    locale_strings[1039] = "crossOrigin images can not set pixelHitTest  property!";
    locale_strings[1040] = "hitTestPoint can not detect crossOrigin images! Please check if the display object has crossOrigin elements.";
    locale_strings[1041] = "egret.MainContext.runtimeType is deprecated, please use egret.Capabilities.runtimeType replace";
    //gui  3000-3099
    locale_strings[3000] = "Theme configuration file failed to load: {0}";
    locale_strings[3001] = "Cannot find the skin name which is configured in Theme: {0}";
    locale_strings[3002] = "Index:\"{0}\" is out of the collection element index range";
    locale_strings[3003] = "Cannot be available in this component. If this component is container, please continue to use";
    locale_strings[3004] = "addChild(){0}addElement() replace";
    locale_strings[3005] = "addChildAt(){0}addElementAt() replace";
    locale_strings[3006] = "removeChild(){0}removeElement() replace";
    locale_strings[3007] = "removeChildAt(){0}removeElementAt() replace";
    locale_strings[3008] = "setChildIndex(){0}setElementIndex() replace";
    locale_strings[3009] = "swapChildren(){0}swapElements() replace";
    locale_strings[3010] = "swapChildrenAt(){0}swapElementsAt() replace";
    locale_strings[3011] = "Index:\"{0}\" is out of the visual element index range";
    locale_strings[3012] = "This method is not available in Scroller component!";
    locale_strings[3013] = "UIStage is GUI root container, and only one such instant is in the display list！";
    //socket 3100-3199
    locale_strings[3100] = "Current browser does not support WebSocket";
    locale_strings[3101] = "Please connect Socket firstly";
    locale_strings[3102] = "Please set the type of binary type";
    //db 4000-4299
    locale_strings[4000] = "An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)";
    locale_strings[4001] = "Abstract class can not be instantiated!";
    locale_strings[4002] = "Unnamed data!";
    locale_strings[4003] = "Nonsupport version!";
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     */
    egret.$locale_strings = egret.$locale_strings || {};
    /**
     * @private
     */
    egret.$language = "en_US";
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        /**
         * @private
         * 全局多语言翻译函数
         * @param code 要查询的字符串代码
         * @param args 替换字符串中{0}标志的参数列表
         * @returns 返回拼接后的字符串
         */
        function tr(code) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var text = egret.$locale_strings[egret.$language][code];
            if (!text) {
                return "{" + code + "}";
            }
            var length = args.length;
            for (var i = 0; i < length; i++) {
                text = text.replace("{" + i + "}", args[i]);
            }
            return text;
        }
        sys.tr = tr;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    egret.$locale_strings = egret.$locale_strings || {};
    egret.$locale_strings["zh_CN"] = egret.$locale_strings["zh_CN"] || {};
    var locale_strings = egret.$locale_strings["zh_CN"];
    //eui 2000-2999
    //RES 3200-3299
    //core  1000-1999
    locale_strings[1001] = "找不到Egret入口类: {0}。";
    locale_strings[1002] = "Egret入口类 {0} 必须继承自egret.DisplayObject。";
    locale_strings[1003] = "参数 {0} 不能为 null。";
    locale_strings[1004] = "无法将对象添加为它的一个子对象（或子对象的子对象等）的子对象。";
    locale_strings[1005] = "不能将对象添加为其自身的子对象。";
    locale_strings[1006] = "提供的 DisplayObject 必须是调用者的子级。";
    locale_strings[1007] = "为参数指定的索引不在范围内。";
    locale_strings[1008] = "实例化单例出错，不允许实例化多个 {0} 对象。";
    locale_strings[1009] = "类 {0} 不可以使用属性 {1}";
    locale_strings[1010] = "类 {0} 属性 {1} 是只读的";
    locale_strings[1011] = "流错误。URL: {0}";
    locale_strings[1012] = "参数 {0} 的类型必须为 Class。";
    locale_strings[1013] = "变量赋值为NaN，请查看代码！";
    locale_strings[1014] = "类 {0} 常量 {1} 是只读的";
    locale_strings[1015] = "xml not found!";
    locale_strings[1016] = "{0}已经废弃";
    locale_strings[1017] = "JSON文件格式不正确: {0}\ndata: {1}";
    locale_strings[1018] = "9宫格设置错误";
    locale_strings[1022] = "{0} ArgumentError";
    locale_strings[1023] = "此方法在ScrollView内不可用!";
    locale_strings[1025] = "遇到文件尾";
    locale_strings[1026] = "EncodingError! The code point {0} could not be encoded.";
    locale_strings[1027] = "DecodingError";
    locale_strings[1028] = "调用了未配置的注入规则:{0}。 请先在项目初始化里配置指定的注入规则，再调用对应单例。";
    locale_strings[1029] = "Function.prototype.bind - what is trying to be bound is not callable";
    locale_strings[1033] = "跨域图片不可以使用toDataURL来转换成base64";
    locale_strings[1034] = "音乐文件解码失败：\"{0}\"，请使用标准的转换工具重新转换下mp3。";
    locale_strings[1035] = "Native 下暂未实现此功能！";
    locale_strings[1036] = "声音已停止，请重新调用 Sound.play() 来播放声音！";
    locale_strings[1037] = "非正确的blob加载！";
    locale_strings[1038] = "XML 格式错误!";
    locale_strings[1039] = "跨域图片不能设置 pixelHitTest 属性!";
    locale_strings[1040] = "hitTestPoint 不能对跨域图片进行检测! 请检查该显示对象内是否含有跨域元素";
    locale_strings[1041] = "egret.MainContext.runtimeType 已废弃,请使用egret.Capabilities.runtimeType 代替";
    //gui  3000-3099
    locale_strings[3000] = "主题配置文件加载失败: {0}";
    locale_strings[3001] = "找不到主题中所配置的皮肤类名: {0}";
    locale_strings[3002] = "索引:\"{0}\"超出集合元素索引范围";
    locale_strings[3003] = "在此组件中不可用，若此组件为容器类，请使用";
    locale_strings[3004] = "addChild(){0}addElement()代替";
    locale_strings[3005] = "addChildAt(){0}addElementAt()代替";
    locale_strings[3006] = "removeChild(){0}removeElement()代替";
    locale_strings[3007] = "removeChildAt(){0}removeElementAt()代替";
    locale_strings[3008] = "setChildIndex(){0}setElementIndex()代替";
    locale_strings[3009] = "swapChildren(){0}swapElements()代替";
    locale_strings[3010] = "swapChildrenAt(){0}swapElementsAt()代替";
    locale_strings[3011] = "索引:\"{0}\"超出可视元素索引范围";
    locale_strings[3012] = "此方法在Scroller组件内不可用!";
    locale_strings[3013] = "UIStage是GUI根容器，只能有一个此实例在显示列表中！";
    //socket 3100-3199
    locale_strings[3100] = "当前浏览器不支持WebSocket";
    locale_strings[3101] = "请先连接WebSocket";
    locale_strings[3102] = "请先设置type为二进制类型";
    //db 4000-4299
    locale_strings[4000] = "An Bone cannot be added as a child to itself or one of its children (or children's children, etc.)";
    locale_strings[4001] = "Abstract class can not be instantiated!";
    locale_strings[4002] = "Unnamed data!";
    locale_strings[4003] = "Nonsupport version!";
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
/**
 * @version Egret 2.4
 * @platform Web,Native
 * @includeExample egret/localStorage/localStorage.ts
 */
var egret;
(function (egret) {
    var localStorage;
    (function (localStorage) {
    })(localStorage = egret.localStorage || (egret.localStorage = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var PromiseObject = (function () {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function PromiseObject() {
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.onSuccessFunc = null;
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.onSuccessThisObject = null;
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.onErrorFunc = null;
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.onErrorThisObject = null;
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.downloadingSizeFunc = null;
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            this.downloadingSizeThisObject = null;
        }
        var d = __define,c=PromiseObject,p=c.prototype;
        /**
         *
         * @version Egret 2.4
         * @platform Web,Native
         */
        PromiseObject.create = function () {
            if (PromiseObject.promiseObjectList.length) {
                return PromiseObject.promiseObjectList.pop();
            }
            else {
                return new egret.PromiseObject();
            }
        };
        /**
         * @private
         *
         * @param args
         */
        p.onSuccess = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (this.onSuccessFunc) {
                this.onSuccessFunc.apply(this.onSuccessThisObject, args);
            }
            this.destroy();
        };
        /**
         * @private
         *
         * @param args
         */
        p.onError = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (this.onErrorFunc) {
                this.onErrorFunc.apply(this.onErrorThisObject, args);
            }
            this.destroy();
        };
        /**
         * @private
         *
         * @param args
         */
        p.downloadingSize = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            if (this.downloadingSizeFunc) {
                this.downloadingSizeFunc.apply(this.downloadingSizeThisObject, args);
            }
        };
        /**
         * @private
         *
         */
        p.destroy = function () {
            this.onSuccessFunc = undefined;
            this.onSuccessThisObject = undefined;
            this.onErrorFunc = undefined;
            this.onErrorThisObject = undefined;
            this.downloadingSizeFunc = undefined;
            this.downloadingSizeThisObject = undefined;
            PromiseObject.promiseObjectList.push(this);
        };
        /**
         * @private
         */
        PromiseObject.promiseObjectList = [];
        return PromiseObject;
    })();
    egret.PromiseObject = PromiseObject;
    egret.registerClass(PromiseObject,'egret.PromiseObject');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The HttpMethod class provides values that specify whether the HttpRequest object should use the POST method
     * or the GET method when sending data to a server.
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * HttpRequestMethod 类提供了一些值，这些值可指定在将数据发送到服务器时，
     * HttpRequest 对象应使用 POST 方法还是 GET 方法。
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     */
    var HttpMethod = (function () {
        function HttpMethod() {
        }
        var d = __define,c=HttpMethod,p=c.prototype;
        /**
         * @language en_US
         * Specifies that the HttpRequest object is a GET.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 HttpRequest 对象是一个 GET。
         * @version Egret 2.4
         * @platform Web,Native
         */
        HttpMethod.GET = "GET";
        /**
         * @language en_US
         * Specifies that the HttpRequest object is a POST.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示 HttpRequest 对象是一个 POST。
         * @version Egret 2.4
         * @platform Web,Native
         */
        HttpMethod.POST = "POST";
        return HttpMethod;
    })();
    egret.HttpMethod = HttpMethod;
    egret.registerClass(HttpMethod,'egret.HttpMethod');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The HttpResponseType class provides values that specify how downloaded data is received.
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * URLLoaderDataFormat 类提供了一些用于指定如何接收已下载数据的值。
     * @see egret.HttpRequest
     * @version Egret 2.4
     * @platform Web,Native
     */
    var HttpResponseType = (function () {
        function HttpResponseType() {
        }
        var d = __define,c=HttpResponseType,p=c.prototype;
        /**
         * @language en_US
         * Specifies that downloaded data is received as text. This is the default value of HttpRequest.responseType
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回字符串。HttpRequest.responseType属性的默认值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        HttpResponseType.TEXT = "text";
        /**
         * @language en_US
         * Specifies that downloaded data is received as raw binary data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回二进制的ArrayBuffer对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        HttpResponseType.ARRAY_BUFFER = "arraybuffer";
        return HttpResponseType;
    })();
    egret.HttpResponseType = HttpResponseType;
    egret.registerClass(HttpResponseType,'egret.HttpResponseType');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        if (DEBUG) {
            function isF(num) {
                return num % 1 !== 0;
            }
        }
        /**
         * @private
         */
        function unionArea(r1, r2) {
            var minX = r1.minX < r2.minX ? r1.minX : r2.minX;
            var minY = r1.minY < r2.minY ? r1.minY : r2.minY;
            var maxX = r1.maxX > r2.maxX ? r1.maxX : r2.maxX;
            var maxY = r1.maxY > r2.maxY ? r1.maxY : r2.maxY;
            return (maxX - minX) * (maxY - minY);
        }
        /**
         * @private
         * 脏矩形计算工具类
         */
        var DirtyRegion = (function () {
            function DirtyRegion() {
                /**
                 * @private
                 */
                this.dirtyList = [];
                /**
                 * @private
                 */
                this.hasClipRect = false;
                /**
                 * @private
                 */
                this.clipWidth = 0;
                /**
                 * @private
                 */
                this.clipHeight = 0;
                /**
                 * @private
                 */
                this.clipArea = 0;
                /**
                 * @private
                 */
                this.clipRectChanged = false;
                this.$dirtyRegionPolicy = egret.DirtyRegionPolicy.ON;
            }
            var d = __define,c=DirtyRegion,p=c.prototype;
            /**
             * @private
             * 设置剪裁边界，超过边界的节点将跳过绘制。
             */
            p.setClipRect = function (width, height) {
                this.hasClipRect = true;
                this.clipRectChanged = true;
                this.clipWidth = Math.ceil(width);
                this.clipHeight = Math.ceil(height);
                this.clipArea = this.clipWidth * this.clipHeight;
            };
            /**
             * @private
             * 添加一个脏矩形区域，返回是否添加成功，当矩形为空或者在屏幕之外时返回false。
             */
            p.addRegion = function (target) {
                var minX = target.minX, minY = target.minY, maxX = target.maxX, maxY = target.maxY;
                if (DEBUG) {
                    if (isF(minX) || isF(minY) || isF(maxX) || isF(maxY)) {
                        egret.log("addRegion error:", minX, minY, maxX, maxY);
                    }
                }
                if (this.hasClipRect) {
                    if (minX < 0) {
                        minX = 0;
                    }
                    if (minY < 0) {
                        minY = 0;
                    }
                    if (maxX > this.clipWidth) {
                        maxX = this.clipWidth;
                    }
                    if (maxY > this.clipHeight) {
                        maxY = this.clipHeight;
                    }
                }
                if (minX >= maxX || minY >= maxY) {
                    return false;
                }
                if (this.clipRectChanged) {
                    return true;
                }
                var dirtyList = this.dirtyList;
                var region = sys.Region.create();
                dirtyList.push(region.setTo(minX, minY, maxX, maxY));
                if (this.$dirtyRegionPolicy != egret.DirtyRegionPolicy.OFF) {
                    this.mergeDirtyList(dirtyList);
                }
                return true;
            };
            /**
             * @private
             */
            p.clear = function () {
                var dirtyList = this.dirtyList;
                var length = dirtyList.length;
                for (var i = 0; i < length; i++) {
                    sys.Region.release(dirtyList[i]);
                }
                dirtyList.length = 0;
            };
            /**
             * @private
             * 获取最终的脏矩形列表
             */
            p.getDirtyRegions = function () {
                var dirtyList = this.dirtyList;
                if (this.$dirtyRegionPolicy == egret.DirtyRegionPolicy.OFF || (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE && !egret["native"]["$supportCanvas" + ""])) {
                    this.clipRectChanged = true; //阻止所有的addRegion()
                    this.clear();
                    var region = sys.Region.create();
                    if (this.hasClipRect) {
                        dirtyList.push(region.setTo(0, 0, this.clipWidth, this.clipHeight));
                    }
                    else {
                        var bounds = this.displayList.root.$getOriginalBounds();
                        dirtyList.push(region.setTo(bounds.x, bounds.y, bounds.width, bounds.height));
                    }
                }
                else if (this.clipRectChanged) {
                    this.clipRectChanged = false;
                    this.clear();
                    var region = sys.Region.create();
                    dirtyList.push(region.setTo(0, 0, this.clipWidth, this.clipHeight));
                }
                else {
                    while (this.mergeDirtyList(dirtyList)) {
                    }
                }
                return this.dirtyList;
            };
            /**
             * @private
             * 合并脏矩形列表
             */
            p.mergeDirtyList = function (dirtyList) {
                var length = dirtyList.length;
                if (length < 2) {
                    return false;
                }
                var hasClipRect = this.hasClipRect;
                var bestDelta = length > 3 ? Number.POSITIVE_INFINITY : 0;
                var mergeA = 0;
                var mergeB = 0;
                var totalArea = 0;
                for (var i = 0; i < length - 1; i++) {
                    var regionA = dirtyList[i];
                    hasClipRect && (totalArea += regionA.area);
                    for (var j = i + 1; j < length; j++) {
                        var regionB = dirtyList[j];
                        var delta = unionArea(regionA, regionB) - regionA.area - regionB.area;
                        if (bestDelta > delta) {
                            mergeA = i;
                            mergeB = j;
                            bestDelta = delta;
                        }
                    }
                }
                if (hasClipRect && (totalArea / this.clipArea) > 0.95) {
                    this.clipRectChanged = true;
                }
                if (mergeA != mergeB) {
                    var region = dirtyList[mergeB];
                    dirtyList[mergeA].union(region);
                    sys.Region.release(region);
                    dirtyList.splice(mergeB, 1);
                    return true;
                }
                return false;
            };
            p.setDirtyRegionPolicy = function (policy) {
                this.$dirtyRegionPolicy = policy;
            };
            return DirtyRegion;
        })();
        sys.DirtyRegion = DirtyRegion;
        egret.registerClass(DirtyRegion,'egret.sys.DirtyRegion');
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Values for the dirty region policy
     * @version Egret 2.5
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 脏矩形策略常量。
     * @version Egret 2.5
     * @platform Web,Native
     */
    var DirtyRegionPolicy = (function () {
        function DirtyRegionPolicy() {
        }
        var d = __define,c=DirtyRegionPolicy,p=c.prototype;
        /**
         * @language en_US
         * Close automatic detection of dirty region
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 关闭自动脏矩形检测
         * @version Egret 2.5
         * @platform Web,Native
         */
        DirtyRegionPolicy.OFF = "off";
        /**
         * @language en_US
         * Open automatic detection of dirty region
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 开启自动脏矩形检测
         * @version Egret 2.5
         * @platform Web,Native
         */
        DirtyRegionPolicy.ON = "on";
        return DirtyRegionPolicy;
    })();
    egret.DirtyRegionPolicy = DirtyRegionPolicy;
    egret.registerClass(DirtyRegionPolicy,'egret.DirtyRegionPolicy');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var displayListPool = [];
        var blendModes = ["source-over", "lighter", "destination-out"];
        var defaultCompositeOp = "source-over";
        /**
         * @private
         * 显示列表
         */
        var DisplayList = (function (_super) {
            __extends(DisplayList, _super);
            /**
             * @private
             * 创建一个DisplayList对象
             */
            function DisplayList(root) {
                _super.call(this);
                /**
                 * @private
                 * 是否需要重绘
                 */
                this.$isDirty = false;
                /**
                 * @private
                 * 在舞台上的透明度
                 */
                this.$renderAlpha = 1;
                /**
                 * @private
                 * 相对于显示列表根节点或位图缓存根节点的矩阵对象
                 */
                this.$renderMatrix = new egret.Matrix();
                this.$ratioMatrix = new egret.Matrix();
                this.$ratioChanged = false;
                this.$pixelRatio = 1;
                /**
                 * @private
                 * 在显示列表根节点或位图缓存根节点上的显示区域
                 */
                this.$renderRegion = new sys.Region();
                /**
                 * @private
                 * 呈现绘制结果的目标画布
                 */
                this.surface = null;
                /**
                 * @private
                 */
                this.offsetX = 0;
                /**
                 * @private
                 */
                this.offsetY = 0;
                /**
                 * @private
                 */
                this.needRedraw = false;
                /**
                 * @private
                 */
                this.rootMatrix = new egret.Matrix();
                /**
                 * @private
                 * 显示对象的渲染节点发生改变时，把自身的IRenderable对象注册到此列表上。
                 */
                this.dirtyNodes = {};
                /**
                 * @private
                 */
                this.dirtyNodeList = [];
                /**
                 * @private
                 */
                this.dirtyList = null;
                /**
                 * @private
                 */
                this.dirtyRegion = new sys.DirtyRegion();
                /**
                 * @private
                 */
                this.sizeChanged = false;
                this.root = root;
                this.dirtyRegion.displayList = this;
            }
            var d = __define,c=DisplayList,p=c.prototype;
            /**
             * @private
             * 释放一个DisplayList实例到对象池
             */
            DisplayList.release = function (displayList) {
                sys.surfaceFactory.release(displayList.surface);
                egret.Matrix.release(displayList.$renderMatrix);
                egret.Matrix.release(displayList.$ratioMatrix);
                displayList.surface = null;
                displayList.renderContext = null;
                displayList.root = null;
                displayList.$renderMatrix = null;
                displayList.$ratioMatrix = null;
                displayList.needRedraw = false;
                displayList.$isDirty = false;
                displayListPool.push(displayList);
            };
            /**
             * @private
             * 从对象池中取出或创建一个新的DisplayList对象。
             */
            DisplayList.create = function (target) {
                var displayList = displayListPool.pop();
                if (!displayList) {
                    displayList = new egret.sys.DisplayList(target);
                }
                var surface = sys.surfaceFactory.create();
                if (!surface) {
                    return null;
                }
                displayList.surface = surface;
                displayList.renderContext = surface.renderContext;
                displayList.root = target;
                displayList.$renderMatrix = egret.Matrix.create();
                displayList.$renderMatrix.setTo(1, 0, 0, 1, 0, 0);
                displayList.$pixelRatio = 1;
                displayList.$ratioMatrix = egret.Matrix.create();
                displayList.$ratioMatrix.setTo(1, 0, 0, 1, 0, 0);
                displayList.needRedraw = true;
                displayList.$isDirty = true;
                return displayList;
            };
            /**
             * @private
             * 更新对象在舞台上的显示区域和透明度,返回显示区域是否发生改变。
             */
            p.$update = function () {
                var target = this.root;
                //当cache对象的显示列表已经加入dirtyList，对象又取消cache的时候，root为空
                if (target == null) {
                    return false;
                }
                target.$removeFlagsUp(768 /* Dirty */);
                this.$renderAlpha = target.$getConcatenatedAlpha();
                //必须在访问moved属性前调用以下两个方法，因为moved属性在以下两个方法内重置。
                var concatenatedMatrix = target.$getConcatenatedMatrix();
                var bounds = target.$getOriginalBounds();
                var displayList = target.$parentDisplayList;
                var pixelRatio = 1;
                if (displayList)
                    pixelRatio = displayList.$pixelRatio;
                else if (target.stage && target.stage.$displayList)
                    pixelRatio = target.stage.$displayList.$pixelRatio;
                this.setDevicePixelRatio(pixelRatio);
                var region = this.$renderRegion;
                if (this.needRedraw) {
                    this.updateDirtyRegions();
                }
                if (!displayList) {
                    region.setTo(0, 0, 0, 0);
                    region.moved = false;
                    return false;
                }
                if (!region.moved && !displayList.$ratioChanged) {
                    return false;
                }
                region.moved = false;
                var matrix = this.$renderMatrix;
                matrix.copyFrom(concatenatedMatrix);
                var root = displayList.root;
                if (root !== target.$stage) {
                    target.$getConcatenatedMatrixAt(root, matrix);
                }
                this.$ratioMatrix.$preMultiplyInto(matrix, matrix);
                region.updateRegion(bounds, matrix);
                return true;
            };
            /**
             * @private
             *
             * @param context
             */
            p.$render = function (context) {
                var data = this.surface;
                if (data) {
                    context.drawImage(data, this.offsetX, this.offsetY, data.width / this.$pixelRatio, data.height / this.$pixelRatio);
                }
            };
            /**
             * @private
             * 设置剪裁边界，不再绘制完整目标对象，画布尺寸由外部决定，超过边界的节点将跳过绘制。
             */
            p.setClipRect = function (width, height) {
                width *= this.$pixelRatio;
                height *= this.$pixelRatio;
                this.dirtyRegion.setClipRect(width, height);
                this.rootMatrix = null; //只有舞台画布才能设置ClipRect
                var surface = this.renderContext.surface;
                surface.width = width;
                surface.height = height;
                this.surface = surface;
            };
            /**
             * @private
             * 标记一个节点需要重新渲染
             */
            p.markDirty = function (node) {
                var key = node.$hashCode;
                if (this.dirtyNodes[key]) {
                    return;
                }
                this.dirtyNodes[key] = true;
                this.dirtyNodeList.push(node);
                if (!this.needRedraw) {
                    this.needRedraw = true;
                    var parentCache = this.root.$parentDisplayList;
                    if (parentCache) {
                        parentCache.markDirty(this);
                    }
                }
            };
            /**
             * @private
             * 更新节点属性并返回脏矩形列表。
             */
            p.updateDirtyRegions = function () {
                var nodeList = this.dirtyNodeList;
                this.dirtyNodeList = [];
                this.dirtyNodes = {};
                var dirtyRegion = this.dirtyRegion;
                var length = nodeList.length;
                for (var i = 0; i < length; i++) {
                    var node = nodeList[i];
                    var region = node.$renderRegion;
                    if (node.$renderAlpha > 0) {
                        if (dirtyRegion.addRegion(region)) {
                            node.$isDirty = true;
                        }
                    }
                    var moved = node.$update();
                    if (node.$renderAlpha > 0 && (moved || !node.$isDirty)) {
                        if (dirtyRegion.addRegion(region)) {
                            node.$isDirty = true;
                        }
                    }
                }
                this.dirtyList = dirtyRegion.getDirtyRegions();
                return this.dirtyList;
            };
            /**
             * @private
             * 绘制根节点显示对象到目标画布，返回draw的次数。
             */
            p.drawToSurface = function () {
                var m = this.rootMatrix;
                if (m) {
                    this.changeSurfaceSize();
                }
                var context = this.renderContext;
                //绘制脏矩形区域
                context.save();
                context.beginPath();
                if (m) {
                    context.setTransform(1, 0, 0, 1, -this.offsetX * this.$pixelRatio, -this.offsetY * this.$pixelRatio);
                }
                var dirtyList = this.dirtyList;
                var length = dirtyList.length;
                for (var i = 0; i < length; i++) {
                    var region = dirtyList[i];
                    context.clearRect(region.minX, region.minY, region.width, region.height);
                    context.rect(region.minX, region.minY, region.width, region.height);
                }
                context.clip();
                if (m) {
                    context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                //绘制显示对象
                var drawCalls = this.drawDisplayObject(this.root, context, dirtyList, m, null, null);
                //清除脏矩形区域
                context.restore();
                this.dirtyList = null;
                this.dirtyRegion.clear();
                this.needRedraw = false;
                this.$ratioChanged = false;
                return drawCalls;
            };
            /**
             * @private
             * 绘制一个显示对象
             */
            p.drawDisplayObject = function (displayObject, context, dirtyList, rootMatrix, displayList, clipRegion) {
                var drawCalls = 0;
                var node;
                var globalAlpha;
                if (displayList) {
                    if (displayList.needRedraw) {
                        drawCalls += displayList.drawToSurface();
                    }
                    node = displayList;
                    globalAlpha = 1; //这里不用读取displayList.$renderAlpha,因为它已经绘制到了displayList.surface的内部。
                }
                else if (displayObject.$renderRegion) {
                    node = displayObject;
                    globalAlpha = displayObject.$renderAlpha;
                }
                if (node) {
                    var renderRegion = node.$renderRegion;
                    if (clipRegion && !clipRegion.intersects(renderRegion)) {
                        node.$isDirty = false;
                    }
                    else if (!node.$isDirty) {
                        var l = dirtyList.length;
                        for (var j = 0; j < l; j++) {
                            if (renderRegion.intersects(dirtyList[j])) {
                                node.$isDirty = true;
                                break;
                            }
                        }
                    }
                    if (node.$isDirty) {
                        drawCalls++;
                        context.globalAlpha = globalAlpha;
                        var m = node.$renderMatrix;
                        if (rootMatrix) {
                            context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                            node.$render(context);
                            context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
                        }
                        else {
                            context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                            node.$render(context);
                        }
                        node.$isDirty = false;
                    }
                }
                if (displayList) {
                    return drawCalls;
                }
                var children = displayObject.$children;
                if (children) {
                    var length = children.length;
                    for (var i = 0; i < length; i++) {
                        var child = children[i];
                        if (!child.$visible || child.$alpha <= 0 || child.$maskedObject) {
                            child.$isDirty = false;
                            continue;
                        }
                        if (child.$blendMode !== 0 ||
                            (child.$mask && child.$mask.$parentDisplayList)) {
                            drawCalls += this.drawWithClip(child, context, dirtyList, rootMatrix, clipRegion);
                        }
                        else if (child.$scrollRect || child.$maskRect) {
                            drawCalls += this.drawWithScrollRect(child, context, dirtyList, rootMatrix, clipRegion);
                        }
                        else {
                            if (child["isFPS"]) {
                                this.drawDisplayObject(child, context, dirtyList, rootMatrix, child.$displayList, clipRegion);
                            }
                            else {
                                drawCalls += this.drawDisplayObject(child, context, dirtyList, rootMatrix, child.$displayList, clipRegion);
                            }
                        }
                    }
                }
                return drawCalls;
            };
            /**
             * @private
             */
            p.drawWithClip = function (displayObject, context, dirtyList, rootMatrix, clipRegion) {
                var drawCalls = 0;
                var hasBlendMode = (displayObject.$blendMode !== 0);
                if (hasBlendMode) {
                    var compositeOp = blendModes[displayObject.$blendMode];
                    if (!compositeOp) {
                        compositeOp = defaultCompositeOp;
                    }
                }
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                var mask = displayObject.$mask;
                if (mask && !mask.$parentDisplayList) {
                    mask = null; //如果遮罩不在显示列表中，放弃绘制遮罩。
                }
                //计算scrollRect和mask的clip区域是否需要绘制，不需要就直接返回，跳过所有子项的遍历。
                var maskRegion;
                var displayMatrix = egret.Matrix.create();
                displayMatrix.copyFrom(displayObject.$getConcatenatedMatrix());
                var root = displayObject.$parentDisplayList.root;
                var invertedMatrix;
                if (root !== displayObject.$stage) {
                    invertedMatrix = root.$getInvertedConcatenatedMatrix();
                    invertedMatrix.$preMultiplyInto(displayMatrix, displayMatrix);
                }
                this.$ratioMatrix.$preMultiplyInto(displayMatrix, displayMatrix);
                if (mask) {
                    var bounds = mask.$getOriginalBounds();
                    maskRegion = sys.Region.create();
                    var m = egret.Matrix.create();
                    m.copyFrom(mask.$getConcatenatedMatrix());
                    if (invertedMatrix) {
                        invertedMatrix.$preMultiplyInto(m, m);
                    }
                    this.$ratioMatrix.$preMultiplyInto(m, m);
                    maskRegion.updateRegion(bounds, m);
                    egret.Matrix.release(m);
                }
                var region;
                if (scrollRect) {
                    region = sys.Region.create();
                    region.updateRegion(scrollRect, displayMatrix);
                }
                if (region && maskRegion) {
                    region.intersect(maskRegion);
                    sys.Region.release(maskRegion);
                }
                else if (!region && maskRegion) {
                    region = maskRegion;
                }
                if (region) {
                    if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                        sys.Region.release(region);
                        egret.Matrix.release(displayMatrix);
                        return drawCalls;
                    }
                }
                else {
                    region = sys.Region.create();
                    bounds = displayObject.$getOriginalBounds();
                    region.updateRegion(bounds, displayMatrix);
                }
                var found = false;
                var l = dirtyList.length;
                for (var j = 0; j < l; j++) {
                    if (region.intersects(dirtyList[j])) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    sys.Region.release(region);
                    egret.Matrix.release(displayMatrix);
                    return drawCalls;
                }
                //绘制显示对象自身，若有scrollRect，应用clip
                var displayContext = this.createRenderContext(region.width, region.height);
                if (!displayContext) {
                    drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, rootMatrix, displayObject.$displayList, clipRegion);
                    sys.Region.release(region);
                    egret.Matrix.release(displayMatrix);
                    return drawCalls;
                }
                if (scrollRect) {
                    var m = displayMatrix;
                    displayContext.setTransform(m.a, m.b, m.c, m.d, m.tx - region.minX, m.ty - region.minY);
                    displayContext.beginPath();
                    displayContext.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
                    displayContext.clip();
                }
                displayContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                var rootM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                drawCalls += this.drawDisplayObject(displayObject, displayContext, dirtyList, rootM, displayObject.$displayList, region);
                egret.Matrix.release(rootM);
                //绘制遮罩
                if (mask) {
                    var maskContext = this.createRenderContext(region.width, region.height);
                    if (!maskContext) {
                        drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, rootMatrix, displayObject.$displayList, clipRegion);
                        sys.surfaceFactory.release(displayContext.surface);
                        sys.Region.release(region);
                        egret.Matrix.release(displayMatrix);
                        return drawCalls;
                    }
                    maskContext.setTransform(1, 0, 0, 1, -region.minX, -region.minY);
                    rootM = egret.Matrix.create().setTo(1, 0, 0, 1, -region.minX, -region.minY);
                    var calls = this.drawDisplayObject(mask, maskContext, dirtyList, rootM, mask.$displayList, region);
                    egret.Matrix.release(rootM);
                    if (calls > 0) {
                        drawCalls += calls;
                        displayContext.globalCompositeOperation = "destination-in";
                        displayContext.setTransform(1, 0, 0, 1, 0, 0);
                        displayContext.globalAlpha = 1;
                        displayContext.drawImage(maskContext.surface, 0, 0);
                    }
                    sys.surfaceFactory.release(maskContext.surface);
                }
                //绘制结果到屏幕
                if (drawCalls > 0) {
                    drawCalls++;
                    if (hasBlendMode) {
                        context.globalCompositeOperation = compositeOp;
                    }
                    context.globalAlpha = 1;
                    if (rootMatrix) {
                        context.translate(region.minX, region.minY);
                        context.drawImage(displayContext.surface, 0, 0);
                        context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
                    }
                    else {
                        context.setTransform(1, 0, 0, 1, region.minX, region.minY);
                        context.drawImage(displayContext.surface, 0, 0);
                    }
                    if (hasBlendMode) {
                        context.globalCompositeOperation = defaultCompositeOp;
                    }
                }
                sys.surfaceFactory.release(displayContext.surface);
                sys.Region.release(region);
                egret.Matrix.release(displayMatrix);
                return drawCalls;
            };
            /**
             * @private
             */
            p.drawWithScrollRect = function (displayObject, context, dirtyList, rootMatrix, clipRegion) {
                var drawCalls = 0;
                var scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
                if (scrollRect.width == 0 || scrollRect.height == 0) {
                    return drawCalls;
                }
                var m = egret.Matrix.create();
                m.copyFrom(displayObject.$getConcatenatedMatrix());
                var root = displayObject.$parentDisplayList.root;
                if (root !== displayObject.$stage) {
                    root.$getInvertedConcatenatedMatrix().$preMultiplyInto(m, m);
                }
                this.$ratioMatrix.$preMultiplyInto(m, m);
                var region = sys.Region.create();
                if (!scrollRect.isEmpty()) {
                    region.updateRegion(scrollRect, m);
                }
                if (region.isEmpty() || (clipRegion && !clipRegion.intersects(region))) {
                    sys.Region.release(region);
                    egret.Matrix.release(m);
                    return drawCalls;
                }
                var found = false;
                var l = dirtyList.length;
                for (var j = 0; j < l; j++) {
                    if (region.intersects(dirtyList[j])) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    sys.Region.release(region);
                    egret.Matrix.release(m);
                    return drawCalls;
                }
                //绘制显示对象自身
                context.save();
                if (rootMatrix) {
                    context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
                    context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                else {
                    context.setTransform(m.a, m.b, m.c, m.d, m.tx, m.ty);
                }
                context.beginPath();
                context.rect(scrollRect.x, scrollRect.y, scrollRect.width, scrollRect.height);
                context.clip();
                if (rootMatrix) {
                    context.setTransform(rootMatrix.a, rootMatrix.b, rootMatrix.c, rootMatrix.d, rootMatrix.tx * this.$pixelRatio, rootMatrix.ty * this.$pixelRatio);
                }
                drawCalls += this.drawDisplayObject(displayObject, context, dirtyList, rootMatrix, displayObject.$displayList, region);
                context.restore();
                sys.Region.release(region);
                egret.Matrix.release(m);
                return drawCalls;
            };
            /**
             * @private
             */
            p.createRenderContext = function (width, height) {
                var surface = sys.surfaceFactory.create(true);
                if (!surface) {
                    return null;
                }
                if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                    //在chrome里，小等于256*256的canvas会不启用GPU加速。
                    surface.width = Math.max(257, width);
                    surface.height = Math.max(257, height);
                }
                else {
                    surface.width = width;
                    surface.height = height;
                }
                return surface.renderContext;
            };
            /**
             * @private
             * 改变画布的尺寸，由于画布尺寸修改会清空原始画布。所以这里将原始画布绘制到一个新画布上，再与原始画布交换。
             */
            p.changeSurfaceSize = function () {
                var root = this.root;
                var oldOffsetX = this.offsetX;
                var oldOffsetY = this.offsetY;
                var bounds = this.root.$getOriginalBounds();
                var scaleX = this.$pixelRatio;
                var scaleY = this.$pixelRatio;
                this.offsetX = bounds.x;
                this.offsetY = bounds.y;
                var oldContext = this.renderContext;
                var oldSurface = oldContext.surface;
                if (!this.sizeChanged) {
                    this.sizeChanged = true;
                    oldSurface.width = Math.max(bounds.width * scaleX, 257);
                    oldSurface.height = Math.max(bounds.height * scaleY, 257);
                }
                else {
                    var newContext = sys.sharedRenderContext;
                    var newSurface = newContext.surface;
                    sys.sharedRenderContext = oldContext;
                    this.renderContext = newContext;
                    this.surface = newSurface;
                    newSurface.width = Math.max(bounds.width * scaleX, 257);
                    newSurface.height = Math.max(bounds.height * scaleY, 257);
                    //if (bounds.width !== 0 && bounds.height !== 0) {
                    newContext.setTransform(1, 0, 0, 1, 0, 0);
                    newContext.drawImage(oldSurface, (oldOffsetX - this.offsetX) * scaleX, (oldOffsetY - this.offsetY) * scaleY);
                    //}
                    if (egret.Capabilities.runtimeType != egret.RuntimeType.NATIVE) {
                        oldSurface.height = 1;
                        oldSurface.width = 1;
                    }
                }
                this.rootMatrix.setTo(1, 0, 0, 1, -this.offsetX, -this.offsetY);
                this.renderContext.setTransform(1, 0, 0, 1, -bounds.x, -bounds.y);
            };
            p.setDevicePixelRatio = function (ratio) {
                if (ratio === void 0) { ratio = 1; }
                if (this.$pixelRatio == ratio && this.$ratioMatrix)
                    return;
                if (!this.$ratioMatrix)
                    this.$ratioMatrix = egret.Matrix.create();
                this.$ratioChanged = true;
                this.$pixelRatio = ratio;
                this.$ratioMatrix.setTo(ratio, 0, 0, ratio, 0, 0);
                this.root.$invalidate(true);
            };
            p.setDirtyRegionPolicy = function (policy) {
                //todo 这里还可以做更多优化
                this.dirtyRegion.setDirtyRegionPolicy(policy);
            };
            return DisplayList;
        })(egret.HashObject);
        sys.DisplayList = DisplayList;
        egret.registerClass(DisplayList,'egret.sys.DisplayList',["egret.sys.Renderable"]);
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        /**
         * @private
         * @param value
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        function isUndefined(value) {
            return typeof value === "undefined";
        }
        sys.isUndefined = isUndefined;
        /**
         * @private
         * @param value
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        function getNumber(value) {
            if (DEBUG) {
                if (isNaN(value)) {
                    egret.sys.tr(1013);
                }
            }
            return +value || 0;
            ;
        }
        sys.getNumber = getNumber;
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     * OrientationMode 类为舞台初始旋转模式提供值。
     */
    var OrientationMode = (function () {
        function OrientationMode() {
        }
        var d = __define,c=OrientationMode,p=c.prototype;
        /**
         * @private
         * 适配屏幕
         */
        OrientationMode.AUTO = "auto";
        /**
         * @private
         * 默认竖屏
         */
        OrientationMode.PORTRAIT = "portrait";
        /**
         * @private
         * 默认横屏，舞台顺时针旋转90度
         */
        OrientationMode.LANDSCAPE = "landscape";
        /**
         * @private
         * 默认横屏，舞台逆时针旋转90度
         */
        OrientationMode.LANDSCAPE_FLIPPED = "landscapeFlipped";
        return OrientationMode;
    })();
    egret.OrientationMode = OrientationMode;
    egret.registerClass(OrientationMode,'egret.OrientationMode');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
/// <reference path="../display/Sprite.ts" />
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        /**
         * @private
         * Egret播放器
         */
        var Player = (function (_super) {
            __extends(Player, _super);
            /**
             * @private
             * 实例化一个播放器对象。
             */
            function Player(context, stage, entryClassName) {
                _super.call(this);
                /**
                 * @private
                 */
                this.isPlaying = false;
                if (DEBUG && !context) {
                    egret.$error(1003, "context");
                }
                this.entryClassName = entryClassName;
                this.stage = stage;
                this.screenDisplayList = this.createDisplayList(stage, context);
                this.showFPS = false;
                this.showLog = false;
                this._showPaintRect = false;
                this.stageDisplayList = null;
                this.paintList = [];
                this.displayFPS = displayFPS;
                this.showPaintRect = showPaintRect;
                this.drawPaintRect = drawPaintRect;
                this.drawDirtyRect = drawDirtyRect;
            }
            var d = __define,c=Player,p=c.prototype;
            /**
             * @private
             */
            p.createDisplayList = function (stage, context) {
                var displayList = new sys.DisplayList(stage);
                displayList.renderContext = context;
                stage.$displayList = displayList;
                displayList.setClipRect(stage.$stageWidth, stage.$stageHeight);
                return displayList;
            };
            /**
             * @private
             * 启动播放器
             */
            p.start = function () {
                if (this.isPlaying || !this.stage) {
                    return;
                }
                sys.$TempStage = sys.$TempStage || this.stage;
                this.isPlaying = true;
                if (!this.root) {
                    this.initialize();
                }
                sys.$ticker.$addPlayer(this);
            };
            /**
             * @private
             *
             */
            p.initialize = function () {
                var rootClass;
                if (this.entryClassName) {
                    rootClass = egret.getDefinitionByName(this.entryClassName);
                }
                if (rootClass) {
                    var rootContainer = new rootClass();
                    this.root = rootContainer;
                    if (rootContainer instanceof egret.DisplayObject) {
                        this.stage.addChild(rootContainer);
                    }
                    else {
                        DEBUG && egret.$error(1002, this.entryClassName);
                    }
                }
                else {
                    DEBUG && egret.$error(1001, this.entryClassName);
                }
            };
            /**
             * @private
             * 停止播放器，停止后将不能重新启动。
             */
            p.stop = function () {
                this.pause();
                this.stage = null;
            };
            /**
             * @private
             * 暂停播放器，后续可以通过调用start()重新启动播放器。
             */
            p.pause = function () {
                if (!this.isPlaying) {
                    return;
                }
                this.isPlaying = false;
                sys.$ticker.$removePlayer(this);
            };
            /**
             * @private
             * 渲染屏幕
             */
            p.$render = function (triggerByFrame, costTicker) {
                if (this.showFPS || this.showLog) {
                    this.stage.addChild(this.fpsDisplay);
                }
                this.callLaters();
                this.callLaterAsyncs();
                var stage = this.stage;
                var t = egret.getTimer();
                var dirtyList = stage.$displayList.updateDirtyRegions();
                var t1 = egret.getTimer();
                var drawCalls = 0;
                if (dirtyList.length > 0) {
                    dirtyList = dirtyList.concat();
                    drawCalls = stage.$displayList.drawToSurface();
                }
                if (this._showPaintRect) {
                    this.drawPaintRect(dirtyList);
                }
                var t2 = egret.getTimer();
                if (triggerByFrame && this.showFPS) {
                    var dirtyRatio = 0;
                    if (drawCalls > 0) {
                        var length = dirtyList.length;
                        var dirtyArea = 0;
                        for (var i = 0; i < length; i++) {
                            dirtyArea += dirtyList[i].area;
                        }
                        dirtyRatio = Math.ceil(dirtyArea * 1000 / (stage.stageWidth * stage.stageHeight)) / 10;
                    }
                    this.fpsDisplay.update(drawCalls, dirtyRatio, t1 - t, t2 - t1, costTicker);
                }
            };
            /**
             * @private
             *
             */
            p.callLaters = function () {
                if (egret.$callLaterFunctionList.length > 0) {
                    var functionList = egret.$callLaterFunctionList;
                    egret.$callLaterFunctionList = [];
                    var thisList = egret.$callLaterThisList;
                    egret.$callLaterThisList = [];
                    var argsList = egret.$callLaterArgsList;
                    egret.$callLaterArgsList = [];
                }
                if (functionList) {
                    var length = functionList.length;
                    for (var i = 0; i < length; i++) {
                        var func = functionList[i];
                        if (func != null) {
                            func.apply(thisList[i], argsList[i]);
                        }
                    }
                }
            };
            /**
             * @private
             *
             */
            p.callLaterAsyncs = function () {
                if (egret.$callAsyncFunctionList.length > 0) {
                    var locCallAsyncFunctionList = egret.$callAsyncFunctionList;
                    var locCallAsyncThisList = egret.$callAsyncThisList;
                    var locCallAsyncArgsList = egret.$callAsyncArgsList;
                    egret.$callAsyncFunctionList = [];
                    egret.$callAsyncThisList = [];
                    egret.$callAsyncArgsList = [];
                    for (var i = 0; i < locCallAsyncFunctionList.length; i++) {
                        var func = locCallAsyncFunctionList[i];
                        if (func != null) {
                            func.apply(locCallAsyncThisList[i], locCallAsyncArgsList[i]);
                        }
                    }
                }
            };
            /**
             * @private
             * 更新舞台尺寸
             * @param stageWidth 舞台宽度（以像素为单位）
             * @param stageHeight 舞台高度（以像素为单位）
             */
            p.updateStageSize = function (stageWidth, stageHeight, pixelRatio) {
                if (pixelRatio === void 0) { pixelRatio = 1; }
                var stage = this.stage;
                if (stageWidth !== stage.$stageWidth || stageHeight !== stage.$stageHeight || this.screenDisplayList.$pixelRatio !== pixelRatio) {
                    stage.$stageWidth = stageWidth;
                    stage.$stageHeight = stageHeight;
                    this.screenDisplayList.setDevicePixelRatio(pixelRatio);
                    this.screenDisplayList.setClipRect(stageWidth, stageHeight);
                    if (this.stageDisplayList) {
                        this.stageDisplayList.setDevicePixelRatio(pixelRatio);
                        this.stageDisplayList.setClipRect(stageWidth, stageHeight);
                    }
                    stage.dispatchEventWith(egret.Event.RESIZE);
                    stage.$invalidate(true);
                }
            };
            return Player;
        })(egret.HashObject);
        sys.Player = Player;
        egret.registerClass(Player,'egret.sys.Player');
        var infoLines = [];
        var fpsDisplay;
        var fpsStyle;
        sys.$logToFPS = function (info) {
            if (!fpsDisplay) {
                infoLines.push(info);
                return;
            }
            fpsDisplay.updateInfo(info);
        };
        function displayFPS(showFPS, showLog, logFilter, styles) {
            if (showLog) {
                egret.log = function () {
                    var length = arguments.length;
                    var info = "";
                    for (var i = 0; i < length; i++) {
                        info += arguments[i] + " ";
                    }
                    sys.$logToFPS(info);
                    console.log.apply(console, toArray(arguments));
                };
            }
            fpsStyle = sys.isUndefined(styles) ? {} : styles;
            showLog = !!showLog;
            this.showFPS = !!showFPS;
            this.showLog = showLog;
            if (!this.fpsDisplay) {
                var x = sys.isUndefined(styles["x"]) ? 0 : styles["x"];
                var y = sys.isUndefined(styles["y"]) ? 0 : styles["y"];
                fpsDisplay = this.fpsDisplay = new FPS(this.stage, showFPS, showLog, logFilter, styles);
                fpsDisplay.x = x;
                fpsDisplay.y = y;
                var length = infoLines.length;
                for (var i = 0; i < length; i++) {
                    fpsDisplay.updateInfo(infoLines[i]);
                }
                infoLines = null;
            }
        }
        function showPaintRect(value) {
            value = !!value;
            if (this._showPaintRect == value) {
                return;
            }
            this._showPaintRect = value;
            if (value) {
                if (!this.stageDisplayList) {
                    this.stageDisplayList = sys.DisplayList.create(this.stage);
                }
                this.stage.$displayList = this.stageDisplayList;
            }
            else {
                this.stage.$displayList = this.screenDisplayList;
            }
        }
        function drawPaintRect(dirtyList) {
            var length = dirtyList.length;
            var list = [];
            for (var i = 0; i < length; i++) {
                var region = dirtyList[i];
                list[i] = [region.minX, region.minY, region.width, region.height];
                region.width -= 1;
                region.height -= 1;
            }
            var repaintList = this.paintList;
            repaintList.push(list);
            if (repaintList.length > 1) {
                repaintList.shift();
            }
            var context = this.screenDisplayList.renderContext;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, context.surface.width, context.surface.height);
            context.drawImage(this.stageDisplayList.surface, 0, 0);
            length = repaintList.length;
            for (i = 0; i < length; i++) {
                list = repaintList[i];
                for (var j = list.length - 1; j >= 0; j--) {
                    var r = list[j];
                    this.drawDirtyRect(r[0], r[1], r[2], r[3], context);
                }
            }
            context.save();
            context.beginPath();
            var length = dirtyList.length;
            for (var i = 0; i < length; i++) {
                var region = dirtyList[i];
                context.clearRect(region.minX, region.minY, region.width, region.height);
                context.rect(region.minX, region.minY, region.width, region.height);
            }
            context.clip();
            context.drawImage(this.stageDisplayList.surface, 0, 0);
            context.restore();
        }
        /**
         * 绘制一个脏矩形显示区域，在显示重绘区功能开启时调用。
         */
        function drawDirtyRect(x, y, width, height, context) {
            context.strokeStyle = 'rgb(255,0,0)';
            context.lineWidth = 5;
            context.strokeRect(x - 0.5, y - 0.5, width, height);
        }
        /**
         * FPS显示对象
         */
        FPS = (function (_super) {
            __extends(FPSImpl, _super);
            function FPSImpl(stage, showFPS, showLog, logFilter, styles) {
                _super.call(this);
                this["isFPS"] = true;
                this.infoLines = [];
                this.totalTime = 0;
                this.totalTick = 0;
                this.lastTime = 0;
                this.drawCalls = 0;
                this.dirtyRatio = 0;
                this.costDirty = 0;
                this.costRender = 0;
                this.costTicker = 0;
                this._stage = stage;
                this.showFPS = showFPS;
                this.showLog = showLog;
                this.logFilter = logFilter;
                this.touchChildren = false;
                this.touchEnabled = false;
                this.styles = styles;
                this.createDisplay();
                try {
                    var logFilterRegExp = logFilter ? new RegExp(logFilter) : null;
                }
                catch (e) {
                    egret.log(e);
                }
                this.filter = function (message) {
                    if (logFilterRegExp)
                        return logFilterRegExp.test(message);
                    return !logFilter || message.indexOf(logFilter) == 0;
                };
            }
            FPSImpl.prototype.createDisplay = function () {
                this.shape = new egret.Shape();
                this.addChild(this.shape);
                var textField = new egret.TextField();
                textField.size = egret.sys.isUndefined(this.styles["size"]) ? 24 : parseInt(this.styles["size"]);
                this.addChild(textField);
                this.textField = textField;
                textField.textColor = egret.sys.isUndefined(this.styles["textColor"]) ? 0x00c200 : parseInt(this.styles["textColor"]);
                textField.fontFamily = "monospace";
                textField.x = 10;
                textField.y = 10;
                var textField = new egret.TextField();
                this.infoText = textField;
                this.addChild(textField);
                textField.textColor = egret.sys.isUndefined(this.styles["textColor"]) ? 0x00c200 : parseInt(this.styles["textColor"]);
                textField.fontFamily = "monospace";
                textField.x = 10;
                textField.size = egret.sys.isUndefined(this.styles["size"]) ? 12 : this.styles["size"] / 2;
                textField.y = 10;
            };
            FPSImpl.prototype.update = function (drawCalls, dirtyRatio, costDirty, costRender, costTicker) {
                var current = egret.getTimer();
                this.totalTime += current - this.lastTime;
                this.lastTime = current;
                this.totalTick++;
                this.drawCalls += drawCalls;
                this.dirtyRatio += dirtyRatio;
                this.costDirty += costDirty;
                this.costRender += costRender;
                this.costTicker += costTicker;
                if (this.totalTime > 500) {
                    var lastFPS = Math.round(this.totalTick * 1000 / this.totalTime);
                    var lastDrawCalls = Math.round(this.drawCalls / this.totalTick);
                    var lastDirtyRatio = Math.round(this.dirtyRatio / this.totalTick);
                    var lastCostDirty = Math.round(this.costDirty / this.totalTick);
                    var lastCostRender = Math.round(this.costRender / this.totalTick);
                    var lastCostTicker = Math.round(this.costTicker / this.totalTick);
                    var text = "FPS: " + lastFPS + "\nDraw: " + lastDrawCalls + "," + lastDirtyRatio + "%\nCost: " + lastCostTicker + "," + lastCostDirty + "," + lastCostRender;
                    if (this.textField.text != text) {
                        this.textField.text = text;
                        this.updateLayout();
                    }
                    this.totalTick = 0;
                    this.totalTime = this.totalTime % 500;
                    this.drawCalls = 0;
                    this.dirtyRatio = 0;
                    this.costDirty = 0;
                    this.costRender = 0;
                    this.costTicker = 0;
                }
            };
            /**
             * 插入一条日志信息
             */
            FPSImpl.prototype.updateInfo = function (info) {
                if (!this.showLog) {
                    return;
                }
                if (!this.filter(info)) {
                    return;
                }
                var lines = this.infoLines;
                if (info) {
                    lines.push(info);
                }
                this.infoText.width = NaN;
                this.infoText.text = lines.join("\n");
                if (this._stage.stageHeight > 0) {
                    if (this.infoText.textWidth > this._stage.stageWidth - 20) {
                        this.infoText.width = this._stage.stageWidth - 20;
                    }
                    while (this.infoText.textHeight > this._stage.stageHeight - 20) {
                        lines.shift();
                        this.infoText.text = lines.join("\n");
                    }
                }
                this.updateLayout();
            };
            FPSImpl.prototype.updateLayout = function () {
                if (this.showFPS) {
                    this.infoText.y = this.textField.height + 20;
                }
                if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
                    return;
                }
                var g = this.shape.$graphics.$renderContext;
                g.clear();
                g.fillStyle = "rgba(68,68,68," + (this.styles["bgAlpha"] || 0.9) + ")";
                g.fillRect(0, 0, Math.max(160, this.width + 20), this.height + 20);
            };
            return FPSImpl;
        })(egret.Sprite);
        function toArray(argument) {
            var args = [];
            for (var i = 0; i < argument.length; i++) {
                args.push(argument[i]);
            }
            return args;
        }
        egret.warn = function () {
            console.warn.apply(console, toArray(arguments));
        };
        egret.error = function () {
            console.error.apply(console, toArray(arguments));
        };
        egret.assert = function () {
            console.assert.apply(console, toArray(arguments));
        };
        egret.log = function () {
            console.log.apply(console, toArray(arguments));
        };
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        var regionPool = [];
        /**
         * @private
         */
        var Region = (function () {
            function Region() {
                /**
                 * @private
                 */
                this.minX = 0;
                /**
                 * @private
                 */
                this.minY = 0;
                /**
                 * @private
                 */
                this.maxX = 0;
                /**
                 * @private
                 */
                this.maxY = 0;
                /**
                 * @private
                 */
                this.width = 0;
                /**
                 * @private
                 */
                this.height = 0;
                /**
                 * @private
                 */
                this.area = 0;
                /**
                 * @private
                 * 是否发生移动
                 */
                this.moved = false;
            }
            var d = __define,c=Region,p=c.prototype;
            /**
             * @private
             * 释放一个Region实例到对象池
             */
            Region.release = function (region) {
                regionPool.push(region);
            };
            /**
             * @private
             * 从对象池中取出或创建一个新的Region对象。
             * 建议对于一次性使用的对象，均使用此方法创建，而不是直接new一个。
             * 使用完后调用对应的release()静态方法回收对象，能有效减少对象创建数量造成的性能开销。
             */
            Region.create = function () {
                var region = regionPool.pop();
                if (!region) {
                    region = new Region();
                }
                return region;
            };
            /**
             * @private
             */
            p.setTo = function (minX, minY, maxX, maxY) {
                this.minX = minX;
                this.minY = minY;
                this.maxX = maxX;
                this.maxY = maxY;
                this.updateArea();
                return this;
            };
            /**
             * @private
             */
            p.updateArea = function () {
                this.width = this.maxX - this.minX;
                this.height = this.maxY - this.minY;
                this.area = this.width * this.height;
            };
            /**
             * @private
             * 注意！由于性能优化，此方法不判断自身是否为空，必须在外部确认自身和目标区域都不为空再调用合并。否则结果始终从0，0点开始。
             */
            p.union = function (target) {
                if (this.minX > target.minX) {
                    this.minX = target.minX;
                }
                if (this.minY > target.minY) {
                    this.minY = target.minY;
                }
                if (this.maxX < target.maxX) {
                    this.maxX = target.maxX;
                }
                if (this.maxY < target.maxY) {
                    this.maxY = target.maxY;
                }
                this.updateArea();
            };
            /**
             * @private
             * 注意！由于性能优化，此方法不判断自身是否为空，必须在外部确认自身和目标区域都不为空再调用合并。否则结果始终从0，0点开始。
             */
            p.intersect = function (target) {
                if (this.minX < target.minX) {
                    this.minX = target.minX;
                }
                if (this.maxX > target.maxX) {
                    this.maxX = target.maxX;
                }
                if (this.minX >= this.maxX) {
                    this.setEmpty();
                    return;
                }
                if (this.minY < target.minY) {
                    this.minY = target.minY;
                }
                if (this.maxY > target.maxY) {
                    this.maxY = target.maxY;
                }
                if (this.minY >= this.maxY) {
                    this.setEmpty();
                    return;
                }
                this.updateArea();
            };
            /**
             * @private
             */
            p.setEmpty = function () {
                this.minX = 0;
                this.minY = 0;
                this.maxX = 0;
                this.maxY = 0;
                this.width = 0;
                this.height = 0;
                this.area = 0;
            };
            /**
             * @private
             * 确定此 Region 对象是否为空。
             */
            p.isEmpty = function () {
                return this.width <= 0 || this.height <= 0;
            };
            /**
             * @private
             */
            p.intersects = function (target) {
                if (this.isEmpty()) {
                    return false;
                }
                var max = this.minX > target.minX ? this.minX : target.minX;
                var min = this.maxX < target.maxX ? this.maxX : target.maxX;
                if (max > min) {
                    return false;
                }
                max = this.minY > target.minY ? this.minY : target.minY;
                min = this.maxY < target.maxY ? this.maxY : target.maxY;
                return max <= min;
            };
            /**
             * @private
             */
            p.updateRegion = function (bounds, matrix) {
                //if(bounds.width == 0 || bounds.height == 0) {
                //    //todo 理论上应该是空
                //    this.setEmpty();
                //    return;
                //}
                var m = matrix;
                var a = m.a;
                var b = m.b;
                var c = m.c;
                var d = m.d;
                var tx = m.tx;
                var ty = m.ty;
                var x = bounds.x;
                var y = bounds.y;
                var xMax = x + bounds.width;
                var yMax = y + bounds.height;
                var minX, minY, maxX, maxY;
                //优化，通常情况下不缩放旋转的对象占多数，直接加上偏移量即可。
                if (a == 1.0 && b == 0.0 && c == 0.0 && d == 1.0) {
                    minX = Math.floor(x + tx) - 1;
                    minY = Math.floor(y + ty) - 1;
                    maxX = Math.ceil(xMax + tx) + 1;
                    maxY = Math.ceil(yMax + ty) + 1;
                }
                else {
                    var x0 = a * x + c * y + tx;
                    var y0 = b * x + d * y + ty;
                    var x1 = a * xMax + c * y + tx;
                    var y1 = b * xMax + d * y + ty;
                    var x2 = a * xMax + c * yMax + tx;
                    var y2 = b * xMax + d * yMax + ty;
                    var x3 = a * x + c * yMax + tx;
                    var y3 = b * x + d * yMax + ty;
                    var tmp = 0;
                    if (x0 > x1) {
                        tmp = x0;
                        x0 = x1;
                        x1 = tmp;
                    }
                    if (x2 > x3) {
                        tmp = x2;
                        x2 = x3;
                        x3 = tmp;
                    }
                    minX = Math.floor(x0 < x2 ? x0 : x2) - 1;
                    maxX = Math.ceil(x1 > x3 ? x1 : x3) + 1;
                    if (y0 > y1) {
                        tmp = y0;
                        y0 = y1;
                        y1 = tmp;
                    }
                    if (y2 > y3) {
                        tmp = y2;
                        y2 = y3;
                        y3 = tmp;
                    }
                    minY = Math.floor(y0 < y2 ? y0 : y2) - 1;
                    maxY = Math.ceil(y1 > y3 ? y1 : y3) + 1;
                }
                this.minX = minX;
                this.minY = minY;
                this.maxX = maxX;
                this.maxY = maxY;
                this.width = maxX - minX;
                this.height = maxY - minY;
                this.area = this.width * this.height;
            };
            return Region;
        })();
        sys.Region = Region;
        egret.registerClass(Region,'egret.sys.Region');
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        /**
         * @private
         * 屏幕适配器默认实现，开发者可以实现自定义规则的屏幕适配器。并在初始化加载时将适配器的实例赋值给egret.sys.screenAdapter上，从而替换掉默认适配器。
         */
        var ScreenAdapter = (function (_super) {
            __extends(ScreenAdapter, _super);
            /**
             * @private
             */
            function ScreenAdapter() {
                _super.call(this);
            }
            var d = __define,c=ScreenAdapter,p=c.prototype;
            /**
             * @private
             * 计算舞台显示尺寸
             * @param scaleMode 当前的缩放模式
             * @param screenWidth 播放器视口宽度
             * @param screenHeight 播放器视口高度
             * @param contentWidth 初始化内容宽度
             * @param contentHeight 初始化内容高度
             */
            p.calculateStageSize = function (scaleMode, screenWidth, screenHeight, contentWidth, contentHeight) {
                var displayWidth = screenWidth;
                var displayHeight = screenHeight;
                var stageWidth = contentWidth;
                var stageHeight = contentHeight;
                var scaleX = (screenWidth / stageWidth) || 0;
                var scaleY = (screenHeight / stageHeight) || 0;
                switch (scaleMode) {
                    case egret.StageScaleMode.EXACT_FIT:
                        break;
                    case egret.StageScaleMode.FIXED_HEIGHT:
                        stageWidth = Math.round(screenWidth / scaleY);
                        break;
                    case egret.StageScaleMode.FIXED_WIDTH:
                        stageHeight = Math.round(screenHeight / scaleX);
                        break;
                    case egret.StageScaleMode.NO_BORDER:
                        if (scaleX > scaleY) {
                            displayHeight = Math.round(stageHeight * scaleX);
                        }
                        else {
                            displayWidth = Math.round(stageWidth * scaleY);
                        }
                        break;
                    case egret.StageScaleMode.SHOW_ALL:
                        if (scaleX > scaleY) {
                            displayWidth = Math.round(stageWidth * scaleY);
                        }
                        else {
                            displayHeight = Math.round(stageHeight * scaleX);
                        }
                        break;
                    case egret.StageScaleMode.FIXED_NARROW:
                        if (scaleX > scaleY) {
                            stageWidth = Math.round(screenWidth / scaleY);
                        }
                        else {
                            stageHeight = Math.round(screenHeight / scaleX);
                        }
                        break;
                    case egret.StageScaleMode.FIXED_WIDE:
                        if (scaleX > scaleY) {
                            stageHeight = Math.round(screenHeight / scaleX);
                        }
                        else {
                            stageWidth = Math.round(screenWidth / scaleY);
                        }
                        break;
                    default:
                        stageWidth = screenWidth;
                        stageHeight = screenHeight;
                        break;
                }
                return {
                    stageWidth: stageWidth,
                    stageHeight: stageHeight,
                    displayWidth: displayWidth,
                    displayHeight: displayHeight
                };
            };
            return ScreenAdapter;
        })(egret.HashObject);
        sys.ScreenAdapter = ScreenAdapter;
        egret.registerClass(ScreenAdapter,'egret.sys.ScreenAdapter',["egret.sys.IScreenAdapter"]);
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * StageScaleMode class provides values for the stage zoom mode.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/player/StageScaleMode.ts
     */
    /**
     * @language zh_CN
     * StageScaleMode 类为舞台缩放模式提供值。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/player/StageScaleMode.ts
     */
    var StageScaleMode = (function () {
        function StageScaleMode() {
        }
        var d = __define,c=StageScaleMode,p=c.prototype;
        /**
         * @language en_US
         * Do not scale application content. Even when you change the player viewport size, it remains unchanged. If the player is smaller than the viewport content, possibly with some cropping.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) always with the player viewport size consistent.
         */
        /**
         * @language zh_CN
         * 不缩放应用程序内容。即使在更改播放器视口大小时，它仍然保持不变。如果播放器视口比内容小，则可能进行一些裁切。<br/>
         * 在此模式下，舞台尺寸（Stage.stageWidth,Stage.stageHeight）始终跟播放器视口大小保持一致。
         */
        StageScaleMode.NO_SCALE = "noScale";
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling a wide directions application content to fill the viewport players on both sides in the other direction may not be wide enough and left black bars.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization incoming external application content size.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容的较宽方向填满播放器视口，另一个方向的两侧可能会不够宽而留有黑边。<br/>
         * 在此模式下，舞台尺寸(Stage.stageWidth,Stage.stageHeight)始终等于初始化时外部传入的应用程序内容尺寸。
         */
        StageScaleMode.SHOW_ALL = "showAll";
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling a narrow direction of application content to fill the viewport players on both sides in the other direction may exceed the viewport and the player is cut.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization incoming external application content size.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容的较窄方向填满播放器视口，另一个方向的两侧可能会超出播放器视口而被裁切。<br/>
         * 在此模式下，舞台尺寸(Stage.stageWidth,Stage.stageHeight)始终等于初始化时外部传入的应用程序内容尺寸。
         */
        StageScaleMode.NO_BORDER = "noBorder";
        /**
         * @language en_US
         * Do not keep the original aspect ratio scaling application content, after scaling application content just fill the player viewport.<br/>
         * In this mode, the stage size (Stage.stageWidth, Stage.stageHeight) is always equal to the initialization incoming external application content size.
         */
        /**
         * @language zh_CN
         * 不保持原始宽高比缩放应用程序内容，缩放后应用程序内容正好填满播放器视口。<br/>
         * 在此模式下，舞台尺寸(Stage.stageWidth,Stage.stageHeight)始终等于初始化时外部传入的应用程序内容尺寸。
         */
        StageScaleMode.EXACT_FIT = "exactFit";
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant width, height may change.<br/>
         * In this mode, the stage width (Stage.stageWidth) is always equal to initialize external incoming application content width. Stage height (Stage.stageHeight) by the current scale with the player viewport height decision.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始宽度不变，高度可能会改变。<br/>
         * 在此模式下，舞台宽度(Stage.stageWidth)始终等于初始化时外部传入的应用程序内容宽度。舞台高度(Stage.stageHeight)由当前的缩放比例与播放器视口高度决定。
         */
        StageScaleMode.FIXED_WIDTH = "fixedWidth";
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, but only to keep the contents of the original application constant height, width may change.<br/>
         * In this mode, the stage height (Stage.stageHeight) is always equal to initialize external incoming application content height. Stage width (Stage.stageWidth) by the current scale with the player viewport width decision.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，但只保持应用程序内容的原始高度不变，宽度可能会改变。<br/>
         * 在此模式下，舞台高度(Stage.stageHeight)始终等于初始化时外部传入的应用程序内容高度。舞台宽度(Stage.stageWidth)由当前的缩放比例与播放器视口宽度决定。
         */
        StageScaleMode.FIXED_HEIGHT = "fixedHeight";
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player,a narrow direction may not be wide enough and fill.<br/>
         * In this mode, the stage height (Stage.stageHeight) and the stage width (Stage.stageWidth) by the current scale with the player viewport size.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，应用程序内容的较窄方向可能会不够宽而填充。<br/>
         * 在此模式下，舞台高度(Stage.stageHeight)和舞台宽度(Stage.stageWidth)由当前的缩放比例与播放器视口宽高决定。
         */
        StageScaleMode.FIXED_NARROW = "fixedNarrow";
        /**
         * @language en_US
         * Keep the original aspect ratio scaling application content, after scaling application content in the horizontal and vertical directions to fill the viewport player, a wide direction may exceed the viewport and the player is cut.<br/>
         * In this mode, the stage height (Stage.stageHeight) and the stage width (Stage.stageWidth) by the current scale with the player viewport size.
         */
        /**
         * @language zh_CN
         * 保持原始宽高比缩放应用程序内容，缩放后应用程序内容在水平和垂直方向都填满播放器视口，应用程序内容的较宽方向的两侧可能会超出播放器视口而被裁切。<br/>
         * 在此模式下，舞台高度(Stage.stageHeight)和舞台宽度(Stage.stageWidth)由当前的缩放比例与播放器视口宽高决定。
         */
        StageScaleMode.FIXED_WIDE = "fixedWide";
        return StageScaleMode;
    })();
    egret.StageScaleMode = StageScaleMode;
    egret.registerClass(StageScaleMode,'egret.StageScaleMode');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var sys;
    (function (sys) {
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        /**
         * @private
         */
        sys.$START_TIME = 0;
        /**
         * @private
         * 是否要广播Event.RENDER事件的标志。
         */
        sys.$invalidateRenderFlag = false;
        /**
         * @private
         * 需要立即刷新屏幕的标志
         */
        sys.$requestRenderingFlag = false;
        /**
         * @private
         * Egret心跳计时器
         */
        var SystemTicker = (function () {
            /**
             * @private
             */
            function SystemTicker() {
                /**
                 * @private
                 */
                this.playerList = [];
                /**
                 * @private
                 */
                this.callBackList = [];
                /**
                 * @private
                 */
                this.thisObjectList = [];
                /**
                 * @private
                 * 全局帧率
                 */
                this.$frameRate = 30;
                /**
                 * @private
                 */
                this.frameInterval = 2000;
                /**
                 * @private
                 */
                this.lastCount = 2000;
                /**
                 * @private
                 * ticker 花销的时间
                 */
                this.costEnterFrame = 0;
                if (DEBUG && sys.$ticker) {
                    egret.$error(1008, "egret.sys.SystemTicker");
                }
                sys.$START_TIME = Date.now();
            }
            var d = __define,c=SystemTicker,p=c.prototype;
            /**
             * @private
             * 注册一个播放器实例并运行
             */
            p.$addPlayer = function (player) {
                if (this.playerList.indexOf(player) != -1) {
                    return;
                }
                if (DEBUG) {
                    egret_stages.push(player.stage);
                }
                this.playerList = this.playerList.concat();
                this.playerList.push(player);
            };
            /**
             * @private
             * 停止一个播放器实例的运行。
             */
            p.$removePlayer = function (player) {
                var index = this.playerList.indexOf(player);
                if (index !== -1) {
                    if (DEBUG) {
                        var i = egret_stages.indexOf(player.stage);
                        egret_stages.splice(i, 1);
                    }
                    this.playerList = this.playerList.concat();
                    this.playerList.splice(index, 1);
                }
            };
            /**
             * @private
             */
            p.$startTick = function (callBack, thisObject) {
                var index = this.getTickIndex(callBack, thisObject);
                if (index != -1) {
                    return;
                }
                this.concatTick();
                this.callBackList.push(callBack);
                this.thisObjectList.push(thisObject);
            };
            /**
             * @private
             */
            p.$stopTick = function (callBack, thisObject) {
                var index = this.getTickIndex(callBack, thisObject);
                if (index == -1) {
                    return;
                }
                this.concatTick();
                this.callBackList.splice(index, 1);
                this.thisObjectList.splice(index, 1);
            };
            /**
             * @private
             */
            p.getTickIndex = function (callBack, thisObject) {
                var callBackList = this.callBackList;
                var thisObjectList = this.thisObjectList;
                for (var i = callBackList.length - 1; i >= 0; i--) {
                    if (callBackList[i] == callBack &&
                        thisObjectList[i] == thisObject) {
                        return i;
                    }
                }
                return -1;
            };
            /**
             * @private
             *
             */
            p.concatTick = function () {
                this.callBackList = this.callBackList.concat();
                this.thisObjectList = this.thisObjectList.concat();
            };
            /**
             * @private
             * 设置全局帧率
             */
            p.$setFrameRate = function (value) {
                value = +value || 0;
                if (value <= 0) {
                    return false;
                }
                if (this.$frameRate == value) {
                    return false;
                }
                this.$frameRate = value;
                if (value > 60) {
                    value = 60;
                }
                //todo
                if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
                    egret_native.setFrameRate(value);
                    value = 60;
                }
                //这里用60*1000来避免浮点数计算不准确的问题。
                this.lastCount = this.frameInterval = Math.round(60000 / value);
                return true;
            };
            /**
             * @private
             * 执行一次刷新
             */
            p.update = function () {
                var t1 = egret.getTimer();
                var callBackList = this.callBackList;
                var thisObjectList = this.thisObjectList;
                var length = callBackList.length;
                var requestRenderingFlag = sys.$requestRenderingFlag;
                var timeStamp = egret.getTimer();
                for (var i = 0; i < length; i++) {
                    if (callBackList[i].call(thisObjectList[i], timeStamp)) {
                        requestRenderingFlag = true;
                    }
                }
                this.lastCount -= 1000;
                var t2 = egret.getTimer();
                if (this.lastCount > 0) {
                    if (requestRenderingFlag) {
                        this.render(false, this.costEnterFrame + t2 - t1);
                    }
                    return;
                }
                this.lastCount += this.frameInterval;
                this.render(true, this.costEnterFrame + t2 - t1);
                var t3 = egret.getTimer();
                this.broadcastEnterFrame();
                var t4 = egret.getTimer();
                this.costEnterFrame = t4 - t3;
            };
            /**
             * @private
             * 执行一次屏幕渲染
             */
            p.render = function (triggerByFrame, costTicker) {
                var playerList = this.playerList;
                var length = playerList.length;
                if (length == 0) {
                    return;
                }
                if (sys.$invalidateRenderFlag) {
                    this.broadcastRender();
                    sys.$invalidateRenderFlag = false;
                }
                for (var i = 0; i < length; i++) {
                    playerList[i].$render(triggerByFrame, costTicker);
                }
                sys.$requestRenderingFlag = false;
            };
            /**
             * @private
             * 广播EnterFrame事件。
             */
            p.broadcastEnterFrame = function () {
                var list = egret.DisplayObject.$enterFrameCallBackList;
                var length = list.length;
                if (length == 0) {
                    return;
                }
                list = list.concat();
                for (var i = 0; i < length; i++) {
                    list[i].dispatchEventWith(egret.Event.ENTER_FRAME);
                }
            };
            /**
             * @private
             * 广播Render事件。
             */
            p.broadcastRender = function () {
                var list = egret.DisplayObject.$renderCallBackList;
                var length = list.length;
                if (length == 0) {
                    return;
                }
                list = list.concat();
                for (var i = 0; i < length; i++) {
                    list[i].dispatchEventWith(egret.Event.RENDER);
                }
            };
            return SystemTicker;
        })();
        sys.SystemTicker = SystemTicker;
        egret.registerClass(SystemTicker,'egret.sys.SystemTicker');
        /**
         * @private
         * 心跳计时器单例
         */
        sys.$ticker = new sys.SystemTicker();
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
if (DEBUG) {
    var egret_stages = [];
}
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        /**
         * @private
         * 用户交互操作管理器
         */
        var TouchHandler = (function (_super) {
            __extends(TouchHandler, _super);
            /**
             * @private
             */
            function TouchHandler(stage) {
                _super.call(this);
                this.maxTouches = 0;
                this.useTouchesCount = 0;
                /**
                 * @private
                 */
                this.touchDownTarget = {};
                /**
                 * @private
                 */
                this.lastTouchX = -1;
                /**
                 * @private
                 */
                this.lastTouchY = -1;
                this.stage = stage;
            }
            var d = __define,c=TouchHandler,p=c.prototype;
            /**
             * @private
             * 设置同时触摸数量
             */
            p.$initMaxTouches = function () {
                this.maxTouches = this.stage.$maxTouches;
            };
            /**
             * @private
             * 触摸开始（按下）
             * @param x 事件发生处相对于舞台的坐标x
             * @param y 事件发生处相对于舞台的坐标y
             * @param touchPointID 分配给触摸点的唯一标识号
             */
            p.onTouchBegin = function (x, y, touchPointID) {
                if (this.useTouchesCount >= this.maxTouches) {
                    return;
                }
                this.lastTouchX = x;
                this.lastTouchY = y;
                var target = this.findTarget(x, y);
                if (this.touchDownTarget[touchPointID] == null) {
                    this.touchDownTarget[touchPointID] = target;
                    this.useTouchesCount++;
                }
                egret.TouchEvent.dispatchTouchEvent(target, egret.TouchEvent.TOUCH_BEGIN, true, true, x, y, touchPointID, true);
            };
            /**
             * @private
             * 触摸移动
             * @param x 事件发生处相对于舞台的坐标x
             * @param y 事件发生处相对于舞台的坐标y
             * @param touchPointID 分配给触摸点的唯一标识号
             */
            p.onTouchMove = function (x, y, touchPointID) {
                if (this.touchDownTarget[touchPointID] == null) {
                    return;
                }
                if (this.lastTouchX == x && this.lastTouchY == y) {
                    return;
                }
                this.lastTouchX = x;
                this.lastTouchY = y;
                var target = this.findTarget(x, y);
                egret.TouchEvent.dispatchTouchEvent(target, egret.TouchEvent.TOUCH_MOVE, true, true, x, y, touchPointID, true);
            };
            /**
             * @private
             * 触摸结束（弹起）
             * @param x 事件发生处相对于舞台的坐标x
             * @param y 事件发生处相对于舞台的坐标y
             * @param touchPointID 分配给触摸点的唯一标识号
             */
            p.onTouchEnd = function (x, y, touchPointID) {
                if (this.touchDownTarget[touchPointID] == null) {
                    return;
                }
                var target = this.findTarget(x, y);
                var oldTarget = this.touchDownTarget[touchPointID];
                delete this.touchDownTarget[touchPointID];
                this.useTouchesCount--;
                egret.TouchEvent.dispatchTouchEvent(target, egret.TouchEvent.TOUCH_END, true, true, x, y, touchPointID, false);
                if (oldTarget == target) {
                    egret.TouchEvent.dispatchTouchEvent(target, egret.TouchEvent.TOUCH_TAP, true, true, x, y, touchPointID, false);
                }
                else {
                    egret.TouchEvent.dispatchTouchEvent(oldTarget, egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, true, true, x, y, touchPointID, false);
                }
            };
            /**
             * @private
             * 获取舞台坐标下的触摸对象
             */
            p.findTarget = function (stageX, stageY) {
                var target = this.stage.$hitTest(stageX, stageY);
                if (!target) {
                    target = this.stage;
                }
                return target;
            };
            return TouchHandler;
        })(egret.HashObject);
        sys.TouchHandler = TouchHandler;
        egret.registerClass(TouchHandler,'egret.sys.TouchHandler');
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
var egret;
(function (egret) {
    /**
     * @copy egret.Orientation
     */
    egret.DeviceOrientation = null;
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
var egret;
(function (egret) {
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Type of operation.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 运行类型的类型。
     * @version Egret 2.4
     * @platform Web,Native
     */
    var RuntimeType = (function () {
        function RuntimeType() {
        }
        var d = __define,c=RuntimeType,p=c.prototype;
        /**
         * @language en_US
         * Running on Web
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 运行在Web上
         * @version Egret 2.4
         * @platform Web,Native
         */
        RuntimeType.WEB = "web";
        /**
         * @language en_US
         * Running on NATIVE
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 运行在NATIVE上
         * @version Egret 2.4
         * @platform Web,Native
         */
        RuntimeType.NATIVE = "native";
        return RuntimeType;
    })();
    egret.RuntimeType = RuntimeType;
    egret.registerClass(RuntimeType,'egret.RuntimeType');
    /**
     * @language en_US
     * The Capabilities class provides properties that describe the system and runtime that are hosting the application.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/system/Capabilities.ts
     */
    /**
     * @language zh_CN
     * Capabilities 类提供一些属性，这些属性描述了承载应用程序的系统和运行时。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/system/Capabilities.ts
     */
    var Capabilities = (function () {
        function Capabilities() {
        }
        var d = __define,c=Capabilities,p=c.prototype;
        d(Capabilities, "language"
            /**
             * @language en_US
             * Specifies the language code of the system on which the content is running. The language is specified as a lowercase
             * two-letter language code from ISO 639-1. For Chinese, an additional uppercase two-letter country code from ISO 3166
             * distinguishes between Simplified and Traditional Chinese.<br/>
             * The following table lists the possible values,but not limited to them:
             * <ul>
             * <li>Simplified    Chinese  zh-CN</li>
             * <li>Traditional   Chinese  zh-TW</li>
             * <li>English       en</li>
             * <li>Japanese      ja</li>
             * <li>Korean        ko</li>
             * </ul>
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示运行内容的系统的语言代码。语言指定为 ISO 639-1 中的小写双字母语言代码。
             * 对于中文，另外使用 ISO 3166 中的大写双字母国家/地区代码，以区分简体中文和繁体中文。<br/>
             * 以下是可能但不限于的语言和值：
             * <ul>
             * <li>简体中文  zh-CN</li>
             * <li>繁体中文  zh-TW</li>
             * <li>英语      en</li>
             * <li>日语      ja</li>
             * <li>韩语      ko</li>
             * </ul>
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return Capabilities.$language;
            }
        );
        d(Capabilities, "isMobile"
            /**
             * @language en_US
             * Specifies whether the system is running in a mobile device.(such as a mobile phone or tablet)
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 表示程序内容是否运行在移动设备中（例如移动电话或平板电脑）。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return Capabilities.$isMobile;
            }
        );
        d(Capabilities, "os"
            /**
             * @language en_US
             * Specifies the current operating system. The os property can return the following strings:
             * <ul>
             * <li>iPhone            "iOS"</li>
             * <li>Android Phone     "Android"</li>
             * <li>Windows Phone     "Windows Phone"</li>
             * <li>Windows Desktop   "Windows PC"</li>
             * <li>Mac Desktop       "Mac OS"</li>
             * <li>Unknown OS        "Unknown"</li>
             * </ul>
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 指示当前的操作系统。os 属性返回下列字符串：
             * <ul>
             * <li>苹果手机操作系统     "iOS"</li>
             * <li>安卓手机操作系统     "Android"</li>
             * <li>微软手机操作系统     "Windows Phone"</li>
             * <li>微软桌面操作系统     "Windows PC"</li>
             * <li>苹果桌面操作系统     "Mac OS"</li>
             * <li>未知操作系统        "Unknown"</li>
             * </ul>
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return Capabilities.$os;
            }
        );
        d(Capabilities, "runtimeType"
            /**
             * @language en_US
             * It indicates the current type of operation. runtimeType property returns the following string:
             * <ul>
             * <li>Run on Web     egret.RuntimeType.WEB</li>
             * <li>Run on Native     egret.RuntimeType.NATIVE</li>
             * </ul>
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 指示当前的运行类型。runtimeType 属性返回下列字符串：
             * <ul>
             * <li>运行在Web上     egret.RuntimeType.WEB</li>
             * <li>运行在Native上     egret.RuntimeType.NATIVE</li>
             * </ul>
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return Capabilities.$runtimeType;
            }
        );
        /**
         * 设置系统信息
         */
        Capabilities.$setNativeCapabilities = function (value) {
            var arr = value.split("-");
            if (arr.length <= 4) {
                //todo 未来去掉数量判断，2.5.4版本之前的参数大于4个
                var osType = arr[0];
                switch (osType) {
                    case "android":
                        osType = "Android";
                        break;
                    case "ios":
                        osType = 'iOS';
                        break;
                }
                Capabilities.$os = osType;
                var version = arr[2].substring(1, arr[2].length);
                Capabilities.supportVersion = version;
            }
        };
        /**
         * @private
         */
        Capabilities.$language = "zh-CN";
        /**
         * @private
         */
        Capabilities.$os = "Unknown";
        /**
         * @private
         */
        Capabilities.$runtimeType = "Unknown";
        /***
         * @language en_US
         * version of the native support
         * @type {string}
         * @version Egret 2.5
         * @platform Web,Native
         */
        /***
         * @language zh_CN
         * native support 的版本号
         * @type {string}
         * @version Egret 2.5
         * @platform Web,Native
         */
        Capabilities.supportVersion = "Unknown";
        return Capabilities;
    })();
    egret.Capabilities = Capabilities;
    egret.registerClass(Capabilities,'egret.Capabilities');
    if (DEBUG) {
        egret.$markReadOnly(Capabilities, "language", false);
        egret.$markReadOnly(Capabilities, "isMobile", false);
        egret.$markReadOnly(Capabilities, "os", false);
    }
})(egret || (egret = {}));
var testDeviceType = function () {
    if (!this["navigator"]) {
        return true;
    }
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
};
var testRuntimeType = function () {
    if (this["navigator"]) {
        return true;
    }
    return false;
};
egret.Capabilities.$isMobile = testDeviceType();
egret.Capabilities.$runtimeType = testRuntimeType() ? egret.RuntimeType.WEB : egret.RuntimeType.NATIVE;
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Bitmap font, texture set of a font. It is generally used as the value of the BitmapText.font attribute.
     * @see http://bbs.egret-labs.org/thread-918-1-1.html TextureMerger
     * @see http://bbs.egret-labs.org/forum.php?mod=viewthread&tid=251 Text(Containing the specific usage of the bitmap font )
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapFont.ts
     */
    /**
     * @language zh_CN
     * 位图字体,是一个字体的纹理集，通常作为BitmapText.font属性的值。
     * @see http://bbs.egret-labs.org/thread-918-1-1.html TextureMerger
     * @see http://bbs.egret-labs.org/forum.php?mod=viewthread&tid=251 文本(含位图字体具体用法)
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapFont.ts
     */
    var BitmapFont = (function (_super) {
        __extends(BitmapFont, _super);
        /**
         * @language en_US
         * Create an egret.BitmapFont object
         * @param texture {egret.Texture} Texture set that use TextureMerger create
         * @param config {any} Configure data that use TextureMerger create
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.BitmapFont 对象
         * @param texture {egret.Texture} 使用TextureMerger生成的纹理集
         * @param config {any} 使用TextureMerger生成的配置数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        function BitmapFont(texture, config) {
            _super.call(this, texture);
            /**
             * @private
             */
            this.firstCharHeight = 0;
            if (typeof (config) == "string") {
                this.charList = this.parseConfig(config);
            }
            else if (config && config.hasOwnProperty("frames")) {
                this.charList = config.frames;
            }
            else {
                this.charList = {};
            }
        }
        var d = __define,c=BitmapFont,p=c.prototype;
        /**
         * @language en_US
         * Obtain corresponding texture through the name attribute
         * @param name {string} name Attribute
         * @returns {egret.Texture}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 通过 name 属性获取对应纹理
         * @param name {string} name属性
         * @returns {egret.Texture}
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.getTexture = function (name) {
            var texture = this._textureMap[name];
            if (!texture) {
                var c = this.charList[name];
                if (!c) {
                    return null;
                }
                texture = this.createTexture(name, c.x, c.y, c.w, c.h, c.offX, c.offY, c.sourceW, c.sourceH);
                this._textureMap[name] = texture;
            }
            return texture;
        };
        /**
         * @private
         *
         * @returns
         */
        p._getFirstCharHeight = function () {
            if (this.firstCharHeight == 0) {
                for (var str in this.charList) {
                    var c = this.charList[str];
                    if (c) {
                        var sourceH = c.sourceH;
                        if (egret.sys.isUndefined(sourceH)) {
                            var h = c.h;
                            if (h === undefined) {
                                h = 0;
                            }
                            var offY = c.offY;
                            if (egret.sys.isUndefined(offY)) {
                                offY = 0;
                            }
                            sourceH = h + offY;
                        }
                        if (sourceH <= 0) {
                            continue;
                        }
                        this.firstCharHeight = sourceH;
                        break;
                    }
                }
            }
            return this.firstCharHeight;
        };
        /**
         * @private
         *
         * @param fntText
         * @returns
         */
        p.parseConfig = function (fntText) {
            fntText = fntText.split("\r\n").join("\n");
            var lines = fntText.split("\n");
            var charsCount = this.getConfigByKey(lines[3], "count");
            var chars = {};
            for (var i = 4; i < 4 + charsCount; i++) {
                var charText = lines[i];
                var letter = String.fromCharCode(this.getConfigByKey(charText, "id"));
                var c = {};
                chars[letter] = c;
                c["x"] = this.getConfigByKey(charText, "x");
                c["y"] = this.getConfigByKey(charText, "y");
                c["w"] = this.getConfigByKey(charText, "width");
                c["h"] = this.getConfigByKey(charText, "height");
                c["offX"] = this.getConfigByKey(charText, "xoffset");
                c["offY"] = this.getConfigByKey(charText, "yoffset");
            }
            return chars;
        };
        /**
         * @private
         *
         * @param configText
         * @param key
         * @returns
         */
        p.getConfigByKey = function (configText, key) {
            var itemConfigTextList = configText.split(" ");
            for (var i = 0, length = itemConfigTextList.length; i < length; i++) {
                var itemConfigText = itemConfigTextList[i];
                if (key == itemConfigText.substring(0, key.length)) {
                    var value = itemConfigText.substring(key.length + 1);
                    return parseInt(value);
                }
            }
            return 0;
        };
        return BitmapFont;
    })(egret.SpriteSheet);
    egret.BitmapFont = BitmapFont;
    egret.registerClass(BitmapFont,'egret.BitmapFont');
})(egret || (egret = {}));
var egret;
(function (egret) {
    /**
     * @language en_US
     * Bitmap font adopts the Bitmap+SpriteSheet mode to render text.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapText.ts
     */
    /**
     * @language zh_CN
     * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapText.ts
     */
    var BitmapText = (function (_super) {
        __extends(BitmapText, _super);
        /**
         * @language en_US
         * Create an egret.BitmapText object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.BitmapText 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        function BitmapText() {
            _super.call(this);
            /**
             * @private
             */
            this.$textOffsetX = 0;
            /**
             * @private
             */
            this.$textOffsetY = 0;
            /**
             * @private
             */
            this.$textStartX = 0;
            /**
             * @private
             */
            this.$textStartY = 0;
            /**
             * @private
             */
            this.$lineHeights = [];
            //this.cacheAsBitmap = true;
            this.$renderRegion = new egret.sys.Region();
            this.$BitmapText = {
                0: NaN,
                1: NaN,
                2: "",
                3: 0,
                4: 0,
                5: null,
                6: false,
                7: false,
                8: false,
                9: false,
                10: "left",
                11: "top" //verticalAlign
            };
        }
        var d = __define,c=BitmapText,p=c.prototype;
        d(p, "text"
            /**
             * @language en_US
             * A string to display in the text field.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 要显示的文本内容
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$BitmapText[2 /* text */];
            }
            ,function (value) {
                this.$setText(value);
            }
        );
        /**
         * @private
         */
        p.$setText = function (value) {
            var values = this.$BitmapText;
            if (value == values[2 /* text */])
                return false;
            values[2 /* text */] = value;
            this.$invalidateContentBounds();
            return true;
        };
        /**
         * @private
         */
        p.$getWidth = function () {
            var w = this.$BitmapText[0 /* textFieldWidth */];
            return isNaN(w) ? this.$getContentBounds().width : w;
        };
        /**
         * @private
         */
        p.$setWidth = function (value) {
            //value = +value || 0;
            var values = this.$BitmapText;
            if (value < 0 || value == values[0 /* textFieldWidth */]) {
                return false;
            }
            values[0 /* textFieldWidth */] = value;
            this.$invalidateContentBounds();
            return true;
        };
        /**
         * @private
         */
        p.$invalidateContentBounds = function () {
            _super.prototype.$invalidateContentBounds.call(this);
            this.$BitmapText[7 /* textLinesChanged */] = true;
        };
        /**
         * @private
         */
        p.$getHeight = function () {
            var h = this.$BitmapText[1 /* textFieldHeight */];
            return isNaN(h) ? this.$getContentBounds().height : h;
        };
        /**
         * @private
         */
        p.$setHeight = function (value) {
            //value = +value || 0;
            var values = this.$BitmapText;
            if (value < 0 || value == values[1 /* textFieldHeight */]) {
                return false;
            }
            values[1 /* textFieldHeight */] = value;
            this.$invalidateContentBounds();
            return true;
        };
        d(p, "font"
            /**
             * @language en_US
             * The name of the font to use, or a comma-separated list of font names, the type of value must be BitmapFont.
             * @default null
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 要使用的字体的名称或用逗号分隔的字体名称列表，类型必须是 BitmapFont。
             * @default null
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$BitmapText[5 /* font */];
            }
            ,function (value) {
                this.$setFont(value);
            }
        );
        p.$setFont = function (value) {
            var values = this.$BitmapText;
            if (values[5 /* font */] == value) {
                return false;
            }
            values[5 /* font */] = value;
            this.$BitmapText[6 /* fontStringChanged */] = true;
            this.$invalidateContentBounds();
            return true;
        };
        d(p, "lineSpacing"
            /**
             /**
             * @language en_US
             * An integer representing the amount of vertical space between lines.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 一个整数，表示行与行之间的垂直间距量
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$BitmapText[3 /* lineSpacing */];
            }
            ,function (value) {
                this.$setLineSpacing(value);
            }
        );
        p.$setLineSpacing = function (value) {
            value = +value || 0;
            var values = this.$BitmapText;
            if (values[3 /* lineSpacing */] == value)
                return false;
            values[3 /* lineSpacing */] = value;
            this.$invalidateContentBounds();
            return true;
        };
        d(p, "letterSpacing"
            /**
             * @language en_US
             * An integer representing the amount of distance between characters.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 一个整数，表示字符之间的距量。
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$BitmapText[4 /* letterSpacing */];
            }
            ,function (value) {
                this.$setLetterSpacing(value);
            }
        );
        p.$setLetterSpacing = function (value) {
            value = +value || 0;
            var values = this.$BitmapText;
            if (values[4 /* letterSpacing */] == value)
                return false;
            values[4 /* letterSpacing */] = value;
            this.$invalidateContentBounds();
            return true;
        };
        d(p, "textAlign"
            /**
             * @language en_US
             * Horizontal alignment of text.
             * @default：egret.HorizontalAlign.LEFT
             * @version Egret 2.5.6
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 文本的水平对齐方式。
             * @default：egret.HorizontalAlign.LEFT
             * @version Egret 2.5.6
             * @platform Web,Native
             */
            ,function () {
                return this.$BitmapText[10 /* textAlign */];
            }
            ,function (value) {
                this.$setTextAlign(value);
            }
        );
        p.$setTextAlign = function (value) {
            var values = this.$BitmapText;
            if (values[10 /* textAlign */] == value)
                return false;
            values[10 /* textAlign */] = value;
            this.$invalidateContentBounds();
            return true;
        };
        d(p, "verticalAlign"
            /**
             * @language en_US
             * Vertical alignment of text.
             * @default：egret.VerticalAlign.TOP
             * @version Egret 2.5.6
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 文字的垂直对齐方式。
             * @default：egret.VerticalAlign.TOP
             * @version Egret 2.5.6
             * @platform Web,Native
             */
            ,function () {
                return this.$BitmapText[11 /* verticalAlign */];
            }
            ,function (value) {
                this.$setVerticalAlign(value);
            }
        );
        p.$setVerticalAlign = function (value) {
            var values = this.$BitmapText;
            if (values[11 /* verticalAlign */] == value)
                return false;
            values[11 /* verticalAlign */] = value;
            this.$invalidateContentBounds();
            return true;
        };
        /**
         * @private
         */
        p.$render = function (context) {
            var self = this;
            var values = self.$BitmapText;
            var textLines = self.$getTextLines();
            var length = textLines.length;
            if (length == 0) {
                return;
            }
            var textLinesWidth = self.$textLinesWidth;
            var bitmapFont = values[5 /* font */];
            var emptyHeight = bitmapFont._getFirstCharHeight();
            var emptyWidth = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            var hasSetHeight = !isNaN(values[1 /* textFieldHeight */]);
            var textWidth = values[8 /* textWidth */];
            var textFieldWidth = values[0 /* textFieldWidth */];
            var textFieldHeight = values[1 /* textFieldHeight */];
            var align = values[10 /* textAlign */];
            var yPos = self.$textOffsetY + self.$textStartY;
            var lineHeights = self.$lineHeights;
            for (var i = 0; i < length; i++) {
                var lineHeight = lineHeights[i];
                if (hasSetHeight && i > 0 && yPos + lineHeight > textFieldHeight) {
                    break;
                }
                var line = textLines[i];
                var len = line.length;
                var xPos = self.$textOffsetX;
                if (align != egret.HorizontalAlign.LEFT) {
                    var countWidth = textFieldWidth > textWidth ? textFieldWidth : textWidth;
                    if (align == egret.HorizontalAlign.RIGHT) {
                        xPos += countWidth - textLinesWidth[i];
                    }
                    else if (align == egret.HorizontalAlign.CENTER) {
                        xPos += Math.floor((countWidth - textLinesWidth[i]) / 2);
                    }
                }
                for (var j = 0; j < len; j++) {
                    var character = line.charAt(j);
                    var texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            xPos += emptyWidth;
                        }
                        else {
                            egret.$warn(1011, character);
                        }
                        continue;
                    }
                    var bitmapWidth = texture._bitmapWidth;
                    var bitmapHeight = texture._bitmapHeight;
                    context.drawImage(texture._bitmapData, texture._bitmapX, texture._bitmapY, bitmapWidth, bitmapHeight, xPos + texture._offsetX, yPos + texture._offsetY, texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight());
                    xPos += texture.$getTextureWidth() + values[4 /* letterSpacing */];
                }
                yPos += lineHeight + values[3 /* lineSpacing */];
            }
        };
        /**
         * @private
         */
        p.$measureContentBounds = function (bounds) {
            var lines = this.$getTextLines();
            if (lines.length == 0) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.$textOffsetX + this.$textStartX, this.$textOffsetY + this.$textStartY, this.$BitmapText[8 /* textWidth */] - this.$textOffsetX, this.$BitmapText[9 /* textHeight */] - this.$textOffsetY);
            }
        };
        d(p, "textWidth"
            /**
             * @language en_US
             * Get the BitmapText measured width
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 获取位图文本测量宽度
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                this.$getTextLines();
                return this.$BitmapText[8 /* textWidth */];
            }
        );
        d(p, "textHeight"
            /**
             * @language en_US
             * Get Text BitmapText height
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 获取位图文本测量高度
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                this.$getTextLines();
                return this.$BitmapText[9 /* textHeight */];
            }
        );
        /**
         * @private
         *
         * @returns
         */
        p.$getTextLines = function () {
            var self = this;
            var values = this.$BitmapText;
            if (!values[7 /* textLinesChanged */]) {
                return self.textLines;
            }
            var textLines = [];
            self.textLines = textLines;
            var textLinesWidth = [];
            self.$textLinesWidth = textLinesWidth;
            values[7 /* textLinesChanged */] = false;
            var lineHeights = [];
            self.$lineHeights = lineHeights;
            if (!values[2 /* text */] || !values[5 /* font */]) {
                return textLines;
            }
            var lineSpacing = values[3 /* lineSpacing */];
            var letterSpacing = values[4 /* letterSpacing */];
            var textWidth = 0;
            var textHeight = 0;
            var textOffsetX = 0;
            var textOffsetY = 0;
            var hasWidthSet = !isNaN(values[0 /* textFieldWidth */]);
            var textFieldWidth = values[0 /* textFieldWidth */];
            var textFieldHeight = values[1 /* textFieldHeight */];
            var bitmapFont = values[5 /* font */];
            var emptyHeight = bitmapFont._getFirstCharHeight();
            var emptyWidth = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            var text = values[2 /* text */];
            var textArr = text.split(/(?:\r\n|\r|\n)/);
            var length = textArr.length;
            var isFirstLine = true;
            for (var i = 0; i < length; i++) {
                var line = textArr[i];
                var len = line.length;
                var lineHeight = 0;
                var xPos = 0;
                var isFirstChar = true;
                var isLastChar = false;
                for (var j = 0; j < len; j++) {
                    if (!isFirstChar) {
                        xPos += letterSpacing;
                    }
                    var character = line.charAt(j);
                    var texureWidth;
                    var textureHeight;
                    var offsetX = 0;
                    var offsetY = 0;
                    var texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            texureWidth = emptyWidth;
                            textureHeight = emptyHeight;
                        }
                        else {
                            egret.$warn(1011, character);
                            if (isFirstChar) {
                                isFirstChar = false;
                            }
                            continue;
                        }
                    }
                    else {
                        texureWidth = texture.$getTextureWidth();
                        textureHeight = texture.$getTextureHeight();
                        offsetX = texture._offsetX;
                        offsetY = texture._offsetY;
                    }
                    if (isFirstChar) {
                        isFirstChar = false;
                        textOffsetX = Math.min(offsetX, textOffsetX);
                    }
                    if (isFirstLine) {
                        isFirstLine = false;
                        textOffsetY = Math.min(offsetY, textOffsetY);
                    }
                    if (hasWidthSet && j > 0 && xPos + texureWidth > textFieldWidth) {
                        if (!setLineData(line.substring(0, j)))
                            break;
                        line = line.substring(j);
                        len = line.length;
                        j = 0;
                        xPos = texureWidth;
                        lineHeight = textureHeight;
                        continue;
                    }
                    xPos += texureWidth;
                    lineHeight = Math.max(textureHeight, lineHeight);
                }
                if (textFieldHeight && i > 0 && textHeight > textFieldHeight) {
                    break;
                }
                isLastChar = true;
                if (!setLineData(line))
                    break;
            }
            function setLineData(str) {
                if (textFieldHeight && textLines.length > 0 && textHeight > textFieldHeight) {
                    return false;
                }
                textHeight += lineHeight + lineSpacing;
                if (!isFirstChar && !isLastChar) {
                    xPos -= letterSpacing;
                }
                textLines.push(str);
                lineHeights.push(lineHeight);
                textLinesWidth.push(xPos);
                textWidth = Math.max(xPos, textWidth);
                return true;
            }
            textHeight -= lineSpacing;
            values[8 /* textWidth */] = textWidth;
            values[9 /* textHeight */] = textHeight;
            self.$textOffsetX = textOffsetX;
            self.$textOffsetY = textOffsetY;
            self.$textStartX = 0;
            self.$textStartY = 0;
            var alignType;
            if (textFieldWidth > textWidth) {
                alignType = values[10 /* textAlign */];
                if (alignType == egret.HorizontalAlign.RIGHT) {
                    self.$textStartX = textFieldWidth - textWidth;
                }
                else if (alignType == egret.HorizontalAlign.CENTER) {
                    self.$textStartX = Math.floor((textFieldWidth - textWidth) / 2);
                }
            }
            if (textFieldHeight > textHeight) {
                alignType = values[11 /* verticalAlign */];
                if (alignType == egret.VerticalAlign.BOTTOM) {
                    self.$textStartY = textFieldHeight - textHeight;
                }
                else if (alignType == egret.VerticalAlign.MIDDLE) {
                    self.$textStartY = Math.floor((textFieldHeight - textHeight) / 2);
                }
            }
            return textLines;
        };
        /**
         * @language en_US
         * A ratio of the width of the space character. This value is multiplied by the height of the first character is the space character width.
         * @default 0.33
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个空格字符的宽度比例。这个数值乘以第一个字符的高度即为空格字符的宽。
         * @default 0.33
         * @version Egret 2.4
         * @platform Web,Native
         */
        BitmapText.EMPTY_FACTOR = 0.33;
        return BitmapText;
    })(egret.DisplayObject);
    egret.BitmapText = BitmapText;
    egret.registerClass(BitmapText,'egret.BitmapText');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The HorizontalAlign class defines the possible values for the horizontal alignment.
     * @see egret.TextField#textAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * HorizontalAlign 类为水平对齐方式定义可能的值。
     * @see egret.TextField#textAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    var HorizontalAlign = (function () {
        function HorizontalAlign() {
        }
        var d = __define,c=HorizontalAlign,p=c.prototype;
        /**
         * @language en_US
         * Horizontally align content to the left of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将内容与容器的左侧对齐。
         * @version Egret 2.4
         * @platform Web,Native
         */
        HorizontalAlign.LEFT = "left";
        /**
         * @language en_US
         * Horizontally align content to the right of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将内容与容器的右侧对齐。
         * @version Egret 2.4
         * @platform Web,Native
         */
        HorizontalAlign.RIGHT = "right";
        /**
         * @language en_US
         * Horizontally align content in the center of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在容器的水平中心对齐内容。
         * @version Egret 2.4
         * @platform Web,Native
         */
        HorizontalAlign.CENTER = "center";
        /**
         * @language en_US
         * Horizontal alignment with both edges
         * Note: TextFiled does not support this alignment method.
         * @constant egret.HorizontalAlign.JUSTIFY
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 水平两端对齐
         * 注意：TextFiled不支持此对齐方式。
         * @constant egret.HorizontalAlign.JUSTIFY
         * @version Egret 2.4
         * @platform Web,Native
         */
        HorizontalAlign.JUSTIFY = "justify";
        /**
         * @language en_US
         * Align the content of the child items, relative to the container. This operation will adjust uniformly the size of all the child items to be the Content Width \" of the container \".
         * The Content Width \" of the container \" is the size of the max. child item. If the size of all child items are less than the width of the container, they will be adjusted to the width of the container.
         * Note: TextFiled does not support this alignment method.
         * @constant egret.HorizontalAlign.CONTENT_JUSTIFY
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容宽度"。
         * 容器的"内容宽度"是最大子项的大小,如果所有子项都小于容器的宽度，则会将所有子项的大小调整为容器的宽度。
         * 注意：TextFiled不支持此对齐方式。
         * @constant egret.HorizontalAlign.CONTENT_JUSTIFY
         * @version Egret 2.4
         * @platform Web,Native
         */
        HorizontalAlign.CONTENT_JUSTIFY = "contentJustify";
        return HorizontalAlign;
    })();
    egret.HorizontalAlign = HorizontalAlign;
    egret.registerClass(HorizontalAlign,'egret.HorizontalAlign');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Convert the text in html format to the object that can be assigned to the egret.TextField#textFlow property
     * @see http://docs.egret-labs.org/jkdoc/manual-text-multiformat.html Text mixed in a variety of style
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/HtmlTextParser.ts
     */
    /**
     * @language zh_CN
     * 将html格式文本转换为可赋值给 egret.TextField#textFlow 属性的对象
     * @see http://docs.egret-labs.org/jkdoc/manual-text-multiformat.html 多种样式文本混合
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/HtmlTextParser.ts
     */
    var HtmlTextParser = (function () {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function HtmlTextParser() {
            this.replaceArr = [];
            /**
             * @private
             */
            this.resutlArr = [];
            this.initReplaceArr();
        }
        var d = __define,c=HtmlTextParser,p=c.prototype;
        p.initReplaceArr = function () {
            this.replaceArr = [];
            this.replaceArr.push([/&lt;/g, "<"]);
            this.replaceArr.push([/&gt;/g, ">"]);
            this.replaceArr.push([/&amp;/g, "&"]);
            this.replaceArr.push([/&quot;/g, "\""]);
            this.replaceArr.push([/&apos;/g, "\'"]);
        };
        /**
         * @private
         *
         * @param value
         * @returns
         */
        p.replaceSpecial = function (value) {
            for (var i = 0; i < this.replaceArr.length; i++) {
                var k = this.replaceArr[i][0];
                var v = this.replaceArr[i][1];
                value = value.replace(k, v);
            }
            return value;
        };
        /**
         * @language en_US
         * Convert the text in html format to the object that can be assigned to the egret.TextField#textFlow property
         * @param htmltext {string} Text in html
         * @returns {Array<egret.ITextElement>} 可赋值给 egret.TextField#textFlow Object that can be assigned to the egret.TextField#textFlow property
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将html格式文本转换为可赋值给 egret.TextField#textFlow 属性的对象
         * @param htmltext {string} html文本
         * @returns {Array<egret.ITextElement>} 可赋值给 egret.TextField#textFlow 属性的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.parser = function (htmltext) {
            this.stackArray = [];
            this.resutlArr = [];
            var firstIdx = 0; //文本段开始位置
            var length = htmltext.length;
            while (firstIdx < length) {
                var starIdx = htmltext.indexOf("<", firstIdx);
                if (starIdx < 0) {
                    this.addToResultArr(htmltext.substring(firstIdx));
                    firstIdx = length;
                }
                else {
                    this.addToResultArr(htmltext.substring(firstIdx, starIdx));
                    var fontEnd = htmltext.indexOf(">", starIdx);
                    if (fontEnd == -1) {
                        egret.$error(1038);
                        fontEnd = starIdx;
                    }
                    else if (htmltext.charAt(starIdx + 1) == "\/") {
                        this.stackArray.pop();
                    }
                    else {
                        this.addToArray(htmltext.substring(starIdx + 1, fontEnd));
                    }
                    firstIdx = fontEnd + 1;
                }
            }
            return this.resutlArr;
        };
        /**
         * @private
         *
         * @param value
         */
        p.addToResultArr = function (value) {
            if (value == "") {
                return;
            }
            value = this.replaceSpecial(value);
            if (this.stackArray.length > 0) {
                this.resutlArr.push({ text: value, style: this.stackArray[this.stackArray.length - 1] });
            }
            else {
                this.resutlArr.push({ text: value });
            }
        };
        //将字符数据转成Json数据
        p.changeStringToObject = function (str) {
            str = str.trim();
            var info = {};
            var header = [];
            if (str.charAt(0) == "i" || str.charAt(0) == "b" || str.charAt(0) == "u") {
                this.addProperty(info, str, "true");
            }
            else if (header = str.match(/^(font|a)\s/)) {
                str = str.substring(header[0].length).trim();
                var next = 0;
                var titles;
                while (titles = str.match(this.getHeadReg())) {
                    var title = titles[0];
                    var value = "";
                    var str = str.substring(title.length).trim();
                    if (str.charAt(0) == "\"") {
                        var next = str.indexOf("\"", 1);
                        value = str.substring(1, next);
                        next += 1;
                    }
                    else if (str.charAt(0) == "\'") {
                        var next = str.indexOf("\'", 1);
                        value = str.substring(1, next);
                        next += 1;
                    }
                    else {
                        value = str.match(/(\S)+/)[0];
                        next = value.length;
                    }
                    this.addProperty(info, title.substring(0, title.length - 1).trim(), value.trim());
                    str = str.substring(next).trim();
                }
            }
            return info;
        };
        /**
         * @private
         *
         * @returns
         */
        p.getHeadReg = function () {
            return /^(color|textcolor|strokecolor|stroke|b|bold|i|italic|u|size|fontfamily|href|target)(\s)*=/;
        };
        /**
         * @private
         *
         * @param info
         * @param head
         * @param value
         */
        p.addProperty = function (info, head, value) {
            switch (head.toLowerCase()) {
                case "color":
                case "textcolor":
                    value = value.replace(/#/, "0x");
                    info.textColor = parseInt(value);
                    break;
                case "strokecolor":
                    value = value.replace(/#/, "0x");
                    info.strokeColor = parseInt(value);
                    break;
                case "stroke":
                    info.stroke = parseInt(value);
                    break;
                case "b":
                case "bold":
                    info.bold = value == "true";
                    break;
                case "u":
                    info.underline = value == "true";
                    break;
                case "i":
                case "italic":
                    info.italic = value == "true";
                    break;
                case "size":
                    info.size = parseInt(value);
                    break;
                case "fontfamily":
                    info.fontFamily = value;
                    break;
                case "href":
                    info.href = this.replaceSpecial(value);
                    break;
                case "target":
                    info.target = this.replaceSpecial(value);
                    break;
            }
        };
        /**
         * @private
         *
         * @param infoStr
         */
        p.addToArray = function (infoStr) {
            var info = this.changeStringToObject(infoStr);
            if (this.stackArray.length == 0) {
                this.stackArray.push(info);
            }
            else {
                var lastInfo = this.stackArray[this.stackArray.length - 1];
                for (var key in lastInfo) {
                    if (info[key] == null) {
                        info[key] = lastInfo[key];
                    }
                }
                this.stackArray.push(info);
            }
        };
        return HtmlTextParser;
    })();
    egret.HtmlTextParser = HtmlTextParser;
    egret.registerClass(HtmlTextParser,'egret.HtmlTextParser');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var InputController = (function (_super) {
        __extends(InputController, _super);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function InputController() {
            _super.call(this);
            /**
             * @private
             */
            this._text = null;
            /**
             * @private
             */
            this._isFocus = false;
        }
        var d = __define,c=InputController,p=c.prototype;
        /**
         *
         * @param text
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.init = function (text) {
            this._text = text;
            this.stageText = new egret.StageText();
            this.stageText.$setTextField(this._text);
        };
        /**
         * @private
         *
         */
        p._addStageText = function () {
            if (!this._text.$inputEnabled) {
                this._text.$touchEnabled = true;
            }
            this.stageText.$addToStage();
            this.stageText.addEventListener("updateText", this.updateTextHandler, this);
            this._text.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this.stageText.addEventListener("blur", this.blurHandler, this);
            this.stageText.addEventListener("focus", this.focusHandler, this);
        };
        /**
         * @private
         *
         */
        p._removeStageText = function () {
            if (!this._text.$inputEnabled) {
                this._text.$touchEnabled = false;
            }
            this.stageText.$removeFromStage();
            this.stageText.removeEventListener("updateText", this.updateTextHandler, this);
            this._text.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this._text.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            this.stageText.removeEventListener("blur", this.blurHandler, this);
            this.stageText.removeEventListener("focus", this.focusHandler, this);
        };
        /**
         * @private
         *
         * @returns
         */
        p._getText = function () {
            return this.stageText.$getText();
        };
        /**
         * @private
         *
         * @param value
         */
        p._setText = function (value) {
            this.stageText.$setText(value);
        };
        /**
         * @private
         */
        p._setColor = function (value) {
            this.stageText.$setColor(value);
        };
        /**
         * @private
         *
         * @param event
         */
        p.focusHandler = function (event) {
            //不再显示竖线，并且输入框显示最开始
            if (!this._isFocus) {
                this._isFocus = true;
                if (!event["showing"]) {
                    this._text.$isTyping = true;
                }
                this._text.$invalidateContentBounds();
                this._text.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_IN, true));
            }
        };
        /**
         * @private
         *
         * @param event
         */
        p.blurHandler = function (event) {
            if (this._isFocus) {
                //不再显示竖线，并且输入框显示最开始
                this._isFocus = false;
                this._text.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
                this._text.$isTyping = false;
                this._text.$invalidateContentBounds();
                //失去焦点后调用
                this.stageText.$onBlur();
                this._text.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_OUT, true));
            }
        };
        //点中文本
        p.onMouseDownHandler = function (event) {
            event.stopPropagation();
            var self = this;
            if (!this._text.visible) {
                return;
            }
            if (this._isFocus) {
                return;
            }
            this._text.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            //强制更新输入框位置
            this.stageText.$show();
        };
        //未点中文本
        p.onStageDownHandler = function (event) {
            this.stageText.$hide();
        };
        /**
         * @private
         *
         * @param event
         */
        p.updateTextHandler = function (event) {
            var values = this._text.$TextField;
            var textValue = this.stageText.$getText();
            var isChanged = false;
            if (values[35 /* restrictAnd */] != null) {
                var reg = new RegExp("[" + values[35 /* restrictAnd */] + "]", "g");
                var result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }
            if (values[36 /* restrictNot */] != null) {
                reg = new RegExp("[^" + values[36 /* restrictNot */] + "]", "g");
                result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }
            if (isChanged && this.stageText.$getText() != textValue) {
                this.stageText.$setText(textValue);
            }
            this.resetText();
            //抛出change事件
            this._text.dispatchEvent(new egret.Event(egret.Event.CHANGE, true));
        };
        /**
         * @private
         *
         */
        p.resetText = function () {
            this._text.$setBaseText(this.stageText.$getText());
        };
        /**
         * @private
         *
         */
        p._hideInput = function () {
            this.stageText.$removeFromStage();
        };
        /**
         * @private
         *
         */
        p.updateInput = function () {
            if (!this._text.$visible && this.stageText) {
                this._hideInput();
            }
        };
        /**
         * @private
         *
         */
        p._updateProperties = function () {
            if (this._isFocus) {
                //整体修改
                this.stageText.$resetStageText();
                this.updateInput();
                return;
            }
            var stage = this._text.$stage;
            if (stage == null) {
            }
            else {
                var item = this._text;
                var visible = item.$visible;
                while (true) {
                    if (!visible) {
                        break;
                    }
                    item = item.parent;
                    if (item == stage) {
                        break;
                    }
                    visible = item.$visible;
                }
            }
            this.stageText.$setText(this._text.$TextField[13 /* text */]);
            //整体修改
            this.stageText.$resetStageText();
            this.updateInput();
        };
        return InputController;
    })(egret.HashObject);
    egret.InputController = InputController;
    egret.registerClass(InputController,'egret.InputController');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    var SplitRegex = new RegExp("(?=[\\u00BF-\\u1FFF\\u2C00-\\uD7FF]|\\b|\\s)(?![。，！、》…）)}”】\\.\\,\\!\\?\\]\\:])");
    /**
     * @language en_US
     * TextField is the text rendering class of egret. It conducts rendering by using the browser / device API. Due to different ways of font rendering in different browsers / devices, there may be differences in the rendering
     * If developers expect  no differences among all platforms, please use BitmapText
     * @see http://docs.egret-labs.org/post/manual/text/createtext.html Create Text
     *
     * @event egret.Event.CHANGE Dispatched when entering text user input。
     * @event egret.FocusEvent.FOCUS_IN Dispatched after the focus to enter text.
     * @event egret.FocusEvent.FOCUS_OUT Enter the text loses focus after dispatch.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/TextField.ts
     */
    /**
     * @language zh_CN
     * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
     * 如果开发者希望所有平台完全无差异，请使用BitmapText
     * @see http://docs.egret-labs.org/post/manual/text/createtext.html 创建文本
     *
     * @event egret.Event.CHANGE 输入文本有用户输入时调度。
     * @event egret.FocusEvent.FOCUS_IN 聚焦输入文本后调度。
     * @event egret.FocusEvent.FOCUS_OUT 输入文本失去焦点后调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/TextField.ts
     */
    var TextField = (function (_super) {
        __extends(TextField, _super);
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function TextField() {
            _super.call(this);
            this.$inputEnabled = false;
            /**
             * @private
             */
            this.inputUtils = null;
            /**
             * @private
             */
            this.bgGraphics = null;
            /**
             * @private
             */
            this.isFlow = false;
            /**
             * @private
             */
            this.textArr = [];
            /**
             * @private
             */
            this.linesArr = [];
            /**
             * @private
             */
            this.$isTyping = false;
            this.drawTempArray = [];
            this.$renderRegion = new egret.sys.Region();
            this.$TextField = {
                0: 30,
                1: 0,
                2: 0xffffff,
                3: NaN,
                4: NaN,
                5: 0,
                6: 0,
                7: 0,
                8: TextField.default_fontFamily,
                9: "left",
                10: "top",
                11: "#ffffff",
                12: "",
                13: "",
                14: [],
                15: false,
                16: false,
                17: true,
                18: false,
                19: false,
                20: false,
                21: 0,
                22: 0,
                23: 0,
                24: egret.TextFieldType.DYNAMIC,
                25: 0x000000,
                26: "#000000",
                27: 0,
                28: -1,
                29: 0,
                30: false,
                31: false,
                32: 0x000000,
                33: false,
                34: 0xffffff,
                35: null,
                36: null //restrictNot
            };
        }
        var d = __define,c=TextField,p=c.prototype;
        /**
         * @private
         *
         * @returns
         */
        p.isInput = function () {
            return this.$TextField[24 /* type */] == egret.TextFieldType.INPUT;
        };
        p.$setTouchEnabled = function (value) {
            var result = _super.prototype.$setTouchEnabled.call(this, value);
            if (this.isInput()) {
                this.$inputEnabled = true;
            }
            return result;
        };
        d(p, "fontFamily"
            /**
             * @language en_US
             * The name of the font to use, or a comma-separated list of font names.
             * @default "sans-serif"
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 要使用的字体的名称或用逗号分隔的字体名称列表。
             * @default "sans-serif"
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[8 /* fontFamily */];
            }
            ,function (value) {
                this.$setFontFamily(value);
            }
        );
        p.$setFontFamily = function (value) {
            var values = this.$TextField;
            if (values[8 /* fontFamily */] == value) {
                return false;
            }
            values[8 /* fontFamily */] = value;
            this.invalidateFontString();
            return true;
        };
        d(p, "size"
            /**
             * @language en_US
             * The size in pixels of text
             * @default 30
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 文本的字号大小。
             * @default 30
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[0 /* fontSize */];
            }
            ,function (value) {
                this.$setSize(value);
            }
        );
        p.$setSize = function (value) {
            value = egret.sys.getNumber(value);
            var values = this.$TextField;
            if (values[0 /* fontSize */] == value) {
                return false;
            }
            values[0 /* fontSize */] = value;
            this.invalidateFontString();
            return true;
        };
        d(p, "bold"
            ///**
            // * @private
            // * @version Egret 2.4
            // * @platform Web,Native
            // */
            //public get fontSize():number {
            //    return this.$TextField[sys.TextKeys.fontSize];
            //}
            //
            ///**
            // * @private
            // */
            //public set fontSize(value:number) {
            //    value = egret.sys.getNumber(value);
            //
            //    var values = this.$TextField;
            //    if (values[sys.TextKeys.fontSize] == value) {
            //        return;
            //    }
            //    values[sys.TextKeys.fontSize] = value;
            //    this.invalidateFontString();
            //}
            /**
             * @language en_US
             * Specifies whether the text is boldface.
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 是否显示为粗体。
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[15 /* bold */];
            }
            ,function (value) {
                this.$setBold(value);
            }
        );
        p.$setBold = function (value) {
            value = !!value;
            var values = this.$TextField;
            if (value == values[15 /* bold */]) {
                return false;
            }
            values[15 /* bold */] = value;
            this.invalidateFontString();
            return true;
        };
        d(p, "italic"
            /**
             * @language en_US
             * Determines whether the text is italic font.
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 是否显示为斜体。
             * @default false
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[16 /* italic */];
            }
            ,function (value) {
                this.$setItalic(value);
            }
        );
        p.$setItalic = function (value) {
            value = !!value;
            var values = this.$TextField;
            if (value == values[16 /* italic */]) {
                return false;
            }
            values[16 /* italic */] = value;
            this.invalidateFontString();
            return true;
        };
        /**
         * @private
         *
         */
        p.invalidateFontString = function () {
            this.$TextField[17 /* fontStringChanged */] = true;
            this.$invalidateTextField();
        };
        /**
         * @private
         * 获取字体信息的字符串形式。
         */
        p.getFontString = function () {
            var values = this.$TextField;
            if (values[17 /* fontStringChanged */]) {
                values[17 /* fontStringChanged */] = false;
                values[12 /* fontString */] = egret.sys.toFontString(this);
            }
            return values[12 /* fontString */];
        };
        d(p, "textAlign"
            /**
             * @language en_US
             * Horizontal alignment of text.
             * @default：egret.HorizontalAlign.LEFT
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 文本的水平对齐方式。
             * @default：egret.HorizontalAlign.LEFT
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[9 /* textAlign */];
            }
            ,function (value) {
                this.$setTextAlign(value);
            }
        );
        p.$setTextAlign = function (value) {
            var values = this.$TextField;
            if (values[9 /* textAlign */] == value) {
                return false;
            }
            values[9 /* textAlign */] = value;
            this.$invalidateTextField();
            return true;
        };
        d(p, "verticalAlign"
            /**
             * @language en_US
             * Vertical alignment of text.
             * @default：egret.VerticalAlign.TOP
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 文字的垂直对齐方式。
             * @default：egret.VerticalAlign.TOP
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[10 /* verticalAlign */];
            }
            ,function (value) {
                this.$setVerticalAlign(value);
            }
        );
        p.$setVerticalAlign = function (value) {
            var values = this.$TextField;
            if (values[10 /* verticalAlign */] == value) {
                return false;
            }
            values[10 /* verticalAlign */] = value;
            this.$invalidateTextField();
            return true;
        };
        d(p, "lineSpacing"
            /**
             * @language en_US
             * An integer representing the amount of vertical space between lines.
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 一个整数，表示行与行之间的垂直间距量
             * @default 0
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[1 /* lineSpacing */];
            }
            ,function (value) {
                this.$setLineSpacing(value);
            }
        );
        p.$setLineSpacing = function (value) {
            value = egret.sys.getNumber(value);
            var values = this.$TextField;
            if (values[1 /* lineSpacing */] == value)
                return false;
            values[1 /* lineSpacing */] = value;
            this.$invalidateTextField();
            return true;
        };
        d(p, "textColor"
            /**
             * @language en_US
             * Color of the text.
             * @default 0x000000
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 文本颜色
             * @default 0x000000
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[2 /* textColor */];
            }
            ,function (value) {
                this.$setTextColor(value);
            }
        );
        p.$setTextColor = function (value) {
            value = +value | 0;
            var values = this.$TextField;
            if (values[2 /* textColor */] == value) {
                return false;
            }
            values[2 /* textColor */] = value;
            values[11 /* textColorString */] = egret.toColorString(value);
            if (this.inputUtils) {
                this.inputUtils._setColor(this.$TextField[2 /* textColor */]);
            }
            this.$invalidate();
            return true;
        };
        d(p, "wordWrap"
            /**
             * @language en_US
             * A Boolean value that indicates whether the text field has word wrap. If the value of wordWrap is true, the text
             * field has word wrap; if the value is false, the text field does not have word wrap.
             * @default true
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 一个布尔值，表示文本字段是否自动换行。如果 wordWrap 的值为 true，则该文本字段自动换行；
             * 如果值为 false，则该文本字段不自动换行,如果同时显式设置过宽度，超出宽度的部分将被截断。
             * @default true
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[19 /* wordWrap */];
            }
            ,function (value) {
                value = !!value;
                var values = this.$TextField;
                if (value == values[19 /* wordWrap */]) {
                    return;
                }
                if (values[20 /* displayAsPassword */]) {
                    return;
                }
                values[19 /* wordWrap */] = value;
                this.$invalidateTextField();
            }
        );
        d(p, "type"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[24 /* type */];
            }
            /**
             * @language en_US
             * Type of the text field.
             * Any one of the following TextFieldType constants: TextFieldType.DYNAMIC (specifies the dynamic text field that users can not edit), or TextFieldType.INPUT (specifies the dynamic text field that users can edit).
             * @default egret.TextFieldType.DYNAMIC
             */
            /**
             * @language zh_CN
             * 文本字段的类型。
             * 以下 TextFieldType 常量中的任一个：TextFieldType.DYNAMIC（指定用户无法编辑的动态文本字段），或 TextFieldType.INPUT（指定用户可以编辑的输入文本字段）。
             * @default egret.TextFieldType.DYNAMIC
             */
            ,function (value) {
                this.$setType(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setType = function (value) {
            if (this.$TextField[24 /* type */] != value) {
                this.$TextField[24 /* type */] = value;
                if (value == egret.TextFieldType.INPUT) {
                    if (isNaN(this.$TextField[3 /* textFieldWidth */])) {
                        this.$setWidth(100);
                    }
                    if (isNaN(this.$TextField[4 /* textFieldHeight */])) {
                        this.$setHeight(30);
                    }
                    this.$setTouchEnabled(true);
                    //创建stageText
                    if (this.inputUtils == null) {
                        this.inputUtils = new egret.InputController();
                    }
                    this.inputUtils.init(this);
                    this.$invalidateTextField();
                    if (this.$stage) {
                        this.inputUtils._addStageText();
                    }
                }
                else {
                    if (this.inputUtils) {
                        this.inputUtils._removeStageText();
                        this.inputUtils = null;
                    }
                    this.$setTouchEnabled(false);
                }
                return true;
            }
            return false;
        };
        d(p, "text"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$getText();
            }
            /**
             * @language en_US
             * Serve as a string of the current text field in the text
             */
            /**
             * @language zh_CN
             * 作为文本字段中当前文本的字符串
             */
            ,function (value) {
                this.$setText(value);
            }
        );
        /**
         * @private
         *
         * @returns
         */
        p.$getText = function () {
            if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                return this.inputUtils._getText();
            }
            return this.$TextField[13 /* text */];
        };
        /**
         * @private
         *
         * @param value
         */
        p.$setBaseText = function (value) {
            if (value == null) {
                value = "";
            }
            value = value.toString();
            this.isFlow = false;
            if (this.$TextField[13 /* text */] != value) {
                this.$invalidateTextField();
                this.$TextField[13 /* text */] = value;
                var text = "";
                if (this.$TextField[20 /* displayAsPassword */]) {
                    text = this.changeToPassText(value);
                }
                else {
                    text = value;
                }
                this.setMiddleStyle([{ text: text }]);
                return true;
            }
            return false;
        };
        /**
         * @private
         *
         * @param value
         */
        p.$setText = function (value) {
            if (value == null) {
                value = "";
            }
            var result = this.$setBaseText(value);
            if (this.inputUtils) {
                this.inputUtils._setText(this.$TextField[13 /* text */]);
            }
            return result;
        };
        d(p, "displayAsPassword"
            /**
             * @language en_US
             * Specify whether the text field is a password text field.
             * If the value of this property is true, the text field is treated as a password text field and hides the input characters using asterisks instead of the actual characters. If false, the text field is not treated as a password text field.
             * @default false
             */
            /**
             * @language zh_CN
             * 指定文本字段是否是密码文本字段。
             * 如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
             * @default false
             */
            ,function () {
                return this.$TextField[20 /* displayAsPassword */];
            }
            ,function (value) {
                this.$setDisplayAsPassword(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setDisplayAsPassword = function (value) {
            var self = this;
            if (this.$TextField[20 /* displayAsPassword */] != value) {
                this.$TextField[20 /* displayAsPassword */] = value;
                this.$invalidateTextField();
                var text = "";
                if (value) {
                    text = this.changeToPassText(this.$TextField[13 /* text */]);
                }
                else {
                    text = this.$TextField[13 /* text */];
                }
                this.setMiddleStyle([{ text: text }]);
                return true;
            }
            return false;
        };
        d(p, "strokeColor"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[25 /* strokeColor */];
            }
            /**
             * @language en_US
             * Represent the stroke color of the text.
             * Contain three 8-bit numbers with RGB color components; for example, 0xFF0000 is red, 0x00FF00 is green.
             * @default 0x000000
             */
            /**
             * @language zh_CN
             * 表示文本的描边颜色。
             * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
             * @default 0x000000
             */
            ,function (value) {
                this.$setStrokeColor(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setStrokeColor = function (value) {
            if (this.$TextField[25 /* strokeColor */] != value) {
                this.$invalidateTextField();
                this.$TextField[25 /* strokeColor */] = value;
                this.$TextField[26 /* strokeColorString */] = egret.toColorString(value);
                return true;
            }
            return false;
        };
        d(p, "stroke"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[27 /* stroke */];
            }
            /**
             * @language en_US
             * Indicate the stroke width.
             * 0 means no stroke.
             * @default 0
             */
            /**
             * @language zh_CN
             * 表示描边宽度。
             * 0为没有描边。
             * @default 0
             */
            ,function (value) {
                this.$setStroke(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setStroke = function (value) {
            if (this.$TextField[27 /* stroke */] != value) {
                this.$invalidateTextField();
                this.$TextField[27 /* stroke */] = value;
                return true;
            }
            return false;
        };
        d(p, "maxChars"
            /**
             * @language en_US
             * The maximum number of characters that the text field can contain, as entered by a user. \n A script can insert more text than maxChars allows; the maxChars property indicates only how much text a user can enter. If the value of this property is 0, a user can enter an unlimited amount of text.
             * The default value is 0.
             * @default 0
             */
            /**
             * @language zh_CN
             * 文本字段中最多可包含的字符数（即用户输入的字符数）。
             * 脚本可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。
             * @default 0
             */
            ,function () {
                return this.$TextField[21 /* maxChars */];
            }
            ,function (value) {
                this.$setMaxChars(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setMaxChars = function (value) {
            if (this.$TextField[21 /* maxChars */] != value) {
                this.$TextField[21 /* maxChars */] = value;
                return true;
            }
            return false;
        };
        d(p, "scrollV"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return Math.min(Math.max(this.$TextField[28 /* scrollV */], 1), this.maxScrollV);
            }
            /**
             * @language en_US
             * Vertical position of text in a text field. scrollV property helps users locate specific passages in a long article, and create scrolling text fields.
             * Vertically scrolling units are lines, and horizontal scrolling unit is pixels.
             * If the first displayed line is the first line in the text field, scrollV is set to 1 (instead of 0).
             */
            /**
             * @language zh_CN
             * 文本在文本字段中的垂直位置。scrollV 属性可帮助用户定位到长篇文章的特定段落，还可用于创建滚动文本字段。
             * 垂直滚动的单位是行，而水平滚动的单位是像素。
             * 如果显示的第一行是文本字段中的第一行，则 scrollV 设置为 1（而非 0）。
             */
            ,function (value) {
                this.$TextField[28 /* scrollV */] = Math.max(value, 1);
                this.$invalidateTextField();
            }
        );
        d(p, "maxScrollV"
            /**
             * @language en_US
             * The maximum value of scrollV
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * scrollV 的最大值
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                this.$getLinesArr();
                return Math.max(this.$TextField[29 /* numLines */] - egret.TextFieldUtils.$getScrollNum(this) + 1, 1);
            }
        );
        d(p, "selectionBeginIndex"
            /**
             * @private
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return 0;
            }
        );
        d(p, "selectionEndIndex"
            /**
             * @private
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return 0;
            }
        );
        d(p, "caretIndex"
            /**
             * @private
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return 0;
            }
        );
        /**
         * @private
         *
         * @param beginIndex
         * @param endIndex
         */
        p.$setSelection = function (beginIndex, endIndex) {
            return false;
        };
        /**
         * @private
         *
         * @returns
         */
        p.$getLineHeight = function () {
            return this.$TextField[1 /* lineSpacing */] + this.$TextField[0 /* fontSize */];
        };
        d(p, "numLines"
            /**
             * @language en_US
             * Number of lines of text.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 文本行数。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                this.$getLinesArr();
                return this.$TextField[29 /* numLines */];
            }
        );
        d(p, "multiline"
            ,function () {
                return this.$TextField[30 /* multiline */];
            }
            /**
             * @language en_US
             * Indicate whether field is a multiline text field. Note that this property is valid only when the type is TextFieldType.INPUT.
             * If the value is true, the text field is multiline; if the value is false, the text field is a single-line text field. In a field of type TextFieldType.INPUT, the multiline value determines whether the Enter key creates a new line (a value of false, and the Enter key is ignored).
             * @default false
             */
            /**
             * @language zh_CN
             * 表示字段是否为多行文本字段。注意，此属性仅在type为TextFieldType.INPUT时才有效。
             * 如果值为 true，则文本字段为多行文本字段；如果值为 false，则文本字段为单行文本字段。在类型为 TextFieldType.INPUT 的字段中，multiline 值将确定 Enter 键是否创建新行（如果值为 false，则将忽略 Enter 键）。
             * @default false
             */
            ,function (value) {
                this.$setMultiline(value);
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setMultiline = function (value) {
            this.$TextField[30 /* multiline */] = value;
            this.$invalidateTextField();
            return true;
        };
        d(p, "restrict"
            ,function () {
                var values = this.$TextField;
                var str = null;
                if (values[35 /* restrictAnd */] != null) {
                    str = values[35 /* restrictAnd */];
                }
                if (values[36 /* restrictNot */] != null) {
                    if (str == null) {
                        str = "";
                    }
                    str += "^" + values[36 /* restrictNot */];
                }
                return str;
            }
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
            ,function (value) {
                var values = this.$TextField;
                if (value == null) {
                    values[35 /* restrictAnd */] = null;
                    values[36 /* restrictNot */] = null;
                }
                else {
                    var index = -1;
                    while (index < value.length) {
                        index = value.indexOf("^", index);
                        if (index == 0) {
                            break;
                        }
                        else if (index > 0) {
                            if (value.charAt(index - 1) != "\\") {
                                break;
                            }
                            index++;
                        }
                        else {
                            break;
                        }
                    }
                    if (index == 0) {
                        values[35 /* restrictAnd */] = null;
                        values[36 /* restrictNot */] = value.substring(index + 1);
                    }
                    else if (index > 0) {
                        values[35 /* restrictAnd */] = value.substring(0, index);
                        values[36 /* restrictNot */] = value.substring(index + 1);
                    }
                    else {
                        values[35 /* restrictAnd */] = value;
                        values[36 /* restrictNot */] = null;
                    }
                }
            }
        );
        /**
         * @private
         *
         * @param value
         */
        p.$setWidth = function (value) {
            var values = this.$TextField;
            if (isNaN(value)) {
                if (isNaN(values[3 /* textFieldWidth */])) {
                    return false;
                }
                values[3 /* textFieldWidth */] = NaN;
            }
            else {
                if (values[3 /* textFieldWidth */] == value) {
                    return false;
                }
                values[3 /* textFieldWidth */] = value;
            }
            value = +value;
            if (value < 0) {
                return false;
            }
            this.$invalidateTextField();
            return true;
        };
        /**
         * @private
         *
         * @param value
         */
        p.$setHeight = function (value) {
            var values = this.$TextField;
            if (isNaN(value)) {
                if (isNaN(values[4 /* textFieldHeight */])) {
                    return false;
                }
                values[4 /* textFieldHeight */] = NaN;
            }
            else {
                if (values[4 /* textFieldHeight */] == value) {
                    return false;
                }
                values[4 /* textFieldHeight */] = value;
            }
            value = +value;
            if (value < 0) {
                return false;
            }
            this.$invalidateTextField();
            return true;
        };
        /**
         * @private
         * 获取显示宽度
         */
        p.$getWidth = function () {
            var values = this.$TextField;
            return isNaN(values[3 /* textFieldWidth */]) ? this.$getContentBounds().width : values[3 /* textFieldWidth */];
        };
        /**
         * @private
         * 获取显示宽度
         */
        p.$getHeight = function () {
            var values = this.$TextField;
            return isNaN(values[4 /* textFieldHeight */]) ? this.$getContentBounds().height : values[4 /* textFieldHeight */];
        };
        d(p, "border"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[31 /* border */];
            }
            /**
             * @language en_US
             * Specifies whether the text field has a border.
             * If true, the text field has a border. If false, the text field has no border.
             * Use borderColor property to set the border color.
             * @default false
             */
            /**
             * @language zh_CN
             * 指定文本字段是否具有边框。
             * 如果为 true，则文本字段具有边框。如果为 false，则文本字段没有边框。
             * 使用 borderColor 属性来设置边框颜色。
             * @default false
             */
            ,function (value) {
                this.$TextField[31 /* border */] = value;
                this.fillBackground();
            }
        );
        d(p, "borderColor"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[32 /* borderColor */];
            }
            /**
             * @language en_US
             * The color of the text field border.
             * Even currently is no border can be retrieved or set this property, but only if the text field has the border property is set to true, the color is visible.
             * @default 0x000000
             */
            /**
             * @language zh_CN
             * 文本字段边框的颜色。
             * 即使当前没有边框，也可检索或设置此属性，但只有当文本字段已将 border 属性设置为 true 时，才可以看到颜色。
             * @default 0x000000
             */
            ,function (value) {
                this.$TextField[32 /* borderColor */] = value;
                this.fillBackground();
            }
        );
        d(p, "background"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[33 /* background */];
            }
            /**
             * @language en_US
             * Specifies whether the text field has a background fill.
             * If true, the text field has a background fill. If false, the text field has no background fill.
             * Use the backgroundColor property to set the background color of the text field.
             * @default false
             */
            /**
             * @language zh_CN
             * 指定文本字段是否具有背景填充。
             * 如果为 true，则文本字段具有背景填充。如果为 false，则文本字段没有背景填充。
             * 使用 backgroundColor 属性来设置文本字段的背景颜色。
             * @default false
             */
            ,function (value) {
                this.$TextField[33 /* background */] = value;
                this.fillBackground();
            }
        );
        d(p, "backgroundColor"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.$TextField[34 /* backgroundColor */];
            }
            /**
             * @language en_US
             * Color of the text field background.
             * Even currently is no background, can be retrieved or set this property, but only if the text field has the background property set to true, the color is visible.
             * @default 0xFFFFFF
             */
            /**
             * @language zh_CN
             * 文本字段背景的颜色。
             * 即使当前没有背景，也可检索或设置此属性，但只有当文本字段已将 background 属性设置为 true 时，才可以看到颜色。
             * @default 0xFFFFFF
             */
            ,function (value) {
                this.$TextField[34 /* backgroundColor */] = value;
                this.fillBackground();
            }
        );
        /**
         * @private
         *
         */
        p.fillBackground = function () {
            var self = this;
            var graphics = self.bgGraphics;
            if (graphics) {
                graphics.clear();
            }
            if (this.$TextField[33 /* background */] || this.$TextField[31 /* border */]) {
                if (graphics == null) {
                    graphics = self.bgGraphics = new egret.Graphics();
                    this.bgGraphics.$renderContext.$targetDisplay = this;
                }
                if (this.$TextField[33 /* background */]) {
                    graphics.beginFill(this.$TextField[34 /* backgroundColor */], 1);
                }
                if (this.$TextField[31 /* border */]) {
                    graphics.lineStyle(1, this.$TextField[32 /* borderColor */]);
                }
                graphics.drawRect(0, 0, self.$getWidth(), self.$getHeight());
                graphics.endFill();
            }
        };
        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setFocus = function () {
            //todo:
            egret.$warn(1013);
        };
        /**
         * @private
         *
         */
        p.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            this.removeEvent();
            if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                this.inputUtils._removeStageText();
            }
        };
        /**
         * @private
         *
         * @param stage
         * @param nestLevel
         */
        p.$onAddToStage = function (stage, nestLevel) {
            _super.prototype.$onAddToStage.call(this, stage, nestLevel);
            this.addEvent();
            if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                this.inputUtils._addStageText();
            }
        };
        /**
         * 不能重写$invalidateContentBounds，因为内部graphics调用clear时会触发$invalidateContentBounds这狗方法，从而导致死循环。
         */
        p.$invalidateTextField = function () {
            this.$invalidateContentBounds();
            this.$TextField[18 /* textLinesChanged */] = true;
        };
        p.$update = function (bounds) {
            var self = this;
            var bounds = self.$getContentBounds();
            var tmpBounds = egret.Rectangle.create();
            tmpBounds.copyFrom(bounds);
            if (self.$TextField[31 /* border */]) {
                tmpBounds.width += 2;
                tmpBounds.height += 2;
            }
            var _strokeDouble = self.$TextField[27 /* stroke */] * 2;
            if (_strokeDouble > 0) {
                tmpBounds.width += _strokeDouble * 2;
                tmpBounds.height += _strokeDouble * 2;
            }
            tmpBounds.x -= _strokeDouble;
            tmpBounds.y -= _strokeDouble;
            var result = _super.prototype.$update.call(this, tmpBounds);
            egret.Rectangle.release(tmpBounds);
            return result;
        };
        /**
         * @private
         */
        p.$measureContentBounds = function (bounds) {
            var self = this;
            this.$getLinesArr();
            var w = !isNaN(this.$TextField[3 /* textFieldWidth */]) ? this.$TextField[3 /* textFieldWidth */] : this.$TextField[5 /* textWidth */];
            var h = !isNaN(this.$TextField[4 /* textFieldHeight */]) ? this.$TextField[4 /* textFieldHeight */] : egret.TextFieldUtils.$getTextHeight(self);
            bounds.setTo(0, 0, w, h);
        };
        /**
         * @private
         * @see egret.DisplayObject._render
         * @param renderContext
         */
        p.$render = function (renderContext) {
            if (this.bgGraphics)
                this.bgGraphics.$render(renderContext);
            if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                if (this.$hasAnyFlags(880 /* InitFlags */) || this.$hasAnyFlags(624 /* DownOnAddedOrRemoved */)) {
                    this.inputUtils._updateProperties();
                }
                if (this.$isTyping) {
                    return;
                }
            }
            else if (this.$TextField[3 /* textFieldWidth */] == 0) {
                return;
            }
            this.drawText(renderContext);
        };
        d(p, "textFlow"
            /**
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.textArr;
            }
            /**
             * @language en_US
             * Set rich text
             */
            /**
             * @language zh_CN
             * 设置富文本
             * @see http://edn.egret.com/cn/index.php/article/index/id/146
             */
            ,function (textArr) {
                this.isFlow = true;
                var text = "";
                if (textArr == null)
                    textArr = [];
                for (var i = 0; i < textArr.length; i++) {
                    var element = textArr[i];
                    text += element.text;
                }
                if (this.$TextField[20 /* displayAsPassword */]) {
                    this.$setBaseText(text);
                }
                else {
                    this.$TextField[13 /* text */] = text;
                    this.setMiddleStyle(textArr);
                }
            }
        );
        /**
         * @private
         *
         * @param text
         * @returns
         */
        p.changeToPassText = function (text) {
            if (this.$TextField[20 /* displayAsPassword */]) {
                var passText = "";
                for (var i = 0, num = text.length; i < num; i++) {
                    switch (text.charAt(i)) {
                        case '\n':
                            passText += "\n";
                            break;
                        case '\r':
                            break;
                        default:
                            passText += '*';
                    }
                }
                return passText;
            }
            return text;
        };
        /**
         * @private
         *
         * @param textArr
         */
        p.setMiddleStyle = function (textArr) {
            this.$TextField[18 /* textLinesChanged */] = true;
            this.textArr = textArr;
            this.$invalidateTextField();
        };
        d(p, "textWidth"
            /**
             * @language en_US
             * Get the text measured width
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 获取文本测量宽度
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                this.$getLinesArr();
                return this.$TextField[5 /* textWidth */];
            }
        );
        d(p, "textHeight"
            /**
             * @language en_US
             * Get Text measuring height
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 获取文本测量高度
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                this.$getLinesArr();
                return egret.TextFieldUtils.$getTextHeight(this);
            }
        );
        /**
         * @private
         * @param text
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.appendText = function (text) {
            this.appendElement({ text: text });
        };
        /**
         * @private
         * @param element
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.appendElement = function (element) {
            var text = this.$TextField[13 /* text */] + element.text;
            if (this.$TextField[20 /* displayAsPassword */]) {
                this.$setBaseText(text);
            }
            else {
                this.$TextField[13 /* text */] = text;
                this.textArr.push(element);
                this.setMiddleStyle(this.textArr);
            }
        };
        /**
         * @private
         *
         * @returns
         */
        p.$getLinesArr = function () {
            var self = this;
            if (!self.$TextField[18 /* textLinesChanged */]) {
                return self.linesArr;
            }
            self.$TextField[18 /* textLinesChanged */] = false;
            var text2Arr = self.textArr;
            var renderContext = egret.sys.sharedRenderContext;
            self.linesArr.length = 0;
            this.$TextField[6 /* textHeight */] = 0;
            this.$TextField[5 /* textWidth */] = 0;
            var textFieldWidth = this.$TextField[3 /* textFieldWidth */];
            //宽度被设置为0
            if (!isNaN(textFieldWidth) && textFieldWidth == 0) {
                this.$TextField[29 /* numLines */] = 0;
                return [{ width: 0, height: 0, charNum: 0, elements: [], hasNextLine: false }];
            }
            if (!self.isFlow) {
                setupFont(renderContext, self);
            }
            var linesArr = self.linesArr;
            var lineW = 0;
            var lineCharNum = 0;
            var lineH = 0;
            var lineCount = 0;
            var lineElement;
            for (var i = 0, text2ArrLength = text2Arr.length; i < text2ArrLength; i++) {
                var element = text2Arr[i];
                element.style = element.style || {};
                var text = element.text.toString();
                var textArr = text.split(/(?:\r\n|\r|\n)/);
                for (var j = 0, textArrLength = textArr.length; j < textArrLength; j++) {
                    if (linesArr[lineCount] == null) {
                        lineElement = { width: 0, height: 0, elements: [], charNum: 0, hasNextLine: false };
                        linesArr[lineCount] = lineElement;
                        lineW = 0;
                        lineH = 0;
                        lineCharNum = 0;
                    }
                    if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                        lineH = this.$TextField[0 /* fontSize */];
                    }
                    else {
                        lineH = Math.max(lineH, element.style.size || this.$TextField[0 /* fontSize */]);
                    }
                    var isNextLine = true;
                    if (textArr[j] == "") {
                        if (j == textArrLength - 1) {
                            isNextLine = false;
                        }
                    }
                    else {
                        if (self.isFlow) {
                            setupFont(renderContext, self, element.style);
                        }
                        var w = renderContext.measureText(textArr[j]).width;
                        if (isNaN(textFieldWidth)) {
                            lineW += w;
                            lineCharNum += textArr[j].length;
                            lineElement.elements.push({
                                width: w,
                                text: textArr[j],
                                style: element.style
                            });
                            if (j == textArrLength - 1) {
                                isNextLine = false;
                            }
                        }
                        else {
                            if (lineW + w <= textFieldWidth) {
                                lineElement.elements.push({
                                    width: w,
                                    text: textArr[j],
                                    style: element.style
                                });
                                lineW += w;
                                lineCharNum += textArr[j].length;
                                if (j == textArrLength - 1) {
                                    isNextLine = false;
                                }
                            }
                            else {
                                var k = 0;
                                var ww = 0;
                                var word = textArr[j];
                                if (this.$TextField[19 /* wordWrap */]) {
                                    var words = word.split(SplitRegex);
                                }
                                else {
                                    words = word.match(/./g);
                                }
                                var wl = words.length;
                                var charNum = 0;
                                for (; k < wl; k++) {
                                    w = renderContext.measureText(words[k]).width;
                                    if (lineW != 0 && lineW + w > textFieldWidth && lineW + k != 0) {
                                        break;
                                    }
                                    charNum += words[k].length;
                                    ww += w;
                                    lineW += w;
                                    lineCharNum += charNum;
                                }
                                if (k > 0) {
                                    lineElement.elements.push({
                                        width: ww,
                                        text: word.substring(0, charNum),
                                        style: element.style
                                    });
                                    var leftWord = word.substring(charNum);
                                    for (var m = 0, lwleng = leftWord.length; m < lwleng; m++) {
                                        if (leftWord.charAt(m) != " ") {
                                            break;
                                        }
                                    }
                                    textArr[j] = leftWord.substring(m);
                                }
                                if (textArr[j] != "") {
                                    j--;
                                    isNextLine = false;
                                }
                            }
                        }
                    }
                    if (isNextLine) {
                        lineCharNum++;
                        lineElement.hasNextLine = true;
                    }
                    if (j < textArr.length - 1) {
                        lineElement.width = lineW;
                        lineElement.height = lineH;
                        lineElement.charNum = lineCharNum;
                        this.$TextField[5 /* textWidth */] = Math.max(this.$TextField[5 /* textWidth */], lineW);
                        this.$TextField[6 /* textHeight */] += lineH;
                        //if (self._type == TextFieldType.INPUT && !self._multiline) {
                        //    self._numLines = linesArr.length;
                        //    return linesArr;
                        //}
                        lineCount++;
                    }
                }
                if (i == text2Arr.length - 1 && lineElement) {
                    lineElement.width = lineW;
                    lineElement.height = lineH;
                    lineElement.charNum = lineCharNum;
                    this.$TextField[5 /* textWidth */] = Math.max(this.$TextField[5 /* textWidth */], lineW);
                    this.$TextField[6 /* textHeight */] += lineH;
                }
            }
            this.$TextField[29 /* numLines */] = linesArr.length;
            this.fillBackground();
            return linesArr;
        };
        /**
         * @private
         * @param renderContext
         * @returns {Rectangle}
         */
        p.drawText = function (renderContext) {
            var self = this;
            var values = this.$TextField;
            //先算出需要的数值
            var lines = self.$getLinesArr();
            if (values[5 /* textWidth */] == 0) {
                return;
            }
            var maxWidth = !isNaN(values[3 /* textFieldWidth */]) ? values[3 /* textFieldWidth */] : values[5 /* textWidth */];
            var textHeight = egret.TextFieldUtils.$getTextHeight(self);
            var drawY = 0;
            var startLine = egret.TextFieldUtils.$getStartLine(self);
            var textFieldHeight = values[4 /* textFieldHeight */];
            if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
                var valign = egret.TextFieldUtils.$getValign(self);
                drawY += valign * (textFieldHeight - textHeight);
            }
            drawY = Math.round(drawY);
            var halign = egret.TextFieldUtils.$getHalign(self);
            var drawX = 0;
            for (var i = startLine, numLinesLength = values[29 /* numLines */]; i < numLinesLength; i++) {
                var line = lines[i];
                var h = line.height;
                drawY += h / 2;
                if (i != startLine) {
                    if (values[24 /* type */] == egret.TextFieldType.INPUT && !values[30 /* multiline */]) {
                        break;
                    }
                    if (!isNaN(textFieldHeight) && drawY > textFieldHeight) {
                        break;
                    }
                }
                drawX = Math.round((maxWidth - line.width) * halign);
                for (var j = 0, elementsLength = line.elements.length; j < elementsLength; j++) {
                    var element = line.elements[j];
                    var size = element.style.size || values[0 /* fontSize */];
                    drawText(renderContext, self, element.text, drawX, drawY + (h - size) / 2, element.width, element.style);
                    if (element.style.underline) {
                        this.drawTempArray.push({ "x": drawX, "y": drawY + (h) / 2, "w": element.width, "c": element.style.textColor });
                    }
                    drawX += element.width;
                }
                drawY += h / 2 + values[1 /* lineSpacing */];
            }
            //渲染下划线
            if (this.drawTempArray.length > 0) {
                renderContext.save();
                renderContext.lineWidth = 2; //必须是2，1的时候显示的线条颜色不对，会偏暗
                for (var i1 = 0; i1 < this.drawTempArray.length; i1++) {
                    var underInfo = this.drawTempArray[i1];
                    var textColor;
                    if (underInfo["c"] != null) {
                        textColor = egret.toColorString(underInfo["c"]);
                    }
                    else {
                        textColor = values[11 /* textColorString */];
                    }
                    renderContext.beginPath(); //清理之前的缓存的路径
                    renderContext.strokeStyle = textColor;
                    renderContext.moveTo(underInfo["x"], underInfo["y"]);
                    renderContext.lineTo(underInfo["x"] + underInfo["w"], underInfo["y"]);
                    renderContext.closePath();
                    renderContext.stroke();
                }
                renderContext.restore();
                this.drawTempArray.length = 0;
            }
        };
        //增加点击事件
        p.addEvent = function () {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
        };
        //释放点击事件
        p.removeEvent = function () {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
        };
        //处理富文本中有href的
        p.onTapHandler = function (e) {
            if (this.$TextField[24 /* type */] == egret.TextFieldType.INPUT) {
                return;
            }
            var ele = egret.TextFieldUtils.$getTextElement(this, e.localX, e.localY);
            if (ele == null) {
                return;
            }
            var style = ele.style;
            if (style && style.href) {
                if (style.href.match(/^event:/)) {
                    var type = style.href.match(/^event:/)[0];
                    egret.TextEvent.dispatchTextEvent(this, egret.TextEvent.LINK, style.href.substring(type.length));
                }
                else {
                    open(style.href, style.target || "_blank");
                }
            }
        };
        /**
         * @language en_US
         * default fontFamily
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 默认文本字体
         * @version Egret 2.4
         * @platform Web,Native
         */
        TextField.default_fontFamily = "Arial";
        return TextField;
    })(egret.DisplayObject);
    egret.TextField = TextField;
    egret.registerClass(TextField,'egret.TextField');
    /**
     * @private
     *
     * @param renderContext
     * @param textfield
     * @param text
     * @param x
     * @param y
     * @param maxWidth
     * @param style
     */
    function drawText(renderContext, textfield, text, x, y, maxWidth, style) {
        if (style === void 0) { style = null; }
        setupFont(renderContext, textfield, style);
        style = style || {};
        var textColor;
        if (style.textColor != null) {
            textColor = egret.toColorString(style.textColor);
        }
        else {
            textColor = textfield.$TextField[11 /* textColorString */];
        }
        var strokeColor;
        if (style.strokeColor != null) {
            strokeColor = egret.toColorString(style.strokeColor);
        }
        else {
            strokeColor = textfield.$TextField[26 /* strokeColorString */];
        }
        var outline;
        if (style.stroke != null) {
            outline = style.stroke;
        }
        else {
            outline = textfield.$TextField[27 /* stroke */];
        }
        renderContext.fillStyle = textColor;
        renderContext.strokeStyle = strokeColor;
        if (outline) {
            renderContext.lineWidth = outline * 2;
            renderContext.strokeText(text, x, y, maxWidth || 0xFFFF);
        }
        renderContext.fillText(text, x, y, maxWidth || 0xFFFF);
    }
    /**
     * @private
     *
     * @param renderContext
     * @param textField
     * @param style
     */
    function setupFont(renderContext, textField, style) {
        if (style === void 0) { style = null; }
        style = style || {};
        var italic = style.italic == null ? textField.$TextField[16 /* italic */] : style.italic;
        var bold = style.bold == null ? textField.$TextField[15 /* bold */] : style.bold;
        var size = style.size == null ? textField.$TextField[0 /* fontSize */] : style.size;
        var fontFamily = style.fontFamily || textField.$TextField[8 /* fontFamily */] || TextField.default_fontFamily;
        var font = italic ? "italic " : "normal ";
        font += bold ? "bold " : "normal ";
        font += size + "px " + fontFamily;
        renderContext.font = font;
        renderContext.textAlign = "left";
        renderContext.textBaseline = "middle";
    }
})(egret || (egret = {}));
var egret;
(function (egret) {
    var sys;
    (function (sys) {
        /**
         * @private
         * 返回格式化的字体样式文本
         */
        function toFontString(style) {
            var font = "";
            if (style.italic)
                font += "italic ";
            if (style.bold)
                font += "bold ";
            font += (style.fontSize || 12) + "px ";
            font += (style.fontFamily || "sans-serif");
            return font;
        }
        sys.toFontString = toFontString;
        if (DEBUG) {
            egret.$markReadOnly(egret.TextField, "numLines");
            egret.$markReadOnly(egret.TextField, "textWidth");
            egret.$markReadOnly(egret.TextField, "textHeight");
        }
    })(sys = egret.sys || (egret.sys = {}));
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * TextFieldType class is an enumeration of constant value used in setting the type property of the TextField class.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * TextFieldType 类是在设置 TextField 类的 type 属性时使用的常数值的枚举。
     * @version Egret 2.4
     * @platform Web,Native
     */
    var TextFieldType = (function () {
        function TextFieldType() {
        }
        var d = __define,c=TextFieldType,p=c.prototype;
        /**
         * @language en_US
         * Used to specify dynamic text
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于指定动态文本
         * @version Egret 2.4
         * @platform Web,Native
         */
        TextFieldType.DYNAMIC = "dynamic";
        /**
         * @language en_US
         * Used to specify the input text
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于指定输入文本
         * @version Egret 2.4
         * @platform Web,Native
         */
        TextFieldType.INPUT = "input";
        return TextFieldType;
    })();
    egret.TextFieldType = TextFieldType;
    egret.registerClass(TextFieldType,'egret.TextFieldType');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    var TextFieldUtils = (function () {
        function TextFieldUtils() {
        }
        var d = __define,c=TextFieldUtils,p=c.prototype;
        /**
         * 获取第一个绘制的行数
         * @param textfield 文本
         * @returns {number} 行数，从0开始
         * @private
         */
        TextFieldUtils.$getStartLine = function (textfield) {
            var values = textfield.$TextField;
            var textHeight = TextFieldUtils.$getTextHeight(textfield);
            var startLine = 0;
            var textFieldHeight = values[4 /* textFieldHeight */];
            if (!isNaN(textFieldHeight)) {
                if (textHeight < textFieldHeight) {
                }
                else if (textHeight > textFieldHeight) {
                    startLine = Math.max(values[28 /* scrollV */] - 1, 0);
                    startLine = Math.min(values[29 /* numLines */] - 1, startLine);
                }
                if (!values[30 /* multiline */]) {
                    startLine = Math.max(values[28 /* scrollV */] - 1, 0);
                    if (values[29 /* numLines */] > 0) {
                        startLine = Math.min(values[29 /* numLines */] - 1, startLine);
                    }
                }
            }
            return startLine;
        };
        /**
         * 获取水平比例
         * @param textfield 文本
         * @returns {number} 水平比例
         * @private
         */
        TextFieldUtils.$getHalign = function (textfield) {
            var lineArr = textfield.$getLinesArr();
            var halign = 0;
            if (textfield.$TextField[9 /* textAlign */] == egret.HorizontalAlign.CENTER) {
                halign = 0.5;
            }
            else if (textfield.$TextField[9 /* textAlign */] == egret.HorizontalAlign.RIGHT) {
                halign = 1;
            }
            if (textfield.$TextField[24 /* type */] == egret.TextFieldType.INPUT && !textfield.$TextField[30 /* multiline */] && lineArr.length > 1) {
                halign = 0;
            }
            return halign;
        };
        /**
         * @private
         *
         * @param textfield
         * @returns
         */
        TextFieldUtils.$getTextHeight = function (textfield) {
            var textHeight = (egret.TextFieldType.INPUT == textfield.$TextField[24 /* type */]
                && !textfield.$TextField[30 /* multiline */]) ? textfield.$TextField[0 /* fontSize */] : (textfield.$TextField[6 /* textHeight */] + (textfield.$TextField[29 /* numLines */] - 1) * textfield.$TextField[1 /* lineSpacing */]);
            return textHeight;
        };
        /**
         * 获取垂直比例
         * @param textfield 文本
         * @returns {number} 垂直比例
         * @private
         */
        TextFieldUtils.$getValign = function (textfield) {
            var textHeight = TextFieldUtils.$getTextHeight(textfield);
            //if (textfield.$TextField[sys.TextKeys.type] == egret.TextFieldType.INPUT) {
            //    if (textfield.$TextField[sys.TextKeys.multiline]) {
            //return 0;
            //}
            //return 0.5;
            //}
            var textFieldHeight = textfield.$TextField[4 /* textFieldHeight */];
            if (!isNaN(textFieldHeight)) {
                if (textHeight < textFieldHeight) {
                    var valign = 0;
                    if (textfield.$TextField[10 /* verticalAlign */] == egret.VerticalAlign.MIDDLE)
                        valign = 0.5;
                    else if (textfield.$TextField[10 /* verticalAlign */] == egret.VerticalAlign.BOTTOM)
                        valign = 1;
                    return valign;
                }
            }
            return 0;
        };
        /**
         * 根据x、y获取文本项
         * @param textfield 文本
         * @param x x坐标值
         * @param y y坐标值
         * @returns 文本单项
         * @private
         */
        TextFieldUtils.$getTextElement = function (textfield, x, y) {
            var hitTextEle = TextFieldUtils.$getHit(textfield, x, y);
            var lineArr = textfield.$getLinesArr();
            if (hitTextEle && lineArr[hitTextEle.lineIndex] && lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex]) {
                return lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex];
            }
            return null;
        };
        /**
         * 获取文本点击块
         * @param textfield 文本
         * @param x x坐标值
         * @param y y坐标值
         * @returns 文本点击块
         * @private
         */
        TextFieldUtils.$getHit = function (textfield, x, y) {
            var lineArr = textfield.$getLinesArr();
            if (textfield.$TextField[3 /* textFieldWidth */] == 0) {
                return null;
            }
            var line = 0;
            var textHeight = TextFieldUtils.$getTextHeight(textfield);
            var startY = 0;
            var textFieldHeight = textfield.$TextField[4 /* textFieldHeight */];
            if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
                var valign = TextFieldUtils.$getValign(textfield);
                startY = valign * (textFieldHeight - textHeight);
                if (startY != 0) {
                    y -= startY;
                }
            }
            var startLine = TextFieldUtils.$getStartLine(textfield);
            var lineH = 0;
            for (var i = startLine; i < lineArr.length; i++) {
                var lineEle = lineArr[i];
                if (lineH + lineEle.height >= y) {
                    line = i + 1;
                    break;
                }
                else {
                    lineH += lineEle.height;
                }
                if (lineH + textfield.$TextField[1 /* lineSpacing */] > y) {
                    return null;
                }
                lineH += textfield.$TextField[1 /* lineSpacing */];
            }
            if (line == 0) {
                return null;
            }
            var lineElement = lineArr[line - 1];
            var lineW = 0;
            for (i = 0; i < lineElement.elements.length; i++) {
                var iwTE = lineElement.elements[i];
                if (lineW + iwTE.width < x) {
                    lineW += iwTE.width;
                }
                else {
                    return { "lineIndex": line - 1, "textElementIndex": i };
                }
            }
            return null;
        };
        /**
         * 获取当前显示多少行
         * @param textfield 文本
         * @returns {number} 显示的行数
         * @private
         */
        TextFieldUtils.$getScrollNum = function (textfield) {
            var scrollNum = 1;
            if (textfield.$TextField[30 /* multiline */]) {
                var height = textfield.height;
                var size = textfield.size;
                var lineSpacing = textfield.lineSpacing;
                scrollNum = Math.floor(height / (size + lineSpacing));
                var leftH = height - (size + lineSpacing) * scrollNum;
                if (leftH > size / 2) {
                    scrollNum++;
                }
            }
            return scrollNum;
        };
        return TextFieldUtils;
    })();
    egret.TextFieldUtils = TextFieldUtils;
    egret.registerClass(TextFieldUtils,'egret.TextFieldUtils');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The VerticalAlign class defines the possible values for the vertical alignment.
     * @see egret.TextField#verticalAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * VerticalAlign 类为垂直对齐方式定义可能的值。
     * @see egret.TextField#verticalAlign
     * @version Egret 2.4
     * @platform Web,Native
     */
    var VerticalAlign = (function () {
        function VerticalAlign() {
        }
        var d = __define,c=VerticalAlign,p=c.prototype;
        /**
         * @language en_US
         * Vertically align content to the top of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将内容与容器的顶部对齐。
         * @version Egret 2.4
         * @platform Web,Native
         */
        VerticalAlign.TOP = "top";
        /**
         * @language en_US
         * Vertically align content to the bottom of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将内容与容器的底部对齐。
         * @version Egret 2.4
         * @platform Web,Native
         */
        VerticalAlign.BOTTOM = "bottom";
        /**
         * @language en_US
         * Vertically align content in the middle of the container.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在容器的垂直中心对齐内容。
         * @version Egret 2.4
         * @platform Web,Native
         */
        VerticalAlign.MIDDLE = "middle";
        /**
         * @language en_US
         * Vertical alignment with both edges
         * Note: TextFiled does not support this alignment method."
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 垂直两端对齐
         * 注意：TextFiled不支持此对齐方式。
         * @version Egret 2.4
         * @platform Web,Native
         */
        VerticalAlign.JUSTIFY = "justify";
        /**
         * @language en_US
         * Align the content of the child items, relative to the container. This operation will adjust uniformly the size of all the child items to be the Content Height \" of the container \".
         * The Content Height \" of the container \" is the size of the max. child item. If the size of all child items are less than the height of the container, they will be adjusted to the height of the container.
         * Note: TextFiled does not support this alignment method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 相对于容器对子项进行内容对齐。这会将所有子项的大小统一调整为容器的"内容高度"。
         * 容器的"内容高度"是最大子项的大小,如果所有子项都小于容器的高度，则会将所有子项的大小调整为容器的高度。
         * 注意：TextFiled不支持此对齐方式。
         * @version Egret 2.4
         * @platform Web,Native
         */
        VerticalAlign.CONTENT_JUSTIFY = "contentJustify";
        return VerticalAlign;
    })();
    egret.VerticalAlign = VerticalAlign;
    egret.registerClass(VerticalAlign,'egret.VerticalAlign');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The Endian class contains values that denote the byte order used to represent multibyte numbers.
     * The byte order is either bigEndian (most significant byte first) or littleEndian (least significant byte first).
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Endian 类中包含一些值，它们表示用于表示多字节数字的字节顺序。
     * 字节顺序为 bigEndian（最高有效字节位于最前）或 littleEndian（最低有效字节位于最前）。
     * @version Egret 2.4
     * @platform Web,Native
     */
    var Endian = (function () {
        function Endian() {
        }
        var d = __define,c=Endian,p=c.prototype;
        /**
         * @language en_US
         * Indicates the least significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte). The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示多字节数字的最低有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Endian.LITTLE_ENDIAN = "littleEndian";
        /**
         * @language en_US
         * Indicates the most significant byte of the multibyte number appears first in the sequence of bytes.
         * The hexadecimal number 0x12345678 has 4 bytes (2 hexadecimal digits per byte).  The most significant byte is 0x12. The least significant byte is 0x78. (For the equivalent decimal number, 305419896, the most significant digit is 3, and the least significant digit is 6).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示多字节数字的最高有效字节位于字节序列的最前面。
         * 十六进制数字 0x12345678 包含 4 个字节（每个字节包含 2 个十六进制数字）。最高有效字节为 0x12。最低有效字节为 0x78。（对于等效的十进制数字 305419896，最高有效数字是 3，最低有效数字是 6）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        Endian.BIG_ENDIAN = "bigEndian";
        return Endian;
    })();
    egret.Endian = Endian;
    egret.registerClass(Endian,'egret.Endian');
    /**
     * @language en_US
     * The ByteArray class provides methods and attributes for optimized reading and writing as well as dealing with binary data.
     * Note: The ByteArray class is applied to the advanced developers who need to access data at the byte layer.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    /**
     * @language zh_CN
     * ByteArray 类提供用于优化读取、写入以及处理二进制数据的方法和属性。
     * 注意：ByteArray 类适用于需要在字节层访问数据的高级开发人员。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/ByteArray.ts
     */
    var ByteArray = (function () {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        function ByteArray(buffer) {
            /**
             * @private
             */
            this.BUFFER_EXT_SIZE = 0; //Buffer expansion size
            /**
             * @private
             */
            this.EOF_byte = -1;
            /**
             * @private
             */
            this.EOF_code_point = -1;
            this._setArrayBuffer(buffer || new ArrayBuffer(this.BUFFER_EXT_SIZE));
            this.endian = Endian.BIG_ENDIAN;
        }
        var d = __define,c=ByteArray,p=c.prototype;
        /**
         * @private
         * @param buffer
         */
        p._setArrayBuffer = function (buffer) {
            this.write_position = buffer.byteLength;
            this.data = new DataView(buffer);
            this._position = 0;
        };
        /**
         * @deprecated
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.setArrayBuffer = function (buffer) {
        };
        d(p, "buffer"
            ,function () {
                return this.data.buffer;
            }
            /**
             * @private
             */
            ,function (value) {
                this.data = new DataView(value);
            }
        );
        d(p, "dataView"
            /**
             * @private
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.data;
            }
            /**
             * @private
             */
            ,function (value) {
                this.data = value;
                this.write_position = value.byteLength;
            }
        );
        d(p, "bufferOffset"
            /**
             * @private
             */
            ,function () {
                return this.data.byteOffset;
            }
        );
        d(p, "position"
            /**
             * @language en_US
             * The current position of the file pointer (in bytes) to move or return to the ByteArray object. The next time you start reading reading method call in this position, or will start writing in this position next time call a write method.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 将文件指针的当前位置（以字节为单位）移动或返回到 ByteArray 对象中。下一次调用读取方法时将在此位置开始读取，或者下一次调用写入方法时将在此位置开始写入。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._position;
            }
            ,function (value) {
                //if (this._position < value) {
                //    if (!this.validate(value - this._position)) {
                //        return;
                //    }
                //}
                this._position = value;
                this.write_position = value > this.write_position ? value : this.write_position;
            }
        );
        d(p, "length"
            /**
             * @language en_US
             * The length of the ByteArray object (in bytes).
                      * If the length is set to be larger than the current length, the right-side zero padding byte array.
                      * If the length is set smaller than the current length, the byte array is truncated.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * ByteArray 对象的长度（以字节为单位）。
             * 如果将长度设置为大于当前长度的值，则用零填充字节数组的右侧。
             * 如果将长度设置为小于当前长度的值，将会截断该字节数组。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.write_position;
            }
            ,function (value) {
                this.write_position = value;
                var tmp = new Uint8Array(new ArrayBuffer(value));
                var byteLength = this.data.buffer.byteLength;
                if (byteLength > value) {
                    this._position = value;
                }
                var length = Math.min(byteLength, value);
                tmp.set(new Uint8Array(this.data.buffer, 0, length));
                this.buffer = tmp.buffer;
            }
        );
        d(p, "bytesAvailable"
            /**
             * @language en_US
             * The number of bytes that can be read from the current position of the byte array to the end of the array data.
             * When you access a ByteArray object, the bytesAvailable property in conjunction with the read methods each use to make sure you are reading valid data.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 可从字节数组的当前位置到数组末尾读取的数据的字节数。
             * 每次访问 ByteArray 对象时，将 bytesAvailable 属性与读取方法结合使用，以确保读取有效的数据。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this.data.byteLength - this._position;
            }
        );
        /**
         * @language en_US
         * Clears the contents of the byte array and resets the length and position properties to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清除字节数组的内容，并将 length 和 position 属性重置为 0。

         * @version Egret 2.4
         * @platform Web,Native
         */
        p.clear = function () {
            this._setArrayBuffer(new ArrayBuffer(this.BUFFER_EXT_SIZE));
        };
        /**
         * @language en_US
         * Read a Boolean value from the byte stream. Read a simple byte. If the byte is non-zero, it returns true; otherwise, it returns false.
         * @return If the byte is non-zero, it returns true; otherwise, it returns false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取布尔值。读取单个字节，如果字节非零，则返回 true，否则返回 false
         * @return 如果字节不为零，则返回 true，否则返回 false
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readBoolean = function () {
            if (!this.validate(ByteArray.SIZE_OF_BOOLEAN))
                return null;
            return this.data.getUint8(this.position++) != 0;
        };
        /**
         * @language en_US
         * Read signed bytes from the byte stream.
         * @return An integer ranging from -128 to 127
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取带符号的字节
         * @return 介于 -128 和 127 之间的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readByte = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT8))
                return null;
            return this.data.getInt8(this.position++);
        };
        /**
         * @language en_US
         * Read data byte number specified by the length parameter from the byte stream. Starting from the position specified by offset, read bytes into the ByteArray object specified by the bytes parameter, and write bytes into the target ByteArray
         * @param bytes ByteArray object that data is read into
         * @param offset Offset (position) in bytes. Read data should be written from this position
         * @param length Byte number to be read Default value 0 indicates reading all available data
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取 length 参数指定的数据字节数。从 offset 指定的位置开始，将字节读入 bytes 参数指定的 ByteArray 对象中，并将字节写入目标 ByteArray 中
         * @param bytes 要将数据读入的 ByteArray 对象
         * @param offset bytes 中的偏移（位置），应从该位置写入读取的数据
         * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            if (length == 0) {
                length = this.bytesAvailable;
            }
            else if (!this.validate(length)) {
                return null;
            }
            if (bytes) {
                bytes.validateBuffer(offset + length);
            }
            else {
                bytes = new ByteArray(new ArrayBuffer(offset + length));
            }
            //This method is expensive
            for (var i = 0; i < length; i++) {
                bytes.data.setUint8(i + offset, this.data.getUint8(this.position++));
            }
        };
        /**
         * @language en_US
         * Read an IEEE 754 double-precision (64 bit) floating point number from the byte stream
         * @return Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 双精度（64 位）浮点数
         * @return 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readDouble = function () {
            if (!this.validate(ByteArray.SIZE_OF_FLOAT64))
                return null;
            var value = this.data.getFloat64(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT64;
            return value;
        };
        /**
         * @language en_US
         * Read an IEEE 754 single-precision (32 bit) floating point number from the byte stream
         * @return Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 IEEE 754 单精度（32 位）浮点数
         * @return 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readFloat = function () {
            if (!this.validate(ByteArray.SIZE_OF_FLOAT32))
                return null;
            var value = this.data.getFloat32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT32;
            return value;
        };
        /**
         * @language en_US
         * Read a 32-bit signed integer from the byte stream.
         * @return A 32-bit signed integer ranging from -2147483648 to 2147483647
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 32 位整数
         * @return 介于 -2147483648 和 2147483647 之间的 32 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readInt = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT32))
                return null;
            var value = this.data.getInt32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT32;
            return value;
        };
        ///**
        // * 使用指定的字符集从字节流中读取指定长度的多字节字符串
        // * @param length 要从字节流中读取的字节数
        // * @param charSet 表示用于解释字节的字符集的字符串。可能的字符集字符串包括 "shift-jis"、"cn-gb"、"iso-8859-1"”等
        // * @return UTF-8 编码的字符串
        // * @method egret.ByteArray#readMultiByte
        // */
        //public readMultiByte(length:number, charSet?:string):string {
        //    if (!this.validate(length)) return null;
        //
        //    return "";
        //}
        /**
         * @language en_US
         * Read a 16-bit signed integer from the byte stream.
         * @return A 16-bit signed integer ranging from -32768 to 32767
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个带符号的 16 位整数
         * @return 介于 -32768 和 32767 之间的 16 位带符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readShort = function () {
            if (!this.validate(ByteArray.SIZE_OF_INT16))
                return null;
            var value = this.data.getInt16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT16;
            return value;
        };
        /**
         * @language en_US
         * Read unsigned bytes from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 255
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取无符号的字节
         * @return 介于 0 和 255 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUnsignedByte = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT8))
                return null;
            return this.data.getUint8(this.position++);
        };
        /**
         * @language en_US
         * Read a 32-bit unsigned integer from the byte stream.
         * @return A 32-bit unsigned integer ranging from 0 to 4294967295
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 32 位整数
         * @return 介于 0 和 4294967295 之间的 32 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUnsignedInt = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT32))
                return null;
            var value = this.data.getUint32(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT32;
            return value;
        };
        /**
         * @language en_US
         * Read a 16-bit unsigned integer from the byte stream.
         * @return A 16-bit unsigned integer ranging from 0 to 65535
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个无符号的 16 位整数
         * @return 介于 0 和 65535 之间的 16 位无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUnsignedShort = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT16))
                return null;
            var value = this.data.getUint16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            return value;
        };
        /**
         * @language en_US
         * Read a UTF-8 character string from the byte stream Assume that the prefix of the character string is a short unsigned integer (use byte to express length)
         * @return UTF-8 character string
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个 UTF-8 字符串。假定字符串的前缀是无符号的短整型（以字节表示长度）
         * @return UTF-8 编码的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUTF = function () {
            if (!this.validate(ByteArray.SIZE_OF_UINT16))
                return null;
            var length = this.data.getUint16(this.position, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            if (length > 0) {
                return this.readUTFBytes(length);
            }
            else {
                return "";
            }
        };
        /**
         * @language en_US
         * Read a UTF-8 byte sequence specified by the length parameter from the byte stream, and then return a character string
         * @param Specify a short unsigned integer of the UTF-8 byte length
         * @return A character string consists of UTF-8 bytes of the specified length
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从字节流中读取一个由 length 参数指定的 UTF-8 字节序列，并返回一个字符串
         * @param length 指明 UTF-8 字节长度的无符号短整型数
         * @return 由指定长度的 UTF-8 字节组成的字符串
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.readUTFBytes = function (length) {
            if (!this.validate(length))
                return null;
            var bytes = new Uint8Array(this.buffer, this.bufferOffset + this.position, length);
            this.position += length;
            /*var bytes: Uint8Array = new Uint8Array(new ArrayBuffer(length));
             for (var i = 0; i < length; i++) {
             bytes[i] = this.data.getUint8(this.position++);
             }*/
            return this.decodeUTF8(bytes);
        };
        /**
         * @language en_US
         * Write a Boolean value. A single byte is written according to the value parameter. If the value is true, write 1; if the value is false, write 0.
         * @param value A Boolean value determining which byte is written. If the value is true, write 1; if the value is false, write 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 写入布尔值。根据 value 参数写入单个字节。如果为 true，则写入 1，如果为 false，则写入 0
         * @param value 确定写入哪个字节的布尔值。如果该参数为 true，则该方法写入 1；如果该参数为 false，则该方法写入 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeBoolean = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_BOOLEAN);
            this.data.setUint8(this.position++, value ? 1 : 0);
        };
        /**
         * @language en_US
         * Write a byte into the byte stream
         * The low 8 bits of the parameter are used. The high 24 bits are ignored.
         * @param value A 32-bit integer. The low 8 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个字节
         * 使用参数的低 8 位。忽略高 24 位
         * @param value 一个 32 位整数。低 8 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeByte = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT8);
            this.data.setInt8(this.position++, value);
        };
        /**
         * @language en_US
         * Write the byte sequence that includes length bytes in the specified byte array, bytes, (starting at the byte specified by offset, using a zero-based index), into the byte stream
         * If the length parameter is omitted, the default length value 0 is used and the entire buffer starting at offset is written. If the offset parameter is also omitted, the entire buffer is written
         * If the offset or length parameter is out of range, they are clamped to the beginning and end of the bytes array.
         * @param bytes ByteArray Object
         * @param offset A zero-based index specifying the position into the array to begin writing
         * @param length An unsigned integer specifying how far into the buffer to write
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定字节数组 bytes（起始偏移量为 offset，从零开始的索引）中包含 length 个字节的字节序列写入字节流
         * 如果省略 length 参数，则使用默认长度 0；该方法将从 offset 开始写入整个缓冲区。如果还省略了 offset 参数，则写入整个缓冲区
         * 如果 offset 或 length 超出范围，它们将被锁定到 bytes 数组的开头和结尾
         * @param bytes ByteArray 对象
         * @param offset 从 0 开始的索引，表示在数组中开始写入的位置
         * @param length 一个无符号整数，表示在缓冲区中的写入范围
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeBytes = function (bytes, offset, length) {
            if (offset === void 0) { offset = 0; }
            if (length === void 0) { length = 0; }
            var writeLength;
            if (offset < 0) {
                return;
            }
            if (length < 0) {
                return;
            }
            else if (length == 0) {
                writeLength = bytes.length - offset;
            }
            else {
                writeLength = Math.min(bytes.length - offset, length);
            }
            if (writeLength > 0) {
                this.validateBuffer(writeLength);
                var tmp_data = new DataView(bytes.buffer);
                var length = writeLength;
                for (var i = 0; 8 < length; length -= 8, i += 8) {
                    this.data.setFloat64(this._position, tmp_data.getFloat64(i + offset));
                    this.position += 8;
                }
                for (var j = 0; 0 < length; length--, j++) {
                    this.data.setUint8(this.position++, tmp_data.getUint8(i + j + offset));
                }
            }
        };
        /**
         * @language en_US
         * Write an IEEE 754 double-precision (64 bit) floating point number into the byte stream
         * @param value Double-precision (64 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 双精度（64 位）浮点数
         * @param value 双精度（64 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeDouble = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_FLOAT64);
            this.data.setFloat64(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT64;
        };
        /**
         * @language en_US
         * Write an IEEE 754 single-precision (32 bit) floating point number into the byte stream
         * @param value Single-precision (32 bit) floating point number
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 IEEE 754 单精度（32 位）浮点数
         * @param value 单精度（32 位）浮点数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeFloat = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_FLOAT32);
            this.data.setFloat32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_FLOAT32;
        };
        /**
         * @language en_US
         * Write a 32-bit signed integer into the byte stream
         * @param value An integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个带符号的 32 位整数
         * @param value 要写入字节流的整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeInt = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT32);
            this.data.setInt32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT32;
        };
        /**
         * @language en_US
         * Write a 16-bit integer into the byte stream. The low 16 bits of the parameter are used. The high 16 bits are ignored.
         * @param value A 32-bit integer. Its low 16 bits will be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个 16 位整数。使用参数的低 16 位。忽略高 16 位
         * @param value 32 位整数，该整数的低 16 位将被写入字节流
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeShort = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_INT16);
            this.data.setInt16(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_INT16;
        };
        /**
         * @language en_US
         * Write a 32-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 32 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeUnsignedInt = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_UINT32);
            this.data.setUint32(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT32;
        };
        /**
         * @language en_US
         * Write a 16-bit unsigned integer into the byte stream
         * @param value An unsigned integer to be written into the byte stream
         * @version Egret 2.5
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在字节流中写入一个无符号的 16 位整数
         * @param value 要写入字节流的无符号整数
         * @version Egret 2.5
         * @platform Web,Native
         */
        p.writeUnsignedShort = function (value) {
            this.validateBuffer(ByteArray.SIZE_OF_UINT16);
            this.data.setUint16(this.position, value, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
        };
        /**
         * @language en_US
         * Write a UTF-8 string into the byte stream. The length of the UTF-8 string in bytes is written first, as a 16-bit integer, followed by the bytes representing the characters of the string
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。先写入以字节表示的 UTF-8 字符串长度（作为 16 位整数），然后写入表示字符串字符的字节
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeUTF = function (value) {
            var utf8bytes = this.encodeUTF8(value);
            var length = utf8bytes.length;
            this.validateBuffer(ByteArray.SIZE_OF_UINT16 + length);
            this.data.setUint16(this.position, length, this.endian == Endian.LITTLE_ENDIAN);
            this.position += ByteArray.SIZE_OF_UINT16;
            this._writeUint8Array(utf8bytes, false);
        };
        /**
         * @language en_US
         * Write a UTF-8 string into the byte stream. Similar to the writeUTF() method, but the writeUTFBytes() method does not prefix the string with a 16-bit length word
         * @param value Character string value to be written
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 UTF-8 字符串写入字节流。类似于 writeUTF() 方法，但 writeUTFBytes() 不使用 16 位长度的词为字符串添加前缀
         * @param value 要写入的字符串值
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.writeUTFBytes = function (value) {
            this._writeUint8Array(this.encodeUTF8(value));
        };
        /**
         *
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.toString = function () {
            return "[ByteArray] length:" + this.length + ", bytesAvailable:" + this.bytesAvailable;
        };
        /**
         * @private
         * 将 Uint8Array 写入字节流
         * @param bytes 要写入的Uint8Array
         * @param validateBuffer
         */
        p._writeUint8Array = function (bytes, validateBuffer) {
            if (validateBuffer === void 0) { validateBuffer = true; }
            if (validateBuffer) {
                this.validateBuffer(this.position + bytes.length);
            }
            for (var i = 0; i < bytes.length; i++) {
                this.data.setUint8(this.position++, bytes[i]);
            }
        };
        /**
         * @param len
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         */
        p.validate = function (len) {
            //len += this.data.byteOffset;
            if (this.data.byteLength > 0 && this._position + len <= this.data.byteLength) {
                return true;
            }
            else {
                egret.$error(1025);
            }
        };
        /**********************/
        /*  PRIVATE METHODS   */
        /**********************/
        /**
         * @private
         * @param len
         * @param needReplace
         */
        p.validateBuffer = function (len, needReplace) {
            if (needReplace === void 0) { needReplace = false; }
            this.write_position = len > this.write_position ? len : this.write_position;
            len += this._position;
            if (this.data.byteLength < len || needReplace) {
                var tmp = new Uint8Array(new ArrayBuffer(len + this.BUFFER_EXT_SIZE));
                var length = Math.min(this.data.buffer.byteLength, len + this.BUFFER_EXT_SIZE);
                tmp.set(new Uint8Array(this.data.buffer, 0, length));
                this.buffer = tmp.buffer;
            }
        };
        /**
         * @private
         * UTF-8 Encoding/Decoding
         */
        p.encodeUTF8 = function (str) {
            var pos = 0;
            var codePoints = this.stringToCodePoints(str);
            var outputBytes = [];
            while (codePoints.length > pos) {
                var code_point = codePoints[pos++];
                if (this.inRange(code_point, 0xD800, 0xDFFF)) {
                    this.encoderError(code_point);
                }
                else if (this.inRange(code_point, 0x0000, 0x007f)) {
                    outputBytes.push(code_point);
                }
                else {
                    var count, offset;
                    if (this.inRange(code_point, 0x0080, 0x07FF)) {
                        count = 1;
                        offset = 0xC0;
                    }
                    else if (this.inRange(code_point, 0x0800, 0xFFFF)) {
                        count = 2;
                        offset = 0xE0;
                    }
                    else if (this.inRange(code_point, 0x10000, 0x10FFFF)) {
                        count = 3;
                        offset = 0xF0;
                    }
                    outputBytes.push(this.div(code_point, Math.pow(64, count)) + offset);
                    while (count > 0) {
                        var temp = this.div(code_point, Math.pow(64, count - 1));
                        outputBytes.push(0x80 + (temp % 64));
                        count -= 1;
                    }
                }
            }
            return new Uint8Array(outputBytes);
        };
        /**
         * @private
         *
         * @param data
         * @returns
         */
        p.decodeUTF8 = function (data) {
            var fatal = false;
            var pos = 0;
            var result = "";
            var code_point;
            var utf8_code_point = 0;
            var utf8_bytes_needed = 0;
            var utf8_bytes_seen = 0;
            var utf8_lower_boundary = 0;
            while (data.length > pos) {
                var _byte = data[pos++];
                if (_byte == this.EOF_byte) {
                    if (utf8_bytes_needed != 0) {
                        code_point = this.decoderError(fatal);
                    }
                    else {
                        code_point = this.EOF_code_point;
                    }
                }
                else {
                    if (utf8_bytes_needed == 0) {
                        if (this.inRange(_byte, 0x00, 0x7F)) {
                            code_point = _byte;
                        }
                        else {
                            if (this.inRange(_byte, 0xC2, 0xDF)) {
                                utf8_bytes_needed = 1;
                                utf8_lower_boundary = 0x80;
                                utf8_code_point = _byte - 0xC0;
                            }
                            else if (this.inRange(_byte, 0xE0, 0xEF)) {
                                utf8_bytes_needed = 2;
                                utf8_lower_boundary = 0x800;
                                utf8_code_point = _byte - 0xE0;
                            }
                            else if (this.inRange(_byte, 0xF0, 0xF4)) {
                                utf8_bytes_needed = 3;
                                utf8_lower_boundary = 0x10000;
                                utf8_code_point = _byte - 0xF0;
                            }
                            else {
                                this.decoderError(fatal);
                            }
                            utf8_code_point = utf8_code_point * Math.pow(64, utf8_bytes_needed);
                            code_point = null;
                        }
                    }
                    else if (!this.inRange(_byte, 0x80, 0xBF)) {
                        utf8_code_point = 0;
                        utf8_bytes_needed = 0;
                        utf8_bytes_seen = 0;
                        utf8_lower_boundary = 0;
                        pos--;
                        code_point = this.decoderError(fatal, _byte);
                    }
                    else {
                        utf8_bytes_seen += 1;
                        utf8_code_point = utf8_code_point + (_byte - 0x80) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
                        if (utf8_bytes_seen !== utf8_bytes_needed) {
                            code_point = null;
                        }
                        else {
                            var cp = utf8_code_point;
                            var lower_boundary = utf8_lower_boundary;
                            utf8_code_point = 0;
                            utf8_bytes_needed = 0;
                            utf8_bytes_seen = 0;
                            utf8_lower_boundary = 0;
                            if (this.inRange(cp, lower_boundary, 0x10FFFF) && !this.inRange(cp, 0xD800, 0xDFFF)) {
                                code_point = cp;
                            }
                            else {
                                code_point = this.decoderError(fatal, _byte);
                            }
                        }
                    }
                }
                //Decode string
                if (code_point !== null && code_point !== this.EOF_code_point) {
                    if (code_point <= 0xFFFF) {
                        if (code_point > 0)
                            result += String.fromCharCode(code_point);
                    }
                    else {
                        code_point -= 0x10000;
                        result += String.fromCharCode(0xD800 + ((code_point >> 10) & 0x3ff));
                        result += String.fromCharCode(0xDC00 + (code_point & 0x3ff));
                    }
                }
            }
            return result;
        };
        /**
         * @private
         *
         * @param code_point
         */
        p.encoderError = function (code_point) {
            egret.$error(1026, code_point);
        };
        /**
         * @private
         *
         * @param fatal
         * @param opt_code_point
         * @returns
         */
        p.decoderError = function (fatal, opt_code_point) {
            if (fatal) {
                egret.$error(1027);
            }
            return opt_code_point || 0xFFFD;
        };
        /**
         * @private
         *
         * @param a
         * @param min
         * @param max
         */
        p.inRange = function (a, min, max) {
            return min <= a && a <= max;
        };
        /**
         * @private
         *
         * @param n
         * @param d
         */
        p.div = function (n, d) {
            return Math.floor(n / d);
        };
        /**
         * @private
         *
         * @param string
         */
        p.stringToCodePoints = function (string) {
            /** @type {Array.<number>} */
            var cps = [];
            // Based on http://www.w3.org/TR/WebIDL/#idl-DOMString
            var i = 0, n = string.length;
            while (i < string.length) {
                var c = string.charCodeAt(i);
                if (!this.inRange(c, 0xD800, 0xDFFF)) {
                    cps.push(c);
                }
                else if (this.inRange(c, 0xDC00, 0xDFFF)) {
                    cps.push(0xFFFD);
                }
                else {
                    if (i == n - 1) {
                        cps.push(0xFFFD);
                    }
                    else {
                        var d = string.charCodeAt(i + 1);
                        if (this.inRange(d, 0xDC00, 0xDFFF)) {
                            var a = c & 0x3FF;
                            var b = d & 0x3FF;
                            i += 1;
                            cps.push(0x10000 + (a << 10) + b);
                        }
                        else {
                            cps.push(0xFFFD);
                        }
                    }
                }
                i += 1;
            }
            return cps;
        };
        /**
         * @private
         */
        ByteArray.SIZE_OF_BOOLEAN = 1;
        /**
         * @private
         */
        ByteArray.SIZE_OF_INT8 = 1;
        /**
         * @private
         */
        ByteArray.SIZE_OF_INT16 = 2;
        /**
         * @private
         */
        ByteArray.SIZE_OF_INT32 = 4;
        /**
         * @private
         */
        ByteArray.SIZE_OF_UINT8 = 1;
        /**
         * @private
         */
        ByteArray.SIZE_OF_UINT16 = 2;
        /**
         * @private
         */
        ByteArray.SIZE_OF_UINT32 = 4;
        /**
         * @private
         */
        ByteArray.SIZE_OF_FLOAT32 = 4;
        /**
         * @private
         */
        ByteArray.SIZE_OF_FLOAT64 = 8;
        return ByteArray;
    })();
    egret.ByteArray = ByteArray;
    egret.registerClass(ByteArray,'egret.ByteArray');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Logger is an entrance for the log processing module of the engine
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Logger是引擎的日志处理模块入口
     * @version Egret 2.4
     * @platform Web,Native
     */
    var Logger = (function () {
        function Logger() {
        }
        var d = __define,c=Logger,p=c.prototype;
        d(Logger, "logLevel",undefined
            /**
             * @language en_US
             * Set the current need to open the log level. Grade level are: ALL <DEBUG <INFO <WARN <ERROR <OFF<br/>
             * This feature is only in DEBUG mode to take effect. <br/>
             * <Ul>
             * <Li> Logger.ALL - all levels of log can be printed out. </ li>
             * <Li> Logger.DEBUG - print debug, info, log, warn, error. </ li>
             * <Li> Logger.INFO - print info, log, warn, error. </ li>
             * <Li> Logger.WARN - can print warn, error. </ li>
             * <Li> Logger.ERROR - You can print error. </ li>
             * <Li> Logger.OFF - all closed. </ li>
             * </ Ul>
             *param LogType from this level to start printing.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 设置当前需要开启的log级别。级别等级分别为：ALL < DEBUG < INFO < WARN < ERROR < OFF<br/>
             * 此功能只在 DEBUG 模式下才生效。<br/>
             * <ul>
             * <li>Logger.ALL -- 所有等级的log都可以打印出来。</li>
             * <li>Logger.DEBUG -- 可以打印debug、info、log、warn、error。</li>
             * <li>Logger.INFO -- 可以打印info、log、warn、error。</li>
             * <li>Logger.WARN -- 可以打印warn、error。</li>
             * <li>Logger.ERROR -- 可以打印error。</li>
             * <li>Logger.OFF -- 全部关闭。</li>
             * </ul>
             * @param logType 从这个等级开始打印。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function (logType) {
            }
        );
        /**
         * @language en_US
         * open all
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 全开
         * @version Egret 2.4
         * @platform Web,Native
         */
        Logger.ALL = "all";
        /**
         * @language en_US
         * level: DEBUG
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 DEBUG
         * @version Egret 2.4
         * @platform Web,Native
         */
        Logger.DEBUG = "debug";
        /**
         * @language en_US
         * level: INFO
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 INFO
         * @version Egret 2.4
         * @platform Web,Native
         */
        Logger.INFO = "info";
        /**
         * @language en_US
         * level: WARN
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 WARN
         * @version Egret 2.4
         * @platform Web,Native
         */
        Logger.WARN = "warn";
        /**
         * @language en_US
         * level: ERROR
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 等级为 ERROR
         * @version Egret 2.4
         * @platform Web,Native
         */
        Logger.ERROR = "error";
        /**
         * @language en_US
         * close all
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 全关
         * @version Egret 2.4
         * @platform Web,Native
         */
        Logger.OFF = "off";
        return Logger;
    })();
    egret.Logger = Logger;
    egret.registerClass(Logger,'egret.Logger');
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    var NumberUtils = (function () {
        function NumberUtils() {
        }
        var d = __define,c=NumberUtils,p=c.prototype;
        /**
         * @language en_US
         * Judge whether it is a numerical value
         * @param value Parameter that needs to be judged
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 判断是否是数值
         * @param value 需要判断的参数
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        NumberUtils.isNumber = function (value) {
            return typeof (value) === "number" && !isNaN(value);
        };
        /**
         * @language en_US
         * Obtain the approximate sin value of the corresponding angle value
         * @param value {number} Angle value
         * @returns {number} sin value
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 得到对应角度值的sin近似值
         * @param value {number} 角度值
         * @returns {number} sin值
         * @version Egret 2.4
         * @platform Web,Native
         */
        NumberUtils.sin = function (value) {
            var valueFloor = Math.floor(value);
            var valueCeil = valueFloor + 1;
            var resultFloor = NumberUtils.sinInt(valueFloor);
            var resultCeil = NumberUtils.sinInt(valueCeil);
            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        };
        /**
         * @private
         *
         * @param value
         * @returns
         */
        NumberUtils.sinInt = function (value) {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            if (value < 90) {
                return egret_sin_map[value];
            }
            if (value < 180) {
                return egret_cos_map[value - 90];
            }
            if (value < 270) {
                return -egret_sin_map[value - 180];
            }
            return -egret_cos_map[value - 270];
        };
        /**
         * @language en_US
         * Obtain the approximate cos value of the corresponding angle value
         * @param value {number} Angle value
         * @returns {number} cos value
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 得到对应角度值的cos近似值
         * @param value {number} 角度值
         * @returns {number} cos值
         * @version Egret 2.4
         * @platform Web,Native
         */
        NumberUtils.cos = function (value) {
            var valueFloor = Math.floor(value);
            var valueCeil = valueFloor + 1;
            var resultFloor = NumberUtils.cosInt(valueFloor);
            var resultCeil = NumberUtils.cosInt(valueCeil);
            return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
        };
        /**
         * @private
         *
         * @param value
         * @returns
         */
        NumberUtils.cosInt = function (value) {
            value = value % 360;
            if (value < 0) {
                value += 360;
            }
            if (value < 90) {
                return egret_cos_map[value];
            }
            if (value < 180) {
                return -egret_sin_map[value - 90];
            }
            if (value < 270) {
                return -egret_cos_map[value - 180];
            }
            return egret_sin_map[value - 270];
        };
        return NumberUtils;
    })();
    egret.NumberUtils = NumberUtils;
    egret.registerClass(NumberUtils,'egret.NumberUtils');
})(egret || (egret = {}));
var egret_sin_map = {};
var egret_cos_map = {};
var DEG_TO_RAD = Math.PI / 180;
for (var NumberUtils_i = 0; NumberUtils_i <= 90; NumberUtils_i++) {
    egret_sin_map[NumberUtils_i] = Math.sin(NumberUtils_i * DEG_TO_RAD);
    egret_cos_map[NumberUtils_i] = Math.cos(NumberUtils_i * DEG_TO_RAD);
}
//对未提供bind的浏览器实现bind机制
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5 internal IsCallable function
            egret.$error(1029);
        }
        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () {
        }, fBound = function () {
            return fToBind.apply(this instanceof fNOP && oThis
                ? this
                : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };
        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();
        return fBound;
    };
}
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * The Timer class is the interface to timers, which let you run code on a specified time sequence. Use the start()
     * method to start a timer. Add an event listener for the timer event to set up code to be run on the timer interval.<br/>
     * You can create Timer objects to run once or repeat at specified intervals to execute code on a schedule. Depending
     * on the framerate or the runtime environment (available memory and other factors), the runtime may dispatchEvent events at
     * slightly offset intervals.
     * @see egret.TimerEvent
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/Timer.ts
     */
    /**
     * @language zh_CN
     * Timer 类是计时器的接口，它使您能按指定的时间序列运行代码。
     * 使用 start() 方法来启动计时器。为 timer 事件添加事件侦听器，以便将代码设置为按计时器间隔运行。
     * 可以创建 Timer 对象以运行一次或按指定间隔重复运行，从而按计划执行代码。
     * 根据 Egret 的帧速率或运行时环境（可用内存和其他因素），运行时调度事件的间隔可能稍有不同。
     * @see egret.TimerEvent
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/Timer.ts
     */
    var Timer = (function (_super) {
        __extends(Timer, _super);
        /**
         * @language en_US
         * Constructs a new Timer object with the specified delay and repeatCount states.
         * @param delay The delay between timer events, in milliseconds. A delay lower than 20 milliseconds is not recommended.
         * Timer frequency is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
         * @param repeatCount Specifies the number of repetitions. If zero, the timer repeats indefinitely.If nonzero,
         * the timer runs the specified number of times and then stops.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用指定的 delay 和 repeatCount 状态构造新的 Timer 对象。
         * @param delay 计时器事件间的延迟（以毫秒为单位）。建议 delay 不要低于 20 毫秒。计时器频率不得超过 60 帧/秒，这意味着低于 16.6 毫秒的延迟可导致出现运行时问题。
         * @param repeatCount 指定重复次数。如果为零，则计时器将持续不断重复运行。如果不为 0，则将运行计时器，运行次数为指定的次数，然后停止。
         * @version Egret 2.4
         * @platform Web,Native
         */
        function Timer(delay, repeatCount) {
            if (repeatCount === void 0) { repeatCount = 0; }
            _super.call(this);
            /**
             * @private
             */
            this._delay = 0;
            /**
             * @private
             */
            this._currentCount = 0;
            /**
             * @private
             */
            this._running = false;
            /**
             * @private
             */
            this.updateInterval = 1000;
            /**
             * @private
             */
            this.lastCount = 1000;
            this.delay = delay;
            this.repeatCount = +repeatCount | 0;
        }
        var d = __define,c=Timer,p=c.prototype;
        d(p, "delay"
            /**
             * @language en_US
             * The delay between timer events, in milliseconds. A delay lower than 20 milliseconds is not recommended.<br/>
             * Note: Timer frequency is limited to 60 frames per second, meaning a delay lower than 16.6 milliseconds causes runtime problems.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 计时器事件间的延迟（以毫秒为单位）。如果在计时器正在运行时设置延迟间隔，则计时器将按相同的 repeatCount 迭代重新启动。<br/>
             * 注意：建议 delay 不要低于 20 毫秒。计时器频率不得超过 60 帧/秒，这意味着低于 16.6 毫秒的延迟可导致出现运行时问题。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._delay;
            }
            ,function (value) {
                //value = +value||0;
                if (value < 1) {
                    value = 1;
                }
                if (this._delay == value) {
                    return;
                }
                this._delay = value;
                this.lastCount = this.updateInterval = Math.round(60 * value);
            }
        );
        d(p, "currentCount"
            /**
             * @language en_US
             * The total number of times the timer has fired since it started at zero. If the timer has been reset, only the fires since the reset are counted.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 计时器从 0 开始后触发的总次数。如果已重置了计时器，则只会计入重置后的触发次数。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._currentCount;
            }
        );
        d(p, "running"
            /**
             * @language en_US
             * The timer's current state; true if the timer is running, otherwise false.
             * @version Egret 2.4
             * @platform Web,Native
             */
            /**
             * @language zh_CN
             * 计时器的当前状态；如果计时器正在运行，则为 true，否则为 false。
             * @version Egret 2.4
             * @platform Web,Native
             */
            ,function () {
                return this._running;
            }
        );
        /**
         * @language en_US
         * Stops the timer, if it is running, and sets the currentCount property back to 0, like the reset button of a stopwatch.
         * Then, when start() is called, the timer instance runs for the specified number of repetitions, as set by the repeatCount value.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果计时器正在运行，则停止计时器，并将 currentCount 属性设回为 0，这类似于秒表的重置按钮。然后，在调用 start() 后，将运行计时器实例，运行次数为指定的重复次数（由 repeatCount 值设置）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.reset = function () {
            this.stop();
            this._currentCount = 0;
        };
        /**
         * @language en_US
         * Starts the timer, if it is not already running.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果计时器尚未运行，则启动计时器。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.start = function () {
            if (this._running)
                return;
            this.lastCount = this.updateInterval;
            egret.sys.$ticker.$startTick(this.$update, this);
            this._running = true;
        };
        /**
         * @language en_US
         * Stops the timer. When start() is called after stop(), the timer instance runs for the remaining number of
         * repetitions, as set by the repeatCount property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 停止计时器。如果在调用 stop() 后调用 start()，则将继续运行计时器实例，运行次数为剩余的 重复次数（由 repeatCount 属性设置）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        p.stop = function () {
            if (!this._running)
                return;
            egret.stopTick(this.$update, this);
            this._running = false;
        };
        /**
         * @private
         * Ticker以60FPS频率刷新此方法
         */
        p.$update = function (timeStamp) {
            this.lastCount -= 1000;
            if (this.lastCount > 0) {
                return false;
            }
            this.lastCount += this.updateInterval;
            this._currentCount++;
            var complete = (this.repeatCount > 0 && this._currentCount >= this.repeatCount);
            egret.TimerEvent.dispatchTimerEvent(this, egret.TimerEvent.TIMER);
            if (complete) {
                this.stop();
                egret.TimerEvent.dispatchTimerEvent(this, egret.TimerEvent.TIMER_COMPLETE);
            }
            return false;
        };
        return Timer;
    })(egret.EventDispatcher);
    egret.Timer = Timer;
    egret.registerClass(Timer,'egret.Timer');
    if (DEBUG) {
        egret.$markReadOnly(Timer, "currentCount");
        egret.$markReadOnly(Timer, "running");
    }
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     */
    egret.$callLaterFunctionList = [];
    /**
     * @private
     */
    egret.$callLaterThisList = [];
    /**
     * @private
     */
    egret.$callLaterArgsList = [];
    /**
     * @language en_US
     * Delay the function to run unless screen is redrawn.
     * @param method {Function} The function to be delayed to run
     * @param thisObject {any} this reference of callback function
     * @param ...args {any} Function parameter list
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/callLater.ts
     */
    /**
     * @language zh_CN
     * 延迟函数到屏幕重绘前执行。
     * @param method {Function} 要延迟执行的函数
     * @param thisObject {any} 回调函数的this引用
     * @param ...args {any} 函数参数列表
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/callLater.ts
     */
    function callLater(method, thisObject) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        egret.$callLaterFunctionList.push(method);
        egret.$callLaterThisList.push(thisObject);
        egret.$callLaterArgsList.push(args);
    }
    egret.callLater = callLater;
    /**
     * @private
     */
    egret.$callAsyncFunctionList = [];
    /**
     * @private
     */
    egret.$callAsyncThisList = [];
    /**
     * @private
     */
    egret.$callAsyncArgsList = [];
    /**
     * 异步调用函数
     * @param method {Function} 要异步调用的函数
     * @param thisObject {any} 函数的this引用
     * @param ...args {any} 函数参数列表
     * @private
     */
    function $callAsync(method, thisObject) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        egret.$callAsyncFunctionList.push(method);
        egret.$callAsyncThisList.push(thisObject);
        egret.$callAsyncArgsList.push(args);
    }
    egret.$callAsync = $callAsync;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
//function __extends(d, b) {
//    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
//    function __() {
//        this.constructor = d;
//    }
//
//    __.prototype = b.prototype;
//    d.prototype = new __();
//}
var egret;
(function (egret) {
    /**
     * @language en_US
     * Call setter properties of the parent class, instead of the other writing languages, such as super.alpha = 1;
     * @param currentClass The current class class name, non-string
     * @param thisObj The current object. Always this
     * @param type Setter property names need to call
     * @param values Value passed to the parent class
     *
     * @exmaple egret.superSetter(egret.Sprite, this, "alpha", 1);
     */
    /**
     * @language zh_CN
     * 调用父类的setter属性，代替其他语言的写法，如 super.alpha = 1;
     * @param thisObj 当前对象。永远都this
     * @param currentClass 当前 class 类名，非字符串
     * @param type 需要调用的setter属性名称
     * @param values 传给父类的值
     *
     * @exmaple egret.superSetter(egret.Sprite, this, "alpha", 1);
     */
    function superSetter(currentClass, thisObj, type) {
        var values = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            values[_i - 3] = arguments[_i];
        }
        var cla = currentClass.prototype;
        var seters;
        if (!currentClass.hasOwnProperty("__sets__")) {
            Object.defineProperty(currentClass, "__sets__", { "value": {} });
        }
        seters = currentClass["__sets__"];
        var setF = seters[type];
        if (setF) {
            return setF.apply(thisObj, values);
        }
        var d = Object.getPrototypeOf(cla);
        if (d == null) {
            return;
        }
        while (!d.hasOwnProperty(type)) {
            d = Object.getPrototypeOf(d);
            if (d == null) {
                return;
            }
        }
        setF = Object.getOwnPropertyDescriptor(d, type).set;
        seters[type] = setF;
        setF.apply(thisObj, values);
    }
    egret.superSetter = superSetter;
    /**
     * @language en_US
     * Get getter property value of the parent class. Instead of writing in other languages, such as super.alpha;
     * @param currentClass The current class class name, non-string
     * @param thisObj The current object. Always this
     * @param type Setter property names need to call
     * @returns {any} The value returned by the parent
     *
     * @exmaple egret.superGetter(egret.Sprite, this, "alpha");
     */
    /**
     * @language zh_CN
     * 获取父类的getter属性值。代替其他语言的写法，如 super.alpha;
     * @param thisObj 当前对象。永远都this
     * @param currentClass 当前 class 类名，非字符串
     * @param type 需要调用的setter属性名称
     * @returns {any} 父类返回的值
     *
     * @exmaple egret.superGetter(egret.Sprite, this, "alpha");
     */
    function superGetter(currentClass, thisObj, type) {
        var cla = currentClass.prototype;
        var geters;
        if (!currentClass.hasOwnProperty("__gets__")) {
            Object.defineProperty(currentClass, "__gets__", { "value": {} });
        }
        geters = currentClass["__gets__"];
        var getF = geters[type];
        if (getF) {
            return getF.call(thisObj);
        }
        var d = Object.getPrototypeOf(cla);
        if (d == null) {
            return;
        }
        while (!d.hasOwnProperty(type)) {
            d = Object.getPrototypeOf(d);
            if (d == null) {
                return;
            }
        }
        getF = Object.getOwnPropertyDescriptor(d, type).get;
        geters[type] = getF;
        return getF.call(thisObj);
    }
    egret.superGetter = superGetter;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @private
     */
    var getDefinitionByNameCache = {};
    /**
     * @language en_US
     * Returns a reference to the class object of the class specified by the name parameter.
     * @param name The name of a class.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getDefinitionByName.ts
     */
    /**
     * @language zh_CN
     * 返回 name 参数指定的类的类对象引用。
     * @param name 类的名称。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getDefinitionByName.ts
     */
    function getDefinitionByName(name) {
        if (!name)
            return null;
        var definition = getDefinitionByNameCache[name];
        if (definition) {
            return definition;
        }
        var paths = name.split(".");
        var length = paths.length;
        definition = __global;
        for (var i = 0; i < length; i++) {
            var path = paths[i];
            definition = definition[path];
            if (!definition) {
                return null;
            }
        }
        getDefinitionByNameCache[name] = definition;
        return definition;
    }
    egret.getDefinitionByName = getDefinitionByName;
    if (DEBUG) {
        egret["cleanCache"] = function () {
            getDefinitionByNameCache = {};
        };
    }
})(egret || (egret = {}));
var __global = __global || this;
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Return the fully qualified class name of an object
     * @param value The object for which a fully qualified class name is desired. Any JavaScript value may be passed to
     * this method including all available JavaScript types, object instances, primitive types such as number, and class objects.
     * @returns A string containing the fully qualified class name.
     * @example
     * <pre>
     *  egret.getQualifiedClassName(egret.DisplayObject) //return "egret.DisplayObject"
     * </pre>
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getQualifiedClassName.ts
     */
    /**
     * @language zh_CN
     * 返回对象的完全限定类名。
     * @param value 需要完全限定类名称的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型
     * （如number)和类对象
     * @returns 包含完全限定类名称的字符串。
     * @example
     * <pre>
     *  egret.getQualifiedClassName(egret.DisplayObject) //返回 "egret.DisplayObject"
     * </pre>
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getQualifiedClassName.ts
     */
    function getQualifiedClassName(value) {
        var type = typeof value;
        if (!value || (type != "object" && !value.prototype)) {
            return type;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        if (prototype.hasOwnProperty("__class__")) {
            return prototype["__class__"];
        }
        var constructorString = prototype.constructor.toString();
        var index = constructorString.indexOf("(");
        var className = constructorString.substring(9, index);
        Object.defineProperty(prototype, "__class__", {
            value: className,
            enumerable: false,
            writable: true
        });
        return className;
    }
    egret.getQualifiedClassName = getQualifiedClassName;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /** @language en_US
     * Returns the fully qualified class name of the base class of the object specified by the value parameter.
     * @param value The object for which a parent class is desired. Any JavaScript value may be passed to this method including
     * all available JavaScript types, object instances, primitive types such as number, and class objects.
     * @returns  A fully qualified base class name, or null if none exists.
     * @example
     * <pre>
     *  egret.getQualifiedSuperclassName(egret.Bitmap) //return "egret.DisplayObject"
     * </pre>
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getQualifiedSuperclassName.ts
     */
    /**
     * @language zh_CN
     * 返回 value 参数指定的对象的基类的完全限定类名。
     * @param value 需要取得父类的对象，可以将任何 JavaScript 值传递给此方法，包括所有可用的 JavaScript 类型、对象实例、原始类型（如number）和类对象
     * @returns 完全限定的基类名称，或 null（如果不存在基类名称）。
     * @example
     * <pre>
     *  egret.getQualifiedSuperclassName(egret.Sprite) //返回 "egret.DisplayObject"
     * </pre>
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getQualifiedSuperclassName.ts
     */
    function getQualifiedSuperclassName(value) {
        if (!value || (typeof value != "object" && !value.prototype)) {
            return null;
        }
        var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
        var superProto = Object.getPrototypeOf(prototype);
        if (!superProto) {
            return null;
        }
        var superClass = egret.getQualifiedClassName(superProto.constructor);
        if (!superClass) {
            return null;
        }
        return superClass;
    }
    egret.getQualifiedSuperclassName = getQualifiedSuperclassName;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Used to compute relative time.this method returns the number of milliseconds since the Egret framework was initialized
     * @returns The number of milliseconds since the Egret framework was initialized
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getTimer.ts
     */
    /**
     * @language zh_CN
     * 用于计算相对时间。此方法返回自启动 Egret 框架以来经过的毫秒数。
     * @returns 启动 Egret 框架以来经过的毫秒数。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/getTimer.ts
     */
    function getTimer() {
        return Date.now() - egret.sys.$START_TIME;
    }
    egret.getTimer = getTimer;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Check whether a public definition exists in the specified application domain. The definition can be that of a class, a naming space or a function.
     * @param name {string} Name of the definition.
     * @returns {boolean} Whether the public definition exists
     * @example
     * egret.hasDefinition("egret.DisplayObject") //return true
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/hasDefinition.ts
     */
    /**
     * @language zh_CN
     * 检查指定的应用程序域之内是否存在一个公共定义。该定义可以是一个类、一个命名空间或一个函数的定义。
     * @param name {string} 定义的名称。
     * @returns {boolean} 公共定义是否存在
     * @example
     * egret.hasDefinition("egret.DisplayObject") //返回 true
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/hasDefinition.ts
     */
    function hasDefinition(name) {
        var definition = egret.getDefinitionByName(name);
        return definition ? true : false;
    }
    egret.hasDefinition = hasDefinition;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Indicates whether an object is a instance of the class or interface specified as the parameter.This method has better performance
     * compared width the instanceOf operator,and it can indicate whether an object is a instance of the specific interface.
     * @param instance the instance to be checked.
     * @param typeName the string value representing a specific class or interface.
     * @returns A value of true if the object is a instance of the class or interface specified as the parameter.
     * @example
     * <pre>
     *     var instance = new egret.Sprite();
     *     egret.log(egret.is(instance,egret.Types.Sprite))  //true
     *     egret.log(egret.is(instance,egret.Types.DisplayObjectContainer))  //true
     *     egret.log(egret.is(instance,egret.Types.Bitmap))  //false
     * </pre>
     * @see egret.registerClass()
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 检查指定对象是否为 Egret 框架内指定接口或类或其子类的实例。此方法与使用 instanceOf 关键字相比具有更高的性能，并且能判断接口的实现。
     * @param instance 要判断的实例。
     * @param typeName 类或接口的完全名称.
     * @returns 返回true表示当前对象是指定类或接口的实例。
     * @example
     * <pre>
     *     var instance = new egret.Sprite();
     *     egret.log(egret.is(instance,egret.Types.Sprite))  //true
     *     egret.log(egret.is(instance,egret.Types.DisplayObjectContainer))  //true
     *     egret.log(egret.is(instance,egret.Types.Bitmap))  //false
     * </pre>
     * @see egret.registerClass()
     * @version Egret 2.4
     * @platform Web,Native
     */
    function is(instance, typeName) {
        if (!instance || typeof instance != "object") {
            return false;
        }
        var prototype = Object.getPrototypeOf(instance);
        var types = prototype ? prototype.__types__ : null;
        if (!types) {
            return false;
        }
        return (types.indexOf(typeName) !== -1);
    }
    egret.is = is;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Register and start a timer,which will notify the callback method at a rate of 60 FPS ,and pass the current time stamp as parameters.<br/>
     * Note: After the registration,it will notify the callback method continuously,you can call the stopTick () method to stop it.
     * @param callBack the call back method. the timeStamp parameter of this method represents the number of milliseconds
     * since the Egret framework was initialized. If the return value of this method is true, it will force Egret runtime
     * to render after processing of this method completes.
     * @param thisObject the call back method's "this"
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 注册并启动一个计时器，通常会以60FPS的速率触发回调方法，并传入当前时间戳。注意：注册后将会持续触发回调方法，若要停止回调，需要手动调用stopTick()方法。
     * @param callBack 要执行的回调方法。参数 timeStamp 表示从启动Egret框架开始经过的时间(毫秒)。
     * 若回调方法返回值为true，其作用与TimerEvent.updateAfterEvent()类似，将会忽略帧频限制，在此方法处理完成后立即重绘屏幕。
     * @param thisObject 回调方法的this对象引用。
     * @version Egret 2.4
     * @platform Web,Native
     */
    function startTick(callBack, thisObject) {
        if (DEBUG && !callBack) {
            egret.$error(1003, "callBack");
        }
        egret.sys.$ticker.$startTick(callBack, thisObject);
    }
    egret.startTick = startTick;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Stops the timer started by the egret.startTick() method.
     * @param callBack the call back method. the timeStamp parameter of this method represents the number of milliseconds
     * since the Egret framework was initialized. If the return value of this method is true, it will force Egret runtime
     * to render after processing of this method completes.
     * @param thisObject the call back method's "this"
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 停止之前用 startTick() 方法启动的计时器。
     * @param callBack 要执行的回调方法。参数 timeStamp 表示从启动Egret框架开始经过的时间(毫秒)。
     * 若回调方法返回值为true，其作用与TimerEvent.updateAfterEvent()类似，将会忽略帧频限制，在此方法处理完成后立即重绘屏幕。
     * @param thisObject 回调方法的this对象引用。
     * @version Egret 2.4
     * @platform Web,Native
     */
    function stopTick(callBack, thisObject) {
        if (DEBUG && !callBack) {
            egret.$error(1003, "callBack");
        }
        egret.sys.$ticker.$stopTick(callBack, thisObject);
    }
    egret.stopTick = stopTick;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language zh_CN
     * 转换 Image，Canvas，Video 为 Egret 框架内使用的 BitmapData 对象。
     * @param data 需要转换的对象，包括HTMLImageElement|HTMLCanvasElement|HTMLVideoElement
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language en_US
     * Image, Canvas, BitmapData, Video, Egret.
     * @param data Objects that need to be converted include HTMLImageElement|HTMLCanvasElement|HTMLVideoElement
     * @version Egret 2.4
     * @platform Web,Native
     */
    function $toBitmapData(data) {
        data["hashCode"] = data["$hashCode"] = egret.$hashCount++;
        return data;
    }
    egret.$toBitmapData = $toBitmapData;
})(egret || (egret = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var egret;
(function (egret) {
    /**
     * @language en_US
     * Transfer number to color character string
     * @param value {number} color value ,such as 0xffffff
     * @returns {string} Color character string, for example, #ffffff.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/toColorString.ts
     */
    /**
     * @language zh_CN
     * 转换数字为颜色字符串
     * @param value {number} 颜色值，例如 0xffffff
     * @returns {string} 颜色字符串，例如"#ffffff"。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/toColorString.ts
     */
    function toColorString(value) {
        if (value < 0)
            value = 0;
        if (value > 16777215)
            value = 16777215;
        var color = value.toString(16).toUpperCase();
        while (color.length > 6) {
            color = color.slice(1, color.length);
        }
        while (color.length < 6) {
            color = "0" + color;
        }
        return "#" + color;
    }
    egret.toColorString = toColorString;
})(egret || (egret = {}));
