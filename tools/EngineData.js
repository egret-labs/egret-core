//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
Object.defineProperty(exports, "__esModule", { value: true });
var FileUtil = require("./lib/FileUtil");
var EngineData = /** @class */ (function () {
    function EngineData() {
    }
    EngineData.prototype.init = function () {
        var execPath = process.execPath;
        var dataPath = FileUtil.joinPath(execPath, "../../../", "config/egret_config.json");
        if (FileUtil.exists(dataPath)) {
            try {
                this.data = JSON.parse(FileUtil.read(dataPath)).engine;
            }
            catch (e) {
                this.data = {
                    totalmem: -1,
                    autoExitTime: 60
                };
            }
        }
        else {
            this.data = {
                totalmem: -1,
                autoExitTime: 60
            };
        }
    };
    EngineData.prototype.getTotalMem = function () {
        return this.data.totalmem || -1;
    };
    EngineData.prototype.getAutoExitTime = function () {
        return this.data.autoExitTime || 60;
    };
    return EngineData;
}());
exports.EngineData = EngineData;
exports.data = new EngineData();
