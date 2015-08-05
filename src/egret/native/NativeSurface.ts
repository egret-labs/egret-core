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
     * 呈现最终绘图结果的画布
     */
    export class NativeSurface extends egret.HashObject implements egret.sys.Surface {
        /**
         * @private
         */
        constructor() {
            super();
        }

        /**
         * @private
         * @inheritDoc
         */
        public renderContext:egret.sys.RenderContext = new NativeRenderContext();

        public toDataURL(type?: string, ...args: any[]): string {
            return null;
        }

        /**
         * @private
         * @inheritDoc
         */
        public get width():number {
            return this.$width;
        }

        public set width(value:number) {
            this.$width = value;
            if(!this.$isDispose) {
                this.$widthReadySet = true;
                this.createRenderTexture();
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
            this.$height = value;
            if(!this.$isDispose) {
                this.$heightReadySet = true;
                this.createRenderTexture();
            }
        }
        private $height: number;
        private $heightReadySet:boolean = false;

        public $nativeRenderTexture;
        public $isRoot:boolean = false;

        private createRenderTexture():void {
            if(this.$isRoot) {
                return;
            }
            if(this.$widthReadySet && this.$heightReadySet) {
                if(this.$nativeRenderTexture) {
                    this.$nativeRenderTexture.dispose();
                }
                this.$nativeRenderTexture = new egret_native.RenderTexture(this.$width, this.$height);
                this.$nativeRenderTexture["avaliable"] = true;
                this.$widthReadySet = false;
                this.$heightReadySet = false;
            }
        }

        public begin():void {
            if(this.$nativeRenderTexture) {
                //console.log("begin");
                this.$nativeRenderTexture.begin();
            }
        }

        public end():void {
            if(this.$nativeRenderTexture) {
                //console.log("end");
                this.$nativeRenderTexture.end();
            }
        }

        private $isDispose:boolean = false;

        public $dispose():void {
            if(this.$nativeRenderTexture) {
                this.$nativeRenderTexture.dispose();
                this.$nativeRenderTexture = null;
            }
            this.$isDispose = true;
        }

        public $reload():void {
            this.$isDispose = false;
        }
    }
}