Object.defineProperty(exports, "__esModule", { value: true });
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
var EXMLConfig2_1 = require("./EXMLConfig2");
var XMLParser = require("../xml/index");
var CodeFactory_1 = require("./CodeFactory");
var DEBUG = false;
var egretbridge_1 = require("./egretbridge");
var exmlParserPool = [];
var parsedClasses = {};
var innerClassCount = 1;
var HOST_COMPONENT = "hostComponent";
var SKIN_CLASS = "eui.Skin";
var DECLARATIONS = "Declarations";
var RECTANGLE = "egret.Rectangle";
var TYPE_CLASS = "Class";
var TYPE_ARRAY = "Array";
var TYPE_PERCENTAGE = "Percentage";
var TYPE_STexture = "string | Texture";
var TYPE_STATE = "State[]";
var SKIN_NAME = "skinName";
var ELEMENTS_CONTENT = "elementsContent";
var basicTypes = [TYPE_ARRAY, TYPE_STexture, "boolean", "string", "number"];
var wingKeys = ["id", "locked", "includeIn", "excludeFrom"];
var htmlEntities = [["<", "&lt;"], [">", "&gt;"], ["&", "&amp;"], ["\"", "&quot;"], ["'", "&apos;"]];
var jsKeyWords = ["null", "NaN", "undefined", "true", "false"];
var EXMLFileSystem = (function () {
    function EXMLFileSystem() {
        this.root = {};
        this.fileList = [];
    }
    EXMLFileSystem.prototype.getList = function () {
        return this.fileList;
    };
    EXMLFileSystem.prototype.set = function (filename, content) {
        this.fileList.push(filename);
        this.root[filename] = content;
    };
    EXMLFileSystem.prototype.get = function (filename) {
        var result = this.root[filename];
        if (!result) {
            console.warn("找不到资源", filename);
        }
        return result;
    };
    return EXMLFileSystem;
}());
exports.fileSystem = new EXMLFileSystem();
/**
 * @private
 */
var EXMLParser = (function () {
    /**
     * @private
     */
    function EXMLParser() {
        /**
         * @private
         * 延迟赋值字典
         */
        this.delayAssignmentDic = {};
        if (DEBUG) {
            this.repeatedIdMap = {};
            this.getRepeatedIds = getRepeatedIds;
            this.getIds = getIds;
            this.checkDeclarations = checkDeclarations;
        }
    }
    Object.defineProperty(EXMLParser.prototype, "topNode", {
        get: function () {
            return this._topNode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EXMLParser.prototype, "className", {
        get: function () {
            return this._className;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * 编译指定的XML对象为JavaScript代码。
     * @param xmlData 要编译的EXML文件内容
     *
     */
    EXMLParser.prototype.parse = function (text) {
        if (DEBUG) {
            if (!text) {
                egretbridge_1.egretbridge.$error(1003, "text");
            }
        }
        var xmlData = null;
        if (DEBUG) {
            try {
                xmlData = XMLParser.parse(text);
            }
            catch (e) {
                egretbridge_1.egretbridge.$error(2002, text + "\n" + e.message);
            }
        }
        else {
            xmlData = XMLParser.parse(text);
        }
        this._topNode = xmlData;
        var hasClass = false;
        var className = "";
        if (xmlData.attributes["class"]) {
            className = xmlData.attributes["class"];
            delete xmlData.attributes["class"];
            hasClass = !!className;
        }
        else {
            className = "$exmlClass" + innerClassCount++;
        }
        this._className = className;
        var exClass = this.parseClass(xmlData, className);
        var code = exClass.toCode();
        return { code: code, className: className };
    };
    /**
     * @private
     * 编译指定的XML对象为CpClass对象。
     */
    EXMLParser.prototype.parseClass = function (xmlData, className) {
        if (!exports.exmlConfig) {
            exports.exmlConfig = new EXMLConfig2_1.EXMLConfig();
        }
        exports.exmlConfig.dirPath = egret.args.projectDir;
        this.currentXML = xmlData;
        this.currentClassName = className;
        this.delayAssignmentDic = {};
        this.idDic = {};
        this.stateCode = [];
        this.stateNames = [];
        this.skinParts = [];
        this.bindings = [];
        this.declarations = null;
        this.currentClass = new CodeFactory_1.EXClass();
        this.stateIds = [];
        var index = className.lastIndexOf(".");
        if (index != -1) {
            this.currentClass.className = className.substring(index + 1);
        }
        else {
            this.currentClass.className = className;
        }
        this.startCompile();
        var clazz = this.currentClass;
        this.currentClass = null;
        return clazz;
    };
    /**
     * @private
     * 开始编译
     */
    EXMLParser.prototype.startCompile = function () {
        if (DEBUG) {
            var result = this.getRepeatedIds(this.currentXML);
            if (result.length > 0) {
                egretbridge_1.egretbridge.$error(2004, this.currentClassName, result.join("\n"));
            }
        }
        var superClass = this.getClassNameOfNode(this.currentXML);
        this.isSkinClass = (superClass == SKIN_CLASS);
        this.currentClass.superClass = superClass;
        this.getStateNames();
        var children = this.currentXML.children;
        if (children) {
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var node = children[i];
                if (node.nodeType === 1 && node.namespace == EXMLConfig2_1.NS_W &&
                    node.localName == DECLARATIONS) {
                    this.declarations = node;
                    break;
                }
            }
        }
        if (DEBUG) {
            var list = [];
            this.checkDeclarations(this.declarations, list);
            if (list.length > 0) {
                egretbridge_1.egretbridge.$error(2020, this.currentClassName, list.join("\n"));
            }
        }
        if (!this.currentXML.namespace) {
            if (DEBUG) {
                egretbridge_1.egretbridge.$error(2017, this.currentClassName, toXMLString(this.currentXML));
            }
            return;
        }
        this.addIds(this.currentXML.children);
        this.createConstructFunc();
    };
    /**
     * @private
     * 添加必须的id
     */
    EXMLParser.prototype.addIds = function (items) {
        if (!items) {
            return;
        }
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var node = items[i];
            if (node.nodeType != 1) {
                continue;
            }
            if (!node.namespace) {
                if (DEBUG) {
                    egretbridge_1.egretbridge.$error(2017, this.currentClassName, toXMLString(node));
                }
                continue;
            }
            if (this.isInnerClass(node)) {
                continue;
            }
            this.addIds(node.children);
            if (node.namespace == EXMLConfig2_1.NS_W || !node.localName) {
            }
            else if (this.isProperty(node)) {
                var prop = node.localName;
                var index = prop.indexOf(".");
                var children = node.children;
                if (index == -1 || !children || children.length == 0) {
                    continue;
                }
                var firstChild = children[0];
                this.stateIds.push(firstChild.attributes.id);
            }
            else if (node.nodeType === 1) {
                var id = node.attributes["id"];
                if (id) {
                    var e = new RegExp("^[a-zA-Z_$]{1}[a-z0-9A-Z_$]*");
                    if (id.match(e) == null) {
                        egretbridge_1.egretbridge.$warn(2022, id);
                    }
                    if (id.match(new RegExp(/ /g)) != null) {
                        egretbridge_1.egretbridge.$warn(2022, id);
                    }
                    if (this.skinParts.indexOf(id) == -1) {
                        this.skinParts.push(id);
                    }
                    this.createVarForNode(node);
                    if (this.isStateNode(node))
                        this.stateIds.push(id);
                }
                else {
                    this.createIdForNode(node);
                    if (this.isStateNode(node))
                        this.stateIds.push(node.attributes.id);
                }
            }
        }
    };
    /**
     * @private
     * 是否为内部类。
     */
    EXMLParser.prototype.isInnerClass = function (node) {
        if (node.hasOwnProperty("isInnerClass")) {
            return node["isInnerClass"];
        }
        var result = (node.localName == "Skin" && node.namespace == EXMLConfig2_1.NS_S);
        if (!result) {
            if (this.isProperty(node)) {
                result = false;
            }
            else {
                var prop = void 0;
                var parent = node.parent;
                if (this.isProperty(parent)) {
                    prop = parent.localName;
                    var index = prop.indexOf(".");
                    if (index != -1) {
                        var stateName = prop.substring(index + 1);
                        prop = prop.substring(0, index);
                    }
                    parent = parent.parent;
                }
                else {
                    prop = exports.exmlConfig.getDefaultPropById(parent.localName, parent.namespace);
                }
                var className = exports.exmlConfig.getClassNameById(parent.localName, parent.namespace);
                result = (exports.exmlConfig.getPropertyType(prop, className) == TYPE_CLASS);
            }
        }
        node["isInnerClass"] = result;
        return result;
    };
    /**
     * @private
     * 检测指定节点的属性是否含有视图状态
     */
    EXMLParser.prototype.containsState = function (node) {
        var attributes = node.attributes;
        if (attributes["includeIn"] || attributes["excludeFrom"]) {
            return true;
        }
        var keys = Object.keys(attributes);
        var length = keys.length;
        for (var i = 0; i < length; i++) {
            var name = keys[i];
            if (name.indexOf(".") != -1) {
                return true;
            }
        }
        return false;
    };
    /**
     * @private
     * 为指定节点创建id属性
     */
    EXMLParser.prototype.createIdForNode = function (node) {
        var idName = this.getNodeId(node);
        if (!this.idDic[idName])
            this.idDic[idName] = 1;
        else
            this.idDic[idName]++;
        idName += this.idDic[idName];
        node.attributes.id = idName;
    };
    /**
     * @private
     * 获取节点ID
     */
    EXMLParser.prototype.getNodeId = function (node) {
        if (node.attributes["id"])
            return node.attributes.id;
        return "_" + node.localName;
    };
    /**
     * @private
     * 为指定节点创建变量
     */
    EXMLParser.prototype.createVarForNode = function (node) {
        var moduleName = this.getClassNameOfNode(node);
        if (moduleName == "")
            return;
        if (!this.currentClass.getVariableByName(node.attributes.id))
            this.currentClass.addVariable(new CodeFactory_1.EXVariable(node.attributes.id));
    };
    /**
     * @private
     * 为指定节点创建初始化函数,返回函数名引用
     */
    EXMLParser.prototype.createFuncForNode = function (node) {
        var className = node.localName;
        var isBasicType = this.isBasicTypeData(className);
        if (isBasicType)
            return this.createBasicTypeForNode(node);
        var moduleName = this.getClassNameOfNode(node);
        var func = new CodeFactory_1.EXFunction();
        var tailName = "_i";
        var id = node.attributes.id;
        func.name = id + tailName;
        this.currentClass.addFunction(func);
        var cb = new CodeFactory_1.EXCodeBlock();
        func.codeBlock = cb;
        var varName = "t";
        if (className == "Object") {
            cb.addVar(varName, "{}");
        }
        else {
            cb.addVar(varName, "new " + moduleName + "()");
        }
        var containsId = !!this.currentClass.getVariableByName(id);
        if (containsId) {
            cb.addAssignment("this." + id, varName);
        }
        this.addAttributesToCodeBlock(cb, varName, node);
        this.initlizeChildNode(node, cb, varName);
        var delayAssignments = this.delayAssignmentDic[id];
        if (delayAssignments) {
            var length = delayAssignments.length;
            for (var i = 0; i < length; i++) {
                var codeBlock = delayAssignments[i];
                cb.concat(codeBlock);
            }
        }
        cb.addReturn(varName);
        return "this." + func.name + "()";
    };
    /**
     * @private
     * 检查目标类名是否是基本数据类型
     */
    EXMLParser.prototype.isBasicTypeData = function (className) {
        return basicTypes.indexOf(className) != -1;
    };
    /**
     * @private
     * 为指定基本数据类型节点实例化,返回实例化后的值。
     */
    EXMLParser.prototype.createBasicTypeForNode = function (node) {
        var className = node.localName;
        var returnValue = "";
        var varItem = this.currentClass.getVariableByName(node.attributes.id);
        var children = node.children;
        var text = "";
        if (children && children.length > 0) {
            var firstChild = children[0];
            if (firstChild.nodeType == 3) {
                text = firstChild.text.trim();
            }
        }
        switch (className) {
            case TYPE_ARRAY:
                var values = [];
                if (children) {
                    var length = children.length;
                    for (var i = 0; i < length; i++) {
                        var child = children[i];
                        if (child.nodeType == 1) {
                            values.push(this.createFuncForNode(child));
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
                if (returnValue.indexOf("%") != -1)
                    returnValue = returnValue.substring(0, returnValue.length - 1);
                break;
            case "string":
                returnValue = this.formatString(text);
                break;
        }
        if (varItem)
            varItem.defaultValue = returnValue;
        return returnValue;
    };
    /**
     * @private
     * 将节点属性赋值语句添加到代码块
     */
    EXMLParser.prototype.addAttributesToCodeBlock = function (cb, varName, node) {
        var key;
        var value;
        var attributes = node.attributes;
        var keyList = Object.keys(attributes);
        keyList.sort(); //排序一下防止出现随机顺序
        //对 style 属性先行赋值
        var styleIndex = keyList.indexOf("style");
        if (styleIndex > 0) {
            keyList.splice(styleIndex, 1);
            keyList.unshift("style");
        }
        var length = keyList.length;
        for (var i = 0; i < length; i++) {
            key = keyList[i];
            if (!this.isNormalKey(key)) {
                continue;
            }
            value = attributes[key];
            key = this.formatKey(key, value);
            value = this.formatValue(key, value, node);
            if (!value) {
                continue;
            }
            if (this.currentClass.getVariableByName(value)) {
                var THIS = "this.";
                var id = attributes.id;
                var codeLine = THIS + id + " = t;";
                if (!this.currentClass.getVariableByName(id))
                    this.createVarForNode(node);
                if (!cb.containsCodeLine(codeLine)) {
                    cb.addCodeLineAt(codeLine, 1);
                }
                var delayCb = new CodeFactory_1.EXCodeBlock();
                if (varName == "this") {
                    delayCb.addAssignment(varName, THIS + value, key);
                }
                else {
                    delayCb.startIf(THIS + id);
                    delayCb.addAssignment(THIS + id, THIS + value, key);
                    delayCb.endBlock();
                }
                if (!this.delayAssignmentDic[value]) {
                    this.delayAssignmentDic[value] = [];
                }
                this.delayAssignmentDic[value].push(delayCb);
                value = THIS + value;
            }
            cb.addAssignment(varName, value, key);
        }
    };
    /**
     * @private
     * 初始化子项
     */
    EXMLParser.prototype.initlizeChildNode = function (node, cb, varName) {
        var children = node.children;
        if (!children || children.length == 0)
            return;
        var className = exports.exmlConfig.getClassNameById(node.localName, node.namespace);
        var directChild = [];
        var length = children.length;
        var propList = [];
        var errorInfo;
        for (var i = 0; i < length; i++) {
            var child = children[i];
            if (child.nodeType != 1 || child.namespace == EXMLConfig2_1.NS_W) {
                continue;
            }
            if (this.isInnerClass(child)) {
                if (child.localName == "Skin") {
                    var innerClassName = this.parseInnerClass(child);
                    var type = exports.exmlConfig.getPropertyType(SKIN_NAME, className);
                    if (type) {
                        cb.addAssignment(varName, innerClassName, SKIN_NAME);
                    }
                    else {
                        egretbridge_1.egretbridge.$error(2005, this.currentClassName, SKIN_NAME, getPropertyStr(child));
                    }
                }
                continue;
            }
            var prop = child.localName;
            if (this.isProperty(child)) {
                if (!this.isNormalKey(prop)) {
                    continue;
                }
                var type = exports.exmlConfig.getPropertyType(child.localName, className);
                if (!type) {
                    if (DEBUG) {
                        egretbridge_1.egretbridge.$error(2005, this.currentClassName, child.localName, getPropertyStr(child));
                    }
                    continue;
                }
                if (!child.children || child.children.length == 0) {
                    if (DEBUG) {
                        egretbridge_1.egretbridge.$warn(2102, this.currentClassName, getPropertyStr(child));
                    }
                    continue;
                }
                if (DEBUG) {
                    var errorInfo_1 = getPropertyStr(child);
                }
                this.addChildrenToProp(child.children, type, prop, cb, varName, errorInfo, propList, node);
            }
            else {
                directChild.push(child);
            }
        }
        if (directChild.length == 0)
            return;
        var defaultProp = exports.exmlConfig.getDefaultPropById(node.localName, node.namespace);
        var defaultType = exports.exmlConfig.getPropertyType(defaultProp, className);
        if (DEBUG) {
            errorInfo = getPropertyStr(directChild[0]);
        }
        if (!defaultProp || !defaultType) {
            if (DEBUG) {
                egretbridge_1.egretbridge.$error(2012, this.currentClassName, errorInfo);
            }
            return;
        }
        this.addChildrenToProp(directChild, defaultType, defaultProp, cb, varName, errorInfo, propList, node);
    };
    /**
     * @private
     * 解析内部类节点，并返回类名。
     */
    EXMLParser.prototype.parseInnerClass = function (node) {
        var parser = exmlParserPool.pop();
        if (!parser) {
            parser = new EXMLParser();
        }
        var innerClassName = this.currentClass.className + "$" + node.localName + innerClassCount++;
        var innerClass = parser.parseClass(node, innerClassName);
        this.currentClass.addInnerClass(innerClass);
        exmlParserPool.push(parser);
        return innerClassName;
    };
    /**
     * @private
     * 添加多个子节点到指定的属性
     */
    EXMLParser.prototype.addChildrenToProp = function (children, type, prop, cb, varName, errorInfo, propList, node) {
        var childFunc = "";
        var childLength = children.length;
        if (childLength > 1) {
            if (type != TYPE_ARRAY) {
                if (DEBUG) {
                    egretbridge_1.egretbridge.$error(2011, this.currentClassName, prop, errorInfo);
                }
                return;
            }
            var values = [];
            for (var j = 0; j < childLength; j++) {
                var item = children[j];
                if (item.nodeType != 1) {
                    continue;
                }
                childFunc = this.createFuncForNode(item);
                var childClassName = this.getClassNameOfNode(item);
                if (!this.isStateNode(item))
                    values.push(childFunc);
            }
            childFunc = "[" + values.join(",") + "]";
        }
        else {
            var firstChild = children[0];
            if (type == TYPE_ARRAY) {
                if (firstChild.localName == TYPE_ARRAY) {
                    var values = [];
                    if (firstChild.children) {
                        var len = firstChild.children.length;
                        for (var k = 0; k < len; k++) {
                            var item = firstChild.children[k];
                            if (item.nodeType != 1) {
                                continue;
                            }
                            childFunc = this.createFuncForNode(item);
                            var childClassName = this.getClassNameOfNode(item);
                            if (!this.isStateNode(item))
                                values.push(childFunc);
                        }
                    }
                    childFunc = "[" + values.join(",") + "]";
                }
                else {
                    childFunc = this.createFuncForNode(firstChild);
                    var childClassName = this.getClassNameOfNode(firstChild);
                    if (!this.isStateNode(firstChild))
                        childFunc = "[" + childFunc + "]";
                    else
                        childFunc = "[]";
                }
            }
            else if (firstChild.nodeType == 1) {
                if (type == TYPE_CLASS) {
                    if (childLength > 1) {
                        if (DEBUG) {
                            egretbridge_1.egretbridge.$error(2011, this.currentClassName, prop, errorInfo);
                        }
                        return;
                    }
                    childFunc = this.parseInnerClass(children[0]);
                }
                else {
                    var targetClass = this.getClassNameOfNode(firstChild);
                    childFunc = this.createFuncForNode(firstChild);
                }
            }
            else {
                childFunc = this.formatValue(prop, firstChild.text, node);
            }
        }
        if (childFunc != "") {
            if (childFunc.indexOf("()") == -1)
                prop = this.formatKey(prop, childFunc);
            if (propList.indexOf(prop) == -1) {
                propList.push(prop);
            }
            else if (DEBUG) {
                egretbridge_1.egretbridge.$warn(2103, this.currentClassName, prop, errorInfo);
            }
            cb.addAssignment(varName, childFunc, prop);
        }
    };
    /**
     * @private
     * 指定节点是否是属性节点
     */
    EXMLParser.prototype.isProperty = function (node) {
        if (node.hasOwnProperty("isProperty")) {
            return node["isProperty"];
        }
        var result;
        var name = node.localName;
        if (!name || node.nodeType !== 1 || !node.parent || this.isBasicTypeData(name)) {
            result = false;
        }
        else {
            var parent = node.parent;
            var index = name.indexOf(".");
            if (index != -1) {
                name = name.substr(0, index);
            }
            var className = exports.exmlConfig.getClassNameById(parent.localName, parent.namespace);
            result = !!exports.exmlConfig.getPropertyType(name, className);
        }
        node["isProperty"] = result;
        return result;
    };
    /**
     * @private
     * 是否是普通赋值的key
     */
    EXMLParser.prototype.isNormalKey = function (key) {
        if (!key || key.indexOf(".") != -1
            || key.indexOf(":") != -1 || wingKeys.indexOf(key) != -1)
            return false;
        return true;
    };
    /**
     * @private
     * 格式化key
     */
    EXMLParser.prototype.formatKey = function (key, value) {
        if (value.indexOf("%") != -1) {
            if (key == "height")
                key = "percentHeight";
            else if (key == "width")
                key = "percentWidth";
        }
        return key;
    };
    /**
     * @private
     * 格式化值
     */
    EXMLParser.prototype.formatValue = function (key, value, node) {
        if (!value) {
            value = "";
        }
        var stringValue = value; //除了字符串，其他类型都去除两端多余空格。
        value = value.trim();
        var className = this.getClassNameOfNode(node);
        var type = exports.exmlConfig.getPropertyType(key, className);
        if (DEBUG && !type) {
            egretbridge_1.egretbridge.$error(2005, this.currentClassName, key, toXMLString(node));
        }
        var bindingValue = this.formatBinding(key, value, node);
        if (bindingValue) {
            this.checkIdForState(node);
            var target = "this";
            if (node !== this.currentXML) {
                target += "." + node.attributes["id"];
            }
            this.bindings.push(new CodeFactory_1.EXBinding(target, key, bindingValue.templates, bindingValue.chainIndex));
            value = "";
        }
        else if (type == RECTANGLE) {
            if (DEBUG) {
                var rect = value.split(",");
                if (rect.length != 4 || isNaN(parseInt(rect[0])) || isNaN(parseInt(rect[1])) ||
                    isNaN(parseInt(rect[2])) || isNaN(parseInt(rect[3]))) {
                    egretbridge_1.egretbridge.$error(2016, this.currentClassName, toXMLString(node));
                }
            }
            value = "new " + RECTANGLE + "(" + value + ")";
        }
        else if (type == TYPE_PERCENTAGE) {
            if (value.indexOf("%") != -1) {
                value = this.formatString(value);
                ;
            }
        }
        else {
            var orgValue = value;
            switch (type) {
                case TYPE_CLASS:
                    if (key == SKIN_NAME) {
                        value = this.formatString(stringValue);
                    }
                    break;
                case "number":
                    if (value.indexOf("#") == 0) {
                        if (DEBUG && isNaN(value.substring(1))) {
                            egretbridge_1.egretbridge.$warn(2021, this.currentClassName, key, value);
                        }
                        value = "0x" + value.substring(1);
                    }
                    else if (value.indexOf("%") != -1) {
                        if (DEBUG && isNaN(value.substr(0, value.length - 1))) {
                            egretbridge_1.egretbridge.$warn(2021, this.currentClassName, key, value);
                        }
                        value = (parseFloat(value.substr(0, value.length - 1))).toString();
                    }
                    else if (DEBUG && isNaN(value)) {
                        egretbridge_1.egretbridge.$warn(2021, this.currentClassName, key, value);
                    }
                    break;
                case "boolean":
                    value = (value == "false" || !value) ? "false" : "true";
                    break;
                case "string":
                case TYPE_STexture:
                case "any":
                    value = this.formatString(stringValue);
                    break;
                default:
                    if (DEBUG) {
                        egretbridge_1.egretbridge.$error(2008, this.currentClassName, "string", key + ":" + type, toXMLString(node));
                    }
                    break;
            }
        }
        return value;
    };
    /**
     * @private
     * 格式化字符串
     */
    EXMLParser.prototype.formatString = function (value) {
        value = this.unescapeHTMLEntity(value);
        value = value.split("\n").join("\\n");
        value = value.split("\r").join("\\n");
        value = value.split("\"").join("\\\"");
        value = "\"" + value + "\"";
        return value;
    };
    EXMLParser.prototype.formatBinding = function (key, value, node) {
        if (!value) {
            return null;
        }
        value = value.trim();
        if (value.charAt(0) != "{" || value.charAt(value.length - 1) != "}") {
            return null;
        }
        value = value.substring(1, value.length - 1).trim();
        var templates = value.indexOf("+") == -1 ? [value] : this.parseTemplates(value);
        var chainIndex = [];
        var length = templates.length;
        for (var i = 0; i < length; i++) {
            var item = templates[i].trim();
            if (!item) {
                templates.splice(i, 1);
                i--;
                length--;
                continue;
            }
            var first = item.charAt(0);
            if (first == "'" || first == "\"" || first >= "0" && first <= "9" || first == "-") {
                continue;
            }
            if (item.indexOf(".") == -1 && jsKeyWords.indexOf(item) != -1) {
                continue;
            }
            if (item.indexOf("this.") == 0) {
                item = item.substring(5);
            }
            var firstKey = item.split(".")[0];
            if (firstKey != HOST_COMPONENT && this.skinParts.indexOf(firstKey) == -1) {
                item = HOST_COMPONENT + "." + item;
            }
            templates[i] = "\"" + item + "\"";
            chainIndex.push(i);
        }
        return { templates: templates, chainIndex: chainIndex };
    };
    EXMLParser.prototype.parseTemplates = function (value) {
        //仅仅是表达式相加 如:{a.b+c.d}
        if (value.indexOf("'") == -1) {
            return value.split("+");
        }
        //包含文本的需要提取文本并对文本进行处理
        var isSingleQuoteLeak = false; //是否缺失单引号
        var trimText = "";
        value = value.split("\\\'").join("\v0\v");
        while (value.length > 0) {
            //'成对出现 这是第一个
            var index = value.indexOf("'");
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
            var quote = value.substring(0, index + 1);
            trimText += quote.split("+").join("\v1\v");
            value = value.substring(index + 1);
        }
        value = trimText.split("\v0\v").join("\\\'");
        //补全缺失的单引号
        if (isSingleQuoteLeak) {
            value += "'";
        }
        var templates = value.split("+");
        var length = templates.length;
        for (var i = 0; i < length; i++) {
            templates[i] = templates[i].split("\v1\v").join("+");
        }
        return templates;
    };
    /**
     * @private
     /**
     * 转换HTML实体字符为普通字符
     */
    EXMLParser.prototype.unescapeHTMLEntity = function (str) {
        if (!str)
            return "";
        var length = htmlEntities.length;
        for (var i = 0; i < length; i++) {
            var arr = htmlEntities[i];
            var key = arr[0];
            var value = arr[1];
            str = str.split(value).join(key);
        }
        return str;
    };
    /**
     * @private
     * 创建构造函数
     */
    EXMLParser.prototype.createConstructFunc = function () {
        var cb = new CodeFactory_1.EXCodeBlock;
        cb.addEmptyLine();
        var varName = "this";
        this.addAttributesToCodeBlock(cb, varName, this.currentXML);
        if (this.declarations) {
            var children = this.declarations.children;
            if (children && children.length > 0) {
                var length_1 = children.length;
                for (var i = 0; i < length_1; i++) {
                    var decl = children[i];
                    if (decl.nodeType != 1) {
                        continue;
                    }
                    var funcName = this.createFuncForNode(decl);
                    if (funcName) {
                        cb.addCodeLine(funcName + ";");
                    }
                }
            }
        }
        this.initlizeChildNode(this.currentXML, cb, varName);
        for (var _i = 0, _a = this.stateIds; _i < _a.length; _i++) {
            var id = _a[_i];
            cb.addCodeLine("this." + id + "_i();");
            cb.addEmptyLine();
        }
        var skinpartsArray = new CodeFactory_1.EXArray(this.skinParts);
        var skinPartStr = skinpartsArray.toCode();
        // let skinPartFunc: EXFunction = new EXFunction();
        // skinPartFunc.name = "skinParts";
        // skinPartFunc.isGet = true;
        // let skinPartCB: EXCodeBlock = new EXCodeBlock();
        // skinPartCB.addReturn(skinPartStr);
        // skinPartFunc.codeBlock = skinPartCB;
        // this.currentClass.addFunction(skinPartFunc)
        var skinpartsVaribale = new CodeFactory_1.EXVariable('skinParts', skinpartsArray.toCode());
        this.currentClass.addVariable(skinpartsVaribale);
        this.currentXML.attributes.id = "";
        //生成视图状态代码
        this.createStates(this.currentXML);
        var states;
        var node = this.currentXML;
        var nodeClassName = this.getClassNameOfNode(node);
        var attributes = node.attributes;
        var keys = Object.keys(attributes);
        var keysLength = keys.length;
        for (var m = 0; m < keysLength; m++) {
            var itemName = keys[m];
            var value = attributes[itemName];
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
                        state.addOverride(new CodeFactory_1.EXSetProperty("", key, itemValue));
                    }
                }
            }
        }
        //打印视图状态初始化代码
        var stateCode = this.stateCode;
        var length = stateCode.length;
        if (length > 0) {
            var indentStr = "	";
            cb.addCodeLine("this.states = [");
            var first = true;
            for (var i = 0; i < length; i++) {
                var state = stateCode[i];
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
        //生成绑定代码
        var bindings = this.bindings;
        length = bindings.length;
        if (length > 0) {
            cb.addEmptyLine();
            for (var i = 0; i < length; i++) {
                var binding = bindings[i];
                cb.addCodeLine(binding.toCode());
            }
        }
        this.currentClass.constructCode = cb;
    };
    /**
     * @private
     * 是否含有includeIn和excludeFrom属性
     */
    EXMLParser.prototype.isStateNode = function (node) {
        var attributes = node.attributes;
        return attributes.hasOwnProperty("includeIn") || attributes.hasOwnProperty("excludeFrom");
    };
    /**
     * @private
     * 获取视图状态名称列表
     */
    EXMLParser.prototype.getStateNames = function () {
        var root = this.currentXML;
        var className = exports.exmlConfig.getClassNameById(root.localName, root.namespace);
        var type = exports.exmlConfig.getPropertyType("states", className);
        if (type != TYPE_STATE) {
            return;
        }
        var statesValue = root.attributes["states"];
        if (statesValue) {
            delete root.attributes["states"];
        }
        var stateNames = this.stateNames;
        var stateChildren;
        var children = root.children;
        var item;
        if (children) {
            var length_2 = children.length;
            for (var i = 0; i < length_2; i++) {
                item = children[i];
                if (item.nodeType == 1 &&
                    item.localName == "states") {
                    item.namespace = EXMLConfig2_1.NS_W;
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
                egretbridge_1.egretbridge.$warn(2102, this.currentClassName, getPropertyStr(item));
            }
            if (stateChildren && statesValue) {
                egretbridge_1.egretbridge.$warn(2103, this.currentClassName, "states", getPropertyStr(item));
            }
        }
        if (statesValue) {
            var states = statesValue.split(",");
            var length_3 = states.length;
            for (var i = 0; i < length_3; i++) {
                var stateName = states[i].trim();
                if (!stateName) {
                    continue;
                }
                if (stateNames.indexOf(stateName) == -1) {
                    stateNames.push(stateName);
                }
                this.stateCode.push(new CodeFactory_1.EXState(stateName));
            }
            return;
        }
        var length = stateChildren.length;
        for (var i = 0; i < length; i++) {
            var state = stateChildren[i];
            if (state.nodeType != 1) {
                continue;
            }
            var stateGroups = [];
            var attributes = state.attributes;
            if (attributes["stateGroups"]) {
                var groups = attributes.stateGroups.split(",");
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
            var stateName = attributes.name;
            if (stateNames.indexOf(stateName) == -1) {
                stateNames.push(stateName);
            }
            this.stateCode.push(new CodeFactory_1.EXState(stateName, stateGroups));
        }
    };
    /**
     * @private
     * 解析视图状态代码
     */
    EXMLParser.prototype.createStates = function (parentNode) {
        var items = parentNode.children;
        if (!items) {
            return;
        }
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var node = items[i];
            if (node.nodeType != 1 || this.isInnerClass(node)) {
                continue;
            }
            this.createStates(node);
            if (node.namespace == EXMLConfig2_1.NS_W || !node.localName) {
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
                var className = this.getClassNameOfNode(parentNode);
                var type = exports.exmlConfig.getPropertyType(prop, className);
                if (DEBUG) {
                    if (type == TYPE_ARRAY) {
                        egretbridge_1.egretbridge.$error(2013, this.currentClassName, getPropertyStr(node));
                    }
                    if (children.length > 1) {
                        egretbridge_1.egretbridge.$error(2011, this.currentClassName, prop, getPropertyStr(node));
                    }
                }
                var firstChild = children[0];
                var value = void 0;
                if (firstChild.nodeType == 1) {
                    this.createFuncForNode(firstChild);
                    this.checkIdForState(firstChild);
                    value = "this." + firstChild.attributes.id;
                }
                else {
                    value = this.formatValue(prop, firstChild.text, parentNode);
                }
                var states = this.getStateByName(stateName, node);
                var l = states.length;
                if (l > 0) {
                    for (var j = 0; j < l; j++) {
                        var state = states[j];
                        state.addOverride(new CodeFactory_1.EXSetProperty(parentNode.attributes.id, prop, value));
                    }
                }
            }
            else if (this.containsState(node)) {
                var attributes = node.attributes;
                var id = attributes.id;
                var nodeClassName = this.getClassNameOfNode(node);
                this.checkIdForState(node);
                var stateName = void 0;
                var states = void 0;
                var state = void 0;
                if (this.isStateNode(node)) {
                    var propertyName = "";
                    var parent = node.parent;
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
                    var positionObj = this.findNearNodeId(node);
                    var stateNames = [];
                    if (attributes.includeIn) {
                        stateNames = attributes.includeIn.split(",");
                    }
                    else {
                        var excludeNames = attributes.excludeFrom.split(",");
                        var stateLength = excludeNames.length;
                        for (var j = 0; j < stateLength; j++) {
                            var name = excludeNames[j];
                            this.getStateByName(name, node); //检查exlcudeFrom是否含有未定义的视图状态名
                        }
                        stateLength = this.stateCode.length;
                        for (var j = 0; j < stateLength; j++) {
                            state = this.stateCode[j];
                            if (excludeNames.indexOf(state.name) == -1) {
                                stateNames.push(state.name);
                            }
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
                                state.addOverride(new CodeFactory_1.EXAddItems(id, propertyName, positionObj.position, positionObj.relativeTo));
                            }
                        }
                    }
                }
                var names = Object.keys(attributes);
                var namesLength = names.length;
                for (var m = 0; m < namesLength; m++) {
                    var name = names[m];
                    var value = attributes[name];
                    var index = name.indexOf(".");
                    if (index != -1) {
                        var key = name.substring(0, index);
                        key = this.formatKey(key, value);
                        var bindingValue = this.formatBinding(key, value, node);
                        if (!bindingValue) {
                            value = this.formatValue(key, value, node);
                            if (!value) {
                                continue;
                            }
                        }
                        stateName = name.substr(index + 1);
                        states = this.getStateByName(stateName, node);
                        var l = states.length;
                        if (l > 0) {
                            for (var j = 0; j < l; j++) {
                                state = states[j];
                                if (bindingValue) {
                                    state.addOverride(new CodeFactory_1.EXSetStateProperty(id, key, bindingValue.templates, bindingValue.chainIndex));
                                }
                                else {
                                    state.addOverride(new CodeFactory_1.EXSetProperty(id, key, value));
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    /**
     * @private
     * 检查指定的ID是否创建了类成员变量，若没创建则为其创建。
     */
    EXMLParser.prototype.checkIdForState = function (node) {
        if (!node || this.currentClass.getVariableByName(node.attributes.id)) {
            return;
        }
        this.createVarForNode(node);
        var id = node.attributes.id;
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
     * @private
     * 通过视图状态名称获取对应的视图状态
     */
    EXMLParser.prototype.getStateByName = function (name, node) {
        var states = [];
        var stateCode = this.stateCode;
        var length = stateCode.length;
        for (var i = 0; i < length; i++) {
            var state = stateCode[i];
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
        if (DEBUG && states.length == 0) {
            egretbridge_1.egretbridge.$error(2006, this.currentClassName, name, toXMLString(node));
        }
        return states;
    };
    /**
     * @private
     * 寻找节点的临近节点ID和位置
     */
    EXMLParser.prototype.findNearNodeId = function (node) {
        var parentNode = node.parent;
        var targetId = "";
        var position;
        var index = -1;
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
            position = 0 /* FIRST */;
            return { position: position, relativeTo: targetId };
        }
        if (index == length - 1) {
            position = 1 /* LAST */;
            return { position: position, relativeTo: targetId };
        }
        if (afterItem) {
            position = 2 /* BEFORE */;
            targetId = afterItem.attributes.id;
            if (targetId) {
                this.checkIdForState(afterItem);
                return { position: position, relativeTo: targetId };
            }
        }
        return { position: 1 /* LAST */, relativeTo: targetId };
    };
    /**
     * @private
     * 获取节点的完整类名，包括模块名
     */
    EXMLParser.prototype.getClassNameOfNode = function (node) {
        var className = exports.exmlConfig.getClassNameById(node.localName, node.namespace);
        if (DEBUG && !className) {
            egretbridge_1.egretbridge.$error(2003, this.currentClassName, toXMLString(node));
        }
        return className;
    };
    return EXMLParser;
}());
exports.EXMLParser = EXMLParser;
/**
 * 获取重复的ID名
 */
function getRepeatedIds(xml) {
    var result = [];
    this.repeatedIdMap = {};
    this.getIds(xml, result);
    return result;
}
function getIds(xml, result) {
    if (xml.namespace != EXMLConfig2_1.NS_W && xml.attributes.id) {
        var id = xml.attributes.id;
        if (this.repeatedIdMap[id]) {
            result.push(toXMLString(xml));
        }
        else {
            this.repeatedIdMap[id] = true;
        }
    }
    var children = xml.children;
    if (children) {
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var node = children[i];
            if (node.nodeType !== 1 || this.isInnerClass(node)) {
                continue;
            }
            this.getIds(node, result);
        }
    }
}
function toXMLString(node) {
    if (!node) {
        return "";
    }
    var str = "  at <" + node.name;
    var attributes = node.attributes;
    var keys = Object.keys(attributes);
    var length = keys.length;
    for (var i = 0; i < length; i++) {
        var key = keys[i];
        var value = attributes[key];
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
function checkDeclarations(declarations, list) {
    if (!declarations) {
        return;
    }
    var children = declarations.children;
    if (children) {
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var node = children[i];
            if (node.nodeType != 1) {
                continue;
            }
            if (node.attributes.includeIn) {
                list.push(toXMLString(node));
            }
            if (node.attributes.excludeFrom) {
                list.push(toXMLString(node));
            }
            checkDeclarations(node, list);
        }
    }
}
function getPropertyStr(child) {
    var parentStr = toXMLString(child.parent);
    var childStr = toXMLString(child).substring(5);
    return parentStr + "\n      \t" + childStr;
}
