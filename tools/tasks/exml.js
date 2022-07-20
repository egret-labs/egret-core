var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var exml = require("../actions/exml");
var file = require("../lib/FileUtil");
var FileUtil = require("../lib/FileUtil");
var ExmlPlugin = /** @class */ (function () {
    function ExmlPlugin(publishPolicy) {
        this.publishPolicy = publishPolicy;
        this.name = 'exml';
        this.exmls = [];
        this.themeFilenames = [];
    }
    ExmlPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, contents;
            return __generator(this, function (_a) {
                filename = file.origin;
                if (filename.indexOf('.exml') >= 0) {
                    contents = file.contents.toString();
                    this.exmls.push({ filename: filename, contents: contents });
                    if (this.publishPolicy != "debug") {
                        return [2 /*return*/, null];
                    }
                }
                else if (filename.indexOf('.thm.json') >= 0) {
                    this.themeFilenames.push(filename);
                }
                return [2 /*return*/, file];
            });
        });
    };
    ExmlPlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            var dtsContents, exmlDTS, themeDatas, result;
            return __generator(this, function (_a) {
                if (this.exmls.length == 0) {
                    return [2 /*return*/];
                }
                this.exmls = this.exmls.sort(function (a, b) {
                    return a.filename.localeCompare(b.filename);
                });
                if (this.publishPolicy == "debug") {
                    dtsContents = exml.generateExmlDTS(this.exmls);
                    if (!FileUtil.exists('libs/exml.e.d.ts')) {
                        pluginContext.createFile('libs/exml.e.d.ts', new Buffer(dtsContents));
                    }
                    else {
                        exmlDTS = FileUtil.read('libs/exml.e.d.ts');
                        if (dtsContents !== exmlDTS) {
                            pluginContext.createFile('libs/exml.e.d.ts', new Buffer(dtsContents));
                        }
                    }
                }
                themeDatas = this.themeFilenames.map(function (filename) {
                    var content = file.read(file.joinPath(egret.args.projectDir, filename));
                    var data = JSON.parse(content);
                    data.path = filename;
                    return data;
                });
                result = exml.publishEXML(this.exmls, this.publishPolicy, themeDatas);
                //屏蔽其他编译机制
                if (result.EuiJson) {
                    result.EuiJson.forEach(function (item) {
                        var filename = item.path.split("\\").join("/");
                        pluginContext.createFile(filename, new Buffer(item.json));
                    });
                }
                //写入解析规则和定义
                result.files.forEach(function (item) {
                    var filename = item.path.split("\\").join("/");
                    pluginContext.createFile(filename, new Buffer(item.content));
                });
                return [2 /*return*/];
            });
        });
    };
    return ExmlPlugin;
}());
exports.ExmlPlugin = ExmlPlugin;
