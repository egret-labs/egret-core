var url = require('url');
var net = require('net');
var Project = require('./project');
var ServiceSocket = require('./ServiceSocket');
var file = require('../lib/FileUtil');
var childProcess = require('child_process');
var parser = require('../parser/Parser');
exports.LARK_SERVICE_PORT = 51545;
//Lark version, use to shutdown if the version is different to the value passed by the build command
var version = process.argv[2];
var projects = {};
var serviceCreated = false;
/**
* Start Lark Service
*/
function run() {
    var server = net.createServer(function (socket) {
        var ss = new ServiceSocket(socket);
        ss.on("message", function (msg) { return handleCommands(msg, ss); });
    });
    try {
        server.listen(exports.LARK_SERVICE_PORT);
    }
    catch (e) {
        console.error("Service.run", e);
    }
    process.on('uncaughtException', function (e) {
    });
    process.on('exit', shutdown);
}
exports.run = run;
function handleCommands(task, res) {
    console.log("Got task:", task);
    //|| task.version && task.version != version
    if (task.command == 'shutdown') {
        res.send({});
        shutdown();
    }
    var proj = getProject(task.path);
    proj.option = parser.parseJSON(task.option);
    if (task.command == 'init') {
        proj.buildPort = res;
    }
    else if (task.command == 'build') {
        var buildHandled = false;
        if (task.option.added && task.option.added.length) {
            task.option.added.forEach(function (file) { return proj.fileChanged(res, task, file, "added"); });
            buildHandled = true;
        }
        if (task.option.removed && task.option.removed.length) {
            task.option.removed.forEach(function (file) { return proj.fileChanged(res, task, file, "removed"); });
            buildHandled = true;
        }
        if (task.option.modified && task.option.modified.length) {
            task.option.modified.forEach(function (file) { return proj.fileChanged(res, task, file, "modified"); });
            buildHandled = true;
        }
        if (!buildHandled)
            proj.fileChanged(res, task);
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
function execCommand(command, callback, startServer) {
    if (startServer === void 0) { startServer = true; }
    var options = egret.args;
    var requestUrl = getServiceURL(command);
    var client = net.connect(exports.LARK_SERVICE_PORT);
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
exports.execCommand = execCommand;
function getProject(path) {
    if (!path)
        return null;
    var project;
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
    var options = egret.args;
    var nodePath = process.execPath, service = file.joinPath(egret.root, 'tools/bin/egret');
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
        var project = projects[path];
        project.shutdown();
    }
    console.log("shutdown method");
    process.exit(0);
}
function parseRequest(req) {
    var uri = url.parse(req.url, true);
    var command = uri.query.q;
    return JSON.parse(command) || {};
}
function getServiceURL(params) {
    var json = JSON.stringify(params);
    return "http://127.0.0.1:" + exports.LARK_SERVICE_PORT + "/?q=" + encodeURIComponent(json);
}
/// <reference path="../lib/types.d.ts" />

//# sourceMappingURL=../service/index.js.map