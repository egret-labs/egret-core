declare module RES {
    /**
     * @class RES.ResourceEvent
     * @classdesc
     * @extends egret.Event
     */
    class ResourceEvent extends egret.Event {
        /**
         * 一个加载项加载失败事件。
         * @constant {string} RES.ResourceEvent.ITEM_LOAD_ERROR
         */
        static ITEM_LOAD_ERROR: string;
        /**
         * 配置文件加载并解析完成事件。注意：若有配置文件加载失败，将不会抛出此事件，若要处理配置加载失败，请同时监听CONFIG_LOAD_ERROR事件。
         * @constant {string} RES.ResourceEvent.CONFIG_COMPLETE
         */
        static CONFIG_COMPLETE: string;
        /**
         * 配置文件加载失败事件
         * @constant {string} RES.ResourceEvent.CONFIG_COMPLETE
         */
        static CONFIG_LOAD_ERROR: string;
        /**
         * 延迟加载组资源加载进度事件
         * @constant {string} RES.ResourceEvent.GROUP_PROGRESS
         */
        static GROUP_PROGRESS: string;
        /**
         * 延迟加载组资源加载完成事件。注意：若组内有资源项加载失败，将不会抛出此事件，若要处理组加载失败，请同时监听GROUP_LOAD_ERROR事件。
         * @constant {string} RES.ResourceEvent.GROUP_COMPLETE
         */
        static GROUP_COMPLETE: string;
        /**
         * 延迟加载组资源加载失败事件
         * @constant {string} RES.ResourceEvent.GROUP_LOAD_ERROR
         */
        static GROUP_LOAD_ERROR: string;
        /**
         * 构造函数
         * @method RES.ResourceEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @private
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * 已经加载的文件数
         * @member {number} RES.ResourceEvent#itemsLoaded
         */
        itemsLoaded: number;
        /**
         * 要加载的总文件数
         * @member {number} RES.ResourceEvent#itemsTotal
         */
        itemsTotal: number;
        /**
         * 资源组名
         * @member {string} RES.ResourceEvent#groupName
         */
        groupName: string;
        /**
         * 一次加载项加载结束的项信息对象
         * @member {egret.ResourceItem} RES.ResourceEvent#resItem
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
        static dispatchResourceEvent(target: egret.IEventDispatcher, type: string, groupName?: string, resItem?: ResourceItem, itemsLoaded?: number, itemsTotal?: number): void;
    }
}

declare module RES {
    /**
     * @class RES.ResourceItem
     * @classdesc
     */
    class ResourceItem {
        /**
         * XML文件
         * @constant {string} RES.ResourceItem.TYPE_XML
         */
        static TYPE_XML: string;
        /**
         * 图片文件
         * @constant {string} RES.ResourceItem.TYPE_IMAGE
         */
        static TYPE_IMAGE: string;
        /**
         * 二进制流文件
         * @constant {string} RES.ResourceItem.TYPE_BIN
         * @platform Web
         */
        static TYPE_BIN: string;
        /**
         * 文本文件(解析为字符串)
         * @constant {string} RES.ResourceItem.TYPE_TEXT
         */
        static TYPE_TEXT: string;
        /**
         * JSON文件
         * @constant {string} RES.ResourceItem.TYPE_JSON
         */
        static TYPE_JSON: string;
        /**
         * SpriteSheet文件
         * @constant {string} RES.ResourceItem.TYPE_SHEET
         */
        static TYPE_SHEET: string;
        /**
         * BitmapTextSpriteSheet文件
         * @constant {string} RES.ResourceItem.TYPE_FONT
         */
        static TYPE_FONT: string;
        /**
         * 声音文件
         * @constant {string} RES.ResourceItem.TYPE_SOUND
         */
        static TYPE_SOUND: string;
        /**
         * 构造函数
         * @method RES.ResourceItem#constructor
         * @param name {string} 加载项名称
         * @param url {string} 要加载的文件地址
         * @param type {string} 加载项文件类型
         * @private
         */
        constructor(name: string, url: string, type: string);
        /**
         * 加载项名称
         * @member {string} RES.ResourceItem#name
         * @private
         */
        name: string;
        /**
         * 要加载的文件地址
         * @member {string} RES.ResourceItem#url
         * @private
         */
        url: string;
        /**
         * 加载项文件类型
         * @member {string} RES.ResourceItem#type
         * @private
         */
        type: string;
        /**
         * 所属组名
         * @member {string} RES.ResourceItem#groupName
         * @private
         */
        groupName: string;
        /**
         * 被引用的原始数据对象
         * @member {any} RES.ResourceItem#data
         * @private
         */
        data: any;
        private _loaded;
        /**
         * 加载完成的标志
         * @member {boolean} RES.ResourceItem#loaded
         * @private
         */
        loaded: boolean;
        /**
         * 转成字符串
         * @method RES.ResourceItem#toString
         * @returns {string}
         * @private
         */
        toString(): string;
    }
}

declare module RES {
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
         * @returns {Array<any>}
         */
        getRawGroupByName(name: string): Array<any>;
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

declare module RES {
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

declare module RES {
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

declare module RES {
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
        resItemDic: Array<any>;
        /**
         * @inheritDoc
         */
        loadFile(resItem: ResourceItem, compFunc: Function, thisObject: any): void;
        _dataFormat: string;
        /**
         * URLLoader对象池
         */
        recycler: egret.Recycler;
        /**
         * 获取一个URLLoader对象
         */
        private getLoader();
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

declare module RES {
    /**
     * @private
     */
    class ImageAnalyzer extends BinAnalyzer {
        constructor();
        /**
         * 解析并缓存加载成功的数据
         */
        analyzeData(resItem: ResourceItem, data: any): void;
        protected onResourceDestroy(texture: any): void;
    }
}

declare module RES {
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

declare module RES {
    /**
     * @private
     */
    class TextAnalyzer extends BinAnalyzer {
        constructor();
    }
}

declare module RES {
    /**
     * SpriteSheet解析器
     * @private
     */
    class SheetAnalyzer extends BinAnalyzer {
        constructor();
        /**
         * @inheritDoc
         */
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
        analyzeBitmap(resItem: ResourceItem, data: egret.Texture): void;
        /**
         * 获取相对位置
         */
        getRelativePath(url: string, file: string): string;
        parseSpriteSheet(texture: egret.Texture, data: any, name: string): egret.SpriteSheet;
        /**
         * @inheritDoc
         */
        destroyRes(name: string): boolean;
        protected onResourceDestroy(sheet: any): void;
    }
}

declare module RES {
    /**
     * @private
     */
    class FontAnalyzer extends SheetAnalyzer {
        constructor();
        analyzeConfig(resItem: ResourceItem, data: string): string;
        analyzeBitmap(resItem: ResourceItem, data: egret.Texture): void;
        private getTexturePath(url, fntText);
        protected onResourceDestroy(font: egret.BitmapFont): void;
    }
}

declare module RES {
    /**
     * @private
     */
    class SoundAnalyzer extends BinAnalyzer {
        constructor();
        analyzeData(resItem: ResourceItem, data: any): void;
    }
}

declare module RES {
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

declare module RES {
    /**
     * 加载配置文件并解析
     * @method RES.loadConfig
     * @param url {string} 配置文件路径(resource.json的路径)
     * @param resourceRoot {string} 资源根路径。配置中的所有url都是这个路径的相对值。最终url是这个字符串与配置里资源项的url相加的值。
     * @param type {string} 配置文件的格式。确定要用什么解析器来解析配置文件。默认"json"
     * @see #setMaxRetryTimes
     */
    function loadConfig(url: string, resourceRoot?: string, type?: string): void;
    /**
     * 根据组名加载一组资源
     * @method RES.loadGroup
     * @param name {string} 要加载资源组的组名
     * @param priority {number} 加载优先级,可以为负数,默认值为0。
     * 低优先级的组必须等待高优先级组完全加载结束才能开始，同一优先级的组会同时加载。
     * @see #setMaxRetryTimes
     */
    function loadGroup(name: string, priority?: number): void;
    /**
     * 检查某个资源组是否已经加载完成
     * @method RES.isGroupLoaded
     * @param name {string} 组名
     * @returns {boolean}
     * @see #setMaxRetryTimes
     */
    function isGroupLoaded(name: string): boolean;
    /**
     * 根据组名获取组加载项列表
     * @method RES.getGroupByName
     * @param name {string} 组名
     * @returns {egret.ResourceItem}
     * @see #setMaxRetryTimes
     */
    function getGroupByName(name: string): Array<ResourceItem>;
    /**
     * 创建自定义的加载资源组,注意：此方法仅在资源配置文件加载完成后执行才有效。
     * 可以监听ResourceEvent.CONFIG_COMPLETE事件来确认配置加载完成。
     * @method RES.createGroup
     * @param name {string} 要创建的加载资源组的组名
     * @param keys {egret.Array<string>} 要包含的键名列表，key对应配置文件里的name属性或sbuKeys属性的一项或一个资源组名。
     * @param override {boolean} 是否覆盖已经存在的同名资源组,默认false。
     * @returns {boolean}
     * @see #setMaxRetryTimes
     */
    function createGroup(name: string, keys: Array<string>, override?: boolean): boolean;
    /**
     * 检查配置文件里是否含有指定的资源
     * @method RES.hasRes
     * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
     * @returns {boolean}
     * @see #setMaxRetryTimes
     */
    function hasRes(key: string): boolean;
    /**
     * 运行时动态解析一个配置文件,
     * @method RES.parseConfig
     * @param data {any} 配置文件数据，请参考resource.json的配置文件格式。传入对应的json对象即可。
     * @param folder {string} 加载项的路径前缀。
     * @see #setMaxRetryTimes
     */
    function parseConfig(data: any, folder?: string): void;
    /**
     * 同步方式获取缓存的已经加载成功的资源。<br/>
     * @method RES.getRes
     * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
     * @returns {any}
     * @see #setMaxRetryTimes
     */
    function getRes(key: string): any;
    /**
     * 异步方式获取配置里的资源。只要是配置文件里存在的资源，都可以通过异步方式获取。
     * @method RES.getResAsync
     * @param key {string} 对应配置文件里的name属性或sbuKeys属性的一项。
     * @param compFunc {Function} 回调函数。示例：compFunc(data,key):void。
     * @param thisObject {any} 回调函数的this引用
     * @see #setMaxRetryTimes
     */
    function getResAsync(key: string, compFunc: Function, thisObject: any): void;
    /**
     * 通过完整URL方式获取外部资源。
     * @method RES.getResByUrl
     * @param url {string} 要加载文件的外部路径。
     * @param compFunc {Function} 回调函数。示例：compFunc(data,url):void。
     * @param thisObject {any} 回调函数的this引用
     * @param type {string} 文件类型(可选)。请使用ResourceItem类中定义的静态常量。若不设置将根据文件扩展名生成。
     * @includeExample extension/resource/GetResByUrl.ts
     */
    function getResByUrl(url: string, compFunc: Function, thisObject: any, type?: string): void;
    /**
     * 销毁单个资源文件或一组资源的缓存数据,返回是否删除成功。
     * @method RES.destroyRes
     * @param name {string} 配置文件中加载项的name属性或资源组名
     * @param force {boolean} 销毁一个资源组时其他资源组有同样资源情况资源是否会被删除，默认值true
     * @returns {boolean}
     * @see #setMaxRetryTimes
     */
    function destroyRes(name: string, force?: boolean): boolean;
    /**
     * 设置最大并发加载线程数量，默认值是2.
     * @method RES.setMaxLoadingThread
     * @param thread {number} 要设置的并发加载数。
     * @see #setMaxRetryTimes
     */
    function setMaxLoadingThread(thread: number): void;
    /**
     * 设置资源加载失败时的重试次数，默认值是 3。
     * @param retry 要设置的重试次数。
     * @includeExample extension/resource/Resource.ts
     */
    function setMaxRetryTimes(retry: number): void;
    /**
     * 添加事件侦听器,参考ResourceEvent定义的常量。
     * @method RES.addEventListener
     * @param type {string} 事件的类型。
     * @param listener {Function} 处理事件的侦听器函数。此函数必须接受 Event 对象作为其唯一的参数，并且不能返回任何结果，
     * 如下面的示例所示： function(evt:Event):void 函数可以有任何名称。
     * @param thisObject {any} 侦听函数绑定的this对象
     * @param useCapture {boolean} 确定侦听器是运行于捕获阶段还是运行于目标和冒泡阶段。如果将 useCapture 设置为 true，
     * 则侦听器只在捕获阶段处理事件，而不在目标或冒泡阶段处理事件。如果 useCapture 为 false，则侦听器只在目标或冒泡阶段处理事件。
     * 要在所有三个阶段都侦听事件，请调用 addEventListener 两次：一次将 useCapture 设置为 true，一次将 useCapture 设置为 false。
     * @param priority {number} 事件侦听器的优先级。优先级由一个带符号的 32 位整数指定。数字越大，优先级越高。优先级为 n 的所有侦听器会在
     * 优先级为 n -1 的侦听器之前得到处理。如果两个或更多个侦听器共享相同的优先级，则按照它们的添加顺序进行处理。默认优先级为 0。
     * @see #setMaxRetryTimes
     */
    function addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
    /**
     * 移除事件侦听器,参考ResourceEvent定义的常量。
     * @method RES.removeEventListener
     * @param type {string} 事件名
     * @param listener {Function} 侦听函数
     * @param thisObject {any} 侦听函数绑定的this对象
     * @param useCapture {boolean} 是否使用捕获，这个属性只在显示列表中生效。
     * @see #setMaxRetryTimes
     */
    function removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
}

