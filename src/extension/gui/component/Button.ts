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
///<reference path="../../../egret/core/ComponentBase.ts"/>
///<reference path="../../../egret/display/DisplayObject.ts"/>
///<reference path="../../../egret/interactive/TouchContext.ts"/>
module ns_egret{
    export class Button extends ComponentBase {
        constructor() {
            super();
        }

        onActivity() {
            super.onActivity();
            var o:any = this;
            o.addEventListener(TouchEvent.TOUCH_TAP, o.onTouchTap, o);
        }

        onCancel() {
            super.onCancel();
            var o:any = this;
            o.removeEventListener(TouchEvent.TOUCH_TAP, o.onTouchTap, o);
        }

        onTouchTap() {
            console.log("tap!!");
        }
    }
}