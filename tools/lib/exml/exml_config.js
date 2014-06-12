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
var fs = require("fs");
var xml = require("../core/xml.js");
var param = require("../core/params_analyze.js");
var properties = require("./properties.json");
var CodeUtil = require("../core/code_util.js");

var EXMLConfig = (function () {
    /**
    * 构造函数
    */
    function EXMLConfig() {
        /**
        * 组件清单列表
        */
        this.componentDic = {};
        this.pathToClassName = {};
        this.classNameToPath = {};
        this.basicTypes = ["void", "any", "number", "string", "boolean", "Object", "Array", "Function"];
        var exmlPath = param.getEgretPath() + "/tools/lib/exml/";
        exmlPath = exmlPath.split("\\").join("/");
        var str = fs.readFileSync(exmlPath + "egret-manifest.xml", "utf-8");
        var manifest = xml.parse(str);
        this.parseManifest(manifest);
    }
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
            var path = this.getPathById(id, ns);
            name = this.pathToClassName[path];
            if (!name) {
                name = this.readClassNameFromPath(this.srcPath + path, id);
                this.pathToClassName[path] = name;
                this.classNameToPath[name] = path;
            }
        }
        return name;
    };

    EXMLConfig.prototype.readClassNameFromPath = function (path, id) {
        var tsText = fs.readFileSync(path, "utf-8");
        tsText = CodeUtil.removeComment(tsText);
        var className = "";
        var superClass;
        while (tsText.length) {
            var index = CodeUtil.getFirstVariableIndex("class", tsText);
            if (index == -1) {
                break;
            }
            var preStr = tsText.substring(0, index);
            tsText = tsText.substring(index + 5);
            if (CodeUtil.getFirstVariable(tsText) == id) {
                index = CodeUtil.getLastVariableIndex("module", preStr);
                if (index == -1) {
                    className = id;
                    break;
                }
                preStr = preStr.substring(index + 6);
                index = preStr.indexOf("{");
                if (index == -1) {
                    break;
                }
                var ns = preStr.substring(0, index);
                className = ns.trim() + "." + id;
                tsText = CodeUtil.removeFirstVariable(tsText);
                var word = CodeUtil.getFirstVariable(tsText);
                if (word == "extends") {
                    tsText = CodeUtil.removeFirstVariable(tsText);
                    superClass = CodeUtil.getFirstWord(tsText).trim();
                    if (superClass.charAt(superClass.length - 1) == "{") {
                        superClass = superClass.substring(0, superClass.length - 1);
                    }
                }
            }
        }
        if (className) {
            var comps = new Component();
            comps.id = id;
            comps.className = className;
            if (superClass) {
                comps.superClass = superClass;
            }
            this.componentDic[className] = comps;
        }
        return className;
    };

    /**
    * 根据id获取文件路径
    */
    EXMLConfig.prototype.getPathById = function (id, ns) {
        var className = "";
        if (!ns || ns == EXMLConfig.W || ns == EXMLConfig.E) {
            return className;
        }
        className = ns.substring(0, ns.length - 1) + id;
        var path = className.split(".").join("/");
        path += ".ts";
        return path;
    };

    /**
    * @inheritDoc
    */
    EXMLConfig.prototype.getDefaultPropById = function (id, ns) {
        var className = this.getClassNameById(id, ns);
        var component = this.componentDic[className];
        while (component) {
            if (component.defaultProp)
                break;
            className = component.superClass;
            component = this.componentDic[className];
        }
        if (!component)
            return "";
        return component.defaultProp;
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
            var path = this.srcPath + this.classNameToPath[className];
            if (!fs.existsSync(path)) {
                return "";
            }
            var text = fs.readFileSync(path, "utf-8");
            classData = this.getProperties(text, className);
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
    * 获取属性列表
    */
    EXMLConfig.prototype.getProperties = function (text, className) {
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
                        word = ns + "." + word;
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
                            inter = ns + "." + inter;
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
                            type = ns + "." + type;
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
                        type = ns + "." + type;
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
