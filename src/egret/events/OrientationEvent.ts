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
     * The OrientationEvent provides information from the physical orientation of the device.
     * Note: Currently, Browsers on the iOS and Android does not handle the coordinates the same way.
     * Take care about this while using them.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/DeviceOrientation.ts
     */
    /**
     * @language zh_CN
     * OrientationEvent 提供设备的方向信息
     * 注意: 目前各个浏览器和操作系统处理方向的方式不完全相同，请根据使用场景做相应的校正，
     * 比如使用两次方向数据的变化而不是直接使用方向的值
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/sensor/DeviceOrientation.ts
     */
    export class OrientationEvent extends Event {
        /**
         * @language en_US
         * A number representing the motion of the device around the z axis,
         * express in degrees with values ranging from 0 to 360
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示设备绕 Z 轴的角度，单位是 角度 范围是 0 到 360
         * @version Egret 2.4
         * @platform Web,Native
         */
        public alpha: number;
        /**
         * @language en_US
         * A number representing the motion of the device around the x axis,
         * express in degrees with values ranging from -180 to 180.
         * This represents a front to back motion of the device.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示设备绕 X 轴的角度，单位是 角度 范围是 -180 到 180.
         * 这个值表示设备从前向后的旋转状态
         * @version Egret 2.4
         * @platform Web,Native
         */
        public beta: number;
        /**
         * @language en_US
         * A number representing the motion of the device around the y axis,
         * express in degrees with values ranging from -90 to 90.
         * This represents a left to right motion of the device.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示设备绕 Y 轴的角度，单位是 角度 范围是 -90 到 90.
         * 这个值表示设备从前向后的旋转状态
         * @version Egret 2.4
         * @platform Web,Native
         */
        public gamma: number;
    }
}