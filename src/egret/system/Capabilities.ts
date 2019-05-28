//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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

namespace egret {

    /**
     * Type of operation.
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 运行类型的类型。
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    export namespace RuntimeType {
        /**
         * Running on Web
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 运行在Web上
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        export const WEB = "web";

        /**
         * Running on NATIVE
         * @version Egret 2.4
         * @deprecated
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 运行在NATIVE上
         * @version Egret 2.4
         * @deprecated
         * @platform Web,Native
         * @language zh_CN
         */
        export const NATIVE = "native";

        /**
         * Running on Runtime2.0
         * @version Egret 5.1.5
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 运行在Runtime2.0上
         * @version Egret 5.1.5
         * @platform Web,Native
         * @language zh_CN
         */
        export const RUNTIME2 = "runtime2";

        /**
         * Running on WeChat mini game
         * @version Egret 5.1.5
         * @platform All
         * @language en_US
         */
        /**
         * 运行在微信小游戏上
         * @version Egret 5.1.5
         * @platform All
         * @language zh_CN
         */
        export const WXGAME = "wxgame";

        /**
         * Running on Baidu mini game
         * @version Egret 5.2.13
         * @platform All
         * @language en_US
         */
        /**
         * 运行在百度小游戏上
         * @version Egret 5.2.13
         * @platform All
         * @language zh_CN
         */
        export const BAIDUGAME = "baidugame";
        /**
         * Running on Xiaomi quick game
         * @version Egret 5.2.14
         * @platform All
         * @language en_US
         */
        /**
         * 运行在小米快游戏上
         * @version Egret 5.2.14
         * @platform All
         * @language zh_CN
         */
        export const QGAME = "qgame";
        /**
         * 运行在 Oppo 小游戏上
         * @version Egret 5.2.14
         * @platform All
         * @language zh_CN
         */
        export const OPPOGAME = "oppogame";

    }

    export interface SupportedCompressedTexture {
        pvrtc: boolean;
        etc1: boolean;
    }

    /**
     * The Capabilities class provides properties that describe the system and runtime that are hosting the application.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/system/Capabilities.ts
     * @language en_US
     */
    /**
     * Capabilities 类提供一些属性，这些属性描述了承载应用程序的系统和运行时。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/system/Capabilities.ts
     * @language zh_CN
     */
    export class Capabilities {
        /**
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
         * @language en_US
         */
        /**
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
         * @language zh_CN
         */
        static readonly language: string = "zh-CN";

        /**
         * Specifies whether the system is running in a mobile device.(such as a mobile phone or tablet)
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 表示程序内容是否运行在移动设备中（例如移动电话或平板电脑）。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static readonly isMobile: boolean;

        /**
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
         * @language en_US
         */
        /**
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
         * @language zh_CN
         */
        static readonly os: string = "Unknown";

        /**
         * It indicates the current type of operation. runtimeType property returns the following string:
         * <ul>
         * <li>Run on Web     egret.RuntimeType.WEB</li>
         * <li>Run on Runtime2.0     egret.RuntimeType.RUNTIME2</li>
         * <li>Run on WeChat mini game     egret.RuntimeType.WXGAME</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 指示当前的运行类型。runtimeType 属性返回下列字符串：
         * <ul>
         * <li>运行在Web上     egret.RuntimeType.WEB</li>
         * <li>运行在Runtime2.0上     egret.RuntimeType.RUNTIME2</li>
         * <li>运行在微信小游戏上    egret.RuntimeType.WXGAME</li>
         * </ul>
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        static readonly runtimeType: string = egret.RuntimeType.WEB;

        /***
         * version of Egret.
         * @type {string}
         * @version Egret 3.2.0
         * @platform Web,Native
         * @language en_US
         */
        /***
         * Egret 的版本号。
         * @type {string}
         * @version Egret 3.2.0
         * @platform Web,Native
         * @language zh_CN
         */
        public static readonly engineVersion: string = "5.2.20";

        /***
         * current render mode.
         * @type {string}
         * @version Egret 3.0.7
         * @platform Web,Native
         * @language en_US
         */
        /***
         * 当前渲染模式。
         * @type {string}
         * @version Egret 3.0.7
         * @platform Web,Native
         * @language zh_CN
         */
        static readonly renderMode: string = "Unknown";

        /***
         * Clients border width.
         * The value before the document class initialization is always 0.
         * This value will change after the distribution Event.RESIZE and StageOrientationEvent.ORIENTATION_CHANGE.
         * @version Egret 3.1.3
         * @platform Web,Native
         * @language en_US
         */
        /***
         * 客户端边界宽度。
         * 该值在文档类初始化之前始终是0。
         * 该值在派发 Event.RESIZE 以及 StageOrientationEvent.ORIENTATION_CHANGE 之后会发生改变。
         * @version Egret 3.1.3
         * @platform Web,Native
         * @language zh_CN
         */
        static readonly boundingClientWidth: number = 0;

        /***
         * Clients border height.
         * The value before the document class initialization is always 0.
         * This value will change after the distribution Event.RESIZE and StageOrientationEvent.ORIENTATION_CHANGE.
         * @version Egret 3.1.3
         * @platform Web,Native
         * @language en_US
         */
        /***
         * 客户端边界高度。
         * 该值在文档类初始化之前始终是0。
         * 该值在派发 Event.RESIZE 以及 StageOrientationEvent.ORIENTATION_CHANGE 之后会发生改变。
         * @version Egret 3.1.3
         * @platform Web,Native
         * @language zh_CN
         */
        static readonly boundingClientHeight: number = 0;

        /***
         * supported compressed texture
         * @version Egret 5.2.19
         * @platform Web,Native
         * @language en_US
         */
        /***
         * supported compressed texture
         * @version Egret 5.2.19
         * @platform Web,Native
         * @language zh_CN
         */
        static supportedCompressedTexture: SupportedCompressedTexture;
    }
}
