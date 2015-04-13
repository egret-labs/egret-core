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
     * @extends egret.DisplayObject
     * @class egret.DisplayObjectContainer
     * @classdesc
     * DisplayObjectContainer 类是可用作显示列表中显示对象容器的所有对象的基类。
     * 该显示列表管理运行时中显示的所有对象。使用 DisplayObjectContainer 类排列显示列表中的显示对象。每个 DisplayObjectContainer 对象都有自己的子级列表，用于组织对象的 Z 轴顺序。Z 轴顺序是由前至后的顺序，可确定哪个对象绘制在前，哪个对象绘制在后等。
     * @link http://docs.egret-labs.org/post/manual/displaycon/aboutdisplaycon.html 显示容器的概念与实现
     */
    export class DisplayObjectContainer extends DisplayObject {


        public static __EVENT__ADD_TO_STAGE_LIST:Array<DisplayObject> = [];
        public static __EVENT__REMOVE_FROM_STAGE_LIST:Array<DisplayObject> = [];

        /**
         * 创建一个 egret.DisplayObjectContainer 对象
         */
        constructor() {
            super();
            this._children = [];

            this._setFlag(DisplayObjectFlags.IS_CONTAINER, true);
            this._setFlag(DisplayObjectFlags.TOUCH_CHILDREN, true);
        }

        /**
         * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
         * 默认值为 true 即可以接收。
         * @member {boolean} egret.DisplayObjectContainer#touchChildren
         */
        public get touchChildren():boolean {
            return this._getFlag(DisplayObjectFlags.TOUCH_CHILDREN);
        }

        public set touchChildren(value:boolean) {
            this._setFlag(DisplayObjectFlags.TOUCH_CHILDREN, value);
        }

        public _children:Array<DisplayObject>;

        /**
         * 返回此对象的子项数目。
         * @member {number} egret.DisplayObjectContainer#numChildren
         */
        public get numChildren():number {
            return this._children.length;
        }

        /**
         * 更改现有子项在显示对象容器中的位置。这会影响子对象的分层。
         * @method egret.DisplayObjectContainer#setChildIndex
         * @param child {egret.DisplayObject} 要为其更改索引编号的 DisplayObject 子实例。
         * @param index {number} 生成的 child 显示对象的索引编号。当新的索引编号小于0或大于已有子元件数量时，新加入的DisplayObject对象将会放置于最上层。
         */
        public setChildIndex(child:DisplayObject, index:number):void {
            this.doSetChildIndex(child, index);
        }

        private doSetChildIndex(child:DisplayObject, index:number):void {
            var lastIdx = this._children.indexOf(child);
            if (lastIdx < 0) {
                egret.Logger.fatalWithErrorId(1006);
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
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。子项将被添加到该 DisplayObjectContainer 实例中其他所有子项的前（上）面。（要将某子项添加到特定索引位置，请使用 addChildAt() 方法。）
         * @method egret.DisplayObjectContainer#addChild
         * @param child {egret.DisplayObject} 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
         * @returns {egret.DisplayObject} 在 child 参数中传递的 DisplayObject 实例。
         */
        public addChild(child:DisplayObject):DisplayObject {
            var index:number = this._children.length;

            if (child._parent == this)
                index--;

            return this._doAddChild(child, index);
        }


        /**
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中。该子项将被添加到指定的索引位置。索引为 0 表示该 DisplayObjectContainer 对象的显示列表的后（底）部。如果索引值为-1，则表示该DisplayObjectContainer 对象的显示列表的前（上）部。
         * @method egret.DisplayObjectContainer#addChildAt
         * @param child {egret.DisplayObject} 要作为该 DisplayObjectContainer 实例的子项添加的 DisplayObject 实例。
         * @param index {number} 添加该子项的索引位置。 如果指定当前占用的索引位置，则该位置以及所有更高位置上的子对象会在子级列表中上移一个位置。
         * @returns {egret.DisplayObject} 在 child 参数中传递的 DisplayObject 实例。
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject {

            return this._doAddChild(child, index);
        }

        public _doAddChild(child:DisplayObject, index:number, notifyListeners:boolean = true):DisplayObject {
            if (child == this)
                return child;

            if (index < 0 || index > this._children.length) {
                egret.Logger.fatalWithErrorId(1007);
                return child;
            }

            var host:DisplayObjectContainer = child._parent;
            if (host == this) {
                this.doSetChildIndex(child, index);
                return child;
            }
            
            if (host) {
                var hostIndex = host._children.indexOf(child);
                if (hostIndex >= 0) {
                    host._doRemoveChild(hostIndex);
                }
            }

            this._children.splice(index, 0, child);
            child._parentChanged(this);
            if (notifyListeners)
                child.dispatchEventWith(Event.ADDED, true);
            if (this._stage) {//当前容器在舞台
                child._onAddToStage();
                var list = DisplayObjectContainer.__EVENT__ADD_TO_STAGE_LIST;
                while (list.length > 0) {
                    var childAddToStage = list.shift();
                    if (notifyListeners){
                        childAddToStage.dispatchEventWith(Event.ADDED_TO_STAGE);
                    }
                }
            }

            child._setDirty();
            this._setSizeDirty();
            return child;
        }

        /**
         * 将一个 DisplayObject 子实例从 DisplayObjectContainer 实例中移除。
         * @method egret.DisplayObjectContainer#removeChild
         * @param child {egret.DisplayObject} 要删除的 DisplayObject 实例。
         * @returns {egret.DisplayObject} 在 child 参数中传递的 DisplayObject 实例。
         */
        public removeChild(child:DisplayObject):DisplayObject {
            var index = this._children.indexOf(child);
            if (index >= 0) {
                return this._doRemoveChild(index);
            }
            else {
                egret.Logger.fatalWithErrorId(1008);
                return null;
            }
        }

        /**
         * 从 DisplayObjectContainer 的子列表中指定的 index 位置删除子 DisplayObject。
         * @method egret.DisplayObjectContainer#removeChildAt
         * @param index {number} 要删除的 DisplayObject 的子索引。
         * @returns {egret.DisplayObject} 已删除的 DisplayObject 实例。
         */
        public removeChildAt(index:number):DisplayObject {
            if (index >= 0 && index < this._children.length) {
                return this._doRemoveChild(index);
            }
            else {
                egret.Logger.fatalWithErrorId(1007);
                return null;
            }
        }

        public _doRemoveChild(index:number, notifyListeners:boolean = true):DisplayObject {
            var locChildren = this._children;
            var child:DisplayObject = locChildren[index];
            if (notifyListeners){
                child.dispatchEventWith(Event.REMOVED, true);
            }

            if (this._stage) {//在舞台上
                child._onRemoveFromStage();
                var list = DisplayObjectContainer.__EVENT__REMOVE_FROM_STAGE_LIST
                while (list.length > 0) {
                    var childAddToStage = list.shift();
                    if (notifyListeners){
                        childAddToStage.dispatchEventWith(Event.REMOVED_FROM_STAGE);
                    }
                    childAddToStage._stage = null;
                }
            }
            child._parentChanged(null);
            locChildren.splice(index, 1);

            this._setSizeDirty();

            return child;
        }


        /**
         * 返回位于指定索引处的子显示对象实例。
         * @method egret.DisplayObjectContainer#getChildAt
         * @param index {number} 子对象的索引位置。
         * @returns {egret.DisplayObject} 位于指定索引位置处的子显示对象。
         */
        public getChildAt(index:number):DisplayObject {
            if (index >= 0 && index < this._children.length) {
                return this._children[index];
            }
            else {
                egret.Logger.fatalWithErrorId(1007);
                return null;
            }
        }

        /**
         * 确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身。搜索包括整个显示列表（其中包括此 DisplayObjectContainer 实例）。孙项、曾孙项等，每项都返回 true。
         * @method egret.DisplayObjectContainer#contains
         * @param child {egret.DisplayObject} 要测试的子对象。
         * @returns {boolean} 如果指定的显示对象为DisplayObjectContainer该实例本身，则返回true，如果指定的显示对象为当前实例子项，则返回false。
         */
        public contains(child:DisplayObject):boolean {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child._parent;
            }
            return false;
        }

        /**
         * 在子级列表中两个指定的索引位置，交换子对象的 Z 轴顺序（前后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
         * @method egret.DisplayObjectContainer#swapChildrenAt
         * @param index1 {number} 第一个子对象的索引位置。
         * @param index2 {number} 第二个子对象的索引位置。
         */
        public swapChildrenAt(index1:number, index2:number):void {
            if (index1 >= 0 && index1 < this._children.length && index2 >= 0 && index2 < this._children.length) {
                this._swapChildrenAt(index1, index2);
            }
            else {
                egret.Logger.fatalWithErrorId(1007);
            }

        }

        /**
         * 交换两个指定子对象的 Z 轴顺序（从前到后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
         * @method egret.DisplayObjectContainer#swapChildren
         * @param child1 {egret.DisplayObject} 第一个子对象。
         * @param child2 {egret.DisplayObject} 第二个子对象。
         */
        public swapChildren(child1:DisplayObject, child2:DisplayObject):void {
            var index1:number = this._children.indexOf(child1);
            var index2:number = this._children.indexOf(child2);
            if (index1 == -1 || index2 == -1) {
                egret.Logger.fatalWithErrorId(1008);
            }
            else {
                this._swapChildrenAt(index1, index2);
            }
        }

        private _swapChildrenAt(index1:number, index2:number):void {
            if (index1 == index2) {
                return;
            }
            var list:Array<DisplayObject> = this._children;
            var child:DisplayObject = list[index1];
            list[index1] = list[index2];
            list[index2] = child;
        }

        /**
         * 返回 DisplayObject 的 child 实例的索引位置。
         * @method egret.DisplayObjectContainer#getChildIndex
         * @param child {egret.DisplayObject} 要标识的 DisplayObject 实例。
         * @returns {number} 要标识的子显示对象的索引位置。
         */
        public getChildIndex(child:egret.DisplayObject):number {
            return this._children.indexOf(child);
        }

        /**
         * 从 DisplayObjectContainer 实例的子级列表中删除所有 child DisplayObject 实例。
         * @method egret.DisplayObjectContainer#removeChildren
         */
        public removeChildren():void {
            var locChildren = this._children;
            for (var i:number = locChildren.length - 1; i >= 0; i--) {
                this._doRemoveChild(i);
            }
        }

        public _updateTransform():void {
            var o = this;

            if (!o._getFlag(DisplayObjectFlags.VISIBLE)) {
                return;
            }
            if(o._filter) {
                RenderCommand.push(o._setGlobalFilter, o);
            }
            if (o._colorTransform) {
                RenderCommand.push(o._setGlobalColorTransform, o);
            }
            var mask = o.mask || o._scrollRect;
            if(mask) {
                RenderCommand.push(o._pushMask, o);
            }
            super._updateTransform();
            if(!o["_cacheAsBitmap"] || !o._texture_to_render) {
                for (var i = 0, children = o._children, length = children.length; i < length; i++) {
                    var child:DisplayObject = children[i];
                    child._updateTransform();
                }
            }
            if(mask) {
                RenderCommand.push(o._popMask, o);
            }
            if (o._colorTransform) {
                RenderCommand.push(o._removeGlobalColorTransform, o);
            }
            if(o._filter) {
                RenderCommand.push(o._removeGlobalFilter, o);
            }
        }

        public _render(renderContext:RendererContext):void {
            if(!MainContext.__use_new_draw) {
                var o = this;
                for (var i = 0, children = o._children, length = children.length; i < length; i++) {
                    var child:DisplayObject = children[i];
                    child._draw(renderContext);
                }
            }
        }


        /**
         * @see egret.DisplayObject._measureBounds
         * @returns {null}
         * @private
         */
        public _measureBounds():egret.Rectangle {
            var o = this;
            var minX = 0, maxX = 0, minY = 0, maxY = 0;
            var children = o._children;
            var l = children.length;

            for (var i = 0; i < l; i++) {
                var child = children[i];
                if (!child._getFlag(DisplayObjectFlags.VISIBLE)) {
                    continue;
                }

                var childBounds:Rectangle = child.getBounds(Rectangle.identity, false);
                var childBoundsX:number = childBounds.x;
                var childBoundsY:number = childBounds.y;
                var childBoundsW:number = childBounds.width;
                var childBoundsH:number = childBounds.height;

                var childMatrix:Matrix = child._getMatrix();

                var bounds:Rectangle = DisplayObject.getTransformBounds(Rectangle.identity.initialize(childBoundsX, childBoundsY, childBoundsW, childBoundsH), childMatrix);
                var x1 = bounds.x , y1 = bounds.y,
                    x2 = bounds.width + bounds.x,
                    y2 = bounds.height + bounds.y;
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
         * 检测指定坐标是否在显示对象内
         * @method egret.DisplayObjectContainer#hitTest
         * @see egret.DisplayObject.hitTest
         * @param x {number} 检测坐标的x轴
         * @param y {number} 检测坐标的y轴
         * @param ignoreTouchEnabled {boolean} 是否忽略TouchEnabled
         * @returns {egret.DisplayObject} 返回所发生碰撞的DisplayObject对象
         */
        public hitTest(x:number, y:number, ignoreTouchEnabled:boolean = false):DisplayObject {
            var o = this;
            var result:DisplayObject;
            if (!o._getFlag(DisplayObjectFlags.VISIBLE)) {
                return null;
            }
            if (o._scrollRect) {
                if (x < o._scrollRect.x || y < o._scrollRect.y
                    || x > o._scrollRect.x + o._scrollRect.width
                    || y > o._scrollRect.y + o._scrollRect.height) {
                    return null;
                }
            }
            else if (o.mask) {
                if (o.mask.x > x
                    || x > o.mask.x + o.mask.width
                    || o.mask.y > y
                    || y > o.mask.y + o.mask.height) {
                    return null;
                }
            }
            var children = o._children;
            var l = children.length;
            var touchChildren = o._getFlag(DisplayObjectFlags.TOUCH_CHILDREN);//这里不用考虑父级的touchChildren，从父级调用下来过程中已经判断过了。
            for (var i = l - 1; i >= 0; i--) {
                var child = children[i];
                var mtx = child._getMatrix();
                var scrollRect = child._scrollRect;
                if (scrollRect) {
                    mtx.append(1, 0, 0, 1, -scrollRect.x, -scrollRect.y);
                }
                mtx.invert();
                var point = egret.Matrix.transformCoords(mtx, x, y);
                var childHitTestResult = child.hitTest(point.x, point.y, true);
                if (childHitTestResult) {
                    if (!touchChildren) {
                        return o;
                    }

                    if (childHitTestResult._getFlag(DisplayObjectFlags.TOUCH_ENABLED) && touchChildren) {
                        return childHitTestResult;
                    }

                    result = o;
                }
            }
            if (result) {
                return result;
            }
            else if (o._texture_to_render) {
                return super.hitTest(x, y, ignoreTouchEnabled);
            }
            return null;
        }


        public _onAddToStage():void {
            var o = this;
            super._onAddToStage();
            var children = o._children;
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var child:DisplayObject = this._children[i];
                child._onAddToStage();
            }
        }

        public _onRemoveFromStage():void {
            var o = this;
            super._onRemoveFromStage();
            var children = o._children;
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var child:DisplayObject = children[i];
                child._onRemoveFromStage();
            }
        }

        /**
         * 返回具有指定名称的子显示对象。
         * @method egret.DisplayObjectContainer#getChildByName
         * @param name {string} 要返回的子项的名称。
         * @returns {egret.DisplayObject} 具有指定名称的子显示对象。
         */
        public getChildByName(name:string):DisplayObject {
            var locChildren = this._children;
            var length = locChildren.length;
            var displayObject:DisplayObject;
            for (var i:number = 0; i < length; i++) {
                displayObject = locChildren[i];
                if (displayObject.name == name) {
                    return displayObject;
                }
            }
            return null;
        }
    }
}
