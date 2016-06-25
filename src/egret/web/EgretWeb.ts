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

module egret.web {

    /**
     * @private
     * 刷新所有Egret播放器的显示区域尺寸。仅当使用外部JavaScript代码动态修改了Egret容器大小时，需要手动调用此方法刷新显示区域。
     * 当网页尺寸发生改变时此方法会自动被调用。
     */
    function updateAllScreens():void {
        if (!isRunning) {
            return;
        }
        var containerList = document.querySelectorAll(".egret-player");
        var length = containerList.length;
        for (var i = 0; i < length; i++) {
            var container = containerList[i];
            var player = <WebPlayer>container["egret-player"];
            player.updateScreenSize();
        }
    }

    var isRunning:boolean = false;

    /**
     * @private
     * 网页加载完成，实例化页面中定义的Egret标签
     */
    function runEgret(options?:{renderMode?:string;screenAdapter?:sys.IScreenAdapter}):void {
        if (isRunning) {
            return;
        }
        isRunning = true;
        if (!options) {
            options = {};
        }
        setRenderMode(options.renderMode);
        var ticker = egret.sys.$ticker;
        startTicker(ticker);
        if (options.screenAdapter) {
            egret.sys.screenAdapter = options.screenAdapter;
        }
        else if (!egret.sys.screenAdapter) {
            egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
        }

        var list = document.querySelectorAll(".egret-player");
        var length = list.length;
        for (var i = 0; i < length; i++) {
            var container = <HTMLDivElement>list[i];
            var player = new WebPlayer(container, options);
            container["egret-player"] = player;
            //webgl模式关闭脏矩形
            //if(options.renderMode == "webgl") {
            //    player.stage.dirtyRegionPolicy = DirtyRegionPolicy.OFF;
            //    egret.sys.DisplayList.prototype.setDirtyRegionPolicy = function () {
            //    };
            //}
        }
        // TODO hitTestBuffer创建目前必须在主buffer创建之后
        if (Capabilities.renderMode == "webgl") {
            sys.hitTestBuffer = new WebGLRenderBuffer(3, 3);
        }
        else {
        }
    }

    /**
     * 设置渲染模式。"auto","webgl","canvas"
     * @param renderMode
     */
    function setRenderMode(renderMode:string):void {
        if (renderMode == "webgl" && WebGLUtils.checkCanUseWebGL()) {
            sys.RenderBuffer = web.WebGLRenderBuffer;
            sys.systemRenderer = new WebGLRenderer();
            //屏蔽掉cacheAsBitmap,webgl模式不能有太多的RenderContext
            //DisplayObject.prototype.$setHasDisplayList = function(){};
            Capabilities.$renderMode = "webgl";
        }
        else {
            sys.hitTestBuffer = new CanvasRenderBuffer(3, 3);            
            sys.RenderBuffer = web.CanvasRenderBuffer;
            sys.systemRenderer = new CanvasRenderer();
            Capabilities.$renderMode = "canvas";
        }
    }

    /**
     * @private
     * 启动心跳计时器。
     */
    function startTicker(ticker:egret.sys.SystemTicker):void {
        var requestAnimationFrame =
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

        requestAnimationFrame.call(window, onTick);
        function onTick():void {
            ticker.update();
            requestAnimationFrame.call(window, onTick)
        }
    }

    //覆盖原生的isNaN()方法实现，在不同浏览器上有2~10倍性能提升。
    window["isNaN"] = function (value:number):boolean {
        value = +value;
        return value !== value;
    };

    egret.runEgret = runEgret;
    egret.updateAllScreens = updateAllScreens;

    var resizeTimer:number = NaN;

    function doResize() {
        resizeTimer = NaN;

        egret.updateAllScreens();
    }

    window.addEventListener("resize", function () {
        if (isNaN(resizeTimer)) {
            resizeTimer = window.setTimeout(doResize, 300);
        }
    });
}

if (DEBUG) {
    var language = navigator.language || navigator.browserLanguage || "en_US";
    language = language.replace("-", "_");

    if (language in egret.$locale_strings)
        egret.$language = language;
}