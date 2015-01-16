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
     * @class egret.RichMovieClip
     * @classdesc 富影片剪辑。不同于 MovieClip 对象，RichMovieClip 支持脚本处理抛出自定义事件。
     * @extends egret.MovieClip
     */
    export class RichMovieClip extends MovieClip{
        private _frameScripts:any; // 这个地方不要赋初值
        private _frameActions:any; // 这个地方不要赋初值

        /**
         * 创建新的 RichMovieClip 实例。创建 RichMovieClip 之后，调用舞台上的显示对象容器的addElement方法。
         * @method egret.RichMovieClip#constructor
         * @param movieClipData {RichMovieClipData} 被引用的 RichMovieClipData 对象
         */
        constructor(movieClipData?:RichMovieClipData) {
            super(movieClipData);
        }

        public _init(){
            super._init();
            var movieClipData:RichMovieClipData = <RichMovieClipData>this._movieClipData;
            if(movieClipData && movieClipData._isDataValid()){
                this._frameActions = movieClipData.frameActions;
                this._fillFrameScripts(movieClipData.frameScripts);
            }
        }

        private _fillFrameScripts(frameScriptsData:any[]):void{
            if(frameScriptsData){
                var length:number = frameScriptsData.length;
                if(length > 0){
                    this._frameScripts = {};
                    for(var i=0; i < length; i++){
                        var scriptData:any = frameScriptsData[i];
                        var func:any = this[scriptData.func];
                        var args = scriptData.args;
                        this._frameScripts[scriptData.frame] = {"func":func, "args":args ? args : []};
                    }
                }
            }
        }

        public _advanceFrame(): void {
            if (this._currentFrameNum === this._nextFrameNum) {
                return;
            }

            if (this._frameActions) {
                var frameAction = this._frameActions[this._nextFrameNum];
                if (frameAction) {
                    this._eventPool.push(frameAction);
                }
            }

            if (this._frameScripts) {
                var frameScript = this._frameScripts[this._nextFrameNum];
                if (frameScript) {
                    try {
                        frameScript.func.apply(this, frameScript.args)
                    } catch (e) {
                        //ignore Error
                        //this.stop();
                        //throw e;
                    }
                }
            }
            super._advanceFrame();
        }
    }
}