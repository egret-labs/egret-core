import * as Server from '../server/server';
import * as TypeScriptProject from './TypeScritpProject';
import * as cp from 'child_process';


export function run() {
    let projectRoot = egret.args.projectDir;
    let server = new Server();
    server.use(watchProject("manghuangji_client"));
    server.start(projectRoot, 4000, "http://localhost:4000/index.html");

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

let watchProject = (project) => {

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
            response.end(JSON.stringify({ state, output }));
        }
    }
}
