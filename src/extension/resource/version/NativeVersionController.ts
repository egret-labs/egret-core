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

module RES.native {

    /**
     * @private
     */
    export class NativeVersionController implements VersionController {

        private _versionInfo:Object = {};
        private _versionPath:string = "";

        private _localFileArr:Array<string> = [];

        constructor() {
        }

        public fetchVersion(callback:egret.AsyncCallback):void {
            if(DEBUG) {
                callback.onSuccess(null);
                return;
            }
            var self = this;
            self._versionPath = "all.manifest";

            self._versionInfo = self.getLocalData(self._versionPath);
            if (self._versionInfo == null) {
                egret.callLater(function() {
                    callback.onFail(1,null);
                }, self);
                return;
            }
            var count = 0;
            var loadOver = function (paths:Array<string>) {
                if (paths) {
                    for (var i = 0; i < paths.length; i++) {
                        if (paths[i] && paths[i] != "") {
                            self._localFileArr.push("resource/" + paths[i]);
                        }
                    }
                }
                count++;

                if (count == 2) {
                    callback.onSuccess(null);
                }
            };
            self.getList(loadOver, "assets", "resource");
            self.getList(loadOver, "update", "resource");
        }

        private getList(callback:Function, type:string, root:string = ""):void {
            var promise = egret.PromiseObject.create();
            promise.onSuccessFunc = function(paths) {
                callback(paths);
            };
            promise.onErrorFunc = function() {
                console.error("list files error");
            };
            if (type == "assets") {
                egret_native.Game.listResource(root, promise);
            }
            else {
                egret_native.Game.listUpdate(root, promise);
            }
        }

        /**
         * 获取所有有变化的文件
         * @returns {Array<any>}
         */
        public getChangeList():Array<{url:string; size:number}> {
            var temp:Array<any> = [];

            var localFileArr = this._localFileArr;
            for (var key in this._versionInfo) {
                if (localFileArr.indexOf(this.getVirtualUrl(key)) < 0) {
                    temp.push({"url":this.getVirtualUrl(key), "size":this._versionInfo[key]["s"]});
                }
            }

            return temp;
        }

        public getVirtualUrl(url:string):string {
            if (DEBUG) {
                return url;
            }
            if (this._versionInfo && this._versionInfo[url]) {
                return "resource/" + this._versionInfo[url]["v"].substring(0, 2) + "/" + this._versionInfo[url]["v"] + "_" + this._versionInfo[url]["s"] + "." + url.substring(url.lastIndexOf(".") + 1);
            }
            else {
                return url;
            }
        }

        private getLocalData(filePath):Object {
            if (egret_native.readUpdateFileSync && egret_native.readResourceFileSync) {
                //先取更新目录
                var content:string = egret_native.readUpdateFileSync(filePath);
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
        }
    }

    if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
        VersionController = NativeVersionController;
    }
}
