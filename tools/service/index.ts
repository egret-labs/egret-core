import url = require('url');
import net = require('net');
import http = require('http');
import Project = require('./project');
import ServiceSocket = require('./ServiceSocket');
import file = require('../lib/FileUtil');
import childProcess = require('child_process');
import parser = require('../parser/Parser');
import os = require("os");



export var LARK_SERVICE_PORT = 51545;
//Lark version, use to shutdown if the version is different to the value passed by the build command
var version = process.argv[2];
var projects = {};
var serviceCreated = false;
var timer: NodeJS.Timer;
var lastBuildTime: number = Date.now();








/**
* Start Lark Service
*/
export function run() {
    var server = net.createServer(socket=> {
        var ss = new ServiceSocket(socket);
        ss.on("message", msg=> handleCommands(msg,ss));
    });
    try {
        server.listen(LARK_SERVICE_PORT);
    }
    catch (e) {
        console.error("Service.run", e);
    }
    process.on('uncaughtException', function (e: NodeJS.ErrnoException) {
        console.log("未捕获的异常:",e);
        if (e.code == 'EADDRINUSE') {
            console.log(`无法启动 service, 请检查端口 ${LARK_SERVICE_PORT} 是否被占用。`)
        }
    });
    process.on('exit', shutdown);
}


function handleCommands(task: egret.ServiceCommand, res: ServiceSocket) {
    console.log("得到任务:", task.command, task.path);
    //|| task.version && task.version != version
    if (task.command == 'shutdown' ) {
        res.send({});
        shutdown();
    }
    var proj: Project = getProject(task.path);
    proj.option = parser.parseJSON(task.option);
    if (task.command == 'init') {
        proj.buildPort = res;
    }
    else if (task.command == 'build') {
        autoExitTimer();
        var buildHandled = false;
        if (task.option.added && task.option.added.length) {
            task.option.added.forEach(file=> proj.fileChanged(res, task, file, "added"));
            buildHandled = true;
        }
        if (task.option.removed && task.option.removed.length) {
            task.option.removed.forEach(file=> proj.fileChanged(res, task, file, "removed"));
            buildHandled = true;
        }
        if (task.option.modified && task.option.modified.length) {
            task.option.modified.forEach(file=> proj.fileChanged(res, task, file, "modified"));
            buildHandled = true;
        }
        if (!buildHandled)
            proj.fileChanged(res, task);
    }
    else if (task.command == 'status') {
        var heapTotal: number = task['status']['heapTotal'];
        heapTotal = heapTotal / 1024 / 1024;
        heapTotal = heapTotal | 0;
        console.log(`内存占用: ${heapTotal}M ${proj.path}`);
        if (heapTotal > 500) {
            console.log("内存占用过高,关闭进程:" + proj.path);
            proj.shutdown();
        }
    }
}

/**
*  Send command to Lark Service
*/
export function execCommand(command :egret.ServiceCommand, callback?: Function,startServer = true):ServiceSocket{
    var options = egret.args;
    var requestUrl = getServiceURL(command);

    var client = net.connect(LARK_SERVICE_PORT);
    var ss = new ServiceSocket(client);
    client.on('error', function (e) {
        if (!startServer)
            return;
        if (!serviceCreated) {
            startBackgroundService();
        }
        setTimeout(() => execCommand(command, callback), 200);
    });

    ss.send(command);

    ss.on('message', cmd=> callback && callback(cmd,ss));
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


function autoExitTimer() {
    lastBuildTime = Date.now();
    if (timer) {
        clearTimeout(timer);
    }

    timer = <any>setTimeout(shutdown, 10 * 60 * 1000);
}




function startBackgroundService() {
    serviceCreated = true;
    var cwd = os.tmpdir();
    var options = egret.args;
    var nodePath = process.execPath,
        service = file.joinPath(egret.root, 'tools/bin/egret');
    var startupParams = ['--expose-gc', service, 'service'];
    if (egret.args.runtime) {
        startupParams.push("--runtime", egret.args.runtime);
    }
    var server = childProcess.spawn(nodePath, startupParams, {
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore'],
        cwd: cwd,
        silent: true
    });

    server.on("exit", () => serviceCreated = false);
}

function shutdown() {
    for (var path in projects) {
        var project:Project = projects[path];
        project.shutdown();
    }
    process.exit(0);
}


function parseRequest(req: http.ServerRequest):egret.ServiceCommand {
    var uri = url.parse(req.url, true);
    var command = uri.query.q;
    return JSON.parse(command) || {};
}

function getServiceURL(params: any) {
    var json = JSON.stringify(params);
    return "http://127.0.0.1:" + LARK_SERVICE_PORT + "/?q=" + encodeURIComponent(json);
}











/// <reference path="../lib/types.d.ts" />
