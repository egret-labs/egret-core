import * as Server from '../server/server';
import * as child_process from 'child_process';
export var middleware: (p: string) => Server.Middleware = (p: string) => {

    let process = child_process.exec(`res watch ${p} -json`);
    let output = "";
    process.stdout.on("data", (data) => {
        output += data;
    })
    process.stderr.on("data", (data) => {
        output += data;
    })

    return () => {
        return async (request, response) => {
            response.writeHead(200, { "Content-Type": "application/json" })
            response.end(JSON.stringify({ output }));
        }
    }
}