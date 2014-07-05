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
 * 键为文件路径，值为这个文件包含的类名列表
 */
var pathToClassNames;
/**
 * 键为文件路径，值为这个文件依赖的类名列表(从import或全局变量中读取的)
 */
var pathInfoList;
/**
 * ts关键字
 */
var functionKeys = ["static", "var", "export", "public", "private", "function", "get", "set", "class", "interface"];
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
 * 获取项目中所有类名和文件路径的映射数据
 */
function getClassToPathInfo(srcPath){

    if(!classNameToPath){
        create(srcPath);
    }
    return classNameToPath;
}

/**
 * 创建manifest列表
 */
function create(srcPath){
    classInfoList = {};
    classNameToPath = {};
    pathInfoList = {};
    pathToClassNames = {};
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
    var manifest = sortFileList(manifest,srcPath);
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
    srcPath = srcPath.split("\\").join("/");
    if (srcPath.charAt(srcPath.length - 1) != "/") {
        srcPath += "/";
    }

    var length = list.length;
    for (var i = 0; i < length; i++) {
        var path = list[i];
        var ext = file.getExtension(path).toLowerCase();
        if(ext=="exml"){
            readClassNamesFromExml(path,srcPath);
        }
        else{
            readClassNamesFromTs(path);
        }
    }
    for (var path in pathInfoList) {
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

    var pathLevelInfo = {};
    for (path in pathInfoList) {
        setPathLevel(path, 0, pathLevelInfo, [path]);
    }
    var pathList = [];
    for (path in pathLevelInfo) {
        var level = pathLevelInfo[path];
        if (pathList[level]) {
            pathList[level].push(path);
        } else {
            pathList[level] = [path];
        }
    }
    var gameList = [];
    for (var key in pathList) {
        list = pathList[key];
        list.sort();
        gameList = list.concat(gameList);
    }
    return gameList;
}
/**
 * 设置文件引用深度
 */
function setPathLevel(path, level, pathLevelInfo, map) {
    if (pathLevelInfo[path] == null) {
        pathLevelInfo[path] = level;
    } else {
        pathLevelInfo[path] = Math.max(pathLevelInfo[path], level);
    }
    var list = pathInfoList[path];
    var length = list.length;
    for (var i = 0; i < length; i++) {
        var relyPath = list[i];
        if (map.indexOf(relyPath) != -1) {
            globals.exit(1103, path);
        }
        setPathLevel(relyPath, level + 1, pathLevelInfo, map.concat(relyPath));
    }
}
/**
 * 读取一个exml文件引用的类列表
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
    var fileRelyOnList = [];
    var text = file.read(path);
    var list = [];
    text = CodeUtil.removeComment(text);
    text = removeInterface(text);
    readRelyOnFromImport(text, fileRelyOnList);
    var block = "";
    var tsText = "";
    while (text.length > 0) {
        var index = text.indexOf("{");
        if (index == -1) {
            if (tsText) {
                list = list.concat(readClassFromBlock(tsText, fileRelyOnList));
                tsText = "";
            }
            list = list.concat(readClassFromBlock(text, fileRelyOnList));
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
                    list = list.concat(readClassFromBlock(tsText, fileRelyOnList));
                    tsText = "";
                }
                list = list.concat(readClassFromBlock(block, fileRelyOnList, ns));
            } else {
                tsText += "{" + block + "}";
            }
        }
    }
    if (tsText) {
        list = list.concat(readClassFromBlock(tsText, fileRelyOnList));
    }
    var length = list.length;
    for (var i = 0; i < length; i++) {
        var className = list[i];
        classNameToPath[className] = path;
    }
    pathToClassNames[path] = list;
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
 * 移除代码中的接口定义
 */
function removeInterface(text) {
    var tsText = "";
    while (text.length > 0) {
        var index = CodeUtil.getFirstVariableIndex("interface", text);
        if (index == -1) {
            tsText += text;
            break;
        }
        tsText += text.substring(0, index);
        text = text.substring(index);
        index = CodeUtil.getBracketEndIndex(text);
        text = text.substring(index + 1);
    }
    return tsText;
}
/**
 * 从代码块中分析引用关系，代码块为一个Module，或类外的一段全局函数定义
 */
function readClassFromBlock(text, fileRelyOnList, ns) {
    if (typeof ns === "undefined") { ns = ""; }
    var list = [];

    while (text.length > 0) {
        var index = CodeUtil.getFirstVariableIndex("class", text);
        if (index == -1) {
            getRelyOnFromVar(text, ns, fileRelyOnList);
            break;
        }

        var preStr = text.substring(0, index + 5);
        getRelyOnFromVar(preStr, ns, fileRelyOnList);

        text = text.substring(index + 5);
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
                if (ns && word.indexOf(".") == -1) {
                    word = ns + "." + word;
                }
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
        getRelyOnFromStatic(classBlock, ns, relyOnList);
    }
    return list;
}
/**
 * 从类外部的var变量列表中分析引用关系
 */
function getRelyOnFromVar(text, ns, relyOnList) {
    while (text.length > 0) {
        var index = CodeUtil.getFirstVariableIndex("new", text);
        if (index == -1) {
            break;
        }
        text = text.substring(index + 3).trim();
        var word = getClass(text, ns);
        if (word && relyOnList.indexOf(word) == -1) {
            relyOnList.push(word);
        }
    }
}
/**
 * 获取变量的类型
 */
function getClass(text, ns) {
    var word = CodeUtil.getFirstWord(text);
    var index = word.indexOf("(");
    if (index != -1) {
        word = word.substring(0, index);
    }
    word = CodeUtil.trimVariable(word);
    if (word.indexOf("Array<") == 0) {
        return "";
    }
    if (ns && word.indexOf(".") == -1) {
        word = ns + "." + word;
    }
    return word;
}
/**
 * 从代码的静态变量中读取依赖关系
 */
function getRelyOnFromStatic(text, ns, relyOnList) {
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
        var word = CodeUtil.getFirstVariable(text);
        if (word != "new") {
            continue;
        }
        text = CodeUtil.removeFirstVariable(text);
        word = getClass(text, ns);
        if (word && relyOnList.indexOf(word) == -1) {
            relyOnList.push(word);
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
exports.removeInterface = removeInterface;
exports.getClassToPathInfo = getClassToPathInfo;
exports.help_title = help_title;
exports.help_example = help_example;