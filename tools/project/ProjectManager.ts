import { data } from './ProjectData';
import * as FileUtil from '../lib/FileUtil';

export namespace manager {

    export function copyToLibs() {
        let moduleDir = data.getLibraryFolder();
        FileUtil.remove(moduleDir);
        data.getModulesConfig("web").forEach(m => {
            FileUtil.copy(m.sourceDir, data.getFilePath(m.targetDir));
        })
    }

    export async function generateManifest(gameFileList: string[]) {
        let initial = [];
        data.getModulesConfig("web").forEach(m => {
            m.target.forEach(m => {
                initial.push(m.debug);
            });
        });
        gameFileList.forEach(m => {
            initial.push("bin-debug/" + m);
        });
        //todo res config
        let manifest = { initial };
        FileUtil.save(FileUtil.joinPath(egret.args.projectDir, "manifest.json"), JSON.stringify(manifest, undefined, "\t"));
        FileUtil.copy(FileUtil.joinPath(egret.args.projectDir, "template", "debug", "index.html"),
            FileUtil.joinPath(egret.args.projectDir, "index.html"));
    }
}



