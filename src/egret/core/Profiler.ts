/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="MainContext.ts"/>
/// <reference path="Ticker.ts"/>
/// <reference path="../events/Event.ts"/>
/// <reference path="../text/TextField.ts"/>
/// <reference path="../utils/getTimer.ts"/>

module ns_egret {
    /**
	 * @class ns_egret.Profiler
	 * @classdesc
     * Profiler是egret的性能检测分析类
     * @todo GitHub文档，如何使用Profiler
     */
    export class Profiler {

        private static instance:Profiler;

        static getInstance():Profiler {
            if (Profiler.instance == null) {
                Profiler.instance = new Profiler();
            }
            return Profiler.instance;
        }


        private _lastTime:number = 0;
        private _lastFrameTime:number = 0;

        private _logicPerformanceCost:number = 0;
        private _renderPerformanceCost:number = 0;
        private _updateTransformPerformanceCost:number = 0;
        private _preDrawCount:number = 0;

        private _txt:TextField;
        private _tick:number = 0;

        /**
         * 启动Profiler
		 * @method ns_egret.Profiler#run
         */
        public run() {
            //todo 加入debug参数
            Ticker.getInstance().register(this.update, this);
            if (this._txt == null) {
                this._txt = new TextField();
                this._txt.size = 28;

                MainContext.instance.stage.addChild(this._txt);
            }
            var context = MainContext.instance;
            context.addEventListener(Event.ENTER_FRAME, this.onEnterFrame, this);
            context.addEventListener(Event.RENDER, this.onStartRender, this);
            context.addEventListener(Event.FINISH_RENDER, this.onFinishRender, this);
            context.addEventListener(Event.FINISH_UPDATE_TRANSFORM, this.onFinishUpdateTransform, this);
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
            var now:number = getTimer();
            var delta = now - this._lastFrameTime;
            this._lastFrameTime = now;
            this._tick++;
            if (this._tick == 6) {
                this._tick = 0;
                var drawStr = (this._preDrawCount - 1).toString();
                var timeStr = Math.ceil(this._logicPerformanceCost).toString() + ","
                    + Math.ceil(this._updateTransformPerformanceCost).toString() + ","
                    + Math.ceil(this._renderPerformanceCost).toString() + ","
                    + Math.ceil(ns_egret.MainContext.instance.rendererContext.renderCost).toString();
                var frameStr = Math.floor(1000 / delta).toString();

                this._txt.text = drawStr + "\n" + timeStr + "\n" + frameStr;
            }
            this._preDrawCount = 0;
        }

        /**
		 * @method ns_egret.Profiler#onDrawImage
         * @private
         */
        public onDrawImage() {
            this._preDrawCount++;
        }
    }
}