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
     * @classdesc 影片剪辑，可以通过影片剪辑播放序列帧动画。MovieClip 类从以下类继承而来：DisplayObject 和 EventDispatcher。不同于 DisplayObject 对象，MovieClip 对象拥有一个时间轴。
     * @extends egret.DisplayObject
     * @link http://docs.egret-labs.org/post/manual/displaycon/movieclip.html  MovieClip序列帧动画
     */
    export class MovieClip extends DisplayObject{

        private _isAddedToStage:boolean = false;
    //Render Property
        private static renderFilter:RenderFilter = RenderFilter.getInstance();
        private _textureToRender:Texture = null;

    //Data Property
        public _movieClipData:MovieClipData = null;
        private _frames:any[] = null;
        private _totalFrames:number = 0;
        public _frameLabels:any[] = null;
        private _frameIntervalTime:number = 0;
        public _eventPool:string[] = null;

    //Animation Property
        private _isPlaying:boolean = false;
        private _isStopped:boolean = true;
        private _playTimes:number = 0;

        public _currentFrameNum:number = 0;
        public _nextFrameNum:number = 0;
        private _displayedKeyFrameNum:number = 0;

        private _passedTime:number = 0;

    //Construct Function

        /**
         * 创建新的 MovieClip 实例。创建 MovieClip 之后，调用舞台上的显示对象容器的addElement方法。
         * @method egret.MovieClip#constructor
         * @param movieClipData {MovieClipData} 被引用的 MovieClipData 对象
         */
        constructor(movieClipData?:MovieClipData) {
            super();
            this._setMovieClipData(movieClipData);
            this.needDraw = true;
        }

        public _init(){
            this._reset();
            var movieClipData:MovieClipData = this._movieClipData;
            if(movieClipData && movieClipData._isDataValid()){
                this._frames = movieClipData.frames;
                this._totalFrames = movieClipData.numFrames;
                this._frameLabels = movieClipData.labels;
                this._frameIntervalTime = 1000 / movieClipData.frameRate;
                this._initFrame();
            }
        }

        public _reset():void{
            this._frames = null;
            this._playTimes = 0;
            this._isPlaying = false;
            this.setIsStopped(true);
            this._currentFrameNum = 0;
            this._nextFrameNum = 1;
            this._displayedKeyFrameNum = 0;
            this._passedTime = 0;
            this._eventPool = [];
        }

        private _initFrame():void{
            if(this._movieClipData._isTextureValid()){
                this._advanceFrame();
                this._constructFrame();
            }
        }

        public _render(renderContext:RendererContext):void {
            var texture = this._textureToRender;
            this._texture_to_render = texture;
            if (texture) {
                var offsetX:number = Math.round(texture._offsetX);
                var offsetY:number = Math.round(texture._offsetY);
                var bitmapWidth:number = texture._bitmapWidth||texture._textureWidth;
                var bitmapHeight:number = texture._bitmapHeight||texture._textureHeight;
                var destW:number = Math.round(bitmapWidth);
                var destH:number = Math.round(bitmapHeight);
                MovieClip.renderFilter.drawImage(renderContext, this, texture._bitmapX, texture._bitmapY,
                    bitmapWidth, bitmapHeight, offsetX, offsetY, destW,destH);
            }
        }

        public _measureBounds():egret.Rectangle {
            var texture:Texture = this._textureToRender;
            if(!texture){
                return super._measureBounds();
            }
            var x:number = texture._offsetX;
            var y:number = texture._offsetY;
            var w:number = texture._textureWidth;
            var h:number = texture._textureHeight;
            return Rectangle.identity.initialize(x,y, w, h);
        }

        public _onAddToStage():void {
            super._onAddToStage();
            this._isAddedToStage = true;
            if(this._isPlaying && this._totalFrames>1){
                this.setIsStopped(false);
            }
        }

        public _onRemoveFromStage():void {
            super._onRemoveFromStage();
            this._isAddedToStage = false;
            this.setIsStopped(true);
        }

    //Data Function
        /**
         * 返回帧标签为指定字符串的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelByName
         * @param labelName {string} 帧标签名
         * @param ignoreCase {boolean} 是否忽略大小写，可选参数，默认false
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        public _getFrameLabelByName(labelName: string, ignoreCase: boolean = false): FrameLabel {
            if (ignoreCase) {
                labelName = labelName.toLowerCase();
            }
            var frameLabels = this._frameLabels;
            if(frameLabels){
                var outputFramelabel:FrameLabel = null;
                for (var i = 0; i < frameLabels.length; i++) {
                    outputFramelabel = frameLabels[i];
                    if (ignoreCase ? outputFramelabel.name.toLowerCase() === labelName : outputFramelabel.name === labelName) {
                        return outputFramelabel;
                    }
                }
            }
            return null;
        }

        /**
         * 返回指定序号的帧的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelByFrame
         * @param frame {number} 帧序号
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        public _getFrameLabelByFrame(frame: number): FrameLabel {
            var frameLabels = this._frameLabels;
            if(frameLabels){
                var outputFramelabel:FrameLabel = null;
                for (var i = 0; i < frameLabels.length; i++) {
                    outputFramelabel = frameLabels[i];
                    if (outputFramelabel.frame === frame) {
                        return outputFramelabel;
                    }
                }
            }
            return null;
        }

        /**
         * 返回指定序号的帧对应的FrameLabel对象，如果当前帧没有标签，则返回前面最近的有标签的帧的FrameLabel对象
         * @method egret.MovieClip#getFrameLabelForFrame
         * @param frame {number} 帧序号
         * @returns {egret.FrameLabel} FrameLabel对象
         */
        public _getFrameLabelForFrame(frame: number): FrameLabel{
            var outputFrameLabel:FrameLabel = null;
            var tempFrameLabel:FrameLabel = null;
            var frameLabels = this._frameLabels;
            if(frameLabels){
                for (var i = 0; i < frameLabels.length; i++) {
                    tempFrameLabel = frameLabels[i];
                    if (tempFrameLabel.frame > frame) {
                        return outputFrameLabel;
                    }
                    outputFrameLabel = tempFrameLabel;
                }
            }
            return outputFrameLabel;
        }

    //Animation Function

        /**
         * 继续播放当前动画
         * @method egret.MovieClip#play
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数(MovieClip初始播放次数设置为1)，
         */
        public play(playTimes:number = 0): void {
            this._isPlaying = true;
            this.setPlayTimes(playTimes);
            if (this._totalFrames > 1 && this._isAddedToStage) {
                this.setIsStopped(false);
            }
        }

        /**
         * 暂停播放动画
         * @method egret.MovieClip#stop
         */
        public stop(): void {
            this._isPlaying = false;
            this.setIsStopped(true);
        }

        /**
         * 将播放头移到前一帧并停止
         * @method egret.MovieClip#prevFrame
         */
        public prevFrame(): void {
            this.gotoAndStop(this._currentFrameNum - 1);
        }

        /**
         * 跳到后一帧并停止
         * @method egret.MovieClip#prevFrame
         */
        public nextFrame(): void {
            this.gotoAndStop(this._currentFrameNum + 1);
        }

        /**
         * 将播放头移到指定帧并播放
         * @method egret.MovieClip#gotoAndPlay
         * @param frame {any} 指定帧的帧号或帧标签
         * @param playTimes {number} 播放次数。 参数为整数，可选参数，>=1：设定播放次数，<0：循环播放，默认值 0：不改变播放次数，
         */
        public gotoAndPlay(frame: any, playTimes:number = 0): void{
            if (arguments.length === 0 || arguments.length > 2) {
                throw new Error(getString(1022, "MovieClip.gotoAndPlay()"));
            }
            this.play(playTimes);
            this._gotoFrame(frame);
        }

        /**
         * 将播放头移到指定帧并停止
         * @method egret.MovieClip#gotoAndPlay
         * @param frame {any} 指定帧的帧号或帧标签
         */
        public gotoAndStop(frame: any): void {
            if (arguments.length != 1) {
                throw new Error(getString(1022, "MovieClip.gotoAndStop()"));
            }
            this.stop();
            this._gotoFrame(frame);
        }

        private _gotoFrame(frame:any): void
        {
            var frameNum:number;
            if(typeof frame === "string"){
                frameNum = this._getFrameLabelByName(frame).frame;
            }else{
                frameNum = parseInt(frame+'', 10);
                if(<any>frameNum != frame)
                {
                    throw new Error(getString(1022, "Frame Label Not Found"));
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
        }

        private _constructFrame() {
            var currentFrameNum:number = this._currentFrameNum;
            if(this._displayedKeyFrameNum == currentFrameNum){
                return;
            }
            this._textureToRender = this._movieClipData.getTextureByFrame(currentFrameNum);
            this._displayedKeyFrameNum = currentFrameNum;
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
                    }else{
                        this.dispatchEventWith(event);
                    }
                }

                if(isLoopComplete){
                    this.dispatchEventWith(Event.LOOP_COMPLETE);
                }
                if(isComplete){
                    this.dispatchEventWith(Event.COMPLETE);
                }
            }
        }

    //Properties
        /**
         * MovieClip 实例中帧的总数
         * @member {number} egret.MovieClip#totalFrames
         */
        public get totalFrames():number{
            return this._totalFrames;
        }
        /**
         * MovieClip 实例当前播放的帧的序号
         * @member {number} egret.MovieClip#currentFrame
         */
        public get currentFrame():number{
            return this._currentFrameNum;
        }
        /**
         * MovieClip 实例当前播放的帧的标签。如果当前帧没有标签，则 currentFrameLabel返回null。
         * @member {number} egret.MovieClip#currentFrame
         */
        public get currentFrameLabel(): string {
            var label = this._getFrameLabelByFrame(this._currentFrameNum);
            return label && label.name;
        }
        /**
         * 当前播放的帧对应的标签，如果当前帧没有标签，则currentLabel返回包含标签的先前帧的标签。如果当前帧和先前帧都不包含标签，currentLabel返回null。
         * @member {number} egret.MovieClip#currentFrame
         */
        public get currentLabel(): string {
            var label: FrameLabel = this._getFrameLabelForFrame(this._currentFrameNum);
            return label ? label.name : null;
        }

        /**
         * MovieClip 实例的帧频
         * @member {number} egret.MovieClip#frameRate
         */
        public get frameRate():number{
            return this.movieClipData.frameRate;
        }
        public set frameRate(value:number){
            if(value == this._movieClipData.frameRate){
                return;
            }
            this._movieClipData.frameRate = value;
            this._frameIntervalTime = 1000 / this._movieClipData.frameRate;
        }

        /**
         * MovieClip 实例当前是否正在播放
         * @member {boolean} egret.MovieClip#isPlaying
         */
        public get isPlaying(): boolean {
            return this._isPlaying;
        }

        /**
         * MovieClip数据源
         * @member {any} egret.MovieClip#movieClipData
         */
        public set movieClipData(value:MovieClipData){
            this._setMovieClipData(value);
        }
        public get movieClipData():MovieClipData{
            return this._movieClipData;
        }

        private _setMovieClipData(value:MovieClipData){
            if(this._movieClipData == value){
                return;
            }
            this._movieClipData = value;
            this._init();
        }

        private setPlayTimes(value:number){
            if(value < 0 || value >= 1){
                this._playTimes = value < 0 ? -1 : Math.floor(value);
            }
        }

        private setIsStopped(value:boolean){
            if(this._isStopped == value) {
                return;
            }
            this._isStopped = value;
            if(value){
                this._playTimes = 0;
                Ticker.getInstance().unregister(this._advanceTime, this);
            }else{
                this._playTimes = this._playTimes == 0 ? 1 : this._playTimes;
                Ticker.getInstance().register(this._advanceTime, this);
            }
        }
    }
}
