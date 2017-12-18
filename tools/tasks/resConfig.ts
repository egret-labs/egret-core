import * as plugin from './';
import * as path from 'path';
import { Plugin } from './';


const wing_res_json = "wing.res.json";

async function executeFilter(url: string) {
    if (url == wing_res_json) {
        return null;
    }
    let type = ResourceConfig.typeSelector(url);
    let name = url;
    if (type) {
        return { name, url, type }
    }
    else {
        return null;
    }
}

type EmitResConfigFilePluginOptions = { output: string, typeSelector: (path: string) => string }


export class EmitResConfigFilePlugin implements Plugin {

    constructor(private options: EmitResConfigFilePluginOptions) {
        ResourceConfig.typeSelector = options.typeSelector;
    }

    async  onFile(file: plugin.File): Promise<plugin.File> {

        const filename = file.origin;
        if (filename.indexOf('resource/') === -1) {
            return null;
        }
        else {
            let r = await executeFilter(filename)
            if (r) {
                r.url = file.relative;
                ResourceConfig.addFile(r, true);
                return file;
            }
            else {
                return null;
            }
        }

    }
    async  onFinish(param: plugin.PluginContext): Promise<void> {


        //         async function convertResourceJson(projectRoot: string, config: Data) {

        //             let filename = path.join(projectRoot, "resource/default.res.json");
        //             if (!fs.existsSync(filename)) {
        //                 filename = path.join(projectRoot, "resource/resource.json");
        //             }
        //             if (!fs.existsSync(filename)) {
        //                 return;
        //             }
        //             let resourceJson: legacy.Info = await fs.readJSONAsync(filename);
        //             for (let r of resourceJson.resources) {

        //                 let resourceName = ResourceConfig.nameSelector(r.url);
        //                 let file = ResourceConfig.getFile(resourceName);
        //                 if (!file) {
        //                     if (await fs.existsAsync(path.join(pluginContext.resourceFolder, r.url))) {
        //                         ResourceConfig.addFile(r, false)
        //                     }
        //                     else {
        //                         console.error(`missing file ${r.name} ${r.url} `)
        //                     }
        //                     continue;
        //                 }
        //                 if (file.name != r.name) {
        //                     config.alias[r.name] = file.name;
        //                 }
        //                 for (var resource_custom_key in r) {
        //                     if (resource_custom_key == "url" || resource_custom_key == "name") {
        //                         continue;
        //                     }
        //                     else if (resource_custom_key == "subkeys") {
        //                         var subkeysArr = (r[resource_custom_key] as string).split(",");
        //                         for (let subkey of subkeysArr) {
        //                             // if (!obj.alias[subkeysArr[i]]) {
        //                             config.alias[subkey] = r.name + "#" + subkey;
        //                             file[resource_custom_key] = r[resource_custom_key];
        //                             // }
        //                         }
        //                     }
        //                     else {
        //                         // 包含 type 在内的自定义属性
        //                         file[resource_custom_key] = r[resource_custom_key];
        //                     }

        //                 }

        //             }
        //             for (let group of resourceJson.groups) {
        //                 config.groups[group.name] = group.keys.split(",");
        //             }

        //         }

        async function emitResourceConfigFile(debug: boolean) {
            const userConfig = ResourceConfig.userConfig;
            const config = ResourceConfig.generateConfig(true);
            const content = JSON.stringify(config, null, "\t");
            const file = `exports.typeSelector = ${ResourceConfig.typeSelector.toString()};
exports.resourceRoot = "${ResourceConfig.resourceRoot}";
exports.alias = ${JSON.stringify(config.alias, null, "\t")};
exports.groups = ${JSON.stringify(config.groups, null, "\t")};
exports.resources = ${JSON.stringify(config.resources, null, "\t")};
            `
            return file;
        }

        let config = ResourceConfig.getConfig();
        // await convertResourceJson(pluginContext.projectRoot, config);
        let configContent = await emitResourceConfigFile(true);
        param.createFile(this.options.output, new Buffer(configContent));

        let wingConfigContent = await ResourceConfig.generateClassicalConfig();
        // console.log(wingConfigContent)
        //         pluginContext.createFile(wing_res_json, new Buffer(wingConfigContent));
    }
}





namespace ResourceConfig {


    function loop(r: vfs.Dictionary, callback: (file: vfs.File) => void) {
        for (var key in r) {
            var f = r[key];
            if (isFile(f)) {
                callback(f);
            }
            else {
                loop(f, callback);
            }

        }
    }

    function isFile(r: any): r is vfs.File {
        return r.url;
    }

    export function getConfig() {
        return config;
    }

    export async function generateClassicalConfig() {
        let result: legacy.Info = {
            groups: [],
            resources: []
        }
        let resources = config.resources;

        let alias = {};
        for (var aliasName in config.alias) {
            alias[config.alias[aliasName]] = aliasName;
        }

        loop(resources, (f) => {
            let r: legacy.ResourceInfo = f;
            if (alias[r.name]) {
                r.name = alias[r.name]
            }
            result.resources.push(r);
            // console.log(f.name)
        })
        return JSON.stringify(result, null, "\t");
    }

    export function generateConfig(debug: boolean): GeneratedData {

        let loop = (r: GeneratedDictionary) => {
            for (var key in r) {
                var f = r[key];
                if (isFile(f)) {
                    if (typeof (f) == "string") {
                        continue;
                    }

                    if (!debug) {
                        delete f.name;
                        // console.log 
                        if (ResourceConfig.typeSelector(f.url) == f.type) {
                            delete f.type;
                        }
                        if (Object.keys(f).length == 1) {
                            r[key] = f.url;
                        }
                    }
                    // if (typeof f === 'string') {
                    //     f = { url: f, name: p };
                    //     r[key] = f;
                    // }
                    // else {
                    //     f['name'] = p;
                    // }
                }
                else {
                    loop(f);
                }

            }
        }

        let isFile = (r: GeneratedDictionary[keyof GeneratedDictionary]): r is GeneratedFile => {
            if (r['url']) {
                return true;
            }
            else {
                return false;
            }
        }

        let generatedData: GeneratedDictionary = JSON.parse(JSON.stringify(config.resources));
        loop(generatedData);
        let result: GeneratedData = {
            alias: config.alias,
            groups: config.groups,
            resources: generatedData
        }
        return result;
    }



    export var resourceRoot: string;

    export var typeSelector: (path: string) => string;

    export var nameSelector: (path: string) => string;

    export var mergeSelector: (path: string) => string | null;
    export var resourceConfigFileName: string;

    export type UserConfig = {
        outputDir: string,
        commands: string[]
    }


    export var userConfig: UserConfig

    var resourcePath: string;

    export function addFile(r: vfs.File, checkDuplicate: boolean) {
        let { url, name } = r;
        url = url.split("\\").join("/");
        name = name.split("\\").join("/");
        r.url = url;
        r.name = name;

        if (checkDuplicate) {
            let a = resourceVfs.getFile(r.name)
            if (a && a.url != r.url) {
                console.warn("duplicate: " + r.url + " => " + a.url)
            }
        }
        resourceVfs.addFile(r);
    }


    export function getFile(filename: string): vfs.File | undefined {
        return resourceVfs.getFile(filename);
    }
}


namespace vfs {
    export interface File {

        url: string;

        type: string;

        name: string;

    }

    export interface Dictionary {

        [file: string]: File | Dictionary

    }
    export class FileSystem {

        root: Dictionary = {};
        rootPath: string;

        init(d: Dictionary, rootPath: string) {
            this.root = d;
            this.rootPath = rootPath;
            return this.root;
        }



        addFile(r: File) {

            let { type, name, url } = r;
            if (!type) type = "";
            name = this.normalize(name);
            url = this.normalize(url);
            r.name = name;
            r.url = url;
            let basefilename = this.basename(name);
            let folder = this.dirname(name);
            if (!this.exists(folder)) {
                this.mkdir(folder);
            }
            let d = this.reslove(folder) as (Dictionary | null);
            if (d) {
                d[basefilename] = { url, type, name };
            }
        }

        getFile(filename: string): File | undefined {
            filename = this.normalize(filename);
            return this.reslove(filename) as File;
        }

        private basename(filename: string) {
            return filename.substr(filename.lastIndexOf("/") + 1);
        }

        private normalize(filename: string) {
            return filename.split("/").filter(d => !!d && d != this.rootPath).join("/");
        }

        private dirname(path: string) {
            return path.substr(0, path.lastIndexOf("/"));
        }

        private reslove(dirpath: string) {
            if (dirpath == "") {
                return this.root;
            }
            let list = dirpath.split("/");
            let current: File | Dictionary = this.root;
            for (let f of list) {
                current = current[f];
                if (!current) {
                    return null;
                }
            }
            return current;
        }

        private mkdir(dirpath: string) {
            dirpath = this.normalize(dirpath);
            let list = dirpath.split("/");
            let current = this.root;
            for (let f of list) {
                if (!current[f]) {
                    current[f] = {};
                }
                current = current[f] as Dictionary;
            }
        }

        private exists(dirpath: string) {
            if (dirpath == "") return true;
            dirpath = this.normalize(dirpath);
            let list = dirpath.split("/");
            let current = this.root;
            for (let f of list) {
                if (!current[f]) {
                    return false;
                }
                current = current[f] as Dictionary;
            }
            return true;
        }
    }

}

namespace legacy {


    export interface Info {
        groups: GroupInfo[],
        resources: ResourceInfo[],
    }

    export interface GroupInfo {
        keys: string,
        name: string
    }

    export interface ResourceInfo {
        name: string;
        type: string;
        url: string;
        subkeys?: string
    }
}

interface GeneratedDictionary {

    [file: string]: GeneratedFile | GeneratedDictionary

}

type GeneratedFile = string | vfs.File;

interface GeneratedData {

    resources: GeneratedDictionary

    groups: {
        [groupName: string]: string[]
    },

    alias: {
        [aliasName: string]: string
    }

}



interface Data {

    resources: vfs.Dictionary,

    groups: {
        [groupName: string]: string[]
    },

    alias: {
        [aliasName: string]: string
    }

}
var config: Data = { alias: [], groups: [], resources: {} } as any as Data;
const resourceVfs = new vfs.FileSystem();
resourceVfs.init(config.resources, "resource");