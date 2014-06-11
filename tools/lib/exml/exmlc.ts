/// <reference path="node.d.ts"/>

var fs = require("fs");
var xml = require("../core/xml.js");
var libs = require("../core/normal_libs")
var param = require("../core/params_analyze.js");
var properties = require("./properties.json")

var compiler:EXMLCompiler;

function compile(exmlPath:string,srcPath:string):void{
    exmlPath = exmlPath.split("\\").join("/");
    srcPath = srcPath.split("\\").join("/");
    if(srcPath.charAt(srcPath.length-1)!="/"){
        srcPath += "/";
    }
    if(!fs.existsSync(srcPath+exmlPath)){
        libs.exit(2001,srcPath+exmlPath);
    }
    var className:string = exmlPath.substring(0,exmlPath.length-5);
    className = className.split("/").join(".");
    var xmlString = fs.readFileSync(srcPath+exmlPath,"utf-8");
    var xmlData = xml.parse(xmlString);
    if(!xmlData){
        libs.exit(2002,srcPath+exmlPath);
    }
    if(!compiler){
        compiler = new EXMLCompiler();
    }
    var tsText = compiler.compile(xmlData,className,"egret.d.ts",srcPath,srcPath+exmlPath);
    var tsPath:string = srcPath+exmlPath.substring(0,exmlPath.length-5)+".ts";
    fs.writeFileSync(tsPath,tsText,"utf-8");
};


exports.compile = compile;


class EXMLCompiler{
    /**
     * Egret命名空间
     */
    public static E:string = "http://ns.egret-labs.org/egret";
    /**
     * Wing命名空间
     */
    public static W:string = "http://ns.egret-labs.org/wing";

    private static DECLARATIONS:string = "Declarations";

    /**
     * 构造函数
     */
    public constructor(){
    }

    /**
     * 配置管理器实例
     */
    private exmlConfig:EXMLConfig;

    /**
     * 获取重复的ID名
     */
    public getRepeatedIds(xml:any):Array<any>{
        var result:Array<any> = [];
        this.getIds(xml,result);
        this.repeatedIdDic = {};
        return result;
    }

    private repeatedIdDic:any = {};

    private getIds(xml:any,result:Array<any>):void{
        if(xml.namespace!=EXMLCompiler.W&&xml["$id"]){
            var id:string = xml.$id;
            if(this.repeatedIdDic[id]){
                result.push(this.toXMLString(xml));
            }
            else{
                this.repeatedIdDic[id] = true;
            }
        }
        var children:Array<any> = xml.children;
        if(children){
            var length:number = children.length;
            for(var i:number=0;i<length;i++){
                var node:any = children[i];
                this.getIds(node,result);
            }
        }
    }

    /**
     * 当前类
     */
    private currentClass:CpClass;
    /**
     * 当前编译的类名
     */
    private currentClassName:string;
    /**
     * 当前要编译的EXML文件
     */
    private currentXML:any;
    /**
     * id缓存字典
     */
    private idDic:any;
    /**
     * 状态代码列表
     */
    private stateCode:Array<CpState>;
    /**
     * 需要单独创建的实例id列表
     */
    private stateIds:Array<any> = [];

    private exmlPath:string = "";

    private toXMLString(node:any):string{
        if(!node){
            return "";
        }
        var str:string = "  at <"+node.name;
        for(var key in node){
            if(key.charAt(0)=="$"){
                var value:string = node[key];
                key = key.substring(1);
                str += " "+key+"=\""+value+"\"";
            }
        }
        if(node.isSelfClosing){
            str += "/>";
        }
        else{
            str += ">";
        }
        return str;
    }

    /**
     * 编译指定的XML对象为TypeScript类。
     * 注意:编译前要先注入egret-manifest.xml清单文件给manifestData属性。
     * @param xmlData 要编译的EXML文件内容
     * @param className 要编译成的完整类名，包括命名空间。
     */
    public compile(xmlData:any,className:string,egretDTSPath:string,srcPath:string,exmlPath:string):string{
        if(!this.exmlConfig){
            this.exmlConfig = new EXMLConfig();
        }
        this.exmlPath = exmlPath;
        this.currentXML = xmlData;
        this.currentClassName = className;
        this.exmlConfig.srcPath = srcPath;
        this.delayAssignmentDic = {};
        this.idDic = {};
        this.stateCode = [];
        this.declarations = null;
        this.currentClass = new CpClass();
        this.stateIds = [];
        var index:number = className.lastIndexOf(".");
        if(index!=-1){
            this.currentClass.moduleName = className.substring(0,index);
            this.currentClass.className = className.substring(index+1);
            this.currentClass.classPath = className.split(".").join("/")+".ts";
        }
        else{
            this.currentClass.className = className;
        }
        this.currentClass.addReference(egretDTSPath);
        this.startCompile();
        var resutlCode:string = this.currentClass.toCode();
        this.currentClass = null;
        return resutlCode;
    }

    private declarations:any;
    /**
     * 开始编译
     */
    private startCompile():void{
        var result:Array<any> = this.getRepeatedIds(this.currentXML);
        if(result.length>0){
            libs.exit(2004,this.exmlPath,result.join("\n"));
        }
        this.currentClass.superClass = this.getPackageByNode(this.currentXML);

        this.getStateNames();

        var children:Array<any> = this.currentXML.children;
        if(children){
            var length:number = children.length;
            for(var i:number=0;i<length;i++){
                var node:any = children[i];
                if(node.namespace==EXMLCompiler.W&&
                    node.localName==EXMLCompiler.DECLARATIONS){
                    this.declarations = node;
                    break;
                }
            }
        }

        var list:Array<string> = [];
        this.checkDeclarations(this.declarations,list);

        if(list.length>0){
            libs.warn(2101,this.exmlPath,list.join("\n"));
        }

        this.addIds(this.currentXML.children);

        this.createConstructFunc();
    }
    /**
     * 清理声明节点里的状态标志
     */
    private checkDeclarations(declarations:any,list:Array<string>):void{
        if(!declarations){
            return;
        }
        var children:Array<any> = declarations.children;
        if(children){
            var length:number = children.length;
            for(var i:number=0;i<length;i++){
                var node:any = children[i];
                if(node["$includeIn"]){
                    list.push(this.toXMLString(node))
                    delete node.$includeIn;
                }
                if(node["$excludeFrom"]){
                    list.push(this.toXMLString(node))
                    delete node.$excludeFrom;
                }
                this.checkDeclarations(node,list);
            }
        }
    }

    /**
     * 添加必须的id
     */
    private addIds(items:Array<any>):void{
        if(!items){
            return;
        }
        var length:number = items.length;
        for(var i:number=0;i<length;i++){
            var node:any = items[i];
            if(node.namespace==EXMLCompiler.W){
            }
            else if(node["$id"]){
                this.createVarForNode(node);
                if(this.isStateNode(node))//检查节点是否只存在于一个状态里，需要单独实例化
                    this.stateIds.push(node.$id);
            }
            else if(!this.isProperty(node)){
                this.createIdForNode(node);
                if(this.isStateNode(node))
                    this.stateIds.push(<string><any> (node.$id));
            }
            this.addIds(node.children);
        }
    }
    /**
     * 检测指定节点的属性是否含有视图状态
     */
    private static containsState(node:any):boolean{
        if(node["$includeIn"]||node["$excludeFrom"]){
            return true;
        }
        for(var name in node){
            if(name.charAt(0)=="$"){
                if(name.indexOf(".")!=-1){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 为指定节点创建id属性
     */
    private createIdForNode(node:any):void{
        var idName:string = this.getNodeId(node);
        if(this.idDic[idName]==null)
            this.idDic[idName] = 1;
        else
            this.idDic[idName] ++;
        idName += this.idDic[idName];
        node.$id = idName;
    }
    /**
     * 获取节点ID
     */
    private getNodeId(node:any):string{
        if(node["$id"])
            return node.$id;
        return "__";
    }

    /**
     * 为指定节点创建变量
     */
    private createVarForNode(node:any):void{
        var className:string = node.localName;
        if(this.isBasicTypeData(className)){
            if(!this.currentClass.containsVar(node.$id))
                this.currentClass.addVariable(new CpVariable(node.$id,Modifiers.M_PUBLIC,className));
            return;
        }
        var moduleName:string = this.getPackageByNode(node);
        if(moduleName=="")
            return;
        if(!this.currentClass.containsVar(node.$id))
            this.currentClass.addVariable(new CpVariable(node.$id,Modifiers.M_PUBLIC,moduleName));
    }
    /**
     * 为指定节点创建初始化函数,返回函数名引用
     */
    private createFuncForNode(node:any):string{
        var className:string = node.localName;
        if(this.isProperty(node))
            return "";
        var isBasicType:boolean = this.isBasicTypeData(className);
        if(isBasicType)
            return this.createBasicTypeForNode(node);
        var moduleName:string = this.getPackageByNode(node);
        var func:CpFunction = new CpFunction;
        var tailName:string = "_i";
        var id:string = node.$id;
        func.name = id+tailName;
        func.returnType = moduleName;
        var cb:CpCodeBlock = new CpCodeBlock;
        var varName:string = "t";
        if(className=="Object"){
            cb.addVar(varName,"any","{}");
        }
        else{
            cb.addVar(varName,moduleName,"new "+moduleName+"()");
        }

        var containsId:boolean = this.currentClass.containsVar(node.$id);
        if(containsId){
            cb.addAssignment("this."+node.$id,varName);
        }

        this.addAttributesToCodeBlock(cb,varName,node);

        var children:Array<any> = node.children;
        var obj:any = this.exmlConfig.getDefaultPropById(node.localName,node.namespace);
        var property:string = obj.name;
        var isArray:boolean = obj.isArray;

        this.initlizeChildNode(cb,children,property,isArray,varName);
        if(this.delayAssignmentDic[id]){
            cb.concat(this.delayAssignmentDic[id]);
        }
        cb.addReturn(varName);
        func.codeBlock = cb;
        this.currentClass.addFunction(func);
        return "this."+func.name+"()";
    }

    private basicTypes:Array<string> = ["Array","boolean","string","number"];
    /**
     * 检查目标类名是否是基本数据类型
     */
    private isBasicTypeData(className:string):boolean{
        return this.basicTypes.indexOf(className)!=-1;
    }
    /**
     * 为指定基本数据类型节点实例化,返回实例化后的值。
     */
    private createBasicTypeForNode(node:any):string{
        var className:string = node.localName;
        var returnValue:string = "";
        var child:any;
        var varItem:CpVariable = this.currentClass.getVariableByName(node.$id);
        switch(className){
            case "Array":
                var values:Array<any> = [];
                var children:Array<any> = node.children;
                if(children){
                    var length:number = children.length;
                    for(var i:number=0;i<length;i++){
                        var child:any = children[i];
                        values.push(this.createFuncForNode(child));
                    }
                }
                returnValue = "["+values.join(",")+"]";
                break;
            case "boolean":
                returnValue = node.text.trim();
                returnValue = (returnValue=="false"||!returnValue)?"false":"true";
                break;
            case "number":
                returnValue = node.text.trim();
                if(returnValue.indexOf("%")!=-1)
                    returnValue = returnValue.substring(0,returnValue.length-1);
                break;
            case "string":
                returnValue = this.formatString(node.toString());
                break;
        }
        if(varItem)
            varItem.defaultValue = returnValue;
        return returnValue;
    }
    /**
     * 延迟赋值字典
     */
    private delayAssignmentDic:any = {};
    /**
     * 将节点属性赋值语句添加到代码块
     */
    private addAttributesToCodeBlock(cb:CpCodeBlock,varName:string,node:any):void{
        var keyList:Array<any> = [];
        var key:string;
        var value:string;
        for(key in node){
            if(key.charAt(0)!="$"||!this.isNormalKey(key)){
                continue;
            }
            keyList.push(key);
        }
        keyList.sort();//排序一下防止出现随机顺序
        var length:number = keyList.length;
        for(var i:number=0;i<length;i++){
            key = keyList[i];
            value = node[key];
            key = this.formatKey(key.substring(1),value);
            value  = this.formatValue(key,value,node);
            if(this.currentClass.containsVar(value)){//赋的值对象是一个id
                var id:string = node.$id;
                var codeLine:string = "this."+id+" = t;";
                if(!this.currentClass.containsVar(id))
                    this.createVarForNode(node);
                if(!cb.containsCodeLine(codeLine)){
                    cb.addCodeLineAt(codeLine,1);
                }
                var delayCb:CpCodeBlock = new CpCodeBlock();
                if(varName==KeyWords.KW_THIS){
                    delayCb.addAssignment(varName,"this."+value,key);
                }
                else{

                    delayCb.startIf("this."+id);
                    delayCb.addAssignment("this."+id,"this."+value,key);
                    delayCb.endBlock();
                }
                this.delayAssignmentDic[value] = delayCb;
                value = "this."+value;
            }
            cb.addAssignment(varName,value,key);
        }
    }
    /**
     * 初始化子项
     */
    private initlizeChildNode(cb:CpCodeBlock,children:Array<any>,
                              property:string,isArray:boolean,varName:string):void{
        if(!children||children.length==0)
            return;
        var child:any;
        var childFunc:string = "";
        var directChild:Array<any> = [];
        var prop:string = "";
        var length:number = children.length;
        for(var i:number=0;i<length;i++){
            child = children[i];
            prop = child.localName;
            if(prop==EXMLCompiler.DECLARATIONS||prop=="states"||child.namespace==EXMLCompiler.W){
                continue;
            }
            if(this.isProperty(child)){
                if(!child.children)
                    continue;
                var childLength:number = child.children.length;
                if(childLength==0)
                    continue;
                var isContainerProp:boolean = (prop==property&&isArray);
                if(childLength>1){
                    var values:Array<any> = [];
                    for(var j:number = 0;j<childLength;j++){
                        var item:any = child.children[j];
                        childFunc = this.createFuncForNode(item);
                        if(!isContainerProp||!this.isStateNode(item))
                            values.push(childFunc);
                    }
                    childFunc = "["+values.join(",")+"]";
                }
                else{
                    var firstChild:any = child.children[0];
                    if(isContainerProp){
                        if(firstChild.localName=="Array"){
                            values = [];
                            if(firstChild.children){
                                var len:number = firstChild.children.length;
                                for(var k:number=0;k<len;k++){
                                    item = firstChild.children[k];
                                    childFunc = this.createFuncForNode(item);
                                    if(!isContainerProp||!this.isStateNode(item))
                                        values.push(childFunc);
                                }
                            }
                            childFunc = "["+values.join(",")+"]";
                        }
                        else{
                            childFunc = this.createFuncForNode(firstChild);
                            if(!this.isStateNode(item))
                                childFunc = "["+childFunc+"]";
                            else
                                childFunc = "[]";
                        }
                    }
                    else{
                        childFunc = this.createFuncForNode(firstChild);
                    }
                }
                if(childFunc!=""){
                    if(childFunc.indexOf("()")==-1)
                        prop = this.formatKey(prop,childFunc);
                    cb.addAssignment(varName,childFunc,prop);
                }
            }
            else{
                directChild.push(child);
            }

        }
        if(directChild.length==0)
            return;
        if(isArray&&(directChild.length>1||directChild[0].localName!="Array")){
            var childs:Array<any> = [];
            length = directChild.length;
            for(i=0;i<length;i++){
                child = directChild[i];
                childFunc = this.createFuncForNode(child);
                if(childFunc==""||this.isStateNode(child))
                    continue;
                childs.push(childFunc);
            }
            cb.addAssignment(varName,"["+childs.join(",")+"]",property);
        }
        else{
            childFunc = this.createFuncForNode(directChild[0]);
            if(childFunc!=""&&!this.isStateNode(child))
                cb.addAssignment(varName,childFunc,property);
        }
    }

    /**
     * 指定节点是否是属性节点
     */
    private isProperty(node:any):boolean{
        var name:string = node.localName;
        if(name==null)
            return true;
        if(this.isBasicTypeData(name))
            return false;
        var firstChar:string = name.charAt(0);
        return firstChar<"A"||firstChar>"Z";
    }
    /**
     * 命名空间为fs的属性名列表
     */
    public static wingKeys:Array<string> = ["$id","$locked","$includeIn","$excludeFrom"];
    /**
     * 是否是普通赋值的key
     */
    private isNormalKey(key:string):boolean{
        if(!key||key.indexOf(".")!=-1||EXMLCompiler.wingKeys.indexOf(key)!=-1)
            return false;
        return true;
    }
    /**
     * 格式化key
     */
    private formatKey(key:string,value:string):string{
        if(value.indexOf("%")!=-1){
            if(key=="height")
                key = "percentHeight";
            else if(key=="width")
                key = "percentWidth";
        }
        return key;
    }
    /**
     * 格式化值
     */
    private formatValue(key:string,value:string,node:any):string{
        if(!value){
            return "";
        }
        var stringValue:string = value;//除了字符串，其他类型都去除两端多余空格。
        value = value.trim();
        if(value.indexOf("{")!=-1){
            value = value.substr(1,value.length-2);
            value = value.trim();
            if(value.indexOf("this.")==0){
                if(CodeUtil.isVariableWord(value.substring(5))){
                    value = value.substring(5);
                }
            }
        }
        else{
            var className:string = this.exmlConfig.getClassNameById(node.localName,node.namespace);
            var type:string = this.exmlConfig.getPropertyType(key,className,value);
            switch(type){
                case "number":
                    if(value.indexOf("#")==0)
                        value = "0x"+value.substring(1);
                    else if(value.indexOf("%")!=-1)
                        value = (parseFloat(value.substr(0,value.length-1))).toString();
                    break;
                case "string":
                    value = this.formatString(stringValue);
                    break;
                case "boolean":
                    value = (value=="false"||!value)?"false":"true";
                    break;
                default:
                    break;
            }
        }
        return value;
    }

    /**
     * 格式化字符串
     */
    private formatString(value:string):string{
        value = this.unescapeHTMLEntity(value);
        value = value.split("\n").join("\\n");
        value = value.split("\r").join("\\n");
        value = value.split("\"").join("\\\"");
        value = "\""+value+"\"";
        return value;
    }

    private htmlEntities:Array<any> = [["<","&lt;"],[">","&gt;"],["&","&amp;"],["\"","&quot;"],["'","&apos;"]];
    /**
     /**
     * 转换HTML实体字符为普通字符
     */
    private unescapeHTMLEntity(str:string):string{
        if(!str)
            return "";
        var list:Array<any> = this.htmlEntities;
        var length:number = list.length;
        for(var i:number=0;i<length;i++){
            var arr:Array<any> = list[i];
            var key:string = arr[0];
            var value:string = arr[1];
            str = str.split(value).join(key);
        }
        return str;
    }

    /**
     * 创建构造函数
     */
    private createConstructFunc():void{
        var cb:CpCodeBlock = new CpCodeBlock;
        cb.addEmptyLine();
        var varName:string = KeyWords.KW_THIS;
        this.addAttributesToCodeBlock(cb,varName,this.currentXML);

        if(this.declarations){
            var children:Array<any> = this.declarations.children;
            if(children&&children.length>0){
                var length:number = children.length;
                for(var i:number=0;i<length;i++){
                    var decl:any = children[i];
                    var funcName:string = this.createFuncForNode(decl);
                    if(funcName!=""){
                        cb.addCodeLine(funcName+";");
                    }
                }
            }
        }

        var obj:any =  this.exmlConfig.getDefaultPropById(this.currentXML.localName,this.currentXML.namespace);
        var property:string = obj.name;
        var isArray:boolean = obj.isArray;
        this.initlizeChildNode(cb,this.currentXML.children,property,isArray,varName);
        var id:string;
        if(this.stateIds.length>0){
            length = this.stateIds.length;
            for(var i:number=0;i<length;i++){
                id = this.stateIds[i];
                cb.addCodeLine("this."+id+"_i();");
            }
            cb.addEmptyLine();
        }
        cb.addEmptyLine();

        //生成视图状态代码
        this.createStates(this.currentXML.children);
        var states:Array<CpState>;
        var node:any = this.currentXML;
        for(var itemName in node){
            var value:string = node[itemName];
            itemName = itemName.substring(1);
            var index:number = itemName.indexOf(".");
            if(index!=-1){
                var key:string = itemName.substring(0,index);
                key = this.formatKey(key,value);
                var itemValue:string = this.formatValue(key,value,node);
                var stateName:string = itemName.substr(index+1);
                states = this.getStateByName(stateName);
                var stateLength:number = states.length;
                if(stateLength>0){
                    for(var i:number=0;i<stateLength;i++){
                        var state:CpState = states[i];
                        state.addOverride(new CpSetProperty("",key,itemValue));
                    }
                }
            }
        }

        //打印视图状态初始化代码
        if(this.stateCode.length>0){
            cb.addCodeLine("this.states = [");
            var first:boolean = true;
            var indentStr:string = "	";
            var length:number = this.stateCode.length;
            for(var i:number=0;i<length;i++){
                state = this.stateCode[i];
                if(first)
                    first = false;
                else
                    cb.addCodeLine(indentStr+",");
                var codes:Array<any> = state.toCode().split("\n");
                var codeIndex:number = 0;
                while(codeIndex<codes.length){
                    var code:string = codes[codeIndex];
                    if(code)
                        cb.addCodeLine(indentStr+code);
                    codeIndex++;
                }
            }
            cb.addCodeLine("];");
        }


        this.currentClass.constructCode = cb;
    }

    /**
     * 是否含有includeIn和excludeFrom属性
     */
    private isStateNode(node:any):boolean{
        return node.hasOwnProperty("$includeIn")||node.hasOwnProperty("$excludeFrom");
    }

    /**
     * 获取视图状态名称列表
     */
    private getStateNames():void{
        var states:Array<any>;
        var children = this.currentXML.children;
        if(children){
            var length:number = children.length;
            for(var i:number=0;i<length;i++){
                var item:any = children[i];
                if(item.localName=="states"){
                    states = item.children;
                    break;
                }
            }
        }

        if(states==null||states.length==0)
            return;
        length = states.length;
        for(i=0;i<length;i++){
            var state:any = states[i];
            var stateGroups:Array<any> = [];
            if(state["$stateGroups"]){
                var groups:Array<any> = state.$stateGroups.split(",");
                var len:number = groups.length;
                for(var j:number=0;j<len;j++){
                    var group:string = groups[i].trim();
                    if(group){
                        stateGroups.push(group);
                    }
                }
            }
            this.stateCode.push(new CpState(state.$name,stateGroups));
        }
    }

    /**
     * 解析视图状态代码
     */
    private createStates(items:Array<any>):void{
        if(!items){
            return;
        }
        var length:number = items.length;
        for(var i:number=0;i<length;i++){
            var node:any = items[i];
            this.createStates(node.children);
            if(this.isProperty(node))
                continue;
            if(EXMLCompiler.containsState(node)){
                var id:string = node.$id;
                this.checkIdForState(node);
                var stateName:string;
                var states:Array<CpState>;
                var state:CpState;
                if(this.isStateNode(node)){
                    var propertyName:string = "";
                    var parentNode:any = (node.parent);
                    if(parentNode.localName=="Array")
                        parentNode = parentNode.parent;
                    if(this.isProperty(parentNode))
                        parentNode = parentNode.parent;
                    if(parentNode&&parentNode != this.currentXML){
                        propertyName = parentNode.$id;
                        this.checkIdForState(parentNode);
                    }
                    var positionObj:any = this.findNearNodeId(node);
                    var stateNames:Array<any> = [];
                    if(node.hasOwnProperty("$includeIn")){
                        stateNames = node.$includeIn.toString().split(",");
                    }
                    else{
                        var excludeNames:Array<any> = node.$excludeFrom.toString().split(",");
                        var stateLength:number = this.stateCode.length;
                        for(var j:number=0;j<stateLength;j++){
                            state = this.stateCode[j];
                            if(excludeNames.indexOf(state.name)==-1)
                                stateNames.push(state.name);
                        }
                    }

                    var len:number = stateNames.length;
                    for(var k:number=0;k<len;k++){
                        stateName = stateNames[k];
                        states = this.getStateByName(stateName);
                        if(states.length>0){
                            var l:number = states.length;
                            for(var j:number=0;j<l;j++){
                                state = states[j];
                                state.addOverride(new CpAddItems(id,propertyName,
                                    positionObj.position,positionObj.relativeTo));
                            }
                        }
                    }
                }

                for(var name in node){
                    var value:string = node[name];
                    name = name.substring(1);
                    var index:number = name.indexOf(".");
                    if(index!=-1){
                        var key:string = name.substring(0,index);
                        key = this.formatKey(key,value);
                        var value:string = this.formatValue(key,value,node);
                        stateName = name.substr(index+1);
                        states = this.getStateByName(stateName);
                        var l:number = states.length;
                        if(l>0){
                            for(var j:number=0;j<l;j++) {
                                state = states[j];
                                state.addOverride(new CpSetProperty(id, key, value));
                            }
                        }
                    }
                }
            }
        }

    }
    /**
     * 检查指定的ID是否创建了类成员变量，若没创建则为其创建。
     */
    private checkIdForState(node:any):void{
        if(!node||this.currentClass.containsVar(node.$id)){
            return;
        }
        this.createVarForNode(node);
        var id:string = node.$id;
        var funcName:string = id+"_i";
        var func:CpFunction = this.currentClass.getFuncByName(funcName);
        if(!func)
            return;
        var codeLine:string = "this."+id+" = t;";
        var cb:CpCodeBlock = func.codeBlock;
        if(!cb)
            return;
        if(!cb.containsCodeLine(codeLine)){
            cb.addCodeLineAt(codeLine,1);
        }
    }
    /**
     * 通过视图状态名称获取对应的视图状态
     */
    private getStateByName(name:string):Array<CpState>{
        var states:Array<CpState> = [];
        var length:number = this.stateCode.length;
        for(var i:number=0;i<length;i++){
            var state:CpState = this.stateCode[i];
            if(state.name == name){
                if(states.indexOf(state)==-1)
                    states.push(state);
            }
            else if(state.stateGroups.length>0){
                var found:boolean = false;
                var len:number = state.stateGroups.length;
                for(var j:number=0;j<len;j++){
                    var g:string = state.stateGroups[j];
                    if(g==name){
                        found = true;
                        break;
                    }
                }
                if(found){
                    if(states.indexOf(state)==-1)
                        states.push(state);
                }
            }
        }
        return states;
    }
    /**
     * 寻找节点的临近节点ID和位置
     */
    private findNearNodeId(node:any):any{
        var parentNode:any = node.parent;
        var targetId:string = "";
        var postion:string;
        var index:number = -1;
        var totalCount:number = 0;
        var preItem:any;
        var afterItem:any;
        var found:boolean = false;
        var children:Array<any> = parentNode.children;
        var length:number = children.length;
        for(var i:number=0;i<length;i++){
            var item:any = children[i];
            if(this.isProperty(item))
                continue;
            if(item==node){
                found = true;
                index = i;
            }
            else{
                if(found&&!afterItem&&!this.isStateNode(item)){
                    afterItem = item;
                }
            }
            if(!found&&!this.isStateNode(item))
                preItem = item;
        }
        if(index==0){
            postion = "first";
            return {position:postion,relativeTo:targetId};
        }
        if(index==length-1){
            postion = "last";
            return {position:postion,relativeTo:targetId};
        }
        if(afterItem){
            postion = "before";
            targetId = afterItem.$id;
            if(targetId){
                this.checkIdForState(afterItem);
                return {position:postion,relativeTo:targetId};
            }

        }
        return {position:"last",relativeTo:targetId};
    }


    /**
     * 根据类名获取对应的包，并自动导入相应的包
     */
    private getPackageByNode(node:any):string{
        var moduleName:string =
            this.exmlConfig.getClassNameById(node.localName,node.namespace);
        if(moduleName&&node.namespace!=EXMLCompiler.E){

            var path:string = this.exmlConfig.getPathById(node.localName,node.namespace);
            this.currentClass.addReference(path);
        }
        if(!moduleName){
            libs.exit(2003,this.exmlPath,this.toXMLString(node));
        }
        return moduleName;
    }

    /**
     * 检查变量是否是包名
     */
    private isPackageName(name:string):boolean{
        return name.indexOf(".")!=-1;
    }

}

class EXMLConfig{
    /**
     * 构造函数
     */
    public constructor(){
        var exmlPath:string = param.getEgretPath()+"/tools/lib/exml/";
        exmlPath = exmlPath.split("\\").join("/");
        var str:string = fs.readFileSync(exmlPath+"egret-manifest.xml","utf-8");
        var manifest:any = xml.parse(str);
        this.parseManifest(manifest);
    }

    public srcPath:string;

    /**
     * 组件清单列表
     */
    public componentDic:any = {};
    /**
     * 解析框架清单文件
     */
    public parseManifest(manifest:any):void{

        var children:Array<any> = manifest.children;
        var length:number = children.length;
        for(var i:number=0;i<length;i++){
            var item:any = children[i];
            var component:Component = new Component(item);
            this.componentDic[component.className] = component;
        }
        for(var className in this.componentDic){
            var component:Component = this.componentDic[className];
            if(!component.defaultProp)
                this.findProp(component);
        }
    }
    /**
     * 递归查找默认属性
     */
    private findProp(component:Component):string{
        if(component.defaultProp)
            return component.defaultProp;
        var superComp:Component = this.componentDic[component.superClass];
        if(superComp){
            var prop:string = this.findProp(superComp);
            if(prop){
                component.defaultProp = prop;
                component.isArray = superComp.isArray;
            }
        }
        return component.defaultProp;
    }

    /**
     * @inheritDoc
     */
    public addComponent(className:string,superClass:string):Component{
        if(!className)
            return null;
        if(superClass==null)
            superClass = "";
        className = className.split("::").join(".");
        superClass = superClass.split("::").join(".");
        var id:string = className;
        var index:number = className.lastIndexOf(".");
        if(index!=-1){
            id = className.substring(index+1);
        }
        var component:Component = new Component();
        component.id = id;
        component.className = className;
        component.superClass = superClass;
        this.componentDic[className] = component;
        return component;
    }

    /**
     * @inheritDoc
     */
    public removeComponent(className:string):Component{
        var component:Component = this.componentDic[className]
        delete this.componentDic[className];
        return component;
    }

    /**
     * @inheritDoc
     */
    public hasComponent(className:string):boolean{
        return this.componentDic[className];
    }

    private pathToClassName:any = {};
    private classNameToPath:any = {};
    /**
     * @inheritDoc
     */
    public getClassNameById(id:string, ns:string):string{
        var name:string = "";
        if(id=="Object"){
            return id;
        }
        if(ns==EXMLCompiler.W){

        }
        else if(!ns||ns==EXMLCompiler.E){
            name = "egret."+id;
            if(!this.componentDic[name]){
                name = "";
            }
        }
        else{
            var path:string = this.getPathById(id,ns);
            name = this.pathToClassName[path];
            if(!name){
                name = this.readClassNameFromPath(this.srcPath+path,id);
                this.pathToClassName[path] = name;
                this.classNameToPath[name] = path;
            }
        }
        return name;
    }

    private readClassNameFromPath(path:string,id:string):string{
        var tsText:string = fs.readFileSync(path,"utf-8");
        tsText = CodeUtil.removeComment(tsText);
        var className:string = "";
        var superClass:string;
        while(tsText.length){
            var index:number = CodeUtil.getFirstVariableIndex("class",tsText);
            if(index==-1){
                break;
            }
            var preStr:string = tsText.substring(0,index);
            tsText = tsText.substring(index+5);
            if(CodeUtil.getFirstVariable(tsText)==id){
                index = CodeUtil.getLastVariableIndex("module",preStr);
                if(index==-1){
                    className = id;
                    break;
                }
                preStr = preStr.substring(index+6);
                index = preStr.indexOf("{");
                if(index==-1){
                    break;
                }
                var ns:string = preStr.substring(0,index);
                className = ns.trim()+"."+id;
                tsText = CodeUtil.removeFirstVariable(tsText);
                var word:string = CodeUtil.getFirstVariable(tsText);
                if(word=="extends"){
                    tsText = CodeUtil.removeFirstVariable(tsText);
                    superClass = CodeUtil.getFirstWord(tsText).trim();
                    if(superClass.charAt(superClass.length-1)=="{"){
                        superClass = superClass.substring(0,superClass.length-1);
                    }
                }
            }
        }
        if(className){
            var comps:Component = new Component();
            comps.id = id;
            comps.className = className;
            if(superClass){
                comps.superClass = superClass;
            }
            this.componentDic[className] = comps;
        }
        return className;
    }

    /**
     * 根据id获取文件路径
     */
    public getPathById(id:string,ns:string):string{
        var className:string = "";
        if(!ns||ns==EXMLCompiler.W||ns==EXMLCompiler.E){
            return className;
        }
        className = ns.substring(0,ns.length-1)+id;
        var path:string = className.split(".").join("/");
        path += ".ts";
        return path;
    }

    private propData:any = {};
    /**
     * @inheritDoc
     */
    public getDefaultPropById(id:string, ns:string):any{

        var data:any = this.propData;
        data.name = "";
        data.isArray = false;
        var className:string = this.getClassNameById(id,ns);
        var component:Component = this.componentDic[className];
        while(component){
            if(component.defaultProp)
                break;
            className = component.superClass;
            component = this.componentDic[className];
        }
        if(!component)
            return data;
        data.name = component.defaultProp;
        data.isArray = component.isArray;
        return data;
    }

    /**
     * @inheritDoc
     */
    public getPropertyType(prop:string,className:string,value:string):string{
        var type:string = this.findType(className,prop);
        return type;
    }

    private findType(className:string,prop:string):string{
        var classData:any = properties[className];
        if(!classData){
            var path:string = this.srcPath+this.classNameToPath[className];
            if(!fs.existsSync(path)){
                return "string";
            }
            var text:string = fs.readFileSync(path,"utf-8");
            classData = this.getProperties(text,className);
            if(classData){
                properties[className] = classData;
            }
            else{
                return "string";
            }
        }
        var type:string = classData[prop];
        if(!type){
            type = this.findType(classData["super"],prop);
        }
        return type;
    }

    /**
     * 获取属性列表
     */
    private getProperties(text:string,className:string):any {
        index = className.lastIndexOf(".");
        var moduleName:string = "";
        if (index != -1) {
            moduleName = className.substring(0, index);
            className = className.substring(index+1);
        }
        var data:any;
        text = CodeUtil.removeComment(text);
        if(moduleName){
            while(text.length>0){
                var index:number = CodeUtil.getFirstVariableIndex("module",text);
                if(index==-1){
                    break;
                }
                text = text.substring(index+6);
                index = text.indexOf("{");
                if(index==-1){
                    continue;
                }
                var ns:string = text.substring(0,index).trim();
                if(ns==moduleName){
                    index = CodeUtil.getBracketEndIndex(text);
                    if(index!=-1){
                        var block:string = text.substring(0,index);
                        index = block.indexOf("{");
                        block = block.substring(index+1);
                        data = this.getPropFromBlock(block,className);
                    }
                    break;
                }
            }
        }
        else{
            data = this.getPropFromBlock(text,className);
        }

        return data;
    }

    private getPropFromBlock(block:string,targetClassName:string):any{
        var data:any;
        while(block.length>0){
            var index:number = CodeUtil.getFirstVariableIndex("class",block);
            if(index==-1){
                break;
            }
            block = block.substring(index+5);
            var className:string = CodeUtil.getFirstVariable(block);
            if(className!=targetClassName){
                continue;
            }
            data = {};
            block = CodeUtil.removeFirstVariable(block,className);
            var word:string = CodeUtil.getFirstVariable(block);
            if(word=="extends"){
                block = CodeUtil.removeFirstVariable(block);
                word = CodeUtil.getFirstWord(block);
                if(word.charAt(word.length-1)=="{")
                    word = word.substring(0,word.length-1).trim();
                if(word){
                    data["super"] = word;
                }
            }
            index = CodeUtil.getBracketEndIndex(block);
            if(index==-1)
                break;
            var text:string = block.substring(0,index);
            index = text.indexOf("{");
            text = text.substring(index+1);
            this.readProps(text,data);
            break;
        }
        return data;
    }

    private basicTypes:Array<any> = ["boolean","number","string"];

    private readProps(text:string,data:any):void{
        var lines:Array<any> = text.split("\n");
        var length:number = lines.length;
        for(var i:number=0;i<length;i++){
            var line:string = lines[i];
            var index:number = line.indexOf("public ");
            if(index==-1)
                continue;
            line = line.substring(index+7);
            var word:string = CodeUtil.getFirstVariable(line);
            if(!word||word.charAt(0)=="_")
                continue;
            if(word=="get"){
                continue;
            }
            else if(word=="set"){
                line = CodeUtil.removeFirstVariable(line);
                word = CodeUtil.getFirstVariable(line);
                if(!word||word.charAt(0)=="_"){
                    continue;
                }
                line = CodeUtil.removeFirstVariable(line);
                line = line.trim();
                if(line.charAt(0)=="("){
                    index = line.indexOf(":");
                    if(index!=-1){
                        line = line.substring(index+1);
                        type = CodeUtil.getFirstVariable(line);
                        if(this.basicTypes.indexOf(type)!=-1)
                            data[word] = type;
                    }
                }
            }
            else{
                line = CodeUtil.removeFirstVariable(line);
                line = line.trim();
                if(line.charAt(0)==":"){
                    var type:string = CodeUtil.getFirstVariable(line.substring(1));
                    if(this.basicTypes.indexOf(type)!=-1)
                        data[word] = type;
                }

            }
        }
    }

}

class Component{
    /**
     * 构造函数
     */
    public constructor(item?:any){
        if(item){
            this.id = item.$id;
            this.className = "egret."+this.id;
            if(item["$super"])
                this.superClass = item.$super;
            if(item["$default"])
                this.defaultProp = item.$default;
            if(item["$array"])
                this.isArray = <boolean><any> (item.$array=="true");
        }
    }
    /**
     * 短名ID
     */
    public id:string;
    /**
     * 完整类名
     */
    public className:string;
    /**
     * 父级类名
     */
    public superClass:string = "";
    /**
     * 默认属性
     */
    public defaultProp:string = "";
    /**
     * 默认属性是否为数组类型
     */
    public isArray:boolean = false;
}


//=================代码生成工具类===================
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
            indent = this.indent;
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
     * 类所在的路径，用于计算reference的相对路径
     */
    public classPath:string = "";

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

    private getRelativePath(path:string):string{
        var curs:Array<any> = this.classPath.split("/");
        var targets:Array<any> = path.split("/");
        var length:number = Math.min(curs.length,targets.length-1);
        var index:number = 0;
        for(var i:number=0;i<length;i++)
        {
            var cur:String = curs[i];
            var tar:String = targets[i];
            if(cur!=tar)
            {
                break;
            }
            index ++;
        }
        var paths:Array<any> = [];
        length = curs.length;
        for(i=index;i<length-1;i++)
        {
            paths.push("..");
        }
        length = targets.length;
        for(i=index;i<length;i++)
        {
            paths.push(targets[i]);
        }
        return paths.join("/");
    }

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
            var path:string = this.getRelativePath(importItem);
            returnStr +=  "/// <reference path=\""+path+"\"/>\n";
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
        returnStr +=this.getIndent(this.indent+1)+Modifiers.M_PUBLIC+" constructor(";
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


//=================常量定义===================
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

class CpState extends CodeBase{

    public constructor(name:string,stateGroups:Array<any>=null){
        super();
        this.name = name;
        if(stateGroups)
            this.stateGroups = stateGroups;
    }
    /**
     * 视图状态名称
     */
    public name:string = "";

    public stateGroups:Array<any> = [];

    public addItems:Array<any> = [];

    public setProperty:Array<any> = [];

    /**
     * 添加一个覆盖
     */
    public addOverride(item:CodeBase):void{
        if(item instanceof CpAddItems)
            this.addItems.push(item);
        else
            this.setProperty.push(item);
    }

    public toCode():string{
        var indentStr:string = this.getIndent(1);
        var returnStr:string = "new egret.State (\""+this.name+"\",\n"+indentStr+"[\n";
        var index:number = 0;
        var isFirst:boolean = true;
        var overrides:Array<any> = this.addItems.concat(this.setProperty);
        while(index<overrides.length){
            if(isFirst)
                isFirst = false;
            else
                returnStr += ",\n";
            var item:CodeBase = overrides[index];
            var codes:Array<any> = item.toCode().split("\n");
            var length:number = codes.length;
            for(var i:number=0;i<length;i++){
                var code:string = codes[i];
                codes[i] = indentStr+indentStr+code;
            }
            returnStr += codes.join("\n");
            index++;
        }
        returnStr += "\n"+indentStr+"])";
        return returnStr;
    }
}

class CpAddItems extends CodeBase{
    public constructor(target:string,propertyName:string,position:string,relativeTo:string){
        super();
        this.target = target;
        this.propertyName = propertyName;
        this.position = position;
        this.relativeTo = relativeTo;
    }

    /**
     * 创建项目的工厂类实例
     */
    public target:string;

    /**
     * 要添加到的属性
     */
    public propertyName:string;

    /**
     * 添加的位置
     */
    public position:string;

    /**
     * 相对的显示元素
     */
    public relativeTo:string;

    public toCode():string{
        var indentStr:string = this.getIndent(1);
        var returnStr:string = "new egret.AddItems(\""+this.target+"\",\""+this.propertyName+"\",\""+this.position+"\",\""+this.relativeTo+"\")";
        return returnStr;
    }
}

class CpSetProperty extends CodeBase{
    public constructor(target:string,name:string,value:string){
        super();
        this.target = target;
        this.name = name;
        this.value = value;
    }

    /**
     * 要修改的属性名
     */
    public name:string;

    /**
     * 目标实例名
     */
    public target:string;

    /**
     * 属性值
     */
    public value:string;

    public toCode():string{
        var indentStr:string = this.getIndent(1);
        return "new egret.SetProperty(\""+this.target+"\",\""+this.name+"\","+this.value+")";
    }
}

class DataType{
    public static DT_VOID:string = "void";

    public static DT_NUMBER:string = "number";

    public static DT_BOOLEAN:string = "boolean";

    public static DT_ARRAY:string = "Array";

    public static DT_STRING:string = "string";

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


class CodeUtil{

    /**
     * 判断一个字符串是否为合法变量名,第一个字符为字母,下划线或$开头，第二个字符开始为字母,下划线，数字或$
     */
    public static isVariableWord(word:string):boolean{
        if(!word)
            return false;
        var char:string = word.charAt(0);
        if(!CodeUtil.isVariableFirstChar(char)){
            return false;
        }
        var length:number = word.length;
        for(var i:number=1;i<length;i++){
            char = word.charAt(i);
            if(!CodeUtil.isVariableChar(char)){
                return false;
            }
        }
        return true;
    }
    /**
     * 是否为合法变量字符,字符为字母,下划线，数字或$
     */
    public static isVariableChar(char:string):boolean{
        return (char<="Z"&&char>="A"||char<="z"&&char>="a"||
            char<="9"&&char>="0"||char=="_"||char=="$")
    }
    /**
     * 是否为合法变量字符串的第一个字符,字符为字母,下划线或$
     */
    public static isVariableFirstChar(char:string):boolean{
        return (char<="Z"&&char>="A"||char<="z"&&char>="a"||
            char=="_"||char=="$")
    }

    /**
     * 判断一段代码中是否含有某个变量字符串，且该字符串的前后都不是变量字符。
     */
    public static containsVariable(key:string,codeText:string):boolean{
        var contains:boolean = false;
        while(codeText.length>0){
            var index:number = codeText.indexOf(key);
            if(index==-1)
                break;
            var lastChar:string = codeText.charAt(index+key.length);
            var firstChar:string = codeText.charAt(index-1);
            if(!CodeUtil.isVariableChar(firstChar)&&!CodeUtil.isVariableChar(lastChar)){
                contains = true;
                break;
            }
            else{
                codeText = codeText.substring(index+key.length);
            }
        }
        return contains;
    }
    /**
     * 获取第一个含有key关键字的起始索引，且该关键字的前后都不是变量字符。
     */
    public static getFirstVariableIndex(key:string,codeText:string):number{
        var subLength:number = 0;
        while(codeText.length){
            var index:number = codeText.indexOf(key);
            if(index==-1){
                break;
            }
            var lastChar:string = codeText.charAt(index+key.length);
            var firstChar:string = codeText.charAt(index-1);
            if(!CodeUtil.isVariableChar(firstChar)&&!CodeUtil.isVariableChar(lastChar)){
                return subLength+index;
            }
            else{
                subLength += index+key.length;
                codeText = codeText.substring(index+key.length);
            }
        }
        return -1;
    }
    /**
     * 获取最后一个含有key关键字的起始索引，且该关键字的前后都不是变量字符。
     */
    public static getLastVariableIndex(key:string,codeText:string):number{
        while(codeText.length){
            var index:number = codeText.lastIndexOf(key);
            if(index==-1){
                break;
            }
            var lastChar:string = codeText.charAt(index+key.length);
            var firstChar:string = codeText.charAt(index-1);
            if(!CodeUtil.isVariableChar(firstChar)&&!CodeUtil.isVariableChar(lastChar)){
                return index;
            }
            else{
                codeText = codeText.substring(0,index);
            }
        }
        return -1;
    }


    /**
     * 获取第一个词,遇到空白字符或 \n \r \t 后停止。
     */
    public static getFirstWord(str:string):string{
        str = str.trim();
        var index:number = str.indexOf(" ");
        if(index==-1)
            index = Number.MAX_VALUE;
        var rIndex:number = str.indexOf("\r");
        if(rIndex==-1)
            rIndex = Number.MAX_VALUE;
        var nIndex:number = str.indexOf("\n");
        if(nIndex==-1)
            nIndex = Number.MAX_VALUE;
        var tIndex:number = str.indexOf("\t");
        if(tIndex==-1)
            tIndex = Number.MAX_VALUE;
        index = Math.min(index,rIndex,nIndex,tIndex);
        str = str.substr(0,index);
        return str.trim();
    }
    /**
     * 移除第一个词
     * @param str 要处理的字符串
     * @param word 要移除的词，若不传入则自动获取。
     */
    public static removeFirstWord(str:string,word:string=""):string{
        if(!word){
            word = CodeUtil.getFirstWord(str);
        }
        var index:number = str.indexOf(word);
        if(index==-1)
            return str;
        return str.substring(index+word.length);
    }
    /**
     * 获取最后一个词,遇到空白字符或 \n \r \t 后停止。
     */
    public static getLastWord(str:string):string{
        str = str.trim();
        var index:number = str.lastIndexOf(" ");
        var rIndex:number = str.lastIndexOf("\r");
        var nIndex:number = str.lastIndexOf("\n");
        var tIndex:number = str.indexOf("\t");
        index = Math.max(index,rIndex,nIndex,tIndex);
        str = str.substring(index+1);
        return str.trim();
    }
    /**
     * 移除最后一个词
     * @param str 要处理的字符串
     * @param word 要移除的词，若不传入则自动获取。
     */
    public static removeLastWord(str:string,word:string=""):string{
        if(!word){
            word = CodeUtil.getLastWord(str);
        }
        var index:number = str.lastIndexOf(word);
        if(index==-1)
            return str;
        return str.substring(0,index);
    }
    /**
     * 获取字符串起始的第一个变量，返回的字符串两端均没有空白。若第一个非空白字符就不是合法变量字符，则返回空字符串。
     */
    public static getFirstVariable(str:string):string{
        str = str.trim();
        var word:string = "";
        var length:number = str.length;
        for(var i:number=0;i<length;i++){
            var char:string = str.charAt(i);
            if(CodeUtil.isVariableChar(char)){
                word += char;
            }
            else{
                break;
            }
        }
        return word.trim();
    }
    /**
     * 移除第一个变量
     * @param str 要处理的字符串
     * @param word 要移除的变量，若不传入则自动获取。
     */
    public static removeFirstVariable(str:string,word:string=""):string{
        if(!word){
            word = CodeUtil.getFirstVariable(str);
        }
        var index:number = str.indexOf(word);
        if(index==-1)
            return str;
        return str.substring(index+word.length);
    }
    /**
     * 获取字符串末尾的最后一个变量,返回的字符串两端均没有空白。若最后一个非空白字符就不是合法变量字符，则返回空字符串。
     */
    public static getLastVariable(str:string):string{
        str = str.trim();
        var word:string = "";
        for(var i:number=str.length-1;i>=0;i--){
            var char:string = str.charAt(i);
            if(CodeUtil.isVariableChar(char)){
                word = char+word;
            }
            else{
                break;
            }
        }
        return word.trim();
    }
    /**
     * 移除最后一个变量
     * @param str 要处理的字符串
     * @param word 要移除的变量，若不传入则自动获取。
     */
    public static removeLastVariable(str:string,word:string=""):string{
        if(!word){
            word = CodeUtil.getLastVariable(str);
        }
        var index:number = str.lastIndexOf(word);
        if(index==-1)
            return str;
        return str.substring(0,index);
    }
    /**
     * 获取一对括号的结束点,例如"class A{ function B(){} } class",返回24,若查找失败，返回-1。
     */
    public static getBracketEndIndex(codeText:string,left:string="{",right:string="}"):number{
        var indent:number = 0;
        var text:string = "";
        while(codeText.length>0){
            var index:number = codeText.indexOf(left);
            if(index==-1)
                index = Number.MAX_VALUE;
            var endIndex:number = codeText.indexOf(right);
            if(endIndex==-1)
                endIndex = Number.MAX_VALUE;
            index = Math.min(index,endIndex);
            if(index==Number.MAX_VALUE){
                return -1;
            }
            text += codeText.substring(0,index+1);
            codeText = codeText.substring(index+1);
            if(index==endIndex)
                indent--;
            else
                indent++;
            if(indent==0){
                break;
            }
            if(codeText.length==0)
                return -1;
        }
        return text.length-1;
    }
    /**
     * 从后往前搜索，获取一对括号的起始点,例如"class A{ function B(){} } class",返回7，若查找失败，返回-1。
     */
    public static getBracketStartIndex(codeText:string,left:string="{",right:string="}"):number{
        var indent:number = 0;
        while(codeText.length>0){
            var index:number = codeText.lastIndexOf(left);
            var endIndex:number = codeText.lastIndexOf(right);
            index = Math.max(index,endIndex);
            if(index==-1){
                return -1;
            }
            codeText = codeText.substring(0,index);
            if(index==endIndex)
                indent++;
            else
                indent--;
            if(indent==0){
                break;
            }
            if(codeText.length==0)
                return -1;
        }
        return codeText.length;
    }

    /**
     * 移除代码注释和字符串常量
     */
    public static removeComment(codeText:string):string{
        var NBSP:string = "\v3\v";
        var trimText:string = "";
        codeText = codeText.split("\\\"").join("\v1\v");
        codeText = codeText.split("\\\'").join("\v2\v");
        while(codeText.length>0){
            var quoteIndex:number = codeText.indexOf("\"");
            if(quoteIndex==-1)
                quoteIndex = Number.MAX_VALUE;
            var squoteIndex:number = codeText.indexOf("'");
            if(squoteIndex==-1)
                squoteIndex = Number.MAX_VALUE;
            var commentIndex:number = codeText.indexOf("/**");
            if(commentIndex==-1)
                commentIndex = Number.MAX_VALUE;
            var lineCommonentIndex:number = codeText.indexOf("//");
            if(lineCommonentIndex==-1)
                lineCommonentIndex = Number.MAX_VALUE;
            var index:number = Math.min(quoteIndex,squoteIndex,commentIndex,lineCommonentIndex);
            if(index==Number.MAX_VALUE){
                trimText += codeText;
                break;
            }
            trimText += codeText.substring(0,index)+NBSP;
            codeText = codeText.substring(index);
            switch(index){
                case quoteIndex:
                    codeText = codeText.substring(1);
                    index = codeText.indexOf("\"");
                    if(index==-1)
                        index = codeText.length-1;
                    codeText = codeText.substring(index+1);
                    break;
                case squoteIndex:
                    codeText = codeText.substring(1);
                    index = codeText.indexOf("'");
                    if(index==-1)
                        index=codeText.length-1;
                    codeText = codeText.substring(index+1);
                    break;
                case commentIndex:
                    index = codeText.indexOf("*/");
                    if(index==-1)
                        index=codeText.length-1;
                    codeText = codeText.substring(index+2);
                    break;
                case lineCommonentIndex:
                    index = codeText.indexOf("\n");
                    if(index==-1)
                        index=codeText.length-1;
                    codeText = codeText.substring(index+1);
                    break;
            }
        }
        codeText = trimText.split("\v1\v").join("\\\"");
        codeText = codeText.split("\v2\v").join("\\\'");
        return codeText;
    }
}
