/// <reference path="../lib/types.d.ts" />

import FileUtil = require('../lib/FileUtil');

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
                //判断入口文件是否存在
                var entranceFile = FileUtil.joinPath(url, "AndroidManifest.xml");
                if(!FileUtil.exists(entranceFile)){
                    break;
                }
                var DOMParser = require('../lib/core/xmldom/dom-parser').DOMParser;
                var xmlContent = FileUtil.read(entranceFile);
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

                if (FileUtil.exists(FileUtil.joinPath(url, "src", javaName + ".java"))) {
                    this.platformPath = FileUtil.joinPath(url, "src", javaName + ".java");
                    this.platformContent = FileUtil.read(this.platformPath);
                }
                else if (FileUtil.exists(FileUtil.joinPath(url, "src", filePath, javaName + ".java"))) {
                    this.platformPath = FileUtil.joinPath(url, "src", filePath, javaName + ".java");
                    this.platformContent = FileUtil.read(this.platformPath);
                }
                else {
                    this.platformContent = null;
                }
                break;
            case "ios"://修改ios入口文件
                var projectName = '';

                var fileList = FileUtil.getDirectoryListing(url, true);
                for (var key in fileList) {
                    var item = fileList[key];
                    var index = item.indexOf('.xcodeproj');
                    if (index >= 0) {
                        projectName = item.substr(0, index);
                        break;
                    }
                }
                this.platformPath = FileUtil.joinPath(url, projectName, 'AppDelegate.mm');
                if (FileUtil.exists(this.platformPath)) {
                    this.platformContent = FileUtil.read(this.platformPath);
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
            FileUtil.save(this.platformPath, this.platformContent);
        }
    }

    private changeBuild(url, platform) {
        this.init(url, platform);

        if (this.platformContent) {
            this.changeLoaderUrl(2, platform);

            FileUtil.save(this.platformPath, this.platformContent);
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