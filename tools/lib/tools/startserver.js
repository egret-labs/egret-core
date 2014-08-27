var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var globals = require("../core/globals");
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

function run(dir, args, opts) {
    var PORT = 3000;
	var OPEN = true
    if (opts["--port"] && opts["--port"][0]) {
        PORT = opts["--port"][0];
    }
	if (opts["-serveronly"]) {
		OPEN =  false;
	}
    var server = http.createServer(onGet);
    server.addListener("error", function () {
        globals.exit(1501);
    })
    server.listen(PORT, function () {
		if(OPEN){
			var open = require("../core/open");
		}
        globals.joinEgretDir(dir, args[0]);
        var ip = findIP(opts);
        var url = path.join("http://" + ip + ":" + PORT, args[0] ? args[0] : "", "launcher/index.html");
		if(OPEN)
		{
			open(url);
			console.log("Server runing at port: " + PORT + ".");
		}else
		{
			console.log("Url:"+url);
		}
        exports.projectName = args[0];
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

        console.log(code)
        if (code == 0) {
            callback();
        }
        else {
            globals.log("脚本执行失败");
        }
    });
}


function help_title() {
    return "启动HttpServer,并在默认浏览器中打开指定项目\n";
}


function help_example() {
    var result = "egret startserver [project_name] [--port 3000] [-ip] [-serveronly]\n";
    result += "参数说明:\n";
    result += "    --port           指定端口号\n";
    result += "    -ip              是否使用本机IP\n";
	result += "    -serveronly      是否只运行服务器";
    return result;
}

exports.run = run;
exports.help_title = help_title;
exports.help_example = help_example;
