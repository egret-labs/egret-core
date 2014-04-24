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

/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="../core/Logger.ts"/>
/// <reference path="DisplayObject.ts"/>
/// <reference path="../events/Event.ts"/>
/// <reference path="../geom/Matrix.ts"/>
/// <reference path="../geom/Rectangle.ts"/>

module ns_egret {
    /**
     * DisplayObjectContainer 类是显示列表中显示对象容器。
     */
    export class DisplayObjectContainer
    extends DisplayObject {

        constructor() {
            super();
            this._children = [];

        }

        /**
         * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
         */
        public touchChildren:Boolean = true;

        public _children:Array<DisplayObject>

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
            child.dispatchEventWith(Event.ADDED,true);
            if (this._stage) {//当前容器在舞台
                child._onAddToStage();
            }

            return child;
        }

        /**
         * 将一个 DisplayObject 子实例从 DisplayObjectContainer 实例中移除。
         * @param child
         */
        public removeChild(child:DisplayObject):DisplayObject {
            var index = this._children.indexOf(child);
            if (index >= 0) {
                return this.childRemoved(index);
            }
            else {
                ns_egret.Logger.fatal("child未被addChild到该parent");
            }
        }

        public removeChildAt(index:number):DisplayObject {
            if (index >= 0 && index < this._children.length) {
               return this.childRemoved(index);
            }
            else {
                ns_egret.Logger.fatal("提供的索引超出范围");
            }
        }

        private childRemoved(index:number):DisplayObject{
            var locChildren = this._children;
            var child:DisplayObject = locChildren[index];
            child.dispatchEventWith(Event.REMOVED,true)
            if (this._stage) {//在舞台上
                child._onRemoveFromStage();
            }
            child._parentChanged(null);
            locChildren.splice(index, 1);
            return child;
        }


        /**
         * 通过索引获取显示对象
         * @param index
         * @returns {*}
         */
        public getChildAt(index:number):DisplayObject {
            if (index >= 0 && index < this._children.length) {
                return this._children[index];
            }
            else {
                ns_egret.Logger.fatal("提供的索引超出范围");
            }
        }

        /**
         *  确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身。搜索包括整个显示列表（其中包括此 DisplayObjectContainer 实例）。孙项、曾孙项等，每项都返回 true。
         * @param child 要测试的子对象。
         */
        public contains(child:DisplayObject):boolean{
            return this._children.indexOf(child)!=-1;
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

        public swapChildrenAt(index1:number, index2:number):void{
            if (index1 >= 0 && index1 < this._children.length&&index2>=0&&index2<this._children.length) {
                this._swapChildrenAt(index1,index2);
            }
            else {
                ns_egret.Logger.fatal("提供的索引超出范围");
            }

        }

        public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
            var index1:number = this._children.indexOf(child1);
            var index2:number = this._children.indexOf(child2);
            if (index1 == -1||index2==-1) {
                ns_egret.Logger.fatal("child未被addChild到该parent");
            }
            else {
                this._swapChildrenAt(index1,index2);
            }
        }

        private _swapChildrenAt(index1:number, index2:number):void{
            if (index1 > index2){
                var temp:number = index2;
                index2 = index1;
                index1 = temp;
            }
            else if (index1 == index2){
                return;
            }
            var list:Array<DisplayObject> = this._children;
            var child1:DisplayObject = list[index1];
            var child2:DisplayObject = list[index2];
            list.splice(index2, 1);
            list.splice(index1, 1);

            list.splice(index1, 0, child2);
            list.splice(index2, 0, child1);
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

        public updateTransform() {
            if (!this.visible) {
                return;
            }
            super.updateTransform();
            for (var i = 0 , length = this._children.length; i < length; i++) {
                var child:DisplayObject = this._children[i];
                child.updateTransform();
            }
        }

        public render(renderContext:RendererContext) {
            for (var i = 0 , length = this._children.length; i < length; i++) {
                var child:DisplayObject = this._children[i];
                child.draw(renderContext);
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
                if (!child.visible || !(bounds = DisplayObject.getTransformBounds(child.getBounds(), child.getMatrix()))) {
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
            if (this.scrollRect) {
                if (x > this.scrollRect.width
                    || y > this.scrollRect.height) {
                    return null;
                }
            }
            else if (this.mask) {
                if (this.mask.x > x
                    || x > this.mask.x + this.mask.width
                    || this.mask.y > y
                    || y > this.mask.y + this.mask.height) {
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
                var childX = o.x;
                var childY = o.y;
                if(this.scrollRect)
                {
                    childX -= this.scrollRect.x;
                    childY -= this.scrollRect.y;
                }
                var mtx = Matrix.identity.identity().prependTransform(childX, childY, o.scaleX, o.scaleY, o.rotation,
                    0, 0, offsetPoint.x, offsetPoint.y);
                mtx.invert();
                var point = Matrix.transformCoords(mtx, x, y);
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