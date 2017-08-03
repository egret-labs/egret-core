/// <reference path="../lib/types.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var url = require("url");
var net = require("net");
var Project = require("./project");
var ServiceSocket = require("./ServiceSocket");
var file = require("../lib/FileUtil");
var childProcess = require("child_process");
var parser = require("../parser/Parser");
var os = require("os");
var COMPILE_SERVICE_PORT = 51545;
//egret version, use to shutdown if the version is different to the value passed by the build command
var version = process.argv[2];
var projects = {};
var timer;
var lastBuildTime = Date.now();
var server;
(function (server_1) {
    server_1.serviceCreated = false;
    /**
    * Start Egret Service
    */
    function run() {
        var server = net.createServer(function (socket) {
            var ss = new ServiceSocket(socket);
            ss.on("message", function (msg) { return handleCommands(msg, ss); });
        });
        try {
            server.listen(COMPILE_SERVICE_PORT);
        }
        catch (e) {
            console.error("Service.run", e);
        }
        process.on('uncaughtException', function (e) {
            console.log("未捕获的异常:", e);
            if (e.code == 'EADDRINUSE') {
                console.log("\u65E0\u6CD5\u542F\u52A8 service, \u8BF7\u68C0\u67E5\u7AEF\u53E3 " + COMPILE_SERVICE_PORT + " \u662F\u5426\u88AB\u5360\u7528\u3002");
            }
        });
        process.on('exit', function () {
        });
    }
    server_1.run = run;
    function handleCommands(task, serviceSocket) {
        console.log("得到任务:", task.command, task.path);
        //|| task.version && task.version != version
        if (task.command == 'shutdown') {
            serviceSocket.send({});
            internal_shutdown();
        }
        var proj = getProject(task.path);
        proj.option = parser.parseJSON(task.option);
        if (task.command == 'init') {
            proj.setServiceSocket(serviceSocket);
        }
        else if (task.command == 'build') {
            // autoExitTimer();
            var buildHandled = false;
            if (task.option.added && task.option.added.length) {
                task.option.added.forEach(function (file) { return proj.fileChanged(serviceSocket, task, file, "added"); });
                buildHandled = true;
            }
            if (task.option.removed && task.option.removed.length) {
                task.option.removed.forEach(function (file) { return proj.fileChanged(serviceSocket, task, file, "removed"); });
                buildHandled = true;
            }
            if (task.option.modified && task.option.modified.length) {
                task.option.modified.forEach(function (file) { return proj.fileChanged(serviceSocket, task, file, "modified"); });
                buildHandled = true;
            }
            if (!buildHandled)
                proj.fileChanged(serviceSocket, task);
        }
        else if (task.command == 'status') {
            var heapTotal = task['status']['heapTotal'];
            heapTotal = heapTotal / 1024 / 1024;
            heapTotal = heapTotal | 0;
            console.log("\u5185\u5B58\u5360\u7528: " + heapTotal + "M " + proj.path);
            //取系统最大内存的四分之一，最低500M
            var maxHeap = Math.max(require("os").totalmem() / 1024 / 1024 / 4, 500);
            if (heapTotal > maxHeap) {
                console.log("内存占用过高,关闭进程:" + proj.path);
                proj.shutdown();
            }
        }
    }
    // function autoExitTimer() {
    //     lastBuildTime = Date.now();
    //     if (timer) {
    //         clearTimeout(timer);
    //     }
    //     timer = <any>setTimeout(shutdown, 10 * 60 * 1000);
    // }
    function startBackgroundService() {
        server_1.serviceCreated = true;
        var cwd = os.tmpdir();
        var options = egret.args;
        var nodePath = process.execPath, service = file.joinPath(egret.root, 'tools/bin/egret');
        var startupParams = ['--expose-gc', service, 'service'];
        if (egret.args.runtime) {
            startupParams.push("--runtime", egret.args.runtime);
        }
        if (egret.args.experimental) {
            startupParams.push("-exp");
        }
        var server = childProcess.spawn(nodePath, startupParams, {
            detached: true,
            stdio: ['ignore', 'ignore', 'ignore'],
            cwd: cwd
        });
        server.on("exit", function () { return server_1.serviceCreated = false; });
    }
    server_1.startBackgroundService = startBackgroundService;
    function internal_shutdown() {
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
})(server = exports.server || (exports.server = {}));
var client;
(function (client_1) {
    /**
    *  Send command to Compile Service
    */
    function execCommand(command, callback, startServer) {
        if (startServer === void 0) { startServer = true; }
        var options = egret.args;
        var requestUrl = getServiceURL(command);
        var client = net.connect(COMPILE_SERVICE_PORT, "127.0.0.1");
        var ss = new ServiceSocket(client);
        client.on('error', function (e) {
            if (!startServer)
                return;
            if (!server.serviceCreated) {
                server.startBackgroundService();
            }
            setTimeout(function () { return execCommand(command, callback); }, 200);
        });
        ss.on('message', function (cmd) { return callback && callback(cmd, ss); });
        ss.send(command);
        return ss;
    }
    client_1.execCommand = execCommand;
    function requestBuild() {
    }
    client_1.requestBuild = requestBuild;
    function closeServer(path) {
        return new Promise(function (reslove, reject) {
            execCommand({
                path: path,
                command: "shutdown",
                option: egret.args
            }, reslove, false);
        });
    }
    client_1.closeServer = closeServer;
    function getServiceURL(params) {
        var json = JSON.stringify(params);
        return "http://127.0.0.1:" + COMPILE_SERVICE_PORT + "/?q=" + encodeURIComponent(json);
    }
})(client = exports.client || (exports.client = {}));
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
