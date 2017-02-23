import * as Server from '../server/server';

import * as solution from './';



export var middleware: (p: string) => Server.Middleware = (p: string) => {

    let start = "res-watch:file changed start";
    let end = "res-watch:file changed finish";
    let process = solution.childProcessWrapper(`res watch ${p} -json`, start, end);


    return () => {
        let index = 0;
        return async (request, response) => {

            response.writeHead(200, { "Content-Type": "application/json" })
            response.end(JSON.stringify({ output: process.getOutput() }));
        }
    }
}