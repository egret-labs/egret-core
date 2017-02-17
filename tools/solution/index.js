var Server = require("../server/server");
var TypeScriptProject = require("./TypeScritpProject");
function run() {
    var projectRoot = egret.args.projectDir;
    var params = "";
    var server = new Server();
    server.use(TypeScriptProject.middleware);
    server.start(projectRoot, 4000, "http://localhost:4000/index.html");
}
exports.run = run;
