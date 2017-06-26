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
        let game = [];
        data.getModulesConfig(platform).forEach(m => {
            m.target.forEach(m => {
                initial.push(isDebug ? m.debug : m.release);
            });
        });
        if (isDebug) {
            gameFileList.forEach(m => {
                game.push("bin-debug/" + m);
            });
        }
        else {
            game.push("main.min.js");
        }

        let manifest = { initial, game };
        if (!manifestPath) {
            manifestPath = FileUtil.joinPath(egret.args.projectDir, "manifest.json");
        }
        FileUtil.save(manifestPath, JSON.stringify(manifest, undefined, "\t"));
    }

    export function modifyNativeRequire(manifestPath:string) {
        let options = egret.args;
        let indexPath = data.getFilePath('index.html');
        let requirePath = FileUtil.joinPath(options.templateDir, "runtime", "native_require.js");
        let requireContent = FileUtil.read(requirePath);
        if (requireContent == "") {
            globals.exit(10021);
        }
        if (!data.useTemplate) {
            let manifest = JSON.parse(FileUtil.read(manifestPath));
            let fileList:Array<string> = manifest.initial.concat(manifest.game);
            let listStr = "\n";
            fileList.forEach(function (filepath) {
                filepath = filepath.replace(".web.", ".native.");
                listStr += '\t"' + filepath + '",\n';
            });
            let reg = /\/\/----auto game_file_list start----[\s\S]*\/\/----auto game_file_list end----/;
            let replaceStr = '\/\/----auto game_file_list start----' + listStr + '\t\/\/----auto game_file_list end----';
            requireContent = requireContent.replace(reg, replaceStr);
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
        data.getModulesConfig(platform).forEach(m => {
            m.target.forEach(m => {
                FileUtil.copy(FileUtil.joinPath(options.projectDir, m.release),
                    FileUtil.joinPath(toPath, m.release));
            });
        });
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

    export function modifyIndex(manifestPath: string, indexPath: string) {
        if (!data.useTemplate) {
            let manifest = JSON.parse(FileUtil.read(manifestPath, true));
            let libs = manifest.initial;
            var libsScriptsStr = "";
            libs.forEach(m => {
                libsScriptsStr += getScript("lib", m);
            });
            let game = manifest.game;
            var gameStr = "";
            game.forEach(m => {
                gameStr += getScript("lib", m);
            });
            var reg = /<!--(\s)*modules_files_start(\s)*-->[\s\S]*<!--(\s)*modules_files_end(\s)*-->/;
            var replaceStr = '<!--modules_files_start-->\n' + libsScriptsStr + '\t<!--modules_files_end-->';
            var htmlContent = FileUtil.read(indexPath, true);
            htmlContent = htmlContent.replace(reg, replaceStr);
            var reg = /<!--(\s)*game_files_start(\s)*-->[\s\S]*<!--(\s)*game_files_end(\s)*-->/;
            var replaceStr = '<!--game_files_start-->\n' + gameStr + '\t<!--game_files_end-->';
            htmlContent = htmlContent.replace(reg, replaceStr);
            var reg = /<!--(\s)*other_libs_files_start(\s)*-->[\s\S]*<!--(\s)*other_libs_files_end(\s)*-->/;
            var replaceStr = '';
            htmlContent = htmlContent.replace(reg, replaceStr);
            FileUtil.save(indexPath, htmlContent);
        }
    }

    function getScript(type: 'lib' | 'game', src: string) {
        switch (type) {
            case 'lib':
                return `\t<script egret="${type}" src="${src}"></script>\n`
                break;
            case 'game':
                return `\t<script egret="${type}" src="${src}"></script>\n`;
                break;
        }
    }
}