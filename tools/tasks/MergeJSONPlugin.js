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
Object.defineProperty(exports, "__esModule", { value: true });
var zlib = require("zlib");
var MergeJSONPlugin = /** @class */ (function () {
    function MergeJSONPlugin(options) {
        this.options = options;
        this.mergeList = {};
    }
    MergeJSONPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var mergeResult, filename;
            return __generator(this, function (_a) {
                mergeResult = this.options.mergeSelector(file.origin);
                /**合并 */
                if (mergeResult) {
                    if (!this.mergeList[mergeResult]) {
                        this.mergeList[mergeResult] = [];
                    }
                    filename = this.options.nameSelector(file.origin.replace("resource/", ""));
                    this.mergeList[mergeResult].push({ filename: filename, content: file.contents.toString() });
                    // return null;
                }
                // else {
                return [2 /*return*/, file];
            });
        });
    };
    //加上subkeys
    MergeJSONPlugin.prototype.onFinish = function (commandContext) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_1, this_1, _a, _b, _i, mergeFilename;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _loop_1 = function (mergeFilename) {
                            var mergeItem, json, subkeys, _i, mergeItem_1, item, content, jsonBuffer;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        mergeItem = this_1.mergeList[mergeFilename];
                                        json = {};
                                        subkeys = [];
                                        for (_i = 0, mergeItem_1 = mergeItem; _i < mergeItem_1.length; _i++) {
                                            item = mergeItem_1[_i];
                                            subkeys.push(item.filename);
                                        }
                                        mergeItem.forEach(function (item) {
                                            json[item.filename] = JSON.parse(item.content);
                                        });
                                        content = JSON.stringify(json, null, '\t');
                                        return [4 /*yield*/, zip(content)];
                                    case 1:
                                        jsonBuffer = _a.sent();
                                        commandContext.createFile(mergeFilename, jsonBuffer, { type: "zipjson", subkeys: subkeys });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _a = [];
                        for (_b in this.mergeList)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        mergeFilename = _a[_i];
                        return [5 /*yield**/, _loop_1(mergeFilename)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MergeJSONPlugin;
}());
exports.MergeJSONPlugin = MergeJSONPlugin;
var MergeBinaryPlugin = /** @class */ (function () {
    function MergeBinaryPlugin(options) {
        this.options = options;
        this.mergeList = {};
    }
    MergeBinaryPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var mergeResult;
            return __generator(this, function (_a) {
                mergeResult = this.options.mergeSelector(file.origin);
                if (mergeResult) {
                    if (!this.mergeList[mergeResult]) {
                        this.mergeList[mergeResult] = [];
                    }
                    this.mergeList[mergeResult].push({ filename: file.origin.replace("resource/", ""), content: file.contents });
                    // return null;
                }
                return [2 /*return*/, file];
            });
        });
    };
    MergeBinaryPlugin.prototype.onFinish = function (commandContext) {
        return __awaiter(this, void 0, void 0, function () {
            var _loop_2, this_2, _a, _b, _i, mergeFilename;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _loop_2 = function (mergeFilename) {
                            var mergeItem, totalLength, json, subkeys, bufferList, b, indexJson, indexJsonBuffer, gltfContent;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        mergeItem = this_2.mergeList[mergeFilename];
                                        totalLength = 0;
                                        json = {};
                                        subkeys = [];
                                        mergeItem.forEach(function (item) {
                                            json[item.filename] = { s: totalLength, l: item.content.byteLength };
                                            subkeys.push(item.filename);
                                            totalLength += item.content.byteLength;
                                        });
                                        bufferList = mergeItem.map(function (item) { return item.content; });
                                        b = Buffer.concat(bufferList);
                                        indexJson = JSON.stringify(json);
                                        return [4 /*yield*/, zip(indexJson)];
                                    case 1:
                                        indexJsonBuffer = _a.sent();
                                        return [4 /*yield*/, zip(b)];
                                    case 2:
                                        gltfContent = _a.sent();
                                        commandContext.createFile(mergeFilename + ".zipjson", indexJsonBuffer, { type: "zipjson", subkeys: subkeys });
                                        commandContext.createFile(mergeFilename, gltfContent, { type: "bin" });
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _a = [];
                        for (_b in this.mergeList)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        mergeFilename = _a[_i];
                        return [5 /*yield**/, _loop_2(mergeFilename)];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MergeBinaryPlugin;
}());
exports.MergeBinaryPlugin = MergeBinaryPlugin;
function zip(input) {
    return new Promise(function (resolve, reject) {
        zlib.deflate(input, function (err, buffer) {
            if (!err) {
                resolve(buffer);
            }
            else {
                reject(err);
            }
        });
    });
}
