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

    export async function compileDebugHTML() {
        let template = data.getFilePath("template/debug/index.html");
        let content = await FileUtil.readFileAsync(template, "utf-8");
        FileUtil.copy(template, data.getFilePath("index.html"));
    }
}



