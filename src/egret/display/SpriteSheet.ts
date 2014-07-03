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
     * @classdesc SpriteSheet是一张由多个子位图拼接而成的集合位图，它包含多个Texture对象。
     * 每一个Texture都共享SpriteSheet的集合位图，但是指向它的不同的区域。
     * 在WebGL / OpenGL上，这种做法可以显著提升性能
     * 同时，SpriteSheet可以很方便的进行素材整合，降低HTTP请求数量
     */
    export class SpriteSheet extends HashObject {

        public constructor(bitmapData:any) {
            super();
            if (bitmapData.frames)//to-do 这段代码是为了兼容SpriteSheetFrame的配置，要删除。
                this._textureMap = bitmapData.frames;
            else {
                this.bitmapData = bitmapData;
                this._textureMap = {};
            }
        }

        /**
         * 共享的位图数据
         */
        private bitmapData:any;
        /**
         * 纹理缓存字典
         */
        public _textureMap:Object;

        /**
         * 根据指定纹理名称获取一个缓存的Texture对象
         * @method egret.SpriteSheet#getTexture
         * @param name {string} 缓存这个Texture对象所使用的名称，如果名称已存在，将会覆盖之前的Texture对象
         * @returns {egret.Texture} 创建的Texture对象
         */
        public getTexture(name:string):Texture {
            return this._textureMap[name];
        }

        /**
         * 为SpriteSheet上的指定区域创建一个新的Texture对象并缓存它
         * @method egret.SpriteSheet#createTexture
         * @param name {string} 缓存这个Texture对象所使用的名称，如果名称已存在，将会覆盖之前的Texture对象
         * @param startX {number} 指定位图区域在SpriteSheet上的起始坐标x
         * @param startY {number} 指定位图区域在SpriteSheet上的起始坐标y
         * @param width {number} 指定位图区域在SpriteSheet上的宽度
         * @param height {number} 指定位图区域在SpriteSheet上的高度
         * @param offsetX {number} 原始位图的非透明区域x起始点
         * @param offsetY {number} 原始位图的非透明区域y起始点
         * @param originalWidth {number} 原始位图的高度
         * @param originalHeight {number} 原始位图的宽度
         * @returns {egret.Texture} 创建的Texture对象
         */
        public createTexture(name:string, startX:number, startY:number, width:number, height:number,
                             offsetX:number=0,offsetY:number=0,originalWidth?:number,originalHeight?:number):Texture {
            if(typeof(originalWidth) === "undefined"){
                originalWidth = offsetX+width;
            }
            if(typeof(originalHeight) === "undefined"){
                originalHeight = offsetY+height;
            }
            var texture:Texture = new Texture();
            texture._bitmapData = this.bitmapData;
            texture._startX = startX;
            texture._startY = startY;
            texture._actualWidth = width;
            texture._actualHeight = height;
            texture._offsetX = offsetX;
            texture._offsetY = offsetY;
            texture._textureWidth = originalWidth;
            texture._textureHeight = originalHeight;
            this._textureMap[name] = texture;
            return texture;
        }
    }
}