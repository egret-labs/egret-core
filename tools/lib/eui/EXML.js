//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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
/// <reference path="../types.d.ts" />
var __global = global;
var xml = require("../xml/index");
var config = require("./parser/EXMLConfig");
egret.XML = xml;
/**
 * @private
 * Swan 命名空间
 */
exports.NS_S = "http://ns.egret.com/eui";
exports.NS_W = "http://ns.egret.com/wing";
var MODULE_NAME = "eui.";
var basicTypes = ["Array", "boolean", "string", "number"];
var allClasses = {};
var allEXMLs = {};
function sort(exmlFiles) {
    parseEXML(exmlFiles);
    exmlFiles.forEach(function (file) { return addDepends(file); });
    var sorted = [];
    var sortedMap = {};
    var preloads = exmlFiles.filter(function (e) { return e.preload; });
    preloads.forEach(function (e) {
        insert(e);
    });
    exmlFiles.forEach(function (e) {
        insert(e);
    });
    function insert(file) {
        if (file.path in sortedMap)
            return;
        for (var i in file.depends)
            insert(allEXMLs[i]);
        sorted.push(file);
        sortedMap[file.path] = true;
    }
    return sorted;
}
exports.sort = sort;
function parseEXML(exmlFiles) {
    exmlFiles.forEach(function (file) {
        var xml = egret.XML.parse(file.content);
        file.className = parseClassName(xml);
        file.usedClasses = parseUsedClass(xml);
        file.usedEXML = parseUsedEXML(xml);
        allClasses[file.className] = allClasses[file.className] || [];
        allClasses[file.className].push(file);
        allEXMLs[file.path] = file;
    });
}
function addDepends(file) {
    var depends = {};
    file.usedClasses && file.usedClasses.forEach(function (className) {
        var files = allClasses[className];
        if (!files) {
            //console.log("Cannot find:", className);
            return;
        }
        files.forEach(function (it) {
            if (!it.depends)
                addDepends(it);
            for (var i in it.depends)
                depends[i] = true;
            depends[it.path] = true;
        });
    });
    file.usedEXML && file.usedEXML.forEach(function (path) {
        var it = allEXMLs[path];
        if (!it.depends)
            addDepends(it);
        for (var i in it.depends)
            depends[i] = true;
        depends[it.path] = true;
    });
    file.depends = depends;
}
function parseClassName(xml) {
    if (!xml)
        return null;
    return xml["$class"];
}
function parseUsedClass(xml) {
    var classes = [];
    visitNodes(xml, function (node) { return parseNodeClassName(node); }, function (classNames) { return classNames.forEach(function (className) { return classes.push(className); }); });
    return classes;
    function parseNodeClassName(xml) {
        if (!xml)
            return null;
        var classes = [];
        var className = getClassNameById(xml.localName, xml.namespace);
        if (className)
            classes.push(className);
        var skinName = xml["$skinName"];
        if (skinName && skinName.toLowerCase().indexOf(".exml") != skinName.length - 5)
            classes.push(skinName);
        if (classes.length)
            return classes;
        return null;
    }
}
function parseUsedEXML(xml) {
    var files = [];
    visitNodes(xml, function (node) { return parseEXMLPathInAttributes(node); }, function (path) { return files.push(path); });
    return files;
    function parseEXMLPathInAttributes(xml) {
        if (!xml)
            return null;
        var skinName = xml["$skinName"];
        if (skinName && skinName.toLowerCase().indexOf(".exml") == skinName.length - 5)
            return skinName;
        return null;
    }
}
function visitNodes(xml, condition, callback) {
    if (!xml)
        return;
    var result = condition(xml);
    if (result)
        callback(result);
    if (!xml.children || xml.children.length < 1)
        return;
    xml.children.forEach(function (node) {
        visitNodes(node, condition, callback);
    });
}
/**
 * @private
 * 根据类的短名ID和命名空间获取完整类名(以"."分隔)
 * @param id 类的短名ID
 * @param ns 命名空间
 */
function getClassNameById(id, ns) {
    if (id == "Object" && ns == exports.NS_S) {
    }
    var name = "";
    if (basicTypes.indexOf(id) != -1) {
    }
    if (ns == exports.NS_W) {
    }
    else if (!ns || ns == exports.NS_S) {
    }
    else {
        name = ns.substring(0, ns.length - 1) + id;
    }
    return name;
}
function getDtsInfoFromExml(exmlFile) {
    var xml = egret.XML.parse(require("../FileUtil").read(exmlFile));
    var className = config.EXMLConfig.getInstance().getClassNameById(xml.localName, xml.namespace);
    var extendName = "";
    if (xml["$class"]) {
        extendName = className;
        className = xml["$class"];
    }
    return { className: className, extendName: extendName };
}
exports.getDtsInfoFromExml = getDtsInfoFromExml;

//# sourceMappingURL=../../lib/eui/EXML.js.map