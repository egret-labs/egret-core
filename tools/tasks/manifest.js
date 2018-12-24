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
var manifest = {
    initial: [],
    game: [],
};
var ManifestPlugin = /** @class */ (function () {
    function ManifestPlugin(options) {
        this.options = options;
        this.verboseInfo = [];
        if (!this.options) {
            this.options = { output: "manifest.json" };
        }
        if (options.hash) {
            console.log('ManifestPlugin 在未来的 5.3.x 版本中将不再支持 hash 参数，请使用 RenamePlugin 代替');
        }
    }
    ManifestPlugin.prototype.onFile = function (file) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, extname, new_file_path, basename, crc32, crc32_file_path, relative;
            return __generator(this, function (_a) {
                filename = file.relative;
                extname = path.extname(filename);
                if (extname == ".js") {
                    new_file_path = void 0;
                    basename = path.basename(filename);
                    if (this.options.hash == 'crc32') {
                        crc32 = globals.getCrc32();
                        crc32_file_path = crc32(file.contents);
                        new_file_path = "js/" + basename.substr(0, basename.length - file.extname.length) + "_" + crc32_file_path + file.extname;
                    }
                    else {
                        new_file_path = "js/" + basename.substr(0, basename.length - file.extname.length) + file.extname;
                    }
                    file.outputDir = "";
                    file.path = path.join(file.base, new_file_path);
                    relative = file.relative.split("\\").join('/');
                    if (file.origin.indexOf('libs/') >= 0) {
                        manifest.initial.push(relative);
                    }
                    else {
                        manifest.game.push(relative);
                    }
                    if (this.options.verbose) {
                        this.verboseInfo.push({ filename: filename, new_file_path: new_file_path });
                    }
                }
                return [2 /*return*/, file];
            });
        });
    };
    ManifestPlugin.prototype.onFinish = function (pluginContext) {
        return __awaiter(this, void 0, void 0, function () {
            var output, extname, contents;
            return __generator(this, function (_a) {
                output = this.options.output;
                extname = path.extname(output);
                contents = '';
                switch (extname) {
                    case ".json":
                        contents = JSON.stringify(manifest, null, '\t');
                        break;
                    case ".js":
                        contents = manifest.initial.concat(manifest.game).map(function (fileName) { return "require(\"./" + fileName + "\")"; }).join("\n");
                        break;
                }
                pluginContext.createFile(this.options.output, new Buffer(contents));
                if (this.options.verbose) {
                    this.verboseInfo.forEach(function (item) {
                        console.log("manifest-plugin: " + item.filename + " => " + item.new_file_path);
                    });
                }
                return [2 /*return*/];
            });
        });
    };
    return ManifestPlugin;
}());
exports.ManifestPlugin = ManifestPlugin;
