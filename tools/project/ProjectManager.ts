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
}


