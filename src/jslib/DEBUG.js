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
/// <reference path="../core/Logger.ts"/>
/// <reference path="../core/MainContext.ts"/>
/// <reference path="../core/Ticker.ts"/>
/// <reference path="../texture/Texture.ts"/>
var ns_egret;
(function (ns_egret) {
    var DEBUG = (function () {
        function DEBUG() {
        }
        DEBUG.checkDrawImage = function (texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight) {
            if (texture == null) {
                ns_egret.Logger.fatal("texture为空");
            }
            if (texture._textureWidth < sourceX + sourceWidth || texture._textureHeight < sourceY + sourceHeight) {
                ns_egret.Logger.fatal("提供的尺寸超出texture尺寸");
            }
        };

        DEBUG.checkAddEventListener = function (eventName, func, thisObj, useCapture, priority) {
            if (typeof useCapture === "undefined") { useCapture = false; }
            if (typeof priority === "undefined") { priority = 0; }
            if (func == null || func == undefined) {
                ns_egret.Logger.fatal("addEventListener侦听函数不能为空");
            }
        };

        DEBUG.checkSetScaleGrid = function (texture, top, bottom, left, right) {
            if (!texture) {
                ns_egret.Logger.fatal("Scale9Bitmap没有纹理");
            }
            if (parseInt(top) < 0 || parseInt(bottom) < 0 || parseInt(left) < 0 || parseInt(right) < 0) {
                ns_egret.Logger.fatal("传入的值不能为负数");
            }
            if (texture._textureWidth < left + right) {
                ns_egret.Logger.fatal("传入的宽度超出范围");
            }
            if (texture._textureHeight < top + bottom) {
                ns_egret.Logger.fatal("传入的高度超出范围");
            }
        };

        /**
        * 跟踪渲染主循环过程
        * @param command 0,停止主循环; 1,执行一次主循环 2,正常循环渲染
        * @constructor
        */
        DEBUG.TRACE_RENDER_LOOP = function (command) {
            if (typeof command === "undefined") { command = 0; }
            var ticker = ns_egret.Ticker.getInstance();
            var context = ns_egret.MainContext.instance;
            switch (command) {
                case 0:
                    ticker.unregister(context["renderLoop"], context);
                    break;
                case 1:
                    context["renderLoop"]();
                    break;
                case 2:
                    ticker.register(context["renderLoop"], context);
                    break;
            }
        };
        DEBUG.DRAW_IMAGE = true;

        DEBUG.ADD_EVENT_LISTENER = true;

        DEBUG.SCALE_BITMAP_SET_SCALE_GRID = true;
        return DEBUG;
    })();
    ns_egret.DEBUG = DEBUG;
})(ns_egret || (ns_egret = {}));


var unstable = unstable || {};
unstable.modal_api = {};
unstable.modal_api.setModal = function (value) {
    if (value == undefined) {
        value = true;
    }
    var container = this;
    container._modal = value;
    container.touchEnabled = value;
}

var hitTest = ns_egret.DisplayObjectContainer.prototype.hitTest;
ns_egret.DisplayObjectContainer.prototype.hitTest = function (x, y) {
    var container = this;
    if (container.visible == false) return null;
    var result = hitTest.call(this, x, y);
    if (container._modal) {
        return result ? result : this;
    }
    else {
        return result;
    }
}
ns_egret.DisplayObjectContainer.prototype.setModal = unstable.modal_api.setModal;