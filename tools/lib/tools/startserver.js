var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var libs = require("../core/normal_libs");

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
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
}

function run(dir, args, opts) {
    var PORT = 3000;
    var server = http.createServer(onGet);
    server.addListener("error",function(){
        libs.exit(1501);
    })
    server.listen(PORT,function(){
        var open = require("../core/open");
        libs.joinEgretDir(dir, args[0]);
        var url = path.join("http://localhost:3000", args[0], "launcher/index.html");
        open(url);
        console.log("Server runing at port: " + PORT + ".");
        exports.projectName = args[0];
    });


}


function onGet(request, response) {
    var projectName = exports.projectName;
    var pathname = url.parse(request.url).pathname;
    if (pathname.indexOf("__compile__") > -1) {
        executeCommand(function () {
            writeText("success", response);
        }, "egret build " + projectName + " -v");
        return;
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
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType,
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

        console.log(code)
        if (code == 0) {
            callback();
        }
        else {
            libs.log("脚本执行失败");
        }

    });
}


function help_title() {
    return "启动HttpServer,并在默认浏览器中打开指定项目";
}


function help_example() {
    return "egret startserver [project_name]";
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;
