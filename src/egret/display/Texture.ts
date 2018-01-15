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


namespace egret {
    export let $TextureScaleFactor: number = 1;
    /**
     * The Texture class encapsulates different image resources on different platforms.
     * In HTML5, resource is an HTMLElement object
     * In OpenGL / WebGL, resource is a texture ID obtained after the GPU is submitted
     * The Texture class encapsulates the details implemented on the underlayer. Developers just need to focus on interfaces
     * @see http://edn.egret.com/cn/docs/page/135 The use of texture packs
     * @see http://edn.egret.com/cn/docs/page/123 Several ways of access to resources
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Texture.ts
     * @language en_US
     */
    /**
     * 纹理类是对不同平台不同的图片资源的封装
     * 在HTML5中，资源是一个HTMLElement对象
     * 在OpenGL / WebGL中，资源是一个提交GPU后获取的纹理id
     * Texture类封装了这些底层实现的细节，开发者只需要关心接口即可
     * @see http://edn.egret.com/cn/docs/page/135 纹理集的使用
     * @see http://edn.egret.com/cn/docs/page/123 获取资源的几种方式
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Texture.ts
     * @language zh_CN
     */
    export class Texture extends HashObject {

        /**
         * Create an egret.Texture object
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 egret.Texture 对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor() {
            super();
        }

        /**
         * @private
         * 纹理id
         */
        public $textureId: number;

        /**
         * Whether to destroy the corresponding BitmapData when the texture is destroyed
         * @version Egret 5.0.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 销毁纹理时是否销毁对应BitmapData
         * @version Egret 5.0.8
         * @platform Web,Native
         * @language zh_CN
         */
        public disposeBitmapData: boolean = true;

        /**
         * @private
         * 表示这个纹理在 bitmapData 上的 x 起始位置
         */
        public $bitmapX: number = 0;
        /**
         * @private
         * 表示这个纹理在 bitmapData 上的 y 起始位置
         */
        public $bitmapY: number = 0;
        /**
         * @private
         * 表示这个纹理在 bitmapData 上的宽度
         */
        public $bitmapWidth: number = 0;
        /**
         * @private
         * 表示这个纹理在 bitmapData 上的高度
         */
        public $bitmapHeight: number = 0;

        /**
         * @private
         * 表示这个纹理显示了之后在 x 方向的渲染偏移量
         */
        public $offsetX = 0;
        /**
         * @private
         * 表示这个纹理显示了之后在 y 方向的渲染偏移量
         */
        public $offsetY = 0;

        /**
         * @private
         * 纹理宽度
         */
        private $textureWidth: number = 0;

        /**
         * Texture width, read only
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 纹理宽度，只读属性，不可以设置
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get textureWidth(): number {
            return this.$getTextureWidth();
        }

        $getTextureWidth(): number {
            return this.$textureWidth;
        }

        /**
         * @private
         * 纹理高度
         */
        private $textureHeight: number = 0;

        /**
         * Texture height, read only
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 纹理高度，只读属性，不可以设置
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get textureHeight(): number {
            return this.$getTextureHeight();
        }

        $getTextureHeight(): number {
            return this.$textureHeight;
        }

        $getScaleBitmapWidth(): number {
            return this.$bitmapWidth * $TextureScaleFactor;
        }

        $getScaleBitmapHeight(): number {
            return this.$bitmapHeight * $TextureScaleFactor;
        }

        /**
         * @private
         * 表示bitmapData.width
         */
        public $sourceWidth: number = 0;
        /**
         * @private
         * 表示bitmapData.height
         */
        public $sourceHeight: number = 0;

        /**
         * @private
         */
        public $bitmapData: BitmapData = null;

        /**
         * @private
         */
        public $rotated: boolean = false;

        /**
         * The BitmapData object being referenced.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 被引用的 BitmapData 对象。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get bitmapData(): BitmapData {
            return this.$bitmapData;
        }

        public set bitmapData(value: BitmapData) {
            this._setBitmapData(value);
        }

        /**
        * Set the BitmapData object.
        * @version Egret 3.2.1
        * @platform Web,Native
        * @language en_US
        */
        /**
         * 设置 BitmapData 对象。
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language zh_CN
         */
        public _setBitmapData(value: BitmapData) {
            this.$bitmapData = value;
            let scale = $TextureScaleFactor;
            let w = value.width * scale;
            let h = value.height * scale;
            this.$initData(0, 0, w, h, 0, 0, w, h, value.width, value.height);
        }

        /**
         * @private
         * 设置Texture数据
         * @param bitmapX
         * @param bitmapY
         * @param bitmapWidth
         * @param bitmapHeight
         * @param offsetX
         * @param offsetY
         * @param textureWidth
         * @param textureHeight
         * @param sourceWidth
         * @param sourceHeight
         */
        public $initData(bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX: number, offsetY: number,
            textureWidth: number, textureHeight: number, sourceWidth: number, sourceHeight: number, rotated: boolean = false): void {
            let scale = $TextureScaleFactor;
            this.$bitmapX = bitmapX / scale;
            this.$bitmapY = bitmapY / scale;
            this.$bitmapWidth = bitmapWidth / scale;
            this.$bitmapHeight = bitmapHeight / scale;

            this.$offsetX = offsetX;
            this.$offsetY = offsetY;
            this.$textureWidth = textureWidth;
            this.$textureHeight = textureHeight;

            this.$sourceWidth = sourceWidth;
            this.$sourceHeight = sourceHeight;

            this.$rotated = rotated;

            //todo
            BitmapData.$invalidate(this.$bitmapData);
        }

        /**
         * @deprecated
         */
        public getPixel32(x: number, y: number): number[] {
            throw new Error();
        }

        /**
         * Obtain the color value for the specified pixel region
         * @param x  The x coordinate of the pixel region
         * @param y  The y coordinate of the pixel region
         * @param width  The width of the pixel region
         * @param height  The height of the pixel region
         * @returns  Specifies the color value for the pixel region
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取指定像素区域的颜色值
         * @param x  像素区域的X轴坐标
         * @param y  像素区域的Y轴坐标
         * @param width  像素点的Y轴坐标
         * @param height  像素点的Y轴坐标
         * @returns  指定像素区域的颜色值
         * @version Egret 3.2.1
         * @platform Web
         * @language zh_CN
         */
        public getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
            throw new Error();
        }

        /**
         * Convert base64 string, if the picture (or pictures included) cross-border or null
         * @param type Type conversions, such as "image / png"
         * @param rect The need to convert the area
         * @param smoothing Whether to convert data to the smoothing process
         * @returns {any} base64 string
         * @version Egret 2.4
         * @language en_US
         */
        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如  "image/png"
         * @param rect 需要转换的区域
         * @param {any} encoderOptions 编码用的参数
         * @returns {any} base64字符串
         * @version Egret 2.4
         * @language zh_CN
         */
        public toDataURL(type: string, rect?: egret.Rectangle, encoderOptions?): string {
            throw new Error();
        }

        /**
         * Crop designated area and save it as image.
         * native support only "image / png" and "image / jpeg"; Web browser because of the various implementations are not the same, it is recommended to use only these two kinds.
         * @param type Type conversions, such as "image / png"
         * @param filePath The path name of the image (the home directory for the game's private space, the path can not have "../",Web supports only pass names.)
         * @param rect The need to convert the area
         * @version Egret 2.4
         * @platform Native
         * @language en_US
         */
        /**
         * 裁剪指定区域并保存成图片。
         * native只支持 "image/png" 和 "image/jpeg"；Web中由于各个浏览器的实现不一样，因此建议也只用这2种。
         * @param type 转换的类型，如  "image/png"
         * @param filePath 图片的名称的路径（主目录为游戏的私有空间，路径中不能有 "../"，Web只支持传名称。）
         * @param rect 需要转换的区域
         * @version Egret 2.4
         * @platform Native
         * @language zh_CN
         */
        public saveToFile(type: string, filePath: string, rect?: egret.Rectangle): void {
            throw new Error();
        }

        /**
         * dispose texture
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 释放纹理
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public dispose(): void {
            if (this.$bitmapData) {
                if(this.disposeBitmapData) {
                    this.$bitmapData.$dispose();
                }
                this.$bitmapData = null;
            }
            if(egret.nativeRender) {
                egret_native.NativeDisplayObject.disposeTexture(this);
            }
        }
    }

}

