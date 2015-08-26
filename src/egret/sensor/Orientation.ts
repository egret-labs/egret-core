

module egret {

    /**
     * @copy egret.Orientation
     */
    export var Orientation: { new (): Orientation } = null;


    /**
     * @language en_US
     * Orientation monitor the orientation of the device, send CHANGE event when the orientation is changed
     *
     * @event egret.Event.CHANGE device's orientation is changed
     * @version Lark 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/egret/sensor/OrientationExample.ts
     */
    /**
     * @language zh_CN
     * Orientation 监听设备方向的变化，当方向变化时派发 CHANGE 事件
     * @event egret.Event.CHANGE 设备方向改变时派发
     * @version Lark 1.0
     * @platform Web,Native
     * @includeExample examples/Samples/src/egret/sensor/OrientationExample.ts
     */
    export interface Orientation extends EventDispatcher {
        /**
         * @language en_US
         * Start to monitor the device's orientation
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 开始监听设备方向变化
         * @version Lark 1.0
         * @platform Web,Native
         */
        start(): void;
        /**
         * @language en_US
         * Stop monitor the device's orientation
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 停止监听设备方向变化
         * @version Lark 1.0
         * @platform Web,Native
         */
        stop(): void;
    }
}