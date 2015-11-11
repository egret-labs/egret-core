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

module egret.native {

    /**
     * @private
     */
    export var $supportCanvas = egret_native.Canvas ? true : false;

    var isRunning:boolean = false;

    function runEgret() {
        if (isRunning) {
            return;
        }
        isRunning = true;
        if (DEBUG) {
            //todo 获得系统语言版本
            var language = "zh_CN";

            if (language in egret.$locale_strings)
                egret.$language = language;
        }
        try{
            Capabilities.$setNativeCapabilities(egret_native.getVersion());
        }catch(e){

        }
        var ticker = egret.sys.$ticker;
        var mainLoop = function () {
            ticker.update();
        };
        egret_native.executeMainLoop(mainLoop, ticker);
        sys.surfaceFactory = new OpenGLFactory();
        if (!egret.sys.screenAdapter) {
            egret.sys.screenAdapter = new egret.sys.ScreenAdapter();
        }

        //todo
        var player = new NativePlayer();
        //老版本runtime不支持canvas,关闭脏矩形
        if(!$supportCanvas) {
            player.$stage.dirtyRegionPolicy = DirtyRegionPolicy.OFF;
            egret.sys.DisplayList.prototype.setDirtyRegionPolicy = function(){};
        }
    }

    function toArray(argument) {
        var args = [];
        for (var i = 0; i < argument.length; i++) {
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
    if (DEBUG) {
        egret.log = function () {
            if (DEBUG) {
                var length = arguments.length;
                var info = "";
                for (var i = 0; i < length; i++) {
                    info += arguments[i] + " ";
                }
                sys.$logToFPS(info);
            }
            console.log.apply(console, toArray(arguments));
        }
    }
    else {
        egret.log = function () {
            console.log.apply(console, toArray(arguments))
        };
    }

    egret.runEgret = runEgret;
}