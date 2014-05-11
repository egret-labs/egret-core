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
///<reference path="TouchContext.ts" />
module ns_egret {


    export class HTML5TouchContext extends TouchContext {

        constructor(private canvas:HTMLCanvasElement) {
            super();
        }


        public run():void {
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


        private onTouchBegin(event:any):void {
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
                if (oldTarget == result) {
                    this.dispatchEvent(TouchEvent.TOUCH_TAP, obj);
                }
                else if (obj.beginTarget) {
                    obj.target = obj.beginTarget;
                    this.dispatchEvent(TouchEvent.TOUCH_RELEASE_OUTSIDE, obj);
                }
                delete this._currentTouchTarget[obj.identifier];
            }
        }

    }


}