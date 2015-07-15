/**
 * aotu refresh java activity
 */
var path = require("../core/path");
var file = require("../core/file.js");

var platformPath;
var platformContent;

function init(url, platform) {
    switch (platform) {
        case "android"://修改java文件
            var DOMParser = require('../core/xmldom/dom-parser').DOMParser;
            var xmlContent = file.read(path.join(url, "AndroidManifest.xml"));
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

            if (file.exists(path.join(url, "src", javaName + ".java"))) {
                platformPath = path.join(url, "src", javaName + ".java");
                platformContent = file.read(platformPath);
            }
            else if (file.exists(path.join(url, "src", filePath, javaName + ".java"))) {
                platformPath = path.join(url, "src", filePath, javaName + ".java");
                platformContent = file.read(platformPath);
            }
            else {
                platformContent = null;
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
            platformPath = path.join(url, projectName, 'AppDelegate.mm');
            if (file.exists(platformPath)) {
                platformContent = file.read(platformPath);
            }
            else {
                platformContent = null;
            }
            break;
    }
}

function changePublish(url, platform, versionFile) {
    init(url, platform);

    if (platformContent) {
        changeLoaderUrl(0, platform);
        switch (platform) {
            case "android":
                platformContent = platformContent.replace(/private static final String EGRET_PUBLISH_ZIP =.*/, 'private static final String EGRET_PUBLISH_ZIP = "game_code_' + versionFile + '.zip";');
                break;
            case "ios":
                platformContent = platformContent.replace(/#define EGRET_PUBLISH_ZIP @.*/, '#define EGRET_PUBLISH_ZIP @"game_code_' + versionFile + '.zip"');
                break;
        }
        file.save(platformPath, platformContent);
    }
}

function changeBuild(url, platform) {
    init(url, platform);

    if (platformContent) {
        changeLoaderUrl(2, platform);

        file.save(platformPath, platformContent);
    }
}

function changeLoaderUrl(code, platform) {
    switch (platform) {
        case "android":
            platformContent = platformContent.replace(/setLoaderUrl\((\s)*\d(\s)*\);/, 'setLoaderUrl(' + code + ');');
            break;
        case "ios":
            platformContent = platformContent.replace(/setLoaderUrl:(\s)*\d(\s)*/, 'setLoaderUrl:' + code);
            break;
    }
}

exports.changePublish = changePublish;
exports.changeBuild = changeBuild;