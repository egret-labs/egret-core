﻿
/// <reference path="../lib/types.d.ts" />

import utils = require('../lib/utils');
import htmlparser = require("../lib/htmlparser");


export function normalize(project: egret.ILarkProject) {
    project.entryClass = project.entryClass || "Main";
    project.platform = project.platform || "web";
    project.background = project.background || "#888888";
    project.scaleMode = project.scaleMode || "noScale"
    project.orientationMode = project.orientationMode || "auto"
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


export function parseProjectInfo(html: string): egret.ILarkProject[] {
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        if (error)
            console.log(error);
    });
    var containers: htmlparser.Element[] = [];
    var projects: egret.ILarkProject[] = [];
    var scripts: string[] = [];
    var nativeScripts: string[] = [];
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    handler.dom.forEach(d=> visitDom(d));
    parseProject();
    return projects;

    function visitDom(el: htmlparser.Element) {
        if (el.attribs && el.attribs['class'] == "egret-player") {
            containers.push(el);
        }
        if (el.type == "script" && el.attribs) {
            nativeScripts.push(el.attribs['src'].replace(".web.", ".native."));
            scripts.push(el.attribs['src']);
        }
        if (el.children) {
            el.children.forEach(e=> visitDom(e));
        }
    }

    function parseProject() {
        containers.forEach(s=> {
            var project: egret.ILarkProject = {};
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
