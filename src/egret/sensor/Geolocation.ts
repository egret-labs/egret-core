

module egret {

    /**
     * @language en_US
     * The Geolocation able to obtain the position of the device.
     * Geolocation will emit CHANGE event when the device's location is changed.
     * It will emit IO_ERROR event if the location request is denied
     * or there is no location service on the device.
     *
     * @event egret.Event.CHANGE The device's location is changed
     * @event egret.Event.IO_ERROR Error occurred while getting the location
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Geolocation.ts
     */
    /**
     * @language zh_CN
     * Geolocation 能够从设备的定位服务获取设备的当前位置。
     * 当设备的位置发生改变时 Geolocation 会派发 CHANGE 事件。
     * 当定位请求被拒绝或该设备没有定位服务时 Geolocation 会派发 IO_ERROR 事件。
     *
     * @event egret.Event.CHANGE 设备位置发生改变
     * @event egret.Event.IO_ERROR 获取设备位置时发生错误
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Geolocation.ts
     */
    export interface Geolocation extends EventDispatcher {
        /**
         * @language en_US
         * Start to monitor the device's location
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 开始监听设备位置信息
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        start(): void;
        /**
         * @language en_US
         * Stop monitor the device's location
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 停止监听设备位置信息
         * @returns 
         * @version Egret 2.4
         * @platform Web,Native
         */
        stop(): void;
    }

    /**
     * @copy egret.Geolocation
     */
    export var Geolocation: {
        /**
         * @language en_US
         * constructor
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数
         * @version Egret 2.4
         * @platform Web,Native
         */
        new (): Geolocation
    };

}