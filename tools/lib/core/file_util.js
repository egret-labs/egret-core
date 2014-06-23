var fs = require('fs');
var path_lib = require("path");

var charset = "utf-8";

/**
 * 保存数据到指定文件
 * @param path 文件完整路径名
 * @param data 要保存的数据
 */
function save(path,data){
    path = escapePath(path);
    createDirectory(path_lib.dirname(path));
    fs.writeFileSync(path,data,charset);
}
/**
 * 创建文件夹
 */
function createDirectory(path, mode, made) {
    if (mode === undefined) {
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
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


/**
 * 打开文本文件的简便方法,返回打开文本的内容，若失败，返回"".
 * @param path 要打开的文件路径
 */
function read(path) {
    path = escapePath(path);
    try{
        var text = fs.readFileSync(path,charset);
    }
    catch (err0) {
        return "";
    }
    return text;
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
 * 搜索指定文件夹及其子文件夹下所有的文件
 * @param dir 要搜索的文件夹
 * @param extension 要搜索的文件扩展名,不包含点字符，例如："png"。不设置表示获取所有类型文件。
 */
function searchByExtension(dir, extension) {
    var list = [];
    var stat = fs.statSync(dir);
    if (stat.isDirectory()) {
        findFiles(dir,list,extension,null);
    }
    return list;
}
/**
 * 搜索指定文件夹及其子文件夹下所有的文件
 * @param dir 要搜索的文件夹
 * @param filterFunc 过滤函数：filterFunc(file:File):Boolean,参数为遍历过程中的每一个文件，返回true则加入结果列表
 */
function searchByFunction(dir, filterFunc) {
    var list = [];
    var stat = fs.statSync(dir);
    if (stat.isDirectory()) {
        findFiles(dir,list,"",filterFunc);
    }
    return list;
}



function findFiles(filePath,list,extension,filterFunc) {
    var files = fs.readdirSync(filePath);
    var length = files.length;
    for (var i = 0; i < length; i++) {
        var path = path_lib.join(filePath ,files[i]);
        var stat = fs.statSync(path);
        if (path.charAt(0) == ".") {
            continue;
        }
        if (stat.isDirectory()) {
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

exports.save = save;
exports.createDirectory = createDirectory;
exports.read = read;
exports.copy = copy;
exports.remove = remove;
exports.searchByExtension = searchByExtension;
exports.searchByFunction = searchByFunction;
exports.exists = exists;
exports.escapePath = escapePath;
exports.getDirectory = getDirectory;
exports.getExtension = getExtension;
exports.getFileName = getFileName;
exports.escapePath = escapePath;