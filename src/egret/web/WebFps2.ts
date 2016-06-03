module egret.web {
    export class WebFps2 extends egret.DisplayObject implements egret.FPSDisplay {
        private fontColor:string;
        private fontSize:number;
        private container;
        private fps;
        private log;

        constructor(stage:Stage, showFPS:boolean, showLog:boolean, logFilter:string, styles:Object) {
            super();
            if (showFPS || showLog) {
                this.fontColor = styles["textColor"] === undefined ? '#ffffff' : styles['textColor'].replace("0x", "#");
                this.fontSize = styles["size"] === undefined ? 12 : parseInt(styles['size']);
                if (egret.Capabilities.isMobile) {
                    this.fontSize -= 2;
                }
                var all = document.createElement('div');
                all.style.position = 'absolute';
                all.style.background = `rgba(0,0,0,${styles['bgAlpha']})`;
                all.style.top = styles['x'] + 'px';
                all.style.left = styles['y'] + 'px';
                document.body.appendChild(all);

                var container = document.createElement('div');
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

        private fpsHeight:number;
        private divDraw;
        private divConst;
        private addFps() {
            var fps = document.createElement('div');
            fps.style.paddingBottom = '2px'
            this.fps = fps;
            this.container.appendChild(fps)
            fps.innerHTML = `0 FPS ${egret.Capabilities.renderMode}`;
            var left = document.createElement('div');
            left.style['float'] = 'left';
            left.innerHTML = `Draw<br/>Dirty<br/>Cost`
            this.container.appendChild(left);
            var right = document.createElement('div');
            right.style['float'] = 'left';
            right.style.paddingLeft = '20px';
            this.container.appendChild(right);
            var draw = document.createElement('div');
            this.divDraw = draw;
            draw.innerHTML = `0<br/>0<br/>`;
            right.appendChild(draw);
            var cost = document.createElement('div');
            this.divConst = cost;
            cost.innerHTML = `<font  style="color:#18fefe">0<font/> <font  style="color:#ffff00">0<font/> <font  style="color:#ff0000">0<font/>`
            right.appendChild(cost);
            this.fpsHeight = this.container.offsetHeight;
        }

        private addLog() {
            var log = document.createElement('div');
            log.style.maxWidth = document.body.clientWidth - 8 + 'px';
            log.style.wordWrap = "break-word";
            this.log = log;
            this.container.appendChild(log);
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
            this.fps.innerHTML = `${datas.fps} FPS ${egret.Capabilities.renderMode}`;
            this.divDraw.innerHTML = `${datas.draw}<br/>${datas.dirty}%<br/>`;
            this.divConst.innerHTML = `<font  style="color:#18fefe">${datas.costTicker}<font/> <font  style="color:#ffff00">${datas.costDirty}<font/> <font  style="color:#ff0000">${datas.costRender}<font/>`
        };

        private arrLog:string[] = [];

        public updateInfo(info:string) {
            this.arrLog.push(info);
            this.log.innerHTML = this.arrLog.join('<br/>')
            while (document.body.clientHeight < (this.log.offsetHeight + this.fpsHeight + this.fontSize * 2)) {
                this.arrLog.shift();
                this.log.innerHTML = this.arrLog.join('<br/>');
            }
        }
    }
    //egret.FPSDisplay = WebFps;
}