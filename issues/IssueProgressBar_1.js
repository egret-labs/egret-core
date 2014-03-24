/**
 * Created with JetBrains WebStorm.
 * User: 林超捷
 * Date: 14-2-10
 * Time: 上午10:34
 * To change this template use File | Settings | File Templates.
 */

function createExample() {

    var container = new ns_egret.DisplayObjectContainer();
    context.stage.addChild(container);
    container.x = 300;
    container.y = 200;

    this._bloodBg = ns_egret.Bitmap.initWithTexture(ns_egret.TextureCache.getInstance().getTexture("progress-001.png"));
    container.addChild(this._bloodBg);
    this._bloodBg.relativeAnchorPointX = 0.5;
    this._bloodBg.relativeAnchorPointY = 0.5;

    this._redBloodBar = new ns_egret.ProgressBar("progress-014.png");
    container.addChild(this._redBloodBar);
    this._redBloodBar.setProgress(100, 100);
    this._redBloodBar.relativeAnchorPointX = 0.5;
    this._redBloodBar.relativeAnchorPointY = 0.5;

    this._yellowBloodBar = new ns_egret.ProgressBar("progress-041.png");
    container.addChild(this._yellowBloodBar);
    this._yellowBloodBar.setProgress(100, 100);
    this._yellowBloodBar.relativeAnchorPointX = 0.5;
    this._yellowBloodBar.relativeAnchorPointY = 0.5;
    this._yellowBloodBar.visible = false;

    this._greenBloodBar = new ns_egret.ProgressBar("progress-002.png");
    container.addChild(this._greenBloodBar);
    this._greenBloodBar.setProgress(100, 100);
    this._greenBloodBar.relativeAnchorPointX = 0.5;
    this._greenBloodBar.relativeAnchorPointY = 0.5;


    this._currentType = 3;
    var total = 100;

    var left = 100;
    var self = this;

    setStarGray= function (per1) {
        if (per1 >= 80) {
            self._currentType = 3;
        }
        else if (per1 >= 50) {
            self._currentType = 2;
        }
        else if (per1 > 0) {
            self._currentType = 1;
        }
        else {
            self._currentType = 0;
        }
    }

    changeBloodType = function () {
        if (self._currentType == 2) {
            self._yellowBloodBar.visible = true;
            self._greenBloodBar.visible = false;
        }
        else if (self._currentType == 1) {
            self._yellowBloodBar.visible = false;
            self._greenBloodBar.visible = false;
        }
        else if (self._currentType == 3) {
            self._yellowBloodBar.visible = false;
            self._greenBloodBar.visible = true;
        }
    }

    var click = function () {

        var per1 = left;
        left -= 10;

        var per2 = left;

        self.setStarGray(per2);
        if (per1 >= 80) {
            ns_egret.Tween.get(self._greenBloodBar).to({"percentage": per2}, 100);
            self._yellowBloodBar.setProgress(left, total);
        }
        else if (per1 >= 50) {
            ns_egret.Tween.get(self._yellowBloodBar).to({"percentage": per2}, 100);
        }
        ns_egret.Tween.get(self._redBloodBar).to({"percentage": per2}, 200).call(self.changeBloodType, this);
    }


    context.stage.addEventListener(ns_egret.TouchEvent.TOUCH_TAP, click, this);

}

var label;

function getResourceList(){
    return ["progress-001.png", "progress-002.png", "progress-041.png", "progress-014.png"];
}

function getDescription(){
    return "在第一次 运行tween时 会'闪'一下";
}