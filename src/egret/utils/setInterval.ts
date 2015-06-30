module egret {
    var setIntervalCache:any = {};
    var setIntervalIndex:number = 0;

    var setIntervalCount:number = 0;

    /**
     * @language en_US
     * Specified function after a specified delay run (in milliseconds).
     * @param listener {Function} Listener function
     * @param thisObject {any} this object
     * @param delay {number} Delay time, in milliseconds
     * @param ...args {any} Parameter list
     * @returns {number} Return index which can be used for clearInterval
     */
    /**
     * @language zh_CN
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
     * @returns {number} 返回索引，可以用于 clearInterval
     */
    export function setInterval(listener:Function, thisObject:any, delay:number, ...args):number {
        var data = {listener: listener, thisObject: thisObject, delay: delay, originDelay: delay, params: args};

        setIntervalCount++;
        if (setIntervalCount == 1) {
            sys.$ticker.$startTick(intervalUpdate, null);
        }
        setIntervalIndex++;
        setIntervalCache[setIntervalIndex] = data;
        return setIntervalIndex;
    }

    /**
     * @language en_US
     * Clear function to run after a specified delay.
     * @param key {number} Index that egret.setInterval returns
     */
    /**
     * @language zh_CN
     * 清除指定延迟后运行的函数。
     * @param key {number} egret.setInterval所返回的索引
     */
    export function clearInterval(key:number):void {
        if (setIntervalCache[key]) {
            setIntervalCount--;

            delete setIntervalCache[key];
            if (setIntervalCount == 0) {
                sys.$ticker.$stopTick(intervalUpdate, null);
            }
        }
    }

    function intervalUpdate(dt:number):boolean {
        for (var key in setIntervalCache) {
            var data = setIntervalCache[key];
            data.delay -= dt;
            if (data.delay <= 0) {
                data.delay = data.originDelay;
                data.listener.apply(data.thisObject, data.params);
            }
        }

        return true;
    }
}