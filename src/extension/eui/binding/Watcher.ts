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

module eui {

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
    function getPropertyDescriptor(host:any, property:string):any {
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

    function notifyListener(host:any, property:string):void {
        var list:any[] = host[listeners];
        var length = list.length;
        for (var i = 0; i < length; i+=2) {
            var listener:Function = list[i];
            var target:any = list[i+1];
            listener.call(target,property);
        }
    }

    /**
     * @language en_US
     * The Watcher class defines utility method that you can use with bindable properties.
     * These methods let you define an event handler that is executed whenever a bindable property is updated.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     */
    /**
     * @language zh_CN
     * Watcher 类能够监视可绑定属性的改变，您可以定义一个事件处理函数作为 Watcher 的回调方法，在每次可绑定属性的值改变时都执行此函数。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/binding/WatcherExample.ts
     */
    export class Watcher {

        /**
         * @language en_US
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
         */
        /**
         * @language zh_CN
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
         */
        public static watch(host:any, chain:string[], handler:(value:any)=>void, thisObject:any):Watcher {
            if (DEBUG) {
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
        }

        /**
         * @private
         * 检查属性是否可以绑定。若还未绑定，尝试添加绑定事件。若是只读或只写属性，返回false。
         */
        private static checkBindable(host:any, property:string):boolean {
            var list:string[] = host[bindables];
            if (list && list.indexOf(property) != -1) {
                return true;
            }
            var isEventDispatcher = egret.is(host, "egret.IEventDispatcher");
            if(!isEventDispatcher){
                host[listeners] = [];
            }
            var data:PropertyDescriptor = getPropertyDescriptor(host, property);
            if (data && data.set && data.get) {
                var orgSet = data.set;
                data.set = function (value:any) {
                    if (this[property] != value) {
                        orgSet.call(this, value);
                        if(isEventDispatcher){
                            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, property);
                        }
                        else{
                            notifyListener(this,property);
                        }
                    }
                };
            }
            else if (!data || (!data.get && !data.set)) {
                bindableCount++;
                var newProp = "_" + bindableCount + property;
                host[newProp] = data ? data.value : null;
                data = <any>{enumerable: true, configurable: true};
                data.get = function ():any {
                    return this[newProp];
                };
                data.set = function (value:any) {
                    if (this[newProp] != value) {
                        this[newProp] = value;
                        if(isEventDispatcher){
                            PropertyEvent.dispatchPropertyEvent(this, PropertyEvent.PROPERTY_CHANGE, property);
                        }
                        else{
                            notifyListener(this,property);
                        }
                    }
                };
            }
            else {
                return false;
            }
            Object.defineProperty(host, property, data);
            registerBindable(host, property);
        }

        /**
         * @language en_US
         * Constructor.
         * Not for public use. This method is called only from the <code>watch()</code> method.
         * See the <code>watch()</code> method for parameter usage.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数，非公开。只能从 watch() 方法中调用此方法。有关参数用法，请参阅 watch() 方法。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(property:string, handler:(value:any)=>void, thisObject:any, next?:Watcher) {
            this.property = property;
            this.handler = handler;
            this.next = next;
            this.thisObject = thisObject;
        }

        /**
         * @private
         */
        private host:any;

        /**
         * @private
         */
        private property:string;

        /**
         * @private
         */
        private handler:(value:any)=>void;

        /**
         * @private
         */
        private thisObject:any;

        /**
         * @private
         */
        private next:Watcher;

        /**
         * @private
         */
        private isExecuting:boolean = false;

        /**
         * @language en_US
         * Detaches this Watcher instance, and its handler function, from the current host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从当前宿主中断开此 Watcher 实例及其处理函数。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public unwatch():void {
            this.reset(null);
            this.handler = null;
            if (this.next) {
                this.next.handler = null;
            }
        }

        /**
         * @language en_US
         * Retrieves the current value of the watched property or property chain, or null if the host object is null.
         * @example
         * <pre>
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * </pre>
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 检索观察的属性或属性链的当前值，当宿主对象为空时此值为空。
         * @example
         * <pre>
         * watch(obj, ["a","b","c"], ...).getValue() === obj.a.b.c
         * </pre>
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getValue():any {
            if (this.next) {
                return this.next.getValue();
            }
            return this.getHostPropertyValue();
        }

        /**
         * @language en_US
         * Sets the handler function.s
         * @param handler The handler function. This argument must not be null.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置处理函数。
         * @param handler 处理函数，此参数必须为非空。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setHandler(handler:(value:any)=>void, thisObject:any):void {
            this.handler = handler;
            this.thisObject = thisObject;
            if (this.next) {
                this.next.setHandler(handler, thisObject);
            }

        }

        /**
         * @language en_US
         * Resets this ChangeWatcher instance to use a new host object.
         * You can call this method to reuse a watcher instance on a different host.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 重置此 Watcher 实例使用新的宿主对象。
         * 您可以通过该方法实现一个Watcher实例用于不同的宿主。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public reset(newHost:egret.IEventDispatcher):void {
            var oldHost = this.host;
            if(oldHost){
                if (egret.is(oldHost, "egret.IEventDispatcher")) {
                    oldHost.removeEventListener(PropertyEvent.PROPERTY_CHANGE, this.wrapHandler, this);
                }
                else {
                    var list:any[] = oldHost[listeners];
                    var index = list.indexOf(this);
                    list.splice(index-1,2);
                }
            }

            this.host = newHost;

            if(newHost){
                Watcher.checkBindable(newHost, this.property);
                if (egret.is(newHost, "egret.IEventDispatcher")) {
                    newHost.addEventListener(PropertyEvent.PROPERTY_CHANGE, this.wrapHandler, this, false, 100);
                }
                else{
                    var list:any[] = newHost[listeners];
                    list.push(this.onPropertyChange);
                    list.push(this);
                }
            }


            if (this.next)
                this.next.reset(this.getHostPropertyValue());
        }


        /**
         * @private
         *
         * @returns
         */
        private getHostPropertyValue():any {
            return this.host ? this.host[this.property] : null;
        }

        /**
         * @private
         */
        private wrapHandler(event:PropertyEvent):void {
            this.onPropertyChange(event.property);
        }

        /**
         * @private
         */
        private onPropertyChange(property:string):void{
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
        }
    }

}