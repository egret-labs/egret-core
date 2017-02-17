import server = require('../server/server');


export function run() {
    let projectRoot = egret.args.projectDir;
    let params = "";
    server.startServer(projectRoot, 4000, "http://localhost:4000/index.html");
}