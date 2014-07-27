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
	 * @class egret.DisplayObjectContainer
	 * @classdesc
     * DisplayObjectContainer 类是显示列表中显示对象容器。
     */
    export class DisplayObjectContainer extends DisplayObject {


        public static __EVENT__ADD_TO_STAGE_LIST:Array<DisplayObject> = [];
        public static __EVENT__REMOVE_FROM_STAGE_LIST:Array<DisplayObject> = [];

        constructor() {
            super();
            this._children = [];

        }

        public _touchChildren:boolean = true;
        /**
         * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
		 * @member {boolean} egret.DisplayObjectContainer#touchChildren
         */
        public get touchChildren():boolean{
            return this._touchChildren;
        }
        public set touchChildren(value:boolean){
            this._touchChildren = value;
        }

        public _children:Array<DisplayObject>

		/**
         * 返回此对象的子项数目。
		 * @member {number} egret.DisplayObjectContainer#numChildren
		 */
        public get numChildren():number{
            return this._children.length;
        }

        /**
         * 更改现有子项在显示对象容器中的位置。这会影响子对象的分层。
		 * @method egret.DisplayObjectContainer#setChildIndex
         * @param child {egret.DisplayObject} 要为其更改索引编号的 DisplayObject 子实例。
         * @param index {number} 生成的 child 显示对象的索引编号。当新的索引编号小于0或大于已有子元件数量时，新加入的DisplayObject对象将会放置于最上层。
         */
        public setChildIndex(child:DisplayObject, index:number):void {
            this.doSetChildIndex(child,index);
        }

        private doSetChildIndex(child:DisplayObject,index:number):void{
            var lastIdx = this._children.indexOf(child);
            if (lastIdx < 0) {
                egret.Logger.fatal("child不在当前容器内");
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
        public addChild(child:DisplayObject):DisplayObject{
            var index:number = this.numChildren;

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

            return this._doAddChild(child,index);
        }

        public _doAddChild(child:DisplayObject,index:number,notifyListeners:boolean = true):DisplayObject{
            if (child == this)
                return child;

            if (index<0||index > this._children.length) {
                egret.Logger.fatal("提供的索引超出范围");
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
            if(notifyListeners)
                child.dispatchEventWith(Event.ADDED,true);
            if (this._stage) {//当前容器在舞台
                child._onAddToStage();
                var list = DisplayObjectContainer.__EVENT__ADD_TO_STAGE_LIST;
                while (list.length > 0){
                    var childAddToStage = list.shift();
                    childAddToStage.dispatchEventWith(Event.ADDED_TO_STAGE);
                }
            }

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
                egret.Logger.fatal("child未被addChild到该parent");
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
                egret.Logger.fatal("提供的索引超出范围");
                return null;
            }
        }

        public _doRemoveChild(index:number,notifyListeners:boolean = true):DisplayObject{
            var locChildren = this._children;
            var child:DisplayObject = locChildren[index];
            if(notifyListeners)
                child.dispatchEventWith(Event.REMOVED,true)
            if (this._stage) {//在舞台上
                child._onRemoveFromStage();
                var list = DisplayObjectContainer.__EVENT__REMOVE_FROM_STAGE_LIST
                while (list.length > 0){
                    var childAddToStage = list.shift();
                    childAddToStage.dispatchEventWith(Event.REMOVED_FROM_STAGE);
                }
            }
            child._parentChanged(null);
            locChildren.splice(index, 1);
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
                egret.Logger.fatal("提供的索引超出范围");
                return null;
            }
        }

        /**
         * 确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身。搜索包括整个显示列表（其中包括此 DisplayObjectContainer 实例）。孙项、曾孙项等，每项都返回 true。
		 * @method egret.DisplayObjectContainer#contains
         * @param child {egret.DisplayObject} 要测试的子对象。
		 * @returns {boolean} 如果指定的显示对象为DisplayObjectContainer该实例本身，则返回true，如果指定的显示对象为当前实例子项，则返回false。
         */
        public contains(child:DisplayObject):boolean{
            while (child){
                if (child == this){
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
        public swapChildrenAt(index1:number, index2:number):void{
            if (index1 >= 0 && index1 < this._children.length&&index2>=0&&index2<this._children.length) {
                this._swapChildrenAt(index1,index2);
            }
            else {
                egret.Logger.fatal("提供的索引超出范围");
            }

        }

		/**
         * 交换两个指定子对象的 Z 轴顺序（从前到后顺序）。显示对象容器中所有其他子对象的索引位置保持不变。
		 * @method egret.DisplayObjectContainer#swapChildren
		 * @param child1 {egret.DisplayObject} 第一个子对象。
		 * @param child2 {egret.DisplayObject} 第二个子对象。
		 */
        public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
            var index1:number = this._children.indexOf(child1);
            var index2:number = this._children.indexOf(child2);
            if (index1 == -1||index2==-1) {
                egret.Logger.fatal("child未被addChild到该parent");
            }
            else {
                this._swapChildrenAt(index1,index2);
            }
        }

        private _swapChildrenAt(index1:number, index2:number):void{
            if(index1 == index2){
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
        public removeChildren() {
            var locChildren = this._children;
            for(var i:number=locChildren.length-1;i>=0;i--)
            {
                this._doRemoveChild(i);
            }
        }

        public _updateTransform():void {
            if (!this.visible) {
                return;
            }
            super._updateTransform();
            for (var i = 0 , length = this._children.length; i < length; i++) {
                var child:DisplayObject = this._children[i];
                child._updateTransform();
            }
        }

        public _render(renderContext:RendererContext):void {
            for (var i = 0 , length = this._children.length; i < length; i++) {
                var child:DisplayObject = this._children[i];
                child._draw(renderContext);
            }
        }


        /**
         * @see egret.DisplayObject._measureBounds
         * @returns {null}
         * @private
         */
        public _measureBounds():egret.Rectangle {

            var minX = 0, maxX = 0, minY = 0, maxY = 0;
            var l = this._children.length;
            for (var i = 0; i < l; i++) {
                var child = this._children[i];
                var bounds:Rectangle;
                if (!child.visible || !(bounds = DisplayObject.getTransformBounds(child._getSize(Rectangle.identity), child._getMatrix()))) {
                    continue;
                }
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
		 * @method egret.DisplayObjectContainer#hitTest
         * @see egret.DisplayObject.hitTest
         * @param x {number} 
         * @param y {number} 
		 * @param ignoreTouchEnabled {boolean} 
		 * @returns {egret.DisplayObject}
         */
        public hitTest(x:number, y:number, ignoreTouchEnabled:boolean = false):DisplayObject{
            var result:DisplayObject;
            if (!this.visible) {
                return null;
            }
            if (this._scrollRect) {
                if (x > this._scrollRect.width
                    || y > this._scrollRect.height) {
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
            var touchChildren = this._touchChildren;//这里不用考虑父级的touchChildren，从父级调用下来过程中已经判断过了。
            for (var i = l - 1; i >= 0; i--) {
                var child = children[i];
                var o = child;
                var offsetPoint = o._getOffsetPoint();
                var childX = o._x;
                var childY = o._y;
                if(this._scrollRect)
                {
                    childX -= this._scrollRect.x;
                    childY -= this._scrollRect.y;
                }
                var mtx = Matrix.identity.identity().prependTransform(childX, childY, o._scaleX, o._scaleY, o._rotation,
                    0, 0, offsetPoint.x, offsetPoint.y);
                mtx.invert();
                var point = Matrix.transformCoords(mtx, x, y);
                var childHitTestResult = child.hitTest(point.x, point.y, true);
                if (childHitTestResult) {
                    if (childHitTestResult._touchEnabled && touchChildren) {
                        return childHitTestResult;
                    }
                    else if (this._touchEnabled) {
                        return this;
                    }
                    if (result == null) {
                        result = childHitTestResult;
                    }
                }
            }
            if(!result){
                    return super.hitTest(x,y,ignoreTouchEnabled);
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

        /**
         * 返回具有指定名称的子显示对象。
         * @method egret.DisplayObjectContainer#getChildByName
         * @param name {string} 要返回的子项的名称。
         * @returns {egret.DisplayObject} 具有指定名称的子显示对象。
         */
        public getChildByName(name:string):DisplayObject{
            var locChildren = this._children;
            var count:number = this.numChildren;
            var displayObject:DisplayObject;
            for(var i:number = 0 ; i < count ; i++ ){
                displayObject = locChildren[i];
                if(displayObject.name == name){
                    return displayObject;
                }
            }
            return null;
        }
    }
}
