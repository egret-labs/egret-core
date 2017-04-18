class LoadingUI extends egret.DisplayObjectContainer {

    private textField: egret.TextField;
    constructor() {
        super();
        this.textField = new egret.TextField();
        this.addChild(this.textField);
        this.textField.x = this.textField.y = 200;
        this.textField.text = 'loading...'

    }

    onProgress(current, total) {
        //ES6的字符串语法
        this.textField.text = `${current} / ${total}`;
        console.log(current, total);
    }
}