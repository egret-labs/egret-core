/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {
    /**
     * @class egret.Profiler
     * @classdesc
     * Profiler是egret的性能检测分析类
     * 请使用 egret.Profiler.getInstance().run();打开性能分析显示。
     */
    export class Profiler {

        private static instance:Profiler;

        /**
         * 返回系统中唯一的Profiler实例。
         * @returns {Profiler}
         */
        static getInstance():Profiler {
            if (Profiler.instance == null) {
                Profiler.instance = new Profiler();
            }
            return Profiler.instance;


        }


        private _lastTime:number = 0;

        private _logicPerformanceCost:number = 0;
        private _renderPerformanceCost:number = 0;
        private _updateTransformPerformanceCost:number = 0;
        private _preDrawCount:number = 0;

        private _txt:TextField = null;
        private _tick:number = 0;
        private _maxDeltaTime:number = 500;
        private _totalDeltaTime:number = 0;

        public _isRunning:boolean = false;

        public stop():void {
            if (!this._isRunning) {
                return;
            }

            this._isRunning = false;
            Ticker.getInstance().unregister(this.update, this);

            var context = MainContext.instance;
            context.removeEventListener(Event.ENTER_FRAME, this.onEnterFrame, this);
            context.removeEventListener(Event.RENDER, this.onStartRender, this);
            context.removeEventListener(Event.FINISH_RENDER, this.onFinishRender, this);
            context.removeEventListener(Event.FINISH_UPDATE_TRANSFORM, this.onFinishUpdateTransform, this);
        }

        /**
         * 启动Profiler
         * @method egret.Profiler#run
         */
        public run() {
            //todo 加入debug参数
            if (this._txt == null) {
                this._txt = new TextField();
                this._txt.size = 28;
                this._txt.multiline = true;
                this._txt._parent = new egret.DisplayObjectContainer();
            }

            if (this._isRunning) {
                return;
            }

            this._isRunning = true;
            Ticker.getInstance().register(this.update, this);

            var context = MainContext.instance;
            context.addEventListener(Event.ENTER_FRAME, this.onEnterFrame, this);
            context.addEventListener(Event.RENDER, this.onStartRender, this);
            context.addEventListener(Event.FINISH_RENDER, this.onFinishRender, this);
            context.addEventListener(Event.FINISH_UPDATE_TRANSFORM, this.onFinishUpdateTransform, this);
        }

        public _drawProfiler():void {
            this._txt._updateTransform();
            this._txt._draw(egret.MainContext.instance.rendererContext);
        }

        public _setTxtFontSize(fontSize:number){
            this._txt.size = fontSize;
        }

        /**
         * @private
         */
        private onEnterFrame(event:Event) {
            this._lastTime = getTimer();
        }

        /**
         * @private
         */
        private onStartRender(event:Event) {
            var now:number = getTimer();
            this._logicPerformanceCost = now - this._lastTime;
            this._lastTime = now;
        }

        private onFinishUpdateTransform(event:Event) {
            var now:number = getTimer();
            this._updateTransformPerformanceCost = now - this._lastTime;
            this._lastTime = now;
        }

        /**
         * @private
         */
        private onFinishRender(event:Event) {
            var now:number = getTimer();
            this._renderPerformanceCost = now - this._lastTime;
            this._lastTime = now;

        }

        /**
         * @private
         */
        private update(frameTime:number) {
            this._tick++;
            this._totalDeltaTime += frameTime;
            if (this._totalDeltaTime >= this._maxDeltaTime) {
                var drawStr = (this._preDrawCount - 3).toString();
                var timeStr = Math.ceil(this._logicPerformanceCost).toString() + ","
                    + Math.ceil(this._updateTransformPerformanceCost).toString() + ","
                    + Math.ceil(this._renderPerformanceCost).toString() + ","
                    + Math.ceil(egret.MainContext.instance.rendererContext.renderCost).toString();
                var frameStr = Math.floor(this._tick * 1000 / this._totalDeltaTime).toString();

                this._txt.text = "draw:" + drawStr + "\n" + "cost:" + timeStr + "\n" + "FPS:" + frameStr;

                this._totalDeltaTime = 0;
                this._tick = 0;
            }
            this._preDrawCount = 0;
        }

        /**
         * @method egret.Profiler#onDrawImage
         * @private
         */
        public onDrawImage() {
            this._preDrawCount++;
        }
    }
}