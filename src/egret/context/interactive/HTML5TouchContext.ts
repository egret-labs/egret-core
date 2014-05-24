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

/// <reference path="TouchContext.ts"/>
/// <reference path="../../core/StageDelegate.ts"/>
/// <reference path="../../geom/Point.ts"/>

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
                        that._onTouchBegin(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);

                this.canvas.addEventListener("touchmove", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouches; i++) {
                        that._onTouchMove(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);

                this.canvas.addEventListener("touchend", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouches; i++) {
                        that._onTouchEnd(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);

                this.canvas.addEventListener("touchcancel", function (event:any) {
                    var l = event.changedTouches.length;
                    for (var i:number = 0; i < l && i < that.maxTouches; i++) {
                        that._onTouchEnd(event.changedTouches[i]);
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }, false);
            }
            else if (window.navigator.msPointerEnabled) {
                this.canvas.addEventListener("MSPointerDown", function (event:any) {
                    that._onTouchBegin(event);
                    event.stopPropagation();
                    event.preventDefault();
                }, false);
                this.canvas.addEventListener("MSPointerMove", function (event:any) {
                    that._onTouchMove(event);
                    event.stopPropagation();
                    event.preventDefault();
                }, false);
                this.canvas.addEventListener("MSPointerUp", function (event:any) {
                    that._onTouchEnd(event);
                    event.stopPropagation();
                    event.preventDefault();
                }, false);
            }
            else {
                this.canvas.addEventListener("mousedown", function (event) {
                    that._onTouchBegin(event);
                });

                this.canvas.addEventListener("mousemove", function (event) {
                    that._onTouchMove(event);
                });

                this.canvas.addEventListener("mouseup", function (event) {
                    that._onTouchEnd(event);
                });
            }
        }


        private _onTouchBegin(event:any):void {
            var location = this.getLocation(this.canvas, event);
            var identifier = -1;
            if (event.hasOwnProperty("identifier")) {
                identifier = event.identifier;
            }
            this.onTouchBegan(location.x, location.y, identifier);
        }

        private _onTouchMove(event:any):void {
            var location = this.getLocation(this.canvas, event);
            var identifier = -1;
            if (event.hasOwnProperty("identifier")) {
                identifier = event.identifier;
            }
            this.onTouchMove(location.x, location.y, identifier);

        }

        private _onTouchEnd(event:any):void {
            var location = this.getLocation(this.canvas, event);
            var identifier = -1;
            if (event.hasOwnProperty("identifier")) {
                identifier = event.identifier;
            }
            this.onTouchEnd(location.x, location.y, identifier);
        }


        private getLocation(canvas, event):Point {
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