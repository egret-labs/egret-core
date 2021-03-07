"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
/*@internal*/
var ts;
(function (ts) {
    var server;
    (function (server) {
        var BaseLogger = /** @class */ (function () {
            function BaseLogger(level) {
                this.level = level;
                this.seq = 0;
                this.inGroup = false;
                this.firstInGroup = true;
            }
            BaseLogger.padStringRight = function (str, padding) {
                return (str + padding).slice(0, padding.length);
            };
            BaseLogger.prototype.close = function () {
            };
            BaseLogger.prototype.getLogFileName = function () {
                return undefined;
            };
            BaseLogger.prototype.perftrc = function (s) {
                this.msg(s, server.Msg.Perf);
            };
            BaseLogger.prototype.info = function (s) {
                this.msg(s, server.Msg.Info);
            };
            BaseLogger.prototype.err = function (s) {
                this.msg(s, server.Msg.Err);
            };
            BaseLogger.prototype.startGroup = function () {
                this.inGroup = true;
                this.firstInGroup = true;
            };
            BaseLogger.prototype.endGroup = function () {
                this.inGroup = false;
            };
            BaseLogger.prototype.loggingEnabled = function () {
                return true;
            };
            BaseLogger.prototype.hasLevel = function (level) {
                return this.loggingEnabled() && this.level >= level;
            };
            BaseLogger.prototype.msg = function (s, type) {
                if (type === void 0) { type = server.Msg.Err; }
                switch (type) {
                    case server.Msg.Info:
                        ts.perfLogger.logInfoEvent(s);
                        break;
                    case server.Msg.Perf:
                        ts.perfLogger.logPerfEvent(s);
                        break;
                    default: // Msg.Err
                        ts.perfLogger.logErrEvent(s);
                        break;
                }
                if (!this.canWrite())
                    return;
                s = "[" + server.nowString() + "] " + s + "\n";
                if (!this.inGroup || this.firstInGroup) {
                    var prefix = BaseLogger.padStringRight(type + " " + this.seq.toString(), "          ");
                    s = prefix + s;
                }
                this.write(s, type);
                if (!this.inGroup) {
                    this.seq++;
                }
            };
            BaseLogger.prototype.canWrite = function () {
                return true;
            };
            BaseLogger.prototype.write = function (_s, _type) {
            };
            return BaseLogger;
        }());
        server.BaseLogger = BaseLogger;
        var MainProcessLogger = /** @class */ (function (_super) {
            __extends(MainProcessLogger, _super);
            function MainProcessLogger(level, host) {
                var _this = _super.call(this, level) || this;
                _this.host = host;
                return _this;
            }
            MainProcessLogger.prototype.write = function (body, type) {
                var level;
                switch (type) {
                    case server.Msg.Info:
                        level = "info";
                        break;
                    case server.Msg.Perf:
                        level = "perf";
                        break;
                    case server.Msg.Err:
                        level = "error";
                        break;
                    default:
                        ts.Debug.assertNever(type);
                }
                this.host.writeMessage({
                    type: "log",
                    level: level,
                    body: body,
                });
            };
            return MainProcessLogger;
        }(BaseLogger));
        server.MainProcessLogger = MainProcessLogger;
        function createWebSystem(host, args, getExecutingFilePath) {
            var returnEmptyString = function () { return ""; };
            var getExecutingDirectoryPath = ts.memoize(function () { return ts.memoize(function () { return ts.ensureTrailingDirectorySeparator(ts.getDirectoryPath(getExecutingFilePath())); }); });
            // Later we could map ^memfs:/ to do something special if we want to enable more functionality like module resolution or something like that
            var getWebPath = function (path) { return ts.startsWith(path, ts.directorySeparator) ? path.replace(ts.directorySeparator, getExecutingDirectoryPath()) : undefined; };
            return {
                args: args,
                newLine: "\r\n",
                useCaseSensitiveFileNames: false,
                readFile: function (path) {
                    var webPath = getWebPath(path);
                    return webPath && host.readFile(webPath);
                },
                write: host.writeMessage.bind(host),
                watchFile: ts.returnNoopFileWatcher,
                watchDirectory: ts.returnNoopFileWatcher,
                getExecutingFilePath: function () { return ts.directorySeparator; },
                getCurrentDirectory: returnEmptyString,
                /* eslint-disable no-restricted-globals */
                setTimeout: setTimeout,
                clearTimeout: clearTimeout,
                setImmediate: function (x) { return setTimeout(x, 0); },
                clearImmediate: clearTimeout,
                /* eslint-enable no-restricted-globals */
                require: function () { return ({ module: undefined, error: new Error("Not implemented") }); },
                exit: ts.notImplemented,
                // Debugging related
                getEnvironmentVariable: returnEmptyString,
                // tryEnableSourceMapsForHost?(): void;
                // debugMode?: boolean;
                // For semantic server mode
                fileExists: function (path) {
                    var webPath = getWebPath(path);
                    return !!webPath && host.fileExists(webPath);
                },
                directoryExists: ts.returnFalse,
                readDirectory: ts.notImplemented,
                getDirectories: function () { return []; },
                createDirectory: ts.notImplemented,
                writeFile: ts.notImplemented,
                resolvePath: ts.identity, // Plugins
                // realpath? // Module resolution, symlinks
                // getModifiedTime // File watching
                // createSHA256Hash // telemetry of the project
                // Logging related
                // /*@internal*/ bufferFrom?(input: string, encoding?: string): Buffer;
                // gc?(): void;
                // getMemoryUsage?(): number;
            };
        }
        server.createWebSystem = createWebSystem;
        var WorkerSession = /** @class */ (function (_super) {
            __extends(WorkerSession, _super);
            function WorkerSession(host, webHost, options, logger, cancellationToken, hrtime) {
                var _this = _super.call(this, __assign(__assign({ host: host,
                    cancellationToken: cancellationToken }, options), { typingsInstaller: server.nullTypingsInstaller, byteLength: ts.notImplemented, // Formats the message text in send of Session which is overriden in this class so not needed
                    hrtime: hrtime,
                    logger: logger, canUseEvents: false })) || this;
                _this.webHost = webHost;
                return _this;
            }
            WorkerSession.prototype.send = function (msg) {
                if (msg.type === "event" && !this.canUseEvents) {
                    if (this.logger.hasLevel(server.LogLevel.verbose)) {
                        this.logger.info("Session does not support events: ignored event: " + JSON.stringify(msg));
                    }
                    return;
                }
                if (this.logger.hasLevel(server.LogLevel.verbose)) {
                    this.logger.info(msg.type + ":" + server.indent(JSON.stringify(msg)));
                }
                this.webHost.writeMessage(msg);
            };
            WorkerSession.prototype.parseMessage = function (message) {
                return message;
            };
            WorkerSession.prototype.toStringMessage = function (message) {
                return JSON.stringify(message, undefined, 2);
            };
            return WorkerSession;
        }(server.Session));
        server.WorkerSession = WorkerSession;
    })(server = ts.server || (ts.server = {}));
})(ts || (ts = {}));
//# sourceMappingURL=webServer.js.map