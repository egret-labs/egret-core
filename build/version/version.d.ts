declare module egret {
    /**
     * @private
     */
    class DefaultLoadingView extends DisplayObjectContainer implements ILoadingView {
        private textField;
        constructor();
        private onAddToStage();
        setProgress(current: any, total: any): void;
        loadError(): void;
    }
}
declare module egret {
    /**
     * @private
     */
    interface ILoadingView {
        setProgress(current: any, total: any): void;
        loadError(): void;
    }
}
declare module egret {
    /**
     * @private
     * @version Egret 2.0
     * @platform Web,Native
     */
    interface IVersionController extends egret.IEventDispatcher {
        /**
         *
         * @version Egret 2.0
         * @platform Web,Native
         */
        fetchVersion(): void;
        /**
         * 获取所有有变化的文件
         * @returns {Array<any>}
         * @version Egret 2.0
         * @platform Web,Native
         */
        getChangeList(): Array<any>;
        /**
         *
         * @param url
         * @returns
         * @version Egret 2.0
         * @platform Web,Native
         */
        getVirtualUrl(url: string): string;
    }
    /**
     * @version Egret 2.0
     * @platform Web,Native
     */
    interface VersionController extends IVersionController {
    }
    /**
     * @version Egret 2.0
     * @platform Web,Native
     */
    var VersionController: {
        new (stage: egret.Stage): VersionController;
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
        private _stage;
        constructor(stage: egret.Stage);
        fetchVersion(): void;
        private getList(callback, type, root?);
        /**
         * 获取所有有变化的文件
         * @returns {Array<any>}
         */
        getChangeList(): Array<any>;
        getVirtualUrl(url: string): string;
        private _iLoadingView;
        private loadAllChange();
        private getLocalData(filePath);
        private getLocalDataByOld(filePath);
    }
}
declare module egret.web {
    /**
     * @private
     */
    class Html5VersionController extends egret.EventDispatcher implements VersionController {
        constructor(stage: egret.Stage);
        private _versionInfo;
        fetchVersion(): void;
        /**
         * 获取所有有变化的文件
         * @returns {Array<any>}
         */
        getChangeList(): Array<any>;
        getVirtualUrl(url: string): string;
    }
}
