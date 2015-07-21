module egret {
    var __setInterval__cache:any = {};
    var __setInterval__index:number = 0;

    /**
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
     * @method egret.setInterval
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
     * @returns {number} 返回索引，可以用于 clearInterval
     */
    export function setInterval(listener:Function, thisObject:any, delay:number, ...args):number {
        var data = {listener: listener, thisObject: thisObject, delay: delay, originDelay: delay, params: args};
        if (__setInterval__index == 0) {
            Ticker.getInstance().register(intervalUpdate, null);
        }
        __setInterval__index++;
        __setInterval__cache[__setInterval__index] = data;
        return __setInterval__index;
    }

    /**
     * 清除指定延迟后运行的函数。
     * @method egret.clearInterval
     * @param key {number} egret.setInterval所返回的索引
     */
    export function clearInterval(key:number):void {
        delete __setInterval__cache[key];
    }

    function intervalUpdate(dt:number):void {
        for (var key in __setInterval__cache) {
            var data = __setInterval__cache[key];
            data.delay -= dt;
            if (data.delay <= 0) {
                data.delay = data.originDelay;
                data.listener.apply(data.thisObject, data.params);
            }
        }
    }
}