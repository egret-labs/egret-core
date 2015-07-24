/// <reference path="../lib/types.d.ts" />
var globals = require("../Globals");
var params = require("../ParamsParser");
var file = require('../lib/FileUtil');
var ShowIPCommand = require('./ShowIPCommand');
var StartServerCommand = (function () {
    function StartServerCommand() {
        this.autoCompilerFlag = "autoCompile";
        this.startCompileFlag = "startCompile";
        this.mine = {
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
        };
    }
    StartServerCommand.prototype.execute = function () {
        this.run();
        return 0;
    };
    StartServerCommand.prototype.writeFile = function (pathname, response) {
        var _this = this;
        var realfile = file.join(process.cwd(), pathname);
        var ext = file.getExtension(realfile);
        var fs = require('fs');
        fs.exists(realfile, function (exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                console.log(realfile);
                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            }
            else {
                fs.readFile(realfile, "binary", function (err, file) {
                    if (err) {
                        response.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        response.end(err.toString());
                    }
                    else {
                        var contentType = _this.mine[ext] || "text/plain";
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
    };
    StartServerCommand.prototype.writeText = function (text, response) {
        var contentType = "text/plain";
        response.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*'
        });
        response.write(text);
        response.end();
    };
    StartServerCommand.prototype.onGet = function (request, response) {
        var _this = this;
        var projectName = exports.projectName;
        var url = require('url');
        var pathname = url.parse(request.url).pathname;
        if (pathname.indexOf(this.startCompileFlag) != -1 && pathname.indexOf(this.startCompileFlag) == pathname.length - this.startCompileFlag.length) {
            var param = require("../../lib/core/params_analyze.js");
            var egretfile = param.getEgretfile();
            var serverfile = file.join(param.getEgretfile(), "tools/lib/server/compile.html");
            this.writeFile(serverfile, response);
            return;
        }
        if (pathname.indexOf(this.autoCompilerFlag) != -1 && pathname.indexOf(this.autoCompilerFlag) == pathname.length - this.autoCompilerFlag.length) {
            if (this.egretBuildCommand) {
                this.writeText("Compiling... refresh me , please", response);
                return;
            }
            pathname = pathname.substring(0, pathname.length - this.autoCompilerFlag.length) + "index.html";
            if (!this.fileWatcher) {
                this.fileWatcher = require("../../lib/core/filewatcher.js").createFileWatcher();
                // watch a file
                this.fileWatcher.addAll(file.join(params.getProjectRoot(), "src"));
                this.fileWatcher.on('change', function (file, mtime) {
                    if (mtime == -1)
                        console.log('deleted');
                    var cp_exec = require("child_process").exec;
                    if (_this.egretBuildCommand) {
                        _this.egretBuildCommand.kill();
                    }
                    _this.egretBuildCommand = cp_exec("egret build " + projectName + " -v");
                    _this.egretBuildCommand.stderr.on("data", function (data) {
                        //console.log(data);
                    });
                    _this.egretBuildCommand.stdout.on("data", function (data) {
                        //console.log(data);
                    });
                    _this.egretBuildCommand.on('exit', function (code) {
                        if (code == 0) {
                            _this.egretBuildCommand = null;
                        }
                    });
                });
                this.fileWatcher.on('fallback', function (limit) {
                    console.log('Ran out of file handles after watching %s files.', limit);
                    console.log('Falling back to polling which uses more CPU.');
                    console.log('Run ulimit -n 10000 to increase the limit for open files.');
                });
            }
        }
        this.writeFile(pathname, response);
    };
    StartServerCommand.prototype.run = function () {
        var PORT = params.getOption("--port") || 3000;
        var OPEN = !params.hasOption("-serveronly");
        var autoCompile = params.hasOption("-autoCompile");
        var startCompile = params.hasOption("-startCompile");
        var http = require('http');
        var server = http.createServer(this.onGet.bind(this));
        server.addListener("error", function () {
            globals.exit(1501);
        });
        server.listen(PORT, function () {
            if (OPEN) {
                var open = require("../../lib/core/open");
            }
            if (params.hasOption("-ip")) {
                var ip = new ShowIPCommand().getIP();
            }
            else {
                ip = "localhost";
            }
            var args = params.getCommandArgs();
            var projectName = args[0] ? args[0] : "";
            var projectNamefile = projectName ? projectName + "/" : "";
            if (autoCompile) {
                var url = "http://" + ip + ":" + PORT + "/" + projectNamefile + this.autoCompilerFlag;
            }
            else if (startCompile) {
                var url = "http://" + ip + ":" + PORT + "/" + projectNamefile + this.startCompileFlag;
            }
            else {
                var url = "http://" + ip + ":" + PORT + "/" + projectNamefile + "index.html";
            }
            if (OPEN) {
                open(url);
                console.log("Server running at port: " + PORT + ".");
            }
            console.log("Url:" + url);
            exports.projectName = projectName;
        });
    };
    return StartServerCommand;
})();
module.exports = StartServerCommand;
