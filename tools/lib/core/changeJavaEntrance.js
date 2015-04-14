/**
 * aotu refresh java activity
 */
var path = require("path");
var file = require("../core/file.js");

var javaPath;
var javaContent;

function init(url, platform) {
    //修改java文件
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
        javaPath = path.join(url, "src", javaName + ".java");
        javaContent = file.read(javaPath);
    }
    else if (file.exists(path.join(url, "src", filePath, javaName + ".java"))) {
        javaPath = path.join(url, "src", filePath, javaName + ".java");
        javaContent = file.read(javaPath);
    }
    else {
        javaContent = null;
    }
}

function changePublish(url, platform, versionFile) {
    init(url, platform);

    if (javaContent) {
        javaContent = javaContent.replace(/private static final String EGRET_PUBLISH_ZIP =.*/, 'private static final String EGRET_PUBLISH_ZIP = "game_code_' + versionFile + '.zip";');
        javaContent = javaContent.replace(/setLoaderUrl\((\s)*\d(\s)*\);/, 'setLoaderUrl(0);');
        file.save(javaPath, javaContent);
    }
}

function changeBuild(url, platform) {
    init(url, platform);

    if (javaContent) {
        javaContent = javaContent.replace(/setLoaderUrl\((\s)*\d(\s)*\);/, 'setLoaderUrl(2);');
        file.save(javaPath, javaContent);
    }
}

exports.changePublish = changePublish;
exports.changeBuild = changeBuild;