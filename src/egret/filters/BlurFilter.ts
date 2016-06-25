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
module egret {
    /**
     * @language en_US
     * The BlurFilter class lets you apply a blur visual effect to display objects. A blur effect softens the details of an image.
     * You can produce blurs that range from a softly unfocused look to a Gaussian blur, a hazy appearance like viewing an image through semi-opaque glass. 
     * @version Egret 3.0.1
     * @platform Web
     * @see http://edn.egret.com/cn/docs/page/947#模糊滤镜 模糊滤镜
     */
    /**
     * @language zh_CN
     * 可使用 BlurFilter 类将模糊视觉效果应用于显示对象。模糊效果可以柔化图像的细节。
     * 您可以生成一些模糊效果，范围从创建一个柔化的、未聚焦的外观到高斯模糊（就像通过半透明玻璃查看图像一样的朦胧的外观）。
     * @version Egret 3.1.0
     * @platform Web
     * @see http://edn.egret.com/cn/docs/page/947#模糊滤镜 模糊滤镜
     */
    export class BlurFilter extends Filter {
        /**
         * @language en_US
         * Initializes a BlurFilter object.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 创建一个 BlurFilter 对象。
         * @version Egret 3.1.0
         * @platform Web
         */
        constructor(blurX:number, blurY:number) {
            super();
            this.type = "blur";
            this.blurX = blurX;
            this.blurY = blurY;
        }
        
        /**
         * @language en_US
         * The amount of horizontal blur.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 水平模糊量。
         * @version Egret 3.1.0
         * @platform Web
         */
        public get blurX():number {
            return this.$blurX;
        }

        public set blurX(value:number) {
            if(this.$blurX == value) {
                return;
            }
            this.$blurX = value;
            this.invalidate();
        }
        
        private $blurX:number;
        
        /**
         * @language en_US
         * The amount of vertical blur.
         * @version Egret 3.1.0
         * @platform Web
         */
        /**
         * @language zh_CN
         * 垂直模糊量。
         * @version Egret 3.1.0
         * @platform Web
         */
        public get blurY():number {
            return this.$blurY;
        }

        public set blurY(value:number) {
            if(this.$blurY == value) {
                return;
            }
            this.$blurY = value;
            this.invalidate();
        }
        
        private $blurY:number;
    }
}