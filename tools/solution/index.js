var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var Server = require("../server/server");
var Dashboard = require("./Dashboard");
var cp = require("child_process");
var FileUtil = require("../lib/FileUtil");
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
                typescriptServer.use(watchProject(m.root));
                typescriptServer.start(projectRoot, 4000, "http://localhost:4000/index.html", false);
                break;
            case "res":
        }
    }
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
var watchProject = function (project) {
    var output = "";
    var state = 0;
    var process = cp.exec("egret startup " + project, function (error) {
        console.log(error);
    });
    process.stdout.on("data", function (data) {
        state = 1;
        output += data;
    });
    return function () {
        var result = "";
        return function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ state: state, output: output }));
                return [2 /*return*/];
            });
        }); };
    };
};
