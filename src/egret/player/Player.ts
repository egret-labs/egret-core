//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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

module egret.sys {
    /**
     * @private
     * Egret播放器
     */
    export class Player extends HashObject {

        /**
         * @private
         * 实例化一个播放器对象。
         */
        public constructor(context:RenderContext, stage:Stage, entryClassName:string) {
            super();
            if (DEBUG && !context) {
                $error(1003, "context");
            }
            this.entryClassName = entryClassName;
            this.stage = stage;
            this.screenDisplayList = this.createDisplayList(stage, context);

            if (DEBUG) {//显示重绘区和FPS相关的代码,发行版中移除

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
        }

        /**
         * @private
         */
        private createDisplayList(stage:Stage, context:RenderContext):DisplayList {
            var displayList = new DisplayList(stage);
            displayList.renderContext = context;
            stage.$displayList = displayList;
            displayList.setClipRect(stage.$stageWidth, stage.$stageHeight);
            return displayList;
        }


        /**
         * @private
         */
        private screenDisplayList:DisplayList;
        /**
         * @private
         * 入口类的完整类名
         */
        private entryClassName:string;
        /**
         * @private
         * 舞台引用
         */
        public stage:Stage;
        /**
         * @private
         * 入口类实例
         */
        private root:DisplayObject;

        /**
         * @private
         */
        private isPlaying:boolean = false;

        /**
         * @private
         * 启动播放器
         */
        public start():void {
            if (this.isPlaying || !this.stage) {
                return;
            }
            this.isPlaying = true;
            if (!this.root) {
                this.loadVersion(this.initialize.bind(this));
            }
            $ticker.$addPlayer(this);
        }

        private loadVersion(completeCall:()=>void):void {
            var ctr = new egret.VersionController(this.stage);
            egret.NetContext.getNetContext().initVersion(ctr);

            ctr.addEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
            ctr.addEventListener(egret.Event.COMPLETE, loadComplete, this);
            ctr.fetchVersion();

            function loadError(e) {
                ctr.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
                ctr.removeEventListener(egret.Event.COMPLETE, loadComplete, this);

                console.log("Version control file loading failed. Please check");
                completeCall();
            }

            function loadComplete(e) {
                ctr.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
                ctr.removeEventListener(egret.Event.COMPLETE, loadComplete, this);

                completeCall();
            }
        }

        /**
         * @private
         * 
         */
        private initialize():void {
            var rootClass;
            if (this.entryClassName) {
                rootClass = egret.getDefinitionByName(this.entryClassName);
            }
            if (rootClass) {
                var rootContainer:any = new rootClass();
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
        public stop():void {
            this.pause();
            this.stage = null;
        }

        /**
         * @private
         * 暂停播放器，后续可以通过调用start()重新启动播放器。
         */
        public pause():void {
            if (!this.isPlaying) {
                return;
            }
            this.isPlaying = false;
            $ticker.$removePlayer(this);
        }

        /**
         * @private
         * 渲染屏幕
         */
        $render(triggerByFrame:boolean):void {
            if (DEBUG && (this.showFPS || this.showLog)) {
                this.stage.addChild(this.fpsDisplay);
            }
            this.callLaters();
            this.callLaterAsyncs();
            var stage = this.stage;
            var t = egret.getTimer();
            var dirtyList = stage.$displayList.updateDirtyRegions();

            var t1 = egret.getTimer();
            var drawCalls = 0;
            if (dirtyList.length > 0) {
                dirtyList = dirtyList.concat();
                drawCalls = stage.$displayList.drawToSurface();
            }

            if (DEBUG) {
                if (this._showPaintRect) {
                    this.drawPaintRect(dirtyList);
                }
                var t2 = egret.getTimer();
                if (triggerByFrame && this.showFPS) {
                    var dirtyRatio = 0;
                    if(drawCalls>0){
                        var length = dirtyList.length;
                        var dirtyArea = 0;
                        for (var i = 0; i < length; i++) {
                            dirtyArea += dirtyList[i].area;
                        }
                        dirtyRatio = Math.ceil(dirtyArea * 1000 / (stage.stageWidth * stage.stageHeight)) / 10;
                    }
                    this.fpsDisplay.update(drawCalls, dirtyRatio, t1 - t, t2 - t1);
                }
            }
        }

        /**
         * @private
         * 
         */
        private callLaters():void {
            if ($callLaterFunctionList.length > 0) {
                var functionList:Array<any> = $callLaterFunctionList;
                $callLaterFunctionList = [];
                var thisList:Array<any> = $callLaterThisList;
                $callLaterThisList = [];
                var argsList:Array<any> = $callLaterArgsList;
                $callLaterArgsList = [];
            }

            if (functionList) {
                var length:number = functionList.length;
                for (var i:number = 0; i < length; i++) {
                    var func:Function = functionList[i];
                    if (func != null) {
                        func.apply(thisList[i], argsList[i]);
                    }
                }
            }

        }

        /**
         * @private
         * 
         */
        private callLaterAsyncs():void {
            if($callAsyncFunctionList.length > 0) {
                var locCallAsyncFunctionList = $callAsyncFunctionList;
                var locCallAsyncThisList = $callAsyncThisList;
                var locCallAsyncArgsList = $callAsyncArgsList;

                $callAsyncFunctionList = [];
                $callAsyncThisList = [];
                $callAsyncArgsList = [];

                for (var i:number = 0; i < locCallAsyncFunctionList.length; i++) {
                    var func:Function = locCallAsyncFunctionList[i];
                    if (func != null) {
                        func.apply(locCallAsyncThisList[i], locCallAsyncArgsList[i]);
                    }
                }
            }

        }


        /**
         * @private
         * 更新舞台尺寸
         * @param stageWidth 舞台宽度（以像素为单位）
         * @param stageHeight 舞台高度（以像素为单位）
         */
        public updateStageSize(stageWidth:number, stageHeight:number, pixelRatio: number = 1):void {
            var stage = this.stage;
            if (stageWidth !== stage.$stageWidth || stageHeight !== stage.$stageHeight || this.screenDisplayList.$pixelRatio !== pixelRatio) {
                stage.$stageWidth = stageWidth;
                stage.$stageHeight = stageHeight;
                this.screenDisplayList.setDevicePixelRatio(pixelRatio);
                this.screenDisplayList.setClipRect(stageWidth, stageHeight);
                if (DEBUG && this.stageDisplayList) {
                    this.stageDisplayList.setDevicePixelRatio(pixelRatio);
                    this.stageDisplayList.setClipRect(stageWidth, stageHeight);
                }
                stage.dispatchEventWith(Event.RESIZE);
                stage.$invalidate(true);
            }
        }


        /**
         * @private
         * 显示FPS，仅在DEBUG模式下有效。
         */
        public displayFPS:(showFPS:boolean, showLog:boolean, logFilter:string, fpsStyles:Object)=>void;
        /**
         * @private
         */
        private showFPS:boolean;
        /**
         * @private
         */
        private showLog:boolean;
        /**
         * @private
         */
        private fpsDisplay:FPS;

        /**
         * @private
         * 是否显示脏矩形重绘区，仅在DEBUG模式下有效。
         */
        public showPaintRect:(value:boolean)=>void;
        /**
         * @private
         */
        private drawDirtyRect:(x:number, y:number, width:number, height:number, context:RenderContext)=>void;
        /**
         * @private
         */
        private _showPaintRect:boolean;
        /**
         * @private
         */
        private stageDisplayList:DisplayList;
        /**
         * @private
         */
        private paintList:any[];
        /**
         * @private
         */
        private drawPaintRect:(dirtyList:Region[])=>void;

    }


    /**
     * @private
     * FPS显示对象
     */
    interface FPS extends Sprite {
        new (stage:Stage, showFPS:boolean, showLog:boolean, logFilter:string):FPS
        /**
         * 更新FPS信息
         */
        update(drawCalls:number, dirtyRatio:number, ...args):void;

        /**
         * 插入一条日志信息
         */
        updateInfo(info:string):void;
    }

    declare var FPS:{new (stage:Stage, showFPS:boolean, showLog:boolean, logFilter:string, styles:Object):FPS};

    /**
     * @private
     */
    declare var $extends:Function;
    /**
     * @private
     */
    export var $logToFPS:(info:string)=>void;
    

    if (DEBUG) {//显示重绘区和FPS相关的代码,发行版中移除

        var infoLines:string[] = [];
        var fpsDisplay:FPS;
        var fpsStyle:Object;

        $logToFPS = function (info:string):void {
            if (!fpsDisplay) {
                infoLines.push(info);
                return;
            }
            fpsDisplay.updateInfo(info);
        }

        function displayFPS(showFPS:boolean, showLog:boolean, logFilter:string, styles:Object):void {
            fpsStyle = isUndefined(styles) ? {} : styles;
            showLog = !!showLog;
            this.showFPS = !!showFPS;
            this.showLog = showLog;
            if (!this.fpsDisplay) {
                var x = isUndefined(styles["x"]) ? 0 : styles["x"];
                var y = isUndefined(styles["y"]) ? 0 : styles["y"];
                fpsDisplay = this.fpsDisplay = new FPS(this.stage, showFPS, showLog, logFilter, styles);
                fpsDisplay.x = x;
                fpsDisplay.y = y;

                var length = infoLines.length;
                for (var i = 0; i < length; i++) {
                    fpsDisplay.updateInfo(infoLines[i]);
                }
                infoLines = null;
            }
        }


        function showPaintRect(value:boolean):void {
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


        function drawPaintRect(dirtyList:Region[]):void {
            var length = dirtyList.length;
            var list = [];
            for (var i = 0; i < length; i++) {
                var region:Region = dirtyList[i];
                list[i] = [region.minX, region.minY, region.width, region.height];
                region.width -= 1;
                region.height -= 1;
            }
            var repaintList = this.paintList;
            repaintList.push(list);
            if (repaintList.length > 1) {
                repaintList.shift();
            }
            var context = this.screenDisplayList.renderContext;
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, context.surface.width, context.surface.height);
            context.drawImage(this.stageDisplayList.surface, 0, 0);
            length = repaintList.length;
            for (i = 0; i < length; i++) {
                list = repaintList[i];
                for (var j = list.length - 1; j >= 0; j--) {
                    var r:number[] = list[j];
                    this.drawDirtyRect(r[0], r[1], r[2], r[3], context);
                }
            }
            context.save();
            context.beginPath();
            var length = dirtyList.length;
            for (var i = 0; i < length; i++) {
                var region = dirtyList[i];
                context.clearRect(region.minX, region.minY, region.width, region.height);
                context.rect(region.minX, region.minY, region.width, region.height);
            }
            context.clip();
            context.drawImage(this.stageDisplayList.surface, 0, 0);
            context.restore();
        }

        /**
         * 绘制一个脏矩形显示区域，在显示重绘区功能开启时调用。
         */
        function drawDirtyRect(x:number, y:number, width:number, height:number, context:RenderContext):void {
            context.strokeStyle = 'rgb(255,0,0)';
            context.lineWidth = 5;
            context.strokeRect(x - 0.5, y - 0.5, width, height);
        }

        /**
         * FPS显示对象
         */
        FPS = (function (_super):FPS {
            __extends(FPSImpl, _super);
            function FPSImpl(stage, showFPS, showLog, logFilter, styles:Object) {
                _super.call(this);
                this["isFPS"] = true;
                this.infoLines = [];
                this.totalTime = 0;
                this.totalTick = 0;
                this.lastTime = 0;
                this.drawCalls = 0;
                this._stage = stage;
                this.showFPS = showFPS;
                this.showLog = showLog;
                this.logFilter = logFilter;
                this.touchChildren = false;
                this.touchEnabled = false;
                this.styles = styles;
                this.createDisplay();
                try {
                    var logFilterRegExp = logFilter ? new RegExp(logFilter) : null;
                }
                catch (e) {
                    log(e);
                }
                this.filter = function (message:string):boolean {
                    if (logFilterRegExp)
                        return logFilterRegExp.test(message);
                    return !logFilter || message.indexOf(logFilter) == 0;
                }
            }

            FPSImpl.prototype.createDisplay = function () {
                this.shape = new egret.Shape();
                this.addChild(this.shape);
                var textField = new egret.TextField();
                textField.size = egret.isUndefined(this.styles["size"]) ? 24 : parseInt(this.styles["size"]);
                this.addChild(textField);
                this.textField = textField;
                textField.textColor = egret.isUndefined(this.styles["textColor"]) ? 0x00c200 : parseInt(this.styles["textColor"]);
                textField.fontFamily = "monospace";
                textField.x = 10;
                textField.y = 10;
                var textField = new egret.TextField();
                this.infoText = textField;
                this.addChild(textField);
                textField.textColor = egret.isUndefined(this.styles["textColor"]) ? 0xb0b0b0 : parseInt(this.styles["textColor"]);
                textField.fontFamily = "monospace";
                textField.x = 10;
                textField.size = egret.isUndefined(this.styles["size"]) ? 12 : this.styles["size"] / 2;
                textField.y = 10;
            };
            FPSImpl.prototype.update = function (drawCalls, dirtyRatio) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                var current = egret.getTimer();
                this.totalTime += current - this.lastTime;
                this.lastTime = current;
                this.totalTick++;
                this.drawCalls = Math.max(drawCalls, this.drawCalls);
                if (this.totalTime > 500) {
                    var lastFPS = Math.round(this.totalTick * 1000 / this.totalTime);
                    this.totalTick = 0;
                    this.totalTime = 0;
                    var text = "FPS: " + lastFPS + "\nDraw: " + this.drawCalls + "," + dirtyRatio + "%\nCost: " + args.join(",");
                    if (this.textField.text != text) {
                        this.textField.text = text;
                        this.updateLayout();
                    }
                    this.drawCalls = 0;
                }
            };
            /**
             * 插入一条日志信息
             */
            FPSImpl.prototype.updateInfo = function (info) {
                if (!this.showLog) {
                    return;
                }
                if (!this.filter(info)) {
                    return;
                }
                var lines = this.infoLines;
                if (info) {
                    lines.push(info);
                }
                this.infoText.width = NaN;
                this.infoText.text = lines.join("\n");
                if (this._stage.stageHeight > 0) {
                    if (this.infoText.textWidth > this._stage.stageWidth - 20) {
                        this.infoText.width = this._stage.stageWidth - 20;
                    }
                    while (this.infoText.textHeight > this._stage.stageHeight-20) {
                        lines.shift();
                        this.infoText.text = lines.join("\n");
                    }
                }
                this.updateLayout();
            };
            FPSImpl.prototype.updateLayout = function () {
                if (this.showFPS) {
                    this.infoText.y = this.textField.height + 20;
                }
                if(egret.MainContext.runtimeType == egret.MainContext.RUNTIME_NATIVE) {
                    return;
                }
                var g = this.shape.$graphics.$renderContext;
                g.clear();
                g.fillStyle = "rgba(68,68,68,1)";
                g.fillRect(0, 0, Math.max(160, this.width + 20), this.height + 20);
            };
            return <FPS><any>FPSImpl;
        })(egret.Sprite);
    }
}

