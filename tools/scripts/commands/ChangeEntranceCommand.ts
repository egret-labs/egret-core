/// <reference path="../lib/types.d.ts" />

import globals = require("../Globals");
import params = require("../ParamsParser");
import file = require('../lib/FileUtil');

class ChangeEntranceCommand implements egret.Command {

    platformPath;
    platformContent;
    execute():number {
        //扫描json数据
        if (this.versionFile) {
            this.changePublish(this.url, this.platform, this.versionFile);
        }
        else {
            this.changeBuild(this.url, this.platform);
        }
        return 0;
    }

    url;
    platform;
    versionFile;
    initCommand(url, platform, versionFile?:string){
        this.url = url;
        this.platform = platform;
        this.versionFile = versionFile;
    }

    private init(url, platform) {
        switch (platform) {
            case "android"://修改java文件
                var DOMParser = require('../../lib/core/xmldom/dom-parser').DOMParser;
                var xmlContent = file.read(file.join(url, "AndroidManifest.xml"));
                var doc = new DOMParser().parseFromString(xmlContent);
                var filePath = doc.documentElement.getElementsByTagName('manifest')._node.getAttribute('package').replace(/\./g, "/");
                var javaName;
                var activities = doc.documentElement.getElementsByTagName("activity");
                for (var i = 0; i < activities.length; i++) {
                    var activity = activities[i];
                    if (activity.hasAttribute("android:name") && activity.getAttribute("android:label") == "@string/app_name") {
                        javaName = activity.getAttribute('android:name').replace(/\./g, "/");
                        break;
                    }
                }

                if (file.exists(file.join(url, "src", javaName + ".java"))) {
                    this.platformPath = file.join(url, "src", javaName + ".java");
                    this.platformContent = file.read(this.platformPath);
                }
                else if (file.exists(file.join(url, "src", filePath, javaName + ".java"))) {
                    this.platformPath = file.join(url, "src", filePath, javaName + ".java");
                    this.platformContent = file.read(this.platformPath);
                }
                else {
                    this.platformContent = null;
                }
                break;
            case "ios"://修改ios入口文件
                var projectName = '';

                var fileList = file.getDirectoryListing(url, true);
                for (var key in fileList) {
                    var item = fileList[key];
                    var index = item.indexOf('.xcodeproj');
                    if (index >= 0) {
                        projectName = item.substr(0, index);
                        break;
                    }
                }
                this.platformPath = file.join(url, projectName, 'AppDelegate.mm');
                if (file.exists(this.platformPath)) {
                    this.platformContent = file.read(this.platformPath);
                }
                else {
                    this.platformContent = null;
                }
                break;
        }
    }

    private changePublish(url, platform, versionFile) {
        this.init(url, platform);

        if (this.platformContent) {
            this.changeLoaderUrl(0, platform);
            switch (platform) {
                case "android":
                    this.platformContent = this.platformContent.replace(/private static final String EGRET_PUBLISH_ZIP =.*/, 'private static final String EGRET_PUBLISH_ZIP = "game_code_' + versionFile + '.zip";');
                    break;
                case "ios":
                    this.platformContent = this.platformContent.replace(/#define EGRET_PUBLISH_ZIP @.*/, '#define EGRET_PUBLISH_ZIP @"game_code_' + versionFile + '.zip"');
                    break;
            }
            file.save(this.platformPath, this.platformContent);
        }
    }

    private changeBuild(url, platform) {
        this.init(url, platform);

        if (this.platformContent) {
            this.changeLoaderUrl(2, platform);

            file.save(this.platformPath, this.platformContent);
        }
    }

    private changeLoaderUrl(code, platform) {
        switch (platform) {
            case "android":
                this.platformContent = this.platformContent.replace(/setLoaderUrl\((\s)*\d(\s)*\);/, 'setLoaderUrl(' + code + ');');
                break;
            case "ios":
                this.platformContent = this.platformContent.replace(/setLoaderUrl:(\s)*\d(\s)*/, 'setLoaderUrl:' + code);
                break;
        }
    }

}

export = ChangeEntranceCommand;