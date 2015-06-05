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
    export class DefaultLoadingView extends DisplayObjectContainer implements ILoadingView{

        private textField;
        constructor() {
            super();

        }

        init():void {
            this.textField = new egret.TextField();
            this.addChild(this.textField);
            this.textField.y = egret.MainContext.instance.stage.stageHeight / 2;
            this.textField.x = egret.MainContext.instance.stage.stageWidth / 2;
            this.textField.textAlign = "center";
            this.textField.anchorX = this.textField.anchorY = 0.5;
        }

        setProgress(current, total):void {
            console.log("egret_native  " + Math.round(current / 1024) + "KB / " + Math.round(total / 1024) + "KB");
            this.textField.text = "Loading Resource..." + Math.round(current / 1024) + "KB / " + Math.round(total / 1024) + "KB";

        }

        loadError():void {
            this.textField.text = "Resource loading failed，please check the network connection and exit back into the game！";
        }
    }
}
