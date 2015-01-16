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
    export class MovieClipData extends HashObject{
        /**
         * MovieClip数据
         */
        public _mcData:any = null;

        /**
         * 总帧数
         */
        public numFrames:number = 1;

        /**
         * 帧数据列表
         */
        public frames:any[] = [];

        /**
         * 帧标签列表
         */
        public labels:any[] = null;

        /**
         * 帧率
         */
        public frameRate:number = 0;

        /**
         * 纹理数据
         */
        public textureData:any = null;

        /**
         * 纹理集
         */
        public spriteSheet:SpriteSheet = null;

        constructor() {
            super();
        }

        public _init(mcData:any, textureData:any, spriteSheet:SpriteSheet){
            this.textureData = textureData;
            this.spriteSheet = spriteSheet;
            this._setMCData(mcData);
        }

        /**
         * 根据指定纹理名称获取一个Texture对象
         * @method egret.MovieClipData#getTexture
         * @param textureName {string} 纹理名称
         * @returns {egret.Texture} Texture对象
         */
        public getTexture(textureName:string):Texture{
            var texture = this.spriteSheet.getTexture(textureName);
            if (!texture) {
                var textureData = this.textureData[textureName];
                texture = this.spriteSheet.createTexture(textureName, textureData.x, textureData.y, textureData.w, textureData.h);
            }
            return texture;
        }

        public _isDataValid():boolean{
            return this.frames.length > 0;
        }
        public _isTextureValid():boolean{
            return this.textureData != null && this.spriteSheet != null;
        }

        public _fillMCData(mcData:any):void{
            this.frameRate = mcData["frameRate"] || 24;
            this._fillFramesData(mcData.frames);
            this._fillFrameLabelsData(mcData.labels);
        }

        private _fillFramesData(framesData:any[]):void{
            var frames:any[] = this.frames;
            var length:number = framesData ? framesData.length : 0;
            var keyFramePosition:number;
            for(var i=0; i < length; i++){
                var frameData:any = framesData[i];
                frames.push(frameData);
                if(frameData.duration){
                    var duration:number = parseInt(frameData.duration);
                    if(duration > 1){
                        keyFramePosition = frames.length;
                        for(var j=1; j < duration; j++){
                            frames.push({"frame":keyFramePosition})
                        }
                    }
                }
            }
            this.numFrames = frames.length;
        }

        private _fillFrameLabelsData(frameLabelsData:any[]):void{
            if(frameLabelsData){
                var length:number = frameLabelsData.length;
                if(length > 0){
                    this.labels = [];
                    for(var i=0; i < length; i++){
                        var label:any = frameLabelsData[i];
                        this.labels.push(new FrameLabel(label.name, label.frame));
                    }
                }
            }
        }

        /**
         * MovieClip数据源
         * @member {any} egret.MovieClip#dataSource
         */
        public set mcData(value:MovieClipData){
            this._setMCData(value);
        }
        public get mcData():MovieClipData{
            return this._mcData;
        }

        private _setMCData(value:MovieClipData){
            if(this._mcData == value){
                return;
            }
            this._mcData = value;
            if(value){
                this._fillMCData(value);
            }
        }
    }
}