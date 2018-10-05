class EgretResourceManager implements egret.Command {

    async execute() {

        let res = require('../lib/resourcemanager');
        let handleException = res.handleException;
        let ResourceManagerUserConfig = res.ResourceManagerUserConfig;


        function getProjectPath(p: string | null) {
            return p ? p : ".";
        }

        let command = process.argv[3];
        let projectRoot = getProjectPath(process.argv[4]);

        return executeCommand(command).catch(handleException);

        async function executeCommand(command: string) {

            switch (command) {
                case "version":
                    return res.version();
                    break;
                case "upgrade":
                    return res.upgrade(projectRoot);
                    break;
                case "build":
                case "publish":
                    return res.build({ projectRoot, debug: true, command });
                    break;
                case "config":
                    return res.printConfig(projectRoot);
                    break;
                case "env":
                    const key = process.argv[3];
                    const value = process.argv[4];
                    if (key != "texture_merger_path") {
                        handleException(`找不到指定的命令{command}`);
                        return null;
                    }
                    else {
                        return res.setEnv(key, value);
                    }

                    break;
                default:
                    handleException(`找不到指定的命令{command}`);
                    return null;
                    break;
            }
        }
    }

}

export = EgretResourceManager



