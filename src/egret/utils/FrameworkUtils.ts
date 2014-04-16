/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../core/MainContext.ts"/>

module ns_egret{
    /**
     * 这个类是HTML5的WebWrapper的第一个版本
     * @stable C 目前只是实现需求，大部分API需要考虑重新设计
     */
    export class Browser {

        private static instance:Browser;
        private pfx:string;
        private type:string;
        private trans:string;
        private ua;
        private isHD:Boolean;
        public isMobile:Boolean;

        public static getInstance():Browser {
            if (Browser.instance == null) {
                Browser.instance = new Browser();
            }
            return Browser.instance;
        }

        constructor() {
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
            this.isMobile = (this.ua.indexOf('mobile') != -1 || this.ua.indexOf('android') != -1);
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
            console.log("translate(" + a.x + "px, " + a.y + "px) ");
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