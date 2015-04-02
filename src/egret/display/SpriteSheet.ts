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


module egret {

    /**
     * @class egret.SpriteSheet
     * @classdesc SpriteSheet 是一张由多个子位图拼接而成的集合位图，它包含多个 Texture 对象。
     * 每一个 Texture 都共享 SpriteSheet 的集合位图，但是指向它的不同的区域。
     * 在WebGL / OpenGL上，这种做法可以显著提升性能
     * 同时，SpriteSheet可以很方便的进行素材整合，降低HTTP请求数量
     * SpriteSheet 格式的具体规范可以参见此文档  https://github.com/egret-labs/egret-core/wiki/Egret-SpriteSheet-Specification
     * @link http://docs.egret-labs.org/post/manual/bitmap/textures.html 纹理集的使用
     */
    export class SpriteSheet extends HashObject {

        /**
         * 创建一个 egret.SpriteSheet 对象
         * @param texture {Texture} 纹理
         */
        public constructor(texture:Texture) {
            super();
            var bitmapData:any = texture._bitmapData;
            this.bitmapData = bitmapData;
            this._sourceWidth = bitmapData.width;
            this._sourceHeight = bitmapData.height;

            this._bitmapX = texture._bitmapX - texture._offsetX;
            this._bitmapY = texture._bitmapY - texture._offsetY;
        }

        /**
         * 表示bitmapData.width
         */
        public _sourceWidth:number = 0;
        /**
         * 表示bitmapData.height
         */
        public _sourceHeight:number = 0;
        /**
         * 表示这个SpriteSheet的位图区域在bitmapData上的起始位置x。
         */
        private _bitmapX:number = 0;
        /**
         * 表示这个SpriteSheet的位图区域在bitmapData上的起始位置y。
         */
        private _bitmapY:number = 0;
        /**
         * 共享的位图数据
         */
        private bitmapData:any = 0;
        /**
         * 纹理缓存字典
         */
        public _textureMap:Object = {};

        /**
         * 根据指定纹理名称获取一个缓存的 Texture 对象
         * @method egret.SpriteSheet#getTexture
         * @param name {string} 缓存这个 Texture 对象所使用的名称
         * @returns {egret.Texture} Texture 对象
         */
        public getTexture(name:string):Texture {
            return this._textureMap[name];
        }

        /**
         * 为 SpriteSheet 上的指定区域创建一个新的 Texture 对象并缓存它
         * @method egret.SpriteSheet#createTexture
         * @param name {string} 缓存这个 Texture 对象所使用的名称，如果名称已存在，将会覆盖之前的 Texture 对象
         * @param bitmapX {number} 纹理区域在 bitmapData 上的起始坐标x
         * @param bitmapY {number} 纹理区域在 bitmapData 上的起始坐标y
         * @param bitmapWidth {number} 纹理区域在 bitmapData 上的宽度
         * @param bitmapHeight {number} 纹理区域在 bitmapData 上的高度
         * @param offsetX {number} 原始位图的非透明区域 x 起始点
         * @param offsetY {number} 原始位图的非透明区域 y 起始点
         * @param textureWidth {number} 原始位图的高度，若不传入，则使用 bitmapWidth 的值。
         * @param textureHeight {number} 原始位图的宽度，若不传入，则使用 bitmapHeight 的值。
         * @returns {egret.Texture} 创建的 Texture 对象
         */
        public createTexture(name:string, bitmapX:number, bitmapY:number, bitmapWidth:number, bitmapHeight:number, offsetX:number = 0, offsetY:number = 0, textureWidth?:number, textureHeight?:number):Texture {
            if (typeof textureWidth === "undefined") {
                textureWidth = offsetX + bitmapWidth;
            }
            if (typeof textureHeight === "undefined") {
                textureHeight = offsetY + bitmapHeight;
            }
            var texture:Texture = new Texture();
            var scale = egret.MainContext.instance.rendererContext._texture_scale_factor;
            texture._bitmapData = this.bitmapData;
            texture._bitmapX = this._bitmapX + bitmapX;
            texture._bitmapY = this._bitmapY + bitmapY;
            texture._bitmapWidth = bitmapWidth * scale;
            texture._bitmapHeight = bitmapHeight * scale;
            texture._offsetX = offsetX;
            texture._offsetY = offsetY;
            texture._textureWidth = textureWidth * scale;
            texture._textureHeight = textureHeight * scale;
            texture._sourceWidth = this._sourceWidth;
            texture._sourceHeight = this._sourceHeight;
            this._textureMap[name] = texture;
            return texture;
        }
    }
}