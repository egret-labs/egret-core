import { data } from './ProjectData';
import * as FileUtil from '../lib/FileUtil';
import * as project from "../actions/Project";

export namespace manager {

    export function copyToLibs() {
        let moduleDir = data.getLibraryFolder();
        FileUtil.remove(moduleDir);
        data.getModulesConfig("web").forEach(m => {
            FileUtil.copy(m.sourceDir, data.getFilePath(m.targetDir));
        })
    }

    export function generateManifest(gameFileList: string[], manifestPath?: string, isDebug: boolean = true, platform: "web" | "native" = "web") {
        let initial = [];
        data.getModulesConfig(platform).forEach(m => {
            m.target.forEach(m => {
                initial.push(m.debug);
            });
        });
        if (isDebug) {
            gameFileList.forEach(m => {
                initial.push("bin-debug/" + m);
            });
        }
        else {
            initial.push("main.min.js");
        }

        //todo res config
        let manifest = { initial };
        if (!manifestPath) {
            manifestPath = FileUtil.joinPath(egret.args.projectDir, "manifest.json");
        }
        FileUtil.save(manifestPath, JSON.stringify(manifest, undefined, "\t"));
    }

    export function modifyNativeRequire() {
        let options = egret.args;
        let indexPath = data.getFilePath('index.html');
        let requirePath = FileUtil.joinPath(options.templateDir, "runtime", "native_require.js");
        let requireContent = FileUtil.read(requirePath);
        if (requireContent == "") {
            globals.exit(10021);
        }
        let optionStr = project.getNativeProjectInfo(indexPath);
        let reg = /\/\/----auto option start----[\s\S]*\/\/----auto option end----/;
        let replaceStr = '\/\/----auto option start----\n\t\t' + optionStr + '\n\t\t\/\/----auto option end----';
        requireContent = requireContent.replace(reg, replaceStr);
        FileUtil.save(requirePath, requireContent);
    }

    export function copyLibsForPublish(manifestPath: string, toPath: string, platform: "web" | "native"): void {
        let options = egret.args;
        let manifest = JSON.parse(FileUtil.read(manifestPath));
        let fileLength = manifest.initial.length;
        data.getModulesConfig(platform).forEach(m => {
            m.target.forEach(m => {
                FileUtil.copy(FileUtil.joinPath(options.projectDir, m.release),
                    FileUtil.joinPath(toPath, m.release));
                for (let i = 0; i < fileLength; i++) {
                    if (manifest.initial[i] == m.debug) {
                        manifest.initial.splice(i, 1, m.release);
                        break;
                    }
                }
            });
        });
        FileUtil.save(manifestPath, JSON.stringify(manifest, undefined, "\t"));
    }

    export function copyManifestForNative(toPath: string): void {
        let options = egret.args;
        let manifest = JSON.parse(FileUtil.read(FileUtil.joinPath(options.projectDir, "manifest.json")));
        let fileLength = manifest.initial.length;
        for (let i = 0; i < fileLength; i++) {
            if (manifest.initial[i].indexOf(".web.") != -1) {
                manifest.initial[i] = manifest.initial[i].replace(".web.", ".native.");
            }
        }
        FileUtil.save(toPath, JSON.stringify(manifest));
    }
}



