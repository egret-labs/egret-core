import * as Server from '../server/server';
import * as watch from '../lib/watch';
export var middleware: (project: string) => Server.Middleware = (project) => {



    let start = "res-watch:file changed start";
    let end = "res-watch:file changed finish";

    function executeEgretBuild() {

    }


    watch.createMonitor(project, { persistent: true, interval: 2007, filter: (f, stat) => !f.match(/\.g(\.d)?\.ts/) }, (m) => {
        m.on("created", (f) => console.log(f))
            .on("removed", (f) => console.log(f))
            .on("changed", (f) => console.log(f));
    });

    return () => {
        return async (request, response) => {

        }
    }
}