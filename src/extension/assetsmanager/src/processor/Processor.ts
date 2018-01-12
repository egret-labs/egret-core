module RES.processor {


    export interface Processor {

        onLoadStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;

        onRemoveStart(host: ProcessHost, resource: ResourceInfo): Promise<any>;

        getData?(host: ProcessHost, resource: ResourceInfo, key: string, subkey: string): any;


    }

    export function isSupport(resource: ResourceInfo) {
        return _map[resource.type];
    }

    export function map(type: string, processor: Processor) {
        _map[type] = processor;
    }

    async function promisify(loader: egret.ImageLoader | egret.HttpRequest | egret.Sound, resource: ResourceInfo): Promise<any> {

        return new Promise((reslove, reject) => {
            let onSuccess = () => {
                let texture = loader['data'] ? loader['data'] : loader['response'];
                reslove(texture);
            }

            let onError = () => {
                let e = new ResourceManagerError(1001, resource.url);
                reject(e);
            }
            loader.addEventListener(egret.Event.COMPLETE, onSuccess, this);
            loader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);
        })
    }

    function getURL(resource: ResourceInfo) {
        if (resource.url.indexOf("://") != -1) {
            return resource.url;
        }
        let prefix = resource.extra ? "" : resourceRoot;
        let url = prefix + resource.url;
        if (RES['getRealURL']) { //todo: shim native
            return RES['getRealURL'](url);
        }
        else {
            return url;
        }
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

        async onLoadStart(host, resource) {
            var loader = new egret.ImageLoader();
            loader.load(getURL(resource));
            var bitmapData = await promisify(loader, resource);
            // if (!cache[resource.url]){
            //     cache[resource.url] = new egret.Texture();
            // }
            // var texture = cache[resource.url];
            let texture = new egret.Texture();
            texture._setBitmapData(bitmapData);
            let r = host.resourceConfig.getResource(resource.name);
            if (r && r.scale9grid) {
                var list: Array<string> = r.scale9grid.split(",");
                texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
            }
            // var config: any = resItem.data;
            // if (config && config["scale9grid"]) {
            //     
            // }
            return texture;
        },

        onRemoveStart(host, resource) {

            let texture = host.get(resource);
            texture.dispose();
            return Promise.resolve();
        }

    }

    export var BinaryProcessor: Processor = {

        async onLoadStart(host, resource) {

            var request: egret.HttpRequest = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.ARRAY_BUFFER;
            request.open(getURL(resource), "get");
            request.send();
            let arraybuffer = await promisify(request, resource);
            return arraybuffer;

        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }

    }

    export var TextProcessor: Processor = {

        async onLoadStart(host, resource) {

            var request: egret.HttpRequest = new egret.HttpRequest();
            request.responseType = egret.HttpResponseType.TEXT;
            request.open(getURL(resource), "get");
            request.send();
            let text = await promisify(request, resource);
            return text;

        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }

    export var JsonProcessor: Processor = {

        async onLoadStart(host, resource) {
            let text = await host.load(resource, TextProcessor);
            let data = JSON.parse(text);
            return data;
        },

        onRemoveStart(host, request) {
            return Promise.resolve();
        }

    }

    export var XMLProcessor: Processor = {

        async onLoadStart(host, resource) {
            let text = await host.load(resource, TextProcessor);
            let data = egret.XML.parse(text);
            return data;
        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }

    export var CommonJSProcessor: Processor = {

        async onLoadStart(host, resource) {
            let text = await host.load(resource, TextProcessor);
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
        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }

    }

    export const SheetProcessor: Processor = {

        async onLoadStart(host, resource): Promise<any> {

            let data = await host.load(resource, JsonProcessor);
            let imagePath = "resource/" + getRelativePath(resource.url, data.file);
            let r = host.resourceConfig.getResource(data.file);
            if (!r) {
                r = { name: imagePath, url: imagePath, extra: true, type: 'image' };
            }
            var texture: egret.Texture = await host.load(r);
            var frames: any = data.frames;
            var spriteSheet = new egret.SpriteSheet(texture);
            for (var subkey in frames) {
                var config: any = frames[subkey];
                var texture = spriteSheet.createTexture(subkey, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
                // if (config["scale9grid"]) {
                //     var str: string = config["scale9grid"];
                //     var list: Array<string> = str.split(",");
                //     texture["scale9Grid"] = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
                // }
                //     if (name) {
                //         this.addSubkey(subkey, name);
                //     }
            }
            return spriteSheet;
        },


        getData(host, resource, key, subkey) {
            let data: egret.SpriteSheet = host.get(resource);
            if (data) {
                return data.getTexture(subkey);
            }
            else {
                console.error(`missing resource : ${key}#${subkey}`);
                return null;
            }
        },


        onRemoveStart(host, resource): Promise<any> {
            return Promise.resolve();
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

        async onLoadStart(host, resource): Promise<any> {

            let data: string = await host.load(resource, TextProcessor);
            let config: FontJsonFormat | string;
            try {
                config = JSON.parse(data) as FontJsonFormat;
            }
            catch (e) {
                config = data
            }

            let imageFileName = resource.name.replace("fnt", "png");
            let r = host.resourceConfig.getResource(imageFileName);
            if (!r) {
                if (typeof config === 'string') {
                    imageFileName = RES.config.resourceRoot + "/" + fontGetTexturePath(resource.url, config)
                }
                else {
                    imageFileName = RES.config.resourceRoot + "/" + getRelativePath(resource.url, config.file);
                }
                r = { name: imageFileName, url: imageFileName, extra: true, type: 'image' };
            }
            var texture: egret.Texture = await host.load(r);
            var font = new egret.BitmapFont(texture, config);
            return font;
        },





        onRemoveStart(host, resource): Promise<any> {
            return Promise.resolve();
        }


    }


    export var SoundProcessor: Processor = {
        async onLoadStart(host, resource) {
            var sound: egret.Sound = new egret.Sound();
            sound.load(getURL(resource));
            await promisify(sound, resource);
            return sound;
        },
        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }
    export var MovieClipProcessor: Processor = {

        onLoadStart(host, resource) {
            let mcData;
            let imageResource: ResourceInfo;
            return host.load(resource, JsonProcessor)
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
                    host.save(imageResource, value)
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
            return host.unload(imageResource);

        }
    }

    export const MergeJSONProcessor: Processor = {

        async onLoadStart(host, resource): Promise<any> {

            let data = await host.load(resource, JsonProcessor);
            for (var key in data) {
                config.addSubkey(key, resource.name);
            }
            return data;
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


        onRemoveStart(host, resource): Promise<any> {
            return Promise.resolve();
        }
    }


    export const ResourceConfigProcessor: Processor = {


        async onLoadStart(host, resource) {
            let data = await host.load(resource, CommonJSProcessor);
            let fileSystem = new NewFileSystem(data.resources);
            data.fileSystem = fileSystem;
            delete data.resource;
            resourceTypeSelector = data.typeSelector;
            resourceNameSelector = data.nameSelector ? data.nameSelector : (p) => p;
            return data;
            // let resources = data.resources;
            // let loop = (r, prefix, walk: (r: ResourceInfo) => void) => {
            //     for (var key in r) {
            //         let p = prefix ? prefix + "/" + key : key;
            //         var f = r[key];
            //         if (isFile(f)) {

            //             if (typeof f === 'string') {
            //                 f = { url: f, name: p };
            //                 r[key] = f;
            //             }
            //             else {
            //                 f['name'] = p;
            //             }
            //             walk(f);
            //         }
            //         else {
            //             loop(f, p, walk);
            //         }

            //     }
            // }

            // let isFile = (r) => {
            //     return typeof r === "string" || r.url != null;
            // }

            // loop(resources, "", value => {
            //     if (!value.type) {
            //         value.type = resourceTypeSelector(value.url);
            //     }
            // })

            // return data;
        },

        async onRemoveStart() {

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
        subkeys?: string
    }

    export const LegacyResourceConfigProcessor: Processor = {


        onLoadStart(host, resource) {




            return host.load(resource, JsonProcessor).then((data: LegacyResourceConfig) => {
                const resConfigData = RES.config.config;
                let fileSystem = resConfigData.fileSystem;
                if (!fileSystem) {
                    fileSystem = {

                        fsData: {},

                        getFile: (filename) => {
                            return fsData[filename]
                        },

                        addFile: (filename, type) => {
                            if (!type) type = "";
                            fsData[filename] = { name: filename, type, url: filename };
                        },

                        profile: () => {
                            console.log(fsData);
                        }

                    } as FileSystem;
                    resConfigData.fileSystem = fileSystem;
                }



                let groups = resConfigData.groups;
                for (let g of data.groups) {
                    groups[g.name] = g.keys.split(",");
                }
                let alias: { [index: string]: string } = resConfigData.alias;
                let fsData: { [index: string]: LegacyResourceInfo } = fileSystem['fsData'];
                for (let resource of data.resources) {
                    fsData[resource.name] = resource;
                    if (resource.subkeys) {
                        resource.subkeys.split(",").forEach(subkey => {
                            alias[subkey] = resource.name + "#" + subkey;
                        })
                        // ResourceConfig.
                    }
                }
                return resConfigData;
            })

        },

        async onRemoveStart() { }

    }




    class PVRParser {

        public static COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
        public static COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
        public static COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
        public static COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

        public static parse(arrayBuffer, callback, errorCallback) {
            // the header length of int32
            var headerIntLength = 13;
            // get header part of arrayBuffer
            var header = new Uint32Array(arrayBuffer, 0, headerIntLength);

            // separate buffer and header
            var pvrDatas = {
                buffer: arrayBuffer,
                header: header
            };

            // PVR v3
            if (header[0] === 0x03525650) {
                PVRParser._parseV3(pvrDatas, callback, errorCallback);
            }
            // PVR v2
            else if (header[11] === 0x21525650) {
                PVRParser._parseV2(pvrDatas, callback, errorCallback);
            }
            // error
            else {
                errorCallback(pvrDatas, "pvr parse error!");
            }
        }

        private static _parseV2(pvrDatas, callback, errorCallback) {
            var header = pvrDatas.header;

            var headerLength = header[0],
                height = header[1],
                width = header[2],
                numMipmaps = header[3],
                flags = header[4],
                dataLength = header[5],
                bpp = header[6],
                bitmaskRed = header[7],
                bitmaskGreen = header[8],
                bitmaskBlue = header[9],
                bitmaskAlpha = header[10],
                pvrTag = header[11],
                numSurfs = header[12];

            var TYPE_MASK = 0xff;
            var PVRTC_2 = 24,
                PVRTC_4 = 25;

            var formatFlags = flags & TYPE_MASK;

            var bpp, format;
            var _hasAlpha = bitmaskAlpha > 0;

            if (formatFlags === PVRTC_4) {
                format = _hasAlpha ? PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG : PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                bpp = 4;
            } else if (formatFlags === PVRTC_2) {
                format = _hasAlpha ? PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG : PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                bpp = 2;
            } else {
                errorCallback(pvrDatas, "pvr v2 parse error");
                console.log("unknow format flags::" + formatFlags);
            }

            var dataOffset = headerLength;
            pvrDatas.pvrtcData = new Uint8Array(pvrDatas.buffer, dataOffset);
            pvrDatas.bpp = bpp;
            pvrDatas.format = format;
            pvrDatas.width = width;
            pvrDatas.height = height;
            pvrDatas.surfacesCount = numSurfs;
            pvrDatas.mipmapsCount = numMipmaps + 1;

            // guess cubemap type seems tricky in v2
            // it juste a pvr containing 6 surface (no explicit cubemap type)
            pvrDatas.isCubemap = (pvrDatas.surfacesCount === 6);

            callback(pvrDatas);
        }

        private static _parseV3(pvrDatas, callback, errorCallback): void {
            var header = pvrDatas.header;
            var bpp, format;

            var pixelFormat = header[2];

            switch (pixelFormat) {
                case 0: // PVRTC 2bpp RGB
                    bpp = 2;
                    format = PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                    break;
                case 1: // PVRTC 2bpp RGBA
                    bpp = 2;
                    format = PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
                    break;
                case 2: // PVRTC 4bpp RGB
                    bpp = 4;
                    format = PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                    break;
                case 3: // PVRTC 4bpp RGBA
                    bpp = 4;
                    format = PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                    break;
                default:
                    errorCallback(pvrDatas, "pvr v3 parse error");
                    console.log("unknow pixel format::" + pixelFormat)
            }

            var dataOffset = 52 + header[12];
            pvrDatas.pvrtcData = new Uint8Array(pvrDatas.buffer, dataOffset);
            pvrDatas.bpp = bpp;
            pvrDatas.format = format;
            pvrDatas.width = header[7];
            pvrDatas.height = header[6];
            pvrDatas.surfacesCount = header[10];
            pvrDatas.mipmapsCount = header[11];

            pvrDatas.isCubemap = (pvrDatas.surfacesCount === 6);

            callback(pvrDatas);
        }
    }

    if (typeof egret != 'undefined' && egret && egret["web"] && egret["web"].WebGLRenderContext) {
        // Calcualates the size of a compressed texture level in bytes
        function textureLevelSize(format, width, height) {
            switch (format) {
                case PVRParser.COMPRESSED_RGB_PVRTC_4BPPV1_IMG:
                case PVRParser.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG:
                    return Math.floor((Math.max(width, 8) * Math.max(height, 8) * 4 + 7) / 8);

                case PVRParser.COMPRESSED_RGB_PVRTC_2BPPV1_IMG:
                case PVRParser.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG:
                    return Math.floor((Math.max(width, 16) * Math.max(height, 8) * 2 + 7) / 8);

                default:
                    return 0;
            }
        }

        egret["web"].WebGLRenderContext.prototype.createTextureFromCompressedData = function (data, width, height, levels, internalFormat): WebGLTexture {
            var gl = this.context;

            if (!this.pvrtcExt) {
                this.pvrtcExt = gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
            }
            var texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            var offset = 0;
            // Loop through each mip level of compressed texture data provided and upload it to the given texture.
            for (var i = 0; i < levels; ++i) {
                // Determine how big this level of compressed texture data is in bytes.
                var levelSize = textureLevelSize(internalFormat, width, height);
                // Get a view of the bytes for this level of DXT data.
                var dxtLevel = new Uint8Array(data.buffer, data.byteOffset + offset, levelSize);
                // Upload!
                gl.compressedTexImage2D(gl.TEXTURE_2D, i, internalFormat, width, height, 0, dxtLevel);
                // The next mip level will be half the height and width of this one.
                width = width >> 1;
                if (width < 1)
                    width = 1;
                height = height >> 1;
                if (height < 1)
                    height = 1;
                // Advance the offset into the compressed texture data past the current mip level's data.
                offset += levelSize;
            }

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            return texture;
        }
    }

    export var PVRProcessor: Processor = {

        async onLoadStart(host, resource) {
            let arraybuffer = await host.load(resource, BinaryProcessor);
            let width = 512;
            let height = 512;
            let borderWidth = 0;
            let borderHeight = 0;
            let byteArray = new egret.ByteArray(arraybuffer);
            byteArray.position = 7;
            let list = ["body", "ext"];
            let pvrDataBuffer;
            for (let i = 0; i < list.length; i++) {
                let buffer;
                switch (list[i]) {
                    case "body":
                        byteArray.position += 2;
                        let dataLength = byteArray.readUnsignedInt();
                        pvrDataBuffer = byteArray.buffer.slice(byteArray.position, byteArray.position + dataLength);
                        byteArray.position += dataLength;
                        break;
                    case "ext":
                        byteArray.position += 6;
                        width = byteArray.readUnsignedShort();
                        height = byteArray.readUnsignedShort();
                        borderWidth = byteArray.readUnsignedShort();
                        borderHeight = byteArray.readUnsignedShort();
                        break;
                }
            }
            let self = this;
            let texture;
            PVRParser.parse(pvrDataBuffer, function (pvrData) {
                let bitmapData = new egret.BitmapData(pvrData);
                bitmapData.format = "pvr";
                texture = new egret.Texture();
                texture._setBitmapData(bitmapData);
                texture.$initData(borderWidth, borderHeight, width, height, 0, 0, width, height, bitmapData.width, bitmapData.height);
            }, function () {
                console.log("pvr error");
            });
            return texture;

        },

        onRemoveStart(host, resource) {
            return Promise.resolve();
        }
    }

    const _map: { [index: string]: Processor } = {
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
        "pvr": PVRProcessor,
        "mergeJson": MergeJSONProcessor,
        "resourceConfig": ResourceConfigProcessor,
        "legacyResourceConfig": LegacyResourceConfigProcessor,
        // "zip": ZipProcessor
    }
}


