var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var sys;
    (function (sys) {
        /**
         * @private
         * 失效验证管理器
         */
        var Validator = (function (_super) {
            __extends(Validator, _super);
            /**
             * @private
             * 创建一个Validator对象
             */
            function Validator() {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 */
                _this.targetLevel = Number.POSITIVE_INFINITY;
                /**
                 * @private
                 */
                _this.invalidatePropertiesFlag = false;
                /**
                 * @private
                 */
                _this.invalidateClientPropertiesFlag = false;
                /**
                 * @private
                 */
                _this.invalidatePropertiesQueue = new DepthQueue();
                /**
                 * @private
                 */
                _this.invalidateSizeFlag = false;
                /**
                 * @private
                 */
                _this.invalidateClientSizeFlag = false;
                /**
                 * @private
                 */
                _this.invalidateSizeQueue = new DepthQueue();
                /**
                 * @private
                 */
                _this.invalidateDisplayListFlag = false;
                /**
                 * @private
                 */
                _this.invalidateDisplayListQueue = new DepthQueue();
                /**
                 * @private
                 */
                _this.eventDisplay = new egret.Bitmap();
                /**
                 * @private
                 * 是否已经添加了事件监听
                 */
                _this.listenersAttached = false;
                return _this;
            }
            /**
             * @private
             * 标记组件属性失效
             */
            Validator.prototype.invalidateProperties = function (client) {
                if (!this.invalidatePropertiesFlag) {
                    this.invalidatePropertiesFlag = true;
                    if (!this.listenersAttached)
                        this.attachListeners();
                }
                if (this.targetLevel <= client.$nestLevel)
                    this.invalidateClientPropertiesFlag = true;
                this.invalidatePropertiesQueue.insert(client);
            };
            /**
             * @private
             * 验证失效的属性
             */
            Validator.prototype.validateProperties = function () {
                var queue = this.invalidatePropertiesQueue;
                var client = queue.shift();
                while (client) {
                    if (client.$stage) {
                        client.validateProperties();
                    }
                    client = queue.shift();
                }
                if (queue.isEmpty())
                    this.invalidatePropertiesFlag = false;
            };
            /**
             * @private
             * 标记需要重新测量尺寸
             */
            Validator.prototype.invalidateSize = function (client) {
                if (!this.invalidateSizeFlag) {
                    this.invalidateSizeFlag = true;
                    if (!this.listenersAttached)
                        this.attachListeners();
                }
                if (this.targetLevel <= client.$nestLevel)
                    this.invalidateClientSizeFlag = true;
                this.invalidateSizeQueue.insert(client);
            };
            /**
             * @private
             * 测量尺寸
             */
            Validator.prototype.validateSize = function () {
                var queue = this.invalidateSizeQueue;
                var client = queue.pop();
                while (client) {
                    if (client.$stage) {
                        client.validateSize();
                    }
                    client = queue.pop();
                }
                if (queue.isEmpty())
                    this.invalidateSizeFlag = false;
            };
            /**
             * @private
             * 标记需要重新布局
             */
            Validator.prototype.invalidateDisplayList = function (client) {
                if (!this.invalidateDisplayListFlag) {
                    this.invalidateDisplayListFlag = true;
                    if (!this.listenersAttached)
                        this.attachListeners();
                }
                this.invalidateDisplayListQueue.insert(client);
            };
            /**
             * @private
             * 重新布局
             */
            Validator.prototype.validateDisplayList = function () {
                var queue = this.invalidateDisplayListQueue;
                var client = queue.shift();
                while (client) {
                    if (client.$stage) {
                        client.validateDisplayList();
                    }
                    client = queue.shift();
                }
                if (queue.isEmpty())
                    this.invalidateDisplayListFlag = false;
            };
            /**
             * @private
             * 添加事件监听
             */
            Validator.prototype.attachListeners = function () {
                this.eventDisplay.addEventListener(egret.Event.ENTER_FRAME, this.doPhasedInstantiationCallBack, this);
                this.eventDisplay.addEventListener(egret.Event.RENDER, this.doPhasedInstantiationCallBack, this);
                egret.sys.$invalidateRenderFlag = true;
                this.listenersAttached = true;
            };
            /**
             * @private
             * 执行属性应用
             */
            Validator.prototype.doPhasedInstantiationCallBack = function (event) {
                this.eventDisplay.removeEventListener(egret.Event.ENTER_FRAME, this.doPhasedInstantiationCallBack, this);
                this.eventDisplay.removeEventListener(egret.Event.RENDER, this.doPhasedInstantiationCallBack, this);
                this.doPhasedInstantiation();
            };
            /**
             * @private
             *
             */
            Validator.prototype.doPhasedInstantiation = function () {
                if (this.invalidatePropertiesFlag) {
                    this.validateProperties();
                }
                if (this.invalidateSizeFlag) {
                    this.validateSize();
                }
                if (this.invalidateDisplayListFlag) {
                    this.validateDisplayList();
                }
                if (this.invalidatePropertiesFlag ||
                    this.invalidateSizeFlag ||
                    this.invalidateDisplayListFlag) {
                    this.attachListeners();
                }
                else {
                    this.listenersAttached = false;
                }
            };
            /**
             * @private
             * 使大于等于指定组件层级的元素立即应用属性
             * @param target 要立即应用属性的组件
             */
            Validator.prototype.validateClient = function (target) {
                var obj;
                var done = false;
                var oldTargetLevel = this.targetLevel;
                if (this.targetLevel === Number.POSITIVE_INFINITY)
                    this.targetLevel = target.$nestLevel;
                var propertiesQueue = this.invalidatePropertiesQueue;
                var sizeQueue = this.invalidateSizeQueue;
                var displayListQueue = this.invalidateDisplayListQueue;
                while (!done) {
                    done = true;
                    obj = propertiesQueue.removeSmallestChild(target);
                    while (obj) {
                        if (obj.$stage) {
                            obj.validateProperties();
                        }
                        obj = propertiesQueue.removeSmallestChild(target);
                    }
                    if (propertiesQueue.isEmpty()) {
                        this.invalidatePropertiesFlag = false;
                    }
                    this.invalidateClientPropertiesFlag = false;
                    obj = sizeQueue.removeLargestChild(target);
                    while (obj) {
                        if (obj.$stage) {
                            obj.validateSize();
                        }
                        if (this.invalidateClientPropertiesFlag) {
                            obj = (propertiesQueue.removeSmallestChild(target));
                            if (obj) {
                                propertiesQueue.insert(obj);
                                done = false;
                                break;
                            }
                        }
                        obj = sizeQueue.removeLargestChild(target);
                    }
                    if (sizeQueue.isEmpty()) {
                        this.invalidateSizeFlag = false;
                    }
                    this.invalidateClientPropertiesFlag = false;
                    this.invalidateClientSizeFlag = false;
                    obj = displayListQueue.removeSmallestChild(target);
                    while (obj) {
                        if (obj.$stage) {
                            obj.validateDisplayList();
                        }
                        if (this.invalidateClientPropertiesFlag) {
                            obj = propertiesQueue.removeSmallestChild(target);
                            if (obj) {
                                propertiesQueue.insert(obj);
                                done = false;
                                break;
                            }
                        }
                        if (this.invalidateClientSizeFlag) {
                            obj = sizeQueue.removeLargestChild(target);
                            if (obj) {
                                sizeQueue.insert(obj);
                                done = false;
                                break;
                            }
                        }
                        obj = displayListQueue.removeSmallestChild(target);
                    }
                    if (displayListQueue.isEmpty()) {
                        this.invalidateDisplayListFlag = false;
                    }
                }
                if (oldTargetLevel === Number.POSITIVE_INFINITY) {
                    this.targetLevel = Number.POSITIVE_INFINITY;
                }
            };
            return Validator;
        }(egret.EventDispatcher));
        sys.Validator = Validator;
        __reflect(Validator.prototype, "eui.sys.Validator");
        /**
         * @private
         * 显示列表嵌套深度排序队列
         */
        var DepthQueue = (function () {
            function DepthQueue() {
                /**
                 * 深度队列
                 */
                this.depthBins = {};
                /**
                 * 最小深度
                 */
                this.minDepth = 0;
                /**
                 * 最大深度
                 */
                this.maxDepth = -1;
            }
            /**
             * 插入一个元素
             */
            DepthQueue.prototype.insert = function (client) {
                var depth = client.$nestLevel;
                if (this.maxDepth < this.minDepth) {
                    this.minDepth = this.maxDepth = depth;
                }
                else {
                    if (depth < this.minDepth)
                        this.minDepth = depth;
                    if (depth > this.maxDepth)
                        this.maxDepth = depth;
                }
                var bin = this.depthBins[depth];
                if (!bin) {
                    bin = this.depthBins[depth] = new DepthBin();
                }
                bin.insert(client);
            };
            /**
             * 从队列尾弹出深度最大的一个对象
             */
            DepthQueue.prototype.pop = function () {
                var client;
                var minDepth = this.minDepth;
                if (minDepth <= this.maxDepth) {
                    var bin = this.depthBins[this.maxDepth];
                    while (!bin || bin.length === 0) {
                        this.maxDepth--;
                        if (this.maxDepth < minDepth)
                            return null;
                        bin = this.depthBins[this.maxDepth];
                    }
                    client = bin.pop();
                    while (!bin || bin.length == 0) {
                        this.maxDepth--;
                        if (this.maxDepth < minDepth)
                            break;
                        bin = this.depthBins[this.maxDepth];
                    }
                }
                return client;
            };
            /**
             * 从队列首弹出深度最小的一个对象
             */
            DepthQueue.prototype.shift = function () {
                var client;
                var maxDepth = this.maxDepth;
                if (this.minDepth <= maxDepth) {
                    var bin = this.depthBins[this.minDepth];
                    while (!bin || bin.length === 0) {
                        this.minDepth++;
                        if (this.minDepth > maxDepth)
                            return null;
                        bin = this.depthBins[this.minDepth];
                    }
                    client = bin.pop();
                    while (!bin || bin.length == 0) {
                        this.minDepth++;
                        if (this.minDepth > maxDepth)
                            break;
                        bin = this.depthBins[this.minDepth];
                    }
                }
                return client;
            };
            /**
             * 移除大于等于指定组件层级的元素中最大的元素
             */
            DepthQueue.prototype.removeLargestChild = function (client) {
                var hashCode = client.$hashCode;
                var nestLevel = client.$nestLevel;
                var max = this.maxDepth;
                var min = nestLevel;
                while (min <= max) {
                    var bin = this.depthBins[max];
                    if (bin && bin.length > 0) {
                        if (max === nestLevel) {
                            if (bin.map[hashCode]) {
                                bin.remove(client);
                                return client;
                            }
                        }
                        else if (egret.is(client, "egret.DisplayObjectContainer")) {
                            var items = bin.items;
                            var length_1 = bin.length;
                            for (var i = 0; i < length_1; i++) {
                                var value = items[i];
                                if (client.contains(value)) {
                                    bin.remove(value);
                                    return value;
                                }
                            }
                        }
                        else {
                            break;
                        }
                        max--;
                    }
                    else {
                        if (max == this.maxDepth) {
                            this.maxDepth--;
                        }
                        max--;
                        if (max < min)
                            break;
                    }
                }
                return null;
            };
            /**
             * 移除大于等于指定组件层级的元素中最小的元素
             */
            DepthQueue.prototype.removeSmallestChild = function (client) {
                var nestLevel = client.$nestLevel;
                var min = nestLevel;
                var max = this.maxDepth;
                var hashCode = client.$hashCode;
                while (min <= max) {
                    var bin = this.depthBins[min];
                    if (bin && bin.length > 0) {
                        if (min === nestLevel) {
                            if (bin.map[hashCode]) {
                                bin.remove(client);
                                return client;
                            }
                        }
                        else if (egret.is(client, "egret.DisplayObjectContainer")) {
                            var items = bin.items;
                            var length_2 = bin.length;
                            for (var i = 0; i < length_2; i++) {
                                var value = items[i];
                                if (client.contains(value)) {
                                    bin.remove(value);
                                    return value;
                                }
                            }
                        }
                        else {
                            break;
                        }
                        min++;
                    }
                    else {
                        if (min == this.minDepth)
                            this.minDepth++;
                        min++;
                        if (min > max)
                            break;
                    }
                }
                return null;
            };
            /**
             * 队列是否为空
             */
            DepthQueue.prototype.isEmpty = function () {
                return this.minDepth > this.maxDepth;
            };
            return DepthQueue;
        }());
        __reflect(DepthQueue.prototype, "DepthQueue");
        /**
         * @private
         * 列表项
         */
        var DepthBin = (function () {
            function DepthBin() {
                this.map = {};
                this.items = [];
                this.length = 0;
            }
            DepthBin.prototype.insert = function (client) {
                var hashCode = client.$hashCode;
                if (this.map[hashCode]) {
                    return;
                }
                this.map[hashCode] = true;
                this.length++;
                this.items.push(client);
            };
            DepthBin.prototype.pop = function () {
                var client = this.items.pop(); //使用pop会比shift有更高的性能，避免索引整体重置。
                if (client) {
                    this.length--;
                    if (this.length === 0) {
                        this.map = {}; //清空所有key防止内存泄露
                    }
                    else {
                        this.map[client.$hashCode] = false;
                    }
                }
                return client;
            };
            DepthBin.prototype.remove = function (client) {
                var index = this.items.indexOf(client);
                if (index >= 0) {
                    this.items.splice(index, 1);
                    this.length--;
                    if (this.length === 0) {
                        this.map = {}; //清空所有key防止内存泄露
                    }
                    else {
                        this.map[client.$hashCode] = false;
                    }
                }
            };
            return DepthBin;
        }());
        __reflect(DepthBin.prototype, "DepthBin");
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * Register a property for a class definition in running,
     * so that the EUI can get type of property accurate when parsing a EXML.
     * This need not be called directly in most of time. Only when you have a custom UI
     * component need to be described in EXML, you may invoke this method explicitly.
     *
     * Contains no following：
     * When the property is the basic data type(boolean, number, string or Array), you only need set a correct initial value
     * for he custom property then the EXML parser can get the correct property type in running.
     *
     * If you can not set the correct initial value (such as <code>null</code>), the EXML parser will treat this property as
     * <code>string</code>. If there is no inital value, EUI will throw an error. But you can invoked this method to register
     * a property in this case.
     *
     *
     * @param classDefinition The class definition need to be registered.
     * @param property The property need to be registered. Note that the property
     * name cannot start with "_" or "$".
     * @param type The type need to be registered,
     * such as “boolean","number","string","Array","egret.Rectangle" and so on.
     * @param asDefault Whether register this property as a default property of component.
     * One component can register only on default property. And the default property can be spare in an EXML.
     *
     * @example：
     * <pre>
     *      <s:Scroller>
     *          <s:viewport>
     *          <s:Group/>
     *          </e:viewport>
     *      </e:Scroller>
     * </pre>
     * Cuz <code>viewport</code> is the default property of Scroller. So you can write as follow:
     * <pre>
     *      <s:Scroller>
     *          <s:Group/>
     *      </e:Scroller>
     * </pre>
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 为一个类定义注册运行时属性类型，以便运行时的EXML文件解析过程能获取准确的属性类型。大多数情况下，您都不需要手动调用此方法显式注册属性类型。
     * 仅当您有一个自定义的 UI 组件，需要在EXML中用标签描述时可能需要显式注册，但以下情况除外：
     * 当属性类型为基本数据类型：boolean,number,string,Array这四种其中之一时，您只需要为自定义的属性赋值上正确的初始值，
     * 运行时EXML解析器就能通过初始值自动分析出正确的属性类型。
     * 若您无法为属性赋值上正确的初始值时(有初始值，比如null),运行时EXML解析器会把此属性当做string来处理，若完全没有初始值，将会报错找不到节点属性，
     * 这种情况下可以手动调用此方法显式注册属性类型。
     *
     * @param classDefinition 要注册的类定义。
     * @param property 要注册的属性,注意属性名不能以 _ 或 $ 符开头。
     * @param type 要注册的类型,例如：“boolean","number","string","Array","egret.Rectangle"
     * @param asDefault 是否将此属性注册为组件的默认属性,一个组件只可以设置一个默认属性。注册了组件默认属性后，在EXML中可以使用省略属性节点的写法，
     * @example：
     * <pre>
     * <s:Scroller>
     *     <s:viewport>
     *         <s:Group/>
     *     </e:viewport>
     * </e:Scroller>
     * </pre>
     * 因为 viewport 已经注册为 Scroller 的默认属性，上面的例子可以等效为：
     * <pre>
     * <s:Scroller>
     *     <s:Group/>
     * </e:Scroller>
     * </pre>
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    function registerProperty(classDefinition, property, type, asDefault) {
        if (true) {
            if (!classDefinition) {
                egret.$error(1003, "classDefinition");
            }
            if (!classDefinition.prototype) {
                egret.$error(1012, "classDefinition");
            }
            if (!property) {
                egret.$error(1003, "property");
            }
            if (!type) {
                egret.$error(1003, "type");
            }
        }
        var prototype = classDefinition.prototype;
        prototype.__meta__ = prototype.__meta__ || {};
        prototype.__meta__[property] = type;
        if (asDefault) {
            prototype.__defaultProperty__ = property;
        }
    }
    eui.registerProperty = registerProperty;
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The State class defines a view state, a particular view of a component.
     *
     * For example, a product thumbnail could have two view states;
     * a base view state with minimal information, and a rich view state with
     * additional information.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * State 类定义视图状态，即组件的特定视图。
     *
     * 例如，产品缩略图可以有两个视图状态，包含最少信息的基本视图状态和包含附加信息的丰富视图状态。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var State = (function (_super) {
        __extends(State, _super);
        /**
         * Constructor.
         *
         * @param name The name of the view state.
         * State names must be unique for a given component.
         * This property must be set.
         * @param overrides The overrides for this view state, as an Array of objects that implement
         * the IOverride interface. These overrides are applied in order when the
         * state is entered, and removed in reverse order when the state is exited.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个State实例。
         *
         * @param name 视图状态的名称。给定组件的状态名称必须唯一。必须设置此属性。
         * @param overrides 该视图状态的覆盖，表现为实现 IOverride 接口的对象的数组。
         * 这些覆盖在进入状态时按顺序应用，在退出状态时按相反的顺序删除。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function State(name, overrides) {
            if (overrides === void 0) { overrides = []; }
            var _this = _super.call(this) || this;
            _this.name = name;
            _this.overrides = overrides;
            return _this;
        }
        /**
         * Initialize this state and all of its overrides.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 初始化视图状态
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        State.prototype.initialize = function (host, stage) {
            var overrides = this.overrides;
            var length = overrides.length;
            for (var i = 0; i < length; i++) {
                var addItems = overrides[i];
                if (addItems instanceof eui.AddItems) {
                    var target = host[addItems.target];
                    if (target && target instanceof eui.Image && !target.$parent) {
                        stage.addChild(target);
                        stage.removeChild(target);
                    }
                }
            }
        };
        return State;
    }(egret.HashObject));
    eui.State = State;
    __reflect(State.prototype, "eui.State");
})(eui || (eui = {}));
(function (eui) {
    var sys;
    (function (sys) {
        /**
         * @private
         */
        var StateClient = (function () {
            function StateClient() {
            }
            Object.defineProperty(StateClient.prototype, "states", {
                /**
                 * @private
                 * 为此组件定义的视图状态。
                 */
                get: function () {
                    return this.$stateValues.states;
                },
                set: function (value) {
                    if (!value)
                        value = [];
                    var values = this.$stateValues;
                    values.states = value;
                    var statesMap = {};
                    var length = value.length;
                    for (var i = 0; i < length; i++) {
                        var state = value[i];
                        statesMap[state.name] = state;
                    }
                    values.statesMap = statesMap;
                    if (values.parent) {
                        this.commitCurrentState();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(StateClient.prototype, "currentState", {
                /**
                 * @private
                 * 组件的当前视图状态。将其设置为 "" 或 null 可将组件重置回其基本状态。
                 */
                get: function () {
                    return this.$stateValues.currentState;
                },
                set: function (value) {
                    var values = this.$stateValues;
                    values.explicitState = value;
                    values.currentState = value;
                    this.commitCurrentState();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @private
             * 应用当前的视图状态。子类覆盖此方法在视图状态发生改变时执行相应更新操作。
             */
            StateClient.prototype.commitCurrentState = function () {
                var values = this.$stateValues;
                if (!values.parent) {
                    return;
                }
                var destination = values.statesMap[values.currentState];
                if (!destination) {
                    if (values.states.length > 0) {
                        values.currentState = values.states[0].name;
                    }
                    else {
                        return;
                    }
                }
                if (values.oldState == values.currentState) {
                    return;
                }
                var parent = values.parent;
                var state = values.statesMap[values.oldState];
                if (state) {
                    var overrides = state.overrides;
                    var length_3 = overrides.length;
                    for (var i = 0; i < length_3; i++) {
                        overrides[i].remove(this, parent);
                    }
                }
                values.oldState = values.currentState;
                state = values.statesMap[values.currentState];
                if (state) {
                    var overrides = state.overrides;
                    var length_4 = overrides.length;
                    for (var i = 0; i < length_4; i++) {
                        overrides[i].apply(this, parent);
                    }
                }
            };
            /**
             * @private
             * 返回是否含有指定名称的视图状态
             * @param stateName 要检查的视图状态名称
             */
            StateClient.prototype.hasState = function (stateName) {
                return !!this.$stateValues.statesMap[stateName];
            };
            /**
             * @private
             * 初始化所有视图状态
             */
            StateClient.prototype.initializeStates = function (stage) {
                this.$stateValues.intialized = true;
                var states = this.states;
                var length = states.length;
                for (var i = 0; i < length; i++) {
                    states[i].initialize(this, stage);
                }
            };
            return StateClient;
        }());
        sys.StateClient = StateClient;
        __reflect(StateClient.prototype, "eui.sys.StateClient");
        /**
         * @private
         */
        var StateValues = (function () {
            function StateValues() {
                /**
                 * @private
                 */
                this.intialized = false;
                /**
                 * @private
                 */
                this.statesMap = {};
                /**
                 * @private
                 */
                this.states = [];
                /**
                 * @private
                 */
                this.oldState = null;
                /**
                 * @private
                 */
                this.explicitState = null;
                /**
                 * @private
                 */
                this.currentState = null;
                /**
                 * @private
                 */
                this.parent = null;
                /**
                 * @private
                 */
                this.stateIsDirty = false;
            }
            return StateValues;
        }());
        sys.StateValues = StateValues;
        __reflect(StateValues.prototype, "eui.sys.StateValues");
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
/// <reference path="Validator.ts" />
var eui;
(function (eui) {
    function getAssets(source, callback) {
        var adapter = egret.getImplementation("eui.IAssetAdapter");
        if (!adapter) {
            adapter = new eui.DefaultAssetAdapter();
        }
        adapter.getAsset(source, function (content) {
            callback(content);
        }, this);
    }
    eui.getAssets = getAssets;
    function getTheme(source, callback) {
        var adapter = egret.getImplementation("eui.IThemeAdapter");
        if (!adapter) {
            adapter = new eui.DefaultThemeAdapter();
        }
        adapter.getTheme(source, function (data) {
            callback(data);
        }, function (e) { console.log(e); }, this);
    }
    eui.getTheme = getTheme;
})(eui || (eui = {}));
(function (eui) {
    var sys;
    (function (sys) {
        var UIComponentClass = "eui.UIComponent";
        function isDeltaIdentity(m) {
            return (m.a === 1 && m.b === 0 && m.c === 0 && m.d === 1);
        }
        var validator = new sys.Validator();
        /**
         * @private
         * EUI 显示对象基类模板。仅作为 UIComponent 的默认实现，为egret.sys.implemenetUIComponenet()方法提供代码模板。
         * 注意：在此类里不允许直接使用super关键字访问父类方法。一律使用this.$super属性访问。
         */
        var UIComponentImpl = (function (_super) {
            __extends(UIComponentImpl, _super);
            /**
             * @private
             * 构造函数
             */
            function UIComponentImpl() {
                var _this = _super.call(this) || this;
                _this.initializeUIValues();
                return _this;
            }
            /**
             * @private
             * UIComponentImpl 定义的所有变量请不要添加任何初始值，必须统一在此处初始化。
             */
            UIComponentImpl.prototype.initializeUIValues = function () {
                this.$UIComponent = {
                    0: NaN,
                    1: NaN,
                    2: NaN,
                    3: NaN,
                    4: NaN,
                    5: NaN,
                    6: NaN,
                    7: NaN,
                    8: NaN,
                    9: NaN,
                    10: 0,
                    11: 0,
                    12: 0,
                    13: 100000,
                    14: 0,
                    15: 100000,
                    16: 0,
                    17: 0,
                    18: NaN,
                    19: NaN,
                    20: 0,
                    21: 0,
                    22: 0,
                    23: 0,
                    24: true,
                    25: true,
                    26: true,
                    27: false,
                    28: false,
                    29: false,
                };
                this.$includeInLayout = true;
                //if egret
                this.$touchEnabled = true;
                //endif*/
            };
            /**
             * @private
             * 子类覆盖此方法可以执行一些初始化子项操作。此方法仅在组件第一次添加到舞台时回调一次。
             * 请务必调用super.createChildren()以完成父类组件的初始化
             */
            UIComponentImpl.prototype.createChildren = function () {
            };
            /**
             * @private
             * 子项创建完成,此方法在createChildren()之后执行。
             */
            UIComponentImpl.prototype.childrenCreated = function () {
            };
            /**
             * @private
             * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
             */
            UIComponentImpl.prototype.commitProperties = function () {
                var values = this.$UIComponent;
                if (values[22 /* oldWidth */] != values[10 /* width */] || values[23 /* oldHeight */] != values[11 /* height */]) {
                    this.dispatchEventWith(egret.Event.RESIZE);
                    values[22 /* oldWidth */] = values[10 /* width */];
                    values[23 /* oldHeight */] = values[11 /* height */];
                }
                if (values[20 /* oldX */] != this.$getX() || values[21 /* oldY */] != this.$getY()) {
                    eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.MOVE);
                    values[20 /* oldX */] = this.$getX();
                    values[21 /* oldY */] = this.$getY();
                }
            };
            /**
             * @private
             * 测量组件尺寸
             */
            UIComponentImpl.prototype.measure = function () {
            };
            /**
             * @private
             * 更新显示列表
             */
            UIComponentImpl.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            };
            Object.defineProperty(UIComponentImpl.prototype, "includeInLayout", {
                /**
                 * @private
                 * 指定此组件是否包含在父容器的布局中。若为false，则父级容器在测量和布局阶段都忽略此组件。默认值为true。
                 * 注意，visible属性与此属性不同，设置visible为false，父级容器仍会对其布局。
                 */
                get: function () {
                    return this.$includeInLayout;
                },
                set: function (value) {
                    value = !!value;
                    if (this.$includeInLayout === value)
                        return;
                    this.$includeInLayout = true;
                    this.invalidateParentLayout();
                    this.$includeInLayout = value;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @private
             *
             * @param stage
             * @param nestLevel
             */
            UIComponentImpl.prototype.$onAddToStage = function (stage, nestLevel) {
                this.$super.$onAddToStage.call(this, stage, nestLevel);
                this.checkInvalidateFlag();
                var values = this.$UIComponent;
                if (!values[29 /* initialized */]) {
                    values[29 /* initialized */] = true;
                    this.createChildren();
                    this.childrenCreated();
                    eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CREATION_COMPLETE);
                }
            };
            /**
             * @private
             * 检查属性失效标记并应用
             */
            UIComponentImpl.prototype.checkInvalidateFlag = function (event) {
                var values = this.$UIComponent;
                if (values[24 /* invalidatePropertiesFlag */]) {
                    validator.invalidateProperties(this);
                }
                if (values[25 /* invalidateSizeFlag */]) {
                    validator.invalidateSize(this);
                }
                if (values[26 /* invalidateDisplayListFlag */]) {
                    validator.invalidateDisplayList(this);
                }
            };
            Object.defineProperty(UIComponentImpl.prototype, "left", {
                /**
                 * @private
                 * 距父级容器离左边距离
                 */
                get: function () {
                    return this.$UIComponent[0 /* left */];
                },
                set: function (value) {
                    if (!value || typeof value == "number") {
                        value = +value;
                    }
                    else {
                        value = value.toString().trim();
                    }
                    var values = this.$UIComponent;
                    if (values[0 /* left */] === value)
                        return;
                    values[0 /* left */] = value;
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "right", {
                /**
                 * @private
                 * 距父级容器右边距离
                 */
                get: function () {
                    return this.$UIComponent[1 /* right */];
                },
                set: function (value) {
                    if (!value || typeof value == "number") {
                        value = +value;
                    }
                    else {
                        value = value.toString().trim();
                    }
                    var values = this.$UIComponent;
                    if (values[1 /* right */] === value)
                        return;
                    values[1 /* right */] = value;
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "top", {
                /**
                 * @private
                 * 距父级容器顶部距离
                 */
                get: function () {
                    return this.$UIComponent[2 /* top */];
                },
                set: function (value) {
                    if (!value || typeof value == "number") {
                        value = +value;
                    }
                    else {
                        value = value.toString().trim();
                    }
                    var values = this.$UIComponent;
                    if (values[2 /* top */] === value)
                        return;
                    values[2 /* top */] = value;
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "bottom", {
                /**
                 * @private
                 * 距父级容器底部距离
                 */
                get: function () {
                    return this.$UIComponent[3 /* bottom */];
                },
                set: function (value) {
                    if (!value || typeof value == "number") {
                        value = +value;
                    }
                    else {
                        value = value.toString().trim();
                    }
                    var values = this.$UIComponent;
                    if (values[3 /* bottom */] == value)
                        return;
                    values[3 /* bottom */] = value;
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "horizontalCenter", {
                /**
                 * @private
                 * 在父级容器中距水平中心位置的距离
                 */
                get: function () {
                    return this.$UIComponent[4 /* horizontalCenter */];
                },
                set: function (value) {
                    if (!value || typeof value == "number") {
                        value = +value;
                    }
                    else {
                        value = value.toString().trim();
                    }
                    var values = this.$UIComponent;
                    if (values[4 /* horizontalCenter */] === value)
                        return;
                    values[4 /* horizontalCenter */] = value;
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "verticalCenter", {
                /**
                 * @private
                 * 在父级容器中距竖直中心位置的距离
                 */
                get: function () {
                    return this.$UIComponent[5 /* verticalCenter */];
                },
                set: function (value) {
                    if (!value || typeof value == "number") {
                        value = +value;
                    }
                    else {
                        value = value.toString().trim();
                    }
                    var values = this.$UIComponent;
                    if (values[5 /* verticalCenter */] === value)
                        return;
                    values[5 /* verticalCenter */] = value;
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "percentWidth", {
                /**
                 * @private
                 * 相对父级容器宽度的百分比
                 */
                get: function () {
                    return this.$UIComponent[6 /* percentWidth */];
                },
                set: function (value) {
                    value = +value;
                    var values = this.$UIComponent;
                    if (values[6 /* percentWidth */] === value)
                        return;
                    values[6 /* percentWidth */] = value;
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "percentHeight", {
                /**
                 * @private
                 * 相对父级容器高度的百分比
                 */
                get: function () {
                    return this.$UIComponent[7 /* percentHeight */];
                },
                set: function (value) {
                    value = +value;
                    var values = this.$UIComponent;
                    if (values[7 /* percentHeight */] === value)
                        return;
                    values[7 /* percentHeight */] = value;
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "explicitWidth", {
                /**
                 * @private
                 * 外部显式指定的宽度
                 */
                get: function () {
                    return this.$UIComponent[8 /* explicitWidth */];
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "explicitHeight", {
                /**
                 * @private
                 * 外部显式指定的高度
                 */
                get: function () {
                    return this.$UIComponent[9 /* explicitHeight */];
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @private
             * 组件宽度,默认值为egret.NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
             */
            UIComponentImpl.prototype.$getWidth = function () {
                this.validateSizeNow();
                return this.$UIComponent[10 /* width */];
            };
            /**
             * @private
             *
             * @param value
             */
            UIComponentImpl.prototype.$setWidth = function (value) {
                value = +value;
                var values = this.$UIComponent;
                if (value < 0 || values[10 /* width */] === value && values[8 /* explicitWidth */] === value)
                    return false;
                values[8 /* explicitWidth */] = value;
                if (isNaN(value))
                    this.invalidateSize();
                this.invalidateProperties();
                this.invalidateDisplayList();
                this.invalidateParentLayout();
                return true;
            };
            /**
             * @private
             * 立即验证自身的尺寸。
             */
            UIComponentImpl.prototype.validateSizeNow = function () {
                this.validateSize(true);
                this.updateFinalSize();
            };
            /**
             * @private
             * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
             */
            UIComponentImpl.prototype.$getHeight = function () {
                this.validateSizeNow();
                return this.$UIComponent[11 /* height */];
            };
            /**
             * @private
             *
             * @param value
             */
            UIComponentImpl.prototype.$setHeight = function (value) {
                value = +value;
                var values = this.$UIComponent;
                if (value < 0 || values[11 /* height */] === value && values[9 /* explicitHeight */] === value)
                    return false;
                values[9 /* explicitHeight */] = value;
                if (isNaN(value))
                    this.invalidateSize();
                this.invalidateProperties();
                this.invalidateDisplayList();
                this.invalidateParentLayout();
                return true;
            };
            Object.defineProperty(UIComponentImpl.prototype, "minWidth", {
                /**
                 * @private
                 * 组件的最小宽度,此属性设置为大于maxWidth的值时无效。同时影响测量和自动布局的尺寸。
                 */
                get: function () {
                    return this.$UIComponent[12 /* minWidth */];
                },
                set: function (value) {
                    value = +value || 0;
                    var values = this.$UIComponent;
                    if (value < 0 || values[12 /* minWidth */] === value) {
                        return;
                    }
                    values[12 /* minWidth */] = value;
                    this.invalidateSize();
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "maxWidth", {
                /**
                 * @private
                 * 组件的最大高度。同时影响测量和自动布局的尺寸。
                 */
                get: function () {
                    return this.$UIComponent[13 /* maxWidth */];
                },
                set: function (value) {
                    value = +value || 0;
                    var values = this.$UIComponent;
                    if (value < 0 || values[13 /* maxWidth */] === value) {
                        return;
                    }
                    values[13 /* maxWidth */] = value;
                    this.invalidateSize();
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "minHeight", {
                /**
                 * @private
                 * 组件的最小高度,此属性设置为大于maxHeight的值时无效。同时影响测量和自动布局的尺寸。
                 */
                get: function () {
                    return this.$UIComponent[14 /* minHeight */];
                },
                set: function (value) {
                    value = +value || 0;
                    var values = this.$UIComponent;
                    if (value < 0 || values[14 /* minHeight */] === value) {
                        return;
                    }
                    values[14 /* minHeight */] = value;
                    this.invalidateSize();
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(UIComponentImpl.prototype, "maxHeight", {
                /**
                 * @private
                 * 组件的最大高度,同时影响测量和自动布局的尺寸。
                 */
                get: function () {
                    return this.$UIComponent[15 /* maxHeight */];
                },
                set: function (value) {
                    value = +value || 0;
                    var values = this.$UIComponent;
                    if (value < 0 || values[15 /* maxHeight */] === value) {
                        return;
                    }
                    values[15 /* maxHeight */] = value;
                    this.invalidateSize();
                    this.invalidateParentLayout();
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @private
             * 设置测量结果。
             * @param width 测量宽度
             * @param height 测量高度
             */
            UIComponentImpl.prototype.setMeasuredSize = function (width, height) {
                var values = this.$UIComponent;
                values[16 /* measuredWidth */] = Math.ceil(+width || 0);
                values[17 /* measuredHeight */] = Math.ceil(+height || 0);
            };
            /**
             * @private
             * 设置组件的宽高。此方法不同于直接设置width,height属性，
             * 不会影响显式标记尺寸属性
             */
            UIComponentImpl.prototype.setActualSize = function (w, h) {
                var change = false;
                var values = this.$UIComponent;
                if (values[10 /* width */] !== w) {
                    values[10 /* width */] = w;
                    change = true;
                }
                if (values[11 /* height */] !== h) {
                    values[11 /* height */] = h;
                    change = true;
                }
                if (change) {
                    this.invalidateDisplayList();
                    this.dispatchEventWith(egret.Event.RESIZE);
                }
            };
            /**
             * @private
             */
            UIComponentImpl.prototype.$updateUseTransform = function () {
                this.$super.$updateUseTransform.call(this);
                this.invalidateParentLayout();
            };
            /**
             * @private
             */
            UIComponentImpl.prototype.$setMatrix = function (matrix, needUpdateProperties) {
                if (needUpdateProperties === void 0) { needUpdateProperties = true; }
                this.$super.$setMatrix.call(this, matrix, needUpdateProperties);
                this.invalidateParentLayout();
                return true;
            };
            /**
             * @private
             */
            UIComponentImpl.prototype.$setAnchorOffsetX = function (value) {
                this.$super.$setAnchorOffsetX.call(this, value);
                this.invalidateParentLayout();
                return true;
            };
            /**
             * @private
             */
            UIComponentImpl.prototype.$setAnchorOffsetY = function (value) {
                this.$super.$setAnchorOffsetY.call(this, value);
                this.invalidateParentLayout();
                return true;
            };
            /**
             * @private
             *
             * @param value
             * @returns
             */
            UIComponentImpl.prototype.$setX = function (value) {
                var change = this.$super.$setX.call(this, value);
                if (change) {
                    this.invalidateParentLayout();
                    this.invalidateProperties();
                }
                return change;
            };
            /**
             * @private
             *
             * @param value
             * @returns
             */
            UIComponentImpl.prototype.$setY = function (value) {
                var change = this.$super.$setY.call(this, value);
                if (change) {
                    this.invalidateParentLayout();
                    this.invalidateProperties();
                }
                return change;
            };
            /**
             * @private
             * 标记属性失效
             */
            UIComponentImpl.prototype.invalidateProperties = function () {
                var values = this.$UIComponent;
                if (!values[24 /* invalidatePropertiesFlag */]) {
                    values[24 /* invalidatePropertiesFlag */] = true;
                    if (this.$stage)
                        validator.invalidateProperties(this);
                }
            };
            /**
             * @private
             * 验证组件的属性
             */
            UIComponentImpl.prototype.validateProperties = function () {
                var values = this.$UIComponent;
                if (values[24 /* invalidatePropertiesFlag */]) {
                    this.commitProperties();
                    values[24 /* invalidatePropertiesFlag */] = false;
                }
            };
            /**
             * @private
             * 标记提交过需要验证组件尺寸
             */
            UIComponentImpl.prototype.invalidateSize = function () {
                var values = this.$UIComponent;
                if (!values[25 /* invalidateSizeFlag */]) {
                    values[25 /* invalidateSizeFlag */] = true;
                    if (this.$stage)
                        validator.invalidateSize(this);
                }
            };
            /**
             * @private
             * 验证组件的尺寸
             */
            UIComponentImpl.prototype.validateSize = function (recursive) {
                if (recursive) {
                    var children = this.$children;
                    if (children) {
                        var length_5 = children.length;
                        for (var i = 0; i < length_5; i++) {
                            var child = children[i];
                            if (egret.is(child, UIComponentClass)) {
                                child.validateSize(true);
                            }
                        }
                    }
                }
                var values = this.$UIComponent;
                if (values[25 /* invalidateSizeFlag */]) {
                    var changed = this.measureSizes();
                    if (changed) {
                        this.invalidateDisplayList();
                        this.invalidateParentLayout();
                    }
                    values[25 /* invalidateSizeFlag */] = false;
                }
            };
            /**
             * @private
             * 测量组件尺寸，返回尺寸是否发生变化
             */
            UIComponentImpl.prototype.measureSizes = function () {
                var changed = false;
                var values = this.$UIComponent;
                if (!values[25 /* invalidateSizeFlag */])
                    return changed;
                if (isNaN(values[8 /* explicitWidth */]) || isNaN(values[9 /* explicitHeight */])) {
                    this.measure();
                    if (values[16 /* measuredWidth */] < values[12 /* minWidth */]) {
                        values[16 /* measuredWidth */] = values[12 /* minWidth */];
                    }
                    if (values[16 /* measuredWidth */] > values[13 /* maxWidth */]) {
                        values[16 /* measuredWidth */] = values[13 /* maxWidth */];
                    }
                    if (values[17 /* measuredHeight */] < values[14 /* minHeight */]) {
                        values[17 /* measuredHeight */] = values[14 /* minHeight */];
                    }
                    if (values[17 /* measuredHeight */] > values[15 /* maxHeight */]) {
                        values[17 /* measuredHeight */] = values[15 /* maxHeight */];
                    }
                }
                var preferredW = this.getPreferredUWidth();
                var preferredH = this.getPreferredUHeight();
                if (preferredW !== values[18 /* oldPreferWidth */] ||
                    preferredH !== values[19 /* oldPreferHeight */]) {
                    values[18 /* oldPreferWidth */] = preferredW;
                    values[19 /* oldPreferHeight */] = preferredH;
                    changed = true;
                }
                return changed;
            };
            /**
             * @private
             * 标记需要验证显示列表
             */
            UIComponentImpl.prototype.invalidateDisplayList = function () {
                var values = this.$UIComponent;
                if (!values[26 /* invalidateDisplayListFlag */]) {
                    values[26 /* invalidateDisplayListFlag */] = true;
                    if (this.$stage)
                        validator.invalidateDisplayList(this);
                }
            };
            /**
             * @private
             * 验证子项的位置和大小，并绘制其他可视内容
             */
            UIComponentImpl.prototype.validateDisplayList = function () {
                var values = this.$UIComponent;
                if (values[26 /* invalidateDisplayListFlag */]) {
                    this.updateFinalSize();
                    this.updateDisplayList(values[10 /* width */], values[11 /* height */]);
                    values[26 /* invalidateDisplayListFlag */] = false;
                }
            };
            /**
             * @private
             * 更新最终的组件宽高
             */
            UIComponentImpl.prototype.updateFinalSize = function () {
                var unscaledWidth = 0;
                var unscaledHeight = 0;
                var values = this.$UIComponent;
                if (values[27 /* layoutWidthExplicitlySet */]) {
                    unscaledWidth = values[10 /* width */];
                }
                else if (!isNaN(values[8 /* explicitWidth */])) {
                    unscaledWidth = values[8 /* explicitWidth */];
                }
                else {
                    unscaledWidth = values[16 /* measuredWidth */];
                }
                if (values[28 /* layoutHeightExplicitlySet */]) {
                    unscaledHeight = values[11 /* height */];
                }
                else if (!isNaN(values[9 /* explicitHeight */])) {
                    unscaledHeight = values[9 /* explicitHeight */];
                }
                else {
                    unscaledHeight = values[17 /* measuredHeight */];
                }
                this.setActualSize(unscaledWidth, unscaledHeight);
            };
            /**
             * @private
             * 立即应用组件及其子项的所有属性
             */
            UIComponentImpl.prototype.validateNow = function () {
                if (this.$stage)
                    validator.validateClient(this);
            };
            /**
             * @private
             * 标记父级容器的尺寸和显示列表为失效
             */
            UIComponentImpl.prototype.invalidateParentLayout = function () {
                var parent = this.$parent;
                if (!parent || !this.$includeInLayout || !egret.is(parent, UIComponentClass))
                    return;
                parent.invalidateSize();
                parent.invalidateDisplayList();
            };
            /**
             * @private
             * 设置组件的布局宽高
             */
            UIComponentImpl.prototype.setLayoutBoundsSize = function (layoutWidth, layoutHeight) {
                layoutHeight = +layoutHeight;
                layoutWidth = +layoutWidth;
                if (layoutHeight < 0 || layoutWidth < 0) {
                    return;
                }
                var values = this.$UIComponent;
                var maxWidth = values[13 /* maxWidth */];
                var maxHeight = values[15 /* maxHeight */];
                var minWidth = Math.min(values[12 /* minWidth */], maxWidth);
                var minHeight = Math.min(values[14 /* minHeight */], maxHeight);
                var width;
                var height;
                if (isNaN(layoutWidth)) {
                    values[27 /* layoutWidthExplicitlySet */] = false;
                    width = this.getPreferredUWidth();
                }
                else {
                    values[27 /* layoutWidthExplicitlySet */] = true;
                    width = Math.max(minWidth, Math.min(maxWidth, layoutWidth));
                }
                if (isNaN(layoutHeight)) {
                    values[28 /* layoutHeightExplicitlySet */] = false;
                    height = this.getPreferredUHeight();
                }
                else {
                    values[28 /* layoutHeightExplicitlySet */] = true;
                    height = Math.max(minHeight, Math.min(maxHeight, layoutHeight));
                }
                var matrix = this.getAnchorMatrix();
                if (isDeltaIdentity(matrix)) {
                    this.setActualSize(width, height);
                    return;
                }
                var fitSize = sys.MatrixUtil.fitBounds(layoutWidth, layoutHeight, matrix, values[8 /* explicitWidth */], values[9 /* explicitHeight */], this.getPreferredUWidth(), this.getPreferredUHeight(), minWidth, minHeight, maxWidth, maxHeight);
                if (!fitSize) {
                    fitSize = egret.Point.create(minWidth, minHeight);
                }
                this.setActualSize(fitSize.x, fitSize.y);
                egret.Point.release(fitSize);
            };
            /**
             * @private
             * 设置组件的布局位置
             */
            UIComponentImpl.prototype.setLayoutBoundsPosition = function (x, y) {
                var matrix = this.$getMatrix();
                if (!isDeltaIdentity(matrix) || this.anchorOffsetX != 0 || this.anchorOffsetY != 0) {
                    var bounds = egret.$TempRectangle;
                    this.getLayoutBounds(bounds);
                    x += this.$getX() - bounds.x;
                    y += this.$getY() - bounds.y;
                }
                var changed = this.$super.$setX.call(this, x);
                if (this.$super.$setY.call(this, y) || changed) {
                    eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.MOVE);
                }
            };
            /**
             * @private
             * 组件的布局尺寸,常用于父级的updateDisplayList()方法中
             * 按照：布局尺寸>外部显式设置尺寸>测量尺寸 的优先级顺序返回尺寸,
             * 注意此方法返回值已经包含scale和rotation。
             */
            UIComponentImpl.prototype.getLayoutBounds = function (bounds) {
                var values = this.$UIComponent;
                var w;
                if (values[27 /* layoutWidthExplicitlySet */]) {
                    w = values[10 /* width */];
                }
                else if (!isNaN(values[8 /* explicitWidth */])) {
                    w = values[8 /* explicitWidth */];
                }
                else {
                    w = values[16 /* measuredWidth */];
                }
                var h;
                if (values[28 /* layoutHeightExplicitlySet */]) {
                    h = values[11 /* height */];
                }
                else if (!isNaN(values[9 /* explicitHeight */])) {
                    h = values[9 /* explicitHeight */];
                }
                else {
                    h = values[17 /* measuredHeight */];
                }
                this.applyMatrix(bounds, w, h);
            };
            /**
             * @private
             *
             * @returns
             */
            UIComponentImpl.prototype.getPreferredUWidth = function () {
                var values = this.$UIComponent;
                return isNaN(values[8 /* explicitWidth */]) ?
                    values[16 /* measuredWidth */] : values[8 /* explicitWidth */];
            };
            /**
             * @private
             *
             * @returns
             */
            UIComponentImpl.prototype.getPreferredUHeight = function () {
                var values = this.$UIComponent;
                return isNaN(values[9 /* explicitHeight */]) ?
                    values[17 /* measuredHeight */] : values[9 /* explicitHeight */];
            };
            /**
             * @private
             * 获取组件的首选尺寸,常用于父级的measure()方法中
             * 按照：外部显式设置尺寸>测量尺寸 的优先级顺序返回尺寸，
             * 注意此方法返回值已经包含scale和rotation。
             */
            UIComponentImpl.prototype.getPreferredBounds = function (bounds) {
                var w = this.getPreferredUWidth();
                var h = this.getPreferredUHeight();
                this.applyMatrix(bounds, w, h);
            };
            /**
             * @private
             */
            UIComponentImpl.prototype.applyMatrix = function (bounds, w, h) {
                bounds.setTo(0, 0, w, h);
                var matrix = this.getAnchorMatrix();
                if (isDeltaIdentity(matrix)) {
                    bounds.x += matrix.tx;
                    bounds.y += matrix.ty;
                }
                else {
                    matrix.$transformBounds(bounds);
                }
            };
            /**
             * @private
             */
            UIComponentImpl.prototype.getAnchorMatrix = function () {
                var matrix = this.$getMatrix();
                var offsetX = this.anchorOffsetX;
                var offsetY = this.anchorOffsetY;
                if (offsetX != 0 || offsetY != 0) {
                    var tempM = egret.$TempMatrix;
                    matrix.$preMultiplyInto(tempM.setTo(1, 0, 0, 1, -offsetX, -offsetY), tempM);
                    return tempM;
                }
                return matrix;
            };
            return UIComponentImpl;
        }(egret.DisplayObject));
        sys.UIComponentImpl = UIComponentImpl;
        __reflect(UIComponentImpl.prototype, "eui.sys.UIComponentImpl", ["eui.UIComponent", "egret.DisplayObject"]);
        /**
         * 检查一个函数的方法体是否为空。
         */
        function isEmptyFunction(prototype, key) {
            if (typeof prototype[key] != "function") {
                return false;
            }
            var body = prototype[key].toString();
            var index = body.indexOf("{");
            var lastIndex = body.lastIndexOf("}");
            body = body.substring(index + 1, lastIndex);
            return body.trim() == "";
        }
        /**
         * @private
         * 拷贝模板类的方法体和属性到目标类上。
         * @param target 目标类
         * @param template 模板类
         */
        function mixin(target, template) {
            for (var property in template) {
                if (property != "prototype" && template.hasOwnProperty(property)) {
                    target[property] = template[property];
                }
            }
            var prototype = target.prototype;
            var protoBase = template.prototype;
            var keys = Object.keys(protoBase);
            var length = keys.length;
            for (var i = 0; i < length; i++) {
                var key = keys[i];
                if (key == "__meta__") {
                    continue;
                }
                if (!prototype.hasOwnProperty(key) || isEmptyFunction(prototype, key)) {
                    var value = Object.getOwnPropertyDescriptor(protoBase, key);
                    Object.defineProperty(prototype, key, value);
                }
            }
        }
        sys.mixin = mixin;
        /**
         * @private
         * 自定义类实现UIComponent的步骤：
         * 1.在自定义类的构造函数里调用：this.initializeUIValues();
         * 2.拷贝UIComponent接口定义的所有内容(包括注释掉的protected函数)到自定义类，将所有子类需要覆盖的方法都声明为空方法体。
         * 3.在定义类结尾的外部调用sys.implementUIComponent()，并传入自定义类。
         * 4.若覆盖了某个UIComponent的方法，需要手动调用UIComponentImpl.prototype["方法名"].call(this);
         * @param descendant 自定义的UIComponent子类
         * @param base 自定义子类继承的父类
         */
        function implementUIComponent(descendant, base, isContainer) {
            mixin(descendant, UIComponentImpl);
            var prototype = descendant.prototype;
            prototype.$super = base.prototype;
            eui.registerProperty(descendant, "left", "Percentage");
            eui.registerProperty(descendant, "right", "Percentage");
            eui.registerProperty(descendant, "top", "Percentage");
            eui.registerProperty(descendant, "bottom", "Percentage");
            eui.registerProperty(descendant, "horizontalCenter", "Percentage");
            eui.registerProperty(descendant, "verticalCenter", "Percentage");
            if (isContainer) {
                prototype.$childAdded = function (child, index) {
                    this.invalidateSize();
                    this.invalidateDisplayList();
                };
                prototype.$childRemoved = function (child, index) {
                    this.invalidateSize();
                    this.invalidateDisplayList();
                };
            }
            if (true) {
                Object.defineProperty(prototype, "preferredWidth", {
                    get: function () {
                        var bounds = egret.$TempRectangle;
                        this.getPreferredBounds(bounds);
                        return bounds.width;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "preferredHeight", {
                    get: function () {
                        var bounds = egret.$TempRectangle;
                        this.getPreferredBounds(bounds);
                        return bounds.height;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "preferredX", {
                    get: function () {
                        var bounds = egret.$TempRectangle;
                        this.getPreferredBounds(bounds);
                        return bounds.x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "preferredY", {
                    get: function () {
                        var bounds = egret.$TempRectangle;
                        this.getPreferredBounds(bounds);
                        return bounds.y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "layoutBoundsX", {
                    get: function () {
                        var bounds = egret.$TempRectangle;
                        this.getLayoutBounds(bounds);
                        return bounds.x;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "layoutBoundsY", {
                    get: function () {
                        var bounds = egret.$TempRectangle;
                        this.getLayoutBounds(bounds);
                        return bounds.y;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "layoutBoundsWidth", {
                    get: function () {
                        var bounds = egret.$TempRectangle;
                        this.getLayoutBounds(bounds);
                        return bounds.width;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "layoutBoundsHeight", {
                    get: function () {
                        var bounds = egret.$TempRectangle;
                        this.getLayoutBounds(bounds);
                        return bounds.height;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "measuredWidth", {
                    get: function () {
                        return this.$UIComponent[16 /* measuredWidth */];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "measuredHeight", {
                    get: function () {
                        return this.$UIComponent[17 /* measuredHeight */];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "layoutWidthExplicitlySet", {
                    get: function () {
                        return this.$UIComponent[27 /* layoutWidthExplicitlySet */];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "layoutHeightExplicitlySet", {
                    get: function () {
                        return this.$UIComponent[28 /* layoutHeightExplicitlySet */];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "invalidatePropertiesFlag", {
                    get: function () {
                        return this.$UIComponent[24 /* invalidatePropertiesFlag */];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "invalidateSizeFlag", {
                    get: function () {
                        return this.$UIComponent[25 /* invalidateSizeFlag */];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(prototype, "invalidateDisplayListFlag", {
                    get: function () {
                        return this.$UIComponent[26 /* invalidateDisplayListFlag */];
                    },
                    enumerable: true,
                    configurable: true
                });
            }
        }
        sys.implementUIComponent = implementUIComponent;
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
/// <reference path="../states/State.ts" />
/// <reference path="../core/UIComponent.ts" />
/// <reference path="../utils/registerProperty.ts" />
var eui;
(function (eui) {
    /**
     * The Group class is defines the base class for layout component.
     * If the contents of the sub items are too large to scroll to show, you can wrap a Scroller component outside the
     * group (Give the instance of Group to <code>viewport</code> property of Scroller component).
     * The scroller component can adds a scrolling touch operation for the Group.
     *
     * @see http://edn.egret.com/cn/article/index/id/608 Simple container
     * @defaultProperty elementsContent
     * @includeExample  extension/eui/components/GroupExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * Group 是自动布局的容器基类。如果包含的子项内容太大需要滚动显示，可以在在 Group 外部包裹一层 Scroller 组件
     * (将 Group 实例赋值给 Scroller 组件的 viewport 属性)。Scroller 会为 Group 添加滚动的触摸操作功能，并显示垂直或水平的滚动条。
     *
     * @see http://edn.egret.com/cn/article/index/id/608 简单容器
     * @defaultProperty elementsContent
     * @includeExample  extension/eui/components/GroupExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var Group = (function (_super) {
        __extends(Group, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Group() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.$layout = null;
            /**
             * @private
             */
            _this.$stateValues = new eui.sys.StateValues();
            _this.initializeUIValues();
            _this.$Group = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: false,
                5: false,
            };
            _this.$stateValues.parent = _this;
            return _this;
        }
        Object.defineProperty(Group.prototype, "elementsContent", {
            /**
             * This property is Usually invoked in resolving an EXML for adding multiple children quickly.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 此属性通常在 EXML 的解析器中调用，便于快速添加多个子项。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            set: function (value) {
                if (value) {
                    var length_6 = value.length;
                    for (var i = 0; i < length_6; i++) {
                        this.addChild(value[i]);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "layout", {
            /**
             * The layout object for this container.
             * This object is responsible for the measurement and layout of
             * the UIcomponent in the container.
             *
             * @default eui.BasicLayout
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 此容器的布局对象。
             *
             * s@default eui.BasicLayout
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$layout;
            },
            set: function (value) {
                this.$setLayout(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        Group.prototype.$setLayout = function (value) {
            if (this.$layout == value)
                return false;
            if (this.$layout) {
                this.$layout.target = null;
            }
            this.$layout = value;
            if (value) {
                value.target = this;
            }
            this.invalidateSize();
            this.invalidateDisplayList();
            return true;
        };
        Object.defineProperty(Group.prototype, "contentWidth", {
            /**
             * @copy eui.IViewport#contentWidth
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this.$Group[0 /* contentWidth */];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "contentHeight", {
            /**
             * @copy eui.IViewport#contentHeight
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this.$Group[1 /* contentHeight */];
            },
            enumerable: true,
            configurable: true
        });
        /**
         *
         * Sets the <code>contentWidth</code> and <code>contentHeight</code>
         * properties.
         *
         * This method is intended for layout class developers who should
         * call it from <code>updateDisplayList()</code> methods.
         *
         * @param width The new value of <code>contentWidth</code>.
         * @param height The new value of <code>contentHeight</code>.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         *
         * 设置 <code>contentWidth</code> 和 <code>contentHeight</code> 属性。
         * 此方法由布局来调用，开发者应该在布局类的 <code>updateDisplayList()</code> 方法中对其进行调用。
         *
         * @param width <code>contentWidth</code> 的新值。
         * @param height <code>contentHeight</code> 的新值。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Group.prototype.setContentSize = function (width, height) {
            width = Math.ceil(+width || 0);
            height = Math.ceil(+height || 0);
            var values = this.$Group;
            var wChange = (values[0 /* contentWidth */] !== width);
            var hChange = (values[1 /* contentHeight */] !== height);
            if (!wChange && !hChange) {
                return;
            }
            values[0 /* contentWidth */] = width;
            values[1 /* contentHeight */] = height;
            if (wChange) {
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "contentWidth");
            }
            if (hChange) {
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "contentHeight");
            }
        };
        Object.defineProperty(Group.prototype, "scrollEnabled", {
            /**
             * @copy eui.IViewport#scrollEnabled
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this.$Group[4 /* scrollEnabled */];
            },
            set: function (value) {
                value = !!value;
                var values = this.$Group;
                if (value === values[4 /* scrollEnabled */])
                    return;
                values[4 /* scrollEnabled */] = value;
                this.updateScrollRect();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "scrollH", {
            /**
             * @copy eui.IViewport#scrollH
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this.$Group[2 /* scrollH */];
            },
            set: function (value) {
                value = +value || 0;
                var values = this.$Group;
                if (value === values[2 /* scrollH */])
                    return;
                values[2 /* scrollH */] = value;
                if (this.updateScrollRect() && this.$layout) {
                    this.$layout.scrollPositionChanged();
                }
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "scrollH");
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "scrollV", {
            /**
             * @copy eui.IViewport#scrollV
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this.$Group[3 /* scrollV */];
            },
            set: function (value) {
                value = +value || 0;
                var values = this.$Group;
                if (value == values[3 /* scrollV */])
                    return;
                values[3 /* scrollV */] = value;
                if (this.updateScrollRect() && this.$layout) {
                    this.$layout.scrollPositionChanged();
                }
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "scrollV");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @returns
         */
        Group.prototype.updateScrollRect = function () {
            var values = this.$Group;
            var hasClip = values[4 /* scrollEnabled */];
            if (hasClip) {
                var uiValues = this.$UIComponent;
                this.scrollRect = egret.$TempRectangle.setTo(values[2 /* scrollH */], values[3 /* scrollV */], uiValues[10 /* width */], uiValues[11 /* height */]);
            }
            else if (this.$scrollRect) {
                this.scrollRect = null;
            }
            return hasClip;
        };
        Object.defineProperty(Group.prototype, "numElements", {
            /**
             * The number of layout element in this container.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 布局元素子项的数量。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$children.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Returns the layout element at the specified index.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取一个布局元素子项。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Group.prototype.getElementAt = function (index) {
            return this.$children[index];
        };
        Group.prototype.getVirtualElementAt = function (index) {
            return this.getElementAt(index);
        };
        /**
         * Set the index range of the sub Visual element in container which support virtual layout.
         * This method is invalid in container which do not support virtual layout.
         * This method is usually invoked before layout. Override this method to release the invisible elements.
         *
         * @param startIndex the start index of sub visual elements（include）
         * @param endIndex the end index of sub visual elements（include）
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在支持虚拟布局的容器中，设置容器内可见的子元素索引范围。此方法在不支持虚拟布局的容器中无效。
         * 通常在即将重新布局子项之前会被调用一次，容器覆盖此方法提前释放已经不可见的子元素。
         *
         * @param startIndex 可视元素起始索引（包括）
         * @param endIndex 可视元素结束索引（包括）
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Group.prototype.setVirtualElementIndicesInView = function (startIndex, endIndex) {
        };
        Object.defineProperty(Group.prototype, "touchThrough", {
            /**
             * When <code>true</code>, this property
             * ensures that the entire bounds of the Group respond to
             * touch events such as begin.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 触摸组件的背景透明区域是否可以穿透。设置为true表示可以穿透，反之透明区域也会响应触摸事件。默认 false。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Group[5 /* touchThrough */];
            },
            set: function (value) {
                this.$Group[5 /* touchThrough */] = !!value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        Group.prototype.$hitTest = function (stageX, stageY) {
            var target = _super.prototype.$hitTest.call(this, stageX, stageY);
            if (target || this.$Group[5 /* touchThrough */]) {
                return target;
            }
            //Bug: 当 group.sacleX or scaleY ==0 的时候，随便点击那里都点击成功
            //虽然 super.$hitTest里面检测过一次 宽高大小，但是没有直接退出这个函数，所以要再判断一次;（width,height可以不判断）
            if (!this.$visible || !this.touchEnabled || this.scaleX === 0 || this.scaleY === 0 || this.width === 0 || this.height === 0) {
                return null;
            }
            var point = this.globalToLocal(stageX, stageY, egret.$TempPoint);
            var values = this.$UIComponent;
            var bounds = egret.$TempRectangle.setTo(0, 0, values[10 /* width */], values[11 /* height */]);
            var scrollRect = this.$scrollRect;
            if (scrollRect) {
                bounds.x = scrollRect.x;
                bounds.y = scrollRect.y;
            }
            if (bounds.contains(point.x, point.y)) {
                return this;
            }
            return null;
        };
        /**
         * @copy eui.Component#invalidateState()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.invalidateState = function () {
            var values = this.$stateValues;
            if (values.stateIsDirty) {
                return;
            }
            values.stateIsDirty = true;
            this.invalidateProperties();
        };
        /**
         * @copy eui.Component#getCurrentState()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.getCurrentState = function () {
            return "";
        };
        /**
         * @copy eui.Component#createChildren()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.createChildren = function () {
            if (!this.$layout) {
                this.$setLayout(new eui.BasicLayout());
            }
            this.initializeStates(this.$stage);
        };
        /**
         * @copy eui.Component#childrenCreated()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.childrenCreated = function () {
        };
        /**
         * @copy eui.Component#commitProperties()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.commitProperties = function () {
            eui.sys.UIComponentImpl.prototype["commitProperties"].call(this);
            var values = this.$stateValues;
            if (values.stateIsDirty) {
                values.stateIsDirty = false;
                if (!values.explicitState) {
                    values.currentState = this.getCurrentState();
                    this.commitCurrentState();
                }
            }
        };
        /**
         * @copy eui.Component#measure()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.measure = function () {
            if (!this.$layout) {
                this.setMeasuredSize(0, 0);
                return;
            }
            this.$layout.measure();
        };
        /**
         * @copy eui.Component#updateDisplayList()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            if (this.$layout) {
                this.$layout.updateDisplayList(unscaledWidth, unscaledHeight);
            }
            this.updateScrollRect();
        };
        /**
         * @copy eui.Component#invalidateParentLayout()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.invalidateParentLayout = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.setMeasuredSize = function (width, height) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.invalidateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.validateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.invalidateSize = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.validateSize = function (recursive) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.invalidateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.validateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.validateNow = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.setLayoutBoundsSize = function (layoutWidth, layoutHeight) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.setLayoutBoundsPosition = function (x, y) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.getLayoutBounds = function (bounds) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Group.prototype.getPreferredBounds = function (bounds) {
        };
        return Group;
    }(egret.DisplayObjectContainer));
    eui.Group = Group;
    __reflect(Group.prototype, "eui.Group", ["eui.IViewport", "eui.UIComponent", "egret.DisplayObject"]);
    eui.sys.implementUIComponent(Group, egret.DisplayObjectContainer, true);
    eui.sys.mixin(Group, eui.sys.StateClient);
    eui.registerProperty(Group, "elementsContent", "Array", true);
    eui.registerProperty(Group, "states", "State[]");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var key = "__bindables__";
    /**
     * Register a property of an instance is can be bound.
     * This method is ususally invoked by Watcher class.
     *
     * @param instance the instance to be registered.
     * @param property the property of specified instance to be registered.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 标记实例的一个属性是可绑定的,此方法通常由 Watcher 类调用。
     *
     * @param instance 要标记的实例
     * @param property 可绑定的属性。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    function registerBindable(instance, property) {
        if (true) {
            if (!instance) {
                egret.$error(1003, "instance");
            }
            if (!property) {
                egret.$error(1003, "property");
            }
        }
        if (instance.hasOwnProperty(key)) {
            instance[key].push(property);
        }
        else {
            var list = [property];
            if (instance[key]) {
                list = instance[key].concat(list);
            }
            instance[key] = list;
        }
    }
    eui.registerBindable = registerBindable;
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
/// <reference path="../core/UIComponent.ts" />
/// <reference path="../utils/registerProperty.ts" />
var eui;
(function (eui) {
    /**
     * The Component class defines the base class for skinnable components.
     * The skins used by a Component class are typically child classes of
     * the Skin class.<p/>
     *
     * Associate a skin class with a component class by setting the <code>skinName</code> property of the
     * component class.
     * @event egret.Event.COMPLETE Dispatch when <code>skinName</code> property is set the path of external EXML file and the EXML file is resolved.
     *
     * @includeExample  extension/eui/components/ComponentExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * Component 类定义可设置外观的组件的基类。Component 类所使用的外观通常是 Skin 类的子类。<p/>
     * 通过设置 component 类的 skinName 属性，将 skin 类与 component 类相关联。
     * @event egret.Event.COMPLETE 当设置skinName为外部exml文件路径时，加载并完成EXML解析后调度。
     *
     * @includeExample  extension/eui/components/ComponentExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var Component = (function (_super) {
        __extends(Component, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Component() {
            var _this = _super.call(this) || this;
            _this.initializeUIValues();
            _this.$Component = {
                0: null,
                1: null,
                2: "",
                3: true,
                4: false,
                5: false,
                6: true,
                7: true,
                8: null //skin
            };
            //if egret
            _this.$touchEnabled = true;
            return _this;
            //endif*/
        }
        Object.defineProperty(Component.prototype, "hostComponentKey", {
            /**
             * A identifier of host component which can determine only one component names.
             * Usually used for quering a default skin name in theme.
             * @default null
             * @see eui.Theme#getSkinName()
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 主机组件标识符。用于唯一确定一个组件的名称。通常用于在主题中查询默认皮肤名。
             *
             * @default null
             * @see eui.Theme#getSkinName()
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Component[0 /* hostComponentKey */];
            },
            set: function (value) {
                this.$Component[0 /* hostComponentKey */] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "skinName", {
            /**
             * Identifier of skin. Valid values: class definition of skin,
             * class name of skin, instance of skin, EXML or external EXML file path.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 皮肤标识符。有效值可为：皮肤类定义,皮肤类名,皮肤实例,EXML文件内容,或外部EXML文件路径，
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Component[1 /* skinName */];
            },
            set: function (value) {
                var values = this.$Component;
                values[5 /* skinNameExplicitlySet */] = true;
                if (values[1 /* skinName */] == value)
                    return;
                if (value) {
                    values[1 /* skinName */] = value;
                }
                else {
                    var theme = egret.getImplementation("eui.Theme");
                    if (theme) {
                        var skinName = theme.getSkinName(this);
                        if (skinName) {
                            values[1 /* skinName */] = skinName;
                        }
                    }
                }
                this.$parseSkinName();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * 解析skinName
         */
        Component.prototype.$parseSkinName = function () {
            var skinName = this.skinName;
            var skin;
            if (skinName) {
                if (skinName.prototype) {
                    skin = new skinName();
                }
                else if (typeof (skinName) == "string") {
                    var clazz = void 0;
                    var text = skinName.trim();
                    if (text.charAt(0) == "<") {
                        clazz = EXML.parse(text);
                    }
                    else {
                        clazz = egret.getDefinitionByName(skinName);
                        if (!clazz && text.toLowerCase().indexOf(".exml") != -1) {
                            EXML.load(skinName, this.onExmlLoaded, this, true);
                            return;
                        }
                    }
                    if (clazz) {
                        skin = new clazz();
                    }
                }
                else {
                    skin = skinName;
                }
            }
            this.setSkin(skin);
        };
        /**
         * @private
         * @param clazz
         * @param url
         */
        Component.prototype.onExmlLoaded = function (clazz, url) {
            if (this.skinName != url) {
                return;
            }
            var skin = new clazz();
            this.setSkin(skin);
        };
        Object.defineProperty(Component.prototype, "skin", {
            /**
             * The instance of the skin class for this component instance.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 皮肤对象实例。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Component[8 /* skin */];
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Setter for the skin instance.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置皮肤实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.setSkin = function (skin) {
            if (skin && !(skin instanceof eui.Skin)) {
                skin = null;
                true && egret.$error(2202);
            }
            var values = this.$Component;
            var oldSkin = values[8 /* skin */];
            if (oldSkin) {
                var skinParts = oldSkin.skinParts;
                var length_7 = skinParts.length;
                for (var i = 0; i < length_7; i++) {
                    var partName = skinParts[i];
                    if (this[partName]) {
                        this.setSkinPart(partName, null);
                    }
                }
                var children = oldSkin.$elementsContent;
                if (children) {
                    length_7 = children.length;
                    for (var i = 0; i < length_7; i++) {
                        var child = children[i];
                        if (child.$parent == this) {
                            this.removeChild(child);
                        }
                    }
                }
                oldSkin.hostComponent = null;
            }
            values[8 /* skin */] = skin;
            if (skin) {
                var skinParts = skin.skinParts;
                var length_8 = skinParts.length;
                for (var i = 0; i < length_8; i++) {
                    var partName = skinParts[i];
                    var instance = skin[partName];
                    if (instance) {
                        this.setSkinPart(partName, instance);
                    }
                }
                var children = skin.$elementsContent;
                if (children) {
                    for (var i = children.length - 1; i >= 0; i--) {
                        this.addChildAt(children[i], 0);
                    }
                }
                skin.hostComponent = this;
            }
            this.invalidateSize();
            this.invalidateDisplayList();
            this.dispatchEventWith(egret.Event.COMPLETE);
        };
        /**
         * Find the skin parts in the skin class and assign them to the properties of the component.
         * You do not call this method directly. This method will be invoked automatically when using a EXML as skin.
         * The ID for a tag in an EXML will be passed in as <code>partName</code>, and the instance of the tag will be
         * passed in as <code>instance</code>.
         * @param partName name of a skin part
         * @param instance instance of a skin part
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 关联一个对象到逻辑组件的指定皮肤部件上。通常您不需要手动调用此方法，当使用EXML文件作为组件皮肤，此方法将会被自动调用。
         * 在运行时，EXML文件内声明的id名称将作为此方法的partName参数，而id所对应的节点对象，将作为此方法的instance参数被依次传入。
         * @param partName 皮肤部件名称
         * @param instance 皮肤部件实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.setSkinPart = function (partName, instance) {
            var oldInstance = this[partName];
            if (oldInstance) {
                this.partRemoved(partName, oldInstance);
            }
            this[partName] = instance;
            if (instance) {
                this.partAdded(partName, instance);
            }
        };
        /**
         * Called when a skin part is added.
         * You do not call this method directly.
         * EUI calls it automatically when it calls the <code>setSkinPart()</code> method.<p/>
         *
         * Override this function to attach behavior to the part, such as add event listener or
         * assign property values cached.
         * @param partName name of a skin part to add.
         * @param instance instance of a skin part to add.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 添加皮肤部件时调用。
         * 您无需直接调用此方法。
         * EUI 会在调用 setSkinPart()方法时自动调用此方法。<p/>
         *
         * 子类覆盖此方法，以在皮肤部件第一次附加时对其执行一些初始化操作，例如添加事件监听，赋值缓存的属性值等。
         * @param partName 要附加的皮肤部件名称。
         * @param instance 要附加的皮肤部件实例。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.partAdded = function (partName, instance) {
        };
        /**
         * Called when an instance of a skin part is being removed.
         * You do not call this method directly.
         * EUI calls it automatically when it calls the <code>setSkinPart()</code> method.<p/>
         *
         * Override this function to clean behavior of the part, such as remove event listener or
         * disconnect the cache reference
         * @param partName name of a skin part to remove.
         * @param instance instance of a skin part to remove.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 正删除外观部件的实例时调用。
         * 您无需直接调用此方法。
         * EUI 会在调用 setSkinPart()方法时自动调用此方法。<p/>
         *
         * 子类覆盖此方法，以在皮肤部件从逻辑组件卸载时对其执行一些清理操作，例如移除事件监听，断开缓存的引用等。
         * @param partName 要卸载的皮肤部件名称
         * @param instance 要卸载的皮肤部件实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.partRemoved = function (partName, instance) {
        };
        /**
         * @private
         *
         * @param value
         */
        Component.prototype.$setTouchChildren = function (value) {
            value = !!value;
            var values = this.$Component;
            values[6 /* explicitTouchChildren */] = value;
            if (values[3 /* enabled */]) {
                values[6 /* explicitTouchChildren */] = value;
                return _super.prototype.$setTouchChildren.call(this, value);
            }
            else {
                return true;
            }
        };
        /**
         * @private
         *
         * @param value
         */
        Component.prototype.$setTouchEnabled = function (value) {
            value = !!value;
            var values = this.$Component;
            values[7 /* explicitTouchEnabled */] = value;
            if (values[3 /* enabled */]) {
                _super.prototype.$setTouchEnabled.call(this, value);
            }
        };
        Object.defineProperty(Component.prototype, "enabled", {
            /**
             * Whether the component can accept user interaction.
             * After setting the <code>enabled</code> property to <code>false</code>, components will disabled touch event
             * (set <code>touchEnabled</code> and <code>touchChildren</code> to false) and set state of skin to "disabled".
             *
             * @default true
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 组件是否可以接受用户交互。
             * 将 enabled 属性设置为 false 后，
             * 组件会自动禁用触摸事件(将 touchEnabled 和 touchChildren 同时设置为 false)，
             * 部分组件可能还会将皮肤的视图状态设置为"disabled",使其所有子项的颜色变暗。
             *
             * @default true
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Component[3 /* enabled */];
            },
            set: function (value) {
                value = !!value;
                this.$setEnabled(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        Component.prototype.$setEnabled = function (value) {
            var values = this.$Component;
            if (value === values[3 /* enabled */]) {
                return false;
            }
            values[3 /* enabled */] = value;
            if (value) {
                this.$touchEnabled = values[7 /* explicitTouchEnabled */];
                this.$touchChildren = values[6 /* explicitTouchChildren */];
            }
            else {
                this.$touchEnabled = false;
                this.$touchChildren = false;
            }
            this.invalidateState();
            return true;
        };
        Object.defineProperty(Component.prototype, "currentState", {
            //========================皮肤视图状态=====================start=======================
            /**
             * The current view state of the component. When you use this property to set a component's state,
             * EUI will explicit update state of skin and ignore the return of <code>getCurrentState()</code>.
             *
             * Set to <code>""</code> or <code>null</code> to reset the component back to its base state.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 组件的当前视图状态。显式设置此属性，
             * 将采用显式设置的值去更新皮肤状态，而忽略组件内部 getCurrentState() 方法返回的值。
             *
             * 将其设置为 "" 或 null 可将取消组件外部显式设置的视图状态名称，从而采用内部 getCurrentState() 方法返回的状态。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                var values = this.$Component;
                return values[2 /* explicitState */] ?
                    values[2 /* explicitState */] : this.getCurrentState();
            },
            set: function (value) {
                var values = this.$Component;
                if (value == values[2 /* explicitState */]) {
                    return;
                }
                values[2 /* explicitState */] = value;
                this.invalidateState();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Marks the component so that the new state of the skin is set during a later screen update.
         * A subclass of SkinnableComponent must override <code>getCurrentState()</code> to return a value.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 标记组件当前的视图状态失效，调用此方法后，子类应该覆盖 <code>getCurrentState()</code> 方法来返回当前的视图状态名称。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.invalidateState = function () {
            var values = this.$Component;
            if (values[4 /* stateIsDirty */])
                return;
            values[4 /* stateIsDirty */] = true;
            this.invalidateProperties();
        };
        /**
         * Returns the name of the state to be applied to the skin.<p/>
         * A subclass of SkinnableComponent must override this method to return a value.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回组件当前的皮肤状态名称,子类覆盖此方法定义各种状态名
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.getCurrentState = function () {
            return "";
        };
        /**
         * Create child objects of the component. This is an advanced method that you might override
         * when creating a subclass of Component. This method will be called once it be added to stage.
         * You must invoke <code>super.createChildren()</code> to complete initialization of the parent class
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 子类覆盖此方法可以执行一些初始化子项操作。此方法仅在组件第一次添加到舞台时回调一次。
         * 请务必调用super.createChildren()以完成父类组件的初始化
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.createChildren = function () {
            var values = this.$Component;
            if (!values[1 /* skinName */]) {
                var theme = egret.getImplementation("eui.Theme");
                if (theme) {
                    var skinName = theme.getSkinName(this);
                    if (skinName) {
                        values[1 /* skinName */] = skinName;
                        this.$parseSkinName();
                    }
                }
            }
        };
        /**
         * Performs any final processing after child objects are created.
         * This is an advanced method that you might override
         * when creating a subclass of Component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建子对象后执行任何最终处理。此方法在创建 Component 的子类时覆盖。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.childrenCreated = function () {
        };
        /**
         * Processes the properties set on the component.
         * You can override this method when creating a subclass of Component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.commitProperties = function () {
            eui.sys.UIComponentImpl.prototype["commitProperties"].call(this);
            var values = this.$Component;
            if (values[4 /* stateIsDirty */]) {
                values[4 /* stateIsDirty */] = false;
                if (values[8 /* skin */]) {
                    values[8 /* skin */].currentState = this.currentState;
                }
            }
        };
        /**
         * Calculates the default size.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 测量组件尺寸
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.measure = function () {
            eui.sys.measure(this);
            var skin = this.$Component[8 /* skin */];
            if (!skin) {
                return;
            }
            var values = this.$UIComponent;
            if (!isNaN(skin.width)) {
                values[16 /* measuredWidth */] = skin.width;
            }
            else {
                if (values[16 /* measuredWidth */] < skin.minWidth) {
                    values[16 /* measuredWidth */] = skin.minWidth;
                }
                if (values[16 /* measuredWidth */] > skin.maxWidth) {
                    values[16 /* measuredWidth */] = skin.maxWidth;
                }
            }
            if (!isNaN(skin.height)) {
                values[17 /* measuredHeight */] = skin.height;
            }
            else {
                if (values[17 /* measuredHeight */] < skin.minHeight) {
                    values[17 /* measuredHeight */] = skin.minHeight;
                }
                if (values[17 /* measuredHeight */] > skin.maxHeight) {
                    values[17 /* measuredHeight */] = skin.maxHeight;
                }
            }
        };
        /**
         * Draws the object and/or sizes and positions its children.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 更新显示列表
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            eui.sys.updateDisplayList(this, unscaledWidth, unscaledHeight);
        };
        /**
         * Method to invalidate parent size and display list if
         * this object affects its layout (includeInLayout is true).
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 此对象影响其布局时（includeInLayout 为 true），使父代大小和显示列表失效的方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Component.prototype.invalidateParentLayout = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.setMeasuredSize = function (width, height) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.invalidateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.validateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.invalidateSize = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.validateSize = function (recursive) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.invalidateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.validateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.validateNow = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.setLayoutBoundsSize = function (layoutWidth, layoutHeight) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.setLayoutBoundsPosition = function (x, y) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.getLayoutBounds = function (bounds) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Component.prototype.getPreferredBounds = function (bounds) {
        };
        return Component;
    }(egret.DisplayObjectContainer));
    eui.Component = Component;
    __reflect(Component.prototype, "eui.Component", ["eui.UIComponent", "egret.DisplayObject"]);
    eui.registerProperty(Component, "skinName", "Class");
    eui.sys.implementUIComponent(Component, egret.DisplayObjectContainer, true);
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The DataGroup class is the base container class for data items.
     * The DataGroup class converts data items to visual elements for display.
     * While this container can hold visual elements, it is often used only
     * to hold data items as children.
     *
     * @see eui.Group
     * @see http://edn.egret.com/cn/article/index/id/527 Data container
     * @see http://edn.egret.com/cn/article/index/id/528 Array collection
     * @defaultProperty dataProvider
     * @includeExample  extension/eui/components/DataGroupExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * DataGroup 类将数据项目转换为可视元素以进行显示。
     * 尽管此容器可以包含可视元素，但它通常仅用于包含作为子项的数据项目。
     *
     * @see eui.Group
     * @see http://edn.egret.com/cn/article/index/id/527 数据容器
     * @see http://edn.egret.com/cn/article/index/id/528 数组集合
     * @defaultProperty dataProvider
     * @includeExample  extension/eui/components/DataGroupExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var DataGroup = (function (_super) {
        __extends(DataGroup, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function DataGroup() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.$dataProviderChanged = false;
            /**
             * @private
             */
            _this.$dataProvider = null;
            /**
             * @private
             * 索引到项呈示器的转换数组
             */
            _this.$indexToRenderer = [];
            _this.$DataGroup = {
                0: true,
                1: false,
                2: {},
                3: {},
                4: false,
                5: false,
                6: null,
                7: null,
                8: false,
                9: null,
                10: false,
                11: false,
                12: null,
                13: null,
                14: false,
            };
            return _this;
        }
        Object.defineProperty(DataGroup.prototype, "useVirtualLayout", {
            /**
             * @copy eui.LayoutBase#useVirtualLayout
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this.$layout ? this.$layout.$useVirtualLayout :
                    this.$DataGroup[0 /* useVirtualLayout */];
            },
            set: function (value) {
                value = !!value;
                var values = this.$DataGroup;
                if (value === values[0 /* useVirtualLayout */])
                    return;
                values[0 /* useVirtualLayout */] = value;
                if (this.$layout)
                    this.$layout.useVirtualLayout = value;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        DataGroup.prototype.$setLayout = function (value) {
            if (value == this.$layout)
                return false;
            if (this.$layout) {
                this.$layout.setTypicalSize(0, 0);
                this.$layout.removeEventListener("useVirtualLayoutChanged", this.onUseVirtualLayoutChanged, this);
            }
            if (this.$layout && value && (this.$layout.$useVirtualLayout != value.$useVirtualLayout))
                this.onUseVirtualLayoutChanged();
            var result = _super.prototype.$setLayout.call(this, value);
            if (value) {
                var rect = this.$DataGroup[9 /* typicalLayoutRect */];
                if (rect) {
                    value.setTypicalSize(rect.width, rect.height);
                }
                value.useVirtualLayout = this.$DataGroup[0 /* useVirtualLayout */];
                value.addEventListener("useVirtualLayoutChanged", this.onUseVirtualLayoutChanged, this);
            }
            return result;
        };
        /**
         * @private
         * 是否使用虚拟布局标记改变
         */
        DataGroup.prototype.onUseVirtualLayoutChanged = function (event) {
            var values = this.$DataGroup;
            values[1 /* useVirtualLayoutChanged */] = true;
            values[10 /* cleanFreeRenderer */] = true;
            this.removeDataProviderListener();
            this.invalidateProperties();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        DataGroup.prototype.setVirtualElementIndicesInView = function (startIndex, endIndex) {
            if (!this.$layout || !this.$layout.$useVirtualLayout) {
                return;
            }
            var indexToRenderer = this.$indexToRenderer;
            var keys = Object.keys(indexToRenderer);
            var length = keys.length;
            for (var i = 0; i < length; i++) {
                var index = +keys[i];
                if (index < startIndex || index > endIndex) {
                    this.freeRendererByIndex(index);
                }
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        DataGroup.prototype.getElementAt = function (index) {
            return this.$indexToRenderer[index];
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.5.2
         * @version eui 1.0
         * @platform Web,Native
         */
        DataGroup.prototype.getVirtualElementAt = function (index) {
            index = +index | 0;
            if (index < 0 || index >= this.$dataProvider.length)
                return null;
            var renderer = this.$indexToRenderer[index];
            if (!renderer) {
                var item = this.$dataProvider.getItemAt(index);
                renderer = this.createVirtualRenderer(item);
                this.$indexToRenderer[index] = renderer;
                this.updateRenderer(renderer, index, item);
                var values = this.$DataGroup;
                if (values[4 /* createNewRendererFlag */]) {
                    renderer.validateNow();
                    values[4 /* createNewRendererFlag */] = false;
                    this.rendererAdded(renderer, index, item);
                }
            }
            return renderer;
        };
        /**
         * @private
         * 释放指定索引处的项呈示器
         */
        DataGroup.prototype.freeRendererByIndex = function (index) {
            var renderer = this.$indexToRenderer[index];
            if (renderer) {
                delete this.$indexToRenderer[index];
                this.doFreeRenderer(renderer);
            }
        };
        /**
         * @private
         *
         * @param renderer
         */
        DataGroup.prototype.doFreeRenderer = function (renderer) {
            var values = this.$DataGroup;
            var rendererClass = values[2 /* rendererToClassMap */][renderer.$hashCode];
            var hashCode = rendererClass.$hashCode;
            if (!values[3 /* freeRenderers */][hashCode]) {
                values[3 /* freeRenderers */][hashCode] = [];
            }
            values[3 /* freeRenderers */][hashCode].push(renderer);
            renderer.visible = false;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        DataGroup.prototype.invalidateSize = function () {
            if (!this.$DataGroup[4 /* createNewRendererFlag */]) {
                _super.prototype.invalidateSize.call(this);
            }
        };
        /**
         * @private
         * 为指定索引创建虚拟的项呈示器
         */
        DataGroup.prototype.createVirtualRenderer = function (item) {
            var renderer;
            var rendererClass = this.itemToRendererClass(item);
            var hashCode = rendererClass.$hashCode;
            var values = this.$DataGroup;
            var freeRenderers = values[3 /* freeRenderers */];
            if (freeRenderers[hashCode] && freeRenderers[hashCode].length > 0) {
                renderer = freeRenderers[hashCode].pop();
                renderer.visible = true;
                this.invalidateDisplayList();
                return renderer;
            }
            values[4 /* createNewRendererFlag */] = true;
            return this.createOneRenderer(rendererClass);
        };
        /**
         * @private
         * 根据rendererClass创建一个Renderer,并添加到显示列表
         */
        DataGroup.prototype.createOneRenderer = function (rendererClass) {
            var renderer = (new rendererClass());
            var values = this.$DataGroup;
            values[2 /* rendererToClassMap */][renderer.$hashCode] = rendererClass;
            if (!egret.is(renderer, "eui.IItemRenderer")) {
                return null;
            }
            if (values[13 /* itemRendererSkinName */]) {
                this.setItemRenderSkinName(renderer, values[13 /* itemRendererSkinName */]);
            }
            this.addChild(renderer);
            return renderer;
        };
        /**
         * @private
         * 设置项呈示器的默认皮肤
         */
        DataGroup.prototype.setItemRenderSkinName = function (renderer, skinName) {
            if (renderer && renderer instanceof eui.Component) {
                var comp = renderer;
                if (!comp.$Component[5 /* skinNameExplicitlySet */]) {
                    comp.skinName = skinName;
                    comp.$Component[5 /* skinNameExplicitlySet */] = false;
                }
            }
        };
        Object.defineProperty(DataGroup.prototype, "dataProvider", {
            /**
             * The data provider for this DataGroup.
             * It must be an ICollection, such as ArrayCollection
             *
             * @see eui.ICollection
             * @see eui.ArrayCollection
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 列表数据源，请使用实现了ICollection接口的数据类型，例如 ArrayCollection
             *
             * @see eui.ICollection
             * @see eui.ArrayCollection
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$dataProvider;
            },
            set: function (value) {
                this.$setDataProvider(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        DataGroup.prototype.$setDataProvider = function (value) {
            if (this.$dataProvider == value || (value && !value.getItemAt))
                return false;
            this.removeDataProviderListener();
            this.$dataProvider = value;
            this.$dataProviderChanged = true;
            this.$DataGroup[10 /* cleanFreeRenderer */] = true;
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
            return true;
        };
        /**
         * @private
         * 移除数据源监听
         */
        DataGroup.prototype.removeDataProviderListener = function () {
            if (this.$dataProvider)
                this.$dataProvider.removeEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this);
        };
        /**
         * Called when contents within the dataProvider changes.  We will catch certain
         * events and update our children based on that.
         *
         * @param event 事件<code>eui.CollectionEvent</code>的对象。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 数据源改变事件处理。
         *
         * @param event 事件<code>eui.CollectionEvent</code>的对象。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        DataGroup.prototype.onCollectionChange = function (event) {
            switch (event.kind) {
                case eui.CollectionEventKind.ADD:
                    this.itemAddedHandler(event.items, event.location);
                    break;
                case eui.CollectionEventKind.REMOVE:
                    this.itemRemovedHandler(event.items, event.location);
                    break;
                case eui.CollectionEventKind.UPDATE:
                case eui.CollectionEventKind.REPLACE:
                    this.itemUpdatedHandler(event.items[0], event.location);
                    break;
                case eui.CollectionEventKind.RESET:
                case eui.CollectionEventKind.REFRESH:
                    if (this.$layout && this.$layout.$useVirtualLayout) {
                        var indexToRenderer = this.$indexToRenderer;
                        var keys = Object.keys(indexToRenderer);
                        var length_9 = keys.length;
                        for (var i = length_9 - 1; i >= 0; i--) {
                            var index = +keys[i];
                            this.freeRendererByIndex(index);
                        }
                    }
                    this.$dataProviderChanged = true;
                    this.invalidateProperties();
                    break;
            }
            this.invalidateSize();
            this.invalidateDisplayList();
        };
        /**
         * @private
         * 数据源添加项目事件处理
         */
        DataGroup.prototype.itemAddedHandler = function (items, index) {
            var length = items.length;
            for (var i = 0; i < length; i++) {
                this.itemAdded(items[i], index + i);
            }
            this.resetRenderersIndices();
        };
        /**
         * @private
         * 数据源移除项目事件处理
         */
        DataGroup.prototype.itemRemovedHandler = function (items, location) {
            var length = items.length;
            for (var i = length - 1; i >= 0; i--) {
                this.itemRemoved(items[i], location + i);
            }
            this.resetRenderersIndices();
        };
        /**
         * Adds the item for the specified dataProvider item to this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param item The item that was added, the value of dataProvider[index].
         * @param index The index where the dataProvider item was added.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 添加一个指定的数据到数据源。
         *
         * 这个方法不应该由开发者直接调用，而用于本类自动内调用。
         *
         * @param item 添加的数据项。
         * @param index 被添加到的索引。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        DataGroup.prototype.itemAdded = function (item, index) {
            if (this.$layout)
                this.$layout.elementAdded(index);
            if (this.$layout && this.$layout.$useVirtualLayout) {
                this.$indexToRenderer.splice(index, 0, null);
                return;
            }
            var renderer = this.createVirtualRenderer(item);
            this.$indexToRenderer.splice(index, 0, renderer);
            if (renderer) {
                this.updateRenderer(renderer, index, item);
                var values = this.$DataGroup;
                if (values[4 /* createNewRendererFlag */]) {
                    values[4 /* createNewRendererFlag */] = false;
                    this.rendererAdded(renderer, index, item);
                }
            }
        };
        /**
         * Removes the itemRenderer for the specified dataProvider item from this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param item The item that is being removed.
         * @param index The index of the item that is being removed.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 删除数据源中指定的项。
         *
         * 这个方法不应该由开发者直接调用，而用于本类自动内调用。
         *
         * @param item 移除的数据项。
         * @param index 被移除的索引。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        DataGroup.prototype.itemRemoved = function (item, index) {
            if (this.$layout)
                this.$layout.elementRemoved(index);
            var oldRenderer = this.$indexToRenderer[index];
            if (this.$indexToRenderer.length > index)
                this.$indexToRenderer.splice(index, 1);
            if (oldRenderer) {
                if (this.$layout && this.$layout.$useVirtualLayout) {
                    this.doFreeRenderer(oldRenderer);
                }
                else {
                    this.rendererRemoved(oldRenderer, index, item);
                    this.removeChild(oldRenderer);
                }
            }
        };
        /**
         * @private
         * 更新当前所有项的索引
         */
        DataGroup.prototype.resetRenderersIndices = function () {
            var indexToRenderer = this.$indexToRenderer;
            if (indexToRenderer.length == 0)
                return;
            if (this.$layout && this.$layout.$useVirtualLayout) {
                var keys = Object.keys(indexToRenderer);
                var length_10 = keys.length;
                for (var i = 0; i < length_10; i++) {
                    var index = +keys[i];
                    this.resetRendererItemIndex(index);
                }
            }
            else {
                var indexToRendererLength = indexToRenderer.length;
                for (var index = 0; index < indexToRendererLength; index++) {
                    this.resetRendererItemIndex(index);
                }
            }
        };
        /**
         * @private
         * 数据源更新或替换项目事件处理
         */
        DataGroup.prototype.itemUpdatedHandler = function (item, location) {
            if (this.$DataGroup[11 /* renderersBeingUpdated */]) {
                return; //防止无限循环
            }
            var renderer = this.$indexToRenderer[location];
            if (renderer)
                this.updateRenderer(renderer, location, item);
        };
        /**
         * @private
         * 调整指定项呈示器的索引值
         */
        DataGroup.prototype.resetRendererItemIndex = function (index) {
            var renderer = this.$indexToRenderer[index];
            if (renderer)
                renderer.itemIndex = index;
        };
        Object.defineProperty(DataGroup.prototype, "itemRenderer", {
            /**
             * The item renderer to use for data items.
             * The class must implement the IItemRenderer interface.
             * If defined, the <code>itemRendererFunction</code> property
             * takes precedence over this property.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 用于数据项目的项呈示器。您应该直接为此属性赋值自定义类的类定义，而不是一个实例。注意：该类必须实现 IItemRenderer 接口。<br/>
             * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$DataGroup[6 /* itemRenderer */];
            },
            set: function (value) {
                var values = this.$DataGroup;
                if (values[6 /* itemRenderer */] == value)
                    return;
                values[6 /* itemRenderer */] = value;
                values[5 /* itemRendererChanged */] = true;
                values[8 /* typicalItemChanged */] = true;
                values[10 /* cleanFreeRenderer */] = true;
                this.removeDataProviderListener();
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataGroup.prototype, "itemRendererSkinName", {
            /**
             * The skinName property of the itemRenderer.This property will be passed to itemRenderer.skinName as default value,if you
             * did not set it explicitly.<br>
             * Note: This property is invalid if the itemRenderer is not a subclass of the Component class.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 条目渲染器的可选皮肤标识符。在实例化itemRenderer时，若其内部没有设置过skinName,则将此属性的值赋值给它的skinName。
             * 注意:若 itemRenderer 不是 Component 的子类，则此属性无效。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$DataGroup[13 /* itemRendererSkinName */];
            },
            set: function (value) {
                var values = this.$DataGroup;
                if (values[13 /* itemRendererSkinName */] == value)
                    return;
                values[13 /* itemRendererSkinName */] = value;
                if (this.$UIComponent[29 /* initialized */]) {
                    values[14 /* itemRendererSkinNameChange */] = true;
                    this.invalidateProperties();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DataGroup.prototype, "itemRendererFunction", {
            /**
             * Function that returns an item renderer for a
             * specific item.
             *
             * If defined, this property
             * takes precedence over the <code>itemRenderer</code> property.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 为某个特定数据项返回一个项呈示器类定义的函数。
             * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$DataGroup[7 /* itemRendererFunction */];
            },
            set: function (value) {
                var values = this.$DataGroup;
                if (values[7 /* itemRendererFunction */] == value)
                    return;
                values[7 /* itemRendererFunction */] = value;
                values[5 /* itemRendererChanged */] = true;
                values[8 /* typicalItemChanged */] = true;
                this.removeDataProviderListener();
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * 为特定的数据项返回项呈示器的工厂实例
         */
        DataGroup.prototype.itemToRendererClass = function (item) {
            var rendererClass;
            var values = this.$DataGroup;
            if (values[7 /* itemRendererFunction */]) {
                rendererClass = values[7 /* itemRendererFunction */](item);
            }
            if (!rendererClass) {
                rendererClass = values[6 /* itemRenderer */];
            }
            if (!rendererClass) {
                rendererClass = eui.ItemRenderer;
            }
            if (!rendererClass.$hashCode) {
                rendererClass.$hashCode = egret.$hashCount++;
            }
            return rendererClass;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        DataGroup.prototype.createChildren = function () {
            if (!this.$layout) {
                var layout = new eui.VerticalLayout();
                layout.gap = 0;
                layout.horizontalAlign = eui.JustifyAlign.CONTENT_JUSTIFY;
                this.$setLayout(layout);
            }
            _super.prototype.createChildren.call(this);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        DataGroup.prototype.commitProperties = function () {
            var values = this.$DataGroup;
            if (values[5 /* itemRendererChanged */] || this.$dataProviderChanged || values[1 /* useVirtualLayoutChanged */]) {
                this.removeAllRenderers();
                if (this.$layout)
                    this.$layout.clearVirtualLayoutCache();
                this.setTypicalLayoutRect(null);
                values[1 /* useVirtualLayoutChanged */] = false;
                values[5 /* itemRendererChanged */] = false;
                if (this.$dataProvider)
                    this.$dataProvider.addEventListener(eui.CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this);
                if (this.$layout && this.$layout.$useVirtualLayout) {
                    this.invalidateSize();
                    this.invalidateDisplayList();
                }
                else {
                    this.createRenderers();
                }
                if (this.$dataProviderChanged) {
                    this.$dataProviderChanged = false;
                    this.scrollV = this.scrollH = 0;
                }
            }
            _super.prototype.commitProperties.call(this);
            if (values[8 /* typicalItemChanged */]) {
                values[8 /* typicalItemChanged */] = false;
                if (this.$dataProvider && this.$dataProvider.length > 0) {
                    values[12 /* typicalItem */] = this.$dataProvider.getItemAt(0);
                    this.measureRendererSize();
                }
            }
            if (values[14 /* itemRendererSkinNameChange */]) {
                values[14 /* itemRendererSkinNameChange */] = false;
                var skinName = values[13 /* itemRendererSkinName */];
                var indexToRenderer = this.$indexToRenderer;
                var keys = Object.keys(indexToRenderer);
                var length_11 = keys.length;
                for (var i = 0; i < length_11; i++) {
                    var index = keys[i];
                    this.setItemRenderSkinName(indexToRenderer[index], skinName);
                }
                var freeRenderers = values[3 /* freeRenderers */];
                keys = Object.keys(freeRenderers);
                length_11 = keys.length;
                for (var i = 0; i < length_11; i++) {
                    var hashCode = keys[i];
                    var list = freeRenderers[hashCode];
                    var length_12 = list.length;
                    for (var i_1 = 0; i_1 < length_12; i_1++) {
                        this.setItemRenderSkinName(list[i_1], skinName);
                    }
                }
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        DataGroup.prototype.measure = function () {
            if (this.$layout && this.$layout.$useVirtualLayout) {
                this.ensureTypicalLayoutElement();
            }
            _super.prototype.measure.call(this);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        DataGroup.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            var useVirtualLayout = (this.$layout && this.$layout.$useVirtualLayout);
            if (useVirtualLayout) {
                this.ensureTypicalLayoutElement();
            }
            _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
            var values = this.$DataGroup;
            if (useVirtualLayout) {
                //检查索引 0 处的项测量大小是否发生改变，若改变就重新计算 typicalLayoutRect
                var rect = values[9 /* typicalLayoutRect */];
                if (rect) {
                    var renderer = this.$indexToRenderer[0];
                    if (renderer) {
                        var bounds = egret.$TempRectangle;
                        renderer.getPreferredBounds(bounds);
                        if (bounds.width != rect.width || bounds.height != rect.height) {
                            values[9 /* typicalLayoutRect */] = null;
                        }
                    }
                }
            }
        };
        /**
         * @private
         * 确保测量过默认条目大小。
         */
        DataGroup.prototype.ensureTypicalLayoutElement = function () {
            if (this.$DataGroup[9 /* typicalLayoutRect */])
                return;
            if (this.$dataProvider && this.$dataProvider.length > 0) {
                this.$DataGroup[12 /* typicalItem */] = this.$dataProvider.getItemAt(0);
                this.measureRendererSize();
            }
        };
        /**
         * @private
         * 测量项呈示器默认尺寸
         */
        DataGroup.prototype.measureRendererSize = function () {
            var values = this.$DataGroup;
            if (values[12 /* typicalItem */] == undefined) {
                this.setTypicalLayoutRect(null);
                return;
            }
            var typicalRenderer = this.createVirtualRenderer(values[12 /* typicalItem */]);
            if (!typicalRenderer) {
                this.setTypicalLayoutRect(null);
                return;
            }
            this.updateRenderer(typicalRenderer, 0, values[12 /* typicalItem */]);
            typicalRenderer.validateNow();
            var bounds = egret.$TempRectangle;
            typicalRenderer.getPreferredBounds(bounds);
            var rect = new egret.Rectangle(0, 0, bounds.width, bounds.height);
            if (this.$layout && this.$layout.$useVirtualLayout) {
                if (values[4 /* createNewRendererFlag */]) {
                    this.rendererAdded(typicalRenderer, 0, values[12 /* typicalItem */]);
                }
                this.doFreeRenderer(typicalRenderer);
            }
            else {
                this.removeChild(typicalRenderer);
            }
            this.setTypicalLayoutRect(rect);
            values[4 /* createNewRendererFlag */] = false;
        };
        /**
         * @private
         * 设置项目默认大小
         */
        DataGroup.prototype.setTypicalLayoutRect = function (rect) {
            this.$DataGroup[9 /* typicalLayoutRect */] = rect;
            if (this.$layout) {
                if (rect) {
                    this.$layout.setTypicalSize(rect.width, rect.height);
                }
                else {
                    this.$layout.setTypicalSize(0, 0);
                }
            }
        };
        /**
         * @private
         * 移除所有项呈示器
         */
        DataGroup.prototype.removeAllRenderers = function () {
            var indexToRenderer = this.$indexToRenderer;
            var keys = Object.keys(indexToRenderer);
            var length = keys.length;
            for (var i = 0; i < length; i++) {
                var index = keys[i];
                var renderer = indexToRenderer[index];
                if (renderer) {
                    this.rendererRemoved(renderer, renderer.itemIndex, renderer.data);
                    this.removeChild(renderer);
                }
            }
            this.$indexToRenderer = [];
            var values = this.$DataGroup;
            if (values[10 /* cleanFreeRenderer */]) {
                var freeRenderers = values[3 /* freeRenderers */];
                var keys_1 = Object.keys(freeRenderers);
                var length_13 = keys_1.length;
                for (var i = 0; i < length_13; i++) {
                    var hashCode = keys_1[i];
                    var list = freeRenderers[hashCode];
                    var length_14 = list.length;
                    for (var i_2 = 0; i_2 < length_14; i_2++) {
                        var renderer = list[i_2];
                        this.rendererRemoved(renderer, renderer.itemIndex, renderer.data);
                        this.removeChild(renderer);
                    }
                }
                values[3 /* freeRenderers */] = {};
                values[2 /* rendererToClassMap */] = {};
                values[10 /* cleanFreeRenderer */] = false;
            }
        };
        /**
         * @private
         * 为数据项创建项呈示器
         */
        DataGroup.prototype.createRenderers = function () {
            if (!this.$dataProvider)
                return;
            var index = 0;
            var length = this.$dataProvider.length;
            for (var i = 0; i < length; i++) {
                var item = this.$dataProvider.getItemAt(i);
                var rendererClass = this.itemToRendererClass(item);
                var renderer = this.createOneRenderer(rendererClass);
                if (!renderer)
                    continue;
                this.$indexToRenderer[index] = renderer;
                this.updateRenderer(renderer, index, item);
                this.rendererAdded(renderer, index, item);
                index++;
            }
        };
        /**
         * Updates the renderer for reuse.
         * This method first prepares the item
         * renderer for reuse by cleaning out any stale properties
         * as well as updating it with new properties.<p/>
         *
         * The last thing this method should do is set the <code>data</code> property
         * of the item renderer.
         *
         * @param renderer The item renderer.
         * @param itemIndex The index of the data in the data provider.
         * @param data The data object this item renderer is representing.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 此方法首先会准备项呈示器以重用，方法是清除任何旧属性，同时使用新属性进行更新。<p/>
         *
         * 最后，此方法应对项呈示器设置 data 属性。
         *
         * @param renderer 项呈示器。
         * @param itemIndex 数据提供程序中的数据索引。
         * @param data 此项呈示器正在表示的数据对象。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        DataGroup.prototype.updateRenderer = function (renderer, itemIndex, data) {
            var values = this.$DataGroup;
            values[11 /* renderersBeingUpdated */] = true;
            renderer.itemIndex = itemIndex;
            if (renderer.parent == this) {
                this.setChildIndex(renderer, itemIndex);
            }
            renderer.data = data;
            values[11 /* renderersBeingUpdated */] = false;
            return renderer;
        };
        Object.defineProperty(DataGroup.prototype, "numElements", {
            /**
             * @inheritDoc
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (!this.$dataProvider)
                    return 0;
                return this.$dataProvider.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Adds the itemRenderer for the specified dataProvider item to this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param renderer The renderer that was added.
         * @param index The index where the dataProvider item was added.
         * @param item The item that was added, the value of dataProvider[index].
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 项呈示器被添加.
         *
         * 这个方法不能直接调用，它是由该类自身自动调用的。
         *
         * @param renderer 添加的项呈示器
         * @param index 项呈示器的索引
         * @param item 项呈示器对应的数据
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        DataGroup.prototype.rendererAdded = function (renderer, index, item) {
        };
        /**
         * Removes the itemRenderer for the specified dataProvider item from this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param renderer The renderer that is being removed.
         * @param index The index of the item that is being removed.
         * @param item The item that is being removed.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 项呈示器被移除。
         * 这个方法不能直接调用，它是由该类自身自动调用的。
         *
         * @param renderer 移除的项呈示器
         * @param index 项呈示器的索引
         * @param item 项呈示器对应的数据
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        DataGroup.prototype.rendererRemoved = function (renderer, index, item) {
        };
        return DataGroup;
    }(eui.Group));
    eui.DataGroup = DataGroup;
    __reflect(DataGroup.prototype, "eui.DataGroup");
    eui.registerProperty(DataGroup, "itemRenderer", "Class");
    eui.registerProperty(DataGroup, "itemRendererSkinName", "Class");
    eui.registerProperty(DataGroup, "dataProvider", "eui.ICollection", true);
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The Button component is a commonly used rectangular button.
     * The Button component looks like it can be pressed.
     * The default skin has a text label and a icon display object.
     *
     * @event egret.TouchEvent.TOUCH_CANCEL canceled the touch
     *
     * @state up Button up state
     * @state down Button down state
     * @state disabled Button disabled state
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/ButtonExample.ts
     * @language en_US
     */
    /**
     * Button 组件是常用的矩形按钮。Button 组件看起来可以按压。默认外观具有一个文本标签和图标显示对象。
     *
     * @event egret.TouchEvent.TOUCH_CANCEL 取消触摸事件
     *
     * @state up 按钮弹起状态
     * @state down 按钮按下状态
     * @state disabled 按钮禁用状态
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/ButtonExample.ts
     * @language zh_CN
     */
    var Button = (function (_super) {
        __extends(Button, _super);
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个按钮实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Button() {
            var _this = _super.call(this) || this;
            /**
             * [SkinPart] A skin part that defines the label of the button.
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * [SkinPart] 按钮上的文本标签。
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.labelDisplay = null;
            /**
             * @private
             */
            _this._label = "";
            /**
             * [SkinPart] A skin part that defines an optional icon for the button.
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * [SkinPart] 按钮上的图标显示对象。
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.iconDisplay = null;
            /**
             * @private
             */
            _this._icon = null;
            /**
             * @private
             * 指示第一次分派 TouchEvent.TOUCH_BEGIN 时，触摸点是否在按钮上。
             */
            _this.touchCaptured = false;
            _this.touchChildren = false;
            _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchBegin, _this);
            return _this;
        }
        Object.defineProperty(Button.prototype, "label", {
            /**
             * Text to appear on the Button control.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要在按钮上显示的文本。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._label;
            },
            set: function (value) {
                this._label = value;
                if (this.labelDisplay) {
                    this.labelDisplay.text = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "icon", {
            /**
             * Icon to appear on the Button control.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要在按钮上显示的图标数据
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._icon;
            },
            set: function (value) {
                this._icon = value;
                if (this.iconDisplay) {
                    this.iconDisplay.source = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * This method handles the touchCancle events
         * @param  The <code>egret.TouchEvent</code> object.
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 解除触碰事件处理。
         * @param event 事件 <code>egret.TouchEvent</code> 的对象。
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Button.prototype.onTouchCancle = function (event) {
            var stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = false;
            this.invalidateState();
        };
        /**
         * This method handles the touch events
         * @param  The <code>egret.TouchEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 触碰事件处理。
         * @param event 事件 <code>egret.TouchEvent</code> 的对象。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Button.prototype.onTouchBegin = function (event) {
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = true;
            this.invalidateState();
            event.updateAfterEvent();
        };
        /**
         * @private
         * 舞台上触摸弹起事件
         */
        Button.prototype.onStageTouchEnd = function (event) {
            var stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            if (this.contains(event.target)) {
                this.buttonReleased();
            }
            this.touchCaptured = false;
            this.invalidateState();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Button.prototype.getCurrentState = function () {
            if (!this.enabled)
                return "disabled";
            if (this.touchCaptured)
                return "down";
            return "up";
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Button.prototype.partAdded = function (partName, instance) {
            if (instance === this.labelDisplay) {
                this.labelDisplay.text = this._label;
            }
            else if (instance == this.iconDisplay) {
                this.iconDisplay.source = this._icon;
            }
        };
        /**
         * This method is called when handling a <code>egret.TouchEvent.TOUCH_END</code> event
         * when the user touches on the button. It is only called when the button
         * is the target and when <code>touchCaptured</code> is <code>true</code>.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当在用户单击按钮之后处理 <code>egret.TouchEvent.TOUCH_END</code> 事件时，将调用此方法。
         * 仅当以按钮为目标，并且 <code>touchCaptured</code> 为 <code>true</code> 时，才会调用此方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Button.prototype.buttonReleased = function () {
        };
        return Button;
    }(eui.Component));
    eui.Button = Button;
    __reflect(Button.prototype, "eui.Button");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The Range class holds a value and an allowed range for that
     * value, defined by <code>minimum</code> and <code>maximum</code> properties.
     *
     * The <code>value</code> property
     * is always constrained to be between the current <code>minimum</code> and
     * <code>maximum</code>, and the <code>minimum</code>,
     * and <code>maximum</code> are always constrained
     * to be in the proper numerical order, such that
     * <code>(minimum <= value <= maximum)</code> is <code>true</code>.
     *
     * If the value of the <code>snapInterval</code> property is not 0,
     * then the <code>value</code> property is also constrained to be a multiple of
     * <code>snapInterval</code>.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/supportClasses/RangeExample.ts
     * @language en_US
     */
    /**
     * 范围选取组件,该组件包含一个值和这个值所允许的最大最小约束范围。
     *
     * <code>value</code>属性的值永远被限制于当前的<code>minimum</code>和
     * <code>maximum</code>之间，并且<code>minimum</code>和 <code>maximum</code>永远按照固定的顺序排列，
     * 即<code>(minimum <= value <= maximum)</code> 为真。
     *
     * 如果<code>snapInterval</code>属性的值不是0，那么<code>value</code>的值也会被<code>snapInterval</code>所约束。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/supportClasses/RangeExample.ts
     * @language zh_CN
     */
    var Range = (function (_super) {
        __extends(Range, _super);
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 Range 实例。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Range() {
            var _this = _super.call(this) || this;
            _this.$Range = {
                0: 100,
                1: false,
                2: 0,
                3: false,
                4: 0,
                5: 0,
                6: false,
                7: 1,
                8: false,
                9: false,
            };
            return _this;
        }
        Object.defineProperty(Range.prototype, "maximum", {
            /**
             * The maximum valid <code>value</code>.<p/>
             *
             * Changes to the value property are constrained
             * by <code>commitProperties()</code> to be less than or equal to
             * maximum with the <code>nearestValidValue()</code> method.
             *
             * @default 100
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 最大有效值。<p/>
             *
             * 规定<code>value</code>属性的值不能够超过的最大值。该修正过程
             * 将在<code>nearestValidValue()</code>方法中进行。
             *
             * @default 100
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Range[0 /* maximum */];
            },
            set: function (value) {
                value = +value || 0;
                var values = this.$Range;
                if (value === values[0 /* maximum */])
                    return;
                values[0 /* maximum */] = value;
                values[1 /* maxChanged */] = true;
                this.invalidateProperties();
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Range.prototype, "minimum", {
            /**
             * The minimum valid <code>value</code>.<p/>
             *
             * Changes to the value property are constrained
             * by <code>commitProperties()</code> to be greater than or equal to
             * minimum with the <code>nearestValidValue()</code> method.
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 最小有效值<p/>
             *
             * 规定<code>value</code>属性的值不能够低于的最小值。该修正过程
             * 将在<code>nearestValidValue()</code>方法中进行。
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Range[2 /* minimum */];
            },
            set: function (value) {
                value = +value || 0;
                var values = this.$Range;
                if (value === values[2 /* minimum */])
                    return;
                values[2 /* minimum */] = value;
                values[3 /* minChanged */] = true;
                this.invalidateProperties();
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Range.prototype, "value", {
            /**
             * The current value for this range.<p/>
             *
             * Changes to the value property are constrained
             * by <code>commitProperties()</code> to be greater than or equal to
             * the <code>minimum</code> property, less than or equal to the <code>maximum</code> property, and a
             * multiple of <code>snapInterval</code> with the <code>nearestValidValue()</code>
             * method.
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 此范围的当前值。<p/>
             *
             * 改变的<code>value</code>属性将在<code>commitProperties()</code>方法中被<code>minimum</code>属性
             * 和<code>minimum</code>属性所限制。此修正过程将在<code>nearestValidValue()</code>方法中进行。
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                var values = this.$Range;
                return values[6 /* valueChanged */] ?
                    values[5 /* changedValue */] : values[4 /* value */];
            },
            set: function (newValue) {
                newValue = +newValue || 0;
                this.$setValue(newValue);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param newValue
         */
        Range.prototype.$setValue = function (newValue) {
            if (newValue === this.value)
                return false;
            var values = this.$Range;
            values[5 /* changedValue */] = newValue;
            values[6 /* valueChanged */] = true;
            this.invalidateProperties();
            return true;
        };
        Object.defineProperty(Range.prototype, "snapInterval", {
            /**
             * The snapInterval property controls the valid values of the <code>value</code> property.
             *
             * If nonzero, valid values are the sum of the <code>minimum</code> and integer multiples
             * of this property, for all sums that are less than or equal to the <code>maximum</code>.<p/>
             *
             * For example, if <code>minimum</code> is 10, <code>maximum</code> is 20, and this property is 3, then the
             * valid values of this Range are 10, 13, 16, 19, and 20.<p/>
             *
             * If the value of this property is zero, then valid values are only constrained
             * to be between minimum and maximum inclusive.
             *
             * @default 1
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * snapInterval 属性定义 value 属性的有效值。
             * 如果为非零，则有效值为 minimum 与此属性的整数倍数之和，且小于或等于 maximum。</p>
             *
             * 例如，如果 minimum 为 10，maximum 为 20，而此属性为 3，则可能的有效值为 10、13、16、19 和 20.</p>
             *
             * 如果此属性的值为零，则仅会将有效值约束到介于 minimum 和 maximum 之间（包括两者）。
             *
             * @default 1
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Range[7 /* snapInterval */];
            },
            set: function (value) {
                var values = this.$Range;
                values[9 /* explicitSnapInterval */] = true;
                value = +value || 0;
                if (value === values[7 /* snapInterval */])
                    return;
                if (isNaN(value)) {
                    values[7 /* snapInterval */] = 1;
                    values[9 /* explicitSnapInterval */] = false;
                }
                else {
                    values[7 /* snapInterval */] = value;
                }
                values[8 /* snapIntervalChanged */] = true;
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Processes the properties set on the component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 处理对组件设置的属性
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Range.prototype.commitProperties = function () {
            _super.prototype.commitProperties.call(this);
            var values = this.$Range;
            if (values[2 /* minimum */] > values[0 /* maximum */]) {
                if (!values[1 /* maxChanged */])
                    values[2 /* minimum */] = values[0 /* maximum */];
                else
                    values[0 /* maximum */] = values[2 /* minimum */];
            }
            if (values[6 /* valueChanged */] || values[1 /* maxChanged */] ||
                values[3 /* minChanged */] || values[8 /* snapIntervalChanged */]) {
                var currentValue = values[6 /* valueChanged */] ?
                    values[5 /* changedValue */] : values[4 /* value */];
                values[6 /* valueChanged */] = false;
                values[1 /* maxChanged */] = false;
                values[3 /* minChanged */] = false;
                values[8 /* snapIntervalChanged */] = false;
                this.setValue(this.nearestValidValue(currentValue, values[7 /* snapInterval */]));
            }
        };
        /**
         * @private
         * 修正size到最接近snapInterval的整数倍
         */
        Range.prototype.nearestValidSize = function (size) {
            var interval = this.snapInterval;
            if (interval == 0)
                return size;
            var validSize = Math.round(size / interval) * interval;
            return (Math.abs(validSize) < interval) ? interval : validSize;
        };
        /**
         * Returns the sum of the minimum with an integer multiple of <code>interval</code> that's
         * closest to <code>value</code>, unless <code>value</code> is closer to the maximum limit,
         * in which case the maximum is returned.<p/>
         *
         * If <code>interval</code> is equal to 0, the value is clipped to the minimum and maximum
         * limits.<p/>
         *
         * The valid values for a range are defined by the sum of the <code>minimum</code> property
         * with multiples of the <code>interval</code> and also defined to be less than or equal to the
         * <code>maximum</code> property.
         * The maximum need not be a multiple of <code>snapInterval</code>.<p/>
         *
         * For example, if <code>minimum</code> is equal to 1, <code>maximum</code> is equal to 6,
         * and <code>snapInterval</code> is equal to 2, the valid
         * values for the Range are 1, 3, 5, 6.
         *
         * Similarly, if <code>minimum</code> is equal to 2, <code>maximum</code> is equal to 9,
         * and <code>snapInterval</code> is equal to 1.5, the valid
         * values for the Range are 2, 3.5, 5, 6.5, 8, and 9.
         *
         * @param value The input value.
         * @param interval The value of snapInterval or an integer multiple of snapInterval.
         * @return The valid value that's closest to the input.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回 <code>minimum</code> 与最接近 <code>value</code> 的 <code>interval</code> 的整数倍数之和，
         * 除非 <code>value</code> 接近最大值限制的时候会返回 maximum。<p/>
         *
         * 如果 <code>interval</code> 等于 0，则会将该值剪裁到限制的最小值和最大值。<p/>
         *
         * 范围的有效值由 <code>minimum</code> 属性与 <code>interval</code> 的倍数之和决定，
         * 与此同时也要小于等于 <code>maximum</code> 属性。
         * 最大值不能是 <code>snapInterval</code> 属性的倍数。<p/>
         *
         * 例如，如果 <code>minimum</code> 等于 1，<code>maximum</code> 等于 6，且 <code>snapInterval</code> 等于 3，
         * 则 Range 的有效值有 1、2、5、6。
         *
         * 类似地，如果 <code>minimum</code> 等于 2，<code>maximum</code> 等于 9，
         * 且 <code>snapInterval</code> 等于 1.5，则 Range 的有效值有 2、3.5、5、6.5、8 和 9。
         *
         *
         * @param value 输入值。
         * @param interval snapInterval 的值，或 snapInterval 的整数倍数。
         * @return 最近接输入值的有效值。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Range.prototype.nearestValidValue = function (value, interval) {
            var values = this.$Range;
            if (interval == 0)
                return Math.max(values[2 /* minimum */], Math.min(values[0 /* maximum */], value));
            var maxValue = values[0 /* maximum */] - values[2 /* minimum */];
            var scale = 1;
            value -= values[2 /* minimum */];
            if (interval != Math.round(interval)) {
                var parts = ((1 + interval).toString()).split(".");
                scale = Math.pow(10, parts[1].length);
                maxValue *= scale;
                value = Math.round(value * scale);
                interval = Math.round(interval * scale);
            }
            var lower = Math.max(0, Math.floor(value / interval) * interval);
            var upper = Math.min(maxValue, Math.floor((value + interval) / interval) * interval);
            var validValue = ((value - lower) >= ((upper - lower) / 2)) ? upper : lower;
            return (validValue / scale) + values[2 /* minimum */];
        };
        /**
         * Sets the current value for the <code>value</code> property.<p/>
         *
         * This method assumes that the caller has already used the <code>nearestValidValue()</code> method
         * to constrain the value parameter
         *
         * @param value The new value of the <code>value</code> property.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置当前值。<p/>
         *
         * 此方法假定调用者已经使用了 nearestValidValue() 方法来约束 value 参数。
         *
         * @param value value属性的新值
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Range.prototype.setValue = function (value) {
            var values = this.$Range;
            if (values[4 /* value */] === value)
                return;
            if (values[0 /* maximum */] > values[2 /* minimum */])
                values[4 /* value */] = Math.min(values[0 /* maximum */], Math.max(values[2 /* minimum */], value));
            else
                values[4 /* value */] = value;
            values[6 /* valueChanged */] = false;
            this.invalidateDisplayList();
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "value");
        };
        /**
         * Draws the object and/or sizes and positions its children.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Range.prototype.updateDisplayList = function (w, h) {
            _super.prototype.updateDisplayList.call(this, w, h);
            this.updateSkinDisplayList();
        };
        /**
         * Update size and visible of skin parts.<p/>
         * Subclasses override this method to update skin parts display based on <code>minimum</code>, <code>maximum</code>
         * and <code>value</code> properties.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 更新皮肤部件（通常为滑块）的大小和可见性。<p/>
         * 子类覆盖此方法以基于 minimum、maximum 和 value 属性更新滑块的大小、位置和可见性。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Range.prototype.updateSkinDisplayList = function () {
        };
        return Range;
    }(eui.Component));
    eui.Range = Range;
    __reflect(Range.prototype, "eui.Range");
    eui.registerBindable(Range.prototype, "value");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The LayoutBase class defines the base class for all Spark layouts.
     * To create a custom layout that works with the Spark containers,
     * you must extend <code>LayoutBase</code> or one of its subclasses.
     *
     * <p>Subclasses must implement the <code>updateDisplayList()</code>
     * method, which positions and sizes the <code>target</code> GroupBase's elements, and
     * the <code>measure()</code> method, which calculates the default
     * size of the <code>target</code>.</p>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 容器布局基类。若要创建使用 Group 容器的自定义布局，必须扩展 <code>LayoutBase</code> 或其子类之一。
     *
     * <p>子类必须实现 <code>updateDisplayList()</code> 方法
     * （定位 <code>target</code> Group 的子项并调整这些子项的大小）和 <code>measure()</code> 方法
     * （计算 <code>target</code> 的默认大小）。</p>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var LayoutBase = (function (_super) {
        __extends(LayoutBase, _super);
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function LayoutBase() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.$target = null;
            /**
             * @private
             */
            _this.$useVirtualLayout = false;
            /**
             * @private
             */
            _this.$typicalWidth = 71;
            /**
             * @private
             */
            _this.$typicalHeight = 22;
            return _this;
        }
        Object.defineProperty(LayoutBase.prototype, "target", {
            /**
             * The Group container whose elements are measured, sized and positioned
             * by this layout.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 此布局将测量其元素、调整其元素的大小并定位其元素的 Group 容器。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$target;
            },
            set: function (value) {
                if (this.$target === value)
                    return;
                this.$target = value;
                this.clearVirtualLayoutCache();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutBase.prototype, "useVirtualLayout", {
            /**
             * To configure a container to use virtual layout, set the <code>useVirtualLayout</code> property
             * to <code>true</code> for the layout associated with the container.
             * Only DataGroup with layout set to VerticalLayout,
             * HorizontalLayout, or TileLayout supports virtual layout.
             * Layout subclasses that do not support virtualization must prevent changing
             * this property.
             *
             * @default false
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 若要配置容器使用虚拟布局，请为与容器关联的布局的 <code>useVirtualLayout</code> 属性设置为 <code>true</code>。
             * 只有布局设置为 VerticalLayout、HorizontalLayout 或 TileLayout 的 DataGroup 才支持虚拟布局。
             * 不支持虚拟化的布局子类必须禁止更改此属性。
             *
             * @default false
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$useVirtualLayout;
            },
            set: function (value) {
                value = !!value;
                if (this.$useVirtualLayout == value)
                    return;
                this.$useVirtualLayout = value;
                this.dispatchEventWith("useVirtualLayoutChanged");
                if (this.$useVirtualLayout && !value)
                    this.clearVirtualLayoutCache();
                if (this.target)
                    this.target.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Set this size of a typical element
         *
         * @param width the height of element
         * @param height the width of element
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置一个典型元素的大小
         *
         * @param width 元素的宽
         * @param height 元素的高
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LayoutBase.prototype.setTypicalSize = function (width, height) {
            width = +width || 71;
            height = +height || 22;
            if (width !== this.$typicalWidth || height !== this.$typicalHeight) {
                this.$typicalWidth = width;
                this.$typicalHeight = height;
                if (this.$target) {
                    this.$target.invalidateSize();
                }
            }
        };
        /**
         * Called when the <code>verticalScrollPosition</code> or
         * <code>horizontalScrollPosition</code> properties change.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * <code>verticalScrollPosition</code> 或 <code>horizontalScrollPosition</code>
         * 属性更改时调用。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LayoutBase.prototype.scrollPositionChanged = function () {
        };
        /**
         * When <code>useVirtualLayout</code> is <code>true</code>,
         * this method can be used by the layout target
         * to clear cached layout information when the target changes.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 如果 <code>useVirtualLayout</code> 为 <code>true</code>，
         * 则当布局目标改变时，布局目标可以使用此方法来清除已缓存布局信息。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LayoutBase.prototype.clearVirtualLayoutCache = function () {
        };
        /**
         * Called by the target after a layout element
         * has been added and before the target's size and display list are
         * validated.
         * Layouts that cache per element state, like virtual layouts, can
         * override this method to update their cache.
         *
         * @param index The index of the element that was added.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在已添加布局元素之后且在验证目标的大小和显示列表之前，由目标调用。
         * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。
         *
         * @param index 发生改变的子项索引
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LayoutBase.prototype.elementAdded = function (index) {
        };
        /**
         * This method must is called by the target after a layout element
         * has been removed and before the target's size and display list are
         * validated.
         * Layouts that cache per element state, like virtual layouts, can
         * override this method to update their cache.
         *
         * @param index The index of the element that was added.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         *
         * 必须在已删除布局元素之后且在验证目标的大小和显示列表之前，由目标调用此方法。
         * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。
         *
         * @param index 发生改变的子项索引
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LayoutBase.prototype.elementRemoved = function (index) {
        };
        /**
         * Return the indices of the element visible within this Group.
         *
         * @return The indices of the visible element.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回此 Group 中可见的元素的索引。
         *
         * @return 可见的元素的索引。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LayoutBase.prototype.getElementIndicesInView = function () {
            return null;
        };
        /**
         * Measures the target's default size based on its content.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 基于目标的内容测量其默认大小
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LayoutBase.prototype.measure = function () {
        };
        /**
         * Sizes and positions the target's elements.
         *
         * @param unscaledWidth Specifies the width of the target, in pixels,
         * in the targets's coordinates.
         *
         * @param unscaledHeight Specifies the height of the component, in pixels,
         * in the target's coordinates.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 调整目标的元素的大小并定位这些元素。
         *
         * @param unscaledWidth 指定目标在目标坐标中的宽度（以像素为单位）。
         * @param unscaledHeight 指定组件在目标坐标中的高度（以像素为单位）。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LayoutBase.prototype.updateDisplayList = function (width, height) {
        };
        return LayoutBase;
    }(egret.EventDispatcher));
    eui.LayoutBase = LayoutBase;
    __reflect(LayoutBase.prototype, "eui.LayoutBase");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The ListBase class is the base class for list component.
     * It can display items of list as vertical or horizontal such as SELECT of HTML.
     * @event egret.Event.CHANGE Dispatched after the selection has changed.
     * This event is dispatched when the user interacts with the control.
     * @event egret.Event.CHANGING Dispatched when the selection is going to change.
     * Calling the <code>preventDefault()</code> method
     * on the event prevents the selection from changing.<p/>
     * This event is dispatched when the user interacts with the control.
     *
     * @event eui.ItemTapEvent.ITEM_TAP dispatched when the user tap an item in the control.
     * @event egret.TouchEvent.TOUCH_CANCEL canceled the touch
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * ListBase 是列表控件基类。可显示垂直或水平的项目列表。其功能与 HTML 中的 SELECT 表单元素的功能相似。
     * @event egret.Event.CHANGE 选中的索引已经发生改变,注意：此事件仅在索引改变是由用户触摸操作引起时才抛出。
     * @event egret.Event.CHANGING 选中的索引即将发生改变，可以通过调用事件对象的 preventDefault() 方法来阻止改变。<p/>
     * 注意：此事件仅在索引改变是由用户触摸操作引起时才抛出。
     *
     * @event eui.ItemTapEvent.ITEM_TAP 项呈示器单击事件。
     * @event egret.TouchEvent.TOUCH_CANCEL 取消触摸事件
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var ListBase = (function (_super) {
        __extends(ListBase, _super);
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function ListBase() {
            var _this = _super.call(this) || this;
            _this.$ListBase = {
                0: false,
                1: false,
                2: -2,
                3: -1,
                4: false,
                5: undefined,
                6: false,
                7: null,
                8: false //touchCancle
            };
            return _this;
        }
        Object.defineProperty(ListBase.prototype, "requireSelection", {
            /**
             * If <code>true</code>, a data item must always be selected in the control.
             * If the value is <code>true</code>, the <code>selectedIndex</code> property
             * is always set to a value between 0 and (<code>dataProvider.length</code> - 1).
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 如果为 true，则控件中必须含有选中的数据项目。
             * 如果该值为 true，则始终将 selectedIndex 属性设置为 0 和 (dataProvider.length - 1) 之间的一个值。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$ListBase[0 /* requireSelection */];
            },
            set: function (value) {
                value = !!value;
                var values = this.$ListBase;
                if (value === values[0 /* requireSelection */]) {
                    return;
                }
                values[0 /* requireSelection */] = value;
                if (value) {
                    values[1 /* requireSelectionChanged */] = true;
                    this.invalidateProperties();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListBase.prototype, "selectedIndex", {
            /**
             * he 0-based index of the selected item, or -1 if no item is selected.
             * Setting the <code>selectedIndex</code> property deselects the currently selected
             * item and selects the data item at the specified index.<p/>
             *
             * The value is always between -1 and (<code>dataProvider.length</code> - 1).
             * If items at a lower index than <code>selectedIndex</code> are
             * removed from the component, the selected index is adjusted downward
             * accordingly. <p/>
             *
             * If the selected item is removed, the selected index is set to:<p/>
             *
             * <ul>
             *   <li>-1 if <code>requireSelection == false</code> or there are no remaining items.</li>
             *   <li>0 if <code>requireSelection == true</code> and there is at least one item.</li>
             * </ul><p/>
             *
             * When the user changes the <code>selectedIndex</code> property by interacting with the control,
             * the control dispatches the <code>change</code> and <code>changing</code> events.
             * When you change the value of the <code>selectedIndex</code> property programmatically,
             * it does not dispatches the <code>change</code> and <code>changing</code> events.</p>
             *
             * @default -1
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 选中项目的基于 0 的索引。
             * 或者如果未选中项目，则为-1。设置 selectedIndex 属性会取消选择当前选定的项目并选择指定索引位置的数据项目。<p/>
             *
             * 这个值会之中在-1到<code>(dataProvider.length - 1)</code>之间。如果从该组件中删除一个低于
             * <code>selectedIndex</code>的值，则<code>selectedIndex</code>也会相应的调节选定的索引。<p/>
             *
             * 如果删除的项为当前选中项，则该值会变为：<p/>
             *
             * <ul>
             *    <li>-1: 如果 <code>requireSelection == false</code> 或者已经没有剩余项目。</li>
             *    <li> 0: 如果 <code>requireSelection == true</code> 并且当前至少还有一个剩余项目。</li>
             * </ul><p/>
             * 当用户通过与控件交互来更改 selectedIndex 属性时，此控件将分派 change 和 changing 事件。
             * 当以编程方式更改 selectedIndex 属性的值时，此控件不分派 change 和 changing 事件。
             *
             * @default -1
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$getSelectedIndex();
            },
            set: function (value) {
                value = +value | 0;
                this.setSelectedIndex(value, false);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @returns
         */
        ListBase.prototype.$getSelectedIndex = function () {
            var values = this.$ListBase;
            if (values[2 /* proposedSelectedIndex */] != ListBase.NO_PROPOSED_SELECTION)
                return values[2 /* proposedSelectedIndex */];
            return values[3 /* selectedIndex */];
        };
        /**
         * Used internally to specify whether the selectedIndex changed programmatically or due to
         * user interaction.
         * @param value the new index need to select.
         * @param dispatchChangeEvent if true, the component will dispatch a "change" event if the
         * value has changed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 由程序或者用户设置选中项。
         * @param value 索引值。
         * @param dispatchChangeEvent 当索引值发生改变，且该参数为true的时候，组件派发出一个“change”事件。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.setSelectedIndex = function (value, dispatchChangeEvent) {
            if (value == this.selectedIndex) {
                return;
            }
            var values = this.$ListBase;
            if (dispatchChangeEvent)
                values[4 /* dispatchChangeAfterSelection */] =
                    (values[4 /* dispatchChangeAfterSelection */] || dispatchChangeEvent);
            values[2 /* proposedSelectedIndex */] = value;
            this.invalidateProperties();
        };
        Object.defineProperty(ListBase.prototype, "selectedItem", {
            /**
             * The item that is currently selected.
             * Setting this property deselects the currently selected
             * item and selects the newly specified item.<p/>
             *
             * Setting <code>selectedItem</code> to an item that is not
             * in this component results in no selection,
             * and <code>selectedItem</code> being set to <code>undefined</code>.<p/>
             *
             * If the selected item is removed, the selected item is set to:<p/>
             * <ul>
             *   <li><code>undefined</code> if <code>requireSelection == false</code>
             *     or there are no remaining items.</li>
             *   <li>The first item if <code>requireSelection</code> = <code>true</code>
             *     and there is at least one item.</li>
             * </ul><p/>
             *
             * When the user changes the <code>selectedItem</code> property by interacting with the control,
             * the control dispatches the <code>change</code> and <code>changing</code> events.
             * When you change the value of the <code>selectedIndex</code> property programmatically,
             * it does not dispatches the <code>change</code> and <code>changing</code> events.</p>
             *
             * @default undefined
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 当前已选中的项目。设置此属性会取消选中当前选定的项目并选择新指定的项目。<p/>
             *
             * 如果设置的<code>selectedItem</code>不在当前列表里那么<code>selectedItem</code>将被设置
             * 为<code>undefined</code>。<p/>
             *
             * 如果选择项目被移除，那选择项会被设置为：<p/>
             * <ul>
             *   <li><code>undefined</code>: 如果 <code>requireSelection == false</code>
             *     或者已经没有剩余项。</li>
             *   <li>第一项: 当 <code>requireSelection == true</code>
             *     并且列表中还至少存有一项.</li>
             * </ul><p/>
             *
             * 当用户通过与控件交互来更改 selectedItem 属性时，此控件将分派 change 和 changing 事件。
             * 当以编程方式更改 selectedItem 属性的值时，此控件不分派 change 和 changing 事件。<p/>
             *
             * @default undefined
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                var values = this.$ListBase;
                if (values[5 /* pendingSelectedItem */] !== undefined)
                    return values[5 /* pendingSelectedItem */];
                var selectedIndex = this.$getSelectedIndex();
                if (selectedIndex == ListBase.NO_SELECTION || this.$dataProvider == null)
                    return undefined;
                return this.$dataProvider.length > selectedIndex ? this.$dataProvider.getItemAt(selectedIndex) : undefined;
            },
            set: function (value) {
                this.setSelectedItem(value, false);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Used internally to specify whether the selectedItem changed programmatically or due to
         * user interaction.
         * @param value the new item need to select.
         * @param dispatchChangeEvent if true, the component will dispatch a "change" event if the
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 由程序或用户设置选中项数据源。
         * @param value 要选中的项。
         * @param dispatchChangeEvent 当索引值发生改变，且该参数为true的时候，组件派发出一个“change”事件。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.setSelectedItem = function (value, dispatchChangeEvent) {
            if (dispatchChangeEvent === void 0) { dispatchChangeEvent = false; }
            if (this.selectedItem === value)
                return;
            var values = this.$ListBase;
            if (dispatchChangeEvent)
                values[4 /* dispatchChangeAfterSelection */] =
                    (values[4 /* dispatchChangeAfterSelection */] || dispatchChangeEvent);
            values[5 /* pendingSelectedItem */] = value;
            this.invalidateProperties();
        };
        /**
         * Processes the properties set on the component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 处理对组件设置的属性
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.commitProperties = function () {
            var dataProviderChanged = this.$dataProviderChanged;
            _super.prototype.commitProperties.call(this);
            var values = this.$ListBase;
            var selectedIndex = this.$getSelectedIndex();
            var dataProvider = this.$dataProvider;
            if (dataProviderChanged) {
                if (selectedIndex >= 0 && dataProvider && selectedIndex < dataProvider.length)
                    this.itemSelected(selectedIndex, true);
                else if (this.requireSelection)
                    values[2 /* proposedSelectedIndex */] = 0;
                else
                    this.setSelectedIndex(-1, false);
            }
            if (values[1 /* requireSelectionChanged */]) {
                values[1 /* requireSelectionChanged */] = false;
                if (values[0 /* requireSelection */] &&
                    selectedIndex == ListBase.NO_SELECTION &&
                    dataProvider &&
                    dataProvider.length > 0) {
                    values[2 /* proposedSelectedIndex */] = 0;
                }
            }
            if (values[5 /* pendingSelectedItem */] !== undefined) {
                if (dataProvider)
                    values[2 /* proposedSelectedIndex */] =
                        dataProvider.getItemIndex(values[5 /* pendingSelectedItem */]);
                else
                    values[2 /* proposedSelectedIndex */] = ListBase.NO_SELECTION;
                values[5 /* pendingSelectedItem */] = undefined;
            }
            var changedSelection = false;
            if (values[2 /* proposedSelectedIndex */] != ListBase.NO_PROPOSED_SELECTION)
                changedSelection = this.commitSelection();
            if (values[6 /* selectedIndexAdjusted */]) {
                values[6 /* selectedIndexAdjusted */] = false;
                if (!changedSelection) {
                    eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selectedIndex");
                }
            }
        };
        /**
         * Updates an item renderer for use or reuse.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 更新项呈示器，以备使用或重用
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.updateRenderer = function (renderer, itemIndex, data) {
            this.itemSelected(itemIndex, this.$isItemIndexSelected(itemIndex));
            return _super.prototype.updateRenderer.call(this, renderer, itemIndex, data);
        };
        /**
         * Called when an item is selected or deselected.
         * Subclasses must override this method to display the selection.
         * @param index The item index that was selected.
         * @param selected <code>true</code> if the item is selected,
         * and <code>false</code> if it is deselected.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 选中或取消选中项目时调用。子类必须覆盖此方法才可设置选中项。
         * @param index 已选中的项目索引。
         * @param selected <code>true</code>为选中，<code>false</code>取消选中
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.itemSelected = function (index, selected) {
            var renderer = this.$indexToRenderer[index];
            if (renderer) {
                renderer.selected = selected;
            }
        };
        /**
         * @private
         * 返回指定索引是否等于当前选中索引
         */
        ListBase.prototype.$isItemIndexSelected = function (index) {
            return index == this.selectedIndex;
        };
        /**
         * The selection validation and commitment workhorse method.
         * Called to commit the pending selected index. This method dispatches
         * the "changing" event, and if the event is not cancelled,
         * commits the selection change and then dispatches the "change"
         * event.
         * @param dispatchChangedEvents if dispatch a "changed" event.
         * @return true if the selection was committed, or false if the selection
         * was cancelled.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 提交选中项属性。该方法会派发一个“changing”事件，如果该事件没有被阻止，
         * 该方法将会提交选择项病根据参数派发“change”事件。
         * @param dispatchChangedEvents 是否派发一个“changed”事件。
         * @return true 表示提交成功, false表示被取消
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.commitSelection = function (dispatchChangedEvents) {
            if (dispatchChangedEvents === void 0) { dispatchChangedEvents = true; }
            var dataProvider = this.$dataProvider;
            var values = this.$ListBase;
            var maxIndex = dataProvider ? dataProvider.length - 1 : -1;
            var oldSelectedIndex = values[3 /* selectedIndex */];
            var tmpProposedIndex = values[2 /* proposedSelectedIndex */];
            if (tmpProposedIndex < ListBase.NO_SELECTION)
                tmpProposedIndex = ListBase.NO_SELECTION;
            if (tmpProposedIndex > maxIndex)
                tmpProposedIndex = maxIndex;
            if (values[0 /* requireSelection */] && tmpProposedIndex == ListBase.NO_SELECTION &&
                dataProvider && dataProvider.length > 0) {
                values[2 /* proposedSelectedIndex */] = ListBase.NO_PROPOSED_SELECTION;
                values[4 /* dispatchChangeAfterSelection */] = false;
                return false;
            }
            if (values[4 /* dispatchChangeAfterSelection */]) {
                var result = this.dispatchEventWith(egret.Event.CHANGING, false, true, true);
                if (!result) {
                    this.itemSelected(values[2 /* proposedSelectedIndex */], false);
                    values[2 /* proposedSelectedIndex */] = ListBase.NO_PROPOSED_SELECTION;
                    values[4 /* dispatchChangeAfterSelection */] = false;
                    return false;
                }
            }
            values[3 /* selectedIndex */] = tmpProposedIndex;
            values[2 /* proposedSelectedIndex */] = ListBase.NO_PROPOSED_SELECTION;
            if (oldSelectedIndex != ListBase.NO_SELECTION)
                this.itemSelected(oldSelectedIndex, false);
            if (values[3 /* selectedIndex */] != ListBase.NO_SELECTION)
                this.itemSelected(values[3 /* selectedIndex */], true);
            //子类若需要自身抛出Change事件，而不是在此处抛出，可以设置dispatchChangedEvents为false
            if (dispatchChangedEvents) {
                if (values[4 /* dispatchChangeAfterSelection */]) {
                    this.dispatchEventWith(egret.Event.CHANGE);
                    values[4 /* dispatchChangeAfterSelection */] = false;
                }
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selectedIndex");
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selectedItem");
            }
            return true;
        };
        /**
         * Adjusts the selected index to account for items being added to or
         * removed from this component.
         * It does not dispatch a <code>change</code> event because the change did not
         * occur as a direct result of user-interaction.  Moreover,
         * it does not dispatch a <code>changing</code> event
         * or allow the cancellation of the selection.
         * It also does not call the <code>itemSelected()</code> method,
         * since the same item is selected;
         * @param newIndex The new index.
         * @param add <code>true</code> if an item was added to the component,
         *  and <code>false</code> if an item was removed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 仅调整选中索引值而不更新选中项,即在提交属性阶段itemSelected方法不会被调用，也不会触发changing和change事件。
         * @param newIndex 新索引。
         * @param add 如果已将项目添加到组件，则为<code>true</code>；如果已删除项目，则为<code>false</code>。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.adjustSelection = function (newIndex, add) {
            if (add === void 0) { add = false; }
            var values = this.$ListBase;
            if (values[2 /* proposedSelectedIndex */] != ListBase.NO_PROPOSED_SELECTION)
                values[2 /* proposedSelectedIndex */] = newIndex;
            else
                values[3 /* selectedIndex */] = newIndex;
            values[6 /* selectedIndexAdjusted */] = true;
            this.invalidateProperties();
        };
        /**
         * Called when an item has been added to this component. Selection
         * and caret related properties are adjusted accordingly.
         * @param item The item being added.
         * @param index The index of the item being added.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 数据项添加
         * @param item 被添加的项。
         * @param index 被添加的项的索引。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.itemAdded = function (item, index) {
            _super.prototype.itemAdded.call(this, item, index);
            var selectedIndex = this.$getSelectedIndex();
            if (selectedIndex == ListBase.NO_SELECTION) {
                if (this.$ListBase[0 /* requireSelection */])
                    this.adjustSelection(index, true);
            }
            else if (index <= selectedIndex) {
                this.adjustSelection(selectedIndex + 1, true);
            }
        };
        /**
         * Called when an item has been removed from this component.
         * Selection and caret related properties are adjusted
         * accordingly.
         * @param item The item being removed.
         * @param index The index of the item being removed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 数据项移除
         * @param item 被移除的项。
         * @param index 被移除的项的索引。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.itemRemoved = function (item, index) {
            _super.prototype.itemRemoved.call(this, item, index);
            if (this.selectedIndex == ListBase.NO_SELECTION)
                return;
            var selectedIndex = this.$getSelectedIndex();
            if (index == selectedIndex) {
                if (this.requireSelection && this.$dataProvider && this.$dataProvider.length > 0) {
                    if (index == 0) {
                        this.$ListBase[2 /* proposedSelectedIndex */] = 0;
                        this.invalidateProperties();
                    }
                    else
                        this.setSelectedIndex(0, false);
                }
                else
                    this.adjustSelection(-1, false);
            }
            else if (index < selectedIndex) {
                this.adjustSelection(selectedIndex - 1, false);
            }
        };
        /**
         * Event Listener of source data changed.
         * @param The <code>egret.gui.CollectionEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 数据源改变事件处理。
         * @param event 事件 <code>egret.gui.CollectionEvent</code> 的对象。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.onCollectionChange = function (event) {
            _super.prototype.onCollectionChange.call(this, event);
            if (event.kind == eui.CollectionEventKind.RESET) {
                if (this.$dataProvider.length == 0) {
                    this.setSelectedIndex(ListBase.NO_SELECTION, false);
                }
            }
            else if (event.kind == eui.CollectionEventKind.REFRESH) {
                this.dataProviderRefreshed();
            }
        };
        /**
         * Default response to dataProvider refresh events: clear the selection and caret.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 数据源刷新时触发。此方法不从组件外部调用，仅用于编写自定义组件时，子类覆盖父类的此方法，以便在数据源发生改变时，自动执行一些额外的根据数据刷新视图的操作。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.dataProviderRefreshed = function () {
            this.setSelectedIndex(ListBase.NO_SELECTION, false);
        };
        /**
         * Called when an item has been added to this component.
         * @param renderer the renderer being added.
         * @param index the index of renderer
         * @param item the data of renderer
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 项呈示器被添加
         * @param renderer 添加的项呈示器
         * @param index 项呈示器的索引
         * @param item 项呈示器对应的数据
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.rendererAdded = function (renderer, index, item) {
            renderer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRendererTouchBegin, this);
            renderer.addEventListener(egret.TouchEvent.TOUCH_END, this.onRendererTouchEnd, this);
            renderer.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onRendererTouchCancle, this);
        };
        /**
         * Called when an item has been removed to this component.
         * @param renderer the renderer being removed.
         * @param index the index of renderer.
         * @param item the data of renderer.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 项呈示器被移除
         * @param renderer 移除的项呈示器
         * @param index 项呈示器的索引
         * @param item 项呈示器对应的数据
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.rendererRemoved = function (renderer, index, item) {
            renderer.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRendererTouchBegin, this);
            renderer.removeEventListener(egret.TouchEvent.TOUCH_END, this.onRendererTouchEnd, this);
            renderer.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onRendererTouchCancle, this);
        };
        /**
         * Handles <code>egret.TouchEvent.TOUCH_BEGIN</code> events from any of the
         * item renderers. This method handles <code>egret.TouchEvent.TOUCH_END</code>.
         * @param event The <code>egret.TouchEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 侦听项呈示器<code>egret.TouchEvent.TOUCH_BEGIN</code>事件的方法。同时会添加对舞台<code>egret.TouchEvent.TOUCH_END</code>
         * 事件的侦听。
         * @param event 事件<code>egret.TouchEvent</code>的对象。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.onRendererTouchBegin = function (event) {
            var values = this.$ListBase;
            if (event.$isDefaultPrevented)
                return;
            values[8 /* touchCancle */] = false;
            values[7 /* touchDownItemRenderer */] = (event.$currentTarget);
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
        };
        /**
         * Handles <code>egret.TouchEvent.TOUCH_CANCEL</code> events from any of the
         * item renderers. This method will cancel the handles <code>egret.TouchEvent.TOUCH_END</code> and <code>egret.TouchEvent.TOUCH_TAP</code>.
         * @param event The <code>egret.TouchEvent</code> object.
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 侦听项呈示器<code>egret.TouchEvent.TOUCH_CANCEL</code>事件的方法。触发时会取消对舞台<code>egret.TouchEvent.TOUCH_END</code>
         * 和<code>egret.TouchEvent.TOUCH_TAP</code>事件的侦听。
         * @param event 事件<code>egret.TouchEvent</code>的对象。
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.onRendererTouchCancle = function (event) {
            var values = this.$ListBase;
            values[7 /* touchDownItemRenderer */] = null;
            values[8 /* touchCancle */] = true;
            if (this.$stage) {
                this.$stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
            }
        };
        /**
         * Handles <code>egret.TouchEvent.TOUCH_END</code> events and dispatch <code>ItemTapEvent.ITEM_TAP</code> event.
         * @param event The <code>egret.TouchEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 触摸在项呈示器上结束，抛出<code>ItemTapEvent.ITEM_TAP</code>事件。
         * @param event 事件<code>egret.TouchEvent</code>的对象。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.prototype.onRendererTouchEnd = function (event) {
            var values = this.$ListBase;
            var itemRenderer = (event.$currentTarget);
            var touchDownItemRenderer = values[7 /* touchDownItemRenderer */];
            if (itemRenderer != touchDownItemRenderer)
                return;
            if (!values[8 /* touchCancle */]) {
                this.setSelectedIndex(itemRenderer.itemIndex, true);
                eui.ItemTapEvent.dispatchItemTapEvent(this, eui.ItemTapEvent.ITEM_TAP, itemRenderer);
            }
            values[8 /* touchCancle */] = false;
        };
        /**
         * @private
         * 触摸在舞台上结束
         */
        ListBase.prototype.stage_touchEndHandler = function (event) {
            var stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
            this.$ListBase[7 /* touchDownItemRenderer */] = null;
        };
        /**
         * Static constant representing the value "no selection".
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 未选中任何项时的索引值
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.NO_SELECTION = -1;
        /**
         * Static constant representing no proposed selection.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 未设置缓存选中项的值
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ListBase.NO_PROPOSED_SELECTION = -2;
        return ListBase;
    }(eui.DataGroup));
    eui.ListBase = ListBase;
    __reflect(ListBase.prototype, "eui.ListBase");
    eui.registerBindable(ListBase.prototype, "selectedIndex");
    eui.registerBindable(ListBase.prototype, "selectedItem");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The ScrollBarBase class helps to position
     * the portion of data that is displayed when there is too much data
     * to fit in a display area.
     * The ScrollBarBase class displays a pair of viewport and a thumb.
     * viewport is a instance that implements IViewport.
     *
     * @see eui.IViewport
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * <code>ScrollBarBase</code> 滚动条基类，该类帮助在因数据太多而不能在显示区域完全显示时定位显示的数据部分。
     * ScrollBarBase 类显示视区的一部分和一个指示滑块。
     * 视区是一个IViewport接口实现的实例。
     *
     * @see eui.IViewport
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var ScrollBarBase = (function (_super) {
        __extends(ScrollBarBase, _super);
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个ScrollBarBase实例。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function ScrollBarBase() {
            var _this = _super.call(this) || this;
            /**
             * [SkinPart] Thumb display object.
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * [SkinPart]滑块显示对象。
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.thumb = null;
            /**
             * @private
             */
            _this.$viewport = null;
            /**
             * Whether the scrollbar can be autohide.
             * @version Egret 3.0.2
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 是否自动隐藏 scrollbar
             * @version Egret 3.0.2
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.autoVisibility = true;
            return _this;
        }
        Object.defineProperty(ScrollBarBase.prototype, "viewport", {
            /**
             * The viewport controlled by this scrollbar.
             *
             * If a viewport is specified, then changes to its actual size, content
             * size, and scroll position cause the corresponding ScrollBarBase methods to
             * run:
             * <ul>
             *     <li><code>onViewportResize()</code></li>
             *     <li><code>onPropertyChanged()</code></li>
             * </ul><p/>
             *
             * The VScrollBar and HScrollBar classes override these methods to keep their properties in
             * sync with the viewport.
             *
             * @default null
             * @see eui.VScrollBar
             * @see eui.HScrollBar
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 由该滚动条控制的视区。
             *
             * 如果指定了视区，则对其实际大小、内容大小和滚动位置的更改会导致运行相对应的 ScrollBarBase 方法：
             * <ul>
             *     <li><code>onViewportResize()</code></li>
             *     <li><code>onPropertyChanged()</code></li>
             * </ul><p/>
             *
             * VScrollBar 和 HScrollBar 类需要重写这些方法以保证属性与视区的同步。
             *
             * @default null
             * @see eui.VScrollBar
             * @see eui.HScrollBar
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$viewport;
            },
            set: function (value) {
                if (value == this.$viewport) {
                    return;
                }
                var viewport = this.$viewport;
                if (viewport) {
                    viewport.removeEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.onPropertyChanged, this);
                    viewport.removeEventListener(egret.Event.RESIZE, this.onViewportResize, this);
                }
                this.$viewport = value;
                if (value) {
                    value.addEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.onPropertyChanged, this);
                    value.addEventListener(egret.Event.RESIZE, this.onViewportResize, this);
                }
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param event
         */
        ScrollBarBase.prototype.onViewportResize = function (event) {
            this.invalidateDisplayList();
        };
        /**
         * Properties of viewport changed.
         * @param event
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 视区属性发生改变。
         * @param event
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ScrollBarBase.prototype.onPropertyChanged = function (event) {
        };
        return ScrollBarBase;
    }(eui.Component));
    eui.ScrollBarBase = ScrollBarBase;
    __reflect(ScrollBarBase.prototype, "eui.ScrollBarBase");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The SliderBase class lets users select a value by moving a slider thumb between
     * the end points of the slider track.
     * The current value of the slider is determined by the relative location of
     * the thumb between the end points of the slider,
     * corresponding to the slider's minimum and maximum values.
     * The SliderBase class is a base class for HSlider and VSlider.
     *
     * @event eui.UIEvent.CHANGE_START Dispatched when the scroll position is going to change
     * @event eui.UIEvent.CHANGE_END Dispatched when the scroll position changed complete
     * @event egret.Event.CHANGE Dispatched when the scroll position is changing
     *
     * @see eui.HSlider
     * @see eui.VSlider
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 滑块控件基类，通过使用 SliderBase 类，用户可以在滑块轨道的端点之间移动滑块来选择值。
     * 滑块的当前值由滑块端点（对应于滑块的最小值和最大值）之间滑块的相对位置确定。
     * SliderBase 类是 HSlider 和 VSlider 的基类。
     *
     * @event eui.UIEvent.CHANGE_START 滚动位置改变开始
     * @event eui.UIEvent.CHANGE_END 滚动位置改变结束
     * @event egret.Event.CHANGE 滚动位置改变的时候
     *
     * @see eui.HSlider
     * @see eui.VSlider
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var SliderBase = (function (_super) {
        __extends(SliderBase, _super);
        /**
         * Constructor
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 SliderBase 实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function SliderBase() {
            var _this = _super.call(this) || this;
            /**
             * [SkinPart] Highlight of track.
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * [SkinPart] 轨道高亮显示对象。
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.trackHighlight = null;
            /**
             * [SkinPart] Thumb display object.
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * [SkinPart]滑块显示对象。
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.thumb = null;
            /**
             * [SkinPart] Track display object.
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * [SkinPart]轨道显示对象。
             * @skinPart
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.track = null;
            _this.$SliderBase = {
                0: 0,
                1: 0,
                2: 0,
                3: 0,
                4: null,
                5: null,
                6: 300,
                7: 0,
                8: 0,
                9: true,
            };
            _this.maximum = 10;
            _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchBegin, _this);
            return _this;
        }
        Object.defineProperty(SliderBase.prototype, "slideDuration", {
            /**
             * Duration in milliseconds for the sliding animation when you tap on the track to move a thumb.
             *
             * @default 300
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 在轨道上单击以移动滑块时，滑动动画持续的时间（以毫秒为单位）。设置为0将不执行缓动。
             *
             * @default 300
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$SliderBase[6 /* slideDuration */];
            },
            set: function (value) {
                this.$SliderBase[6 /* slideDuration */] = +value || 0;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Converts a track-relative x,y pixel location into a value between
         * the minimum and maximum, inclusive.
         *
         * @param x The x coordinate of the location relative to the track's origin.
         * @param y The y coordinate of the location relative to the track's origin.
         * @return A value between the minimum and maximum, inclusive.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值。
         *
         * @param x 相对于轨道原点的位置的x坐标。
         * @param y 相对于轨道原点的位置的y坐标。
         * @return 介于最小值和最大值（包括两者）之间的一个值。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        SliderBase.prototype.pointToValue = function (x, y) {
            return this.minimum;
        };
        Object.defineProperty(SliderBase.prototype, "liveDragging", {
            /**
             * Specifies whether live dragging is enabled for the slider. If true, sets the value
             * and values properties and dispatches the change event continuously as
             * the user moves the thumb.
             *
             * @default true
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 如果为 true，则将在沿着轨道拖动滑块时，而不是在释放滑块按钮时，提交此滑块的值。
             *
             * @default true
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$SliderBase[9 /* liveDragging */];
            },
            set: function (value) {
                this.$SliderBase[9 /* liveDragging */] = !!value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SliderBase.prototype, "pendingValue", {
            /**
             * The value the slider will have when the touch is end.
             * This property is updated when the slider thumb moves, even if <code>liveDragging</code> is false.<p/>
             * If the <code>liveDragging</code> style is false, then the slider's value is only set
             * when the touch is end.
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 触摸结束时滑块将具有的值。
             * 无论 liveDragging 是否为 true，在滑块拖动期间始终更新此属性。
             * 而 value 属性在当 liveDragging 为 false 时，只在触摸释放时更新一次。
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$SliderBase[7 /* pendingValue */];
            },
            set: function (value) {
                value = +value || 0;
                var values = this.$SliderBase;
                if (value === values[7 /* pendingValue */])
                    return;
                values[7 /* pendingValue */] = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        SliderBase.prototype.setValue = function (value) {
            this.$SliderBase[7 /* pendingValue */] = value;
            _super.prototype.setValue.call(this, value);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        SliderBase.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
            if (instance == this.thumb) {
                this.thumb.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onThumbTouchBegin, this);
                this.thumb.addEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
            else if (instance == this.track) {
                this.track.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTrackTouchBegin, this);
                this.track.addEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
            else if (instance === this.trackHighlight) {
                this.trackHighlight.touchEnabled = false;
                if (egret.is(this.trackHighlight, "egret.DisplayObjectContainer")) {
                    this.trackHighlight.touchChildren = false;
                }
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        SliderBase.prototype.partRemoved = function (partName, instance) {
            _super.prototype.partRemoved.call(this, partName, instance);
            if (instance == this.thumb) {
                this.thumb.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onThumbTouchBegin, this);
                this.thumb.removeEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
            else if (instance == this.track) {
                this.track.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTrackTouchBegin, this);
                this.track.removeEventListener(egret.Event.RESIZE, this.onTrackOrThumbResize, this);
            }
        };
        /**
         * @private
         * 滑块或轨道尺寸改变事件
         */
        SliderBase.prototype.onTrackOrThumbResize = function (event) {
            this.updateSkinDisplayList();
        };
        /**
         * Handle touch-begin events on the scroll thumb. Records the touch begin point in clickOffset.
         *
         * @param The <code>egret.TouchEvent</code> object.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 滑块触摸开始事件，记录触碰开始的坐标偏移量。
         *
         * @param event 事件 <code>egret.TouchEvent</code> 的对象.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        SliderBase.prototype.onThumbTouchBegin = function (event) {
            var values = this.$SliderBase;
            if (values[5 /* animation */] && values[5 /* animation */].isPlaying)
                this.stopAnimation();
            var stage = this.$stage;
            stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
            stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            var clickOffset = this.thumb.globalToLocal(event.stageX, event.stageY, egret.$TempPoint);
            values[0 /* clickOffsetX */] = clickOffset.x;
            values[1 /* clickOffsetY */] = clickOffset.y;
            eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CHANGE_START);
        };
        /**
         * @private
         * 舞台上触摸移动事件
         */
        SliderBase.prototype.onStageTouchMove = function (event) {
            var values = this.$SliderBase;
            values[2 /* moveStageX */] = event.$stageX;
            values[3 /* moveStageY */] = event.$stageY;
            var track = this.track;
            if (!track)
                return;
            var p = track.globalToLocal(values[2 /* moveStageX */], values[3 /* moveStageY */], egret.$TempPoint);
            var newValue = this.pointToValue(p.x - values[0 /* clickOffsetX */], p.y - values[1 /* clickOffsetY */]);
            newValue = this.nearestValidValue(newValue, this.snapInterval);
            this.updateWhenTouchMove(newValue);
            event.updateAfterEvent();
        };
        /**
         * Capture touch-move events anywhere on or off the stage.
         * @param newValue new value
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 监听舞台的触碰移动事件。
         * @param newValue 新的值
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        SliderBase.prototype.updateWhenTouchMove = function (newValue) {
            if (newValue != this.$SliderBase[7 /* pendingValue */]) {
                if (this.liveDragging) {
                    this.setValue(newValue);
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
                else {
                    this.pendingValue = newValue;
                }
            }
        };
        /**
         * Handle touch-end events anywhere on or off the stage.
         *
         * @param The <code>egret.Event</code> object.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 触摸结束事件
         *
         * @param event 事件 <code>egret.Event</code> 的对象。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        SliderBase.prototype.onStageTouchEnd = function (event) {
            var stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onStageTouchMove, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CHANGE_END);
            var values = this.$SliderBase;
            if (!this.liveDragging && this.value != values[7 /* pendingValue */]) {
                this.setValue(values[7 /* pendingValue */]);
                this.dispatchEventWith(egret.Event.CHANGE);
            }
        };
        /**
         * @private
         * 当在组件上按下时记录被按下的子显示对象
         */
        SliderBase.prototype.onTouchBegin = function (event) {
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stageTouchEndHandler, this);
            this.$SliderBase[4 /* touchDownTarget */] = (event.$target);
        };
        /**
         * @private
         * 当结束时，若不是在 touchDownTarget 上弹起，而是另外的子显示对象上弹起时，额外抛出一个触摸单击事件。
         */
        SliderBase.prototype.stageTouchEndHandler = function (event) {
            var target = event.$target;
            var values = this.$SliderBase;
            event.$currentTarget.removeEventListener(egret.TouchEvent.TOUCH_END, this.stageTouchEndHandler, this);
            if (values[4 /* touchDownTarget */] != target && this.contains((target))) {
                egret.TouchEvent.dispatchTouchEvent(this, egret.TouchEvent.TOUCH_TAP, true, true, event.$stageX, event.$stageY, event.touchPointID);
            }
            values[4 /* touchDownTarget */] = null;
        };
        /**
         * @private
         * 动画播放更新数值
         */
        SliderBase.prototype.$animationUpdateHandler = function (animation) {
            this.pendingValue = animation.currentValue;
        };
        /**
         * @private
         * 动画播放完毕
         */
        SliderBase.prototype.animationEndHandler = function (animation) {
            this.setValue(this.$SliderBase[8 /* slideToValue */]);
            this.dispatchEventWith(egret.Event.CHANGE);
            eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CHANGE_END);
        };
        /**
         * @private
         * 停止播放动画
         */
        SliderBase.prototype.stopAnimation = function () {
            this.$SliderBase[5 /* animation */].stop();
            this.setValue(this.nearestValidValue(this.pendingValue, this.snapInterval));
            this.dispatchEventWith(egret.Event.CHANGE);
            eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CHANGE_END);
        };
        /**
         * Handle touch-begin events for the slider track. We
         * calculate the value based on the new position and then
         * move the thumb to the correct location as well as
         * commit the value.
         * @param The <code>egret.TouchEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 轨道的触碰开始事件。我们会在这里根据新的坐标位置计算value，然后移动滑块到当前位置。
         *
         * @param event 事件 <code>egret.TouchEvent</code> 的对象.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        SliderBase.prototype.onTrackTouchBegin = function (event) {
            var thumbW = this.thumb ? this.thumb.width : 0;
            var thumbH = this.thumb ? this.thumb.height : 0;
            var offsetX = event.$stageX - (thumbW / 2);
            var offsetY = event.$stageY - (thumbH / 2);
            var p = this.track.globalToLocal(offsetX, offsetY, egret.$TempPoint);
            var rangeValues = this.$Range;
            var newValue = this.pointToValue(p.x, p.y);
            newValue = this.nearestValidValue(newValue, rangeValues[7 /* snapInterval */]);
            var values = this.$SliderBase;
            if (newValue != values[7 /* pendingValue */]) {
                if (values[6 /* slideDuration */] != 0) {
                    if (!values[5 /* animation */]) {
                        values[5 /* animation */] = new eui.sys.Animation(this.$animationUpdateHandler, this);
                        values[5 /* animation */].endFunction = this.animationEndHandler;
                    }
                    var animation = values[5 /* animation */];
                    if (animation.isPlaying)
                        this.stopAnimation();
                    values[8 /* slideToValue */] = newValue;
                    animation.duration = values[6 /* slideDuration */] *
                        (Math.abs(values[7 /* pendingValue */] - values[8 /* slideToValue */]) / (rangeValues[0 /* maximum */] - rangeValues[2 /* minimum */]));
                    animation.from = values[7 /* pendingValue */];
                    animation.to = values[8 /* slideToValue */];
                    eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CHANGE_START);
                    animation.play();
                }
                else {
                    this.setValue(newValue);
                    this.dispatchEventWith(egret.Event.CHANGE);
                }
            }
        };
        return SliderBase;
    }(eui.Range));
    eui.SliderBase = SliderBase;
    __reflect(SliderBase.prototype, "eui.SliderBase");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var sys;
    (function (sys) {
        var exmlParserPool = [];
        var parsedClasses = {};
        var innerClassCount = 1;
        var HOST_COMPONENT = "hostComponent";
        var SKIN_CLASS = "eui.Skin";
        var DECLARATIONS = "Declarations";
        var RECTANGLE = "egret.Rectangle";
        var TYPE_CLASS = "Class";
        var TYPE_ARRAY = "Array";
        var TYPE_PERCENTAGE = "Percentage";
        var TYPE_STATE = "State[]";
        var SKIN_NAME = "skinName";
        var ELEMENTS_CONTENT = "elementsContent";
        var basicTypes = [TYPE_ARRAY, "boolean", "string", "number"];
        var wingKeys = ["id", "locked", "includeIn", "excludeFrom"];
        var htmlEntities = [["<", "&lt;"], [">", "&gt;"], ["&", "&amp;"], ["\"", "&quot;"], ["'", "&apos;"]];
        var jsKeyWords = ["null", "NaN", "undefined", "true", "false"];
        /**
         * @private
         */
        var EXMLParser = (function () {
            /**
             * @private
             */
            function EXMLParser() {
                /**
                 * @private
                 * 延迟赋值字典
                 */
                this.delayAssignmentDic = {};
                if (true) {
                    this.repeatedIdMap = {};
                    this.getRepeatedIds = getRepeatedIds;
                    this.getIds = getIds;
                    this.checkDeclarations = checkDeclarations;
                }
            }
            /**
             * @private
             * 将已有javascript代码注册
             * @param codeText 执行的javascript代码
             * @param classStr 类名
             */
            EXMLParser.prototype.$parseCode = function (codeText, classStr) {
                //传入的是编译后的js字符串
                var className = classStr ? classStr : "$exmlClass" + innerClassCount++;
                var geval = eval;
                var clazz = geval(codeText);
                var hasClass = true;
                if (hasClass && clazz) {
                    egret.registerClass(clazz, className);
                    var paths = className.split(".");
                    var length_15 = paths.length;
                    var definition = __global;
                    for (var i = 0; i < length_15 - 1; i++) {
                        var path = paths[i];
                        definition = definition[path] || (definition[path] = {});
                    }
                    if (definition[paths[length_15 - 1]]) {
                        if (true && !parsedClasses[className]) {
                            egret.$warn(2101, className, codeText);
                        }
                    }
                    else {
                        if (true) {
                            parsedClasses[className] = true;
                        }
                        definition[paths[length_15 - 1]] = clazz;
                    }
                }
                return clazz;
            };
            /**
             * @private
             * 编译指定的XML对象为JavaScript代码。
             * @param xmlData 要编译的EXML文件内容
             *
             */
            EXMLParser.prototype.parse = function (text) {
                if (true) {
                    if (!text) {
                        egret.$error(1003, "text");
                    }
                }
                var xmlData = null;
                if (true) {
                    try {
                        xmlData = egret.XML.parse(text);
                    }
                    catch (e) {
                        egret.$error(2002, text + "\n" + e.message);
                    }
                }
                else {
                    xmlData = egret.XML.parse(text);
                }
                var hasClass = false;
                var className = "";
                if (xmlData.attributes["class"]) {
                    className = xmlData.attributes["class"];
                    delete xmlData.attributes["class"];
                    hasClass = !!className;
                }
                else {
                    className = "$exmlClass" + innerClassCount++;
                }
                var exClass = this.parseClass(xmlData, className);
                var code = exClass.toCode();
                var clazz = null;
                var geval = eval;
                if (true) {
                    try {
                        clazz = geval(code);
                    }
                    catch (e) {
                        egret.log(code);
                        return null;
                    }
                }
                else {
                    clazz = geval(code);
                }
                if (hasClass && clazz) {
                    egret.registerClass(clazz, className);
                    var paths = className.split(".");
                    var length_16 = paths.length;
                    var definition = __global;
                    for (var i = 0; i < length_16 - 1; i++) {
                        var path = paths[i];
                        definition = definition[path] || (definition[path] = {});
                    }
                    if (definition[paths[length_16 - 1]]) {
                        if (true && !parsedClasses[className]) {
                            egret.$warn(2101, className, toXMLString(xmlData));
                        }
                    }
                    else {
                        if (true) {
                            parsedClasses[className] = true;
                        }
                        definition[paths[length_16 - 1]] = clazz;
                    }
                }
                return clazz;
            };
            /**
             * @private
             * 编译指定的XML对象为CpClass对象。
             */
            EXMLParser.prototype.parseClass = function (xmlData, className) {
                if (!sys.exmlConfig) {
                    sys.exmlConfig = new sys.EXMLConfig();
                }
                this.currentXML = xmlData;
                this.currentClassName = className;
                this.delayAssignmentDic = {};
                this.idDic = {};
                this.stateCode = [];
                this.stateNames = [];
                this.skinParts = [];
                this.bindings = [];
                this.declarations = null;
                this.currentClass = new sys.EXClass();
                this.stateIds = [];
                var index = className.lastIndexOf(".");
                if (index != -1) {
                    this.currentClass.className = className.substring(index + 1);
                }
                else {
                    this.currentClass.className = className;
                }
                this.startCompile();
                var clazz = this.currentClass;
                this.currentClass = null;
                return clazz;
            };
            /**
             * @private
             * 开始编译
             */
            EXMLParser.prototype.startCompile = function () {
                if (true) {
                    var result = this.getRepeatedIds(this.currentXML);
                    if (result.length > 0) {
                        egret.$error(2004, this.currentClassName, result.join("\n"));
                    }
                }
                var superClass = this.getClassNameOfNode(this.currentXML);
                this.isSkinClass = (superClass == SKIN_CLASS);
                this.currentClass.superClass = superClass;
                this.getStateNames();
                var children = this.currentXML.children;
                if (children) {
                    var length_17 = children.length;
                    for (var i = 0; i < length_17; i++) {
                        var node = children[i];
                        if (node.nodeType === 1 && node.namespace == sys.NS_W &&
                            node.localName == DECLARATIONS) {
                            this.declarations = node;
                            break;
                        }
                    }
                }
                if (true) {
                    var list = [];
                    this.checkDeclarations(this.declarations, list);
                    if (list.length > 0) {
                        egret.$error(2020, this.currentClassName, list.join("\n"));
                    }
                }
                if (!this.currentXML.namespace) {
                    if (true) {
                        egret.$error(2017, this.currentClassName, toXMLString(this.currentXML));
                    }
                    return;
                }
                this.addIds(this.currentXML.children);
                this.createConstructFunc();
            };
            /**
             * @private
             * 添加必须的id
             */
            EXMLParser.prototype.addIds = function (items) {
                if (!items) {
                    return;
                }
                var length = items.length;
                for (var i = 0; i < length; i++) {
                    var node = items[i];
                    if (node.nodeType != 1) {
                        continue;
                    }
                    if (!node.namespace) {
                        if (true) {
                            egret.$error(2017, this.currentClassName, toXMLString(node));
                        }
                        continue;
                    }
                    if (this.isInnerClass(node)) {
                        continue;
                    }
                    this.addIds(node.children);
                    if (node.namespace == sys.NS_W || !node.localName) {
                    }
                    else if (this.isProperty(node)) {
                        var prop = node.localName;
                        var index = prop.indexOf(".");
                        var children = node.children;
                        if (index == -1 || !children || children.length == 0) {
                            continue;
                        }
                        var firstChild = children[0];
                        this.stateIds.push(firstChild.attributes.id);
                    }
                    else if (node.nodeType === 1) {
                        var id = node.attributes["id"];
                        if (id) {
                            var e = new RegExp("^[a-zA-Z_$]{1}[a-z0-9A-Z_$]*");
                            if (id.match(e) == null) {
                                egret.$warn(2022, id);
                            }
                            if (id.match(new RegExp(/ /g)) != null) {
                                egret.$warn(2022, id);
                            }
                            if (this.skinParts.indexOf(id) == -1) {
                                this.skinParts.push(id);
                            }
                            this.createVarForNode(node);
                            if (this.isStateNode(node))
                                this.stateIds.push(id);
                        }
                        else {
                            this.createIdForNode(node);
                            if (this.isStateNode(node))
                                this.stateIds.push(node.attributes.id);
                        }
                    }
                }
            };
            /**
             * @private
             * 是否为内部类。
             */
            EXMLParser.prototype.isInnerClass = function (node) {
                if (node.hasOwnProperty("isInnerClass")) {
                    return node["isInnerClass"];
                }
                var result = (node.localName == "Skin" && node.namespace == sys.NS_S);
                if (!result) {
                    if (this.isProperty(node)) {
                        result = false;
                    }
                    else {
                        var prop = void 0;
                        var parent_1 = node.parent;
                        if (this.isProperty(parent_1)) {
                            prop = parent_1.localName;
                            var index = prop.indexOf(".");
                            if (index != -1) {
                                var stateName = prop.substring(index + 1);
                                prop = prop.substring(0, index);
                            }
                            parent_1 = parent_1.parent;
                        }
                        else {
                            prop = sys.exmlConfig.getDefaultPropById(parent_1.localName, parent_1.namespace);
                        }
                        var className = sys.exmlConfig.getClassNameById(parent_1.localName, parent_1.namespace);
                        result = (sys.exmlConfig.getPropertyType(prop, className) == TYPE_CLASS);
                    }
                }
                node["isInnerClass"] = result;
                return result;
            };
            /**
             * @private
             * 检测指定节点的属性是否含有视图状态
             */
            EXMLParser.prototype.containsState = function (node) {
                var attributes = node.attributes;
                if (attributes["includeIn"] || attributes["excludeFrom"]) {
                    return true;
                }
                var keys = Object.keys(attributes);
                var length = keys.length;
                for (var i = 0; i < length; i++) {
                    var name_1 = keys[i];
                    if (name_1.indexOf(".") != -1) {
                        return true;
                    }
                }
                return false;
            };
            /**
             * @private
             * 为指定节点创建id属性
             */
            EXMLParser.prototype.createIdForNode = function (node) {
                var idName = this.getNodeId(node);
                if (!this.idDic[idName])
                    this.idDic[idName] = 1;
                else
                    this.idDic[idName]++;
                idName += this.idDic[idName];
                node.attributes.id = idName;
            };
            /**
             * @private
             * 获取节点ID
             */
            EXMLParser.prototype.getNodeId = function (node) {
                if (node.attributes["id"])
                    return node.attributes.id;
                return "_" + node.localName;
            };
            /**
             * @private
             * 为指定节点创建变量
             */
            EXMLParser.prototype.createVarForNode = function (node) {
                var moduleName = this.getClassNameOfNode(node);
                if (moduleName == "")
                    return;
                if (!this.currentClass.getVariableByName(node.attributes.id))
                    this.currentClass.addVariable(new sys.EXVariable(node.attributes.id));
            };
            /**
             * @private
             * 为指定节点创建初始化函数,返回函数名引用
             */
            EXMLParser.prototype.createFuncForNode = function (node) {
                var className = node.localName;
                var isBasicType = this.isBasicTypeData(className);
                if (isBasicType)
                    return this.createBasicTypeForNode(node);
                var moduleName = this.getClassNameOfNode(node);
                var func = new sys.EXFunction();
                var tailName = "_i";
                var id = node.attributes.id;
                func.name = id + tailName;
                this.currentClass.addFunction(func);
                var cb = new sys.EXCodeBlock();
                func.codeBlock = cb;
                var varName = "t";
                if (className == "Object") {
                    cb.addVar(varName, "{}");
                }
                else {
                    cb.addVar(varName, "new " + moduleName + "()");
                }
                var containsId = !!this.currentClass.getVariableByName(id);
                if (containsId) {
                    cb.addAssignment("this." + id, varName);
                }
                this.addAttributesToCodeBlock(cb, varName, node);
                this.initlizeChildNode(node, cb, varName);
                var delayAssignments = this.delayAssignmentDic[id];
                if (delayAssignments) {
                    var length_18 = delayAssignments.length;
                    for (var i = 0; i < length_18; i++) {
                        var codeBlock = delayAssignments[i];
                        cb.concat(codeBlock);
                    }
                }
                cb.addReturn(varName);
                return "this." + func.name + "()";
            };
            /**
             * @private
             * 检查目标类名是否是基本数据类型
             */
            EXMLParser.prototype.isBasicTypeData = function (className) {
                return basicTypes.indexOf(className) != -1;
            };
            /**
             * @private
             * 为指定基本数据类型节点实例化,返回实例化后的值。
             */
            EXMLParser.prototype.createBasicTypeForNode = function (node) {
                var className = node.localName;
                var returnValue = "";
                var varItem = this.currentClass.getVariableByName(node.attributes.id);
                var children = node.children;
                var text = "";
                if (children && children.length > 0) {
                    var firstChild = children[0];
                    if (firstChild.nodeType == 3) {
                        text = firstChild.text.trim();
                    }
                }
                switch (className) {
                    case TYPE_ARRAY:
                        var values = [];
                        if (children) {
                            var length_19 = children.length;
                            for (var i = 0; i < length_19; i++) {
                                var child = children[i];
                                if (child.nodeType == 1) {
                                    values.push(this.createFuncForNode(child));
                                }
                            }
                        }
                        returnValue = "[" + values.join(",") + "]";
                        break;
                    case "boolean":
                        returnValue = (text == "false" || !text) ? "false" : "true";
                        break;
                    case "number":
                        returnValue = text;
                        if (returnValue.indexOf("%") != -1)
                            returnValue = returnValue.substring(0, returnValue.length - 1);
                        break;
                    case "string":
                        returnValue = this.formatString(text);
                        break;
                }
                if (varItem)
                    varItem.defaultValue = returnValue;
                return returnValue;
            };
            /**
             * @private
             * 将节点属性赋值语句添加到代码块
             */
            EXMLParser.prototype.addAttributesToCodeBlock = function (cb, varName, node) {
                var key;
                var value;
                var attributes = node.attributes;
                var keyList = Object.keys(attributes);
                keyList.sort(); //排序一下防止出现随机顺序
                var length = keyList.length;
                for (var i = 0; i < length; i++) {
                    key = keyList[i];
                    if (!this.isNormalKey(key)) {
                        continue;
                    }
                    value = attributes[key];
                    key = this.formatKey(key, value);
                    value = this.formatValue(key, value, node);
                    if (!value) {
                        continue;
                    }
                    if (this.currentClass.getVariableByName(value)) {
                        var THIS = "this.";
                        var id = attributes.id;
                        var codeLine = THIS + id + " = t;";
                        if (!this.currentClass.getVariableByName(id))
                            this.createVarForNode(node);
                        if (!cb.containsCodeLine(codeLine)) {
                            cb.addCodeLineAt(codeLine, 1);
                        }
                        var delayCb = new sys.EXCodeBlock();
                        if (varName == "this") {
                            delayCb.addAssignment(varName, THIS + value, key);
                        }
                        else {
                            delayCb.startIf(THIS + id);
                            delayCb.addAssignment(THIS + id, THIS + value, key);
                            delayCb.endBlock();
                        }
                        if (!this.delayAssignmentDic[value]) {
                            this.delayAssignmentDic[value] = [];
                        }
                        this.delayAssignmentDic[value].push(delayCb);
                        value = THIS + value;
                    }
                    cb.addAssignment(varName, value, key);
                }
            };
            /**
             * @private
             * 初始化子项
             */
            EXMLParser.prototype.initlizeChildNode = function (node, cb, varName) {
                var children = node.children;
                if (!children || children.length == 0)
                    return;
                var className = sys.exmlConfig.getClassNameById(node.localName, node.namespace);
                var directChild = [];
                var length = children.length;
                var propList = [];
                var errorInfo;
                for (var i = 0; i < length; i++) {
                    var child = children[i];
                    if (child.nodeType != 1 || child.namespace == sys.NS_W) {
                        continue;
                    }
                    if (this.isInnerClass(child)) {
                        if (child.localName == "Skin") {
                            var innerClassName = this.parseInnerClass(child);
                            var type = sys.exmlConfig.getPropertyType(SKIN_NAME, className);
                            if (type) {
                                cb.addAssignment(varName, innerClassName, SKIN_NAME);
                            }
                            else {
                                egret.$error(2005, this.currentClassName, SKIN_NAME, getPropertyStr(child));
                            }
                        }
                        continue;
                    }
                    var prop = child.localName;
                    if (this.isProperty(child)) {
                        if (!this.isNormalKey(prop)) {
                            continue;
                        }
                        var type = sys.exmlConfig.getPropertyType(child.localName, className);
                        if (!type) {
                            if (true) {
                                egret.$error(2005, this.currentClassName, child.localName, getPropertyStr(child));
                            }
                            continue;
                        }
                        if (!child.children || child.children.length == 0) {
                            if (true) {
                                egret.$warn(2102, this.currentClassName, getPropertyStr(child));
                            }
                            continue;
                        }
                        if (true) {
                            errorInfo = getPropertyStr(child);
                        }
                        this.addChildrenToProp(child.children, type, prop, cb, varName, errorInfo, propList, node);
                    }
                    else {
                        directChild.push(child);
                    }
                }
                if (directChild.length == 0)
                    return;
                var defaultProp = sys.exmlConfig.getDefaultPropById(node.localName, node.namespace);
                var defaultType = sys.exmlConfig.getPropertyType(defaultProp, className);
                if (true) {
                    errorInfo = getPropertyStr(directChild[0]);
                }
                if (!defaultProp || !defaultType) {
                    if (true) {
                        egret.$error(2012, this.currentClassName, errorInfo);
                    }
                    return;
                }
                this.addChildrenToProp(directChild, defaultType, defaultProp, cb, varName, errorInfo, propList, node);
            };
            /**
             * @private
             * 解析内部类节点，并返回类名。
             */
            EXMLParser.prototype.parseInnerClass = function (node) {
                var parser = exmlParserPool.pop();
                if (!parser) {
                    parser = new EXMLParser();
                }
                var innerClassName = this.currentClass.className + "$" + node.localName + innerClassCount++;
                var innerClass = parser.parseClass(node, innerClassName);
                this.currentClass.addInnerClass(innerClass);
                exmlParserPool.push(parser);
                return innerClassName;
            };
            /**
             * @private
             * 添加多个子节点到指定的属性
             */
            EXMLParser.prototype.addChildrenToProp = function (children, type, prop, cb, varName, errorInfo, propList, node) {
                var childFunc = "";
                var childLength = children.length;
                if (childLength > 1) {
                    if (type != TYPE_ARRAY) {
                        if (true) {
                            egret.$error(2011, this.currentClassName, prop, errorInfo);
                        }
                        return;
                    }
                    var values = [];
                    for (var j = 0; j < childLength; j++) {
                        var item = children[j];
                        if (item.nodeType != 1) {
                            continue;
                        }
                        childFunc = this.createFuncForNode(item);
                        var childClassName = this.getClassNameOfNode(item);
                        if (!this.isStateNode(item))
                            values.push(childFunc);
                    }
                    childFunc = "[" + values.join(",") + "]";
                }
                else {
                    var firstChild = children[0];
                    if (type == TYPE_ARRAY) {
                        if (firstChild.localName == TYPE_ARRAY) {
                            var values = [];
                            if (firstChild.children) {
                                var len = firstChild.children.length;
                                for (var k = 0; k < len; k++) {
                                    var item = firstChild.children[k];
                                    if (item.nodeType != 1) {
                                        continue;
                                    }
                                    childFunc = this.createFuncForNode(item);
                                    var childClassName = this.getClassNameOfNode(item);
                                    if (!this.isStateNode(item))
                                        values.push(childFunc);
                                }
                            }
                            childFunc = "[" + values.join(",") + "]";
                        }
                        else {
                            childFunc = this.createFuncForNode(firstChild);
                            var childClassName = this.getClassNameOfNode(firstChild);
                            if (!this.isStateNode(firstChild))
                                childFunc = "[" + childFunc + "]";
                            else
                                childFunc = "[]";
                        }
                    }
                    else if (firstChild.nodeType == 1) {
                        if (type == TYPE_CLASS) {
                            if (childLength > 1) {
                                if (true) {
                                    egret.$error(2011, this.currentClassName, prop, errorInfo);
                                }
                                return;
                            }
                            childFunc = this.parseInnerClass(children[0]);
                        }
                        else {
                            var targetClass = this.getClassNameOfNode(firstChild);
                            childFunc = this.createFuncForNode(firstChild);
                        }
                    }
                    else {
                        childFunc = this.formatValue(prop, firstChild.text, node);
                    }
                }
                if (childFunc != "") {
                    if (childFunc.indexOf("()") == -1)
                        prop = this.formatKey(prop, childFunc);
                    if (propList.indexOf(prop) == -1) {
                        propList.push(prop);
                    }
                    else if (true) {
                        egret.$warn(2103, this.currentClassName, prop, errorInfo);
                    }
                    cb.addAssignment(varName, childFunc, prop);
                }
            };
            /**
             * @private
             * 指定节点是否是属性节点
             */
            EXMLParser.prototype.isProperty = function (node) {
                if (node.hasOwnProperty("isProperty")) {
                    return node["isProperty"];
                }
                var result;
                var name = node.localName;
                if (!name || node.nodeType !== 1 || !node.parent || this.isBasicTypeData(name)) {
                    result = false;
                }
                else {
                    var parent_2 = node.parent;
                    var index = name.indexOf(".");
                    if (index != -1) {
                        name = name.substr(0, index);
                    }
                    var className = sys.exmlConfig.getClassNameById(parent_2.localName, parent_2.namespace);
                    result = !!sys.exmlConfig.getPropertyType(name, className);
                }
                node["isProperty"] = result;
                return result;
            };
            /**
             * @private
             * 是否是普通赋值的key
             */
            EXMLParser.prototype.isNormalKey = function (key) {
                if (!key || key.indexOf(".") != -1
                    || key.indexOf(":") != -1 || wingKeys.indexOf(key) != -1)
                    return false;
                return true;
            };
            /**
             * @private
             * 格式化key
             */
            EXMLParser.prototype.formatKey = function (key, value) {
                if (value.indexOf("%") != -1) {
                    if (key == "height")
                        key = "percentHeight";
                    else if (key == "width")
                        key = "percentWidth";
                }
                return key;
            };
            /**
             * @private
             * 格式化值
             */
            EXMLParser.prototype.formatValue = function (key, value, node) {
                if (!value) {
                    value = "";
                }
                var stringValue = value; //除了字符串，其他类型都去除两端多余空格。
                value = value.trim();
                var className = this.getClassNameOfNode(node);
                var type = sys.exmlConfig.getPropertyType(key, className);
                if (true && !type) {
                    egret.$error(2005, this.currentClassName, key, toXMLString(node));
                }
                var bindingValue = this.formatBinding(key, value, node);
                if (bindingValue) {
                    this.checkIdForState(node);
                    var target = "this";
                    if (node !== this.currentXML) {
                        target += "." + node.attributes["id"];
                    }
                    this.bindings.push(new sys.EXBinding(target, key, bindingValue.templates, bindingValue.chainIndex));
                    value = "";
                }
                else if (type == RECTANGLE) {
                    if (true) {
                        var rect = value.split(",");
                        if (rect.length != 4 || isNaN(parseInt(rect[0])) || isNaN(parseInt(rect[1])) ||
                            isNaN(parseInt(rect[2])) || isNaN(parseInt(rect[3]))) {
                            egret.$error(2016, this.currentClassName, toXMLString(node));
                        }
                    }
                    value = "new " + RECTANGLE + "(" + value + ")";
                }
                else if (type == TYPE_PERCENTAGE) {
                    if (value.indexOf("%") != -1) {
                        value = this.formatString(value);
                        ;
                    }
                }
                else {
                    var orgValue = value;
                    switch (type) {
                        case TYPE_CLASS:
                            if (key == SKIN_NAME) {
                                value = this.formatString(stringValue);
                            }
                            break;
                        case "number":
                            if (value.indexOf("#") == 0) {
                                if (true && isNaN(value.substring(1))) {
                                    egret.$warn(2021, this.currentClassName, key, value);
                                }
                                value = "0x" + value.substring(1);
                            }
                            else if (value.indexOf("%") != -1) {
                                if (true && isNaN(value.substr(0, value.length - 1))) {
                                    egret.$warn(2021, this.currentClassName, key, value);
                                }
                                value = (parseFloat(value.substr(0, value.length - 1))).toString();
                            }
                            else if (true && isNaN(value)) {
                                egret.$warn(2021, this.currentClassName, key, value);
                            }
                            break;
                        case "boolean":
                            value = (value == "false" || !value) ? "false" : "true";
                            break;
                        case "string":
                        case "any":
                            value = this.formatString(stringValue);
                            break;
                        default:
                            if (true) {
                                egret.$error(2008, this.currentClassName, "string", key + ":" + type, toXMLString(node));
                            }
                            break;
                    }
                }
                return value;
            };
            /**
             * @private
             * 格式化字符串
             */
            EXMLParser.prototype.formatString = function (value) {
                value = this.unescapeHTMLEntity(value);
                value = value.split("\n").join("\\n");
                value = value.split("\r").join("\\n");
                value = value.split("\"").join("\\\"");
                value = "\"" + value + "\"";
                return value;
            };
            EXMLParser.prototype.formatBinding = function (key, value, node) {
                if (!value) {
                    return null;
                }
                value = value.trim();
                if (value.charAt(0) != "{" || value.charAt(value.length - 1) != "}") {
                    return null;
                }
                value = value.substring(1, value.length - 1).trim();
                var templates = value.indexOf("+") == -1 ? [value] : this.parseTemplates(value);
                var chainIndex = [];
                var length = templates.length;
                for (var i = 0; i < length; i++) {
                    var item = templates[i].trim();
                    if (!item) {
                        templates.splice(i, 1);
                        i--;
                        length--;
                        continue;
                    }
                    var first = item.charAt(0);
                    if (first == "'" || first == "\"" || first >= "0" && first <= "9" || first == "-") {
                        continue;
                    }
                    if (item.indexOf(".") == -1 && jsKeyWords.indexOf(item) != -1) {
                        continue;
                    }
                    if (item.indexOf("this.") == 0) {
                        item = item.substring(5);
                    }
                    var firstKey = item.split(".")[0];
                    if (firstKey != HOST_COMPONENT && this.skinParts.indexOf(firstKey) == -1) {
                        item = HOST_COMPONENT + "." + item;
                    }
                    templates[i] = "\"" + item + "\"";
                    chainIndex.push(i);
                }
                return { templates: templates, chainIndex: chainIndex };
            };
            EXMLParser.prototype.parseTemplates = function (value) {
                //仅仅是表达式相加 如:{a.b+c.d}
                if (value.indexOf("'") == -1) {
                    return value.split("+");
                }
                //包含文本的需要提取文本并对文本进行处理
                var isSingleQuoteLeak = false; //是否缺失单引号
                var trimText = "";
                value = value.split("\\\'").join("\v0\v");
                while (value.length > 0) {
                    //'成对出现 这是第一个
                    var index = value.indexOf("'");
                    if (index == -1) {
                        trimText += value;
                        break;
                    }
                    trimText += value.substring(0, index + 1);
                    value = value.substring(index + 1);
                    //'成对出现 这是第二个
                    index = value.indexOf("'");
                    if (index == -1) {
                        index = value.length - 1;
                        isSingleQuoteLeak = true;
                    }
                    var quote = value.substring(0, index + 1);
                    trimText += quote.split("+").join("\v1\v");
                    value = value.substring(index + 1);
                }
                value = trimText.split("\v0\v").join("\\\'");
                //补全缺失的单引号
                if (isSingleQuoteLeak) {
                    value += "'";
                }
                var templates = value.split("+");
                var length = templates.length;
                for (var i = 0; i < length; i++) {
                    templates[i] = templates[i].split("\v1\v").join("+");
                }
                return templates;
            };
            /**
             * @private
             /**
             * 转换HTML实体字符为普通字符
             */
            EXMLParser.prototype.unescapeHTMLEntity = function (str) {
                if (!str)
                    return "";
                var length = htmlEntities.length;
                for (var i = 0; i < length; i++) {
                    var arr = htmlEntities[i];
                    var key = arr[0];
                    var value = arr[1];
                    str = str.split(value).join(key);
                }
                return str;
            };
            /**
             * @private
             * 创建构造函数
             */
            EXMLParser.prototype.createConstructFunc = function () {
                var cb = new sys.EXCodeBlock;
                cb.addEmptyLine();
                var varName = "this";
                this.addAttributesToCodeBlock(cb, varName, this.currentXML);
                if (this.declarations) {
                    var children = this.declarations.children;
                    if (children && children.length > 0) {
                        var length_20 = children.length;
                        for (var i = 0; i < length_20; i++) {
                            var decl = children[i];
                            if (decl.nodeType != 1) {
                                continue;
                            }
                            var funcName = this.createFuncForNode(decl);
                            if (funcName) {
                                cb.addCodeLine(funcName + ";");
                            }
                        }
                    }
                }
                this.initlizeChildNode(this.currentXML, cb, varName);
                var id;
                var length;
                var stateIds = this.stateIds;
                if (stateIds.length > 0) {
                    length = stateIds.length;
                    for (var i = 0; i < length; i++) {
                        id = stateIds[i];
                        cb.addCodeLine("this." + id + "_i();");
                    }
                    cb.addEmptyLine();
                }
                var skinParts = this.skinParts;
                var skinPartStr = "[]";
                length = skinParts.length;
                if (length > 0) {
                    for (var i = 0; i < length; i++) {
                        skinParts[i] = "\"" + skinParts[i] + "\"";
                    }
                    skinPartStr = "[" + skinParts.join(",") + "]";
                }
                var skinPartFunc = new sys.EXFunction();
                skinPartFunc.name = "skinParts";
                skinPartFunc.isGet = true;
                var skinPartCB = new sys.EXCodeBlock();
                skinPartCB.addReturn(skinPartStr);
                skinPartFunc.codeBlock = skinPartCB;
                this.currentClass.addFunction(skinPartFunc);
                this.currentXML.attributes.id = "";
                //生成视图状态代码
                this.createStates(this.currentXML);
                var states;
                var node = this.currentXML;
                var nodeClassName = this.getClassNameOfNode(node);
                var attributes = node.attributes;
                var keys = Object.keys(attributes);
                var keysLength = keys.length;
                for (var m = 0; m < keysLength; m++) {
                    var itemName = keys[m];
                    var value = attributes[itemName];
                    var index = itemName.indexOf(".");
                    if (index != -1) {
                        var key = itemName.substring(0, index);
                        key = this.formatKey(key, value);
                        var itemValue = this.formatValue(key, value, node);
                        if (!itemValue) {
                            continue;
                        }
                        var stateName = itemName.substr(index + 1);
                        states = this.getStateByName(stateName, node);
                        var stateLength = states.length;
                        if (stateLength > 0) {
                            for (var i = 0; i < stateLength; i++) {
                                var state = states[i];
                                state.addOverride(new sys.EXSetProperty("", key, itemValue));
                            }
                        }
                    }
                }
                //打印视图状态初始化代码
                var stateCode = this.stateCode;
                length = stateCode.length;
                if (length > 0) {
                    var indentStr = "	";
                    cb.addCodeLine("this.states = [");
                    var first = true;
                    for (var i = 0; i < length; i++) {
                        var state = stateCode[i];
                        if (first)
                            first = false;
                        else
                            cb.addCodeLine(indentStr + ",");
                        var codes = state.toCode().split("\n");
                        var codeIndex = 0;
                        while (codeIndex < codes.length) {
                            var code = codes[codeIndex];
                            if (code)
                                cb.addCodeLine(indentStr + code);
                            codeIndex++;
                        }
                    }
                    cb.addCodeLine("];");
                }
                //生成绑定代码
                var bindings = this.bindings;
                length = bindings.length;
                if (length > 0) {
                    cb.addEmptyLine();
                    for (var i = 0; i < length; i++) {
                        var binding = bindings[i];
                        cb.addCodeLine(binding.toCode());
                    }
                }
                this.currentClass.constructCode = cb;
            };
            /**
             * @private
             * 是否含有includeIn和excludeFrom属性
             */
            EXMLParser.prototype.isStateNode = function (node) {
                var attributes = node.attributes;
                return attributes.hasOwnProperty("includeIn") || attributes.hasOwnProperty("excludeFrom");
            };
            /**
             * @private
             * 获取视图状态名称列表
             */
            EXMLParser.prototype.getStateNames = function () {
                var root = this.currentXML;
                var className = sys.exmlConfig.getClassNameById(root.localName, root.namespace);
                var type = sys.exmlConfig.getPropertyType("states", className);
                if (type != TYPE_STATE) {
                    return;
                }
                var statesValue = root.attributes["states"];
                if (statesValue) {
                    delete root.attributes["states"];
                }
                var stateNames = this.stateNames;
                var stateChildren;
                var children = root.children;
                var item;
                if (children) {
                    var length_21 = children.length;
                    for (var i = 0; i < length_21; i++) {
                        item = children[i];
                        if (item.nodeType == 1 &&
                            item.localName == "states") {
                            item.namespace = sys.NS_W;
                            stateChildren = item.children;
                            break;
                        }
                    }
                }
                if (!stateChildren && !statesValue) {
                    return;
                }
                if (true) {
                    if (stateChildren && stateChildren.length == 0) {
                        egret.$warn(2102, this.currentClassName, getPropertyStr(item));
                    }
                    if (stateChildren && statesValue) {
                        egret.$warn(2103, this.currentClassName, "states", getPropertyStr(item));
                    }
                }
                if (statesValue) {
                    var states = statesValue.split(",");
                    var length_22 = states.length;
                    for (var i = 0; i < length_22; i++) {
                        var stateName = states[i].trim();
                        if (!stateName) {
                            continue;
                        }
                        if (stateNames.indexOf(stateName) == -1) {
                            stateNames.push(stateName);
                        }
                        this.stateCode.push(new sys.EXState(stateName));
                    }
                    return;
                }
                var length = stateChildren.length;
                for (var i = 0; i < length; i++) {
                    var state = stateChildren[i];
                    if (state.nodeType != 1) {
                        continue;
                    }
                    var stateGroups = [];
                    var attributes = state.attributes;
                    if (attributes["stateGroups"]) {
                        var groups = attributes.stateGroups.split(",");
                        var len = groups.length;
                        for (var j = 0; j < len; j++) {
                            var group = groups[j].trim();
                            if (group) {
                                if (stateNames.indexOf(group) == -1) {
                                    stateNames.push(group);
                                }
                                stateGroups.push(group);
                            }
                        }
                    }
                    var stateName = attributes.name;
                    if (stateNames.indexOf(stateName) == -1) {
                        stateNames.push(stateName);
                    }
                    this.stateCode.push(new sys.EXState(stateName, stateGroups));
                }
            };
            /**
             * @private
             * 解析视图状态代码
             */
            EXMLParser.prototype.createStates = function (parentNode) {
                var items = parentNode.children;
                if (!items) {
                    return;
                }
                var length = items.length;
                for (var i = 0; i < length; i++) {
                    var node = items[i];
                    if (node.nodeType != 1 || this.isInnerClass(node)) {
                        continue;
                    }
                    this.createStates(node);
                    if (node.namespace == sys.NS_W || !node.localName) {
                        continue;
                    }
                    if (this.isProperty(node)) {
                        var prop = node.localName;
                        var index = prop.indexOf(".");
                        var children = node.children;
                        if (index == -1 || !children || children.length == 0) {
                            continue;
                        }
                        var stateName = prop.substring(index + 1);
                        prop = prop.substring(0, index);
                        var className = this.getClassNameOfNode(parentNode);
                        var type = sys.exmlConfig.getPropertyType(prop, className);
                        if (true) {
                            if (type == TYPE_ARRAY) {
                                egret.$error(2013, this.currentClassName, getPropertyStr(node));
                            }
                            if (children.length > 1) {
                                egret.$error(2011, this.currentClassName, prop, getPropertyStr(node));
                            }
                        }
                        var firstChild = children[0];
                        var value = void 0;
                        if (firstChild.nodeType == 1) {
                            this.createFuncForNode(firstChild);
                            this.checkIdForState(firstChild);
                            value = "this." + firstChild.attributes.id;
                        }
                        else {
                            value = this.formatValue(prop, firstChild.text, parentNode);
                        }
                        var states = this.getStateByName(stateName, node);
                        var l = states.length;
                        if (l > 0) {
                            for (var j = 0; j < l; j++) {
                                var state = states[j];
                                state.addOverride(new sys.EXSetProperty(parentNode.attributes.id, prop, value));
                            }
                        }
                    }
                    else if (this.containsState(node)) {
                        var attributes = node.attributes;
                        var id = attributes.id;
                        var nodeClassName = this.getClassNameOfNode(node);
                        this.checkIdForState(node);
                        var stateName = void 0;
                        var states = void 0;
                        var state = void 0;
                        if (this.isStateNode(node)) {
                            var propertyName = "";
                            var parent_3 = node.parent;
                            if (parent_3.localName == TYPE_ARRAY)
                                parent_3 = parent_3.parent;
                            if (parent_3 && parent_3.parent) {
                                if (this.isProperty(parent_3))
                                    parent_3 = parent_3.parent;
                            }
                            if (parent_3 && parent_3 != this.currentXML) {
                                propertyName = parent_3.attributes.id;
                                this.checkIdForState(parent_3);
                            }
                            var positionObj = this.findNearNodeId(node);
                            var stateNames = [];
                            if (attributes.includeIn) {
                                stateNames = attributes.includeIn.split(",");
                            }
                            else {
                                var excludeNames = attributes.excludeFrom.split(",");
                                var stateLength = excludeNames.length;
                                for (var j = 0; j < stateLength; j++) {
                                    var name_2 = excludeNames[j];
                                    this.getStateByName(name_2, node); //检查exlcudeFrom是否含有未定义的视图状态名
                                }
                                stateLength = this.stateCode.length;
                                for (var j = 0; j < stateLength; j++) {
                                    state = this.stateCode[j];
                                    if (excludeNames.indexOf(state.name) == -1) {
                                        stateNames.push(state.name);
                                    }
                                }
                            }
                            var len = stateNames.length;
                            for (var k = 0; k < len; k++) {
                                stateName = stateNames[k];
                                states = this.getStateByName(stateName, node);
                                if (states.length > 0) {
                                    var l = states.length;
                                    for (var j = 0; j < l; j++) {
                                        state = states[j];
                                        state.addOverride(new sys.EXAddItems(id, propertyName, positionObj.position, positionObj.relativeTo));
                                    }
                                }
                            }
                        }
                        var names = Object.keys(attributes);
                        var namesLength = names.length;
                        for (var m = 0; m < namesLength; m++) {
                            var name_3 = names[m];
                            var value = attributes[name_3];
                            var index = name_3.indexOf(".");
                            if (index != -1) {
                                var key = name_3.substring(0, index);
                                key = this.formatKey(key, value);
                                var bindingValue = this.formatBinding(key, value, node);
                                if (!bindingValue) {
                                    value = this.formatValue(key, value, node);
                                    if (!value) {
                                        continue;
                                    }
                                }
                                stateName = name_3.substr(index + 1);
                                states = this.getStateByName(stateName, node);
                                var l = states.length;
                                if (l > 0) {
                                    for (var j = 0; j < l; j++) {
                                        state = states[j];
                                        if (bindingValue) {
                                            state.addOverride(new sys.EXSetStateProperty(id, key, bindingValue.templates, bindingValue.chainIndex));
                                        }
                                        else {
                                            state.addOverride(new sys.EXSetProperty(id, key, value));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            /**
             * @private
             * 检查指定的ID是否创建了类成员变量，若没创建则为其创建。
             */
            EXMLParser.prototype.checkIdForState = function (node) {
                if (!node || this.currentClass.getVariableByName(node.attributes.id)) {
                    return;
                }
                this.createVarForNode(node);
                var id = node.attributes.id;
                var funcName = id + "_i";
                var func = this.currentClass.getFuncByName(funcName);
                if (!func)
                    return;
                var codeLine = "this." + id + " = t;";
                var cb = func.codeBlock;
                if (!cb)
                    return;
                if (!cb.containsCodeLine(codeLine)) {
                    cb.addCodeLineAt(codeLine, 1);
                }
            };
            /**
             * @private
             * 通过视图状态名称获取对应的视图状态
             */
            EXMLParser.prototype.getStateByName = function (name, node) {
                var states = [];
                var stateCode = this.stateCode;
                var length = stateCode.length;
                for (var i = 0; i < length; i++) {
                    var state = stateCode[i];
                    if (state.name == name) {
                        if (states.indexOf(state) == -1)
                            states.push(state);
                    }
                    else if (state.stateGroups.length > 0) {
                        var found = false;
                        var len = state.stateGroups.length;
                        for (var j = 0; j < len; j++) {
                            var g = state.stateGroups[j];
                            if (g == name) {
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            if (states.indexOf(state) == -1)
                                states.push(state);
                        }
                    }
                }
                if (true && states.length == 0) {
                    egret.$error(2006, this.currentClassName, name, toXMLString(node));
                }
                return states;
            };
            /**
             * @private
             * 寻找节点的临近节点ID和位置
             */
            EXMLParser.prototype.findNearNodeId = function (node) {
                var parentNode = node.parent;
                var targetId = "";
                var position;
                var index = -1;
                var preItem;
                var afterItem;
                var found = false;
                var children = parentNode.children;
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var item = children[i];
                    if (this.isProperty(item))
                        continue;
                    if (item == node) {
                        found = true;
                        index = i;
                    }
                    else {
                        if (found && !afterItem && !this.isStateNode(item)) {
                            afterItem = item;
                        }
                    }
                    if (!found && !this.isStateNode(item))
                        preItem = item;
                }
                if (index == 0) {
                    position = 0 /* FIRST */;
                    return { position: position, relativeTo: targetId };
                }
                if (index == length - 1) {
                    position = 1 /* LAST */;
                    return { position: position, relativeTo: targetId };
                }
                if (afterItem) {
                    position = 2 /* BEFORE */;
                    targetId = afterItem.attributes.id;
                    if (targetId) {
                        this.checkIdForState(afterItem);
                        return { position: position, relativeTo: targetId };
                    }
                }
                return { position: 1 /* LAST */, relativeTo: targetId };
            };
            /**
             * @private
             * 获取节点的完整类名，包括模块名
             */
            EXMLParser.prototype.getClassNameOfNode = function (node) {
                var className = sys.exmlConfig.getClassNameById(node.localName, node.namespace);
                if (true && !className) {
                    egret.$error(2003, this.currentClassName, toXMLString(node));
                }
                return className;
            };
            return EXMLParser;
        }());
        sys.EXMLParser = EXMLParser;
        __reflect(EXMLParser.prototype, "eui.sys.EXMLParser");
        if (true) {
            /**
             * 获取重复的ID名
             */
            function getRepeatedIds(xml) {
                var result = [];
                this.repeatedIdMap = {};
                this.getIds(xml, result);
                return result;
            }
            function getIds(xml, result) {
                if (xml.namespace != sys.NS_W && xml.attributes.id) {
                    var id = xml.attributes.id;
                    if (this.repeatedIdMap[id]) {
                        result.push(toXMLString(xml));
                    }
                    else {
                        this.repeatedIdMap[id] = true;
                    }
                }
                var children = xml.children;
                if (children) {
                    var length_23 = children.length;
                    for (var i = 0; i < length_23; i++) {
                        var node = children[i];
                        if (node.nodeType !== 1 || this.isInnerClass(node)) {
                            continue;
                        }
                        this.getIds(node, result);
                    }
                }
            }
            function toXMLString(node) {
                if (!node) {
                    return "";
                }
                var str = "  at <" + node.name;
                var attributes = node.attributes;
                var keys = Object.keys(attributes);
                var length = keys.length;
                for (var i = 0; i < length; i++) {
                    var key = keys[i];
                    var value = attributes[key];
                    if (key == "id" && value.substring(0, 2) == "__") {
                        continue;
                    }
                    str += " " + key + "=\"" + value + "\"";
                }
                if (node.children.length == 0) {
                    str += "/>";
                }
                else {
                    str += ">";
                }
                return str;
            }
            /**
             * 清理声明节点里的状态标志
             */
            function checkDeclarations(declarations, list) {
                if (!declarations) {
                    return;
                }
                var children = declarations.children;
                if (children) {
                    var length_24 = children.length;
                    for (var i = 0; i < length_24; i++) {
                        var node = children[i];
                        if (node.nodeType != 1) {
                            continue;
                        }
                        if (node.attributes.includeIn) {
                            list.push(toXMLString(node));
                        }
                        if (node.attributes.excludeFrom) {
                            list.push(toXMLString(node));
                        }
                        checkDeclarations(node, list);
                    }
                }
            }
            function getPropertyStr(child) {
                var parentStr = toXMLString(child.parent);
                var childStr = toXMLString(child).substring(5);
                return parentStr + "\n      \t" + childStr;
            }
        }
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The ToggleButton component defines a toggle button.
     * Clicking the button toggles it between the up and an down states.
     * If you click the button while it is in the up state,
     * it toggles to the down state. You must click the button again
     * to toggle it back to the up state.
     * <p>You can get or set this state programmatically
     * by using the <code>selected</code> property.</p>
     *
     * @event egret.Event.CHANGE Dispatched when the <code>selected</code> property
     * changes for the ToggleButton control.
     * This event is dispatched only when the
     * user interacts with the control by touching.
     *
     * @state up Button up state
     * @state down Button down state
     * @state disabled Button disabled state
     * @state upAndSelected Up state when the button is selected
     * @state downAndSelected Down state when the button is selected
     * @state disabledAndSelected Disabled state when the button is selected
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ToggleButtonExample.ts
     * @language en_US
     */
    /**
     * ToggleButton 组件定义切换按钮。单击该按钮会在弹起状态和按下状态之间进行切换。
     * 如果在按钮处于弹起状态时单击该按钮，则它会切换到按下状态。必须再次单击该按钮才可将其切换回弹起状态。
     * <p>可以使用 <code>selected</code> 属性以编程方式获取或设置此状态。</p>
     *
     * @event egret.Event.CHANGE ToggleButtonBase 控件的 <code>selected</code> 属性更改时分派。
     * 仅当用户通过触摸与控件交互时，才分派此事件。
     *
     * @state up 按钮弹起状态
     * @state down 按钮按下状态
     * @state disabled 按钮禁用状态
     * @state upAndSelected 按钮选择时的弹起状态
     * @state downAndSelected 按钮选择时的按下状态
     * @state disabledAndSelected 按钮选择时的禁用状态
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ToggleButtonExample.ts
     * @language zh_CN
     */
    var ToggleButton = (function (_super) {
        __extends(ToggleButton, _super);
        function ToggleButton() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * @private
             */
            _this.$selected = false;
            /**
             * @private
             * 是否根据触摸事件自动变换选中状态,默认true。仅框架内使用。
             */
            _this.$autoSelected = true;
            return _this;
        }
        Object.defineProperty(ToggleButton.prototype, "selected", {
            /**
             * Contains <code>true</code> if the button is in the down state,
             * and <code>false</code> if it is in the up state.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 按钮处于按下状态时为 <code>true</code>，而按钮处于弹起状态时为 <code>false</code>。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$selected;
            },
            set: function (value) {
                this.$setSelected(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        ToggleButton.prototype.$setSelected = function (value) {
            value = !!value;
            if (value === this.$selected)
                return false;
            this.$selected = value;
            this.invalidateState();
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selected");
            return true;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ToggleButton.prototype.getCurrentState = function () {
            var state = _super.prototype.getCurrentState.call(this);
            if (!this.$selected) {
                return state;
            }
            else {
                var selectedState = state + "AndSelected";
                var skin = this.skin;
                if (skin && skin.hasState(selectedState)) {
                    return selectedState;
                }
                return state == "disabled" ? "disabled" : "down";
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ToggleButton.prototype.buttonReleased = function () {
            if (!this.$autoSelected)
                return;
            this.selected = !this.$selected;
            this.dispatchEventWith(egret.Event.CHANGE);
        };
        return ToggleButton;
    }(eui.Button));
    eui.ToggleButton = ToggleButton;
    __reflect(ToggleButton.prototype, "eui.ToggleButton");
    eui.registerBindable(ToggleButton.prototype, "selected");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * Linear layout base class, usually as the parent class of
     * <code>HorizontalLayout</code> and <code>VerticalLayout</code>.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 线性布局基类，通常作为 <code>HorizontalLayout</code> 和 <code>VerticalLayout</code> 的父类。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var LinearLayoutBase = (function (_super) {
        __extends(LinearLayoutBase, _super);
        function LinearLayoutBase() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * @private
             */
            _this.$horizontalAlign = "left";
            /**
             * @private
             */
            _this.$verticalAlign = "top";
            /**
             * @private
             */
            _this.$gap = 6;
            /**
             * @private
             */
            _this.$paddingLeft = 0;
            /**
             * @private
             */
            _this.$paddingRight = 0;
            /**
             * @private
             */
            _this.$paddingTop = 0;
            /**
             * @private
             */
            _this.$paddingBottom = 0;
            /**
             * An Array of the virtual layout elements size cache.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 虚拟布局使用的尺寸缓存。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.elementSizeTable = [];
            /**
             * The first element index in the view of the virtual layout
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 虚拟布局使用的当前视图中的第一个元素索引
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.startIndex = -1;
            /**
             * The last element index in the view of the virtual layout
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 虚拟布局使用的当前视图中的最后一个元素的索引
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.endIndex = -1;
            /**
             * A Flag of the first element and the end element has been calculated.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 视图的第一个和最后一个元素的索引值已经计算好的标志
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.indexInViewCalculated = false;
            /**
             * The maximum size of elements
             *
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 子元素最大的尺寸
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.maxElementSize = 0;
            return _this;
        }
        Object.defineProperty(LinearLayoutBase.prototype, "horizontalAlign", {
            /**
             * The horizontal alignment of layout elements.
             * <p>The <code>egret.HorizontalAlign</code> and <code>eui.JustifyAlign</code> class
             * defines the possible values for this property.</p>
             *
             * @default "left"
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 布局元素的水平对齐策略。
             * <p><code>egret.HorizontalAlign</code> 和
             * <code>eui.JustifyAlign</code>类定义此属性的可能值。<p>
             *
             * @default "left"
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$horizontalAlign;
            },
            set: function (value) {
                if (this.$horizontalAlign == value)
                    return;
                this.$horizontalAlign = value;
                if (this.$target)
                    this.$target.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearLayoutBase.prototype, "verticalAlign", {
            /**
             * The vertical alignment of layout elements.
             * <p>The <code>egret.VerticalAlign</code> and <code>eui.JustifyAlign</code> class
             * defines the possible values for this property.</p>
             *
             * @default "top"
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 布局元素的垂直对齐策略。请使用 VerticalAlign 定义的常量。
             * <p><code>egret.VerticalAlign</code> 和
             * <code>eui.JustifyAlign</code>类定义此属性的可能值。<p>
             *
             * @default "top"
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$verticalAlign;
            },
            set: function (value) {
                if (this.$verticalAlign == value)
                    return;
                this.$verticalAlign = value;
                if (this.$target)
                    this.$target.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearLayoutBase.prototype, "gap", {
            /**
             * The space between layout elements, in pixels.
             *
             * @default 6
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 布局元素之间的间隔（以像素为单位）。
             *
             * @default 6
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$gap;
            },
            set: function (value) {
                value = +value || 0;
                if (this.$gap === value)
                    return;
                this.$gap = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearLayoutBase.prototype, "paddingLeft", {
            /**
             * Number of pixels between the container's left edge
             * and the left edge of the first layout element.
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 容器的左边缘与第一个布局元素的左边缘之间的像素数。
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$paddingLeft;
            },
            set: function (value) {
                value = +value || 0;
                if (this.$paddingLeft === value)
                    return;
                this.$paddingLeft = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearLayoutBase.prototype, "paddingRight", {
            /**
             * Number of pixels between the container's right edge
             * and the right edge of the last layout element.
             *
             *  @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 容器的右边缘与最后一个布局元素的右边缘之间的像素数。
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$paddingRight;
            },
            set: function (value) {
                value = +value || 0;
                if (this.$paddingRight === value)
                    return;
                this.$paddingRight = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearLayoutBase.prototype, "paddingTop", {
            /**
             * The minimum number of pixels between the container's top edge and
             * the top of all the container's layout elements.
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 容器的顶边缘与所有容器的布局元素的顶边缘之间的最少像素数。
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$paddingTop;
            },
            set: function (value) {
                value = +value || 0;
                if (this.$paddingTop === value)
                    return;
                this.$paddingTop = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LinearLayoutBase.prototype, "paddingBottom", {
            /**
             * The minimum number of pixels between the container's bottom edge and
             * the bottom of all the container's layout elements.
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 容器的底边缘与所有容器的布局元素的底边缘之间的最少像素数。
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$paddingBottom;
            },
            set: function (value) {
                value = +value || 0;
                if (this.$paddingBottom === value)
                    return;
                this.$paddingBottom = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Convenience function for subclasses that invalidates the
         * target's size and displayList so that both layout's <code>measure()</code>
         * and <code>updateDisplayList</code> methods get called.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 失效目标容器的尺寸和显示列表的简便方法，调用目标容器的
         * <code>measure()</code>和<code>updateDisplayList</code>方法
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.invalidateTargetLayout = function () {
            var target = this.$target;
            if (target) {
                target.invalidateSize();
                target.invalidateDisplayList();
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        LinearLayoutBase.prototype.measure = function () {
            if (!this.$target)
                return;
            if (this.$useVirtualLayout) {
                this.measureVirtual();
            }
            else {
                this.measureReal();
            }
        };
        /**
         * Compute exact values for measuredWidth and measuredHeight.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 计算目标容器 measuredWidth 和 measuredHeight 的精确值
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.measureReal = function () {
        };
        /**
         * Compute potentially approximate values for measuredWidth and measuredHeight.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 计算目标容器 measuredWidth 和 measuredHeight 的近似值
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.measureVirtual = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        LinearLayoutBase.prototype.updateDisplayList = function (width, height) {
            var target = this.$target;
            if (!target)
                return;
            if (target.numElements == 0) {
                target.setContentSize(Math.ceil(this.$paddingLeft + this.$paddingRight), Math.ceil(this.$paddingTop + this.$paddingBottom));
                return;
            }
            if (this.$useVirtualLayout) {
                this.updateDisplayListVirtual(width, height);
            }
            else {
                this.updateDisplayListReal(width, height);
            }
        };
        /**
         * Gets the starting position of the specified index element
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取指定索引元素的起始位置
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.getStartPosition = function (index) {
            return 0;
        };
        /**
         * Gets the size of the specified index element
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取指定索引元素的尺寸
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.getElementSize = function (index) {
            return 0;
        };
        /**
         * Gets the sum of the size of cached elements
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取缓存的子对象尺寸总和
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.getElementTotalSize = function () {
            return 0;
        };
        /**
         * @inheritDoc
         *
         * @param index
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        LinearLayoutBase.prototype.elementRemoved = function (index) {
            if (!this.$useVirtualLayout)
                return;
            _super.prototype.elementRemoved.call(this, index);
            this.elementSizeTable.splice(index, 1);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        LinearLayoutBase.prototype.clearVirtualLayoutCache = function () {
            if (!this.$useVirtualLayout)
                return;
            this.elementSizeTable = [];
            this.maxElementSize = 0;
        };
        /**
         * The binary search to find the specified index position of the display object
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 折半查找法寻找指定位置的显示对象索引
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.findIndexAt = function (x, i0, i1) {
            var index = ((i0 + i1) * 0.5) | 0;
            var elementX = this.getStartPosition(index);
            var elementWidth = this.getElementSize(index);
            if ((x >= elementX) && (x < elementX + elementWidth + this.$gap))
                return index;
            else if (i0 == i1)
                return -1;
            else if (x < elementX)
                return this.findIndexAt(x, i0, Math.max(i0, index - 1));
            else
                return this.findIndexAt(x, Math.min(index + 1, i1), i1);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        LinearLayoutBase.prototype.scrollPositionChanged = function () {
            _super.prototype.scrollPositionChanged.call(this);
            if (this.$useVirtualLayout) {
                var changed = this.getIndexInView();
                if (changed) {
                    this.indexInViewCalculated = true;
                    this.target.invalidateDisplayList();
                }
            }
        };
        /**
         * Get the index of the first and last element in the view,
         * and to return whether or not to change.
         *
         * @return has the index changed
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取视图中第一个和最后一个元素的索引,返回是否发生改变。
         *
         * @return 索引是否已改变
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.getIndexInView = function () {
            return false;
        };
        /**
         * Update the layout of the virtualized elements
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 更新虚拟布局的显示列表
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.updateDisplayListVirtual = function (width, height) {
        };
        /**
         * Update the layout of the reality elements
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 更新真实布局的显示列表
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.updateDisplayListReal = function (width, height) {
        };
        /**
         * Allocate blank area for each variable size element.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 为每个可变尺寸的子项分配空白区域。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        LinearLayoutBase.prototype.flexChildrenProportionally = function (spaceForChildren, spaceToDistribute, totalPercent, childInfoArray) {
            var numElements = childInfoArray.length;
            var done;
            do {
                done = true;
                var unused = spaceToDistribute -
                    (spaceForChildren * totalPercent / 100);
                if (unused > 0)
                    spaceToDistribute -= unused;
                else
                    unused = 0;
                var spacePerPercent = spaceToDistribute / totalPercent;
                for (var i = 0; i < numElements; i++) {
                    var childInfo = childInfoArray[i];
                    var size = childInfo.percent * spacePerPercent;
                    if (size < childInfo.min) {
                        var min = childInfo.min;
                        childInfo.size = min;
                        childInfoArray[i] = childInfoArray[--numElements];
                        childInfoArray[numElements] = childInfo;
                        totalPercent -= childInfo.percent;
                        if (unused >= min) {
                            unused -= min;
                        }
                        else {
                            spaceToDistribute -= min - unused;
                            unused = 0;
                        }
                        done = false;
                        break;
                    }
                    else if (size > childInfo.max) {
                        var max = childInfo.max;
                        childInfo.size = max;
                        childInfoArray[i] = childInfoArray[--numElements];
                        childInfoArray[numElements] = childInfo;
                        totalPercent -= childInfo.percent;
                        if (unused >= max) {
                            unused -= max;
                        }
                        else {
                            spaceToDistribute -= max - unused;
                            unused = 0;
                        }
                        done = false;
                        break;
                    }
                    else {
                        childInfo.size = size;
                    }
                }
            } while (!done);
        };
        return LinearLayoutBase;
    }(eui.LayoutBase));
    eui.LinearLayoutBase = LinearLayoutBase;
    __reflect(LinearLayoutBase.prototype, "eui.LinearLayoutBase");
})(eui || (eui = {}));
(function (eui) {
    var sys;
    (function (sys) {
        /**
         * @private
         */
        var ChildInfo = (function () {
            function ChildInfo() {
                /**
                 * @private
                 */
                this.layoutElement = null;
                /**
                 * @private
                 */
                this.size = 0;
                /**
                 * @private
                 */
                this.percent = NaN;
                /**
                 * @private
                 */
                this.min = NaN;
                /**
                 * @private
                 */
                this.max = NaN;
            }
            return ChildInfo;
        }());
        sys.ChildInfo = ChildInfo;
        __reflect(ChildInfo.prototype, "eui.sys.ChildInfo");
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The HSlider (horizontal slider) control lets users select a value
     * by moving a slider thumb between the end points of the slider track.
     * The current value of the slider is determined by the relative location of the thumb between
     * the end points of the slider, corresponding to the slider's minimum and maximum values.
     *
     * @includeExample  extension/eui/components/HSliderExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 使用 HSlider（水平滑块）控件，用户可通过在滑块轨道的端点之间移动滑块来选择值。
     * 滑块的当前值由滑块端点（对应于滑块的最小值和最大值）之间滑块的相对位置确定。
     *
     * @includeExample  extension/eui/components/HSliderExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var HSlider = (function (_super) {
        __extends(HSlider, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function HSlider() {
            return _super.call(this) || this;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HSlider.prototype.pointToValue = function (x, y) {
            if (!this.thumb || !this.track)
                return 0;
            var values = this.$Range;
            var range = values[0 /* maximum */] - values[2 /* minimum */];
            var thumbRange = this.getThumbRange();
            return values[2 /* minimum */] + (thumbRange != 0 ? (x / thumbRange) * range : 0);
        };
        /**
         * @private
         *
         * @returns
         */
        HSlider.prototype.getThumbRange = function () {
            var bounds = egret.$TempRectangle;
            this.track.getLayoutBounds(bounds);
            var thumbRange = bounds.width;
            this.thumb.getLayoutBounds(bounds);
            return thumbRange - bounds.width;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HSlider.prototype.updateSkinDisplayList = function () {
            if (!this.thumb || !this.track)
                return;
            var values = this.$Range;
            var thumbRange = this.getThumbRange();
            var range = values[0 /* maximum */] - values[2 /* minimum */];
            var thumbPosTrackX = (range > 0) ? ((this.pendingValue - values[2 /* minimum */]) / range) * thumbRange : 0;
            var thumbPos = this.track.localToGlobal(thumbPosTrackX, 0, egret.$TempPoint);
            var thumbPosX = thumbPos.x;
            var thumbPosY = thumbPos.y;
            var thumbPosParentX = this.thumb.$parent.globalToLocal(thumbPosX, thumbPosY, egret.$TempPoint).x;
            var bounds = egret.$TempRectangle;
            this.thumb.getLayoutBounds(bounds);
            this.thumb.setLayoutBoundsPosition(Math.round(thumbPosParentX), bounds.y);
            if (this.trackHighlight && this.trackHighlight.$parent) {
                var trackHighlightX = this.trackHighlight.$parent.globalToLocal(thumbPosX, thumbPosY, egret.$TempPoint).x - thumbPosTrackX;
                this.trackHighlight.x = Math.round(trackHighlightX);
                this.trackHighlight.width = Math.round(thumbPosTrackX);
            }
        };
        return HSlider;
    }(eui.SliderBase));
    eui.HSlider = HSlider;
    __reflect(HSlider.prototype, "eui.HSlider");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var loaderPool = [];
    var callBackMap = {};
    var loaderMap = {};
    /**
     * Default instance of interface <code>IAssetAdapter</code>.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/supportClasses/DefaultAssetAdapterExample.ts
     * @language en_US
     */
    /**
     * 默认的IAssetAdapter接口实现。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/supportClasses/DefaultAssetAdapterExample.ts
     * @language zh_CN
     */
    var DefaultAssetAdapter = (function () {
        function DefaultAssetAdapter() {
        }
        /**
         * resolve asset.
         * @param source the identifier of new asset need to be resolved
         * @param callBack callback function when resolving complete
         * example：callBack(content:any,source:string):void;
         * @param thisObject <code>this</code> object of callback method
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 解析素材
         * @param source 待解析的新素材标识符
         * @param callBack 解析完成回调函数，示例：callBack(content:any,source:string):void;
         * @param thisObject callBack的 this 引用
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        DefaultAssetAdapter.prototype.getAsset = function (source, callBack, thisObject) {
            var list = callBackMap[source];
            if (list) {
                list.push([callBack, thisObject]);
                return;
            }
            var loader = loaderPool.pop();
            if (!loader) {
                loader = new egret.ImageLoader();
            }
            callBackMap[source] = [[callBack, thisObject]];
            loaderMap[loader.$hashCode] = source;
            loader.addEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            loader.load(source);
        };
        /**
         * @private
         *
         * @param event
         */
        DefaultAssetAdapter.prototype.onLoadFinish = function (event) {
            var loader = event.currentTarget;
            loader.removeEventListener(egret.Event.COMPLETE, this.onLoadFinish, this);
            loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onLoadFinish, this);
            var data;
            if (event.$type == egret.Event.COMPLETE) {
                data = new egret.Texture();
                data._setBitmapData(loader.data);
                loader.data = null;
            }
            loaderPool.push(loader);
            var source = loaderMap[loader.$hashCode];
            delete loaderMap[loader.$hashCode];
            var list = callBackMap[source];
            delete callBackMap[source];
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var arr = list[i];
                arr[0].call(arr[1], data, source);
            }
        };
        return DefaultAssetAdapter;
    }());
    eui.DefaultAssetAdapter = DefaultAssetAdapter;
    __reflect(DefaultAssetAdapter.prototype, "eui.DefaultAssetAdapter", ["eui.IAssetAdapter"]);
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
/// <reference path="supportClasses/DefaultAssetAdapter.ts" />
var eui;
(function (eui) {
    /**
     * The Image control lets you show JPEG, PNG, and GIF files
     * at runtime. Image inherit Bitmap，so you can set the <code>bitmapData</code> property
     * to show the data. you can also set the <code>source</code> property, Image will auto load
     * and show the url image or the bitmapData.
     *
     * @event egret.Event.COMPLETE Dispatched when the image loaded complete.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ImageExample.ts
     * @language en_US
     */
    /**
     * Image 控件允许您在运行时显示 JPEG、PNG 等图片文件文件。Image 继承至 Bitmap，因此您可以直接对其 bitmapData 属性，
     * 赋值从外部加载得到的位图数据以显示对应图片。同时，Image 还提供了更加方便的 source 属性，source 属性可以接受一个网络图片url作为值，
     * 赋值为url后，它内部会自动去加载并显示图片。并且您同样也可以直接把 BitmapData 对象赋值给 source 属性以显示图片。
     *
     * @event egret.Event.COMPLETE 当图片加载完成后调度
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ImageExample.ts
     * @language zh_CN
     */
    var Image = (function (_super) {
        __extends(Image, _super);
        /**
         * Constructor.
         *
         * @param source The source used for the bitmap fill. the value can be
         * a string or an instance of <code>egret.Texture</code>
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @param source 用于位图填充的源。可以是一个字符串或者 <code>egret.Texture</code> 对象
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Image(source) {
            var _this = _super.call(this) || this;
            //endif*/
            /**
             * @private
             */
            _this.sourceChanged = false;
            /**
             * @private
             */
            _this._source = null;
            _this.initializeUIValues();
            if (source) {
                _this.source = source;
            }
            return _this;
        }
        Object.defineProperty(Image.prototype, "scale9Grid", {
            /**
             * Represent a Rectangle Area that the 9 scale area of Image.
             * Notice: This property is valid only when <code>fillMode</code>
             * is <code>BitmapFillMode.SCALE</code>.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 矩形区域，它定义素材对象的九个缩放区域。
             * 注意:此属性仅在<code>fillMode</code>为<code>BitmapFillMode.SCALE</code>时有效。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$scale9Grid;
            },
            set: function (value) {
                this.$setScale9Grid(value);
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Image.prototype, "fillMode", {
            /**
             * Determines how the bitmap fills in the dimensions.
             * <p>When set to <code>BitmapFillMode.CLIP</code>, the bitmap
             * ends at the edge of the region.</p>
             * <p>When set to <code>BitmapFillMode.REPEAT</code>, the bitmap
             * repeats to fill the region.</p>
             * <p>When set to <code>BitmapFillMode.SCALE</code>, the bitmap
             * stretches to fill the region.</p>
             *
             * @default <code>BitmapFillMode.SCALE</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 确定位图填充尺寸的方式。
             * <p>设置为 <code>BitmapFillMode.CLIP</code>时，位图将在边缘处被截断。</p>
             * <p>设置为 <code>BitmapFillMode.REPEAT</code>时，位图将重复以填充区域。</p>
             * <p>设置为 <code>BitmapFillMode.SCALE</code>时，位图将拉伸以填充区域。</p>
             *
             * @default <code>BitmapFillMode.SCALE</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$fillMode;
            },
            set: function (value) {
                if (value == this.$fillMode) {
                    return;
                }
                this.$fillMode = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        //if egret
        Image.prototype.$setFillMode = function (value) {
            var result = _super.prototype.$setFillMode.call(this, value);
            this.invalidateDisplayList();
            return result;
        };
        Object.defineProperty(Image.prototype, "source", {
            /**
             * The source used for the bitmap fill. the value can be
             * a string or an instance of <code>egret.Texture</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 用于位图填充的源。可以是一个字符串或者 <code>egret.Texture</code> 对象
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._source;
            },
            set: function (value) {
                if (value == this._source) {
                    return;
                }
                this._source = value;
                if (this.$stage) {
                    this.parseSource();
                }
                else {
                    this.sourceChanged = true;
                    this.invalidateProperties();
                }
            },
            enumerable: true,
            configurable: true
        });
        Image.prototype.$setTexture = function (value) {
            if (value == this.$texture) {
                return false;
            }
            var result = _super.prototype.$setTexture.call(this, value);
            this.sourceChanged = false;
            this.invalidateSize();
            this.invalidateDisplayList();
            return result;
        };
        /**
         * @private
         * 解析source
         */
        Image.prototype.parseSource = function () {
            var _this = this;
            this.sourceChanged = false;
            var source = this._source;
            if (source && typeof source == "string") {
                eui.getAssets(this._source, function (data) {
                    if (source !== _this._source)
                        return;
                    if (!egret.is(data, "egret.Texture")) {
                        return;
                    }
                    _this.$setTexture(data);
                    if (data) {
                        _this.dispatchEventWith(egret.Event.COMPLETE);
                    }
                    else if (true) {
                        egret.$warn(2301, source);
                    }
                });
            }
            else {
                this.$setTexture(source);
            }
        };
        Image.prototype.$measureContentBounds = function (bounds) {
            var image = this.$texture;
            if (image) {
                var uiValues = this.$UIComponent;
                var width = uiValues[10 /* width */];
                var height = uiValues[11 /* height */];
                if (isNaN(width) || isNaN(height)) {
                    bounds.setEmpty();
                    return;
                }
                if (this.$fillMode == "clip") {
                    if (width > image.$getTextureWidth()) {
                        width = image.$getTextureWidth();
                    }
                    if (height > image.$getTextureHeight()) {
                        height = image.$getTextureHeight();
                    }
                }
                bounds.setTo(0, 0, width, height);
            }
            else {
                bounds.setEmpty();
            }
        };
        /**
         * @copy eui.UIComponent#createChildren
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.createChildren = function () {
            if (this.sourceChanged) {
                this.parseSource();
            }
        };
        /**
         * @private
         * 设置组件的宽高。此方法不同于直接设置width,height属性，
         * 不会影响显式标记尺寸属性
         */
        Image.prototype.setActualSize = function (w, h) {
            eui.sys.UIComponentImpl.prototype["setActualSize"].call(this, w, h);
            _super.prototype.$setWidth.call(this, w);
            _super.prototype.$setHeight.call(this, h);
        };
        /**
         * @copy eui.UIComponent#childrenCreated
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.childrenCreated = function () {
        };
        /**
         * @copy eui.UIComponent#commitProperties
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.commitProperties = function () {
            eui.sys.UIComponentImpl.prototype["commitProperties"].call(this);
            if (this.sourceChanged) {
                this.parseSource();
            }
        };
        /**
         * @copy eui.UIComponent#measure
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.measure = function () {
            var texture = this.$texture;
            if (texture) {
                this.setMeasuredSize(texture.$getTextureWidth(), texture.$getTextureHeight());
            }
            else {
                this.setMeasuredSize(0, 0);
            }
        };
        /**
         * @copy eui.UIComponent#updateDisplayList
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            this.$renderDirty = true;
        };
        /**
         * @copy eui.UIComponent#invalidateParentLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.invalidateParentLayout = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.setMeasuredSize = function (width, height) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.invalidateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.validateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.invalidateSize = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.validateSize = function (recursive) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.invalidateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.validateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.validateNow = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.setLayoutBoundsSize = function (layoutWidth, layoutHeight) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.setLayoutBoundsPosition = function (x, y) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.getLayoutBounds = function (bounds) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Image.prototype.getPreferredBounds = function (bounds) {
        };
        return Image;
    }(egret.Bitmap));
    eui.Image = Image;
    __reflect(Image.prototype, "eui.Image", ["eui.UIComponent", "egret.DisplayObject"]);
    eui.sys.implementUIComponent(Image, egret.Bitmap);
    eui.registerProperty(Image, "scale9Grid", "egret.Rectangle");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
/// <reference path="../utils/registerBindable.ts" />
var eui;
(function (eui) {
    /**
     * The ItemRenderer class is the base class for item renderers.
     *
     * @state up Up state
     * @state down Down state
     * @state upAndSelected Up state when the button is selected
     * @state downAndSelected Down state when the button is selected
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ItemRendererExample.ts
     * @language en_US
     */
    /**
     * ItemRenderer 类是项呈示器的基类。
     *
     * @state up 弹起状态
     * @state down 按下状态
     * @state upAndSelected 选择时的弹起状态
     * @state downAndSelected 选择时的按下状态
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ItemRendererExample.ts
     * @language zh_CN
     */
    var ItemRenderer = (function (_super) {
        __extends(ItemRenderer, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function ItemRenderer() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this._data = null;
            /**
             * @private
             */
            _this._selected = false;
            /**
             * The index of the item in the data provider
             * of the host component of the item renderer.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 项呈示器的数据提供程序中的项目索引。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.itemIndex = -1;
            /**
             * @private
             * 指示第一次分派 TouchEvent.TOUCH_BEGIN 时，触摸点是否在按钮上。
             */
            _this.touchCaptured = false;
            _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onTouchBegin, _this);
            return _this;
        }
        Object.defineProperty(ItemRenderer.prototype, "data", {
            /**
             * The data to render or edit.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要呈示或编辑的数据。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "data");
                this.dataChanged();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Update the view when the <code>data</code> property changes.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当数据改变时，更新视图。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ItemRenderer.prototype.dataChanged = function () {
        };
        Object.defineProperty(ItemRenderer.prototype, "selected", {
            /**
             * Contains <code>true</code> if the item renderer
             * can show itself as selected.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 如果项呈示器可以将其自身显示为已选中，则为 true。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._selected;
            },
            set: function (value) {
                if (this._selected == value)
                    return;
                this._selected = value;
                this.invalidateState();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Dispatched when an event of some kind occurred that canceled the touch.
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 由于某个事件取消了触摸时触发
         * @version Egret 3.0.1
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ItemRenderer.prototype.onTouchCancle = function (event) {
            this.touchCaptured = false;
            var stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.invalidateState();
        };
        /**
         * Handles <code>TouchEvent.TOUCH_BEGIN</code> events
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 触碰开始时触发事件
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ItemRenderer.prototype.onTouchBegin = function (event) {
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = true;
            this.invalidateState();
            event.updateAfterEvent();
        };
        /**
         * @private
         * 舞台上触摸弹起事件
         */
        ItemRenderer.prototype.onStageTouchEnd = function (event) {
            var stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancle, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onStageTouchEnd, this);
            this.touchCaptured = false;
            this.invalidateState();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ItemRenderer.prototype.getCurrentState = function () {
            var state = "up";
            if (!this.enabled) {
                state = "disabled";
            }
            if (this.touchCaptured) {
                state = "down";
            }
            if (this._selected) {
                var selectedState = state + "AndSelected";
                var skin = this.skin;
                if (skin && skin.hasState(selectedState)) {
                    return selectedState;
                }
                return state == "disabled" ? "disabled" : "down";
            }
            return state;
        };
        return ItemRenderer;
    }(eui.Component));
    eui.ItemRenderer = ItemRenderer;
    __reflect(ItemRenderer.prototype, "eui.ItemRenderer", ["eui.IItemRenderer"]);
    eui.registerBindable(ItemRenderer.prototype, "data");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var UIImpl = eui.sys.UIComponentImpl;
    /**
     * Label is an UIComponent that can render one or more lines of text.
     * The text to be displayed is determined by the <code>text</code> property.
     * The formatting of the text is specified by the styles，
     * such as <code>fontFamily</code> and <code>size</code>.
     *
     * <p>Because Label is fast and lightweight, it is especially suitable
     * for use cases that involve rendering many small pieces of non-interactive
     * text, such as item renderers and labels in Button skins.</p>
     *
     * <p>In Label, three character sequences are recognized
     * as explicit line breaks: CR (<code>"\r"</code>), LF (<code>"\n"</code>),
     * and CR+LF (<code>"\r\n"</code>).</p>
     *
     * <p>If you don't specify any kind of width for a Label,
     * then the longest line, as determined by these explicit line breaks,
     * determines the width of the Label.</p>
     *
     * <p>If you do specify some kind of width, then the specified text is
     * word-wrapped at the right edge of the component's bounds.
     * If the text extends below the bottom of the component,
     * it is clipped.</p>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/LabelExample.ts
     * @language en_US
     */
    /**
     * Label 是可以呈示一行或多行统一格式文本的UI组件。要显示的文本由 text 属性确定。文本格式由样式属性指定，例如 fontFamily 和 size。
     * 因为 Label 运行速度快且占用内存少，所以它特别适合用于显示多个小型非交互式文本的情况，例如，项呈示器和 Button 外观中的标签。
     * 在 Label 中，将以下三个字符序列识别为显式换行符：CR（“\r”）、LF（“\n”）和 CR+LF（“\r\n”）。
     * 如果没有为 Label 指定宽度，则由这些显式换行符确定的最长行确定 Label 的宽度。
     * 如果指定了宽度，则指定文本将在组件边界的右边缘换行，如果文本扩展到低于组件底部，则将被剪切。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/LabelExample.ts
     * @language zh_CN
     */
    var Label = (function (_super) {
        __extends(Label, _super);
        /**
         * Constructor.
         *
         * @param text The text displayed by this text component.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @param text 此文本组件所显示的文本。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Label(text) {
            var _this = _super.call(this) || this;
            /**
             * style中属性是否允许被赋值，当主动赋值过属性之后将不允许被赋值
             */
            _this.$styleSetMap = {
                "fontFamily": true,
                "size": true,
                "bold": true,
                "italic": true,
                "textAlign": true,
                "verticalAlign": true,
                "lineSpacing": true,
                "textColor": true,
                "wordWrap": true,
                "displayAsPassword": true,
                "strokeColor": true,
                "stroke": true,
                "maxChars": true,
                "multiline": true,
                "border": true,
                "borderColor": true,
                "background": true,
                "backgroundColor": true
            };
            _this.$revertStyle = {};
            _this.$style = null;
            _this.$changeFromStyle = false;
            /**
             * @private
             */
            _this._widthConstraint = NaN;
            _this.initializeUIValues();
            _this.text = text;
            return _this;
        }
        Object.defineProperty(Label.prototype, "style", {
            /**
             * The style of text.
             * @version Egret 3.2.1
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 文本样式。
             * @version Egret 3.2.1
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$style;
            },
            set: function (value) {
                this.$setStyle(value);
            },
            enumerable: true,
            configurable: true
        });
        Label.prototype.$setStyle = function (value) {
            if (this.$style == value) {
                return;
            }
            this.$style = value;
            var theme = egret.getImplementation("eui.Theme");
            if (theme) {
                this.$changeFromStyle = true;
                for (var key in this.$revertStyle) {
                    this[key] = this.$revertStyle[key];
                }
                this.$revertStyle = {};
                if (value == null) {
                    this.$changeFromStyle = false;
                    return;
                }
                var styleList = value.split(",");
                for (var i = 0; i < styleList.length; i++) {
                    var config = theme.$getStyleConfig(styleList[i]);
                    if (config) {
                        for (var key in config) {
                            if (this.$styleSetMap[key]) {
                                var revertValue = this[key];
                                this[key] = config[key];
                                this.$revertStyle[key] = revertValue;
                            }
                        }
                    }
                }
                this.$changeFromStyle = false;
            }
        };
        Label.prototype.$setFontFamily = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["fontFanily"];
                this.$styleSetMap["fontFanily"] = false;
            }
            return _super.prototype.$setFontFamily.call(this, value);
        };
        Label.prototype.$setSize = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["size"];
                this.$styleSetMap["size"] = false;
            }
            return _super.prototype.$setSize.call(this, value);
        };
        Label.prototype.$setBold = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["bold"];
                this.$styleSetMap["bold"] = false;
            }
            return _super.prototype.$setBold.call(this, value);
        };
        Label.prototype.$setItalic = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["italic"];
                this.$styleSetMap["italic"] = false;
            }
            return _super.prototype.$setItalic.call(this, value);
        };
        Label.prototype.$setTextAlign = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["textAlign"];
                this.$styleSetMap["textAlign"] = false;
            }
            return _super.prototype.$setTextAlign.call(this, value);
        };
        Label.prototype.$setVerticalAlign = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["verticalAlign"];
                this.$styleSetMap["verticalAlign"] = false;
            }
            return _super.prototype.$setVerticalAlign.call(this, value);
        };
        Label.prototype.$setLineSpacing = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["lineSpacing"];
                this.$styleSetMap["lineSpacing"] = false;
            }
            return _super.prototype.$setLineSpacing.call(this, value);
        };
        Label.prototype.$setTextColor = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["textColor"];
                this.$styleSetMap["textColor"] = false;
            }
            return _super.prototype.$setTextColor.call(this, value);
        };
        Label.prototype.$setWordWrap = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["wordWrap"];
                this.$styleSetMap["wordWrap"] = false;
            }
            _super.prototype.$setWordWrap.call(this, value);
        };
        Label.prototype.$setDisplayAsPassword = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["displayAsPassword"];
                this.$styleSetMap["displayAsPassword"] = false;
            }
            return _super.prototype.$setDisplayAsPassword.call(this, value);
        };
        Label.prototype.$setStrokeColor = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["strokeColor"];
                this.$styleSetMap["strokeColor"] = false;
            }
            return _super.prototype.$setStrokeColor.call(this, value);
        };
        Label.prototype.$setStroke = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["stroke"];
                this.$styleSetMap["stroke"] = false;
            }
            return _super.prototype.$setStroke.call(this, value);
        };
        Label.prototype.$setMaxChars = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["maxChars"];
                this.$styleSetMap["maxChars"] = false;
            }
            return _super.prototype.$setMaxChars.call(this, value);
        };
        Label.prototype.$setMultiline = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["multiline"];
                this.$styleSetMap["multiline"] = false;
            }
            return _super.prototype.$setMultiline.call(this, value);
        };
        Label.prototype.$setBorder = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["border"];
                this.$styleSetMap["border"] = false;
            }
            _super.prototype.$setBorder.call(this, value);
        };
        Label.prototype.$setBorderColor = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["borderColor"];
                this.$styleSetMap["borderColor"] = false;
            }
            _super.prototype.$setBorderColor.call(this, value);
        };
        Label.prototype.$setBackground = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["background"];
                this.$styleSetMap["background"] = false;
            }
            _super.prototype.$setBackground.call(this, value);
        };
        Label.prototype.$setBackgroundColor = function (value) {
            if (!this.$changeFromStyle) {
                delete this.$revertStyle["backgroundColor"];
                this.$styleSetMap["backgroundColor"] = false;
            }
            _super.prototype.$setBackgroundColor.call(this, value);
        };
        /**
         * @private
         *
         */
        Label.prototype.$invalidateTextField = function () {
            _super.prototype.$invalidateTextField.call(this);
            this.invalidateSize();
        };
        /**
         * @private
         *
         * @param value
         */
        Label.prototype.$setWidth = function (value) {
            var result1 = _super.prototype.$setWidth.call(this, value);
            var result2 = UIImpl.prototype.$setWidth.call(this, value);
            return result1 && result2;
        };
        /**
         * @private
         *
         * @param value
         */
        Label.prototype.$setHeight = function (value) {
            var result1 = _super.prototype.$setHeight.call(this, value);
            var result2 = UIImpl.prototype.$setHeight.call(this, value);
            return result1 && result2;
        };
        /**
         * @private
         *
         * @param value
         */
        Label.prototype.$setText = function (value) {
            var result = _super.prototype.$setText.call(this, value);
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "text");
            return result;
        };
        /**
         * @copy eui.UIComponent#createChildren
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.createChildren = function () {
        };
        /**
         * @copy eui.UIComponent#childrenCreated
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.childrenCreated = function () {
        };
        /**
         * @copy eui.UIComponent#commitProperties
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.commitProperties = function () {
        };
        /**
         * @copy eui.UIComponent#measure
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.measure = function () {
            var values = this.$UIComponent;
            var textValues = this.$TextField;
            var oldWidth = textValues[3 /* textFieldWidth */];
            var availableWidth = NaN;
            if (!isNaN(this._widthConstraint)) {
                availableWidth = this._widthConstraint;
                this._widthConstraint = NaN;
            }
            else if (!isNaN(values[8 /* explicitWidth */])) {
                availableWidth = values[8 /* explicitWidth */];
            }
            else if (values[13 /* maxWidth */] != 100000) {
                availableWidth = values[13 /* maxWidth */];
            }
            _super.prototype.$setWidth.call(this, availableWidth);
            this.setMeasuredSize(this.textWidth, this.textHeight);
            _super.prototype.$setWidth.call(this, oldWidth);
        };
        /**
         * @copy eui.UIComponent#updateDisplayList
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            _super.prototype.$setWidth.call(this, unscaledWidth);
            _super.prototype.$setHeight.call(this, unscaledHeight);
        };
        /**
         * @copy eui.UIComponent#invalidateParentLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.invalidateParentLayout = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.setMeasuredSize = function (width, height) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.invalidateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.validateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.invalidateSize = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.validateSize = function (recursive) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.invalidateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.validateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.validateNow = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.setLayoutBoundsSize = function (layoutWidth, layoutHeight) {
            UIImpl.prototype.setLayoutBoundsSize.call(this, layoutWidth, layoutHeight);
            if (isNaN(layoutWidth) || layoutWidth === this._widthConstraint || layoutWidth == 0) {
                this._widthConstraint = layoutWidth;
                return;
            }
            this._widthConstraint = layoutWidth;
            var values = this.$UIComponent;
            if (!isNaN(values[9 /* explicitHeight */])) {
                return;
            }
            if (layoutWidth == values[16 /* measuredWidth */]) {
                return;
            }
            this.invalidateSize();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.setLayoutBoundsPosition = function (x, y) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.getLayoutBounds = function (bounds) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Label.prototype.getPreferredBounds = function (bounds) {
        };
        return Label;
    }(egret.TextField));
    eui.Label = Label;
    __reflect(Label.prototype, "eui.Label", ["eui.UIComponent", "egret.DisplayObject", "eui.IDisplayText"]);
    eui.sys.implementUIComponent(Label, egret.TextField);
    eui.registerBindable(Label.prototype, "text");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The List control displays a vertical or horizontal list of items.
     * The user can select one or more items from the list, depending
     * on the value of the <code>allowMultipleSelection</code> property.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ListExample.ts
     * @language en_US
     */
    /**
     * List 控件可显示垂直或水平的项目列表。用户可以根据 <code>allowMultipleSelection</code> 属性的值从列表中选择一个或多个项目。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ListExample.ts
     * @language zh_CN
     */
    var List = (function (_super) {
        __extends(List, _super);
        function List() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * whether are allowed to multiple selection.
             * If <code>true</code> tap an unselected item will be selected,
             * and tap the item again will cancel selection.
             *
             * @default false
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 是否允许同时选中多项,设置为 <code>true</code> 时，触摸按下未选中的项呈示器，将会设置该项选中，再次按下将会取消选中。
             * 可以设置多项为选中状态。
             *
             * @default false
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.allowMultipleSelection = false;
            /**
             * @private
             */
            _this._selectedIndices = [];
            /**
             * @private
             * 是否是有效的索引
             */
            _this.isValidIndex = function (item, index, v) {
                return _this.$dataProvider && (item >= 0) && (item < _this.$dataProvider.length) && item % 1 == 0;
            };
            return _this;
        }
        Object.defineProperty(List.prototype, "selectedIndices", {
            /**
             * An Array of numbers representing the indices of the currently selected
             * item or items.
             *
             * @default []
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 当前选中的一个或多个项目的索引列表。
             *
             * @default []
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                if (this._proposedSelectedIndices)
                    return this._proposedSelectedIndices;
                return this._selectedIndices;
            },
            set: function (value) {
                this.setSelectedIndices(value, false);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "selectedIndex", {
            /**
             * @inheritDoc
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (this._proposedSelectedIndices) {
                    if (this._proposedSelectedIndices.length > 0)
                        return this._proposedSelectedIndices[0];
                    return -1;
                }
                return this.$getSelectedIndex();
            },
            set: function (value) {
                this.setSelectedIndex(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(List.prototype, "selectedItems", {
            /**
             * An Array representing the currently selected data items.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 表示当前选定数据项的列表
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                var result = [];
                var list = this.selectedIndices;
                if (list) {
                    var count = list.length;
                    for (var i = 0; i < count; i++) {
                        result[i] = this.$dataProvider.getItemAt(list[i]);
                    }
                }
                return result;
            },
            set: function (value) {
                var indices = [];
                if (value) {
                    var count = value.length;
                    for (var i = 0; i < count; i++) {
                        var index = this.$dataProvider.getItemIndex(value[i]);
                        if (index != -1) {
                            indices.splice(0, 0, index);
                        }
                        if (index == -1) {
                            indices = [];
                            break;
                        }
                    }
                }
                this.setSelectedIndices(indices, false);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Specify whether the selectedIndices changed programmatically or due to
         * user interaction.
         *
         * @param value An array of numbers representing the indices of the selected
         * @param dispatchChangeEvent whether dispatched a change event.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置多个选中项。
         *
         * @param value 选中项索引的数组
         * @param dispatchChangeEvent 是否派发changed事件
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        List.prototype.setSelectedIndices = function (value, dispatchChangeEvent) {
            var values = this.$ListBase;
            if (dispatchChangeEvent)
                values[4 /* dispatchChangeAfterSelection */] =
                    (values[4 /* dispatchChangeAfterSelection */] || dispatchChangeEvent);
            if (value)
                this._proposedSelectedIndices = value;
            else
                this._proposedSelectedIndices = [];
            this.invalidateProperties();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        List.prototype.commitProperties = function () {
            _super.prototype.commitProperties.call(this);
            if (this._proposedSelectedIndices) {
                this.commitSelection();
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        List.prototype.commitSelection = function (dispatchChangedEvents) {
            if (dispatchChangedEvents === void 0) { dispatchChangedEvents = true; }
            var values = this.$ListBase;
            var oldSelectedIndex = values[3 /* selectedIndex */];
            if (this._proposedSelectedIndices) {
                this._proposedSelectedIndices = this._proposedSelectedIndices.filter(this.isValidIndex);
                if (!this.allowMultipleSelection && this._proposedSelectedIndices.length > 0) {
                    var temp = [];
                    temp.push(this._proposedSelectedIndices[0]);
                    this._proposedSelectedIndices = temp;
                }
                if (this._proposedSelectedIndices.length > 0) {
                    values[2 /* proposedSelectedIndex */] = this._proposedSelectedIndices[0];
                }
                else {
                    values[2 /* proposedSelectedIndex */] = -1;
                }
            }
            var retVal = _super.prototype.commitSelection.call(this, false);
            if (!retVal) {
                this._proposedSelectedIndices = null;
                return false;
            }
            var selectedIndex = this.$getSelectedIndex();
            if (selectedIndex > eui.ListBase.NO_SELECTION) {
                if (this._proposedSelectedIndices) {
                    if (this._proposedSelectedIndices.indexOf(selectedIndex) == -1)
                        this._proposedSelectedIndices.push(selectedIndex);
                }
                else {
                    this._proposedSelectedIndices = [selectedIndex];
                }
            }
            if (this._proposedSelectedIndices) {
                if (this._proposedSelectedIndices.indexOf(oldSelectedIndex) != -1)
                    this.itemSelected(oldSelectedIndex, true);
                this.commitMultipleSelection();
            }
            if (dispatchChangedEvents && retVal) {
                if (values[4 /* dispatchChangeAfterSelection */]) {
                    this.dispatchEventWith(egret.Event.CHANGE);
                    values[4 /* dispatchChangeAfterSelection */] = false;
                }
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selectedIndex");
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selectedItem");
            }
            return retVal;
        };
        /**
         * Given a new selection interval, figure out which
         * items are newly added/removed from the selection interval and update
         * selection properties and view accordingly.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从给定的选择区间中找出新增或者移除的项，并更新属性。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        List.prototype.commitMultipleSelection = function () {
            var removedItems = [];
            var addedItems = [];
            var i;
            var count;
            var selectedIndices = this._selectedIndices;
            var proposedSelectedIndices = this._proposedSelectedIndices;
            if (selectedIndices.length > 0 && proposedSelectedIndices.length > 0) {
                count = proposedSelectedIndices.length;
                for (i = 0; i < count; i++) {
                    if (selectedIndices.indexOf(proposedSelectedIndices[i]) == -1)
                        addedItems.push(proposedSelectedIndices[i]);
                }
                count = selectedIndices.length;
                for (i = 0; i < count; i++) {
                    if (proposedSelectedIndices.indexOf(selectedIndices[i]) == -1)
                        removedItems.push(selectedIndices[i]);
                }
            }
            else if (selectedIndices.length > 0) {
                removedItems = selectedIndices;
            }
            else if (proposedSelectedIndices.length > 0) {
                addedItems = proposedSelectedIndices;
            }
            this._selectedIndices = proposedSelectedIndices;
            if (removedItems.length > 0) {
                count = removedItems.length;
                for (i = 0; i < count; i++) {
                    this.itemSelected(removedItems[i], false);
                }
            }
            if (addedItems.length > 0) {
                count = addedItems.length;
                for (i = 0; i < count; i++) {
                    this.itemSelected(addedItems[i], true);
                }
            }
            this._proposedSelectedIndices = null;
        };
        /**
         * @private
         *
         * @param index
         * @returns
         */
        List.prototype.$isItemIndexSelected = function (index) {
            if (this.allowMultipleSelection)
                return this._selectedIndices.indexOf(index) != -1;
            return _super.prototype.$isItemIndexSelected.call(this, index);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        List.prototype.dataProviderRefreshed = function () {
            if (this.allowMultipleSelection) {
                return;
            }
            _super.prototype.dataProviderRefreshed.call(this);
        };
        /**
         * @private
         * 计算当前的选中项列表
         */
        List.prototype.calculateSelectedIndices = function (index) {
            var interval = [];
            var selectedIndices = this._selectedIndices;
            var length = selectedIndices.length;
            if (length > 0) {
                if (length == 1 && (selectedIndices[0] == index)) {
                    if (!this.$ListBase[0 /* requireSelection */]) {
                        return interval;
                    }
                    interval.splice(0, 0, selectedIndices[0]);
                    return interval;
                }
                else {
                    var found = false;
                    for (var i = 0; i < length; i++) {
                        if (selectedIndices[i] == index) {
                            found = true;
                        }
                        else if (selectedIndices[i] != index) {
                            interval.splice(0, 0, selectedIndices[i]);
                        }
                    }
                    if (!found) {
                        interval.splice(0, 0, index);
                    }
                    return interval;
                }
            }
            else {
                interval.splice(0, 0, index);
                return interval;
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        List.prototype.onRendererTouchEnd = function (event) {
            if (this.allowMultipleSelection) {
                var itemRenderer = (event.currentTarget);
                var touchDownItemRenderer = this.$ListBase[7 /* touchDownItemRenderer */];
                if (itemRenderer != touchDownItemRenderer)
                    return;
                this.setSelectedIndices(this.calculateSelectedIndices(itemRenderer.itemIndex), true);
                eui.ItemTapEvent.dispatchItemTapEvent(this, eui.ItemTapEvent.ITEM_TAP, itemRenderer);
            }
            else {
                _super.prototype.onRendererTouchEnd.call(this, event);
            }
        };
        return List;
    }(eui.ListBase));
    eui.List = List;
    __reflect(List.prototype, "eui.List");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The Panel class defines a container that includes a title bar,
     * a closeButton, a moveArea, and a content area for its children.
     *
     * @event eui.UIEvent.CLOSING Dispatched when the close button is taped
     * you can use <code>event.preventDefault()</code> to prevent close.
     *
     * @defaultProperty elementsContent
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/PanelExample.ts
     * @language en_US
     */
    /**
     * Panel 类定义一个容器，该容器为其子代提供标题栏、关闭按钮、可移动区域和内容区域。
     *
     * @event eui.UIEvent.CLOSING 面板即将关闭事件，在关闭按钮被点击后抛出，
     * 监听此事件并调用<code>event.preventDefault()</code>能够阻止面板被关闭。
     *
     * @defaultProperty elementsContent
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/PanelExample.ts
     * @language zh_CN
     */
    var Panel = (function (_super) {
        __extends(Panel, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Panel() {
            var _this = _super.call(this) || this;
            /**
             * The skin part that defines the appearance of the close button.
             * When taped, the close button dispatches a <code>closing</code> event.
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 关闭按钮
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.closeButton = null;
            /**
             * The area where the user must drag to move the window.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 可移动区域
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.moveArea = null;
            /**
             * The skin part that defines the appearance of the
             * title text in the container.
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 标题显示对象
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.titleDisplay = null;
            /**
             * @private
             */
            _this._title = "";
            /**
             * @private
             * 触摸按下时的偏移量
             */
            _this.offsetPointX = 0;
            /**
             * @private
             */
            _this.offsetPointY = 0;
            _this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, _this.onWindowTouchBegin, _this, false, 100);
            return _this;
        }
        /**
         * @private
         * 在窗体上按下时前置窗口
         */
        Panel.prototype.onWindowTouchBegin = function (event) {
            this.$parent.addChild(this);
        };
        Object.defineProperty(Panel.prototype, "elementsContent", {
            /**
             * write-only property,This property is Usually invoked in resolving an EXML for adding multiple children quickly.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 只写属性，此属性通常在 EXML 的解析器中调用，便于快速添加多个子项。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            set: function (value) {
                if (value) {
                    var length_25 = value.length;
                    for (var i = 0; i < length_25; i++) {
                        this.addChild(value[i]);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Panel.prototype, "title", {
            /**
             * Title or caption displayed in the title bar.
             *
             * @default ""
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 标题栏中显示的标题。
             *
             * @default ""
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._title;
            },
            set: function (value) {
                this._title = value;
                if (this.titleDisplay)
                    this.titleDisplay.text = this.title;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Panel.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
            if (instance == this.titleDisplay) {
                this.titleDisplay.text = this._title;
            }
            else if (instance == this.moveArea) {
                this.moveArea.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            }
            else if (instance == this.closeButton) {
                this.closeButton.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseButtonClick, this);
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Panel.prototype.partRemoved = function (partName, instance) {
            _super.prototype.partRemoved.call(this, partName, instance);
            if (instance == this.moveArea) {
                this.moveArea.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            }
            else if (instance == this.closeButton) {
                this.closeButton.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseButtonClick, this);
            }
        };
        /**
         * Dispatch the "closing" event when the closeButton is clicked.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 当 closeButton 被点击时派发 “closing” 事件
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Panel.prototype.onCloseButtonClick = function (event) {
            if (eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CLOSING, true, true)) {
                this.close();
            }
        };
        /**
         * Close the panel and remove from the parent container.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 关闭面板，从父级容器移除自身。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Panel.prototype.close = function () {
            if (!this.$parent) {
                return;
            }
            this.$parent.removeChild(this);
        };
        /**
         * Called when the user starts dragging a Panel.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在可移动区域按下
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Panel.prototype.onTouchBegin = function (event) {
            this.$includeInLayout = false;
            this.offsetPointX = this.x - event.$stageX;
            this.offsetPointY = this.y - event.$stageY;
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        };
        /**
         * Called when the user drags a Panel.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 触摸拖拽时的移动事件
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Panel.prototype.onTouchMove = function (event) {
            this.x = event.$stageX + this.offsetPointX;
            this.y = event.$stageY + this.offsetPointY;
        };
        /**
         * Called when the user releases the Panel.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在舞台上弹起事件
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Panel.prototype.onTouchEnd = function (event) {
            var stage = event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        };
        return Panel;
    }(eui.Component));
    eui.Panel = Panel;
    __reflect(Panel.prototype, "eui.Panel");
    eui.registerProperty(Panel, "elementsContent", "Array", true);
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The ProgressBar control provides a visual representation of the progress of a task over time.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ProgressBarExample.ts
     * @language en_US
     */
    /**
     * ProgressBar 控件为随时间而变的任务进度提供了形象化的表示。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ProgressBarExample.ts
     * @language zh_CN
     */
    var ProgressBar = (function (_super) {
        __extends(ProgressBar, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function ProgressBar() {
            var _this = _super.call(this) || this;
            /**
             * this hightlight component of the progressbar.
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 进度高亮显示对象。
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.thumb = null;
            /**
             * the label of the progressbar.
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 进度条文本
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.labelDisplay = null;
            /**
             * @private
             */
            _this._labelFunction = null;
            /**
             * @private
             */
            _this._slideDuration = 500;
            /**
             * @private
             */
            _this._direction = eui.Direction.LTR;
            /**
             * @private
             * 动画播放结束时要到达的value。
             */
            _this.slideToValue = 0;
            /**
             * @private
             */
            _this.animationValue = 0;
            /**
             * @private
             */
            _this.thumbInitX = 0;
            /**
             * @private
             */
            _this.thumbInitY = 0;
            _this.animation = new eui.sys.Animation(_this.animationUpdateHandler, _this);
            return _this;
        }
        Object.defineProperty(ProgressBar.prototype, "labelFunction", {
            /**
             * a text format callback function。example：
             * <code>labelFunction(value:Number,maximum:Number):String;</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 进度条文本格式化回调函数。示例：
             * <code>labelFunction(value:Number,maximum:Number):String;</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._labelFunction;
            },
            set: function (value) {
                if (this._labelFunction == value)
                    return;
                this._labelFunction = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Convert the current value to display text
         *
         * @param value the current value
         * @param maximum the maximum value
         *
         * @return a converted text
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 将当前value转换成文本
         *
         * @param value 当前值
         * @param maximum 最大值
         *
         * @return 转换后的文本
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ProgressBar.prototype.valueToLabel = function (value, maximum) {
            if (this.labelFunction != null) {
                return this._labelFunction(value, maximum);
            }
            return value + " / " + maximum;
        };
        Object.defineProperty(ProgressBar.prototype, "slideDuration", {
            /**
             * Duration in milliseconds for a sliding animation
             * when the value changing. If the vlaue is 0, no animation will be done.
             *
             * @default 500
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * value改变时更新视图的缓动动画时间(毫秒为单位)。设置为0则不执行缓动。
             *
             * @default 500
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._slideDuration;
            },
            set: function (value) {
                value = +value | 0;
                if (this._slideDuration === value)
                    return;
                this._slideDuration = value;
                if (this.animation.isPlaying) {
                    this.animation.stop();
                    this.setValue(this.slideToValue);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProgressBar.prototype, "direction", {
            /**
             * Direction in which the fill of the ProgressBar expands toward completion.
             * you should use the <code>Direction</code> class constants to set the property.
             *
             * @default Direction.LTR
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * ProgressBar 填充在逐步完成过程中扩展的方向。使用 <code>Direction</code> 类定义的常量。
             *
             * @default Direction.LTR
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._direction;
            },
            set: function (value) {
                if (this._direction == value)
                    return;
                if (this.thumb)
                    this.thumb.x = this.thumbInitX;
                if (this.thumb)
                    this.thumb.y = this.thumbInitY;
                this._direction = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param newValue
         */
        ProgressBar.prototype.$setValue = function (newValue) {
            if (this.value === newValue)
                return false;
            var values = this.$Range;
            var result = _super.prototype.$setValue.call(this, newValue);
            if (this._slideDuration > 0 && this.$stage) {
                this.validateProperties(); //最大值最小值发生改变时要立即应用，防止当前起始值不正确。
                var animation = this.animation;
                if (animation.isPlaying) {
                    this.animationValue = this.slideToValue;
                    this.invalidateDisplayList();
                    animation.stop();
                }
                this.slideToValue = this.nearestValidValue(newValue, values[7 /* snapInterval */]);
                if (this.slideToValue === this.animationValue)
                    return result;
                var duration = this._slideDuration *
                    (Math.abs(this.animationValue - this.slideToValue) / (values[0 /* maximum */] - values[2 /* minimum */]));
                animation.duration = duration === Infinity ? 0 : duration;
                animation.from = this.animationValue;
                animation.to = this.slideToValue;
                animation.play();
            }
            else {
                this.animationValue = this.value;
            }
            return result;
        };
        /**
         * @private
         * 动画播放更新数值
         */
        ProgressBar.prototype.animationUpdateHandler = function (animation) {
            var values = this.$Range;
            var value = this.nearestValidValue(animation.currentValue, values[7 /* snapInterval */]);
            this.animationValue = Math.min(values[0 /* maximum */], Math.max(values[2 /* minimum */], value));
            this.invalidateDisplayList();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ProgressBar.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
            if (instance === this.thumb) {
                if (this.thumb.x)
                    this.thumbInitX = this.thumb.x;
                if (this.thumb.y)
                    this.thumbInitY = this.thumb.y;
                this.thumb.addEventListener(egret.Event.RESIZE, this.onThumbResize, this);
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ProgressBar.prototype.partRemoved = function (partName, instance) {
            _super.prototype.partRemoved.call(this, partName, instance);
            if (instance === this.thumb) {
                this.thumb.removeEventListener(egret.Event.RESIZE, this.onThumbResize, this);
            }
        };
        /**
         * @private
         * thumb的位置或尺寸发生改变
         */
        ProgressBar.prototype.onThumbResize = function (event) {
            this.updateSkinDisplayList();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ProgressBar.prototype.updateSkinDisplayList = function () {
            var currentValue = this.animation.isPlaying ? this.animationValue : this.value;
            var maxValue = this.maximum;
            var thumb = this.thumb;
            if (thumb) {
                var thumbWidth = thumb.width;
                var thumbHeight = thumb.height;
                var clipWidth = Math.round((currentValue / maxValue) * thumbWidth);
                if (clipWidth < 0 || clipWidth === Infinity)
                    clipWidth = 0;
                var clipHeight = Math.round((currentValue / maxValue) * thumbHeight);
                if (clipHeight < 0 || clipHeight === Infinity)
                    clipHeight = 0;
                var rect = thumb.$scrollRect;
                if (!rect) {
                    rect = egret.$TempRectangle;
                }
                rect.setTo(0, 0, thumbWidth, thumbHeight);
                var thumbPosX = thumb.x - rect.x;
                var thumbPosY = thumb.y - rect.y;
                switch (this._direction) {
                    case eui.Direction.LTR:
                        rect.width = clipWidth;
                        thumb.x = thumbPosX;
                        break;
                    case eui.Direction.RTL:
                        rect.width = clipWidth;
                        rect.x = thumbWidth - clipWidth;
                        thumb.x = rect.x;
                        break;
                    case eui.Direction.TTB:
                        rect.height = clipHeight;
                        thumb.y = thumbPosY;
                        break;
                    case eui.Direction.BTT:
                        rect.height = clipHeight;
                        rect.y = thumbHeight - clipHeight;
                        thumb.y = rect.y;
                        break;
                }
                thumb.scrollRect = rect;
            }
            if (this.labelDisplay) {
                this.labelDisplay.text = this.valueToLabel(currentValue, maxValue);
            }
        };
        return ProgressBar;
    }(eui.Range));
    eui.ProgressBar = ProgressBar;
    __reflect(ProgressBar.prototype, "eui.ProgressBar");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * @private
     * 存储根据groupName自动创建的RadioButtonGroup列表
     */
    var automaticRadioButtonGroups = {};
    /**
     * The RadioButton component allows the user make a single choice
     * within a set of mutually exclusive choices.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/RadioButtonExample.ts
     * @language en_US
     */
    /**
     * RadioButton 组件使用户可在一组互相排斥的选择中做出一种选择
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/RadioButtonExample.ts
     * @language zh_CN
     */
    var RadioButton = (function (_super) {
        __extends(RadioButton, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function RadioButton() {
            var _this = _super.call(this) || this;
            /**
             * @private
             * 在RadioButtonGroup中的索引
             */
            _this.$indexNumber = 0;
            /**
             * @private
             * 所属的RadioButtonGroup
             */
            _this.$radioButtonGroup = null;
            /**
             * @private
             */
            _this._group = null;
            /**
             * @private
             */
            _this.groupChanged = false;
            /**
             * @private
             */
            _this._groupName = "radioGroup";
            /**
             * @private
             */
            _this._value = null;
            _this.groupName = "radioGroup";
            return _this;
        }
        Object.defineProperty(RadioButton.prototype, "enabled", {
            /**
             * The RadioButton component is enabled if the
             * RadioButtonGroup is enabled and the RadioButton itself is enabled.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 如果 RadioButtonGroup 启用且 RadioButton 本身也启用，则 RadioButton 组件启用。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                if (!this.$Component[3 /* enabled */]) {
                    return false;
                }
                return !this.$radioButtonGroup ||
                    this.$radioButtonGroup.$enabled;
            },
            set: function (value) {
                this.$setEnabled(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButton.prototype, "group", {
            /**
             * The RadioButtonGroup component to which this RadioButton belongs.
             * If this property is not set,
             * a unique RadioButtonGroup is created automatically based on the groupName property.
             *
             * @see eui.RadioButton#groupName
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 此 RadioButton 所属的 RadioButtonGroup 组件。
             * 若不设置此属性，则根据groupName属性自动创建一个唯一的RadioButtonGroup。
             *
             * @see eui.RadioButton#groupName
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                if (!this._group && this._groupName) {
                    var g = automaticRadioButtonGroups[this._groupName];
                    if (!g) {
                        g = new eui.RadioButtonGroup();
                        g.$name = this._groupName;
                        automaticRadioButtonGroups[this._groupName] = g;
                    }
                    this._group = g;
                }
                return this._group;
            },
            set: function (value) {
                if (this._group == value)
                    return;
                if (this.$radioButtonGroup)
                    this.$radioButtonGroup.$removeInstance(this, false);
                this._group = value;
                this._groupName = value ? this.group.$name : "radioGroup";
                this.groupChanged = true;
                this.invalidateProperties();
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButton.prototype, "groupName", {
            /**
             * Specifies the name of the group to which this RadioButton component belongs
             *
             * @default “radioGroup”
             *
             * @see eui.RadioButton#group
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * RadioButton 组件所属的组的名称
             *
             * @default “radioGroup”
             *
             * @see eui.RadioButton#group
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._groupName;
            },
            set: function (value) {
                if (!value || value == "")
                    return;
                this._groupName = value;
                if (this.$radioButtonGroup)
                    this.$radioButtonGroup.$removeInstance(this, false);
                this._group = null;
                this.groupChanged = true;
                this.invalidateProperties();
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param value
         */
        RadioButton.prototype.$setSelected = function (value) {
            var result = _super.prototype.$setSelected.call(this, value);
            this.invalidateDisplayList();
            return result;
        };
        Object.defineProperty(RadioButton.prototype, "value", {
            /**
             * Optional user-defined value
             * that is associated with a RadioButton component.
             *
             * @default null
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 与 RadioButton 组件关联的可选用户定义值。
             *
             * @default null
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._value;
            },
            set: function (value) {
                if (this._value == value)
                    return;
                this._value = value;
                if (this.$selected && this.group) {
                    eui.PropertyEvent.dispatchPropertyEvent(this.group, eui.PropertyEvent.PROPERTY_CHANGE, "selectedValue");
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        RadioButton.prototype.commitProperties = function () {
            if (this.groupChanged) {
                this.addToGroup();
                this.groupChanged = false;
            }
            _super.prototype.commitProperties.call(this);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        RadioButton.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
            if (this.group) {
                if (this.$selected)
                    this._group.$setSelection(this, false);
                else if (this.group.selection == this)
                    this._group.$setSelection(null, false);
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        RadioButton.prototype.buttonReleased = function () {
            if (!this.enabled || this.selected)
                return;
            if (!this.$radioButtonGroup)
                this.addToGroup();
            _super.prototype.buttonReleased.call(this);
            this.group.$setSelection(this, true);
        };
        /**
         * @private
         * 添此单选按钮加到组
         */
        RadioButton.prototype.addToGroup = function () {
            var g = this.group;
            if (g)
                g.$addInstance(this);
            return g;
        };
        return RadioButton;
    }(eui.ToggleButton));
    eui.RadioButton = RadioButton;
    __reflect(RadioButton.prototype, "eui.RadioButton");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var groupCount = 0;
    /**
     * @private
     * 显示列表深度排序
     */
    function breadthOrderCompare(a, b) {
        var aParent = a.parent;
        var bParent = b.parent;
        if (!aParent || !bParent)
            return 0;
        var aNestLevel = a.$nestLevel;
        var bNestLevel = b.$nestLevel;
        var aIndex = 0;
        var bIndex = 0;
        if (aParent == bParent) {
            aIndex = aParent.getChildIndex(a);
            bIndex = bParent.getChildIndex(b);
        }
        if (aNestLevel > bNestLevel || aIndex > bIndex)
            return 1;
        if (aNestLevel < bNestLevel || bIndex > aIndex)
            return -1;
        if (a == b)
            return 0;
        return breadthOrderCompare(aParent, bParent);
    }
    /**
     * The RadioButtonGroup component defines a group of RadioButton components
     * that act as a single mutually exclusive component; therefore,
     * a user can select only one RadioButton component at a time.
     *
     * @event egret.Event.CHANGE Dispatched when the value of the selected RadioButton component in
     * this group changes.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/RadioButtonGroupExample.ts
     * @language en_US
     */
    /**
     * RadioButtonGroup 组件定义一组 RadioButton 组件，这些组件相互排斥；因此，用户每次只能选择一个 RadioButton 组件
     *
     * @event egret.Event.CHANGE 此组中所选 RadioButton 组件的值更改时分派。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/RadioButtonGroupExample.ts
     * @language zh_CN
     */
    var RadioButtonGroup = (function (_super) {
        __extends(RadioButtonGroup, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function RadioButtonGroup() {
            var _this = _super.call(this) || this;
            /**
             * @private
             * 组名
             */
            _this.$name = null;
            /**
             * @private
             * 单选按钮列表
             */
            _this.radioButtons = [];
            /**
             * @private
             */
            _this.$enabled = true;
            /**
             * @private
             */
            _this._selectedValue = null;
            /**
             * @private
             */
            _this._selection = null;
            _this.$name = "_radioButtonGroup" + groupCount++;
            return _this;
        }
        /**
         * Returns the RadioButton component at the specified index.
         *
         * @param index The 0-based index of the RadioButton in the
         * RadioButtonGroup.
         *
         * @return The specified RadioButton component if index is between
         * 0 and <code>numRadioButtons</code> - 1.  Returns
         * <code>null</code> if the index is invalid.
         *
         * @see eui.RadioButtonGroup#numRadioButtons
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 返回指定索引处的 RadioButton 组件。
         *
         * @param index RadioButtonGroup 中的 RadioButton 的从零开始的索引。
         *
         * @return 当索引位于 0 和 <code>numRadioButtons</code> 之间时，指定的 RadioButton 组件为 1。
         * 如果索引无效，则返回 <code>null</code>。
         *
         * @see eui.RadioButtonGroup#numRadioButtons
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        RadioButtonGroup.prototype.getRadioButtonAt = function (index) {
            return this.radioButtons[index];
        };
        Object.defineProperty(RadioButtonGroup.prototype, "enabled", {
            /**
             * Determines whether selection is allowed.  Note that the value returned
             * only reflects the value that was explicitly set on the
             * <code>RadioButtonGroup</code> and does not reflect any values explicitly
             * set on the individual RadioButtons.
             *
             * @default true
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 确定是否允许选择。请注意，返回的值仅反映对 <code>RadioButtonGroup</code> 显式设置的值，
             * 而不反映对各个 RadioButton 显式设置的任何值。
             *
             * @default true
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$enabled;
            },
            set: function (value) {
                value = !!value;
                if (this.$enabled === value)
                    return;
                this.$enabled = value;
                var buttons = this.radioButtons;
                var length = buttons.length;
                for (var i = 0; i < length; i++)
                    buttons[i].invalidateState();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButtonGroup.prototype, "numRadioButtons", {
            /**
             * The number of RadioButtons that belong to this RadioButtonGroup.
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             *  属于此 RadioButtonGroup 的 RadioButton 数。
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.radioButtons.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButtonGroup.prototype, "selectedValue", {
            /**
             * The <code>value</code> property of the selected
             * RadioButton component in the group, if it has been set,
             * otherwise, the <code>label</code> property of the selected RadioButton.
             * If no RadioButton is selected, this property is <code>null</code>.
             *
             * <p>If you set <code>selectedValue</code>, selects the
             * first RadioButton component whose <code>value</code> or
             * <code>label</code> property matches this value.</p>
             *
             * @default null
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 组中所选 RadioButton 组件的 <code>value</code> 属性（如果未设置），
             * 否则为所选 RadioButton 组件的 <code>label</code> 属性。
             * 如果未选择任何 RadioButton，则此属性为 <code>null</code>。
             *
             * <p>如果设置了 <code>selectedValue</code>，则会选择 <code>value</code> 或 <code>label</code> 属性
             * 与此值匹配的第一个 RadioButton 组件。</p>
             *
             * @default null
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                if (this.selection) {
                    return this.selection.value != null ?
                        this.selection.value :
                        this.selection.label;
                }
                return null;
            },
            set: function (value) {
                this._selectedValue = value;
                if (value == null) {
                    this.$setSelection(null, false);
                    return;
                }
                var n = this.numRadioButtons;
                for (var i = 0; i < n; i++) {
                    var radioButton = this.radioButtons[i];
                    if (radioButton.value == value ||
                        radioButton.label == value) {
                        this.changeSelection(i, false);
                        this._selectedValue = null;
                        eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selectedValue");
                        break;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RadioButtonGroup.prototype, "selection", {
            /**
             * Contains a reference to the currently selected
             * RadioButton component in the group.This property is valid only
             * when the target RadioButton is displayed on the display list
             *
             * @default null
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 当前被选中的单选按钮引用。此属性仅当目标RadioButton在显示列表时有效。
             *
             * @default null
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._selection;
            },
            set: function (value) {
                if (this._selection == value)
                    return;
                this.$setSelection(value, false);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * 添加单选按钮到组内
         */
        RadioButtonGroup.prototype.$addInstance = function (instance) {
            instance.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedHandler, this);
            var buttons = this.radioButtons;
            buttons.push(instance);
            buttons.sort(breadthOrderCompare);
            var length = buttons.length;
            for (var i = 0; i < length; i++) {
                buttons[i].$indexNumber = i;
            }
            if (this._selectedValue)
                this.selectedValue = this._selectedValue;
            if (instance.selected == true)
                this.selection = instance;
            instance.$radioButtonGroup = this;
            instance.invalidateState();
        };
        /**
         * @private
         * 从组里移除单选按钮
         */
        RadioButtonGroup.prototype.$removeInstance = function (instance, addListener) {
            if (instance) {
                var foundInstance = false;
                var buttons = this.radioButtons;
                var length_26 = buttons.length;
                for (var i = 0; i < length_26; i++) {
                    var rb = buttons[i];
                    if (foundInstance) {
                        rb.$indexNumber = rb.$indexNumber - 1;
                    }
                    else if (rb == instance) {
                        if (addListener)
                            instance.addEventListener(egret.Event.ADDED_TO_STAGE, this.addedHandler, this);
                        if (instance == this._selection)
                            this._selection = null;
                        instance.$radioButtonGroup = null;
                        instance.invalidateState();
                        this.radioButtons.splice(i, 1);
                        foundInstance = true;
                        i--;
                        length_26--;
                    }
                }
            }
        };
        /**
         * @private
         * 设置选中的单选按钮
         */
        RadioButtonGroup.prototype.$setSelection = function (value, fireChange) {
            if (this._selection == value)
                return false;
            if (!value) {
                if (this._selection) {
                    this._selection.selected = false;
                    this._selection = null;
                    if (fireChange)
                        this.dispatchEventWith(egret.Event.CHANGE);
                }
            }
            else {
                var n = this.numRadioButtons;
                for (var i = 0; i < n; i++) {
                    if (value == this.getRadioButtonAt(i)) {
                        this.changeSelection(i, fireChange);
                        break;
                    }
                }
            }
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selectedValue");
            return true;
        };
        /**
         * @private
         * 改变选中项
         */
        RadioButtonGroup.prototype.changeSelection = function (index, fireChange) {
            var rb = this.getRadioButtonAt(index);
            if (rb && rb != this._selection) {
                if (this._selection)
                    this._selection.selected = false;
                this._selection = rb;
                this._selection.selected = true;
                if (fireChange)
                    this.dispatchEventWith(egret.Event.CHANGE);
            }
        };
        /**
         * @private
         * 单选按钮添加到显示列表
         */
        RadioButtonGroup.prototype.addedHandler = function (event) {
            var rb = event.target;
            if (rb == event.currentTarget) {
                rb.removeEventListener(egret.Event.ADDED_TO_STAGE, this.addedHandler, this);
                this.$addInstance(rb);
            }
        };
        /**
         * @private
         * 单选按钮从显示列表移除
         */
        RadioButtonGroup.prototype.removedHandler = function (event) {
            var rb = event.target;
            if (rb == event.currentTarget) {
                rb.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.removedHandler, this);
                this.$removeInstance(rb, true);
            }
        };
        return RadioButtonGroup;
    }(egret.EventDispatcher));
    eui.RadioButtonGroup = RadioButtonGroup;
    __reflect(RadioButtonGroup.prototype, "eui.RadioButtonGroup");
    eui.registerBindable(RadioButtonGroup.prototype, "selectedValue");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The Rect component is a rectangular shape. It can be touched.
     * @version Egret 2.5.5
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * Rect 组件矩形绘图元素。此组件可响应鼠标事件。
     * @version Egret 2.5.5
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var Rect = (function (_super) {
        __extends(Rect, _super);
        function Rect(width, height, fillColor) {
            var _this = _super.call(this) || this;
            _this.$fillColor = 0x000000;
            _this.$fillAlpha = 1;
            _this.$strokeColor = 0x444444;
            _this.$strokeAlpha = 1;
            _this.$strokeWeight = 0;
            _this.$ellipseWidth = 0;
            _this.$ellipseHeight = 0;
            _this.touchChildren = false;
            _this.$graphics = new egret.Graphics();
            _this.$graphics.$setTarget(_this);
            _this.width = width;
            _this.height = height;
            _this.fillColor = fillColor;
            return _this;
        }
        Rect.prototype.createNativeDisplayObject = function () {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(8 /* GRAPHICS */);
        };
        Object.defineProperty(Rect.prototype, "graphics", {
            get: function () {
                return this.$graphics;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        Rect.prototype.$measureContentBounds = function (bounds) {
            if (this.$graphics) {
                bounds.setTo(0, 0, this.width, this.height);
            }
        };
        Object.defineProperty(Rect.prototype, "fillColor", {
            /**
             * Fill color
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 填充颜色
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$fillColor;
            },
            set: function (value) {
                if (value == undefined || this.$fillColor == value)
                    return;
                this.$fillColor = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "fillAlpha", {
            /**
             * Fill alpha
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 填充透明度,默认值为1。
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$fillAlpha;
            },
            set: function (value) {
                if (this.$fillAlpha == value)
                    return;
                this.$fillAlpha = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "strokeColor", {
            /**
             * The line's color inside the rect border. Caution: when the strokeWeight is 0, a line is not drawn
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 边框颜色,注意：当 strokeWeight 为 0 时，不显示边框。
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$strokeColor;
            },
            set: function (value) {
                if (this.$strokeColor == value)
                    return;
                this.$strokeColor = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "strokeAlpha", {
            /**
             * The line's alpha inside the rect border. Caution: when the strokeWeight is 0, a line is not drawn
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 边框透明度,注意：当 strokeWeight 为0时，不显示边框。
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$strokeAlpha;
            },
            set: function (value) {
                if (this.$strokeAlpha == value)
                    return;
                this.$strokeAlpha = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "strokeWeight", {
            /**
             * The line's thickness inside the rect border. Caution: when the strokeWeight is 0, a line is not drawn
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 边框粗细(像素),注意：当 strokeWeight 为 0 时，不显示边框。
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$strokeWeight;
            },
            set: function (value) {
                if (this.$strokeWeight == value)
                    return;
                this.$strokeWeight = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "ellipseWidth", {
            /**
             * Width used to draw an ellipse with rounded corners (in pixels).
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 用于绘制圆角的椭圆的宽度(以像素为单位)
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$ellipseWidth;
            },
            set: function (value) {
                if (this.$ellipseWidth == value)
                    return;
                this.$ellipseWidth = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Rect.prototype, "ellipseHeight", {
            /**
             * Height used to draw an ellipse with rounded corners (in pixels). If no value is specified, the default value matches the value of the ellipseWidth parameter.
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 用于绘制圆角的椭圆的高度 (以像素为单位)。如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$ellipseHeight;
            },
            set: function (value) {
                if (this.$ellipseHeight == value)
                    return;
                this.$ellipseHeight = value;
                this.invalidateDisplayList();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @copy eui.UIComponent#updateDisplayList
         *
         * @version Egret 2.5.5
         * @version eui 1.0
         * @platform Web,Native
         */
        Rect.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            var g = this.graphics;
            g.clear();
            if (this.$strokeWeight > 0) {
                g.beginFill(this.$fillColor, 0);
                g.lineStyle(this.$strokeWeight, this.$strokeColor, this.$strokeAlpha, true, "normal", "square", "miter");
                if (this.$ellipseWidth == 0 && this.$ellipseHeight == 0) {
                    g.drawRect(this.$strokeWeight / 2, this.$strokeWeight / 2, unscaledWidth - this.$strokeWeight, unscaledHeight - this.$strokeWeight);
                }
                else {
                    g.drawRoundRect(this.$strokeWeight / 2, this.$strokeWeight / 2, unscaledWidth - this.$strokeWeight, unscaledHeight - this.$strokeWeight, this.$ellipseWidth, this.$ellipseHeight);
                }
                g.endFill();
            }
            g.beginFill(this.$fillColor, this.$fillAlpha);
            g.lineStyle(this.$strokeWeight, this.$strokeColor, 0, true, "normal", "square", "miter");
            if (this.$ellipseWidth == 0 && this.$ellipseHeight == 0) {
                g.drawRect(this.$strokeWeight, this.$strokeWeight, unscaledWidth - this.$strokeWeight * 2, unscaledHeight - this.$strokeWeight * 2);
            }
            else {
                g.drawRoundRect(this.$strokeWeight, this.$strokeWeight, unscaledWidth - this.$strokeWeight * 2, unscaledHeight - this.$strokeWeight * 2, this.$ellipseWidth, this.$ellipseHeight);
            }
            g.endFill();
        };
        /**
         * @private
         */
        Rect.prototype.$onRemoveFromStage = function () {
            _super.prototype.$onRemoveFromStage.call(this);
            if (this.$graphics) {
                this.$graphics.$onRemoveFromStage();
            }
        };
        return Rect;
    }(eui.Component));
    eui.Rect = Rect;
    __reflect(Rect.prototype, "eui.Rect");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var scrollerThrowEvent;
    /**
     * The Scroller component displays a single scrollable component,
     * called a viewport, and horizontal and vertical scroll bars.
     * The viewport must implement the IViewport interface.
     * <p>The Group components implement the IViewport interface
     * and can be used as the children of the Scroller control,
     * as the following example shows:</p>
     * <pre>
     *       <s:Scroller width="100" height="100">
     *           <s:Group>
     *               <s:Image width="300" height="400" source="assets/logo.jpg"/>
     *           </s:Group>
     *       </s:Scroller>
     * </pre>
     * <p>The size of the Image control is set larger than that of its parent Group container.
     * By default, the child extends past the boundaries of the parent container.
     * Rather than allow the child to extend past the boundaries of the parent container,
     * the Scroller specifies to clip the child to the boundaries and display scroll bars.</p>
     *
     * @event eui.UIEvent.CHANGE_START Dispatched when the scroll position is going to change
     * @event eui.UIEvent.CHANGE_END Dispatched when the scroll position changed complete
     * @event egret.Event.CHANGE Dispatched when the scroll position is changing
     * @event egret.TouchEvent.TOUCH_CANCEL canceled the touch
     *
     * @defaultProperty viewport
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ScrollerExample.ts
     * @language en_US
     */
    /**
     * Scroller 组件显示一个称为视域的单个可滚动组件，以及水平滚动条和垂直滚动条。该视域必须实现 IViewport 接口。
     * <p>Group 组件实现 IViewport 接口，且可以用作 Scroller 控件的子代，如下例所示：</p>
     * <pre>
     *       <s:Scroller width="100" height="100">
     *           <s:Group>
     *               <s:Image width="300" height="400" source="assets/logo.jpg"/>
     *           </s:Group>
     *       </s:Scroller>
     * </pre>
     * Image 控件的大小比其父 Group 容器设置得大。默认情况下，子代超过父容器的边界。
     * Scroller 会指定将子代剪切到边界并显示滚动条，而不是让子代超过父容器的边界。
     *
     * @event eui.UIEvent.CHANGE_START 滚动位置改变开始
     * @event eui.UIEvent.CHANGE_END 滚动位置改变结束
     * @event egret.Event.CHANGE 滚动位置改变的时候
     * @event egret.TouchEvent.TOUCH_CANCEL 取消触摸事件
     *
     * @defaultProperty viewport
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ScrollerExample.ts
     * @language zh_CN
     */
    var Scroller = (function (_super) {
        __extends(Scroller, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Scroller() {
            var _this = _super.call(this) || this;
            _this.$bounces = true;
            /**
             * the horizontal scroll bar
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 水平滚动条
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.horizontalScrollBar = null;
            /**
             * the vertical scroll bar
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 垂直滚动条
             *
             * @skinPart
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.verticalScrollBar = null;
            var touchScrollH = new eui.sys.TouchScroll(_this.horizontalUpdateHandler, _this.horizontalEndHandler, _this);
            var touchScrollV = new eui.sys.TouchScroll(_this.verticalUpdateHandler, _this.verticalEndHanlder, _this);
            _this.$Scroller = {
                0: "auto",
                1: "auto",
                2: null,
                3: 0,
                4: 0,
                5: false,
                6: false,
                7: false,
                8: touchScrollH,
                9: touchScrollV,
                10: null,
                11: false,
                12: false //touchCancle
            };
            return _this;
        }
        Object.defineProperty(Scroller.prototype, "bounces", {
            /**
             * Whether to enable rebound, rebound When enabled, ScrollView contents allowed to continue to drag the border after arriving at the end user drag operation, and then bounce back boundary position
             * @default true
             * @version Egret 2.5.6
             * @language en_US
             */
            /**
             * 是否启用回弹，当启用回弹后，ScrollView中内容在到达边界后允许继续拖动，在用户拖动操作结束后，再反弹回边界位置
             * @default true
             * @version Egret 2.5.6
             * @language zh_CN
             */
            get: function () {
                return this.$bounces;
            },
            set: function (value) {
                this.$bounces = !!value;
                var touchScrollH = this.$Scroller[8 /* touchScrollH */];
                if (touchScrollH) {
                    touchScrollH.$bounces = this.$bounces;
                }
                var touchScrollV = this.$Scroller[9 /* touchScrollV */];
                if (touchScrollV) {
                    touchScrollV.$bounces = this.$bounces;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scroller.prototype, "throwSpeed", {
            get: function () {
                return this.$Scroller[8 /* touchScrollH */].$scrollFactor;
            },
            /**
             * Adjust the speed to get out of the slide end.When equal to 0,the scroll animation will not be play.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 调节滑动结束时滚出的速度。等于0时，没有滚动动画
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            set: function (val) {
                val = +val;
                if (val < 0)
                    val = 0;
                this.$Scroller[8 /* touchScrollH */].$scrollFactor = val;
                this.$Scroller[9 /* touchScrollV */].$scrollFactor = val;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        Scroller.prototype.$getThrowInfo = function (currentPos, toPos) {
            if (!scrollerThrowEvent) {
                scrollerThrowEvent = new eui.ScrollerThrowEvent(eui.ScrollerThrowEvent.THROW, false, false, currentPos, toPos);
            }
            else {
                scrollerThrowEvent.currentPos = currentPos;
                scrollerThrowEvent.toPos = toPos;
            }
            return scrollerThrowEvent;
        };
        Object.defineProperty(Scroller.prototype, "scrollPolicyV", {
            /**
             * Indicates under what conditions the scroller can be moved and the vertical scroll bar is displayed.
             * <p><code>ScrollPolicy.ON</code> - the scroller can be moved, and the scroll bar is displayed when it's move.</p>
             * <p><code>ScrollPolicy.OFF</code> - the scroller can not be moved, the scroll bar is never displayed.</p>
             * <p><code>ScrollPolicy.AUTO</code> - the scroller can not be moved when
             *  the viewport's contentHeight is larger than its height. the scroll bar is displayed when it's move.
             *
             * @default ScrollPolicy.AUTO
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 指示在哪些条件可以滚动并且显示垂直滑动条。
             * <p><code>ScrollPolicy.ON</code> - 可以滚动，滚动时显示滚动条。</p>
             * <p><code>ScrollPolicy.OFF</code> - 不可以滚动并且不显示滚动条。</p>
             * <p><code>ScrollPolicy.AUTO</code> - 当视域的 contentHeight 大于其自身的高度时可以滚动，滚动时显示滚动条。</p>
             *
             * @default ScrollPolicy.AUTO
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Scroller[0 /* scrollPolicyV */];
            },
            set: function (value) {
                var values = this.$Scroller;
                if (values[0 /* scrollPolicyV */] == value) {
                    return;
                }
                values[0 /* scrollPolicyV */] = value;
                this.checkScrollPolicy();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Scroller.prototype, "scrollPolicyH", {
            /**
             * Indicates under what conditions the scroller can be moved and the horizontal scroll bar is displayed.
             * <p><code>ScrollPolicy.ON</code> - the scroller can be moved, and the scroll bar is displayed when it's move.</p>
             * <p><code>ScrollPolicy.OFF</code> - the scroller can not be moved, the scroll bar is never displayed.</p>
             * <p><code>ScrollPolicy.AUTO</code> - the can not be moved  when
             *  the viewport's contentWidth is larger than its width. the scroll bar is displayed when it's move.
             *
             * @default ScrollPolicy.AUTO
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 指示在哪些条件下可以滚动并且显示水平滑动条。
             * <p><code>ScrollPolicy.ON</code> - 可以滚动，滚动时显示滚动条。</p>
             * <p><code>ScrollPolicy.OFF</code> - 不可以滚动并且不显示滚动条。</p>
             * <p><code>ScrollPolicy.AUTO</code> - 当视域的 contentWidth 大于其自身的宽度时可以滚动，滚动时显示滚动条。</p>
             *
             * @default ScrollPolicy.AUTO
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Scroller[1 /* scrollPolicyH */];
            },
            set: function (value) {
                var values = this.$Scroller;
                if (values[1 /* scrollPolicyH */] == value) {
                    return;
                }
                values[1 /* scrollPolicyH */] = value;
                this.checkScrollPolicy();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Stop the scroller animation
         * @version Egret 3.0.2
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 停止滚动的动画
         *
         * @version Egret 3.0.2
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Scroller.prototype.stopAnimation = function () {
            var values = this.$Scroller;
            var scrollV = values[9 /* touchScrollV */];
            var scrollH = values[8 /* touchScrollH */];
            if (scrollV.animation.isPlaying) {
                eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CHANGE_END);
            }
            else if (scrollH.animation.isPlaying) {
                eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CHANGE_END);
            }
            scrollV.stop();
            scrollH.stop();
            var verticalBar = this.verticalScrollBar;
            var horizontalBar = this.horizontalScrollBar;
            if (verticalBar && verticalBar.autoVisibility) {
                verticalBar.visible = false;
            }
            if (horizontalBar && horizontalBar.autoVisibility) {
                horizontalBar.visible = false;
            }
        };
        Object.defineProperty(Scroller.prototype, "viewport", {
            /**
             * The viewport component to be scrolled.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要滚动的视域组件。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$Scroller[10 /* viewport */];
            },
            set: function (value) {
                var values = this.$Scroller;
                if (value == values[10 /* viewport */])
                    return;
                this.uninstallViewport();
                values[10 /* viewport */] = value;
                values[11 /* viewprotRemovedEvent */] = false;
                this.installViewport();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * 安装并初始化视域组件
         */
        Scroller.prototype.installViewport = function () {
            var viewport = this.viewport;
            if (viewport) {
                this.addChildAt(viewport, 0);
                viewport.scrollEnabled = true;
                viewport.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginCapture, this, true);
                viewport.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndCapture, this, true);
                viewport.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapCapture, this, true);
                viewport.addEventListener(egret.Event.REMOVED, this.onViewPortRemove, this);
            }
            if (this.horizontalScrollBar) {
                this.horizontalScrollBar.viewport = viewport;
            }
            if (this.verticalScrollBar) {
                this.verticalScrollBar.viewport = viewport;
            }
        };
        /**
         * @private
         * 卸载视域组件
         */
        Scroller.prototype.uninstallViewport = function () {
            if (this.horizontalScrollBar) {
                this.horizontalScrollBar.viewport = null;
            }
            if (this.verticalScrollBar) {
                this.verticalScrollBar.viewport = null;
            }
            var viewport = this.viewport;
            if (viewport) {
                viewport.scrollEnabled = false;
                viewport.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBeginCapture, this, true);
                viewport.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndCapture, this, true);
                viewport.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapCapture, this, true);
                viewport.removeEventListener(egret.Event.REMOVED, this.onViewPortRemove, this);
                if (this.$Scroller[11 /* viewprotRemovedEvent */] == false) {
                    this.removeChild(viewport);
                }
            }
        };
        Scroller.prototype.onViewPortRemove = function (event) {
            if (event.target == this.viewport) {
                this.$Scroller[11 /* viewprotRemovedEvent */] = true;
                this.viewport = null;
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Scroller.prototype.setSkin = function (skin) {
            _super.prototype.setSkin.call(this, skin);
            var viewport = this.viewport;
            if (viewport) {
                this.addChildAt(viewport, 0);
            }
        };
        /**
         * @private
         * @param event
         */
        Scroller.prototype.onTouchBeginCapture = function (event) {
            this.$Scroller[12 /* touchCancle */] = false;
            var canScroll = this.checkScrollPolicy();
            if (!canScroll) {
                return;
            }
            this.onTouchBegin(event);
        };
        /**
         * @private
         * @param event
         */
        Scroller.prototype.onTouchEndCapture = function (event) {
            if (this.$Scroller[12 /* touchCancle */]) {
                event.$bubbles = false;
                this.dispatchBubbleEvent(event);
                event.$bubbles = true;
                event.stopPropagation();
                this.onTouchEnd(event);
            }
        };
        /**
         * @private
         * @param event
         */
        Scroller.prototype.onTouchTapCapture = function (event) {
            if (this.$Scroller[12 /* touchCancle */]) {
                event.$bubbles = false;
                this.dispatchBubbleEvent(event);
                event.$bubbles = true;
                event.stopPropagation();
            }
        };
        /**
         * @private
         * 检查当前滚动策略，若有一个方向可以滚动，返回true。
         */
        Scroller.prototype.checkScrollPolicy = function () {
            var values = this.$Scroller;
            var viewport = values[10 /* viewport */];
            if (!viewport) {
                return false;
            }
            var hCanScroll;
            var uiValues = viewport.$UIComponent;
            switch (values[1 /* scrollPolicyH */]) {
                case "auto":
                    if (viewport.contentWidth > uiValues[10 /* width */] || viewport.scrollH !== 0) {
                        hCanScroll = true;
                    }
                    else {
                        hCanScroll = false;
                    }
                    break;
                case "on":
                    hCanScroll = true;
                    break;
                case "off":
                    hCanScroll = false;
                    break;
            }
            values[6 /* horizontalCanScroll */] = hCanScroll;
            var vCanScroll;
            switch (values[0 /* scrollPolicyV */]) {
                case "auto":
                    if (viewport.contentHeight > uiValues[11 /* height */] || viewport.scrollV !== 0) {
                        vCanScroll = true;
                    }
                    else {
                        vCanScroll = false;
                    }
                    break;
                case "on":
                    vCanScroll = true;
                    break;
                case "off":
                    vCanScroll = false;
                    break;
            }
            values[7 /* verticalCanScroll */] = vCanScroll;
            return hCanScroll || vCanScroll;
        };
        /**
         * @private
         *
         * @param event
         */
        Scroller.prototype.onTouchBegin = function (event) {
            if (event.isDefaultPrevented()) {
                return;
            }
            if (!this.checkScrollPolicy()) {
                return;
            }
            this.downTarget = event.target;
            var values = this.$Scroller;
            this.stopAnimation();
            values[3 /* touchStartX */] = event.$stageX;
            values[4 /* touchStartY */] = event.$stageY;
            if (values[6 /* horizontalCanScroll */]) {
                values[8 /* touchScrollH */].start(event.$stageX);
            }
            if (values[7 /* verticalCanScroll */]) {
                values[9 /* touchScrollV */].start(event.$stageY);
            }
            var stage = this.$stage;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this, true);
            this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveListeners, this);
            this.tempStage = stage;
        };
        /**
         * @private
         *
         * @param event
         */
        Scroller.prototype.onTouchMove = function (event) {
            if (event.isDefaultPrevented()) {
                return;
            }
            var values = this.$Scroller;
            if (!values[5 /* touchMoved */]) {
                var outX = void 0;
                if (Math.abs(values[3 /* touchStartX */] - event.$stageX) < Scroller.scrollThreshold) {
                    outX = false;
                }
                else {
                    outX = true;
                }
                var outY = void 0;
                if (Math.abs(values[4 /* touchStartY */] - event.$stageY) < Scroller.scrollThreshold) {
                    outY = false;
                }
                else {
                    outY = true;
                }
                if (!outX && !outY) {
                    return;
                }
                if (!outY && outX && values[1 /* scrollPolicyH */] == 'off') {
                    return;
                }
                if (!outX && outY && values[0 /* scrollPolicyV */] == 'off') {
                    return;
                }
                values[12 /* touchCancle */] = true;
                values[5 /* touchMoved */] = true;
                this.dispatchCancelEvent(event);
                var horizontalBar = this.horizontalScrollBar;
                var verticalBar = this.verticalScrollBar;
                if (horizontalBar && horizontalBar.autoVisibility && values[6 /* horizontalCanScroll */]) {
                    horizontalBar.visible = true;
                }
                if (verticalBar && verticalBar.autoVisibility && values[7 /* verticalCanScroll */]) {
                    verticalBar.visible = true;
                }
                if (values[2 /* autoHideTimer */]) {
                    values[2 /* autoHideTimer */].reset();
                }
                eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CHANGE_START);
                this.$stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            }
            event.preventDefault();
            var viewport = values[10 /* viewport */];
            var uiValues = viewport.$UIComponent;
            if (values[6 /* horizontalCanScroll */]) {
                values[8 /* touchScrollH */].update(event.$stageX, viewport.contentWidth - uiValues[10 /* width */], viewport.scrollH);
            }
            if (values[7 /* verticalCanScroll */]) {
                values[9 /* touchScrollV */].update(event.$stageY, viewport.contentHeight - uiValues[11 /* height */], viewport.scrollV);
            }
        };
        /**
         * @private
         * @param event
         */
        Scroller.prototype.onTouchCancel = function (event) {
            if (!this.$Scroller[5 /* touchMoved */]) {
                this.onRemoveListeners();
            }
        };
        /**
         * @private
         * @param event
         */
        Scroller.prototype.dispatchBubbleEvent = function (event) {
            var viewport = this.$Scroller[10 /* viewport */];
            if (!viewport) {
                return;
            }
            var cancelEvent = egret.Event.create(egret.TouchEvent, event.type, event.bubbles, event.cancelable);
            cancelEvent.$initTo(event.$stageX, event.$stageY, event.touchPointID);
            var target = this.downTarget;
            cancelEvent.$setTarget(target);
            var list = this.$getPropagationList(target);
            var length = list.length;
            var targetIndex = list.length * 0.5;
            var startIndex = -1;
            for (var i = 0; i < length; i++) {
                if (list[i] === viewport) {
                    startIndex = i;
                    break;
                }
            }
            list.splice(0, list.length - startIndex + 1);
            targetIndex = 0;
            this.$dispatchPropagationEvent(cancelEvent, list, targetIndex);
            egret.Event.release(cancelEvent);
        };
        /**
         * @private
         * @param event
         */
        Scroller.prototype.dispatchCancelEvent = function (event) {
            var viewport = this.$Scroller[10 /* viewport */];
            if (!viewport) {
                return;
            }
            var cancelEvent = egret.Event.create(egret.TouchEvent, egret.TouchEvent.TOUCH_CANCEL, event.bubbles, event.cancelable);
            cancelEvent.$initTo(event.$stageX, event.$stageY, event.touchPointID);
            var target = this.downTarget;
            cancelEvent.$setTarget(target);
            var list = this.$getPropagationList(target);
            var length = list.length;
            var targetIndex = list.length * 0.5;
            var startIndex = -1;
            for (var i = 0; i < length; i++) {
                if (list[i] === viewport) {
                    startIndex = i;
                    break;
                }
            }
            list.splice(0, startIndex + 1 - 2);
            list.splice(list.length - 1 - startIndex + 2, startIndex + 1 - 2);
            targetIndex -= startIndex + 1;
            this.$dispatchPropagationEvent(cancelEvent, list, targetIndex);
            egret.Event.release(cancelEvent);
        };
        /**
         * @private
         * @param event
         */
        Scroller.prototype.onTouchEnd = function (event) {
            var values = this.$Scroller;
            values[5 /* touchMoved */] = false;
            this.onRemoveListeners();
            var viewport = values[10 /* viewport */];
            var uiValues = viewport.$UIComponent;
            if (values[8 /* touchScrollH */].isStarted()) {
                values[8 /* touchScrollH */].finish(viewport.scrollH, viewport.contentWidth - uiValues[10 /* width */]);
            }
            if (values[9 /* touchScrollV */].isStarted()) {
                values[9 /* touchScrollV */].finish(viewport.scrollV, viewport.contentHeight - uiValues[11 /* height */]);
            }
        };
        /**
         * @private
         */
        Scroller.prototype.onRemoveListeners = function () {
            var stage = this.tempStage || this.$stage;
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this, true);
            stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchCancel, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoveListeners, this);
        };
        /**
         * @private
         *
         * @param scrollPos
         */
        Scroller.prototype.horizontalUpdateHandler = function (scrollPos) {
            this.$Scroller[10 /* viewport */].scrollH = scrollPos;
            this.dispatchEventWith(egret.Event.CHANGE);
        };
        /**
         * @private
         *
         * @param scrollPos
         */
        Scroller.prototype.verticalUpdateHandler = function (scrollPos) {
            this.$Scroller[10 /* viewport */].scrollV = scrollPos;
            this.dispatchEventWith(egret.Event.CHANGE);
        };
        /**
         * @private
         *
         */
        Scroller.prototype.horizontalEndHandler = function () {
            if (!this.$Scroller[9 /* touchScrollV */].isPlaying()) {
                this.onChangeEnd();
            }
        };
        /**
         * @private
         *
         */
        Scroller.prototype.verticalEndHanlder = function () {
            if (!this.$Scroller[8 /* touchScrollH */].isPlaying()) {
                this.onChangeEnd();
            }
        };
        /**
         * @private
         *
         */
        Scroller.prototype.onChangeEnd = function () {
            var values = this.$Scroller;
            var horizontalBar = this.horizontalScrollBar;
            var verticalBar = this.verticalScrollBar;
            if (horizontalBar && horizontalBar.visible || verticalBar && verticalBar.visible) {
                if (!values[2 /* autoHideTimer */]) {
                    values[2 /* autoHideTimer */] = new egret.Timer(200, 1);
                    values[2 /* autoHideTimer */].addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onAutoHideTimer, this);
                }
                values[2 /* autoHideTimer */].reset();
                values[2 /* autoHideTimer */].start();
            }
            eui.UIEvent.dispatchUIEvent(this, eui.UIEvent.CHANGE_END);
        };
        /**
         * @private
         *
         * @param event
         */
        Scroller.prototype.onAutoHideTimer = function (event) {
            var horizontalBar = this.horizontalScrollBar;
            var verticalBar = this.verticalScrollBar;
            if (horizontalBar && horizontalBar.autoVisibility) {
                horizontalBar.visible = false;
            }
            if (verticalBar && verticalBar.autoVisibility) {
                verticalBar.visible = false;
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Scroller.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
            var viewport = this.viewport;
            if (viewport) {
                //必须先调用setLayoutBoundsSize()，因为尺寸改变会影响布局位置。
                viewport.setLayoutBoundsSize(unscaledWidth, unscaledHeight);
                viewport.setLayoutBoundsPosition(0, 0);
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        Scroller.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
            if (instance == this.horizontalScrollBar) {
                this.horizontalScrollBar.touchChildren = false;
                this.horizontalScrollBar.touchEnabled = false;
                this.horizontalScrollBar.viewport = this.viewport;
                if (this.horizontalScrollBar.autoVisibility) {
                    this.horizontalScrollBar.visible = false;
                }
            }
            else if (instance == this.verticalScrollBar) {
                this.verticalScrollBar.touchChildren = false;
                this.verticalScrollBar.touchEnabled = false;
                this.verticalScrollBar.viewport = this.viewport;
                if (this.verticalScrollBar.autoVisibility) {
                    this.verticalScrollBar.visible = false;
                }
            }
        };
        /**
         * The threshold value(in pixels) trigger the rolling.
         * when the touch points deviate from the initial touch point than this value will trigger the rolling.
         *
         * @default 5
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 开始触发滚动的阈值（以像素为单位），当触摸点偏离初始触摸点的距离超过这个值时才会触发滚动。
         *
         * @default 5
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Scroller.scrollThreshold = 5;
        return Scroller;
    }(eui.Component));
    eui.Scroller = Scroller;
    __reflect(Scroller.prototype, "eui.Scroller");
    eui.registerProperty(Scroller, "viewport", "eui.IViewport", true);
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The Skin class defines the base class for all skins.
     * You typically don't need to manually create the instance of this class.
     * It can be created by resolving a EXML.<p/>
     *
     * @example You typically write the skin classes in EXML, as the followiong example shows:<p/>
     * <pre>
     *      <?xml version="1.0" encoding="utf-8"?>
     *      <s:Skin xmlns:s="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
     *          <states>
     *              <!-- Specify the states controlled by this skin. -->
     *          </states>
     *          <!-- Define skin. -->
     *      </s:Skin>
     * </pre>
     *
     * @defaultProperty elementsContent
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/SkinExample.ts
     * @language en_US
     */
    /**
     * 皮肤基类。通常情况下，您不需要手动创建这个类的实例，而是通过解析EXML文件后自动生成。<p/>
     *
     * @example 通常您可以按照如下方式写EXML代码：<p/>
     * <pre>
     *      <?xml version="1.0" encoding="utf-8"?>
     *      <s:Skin xmlns:s="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
     *          <states>
     *              <!-- Specify the states controlled by this skin. -->
     *          </states>
     *          <!-- Define skin. -->
     *      </s:Skin>
     * </pre>
     *
     * @defaultProperty elementsContent
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/SkinExample.ts
     * @language zh_CN
     */
    var Skin = (function (_super) {
        __extends(Skin, _super);
        function Skin() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * The maximum recommended width of the component to be considered.
             * This property can only affect measure result of host component.
             *
             * @default 100000
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 皮肤的最大宽度。仅影响主机组件的测量结果。
             *
             * @default 100000
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.maxWidth = 100000;
            /**
             * The minimum recommended width of the component to be considered.
             * This property can only affect measure result of host component.
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 皮肤的最小宽度,此属性设置为大于maxWidth的值时无效。仅影响主机组件的测量结果。
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.minWidth = 0;
            /**
             * The maximum recommended height of the component to be considered.
             * This property can only affect measure result of host component.
             *
             * @default 100000
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 皮肤的最大高度。仅影响主机组件的测量结果。
             *
             * @default 100000
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.maxHeight = 100000;
            /**
             * The minimum recommended height of the component to be considered.
             * This property can only affect measure result of host component.
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 皮肤的最小高度,此属性设置为大于maxHeight的值时无效。仅影响主机组件的测量结果。
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.minHeight = 0;
            /**
             * Number that specifies the explicit width of the skin.
             * This property can only affect measure result of host component.
             * @default NaN
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 皮肤显式设置宽度,设置为 NaN 表示不显式设置。仅影响主机组件的测量结果。
             *
             * @default NaN
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.width = NaN;
            /**
             * Number that specifies the explicit height of the skin.
             * This property can only affect measure result of host component.
             *
             * @default NaN
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 皮肤显式设置高度,设置为 NaN 表示不显式设置。仅影响主机组件的测量结果。
             *
             * @default NaN
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.height = NaN;
            /**
             * @private
             */
            _this.$elementsContent = [];
            /**
             * @private
             */
            _this._hostComponent = null;
            /**
             * @private
             */
            _this.$stateValues = new eui.sys.StateValues();
            return _this;
        }
        Object.defineProperty(Skin.prototype, "elementsContent", {
            set: function (value) {
                this.$elementsContent = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Skin.prototype, "hostComponent", {
            /**
             * The host component which the skin will be attached.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 此皮肤附加到的主机组件
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._hostComponent;
            },
            set: function (value) {
                if (this._hostComponent == value)
                    return;
                if (this._hostComponent) {
                    this._hostComponent.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                }
                this._hostComponent = value;
                var values = this.$stateValues;
                values.parent = value;
                if (value) {
                    this.commitCurrentState();
                    if (!this.$stateValues.intialized) {
                        if (value.$stage) {
                            this.initializeStates(value.$stage);
                        }
                        else {
                            value.once(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
                        }
                    }
                }
                eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "hostComponent");
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         *
         * @param event
         */
        Skin.prototype.onAddedToStage = function (event) {
            this.initializeStates(this._hostComponent.$stage);
        };
        return Skin;
    }(egret.EventDispatcher));
    eui.Skin = Skin;
    __reflect(Skin.prototype, "eui.Skin");
    eui.sys.mixin(Skin, eui.sys.StateClient);
    eui.registerProperty(Skin, "elementsContent", "Array", true);
    eui.registerProperty(Skin, "states", "State[]");
    eui.registerBindable(Skin.prototype, "hostComponent");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The TabBar class displays a set of identical tabs.
     * One tab can be selected at a time, and the first tab is selected by default.
     * <p>The set of tabs is defined by the <code>dataProvider</code> property.
     * The appearance of each tab is defined by the <code>ItemRenderer</code> class.</p>
     * <p>You can use the TabBar control to set the active child of a ViewStack container,
     * as the following example shows:</p>
     * <pre>
     *       <s:TabBar dataProvider="{viewStack}"/>
     *       <s:ViewStack id="viewStack">
     *          <s:Group name="tab1"/>
     *          <s:Group name="tab2"/>
     *          <s:Group name="tab3"/>
     *       </s:ViewStack>
     * </pre>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/TabBarExample.ts
     * @language en_US
     */
    /**
     * TabBar 类显示一组相同的选项卡。一次可以选择一个选项卡，且默认情况下选择第一个选项卡。
     * <p>该组选项卡由 <code>dataProvider</code> 属性定义。
     * 每个选项卡的外观由 <code>ItemRenderer</code> 定义。</p>
     * <p>可以使用 TabBar 控件设置 ViewStack 容器的活动子代，如下例所示：</p>
     * <pre>
     *       <s:TabBar dataProvider="{viewStack}"/>
     *       <s:ViewStack id="viewStack">
     *          <s:Group name="tab1"/>
     *          <s:Group name="tab2"/>
     *          <s:Group name="tab3"/>
     *       </s:ViewStack>
     * </pre>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/TabBarExample.ts
     * @language zh_CN
     */
    var TabBar = (function (_super) {
        __extends(TabBar, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function TabBar() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.indexBeingUpdated = false;
            _this.requireSelection = true;
            _this.useVirtualLayout = false;
            return _this;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        TabBar.prototype.createChildren = function () {
            if (!this.$layout) {
                var layout = new eui.HorizontalLayout();
                layout.gap = 0;
                layout.horizontalAlign = eui.JustifyAlign.JUSTIFY;
                layout.verticalAlign = eui.JustifyAlign.CONTENT_JUSTIFY;
                this.$setLayout(layout);
            }
            _super.prototype.createChildren.call(this);
        };
        /**
         * @private
         *
         * @param value
         */
        TabBar.prototype.$setDataProvider = function (value) {
            var dp = this.$dataProvider;
            if (dp && dp instanceof eui.ViewStack) {
                dp.removeEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.onViewStackIndexChange, this);
                this.removeEventListener(egret.Event.CHANGE, this.onIndexChanged, this);
            }
            if (value && value instanceof eui.ViewStack) {
                value.addEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.onViewStackIndexChange, this);
                this.addEventListener(egret.Event.CHANGE, this.onIndexChanged, this);
            }
            return _super.prototype.$setDataProvider.call(this, value);
        };
        /**
         * @private
         * 触摸点击的选中项改变
         */
        TabBar.prototype.onIndexChanged = function (event) {
            this.indexBeingUpdated = true;
            (this.$dataProvider).selectedIndex = this.selectedIndex;
            this.indexBeingUpdated = false;
        };
        /**
         * @private
         * ViewStack选中项发生改变
         */
        TabBar.prototype.onViewStackIndexChange = function (event) {
            if (event.property == "selectedIndex" && !this.indexBeingUpdated) {
                this.setSelectedIndex((this.$dataProvider).selectedIndex, false);
            }
        };
        return TabBar;
    }(eui.ListBase));
    eui.TabBar = TabBar;
    __reflect(TabBar.prototype, "eui.TabBar");
})(eui || (eui = {}));
var eui;
(function (eui) {
    var FocusEvent = egret.FocusEvent;
    /**
     *
     */
    /**
     * The TextInput is a textfield input component, the user can input and edit the text.
     *
     * @version Egret 2.5.7
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/TextInputExample.ts
     * @language en_US
     */
    /**
     * TextInput 是一个文本输入控件，供用户输入和编辑统一格式文本
     *
     * @version Egret 2.5.7
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/TextInputExample.ts
     * @language zh_CN
     */
    var TextInput = (function (_super) {
        __extends(TextInput, _super);
        function TextInput() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.isFocus = false;
            _this.$TextInput = {
                0: null,
                1: null,
                2: null,
                3: null,
                4: null,
                5: null,
                6: "",
                7: null,
                8: egret.TextFieldInputType.TEXT //inputType
            };
            return _this;
        }
        Object.defineProperty(TextInput.prototype, "prompt", {
            /**
             * @copy eui.EditableText#prompt
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (this.promptDisplay) {
                    return this.promptDisplay.text;
                }
                return this.$TextInput[0 /* prompt */];
            },
            /**
             * @copy eui.EditableText#prompt
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            set: function (value) {
                this.$TextInput[0 /* prompt */] = value;
                if (this.promptDisplay) {
                    this.promptDisplay.text = value;
                }
                this.invalidateProperties();
                this.invalidateState();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "displayAsPassword", {
            /**
             * @copy egret.TextField#displayAsPassword
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (this.textDisplay) {
                    return this.textDisplay.displayAsPassword;
                }
                var v = this.$TextInput[1 /* displayAsPassword */];
                return v ? v : false;
            },
            /**
             * @copy egret.TextField#displayAsPassword
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            set: function (value) {
                this.$TextInput[1 /* displayAsPassword */] = value;
                if (this.textDisplay) {
                    this.textDisplay.displayAsPassword = value;
                }
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "inputType", {
            /**
             * @copy egret.TextField#inputType
             *
             * @version Egret 3.1.6
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (this.textDisplay) {
                    return this.textDisplay.inputType;
                }
                return this.$TextInput[8 /* inputType */];
            },
            /**
             * @copy egret.TextField#inputType
             *
             * @version Egret 3.1.6
             * @version eui 1.0
             * @platform Web,Native
             */
            set: function (value) {
                this.$TextInput[8 /* inputType */] = value;
                if (this.textDisplay) {
                    this.textDisplay.inputType = value;
                }
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "textColor", {
            /**
             * @copy egret.TextField#textColor
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (this.textDisplay) {
                    return this.textDisplay.textColor;
                }
                return this.$TextInput[2 /* textColor */];
            },
            /**
             * @copy egret.TextField#textColor
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            set: function (value) {
                this.$TextInput[2 /* textColor */] = value;
                if (this.textDisplay) {
                    this.textDisplay.textColor = value;
                }
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "maxChars", {
            /**
             * @copy egret.TextField#maxChars
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (this.textDisplay) {
                    return this.textDisplay.maxChars;
                }
                var v = this.$TextInput[3 /* maxChars */];
                return v ? v : 0;
            },
            /**
             * @copy egret.TextField#maxChars
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            set: function (value) {
                this.$TextInput[3 /* maxChars */] = value;
                if (this.textDisplay) {
                    this.textDisplay.maxChars = value;
                }
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "maxWidth", {
            /**
             * @inheritDoc
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (this.textDisplay) {
                    return this.textDisplay.maxWidth;
                }
                var v = this.$TextInput[4 /* maxWidth */];
                return v ? v : 100000;
            },
            /**
             * @inheritDoc
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            set: function (value) {
                this.$TextInput[4 /* maxWidth */] = value;
                if (this.textDisplay) {
                    this.textDisplay.maxWidth = value;
                }
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "maxHeight", {
            /**
             * @inheritDoc
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (this.textDisplay) {
                    //return this.textDisplay.maxHeight;
                }
                var v = this.$TextInput[5 /* maxHeight */];
                return v ? v : 100000;
            },
            /**
             * @inheritDoc
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            set: function (value) {
                this.$TextInput[5 /* maxHeight */] = value;
                if (this.textDisplay) {
                    this.textDisplay.maxHeight = value;
                }
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "text", {
            /**
             * @copy egret.TextField#text
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (this.textDisplay) {
                    return this.textDisplay.text;
                }
                return this.$TextInput[6 /* text */];
            },
            /**
             * @copy egret.TextField#text
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            set: function (value) {
                this.$TextInput[6 /* text */] = value;
                if (this.textDisplay) {
                    this.textDisplay.text = value;
                }
                this.invalidateProperties();
                this.invalidateState();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "restrict", {
            /**
             * @copy egret.TextField#restrict
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                if (this.textDisplay) {
                    return this.textDisplay.restrict;
                }
                return this.$TextInput[7 /* restrict */];
            },
            /**
             * @copy egret.TextField#restrict
             *
             * @version Egret 2.5.7
             * @version eui 1.0
             * @platform Web,Native
             */
            set: function (value) {
                this.$TextInput[7 /* restrict */] = value;
                if (this.textDisplay) {
                    this.textDisplay.restrict = value;
                }
                this.invalidateProperties();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * 焦点移入
         */
        TextInput.prototype.focusInHandler = function (event) {
            this.isFocus = true;
            this.invalidateState();
        };
        /**
         * @private
         * 焦点移出
         */
        TextInput.prototype.focusOutHandler = function (event) {
            this.isFocus = false;
            this.invalidateState();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        TextInput.prototype.getCurrentState = function () {
            var skin = this.skin;
            if (this.prompt && !this.isFocus && !this.text) {
                if (this.enabled && skin.hasState("normalWithPrompt")) {
                    return "normalWithPrompt";
                }
                else if (!this.enabled && skin.hasState("disabledWithPrompt")) {
                    return "disabledWithPrompt";
                }
            }
            else {
                if (this.enabled) {
                    return "normal";
                }
                else {
                    return "disabled";
                }
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        TextInput.prototype.partAdded = function (partName, instance) {
            _super.prototype.partAdded.call(this, partName, instance);
            var values = this.$TextInput;
            if (instance == this.textDisplay) {
                this.textDisplayAdded();
                if (this.textDisplay instanceof eui.EditableText) {
                    this.textDisplay.addEventListener(FocusEvent.FOCUS_IN, this.focusInHandler, this);
                    this.textDisplay.addEventListener(FocusEvent.FOCUS_OUT, this.focusOutHandler, this);
                }
            }
            else if (instance == this.promptDisplay) {
                if (values[0 /* prompt */]) {
                    this.promptDisplay.text = values[0 /* prompt */];
                }
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.5.7
         * @version eui 1.0
         * @platform Web,Native
         */
        TextInput.prototype.partRemoved = function (partName, instance) {
            _super.prototype.partRemoved.call(this, partName, instance);
            if (instance == this.textDisplay) {
                this.textDisplayRemoved();
                if (this.textDisplay instanceof eui.EditableText) {
                    this.textDisplay.removeEventListener(FocusEvent.FOCUS_IN, this.focusInHandler, this);
                    this.textDisplay.removeEventListener(FocusEvent.FOCUS_OUT, this.focusOutHandler, this);
                }
            }
            else if (instance == this.promptDisplay) {
                this.$TextInput[0 /* prompt */] = this.promptDisplay.text;
            }
        };
        /**
         * @private
         */
        TextInput.prototype.textDisplayAdded = function () {
            var values = this.$TextInput;
            if (values[1 /* displayAsPassword */]) {
                this.textDisplay.displayAsPassword = values[1 /* displayAsPassword */];
            }
            if (values[2 /* textColor */]) {
                this.textDisplay.textColor = values[2 /* textColor */];
            }
            if (values[3 /* maxChars */]) {
                this.textDisplay.maxChars = values[3 /* maxChars */];
            }
            if (values[4 /* maxWidth */]) {
                this.textDisplay.maxWidth = values[4 /* maxWidth */];
            }
            if (values[5 /* maxHeight */]) {
                this.textDisplay.maxHeight = values[5 /* maxHeight */];
            }
            if (values[6 /* text */]) {
                this.textDisplay.text = values[6 /* text */];
            }
            if (values[7 /* restrict */]) {
                this.textDisplay.restrict = values[7 /* restrict */];
            }
            if (values[8 /* inputType */]) {
                this.textDisplay.inputType = values[8 /* inputType */];
            }
        };
        /**
         * @private
         */
        TextInput.prototype.textDisplayRemoved = function () {
            var values = this.$TextInput;
            values[1 /* displayAsPassword */] = this.textDisplay.displayAsPassword;
            values[2 /* textColor */] = this.textDisplay.textColor;
            values[3 /* maxChars */] = this.textDisplay.maxChars;
            values[4 /* maxWidth */] = this.textDisplay.maxWidth;
            values[5 /* maxHeight */] = this.textDisplay.maxHeight;
            values[6 /* text */] = this.textDisplay.text;
            values[7 /* restrict */] = this.textDisplay.restrict;
            values[8 /* inputType */] = this.textDisplay.inputType;
        };
        return TextInput;
    }(eui.Component));
    eui.TextInput = TextInput;
    __reflect(TextInput.prototype, "eui.TextInput");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The CheckBox component consists of an optional label and a small box
     * that can contain a check mark or not.<p/>
     *
     * When a user clicks a CheckBox component or its associated text,
     * the CheckBox component sets its <code>selected</code> property
     * to <code>true</code> for checked, and to <code>false</code> for unchecked.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/CheckboxExample.ts
     * @language en_US
     */
    /**
     * CheckBox 组件包含一个可选标签和一个小方框，该方框内可以包含/不包含复选标记。<p/>
     * 用户单击 CheckBox 组件或其关联文本时，CheckBox 组件会将其 selected 属性设置为 true（表示选中）或 false（表示取消选中）。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/components/CheckboxExample.ts
     * @language zh_CN
     */
    var CheckBox = (function (_super) {
        __extends(CheckBox, _super);
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个CheckBox
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function CheckBox() {
            return _super.call(this) || this;
        }
        return CheckBox;
    }(eui.ToggleButton));
    eui.CheckBox = CheckBox;
    __reflect(CheckBox.prototype, "eui.CheckBox");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The ToggleSwitch control defines an on-off control.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ToggleSwitchExample.ts
     * @language en_US
     */
    /**
     * ToggleSwitch 表示一个开关组件。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ToggleSwitchExample.ts
     * @language zh_CN
     */
    var ToggleSwitch = (function (_super) {
        __extends(ToggleSwitch, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function ToggleSwitch() {
            return _super.call(this) || this;
        }
        return ToggleSwitch;
    }(eui.ToggleButton));
    eui.ToggleSwitch = ToggleSwitch;
    __reflect(ToggleSwitch.prototype, "eui.ToggleSwitch");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The UILayer class is the subclass of the Group class.It not only has the standard function of the Group class,but also
     * can keep its size the same to the stage size (Stage.stageWidth,Stage.stageHeight).Its size will changes as the stage size changes.
     * like any normal container class,you can create multiple instance of the UILayer class,but it is usually used as the root of the UI display list.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * UILayer 是 Group 的子类，它除了具有容器的所有标准功能，还能够自动保持自身尺寸始终与舞台尺寸相同（Stage.stageWidth,Stage.stageHeight）。
     * 当舞台尺寸发生改变时，它会跟随舞台尺寸改变。UILayer 跟普通容器一样，允许创建多个实例，但通常都将它作为UI显示列表的根节点使用。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var UILayer = (function (_super) {
        __extends(UILayer, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function UILayer() {
            var _this = _super.call(this) || this;
            _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
            _this.addEventListener(egret.Event.REMOVED_FROM_STAGE, _this.onRemoveFromStage, _this);
            return _this;
        }
        /**
         * @private
         * 添加到舞台
         */
        UILayer.prototype.onAddToStage = function (event) {
            this.$stage.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.onResize();
        };
        /**
         * @private
         * 从舞台移除
         */
        UILayer.prototype.onRemoveFromStage = function (event) {
            this.$stage.removeEventListener(egret.Event.RESIZE, this.onResize, this);
        };
        /**
         * @private
         * 舞台尺寸改变
         */
        UILayer.prototype.onResize = function (event) {
            var stage = this.$stage;
            this.$setWidth(stage.$stageWidth);
            this.$setHeight(stage.$stageHeight);
        };
        return UILayer;
    }(eui.Group));
    eui.UILayer = UILayer;
    __reflect(UILayer.prototype, "eui.UILayer");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The VScrollBar (vertical scrollbar) control lets you control
     * the portion of data that is displayed when there is too much data
     * to fit vertically in a display area.
     *
     * <p>Although you can use the VScrollBar control as a stand-alone control,
     * you usually combine it as part of another group of components to
     * provide scrolling functionality.</p>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/VScrollBarExample.ts
     * @language en_US
     */
    /**
     * VScrollBar（垂直 ScrollBar）控件可以在因数据太多而不能在显示区域中以垂直方向完全显示时控制显示的数据部分。
     * <p>虽然 VScrollBar 控件可以单独使用，但通常将它与其他组件一起使用来提供滚动功能。</p>
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/VScrollBarExample.ts
     * @language zh_CN
     */
    var VScrollBar = (function (_super) {
        __extends(VScrollBar, _super);
        function VScrollBar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VScrollBar.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
            var thumb = this.thumb;
            var viewport = this.$viewport;
            if (!thumb || !viewport) {
                return;
            }
            var bounds = egret.$TempRectangle;
            thumb.getPreferredBounds(bounds);
            var thumbHeight = bounds.height;
            var thumbX = bounds.x;
            var vsp = viewport.scrollV;
            var contentHeight = viewport.contentHeight;
            var height = viewport.height;
            if (vsp <= 0) {
                var scaleHeight = thumbHeight * (1 - (-vsp) / (height * 0.5));
                scaleHeight = Math.max(5, Math.round(scaleHeight));
                thumb.setLayoutBoundsSize(NaN, scaleHeight);
                thumb.setLayoutBoundsPosition(thumbX, 0);
            }
            else if (vsp >= contentHeight - height) {
                var scaleHeight = thumbHeight * (1 - (vsp - contentHeight + height) / (height * 0.5));
                scaleHeight = Math.max(5, Math.round(scaleHeight));
                thumb.setLayoutBoundsSize(NaN, scaleHeight);
                thumb.setLayoutBoundsPosition(thumbX, unscaledHeight - scaleHeight);
            }
            else {
                var thumbY = (unscaledHeight - thumbHeight) * vsp / (contentHeight - height);
                thumb.setLayoutBoundsSize(NaN, NaN);
                thumb.setLayoutBoundsPosition(thumbX, thumbY);
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VScrollBar.prototype.onPropertyChanged = function (event) {
            switch (event.property) {
                case "scrollV":
                case "contentHeight":
                    this.invalidateDisplayList();
                    break;
            }
        };
        return VScrollBar;
    }(eui.ScrollBarBase));
    eui.VScrollBar = VScrollBar;
    __reflect(VScrollBar.prototype, "eui.VScrollBar");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The VSlider (vertical slider) control lets users select a value
     * by moving a slider thumb between the end points of the slider track.
     * The current value of the slider is determined by the relative location of the thumb between
     * the end points of the slider, corresponding to the slider's minimum and maximum values.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/VSliderExample.ts
     * @language en_US
     */
    /**
     * 使用 VSlider（垂直滑块）控件，用户可通过在滑块轨道的端点之间移动滑块来选择值。
     * 滑块的当前值由滑块端点（对应于滑块的最小值和最大值）之间滑块的相对位置确定。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/VSliderExample.ts
     * @language zh_CN
     */
    var VSlider = (function (_super) {
        __extends(VSlider, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function VSlider() {
            return _super.call(this) || this;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VSlider.prototype.pointToValue = function (x, y) {
            if (!this.thumb || !this.track)
                return 0;
            var values = this.$Range;
            var range = values[0 /* maximum */] - values[2 /* minimum */];
            var thumbRange = this.getThumbRange();
            return values[2 /* minimum */] + ((thumbRange != 0) ? ((thumbRange - y) / thumbRange) * range : 0);
        };
        /**
         * @private
         *
         * @returns
         */
        VSlider.prototype.getThumbRange = function () {
            var bounds = egret.$TempRectangle;
            this.track.getLayoutBounds(bounds);
            var thumbRange = bounds.height;
            this.thumb.getLayoutBounds(bounds);
            return thumbRange - bounds.height;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VSlider.prototype.updateSkinDisplayList = function () {
            if (!this.thumb || !this.track)
                return;
            var values = this.$Range;
            var thumbRange = this.getThumbRange();
            var range = values[0 /* maximum */] - values[2 /* minimum */];
            var thumbPosTrackY = (range > 0) ? thumbRange - (((this.pendingValue - values[2 /* minimum */]) / range) * thumbRange) : 0;
            var thumbPos = this.track.localToGlobal(0, thumbPosTrackY, egret.$TempPoint);
            var thumbPosX = thumbPos.x;
            var thumbPosY = thumbPos.y;
            var thumbPosParentY = this.thumb.$parent.globalToLocal(thumbPosX, thumbPosY, egret.$TempPoint).y;
            var bounds = egret.$TempRectangle;
            var thumbHeight = bounds.height;
            this.thumb.getLayoutBounds(bounds);
            this.thumb.setLayoutBoundsPosition(bounds.x, Math.round(thumbPosParentY));
            if (this.trackHighlight) {
                var trackHighlightY = this.trackHighlight.$parent.globalToLocal(thumbPosX, thumbPosY, egret.$TempPoint).y;
                this.trackHighlight.y = Math.round(trackHighlightY + thumbHeight);
                this.trackHighlight.height = Math.round(thumbRange - trackHighlightY);
            }
        };
        return VSlider;
    }(eui.SliderBase));
    eui.VSlider = VSlider;
    __reflect(VSlider.prototype, "eui.VSlider");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * An ViewStack navigator container consists of a collection of child
     * containers stacked on top of each other, where only one child
     * at a time is visible.
     * When a different child container is selected, it seems to replace
     * the old one because it appears in the same location.
     * However, the old child container still exists; it is just invisible.
     *
     * @event eui.CollectionEvent.COLLECTION_CHANGE Dispatched when the ICollection has been updated in some way.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ViewStackExample.ts
     * @language en_US
     */
    /**
     * ViewStack 导航器容器由一组彼此上下堆叠的子容器组成，其中一次只可以显示一个子容器。
     * 选择另一个子容器后，它将显示在原来子容器的位置处，所以看起来好像此子容器替换了原来的子容器。
     * 但是，原来的子容器仍然存在，只不过它现在处于不可见状态。
     *
     * @event eui.CollectionEvent.COLLECTION_CHANGE 以某种方式更新 ICollection 后分派。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ViewStackExample.ts
     * @language zh_CN
     */
    var ViewStack = (function (_super) {
        __extends(ViewStack, _super);
        /**
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function ViewStack() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this._selectedChild = null;
            /**
             * @private
             * 在属性提交前缓存选中项索引
             */
            _this.proposedSelectedIndex = eui.ListBase.NO_PROPOSED_SELECTION;
            /**
             * @private
             */
            _this._selectedIndex = -1;
            return _this;
        }
        Object.defineProperty(ViewStack.prototype, "layout", {
            /**
             * The layout object for this container.
             * This object is responsible for the measurement and layout of
             * the visual elements in the container.
             *
             * @default eui.BasicLayout
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 此容器的 layout 对象。此对象负责容器中可视元素的测量和布局。
             *
             * @default eui.BasicLayout
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$layout;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewStack.prototype, "selectedChild", {
            /**
             * A reference to the currently visible child container.
             * The default is a reference to the first child.
             * If there are no children, this property is <code>null</code>.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 对当前可见子容器的引用。默认设置为对第一个子容器的引用。如果没有子项，则此属性为 <code>null</code>。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                var index = this.selectedIndex;
                if (index >= 0 && index < this.numChildren)
                    return this.getChildAt(index);
                return null;
            },
            set: function (value) {
                var index = this.getChildIndex(value);
                if (index >= 0 && index < this.numChildren)
                    this.setSelectedIndex(index);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ViewStack.prototype, "selectedIndex", {
            /**
             * The zero-based index of the currently visible child container.
             * Child indexes are in the range 0, 1, 2, ..., n - 1,
             * where <code>n</code> is the number of children.
             * The default value is 0, corresponding to the first child.
             * If there are no children, the value of this property is <code>-1</code>.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 当前可见子容器的从零开始的索引。子索引的范围是 0、1、2、...、n - 1，其中 <code>n</code> 是子项的数目。
             * 默认值是 0，对应于第一个子项。如果不存在子容器，则此属性的值为 -1。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.proposedSelectedIndex != eui.ListBase.NO_PROPOSED_SELECTION ? this.proposedSelectedIndex : this._selectedIndex;
            },
            set: function (value) {
                value = +value | 0;
                this.setSelectedIndex(value);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * 设置选中项索引
         */
        ViewStack.prototype.setSelectedIndex = function (value) {
            if (value == this.selectedIndex) {
                return;
            }
            this.proposedSelectedIndex = value;
            this.invalidateProperties();
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "selectedIndex");
        };
        /**
         * @private
         * 一个子项被添加到容器内，此方法不仅在操作addChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        ViewStack.prototype.$childAdded = function (child, index) {
            _super.prototype.$childAdded.call(this, child, index);
            this.showOrHide(child, false);
            var selectedIndex = this.selectedIndex;
            if (selectedIndex == -1) {
                this.setSelectedIndex(index);
            }
            else if (index <= this.selectedIndex && this.$stage) {
                this.setSelectedIndex(selectedIndex + 1);
            }
            eui.CollectionEvent.dispatchCollectionEvent(this, eui.CollectionEvent.COLLECTION_CHANGE, eui.CollectionEventKind.ADD, index, -1, [child.name]);
        };
        /**
         * @private
         * 一个子项从容器内移除，此方法不仅在操作removeChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        ViewStack.prototype.$childRemoved = function (child, index) {
            _super.prototype.$childRemoved.call(this, child, index);
            this.showOrHide(child, true);
            var selectedIndex = this.selectedIndex;
            if (index == selectedIndex) {
                if (this.numChildren > 0) {
                    if (index == 0) {
                        this.proposedSelectedIndex = 0;
                        this.invalidateProperties();
                    }
                    else
                        this.setSelectedIndex(0);
                }
                else
                    this.setSelectedIndex(-1);
            }
            else if (index < selectedIndex) {
                this.setSelectedIndex(selectedIndex - 1);
            }
            eui.CollectionEvent.dispatchCollectionEvent(this, eui.CollectionEvent.COLLECTION_CHANGE, eui.CollectionEventKind.REMOVE, index, -1, [child.name]);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ViewStack.prototype.commitProperties = function () {
            _super.prototype.commitProperties.call(this);
            if (this.proposedSelectedIndex != eui.ListBase.NO_PROPOSED_SELECTION) {
                this.commitSelection(this.proposedSelectedIndex);
                this.proposedSelectedIndex = eui.ListBase.NO_PROPOSED_SELECTION;
            }
        };
        /**
         * @private
         *
         * @param newIndex
         */
        ViewStack.prototype.commitSelection = function (newIndex) {
            if (newIndex >= 0 && newIndex < this.numChildren) {
                this._selectedIndex = newIndex;
                if (this._selectedChild) {
                    this.showOrHide(this._selectedChild, false);
                }
                this._selectedChild = this.getElementAt(this._selectedIndex);
                this.showOrHide(this._selectedChild, true);
            }
            else {
                this._selectedChild = null;
                this._selectedIndex = -1;
            }
            this.invalidateSize();
            this.invalidateDisplayList();
        };
        /**
         * @private
         *
         * @param child
         * @param visible
         */
        ViewStack.prototype.showOrHide = function (child, visible) {
            if (egret.is(child, "eui.UIComponent")) {
                child.includeInLayout = visible;
            }
            child.visible = visible;
        };
        Object.defineProperty(ViewStack.prototype, "length", {
            /**
             * number of children
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 子项数量
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$children.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ViewStack.prototype.getItemAt = function (index) {
            var element = this.$children[index];
            return element ? element.name : "";
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ViewStack.prototype.getItemIndex = function (item) {
            var list = this.$children;
            var length = list.length;
            for (var i = 0; i < length; i++) {
                if (list[i].name == item) {
                    return i;
                }
            }
            return -1;
        };
        return ViewStack;
    }(eui.Group));
    eui.ViewStack = ViewStack;
    __reflect(ViewStack.prototype, "eui.ViewStack", ["eui.ICollection", "egret.IEventDispatcher"]);
    eui.registerBindable(ViewStack.prototype, "selectedIndex");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var sys;
    (function (sys) {
        /**
         * @private
         *
         * @param fraction
         * @returns
         */
        function sineInOut(fraction) {
            return -0.5 * (Math.cos(Math.PI * fraction) - 1);
        }
        /**
         * @private
         * 数值缓动工具类
         */
        var Animation = (function () {
            /**
             * @private
             */
            function Animation(updateFunction, thisObject) {
                /**
                 * @private
                 * 此动画的缓动行为。设置为null意味着不使用缓动，默认值为 sineInOut
                 */
                this.easerFunction = sineInOut;
                /**
                 * @private
                 * 是否正在播放动画，不包括延迟等待和暂停的阶段
                 */
                this.isPlaying = false;
                /**
                 * @private
                 * 动画持续时间,单位毫秒，默认值500
                 */
                this.duration = 500;
                /**
                 * @private
                 * 动画到当前时间对应的值。
                 */
                this.currentValue = 0;
                /**
                 * @private
                 * 起始值
                 */
                this.from = 0;
                /**
                 * @private
                 * 终点值。
                 */
                this.to = 0;
                /**
                 * @private
                 * 动画启动时刻
                 */
                this.startTime = 0;
                /**
                 * @private
                 * 动画播放结束时的回调函数
                 */
                this.endFunction = null;
                this.updateFunction = updateFunction;
                this.thisObject = thisObject;
            }
            /**
             * @private
             * 开始正向播放动画,无论何时调用都重新从零时刻开始，若设置了延迟会首先进行等待。
             */
            Animation.prototype.play = function () {
                this.stop();
                this.start();
            };
            /**
             * @private
             * 开始播放动画
             */
            Animation.prototype.start = function () {
                this.isPlaying = false;
                this.currentValue = 0;
                this.startTime = egret.getTimer();
                this.doInterval(this.startTime);
                egret.startTick(this.doInterval, this);
            };
            /**
             * @private
             * 停止播放动画
             */
            Animation.prototype.stop = function () {
                this.isPlaying = false;
                this.startTime = 0;
                egret.stopTick(this.doInterval, this);
            };
            /**
             * @private
             * 计算当前值并返回动画是否结束
             */
            Animation.prototype.doInterval = function (currentTime) {
                var runningTime = currentTime - this.startTime;
                if (!this.isPlaying) {
                    this.isPlaying = true;
                }
                var duration = this.duration;
                var fraction = duration == 0 ? 1 : Math.min(runningTime, duration) / duration;
                if (this.easerFunction) {
                    fraction = this.easerFunction(fraction);
                }
                this.currentValue = this.from + (this.to - this.from) * fraction;
                if (this.updateFunction)
                    this.updateFunction.call(this.thisObject, this);
                var isEnded = runningTime >= duration;
                if (isEnded) {
                    this.stop();
                }
                if (isEnded && this.endFunction) {
                    this.endFunction.call(this.thisObject, this);
                }
                return true;
            };
            return Animation;
        }());
        sys.Animation = Animation;
        __reflect(Animation.prototype, "eui.sys.Animation");
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * Default instance of interface <code>IThemeAdapter</code>.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 默认的IThemeAdapter接口实现。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var DefaultThemeAdapter = (function () {
        function DefaultThemeAdapter() {
        }
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        DefaultThemeAdapter.prototype.getTheme = function (url, compFunc, errorFunc, thisObject) {
            function onGet(event) {
                var loader = (event.target);
                compFunc.call(thisObject, loader.response);
            }
            function onError(event) {
                errorFunc.call(thisObject);
            }
            var loader = new egret.HttpRequest();
            loader.addEventListener(egret.Event.COMPLETE, onGet, thisObject);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, thisObject);
            loader.responseType = egret.HttpResponseType.TEXT;
            loader.open(url);
            loader.send();
        };
        return DefaultThemeAdapter;
    }());
    eui.DefaultThemeAdapter = DefaultThemeAdapter;
    __reflect(DefaultThemeAdapter.prototype, "eui.DefaultThemeAdapter", ["eui.IThemeAdapter"]);
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * @private
     */
    var listeners = "__listeners__";
    /**
     * @private
     */
    var bindables = "__bindables__";
    /**
     * @private
     */
    var bindableCount = 0;
    /**
     * @private
     *
     * @param host
     * @param property
     * @returns
     */
    function getPropertyDescriptor(host, property) {
        var data = Object.getOwnPropertyDescriptor(host, property);
        if (data) {
            return data;
        }
        var prototype = Object.getPrototypeOf(host);
        if (prototype) {
            return getPropertyDescriptor(prototype, property);
        }
        return null;
    }
    function notifyListener(host, property) {
        var list = host[listeners];
        var length = list.length;
        for (var i = 0; i < length; i += 2) {
            var listener = list[i];
            var target = list[i + 1];
            listener.call(target, property);
        }
    }
    /**
     * The Watcher class defines utility method that you can use with bindable properties.
     * These methods let you define an event handler that is executed whenever a bindable property is updated.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     * @language en_US
     */
    /**
     * Watcher 类能够监视可绑定属性的改变，您可以定义一个事件处理函数作为 Watcher 的回调方法，在每次可绑定属性的值改变时都执行此函数。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     * @language zh_CN
     */
    var Watcher = (function () {
        /**
         * Constructor.
         * Not for public use. This method is called only from the <code>watch()</code> method.
         * See the <code>watch()</code> method for parameter usage.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数，非公开。只能从 watch() 方法中调用此方法。有关参数用法，请参阅 watch() 方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Watcher(property, handler, thisObject, next) {
            /**
             * @private
             */
            this.isExecuting = false;
            this.property = property;
            this.handler = handler;
            this.next = next;
            this.thisObject = thisObject;
        }
        /**
         * Creates and starts a Watcher instance.
         * The Watcher can only watch the property of a Object which host is instance of egret.IEventDispatcher.
         * @param host The object that hosts the property or property chain to be watched.
         * You can use the use the <code>reset()</code> method to change the value of the <code>host</code> argument
         * after creating the Watcher instance.
         * The <code>host</code> maintains a list of <code>handlers</code> to invoke when <code>prop</code> changes.
         * @param chain A value specifying the property or chain to be watched.
         * For example, to watch the property <code>host.a.b.c</code>,
         * call the method as: <code>watch(host, ["a","b","c"], ...)</code>.
         * @param handler  An event handler function called when the value of the watched property
         * (or any property in a watched chain) is modified.
         * @param thisObject <code>this</code> object of which binding with handler
         * @returns he ChangeWatcher instance, if at least one property name has been specified to
         * the <code>chain</code> argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建并启动 Watcher 实例。注意：Watcher 只能监视 host 为 egret.IEventDispatcher 对象的属性改变。若属性链中某个属性所对应的实例不是 egret.IEventDispatcher，
         * 则属性链中在它之后的属性改变将无法检测到。
         * @param host 用于承载要监视的属性或属性链的对象。
         * 创建Watcher实例后，您可以利用<code>reset()</code>方法更改<code>host</code>参数的值。
         * 当<code>prop</code>改变的时候，会使得host对应的一系列<code>handlers</code>被触发。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：watch¬(host, ["a","b","c"], ...)。
         * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
         * @param thisObject handler 方法绑定的this对象
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Watcher.watch = function (host, chain, handler, thisObject) {
            if (true) {
                if (!chain) {
                    egret.$error(1003, "chain");
                }
            }
            if (chain.length > 0) {
                var property = chain.shift();
                var next = Watcher.watch(null, chain, handler, thisObject);
                var watcher = new Watcher(property, handler, thisObject, next);
                watcher.reset(host);
                return watcher;
            }
            else {
                return null;
            }
        };
        /**
         * @private
         * 检查属性是否可以绑定。若还未绑定，尝试添加绑定事件。若是只读或只写属性，返回false。
         */
        Watcher.checkBindable = function (host, property) {
            var list = host[bindables];
            if (list && list.indexOf(property) != -1) {
                return true;
            }
            var isEventDispatcher = egret.is(host, "egret.IEventDispatcher");
            if (!isEventDispatcher && !host[listeners]) {
                host[listeners] = [];
            }
            var data = getPropertyDescriptor(host, property);
            if (data && data.set && data.get) {
                var orgSet_1 = data.set;
                data.set = function (value) {
                    if (this[property] != value) {
                        orgSet_1.call(this, value);
                        if (isEventDispatcher) {
                            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, property);
                        }
                        else {
                            notifyListener(this, property);
                        }
                    }
                };
            }
            else if (!data || (!data.get && !data.set)) {
                bindableCount++;
                var newProp_1 = "_" + bindableCount + property;
                host[newProp_1] = data ? data.value : null;
                data = { enumerable: true, configurable: true };
                data.get = function () {
                    return this[newProp_1];
                };
                data.set = function (value) {
                    if (this[newProp_1] != value) {
                        this[newProp_1] = value;
                        if (isEventDispatcher) {
                            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, property);
                        }
                        else {
                            notifyListener(this, property);
                        }
                    }
                };
            }
            else {
                return false;
            }
            Object.defineProperty(host, property, data);
            eui.registerBindable(host, property);
        };
        /**
         * Detaches this Watcher instance, and its handler function, from the current host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从当前宿主中断开此 Watcher 实例及其处理函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Watcher.prototype.unwatch = function () {
            this.reset(null);
            this.handler = null;
            if (this.next) {
                this.next.handler = null;
            }
        };
        /**
         * Retrieves the current value of the watched property or property chain, or null if the host object is null.
         * @example
         * <pre>
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * </pre>
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 检索观察的属性或属性链的当前值，当宿主对象为空时此值为空。
         * @example
         * <pre>
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * </pre>
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Watcher.prototype.getValue = function () {
            if (this.next) {
                return this.next.getValue();
            }
            return this.getHostPropertyValue();
        };
        /**
         * Sets the handler function.s
         * @param handler The handler function. This argument must not be null.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 设置处理函数。
         * @param handler 处理函数，此参数必须为非空。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Watcher.prototype.setHandler = function (handler, thisObject) {
            this.handler = handler;
            this.thisObject = thisObject;
            if (this.next) {
                this.next.setHandler(handler, thisObject);
            }
        };
        /**
         * Resets this ChangeWatcher instance to use a new host object.
         * You can call this method to reuse a watcher instance on a different host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 重置此 Watcher 实例使用新的宿主对象。
         * 您可以通过该方法实现一个Watcher实例用于不同的宿主。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Watcher.prototype.reset = function (newHost) {
            var oldHost = this.host;
            if (oldHost) {
                if (egret.is(oldHost, "egret.IEventDispatcher")) {
                    oldHost.removeEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.wrapHandler, this);
                }
                else {
                    var list = oldHost[listeners];
                    var index = list.indexOf(this);
                    list.splice(index - 1, 2);
                }
            }
            this.host = newHost;
            if (newHost) {
                Watcher.checkBindable(newHost, this.property);
                if (egret.is(newHost, "egret.IEventDispatcher")) {
                    newHost.addEventListener(eui.PropertyEvent.PROPERTY_CHANGE, this.wrapHandler, this, false, 100);
                }
                else {
                    var list = newHost[listeners];
                    list.push(this.onPropertyChange);
                    list.push(this);
                }
            }
            if (this.next)
                this.next.reset(this.getHostPropertyValue());
        };
        /**
         * @private
         *
         * @returns
         */
        Watcher.prototype.getHostPropertyValue = function () {
            return this.host ? this.host[this.property] : null;
        };
        /**
         * @private
         */
        Watcher.prototype.wrapHandler = function (event) {
            this.onPropertyChange(event.property);
        };
        /**
         * @private
         */
        Watcher.prototype.onPropertyChange = function (property) {
            if (property == this.property && !this.isExecuting) {
                try {
                    this.isExecuting = true;
                    if (this.next)
                        this.next.reset(this.getHostPropertyValue());
                    this.handler.call(this.thisObject, this.getValue());
                }
                finally {
                    this.isExecuting = false;
                }
            }
        };
        return Watcher;
    }());
    eui.Watcher = Watcher;
    __reflect(Watcher.prototype, "eui.Watcher");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    function joinValues(templates) {
        var first = templates[0];
        var value = first instanceof eui.Watcher ? first.getValue() : first;
        var length = templates.length;
        for (var i = 1; i < length; i++) {
            var item = templates[i];
            if (item instanceof eui.Watcher) {
                item = item.getValue();
            }
            value += item;
        }
        return value;
    }
    /**
     * The Binding class defines utility methods for performing data binding.
     * You can use the methods defined in this class to configure data bindings.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/BindingExample.ts
     * @language en_US
     */
    /**
     * 绑定工具类，用于执行数据绑定用的方法集。您可以使用此类中定义的方法来配置数据绑定。
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/BindingExample.ts
     * @language zh_CN
     */
    var Binding = (function () {
        function Binding() {
        }
        /**
         * Binds a property, <prop>prop</code> on the <code>target</code> Object, to a bindable property or peoperty chain.
         * @param host The object that hosts the property or property chain to be watched.
         * The <code>host</code> maintains a list of <code>targets</code> to update theirs <code>prop</code> when <code>chain</code> changes.
         * @param chain A value specifying the property or chain to be watched. For example, when watch the property <code>host.a.b.c</code>,
         * you need call the method like this: <code>indProperty(host, ["a","b","c"], ...)</code>
         * @param target The Object defining the property to be bound to <code>chain</code>.
         * @param prop The name of the public property defined in the <code>site</code> Object to be bound.
         * @returns A ChangeWatcher instance, if at least one property name has been specified
         * to the <code>chain</code> argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绑定一个对象的属性值到要监视的对象属性上。
         * @param host 用于承载要监视的属性或属性链的对象。
         * 当 <code>host</code>上<code>chain</code>所对应的值发生改变时，<code>target</code>上的<code>prop</code>属性将被自动更新。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 <code>host.a.b.c</code>，需按以下形式调用此方法：<code>bindProperty(host, ["a","b","c"], ...)。</code>
         * @param target 本次绑定要更新的目标对象。
         * @param prop 本次绑定要更新的目标属性名称。
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Binding.bindProperty = function (host, chain, target, prop) {
            var watcher = eui.Watcher.watch(host, chain, null, null);
            if (watcher) {
                var assign = function (value) {
                    target[prop] = value;
                };
                watcher.setHandler(assign, null);
                assign(watcher.getValue());
            }
            return watcher;
        };
        /**
         * Binds a callback, <prop>handler</code> on the <code>target</code> Object, to a bindable property or peoperty chain.
         * Callback method to invoke with an argument of the current value of <code>chain</code> when that value changes.
         * @param host The object that hosts the property or property chain to be watched.
         * @param chain A value specifying the property or chain to be watched. For example, when watch the property <code>host.a.b.c</code>,
         * you need call the method like this: <code>indProperty(host, ["a","b","c"], ...)</code>
         * @param handler method to invoke with an argument of the current value of <code>chain</code> when that value changes.
         * @param thisObject <code>this</code> object of binding method
         * @returns A ChangeWatcher instance, if at least one property name has been  specified to the <code>chain</code> argument; null otherwise.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 绑定一个回调函数到要监视的对象属性上。当 host上 chain 所对应的值发生改变时，handler 方法将被自动调用。
         * @param host 用于承载要监视的属性或属性链的对象。
         * @param chain 用于指定要监视的属性链的值。例如，要监视属性 host.a.b.c，需按以下形式调用此方法：bindSetter(host, ["a","b","c"], ...)。
         * @param handler 在监视的目标属性链中任何属性的值发生改变时调用的事件处理函数。
         * @param thisObject handler 方法绑定的this对象
         * @returns 如果已为 chain 参数至少指定了一个属性名称，则返回 Watcher 实例；否则返回 null。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Binding.bindHandler = function (host, chain, handler, thisObject) {
            var watcher = eui.Watcher.watch(host, chain, handler, thisObject);
            if (watcher) {
                handler.call(thisObject, watcher.getValue());
            }
            return watcher;
        };
        Binding.$bindProperties = function (host, templates, chainIndex, target, prop) {
            if (templates.length == 1 && chainIndex.length == 1) {
                return Binding.bindProperty(host, templates[0].split("."), target, prop);
            }
            var assign = function () {
                target[prop] = joinValues(templates);
            };
            var length = chainIndex.length;
            var watcher;
            for (var i = 0; i < length; i++) {
                var index = chainIndex[i];
                var chain = templates[index].split(".");
                watcher = eui.Watcher.watch(host, chain, null, null);
                if (watcher) {
                    templates[index] = watcher;
                    watcher.setHandler(assign, null);
                }
            }
            assign();
            return watcher;
        };
        return Binding;
    }());
    eui.Binding = Binding;
    __reflect(Binding.prototype, "eui.Binding");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
/// <reference path="../utils/registerProperty.ts" />
/// <reference path="../utils/registerBindable.ts" />
var eui;
(function (eui) {
    /**
     * The ArrayCollection class is a wrapper class that exposes an <code>any[]</code> as a collection that can be
     * accessed and manipulated using the methods and properties of the <code>ICollection</code> interfaces.
     * ArrayCollection can notify the view to update item when data source changed.
     *
     * @event eui.CollectionEvent.COLLECTION_CHANGE Dispatched when the ArrayCollection has been updated in some way.
     *
     * @defaultProperty source
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/collections/ArrayCollectionExample.ts
     * @language en_US
     */
    /**
     * ArrayCollection 类是数组的集合类数据结构包装器，可使用<code>ICollection</code>接口的方法和属性对其进行访问和处理。
     * 使用这种数据结构包装普通数组，能在数据源发生改变的时候主动通知视图刷新变更数据项。
     *
     * @event eui.CollectionEvent.COLLECTION_CHANGE 当 ArrayCollection 更新的的时候会派发此事件。
     *
     * @defaultProperty source
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/collections/ArrayCollectionExample.ts
     * @language zh_CN
     */
    var ArrayCollection = (function (_super) {
        __extends(ArrayCollection, _super);
        /**
         * Constructor. <p/>
         * Creates a new ArrayCollection using the specified source array.
         * If no array is specified an empty array will be used.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。<p/>
         * 用指定的原始数组创建一个 ArrayCollection 实例。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function ArrayCollection(source) {
            var _this = _super.call(this) || this;
            if (source) {
                _this._source = source;
            }
            else {
                _this._source = [];
            }
            return _this;
        }
        Object.defineProperty(ArrayCollection.prototype, "source", {
            /**
             * The source of data in the ArrayCollection.
             * The ArrayCollection object does not represent any changes that you make
             * directly to the source array. Always use the ICollection methods to view the collection.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 数据源
             * 通常情况下请不要直接调用Array的方法操作数据源，否则对应的视图无法收到数据改变的通知。通常都是通过ICollection的接口方法来查看数据。
             * 若对数据源进行了修改，请手动调用refresh()方法刷新数据。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._source;
            },
            set: function (value) {
                if (!value)
                    value = [];
                this._source = value;
                this.dispatchCoEvent(eui.CollectionEventKind.RESET);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Applies the sort and filter to the view.
         * The ArrayCollection does not detect source data changes automatically,
         * so you must call the <code>refresh()</code>
         * method to update the view after changing the source data.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在对数据源进行排序或过滤操作后可以手动调用此方法刷新所有数据,以更新视图。
         * ArrayCollection 不会自动检原始数据进行了改变,所以你必须调用<code>refresh()</code>方法去更新显示。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ArrayCollection.prototype.refresh = function () {
            this.dispatchCoEvent(eui.CollectionEventKind.REFRESH);
        };
        Object.defineProperty(ArrayCollection.prototype, "length", {
            //--------------------------------------------------------------------------
            //
            // ICollection接口实现方法
            //
            //--------------------------------------------------------------------------
            /**
             * @inheritDoc
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this._source.length;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Adds the specified item to the end of the list.
         * Equivalent to <code>addItemAt(item, length)</code>.
         * @param item The item to add.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 向列表末尾添加指定项目。等效于 <code>addItemAt(item, length)</code>。
         * @param item 要被添加的项。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ArrayCollection.prototype.addItem = function (item) {
            this._source.push(item);
            this.dispatchCoEvent(eui.CollectionEventKind.ADD, this._source.length - 1, -1, [item]);
        };
        /**
         * Adds the item at the specified index.
         * The index of any item greater than the index of the added item is increased by one.
         * If the the specified index is less than zero or greater than the length
         * of the list, a Error which code is 1007 is thrown.
         * @param item The item to place at the index.
         * @param index The index at which to place the item.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 在指定的索引处添加项目。
         * 任何大于已添加项目的索引的项目索引都会增加 1。
         * 如果指定的索引比0小或者比最大长度要大。则会抛出1007异常。
         * @param item 要添加的项
         * @param index 要添加的指定索引位置
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ArrayCollection.prototype.addItemAt = function (item, index) {
            if (index < 0 || index > this._source.length) {
                true && egret.$error(1007);
            }
            this._source.splice(index, 0, item);
            this.dispatchCoEvent(eui.CollectionEventKind.ADD, index, -1, [item]);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ArrayCollection.prototype.getItemAt = function (index) {
            return this._source[index];
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ArrayCollection.prototype.getItemIndex = function (item) {
            var length = this._source.length;
            for (var i = 0; i < length; i++) {
                if (this._source[i] === item) {
                    return i;
                }
            }
            return -1;
        };
        /**
         * Notifies the view that an item has been updated.
         * @param item The item within the view that was updated.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 通知视图，某个项目的属性已更新。
         * @param item 视图中需要被更新的项。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ArrayCollection.prototype.itemUpdated = function (item) {
            var index = this.getItemIndex(item);
            if (index != -1) {
                this.dispatchCoEvent(eui.CollectionEventKind.UPDATE, index, -1, [item]);
            }
        };
        /**
         * Removes all items from the list.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 删除列表中的所有项目。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ArrayCollection.prototype.removeAll = function () {
            var items = this._source.concat();
            this._source = [];
            this.dispatchCoEvent(eui.CollectionEventKind.REMOVE, 0, -1, items);
        };
        /**
         * Removes the item at the specified index and returns it.
         * Any items that were after this index are now one index earlier.
         * @param index The index from which to remove the item.
         * @return The item that was removed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 删除指定索引处的项目并返回该项目。原先位于此索引之后的所有项目的索引现在都向前移动一个位置。
         * @param index 要被移除的项的索引。
         * @return 被移除的项。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ArrayCollection.prototype.removeItemAt = function (index) {
            if (index < 0 || index >= this._source.length) {
                true && egret.$error(1007);
                return;
            }
            var item = this._source.splice(index, 1)[0];
            this.dispatchCoEvent(eui.CollectionEventKind.REMOVE, index, -1, [item]);
            return item;
        };
        /**
         * Replaces the item at the specified index.
         * @param item The new item to be placed at the specified index.
         * @param index The index at which to place the item.
         * @return The item that was replaced, or <code>null</code> if none.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 替换在指定索引处的项目，并返回该项目。
         * @param item 要在指定索引放置的新的项。
         * @param index 要被替换的项的索引位置。
         * @return 被替换的项目，如果没有该项则返回<code>null</code> 。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ArrayCollection.prototype.replaceItemAt = function (item, index) {
            if (index < 0 || index >= this._source.length) {
                true && egret.$error(1007);
                return;
            }
            var oldItem = this._source.splice(index, 1, item)[0];
            this.dispatchCoEvent(eui.CollectionEventKind.REPLACE, index, -1, [item], [oldItem]);
            return oldItem;
        };
        /**
         * Replaces all items with a new source data, this method can not reset the scroller position of view.
         * @param newSource new source data.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 用新数据源替换原始数据源，此方法与直接设置source不同，它不会导致目标视图重置滚动位置。
         * @param newSource 新数据。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ArrayCollection.prototype.replaceAll = function (newSource) {
            if (!newSource)
                newSource = [];
            var newLength = newSource.length;
            var oldLength = this._source.length;
            for (var i = newLength; i < oldLength; i++) {
                this.removeItemAt(newLength);
            }
            for (var i = 0; i < newLength; i++) {
                if (i >= oldLength)
                    this.addItemAt(newSource[i], i);
                else
                    this.replaceItemAt(newSource[i], i);
            }
            this._source = newSource;
        };
        /**
         * @private
         * 抛出事件
         */
        ArrayCollection.prototype.dispatchCoEvent = function (kind, location, oldLocation, items, oldItems) {
            eui.CollectionEvent.dispatchCollectionEvent(this, eui.CollectionEvent.COLLECTION_CHANGE, kind, location, oldLocation, items, oldItems);
        };
        return ArrayCollection;
    }(egret.EventDispatcher));
    eui.ArrayCollection = ArrayCollection;
    __reflect(ArrayCollection.prototype, "eui.ArrayCollection", ["eui.ICollection", "egret.IEventDispatcher"]);
    eui.registerProperty(ArrayCollection, "source", "Array", true);
})(eui || (eui = {}));
var eui;
(function (eui) {
    var UIImpl = eui.sys.UIComponentImpl;
    /**
     * Editable text for displaying,
     * scrolling, selecting, and editing text.
     * @includeExample  extension/eui/components/EditablTextExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 可编辑文本，用于显示、滚动、选择和编辑文本。
     * @includeExample  extension/eui/components/EditablTextExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var EditableText = (function (_super) {
        __extends(EditableText, _super);
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function EditableText() {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this._widthConstraint = NaN;
            /**
             * @private
             */
            _this.$isShowPrompt = false;
            /**
             * @private
             */
            _this.$promptColor = 0x666666;
            /**
             * @private
             */
            _this.$isFocusIn = false;
            _this.initializeUIValues();
            _this.type = egret.TextFieldType.INPUT;
            _this.$EditableText = {
                0: null,
                1: 0xffffff,
                2: false //asPassword
            };
            return _this;
        }
        /**
         * @private
         *
         */
        EditableText.prototype.$invalidateTextField = function () {
            _super.prototype.$invalidateTextField.call(this);
            this.invalidateSize();
        };
        /**
         * @private
         *
         * @param value
         */
        EditableText.prototype.$setWidth = function (value) {
            var result1 = _super.prototype.$setWidth.call(this, value);
            var result2 = UIImpl.prototype.$setWidth.call(this, value);
            return result1 && result2;
        };
        /**
         * @private
         *
         * @param value
         */
        EditableText.prototype.$setHeight = function (value) {
            var result1 = _super.prototype.$setHeight.call(this, value);
            var result2 = UIImpl.prototype.$setHeight.call(this, value);
            return result1 && result2;
        };
        /**
         * @private
         *
         * @param value
         */
        EditableText.prototype.$getText = function () {
            var value = _super.prototype.$getText.call(this);
            if (value == this.$EditableText[0 /* promptText */]) {
                value = "";
            }
            return value;
        };
        /**
         * @private
         *
         * @param value
         */
        EditableText.prototype.$setText = function (value) {
            var promptText = this.$EditableText[0 /* promptText */];
            if (promptText != value || promptText == null) {
                this.$isShowPrompt = false;
                this.textColor = this.$EditableText[1 /* textColorUser */];
                this.displayAsPassword = this.$EditableText[2 /* asPassword */];
            }
            if (!this.$isFocusIn) {
                if (value == "" || value == null) {
                    value = promptText;
                    this.$isShowPrompt = true;
                    _super.prototype.$setTextColor.call(this, this.$promptColor);
                    _super.prototype.$setDisplayAsPassword.call(this, false);
                }
            }
            var result = _super.prototype.$setText.call(this, value);
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "text");
            return result;
        };
        /**
         * @private
         *
         * @param stage
         * @param nestLevel
         */
        EditableText.prototype.$onAddToStage = function (stage, nestLevel) {
            eui.sys.UIComponentImpl.prototype["$onAddToStage"].call(this, stage, nestLevel);
            this.addEventListener(egret.FocusEvent.FOCUS_IN, this.onfocusIn, this);
            this.addEventListener(egret.FocusEvent.FOCUS_OUT, this.onfocusOut, this);
        };
        /**
         * @private
         *
         */
        EditableText.prototype.$onRemoveFromStage = function () {
            eui.sys.UIComponentImpl.prototype["$onRemoveFromStage"].call(this);
            this.removeEventListener(egret.FocusEvent.FOCUS_IN, this.onfocusIn, this);
            this.removeEventListener(egret.FocusEvent.FOCUS_OUT, this.onfocusOut, this);
        };
        Object.defineProperty(EditableText.prototype, "prompt", {
            /**
             * When the property of the text is empty, it will show the defalut string.
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 当text属性为空字符串时要显示的文本内容。
             * 先创建文本控件时将显示提示文本。控件获得焦点时或控件的 text 属性为非空字符串时，提示文本将消失。
             * 控件失去焦点时提示文本将重新显示，但仅当未输入文本时（如果文本字段的值为空字符串）。<p/>
             * 对于文本控件，如果用户输入文本，但随后又将其删除，则控件失去焦点后，提示文本将重新显示。
             * 您还可以通过编程方式将文本控件的 text 属性设置为空字符串使提示文本重新显示。
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this.$EditableText[0 /* promptText */];
            },
            set: function (value) {
                var values = this.$EditableText;
                var promptText = values[0 /* promptText */];
                if (promptText == value)
                    return;
                values[0 /* promptText */] = value;
                var text = this.text;
                if (!text || text == promptText) {
                    this.showPromptText();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(EditableText.prototype, "promptColor", {
            get: function () {
                return this.$promptColor;
            },
            /**
             * The color of the defalut string.
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 默认文本的颜色
             * @version Egret 2.5.5
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            set: function (value) {
                value = +value | 0;
                if (this.$promptColor != value) {
                    this.$promptColor = value;
                    var text = this.text;
                    if (!text || text == this.$EditableText[0 /* promptText */]) {
                        this.showPromptText();
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         */
        EditableText.prototype.onfocusOut = function () {
            this.$isFocusIn = false;
            if (!this.text) {
                this.showPromptText();
            }
        };
        /**
         * @private
         */
        EditableText.prototype.onfocusIn = function () {
            this.$isFocusIn = true;
            this.$isShowPrompt = false;
            this.displayAsPassword = this.$EditableText[2 /* asPassword */];
            var values = this.$EditableText;
            var text = this.text;
            if (!text || text == values[0 /* promptText */]) {
                this.textColor = values[1 /* textColorUser */];
                this.text = "";
            }
        };
        /**
         * @private
         */
        EditableText.prototype.showPromptText = function () {
            var values = this.$EditableText;
            this.$isShowPrompt = true;
            _super.prototype.$setTextColor.call(this, this.$promptColor);
            _super.prototype.$setDisplayAsPassword.call(this, false);
            this.text = values[0 /* promptText */];
        };
        /**
         * @private
         */
        EditableText.prototype.$setTextColor = function (value) {
            value = +value | 0;
            this.$EditableText[1 /* textColorUser */] = value;
            if (!this.$isShowPrompt) {
                _super.prototype.$setTextColor.call(this, value);
            }
            return true;
        };
        /**
         * @private
         */
        EditableText.prototype.$setDisplayAsPassword = function (value) {
            this.$EditableText[2 /* asPassword */] = value;
            if (!this.$isShowPrompt) {
                _super.prototype.$setDisplayAsPassword.call(this, value);
            }
            return true;
        };
        /**
         * @copy eui.Component#createChildren()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.createChildren = function () {
            this.onfocusOut();
        };
        /**
         * @copy eui.Component#childrenCreated()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.childrenCreated = function () {
        };
        /**
         * @copy eui.Component#commitProperties()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.commitProperties = function () {
        };
        /**
         * @copy eui.Component#measure()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.measure = function () {
            var values = this.$UIComponent;
            var textValues = this.$TextField;
            var oldWidth = textValues[3 /* textFieldWidth */];
            var availableWidth = NaN;
            if (!isNaN(this._widthConstraint)) {
                availableWidth = this._widthConstraint;
                this._widthConstraint = NaN;
            }
            else if (!isNaN(values[8 /* explicitWidth */])) {
                availableWidth = values[8 /* explicitWidth */];
            }
            else if (values[13 /* maxWidth */] != 100000) {
                availableWidth = values[13 /* maxWidth */];
            }
            _super.prototype.$setWidth.call(this, availableWidth);
            this.setMeasuredSize(this.textWidth, this.textHeight);
            _super.prototype.$setWidth.call(this, oldWidth);
        };
        /**
         * @copy eui.Component#updateDisplayList()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            _super.prototype.$setWidth.call(this, unscaledWidth);
            _super.prototype.$setHeight.call(this, unscaledHeight);
        };
        /**
         * @copy eui.Component#invalidateParentLayout()
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.invalidateParentLayout = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.setMeasuredSize = function (width, height) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.invalidateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.validateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.invalidateSize = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.validateSize = function (recursive) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.invalidateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.validateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.validateNow = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.setLayoutBoundsSize = function (layoutWidth, layoutHeight) {
            UIImpl.prototype.setLayoutBoundsSize.call(this, layoutWidth, layoutHeight);
            if (isNaN(layoutWidth) || layoutWidth === this._widthConstraint || layoutWidth == 0) {
                return;
            }
            var values = this.$UIComponent;
            if (!isNaN(values[9 /* explicitHeight */])) {
                return;
            }
            if (layoutWidth == values[16 /* measuredWidth */]) {
                return;
            }
            this._widthConstraint = layoutWidth;
            this.invalidateSize();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.setLayoutBoundsPosition = function (x, y) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.getLayoutBounds = function (bounds) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        EditableText.prototype.getPreferredBounds = function (bounds) {
        };
        return EditableText;
    }(egret.TextField));
    eui.EditableText = EditableText;
    __reflect(EditableText.prototype, "eui.EditableText", ["eui.UIComponent", "egret.DisplayObject", "eui.IDisplayText"]);
    eui.sys.implementUIComponent(EditableText, egret.TextField);
    eui.registerBindable(EditableText.prototype, "text");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var sys;
    (function (sys) {
        /**
         * @private
         * 需要记录的历史速度的最大次数。
         */
        var MAX_VELOCITY_COUNT = 4;
        /**
         * @private
         * 记录的历史速度的权重列表。
         */
        var VELOCITY_WEIGHTS = [1, 1.33, 1.66, 2];
        /**
         * @private
         * 当前速度所占的权重。
         */
        var CURRENT_VELOCITY_WEIGHT = 2.33;
        /**
         * @private
         * 最小的改变速度，解决浮点数精度问题。
         */
        var MINIMUM_VELOCITY = 0.02;
        /**
         * @private
         * 当容器自动滚动时要应用的摩擦系数
         */
        var FRICTION = 0.998;
        /**
         * @private
         * 当容器自动滚动时并且滚动位置超出容器范围时要额外应用的摩擦系数
         */
        var EXTRA_FRICTION = 0.95;
        /**
         * @private
         * 摩擦系数的自然对数
         */
        var FRICTION_LOG = Math.log(FRICTION);
        /**
         * @private
         *
         * @param ratio
         * @returns
         */
        function easeOut(ratio) {
            var invRatio = ratio - 1.0;
            return invRatio * invRatio * invRatio + 1;
        }
        /**
         * @private
         * 一个工具类,用于容器的滚屏拖动操作，计算在一段时间持续滚动后释放，应该继续滚动到的值和缓动时间。
         * 使用此工具类，您需要创建一个 ScrollThrown 实例,并在滚动发生时调用start()方法，然后在触摸移动过程中调用update()更新当前舞台坐标。
         * 内部将会启动一个计时器定时根据当前位置计算出速度值，并缓存下来最后4个值。当停止滚动时，再调用finish()方法，
         * 将立即停止记录位移，并将计算出的最终结果存储到 Thrown.scrollTo 和 Thrown.duration 属性上。
         */
        var TouchScroll = (function () {
            /**
             * @private
             * 创建一个 TouchScroll 实例
             * @param updateFunction 滚动位置更新回调函数
             */
            function TouchScroll(updateFunction, endFunction, target) {
                /**
                 * @private
                 * 当前容器滚动外界可调节的系列
                 */
                this.$scrollFactor = 1.0;
                /**
                 * @private
                 */
                this.previousTime = 0;
                /**
                 * @private
                 */
                this.velocity = 0;
                /**
                 * @private
                 */
                this.previousVelocity = [];
                /**
                 * @private
                 */
                this.currentPosition = 0;
                /**
                 * @private
                 */
                this.previousPosition = 0;
                /**
                 * @private
                 */
                this.currentScrollPos = 0;
                /**
                 * @private
                 */
                this.maxScrollPos = 0;
                /**
                 * @private
                 * 触摸按下时的偏移量
                 */
                this.offsetPoint = 0;
                this.$bounces = true;
                this.started = true;
                if (true && !updateFunction) {
                    egret.$error(1003, "updateFunction");
                }
                this.updateFunction = updateFunction;
                this.endFunction = endFunction;
                this.target = target;
                this.animation = new sys.Animation(this.onScrollingUpdate, this);
                this.animation.endFunction = this.finishScrolling;
                this.animation.easerFunction = easeOut;
            }
            /**
             * @private
             * 正在播放缓动动画的标志。
             */
            TouchScroll.prototype.isPlaying = function () {
                return this.animation.isPlaying;
            };
            /**
             * @private
             * 如果正在执行缓动滚屏，停止缓动。
             */
            TouchScroll.prototype.stop = function () {
                this.animation.stop();
                egret.stopTick(this.onTick, this);
                this.started = false;
            };
            /**
             * @private
             * true表示已经调用过start方法。
             */
            TouchScroll.prototype.isStarted = function () {
                return this.started;
            };
            /**
             * @private
             * 开始记录位移变化。注意：当使用完毕后，必须调用 finish() 方法结束记录，否则该对象将无法被回收。
             * @param touchPoint 起始触摸位置，以像素为单位，通常是stageX或stageY。
             */
            TouchScroll.prototype.start = function (touchPoint) {
                this.started = true;
                this.velocity = 0;
                this.previousVelocity.length = 0;
                this.previousTime = egret.getTimer();
                this.previousPosition = this.currentPosition = touchPoint;
                this.offsetPoint = touchPoint;
                egret.startTick(this.onTick, this);
            };
            /**
             * @private
             * 更新当前移动到的位置
             * @param touchPoint 当前触摸位置，以像素为单位，通常是stageX或stageY。
             */
            TouchScroll.prototype.update = function (touchPoint, maxScrollValue, scrollValue) {
                maxScrollValue = Math.max(maxScrollValue, 0);
                this.currentPosition = touchPoint;
                this.maxScrollPos = maxScrollValue;
                var disMove = this.offsetPoint - touchPoint;
                var scrollPos = disMove + scrollValue;
                this.offsetPoint = touchPoint;
                if (scrollPos < 0) {
                    if (!this.$bounces) {
                        scrollPos = 0;
                    }
                    else {
                        scrollPos -= disMove * 0.5;
                    }
                }
                if (scrollPos > maxScrollValue) {
                    if (!this.$bounces) {
                        scrollPos = maxScrollValue;
                    }
                    else {
                        scrollPos -= disMove * 0.5;
                    }
                }
                this.currentScrollPos = scrollPos;
                this.updateFunction.call(this.target, scrollPos);
            };
            /**
             * @private
             * 停止记录位移变化，并计算出目标值和继续缓动的时间。
             * @param currentScrollPos 容器当前的滚动值。
             * @param maxScrollPos 容器可以滚动的最大值。当目标值不在 0~maxValue之间时，将会应用更大的摩擦力，从而影响缓动时间的长度。
             */
            TouchScroll.prototype.finish = function (currentScrollPos, maxScrollPos) {
                egret.stopTick(this.onTick, this);
                this.started = false;
                var sum = this.velocity * CURRENT_VELOCITY_WEIGHT;
                var previousVelocityX = this.previousVelocity;
                var length = previousVelocityX.length;
                var totalWeight = CURRENT_VELOCITY_WEIGHT;
                for (var i = 0; i < length; i++) {
                    var weight = VELOCITY_WEIGHTS[i];
                    sum += previousVelocityX[0] * weight;
                    totalWeight += weight;
                }
                var pixelsPerMS = sum / totalWeight;
                var absPixelsPerMS = Math.abs(pixelsPerMS);
                var duration = 0;
                var posTo = 0;
                if (absPixelsPerMS > MINIMUM_VELOCITY) {
                    posTo = currentScrollPos + (pixelsPerMS - MINIMUM_VELOCITY) / FRICTION_LOG * 2 * this.$scrollFactor;
                    if (posTo < 0 || posTo > maxScrollPos) {
                        posTo = currentScrollPos;
                        while (Math.abs(pixelsPerMS) > MINIMUM_VELOCITY) {
                            posTo -= pixelsPerMS;
                            if (posTo < 0 || posTo > maxScrollPos) {
                                pixelsPerMS *= FRICTION * EXTRA_FRICTION;
                            }
                            else {
                                pixelsPerMS *= FRICTION;
                            }
                            duration++;
                        }
                    }
                    else {
                        duration = Math.log(MINIMUM_VELOCITY / absPixelsPerMS) / FRICTION_LOG;
                    }
                }
                else {
                    posTo = currentScrollPos;
                }
                if (this.target["$getThrowInfo"]) {
                    var event_1 = this.target["$getThrowInfo"](currentScrollPos, posTo);
                    posTo = event_1.toPos;
                }
                if (duration > 0) {
                    //如果取消了回弹,保证动画之后不会超出边界
                    if (!this.$bounces) {
                        if (posTo < 0) {
                            posTo = 0;
                        }
                        else if (posTo > maxScrollPos) {
                            posTo = maxScrollPos;
                        }
                    }
                    this.throwTo(posTo, duration);
                }
                else {
                    this.finishScrolling();
                }
            };
            /**
             * @private
             *
             * @param timeStamp
             * @returns
             */
            TouchScroll.prototype.onTick = function (timeStamp) {
                var timeOffset = timeStamp - this.previousTime;
                if (timeOffset > 10) {
                    var previousVelocity = this.previousVelocity;
                    if (previousVelocity.length >= MAX_VELOCITY_COUNT) {
                        previousVelocity.shift();
                    }
                    this.velocity = (this.currentPosition - this.previousPosition) / timeOffset;
                    previousVelocity.push(this.velocity);
                    this.previousTime = timeStamp;
                    this.previousPosition = this.currentPosition;
                }
                return true;
            };
            /**
             * @private
             *
             * @param animation
             */
            TouchScroll.prototype.finishScrolling = function (animation) {
                var hsp = this.currentScrollPos;
                var maxHsp = this.maxScrollPos;
                var hspTo = hsp;
                if (hsp < 0) {
                    hspTo = 0;
                }
                if (hsp > maxHsp) {
                    hspTo = maxHsp;
                }
                this.throwTo(hspTo, 300);
            };
            /**
             * @private
             * 缓动到水平滚动位置
             */
            TouchScroll.prototype.throwTo = function (hspTo, duration) {
                if (duration === void 0) { duration = 500; }
                var hsp = this.currentScrollPos;
                if (hsp == hspTo) {
                    this.endFunction.call(this.target);
                    return;
                }
                var animation = this.animation;
                animation.duration = duration;
                animation.from = hsp;
                animation.to = hspTo;
                animation.play();
            };
            /**
             * @private
             * 更新水平滚动位置
             */
            TouchScroll.prototype.onScrollingUpdate = function (animation) {
                this.currentScrollPos = animation.currentValue;
                this.updateFunction.call(this.target, animation.currentValue);
            };
            return TouchScroll;
        }());
        sys.TouchScroll = TouchScroll;
        __reflect(TouchScroll.prototype, "eui.sys.TouchScroll");
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * Defines values for setting the <code>direction</code> property
     * of the <code>ProgressBar</code> class.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/core/DirectionExample.ts
     * @language en_US
     */
    /**
     * 定义进度条等控件增长方向的常量
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/core/DirectionExample.ts
     * @language zh_CN
     */
    var Direction = (function () {
        function Direction() {
        }
        /**
         * Specifies left-to-right direction.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 水平从左到右增长
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Direction.LTR = "ltr";
        /**
         * Specifies right-to-left direction.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 水平从右到左增长
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Direction.RTL = "rtl";
        /**
         * Specifies top-to-bottom direction.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 竖直从上到下增长
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Direction.TTB = "ttb";
        /**
         * Specifies bottom-to-top direction.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 竖直从下到上增长
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Direction.BTT = "btt";
        return Direction;
    }());
    eui.Direction = Direction;
    __reflect(Direction.prototype, "eui.Direction");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * Values for the <code>horizontalCanScroll</code> and
     * <code>verticalCanScroll</code> properties of the Scroller classes.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/core/ScrollPolicyExample.ts
     * @language en_US
     */
    /**
     * 滚动条显示策略常量。
     * Scroller 类的 <code>horizontalCanScroll</code> 和 <code>verticalCanScroll</code> 属性的值。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/core/ScrollPolicyExample.ts
     * @language zh_CN
     */
    var ScrollPolicy = (function () {
        function ScrollPolicy() {
        }
        /**
         * Show the scrollbar if the children exceed the owner's dimension.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 如果子项超出父级的尺寸，则允许滚动，反之不允许滚动。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ScrollPolicy.AUTO = "auto";
        /**
         * Never show the scrollbar.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 从不允许滚动。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ScrollPolicy.OFF = "off";
        /**
         * Always show the scrollbar.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 总是允许滚动。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ScrollPolicy.ON = "on";
        return ScrollPolicy;
    }());
    eui.ScrollPolicy = ScrollPolicy;
    __reflect(ScrollPolicy.prototype, "eui.ScrollPolicy");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * Note: The skin name values in the skin theme are used as default values,which can not be changed while running.
     * You can change the skin of a component with the skinName property.
     * @event egret.Event.COMPLETE Dispatch when EXML used in this theme is loaded and parsed.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/core/ThemeExample.ts
     * @language en_US
     */
    /**
     * 皮肤主题。注意：皮肤主题是一次性设置的默认值,并不能运行时切换所有组件默认皮肤。切换单个皮肤您可以自行对Component.skinName赋值来修改。
     * @event egret.Event.COMPLETE 当主题关联的EXML加载解析完成时派发
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/core/ThemeExample.ts
     * @language zh_CN
     */
    var Theme = (function (_super) {
        __extends(Theme, _super);
        /**
         * Create an instance of Theme
         * @param configURL the external theme path. if null, you need to register the default skin name with
         * mapSkin() manually.
         * @param stage current stage.
         * If null, you need to register with egret.registerImplementation("eui.Theme",theme)
         * manually.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个主题实例
         * @param configURL 要加载并解析的外部主题配置文件路径。若传入 null，将不进行配置文件加载，
         * 之后需要在外部以代码方式手动调用 mapSkin() 方法完成每条默认皮肤名的注册。
         * @param stage 当前舞台引用。
         * 若传入null，需要在外部手动调用 egret.registerImplementation("eui.Theme",theme) 来完成主题的注册。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function Theme(configURL, stage) {
            var _this = _super.call(this) || this;
            /**
             * @private
             */
            _this.delayList = [];
            /**
             * @private
             */
            _this.skinMap = {};
            /**
             * @private
             * styles 配置信息
             */
            _this.$styles = {};
            _this.initialized = !configURL;
            if (stage) {
                egret.registerImplementation("eui.Theme", _this);
            }
            _this.$configURL = configURL;
            _this.load(configURL);
            return _this;
        }
        /**
         * @private
         *
         * @param url
         */
        Theme.prototype.load = function (url) {
            var _this = this;
            eui.getTheme(url, function (data) { return _this.onConfigLoaded(data); });
        };
        /**
         * @private
         *
         * @param str
         */
        Theme.prototype.onConfigLoaded = function (str) {
            var data;
            if (typeof str == "string") {
                try {
                    data = JSON.parse(str);
                }
                catch (e) {
                    egret.$error(3000);
                }
            }
            else {
                data = str;
            }
            if (data && data.skins) {
                var skinMap = this.skinMap;
                var skins = data.skins;
                var keys = Object.keys(skins);
                var length_27 = keys.length;
                for (var i = 0; i < length_27; i++) {
                    var key = keys[i];
                    if (!skinMap[key]) {
                        this.mapSkin(key, skins[key]);
                    }
                }
            }
            if (data.styles) {
                this.$styles = data.styles;
            }
            var paths = data.paths;
            for (var path in paths) {
                window[path] = EXML.update(path, paths[path]);
            }
            if (!data.exmls || data.exmls.length == 0) {
                this.onLoaded();
            }
            else if (data.exmls[0]['gjs']) {
                data.exmls.forEach(function (exml) { return EXML.$parseURLContentAsJs(exml.path, exml.gjs, exml.className); });
                this.onLoaded();
            }
            else if (data.exmls[0]['content']) {
                data.exmls.forEach(function (exml) { return EXML.$parseURLContent(exml.path, exml.content); });
                this.onLoaded();
            }
            else {
                EXML.$loadAll(data.exmls, this.onLoaded, this, true);
            }
        };
        Theme.prototype.onLoaded = function (classes, urls) {
            this.initialized = true;
            this.handleDelayList();
            this.dispatchEventWith(egret.Event.COMPLETE);
        };
        /**
         * @private
         *
         */
        Theme.prototype.handleDelayList = function () {
            var list = this.delayList;
            var length = list.length;
            for (var i = 0; i < length; i++) {
                var client = list[i];
                if (!client.$Component[5 /* skinNameExplicitlySet */]) {
                    var skinName = this.getSkinName(client);
                    if (skinName) {
                        client.$Component[1 /* skinName */] = skinName;
                        client.$parseSkinName();
                    }
                }
            }
            list.length = 0;
        };
        /**
         * According to the host component to get the default skin name.
         * Search rules are as follows:
         * <li>1. Use the <code>hostComponentKey</code> of client to search.</li>
         * <li>2. Use the class name of client to search.</li>
         * <li>3. Use the parent class name of client to search.</li>
         * <li>4. Repeat step 3 until find the skin name or the parent is <code>eui.Component</code>.</li>
         * @param client the component need to get the default skin.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 根据主机组件，获取对应的默认皮肤名。查询规则如下：
         * <li>1.使用client的hostComponentKey作为键查询默认皮肤名。</li>
         * <li>2.使用client的类名作为键查询默认皮肤名。</li>
         * <li>3.使用client的父类名作为键查询默认皮肤名。</li>
         * <li>4.不断重复3直到查询到皮肤名或父类为eui.Component时停止。</li>
         * @param client 要获取默认皮肤的组件。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Theme.prototype.getSkinName = function (client) {
            if (!this.initialized) {
                if (this.delayList.indexOf(client) == -1) {
                    this.delayList.push(client);
                }
                return "";
            }
            var skinMap = this.skinMap;
            var skinName = skinMap[client.hostComponentKey];
            if (!skinName) {
                skinName = this.findSkinName(client);
            }
            return skinName;
        };
        /**
         * @private
         */
        Theme.prototype.findSkinName = function (prototype) {
            if (!prototype) {
                return "";
            }
            var key = prototype["__class__"];
            if (key === void 0) {
                return "";
            }
            var skinName = this.skinMap[key];
            if (skinName || key == "eui.Component") {
                return skinName;
            }
            return this.findSkinName(Object.getPrototypeOf(prototype));
        };
        /**
         * Map a default skin for the specified host component.
         * @param hostComponentKey the name of host component, such as "eui.Button".
         * @param skinName the name of skin, such as "app.MyButtonSkin".
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 为指定的主机组件映射一个默认皮肤。
         * @param hostComponentKey 主机组件名称，例如：“eui.Button”。
         * @param skinName 皮肤名称 例如："app.MyButtonSkin"。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        Theme.prototype.mapSkin = function (hostComponentKey, skinName) {
            if (true) {
                if (!hostComponentKey) {
                    egret.$error(1003, "hostComponentKey");
                }
                if (!skinName) {
                    egret.$error(1003, "skinName");
                }
            }
            this.skinMap[hostComponentKey] = skinName;
        };
        Theme.prototype.$getStyleConfig = function (style) {
            return this.$styles[style];
        };
        return Theme;
    }(egret.EventDispatcher));
    eui.Theme = Theme;
    __reflect(Theme.prototype, "eui.Theme");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The eui.CollectionEvent class represents an event that is
     * dispatched when the associated collection changes.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/CollectionEventExample.ts
     * @language en_US
     */
    /**
     * 集合类型数据改变事件
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/CollectionEventExample.ts
     * @language zh_CN
     */
    var CollectionEvent = (function (_super) {
        __extends(CollectionEvent, _super);
        /**
         * Constructor.
         *
         * @param type The event type; indicates the action that triggered the event.
         * @param bubbles Specifies whether the event can bubble
         * up the display list hierarchy.
         * @param cancelable Specifies whether the behavior
         * associated with the event can be prevented.
         * @param kind Indicates the kind of event that occured.
         * The parameter value can be one of the values in the CollectionEventKind
         * class, or <code>null</code>, which indicates that the kind is unknown.
         * @param location When the <code>kind</code> is
         * <code>CollectionEventKind.ADD</code>,
         * <code>CollectionEventKind.REMOVE</code>,
         * <code>CollectionEventKind.REPLACE</code>,or
         * <code>CollectionEventKind.UPDATE</code>
         * this value indicates at what location the item(s) specified
         * in the <code>items property</code> can be found
         * within the target collection.
         * @param oldLocation this value indicates
         * the old location within the target collection
         * of the item(s) specified in the <code>items</code> property.
         * @param items Array of objects with information about the items
         * affected by the event.
         * @param oldItems When the <code>kine</code> is <code>CollectionEventKind.REPLACE</code> the value represents
         * a list of items before replaced.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 CollectionEvent 实例
         *
         * @param type 事件类型；指示触发事件的动作。
         * @param bubbles 指定该事件是否可以在显示列表层次结构得到冒泡处理。
         * @param cancelable 指定是否可以防止与事件相关联的行为。
         * @param kind 指示发生的事件类型。此属性值可以是 CollectionEventKind 类中的一个值，也可以是 null，用于指示类型未知。
         * @param location 如果 kind 值为 <code>CollectionEventKind.ADD</code>,
         * <code>CollectionEventKind.REMOVE</code>,
         * <code>CollectionEventKind.REPLACE</code>,或
         * <code>CollectionEventKind.UPDATE</code>
         * 则此属性为 items 属性中指定的项目集合中零号元素的的索引。
         * @param oldLocation 此值指示 <code>items</code> 属性中指定的项目在目标集合中的原位置。
         * @param items 受事件影响的项目的列表。
         * @param oldItems 仅当kind的值为CollectionEventKind.REPLACE时，表示替换前的项目列表。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function CollectionEvent(type, bubbles, cancelable, kind, location, oldLocation, items, oldItems) {
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            _this.$initTo(kind, location, oldLocation, items, oldItems);
            return _this;
        }
        /**
         * @private
         *
         * @param kind
         * @param location
         * @param oldLocation
         * @param items
         * @param oldItems
         */
        CollectionEvent.prototype.$initTo = function (kind, location, oldLocation, items, oldItems) {
            this.kind = kind;
            this.location = +location | 0;
            this.oldLocation = +oldLocation | 0;
            this.items = items || [];
            this.oldItems = oldItems || [];
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        CollectionEvent.prototype.clean = function () {
            _super.prototype.clean.call(this);
            this.items = this.oldItems = null;
        };
        /**
         * Dispatch an event with specified EventDispatcher. The dispatched event will be cached in the object pool,
         * for the next cycle of reuse.
         *
         * @param target the target of event dispatcher.
         * @param eventType The event type; indicates the action that triggered the event.
         * @param kind Indicates the kind of event that occured.
         * The parameter value can be one of the values in the CollectionEventKind
         * class, or <code>null</code>, which indicates that the kind is unknown.
         * @param location When the <code>kind</code> is
         * <code>CollectionEventKind.ADD</code>,
         * <code>CollectionEventKind.REMOVE</code>,
         * <code>CollectionEventKind.REPLACE</code>,or
         * <code>CollectionEventKind.UPDATE</code>
         * this value indicates at what location the item(s) specified
         * in the <code>items property</code> can be found
         * within the target collection.
         * @param oldLocation this value indicates
         * the old location within the target collection
         * of the item(s) specified in the <code>items</code> property.
         * @param items Array of objects with information about the items
         * affected by the event.
         * @param oldItems When the <code>kine</code> is <code>CollectionEventKind.REPLACE</code> the value represents
         * a list of items before replaced.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         *
         * @param target 事件派发目标。
         * @param eventType 事件类型；指示触发事件的动作。
         * @param kind 指示发生的事件类型。此属性值可以是 CollectionEventKind 类中的一个值，也可以是 null，用于指示类型未知。
         * @param location 如果 kind 值为 <code>CollectionEventKind.ADD</code>,
         * <code>CollectionEventKind.REMOVE</code>,
         * <code>CollectionEventKind.REPLACE</code>,或
         * <code>CollectionEventKind.UPDATE</code>
         * 则此属性为 items 属性中指定的项目集合中零号元素的的索引。
         * @param oldLocation 此值指示 <code>items</code> 属性中指定的项目在目标集合中的原位置。
         * @param items 受事件影响的项目的列表。
         * @param oldItems 仅当kind的值为CollectionEventKind.REPLACE时，表示替换前的项目列表。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        CollectionEvent.dispatchCollectionEvent = function (target, eventType, kind, location, oldLocation, items, oldItems) {
            if (!target.hasEventListener(eventType)) {
                return true;
            }
            var event = egret.Event.create(CollectionEvent, eventType);
            event.$initTo(kind, location, oldLocation, items, oldItems);
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * Dispatched when a collection has changed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 集合类数据发生改变
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        CollectionEvent.COLLECTION_CHANGE = "collectionChange";
        return CollectionEvent;
    }(egret.Event));
    eui.CollectionEvent = CollectionEvent;
    __reflect(CollectionEvent.prototype, "eui.CollectionEvent");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The CollectionEventKind class contains constants for the valid values
     * of the <code>CollectionEvent</code> class <code>kind</code> property.
     * These constants indicate the kind of change that was made to the collection.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 定义 <code>CollectionEvent</code> 类 <code>kind</code> 属性的有效值的常量。
     * 这些常量指示对集合进行的更改类型。

     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var CollectionEventKind = (function () {
        function CollectionEventKind() {
        }
        /**
         * Indicates that the collection added an item or items.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示集合添加了一个或多个项目。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        CollectionEventKind.ADD = "add";
        /**
         * Indicates that the collection applied a sort, a filter, or both.
         * This change can potentially be easier to handle than a RESET.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示集合应用了排序或/和筛选。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        CollectionEventKind.REFRESH = "refresh";
        /**
         * Indicates that the collection removed an item or items.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示集合删除了一个或多个项目。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        CollectionEventKind.REMOVE = "remove";
        /**
         * Indicates that the item at the position identified by the
         * CollectionEvent <code>location</code> property has been replaced.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示已替换由 CollectionEvent.location 属性确定的位置处的项目。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        CollectionEventKind.REPLACE = "replace";
        /**
         * Indicates that the collection has changed so drastically that
         * a reset is required.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示集合已彻底更改，需要进行重置。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        CollectionEventKind.RESET = "reset";
        /**
         * Indicates that one or more items were updated within the collection.
         * The affected item(s)
         * are stored in the <code>CollectionEvent.items</code> property.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示集合中一个或多个项目进行了更新。受影响的项目将存储在  CollectionEvent.items 属性中。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        CollectionEventKind.UPDATE = "update";
        return CollectionEventKind;
    }());
    eui.CollectionEventKind = CollectionEventKind;
    __reflect(CollectionEventKind.prototype, "eui.CollectionEventKind");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * Represents events that are dispatched when a item has been touched.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/ItemTapEventExample.ts
     * @language en_US
     */
    /**
     * 列表项触碰事件
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/ItemTapEventExample.ts
     * @language zh_CN
     */
    var ItemTapEvent = (function (_super) {
        __extends(ItemTapEvent, _super);
        function ItemTapEvent() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            /**
             * The item in the data provider of the associated item.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 触发触摸事件的项呈示器数据源项。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.item = null;
            /**
             * The item renderer in the list of the associated item.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 触发触摸事件的项呈示器。
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.itemRenderer = null;
            /**
             * The index of the associated navigation item.
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 触发触摸事件的项索引
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            _this.itemIndex = -1;
            return _this;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        ItemTapEvent.prototype.clean = function () {
            _super.prototype.clean.call(this);
            this.item = this.itemRenderer = null;
        };
        /**
         * Dispatch an event with specified EventDispatcher. The dispatched event will be cached in the object pool,
         * for the next cycle of reuse.
         *
         * @param target the target of event dispatcher.
         * @param eventType The event type; indicates the action that triggered the event.
         * @param itemRenderer The item renderer in the list of the associated item.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 使用指定的 EventDispatcher 对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         *
         * @param target 事件派发目标
         * @param eventType 事件类型；指示触发事件的动作。
         * @param itemRenderer 触发触摸事件的项呈示器。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ItemTapEvent.dispatchItemTapEvent = function (target, eventType, itemRenderer) {
            if (!target.hasEventListener(eventType)) {
                return true;
            }
            var event = egret.Event.create(ItemTapEvent, eventType);
            event.item = itemRenderer.data;
            event.itemIndex = itemRenderer.itemIndex;
            event.itemRenderer = itemRenderer;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * The type of the event object for an <code>itemTap</code> event.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * <code>itemTap</code> 事件的对象类型。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ItemTapEvent.ITEM_TAP = "itemTap";
        return ItemTapEvent;
    }(egret.Event));
    eui.ItemTapEvent = ItemTapEvent;
    __reflect(ItemTapEvent.prototype, "eui.ItemTapEvent");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The PropertyChangeEvent class represents the event object
     * passed to the event listener when one of the properties of
     * an object has changed, and provides information about the change.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/PropertyEventExample.ts
     * @language en_US
     */
    /**
     * 对象的一个属性发生更改时传递到事件侦听器的事件。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/PropertyEventExample.ts
     * @language zh_CN
     */
    var PropertyEvent = (function (_super) {
        __extends(PropertyEvent, _super);
        /**
         * Constructor.
         *
         * @param type The event type; indicates the action that triggered the event.
         * @param bubbles Specifies whether the event can bubble
         * up the display list hierarchy.
         * @param cancelable Specifies whether the behavior
         * associated with the event can be prevented.
         * @param property Name of the property that changed.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个属性改变事件。
         *
         * @param type 事件类型；指示触发事件的动作。
         * @param bubbles 指定该事件是否可以在显示列表层次结构得到冒泡处理。
         * @param cancelable 指定是否可以防止与事件相关联的行为。
         * @param property 发生改变的属性名称。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function PropertyEvent(type, bubbles, cancelable, property) {
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            _this.property = property;
            return _this;
        }
        /**
         * Dispatch an event with specified EventDispatcher. The dispatched event will be cached in the object pool,
         * for the next cycle of reuse.
         *
         * @param target the target of event dispatcher.
         * @param eventType The event type; indicates the action that triggered the event.
         * @param property Name of the property that changed.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 使用指定的 EventDispatcher 对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         *
         * @param target 事件派发目标
         * @param eventType 事件类型；指示触发事件的动作。
         * @param property 发生改变的属性名称。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        PropertyEvent.dispatchPropertyEvent = function (target, eventType, property) {
            if (!target.hasEventListener(eventType)) {
                return true;
            }
            var event = egret.Event.create(PropertyEvent, eventType);
            event.property = property;
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * Dispatch when a property changed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 属性改变。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        PropertyEvent.PROPERTY_CHANGE = "propertyChange";
        return PropertyEvent;
    }(egret.Event));
    eui.PropertyEvent = PropertyEvent;
    __reflect(PropertyEvent.prototype, "eui.PropertyEvent");
})(eui || (eui = {}));
var eui;
(function (eui) {
    /**
     * @private
     */
    var ScrollerThrowEvent = (function (_super) {
        __extends(ScrollerThrowEvent, _super);
        /**
         * 动画信息，可调节或修改
         */
        //public tween;
        function ScrollerThrowEvent(type, bubbles, cancelable, currentPos, toPos) {
            var _this = _super.call(this, type, bubbles, cancelable) || this;
            currentPos = +currentPos;
            toPos = +toPos;
            _this.currentPos = currentPos;
            _this.toPos = toPos;
            return _this;
        }
        ScrollerThrowEvent.THROW = "throw";
        return ScrollerThrowEvent;
    }(egret.Event));
    eui.ScrollerThrowEvent = ScrollerThrowEvent;
    __reflect(ScrollerThrowEvent.prototype, "eui.ScrollerThrowEvent");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The UIEvent class represents the event object passed to
     * the event listener for many UI events.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/UIEventExample.ts
     * @language en_US
     */
    /**
     * UI事件
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/events/UIEventExample.ts
     * @language zh_CN
     */
    var UIEvent = (function (_super) {
        __extends(UIEvent, _super);
        /**
         * Constructor.
         *
         * @param type The event type; indicates the action that triggered the event.
         * @param bubbles Specifies whether the event can bubble
         * up the display list hierarchy.
         * @param cancelable Specifies whether the behavior
         * associated with the event can be prevented.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 UIEvent 实例
         *
         * @param type 事件类型；指示触发事件的动作。
         * @param bubbles 指定该事件是否可以在显示列表层次结构得到冒泡处理。
         * @param cancelable 指定是否可以防止与事件相关联的行为。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function UIEvent(type, bubbles, cancelable) {
            return _super.call(this, type, bubbles, cancelable) || this;
        }
        /**
         * Dispatch an event with specified EventDispatcher. The dispatched event will be cached in the object pool,
         * for the next cycle of reuse.
         *
         * @param target the target of event dispatcher.
         * @param eventType The event type; indicates the action that triggered the event.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         *
         * @param target 事件派发目标。
         * @param eventType 事件类型；指示触发事件的动作。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        UIEvent.dispatchUIEvent = function (target, eventType, bubbles, cancelable) {
            if (!target.hasEventListener(eventType)) {
                return true;
            }
            var event = egret.Event.create(UIEvent, eventType, bubbles, cancelable);
            var result = target.dispatchEvent(event);
            egret.Event.release(event);
            return result;
        };
        /**
         * creation complete of component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 组件创建完成
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        UIEvent.CREATION_COMPLETE = "creationComplete";
        /**
         * the ending of change.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 改变结束
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        UIEvent.CHANGE_END = "changeEnd";
        /**
         * The beginning of change.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 改变开始
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        UIEvent.CHANGE_START = "changeStart";
        /**
         * Before close the panel.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 即将关闭面板事件
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        UIEvent.CLOSING = "closing";
        /**
         * The coordinates of the UI components changed in it's parent.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * UI组件在父级容器中的坐标发生改变事件
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        UIEvent.MOVE = "move";
        return UIEvent;
    }(egret.Event));
    eui.UIEvent = UIEvent;
    __reflect(UIEvent.prototype, "eui.UIEvent");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var sys;
    (function (sys) {
        var STATE = "eui.State";
        var ADD_ITEMS = "eui.AddItems";
        var SET_PROPERTY = "eui.SetProperty";
        var SET_STATEPROPERTY = "eui.SetStateProperty";
        var BINDING_PROPERTIES = "eui.Binding.$bindProperties";
        /**
         * @private
         * 代码生成工具基类
         */
        var CodeBase = (function () {
            function CodeBase() {
                /**
                 * @private
                 */
                this.indent = 0;
            }
            /**
             * @private
             *
             * @returns
             */
            CodeBase.prototype.toCode = function () {
                return "";
            };
            /**
             * @private
             * 获取缩进字符串
             */
            CodeBase.prototype.getIndent = function (indent) {
                if (indent === void 0)
                    indent = this.indent;
                var str = "";
                for (var i = 0; i < indent; i++) {
                    str += "	";
                }
                return str;
            };
            return CodeBase;
        }());
        sys.CodeBase = CodeBase;
        __reflect(CodeBase.prototype, "eui.sys.CodeBase");
        /**
         * @private
         */
        var EXClass = (function (_super) {
            __extends(EXClass, _super);
            function EXClass() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * @private
                 * 类名,不包括模块名
                 */
                _this.className = "";
                /**
                 * @private
                 * 父类类名,包括完整模块名
                 */
                _this.superClass = "";
                /**
                 * @private
                 * 内部类区块
                 */
                _this.innerClassBlock = [];
                /**
                 * @private
                 * 变量定义区块
                 */
                _this.variableBlock = [];
                /**
                 * @private
                 * 函数定义区块
                 */
                _this.functionBlock = [];
                return _this;
            }
            /**
             * @private
             * 添加一个内部类
             */
            EXClass.prototype.addInnerClass = function (clazz) {
                if (this.innerClassBlock.indexOf(clazz) == -1) {
                    this.innerClassBlock.push(clazz);
                }
            };
            /**
             * @private
             * 添加变量
             */
            EXClass.prototype.addVariable = function (variableItem) {
                if (this.variableBlock.indexOf(variableItem) == -1) {
                    this.variableBlock.push(variableItem);
                }
            };
            /**
             * @private
             * 根据变量名获取变量定义
             */
            EXClass.prototype.getVariableByName = function (name) {
                var list = this.variableBlock;
                var length = list.length;
                for (var i = 0; i < length; i++) {
                    var item = list[i];
                    if (item.name == name) {
                        return item;
                    }
                }
                return null;
            };
            /**
             * @private
             * 添加函数
             */
            EXClass.prototype.addFunction = function (functionItem) {
                if (this.functionBlock.indexOf(functionItem) == -1) {
                    this.functionBlock.push(functionItem);
                }
            };
            /**
             * @private
             * 根据函数名返回函数定义块
             */
            EXClass.prototype.getFuncByName = function (name) {
                var list = this.functionBlock;
                var length = list.length;
                for (var i = 0; i < length; i++) {
                    var item = list[i];
                    if (item.name == name) {
                        return item;
                    }
                }
                return null;
            };
            /**
             * @private
             *
             * @returns
             */
            EXClass.prototype.toCode = function () {
                var indent = this.indent;
                var indentStr = this.getIndent(indent);
                var indent1Str = this.getIndent(indent + 1);
                var indent2Str = this.getIndent(indent + 2);
                //打印类起始块
                var returnStr = indentStr + "(function (";
                if (this.superClass) {
                    returnStr += "_super) {\n" + indent1Str + "__extends(" + this.className + ", _super);\n";
                }
                else {
                    returnStr += ") {\n";
                }
                //打印内部类列表
                var innerClasses = this.innerClassBlock;
                var length = innerClasses.length;
                for (var i = 0; i < length; i++) {
                    var clazz = innerClasses[i];
                    clazz.indent = indent + 1;
                    returnStr += indent1Str + "var " + clazz.className + " = " + clazz.toCode() + "\n\n";
                }
                returnStr += indent1Str + "function " + this.className + "() {\n";
                if (this.superClass) {
                    returnStr += indent2Str + "_super.call(this);\n";
                }
                //打印变量列表
                var variables = this.variableBlock;
                length = variables.length;
                for (var i = 0; i < length; i++) {
                    var variable = variables[i];
                    if (variable.defaultValue) {
                        returnStr += indent2Str + variable.toCode() + "\n";
                    }
                }
                //打印构造函数
                if (this.constructCode) {
                    var codes = this.constructCode.toCode().split("\n");
                    length = codes.length;
                    for (var i = 0; i < length; i++) {
                        var code = codes[i];
                        returnStr += indent2Str + code + "\n";
                    }
                }
                returnStr += indent1Str + "}\n";
                returnStr += indent1Str + "var _proto = " + this.className + ".prototype;\n\n";
                //打印函数列表
                var functions = this.functionBlock;
                length = functions.length;
                for (var i = 0; i < length; i++) {
                    var functionItem = functions[i];
                    functionItem.indent = indent + 1;
                    returnStr += functionItem.toCode() + "\n";
                }
                //打印类结尾
                returnStr += indent1Str + "return " + this.className + ";\n" + indentStr;
                if (this.superClass) {
                    returnStr += "})(" + this.superClass + ");";
                }
                else {
                    returnStr += "})();";
                }
                return returnStr;
            };
            return EXClass;
        }(CodeBase));
        sys.EXClass = EXClass;
        __reflect(EXClass.prototype, "eui.sys.EXClass");
        /**
         * @private
         */
        var EXCodeBlock = (function (_super) {
            __extends(EXCodeBlock, _super);
            function EXCodeBlock() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * @private
                 */
                _this.lines = [];
                return _this;
            }
            /**
             * @private
             * 添加变量声明语句
             * @param name 变量名
             * @param value 变量初始值
             */
            EXCodeBlock.prototype.addVar = function (name, value) {
                var valueStr = value ? " = " + value : "";
                this.addCodeLine("var " + name + valueStr + ";");
            };
            /**
             * @private
             * 添加赋值语句
             * @param target 要赋值的目标
             * @param value 值
             * @param prop 目标的属性(用“.”访问)，不填则是对目标赋值
             */
            EXCodeBlock.prototype.addAssignment = function (target, value, prop) {
                var propStr = prop ? "." + prop : "";
                this.addCodeLine(target + propStr + " = " + value + ";");
            };
            /**
             * @private
             * 添加返回值语句
             */
            EXCodeBlock.prototype.addReturn = function (data) {
                this.addCodeLine("return " + data + ";");
            };
            /**
             * @private
             * 添加一条空行
             */
            EXCodeBlock.prototype.addEmptyLine = function () {
                this.addCodeLine("");
            };
            /**
             * @private
             * 开始添加if语句块,自动调用startBlock();
             */
            EXCodeBlock.prototype.startIf = function (expression) {
                this.addCodeLine("if(" + expression + ")");
                this.startBlock();
            };
            /**
             * @private
             * 开始else语句块,自动调用startBlock();
             */
            EXCodeBlock.prototype.startElse = function () {
                this.addCodeLine("else");
                this.startBlock();
            };
            /**
             * @private
             * 开始else if语句块,自动调用startBlock();
             */
            EXCodeBlock.prototype.startElseIf = function (expression) {
                this.addCodeLine("else if(" + expression + ")");
                this.startBlock();
            };
            /**
             * @private
             * 添加一个左大括号，开始新的语句块
             */
            EXCodeBlock.prototype.startBlock = function () {
                this.addCodeLine("{");
                this.indent++;
            };
            /**
             * @private
             * 添加一个右大括号,结束当前的语句块
             */
            EXCodeBlock.prototype.endBlock = function () {
                this.indent--;
                this.addCodeLine("}");
            };
            /**
             * @private
             * 添加执行函数语句块
             * @param functionName 要执行的函数名称
             * @param args 函数参数列表
             */
            EXCodeBlock.prototype.doFunction = function (functionName, args) {
                var argsStr = args.join(",");
                this.addCodeLine(functionName + "(" + argsStr + ")");
            };
            /**
             * @private
             * 添加一行代码
             */
            EXCodeBlock.prototype.addCodeLine = function (code) {
                this.lines.push(this.getIndent() + code);
            };
            /**
             * @private
             * 添加一行代码到指定行
             */
            EXCodeBlock.prototype.addCodeLineAt = function (code, index) {
                this.lines.splice(index, 0, this.getIndent() + code);
            };
            /**
             * @private
             * 是否存在某行代码内容
             */
            EXCodeBlock.prototype.containsCodeLine = function (code) {
                return this.lines.indexOf(code) != -1;
            };
            /**
             * @private
             * 在结尾追加另一个代码块的内容
             */
            EXCodeBlock.prototype.concat = function (cb) {
                this.lines = this.lines.concat(cb.lines);
            };
            /**
             * @private
             *
             * @returns
             */
            EXCodeBlock.prototype.toCode = function () {
                return this.lines.join("\n");
            };
            return EXCodeBlock;
        }(CodeBase));
        sys.EXCodeBlock = EXCodeBlock;
        __reflect(EXCodeBlock.prototype, "eui.sys.EXCodeBlock");
        /**
         * @private
         */
        var EXFunction = (function (_super) {
            __extends(EXFunction, _super);
            function EXFunction() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                /**
                 * @private
                 * 代码块
                 */
                _this.codeBlock = null;
                /**
                 * @private
                 */
                _this.isGet = false;
                /**
                 * @private
                 * 函数名
                 */
                _this.name = "";
                return _this;
            }
            /**
             * @private
             *
             * @returns
             */
            EXFunction.prototype.toCode = function () {
                var indentStr = this.getIndent();
                var indent1Str = this.getIndent(this.indent + 1);
                var codeIndent;
                var returnStr = indentStr;
                if (this.isGet) {
                    codeIndent = this.getIndent(this.indent + 2);
                    returnStr += 'Object.defineProperty(_proto, "skinParts", {\n';
                    returnStr += indent1Str + "get: function () {\n";
                }
                else {
                    codeIndent = indent1Str;
                    returnStr += "_proto." + this.name + " = function () {\n";
                }
                if (this.codeBlock) {
                    var lines = this.codeBlock.toCode().split("\n");
                    var length_28 = lines.length;
                    for (var i = 0; i < length_28; i++) {
                        var line = lines[i];
                        returnStr += codeIndent + line + "\n";
                    }
                }
                if (this.isGet) {
                    returnStr += indent1Str + "},\n" + indent1Str + "enumerable: true,\n" +
                        indent1Str + "configurable: true\n" + indentStr + "});";
                }
                else {
                    returnStr += indentStr + "};";
                }
                return returnStr;
            };
            return EXFunction;
        }(CodeBase));
        sys.EXFunction = EXFunction;
        __reflect(EXFunction.prototype, "eui.sys.EXFunction");
        /**
         * @private
         */
        var EXVariable = (function (_super) {
            __extends(EXVariable, _super);
            /**
             * @private
             */
            function EXVariable(name, defaultValue) {
                var _this = _super.call(this) || this;
                _this.indent = 2;
                _this.name = name;
                _this.defaultValue = defaultValue;
                return _this;
            }
            /**
             * @private
             *
             * @returns
             */
            EXVariable.prototype.toCode = function () {
                if (!this.defaultValue) {
                    return "";
                }
                return "this." + this.name + " = " + this.defaultValue + ";";
            };
            return EXVariable;
        }(CodeBase));
        sys.EXVariable = EXVariable;
        __reflect(EXVariable.prototype, "eui.sys.EXVariable");
        /**
         * @private
         */
        var EXState = (function (_super) {
            __extends(EXState, _super);
            /**
             * @private
             */
            function EXState(name, stateGroups) {
                var _this = _super.call(this) || this;
                /**
                 * @private
                 * 视图状态名称
                 */
                _this.name = "";
                /**
                 * @private
                 */
                _this.stateGroups = [];
                /**
                 * @private
                 */
                _this.addItems = [];
                /**
                 * @private
                 */
                _this.setProperty = [];
                _this.name = name;
                if (stateGroups)
                    _this.stateGroups = stateGroups;
                return _this;
            }
            /**
             * @private
             * 添加一个覆盖
             */
            EXState.prototype.addOverride = function (item) {
                if (item instanceof EXAddItems)
                    this.addItems.push(item);
                else
                    this.setProperty.push(item);
            };
            /**
             * @private
             *
             * @returns
             */
            EXState.prototype.toCode = function () {
                var indentStr = this.getIndent(1);
                var returnStr = "new " + STATE + " (\"" + this.name + "\",\n" + indentStr + "[\n";
                var index = 0;
                var isFirst = true;
                var overrides = this.addItems.concat(this.setProperty);
                while (index < overrides.length) {
                    if (isFirst)
                        isFirst = false;
                    else
                        returnStr += ",\n";
                    var item = overrides[index];
                    var codes = item.toCode().split("\n");
                    var length_29 = codes.length;
                    for (var i = 0; i < length_29; i++) {
                        var code = codes[i];
                        codes[i] = indentStr + indentStr + code;
                    }
                    returnStr += codes.join("\n");
                    index++;
                }
                returnStr += "\n" + indentStr + "])";
                return returnStr;
            };
            return EXState;
        }(CodeBase));
        sys.EXState = EXState;
        __reflect(EXState.prototype, "eui.sys.EXState");
        /**
         * @private
         */
        var EXAddItems = (function (_super) {
            __extends(EXAddItems, _super);
            /**
             * @private
             */
            function EXAddItems(target, property, position, relativeTo) {
                var _this = _super.call(this) || this;
                _this.target = target;
                _this.property = property;
                _this.position = position;
                _this.relativeTo = relativeTo;
                return _this;
            }
            /**
             * @private
             *
             * @returns
             */
            EXAddItems.prototype.toCode = function () {
                var returnStr = "new " + ADD_ITEMS + "(\"" + this.target + "\",\"" + this.property + "\"," + this.position + ",\"" + this.relativeTo + "\")";
                return returnStr;
            };
            return EXAddItems;
        }(CodeBase));
        sys.EXAddItems = EXAddItems;
        __reflect(EXAddItems.prototype, "eui.sys.EXAddItems");
        /**
         * @private
         */
        var EXSetProperty = (function (_super) {
            __extends(EXSetProperty, _super);
            /**
             * @private
             */
            function EXSetProperty(target, name, value) {
                var _this = _super.call(this) || this;
                _this.target = target;
                _this.name = name;
                _this.value = value;
                return _this;
            }
            /**
             * @private
             *
             * @returns
             */
            EXSetProperty.prototype.toCode = function () {
                return "new " + SET_PROPERTY + "(\"" + this.target + "\",\"" + this.name + "\"," + this.value + ")";
            };
            return EXSetProperty;
        }(CodeBase));
        sys.EXSetProperty = EXSetProperty;
        __reflect(EXSetProperty.prototype, "eui.sys.EXSetProperty");
        /**
         * @private
         */
        var EXSetStateProperty = (function (_super) {
            __extends(EXSetStateProperty, _super);
            /**
             * @private
             */
            function EXSetStateProperty(target, property, templates, chainIndex) {
                var _this = _super.call(this) || this;
                if (target) {
                    target = "this." + target;
                }
                else {
                    target = "this";
                }
                _this.target = target;
                _this.property = property;
                _this.templates = templates;
                _this.chainIndex = chainIndex;
                return _this;
            }
            /**
             * @private
             *
             * @returns
             */
            EXSetStateProperty.prototype.toCode = function () {
                var expression = this.templates.join(",");
                var chain = this.chainIndex.join(",");
                return "new " + SET_STATEPROPERTY + "(this, [" + expression + "]," + "[" + chain + "]," +
                    this.target + ",\"" + this.property + "\")";
            };
            return EXSetStateProperty;
        }(CodeBase));
        sys.EXSetStateProperty = EXSetStateProperty;
        __reflect(EXSetStateProperty.prototype, "eui.sys.EXSetStateProperty");
        /**
         * @private
         */
        var EXBinding = (function (_super) {
            __extends(EXBinding, _super);
            /**
             * @private
             */
            function EXBinding(target, property, templates, chainIndex) {
                var _this = _super.call(this) || this;
                _this.target = target;
                _this.property = property;
                _this.templates = templates;
                _this.chainIndex = chainIndex;
                return _this;
            }
            /**
             * @private
             *
             * @returns
             */
            EXBinding.prototype.toCode = function () {
                var expression = this.templates.join(",");
                var chain = this.chainIndex.join(",");
                return BINDING_PROPERTIES + "(this, [" + expression + "]," + "[" + chain + "]," +
                    this.target + ",\"" + this.property + "\")";
            };
            return EXBinding;
        }(CodeBase));
        sys.EXBinding = EXBinding;
        __reflect(EXBinding.prototype, "eui.sys.EXBinding");
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
/// <reference path="../core/UIComponent.ts" />
var eui;
(function (eui) {
    var UIImpl = eui.sys.UIComponentImpl;
    /**
     * BitmapLabel is one line or multiline uneditable BitmapText
     * @version Egret 2.5.3
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * BitmapLabel 组件是一行或多行不可编辑的位图文本
     * @version Egret 2.5.3
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var BitmapLabel = (function (_super) {
        __extends(BitmapLabel, _super);
        function BitmapLabel(text) {
            var _this = _super.call(this) || this;
            _this.$createChildrenCalled = false;
            _this.$fontChanged = false;
            /**
             * @private
             */
            _this._widthConstraint = NaN;
            /**
             * @private
             */
            _this._heightConstraint = NaN;
            _this.initializeUIValues();
            _this.text = text;
            return _this;
        }
        /**
         * @private
         */
        BitmapLabel.prototype.$invalidateContentBounds = function () {
            _super.prototype.$invalidateContentBounds.call(this);
            this.invalidateSize();
        };
        /**
         * @private
         *
         * @param value
         */
        BitmapLabel.prototype.$setWidth = function (value) {
            var result1 = _super.prototype.$setWidth.call(this, value);
            var result2 = UIImpl.prototype.$setWidth.call(this, value);
            return result1 && result2;
        };
        /**
         * @private
         *
         * @param value
         */
        BitmapLabel.prototype.$setHeight = function (value) {
            var result1 = _super.prototype.$setHeight.call(this, value);
            var result2 = UIImpl.prototype.$setHeight.call(this, value);
            return result1 && result2;
        };
        /**
         * @private
         *
         * @param value
         */
        BitmapLabel.prototype.$setText = function (value) {
            var result = _super.prototype.$setText.call(this, value);
            eui.PropertyEvent.dispatchPropertyEvent(this, eui.PropertyEvent.PROPERTY_CHANGE, "text");
            return result;
        };
        BitmapLabel.prototype.$setFont = function (value) {
            if (this.$fontForBitmapLabel == value) {
                return false;
            }
            this.$fontForBitmapLabel = value;
            if (this.$createChildrenCalled) {
                this.$parseFont();
            }
            else {
                this.$fontChanged = true;
            }
            this.$fontStringChanged = true;
            return true;
        };
        /**
         * 解析source
         */
        BitmapLabel.prototype.$parseFont = function () {
            var _this = this;
            this.$fontChanged = false;
            var font = this.$fontForBitmapLabel;
            if (typeof font == "string") {
                eui.getAssets(font, function (bitmapFont) {
                    _this.$setFontData(bitmapFont, font);
                });
            }
            else {
                this.$setFontData(font);
            }
        };
        BitmapLabel.prototype.$setFontData = function (value, font) {
            if (font && font != this.$fontForBitmapLabel) {
                return;
            }
            if (value == this.$font) {
                return false;
            }
            this.$font = value;
            this.$invalidateContentBounds();
            return true;
        };
        /**
         * @copy eui.UIComponent#createChildren
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.createChildren = function () {
            if (this.$fontChanged) {
                this.$parseFont();
            }
            this.$createChildrenCalled = true;
        };
        /**
         * @copy eui.UIComponent#childrenCreated
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.childrenCreated = function () {
        };
        /**
         * @copy eui.UIComponent#commitProperties
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.commitProperties = function () {
        };
        /**
         * @copy eui.UIComponent#measure
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.measure = function () {
            var values = this.$UIComponent;
            var oldWidth = this.$textFieldWidth;
            var oldHeight = this.$textFieldHeight;
            var availableWidth = NaN;
            if (!isNaN(this._widthConstraint)) {
                availableWidth = this._widthConstraint;
                this._widthConstraint = NaN;
            }
            else if (!isNaN(values[8 /* explicitWidth */])) {
                availableWidth = values[8 /* explicitWidth */];
            }
            else if (values[13 /* maxWidth */] != 100000) {
                availableWidth = values[13 /* maxWidth */];
            }
            _super.prototype.$setWidth.call(this, availableWidth);
            var availableHeight = NaN;
            if (!isNaN(this._heightConstraint)) {
                availableHeight = this._heightConstraint;
                this._heightConstraint = NaN;
            }
            else if (!isNaN(values[9 /* explicitHeight */])) {
                availableHeight = values[9 /* explicitHeight */];
            }
            else if (values[15 /* maxHeight */] != 100000) {
                availableHeight = values[15 /* maxHeight */];
            }
            _super.prototype.$setHeight.call(this, availableHeight);
            this.setMeasuredSize(this.textWidth, this.textHeight);
            _super.prototype.$setWidth.call(this, oldWidth);
            _super.prototype.$setHeight.call(this, oldHeight);
        };
        /**
         * @copy eui.UIComponent#updateDisplayList
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            _super.prototype.$setWidth.call(this, unscaledWidth);
            _super.prototype.$setHeight.call(this, unscaledHeight);
        };
        /**
         * @copy eui.UIComponent#invalidateParentLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.invalidateParentLayout = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.setMeasuredSize = function (width, height) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.invalidateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.validateProperties = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.invalidateSize = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.validateSize = function (recursive) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.invalidateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.validateDisplayList = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.validateNow = function () {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.setLayoutBoundsSize = function (layoutWidth, layoutHeight) {
            UIImpl.prototype.setLayoutBoundsSize.call(this, layoutWidth, layoutHeight);
            if (isNaN(layoutWidth) || layoutWidth === this._widthConstraint || layoutWidth == 0) {
                return;
            }
            var values = this.$UIComponent;
            if (!isNaN(values[9 /* explicitHeight */])) {
                return;
            }
            if (layoutWidth == values[16 /* measuredWidth */]) {
                return;
            }
            this._widthConstraint = layoutWidth;
            this._heightConstraint = layoutHeight;
            this.invalidateSize();
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.setLayoutBoundsPosition = function (x, y) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.getLayoutBounds = function (bounds) {
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BitmapLabel.prototype.getPreferredBounds = function (bounds) {
        };
        return BitmapLabel;
    }(egret.BitmapText));
    eui.BitmapLabel = BitmapLabel;
    __reflect(BitmapLabel.prototype, "eui.BitmapLabel", ["eui.UIComponent", "egret.DisplayObject", "eui.IDisplayText"]);
    eui.sys.implementUIComponent(BitmapLabel, egret.BitmapText);
    eui.registerBindable(BitmapLabel.prototype, "text");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
/// <reference path="EXMLParser.ts" />
var EXML;
(function (EXML) {
    var parser = new eui.sys.EXMLParser();
    var requestPool = [];
    var callBackMap = {};
    var parsedClasses = {};
    var $prefixURL = "";
    Object.defineProperty(EXML, "prefixURL", {
        get: function () { return $prefixURL; },
        set: function (value) { $prefixURL = value; },
        enumerable: true,
        configurable: true
    });
    /**
     * Parsing a text of EXML file for a definition of class. You can declare the <code>class</code> property in the root
     * node of the EXML to register to the global as a class name.
     *
     * It will be fail to register and output a warning if the specified name already exists. You can get a definition
     * of a class through <code>egret.getDefinitionByName(className)</code>.
     *
     * @param text the text of a EXML file.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 解析一个 EXML 文件的文本内容为一个类定义。您可以在 EXML 文件的根节点上声明 class 属性作为要注册到全局的类名。
     * 若指定的类名已经存在，将会注册失败，并输出一个警告。注册成功后，您也可以通过 egret.getDefinitionByName(className) 方法获取这个 EXML 文件对应的类定义。
     *
     * @param text 要解析的 EXML 文件内容。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    function parse(text) {
        return parser.parse(text);
    }
    EXML.parse = parse;
    /**
     * Load and parse an external EXML file for a class definition. You can declare the <code>class</code> property in the root
     * node of the EXML to register to the global as a class name.
     *
     * It will be fail to register and output a warning if the specified name already exists. You can get a definition
     * of a class through <code>egret.getDefinitionByName(className)</code>.
     *
     * @param url the path of an EXML file
     * @param callBack method to invoke with an argument of the result when load and parse completed or failed. The argument will be
     * <code>undefined</code> if load or parse failed.
     * @param thisObject <code>this</code> object of callBack
     * @param useCache use cached EXML
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 加载并解析一个外部的 EXML 文件为一个类定义。您可以在 EXML 文件的根节点上声明 class 属性作为要注册到全局的类名。
     * 若指定的类名已经存在，将会注册失败，并输出一个警告。注册成功后，您也可以通过 egret.getDefinitionByName(className) 方法获取这个 EXML 文件对应的类定义。
     *
     * @param url 要加载的 EXML 文件路径
     * @param callBack 加载并解析完成后的回调函数，无论加载成功还是失败，此函数均会被回调。失败时将传入 undefined 作为回调函数参数。
     * @param thisObject 回调函数的 this 引用。
     * @param useCache 使用缓存的EXML
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    function load(url, callBack, thisObject, useCache) {
        if (useCache === void 0) { useCache = false; }
        if (true) {
            if (!url) {
                egret.$error(1003, "url");
            }
        }
        if (useCache && (url in parsedClasses)) {
            callBack && callBack.call(thisObject, parsedClasses[url], url);
            return;
        }
        var list = callBackMap[url];
        if (list) {
            list.push([callBack, thisObject]);
            return;
        }
        callBackMap[url] = [[callBack, thisObject]];
        request(url, $parseURLContent);
    }
    EXML.load = load;
    /**
     * @private
     */
    function $loadAll(urls, callBack, thisObject, useCache) {
        if (useCache === void 0) { useCache = false; }
        if (!urls || urls.length == 0) {
            callBack && callBack.call(thisObject, [], urls);
            return;
        }
        var exmlContents = [];
        urls.forEach(function (url) {
            var loaded = function (url, text) {
                exmlContents[url] = text;
                exmlContents.push(url);
                if (exmlContents.length == urls.length)
                    onLoadAllFinished(urls, exmlContents, callBack, thisObject);
            };
            if (useCache && (url in parsedClasses)) {
                loaded(url, "");
                return;
            }
            request(url, loaded);
        });
    }
    EXML.$loadAll = $loadAll;
    /**
     * @private
     */
    function onLoadAllFinished(urls, exmlContents, callBack, thisObject) {
        var clazzes = [];
        urls.forEach(function (url, i) {
            if ((url in parsedClasses) && !exmlContents[url]) {
                clazzes[i] = parsedClasses[url];
                return;
            }
            var text = exmlContents[url];
            var clazz = $parseURLContent(url, text);
            clazzes[i] = clazz;
        });
        callBack && callBack.call(thisObject, clazzes, urls);
    }
    function update(url, clazz) {
        parsedClasses[url] = clazz;
        var list = callBackMap[url];
        delete callBackMap[url];
        var length = list ? list.length : 0;
        for (var i = 0; i < length; i++) {
            var arr = list[i];
            if (arr[0] && arr[1])
                arr[0].call(arr[1], clazz, url);
        }
    }
    EXML.update = update;
    /**
     * @private
     * @param url
     * @param text
     */
    function $parseURLContentAsJs(url, text, className) {
        var clazz = null;
        if (text) {
            clazz = parser.$parseCode(text, className);
            update(url, clazz);
        }
    }
    EXML.$parseURLContentAsJs = $parseURLContentAsJs;
    /**
     * @private
     */
    function $parseURLContent(url, text) {
        var clazz = null;
        if (text) {
            try {
                clazz = parse(text);
            }
            catch (e) {
                console.error(url + "\n" + e.message);
            }
        }
        if (url) {
            if (clazz) {
                parsedClasses[url] = clazz;
            }
            var list = callBackMap[url];
            delete callBackMap[url];
            var length_30 = list ? list.length : 0;
            for (var i = 0; i < length_30; i++) {
                var arr = list[i];
                if (arr[0] && arr[1])
                    arr[0].call(arr[1], clazz, url);
            }
        }
        return clazz;
    }
    EXML.$parseURLContent = $parseURLContent;
    /**
     * @private
     */
    function request(url, callback) {
        var openUrl = url;
        if (url.indexOf("://") == -1) {
            openUrl = $prefixURL + url;
        }
        var onConfigLoaded = function (str) {
            if (!str) {
                str = "";
            }
            callback(url, str);
        };
        eui.getTheme(openUrl, onConfigLoaded);
    }
})(EXML || (EXML = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var sys;
    (function (sys) {
        /**
         * @private
         * EUI 命名空间
         */
        sys.NS_S = "http://ns.egret.com/eui";
        /**
         * @private
         * Wing命名空间
         */
        sys.NS_W = "http://ns.egret.com/wing";
        var coreClasses = ["Point", "Matrix", "Rectangle"];
        var basicTypes = ["Array", "boolean", "string", "number"];
        var MODULE_NAME = "eui.";
        var hashCount = 0;
        var properties = {};
        /**
         * @private
         */
        var EXMLConfig = (function () {
            function EXMLConfig() {
            }
            /**
             * @private
             */
            EXMLConfig.prototype.$describe = function (instance) {
                if (!instance) {
                    return null;
                }
                var prototype = Object.getPrototypeOf(instance);
                if (!prototype) {
                    return null;
                }
                var info;
                if (prototype.hasOwnProperty("__hashCode__")) {
                    info = properties[prototype.__hashCode__];
                    if (info) {
                        return info;
                    }
                }
                var superProto = Object.getPrototypeOf(prototype);
                if (!superProto) {
                    return null;
                }
                var superInstance = getInstanceOf(superProto.constructor);
                var superInfo = this.$describe(superInstance);
                if (superInfo) {
                    var factory = function () {
                    };
                    factory.prototype = superInfo;
                    info = new factory();
                }
                else {
                    info = {};
                }
                if (true) {
                    info.__class__ = prototype.constructor.name;
                }
                var keys = Object.keys(prototype).concat(Object.keys(instance));
                var length = keys.length;
                var meta = instance.__meta__;
                for (var i = 0; i < length; i++) {
                    var key = keys[i];
                    if (key == "constructor" || key.charAt(0) == "_" || key.charAt(0) == "$") {
                        continue;
                    }
                    var resultType = void 0;
                    if (meta && meta[key]) {
                        resultType = meta[key];
                    }
                    else if (isArray(instance[key])) {
                        resultType = "Array";
                    }
                    else {
                        resultType = typeof instance[key];
                        if (resultType == "function") {
                            continue;
                        }
                        if (basicTypes.indexOf(resultType) == -1) {
                            resultType = "any";
                        }
                    }
                    info[key] = resultType;
                }
                if (Object.getPrototypeOf(superProto)) {
                    prototype.__hashCode__ = hashCount++;
                    properties[prototype.__hashCode__] = info;
                }
                return info;
            };
            /**
             * @private
             * 根据类的短名ID和命名空间获取完整类名(以"."分隔)
             * @param id 类的短名ID
             * @param ns 命名空间
             */
            EXMLConfig.prototype.getClassNameById = function (id, ns) {
                if (ns == sys.NS_S) {
                    if (id == "Object") {
                        return id;
                    }
                    if (coreClasses.indexOf(id) != -1) {
                        return "egret." + id;
                    }
                }
                var name = "";
                if (basicTypes.indexOf(id) != -1) {
                    return id;
                }
                if (ns == sys.NS_W) {
                }
                else if (!ns || ns == sys.NS_S) {
                    name = MODULE_NAME + id;
                }
                else {
                    name = ns.substring(0, ns.length - 1) + id;
                }
                if (!getPrototypeOf(name)) {
                    name = "";
                }
                return name;
            };
            /**
             * @private
             * 根据ID获取对应的默认属性
             * @param id 类的短名ID
             * @param ns 命名空间
             * @return 默认属性名
             */
            EXMLConfig.prototype.getDefaultPropById = function (id, ns) {
                var className = this.getClassNameById(id, ns);
                var prototype = getPrototypeOf(className);
                var property;
                if (prototype) {
                    property = prototype.__defaultProperty__;
                }
                return property ? property : "";
            };
            /**
             * @private
             * 获取指定属性的类型,返回基本数据类型："boolean","string","number","any"。
             * @param property 属性名
             * @param className 要查询的完整类名
             */
            EXMLConfig.prototype.getPropertyType = function (property, className) {
                if (className == "Object") {
                    return "any";
                }
                var resultType = "";
                var prototype = getPrototypeOf(className);
                if (prototype) {
                    if (!prototype.hasOwnProperty("__hashCode__")) {
                        var clazz = egret.getDefinitionByName(className);
                        var instance = getInstanceOf(clazz);
                        if (!instance) {
                            if (true) {
                                egret.$warn(2104, className);
                            }
                            return resultType;
                        }
                        this.$describe(instance);
                    }
                    var info = properties[prototype.__hashCode__];
                    if (info) {
                        resultType = info[property];
                    }
                }
                return resultType;
            };
            return EXMLConfig;
        }());
        sys.EXMLConfig = EXMLConfig;
        __reflect(EXMLConfig.prototype, "eui.sys.EXMLConfig");
        /**
         * @private
         * 判断一个对象是数组
         */
        function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        }
        /**
         * @private
         * 获取一个类名对应的prototype引用
         */
        function getPrototypeOf(className) {
            var clazz = egret.getDefinitionByName(className);
            if (!clazz) {
                return null;
            }
            return clazz.prototype;
        }
        /**
         * @private
         * 创建一个类名对应的实例
         */
        function getInstanceOf(clazz) {
            if (!clazz) {
                return null;
            }
            var instance;
            if (true) {
                try {
                    instance = new clazz();
                }
                catch (e) {
                    egret.error(e);
                    return null;
                }
            }
            else {
                instance = new clazz();
            }
            return instance;
        }
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present; Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms; with or without
//  modification; are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice; this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice; this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES; INCLUDING; BUT NOT LIMITED TO; THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT; INDIRECT;
//  INCIDENTAL; SPECIAL; EXEMPLARY; OR CONSEQUENTIAL DAMAGES (INCLUDING; BUT NOT
//  LIMITED TO; PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE; DATA;
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY; WHETHER IN CONTRACT; STRICT LIABILITY; OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE;
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var eui;
(function (eui) {
    egret.$locale_strings = egret.$locale_strings || {};
    egret.$locale_strings["en_US"] = egret.$locale_strings["en_US"] || {};
    var locale_strings = egret.$locale_strings["en_US"];
    //2000-2999
    locale_strings[2001] = "EXML parsing error {0}: EXML file can't be found ";
    locale_strings[2002] = "EXML parsing error : invalid XML file:\n{0}";
    locale_strings[2003] = "EXML parsing error {0}: the class definitions corresponding to nodes can't be found  \n {1}";
    locale_strings[2004] = "EXML parsing error {0}: nodes cannot contain id property with the same name \n {1}";
    locale_strings[2005] = "EXML parsing error {0}: property with the name of '{1}' does not exist on the node, or the property does not have a default value: \n {2}";
    locale_strings[2006] = "EXML parsing error {0}: undefined view state name: '{1}' \n {2}";
    locale_strings[2007] = "EXML parsing error {0}: only UIComponent objects within the container can use the includeIn and excludeFrom properties\n {1}";
    locale_strings[2008] = "EXML parsing error {0}: fail to assign values of '{1}' class to property: '{2}' \n {3}";
    locale_strings[2009] = "EXML parsing error {0}: only one ID can be referenced in the node property value '{}' label; and complex expression is not allowed to use \n {1}";
    locale_strings[2010] = "EXML parsing error {0}: ID referenced by property: '{1}':  '{2}' does not exist \n {3}";
    locale_strings[2011] = "EXML parsing error {0}: fail to assign more than one child nodes to the same property: '{1}' \n {2}";
    locale_strings[2012] = "EXML parsing error {0}: no default property exists on the node; and you must explicitly declare the property name that the child node  is assigned to \n {1}";
    locale_strings[2013] = "EXML parsing error {0}: view state grammar is not allowed to use on property nodes of Array class \n {1} ";
    locale_strings[2014] = "EXML parsing error {0}: assigning the skin class itself to the node property is not allowed \n {1}";
    locale_strings[2015] = "EXML parsing error {0}: class definition referenced by node: {1} does not exist \n {2}";
    locale_strings[2016] = "EXML parsing error {0}: format error of 'scale9Grid' property value on the node: {1}";
    locale_strings[2017] = "EXML parsing error {0}: namespace prefix missing on the node: {1}";
    locale_strings[2018] = "EXML parsing error {0}: format error of 'skinName' property value on the node: {1}";
    locale_strings[2019] = "EXML parsing error {0}: the container’s child item must be visible nodes: {1}";
    locale_strings[2020] = "EXML parsing error {0}: for child nodes in w: Declarations, the includeIn and excludeFrom properties are not allowed to use \n {1}";
    locale_strings[2021] = "Compile errors in {0}, the attribute name: {1}, the attribute value: {2}.";
    locale_strings[2022] = "EXML parsing error: there contains illegal characters in the id `{0}`";
    locale_strings[2101] = "EXML parsing warnning : fail to register the class property : {0},there is already a class with the same name in the global,please try to rename the class name for the exml. \n {1}";
    locale_strings[2102] = "EXML parsing warnning {0}: no child node can be found on the property code \n {1}";
    locale_strings[2103] = "EXML parsing warnning {0}: the same property '{1}' on the node is assigned multiple times \n {2}";
    locale_strings[2104] = "EXML parsing warnning, Instantiate class {0} error，the parameters of its constructor method must be empty.";
    locale_strings[2201] = "BasicLayout doesn't support virtualization.";
    locale_strings[2202] = "parse skinName error，the parsing result of skinName must be a instance of eui.Skin.";
    locale_strings[2203] = "Could not find the skin class '{0}'。";
    locale_strings[2301] = "parse source failed，could not find asset from URL：{0} .";
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present; Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms; with or without
//  modification; are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice; this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice; this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES; INCLUDING; BUT NOT LIMITED TO; THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT; INDIRECT;
//  INCIDENTAL; SPECIAL; EXEMPLARY; OR CONSEQUENTIAL DAMAGES (INCLUDING; BUT NOT
//  LIMITED TO; PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE; DATA;
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY; WHETHER IN CONTRACT; STRICT LIABILITY; OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE;
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var eui;
(function (eui) {
    egret.$locale_strings = egret.$locale_strings || {};
    egret.$locale_strings["zh_CN"] = egret.$locale_strings["zh_CN"] || {};
    var locale_strings = egret.$locale_strings["zh_CN"];
    //2000-2999
    //EXML报错信息
    locale_strings[2001] = "EXML解析错误 {0}: 找不到EXML文件";
    locale_strings[2002] = "EXML解析错误: 不是有效的XML文件:\n{0}";
    locale_strings[2003] = "EXML解析错误 {0}: 无法找到节点所对应的类定义\n{1}";
    locale_strings[2004] = "EXML解析错误 {0}: 节点不能含有同名的id属性\n{1}";
    locale_strings[2005] = "EXML解析错误 {0}: 节点上不存在名为'{1}'的属性，或者该属性没有初始值:\n{2}";
    locale_strings[2006] = "EXML解析错误 {0}: 未定义的视图状态名称:'{1}'\n{2}";
    locale_strings[2007] = "EXML解析错误 {0}: 只有处于容器内的 UIComponent 对象可以使用includeIn和excludeFrom属性\n{1}";
    locale_strings[2008] = "EXML解析错误 {0}: 无法将'{1}'类型的值赋给属性:'{2}'\n{3}";
    locale_strings[2009] = "EXML解析错误 {0}: 在节点属性值的‘{}’标签内只能引用一个ID，不允许使用复杂表达式\n{1}";
    locale_strings[2010] = "EXML解析错误 {0}: 属性:'{1}'所引用的ID: '{2}'不存在\n{3}";
    locale_strings[2011] = "EXML解析错误 {0}: 无法将多个子节点赋值给同一个属性:'{1}'\n{2}";
    locale_strings[2012] = "EXML解析错误 {0}: 节点上不存在默认属性，必须显式声明子节点要赋值到的属性名\n{1}";
    locale_strings[2013] = "EXML解析错误 {0}: 类型为Array的属性节点上不允许使用视图状态语法\n{1}";
    locale_strings[2014] = "EXML解析错误 {0}: 不允许将皮肤类自身赋值给节点属性\n{1}";
    locale_strings[2015] = "EXML解析错误 {0}: 节点引用的类定义:{1}不存在\n{2}";
    locale_strings[2016] = "EXML解析错误 {0}: 节点上'scale9Grid'属性值的格式错误:{1}";
    locale_strings[2017] = "EXML解析错误 {0}: 节点上缺少命名空间前缀:{1}";
    locale_strings[2018] = "EXML解析错误 {0}: 节点上'skinName'属性值的格式错误:{1}";
    locale_strings[2019] = "EXML解析错误 {0}: 容器的子项必须是可视节点:{1}";
    locale_strings[2020] = "EXML解析错误 {0}: 在w:Declarations内的子节点，不允许使用includeIn和excludeFrom属性\n{1}";
    locale_strings[2021] = "{0} 中存在编译错误，属性名 : {1}，属性值 : {2}";
    locale_strings[2022] = "EXML解析错误: id `{0}` 中含有非法字符";
    //EXML警告信息
    locale_strings[2101] = "EXML解析警告: 在EXML根节点上声明的 class 属性: {0} 注册失败，所对应的类已经存在，请尝试重命名要注册的类名。\n{1}";
    locale_strings[2102] = "EXML解析警告 {0}: 在属性节点上找不到任何子节点\n{1}";
    locale_strings[2103] = "EXML解析警告 {0}: 节点上的同一个属性'{1}'被多次赋值\n{2}";
    locale_strings[2104] = "EXML解析警告，无法直接实例化自定义组件：{0} ，在EXML中使用的自定义组件必须要能直接被实例化，否则可能导致后续EXML解析报错。";
    //EUI 报错与警告信息
    locale_strings[2201] = "BasicLayout 不支持虚拟化。";
    locale_strings[2202] = "皮肤解析出错，属性 skinName 的值必须要能够解析为一个 eui.Skin 的实例。";
    locale_strings[2203] = "找不到指定的皮肤类 '{0}'。";
    locale_strings[2301] = "素材解析失败，找不到URL：{0} 所对应的资源。";
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The BasicLayout class arranges the layout elements according to their individual settings,
     * independent of each-other. BasicLayout, also called absolute layout, requires that you
     * explicitly position each container child.
     * You can use the <code>x</code> and <code>y</code> properties of the child,
     * or constraints to position each child.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/BasicLayoutExample.ts
     * @language en_US
     */
    /**
     * BasicLayout 类根据其各个设置彼此独立地排列布局元素。
     * BasicLayout（也称为绝对布局）要求显式定位每个容器子代。
     * 可以使用子代的 <code>x</code> 和 <code>y</code> 属性，或使用约束来定位每个子代。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/BasicLayoutExample.ts
     * @language zh_CN
     */
    var BasicLayout = (function (_super) {
        __extends(BasicLayout, _super);
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function BasicLayout() {
            return _super.call(this) || this;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BasicLayout.prototype.measure = function () {
            _super.prototype.measure.call(this);
            eui.sys.measure(this.$target);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        BasicLayout.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
            var target = this.$target;
            var pos = eui.sys.updateDisplayList(target, unscaledWidth, unscaledHeight);
            target.setContentSize(Math.ceil(pos.x), Math.ceil(pos.y));
        };
        return BasicLayout;
    }(eui.LayoutBase));
    eui.BasicLayout = BasicLayout;
    __reflect(BasicLayout.prototype, "eui.BasicLayout");
    if (true) {
        Object.defineProperty(BasicLayout.prototype, "useVirtualLayout", {
            /**
             * 此布局不支持虚拟布局，设置这个属性无效
             */
            get: function () {
                return this.$useVirtualLayout;
            },
            set: function (value) {
                egret.$error(2201);
            },
            enumerable: true,
            configurable: true
        });
    }
})(eui || (eui = {}));
(function (eui) {
    var sys;
    (function (sys) {
        var UIComponentClass = "eui.UIComponent";
        /**
         * @private
         * @param value 要格式化的相对值
         * @param total 在此值方向上的总长度
         */
        function formatRelative(value, total) {
            if (!value || typeof value == "number") {
                return value;
            }
            var str = value;
            var index = str.indexOf("%");
            if (index == -1) {
                return +str;
            }
            var percent = +str.substring(0, index);
            return percent * 0.01 * total;
        }
        /**
         * @private
         * 一个工具方法，使用BasicLayout规则测量目标对象。
         */
        function measure(target) {
            if (!target) {
                return;
            }
            var width = 0;
            var height = 0;
            var bounds = egret.$TempRectangle;
            var count = target.numChildren;
            for (var i = 0; i < count; i++) {
                var layoutElement = (target.getChildAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                var values = layoutElement.$UIComponent;
                var hCenter = +values[4 /* horizontalCenter */];
                var vCenter = +values[5 /* verticalCenter */];
                var left = +values[0 /* left */];
                var right = +values[1 /* right */];
                var top_1 = +values[2 /* top */];
                var bottom = +values[3 /* bottom */];
                var extX = void 0;
                var extY = void 0;
                layoutElement.getPreferredBounds(bounds);
                if (!isNaN(left) && !isNaN(right)) {
                    extX = left + right;
                }
                else if (!isNaN(hCenter)) {
                    extX = Math.abs(hCenter) * 2;
                }
                else if (!isNaN(left) || !isNaN(right)) {
                    extX = isNaN(left) ? 0 : left;
                    extX += isNaN(right) ? 0 : right;
                }
                else {
                    extX = bounds.x;
                }
                if (!isNaN(top_1) && !isNaN(bottom)) {
                    extY = top_1 + bottom;
                }
                else if (!isNaN(vCenter)) {
                    extY = Math.abs(vCenter) * 2;
                }
                else if (!isNaN(top_1) || !isNaN(bottom)) {
                    extY = isNaN(top_1) ? 0 : top_1;
                    extY += isNaN(bottom) ? 0 : bottom;
                }
                else {
                    extY = bounds.y;
                }
                var preferredWidth = bounds.width;
                var preferredHeight = bounds.height;
                width = Math.ceil(Math.max(width, extX + preferredWidth));
                height = Math.ceil(Math.max(height, extY + preferredHeight));
            }
            target.setMeasuredSize(width, height);
        }
        sys.measure = measure;
        /**
         * @private
         * 一个工具方法，使用BasicLayout规则布局目标对象。
         */
        function updateDisplayList(target, unscaledWidth, unscaledHeight) {
            if (!target)
                return;
            var count = target.numChildren;
            var maxX = 0;
            var maxY = 0;
            var bounds = egret.$TempRectangle;
            for (var i = 0; i < count; i++) {
                var layoutElement = (target.getChildAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                var values = layoutElement.$UIComponent;
                var hCenter = formatRelative(values[4 /* horizontalCenter */], unscaledWidth * 0.5);
                var vCenter = formatRelative(values[5 /* verticalCenter */], unscaledHeight * 0.5);
                var left = formatRelative(values[0 /* left */], unscaledWidth);
                var right = formatRelative(values[1 /* right */], unscaledWidth);
                var top_2 = formatRelative(values[2 /* top */], unscaledHeight);
                var bottom = formatRelative(values[3 /* bottom */], unscaledHeight);
                var percentWidth = values[6 /* percentWidth */];
                var percentHeight = values[7 /* percentHeight */];
                var childWidth = NaN;
                var childHeight = NaN;
                if (!isNaN(left) && !isNaN(right)) {
                    childWidth = unscaledWidth - right - left;
                }
                else if (!isNaN(percentWidth)) {
                    childWidth = Math.round(unscaledWidth * Math.min(percentWidth * 0.01, 1));
                }
                if (!isNaN(top_2) && !isNaN(bottom)) {
                    childHeight = unscaledHeight - bottom - top_2;
                }
                else if (!isNaN(percentHeight)) {
                    childHeight = Math.round(unscaledHeight * Math.min(percentHeight * 0.01, 1));
                }
                layoutElement.setLayoutBoundsSize(childWidth, childHeight);
                layoutElement.getLayoutBounds(bounds);
                var elementWidth = bounds.width;
                var elementHeight = bounds.height;
                var childX = NaN;
                var childY = NaN;
                if (!isNaN(hCenter))
                    childX = Math.round((unscaledWidth - elementWidth) / 2 + hCenter);
                else if (!isNaN(left))
                    childX = left;
                else if (!isNaN(right))
                    childX = unscaledWidth - elementWidth - right;
                else
                    childX = bounds.x;
                if (!isNaN(vCenter))
                    childY = Math.round((unscaledHeight - elementHeight) / 2 + vCenter);
                else if (!isNaN(top_2))
                    childY = top_2;
                else if (!isNaN(bottom))
                    childY = unscaledHeight - elementHeight - bottom;
                else
                    childY = bounds.y;
                layoutElement.setLayoutBoundsPosition(childX, childY);
                maxX = Math.max(maxX, childX + elementWidth);
                maxY = Math.max(maxY, childY + elementHeight);
            }
            return egret.$TempPoint.setTo(maxX, maxY);
        }
        sys.updateDisplayList = updateDisplayList;
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The ColumnAlign class defines the possible values for the
     * <code>columnAlign</code> property of the TileLayout class.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/ColumnAlignExample.ts
     * @language en_US
     */
    /**
     * ColumnAlign 类为 TileLayout 类的 <code>columnAlign</code> 属性定义可能的值。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/ColumnAlignExample.ts
     * @language zh_CN
     */
    var ColumnAlign = (function () {
        function ColumnAlign() {
        }
        /**
         * Do not justify the rows.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 不将行两端对齐。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ColumnAlign.LEFT = "left";
        /**
         * Justify the rows by increasing the vertical gap.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 通过增大水平间隙将行两端对齐。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ColumnAlign.JUSTIFY_USING_GAP = "justifyUsingGap";
        /**
         * Justify the rows by increasing the row height.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 通过增大行高度将行两端对齐。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        ColumnAlign.JUSTIFY_USING_WIDTH = "justifyUsingWidth";
        return ColumnAlign;
    }());
    eui.ColumnAlign = ColumnAlign;
    __reflect(ColumnAlign.prototype, "eui.ColumnAlign");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var UIComponentClass = "eui.UIComponent";
    /**
     * The HorizontalLayout class arranges the layout elements in a horizontal sequence,
     * left to right, with optional gaps between the elements and optional padding
     * around the elements.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/HorizontalLayoutExample.ts
     * @language en_US
     */
    /**
     * HorizontalLayout 类按水平顺序从左到右排列布局元素，在元素和围绕元素的可选填充之间带有可选间隙。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/HorizontalLayoutExample.ts
     * @language zh_CN
     */
    var HorizontalLayout = (function (_super) {
        __extends(HorizontalLayout, _super);
        function HorizontalLayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HorizontalLayout.prototype.measureReal = function () {
            var target = this.$target;
            var count = target.numElements;
            var numElements = count;
            var measuredWidth = 0;
            var measuredHeight = 0;
            var bounds = egret.$TempRectangle;
            for (var i = 0; i < count; i++) {
                var layoutElement = (target.getElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    numElements--;
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                measuredWidth += bounds.width;
                measuredHeight = Math.max(measuredHeight, bounds.height);
            }
            measuredWidth += (numElements - 1) * this.$gap;
            var hPadding = this.$paddingLeft + this.$paddingRight;
            var vPadding = this.$paddingTop + this.$paddingBottom;
            target.setMeasuredSize(measuredWidth + hPadding, measuredHeight + vPadding);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HorizontalLayout.prototype.measureVirtual = function () {
            var target = this.$target;
            var typicalWidth = this.$typicalWidth;
            var measuredWidth = this.getElementTotalSize();
            var measuredHeight = Math.max(this.maxElementSize, this.$typicalHeight);
            var bounds = egret.$TempRectangle;
            var endIndex = this.endIndex;
            var elementSizeTable = this.elementSizeTable;
            for (var index = this.startIndex; index < endIndex; index++) {
                var layoutElement = (target.getElementAt(index));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                measuredWidth += bounds.width;
                measuredWidth -= isNaN(elementSizeTable[index]) ? typicalWidth : elementSizeTable[index];
                measuredHeight = Math.max(measuredHeight, bounds.height);
            }
            var hPadding = this.$paddingLeft + this.$paddingRight;
            var vPadding = this.$paddingTop + this.$paddingBottom;
            target.setMeasuredSize(measuredWidth + hPadding, measuredHeight + vPadding);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HorizontalLayout.prototype.updateDisplayListReal = function (width, height) {
            var target = this.$target;
            var paddingL = this.$paddingLeft;
            var paddingR = this.$paddingRight;
            var paddingT = this.$paddingTop;
            var paddingB = this.$paddingBottom;
            var gap = this.$gap;
            var targetWidth = Math.max(0, width - paddingL - paddingR);
            var targetHeight = Math.max(0, height - paddingT - paddingB);
            var hJustify = this.$horizontalAlign == eui.JustifyAlign.JUSTIFY;
            var vJustify = this.$verticalAlign == eui.JustifyAlign.JUSTIFY || this.$verticalAlign == eui.JustifyAlign.CONTENT_JUSTIFY;
            var vAlign = 0;
            if (!vJustify) {
                if (this.$verticalAlign == egret.VerticalAlign.MIDDLE) {
                    vAlign = 0.5;
                }
                else if (this.$verticalAlign == egret.VerticalAlign.BOTTOM) {
                    vAlign = 1;
                }
            }
            var count = target.numElements;
            var numElements = count;
            var x = paddingL;
            var y = paddingT;
            var i;
            var layoutElement;
            var totalPreferredWidth = 0;
            var totalPercentWidth = 0;
            var childInfoArray = [];
            var childInfo;
            var widthToDistribute = targetWidth;
            var maxElementHeight = this.maxElementSize;
            var bounds = egret.$TempRectangle;
            for (i = 0; i < count; i++) {
                var layoutElement_1 = (target.getElementAt(i));
                if (!egret.is(layoutElement_1, UIComponentClass) || !layoutElement_1.$includeInLayout) {
                    numElements--;
                    continue;
                }
                layoutElement_1.getPreferredBounds(bounds);
                maxElementHeight = Math.max(maxElementHeight, bounds.height);
                if (hJustify) {
                    totalPreferredWidth += bounds.width;
                }
                else {
                    var values = layoutElement_1.$UIComponent;
                    if (!isNaN(values[6 /* percentWidth */])) {
                        totalPercentWidth += values[6 /* percentWidth */];
                        childInfo = new eui.sys.ChildInfo();
                        childInfo.layoutElement = layoutElement_1;
                        childInfo.percent = values[6 /* percentWidth */];
                        childInfo.min = values[12 /* minWidth */];
                        childInfo.max = values[13 /* maxWidth */];
                        childInfoArray.push(childInfo);
                    }
                    else {
                        widthToDistribute -= bounds.width;
                    }
                }
            }
            widthToDistribute -= gap * (numElements - 1);
            widthToDistribute = widthToDistribute > 0 ? widthToDistribute : 0;
            var excessSpace = targetWidth - totalPreferredWidth - gap * (numElements - 1);
            var averageWidth;
            var largeChildrenCount = numElements;
            var widthDic = {};
            if (hJustify) {
                if (excessSpace < 0) {
                    averageWidth = widthToDistribute / numElements;
                    for (i = 0; i < count; i++) {
                        layoutElement = (target.getElementAt(i));
                        if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                            continue;
                        }
                        layoutElement.getPreferredBounds(bounds);
                        if (bounds.width <= averageWidth) {
                            widthToDistribute -= bounds.width;
                            largeChildrenCount--;
                            continue;
                        }
                    }
                    widthToDistribute = widthToDistribute > 0 ? widthToDistribute : 0;
                }
            }
            else {
                if (totalPercentWidth > 0) {
                    this.flexChildrenProportionally(targetWidth, widthToDistribute, totalPercentWidth, childInfoArray);
                    var roundOff_1 = 0;
                    var length_31 = childInfoArray.length;
                    for (i = 0; i < length_31; i++) {
                        childInfo = childInfoArray[i];
                        var childSize = Math.round(childInfo.size + roundOff_1);
                        roundOff_1 += childInfo.size - childSize;
                        widthDic[childInfo.layoutElement.$hashCode] = childSize;
                        widthToDistribute -= childSize;
                    }
                    widthToDistribute = widthToDistribute > 0 ? widthToDistribute : 0;
                }
            }
            if (this.$horizontalAlign == egret.HorizontalAlign.CENTER) {
                x = paddingL + widthToDistribute * 0.5;
            }
            else if (this.$horizontalAlign == egret.HorizontalAlign.RIGHT) {
                x = paddingL + widthToDistribute;
            }
            var maxX = paddingL;
            var maxY = paddingT;
            var dx = 0;
            var dy = 0;
            var justifyHeight = Math.ceil(targetHeight);
            if (this.$verticalAlign == eui.JustifyAlign.CONTENT_JUSTIFY)
                justifyHeight = Math.ceil(Math.max(targetHeight, maxElementHeight));
            var roundOff = 0;
            var layoutElementWidth;
            var childWidth;
            for (i = 0; i < count; i++) {
                var exceesHeight = 0;
                layoutElement = (target.getElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                layoutElementWidth = NaN;
                if (hJustify) {
                    childWidth = NaN;
                    if (excessSpace > 0) {
                        childWidth = widthToDistribute * bounds.width / totalPreferredWidth;
                    }
                    else if (excessSpace < 0 && bounds.width > averageWidth) {
                        childWidth = widthToDistribute / largeChildrenCount;
                    }
                    if (!isNaN(childWidth)) {
                        layoutElementWidth = Math.round(childWidth + roundOff);
                        roundOff += childWidth - layoutElementWidth;
                    }
                }
                else {
                    layoutElementWidth = widthDic[layoutElement.$hashCode];
                }
                if (vJustify) {
                    y = paddingT;
                    layoutElement.setLayoutBoundsSize(layoutElementWidth, justifyHeight);
                    layoutElement.getLayoutBounds(bounds);
                }
                else {
                    var layoutElementHeight = NaN;
                    var values = layoutElement.$UIComponent;
                    if (!isNaN(layoutElement.percentHeight)) {
                        var percent = Math.min(100, values[7 /* percentHeight */]);
                        layoutElementHeight = Math.round(targetHeight * percent * 0.01);
                    }
                    layoutElement.setLayoutBoundsSize(layoutElementWidth, layoutElementHeight);
                    layoutElement.getLayoutBounds(bounds);
                    exceesHeight = (targetHeight - bounds.height) * vAlign;
                    exceesHeight = exceesHeight > 0 ? exceesHeight : 0;
                    y = paddingT + exceesHeight;
                }
                layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
                dx = Math.ceil(bounds.width);
                dy = Math.ceil(bounds.height);
                maxX = Math.max(maxX, x + dx);
                maxY = Math.max(maxY, y + dy);
                x += dx + gap;
            }
            this.maxElementSize = maxElementHeight;
            target.setContentSize(maxX + paddingR, maxY + paddingB);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HorizontalLayout.prototype.updateDisplayListVirtual = function (width, height) {
            var target = this.$target;
            if (this.indexInViewCalculated)
                this.indexInViewCalculated = false;
            else
                this.getIndexInView();
            var paddingR = this.$paddingRight;
            var paddingT = this.$paddingTop;
            var paddingB = this.$paddingBottom;
            var gap = this.$gap;
            var contentWidth;
            var numElements = target.numElements;
            if (this.startIndex == -1 || this.endIndex == -1) {
                contentWidth = this.getStartPosition(numElements) - gap + paddingR;
                target.setContentSize(contentWidth, target.contentHeight);
                return;
            }
            var endIndex = this.endIndex;
            target.setVirtualElementIndicesInView(this.startIndex, endIndex);
            //获取垂直布局参数
            var justify = this.$verticalAlign == eui.JustifyAlign.JUSTIFY || this.$verticalAlign == eui.JustifyAlign.CONTENT_JUSTIFY;
            var contentJustify = this.$verticalAlign == eui.JustifyAlign.CONTENT_JUSTIFY;
            var vAlign = 0;
            if (!justify) {
                if (this.$verticalAlign == egret.VerticalAlign.MIDDLE) {
                    vAlign = 0.5;
                }
                else if (this.$verticalAlign == egret.VerticalAlign.BOTTOM) {
                    vAlign = 1;
                }
            }
            var bounds = egret.$TempRectangle;
            var targetHeight = Math.max(0, height - paddingT - paddingB);
            var justifyHeight = Math.ceil(targetHeight);
            var layoutElement;
            var typicalHeight = this.$typicalHeight;
            var typicalWidth = this.$typicalWidth;
            var maxElementHeight = this.maxElementSize;
            var oldMaxH = Math.max(typicalHeight, this.maxElementSize);
            if (contentJustify) {
                for (var index = this.startIndex; index <= endIndex; index++) {
                    layoutElement = (target.getVirtualElementAt(index));
                    if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                        continue;
                    }
                    layoutElement.getPreferredBounds(bounds);
                    maxElementHeight = Math.max(maxElementHeight, bounds.height);
                }
                justifyHeight = Math.ceil(Math.max(targetHeight, maxElementHeight));
            }
            var x = 0;
            var y = 0;
            var contentHeight = 0;
            var oldElementSize;
            var needInvalidateSize = false;
            var elementSizeTable = this.elementSizeTable;
            //对可见区域进行布局
            for (var i = this.startIndex; i <= endIndex; i++) {
                var exceesHeight = 0;
                layoutElement = (target.getVirtualElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                if (!contentJustify) {
                    maxElementHeight = Math.max(maxElementHeight, bounds.height);
                }
                if (justify) {
                    y = paddingT;
                    layoutElement.setLayoutBoundsSize(NaN, justifyHeight);
                    layoutElement.getLayoutBounds(bounds);
                }
                else {
                    layoutElement.getLayoutBounds(bounds);
                    exceesHeight = (targetHeight - bounds.height) * vAlign;
                    exceesHeight = exceesHeight > 0 ? exceesHeight : 0;
                    y = paddingT + exceesHeight;
                }
                contentHeight = Math.max(contentHeight, bounds.height);
                if (!needInvalidateSize) {
                    oldElementSize = isNaN(elementSizeTable[i]) ? typicalWidth : elementSizeTable[i];
                    if (oldElementSize != bounds.width)
                        needInvalidateSize = true;
                }
                elementSizeTable[i] = bounds.width;
                x = this.getStartPosition(i);
                layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
            }
            contentHeight += paddingT + paddingB;
            contentWidth = this.getStartPosition(numElements) - gap + paddingR;
            this.maxElementSize = maxElementHeight;
            target.setContentSize(contentWidth, contentHeight);
            if (needInvalidateSize || oldMaxH < this.maxElementSize) {
                target.invalidateSize();
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HorizontalLayout.prototype.getStartPosition = function (index) {
            if (!this.$useVirtualLayout) {
                if (this.$target) {
                    var element = this.$target.getElementAt(index);
                    if (element) {
                        return element.x;
                    }
                }
            }
            var typicalWidth = this.$typicalWidth;
            var startPos = this.$paddingLeft;
            var gap = this.$gap;
            var elementSizeTable = this.elementSizeTable;
            for (var i = 0; i < index; i++) {
                var w = elementSizeTable[i];
                if (isNaN(w)) {
                    w = typicalWidth;
                }
                startPos += w + gap;
            }
            return startPos;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HorizontalLayout.prototype.getElementSize = function (index) {
            if (this.$useVirtualLayout) {
                var size = this.elementSizeTable[index];
                if (isNaN(size)) {
                    size = this.$typicalWidth;
                }
                return size;
            }
            if (this.$target) {
                return this.$target.getElementAt(index).width;
            }
            return 0;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HorizontalLayout.prototype.getElementTotalSize = function () {
            var typicalWidth = this.$typicalWidth;
            var gap = this.$gap;
            var totalSize = 0;
            var length = this.$target.numElements;
            var elementSizeTable = this.elementSizeTable;
            for (var i = 0; i < length; i++) {
                var w = elementSizeTable[i];
                if (isNaN(w)) {
                    w = typicalWidth;
                }
                totalSize += w + gap;
            }
            totalSize -= gap;
            return totalSize;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HorizontalLayout.prototype.elementAdded = function (index) {
            if (!this.useVirtualLayout)
                return;
            _super.prototype.elementAdded.call(this, index);
            this.elementSizeTable.splice(index, 0, this.$typicalWidth);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HorizontalLayout.prototype.getIndexInView = function () {
            var target = this.$target;
            if (!target || target.numElements == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }
            var values = target.$UIComponent;
            if (values[10 /* width */] <= 0 || values[11 /* height */] <= 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }
            var numElements = target.numElements;
            var contentWidth = this.getStartPosition(numElements - 1) +
                this.elementSizeTable[numElements - 1] + this.$paddingRight;
            var minVisibleX = target.scrollH;
            if (minVisibleX > contentWidth - this.$paddingRight) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            var maxVisibleX = target.scrollH + values[10 /* width */];
            if (maxVisibleX < this.$paddingLeft) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            var oldStartIndex = this.startIndex;
            var oldEndIndex = this.endIndex;
            this.startIndex = this.findIndexAt(minVisibleX, 0, numElements - 1);
            if (this.startIndex == -1)
                this.startIndex = 0;
            this.endIndex = this.findIndexAt(maxVisibleX, 0, numElements - 1);
            if (this.endIndex == -1)
                this.endIndex = numElements - 1;
            return oldStartIndex != this.startIndex || oldEndIndex != this.endIndex;
        };
        return HorizontalLayout;
    }(eui.LinearLayoutBase));
    eui.HorizontalLayout = HorizontalLayout;
    __reflect(HorizontalLayout.prototype, "eui.HorizontalLayout");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The JustifyAlign class defines the possible values for the
     * <code>horizontalAlign</code> 和 <code>verticalAlign</code> property of
     * Layout class.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/JustifyAlignExample.ts
     * @language en_US
     */
    /**
     * JustifyAlign 定义布局类中 horizontalAlign 与 verticalAlign 属性需要的两端对齐常量值。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/JustifyAlignExample.ts
     * @language zh_CN
     */
    var JustifyAlign = (function () {
        function JustifyAlign() {
        }
        /**
         * Justify the children with respect to the container.
         * This uniformly sizes all children to be the same size as the
         * container.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 相对于容器对齐子代。这会将所有子代的大小统一调整为与容器相同的尺寸。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        JustifyAlign.JUSTIFY = "justify";
        /**
         * Content justify the children width/height respect to the container.
         * This uniformly sizes all children to be the content width/height of the container.
         * The content width/height of the container is the size of the largest child.
         * If all children are smaller than the width/height of the container, then
         * all the children will be sized to the width/height of the container.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 相对于容器对子代进行内容对齐。这会将所有子代的大小统一调整为容器的内容宽度/高度。
         * 容器的内容宽度/高度是最大子代的大小。如果所有子代都小于容器的宽度/高度，则会将所有子代的大小调整为容器的宽度/高度。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        JustifyAlign.CONTENT_JUSTIFY = "contentJustify";
        return JustifyAlign;
    }());
    eui.JustifyAlign = JustifyAlign;
    __reflect(JustifyAlign.prototype, "eui.JustifyAlign");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The RowAlign class defines the possible values for the
     * <code>rowAlign</code> property of the TileLayout class.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/RowAlignExample.ts
     * @language en_US
     */
    /**
     * RowAlign 类为 TileLayout 类的 <code>rowAlign</code> 属性定义可能的值。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/RowAlignExample.ts
     * @language zh_CN
     */
    var RowAlign = (function () {
        function RowAlign() {
        }
        /**
         * Do not justify the rows.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 不进行两端对齐。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        RowAlign.TOP = "top";
        /**
         * Justify the rows by increasing the vertical gap.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 通过增大垂直间隙将行两端对齐。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        RowAlign.JUSTIFY_USING_GAP = "justifyUsingGap";
        /**
         * Justify the rows by increasing the row height.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 通过增大行高度将行两端对齐。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        RowAlign.JUSTIFY_USING_HEIGHT = "justifyUsingHeight";
        return RowAlign;
    }());
    eui.RowAlign = RowAlign;
    __reflect(RowAlign.prototype, "eui.RowAlign");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var UIComponentClass = "eui.UIComponent";
    /**
     * The TileLayout class arranges layout elements in columns and rows
     * of equally-sized cells.
     * The TileLayout class uses a number of properties that control orientation,
     * count, size, gap and justification of the columns and the rows
     * as well as element alignment within the cells.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/TileLayoutExample.ts
     * @language en_US
     */
    /**
     * TileLayout 类在单元格大小相等的列和行中排列布局元素。
     * TileLayout 类使用许多属性来控制列和行的方向、计数、大小、间隙和两端对齐以及单元格内的元素对齐。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/TileLayoutExample.ts
     * @language zh_CN
     */
    var TileLayout = (function (_super) {
        __extends(TileLayout, _super);
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function TileLayout() {
            var _this = _super.call(this) || this;
            /**
             * @private
             * 标记horizontalGap被显式指定过
             */
            _this.explicitHorizontalGap = NaN;
            /**
             * @private
             */
            _this._horizontalGap = 6;
            /**
             * @private
             * 标记verticalGap被显式指定过
             */
            _this.explicitVerticalGap = NaN;
            /**
             * @private
             */
            _this._verticalGap = 6;
            /**
             * @private
             */
            _this._columnCount = -1;
            /**
             * @private
             */
            _this._requestedColumnCount = 0;
            /**
             * @private
             */
            _this._rowCount = -1;
            /**
             * @private
             */
            _this._requestedRowCount = 0;
            /**
             * @private
             * 外部显式指定的列宽
             */
            _this.explicitColumnWidth = NaN;
            /**
             * @private
             */
            _this._columnWidth = NaN;
            /**
             * @private
             * 外部显式指定的行高
             */
            _this.explicitRowHeight = NaN;
            /**
             * @private
             */
            _this._rowHeight = NaN;
            /**
             * @private
             */
            _this._paddingLeft = 0;
            /**
             * @private
             */
            _this._paddingRight = 0;
            /**
             * @private
             */
            _this._paddingTop = 0;
            /**
             * @private
             */
            _this._paddingBottom = 0;
            /**
             * @private
             */
            _this._horizontalAlign = eui.JustifyAlign.JUSTIFY;
            /**
             * @private
             */
            _this._verticalAlign = eui.JustifyAlign.JUSTIFY;
            /**
             * @private
             */
            _this._columnAlign = eui.ColumnAlign.LEFT;
            /**
             * @private
             */
            _this._rowAlign = eui.RowAlign.TOP;
            /**
             * @private
             */
            _this._orientation = eui.TileOrientation.ROWS;
            /**
             * @private
             * 缓存的最大子对象宽度
             */
            _this.maxElementWidth = 0;
            /**
             * @private
             * 缓存的最大子对象高度
             */
            _this.maxElementHeight = 0;
            /**
             * @private
             * 当前视图中的第一个元素索引
             */
            _this.startIndex = -1;
            /**
             * @private
             * 当前视图中的最后一个元素的索引
             */
            _this.endIndex = -1;
            /**
             * @private
             * 视图的第一个和最后一个元素的索引值已经计算好的标志
             */
            _this.indexInViewCalculated = false;
            return _this;
        }
        Object.defineProperty(TileLayout.prototype, "horizontalGap", {
            /**
             * Horizontal space between columns, in pixels.
             *
             * @default 6
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 列之间的水平空间（以像素为单位）。
             *
             * @default 6
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._horizontalGap;
            },
            set: function (value) {
                value = +value;
                if (value === this._horizontalGap)
                    return;
                this.explicitHorizontalGap = value;
                this._horizontalGap = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "verticalGap", {
            /**
             * Vertical space between rows, in pixels.
             *
             * @default 6
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 行之间的垂直空间（以像素为单位）。
             *
             * @default 6
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._verticalGap;
            },
            set: function (value) {
                value = +value;
                if (value === this._verticalGap)
                    return;
                this.explicitVerticalGap = value;
                this._verticalGap = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "columnCount", {
            /**
             * Contain the actual column count.
             *
             * @default -1
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             *  实际列计数。
             *
             * @default -1
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._columnCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "requestedColumnCount", {
            /**
             * Number of columns to be displayed.
             * <p>Set to 0 to allow the TileLayout to determine
             * the column count automatically.</p>
             * <p>If the <code>orientation</code> property is set to <code>TileOrientation.ROWS</code>,
             * then setting this property has no effect
             * In this case, the <code>rowCount</code> is explicitly set, and the
             * container width is explicitly set. </p>
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要显示的列数。
             * <p>设置为 0 会允许 TileLayout 自动确定列计数。</p>
             * <p>如果将 <code>orientation</code> 属性设置为 <code>TileOrientation.ROWS</code>，
             * 则设置此属性不会产生任何效果。这种情况下，会显式设置 code>rowCount</code>，并显式设置容器宽度。</p>
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._requestedColumnCount;
            },
            set: function (value) {
                value = +value || 0;
                if (this._requestedColumnCount === value)
                    return;
                this._requestedColumnCount = value;
                this._columnCount = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "rowCount", {
            /**
             * The row count.
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             *  行计数。
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._rowCount;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "requestedRowCount", {
            /**
             * Number of rows to be displayed.
             * <p>Set to 0 to remove explicit override and allow the TileLayout to determine
             * the row count automatically.</p>
             * <p>If the <code>orientation</code> property is set to
             * <code>TileOrientation.COLUMNS</code>, setting this property has no effect.
             * in this case, <code>columnCount</code> is explicitly set, and the
             * container height is explicitly set.</p>
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 要显示的行数。
             * <code>设置为 -1 会删除显式覆盖并允许 TileLayout 自动确定行计数。</code>
             * <code>如果将 <code>orientation</code> 属性设置为 <code>TileOrientation.COLUMNS</code>，
             * 则设置此属性不会产生任何效果。这种情况下，会显式设置 <code>columnCount</code>，并显式设置容器高度。</code>
             *
             * @default 0
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._requestedRowCount;
            },
            set: function (value) {
                value = +value || 0;
                if (this._requestedRowCount == value)
                    return;
                this._requestedRowCount = value;
                this._rowCount = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "columnWidth", {
            /**
             * Contain the actual column width, in pixels.
             * <p>If not explicitly set, the column width is
             * determined from the width of the widest element. </p>
             *
             * @default NaN
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 包含实际列宽（以像素为单位）。
             * <p>若未显式设置，则从根据最宽的元素的宽度确定列宽度。</p>
             *
             * @default NaN
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._columnWidth;
            },
            set: function (value) {
                value = +value;
                if (value === this._columnWidth)
                    return;
                this.explicitColumnWidth = value;
                this._columnWidth = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "rowHeight", {
            /**
             * The row height, in pixels.
             * <p>If not explicitly set, the row height is
             * determined from the maximum of elements' height.</p>
             *
             * @default NaN
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 行高（以像素为单位）。
             * <p>如果未显式设置，则从元素的高度的最大值确定行高度。<p>
             *
             * @default NaN
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._rowHeight;
            },
            set: function (value) {
                value = +value;
                if (value === this._rowHeight)
                    return;
                this.explicitRowHeight = value;
                this._rowHeight = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "paddingLeft", {
            /**
             * @copy eui.LinearLayoutBase#paddingLeft
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this._paddingLeft;
            },
            set: function (value) {
                value = +value || 0;
                if (this._paddingLeft == value)
                    return;
                this._paddingLeft = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "paddingRight", {
            /**
             * @copy eui.LinearLayoutBase#paddingRight
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this._paddingRight;
            },
            set: function (value) {
                value = +value || 0;
                if (this._paddingRight === value)
                    return;
                this._paddingRight = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "paddingTop", {
            /**
             * @copy eui.LinearLayoutBase#paddingTop
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this._paddingTop;
            },
            set: function (value) {
                value = +value || 0;
                if (this._paddingTop == value)
                    return;
                this._paddingTop = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "paddingBottom", {
            /**
             * @copy eui.LinearLayoutBase#paddingBottom
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             */
            get: function () {
                return this._paddingBottom;
            },
            set: function (value) {
                value = +value || 0;
                if (this._paddingBottom === value)
                    return;
                this._paddingBottom = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "horizontalAlign", {
            /**
             * Specifies how to align the elements within the cells in the horizontal direction.
             * Supported values are
             * HorizontalAlign.LEFT、HorizontalAlign.CENTER、
             * HorizontalAlign.RIGHT、JustifyAlign.JUSTIFY。
             *
             * @default <code>JustifyAlign.JUSTIFY</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 指定如何在水平方向上对齐单元格内的元素。支持的值有
             * HorizontalAlign.LEFT、HorizontalAlign.CENTER、
             * HorizontalAlign.RIGHT、JustifyAlign.JUSTIFY。
             *
             * @default <code>JustifyAlign.JUSTIFY</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._horizontalAlign;
            },
            set: function (value) {
                if (this._horizontalAlign == value)
                    return;
                this._horizontalAlign = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "verticalAlign", {
            /**
             * 指定如何在垂直方向上对齐单元格内的元素。
             * 支持的值有 VerticalAlign.TOP、VerticalAlign.MIDDLE、
             * VerticalAlign.BOTTOM、JustifyAlign.JUSTIFY。
             * 默认值：JustifyAlign.JUSTIFY。
             *
             * @default <code>eui.JustifyAlign.JUSTIFY</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * Specifies how to align the elements within the cells in the vertical direction.
             * Supported values are
             * VerticalAlign.TOP、VerticalAlign.MIDDLE、
             * VerticalAlign.BOTTOM、JustifyAlign.JUSTIFY。
             *
             * @default <code>eui.JustifyAlign.JUSTIFY</code>
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._verticalAlign;
            },
            set: function (value) {
                if (this._verticalAlign == value)
                    return;
                this._verticalAlign = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "columnAlign", {
            /**
             * Specifies how to justify the fully visible columns to the container width.
             *
             * <p>When set to <code>ColumnAlign.LEFT</code> it turns column justification off.
             *  There may be partially visible columns or whitespace between the last column and
             *  the right edge of the container.  This is the default value.</p>
             *
             * <p>When set to <code>ColumnAlign.JUSTIFY_USING_GAP</code> the <code>horizontalGap</code>
             * actual value increases so that
             * the last fully visible column right edge aligns with the container's right edge.
             * In case there is only a single fully visible column, the <code>horizontalGap</code> actual value
             * increases so that it pushes any partially visible column beyond the right edge
             * of the container.
             * Note that explicitly setting the <code>horizontalGap</code> property does not turn off
             * justification. It only determines the initial gap value.
             * Justification may increases it.</p>
             *
             * <p>When set to <code>ColumnAlign.JUSTIFY_USING_WIDTH</code> the <code>columnWidth</code>
             * actual value increases so that
             * the last fully visible column right edge aligns with the container's right edge.
             * Note that explicitly setting the <code>columnWidth</code> property does not turn off justification.
             * It only determines the initial column width value.
             * Justification may increases it.</p>
             *
             * @default ColumnAlign.LEFT
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 指定如何将完全可见列与容器宽度对齐。
             *
             * <p>设置为 <code>ColumnAlign.LEFT</code> 时，它会关闭列两端对齐。
             * 在容器的最后一列和右边缘之间可能存在部分可见的列或空白。这是默认值。</p>
             *
             * <p>设置为 <code>ColumnAlign.JUSTIFY_USING_GAP</code> 时，<code>horizontalGap</code> 的实际值将增大，
             * 这样最后一个完全可见列右边缘会与容器的右边缘对齐。仅存在一个完全可见列时，
             * <code>horizontalGap</code> 的实际值将增大，这样它会将任何部分可见列推到容器的右边缘之外。
             * 请注意显式设置 <code>horizontalGap</code> 属性不会关闭两端对齐。它仅确定初始间隙值。两端对齐可能会增大它。</p>
             *
             * <p>设置为 <code>ColumnAlign.JUSTIFY_USING_WIDTH</code> 时，<code>columnWidth</code> 的实际值将增大，
             * 这样最后一个完全可见列右边缘会与容器的右边缘对齐。请注意显式设置 <code>columnWidth</code> 属性不会关闭两端对齐。
             * 它仅确定初始列宽度值。两端对齐可能会增大它。</p>
             *
             * @default ColumnAlign.LEFT
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._columnAlign;
            },
            set: function (value) {
                if (this._columnAlign == value)
                    return;
                this._columnAlign = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "rowAlign", {
            /**
             * Specifies how to justify the fully visible rows to the container height.
             *
             * <p>When set to <code>RowAlign.TOP</code> it turns column justification off.
             * There might be partially visible rows or whitespace between the last row and
             * the bottom edge of the container.  This is the default value.</p>
             *
             * <p>When set to <code>RowAlign.JUSTIFY_USING_GAP</code> the <code>verticalGap</code>
             * actual value increases so that
             * the last fully visible row bottom edge aligns with the container's bottom edge.
             * In case there is only a single fully visible row, the value of <code>verticalGap</code>
             * increases so that it pushes any partially visible row beyond the bottom edge
             * of the container.  Note that explicitly setting the <code>verticalGap</code> does not turn off
             * justification, but just determines the initial gap value.
             * Justification can then increases it.</p>
             *
             * <p>When set to <code>RowAlign.JUSTIFY_USING_HEIGHT</code> the <code>rowHeight</code>
             * actual value increases so that
             * the last fully visible row bottom edge aligns with the container's bottom edge.  Note that
             * explicitly setting the <code>rowHeight</code> does not turn off justification, but
             * determines the initial row height value.
             * Justification can then increase it.</p>
             *
             * @default RowAlign.TOP
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 指定如何将完全可见行与容器高度对齐。
             *
             * <p>设置为 <code>RowAlign.TOP</code> 时，它会关闭列两端对齐。
             * 在容器的最后一行和底边缘之间可能存在部分可见的行或空白。这是默认值。</p>
             *
             * <p>设置为 <code>RowAlign.JUSTIFY_USING_GAP</code> 时，<code>verticalGap</code> 的实际值会增大，
             * 这样最后一个完全可见行底边缘会与容器的底边缘对齐。仅存在一个完全可见行时，<code>verticalGap</code> 的值会增大，
             * 这样它会将任何部分可见行推到容器的底边缘之外。请注意，显式设置 <code>verticalGap</code>
             * 不会关闭两端对齐，而只是确定初始间隙值。两端对齐接着可以增大它。</p>
             *
             * <p>设置为 <code>RowAlign.JUSTIFY_USING_HEIGHT</code> 时，<code>rowHeight</code> 的实际值会增大，
             * 这样最后一个完全可见行底边缘会与容器的底边缘对齐。请注意，显式设置 <code>rowHeight</code>
             * 不会关闭两端对齐，而只是确定初始行高度值。两端对齐接着可以增大它。</p>
             *
             * @default RowAlign.TOP
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._rowAlign;
            },
            set: function (value) {
                if (this._rowAlign == value)
                    return;
                this._rowAlign = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TileLayout.prototype, "orientation", {
            /**
             * Specifies whether elements are arranged row by row or
             * column by column.
             *
             * @default TileOrientation.ROWS
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language en_US
             */
            /**
             * 指定是逐行还是逐列排列元素。
             *
             * @default TileOrientation.ROWS
             *
             * @version Egret 2.4
             * @version eui 1.0
             * @platform Web,Native
             * @language zh_CN
             */
            get: function () {
                return this._orientation;
            },
            set: function (value) {
                if (this._orientation == value)
                    return;
                this._orientation = value;
                this.invalidateTargetLayout();
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @private
         * 标记目标容器的尺寸和显示列表失效
         */
        TileLayout.prototype.invalidateTargetLayout = function () {
            var target = this.$target;
            if (target) {
                target.invalidateSize();
                target.invalidateDisplayList();
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        TileLayout.prototype.measure = function () {
            var target = this.$target;
            if (!target)
                return;
            var savedColumnCount = this._columnCount;
            var savedRowCount = this._rowCount;
            var savedColumnWidth = this._columnWidth;
            var savedRowHeight = this._rowHeight;
            var measuredWidth = 0;
            var measuredHeight = 0;
            var values = target.$UIComponent;
            this.calculateRowAndColumn(values[8 /* explicitWidth */], values[9 /* explicitHeight */]);
            var columnCount = this._requestedColumnCount > 0 ? this._requestedColumnCount : this._columnCount;
            var rowCount = this._requestedRowCount > 0 ? this._requestedRowCount : this._rowCount;
            var horizontalGap = isNaN(this._horizontalGap) ? 0 : this._horizontalGap;
            var verticalGap = isNaN(this._verticalGap) ? 0 : this._verticalGap;
            if (columnCount > 0) {
                measuredWidth = columnCount * (this._columnWidth + horizontalGap) - horizontalGap;
            }
            if (rowCount > 0) {
                measuredHeight = rowCount * (this._rowHeight + verticalGap) - verticalGap;
            }
            var hPadding = this._paddingLeft + this._paddingRight;
            var vPadding = this._paddingTop + this._paddingBottom;
            target.setMeasuredSize(measuredWidth + hPadding, measuredHeight + vPadding);
            this._columnCount = savedColumnCount;
            this._rowCount = savedRowCount;
            this._columnWidth = savedColumnWidth;
            this._rowHeight = savedRowHeight;
        };
        /**
         * @private
         * 计算行和列的尺寸及数量
         */
        TileLayout.prototype.calculateRowAndColumn = function (explicitWidth, explicitHeight) {
            var target = this.$target;
            var horizontalGap = isNaN(this._horizontalGap) ? 0 : this._horizontalGap;
            var verticalGap = isNaN(this._verticalGap) ? 0 : this._verticalGap;
            this._rowCount = this._columnCount = -1;
            var numElements = target.numElements;
            var count = numElements;
            for (var index = 0; index < count; index++) {
                var layoutElement = (target.getElementAt(index));
                if (layoutElement && (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout)) {
                    numElements--;
                    continue;
                }
            }
            if (numElements == 0) {
                this._rowCount = this._columnCount = 0;
                return;
            }
            if (isNaN(this.explicitColumnWidth) || isNaN(this.explicitRowHeight))
                this.updateMaxElementSize();
            if (isNaN(this.explicitColumnWidth)) {
                this._columnWidth = this.maxElementWidth;
            }
            else {
                this._columnWidth = this.explicitColumnWidth;
            }
            if (isNaN(this.explicitRowHeight)) {
                this._rowHeight = this.maxElementHeight;
            }
            else {
                this._rowHeight = this.explicitRowHeight;
            }
            var itemWidth = this._columnWidth + horizontalGap;
            //防止出现除数为零的情况
            if (itemWidth <= 0)
                itemWidth = 1;
            var itemHeight = this._rowHeight + verticalGap;
            if (itemHeight <= 0)
                itemHeight = 1;
            var orientedByColumns = (this._orientation == eui.TileOrientation.COLUMNS);
            var widthHasSet = !isNaN(explicitWidth);
            var heightHasSet = !isNaN(explicitHeight);
            var paddingL = this._paddingLeft;
            var paddingR = this._paddingRight;
            var paddingT = this._paddingTop;
            var paddingB = this._paddingBottom;
            if (this._requestedColumnCount > 0 || this._requestedRowCount > 0) {
                if (this._requestedRowCount > 0)
                    this._rowCount = Math.min(this._requestedRowCount, numElements);
                if (this._requestedColumnCount > 0)
                    this._columnCount = Math.min(this._requestedColumnCount, numElements);
            }
            else if (!widthHasSet && !heightHasSet) {
                var side = Math.sqrt(numElements * itemWidth * itemHeight);
                if (orientedByColumns) {
                    this._rowCount = Math.max(1, Math.round(side / itemHeight));
                }
                else {
                    this._columnCount = Math.max(1, Math.round(side / itemWidth));
                }
            }
            else if (widthHasSet && (!heightHasSet || !orientedByColumns)) {
                var targetWidth = Math.max(0, explicitWidth - paddingL - paddingR);
                this._columnCount = Math.floor((targetWidth + horizontalGap) / itemWidth);
                this._columnCount = Math.max(1, Math.min(this._columnCount, numElements));
            }
            else {
                var targetHeight = Math.max(0, explicitHeight - paddingT - paddingB);
                this._rowCount = Math.floor((targetHeight + verticalGap) / itemHeight);
                this._rowCount = Math.max(1, Math.min(this._rowCount, numElements));
            }
            if (this._rowCount == -1)
                this._rowCount = Math.max(1, Math.ceil(numElements / this._columnCount));
            if (this._columnCount == -1)
                this._columnCount = Math.max(1, Math.ceil(numElements / this._rowCount));
            if (this._requestedColumnCount > 0 && this._requestedRowCount > 0) {
                if (this._orientation == eui.TileOrientation.ROWS)
                    this._rowCount = Math.max(1, Math.ceil(numElements / this._requestedColumnCount));
                else
                    this._columnCount = Math.max(1, Math.ceil(numElements / this._requestedRowCount));
            }
        };
        /**
         * @private
         * 更新最大子对象尺寸
         */
        TileLayout.prototype.updateMaxElementSize = function () {
            if (!this.$target)
                return;
            if (this.$useVirtualLayout) {
                this.maxElementWidth = Math.max(this.maxElementWidth, this.$typicalWidth);
                this.maxElementHeight = Math.max(this.maxElementHeight, this.$typicalHeight);
                this.doUpdateMaxElementSize(this.startIndex, this.endIndex);
            }
            else {
                this.doUpdateMaxElementSize(0, this.$target.numElements - 1);
            }
        };
        /**
         * @private
         * 更新虚拟布局的最大子对象尺寸
         */
        TileLayout.prototype.doUpdateMaxElementSize = function (startIndex, endIndex) {
            var maxElementWidth = this.maxElementWidth;
            var maxElementHeight = this.maxElementHeight;
            var bounds = egret.$TempRectangle;
            var target = this.$target;
            if ((startIndex != -1) && (endIndex != -1)) {
                for (var index = startIndex; index <= endIndex; index++) {
                    var elt = target.getVirtualElementAt(index);
                    if (!egret.is(elt, UIComponentClass) || !elt.$includeInLayout) {
                        continue;
                    }
                    elt.getPreferredBounds(bounds);
                    maxElementWidth = Math.max(maxElementWidth, bounds.width);
                    maxElementHeight = Math.max(maxElementHeight, bounds.height);
                }
            }
            this.maxElementWidth = maxElementWidth;
            this.maxElementHeight = maxElementHeight;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        TileLayout.prototype.clearVirtualLayoutCache = function () {
            _super.prototype.clearVirtualLayoutCache.call(this);
            this.maxElementWidth = 0;
            this.maxElementHeight = 0;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        TileLayout.prototype.scrollPositionChanged = function () {
            if (this.$useVirtualLayout) {
                var changed = this.getIndexInView();
                if (changed) {
                    this.indexInViewCalculated = true;
                    this.$target.invalidateDisplayList();
                }
            }
        };
        /**
         * @private
         * 获取视图中第一个和最后一个元素的索引,返回是否发生改变
         */
        TileLayout.prototype.getIndexInView = function () {
            if (!this.$target || this.$target.numElements == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }
            var target = this.$target;
            var numElements = target.numElements;
            if (!this.$useVirtualLayout) {
                this.startIndex = 0;
                this.endIndex = numElements - 1;
                return false;
            }
            var values = target.$UIComponent;
            if (values[10 /* width */] == 0 || values[11 /* height */] == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }
            var oldStartIndex = this.startIndex;
            var oldEndIndex = this.endIndex;
            var paddingL = this._paddingLeft;
            var paddingT = this._paddingTop;
            var horizontalGap = isNaN(this._horizontalGap) ? 0 : this._horizontalGap;
            var verticalGap = isNaN(this._verticalGap) ? 0 : this._verticalGap;
            if (this._orientation == eui.TileOrientation.COLUMNS) {
                var itemWidth = this._columnWidth + horizontalGap;
                if (itemWidth <= 0) {
                    this.startIndex = 0;
                    this.endIndex = numElements - 1;
                    return false;
                }
                var minVisibleX = target.scrollH;
                var maxVisibleX = minVisibleX + values[10 /* width */];
                var startColumn = Math.floor((minVisibleX - paddingL) / itemWidth);
                if (startColumn < 0)
                    startColumn = 0;
                var endColumn = Math.ceil((maxVisibleX - paddingL) / itemWidth);
                if (endColumn < 0)
                    endColumn = 0;
                this.startIndex = Math.min(numElements - 1, Math.max(0, startColumn * this._rowCount));
                this.endIndex = Math.min(numElements - 1, Math.max(0, endColumn * this._rowCount - 1));
            }
            else {
                var itemHeight = this._rowHeight + verticalGap;
                if (itemHeight <= 0) {
                    this.startIndex = 0;
                    this.endIndex = numElements - 1;
                    return false;
                }
                var minVisibleY = target.scrollV;
                var maxVisibleY = minVisibleY + values[11 /* height */];
                var startRow = Math.floor((minVisibleY - paddingT) / itemHeight);
                if (startRow < 0)
                    startRow = 0;
                var endRow = Math.ceil((maxVisibleY - paddingT) / itemHeight);
                if (endRow < 0)
                    endRow = 0;
                this.startIndex = Math.min(numElements - 1, Math.max(0, startRow * this._columnCount));
                this.endIndex = Math.min(numElements - 1, Math.max(0, endRow * this._columnCount - 1));
            }
            return this.startIndex != oldStartIndex || this.endIndex != oldEndIndex;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        TileLayout.prototype.updateDisplayList = function (width, height) {
            _super.prototype.updateDisplayList.call(this, width, height);
            if (!this.$target)
                return;
            var target = this.$target;
            var paddingL = this._paddingLeft;
            var paddingR = this._paddingRight;
            var paddingT = this._paddingTop;
            var paddingB = this._paddingBottom;
            if (this.indexInViewCalculated) {
                this.indexInViewCalculated = false;
            }
            else {
                this.calculateRowAndColumn(width, height);
                if (this._rowCount == 0 || this._columnCount == 0) {
                    target.setContentSize(paddingL + paddingR, paddingT + paddingB);
                    return;
                }
                this.adjustForJustify(width, height);
                this.getIndexInView();
            }
            if (this.$useVirtualLayout) {
                this.calculateRowAndColumn(width, height);
                this.adjustForJustify(width, height);
            }
            if (this.startIndex == -1 || this.endIndex == -1) {
                target.setContentSize(0, 0);
                return;
            }
            var endIndex = this.endIndex;
            target.setVirtualElementIndicesInView(this.startIndex, endIndex);
            var elt;
            var x;
            var y;
            var columnIndex;
            var rowIndex;
            var orientedByColumns = (this._orientation == eui.TileOrientation.COLUMNS);
            var index = this.startIndex;
            var horizontalGap = isNaN(this._horizontalGap) ? 0 : this._horizontalGap;
            var verticalGap = isNaN(this._verticalGap) ? 0 : this._verticalGap;
            var rowCount = this._rowCount;
            var columnCount = this._columnCount;
            var columnWidth = this._columnWidth;
            var rowHeight = this._rowHeight;
            for (var i = this.startIndex; i <= endIndex; i++) {
                if (this.$useVirtualLayout) {
                    elt = (this.target.getVirtualElementAt(i));
                }
                else {
                    elt = (this.target.getElementAt(i));
                }
                if (!egret.is(elt, UIComponentClass) || !elt.$includeInLayout) {
                    continue;
                }
                if (orientedByColumns) {
                    columnIndex = Math.ceil((index + 1) / rowCount) - 1;
                    rowIndex = Math.ceil((index + 1) % rowCount) - 1;
                    if (rowIndex == -1)
                        rowIndex = rowCount - 1;
                }
                else {
                    columnIndex = Math.ceil((index + 1) % columnCount) - 1;
                    if (columnIndex == -1)
                        columnIndex = columnCount - 1;
                    rowIndex = Math.ceil((index + 1) / columnCount) - 1;
                }
                switch (this._horizontalAlign) {
                    case egret.HorizontalAlign.RIGHT:
                        x = width - (columnIndex + 1) * (columnWidth + horizontalGap) + horizontalGap - paddingR;
                        break;
                    case egret.HorizontalAlign.LEFT:
                        x = columnIndex * (columnWidth + horizontalGap) + paddingL;
                        break;
                    default:
                        x = columnIndex * (columnWidth + horizontalGap) + paddingL;
                }
                switch (this._verticalAlign) {
                    case egret.VerticalAlign.TOP:
                        y = rowIndex * (rowHeight + verticalGap) + paddingT;
                        break;
                    case egret.VerticalAlign.BOTTOM:
                        y = height - (rowIndex + 1) * (rowHeight + verticalGap) + verticalGap - paddingB;
                        break;
                    default:
                        y = rowIndex * (rowHeight + verticalGap) + paddingT;
                }
                this.sizeAndPositionElement(elt, x, y, columnWidth, rowHeight);
                index++;
            }
            var hPadding = paddingL + paddingR;
            var vPadding = paddingT + paddingB;
            var contentWidth = (columnWidth + horizontalGap) * columnCount - horizontalGap;
            var contentHeight = (rowHeight + verticalGap) * rowCount - verticalGap;
            target.setContentSize(contentWidth + hPadding, contentHeight + vPadding);
        };
        /**
         * @private
         * 为单个元素布局
         */
        TileLayout.prototype.sizeAndPositionElement = function (element, cellX, cellY, cellWidth, cellHeight) {
            var elementWidth = NaN;
            var elementHeight = NaN;
            var values = element.$UIComponent;
            if (this._horizontalAlign == eui.JustifyAlign.JUSTIFY)
                elementWidth = cellWidth;
            else if (!isNaN(values[6 /* percentWidth */]))
                elementWidth = cellWidth * values[6 /* percentWidth */] * 0.01;
            if (this._verticalAlign == eui.JustifyAlign.JUSTIFY)
                elementHeight = cellHeight;
            else if (!isNaN(values[7 /* percentHeight */]))
                elementHeight = cellHeight * values[7 /* percentHeight */] * 0.01;
            element.setLayoutBoundsSize(Math.round(elementWidth), Math.round(elementHeight));
            var x = cellX;
            var bounds = egret.$TempRectangle;
            element.getLayoutBounds(bounds);
            switch (this._horizontalAlign) {
                case egret.HorizontalAlign.RIGHT:
                    x += cellWidth - bounds.width;
                    break;
                case egret.HorizontalAlign.CENTER:
                    x = cellX + (cellWidth - bounds.width) / 2;
                    break;
            }
            var y = cellY;
            switch (this._verticalAlign) {
                case egret.VerticalAlign.BOTTOM:
                    y += cellHeight - bounds.height;
                    break;
                case egret.VerticalAlign.MIDDLE:
                    y += (cellHeight - bounds.height) / 2;
                    break;
            }
            element.setLayoutBoundsPosition(Math.round(x), Math.round(y));
        };
        /**
         * @private
         * 为两端对齐调整间隔或格子尺寸
         */
        TileLayout.prototype.adjustForJustify = function (width, height) {
            var paddingL = this._paddingLeft;
            var paddingR = this._paddingRight;
            var paddingT = this._paddingTop;
            var paddingB = this._paddingBottom;
            var targetWidth = Math.max(0, width - paddingL - paddingR);
            var targetHeight = Math.max(0, height - paddingT - paddingB);
            if (!isNaN(this.explicitVerticalGap))
                this._verticalGap = this.explicitVerticalGap;
            if (!isNaN(this.explicitHorizontalGap))
                this._horizontalGap = this.explicitHorizontalGap;
            this._verticalGap = isNaN(this._verticalGap) ? 0 : this._verticalGap;
            this._horizontalGap = isNaN(this._horizontalGap) ? 0 : this._horizontalGap;
            var offsetY = targetHeight - this._rowHeight * this._rowCount;
            var offsetX = targetWidth - this._columnWidth * this._columnCount;
            var gapCount;
            if (offsetY > 0) {
                if (this._rowAlign == eui.RowAlign.JUSTIFY_USING_GAP) {
                    gapCount = Math.max(1, this._rowCount - 1);
                    this._verticalGap = offsetY / gapCount;
                }
                else if (this._rowAlign == eui.RowAlign.JUSTIFY_USING_HEIGHT) {
                    if (this._rowCount > 0) {
                        this._rowHeight += (offsetY - (this._rowCount - 1) * this._verticalGap) / this._rowCount;
                    }
                }
            }
            if (offsetX > 0) {
                if (this._columnAlign == eui.ColumnAlign.JUSTIFY_USING_GAP) {
                    gapCount = Math.max(1, this._columnCount - 1);
                    this._horizontalGap = offsetX / gapCount;
                }
                else if (this._columnAlign == eui.ColumnAlign.JUSTIFY_USING_WIDTH) {
                    if (this._columnCount > 0) {
                        this._columnWidth += (offsetX - (this._columnCount - 1) * this._horizontalGap) / this._columnCount;
                    }
                }
            }
        };
        return TileLayout;
    }(eui.LayoutBase));
    eui.TileLayout = TileLayout;
    __reflect(TileLayout.prototype, "eui.TileLayout");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The TileOrientation class defines the possible values for the
     * <code>orientation</code> property of the TileLayout class.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/TileOrientationExample.ts
     * @language en_US
     */
    /**
     * TileOrientation 类为 TileLayout 类的 <code>orientation</code> 属性定义可能的值。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/TileOrientationExample.ts
     * @language zh_CN
     */
    var TileOrientation = (function () {
        function TileOrientation() {
        }
        /**
         * Arranges elements row by row.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 逐行排列元素。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        TileOrientation.ROWS = "rows";
        /**
         * Arranges elements column by column.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 逐列排列元素。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        TileOrientation.COLUMNS = "columns";
        return TileOrientation;
    }());
    eui.TileOrientation = TileOrientation;
    __reflect(TileOrientation.prototype, "eui.TileOrientation");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var UIComponentClass = "eui.UIComponent";
    /**
     * The VerticalLayout class arranges the layout elements in a vertical sequence,
     * top to bottom, with optional gaps between the elements and optional padding
     * around the sequence of elements.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/VerticalLayoutExample.ts
     * @language en_US
     */
    /**
     * VerticalLayout 类按垂直顺序从上向下排列布局元素，在元素和围绕元素顺序的可选填充之间带有可选间隙。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/layout/VerticalLayoutExample.ts
     * @language zh_CN
     */
    var VerticalLayout = (function (_super) {
        __extends(VerticalLayout, _super);
        function VerticalLayout() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VerticalLayout.prototype.measureReal = function () {
            var target = this.$target;
            var count = target.numElements;
            var numElements = count;
            var measuredWidth = 0;
            var measuredHeight = 0;
            var bounds = egret.$TempRectangle;
            for (var i = 0; i < count; i++) {
                var layoutElement = (target.getElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    numElements--;
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                measuredHeight += bounds.height;
                measuredWidth = Math.max(measuredWidth, bounds.width);
            }
            measuredHeight += (numElements - 1) * this.$gap;
            var hPadding = this.$paddingLeft + this.$paddingRight;
            var vPadding = this.$paddingTop + this.$paddingBottom;
            target.setMeasuredSize(measuredWidth + hPadding, measuredHeight + vPadding);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VerticalLayout.prototype.measureVirtual = function () {
            var target = this.$target;
            var typicalHeight = this.$typicalHeight;
            var measuredHeight = this.getElementTotalSize();
            var measuredWidth = Math.max(this.maxElementSize, this.$typicalWidth);
            var bounds = egret.$TempRectangle;
            var endIndex = this.endIndex;
            var elementSizeTable = this.elementSizeTable;
            for (var index = this.startIndex; index < endIndex; index++) {
                var layoutElement = (target.getElementAt(index));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                measuredHeight += bounds.height;
                measuredHeight -= isNaN(elementSizeTable[index]) ? typicalHeight : elementSizeTable[index];
                measuredWidth = Math.max(measuredWidth, bounds.width);
            }
            var hPadding = this.$paddingLeft + this.$paddingRight;
            var vPadding = this.$paddingTop + this.$paddingBottom;
            target.setMeasuredSize(measuredWidth + hPadding, measuredHeight + vPadding);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VerticalLayout.prototype.updateDisplayListReal = function (width, height) {
            var target = this.$target;
            var paddingL = this.$paddingLeft;
            var paddingR = this.$paddingRight;
            var paddingT = this.$paddingTop;
            var paddingB = this.$paddingBottom;
            var gap = this.$gap;
            var targetWidth = Math.max(0, width - paddingL - paddingR);
            var targetHeight = Math.max(0, height - paddingT - paddingB);
            var vJustify = this.$verticalAlign == eui.JustifyAlign.JUSTIFY;
            var hJustify = this.$horizontalAlign == eui.JustifyAlign.JUSTIFY || this.$horizontalAlign == eui.JustifyAlign.CONTENT_JUSTIFY;
            var hAlign = 0;
            if (!hJustify) {
                if (this.$horizontalAlign == egret.HorizontalAlign.CENTER) {
                    hAlign = 0.5;
                }
                else if (this.$horizontalAlign == egret.HorizontalAlign.RIGHT) {
                    hAlign = 1;
                }
            }
            var count = target.numElements;
            var numElements = count;
            var x = paddingL;
            var y = paddingT;
            var i;
            var layoutElement;
            var totalPreferredHeight = 0;
            var totalPercentHeight = 0;
            var childInfoArray = [];
            var childInfo;
            var heightToDistribute = targetHeight;
            var maxElementWidth = this.maxElementSize;
            var bounds = egret.$TempRectangle;
            for (i = 0; i < count; i++) {
                var layoutElement_2 = (target.getElementAt(i));
                if (!egret.is(layoutElement_2, UIComponentClass) || !layoutElement_2.$includeInLayout) {
                    numElements--;
                    continue;
                }
                layoutElement_2.getPreferredBounds(bounds);
                maxElementWidth = Math.max(maxElementWidth, bounds.width);
                if (vJustify) {
                    totalPreferredHeight += bounds.height;
                }
                else {
                    var values = layoutElement_2.$UIComponent;
                    if (!isNaN(values[7 /* percentHeight */])) {
                        totalPercentHeight += values[7 /* percentHeight */];
                        childInfo = new eui.sys.ChildInfo();
                        childInfo.layoutElement = layoutElement_2;
                        childInfo.percent = values[7 /* percentHeight */];
                        childInfo.min = values[14 /* minHeight */];
                        childInfo.max = values[15 /* maxHeight */];
                        childInfoArray.push(childInfo);
                    }
                    else {
                        heightToDistribute -= bounds.height;
                    }
                }
            }
            heightToDistribute -= gap * (numElements - 1);
            heightToDistribute = heightToDistribute > 0 ? heightToDistribute : 0;
            var excessSpace = targetHeight - totalPreferredHeight - gap * (numElements - 1);
            var averageHeight;
            var largeChildrenCount = numElements;
            var heightDic = {};
            if (vJustify) {
                if (excessSpace < 0) {
                    averageHeight = heightToDistribute / numElements;
                    for (i = 0; i < count; i++) {
                        layoutElement = (target.getElementAt(i));
                        if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                            continue;
                        }
                        layoutElement.getPreferredBounds(bounds);
                        if (bounds.height <= averageHeight) {
                            heightToDistribute -= bounds.height;
                            largeChildrenCount--;
                            continue;
                        }
                    }
                    heightToDistribute = heightToDistribute > 0 ? heightToDistribute : 0;
                }
            }
            else {
                if (totalPercentHeight > 0) {
                    this.flexChildrenProportionally(targetHeight, heightToDistribute, totalPercentHeight, childInfoArray);
                    var roundOff_2 = 0;
                    var length_32 = childInfoArray.length;
                    for (i = 0; i < length_32; i++) {
                        childInfo = childInfoArray[i];
                        var childSize = Math.round(childInfo.size + roundOff_2);
                        roundOff_2 += childInfo.size - childSize;
                        heightDic[childInfo.layoutElement.$hashCode] = childSize;
                        heightToDistribute -= childSize;
                    }
                    heightToDistribute = heightToDistribute > 0 ? heightToDistribute : 0;
                }
            }
            if (this.$verticalAlign == egret.VerticalAlign.MIDDLE) {
                y = paddingT + heightToDistribute * 0.5;
            }
            else if (this.$verticalAlign == egret.VerticalAlign.BOTTOM) {
                y = paddingT + heightToDistribute;
            }
            var maxX = paddingL;
            var maxY = paddingT;
            var dx = 0;
            var dy = 0;
            var justifyWidth = Math.ceil(targetWidth);
            if (this.$horizontalAlign == eui.JustifyAlign.CONTENT_JUSTIFY)
                justifyWidth = Math.ceil(Math.max(targetWidth, maxElementWidth));
            var roundOff = 0;
            var layoutElementHeight;
            var childHeight;
            for (i = 0; i < count; i++) {
                var exceesWidth = 0;
                layoutElement = (target.getElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                layoutElementHeight = NaN;
                if (vJustify) {
                    childHeight = NaN;
                    if (excessSpace > 0) {
                        childHeight = heightToDistribute * bounds.height / totalPreferredHeight;
                    }
                    else if (excessSpace < 0 && bounds.height > averageHeight) {
                        childHeight = heightToDistribute / largeChildrenCount;
                    }
                    if (!isNaN(childHeight)) {
                        layoutElementHeight = Math.round(childHeight + roundOff);
                        roundOff += childHeight - layoutElementHeight;
                    }
                }
                else {
                    layoutElementHeight = heightDic[layoutElement.$hashCode];
                }
                if (hJustify) {
                    x = paddingL;
                    layoutElement.setLayoutBoundsSize(justifyWidth, layoutElementHeight);
                    layoutElement.getLayoutBounds(bounds);
                }
                else {
                    var layoutElementWidth = NaN;
                    var values = layoutElement.$UIComponent;
                    if (!isNaN(values[6 /* percentWidth */])) {
                        var percent = Math.min(100, values[6 /* percentWidth */]);
                        layoutElementWidth = Math.round(targetWidth * percent * 0.01);
                    }
                    layoutElement.setLayoutBoundsSize(layoutElementWidth, layoutElementHeight);
                    layoutElement.getLayoutBounds(bounds);
                    exceesWidth = (targetWidth - bounds.width) * hAlign;
                    exceesWidth = exceesWidth > 0 ? exceesWidth : 0;
                    x = paddingL + exceesWidth;
                }
                layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
                dx = Math.ceil(bounds.width);
                dy = Math.ceil(bounds.height);
                maxX = Math.max(maxX, x + dx);
                maxY = Math.max(maxY, y + dy);
                y += dy + gap;
            }
            this.maxElementSize = maxElementWidth;
            target.setContentSize(maxX + paddingR, maxY + paddingB);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VerticalLayout.prototype.updateDisplayListVirtual = function (width, height) {
            var target = this.$target;
            if (this.indexInViewCalculated)
                this.indexInViewCalculated = false;
            else
                this.getIndexInView();
            var paddingB = this.$paddingBottom;
            var paddingL = this.$paddingLeft;
            var paddingR = this.$paddingRight;
            var gap = this.$gap;
            var contentHeight;
            var numElements = target.numElements;
            if (this.startIndex == -1 || this.endIndex == -1) {
                contentHeight = this.getStartPosition(numElements) - gap + paddingB;
                target.setContentSize(target.contentWidth, contentHeight);
                return;
            }
            var endIndex = this.endIndex;
            target.setVirtualElementIndicesInView(this.startIndex, endIndex);
            //获取垂直布局参数
            var justify = this.$horizontalAlign == eui.JustifyAlign.JUSTIFY || this.$horizontalAlign == eui.JustifyAlign.CONTENT_JUSTIFY;
            var contentJustify = this.$horizontalAlign == eui.JustifyAlign.CONTENT_JUSTIFY;
            var hAlign = 0;
            if (!justify) {
                if (this.$horizontalAlign == egret.HorizontalAlign.CENTER) {
                    hAlign = 0.5;
                }
                else if (this.$horizontalAlign == egret.HorizontalAlign.RIGHT) {
                    hAlign = 1;
                }
            }
            var bounds = egret.$TempRectangle;
            var targetWidth = Math.max(0, width - paddingL - paddingR);
            var justifyWidth = Math.ceil(targetWidth);
            var layoutElement;
            var typicalHeight = this.$typicalHeight;
            var typicalWidth = this.$typicalWidth;
            var maxElementWidth = this.maxElementSize;
            var oldMaxW = Math.max(typicalWidth, this.maxElementSize);
            if (contentJustify) {
                for (var index = this.startIndex; index <= endIndex; index++) {
                    layoutElement = (target.getVirtualElementAt(index));
                    if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                        continue;
                    }
                    layoutElement.getPreferredBounds(bounds);
                    maxElementWidth = Math.max(maxElementWidth, bounds.width);
                }
                justifyWidth = Math.ceil(Math.max(targetWidth, maxElementWidth));
            }
            var x = 0;
            var y = 0;
            var contentWidth = 0;
            var oldElementSize;
            var needInvalidateSize = false;
            var elementSizeTable = this.elementSizeTable;
            //对可见区域进行布局
            for (var i = this.startIndex; i <= endIndex; i++) {
                var exceesWidth = 0;
                layoutElement = (target.getVirtualElementAt(i));
                if (!egret.is(layoutElement, UIComponentClass) || !layoutElement.$includeInLayout) {
                    continue;
                }
                layoutElement.getPreferredBounds(bounds);
                if (!contentJustify) {
                    maxElementWidth = Math.max(maxElementWidth, bounds.width);
                }
                if (justify) {
                    x = paddingL;
                    layoutElement.setLayoutBoundsSize(justifyWidth, NaN);
                    layoutElement.getLayoutBounds(bounds);
                }
                else {
                    layoutElement.getLayoutBounds(bounds);
                    exceesWidth = (targetWidth - bounds.width) * hAlign;
                    exceesWidth = exceesWidth > 0 ? exceesWidth : 0;
                    x = paddingL + exceesWidth;
                }
                contentWidth = Math.max(contentWidth, bounds.width);
                if (!needInvalidateSize) {
                    oldElementSize = isNaN(elementSizeTable[i]) ? typicalHeight : elementSizeTable[i];
                    if (oldElementSize != bounds.height)
                        needInvalidateSize = true;
                }
                elementSizeTable[i] = bounds.height;
                y = this.getStartPosition(i);
                layoutElement.setLayoutBoundsPosition(Math.round(x), Math.round(y));
            }
            contentWidth += paddingL + paddingR;
            contentHeight = this.getStartPosition(numElements) - gap + paddingB;
            this.maxElementSize = maxElementWidth;
            target.setContentSize(contentWidth, contentHeight);
            if (needInvalidateSize || oldMaxW < this.maxElementSize) {
                target.invalidateSize();
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VerticalLayout.prototype.getStartPosition = function (index) {
            if (!this.$useVirtualLayout) {
                if (this.$target) {
                    var element = this.$target.getElementAt(index);
                    if (element) {
                        return element.y;
                    }
                }
            }
            var typicalHeight = this.$typicalHeight;
            var startPos = this.$paddingTop;
            var gap = this.$gap;
            var elementSizeTable = this.elementSizeTable;
            for (var i = 0; i < index; i++) {
                var h = elementSizeTable[i];
                if (isNaN(h)) {
                    h = typicalHeight;
                }
                startPos += h + gap;
            }
            return startPos;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VerticalLayout.prototype.getElementSize = function (index) {
            if (this.$useVirtualLayout) {
                var size = this.elementSizeTable[index];
                if (isNaN(size)) {
                    size = this.$typicalHeight;
                }
                return size;
            }
            if (this.$target) {
                return this.$target.getElementAt(index).height;
            }
            return 0;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VerticalLayout.prototype.getElementTotalSize = function () {
            var typicalHeight = this.$typicalHeight;
            var gap = this.$gap;
            var totalSize = 0;
            var length = this.$target.numElements;
            var elementSizeTable = this.elementSizeTable;
            for (var i = 0; i < length; i++) {
                var h = elementSizeTable[i];
                if (isNaN(h)) {
                    h = typicalHeight;
                }
                totalSize += h + gap;
            }
            totalSize -= gap;
            return totalSize;
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VerticalLayout.prototype.elementAdded = function (index) {
            if (!this.$useVirtualLayout)
                return;
            _super.prototype.elementAdded.call(this, index);
            this.elementSizeTable.splice(index, 0, this.$typicalHeight);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        VerticalLayout.prototype.getIndexInView = function () {
            var target = this.$target;
            if (!target || target.numElements == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }
            var values = target.$UIComponent;
            if (values[10 /* width */] == 0 || values[11 /* height */] == 0) {
                this.startIndex = this.endIndex = -1;
                return false;
            }
            var numElements = target.numElements;
            var contentHeight = this.getStartPosition(numElements - 1) +
                this.elementSizeTable[numElements - 1] + this.$paddingBottom;
            var minVisibleY = target.scrollV;
            if (minVisibleY > contentHeight - this.$paddingBottom) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            var maxVisibleY = target.scrollV + values[11 /* height */];
            if (maxVisibleY < this.$paddingTop) {
                this.startIndex = -1;
                this.endIndex = -1;
                return false;
            }
            var oldStartIndex = this.startIndex;
            var oldEndIndex = this.endIndex;
            this.startIndex = this.findIndexAt(minVisibleY, 0, numElements - 1);
            if (this.startIndex == -1)
                this.startIndex = 0;
            this.endIndex = this.findIndexAt(maxVisibleY, 0, numElements - 1);
            if (this.endIndex == -1)
                this.endIndex = numElements - 1;
            return oldStartIndex != this.startIndex || oldEndIndex != this.endIndex;
        };
        return VerticalLayout;
    }(eui.LinearLayoutBase));
    eui.VerticalLayout = VerticalLayout;
    __reflect(VerticalLayout.prototype, "eui.VerticalLayout");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The HScrollBar (horizontal scrollbar) control lets you control
     * the portion of data that is displayed when there is too much data
     * to fit horizontally in a display area.
     *
     * <p>Although you can use the HScrollBar control as a stand-alone control,
     * you usually combine it as part of another group of components to
     * provide scrolling functionality.</p>
     *
     * @includeExample  extension/eui/components/HScrollBarExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * HScrollBar（水平 ScrollBar）控件可以在因数据太多而不能在显示区域中以水平方向完全显示时控制显示的数据部分。
     * <p>虽然 HScrollBar 控件可以单独使用，但通常将它与其他组件一起使用来提供滚动功能。</p>
     *
     * @includeExample  extension/eui/components/HScrollBarExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var HScrollBar = (function (_super) {
        __extends(HScrollBar, _super);
        function HScrollBar() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HScrollBar.prototype.updateDisplayList = function (unscaledWidth, unscaledHeight) {
            _super.prototype.updateDisplayList.call(this, unscaledWidth, unscaledHeight);
            var thumb = this.thumb;
            var viewport = this.$viewport;
            if (!thumb || !viewport) {
                return;
            }
            var bounds = egret.$TempRectangle;
            thumb.getPreferredBounds(bounds);
            var thumbWidth = bounds.width;
            var thumbY = bounds.y;
            var hsp = viewport.scrollH;
            var contentWidth = viewport.contentWidth;
            var width = viewport.width;
            if (hsp <= 0) {
                var scaleWidth = thumbWidth * (1 - (-hsp) / (width * 0.5));
                scaleWidth = Math.max(5, Math.round(scaleWidth));
                thumb.setLayoutBoundsSize(scaleWidth, NaN);
                thumb.setLayoutBoundsPosition(0, thumbY);
            }
            else if (hsp >= contentWidth - width) {
                var scaleWidth = thumbWidth * (1 - (hsp - contentWidth + width) / (width * 0.5));
                scaleWidth = Math.max(5, Math.round(scaleWidth));
                thumb.setLayoutBoundsSize(scaleWidth, NaN);
                thumb.setLayoutBoundsPosition(unscaledWidth - scaleWidth, thumbY);
            }
            else {
                var thumbX = (unscaledWidth - thumbWidth) * hsp / (contentWidth - width);
                thumb.setLayoutBoundsSize(NaN, NaN);
                thumb.setLayoutBoundsPosition(thumbX, thumbY);
            }
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        HScrollBar.prototype.onPropertyChanged = function (event) {
            switch (event.property) {
                case "scrollH":
                case "contentWidth":
                    this.invalidateDisplayList();
                    break;
            }
        };
        return HScrollBar;
    }(eui.ScrollBarBase));
    eui.HScrollBar = HScrollBar;
    __reflect(HScrollBar.prototype, "eui.HScrollBar");
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The operation of adding a state to view.
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 视图添加状态显示元素操作
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var AddItems = (function () {
        /**
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个AddItems实例
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function AddItems(target, propertyName, position, relativeTo) {
            this.target = target;
            this.propertyName = propertyName;
            this.position = position;
            this.relativeTo = relativeTo;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        AddItems.prototype.apply = function (host, parent) {
            var index;
            var relative = host[this.relativeTo];
            var target = host[this.target];
            var container = this.propertyName ? host[this.propertyName] : parent;
            if (!target || !container)
                return;
            switch (this.position) {
                case 0 /* FIRST */:
                    index = 0;
                    break;
                case 1 /* LAST */:
                    index = -1;
                    break;
                case 2 /* BEFORE */:
                    index = container.getChildIndex(relative);
                    break;
                case 3 /* AFTER */:
                    index = container.getChildIndex(relative) + 1;
                    break;
            }
            if (index == -1) {
                index = container.numChildren;
            }
            if (egret.is(container, "eui.Component")) {
                container.$Component[8 /* skin */].$elementsContent.push(target);
            }
            container.addChildAt(target, index);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        AddItems.prototype.remove = function (host, parent) {
            var container = this.propertyName ? host[this.propertyName] : parent;
            var target = host[this.target];
            if (!target || !container)
                return;
            if (target.$parent === container) {
                container.removeChild(target);
            }
            if (egret.is(container, "eui.Component")) {
                var arr = container.$Component[8 /* skin */].$elementsContent;
                var idx = arr.indexOf(target);
                if (idx > -1) {
                    arr.splice(idx, 1);
                }
            }
        };
        return AddItems;
    }());
    eui.AddItems = AddItems;
    __reflect(AddItems.prototype, "eui.AddItems", ["eui.IOverride"]);
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The SetProperty class specifies a property value that is in effect only
     * during the parent view state.
     * You use this class in the <code>overrides</code> property of the State class.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * SetProperty 类指定只在父视图状态期间有效的属性值。可以在 State 类的 overrides 属性中使用该类。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var SetProperty = (function () {
        /**
         * Constructor.
         *
         * @param target The object whose property is being set.
         * By default, EUI uses the immediate parent of the State object.
         * @param name The property to set.
         * @param value The value of the property in the view state.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个SetProperty实例。
         *
         * @param target 要设置其属性的对象。默认情况下，EUI 使用 State 对象的直接父级。
         * @param name 要设置的属性。
         * @param value 视图状态中的属性值。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function SetProperty(target, name, value) {
            this.target = target;
            this.name = name;
            this.value = value;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        SetProperty.prototype.apply = function (host, parent) {
            var obj = this.target ? host[this.target] : host;
            if (!obj)
                return;
            this.oldValue = obj[this.name];
            this.setPropertyValue(obj, this.name, this.value, this.oldValue);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        SetProperty.prototype.remove = function (host, parent) {
            var obj = this.target ? host[this.target] : host;
            if (!obj)
                return;
            this.setPropertyValue(obj, this.name, this.oldValue, this.oldValue);
            this.oldValue = null;
        };
        /**
         * @private
         * 设置属性值
         */
        SetProperty.prototype.setPropertyValue = function (obj, name, value, valueForType) {
            if (value === undefined || value === null)
                obj[name] = value;
            else if (typeof (valueForType) == "number")
                obj[name] = +value;
            else if (typeof (valueForType) == "boolean")
                obj[name] = this.toBoolean(value);
            else
                obj[name] = value;
        };
        /**
         * @private
         * 转成Boolean值
         */
        SetProperty.prototype.toBoolean = function (value) {
            if (typeof (value) == "string")
                return value.toLowerCase() == "true";
            return value != false;
        };
        return SetProperty;
    }());
    eui.SetProperty = SetProperty;
    __reflect(SetProperty.prototype, "eui.SetProperty", ["eui.IOverride"]);
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    /**
     * The SetProperty class specifies a property value that is in effect only
     * during the parent view state.
     * You use this class in the <code>overrides</code> property of the State class.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language en_US
     */
    /**
     * SetProperty 类指定只在父视图状态期间有效的属性值。可以在 State 类的 overrides 属性中使用该类。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @language zh_CN
     */
    var SetStateProperty = (function () {
        /**
         * Constructor.
         *
         * @param target The object whose property is being set.
         * By default, EUI uses the immediate parent of the State object.
         * @param name The property to set.
         * @param value The value of the property in the view state.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个SetProperty实例。
         *
         * @param target 要设置其属性的对象。默认情况下，EUI 使用 State 对象的直接父级。
         * @param name 要设置的属性。
         * @param value 视图状态中的属性值。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         * @language zh_CN
         */
        function SetStateProperty(host, templates, chainIndex, target, prop) {
            this.host = host;
            this.templates = templates;
            this.chainIndex = chainIndex;
            this.target = target;
            this.prop = prop;
        }
        /**
         * @inheritDoc
         *
         * @version Egret 3.0
         * @version eui 1.0
         * @platform Web,Native
         */
        SetStateProperty.prototype.apply = function (host, parent) {
            if (!this.target) {
                return;
            }
            var nextOldValue = this.target[this.prop];
            if (this.oldValue) {
                this.setPropertyValue(this.target, this.prop, this.oldValue, this.oldValue);
            }
            if (nextOldValue) {
                this.oldValue = nextOldValue;
            }
            eui.Binding.$bindProperties(this.host, this.templates.concat(), this.chainIndex.concat(), this.target, this.prop);
        };
        /**
         * @inheritDoc
         *
         * @version Egret 3.0
         * @version eui 1.0
         * @platform Web,Native
         */
        SetStateProperty.prototype.remove = function (host, parent) {
            if (!this.target) {
                return;
            }
            var oldValue = this.oldValue;
            if (this.target[this.prop]) {
                this.oldValue = this.target[this.prop];
            }
            if (oldValue) {
                this.setPropertyValue(this.target, this.prop, oldValue, oldValue);
            }
        };
        /**
         * @private
         * 设置属性值
         */
        SetStateProperty.prototype.setPropertyValue = function (obj, name, value, valueForType) {
            if (value === undefined || value === null)
                obj[name] = value;
            else if (typeof (valueForType) == "number")
                obj[name] = +value;
            else if (typeof (valueForType) == "boolean")
                obj[name] = this.toBoolean(value);
            else
                obj[name] = value;
        };
        /**
         * @private
         * 转成Boolean值
         */
        SetStateProperty.prototype.toBoolean = function (value) {
            if (typeof (value) == "string")
                return value.toLowerCase() == "true";
            return value != false;
        };
        return SetStateProperty;
    }());
    eui.SetStateProperty = SetStateProperty;
    __reflect(SetStateProperty.prototype, "eui.SetStateProperty", ["eui.IOverride"]);
})(eui || (eui = {}));
//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
var eui;
(function (eui) {
    var sys;
    (function (sys) {
        var SOLUTION_TOLERANCE = 0.1;
        var MIN_MAX_TOLERANCE = 0.1;
        /**
         * @private
         */
        var MatrixUtil = (function () {
            function MatrixUtil() {
            }
            /**
             * @private
             */
            MatrixUtil.fitBounds = function (width, height, matrix, explicitWidth, explicitHeight, preferredWidth, preferredHeight, minWidth, minHeight, maxWidth, maxHeight) {
                if (isNaN(width) && isNaN(height))
                    return egret.Point.create(preferredWidth, preferredHeight);
                var newMinWidth = (minWidth < MIN_MAX_TOLERANCE) ? 0 : minWidth - MIN_MAX_TOLERANCE;
                var newMinHeight = (minHeight < MIN_MAX_TOLERANCE) ? 0 : minHeight - MIN_MAX_TOLERANCE;
                var newMaxWidth = maxWidth + MIN_MAX_TOLERANCE;
                var newMaxHeight = maxHeight + MIN_MAX_TOLERANCE;
                var actualSize;
                if (!isNaN(width) && !isNaN(height)) {
                    actualSize = calcUBoundsToFitTBounds(width, height, matrix, newMinWidth, newMinHeight, newMaxWidth, newMaxHeight);
                    if (!actualSize) {
                        var actualSize1 = void 0;
                        actualSize1 = fitTBoundsWidth(width, matrix, explicitWidth, explicitHeight, preferredWidth, preferredHeight, newMinWidth, newMinHeight, newMaxWidth, newMaxHeight);
                        if (actualSize1) {
                            var fitHeight = transformSize(actualSize1.x, actualSize1.y, matrix).height;
                            if (fitHeight - SOLUTION_TOLERANCE > height) {
                                egret.Point.release(actualSize1);
                                actualSize1 = null;
                            }
                        }
                        var actualSize2 = void 0;
                        actualSize2 = fitTBoundsHeight(height, matrix, explicitWidth, explicitHeight, preferredWidth, preferredHeight, newMinWidth, newMinHeight, newMaxWidth, newMaxHeight);
                        if (actualSize2) {
                            var fitWidth = transformSize(actualSize2.x, actualSize2.y, matrix).width;
                            if (fitWidth - SOLUTION_TOLERANCE > width) {
                                egret.Point.release(actualSize2);
                                actualSize2 = null;
                            }
                        }
                        if (actualSize1 && actualSize2) {
                            actualSize = ((actualSize1.x * actualSize1.y) > (actualSize2.x * actualSize2.y)) ? actualSize1 : actualSize2;
                        }
                        else if (actualSize1) {
                            actualSize = actualSize1;
                        }
                        else {
                            actualSize = actualSize2;
                        }
                        egret.Point.release(actualSize1);
                        egret.Point.release(actualSize2);
                    }
                    return actualSize;
                }
                else if (!isNaN(width)) {
                    return fitTBoundsWidth(width, matrix, explicitWidth, explicitHeight, preferredWidth, preferredHeight, newMinWidth, newMinHeight, newMaxWidth, newMaxHeight);
                }
                else {
                    return fitTBoundsHeight(height, matrix, explicitWidth, explicitHeight, preferredWidth, preferredHeight, newMinWidth, newMinHeight, newMaxWidth, newMaxHeight);
                }
            };
            return MatrixUtil;
        }());
        sys.MatrixUtil = MatrixUtil;
        __reflect(MatrixUtil.prototype, "eui.sys.MatrixUtil");
        /**
         * @private
         */
        function fitTBoundsWidth(width, matrix, explicitWidth, explicitHeight, preferredWidth, preferredHeight, minWidth, minHeight, maxWidth, maxHeight) {
            var actualSize;
            if (!isNaN(explicitWidth) && isNaN(explicitHeight)) {
                actualSize = calcUBoundsToFitTBoundsWidth(width, matrix, explicitWidth, preferredHeight, explicitWidth, minHeight, explicitWidth, maxHeight);
                if (actualSize)
                    return actualSize;
            }
            else if (isNaN(explicitWidth) && !isNaN(explicitHeight)) {
                actualSize = calcUBoundsToFitTBoundsWidth(width, matrix, preferredWidth, explicitHeight, minWidth, explicitHeight, maxWidth, explicitHeight);
                if (actualSize)
                    return actualSize;
            }
            actualSize = calcUBoundsToFitTBoundsWidth(width, matrix, preferredWidth, preferredHeight, minWidth, minHeight, maxWidth, maxHeight);
            return actualSize;
        }
        /**
         * @private
         */
        function fitTBoundsHeight(height, matrix, explicitWidth, explicitHeight, preferredWidth, preferredHeight, minWidth, minHeight, maxWidth, maxHeight) {
            var actualSize;
            if (!isNaN(explicitWidth) && isNaN(explicitHeight)) {
                actualSize = calcUBoundsToFitTBoundsHeight(height, matrix, explicitWidth, preferredHeight, explicitWidth, minHeight, explicitWidth, maxHeight);
                if (actualSize)
                    return actualSize;
            }
            else if (isNaN(explicitWidth) && !isNaN(explicitHeight)) {
                actualSize = calcUBoundsToFitTBoundsHeight(height, matrix, preferredWidth, explicitHeight, minWidth, explicitHeight, maxWidth, explicitHeight);
                if (actualSize)
                    return actualSize;
            }
            actualSize = calcUBoundsToFitTBoundsHeight(height, matrix, preferredWidth, preferredHeight, minWidth, minHeight, maxWidth, maxHeight);
            return actualSize;
        }
        /**
         * @private
         */
        function calcUBoundsToFitTBoundsHeight(h, matrix, preferredX, preferredY, minX, minY, maxX, maxY) {
            var b = matrix.b;
            var d = matrix.d;
            if (-1.0e-9 < b && b < +1.0e-9)
                b = 0;
            if (-1.0e-9 < d && d < +1.0e-9)
                d = 0;
            if (b == 0 && d == 0)
                return null;
            if (b == 0 && d == 0)
                return null;
            if (b == 0)
                return egret.Point.create(preferredX, h / Math.abs(d));
            else if (d == 0)
                return egret.Point.create(h / Math.abs(b), preferredY);
            var d1 = (b * d >= 0) ? d : -d;
            var s;
            var x;
            var y;
            if (d1 != 0 && preferredX > 0) {
                var invD1 = 1 / d1;
                preferredX = Math.max(minX, Math.min(maxX, preferredX));
                x = preferredX;
                y = (h - b * x) * invD1;
                if (minY <= y && y <= maxY &&
                    b * x + d1 * y >= 0) {
                    s = egret.Point.create(x, y);
                }
                y = (-h - b * x) * invD1;
                if (minY <= y && y <= maxY &&
                    b * x + d1 * y < 0) {
                    if (!s || transformSize(s.x, s.y, matrix).width > transformSize(x, y, matrix).width) {
                        egret.Point.release(s);
                        s = egret.Point.create(x, y);
                    }
                }
            }
            if (b != 0 && preferredY > 0) {
                var invB = 1 / b;
                preferredY = Math.max(minY, Math.min(maxY, preferredY));
                y = preferredY;
                x = (h - d1 * y) * invB;
                if (minX <= x && x <= maxX &&
                    b * x + d1 * y >= 0) {
                    if (!s || transformSize(s.x, s.y, matrix).width > transformSize(x, y, matrix).width)
                        s = egret.Point.create(x, y);
                }
                x = (-h - d1 * y) * invB;
                if (minX <= x && x <= maxX &&
                    b * x + d1 * y < 0) {
                    if (!s || transformSize(s.x, s.y, matrix).width > transformSize(x, y, matrix).width) {
                        egret.Point.release(s);
                        s = egret.Point.create(x, y);
                    }
                }
            }
            if (s)
                return s;
            var a = matrix.a;
            var c = matrix.c;
            var c1 = (a * c >= 0) ? c : -c;
            return solveEquation(b, d1, h, minX, minY, maxX, maxY, a, c1);
        }
        /**
         * @private
         */
        function calcUBoundsToFitTBoundsWidth(w, matrix, preferredX, preferredY, minX, minY, maxX, maxY) {
            var a = matrix.a;
            var c = matrix.c;
            if (-1.0e-9 < a && a < +1.0e-9)
                a = 0;
            if (-1.0e-9 < c && c < +1.0e-9)
                c = 0;
            if (a == 0 && c == 0)
                return null;
            if (a == 0)
                return egret.Point.create(preferredX, w / Math.abs(c));
            else if (c == 0)
                return egret.Point.create(w / Math.abs(a), preferredY);
            var c1 = (a * c >= 0) ? c : -c;
            var s;
            var x;
            var y;
            if (c1 != 0 && preferredX > 0) {
                var invC1 = 1 / c1;
                preferredX = Math.max(minX, Math.min(maxX, preferredX));
                x = preferredX;
                y = (w - a * x) * invC1;
                if (minY <= y && y <= maxY &&
                    a * x + c1 * y >= 0) {
                    s = egret.Point.create(x, y);
                }
                y = (-w - a * x) * invC1;
                if (minY <= y && y <= maxY &&
                    a * x + c1 * y < 0) {
                    if (!s || transformSize(s.x, s.y, matrix).height > transformSize(x, y, matrix).height) {
                        egret.Point.release(s);
                        s = egret.Point.create(x, y);
                    }
                }
            }
            if (a != 0 && preferredY > 0) {
                var invA = 1 / a;
                preferredY = Math.max(minY, Math.min(maxY, preferredY));
                y = preferredY;
                x = (w - c1 * y) * invA;
                if (minX <= x && x <= maxX &&
                    a * x + c1 * y >= 0) {
                    if (!s || transformSize(s.x, s.y, matrix).height > transformSize(x, y, matrix).height) {
                        egret.Point.release(s);
                        s = egret.Point.create(x, y);
                    }
                }
                x = (-w - c1 * y) * invA;
                if (minX <= x && x <= maxX &&
                    a * x + c1 * y < 0) {
                    if (!s || transformSize(s.x, s.y, matrix).height > transformSize(x, y, matrix).height) {
                        egret.Point.release(s);
                        s = egret.Point.create(x, y);
                    }
                }
            }
            if (s)
                return s;
            var b = matrix.b;
            var d = matrix.d;
            var d1 = (b * d >= 0) ? d : -d;
            return solveEquation(a, c1, w, minX, minY, maxX, maxY, b, d1);
        }
        /**
         * @private
         */
        function solveEquation(a, c, w, minX, minY, maxX, maxY, b, d) {
            if (a == 0 || c == 0)
                return null;
            var x;
            var y;
            var A = (w - minX * a) / c;
            var B = (w - maxX * a) / c;
            var rangeMinY = Math.max(minY, Math.min(A, B));
            var rangeMaxY = Math.min(maxY, Math.max(A, B));
            var det = (b * c - a * d);
            if (rangeMinY <= rangeMaxY) {
                if (Math.abs(det) < 1.0e-9) {
                    y = w / (a + c);
                }
                else {
                    y = b * w / det;
                }
                y = Math.max(rangeMinY, Math.min(y, rangeMaxY));
                x = (w - c * y) / a;
                return egret.Point.create(x, y);
            }
            A = -(minX * a + w) / c;
            B = -(maxX * a + w) / c;
            rangeMinY = Math.max(minY, Math.min(A, B));
            rangeMaxY = Math.min(maxY, Math.max(A, B));
            if (rangeMinY <= rangeMaxY) {
                if (Math.abs(det) < 1.0e-9) {
                    y = -w / (a + c);
                }
                else {
                    y = -b * w / det;
                }
                y = Math.max(rangeMinY, Math.min(y, rangeMaxY));
                x = (-w - c * y) / a;
                return egret.Point.create(x, y);
            }
            return null;
        }
        /**
         * @private
         */
        function calcUBoundsToFitTBounds(w, h, matrix, minX, minY, maxX, maxY) {
            var a = matrix.a;
            var b = matrix.b;
            var c = matrix.c;
            var d = matrix.d;
            if (-1.0e-9 < a && a < +1.0e-9)
                a = 0;
            if (-1.0e-9 < b && b < +1.0e-9)
                b = 0;
            if (-1.0e-9 < c && c < +1.0e-9)
                c = 0;
            if (-1.0e-9 < d && d < +1.0e-9)
                d = 0;
            if (b == 0 && c == 0) {
                if (a == 0 || d == 0)
                    return null;
                return egret.Point.create(w / Math.abs(a), h / Math.abs(d));
            }
            if (a == 0 && d == 0) {
                if (b == 0 || c == 0)
                    return null;
                return egret.Point.create(h / Math.abs(b), w / Math.abs(c));
            }
            var c1 = (a * c >= 0) ? c : -c;
            var d1 = (b * d >= 0) ? d : -d;
            var det = a * d1 - b * c1;
            if (Math.abs(det) < 1.0e-9) {
                if (c1 == 0 || a == 0 || a == -c1)
                    return null;
                if (Math.abs(a * h - b * w) > 1.0e-9)
                    return null;
                return solveEquation(a, c1, w, minX, minX, maxX, maxY, b, d1);
            }
            var invDet = 1 / det;
            w *= invDet;
            h *= invDet;
            var s;
            s = solveSystem(a, c1, b, d1, w, h);
            if (s &&
                minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
                a * s.x + c1 * s.x >= 0 &&
                b * s.x + d1 * s.y >= 0)
                return s;
            s = solveSystem(a, c1, b, d1, w, -h);
            if (s &&
                minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
                a * s.x + c1 * s.x >= 0 &&
                b * s.x + d1 * s.y < 0)
                return s;
            s = solveSystem(a, c1, b, d1, -w, h);
            if (s &&
                minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
                a * s.x + c1 * s.x < 0 &&
                b * s.x + d1 * s.y >= 0)
                return s;
            s = solveSystem(a, c1, b, d1, -w, -h);
            if (s &&
                minX <= s.x && s.x <= maxX && minY <= s.y && s.y <= maxY &&
                a * s.x + c1 * s.x < 0 &&
                b * s.x + d1 * s.y < 0)
                return s;
            egret.Point.release(s);
            return null;
        }
        /**
         * @private
         */
        function transformSize(width, height, matrix) {
            var bounds = egret.$TempRectangle.setTo(0, 0, width, height);
            matrix.$transformBounds(bounds);
            return bounds;
        }
        /**
         * @private
         */
        function solveSystem(a, c, b, d, mOverDet, nOverDet) {
            return egret.Point.create(d * mOverDet - c * nOverDet, a * nOverDet - b * mOverDet);
        }
    })(sys = eui.sys || (eui.sys = {}));
})(eui || (eui = {}));
