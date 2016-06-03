module egret.web {
    export class WebFps extends egret.DisplayObject implements egret.FPSDisplay {
        private fontColor:string;
        private fontSize:string;
        private container;
        private fps;
        private log;
        constructor(stage:Stage, showFPS:boolean, showLog:boolean, logFilter:string,styles:Object){
            super();
            console.log('webFps',showFPS,showLog,logFilter,styles)
            if(showFPS || showLog){
                this.fontColor = styles['textColor'].replace("0x","#")
                var size = parseInt(styles['size']);
                if(egret.Capabilities.isMobile){
                    size -= 2;
                }
                this.fontSize = size + 'px';

                var all = document.createElement('div');
                all.style.position = 'absolute';
                all.style.background = `rgba(0,0,0,${styles['bgAlpha']})`;
                all.style.top = styles['x'] + 'px';
                all.style.left = styles['y'] + 'px';
                document.body.appendChild(all);

                var container = document.createElement('div');
                container.style.color = this.fontColor;
                container.style.fontSize = this.fontSize;
                container.style.lineHeight = this.fontSize;
                //container.style.display = 'inline-block';
                container.style.margin = '4px 4px 4px 4px';
                this.container = container;
                all.appendChild(container);

                if(showFPS) this.showFps();
                if(showLog) this.showLog();
            }
        }
        private showFps(){
            console.log('showFps');
            var fps = document.createElement('div');
            fps.style.paddingBottom = '2px'
            this.fps = fps;
            this.container.appendChild(fps)
            fps.innerHTML = `56 FPS ${egret.Capabilities.renderMode}<br/>min 23 max 58 avg 44`
            var left = document.createElement('div');
            left.style['float'] = 'left';
            left.innerHTML = `Obj<br/>Draw<br/>Dirty<br/>Cost`
            this.container.appendChild(left);
            var right = document.createElement('div');
            right.style['float'] = 'left';
            right.style.paddingLeft = '20px';
            right.innerHTML =  `1261<br/>4<br/>25%<br/>`;
            var cost = document.createElement('div');
            cost.innerHTML = '<font  style="color:#18fefe">12<font/> <font  style="color:#ffff00">26<font/> <font  style="color:#ff0000">25<font/>'
            right.appendChild(cost);
            this.container.appendChild(right);
        }
        private showLog(){
            console.log('showLog');
            var log = document.createElement('div');
            log.style.color = this.fontColor;
            log.style.fontSize = this.fontSize;

        }
        public update(drawCalls:number, dirtyRatio:number, ...args){

        };
        public updateInfo(info:string){

        }
    }
    egret.FPSDisplay = WebFps;
}