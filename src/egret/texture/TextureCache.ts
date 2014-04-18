/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/// <reference path="Texture.ts"/>
/// <reference path="../core/Logger.ts"/>
module ns_egret {
    /**
     * @class 纹理的缓存和管理类
     */
    export class TextureCache {
        private static instance:TextureCache;

        public static getInstance():TextureCache {
            if (TextureCache.instance == null) {
                TextureCache.instance = new TextureCache();
            }
            return TextureCache.instance;
        }

        private _textures;
        private _spritesheets;

        constructor() {
            this._textures = {};
            this._spritesheets = {};
        }

        /**
         * 添加纹理
         * @param key
         * @param texture
         */
        public addTexture(key, texture:Texture) {
            if (!this._textures[key]) {
                this._textures[key] = texture;
            }
        }

        /**
         * 删除纹理
         * @param key
         */
        public removeTexture(key:string) {
            delete this._textures[key];
        }

        /**
         * 获取纹理
         * @param key
         * @returns {*}
         */
        public getTexture(key:string):Texture {
            var result = this._textures[key];
            if(!result)
            {
                ns_egret.Logger.warning("texture为空",key);
            }
            return result;
        }

        /**
         * 添加SpriteSheet
         * @param key
         * @param spriteSheet
         * @param texture
         * @stable B 由于SpriteSheet和纹理往往是对应的，正在考虑将addSpriteSheet和addTexture合并
         */
        public addSpriteSheet(key:string, spriteSheet:ns_egret.SpriteSheet, texture:ns_egret.Texture) {
            this.addTexture(key, texture);
            this._spritesheets[key] = spriteSheet;
        }

        /**
         * 移除SpriteSheet
         * @param key
         */
        public removeSpriteSheet(key:string):void {
            this.removeTexture(key);
            delete this._spritesheets[key];
        }

        /**
         * 获取SpriteSheet
         * @param key
         * @returns {*}
         */
        public getSpriteSheet(key:string) {
            return this._spritesheets[key];
        }
    }
}