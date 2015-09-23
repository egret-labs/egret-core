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

module egret {
    /**
     * @classdesc 使用 MovieClipData 类，您可以创建 MovieClip 对象和处理 MovieClip 对象的数据。MovieClipData 一般由MovieClipDataFactory生成
     * @see http://docs.egret-labs.org/post/manual/displaycon/movieclip.html MovieClip序列帧动画
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class MovieClipData extends HashObject {
        /**
         * @private
         * MovieClip数据
         */
        $mcData:any = null;

        /**
         * 总帧数
         * @version Egret 2.4
         * @platform Web,Native
         */
        public numFrames:number = 1;

        /**
         * 帧数据列表
         * @version Egret 2.4
         * @platform Web,Native
         */
        public frames:any[] = [];

        /**
         * 帧标签列表
         * @version Egret 2.4
         * @platform Web,Native
         */
        public labels:any[] = null;
        /**
         * 帧事件列表
         * @version Egret 2.4
         * @platform Web,Native
         */
        public events:any[] = [];
        /**
         * 帧率
         * @version Egret 2.4
         * @platform Web,Native
         */
        public frameRate:number = 0;

        /**
         * 纹理数据
         * @version Egret 2.4
         * @platform Web,Native
         */
        public textureData:any = null;

        /**
         * 纹理集
         * @version Egret 2.4
         * @platform Web,Native
         */
        public spriteSheet:SpriteSheet = null;

        /**
         * 创建一个 egret.MovieClipData 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor() {
            super();
        }

        /**
         * @private
         *
         * @param mcData
         * @param textureData
         * @param spriteSheet
         */
        $init(mcData:any, textureData:any, spriteSheet:SpriteSheet) {
            this.textureData = textureData;
            this.spriteSheet = spriteSheet;
            this.setMCData(mcData);
        }

        /**
         * 根据指定帧序号获取该帧对应的关键帧数据
         * @param frame {number} 帧序号
         * @returns {any} 帧数据对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getKeyFrameData(frame:number):any {
            var outputFrameData = this.frames[frame - 1];
            if (outputFrameData.frame) {
                outputFrameData = this.frames[outputFrameData.frame - 1];
            }
            return outputFrameData;
        }

        /**
         * 根据指定帧序号获取该帧对应的Texture对象
         * @param frame {number} 帧序号
         * @returns {egret.Texture} Texture对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getTextureByFrame(frame:number):Texture {
            var frameData = this.getKeyFrameData(frame);
            if (frameData.res) {
                var outputTexture:Texture = this.getTextureByResName(frameData.res);
                outputTexture._offsetX = frameData.x | 0;
                outputTexture._offsetY = frameData.y | 0;
                return outputTexture;
            }
            return null;
        }

        /**
         * @private
         *
         * @param resName
         * @returns
         */
        private getTextureByResName(resName:string):Texture {
            var texture = this.spriteSheet.getTexture(resName);
            if (!texture) {
                var textureData = this.textureData[resName];
                texture = this.spriteSheet.createTexture(resName, textureData.x, textureData.y, textureData.w, textureData.h);
            }
            return texture;
        }

        /**
         * @private
         *
         * @returns
         */
        $isDataValid():boolean {
            return this.frames.length > 0;
        }

        /**
         * @private
         *
         * @returns
         */
        $isTextureValid():boolean {
            return this.textureData != null && this.spriteSheet != null;
        }

        /**
         * @private
         *
         * @param mcData
         */
        $fillMCData(mcData:any):void {
            this.frameRate = mcData["frameRate"] || 24;
            this.fillFramesData(mcData.frames);
            this.fillFrameLabelsData(mcData.labels);
            this.fillFrameEventsData(mcData.events);
        }

        /**
         * @private
         *
         * @param framesData
         */
        private fillFramesData(framesData:any[]):void {
            var frames:any[] = this.frames;
            var length:number = framesData ? framesData.length : 0;
            var keyFramePosition:number;
            for (var i = 0; i < length; i++) {
                var frameData:any = framesData[i];
                frames.push(frameData);
                if (frameData.duration) {
                    var duration:number = parseInt(frameData.duration);
                    if (duration > 1) {
                        keyFramePosition = frames.length;
                        for (var j = 1; j < duration; j++) {
                            frames.push({"frame": keyFramePosition})
                        }
                    }
                }
            }
            this.numFrames = frames.length;
        }

        /**
         * @private
         *
         * @param frameLabelsData
         */
        private fillFrameLabelsData(frameLabelsData:any[]):void {
            if (frameLabelsData) {
                var length:number = frameLabelsData.length;
                if (length > 0) {
                    this.labels = [];
                    for (var i = 0; i < length; i++) {
                        var label:any = frameLabelsData[i];
                        this.labels.push(new FrameLabel(label.name, label.frame, label.end));
                    }
                }
            }
        }
        /**
         * @private
         *
         * @param frameEventsData
         */
        private fillFrameEventsData(frameEventsData:any[]):void{
            if(frameEventsData){
                var length:number = frameEventsData.length;
                if(length>0){
                    this.events = [];
                    for (var i = 0; i < length; i++){
                        var events:any = frameEventsData[i];
                        this.events[events.frame] = events.name;
                    }
                }
            }
        }

        /**
         * MovieClip数据源
         */
        public set mcData(value:MovieClipData) {
            this.setMCData(value);
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get mcData():MovieClipData {
            return this.$mcData;
        }

        /**
         * @private
         *
         * @param value
         */
        private setMCData(value:MovieClipData) {
            if (this.$mcData == value) {
                return;
            }
            this.$mcData = value;
            if (value) {
                this.$fillMCData(value);
            }
        }
    }
}