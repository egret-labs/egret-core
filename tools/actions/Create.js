/// <reference path="../lib/types.d.ts" />
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
var utils = require("../lib/utils");
var projectAction = require("../actions/Project");
var FileUtil = require("../lib/FileUtil");
var doT = require("../lib/doT");
var EgretProject = require("../project/EgretProject");
var TemplatesRoot = "tools/templates/";
var Clean = require("../commands/clean");
var Create = (function () {
    function Create() {
    }
    Create.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var proj, options, project, emptyTemplate, template;
            return __generator(this, function (_a) {
                proj = this.project;
                options = egret.args;
                project = EgretProject.data;
                projectAction.normalize(proj);
                emptyTemplate = FileUtil.joinPath(egret.root, TemplatesRoot + "empty");
                template = FileUtil.joinPath(egret.root, TemplatesRoot + proj.type);
                FileUtil.copy(emptyTemplate, project.getProjectRoot());
                FileUtil.copy(template, project.getProjectRoot());
                compileTemplate(proj);
                project.reload();
                new Clean().execute();
                console.log(utils.tr(10017));
                return [2 /*return*/, Promise.resolve(DontExitCode)];
            });
        });
    };
    return Create;
}());
function compileTemplate(projectConfig) {
    var options = egret.args;
    var modules = projectConfig.modules;
    var platform = projectConfig.platform;
    updateEgretProperties(modules);
    var files = FileUtil.searchByFunction(options.projectDir, function (f) { return f.indexOf("index.html") > 0; });
    files.forEach(function (file) {
        var content = FileUtil.read(file);
        content = doT.template(content)(projectConfig);
        FileUtil.save(file, content);
    });
}
function updateEgretProperties(modules) {
    var propFile = FileUtil.joinPath(egret.args.projectDir, "egretProperties.json");
    var jsonString = FileUtil.read(propFile);
    var props = JSON.parse(jsonString);
    props.egret_version = egret.version;
    props.template = {};
    if (!props.modules) {
        props.modules = modules.map(function (m) { return ({ name: m.name }); });
    }
    var promise = { name: "promise", path: "./promise" };
    props.modules.push(promise);
    FileUtil.save(propFile, JSON.stringify(props, null, "  "));
}
module.exports = Create;
