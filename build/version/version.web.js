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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var __define = this.__define || function (o, p, g, s) { 
  Object.defineProperty(o, p, { configurable:true, enumerable:true, get:g,set:s }) };
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var Html5VersionController = (function (_super) {
            __extends(Html5VersionController, _super);
            function Html5VersionController(stage) {
                _super.call(this);
                this._versionInfo = {};
            }
            var d = __define,c=Html5VersionController;p=c.prototype;
            p.fetchVersion = function () {
                var self = this;
                //var virtualUrl:string = "all.manifest";
                //
                //var httpLoader:egret.HttpRequest = new egret.HttpRequest();
                //httpLoader.addEventListener(egret.Event.COMPLETE, onLoadComplete, this);
                //httpLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
                //
                //httpLoader.open(virtualUrl, "get");
                //httpLoader.send();
                //
                //function onError(event:egret.IOErrorEvent) {
                //    removeListeners();
                //    self.dispatchEvent(event);
                //}
                //
                //function onLoadComplete() {
                //    removeListeners();
                //
                //    self._versionInfo = JSON.parse(httpLoader.response);
                //
                //    window.setTimeout(function () {
                self.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
                //    }, 0);
                //}
                //
                //function removeListeners():void {
                //    httpLoader.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                //    httpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
                //}
            };
            /**
             * 获取所有有变化的文件
             * @returns {Array<any>}
             */
            p.getChangeList = function () {
                return [];
            };
            p.getVirtualUrl = function (url) {
                if (this._versionInfo && this._versionInfo[url]) {
                    return "resource/" + this._versionInfo[url]["v"].substring(0, 2) + "/" + this._versionInfo[url]["v"] + "_" + this._versionInfo[url]["s"];
                }
                else {
                    return url;
                }
            };
            return Html5VersionController;
        })(egret.EventDispatcher);
        web.Html5VersionController = Html5VersionController;
        egret.registerClass(Html5VersionController,"egret.web.Html5VersionController",["egret.VersionController","egret.IVersionController","egret.IEventDispatcher"]);
        if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
            egret.VersionController = Html5VersionController;
        }
    })(web = egret.web || (egret.web = {}));
})(egret || (egret = {}));
