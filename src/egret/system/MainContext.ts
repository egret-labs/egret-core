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
     * @class egret.MainContext
     * @classdesc
     * MainContext是游戏的核心跨平台接口，组合了多个功能Context，并是游戏启动的主入口
     * @extends egret.EventDispatcher
     * @private
     */
    export class MainContext extends EventDispatcher {

        constructor() {
            super();
        }

        /**
         * 渲染Context
         * @member egret.MainContext#rendererContext
         */
        //public rendererContext:RendererContext = null;

        /**
         * 触摸Context
         * @member egret.MainContext#touchContext
         */
        //public touchContext:TouchContext = null;

        /**
         * 网络Context
         * @member egret.MainContext#netContext
         */
        //public netContext:NetContext = null;

        /**
         * 设备divice
         * @member egret.MainContext#deviceContext
         */
        //public deviceContext:DeviceContext = null;

        /**
         * 舞台
         * @member egret.MainContext#stage
         */
        public stage:Stage = null;

        public static deviceType:string = null;

        public static DEVICE_PC:string = "web";
        public static DEVICE_MOBILE:string = "native";

        public static runtimeType:string;

        public static RUNTIME_HTML5:string = "runtimeHtml5";
        public static RUNTIME_NATIVE:string = "runtimeNative";

        /**
         * 游戏启动，开启主循环，参考Flash的滑动跑道模型
         * @method egret.MainContext#run
         */
        public run() {
        }

        private static _instance:egret.MainContext;

        /**
         * @method egret.Ticker.getInstance
         * @returns {Ticker}
         */
        public static get instance():egret.MainContext {
            if (MainContext._instance == null) {
                MainContext._instance = new MainContext();
            }
            return MainContext._instance;
        }
    }
}


var testDeviceType = function () {
    if (!this["navigator"]) {
        return true
    }
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);
};

var testRuntimeType = function () {
    if (this["navigator"]) {
        return true;
    }
    return false;
};

egret.MainContext.instance = new egret.MainContext();
egret.MainContext.deviceType = testDeviceType() ? egret.MainContext.DEVICE_MOBILE : egret.MainContext.DEVICE_PC;
egret.MainContext.runtimeType = testRuntimeType() ? egret.MainContext.RUNTIME_HTML5 : egret.MainContext.RUNTIME_NATIVE;


delete testDeviceType;
delete testRuntimeType;