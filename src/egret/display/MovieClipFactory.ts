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
    export class MovieClipFactory extends EventDispatcher {
        private _mcDataSet:any;
        private _spriteSheet:SpriteSheet;

        constructor(data:any = null, texture:Texture = null) {
            super();
            this._mcDataSet = data;
            this.texture = texture;
        }

        public buildMovieClip(movieClipName:string):MovieClip {
            var mcData:any = this._mcDataSet.mc[movieClipName];
            if (mcData) {
                return new MovieClip(mcData, this._mcDataSet.res, this._spriteSheet);
            }
            return null;
        }

        public buildRichMovieClip(movieClipName:string):RichMovieClip {
            var mcData:any = this._mcDataSet.mc[movieClipName];
            if (mcData) {
                var m:RichMovieClip = new RichMovieClip();
                m.mcData = mcData;
                m.textureData = this._mcDataSet.res;
                m.spriteSheet = this._spriteSheet;
                return m;
            }
            return null;
        }

        public get mcDataSet():any{
            return this._mcDataSet;
        }
        public set mcDataSet(value:any){
            this._mcDataSet = value;
        }

        public set texture(value:Texture){
            this._spriteSheet = value ? new SpriteSheet(value) : null;
        }

        public get spriteSheet():SpriteSheet{
            return this._spriteSheet;
        }
    }
}


