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
/// <reference path="../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../egret/display/Bitmap.ts"/>
/// <reference path="../../egret/resource/ResourceLoader.ts"/>
/// <reference path="../../egret/interactive/TouchContext.ts"/>
/// <reference path="../../egret/core/Ticker.ts"/>
/// <reference path="../../egret/core/MainContext.ts"/>
/// <reference path="../../egret/core/StageDelegate.ts"/>
module ns_egret{
    export class VirtualJoystick extends DisplayObjectContainer {
        private className = "VirtualJoystick";
        private leftButtonWidth:number = 79;
        private leftButtonHeight:number = 46;
        private leftButtonOffset:number = 30;

        private leftContainer:DisplayObjectContainer;
        private leftNode:DisplayObjectContainer = null;
        private topNode:DisplayObjectContainer = null;
        private rightNode:DisplayObjectContainer = null;
        private bottomNode:DisplayObjectContainer = null;

        private leftImageNormal:Bitmap = null;
        private topImageNormal:Bitmap = null;
        private rightImageNormal:Bitmap = null;
        private bottomImageNormal:Bitmap = null;

        private leftImageDown:Bitmap = null;
        private topImageDown:Bitmap = null;
        private rightImageDown:Bitmap = null;
        private bottomImageDown:Bitmap = null;

        //左边正常皮肤
        private leftImageNormalName:string = null;
        private topImageNormalName:string = null;
        private rightImageNormalName:string = null;
        private bottomImageNormalName:string = null;

        //左边点击皮肤
        private leftImageDownName:string = null;
        private topImageDownName:string = null;
        private rightImageDownName:string = null;
        private bottomImageDownName:string = null;

        private leftTouchPointX = null;
        private leftTouchPointY = null;
        private isLeftTouching:Boolean = false;
        private leftTouchId;

        private rightButtonNode:ns_egret.DisplayObjectContainer;
        //右边皮肤
        private rightButtonImageNormal:Bitmap = null;
        private rightButtonImageDown:Bitmap = null;
        private rightButtonImageNormalName:string = null;
        private rightButtonImageDownName:string = null;

        private rightButtonWidth:number = 0;
        private rightTouchPointX = null;
        private rightTouchPointY = null;
        private isRightTouching:Boolean = false;
        private rightTouchId;

        public static DIRECTION_LEFT:number = 1;
        public static DIRECTION_TOP:number = 2;
        public static DIRECTION_RIGHT:number = 3;
        public static DIRECTION_BOTTOM:number = 4;

        public static ON_TOUCH_LEFT = "VirtualJoystickClickLeft";
        public static ON_TOUCH_RIGHT = "VirtualJoystickClickRight";
        public static STOP_TOUCH_LEFT = "VirtualJoystickStopTouchLeft";
        public static STOP_TOUCH_RIGHT = "VirtualJoystickStopTouchRight";

        private static instacce:VirtualJoystick = null;

        public static getInstance():VirtualJoystick {
            if (VirtualJoystick.instacce == null) {
                VirtualJoystick.instacce = new VirtualJoystick();
            }
            return VirtualJoystick.instacce;
        }

        public show() {
            this.leftContainer = new ns_egret.DisplayObjectContainer();
            this.leftContainer.touchEnabled = true;
            this.addChild(this.leftContainer);

            this.leftNode = new DisplayObjectContainer();
            this.leftNode.x = -this.leftButtonWidth - this.leftButtonOffset;
            this.leftNode.y = -this.leftButtonHeight / 2;
            this.leftContainer.addChild(this.leftNode);

            this.topNode = new DisplayObjectContainer();
            this.topNode.x = -this.leftButtonHeight / 2;
            this.topNode.y = -this.leftButtonWidth - this.leftButtonOffset;
            this.leftContainer.addChild(this.topNode);

            this.rightNode = new DisplayObjectContainer();
            this.rightNode.x = this.leftButtonOffset;
            this.rightNode.y = -this.leftButtonHeight / 2;
            this.leftContainer.addChild(this.rightNode);

            this.bottomNode = new DisplayObjectContainer();
            this.bottomNode.x = -this.leftButtonHeight / 2;
            this.bottomNode.y = this.leftButtonOffset;
            this.leftContainer.addChild(this.bottomNode);

            this.rightButtonNode = new ns_egret.DisplayObjectContainer();
            this.addChild(this.rightButtonNode);

            this.resetLeft();
            this.resetRight();
            this.rightButtonWidth = this.rightButtonNode.getBounds().width;
            //todo 这个坐标有问题
            this.rightButtonNode.x = (ns_egret.StageDelegate.getInstance().getDesignWidth() - this.rightButtonWidth - this.x)  / this.scaleX;
            this.rightButtonNode.y = -this.rightButtonWidth / 2;
            this.rightButtonNode.touchEnabled = true;

            //todo 这个之后用绘图代替
            var texture = TextureCache.getInstance().getTexture("alpha_0.png");
            var mouseTouch = Bitmap.initWithTexture(texture);
            var mouseTouchWidth = this.leftButtonWidth + this.leftButtonOffset;
            mouseTouch.scaleX = mouseTouch.scaleY = mouseTouchWidth * 2;
            mouseTouch.x = mouseTouch.y = -mouseTouchWidth;
            this.leftContainer.addChild(mouseTouch);

            //todo 这些得删除
            this.leftContainer.addEventListener(TouchEvent.TOUCH_BEGAN, this.onLeftTouchBegin, this);
            this.leftContainer.addEventListener(TouchEvent.TOUCH_MOVE, this.onLeftTouchMoved, this);
            this.rightButtonNode.addEventListener(TouchEvent.TOUCH_BEGAN, this.onRightTouchBegin, this);
            this.rightButtonNode.addEventListener(TouchEvent.TOUCH_MOVE, this.onRightTouchMoved, this);
            MainContext.instance.stage.addEventListener(TouchEvent.TOUCH_END, this.onTouchEnded, this);
            Ticker.getInstance().register(this.update, this);
        }

        private update() {
            if (this.leftTouchPointX != null && this.leftTouchPointY != null && this.isLeftTouching) {
                if (this.checkIsLeftTouchInside()) {
                    this.sendLeftTouchEvent();
                }
                else {
//                    this.dispatchEvent(VirtualJoystick.STOP_TOUCH_LEFT);
                }
            }
            if (this.rightTouchPointX != null && this.rightTouchPointY != null && this.isRightTouching) {
                if (this.checkIsRightTouchInside()) {
                    this.changeBtnState(this.rightButtonNode, "Down");
                    this.dispatchEvent(VirtualJoystick.ON_TOUCH_RIGHT);
                }
            }
        }

        private resetLeft() {
            this.changeBtnState(this.leftNode, "Normal");
            this.changeBtnState(this.topNode, "Normal");
            this.changeBtnState(this.rightNode, "Normal");
            this.changeBtnState(this.bottomNode, "Normal");
        }

        private resetRight() {
            this.changeBtnState(this.rightButtonNode, "Normal");
        }

        private changeBtnState(button:DisplayObjectContainer, state:string) {
            var image;
            switch (button) {
                case this.leftNode:
                    if (this["leftImage" + state] == null) {
                        this["leftImage" + state] = this.createBtn(this["leftImage" + state + "Name"]);
                    }
                    image = this["leftImage" + state];
                    break;
                case this.topNode:
                    if (this["topImage" + state] == null) {
                        this["topImage" + state] = this.createBtn(this["topImage" + state + "Name"]);
                    }
                    image = this["topImage" + state];
                    break;
                case this.rightNode:
                    if (this["rightImage" + state] == null) {
                        this["rightImage" + state] = this.createBtn(this["rightImage" + state + "Name"]);
                    }
                    image = this["rightImage" + state];
                    break;
                case this.bottomNode:
                    if (this["bottomImage" + state] == null) {
                        this["bottomImage" + state] = this.createBtn(this["bottomImage" + state + "Name"]);
                    }
                    image = this["bottomImage" + state];
                    break;
                case this.rightButtonNode:
                    if (this["rightButtonImage" + state] == null) {
                        this["rightButtonImage" + state] = this.createBtn(this["rightButtonImage" + state + "Name"]);
                    }
                    image = this["rightButtonImage" + state];
                    break;
            }
            button.removeAllChildren();
            button.addChild(image);
        }

        private createBtn(resName):Bitmap {
            var result:Bitmap = Bitmap.initWithTexture(TextureCache.getInstance().getTexture(resName));
            return result;
        }

        private onLeftTouchBegin(eventName:string, touchEvent:TouchEvent) {
            this.leftTouchId = touchEvent.touchId;
            var localPoint = touchEvent.getLocalPoint();
            this.leftTouchPointX = localPoint.x;
            this.leftTouchPointY = localPoint.y;
            if (this.checkIsLeftTouchInside()) {
                this.isLeftTouching = true;
            }
        }

        private checkIsLeftTouchInside() {
            if (this.leftTouchPointX * this.scaleX > -this.leftButtonWidth - this.leftButtonOffset
                && this.leftTouchPointX * this.scaleX < this.leftButtonWidth + this.leftButtonOffset
                && this.leftTouchPointY * this.scaleY > -this.leftButtonWidth - this.leftButtonOffset
                && this.leftTouchPointY * this.scaleY < this.leftButtonWidth + this.leftButtonOffset) {
                return true;
            }
            return false;
        }

        private onLeftTouchMoved(eventName:string, touchEvent:TouchEvent) {
            var localPoint = touchEvent.getLocalPoint();
            this.leftTouchPointX = localPoint.x;
            this.leftTouchPointY = localPoint.y;
        }

        private onTouchEnded(eventName:string, touchEvent:TouchEvent) {
            if(this.leftTouchId == null || this.leftTouchId == touchEvent.touchId)
            {
                if (this.isLeftTouching) {
                    this.isLeftTouching = false;
                    this.resetLeft();
                    this.dispatchEvent(VirtualJoystick.STOP_TOUCH_LEFT);
                }
                this.leftTouchId = null;
            }
//            alert(this.rightTouchId + "+" + touchEvent.touchId)
            if(this.rightTouchId == null || this.rightTouchId == touchEvent.touchId)
            {
                if (this.isRightTouching) {
                    this.isRightTouching = false;
                    this.resetRight();
                    this.dispatchEvent(VirtualJoystick.STOP_TOUCH_RIGHT);
                }
                this.rightTouchId = null;
            }
        }

        private sendLeftTouchEvent() {
            if (this.checkIsLeftTouchInside()) {//在范围内
                if (this.leftTouchPointX > -this.leftButtonOffset && this.leftTouchPointX < this.leftButtonOffset
                    && this.leftTouchPointY > -this.leftButtonOffset && this.leftTouchPointY < this.leftButtonOffset) {//不在中间区域，之后中间区域可能有其他操作可能
//                    console.log("点中间了");
                    this.resetLeft();
                }
                else {
                    var radians = Math.atan2(this.leftTouchPointY, this.leftTouchPointX);
                    var angle = radians * (180 / Math.PI);
                    if (angle < 0) {
                        angle += 360;
                    }
                    var directionList = [];
                    if (angle > 330 || angle < 30) {//右键点击
                        this.changeBtnState(this.leftNode, "Normal");
                        this.changeBtnState(this.topNode, "Normal");
                        this.changeBtnState(this.rightNode, "Down");
                        this.changeBtnState(this.bottomNode, "Normal");
                        directionList.push(VirtualJoystick.DIRECTION_RIGHT);
                    }
                    else if (angle > 30 && angle < 60) {//右下键点击
                        this.changeBtnState(this.leftNode, "Normal");
                        this.changeBtnState(this.topNode, "Normal");
                        this.changeBtnState(this.rightNode, "Down");
                        this.changeBtnState(this.bottomNode, "Down");
                        directionList.push(VirtualJoystick.DIRECTION_BOTTOM, VirtualJoystick.DIRECTION_RIGHT);
                    }
                    else if (angle > 60 && angle < 120) {//下键点击
                        this.changeBtnState(this.leftNode, "Normal");
                        this.changeBtnState(this.topNode, "Normal");
                        this.changeBtnState(this.rightNode, "Normal");
                        this.changeBtnState(this.bottomNode, "Down");
                        directionList.push(VirtualJoystick.DIRECTION_BOTTOM);
                    }
                    else if (angle > 120 && angle < 150) {//左下键点击
                        this.changeBtnState(this.leftNode, "Down");
                        this.changeBtnState(this.topNode, "Normal");
                        this.changeBtnState(this.rightNode, "Normal");
                        this.changeBtnState(this.bottomNode, "Down");
                        directionList.push(VirtualJoystick.DIRECTION_BOTTOM, VirtualJoystick.DIRECTION_LEFT);
                    }
                    else if (angle > 150 && angle < 210) {//左键点击
                        this.changeBtnState(this.leftNode, "Down");
                        this.changeBtnState(this.topNode, "Normal");
                        this.changeBtnState(this.rightNode, "Normal");
                        this.changeBtnState(this.bottomNode, "Normal");
                        directionList.push(VirtualJoystick.DIRECTION_LEFT);
                    }
                    else if (angle > 210 && angle < 240) {//左上键点击
                        this.changeBtnState(this.leftNode, "Down");
                        this.changeBtnState(this.topNode, "Down");
                        this.changeBtnState(this.rightNode, "Normal");
                        this.changeBtnState(this.bottomNode, "Normal");
                        directionList.push(VirtualJoystick.DIRECTION_LEFT, VirtualJoystick.DIRECTION_TOP);
                    }
                    else if (angle > 240 && angle < 300) {//上键点击
                        this.changeBtnState(this.leftNode, "Normal");
                        this.changeBtnState(this.topNode, "Down");
                        this.changeBtnState(this.rightNode, "Normal");
                        this.changeBtnState(this.bottomNode, "Normal");
                        directionList.push(VirtualJoystick.DIRECTION_TOP);
                    }
                    else if (angle > 300 && angle < 330) {//右上键点击
                        this.changeBtnState(this.leftNode, "Normal");
                        this.changeBtnState(this.topNode, "Down");
                        this.changeBtnState(this.rightNode, "Down");
                        this.changeBtnState(this.bottomNode, "Normal");
                        directionList.push(VirtualJoystick.DIRECTION_TOP, VirtualJoystick.DIRECTION_RIGHT);
                    }
                    this.dispatchEvent(VirtualJoystick.ON_TOUCH_LEFT, directionList);
                }
            }
        }

        private onRightTouchBegin(eventName:string, touchEvent:TouchEvent) {
            this.rightTouchId = touchEvent.touchId;
            var localPoint = touchEvent.getLocalPoint();
            this.rightTouchPointX = localPoint.x;
            this.rightTouchPointY = localPoint.y;
            if (this.checkIsRightTouchInside()) {
                this.isRightTouching = true;
            }
        }

        private checkIsRightTouchInside() {
            if (this.rightTouchPointX * this.scaleX > -this.rightButtonWidth
                && this.rightTouchPointX * this.scaleX < this.rightButtonWidth
                && this.rightTouchPointY * this.scaleY > -this.rightButtonWidth
                && this.rightTouchPointY * this.scaleY < this.rightButtonWidth) {
                return true;
            }
            return false;
        }

        private onRightTouchMoved(eventName:string, touchEvent:TouchEvent) {
            var localPoint = touchEvent.getLocalPoint();
            this.rightTouchPointX = localPoint.x;
            this.rightTouchPointY = localPoint.y;
        }

        setBtnVisible(direction:number, visible:Boolean) {
            switch (direction) {
                case VirtualJoystick.DIRECTION_LEFT:
            this.leftNode.visible = visible;
                    break;
                case VirtualJoystick.DIRECTION_TOP:
            this.topNode.visible = visible;
                    break;
                case VirtualJoystick.DIRECTION_RIGHT:
            this.rightNode.visible = visible;
                    break;
                case VirtualJoystick.DIRECTION_BOTTOM:
            this.bottomNode.visible = visible;
                    break;
            }
        }

        //以下是设置属性
        public setButtonWidth(value:number) {
            this.leftButtonWidth = value;
        }

        public setButtonHeight(value:number) {
            this.leftButtonHeight = value;
        }

        public setButtonOffset(value:number) {
            this.leftButtonOffset = value;
        }

        public setLeftImageNormalName(value:string) {
            this.leftImageNormalName = value;
        }

        public setTopImageNormalName(value:string) {
            this.topImageNormalName = value;
        }

        public setRightImageNormalName(value:string) {
            this.rightImageNormalName = value;
        }

        public setBottomImageNormalName(value:string) {
            this.bottomImageNormalName = value;
        }

        public setLeftImageDownName(value:string) {
            this.leftImageDownName = value;
        }

        public setTopImageDownName(value:string) {
            this.topImageDownName = value;
        }

        public setRightImageDownName(value:string) {
            this.rightImageDownName = value;
        }

        public setBottomImageDownName(value:string) {
            this.bottomImageDownName = value;
        }

        public setRightButtonImageNormalName(value:string) {
            this.rightButtonImageNormalName = value;
        }

        public setRightButtonImageDownName(value:string) {
            this.rightButtonImageDownName = value;
        }
    }
}