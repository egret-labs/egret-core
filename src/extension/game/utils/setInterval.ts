namespace egret {
    let setIntervalCache: any = {};
    let setIntervalIndex: number = 0;

    let setIntervalCount: number = 0;
    let lastTime: number = 0;

    /**
     * To specify a delay (in milliseconds) calls the function specified interval loop.
     * @param listener {Function} Listener function
     * @param thisObject {any} this object
     * @param delay {number} Delay time, in milliseconds
     * @param ...args {any} Parameter list
     * @returns {number} Return index which can be used for clearInterval
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/setInterval.ts
     * @language en_US
     */
    /**
     * 以指定的延迟（以毫秒为单位）间隔循环调用指定的函数。
     * @param listener {Function} 侦听函数
     * @param thisObject {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
     * @returns {number} 返回索引，可以用于 clearInterval
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample extension/game/utils/setInterval.ts
     * @language zh_CN
     */
    export function setInterval<Z>(listener: (this: Z, ...arg) => void, thisObject: Z, delay: number, ...args): number {
        let data = { listener: listener, thisObject: thisObject, delay: delay, originDelay: delay, params: args };

        setIntervalCount++;
        if (setIntervalCount == 1) {
            lastTime = egret.getTimer();
            ticker.$startTick(intervalUpdate, null);
        }
        setIntervalIndex++;
        setIntervalCache[setIntervalIndex] = data;
        return setIntervalIndex;
    }

    /**
     * Clear function to run after a specified delay.
     * @param key {number} Index that egret.setInterval returns
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/setInterval.ts
     * @language en_US
     */
    /**
     * 清除指定延迟后运行的函数。
     * @param key {number} egret.setInterval所返回的索引
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/utils/setInterval.ts
     * @language zh_CN
     */
    export function clearInterval(key: number): void {
        if (setIntervalCache[key]) {
            setIntervalCount--;

            delete setIntervalCache[key];
            if (setIntervalCount == 0) {
                ticker.$stopTick(intervalUpdate, null);
            }
        }
    }

    /**
     * @private
     * 
     * @param dt 
     */
    function intervalUpdate(timeStamp: number): boolean {
        let dt: number = timeStamp - lastTime;
        lastTime = timeStamp;

        for (let key in setIntervalCache) {
            let data = setIntervalCache[key];
            data.delay -= dt;
            if (data.delay <= 0) {
                data.delay = data.originDelay;
                data.listener.apply(data.thisObject, data.params);
            }
        }
        return false;
    }
}