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
     * @class egret.MovieClip
     * @classdesc 影片剪辑，可以通过影片剪辑播放序列帧动画。
     * @extends egret.DisplayObjectContainer
     */
    export class MovieClip extends DisplayObjectContainer{

    //Data Property
        public _frames:any[];
        public _textureData:any;
        public _spriteSheet:SpriteSheet;

        public _frameLabels:any[];
        public _eventPool:string[] = [];
        private _bitmap:Bitmap;

    //Animation Property
        private _isPlaying:boolean;
        private _isStopped:boolean;
        private _playTimes:number;

        private _frameRate:number;
        private _frameIntervalTime:number;

        private _totalFrames:number;
        public _currentFrameNum:number = 0;
        public _nextFrameNum:number = 1;
        private _displayedKeyFrameNum:number = 0;

        private _passedTime:number = 0;

    //Construct Function
        constructor() {
            super();
            this._playTimes = -1;
            this._isPlaying = false;
            this._isStopped = true;
            this._bitmap = new egret.Bitmap();
            this.addChild(this._bitmap);
        }

        public init(mcData:any, textureData:any, spriteSheet:SpriteSheet):boolean{
            if(!mcData["frames"] || !textureData || !spriteSheet){
                return false;
            }
            this._textureData = textureData;
            this._spriteSheet = spriteSheet;
            this._initData(mcData);
            this._initFrame();
            return true;
        }

        public _initData(mcData:any):void{
            this.frameRate = mcData["frameRate"] || 24;
            this._initFramesData(mcData.frames);
            this._initFrameLabelsData(mcData.labels);
        }

        private _initFramesData(framesData:any[]):void{
            var frames:any[] = [];
            var length:number = framesData.length;
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
            this._frames = frames;
            this._totalFrames = frames.length;
        }
        private _initFrameLabelsData(frameLabelsData:any[]):void{
            if(frameLabelsData){
                var length:number = frameLabelsData.length;
                if(length > 0){
                    this._frameLabels = [];
                    for(var i=0; i < length; i++){
                        var label:any = frameLabelsData[i];
                        this._frameLabels.push(new FrameLabel(label.name, label.frame));
                    }
                }
            }
        }
        private _initFrame():void{
            this._advanceFrame();
            this._constructFrame();
        }

        /**
         * 销毁MovieClip对象
         * @method egret.MovieClip#dispose
         */
        public dispose():void {
            this.stop();
            this._textureData = null;
            this._spriteSheet = null;
            this._frames = null;
            this._frameLabels = null;
            this._eventPool = null;
            this._bitmap = null;
        }

    //Data Function
        /**
         * 返回帧标签为指定字符串的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelByName
         * @param labelName {string} 帧标签名
         * @param ignoreCase {boolean} 是否忽略大小写，可选参数，默认false
         */
        public getFrameLabelByName(labelName: string, ignoreCase: boolean = false): FrameLabel {
            if (ignoreCase) {
                labelName = labelName.toLowerCase();
            }
            var outputFramelabel:FrameLabel = null;
            var frameLabels = this._frameLabels;
            for (var i = 0; i < frameLabels.length; i++) {
                outputFramelabel = frameLabels[i];
                if (ignoreCase ? outputFramelabel.name.toLowerCase() === labelName : outputFramelabel.name === labelName) {
                    return outputFramelabel;
                }
            }
            return null;
        }

        /**
         * 返回指定序号的帧的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelByFrame
         * @param frame {number} 帧序号
         */
        public getFrameLabelByFrame(frame: number): FrameLabel {
            var outputFramelabel:FrameLabel = null;
            var frameLabels = this._frameLabels;
            for (var i = 0; i < frameLabels.length; i++) {
                outputFramelabel = frameLabels[i];
                if (outputFramelabel.frame === frame) {
                    return outputFramelabel;
                }
            }
            return null;
        }

        /**
         * 返回指定序号的帧对应的FrameLabel对象，如果当前帧没有标签，则返回前面最近的有标签的帧的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelForFrame
         * @param frame {number} 帧序号
         */
        public getFrameLabelForFrame(frame: number): FrameLabel{
            var outputFrameLabel:FrameLabel = null;
            var tempFrameLabel:FrameLabel = null;
            var frameLabels = this._frameLabels;
            for (var i = 0; i < frameLabels.length; i++) {
                tempFrameLabel = frameLabels[i];
                if (tempFrameLabel.frame > frame) {
                    return outputFrameLabel;
                }
                outputFrameLabel = tempFrameLabel;
            }
            return outputFrameLabel;
        }

    //Animation Function

        /**
         * 继续播放当前动画
         * @method egret.MovieClip#stop
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数，
         */
        public play(playTimes:number = 0): void {
            this._isPlaying = true;
            this.playTimes = playTimes;
            if (this._totalFrames > 1) {
                this.isStopped = false;
            }
        }

        /**
         * 暂停动画
         * @method egret.MovieClip#stop
         */
        public stop(): void {
            this._isPlaying = false;
            this.isStopped = true;
        }

        /**
         * 跳到前一帧并暂停
         * @method egret.MovieClip#prevFrame
         */
        public prevFrame(): void {
            this.gotoAndStop(this._currentFrameNum - 1);
        }

        /**
         * 跳到后一帧并暂停
         * @method egret.MovieClip#prevFrame
         */
        public nextFrame(): void {
            this.gotoAndStop(this._currentFrameNum + 1);
        }

        /**
         * 跳到指定帧并播放
         * @method egret.MovieClip#gotoAndPlay
         * @param frame {any} 指定帧的帧号或帧标签
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数，
         */
        public gotoAndPlay(frame: any, playTimes:number = 0): void{
            if (arguments.length === 0 || arguments.length > 2) {
                throw new Error("MovieClip.gotoAndPlay() ArgumentError");
            }
            this.play(playTimes);
            this._gotoFrame(frame);
        }

        /**
         * 跳到指定帧并停止
         * @method egret.MovieClip#gotoAndPlay
         * @param frame {any} 指定帧的帧号或帧标签
         */
        public gotoAndStop(frame: any): void {
            if (arguments.length != 1) {
                throw new Error("MovieClip.gotoAndStop() ArgumentError");
            }
            this.stop();
            this._gotoFrame(frame);
        }

        private _gotoFrame(frame:any): void
        {
            var frameNum:number;
            if(typeof frame === "string"){
                frameNum = this.getFrameLabelByName(frame).frame;
            }else{
                frameNum = parseInt(frame+'', 10);
                if(<any>frameNum != frame)
                {
                    throw new Error("Frame Label Not Found ArgumentError");
                }
            }

            if (frameNum < 1) {
                frameNum = 1;
            } else if (frameNum > this._totalFrames) {
                frameNum = this._totalFrames;
            }
            if (frameNum === this._nextFrameNum) {
                return;
            }

            this._nextFrameNum = frameNum;
            this._advanceFrame();
            this._constructFrame();
            this._handlePendingEvent();
        }

        private _advanceTime(advancedTime:number):void{
            var frameIntervalTime:number = this._frameIntervalTime;
            var currentTime = this._passedTime + advancedTime;
            this._passedTime = currentTime % frameIntervalTime;

            var num:number = currentTime / frameIntervalTime;
            if(num < 1){
                return;
            }
            while(num >= 1) {
                num--;
                this._nextFrameNum++;
                if(this._nextFrameNum > this._totalFrames){
                    if(this._playTimes == -1){
                        this._eventPool.push(Event.LOOP_COMPLETE);
                        this._nextFrameNum = 1;
                    }
                    else{
                        this._playTimes--;
                        if(this._playTimes > 0){
                            this._eventPool.push(Event.LOOP_COMPLETE);
                            this._nextFrameNum = 1;
                        }
                        else{
                            this._nextFrameNum = this._totalFrames;
                            this._eventPool.push(Event.COMPLETE);
                            this.stop();
                            break;
                        }
                    }
                }
                this._advanceFrame();
            }
            this._constructFrame();
            this._handlePendingEvent();
        }

        public _advanceFrame(): void{
            this._currentFrameNum = this._nextFrameNum;
            console.log(this._currentFrameNum);
        }

        private _constructFrame() {
            var currentFrameNum:number = this._currentFrameNum;
            if(this._displayedKeyFrameNum == currentFrameNum){
                return;
            }
            var bitmap = this._bitmap;
            var frameData = this._frames[currentFrameNum-1];
            if(frameData.frame){
                if(this._displayedKeyFrameNum == parseInt(frameData.frame)){
                    return;
                }
                frameData =  this._frames[frameData.frame-1];
            }
            if(frameData.res){
                var texture:Texture = this._getTexture(frameData.res);
                bitmap.x = frameData.x | 0;
                bitmap.y = frameData.y | 0;
                bitmap.texture = texture;
                return true;
            }else{
                bitmap.texture = null;
            }

            this._displayedKeyFrameNum = currentFrameNum;
        }

        private _getTexture(name:string):Texture {
            var textureData = this._textureData[name];
            var texture = this._spriteSheet.getTexture(name);
            if (!texture) {
                texture = this._spriteSheet.createTexture(name, textureData.x, textureData.y, textureData.w, textureData.h);
            }
            return texture;
        }

        private _handlePendingEvent():void{
            if(this._eventPool.length != 0) {
                this._eventPool.reverse();
                var eventPool:any[] = this._eventPool;
                var length:number = eventPool.length;
                var isComplete:boolean = false;
                var isLoopComplete:boolean = false;

                for (var i = 0; i < length; i++) {
                    var event:string = eventPool.pop();
                    if(event == Event.LOOP_COMPLETE){
                        isLoopComplete = true;
                    }else if(event == Event.COMPLETE){
                        isComplete = true;
                    }
                    else
                    {
                        console.log(event);
                        this.dispatchEventWith(event);
                    }
                }

                if(isLoopComplete){
                    console.log(Event.LOOP_COMPLETE);
                    this.dispatchEventWith(Event.LOOP_COMPLETE);
                }
                if(isComplete){
                    console.log(Event.COMPLETE);
                    this.dispatchEventWith(Event.COMPLETE);
                }
            }
        }

    //Properties
        /**
         * 总帧数
         * @member {number} egret.MovieClip#totalFrames
         */
        public get totalFrames():number{
            return this._totalFrames;
        }
        /**
         * 当前播放的帧的序号
         * @member {number} egret.MovieClip#currentFrame
         */
        public get currentFrame():number{
            return this._currentFrameNum;
        }
        /**
         * 当前播放的帧的标签
         * @member {number} egret.MovieClip#currentFrame
         */
        public get currentFrameLabel(): string {
            var label = this.getFrameLabelByFrame(this._currentFrameNum);
            return label && label.name;
        }
        /**
         * 当前播放的帧对应的标签，如果当前帧没有标签，则返回前面最近的有标签的帧的标签
         * @member {number} egret.MovieClip#currentFrame
         */
        public get currentLabel(): string {
            var label: FrameLabel = this.getFrameLabelForFrame(this._currentFrameNum);
            return label ? label.name : null;
        }

        /**
         * 帧频
         * @member {number} egret.MovieClip#frameRate
         */
        public get frameRate():number{
            return this._frameRate;
        }
        public set frameRate(value:number){
            if(value == this._frameRate){
                return;
            }
            this._frameRate = value;
            this._frameIntervalTime = 1000 / this._frameRate;
        }

        /**
         * 是否正在播放
         * @member {boolean} egret.MovieClip#isPlaying
         */
        public get isPlaying(): boolean {
            return this._isPlaying;
        }

        private set playTimes(value:number){
            if(value < 0 || value >= 1){
                this._playTimes = value < 0 ? -1 : Math.floor(value);
            }
        }

        private set isStopped(value:boolean){
            if(this._isStopped == value) {
                return;
            }
            this._isStopped = value;
            if(value){
                Ticker.getInstance().unregister(this._advanceTime, this);
            }else{
                Ticker.getInstance().register(this._advanceTime, this);
            }
        }
    }
}


