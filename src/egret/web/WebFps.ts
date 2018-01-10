//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
namespace egret.web {
    /**
     * @private
     */
    export class WebFps extends egret.DisplayObject implements egret.FPSDisplay {
        private panelX: number;
        private panelY: number;
        private fontColor: string;
        private fontSize: number;
        private container;
        private fps;
        private log;
        private showPanle: boolean = true;
        private renderMode: string;

        constructor(stage: Stage, showFPS: boolean, showLog: boolean, logFilter: string, styles: Object) {
            super();
            if (showFPS || showLog) {
                if (egret.Capabilities.renderMode == 'canvas') {
                    this.renderMode = "Canvas";
                } else {
                    this.renderMode = "WebGL";
                }
                this.panelX = styles["x"] === undefined ? 0 : parseInt(styles['x']);
                this.panelY = styles["y"] === undefined ? 0 : parseInt(styles['y']);
                this.fontColor = styles["textColor"] === undefined ? '#ffffff' : styles['textColor'].replace("0x", "#");
                this.fontSize = styles["size"] === undefined ? 12 : parseInt(styles['size']);
                if (egret.Capabilities.isMobile) {
                    this.fontSize -= 2;
                }
                let all = document.createElement('div');
                all.style.position = 'absolute';
                all.style.background = `rgba(0,0,0,${styles['bgAlpha']})`;
                all.style.left = this.panelX + 'px';
                all.style.top = this.panelY + 'px';
                all.style.pointerEvents = 'none';
                document.body.appendChild(all);

                let container = document.createElement('div');
                container.style.color = this.fontColor;
                container.style.fontSize = this.fontSize + 'px';
                container.style.lineHeight = this.fontSize + 'px';
                container.style.margin = '4px 4px 4px 4px';
                this.container = container;
                all.appendChild(container);

                if (showFPS) this.addFps();
                if (showLog) this.addLog();
            }
        }

        private containerFps;
        private fpsHeight: number = 0;
        private divDatas;
        private divDraw;
        private divCost;
        private contextFps;
        private canvasFps;
        private WIDTH = 101;
        private HEIGHT = 20;
        private bgCanvasColor = "#18304b";
        private fpsFrontColor = "#18fefe";
        private contextCost;
        private canvasCost;
        private WIDTH_COST = 50;
        private cost1Color = "#18fefe";
        // private cost2Color = "#ffff00";
        private cost3Color = "#ff0000";

        private addFps() {
            let div = document.createElement('div');
            div.style.display = 'inline-block';
            this.containerFps = div;
            this.container.appendChild(div);
            let fps = document.createElement('div');
            fps.style.paddingBottom = '2px'
            this.fps = fps;
            this.containerFps.appendChild(fps)
            fps.innerHTML = `0 FPS ${this.renderMode}<br/>min0 max0 avg0`;

            let canvas = document.createElement('canvas');
            this.containerFps.appendChild(canvas);
            canvas.width = this.WIDTH;
            canvas.height = this.HEIGHT;
            this.canvasFps = canvas;
            let context = canvas.getContext('2d');
            this.contextFps = context;
            context.fillStyle = this.bgCanvasColor;
            context.fillRect(0, 0, this.WIDTH, this.HEIGHT);

            let divDatas = document.createElement('div');
            this.divDatas = divDatas;
            this.containerFps.appendChild(divDatas);
            let left = document.createElement('div');
            left.style['float'] = 'left';
            left.innerHTML = `Draw<br/>Cost`
            divDatas.appendChild(left);
            let right = document.createElement('div');
            right.style.paddingLeft = left.offsetWidth + 20 + "px";

            divDatas.appendChild(right);
            let draw = document.createElement('div');
            this.divDraw = draw;
            draw.innerHTML = `0<br/>`;
            right.appendChild(draw);
            let cost = document.createElement('div');
            this.divCost = cost;
            cost.innerHTML = `<font  style="color:${this.cost1Color}">0<font/> <font  style="color:${this.cost3Color}">0<font/>`
            right.appendChild(cost);

            canvas = document.createElement('canvas');
            this.canvasCost = canvas;
            this.containerFps.appendChild(canvas);
            canvas.width = this.WIDTH;
            canvas.height = this.HEIGHT;
            context = canvas.getContext('2d');
            this.contextCost = context;
            context.fillStyle = this.bgCanvasColor;
            context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
            context.fillStyle = "#000000";
            context.fillRect(this.WIDTH_COST, 0, 1, this.HEIGHT);
            this.fpsHeight = this.container.offsetHeight;
        }

        private addLog() {
            let log = document.createElement('div');
            log.style.maxWidth = document.body.clientWidth - 8 - this.panelX + 'px';
            log.style.wordWrap = "break-word";
            this.log = log;
            this.container.appendChild(log);
        }

        private arrFps: number[] = [];
        private arrCost: number[][] = [];
        private lastNumDraw;

        public update(datas: FPSData, showLastData = false) {
            let numFps: number;
            let numCostTicker: number;
            let numCostRender: number;
            if (!showLastData) {
                numFps = datas.fps;
                numCostTicker = datas.costTicker;
                numCostRender = datas.costRender;
                this.lastNumDraw = datas.draw;
                this.arrFps.push(numFps);
                this.arrCost.push([numCostTicker, numCostRender]);
            } else {
                numFps = this.arrFps[this.arrFps.length - 1];
                numCostTicker = this.arrCost[this.arrCost.length - 1][0];
                numCostRender = this.arrCost[this.arrCost.length - 1][1];
            }

            let fpsTotal = 0;
            let lenFps = this.arrFps.length;

            if (lenFps > 101) {
                lenFps = 101;
                this.arrFps.shift();
                this.arrCost.shift();
            }
            let fpsMin = this.arrFps[0];
            let fpsMax = this.arrFps[0];
            for (let i = 0; i < lenFps; i++) {
                let num = this.arrFps[i];
                fpsTotal += num;
                if (num < fpsMin) fpsMin = num;
                else if (num > fpsMax) fpsMax = num;
            }
            let WIDTH = this.WIDTH;
            let HEIGHT = this.HEIGHT;
            let context = this.contextFps;
            context.drawImage(this.canvasFps, 1, 0, WIDTH - 1, HEIGHT, 0, 0, WIDTH - 1, HEIGHT);
            context.fillStyle = this.bgCanvasColor;
            context.fillRect(WIDTH - 1, 0, 1, HEIGHT);
            let lastHeight = Math.floor(numFps / 60 * 20);
            if (lastHeight < 1) lastHeight = 1;
            context.fillStyle = this.fpsFrontColor;
            context.fillRect(WIDTH - 1, 20 - lastHeight, 1, lastHeight);

            let WIDTH_COST = this.WIDTH_COST;
            context = this.contextCost;
            context.drawImage(this.canvasCost, 1, 0, WIDTH_COST - 1, HEIGHT, 0, 0, WIDTH_COST - 1, HEIGHT);
            context.drawImage(this.canvasCost, WIDTH_COST + 2, 0, WIDTH_COST - 1, HEIGHT, WIDTH_COST + 1, 0, WIDTH_COST - 1, HEIGHT);
            let c1Height = Math.floor(numCostTicker / 2);
            if (c1Height < 1) c1Height = 1;
            else if (c1Height > 20) c1Height = 20;
            //todo lcj
            let c2Height = Math.floor(numCostRender / 2);
            if (c2Height < 1) c2Height = 1;
            else if (c2Height > 20) c2Height = 20;
            context.fillStyle = this.bgCanvasColor;
            context.fillRect(WIDTH_COST - 1, 0, 1, HEIGHT);
            context.fillRect(WIDTH_COST * 2, 0, 1, HEIGHT);
            context.fillRect(WIDTH_COST * 3 + 1, 0, 1, HEIGHT);
            context.fillStyle = this.cost1Color;
            context.fillRect(WIDTH_COST - 1, 20 - c1Height, 1, c1Height);
            context.fillStyle = this.cost3Color;
            context.fillRect(WIDTH_COST * 2, 20 - c2Height, 1, c2Height);

            let fpsAvg = Math.floor(fpsTotal / lenFps);
            let fpsOutput = `${numFps} FPS ${this.renderMode}`;
            if (this.showPanle) {
                fpsOutput += `<br/>min${fpsMin} max${fpsMax} avg${fpsAvg}`;
                this.divDraw.innerHTML = `${this.lastNumDraw}<br/>`;
                this.divCost.innerHTML = `<font  style="color:#18fefe">${numCostTicker}<font/> <font  style="color:#ff0000">${numCostRender}<font/>`
            }
            this.fps.innerHTML = fpsOutput;
        };

        private arrLog: string[] = [];
        public updateInfo(info: string) {
            this.arrLog.push(info);
            this.updateLogLayout();
        }

        public updateWarn(info: string) {
            this.arrLog.push("[Warning]" + info);
            this.updateLogLayout();
        }

        public updateError(info: string) {
            this.arrLog.push("[Error]" + info);
            this.updateLogLayout();
        }

        private updateLogLayout(): void {
            this.log.innerHTML = this.arrLog.join('<br/>');
            while (document.body.clientHeight < (this.log.offsetHeight + this.fpsHeight + this.panelY + this.fontSize * 2)) {
                this.arrLog.shift();
                this.log.innerHTML = this.arrLog.join('<br/>');
            }
        }
    }
    egret.FPSDisplay = WebFps;
}