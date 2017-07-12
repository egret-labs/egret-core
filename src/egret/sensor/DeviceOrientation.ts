

namespace egret {

    /**
     * Orientation monitor the orientation of the device, send CHANGE event when the orientation is changed
     *
     * @event egret.Event.CHANGE device's orientation is changed
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/DeviceOrientation.ts
     * @see http://edn.egret.com/cn/docs/page/661 获取设备旋转角度
     * @language en_US
     */
    /**
     * Orientation 监听设备方向的变化，当方向变化时派发 CHANGE 事件
     * @event egret.Event.CHANGE 设备方向改变时派发
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/DeviceOrientation.ts
     * @see http://edn.egret.com/cn/docs/page/661 获取设备旋转角度
     * @language zh_CN
     */
    export interface DeviceOrientation extends EventDispatcher {
        /**
         * Start to monitor the device's orientation
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 开始监听设备方向变化
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        start(): void;
        /**
         * Stop monitor the device's orientation
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 停止监听设备方向变化
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        stop(): void;
    }

    /**
     * @copy egret.Orientation
     */
    export let DeviceOrientation: { new (): DeviceOrientation } = null;

}