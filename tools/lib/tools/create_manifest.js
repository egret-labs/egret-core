var file = require("../core/file.js");
var globals = require("../core/globals.js");
var CodeUtil = require("../core/code_util.js");
var xml = require("../core/xml.js");

/**
 * 键是类名，值为这个类依赖的类名列表
 */
var classInfoList;
/**
 * 键为类名，值为这个类所在的文件路径
 */
var classNameToPath;

/**
 * 键是不含命名空间的类名，值是命名空间
 */
var classNameToModule;
/**
 * 键为文件路径，值为这个文件包含的类名列表
 */
var pathToClassNames;
/**
 * 键为文件路径，值为这个文件依赖的类名列表(从import或全局变量中读取的)
 */
var pathInfoList;
/**
 * 键为文件路径，值为这个文件引用的文件列表
 */
var referenceInfoList;
/**
 * 在静态变量或全局变量上被new出来的对象类名列表
 */
var newClassNameList;

/**
 * ts关键字
 */
var functionKeys = ["static", "var", "export", "public", "private", "function", "get", "set", "class", "interface","module"];
/**
 * Egret命名空间
 */
var E = "http://ns.egret-labs.org/egret";
/**
 * Wing命名空间
 */
var W = "http://ns.egret-labs.org/wing";
/**
 * 基本数据类型
 */
var basicTypes = ["void","any","number","string","boolean","Object","Array","Function"];

var classKeys = ["static",  "public", "private", "get", "set", "class", "interface","module"];


/**
 * 生成manifest.json文件
 * @param currentDir 当前文件夹
 * @param args
 * @param opts
 */
function run(currDir, args, opts) {
    currDir = globals.joinEgretDir(currDir, args[0]);
    var srcPath = file.joinPath(currDir,"src/");
    var gameList = create(srcPath);
    var length = gameList.length;
    for (var i = 0; i < length; i++) {
        var path = gameList[i];
        path = path.substring(srcPath.length);
        gameList[i] = "    \"" + path + "\"";
    }
    var fileListText = "[\n" + gameList.join(",\n") + "\n]";
    file.save(file.joinPath(currDir,"manifest.json"),fileListText);
    globals.log("manifest.json生成成功");
}
/**
 * 格式化srcPath
 */
function escapeSrcPath(srcPath){
    if(!srcPath){
        return "";
    }
    srcPath = srcPath.split("\\").join("/");
    if (srcPath.charAt(srcPath.length - 1) != "/") {
        srcPath += "/";
    }
    return srcPath;
}
/**
 * 获取项目中所有类名和文件路径的映射数据
 */
function getClassToPathInfo(srcPath){
    srcPath = escapeSrcPath(srcPath);
    if(!classNameToPath){
        getManifest(srcPath);
    }
    return classNameToPath;
}

function createProjectDTS(excludeList,srcPath){
    srcPath = escapeSrcPath(srcPath);
    if(!pathToClassNames){
        getManifest(srcPath);
    }
    var dts = "";
    for(var path in pathToClassNames){
        if(excludeList.indexOf(path)!=-1){
            continue;
        }
        var text = file.read(path);
        dts += createOneDTS(text)+"\n";
    }
    return dts;
}

function createOneDTS(text){
    if(!text){
        return "";
    }
    text = CodeUtil.removeComment(text)
    //移除export
    var dts = "";
    while(text.length>0){
        var index = CodeUtil.getFirstVariableIndex("export",text);
        if(index==-1){
            dts += text;
            break;
        }
        dts += text.substring(0,index);
        text = text.substring(index+6);
    }
    text = dts;
    text = attachDeclare(text);
    text = removeFunctionBody(text);
    text = removeDefaultValue(text);

    var length = argsTemp.length;
    for(var i=0;i<length;i++){
        var argStr = argsTemp[i];
        text = text.split("\v"+i+"\v").join(argStr);
    }
    text = text.split(";;").join(";");
    return text;
}
/**
 * 增加declare声明
 */
function attachDeclare(text){
    var dts = "";
    while (text.length > 0) {

        var index = CodeUtil.getFirstVariableIndex("class", text);
        if(index==-1){
            index = Number.POSITIVE_INFINITY;
        }
        var moduleIndex = CodeUtil.getFirstVariableIndex("module",text);
        if(moduleIndex==-1){
            moduleIndex = Number.POSITIVE_INFINITY;
        }
        var interfaceIndex = CodeUtil.getFirstVariableIndex("interface", text);
        if(interfaceIndex==-1){
            interfaceIndex = Number.POSITIVE_INFINITY;
        }
        var functionIndex = CodeUtil.getFirstVariableIndex("function", text);
        if(functionIndex==-1){
            functionIndex = Number.POSITIVE_INFINITY;
        }

        var varIndex = CodeUtil.getFirstVariableIndex("var", text);
        if(varIndex==-1){
            varIndex = Number.POSITIVE_INFINITY;
        }

        index = Math.min(interfaceIndex,index,functionIndex,varIndex,moduleIndex);
        if (index == Number.POSITIVE_INFINITY) {
            break;
        }

        var preStr = text.substring(0,index);
        if(trimKeyWords(preStr)!=""){
            var keyLength = 5;
            switch (index){
                case moduleIndex:
                    keyLength = 6;
                    break;
                case interfaceIndex:
                    keyLength = 9;
                    break;
                case functionIndex:
                    keyLength = 8;
                    break;
                case varIndex:
                    keyLength = 3;
                    break;
            }
            text = text.substring(index+keyLength);
            continue;
        }
        dts += "declare ";
        text = text.substring(index);
        if(index==varIndex){
            index = text.indexOf("\n");
            if(index==-1){
                index = text.length;
            }
            dts += text.substring(0,index);
            text = text.substring(index);
        }
        else{
            index = CodeUtil.getBracketEndIndex(text);
            dts += text.substring(0, index + 1)+"\n";
            text = text.substring(index + 1);
        }
    }
    return dts;
}

var argsTemp = [];
/**
 * 移除函数体
 */
function removeFunctionBody(text){
    argsTemp = [];
    var dts = "";
    while(text.length>0){
        var index = text.indexOf("{");
        if(index==-1){
            dts += text;
            break;
        }
        var preStr = text.substring(0,index);
        text = text.substring(index);
        index = preStr.lastIndexOf("}");
        index = Math.max(index,preStr.lastIndexOf(";"));
        if(index==-1){
            index = 0;
        }
        dts += preStr.substring(0,index);
        preStr = preStr.substring(index);
        var endIndex = CodeUtil.getBracketEndIndex(text);
        if(endIndex==-1){
            dts +=text;
            break;
        }

        if(CodeUtil.containsVariable("module",preStr)
            ||CodeUtil.containsVariable("class",preStr)
            ||CodeUtil.containsVariable("interface",preStr)){
            dts += preStr+"{";
            text = text.substring(1);
        }
        else{
            index = CodeUtil.getBracketStartIndex(preStr,"(",")");
            if(index==-1){
                dts += preStr;
            }
            else{
                dts += preStr.substring(0,index+1)
                preStr = preStr.substring(index+1);
                index = preStr.lastIndexOf(")");
                var argStr = preStr.substring(0,index);
                if(argStr.trim()==""){
                    dts += preStr;
                }
                else{

                    argStr = formatArguments(argStr);
                    argsTemp[argsTemp.length] = argStr;
                    argStr = "\v"+(argsTemp.length-1)+"\v";
                    preStr = preStr.substring(index);

                    dts += argStr + preStr;
                }
            }
            dts = dts.trim();
            dts += ";";
            if(constructorArgs){
                dts += constructorArgs;
            }
            text = text.substring(endIndex+1);

        }
    }
    return dts;
}

var constructorArgs = "";
/**
 * 移除var的默认值
 */
function formatArguments(argStr){
    var list = argStr.split(",");
    var length = list.length;
    var argList = [];
    for(var i=0;i<length;i++){
        var arg = list[i];
        arg = arg.trim();
        if(arg.indexOf("public")==0||arg.indexOf("private")==0){
            argList.push(arg+";");
        }
        var args = arg.split(":");
        if(args.length>1){
            var arg1 = args[1];
            if(arg1.indexOf("=")!=-1){
                arg = args[0]+"?:"+arg1.split("=")[0];
            }
        }
        else{
            var arg0 = args[0];
            if(arg0.indexOf("=")!=-1){
                arg = arg0.split("=")[0]+"?";
            }
        }
        if(arg.indexOf("public")==0){
            arg = arg.substring(6);
        }
        else if(arg.indexOf("private")==0){
            arg = arg.substring(7)
        }
        list[i] = arg;
    }
    argStr = list.join(",")
    if(argList.length>0){
        constructorArgs = "\t\t"+argList.join("\n\t\t");
    }
    else{
        constructorArgs = "";
    }

    return argStr;
}
/**
 * 移除var的默认值
 */
function removeDefaultValue(text){
    var dts = "";
    var functionLength = classKeys.length;
    while(text.length>0){
        var index = text.indexOf("=");
        if(index==-1){
            dts += text;
            break;
        }
        dts += text.substring(0,index);
        text = text.substring(index);
        if(text.charAt(0)==">"){
            continue;
        }
        dts = dts.trim()+";";
        index = text.indexOf(";");
        if(index==-1){
            index = Number.POSITIVE_INFINITY;
        }
        var endIndex = text.indexOf("}");
        if(endIndex==-1){
            endIndex = Number.POSITIVE_INFINITY;
        }
        index = Math.min(index,endIndex);
        if(index!=Number.POSITIVE_INFINITY){
            index += 1;
        }
        for(var i=0;i<functionLength;i++){
            var functionKey = classKeys[i];
            var functionIndex = CodeUtil.getFirstVariableIndex(functionKey,text);
            if(functionIndex!=-1){
                index = Math.min(index,functionIndex);
            }
        }
        if(index==Number.POSITIVE_INFINITY){
            break;
        }
        var lineIndex = text.indexOf("\n");
        if(lineIndex!=-1){
            index = Math.max(index,lineIndex)
        }
        text  = text.substring(index);
    }
    return dts;
}

/**
 * 创建manifest列表
 */
function create(srcPath){
    srcPath = escapeSrcPath(srcPath);
    var manifest = getManifest(srcPath);
    manifest = sortFileList(manifest,srcPath);
    return manifest;
}
/**
 * 获取manifest列表，并读取所有的类名
 */
function getManifest(srcPath){
    classInfoList = {};
    classNameToPath = {};
    classNameToModule = {};
    pathInfoList = {};
    pathToClassNames = {};
    referenceInfoList = {};
    newClassNameList = [];
    var manifest = file.searchByFunction(srcPath,filterFunc);
    var exmlList = [];
    for(var i=manifest.length-1;i>=0;i--){
        var path = manifest[i];
        var ext = file.getExtension(path).toLowerCase();
        if(ext=="exml"){
            exmlList.push(path);
        }
    }
    for(i=exmlList.length-1;i>=0;i--){
        path = exmlList[i];
        path = path.substring(0,path.length-4)+"ts";
        var index= manifest.indexOf(path);
        if(index!=-1){
            manifest.splice(index,1);
        }
    }

    var length = manifest.length;
    for (var i = 0; i < length; i++) {
        var path = manifest[i];
        var ext = file.getExtension(path).toLowerCase();
        if(ext=="exml"){
            readClassNamesFromExml(path,srcPath);
        }
        else{
            readClassNamesFromTs(path);
        }
    }

    return manifest;
}
/**
 * 过滤函数
 */
function filterFunc(item){
    var ext = file.getExtension(item).toLowerCase();
    if((ext=="ts"&&item.indexOf(".d.ts")==-1)||ext=="exml"){
        return true;
    }
    return false;
}


/**
 * 按照引用关系排序指定的文件列表
 */
function sortFileList(list,srcPath){

    var length = list.length;
    for (var i = 0; i < length; i++) {
        var path = list[i];
        var ext = file.getExtension(path).toLowerCase();
        if(ext=="exml"){
            readRelyOnFromExml(path,srcPath);
        }
        else{
            readRelyOnFromTs(path);
        }
    }
    for (i = 0; i < length; i++) {
        path = list[i];
        var ext = file.getExtension(path).toLowerCase();
        if(ext=="exml"){
            readReferenceFromExml(path);
        }
        else{
            readReferenceFromTs(path);
        }
    }


    var paths = [];
    //把所有引用关系都合并到pathInfoList里，并把类名替换为对应文件路径。
    for (var path in pathInfoList) {
        paths.push(path);
        var list = pathInfoList[path];
        var classList = pathToClassNames[path];
        length = classList.length;
        for (i = 0; i < length; i++) {
            var className = classList[i];
            var relyOnList = classInfoList[className];
            var len = relyOnList.length;
            for (var j = 0; j < len; j++) {
                className = relyOnList[j];
                if (list.indexOf(className) == -1) {
                    list.push(className);
                }
            }
        }
        length = list.length;
        for (i = length - 1; i >= 0; i--) {
            className = list[i];
            var relyPath = classNameToPath[className];
            if (relyPath && relyPath != path) {
                list[i] = relyPath;
            } else {
                list.splice(i, 1);
            }
        }
    }

    var pathList = sortOnPathLevel(paths,pathInfoList,true);

    var gameList = [];
    for (var key in pathList) {
        list = pathList[key];
        list = sortOnReference(list);
        gameList = list.concat(gameList);
    }

    //删除文档类没有引用过的类名
    var documentClass = globals.getDocumentClass(srcPath.substring(0,srcPath.length-4));
    var docPath = classNameToPath[documentClass];
    if(docPath){
        var referenceList = [docPath];
        getReferenceList(docPath,referenceList);
        for(var i=gameList.length-1;i>=0;i--){
            var path = gameList[i];
            if(referenceList.indexOf(path)==-1){
                gameList.splice(i,1);
            }
        }
    }
    return gameList;
}

function getReferenceList(path,result){
    var list = referenceInfoList[path];
    if(list){
        var length = list.length;
        for(var i=0;i<length;i++){
            var path = list[i];
            if(path&&result.indexOf(path)==-1){
                result.push(path);
                getReferenceList(path,result);
            }
        }
    }

}


/**
 * 按照引用关系进行排序
 */
function sortOnReference(list){
    var pathRelyInfo = {};
    var length = list.length;
    for(var i=0;i<length;i++){
        var path = list[i];
        var refList = [];
        var reference = referenceInfoList[path];
        for(var j=list.length-1;j>=0;j--){
            var p = reference[j];
            if(list.indexOf(p)!=-1){
                refList.push(p);
            }
        }
        pathRelyInfo[path] = refList;
    }

    var firstList = [];
    var secondList = [];
    for(i=0;i<length;i++){
        path = list[i];
        if(newClassNameList.indexOf(path)!=-1){
            firstList.push(path);
        }
        else{
            secondList.push(path);
        }
    }
    list = firstList.concat(secondList);

    var pathList = sortOnPathLevel(list,pathRelyInfo,false);
    var gameList = [];
    for (var key in pathList) {
        list = pathList[key];
        list.sort();
        gameList = list.concat(gameList);
    }
    return gameList;
}
/**
 * 根据引用深度排序
 */
function sortOnPathLevel(list,pathRelyInfo,throwError){
    var length = list.length;
    var pathLevelInfo = {};
    for(var i=0;i<length;i++){
        var path = list[i];
        setPathLevel(path, 0, pathLevelInfo, [path],pathRelyInfo,throwError);
    }

    //pathList里存储每个level对应的文件路径列表
    var pathList = [];
    for (path in pathLevelInfo) {
        var level = pathLevelInfo[path];
        if (pathList[level]) {
            pathList[level].push(path);
        }
        else {
            pathList[level] = [path];
        }
    }
    return pathList;
}
/**
 * 设置文件引用深度
 */
function setPathLevel(path, level, pathLevelInfo, map,pathRelyInfo,throwError) {
    if (pathLevelInfo[path] == null) {
        pathLevelInfo[path] = level;
    } else {
        pathLevelInfo[path] = Math.max(pathLevelInfo[path], level);
    }
    var list = pathRelyInfo[path];
    var length = list.length;
    for (var i = 0; i < length; i++) {
        var relyPath = list[i];
        if (map.indexOf(relyPath) != -1) {
            if(throwError){
                globals.exit(1103, path);
            }
            break;
        }
        setPathLevel(relyPath, level + 1, pathLevelInfo, map.concat(relyPath),pathRelyInfo,throwError);
    }
}
/**
 * 读取一个EXML文件引用的类名列表
 */
function readReferenceFromExml(path){
    var text = file.read(path);
    var exml = xml.parse(text);
    if(!exml){
        return;
    }
    var list = [];
    readReferenceFromNode(exml,list);
    referenceInfoList[path] = list;
}
/**
 * 从一个xml节点读取类名引用
 */
function readReferenceFromNode(node,list){
    if(!node){
        return;
    }
    var className = getClassNameById(node.localName,node.namespace);
    var path = classNameToPath[className];
    if(path&&list.indexOf(path)==-1){
        list.push(path);
    }

    for(var key in node){
        if(key.charAt(0)=="$"){
            var value = node[key];
            path = classNameToPath[value];
            if(path&&list.indexOf(path)==-1){
                list.push(path);
            }
        }
    }

    var children = node.children;
    if(children){
        var length = children.length;
        for(var i=0;i<length;i++){
            var child = children[i];
            readReferenceFromNode(child,list);
        }
    }
}

/**
 * 读取一个TS文件引用的类名列表
 */
function readReferenceFromTs(path){
    var text = file.read(path);
    var orgText = text;
    text = CodeUtil.removeComment(text);
    var block = "";
    var tsText = "";
    var moduleList = {};
    while (text.length > 0) {
        var index = text.indexOf("{");
        if (index == -1) {
            if (tsText) {
                tsText = "";
            }
            break;
        } else {
            var preStr = text.substring(0, index);
            tsText += preStr;
            text = text.substring(index);
            index = CodeUtil.getBracketEndIndex(text);
            if (index == -1) {
                break;
            }
            block = text.substring(1, index);
            text = text.substring(index + 1);
            var ns = CodeUtil.getLastWord(preStr);
            preStr = CodeUtil.removeLastWord(preStr);
            var word = CodeUtil.getLastWord(preStr);
            if (word == "module") {
                if (tsText) {
                    tsText = "";
                }
                if(!moduleList[ns]){
                    moduleList[ns] = block;
                }
                else{
                    moduleList[ns] += block;
                }

            } else {
                tsText += "{" + block + "}";
            }
        }
    }

    var list = [];
    for(var className in classInfoList){
        if(CodeUtil.containsVariable(className,orgText)){
            var p = classNameToPath[className];
            if(p&&p!=path&&list.indexOf(p)==-1){
                list.push(p);
            }
            continue;
        }
        var key = className;
        var index = className.lastIndexOf(".");
        if(index==-1){
            continue;
        }
        key = className.substring(index+1);
        var targetNS = className.substring(0,index);
        targetNS = targetNS.split(".")[0];

        for(var ns in moduleList){
            if(ns.split(".")[0]==targetNS){
                text = moduleList[ns];
                if(CodeUtil.containsVariable(key,text)){
                    p = classNameToPath[className];
                    if(p&&p!=path&&list.indexOf(p)==-1){
                        list.push(p);
                    }
                    break;
                }
            }
        }
    }
    referenceInfoList[path] = list;
}

/**
 * 读取一个exml文件包含的类名
 */
function readClassNamesFromExml(path,srcPath){
    var text = file.read(path);
    var exml = xml.parse(text);
    if(!exml){
        return;
    }
    var className = path.substring(srcPath.length,path.length-5);
    className = className.split("/").join(".");
    classNameToPath[className] = path;
    pathToClassNames[path] = [className];
}

/**
 * 读取一个exml文件依赖的类列表
 */
function readRelyOnFromExml(path,srcPath){
    var text = file.read(path);
    var exml = xml.parse(text);
    if(!exml){
        return;
    }
    var className = pathToClassNames[path][0];
    pathInfoList[path] = [];
    var relyOnList = classInfoList[className] = [];
    var superClass = getClassNameById(exml.localName,exml.namespace);
    if(superClass){
        relyOnList.push(superClass);
    }

}

/**
 * 根据id和命名空间获取类名
 */
function getClassNameById(id,ns){
    var name = "";
    if (ns == W||basicTypes.indexOf(id) != -1) {
    }
    else if (!ns || ns == E) {
        name = "egret." + id;
    }
    else {
        name = ns.substring(0,ns.length-1)+id
    }
    return name;
}

/**
 * 读取一个ts文件引用的类列表
 */
function readClassNamesFromTs(path) {
    analyzeTsFile(path,false);
}

/**
 * 读取一个ts文件引用的类列表
 */
function readRelyOnFromTs(path) {
    analyzeTsFile(path,true);
}
/**
 * 分析一个ts文件
 */
function analyzeTsFile(path,readRelyOn){
    var fileRelyOnList = [];
    var text = file.read(path);
    var list = [];
    text = CodeUtil.removeComment(text);
    if(readRelyOn){
        readRelyOnFromImport(text, fileRelyOnList);
    }
    var block = "";
    var tsText = "";
    while (text.length > 0) {
        var index = text.indexOf("{");
         if (index == -1) {
            if (tsText) {
                list = list.concat(readClassFromBlock(tsText, fileRelyOnList,path,"",readRelyOn));
                tsText = "";
            }
            list = list.concat(readClassFromBlock(text, fileRelyOnList,path,"",readRelyOn));
            break;
        } else {
            var preStr = text.substring(0, index);
            tsText += preStr;
            text = text.substring(index);
            index = CodeUtil.getBracketEndIndex(text);
            if (index == -1) {
                break;
            }
            block = text.substring(1, index);
            text = text.substring(index + 1);
            var ns = CodeUtil.getLastWord(preStr);
            preStr = CodeUtil.removeLastWord(preStr);
            var word = CodeUtil.getLastWord(preStr);
            if (word == "module") {
                if (tsText) {
                    list = list.concat(readClassFromBlock(tsText, fileRelyOnList,path,"",readRelyOn));
                    tsText = "";
                }
                list = list.concat(readClassFromBlock(block, fileRelyOnList,path, ns,readRelyOn));
            } else {
                tsText += "{" + block + "}";
            }
        }
    }
    if (tsText) {
        list = list.concat(readClassFromBlock(tsText, fileRelyOnList,path,"",readRelyOn));
    }


    if(readRelyOn){
        pathInfoList[path] = fileRelyOnList;
    }
    else{
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var className = list[i];
            classNameToPath[className] = path;
        }
        pathToClassNames[path] = list;
    }
}
/**
 * 从import关键字中分析引用关系
 */
function readRelyOnFromImport(text, fileRelyOnList) {
    while (text.length > 0) {
        var index = CodeUtil.getFirstVariableIndex("import", text);
        if (index == -1) {
            break;
        }
        text = text.substring(index + 6);
        text = CodeUtil.removeFirstVariable(text).trim();
        if (text.charAt(0) != "=") {
            continue;
        }
        text = text.substring(1);
        var className = CodeUtil.getFirstWord(text);
        className = CodeUtil.trimVariable(className);
        if (fileRelyOnList.indexOf(className) == -1) {
            fileRelyOnList.push(className);
        }
    }
}

/**
 * 从代码块中分析引用关系，代码块为一个Module，或类外的一段全局函数定义
 */
function readClassFromBlock(text, fileRelyOnList,path, ns,readRelyOn) {
    if (typeof ns === "undefined") { ns = ""; }
    var list = [];

    while (text.length > 0) {

        var index = CodeUtil.getFirstVariableIndex("class", text);
        if(index==-1){
            index = Number.POSITIVE_INFINITY;
        }
        var interfaceIndex = CodeUtil.getFirstVariableIndex("interface", text);
        if(interfaceIndex==-1){
            interfaceIndex = Number.POSITIVE_INFINITY;
        }
        var functionIndex = CodeUtil.getFirstVariableIndex("function", text);
        if(functionIndex==-1){
            functionIndex = Number.POSITIVE_INFINITY;
        }
        else if(ns){
            if(CodeUtil.getLastWord(text.substring(0,functionIndex))!="export"){
                functionIndex = Number.POSITIVE_INFINITY;
            }
        }
        var varIndex = CodeUtil.getFirstVariableIndex("var", text);
        if(varIndex==-1){
            varIndex = Number.POSITIVE_INFINITY;
        }
        else if(ns){
            if(CodeUtil.getLastWord(text.substring(0,varIndex))!="export"){
                varIndex = Number.POSITIVE_INFINITY;
            }
        }
        index = Math.min(interfaceIndex,index,functionIndex,varIndex);
        if (index == Number.POSITIVE_INFINITY) {
            if(readRelyOn){
                findClassInLine(text,pathToClassNames[path],ns,fileRelyOnList);
            }
            break;
        }

        var isVar = (index==varIndex);
        var keyLength = 5;
        switch (index){
            case varIndex:
                keyLength = 3;
                break;
            case interfaceIndex:
                keyLength = 9;
                break;
            case functionIndex:
                keyLength = 8;
                break;
        }
        var preStr = text.substring(0, index + keyLength);
        if(readRelyOn){
            findClassInLine(preStr,pathToClassNames[path],ns,fileRelyOnList)
        }

        text = text.substring(index + keyLength);
        var word = CodeUtil.getFirstVariable(text);
        if (word) {
            var className;
            if (ns) {
                className = ns + "." + word;
            } else {
                className = word;
            }
            if (list.indexOf(className) == -1) {
                list.push(className);
                var nsList = classNameToModule[word];
                if(!nsList){
                    nsList = classNameToModule[word] = [];
                }
                if(nsList.indexOf(ns)==-1){
                    nsList.push(ns);
                }
            }
            if(readRelyOn){
                var relyOnList = classInfoList[className];
                if (!relyOnList) {
                    relyOnList = classInfoList[className] = [];
                }
            }
            text = CodeUtil.removeFirstVariable(text);
            word = CodeUtil.getFirstVariable(text);
            if (readRelyOn&&word == "extends") {
                text = CodeUtil.removeFirstVariable(text);
                word = CodeUtil.getFirstWord(text);
                word = CodeUtil.trimVariable(word);
                if (ns && word.indexOf(".") == -1) {
                    var nsList = classNameToModule[word];
                    var length = nsList.length;
                    var prefix = ns.split(".")[0];
                    for(var k=0;k<length;k++){
                        var superNs = nsList[k];
                        if(superNs.split(".")[0]==prefix){
                            word = superNs+"."+word;
                        }
                    }
                }
                if (relyOnList.indexOf(word) == -1) {
                    relyOnList.push(word);

                }
            }
        }
        if(isVar){
            index = text.indexOf("\n");
            if(index==-1){
                index = text.length;
            }
            text = text.substring(index);
        }
        else{
            index = CodeUtil.getBracketEndIndex(text);
            var classBlock = text.substring(0, index + 1);
            text = text.substring(index + 1);
            index = classBlock.indexOf("{");
            classBlock = classBlock.substring(index);
            if(readRelyOn){
                getRelyOnFromStatic(classBlock, ns,className, relyOnList);
            }
        }

    }
    return list;
}

/**
 * 从代码的静态变量中读取依赖关系
 */
function getRelyOnFromStatic(text,ns, className, relyOnList) {
    while (text.length > 0) {
        var index = CodeUtil.getFirstVariableIndex("static", text);
        if (index == -1) {
            break;
        }
        text = text.substring(index);
        text = trimKeyWords(text);
        text = CodeUtil.removeFirstVariable(text).trim();
        if (text.charAt(0) == "(") {
            continue;
        }
        if (text.charAt(0) == ":") {
            text = text.substring(1);
            while (text.length > 0) {
                text = CodeUtil.removeFirstVariable(text).trim();
                if (text.charAt(0) != ".") {
                    break;
                }
                text = text.substring(1).trim();
            }
        }
        if (text.charAt(0) != "=") {
            continue;
        }
        text = text.substring(1).trim();
        index = text.indexOf("\n");
        var line = text;
        if(index!=-1){
            line = text.substring(0,index);
            text = text.substring(index);
        }
        findClassInLine(line,[className],ns,relyOnList);
    }
}

function findClassInLine(line,classNames,ns,relyOnList){
    for(var name in classNameToPath){
        if(classNames.indexOf(name)!=-1){
            continue;
        }
        var found = false;
        if(CodeUtil.containsVariable(name,line)){

            found = true;
        }
        if(!found){
            var index = name.lastIndexOf(".");
            if(index!=-1&&name.substring(0,index)==ns){
                if(CodeUtil.containsVariable(name.substring(index+1),line)){
                    found = true;
                }
            }
        }

        if(found){
            if (relyOnList.indexOf(name) == -1) {
                relyOnList.push(name);
                if(newClassNameList.indexOf(name)==-1){
                    newClassNameList.push(name);
                }
            }
        }

    }
}

/**
 * 删除字符串开头的所有关键字
 */
function trimKeyWords(codeText) {
    codeText = codeText.trim();
    var word;
    while (codeText.length > 0) {
        word = CodeUtil.getFirstVariable(codeText);
        if (functionKeys.indexOf(word) == -1) {
            break;
        }
        codeText = CodeUtil.removeFirstVariable(codeText, word);
    }
    return codeText;
}



function help_title() {
    return "在工程目录下生成manifest.json清单文件\n";
}


function help_example() {
    return "egret create_manifest [project_name]";
}

exports.run = run;
exports.create = create;
exports.getClassToPathInfo = getClassToPathInfo;
exports.createProjectDTS = createProjectDTS;
exports.help_title = help_title;
exports.help_example = help_example;