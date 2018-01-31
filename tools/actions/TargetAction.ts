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
        // const target = await FileUtil.readJSONAsync(path.join(targetRoot, 'target.json'));
        // if (target.scripts && target.scripts.before) {
        //     const before = path.join(targetRoot, target.scripts.before);
        //     await require(before).run(context)
        // }
    }

}