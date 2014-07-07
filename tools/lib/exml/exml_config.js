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
/// <reference path="node.d.ts"/>
var file = require("../core/file.js");
var xml = require("../core/xml.js");
var param = require("../core/params_analyze.js");
var properties = require("./properties.json");
var CodeUtil = require("../core/code_util.js");
var create_manifest = require("../tools/create_manifest.js");

var EXMLConfig = (function () {
    /**
    * 构造函数
    */
    function EXMLConfig() {
        /**
        * 组件清单列表
        */
        this.componentDic = {};
        this.basicTypes = ["void", "any", "number", "string", "boolean", "Object", "Array", "Function"];
        var exmlPath = param.getEgretPath() + "/tools/lib/exml/";
        exmlPath = exmlPath.split("\\").join("/");
        var str = file.read(exmlPath + "egret-manifest.xml");
        var manifest = xml.parse(str);
        this.parseManifest(manifest);
    }
    Object.defineProperty(EXMLConfig.prototype, "srcPath", {
        get: function () {
            return this._srcPath;
        },
        set: function (value) {
            this._srcPath = value;
            this.classNameToPath = create_manifest.getClassToPathInfo(this.srcPath);
            this.parseModules();
        },
        enumerable: true,
        configurable: true
    });


    EXMLConfig.prototype.parseModules = function () {
        this.classNameToModule = {};
        for (var className in this.classNameToPath) {
            var index = className.lastIndexOf(".");
            var ns = "";
            if (index != -1) {
                ns = className.substring(0, index);
                className = className.substring(index + 1);
            }
            var list = this.classNameToModule[className];
            if (!list) {
                list = this.classNameToModule[className] = [];
            }
            if (list.indexOf(ns) == -1) {
                list.push(ns);
            }
        }
    };

    /**
    * 解析框架清单文件
    */
    EXMLConfig.prototype.parseManifest = function (manifest) {
        var children = manifest.children;
        var length = children.length;
        for (var i = 0; i < length; i++) {
            var item = children[i];
            var component = new Component(item);
            this.componentDic[component.className] = component;
        }
        for (var className in this.componentDic) {
            var component = this.componentDic[className];
            if (!component.defaultProp)
                this.findProp(component);
        }
    };

    /**
    * 递归查找默认属性
    */
    EXMLConfig.prototype.findProp = function (component) {
        if (component.defaultProp)
            return component.defaultProp;
        var superComp = this.componentDic[component.superClass];
        if (superComp) {
            var prop = this.findProp(superComp);
            if (prop) {
                component.defaultProp = prop;
            }
        }
        return component.defaultProp;
    };

    /**
    * @inheritDoc
    */
    EXMLConfig.prototype.getClassNameById = function (id, ns) {
        var name = "";
        if (this.basicTypes.indexOf(id) != -1) {
            return id;
        }
        if (ns == EXMLConfig.W) {
        } else if (!ns || ns == EXMLConfig.E) {
            name = "egret." + id;
            if (!this.componentDic[name]) {
                name = "";
            }
        } else {
            name = ns.substring(0, ns.length - 1) + id;
            if (!this.classNameToPath[name]) {
                name = "";
            }
        }
        return name;
    };

    /**
    * 检查一个类名是否存在
    */
    EXMLConfig.prototype.checkClassName = function (className) {
        if (this.componentDic[className]) {
            return true;
        }
        if (this.classNameToPath[name]) {
            return true;
        }
        return false;
    };

    /**
    * @inheritDoc
    */
    EXMLConfig.prototype.getDefaultPropById = function (id, ns) {
        var className = this.getClassNameById(id, ns);
        var component = this.componentDic[className];
        if (!component && className) {
            component = this.findDefaultProp(className);
        }
        if (!component)
            return "";
        return component.defaultProp;
    };

    EXMLConfig.prototype.findDefaultProp = function (className) {
        var classData = properties[className];
        if (!classData) {
            var path = this.classNameToPath[className];
            var ext = file.getExtension(path).toLowerCase();
            var text = file.read(path);
            if (ext == "ts") {
                classData = this.getPropertiesFromTs(text, className);
            } else if (ext == "exml") {
                classData = this.getPropertiesFromExml(text);
            }
            if (classData) {
                properties[className] = classData;
            } else {
                return null;
            }
        }
        var superClass = classData["super"];
        var component = this.componentDic[superClass];
        if (!component) {
            component = this.findDefaultProp(superClass);
        }
        return component;
    };

    /**
    * 获取指定类指定属性的类型
    */
    EXMLConfig.prototype.getPropertyType = function (prop, className) {
        if (className == "Object") {
            return "any";
        }
        var type = this.findType(className, prop);
        return type;
    };

    EXMLConfig.prototype.findType = function (className, prop) {
        var classData = properties[className];
        if (!classData) {
            var path = this.classNameToPath[className];
            var ext = file.getExtension(path).toLowerCase();
            var text = file.read(path);
            if (ext == "ts") {
                classData = this.getPropertiesFromTs(text, className);
            } else if (ext == "exml") {
                classData = this.getPropertiesFromExml(text);
            }
            if (classData) {
                properties[className] = classData;
            } else {
                return "";
            }
        }
        var type = classData[prop];
        if (!type) {
            type = this.findType(classData["super"], prop);
        }
        return type;
    };

    /**
    * 读取一个exml文件引用的类列表
    */
    EXMLConfig.prototype.getPropertiesFromExml = function (text) {
        var exml = xml.parse(text);
        if (!exml) {
            return null;
        }
        var superClass = this.getClassNameById(exml.localName, exml.namespace);
        if (superClass) {
            var data = {};
            data["super"] = superClass;
            return data;
        }
        return null;
    };

    /**
    * 获取属性列表
    */
    EXMLConfig.prototype.getPropertiesFromTs = function (text, className) {
        index = className.lastIndexOf(".");
        var moduleName = "";
        if (index != -1) {
            moduleName = className.substring(0, index);
            className = className.substring(index + 1);
        }
        var data;
        text = CodeUtil.removeComment(text);
        if (moduleName) {
            while (text.length > 0) {
                var index = CodeUtil.getFirstVariableIndex("module", text);
                if (index == -1) {
                    break;
                }
                text = text.substring(index + 6);
                index = text.indexOf("{");
                if (index == -1) {
                    continue;
                }
                var ns = text.substring(0, index).trim();
                if (ns == moduleName) {
                    index = CodeUtil.getBracketEndIndex(text);
                    if (index != -1) {
                        var block = text.substring(0, index);
                        index = block.indexOf("{");
                        block = block.substring(index + 1);
                        data = this.getPropFromBlock(block, className, moduleName);
                    }
                    break;
                }
            }
        } else {
            data = this.getPropFromBlock(text, className, "");
        }

        return data;
    };

    EXMLConfig.prototype.getPropFromBlock = function (block, targetClassName, ns) {
        var data;
        while (block.length > 0) {
            var index = CodeUtil.getFirstVariableIndex("class", block);
            if (index == -1) {
                break;
            }
            block = block.substring(index + 5);
            index = block.indexOf("{");
            var preStr = block.substring(0, index);
            block = block.substring(index);
            var className = CodeUtil.getFirstVariable(preStr);
            if (className != targetClassName) {
                continue;
            }
            data = {};
            preStr = CodeUtil.removeFirstVariable(preStr, className);
            var word = CodeUtil.getFirstVariable(preStr);
            if (word == "extends") {
                preStr = CodeUtil.removeFirstVariable(preStr);
                word = CodeUtil.getFirstWord(preStr);
                if (word) {
                    if (ns && word.indexOf(".") == -1) {
                        word = this.getFullClassName(word, ns);
                    }
                    data["super"] = word;
                }
                preStr = CodeUtil.removeFirstWord(preStr);
                word = CodeUtil.getFirstVariable(preStr);
            }
            if (word == "implements") {
                preStr = CodeUtil.removeFirstVariable(preStr);
                var arr = preStr.split(",");
                for (var i = arr.length - 1; i >= 0; i--) {
                    var inter = arr[i];
                    inter = inter.trim();
                    if (inter) {
                        if (ns && inter.indexOf(".") == -1) {
                            inter = this.getFullClassName(inter, ns);
                        }
                        arr[i] = inter;
                    } else {
                        arr.splice(i, 1);
                    }
                }
                data["implements"] = arr;
            }
            index = CodeUtil.getBracketEndIndex(block);
            if (index == -1)
                break;
            var text = block.substring(0, index + 1);
            this.readProps(text, data, ns);
            break;
        }
        return data;
    };

    EXMLConfig.prototype.getFullClassName = function (word, ns) {
        if (!ns) {
            ns = "";
        }
        var nsList = this.classNameToModule[word];
        var length = nsList.length;
        var prefix = ns.split(".")[0];
        for (var k = 0; k < length; k++) {
            var superNs = nsList[k];
            if (superNs.split(".")[0] == prefix) {
                word = superNs + "." + word;
            }
        }
        return word;
    };

    EXMLConfig.prototype.readProps = function (text, data, ns) {
        var lines = text.split("\n");
        var length = lines.length;
        for (var i = 0; i < length; i++) {
            var line = lines[i];
            var index = CodeUtil.getFirstVariableIndex("public", line);
            if (index == -1)
                continue;
            line = line.substring(index + 7);
            var word = CodeUtil.getFirstVariable(line);
            if (!word || word.charAt(0) == "_")
                continue;
            if (word == "get") {
                continue;
            } else if (word == "set") {
                line = CodeUtil.removeFirstVariable(line);
                word = CodeUtil.getFirstVariable(line);
                if (!word || word.charAt(0) == "_") {
                    continue;
                }
                line = CodeUtil.removeFirstVariable(line);
                line = line.trim();
                if (line.charAt(0) == "(") {
                    index = line.indexOf(":");
                    if (index != -1) {
                        line = line.substring(index + 1);
                        index = line.indexOf(")");
                        type = line.substring(0, index);
                        index = type.indexOf("<");
                        if (index != -1) {
                            type = type.substring(0, index);
                        }
                        type = CodeUtil.trimVariable(type);
                        if (type.indexOf(".") == -1 && this.basicTypes.indexOf(type) == -1) {
                            type = this.getFullClassName(type, ns);
                        }
                        data[word] = type;
                    } else {
                        data[word] = "any";
                    }
                }
            } else {
                line = CodeUtil.removeFirstVariable(line);
                line = line.trim();
                var firstChar = line.charAt(0);
                if (firstChar == ":") {
                    var type = CodeUtil.getFirstWord(line.substring(1));
                    index = type.indexOf("=");
                    if (index != -1) {
                        type = type.substring(0, index);
                    }
                    index = type.indexOf("<");
                    if (index != -1) {
                        type = type.substring(0, index);
                    }
                    type = CodeUtil.trimVariable(type);
                    if (type.indexOf(".") == -1 && this.basicTypes.indexOf(type) == -1) {
                        type = this.getFullClassName(type, ns);
                    }
                    data[word] = type;
                } else if (!line || firstChar == ";" || firstChar == "=") {
                    data[word] = "any";
                }
            }
        }
    };

    /**
    * 检查classNameA是否是classNameB的子类或classNameA实现了接口classNameB
    */
    EXMLConfig.prototype.isInstanceOf = function (classNameA, classNameB) {
        if (classNameB == "any") {
            return true;
        }
        if (classNameA == classNameB) {
            return true;
        }
        var dataA = properties[classNameA];
        if (!dataA) {
            return false;
        }
        var list = dataA["implements"];
        if (list) {
            var length = list.length;
            for (var i = 0; i < length; i++) {
                if (list[i] == classNameB) {
                    return true;
                }
            }
        }
        return this.isInstanceOf(dataA["super"], classNameB);
    };
    EXMLConfig.E = "http://ns.egret-labs.org/egret";

    EXMLConfig.W = "http://ns.egret-labs.org/wing";
    return EXMLConfig;
})();

var Component = (function () {
    /**
    * 构造函数
    */
    function Component(item) {
        /**
        * 父级类名
        */
        this.superClass = "";
        /**
        * 默认属性
        */
        this.defaultProp = "";
        if (item) {
            this.id = item.$id;
            this.className = "egret." + this.id;
            if (item["$super"])
                this.superClass = "egret." + item.$super;
            if (item["$default"])
                this.defaultProp = item.$default;
        }
    }
    return Component;
})();

exports.EXMLConfig = EXMLConfig;
//# sourceMappingURL=exml_config.js.map
