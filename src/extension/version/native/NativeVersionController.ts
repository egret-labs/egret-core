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

module egret.native {

    /**
     * @private
     */
    export class NativeVersionController extends egret.EventDispatcher implements VersionController {

        private _versionInfo:Object = {};
        private _versionPath:string = "";

        private _localFileArr:Array<string> = [];

        private _stage:egret.Stage;
        constructor(stage:egret.Stage) {
            super();
            this._stage = stage;
        }

        public fetchVersion():void {
            var self = this;
            self._versionPath = "all.manifest";

            self._versionInfo = self.getLocalData(self._versionPath);
            if (self._versionInfo == null) {
                egret.callLater(function() {
                    self.dispatchEvent(new egret.IOErrorEvent(egret.IOErrorEvent.IO_ERROR));
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
                    if (egret_native.nativeType == "native") {//native 需要使用
                        self.loadAllChange();
                    }
                    else {
                        self.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
                    }
                }
            };
            self.getList(loadOver, "assets", "resource");
            self.getList(loadOver, "update", "resource");
        }

        private getList(callback:Function, type:string, root:string = ""):void {
            var promise = PromiseObject.create();
            promise.onSuccessFunc = function(paths) {
                callback(paths);
            }
            promise.onErrorFunc = function() {
                console.error("list files error");
            }
            if (type == "assets") {
                egret_native.Game.listResource(root, promise);
            }
            else {
                egret_native.Game.listUpdate(root, promise);
            }
        }

        public checkIsNewVersion(virtualUrl:string):boolean {
            return egret_native.isFileExists(virtualUrl);
        }

        public saveVersion(virtualUrl:string):void {
        }

        /**
         * 获取所有有变化的文件
         * @returns {Array<string>}
         */
        public getChangeList():Array<string> {
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
            if (this._versionInfo && this._versionInfo[url]) {
                return "resource/" + this._versionInfo[url]["v"].substring(0, 2) + "/" + this._versionInfo[url]["v"] + "_" + this._versionInfo[url]["s"];
            }
            else {
                return url;
            }
        }

        private _iLoadingView:egret.ILoadingView;

        private loadAllChange():void {
            var self = this;
            if (self._iLoadingView == null) {
                self._iLoadingView = new egret.DefaultLoadingView();
            }

            self._stage.addChild(<egret.DisplayObject><any>(self._iLoadingView));

            var list = this.getChangeList();
            var errorList = [];
            var errorCount = 0;

            var self = this;
            var loader = new egret["NativeResourceLoader"]();
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, loadError, self);
            loader.addEventListener(egret.Event.COMPLETE, loadComplete, self);
            loader.addEventListener(egret.ProgressEvent.PROGRESS, loadProgress, self);

            var loadBytes = 0;
            var totalBytes = 0;
            for (var key in list) {
                totalBytes += list[key]["size"];
            }

            loadNext();
            function loadNext() {
                if (list.length > 0) {
                    loader.load(list[0]["url"], list[0]["size"]);
                }
                else if (errorCount > 3) {
                    //结束，加载出错
                    //End with loading error
                    loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, self);
                    loader.removeEventListener(egret.Event.COMPLETE, loadComplete, self);
                    loader.removeEventListener(egret.ProgressEvent.PROGRESS, loadProgress, self);

                    self._iLoadingView.loadError();

                    egret.IOErrorEvent.dispatchIOErrorEvent(self);
                }
                else if (errorList.length > 0) {
                    list = errorList;
                    errorList = [];
                    errorCount++;

                    loadComplete();
                }
                else {
                    //结束，加载成功
                    //End with loading successfully
                    loader.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, self);
                    loader.removeEventListener(egret.Event.COMPLETE, loadComplete, self);
                    loader.removeEventListener(egret.ProgressEvent.PROGRESS, loadProgress, self);

                    self._stage.removeChild(<egret.DisplayObject><any>(self._iLoadingView));

                    self.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
                }
            }

            function loadComplete() {
                loadBytes += parseInt(list[0]["size"]);
                list.shift();
                loadNext();
            }

            function loadProgress(e) {
                self._iLoadingView.setProgress(loadBytes + e.bytesLoaded, totalBytes);
            }

            function loadError() {
                errorList.push(list[0]);
                list.shift();
                loadComplete();
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

                return null;
            }
            else {
                return this.getLocalDataByOld(filePath);
            }
        }

        //todo 旧方式
        private getLocalDataByOld(filePath):Object {
            var data:Object = null;
            if (egret_native.isRecordExists(filePath)) {
                var str:string = egret_native.loadRecord(filePath);
                data = JSON.parse(str);
            }
            else if (egret_native.isFileExists(filePath)) {
                var str:string = egret_native.readFileSync(filePath);
                data = JSON.parse(str);
            }
            return data;
        }
    }

    if (egret.Capabilities.runtimeType == egret.RuntimeType.NATIVE) {
        VersionController = NativeVersionController;
    }
}
