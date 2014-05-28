var path = require("path");
var param = require("../core/params_analyze.js");
var fs = require("fs");
var child_process = require("child_process");
var libs = require("../core/normal_libs");

if (!fs.existsSync) fs.existsSync = path.existsSync; // node < 0.8

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
    var java = null;

    if (process.env["JAVA_HOME"]) {
        java = path.join(process.env["JAVA_HOME"], "bin", "java" + ClosureCompiler.JAVA_EXT);
        if (!fs.existsSync(java)) {
            java = null;
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
        if (stderr.indexOf("version \"1.7.") >= 0) {
            callback(true, null);
        } else if (stderr.indexOf("version \"") >= 0) {
            callback(false, new Error("Not Java 7"));
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
        stat = fs.statSync(files[i]);
        if (!stat.isFile()) {
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
        stat = fs.statSync(options.externs[i]);
        if (stat.isDirectory()) {
            // Use all files in that directory
            var dfiles = fs.readdirSync(options.externs[i]);
            for (j = 0; j < dfiles.length; j++) {
                var fname = options.externs[i] + "/" + dfiles[j];
                var fstats = fs.statSync(fname);
                if (fstats.isFile() && path.extname(fname).toLowerCase() == '.js') {
                    externs.push(fname);
                }
            }
        } else if (stat.isFile()) {
            externs.push(options.externs[i]);
        } else {
            throw(new Error("Externs file not found: " + options.externs[i]));
        }
    }

    delete options["externs"];
    for (i = 0; i < externs.length; i++) {
        args += ' --externs "' + externs[i] + '"';
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
                    throw(new Error("Java is not available, neither the bundled nor a global one."));
                }
            });
        }
    });

};


function getFileList(file_list) {
    if (fs.existsSync(file_list)) {
        var js_content = fs.readFileSync(file_list, "utf-8");
        eval(js_content);
        var path = require("path");
        var varname = path.basename(file_list).split(".js")[0];
        return eval(varname);
    }
    else {
        libs.exit(1301, file_list);
    }
}

function run(dir, args, opts) {
    var currDir = libs.joinEgretDir(dir, args[0]);

    var egret_file = path.join(currDir, "bin-debug/lib/egret_file_list.js");
    var egretFileList = getFileList(egret_file);
    egretFileList = egretFileList.map(function (item) {
        return path.join(currDir + "/bin-debug/lib/", item);
    });

    var game_file = path.join(currDir, "src/game_file_list.js");
    var gameFileList = getFileList(game_file);
    gameFileList = gameFileList.map(function (item) {
        return path.join(currDir + "/bin-debug/src/", item);
    });

    var totalFileList = egretFileList.concat(gameFileList, currDir + "/launcher/egret_loader.js");
    ClosureCompiler.compile(totalFileList,
        {js_output_file:currDir + "/launcher/game-min.js"},
        function afterCompile (err, stdout, stderr) {
            console.log(err);
    });
}

exports.run = run;