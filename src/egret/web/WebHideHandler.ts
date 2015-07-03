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
    export class WebHideHandler extends HashObject {
        /**
         * @private
         */
        private stage:egret.Stage;
        /**
         * @private
         */
        constructor(stage:egret.Stage) {
            super();
            this.stage = stage;

            this.registerListener();
        }

        /**
         * @private
         */
        private isActivate:boolean = true;
        /**
         * @private
         * 
         */
        private registerListener():void {
            var self = this;
            //失去焦点
            var onBlurHandler = function () {
                if (!self.isActivate) {
                    return;
                }
                self.isActivate = false;
                self.stage.dispatchEvent(new Event(Event.DEACTIVATE));
            };
            //激活
            var onFocusHandler = function () {
                if (self.isActivate) {
                    return;
                }
                self.isActivate = true;

                self.stage.dispatchEvent(new Event(Event.ACTIVATE));
            };

            var handleVisibilityChange = function () {
                if (!document[hidden]) {
                    onFocusHandler();
                }
                else {
                    onBlurHandler();
                }
            };

            window.addEventListener("focus", onFocusHandler, false);
            window.addEventListener("blur", onBlurHandler, false);

            var hidden, visibilityChange;
            if (typeof document.hidden !== "undefined") {
                hidden = "hidden";
                visibilityChange = "visibilitychange";
            } else if (typeof document["mozHidden"] !== "undefined") {
                hidden = "mozHidden";
                visibilityChange = "mozvisibilitychange";
            } else if (typeof document["msHidden"] !== "undefined") {
                hidden = "msHidden";
                visibilityChange = "msvisibilitychange";
            } else if (typeof document["webkitHidden"] !== "undefined") {
                hidden = "webkitHidden";
                visibilityChange = "webkitvisibilitychange";
            } else if (typeof document["oHidden"] !== "undefined") {
                hidden = "oHidden";
                visibilityChange = "ovisibilitychange";
            }
            if ("onpageshow" in window && "onpagehide" in window) {
                window.addEventListener("pageshow", onFocusHandler, false);
                window.addEventListener("pagehide", onBlurHandler, false);
            }
            if (hidden && visibilityChange) {
                document.addEventListener(visibilityChange, handleVisibilityChange, false);
            }

            var ua = navigator.userAgent;
            var isWX = /micromessenger/gi.test(ua);
            var isQQBrowser = /mqq/ig.test(ua);
            var isQQ = /mobile.*qq/gi.test(ua);

            if (isQQ || isWX) {
                isQQBrowser = false;
            }
            if(isQQBrowser)
            {
                var browser = window["browser"] || {};
                browser.execWebFn =  browser.execWebFn || {};
                browser.execWebFn.postX5GamePlayerMessage = function(event){
                    var eventType = event.type;
                    if (eventType == "app_enter_background"){
                        onBlurHandler();
                    }
                    else if (eventType == "app_enter_foreground"){
                        onFocusHandler();
                    }
                };
                window["browser"] = browser;
            }
        }
    }
}