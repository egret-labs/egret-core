/// <reference path="../lib/types.d.ts" />
var os = require('os');
var crypto = require('crypto');
var FileUtil = require('../lib/FileUtil');
var CompileOptions = (function () {
    function CompileOptions() {
        this._outDir = null;
        this._host = null;
        this._port = NaN;
        this.esTarget = 'ES5';
        this.runtime = "web";
        this._tmpDir = null;
    }
    Object.defineProperty(CompileOptions.prototype, "dirName", {
        get: function () {
            return FileUtil.getFileName(this.projectDir);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "srcDir", {
        get: function () {
            return FileUtil.joinPath(this.projectDir, "src/");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "libsDir", {
        get: function () {
            return FileUtil.joinPath(this.projectDir, "libs/");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "larkPropertiesFile", {
        get: function () {
            return FileUtil.joinPath(this.projectDir, "lark.json");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "debugDir", {
        get: function () {
            return this._debugDir || FileUtil.joinPath(this.projectDir, "bin-debug/");
        },
        set: function (value) {
            this._debugDir = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "releaseDir", {
        get: function () {
            return this._releaseDir || FileUtil.joinPath(this.projectDir, "bin-release/");
        },
        set: function (value) {
            this._releaseDir = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "releaseRootDir", {
        get: function () {
            return FileUtil.joinPath(this.projectDir, "bin-release/");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "out", {
        get: function () {
            var filename = this.publish ? FileUtil.joinPath(this.outDir, 'main.min.js') : undefined;
            return filename;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "outDir", {
        get: function () {
            if (this._outDir)
                return this._outDir;
            return this.publish ? this.releaseDir : this.debugDir;
        },
        set: function (value) {
            this._outDir = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "templateDir", {
        get: function () {
            return FileUtil.joinPath(this.projectDir, "template/");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "host", {
        get: function () {
            return this._host;
        },
        set: function (value) {
            this._host = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "port", {
        get: function () {
            return isNaN(this._port) ? this.getProject().port : this._port;
        },
        set: function (value) {
            this._port = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "websocketUrl", {
        get: function () {
            var url = "ws://" + (this.host || "localhost") + ':' + this.port;
            return url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "manageUrl", {
        get: function () {
            var url = "http://" + (this.host || "localhost") + ':' + this.port + '/$/';
            return url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "startUrl", {
        get: function () {
            var url = "http://" + (this.host || "localhost") + ':' + this.port + '/index.html';
            return url;
        },
        enumerable: true,
        configurable: true
    });
    CompileOptions.prototype.getStartURL = function (host) {
        var url = "http://" + host + ':' + this.port + '/index.html';
        return url;
    };
    CompileOptions.prototype.getTmpDir = function () {
        if (this._tmpDir == null) {
            var sha1 = crypto.createHash('sha1');
            sha1.update(this.projectDir);
            var folder = sha1.digest('hex');
            var systemTmp = os.tmpdir();
            var dir = FileUtil.joinPath(systemTmp, "lark/" + folder + "/");
            FileUtil.createDirectory(dir);
            this._tmpDir = dir;
        }
        return this._tmpDir;
    };
    CompileOptions.prototype.getProject = function (empty) {
        if (empty === void 0) { empty = false; }
        if (this._tmpProj == null) {
            var tmpFile = FileUtil.joinPath(this.getTmpDir(), "proj.json");
            if (empty || !FileUtil.exists(tmpFile))
                this._tmpProj = {
                    port: this._port || 3000,
                    type: this.type,
                    platforms: (this.platforms || []).map(function (p) { return { name: p }; }),
                    modules: (this.modules || []).map(function (m) { return { name: m }; }),
                    contentHeight: this.contentHeight,
                    contentWidth: this.contentWidth,
                    scaleMode: this.scaleMode,
                    orientationMode: this.orientation,
                    background: this.background
                };
            else {
                var content = FileUtil.read(tmpFile);
                this._tmpProj = JSON.parse(content);
            }
        }
        return this._tmpProj;
    };
    CompileOptions.parse = function (option) {
        var it = new CompileOptions();
        for (var p in option) {
            it[p] = option[p];
        }
        return it;
    };
    CompileOptions.prototype.toJSON = function () {
        var options = this;
        var json = {};
        for (var k in this) {
            var disc = Object.getOwnPropertyDescriptor(options, k) || Object.getOwnPropertyDescriptor(CompileOptions.prototype, k);
            if (!disc)
                continue;
            if (disc.enumerable == false)
                continue;
            if (typeof disc.value == 'function')
                continue;
            json[k] = options[k];
        }
        return json;
    };
    return CompileOptions;
})();
module.exports = CompileOptions;

//# sourceMappingURL=../parser/CompileOptions.js.map