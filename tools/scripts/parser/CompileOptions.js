/// <reference path="../lib/types.d.ts" />
var os = require('os');
var crypto = require('crypto');
var FileUtil = require('../lib/FileUtil');
var CompileOptions = (function () {
    function CompileOptions() {
        this._outDir = null;
        this._port = NaN;
        this.esTarget = 'ES5';
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
    Object.defineProperty(CompileOptions.prototype, "egretPropertiesFile", {
        get: function () {
            return FileUtil.joinPath(this.projectDir, "lark.json");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "debugDir", {
        get: function () {
            return FileUtil.joinPath(this.projectDir, "bin-debug/src");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "releaseDir", {
        get: function () {
            return FileUtil.joinPath(this.projectDir, "bin-release/");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "launcherDir", {
        get: function () {
            return FileUtil.joinPath(this.projectDir, "launcher/");
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
            return "localhost";
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
            var url = "ws://" + this.host + ':' + this.port;
            return url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "manageUrl", {
        get: function () {
            var url = "http://" + this.host + ':' + this.port + '/$/';
            return url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompileOptions.prototype, "startUrl", {
        get: function () {
            var url = "http://" + this.host + ':' + this.port + '/bin-debug/index.html';
            return url;
        },
        enumerable: true,
        configurable: true
    });
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
    CompileOptions.prototype.getProject = function () {
        if (this._tmpProj == null) {
            var tmpFile = FileUtil.joinPath(this.getTmpDir(), "proj.json");
            if (!FileUtil.exists(tmpFile))
                this._tmpProj = { port: 3000 };
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
