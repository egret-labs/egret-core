//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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
/**
* 判断一个字符串是否为合法变量名,第一个字符为字母,下划线或$开头，第二个字符开始为字母,下划线，数字或$
*/
function isVariableWord(word) {
    if (!word)
        return false;
    var char = word.charAt(0);
    if (!isVariableFirstChar(char)) {
        return false;
    }
    var length = word.length;
    for (var i = 1; i < length; i++) {
        char = word.charAt(i);
        if (!isVariableChar(char)) {
            return false;
        }
    }
    return true;
}

/**
* 是否为合法变量字符,字符为字母,下划线，数字或$
*/
function isVariableChar(char) {
    return (char <= "Z" && char >= "A" || char <= "z" && char >= "a" || char <= "9" && char >= "0" || char == "_" || char == "$");
}

/**
* 是否为合法变量字符串的第一个字符,字符为字母,下划线或$
*/
function isVariableFirstChar(char) {
    return (char <= "Z" && char >= "A" || char <= "z" && char >= "a" || char == "_" || char == "$");
}

/**
* 判断一段代码中是否含有某个变量字符串，且该字符串的前后都不是变量字符。
*/
function containsVariable(key, codeText) {
    var contains = false;
    while (codeText.length > 0) {
        var index = codeText.indexOf(key);
        if (index == -1)
            break;
        var lastChar = codeText.charAt(index + key.length);
        var firstChar = codeText.charAt(index - 1);
        if (!isVariableChar(firstChar) && !isVariableChar(lastChar)) {
            contains = true;
            break;
        } else {
            codeText = codeText.substring(index + key.length);
        }
    }
    return contains;
}

/**
* 获取第一个含有key关键字的起始索引，且该关键字的前后都不是变量字符。
*/
function getFirstVariableIndex(key, codeText) {
    var subLength = 0;
    while (codeText.length) {
        var index = codeText.indexOf(key);
        if (index == -1) {
            break;
        }
        var lastChar = codeText.charAt(index + key.length);
        var firstChar = codeText.charAt(index - 1);
        if (!isVariableChar(firstChar) && !isVariableChar(lastChar)) {
            return subLength + index;
        } else {
            subLength += index + key.length;
            codeText = codeText.substring(index + key.length);
        }
    }
    return -1;
}

/**
* 获取最后一个含有key关键字的起始索引，且该关键字的前后都不是变量字符。
*/
function getLastVariableIndex(key, codeText) {
    while (codeText.length) {
        var index = codeText.lastIndexOf(key);
        if (index == -1) {
            break;
        }
        var lastChar = codeText.charAt(index + key.length);
        var firstChar = codeText.charAt(index - 1);
        if (!isVariableChar(firstChar) && !isVariableChar(lastChar)) {
            return index;
        } else {
            codeText = codeText.substring(0, index);
        }
    }
    return -1;
}

/**
* 获取第一个词,遇到空白字符或 \n \r \t 后停止。
*/
function getFirstWord(str) {
    str = str.trim();
    var index = str.indexOf(" ");
    if (index == -1)
        index = Number.MAX_VALUE;
    var rIndex = str.indexOf("\r");
    if (rIndex == -1)
        rIndex = Number.MAX_VALUE;
    var nIndex = str.indexOf("\n");
    if (nIndex == -1)
        nIndex = Number.MAX_VALUE;
    var tIndex = str.indexOf("\t");
    if (tIndex == -1)
        tIndex = Number.MAX_VALUE;
    index = Math.min(index, rIndex, nIndex, tIndex);
    str = str.substr(0, index);
    return str.trim();
}

/**
* 移除第一个词
* @param str 要处理的字符串
* @param word 要移除的词，若不传入则自动获取。
*/
function removeFirstWord(str, word) {
    if (typeof word === "undefined") { word = ""; }
    if (!word) {
        word = getFirstWord(str);
    }
    var index = str.indexOf(word);
    if (index == -1)
        return str;
    return str.substring(index + word.length);
}

/**
* 获取最后一个词,遇到空白字符或 \n \r \t 后停止。
*/
function getLastWord(str) {
    str = str.trim();
    var index = str.lastIndexOf(" ");
    var rIndex = str.lastIndexOf("\r");
    var nIndex = str.lastIndexOf("\n");
    var tIndex = str.indexOf("\t");
    index = Math.max(index, rIndex, nIndex, tIndex);
    str = str.substring(index + 1);
    return str.trim();
}

/**
* 移除最后一个词
* @param str 要处理的字符串
* @param word 要移除的词，若不传入则自动获取。
*/
function removeLastWord(str, word) {
    if (typeof word === "undefined") { word = ""; }
    if (!word) {
        word = getLastWord(str);
    }
    var index = str.lastIndexOf(word);
    if (index == -1)
        return str;
    return str.substring(0, index);
}

/**
* 获取字符串起始的第一个变量，返回的字符串两端均没有空白。若第一个非空白字符就不是合法变量字符，则返回空字符串。
*/
function getFirstVariable(str) {
    str = str.trim();
    var word = "";
    var length = str.length;
    for (var i = 0; i < length; i++) {
        var char = str.charAt(i);
        if (isVariableChar(char)) {
            word += char;
        } else {
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
function removeFirstVariable(str, word) {
    if (typeof word === "undefined") { word = ""; }
    if (!word) {
        word = getFirstVariable(str);
    }
    var index = str.indexOf(word);
    if (index == -1)
        return str;
    return str.substring(index + word.length);
}

/**
* 获取字符串末尾的最后一个变量,返回的字符串两端均没有空白。若最后一个非空白字符就不是合法变量字符，则返回空字符串。
*/
function getLastVariable(str) {
    str = str.trim();
    var word = "";
    for (var i = str.length - 1; i >= 0; i--) {
        var char = str.charAt(i);
        if (isVariableChar(char)) {
            word = char + word;
        } else {
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
function removeLastVariable(str, word) {
    if (typeof word === "undefined") { word = ""; }
    if (!word) {
        word = getLastVariable(str);
    }
    var index = str.lastIndexOf(word);
    if (index == -1)
        return str;
    return str.substring(0, index);
}

/**
* 获取一对括号的结束点,例如"class A{ function B(){} } class",返回24,若查找失败，返回-1。
*/
function getBracketEndIndex(codeText, left, right) {
    if (typeof left === "undefined") { left = "{"; }
    if (typeof right === "undefined") { right = "}"; }
    var indent = 0;
    var text = "";
    while (codeText.length > 0) {
        var index = codeText.indexOf(left);
        if (index == -1)
            index = Number.MAX_VALUE;
        var endIndex = codeText.indexOf(right);
        if (endIndex == -1)
            endIndex = Number.MAX_VALUE;
        index = Math.min(index, endIndex);
        if (index == Number.MAX_VALUE) {
            return -1;
        }
        text += codeText.substring(0, index + 1);
        codeText = codeText.substring(index + 1);
        if (index == endIndex)
            indent--;
        else
            indent++;
        if (indent == 0) {
            break;
        }
        if (codeText.length == 0)
            return -1;
    }
    return text.length - 1;
}

/**
* 从后往前搜索，获取一对括号的起始点,例如"class A{ function B(){} } class",返回7，若查找失败，返回-1。
*/
function getBracketStartIndex(codeText, left, right) {
    if (typeof left === "undefined") { left = "{"; }
    if (typeof right === "undefined") { right = "}"; }
    var indent = 0;
    while (codeText.length > 0) {
        var index = codeText.lastIndexOf(left);
        var endIndex = codeText.lastIndexOf(right);
        index = Math.max(index, endIndex);
        if (index == -1) {
            return -1;
        }
        codeText = codeText.substring(0, index);
        if (index == endIndex)
            indent++;
        else
            indent--;
        if (indent == 0) {
            break;
        }
        if (codeText.length == 0)
            return -1;
    }
    return codeText.length;
}

/**
* 去掉字符串两端所有连续的非变量字符。
* @param str 要格式化的字符串
*/
function trimVariable(str) {
    return trimVariableLeft(trimVariableRight(str));
}

/**
* 去除字符串左边所有连续的非变量字符。
* @param str 要格式化的字符串
*/
function trimVariableLeft(str) {
    if (!str)
        return "";
    var char = str.charAt(0);
    while (str.length > 0 && !isVariableFirstChar(char)) {
        str = str.substr(1);
        char = str.charAt(0);
    }
    return str;
}

/**
* 去除字符串右边所有连续的非变量字符。
* @param str 要格式化的字符串
*/
function trimVariableRight(str) {
    if (!str)
        return "";
    var char = str.charAt(str.length - 1);
    while (str.length > 0 && !isVariableChar(char)) {
        str = str.substr(0, str.length - 1);
        char = str.charAt(str.length - 1);
    }
    return str;
}

var removeCommentCache = {};
/**
* 移除代码注释和字符串常量
*/
function removeComment(codeText,path) {

    if(path&&removeCommentCache[path]){
        return removeCommentCache[path];
    }
    //performance optimize
//    var result = codeText.replace(/(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)/g, '\n').replace(/(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g, '\n');
//    return result;

    var NBSP = "";
    var trimText = "";

    codeText = codeText.split("\\\\").join("\v0\v");
    codeText = codeText.split("\\\"").join("\v1\v");
    codeText = codeText.split("\\\'").join("\v2\v");
    codeText = codeText.split("\r\n").join("\n").split("\r").join("\n");
    while (codeText.length > 0) {
        var quoteIndex = codeText.indexOf("\"");
        if (quoteIndex == -1)
            quoteIndex = Number.MAX_VALUE;
        var squoteIndex = codeText.indexOf("'");
        if (squoteIndex == -1)
            squoteIndex = Number.MAX_VALUE;
        var commentIndex = codeText.indexOf("/*");
        if (commentIndex == -1)
            commentIndex = Number.MAX_VALUE;
        var lineCommonentIndex = codeText.indexOf("//");
        if (lineCommonentIndex == -1)
            lineCommonentIndex = Number.MAX_VALUE;
        var index = Math.min(quoteIndex, squoteIndex, commentIndex, lineCommonentIndex);
        if (index == Number.MAX_VALUE) {
            trimText += codeText;
            break;
        }
        trimText += codeText.substring(0, index) + NBSP;
        codeText = codeText.substring(index);
        switch (index) {
            case quoteIndex:
                codeText = codeText.substring(1);
                index = codeText.indexOf("\"");
                if (index == -1)
                    index = codeText.length - 1;
                codeText = codeText.substring(index + 1);
                break;
            case squoteIndex:
                codeText = codeText.substring(1);
                index = codeText.indexOf("'");
                if (index == -1)
                    index = codeText.length - 1;
                codeText = codeText.substring(index + 1);
                break;
            case commentIndex:
                index = codeText.indexOf("*/");
                if (index == -1)
                    index = codeText.length - 1;
                codeText = codeText.substring(index + 2);
                break;
            case lineCommonentIndex:
                index = codeText.indexOf("\n");
                if (index == -1)
                    index = codeText.length - 1;
                codeText = codeText.substring(index);
                break;
        }
    }
    codeText = trimText.split("\v0\v").join("\\\\");
    codeText = codeText.split("\v1\v").join("\\\"");
    codeText = codeText.split("\v2\v").join("\\\'");
    if(path){
        removeCommentCache[path] = codeText;
    }
    return codeText;
}

/**
 * 移除代码注释不移除字符串常量
 */
function removeCommentExceptQuote(codeText) {

    var NBSP = "";
    var trimText = "";

    codeText = codeText.split("\\\\").join("\v0\v");
    codeText = codeText.split("\\\"").join("\v1\v");
    codeText = codeText.split("\\\'").join("\v2\v");
    codeText = codeText.split("\r\n").join("\n").split("\r").join("\n");
    while (codeText.length > 0) {
        var quoteIndex = codeText.indexOf("\"");
        if (quoteIndex == -1)
            quoteIndex = Number.MAX_VALUE;
        var squoteIndex = codeText.indexOf("'");
        if (squoteIndex == -1)
            squoteIndex = Number.MAX_VALUE;
        var commentIndex = codeText.indexOf("/*");
        if (commentIndex == -1)
            commentIndex = Number.MAX_VALUE;
        var lineCommonentIndex = codeText.indexOf("//");
        if (lineCommonentIndex == -1)
            lineCommonentIndex = Number.MAX_VALUE;
        var index = Math.min(quoteIndex, squoteIndex, commentIndex, lineCommonentIndex);
        if (index == Number.MAX_VALUE) {
            trimText += codeText;
            break;
        }
        trimText += codeText.substring(0, index) + NBSP;
        codeText = codeText.substring(index);
        switch (index) {
            case quoteIndex:
                codeText = codeText.substring(1);
                index = codeText.indexOf("\"");
                if (index == -1)
                    index = codeText.length - 1;
                trimText += codeText.substring(0,index + 1)
                codeText = codeText.substring(index + 1);
                break;
            case squoteIndex:
                codeText = codeText.substring(1);
                index = codeText.indexOf("'");
                if (index == -1)
                    index = codeText.length - 1;
                trimText += codeText.substring(0,index + 1)
                codeText = codeText.substring(index + 1);
                break;
            case commentIndex:
                index = codeText.indexOf("*/");
                if (index == -1)
                    index = codeText.length - 1;
                codeText = codeText.substring(index + 2);
                break;
            case lineCommonentIndex:
                index = codeText.indexOf("\n");
                if (index == -1)
                    index = codeText.length - 1;
                codeText = codeText.substring(index);
                break;
        }
    }
    codeText = trimText.split("\v0\v").join("\\\\");
    codeText = codeText.split("\v1\v").join("\\\"");
    codeText = codeText.split("\v2\v").join("\\\'");
    return codeText;
}

exports.isVariableWord = isVariableWord;
exports.isVariableChar = isVariableChar;
exports.isVariableFirstChar = isVariableFirstChar;
exports.containsVariable = containsVariable;
exports.getFirstVariableIndex = getFirstVariableIndex;
exports.getLastVariableIndex = getLastVariableIndex;
exports.getFirstWord = getFirstWord;
exports.removeFirstWord = removeFirstWord;
exports.getLastWord = getLastWord;
exports.removeLastWord = removeLastWord;
exports.getFirstVariable = getFirstVariable;
exports.removeFirstVariable = removeFirstVariable;
exports.getLastVariable = getLastVariable;
exports.removeLastVariable = removeLastVariable;
exports.getBracketEndIndex = getBracketEndIndex;
exports.getBracketStartIndex = getBracketStartIndex;
exports.trimVariable = trimVariable;
exports.trimVariableLeft = trimVariableLeft;
exports.trimVariableRight = trimVariableRight;
exports.removeComment = removeComment;
exports.removeCommentExceptQuote = removeCommentExceptQuote;