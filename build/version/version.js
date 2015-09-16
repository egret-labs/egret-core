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
var __define = this.__define || function (o, p, g, s) { 
  Object.defineProperty(o, p, { configurable:true, enumerable:true, get:g,set:s }) };
var egret;
(function (egret) {
    /**
     * @version Egret 2.4
     * @platform Web,Native
     */
    egret.VersionController;
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var native;
    (function (native) {
        /**
         * @private
         */
        var NativeVersionController = (function (_super) {
            __extends(NativeVersionController, _super);
            function NativeVersionController() {
                _super.call(this);
                this._versionInfo = {};
                this._versionPath = "";
                this._localFileArr = [];
            }
            var d = __define,c=NativeVersionController;p=c.prototype;
            p.fetchVersion = function () {
                var self = this;
                self._versionPath = "all.manifest";
                self._versionInfo = self.getLocalData(self._versionPath);
                if (self._versionInfo == null) {
                    egret.callLater(function () {
                        self.dispatchEvent(new egret.IOErrorEvent(egret.IOErrorEvent.IO_ERROR));
                    }, self);
                    return;
                }
                var count = 0;
                var loadOver = function (paths) {
                    if (paths) {
                        for (var i = 0; i < paths.length; i++) {
                            if (paths[i] && paths[i] != "") {
                                self._localFileArr.push("resource/" + paths[i]);
                            }
                        }
                    }
                    count++;
                    if (count == 2) {
                        self.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
                    }
                };
                self.getList(loadOver, "assets", "resource");
                self.getList(loadOver, "update", "resource");
            };
            p.getList = function (callback, type, root) {
                if (root === void 0) { root = ""; }
                var promise = egret.PromiseObject.create();
                promise.onSuccessFunc = function (paths) {
                    callback(paths);
                };
                promise.onErrorFunc = function () {
                    console.error("list files error");
                };
                if (type == "assets") {
                    egret_native.Game.listResource(root, promise);
                }
                else {
                    egret_native.Game.listUpdate(root, promise);
                }
            };
            /**
             * 获取所有有变化的文件
             * @returns {Array<any>}
             */
            p.getChangeList = function () {
                var temp = [];
                var localFileArr = this._localFileArr;
                for (var key in this._versionInfo) {
                    if (localFileArr.indexOf(this.getVirtualUrl(key)) < 0) {
                        temp.push({ "url": this.getVirtualUrl(key), "size": this._versionInfo[key]["s"] });
                    }
                }
                return temp;
            };
            p.getVirtualUrl = function (url) {
                if (DEBUG) {
                    return url;
                }
                if (this._versionInfo && this._versionInfo[url]) {
                    return "resource/" + this._versionInfo[url]["v"].substring(0, 2) + "/" + this._versionInfo[url]["v"] + "_" + this._versionInfo[url]["s"];
                }
                else {
                    return url;
                }
            };
            p.getLocalData = function (filePath) {
                if (egret_native.readUpdateFileSync && egret_native.readResourceFileSync) {
                    //先取更新目录
                    var content = egret_native.readUpdateFileSync(filePath);
                    if (content != null) {
                        return JSON.parse(content);
                    }
                    //再取资源目录
                    content = egret_native.readResourceFileSync(filePath);
                    if (content != null) {
                        return JSON.parse(content);
                    }
                }
                return null;
            };
            return NativeVersionController;
        })(egret.EventDispatcher);
        native.NativeVersionController = NativeVersionController;
        egret.registerClass(NativeVersionController,"egret.native.NativeVersionController",["egret.VersionController","egret.IVersionController","egret.IEventDispatcher"]);
        if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
            egret.VersionController = NativeVersionController;
        }
    })(native = egret.native || (egret.native = {}));
})(egret || (egret = {}));
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
var egret;
(function (egret) {
    var web;
    (function (web) {
        /**
         * @private
         */
        var Html5VersionController = (function (_super) {
            __extends(Html5VersionController, _super);
            function Html5VersionController() {
                _super.call(this);
                this._versionInfo = {};
            }
            var d = __define,c=Html5VersionController;p=c.prototype;
            p.fetchVersion = function () {
                var self = this;
                var virtualUrl = "all.manifest";
                var httpLoader = new egret.HttpRequest();
                httpLoader.addEventListener(egret.Event.COMPLETE, onLoadComplete, this);
                httpLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
                httpLoader.open(virtualUrl + "?r=" + Date.now(), "get");
                httpLoader.send();
                function onError(event) {
                    removeListeners();
                    self.dispatchEvent(event);
                }
                function onLoadComplete() {
                    removeListeners();
                    self._versionInfo = JSON.parse(httpLoader.response);
                    window.setTimeout(function () {
                        self.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
                    }, 0);
                }
                function removeListeners() {
                    httpLoader.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                    httpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
                }
            };
            /**
             * 获取所有有变化的文件
             * @returns {Array<any>}
             */
            p.getChangeList = function () {
                return [];
            };
            p.getVirtualUrl = function (url) {
                if (DEBUG) {
                    return url;
                }
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
