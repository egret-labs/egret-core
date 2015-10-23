
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
import config = require("./parser/EXMLConfig");
egret.XML = xml;


/**
 * @private
 * Swan 命名空间
 */
export var NS_S: string = "http://ns.egret.com/eui";
export var NS_W: string = "http://ns.egret.com/wing";
var MODULE_NAME = "eui.";
var basicTypes: string[] = ["Array", "boolean", "string", "number"];


var allClasses: { [name: string]: EXMLFile[] } = {};
var allEXMLs: { [name: string]: EXMLFile } = {};

export interface EXMLFile {
    path: string;
    content: string;
    className?: string;
    usedClasses?: string[];
    usedEXML?: string[];
    depends?: EXMLDepends;
    preload?: boolean;
    theme?: string;
}

interface EXMLDepends {
    [name: string]: boolean;
}

export function sort(exmlFiles: EXMLFile[]): EXMLFile[]{

    parseEXML(exmlFiles);

    exmlFiles.forEach(file=> addDepends(file));

    var sorted: EXMLFile[] = []
    var sortedMap: any = {};

    var preloads = exmlFiles.filter(e=> e.preload);

    preloads.forEach(e=> {
        insert(e);
    });

    exmlFiles.forEach(e=> {
        insert(e);
    });
    

    function insert(file: EXMLFile) {
        if (file.path in sortedMap)
            return;
        for (var i in file.depends)
            insert(allEXMLs[i]);
        sorted.push(file);
        sortedMap[file.path] = true;
    }
    
    
    return sorted;
}

function parseEXML(exmlFiles: EXMLFile[]) {

    exmlFiles.forEach((file:EXMLFile)=> {
        var xml = egret.XML.parse(file.content);
        file.className = parseClassName(xml);
        file.usedClasses = parseUsedClass(xml);
        file.usedEXML = parseUsedEXML(xml);
        allClasses[file.className] = allClasses[file.className] || [];
        allClasses[file.className].push(file);
        allEXMLs[file.path] = file;
    });
}

function addDepends(file: EXMLFile) {
    var depends: EXMLDepends = {};
    file.usedClasses && file.usedClasses.forEach(className=> {
        var files = allClasses[className];
        if (!files) {
            //console.log("Cannot find:", className);
            return;
        }
        files.forEach(it=> {
            if (!it.depends)
                addDepends(it);
            for (var i in it.depends)
                depends[i] = true;
            depends[it.path] = true;
        })
    });

    file.usedEXML && file.usedEXML.forEach(path=> {
        var it = allEXMLs[path];
        if (!it.depends)
            addDepends(it);
        for (var i in it.depends)
            depends[i] = true;
        depends[it.path] = true;
    });

    file.depends = depends;
}

function parseClassName(xml: egret.XML): string {
    if (!xml)
        return null;
    return xml["$class"];
}

function parseUsedClass(xml: egret.XML): string[]{
    var classes: string[] = [];
    visitNodes(xml,
        node=> parseNodeClassName(<egret.XML>node),
        classNames=> classNames.forEach(className=> classes.push(className)));
    return classes;

    function parseNodeClassName(xml: egret.XML): string[] {
        if (!xml)
            return null;
        var classes: string[] = [];
        var className = getClassNameById(xml.localName, xml.namespace);
        if (className)
            classes.push(className);
        var skinName: string = xml["$skinName"];
        if (skinName && skinName.toLowerCase().indexOf(".exml") != skinName.length - 5)
            classes.push(skinName);

        if (classes.length)
            return classes;
        return null;
    }
}

function parseUsedEXML(xml: egret.XML): string[]{
    var files: string[] = [];
    visitNodes(xml,
        node=> parseEXMLPathInAttributes(<egret.XML>node),
        path=> files.push(path));
    return files;

    function parseEXMLPathInAttributes(xml: egret.XML): string {
        if (!xml)
            return null;
        var skinName: string = xml["$skinName"];
        if (skinName && skinName.toLowerCase().indexOf(".exml") == skinName.length - 5)
            return skinName;
        return null;
    }
}


function visitNodes(xml: egret.XML, condition: (node: egret.XMLNode) => any, callback: (result: any) => void) {
    if (!xml)
        return;
    var result = condition(xml);
    if (result)
        callback(result);
    if (!xml.children || xml.children.length < 1)
        return;
    xml.children.forEach(node=> {
        visitNodes(<egret.XML>node, condition, callback);
    });
}


        /**
         * @private
         * 根据类的短名ID和命名空间获取完整类名(以"."分隔)
         * @param id 类的短名ID
         * @param ns 命名空间
         */
function getClassNameById(id: string, ns: string): string {
    if (id == "Object" && ns == NS_S) {

    }
    var name: string = "";
    if (basicTypes.indexOf(id) != -1) {

    }
    if (ns == NS_W) {

    }
    else if (!ns || ns == NS_S) {

    }
    else {
        name = ns.substring(0, ns.length - 1) + id
    }
    return name;
}

export function getDtsInfoFromExml(exmlFile:string):{className:string,extendName:string}{
    var xml:egret.XML = egret.XML.parse(require("../FileUtil").read(exmlFile));
    var className = config.EXMLConfig.getInstance().getClassNameById(xml.localName, xml.namespace);
    var extendName = "";
    if(xml["$class"]){
        extendName = className;
        className = xml["$class"];
    }
    return{className:className,extendName:extendName};
}