module RES {

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
     *  LOADING_STATE：处理重复加载
     */
    export let FEATURE_FLAG = {
        FIX_DUPLICATE_LOAD: 1
    }




    export namespace upgrade {


        var _level: LOG_LEVEL = "warning";

        type LOG_LEVEL = "warning" | "silent"

        export function setUpgradeGuideLevel(level: "warning" | "silent") {
            _level = level;
        }
    }
}