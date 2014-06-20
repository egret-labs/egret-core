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
/// <reference path="../exml/node.d.ts"/>
var fs = require("fs");
var CodeUtil = require("../core/code_util.js");
var libs = require("../core/normal_libs");

var classInfoList = {};
var classNameToPath = {};
var pathToClassName = {};
var pathInfoList = {};
var functionKeys = ["static", "var", "export", "public", "private", "function", "get", "set", "class", "interface"];

function create(srcPath) {
    srcPath = srcPath.split("\\").join("/");
    if (srcPath.charAt(srcPath.length - 1) != "/") {
        srcPath += "/";
    }
    var list = [];
    search(srcPath, list);
    var length = list.length;
    for (var i = 0; i < length; i++) {
        var path = list[i];
        readClassNames(path);
    }
    for (var path in pathInfoList) {
        var list = pathInfoList[path];
        var classList = pathToClassName[path];
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

    length = gameList.length;
    for (i = 0; i < length; i++) {
        path = gameList[i];
        path = path.substring(srcPath.length, path.length - 2) + "js";
        gameList[i] = "    \"" + path + "\"";
    }
    var gameListText = "var game_file_list = [\n" + gameList.join(",\n") + "\n];";
    return gameListText;
}

exports.create = create;

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
            libs.exit(1103, path);
        }
        setPathLevel(relyPath, level + 1, pathLevelInfo, map.concat(relyPath));
    }
}

function search(filePath, list) {
    var files = fs.readdirSync(filePath);
    var length = files.length;
    for (var i = 0; i < length; i++) {
        var path = filePath + files[i];
        var stat = fs.statSync(path);
        if (path.charAt(0) == "." || path.indexOf(".d.ts") != -1) {
            continue;
        }
        if (stat.isDirectory()) {
            search(path + "/", list);
        } else {
            var index = path.lastIndexOf(".");
            if (index != -1) {
                if (path.substring(index).toLowerCase() == ".ts") {
                    list.push(path);
                }
            }
        }
    }
}

/**
* 读取文件里的类名和全局函数名。
*/
function readClassNames(path) {
    var fileRelyOnList = [];
    var text = fs.readFileSync(path, "utf-8");
    var list = [];
    text = CodeUtil.removeComment(text);
    text = removeInterface(text);
    if (!CodeUtil.containsVariable("class", text) && !CodeUtil.containsVariable("var", text) && !CodeUtil.containsVariable("function", text)) {
        return;
    }
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
    pathToClassName[path] = list;
    pathInfoList[path] = fileRelyOnList;
}

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

function getClass(text, ns) {
    var word = CodeUtil.getFirstWord(text);
    var index = word.indexOf("(");
    if (index != -1) {
        word = word.substring(0, index);
    }
    word = CodeUtil.trimVariable(word);
    if (word.indexOf("Array") != -1) {
        return "";
    }
    if (ns && word.indexOf(".") == -1) {
        word = ns + "." + word;
    }
    return word;
}

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
//# sourceMappingURL=create_file_list.js.map
