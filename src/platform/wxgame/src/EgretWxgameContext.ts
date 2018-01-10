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

namespace egret.wxgame {
    /**
     * 微信小游戏支持库版本号
     */
    export let version = "1.0.7";

    /**
     * 运行环境是否为子域
     */
    export let isSubContext:boolean = false;
}

namespace egret.wxapp {

    let customContext: CustomContext;

    let context: EgretContext = {

        setAutoClear: function (value: boolean): void {
            WebGLRenderBuffer.autoClear = value;
        },

        save: function () {
            // do nothing
        },

        restore: function () {
            let context = WebGLRenderContext.getInstance(0, 0);
            let gl = context.context;
            gl.bindBuffer(gl.ARRAY_BUFFER, context["vertexBuffer"]);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, context["indexBuffer"]);
            gl.activeTexture(gl.TEXTURE0);
            context.currentProgram = null;
            context["bindIndices"] = false;
            let buffer = context.$bufferStack[1];
            context["activateBuffer"](buffer);
            gl.enable(gl.BLEND);
            context["setBlendMode"]("source-over");
        }
    }

    function setRendererContext(custom: CustomContext) {
        custom.onStart(context);
        customContext = custom;
    }
    egret.setRendererContext = setRendererContext;

    /**
     * @private
     * 刷新所有Egret播放器的显示区域尺寸。仅当使用外部JavaScript代码动态修改了Egret容器大小时，需要手动调用此方法刷新显示区域。
     * 当网页尺寸发生改变时此方法会自动被调用。
     */
    function updateAllScreens(): void {
        if (!isRunning) {
            return;
        }
        // let containerList = document.querySelectorAll(".egret-player");
        // let length = containerList.length;
        // for (let i = 0; i < length; i++) {
        //     let container = containerList[i];
        //     let player = <WebPlayer>container["egret-player"];
        window['player'].updateScreenSize();
        // }
    }

    let isRunning: boolean = false;

    /**
     * @private
     * 网页加载完成，实例化页面中定义的Egret标签
     */
    function runEgret(options?: runEgretOptions): void {
        if (isRunning) {
            return;
        }
        isRunning = true;
        if (!options) {
            options = {};
        }
        Html5Capatibility._audioType = options.audioType;
        Html5Capatibility.$init();

        // WebGL上下文参数自定义
        if (options.renderMode == "webgl") {
            // WebGL抗锯齿默认关闭，提升PC及某些平台性能
            let antialias = options.antialias;
            WebGLRenderContext.antialias = !!antialias;
            // WebGLRenderContext.antialias = (typeof antialias == undefined) ? true : antialias;
        }

        sys.CanvasRenderBuffer = wxapp.CanvasRenderBuffer;
        setRenderMode(options.renderMode);

        let canvasScaleFactor;
        if (options.canvasScaleFactor) {
            canvasScaleFactor = options.canvasScaleFactor;
        }
        else if (options.calculateCanvasScaleFactor) {
            canvasScaleFactor = options.calculateCanvasScaleFactor(sys.canvasHitTestBuffer.context);
        }
        else {
            //based on : https://github.com/jondavidjohn/hidpi-canvas-polyfill
            let context = sys.canvasHitTestBuffer.context;
            let backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;
            canvasScaleFactor = (window.devicePixelRatio || 1) / backingStore;
        }
        sys.DisplayList.$canvasScaleFactor = canvasScaleFactor;

        let ticker = egret.ticker;
        startTicker(ticker);
        if (options.screenAdapter) {
            egret.sys.screenAdapter = options.screenAdapter;
        }
        else if (!egret.sys.screenAdapter) {
            egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
        }

        // let list = document.querySelectorAll(".egret-player");
        // let length = list.length;
        // for (let i = 0; i < length; i++) {
        //     let container = <HTMLDivElement>list[i];
        //     let player = new WebPlayer(container, options);
        //     container["egret-player"] = player;
        // }

        var container = {};
        var player = new wxapp.WebPlayer(container, options);
        window['player'] = player;


        window.addEventListener("resize", function () {
            if (isNaN(resizeTimer)) {
                resizeTimer = window.setTimeout(doResize, 300);
            }
        });
    }

    /**
     * 设置渲染模式。"auto","webgl","canvas"
     * @param renderMode
     */
    function setRenderMode(renderMode: string): void {
        if (!wxgame.isSubContext) {
            Capabilities.$renderMode = "webgl";
            sys.RenderBuffer = wxapp.WebGLRenderBuffer;
            sys.systemRenderer = new WebGLRenderer();
            sys.canvasRenderer = new CanvasRenderer();
            sys.customHitTestBuffer = new WebGLRenderBuffer(3, 3);
            sys.canvasHitTestBuffer = new CanvasRenderBuffer(3, 3);

        }
        else {
            Capabilities.$renderMode = "canvas";
            sys.RenderBuffer = wxapp.CanvasRenderBuffer;
            sys.systemRenderer = new CanvasRenderer();
            sys.canvasRenderer = sys.systemRenderer;
            sys.customHitTestBuffer = new CanvasRenderBuffer(3, 3);
            sys.canvasHitTestBuffer = sys.customHitTestBuffer;
        }
    }

    /**
     * @private
     * 启动心跳计时器。
     */
    function startTicker(ticker: egret.sys.SystemTicker): void {
        let requestAnimationFrame =
            window["requestAnimationFrame"] ||
            window["webkitRequestAnimationFrame"] ||
            window["mozRequestAnimationFrame"] ||
            window["oRequestAnimationFrame"] ||
            window["msRequestAnimationFrame"];

        if (!requestAnimationFrame) {
            requestAnimationFrame = function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            };
        }

        requestAnimationFrame(onTick);
        function onTick(): void {

            if (customContext) {
                customContext.onRender(context);
            }

            ticker.update();
            requestAnimationFrame(onTick);
        }
    }

    //覆盖原生的isNaN()方法实现，在不同浏览器上有2~10倍性能提升。
    window["isNaN"] = function (value: number): boolean {
        value = +value;
        return value !== value;
    };

    egret.runEgret = runEgret;
    egret.updateAllScreens = updateAllScreens;

    let resizeTimer: number = NaN;

    function doResize() {
        resizeTimer = NaN;

        egret.updateAllScreens();

        if (customContext) {
            customContext.onResize(context);
        }
    }
}

if (DEBUG) {
    let language = navigator.language || navigator["browserLanguage"] || "en_US";
    language = language.replace("-", "_");

    if (language in egret.$locale_strings)
        egret.$language = language;
}
