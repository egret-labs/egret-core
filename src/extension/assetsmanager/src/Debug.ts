module RES {
    /**
     * Decorator, determine if the parameter is null
     * @internal
     * @version Egret 5.2
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 装饰器，判断参数是否为null
     * @internal
     * @version Egret 5.2
     * @platform Web,Native
     * @language zh_CN
     */
    export let checkNull: MethodDecorator = <Function>(target, propertyKey, descriptor) => {
        const method = descriptor.value;
        descriptor.value = function (...arg) {
            if (!arg[0]) {
                console.warn(`方法${propertyKey}的参数不能为null`)
                return null;
            }
            else {
                return method.apply(this, arg);
            }

        }
    }

    /**
     * 功能开关
     * LOADING_STATE：处理重复加载
     * @internal
     */
    export let FEATURE_FLAG = {
        FIX_DUPLICATE_LOAD: 1
    }



    /**
     * @internal
     */
    export namespace upgrade {


        var _level: LOG_LEVEL = "warning";

        type LOG_LEVEL = "warning" | "silent"

        export function setUpgradeGuideLevel(level: "warning" | "silent") {
            _level = level;
        }
    }
}