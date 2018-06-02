import * as utils from '../lib/utils';
import * as tasks from '../tasks';
import * as parseConfig from '../actions/ParseConfig'
import { buildBefore } from '../actions/TargetAction';

class Bake implements egret.Command {
    @utils.measure
    async execute() {
        utils.checkEgret();

        const res = require('../lib/resourcemanager');
        const command = "bake";
        const projectRoot = egret.args.projectDir;
        tasks.run();
        const target = egret.args.target;
        const projectConfig = parseConfig.parseConfig();
        await res.build({ projectRoot, debug: true, command, target, projectConfig }, buildBefore);
        return global.exitCode;
    }
}


export = Bake;
