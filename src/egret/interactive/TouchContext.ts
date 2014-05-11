

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

/// <reference path="../core/HashObject.ts"/>
/// <reference path="../core/MainContext.ts"/>
/// <reference path="../core/StageDelegate.ts"/>
/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="../events/TouchEvent.ts"/>
/// <reference path="../geom/Point.ts"/>

module ns_egret {
    /**
     *
     * @class ns_egret.TouchContext
     * @classdesc TouchContext是egret的触摸Context
     */
    export class TouchContext extends HashObject{
        public _currentTouchTarget:any = {};
        public maxTouches:number = 2;

        public constructor() {
            super();
        }

        /**
         * 启动触摸检测
         * @method ns_egret.TouchContext#run
         */
        public run():void {


        }

        public touchDownTarget:any = {};



        public getTouchData(event, x, y) {
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

        public dispatchEvent(type:string, data:any) {
            var target:DisplayObject = data.target;
            var event:TouchEvent = TouchContext.touchEvent;
            event._type = type;
            event.touchPointID = data.identifier;
            event.touchDown = (this.touchDownTarget[data.identifier]==true)
            event._stageX = data.stageX;
            event._stageY = data.stageY;
            target.dispatchEvent(event);
        }

        public static getLocation(canvas, event):Point {

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