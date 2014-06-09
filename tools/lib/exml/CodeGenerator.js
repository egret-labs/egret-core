/// <reference path="node.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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

exports.CodeBase = CodeBase;
exports.CpArguments = CpArguments;
exports.CpClass = CpClass;
exports.CpCodeBlock = CpCodeBlock;
exports.CpFunction = CpFunction;
exports.CpNotation = CpNotation;
exports.CpVariable = CpVariable;
exports.DataType = DataType;
exports.KeyWords = KeyWords;
exports.Modifiers = Modifiers;
//# sourceMappingURL=CodeGenerator.js.map
