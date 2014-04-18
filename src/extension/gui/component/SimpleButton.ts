
/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
/// <reference path="../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../egret/display/Bitmap.ts"/>
/// <reference path="../../../egret/texture/Texture.ts"/>
/// <reference path="../../../egret/texture/TextureCache.ts"/>
module ns_egret{
    /**
     * MovieClip是位图动画序列类，由FlashPro + egret插件生成配置文件
     */
    export class SimpleButton extends DisplayObjectContainer {
        private _frames:Array = [];
        private _frameRes:string;
        private _currentFrame:number = 1;

        private _scale:number = 1.1;

        private _isMoved:boolean;
        private _startX:number;
        private _startY:number;

        private _initScaleX:number = 0;
        private _initScaleY:number = 0;

        private _canScale:boolean = true;
        private _frameNumber = 0;

        //文本
        private _textField;

        constructor() {
            super();

            this.touchEnabled = true;
            this._canScale = true;
        }

        public hitTest(x, y) {
            return ns_egret.DisplayObject.prototype.hitTest.call(this, x, y);
        }

        /**
         * 加入到舞台，加入触摸事件
         * @private
         */
        public _onAddToStage() {
            super._onAddToStage();

            this.addListeners();

            this._initScaleX = this.scaleX;
            this._initScaleY = this.scaleY;
        }

        /**
         * 从 舞台删除，删除触摸事件
         * @private
         */
        public _onRemoveFromStage() {
            super._onRemoveFromStage();

            this.removeListeners();
        }

        //增加 事件
        private addListeners() {
            this.addEventListener(ns_egret.TouchEvent.TOUCH_BEGAN, this.mouseDown, this);
        }

        private removeListeners() {
            this.removeEventListener(ns_egret.TouchEvent.TOUCH_BEGAN, this.mouseDown, this);
            MainContext.instance.stage.removeEventListener(ns_egret.TouchEvent.TOUCH_END, this.mouseUp, this);
            MainContext.instance.stage.removeEventListener(ns_egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
        }

        private mouseDown(event:TouchEvent) {
            this._isMoved = false;
            MainContext.instance.stage.addEventListener(ns_egret.TouchEvent.TOUCH_END, this.mouseUp, this);
            MainContext.instance.stage.addEventListener(ns_egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);

            this._startX = event.stageX;
            this._startY = event.stageY;

            this.setChoose(true);
        }

        private mouseUp() {
            if (!this._isMoved) {
                this.setChoose(false);
                this.onClick();
            }
            MainContext.instance.stage.removeEventListener(ns_egret.TouchEvent.TOUCH_END, this.mouseUp, this);
            MainContext.instance.stage.removeEventListener(ns_egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
        }

        private mouseMove(event:TouchEvent) {
            var pointX = event.stageX;
            var pointY = event.stageY;
            if (!(Math.abs(pointX - this._startX) < 10 && Math.abs(pointY - this._startY) < 10)) {
                this._isMoved = true;
                this.setChoose(false);

                MainContext.instance.stage.removeEventListener(ns_egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            }
        }

        private _callBack;
        private _target;

        public addOnClick(call, target) {
            this._callBack = call;
            this._target = target;
        }

        private onClick() {
            if (this._callBack && this._target) {
                this._callBack.apply(this._target, []);
            }
        }

        /**
         * 设置 按钮是否可以点击
         * @param enabled
         */
        public setEnabled(enabled) {
            this.touchEnabled = enabled;
        }

        public useZoomOut(use) {
            this._canScale = use;
        }

        /**
         * 设置 按钮文本
         * @param textfield
         */
        public initFontTextField(textfield) {
            this._textField = textfield;
            if (textfield instanceof ns_egret.TextField) {
                textfield.stroke = 2;
            }
            if (textfield && textfield.parent != null) {
                if (textfield.parent == this) {
                    return;
                }
                textfield.removeFromParent();
            }
            this.addChild(textfield);
        }

        /**
         * 设置 按钮文字
         * @param font 按钮文字
         */
        public setFontText(text, size = 30) {
            if (this._textField == null) {
                this._textField = new ns_egret.TextField();
                this._textField.width = this._textField.height = 0;
                this._textField.textColor = "#ffffff";
                this._textField.textAlign = "center";
                this._textField.font = "Courier-Bold";
                this._textField.size = size;
                this._textField.stroke = 2;
                this.addChild(this._textField);
                this._textField.relativeAnchorPointX = 0.5;
                this._textField.relativeAnchorPointY = 0.5;
                var rect = this.getBounds();
                this._textField.x = rect.width / 2;
                this._textField.y = rect.height / 2;
            }
            this._textField.text = text;
        }

        /**
         * 设置 按钮文字颜色
         * @param color 按钮文字颜色
         */
        public setFontColor(color) {

        }

        public setChoose(choose) {
            this.playZoomOut(!choose);
            this.setFrameChild(choose ? 2 : 1);
        }

        private playZoomOut(isOut:boolean) {
            if (!this._canScale) {
                return;
            }
            this.scaleX = isOut ? this._initScaleX : this._initScaleX * this._scale;
            this.scaleY = isOut ? this._initScaleY : this._initScaleY * this._scale;
        }

        public initFrameRes(res:string, frame:number, item:ns_egret.Bitmap) {
            this._currentFrame = frame;
            this._frameRes = res;
            this._frames[frame - 1] = item;
        }

        public changeBtn(res:string) {
            if (this._frameRes == res) {
                return;
            }
            this._frameRes = res;

            var curIdx:number = 0;
            //删除原来已有的帧图片
            for (var i = 0; i < this._frames.length; i++) {
                var temp = this._frames[i];
                if (temp) {
                    curIdx = this.getChildIndex(temp);
                    this.removeChild(temp);
                    this._frames[i] = null;
                }
            }

            this.setFrameChild(this._currentFrame, curIdx);
        }

        //设置 显示 几帧 素材 只有在有帧的情况下才有用
        // 1第一帧 001
        // 2第二帧 010
        // 其他 前俩帧
        public setFrameNumber(res:string, number) {
            this._frameRes = res;
            number = Math.max(0, number);
            if (number > 2) {
                number = 0;
            }
            this._frameNumber = number;
        }

        //是否在显示  帧 中
        private isInFrames(tag) {
            return this._frameNumber == 0 || (tag & this._frameNumber) > 0;
        }

        private setFrameChild(frame:number, idx:number = 0) {
            if (this._frameRes) {//有帧图片

                var last:Bitmap = this.getFrameChild(this._currentFrame);
                var curIdx:number = idx;
                if (last) {
                    last.visible = false;
                    curIdx = this.getChildIndex(last);
                }
                this._currentFrame = frame;
                if (!this.isInFrames(frame)) {
                    return;
                }

                var child:Bitmap = this.getFrameChild(frame);
                if (child == null) {
                    var newRes = this.getIndexRes(this._frameRes, 1, frame);
                    var texture1 = ns_egret.TextureCache.getInstance().getTexture(newRes);
                    child = ns_egret.Bitmap.initWithTexture(texture1);
                    this._frames[frame - 1] = child;
                    child.relativeAnchorPointX = 0.5;
                    child.relativeAnchorPointY = 0.5;

                    var rect = this.getBounds();
                    child.x = rect.width / 2;
                    child.y = rect.height / 2;
//                    var btRect = child.getBounds();


                    this.addChildAt(child, curIdx);
                }
                child.visible = true;

            }
        }

        //根据当前帧图片
        private getFrameChild(frame:number):Bitmap {
            return this._frames[frame - 1];
        }

        private getIndexRes(tmpRes:string, count:number, indexStr):string {
            var index = tmpRes.lastIndexOf(".");
            if (index < count)
                ns_egret.Logger.fatal("the argument [count] too large");
            var pre = tmpRes.substring(0, index - count);
            var type = tmpRes.substring(index);
            return pre + indexStr + type;
        }

    }
}

