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


module egret{
    /**
     * 这个类是HTML5的WebWrapper的第一个版本
     */
    export class Browser extends HashObject{

        private static instance:Browser;
        private pfx:string;
        private type:string;
        private trans:string;
        private ua;
        private isHD:boolean;

        public static getInstance():Browser {
            if (Browser.instance == null) {
                Browser.instance = new Browser();
            }
            return Browser.instance;
        }

        /**
         * @deprecated
         * @returns {boolean}
         */
        public get isMobile():boolean{
            Logger.warning("Browser.isMobile接口参数已经变更，请尽快调整用法为 egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE ")
            return egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE;
        }

        constructor() {
            super();
            this.ua = navigator.userAgent.toLowerCase();
            var browserTypes = this.ua.match(/micromessenger|qqbrowser|mqqbrowser|ucbrowser|360browser|baidubrowser|maxthon|ie|opera|firefox/) || this.ua.match(/chrome|safari/);
            if (browserTypes && browserTypes.length > 0) {
                var el = browserTypes[0];
                if (el == 'micromessenger') {
                    this.type = 'wechat';
                }
                this.type = el;
            }
            this.type = "unknow";
            switch (this.type) {
                case "firefox":
                    this.pfx = "Moz";
                    this.isHD = true;
                    break;
                case "chrome":
                case "safari":
                    this.pfx = "webkit";
                    this.isHD = true;
                    break;
                case "opera":
                    this.pfx = "O";
                    this.isHD = false;
                    break;
                case "ie":
                    this.pfx = "ms";
                    this.isHD = false;
                    break;
                default:
                    this.pfx = "webkit";
                    this.isHD = true;
            }
            this.trans = this.pfx + "Transform";
        }

        public $new(x) {
            return this.$(document.createElement(x));
        }

        public $(x) {
            var parent = document;
            var el = (x instanceof HTMLElement) ? x : parent.querySelector(x);
            if (el) {
                el.find = el.find || this.$;
                el.hasClass = el.hasClass || function (cls) {
                    return this.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
                };
                el.addClass = el.addClass || function (cls) {
                    if (!this.hasClass(cls)) {
                        if (this.className) {
                            this.className += " ";
                        }
                        this.className += cls;
                    }
                    return this;
                };
                el.removeClass = el.removeClass || function (cls) {
                    if (this.hasClass(cls)) {
                        this.className = this.className.replace(cls, '');
                    }
                    return this;
                };
                el.remove = el.remove || function () {
//                    if (this.parentNode)
//                        this.parentNode.removeChild(this);
//                        return this;
                };
                el.appendTo = el.appendTo || function (x) {
                    x.appendChild(this);
                    return this;
                };
                el.prependTo = el.prependTo || function (x) {
                    ( x.childNodes[0]) ? x.insertBefore(<Node>this, x.childNodes[0]) : x.appendChild(this);
                    return this;
                };
                el.transforms = el.transforms || function () {
                    this.style[Browser.getInstance().trans] = Browser.getInstance().translate(this.position) + Browser.getInstance().rotate(this.rotation) +
                        Browser.getInstance().scale(this.scale) + Browser.getInstance().skew(this.skew);
                    return this;
                };

                el.position = el.position || {x: 0, y: 0};
                el.rotation = el.rotation || 0;
                el.scale = el.scale || {x: 1, y: 1};
                el.skew = el.skew || {x: 0, y: 0};

                el.translates = function (x, y) {
                    this.position.x = x;
                    this.position.y = y - MainContext.instance.stage.stageHeight;
                    this.transforms();
                    return this
                };

                el.rotate = function (x) {
                    this.rotation = x;
                    this.transforms();
                    return this
                };

                el.resize = function (x, y) {
                    this.scale.x = x;
                    this.scale.y = y;
                    this.transforms();
                    return this
                };

                el.setSkew = function (x, y) {
                    this.skew.x = x;
                    this.skew.y = y;
                    this.transforms();
                    return this
                };
            }
            return el;
        }

        public translate = (this.isHD) ? function (a) {
            return "translate3d(" + a.x + "px, " + (a.y - MainContext.instance.stage.stageHeight) + "px, 0) "
        } : function (a) {
            return "translate(" + a.x + "px, " + a.y + "px) "
        };

        public rotate = (this.isHD) ? function (a) {
            return "rotateZ(" + a + "deg) ";
        } : function (a) {
            return "rotate(" + a + "deg) ";
        };

        public scale(a) {
            return "scale(" + a.x + ", " + a.y + ") "
        }

        public skew(a) {
            return "skewX(" + -a.x + "deg) skewY(" + a.y + "deg)";
        }
    }
}