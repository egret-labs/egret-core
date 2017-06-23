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
            this._showPaintRect = false;
            this.stageDisplayList = null;
            this.paintList = [];
            this.displayFPS = displayFPS;
            this.showPaintRect = showPaintRect;
            this.drawPaintRect = drawPaintRect;
            this.drawDirtyRect = drawDirtyRect;
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
         *
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
            if (this.showFPS || this.showLog) {
                this.stage.addChild(this.fps);
            }
            let stage = this.stage;
            let t = egret.getTimer();
            let dirtyList = stage.$displayList.updateDirtyRegions();

            let t1 = egret.getTimer();
            dirtyList = dirtyList.concat();
            let drawCalls = stage.$displayList.drawToSurface();

            if (this._showPaintRect) {
                this.drawPaintRect(dirtyList);
            }
            let t2 = egret.getTimer();
            if (triggerByFrame && this.showFPS) {
                let dirtyRatio = 0;
                if (drawCalls > 0) {
                    let length = dirtyList.length;
                    let dirtyArea = 0;
                    for (let i = 0; i < length; i++) {
                        dirtyArea += dirtyList[i].area;
                    }
                    dirtyRatio = Math.ceil(dirtyArea * 1000 / (stage.stageWidth * stage.stageHeight)) / 10;
                }
                this.fps.update(drawCalls, dirtyRatio, t1 - t, t2 - t1, costTicker);
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
            //if (stageWidth !== stage.$stageWidth || stageHeight !== stage.$stageHeight) {
            stage.$stageWidth = stageWidth;
            stage.$stageHeight = stageHeight;
            this.screenDisplayList.setClipRect(stageWidth, stageHeight);
            if (this.stageDisplayList) {
                this.stageDisplayList.setClipRect(stageWidth, stageHeight);
            }
            stage.dispatchEventWith(Event.RESIZE);
            stage.$invalidate(true);
            //}
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
         * 是否显示脏矩形重绘区。
         */
        public showPaintRect: (value: boolean) => void;
        /**
         * @private
         */
        private drawDirtyRect: (x: number, y: number, width: number, height: number, context: any) => void;
        /**
         * @private
         */
        private _showPaintRect: boolean;
        /**
         * @private
         */
        private stageDisplayList: DisplayList;
        /**
         * @private
         */
        private paintList: any[];
        /**
         * @private
         */
        private drawPaintRect: (dirtyList: Region[]) => void;

    }


    /**
     * @private
     * FPS显示对象
     */
    interface FPS extends Sprite {
        new (stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string): FPS
        /**
         * 更新FPS信息
         */
        update(drawCalls: number, dirtyRatio: number, ...args): void;

        /**
         * 插入一条日志信息
         */
        updateInfo(info: string): void;
    }

    declare let FPS: { new (stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: Object): FPS };

    /**
     * @private
     */
    export let $logToFPS: (info: string) => void;


    let infoLines: string[] = [];
    let fpsDisplay: FPS;
    let fpsStyle: Object;

    $logToFPS = function (info: string): void {
        if (!fpsDisplay) {
            infoLines.push(info);
            return;
        }
        fpsDisplay.updateInfo(info);
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

            let length = infoLines.length;
            for (let i = 0; i < length; i++) {
                fpsDisplay.updateInfo(infoLines[i]);
            }
            infoLines = null;
        }
    }


    function showPaintRect(value: boolean): void {
        value = !!value;
        if (this._showPaintRect == value) {
            return;
        }
        this._showPaintRect = value;
        if (value) {
            if (!this.stageDisplayList) {
                this.stageDisplayList = sys.DisplayList.create(this.stage);
            }
            this.stage.$displayList = this.stageDisplayList;
        }
        else {
            this.stage.$displayList = this.screenDisplayList;
        }
    }


    function drawPaintRect(dirtyList: Region[]): void {
        let length = dirtyList.length;
        let list = [];
        for (let i = 0; i < length; i++) {
            let region: Region = dirtyList[i];
            list[i] = [region.minX, region.minY, region.width, region.height];
            region.width -= 1;
            region.height -= 1;
        }
        let repaintList = this.paintList;
        repaintList.push(list);
        if (repaintList.length > 1) {
            repaintList.shift();
        }
        let renderBuffer = this.screenDisplayList.renderBuffer;
        let context = renderBuffer.context;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, renderBuffer.surface.width, renderBuffer.surface.height);
        context.drawImage(this.stageDisplayList.renderBuffer.surface, 0, 0);
        length = repaintList.length;
        for (let i = 0; i < length; i++) {
            list = repaintList[i];
            for (let j = list.length - 1; j >= 0; j--) {
                let r: number[] = list[j];
                this.drawDirtyRect(r[0], r[1], r[2], r[3], context);
            }
        }
        context.save();
        context.beginPath();
        length = dirtyList.length;
        for (let i = 0; i < length; i++) {
            let region = dirtyList[i];
            let pixelRatio = DisplayList.$pixelRatio;
            context.clearRect(region.minX * pixelRatio, region.minY * pixelRatio, region.width * pixelRatio, region.height * pixelRatio);
            context.rect(region.minX * pixelRatio, region.minY * pixelRatio, region.width * pixelRatio, region.height * pixelRatio);
        }
        context.clip();
        context.drawImage(this.stageDisplayList.renderBuffer.surface, 0, 0);
        context.restore();
    }

    /**
     * 绘制一个脏矩形显示区域，在显示重绘区功能开启时调用。
     */
    function drawDirtyRect(x: number, y: number, width: number, height: number, context: any): void {
        context.strokeStyle = 'rgb(255,0,0)';
        context.lineWidth = 5;
        let pixelRatio = DisplayList.$pixelRatio;
        context.strokeRect(x * pixelRatio - 0.5, y * pixelRatio - 0.5, width * pixelRatio, height * pixelRatio);
    }

    /**
     * FPS显示对象
     */
    FPS = (function (_super): FPS {
        __extends(FPSImpl, _super);
        function FPSImpl(stage, showFPS, showLog, logFilter, styles: Object) {
            _super.call(this);
            this["isFPS"] = true;
            this.infoLines = [];
            this.totalTime = 0;
            this.totalTick = 0;
            this.lastTime = 0;
            this.drawCalls = 0;
            this.dirtyRatio = 0;
            this.costDirty = 0;
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
        FPSImpl.prototype.update = function (drawCalls, dirtyRatio, costDirty, costRender, costTicker) {
            let current = egret.getTimer();
            this.totalTime += current - this.lastTime;
            this.lastTime = current;
            this.totalTick++;
            this.drawCalls += drawCalls;
            this.dirtyRatio += dirtyRatio;
            this.costDirty += costDirty;
            this.costRender += costRender;
            this.costTicker += costTicker;
            if (this.totalTime >= 1000) {

                let lastFPS = Math.min(Math.ceil(this.totalTick * 1000 / this.totalTime), ticker.$frameRate);
                let lastDrawCalls = Math.round(this.drawCalls / this.totalTick);
                let lastDirtyRatio = Math.round(this.dirtyRatio / this.totalTick);
                let lastCostDirty = Math.round(this.costDirty / this.totalTick);
                let lastCostRender = Math.round(this.costRender / this.totalTick);
                let lastCostTicker = Math.round(this.costTicker / this.totalTick);
                this.fpsDisplay.update(
                    {
                        fps: lastFPS,
                        draw: lastDrawCalls,
                        dirty: lastDirtyRatio,
                        costTicker: lastCostTicker,
                        costDirty: lastCostDirty,
                        costRender: lastCostRender
                    }
                )
                this.totalTick = 0;
                this.totalTime = this.totalTime % 1000;
                this.drawCalls = 0;
                this.dirtyRatio = 0;
                this.costDirty = 0;
                this.costRender = 0;
                this.costTicker = 0;
            }
        };
        FPSImpl.prototype.updateInfo = function (info) {
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
        return <FPS><any>FPSImpl;
    })(egret.Sprite);

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

