declare module egret {
    /**
     * @language en_US
     * Version control loading interface
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/version/VersionControl.ts
     */
    /**
     * @language zh_CN
     * 版本控制加载的接口
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/version/VersionControl.ts
     */
    interface IVersionController extends egret.IEventDispatcher {
        /**
         * @language en_US
         * Get the version information data.<br/>
         * Before calling this method requires the application of any resource load, we recommend starting at the application entry class (Main) The first call processing. This method is only responsible for acquiring version information, is not responsible for downloaded resources.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取版本信息数据。<br/>
         * 这个方法的调用需要在应用程序进行任何资源加载之前，建议在应用程序的入口类（Main）的开始最先进行调用处理。此方法只负责获取版本信息，不负责资源的下载。
         * @version Egret 2.4
         * @platform Web,Native
         */
        fetchVersion(): void;
        /**
         * @language en_US
         * Get all changed files.<br/>
         * The main application in native scene. Changes here include new file, update file (the same file name, but changed files).<br/>
         * @returns All changes in the file list. In the Web end this list is empty.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取所有有变化的文件。<br/>
         * 主要应用在native场景中。这里的变化包括新增文件、更新文件（文件名相同，但更改过的文件）。<br/>
         * @returns 所有有变化的文件列表。在Web端此列表为空。
         * @version Egret 2.4
         * @platform Web,Native
         */
        getChangeList(): Array<{
            url: string;
            size: number;
        }>;
        /**
         * @language en_US
         * Get the actual URL of the resource file.<br/>
         * Because this method needs to be called to control the actual version of the URL have the original resource files were changed, so would like to get the specified resource file the actual URL.<br/>
         * In the development and debugging phase, this method will directly return value passed.
         * @param url Url used in the game
         * @returns Actual loaded url
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取资源文件实际的URL地址。<br/>
         * 由于版本控制实际已经对原来的资源文件的URL进行了改变，因此想获取指定资源文件实际的URL时需要调用此方法。<br/>
         * 在开发调试阶段，这个方法会直接返回传入的参数值。
         * @param url 游戏中使用的url
         * @returns 实际加载的url
         * @version Egret 2.4
         * @platform Web,Native
         */
        getVirtualUrl(url: string): string;
    }
    /**
     * @language en_US
     * Manage version control class
     * @version Egret 2.4
     * @platform Web,Native
     * @event egret.Event.COMPLETE Version control loading is complete when thrown
     * @event egret.IOErrorEvent.IO_ERROR Version control failed to load when thrown
     * @includeExample extension/version/VersionControl.ts
     */
    /**
     * @language zh_CN
     * 管理版本控制的类
     * @version Egret 2.4
     * @platform Web,Native
     * @event egret.Event.COMPLETE 版本控制加载完成时抛出
     * @event egret.IOErrorEvent.IO_ERROR 版本控制加载失败时抛出
     * @includeExample extension/version/VersionControl.ts
     */
    interface VersionController extends IVersionController {
    }
    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    var VersionController: {
        /**
         * @language en_US
         * Constructor initialization
         */
        /**
         * @language zh_CN
         * 初始化构造函数
         */
        new (): VersionController;
    };
}
declare module egret.native {
    /**
     * @private
     */
    class NativeVersionController extends egret.EventDispatcher implements VersionController {
        private _versionInfo;
        private _versionPath;
        private _localFileArr;
        constructor();
        fetchVersion(): void;
        private getList(callback, type, root?);
        /**
         * 获取所有有变化的文件
         * @returns {Array<any>}
         */
        getChangeList(): Array<{
            url: string;
            size: number;
        }>;
        getVirtualUrl(url: string): string;
        private getLocalData(filePath);
    }
}
declare module egret.web {
    /**
     * @private
     */
    class Html5VersionController extends egret.EventDispatcher implements VersionController {
        constructor();
        private _versionInfo;
        fetchVersion(): void;
        /**
         * 获取所有有变化的文件
         * @returns {Array<any>}
         */
        getChangeList(): Array<{
            url: string;
            size: number;
        }>;
        getVirtualUrl(url: string): string;
    }
}
