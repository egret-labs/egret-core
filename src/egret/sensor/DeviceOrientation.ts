

module egret {

    /**
     * @language en_US
     * Orientation monitor the orientation of the device, send CHANGE event when the orientation is changed
     *
     * @event egret.Event.CHANGE device's orientation is changed
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/DeviceOrientation.ts
     */
    /**
     * @language zh_CN
     * Orientation 监听设备方向的变化，当方向变化时派发 CHANGE 事件
     * @event egret.Event.CHANGE 设备方向改变时派发
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/DeviceOrientation.ts
     */
    export interface DeviceOrientation extends EventDispatcher {
        /**
         * @language en_US
         * Start to monitor the device's orientation
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 开始监听设备方向变化
         * @version Egret 2.4
         * @platform Web,Native
         */
        start(): void;
        /**
         * @language en_US
         * Stop monitor the device's orientation
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 停止监听设备方向变化
         * @version Egret 2.4
         * @platform Web,Native
         */
        stop(): void;
    }

    /**
     * @copy egret.Orientation
     */
    export var DeviceOrientation: { new (): DeviceOrientation } = null;

}