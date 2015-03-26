/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="node.d.ts"/>
/// <reference path="exml_config.ts"/>
var xml = require("../core/xml.js");
var globals = require("../core/globals.js");
var CodeUtil = require("../core/code_util.js");
var file = require("../core/file.js");
var exml_config = require("./exml_config.js");
var compiler;
function compile(exmlPath, srcPath) {
    exmlPath = exmlPath.split("\\").join("/");
    srcPath = srcPath.split("\\").join("/");
    if (srcPath.charAt(srcPath.length - 1) != "/") {
        srcPath += "/";
    }
    if (!file.exists(exmlPath)) {
        globals.exit(2001, exmlPath);
    }
    var className = exmlPath.substring(srcPath.length, exmlPath.length - 5);
    className = className.split("/").join(".");
    var xmlString = file.read(exmlPath);
    try {
        var xmlData = xml.parse(xmlString);
    }
    catch (e) {
        globals.exit(2002, exmlPath);
    }
    if (!xmlData) {
        globals.exit(2002, exmlPath);
    }
    if (!compiler) {
        compiler = new EXMLCompiler();
    }
    var tsText = compiler.compile(xmlData, className, srcPath, exmlPath);
    var tsPath = exmlPath.substring(0, exmlPath.length - 5) + ".ts";
    file.save(tsPath, tsText);
}
;
exports.compile = compile;
var EXMLCompiler = (function () {
    /**
     * 构造函数
     */
    function EXMLCompiler() {
        this.repeatedIdDic = {};
        this.exmlPath = "";
        this.basicTypes = ["Array", "boolean", "string", "number"];
        /**
         * 延迟赋值字典
         */
        this.delayAssignmentDic = {};
        this.htmlEntities = [["<", "&lt;"], [">", "&gt;"], ["&", "&amp;"], ["\"", "&quot;"], ["'", "&apos;"]];
    }
    /**
     * 获取重复的ID名
     */
    EXMLCompiler.prototype.getRepeatedIds = function (xml) {
        var result = [];
        this.getIds(xml, result);
        this.repeatedIdDic = {};
        return result;
    };
    EXMLCompiler.prototype.getIds = function (xml, result) {
        if (xml.namespace != EXMLCompiler.W && xml["$id"]) {
            var id = xml.$id;
            if (this.repeatedIdDic[id]) {
                result.push(this.toXMLString(xml));
            }
            else {
                this.repeatedIdDic[id] = true;
            }
        }
        var children = xml.children;
        if (children) {
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var node = children[i];
                this.getIds(node, result);
            }
        }
    };
    EXMLCompiler.prototype.toXMLString = function (node) {
        if (!node) {
            return "";
        }
        var str = "  at <" + node.name;
        for (var key in node) {
            if (key.charAt(0) == "$") {
                var value = node[key];
                key = key.substring(1);
                if (key == "id" && value.substring(0, 2) == "__") {
                    continue;
                }
                str += " " + key + "=\"" + value + "\"";
            }
        }
        if (node.isSelfClosing) {
            str += "/>";
        }
        else {
            str += ">";
        }
        return str;
    };
    /**
     * 编译指定的XML对象为TypeScript类。
     * 注意:编译前要先注入egret-manifest.xml清单文件给manifestData属性。
     * @param xmlData 要编译的EXML文件内容
     * @param className 要编译成的完整类名，包括命名空间。
     */
    EXMLCompiler.prototype.compile = function (xmlData, className, srcPath, exmlPath) {
        if (!this.exmlConfig) {
            this.exmlConfig = new exml_config.getInstance();
        }
        this.exmlPath = exmlPath;
        this.currentXML = xmlData;
        this.currentClassName = className;
        this.exmlConfig.srcPath = srcPath;
        this.delayAssignmentDic = {};
        this.idDic = {};
        this.idToNode = {};
        this.stateCode = [];
        this.stateNames = [];
        this.skinParts = [];
        this.declarations = null;
        this.currentClass = new CpClass();
        this.stateIds = [];
        var index = className.lastIndexOf(".");
        if (index != -1) {
            this.currentClass.moduleName = className.substring(0, index);
            this.currentClass.className = className.substring(index + 1);
            this.currentClass.classPath = className.split(".").join("/") + ".ts";
        }
        else {
            this.currentClass.className = className;
        }
        this.startCompile();
        var resutlCode = this.currentClass.toCode();
        this.currentClass = null;
        return resutlCode;
    };
    /**
     * 开始编译
     */
    EXMLCompiler.prototype.startCompile = function () {
        var result = this.getRepeatedIds(this.currentXML);
        if (result.length > 0) {
            globals.exit(2004, this.exmlPath, result.join("\n"));
        }
        this.currentClass.superClass = this.getPackageByNode(this.currentXML);
        this.getStateNames();
        var children = this.currentXML.children;
        if (children) {
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var node = children[i];
                if (node.namespace == EXMLCompiler.W && node.localName == EXMLCompiler.DECLARATIONS) {
                    this.declarations = node;
                    break;
                }
            }
        }
        var list = [];
        this.checkDeclarations(this.declarations, list);
        if (list.length > 0) {
            globals.warn(2101, this.exmlPath, list.join("\n"));
        }
        if (!this.currentXML.namespace) {
            globals.exit(2017, this.exmlPath, this.toXMLString(this.currentXML));
        }
        this.addIds(this.currentXML.children);
        this.currentClass.addVariable(new CpVariable("__s", Modifiers.M_PRIVATE, "Function", "egret.gui.setProperties"));
        this.createConstructFunc();
    };
    /**
     * 清理声明节点里的状态标志
     */
    EXMLCompiler.prototype.checkDeclarations = function (declarations, list) {
        if (!declarations) {
            return;
        }
        var children = declarations.children;
        if (children) {
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var node = children[i];
                if (node["$includeIn"]) {
                    list.push(this.toXMLString(node));
                    delete node.$includeIn;
                }
                if (node["$excludeFrom"]) {
                    list.push(this.toXMLString(node));
                    delete node.$excludeFrom;
                }
                this.checkDeclarations(node, list);
            }
        }
    };
    /**
     * 添加必须的id
     */
    EXMLCompiler.prototype.addIds = function (items) {
        if (!items) {
            return;
        }
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var node = items[i];
            if (!node.namespace) {
                globals.exit(2017, this.exmlPath, this.toXMLString(node));
            }
            this.addIds(node.children);
            if (node.namespace == EXMLCompiler.W) {
            }
            else if (node["$id"]) {
                this.idToNode[node.$id] = node;
                if (this.skinParts.indexOf(node.$id) == -1) {
                    this.skinParts.push(node.$id);
                }
                this.createVarForNode(node);
                if (this.isStateNode(node))
                    this.stateIds.push(node.$id);
            }
            else if (node.localName) {
                if (this.isProperty(node)) {
                    var prop = node.localName;
                    var index = prop.indexOf(".");
                    var children = node.children;
                    if (index == -1 || !children || children.length == 0) {
                        continue;
                    }
                    var firstChild = children[0];
                    this.stateIds.push(firstChild.$id);
                }
                else {
                    this.createIdForNode(node);
                    this.idToNode[node.$id] = node;
                    if (this.isStateNode(node))
                        this.stateIds.push(node.$id);
                }
            }
        }
    };
    /**
     * 检测指定节点的属性是否含有视图状态
     */
    EXMLCompiler.prototype.containsState = function (node) {
        if (node["$includeIn"] || node["$excludeFrom"]) {
            return true;
        }
        for (var name in node) {
            if (name.charAt(0) == "$") {
                if (name.indexOf(".") != -1) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * 为指定节点创建id属性
     */
    EXMLCompiler.prototype.createIdForNode = function (node) {
        var idName = this.getNodeId(node);
        if (this.idDic[idName] == null)
            this.idDic[idName] = 1;
        else
            this.idDic[idName]++;
        idName += this.idDic[idName];
        node.$id = idName;
    };
    /**
     * 获取节点ID
     */
    EXMLCompiler.prototype.getNodeId = function (node) {
        if (node["$id"])
            return node.$id;
        return "__";
    };
    /**
     * 为指定节点创建变量
     */
    EXMLCompiler.prototype.createVarForNode = function (node) {
        var moduleName = this.getPackageByNode(node);
        if (moduleName == "")
            return;
        if (!this.currentClass.containsVar(node.$id))
            this.currentClass.addVariable(new CpVariable(node.$id, Modifiers.M_PUBLIC, moduleName));
    };
    /**
     * 为指定节点创建初始化函数,返回函数名引用
     */
    EXMLCompiler.prototype.createFuncForNode = function (node) {
        var className = node.localName;
        if (this.isProperty(node))
            return "";
        var isBasicType = this.isBasicTypeData(className);
        if (isBasicType)
            return this.createBasicTypeForNode(node);
        var moduleName = this.getPackageByNode(node);
        var func = new CpFunction;
        var tailName = "_i";
        var id = node.$id;
        func.name = id + tailName;
        func.returnType = moduleName;
        var cb = new CpCodeBlock;
        var varName = "t";
        if (className == "Object") {
            cb.addVar(varName, "any", "{}");
        }
        else {
            cb.addVar(varName, moduleName, "new " + moduleName + "()");
        }
        var containsId = this.currentClass.containsVar(node.$id);
        if (containsId) {
            cb.addAssignment("this." + node.$id, varName);
        }
        this.addAttributesToCodeBlock(cb, varName, node);
        this.initlizeChildNode(node, cb, varName);
        if (this.delayAssignmentDic[id]) {
            var length = this.delayAssignmentDic[id].length;
            for (var i = 0; i < length; i++) {
                var delaycb = this.delayAssignmentDic[id][i];
                cb.concat(delaycb);
            }
        }
        cb.addReturn(varName);
        func.codeBlock = cb;
        this.currentClass.addFunction(func);
        return "this." + func.name + "()";
    };
    /**
     * 检查目标类名是否是基本数据类型
     */
    EXMLCompiler.prototype.isBasicTypeData = function (className) {
        return this.basicTypes.indexOf(className) != -1;
    };
    /**
     * 为指定基本数据类型节点实例化,返回实例化后的值。
     */
    EXMLCompiler.prototype.createBasicTypeForNode = function (node) {
        var className = node.localName;
        var returnValue = "";
        var child;
        var varItem = this.currentClass.getVariableByName(node.$id);
        switch (className) {
            case "Array":
                var values = [];
                var children = node.children;
                if (children) {
                    var length = children.length;
                    for (var i = 0; i < length; i++) {
                        var child = children[i];
                        values.push(this.createFuncForNode(child));
                    }
                }
                returnValue = "[" + values.join(",") + "]";
                break;
            case "boolean":
                returnValue = node.text.trim();
                returnValue = (returnValue == "false" || !returnValue) ? "false" : "true";
                break;
            case "number":
                returnValue = node.text.trim();
                if (returnValue.indexOf("%") != -1)
                    returnValue = returnValue.substring(0, returnValue.length - 1);
                break;
            case "string":
                returnValue = this.formatString(node.toString());
                break;
        }
        if (varItem)
            varItem.defaultValue = returnValue;
        return returnValue;
    };
    /**
     * 将节点属性赋值语句添加到代码块
     */
    EXMLCompiler.prototype.addAttributesToCodeBlock = function (cb, varName, node) {
        var keyList = [];
        var key;
        var value;
        for (key in node) {
            if (key.charAt(0) != "$" || !this.isNormalKey(key)) {
                continue;
            }
            keyList.push(key);
        }
        keyList.sort(); //排序一下防止出现随机顺序
        var className = this.exmlConfig.getClassNameById(node.localName, node.namespace);
        var length = keyList.length;
        var values = [];
        var keys = [];
        for (var i = 0; i < length; i++) {
            key = keyList[i];
            value = node[key];
            key = this.formatKey(key.substring(1), value);
            value = this.formatValue(key, value, node);
            if (!value) {
                continue;
            }
            if (this.currentClass.containsVar(value)) {
                var id = node.$id;
                var codeLine = "this." + id + " = t;";
                if (!this.currentClass.containsVar(id))
                    this.createVarForNode(node);
                if (!cb.containsCodeLine(codeLine)) {
                    cb.addCodeLineAt(codeLine, 1);
                }
                var delayCb = new CpCodeBlock();
                if (varName == KeyWords.KW_THIS) {
                    delayCb.addAssignment(varName, "this." + value, key);
                }
                else {
                    delayCb.startIf("this." + id);
                    delayCb.addAssignment("this." + id, "this." + value, key);
                    delayCb.endBlock();
                }
                if (!this.delayAssignmentDic[value]) {
                    this.delayAssignmentDic[value] = [];
                }
                this.delayAssignmentDic[value].push(delayCb);
                value = "this." + value;
            }
            if (this.exmlConfig.isStyleProperty(key, className)) {
                cb.addCodeLine(varName + ".setStyle(\"" + key + "\"," + value + ")");
            }
            else {
                keys.push(key);
                values.push(value);
            }
        }
        var length = keys.length;
        if (length > 1) {
            var allKey = "[\"" + keys.join("\",\"") + "\"]";
            var allValue = "[" + values.join(",") + "]";
            cb.addCodeLine("this.__s(" + varName + "," + allKey + "," + allValue + ")");
        }
        else if (length == 1) {
            cb.addAssignment(varName, values[0], keys[0]);
        }
    };
    /**
     * 初始化子项
     */
    EXMLCompiler.prototype.initlizeChildNode = function (node, cb, varName) {
        var children = node.children;
        if (!children || children.length == 0)
            return;
        var className = this.exmlConfig.getClassNameById(node.localName, node.namespace);
        var directChild = [];
        var length = children.length;
        var propList = [];
        var isContainer = this.exmlConfig.isInstanceOf(className, "egret.gui.IContainer");
        for (var i = 0; i < length; i++) {
            var child = children[i];
            var prop = child.localName;
            if (child.namespace == EXMLCompiler.W) {
                continue;
            }
            if (this.isProperty(child)) {
                if (!this.isNormalKey(prop)) {
                    continue;
                }
                var type = this.exmlConfig.getPropertyType(child.localName, className);
                if (!type) {
                    globals.exit(2005, this.exmlPath, child.localName, this.getPropertyStr(child));
                }
                if (!child.children || child.children.length == 0) {
                    globals.warn(2102, this.exmlPath, this.getPropertyStr(child));
                    continue;
                }
                var errorInfo = this.getPropertyStr(child);
                this.addChildrenToProp(child.children, type, prop, cb, varName, errorInfo, propList, className, isContainer);
            }
            else {
                directChild.push(child);
            }
        }
        if (directChild.length == 0)
            return;
        var defaultProp = this.exmlConfig.getDefaultPropById(node.localName, node.namespace);
        var defaultType = this.exmlConfig.getPropertyType(defaultProp, className);
        var errorInfo = this.getPropertyStr(directChild[0]);
        if (!defaultProp || !defaultType) {
            globals.exit(2012, this.exmlPath, errorInfo);
        }
        this.addChildrenToProp(directChild, defaultType, defaultProp, cb, varName, errorInfo, propList, className, isContainer);
    };
    /**
     * 添加多个子节点到指定的属性
     */
    EXMLCompiler.prototype.addChildrenToProp = function (children, type, prop, cb, varName, errorInfo, propList, className, isContainer) {
        var childFunc = "";
        var childLength = children.length;
        if (childLength > 1) {
            if (type != "Array") {
                globals.exit(2011, this.exmlPath, prop, errorInfo);
            }
            var values = [];
            for (var j = 0; j < childLength; j++) {
                var item = children[j];
                childFunc = this.createFuncForNode(item);
                var childClassName = this.exmlConfig.getClassNameById(item.localName, item.namespace);
                if (!this.isStateNode(item))
                    values.push(childFunc);
            }
            childFunc = "[" + values.join(",") + "]";
        }
        else {
            var firstChild = children[0];
            if (type == "Array") {
                if (firstChild.localName == "Array") {
                    values = [];
                    if (firstChild.children) {
                        var len = firstChild.children.length;
                        for (var k = 0; k < len; k++) {
                            item = firstChild.children[k];
                            childFunc = this.createFuncForNode(item);
                            childClassName = this.exmlConfig.getClassNameById(item.localName, item.namespace);
                            if (!this.isStateNode(item))
                                values.push(childFunc);
                        }
                    }
                    childFunc = "[" + values.join(",") + "]";
                }
                else {
                    childFunc = this.createFuncForNode(firstChild);
                    var childClassName = this.exmlConfig.getClassNameById(firstChild.localName, firstChild.namespace);
                    if (!this.isStateNode(firstChild))
                        childFunc = "[" + childFunc + "]";
                    else
                        childFunc = "[]";
                }
            }
            else {
                var targetClass = this.exmlConfig.getClassNameById(firstChild.localName, firstChild.namespace);
                if (!this.exmlConfig.isInstanceOf(targetClass, type)) {
                    globals.exit(2008, this.exmlPath, targetClass, prop, errorInfo);
                }
                childFunc = this.createFuncForNode(firstChild);
            }
        }
        if (childFunc != "") {
            if (childFunc.indexOf("()") == -1)
                prop = this.formatKey(prop, childFunc);
            if (propList.indexOf(prop) == -1) {
                propList.push(prop);
            }
            else {
                globals.warn(2103, this.exmlPath, prop, errorInfo);
            }
            if (this.exmlConfig.isStyleProperty(prop, className)) {
                cb.addCodeLine(varName + ".setStyle(\"" + prop + "\"," + childFunc + ")");
            }
            else {
                cb.addAssignment(varName, childFunc, prop);
            }
        }
    };
    EXMLCompiler.prototype.getPropertyStr = function (child) {
        var parentStr = this.toXMLString(child.parent);
        var childStr = this.toXMLString(child).substring(5);
        return parentStr + "\n      \t" + childStr;
    };
    /**
     * 指定节点是否是属性节点
     */
    EXMLCompiler.prototype.isProperty = function (node) {
        var name = node.localName;
        if (name == null)
            return true;
        if (this.isBasicTypeData(name))
            return false;
        var firstChar = name.charAt(0);
        return firstChar < "A" || firstChar > "Z";
    };
    /**
     * 是否是普通赋值的key
     */
    EXMLCompiler.prototype.isNormalKey = function (key) {
        if (!key || key.indexOf(".") != -1 || EXMLCompiler.wingKeys.indexOf(key) != -1)
            return false;
        return true;
    };
    /**
     * 格式化key
     */
    EXMLCompiler.prototype.formatKey = function (key, value) {
        if (value.indexOf("%") != -1) {
            if (key == "height")
                key = "percentHeight";
            else if (key == "width")
                key = "percentWidth";
        }
        return key;
    };
    /**
     * 格式化值
     */
    EXMLCompiler.prototype.formatValue = function (key, value, node) {
        if (!value) {
            value = "";
        }
        var stringValue = value; //除了字符串，其他类型都去除两端多余空格。
        value = value.trim();
        var className = this.exmlConfig.getClassNameById(node.localName, node.namespace);
        var type = this.exmlConfig.getPropertyType(key, className);
        if (!type) {
            globals.exit(2005, this.exmlPath, key, this.toXMLString(node));
        }
        if (type != "string" && value.charAt(0) == "{" && value.charAt(value.length - 1) == "}") {
            value = value.substr(1, value.length - 2);
            value = value.trim();
            if (value.indexOf("this.") == 0) {
                if (CodeUtil.isVariableWord(value.substring(5))) {
                    value = value.substring(5);
                }
            }
            if (CodeUtil.isVariableWord(value)) {
                var targetNode = this.idToNode[value];
                if (!targetNode) {
                    globals.exit(2010, this.exmlPath, key, value, this.toXMLString(node));
                }
                var targetClass = this.exmlConfig.getClassNameById(targetNode.localName, targetNode.namespace);
                if (!this.exmlConfig.isInstanceOf(targetClass, type)) {
                    globals.exit(2008, this.exmlPath, targetClass, key, this.toXMLString(node));
                }
            }
            else {
                globals.exit(2009, this.exmlPath, this.toXMLString(node));
            }
        }
        else if (type == "Class" && value.indexOf("@ButtonSkin(") == 0 && value.charAt(value.length - 1) == ")") {
            value = value.substring(12, value.length - 1);
            var skinNames = value.split(",");
            if (skinNames.length > 3) {
                globals.exit(2018, this.exmlPath, this.toXMLString(node));
            }
            for (var i = skinNames.length - 1; i >= 0; i--) {
                var skinName = skinNames[i];
                skinName = skinName.trim();
                var firstChar = skinName.charAt(0);
                var lastChar = skinName.charAt(skinName.length - 1);
                if (firstChar != lastChar || (firstChar != "'" && firstChar != "\"")) {
                    globals.exit(2018, this.exmlPath, this.toXMLString(node));
                    break;
                }
                skinNames[i] = this.formatString(skinName.substring(1, skinName.length - 1));
            }
            value = "new egret.gui.ButtonSkin(" + skinNames.join(",") + ")";
        }
        else if (key == "scale9Grid" && type == "egret.Rectangle") {
            var rect = value.split(",");
            if (rect.length != 4 || isNaN(parseInt(rect[0])) || isNaN(parseInt(rect[1])) || isNaN(parseInt(rect[2])) || isNaN(parseInt(rect[3]))) {
                globals.exit(2016, this.exmlPath, this.toXMLString(node));
            }
            value = "egret.gui.getScale9Grid(\"" + value + "\")";
        }
        else {
            var orgValue = value;
            switch (type) {
                case "egret.gui.IFactory":
                    value = "new egret.gui.ClassFactory(" + orgValue + ")";
                case "Class":
                    if (!this.exmlConfig.checkClassName(orgValue)) {
                        globals.exit(2015, this.exmlPath, orgValue, this.toXMLString(node));
                    }
                    if (value == this.currentClassName) {
                        globals.exit(2014, this.exmlPath, this.toXMLString(node));
                    }
                    break;
                case "number":
                    if (value.indexOf("#") == 0)
                        value = "0x" + value.substring(1);
                    else if (value.indexOf("%") != -1)
                        value = (parseFloat(value.substr(0, value.length - 1))).toString();
                    break;
                case "boolean":
                    value = (value == "false" || !value) ? "false" : "true";
                    break;
                case "string":
                case "any":
                    value = this.formatString(stringValue);
                    break;
                default:
                    globals.exit(2008, this.exmlPath, "string", key + ":" + type, this.toXMLString(node));
                    break;
            }
        }
        return value;
    };
    /**
     * 格式化字符串
     */
    EXMLCompiler.prototype.formatString = function (value) {
        value = this.unescapeHTMLEntity(value);
        value = value.split("\n").join("\\n");
        value = value.split("\r").join("\\n");
        value = value.split("\"").join("\\\"");
        value = "\"" + value + "\"";
        return value;
    };
    /**
     /**
     * 转换HTML实体字符为普通字符
     */
    EXMLCompiler.prototype.unescapeHTMLEntity = function (str) {
        if (!str)
            return "";
        var list = this.htmlEntities;
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var arr = list[i];
            var key = arr[0];
            var value = arr[1];
            str = str.split(value).join(key);
        }
        return str;
    };
    /**
     * 创建构造函数
     */
    EXMLCompiler.prototype.createConstructFunc = function () {
        var cb = new CpCodeBlock;
        cb.addEmptyLine();
        var varName = KeyWords.KW_THIS;
        this.addAttributesToCodeBlock(cb, varName, this.currentXML);
        if (this.declarations) {
            var children = this.declarations.children;
            if (children && children.length > 0) {
                var length = children.length;
                for (var i = 0; i < length; i++) {
                    var decl = children[i];
                    var funcName = this.createFuncForNode(decl);
                    if (funcName != "") {
                        cb.addCodeLine(funcName + ";");
                    }
                }
            }
        }
        this.initlizeChildNode(this.currentXML, cb, varName);
        var id;
        if (this.stateIds.length > 0) {
            length = this.stateIds.length;
            for (var i = 0; i < length; i++) {
                id = this.stateIds[i];
                cb.addCodeLine("this." + id + "_i();");
            }
            cb.addEmptyLine();
        }
        length = this.skinParts.length;
        if (length > 0) {
            for (i = 0; i < length; i++) {
                this.skinParts[i] = "\"" + this.skinParts[i] + "\"";
            }
            var skinPartStr = "[" + this.skinParts.join(",") + "]";
            var skinPartVar = new CpVariable("_skinParts", Modifiers.M_PRIVATE, "Array<string>", skinPartStr, true);
            this.currentClass.addVariable(skinPartVar);
            var skinPartFunc = new CpFunction();
            skinPartFunc.name = "skinParts";
            skinPartFunc.modifierName = Modifiers.M_PUBLIC;
            skinPartFunc.isGet = true;
            skinPartFunc.returnType = "Array<string>";
            var skinPartCB = new CpCodeBlock();
            skinPartCB.addReturn(this.currentClass.className + "._skinParts");
            skinPartFunc.codeBlock = skinPartCB;
            this.currentClass.addFunction(skinPartFunc);
        }
        this.currentXML.$id = "";
        //生成视图状态代码
        this.createStates(this.currentXML);
        var states;
        var node = this.currentXML;
        var nodeClassName = this.exmlConfig.getClassNameById(node.localName, node.namespace);
        for (var itemName in node) {
            var value = node[itemName];
            if (itemName.charAt(0) != "$") {
                continue;
            }
            itemName = itemName.substring(1);
            var index = itemName.indexOf(".");
            if (index != -1) {
                var key = itemName.substring(0, index);
                key = this.formatKey(key, value);
                var itemValue = this.formatValue(key, value, node);
                if (!itemValue) {
                    continue;
                }
                var stateName = itemName.substr(index + 1);
                states = this.getStateByName(stateName, node);
                var stateLength = states.length;
                if (stateLength > 0) {
                    for (var i = 0; i < stateLength; i++) {
                        var state = states[i];
                        if (this.exmlConfig.isStyleProperty(key, nodeClassName)) {
                            state.addOverride(new CpSetStyle("", key, itemValue));
                        }
                        else {
                            state.addOverride(new CpSetProperty("", key, itemValue));
                        }
                    }
                }
            }
        }
        //打印视图状态初始化代码
        if (this.stateCode.length > 0) {
            cb.addCodeLine("this.states = [");
            var first = true;
            var indentStr = "	";
            var length = this.stateCode.length;
            for (var i = 0; i < length; i++) {
                state = this.stateCode[i];
                if (first)
                    first = false;
                else
                    cb.addCodeLine(indentStr + ",");
                var codes = state.toCode().split("\n");
                var codeIndex = 0;
                while (codeIndex < codes.length) {
                    var code = codes[codeIndex];
                    if (code)
                        cb.addCodeLine(indentStr + code);
                    codeIndex++;
                }
            }
            cb.addCodeLine("];");
        }
        this.currentClass.constructCode = cb;
    };
    /**
     * 是否含有includeIn和excludeFrom属性
     */
    EXMLCompiler.prototype.isStateNode = function (node) {
        return node.hasOwnProperty("$includeIn") || node.hasOwnProperty("$excludeFrom");
    };
    /**
     * 获取视图状态名称列表
     */
    EXMLCompiler.prototype.getStateNames = function () {
        var stateNames = this.stateNames;
        var states;
        var children = this.currentXML.children;
        if (children) {
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var item = children[i];
                if (item.localName == "states") {
                    item.namespace = EXMLCompiler.W;
                    states = item.children;
                    break;
                }
            }
        }
        if (states == null)
            return;
        if (states.length == 0) {
            globals.warn(2102, this.exmlPath, this.getPropertyStr(item));
            return;
        }
        length = states.length;
        for (i = 0; i < length; i++) {
            var state = states[i];
            var stateGroups = [];
            if (state["$stateGroups"]) {
                var groups = state.$stateGroups.split(",");
                var len = groups.length;
                for (var j = 0; j < len; j++) {
                    var group = groups[j].trim();
                    if (group) {
                        if (stateNames.indexOf(group) == -1) {
                            stateNames.push(group);
                        }
                        stateGroups.push(group);
                    }
                }
            }
            var stateName = state.$name;
            if (stateNames.indexOf(stateName) == -1) {
                stateNames.push(stateName);
            }
            this.stateCode.push(new CpState(stateName, stateGroups));
        }
    };
    /**
     * 解析视图状态代码
     */
    EXMLCompiler.prototype.createStates = function (parentNode) {
        var items = parentNode.children;
        if (!items) {
            return;
        }
        var className = this.exmlConfig.getClassNameById(parentNode.localName, parentNode.namespace);
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var node = items[i];
            this.createStates(node);
            if (node.namespace == EXMLCompiler.W || !node.localName) {
                continue;
            }
            if (this.isProperty(node)) {
                var prop = node.localName;
                var index = prop.indexOf(".");
                var children = node.children;
                if (index == -1 || !children || children.length == 0) {
                    continue;
                }
                var stateName = prop.substring(index + 1);
                prop = prop.substring(0, index);
                var type = this.exmlConfig.getPropertyType(prop, className);
                if (type == "Array") {
                    globals.exit(2013, this.exmlPath, this.getPropertyStr(node));
                }
                if (children.length > 1) {
                    globals.exit(2011, this.exmlPath, prop, this.getPropertyStr(node));
                }
                var firstChild = children[0];
                this.createFuncForNode(firstChild);
                this.checkIdForState(firstChild);
                var value = "this." + firstChild.$id;
                states = this.getStateByName(stateName, node);
                var l = states.length;
                if (l > 0) {
                    for (var j = 0; j < l; j++) {
                        state = states[j];
                        if (this.exmlConfig.isStyleProperty(prop, className)) {
                            state.addOverride(new CpSetStyle(parentNode.$id, prop, value));
                        }
                        else {
                            state.addOverride(new CpSetProperty(parentNode.$id, prop, value));
                        }
                    }
                }
            }
            else if (this.containsState(node)) {
                var id = node.$id;
                var nodeClassName = this.exmlConfig.getClassNameById(node.localName, node.namespace);
                this.checkIdForState(node);
                var stateName;
                var states;
                var state;
                if (this.isStateNode(node)) {
                    if (!this.isIVisualElement(node)) {
                        globals.exit(2007, this.exmlPath, this.toXMLString(node));
                    }
                    var propertyName = "";
                    var parent = (node.parent);
                    if (parent.localName == "Array")
                        parent = parent.parent;
                    if (this.isProperty(parent))
                        parent = parent.parent;
                    if (parent && parent != this.currentXML) {
                        propertyName = parent.$id;
                        this.checkIdForState(parent);
                    }
                    var positionObj = this.findNearNodeId(node);
                    var stateNames = [];
                    if (node.hasOwnProperty("$includeIn")) {
                        stateNames = node.$includeIn.split(",");
                    }
                    else {
                        var excludeNames = node.$excludeFrom.split(",");
                        var stateLength = excludeNames.length;
                        for (var j = 0; j < stateLength; j++) {
                            var name = excludeNames[j];
                            this.getStateByName(name, node); //检查exlcudeFrom是否含有未定义的视图状态名
                        }
                        stateLength = this.stateCode.length;
                        for (j = 0; j < stateLength; j++) {
                            state = this.stateCode[j];
                            if (excludeNames.indexOf(state.name) == -1)
                                stateNames.push(state.name);
                        }
                    }
                    var len = stateNames.length;
                    for (var k = 0; k < len; k++) {
                        stateName = stateNames[k];
                        states = this.getStateByName(stateName, node);
                        if (states.length > 0) {
                            var l = states.length;
                            for (var j = 0; j < l; j++) {
                                state = states[j];
                                state.addOverride(new CpAddItems(id, propertyName, positionObj.position, positionObj.relativeTo));
                            }
                        }
                    }
                }
                var name;
                for (name in node) {
                    var value = node[name];
                    if (name.charAt(0) != "$") {
                        continue;
                    }
                    name = name.substring(1);
                    var index = name.indexOf(".");
                    if (index != -1) {
                        var key = name.substring(0, index);
                        key = this.formatKey(key, value);
                        var value = this.formatValue(key, value, node);
                        if (!value) {
                            continue;
                        }
                        stateName = name.substr(index + 1);
                        states = this.getStateByName(stateName, node);
                        var l = states.length;
                        if (l > 0) {
                            for (var j = 0; j < l; j++) {
                                state = states[j];
                                if (this.exmlConfig.isStyleProperty(key, nodeClassName)) {
                                    state.addOverride(new CpSetStyle(id, key, value));
                                }
                                else {
                                    state.addOverride(new CpSetProperty(id, key, value));
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    /**
     * 检查指定的节点是否是显示对象
     */
    EXMLCompiler.prototype.isIVisualElement = function (node) {
        var className = this.exmlConfig.getClassNameById(node.localName, node.namespace);
        var result = this.exmlConfig.isInstanceOf(className, "egret.gui.IVisualElement");
        if (!result) {
            return false;
        }
        var parent = node.parent;
        if (!parent) {
            return false;
        }
        if (parent.localName == "Array") {
            parent = parent.parent;
        }
        if (!parent) {
            return false;
        }
        if (this.isProperty(parent)) {
            return (parent.localName == "elementsContent");
        }
        var prop = this.exmlConfig.getDefaultPropById(parent.localName, parent.namespace);
        return prop == "elementsContent";
    };
    /**
     * 检查指定的ID是否创建了类成员变量，若没创建则为其创建。
     */
    EXMLCompiler.prototype.checkIdForState = function (node) {
        if (!node || this.currentClass.containsVar(node.$id)) {
            return;
        }
        this.createVarForNode(node);
        var id = node.$id;
        var funcName = id + "_i";
        var func = this.currentClass.getFuncByName(funcName);
        if (!func)
            return;
        var codeLine = "this." + id + " = t;";
        var cb = func.codeBlock;
        if (!cb)
            return;
        if (!cb.containsCodeLine(codeLine)) {
            cb.addCodeLineAt(codeLine, 1);
        }
    };
    /**
     * 通过视图状态名称获取对应的视图状态
     */
    EXMLCompiler.prototype.getStateByName = function (name, node) {
        var states = [];
        var length = this.stateCode.length;
        for (var i = 0; i < length; i++) {
            var state = this.stateCode[i];
            if (state.name == name) {
                if (states.indexOf(state) == -1)
                    states.push(state);
            }
            else if (state.stateGroups.length > 0) {
                var found = false;
                var len = state.stateGroups.length;
                for (var j = 0; j < len; j++) {
                    var g = state.stateGroups[j];
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
        if (states.length == 0) {
            globals.exit(2006, this.exmlPath, name, this.toXMLString(node));
        }
        return states;
    };
    /**
     * 寻找节点的临近节点ID和位置
     */
    EXMLCompiler.prototype.findNearNodeId = function (node) {
        var parentNode = node.parent;
        var targetId = "";
        var postion;
        var index = -1;
        var totalCount = 0;
        var preItem;
        var afterItem;
        var found = false;
        var children = parentNode.children;
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var item = children[i];
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
            postion = "first";
            return { position: postion, relativeTo: targetId };
        }
        if (index == length - 1) {
            postion = "last";
            return { position: postion, relativeTo: targetId };
        }
        if (afterItem) {
            postion = "before";
            targetId = afterItem.$id;
            if (targetId) {
                this.checkIdForState(afterItem);
                return { position: postion, relativeTo: targetId };
            }
        }
        return { position: "last", relativeTo: targetId };
    };
    /**
     * 根据类名获取对应的包，并自动导入相应的包
     */
    EXMLCompiler.prototype.getPackageByNode = function (node) {
        var moduleName = this.exmlConfig.getClassNameById(node.localName, node.namespace);
        if (!moduleName) {
            globals.exit(2003, this.exmlPath, this.toXMLString(node));
        }
        return moduleName;
    };
    /**
     * 检查变量是否是包名
     */
    EXMLCompiler.prototype.isPackageName = function (name) {
        return name.indexOf(".") != -1;
    };
    /**
     * Egret命名空间
     */
    EXMLCompiler.E = "http://ns.egret-labs.org/egret";
    /**
     * Wing命名空间
     */
    EXMLCompiler.W = "http://ns.egret-labs.org/wing";
    EXMLCompiler.DECLARATIONS = "Declarations";
    /**
     * 命名空间为fs的属性名列表
     */
    EXMLCompiler.wingKeys = ["$id", "$locked", "$includeIn", "$excludeFrom", "id", "locked", "includeIn", "excludeFrom"];
    return EXMLCompiler;
})();
//=================代码生成工具类===================
var CodeBase = (function () {
    function CodeBase() {
        this.indent = 0;
    }
    CodeBase.prototype.toCode = function () {
        return "";
    };
    /**
     * 获取缩进字符串
     */
    CodeBase.prototype.getIndent = function (indent) {
        if (indent === void 0) { indent = -1; }
        if (indent == -1)
            indent = this.indent;
        var str = "";
        for (var i = 0; i < indent; i++) {
            str += "	";
        }
        return str;
    };
    return CodeBase;
})();
var CpArguments = (function (_super) {
    __extends(CpArguments, _super);
    function CpArguments(name, type) {
        if (name === void 0) { name = ""; }
        if (type === void 0) { type = ""; }
        _super.call(this);
        this.name = "";
        this.type = "";
        this.name = name;
        this.type = type;
    }
    CpArguments.prototype.toCode = function () {
        return this.name + ":" + this.type;
    };
    return CpArguments;
})(CodeBase);
var CpClass = (function (_super) {
    __extends(CpClass, _super);
    function CpClass() {
        _super.call(this);
        /**
         * 构造函数的参数列表
         */
        this.argumentBlock = [];
        /**
         * 类名
         */
        this.className = "CpClass";
        /**
         * 类所在的路径，用于计算reference的相对路径
         */
        this.classPath = "";
        /**
         * 包名
         */
        this.moduleName = "";
        /**
         * 父类类名
         */
        this.superClass = "";
        /**
         * 接口列表
         */
        this.interfaceBlock = [];
        /**
         * 引用文件区块
         */
        this.referenceBlock = [];
        /**
         * 变量定义区块
         */
        this.variableBlock = [];
        /**
         * 函数定义区块
         */
        this.functionBlock = [];
        this.indent = 1;
    }
    /**
     * 添加构造函数的参数
     */
    CpClass.prototype.addArgument = function (argumentItem) {
        if (this.argumentBlock.indexOf(argumentItem) == -1) {
            this.argumentBlock.push(argumentItem);
        }
    };
    /**
     * 添加接口
     */
    CpClass.prototype.addInterface = function (interfaceName) {
        if (interfaceName == null || interfaceName == "")
            return;
        if (this.interfaceBlock.indexOf(interfaceName) == -1) {
            this.interfaceBlock.push(interfaceName);
        }
    };
    /**
     * 引用一个文件
     */
    CpClass.prototype.addReference = function (referenceItem) {
        if (referenceItem == null || referenceItem == "")
            return;
        if (this.referenceBlock.indexOf(referenceItem) == -1) {
            this.referenceBlock.push(referenceItem);
        }
    };
    /**
     * 添加变量
     */
    CpClass.prototype.addVariable = function (variableItem) {
        if (this.variableBlock.indexOf(variableItem) == -1) {
            this.variableBlock.push(variableItem);
        }
    };
    /**
     * 根据变量名获取变量定义
     */
    CpClass.prototype.getVariableByName = function (name) {
        var list = this.variableBlock;
        var length = list.length;
        for (var i; i < length; i++) {
            var item = list[i];
            if (item.name == name) {
                return item;
            }
        }
        return null;
    };
    /**
     * 是否包含指定名称的变量
     */
    CpClass.prototype.containsVar = function (name) {
        var list = this.variableBlock;
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var item = list[i];
            if (item.name == name) {
                return true;
            }
        }
        return false;
    };
    CpClass.prototype.sortOn = function (list, key, reverse) {
        if (reverse === void 0) { reverse = false; }
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var min = i;
            for (var j = i + 1; j < length; j++) {
                if (reverse) {
                    if (list[j][key] > list[min][key])
                        min = j;
                }
                else {
                    if (list[j][key] < list[min][key])
                        min = j;
                }
            }
            if (min != i) {
                var temp = list[min];
                list[min] = list[i];
                list[i] = temp;
            }
        }
    };
    /**
     * 添加函数
     */
    CpClass.prototype.addFunction = function (functionItem) {
        if (this.functionBlock.indexOf(functionItem) == -1) {
            this.functionBlock.push(functionItem);
        }
    };
    /**
     * 是否包含指定名称的函数
     */
    CpClass.prototype.containsFunc = function (name) {
        var list = this.functionBlock;
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var item = list[i];
            if (item.name == name) {
                return true;
            }
        }
        return false;
    };
    /**
     * 根据函数名返回函数定义块
     */
    CpClass.prototype.getFuncByName = function (name) {
        var list = this.functionBlock;
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var item = list[i];
            if (item.name == name) {
                return item;
            }
        }
        return null;
    };
    CpClass.prototype.getRelativePath = function (path) {
        var curs = this.classPath.split("/");
        var targets = path.split("/");
        var length = Math.min(curs.length, targets.length - 1);
        var index = 0;
        for (var i = 0; i < length; i++) {
            var cur = curs[i];
            var tar = targets[i];
            if (cur != tar) {
                break;
            }
            index++;
        }
        var paths = [];
        length = curs.length;
        for (i = index; i < length - 1; i++) {
            paths.push("..");
        }
        length = targets.length;
        for (i = index; i < length; i++) {
            paths.push(targets[i]);
        }
        return paths.join("/");
    };
    CpClass.prototype.toCode = function () {
        //字符串排序
        this.referenceBlock.sort();
        this.sortOn(this.variableBlock, "name");
        this.sortOn(this.variableBlock, "isStatic", true);
        this.sortOn(this.functionBlock, "name");
        this.sortOn(this.functionBlock, "isGet", true);
        var isFirst = true;
        if (this.moduleName) {
            this.indent = 1;
        }
        else {
            this.indent = 0;
        }
        var indentStr = this.getIndent();
        var returnStr = "";
        //打印文件引用区域
        var index = 0;
        while (index < this.referenceBlock.length) {
            var importItem = this.referenceBlock[index];
            var path = this.getRelativePath(importItem);
            returnStr += "/// <reference path=\"" + path + "\"/>\n";
            index++;
        }
        if (returnStr)
            returnStr += "\n";
        var exportStr = "";
        //打印包名
        if (this.moduleName) {
            returnStr += KeyWords.KW_MODULE + " " + this.moduleName + "{\n";
            exportStr = KeyWords.KW_EXPORT + " ";
        }
        //打印注释
        if (this.notation != null) {
            this.notation.indent = this.indent;
            returnStr += this.notation.toCode() + "\n";
        }
        returnStr += indentStr + exportStr + KeyWords.KW_CLASS + " " + this.className;
        //打印父类
        if (this.superClass != null && this.superClass != "") {
            returnStr += " " + KeyWords.KW_EXTENDS + " " + this.superClass;
        }
        //打印接口列表
        if (this.interfaceBlock.length > 0) {
            returnStr += " " + KeyWords.KW_IMPLEMENTS + " ";
            index = 0;
            while (this.interfaceBlock.length > index) {
                isFirst = true;
                var interfaceItem = this.interfaceBlock[index];
                if (isFirst) {
                    returnStr += interfaceItem;
                    isFirst = false;
                }
                else {
                    returnStr += "," + interfaceItem;
                }
                index++;
            }
        }
        returnStr += "{\n";
        //打印变量列表
        index = 0;
        while (this.variableBlock.length > index) {
            var variableItem = this.variableBlock[index];
            variableItem.indent = this.indent + 1;
            returnStr += variableItem.toCode() + "\n";
            index++;
        }
        returnStr += "\n";
        //打印构造函数
        returnStr += this.getIndent(this.indent + 1) + Modifiers.M_PUBLIC + " constructor(";
        isFirst = true;
        index = 0;
        while (this.argumentBlock.length > index) {
            var arg = this.argumentBlock[index];
            if (isFirst) {
                returnStr += arg.toCode();
                isFirst = false;
            }
            else {
                returnStr += "," + arg.toCode();
            }
            index++;
        }
        returnStr += "){\n";
        var indent2Str = this.getIndent(this.indent + 2);
        if (this.superClass != null && this.superClass != "") {
            returnStr += indent2Str + "super();\n";
        }
        if (this.constructCode != null) {
            var codes = this.constructCode.toCode().split("\n");
            index = 0;
            while (codes.length > index) {
                var code = codes[index];
                returnStr += indent2Str + code + "\n";
                index++;
            }
        }
        returnStr += this.getIndent(this.indent + 1) + "}\n\n";
        //打印函数列表
        index = 0;
        while (this.functionBlock.length > index) {
            var functionItem = this.functionBlock[index];
            functionItem.indent = this.indent + 1;
            returnStr += functionItem.toCode() + "\n";
            index++;
        }
        returnStr += indentStr + "}";
        if (this.moduleName) {
            returnStr += "\n}";
        }
        return returnStr;
    };
    return CpClass;
})(CodeBase);
var CpCodeBlock = (function (_super) {
    __extends(CpCodeBlock, _super);
    function CpCodeBlock() {
        _super.call(this);
        this.lines = [];
        this.indent = 0;
    }
    /**
     * 添加变量声明语句
     * @param name 变量名
     * @param type 变量类型
     * @param value 变量初始值
     */
    CpCodeBlock.prototype.addVar = function (name, type, value) {
        if (value === void 0) { value = ""; }
        var valueStr = "";
        if (value != null && value != "") {
            valueStr = " = " + value;
        }
        this.addCodeLine(KeyWords.KW_VAR + " " + name + ":" + type + valueStr + ";");
    };
    /**
     * 添加赋值语句
     * @param target 要赋值的目标
     * @param value 值
     * @param prop 目标的属性(用“.”访问)，不填则是对目标赋值
     */
    CpCodeBlock.prototype.addAssignment = function (target, value, prop) {
        if (prop === void 0) { prop = ""; }
        var propStr = "";
        if (prop != null && prop != "") {
            propStr = "." + prop;
        }
        this.addCodeLine(target + propStr + " = " + value + ";");
    };
    /**
     * 添加返回值语句
     */
    CpCodeBlock.prototype.addReturn = function (data) {
        this.addCodeLine(KeyWords.KW_RETURN + " " + data + ";");
    };
    /**
     * 添加一条空行
     */
    CpCodeBlock.prototype.addEmptyLine = function () {
        this.addCodeLine("");
    };
    /**
     * 开始添加if语句块,自动调用startBlock();
     */
    CpCodeBlock.prototype.startIf = function (expression) {
        this.addCodeLine("if(" + expression + ")");
        this.startBlock();
    };
    /**
     * 开始else语句块,自动调用startBlock();
     */
    CpCodeBlock.prototype.startElse = function () {
        this.addCodeLine("else");
        this.startBlock();
    };
    /**
     * 开始else if语句块,自动调用startBlock();
     */
    CpCodeBlock.prototype.startElseIf = function (expression) {
        this.addCodeLine("else if(" + expression + ")");
        this.startBlock();
    };
    /**
     * 添加一个左大括号，开始新的语句块
     */
    CpCodeBlock.prototype.startBlock = function () {
        this.addCodeLine("{");
        this.indent++;
    };
    /**
     * 添加一个右大括号,结束当前的语句块
     */
    CpCodeBlock.prototype.endBlock = function () {
        this.indent--;
        this.addCodeLine("}");
    };
    /**
     * 添加执行函数语句块
     * @param functionName
     * @param args
     */
    CpCodeBlock.prototype.doFunction = function (functionName, args) {
        var argsStr = "";
        var isFirst = true;
        while (args.length > 0) {
            var arg = args.shift();
            if (isFirst) {
                argsStr += arg;
            }
            else {
                argsStr += "," + arg;
            }
        }
        this.addCodeLine(functionName + "(" + argsStr + ")");
    };
    /**
     * 添加一行代码
     */
    CpCodeBlock.prototype.addCodeLine = function (code) {
        this.lines.push(this.getIndent() + code);
    };
    /**
     * 添加一行代码到指定行
     */
    CpCodeBlock.prototype.addCodeLineAt = function (code, index) {
        this.lines.splice(index, 0, this.getIndent() + code);
    };
    /**
     * 是否存在某行代码内容
     */
    CpCodeBlock.prototype.containsCodeLine = function (code) {
        return this.lines.indexOf(code) != -1;
    };
    /**
     * 在结尾追加另一个代码块的内容
     */
    CpCodeBlock.prototype.concat = function (cb) {
        this.lines = this.lines.concat(cb.lines);
    };
    CpCodeBlock.prototype.toCode = function () {
        return this.lines.join("\n");
    };
    return CpCodeBlock;
})(CodeBase);
var CpFunction = (function (_super) {
    __extends(CpFunction, _super);
    function CpFunction() {
        _super.call(this);
        /**
         * 修饰符 ,默认Modifiers.M_PRIVATE
         */
        this.modifierName = Modifiers.M_PRIVATE;
        /**
         * 是否是静态 ，默认false
         */
        this.isStatic = false;
        this.isSet = false;
        this.isGet = false;
        /**
         *参数列表
         */
        this.argumentBlock = [];
        /**
         * 函数名
         */
        this.name = "";
        this.returnType = DataType.DT_VOID;
        this.indent = 2;
    }
    /**
     * 添加参数
     */
    CpFunction.prototype.addArgument = function (argumentItem) {
        if (this.argumentBlock.indexOf(argumentItem) == -1) {
            this.argumentBlock.push(argumentItem);
        }
    };
    CpFunction.prototype.toCode = function () {
        var index = 0;
        var indentStr = this.getIndent();
        var staticStr = this.isStatic ? Modifiers.M_STATIC + " " : "";
        var noteStr = "";
        if (this.notation != null) {
            this.notation.indent = this.indent;
            noteStr = this.notation.toCode() + "\n";
        }
        var getSetStr = "";
        if (this.isGet) {
            getSetStr = "get ";
        }
        else if (this.isSet) {
            getSetStr = "set ";
        }
        var returnStr = noteStr + indentStr + this.modifierName + " " + staticStr + getSetStr + this.name + "(";
        var isFirst = true;
        index = 0;
        while (this.argumentBlock.length > index) {
            var arg = this.argumentBlock[index];
            if (isFirst) {
                returnStr += arg.toCode();
                isFirst = false;
            }
            else {
                returnStr += "," + arg.toCode();
            }
            index++;
        }
        returnStr += ")";
        if (this.returnType != "")
            returnStr += ":" + this.returnType;
        returnStr += "{\n";
        if (this.codeBlock != null) {
            var lines = this.codeBlock.toCode().split("\n");
            var codeIndent = this.getIndent(this.indent + 1);
            index = 0;
            while (lines.length > index) {
                var line = lines[index];
                returnStr += codeIndent + line + "\n";
                index++;
            }
        }
        returnStr += indentStr + "}";
        return returnStr;
    };
    return CpFunction;
})(CodeBase);
var CpNotation = (function (_super) {
    __extends(CpNotation, _super);
    function CpNotation(notation) {
        if (notation === void 0) { notation = ""; }
        _super.call(this);
        this.notation = "";
        this.notation = notation;
    }
    CpNotation.prototype.toCode = function () {
        var lines = this.notation.split("\n");
        var firstIndent = this.getIndent();
        var secondIndent = firstIndent + " ";
        var returnStr = firstIndent + "/**\n";
        var line;
        while (lines.length > 0) {
            line = lines.shift();
            returnStr += secondIndent + "* " + line + "\n";
        }
        returnStr += secondIndent + "*/";
        return returnStr;
    };
    return CpNotation;
})(CodeBase);
//=================常量定义===================
var CpVariable = (function (_super) {
    __extends(CpVariable, _super);
    function CpVariable(name, modifierName, type, defaultValue, isStatic) {
        if (name === void 0) { name = "varName"; }
        if (modifierName === void 0) { modifierName = "public"; }
        if (type === void 0) { type = "any"; }
        if (defaultValue === void 0) { defaultValue = ""; }
        if (isStatic === void 0) { isStatic = false; }
        _super.call(this);
        /**
         * 修饰符
         */
        this.modifierName = Modifiers.M_PUBLIC;
        /**
         * 是否是静态
         */
        this.isStatic = false;
        /**
         * 常量名
         */
        this.name = "varName";
        /**
         * 默认值
         */
        this.defaultValue = "";
        this.indent = 2;
        this.name = name;
        this.modifierName = modifierName;
        this.type = type;
        this.isStatic = isStatic;
        this.defaultValue = defaultValue;
    }
    CpVariable.prototype.toCode = function () {
        var noteStr = "";
        if (this.notation != null) {
            this.notation.indent = this.indent;
            noteStr = this.notation.toCode() + "\n";
        }
        var staticStr = this.isStatic ? Modifiers.M_STATIC + " " : "";
        var valueStr = "";
        if (this.defaultValue != "" && this.defaultValue != null) {
            valueStr = " = " + this.defaultValue;
        }
        return noteStr + this.getIndent() + this.modifierName + " " + staticStr + this.name + ":" + this.type + valueStr + ";";
    };
    return CpVariable;
})(CodeBase);
var CpState = (function (_super) {
    __extends(CpState, _super);
    function CpState(name, stateGroups) {
        if (stateGroups === void 0) { stateGroups = null; }
        _super.call(this);
        /**
         * 视图状态名称
         */
        this.name = "";
        this.stateGroups = [];
        this.addItems = [];
        this.setProperty = [];
        this.name = name;
        if (stateGroups)
            this.stateGroups = stateGroups;
    }
    /**
     * 添加一个覆盖
     */
    CpState.prototype.addOverride = function (item) {
        if (item instanceof CpAddItems)
            this.addItems.push(item);
        else
            this.setProperty.push(item);
    };
    CpState.prototype.toCode = function () {
        var indentStr = this.getIndent(1);
        var returnStr = "new egret.gui.State (\"" + this.name + "\",\n" + indentStr + "[\n";
        var index = 0;
        var isFirst = true;
        var overrides = this.addItems.concat(this.setProperty);
        while (index < overrides.length) {
            if (isFirst)
                isFirst = false;
            else
                returnStr += ",\n";
            var item = overrides[index];
            var codes = item.toCode().split("\n");
            var length = codes.length;
            for (var i = 0; i < length; i++) {
                var code = codes[i];
                codes[i] = indentStr + indentStr + code;
            }
            returnStr += codes.join("\n");
            index++;
        }
        returnStr += "\n" + indentStr + "])";
        return returnStr;
    };
    return CpState;
})(CodeBase);
var CpAddItems = (function (_super) {
    __extends(CpAddItems, _super);
    function CpAddItems(target, propertyName, position, relativeTo) {
        _super.call(this);
        this.target = target;
        this.propertyName = propertyName;
        this.position = position;
        this.relativeTo = relativeTo;
    }
    CpAddItems.prototype.toCode = function () {
        var indentStr = this.getIndent(1);
        var returnStr = "new egret.gui.AddItems(\"" + this.target + "\",\"" + this.propertyName + "\",\"" + this.position + "\",\"" + this.relativeTo + "\")";
        return returnStr;
    };
    return CpAddItems;
})(CodeBase);
var CpSetProperty = (function (_super) {
    __extends(CpSetProperty, _super);
    function CpSetProperty(target, name, value) {
        _super.call(this);
        this.target = target;
        this.name = name;
        this.value = value;
    }
    CpSetProperty.prototype.toCode = function () {
        var indentStr = this.getIndent(1);
        return "new egret.gui.SetProperty(\"" + this.target + "\",\"" + this.name + "\"," + this.value + ")";
    };
    return CpSetProperty;
})(CodeBase);
var CpSetStyle = (function (_super) {
    __extends(CpSetStyle, _super);
    function CpSetStyle(target, name, value) {
        _super.call(this);
        this.target = target;
        this.name = name;
        this.value = value;
    }
    CpSetStyle.prototype.toCode = function () {
        var indentStr = this.getIndent(1);
        return "new egret.gui.SetStyle(\"" + this.target + "\",\"" + this.name + "\"," + this.value + ")";
    };
    return CpSetStyle;
})(CodeBase);
var DataType = (function () {
    function DataType() {
    }
    DataType.DT_VOID = "void";
    DataType.DT_NUMBER = "number";
    DataType.DT_BOOLEAN = "boolean";
    DataType.DT_ARRAY = "Array";
    DataType.DT_STRING = "string";
    DataType.DT_OBJECT = "Object";
    DataType.DT_FUNCTION = "Function";
    return DataType;
})();
var KeyWords = (function () {
    function KeyWords() {
    }
    KeyWords.KW_CLASS = "class";
    KeyWords.KW_FUNCTION = "function";
    KeyWords.KW_VAR = "var";
    KeyWords.KW_INTERFACE = "interface";
    KeyWords.KW_EXTENDS = "extends";
    KeyWords.KW_IMPLEMENTS = "implements";
    KeyWords.KW_MODULE = "module";
    KeyWords.KW_SUPER = "super";
    KeyWords.KW_THIS = "this";
    KeyWords.KW_OVERRIDE = "override";
    KeyWords.KW_RETURN = "return";
    KeyWords.KW_EXPORT = "export";
    return KeyWords;
})();
var Modifiers = (function () {
    function Modifiers() {
    }
    Modifiers.M_PUBLIC = "public";
    Modifiers.M_PRIVATE = "private";
    Modifiers.M_STATIC = "static";
    return Modifiers;
})();
//# sourceMappingURL=exmlc.js.map