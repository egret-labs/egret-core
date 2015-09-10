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
