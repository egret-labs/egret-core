/// <reference path="../lib/types.d.ts" />

import globals = require("../Globals");
import params = require("../ParamsParser");
import file = require('../lib/FileUtil');
import config = require('../lib/ProjectConfig');
var fs = require("fs");

class GenerateVersionCommand implements egret.Command {
    execute():number {
        var tempTime = Date.now();
        globals.debugLog(1407);

        var projectPath = params.getProjectRoot();
        var outputPath = file.join(config.getReleaseRoot(), "nativeBase");
        var newCode = config.getVersionCode("native");
        var ignorePathList = config.getIgnorePath();

        var basePath = file.join(outputPath, "base.manifest");
        var versionPath = file.join(outputPath, "version.manifest");
        var codePath = file.join(outputPath, "code.manifest");
        var allPath = file.join(outputPath, "all.manifest");

        var oldVersion;
        if(file.exists(basePath)) {
            oldVersion = JSON.parse(file.read(basePath));
        }

        var oldCode = 1;
        if(file.exists(codePath)) {
            oldCode = JSON.parse(file.read(codePath))["code"] || 1;
        }
        else {
            file.save(codePath, JSON.stringify({code:oldCode}));
        }

        var list = file.search(file.join(projectPath, config.getResourceName()));
        ignorePathList = ignorePathList.map(function(item) {
            var reg = new RegExp(item);
            return reg;
        });
        var isIgnore = false;
        list = list.filter(function(copyFilePath) {
            isIgnore = false;
            for (var key in ignorePathList) {//检测忽略列表
                var ignorePath = ignorePathList[key];

                if (copyFilePath.match(ignorePath)) {
                    isIgnore = true;
                    break;
                }
            }

            if(!isIgnore) {//不在忽略列表的路径，拷贝过去
                return true;
            }
        });


        var changeVersion = {};
        var currentVersion = {};
        var allVersion = {};

        var length = list.length;

        for(var i = 0 ; i < length ; i++) {
            var filePath = list[i];
            if(filePath.indexOf(".html") != -1 || filePath.indexOf(".css") != -1 || filePath == basePath || filePath == versionPath) {
                continue;
            }
            var txt = file.read(filePath);

            var crc32 = globals.getCrc32();
            var txtCrc32 = crc32(txt);
            var savePath = file.relative(projectPath, filePath);
            var crcstr = null;
            if(oldVersion) {
                if(oldVersion[savePath] == undefined || oldVersion[savePath]["v"] != txtCrc32) {
                    crcstr = txtCrc32;
                }
            }
            else {
                crcstr = txtCrc32;
            }

            allVersion[savePath] = {"v":txtCrc32, "s":fs.statSync(filePath).size};

            if (crcstr) {
                changeVersion[savePath] = {"v":crcstr, "s":fs.statSync(filePath).size};
            }

            currentVersion[savePath] = 1;
        }


        file.save(allPath, JSON.stringify(allVersion));

        if (oldVersion == null || oldCode < newCode) {
            var changeStr = JSON.stringify(changeVersion);
            file.save(basePath, changeStr);
            file.save(codePath, JSON.stringify({code:newCode}));
            file.save(versionPath, "{}");
            return;
        }

        for (var key in oldVersion) {
            if (currentVersion[key] == null) {//文件已被删除
                changeVersion[key] = {"d":1};
            }
        }

        var str = JSON.stringify(changeVersion);
        if(oldVersion) {
            file.save(versionPath, str);
        }

        globals.debugLog(1408, (Date.now() - tempTime) / 1000);
        return 0;
    }
}

export = GenerateVersionCommand;