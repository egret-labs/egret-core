/// <reference path="../core/MainContext.ts"/>
/// <reference path="../core/Geometry.ts"/>
/// <reference path="../display/DisplayObjectContainer.ts"/>
/// <reference path="../core/StageDelegate.ts"/>


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

module ns_egret {
    /**
     * @class TouchContext是egret的触摸Context
     * @stable B 需要把部分和HTML5耦合的部分抽离出来
     */
    export class TouchContext {
        private _currentTouchTarget = {};
        public maxTouchs:number = 2;

        constructor(private canvas:HTMLCanvasElement) {
        }

        run() {

            var that = this;
            if ("ontouchstart" in window) {
                this.canvas.addEventListener("touchstart", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouchs; i++) {
                        that.onTouchBegin(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);

                this.canvas.addEventListener("touchmove", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouchs; i++) {
                        that.onTouchMove(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);

                this.canvas.addEventListener("touchend", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouchs; i++) {
                        that.onTouchEnd(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);

                this.canvas.addEventListener("touchcancel", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouchs; i++) {
                        that.onTouchEnd(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);
            }
            else {
                this.canvas.addEventListener("mousedown", function (event) {
                    that.onTouchBegin(event);
                })

                this.canvas.addEventListener("mousemove", function (event) {
                    that.onTouchMove(event);
                })

                this.canvas.addEventListener("mouseup", function (event) {
                    that.onTouchEnd(event);
                })
            }
        }

        private onTouchBegin(event:any) {
            var location = TouchContext.getLocation(this.canvas, event);
            var x = location.x;
            var y = location.y;
            var stage = MainContext.instance.stage;
            var result:any = stage.hitTest(x, y);
            if (result) {
                var obj = this.getTouchData(event, x, y);
                obj.target = result;
                obj.beginTarget = result;
                TouchContext.dispachEvent(TouchEvent.TOUCH_BEGAN, obj);
//                console.log(result);
            }
        }

        private onTouchMove(event:any) {
            var location = TouchContext.getLocation(this.canvas, event);
            var x = location.x;
            var y = location.y;
            var stage = MainContext.instance.stage;
            var result = stage.hitTest(x, y);
            if (result) {
                var obj = this.getTouchData(event, x, y);
                obj.target = result;
                TouchContext.dispachEvent(TouchEvent.TOUCH_MOVE, obj);
            }
        }

        private onTouchEnd(event:any) {
            var location = TouchContext.getLocation(this.canvas, event);
            var x = location.x;
            var y = location.y;
            var stage = MainContext.instance.stage;
            var result = stage.hitTest(x, y);
            if (result) {
                //发一个cancel事件
                var obj = this.getTouchData(event, x, y);
                var oldTarget = obj.beginTarget;
                if(oldTarget)
                {
                    obj.target = obj.beginTarget;
                    TouchContext.dispachEvent(TouchEvent.TOUCH_CANCEL, obj);
                }

                obj.target = result;
                TouchContext.dispachEvent(TouchEvent.TOUCH_END, obj);
                if (oldTarget === result) {
                    TouchContext.dispachEvent(TouchEvent.TOUCH_TAP, obj);
                }
                delete this._currentTouchTarget[obj.identifier];
            }
        }

        private getTouchData(event, x, y) {
            var identifier = -1;
            if (event.hasOwnProperty("identifier")) {
                identifier = event.identifier;
            }
            var obj = this._currentTouchTarget[identifier];
            if (obj == null) {
                obj = {};
            }
            this._currentTouchTarget[identifier] = obj;
            obj.stageX = x;
            obj.stageY = y;
            obj.identifier = identifier;
            return obj;
        }

        static dispachEvent(eventName:string, obj) {
            var resultDisplayObject = obj.target;
            //CANCEL事件有可能没有这个
            var locTouchEventHelperData = TouchEvent.identity;
            locTouchEventHelperData.touchId = obj.identifier;
            locTouchEventHelperData.stageX = obj.stageX;
            locTouchEventHelperData.stageY = obj.stageY;
            locTouchEventHelperData.target = resultDisplayObject;

            //todo
            //在这里算出整个事件流，数组的前一半是捕获阶段目标，后一般是冒泡阶段目标
            var arr = [];
            var target:any = resultDisplayObject;
            while (target.parent) {
                arr.unshift(target.parent);
                target = target.parent;
            }
            arr.push(resultDisplayObject);
            var l = arr.length;
            for (var i:number = l - 1; i >= 0; i--) {
                arr.push(arr[i]);
            }
            l = arr.length;
            for (i = 0; i < l; i++) {
                target = arr[i];
                if (i < l / 2) {
                    target.isUseCapture = true;
                }
                else {
                    target.isUseCapture = false;
                }
                locTouchEventHelperData.currentTarget = target;
                var isStop = target.dispatchEvent(eventName, locTouchEventHelperData);
                if (isStop) {
                    break;
                }
            }
        }

        static getLocation(canvas, event) {

            var doc = document.documentElement;
            var win = window;
            var left, top, tx, ty;

            if (typeof canvas.getBoundingClientRect === 'function') {
                var box = canvas.getBoundingClientRect();
                left = box.left;
                top = box.top;
            } else {
                left = 0;
                top = 0;
            }

            left += win.pageXOffset - doc.clientLeft;
            top += win.pageYOffset - doc.clientTop;

            if (event.pageX != null) { //not avalable in <= IE8
                tx = event.pageX;
                ty = event.pageY;
            } else {
                left -= document.body.scrollLeft;
                top -= document.body.scrollTop;
                tx = event.clientX;
                ty = event.clientY;
            }
            var result = Point.identity;
            result.x = (tx - left) / StageDelegate.getInstance().getScaleX();
            result.y = (ty - top) / StageDelegate.getInstance().getScaleY();
            return result;

        }
    }

    /**
     * Touch数据类
     */
    export class TouchEvent {

        /**
         * 开始触摸,参考Flash MouseDown
         */
        static TOUCH_BEGAN:string = "touchBegan";

        /**
         * 结束触摸,参考Flash MouseUp
         */
        static TOUCH_END:string = "touchEnd";

        /**
         * 取消触摸,touchBegan目标会派发此事件
         */
        static TOUCH_CANCEL:string = "touchCancel";

        /**
         * 轻触，参考Flash MouseClick
         */
        static TOUCH_TAP:string = "touchTap";

        /**
         * 移动，参考FLash MouseMove
         */
        static TOUCH_MOVE:string = "touchMove";

        static identity = new TouchEvent();

        /**
         * 事件的stageX坐标
         */
        public stageX:number;

        /**
         * 事件的stageY坐标
         */
        public stageY:number;


        /**
         * touchId，多点触控需要
         */
        public touchId:number;

        public currentTarget:DisplayObject;

        public target:DisplayObject;

        public getLocalPoint():Point{
            return this.currentTarget.globalToLocal(this.stageX, this.stageY);
        }
    }
}