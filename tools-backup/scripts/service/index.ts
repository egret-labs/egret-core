import url = require('url');
import net = require('net');
import http = require('http');
import Project = require('./project');
import ServiceSocket = require('./ServiceSocket');
import file = require('../lib/FileUtil');
import childProcess = require('child_process');



export var EGRET_SERVICE_PORT = 51398;
//Lark version, use to shutdown if the version is different to the value passed by the build command
var version = process.argv[2];
var projects = {};
var serviceCreated = false;








/**
* Start Lark Service
*/
export function run() {
    var server = net.createServer(function (socket) {
        var ss = new ServiceSocket(socket);
        ss.on("message", function (msg) { return handleCommands(msg, ss); });
    });
    try {
        server.listen(exports.EGRET_SERVICE_PORT);
    }
    catch (e) {
        console.error("Service.run", e);
    }
    process.on('uncaughtException', function (e) {
    });
    process.on('exit', shutdown);
}


function handleCommands(task: egret.ServiceCommand, res: ServiceSocket) {
    //console.log("task.version:", task.version);
    //console.log('version:', version);
    console.log('task:', task);
    //|| task.version && task.version != version
    if (task.command == 'shutdown') {
        res.send({});
        shutdown();
    }
    var proj = getProject(task.path);
    if (task.command == 'init') {
        proj.buildPort = res;
    }
    else if (task.command == 'build') {
        proj.fileChanged(res);
    }
    else if (task.command == 'status') {
        var heapTotal = task['status']['heapTotal'];
        console.log(heapTotal);
        if (heapTotal > 500 * 1024 * 1024) {
            proj.shutdown();
        }
    }
}

/**
*  Send command to Lark Service
*/
export function execCommand(command :egret.ServiceCommand, callback?: Function,startServer = true):ServiceSocket{
    var options = egret.options;
    var requestUrl = getServiceURL(command);
    var client = net.connect(EGRET_SERVICE_PORT);
    var ss = new ServiceSocket(client);
    client.on('error', function (e) {
        if (!startServer)
            return;
        if (!serviceCreated) {
            startBackgroundService();
        }
        setTimeout(function () { return execCommand(command, callback); }, 200);
    });
    ss.send(command);
    ss.on('message', function (cmd) { return callback && callback(cmd); });
    return ss;
}


function getProject(path: string) {
    if (!path)
        return null;
    var project: Project;
    if (!projects[path]) {
        project = new Project();
        project.path = path;
        project.init();
        projects[path] = project;
        return project;
    }
    return projects[path];
}




function startBackgroundService() {
    serviceCreated = true;
    var options = egret.options;
    var nodePath = process.execPath, service = file.joinPath(options.egretRoot, 'tools/bin/egret');
    var startupParams = ['--expose-gc', service, 'service'];
    var server = childProcess.spawn(nodePath, startupParams, {
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore'],
        cwd: process.cwd(),
        silent: true
    });
    server.on("exit", function () { return serviceCreated = false; });
}

function shutdown() {
    for (var path in projects) {
        var project:Project = projects[path];
        project.shutdown();
    }
    console.log("shutdown method");
    process.exit(0);
}


function parseRequest(req: http.ServerRequest):egret.ServiceCommand {
    var uri = url.parse(req.url, true);
    var command = uri.query.q;
    return JSON.parse(command) || {};
}

function getServiceURL(params: any) {
    var json = JSON.stringify(params);
    return "http://127.0.0.1:" + EGRET_SERVICE_PORT + "/?q=" + encodeURIComponent(json);
}











/// <reference path="../lib/types.d.ts" />