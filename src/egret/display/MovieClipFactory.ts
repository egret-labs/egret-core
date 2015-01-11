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
        private _mcData:any;
        private _spriteSheet:SpriteSheet;

        constructor(data:any = null, texture:Texture = null) {
            super();
            this._mcData = data;
            if (texture) {
                this._spriteSheet = new SpriteSheet(texture);
            }
        }

        public buildMovieClip(movieClipName:string):MovieClip {
            var frameData:any = this._mcData.mc[movieClipName];
            if (frameData) {
                var outputMovieClip:MovieClip = new MovieClip();
                if(this.initMovieClipWithRawData(outputMovieClip, frameData, this._mcData.res, this._spriteSheet))
                {
                    return outputMovieClip;
                }
            }
            return null;
        }

        public buildRichMovieClip(movieClipName:string):RichMovieClip{
            var frameData:any = this._mcData.mc[movieClipName];
            if (frameData) {
                var outputMovieClip:RichMovieClip = new RichMovieClip();
                if(this.initRichMovieClipWithRawData(outputMovieClip, frameData, this._mcData.res, this._spriteSheet))
                {
                    return outputMovieClip;
                }
            }
            return null;
        }

        private initMovieClipWithRawData(outputMovieClip:MovieClip, frameData:any, textureData:any, spriteSheet:SpriteSheet):boolean{
            if(this.checkDataValid(frameData, textureData, spriteSheet)){
                outputMovieClip._textureData = textureData;
                outputMovieClip._spriteSheet = spriteSheet;
                outputMovieClip.frameRate = frameData["frameRate"] || 24;
                outputMovieClip._initFramesData(frameData.frames);
                outputMovieClip._initFrameLabels(frameData.labels);
                return true;
            }
            return false;
        }

        private initRichMovieClipWithRawData(outputMovieClip:RichMovieClip, frameData:any, textureData:any, spriteSheet:SpriteSheet):boolean{
            if(this.initMovieClipWithRawData(outputMovieClip, frameData, textureData, spriteSheet)){
                outputMovieClip._initFrameScripts(frameData.scripts);
                outputMovieClip._initFrameActions(frameData.actions);
                return true;
            }
            return false;
        }

        private checkDataValid(frameData:any, textureData:any, spriteSheet:SpriteSheet):boolean{
            var framesData:any = frameData["frames"];
            if(!framesData || !textureData || !spriteSheet){
                return false;
            }
            return true;
        }
    }
}


