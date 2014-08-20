/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret {


    export class HTML5TouchContext extends TouchContext {

        private _isTouchDown:boolean = false;

        constructor(private canvas:HTMLCanvasElement) {
            super();
        }


        public run():void {
            var that = this;
            if (window.navigator.msPointerEnabled) {
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
            else if(MainContext.deviceType == MainContext.DEVICE_MOBILE){
                this.addTouchListener();

            }
            else if(MainContext.deviceType == MainContext.DEVICE_PC){
                this.addTouchListener();
                this.addMouseListener();
            }

            window.addEventListener("mousedown", function (event) {
                if (!that.inOutOfCanvas(event)) {
                    that._isTouchDown = true;
                }
                else {
                    that.dispatchLeaveStageEvent();
                }
            });

            window.addEventListener("mouseup", function (event) {
                if (that._isTouchDown && that.inOutOfCanvas(event)) {
                    that.dispatchLeaveStageEvent();
                }
                that._isTouchDown = false;
            });
        }

        private addMouseListener():void {
            var that = this;
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

        private addTouchListener():void {
            var that = this;
            this.canvas.addEventListener("touchstart", function (event:any) {
                var l = event.changedTouches.length;
                for (var i:number = 0; i < l; i++) {
                    that._onTouchBegin(event.changedTouches[i]);
                }
                event.stopPropagation();
                event.preventDefault();
            }, false);
            this.canvas.addEventListener("touchmove", function (event:any) {
                var l = event.changedTouches.length;
                for (var i:number = 0; i < l; i++) {
                    that._onTouchMove(event.changedTouches[i]);
                }
                event.stopPropagation();
                event.preventDefault();
            }, false);
            this.canvas.addEventListener("touchend", function (event:any) {
                var l = event.changedTouches.length;
                for (var i:number = 0; i < l; i++) {
                    that._onTouchEnd(event.changedTouches[i]);
                }
                event.stopPropagation();
                event.preventDefault();
            }, false);
            this.canvas.addEventListener("touchcancel", function (event:any) {
                var l = event.changedTouches.length;
                for (var i:number = 0; i < l; i++) {
                    that._onTouchEnd(event.changedTouches[i]);
                }
                event.stopPropagation();
                event.preventDefault();
            }, false);
        }

        private inOutOfCanvas(event):boolean {
            var location = this.getLocation(this.canvas, event);
            if (location.x < 0 || location.y < 0 || location.x > this.canvas.width || location.y > this.canvas.height) {
                return true;
            }
            return false;
        }

        private dispatchLeaveStageEvent():void {
            egret.MainContext.instance.stage.dispatchEventWith(egret.Event.LEAVE_STAGE);
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