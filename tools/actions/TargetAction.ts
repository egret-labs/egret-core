import { launcher } from "../project";
import * as path from 'path';
import * as FileUtil from '../lib/FileUtil'

export type TargetTemplateConfig = {

    needSign?: boolean,

    templatePath: string;

    projectType: string;

    args: { name: string, files: string[], default?: string }[];

    scripts?: {
        before?: string
    }
}

export async function buildBefore(context) {
    // console.log(context)
    let target = egret.args.target;
    if (target != 'web') {
        // target = 'qgame'
        // const targetRoot = path.resolve(__dirname, '../../egret-target-wxgame/target');
        const targetRoot = launcher.getLauncherLibrary().getTarget(target);
        if (!targetRoot) {
            throw `找不到 target ${target},请在 Egret Launcher 中安装`
        }
        const targetData = await FileUtil.readJSONAsync(path.join(targetRoot, 'target.json'));
        if (targetData.scripts && targetData.scripts.before) {
            const before = path.join(targetRoot, targetData.scripts.before);
            await require(before).run(context)
        }
    }

}
