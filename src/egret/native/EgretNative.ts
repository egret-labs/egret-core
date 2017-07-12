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

namespace egret.native {

    /**
     * @private
     * 判断当前runtime版本是否支持cmdBatch
     */
    export let $supportCmdBatch = egret_native.sendToC ? true : false;

    /*
     * @private
     * 命令控制器
     * */
    class CmdManager {
        /*
         * 存储绘制命令的 array buffer
         **/
        private maxArrayBufferLen = 80000;

        private arrayBuffer:ArrayBuffer = new ArrayBuffer(this.maxArrayBufferLen * 4);
        private uint32View:Uint32Array = new Uint32Array(this.arrayBuffer);
        private float32View:Float32Array = new Float32Array(this.arrayBuffer);

        private arrayBufferLen:number = 0;

        /*
         * 存储字符串的数组
         */
        private strArray:string[] = [];

        /*
         * native上下文
         */
        private context:any;

        /*
         * 上传绘制命令到C
         */
        public flush() {
            egret_native.sendToC(this.float32View, this.arrayBufferLen, this.strArray);

            this.clear();
        }

        /*
         * 切换native上下文
         * native绘制需要在自身的上下文进行绘制
         */
        public setContext(ctx:any):void {
            if(this.context != ctx) {
                if(this.arrayBufferLen + 3 > this.maxArrayBufferLen) {
                    this.flush();
                }

                this.context = ctx;
                let uint32View = this.uint32View;
                let arrayBufferLen = this.arrayBufferLen;
                uint32View[arrayBufferLen++] = 1000;

                // uint32View[arrayBufferLen++] = ctx.___native_texture__p;
                // 兼容64位
                let addr = ctx.___native_texture__p;
                uint32View[arrayBufferLen++] = (addr / 4294967296) >>> 0;
                uint32View[arrayBufferLen++] = (addr & 4294967295) >>> 0;
                // uint32View[arrayBufferLen++] = addr >> 32;
                // uint32View[arrayBufferLen++] = addr & 4294967295;

                this.arrayBufferLen = arrayBufferLen;
            }
        }

        /*
         * 清空绘制命令
         */
        private clear() {
            this.arrayBufferLen = 0;
            this.strArray.length = 0;
        }

        /*
         * 压入一个字符串并返回索引 
         */
        public pushString(str:string):number {
            let array = this.strArray;
            let len = array.length;
            array[len] = str;
            return len;
        }

        //------绘制命令 start-------------

        public clearScreen(i1:number, i2:number, i3:number, i4:number):void {
            if(this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 100;

            uint32View[arrayBufferLen++] = i1;
            uint32View[arrayBufferLen++] = i2;
            uint32View[arrayBufferLen++] = i3;
            uint32View[arrayBufferLen++] = i4;

            this.arrayBufferLen = arrayBufferLen;
        }

        public drawImage(i1:number, f1:number, f2:number, f3:number, f4:number, f5:number, f6:number, f7:number, f8:number):void {
            if(this.arrayBufferLen + 11 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 101;

            // uint32View[arrayBufferLen++] = i1;
            // 兼容64位
            // uint32View[arrayBufferLen++] = i1 >> 32;
            // uint32View[arrayBufferLen++] = i1 & 4294967295;
            uint32View[arrayBufferLen++] = (i1 / 4294967296) >>> 0;
            uint32View[arrayBufferLen++] = (i1 & 4294967295) >>> 0;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;
            float32View[arrayBufferLen++] = f3;
            float32View[arrayBufferLen++] = f4;
            float32View[arrayBufferLen++] = f5;
            float32View[arrayBufferLen++] = f6;
            float32View[arrayBufferLen++] = f7;
            float32View[arrayBufferLen++] = f8;

            this.arrayBufferLen = arrayBufferLen;
        }

        public setTransform(f1:number, f2:number, f3:number, f4:number, f5:number, f6:number):void {
            if(this.arrayBufferLen + 7 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 103;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;
            float32View[arrayBufferLen++] = f3;
            float32View[arrayBufferLen++] = f4;
            float32View[arrayBufferLen++] = f5;
            float32View[arrayBufferLen++] = f6;

            this.arrayBufferLen = arrayBufferLen;
        }

        public setGlobalAlpha(f1:number):void {
            if(this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 106;

            float32View[arrayBufferLen++] = f1;

            this.arrayBufferLen = arrayBufferLen;
        }

        public pushRectStencils(array:any):void {
            let len = array.length;

            if(this.arrayBufferLen + len + 1 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 113;

            uint32View[arrayBufferLen++] = len;
            for(let i = 0; i < len; i++) {
                float32View[arrayBufferLen++] = array[i];
            }

            this.arrayBufferLen = arrayBufferLen;
        }

        public restore():void {
            if(this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                this.flush();
            }

            this.uint32View[this.arrayBufferLen++] = 116;
        }

        public save():void {
            if(this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                this.flush();
            }

            this.uint32View[this.arrayBufferLen++] = 117;
        }

        public setBlendArg(f1:number, f2:number):void {
            if(this.arrayBufferLen + 3 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 120;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;

            this.arrayBufferLen = arrayBufferLen;
        }

        public beginPath():void {
            if(this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                this.flush();
            }

            this.uint32View[this.arrayBufferLen++] = 204;
        }

        public closePath():void {
            if(this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                this.flush();
            }

            this.uint32View[this.arrayBufferLen++] = 205;
        }

        public rect(f1:number, f2:number, f3:number, f4:number):void {
            if(this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 210;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;
            float32View[arrayBufferLen++] = f3;
            float32View[arrayBufferLen++] = f4;

            this.arrayBufferLen = arrayBufferLen;
        }

        public clearRect(f1:number, f2:number, f3:number, f4:number):void {
            if(this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 214;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;
            float32View[arrayBufferLen++] = f3;
            float32View[arrayBufferLen++] = f4;

            this.arrayBufferLen = arrayBufferLen;
        }

        public createLabel(i1:number, f1:number, i2:number, f2:number):void {
            if(this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 300;

            uint32View[arrayBufferLen++] = i1;
            float32View[arrayBufferLen++] = f1;
            uint32View[arrayBufferLen++] = i2;
            float32View[arrayBufferLen++] = f2;

            this.arrayBufferLen = arrayBufferLen;
        }

        public drawText(i1:number, f1:number, f2:number):void {
            if(this.arrayBufferLen + 4 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 301;

            uint32View[arrayBufferLen++] = i1;
            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;

            this.arrayBufferLen = arrayBufferLen;
        }

        public setTextColor(i1:number):void {
            if(this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 302;

            uint32View[arrayBufferLen++] = i1;

            this.arrayBufferLen = arrayBufferLen;
        }

        public setStrokeColor(i1:number):void {
            if(this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 303;

            uint32View[arrayBufferLen++] = i1;

            this.arrayBufferLen = arrayBufferLen;
        }

        public setFillStyle(i1:number):void {
            if(this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 1200;

            uint32View[arrayBufferLen++] = i1;

            this.arrayBufferLen = arrayBufferLen;
        }

        public setStrokeStyle(i1:number):void {
            if(this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 1201;

            uint32View[arrayBufferLen++] = i1;

            this.arrayBufferLen = arrayBufferLen;
        }

        public setLineWidth(f1:number):void {
            if(this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 1202;

            float32View[arrayBufferLen++] = f1;

            this.arrayBufferLen = arrayBufferLen;
        }

        public moveTo(f1:number, f2:number):void {
            if(this.arrayBufferLen + 3 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 207;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;

            this.arrayBufferLen = arrayBufferLen;
        }

        public lineTo(f1:number, f2:number):void {
            if(this.arrayBufferLen + 3 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 208;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;

            this.arrayBufferLen = arrayBufferLen;
        }

        public fill(i1:number):void {
            if(this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 203;

            uint32View[arrayBufferLen++] = i1;

            this.arrayBufferLen = arrayBufferLen;
        }

        public pushClip(f1:number, f2:number, f3:number, f4:number):void {
            if(this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 107;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;
            float32View[arrayBufferLen++] = f3;
            float32View[arrayBufferLen++] = f4;

            this.arrayBufferLen = arrayBufferLen;
        }

        public popClip():void {
            if(this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                this.flush();
            }

            this.uint32View[this.arrayBufferLen++] = 108;
        }

        public stroke():void {
            if(this.arrayBufferLen + 1 > this.maxArrayBufferLen) {
                this.flush();
            }

            this.uint32View[this.arrayBufferLen++] = 206;
        }

        public arc(f1:number, f2:number, f3:number, f4:number, f5:number, i6:number):void {
            if(this.arrayBufferLen + 7 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 209;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;
            float32View[arrayBufferLen++] = f3;
            float32View[arrayBufferLen++] = f4;
            float32View[arrayBufferLen++] = f5;
            uint32View[arrayBufferLen++] = i6;

            this.arrayBufferLen = arrayBufferLen;
        }

        public quadraticCurveTo(f1:number, f2:number, f3:number, f4:number):void {
            if(this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 211;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;
            float32View[arrayBufferLen++] = f3;
            float32View[arrayBufferLen++] = f4;

            this.arrayBufferLen = arrayBufferLen;
        }

        public fillRect(f1:number, f2:number, f3:number, f4:number):void {
            if(this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 212;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;
            float32View[arrayBufferLen++] = f3;
            float32View[arrayBufferLen++] = f4;

            this.arrayBufferLen = arrayBufferLen;
        }

        public strokeRect(f1:number, f2:number, f3:number, f4:number):void {
            if(this.arrayBufferLen + 5 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 213;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;
            float32View[arrayBufferLen++] = f3;
            float32View[arrayBufferLen++] = f4;

            this.arrayBufferLen = arrayBufferLen;
        }

        public bezierCurveTo(f1:number, f2:number, f3:number, f4:number, f5:number, f6:number):void {
            if(this.arrayBufferLen + 7 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let float32View = this.float32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 215;

            float32View[arrayBufferLen++] = f1;
            float32View[arrayBufferLen++] = f2;
            float32View[arrayBufferLen++] = f3;
            float32View[arrayBufferLen++] = f4;
            float32View[arrayBufferLen++] = f5;
            float32View[arrayBufferLen++] = f6;

            this.arrayBufferLen = arrayBufferLen;
        }

        public setGlobalShader(i1:number):void {
            if(this.arrayBufferLen + 2 > this.maxArrayBufferLen) {
                this.flush();
            }

            let uint32View = this.uint32View;
            let arrayBufferLen = this.arrayBufferLen;

            uint32View[arrayBufferLen++] = 111;

            uint32View[arrayBufferLen++] = i1;

            this.arrayBufferLen = arrayBufferLen;
        }

        //------绘制命令 end-------------

    }

    /*
     * @private 
     * 输出一个单例命令控制器，供所有需要调用的地方使用
     */
    export let $cmdManager = new CmdManager();

    let isRunning:boolean = false;
    let playerList:Array<NativePlayer> = [];

    function runEgret(options?:{renderMode?:string;audioType?:number;screenAdapter?:sys.IScreenAdapter}) {
        if (isRunning) {
            return;
        }
        isRunning = true;
        if(!options){
            options = {};
        }
        setRenderMode(options.renderMode);
        if (DEBUG) {
            //todo 获得系统语言版本
            let language = "zh_CN";

            if (language in egret.$locale_strings)
                egret.$language = language;
        }
        try {
            Capabilities.$setNativeCapabilities(egret_native.getVersion());
        } catch (e) {

        }
        let ticker = egret.ticker;
        let mainLoop = $supportCmdBatch ? function () {
            ticker.update();
            $cmdManager.flush();
        } : function() {
            ticker.update();
        };
        egret_native.executeMainLoop(mainLoop, ticker);
        if (!egret.sys.screenAdapter) {
            if(options.screenAdapter){
                egret.sys.screenAdapter = options.screenAdapter;
            }
            else{
                egret.sys.screenAdapter = new egret.sys.DefaultScreenAdapter();
            }
        }

        //todo
        let player = new NativePlayer();
        playerList.push(player);
        sys.customHitTestBuffer = new NativeCanvasRenderBuffer(3, 3);
        sys.canvasHitTestBuffer = sys.customHitTestBuffer;
    }

    /**
     * 设置渲染模式。"auto","webgl","canvas"
     * @param renderMode
     */
    function setRenderMode(renderMode:string):void{
        sys.RenderBuffer = NativeCanvasRenderBuffer;
        sys.CanvasRenderBuffer = NativeCanvasRenderBuffer;
        sys.systemRenderer = new CanvasRenderer();
        sys.canvasRenderer = sys.systemRenderer;
        Capabilities.$renderMode = "canvas";
    }

    function updateAllScreens():void {
        let length:number = playerList.length;
        for (let i:number = 0; i < length; i++) {
            playerList[i].updateScreenSize();
        }
    }

    function toArray(argument) {
        let args = [];
        for (let i = 0; i < argument.length; i++) {
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
        if (console.assert) {
            console.assert.apply(console, toArray(arguments));
        } else {
            let args = toArray(arguments);
            if (!args[0]) {
                let args2 = [];
                for (let i = 1; i < args.length; i++) {
                    args2.push(args[i]);
                }
                console.error.apply(console, args2);
            }
            
        }
    };
    if (DEBUG) {
        egret.log = function () {
            if (DEBUG) {
                let length = arguments.length;
                let info = "";
                for (let i = 0; i < length; i++) {
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
    egret.updateAllScreens = updateAllScreens;
}