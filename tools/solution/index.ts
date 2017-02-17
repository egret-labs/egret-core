import * as Server from '../server/server';
import * as TypeScriptProject from './TypeScritpProject';




export function run() {
    let projectRoot = egret.args.projectDir;
    let params = "";



    let server2 = new Server();
    server2.use(TypeScriptProject.middleware);
    server2.start(projectRoot, 5000, "http://localhost:5000/index.html", false);

    let server = new Server();
    server.use(async);
    server.start(projectRoot, 4000, "http://localhost:4000/index.html");

}

import * as http from 'http';

let fetch = () => {
    return new Promise((reslove, reject) => {

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

let async: Server.Middleware = () => {
    return async () => {
        console.log("async:1111")
        await fetch();
        console.log("async:2222")
    }
}


enum State {

    PENDING,
    DURING,
    ERROR,

}

let info = {

    code: 0,

}