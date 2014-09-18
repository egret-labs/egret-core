var path = require("path");
var param = require("../core/params_analyze.js");
var child_process = require("child_process");
var globals = require("../core/globals");
var file = require("../core/file.js");
var compile = require("./compile.js");

var isDebug = false;

/**
 * Constructs a new ClosureCompiler instance.
 * @exports ClosureCompiler
 * @class Closure Compiler binding.
 * @param {Object.<string,*>=} options Compilation options
 * @constructor
 */
var ClosureCompiler = function (options) {

    /**
     * Compilation options.
     * @type {Object.<string, *>}
     */
    this.options = typeof options == 'object' ? options : {};
    try {
        Object.keys(this.options);
    } catch (e) {
        this.options = {};
    }
};

/**
 * Validates an option.
 * @param {string} name Option name
 * @param {string} actual Actual value
 * @param {Array} expected Expected values
 * @throw {Error} If the option is invalid
 * @return {string} Validated option
 * @private
 */
ClosureCompiler._assertOption = function (name, actual, expected) {
    if (expected.indexOf(actual) < 0) {
        throw("Illegal " + name + " value: " + actual + " (" + expected + " expected)");
    }
};

/**
 * Java extension, e.g. '.exe' on windows.
 * @type {string}
 * @expose
 */
ClosureCompiler.JAVA_EXT = process.platform == 'win32' ? '.exe' : '';

/**
 * Gets the path of the global java executable.
 * @return {string} Absolute path to or "java(.exe)" if not determinable
 * @expose
 */
ClosureCompiler.getGlobalJava = function () {
    var java = path.join(process.execPath,"../jre/bin","java" + ClosureCompiler.JAVA_EXT);
    if(!file.exists(java)){
        java = null;
        if (process.env["JAVA_HOME"]) {
            java = path.join(process.env["JAVA_HOME"], "bin", "java" + ClosureCompiler.JAVA_EXT);
            if (!file.exists(java)) {
                java = null;
            }
        }
    }
    if (!java) {
        java = "java";
    }
    return java;
};

/**
 * Gets the path of the bundled java executable.
 * @return {string} Absolute path to "java(.exe)"
 * @expose
 */
ClosureCompiler.getBundledJava = function () {
    return path.normalize(path.join(__dirname, "jre", "bin", "java" + ClosureCompiler.JAVA_EXT));
};

/**
 * Tests if java is callable.
 * @param {string} java Path to java
 * @param {function(boolean, Error)} callback Callback function
 * @expose
 */
ClosureCompiler.testJava = function (java, callback) {
    child_process.exec('"' + java + '" -version', {}, function (error, stdout, stderr) {
        stderr += "";
        var minVersionChar = "1.7";
        var m1 = 1, m2 = 7;
        var minVersion = 0;
        var re = /(\d+\.\d+)\.?/gi;
        var versionArr = re.exec(stderr);
        var currentVersion = versionArr ? versionArr[0] : "0.0.0";
        var v1 = currentVersion.split(".")[0];
        var v2 = currentVersion.split(".")[1];
        if (v2 > 9 || m2 > 9) {
            v2 = v2 > 9 ? v2 : "0" + v2;
            m2 = m2 > 9 ? m2 : "0" + m2;
        }
        minVersion = m1 + "." + m2;
        currentVersion = v1 + "." + v2;
        if (currentVersion >= minVersion) {
            callback(true, null);
        } else if (stderr.indexOf("version \"") >= 0) {
            callback(false, new Error("Need Java " + minVersionChar + " but current version is " + currentVersion));
        } else {
            callback(false, error);
        }
    });
};

/**
 * Compiles one or more scripts through a new instance of ClosureCompiler.
 * @param {string|Array.<string>} files File or an array of files to compile
 * @param {Object.<string,*|Array>} options Any options Closure Compiler supports. If an option can occur
 *  multiple times, simply supply an array. Externs can additionally point to a directory to include all *.js files
 *  in it.
 * @param {function(Error,string)} callback Callback called with the error, if any, and the compiled code
 * @throws {Error} If the file cannot be compiled
 * @expose
 */
ClosureCompiler.compile = function (files, options, callback) {
    new ClosureCompiler(options).compile(files, callback);
};

/**
 * Compiles one or more scripts through this instance of ClosureCompiler.
 * @param {string|Array.<string>} files File or an array of files to compile
 * @param {function((Error|string),string)} callback Callback called with the error, if any, and the compiled code.
 *  If no error occurred, error contains the string output from stderr besides the result.
 * @throws {Error} If the file cannot be compiled
 * @expose
 */
ClosureCompiler.prototype.compile = function (files, callback) {

    // Convert all option keys to lower case
    var options = {};
    var keys = Object.keys(this.options);
    for (var i = 0; i < keys.length; i++) {
        options[keys[i].toLowerCase()] = this.options[keys[i]];
    }
    delete options["js"];

    var compilerPath = path.join(param.getEgretPath(), "tools/lib/google-closure/compiler.jar");
    var args = '-client -jar "' + compilerPath + '"';

    // Source files
    if (!(files instanceof Array)) {
        files = [files];
    }
    for (i = 0; i < files.length; i++) {
        if (typeof files[i] != 'string' || files[i].indexOf('"') >= 0) {
            throw(new Error("Illegal source file: " + files[i]));
        }
        if (!file.isFile(files[i])) {
            throw(new Error("Source file not found: " + files[i]));
        }
        args += ' --js "' + files[i] + '"';
    }

    // Externs files
    if (!options.externs) options.externs = [];
    if (!(options.externs instanceof Array)) {
        options.externs = [options.externs];
    }
    var externs = [];
    var j, stat;
    for (i = 0; i < options.externs.length; i++) {
        if (typeof options.externs[i] != 'string' || options.externs[i] == "") {
            throw(new Error("Externs directive does not point to a file or directory: " + options.externs[i]));
        }
        if (options.externs[i].toLowerCase() == "node") {
            options.externs[i] = __dirname + "/node_modules/closurecompiler-externs";
        }
        if (file.isDirectory(options.externs[i])) {
            // Use all files in that directory
            var dfiles = file.getDirectoryListing(options.externs[i]);
            for (j = 0; j < dfiles.length; j++) {
                var fname = dfiles[j];
                if (file.isFile(fname) && file.getExtension(fname).toLowerCase() == 'js') {
                    externs.push(fname);
                }
            }
        } else if (file.isFile(options.externs[i])) {
            externs.push(options.externs[i]);
        } else {
            throw(new Error("Externs file not found: " + options.externs[i]));
        }
    }

    delete options["externs"];
    for (i = 0; i < externs.length; i++) {
        args += ' --externs "' + externs[i] + '"';
    }
    if (isDebug) {
        args += ' --debug ';
    }

    // Convert any other options to command line arguments
    keys = Object.keys(options);
    for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = options[keys[i]];
        if (!/[a-zA-Z0-9_]+/.test(key)) {
            throw(new Error("Illegal option: " + key));
        }
        if (value === true) { // Only once
            args += ' --' + key;
        } else if (value === false) {
            // Skip
        } else { // Multiple times
            if (!(value instanceof Array)) {
                value = [value];
            }
            for (j = 0; j < value.length; j++) {
                if (!/[^\s]*/.test(value[j])) {
                    throw(new Error("Illegal value for option " + key + ": " + value[j]));
                }
                args += ' --' + key + ' ' + value[j];
            }
        }

    }

    function exec(cmd, callback) {
        require("child_process").exec(cmd, {maxBuffer: 20 * 1024 * 1024}, callback);
    }

    function run(java, args) {
        exec('"' + java + '" ' + args, function (error, stdout, stderr) {
            if (stdout.length > 0 || stderr.length > 0) { // If we get output, error basically just contains a copy of stderr
                callback(stderr + "", stdout + "");
            } else {
                callback(error, null);
            }
        });
    }

    // Try any other global java
    ClosureCompiler.testJava(ClosureCompiler.getGlobalJava(), function (ok) {
        if (ok) {
            run(ClosureCompiler.getGlobalJava(), args);
        } else {
            // If there is no global java, try the bundled one
            ClosureCompiler.testJava(ClosureCompiler.getBundledJava(), function (ok) {
                if (ok) {
                    run(ClosureCompiler.getBundledJava(), args);
                } else {
                    globals.exit(1401);
                }
            });
        }
    });

};


function getFileList(file_list) {
    if (file.exists(file_list)) {
        var js_content = file.read(file_list);
        eval(js_content);
        var path = require("path");
        var varname = path.basename(file_list).split(".js")[0];
        return eval(varname);
    }
    else {
        globals.exit(1301, file_list);
    }
}

function run(dir, args, opts) {
    if (opts["-testJava"]) {
        checkUserJava();
        return;
    }

    isDebug = opts["-debug"] != null;

    //发布版本
    var version = "";
    if (opts["--version"] && opts["--version"][0]) {
        version = "/" + opts["--version"][0];
    }
    else if (opts["--v"] && opts["--v"][0]) {
        version = "/" + opts["--v"][0];
    }

    var currDir = globals.joinEgretDir(dir, args[0]);

    //复制资源
    var releaseDir = currDir + "/release" + version;
    var launcherDir = releaseDir + "/launcher";
    var resourceDir = releaseDir + "/resource";
    file.remove(launcherDir);
    file.copy(currDir + "/launcher", launcherDir);
    file.remove(launcherDir + "/index.html");
    file.copy(launcherDir + "/release.html", releaseDir + "/index.html");
    file.remove(launcherDir + "/release.html");

    file.remove(resourceDir);
    file.copy(currDir + "/resource", resourceDir);

    var egret_file = path.join(currDir, "bin-debug/lib/egret_file_list.js");
    var egretFileList = getFileList(egret_file);

    var html5FileList = compile.getModuleConfig("html5").file_list;
    var length = html5FileList.length;
    for (var i = 0; i < length; i++) {
        var filePath = html5FileList[i];
        filePath = filePath.replace(".ts", ".js");
        html5FileList[i] = filePath;
        var index = egretFileList.indexOf(filePath);
        if (index != -1) {
            egretFileList.splice(index, 1);
        }
    }

    var nativeFileList = compile.getModuleConfig("native").file_list;
    length = nativeFileList.length;
    for (i = 0; i < length; i++) {
        filePath = nativeFileList[i];
        if (filePath.indexOf(".d.ts") != -1) {
            nativeFileList.splice(i, 1);
            i--;
            length--;
            continue;
        }
        filePath = filePath.replace(".ts", ".js");
        nativeFileList[i] = filePath;
        index = egretFileList.indexOf(filePath);
        if (index != -1) {
            egretFileList.splice(index, 1);
        }
    }

    var egretHTML5FileList = egretFileList.concat(html5FileList);
    egretHTML5FileList = egretHTML5FileList.map(function (item) {
        return path.join(currDir, "libs/", item);
    });
    var egretNativeFileList = egretFileList.concat(nativeFileList);
    egretNativeFileList = egretNativeFileList.map(function (item) {
        return path.join(currDir, "libs/", item);
    });

    var game_file = path.join(currDir, "bin-debug/src/game_file_list.js");
    var gameFileList = getFileList(game_file);
    gameFileList = gameFileList.map(function (item) {
        return path.join(currDir + "/bin-debug/src/", item);
    });

    var totalHTML5FileList = egretHTML5FileList.concat(gameFileList);
    var totalNativeFileList = egretNativeFileList.concat(gameFileList);

    var runtime = param.getOption(opts, "--runtime", ["html5", "native"]);
    if (runtime == "html5") {
        compilerSingleFile(currDir, totalHTML5FileList, "\""+launcherDir + "/game-min.js\"");
    }
    else if (runtime == "native") {
        compilerSingleFile(currDir, totalNativeFileList, "\""+launcherDir + "/game-min-native.js\"");
    }

    //扫描json数据
    if (opts["-compressjson"]) {
        var compress = require(path.join("..", "tools", "compress_json.js"));
        compress.run(path.join(currDir, "release"), []);
    }
}

function compilerSingleFile(currDir, fileList, outputFile, callback) {
    var tempFile = path.join(currDir, "bin-debug/__temp.js");
    combineToSingleJavaScriptFile(fileList, tempFile);
    ClosureCompiler.compile([tempFile],
        {js_output_file: outputFile, "warning_level": "QUIET"},
        function afterCompile(err, stdout, stderr) {
            if (!err) {
                file.remove(tempFile);
                if (callback) {
                    callback();
                }
            }
            else {
                console.log(err)
            }

        });
}

function help_title() {
    return "发布项目，使用GoogleClosureCompiler压缩代码\n";
}


function help_example() {
    var result = "\n";
    result += "    egret publish [project_name] --version [version] [--runtime html5|native]\n";
    result += "描述:\n";
    result += "    " + help_title();
    result += "参数说明:\n";
    result += "    --version    设置发布之后的版本号，可以不设置\n";
    result += "    --runtime    设置发布方式为 html5 或者是 native方式，默认值为html5";
    return result;
}


function combineToSingleJavaScriptFile(filelist, name) {
    var content = "";
    for (var i = 0; i < filelist.length; i++) {
        var filePath = filelist[i];
        content += file.read(filePath) + "\n";
    }
    file.save(name, content);
}

function checkUserJava() {
    var globalJava = ClosureCompiler.getGlobalJava();
    console.log("正在执行检测命令:" + globalJava + " -version");
    console.log("您可以修改 JAVA_HOME 环境变量来修改 JAVA 路径");
    ClosureCompiler.testJava(globalJava, function (isSuccess) {
        if (!isSuccess) {
            globals.exit(1401);
        }
        else {
            console.log("检测成功");
        }
    })
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;
