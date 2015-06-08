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
    export class AudioType {
        static QQ_AUDIO:number = 1;
        static WEB_AUDIO:number = 2;
        static HTML5_AUDIO:number = 3;
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
        public static _AudioClass;


        public static _QQRootPath:string = "";

        constructor() {
            super();
        }

        private static ua:string = "";

        public static _init():void {
            var ua:string = navigator.userAgent.toLowerCase();
            Html5Capatibility.ua = ua;

            Html5Capatibility._canUseBlob = false;

            Html5Capatibility._audioType = AudioType.HTML5_AUDIO;
            Html5Capatibility._AudioClass = egret.Html5Audio;

            if (ua.indexOf("windows") >= 0) {//wphone windows

            }
            else if (ua.indexOf("android") >= 0) {//android
                if (window.hasOwnProperty("QZAppExternal") && ua.indexOf("qzone") >= 0) {
                    Html5Capatibility._AudioClass = egret.QQAudio;
                    Html5Capatibility._audioType = AudioType.QQ_AUDIO;

                    var bases = document.getElementsByTagName('base');
                    if (bases && bases.length > 0) {
                        Html5Capatibility._QQRootPath = bases[0].baseURI;
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
                if (Html5Capatibility.getIOSVersion() >= 7) {
                    Html5Capatibility._canUseBlob = true;
                }
                Html5Capatibility._AudioClass = egret.WebAudio;
                Html5Capatibility._audioType = AudioType.WEB_AUDIO;
            }

            var winURL = window["URL"] || window["webkitURL"];
            if (!winURL) {
                Html5Capatibility._canUseBlob = false;
            }


            var canUseWebAudio = window["AudioContext"] || window["webkitAudioContext"] || window["mozAudioContext"];
            if (!canUseWebAudio && Html5Capatibility._audioType == AudioType.WEB_AUDIO) {
                Html5Capatibility._audioType = AudioType.HTML5_AUDIO;
                Html5Capatibility._AudioClass = egret.Html5Audio;
            }
        }

        /**
         * 获取ios版本
         * @returns {string}
         */
        private static getIOSVersion():number {
            var value = Html5Capatibility.ua.toLowerCase().match(/cpu [^\d]*\d.*like mac os x/)[0];
            return parseInt(value.match(/\d(_\d)*/)[0]) || 0;
        }
    }

    Html5Capatibility._init();
}