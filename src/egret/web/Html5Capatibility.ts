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

module egret.web {

    /**
     * @private
     */
    export class AudioType {
        /**
         * @private
         */
        static QQ_AUDIO:number = 1;
        /**
         * @private
         */
        static WEB_AUDIO:number = 2;
        /**
         * @private
         */
        static HTML5_AUDIO:number = 3;
    }

    /**
     * @private
     */
    export class SystemOSType {
        /**
         * @private
         */
        static WPHONE:number = 1;
        /**
         * @private
         */
        static IOS:number = 2;
        /**
         * @private
         */
        static ADNROID:number = 3;
    }

    /**
     * html5兼容性配置
     * @private
     */
    export class Html5Capatibility extends HashObject {
        //当前浏览器版本是否支持blob
        public static _canUseBlob:boolean = false;

        //当前浏览器版本是否支持webaudio
        public static _audioType:number = 0;
        /**
         * @private
         */
        public static _AudioClass;

        public static _audioMustLoad:boolean = false;

        /**
         * @private
         */
        public static _QQRootPath:string = "";

        /**
         * @private
         */
        public static _System_OS:number = 0;
        /**
         * @private
         */
        constructor() {
            super();
        }

        /**
         * @private
         */
        private static ua:string = "";

        /**
         * @private
         * 
         */
        public static _init():void {
            var ua:string = navigator.userAgent.toLowerCase();
            Html5Capatibility.ua = ua;

            egret.Capabilities.$isMobile = (ua.indexOf('mobile') != -1 || ua.indexOf('android') != -1);


            Html5Capatibility._canUseBlob = false;

            Html5Capatibility._audioType = AudioType.HTML5_AUDIO;
            Html5Capatibility._AudioClass = egret.web.HtmlSound;
            Html5Capatibility._audioMustLoad = true;


            if (ua.indexOf("windows phone") >= 0) {//wphone windows
                Html5Capatibility._System_OS = SystemOSType.WPHONE;
                Html5Capatibility._audioMustLoad = false;

                egret.Capabilities.$os = "Windows Phone";
            }
            else if (ua.indexOf("android") >= 0) {//android
                Html5Capatibility._System_OS = SystemOSType.ADNROID;
                if (ua.indexOf("ucbrowser") >= 0) {
                    Html5Capatibility._audioMustLoad = false;
                }
                
                egret.Capabilities.$os = "Android";

                Html5Capatibility._System_OS = SystemOSType.ADNROID;
                if (window.hasOwnProperty("QZAppExternal") && ua.indexOf("qzone") >= 0) {
                    Html5Capatibility._audioType = AudioType.QQ_AUDIO;
                    Html5Capatibility._AudioClass = egret.web.QQSound;

                    var bases = document.getElementsByTagName('base');
                    if (bases && bases.length > 0) {
                        Html5Capatibility._QQRootPath = bases[0]["baseURI"];
                    }
                    else {
                        var endIdx = window.location.href.indexOf("?");
                        if (endIdx == -1) {
                            endIdx = window.location.href.length;
                        }
                        var url = window.location.href.substring(0, endIdx);
                        url = url.substring(0, url.lastIndexOf("/"));

                        Html5Capatibility._QQRootPath = url + "/";
                    }
                }
            }
            else if (ua.indexOf("iphone") >= 0 || ua.indexOf("ipad") >= 0 || ua.indexOf("ipod") >= 0) {//ios
                egret.Capabilities.$os = "iOS";

                Html5Capatibility._System_OS = SystemOSType.IOS;
                if (Html5Capatibility.getIOSVersion() >= 7) {
                    Html5Capatibility._canUseBlob = true;

                    Html5Capatibility._AudioClass = egret.web.WebAudioSound;
                    Html5Capatibility._audioType = AudioType.WEB_AUDIO;
                }
            }
            else{
                if(ua.indexOf("windows nt")!= -1){
                    egret.Capabilities.$os = "Windows PC";
                }
                else if(ua.indexOf("mac os")!= -1){
                    egret.Capabilities.$os = "Mac OS";
                }
            }

            var winURL = window["URL"] || window["webkitURL"];
            if (!winURL) {
                Html5Capatibility._canUseBlob = false;
            }


            var canUseWebAudio = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
            if (!canUseWebAudio && Html5Capatibility._audioType == AudioType.WEB_AUDIO) {
                Html5Capatibility._audioType = AudioType.HTML5_AUDIO;
                Html5Capatibility._AudioClass = egret.web.HtmlSound;
            }

            egret.Sound = Html5Capatibility._AudioClass;
        }

        /**
         * @private
         * 获取ios版本
         * @returns {string}
         */
        private static getIOSVersion():number {
            var value = Html5Capatibility.ua.toLowerCase().match(/cpu [^\d]*\d.*like mac os x/)[0];
            return parseInt(value.match(/\d(_\d)*/)[0]) || 0;
        }

        /**
         * @private
         *
         */
        private static checkHtml5Support() {
            var language = (navigator.language || navigator.browserLanguage).toLowerCase();
            var strings = language.split("-");
            if (strings.length > 1) {
                strings[1] = strings[1].toUpperCase();
            }
            egret.Capabilities.$language = strings.join("-");
        }
    }

    Html5Capatibility._init();


    /**
     * @private
     */
    var currentPrefix:string = null;

    /**
     * @private
     */
    export function getPrefixStyleName(name:string, element?:any):string {
        var header:string = "";

        if (element != null) {
            header = getPrefix(name, element);
        }
        else {
            if (currentPrefix == null) {
                var tempStyle = document.createElement('div').style;
                currentPrefix = getPrefix("transform", tempStyle);
            }
            header = currentPrefix;
        }

        if (header == "") {
            return name;
        }

        return header + name.charAt(0).toUpperCase() + name.substring(1, name.length);
    }

    /**
     * @private
     */
    export function getPrefix(name:string, element:any):string {
        if (name in element) {
            return "";
        }

        name = name.charAt(0).toUpperCase() + name.substring(1, name.length);
        var transArr:Array<string> = ["webkit", "ms", "Moz", "O"];
        for (var i:number = 0; i < transArr.length; i++) {
            var tempStyle:string = transArr[i] + name;

            if (tempStyle in element) {
                return transArr[i];
            }
        }

        return "";
    }
}