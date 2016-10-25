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

namespace eui.sys {

    let STATE = "eui.State";
    let ADD_ITEMS = "eui.AddItems";
    let SET_PROPERTY = "eui.SetProperty";
    let SET_STATEPROPERTY = "eui.SetStateProperty";
    let BINDING_PROPERTIES = "eui.Binding.$bindProperties";

    /**
     * @private
     * 代码生成工具基类
     */
    export class CodeBase {

        /**
         * @private
         *
         * @returns
         */
        public toCode():string {
            return "";
        }

        /**
         * @private
         */
        public indent:number = 0;

        /**
         * @private
         * 获取缩进字符串
         */
        public getIndent(indent?:number):string {
            if (indent === void 0)
                indent = this.indent;
            let str = "";
            for (let i = 0; i < indent; i++) {
                str += "	";
            }
            return str;
        }
    }


    /**
     * @private
     */
    export class EXClass extends CodeBase {

        /**
         * @private
         * 构造函数代码块
         */
        public constructCode:EXCodeBlock;
        /**
         * @private
         * 类名,不包括模块名
         */
        public className:string = "";

        /**
         * @private
         * 父类类名,包括完整模块名
         */
        public superClass:string = "";

        /**
         * @private
         * 内部类区块
         */
        private innerClassBlock:EXClass[] = [];

        /**
         * @private
         * 添加一个内部类
         */
        public addInnerClass(clazz:EXClass):void {
            if (this.innerClassBlock.indexOf(clazz) == -1) {
                this.innerClassBlock.push(clazz);
            }
        }

        /**
         * @private
         * 变量定义区块
         */
        private variableBlock:EXVariable[] = [];

        /**
         * @private
         * 添加变量
         */
        public addVariable(variableItem:EXVariable):void {
            if (this.variableBlock.indexOf(variableItem) == -1) {
                this.variableBlock.push(variableItem);
            }
        }

        /**
         * @private
         * 根据变量名获取变量定义
         */
        public getVariableByName(name:string):EXVariable {
            let list = this.variableBlock;
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let item = list[i];
                if (item.name == name) {
                    return item;
                }
            }
            return null;
        }

        /**
         * @private
         * 函数定义区块
         */
        private functionBlock:EXFunction[] = [];

        /**
         * @private
         * 添加函数
         */
        public addFunction(functionItem:EXFunction):void {
            if (this.functionBlock.indexOf(functionItem) == -1) {
                this.functionBlock.push(functionItem);
            }
        }

        /**
         * @private
         * 根据函数名返回函数定义块
         */
        public getFuncByName(name:string):EXFunction {
            let list = this.functionBlock;
            let length = list.length;
            for (let i = 0; i < length; i++) {
                let item = list[i];
                if (item.name == name) {
                    return item;
                }
            }
            return null;
        }

        /**
         * @private
         *
         * @returns
         */
        public toCode():string {

            let indent = this.indent;
            let indentStr = this.getIndent(indent);
            let indent1Str = this.getIndent(indent + 1);
            let indent2Str = this.getIndent(indent + 2);

            //打印类起始块
            let returnStr = indentStr + "(function (";
            if (this.superClass) {
                returnStr += "_super) {\n" + indent1Str + "__extends(" + this.className + ", _super);\n";
            }
            else {
                returnStr += ") {\n";
            }

            //打印内部类列表
            let innerClasses = this.innerClassBlock;
            let length = innerClasses.length;
            for (let i = 0; i < length; i++) {
                let clazz = innerClasses[i];
                clazz.indent = indent + 1;
                returnStr += indent1Str + "var " + clazz.className + " = " + clazz.toCode() + "\n\n";
            }

            returnStr += indent1Str + "function " + this.className + "() {\n";
            if (this.superClass) {
                returnStr += indent2Str + "_super.call(this);\n";
            }

            //打印变量列表
            let variables = this.variableBlock;
            length = variables.length;
            for (let i = 0; i < length; i++) {
                let variable = variables[i];
                if (variable.defaultValue) {
                    returnStr += indent2Str + variable.toCode() + "\n";
                }
            }

            //打印构造函数
            if (this.constructCode) {
                let codes = this.constructCode.toCode().split("\n");
                length = codes.length;
                for (let i = 0; i < length; i++) {
                    let code = codes[i];
                    returnStr += indent2Str + code + "\n";
                }
            }
            returnStr += indent1Str + "}\n";
            returnStr += indent1Str + "var _proto = " + this.className + ".prototype;\n\n";

            //打印函数列表
            let functions = this.functionBlock;
            length = functions.length;
            for (let i = 0; i < length; i++) {
                let functionItem = functions[i];
                functionItem.indent = indent + 1;
                returnStr += functionItem.toCode() + "\n";
            }

            //打印类结尾
            returnStr += indent1Str + "return " + this.className + ";\n" + indentStr;
            if (this.superClass) {
                returnStr += "})(" + this.superClass + ");";
            }
            else {
                returnStr += "})();";
            }
            return returnStr;
        }

    }

    /**
     * @private
     */
    export class EXCodeBlock extends CodeBase {

        /**
         * @private
         * 添加变量声明语句
         * @param name 变量名
         * @param value 变量初始值
         */
        public addVar(name:string, value?:string):void {
            let valueStr = value ? " = " + value : "";
            this.addCodeLine("var " + name + valueStr + ";");
        }

        /**
         * @private
         * 添加赋值语句
         * @param target 要赋值的目标
         * @param value 值
         * @param prop 目标的属性(用“.”访问)，不填则是对目标赋值
         */
        public addAssignment(target:string, value:string, prop?:string):void {
            let propStr = prop ? "." + prop : "";
            this.addCodeLine(target + propStr + " = " + value + ";");
        }

        /**
         * @private
         * 添加返回值语句
         */
        public addReturn(data:string):void {
            this.addCodeLine("return " + data + ";");
        }

        /**
         * @private
         * 添加一条空行
         */
        public addEmptyLine():void {
            this.addCodeLine("");
        }

        /**
         * @private
         * 开始添加if语句块,自动调用startBlock();
         */
        public startIf(expression:string):void {
            this.addCodeLine("if(" + expression + ")");
            this.startBlock();
        }

        /**
         * @private
         * 开始else语句块,自动调用startBlock();
         */
        public startElse():void {
            this.addCodeLine("else");
            this.startBlock();
        }

        /**
         * @private
         * 开始else if语句块,自动调用startBlock();
         */
        public startElseIf(expression:string):void {
            this.addCodeLine("else if(" + expression + ")");
            this.startBlock();
        }

        /**
         * @private
         * 添加一个左大括号，开始新的语句块
         */
        public startBlock():void {
            this.addCodeLine("{");
            this.indent++;
        }

        /**
         * @private
         * 添加一个右大括号,结束当前的语句块
         */
        public endBlock():void {
            this.indent--;
            this.addCodeLine("}");
        }

        /**
         * @private
         * 添加执行函数语句块
         * @param functionName 要执行的函数名称
         * @param args 函数参数列表
         */
        public doFunction(functionName:string, args:string[]):void {
            let argsStr = args.join(",");
            this.addCodeLine(functionName + "(" + argsStr + ")");
        }

        /**
         * @private
         */
        private lines:string[] = [];

        /**
         * @private
         * 添加一行代码
         */
        public addCodeLine(code:string):void {
            this.lines.push(this.getIndent() + code);
        }

        /**
         * @private
         * 添加一行代码到指定行
         */
        public addCodeLineAt(code:string, index:number):void {
            this.lines.splice(index, 0, this.getIndent() + code);
        }

        /**
         * @private
         * 是否存在某行代码内容
         */
        public containsCodeLine(code:string):boolean {
            return this.lines.indexOf(code) != -1;
        }

        /**
         * @private
         * 在结尾追加另一个代码块的内容
         */
        public concat(cb:EXCodeBlock):void {
            this.lines = this.lines.concat(cb.lines);
        }

        /**
         * @private
         *
         * @returns
         */
        public toCode():string {
            return this.lines.join("\n");
        }
    }

    /**
     * @private
     */
    export class EXFunction extends CodeBase {

        /**
         * @private
         * 代码块
         */
        public codeBlock:EXCodeBlock = null;

        /**
         * @private
         */
        public isGet:boolean = false;

        /**
         * @private
         * 函数名
         */
        public name:string = "";

        /**
         * @private
         *
         * @returns
         */
        public toCode():string {
            let indentStr:string = this.getIndent();
            let indent1Str:string = this.getIndent(this.indent + 1);
            let codeIndent:string;
            let returnStr = indentStr;
            if (this.isGet) {
                codeIndent = this.getIndent(this.indent + 2);
                returnStr += 'Object.defineProperty(_proto, "skinParts", {\n';
                returnStr += indent1Str + "get: function () {\n";
            }
            else {
                codeIndent = indent1Str;
                returnStr += "_proto." + this.name + " = function () {\n";
            }

            if (this.codeBlock) {
                let lines = this.codeBlock.toCode().split("\n");
                let length = lines.length;
                for (let i = 0; i < length; i++) {
                    let line = lines[i];
                    returnStr += codeIndent + line + "\n";
                }
            }
            if (this.isGet) {
                returnStr += indent1Str + "},\n" + indent1Str + "enumerable: true,\n" +
                    indent1Str + "configurable: true\n" + indentStr + "});";
            }
            else {
                returnStr += indentStr + "};";
            }

            return returnStr;
        }
    }

    /**
     * @private
     */
    export class EXVariable extends CodeBase {

        /**
         * @private
         */
        public constructor(name:string, defaultValue?:string) {
            super();
            this.indent = 2;
            this.name = name;
            this.defaultValue = defaultValue;
        }

        /**
         * @private
         * 变量名
         */
        public name:string;
        /**
         * @private
         * 默认值
         */
        public defaultValue:string;

        /**
         * @private
         *
         * @returns
         */
        public toCode():string {
            if (!this.defaultValue) {
                return "";
            }
            return "this." + this.name + " = " + this.defaultValue + ";";
        }
    }


    /**
     * @private
     */
    export class EXState extends CodeBase {

        /**
         * @private
         */
        public constructor(name:string, stateGroups?:any[]) {
            super();
            this.name = name;
            if (stateGroups)
                this.stateGroups = stateGroups;
        }

        /**
         * @private
         * 视图状态名称
         */
        public name:string = "";

        /**
         * @private
         */
        public stateGroups:any[] = [];

        /**
         * @private
         */
        public addItems:any[] = [];

        /**
         * @private
         */
        public setProperty:any[] = [];

        /**
         * @private
         * 添加一个覆盖
         */
        public addOverride(item:CodeBase):void {
            if (item instanceof EXAddItems)
                this.addItems.push(item);
            else
                this.setProperty.push(item);
        }

        /**
         * @private
         *
         * @returns
         */
        public toCode():string {
            let indentStr:string = this.getIndent(1);
            let returnStr:string = "new " + STATE + " (\"" + this.name + "\",\n" + indentStr + "[\n";
            let index:number = 0;
            let isFirst:boolean = true;
            let overrides:any[] = this.addItems.concat(this.setProperty);
            while (index < overrides.length) {
                if (isFirst)
                    isFirst = false;
                else
                    returnStr += ",\n";
                let item:CodeBase = overrides[index];
                let codes:any[] = item.toCode().split("\n");
                let length:number = codes.length;
                for (let i:number = 0; i < length; i++) {
                    let code:string = codes[i];
                    codes[i] = indentStr + indentStr + code;
                }
                returnStr += codes.join("\n");
                index++;
            }
            returnStr += "\n" + indentStr + "])";
            return returnStr;
        }
    }

    /**
     * @private
     */
    export class EXAddItems extends CodeBase {
        /**
         * @private
         */
        public constructor(target:string, property:string, position:number, relativeTo:string) {
            super();
            this.target = target;
            this.property = property;
            this.position = position;
            this.relativeTo = relativeTo;
        }

        /**
         * @private
         * 要添加的实例
         */
        public target:string;

        /**
         * @private
         * 要添加到的属性
         */
        public property:string;

        /**
         * @private
         * 添加的位置
         */
        public position:number;

        /**
         * @private
         * 相对的显示元素
         */
        public relativeTo:string;

        /**
         * @private
         *
         * @returns
         */
        public toCode():string {
            let returnStr:string = "new " + ADD_ITEMS + "(\"" + this.target + "\",\"" + this.property + "\"," + this.position + ",\"" + this.relativeTo + "\")";
            return returnStr;
        }
    }

    /**
     * @private
     */
    export class EXSetProperty extends CodeBase {
        /**
         * @private
         */
        public constructor(target:string, name:string, value:string) {
            super();
            this.target = target;
            this.name = name;
            this.value = value;
        }

        /**
         * @private
         * 要修改的属性名
         */
        public name:string;

        /**
         * @private
         * 目标实例名
         */
        public target:string;

        /**
         * @private
         * 属性值
         */
        public value:string;

        /**
         * @private
         *
         * @returns
         */
        public toCode():string {
            return "new " + SET_PROPERTY + "(\"" + this.target + "\",\"" + this.name + "\"," + this.value + ")";
        }
    }
    /**
     * @private
     */
    export class EXSetStateProperty extends CodeBase {
        /**
         * @private
         */
        public constructor(target:string, property:string, templates:string[], chainIndex:number[]) {
            super();
            if (target) {
                target = "this." + target;
            } else {
                target = "this";
            }
            this.target = target;
            this.property = property;
            this.templates = templates;
            this.chainIndex = chainIndex;
        }

        /**
         * @private
         * 目标实例名
         */
        public target:string;
        /**
         * @private
         * 目标属性名
         */
        public property:string;

        /**
         * @private
         * 绑定的模板列表
         */
        public templates:string[];

        /**
         * @private
         * chainIndex是一个索引列表，每个索引指向templates中的一个值，该值是代表属性链。
         */
        public chainIndex:number[];

        /**
         * @private
         *
         * @returns
         */
        public toCode():string {
            let expression = this.templates.join(",");
            let chain = this.chainIndex.join(",");
            return "new " + SET_STATEPROPERTY + "(this, [" + expression + "]," + "[" + chain + "]," +
                this.target + ",\"" + this.property + "\")";
        }
    }
    /**
     * @private
     */
    export class EXBinding extends CodeBase {

        /**
         * @private
         */
        public constructor(target:string, property:string, templates:string[], chainIndex:number[]) {
            super();
            this.target = target;
            this.property = property;
            this.templates = templates;
            this.chainIndex = chainIndex;
        }

        /**
         * @private
         * 目标实例名
         */
        public target:string;
        /**
         * @private
         * 目标属性名
         */
        public property:string;
        /**
         * @private
         * 绑定的模板列表
         */
        public templates:string[];

        /**
         * @private
         * chainIndex是一个索引列表，每个索引指向templates中的一个值，该值是代表属性链。
         */
        public chainIndex:number[];


        /**
         * @private
         *
         * @returns
         */
        public toCode():string {
            let expression = this.templates.join(",");
            let chain = this.chainIndex.join(",");
            return BINDING_PROPERTIES + "(this, [" + expression + "]," + "[" + chain + "]," +
                this.target + ",\"" + this.property + "\")";
        }
    }
}