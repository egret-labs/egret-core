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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var FS = require("fs");
var Path = require("path");
var charset = "utf-8";
/**
 * 保存数据到指定文件
 * @param path 文件完整路径名
 * @param data 要保存的数据
 */
function save(path, data) {
    if (exists(path)) {
        remove(path);
    }
    path = escapePath(path);
    textTemp[path] = data;
    createDirectory(Path.dirname(path));
    FS.writeFileSync(path, data, { encoding: charset });
}
exports.save = save;
function writeFileAsync(path, content, charset) {
    return new Promise(function (resolve, reject) {
        FS.writeFile(path, content, { encoding: charset }, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve(true);
            }
        });
    });
}
exports.writeFileAsync = writeFileAsync;
/**
 * 创建文件夹
 */
function createDirectory(path, mode, made) {
    path = escapePath(path);
    if (mode === undefined) {
        mode = 511 & (~process.umask());
    }
    if (!made)
        made = null;
    if (typeof mode === 'string')
        mode = parseInt(mode, 8);
    path = Path.resolve(path);
    try {
        FS.mkdirSync(path, mode);
        made = made || path;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT':
                made = createDirectory(Path.dirname(path), mode, made);
                createDirectory(path, mode, made);
                break;
            default:
                var stat;
                try {
                    stat = FS.statSync(path);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory())
                    throw err0;
                break;
        }
    }
    return made;
}
exports.createDirectory = createDirectory;
var textTemp = {};
/**
 * 读取文本文件,返回打开文本的字符串内容，若失败，返回"".
 * @param path 要打开的文件路径
 */
function read(path, ignoreCache) {
    if (ignoreCache === void 0) { ignoreCache = false; }
    path = escapePath(path);
    var text = textTemp[path];
    if (text && !ignoreCache) {
        return text;
    }
    try {
        text = FS.readFileSync(path, charset);
        text = text.replace(/^\uFEFF/, '');
    }
    catch (err0) {
        return "";
    }
    if (text) {
        var ext = getExtension(path).toLowerCase();
        if (ext == "ts" || ext == "exml") {
            textTemp[path] = text;
        }
    }
    return text;
}
exports.read = read;
function readFileAsync(path, charset) {
    return new Promise(function (resolve, reject) {
        FS.readFile(path, charset, function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });
}
exports.readFileAsync = readFileAsync;
/**
 * 读取字节流文件,返回字节流，若失败，返回null.
 * @param path 要打开的文件路径
 */
function readBinary(path) {
    path = escapePath(path);
    try {
        var binary = FS.readFileSync(path);
    }
    catch (e) {
        return null;
    }
    return binary;
}
exports.readBinary = readBinary;
/**
 * 复制文件或目录
 * @param source 文件源路径
 * @param dest 文件要复制到的目标路径
 */
function copy(source, dest) {
    source = escapePath(source);
    dest = escapePath(dest);
    var stat = FS.lstatSync(source);
    if (stat.isDirectory()) {
        _copy_dir(source, dest);
    }
    else {
        _copy_file(source, dest);
    }
}
exports.copy = copy;
function isDirectory(path) {
    path = escapePath(path);
    try {
        var stat = FS.statSync(path);
    }
    catch (e) {
        return false;
    }
    return stat.isDirectory();
}
exports.isDirectory = isDirectory;
function isSymbolicLink(path) {
    path = escapePath(path);
    try {
        var stat = FS.statSync(path);
    }
    catch (e) {
        return false;
    }
    return stat.isSymbolicLink();
}
exports.isSymbolicLink = isSymbolicLink;
function isFile(path) {
    path = escapePath(path);
    try {
        var stat = FS.statSync(path);
    }
    catch (e) {
        return false;
    }
    return stat.isFile();
}
exports.isFile = isFile;
function _copy_file(source_file, output_file) {
    createDirectory(Path.dirname(output_file));
    var byteArray = FS.readFileSync(source_file);
    FS.writeFileSync(output_file, byteArray);
}
function _copy_dir(sourceDir, outputDir) {
    createDirectory(outputDir);
    var list = readdirSync(sourceDir);
    list.forEach(function (fileName) {
        copy(Path.join(sourceDir, fileName), Path.join(outputDir, fileName));
    });
}
/**
 * 删除文件或目录
 * @param path 要删除的文件源路径
 */
function remove(path) {
    path = escapePath(path);
    try {
        FS.lstatSync(path).isDirectory()
            ? rmdir(path)
            : FS.unlinkSync(path);
        getDirectoryListing(path);
    }
    catch (e) {
    }
}
exports.remove = remove;
function rmdir(path) {
    var files = [];
    if (FS.existsSync(path)) {
        files = readdirSync(path);
        files.forEach(function (file) {
            var curPath = path + "/" + file;
            if (FS.statSync(curPath).isDirectory()) {
                rmdir(curPath);
            }
            else {
                FS.unlinkSync(curPath);
            }
        });
        FS.rmdirSync(path);
    }
}
function rename(oldPath, newPath) {
    if (isDirectory(oldPath)) {
        FS.renameSync(oldPath, newPath);
    }
}
exports.rename = rename;
/**
 * 返回指定文件的父级文件夹路径,返回字符串的结尾已包含分隔符。
 */
function getDirectory(path) {
    path = escapePath(path);
    return Path.dirname(path) + "/";
}
exports.getDirectory = getDirectory;
/**
 * 获得路径的扩展名,不包含点字符。
 */
function getExtension(path) {
    path = escapePath(path);
    var index = path.lastIndexOf(".");
    if (index == -1)
        return "";
    var i = path.lastIndexOf("/");
    if (i > index)
        return "";
    return path.substring(index + 1);
}
exports.getExtension = getExtension;
/**
 * 获取路径的文件名(不含扩展名)或文件夹名
 */
function getFileName(path) {
    if (!path)
        return "";
    path = escapePath(path);
    var startIndex = path.lastIndexOf("/");
    var endIndex;
    if (startIndex > 0 && startIndex == path.length - 1) {
        path = path.substring(0, path.length - 1);
        startIndex = path.lastIndexOf("/");
        endIndex = path.length;
        return path.substring(startIndex + 1, endIndex);
    }
    endIndex = path.lastIndexOf(".");
    if (endIndex == -1 || isDirectory(path))
        endIndex = path.length;
    return path.substring(startIndex + 1, endIndex);
}
exports.getFileName = getFileName;
/**
 * 获取指定文件夹下的文件或文件夹列表，不包含子文件夹内的文件。
 * @param path 要搜索的文件夹
 * @param relative 是否返回相对路径，若不传入或传入false，都返回绝对路径。
 */
function getDirectoryListing(path, relative) {
    if (relative === void 0) { relative = false; }
    path = escapePath(path);
    try {
        var list = readdirSync(path);
    }
    catch (e) {
        return [];
    }
    var length = list.length;
    if (!relative) {
        for (var i = length - 1; i >= 0; i--) {
            if (list[i].charAt(0) == ".") {
                list.splice(i, 1);
            }
            else {
                list[i] = joinPath(path, list[i]);
            }
        }
    }
    else {
        for (i = length - 1; i >= 0; i--) {
            if (list[i].charAt(0) == ".") {
                list.splice(i, 1);
            }
        }
    }
    return list;
}
exports.getDirectoryListing = getDirectoryListing;
/**
 * 获取指定文件夹下全部的文件列表，包括子文件夹
 * @param path
 * @returns {any}
 */
function getDirectoryAllListing(path) {
    var list = [];
    if (isDirectory(path)) {
        var fileList = getDirectoryListing(path);
        for (var key in fileList) {
            list = list.concat(getDirectoryAllListing(fileList[key]));
        }
        return list;
    }
    return [path];
}
exports.getDirectoryAllListing = getDirectoryAllListing;
/**
 * 使用指定扩展名搜索文件夹及其子文件夹下所有的文件
 * @param dir 要搜索的文件夹
 * @param extension 要搜索的文件扩展名,不包含点字符，例如："png"。不设置表示获取所有类型文件。
 */
function search(dir, extension) {
    var list = [];
    try {
        var stat = FS.statSync(dir);
    }
    catch (e) {
        return list;
    }
    if (stat.isDirectory()) {
        findFiles(dir, list, extension, null);
    }
    return list;
}
exports.search = search;
/**
 * 使用过滤函数搜索文件夹及其子文件夹下所有的文件
 * @param dir 要搜索的文件夹
 * @param filterFunc 过滤函数：filterFunc(file:File):Boolean,参数为遍历过程中的每一个文件，返回true则加入结果列表
 */
function searchByFunction(dir, filterFunc, checkDir) {
    var list = [];
    try {
        var stat = FS.statSync(dir);
    }
    catch (e) {
        return list;
    }
    if (stat.isDirectory()) {
        findFiles(dir, list, "", filterFunc, checkDir);
    }
    return list;
}
exports.searchByFunction = searchByFunction;
function readdirSync(filePath) {
    var files = FS.readdirSync(filePath);
    files.sort();
    return files;
}
function findFiles(filePath, list, extension, filterFunc, checkDir) {
    var files = readdirSync(filePath);
    var length = files.length;
    for (var i = 0; i < length; i++) {
        if (files[i].charAt(0) == ".") {
            continue;
        }
        var path = joinPath(filePath, files[i]);
        var exists_1 = FS.existsSync(path);
        if (!exists_1) {
            continue;
        }
        var stat = FS.statSync(path);
        if (stat.isDirectory()) {
            if (checkDir) {
                if (!filterFunc(path)) {
                    continue;
                }
            }
            findFiles(path, list, extension, filterFunc);
        }
        else if (filterFunc != null) {
            if (filterFunc(path)) {
                list.push(path);
            }
        }
        else if (extension) {
            var len = extension.length;
            if (path.charAt(path.length - len - 1) == "." &&
                path.substr(path.length - len, len).toLowerCase() == extension) {
                list.push(path);
            }
        }
        else {
            list.push(path);
        }
    }
}
/**
 * 指定路径的文件或文件夹是否存在
 */
function exists(path) {
    path = escapePath(path);
    return FS.existsSync(path);
}
exports.exists = exists;
/**
 * 转换本机路径为Unix风格路径。
 */
function escapePath(path) {
    if (!path)
        return "";
    return path.split("\\").join("/");
}
exports.escapePath = escapePath;
/**
 * 连接路径,支持传入多于两个的参数。也支持"../"相对路径解析。返回的分隔符为Unix风格。
 */
function joinPath(dir) {
    var filename = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        filename[_i - 1] = arguments[_i];
    }
    var path = Path.join.apply(null, arguments);
    path = escapePath(path);
    return path;
}
exports.joinPath = joinPath;
function getRelativePath(dir, filename) {
    var relative = Path.relative(dir, filename);
    return escapePath(relative);
    ;
}
exports.getRelativePath = getRelativePath;
function basename(p, ext) {
    var path = Path.basename.apply(null, arguments);
    path = escapePath(path);
    return path;
}
exports.basename = basename;
//获取相对路径 to相对于from的路径
function relative(from, to) {
    var path = Path.relative.apply(null, arguments);
    path = escapePath(path);
    return path;
}
exports.relative = relative;
function getAbsolutePath(path) {
    if (Path.isAbsolute(path)) {
        return escapePath(path);
    }
    return joinPath(egret.args.projectDir, path);
}
exports.getAbsolutePath = getAbsolutePath;
function searchPath(searchPaths) {
    for (var _i = 0, searchPaths_1 = searchPaths; _i < searchPaths_1.length; _i++) {
        var searchPath_1 = searchPaths_1[_i];
        if (exists(searchPath_1)) {
            return searchPath_1;
        }
    }
    return null;
}
exports.searchPath = searchPath;
function moveAsync(oldPath, newPath) {
    return new Promise(function (resolve, reject) {
        copy(oldPath, newPath);
        remove(oldPath);
        return resolve();
    });
}
exports.moveAsync = moveAsync;
function existsSync(path) {
    return FS.existsSync(path);
}
exports.existsSync = existsSync;
function existsAsync(path) {
    return new Promise(function (resolve, reject) {
        FS.exists(path, function (isExist) {
            return resolve(isExist);
        });
    });
}
exports.existsAsync = existsAsync;
function copyAsync(src, dest) {
    return new Promise(function (resolve, reject) {
        copy(src, dest);
        return resolve();
    });
}
exports.copyAsync = copyAsync;
function removeAsync(dir) {
    return new Promise(function (resolve, reject) {
        remove(dir);
        return resolve();
    });
}
exports.removeAsync = removeAsync;
function readFileSync(filename, encoding) {
    return FS.readFileSync(filename, encoding);
}
exports.readFileSync = readFileSync;
function readJSONAsync(file, options) {
    return new Promise(function (resolve, reject) {
        FS.readFile(file, options, function (err, data) {
            if (err) {
                return reject(err);
            }
            else {
                try {
                    var retObj = JSON.parse(data);
                    return resolve(retObj);
                }
                catch (err) {
                    return reject(err);
                }
            }
        });
    });
}
exports.readJSONAsync = readJSONAsync;
function readJSONSync(file, options) {
    return __awaiter(this, void 0, void 0, function () {
        var ret;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readJSONAsync(file, options)];
                case 1:
                    ret = _a.sent();
                    return [2 /*return*/, ret];
            }
        });
    });
}
exports.readJSONSync = readJSONSync;
function statSync(path) {
    return FS.statSync(path);
}
exports.statSync = statSync;
function writeJSONAsync(file, object) {
    return new Promise(function (resolve, reject) {
        try {
            var retObj = JSON.stringify(object, null, 4);
            FS.writeFile(file, retObj, { encoding: "utf-8" }, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        }
        catch (err) {
            return reject(err);
        }
    });
}
exports.writeJSONAsync = writeJSONAsync;
