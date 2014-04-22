

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

/// <reference path="../core/MainContext.ts"/>
/// <reference path="../core/StageDelegate.ts"/>
/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="../events/TouchEvent.ts"/>
/// <reference path="../geom/Point.ts"/>

module ns_egret {
    /**
     * @class TouchContext是egret的触摸Context
     * @stable B 需要把部分和HTML5耦合的部分抽离出来
     */
    export class TouchContext {
        private _currentTouchTarget:any = {};
        public maxTouches:number = 2;

        constructor(private canvas:HTMLCanvasElement) {
        }

        run() {

            var that = this;
            if ("ontouchstart" in window) {
                this.canvas.addEventListener("touchstart", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouches; i++) {
                        that.onTouchBegin(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);

                this.canvas.addEventListener("touchmove", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouches; i++) {
                        that.onTouchMove(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);

                this.canvas.addEventListener("touchend", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouches; i++) {
                        that.onTouchEnd(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);

                this.canvas.addEventListener("touchcancel", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouches; i++) {
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

        private touchDownTarget:any = {};

        private onTouchBegin(event:any) {
            var location = TouchContext.getLocation(this.canvas, event);
            var x = location.x;
            var y = location.y;
            var stage = MainContext.instance.stage;
            var result:any = stage.hitTest(x, y);
            if (result) {
                var obj = this.getTouchData(event, x, y);
                this.touchDownTarget[obj.identifier] = true;
                obj.target = result;
                obj.beginTarget = result;
                this.dispatchEvent(TouchEvent.TOUCH_BEGAN, obj);
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
                this.dispatchEvent(TouchEvent.TOUCH_MOVE, obj);
            }
        }

        private onTouchEnd(event:any) {
            var location = TouchContext.getLocation(this.canvas, event);
            var x = location.x;
            var y = location.y;
            var stage = MainContext.instance.stage;
            var result = stage.hitTest(x, y);
            if (result) {
                var obj = this.getTouchData(event, x, y);
                delete this.touchDownTarget[obj.identifier];
                var oldTarget = obj.beginTarget;
                obj.target = result;
                this.dispatchEvent(TouchEvent.TOUCH_END, obj);
                if(oldTarget==result){
                    this.dispatchEvent(TouchEvent.TOUCH_TAP, obj);
                }
                else if(obj.beginTarget){
                    obj.target = obj.beginTarget;
                    this.dispatchEvent(TouchEvent.TOUCH_RELEASE_OUTSIDE, obj);
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
                this._currentTouchTarget[identifier] = obj;
            }
            obj.stageX = x;
            obj.stageY = y;
            obj.identifier = identifier;
            return obj;
        }

        private static touchEvent:TouchEvent = new TouchEvent("");

        private dispatchEvent(type:string, data:any) {
            var target:DisplayObject = data.target;
            var event:TouchEvent = TouchContext.touchEvent;
            event._type = type;
            event.touchPointID = data.identifier;
            event.touchDown = (this.touchDownTarget[data.identifier]==true)
            event._stageX = data.stageX;
            event._stageY = data.stageY;
            target.dispatchEvent(event);
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
}