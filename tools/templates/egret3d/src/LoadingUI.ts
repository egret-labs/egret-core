/**
 * @language zh_CN
 * @classdesc
 * 创建单个View3D使用示例
 * @version Egret 3.0
 * @platform Web,Native
 */
class LoadingUI {

    private max: number;
    private cur: number;
    private div: HTMLElement;

    public constructor() {
        this.div = document.getElementById('descCon');
    }

    public OnInitLoadingView(max: number) {
        this.max = max;
        this.cur = 0;
        if(max == 0) {
            this.div.innerHTML = "正在加载:100%";
            this.CloseLoadingView();
        } else {
            this.div.innerHTML = "正在加载:0%";
        }
    }

    public OnLoadFinished(): void {
        if(this.cur == this.max) {
            return;
        }
        if(this.cur + 1 >= this.max) {
            this.div.innerHTML = "正在加载:100%";
            this.CloseLoadingView();
        } else {
            this.cur++;
            this.div.innerHTML = `正在加载:${Math.ceil(this.cur / this.max * 100)}%`;
        }
    }

    public CloseLoadingView(): void {
        this.div.innerHTML = "正在加载:100%";
        window.setTimeout(() => {
            var loadingMap = document.getElementById('loadingCon');
            loadingMap.hidden = true;
        },1000);
    }
}    