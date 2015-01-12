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
    export class RichMovieClip extends MovieClip{
        private _frameScripts:any;
        private _frameActions:any;

        constructor() {
            super();
        }

        public _initData(mcData:any):void{
            super._initData(mcData);
            this._initFrameScripts(mcData.scripts);
            this._initFrameActions(mcData.actions);
        }

        private _initFrameScripts(frameScriptsData:any[]):void{
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

        private _initFrameActions(frameActionsData:any[]):void{
            if(frameActionsData){
                var length:number = frameActionsData.length;
                if(length > 0){
                    this._frameActions = {};
                    for(var i=0; i < length; i++){
                        var actionData:any = frameActionsData[i];
                        this._frameActions[actionData.frame] = actionData.name;
                    }
                }
            }
        }

        public dispose():void {
            super.dispose();
            this._frameScripts = null;
            this._frameActions = null;
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
                        this.stop();
                        throw e;
                    }
                }
            }
            super._advanceFrame();
        }
    }
}