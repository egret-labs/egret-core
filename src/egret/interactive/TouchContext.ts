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
/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="../events/TouchEvent.ts"/>

module ns_egret {
    /**
     *
     * @class ns_egret.TouchContext
     * @classdesc TouchContext是egret的触摸Context
     */
    export class TouchContext extends HashObject {
        private _currentTouchTarget:any = {};
        public maxTouches:number = 2;
        private touchDownTarget:any = {};

        public constructor() {
            super();
        }

        /**
         * 启动触摸检测
         * @method ns_egret.TouchContext#run
         */
        public run():void {


        }

        public getTouchData(identifier, x, y):any {
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

        public dispatchEvent(type:string, data:any):void {
            var touchDown:boolean = (this.touchDownTarget[data.identifier] == true)
            TouchEvent.dispatchTouchEvent(data.target,type,data.identifier,
                data.stageX,data.stageY,false,false,false,touchDown);
        }

        public onTouchBegan(x:number, y:number, identifier:number):void {
            var stage = MainContext.instance.stage;
            var result:any = stage.hitTest(x, y);
            if (result) {
                var obj = this.getTouchData(identifier, x, y);
                this.touchDownTarget[identifier] = true;
                obj.target = result;
                obj.beginTarget = result;
                this.dispatchEvent(TouchEvent.TOUCH_BEGAN, obj);
            }
        }

        public onTouchMove(x:number, y:number, identifier:number):void {
            var stage = MainContext.instance.stage;
            var result = stage.hitTest(x, y);
            if (result) {
                var obj = this.getTouchData(identifier, x, y);
                obj.target = result;
                this.dispatchEvent(TouchEvent.TOUCH_MOVE, obj);
            }
        }

        public onTouchEnd(x:number, y:number, identifier:number):void {
            var stage = MainContext.instance.stage;
            var result = stage.hitTest(x, y);
            if (result) {
                var obj = this.getTouchData(identifier, x, y);
                delete this.touchDownTarget[identifier];
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