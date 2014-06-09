
/// <reference path="node.d.ts"/>


class CodeBase{
    public constructor(){
    }

    public toCode():string{
        return "";
    }

    public indent:number = 0;

    /**
     * 获取缩进字符串
     */
    public getIndent(indent:number = -1):string{
        if(indent==-1)
            indent = this._indent;
        var str:string = "";
        for(var i:number = 0;i<indent;i++){
            str += "	";
        }
        return str;
    }
}


class CpArguments extends CodeBase{
    public constructor(name:string = "",type:string = ""){
        super();
        this.name = name;
        this.type = type;
    }

    public name:string = "";

    public type:string = "";

    public toCode():string{
        return this.name+":"+this.type;
    }
}



class CpClass extends CodeBase{
    public constructor(){
        super();
        this.indent = 1;
    }
    /**
     * 构造函数的参数列表
     */
    private argumentBlock:Array<any> = [];
    /**
     * 添加构造函数的参数
     */
    public addArgument(argumentItem:CodeBase):void{
        if(this.argumentBlock.indexOf(argumentItem)==-1){
            this.argumentBlock.push(argumentItem);
        }
    }
    /**
     * 构造函数代码块
     */
    public constructCode:CpCodeBlock;
    /**
     * 类名
     */
    public className:string = "CpClass";

    /**
     * 包名
     */
    public moduleName:string = "";

    /**
     * 父类类名
     */
    public superClass:string = "";

    /**
     * 接口列表
     */
    private interfaceBlock:Array<any> = [];

    /**
     * 添加接口
     */
    public addInterface(interfaceName:string):void{
        if(interfaceName==null||interfaceName=="")
            return;
        if(this.interfaceBlock.indexOf(interfaceName)==-1){
            this.interfaceBlock.push(interfaceName);
        }
    }
    /**
     * 引用文件区块
     */
    private referenceBlock:Array<any> = [];
    /**
     * 引用一个文件
     */
    public addReference(referenceItem:string):void{
        if(referenceItem==null||referenceItem=="")
            return;
        if(this.referenceBlock.indexOf(referenceItem)==-1){
            this.referenceBlock.push(referenceItem);
        }
    }

    /**
     * 变量定义区块
     */
    private variableBlock:Array<any> = [];

    /**
     * 添加变量
     */
    public addVariable(variableItem:CodeBase):void{
        if(this.variableBlock.indexOf(variableItem)==-1){
            this.variableBlock.push(variableItem);
        }
    }
    /**
     * 根据变量名获取变量定义
     */
    public getVariableByName(name:string):CpVariable{
        var list:Array<any> = this.variableBlock;
        var length:number = list.length;
        for(var i:number;i<length;i++){
            var item:CpVariable = list[i];
            if(item.name==name){
                return item;
            }
        }
        return null;
    }
    /**
     * 是否包含指定名称的变量
     */
    public containsVar(name:string):boolean{
        var list:Array<any> = this.variableBlock;
        var length:number = list.length;
        for(var i:number=0;i<length;i++){
            var item:CpVariable = list[i];
            if(item.name==name){
                return true;
            }
        }
        return false;
    }

    private sortOn(list:Array<any>,key:string):void{
        var length:number = list.length;
        for(var i:number=0; i<length; i++){
            var min:number = i;
            for(var j:number=i+1;j<length;j++){
                if(list[j][key] < list[min][key])
                    min = j;
            }
            if(min!=i){
                var temp:any = list[min];
                list[min] = list[i];
                list[i] = temp;
            }
        }
    }

    /**
     * 函数定义区块
     */
    private functionBlock:Array<any> = [];

    /**
     * 添加函数
     */
    public addFunction(functionItem:CodeBase):void{
        if(this.functionBlock.indexOf(functionItem)==-1){
            this.functionBlock.push(functionItem);
        }
    }
    /**
     * 是否包含指定名称的函数
     */
    public containsFunc(name:string):boolean{
        var list:Array<any> = this.functionBlock;
        var length:number = list.length;
        for(var i:number=0;i<length;i++){
            var item:CpFunction = list[i];
            if(item.name==name){
                return true;
            }
        }
        return false;
    }
    /**
     * 根据函数名返回函数定义块
     */
    public getFuncByName(name:string):CpFunction{
        var list:Array<any> = this.functionBlock;
        var length:number = list.length;
        for(var i:number=0;i<length;i++){
            var item:CpFunction = list[i];
            if(item.name==name){
                return item;
            }
        }
        return null;
    }

    /**
     * 类注释
     */
    public notation:CpNotation;

    public toCode():string{
        //字符串排序
        this.referenceBlock.sort();
        this.sortOn(this.variableBlock,"name");
        this.sortOn(this.functionBlock,"name");

        var isFirst:boolean = true;
        var index:number = 0;
        var indentStr:string = this.getIndent();

        var returnStr:string = "";
        //打印文件引用区域
        index = 0;
        while(index<this.referenceBlock.length){
            var importItem:string = this.referenceBlock[index];
            returnStr +=  "/// <reference path=\""+importItem+"\"/>\n";
            index ++;
        }
        if(returnStr)
            returnStr += "\n";

        //打印包名
        returnStr += KeyWords.KW_MODULE+" "+this.moduleName+"{\n";

        //打印注释
        if(this.notation!=null){
            this.notation.indent = this.indent;
            returnStr += this.notation.toCode()+"\n";
        }
        returnStr += indentStr+KeyWords.KW_EXPORT+" "+KeyWords.KW_CLASS+" "+this.className;

        //打印父类
        if(this.superClass!=null&&this.superClass!=""){
            returnStr += " "+KeyWords.KW_EXTENDS+" "+this.superClass;
        }

        //打印接口列表
        if(this.interfaceBlock.length>0){
            returnStr += " "+KeyWords.KW_IMPLEMENTS+" ";

            index = 0;
            while(this.interfaceBlock.length>index){
                isFirst = true;
                var interfaceItem:string = this.interfaceBlock[index];
                if(isFirst){
                    returnStr += interfaceItem;
                    isFirst = false;
                }
                else{
                    returnStr += ","+interfaceItem;
                }
                index++;
            }
        }
        returnStr += "{\n";

        //打印变量列表
        index = 0;
        while(this.variableBlock.length>index){
            var variableItem:CodeBase = this.variableBlock[index];
            returnStr += variableItem.toCode()+"\n";
            index++;
        }
        returnStr += "\n";

        //打印构造函数
        returnStr +=this.getIndent(this.indent+1)+Modifiers.M_PUBLIC+" "+KeyWords.KW_FUNCTION+" constructor(";
        isFirst = true;
        index = 0;
        while(this.argumentBlock.length>index){
            var arg:CodeBase = this.argumentBlock[index];
            if(isFirst){
                returnStr += arg.toCode();
                isFirst = false;
            }
            else{
                returnStr += ","+arg.toCode();
            }
            index++;
        }
        returnStr += "){\n";
        var indent2Str:string = this.getIndent(this.indent+2);
        if(this.superClass!=null&&this.superClass!=""){
            returnStr += indent2Str+"super();\n";
        }
        if(this.constructCode!=null){
            var codes:Array<any> = this.constructCode.toCode().split("\n");
            index = 0;
            while(codes.length>index){
                var code:string = codes[index];
                returnStr += indent2Str+code+"\n";
                index++;
            }
        }
        returnStr += this.getIndent(this.indent+1)+"}\n\n";


        //打印函数列表
        index = 0;
        while(this.functionBlock.length>index){
            var functionItem:CodeBase = this.functionBlock[index];
            returnStr += functionItem.toCode()+"\n";
            index++;
        }

        returnStr += indentStr+"}\n}";

        return returnStr;
    }

}



class CpCodeBlock extends CodeBase{
    public constructor(){
        super();
        this.indent = 0;
    }

    /**
     * 添加变量声明语句
     * @param name 变量名
     * @param type 变量类型
     * @param value 变量初始值
     */
    public addVar(name:string,type:string,value:string=""):void{
        var valueStr:string = "";
        if(value!=null&&value!=""){
            valueStr = " = "+value;
        }
        this.addCodeLine(KeyWords.KW_VAR+" "+name+":"+type+valueStr+";");
    }
    /**
     * 添加赋值语句
     * @param target 要赋值的目标
     * @param value 值
     * @param prop 目标的属性(用“.”访问)，不填则是对目标赋值
     */
    public addAssignment(target:string,value:string,prop:string=""):void{
        var propStr:string = "";
        if(prop!=null&&prop!=""){
            propStr = "."+prop;
        }
        this.addCodeLine(target+propStr+" = "+value+";");
    }

    /**
     * 添加返回值语句
     */
    public addReturn(data:string):void{
        this.addCodeLine(KeyWords.KW_RETURN+" "+data+";");
    }
    /**
     * 添加一条空行
     */
    public addEmptyLine():void{
        this.addCodeLine("");
    }
    /**
     * 开始添加if语句块,自动调用startBlock();
     */
    public startIf(expression:string):void{
        this.addCodeLine("if("+expression+")");
        this.startBlock();
    }
    /**
     * 开始else语句块,自动调用startBlock();
     */
    public startElse():void{
        this.addCodeLine("else");
        this.startBlock();
    }

    /**
     * 开始else if语句块,自动调用startBlock();
     */
    public startElseIf(expression:string):void{
        this.addCodeLine("else if("+expression+")");
        this.startBlock();
    }
    /**
     * 添加一个左大括号，开始新的语句块
     */
    public startBlock():void{
        this.addCodeLine("{");
        this.indent++;
    }

    /**
     * 添加一个右大括号,结束当前的语句块
     */
    public endBlock():void{
        this.indent --;
        this.addCodeLine("}");
    }
    /**
     * 添加执行函数语句块
     * @param functionName
     * @param args
     */
    public doFunction(functionName:string,args:Array<any>):void{
        var argsStr:string = "";
        var isFirst:boolean = true;
        while(args.length>0){
            var arg:string = args.shift();
            if(isFirst){
                argsStr += arg;
            }
            else{
                argsStr += ","+arg;
            }
        }
        this.addCodeLine(functionName+"("+argsStr+")");
    }

    private lines:Array<any> = [];

    /**
     * 添加一行代码
     */
    public addCodeLine(code:string):void{
        this.lines.push(this.getIndent()+code);
    }
    /**
     * 添加一行代码到指定行
     */
    public addCodeLineAt(code:string,index:number):void{
        this.lines.splice(index,0,this.getIndent()+code);
    }
    /**
     * 是否存在某行代码内容
     */
    public containsCodeLine(code:string):boolean{
        return this.lines.indexOf(code)!=-1;
    }
    /**
     * 在结尾追加另一个代码块的内容
     */
    public concat(cb:CpCodeBlock):void{
        this.lines = this.lines.concat(cb.lines);
    }

    public toCode():string{
        return this.lines.join("\n");
    }
}



class CpFunction extends CodeBase{
    public constructor(){
        super();
        this.indent = 2
    }

    /**
     * 修饰符 ,默认Modifiers.M_PRIVATE
     */
    public modifierName:string = Modifiers.M_PRIVATE;

    /**
     * 代码块
     */
    public codeBlock:CpCodeBlock;

    /**
     * 是否是静态 ，默认false
     */
    public isStatic:boolean = false;

    /**
     *参数列表
     */
    private argumentBlock:Array<any> = [];
    /**
     * 添加参数
     */
    public addArgument(argumentItem:CodeBase):void{
        if(this.argumentBlock.indexOf(argumentItem)==-1){
            this.argumentBlock.push(argumentItem);
        }
    }

    /**
     * 函数注释
     */
    public notation:CpNotation;
    /**
     * 函数名
     */
    public name:string = "";

    public returnType:string = DataType.DT_VOID;

    public toCode():string{
        var index:number = 0;
        var indentStr:string = this.getIndent();
        var staticStr:string = this.isStatic?Modifiers.M_STATIC+" ":"";
        var noteStr:string = "";
        if(this.notation!=null){
            this.notation.indent = this.indent;
            noteStr = this.notation.toCode()+"\n";
        }

        var returnStr:string = noteStr+indentStr+this.modifierName+" "
            +staticStr+" "+this.name+"(";

        var isFirst:boolean = true;
        index = 0;
        while(this.argumentBlock.length>index){
            var arg:CodeBase = this.argumentBlock[index];
            if(isFirst){
                returnStr += arg.toCode();
                isFirst = false;
            }
            else{
                returnStr += ","+arg.toCode();
            }
            index++;
        }
        returnStr += ")";
        if(this.returnType!="")
            returnStr += ":"+this.returnType;
        returnStr += "{\n";
        if(this.codeBlock!=null){
            var lines:Array<any> = this.codeBlock.toCode().split("\n");
            var codeIndent:string = this.getIndent(this.indent+1);
            index = 0;
            while(lines.length>index){
                var line:string = lines[index];
                returnStr += codeIndent+line+"\n";
                index ++;
            }
        }

        returnStr += indentStr+"}";
        return returnStr;
    }
}



class CpNotation extends CodeBase{
    public constructor(notation:string = ""){
        super();
        this.notation = notation;
    }

    public notation:string = "";

    public toCode():string{
        var lines:Array<any> = this.notation.split("\n");
        var firstIndent:string = this.getIndent();
        var secondIndent:string = firstIndent+" ";
        var returnStr:string = firstIndent+"/**\n";
        var line:string;
        while(lines.length>0){
            line = lines.shift();
            returnStr += secondIndent + "* "+line+"\n";
        }
        returnStr += secondIndent +"*/";
        return returnStr;

    }
}



class CpVariable extends CodeBase{
    public constructor(name:string = "varName",modifierName:string="public",
                       type:string = "any",defaultValue:string="",
                       isStatic:boolean = false){
        super();
        this.indent = 2;
        this.name = name;
        this.modifierName = modifierName;
        this.type = type;
        this.isStatic = isStatic;
        this.defaultValue = defaultValue;
    }

    /**
     * 修饰符
     */
    public modifierName:string = Modifiers.M_PUBLIC;

    /**
     * 是否是静态
     */
    public isStatic:boolean = false;

    /**
     * 常量名
     */
    public name:string = "varName";
    /**
     * 默认值
     */
    public defaultValue:string = "";

    /**
     * 数据类型
     */
    public type:string;

    /**
     * 变量注释
     */
    public notation:CpNotation;

    public toCode():string{
        var noteStr:string = "";
        if(this.notation!=null){
            this.notation.indent = this.indent;
            noteStr = this.notation.toCode()+"\n";
        }

        var staticStr:string = this.isStatic?Modifiers.M_STATIC+" ":"";
        var valueStr:string = "";
        if(this.defaultValue!=""&&this.defaultValue!=null){
            valueStr = " = "+this.defaultValue;
        }
        return noteStr+this.getIndent()+this.modifierName+" "+staticStr+
            this.name+":"+this.type+valueStr+";";
    }
}

class DataType{
    public static DT_VOID:string = "void";

    public static DT_INT:string = "int";

    public static DT_NUMBER:string = "Number";

    public static DT_BOOLEAN:string = "Boolean";

    public static DT_ARRAY:string = "Array";

    public static DT_STRING:string = "String";

    public static DT_OBJECT:string = "Object";

    public static DT_FUNCTION:string = "Function";
}



class KeyWords{
    public static KW_CLASS:string = "class";

    public static KW_FUNCTION:string = "function";

    public static KW_VAR:string = "var";

    public static KW_INTERFACE:string = "interface";

    public static KW_EXTENDS:string = "extends";

    public static KW_IMPLEMENTS:string = "implements";

    public static KW_MODULE:string = "module";

    public static KW_SUPER:string = "super";

    public static KW_THIS:string = "this";

    public static KW_OVERRIDE:string = "override";

    public static KW_RETURN:string = "return";

    public static KW_EXPORT:string = "export";

}

class Modifiers{
    public static M_PUBLIC:string = "public";

    public static M_PRIVATE:string = "private";

    public static M_STATIC:string = "static";

}

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