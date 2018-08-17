module RES.processor {


    export interface Processor {

        onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;

        onRemoveStart(host: ProcessHost, resource: ResourceInfo): void;

        getData?(host: ProcessHost, resource: ResourceInfo, key: string, subkey: string): any;


    }

    export function isSupport(resource: ResourceInfo) {
        return _map[resource.type];
    }

    export function map(type: string, processor: Processor) {
        _map[type] = processor;
    }

    function promisify(loader: egret.ImageLoader | egret.HttpRequest | egret.Sound, resource: ResourceInfo): Promise<any> {

        return new Promise((resolve, reject) => {
            let onSuccess = () => {
                let texture = loader['data'] ? loader['data'] : loader['response'];
                resolve(texture);
            }

            let onError = () => {
                let e = new ResourceManagerError(1001, resource.url);
                reject(e);
            }
            loader.addEventListener(egret.Event.COMPLETE, onSuccess, this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
        })
    }
    export function getRelativePath(url: string, file: string): string {
        if (file.indexOf("://") != -1) {
            return file;
        }
        url = url.split("\\").join("/");

        var params = url.match(/#.*|\?.*/);
        var paramUrl = "";
        if (params) {
            paramUrl = params[0];
        }

        var index = url.lastIndexOf("/");
        if (index != -1) {
            url = url.substring(0, index + 1) + file;
        }
        else {
            url = file;
        }
        return url + paramUrl;
    }

    // var cache: {[index:string]:egret.Texture} = {};

    export var ImageProcessor: Processor = {

        onLoadStart(host, resource) {
            var loader = new egret.ImageLoader();
            loader.load(RES.getVirtualUrl(resource.root + resource.url));
            return promisify(loader, resource)
                .then((bitmapData) => {
                    let texture = new egret.Texture();
                    texture._setBitmapData(bitmapData);
                    let r = host.resourceConfig.getResource(resource.name);
                    if (r && r.scale9grid) {
                        var list: Array<string> = r.scale9grid.split(",");
                        texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                    }
                    return texture;
                })
        },

        onRemoveStart(host, resource) {

            let texture = host.get(resource);
            texture.dispose();
        }

    }

    export var BinaryProcessor: Processor = {

        onLoadStart(host, resource) {
            var request: egret.HttpRequest = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
            request.open(RES.getVirtualUrl(resource.root + resource.url), "get");
            request.send();
            return promisify(request, resource)
            // let arraybuffer = await promisify(request, resource);
            // return arraybuffer;
        },

        onRemoveStart(host, resource) {
        }

    }

    export var TextProcessor: Processor = {

        onLoadStart(host, resource) {
            var request: egret.HttpRequest = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(RES.getVirtualUrl(resource.root + resource.url), "get");
            request.send();
            return promisify(request, resource)
            // let text = await promisify(request, resource);
            // return text;
        },

        onRemoveStart(host, resource) {
            return true;
        }
    }

    export var JsonProcessor: Processor = {

        onLoadStart(host, resource) {
            // let text = await host.load(resource, 'text');
            return host.load(resource, 'text').then(text => {
                let data = JSON.parse(text);
                return data;
            })

        },

        onRemoveStart(host, request) {
        }

    }

    export var XMLProcessor: Processor = {

        onLoadStart(host, resource) {
            return host.load(resource, 'text').then((text) => {
                let data = egret.XML.parse(text);
                return data;
            })
        },

        onRemoveStart(host, resource) {
            return true;
        }
    }

    export var CommonJSProcessor: Processor = {

        onLoadStart(host, resource) {
            // let text = await host.load(resource, 'text');
            return host.load(resource, 'text').then((text) => {
                let f = new Function('require', 'exports', text);
                var require = function () { };
                var exports = {};
                try {
                    f(require, exports);
                }
                catch (e) {
                    throw new ResourceManagerError(2003, resource.name, e.message)
                }
                return exports;
            })
        },

        onRemoveStart(host, resource) {
        }

    }

    export const SheetProcessor: Processor = {

        onLoadStart(host, resource): Promise<any> {
            // let data = await host.load(resource, "json");
            return host.load(resource, "json").then((data) => {
                let r = host.resourceConfig.getResource(RES.nameSelector(data.file));
                if (!r) {
                    let imageName = getRelativePath(resource.url, data.file);
                    r = { name: imageName, url: imageName, type: 'image', root: resource.root };
                }
                return host.load(r)
                    .then((bitmapData) => {
                        var frames: any = data.frames;
                        var spriteSheet = new egret.SpriteSheet(bitmapData);
                        spriteSheet["$resourceInfo"] = r;
                        for (var subkey in frames) {
                            var config: any = frames[subkey];
                            var texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                            if (config["scale9grid"]) {
                                var str: string = config["scale9grid"];
                                var list: Array<string> = str.split(",");
                                texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                            }
                        }
                        host.save(r as ResourceInfo, bitmapData);
                        return spriteSheet;
                    })
            })
        },


        getData(host, resource, key, subkey) {
            let data: egret.SpriteSheet = host.get(resource);
            if (data) {
                return data.getTexture(subkey);
            }
            else {
                return null;
            }
        },


        onRemoveStart(host, resource) {
            const sheet: egret.SpriteSheet = host.get(resource);
            const r = sheet["$resourceInfo"];
            sheet.dispose();
            host.unload(r);
        }

    }

    const fontGetTexturePath = (url: string, fntText: string) => {
        var file = "";
        var lines = fntText.split("\n");
        var pngLine = lines[2];
        var index = pngLine.indexOf("file=\"");
        if (index != -1) {
            pngLine = pngLine.substring(index + 6);
            index = pngLine.indexOf("\"");
            file = pngLine.substring(0, index);
        }

        url = url.split("\\").join("/");
        var index = url.lastIndexOf("/");
        if (index != -1) {
            url = url.substring(0, index + 1) + file;
        }
        else {
            url = file;
        }
        return url;
    }

    type FontJsonFormat = { file: string };

    export var FontProcessor: Processor = {

        onLoadStart(host, resource): Promise<any> {
            // let data: string = await host.load(resource, 'text');
            return host.load(resource, 'text').then((data) => {
                let config: FontJsonFormat | string;
                try {
                    config = JSON.parse(data) as FontJsonFormat;
                }
                catch (e) {
                    config = data
                }

                let imageName;
                if (typeof config === 'string') {
                    imageName = fontGetTexturePath(resource.url, config)
                }
                else {
                    imageName = getRelativePath(resource.url, config.file);
                }
                let r = host.resourceConfig.getResource(RES.nameSelector(imageName));
                if (!r) {
                    r = { name: imageName, url: imageName, type: 'image', root: resource.root };
                }
                // var texture: egret.Texture = await host.load(r);
                return host.load(r).then((texture) => {
                    var font = new egret.BitmapFont(texture, config);
                    font["$resourceInfo"] = r;
                    // todo refactor
                    host.save(r as ResourceInfo, texture);
                    return font;
                })
            })
        },

        onRemoveStart(host, resource) {
            const font: egret.BitmapFont = host.get(resource);
            const r = font["$resourceInfo"];
            host.unload(r);
        }
    }


    export var SoundProcessor: Processor = {
        onLoadStart(host, resource) {
            var sound: egret.Sound = new egret.Sound();
            sound.load(RES.getVirtualUrl(resource.root + resource.url));
            return promisify(sound, resource).then(() => {
                return sound;
            });
            // return sound;
        },
        onRemoveStart(host, resource) {
        }
    }
    export var MovieClipProcessor: Processor = {

        onLoadStart(host, resource) {
            let mcData;
            let imageResource: ResourceInfo;
            return host.load(resource, 'json')
                .then((value) => {
                    mcData = value;
                    let jsonPath = resource.name;
                    let imagePath = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
                    imageResource = host.resourceConfig.getResource(imagePath, true);
                    if (!imageResource) {
                        throw new ResourceManagerError(1001, imagePath);
                    }
                    return host.load(imageResource);
                }).then((value) => {
                    host.save(imageResource, value);
                    var mcTexture: egret.Texture = value;
                    var mcDataFactory = new egret.MovieClipDataFactory(mcData, mcTexture);
                    return mcDataFactory;
                })
        },
        onRemoveStart(host, resource) {
            let mcFactory = host.get(resource) as egret.MovieClipDataFactory;
            mcFactory.clearCache();
            mcFactory.$spriteSheet.dispose();
            // refactor
            let jsonPath = resource.name;
            let imagePath = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
            let imageResource = host.resourceConfig.getResource(imagePath, true);
            host.unload(imageResource);
        }
    }

    export const MergeJSONProcessor: Processor = {

        onLoadStart(host, resource): Promise<any> {

            // let data = await host.load(resource, 'json');
            return host.load(resource, 'json').then(data => {
                for (var key in data) {
                    config.addSubkey(key, resource.name);
                }
                return data;
            })
        },


        getData(host, resource, key, subkey) {
            let data = host.get(resource);
            if (data) {
                return data[subkey];
            }
            else {
                console.error("missing resource :" + resource.name);
                return null;
            }
        },


        onRemoveStart(host, resource) {
        }
    }

    type LegacyResourceConfig = {
        groups: LegacyGroupInfo[],
        resources: LegacyResourceInfo[],
    }

    type LegacyGroupInfo = {
        keys: string,
        name: string
    }

    type LegacyResourceInfo = {
        name: string;
        type: string;
        url: string;
        subkeys?: string;
        extra?: 1 | undefined;
    }

    export const LegacyResourceConfigProcessor: Processor = {


        onLoadStart(host, resource) {




            return host.load(resource, 'json').then((data: LegacyResourceConfig) => {
                const resConfigData = RES.config.config;
                const root = resource.root;
                let fileSystem = resConfigData.fileSystem;
                if (!fileSystem) {
                    fileSystem = {

                        fsData: {},

                        getFile: (filename) => {
                            return fsData[filename]
                        },

                        addFile: (filename, type, root, extra) => {
                            if (!type) type = "";
                            if (root == undefined) {
                                root = "";
                            }
                            fsData[filename] = { name: filename, type, url: filename, root, extra };
                        },

                        profile: () => {
                            console.log(fsData);
                        },
                        removeFile: (filename) => {
                            delete fsData[filename];
                        }
                    } as FileSystem;
                    resConfigData.fileSystem = fileSystem;
                }



                let groups = resConfigData.groups;
                for (let g of data.groups) {
                    if (g.keys == "") {
                        groups[g.name] = [];
                    } else {
                        groups[g.name] = g.keys.split(",");
                    }
                }
                let alias: { [index: string]: string } = resConfigData.alias;
                let fsData: { [index: string]: LegacyResourceInfo & { root?: string } } = fileSystem['fsData'];
                for (let resource of data.resources) {
                    fsData[resource.name] = resource;
                    fsData[resource.name].root = root;
                    if (resource.subkeys) {
                        resource.subkeys.split(",").forEach(subkey => {
                            alias[subkey] = resource.name + "#" + subkey;
                            alias[resource.name + "." + subkey] = resource.name + "#" + subkey;
                        })
                        // ResourceConfig.
                    }
                }
                host.save(resource, resConfigData)
                return resConfigData;
            })

        },

        onRemoveStart() {
        }

    }


    export const _map: { [index: string]: Processor } = {
        "image": ImageProcessor,
        "json": JsonProcessor,
        "text": TextProcessor,
        "xml": XMLProcessor,
        "sheet": SheetProcessor,
        "font": FontProcessor,
        "bin": BinaryProcessor,
        "commonjs": CommonJSProcessor,
        "sound": SoundProcessor,
        "movieclip": MovieClipProcessor,
        "mergeJson": MergeJSONProcessor,
        "legacyResourceConfig": LegacyResourceConfigProcessor,
        // "zip": ZipProcessor
    }
}


