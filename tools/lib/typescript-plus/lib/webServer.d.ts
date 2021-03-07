declare namespace ts.server {
    interface HostWithWriteMessage {
        writeMessage(s: any): void;
    }
    interface WebHost extends HostWithWriteMessage {
        readFile(path: string): string | undefined;
        fileExists(path: string): boolean;
    }
    class BaseLogger implements Logger {
        protected readonly level: LogLevel;
        private seq;
        private inGroup;
        private firstInGroup;
        constructor(level: LogLevel);
        static padStringRight(str: string, padding: string): string;
        close(): void;
        getLogFileName(): string | undefined;
        perftrc(s: string): void;
        info(s: string): void;
        err(s: string): void;
        startGroup(): void;
        endGroup(): void;
        loggingEnabled(): boolean;
        hasLevel(level: LogLevel): boolean;
        msg(s: string, type?: Msg): void;
        protected canWrite(): boolean;
        protected write(_s: string, _type: Msg): void;
    }
    type MessageLogLevel = "info" | "perf" | "error";
    interface LoggingMessage {
        readonly type: "log";
        readonly level: MessageLogLevel;
        readonly body: string;
    }
    class MainProcessLogger extends BaseLogger {
        private host;
        constructor(level: LogLevel, host: HostWithWriteMessage);
        protected write(body: string, type: Msg): void;
    }
    function createWebSystem(host: WebHost, args: string[], getExecutingFilePath: () => string): ServerHost;
    interface StartSessionOptions {
        globalPlugins: SessionOptions["globalPlugins"];
        pluginProbeLocations: SessionOptions["pluginProbeLocations"];
        allowLocalPluginLoads: SessionOptions["allowLocalPluginLoads"];
        useSingleInferredProject: SessionOptions["useSingleInferredProject"];
        useInferredProjectPerProjectRoot: SessionOptions["useInferredProjectPerProjectRoot"];
        suppressDiagnosticEvents: SessionOptions["suppressDiagnosticEvents"];
        noGetErrOnBackgroundUpdate: SessionOptions["noGetErrOnBackgroundUpdate"];
        syntaxOnly: SessionOptions["syntaxOnly"];
        serverMode: SessionOptions["serverMode"];
    }
    class WorkerSession extends Session<{}> {
        private webHost;
        constructor(host: ServerHost, webHost: HostWithWriteMessage, options: StartSessionOptions, logger: Logger, cancellationToken: ServerCancellationToken, hrtime: SessionOptions["hrtime"]);
        send(msg: protocol.Message): void;
        protected parseMessage(message: {}): protocol.Request;
        protected toStringMessage(message: {}): string;
    }
}
//# sourceMappingURL=webServer.d.ts.map