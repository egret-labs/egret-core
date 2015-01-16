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
     * @class egret.RichMovieClipData
     * @classdesc RichMovieClipData 继承 MovieClipData，不同于 MovieClipData 对象，RichMovieClipData 支持脚本和自定义事件。
     * 目前支持如下脚本 play, stop, gotoAndPlay, gotoAndStop, prevFrame, nextFrame
     * @extends egret.MovieClipData
     */
    export class RichMovieClipData extends MovieClipData{
        public frameScripts:any;
        public frameActions:any;

        constructor() {
            super();
        }

        public _fillMCData(mcData:any):void{
            super._fillMCData(mcData);
            this._fillFrameActions(mcData.actions);
            this.frameScripts = mcData.scripts;
        }

        private _fillFrameActions(frameActionsData:any[]):void{
            if(frameActionsData){
                var length:number = frameActionsData.length;
                if(length > 0){
                    this.frameActions = {};
                    for(var i=0; i < length; i++){
                        var actionData:any = frameActionsData[i];
                        this.frameActions[actionData.frame] = actionData.name;
                    }
                }
            }
        }
    }
}