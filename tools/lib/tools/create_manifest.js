var file = require("../core/file.js");
var globals = require("../core/globals.js");
var CodeUtil = require("../core/code_util.js");
var xml = require("../core/xml.js");
var exml_config = require("../exml/exml_config.js");
/**
 * 键是类名，值为这个类依赖的类名列表
 */
var classInfoList;
/**
 * 键是文件路径，值为这个类依赖的类文件路径,且所依赖的类都是被new出来的。
 */
var newClassInfoList;
/**
 * 键是文件路径，值为这个类实例化时需要依赖的类文件路径列表
 */
var subRelyOnInfoList;
/**
 * 键为类名，值为这个类所在的文件路径
 */
var classNameToPath;

var noneExportClassName;
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

var thmList;

var moduleReferenceInfo;

var modeulClassToPath;
/**
 * 包括模块类的所有被文档类引用到的类路径列表
 */
var moduleReferenceList;

var exmlConfig;
/**
 * ts关键字
 */
var functionKeys = ["static", "var", "export", "public", "private", "function", "get", "set", "class", "interface","module","extends","implements","super","this"];
/**
 * Egret命名空间
 */
var E = "http://ns.egret-labs.org/egret";
/**
 * Wing命名空间
 */
var W = "http://ns.egret-labs.org/wing";


//create("D:/Program/HTML5/egret-examples/GUIExample/src");
/**
 * 生成manifest.json文件
 * @param currentDir 当前文件夹
 * @param args
 * @param opts
 */
function run(currDir, args, opts) {
    var createAll = opts["-all"];
    currDir = globals.joinEgretDir(currDir, args[0]);
    var srcPath = file.joinPath(currDir,"src/");
    var gameList = create(srcPath,createAll);
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

function getModuleReferenceInfo(fileList){
    resetCache();
    var length = fileList.length;
    for (var i = 0; i < length; i++) {
        var path = fileList[i];
        readClassNamesFromTs(path);
    }
    for (i = 0; i < length; i++) {
        path = fileList[i];
        readReferenceFromTs(path);
    }
    var result = {referenceInfoList:referenceInfoList,classNameToPath:classNameToPath};
    classInfoList = null;
    newClassInfoList = null;
    subRelyOnInfoList = null;
    classNameToPath = null;
    noneExportClassName = null;
    classNameToModule = null;
    pathInfoList = null;
    pathToClassNames = null;
    referenceInfoList = null;
    thmList = null;
    return result;
}

function resetCache(){
    classInfoList = {};
    newClassInfoList = {};
    subRelyOnInfoList = {};
    classNameToPath = {};
    noneExportClassName = {};
    classNameToModule = {};
    pathInfoList = {};
    pathToClassNames = {};
    referenceInfoList = {};
    thmList = [];
    moduleReferenceInfo = null;
    modeulClassToPath = null;
    moduleReferenceList = null;
}

function getModuleReferenceList(referenceInfo){
    return moduleReferenceList;
}


/**
 * 创建manifest列表
 */
function create(srcPath,createAll,referenceInfo){
    srcPath = escapeSrcPath(srcPath);
    var manifest = getManifest(srcPath);
    if(referenceInfo){
        moduleReferenceInfo = referenceInfo.referenceInfoList;
        modeulClassToPath = referenceInfo.classNameToPath;
    }
    manifest = sortFileList(manifest,srcPath);
    if(!createAll){
        filterFileList(manifest,srcPath);
    }
    return manifest;
}

/**
 * 获取manifest列表，并读取所有的类名
 */
function getManifest(srcPath){
    resetCache();
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
    if(ext=="thm"){
        thmList.push(item);
        return false;
    }
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
            if(relyOnList){
                var len = relyOnList.length;
                for (var j = 0; j < len; j++) {
                    className = relyOnList[j];
                    if (list.indexOf(className) == -1) {
                        list.push(className);
                    }
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

    return gameList;
}

function filterFileList(gameList,srcPath){
    var documentClass = globals.getDocumentClass(srcPath.substring(0,srcPath.length-4));
    var docPath = classNameToPath[documentClass];
    if(docPath) {
        var documentList = readTHMClassList(file.joinPath(srcPath, ".."));
        documentList.push(docPath);
        var referenceList = [];
        var length = documentList.length;
        for(var i=0;i<length;i++){
            var docPath = documentList[i];
            if(referenceList.indexOf(docPath)==-1){
                referenceList.push(docPath);
                getReferenceList(docPath,referenceList);
            }
        }
        moduleReferenceList = referenceList;
        for(var i=gameList.length-1;i>=0;i--){
            var path = gameList[i];
            if(referenceList.indexOf(path)==-1){
                gameList.splice(i,1);
            }
        }
    }
    return gameList;
}

var searchPath;
/**
 * 读取主题文件列表
 */
function readTHMClassList(projectPath){
    searchPath = projectPath;
    var list = file.searchByFunction(projectPath,thmFilterFunc,true);
    thmList = thmList.concat(list);
    var length = thmList.length;
    var pathList = [];
    for(var i=0;i<length;i++){
        var path = thmList[i];
        var text = file.read(path);
        var skins;
        try{
            var data = JSON.parse(text);
            skins = data.skins;
        }
        catch(e){
            continue;
        }
        if(!skins){
            continue;
        }
        for(var key in skins){
            var className = skins[key];
            var classPath = classNameToPath[className];
            if(classPath&&pathList.indexOf(classPath)==-1){
                pathList.push(classPath);
            }
        }
    }
    return pathList;
}

/**
 * 过滤函数
 */
function thmFilterFunc(item){
    if(file.isDirectory(item)){
        if(item==searchPath+"/bin-debug"||
            item==searchPath+"/libs"||
            item==searchPath+"/release"||
            item==searchPath+"/src"||
            item==searchPath+"/launcher"){
            return false;
        }
        return true;
    }
    var ext = file.getExtension(item).toLowerCase();
    if(ext=="thm"){
        return true;
    }
    return false;
}

function getReferenceList(path,result){
    var list = referenceInfoList[path];
    if(!list&&moduleReferenceInfo){
        list = moduleReferenceInfo[path];
    }
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
function setPathLevel(path, level, pathLevelInfo, map,pathRelyInfo,throwError,checkNew) {
    if (pathLevelInfo[path] == null) {
        pathLevelInfo[path] = level;
    } else {
        if(pathLevelInfo[path]<level){
            pathLevelInfo[path] = level;
        }
        else{
            return;
        }
    }
    var list = pathRelyInfo[path];
    if(checkNew){
        var list = list.concat();
        var subList = subRelyOnInfoList[path];
        if(subList){
            for(i = subList.length-1;i>=0;i--){
                relyPath = subList[i];
                if(list.indexOf(relyPath)==-1){
                    list.push(relyPath);
                }
            }
        }
    }
    if(throwError){
        var newList = newClassInfoList[path];
    }

    var length = list.length;
    for (var i = 0; i < length; i++) {
        var relyPath = list[i];
        if (map.indexOf(relyPath) != -1) {
            if(throwError){
                map.push(relyPath);
                globals.exit(1103, map.join("\n"));
            }
            break;
        }
        var checkNewFlag = checkNew||(newList&&newList.indexOf(relyPath)!=-1);
        setPathLevel(relyPath, level + 1, pathLevelInfo, map.concat(relyPath),pathRelyInfo,throwError,checkNewFlag);
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
    if(modeulClassToPath){
        list.push(modeulClassToPath["egret.gui.AddItems"]);
        list.push(modeulClassToPath["egret.gui.SetProperty"]);
        list.push(modeulClassToPath["egret.gui.SetStyle"]);
        list.push(modeulClassToPath["egret.gui.State"]);
        list.push(modeulClassToPath["egret.gui.getScale9Grid"]);
        list.push(modeulClassToPath["egret.gui.ClassFactory"]);
        list.push(modeulClassToPath["egret.gui.setProperties"]);
        list.push(modeulClassToPath["egret.gui.ButtonSkin"]);
    }
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
    if(!path&&modeulClassToPath){
        path = modeulClassToPath[className];
    }
    if(path&&list.indexOf(path)==-1){
        list.push(path);
    }

    for(var key in node){
        if(key.charAt(0)=="$"){
            var value = node[key];
            path = classNameToPath[value];
            if(!path&&modeulClassToPath){
                path = modeulClassToPath[className];
            }
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
    var orgText = CodeUtil.removeCommentExceptQuote(text);
    text = CodeUtil.removeComment(text,path);
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

            preStr = CodeUtil.removeLastWord(preStr,ns);
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
    checkAllClassName(classNameToPath,path,list,moduleList,orgText);
    var length = list.length;
    for(var i=0;i<length;i++){
        list[i] = classNameToPath[list[i]];
    }
    if(modeulClassToPath){
        var newList = []
        checkAllClassName(modeulClassToPath,path,newList,moduleList,orgText);
        length = newList.length;
        for(i=0;i<length;i++){
            var value = modeulClassToPath[newList[i]];
            if(list.indexOf(value)==-1){
                list.push(value);
            }
        }
    }

    referenceInfoList[path] = list;
}

function checkAllClassName(classNameToPath,path,list,moduleList,orgText){
    var exclude = pathToClassNames[path];
    findClassInLine(orgText,exclude,"",list,classNameToPath)
    for(var ns in moduleList){
        var text = moduleList[ns];
        findClassInLine(text,exclude,ns,list,classNameToPath);
    }
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
    if(classNameToPath[className]){
        checkRepeatClass(path,classNameToPath[className],className);
    }
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
    if(!ns||ns==E||ns==W){
        if(!exmlConfig){
            exmlConfig = exml_config.getInstance();
        }
        return exmlConfig.getClassNameById(id,ns);
    }
    return ns.substring(0,ns.length-1)+id;
}

/**
 * 读取一个ts文件引用的类列表
 */
function readClassNamesFromTs(path) {
    var text = file.read(path);
    text = CodeUtil.removeComment(text,path);
    var list = [];
    var noneExportList = [];
    analyzeModule(text,list,noneExportList,"");
    if(noneExportList.length>0){
        noneExportClassName[path] = noneExportList;
    }
    var length = list.length;
    for (var i = 0; i < length; i++) {
        var className = list[i]
        if(classNameToPath[className]){
            checkRepeatClass(path,classNameToPath[className],className);
        }
        classNameToPath[className] = path;
    }
    pathToClassNames[path] = list;
}

function checkRepeatClass(newPath,oldPath,className){
    if(newPath==oldPath||!newPath||!oldPath){
        return;
    }
    var index = newPath.lastIndexOf(".");
    var p1 = newPath.substring(0,index);
    index = oldPath.lastIndexOf(".");
    var p2 = oldPath.substring(0,index);
    if(p1==p2){
        return;
    }
    var list = noneExportClassName[newPath];
    if(list&&list.indexOf(className)!=-1){
        return;
    }
    list = noneExportClassName[oldPath];
    if(list&&list.indexOf(className)!=-1){
        return;
    }
    globals.exit(1308,className,newPath,oldPath);
}

/**
 * 分析一个ts文件
 */
function analyzeModule(text,list,noneExportList,moduleName)
{
    var block = "";
    while (text.length > 0){
        var index = CodeUtil.getFirstVariableIndex("module",text);
        if (index == -1){
            readClassFromBlock(text,list,noneExportList,moduleName);
            break;
        }
        else{
            var preStr = text.substring(0, index).trim();
            if(preStr){
                readClassFromBlock(preStr,list,noneExportList,moduleName);
            }
            text = text.substring(index+6);
            var ns = CodeUtil.getFirstWord(text);
            ns = CodeUtil.trimVariable(ns);
            index = CodeUtil.getBracketEndIndex(text);
            if (index == -1){
                break;
            }
            block = text.substring(0, index);
            text = text.substring(index + 1);
            index = block.indexOf("{");
            block = block.substring(index+1);
            if(moduleName){
                ns = moduleName+"."+ns;
            }
            analyzeModule(block,list,noneExportList,ns);
        }
    }
}

/**
 * 从代码块中读取类名，接口名，全局函数和全局变量，代码块为一个Module，或类外的一段全局函数定义
 */
function readClassFromBlock(text,list,noneExportList,ns){
    var newText = "";
    while(text.length>0){
        var index = text.indexOf("{");
        if(index==-1){
            newText += text;
            break;
        }
        newText += text.substring(0,index);
        text = text.substring(index);
        index = CodeUtil.getBracketEndIndex(text);
        if(index==-1){
            newText += text;
            break;
        }
        text = text.substring(index+1);
    }
    text = newText;
    while (text.length > 0){
        var noneExported = false;
        var classIndex = CodeUtil.getFirstVariableIndex("class", text);
        if(classIndex==-1){
            classIndex = Number.POSITIVE_INFINITY;
        }
        else if(ns){
            if(CodeUtil.getLastWord(text.substring(0,classIndex))!="export")
            {
                noneExported = true;
            }
        }
        var interfaceIndex = CodeUtil.getFirstVariableIndex("interface", text);
        if(interfaceIndex==-1){
            interfaceIndex = Number.POSITIVE_INFINITY;
        }
        else if(ns){
            if(CodeUtil.getLastWord(text.substring(0,interfaceIndex))!="export")
            {
                noneExported = true;
            }
        }
        var enumIndex = getFirstKeyWordIndex("enum",text,ns);
        var functionIndex = getFirstKeyWordIndex("function", text,ns);
        var varIndex = getFirstKeyWordIndex("var", text,ns);
        classIndex = Math.min(interfaceIndex,classIndex,enumIndex,functionIndex,varIndex);
        if (classIndex == Number.POSITIVE_INFINITY){
            break;
        }

        var isVar = (classIndex==varIndex);
        var keyLength = 5;
        switch (classIndex){
            case varIndex:
                keyLength = 3;
                break;
            case interfaceIndex:
                keyLength = 9;
                break;
            case functionIndex:
                keyLength = 8;
                break;
            case enumIndex:
                keyLength = 4;
                break;
        }

        text = text.substring(classIndex + keyLength);
        var word = CodeUtil.getFirstVariable(text);
        if (word) {
            var className;
            if (ns){
                className = ns + "." + word;
            }
            else{
                className = word;
            }
            if (list.indexOf(className) == -1){
                list.push(className);
                if(noneExported){
                    noneExportList.push(className);
                }
                if(ns){
                    var nsList = classNameToModule[word];
                    if(!nsList){
                        nsList = classNameToModule[word] = [];
                    }
                    if(nsList.indexOf(ns)==-1){
                        nsList.push(ns);
                    }
                }
            }
            text = CodeUtil.removeFirstVariable(text);
        }
        if(isVar){
            classIndex = text.indexOf("\n");
            if(classIndex==-1){
                classIndex = text.length;
            }
            text = text.substring(classIndex);
        }
        else{
            classIndex = CodeUtil.getBracketEndIndex(text);
            text = text.substring(classIndex + 1);
        }
    }
}
/**
 * 读取第一个关键字的索引
 */
function getFirstKeyWordIndex(key,text,ns){
    var index = CodeUtil.getFirstVariableIndex(key, text);
    if(index==-1){
        index = Number.POSITIVE_INFINITY;
    }
    else if(ns){
        if(CodeUtil.getLastWord(text.substring(0,index))!="export")
        {
            index = Number.POSITIVE_INFINITY;
        }
    }
    return index;
}

/**
 * 读取一个ts文件引用的类列表
 */
function readRelyOnFromTs(path) {
    var fileRelyOnList = [];
    var text = file.read(path);
    text = CodeUtil.removeComment(text,path);
    readRelyOnFromImport(text, fileRelyOnList);
    analyzeModuleForRelyOn(text,path,fileRelyOnList,"");
    pathInfoList[path] = fileRelyOnList;
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
 * 分析一个ts文件
 */
function analyzeModuleForRelyOn(text,path,fileRelyOnList,moduleName){
    while (text.length > 0){
        var index = CodeUtil.getFirstVariableIndex("module",text);
        if (index == -1){
            readRelyOnFromBlock(text,path,fileRelyOnList,moduleName);
            break;
        }
        else{
            var preStr = text.substring(0, index).trim();
            if(preStr){
                readRelyOnFromBlock(preStr,path,fileRelyOnList,moduleName);
            }

            text = text.substring(index+6);
            var ns = CodeUtil.getFirstWord(text);
            ns = CodeUtil.trimVariable(ns);
            index = CodeUtil.getBracketEndIndex(text);
            if (index == -1){
                break;
            }
            var block = text.substring(0, index+1);
            text = text.substring(index + 1);
            if(moduleName){
                ns = moduleName+"."+ns;
            }
            analyzeModuleForRelyOn(block,path,fileRelyOnList,ns);
        }
    }
}

/**
 * 从代码块中分析引用关系，代码块为一个Module，或类外的一段全局函数定义
 */
function readRelyOnFromBlock(text, path,fileRelyOnList,ns) {

    while (text.length > 0) {
        var index = CodeUtil.getFirstVariableIndex("class", text);
        if(index==-1){
            escapFunctionLines(text,pathToClassNames[path],ns,fileRelyOnList);
            break;
        }

        var keyLength = 5;
        var preStr = text.substring(0, index + keyLength);
        escapFunctionLines(preStr,pathToClassNames[path],ns,fileRelyOnList)

        text = text.substring(index + keyLength);
        var word = CodeUtil.getFirstVariable(text);
        if (word) {
            var className;
            if (ns) {
                className = ns + "." + word;
            } else {
                className = word;
            }
            var relyOnList = classInfoList[className];
            if (!relyOnList) {
                relyOnList = classInfoList[className] = [];
            }
            text = CodeUtil.removeFirstVariable(text);
            word = CodeUtil.getFirstVariable(text);
            if (word == "extends") {
                text = CodeUtil.removeFirstVariable(text);
                word = CodeUtil.getFirstWord(text);
                word = CodeUtil.trimVariable(word);
                word = getFullClassName(word,ns);
                if (relyOnList.indexOf(word) == -1) {
                    relyOnList.push(word);
                }
            }
        }
        index = CodeUtil.getBracketEndIndex(text);
        var classBlock = text.substring(0, index + 1);
        text = text.substring(index + 1);
        index = classBlock.indexOf("{");
        classBlock = classBlock.substring(index);
        getSubRelyOnFromClass(classBlock,ns,className);
        getRelyOnFromStatic(classBlock, ns,className, relyOnList);
    }
}

/**
 * 根据类类短名，和这个类被引用的时所在的module名来获取完整类名。
 */
function getFullClassName(word,ns) {
    if (!ns||!word) {
        return word;
    }
    var prefix = "";
    var index = word.lastIndexOf(".");
    var nsList;
    if(index==-1){
        nsList = classNameToModule[word];
    }
    else{
        prefix = word.substring(0,index);
        nsList = classNameToModule[word.substring(index+1)];
    }
    if(!nsList){
        return word;
    }
    var length = nsList.length;
    var targetNs = "";
    for(var k=0;k<length;k++){
        var superNs = nsList[k];
        if(prefix){
            var tail = superNs.substring(superNs.length-prefix.length);
            if(tail==prefix){
                superNs = superNs.substring(0,superNs.length-prefix.length-1);
            }
            else{
                continue;
            }
        }
        if(ns.indexOf(superNs)==0){
            if(superNs.length>targetNs.length){
                targetNs = superNs;
            }
        }
    }
    if(targetNs){
        word = targetNs+"."+word;
    }
    return word;
}


/**
 * 从类代码总读取构造函数和成员变量实例化的初始值。
 */
function getSubRelyOnFromClass(text,ns, className) {
    if(!text){
        return;
    }
    text = text.substring(1,text.length-1);
    var list = [];
    var functMap = {};
    while (text.length > 0) {
        var index = CodeUtil.getBracketEndIndex(text);
        if (index == -1) {
            index = text.length;
        }
        var codeText = text.substring(0,index+1);
        text = text.substring(index+1);
        index = codeText.indexOf("{");

        if(index==-1){
            index = codeText.length;
        }
        var funcText = codeText.substring(index);
        codeText = codeText.substring(0,index);
        index = CodeUtil.getBracketStartIndex(codeText,"(",")");
        if(funcText&&index!=-1){
            codeText = codeText.substring(0,index);
            var word = CodeUtil.getLastWord(codeText);
            if(word=="constructor"){
                word = "__constructor";
            }
            functMap[word] = funcText;
        }
        findClassInLine(codeText,[className],ns,list,classNameToPath);
    }
    readSubRelyOnFromFunctionCode("__constructor",functMap,ns,className,list);
    for(var i=list.length- 1;i>=0;i--){
        var name = list[i];
        var path = classNameToPath[name];
        if(path){
            list[i] = path;
        }
        else{
            list.splice(i,1);
        }
    }
    path = classNameToPath[className];
    subRelyOnInfoList[path] = list;
}
/**
 * 从构造函数开始递归查询初始化时被引用过的类。
 */
function readSubRelyOnFromFunctionCode(funcName,functMap,ns,className,list){
    var text = functMap[funcName];
    if(!text)
        return;
    delete functMap[funcName];
    findClassInLine(text,[className],ns,list,classNameToPath);
    for (funcName in functMap){
        if(text.indexOf(funcName+"(")!=-1&&CodeUtil.containsVariable(funcName,text)){
            readSubRelyOnFromFunctionCode(funcName,functMap,ns,className,list);
        }
    }
}


/**
 * 从代码的静态变量中读取依赖关系
 */
function getRelyOnFromStatic(text,ns, className, relyOnList) {

    var newList = [];
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
        if(line.indexOf("new")==0){
            var code = CodeUtil.removeFirstVariable(line).trim();
            index = code.indexOf("(");
            if(index!=-1){
                code = code.substring(0,index);
            }
            code = CodeUtil.trimVariable(code);
            code = getFullClassName(code,ns);
            var path = classNameToPath[code];
            if(path&&code!=className&&newList.indexOf(path)==-1){
                newList.push(path);
            }
        }
        escapFunctionLines(line,[className],ns,relyOnList);
    }
    path = classNameToPath[className];
    newClassInfoList[path] = newList;
}

/**
 * 排除代码段里的全局函数块。
 */
function escapFunctionLines(text,classNames,ns,relyOnList){
    while(text.length>0){
        var index = CodeUtil.getFirstVariableIndex("function",text);
        if(index==-1){
            findClassInLine(text,classNames,ns,relyOnList,classNameToPath);
            break;
        }
        findClassInLine(text.substring(0,index),classNames,ns,relyOnList,classNameToPath);
        text = text.substring(index);
        index = CodeUtil.getBracketEndIndex(text);
        if(index==-1){
            break;
        }
        text = text.substring(index);
    }
}


function findClassInLine(text,classNames,ns,relyOnList,classNameToPath){
    var word = "";
    var length = text.length;
    for (var i = 0; i < length; i++) {
        var char = text.charAt(i);
        if (char <= "Z" && char >= "A" || char <= "z" && char >= "a" || char <= "9" && char >= "0" || char == "_" || char == "$"||char==".") {
            word += char;
        } else if(word){
            if(functionKeys.indexOf(word)==-1&&classNames.indexOf(word)==-1){
                var found = false;
                var names;
                if(word.indexOf(".")!=-1) {
                    names = word.split(".");
                }
                else{
                    names = [word];
                }
                var len = names.length;
                for(var j=0;j<len;j++){
                    if(j==0)
                        word = names[0];
                    else
                        word += "."+names[j];
                    var path = classNameToPath[word];
                    if(path&&typeof(path)=="string"&&classNames.indexOf(word)==-1){
                        found = true;
                        break;
                    }
                    if(ns){
                        word = ns+"."+word;
                        path = classNameToPath[word];
                        if(path&&typeof(path)=="string"&&classNames.indexOf(word)==-1){
                            found = true;
                            break;
                        }
                    }
                }
                if(found){
                    if (relyOnList.indexOf(word) == -1) {
                        relyOnList.push(word);
                    }
                }
            }
            word = "";
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
    var result = "\n";
    result += "    egret create_manifest [project_name] -all\n";
    result += "描述:\n";
    result += "    " + help_title();
    result += "参数说明:\n";
    result += "    -all     生成所有文件的清单,若不指定则只生成文档类有引用到的类清单";
    return result;
}

exports.run = run;
exports.create = create;
exports.getClassToPathInfo = getClassToPathInfo;
exports.getModuleReferenceInfo = getModuleReferenceInfo;
exports.getModuleReferenceList = getModuleReferenceList;
exports.help_title = help_title;
exports.help_example = help_example;