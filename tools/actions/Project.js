/// <reference path="../lib/types.d.ts" />
var htmlparser = require("../lib/htmlparser");
function normalize(project) {
    project.entryClass = project.entryClass || "Main";
    project.platform = project.platform || "web";
    project.background = project.background || "#888888";
    project.scaleMode = project.scaleMode || "noScale";
    project.orientationMode = project.orientationMode || "auto";
    project.frameRate = project.frameRate || 30;
    project.contentWidth = project.contentWidth || 480;
    project.contentHeight = project.contentHeight || 800;
    project.moduleScripts = project.moduleScripts || [];
    project.showLog = project.showLog || false;
    project.logFilter = project.logFilter || "";
    project.maxTouches = project.maxTouches || 2;
    project.textureScaleFactor = project.textureScaleFactor || 1;
    project.showPaintRect = project.showPaintRect || false;
    project.showFPS = project.showFPS || false;
    project.fpsStyles = project.fpsStyles || "";
    project.scripts = project.scripts || [];
    project.nativeScripts = project.nativeScripts || [];
    project.resolutionMode = project.resolutionMode || "retina";
}
exports.normalize = normalize;
function getFileList(html, isNative, isDebug) {
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            console.log(error);
    });
    var resultArr = [];
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    handler.dom.forEach(function (d) { return visitDom(d); });
    if (!isDebug) {
        resultArr.push("main.min.js");
    }
    return resultArr;
    function visitDom(el) {
        if (el.type == "script" && el.attribs && el.attribs["egret"]) {
            if (isDebug) {
                var src = el.attribs['src'];
                if (isNative) {
                    src = src.replace(".web.", ".native.");
                }
            }
            else {
                if (el.attribs["egret"] == "lib") {
                    var src = el.attribs['src'];
                    if (isNative) {
                        src = src.replace(".web.", ".native.");
                    }
                }
            }
            resultArr.push(src);
        }
        if (el.children) {
            el.children.forEach(function (e) { return visitDom(e); });
        }
    }
}
exports.getFileList = getFileList;
function getProjectInfo(html) {
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            console.log(error);
    });
    var containers = [];
    var projects = [];
    var scripts = [];
    var nativeScripts = [];
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    handler.dom.forEach(function (d) { return visitDom(d); });
    parseProject();
    return projects;
    function visitDom(el) {
        if (el.attribs && el.attribs['class'] == "egret-player") {
            containers.push(el);
        }
        if (el.children) {
            el.children.forEach(function (e) { return visitDom(e); });
        }
    }
    function parseProject() {
        containers.forEach(function (s) {
            var project = {};
            project.contentHeight = s.attribs['data-content-height'];
            project.contentWidth = s.attribs['data-content-width'];
            project.entryClass = s.attribs['data-entry-class'];
            project.frameRate = s.attribs['data-frame-rate'];
            project.orientationMode = s.attribs['data-orientation-mode'];
            project.resolutionMode = s.attribs['data-resolution-mode'];
            project.scaleMode = s.attribs['data-scale-mode'];
            project.showFPS = s.attribs['data-show-fps'];
            project.showPaintRect = s.attribs['data-show-paint-rect'];
            project.fpsStyles = s.attribs['data-show-fps-style'];
            project.showLog = s.attribs['data-show-log'];
            project.logFilter = s.attribs['data-log-filter'];
            project.textureScaleFactor = s.attribs['texture-scale-factor'];
            project.maxTouches = s.attribs['data-multi-fingered'];
            project.scripts = scripts;
            project.nativeScripts = nativeScripts;
            projects.push(project);
        });
    }
}
exports.getProjectInfo = getProjectInfo;
function parseProjectInfo(html) {
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            console.log(error);
    });
    var containers = [];
    var projects = [];
    var scripts = [];
    var nativeScripts = [];
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    handler.dom.forEach(function (d) { return visitDom(d); });
    parseProject();
    return projects;
    function visitDom(el) {
        if (el.attribs && el.attribs['class'] == "egret-player") {
            containers.push(el);
        }
        if (el.type == "script" && el.attribs) {
            nativeScripts.push(el.attribs['src'].replace(".web.", ".native."));
            scripts.push(el.attribs['src']);
        }
        if (el.children) {
            el.children.forEach(function (e) { return visitDom(e); });
        }
    }
    function parseProject() {
        containers.forEach(function (s) {
            var project = {};
            project.contentHeight = s.attribs['data-content-height'];
            project.contentWidth = s.attribs['data-content-width'];
            project.entryClass = s.attribs['data-entry-class'];
            project.frameRate = s.attribs['data-frame-rate'];
            project.orientationMode = s.attribs['data-orientation-mode'];
            project.resolutionMode = s.attribs['data-resolution-mode'];
            project.scaleMode = s.attribs['data-scale-mode'];
            project.showFPS = s.attribs['data-show-fps'];
            project.showPaintRect = s.attribs['data-show-paint-rect'];
            project.fpsStyles = s.attribs['data-show-fps-style'];
            project.showLog = s.attribs['data-show-log'];
            project.logFilter = s.attribs['data-log-filter'];
            project.textureScaleFactor = s.attribs['texture-scale-factor'];
            project.maxTouches = s.attribs['data-multi-fingered'];
            project.scripts = scripts;
            project.nativeScripts = nativeScripts;
            projects.push(project);
        });
    }
}
exports.parseProjectInfo = parseProjectInfo;

//# sourceMappingURL=../actions/Project.js.map