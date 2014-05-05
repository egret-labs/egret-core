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

function run(currDir, args, opts) {
    var PORT = 3000;
    var server = http.createServer(onGet);
    server.listen(PORT);
    var open = require("../core/open");
    var project_name = args[0];
    if (!project_name){
        libs.exit(1201);
    }
    var url = "http://localhost:3000/" + project_name + "/launcher/index.html";
    open(url);
    console.log("Server runing at port: " + PORT + ".");
}

function onGet(request, response) {
    var pathname = url.parse(request.url).pathname;
    var realPath = path.join(process.cwd(), pathname);
    //console.log(realPath);
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
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
}

exports.run = run;