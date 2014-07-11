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
/// <reference path="../core/Logger.ts"/>
/// <reference path="../core/MainContext.ts"/>
/// <reference path="../core/Ticker.ts"/>
/// <reference path="../texture/Texture.ts"/>
var egret;
(function (egret) {
    var DEBUG = (function () {
        function DEBUG() {
        }

        /**
        * 跟踪渲染主循环过程
        * @param command 0,停止主循环; 1,执行一次主循环 2,正常循环渲染
        * @constructor
        */
        DEBUG.TRACE_RENDER_LOOP = function (command) {
            if (typeof command === "undefined") { command = 0; }
            var ticker = egret.Ticker.getInstance();
            var context = egret.MainContext.instance;
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
    egret.DEBUG = DEBUG;
})(egret || (egret = {}));