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
var file = require("../lib/FileUtil");
var service = require("../service/index");
var Project = require("../project");
var path = require("path");
var utils = require("../lib/utils");
var Clean = require("./clean");
var UpgradeCommand = (function () {
    function UpgradeCommand() {
    }
    UpgradeCommand.prototype.execute = function () {
        utils.checkEgret();
        var version = Project.projectData.getVersion();
        var versionArr = version.split(".");
        var majorVersion = parseInt(versionArr[0]);
        var middleVersion = parseInt(versionArr[1]);
        if (majorVersion == 5 && middleVersion != 0) {
            this.run();
        }
        else {
            globals.exit(1719);
        }
        return DontExitCode;
    };
    UpgradeCommand.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var version, upgradeConfigArr, source, target, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        version = Project.projectData.getVersion();
                        if (!version) {
                            version = "5.1.0";
                        }
                        upgradeConfigArr = [
                            { "v": "5.1.1", command: Upgrade_5_1_1 },
                            { "v": "5.1.2", command: Upgrade_5_1_2 },
                            { "v": "5.2.13", command: Upgrade_5_2_13 },
                            { "v": "5.2.17", command: Upgrade_5_2_17 },
                            { "v": "5.2.19", command: Upgrade_5_2_19 },
                            { "v": "5.2.22", command: Upgrade_5_2_22 },
                            { "v": "5.2.23", command: Upgrade_5_2_23 },
                            { "v": "5.2.25", command: Upgrade_5_2_25 },
                            { "v": "5.2.28", command: Upgrade_5_2_28 },
                            { "v": "5.2.31", command: Upgrade_5_2_31 },
                            { "v": "5.2.32", command: Upgrade_5_2_32 },
                            { "v": "5.2.33", command: Upgrade_5_2_33 },
                            { "v": "5.3.5", command: Upgrade_5_3_5 },
                            { "v": "5.3.6", command: Upgrade_5_3_6 },
                            { "v": "5.3.8", command: Upgrade_5_3_8 },
                            { "v": "5.3.9", command: Upgrade_5_3_9 },
                            { "v": "5.3.10", command: Upgrade_5_3_10 },
                            { "v": "5.4.0", command: Upgrade_5_4_0 },
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, series(upgrade, upgradeConfigArr.concat())];
                    case 2:
                        _a.sent();
                        Project.projectData.save(upgradeConfigArr.pop().v);
                        globals.log(1702);
                        service.client.closeServer(Project.projectData.getProjectRoot());
                        return [4 /*yield*/, new Clean().execute()];
                    case 3:
                        _a.sent();
                        source = path.join(egret.root, "tools/templates/empty/scripts/api.d.ts");
                        target = path.join(egret.args.projectDir, "scripts/api.d.ts");
                        file.copy(source, target);
                        globals.exit(0);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        globals.log(1717);
                        console.log(e_1);
                        globals.exit(1705);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return UpgradeCommand;
}());
var series = function (cb, arr) {
    var parallel = 1;
    // allow default parallel count of 1 if array
    // passed as second param (this a good idea?)
    if (Array.isArray(parallel)) {
        arr = parallel;
        parallel = 1;
    }
    var results = [];
    var promises = [];
    for (var i = 0; i < parallel; i++)
        promises.push(Promise.resolve());
    arr.forEach(function (item, ix) {
        var position = ix % parallel;
        var promise = promises[position];
        promises[position] = promise.then(function () {
            return Promise.resolve(cb(item, ix, results))
                .then(function (res) { return results.push(res); });
        });
    });
    return Promise.all(promises)
        .then(function () { return results; });
};
function upgrade(info) {
    var version = Project.projectData.getVersion();
    var v = info.v;
    var command;
    if (info.command) {
        command = new info.command();
    }
    var result = globals.compressVersion(version, v);
    if (result < 0) {
        globals.log(1704, v);
        if (!command) {
            return Promise.resolve(0);
        }
        else {
            var commandPromise = command.execute();
            if (typeof commandPromise == 'number') {
                console.error('internal error !!!');
            }
            else {
                return commandPromise;
            }
        }
    }
    else {
        return Promise.resolve(0);
    }
}
var Upgrade_5_1_1 = (function () {
    function Upgrade_5_1_1() {
    }
    Upgrade_5_1_1.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_1_1;
}());
var Upgrade_5_1_2 = (function () {
    function Upgrade_5_1_2() {
    }
    Upgrade_5_1_2.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("【警告】: 如果您尝试发布到微信小游戏，建议您创建一个新项目，而不是使用 egret upgrade 命令");
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_1_2;
}());
var Upgrade_5_2_13 = (function () {
    function Upgrade_5_2_13() {
    }
    Upgrade_5_2_13.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "baidugame"), path.join(egret.args.projectDir, "scripts", "baidugame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.baidugame.ts"), path.join(egret.args.projectDir, "scripts", "config.baidugame.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_2_13;
}());
var Upgrade_5_2_17 = (function () {
    function Upgrade_5_2_17() {
    }
    Upgrade_5_2_17.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "qgame"), path.join(egret.args.projectDir, "scripts", "qgame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.qgame.ts"), path.join(egret.args.projectDir, "scripts", "config.qgame.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_2_17;
}());
var Upgrade_5_2_19 = (function () {
    function Upgrade_5_2_19() {
    }
    Upgrade_5_2_19.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "oppogame"), path.join(egret.args.projectDir, "scripts", "oppogame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.oppogame.ts"), path.join(egret.args.projectDir, "scripts", "config.oppogame.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_2_19;
}());
var Upgrade_5_2_22 = (function () {
    function Upgrade_5_2_22() {
    }
    Upgrade_5_2_22.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "vivogame"), path.join(egret.args.projectDir, "scripts", "vivogame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.vivogame.ts"), path.join(egret.args.projectDir, "scripts", "config.vivogame.ts"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "api.d.ts"), path.join(egret.args.projectDir, "scripts", "api.d.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_2_22;
}());
var Upgrade_5_2_23 = (function () {
    function Upgrade_5_2_23() {
    }
    Upgrade_5_2_23.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "vivogame"), path.join(egret.args.projectDir, "scripts", "vivogame"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_2_23;
}());
var Upgrade_5_2_25 = (function () {
    function Upgrade_5_2_25() {
    }
    Upgrade_5_2_25.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "qqgame"), path.join(egret.args.projectDir, "scripts", "qqgame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.qqgame.ts"), path.join(egret.args.projectDir, "scripts", "config.qqgame.ts"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "mygame"), path.join(egret.args.projectDir, "scripts", "mygame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.mygame.ts"), path.join(egret.args.projectDir, "scripts", "config.mygame.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_2_25;
}());
var Upgrade_5_2_28 = (function () {
    function Upgrade_5_2_28() {
    }
    Upgrade_5_2_28.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "vivogame"), path.join(egret.args.projectDir, "scripts", "vivogame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.vivogame.ts"), path.join(egret.args.projectDir, "scripts", "config.vivogame.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_2_28;
}());
var Upgrade_5_2_31 = (function () {
    function Upgrade_5_2_31() {
    }
    Upgrade_5_2_31.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "wxgame"), path.join(egret.args.projectDir, "scripts", "wxgame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.wxgame.ts"), path.join(egret.args.projectDir, "scripts", "config.wxgame.ts"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "api.d.ts"), path.join(egret.args.projectDir, "scripts", "api.d.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_2_31;
}());
var Upgrade_5_2_32 = (function () {
    function Upgrade_5_2_32() {
    }
    Upgrade_5_2_32.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "qqgame"), path.join(egret.args.projectDir, "scripts", "qqgame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.qqgame.ts"), path.join(egret.args.projectDir, "scripts", "config.qqgame.ts"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "api.d.ts"), path.join(egret.args.projectDir, "scripts", "api.d.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_2_32;
}());
var Upgrade_5_2_33 = (function () {
    function Upgrade_5_2_33() {
    }
    Upgrade_5_2_33.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "mygame"), path.join(egret.args.projectDir, "scripts", "mygame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.mygame.ts"), path.join(egret.args.projectDir, "scripts", "config.mygame.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_2_33;
}());
var Upgrade_5_3_5 = (function () {
    function Upgrade_5_3_5() {
    }
    Upgrade_5_3_5.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "qhgame"), path.join(egret.args.projectDir, "scripts", "qhgame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.qhgame.ts"), path.join(egret.args.projectDir, "scripts", "config.qhgame.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_3_5;
}());
var Upgrade_5_3_6 = (function () {
    function Upgrade_5_3_6() {
    }
    Upgrade_5_3_6.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.vivogame.ts"), path.join(egret.args.projectDir, "scripts", "config.vivogame.ts"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "wxgame"), path.join(egret.args.projectDir, "scripts", "wxgame"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_3_6;
}());
var Upgrade_5_3_8 = (function () {
    function Upgrade_5_3_8() {
    }
    Upgrade_5_3_8.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "ttgame"), path.join(egret.args.projectDir, "scripts", "ttgame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.ttgame.ts"), path.join(egret.args.projectDir, "scripts", "config.ttgame.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_3_8;
}());
var Upgrade_5_3_9 = (function () {
    function Upgrade_5_3_9() {
    }
    Upgrade_5_3_9.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "fastgame"), path.join(egret.args.projectDir, "scripts", "fastgame"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.fastgame.ts"), path.join(egret.args.projectDir, "scripts", "config.fastgame.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_3_9;
}());
var Upgrade_5_3_10 = (function () {
    function Upgrade_5_3_10() {
    }
    Upgrade_5_3_10.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "tbcreativeapp"), path.join(egret.args.projectDir, "scripts", "tbcreativeapp"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.tbcreativeapp.ts"), path.join(egret.args.projectDir, "scripts", "config.tbcreativeapp.ts"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_3_10;
}());
var Upgrade_5_4_0 = (function () {
    function Upgrade_5_4_0() {
    }
    Upgrade_5_4_0.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.ts"), path.join(egret.args.projectDir, "scripts", "config.ts"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.wxgame.ts"), path.join(egret.args.projectDir, "scripts", "config.wxgame.ts"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "api.d.ts"), path.join(egret.args.projectDir, "scripts", "api.d.ts"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "plugins", "iconv-lite"), path.join(egret.args.projectDir, "scripts", "plugins", "iconv-lite"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "plugins", "wxgameIDEPlugin.ts"), path.join(egret.args.projectDir, "scripts", "plugins", "wxgameIDEPlugin.ts"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "config.tbcreativewidget"), path.join(egret.args.projectDir, "scripts", "config.tbcreativewidget"));
                file.copyAsync(path.join(egret.root, "tools", "templates", "empty", "scripts", "tbcreativewidget"), path.join(egret.args.projectDir, "scripts", "tbcreativewidget"));
                return [2 /*return*/, 0];
            });
        });
    };
    return Upgrade_5_4_0;
}());
module.exports = UpgradeCommand;
