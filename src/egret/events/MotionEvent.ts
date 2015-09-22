//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module egret {
    /**
     * @language en_US
     * MotionEvent represents the device's movement
     * Acceleration and accelerationIncludingGravity to represents the device's acceleration
     * RotationRate to represents the device's rotation
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Motion.ts
     */
    /**
     * @language zh_CN
     * MotionEvent 类呈现设备运动的具体信息
     * Acceleration 和 accelerationIncludingGravity 呈现设备三个维度的加速度信息
     * RotationRate 呈现设备的旋转状态信息
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/Motion.ts
     */
    export class MotionEvent extends Event {
        /**
         * @language en_US
         * An object giving the acceleration of the device on the three axis X, Y and Z. Acceleration is expressed in m/s2.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * acceleration 表示设备在 X Y Z 轴方将的加速度信息，单位是  m/s2，不包含重力
         * @version Egret 2.4
         * @platform Web,Native
         */
        acceleration: DeviceAcceleration;
        /**
         * @language en_US
         * An object giving the acceleration of the device on the three axis X, Y and Z with the effect of gravity. Acceleration is expressed in m/s2.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * acceleration 表示设备在 X Y Z 轴方将的加速度信息，单位是  m/s2，包含重力
         * @version Egret 2.4
         * @platform Web,Native
         */
        accelerationIncludingGravity: DeviceAcceleration;
        /**
         * @language en_US
         * An object giving the rate of change of the device's orientation on the three orientation axis alpha, beta and gamma. Rotation rate is express in degrees per seconds.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * rotationRate 表示设备在 alpha、 beta 和 gamma 三个轴向的角速度信息，单位是 角度每秒
         * @version Egret 2.4
         * @platform Web,Native
         */
        rotationRate: DeviceRotationRate;
    }
}