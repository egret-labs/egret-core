import { launcher } from "../project";
import * as path from 'path';
import * as FileUtil from '../lib/FileUtil'

export type TargetTemplateConfig = {

    templatePath: string;

    projectType: string;

    args: { name: string, files: string[], default?: string }[];

    scripts?: {
        before?: string
    }
}

export async function buildBefore(context) {
    // console.log(context)
    const target = egret.args.target;
    if (target != 'web') {
        // const targetRoot = path.resolve(__dirname, '../../egret-target-wxgame/target');
        const targetRoot = launcher.getLauncherLibrary().getTarget(target);
        const targetData = await FileUtil.readJSONAsync(path.join(targetRoot, 'target.json'));
        if (targetData.scripts && targetData.scripts.before) {
            const before = path.join(targetRoot, targetData.scripts.before);
            await require(before).run(context)
        }
    }

}