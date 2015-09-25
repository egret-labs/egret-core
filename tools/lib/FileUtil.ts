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

/// <reference path="node.d.ts"/>

import FS = require("fs");
import Path = require("path");

var charset = "utf-8";

/**
 * 保存数据到指定文件
 * @param path 文件完整路径名
 * @param data 要保存的数据
 */
export function save(path:string, data:any):void {
    if (exists(path)) {
        remove(path);
    }
    path = escapePath(path);
    textTemp[path] = data;
    createDirectory(Path.dirname(path));
    FS.writeFileSync(path, data, charset);
}
/**
 * 创建文件夹
 */
export function createDirectory(path:string, mode?:any, made?:any):void {
    path = escapePath(path);
    if (mode === undefined) {
        mode = 511 & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string')
        mode = parseInt(mode, 8);
    path = Path.resolve(path);

    try {
        FS.mkdirSync(path, mode);
        made = made || path;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
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
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }
    return made;
}

var textTemp = {};
/**
 * 读取文本文件,返回打开文本的字符串内容，若失败，返回"".
 * @param path 要打开的文件路径
 */
export function read(path:string,ignoreCache = false):string {
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

/**
 * 读取字节流文件,返回字节流，若失败，返回null.
 * @param path 要打开的文件路径
 */
export function readBinary(path:string):any {
    path = escapePath(path);
    try {
        var binary = FS.readFileSync(path);
    }
    catch (e) {
        return null;
    }
    return binary;
}

/**
 * 复制文件或目录
 * @param source 文件源路径
 * @param dest 文件要复制到的目标路径
 */
export function copy(source:string, dest:string):void {
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

export function isDirectory(path:string):boolean {
    path = escapePath(path);
    try {
        var stat = FS.statSync(path);
    }
    catch (e) {
        return false;
    }
    return stat.isDirectory();
}

export function isSymbolicLink(path:string):boolean {
    path = escapePath(path);
    try {
        var stat = FS.statSync(path);
    }
    catch (e) {
        return false;
    }
    return stat.isSymbolicLink();
}

export function isFile(path:string):boolean {
    path = escapePath(path);
    try {
        var stat = FS.statSync(path);
    }
    catch (e) {
        return false;
    }
    return stat.isFile();
}

function _copy_file(source_file, output_file) {
    createDirectory(Path.dirname(output_file))
    var byteArray = FS.readFileSync(source_file);
    FS.writeFileSync(output_file, byteArray);
}

function _copy_dir(sourceDir, outputDir) {
    createDirectory(outputDir);
    var list = FS.readdirSync(sourceDir);
    list.forEach(function (fileName) {
        copy(Path.join(sourceDir, fileName), Path.join(outputDir, fileName));
    });
}

/**
 * 删除文件或目录
 * @param path 要删除的文件源路径
 */
export function remove(path:string):void {
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

function rmdir(path) {
    var files = [];
    if (FS.existsSync(path)) {
        files = FS.readdirSync(path);
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

export function rename(oldPath, newPath) {
    if (isDirectory(oldPath)) {
        FS.renameSync(oldPath, newPath);
    }
}

/**
 * 返回指定文件的父级文件夹路径,返回字符串的结尾已包含分隔符。
 */
export function getDirectory(path:string):string {
    path = escapePath(path);
    return Path.dirname(path) + "/";
}

/**
 * 获得路径的扩展名,不包含点字符。
 */
export function getExtension(path:string):string {
    path = escapePath(path);
    var index = path.lastIndexOf(".");
    if (index == -1)
        return "";
    var i = path.lastIndexOf("/");
    if (i > index)
        return "";
    return path.substring(index + 1);
}

/**
 * 获取路径的文件名(不含扩展名)或文件夹名
 */
export function getFileName(path:string):string {
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
/**
 * 获取指定文件夹下的文件或文件夹列表，不包含子文件夹内的文件。
 * @param path 要搜索的文件夹
 * @param relative 是否返回相对路径，若不传入或传入false，都返回绝对路径。
 */
export function getDirectoryListing(path:string, relative:boolean = false):string[] {
    path = escapePath(path);
    try {
        var list = FS.readdirSync(path);
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

/**
 * 获取指定文件夹下全部的文件列表，包括子文件夹
 * @param path
 * @returns {any}
 */
export function getDirectoryAllListing(path:string):string[] {
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

/**
 * 使用指定扩展名搜索文件夹及其子文件夹下所有的文件
 * @param dir 要搜索的文件夹
 * @param extension 要搜索的文件扩展名,不包含点字符，例如："png"。不设置表示获取所有类型文件。
 */
export function search(dir:string, extension?:string):string[] {
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
/**
 * 使用过滤函数搜索文件夹及其子文件夹下所有的文件
 * @param dir 要搜索的文件夹
 * @param filterFunc 过滤函数：filterFunc(file:File):Boolean,参数为遍历过程中的每一个文件，返回true则加入结果列表
 */
export function searchByFunction(dir: string, filterFunc: Function, checkDir?:boolean):string[] {
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


function findFiles(filePath:string, list:string[], extension:string, filterFunc?:Function, checkDir?:boolean) {
    var files = FS.readdirSync(filePath);
    var length = files.length;
    for (var i = 0; i < length; i++) {
        if (files[i].charAt(0) == ".") {
            continue;
        }
        var path = joinPath(filePath, files[i]);
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
export function exists(path:string):boolean {
    path = escapePath(path);
    return FS.existsSync(path);
}

/**
 * 转换本机路径为Unix风格路径。
 */
export function escapePath(path:string):string {
    if (!path)
        return "";
    return path.split("\\").join("/");
}
/**
 * 连接路径,支持传入多于两个的参数。也支持"../"相对路径解析。返回的分隔符为Unix风格。
 */
export function joinPath(dir:string, ...filename:string[]):string {
    var path = Path.join.apply(null, arguments);
    path = escapePath(path);
    return path;
}


export function getRelativePath(dir: string, filename: string) {
    var relative = Path.relative(dir, filename);
    return escapePath(relative);;
}

export function basename(p: string, ext?: string): string {
    var path = Path.basename.apply(null, arguments);
    path = escapePath(path);
    return path;
}

//获取相对路径 to相对于from的路径
export function relative(from: string, to: string) {
    var path = Path.relative.apply(null, arguments);
    path = escapePath(path);
    return path;
}

export function getAbsolutePath(path:string) {
    var tempPath = Path.resolve(path);
    tempPath = escapePath(tempPath);
    path = escapePath(path);
    if (tempPath == path) {
        return path;
    }

    return joinPath(egret.args.projectDir, path);
}