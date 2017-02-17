import * as Server from '../server/server';
import * as TypeScriptProject from './TypeScritpProject';


export function run() {
    let projectRoot = egret.args.projectDir;
    let params = "";
    let server = new Server();
    server.use(TypeScriptProject.middleware);
    server.start(projectRoot, 4000, "http://localhost:4000/index.html");



}