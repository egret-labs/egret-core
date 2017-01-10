declare namespace RES {
    /**
     * @classic
     * @private
     */
    class AnalyzerBase extends egret.HashObject {
        constructor();
        private resourceConfig;
        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        addSubkey(subkey: string, name: string): void;
        /**
         * 加载一个资源文件
         * @param resItem 加载项信息
         * @param compFunc 加载完成回调函数,示例:compFunc(resItem:ResourceItem):void;
         * @param thisObject 加载完成回调函数的this引用
         */
        loadFile(resItem: ResourceItem, compFunc: Function, thisObject: any): void;
        /**
         * 同步方式获取解析完成的数据
         * @param name 对应配置文件里的name属性。
         */
        getRes(name: string): any;
        /**
         * 销毁某个资源文件的二进制数据,返回是否删除成功。
         * @param name 配置文件中加载项的name属性
         */
        destroyRes(name: string): boolean;
        /**
         * 读取一个字符串里第一个点之前的内容。
         * @param name {string} 要读取的字符串
         */
        static getStringPrefix(name: string): string;
        /**
         * 读取一个字符串里第一个点之后的内容。
         * @param name {string} 要读取的字符串
         */
        static getStringTail(name: string): string;
    }
}
declare namespace RES {
    /**
     * @private
     */
    class BinAnalyzer extends AnalyzerBase {
        /**
         * 构造函数
         */
        constructor();
        /**
         * 字节流数据缓存字典
         */
        fileDic: any;
        /**
         * 加载项字典
         */
        resItemDic: any[];
        /**
         * @inheritDoc
         */
        loadFile(resItem: ResourceItem, compFunc: Function, thisObject: any): void;
        _dataFormat: string;
        /**
         * Loader对象池
         */
        protected recycler: egret.HttpRequest[];
        /**
         * 获取一个URLLoader对象
         */
        private getRequest();
        /**
         * 一项加载结束
         */
        onLoadFinish(event: egret.Event): void;
        /**
         * 解析并缓存加载成功的数据
         */
        analyzeData(resItem: ResourceItem, data: any): void;
        /**
         * @inheritDoc
         */
        getRes(name: string): any;
        /**
         * @inheritDoc
         */
        hasRes(name: string): boolean;
        /**
         * @inheritDoc
         */
        destroyRes(name: string): boolean;
        protected onResourceDestroy(resource: any): void;
    }
}
declare namespace RES {
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
    class ResourceItem {
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
        static TYPE_XML: string;
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
        static TYPE_IMAGE: string;
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
        static TYPE_BIN: string;
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
        static TYPE_TEXT: string;
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
        static TYPE_JSON: string;
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
        static TYPE_SHEET: string;
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
        static TYPE_FONT: string;
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
        static TYPE_SOUND: string;
        /**
         * Constructor.
         * @param name Name of resource term.
         * @param url URL of resource term.
         * @param type Type of resource term.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 构造函数。
         * @param name 加载项名称。
         * @param url 要加载的文件地址。
         * @param type 加载项文件类型。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        constructor(name: string, url: string, type: string);
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
         * Name of the resource term group.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 资源所属的组名。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        groupName: string;
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
        data: any;
        private _loaded;
        /**
         * Load complete flag.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 加载完成的标志。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        loaded: boolean;
        /**
         * Turn into a string.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 转成字符串。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        toString(): string;
    }
}
declare namespace RES {
    /**
     * SpriteSheet解析器
     * @private
     */
    class SheetAnalyzer extends BinAnalyzer {
        constructor();
        getRes(name: string): any;
        /**
         * 一项加载结束
         */
        onLoadFinish(event: egret.Event): void;
        sheetMap: any;
        private textureMap;
        /**
         * 解析并缓存加载成功的配置文件
         */
        analyzeConfig(resItem: ResourceItem, data: string): string;
        /**
         * 解析并缓存加载成功的位图数据
         */
        analyzeBitmap(resItem: ResourceItem, texture: egret.Texture): void;
        /**
         * 获取相对位置
         */
        getRelativePath(url: string, file: string): string;
        protected parseSpriteSheet(texture: egret.Texture, data: any, name: string): egret.SpriteSheet;
        destroyRes(name: string): boolean;
        /**
         * ImageLoader对象池
         */
        private recyclerIamge;
        private loadImage(url, data);
        private getImageLoader();
        protected onResourceDestroy(texture: any): void;
    }
}
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
        fetchVersion(callback: egret.AsyncCallback): void;
        /**
         * Get all changed files.<br/>
         * The main application in native scene. Changes here include new file, update file (the same file name, but changed files).<br/>
         * @returns All changes in the file list. In the Web end this list is empty.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取所有有变化的文件。<br/>
         * 主要应用在native场景中。这里的变化包括新增文件、更新文件（文件名相同，但更改过的文件）。<br/>
         * @returns 所有有变化的文件列表。在Web端此列表为空。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        getChangeList(): Array<{
            url: string;
            size: number;
        }>;
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
declare namespace RES {
    /**
     * @private
     */
    class ImageAnalyzer extends AnalyzerBase {
        /**
         * 构造函数
         */
        constructor();
        /**
         * 字节流数据缓存字典
         */
        protected fileDic: any;
        /**
         * 加载项字典
         */
        protected resItemDic: any[];
        /**
         * @inheritDoc
         */
        loadFile(resItem: ResourceItem, compFunc: Function, thisObject: any): void;
        /**
         * Loader对象池
         */
        protected recycler: egret.ImageLoader[];
        /**
         * 获取一个Loader对象
         */
        private getLoader();
        /**
         * 一项加载结束
         */
        protected onLoadFinish(event: egret.Event): void;
        /**
         * 解析并缓存加载成功的数据
         */
        protected analyzeData(resItem: ResourceItem, texture: egret.Texture): void;
        /**
         * @inheritDoc
         */
        getRes(name: string): any;
        /**
         * @inheritDoc
         */
        hasRes(name: string): boolean;
        /**
         * @inheritDoc
         */
        destroyRes(name: string): boolean;
        protected onResourceDestroy(texture: any): void;
    }
}
declare namespace RES {
    /**
     * @private
     */
    class TextAnalyzer extends BinAnalyzer {
        constructor();
    }
}
declare namespace RES {
    /**
     * @private
     */
    class JsonAnalyzer extends BinAnalyzer {
        constructor();
        /**
         * 解析并缓存加载成功的数据
         */
        analyzeData(resItem: ResourceItem, data: any): void;
    }
}
declare namespace RES {
    /**
     * @class RES.ResourceLoader
     * @classdesc
     * @extends egret.EventDispatcher
     * @private
     */
    class ResourceLoader extends egret.EventDispatcher {
        /**
         * 构造函数
         * @method RES.ResourceLoader#constructor
         */
        constructor();
        /**
         * 最大并发加载数
         */
        thread: number;
        /**
         * 正在加载的线程计数
         */
        private loadingCount;
        /**
         * 一项加载结束回调函数。无论加载成功或者出错都将执行回调函数。示例：callBack(resItem:ResourceItem):void;
         * @member {Function} RES.ResourceLoader#callBack
         */
        callBack: Function;
        /**
         * RES单例的引用
         * @member {any} RES.ResourceLoader#resInstance
         */
        resInstance: any;
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
        private failedList;
        /**
         * 优先级队列,key为priority，value为groupName列表
         */
        private priorityQueue;
        /**
         * 检查指定的组是否正在加载中
         * @method RES.ResourceLoader#isGroupInLoading
         * @param groupName {string}
         * @returns {boolean}
         */
        isGroupInLoading(groupName: string): boolean;
        /**
         * 开始加载一组文件
         * @method RES.ResourceLoader#loadGroup
         * @param list {egret.Array<ResourceItem>} 加载项列表
         * @param groupName {string} 组名
         * @param priority {number} 加载优先级
         */
        loadGroup(list: Array<ResourceItem>, groupName: string, priority?: number): void;
        /**
         * 延迟加载队列
         */
        private lazyLoadList;
        /**
         * 加载一个文件
         * @method RES.ResourceLoader#loadItem
         * @param resItem {egret.ResourceItem} 要加载的项
         */
        loadItem(resItem: ResourceItem): void;
        /**
         * 资源解析库字典类
         */
        private analyzerDic;
        /**
         * 加载下一项
         */
        private next();
        /**
         * 当前应该加载同优先级队列的第几列
         */
        private queueIndex;
        /**
         * 获取下一个待加载项
         */
        private getOneResourceItem();
        /**
         * 加载结束
         */
        private onItemComplete(resItem);
        /**
         * 从优先级队列中移除指定的组名
         */
        private removeGroupName(groupName);
    }
}
declare namespace RES {
    /**
     * @private
     */
    class FontAnalyzer extends SheetAnalyzer {
        constructor();
        analyzeConfig(resItem: ResourceItem, data: string): string;
        analyzeBitmap(resItem: ResourceItem, texture: egret.Texture): void;
        private getTexturePath(url, fntText);
        protected onResourceDestroy(font: egret.BitmapFont): void;
    }
}
declare namespace RES {
    /**
     * @class RES.ResourceConfig
     * @classdesc
     * @private
     */
    class ResourceConfig {
        constructor();
        /**
         * 根据组名获取组加载项列表
         * @method RES.ResourceConfig#getGroupByName
         * @param name {string} 组名
         * @returns {Array<egret.ResourceItem>}
         */
        getGroupByName(name: string): Array<ResourceItem>;
        /**
         * 根据组名获取原始的组加载项列表
         * @method RES.ResourceConfig#getRawGroupByName
         * @param name {string} 组名
         * @returns {any[]}
         */
        getRawGroupByName(name: string): any[];
        /**
         * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
         * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
         * @method RES.ResourceConfig#createGroup
         * @param name {string} 要创建的加载资源组的组名
         * @param keys {egret.string[]} 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项或一个资源组名。
         * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
         * @returns {boolean}
         */
        createGroup(name: string, keys: string[], override?: boolean): boolean;
        /**
         * 一级键名字典
         */
        private keyMap;
        /**
         * 加载组字典
         */
        private groupDic;
        /**
         * 解析一个配置文件
         * @method RES.ResourceConfig#parseConfig
         * @param data {any} 配置文件数据
         * @param folder {string} 加载项的路径前缀。
         */
        parseConfig(data: any, folder: string): void;
        /**
         * 添加一个二级键名到配置列表。
         * @method RES.ResourceConfig#addSubkey
         * @param subkey {string} 要添加的二级键名
         * @param name {string} 二级键名所属的资源name属性
         */
        addSubkey(subkey: string, name: string): void;
        /**
         * 添加一个加载项数据到列表
         */
        private addItemToKeyMap(item);
        /**
         * 获取加载项的name属性
         * @method RES.ResourceConfig#getType
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
         * @returns {string}
         */
        getName(key: string): string;
        /**
         * 获取加载项类型。
         * @method RES.ResourceConfig#getType
         * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
         * @returns {string}
         */
        getType(key: string): string;
        getRawResourceItem(key: string): any;
        /**
         * 获取加载项信息对象
         * @method RES.ResourceConfig#getResourceItem
         * @param key {string} 对应配置文件里的key属性或sbuKeys属性的一项。
         * @returns {egret.ResourceItem}
         */
        getResourceItem(key: string): ResourceItem;
        /**
         * 转换Object数据为ResourceItem对象
         */
        private parseResourceItem(data);
    }
}
declare namespace RES {
    /**
     * @private
     */
    class XMLAnalyzer extends BinAnalyzer {
        constructor();
        /**
         * 解析并缓存加载成功的数据
         */
        analyzeData(resItem: ResourceItem, data: any): void;
    }
}
declare namespace RES {
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
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method RES.ResourceEvent.dispatchResourceEvent
         * @param target {egret.IEventDispatcher}
         * @param type {string}
         * @param groupName {string}
         * @param resItem {egret.ResourceItem}
         * @param itemsLoaded {number}
         * @param itemsTotal {number}
         * @private
         */
        static dispatchResourceEvent(target: egret.IEventDispatcher, type: string, groupName?: string, resItem?: ResourceItem, itemsLoaded?: number, itemsTotal?: number): boolean;
    }
}
declare namespace RES.web {
    /**
     * @private
     */
    class Html5VersionController extends egret.EventDispatcher implements VersionController {
        constructor();
        private _versionInfo;
        fetchVersion(callback: egret.AsyncCallback): void;
        /**
         * 获取所有有变化的文件
         * @returns {any[]}
         */
        getChangeList(): Array<{
            url: string;
            size: number;
        }>;
        getVirtualUrl(url: string): string;
    }
}
declare namespace RES.native {
    /**
     * @private
     */
    class NativeVersionController implements VersionController {
        private _versionInfo;
        private _versionPath;
        private _localFileArr;
        constructor();
        fetchVersion(callback: egret.AsyncCallback): void;
        private getList(callback, type, root?);
        /**
         * 获取所有有变化的文件
         * @returns {any[]}
         */
        getChangeList(): Array<{
            url: string;
            size: number;
        }>;
        getVirtualUrl(url: string): string;
        private getLocalData(filePath);
    }
}
declare namespace RES {
    /**
     * @private
     */
    class SoundAnalyzer extends AnalyzerBase {
        /**
         * 构造函数
         */
        constructor();
        /**
         * 字节流数据缓存字典
         */
        protected soundDic: any;
        /**
         * 加载项字典
         */
        protected resItemDic: any[];
        /**
         * @inheritDoc
         */
        loadFile(resItem: ResourceItem, callBack: Function, thisObject: any): void;
        /**
         * 一项加载结束
         */
        protected onLoadFinish(event: egret.Event): void;
        /**
         * 解析并缓存加载成功的数据
         */
        protected analyzeData(resItem: ResourceItem, data: egret.Sound): void;
        /**
         * @inheritDoc
         */
        getRes(name: string): any;
        /**
         * @inheritDoc
         */
        hasRes(name: string): boolean;
        /**
         * @inheritDoc
         */
        destroyRes(name: string): boolean;
    }
}
declare namespace RES {
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
     * Get mapping injection.
     * @param type Injection type.
     * @version Egret 3.2.6
     * @platform Web,Native
     * @includeExample extension/resource/Resource.ts
     * @language en_US
     */
    /**
     * 获取映射注入。
     * @param type 注入的类型。
     * @version Egret 3.2.6
     * @platform Web,Native
     * @includeExample extension/resource/Resource.ts
     * @language zh_CN
     */
    function getAnalyzer(type: string): AnalyzerBase;
    /**
     * Register the VersionController
     * @param vcs The VersionController to register.
     * @version Egret 2.5
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 注册版本控制器,通过RES模块加载资源时会从版本控制器获取真实url
     * @param vcs 注入的版本控制器。
     * @version Egret 2.5
     * @platform Web,Native
     * @language zh_CN
     */
    function registerVersionController(vcs: VersionController): void;
    /**
     * Returns the VersionController
     * @version Egret 2.5
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 获得版本控制器.
     * @version Egret 2.5
     * @platform Web,Native
     * @language zh_CN
     */
    function getVersionController(): VersionController;
    /**
     * Load configuration file and parse.
     * @param url Configuration file path (path resource.json).
     * @param resourceRoot Resource path. All URL in the configuration is the relative value of the path. The ultimate URL is the value of the sum of the URL of the string and the resource in the configuration.
     * @param type Configuration file format. Determine what parser to parse the configuration file. Default "json".
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 加载配置文件并解析。
     * @param url 配置文件路径(resource.json的路径)。
     * @param resourceRoot 资源根路径。配置中的所有url都是这个路径的相对值。最终url是这个字符串与配置里资源项的url相加的值。
     * @param type 配置文件的格式。确定要用什么解析器来解析配置文件。默认"json"
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    function loadConfig(url: string, resourceRoot?: string, type?: string): void;
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
    function loadGroup(name: string, priority?: number): void;
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
    function createGroup(name: string, keys: string[], override?: boolean): boolean;
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
     * parse a configuration file at run time，it will not clean the exist data.
     * @param data Configuration file data, please refer to the resource.json configuration file format. JSON object can be introduced into the corresponding.
     * @param folder Path prefix for load.
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 运行时动态解析一个配置文件,此操作不会清空之前已存在的配置。
     * @param data 配置文件数据，请参考 resource.json 的配置文件格式。传入对应的 json 对象即可。
     * @param folder 加载项的路径前缀。
     * @see #setMaxRetryTimes
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    function parseConfig(data: any, folder?: string): void;
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
    function getResAsync(key: string, compFunc: Function, thisObject: any): void;
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
    function destroyRes(name: string, force?: boolean): boolean;
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
    function $getVirtualUrl(url: any): any;
}
declare namespace RES {
    /**
     * SpriteSheet解析器
     * @private
     */
    class AnimationAnalyzer extends BinAnalyzer {
        constructor();
        /**
         * 一项加载结束
         */
        onLoadFinish(event: egret.Event): void;
        sheetMap: any;
        /**
         * 解析并缓存加载成功的配置文件
         */
        analyzeConfig(resItem: ResourceItem, data: string): string;
        /**
         * 解析并缓存加载成功的位图数据
         */
        analyzeBitmap(resItem: ResourceItem, data: egret.BitmapData): void;
        /**
         * 获取相对位置
         */
        getRelativePath(url: string, file: string): string;
        private parseAnimation(bitmapData, data, name);
        destroyRes(name: string): boolean;
        /**
         * ImageLoader对象池
         */
        private recyclerIamge;
        private loadImage(url, data);
        private getImageLoader();
    }
}
declare namespace egret {
}
declare namespace egret {
}
