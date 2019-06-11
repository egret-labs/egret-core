module RES.processor {


    export interface Processor {
        /**
         * Start loading a single resource
         * @param host Load the processor, you can use the processor to load resources, directly use http to get the resources back
         * @param resource Resource information
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 开始加载单项资源
         * @param host 加载处理器，可以不使用这个处理器加载资源，直接用http获取资源返回即可
         * @param resource 资源的信息
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;
        /**
         * Remove a single resource, usually call host.unload (resource);
         * @param host Load the processor
         * @param resource Resource information
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 移除单项资源，一般调用host.unload(resource);
         * @param host 加载处理器
         * @param resource 资源的信息
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        onRemoveStart(host: ProcessHost, resource: ResourceInfo): void;

        /**
        * Get the submap of the merged atlas
        * @param host Load the processor
        * @param resource Resource information
        * @param key The key value of the resource
        * @param subkey  Collection of subset names
        * @version Egret 5.2
        * @platform Web,Native
        * @language en_US
        */
        /**
         * 获取合并图集的子图
         * @param host 加载处理器
         * @param resource 资源的信息
         * @param key 资源的key值
         * @param subkey  子集名称的集合
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        getData?(host: ProcessHost, resource: ResourceInfo, key: string, subkey: string): any;


    }
    /**
     * @internal
     * @param resource 对应的资源接口，需要type属性
     */
    export function isSupport(resource: ResourceInfo) {
        return _map[resource.type];
    }
    /**
     * Register the processor that loads the resource
     * @param type Load resource type
     * @param processor Loaded processor, an instance that implements the Processor interface
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 注册加载资源的处理器
     * @param type 加载资源类型
     * @param processor 加载的处理器，一个实现Processor接口的实例
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function map(type: string, processor: Processor) {
        _map[type] = processor;
    }
    /**
    * @internal
    */
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
    /**
     * @private
     * @param url 
     * @param file 
     */
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

    export const KTXTextureProcessor: RES.processor.Processor = {
        onLoadStart(host, resource) {
            return host.load(resource, 'bin').then((data) => {
                if (!data) {
                    console.error('ktx:' + resource.root + resource.url + ' is null');
                    return null;
                }
                const ktx = new egret.KTXContainer(data, 1);
                if (ktx.isInvalid) {
                    console.error('ktx:' + resource.root + resource.url + ' is invalid');
                    return null;
                }
                //
                const bitmapData = new egret.BitmapData(data);
                bitmapData.debugCompressedTextureURL = resource.root + resource.url;
                bitmapData.format = 'ktx';
                ktx.uploadLevels(bitmapData, false);
                //
                const texture = new egret.Texture();
                texture._setBitmapData(<egret.BitmapData>bitmapData);
                const r = host.resourceConfig.getResource(resource.name);
                if (r && r.scale9grid) {
                    const list: Array<string> = r.scale9grid.split(",");
                    texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                }
                //
                host.save(resource as ResourceInfo, texture);
                return texture;
            }, function (e) {
                host.remove(resource);
                throw e;
            });
        },

        onRemoveStart(host, resource) {
            const texture = host.get(resource);
            if (texture) {
                texture.dispose();
            }
        }
    }

    /**
    * 
    */
    export function makeEtc1SeperatedAlphaResourceInfo(resource: ResourceInfo): ResourceInfo {
        return { name: resource.name + '_alpha', url: resource['etc1_alpha_url'], type: 'ktx', root: resource.root };
    }

    /**
    * 
    */
    export const ETC1KTXProcessor: Processor = {
        onLoadStart(host, resource): Promise<any> {
            return host.load(resource, "ktx").then((colorTex) => {
                if (!colorTex) {
                    return null;
                }
                if (resource['etc1_alpha_url']) {
                    const r = makeEtc1SeperatedAlphaResourceInfo(resource);
                    return host.load(r, "ktx")
                        .then((alphaMaskTex) => {
                            if (colorTex && colorTex.$bitmapData && alphaMaskTex.$bitmapData) {
                                colorTex.$bitmapData.etcAlphaMask = alphaMaskTex.$bitmapData;
                                host.save(r as ResourceInfo, alphaMaskTex);
                            }
                            else {
                                host.remove(r);
                            }
                            return colorTex;
                        }, function (e) {
                            host.remove(r);
                            throw e;
                        });
                }
                return colorTex;
            }, function (e) {
                host.remove(resource);
                throw e;
            });
        },

        onRemoveStart(host, resource) {
            const colorTex = host.get(resource);
            if (colorTex) {
                colorTex.dispose();
            }
            if (resource['etc1_alpha_url']) {
                const r = makeEtc1SeperatedAlphaResourceInfo(resource);
                const alphaMaskTex = host.get(r!);
                if (alphaMaskTex) {
                    alphaMaskTex.dispose();
                }
                host.unload(r);//这里其实还会再删除一次，不过无所谓了。alphaMaskTex已经显示删除了
            }
        }
    }

    export var BinaryProcessor: Processor = {

        onLoadStart(host, resource) {
            var request: egret.HttpRequest = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
            request.open(RES.getVirtualUrl(resource.root + resource.url), "get");
            request.send();
            return promisify(request, resource)
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
        },

        onRemoveStart(host, resource) {
            return true;
        }
    }
    export var JsonProcessor: Processor = {

        onLoadStart(host, resource) {
            return host.load(resource, 'text').then(text => {
                let data = JSON.parse(text);
                return data;
            })

        },

        onRemoveStart(host, request) {
        }

    }
    /**
    * @internal
    */
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
    /**
    * @internal
    */
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
    /**
    * @internal
    */
    export const SheetProcessor: Processor = {

        onLoadStart(host, resource): Promise<any> {
            return host.load(resource, "json").then((data) => {
                let r = host.resourceConfig.getResource(RES.nameSelector(data.file));
                if (!r) {
                    let imageName = getRelativePath(resource.url, data.file);
                    r = { name: imageName, url: imageName, type: 'image', root: resource.root };
                }
                return host.load(r)
                    .then((bitmapData) => {
                        if (!bitmapData) {
                            return null;
                        }
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
                    }, function (e) {
                        host.remove(r!);
                        throw e;
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
    /**
    * @internal
    */
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
                }, function (e) {
                    host.remove(r!);
                    throw e;
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
        },
        onRemoveStart(host, resource) {
        }
    }
    /**
    * @internal
    */
    export var MovieClipProcessor: Processor = {

        onLoadStart(host, resource) {
            let mcData;
            let imageResource: ResourceInfo;
            return host.load(resource, 'json')
                .then((value) => {
                    mcData = value;
                    let jsonPath = resource.name;
                    let imagePath = jsonPath.substring(0, jsonPath.lastIndexOf(".")) + ".png";
                    imageResource = host.resourceConfig.getResource(imagePath) as ResourceInfo;
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
            let imageResource = host.resourceConfig.getResource(imagePath);
            if (imageResource) {
                host.unload(imageResource);
            }
        }
    }
    /**
    * @internal
    */
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
    /**
    * @internal
    */
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

                        addFile: (data: { name: string, type: string, url: string, root?: string, extra?: 1 | undefined }) => {
                            if (!data.type) data.type = "";
                            if (root == undefined) {
                                data.root = "";
                            }
                            fsData[data.name] = data;
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
                host.save(resource, data)
                return data;
            })

        },

        onRemoveStart() {
        }

    }

    /**
    * @internal
    */
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
        "ktx": KTXTextureProcessor,
        "etc1.ktx": ETC1KTXProcessor,
        "pvrtc.ktx": KTXTextureProcessor,
        // "zip": ZipProcessor
    }
}


