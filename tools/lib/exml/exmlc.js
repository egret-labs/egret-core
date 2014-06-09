/// <reference path="node.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var EXMLCompiler = (function () {
    /**
    * 构造函数
    */
    function EXMLCompiler() {
        this.repeatedIdDic = {};
        /**
        * 需要单独创建的实例id列表
        */
        this.stateIds = [];
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
                if (result.indexOf(id) == -1)
                    result.push(id);
            } else {
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

    /**
    * 编译指定的XML对象为TypeScript类。
    * 注意:编译前要先注入egret-manifest.xml清单文件给manifestData属性。
    * @param xmlData 要编译的EXML文件内容
    * @param className 要编译成的完整类名，包括命名空间。
    */
    EXMLCompiler.prototype.compile = function (xmlData, className) {
        if (!xmlData || !className)
            return "";
        if (!this.exmlConfig) {
            this.exmlConfig = new EXMLConfig();
        }
        this.currentXML = xmlData;
        this.delayAssignmentDic = {};
        this.currentClassName = className;
        this.idDic = {};
        this.stateCode = [];
        this.declarations = null;
        this.currentClass = new CpClass();
        this.stateIds = [];
        var index = className.lastIndexOf(".");
        if (index != -1) {
            this.currentClass.moduleName = className.substring(0, index);
            this.currentClass.className = className.substring(index + 1);
        } else {
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

        if (this.declarations) {
            var children = this.declarations.children;
            if (children) {
                length = children.length;
                for (var i = 0; i < length; i++) {
                    node = children[i];
                    if (node["$includeIn"])
                        delete node.$includeIn;
                    if (node["$excludeFrom"])
                        delete node.$excludeFrom;
                }
            }
        }

        this.addIds(this.currentXML.children);

        this.createConstructFunc();
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
            if (node.namespace == EXMLCompiler.W) {
            } else if (node["$id"]) {
                this.createVarForNode(node);
                if (this.isStateNode(node))
                    this.stateIds.push(node.$id);
            } else if (this.getPackageByNode(node) != "") {
                this.createIdForNode(node);
                if (this.isStateNode(node))
                    this.stateIds.push((node.$id));
            }
            this.addIds(node.children);
        }
    };

    /**
    * 检测指定节点的属性是否含有视图状态
    */
    EXMLCompiler.containsState = function (node) {
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
        var className = node.localName;
        if (this.isBasicTypeData(className)) {
            if (!this.currentClass.containsVar(node.$id))
                this.currentClass.addVariable(new CpVariable(node.$id, Modifiers.M_PUBLIC, className));
            return;
        }
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
        var moduleName = this.getPackageByNode(node);
        var className = node.localName;
        var isBasicType = this.isBasicTypeData(className);
        if (!isBasicType && (this.isProperty(node) || moduleName == ""))
            return "";
        if (isBasicType)
            return this.createBasicTypeForNode(node);
        var func = new CpFunction;
        var tailName = "_i";
        var id = node.$id;
        func.name = id + tailName;
        func.returnType = moduleName;
        var cb = new CpCodeBlock;
        var varName = "t";
        if (className == "Object") {
            cb.addVar(varName, "any", "{}");
        } else {
            cb.addVar(varName, moduleName, "new " + moduleName + "()");
        }

        var containsId = this.currentClass.containsVar(node.$id);
        if (containsId) {
            cb.addAssignment("this." + node.$id, varName);
        }

        this.addAttributesToCodeBlock(cb, varName, node);

        var children = node.children;
        var obj = this.exmlConfig.getDefaultPropById(node.localName, node.namespace);
        var property = obj.name;
        var isArray = obj.isArray;

        this.initlizeChildNode(cb, children, property, isArray, varName);
        if (this.delayAssignmentDic[id]) {
            cb.concat(this.delayAssignmentDic[id]);
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
        var length = this.basicTypes.length;
        for (var i = 0; i < length; i++) {
            var type = this.basicTypes[i];
            if (type == className)
                return true;
        }
        return false;
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
                returnValue = returnValue;
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
        var length = keyList.length;
        for (var i = 0; i < length; i++) {
            key = keyList[i];
            value = node[key].toString();
            key = this.formatKey(key.substring(1), value);
            value = this.formatValue(key, value, node);
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
                    delayCb.addAssignment(varName, value, key);
                } else {
                    delayCb.startIf("this." + id);
                    delayCb.addAssignment("this." + id, value, key);
                    delayCb.endBlock();
                }
                this.delayAssignmentDic[value] = delayCb;
            }
            cb.addAssignment(varName, value, key);
        }
    };

    /**
    * 初始化子项
    */
    EXMLCompiler.prototype.initlizeChildNode = function (cb, children, property, isArray, varName) {
        if (!children || children.length == 0)
            return;
        var child;
        var childFunc = "";
        var directChild = [];
        var prop = "";
        var length = children.length;
        for (var i = 0; i < length; i++) {
            child = children[i];
            prop = child.localName;
            if (prop == EXMLCompiler.DECLARATIONS || prop == "states" || child.namespace == EXMLCompiler.W) {
                continue;
            }
            if (this.isProperty(child)) {
                if (!child.children)
                    continue;
                var childLength = child.children.length;
                if (childLength == 0)
                    continue;
                var isContainerProp = (prop == property && isArray);
                if (childLength > 1) {
                    var values = [];
                    for (var j = 0; j < childLength; j++) {
                        var item = child.children[j];
                        childFunc = this.createFuncForNode(item);
                        if (!isContainerProp || !this.isStateNode(item))
                            values.push(childFunc);
                    }
                    childFunc = "[" + values.join(",") + "]";
                } else {
                    var firsChild = child.children[0];
                    if (isContainerProp) {
                        if (firsChild.localName == "Array") {
                            values = [];
                            if (firsChild.children) {
                                var len = firsChild.children.length;
                                for (var k = 0; k < len; k++) {
                                    item = firstChild.children[k];
                                    childFunc = this.createFuncForNode(item);
                                    if (!isContainerProp || !this.isStateNode(item))
                                        values.push(childFunc);
                                }
                            }
                            childFunc = "[" + values.join(",") + "]";
                        } else {
                            childFunc = this.createFuncForNode(firsChild);
                            if (!this.isStateNode(item))
                                childFunc = "[" + childFunc + "]";
                            else
                                childFunc = "[]";
                        }
                    } else {
                        childFunc = this.createFuncForNode(firsChild);
                    }
                }
                if (childFunc != "") {
                    if (childFunc.indexOf("()") == -1)
                        prop = this.formatKey(prop, childFunc);
                    cb.addAssignment(varName, childFunc, prop);
                }
            } else {
                directChild.push(child);
            }
        }
        if (directChild.length == 0)
            return;
        if (isArray && (directChild.length > 1 || directChild[0].localName != "Array")) {
            var childs = [];
            length = directChild.length;
            for (i = 0; i < length; i++) {
                child = directChild[i];
                childFunc = this.createFuncForNode(child);
                if (childFunc == "" || this.isStateNode(child))
                    continue;
                childs.push(childFunc);
            }
            cb.addAssignment(varName, "[" + childs.join(",") + "]", property);
        } else {
            childFunc = this.createFuncForNode(directChild[0]);
            if (childFunc != "" && !this.isStateNode(child))
                cb.addAssignment(varName, childFunc, property);
        }
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
            return "";
        }
        var stringValue = value;
        value = value.trim();
        if (value.indexOf("{") != -1) {
            value = value.substr(1, value.length - 2);
        } else {
            var className = this.exmlConfig.getClassNameById(node.localName, node.namespace);
            var type = this.exmlConfig.getPropertyType(key, className, value);
            switch (type) {
                case "number":
                    if (value.indexOf("#") == 0)
                        value = "0x" + value.substring(1);
                    else if (value.indexOf("%") != -1)
                        value = (parseFloat(value.substr(0, value.length - 1))).toString();
                    break;
                case "string":
                    value = this.formatString(stringValue);
                    break;
                default:
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
        var list = StringUtil.htmlEntities;
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

        var obj = this.exmlConfig.getDefaultPropById(this.currentXML.localName, this.currentXML.namespace);
        var property = obj.name;
        var isArray = obj.isArray;
        this.initlizeChildNode(cb, this.currentXML.children, property, isArray, varName);
        var id;
        if (this.stateIds.length > 0) {
            length = this.stateIds.length;
            for (var i = 0; i < length; i++) {
                id = this.stateIds[i];
                cb.addCodeLine("this." + id + "_i();");
            }
            cb.addEmptyLine();
        }
        cb.addEmptyLine();

        //生成视图状态代码
        this.createStates(this.currentXML.children);
        var states;
        var node = this.currentXML;
        for (var itemName in node) {
            var value = node[itemName];
            var itemName = itemName.substring(1);
            var index = itemName.indexOf(".");
            if (index != -1) {
                var key = itemName.substring(0, index);
                key = this.formatKey(key, value);
                var itemValue = this.formatValue(key, value, node);
                var stateName = itemName.substr(index + 1);
                states = this.getStateByName(stateName);
                var stateLength = states.length;
                if (stateLength > 0) {
                    for (var i = 0; i < stateLength; i++) {
                        var state = states[i];
                        state.addOverride(new CpSetProperty("", key, itemValue));
                    }
                }
            }
        }

        //打印视图状态初始化代码
        if (this.stateCode.length > 0) {
            cb.addCodeLine("this.states = [");
            var first = true;
            var indentStr = "	";
            var length = this.stateCode;
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
        var states;
        var children = this.currentXML.children;
        if (chidren) {
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var item = children[i];
                if (item.localName == "states") {
                    states = item.children;
                    break;
                }
            }
        }

        if (states == null || states.length == 0)
            return;
        length = states.length;
        for (i = 0; i < length; i++) {
            var state = states[i];
            var stateGroups = [];
            if (state["$stateGroups"]) {
                var groups = state.$stateGroups.split(",");
                var len = groups.length;
                for (var j = 0; j < len; j++) {
                    var group = groups[i].trim();
                    if (group) {
                        stateGroups.push(group);
                    }
                }
            }
            this.stateCode.push(new CpState(state.$name, stateGroups));
        }
    };

    /**
    * 解析视图状态代码
    */
    EXMLCompiler.prototype.createStates = function (items) {
        if (!items) {
            return;
        }
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var node = items[i];
            this.createStates(node.children);
            if (this.isProperty(node) || this.getPackageByNode(node) == "")
                continue;
            if (EXMLCompiler.containsState(node)) {
                var id = node.$id;
                this.checkIdForState(node);
                var stateName;
                var states;
                var state;
                if (this.isStateNode(node)) {
                    var propertyName = "";
                    var parentNode = (node.parent);
                    if (parentNode.localName == "Array")
                        parentNode = parentNode.parent;
                    if (this.isProperty(parentNode))
                        parentNode = parentNode.parent;
                    if (parentNode && parentNode != this.currentXML) {
                        propertyName = parentNode.$id;
                        this.checkIdForState(parentNode);
                    }
                    var positionObj = this.findNearNodeId(node);
                    var stateNames = [];
                    if (node.hasOwnProperty("$includeIn")) {
                        stateNames = node.$includeIn.toString().split(",");
                    } else {
                        var excludeNames = node.$excludeFrom.toString().split(",");
                        var stateLength = this.stateCode.length;
                        for (var j = 0; j < stateLength; j++) {
                            state = this.stateCode[j];
                            if (excludeNames.indexOf(state.name) == -1)
                                stateNames.push(state.name);
                        }
                    }

                    var len = statenames.length;
                    for (var k = 0; k < len; k++) {
                        stateName = stateNames[k];
                        states = this.getStateByName(stateName);
                        if (states.length > 0) {
                            var l = states.length;
                            for (var j = 0; j < l; j++) {
                                state = states[j];
                                state.addOverride(new CpAddItems(id, propertyName, positionObj.position, positionObj.relativeTo));
                            }
                        }
                    }
                }

                for (var name in node) {
                    var value = node[name];
                    name = name.substring(1);
                    var index = name.indexOf(".");
                    if (index != -1) {
                        var key = name.substring(0, index);
                        key = this.formatKey(key, value);
                        var value = this.formatValue(key, value, node);
                        stateName = name.substr(index + 1);
                        states = this.getStateByName(stateName);
                        var l = states.length;
                        if (l > 0) {
                            for (var j = 0; j < l; j++) {
                                state = states[j];
                                state.addOverride(new CpSetProperty(id, key, value));
                            }
                        }
                    }
                }
            }
        }
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
    EXMLCompiler.prototype.getStateByName = function (name) {
        var states = [];
        var length = this.stateCode.length;
        for (var i = 0; i < length; i++) {
            var state = this.stateCode[i];
            if (state.name == name) {
                if (states.indexOf(state) == -1)
                    states.push(state);
            } else if (state.stateGroups.length > 0) {
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
            } else {
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
        this.exmlConfig.checkComponent(moduleName);
        if (moduleName && moduleName.indexOf(".") != -1) {
            this.currentClass.addReference(moduleName);
        }
        return moduleName;
    };

    /**
    * 检查变量是否是包名
    */
    EXMLCompiler.prototype.isPackageName = function (name) {
        return name.indexOf(".") != -1;
    };
    EXMLCompiler.E = "http://ns.egret-labs.org/egret";

    EXMLCompiler.W = "http://ns.egret-labs.org/wing";

    EXMLCompiler.STATE_CLASS_PACKAGE = "egret.State";

    EXMLCompiler.ADD_ITEMS_PACKAGE = "egret.AddItems";

    EXMLCompiler.SETPROPERTY_PACKAGE = "egret.SetProperty";

    EXMLCompiler.DECLARATIONS = "Declarations";

    EXMLCompiler.wingKeys = ["$id", "$locked", "$includeIn", "$excludeFrom"];
    return EXMLCompiler;
})();

var EXMLConfig = (function () {
    /**
    * 构造函数
    */
    function EXMLConfig() {
        /**
        * 组件清单列表
        */
        this.componentDic = {};
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
                component.isArray = superComp.isArray;
            }
        }
        return component.defaultProp;
    };

    /**
    * @inheritDoc
    */
    EXMLConfig.prototype.addComponent = function (className, superClass) {
        if (!className)
            return null;
        if (superClass == null)
            superClass = "";
        className = className.split("::").join(".");
        superClass = superClass.split("::").join(".");
        var id = className;
        var index = className.lastIndexOf(".");
        if (index != -1) {
            id = className.substring(index + 1);
        }
        var component = new Component();
        component.id = id;
        component.className = className;
        component.superClass = superClass;
        this.componentDic[className] = component;
        return component;
    };

    /**
    * @inheritDoc
    */
    EXMLConfig.prototype.removeComponent = function (className) {
        var component = this.componentDic[className];
        delete this.componentDic[className];
        return component;
    };

    /**
    * @inheritDoc
    */
    EXMLConfig.prototype.hasComponent = function (className) {
        return this.componentDic[className];
    };

    /**
    * @inheritDoc
    */
    EXMLConfig.prototype.checkComponent = function (className) {
    };

    /**
    * @inheritDoc
    */
    EXMLConfig.prototype.getClassNameById = function (id, ns) {
        var name = "";
        if (id == "Object") {
            return id;
        }
        if (ns == EXMLCompiler.W) {
        } else if (!ns || ns == EXMLCompiler.E) {
            name = "egret." + id;
        } else {
            name = ns.uri;
            name = name.substring(0, name.length - 1) + id;
        }
        return name;
    };

    /**
    * @inheritDoc
    */
    EXMLConfig.prototype.getDefaultPropById = function (id, ns) {
        var data = { name: "", isArray: false };
        var className = this.getClassNameById(id, ns);
        var component = this.componentDic[className];
        while (component) {
            if (component.defaultProp)
                break;
            className = component.superClass;
            component = this.componentDic[className];
        }
        if (!component)
            return data;
        data.name = component.defaultProp;
        data.isArray = component.isArray;
        return data;
    };

    /**
    * @inheritDoc
    */
    EXMLConfig.prototype.getPropertyType = function (prop, className, value) {
        var type = "";
        if (prop == "percentHeight" || prop == "percentWidth")
            type = "number";
        else if (value.indexOf("#") == 0 && !isNaN(parseInt("0x" + value.substring(1))))
            type = "number";
        else if (value == "true" || value == "false")
            type = "Boolean";
        else
            type = "String";
        return type;
    };
    return EXMLConfig;
})();

var Component = (function () {
    /**
    * 构造函数
    */
    function Component(item) {
        if (typeof item === "undefined") { item = null; }
        /**
        * 父级类名
        */
        this.superClass = "";
        /**
        * 默认属性
        */
        this.defaultProp = "";
        /**
        * 默认属性是否为数组类型
        */
        this.isArray = false;
        if (item) {
            this.id = item.$id;
            this.className = "egret." + this.id;
            if (item["$super"])
                this.superClass = item.$super;
            if (item["$defaultProperty"])
                this.defaultProp = item.$default;
            if (item["$array"])
                this.isArray = (item.$array == "true");
        }
    }
    return Component;
})();

var CpState = (function (_super) {
    __extends(CpState, _super);
    function CpState(name, stateGroups) {
        if (typeof stateGroups === "undefined") { stateGroups = null; }
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
        var returnStr = "new egret.State (\"" + this.name + "\",\n" + indentStr + "[\n";
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
        var returnStr = "new egret.AddItems(\"" + this.target + "\",\"" + this.propertyName + "\",\"" + this.position + "\",\"" + this.relativeTo + "\")";
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
        return "new egret.SetProperty(\"" + this.target + "\",\"" + this.name + "\"," + this.value + ")";
    };
    return CpSetProperty;
})(CodeBase);

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
        if (typeof indent === "undefined") { indent = -1; }
        if (indent == -1)
            indent = this._indent;
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
        if (typeof name === "undefined") { name = ""; }
        if (typeof type === "undefined") { type = ""; }
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

    CpClass.prototype.sortOn = function (list, key) {
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var min = i;
            for (var j = i + 1; j < length; j++) {
                if (list[j][key] < list[min][key])
                    min = j;
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

    CpClass.prototype.toCode = function () {
        //字符串排序
        this.referenceBlock.sort();
        this.sortOn(this.variableBlock, "name");
        this.sortOn(this.functionBlock, "name");

        var isFirst = true;
        var index = 0;
        var indentStr = this.getIndent();

        var returnStr = "";

        //打印文件引用区域
        index = 0;
        while (index < this.referenceBlock.length) {
            var importItem = this.referenceBlock[index];
            returnStr += "/// <reference path=\"" + importItem + "\"/>\n";
            index++;
        }
        if (returnStr)
            returnStr += "\n";

        //打印包名
        returnStr += KeyWords.KW_MODULE + " " + this.moduleName + "{\n";

        //打印注释
        if (this.notation != null) {
            this.notation.indent = this.indent;
            returnStr += this.notation.toCode() + "\n";
        }
        returnStr += indentStr + KeyWords.KW_EXPORT + " " + KeyWords.KW_CLASS + " " + this.className;

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
                } else {
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
            returnStr += variableItem.toCode() + "\n";
            index++;
        }
        returnStr += "\n";

        //打印构造函数
        returnStr += this.getIndent(this.indent + 1) + Modifiers.M_PUBLIC + " " + KeyWords.KW_FUNCTION + " constructor(";
        isFirst = true;
        index = 0;
        while (this.argumentBlock.length > index) {
            var arg = this.argumentBlock[index];
            if (isFirst) {
                returnStr += arg.toCode();
                isFirst = false;
            } else {
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
            returnStr += functionItem.toCode() + "\n";
            index++;
        }

        returnStr += indentStr + "}\n}";

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
        if (typeof value === "undefined") { value = ""; }
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
        if (typeof prop === "undefined") { prop = ""; }
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
            } else {
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

        var returnStr = noteStr + indentStr + this.modifierName + " " + staticStr + " " + this.name + "(";

        var isFirst = true;
        index = 0;
        while (this.argumentBlock.length > index) {
            var arg = this.argumentBlock[index];
            if (isFirst) {
                returnStr += arg.toCode();
                isFirst = false;
            } else {
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
        if (typeof notation === "undefined") { notation = ""; }
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
        if (typeof name === "undefined") { name = "varName"; }
        if (typeof modifierName === "undefined") { modifierName = "public"; }
        if (typeof type === "undefined") { type = "any"; }
        if (typeof defaultValue === "undefined") { defaultValue = ""; }
        if (typeof isStatic === "undefined") { isStatic = false; }
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

var DataType = (function () {
    function DataType() {
    }
    DataType.DT_VOID = "void";

    DataType.DT_INT = "int";

    DataType.DT_NUMBER = "Number";

    DataType.DT_BOOLEAN = "Boolean";

    DataType.DT_ARRAY = "Array";

    DataType.DT_STRING = "String";

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
