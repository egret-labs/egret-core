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

/// <reference path="../../../egret/core/MainContext.ts"/>
/// <reference path="../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../egret/events/TouchEvent.ts"/>
/// <reference path="../../../egret/geom/Rectangle.ts"/>
/// <reference path="../../../egret/tween/Tween.ts"/>
/// <reference path="../../../egret/utils/getTimer.ts"/>
/// <reference path="Constant.ts"/>

module ns_egret {
    /**
     * MovieClip是位图动画序列类，由FlashPro + egret插件生成配置文件
     */
    export class ScrollView extends DisplayObjectContainer {
        public _container;//容器

        public _viewWidth:number;
        public _viewHeight:number;

        public _initWidth:number;
        public _initHeight:number;

        private _isMoved:boolean;

        //按下时，container的坐标
        private _initX:number = 0;
        private _initY:number = 0;
        //按下时，鼠标坐标
        private _downPX:number;
        private _downPY:number;
        //用于记录 container最终位置
        public _endX:number;
        public _endY:number;

        private _deltaTime:number = 200;
        private _downTime:number;

        public direction:string = Direction.BOTH;

        constructor() {
            super();

            this.touchEnabled = true;
            this._endX = 0;
            this._endY = 0;

            this.mask = new Rectangle(0, 0, 100, 100);
        }

        /**
         * 加入到舞台，加入触摸事件
         * @private
         */
        public _onAddToStage() {
            super._onAddToStage();

            this.addListeners();
        }

        /**
         * 从 舞台删除，删除触摸事件
         * @private
         */
        public _onRemoveFromStage() {
            super._onRemoveFromStage();

            this.removeListeners();
        }

        public set width(value:number){
            this._explicitWidth = value;
            this._viewWidth = value;
            this.mask.width = value;
        }

        public set height(value:number){
            this._explicitHeight = value;
            this._viewHeight = value;
            this.mask.height = value;
        }

        /**
         * 设置 显示容器
         * @param container
         * @param initWidth
         * @param initHeight
         */
        public setContainer(container, initWidth, initHeight) {
            if (this._container && this._container.parent) {
                this._container.parent.removeChild(this._container);
            }
            this._container = container;
            this._initWidth = initWidth;
            this._initHeight = initHeight;
            this._endX = 0;
            this._endY = 0;

            if (this._container.parent != null) {
                if (this._container.parent != this) {
                    this._container.parent.removeChild(this._container);
                }
                else {
                    return;
                }
            }
            this.addChildAt(this._container, 0);
        }

        private mouseDown(event:ns_egret.TouchEvent) {
            if (!this.touchEnabled) {
                return;
            }
            if (this._container == null) {
                return;
            }
            this._isMoved = false;
            MainContext.instance.stage.addEventListener(ns_egret.TouchEvent.TOUCH_END, this.mouseUp, this);
            MainContext.instance.stage.addEventListener(ns_egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.mouseUp, this);
            MainContext.instance.stage.addEventListener(ns_egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            console.log("begin")


            Tween.removeTweens(this._container);
            this._initX = this._container.x;
            this._initY = this._container.y;
            this._endX = this._container.x;
            this._endY = this._container.y;
            this._downPX = event.stageX;
            this._downPY = event.stageY;

            this._downTime = getTimer();
        }

        private mouseUp(event:ns_egret.TouchEvent) {
            MainContext.instance.stage.removeEventListener(ns_egret.TouchEvent.TOUCH_END, this.mouseUp, this);
            MainContext.instance.stage.removeEventListener(ns_egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.mouseUp, this);
            MainContext.instance.stage.removeEventListener(ns_egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            console.log("end")

            var endTime = getTimer();
            if (endTime - this._downTime > this._deltaTime) {//超过间隔时间，则不需要做 惯性缓动
                this._backToPosition();
            }
            else {//按原来的方向持续 惯性前进
                //获取 位置变化
                var deltaX = event.stageX - this._downPX;
                var deltaY = event.stageY - this._downPY;

                var num = Math.floor(this._deltaTime / (endTime - this._downTime)) * 2;
                if (this.direction == Direction.BOTH || this.direction == Direction.HORIZONTAL) {//水平
                    this._endX += deltaX * num;
                }
                if (this.direction == Direction.BOTH || this.direction == Direction.VERTICAL) {//垂直
                    this._endY += deltaY * num;
                }

                var delay = Math.max(100 * num, 100);
                delay = Math.min(delay, 300);

                var tw = Tween.get(this._container, {onChange: this.moveList, onChangeObj: this});
                tw.to({"x": this._endX, "y": this._endY}, delay);
                tw.call(this._backToPosition, this);
            }
        }

        private mouseMove(event:ns_egret.TouchEvent) {
            var deltaX = event.stageX - this._downPX;
            var deltaY = event.stageY - this._downPY;

            if (this.direction == Direction.BOTH || this.direction == Direction.HORIZONTAL) {//水平
                this._endX = this._initX + deltaX;
            }
            if (this.direction == Direction.BOTH || this.direction == Direction.VERTICAL) {//垂直
                this._endY = this._initY + deltaY;
            }

            this._container.x = this._endX;
            this._container.y = this._endY;

            this.moveList();
        }

        /**
         * 显示对象 回到应在的位置
         */
        public _backToPosition() {

            var isChange:boolean = false;
            if (this._endX > 0) {
                isChange = true;
                this._endX = 0;
            }
            else if (this._endX < this._viewWidth - this._initWidth) {
                isChange = true;
                if (this._viewWidth >= this._initWidth) {
                    this._endX = 0;
                }
                else {
                    this._endX = this._viewWidth - this._initWidth;
                }
            }

            if (this._endY > 0) {
                isChange = true;
                this._endY = 0;
            }
            else if (this._endY < this._viewHeight - this._initHeight) {
                isChange = true;
                if (this._viewHeight >= this._initHeight) {
                    this._endY = 0;
                }
                else {
                    this._endY = this._viewHeight - this._initHeight;
                }
            }
            if (isChange) {
                var tw = Tween.get(this._container, {onChange: this.moveList, onChangeObj: this});
                tw.to({"x": this._endX, "y": this._endY}, 200);
            }
        }

        //每帧 移动 时调用
        public moveList() {

        }

        /**
         * 增加监听
         */
        private addListeners() {
            this.addEventListener(TouchEvent.TOUCH_BEGAN, this.mouseDown, this);
        }

        /**
         * 删除监听
         */
        private removeListeners() {
            this.removeEventListener(TouchEvent.TOUCH_BEGAN, this.mouseDown, this);
            MainContext.instance.stage.removeEventListener(TouchEvent.TOUCH_RELEASE_OUTSIDE, this.mouseUp, this);
            MainContext.instance.stage.removeEventListener(TouchEvent.TOUCH_END, this.mouseUp, this);
            MainContext.instance.stage.removeEventListener(TouchEvent.TOUCH_MOVE, this.mouseMove, this);
            console.log("remove")
        }


    }
}