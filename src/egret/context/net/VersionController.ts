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
     * @private
     */
    export class VersionController extends egret.EventDispatcher {

        public constructor() {
            super();
        }

        /**
         * 本地版本信息文件存储路径
         */
        private localVersionDataPath:string = "localVersion.manifest";
        /**
         * 本地版本信息文件，记录了本地文件版本信息
         */
        private localVersionData:Object = null;


        /**
         * 本地版本信息文件存储路径
         */
        private changeVersionDataPath = "version.manifest";
        /**
         * 当前版本信息文件，记录了当前版本中相对于基础版本变化的文件
         */
        private changeVersionData:Object = null;

        /**
         * 本地版本信息文件存储路径
         */
        private baseVersionDataPath = "base.manifest";
        /**
         * 基础版本信息文件
         */
        private baseVersionData:Object = null;

        private newCode:number;
        private localVersionCodePath = "localCode.manifest";
        private serverVersionCodePath = "code.manifest";

        private _load:NativeResourceLoader = null;

        //获取当前版本号
        private fetchVersion():void {
            this._load = new egret.NativeResourceLoader();
            this._load.addEventListener(egret.IOErrorEvent.IO_ERROR, this.loadError, this);
            this._load.addEventListener(egret.Event.COMPLETE, this.fileLoadComplete, this);

            this.initLocalVersionData();
        }

        //初始化本地数据配置
        private initLocalVersionData():void {
            //初始化localVersonData
            this.localVersionData = this.getLocalData(this.localVersionDataPath);
            if (this.localVersionData == null) {
                this.localVersionData = this.getLocalData(this.baseVersionDataPath);
                if (this.localVersionData == null) {
                    this.localVersionData = {};
                }

                egret_native.saveRecord(this.localVersionDataPath, JSON.stringify(this.localVersionData));
            }

            this.loadCodeVersion();
        }

        //初始化本地版本控制号数据
        private loadCodeVersion():void {
            var localCode:number = 1;
            this.newCode = 1;

            var localVersionCode = this.getLocalData(this.localVersionCodePath);
            if (localVersionCode != null) {
                localCode = localVersionCode["code"];
            }

            var serverVersionCode = this.getLocalData(this.serverVersionCodePath);
            if (serverVersionCode != null) {
                this.newCode = serverVersionCode["code"];
            }

            this.loadBaseVersion(localCode != this.newCode);
        }

        private loadBaseVersion(neesUpdate:boolean):void {
            this.baseVersionData = this.getLocalData(this.baseVersionDataPath);
            this.changeVersionData = this.getLocalData(this.changeVersionDataPath);

            //加载baseVersionData
            var self = this;
            if (this.baseVersionData == null || neesUpdate) {
                this.loadFile(this.baseVersionDataPath, function () {
                    self.baseVersionData = self.getLocalData(self.baseVersionDataPath);

                    self.loadBaseOver();
                });
            }
            else {
                this.loadBaseOver();
            }
        }

        private loadBaseOver():void {
            //保存localCode文件
            egret_native.saveRecord(this.localVersionCodePath, JSON.stringify({"code" : this.newCode}));

            this.loadOver();

        }

        private _call:Function = null;

        private loadFile(file:string, call:Function = null) {
            this._call = call;
            this._load.load(file, 1000);
        }

        private fileLoadComplete(e:egret.Event):void {
            if (this._call) {
                this._call();
            }
        }

        private loadError(e:egret.IOErrorEvent):void {
            this._load.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.loadError, this);
            this._load.removeEventListener(egret.Event.COMPLETE, this.fileLoadComplete, this);

            this.dispatchEvent(e);
        }

        private loadOver():void {
            this._load.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.loadError, this);
            this._load.removeEventListener(egret.Event.COMPLETE, this.fileLoadComplete, this);

            this.dispatchEvent(new egret.Event(egret.Event.COMPLETE));
        }

        private getLocalData(filePath):Object {
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

        /**
         * 获取所有有变化的文件
         * @returns {Array<any>}
         */
        public getChangeList():Array<any> {
            if(!this.baseVersionData) {
                return [];
            }
            var changeDatas:Object = {};
            for (var key in this.changeVersionData) {
                if (this.changeVersionData[key]["d"] == 1) {//被删除
                    delete this.baseVersionData[key];
                }
                else {
                    this.baseVersionData[key] = this.changeVersionData[key];
                }
            }

            for (var key in this.baseVersionData) {
                if (this.localVersionData[key] == null || !this.compareVersion(this.localVersionData, this.baseVersionData, key)) {
                    changeDatas[key] = {"url": key, "size": this.baseVersionData[key]["s"]};
                }
            }

            for (var key in this.localVersionData) {
                if (changeDatas[key] == null) {//不在将要下载的下载列表
                    if (!egret_native.isRecordExists(key) && !egret_native.isFileExists(key)) {//没有下载过这个文件
                        changeDatas[key] = {"url": key, "size": this.localVersionData[key]["s"]};
                    }
                }
            }

            var list:Array<any> = [];
            for (var key in changeDatas) {
                list.push(changeDatas[key]);
            }
            return list;
        }

        private compareVersion(oldVersion:Object, newVersion:Object, url:string):boolean {
            if (oldVersion[url] == null || newVersion[url] == null) {
                return false;
            }
            return oldVersion[url]["v"] == newVersion[url]["v"];
        }

        /**
         * 检查文件是否是最新版本
         */
        public checkIsNewVersion(url:string):boolean {
            if(!this.baseVersionData) {
                return true;
            }
            if (this.changeVersionData[url] != null) {//在变化版本里
                return this.compareVersion(this.changeVersionData, this.localVersionData, url);
            }
            else if (this.baseVersionData[url] != null) {//在基础版本里
                return this.compareVersion(this.baseVersionData, this.localVersionData, url);
            }
            return true;
        }

        /**
         * 保存本地版本信息文件
         */
        public saveVersion(url:string):void {
            if(!this.baseVersionData) {
                return;
            }
            var change = false;
            if (this.changeVersionData[url] != null) {//在变化版本里
                if (!this.compareVersion(this.changeVersionData, this.localVersionData, url)) {
                    change = true;
                    this.localVersionData[url] = this.changeVersionData[url];
                }
            }
            else if (this.baseVersionData[url] != null) {//在基础版本里
                if (!this.compareVersion(this.baseVersionData, this.localVersionData, url)) {
                    change = true;
                    this.localVersionData[url] = this.baseVersionData[url];
                }
            }

            if (change) {
                egret_native.saveRecord(this.localVersionDataPath, JSON.stringify(this.localVersionData));
            }
        }
    }
}
