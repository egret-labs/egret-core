

module egret {

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
    export declare class DeviceOrientation {

        /**
         * @language en_US
         * Specifies whether the system supports detecting the device orientation.
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示系统是否支持检测设备方向
         * @version Egret 2.0
         * @platform Web,Native
         */
        public static isSupport: boolean;
    }
}