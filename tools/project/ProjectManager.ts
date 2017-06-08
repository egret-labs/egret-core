import { data } from './ProjectData';
import * as FileUtil from '../lib/FileUtil';
import * as ejs from '../lib/ejs/ejs';

export namespace manager {

    export function copyToLibs() {
        let moduleDir = data.getLibraryFolder();
        FileUtil.remove(moduleDir);
        data.getModulesConfig("web").forEach(m => {
            FileUtil.copy(m.sourceDir, data.getFilePath(m.targetDir));
        })
    }

    export async function compileDebugHTML() {
        let templateFilePath = data.getFilePath("template/debug/index.ejs");
        let content = await FileUtil.readFileAsync(templateFilePath, "utf-8");
        // FileUtil.copy(templateFilePath, data.getFilePath("index.html"));
        let options = {};
        // => Rendered HTML string
        let templateData = data.getModulesConfig("web");
        console.log(templateData)

        content = ejs.render(content, { modules: templateData }, options);
        console.log(content)

        // => Rendered HTML string

    }
}



