declare namespace RES {
    /**
     * Version control loading interface
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/version/VersionControl.ts
     * @language en_US
     */
    /**
     * 版本控制加载的接口
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/version/VersionControl.ts
     * @language zh_CN
     */
    interface IVersionController {
        /**
         * Get the version information data.<br/>
         * Before calling this method requires the application of any resource load, we recommend starting at the application entry class (Main) The first call processing. This method is only responsible for acquiring version information, is not responsible for downloaded resources.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取版本信息数据。<br/>
         * 这个方法的调用需要在应用程序进行任何资源加载之前，建议在应用程序的入口类（Main）的开始最先进行调用处理。此方法只负责获取版本信息，不负责资源的下载。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        init(): Promise<any>;
        /**
         * Get the actual URL of the resource file.<br/>
         * Because this method needs to be called to control the actual version of the URL have the original resource files were changed, so would like to get the specified resource file the actual URL.<br/>
         * In the development and debugging phase, this method will directly return value passed.
         * @param url Url used in the game
         * @returns Actual loaded url
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取资源文件实际的URL地址。<br/>
         * 由于版本控制实际已经对原来的资源文件的URL进行了改变，因此想获取指定资源文件实际的URL时需要调用此方法。<br/>
         * 在开发调试阶段，这个方法会直接返回传入的参数值。
         * @param url 游戏中使用的url
         * @returns 实际加载的url
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        getVirtualUrl(url: string): string;
    }
    /**
     * Manage version control class
     * @version Egret 2.4
     * @platform Web,Native
     * @event egret.Event.COMPLETE Version control loading is complete when thrown
     * @event egret.IOErrorEvent.IO_ERROR Version control failed to load when thrown
     * @includeExample extension/version/VersionControl.ts
     * @language en_US
     */
    /**
     * 管理版本控制的类
     * @version Egret 2.4
     * @platform Web,Native
     * @event egret.Event.COMPLETE 版本控制加载完成时抛出
     * @event egret.IOErrorEvent.IO_ERROR 版本控制加载失败时抛出
     * @includeExample extension/version/VersionControl.ts
     * @language zh_CN
     */
    interface VersionController extends IVersionController {
    }
    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    let VersionController: {
        /**
         * Constructor initialization
         * @language en_US
         */
        /**
         * 初始化构造函数
         * @language zh_CN
         */
        new (): VersionController;
    };
}
declare type ResourceRootSelector<T extends string> = () => T;
declare type ResourceNameSelector = (file: string) => string;
declare type ResourceMergerSelector = (file: string) => {
    path: string;
    alias: string;
};
declare module RES {
    /**
     * Get resource information through file path
     * @param path file path
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 通过文件路径获取资源信息
     * @param path 文件路径
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function getResourceInfo(path: string): File | null;
    /**
    * @private
    */
    interface ResourceInfo {
        url: string;
        type: string;
        root: string;
        crc32?: string;
        size?: number;
        extra?: 1 | undefined;
        name: string;
        soundType?: string;
        scale9grid?: string;
        groupNames?: string[];
        promise?: Promise<any>;
    }
    /**
    * @private
    */
    interface Data {
        resourceRoot: string;
        mergeSelector: ResourceMergerSelector | null;
        fileSystem: FileSystem;
        groups: {
            [groupName: string]: string[];
        };
        alias: {
            [aliasName: string]: string;
        };
        loadGroup: string[];
    }
    /**
     * @class RES.ResourceConfig
     * @classdesc
     * @private
     */
    class ResourceConfig {
        config: Data;
        constructor();
        init(): Promise<any>;
        /**
         * 根据组名获取组加载项列表
         * @method RES.ResourceConfig#getGroupByName
         * @param name {string} 组名
         * @returns {Array<egret.ResourceItem>}
         */
        getGroupByName(name: string): ResourceInfo[];
        __temp__get__type__via__url(url_or_alias: string): string;
        getResourceWithSubkey(key: string): {
            r: ResourceInfo;
            key: string;
            subkey: string;
        } | null;
        getKeyByAlias(aliasName: string): string;
        getResource(path_or_alias: string): ResourceInfo | null;
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        createGroup(name: string, keys: Array<string>, override?: boolean): boolean;
        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        addSubkey(subkey: string, name: string): void;
        addAlias(alias: any, key: any): void;
        addResourceData(data: {
            name: string;
            type: string;
            url: string;
            root?: string;
            extra?: 1 | undefined;
        }): void;
        removeResourceData(data: {
            name: string;
            type?: string;
            url: string;
            root?: string;
            extra?: 1 | undefined;
        }): void;
    }
}
declare module RES {
    /**
     * @class RES.ResourceLoader
     * @classdesc
     * @private
     */
    class ResourceLoader {
        /**
         * 当前组加载的项总个数,key为groupName
         */
        private groupTotalDic;
        /**
         * 已经加载的项个数,key为groupName
         */
        private numLoadedDic;
        /**
         * 加载失败的组,key为groupName
         */
        private groupErrorDic;
        private retryTimesDic;
        maxRetryTimes: number;
        private reporterDic;
        private dispatcherDic;
        private failedList;
        private loadItemErrorDic;
        private errorDic;
        /**
         * 资源优先级队列，key为资源，value为优先级
         */
        private itemListPriorityDic;
        /**
         * 资源是否在加载
         */
        private itemLoadDic;
        private promiseHash;
        /**
         * 延迟加载队列,getResByUrl ,getResAsync等方法存储队列
         */
        private lazyLoadList;
        pushResItem(resInfo: ResourceInfo): Promise<any>;
        /**
         * 加载队列,存储组的队列
         */
        pushResGroup(list: ResourceInfo[], groupName: string, priority: number, reporter?: PromiseTaskReporter): Promise<any>;
        /**
         * 更新组的优先级顺序
         * @param list 存储数据的队列
         * @param priority 优先级
         */
        private updatelistPriority(list, priority);
        /**
         * 搜索单项资源的优先级
         * @param item 单项资源
         */
        private findPriorityInDic(item);
        private loadingCount;
        /**
         * 最大线程数目
         */
        thread: number;
        /**
         * 加载下一项资源，线程控制
         */
        private loadNextResource();
        /**
         * 加载单向资源
         */
        private loadSingleResource();
        /**
         * 获取下一个待加载项
         */
        private getOneResourceInfoInGroup();
        /**
         * 设置组的加载进度，同时返回当前组是否加载完成
         * @param groupName 组名
         * @param r 加载完成的资源
         */
        private setGroupProgress(groupName, r);
        /**
         * 加载组的最后一项，同时派发事件
         * @param groupName 组名
         * @param lastError 最后一项是否成功，此项为错误信息
         */
        private loadGroupEnd(groupName, lastError?);
        /**
         * 删除事件派发器，Promise的缓存，返回事件派发器
         * @param groupName 组名或是root+name
         */
        private deleteDispatcher(groupName);
        /**
         * 加载资源
         * @param r 资源信息
         * @param p 加载处理器
         */
        private loadResource(r, p?);
        /**
         * 释放资源
         * @param r 资源信息
         */
        unloadResource(r: ResourceInfo): boolean;
    }
}
declare module RES {
}
declare module RES {
    type GetResAsyncCallback = (value?: any, key?: string) => any;
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
    function nameSelector(url: any): string;
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
    function typeSelector(path: string): string;
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
    function registerAnalyzer(type: string, analyzerClass: any): void;
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
    function setIsCompatible(value: boolean): void;
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
    function loadConfig(url: string, resourceRoot: string): Promise<void>;
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
    function loadGroup(name: string, priority?: number, reporter?: PromiseTaskReporter): Promise<void>;
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
    function isGroupLoaded(name: string): boolean;
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
    function getGroupByName(name: string): Array<ResourceItem>;
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
    function createGroup(name: string, keys: Array<string>, override?: boolean): boolean;
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
    function hasRes(key: string): boolean;
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
    function getRes(key: string): any;
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
    function getResAsync(key: string): Promise<any> | void;
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
    function getResAsync(key: string, compFunc: GetResAsyncCallback, thisObject: any): Promise<any> | void;
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
    function getResByUrl(url: string, compFunc?: Function, thisObject?: any, type?: string): Promise<any>;
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
    function destroyRes(name: string, force?: boolean): boolean;
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
    function setMaxLoadingThread(thread: number): void;
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
    function setMaxRetryTimes(retry: number): void;
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
    function addEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture?: boolean, priority?: number): void;
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
    function removeEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture?: boolean): void;
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
    function $addResourceData(data: {
        name: string;
        type: string;
        url: string;
    }): void;
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
    function getVersionController(): VersionController;
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
    function registerVersionController(vcs: VersionController): void;
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
    function getVirtualUrl(url: any): any;
    /**
     * @private
     */
    class Resource extends egret.EventDispatcher {
        vcs: VersionController;
        isVcsInit: boolean;
        constructor();
        registerVersionController(vcs: VersionController): void;
        /**
         * 开始加载配置
         * @method RES.loadConfig
         */
        loadConfig(): Promise<void>;
        /**
         * @private
         * 版本控制器加载后的加载配置
         */
        private normalLoadConfig;
        /**
         * 检查某个资源组是否已经加载完成
         * @method RES.isGroupLoaded
         * @param name {string}
         */
        isGroupLoaded(name: string): boolean;
        /**
         * 根据组名获取组加载项列表
         * @method RES.getGroupByName
         * @param name {string}
         */
        getGroupByName(name: string): Array<ResourceInfo>;
        /**
         * 根据组名加载一组资源
         * @method RES.loadGroup
         * @param name {string}
         * @param priority {number}
         */
        loadGroup(name: string, priority?: number, reporter?: PromiseTaskReporter): Promise<any>;
        private _loadGroup(name, priority?, reporter?);
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        createGroup(name: string, keys: Array<string>, override?: boolean): boolean;
        /**
         * 检查配置文件里是否含有指定的资源
         * @method RES.hasRes
         * @param key {string} 对应配置文件里的name属性或subKeys属性的一项。
         * @returns {boolean}
         */
        hasRes(key: string): boolean;
        /**
         * 通过key同步获取资源
         * @method RES.getRes
         * @param key {string}
         * @returns {any}
         */
        getRes(resKey: string): any;
        /**
         * 通过key异步获取资源
         * @method RES.getResAsync
         * @param key {string}
         * @param compFunc {Function} 回调函数。示例：compFunc(data,url):void。
         * @param thisObject {any}
         */
        getResAsync(key: string): Promise<any>;
        getResAsync(key: string, compFunc: GetResAsyncCallback, thisObject: any): Promise<any>;
        /**
         * 通过url获取资源
         * @method RES.getResByUrl
         * @param url {string}
         * @param compFunc {Function}
         * @param thisObject {any}
         * @param type {string}
         */
        getResByUrl(url: string, compFunc?: Function, thisObject?: any, type?: string): Promise<any>;
        /**
         * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
         * @method RES.destroyRes
         * @param name {string} 配置文件中加载项的name属性或资源组名
         * @param force {boolean} 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值true
         * @returns {boolean}
         */
        destroyRes(name: string, force?: boolean): boolean;
        /**
         * 设置最大并发加载线程数量，默认值是4.
         * @method RES.setMaxLoadingThread
         * @param thread {number} 要设置的并发加载数。
         */
        setMaxLoadingThread(thread: number): void;
        /**
         * 设置资源加载失败时的重试次数。
         * @param retry 要设置的重试次数。
         */
        setMaxRetryTimes(retry: number): void;
        addResourceData(data: {
            name: string;
            type: string;
            url: string;
        }): void;
    }
}
declare namespace RES {
    /**
     * Print the memory occupied by the picture.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 对文件路径的一些操作，针对的是 C:/A/B/C/D/example.ts这种格式
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    namespace path {
        /**
         * Format the file path,"C:/A/B//C//D//example.ts"=>"C:/A/B/C/D/example.ts"
         * @param filename Incoming file path
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 格式化文件路径，"C:/A/B//C//D//example.ts"=>"C:/A/B/C/D/example.ts"
         * @param filename 传入的文件路径
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        function normalize(filename: string): string;
        /**
         * Get the file name according to the file path, "C:/A/B/example.ts"=>"example.ts"
         * @param filename Incoming file path
         * @return File name
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 根据文件路径得到文件名字，"C:/A/B/example.ts"=>"example.ts"
         * @param filename 传入的文件路径
         * @return 文件的名字
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        function basename(filename: string): string;
        /**
         * The path to the folder where the file is located,"C:/A/B/example.ts"=>"C:/A/B"
         * @param filename Incoming file path
         * @return The address of the folder where the file is located
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文件所在文件夹路径，"C:/A/B/example.ts"=>"C:/A/B"
         * @param filename 传入的文件路径
         * @return 文件所在文件夹的地址
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        function dirname(path: string): string;
    }
}
declare namespace RES {
    /**
     * @private
     */
    class NativeVersionController implements IVersionController {
        private versionInfo;
        init(): Promise<void>;
        getVirtualUrl(url: string): string;
        private getLocalData(filePath);
    }
}
declare module RES.processor {
    interface Processor {
        /**
         * Start loading a single resource
         * @param host Load the processor, you can use the processor to load resources, directly use http to get the resources back
         * @param resource Resource information
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 开始加载单项资源
         * @param host 加载处理器，可以不使用这个处理器加载资源，直接用http获取资源返回即可
         * @param resource 资源的信息
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;
        /**
         * Remove a single resource, usually call host.unload (resource);
         * @param host Load the processor
         * @param resource Resource information
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 移除单项资源，一般调用host.unload(resource);
         * @param host 加载处理器
         * @param resource 资源的信息
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        onRemoveStart(host: ProcessHost, resource: ResourceInfo): void;
        /**
        * Get the submap of the merged atlas
        * @param host Load the processor
        * @param resource Resource information
        * @param key The key value of the resource
        * @param subkey  Collection of subset names
        * @version Egret 5.2
        * @platform Web,Native
        * @language en_US
        */
        /**
         * 获取合并图集的子图
         * @param host 加载处理器
         * @param resource 资源的信息
         * @param key 资源的key值
         * @param subkey  子集名称的集合
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        getData?(host: ProcessHost, resource: ResourceInfo, key: string, subkey: string): any;
    }
    /**
     * Register the processor that loads the resource
     * @param type Load resource type
     * @param processor Loaded processor, an instance that implements the Processor interface
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 注册加载资源的处理器
     * @param type 加载资源类型
     * @param processor 加载的处理器，一个实现Processor接口的实例
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function map(type: string, processor: Processor): void;
    /**
     * @private
     * @param url
     * @param file
     */
    function getRelativePath(url: string, file: string): string;
    var ImageProcessor: Processor;
    const KTXTextureProcessor: RES.processor.Processor;
    /**
    *
    */
    function makeEtc1SeperatedAlphaResourceInfo(resource: ResourceInfo): ResourceInfo;
    /**
    *
    */
    const ETC1KTXProcessor: Processor;
    var BinaryProcessor: Processor;
    var TextProcessor: Processor;
    var JsonProcessor: Processor;
    var SoundProcessor: Processor;
}
declare module RES {
    /**
     * The events of resource loading.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 资源加载事件。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    class ResourceEvent extends egret.Event {
        /**
         * Failure event for a load item.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个加载项加载失败事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        static ITEM_LOAD_ERROR: string;
        /**
         * Configure file to load and parse the completion event. Note: if a configuration file is loaded, it will not be thrown out, and if you want to handle the configuration loading failure, monitor the CONFIG_LOAD_ERROR event.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 配置文件加载并解析完成事件。注意：若有配置文件加载失败，将不会抛出此事件，若要处理配置加载失败，请同时监听 CONFIG_LOAD_ERROR 事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        static CONFIG_COMPLETE: string;
        /**
         * Configuration file failed to load.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 配置文件加载失败事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        static CONFIG_LOAD_ERROR: string;
        /**
         * Delay load group resource loading progress event.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载进度事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        static GROUP_PROGRESS: string;
        /**
         * Delay load group resource to complete event. Note: if you have a resource item loading failure, the event will not be thrown, if you want to handle the group load failure, please listen to the GROUP_LOAD_ERROR event.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载完成事件。注意：若组内有资源项加载失败，将不会抛出此事件，若要处理组加载失败，请同时监听 GROUP_LOAD_ERROR 事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        static GROUP_COMPLETE: string;
        /**
         * Delayed load group resource failed event.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载失败事件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        static GROUP_LOAD_ERROR: string;
        /**
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 5.2
         * @platform Web,Native
         * @private
         * @language en_US
         */
        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 5.2
         * @platform Web,Native
         * @private
         * @language zh_CN
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * File number that has been loaded.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 已经加载的文件数。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        itemsLoaded: number;
        /**
         * Total file number to load.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要加载的总文件数。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        itemsTotal: number;
        /**
         * Resource group name.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 资源组名。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        groupName: string;
        /**
         * An item of information that is finished by the end of a load.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一次加载项加载结束的项信息对象。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        resItem: ResourceItem;
    }
}
declare module RES {
    /**
     * Resource term. One of the resources arrays in resource.json.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 资源项。对应 resource.json 中 resources 数组中的一项。
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    namespace ResourceItem {
        /**
         * XML file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * XML 文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_XML: string;
        /**
         * Picture file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 图片文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_IMAGE: string;
        /**
         * Binary file.
         * @version Egret 5.2
         * @platform Web
         * @language en_US
         */
        /**
         * 二进制文件。
         * @version Egret 5.2
         * @platform Web
         * @language zh_CN
         */
        const TYPE_BIN: string;
        /**
         * Text file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_TEXT: string;
        /**
         * JSON file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * JSON 文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_JSON: string;
        /**
         * SpriteSheet file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * SpriteSheet 文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_SHEET: string;
        /**
         * BitmapTextSpriteSheet file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * BitmapTextSpriteSheet 文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_FONT: string;
        /**
         * Sound file.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 声音文件。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_SOUND: string;
        function convertToResItem(r: ResourceInfo): ResourceItem;
    }
    interface ResourceItem extends ResourceInfo {
        /**
         * Name of resource term.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 加载项名称。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        name: string;
        /**
         * URL of resource term.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要加载的文件地址。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        url: string;
        /**
         * Type of resource term.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 加载项文件类型。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        type: string;
        /**
         * The raw data object to be referenced.
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 被引用的原始数据对象。
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        data: ResourceInfo;
        crc32?: string;
        size?: number;
        soundType?: string;
    }
}
declare module RES {
    /**
     * assetsManager underlying storage resource information
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * assetsManager底层存储资源信息
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    interface File {
        url: string;
        type: string;
        name: string;
        root: string;
    }
    /**
    * @private
    */
    interface FileSystem {
        addFile(data: {
            name: string;
            type: string;
            url: string;
            root?: string;
            extra?: 1 | undefined;
        }): any;
        getFile(filename: string): File | null;
        profile(): void;
        removeFile(filename: string): any;
    }
}
declare module RES {
    /**
     * Print the memory occupied by the picture.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 打印图片所占内存
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    function profile(): void;
    /**
    * @private
    */
    interface ProcessHost {
        state: {
            [index: string]: number;
        };
        resourceConfig: ResourceConfig;
        load: (resource: ResourceInfo, processor?: string | processor.Processor) => Promise<any>;
        unload: (resource: ResourceInfo) => void;
        save: (rexource: ResourceInfo, data: any) => void;
        get: (resource: ResourceInfo) => any;
        remove: (resource: ResourceInfo) => void;
    }
    /**
    * @private
    */
    class ResourceManagerError extends Error {
        static errorMessage: {
            1001: string;
            1002: string;
            2001: string;
            2002: string;
            2003: string;
            2004: string;
            2005: string;
            2006: string;
        };
        /**
         * why instanceof e  != ResourceManagerError ???
         * see link : https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        private __resource_manager_error__;
        constructor(code: number, replacer?: Object, replacer2?: Object);
    }
}
declare namespace RES {
    /**
     * Resource group loading progress prompt
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 资源组的加载进度提示
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    interface PromiseTaskReporter {
        /**
         * Progress callback, asynchronous execution, load number and order have nothing to do
         * @param current The number of currently loaded
         * @param total Total resources required in the current resource bundle
         * @param resItem currently loading resource information
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 进度回调，异步执行，加载数目和顺序无关
         * @param current 当前已经加载数目
         * @param total 当前资源包内需要资源总数
         * @param resItem 当前加载资源信息
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        onProgress?(current: number, total: number, resItem: ResourceInfo | undefined): void;
    }
}
