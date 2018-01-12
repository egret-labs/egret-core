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

module RES {


    export type GetResAsyncCallback = (value?: any, key?: string) => any;



    /**
     * Conduct mapping injection with class definition as the value.
     * @param type Injection type.
     * @param analyzerClass Injection type classes need to be resolved.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/Resource.ts
     * @language en_US
     */
    /**
     * 以类定义为值进行映射注入。
     * @param type 注入的类型。
     * @param analyzerClass 注入类型需要解析的类。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/Resource.ts
     * @language zh_CN
     */
    export function registerAnalyzer(type: string, analyzerClass: any) {
        throw new ResourceManagerError(2002);
    }


    /**
     * Load configuration file and parse.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 加载配置文件并解析。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function loadConfig(url: string, resourceRoot: string) {
        if (url) {
            setConfigURL(url);
        }
        if (!instance) instance = new Resource();
        config.resourceRoot = resourceRoot;
        return instance.loadConfig();
    }
    /**
     * Load a set of resources according to the group name.
     * @param name Group name to load the resource group.
     * @param priority Load priority can be negative, the default value is 0.
     * <br>A low priority group must wait for the high priority group to complete the end of the load to start, and the same priority group will be loaded at the same time.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 根据组名加载一组资源。
     * @param name 要加载资源组的组名。
     * @param priority 加载优先级,可以为负数,默认值为 0。
     * <br>低优先级的组必须等待高优先级组完全加载结束才能开始，同一优先级的组会同时加载。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): Promise<void> {
        return instance.loadGroup(name, priority, reporter);
    }
    /**
     * Check whether a resource group has been loaded.
     * @param name Group name。
     * @returns Is loading or not.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 检查某个资源组是否已经加载完成。
     * @param name 组名。
     * @returns 是否正在加载。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function isGroupLoaded(name: string): boolean {
        return instance.isGroupLoaded(name);
    }
    /**
     * A list of groups of loading is obtained according to the group name.
     * @param name Group name.
     * @returns The resource item array of group.
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 根据组名获取组加载项列表。
     * @param name 组名。
     * @returns 加载项列表。
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function getGroupByName(name: string): Array<ResourceItem> {
        return instance.getGroupByName(name).map(r => ResourceItem.convertToResItem(r));
    }
    /**
     * Create a custom load resource group, note that this method is valid only after the resource configuration file is loaded.
     * <br>You can monitor the ResourceEvent.CONFIG_COMPLETE event to verify that the configuration is complete.
     * @param name Group name to create the load resource group.
     * @param keys To be included in the list of key keys, the corresponding configuration file in the name or sbuKeys property one or a resource group name.
     * @param override Is the default false for the same name resource group already exists.
     * @returns Create success or fail.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
     * <br>可以监听 ResourceEvent.CONFIG_COMPLETE 事件来确认配置加载完成。
     * @param name 要创建的加载资源组的组名。
     * @param keys 要包含的键名列表，key 对应配置文件里的 name 属性或 sbuKeys 属性的一项或一个资源组名。
     * @param override 是否覆盖已经存在的同名资源组,默认 false。
     * @returns 是否创建成功。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function createGroup(name: string, keys: Array<string>, override: boolean = false): boolean {
        return instance.createGroup(name, keys, override);
    }
    /**
     * Check whether the configuration file contains the specified resources.
     * @param key A sbuKeys attribute or name property in a configuration file.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 检查配置文件里是否含有指定的资源。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function hasRes(key: string): boolean {
        return instance.hasRes(key);
    }

    /**
     * The synchronization method for obtaining the cache has been loaded with the success of the resource.
     * <br>The type of resource and the corresponding return value types are as follows:
     * <br>RES.ResourceItem.TYPE_BIN : ArrayBuffer JavaScript primary object
     * <br>RES.ResourceItem.TYPE_IMAGE : img Html Object，or egret.BitmapData interface。
     * <br>RES.ResourceItem.TYPE_JSON : Object
     * <br>RES.ResourceItem.TYPE_SHEET : Object
     * <br>  1. If the incoming parameter is the name of the entire SpriteSheet is returned is {image1: Texture, "image2": Texture}.
     * <br>  2. If the incoming is "sheet.image1", the return is a single resource.
     * <br>  3. If the incoming is the name of the "image1" single resource, the return is a single resource.
     * But if there are two SpriteSheet in a single picture of the same name, the return of the image after the load.
     * <br>RES.ResourceItem.TYPE_SOUND : HtmlSound Html Object
     * <br>RES.ResourceItem.TYPE_TEXT : string
     * @param key A subKeys attribute or name property in a configuration file.
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 同步方式获取缓存的已经加载成功的资源。
     * <br>资源类型和对应的返回值类型关系如下：
     * <br>RES.ResourceItem.TYPE_BIN : ArrayBuffer JavaScript 原生对象
     * <br>RES.ResourceItem.TYPE_IMAGE : img Html 对象，或者 egret.BitmapData 接口。
     * <br>RES.ResourceItem.TYPE_JSON : Object
     * <br>RES.ResourceItem.TYPE_SHEET : Object
     * <br>  1. 如果传入的参数是整个 SpriteSheet 的名称返回的是 {"image1":Texture,"image2":Texture} 这样的格式。
     * <br>  2. 如果传入的是 "sheet.image1"，返回的是单个资源。
     * <br>  3. 如果传入的是 "image1" 单个资源的名称，返回的是单个资源。但是如果有两张 SpriteSheet 中有单个图片资源名称相同，返回的是后加载的那个图片资源。
     * <br>RES.ResourceItem.TYPE_SOUND : HtmlSound Html 对象
     * <br>RES.ResourceItem.TYPE_TEXT : string
     * @param key 对应配置文件里的 name 属性或 subKeys 属性的一项。
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function getRes(key: string): any {
        return instance.getRes(key);
    }
    /**
     * Asynchronous mode to get the resources in the configuration. As long as the resources exist in the configuration file, you can get it in an asynchronous way.
     * @param key A sbuKeys attribute or name property in a configuration file.
     * @param compFunc Call back function. Example：compFunc(data,key):void.
     * @param thisObject This pointer of call back function.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 异步方式获取配置里的资源。只要是配置文件里存在的资源，都可以通过异步方式获取。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @param compFunc 回调函数。示例：compFunc(data,key):void。
     * @param thisObject 回调函数的 this 引用。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function getResAsync(key: string): Promise<any>
    export function getResAsync(key: string, compFunc: GetResAsyncCallback, thisObject: any): void
    export function getResAsync(key: string, compFunc?: GetResAsyncCallback, thisObject?: any): Promise<any> | void {
        return instance.getResAsync.apply(instance, arguments);
    }
    /**
     * Access to external resources through the full URL.
     * @param url The external path to load the file.
     * @param compFunc Call back function. Example：compFunc(data,url):void。
     * @param thisObject This pointer of call back function.
     * @param type File type (optional). Use the static constants defined in the ResourceItem class. If you do not set the file name extension.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/GetResByUrl.ts
     * @language en_US
     */
    /**
     * 通过完整URL方式获取外部资源。
     * @param url 要加载文件的外部路径。
     * @param compFunc 回调函数。示例：compFunc(data,url):void。
     * @param thisObject 回调函数的 this 引用。
     * @param type 文件类型(可选)。请使用 ResourceItem 类中定义的静态常量。若不设置将根据文件扩展名生成。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/resource/GetResByUrl.ts
     * @language zh_CN
     */
    export function getResByUrl(url: string, compFunc: Function, thisObject: any, type: string = ""): void {
        instance.getResByUrl(url, compFunc, thisObject, type);
    }
    /**
     * Destroy a single resource file or a set of resources to the cache data, to return whether to delete success.
     * @param name Name attribute or resource group name of the load item in the configuration file.
     * @param force Destruction of a resource group when the other resources groups have the same resource situation whether the resources will be deleted, the default value true.
     * @returns Are successful destruction.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
     * @param name 配置文件中加载项的name属性或资源组名。
     * @param force 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值 true。
     * @see #setMaxRetryTimes
     * @returns 是否销毁成功。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function destroyRes(name: string, force?: boolean): Promise<boolean> {
        return instance.destroyRes(name, force);
    }
    /**
     * Sets the maximum number of concurrent load threads, the default value is 2.
     * @param thread The number of concurrent loads to be set.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 设置最大并发加载线程数量，默认值是 2。
     * @param thread 要设置的并发加载数。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function setMaxLoadingThread(thread: number): void {
        if (!instance) instance = new Resource();
        instance.setMaxLoadingThread(thread);
    }

    /**
     * Sets the number of retry times when the resource failed to load, and the default value is 3.
     * @param retry To set the retry count.
     * @includeExample extension/resource/Resource.ts
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 设置资源加载失败时的重试次数，默认值是 3。
     * @param retry 要设置的重试次数。
     * @includeExample extension/resource/Resource.ts
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function setMaxRetryTimes(retry: number): void {
        instance.setMaxRetryTimes(retry);
    }

    /**
     * Add event listeners, reference ResourceEvent defined constants.
     * @param type Event name。
     * @param listener Listener functions for handling events. This function must accept the Event object as its only parameter, and can't return any results,
     * As shown in the following example: function (evt:Event):void can have any name.
     * @param thisObject The this object that is bound to a function.
     * @param useCapture Determine the listener is running on the capture or running on the target and the bubbling phase. Set useCapture to true,
     * then the listener in the capture phase processing events, but not in the target or the bubbling phase processing events.
     * If useCapture is false, then the listener only in the target or the bubbling phase processing events.
     * To listen for events in all three stages, please call addEventListener two times: once the useCapture is set to true, once the useCapture is set to false.
     * @param priority Event listener priority. Priority is specified by a 32 - bit integer with a symbol. The higher the number, the higher the priority.
     * All listeners with a priority for n will be processed before the -1 n listener.
     * If two or more listeners share the same priority, they are processed in accordance with the order of their added. The default priority is 0.
     * @see RES.ResourceEvent
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 添加事件侦听器,参考 ResourceEvent 定义的常量。
     * @param type 事件的类型。
     * @param listener 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
     * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
     * @param thisObject 侦听函数绑定的 this 对象。
     * @param useCapture 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，
     * 则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。
     * 要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
     * @param priority 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
     * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
     * @see RES.ResourceEvent
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function addEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture: boolean = false, priority: number = 0): void {
        if (!instance) instance = new Resource();
        instance.addEventListener(type, listener, thisObject, useCapture, priority);
    }
    /**
     * Remove event listeners, reference ResourceEvent defined constants.
     * @param type Event name。
     * @param listener Listening function。
     * @param thisObject The this object that is bound to a function.
     * @param useCapture Is used to capture, and this property is only valid in the display list.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 移除事件侦听器,参考ResourceEvent定义的常量。
     * @param type 事件名。
     * @param listener 侦听函数。
     * @param thisObject 侦听函数绑定的this对象。
     * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export function removeEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture: boolean = false): void {
        instance.removeEventListener(type, listener, thisObject, useCapture);
    }


    /**
     * Adding a custom resource configuration.
     * @param data To add configuration.
     * @version Egret 3.1.6
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 自定义添加一项资源配置。
     * @param data 要添加的配置。
     * @version Egret 3.1.6
     * @platform Web,Native
     * @language zh_CN
     */
    export function $addResourceData(data: { name: string, type: string, url: string }): void {
        //这里可能需要其他配置
        instance.addResourceData(data);
    }


    /**
     * @private
     */
    export class Resource extends egret.EventDispatcher {

        /**
         * 开始加载配置
		 * @method RES.loadConfig
         */
        @checkCancelation
        loadConfig(): Promise<void> {
            native_init();
            return config.init().then(data => {
                ResourceEvent.dispatchResourceEvent(this, ResourceEvent.CONFIG_COMPLETE);
            }, error => {
                ResourceEvent.dispatchResourceEvent(this, ResourceEvent.CONFIG_LOAD_ERROR);
                return Promise.reject(error);
            })
        }

        /**
         * 检查某个资源组是否已经加载完成
		 * @method RES.isGroupLoaded
		 * @param name {string}
         */
        public isGroupLoaded(name: string): boolean {
            let resources = config.getGroupByName(name, true);
            return resources.every(r => host.get(r) != null);
        }
        /**
         * 根据组名获取组加载项列表
		 * @method RES.getGroupByName
		 * @param name {string}
         */
        getGroupByName(name: string): Array<ResourceInfo> {
            return config.getGroupByName(name, true); //这里不应该传入 true，但是为了老版本的 TypeScriptCompiler 兼容性，暂时这样做
        }

        /**
         * 根据组名加载一组资源
		 * @method RES.loadGroup
		 * @param name {string}
		 * @param priority {number}
         */
        loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): Promise<any> {

            let reporterDelegate = {
                onProgress: (current, total) => {
                    if (reporter && reporter.onProgress) {
                        reporter.onProgress(current, total);
                    }
                    ResourceEvent.dispatchResourceEvent(this, ResourceEvent.GROUP_PROGRESS, name, undefined, current, total);
                }
            }
            return this._loadGroup(name, priority, reporterDelegate).then(data => {
                ResourceEvent.dispatchResourceEvent(this, ResourceEvent.GROUP_COMPLETE, name);
            }, error => {
                ResourceEvent.dispatchResourceEvent(this, ResourceEvent.GROUP_LOAD_ERROR, name);
                return Promise.reject(error);
            })
        }

        @checkCancelation
        private _loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): Promise<any> {
            let resources = config.getGroupByName(name, true);
            return queue.load(resources, name, priority, reporter);
        }

        loadResources(keys: string[], reporter?: PromiseTaskReporter) {
            let resources = keys.map(key => {
                let r = config.getResourceWithSubkey(key, true);
                return r.r;
            })
            return queue.load(resources, "name", 0, reporter);
        }

        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        public createGroup(name: string, keys: Array<string>, override: boolean = false): boolean {
            return config.createGroup(name, keys, override);
        }

        /**
         * 检查配置文件里是否含有指定的资源
		 * @method RES.hasRes
         * @param key {string} 对应配置文件里的name属性或subKeys属性的一项。
		 * @returns {boolean}
         */
        @checkNull
        public hasRes(key: string): boolean {
            return config.getResourceWithSubkey(key) != null;
        }

        /**
         * 通过key同步获取资源
		 * @method RES.getRes
		 * @param key {string}
		 * @returns {any}
         */
        @checkNull
        public getRes(resKey: string): any {
            let result = config.getResourceWithSubkey(resKey);
            if (result) {
                let r = result.r;
                let key = result.key;
                let subkey = result.subkey;
                let p = processor.isSupport(r);
                if (p && p.getData && subkey) {
                    return p.getData(host, r, key, subkey);
                }
                else {
                    return host.get(r);
                }
            }
            else {
                return null;
            }

        }

        /**
         * 通过key异步获取资源
         * @method RES.getResAsync
         * @param key {string}
         * @param compFunc {Function} 回调函数。示例：compFunc(data,url):void。
         * @param thisObject {any}
         */

        public getResAsync(key: string): Promise<any>
        public getResAsync(key: string, compFunc: GetResAsyncCallback, thisObject: any): void
        @checkNull
        @checkCancelation
        public getResAsync(key: string, compFunc?: GetResAsyncCallback, thisObject?: any): Promise<any> | void {
            var paramKey = key;
            var { r, subkey } = config.getResourceWithSubkey(key, true);
            return queue.loadResource(r).then(value => {
                host.save(r, value);
                let p = processor.isSupport(r);
                if (p && p.getData && subkey) {
                    value = p.getData(host, r, key, subkey);
                }
                if (compFunc) {
                    compFunc.call(thisObject, value, paramKey);
                }
                return value;
            })
        }

        /**
         * 通过url获取资源
		 * @method RES.getResByUrl
		 * @param url {string}
		 * @param compFunc {Function}
		 * @param thisObject {any}
		 * @param type {string}
         */
        @checkNull
        @checkCancelation
        public getResByUrl(url: string, compFunc: Function, thisObject: any, type: string = ""): Promise<any> | void {
            let r = config.getResource(url);
            if (!r) {
                if (!type) {
                    type = config.__temp__get__type__via__url(url);
                }
                // manager.config.addResourceData({ name: url, url: url });
                r = { name: url, url, type, extra: true };
                config.addResourceData(r);
                r = config.getResource(url);
                if (r) {
                    r.extra = true;
                }
                else {
                    throw 'never';
                }
            }
            return queue.loadResource(r).then(value => {
                if (compFunc && r) {
                    compFunc.call(thisObject, value, r.url);
                }
                return value;
            })
        }

        /**
         * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
		 * @method RES.destroyRes
         * @param name {string} 配置文件中加载项的name属性或资源组名
         * @param force {boolean} 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值true
		 * @returns {boolean}
         */
        async destroyRes(name: string, force: boolean = true) {
            var group = config.getGroup(name);
            let remove = (r: ResourceInfo) => {
                return queue.unloadResource(r);
            }

            if (group && group.length > 0) {
                for (let item of group) {
                    await remove(item);
                }
                return true;
            }
            else {
                let item = config.getResource(name);
                if (item) {
                    await remove(item);
                    return true;
                }
                else {
                    console.warn(`无法删除指定组:${name}`);
                    return false;
                }



            }
        }

        /**
         * 设置最大并发加载线程数量，默认值是2.
         * @method RES.setMaxLoadingThread
         * @param thread {number} 要设置的并发加载数。
         */
        public setMaxLoadingThread(thread: number): void {
            if (thread < 1) {
                thread = 1;
            }
            queue.thread = thread;
        }

        /**
         * 设置资源加载失败时的重试次数。
         * @param retry 要设置的重试次数。
         */
        public setMaxRetryTimes(retry: number): void {
            retry = Math.max(retry, 0);
            queue.maxRetryTimes = retry;
        }

        public addResourceData(data: { name: string, type: string, url: string }): void {
            config.addResourceData(data);
        }
    }
    /**
     * Resource单例
     */
    var instance: Resource;


}



