/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {


    /**
     * @class egret.HTML5DeviceContext
     * @classdesc
     * @extends egret.DeviceContext
     */
    export class HTML5DeviceContext extends DeviceContext {


        private _time:number = 0;

        private static instance:HTML5DeviceContext;

        /**
         * @method egret.HTML5DeviceContext#constructor
         */
        public constructor(public frameRate:number = 60) {
            super();
            if (frameRate == 60) {
                HTML5DeviceContext.requestAnimationFrame = window["requestAnimationFrame"] ||
                    window["webkitRequestAnimationFrame"] ||
                    window["mozRequestAnimationFrame"] ||
                    window["oRequestAnimationFrame"] ||
                    window["msRequestAnimationFrame"];

                HTML5DeviceContext.cancelAnimationFrame = window["cancelAnimationFrame"] ||
                    window["msCancelAnimationFrame"] ||
                    window["mozCancelAnimationFrame"] ||
                    window["webkitCancelAnimationFrame"] ||
                    window["oCancelAnimationFrame"] ||
                    window["cancelRequestAnimationFrame"] ||
                    window["msCancelRequestAnimationFrame"] ||
                    window["mozCancelRequestAnimationFrame"] ||
                    window["oCancelRequestAnimationFrame"] ||
                    window["webkitCancelRequestAnimationFrame"];

            }
            if (!HTML5DeviceContext.requestAnimationFrame) {
                HTML5DeviceContext.requestAnimationFrame = function (callback) {
                    return window.setTimeout(callback, 1000 / frameRate);
                };
            }

            if (!HTML5DeviceContext.cancelAnimationFrame) {
                HTML5DeviceContext.cancelAnimationFrame = function (id) {
                    return window.clearTimeout(id);
                };
            }


            HTML5DeviceContext.instance = this;
            this.registerListener();
        }

        static requestAnimationFrame:Function;

        static cancelAnimationFrame:Function;

        static _thisObject:any;

        static _callback:Function;

        private _requestAnimationId:number;


        private enterFrame():void {
            var context = HTML5DeviceContext.instance;
            var thisObject = HTML5DeviceContext._thisObject;
            var callback = HTML5DeviceContext._callback
            var thisTime = egret.getTimer();
            var advancedTime = thisTime - context._time;
            context._requestAnimationId = HTML5DeviceContext.requestAnimationFrame.call(window, HTML5DeviceContext.prototype.enterFrame);
            callback.call(thisObject, advancedTime);
            context._time = thisTime;

        }


        /**
         * @method egret.HTML5DeviceContext#executeMainLoop
         * @param callback {Function}
         * @param thisObject {any}
         */
        public executeMainLoop(callback:Function, thisObject:any):void {
            HTML5DeviceContext._callback = callback;
            HTML5DeviceContext._thisObject = thisObject;
            this.enterFrame();
        }

        private reset():void {
            var context = HTML5DeviceContext.instance;
            if (context._requestAnimationId) {
                context._time = egret.getTimer();
                HTML5DeviceContext.cancelAnimationFrame.call(window, context._requestAnimationId);
                context.enterFrame();
            }
        }

        private registerListener():void {

            var onFocusHandler = function () {
                var context = HTML5DeviceContext.instance;
                context.reset();
            }

            var handleVisibilityChange = function () {
                if (!document[hidden]) {
                    onFocusHandler();
                }
            }

            window.onfocus = onFocusHandler
            window.onblur = function () {
            };


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
            }
            if ("onpageshow" in window && "onpagehide" in window) {
                window.addEventListener("pageshow", onFocusHandler, false);
//                window.addEventListener("pagehide", handleBlur, false);
            }
            if (hidden && visibilityChange) {
                document.addEventListener(visibilityChange, handleVisibilityChange, false);
            }
        }
    }

}

module egret_html5_localStorage {
    //todo 有可能没有window.localStorage对象
    export function getItem(key:string):string {
        return window.localStorage.getItem(key);
    }

    export function setItem(key:string, value:string):void {
        window.localStorage.setItem(key, value);
    }

    export function removeItem(key:string):void {
        window.localStorage.removeItem(key);
    }

    export function clear():void {
        window.localStorage.clear();
    }

    export function init():void {
        for (var key in egret_html5_localStorage) {
            egret.localStorage[key] = egret_html5_localStorage[key];
        }
    }
}

egret_html5_localStorage.init();