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
     * 呈现最终绘图结果的画布
     */
    export class NativeCanvas extends egret.HashObject {
        /**
         * @private
         */
        constructor() {
            super();
            this.renderContext = $supportCmdBatch ? new NativeCanvasRenderContext() : new OldNativeCanvasRenderContext();
        }

        /**
         * @private
         * @inheritDoc
         */
        private renderContext;

        public toDataURL(type?:string, ...args:any[]):string {
            if (this.$nativeCanvas) {
                return this.$nativeCanvas.toDataURL.apply(this.$nativeCanvas, arguments);
            }
            return null;
        }

        public saveToFile(type:string, filePath:string):void {
            if (this.$nativeCanvas && this.$nativeCanvas.saveToFile) {
                if (native.$supportCmdBatch) {
                    native.$cmdManager.flush();
                }

                this.$nativeCanvas.saveToFile(type, filePath);
            }
        }

        /**
         * @private
         * @inheritDoc
         */
        public get width():number {
            return this.$width;
        }

        public set width(value:number) {
            if (value > 0) {
                this.$width = value;
                if (!this.$nativeCanvas) {
                    this.$nativeCanvas = new egret_native.Canvas(value, 1);
                    if (this.$isRoot) {
                        egret_native.setScreenCanvas(this.$nativeCanvas);
                    }
                    let context = this.$nativeCanvas.getContext("2d");

                    if($supportCmdBatch) {
                        $cmdManager.setContext(context);
                        $cmdManager.clearScreen(0, 0, 0, 0);
                    } else {
                        context.clearScreen(0, 0, 0, 0);
                    }

                    this.renderContext.$nativeContext = context;
                }
                else {
                    this.$nativeCanvas.width = value;
                }
            }
        }

        private $width:number = 0;

        /**
         * @private
         * @inheritDoc
         */
        public get height():number {
            return this.$height;
        }

        public set height(value:number) {
            if (value > 0) {
                this.$height = value;
                if (!this.$nativeCanvas) {
                    this.$nativeCanvas = new egret_native.Canvas(1, value);
                    if (this.$isRoot) {
                        egret_native.setScreenCanvas(this.$nativeCanvas);
                    }
                    let context = this.$nativeCanvas.getContext("2d");
    
                    if($supportCmdBatch) {
                        $cmdManager.setContext(context);
                        $cmdManager.clearScreen(0, 0, 0, 0);
                    } else {
                        context.clearScreen(0, 0, 0, 0);
                    }

                    this.renderContext.$nativeContext = context;
                }
                else {
                    this.$nativeCanvas.height = value;
                }
            }
        }

        private $height:number = 0;

        public $nativeCanvas;
        public $isRoot:boolean;

        public getContext(type:string):NativeCanvasRenderContext {
            return this.renderContext;
        }
    }
}