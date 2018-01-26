declare type ResourceRootSelector<T extends string> = () => T;
declare type ResourceTypeSelector = (file: string) => string;
declare type ResourceNameSelector = (file: string) => string;
declare type ResourceMergerSelector = (file: string) => {
    path: string;
    alias: string;
};
declare module RES {
    var resourceTypeSelector: ResourceTypeSelector;
    var resourceNameSelector: ResourceNameSelector;
    var resourceMergerSelector: ResourceMergerSelector | null;
    function getResourceInfo(path: string): File | null;
    function setConfigURL(url: string): void;
    var resourceRoot: string;
    interface ResourceInfo {
        url: string;
        type: string;
        crc32?: string;
        size?: number;
        name: string;
        soundType?: string;
        scale9grid?: string;
        groupNames?: string[];
        /**
         * 是否被资源管理器进行管理，默认值为 false
         */
        extra?: boolean;
        promise?: Promise<any>;
    }
    interface Data {
        resourceRoot: string;
        typeSelector: ResourceTypeSelector;
        mergeSelector: ResourceMergerSelector | null;
        fileSystem: FileSystem;
        groups: {
            [groupName: string]: string[];
        };
        alias: {
            [aliasName: string]: string;
        };
    }
    /**
     * @class RES.ResourceConfig
     * @classdesc
     * @private
     */
    class ResourceConfig {
        config: Data;
        resourceRoot: string;
        constructor();
        init(): Promise<void>;
        __temp__get__type__via__url(url_or_alias: string): string;
        getKeyByAlias(aliasName: string): string;
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
         * 解析一个配置文件
         * @method RES.ResourceConfig#parseConfig
         * @param data {any} 配置文件数据
         * @param folder {string} 加载项的路径前缀。
         */
        parseConfig(data: Data): void;
        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        addSubkey(subkey: string, name: string): void;
        addAlias(alias: any, key: any): void;
        /**
         * 获取加载项类型。
         * @method RES.ResourceConfig#getType
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
         * @returns {string}
         */
        getType(key: string): string;
        addResourceData(data: {
            name: string;
            type?: string;
            url: string;
        }): void;
        destory(): void;
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
         * 正在加载的组列表,key为groupName
         */
        private itemListDic;
        /**
         * 加载失败的组,key为groupName
         */
        private groupErrorDic;
        private retryTimesDic;
        maxRetryTimes: number;
        /**
         * 优先级队列,key为priority，value为groupName列表
         */
        private priorityQueue;
        private reporterDic;
        private dispatcherDic;
        private failedList;
        private loadItemErrorDic;
        private errorDic;
        load(list: ResourceInfo[], groupName: string, priority: number, reporter?: PromiseTaskReporter): Promise<any>;
        private loadingCount;
        thread: number;
        private next();
        /**
         * 从优先级队列中移除指定的组名
         */
        private removeGroupName(groupName);
        private queueIndex;
        /**
         * 获取下一个待加载项
         */
        private getOneResourceInfo();
        loadResource(r: ResourceInfo, p?: RES.processor.Processor): Promise<any>;
        unloadResource(r: ResourceInfo): Promise<any>;
    }
}
declare module RES {
    /**
     * 整个资源加载系统的进程id，协助管理回调派发机制
     */
    var systemPid: number;
    let checkCancelation: MethodDecorator;
    function profile(): void;
    var host: ProcessHost;
    var config: ResourceConfig;
    var queue: ResourceLoader;
    interface ProcessHost {
        state: {
            [index: string]: number;
        };
        resourceConfig: ResourceConfig;
        load: (resource: ResourceInfo, processor?: string | processor.Processor) => Promise<any>;
        unload: (resource: ResourceInfo) => Promise<any>;
        save: (rexource: ResourceInfo, data: any) => void;
        get: (resource: ResourceInfo) => any;
        remove: (resource: ResourceInfo) => void;
    }
    class ResourceManagerError extends Error {
        static errorMessage: {
            1001: string;
            1002: string;
            1005: string;
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
     * Promise的回调函数集合
     */
    interface PromiseTaskReporter {
        /**
         * 进度回调
         */
        onProgress?: (current: number, total: number) => void;
        /**
         * 取消回调
         */
        onCancel?: () => void;
    }
}
declare module RES {
    let checkNull: MethodDecorator;
    /**
     * 功能开关
     *  LOADING_STATE：处理重复加载
     */
    let FEATURE_FLAG: {
        FIX_DUPLICATE_LOAD: number;
    };
    namespace upgrade {
        function setUpgradeGuideLevel(level: "warning" | "silent"): void;
    }
}
declare module RES {
    interface File {
        url: string;
        type: string;
        name: string;
    }
    interface Dictionary {
        [file: string]: File | Dictionary;
    }
    interface FileSystem {
        addFile(filename: string, type?: string): any;
        getFile(filename: string): File | null;
        profile(): void;
    }
    class NewFileSystem {
        private data;
        constructor(data: Dictionary);
        profile(): void;
        addFile(filename: string, type?: string): void;
        getFile(filename: string): File | null;
        private basename(filename);
        private normalize(filename);
        private dirname(path);
        private reslove(dirpath);
        private mkdir(dirpath);
        private exists(dirpath);
    }
    var fileSystem: FileSystem;
}
declare module RES.processor {
    interface Processor {
        onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;
        onRemoveStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;
        getData?(host: ProcessHost, resource: ResourceInfo, key: string, subkey: string): any;
    }
    function isSupport(resource: ResourceInfo): Processor;
    function map(type: string, processor: Processor): void;
    function getRelativePath(url: string, file: string): string;
    var ImageProcessor: Processor;
    var BinaryProcessor: Processor;
    var TextProcessor: Processor;
    var JsonProcessor: Processor;
    var XMLProcessor: Processor;
    var CommonJSProcessor: Processor;
    const SheetProcessor: Processor;
    var FontProcessor: Processor;
    var SoundProcessor: Processor;
    var MovieClipProcessor: Processor;
    const MergeJSONProcessor: Processor;
    const ResourceConfigProcessor: Processor;
    const LegacyResourceConfigProcessor: Processor;
    var PVRProcessor: Processor;
    const _map: {
        [index: string]: Processor;
    };
}
declare module RES {
    /**
     * The events of resource loading.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 资源加载事件。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    class ResourceEvent extends egret.Event {
        /**
         * Failure event for a load item.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个加载项加载失败事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static ITEM_LOAD_ERROR: string;
        /**
         * Configure file to load and parse the completion event. Note: if a configuration file is loaded, it will not be thrown out, and if you want to handle the configuration loading failure, monitor the CONFIG_LOAD_ERROR event.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 配置文件加载并解析完成事件。注意：若有配置文件加载失败，将不会抛出此事件，若要处理配置加载失败，请同时监听 CONFIG_LOAD_ERROR 事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static CONFIG_COMPLETE: string;
        /**
         * Configuration file failed to load.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 配置文件加载失败事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static CONFIG_LOAD_ERROR: string;
        /**
         * Delay load group resource loading progress event.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载进度事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static GROUP_PROGRESS: string;
        /**
         * Delay load group resource to complete event. Note: if you have a resource item loading failure, the event will not be thrown, if you want to handle the group load failure, please listen to the GROUP_LOAD_ERROR event.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载完成事件。注意：若组内有资源项加载失败，将不会抛出此事件，若要处理组加载失败，请同时监听 GROUP_LOAD_ERROR 事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static GROUP_COMPLETE: string;
        /**
         * Delayed load group resource failed event.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 延迟加载组资源加载失败事件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static GROUP_LOAD_ERROR: string;
        /**
         * Creates an Event object to pass as a parameter to event listeners.
         * @param type  The type of the event, accessible as Event.type.
         * @param bubbles  Determines whether the Event object participates in the bubbling stage of the event flow. The default value is false.
         * @param cancelable Determines whether the Event object can be canceled. The default values is false.
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         * @language en_US
         */
        /**
         * 创建一个作为参数传递给事件侦听器的 Event 对象。
         * @param type  事件的类型，可以作为 Event.type 访问。
         * @param bubbles  确定 Event 对象是否参与事件流的冒泡阶段。默认值为 false。
         * @param cancelable 确定是否可以取消 Event 对象。默认值为 false。
         * @version Egret 2.4
         * @platform Web,Native
         * @private
         * @language zh_CN
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * File number that has been loaded.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 已经加载的文件数。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        itemsLoaded: number;
        /**
         * Total file number to load.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要加载的总文件数。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        itemsTotal: number;
        /**
         * Resource group name.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 资源组名。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        groupName: string;
        /**
         * An item of information that is finished by the end of a load.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一次加载项加载结束的项信息对象。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        resItem: ResourceItem;
    }
}
declare module RES {
    /**
     * Resource term. One of the resources arrays in resource.json.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 资源项。对应 resource.json 中 resources 数组中的一项。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    namespace ResourceItem {
        /**
         * XML file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * XML 文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_XML: string;
        /**
         * Picture file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 图片文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_IMAGE: string;
        /**
         * Binary file.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 二进制文件。
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        const TYPE_BIN: string;
        /**
         * Text file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_TEXT: string;
        /**
         * JSON file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * JSON 文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_JSON: string;
        /**
         * SpriteSheet file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * SpriteSheet 文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_SHEET: string;
        /**
         * BitmapTextSpriteSheet file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * BitmapTextSpriteSheet 文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_FONT: string;
        /**
         * Sound file.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 声音文件。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        const TYPE_SOUND: string;
        function convertToResItem(r: ResourceInfo): ResourceItem;
    }
    interface ResourceItem extends ResourceInfo {
        /**
         * Name of resource term.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 加载项名称。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        name: string;
        /**
         * URL of resource term.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要加载的文件地址。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        url: string;
        /**
         * Type of resource term.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 加载项文件类型。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        type: string;
        /**
         * The raw data object to be referenced.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 被引用的原始数据对象。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        data: ResourceInfo;
        crc32?: string;
        size?: number;
        soundType?: string;
    }
}
declare namespace RES {
}
declare module RES {
    type GetResAsyncCallback = (value?: any, key?: string) => any;
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
    function registerAnalyzer(type: string, analyzerClass: any): void;
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
    function loadConfig(url: string, resourceRoot: string): Promise<void>;
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
    function loadGroup(name: string, priority?: number, reporter?: PromiseTaskReporter): Promise<void>;
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
    function isGroupLoaded(name: string): boolean;
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
    function getGroupByName(name: string): Array<ResourceItem>;
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
    function createGroup(name: string, keys: Array<string>, override?: boolean): boolean;
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
    function getRes(key: string): any;
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
    function getResAsync(key: string): Promise<any>;
    function getResAsync(key: string, compFunc: GetResAsyncCallback, thisObject: any): void;
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
    function getResByUrl(url: string, compFunc: Function, thisObject: any, type?: string): void;
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
    function destroyRes(name: string, force?: boolean): Promise<boolean>;
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
    function setMaxLoadingThread(thread: number): void;
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
    function addEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture?: boolean, priority?: number): void;
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
    function removeEventListener(type: string, listener: (event: egret.Event) => void, thisObject: any, useCapture?: boolean): void;
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
    function $addResourceData(data: {
        name: string;
        type: string;
        url: string;
    }): void;
    /**
     * @private
     */
    class Resource extends egret.EventDispatcher {
        /**
         * 开始加载配置
         * @method RES.loadConfig
         */
        loadConfig(): Promise<void>;
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
        loadResources(keys: string[], reporter?: PromiseTaskReporter): Promise<any>;
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
        getResAsync(key: string, compFunc: GetResAsyncCallback, thisObject: any): void;
        /**
         * 通过url获取资源
         * @method RES.getResByUrl
         * @param url {string}
         * @param compFunc {Function}
         * @param thisObject {any}
         * @param type {string}
         */
        getResByUrl(url: string, compFunc: Function, thisObject: any, type?: string): Promise<any> | void;
        /**
         * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
         * @method RES.destroyRes
         * @param name {string} 配置文件中加载项的name属性或资源组名
         * @param force {boolean} 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值true
         * @returns {boolean}
         */
        destroyRes(name: string, force?: boolean): Promise<boolean>;
        /**
         * 设置最大并发加载线程数量，默认值是2.
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
