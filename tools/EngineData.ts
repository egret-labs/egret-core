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

import FileUtil = require('./lib/FileUtil');

interface EgretConfig {
    //以兆为单位
    totalmem: number;
    //以分钟为单位
    autoExitTime: number;
}

export class EngineData {

    private data: EgretConfig;

    init() {
        let execPath = process.execPath;
        let dataPath = FileUtil.joinPath(execPath, "../../../", "config/egret_config.json");
        if (FileUtil.exists(dataPath)) {
            try {
                this.data = JSON.parse(FileUtil.read(dataPath)).engine;
            }
            catch (e) {
                this.data = {
                    totalmem: -1,
                    autoExitTime: 60
                }
            }
        }
        else {
            this.data = {
                totalmem: -1,
                autoExitTime: 60
            }
        }
    }

    getTotalMem() {
        return this.data.totalmem || -1;
    }

    getAutoExitTime() {
        return this.data.autoExitTime || 60;
    }
}

export var data = new EngineData();