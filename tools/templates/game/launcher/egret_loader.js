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

egret_h5 = {};

egret_h5.prefix = "";

egret_h5.loadScript = function (list, callback) {
    var loaded = 0;
    var loadNext = function () {
        egret_h5.loadSingleScript(egret_h5.prefix + list[loaded], function () {
            loaded++;
            if (loaded >= list.length) {
                callback();
            }
            else {
                loadNext();
            }
        })
    };
    loadNext();
}

egret_h5.loadSingleScript = function (src, callback) {
    var s = document.createElement('script');
    if (s.hasOwnProperty("async")) {
        s.async = false;
    }
    s.src = src;
    s.addEventListener('load', function () {
        this.removeEventListener('load', arguments.callee, false);
        callback();
    }, false);
    document.body.appendChild(s);
}

egret_h5.startGame = function () {
    var canvas = document.getElementById(egret.StageDelegate.canvas_name);
    context = egret.MainContext.instance;
    context.touchContext = new egret.HTML5TouchContext(canvas);
    context.deviceContext = new egret.HTML5DeviceContext();
    context.netContext = new egret.HTML5NetContext();



    egret.StageDelegate.getInstance().setDesignSize(960, 640);
    context.stage = new egret.Stage();
    var scaleMode =  egret.MainContext.deviceType == egret.MainContext.DEVICE_MOBILE ? egret.StageScaleMode.SHOW_ALL : egret.StageScaleMode.NO_SCALE;
    context.stage.scaleMode = scaleMode;

    //WebGL是egret的Beta特性，默认关闭
    if(false){// egret.WebGLUtils.checkCanUseWebGL()) {
        context.rendererContext = new egret.WebGLRenderer(canvas);
    }
    else {
        context.rendererContext = new egret.HTML5CanvasRenderer(canvas);
    }

    egret.MainContext.instance.rendererContext.texture_scale_factor = 1;
    context.run();

    var rootClass;
    if(document_class){
        rootClass = egret.getDefinitionByName(document_class);
    }
    if(rootClass) {
        var rootContainer = new rootClass();
        if(rootContainer instanceof egret.DisplayObjectContainer){
            context.stage.addChild(rootContainer);
        }
        else{
            throw new Error("文档类必须是egret.DisplayObjectContainer的子类!");
        }
    }
    else{
        throw new Error("找不到文档类！");
    }
}

egret_h5.preloadScript = function (list, prefix) {
    if (!egret_h5.preloadList) {
        egret_h5.preloadList = [];
    }
    egret_h5.preloadList = egret_h5.preloadList.concat(list.map(function (item) {
        return prefix + item;
    }))
}

egret_h5.startLoading = function () {

    var logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANUAAAD6CAMAAAABZPJSAAAABGdBTUEAALGPC/xhBQAAAwBQTFRF////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////AAAA////T4si0AAAAP90Uk5TZS1IOmJWlovBLtHNxUtSn7+te5xFVD6KOGma07hsj7p9JXkow3M0PLxvjjdaUzVc5BuF3lmuPSZofC+C2EnV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";    var canvas = document.getElementById("gameCanvas");
    var img = document.createElement("img");
    img.src = logoBase64;
    canvas.getContext("2d").drawImage(img,480 / 2 - img.width / 2,800 / 2 - img.height / 2 - 50);

    var list = egret_h5.preloadList;
    egret_h5.loadScript(list, egret_h5.startGame);
}