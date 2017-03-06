/// <reference path="../lib/types.d.ts" />

import http = require('http');
import events = require('events');
import utils = require('../lib/utils');
import fs = require('fs');
import cp = require('child_process');
import url = require('url');
import path = require('path');


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




class Server {

    private middleware: Server.Middleware;

    constructor() {
    }

    use(middleware: Server.Middleware) {
        this.middleware = middleware;
    }

    start(root: string, port: number, startupUrl: string, openWithBrowser: boolean = true) {

        let ips = getLocalIPAddress();

        let m = this.middleware();

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


function getLocalIPAddress() {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var ips = ['localhost', '127.0.0.1'];
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





namespace Server {


    export var fileReader = (root) => () => {
        return function (request: http.IncomingMessage, response: http.ServerResponse) {
            return new Promise((reslove, reject) => {
                var pathname = url.parse(request.url).pathname;
                var realPath = path.join(root, pathname);
                //console.log(realPath);
                var ext = path.extname(realPath);
                ext = ext ? ext.slice(1) : 'unknown';
                fs.exists(realPath, function (exists) {
                    if (!exists) {
                        response.writeHead(404, {
                            'Content-Type': 'text/plain'
                        });
                        response.write("This request URL " + pathname + " was not found on this server.");
                        reslove();
                    } else {
                        fs.readFile(realPath, "binary", function (err, file) {
                            if (err) {
                                response.writeHead(500, {
                                    'Content-Type': 'text/plain'
                                });
                                reslove();
                            } else {
                                var contentType = mine[ext] || "text/plain";
                                response.writeHead(200, {
                                    'Content-Type': contentType
                                });
                                response.write(file, "binary");
                                reslove();
                            }
                        });
                    }
                })
            })
        }
    }


    export type Middleware = (...arg) => (request: http.IncomingMessage, response: http.ServerResponse) => Promise<any>


}



export = Server;