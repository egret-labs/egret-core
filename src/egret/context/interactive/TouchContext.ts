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
    /**
     *
     * @class egret.TouchContext
     * @classdesc TouchContext是egret的触摸Context
     * @private
     */
    export class TouchContext extends HashObject {
        private _currentTouchTarget:any = {};
        public maxTouches:number = 2;
        private touchDownTarget:any = {};
        public touchingIdentifiers:Array<any> = [];

        public constructor() {
            super();
        }

        /**
         * 启动触摸检测
         * @method egret.TouchContext#run
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
            TouchEvent.dispatchTouchEvent(data.target, type, data.identifier,
                data.stageX, data.stageY, false, false, false, touchDown);
        }

        public onTouchBegan(x:number, y:number, identifier:number):void {
            if (this.touchingIdentifiers.length == this.maxTouches) {
                return;
            }
            var stage = MainContext.instance.stage;
            var result:any = stage.hitTest(x, y);
            if (result) {
                var obj = this.getTouchData(identifier, x, y);
                this.touchDownTarget[identifier] = true;
                obj.target = result;
                obj.beginTarget = result;
                this.dispatchEvent(TouchEvent.TOUCH_BEGIN, obj);
            }
            this.touchingIdentifiers.push(identifier);
        }

        private lastTouchX:number = -1;
        private lastTouchY:number = -1;

        public onTouchMove(x:number, y:number, identifier:number):void {
            var index = this.touchingIdentifiers.indexOf(identifier);
            if (index == -1) {
                return;
            }
            if (x == this.lastTouchX && y == this.lastTouchY) {
                return;
            }
            this.lastTouchX = x;
            this.lastTouchY = y;
            var stage = MainContext.instance.stage;
            var result = stage.hitTest(x, y);
            if (result) {
                var obj = this.getTouchData(identifier, x, y);
                obj.target = result;
                this.dispatchEvent(TouchEvent.TOUCH_MOVE, obj);
            }
        }

        public onTouchEnd(x:number, y:number, identifier:number):void {
            var index = this.touchingIdentifiers.indexOf(identifier);
            if (index == -1) {
                return;
            }
            this.touchingIdentifiers.splice(index, 1);
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