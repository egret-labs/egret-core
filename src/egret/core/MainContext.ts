/// <reference path="../display/DisplayObjectContainer.ts"/>
/// <reference path="Ticker.ts"/>
/// <reference path="../interactive/TouchContext.ts"/>
/// <reference path="../display/Stage.ts"/>
/// <reference path="../events/EventDispatcher.ts"/>
/// <reference path="../context/net/NetContext.ts"/>
/// <reference path="../context/sound/SoundContext.ts"/>
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
module ns_egret{
    /**
     * MainContext是游戏的核心跨平台接口，组合了多个功能Context，并是游戏启动的主入口
     */
    export class MainContext extends EventDispatcher {

        constructor() {
            super();
        }

        /**
         * 渲染Context
         */
        public rendererContext:RendererContext;

        /**
         * 触摸Context
         */
        public touchContext:TouchContext;

        /**
         * 声音Context
         */
        public soundContext:SoundContext;

        /**
         * 网络Context
         */
        public netContext:NetContext;

        /**
         * 舞台
         */
        public stage:Stage;

        /**
         * 游戏启动，开启主循环，参考Flash的滑动跑道模型
         */
        public run() {
            Ticker.getInstance().run();
            Ticker.getInstance().register(this.renderLoop, this, Number.MAX_VALUE);
            Ticker.getInstance().register(this.enterFrame, this, Number.MIN_VALUE);
            this.touchContext.run();
        }

        /**
         * 滑动跑道模型，逻辑计算部分
         */
        private enterFrame() {
            this.dispatchEvent(MainContext.EVENT_ENTER_FRAME);
        }

        /**
         * 滑动跑道模型，渲染部分
         */
        private renderLoop() {
            var context = this.rendererContext;
            context.clearScreen();
            this.dispatchEvent(MainContext.EVENT_START_RENDER);
            this.stage.updateTransform();
            this.dispatchEvent(MainContext.EVENT_FINISH_UPDATE_TRANSFORM);
            this.stage.draw(context);
            this.dispatchEvent(MainContext.EVENT_FINISH_RENDER);
        }

        public static instance:ns_egret.MainContext;

        /**
         * @event 主循环：进入新的一帧
         */
        public static EVENT_ENTER_FRAME:string = "enter_frame";
        /**
         * @event 主循环：开始渲染
         */
        public static EVENT_START_RENDER:string = "start_render";
        /**
         * @event 主循环：渲染完毕
         */
        public static EVENT_FINISH_RENDER:string = "finish_render";
        /**
         * @event 主循环：updateTransform完毕
         */
        public static EVENT_FINISH_UPDATE_TRANSFORM:string = "finish_updateTransform";
    }
}

ns_egret.MainContext.instance = new ns_egret.MainContext();