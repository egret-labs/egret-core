import * as plugin from './';
import * as path from 'path';
import { Plugin } from './';



const wing_res_json = "wing.res.json";

const filters = [
    wing_res_json,
]



type EmitResConfigFilePluginOptions = {
    output: string,
    typeSelector: (path: string) => string,
    nameSelector: (path: string) => string,
    groupSelector: (path: string) => string

}




export class EmitResConfigFilePlugin implements Plugin {

    private config: ResourceConfigData = { alias: {}, groups: {}, resources: {} };

    private fileSystem = new vfs.FileSystem();

    //todo
    private remoteConfig: ResourceConfigData = { alias: {}, groups: {}, resources: {} };
    private remoteFileSystem = new vfs.FileSystem();
    private remoteRoot = '';


    constructor(private options: EmitResConfigFilePluginOptions) {
        this.fileSystem.init(this.config.resources, "resource");
        this.remoteFileSystem.init(this.remoteConfig.resources, "resource");
        filters.push(options.output);
    }

    private executeFilter(file: plugin.File) {
        const fileOptions = file.options;
        const filename = file.origin;
        const url = file.relative.split('\\').join("/");
        const config = this.config;
        const options = this.options;
        if (filters.indexOf(filename) >= 0) {
            return null;
        }

        const type = options.typeSelector(filename);
        if (!type) {
            return null;
        }
        const name = options.nameSelector(filename);
        if (fileOptions && fileOptions.subkeys && Array.isArray(fileOptions.subkeys)) {
            fileOptions.subkeys = fileOptions.subkeys.map(p => options.nameSelector(p)).join(",");
        }

        const groupName = options.groupSelector(filename);
        if (groupName) {
            if (!config.groups[groupName]) {
                config.groups[groupName] = [];
            }
            const group = config.groups[groupName];
            if (group.indexOf(name) == -1) {
                group.push(name);
            }
        }
        return { name, url, type, ...fileOptions }
    }

    async  onFile(file: plugin.File): Promise<plugin.File> {

        const filename = file.origin;
        const extname = file.extname;
        if (filename.indexOf('.res.json') >= 0) {
            return null;
        }

        if (filename.indexOf('resource/') >= 0) {
            let r = this.executeFilter(file)
            if (r) {
                if (file.outputDir) {
                    this.remoteRoot = file.outputDir;
                    this.remoteFileSystem.addFile(r, true);
                }
                else {
                    this.fileSystem.addFile(r, true);
                }
            }
        }
        return file;

    }
    async  onFinish(pluginContext: plugin.PluginContext): Promise<void> {


        function emitResourceConfigFile(debug: boolean) {
            const generateConfig = resourceConfig.generateConfig(config, true);
            const content = JSON.stringify(generateConfig, null, "\t");
            const file = `exports.typeSelector = ${options.typeSelector.toString()};
exports.resourceRoot = "resource";
exports.alias = ${JSON.stringify(generateConfig.alias, null, "\t")};
exports.groups = ${JSON.stringify(generateConfig.groups, null, "\t")};
exports.resources = ${JSON.stringify(generateConfig.resources, null, "\t")};
            `;
            return file;
        }


        const options = this.options;
        const config = this.config;

        const configContent = path.extname(options.output) == ".js" ? emitResourceConfigFile(true) : resourceConfig.generateClassicalConfig(this.config);
        pluginContext.createFile(options.output, new Buffer(configContent));
        if (this.remoteRoot) {
            const remoteConfigContent = resourceConfig.generateClassicalConfig(this.remoteConfig);
            pluginContext.createFile(options.output, new Buffer(remoteConfigContent), { outputDir: this.remoteRoot });
        }

    }
}




export type ConvertResourceConfigPluginOption = {

    resourceConfigFiles: { filename: string, root: string }[];

    nameSelector: (url: string) => string


}

type R = { url: string, type: string, subkeys: string[] | string, name: string };

export class ConvertResConfigFilePlugin implements plugin.Plugin {



    private files: { [url: string]: R } = {};
    private resourceConfigFiles: string[] = [];
    private resourceConfig: { [filename: string]: { resources: any[] } } = {};
    constructor(private options: ConvertResourceConfigPluginOption) {
        this.resourceConfigFiles = this.options.resourceConfigFiles.map((item) => path.posix.join(item.root, item.filename))
    }
    async onFile(file: plugin.File) {
        let subkeys;
        let type;
        if (file.options) {
            subkeys = file.options.subkeys;
            type = file.options.type;
        }
        const url = file.relative.split("\\").join("/");
        const name = this.options.nameSelector(file.origin);
        if (this.resourceConfigFiles.indexOf(file.origin) >= 0) {
            this.resourceConfig[file.origin] = JSON.parse(file.contents.toString())
        }
        else {
            const r = { url, subkeys, type, name }
            this.files[url] = r;
        }

        return file;
    }

    async onFinish(commandContext: plugin.PluginContext) {

        // const { root, outputDir } = resourceConfig;

        for (let filename in this.resourceConfig) {
            const resourceConfig = this.resourceConfig[filename];

            for (let r of resourceConfig.resources) {
                const realURL = this.files["resource" + "/" + r.url];
                // if (realURL) {
                //     r.url = realURL;
                // }
            }


        }

        // for (let item of this.files) {
        //     if (item.url.indexOf(root) == 0) {
        //         item.url = item.url.replace(root + "/", "");
        //         item.subkeys = (item.subkeys as string[]).join(",")
        //         resourceConfig.resources.push(item)
        //     }
        // }

        // delete resourceConfig.root;
        // delete resourceConfig.outputDir;
        // const content = JSON.stringify(resourceConfig, null, '\t');

        // console.log(this.files);
        // console.log(this.resourceConfig)
        // commandContext.createFile(resourceFile, new Buffer(content), { outputDir });

    }
}



namespace resourceConfig {


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

    export function generateClassicalConfig(config: ResourceConfigData) {
        // {
        // 	"keys": "bg_jpg,egret_icon_png,description_json",
        // 	"name": "preload"
        // }
        let result: legacy.Data = {
            groups: [],
            resources: []
        }

        let groups = config.groups;
        for (let groupName in groups) {
            result.groups.push({ name: groupName, keys: groups[groupName].join(",") })
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
        })
        return JSON.stringify(result, null, "\t");
    }

    export function generateConfig(config: ResourceConfigData, debug: boolean): generate.Data {

        let loop = (r: generate.Dictionary) => {
            for (var key in r) {
                var f = r[key];
                if (isFile(f)) {
                    if (typeof (f) == "string") {
                        continue;
                    }

                    // if (!debug) {
                    //     delete f.name;
                    //     // console.log 
                    //     if (options.typeSelector(f.url) == f.type) {
                    //         delete f.type;
                    //     }
                    //     if (Object.keys(f).length == 1) {
                    //         r[key] = f.url;
                    //     }
                    // }
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

        let isFile = (r: generate.Dictionary[keyof generate.Dictionary]): r is generate.File => {
            if (r['url']) {
                return true;
            }
            else {
                return false;
            }
        }

        let generatedData: generate.Dictionary = JSON.parse(JSON.stringify(config.resources));
        loop(generatedData);
        let result: generate.Data = {
            alias: config.alias,
            groups: config.groups,
            resources: generatedData
        }
        return result;
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



        addFile(r: File, checkDuplicate: boolean) {
            if (checkDuplicate) {
                let a = this.getFile(r.name)
                if (a && this.rootPath + "/" + a.url != r.url) {
                    console.warn("duplicate: " + r.url + " => " + r.name)
                }
            }

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
                d[basefilename] = { url, type, name, ...r };
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


    export interface Data {
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


namespace generate {
    export interface Dictionary {

        [file: string]: File | Dictionary

    }

    export type File = string | vfs.File;

    export interface Data {

        resources: Dictionary

        groups: {
            [groupName: string]: string[]
        },

        alias: {
            [aliasName: string]: string
        }

    }

}

interface ResourceConfigData {

    resources: vfs.Dictionary,

    groups: {
        [groupName: string]: string[]
    },

    alias: {
        [aliasName: string]: string
    }

}

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