var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var globals = require("../core/globals");
var fileWatcher;
var egretBuildCommand;
var projectPath;
var os = require("os");

var mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "mp3": "audio/mpeg",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
}


var autoCompilerFlag = "autoCompile";
var startCompileFlag = "startCompile";

function run(dir, args, opts) {
    var PORT = 3000;
    var OPEN = true
    if (opts["--port"] && opts["--port"][0]) {
        PORT = opts["--port"][0];
    }
    if (opts["-serveronly"]) {
        OPEN = false;
    }
    var autoCompile = opts["-autoCompile"];
    var startCompile = opts["-startCompile"];
    var server = http.createServer(onGet);
    server.addListener("error", function () {
        globals.exit(1501);
    })
    server.listen(PORT, function () {
        if (OPEN) {
            var open = require("../core/open");
        }
        projectPath = globals.joinEgretDir(dir, args[0]);
        var ip = findIP(opts);
        var projectName = args[0] ? args[0] : "";
        var projectNamePath = projectName ? projectName + "/" : "";
        if (autoCompile) {
            var url = "http://" + ip + ":" + PORT + "/" + projectNamePath + "launcher/" + autoCompilerFlag;
        }
        else if (startCompile) {
            var url = "http://" + ip + ":" + PORT + "/" + projectNamePath + "launcher/" + startCompileFlag;
        }
        else {
            var url = "http://" + ip + ":" + PORT + "/" + projectNamePath + "launcher/index.html";
        }


        if (OPEN) {
            open(url);
            console.log("Server running at port: " + PORT + ".");
        }
        console.log("Url:" + url);
        exports.projectName = projectName;
    });


}

function findIP(opts) {
    var ipConfig = os.networkInterfaces();
    var ip = "localhost";
    if (!opts["-ip"]) {
        return ip;
    }
    for (var key in ipConfig) {
        var arr = ipConfig[key];
        var length = arr.length;
        for (var i = 0; i < length; i++) {
            var ipData = arr[i];
            if (!ipData.internal && ipData.family == "IPv4") {
                ip = ipData.address;
                return ip;
            }
        }
    }
    return ip;
}

function onGet(request, response) {
    var projectName = exports.projectName;
    var pathname = url.parse(request.url).pathname;


    if (pathname.indexOf(startCompileFlag) != -1 && pathname.indexOf(startCompileFlag) == pathname.length - startCompileFlag.length) {

        var param = require("../core/params_analyze.js");
        var egretPath = param.getEgretPath()
        var serverPath = path.join (param.getEgretPath(),"tools/lib/server/compile.html")
        console.log(egretPath);
        writeFile(serverPath,response);
        return;
    }


    if (pathname.indexOf(autoCompilerFlag) != -1 && pathname.indexOf(autoCompilerFlag) == pathname.length - autoCompilerFlag.length) {

        if (egretBuildCommand) {

            writeText("Compiling... refresh me , please", response)
            return;
        }
        pathname = pathname.substring(0, pathname.length - autoCompilerFlag.length) + "index.html";
        if (!fileWatcher) {
            fileWatcher = require("../core/filewatcher.js").createFileWatcher();
            // watch a file
            fileWatcher.addAll(projectPath + "/src")
            fileWatcher.on('change', function (file, mtime) {
                console.log('File modified: %s', file)
                if (mtime == -1) console.log('deleted')


                var cp_exec = require("child_process").exec;
                if (egretBuildCommand) {
                    egretBuildCommand.kill();
                }
                egretBuildCommand = cp_exec("egret build " + projectName + " -v");
                egretBuildCommand.stderr.on("data", function (data) {
                    console.log(data);
                })
                egretBuildCommand.stdout.on("data", function (data) {
                    console.log(data);
                })

                egretBuildCommand.on('exit', function (code) {
                    if (code == 0) {
                        egretBuildCommand = null;
                    }
                });


            })

            fileWatcher.on('fallback', function (limit) {
                console.log('Ran out of file handles after watching %s files.', limit)
                console.log('Falling back to polling which uses more CPU.')
                console.log('Run ulimit -n 10000 to increase the limit for open files.')
            })
        }
    }

    writeFile(pathname, response);
}

function writeText(text, response) {
    var contentType = "text/plain";
    response.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
    });
    response.write(text);
    response.end();
}


function writeFile(pathname, response) {
    var realPath = pathname
    var realPath = path.join(process.cwd(), pathname);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            console.log(realPath);
            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err.toString());
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Accept-Ranges': 'bytes',
                        'Content-Type': contentType,
                        'Content-Length': file.length,
                        'Access-Control-Allow-Origin': '*'
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
}

exports.run = run;


function executeCommand(callback, script) {
    console.log(script);
    var cp_exec = require("child_process").exec;
    var cmd = cp_exec(script);
    cmd.stderr.on("data", function (data) {
        console.log(data);
    })
    cmd.stdout.on("data", function (data) {
        console.log(data);
    })

    cmd.on('exit', function (code) {
        if (code == 0) {
            callback();
        }
        else {
            globals.log2(4);
        }
    });
}

exports.run = run;
