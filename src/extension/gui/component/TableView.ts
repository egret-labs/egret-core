/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="ScrollView.ts"/>
/// <reference path="../../../egret/tween/Tween.ts"/>
/// <reference path="../../../egret/core/Constant.ts"/>
/// <reference path="../../../egret/tween/Ease.ts"/>
/// <reference path="../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../egret/display/Bitmap.ts"/>
/// <reference path="../../../egret/texture/Texture.ts"/>
/// <reference path="../../../egret/texture/TextureCache.ts"/>
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
     * MovieClip是位图动画序列类，由FlashPro + egret插件生成配置文件
     */
    export class TableView extends ScrollView {

        private disappearContainer;//item消失时 可能用到的容器

        private _itemArr:Array;//item元件 数组
        private _dataArr:Array;//数据
        private _delegate:any;

        private _currentIndex:number = 0;
        private _itemWidth:number;
        private _itemHeight:number;

        constructor() {
            super();

            this._itemArr = [];
            this.disappearContainer = new ns_egret.DisplayObjectContainer();
            this.addChild(this.disappearContainer);
        }

        public reloadData(dataArr:Array) {
            this._dataArr = dataArr || [];

            var list = new ns_egret.DisplayObjectContainer();

            var wid;
            var hei;
            var current = 0;
            if (this.direction == Direction.HORIZONTAL) {//水平滚动
                wid = this._itemWidth * this._dataArr.length;
                hei = this._itemHeight;
                var listX = this._container.x;
                current = Math.floor(-listX / this._itemWidth);
            }
            else {//竖直滚动
                wid = this._itemWidth;
                hei = this._itemHeight * this._dataArr.length;
                var listY = this._container.y;
                current = Math.floor(-listY / this._itemHeight);
            }

            this._initWidth = wid;
            this._initHeight = hei;

            var total = this._container.numChildren;
            for (var i = 0; i < total; i++) {
                var item = this._container.getChildAt(i);

                this.initItem(item, current + i);
            }
            this._currentIndex = current;

            this._backToPosition();
        }

        //显示进入动画
        public showAnimation() {
            if (this.direction == Direction.VERTICAL) {//竖直滚动
                for (var i = 0, count = 0; i < this._container.numChildren; i++) {
                    var child = this._container.getChildAt(i);
                    if (!child.visible) {
                        continue;
                    }
                    var tw = ns_egret.Tween.get(child);
                    child.x = this._itemWidth;
                    tw.wait(100 * count + 10);
                    tw.to({"x": 0}, 200);
                    count++;
                }
            }
        }

        //显示消失动画
        public hideAnimation() {
            if (this.direction == Direction.VERTICAL) {//竖直滚动
                for (var i = 0, count = 0; i < this._container.numChildren; i++) {
                    var child = this._container.getChildAt(i);
                    if (!child.visible) {
                        continue;
                    }
                    var tw = ns_egret.Tween.get(child);
                    child.x = 0;
                    tw.wait(100 * count + 10);
                    tw.to({"x": this._itemWidth}, 200);
                    count++;
                }
            }
        }

        public setList(dataArr:Array, direction, delegate, width:number, height:number) {
            this._dataArr = dataArr || [];
            this._delegate = delegate;
            this._itemWidth = width;
            this._itemHeight = height;
            this.direction = direction;

            var list = new ns_egret.DisplayObjectContainer();

            if (this.direction == Direction.HORIZONTAL) {//水平滚动
                this.setContainer(list, this._itemWidth * this._dataArr.length, this._itemHeight);
            }
            else {//竖直滚动
                this.setContainer(list, this._itemWidth, this._itemHeight * this._dataArr.length);
            }

            this.initItemList();
        }

        private initItemList() {
            if (this._itemWidth == 0 || this._itemHeight == 0 || this._viewWidth == 0 || this._viewHeight == 0) {//有值没有付
                return;
            }
            var num = 0;
            if (this.direction == Direction.HORIZONTAL) {//水平滚动
                num = Math.ceil(this._viewWidth / this._itemWidth) + 1;
            }
            else {//竖直滚动
                num = Math.ceil(this._viewHeight / this._itemHeight) + 1;
            }

            this._itemArr = [];
            for (var i = 0; i < num; i++) {
                var item:any = this._delegate.createItemRenderer();
                this._container.addChild(item);
                this._itemArr.push(item);
                this.initItem(item, i);
            }
            this._currentIndex = 0;
        }

        private getCurrent() {
            var current = 0;
            if (this.direction == Direction.HORIZONTAL) {//水平滚动
                var listX = this._container.x;
                current = Math.floor(-listX / this._itemWidth);
            }
            else {//竖直滚动
                var listY = this._container.y;
                current = Math.floor(-listY / this._itemHeight);
            }

            if (current > this._dataArr.length - this._itemArr.length) {//超过上限
                current = this._dataArr.length - this._itemArr.length;
            }
            else if (current < 0) {//
                current = 0;
            }
            return current;
        }

        //container 位置有变动
        private moveList() {
            var current = this.getCurrent();

            if (current != this._currentIndex) {//需要刷新
                var deltaIdx = current - this._currentIndex;//当前有多少变化

                console.log("deltaIdx " + deltaIdx);
                console.log("current " + current);
                console.log("this._currentIndex " + this._currentIndex);

                if (deltaIdx < 0) {
                    for (var i = 0; i < -deltaIdx; i++) {
                        var item = this._container.getChildAt(this._container.numChildren - 1);
                        this._container.setChildIndex(item, 0);//放到最底层
                        var itemIdx = current + (-deltaIdx - 1) - i;
                        this.initItem(item, itemIdx);
                    }
                }
                else {
                    var total = this._container.numChildren;
                    for (var i = 0; i < deltaIdx; i++) {
                        var item = this._container.getChildAt(0);
                        this._container.setChildIndex(item, -1);//放到最上层
                        var itemIdx = 0;
                        if (deltaIdx >= total) {
                            itemIdx = current + i;
                        }
                        else {
                            itemIdx = current + total - 1 - (deltaIdx - 1 - i);
                        }
                        this.initItem(item, itemIdx);
                    }
                }

                this._currentIndex = current;
            }
        }

        private initItem(item, dataIdx) {
            if (dataIdx >= this._dataArr.length) {//超过
                item.visible = false;
            }
            else if (dataIdx < 0) {
                item.visible = false;
            }
            else {
                item.visible = true;
                console.log("item index " + dataIdx);
                //刷新 列表元件
                this._delegate.updateItemRenderer(item, this._dataArr[dataIdx], dataIdx);
            }

            if (this.direction == Direction.HORIZONTAL) {//水平滚动
                item.x = this._itemWidth * dataIdx;
            }
            else {//竖直滚动
                item.y = this._itemHeight * dataIdx;
            }
        }
    }
}