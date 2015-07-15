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
     * @private
     */
    export class TextPrompt extends TextField {

        constructor() {
            super();

            this.touchEnabled = true;
        }

        public _onRemoveFromStage():void {
            if (egret.MainContext.deviceType == egret.MainContext.RUNTIME_NATIVE) {
                super._onRemoveFromStage();
                return;
            }

            DisplayObjectContainer.__EVENT__REMOVE_FROM_STAGE_LIST.push(this);
            this._removePromptEvent();
        }

        public _onAddToStage():void {
            if (egret.MainContext.deviceType == egret.MainContext.RUNTIME_NATIVE) {
                super._onAddToStage();
                return;
            }

            this._DO_Props_._stage = MainContext.instance.stage;
            DisplayObjectContainer.__EVENT__ADD_TO_STAGE_LIST.push(this);
            this._addPromptEvent();
        }

        //增加点击事件
        private _addPromptEvent():void {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onPrompTapHandler, this);
        }

        //释放点击事件
        private _removePromptEvent():void {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onPrompTapHandler, this);
        }

        //处理富文本中有href的
        private onPrompTapHandler(e:egret.TouchEvent):void {
            this.text = prompt("", this.text);
        }
    }
}
