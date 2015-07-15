var fs = require('fs');
var path_lib = require("../core/path");
var charset = "utf-8";
if (!fs.existsSync)
    fs.existsSync = path_lib.existsSync; // node < 0.8

/**
 * 保存数据到指定文件
 * @param path 文件完整路径名
 * @param data 要保存的数据
 */
function save(path,data){
    if(exists(path)) {
        remove(path);
    }
    path = escapePath(path);
    createDirectory(path_lib.dirname(path));
    fs.writeFileSync(path,data,charset);
}
/**
 * 创建文件夹
 */
function createDirectory(path, mode, made) {
    path = escapePath(path);
    if (mode === undefined) {
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string')
        mode = parseInt(mode, 8);
    path = path_lib.resolve(path);

    try {
        fs.mkdirSync(path, mode);
        made = made || path;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = createDirectory(path_lib.dirname(path), mode, made);
                createDirectory(path, mode, made);
                break;

            default:
                var stat;
                try {
                    stat = fs.statSync(path);
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
function read(path) {
    path = escapePath(path);
    var text = textTemp[path];
    if(text){
        return text;
    }
    try{
        text = fs.readFileSync(path,charset);
        text = text.replace(/^\uFEFF/, '');
    }
    catch (err0) {
        return "";
    }
    if(text){
        var ext = getExtension(path).toLowerCase();
        if(ext=="ts"||ext=="exml"){
            textTemp[path] = text;
        }
    }
    return text;
}

/**
 * 读取字节流文件,返回字节流，若失败，返回null.
 * @param path 要打开的文件路径
 */
function readBinary(path) {
    path = escapePath(path);
    try{
        var binary = fs.readFileSync(path);
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
function copy(source, dest) {
    source = escapePath(source);
    dest = escapePath(dest);
    var stat = fs.lstatSync(source);
    if (stat.isDirectory()) {
        _copy_dir(source, dest);
    }
    else {
        _copy_file(source, dest);
    }
}

function isDirectory(path){
    path = escapePath(path);
    try{
        var stat = fs.statSync(path);
    }
    catch(e){
        return false;
    }
    return stat.isDirectory();
}

function isSymbolicLink(path){
    path = escapePath(path);
    try{
        var stat = fs.statSync(path);
    }
    catch(e){
        return false;
    }
    return stat.isSymbolicLink();
}

function isFile(path){
    path = escapePath(path);
    try{
        var stat = fs.statSync(path);
    }
    catch(e){
        return false;
    }
    return stat.isFile();
}

function _copy_file(source_file, output_file) {
    createDirectory(path_lib.dirname(output_file))
    var byteArray = fs.readFileSync(source_file);
    fs.writeFileSync(output_file, byteArray);
}

function _copy_dir(sourceDir, outputDir) {
    createDirectory(outputDir);
    var list = fs.readdirSync(sourceDir);
    list.forEach(function (fileName) {
        copy(path_lib.join(sourceDir, fileName), path_lib.join(outputDir, fileName));
    });
}

/**
 * 删除文件或目录
 * @param path 要删除的文件源路径
 */
function remove(path) {
    path = escapePath(path);
    try{
        fs.lstatSync(path).isDirectory()
            ? rmdir(path)
            : fs.unlinkSync(path)
    }
    catch (e){
    }
}

function rmdir(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) {
                rmdir(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

/**
 * 返回指定文件的父级文件夹路径,返回字符串的结尾已包含分隔符。
 */
function getDirectory(path) {
    path = escapePath(path);
    return path_lib.dirname(path)+"/";
}

/**
 * 获得路径的扩展名,不包含点字符。
 */
function getExtension(path) {
    path = escapePath(path);
    var index = path.lastIndexOf(".");
    if(index==-1)
        return "";
    var i = path.lastIndexOf("/");
    if(i>index)
        return "";
    return path.substring(index+1);
}

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
    if (endIndex == -1)
        endIndex = path.length;
    return path.substring(startIndex + 1, endIndex);
}
/**
 * 获取指定文件夹下的文件或文件夹列表，不包含子文件夹内的文件。
 * @param path 要搜索的文件夹
 * @param relative 是否返回相对路径，若不传入或传入false，都返回绝对路径。
 */
function getDirectoryListing(path){
    var relative = arguments[1];
    path = escapePath(path);
    try{
        var list = fs.readdirSync(path);
    }
    catch (e){
        return [];
    }
    if(!relative){
        var length = list.length;
        for(var i = 0;i<length;i++){
            list[i] = joinPath(path,list[i]);
        }
    }
    return list;
}

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

/**
 * 使用指定扩展名搜索文件夹及其子文件夹下所有的文件
 * @param dir 要搜索的文件夹
 * @param extension 要搜索的文件扩展名,不包含点字符，例如："png"。不设置表示获取所有类型文件。
 */
function search(dir, extension) {
    var list = [];
    try{
        var stat = fs.statSync(dir);
    }
    catch(e){
        return list;
    }
    if (stat.isDirectory()) {
        findFiles(dir,list,extension,null);
    }
    return list;
}
/**
 * 使用过滤函数搜索文件夹及其子文件夹下所有的文件
 * @param dir 要搜索的文件夹
 * @param filterFunc 过滤函数：filterFunc(file:File):Boolean,参数为遍历过程中的每一个文件，返回true则加入结果列表
 */
function searchByFunction(dir, filterFunc) {
    var list = [];
    var checkDir = arguments[2];
    try{
        var stat = fs.statSync(dir);
    }
    catch(e){
        return list;
    }
    if (stat.isDirectory()) {
        findFiles(dir,list,"",filterFunc,checkDir);
    }
    return list;
}



function findFiles(filePath,list,extension,filterFunc,checkDir) {
    var files = fs.readdirSync(filePath);
    var length = files.length;
    for (var i = 0; i < length; i++) {
        if (files[i].charAt(0) == ".") {
            continue;
        }
        var path = joinPath(filePath ,files[i]);
        var stat = fs.statSync(path);
        if (stat.isDirectory()) {
            if(checkDir){
                if (!filterFunc(path)) {
                    continue;
                }
            }
            findFiles(path, list,extension,filterFunc);
        }
        else if (filterFunc != null) {
            if (filterFunc(path)) {
                list.push(path);
            }
        }
        else if(extension){
            var len = extension.length;
            if(path.charAt(path.length-len-1)=="."&&
                path.substr(path.length-len,len).toLowerCase()==extension){
                list.push(path);
            }
        }
        else{
            list.push(path);
        }
    }
}

/**
 * 指定路径的文件或文件夹是否存在
 */
function exists(path) {
    path = escapePath(path);
    return fs.existsSync(path);
}

/**
 * 转换本机路径为Unix风格路径。
 */
function escapePath(path) {
    if (!path)
        return "";
    return path.split("\\").join("/");
}
/**
 * 连接路径,支持传入多于两个的参数。也支持"../"相对路径解析。返回的分隔符为Unix风格。
 */
function joinPath(dir,filename){
    var path = path_lib.join.apply(null,arguments);
    path = escapePath(path);
    return path;
}

/**
 * 检查文件是否为UTF8格式
 */
function isUTF8(text) {
    var i = 0;
    while(i < text.length){
        if(     (// ASCII
                    text[i] == 0x09 ||
                    text[i] == 0x0A ||
                    text[i] == 0x0D ||
                    (0x20 <= text[i] && text[i] <= 0x7E)
                )
          ) {
              i += 1;
              continue;
          }

        if(     (// non-overlong 2-byte
                    (0xC2 <= text[i] && text[i] <= 0xDF) &&
                    (0x80 <= text[i+1] && text[i+1] <= 0xBF)
                )
          ) {
              i += 2;
              continue;
          }

        if(     (// excluding overlongs
                    text[i] == 0xE0 &&
                    (0xA0 <= text[i + 1] && text[i + 1] <= 0xBF) &&
                    (0x80 <= text[i + 2] && text[i + 2] <= 0xBF)
                ) ||
                (// straight 3-byte
                 ((0xE1 <= text[i] && text[i] <= 0xEC) ||
                  text[i] == 0xEE ||
                  text[i] == 0xEF) &&
                 (0x80 <= text[i + 1] && text[i+1] <= 0xBF) &&
                 (0x80 <= text[i+2] && text[i+2] <= 0xBF)
                ) ||
                (// excluding surrogates
                 text[i] == 0xED &&
                 (0x80 <= text[i+1] && text[i+1] <= 0x9F) &&
                 (0x80 <= text[i+2] && text[i+2] <= 0xBF)
                )
          ) {
              i += 3;
              continue;
          }

        if(     (// planes 1-3
                    text[i] == 0xF0 &&
                    (0x90 <= text[i + 1] && text[i + 1] <= 0xBF) &&
                    (0x80 <= text[i + 2] && text[i + 2] <= 0xBF) &&
                    (0x80 <= text[i + 3] && text[i + 3] <= 0xBF)
                ) ||
                (// planes 4-15
                 (0xF1 <= text[i] && text[i] <= 0xF3) &&
                 (0x80 <= text[i + 1] && text[i + 1] <= 0xBF) &&
                 (0x80 <= text[i + 2] && text[i + 2] <= 0xBF) &&
                 (0x80 <= text[i + 3] && text[i + 3] <= 0xBF)
                ) ||
                (// plane 16
                 text[i] == 0xF4 &&
                 (0x80 <= text[i + 1] && text[i + 1] <= 0x8F) &&
                 (0x80 <= text[i + 2] && text[i + 2] <= 0xBF) &&
                 (0x80 <= text[i + 3] && text[i + 3] <= 0xBF)
                )
          ) {
              i += 4;
              continue;
          }

        return false;
    }

    return true;
}

exports.save = save;
exports.read = read;
exports.readBinary = readBinary;
exports.copy = copy;
exports.remove = remove;
exports.exists = exists;
exports.search = search;
exports.getDirectoryAllListing = getDirectoryAllListing;
exports.getDirectoryListing = getDirectoryListing;
exports.isDirectory = isDirectory;
exports.isSymbolicLink = isSymbolicLink;
exports.isFile = isFile;
exports.searchByFunction = searchByFunction;
exports.createDirectory = createDirectory;
exports.getDirectory = getDirectory;
exports.getExtension = getExtension;
exports.getFileName = getFileName;
exports.escapePath = escapePath;
exports.joinPath = joinPath;
exports.isUTF8 = isUTF8;