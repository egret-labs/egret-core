var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
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
var xml2js = require("xml2js");
var fs = require("../../lib/FileUtil");
var path = require("path");
// import * as utils from 'egret-node-utils';
function changeInheritActivity(filePath, libPackageName) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFileAsync(filePath, "utf-8")];
                case 1:
                    fileContent = _a.sent();
                    fileContent = fileContent.replace(/com.egret.androidsupport.GameActivity/, libPackageName + ".GameActivity");
                    return [4 /*yield*/, fs.writeFileAsync(filePath, fileContent, "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.changeInheritActivity = changeInheritActivity;
function modifyAndroidSDKProject(sdkName, sdkProjectPath, sdkPackageName) {
    return __awaiter(this, void 0, void 0, function () {
        var prevPackagePath, replaceRex;
        return __generator(this, function (_a) {
            prevPackagePath = "src/com/egret/androidsupport" + path.sep + sdkName;
            replaceRex = new RegExp("com.egret.androidsupport." + sdkName, "gi");
            changeProjectPackageName(sdkProjectPath, prevPackagePath, sdkPackageName, replaceRex);
            return [2 /*return*/];
        });
    });
}
exports.modifyAndroidSDKProject = modifyAndroidSDKProject;
function modifyAndroidProject(projectPath, packageName) {
    return __awaiter(this, void 0, void 0, function () {
        var prevPackagePath, replaceRex;
        return __generator(this, function (_a) {
            prevPackagePath = "src/com/egret/androidsupport";
            replaceRex = /com.egret.androidsupport/gi;
            changeProjectPackageName(projectPath, prevPackagePath, packageName, replaceRex);
            return [2 /*return*/];
        });
    });
}
exports.modifyAndroidProject = modifyAndroidProject;
function addAndroidProjectLib(hostProjectPath, addLibPath, index) {
    return __awaiter(this, void 0, void 0, function () {
        var propertiesFilePath, fileContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    propertiesFilePath = path.join(hostProjectPath, "project.properties");
                    return [4 /*yield*/, fs.readFileAsync(propertiesFilePath, "utf-8")];
                case 1:
                    fileContent = _a.sent();
                    fileContent += "\nandroid.library.reference." + index + "=" + path.relative(hostProjectPath, addLibPath);
                    return [4 /*yield*/, fs.writeFileAsync(propertiesFilePath, fileContent, "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.addAndroidProjectLib = addAndroidProjectLib;
function markAndroidProjectAsLib(projectPath) {
    return __awaiter(this, void 0, void 0, function () {
        var propertiesFilePath, fileContent;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    propertiesFilePath = path.join(projectPath, "project.properties");
                    return [4 /*yield*/, fs.readFileAsync(propertiesFilePath, "utf-8")];
                case 1:
                    fileContent = _a.sent();
                    fileContent += '\nandroid.library=true';
                    return [4 /*yield*/, fs.writeFileAsync(propertiesFilePath, fileContent, "utf-8")];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.markAndroidProjectAsLib = markAndroidProjectAsLib;
function changeProjectPackageName(projectPath, prevPackagePath, packageName, replaceRex) {
    return __awaiter(this, void 0, void 0, function () {
        var manifestPath, content, obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manifestPath = path.join(projectPath, "AndroidManifest.xml");
                    return [4 /*yield*/, fs.readFileAsync(manifestPath, "utf-8")];
                case 1:
                    content = _a.sent();
                    return [4 /*yield*/, parseXML(content)];
                case 2:
                    obj = _a.sent();
                    return [4 /*yield*/, modifyPackageName(projectPath, obj, packageName, prevPackagePath, replaceRex)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, stringifyXML(obj)];
                case 4:
                    content = _a.sent();
                    content = content.replace(replaceRex, packageName);
                    return [4 /*yield*/, fs.writeFileAsync(manifestPath, content, "utf-8")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, modifyProjectConfig(projectPath)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var stringifyXML = function (obj) { return __awaiter(_this, void 0, void 0, function () {
    var builder, xml;
    return __generator(this, function (_a) {
        builder = new xml2js.Builder();
        xml = builder.buildObject(obj);
        return [2 /*return*/, xml];
    });
}); };
var parseXML = function (content) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (reslove, reject) {
                xml2js.parseString(content, function (err, result) {
                    reslove(result);
                });
            })];
    });
}); };
var modifyFile = function (path, packageName, replaceRex) { return __awaiter(_this, void 0, void 0, function () {
    var fileContent;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs.readFileAsync(path, "utf-8")];
            case 1:
                fileContent = _a.sent();
                fileContent = fileContent.replace(replaceRex, packageName);
                return [4 /*yield*/, fs.writeFileAsync(path, fileContent, "utf-8")];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
function modifyProjectConfig(projectPath) {
    return __awaiter(this, void 0, void 0, function () {
        var profileConfigPath, content, obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    profileConfigPath = path.join(projectPath, ".project");
                    return [4 /*yield*/, fs.readFileAsync(profileConfigPath, "utf-8")];
                case 1:
                    content = _a.sent();
                    return [4 /*yield*/, parseXML(content)];
                case 2:
                    obj = _a.sent();
                    obj.projectDescription.name = path.basename(projectPath, "");
                    return [4 /*yield*/, stringifyXML(obj)];
                case 3:
                    content = _a.sent();
                    return [4 /*yield*/, fs.writeFileAsync(profileConfigPath, content, "utf-8")];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var modifyPackageName = function (projectPath, obj, packageName, prevPackagePath, replaceRex) { return __awaiter(_this, void 0, void 0, function () {
    var sourceDir, targetDir, androidSrcDir, javaFileList, mapper;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sourceDir = prevPackagePath;
                targetDir = path.join("src", packageName.split(".").join(path.sep));
                androidSrcDir = path.join(projectPath, "src");
                javaFileList = fs.search(androidSrcDir, "java");
                mapper = function (item, index, arrayIndex) { return modifyFile(item, packageName, replaceRex); };
                return [4 /*yield*/, Promise.all(javaFileList.map(mapper))];
            case 1:
                _a.sent();
                return [4 /*yield*/, fs.moveAsync(path.join(projectPath, sourceDir), path.join(projectPath, targetDir))];
            case 2:
                _a.sent();
                obj.manifest.$.package = packageName;
                return [2 /*return*/];
        }
    });
}); };
