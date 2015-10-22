var url = require('url');
var net = require('net');
var Project = require('./project');
var ServiceSocket = require('./ServiceSocket');
var file = require('../lib/FileUtil');
var childProcess = require('child_process');
var parser = require('../parser/Parser');
var os = require("os");
exports.LARK_SERVICE_PORT = 51545;
//Lark version, use to shutdown if the version is different to the value passed by the build command
var version = process.argv[2];
var projects = {};
var serviceCreated = false;
var timer;
var lastBuildTime = Date.now();
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
        console.log("未捕获的异常:", e);
        if (e.code == 'EADDRINUSE') {
            console.log("\u65E0\u6CD5\u542F\u52A8 service, \u8BF7\u68C0\u67E5\u7AEF\u53E3 " + exports.LARK_SERVICE_PORT + " \u662F\u5426\u88AB\u5360\u7528\u3002");
        }
    });
    process.on('exit', shutdown);
}
exports.run = run;
function handleCommands(task, res) {
    console.log("得到任务:", task.command, task.path);
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
        autoExitTimer();
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
        heapTotal = heapTotal / 1024 / 1024;
        heapTotal = heapTotal | 0;
        console.log("\u5185\u5B58\u5360\u7528: " + heapTotal + "M " + proj.path);
        if (heapTotal > 500) {
            console.log("内存占用过高,关闭进程:" + proj.path);
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
    ss.on('message', function (cmd) { return callback && callback(cmd, ss); });
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
function autoExitTimer() {
    lastBuildTime = Date.now();
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(shutdown, 10 * 60 * 1000);
}
function startBackgroundService() {
    serviceCreated = true;
    var cwd = os.tmpdir();
    var options = egret.args;
    var nodePath = process.execPath, service = file.joinPath(egret.root, 'tools/bin/egret');
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
    server.on("exit", function () { return serviceCreated = false; });
}
function shutdown() {
    for (var path in projects) {
        var project = projects[path];
        project.shutdown();
    }
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