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

/// <reference path="../display/Sprite.ts" />

namespace egret.sys {

    export let $TempStage: egret.Stage;

    /**
     * @private
     * Egret播放器
     */
    export class Player extends HashObject {

        /**
         * @private
         * 实例化一个播放器对象。
         */
        public constructor(buffer: RenderBuffer, stage: Stage, entryClassName: string) {
            super();
            if (DEBUG && !buffer) {
                $error(1003, "buffer");
            }
            this.entryClassName = entryClassName;
            this.stage = stage;
            this.screenDisplayList = this.createDisplayList(stage, buffer);


            this.showFPS = false;
            this.showLog = false;
            this.stageDisplayList = null;
            this.displayFPS = displayFPS;

            if (egret.nativeRender) {
                egret_native.rootWebGLBuffer = buffer;
            }
        }

        /**
         * @private
         */
        private createDisplayList(stage: Stage, buffer: RenderBuffer): DisplayList {
            let displayList = new DisplayList(stage);
            displayList.renderBuffer = buffer;
            stage.$displayList = displayList;
            //displayList.setClipRect(stage.$stageWidth, stage.$stageHeight);
            return displayList;
        }


        /**
         * @private
         */
        private screenDisplayList: DisplayList;
        /**
         * @private
         * 入口类的完整类名
         */
        private entryClassName: string;
        /**
         * @private
         * 舞台引用
         */
        public stage: Stage;
        /**
         * @private
         * 入口类实例
         */
        private root: DisplayObject;

        /**
         * @private
         */
        private isPlaying: boolean = false;

        /**
         * @private
         * 启动播放器
         */
        public start(): void {
            if (this.isPlaying || !this.stage) {
                return;
            }

            $TempStage = $TempStage || this.stage;

            this.isPlaying = true;
            if (!this.root) {
                this.initialize();
            }
            ticker.$addPlayer(this);
        }

        /**
         * @private
         */
        private initialize(): void {
            let rootClass;
            if (this.entryClassName) {
                rootClass = egret.getDefinitionByName(this.entryClassName);
            }
            if (rootClass) {
                let rootContainer: any = new rootClass();
                this.root = rootContainer;
                if (rootContainer instanceof egret.DisplayObject) {
                    this.stage.addChild(rootContainer);
                }
                else {
                    DEBUG && $error(1002, this.entryClassName);
                }
            }
            else {
                DEBUG && $error(1001, this.entryClassName);
            }
        }

        /**
         * @private
         * 停止播放器，停止后将不能重新启动。
         */
        public stop(): void {
            this.pause();
            this.stage = null;
        }

        /**
         * @private
         * 暂停播放器，后续可以通过调用start()重新启动播放器。
         */
        public pause(): void {
            if (!this.isPlaying) {
                return;
            }
            this.isPlaying = false;
            ticker.$removePlayer(this);
        }

        /**
         * @private
         * 渲染屏幕
         */
        $render(triggerByFrame: boolean, costTicker: number): void {
            if (egret.nativeRender) {
                egret_native.updateNativeRender();
                egret_native.nrRender();
                return;
            }

            if (this.showFPS || this.showLog) {
                this.stage.addChild(this.fps);
            }
            let stage = this.stage;
            let t1 = egret.getTimer();
            let drawCalls = stage.$displayList.drawToSurface();
            let t2 = egret.getTimer();
            if (triggerByFrame && this.showFPS) {
                this.fps.update(drawCalls, t2 - t1, costTicker);
            }
        }

        /**
         * @private
         * 更新舞台尺寸
         * @param stageWidth 舞台宽度（以像素为单位）
         * @param stageHeight 舞台高度（以像素为单位）
         */
        public updateStageSize(stageWidth: number, stageHeight: number): void {
            let stage = this.stage;
            stage.$stageWidth = stageWidth;
            stage.$stageHeight = stageHeight;
            if (egret.nativeRender) {
                egret_native.nrResize(stageWidth, stageHeight);
            } else {
                this.screenDisplayList.setClipRect(stageWidth, stageHeight);
                if (this.stageDisplayList) {
                    this.stageDisplayList.setClipRect(stageWidth, stageHeight);
                }
            }
            stage.dispatchEventWith(Event.RESIZE);
        }


        /**
         * @private
         * 显示FPS。
         */
        public displayFPS: (showFPS: boolean, showLog: boolean, logFilter: string, fpsStyles: Object) => void;
        /**
         * @private
         */
        private showFPS: boolean;
        /**
         * @private
         */
        private showLog: boolean;
        /**
         * @private
         */
        private fps: FPS;
        /**
         * @private
         */
        private stageDisplayList: DisplayList;
    }


    /**
     * @private
     * FPS显示对象
     */
    interface FPS extends Sprite {

        /**
         * 更新FPS信息
         */
        update(drawCalls: number, costRender, costTicker): void;

        /**
         * 插入一条log信息
         */
        updateInfo(info: string): void;
        /**
         * 插入一条warn信息
         */
        updateWarn(info: string): void;
        /**
         * 插入一条error信息
         */
        updateError(info: string): void;
    }

    declare let FPS: { new (stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: Object): FPS };

    /**
     * @private
     */
    export let $logToFPS: (info: string) => void;
    export let $warnToFPS: (info: string) => void;
    export let $errorToFPS: (info: string) => void;


    let logLines: string[] = [];
    let warnLines: string[] = [];
    let errorLines: string[] = [];
    let fpsDisplay: FPS;
    let fpsStyle: Object;

    $logToFPS = function (info: string): void {
        if (!fpsDisplay) {
            logLines.push(info);
            return;
        }
        fpsDisplay.updateInfo(info);
    };

    $warnToFPS = function (info: string): void {
        if (!fpsDisplay) {
            warnLines.push(info);
            return;
        }
        fpsDisplay.updateWarn(info);
    };

    $errorToFPS = function (info: string): void {
        if (!fpsDisplay) {
            errorLines.push(info);
            return;
        }
        fpsDisplay.updateError(info);
    };

    function displayFPS(showFPS: boolean, showLog: boolean, logFilter: string, styles: Object): void {
        if (showLog) {
            egret.log = function () {
                let length = arguments.length;
                let info = "";
                for (let i = 0; i < length; i++) {
                    info += arguments[i] + " ";
                }
                sys.$logToFPS(info);
                console.log.apply(console, toArray(arguments));
            };
            egret.warn = function () {
                let length = arguments.length;
                let info = "";
                for (let i = 0; i < length; i++) {
                    info += arguments[i] + " ";
                }
                sys.$warnToFPS(info);
                console.warn.apply(console, toArray(arguments));
            };
            egret.error = function () {
                let length = arguments.length;
                let info = "";
                for (let i = 0; i < length; i++) {
                    info += arguments[i] + " ";
                }
                sys.$errorToFPS(info);
                console.error.apply(console, toArray(arguments));
            };
        }
        fpsStyle = styles ? {} : styles;
        showLog = !!showLog;
        this.showFPS = !!showFPS;
        this.showLog = showLog;
        if (!this.fps) {
            let x = styles["x"] === undefined ? 0 : styles["x"];
            let y = styles["y"] === undefined ? 0 : styles["y"];
            fpsDisplay = this.fps = new FPS(this.stage, showFPS, showLog, logFilter, styles);
            fpsDisplay.x = x;
            fpsDisplay.y = y;

            let logLength = logLines.length;
            for (let i = 0; i < logLength; i++) {
                fpsDisplay.updateInfo(logLines[i]);
            }
            logLines = null;

            let warnLength = warnLines.length;
            for (let i = 0; i < warnLength; i++) {
                fpsDisplay.updateWarn(warnLines[i]);
            }
            warnLines = null;

            let errorLength = errorLines.length;
            for (let i = 0; i < errorLength; i++) {
                fpsDisplay.updateError(errorLines[i]);
            }
            errorLines = null;
        }
    }


    class FPSImpl extends egret.Sprite {

        private infoLines = [];
        private totalTime = 0;
        private totalTick = 0;
        private lastTime = 0;
        private drawCalls = 0;
        private costRender = 0;
        private costTicker = 0;
        private _stage: egret.Stage;
        private fpsDisplay: FPSDisplay;
        private filter: any;

        constructor(stage: egret.Stage, private showFPS: boolean, private showLog: boolean, private logFilter: string, private styles?: Object) {
            super();
            this["isFPS"] = true;
            this.infoLines = [];
            this.totalTime = 0;
            this.totalTick = 0;
            this.lastTime = 0;
            this.drawCalls = 0;
            this.costRender = 0;
            this.costTicker = 0;
            this._stage = stage;
            this.showFPS = showFPS;
            this.showLog = showLog;
            this.logFilter = logFilter;
            this.touchChildren = false;
            this.touchEnabled = false;
            this.styles = styles;
            this.fpsDisplay = new FPSDisplay(stage, showFPS, showLog, logFilter, styles);
            this.addChild(this.fpsDisplay);
            let logFilterRegExp: RegExp;
            try {
                logFilterRegExp = logFilter ? new RegExp(logFilter) : null;

            }
            catch (e) {
                log(e);
            }
            this.filter = function (message: string): boolean {
                if (logFilterRegExp)
                    return logFilterRegExp.test(message);
                return !logFilter || message.indexOf(logFilter) == 0;
            }
        }

        update(drawCalls: number, costRender, costTicker) {
            let current = egret.getTimer();
            this.totalTime += current - this.lastTime;
            this.lastTime = current;
            this.totalTick++;
            this.drawCalls += drawCalls;
            this.costRender += costRender;
            this.costTicker += costTicker;
            if (this.totalTime >= 1000) {

                let lastFPS = Math.min(Math.ceil(this.totalTick * 1000 / this.totalTime), ticker.$frameRate);
                let lastDrawCalls = Math.round(this.drawCalls / this.totalTick);
                let lastCostRender = Math.round(this.costRender / this.totalTick);
                let lastCostTicker = Math.round(this.costTicker / this.totalTick);
                this.fpsDisplay.update(
                    {
                        fps: lastFPS,
                        draw: lastDrawCalls,
                        costTicker: lastCostTicker,
                        costRender: lastCostRender
                    }
                )
                this.totalTick = 0;
                this.totalTime = this.totalTime % 1000;
                this.drawCalls = 0;
                this.costRender = 0;
                this.costTicker = 0;
            }
        }

        updateInfo(info: any) {
            if (!info) {
                return;
            }
            if (!this.showLog) {
                return;
            }
            if (!this.filter(info)) {
                return;
            }
            this.fpsDisplay.updateInfo(info);
        }

        updateWarn(info) {
            if (!info) {
                return;
            }
            if (!this.showLog) {
                return;
            }
            if (!this.filter(info)) {
                return;
            }
            if (this.fpsDisplay.updateWarn) {
                this.fpsDisplay.updateWarn(info);
            }
            else {
                this.fpsDisplay.updateInfo("[Warning]" + info);
            }
        }

        updateError(info) {
            if (!info) {
                return;
            }
            if (!this.showLog) {
                return;
            }
            if (!this.filter(info)) {
                return;
            }
            if (this.fpsDisplay.updateError) {
                this.fpsDisplay.updateError(info);
            }
            else {
                this.fpsDisplay.updateInfo("[Error]" + info);
            }
        }
    }

    __global.FPS = FPSImpl;

    function toArray(argument) {
        let args = [];
        for (let i = 0; i < argument.length; i++) {
            args.push(argument[i]);
        }
        return args;
    }

    egret.warn = function () {
        console.warn.apply(console, toArray(arguments))
    };
    egret.error = function () {
        console.error.apply(console, toArray(arguments))
    };
    egret.assert = function () {
        console.assert.apply(console, toArray(arguments))
    };
    egret.log = function () {
        console.log.apply(console, toArray(arguments));
    };
}


/**
 * @private
 */
module egret {
    /**
     * @private
     */
    export var nativeRender: boolean = __global.nativeRender;

    //检测版本是否匹配，不匹配改用非原生加速渲染方式
    if (nativeRender) {
        const nrABIVersion = egret_native.nrABIVersion;
        const nrMinEgretVersion = egret_native.nrMinEgretVersion;
        const requiredNrABIVersion = 1;
        if (nrABIVersion < requiredNrABIVersion) {
            nativeRender = false;
            const msg = "需要升级微端版本到 0.1.2 才可以开启原生渲染加速";
            sys.$warnToFPS(msg);
            egret.warn(msg);
        }
        else if (nrABIVersion > requiredNrABIVersion) {
            nativeRender = false;
            const msg = `需要升级引擎版本到 ${nrMinEgretVersion} 才可以开启原生渲染加速`;
            sys.$warnToFPS(msg);
            egret.warn(msg);
        }
    }
}
