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
     * @class egret.MovieClipDataFactory
     * @classdesc 使用 MovieClipDataFactory 类，可以生成 MovieClipData 对象用于创建MovieClip
     * @extends egret.EventDispatcher
     * @link http://docs.egret-labs.org/post/manual/displaycon/movieclip.html MovieClip序列帧动画
     */
    export class MovieClipDataFactory extends EventDispatcher {
        /**
         * 是否开启缓存
         * @member {boolean} egret.MovieClipDataFactory#enableCache
         */
        public enableCache:boolean = true;
        public _mcDataSet:any;
        public _spriteSheet:SpriteSheet;
        public _mcDataCache:any = {};

        /**
         * 创建一个 egret.MovieClipDataFactory 对象
         * @param movieClipDataSet {any} MovieClip数据集，该数据集必须由Egret官方工具生成
         * @param texture {Texture} 纹理
         */
        constructor(movieClipDataSet?:any, texture?:Texture) {
            super();
            this._mcDataSet = movieClipDataSet;
            this.setTexture(texture);
        }

        /**
         * 清空缓存
         * @method egret.MovieClipDataFactory#clearCache
         */
        public clearCache():void{
            this._mcDataCache = {};
        }

        /**
         * 根据名字生成一个MovieClipData实例。可以用于创建MovieClip。
         * @method egret.MovieClipDataFactory#generateMovieClipData
         * @param movieClipName {string} MovieClip名字. 可选参数，默认为"", 相当于取第一个MovieClip数据
         * @returns {MovieClipData} 生成的MovieClipData对象
         */
        public generateMovieClipData(movieClipName:string=""):MovieClipData {
            if(movieClipName == ""){
                if(this._mcDataSet){
                    for(movieClipName in this._mcDataSet.mc){
                        break;
                    }
                }
            }
            if(movieClipName == ""){
                return null;
            }
            var output:MovieClipData = this._findFromCache(movieClipName, this._mcDataCache);
            if (!output) {
                output = new MovieClipData();
                this._fillData(movieClipName, output, this._mcDataCache);
            }
            return output;
        }

        private _findFromCache(movieClipName:string, cache:any):any{
            if(this.enableCache && cache[movieClipName]) {
                return cache[movieClipName];
            }
            return null;
        }

        private _fillData(movieClipName:string, movieClip:MovieClipData, cache:any):void{
            if(this._mcDataSet){
                var mcData = this._mcDataSet.mc[movieClipName];
                if (mcData) {
                    movieClip._init(mcData, this._mcDataSet.res, this._spriteSheet);
                    if(this.enableCache){
                        cache[movieClipName] = movieClip;
                    }
                }
            }
        }

        /**
         * MovieClip数据集
         * @member {any} egret.MovieClipDataFactory#mcDataSet
         */
        public get mcDataSet():any{
            return this._mcDataSet;
        }
        public set mcDataSet(value:any){
            this._mcDataSet = value;
        }

        /**
         * MovieClip需要使用的纹理图
         * @member {Texture} egret.MovieClipDataFactory#texture
         */
        public set texture(value:Texture){
            this.setTexture(value);
        }

        /**
         * 由纹理图生成的精灵表
         * @member {SpriteSheet} egret.MovieClipDataFactory#spriteSheet
         */
        public get spriteSheet():SpriteSheet{
            return this._spriteSheet;
        }

        private setTexture(value:Texture):void{
            this._spriteSheet = value ? new SpriteSheet(value) : null;
        }
    }
}