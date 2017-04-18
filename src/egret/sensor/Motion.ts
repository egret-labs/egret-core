

namespace egret {

    /**
     * @copy egret.Motion
     */
    export let Motion: { new (): Motion };

    /**
     * The Motion class emits events based on activity detected by the device's motion sensor.
     * This data represents the device's movement along a 3-dimensional axis. When the device moves,
     * the sensor detects this movement and emit the CHANGE event. @see egret.MotionEvent
     *
     * @event egret.Event.CHANGE device is moved
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/Motion.ts
     * @language en_US
     */
    /**
     * Motion 类从用户设备读取运动状态信息并派发 CHANGE 事件。
     * 当设备移动时，传感器会检测到此移动并返回设备加速度，重力和旋转数据。@see egret.MotionEvent
     * Motion 类提供了 start 和 stop 方法，来启动和停止运动信息检查
     *
     * @event egret.Event.CHANGE 运动状态发生改变
     * @version Egret 2.4
     * @platform Web
     * @includeExample egret/sensor/Motion.ts
     * @language zh_CN
     */
    export interface Motion extends EventDispatcher {
        /**
         * Start to monitor device movement
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 开始监听设备运动状态
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        start(): void;
        /**
         * Stop monitor device movement
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 停止监听设备运动状态
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        stop(): void;
    }

    /**
     * A DeviceRotationRate object provides information about the rate at which
     * the device is rotating around all three axes.
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * DeviceRotationRate 提供设备围绕三个轴旋转的角速度信息，单位是 角度/秒
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export interface DeviceRotationRate {
        /**
         * The amount of rotation around the Z axis, in degrees per second.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 设备绕 Z 轴旋转的角速度信息，单位是 度/秒
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        alpha: number;
        /**
         * The amount of rotation around the X axis, in degrees per second.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 设备绕 X 轴旋转的角速度信息，单位是 度/秒
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        beta: number;
        /**
         * The amount of rotation around the Y axis, in degrees per second.
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * 设备绕 Y 轴旋转的角速度信息，单位是 度/秒
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        gamma: number;
    }

    /**
     * A DeviceAcceleration object provides information about the amount
     * of acceleration the device is experiencing along all three axes.
     * Acceleration is expressed in m/s2.
     * @version Egret 2.4
     * @platform Web
     * @language en_US
     */
    /**
     * DeviceAcceleration 提供设备在三个维度的加速度信息，加速度值的单位是 m/s2
     * @version Egret 2.4
     * @platform Web
     * @language zh_CN
     */
    export interface DeviceAcceleration {
        /**
         * The amount of acceleration along the X axis
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * X 轴方向的加速度值
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        x: number;
        /**
         * The amount of acceleration along the Y axis
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * Y 轴方向的加速度值
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        y: number;
        /**
         * The amount of acceleration along the Z axis
         * @version Egret 2.4
         * @platform Web
         * @language en_US
         */
        /**
         * Z 轴方向的加速度值
         * @version Egret 2.4
         * @platform Web
         * @language zh_CN
         */
        z: number;
    }
}