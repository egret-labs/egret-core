module RES {

    const __tempCache = {};
    /**
     * Print the memory occupied by the picture.
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 打印图片所占内存
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export function profile() {
        config.config.fileSystem.profile();
        console.log(__tempCache);
        //todo 
        let totalImageSize = 0;
        for (var key in __tempCache) {
            let img = __tempCache[key]
            if (img instanceof egret.Texture) {
                totalImageSize += img.$bitmapWidth * img.$bitmapHeight * 4;
            }
        }
        console.log("gpu size : " + (totalImageSize / 1024).toFixed(3) + "kb");
    }
    /**
    * @internal
    */
    export var host: ProcessHost = {

        state: {},

        get resourceConfig() {
            return config;
        },

        load: (r: ResourceInfo, processorName?: string | processor.Processor) => {
            const processor = typeof processorName == 'string' ? RES.processor._map[processorName] : processorName;
            return queue["loadResource"](r, processor);
        },

        unload: (r: ResourceInfo) => queue.unloadResource(r),

        save(resource: ResourceInfo, data: any) {
            host.state[resource.root + resource.name] = 2;
            delete resource.promise;
            __tempCache[resource.root + resource.name] = data;
        },


        get(resource: ResourceInfo) {
            return __tempCache[resource.root + resource.name];
        },

        remove(resource: ResourceInfo) {
            delete host.state[resource.root + resource.name];
            delete __tempCache[resource.root + resource.name];
        }
    }
    /**
     * @internal
     */
    export var config = new ResourceConfig();
    /**
     * @internal
     */
    export var queue = new ResourceLoader();

    /**
    * @private
    */
    export interface ProcessHost {

        state: { [index: string]: number }

        resourceConfig: ResourceConfig;

        load: (resource: ResourceInfo, processor?: string | processor.Processor) => Promise<any>;

        unload: (resource: ResourceInfo) => void

        save: (rexource: ResourceInfo, data: any) => void;

        get: (resource: ResourceInfo) => any;

        remove: (resource: ResourceInfo) => void;


    }
    /**
    * @private
    */
    export class ResourceManagerError extends Error {



        static errorMessage = {
            1001: '文件加载失败:{0}',
            1002: "ResourceManager 初始化失败：配置文件加载失败",
            2001: "{0}解析失败,不支持指定解析类型:\'{1}\'，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
            2002: "Analyzer 相关API 在 ResourceManager 中不再支持，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
            2003: "{0}解析失败,错误原因:{1}",
            2004: "无法找到文件类型:{0}",
            2005: "RES加载了不存在或空的资源组:\"{0}\"",
            2006: "资源配置文件中无法找到特定的资源:{0}"
        }

        /**
         * why instanceof e  != ResourceManagerError ???
         * see link : https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        private __resource_manager_error__ = true;

        constructor(code: number, replacer?: Object, replacer2?: Object) {
            super();
            this.name = code.toString();
            this.message = ResourceManagerError.errorMessage[code].replace("{0}", replacer).replace("{1}", replacer2);
        }
    }


}

namespace RES {
    /**
     * Resource group loading progress prompt
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 资源组的加载进度提示
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export interface PromiseTaskReporter {

        /**
         * Progress callback, asynchronous execution, load number and order have nothing to do
         * @param current The number of currently loaded
         * @param total Total resources required in the current resource bundle
         * @param resItem currently loading resource information
         * @version Egret 5.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 进度回调，异步执行，加载数目和顺序无关
         * @param current 当前已经加载数目
         * @param total 当前资源包内需要资源总数
         * @param resItem 当前加载资源信息
         * @version Egret 5.2
         * @platform Web,Native
         * @language zh_CN
         */
        onProgress?(current: number, total: number, resItem: ResourceInfo | undefined): void;

        /**
         * 取消回调
         */
        // onCancel?: () => void;

    }
}


