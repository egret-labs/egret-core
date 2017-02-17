var server = require("../server/server");
function run() {
    var projectRoot = egret.args.projectDir;
    var params = "";
    server.startServer(projectRoot, 4000, "http://localhost:4000/index.html");
}
exports.run = run;
