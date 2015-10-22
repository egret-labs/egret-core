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

    export var $currentSurface:NativeSurface;

    /**
     * @private
     * 呈现最终绘图结果的画布
     */
    export class NativeSurface extends egret.HashObject implements egret.sys.Surface {
        /**
         * @private
         */
        constructor() {
            super();
            if(egret_native.Canvas) {
                this.init();
            } else {
                //this.id = NativeSurface.id++;
            }
        }

        //private id;
        //private static id = 0;

        private init():void {
            this.renderContext = new NativeRenderContext();
        }

        /**
         * @private
         * @inheritDoc
         */
        public renderContext = egret_native.Canvas?null:new NativeRenderContext();

        public toDataURL(type?: string, ...args: any[]): string {
            if(egret_native.Canvas) {
                if(this.$nativeCanvas) {
                    return this.$nativeCanvas.toDataURL.apply(this.$nativeCanvas, arguments);
                }
            } else {
                if (this.$nativeRenderTexture) {
                    return this.$nativeRenderTexture.toDataURL.apply(this.$nativeRenderTexture, arguments);
                }
            }
            return null;
        }

        public saveToFile(type:string, filePath:string):void {
            if(egret_native.Canvas) {
                if(this.$nativeCanvas && this.$nativeCanvas.saveToFile) {
                    this.$nativeCanvas.saveToFile(type, filePath);
                }
            } else {
                if (this.$nativeRenderTexture && this.$nativeRenderTexture.saveToFile) {
                    this.$nativeRenderTexture.saveToFile(type, filePath);
                }
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
            if(egret_native.Canvas) {
                if(value > 0) {
                    this.$width = value;
                    //todo 性能优化
                    if(!this.$nativeCanvas) {
                        this.$nativeCanvas = new egret_native.Canvas(value, 1);
                        if(this.$isRoot) {
                            egret_native.setScreenCanvas(this.$nativeCanvas);
                        }
                        var context = this.$nativeCanvas.getContext("2d");
                        context.clearScreen(0,0,0,0);
                        this.renderContext.$nativeContext = context;
                    }
                    else {
                        this.$nativeCanvas.width = value;
                    }
                }
            } else {
                if (this.$width == value) {
                    return;
                }
                this.$width = value;
                if (!this.$isDispose) {
                    this.$widthReadySet = true;
                    this.createRenderTexture();
                }
            }
        }
        private $width: number;
        private $widthReadySet:boolean = false;

        /**
         * @private
         * @inheritDoc
         */
        public get height():number {
            return this.$height;
        }

        public set height(value:number) {
            if(egret_native.Canvas) {
                if(value > 0) {
                    this.$height = value;
                    //todo 性能优化
                    if(!this.$nativeCanvas) {
                        this.$nativeCanvas = new egret_native.Canvas(1, value);
                        if(this.$isRoot) {
                            egret_native.setScreenCanvas(this.$nativeCanvas);
                        }
                        var context = this.$nativeCanvas.getContext("2d");
                        context.clearScreen(0,0,0,0);
                        this.renderContext.$nativeContext = context;
                    }
                    else {
                        this.$nativeCanvas.height = value;
                    }
                }
            } else {
                if (this.$height == value) {
                    return;
                }
                this.$height = value;
                if (!this.$isDispose) {
                    this.$heightReadySet = true;
                    this.createRenderTexture();
                }
            }
        }

        public getImageData(sx:number, sy:number, sw:number, sh:number):sys.ImageData {
            if (sx != Math.floor(sx)) {
                sx = Math.floor(sx);
                sw++;
            }
            if (sy != Math.floor(sy)) {
                sy = Math.floor(sy);
                sh++;
            }
            return this.$nativeRenderTexture.getPixels(sx, sy, sw, sh);
        }

        private $height:number;
        private $heightReadySet:boolean = false;

        public $nativeRenderTexture;
        public $isRoot:boolean = false;

        private createRenderTexture():void {
            if (this.$isRoot) {
                return;
            }
            if (this.$nativeRenderTexture || (this.$widthReadySet && this.$heightReadySet)) {
                if (this.$nativeRenderTexture) {
                    this.$nativeRenderTexture.dispose();
                }
                //console.log("new RenderTexture" + this.id);
                this.$nativeRenderTexture = new egret_native.RenderTexture(this.$width, this.$height);
                this.renderContext.globalAlpha = 1;
                this.renderContext.globalCompositeOperation = "source-over";
                this.renderContext.setTransform(1, 0, 0, 1, 0, 0);
                this.$widthReadySet = false;
                this.$heightReadySet = false;
            }
        }

        public begin():void {
            if (this.$nativeRenderTexture) {
                //console.log("begin" + this.id);
                $currentSurface = this;
                if (this.$nativeRenderTexture.getIn) {
                    this.$nativeRenderTexture.getIn();
                }
                else {
                    this.$nativeRenderTexture.begin();
                }
            }
        }

        public end():void {
            if (this.$nativeRenderTexture) {
                //console.log("end" + this.id);
                $currentSurface = null;
                if (this.$nativeRenderTexture.getOut) {
                    this.$nativeRenderTexture.getOut();
                }
                else {
                    this.$nativeRenderTexture.end();
                }
            }
        }

        public $nativeCanvas;

        public setRootCanvas():void {
            egret_native.setScreenCanvas(this.$nativeCanvas);
        }

        private $isDispose:boolean = false;

        public $dispose():void {
            if(egret_native.Canvas) {
                //todo 销毁掉native对象
                //if(this.$nativeRenderTexture) {
                //    this.$nativeRenderTexture.dispose();
                //    this.$nativeRenderTexture = null;
                //}
                this.$isDispose = true;
            } else {
                if (this.$nativeRenderTexture) {
                    if ($currentSurface == this) {
                        $currentSurface.end();
                    }
                    //console.log("dispose" + this.id);
                    this.$nativeRenderTexture.dispose();
                    this.$nativeRenderTexture = null;
                }
                this.$isDispose = true;
            }
        }

        public $reload():void {
            this.$isDispose = false;
        }
    }
}