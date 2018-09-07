import * as plugin from './';
import * as path from 'path';
import { Plugin } from './';
import utils = require('../lib/utils');


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

    /** 
     * filename 会修改里面的资源引用
     * root 扫描这个文件夹下面的资源
     */
    resourceConfigFiles: { filename: string, root: string }[];

    nameSelector: (url: string) => string

    TM_Verbose: boolean;
}

type R = { url: string, type: string, subkeys: string[] | string, name: string };

class TextureMergerResConfigPlugin {
    /**
     * {
     *  'textureMerger_wxgame/resource/example.json':
            { url: 'textureMerger_wxgame/resource/example.json',
            subkeys:
            [   'resource/assets/checkbox_unselect.png',
                'resource/assets/blackBg.png',
                'resource/assets/close.png',
                'resource/assets/red.jpg',
                'resource/assets/whiteBg.png',
                'resource/assets/redDown.png' ],
            type: 'sheet',
            name: 'example_json' }
        }
     */
    private sheetFiles: { [url: string]: R } = {};
    /**
     * { 
     *      'resource/default.res.json': 'resource/',
     *      'resource/de.res.json': 'resource/' 
    *  }
     */
    private sheetRoot: { [url: string]: string } = {};
    //从用户读取到的要修改的文件url
    private resourceConfigFiles: string[] = [];
    /** 存储要修改的文件 */
    private resourceConfig: { [filename: string]: { resources: any[] } } = {};
    /** 要打包的文件夹 */
    private resourceDirs: { [filename: string]: boolean } = {};
    constructor(private options: ConvertResourceConfigPluginOption) {
        this.resourceConfigFiles = this.options.resourceConfigFiles.map((item) => {
            let resourceConfigFile = path.posix.join(item.filename);
            this.sheetRoot[resourceConfigFile] = item.root;
            this.resourceDirs[item.root] = true;
            return resourceConfigFile;
        });
    }
    async onFile(file: plugin.File) {
        let isRes = false;
        for (let root in this.resourceDirs) {
            let fileOrigin = path.normalize(file.origin);
            //绝对路径
            if (fileOrigin.indexOf(path.join(egret.args.projectDir)) >= 0) {
                if (fileOrigin.indexOf(path.join(egret.args.projectDir, root)) >= 0) {
                    isRes = true;
                }
            }
            //相对路径
            else {
                if (path.join(egret.args.projectDir, fileOrigin).indexOf(path.normalize(root)) >= 0) {
                    isRes = true;
                }
            }
        }
        if (!isRes) {
            return file;
        }

        let subkeys;
        let type;
        if (file.options) {
            subkeys = file.options.subkeys;
            type = file.options.type;
        }
        const origin = file.origin;
        const url = origin.split("\\").join("/");
        const name = this.options.nameSelector(origin);
        /** 存储要修改的文件 */
        if (this.resourceConfigFiles.indexOf(origin) >= 0) {
            this.resourceConfig[url] = JSON.parse(file.contents.toString())
        }

        if (type == "sheet") {
            const r = { url, subkeys, type, name }
            this.sheetFiles[url] = r;
        }
        return file;
    }
    /**
     * 返回resource/asset/A.png的格式
     * file 和 subkeys 都以这种方式存储
     * @param url url地址
     */
    private getNormalizeUrl(url: string, root: string): string {
        if (root == undefined) return url;
        if (url.indexOf(egret.args.projectDir) > -1) {
            return url.slice(egret.args.projectDir.length, url.length);
        }
        if (url.indexOf(root) > -1)
            return url;
        else
            return path.join(root, url);
    }
    /**
     * 返回asset/A.png 的格式
     * 在default.res.json中以无root的格式存储
     * @param url url地址
     */
    private getSpliceRoot(url: string, sliceStr: string): string {
        if (url.indexOf(sliceStr) > -1)
            return url.slice(sliceStr.length, url.length);
        else
            return url;
    }


    private sheetToRes(subs: string[]) {
        let result: string = "";
        for (let sub of subs) {
            result += path.basename(sub).split(".").join("_") + ","
        }
        result = result.slice(0, result.length - 1);
        return result;
    }

    async parseTestureMerger(pluginContext: plugin.PluginContext) {
        let hasConfig = false;
        for (let i in this.resourceConfig) {
            hasConfig = true;
        }
        if (!hasConfig) {
            console.log(utils.tr(1430));
            global.globals.exit()
        }
        for (let sheetFileName in this.sheetFiles) {
            const subkeysFile = this.sheetFiles[sheetFileName];
            /** 创建哈希，减少一层for遍历 */
            let subkeyHash = {}
            for (let subkeyItem of subkeysFile.subkeys) {
                subkeyHash[path.normalize(subkeyItem)] = true;
            }
            this.modifyRES(subkeysFile, subkeyHash, pluginContext);
        }
    }
    private modifyRES(subkeysFile: R, subkeyHash: {}, pluginContext: plugin.PluginContext) {
        for (let filename in this.resourceConfig) {
            const resourceConfig = this.resourceConfig[filename];
            const root = this.sheetRoot[filename];
            this.deleteFragmentReference(subkeyHash, resourceConfig, root);

            //增加最后的图集和json配置
            //先直接抹去前方的路径，如果没有任何变化，说明资源在res.json的文件上级
            //可能在文件工程中，所以下面在删除一回root
            const relativeJson = this.getSpliceRoot(subkeysFile.url, pluginContext.outputDir)
            if (relativeJson == subkeysFile.url && relativeJson.indexOf(pluginContext.outputDir) > -1) {
                console.log(utils.tr(1422, filename, subkeysFile.name));
                global.globals.exit()
            }
            let subkeys = "";
            //json
            if (typeof (subkeysFile.subkeys) == "string") {
                subkeys = subkeysFile.subkeys;
            } else {
                subkeys = this.sheetToRes(subkeysFile.subkeys as string[]);
            }
            const json = {
                name: subkeysFile.name,
                type: subkeysFile.type,
                subkeys: subkeys,
                url: this.getSpliceRoot(relativeJson, root)
            }
            this.checkVerbose(json.url, filename);
            this.deleteReferenceByName(subkeysFile.name, resourceConfig, root);
            resourceConfig.resources.push(json);

            //png
            const imageUrl = subkeysFile.url.replace("json", "png");
            const imgName = subkeysFile.name.replace("json", "png");
            const relativeImage = this.getSpliceRoot(imageUrl, pluginContext.outputDir)
            const image = {
                name: imgName,
                type: "image",
                url: this.getSpliceRoot(relativeImage, root)
            }
            this.deleteReferenceByName(imgName, resourceConfig, root);
            resourceConfig.resources.push(image);
            const buffer = new Buffer(JSON.stringify(resourceConfig));
            pluginContext.createFile(filename, buffer);
        }
    }
    /**
   * 删除碎图的引用，以tmproject新生成的为主
   * @param resourceConfig 对应的res.json数据
   */
    private deleteFragmentReference(sheetHash: {}, resourceConfig: { resources: any[] }, root: string) {
        const newConfig = resourceConfig.resources.concat();
        for (let r of newConfig) {
            if (sheetHash[this.getNormalizeUrl(r.url, root)]) {
                const index = resourceConfig.resources.indexOf(r);
                resourceConfig.resources.splice(index, 1);
                continue;
            }
        }
    }
    /**
      * 删除可能存在图集的引用，以tmproject新生成的为主
      * @param name 传入的名字应该是preload_0_json格式
      * @param resourceConfig 对应的res.json数据
      */
    private deleteReferenceByName(name: string, resourceConfig: { resources: any[] }, root: string) {
        const newConfig = resourceConfig.resources.concat();
        for (let r of newConfig) {
            if (r.name == name) {
                const index = resourceConfig.resources.indexOf(r);
                resourceConfig.resources.splice(index, 1);
                continue;
            }
        }
    }
    /**
     * 检查是否一个json插入到不同的res.json中
     * @param url 
     */
    private verboseHash: { [filename: string]: string[] } = {};
    private checkVerbose(tmjson: string, resjson: string) {
        if (!this.options.TM_Verbose) return;
        if (this.verboseHash[tmjson] == undefined) {
            this.verboseHash[tmjson] = [];
            this.verboseHash[tmjson].push(resjson)
            return;
        }
        this.verboseHash[tmjson].push(resjson)
        // console.log(this.verboseHash[tmjson].join(",    "));
        console.log(utils.tr(1429, this.verboseHash[tmjson].join(",    ")));
    }
}

export class ConvertResConfigFilePlugin implements plugin.Plugin {



    /**
     * 合图插件暂时没有使用
     */
    private files: { [url: string]: R } = {};
    private tMResConfigPlugin: TextureMergerResConfigPlugin;
    constructor(private options: ConvertResourceConfigPluginOption) {
        this.tMResConfigPlugin = new TextureMergerResConfigPlugin(options);
    }
    async onFile(file: plugin.File) {
        file = await this.tMResConfigPlugin.onFile(file);
        return file;
    }
    async onFinish(commandContext: plugin.PluginContext) {
        await this.tMResConfigPlugin.parseTestureMerger(commandContext);
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
            let d = this.resolve(folder) as (Dictionary | null);
            if (d) {
                d[basefilename] = { url, type, name, ...r };
            }
        }

        getFile(filename: string): File | undefined {
            filename = this.normalize(filename);
            return this.resolve(filename) as File;
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

        private resolve(dirpath: string) {
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