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
     * Type of operation.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 运行类型的类型。
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class RuntimeType {
        /**
         * @language en_US
         * Running on Web
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 运行在Web上
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static WEB:string = "web";
        /**
         * @language en_US
         * Running on NATIVE
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 运行在NATIVE上
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static NATIVE:string = "native";
    }

    /**
     * @language en_US
     * The Capabilities class provides properties that describe the system and runtime that are hosting the application.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/system/Capabilities.ts
     */
    /**
     * @language zh_CN
     * Capabilities 类提供一些属性，这些属性描述了承载应用程序的系统和运行时。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/system/Capabilities.ts
     */
    export class Capabilities {

        /**
         * @private
         */
        static $language:string = "zh-CN";
        /**
         * @language en_US
         * Specifies the language code of the system on which the content is running. The language is specified as a lowercase
         * two-letter language code from ISO 639-1. For Chinese, an additional uppercase two-letter country code from ISO 3166
         * distinguishes between Simplified and Traditional Chinese.<br/>
         * The following table lists the possible values,but not limited to them:
         * <ul>
         * <li>Simplified    Chinese  zh-CN</li>
         * <li>Traditional   Chinese  zh-TW</li>
         * <li>English       en</li>
         * <li>Japanese      ja</li>
         * <li>Korean        ko</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示运行内容的系统的语言代码。语言指定为 ISO 639-1 中的小写双字母语言代码。
         * 对于中文，另外使用 ISO 3166 中的大写双字母国家/地区代码，以区分简体中文和繁体中文。<br/>
         * 以下是可能但不限于的语言和值：
         * <ul>
         * <li>简体中文  zh-CN</li>
         * <li>繁体中文  zh-TW</li>
         * <li>英语      en</li>
         * <li>日语      ja</li>
         * <li>韩语      ko</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static get language():string {
            return Capabilities.$language;
        }

        /**
         * @private
         */
        static $isMobile:boolean;

        /**
         * @language en_US
         * Specifies whether the system is running in a mobile device.(such as a mobile phone or tablet)
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 表示程序内容是否运行在移动设备中（例如移动电话或平板电脑）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static get isMobile():boolean {
            return Capabilities.$isMobile;
        }

        /**
         * @private
         */
        static $os:string = "Unknown";

        /**
         * @language en_US
         * Specifies the current operating system. The os property can return the following strings:
         * <ul>
         * <li>iPhone            "iOS"</li>
         * <li>Android Phone     "Android"</li>
         * <li>Windows Phone     "Windows Phone"</li>
         * <li>Windows Desktop   "Windows PC"</li>
         * <li>Mac Desktop       "Mac OS"</li>
         * <li>Unknown OS        "Unknown"</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示当前的操作系统。os 属性返回下列字符串：
         * <ul>
         * <li>苹果手机操作系统     "iOS"</li>
         * <li>安卓手机操作系统     "Android"</li>
         * <li>微软手机操作系统     "Windows Phone"</li>
         * <li>微软桌面操作系统     "Windows PC"</li>
         * <li>苹果桌面操作系统     "Mac OS"</li>
         * <li>未知操作系统        "Unknown"</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static get os():string {
            return Capabilities.$os;
        }

        /**
         * @private
         */
        static $runtimeType:string = "Unknown";

        /**
         * @language en_US
         * It indicates the current type of operation. runtimeType property returns the following string:
         * <ul>
         * <li>Run on Web     egret.RuntimeType.WEB</li>
         * <li>Run on Native     egret.RuntimeType.NATIVE</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示当前的运行类型。runtimeType 属性返回下列字符串：
         * <ul>
         * <li>运行在Web上     egret.RuntimeType.WEB</li>
         * <li>运行在Native上     egret.RuntimeType.NATIVE</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static get runtimeType():string {
            return Capabilities.$runtimeType;
        }

        /***
         * @language en_US
         * version of the native support
         * @type {string}
         * @version Egret 2.5
         * @platform Web,Native
         */
        /***
         * @language zh_CN
         * native support 的版本号
         * @type {string}
         * @version Egret 2.5
         * @platform Web,Native
         */
        public static supportVersion:string = "Unknown";

        /**
         * 设置系统信息
         */
        public static $setNativeCapabilities(value:string):void {
            var arr = value.split("-");
            if (arr.length <= 4) {
                //todo 未来去掉数量判断，2.5.4版本之前的参数大于4个
                var osType:string = arr[0];
                switch (osType) {
                    case "android":
                        osType = "Android";
                        break;
                    case "ios":
                        osType = 'iOS';
                        break;
                }
                Capabilities.$os = osType;
                var version = arr[2].substring(1,arr[2].length);
                Capabilities.supportVersion = version;
            }
        }
    }

    if (DEBUG) {
        egret.$markReadOnly(Capabilities, "language", false);
        egret.$markReadOnly(Capabilities, "isMobile", false);
        egret.$markReadOnly(Capabilities, "os", false);
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

egret.Capabilities.$isMobile = testDeviceType();
egret.Capabilities.$runtimeType = testRuntimeType() ? egret.RuntimeType.WEB : egret.RuntimeType.NATIVE;

