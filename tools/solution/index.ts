import * as Server from '../server/server';
import * as Dashboard from './Dashboard';
import * as cp from 'child_process';
import * as FileUtil from '../lib/FileUtil';

export type Solution = {

    modules: {
        [moduleName: string]: {
            root: string,
            type: "extra" | "tsc-plus" | "res",
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
                typescriptServer.use(watchProject(m.root));
                typescriptServer.start(projectRoot, 4000, "http://localhost:4000/index.html", false);
                break;
            case "res":

        }
    }


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



let watchProject: (project: string) => Server.Middleware = (project) => {

    let output = "";
    let state = 0;
    let process = cp.exec(`egret startup ${project}`, (error) => {
        console.log(error)
    })
    process.stdout.on("data", (data) => {
        state = 1;
        output += data;
    })

    return () => {
        let result = "";
        return async (request, response) => {
            response.writeHead(200, { "Content-Type": "application/json" })
            response.end(JSON.stringify({ state, output }));
        }
    }
}
