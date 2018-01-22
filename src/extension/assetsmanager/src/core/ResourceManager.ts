module RES {

    const __tempCache = {};

    /**
     * 整个资源加载系统的进程id，协助管理回调派发机制
     */
    export var systemPid = 0

    export let checkCancelation: MethodDecorator = <Function>(target, propertyKey, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function (...arg) {
            let currentPid = systemPid;

            var result: Promise<any> = method.apply(this, arg);
            return result.then(value => {
                if (systemPid != currentPid) {
                    throw new ResourceManagerError(1005, arg[0]);
                }
                else {
                    return value;
                }
            });

        }
    }

    export function profile() {
        fileSystem.profile();
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

    export var host: ProcessHost = {

        state: {},

        get resourceConfig() {
            return config;
        },

        load: (r: ResourceInfo, processorName?: string | processor.Processor) => {
            const processor = typeof processorName == 'string' ? RES.processor._map[processorName] : processorName;
            return queue.loadResource(r, processor);
        },

        unload: (r: ResourceInfo) => queue.unloadResource(r),

        save(resource: ResourceInfo, data: any) {
            host.state[resource.name] = 2;
            resource.promise = undefined;
            __tempCache[resource.url] = data;
        },


        get(resource: ResourceInfo) {
            return __tempCache[resource.url];
        },

        remove(resource: ResourceInfo) {
            host.state[resource.name] = 0;
            delete __tempCache[resource.url];
        }
    }

    export var config = new ResourceConfig();

    export var queue = new ResourceLoader();


    export interface ProcessHost {

        state: { [index: string]: number }

        resourceConfig: ResourceConfig;

        load: (resource: ResourceInfo, processor?: string | processor.Processor) => Promise<any>;

        unload: (resource: ResourceInfo) => Promise<any>

        save: (rexource: ResourceInfo, data: any) => void;

        get: (resource: ResourceInfo) => any;

        remove: (resource: ResourceInfo) => void;


    }

    export class ResourceManagerError extends Error {



        static errorMessage = {
            1001: '文件加载失败:{0}',
            1002: "ResourceManager 初始化失败：配置文件加载失败",
            1005: 'ResourceManager 已被销毁，文件加载失败:{0}',
            2001: "{0}解析失败,不支持指定解析类型:\'{1}\'，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
            2002: "Analyzer 相关API 在 ResourceManager 中不再支持，请编写自定义 Processor ，更多内容请参见 https://github.com/egret-labs/resourcemanager/blob/master/docs/README.md#processor",
            2003: "{0}解析失败,错误原因:{1}",
            2004: "无法找到文件类型:{0}",
            2005: "资源配置文件中无法找到特定的资源组:{0}",
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
     * Promise的回调函数集合
     */
    export interface PromiseTaskReporter {

        /**
         * 进度回调
         */
        onProgress?: (current: number, total: number) => void;

        /**
         * 取消回调
         */
        onCancel?: () => void;

    }
}


