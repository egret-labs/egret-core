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
var path = require("path");
var RenamePlugin = (function () {
    function RenamePlugin(options) {
        this.options = options;
        this.verboseInfo = [];
        if (!this.options) {
            this.options = { hash: 'crc32' };
        }
    }
    RenamePlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var a, filename, extname, new_file_path, basename, crc32code, new_file_path_1, basename, crc32code;
            return __generator(this, function (_a) {
                a = {
                    matchers: [
                        { from: "**/*.js", to: "js/[name]_[hash].js" },
                        { from: "resource/**/**", to: "resource/[path][name]_[hash].[ext]" }
                    ]
                };
                filename = file.origin;
                extname = path.extname(filename);
                if (extname == ".js") {
                    basename = path.basename(filename);
                    if (this.options.hash == 'crc32') {
                        crc32code = generateCrc32Code(file.contents);
                        new_file_path = "js/" + basename.substr(0, basename.length - file.extname.length) + "_" + crc32code + file.extname;
                    }
                }
                else {
                    basename = path.basename(filename);
                    if (this.options.hash == 'crc32') {
                        crc32code = generateCrc32Code(file.contents);
                        // file.dirname;
                        new_file_path_1 = "resource/" + basename.substr(0, basename.length - file.extname.length) + "_" + crc32code + file.extname;
                    }
                }
                file.path = path.join(file.base, new_file_path);
                if (this.options.verbose) {
                    this.verboseInfo.push({ filename: filename, new_file_path: new_file_path });
                }
                return [2 /*return*/, file];
            });
        });
    };
    RenamePlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    return RenamePlugin;
}());
exports.RenamePlugin = RenamePlugin;
function generateCrc32Code(buffer) {
    var crc32 = globals.getCrc32();
    var crc32code = crc32(buffer);
    return crc32code;
}
