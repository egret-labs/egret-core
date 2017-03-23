import * as Server from '../server/server';
import * as Dashboard from './Dashboard';
import * as cp from 'child_process';
import * as FileUtil from '../lib/FileUtil';
import * as Resource from './ResourceProject';
import * as TypeScript from './TypeScriptProject';
import * as EgretBuild from './EgretBuildProject';

import * as child_process from 'child_process';
export function childProcessWrapper(cmd: string, start: string, end: string) {
    let process = child_process.exec(cmd);
    let buffer = "";
    let state = 0;

    process.stdout.on("data", (data) => {
        state = 1
        buffer += data;
    })
    process.stderr.on("data", (data) => {
        state = 1
        buffer += data;
    })

    let getOutput = () => {

        let startIndex = buffer.lastIndexOf(start)
        let endIndex = buffer.lastIndexOf(end) + end.length;
        let output = "";
        if (startIndex < endIndex) {
            output = buffer.substring(startIndex, endIndex);
        } else {
            output = buffer.substring(startIndex);
        }
        return output;
    }


    return {
        getOutput
    }
}

export type Solution = {

    modules: {
        [moduleName: string]: {
            root: string,
            type: "extra" | "tsc-plus" | "res" | "egret-build",
            moduleName: string
        }
    }

}

function parseSolutionFile(path) {
    let content = FileUtil.read(path);
    let json: Solution = JSON.parse(content);
    for (var key in json.modules) {
        let m = json.modules[key];
        m.moduleName = key;
    }
    return json;
}

export function run(solutionFile: string) {
    let s = parseSolutionFile(solutionFile);
    let projectRoot = egret.args.projectDir;
    for (var key in s.modules) {
        let m = s.modules[key];
        switch (m.type) {
            case "tsc-plus":
                let typescriptServer = new Server();
                typescriptServer.use(TypeScript.middleware(m.root));
                typescriptServer.start(projectRoot, 4000, "http://localhost:4000/index.html", false);
                break;
            case "res":
                let resourceServer = new Server();
                resourceServer.use(Resource.middleware(m.root))
                resourceServer.start(projectRoot, 4001, "http://localhost:4001/index.html", false)
                break;
            case "egret-build":
                let egretBuildServer = new Server();
                egretBuildServer.use(EgretBuild.middleware(m.root));
                egretBuildServer.start(projectRoot, 4002, "http://localhost:4001/index.html", false)
                break;
        }
    }

    let staticServer = new Server();
    staticServer.use(Server.fileReader("."));
    staticServer.start(".", 3005, 'http://localhost:3005/index.html', false)

    let dashboardServer = new Server();
    dashboardServer.use(Dashboard.dashboard);
    dashboardServer.start(projectRoot, 5000, "http://localhost:5000/index.html")
}

import * as http from 'http';

let fetch = () => {
    return new Promise<string>((reslove, reject) => {

        var options = {
            hostname: '127.0.0.1',
            port: 5000,
            path: '/test',
            method: 'GET'
        };
        http.get(options, function (res) {
            var resData = "";
            res.on("data", function (data) {
                resData += data;
            });
            res.on("end", function () {
                reslove(resData)
            });
        })
    })
}