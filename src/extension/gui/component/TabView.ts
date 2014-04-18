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
module ns_egret{
    /**
     * tab
     */
    export class TabView extends ns_egret.DisplayObjectContainer {

        private _callArr = [];

        private _currentTag;

        constructor() {
            super();

        }

        init () {
            this._callArr = [];
            this._currentTag = 0;
            for (var i = 0; i < this.numChildren; i++) {
                var btn = this.getChildAt(i);

                var self = this;
                var call = function()
                {
                    var idx = self._callArr.indexOf(this);
                    self.chooseIdx(idx)
                };
                this._callArr.push(call);
                btn.addOnClick(call, call);
                btn.useZoomOut(false);
            }
        }

        chooseIdx (idx) {
            this._currentTag = idx + 1;
            for (var i = 0; i < this.numChildren; i++) {
                var btn = this.getChildAt(i);
                if (i == idx) {
                    btn.setChoose(true);
//                    btn.setEnabled(false);
                }
                else {
                    btn.setChoose(false);
//                    btn.setEnabled(true);
                }
            }

            this.onClick(idx);
        }

        setDefaultTag(tag) {
            var idx = tag - 1;
            this.chooseIdx(idx);
        }

        private _callBack;
        private _target;
        public addOnClick(call, target) {
            this._callBack = call;
            this._target = target;
        }

        private onClick(tagIdx) {
            if (this._callBack && this._target) {
                this._callBack.apply(this._target, [tagIdx + 1]);
            }
        }

        public useZoomOut(use) {
            for (var i = 0; i < this.numChildren; i++) {
                var btn = this.getChildAt(i);
                btn.useZoomOut(use);
            }
        }

        public getCurrentTag() {
            var tag = Math.max(this._currentTag, 1);
            tag = Math.min(tag, this.numChildren);
            return tag;
        }
    }
}