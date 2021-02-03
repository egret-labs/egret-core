import cp = require('child_process');
import path = require('path');
import fs = require("fs");
import * as os from 'os';

/**
 * Webpack 插件
 * 允许在白鹭引擎中使用 webpack
 */
export class wxgameIDEPlugin implements plugins.Command {

    constructor() {
    }

    async onFile(file: plugins.File) {
        return file;
    }

    onFinish(commandContext: plugins.CommandContext) {
        return runWxIde(commandContext.projectRoot)
    }
}


async function runWxIde(projectDir: string) {
    let wxPaths: string[] = [];
    switch (os.platform()) {
        case "darwin":
            const result = await executeCommand("defaults read com.tencent.wechat.devtools LastRunAppBundlePath");
            if (result.stdout != '') {
                const stdout = result.stdout.replace(/\n/g, "");
                wxPaths = [FileUtil.joinPath(stdout, "/Contents/Resources/app.nw/bin/cli")];
            }
            // defaults read
            wxPaths.push("/Applications/wechatwebdevtools.app/Contents/Resources/app.nw/bin/cli");
            break;
        case "win32":
            // defaults read
            wxPaths = [
                "C:\\Program Files (x86)\\Tencent\\微信web开发者工具\\cli.bat",
                "C:\\Program Files\\Tencent\\微信web开发者工具\\cli.bat"
            ];
            const iconv = require('./iconv-lite');
            const encoding = 'cp936';
            const binaryEncoding = 'binary';
            const result2 = await executeCommand('REG QUERY "HKLM\\SOFTWARE\\Wow6432Node\\Tencent\\微信web开发者工具"', { encoding: binaryEncoding });
            const stdout = iconv.decode(new Buffer(result2.stdout, binaryEncoding), encoding);
            if (stdout != '') {
                const stdoutArr = stdout.split("\r\n");
                let exePath: string = stdoutArr.find((path) => path.indexOf(".exe") != -1);
                exePath = exePath.split("  ").find((path) => path.indexOf(".exe") != -1)!;
                exePath = path.join(path.dirname(exePath), 'cli.bat');
                wxPaths.unshift(exePath);
            }
            break;
    }
    const wxpath = wxPaths.find((wxpath) => FileUtil.exists(wxpath));
    if (wxpath) {
        let projectPath = projectDir;
        projectPath = path.resolve(projectPath, "../", path.basename(projectPath) + "_wxgame");
        try {
            await shell(wxpath, ["-o", projectPath, "-f", "egret"], undefined, true);
        }
        catch (e) {
            await shell(wxpath, ["-o", projectPath], undefined, true);
        }
    }
    else {
        throw '请安装最新微信开发者工具'
    }
}

export async function executeCommand(command: string, options = {}) {
    return new Promise<{ error: Error, stdout: string, stderr: string }>((resolve, reject) => {
        cp.exec(command, options, (error, stdout, stderr) => {
            resolve({ error, stdout, stderr })
        });
    })
}

export function shell(path: string, args: string[], opt?: cp.ExecOptions, verbase?: boolean) {
    let stdout = "";
    let stderr = "";

    var cmd = `${path} ${args.join(" ")}`;
    if (verbase) {
        console.log(cmd);
    }
    let printStdoutBufferMessage = (message) => {
        var str = message.toString();
        stdout += str;
        if (verbase) {
            console.log(str);
        }
    };
    let printStderrBufferMessage = (message) => {
        var str = message.toString();
        stderr += str;
        if (verbase) {
            console.log(str);
        }
    };

    type Result = { code: number, stdout: string, stderr: string, path: string, args: any[] };

    return new Promise<Result>((resolve, reject) => {
        // path = "\"" + path + "\"";
        // var shell = cp.spawn(path + " " + args.join(" "));
        var shell = cp.spawn(path, args);
        shell.on("error", (message) => { console.log(message); });
        shell.stderr!.on("data", printStderrBufferMessage);
        shell.stderr!.on("error", printStderrBufferMessage);
        shell.stdout!.on("data", printStdoutBufferMessage);
        shell.stdout!.on("error", printStdoutBufferMessage);
        shell.on('exit', function (code) {
            if (code != 0) {
                if (verbase) {
                    console.log('Failed: ' + code);
                }
                reject({ code, stdout, stderr, path, args });
            }
            else {
                resolve({ code, stdout, stderr, path, args });
            }
        });
    });
};


namespace FileUtil {
    /**
     * 转换本机路径为Unix风格路径。
     */
    export function escapePath(path: string): string {
        if (!path)
            return "";
        return path.split("\\").join("/");
    }

    /**
     * 指定路径的文件或文件夹是否存在
     */
    export function exists(path: string): boolean {
        path = escapePath(path);
        return fs.existsSync(path);
    }

    /**
     * 连接路径,支持传入多于两个的参数。也支持"../"相对路径解析。返回的分隔符为Unix风格。
     */
    export function joinPath(dir: string, ...filename: string[]): string {
        var path = path.join.apply(null, arguments);
        path = escapePath(path);
        return path;
    }
}