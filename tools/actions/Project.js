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
    project.resolutionMode = project.resolutionMode || "retina";
}
exports.normalize = normalize;
function parseProjectInfo(html) {
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            console.log(error);
    });
    var containers = [];
    var projects = [];
    var scripts = [];
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
            projects.push(project);
        });
    }
}
exports.parseProjectInfo = parseProjectInfo;
