import service = require("../service/index");

class Service implements egret.Command {
    execute() {
        service.server.run();
        return DontExitCode
    }
}

export = Service;