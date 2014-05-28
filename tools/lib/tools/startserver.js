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

var projectName = "";
function run(dir, args, opts) {
    var PORT = 3000;
    var server = http.createServer(onGet);
    server.listen(PORT);
    var open = require("../core/open");

    var currDir = libs.joinEgretDir(dir, args[0]);
    var arr = currDir.split(path.sep);
    if (arr[arr.length - 1] == "") {
        arr.splice(arr.length - 1, 1);
    }
    var tempPN = arr[arr.length - 1];

    if (args[0] == null || args[0] == "") {
        projectName = tempPN;
    }

    var url = path.join("http://localhost:3000", tempPN, "launcher/index.html");
    open(url);
    console.log("Server runing at port: " + PORT + ".");
}

function onGet(request, response) {
    var pathname = url.parse(request.url).pathname;

    var realProj = pathname;
    if (projectName != "") {
        var proArr = pathname.split(projectName);
        realProj = proArr[proArr.length - 1];
    }

    var realPath = path.join(process.cwd(), realProj);
    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });
            console.log(realPath);
            response.write("This request URL " + realProj + " was not found on this server.");
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
//                    response.setHeader();
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
}

exports.run = run;


function help_title(){
    return "启动HttpServer,并在默认浏览器中打开指定项目";
}


function help_example(){
    return "egret startserver [project_name]";
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;
