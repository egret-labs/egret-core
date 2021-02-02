import net = require('net');
import url = require('url');
import path = require('path');
import fs = require('fs');
import http = require('http');
import cp = require('child_process');
import os = require('os');

var DontExitCode = -0xF000;

export class StartServerPlugin implements plugins.Command {
    constructor(private target: string, private port: number = 3000, private serverOnly: boolean = false) {
    }

    async onFinish(commandContext: plugins.CommandContext) {
        await this.execute(commandContext);
    }

    async execute(commandContext: plugins.CommandContext) {
        const target = this.target;
        // const toolsList = launcher.getLauncherLibrary().getInstalledTools();

        this._params = this.genParams(commandContext.projectRoot);

        switch (target) {
            case "web":
                const port = await utils.getAvailablePort(this.port);
                this.initServer(commandContext.projectRoot, port);
                return DontExitCode;
            // case "wxgame":
            //     return (await runWxIde());


        }
    }
    private getStartURL(host: string, port: number) {
        var url = "http://" + host + ':' + port + '/index.html';
        return url;
    }

    private initServer(projectDir: string, port: number) {
        var addresses = utils.getNetworkAddress();
        // if (addresses.length > 0) {
        //     egret.args.host = addresses[0];
        // }
        let startUrl = this.getStartURL(addresses[0], port);
        let serverOnly = this.serverOnly;
        let openWithBrowser = !serverOnly;
        let server = new Server();
        server.use(Server.fileReader(projectDir))
        server.start(projectDir, port, this.wrapByParams(startUrl), openWithBrowser);
        if (serverOnly) {
            console.log("Url:" + this.wrapByParams(startUrl));
        } else {
            console.log('\n');
            console.log("    Egret 服务器已经启动, 您可以通过以下URL访问: ");
            console.log('\n');
            console.log('        ' + this.wrapByParams(startUrl));
            for (var i = 1; i < addresses.length; i++) {
                console.log('        ' + this.wrapByParams(this.getStartURL(addresses[i], port)));
            }
            console.log('\n');
        }
        // if (egret.args.autoCompile) {
        //     console.log('    ' + utils.tr(10010));
        //     this.watchFiles(egret.args.srcDir);
        //     //this.watchFiles(egret.args.templateDir);
        // }
        // else 
        // if (!server) {
        //     console.log('    ' + utils.tr(10012));
        // }
    }

    private wrapByParams(url: string): string {
        return url + this._params;
    }

    private _params: string = "";
    private genParams(projectDir) {
        let result = "";
        let propertyFilePath = FileUtil.joinPath(projectDir, "egretProperties.json");
        if (FileUtil.exists(propertyFilePath)) {
            let urlParams = JSON.parse(FileUtil.read(propertyFilePath)).urlParams;
            if (urlParams) {
                let hasParams = false;
                for (let key in urlParams) {
                    hasParams = true;
                    result += key + "=" + urlParams[key] + "&";
                }
                if (hasParams) {
                    result = "?" + result.substr(0, result.length - 1);
                }
            }
        }
        return result;
    }

}



class Server {
    private middleware: Server.Middleware | null = null;
    constructor() {
    }
    use(middleware: Server.Middleware) {
        this.middleware = middleware;
    }

    start(root: string, port: number, startupUrl: string, openWithBrowser: boolean = true) {
        // let ips = getLocalIPAddress();
        let m = this.middleware!();
        var server = http.createServer((request, response) => {
            response.setHeader("Access-Control-Allow-Origin", "*");
            m(request, response).then(() => {
                response.end();
            }).catch((e) => {
                console.error(e);
                response.end();
            });
        });
        server.listen(port);
        console.log("Server running at port: " + port + ".");
        if (openWithBrowser) {
            utils.open(startupUrl);
        }
    }
}


namespace utils {
    export function getNetworkAddress(): string[] {
        var os = require('os');
        var ifaces = os.networkInterfaces();
        var ips: string[] = [];
        Object.keys(ifaces).forEach(function (ifname) {
            var alias = 0;
            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                    return;
                }
                ips.push(iface.address);
            });
        });
        return ips;
    }
    export function getAvailablePort(port = 0) {
        return new Promise<number>((resolve, reject) => {
            function getPort() {
                var server = net.createServer();
                server.on('listening', function () {
                    port = server.address().port
                    server.close()
                })
                server.on('close', function () {
                    resolve(port)
                })
                server.on('error', function (err) {
                    port++;
                    getPort();
                })
                server.listen(port)
            }
            getPort();
        })
    }
    export function open(target, appName?) {
        var command;
        switch (process.platform) {
            case 'darwin':
                if (appName) {
                    command = 'open -a "' + escape(appName) + '"';
                } else {
                    command = 'open';
                }
                break;
            case 'win32':
                // if the first parameter to start is quoted, it uses that as the title
                // so we pass a blank title so we can quote the file we are opening
                if (appName) {
                    command = 'start "" "' + escape(appName) + '"';
                } else {
                    command = 'start ""';
                }
                break;
            default:
                if (appName) {
                    command = escape(appName);
                } else {
                    // use Portlands xdg-open everywhere else
                    command = path.join(__dirname, '../vendor/xdg-open');
                }
                break;
        }
        executeCommand(command + ' "' + escape(target) + '"')
    }
    export async function executeCommand(command: string, options = {}) {
        return new Promise<{ error: Error, stdout: string, stderr: string }>((resolve, reject) => {
            cp.exec(command, options, (error, stdout, stderr) => {
                resolve({ error, stdout, stderr })
            });
        })
    }
}

namespace Server {
    export var fileReader = (root) => () => {
        return function (request: http.IncomingMessage, response: http.ServerResponse) {
            return new Promise((resolve, reject) => {
                var pathname = url.parse(request.url!).pathname;
                var realPath = path.join(root, pathname!);
                //console.log(realPath);
                if (path.relative(root, realPath).indexOf("..") == 0) {
                    response.writeHead(404, {
                        'Content-Type': 'text/plain'
                    });
                    response.write("The request URL " + pathname + " is illegal.");
                    resolve();
                    return;
                }
                var ext = path.extname(realPath);
                ext = ext ? ext.slice(1) : 'unknown';
                fs.exists(realPath, function (exists) {
                    if (!exists) {
                        response.writeHead(404, {
                            'Content-Type': 'text/plain'
                        });
                        response.write("This request URL " + pathname + " was not found on this server.");
                        resolve();
                    } else {
                        fs.readFile(realPath, "binary", function (err, file) {
                            if (err) {
                                response.writeHead(500, {
                                    'Content-Type': 'text/plain'
                                });
                                resolve();
                            } else {
                                var contentType = mine[ext] || "text/plain";
                                response.writeHead(200, {
                                    'Content-Type': contentType
                                });
                                response.write(file, "binary");
                                resolve();
                            }
                        });
                    }
                })
            })
        }
    }


    export type Middleware = (...arg) => (request: http.IncomingMessage, response: http.ServerResponse) => Promise<any>


}


namespace FileUtil {
    /**
     * 连接路径,支持传入多于两个的参数。也支持"../"相对路径解析。返回的分隔符为Unix风格。
     */
    export function joinPath(dir: string, ...filename: string[]): string {
        filename = filename ? filename : [];
        filename.unshift(dir);
        var _path = path.join.apply(null, filename);
        _path = escapePath(_path);
        return _path;
    }

    /**
     * 转换本机路径为Unix风格路径。
     */
    export function escapePath(_path: string): string {
        if (!_path)
            return "";
        return _path.split("\\").join("/");
    }

    /**
     * 指定路径的文件或文件夹是否存在
     */
    export function exists(_path: string): boolean {
        _path = escapePath(_path);
        return fs.existsSync(_path);
    }

    /**
     * 获得路径的扩展名,不包含点字符。
     */
    export function getExtension(path: string): string {
        path = escapePath(path);
        var index = path.lastIndexOf(".");
        if (index == -1)
            return "";
        var i = path.lastIndexOf("/");
        if (i > index)
            return "";
        return path.substring(index + 1);
    }

    var textTemp = {};
    var charset = "utf-8";
    /**
     * 读取文本文件,返回打开文本的字符串内容，若失败，返回"".
     * @param path 要打开的文件路径
     */
    export function read(path: string, ignoreCache = false): string {
        path = escapePath(path);
        var text = textTemp[path];
        if (text && !ignoreCache) {
            return text;
        }
        try {
            text = fs.readFileSync(path, charset);
            text = text.replace(/^\uFEFF/, '');
        }
        catch (err0) {
            return "";
        }
        if (text) {
            var ext = getExtension(path).toLowerCase();
            if (ext == "ts" || ext == "exml") {
                textTemp[path] = text;
            }
        }
        return text;
    }
}


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
};
