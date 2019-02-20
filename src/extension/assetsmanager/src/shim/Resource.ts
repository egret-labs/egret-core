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
    * Convert the file name of the resource to the Key value used in the project.
    * @param url Resource Name.
    * @returns The key value used in the project
    * @version Egret 5.2
    * @platform Web,Native
    * @language en_US
    */
    /**
     * 将资源的文件名称转换为项目中所使用的Key值。
     * 在加载合并图集的时候使用，例如图集加载A_json，需要加载对应A_png，这里就是转换的机制
     * 一般项目中无需更改，只有没有使用默认的key和文件对应的需要修改
     * @param url 资源名称。
     * @returns 项目中所用的key值
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function nameSelector(url): string {
        return path.basename(url).split(".").join("_");
    }
    /**
    * Get the read type of the file.
    * When using getResByUrl does not specify the type of the read file, it will find the corresponding type according to this method.
    * File types not found are loaded by default in binary format
    * @param path file path.
    * @returns Processor type used to read the file
    * @version Egret 5.2
    * @platform Web,Native
    * @language en_US
    */
    /**
     * 获取文件的读取类型
     * 在使用getResByUrl没有指定读取文件的类型，会根据这个方法寻找对应的类型
     * 没有查找到的文件类型以二进制格式默认加载
     * @param path 文件路径
     * @returns 读取文件所用的Processor类型
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function typeSelector(path: string): string {
        const ext = path.substr(path.lastIndexOf(".") + 1);
        let type: string;
        switch (ext) {
            case ResourceItem.TYPE_XML:
            case ResourceItem.TYPE_JSON:
            case ResourceItem.TYPE_SHEET:
                type = ext;
                break;
            case "png":
            case "jpg":
            case "gif":
            case "jpeg":
            case "bmp":
                type = ResourceItem.TYPE_IMAGE;
                break;
            case "fnt":
                type = ResourceItem.TYPE_FONT;
                break;
            case "txt":
                type = ResourceItem.TYPE_TEXT;
                break;
            case "mp3":
            case "ogg":
            case "mpeg":
            case "wav":
            case "m4a":
            case "mp4":
            case "aiff":
            case "wma":
            case "mid":
                type = ResourceItem.TYPE_SOUND;
                break;
            case "mergeJson":
            case "zip":
            case "pvr":
                type = ext;
                break;
            default:
                type = ResourceItem.TYPE_BIN;
                break;
        }
        return type;
    }
    /**
     * Conduct mapping injection with class definition as the value, Deprecated.
     * @deprecated
     * @see RES.processor.map
     * @language en_US
     */
    /**
     * 以类定义为值进行映射注入，已废弃。
     * @deprecated
     * @see RES.processor.map
     * @language zh_CN
     */
    export function registerAnalyzer(type: string, analyzerClass: any) {
        throw new ResourceManagerError(2002);
    }
    /**
    * Set whether it is compatible mode
    * When the value is true, the assetsManager will output the design of Res. When it is false, all the loaded resources will be returned as promises.
    * The default is false, run in strict assetsManager mode
    * @version Egret 5.2.9
    * @platform Web,Native
    * @language en_US
    */
    /**
     * 设置是否为兼容模式 
     * 当值为true时，assetsManager会以Res的设计输出，当为false时候，所有的加载资源都会以promise的方式返回
     * 默认是false，以严格assetsManager方式运行
     * @version Egret 5.2.9
     * @platform Web,Native
     * @language zh_CN
     */
    export function setIsCompatible(value: boolean) {
        isCompatible = value;
    }
    /**
     * @internal
     */
    export let isCompatible: boolean = false
    /**
     * Load configuration file and parse.
     * @param url The url address of the resource config
     * @param resourceRoot The root address of the resource config
     * @returns Promise
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 加载配置文件并解析。
     * @param url 资源配置的url地址
     * @param resourceRoot 资源配置的根地址
     * @returns Promise 
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function loadConfig(url: string, resourceRoot: string): Promise<void> {
        if (resourceRoot.indexOf('://') >= 0) {
            const temp = resourceRoot.split('://');
            resourceRoot = temp[0] + '://' + path.normalize(temp[1] + '/');
            url = url.replace(resourceRoot, '');
        }
        else {
            resourceRoot = path.normalize(resourceRoot + "/");
            url = url.replace(resourceRoot, '');
        }
        setConfigURL(url, resourceRoot);
        if (!instance) instance = new Resource();
        return compatiblePromise(instance.loadConfig());
    }

    function compatiblePromise(promise: Promise<void>): Promise<void> | Promise<any> {
        if (RES.isCompatible) {
            promise.catch((e) => { }).then();
            return undefined as any;
        } else {
            return promise;
        }
    }
    /**
     * Load a set of resources according to the group name.
     * @param name Group name to load the resource group.
     * @param priority Load priority can be negative, the default value is 0.
     * <br>A low priority group must wait for the high priority group to complete the end of the load to start, and the same priority group will be loaded at the same time.
     * @param reporter Resource group loading progress prompt
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 根据组名加载一组资源。
     * @param name 要加载资源组的组名。
     * @param priority 加载优先级,可以为负数,默认值为 0。
     * <br>低优先级的组必须等待高优先级组完全加载结束才能开始，同一优先级的组会同时加载。
     * @param reporter 资源组的加载进度提示
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): Promise<void> {
        return compatiblePromise(instance.loadGroup(name, priority, reporter));
    }
    /**
     * Check whether a resource group has been loaded.
     * @param name Group name。
     * @returns Is loading or not.
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 检查某个资源组是否已经加载完成。
     * @param name 组名。
     * @returns 是否正在加载。
     * @see #setMaxRetryTimes
     * @version Egret 5.2
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
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 根据组名获取组加载项列表。
     * @param name 组名。
     * @returns 加载项列表。
     * @see RES.ResourceItem
     * @see #setMaxRetryTimes
     * @version Egret 5.2
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
     * @version Egret 5.2
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
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function createGroup(name: string, keys: Array<string>, override: boolean = false): boolean {
        return instance.createGroup(name, keys, override);
    }
    /**
     * Check whether the configuration file contains the specified resources.
     * @param key A sbuKeys attribute or name property in a configuration file.
     * @returns Whether you have the specified resource
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 检查配置文件里是否含有指定的资源。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @returns 是否拥有指定资源
     * @see #setMaxRetryTimes
     * @version Egret 5.2
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
     * @version Egret 5.2
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
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function getRes(key: string): any {
        return instance.getRes(key);
    }
    /**
     * Asynchronous mode to get the resources in the configuration. As long as the resources exist in the configuration file, you can get it in an asynchronous way.
     * @param key A sbuKeys attribute or name property in a configuration file.
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
    */
    /**
     * 异步方式获取配置里的资源。只要是配置文件里存在的资源，都可以通过异步方式获取。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function getResAsync(key: string): Promise<any> | void
    /**
     * Asynchronous mode to get the resources in the configuration. As long as the resources exist in the configuration file, you can get it in an asynchronous way.
     * @param key A sbuKeys attribute or name property in a configuration file.
     * @param compFunc Call back function. Example：compFunc(data,key):void.
     * @param thisObject This pointer of call back function.
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 异步方式获取配置里的资源。只要是配置文件里存在的资源，都可以通过异步方式获取。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @param compFunc 回调函数。示例：compFunc(data,key):void。
     * @param thisObject 回调函数的 this 引用。
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function getResAsync(key: string, compFunc: GetResAsyncCallback, thisObject: any): Promise<any> | void
    /**
     * Asynchronous mode to get the resources in the configuration. As long as the resources exist in the configuration file, you can get it in an asynchronous way.
     * @param key A sbuKeys attribute or name property in a configuration file.
     * @param compFunc Call back function. Example：compFunc(data,key):void.
     * @param thisObject This pointer of call back function.
     * @see #setMaxRetryTimes
     * @example The following code demonstrates how to load a resource via getResAsync
     * <pre>
     *       RES.getResAsync("resource/example.json");//Only pass the key value to get the resource
     * 
     *       RES.getResAsync("resource/example.json", (data) => {
     *          console.log(data)
     *       }, this) //Pass in the key value, compFunc and thisObject get the resource, the latter two must appear at the same time
     * </pre>
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 异步方式获取配置里的资源。只要是配置文件里存在的资源，都可以通过异步方式获取。
     * @param key 对应配置文件里的 name 属性或 sbuKeys 属性的一项。
     * @param compFunc 回调函数。示例：compFunc(data,key):void。
     * @param thisObject 回调函数的 this 引用。
     * @see #setMaxRetryTimes
     * @example 以下代码演示了如何通过getResAsync加载资源
     * <pre>
     *       RES.getResAsync("resource/example.json");//只传入key值获取资源
     * 
     *       RES.getResAsync("resource/example.json", (data) => {
     *          console.log(data)
     *       }, this) //传入key值，compFunc和thisObject获取资源，后两个必须同时出现
     * </pre>
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function getResAsync(key: string, compFunc?: GetResAsyncCallback, thisObject?: any): Promise<any> {
        return compatiblePromise(instance.getResAsync.apply(instance, arguments));
    }

    /**
     * Access to external resources through the full URL.
     * @param url The external path to load the file.
     * @param compFunc Call back function. Example：compFunc(data,url):void。
     * @param thisObject This pointer of call back function.
     * @param type File type (optional). Use the static constants defined in the ResourceItem class. If you do not set the file name extension.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 通过完整URL方式获取外部资源。
     * @param url 要加载文件的外部路径。
     * @param compFunc 回调函数。示例：compFunc(data,url):void。
     * @param thisObject 回调函数的 this 引用。
     * @param type 文件类型(可选)。请使用 ResourceItem 类中定义的静态常量。若不设置将根据文件扩展名生成。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function getResByUrl(url: string, compFunc?: Function, thisObject?: any, type: string = ""): Promise<any> {
        if(!instance){
            let message = egret.sys.tr(3200)
            egret.warn(message)
            return Promise.reject(message);
        }
        return compatiblePromise(instance.getResByUrl(url, compFunc, thisObject, type));
    }
    /**
     * Destroy a single resource file or a set of resources to the cache data, to return whether to delete success.
     * @param name Name attribute or resource group name of the load item in the configuration file.
     * @param force Destruction of a resource group when the other resources groups have the same resource situation whether the resources will be deleted, the default value true.
     * @returns Are successful destruction.
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
     * @param name 配置文件中加载项的name属性或资源组名。
     * @param force 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值 true。
     * @see #setMaxRetryTimes
     * @returns 是否销毁成功。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function destroyRes(name: string, force?: boolean): boolean {
        return instance.destroyRes(name, force);
    }
    /**
     * Sets the maximum number of concurrent load threads, the default value is 4.
     * @param thread The number of concurrent loads to be set.
     * @see #setMaxRetryTimes
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 设置最大并发加载线程数量，默认值是 4。
     * @param thread 要设置的并发加载数。
     * @see #setMaxRetryTimes
     * @version Egret 5.2
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
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 设置资源加载失败时的重试次数，默认值是 3。
     * @param retry 要设置的重试次数。
     * @includeExample extension/resource/Resource.ts
     * @version Egret 5.2
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
     * @version Egret 5.2
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
     * @version Egret 5.2
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
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 移除事件侦听器,参考ResourceEvent定义的常量。
     * @param type 事件名。
     * @param listener 侦听函数。
     * @param thisObject 侦听函数绑定的this对象。
     * @param useCapture 是否使用捕获，这个属性只在显示列表中生效。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function removeEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture: boolean = false): void {
        instance.removeEventListener(type, listener, thisObject, useCapture);
    }


    /**
     * Adding a custom resource configuration.
     * @param data To add configuration.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 自定义添加一项资源配置。
     * @param data 要添加的配置。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function $addResourceData(data: { name: string, type: string, url: string }): void {
        //这里可能需要其他配置
        instance.addResourceData(data);
    }

    /**
    * Returns the VersionController
    * @version Egret 5.2
    * @platform Web,Native
    * @language en_US
    */
    /**
     * 获得版本控制器.
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function getVersionController(): VersionController {
        if (!instance) instance = new Resource();
        return instance.vcs;
    }

    /**
     * Register the VersionController
     * @param vcs The VersionController to register.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 注册版本控制器,通过RES模块加载资源时会从版本控制器获取真实url
     * @param vcs 注入的版本控制器。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function registerVersionController(vcs: VersionController): void {
        if (!instance) instance = new Resource();
        instance.registerVersionController(vcs);
    }
    /**
     * Convert the address of the loaded resource (via version controller conversion)
     * @param url path to the original resource
     * @returns converted address
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 转换加载资源的地址（经过版本控制器的转换）
     * @param url 原始资源的路径
     * @returns 转换后的地址
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function getVirtualUrl(url) {
        if (instance.vcs) {
            return instance.vcs.getVirtualUrl(url);
        }
        else {
            return url;
        }
    }

    /**
     * @private
     */
    export class Resource extends egret.EventDispatcher {
        vcs: VersionController;
        isVcsInit = false;
        constructor() {
            super();
            if (VersionController) {
                this.vcs = new VersionController();
            }

        }
        public registerVersionController(vcs: VersionController) {
            this.vcs = vcs;
            this.isVcsInit = false;
        }
        /**
         * 开始加载配置
         * @method RES.loadConfig
         */
        loadConfig(): Promise<void> {
            if (!this.isVcsInit && this.vcs) {
                this.isVcsInit = true;
                return this.vcs.init().then(() => {
                    return this.normalLoadConfig()
                });
            } else {
                return this.normalLoadConfig()
            }
        }
        /**
         * @private
         * 版本控制器加载后的加载配置
         */
        private normalLoadConfig = () => {
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
            let resources = config.getGroupByName(name);
            return resources.every(r => host.get(r) != null);
        }
        /**
         * 根据组名获取组加载项列表
         * @method RES.getGroupByName
         * @param name {string}
         */
        getGroupByName(name: string): Array<ResourceInfo> {
            return config.getGroupByName(name);
        }

        /**
         * 根据组名加载一组资源
         * @method RES.loadGroup
         * @param name {string}
         * @param priority {number}
         */
        loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): Promise<any> {

            let reporterDelegate = {
                onProgress: (current, total, resItem) => {
                    if (reporter && reporter.onProgress) {
                        reporter.onProgress(current, total, resItem);
                    }
                    ResourceEvent.dispatchResourceEvent(this, ResourceEvent.GROUP_PROGRESS, name, resItem, current, total);
                }
            }
            return this._loadGroup(name, priority, reporterDelegate).then(data => {
                if (config.config.loadGroup.indexOf(name) == -1) {
                    config.config.loadGroup.push(name);
                }
                ResourceEvent.dispatchResourceEvent(this, ResourceEvent.GROUP_COMPLETE, name);

            }, error => {
                if (config.config.loadGroup.indexOf(name) == -1) {
                    config.config.loadGroup.push(name);
                }
                if (error.itemList) {
                    const itemList: ResourceInfo[] = error.itemList;
                    const length = itemList.length;
                    for (let i = 0; i < length; i++) {
                        const item = itemList[i];
                        delete item.promise;
                        ResourceEvent.dispatchResourceEvent(this, ResourceEvent.ITEM_LOAD_ERROR, name, item);
                    }
                }
                if (RES.isCompatible) {
                    console.warn(error.error.message)
                }
                ResourceEvent.dispatchResourceEvent(this, ResourceEvent.GROUP_LOAD_ERROR, name);
                return Promise.reject(error.error);
            })
        }

        private _loadGroup(name: string, priority: number = 0, reporter?: PromiseTaskReporter): Promise<any> {
            let resources = config.getGroupByName(name);
            if (resources.length == 0) {
                return new Promise((resolve, reject) => {
                    reject({ error: new ResourceManagerError(2005, name) });
                })
            }
            return queue.pushResGroup(resources, name, priority, reporter);
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
        public getResAsync(key: string, compFunc: GetResAsyncCallback, thisObject: any): Promise<any>
        @checkNull
        public getResAsync(key: string, compFunc?: GetResAsyncCallback, thisObject?: any): Promise<any> {
            var paramKey = key;
            let tempResult = config.getResourceWithSubkey(key);
            if (tempResult == null) {
                if (compFunc) {
                    compFunc.call(thisObject, null, paramKey);
                }
                return Promise.reject(new ResourceManagerError(2006, key));
            }
            var { r, subkey } = tempResult;
            return queue.pushResItem(r).then(value => {
                host.save(r, value);
                let p = processor.isSupport(r);
                if (p && p.getData && subkey) {
                    value = p.getData(host, r, key, subkey);
                }
                if (compFunc) {
                    compFunc.call(thisObject, value, paramKey);
                }
                return value;
            }, error => {
                host.remove(r as ResourceInfo);
                ResourceEvent.dispatchResourceEvent(this, ResourceEvent.ITEM_LOAD_ERROR, "", r as ResourceInfo);
                if (compFunc) {
                    compFunc.call(thisObject, null, paramKey);
                    return Promise.reject(null);
                }
                return Promise.reject(error);
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
        public getResByUrl(url: string, compFunc?: Function, thisObject?: any, type: string = ""): Promise<any> {
            let r = config.getResource(url);
            if (!r) {
                if (!type) {
                    type = config.__temp__get__type__via__url(url);
                }
                // manager.config.addResourceData({ name: url, url: url });
                r = { name: url, url, type, root: '', extra: 1 };
                config.addResourceData(r);
                r = config.getResource(url);
                if (!r) {
                    throw 'never';
                }
            }
            return queue.pushResItem(r).then(value => {
                host.save(r as ResourceInfo, value);
                if (compFunc && r) {
                    compFunc.call(thisObject, value, r.url);
                }
                return value;
            }, error => {
                host.remove(r as ResourceInfo);
                ResourceEvent.dispatchResourceEvent(this, ResourceEvent.ITEM_LOAD_ERROR, "", r as ResourceInfo);
                if (compFunc) {
                    compFunc.call(thisObject, null, url);
                    return Promise.reject(null);
                }
                return Promise.reject(error);
            })
        }

        /**
         * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
         * @method RES.destroyRes
         * @param name {string} 配置文件中加载项的name属性或资源组名
         * @param force {boolean} 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值true
         * @returns {boolean}
         */
        destroyRes(name: string, force: boolean = true) {
            const group = config.getGroupByName(name);
            if (group && group.length > 0) {
                const index = config.config.loadGroup.indexOf(name);
                if(index == -1) {
                    return false;
                }
                if (force || (config.config.loadGroup.length == 1 && config.config.loadGroup[0] == name)) {
                    for (let item of group) {
                        queue.unloadResource(item);
                    }

                    config.config.loadGroup.splice(index, 1);
                } else {
                    const removeItemHash = {};
                    for (let groupName of config.config.loadGroup) {
                        for (let key in config.config.groups[groupName]) {
                            const tmpname = config.config.groups[groupName][key];
                            if (removeItemHash[tmpname]) {
                                removeItemHash[tmpname]++;
                            } else {
                                removeItemHash[tmpname] = 1;
                            }
                        }
                    }
                    for (let item of group) {
                        if (removeItemHash[item.name] && removeItemHash[item.name] == 1) {
                            queue.unloadResource(item);
                        }
                    }
                    config.config.loadGroup.splice(index, 1);
                }
                return true;
            }
            else {
                const item = config.getResource(name);
                if (item) {
                    return queue.unloadResource(item);
                }
                else {
                    console.warn(`在内存${name}资源不存在`);
                    return false;
                }
            }
        }

        /**
         * 设置最大并发加载线程数量，默认值是4.
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
            data["root"] = '';
            config.addResourceData(data);
        }
    }
    /**
     * Resource单例
     */
    var instance: Resource;

}



