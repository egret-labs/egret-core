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


module dragonBones {
    /**
     * @class dragonBones.EgretSheetAtlas
     * @implements dragonBones.ITextureAtlas
     * @classdesc
     * Egret 引擎使用的sheet纹理集
     */
    export class EgretSheetAtlas implements ITextureAtlas {
        private static Region:egret.Rectangle = new egret.Rectangle();
        /**
         * 纹理集的名称
         * @member {string} dragonBones.EgretSheetAtlas#name
         */
        public name:string;
        /**
         * 纹理集的缩放
         * @member {number} dragonBones.EgretSheetAtlas#scale
         */
        public scale:number;
        /**
         * spriteSheet
         * @member {egret.SpriteSheet} dragonBones.EgretSheetAtlas#spriteSheet
         */
        public spriteSheet:egret.SpriteSheet;
        private _textureDatas:any = {};

        /**
         * 创建一个新的EgretSheetAltas 实例
         * @param texture 纹理
         * @param textureData 纹理数据
         * @param scale 缩放
         */
        constructor(public texture:egret.Texture, private textureData:any, scale:number = 1) {
            this.scale = scale;
            this.name = textureData[ConstValues.A_NAME];
            this.spriteSheet = new egret.SpriteSheet(texture);

            this._textureDatas = textureData["frames"];
        }

        /**
         *通过纹理的名字来获取纹理
         * @param fullName 纹理的名字
         * @returns {egret.Texture} 获取到的纹理
         */
        public getTexture(fullName:string):egret.Texture {
            var result = this.spriteSheet.getTexture(fullName);
            if (!result) {
                var config:any = this._textureDatas[fullName];
                result = this.spriteSheet.createTexture(fullName, config.x, config.y, config.w, config.h, config.offX, config.offY, config.sourceW, config.sourceH);
            }
            return result;
        }

        /**
         *释放资源
         */
        public dispose():void {
            this.texture = null;
        }

        /**
         * 根据子纹理的名字获取子纹理的矩形区域
         * @param subTextureName 子纹理的名字
         * @returns {*} 获取到的矩形区域
         */
        public getRegion(subTextureName:string):Rectangle {
            var textureData:any = this._textureDatas[subTextureName];
            if (textureData) {
                return EgretSheetAtlas.Region;
            }
            return null;
        }
    }
}