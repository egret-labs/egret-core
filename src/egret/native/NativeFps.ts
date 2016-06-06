module egret.native {
    export class NativeFps extends egret.Sprite implements egret.FPSDisplay {
        private fpsHeight:number;
        private fontColor:number;
        private fontSize:number;
        private bgAlpha:number;
        private shape;
        private textFps;
        private textDraw;
        private textCost;
        private textLog;
        private showFps;
        private showLog;
        private _stage;

        constructor(stage:Stage, showFPS:boolean, showLog:boolean, logFilter:string, styles:Object) {
            super();
            if (showFPS || showLog) {
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
            var container = new egret.DisplayObjectContainer();
            this.addChild(container);
            container.x = container.y = 4;
            var fps = new egret.TextField();
            var left = new egret.TextField();
            var draw = new egret.TextField();
            var cost = new egret.TextField();
            container.addChild(fps);
            container.addChild(left);
            container.addChild(draw);
            container.addChild(cost);

            fps.lineSpacing = left.lineSpacing = draw.lineSpacing = cost.lineSpacing = 2;
            fps.size = left.size = draw.size = cost.size = this.fontSize;
            fps.textColor = left.textColor = draw.textColor = cost.textColor = this.fontColor;
            fps.text = "0 FPS " + egret.Capabilities.renderMode;
            left.text = "Draw\nDirty\nCost";
            draw.text = '0\n0%\n';
            cost.textFlow = [
                {text: "0 ", style: {"textColor": 0x18fefe}},
                {text: "0 ", style: {"textColor": 0xffff00}},
                {text: "0 ", style: {"textColor": 0xff0000}}
            ]
            draw.x = cost.x = left.width + 20;
            left.y = draw.y = fps.height + 2;
            cost.y = draw.height + 2;

            this.textFps = fps;
            this.textDraw = draw;
            this.textCost = cost;
            this.fpsHeight = container.height;
            this.updateLayout();
        }

        private addLog() {
            var text = new egret.TextField();
            text.size = this.fontSize;
            text.textColor = this.fontColor;
            text.x = 4;
            if (this.showFps) {
                text.y = this.fpsHeight + 4;
            }
            this.addChild(text);
            this.textLog = text;
            this.updateLayout();
        }

        private fpsMin:number;
        private fpsMax:number;
        private arrFps:number[] = [];
        private arrCost:number[][] = [];

        public update(datas:FPSData) {
            var fpsMin = this.fpsMin;
            var fpsMax = this.fpsMax;
            this.arrFps.push(datas.fps);
            this.arrCost.push([datas.costTicker, datas.costDirty, datas.costRender]);
            var fpsTotal = 0;
            var lenFps = this.arrFps.length;
            if (lenFps == 1) {
                fpsMin = fpsMax = datas.fps;
            }
            if (lenFps > 110) {
                lenFps = 100;
                this.arrFps.shift();
            }
            for (let i = 0; i < lenFps; i++) {
                var num = this.arrFps[i];
                fpsTotal += num;
                if (num < fpsMin) fpsMin = num;
                else if (num > fpsMax) fpsMax = num;
            }
            var fpsAvg = Math.floor(fpsTotal / lenFps);
            this.textFps.text = `${datas.fps} FPS ${egret.Capabilities.renderMode}`;
            this.textDraw.text = `${datas.draw}\n${datas.dirty}%`;
            this.textCost.textFlow = [
                {text: datas.costTicker + " ", style: {"textColor": 0x18fefe}},
                {text: datas.costDirty + " ", style: {"textColor": 0xffff00}},
                {text: datas.costRender + " ", style: {"textColor": 0xff0000}}
            ]
            this.updateLayout();
        };
        private arrLog:string[] = [];
        public updateInfo(info:string) {
            this.arrLog.push(info);
            this.textLog.text = this.arrLog.join('\n');
            if (this._stage.stageHeight > 0) {
                if (this.textLog.textWidth > this._stage.stageWidth - 20) {
                    this.textLog.width = this._stage.stageWidth - 20;
                }
                while (this.textLog.textHeight > this._stage.stageHeight - this.fpsHeight-20) {
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