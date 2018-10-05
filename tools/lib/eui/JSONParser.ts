//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
import { EXMLConfig, NS_S, NS_W } from "./EXMLConfig2";
import XMLParser = require("../xml/index");
import { EXAddItems, EXBinding, EXClass, EXFunction, EXSetProperty, EXState, EXVariable, EXSetStateProperty } from "./CodeFactory";
let DEBUG = false;
import { egretbridge } from "./egretbridge";
import { jsonFactory } from './JSONClass'
import utils = require('../../lib/utils');
import { isOneByOne } from "../../actions/exml";

export const eui = jsonFactory;
/**
 * @private
 * EXML配置管理器实例
 */
export let exmlConfig: EXMLConfig;
export let isError: boolean = false;

let exmlParserPool: JSONParser[] = [];
let innerClassCount = 1;

let HOST_COMPONENT = "hostComponent";
let DECLARATIONS = "Declarations";
let TYPE_CLASS = "Class";
let TYPE_ARRAY = "Array";
let TYPE_PERCENTAGE = "Percentage";
let TYPE_STexture = "string | Texture";
let TYPE_STATE = "State[]";
let ELEMENTS_CONTENT = "elementsContent";
let basicTypes: string[] = [TYPE_ARRAY, TYPE_STexture, "boolean", "string", "number"];
let wingKeys: string[] = ["id", "locked", "includeIn", "excludeFrom"];
let htmlEntities: string[][] = [["<", "&lt;"], [">", "&gt;"], ["&", "&amp;"], ["\"", "&quot;"], ["'", "&apos;"]];
let jsKeyWords: string[] = ["null", "NaN", "undefined", "true", "false"];

/** 常用的关键字进行缩短设置，压缩体积6% */
let euiShorten = {
    "eui.BitmapLabel": "$eBL",
    "eui.Button": "$eB",
    "eui.CheckBox": "$eCB",
    "eui.Component": "$eC",
    "eui.DataGroup": "$eDG",
    "eui.EditableText": "$eET",
    "eui.Group": "$eG",
    "eui.HorizontalLayout": "$eHL",
    "eui.HScrollBar": "$eHSB",
    "eui.HSlider": "$eHS",
    "eui.Image": "$eI",
    "eui.Label": "$eL",
    "eui.List": "$eLs",
    "eui.Panel": "$eP",
    "eui.ProgressBar": "$ePB",
    "eui.RadioButton": "$eRB",
    "eui.RadioButtonGroup": "$eRBG",
    "eui.Range": "$eRa",
    "eui.Rect": "$eR",
    "eui.RowAlign": "$eRAl",
    "eui.Scroller": "$eS",
    "eui.TabBar": "$eT",
    "eui.TextInput": "$eTI",
    "eui.TileLayout": "$eTL",
    "eui.ToggleButton": "$eTB",
    "eui.ToggleSwitch": "$eTS",
    "eui.VerticalLayout": "$eVL",
    "eui.ViewStack": "$eV",
    "eui.VScrollBar": "$eVSB",
    "eui.VSlider": "$eVS",
    "eui.Skin": "$eSk"
}

/**
 * @private
 */
export class JSONParser {
    /**
     * @private
     */
    public constructor() {
    }
    private _topNode: egretbridge.XML;
    public get topNode(): egretbridge.XML {
        return this._topNode;
    }
    private _className: string;
    public get className(): string {
        return this._className;
    }
    /**
     * @private
     */
    private repeatedIdMap: any;
    /**
     * @private
     * 当前类
     */
    private currentClass: EXClass;
    /**
     * @private
     * 当前编译的类名
     */
    private currentClassName: string;
    /**
     * @private
     * 当前要编译的EXML文件
     */
    private currentXML: egretbridge.XML;
    /**
     * @private
     * id缓存字典
     */
    private idDic: any;
    /**
     * @private
     * 状态代码列表
     */
    private stateCode: EXState[];

    /**
     * @private
     */
    private stateNames: string[];
    /**
     * @private
     * 需要单独创建的实例id列表
     */
    private stateIds: string[];

    /**
     * @private
     */
    private skinParts: string[];

    /**
     * @private
     */
    private bindings: EXBinding[];

    /**
     * @private
     */
    private declarations: any;
    /**
     * @private
     * 编译指定的XML对象为json。
     * @param xmlData 要编译的EXML文件内容
     *
     */
    public parse(text: string, path?: string): { className: string, json?: string } {
        if (DEBUG) {
            if (!text) {
                egretbridge.$error(1003, "text");
            }
        }
        let xmlData: any = null;
        /** 解析exml文件 */
        if (DEBUG) {
            try {
                xmlData = XMLParser.parse(text);
            }
            catch (e) {
                egretbridge.$error(2002, text + "\n" + e.message);
            }
        } else {
            xmlData = XMLParser.parse(text);
        }
        this._topNode = xmlData;
        let className: string = "";
        if (xmlData.attributes["class"]) {
            className = xmlData.attributes["class"];
            delete xmlData.attributes["class"];
        }
        else {
            className = "$exmlClass" + innerClassCount++;
        }
        this._className = className;
        if (jsonFactory.hasClassName(className)) {
            console.log(utils.tr(2104, path, className));
            isError = true;
        }
        if (path) {
            jsonFactory.addContent(path, this.className, "$path");
        }
        this.parseClass(xmlData, className);
        if (isOneByOne) {
            let json = eui.toCode();
            eui.clear();
            return { className, json };
        } else {
            return { className };
        }
    }

    /**
     * @private
     * 编译指定的XML对象为CpClass对象。
     */
    private parseClass(xmlData: egretbridge.XML, className: string) {
        if (!exmlConfig) {
            exmlConfig = new EXMLConfig();
        }
        exmlConfig.dirPath = egret.args.projectDir;
        this.currentXML = xmlData;
        this.currentClassName = className;
        this.idDic = {};
        this.stateCode = [];
        this.stateNames = [];
        this.skinParts = [];
        this.bindings = [];
        this.declarations = null;
        this.currentClass = new EXClass();
        this.currentClass.allName = this.currentClassName;
        this.stateIds = [];
        let index = className.lastIndexOf(".");
        if (index != -1) {
            this.currentClass.className = className.substring(index + 1);
        }
        else {
            this.currentClass.className = className;
        }
        this.startCompile();
    }

    /**
     * @private
     * 开始编译
     */
    private startCompile(): void {
        if (DEBUG) {
            let result = this.getRepeatedIds(this.currentXML);
            if (result.length > 0) {
                egretbridge.$error(2004, this.currentClassName, result.join("\n"));
            }
        }
        let superClass = this.getClassNameOfNode(this.currentXML);
        this.currentClass.superClass = superClass;
        this.getStateNames();
        let children = this.currentXML.children;
        if (children) {
            let length = children.length;
            for (let i = 0; i < length; i++) {
                let node: any = children[i];
                if (node.nodeType === 1 && node.namespace == NS_W &&
                    node.localName == DECLARATIONS) {
                    this.declarations = node;
                    break;
                }
            }
        }
        if (DEBUG) {
            let list: string[] = [];
            this.checkDeclarations(this.declarations, list);
            if (list.length > 0) {
                egretbridge.$error(2020, this.currentClassName, list.join("\n"));
            }
        }
        if (!this.currentXML.namespace) {
            if (DEBUG) {
                egretbridge.$error(2017, this.currentClassName, this.toXMLString(this.currentXML));
            }
            return;
        }
        this.addIds(this.currentXML.children);
        this.addBaseConfig();
    }

    /**
     * @private
     * 添加必须的id
     */
    private addIds(items: any): void {
        if (!items) {
            return;
        }
        let length = items.length;
        for (let i = 0; i < length; i++) {
            let node: egretbridge.XML = items[i];
            if (node.nodeType != 1) {
                continue;
            }
            if (!node.namespace) {
                if (DEBUG) {
                    egretbridge.$error(2017, this.currentClassName, this.toXMLString(node));
                }
                continue;
            }
            if (this.isInnerClass(node)) {
                continue;
            }
            this.addIds(node.children);
            if (node.namespace == NS_W || !node.localName) {
            }
            else if (this.isProperty(node)) {
                let prop = node.localName;
                let index = prop.indexOf(".");
                let children: Array<any> = node.children;
                if (index == -1 || !children || children.length == 0) {
                    continue;
                }
                let firstChild: egretbridge.XML = children[0];
                this.stateIds.push(firstChild.attributes.id);
            }
            else if (node.nodeType === 1) {
                let id = node.attributes["id"];
                let stateGroups = node.attributes["stateGroups"];
                if (id && stateGroups == undefined) {//区分是组件的id还是stateGroup的id
                    let e = new RegExp("^[a-zA-Z_$]{1}[a-z0-9A-Z_$]*");
                    if (id.match(e) == null) {
                        egretbridge.$warn(2022, id);
                    }
                    if (id.match(new RegExp(/ /g)) != null) {
                        egretbridge.$warn(2022, id);
                    }
                    if (this.skinParts.indexOf(id) == -1) {
                        this.skinParts.push(id);
                    }
                    this.createVarForNode(node);
                    if (this.isStateNode(node))//检查节点是否只存在于一个状态里，需要单独实例化
                        this.stateIds.push(id);
                }
                else {
                    this.createIdForNode(node);
                    if (this.isStateNode(node))
                        this.stateIds.push(node.attributes.id);
                }
            }
        }
    }

    /**
     * @private
     * 是否为内部类。
     */
    private isInnerClass(node: egretbridge.XML): boolean {
        if (node.hasOwnProperty("isInnerClass")) {
            return node["isInnerClass"];
        }
        let result = (node.localName == "Skin" && node.namespace == NS_S);
        if (!result) {
            if (this.isProperty(node)) {
                result = false;
            }
            else {
                let prop: string;
                let parent = node.parent;
                if (this.isProperty(parent)) {
                    prop = parent.localName;
                    let index = prop.indexOf(".");
                    if (index != -1) {
                        prop = prop.substring(0, index);
                    }
                    parent = parent.parent;
                }
                else {
                    prop = exmlConfig.getDefaultPropById(parent.localName, parent.namespace);
                }
                let className = exmlConfig.getClassNameById(parent.localName, parent.namespace);
                result = (exmlConfig.getPropertyType(prop, className) == TYPE_CLASS);
            }
        }
        node["isInnerClass"] = result;
        return result;
    }

    /**
     * @private
     * 检测指定节点的属性是否含有视图状态
     */
    private containsState(node: egretbridge.XML): boolean {
        let attributes = node.attributes;
        if (attributes["includeIn"] || attributes["excludeFrom"]) {
            return true;
        }
        let keys = Object.keys(attributes);
        let length = keys.length;
        for (let i = 0; i < length; i++) {
            let name = keys[i];
            if (name.indexOf(".") != -1) {
                return true;
            }
        }
        return false;
    }

    /**
     * @private
     * 为指定节点创建id属性
     */
    private createIdForNode(node: egretbridge.XML): void {
        let idName = this.getNodeId(node);
        if (!this.idDic[idName]) {
            this.idDic[idName] = 1;
        }
        else {
            this.idDic[idName]++;
        }
        idName += this.idDic[idName];
        node.attributes.id = idName;
    }

    /**
     * @private
     * 获取节点ID
     */
    private getNodeId(node: egretbridge.XML): string {
        if (node.attributes["id"]) {
            return node.attributes.id;
        }
        return "_" + node.localName;
    }

    /**
     * @private
     * 为指定节点创建变量
     */
    private createVarForNode(node: egretbridge.XML): void {
        let moduleName = this.getClassNameOfNode(node);
        if (moduleName == "") {
            return;
        }
        if (!this.currentClass.getVariableByName(node.attributes.id)) {
            this.currentClass.addVariable(new EXVariable(node.attributes.id));
        }
    }

    /**
     * @private
     * 对子节点进行config的提取，返回节点名字id
     */
    private addNodeConfig(node: egretbridge.XML): string {
        let className = node.localName;
        let isBasicType = this.isBasicTypeData(className);
        if (isBasicType) {
            return this.createBasicTypeForNode(node);
        }
        let moduleName = this.getClassNameOfNode(node);
        let func = new EXFunction();
        let id = node.attributes.id;
        func.name = id;
        //保存的名字
        let configName = func.name;
        let config = {};
        for (let i in node.attributes) {
            if (i != "id") {
                let value = node.attributes[i];
                config[i] = value;
            }
        }
        let name = exmlConfig.getClassNameById(node.localName, node.namespace);
        config["$t"] = euiShorten[name] == undefined ? name : euiShorten[name];
        jsonFactory.addContent(config, this.currentClassName, func.name);
        // 赋值skin的属性
        this.addConfig(node, configName, moduleName);
        this.initlizeChildNode(node, func.name);
        return func.name;
    }

    /**
     * @private
     * 检查目标类名是否是基本数据类型
     */
    private isBasicTypeData(className: string): boolean {
        return basicTypes.indexOf(className) != -1;
    }

    /**
     * @private
     * 为指定基本数据类型节点实例化,返回实例化后的值。
     */
    private createBasicTypeForNode(node: egretbridge.XML): string {
        let className = node.localName;
        let returnValue = "";
        let varItem = this.currentClass.getVariableByName(node.attributes.id);
        let children: any[] = node.children;
        let text = "";
        if (children && children.length > 0) {
            let firstChild: egretbridge.XMLText = children[0];
            if (firstChild.nodeType == 3) {
                text = firstChild.text.trim();
            }
        }
        switch (className) {
            case TYPE_ARRAY:
                let values = [];
                if (children) {
                    let length = children.length;
                    for (let i = 0; i < length; i++) {
                        let child: egretbridge.XML = children[i];
                        if (child.nodeType == 1) {
                            values.push(this.addNodeConfig(child));
                        }
                    }
                }
                returnValue = "[" + values.join(",") + "]";
                break;
            case "boolean":
                returnValue = (text == "false" || !text) ? "false" : "true";
                break;
            case "number":
                returnValue = text;
                if (returnValue.indexOf("%") != -1) {
                    returnValue = returnValue.substring(0, returnValue.length - 1);
                }
                break;
        }
        if (varItem)
            varItem.defaultValue = returnValue;
        return returnValue;
    }

    /**
     * @private
     * 将节点属性赋值语句添加到代码块
     */
    private addConfig(node: egretbridge.XML, configName: string, type?: string): void {
        let key: string;
        let value: string;
        let attributes = node.attributes;
        let jsonProperty = {};
        let keyList: string[] = Object.keys(attributes);
        keyList.sort();//排序一下防止出现随机顺序
        //对 style 属性先行赋值
        let styleIndex = keyList.indexOf("style");
        if (styleIndex > 0) {
            keyList.splice(styleIndex, 1);
            keyList.unshift("style");
        }
        let length = keyList.length;
        for (let i = 0; i < length; i++) {
            key = keyList[i];
            if (!this.isNormalKey(key)) {
                continue;
            }
            value = attributes[key];
            key = this.formatKey(key, value);
            value = this.formatValue(key, value, node);
            jsonProperty[key] = value;
        }
        if (type) {
            jsonProperty["$t"] = euiShorten[type] == undefined ? type : euiShorten[type];
        }
        jsonFactory.addContent(jsonProperty, this.currentClassName, configName == undefined ? "$bs" : configName);
    }

    /**
     * @private
     * 初始化子项
     */
    private initlizeChildNode(node: egretbridge.XML, varName: string): void {
        let children: Array<any> = node.children;
        if (!children || children.length == 0) {
            return;
        }
        let className = exmlConfig.getClassNameById(node.localName, node.namespace);
        let directChild: egretbridge.XML[] = [];
        let length = children.length;
        let propList: string[] = [];
        let errorInfo: any;
        for (let i = 0; i < length; i++) {
            let child: egretbridge.XML = children[i];
            if (child.nodeType != 1 || child.namespace == NS_W) {
                continue;
            }
            if (this.isInnerClass(child)) {
                if (child.localName == "Skin") {
                    let innerClassName = this.parseInnerClass(child);
                    jsonFactory.addContent(innerClassName, this.currentClassName + "/" + this.getNodeId(node), "skinName")
                }
                continue;
            }

            let prop = child.localName;
            if (this.isProperty(child)) {
                if (!this.isNormalKey(prop)) {
                    continue;
                }
                let type = exmlConfig.getPropertyType(child.localName, className);
                if (!type) {
                    if (DEBUG) {
                        egretbridge.$error(2005, this.currentClassName, child.localName, this.getPropertyStr(child));
                    }
                    continue;
                }
                if (!child.children || child.children.length == 0) {
                    if (DEBUG) {
                        egretbridge.$warn(2102, this.currentClassName, this.getPropertyStr(child));
                    }
                    continue;
                }
                if (DEBUG) {
                    errorInfo = this.getPropertyStr(child);
                }
                this.addChildrenToProp(child.children, type, prop, varName, errorInfo, propList, node);
            }
            else {
                directChild.push(child);
            }

        }
        if (directChild.length == 0)
            return;
        let defaultProp = exmlConfig.getDefaultPropById(node.localName, node.namespace);
        let defaultType = exmlConfig.getPropertyType(defaultProp, className);
        if (DEBUG) {
            errorInfo = this.getPropertyStr(directChild[0]);
        }
        if (!defaultProp || !defaultType) {
            if (DEBUG) {
                egretbridge.$error(2012, this.currentClassName, errorInfo);
            }
            return;
        }
        this.addChildrenToProp(directChild, defaultType, defaultProp, varName, errorInfo, propList, node);
    }

    /**
     * @private
     * 解析内部类节点，并返回类名。
     */
    private parseInnerClass(node: egretbridge.XML): string {
        let parser = exmlParserPool.pop();
        if (!parser) {
            parser = new JSONParser();
        }
        let innerClassName = this.currentClassName + "$" + node.localName + innerClassCount++;
        parser.parseClass(node, innerClassName);
        exmlParserPool.push(parser);
        return innerClassName;
    }

    /**
     * @private
     * 添加多个子节点到指定的属性
     */
    private addChildrenToProp(children: Array<any>, type: string, prop: string,
        varName: string, errorInfo: string,
        propList: string[], node: egretbridge.XML): void {
        let nodeName = "";
        let childLength = children.length;
        let elementsContentForJson;
        if (childLength > 1) {
            if (type != TYPE_ARRAY) {
                if (DEBUG) {
                    egretbridge.$error(2011, this.currentClassName, prop, errorInfo);
                }
                return;
            }
            if (prop == ELEMENTS_CONTENT) {
                let values: string[] = [];
                for (let j = 0; j < childLength; j++) {
                    let item: egret.XML = children[j];
                    if (item.nodeType != 1) {
                        continue;
                    }
                    nodeName = this.addToCodeBlockForNode(item);
                    if (!this.isStateNode(item))
                        values.push(nodeName);
                }
                elementsContentForJson = values;
                prop = "$eleC";
            }
            else {
                let values: string[] = [];
                for (let j = 0; j < childLength; j++) {
                    let item: egret.XML = children[j];
                    if (item.nodeType != 1) {
                        continue;
                    }
                    nodeName = this.addNodeConfig(item);
                    if (!this.isStateNode(item))
                        values.push(nodeName);
                }
                elementsContentForJson = values;
            }
        }
        else {
            let firstChild: egretbridge.XML = children[0];
            if (type == TYPE_ARRAY) {
                if (firstChild.localName == TYPE_ARRAY) {
                    let values = [];
                    if (firstChild.children) {
                        let len = firstChild.children.length;
                        for (let k = 0; k < len; k++) {
                            let item = <any>firstChild.children[k];
                            if (item.nodeType != 1) {
                                continue;
                            }
                            nodeName = this.addNodeConfig(item);
                            this.getClassNameOfNode(item);
                            if (!this.isStateNode(item))
                                values.push(nodeName);
                        }
                    }
                    elementsContentForJson = values;
                }
                else {
                    if (prop == ELEMENTS_CONTENT && !this.isStateNode(firstChild)) {
                        nodeName = this.addToCodeBlockForNode(firstChild);
                        this.getClassNameOfNode(firstChild);
                        elementsContentForJson = [nodeName];
                        prop = "$eleC";
                    }
                    else {
                        nodeName = this.addNodeConfig(firstChild);
                        this.getClassNameOfNode(firstChild);
                        if (!this.isStateNode(firstChild)) {
                            elementsContentForJson = [nodeName];
                        }
                    }
                }
            }
            else if (firstChild.nodeType == 1) {
                if (type == TYPE_CLASS) {
                    if (childLength > 1) {
                        if (DEBUG) {
                            egretbridge.$error(2011, this.currentClassName, prop, errorInfo);
                        }
                        return;
                    }
                    nodeName = this.parseInnerClass(children[0]);
                    elementsContentForJson = nodeName;
                }
                else {
                    this.getClassNameOfNode(firstChild);
                    nodeName = this.addNodeConfig(firstChild);
                    elementsContentForJson = nodeName;
                }
            }
            else {
                nodeName = this.formatValue(prop, (<egretbridge.XMLText><any>firstChild).text, node);
                elementsContentForJson = nodeName;
            }
        }
        if (nodeName != "") {
            if (nodeName.indexOf("()") == -1)
                prop = this.formatKey(prop, nodeName);
            if (propList.indexOf(prop) == -1) {
                propList.push(prop);
            }
            else if (DEBUG) {
                egretbridge.$warn(2103, this.currentClassName, prop, errorInfo);
            }
            let tar = varName == "this" ? "$bs" : varName;
            jsonFactory.addContent(elementsContentForJson, this.currentClassName + "/" + tar, prop);
        }
    }

    private addToCodeBlockForNode(node: egret.XML): string {
        let moduleName = this.getClassNameOfNode(node);
        let id = node.attributes.id;
        let varName: string = id;
        //赋值基本属性
        this.addConfig(node, varName, moduleName);
        this.initlizeChildNode(node, varName);
        return varName;
    }

    /**
     * @private
     * 指定节点是否是属性节点
     */
    private isProperty(node: egretbridge.XML): boolean {
        if (node.hasOwnProperty("isProperty")) {
            return node["isProperty"];
        }
        let result: boolean;
        let name = node.localName;
        if (!name || node.nodeType !== 1 || !node.parent || this.isBasicTypeData(name)) {
            result = false;
        }
        else {
            let parent = node.parent;
            let index = name.indexOf(".")
            if (index != -1) {
                name = name.substr(0, index);
            }
            let className = exmlConfig.getClassNameById(parent.localName, parent.namespace);
            result = !!exmlConfig.getPropertyType(name, className);
        }
        node["isProperty"] = result;
        return result;
    }


    /**
     * @private
     * 是否是普通赋值的key
     */
    private isNormalKey(key: string): boolean {
        if (!key || key.indexOf(".") != -1
            || key.indexOf(":") != -1 || wingKeys.indexOf(key) != -1) {
            return false;
        }
        return true;
    }

    /**
     * @private
     * 格式化key
     */
    private formatKey(key: string, value: string): string {
        if (value.indexOf("%") != -1) {
            if (key == "height") {
                key = "percentHeight";
            }
            else if (key == "width") {
                key = "percentWidth";
            }
        }
        return key;
    }

    /**
     * @private
     * 格式化值
     * 
     * $$$$$$   这里需要注意，在skin的基本属性和动画都要在这里格式化值，
     *          主要是对数字的一些操作，色号还有百分比之类的进行换算
     */
    private formatValue(key: string, value: any, node: egretbridge.XML): any {
        if (!value) {
            value = "";
        }
        value = value.trim();
        let className = this.getClassNameOfNode(node);
        let type: string = exmlConfig.getPropertyType(key, className);
        if (DEBUG && !type) {
            egretbridge.$error(2005, this.currentClassName, key, this.toXMLString(node));
        }
        let bindingValue = this.formatBinding(value);
        if (bindingValue) {
            this.checkIdForState(node);
            let target = "this";
            if (node !== this.currentXML) {
                target = node.attributes["id"];
            }
            this.bindings.push(new EXBinding(target, key, bindingValue.templates, bindingValue.chainIndex));
            value = "";
        }
        else if (type == TYPE_PERCENTAGE) {
            if (value.indexOf("%") != -1) {
                value = this.unescapeHTMLEntity(value);
            }
            if (key == "percentHeight" || key == "percentWidth" || !value.includes("%"))
                value = parseFloat(value);
        }
        else {
            switch (type) {
                case "number":
                    if (value.indexOf("#") == 0) {
                        if (DEBUG && isNaN(<any>value.substring(1))) {
                            egretbridge.$warn(2021, this.currentClassName, key, value);
                        }
                        value = "0x" + value.substring(1);
                        value = parseInt(value, 0);
                    }
                    else if (value.indexOf("%") != -1) {
                        if (DEBUG && isNaN(<any>value.substr(0, value.length - 1))) {
                            egretbridge.$warn(2021, this.currentClassName, key, value);
                        }
                        value = parseFloat(value.substr(0, value.length - 1));
                    }
                    else if (DEBUG && isNaN(<any>value)) {
                        egretbridge.$warn(2021, this.currentClassName, key, value);
                    }
                    else if (value.indexOf("x") != -1 || value.indexOf("X") != -1) {
                        value = parseInt(value, 0);
                    }
                    else {
                        value = parseFloat(value);
                    }
                    break;
                case "boolean":
                    value = (value == "false" || !value) ? false : true;
                    break;
                default:
                    if (DEBUG) {
                        egretbridge.$error(2008, this.currentClassName, "string", key + ":" + type, this.toXMLString(node));
                    }
                    break;
            }
        }
        return value;
    }
    private formatBinding(value: string): { templates: string[], chainIndex: number[] } {
        if (!value) {
            return null;
        }
        value = value.trim();
        if (value.charAt(0) != "{" || value.charAt(value.length - 1) != "}") {
            return null;

        }
        value = value.substring(1, value.length - 1).trim();
        let templates = value.indexOf("+") == -1 ? [value] : this.parseTemplates(value);
        let chainIndex: number[] = [];
        let length = templates.length;
        for (let i = 0; i < length; i++) {
            let item = templates[i].trim();
            if (!item) {
                templates.splice(i, 1);
                i--;
                length--;
                continue;
            }
            var first = item.charAt(0);
            if (first == "'" || first == "\"") {
                continue;
            }
            //在动画或是绑定数据的时候进行类型转换
            if (first >= "0" && first <= "9" || first == "-") {
                templates[i] = parseFloat(templates[i]) as any;
                continue;
            }
            if (item.indexOf(".") == -1 && jsKeyWords.indexOf(item) != -1) {
                continue;
            }
            if (item.indexOf("this.") == 0) {
                item = item.substring(5);
            }
            let firstKey = item.split(".")[0];
            if (firstKey != HOST_COMPONENT && this.skinParts.indexOf(firstKey) == -1) {
                item = HOST_COMPONENT + "." + item;
            }
            templates[i] = item;
            chainIndex.push(i);
        }
        return { templates: templates, chainIndex: chainIndex };
    }

    private parseTemplates(value: string): string[] {
        //仅仅是表达式相加 如:{a.b+c.d}
        if (value.indexOf("'") == -1) {
            return value.split("+");
        }
        //包含文本的需要提取文本并对文本进行处理
        let isSingleQuoteLeak = false;//是否缺失单引号
        let trimText = "";
        value = value.split("\\\'").join("\v0\v");
        while (value.length > 0) {
            //'成对出现 这是第一个
            let index = value.indexOf("'");
            if (index == -1) {
                trimText += value;
                break;
            }
            trimText += value.substring(0, index + 1);
            value = value.substring(index + 1);
            //'成对出现 这是第二个
            index = value.indexOf("'");
            if (index == -1) {
                index = value.length - 1;
                isSingleQuoteLeak = true;
            }
            let quote = value.substring(0, index + 1);
            trimText += quote.split("+").join("\v1\v");
            value = value.substring(index + 1);
        }
        value = trimText.split("\v0\v").join("\\\'");
        //补全缺失的单引号
        if (isSingleQuoteLeak) {
            value += "'";
        }
        let templates = value.split("+");
        let length = templates.length;
        for (let i = 0; i < length; i++) {
            templates[i] = templates[i].split("\v1\v").join("+");
        }
        return templates;
    }
    /**
     * @private
     /**
     * 转换HTML实体字符为普通字符
     */
    private unescapeHTMLEntity(str: string): string {
        if (!str) {
            return "";
        }
        let length = htmlEntities.length;
        for (let i: number = 0; i < length; i++) {
            let arr = htmlEntities[i];
            let key: string = arr[0];
            let value: string = arr[1];
            str = str.split(value).join(key);
        }
        return str;
    }
    /**
     * @private
     * 复制基本属性
     * 
     */
    private addBaseConfig(): void {
        let varName: string = "this";
        this.addConfig(this.currentXML, "$bs");
        if (this.declarations) {
            let children: Array<any> = this.declarations.children;
            if (children && children.length > 0) {
                let length = children.length;
                for (let i = 0; i < length; i++) {
                    let decl: egretbridge.XML = children[i];
                    if (decl.nodeType != 1) {
                        continue;
                    }
                    this.addNodeConfig(decl);
                }
            }
        }
        this.initlizeChildNode(this.currentXML, varName);
        var stateIds = this.stateIds;
        if (stateIds.length > 0) {
            jsonFactory.addContent(stateIds, this.currentClassName + "/$bs", "$sId");
        }

        let skinConfig = this.skinParts;
        if (skinConfig.length > 0) {
            jsonFactory.addContent(skinConfig, this.currentClassName, "$sP");
        }
        this.currentXML.attributes.id = "";
        //生成视图状态代码
        this.createStates(this.currentXML);
        let states: EXState[];
        let node = this.currentXML;
        let nodeClassName = this.getClassNameOfNode(node);
        let attributes = node.attributes;
        let keys = Object.keys(attributes);
        let keysLength = keys.length;
        for (let m = 0; m < keysLength; m++) {
            let itemName = keys[m];
            let value: string = attributes[itemName];
            let index = itemName.indexOf(".");
            if (index != -1) {
                let key = itemName.substring(0, index);
                key = this.formatKey(key, value);
                let itemValue = this.formatValue(key, value, node);
                if (!itemValue) {
                    continue;
                }
                let stateName = itemName.substr(index + 1);
                states = this.getStateByName(stateName, node);
                let stateLength = states.length;
                if (stateLength > 0) {
                    for (let i = 0; i < stateLength; i++) {
                        let state = states[i];
                        state.addOverride(new EXSetProperty("", key, itemValue));
                    }
                }
            }
        }

        //生成视图配置
        let stateCode = this.stateCode;
        let length = stateCode.length;
        if (length > 0) {
            let stateConfig = {};
            for (let i = 0; i < length; i++) {
                let setPropertyConfig = [];
                for (let property of stateCode[i].setProperty) {
                    let tempProp = {};
                    for (let prop in property) {
                        if (prop == "indent") { }
                        else if (prop == "target") {
                            if (property[prop].search("this.") > -1) {
                                let temp = property[prop].slice("this.".length, property[prop].length)
                                tempProp[prop] = temp;
                            } else
                                tempProp[prop] = property[prop];
                        } else
                            tempProp[prop] = property[prop];
                    }
                    setPropertyConfig.push(tempProp);
                }

                let addItemsConfig = [];
                for (let property of stateCode[i].addItems) {
                    let tempProp = {};
                    for (let prop in property) {
                        if (prop != "indent") {
                            tempProp[prop] = property[prop];
                        }
                    }
                    addItemsConfig.push(tempProp);
                }
                stateConfig[stateCode[i].name] = {};
                if (setPropertyConfig.length > 0)
                    stateConfig[stateCode[i].name]["$ssP"] = setPropertyConfig;
                if (addItemsConfig.length > 0)
                    stateConfig[stateCode[i].name]["$saI"] = addItemsConfig;
            }
            jsonFactory.addContent(stateConfig, this.currentClassName, "$s");
        }
        //生成绑定配置
        let bindings = this.bindings;
        length = bindings.length;
        let bindingConfig = [];
        if (length > 0) {
            for (let binding of bindings) {
                let config = {};
                if (binding.templates.length == 1 && binding.chainIndex.length == 1) {
                    config["$bd"] = binding.templates;//data
                    config["$bt"] = binding.target;//target
                    config["$bp"] = binding.property;//property

                } else {
                    config["$bd"] = binding.templates;//data
                    config["$bt"] = binding.target;//target
                    config["$bc"] = binding.chainIndex;//chainIndex
                    config["$bp"] = binding.property;//property
                }
                bindingConfig.push(config);
            }
            jsonFactory.addContent(bindingConfig, this.currentClassName, "$b");
        }
        jsonFactory.addContent(euiShorten[nodeClassName] != undefined ? euiShorten[nodeClassName] : nodeClassName, this.currentClassName, "$sC");
    }

    /**
     * @private
     * 是否含有includeIn和excludeFrom属性
     */
    private isStateNode(node: egretbridge.XML): boolean {
        let attributes = node.attributes;
        return attributes.hasOwnProperty("includeIn") || attributes.hasOwnProperty("excludeFrom");
    }

    /**
     * @private
     * 获取视图状态名称列表
     */
    private getStateNames(): void {
        let root = this.currentXML;
        let className = exmlConfig.getClassNameById(root.localName, root.namespace);
        let type = exmlConfig.getPropertyType("states", className);
        if (type != TYPE_STATE) {
            return;
        }
        let statesValue = root.attributes["states"];
        if (statesValue) {
            delete root.attributes["states"];
        }
        let stateNames = this.stateNames;
        let stateChildren: any[];
        let children: any[] = root.children;
        let item: egretbridge.XML;
        if (children) {
            let length = children.length;
            for (let i = 0; i < length; i++) {
                item = children[i];
                if (item.nodeType == 1 &&
                    item.localName == "states") {
                    item.namespace = NS_W;
                    stateChildren = item.children;
                    break;
                }
            }
        }

        if (!stateChildren && !statesValue) {
            return;
        }

        if (DEBUG) {
            if (stateChildren && stateChildren.length == 0) {
                egretbridge.$warn(2102, this.currentClassName, this.getPropertyStr(item));
            }
            if (stateChildren && statesValue) {
                egretbridge.$warn(2103, this.currentClassName, "states", this.getPropertyStr(item));
            }
        }

        if (statesValue) {
            let states = statesValue.split(",");
            let length = states.length;
            for (let i = 0; i < length; i++) {
                let stateName: string = states[i].trim();
                if (!stateName) {
                    continue;
                }
                if (stateNames.indexOf(stateName) == -1) {
                    stateNames.push(stateName);
                }
                this.stateCode.push(new EXState(stateName));
            }
            return;
        }

        let length = stateChildren.length;
        for (let i = 0; i < length; i++) {
            let state: egretbridge.XML = stateChildren[i];
            if (state.nodeType != 1) {
                continue;
            }
            let stateGroups: Array<any> = [];
            let attributes = state.attributes;
            if (attributes["stateGroups"]) {
                let groups = attributes.stateGroups.split(",");
                let len = groups.length;
                for (let j = 0; j < len; j++) {
                    let group = groups[j].trim();
                    if (group) {
                        if (stateNames.indexOf(group) == -1) {
                            stateNames.push(group);
                        }
                        stateGroups.push(group);
                    }
                }
            }
            let stateName = attributes.name;
            if (stateNames.indexOf(stateName) == -1) {
                stateNames.push(stateName);
            }
            this.stateCode.push(new EXState(stateName, stateGroups));
        }
    }

    /**
     * @private
     * 解析视图状态代码
     */
    private createStates(parentNode: egretbridge.XML): void {
        let items: Array<any> = parentNode.children;
        if (!items) {
            return;
        }
        let length = items.length;
        for (let i = 0; i < length; i++) {
            let node: egretbridge.XML = items[i];
            if (node.nodeType != 1 || this.isInnerClass(node)) {
                continue;
            }
            this.createStates(node);
            if (node.namespace == NS_W || !node.localName) {
                continue;
            }
            if (this.isProperty(node)) {
                let prop = node.localName;
                let index = prop.indexOf(".");
                let children: Array<any> = node.children;
                if (index == -1 || !children || children.length == 0) {
                    continue;
                }
                let stateName = prop.substring(index + 1);
                prop = prop.substring(0, index);
                let className = this.getClassNameOfNode(parentNode);
                let type = exmlConfig.getPropertyType(prop, className);
                if (DEBUG) {
                    if (type == TYPE_ARRAY) {
                        egretbridge.$error(2013, this.currentClassName, this.getPropertyStr(node));
                    }
                    if (children.length > 1) {
                        egretbridge.$error(2011, this.currentClassName, prop, this.getPropertyStr(node));
                    }
                }

                let firstChild: egretbridge.XML = children[0];
                let value: string;
                if (firstChild.nodeType == 1) {
                    this.addNodeConfig(firstChild);
                    this.checkIdForState(firstChild);
                    value = "this." + firstChild.attributes.id;
                }
                else {
                    value = this.formatValue(prop, (<egretbridge.XMLText><any>firstChild).text, parentNode);
                }

                let states = this.getStateByName(stateName, node);
                let l = states.length;
                if (l > 0) {
                    for (let j: number = 0; j < l; j++) {
                        let state = states[j];
                        state.addOverride(new EXSetProperty(parentNode.attributes.id, prop, value));
                    }
                }
            }
            else if (this.containsState(node)) {
                let attributes = node.attributes;
                let id = attributes.id;
                this.getClassNameOfNode(node);
                this.checkIdForState(node);
                let stateName: string;
                let states: Array<EXState>;
                let state: EXState;
                if (this.isStateNode(node)) {
                    let propertyName = "";
                    let parent: egretbridge.XML = node.parent;
                    if (parent.localName == TYPE_ARRAY)
                        parent = parent.parent;
                    if (parent && parent.parent) {
                        if (this.isProperty(parent))
                            parent = parent.parent;
                    }

                    if (parent && parent != this.currentXML) {
                        propertyName = parent.attributes.id;
                        this.checkIdForState(parent);
                    }
                    let positionObj = this.findNearNodeId(node);
                    let stateNames: string[] = [];
                    if (attributes.includeIn) {
                        stateNames = attributes.includeIn.split(",");
                    }
                    else {
                        let excludeNames = attributes.excludeFrom.split(",");
                        let stateLength = excludeNames.length;
                        for (let j = 0; j < stateLength; j++) {
                            let name: string = excludeNames[j];
                            this.getStateByName(name, node);//检查exlcudeFrom是否含有未定义的视图状态名
                        }
                        stateLength = this.stateCode.length;
                        for (let j = 0; j < stateLength; j++) {
                            state = this.stateCode[j];
                            if (excludeNames.indexOf(state.name) == -1) {
                                stateNames.push(state.name);
                            }
                        }
                    }
                    let len = stateNames.length;
                    for (let k = 0; k < len; k++) {
                        stateName = stateNames[k];
                        states = this.getStateByName(stateName, node);
                        if (states.length > 0) {
                            let l = states.length;
                            for (let j = 0; j < l; j++) {
                                state = states[j];
                                state.addOverride(new EXAddItems(id, propertyName,
                                    positionObj.position, positionObj.relativeTo));
                            }
                        }
                    }
                }

                let names = Object.keys(attributes);
                let namesLength = names.length;
                for (let m = 0; m < namesLength; m++) {
                    let name = names[m];
                    let value: string = attributes[name];
                    let index: number = name.indexOf(".");
                    if (index != -1) {
                        let key = name.substring(0, index);
                        key = this.formatKey(key, value);
                        let bindingValue = this.formatBinding(value);
                        if (!bindingValue) {
                            value = this.formatValue(key, value, node);
                            if (value == undefined) {
                                continue;
                            }
                        }
                        stateName = name.substr(index + 1);
                        states = this.getStateByName(stateName, node);
                        let l = states.length;
                        if (l > 0) {
                            for (let j = 0; j < l; j++) {
                                state = states[j];
                                if (bindingValue) {
                                    state.addOverride(new EXSetStateProperty(id, key, bindingValue.templates, bindingValue.chainIndex));
                                } else {
                                    state.addOverride(new EXSetProperty(id, key, value));
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    /**
     * @private
     * 检查指定的ID是否创建了类成员变量，若没创建则为其创建。
     */
    private checkIdForState(node: egretbridge.XML): void {
        if (!node || this.currentClass.getVariableByName(node.attributes.id)) {
            return;
        }
        this.createVarForNode(node);
        let id: string = node.attributes.id;
        let funcName = id;
        this.currentClass.getFuncByName(funcName);
    }

    /**
     * @private
     * 通过视图状态名称获取对应的视图状态
     */
    private getStateByName(name: string, node: egretbridge.XML): EXState[] {
        let states: EXState[] = [];
        let stateCode = this.stateCode;
        let length = stateCode.length;
        for (let i = 0; i < length; i++) {
            let state = stateCode[i];
            if (state.name == name) {
                if (states.indexOf(state) == -1)
                    states.push(state);
            }
            else if (state.stateGroups.length > 0) {
                let found = false;
                let len = state.stateGroups.length;
                for (let j: number = 0; j < len; j++) {
                    let g = state.stateGroups[j];
                    if (g == name) {
                        found = true;
                        break;
                    }
                }
                if (found) {
                    if (states.indexOf(state) == -1)
                        states.push(state);
                }
            }
        }
        if (DEBUG && states.length == 0) {
            egretbridge.$error(2006, this.currentClassName, name, this.toXMLString(node));
        }
        return states;
    }

    /**
     * @private
     * 寻找节点的临近节点ID和位置
     */
    private findNearNodeId(node: egretbridge.XML): any {
        let parentNode: egretbridge.XML = node.parent;
        let targetId = "";
        let position: number;
        let index = -1;
        let preItem: egretbridge.XML;
        let afterItem: egretbridge.XML;
        let found = false;
        let children: Array<any> = parentNode.children;
        let length = children.length;
        for (let i = 0; i < length; i++) {
            let item = children[i];
            if (this.isProperty(item))
                continue;
            if (item == node) {
                found = true;
                index = i;
            }
            else {
                if (found && !afterItem && !this.isStateNode(item)) {
                    afterItem = item;
                }
            }
            if (!found && !this.isStateNode(item))
                preItem = item;
        }
        if (index == 0) {
            position = sys.AddPosition.FIRST;
            return { position: position, relativeTo: targetId };
        }
        if (index == length - 1) {
            position = sys.AddPosition.LAST;
            return { position: position, relativeTo: targetId };
        }
        if (afterItem) {
            position = sys.AddPosition.BEFORE;
            targetId = afterItem.attributes.id;
            if (targetId) {
                this.checkIdForState(afterItem);
                return { position: position, relativeTo: targetId };
            }
        }
        return { position: sys.AddPosition.LAST, relativeTo: targetId };
    }


    /**
     * @private
     * 获取节点的完整类名，包括模块名
     */
    private getClassNameOfNode(node: egretbridge.XML): string {
        let className = exmlConfig.getClassNameById(node.localName, node.namespace);
        if (DEBUG && !className) {
            egretbridge.$error(2003, this.currentClassName, this.toXMLString(node));
        }
        return className;
    }

    /**
     * 获取重复的ID名
     */
    private getRepeatedIds(xml: egretbridge.XML): string[] {
        let result: string[] = [];
        this.repeatedIdMap = {};
        this.getIds(xml, result);
        return result;
    }

    private getIds(xml: any, result: Array<any>): void {
        if (xml.namespace != NS_W && xml.attributes.id) {
            let id: string = xml.attributes.id;
            if (this.repeatedIdMap[id]) {
                result.push(this.toXMLString(xml));
            }
            else {
                this.repeatedIdMap[id] = true;
            }
        }
        let children: Array<any> = xml.children;
        if (children) {
            let length: number = children.length;
            for (let i: number = 0; i < length; i++) {
                let node: any = children[i];
                if (node.nodeType !== 1 || this.isInnerClass(node)) {
                    continue;
                }
                this.getIds(node, result);
            }
        }
    }

    private toXMLString(node: egretbridge.XML): string {
        if (!node) {
            return "";
        }
        let str: string = "  at <" + node.name;
        let attributes = node.attributes;
        let keys = Object.keys(attributes);
        let length = keys.length;
        for (let i = 0; i < length; i++) {
            let key = keys[i];
            let value: string = attributes[key];
            if (key == "id" && value.substring(0, 2) == "__") {
                continue;
            }
            str += " " + key + "=\"" + value + "\"";
        }
        if (node.children.length == 0) {
            str += "/>";
        }
        else {
            str += ">";
        }
        return str;
    }

    /**
     * 清理声明节点里的状态标志
     */
    private checkDeclarations(declarations: egretbridge.XML, list: string[]): void {
        if (!declarations) {
            return;
        }
        let children = declarations.children;
        if (children) {
            let length = children.length;
            for (let i = 0; i < length; i++) {
                let node: any = children[i];
                if (node.nodeType != 1) {
                    continue;
                }
                if (node.attributes.includeIn) {
                    list.push(this.toXMLString(node));
                }
                if (node.attributes.excludeFrom) {
                    list.push(this.toXMLString(node))
                }
                this.checkDeclarations(node, list);
            }
        }
    }
    private getPropertyStr(child: any): string {
        let parentStr = this.toXMLString(child.parent);
        let childStr = this.toXMLString(child).substring(5);
        return parentStr + "\n      \t" + childStr;
    }
}


module sys {
    export const enum AddPosition {
        /**
         * @private
         * 添加父级容器的底层
         */
        FIRST,
        /**
         * @private
         * 添加在父级容器的顶层
         */
        LAST,
        /**
         * @private
         * 添加在相对对象之前
         */
        BEFORE,
        /**
         * @private
         * 添加在相对对象之后
         */
        AFTER
    }
}
