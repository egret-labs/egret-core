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


module dragonBones {
    /**
     * @class dragonBones.EgretTextureAtlas
     * @implements dragonBones.ITextureAtlas
     * @classdesc
     * egret引擎使用的纹理集
     */
    export class EgretTextureAtlas implements ITextureAtlas {
        /**
         * 名字
         * @member {string} dragonBones.EgretTextureAtlas#name
         */
        public name:string;
        /**
         * 缩放
         * @member {number} dragonBones.EgretTextureAtlas#scale
         */
        public scale:number;
        /**
         * spriteSheet
         * @member {egert.SpriteSheet} dragonBones.EgretTextureAtlas#spriteSheet
         */
        public spriteSheet:egret.SpriteSheet;
        private _textureDatas:any = {};

        /**
         * 创建一个新的EgretTextureAtlas实例
         * @param texture 纹理集
         * @param textureAtlasRawData 纹理集数据
         * @param scale 缩放
         */
        constructor(public texture:egret.Texture, private textureAtlasRawData:any, scale:number = 1) {
            this.scale = scale;
            this.name = textureAtlasRawData[ConstValues.A_NAME];
            this.parseData(textureAtlasRawData);
            this.spriteSheet = new egret.SpriteSheet(texture);
        }

        /**
         * 根据名字获取纹理
         * @param fullName 纹理的名字
         * @returns {egret.Texture} 获取到的纹理
         */
        public getTexture(fullName:string):egret.Texture {
            var result = this.spriteSheet.getTexture(fullName);
            if (!result) {
                var data:TextureData = this._textureDatas[fullName];
                if(data) {
                    result = this.spriteSheet.createTexture(fullName, data.region.x, data.region.y, data.region.width, data.region.height);
                }
            }
            return result;
        }

        /**
         * 释放资源
         */
        public dispose():void {
            this.texture = null;
        }

        /**
         * 根据子纹理的名字获取子纹理所在的矩形区域
         * @param subTextureName 子纹理的名字
         * @returns {*} 子纹理所在的矩形区域
         */
        public getRegion(subTextureName:string):Rectangle {
            var textureData:TextureData = this._textureDatas[subTextureName];
            if(textureData && textureData instanceof TextureData)
            {
                return textureData.region;
            }
            return null;
        }

        private parseData(textureAtlasRawData:any):void {
            this._textureDatas = DataParser.parseTextureAtlasData(textureAtlasRawData, this.scale);
        }
    }
}