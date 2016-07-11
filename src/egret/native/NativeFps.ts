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
module egret.native {
    /**
     * @private
     */
    export class NativeFps extends egret.Sprite implements egret.FPSDisplay {
        private panelX:number;
        private panelY:number;
        private fpsHeight:number;
        private fontColor:number;
        private fontSize:number;
        private bgAlpha:number;
        private shape;
        private textFps;
        private textLog;
        private showFps;
        private showLog;
        private _stage;
        constructor(stage:Stage, showFPS:boolean, showLog:boolean, logFilter:string, styles:Object) {
            super();
            if (showFPS || showLog) {
                this.panelX = styles["x"] === undefined ? 0 : parseInt(styles['x']);
                this.panelY = styles["y"] === undefined ? 0 : parseInt(styles['y']);
                this._stage = stage;
                this.showFps = showFPS;
                this.showLog = showLog;
                this.fontColor = styles["textColor"] === undefined ? 0xffffff : parseInt(styles['textColor']);
                this.fontSize = styles["size"] === undefined ? 24 : parseInt(styles['size']);
                this.bgAlpha = styles["bgAlpha"] || 0.9;
                this.shape = new egret.Shape();
                this.addChild(this.shape);

                if (showFPS) this.addFps();
                if (showLog) this.addLog();
            }
        }
        private addFps() {
            var fps = new egret.TextField();
            fps.x = fps.y = 4;
            this.textFps = fps;
            this.addChild(fps);
            fps.lineSpacing =  2;
            fps.size = this.fontSize;
            fps.textColor = this.fontColor;
            fps.textFlow=[
                {text: `0 FPS ${egret.Capabilities.renderMode}\n`},
                {text: `Draw: 0\nDirty: 0%\n`},
                {text: "Cost: "},
                {text: "0 ", style: {"textColor": 0x18fefe}},
                {text: "0 ", style: {"textColor": 0xffff00}},
                {text: "0 ", style: {"textColor": 0xff0000}}
            ];
        }

        private addLog() {
            var text = new egret.TextField();
            text.size = this.fontSize;
            text.textColor = this.fontColor;
            text.x = 4;
            this.addChild(text);
            this.textLog = text;
        };
        public update(datas:FPSData) {
            this.textFps.textFlow=[
                {text: `${datas.fps} FPS ${egret.Capabilities.renderMode}\n`},
                {text: `Draw: ${datas.draw}\nDirty: ${datas.dirty}%\n`},
                {text: "Cost: "},
                {text: `${datas.costTicker} `, style: {"textColor": 0x18fefe}},
                {text: `${datas.costDirty} `, style: {"textColor": 0xffff00}},
                {text: `${datas.costRender} `, style: {"textColor": 0xff0000}}
            ]
            this.updateLayout();
        };
        private arrLog:string[] = [];
        public updateInfo(info:string) {
            var fpsHeight = 0;
            if (this.showFps) {
                fpsHeight = this.textFps.height;
                this.textLog.y = fpsHeight + 4;
            }
            this.arrLog.push(info);
            this.textLog.text = this.arrLog.join('\n');
            if (this._stage.stageHeight > 0) {
                if (this.textLog.textWidth > this._stage.stageWidth - 20 - this.panelX) {
                    this.textLog.width = this._stage.stageWidth - 20 - this.panelX;
                }
                while (this.textLog.textHeight > this._stage.stageHeight - fpsHeight - 20 - this.panelY) {
                    this.arrLog.shift();
                    this.textLog.text = this.arrLog.join("\n");
                }
            }
            this.updateLayout();
        }

        private updateLayout() {
            if (egret.Capabilities.runtimeType == RuntimeType.NATIVE) {
                return;
            }
            var g = this.shape.$graphics;
            g.clear();
            g.beginFill(0x000000, this.bgAlpha);
            g.drawRect(0, 0, this.width + 8, this.height + 8);
            g.endFill();
        }
    }
    egret.FPSDisplay = NativeFps;
}