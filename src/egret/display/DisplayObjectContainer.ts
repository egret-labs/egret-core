/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="DisplayObject.ts"/>
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
     * DisplayObjectContainer 类是显示列表中显示对象容器。
     */
    export class DisplayObjectContainer extends DisplayObject {

        constructor() {
            this._children = [];
            super();
        }


        public _children:Array;

        public get numChildren():number{
            return this._children.length;
        }

        /**
         * 修改 容器内子元件的 层级
         * @param child 容器的子元件
         * @param index 新的层级 <0或者>=元件数量，都加入到最上层
         */
        public setChildIndex(child:DisplayObject, index:number):void {
            this.doSetChildIndex(child,index);
        }

        private doSetChildIndex(child:DisplayObject,index:number):void{
            var lastIdx = this._children.indexOf(child);
            if (lastIdx < 0) {
                ns_egret.Logger.fatal("child不在当前容器内");
            }
            //从原来的位置删除
            this._children.splice(lastIdx, 1);
            //放到新的位置
            if (index < 0 || this._children.length <= index) {
                this._children.push(child);
            }
            else {
                this._children.splice(index, 0, child);
            }
        }

        /**
         * @inheritDoc
         */
        public addChild(child:DisplayObject):DisplayObject{
            var index:number = this.numChildren;

            if (child.parent == this)
                index--;

            return this.childAdded(child, index);
        }


        /**
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。
         * todo:GitHub 显示列表
         * @param child 子显示对象
         * @param index 加载的顺序，默认为-1，加载到最前面
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject {

            return this.childAdded(child,index);
        }

        private childAdded(child:DisplayObject,index:number):DisplayObject{
            if (child == this)
                return child;

            if (index<0||index > this._children.length) {
                ns_egret.Logger.fatal("提供的索引超出范围");
                return child;
            }

            var host:DisplayObjectContainer = child.parent;
            if (host == this)
            {
                this.doSetChildIndex(child,index);
                return child;
            }
            if (host)
            {
                host.removeChild(child);
            }

            this._children.splice(index, 0, child);
            child._parentChanged(this);
            child.dispatchEvent(Event.ADDED);
            if (this.isRunning()) {//当前容器在舞台
                child._onAddToStage();
            }

            return child;
        }

        /**
         * 将一个 DisplayObject 子实例从 DisplayObjectContainer 实例中移除。
         * @param child
         */
        public removeChild(child:DisplayObject) {
            var index = this._children.indexOf(child);
            if (index >= 0) {
                this.childRemoved(index);
            }
            else {
                ns_egret.Logger.fatal("child未被addChild到该parent");
            }
        }

        public removeChildAt(index:number) {
            if (index >= 0 && index < this._children.length) {
                this.childRemoved(index);
            }
            else {
                ns_egret.Logger.fatal("child未被addChild到该parent");
            }
        }

        private childRemoved(index:number):void{
            var locChildren = this._children;
            var child:DisplayObject = locChildren[index];
            child.dispatchEvent(Event.REMOVED)
            if (this.isRunning()) {//在舞台上
                child._onRemoveFromStage();
            }
            child._parentChanged(null);
            locChildren.splice(index, 1);
        }


        /**
         * 通过索引获取显示对象
         * @param index
         * @returns {*}
         */
        public getChildAt(index:number) {
            return this._children[index];
        }

        /**
         * 根据子对象的name属性获取对象
         * @param name
         * @returns {null}
         */
        public getChildByName(name:string):ns_egret.DisplayObject {
            //todo
            return null;
        }

        /**
         * 获得 容器内元件的层级
         * @param child
         * @returns -1不在容器内 >=0 在容器里
         */
        public getChildIndex(child:ns_egret.DisplayObject):number {
            return this._children.indexOf(child);
        }

        /**
         * 移除所有显示对象
         */
        public removeAllChildren() {
            var locChildren = this._children;
            for(var i:number=locChildren.length-1;i>=0;i--)
            {
                this.childRemoved(i);
            }
        }


        public render(renderContext) {
            for (var i = 0 , length = this._children.length; i < length; i++) {
                var child:DisplayObject = this._children[i];
                child.visit(renderContext);
            }
        }


        /**
         * @see egret.DisplayObject._measureBounds
         * @returns {null}
         * @private
         */
        public _measureBounds():ns_egret.Rectangle {

            var minX = 0, maxX = 0, minY = 0, maxY = 0;
            var l = this._children.length;
            for (var i = 0; i < l; i++) {
                var child = this._children[i];
                var bounds:Rectangle;
                if (!child.visible || !(bounds = DisplayObject.getTransformBounds(child))) {//child.getBounds())) {
                    continue;
                }
                var x1 = bounds.x , y1 = bounds.y,
                    x2 = bounds.width + bounds.x,
                    y2 = bounds.height + bounds.y;//todo
                if (x1 < minX || i == 0) {
                    minX = x1;
                }
                if (x2 > maxX || i == 0) {
                    maxX = x2;
                }
                if (y1 < minY || i == 0) {
                    minY = y1;
                }
                if (y2 > maxY || i == 0) {
                    maxY = y2;
                }
            }

            return Rectangle.identity.initialize(minX, minY, maxX - minX, maxY - minY);
        }

        /**
         * @see egret.DisplayObject.hitTest
         * @param x
         * @param y
         * @returns {DisplayObject}
         */
        hitTest(x, y) {
            var result:DisplayObject;
            if (!this.visible) {
                return null;
            }
            if (this.mask) {
                if (this.mask.x > x || x > this.mask.x + this.mask.width || this.mask.y > y || y > this.mask.y + this.mask.height) {
                    return null;
                }
            }
            var children = this._children;
            var l = children.length;
            for (var i = l - 1; i >= 0; i--) {
                var child = children[i];
                //todo 這裡的matrix不符合identity的設計原則，以後需要重構
                var o = child;

                var offsetPoint = o.getOffsetPoint();
                var mtx = Matrix2D.identity.identity().prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation,
                    0, 0, offsetPoint.x, offsetPoint.y);
                mtx.invert();
                var point = Matrix2D.transformCoords(mtx, x, y);
                var childHitTestResult = child.hitTest(point.x, point.y, true);
                if (childHitTestResult) {
                    if (childHitTestResult.touchEnabled) {
                        return childHitTestResult;
                    }
                    else if (this.touchEnabled) {
                        return this;
                    }
                    if (result == null) {
                        result = childHitTestResult;
                    }
                }
            }
            return result;
        }


        public _onAddToStage() {
            super._onAddToStage();
            var length:number = this.numChildren;
            for (var i = 0; i < length; i++) {
                var child:DisplayObject = this._children[i];
                child._onAddToStage();
            }
        }

        public _onRemoveFromStage() {
            super._onRemoveFromStage();
            var length:number = this.numChildren;
            for (var i = 0; i < length; i++) {
                var child:DisplayObject = this._children[i];
                child._onRemoveFromStage();
            }
        }

    }
}

var unstable = unstable || {};
unstable.modal_api = {};
unstable.modal_api.setModal = function (value) {
    if (value == undefined) {
        value = true;
    }
    var container = this;
    container._modal = value;
    container.touchEnabled = value;
}

var hitTest = ns_egret.DisplayObjectContainer.prototype.hitTest;
ns_egret.DisplayObjectContainer.prototype.hitTest = function (x, y) {
    var container = this;
    if (container.visible == false) return null;
    var result = hitTest.call(this, x, y);
    if (container._modal) {
        return result ? result : this;
    }
    else {
        return result;
    }
}
ns_egret.DisplayObjectContainer.prototype.setModal = unstable.modal_api.setModal;