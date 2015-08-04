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
     * 这个类是HTML5的WebWrapper的第一个版本
     * @private
     */
    export class Browser extends HashObject {

        private static instance:Browser;
        private trans:string = null;
        private ua:string;

        public static getInstance():Browser {
            if (Browser.instance == null) {
                Browser.instance = new Browser();
            }
            return Browser.instance;
        }

        public webPSupport:boolean = false;

        /**
         * @deprecated
         * @returns {boolean}
         */
        public get isMobile():boolean {
            $warn(1000);
            return egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE;
        }

        /**
         * 判断是否是ios
         * @returns {boolean}
         */
        public isIOS():boolean {
            return this.ua.indexOf("windows") < 0 && (this.ua.indexOf("iphone") >= 0 || this.ua.indexOf("ipad") >= 0 || this.ua.indexOf("ipod") >= 0);
        }

        /**
         * 获取ios版本
         * @returns {string}
         */
        public getIOSVersion():string {
            var value = this.ua.toLowerCase().match(/cpu [^\d]*\d.*like mac os x/)[0];
            return value.match(/\d(_\d)*/)[0];
        }

        constructor() {
            super();
            this.ua = navigator.userAgent.toLowerCase();
            this.trans = this.getTrans("transform");
        }

        public getUserAgent():string {
            return this.ua;
        }

        private header:string = null;

        /**
         * 获取当前浏览器对应style类型
         * @type {string}
         */
        public getTrans(style:string, judge:boolean = false):string {
            var header:string = "";

            if (judge) {
                header = this.getHeader(style);
            }
            else {
                if (this.header == null) {
                    this.header = this.getHeader("transform");
                }
                header = this.header;
            }

            if (header == "") {
                return style;
            }

            return header + style.charAt(0).toUpperCase() + style.substring(1, style.length);
        }

        /**
         * 获取当前浏览器的类型
         * @returns {string}
         */
        private getHeader(style:string):string {
            var divStyles = document.createElement('div').style;

            if (style in divStyles) {
                return "";
            }

            style = style.charAt(0).toUpperCase() + style.substring(1, style.length);
            var transArr:Array<string> = ["webkit", "ms", "Moz", "O"];
            for (var i:number = 0; i < transArr.length; i++) {
                var tempStyle:string = transArr[i] + style;

                if (tempStyle in divStyles) {
                    return transArr[i];
                }
            }

            return "";
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

        public translate(a):string {
            return "translate(" + a.x + "px, " + a.y + "px) "
        }

        public rotate(a):string {
            return "rotate(" + a + "deg) ";
        }

        public scale(a):string {
            return "scale(" + a.x + ", " + a.y + ") "
        }

        public skew(a):string {
            return "skewX(" + -a.x + "deg) skewY(" + a.y + "deg)";
        }

//        public translate = (this.isHD) ? function (a) {
//            return "translate3d(" + a.x + "px, " + (a.y - MainContext.instance.stage.stageHeight) + "px, 0) "
//        } : function (a) {
//            return "translate(" + a.x + "px, " + a.y + "px) "
//        };
//
//        public rotate = (this.isHD) ? function (a) {
//            return "rotateZ(" + a + "deg) ";
//        } : function (a) {
//            return "rotate(" + a + "deg) ";
//        };
//
//        public scale(a) {
//            return "scale(" + a.x + ", " + a.y + ") "
//        }
//
//        public skew(a) {
//            return "skewX(" + -a.x + "deg) skewY(" + a.y + "deg)";
//        }
    }
}