//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
namespace egret.sys {
    /**
     * @private
     */
    export let $START_TIME: number = 0;

    /**
     * @private
     * 是否要广播Event.RENDER事件的标志。
     */
    export let $invalidateRenderFlag: boolean = false;
    /**
     * @private
     * 需要立即刷新屏幕的标志
     */
    export let $requestRenderingFlag: boolean = false;

    /**
     * Egret心跳计时器
     */
    export class SystemTicker {
        /**
         * @private
         */
        public constructor() {
            if (DEBUG && ticker) {
                $error(1008, "egret.sys.SystemTicker");
            }
            $START_TIME = Date.now();
            this.frameDeltaTime = 1000 / this.$frameRate;
            this.lastCount = this.frameInterval = Math.round(60000 / this.$frameRate);
        }

        /**
         * @private
         */
        private playerList: Player[] = [];

        /**
         * @private
         * 注册一个播放器实例并运行
         */
        $addPlayer(player: Player): void {
            if (this.playerList.indexOf(player) != -1) {
                return;
            }

            if (DEBUG) {
                egret_stages.push(player.stage);
            }
            this.playerList = this.playerList.concat();
            this.playerList.push(player);
        }

        /**
         * @private
         * 停止一个播放器实例的运行。
         */
        $removePlayer(player: Player): void {
            let index = this.playerList.indexOf(player);
            if (index !== -1) {
                if (DEBUG) {
                    let i = egret_stages.indexOf(player.stage);
                    egret_stages.splice(i, 1);
                }
                this.playerList = this.playerList.concat();
                this.playerList.splice(index, 1);
            }
        }

        /**
         * @private
         */
        private callBackList: Function[] = [];
        /**
         * @private
         */
        private thisObjectList: any[] = [];

        /**
         * @private
         */
        $startTick(callBack: (timeStamp: number) => boolean, thisObject: any): void {
            let index = this.getTickIndex(callBack, thisObject);
            if (index != -1) {
                return;
            }
            this.concatTick();
            this.callBackList.push(callBack);
            this.thisObjectList.push(thisObject);
        }

        /**
         * @private
         */
        $stopTick(callBack: (timeStamp: number) => boolean, thisObject: any): void {
            let index = this.getTickIndex(callBack, thisObject);
            if (index == -1) {
                return;
            }
            this.concatTick();
            this.callBackList.splice(index, 1);
            this.thisObjectList.splice(index, 1);
        }

        /**
         * @private
         */
        private getTickIndex(callBack: Function, thisObject: any): number {
            let callBackList = this.callBackList;
            let thisObjectList = this.thisObjectList;
            for (let i = callBackList.length - 1; i >= 0; i--) {
                if (callBackList[i] == callBack &&
                    thisObjectList[i] == thisObject) {//这里不能用===，因为有可能传入undefined和null.
                    return i;
                }
            }
            return -1;
        }

        /**
         * @private
         *
         */
        private concatTick(): void {
            this.callBackList = this.callBackList.concat();
            this.thisObjectList = this.thisObjectList.concat();
        }

        /**
         * @private
         * 全局帧率
         */
        $frameRate: number = 30;

        /**
         * @private
         */
        private frameInterval: number;
        /**
         * @private
         */
        private frameDeltaTime: number;
        /**
         * @private
         */
        private lastTimeStamp: number = 0;

        /**
         * @private
         * 设置全局帧率
         */
        $setFrameRate(value: number): boolean {
            if (value <= 0) {
                return false;
            }
            if (this.$frameRate == value) {
                return false;
            }
            this.$frameRate = value;
            if (value > 60) {
                value = 60;
            }
            this.frameDeltaTime = 1000 / value;
            //这里用60*1000来避免浮点数计算不准确的问题。
            this.lastCount = this.frameInterval = Math.round(60000 / value);
            return true;
        }

        /**
         * @private
         */
        private lastCount: number;
        /**
         * @private
         * ticker 花销的时间
         */
        private costEnterFrame: number = 0;


        /**
         * @private
         * 是否被暂停
         */
        private isPaused: boolean = false;

        /**
         * Pause the ticker.
         * @version Egret 5.0.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 暂停心跳
         * @version Egret 5.0.2
         * @platform Web,Native
         * @language zh_CN
         */
        public pause(): void {
            this.isPaused = true;
        }

        /**
         * Resume the ticker.
         * @version Egret 5.0.2
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 恢复心跳
         * @version Egret 5.0.2
         * @platform Web,Native
         * @language zh_CN
         */
        public resume(): void {
            this.isPaused = false;
        }

        /**
         * @private
         * 执行一次刷新
         */
        public update(): void {
            let t1 = egret.getTimer();
            let callBackList = this.callBackList;
            let thisObjectList = this.thisObjectList;
            let length = callBackList.length;
            let requestRenderingFlag = $requestRenderingFlag;
            let timeStamp = egret.getTimer();
            let contexts = lifecycle.contexts;
            for (let c of contexts) {
                if (c.onUpdate) {
                    c.onUpdate();
                }
            }
            if (this.isPaused) {
                this.lastTimeStamp = timeStamp;
                return;
            }
            this.callLaterAsyncs();
            for (let i = 0; i < length; i++) {
                if (callBackList[i].call(thisObjectList[i], timeStamp)) {
                    requestRenderingFlag = true;
                }
            }
            let t2 = egret.getTimer();
            let deltaTime = timeStamp - this.lastTimeStamp;
            this.lastTimeStamp = timeStamp;
            if (deltaTime >= this.frameDeltaTime) {
                this.lastCount = this.frameInterval;
            }
            else {
                this.lastCount -= 1000;
                if (this.lastCount > 0) {
                    if (requestRenderingFlag) {
                        this.render(false, this.costEnterFrame + t2 - t1);
                    }
                    return;
                }
                this.lastCount += this.frameInterval;
            }
            this.render(true, this.costEnterFrame + t2 - t1);
            let t3 = egret.getTimer();
            this.broadcastEnterFrame();
            let t4 = egret.getTimer();
            this.costEnterFrame = t4 - t3;
        }

        /**
         * @private
         * 执行一次屏幕渲染
         */
        private render(triggerByFrame: boolean, costTicker: number): void {
            let playerList = this.playerList;
            let length = playerList.length;
            if (length == 0) {
                return;
            }
            this.callLaters();
            if ($invalidateRenderFlag) {
                this.broadcastRender();
                $invalidateRenderFlag = false;
            }
            for (let i = 0; i < length; i++) {
                playerList[i].$render(triggerByFrame, costTicker);
            }
            $requestRenderingFlag = false;
        }

        /**
         * @private
         * 广播EnterFrame事件。
         */
        private broadcastEnterFrame(): void {
            let list: any[] = DisplayObject.$enterFrameCallBackList;
            let length = list.length;
            if (length == 0) {
                return;
            }
            list = list.concat();
            for (let i = 0; i < length; i++) {
                list[i].dispatchEventWith(Event.ENTER_FRAME);
            }
        }

        /**
         * @private
         * 广播Render事件。
         */
        private broadcastRender(): void {
            let list = DisplayObject.$renderCallBackList;
            let length = list.length;
            if (length == 0) {
                return;
            }
            list = list.concat();
            for (let i = 0; i < length; i++) {
                list[i].dispatchEventWith(Event.RENDER);
            }
        }

        /**
         * @private
         */
        private callLaters(): void {
            let functionList: any[];
            let thisList: any[];
            let argsList: any[];
            if ($callLaterFunctionList.length > 0) {
                functionList = $callLaterFunctionList;
                $callLaterFunctionList = [];
                thisList = $callLaterThisList;
                $callLaterThisList = [];
                argsList = $callLaterArgsList;
                $callLaterArgsList = [];
            }

            if (functionList) {
                let length: number = functionList.length;
                for (let i: number = 0; i < length; i++) {
                    let func: Function = functionList[i];
                    if (func != null) {
                        func.apply(thisList[i], argsList[i]);
                    }
                }
            }
        }

        /**
         * @private
         */
        private callLaterAsyncs(): void {
            if ($callAsyncFunctionList.length > 0) {
                let locCallAsyncFunctionList = $callAsyncFunctionList;
                let locCallAsyncThisList = $callAsyncThisList;
                let locCallAsyncArgsList = $callAsyncArgsList;

                $callAsyncFunctionList = [];
                $callAsyncThisList = [];
                $callAsyncArgsList = [];

                for (let i: number = 0; i < locCallAsyncFunctionList.length; i++) {
                    let func: Function = locCallAsyncFunctionList[i];
                    if (func != null) {
                        func.apply(locCallAsyncThisList[i], locCallAsyncArgsList[i]);
                    }
                }
            }
        }
    }
}

module egret {

    export namespace lifecycle {

        export type LifecyclePlugin = (context: LifecycleContext) => void;

        /**
         * @private
         */
        export let stage: egret.Stage;

        /**
         * @private
         */
        export let contexts: LifecycleContext[] = [];
        let isActivate = true;

        export class LifecycleContext {

            pause() {
                if (isActivate) {
                    isActivate = false;
                    stage.dispatchEvent(new Event(Event.DEACTIVATE));
                    if (onPause) {
                        onPause();
                    }
                }
            }

            resume() {
                if (!isActivate) {
                    isActivate = true;
                    stage.dispatchEvent(new Event(Event.ACTIVATE));
                    if (onResume) {
                        onResume();
                    }
                }
            }

            onUpdate?: () => void;
        }

        export let onResume: () => void;

        export let onPause: () => void;

        export function addLifecycleListener(plugin: LifecyclePlugin) {
            let context = new LifecycleContext();
            contexts.push(context);
            plugin(context);
        }
    }

    /**
     * 心跳计时器单例
     */
    export let ticker: sys.SystemTicker = new sys.SystemTicker();
}

/**
 * @private
 */
declare let egret_stages: egret.Stage[];
if (DEBUG) {
    global.egret_stages = [];
}
