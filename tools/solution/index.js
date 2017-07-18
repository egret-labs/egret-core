Object.defineProperty(exports, "__esModule", { value: true });
var Server = require("../server/server");
var Dashboard = require("./Dashboard");
var FileUtil = require("../lib/FileUtil");
var Resource = require("./ResourceProject");
var TypeScript = require("./TypeScriptProject");
var EgretBuild = require("./EgretBuildProject");
var child_process = require("child_process");
function childProcessWrapper(cmd, start, end) {
    var process = child_process.exec(cmd);
    var buffer = "";
    var state = 0;
    process.stdout.on("data", function (data) {
        state = 1;
        buffer += data;
    });
    process.stderr.on("data", function (data) {
        state = 1;
        buffer += data;
    });
    var getOutput = function () {
        var startIndex = buffer.lastIndexOf(start);
        var endIndex = buffer.lastIndexOf(end) + end.length;
        var output = "";
        if (startIndex < endIndex) {
            output = buffer.substring(startIndex, endIndex);
        }
        else {
            output = buffer.substring(startIndex);
        }
        return output;
    };
    return {
        getOutput: getOutput
    };
}
exports.childProcessWrapper = childProcessWrapper;
function parseSolutionFile(path) {
    var content = FileUtil.read(path);
    var json = JSON.parse(content);
    for (var key in json.modules) {
        var m = json.modules[key];
        m.moduleName = key;
    }
    return json;
}
function run(solutionFile) {
    var s = parseSolutionFile(solutionFile);
    var projectRoot = egret.args.projectDir;
    for (var key in s.modules) {
        var m = s.modules[key];
        switch (m.type) {
            case "tsc-plus":
                var typescriptServer = new Server();
                typescriptServer.use(TypeScript.middleware(m.root));
                typescriptServer.start(projectRoot, 4000, "http://localhost:4000/index.html", false);
                break;
            case "res":
                var resourceServer = new Server();
                resourceServer.use(Resource.middleware(m.root));
                resourceServer.start(projectRoot, 4001, "http://localhost:4001/index.html", false);
                break;
            case "egret-build":
                var egretBuildServer = new Server();
                egretBuildServer.use(EgretBuild.middleware(m.root));
                egretBuildServer.start(projectRoot, 4002, "http://localhost:4001/index.html", false);
                break;
        }
    }
    var staticServer = new Server();
    staticServer.use(Server.fileReader("."));
    staticServer.start(".", 3005, 'http://localhost:3005/index.html', false);
    var dashboardServer = new Server();
    dashboardServer.use(Dashboard.dashboard);
    dashboardServer.start(projectRoot, 5000, "http://localhost:5000/index.html");
}
exports.run = run;
var http = require("http");
var fetch = function () {
    return new Promise(function (reslove, reject) {
        var options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: '/test',
            method: 'GET'
        };
        http.get(options, function (res) {
            var resData = "";
            res.on("data", function (data) {
                resData += data;
            });
            res.on("end", function () {
                reslove(resData);
            });
        });
    });
};
