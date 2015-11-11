//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

module egret {
    /**
     * @language en_US
     * The DisplayObjectContainer class is a basic display list building block: a display list node that can contain children.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObjectContainer.ts
     */
    /**
     * @language zh_CN
     * DisplayObjectContainer 类是基本显示列表构造块：一个可包含子项的显示列表节点。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/DisplayObjectContainer.ts
     */
    export class DisplayObjectContainer extends DisplayObject {

        /**
         * @private
         */
        static $EVENT_ADD_TO_STAGE_LIST:DisplayObject[] = [];
        /**
         * @private
         */
        static $EVENT_REMOVE_FROM_STAGE_LIST:DisplayObject[] = [];

        /**
         * @language en_US
         * Creates a new DisplayObjectContainer instance.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 实例化一个容器
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$children = [];
        }

        /**
         * @private
         */
        $propagateFlagsDown(flags:sys.DisplayObjectFlags) {
            if (this.$hasFlags(flags)) {
                return;
            }
            this.$setFlags(flags);
            var children = this.$children;
            for (var i = 0; i < children.length; i++) {
                children[i].$propagateFlagsDown(flags);
            }
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get numChildren():number {
            return this.$children.length;
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public addChild(child:DisplayObject):DisplayObject {
            var index:number = this.$children.length;

            if (child.$parent == this)
                index--;

            return this.$doAddChild(child, index);
        }


        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length;
                if (child.$parent == this) {
                    index--;
                }
            }
            return this.$doAddChild(child, index);
        }

        /**
         * @private
         */
        $doAddChild(child:DisplayObject, index:number, notifyListeners:boolean = true):DisplayObject {
            if (DEBUG) {
                if (child == this) {
                    $error(1005);
                }
                else if ((child instanceof egret.DisplayObjectContainer) && (<DisplayObjectContainer>child).contains(this)) {
                    $error(1004);
                }
            }

            var host:DisplayObjectContainer = child.$parent;
            if (host == this) {
                this.doSetChildIndex(child, index);
                return child;
            }

            if (host) {
                host.removeChild(child);
            }

            this.$children.splice(index, 0, child);
            child.$setParent(this);
            var stage:Stage = this.$stage;
            if (stage) {//当前容器在舞台
                child.$onAddToStage(stage, this.$nestLevel + 1);

            }
            if (notifyListeners) {
                child.dispatchEventWith(Event.ADDED, true);
            }
            if (stage) {
                var list = DisplayObjectContainer.$EVENT_ADD_TO_STAGE_LIST;
                while (list.length) {
                    var childAddToStage = list.shift();
                    if (childAddToStage.$stage && notifyListeners) {
                        childAddToStage.dispatchEventWith(Event.ADDED_TO_STAGE);
                    }
                }
            }
            var displayList = this.$displayList || this.$parentDisplayList;
            this.assignParentDisplayList(child, displayList, displayList);
            child.$propagateFlagsDown(sys.DisplayObjectFlags.DownOnAddedOrRemoved);
            this.$propagateFlagsUp(sys.DisplayObjectFlags.InvalidBounds);
            this.$childAdded(child, index);
            return child;
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public contains(child:DisplayObject):boolean {
            while (child) {
                if (child == this) {
                    return true;
                }
                child = child.$parent;
            }
            return false;
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getChildAt(index:number):DisplayObject {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$children[index];
            }
            else {
                DEBUG && $error(1007);
                return null;
            }
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getChildIndex(child:egret.DisplayObject):number {
            return this.$children.indexOf(child);
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public getChildByName(name:string):DisplayObject {
            var children = this.$children;
            var length = children.length;
            var displayObject:DisplayObject;
            for (var i = 0; i < length; i++) {
                displayObject = children[i];
                if (displayObject.name == name) {
                    return displayObject;
                }
            }
            return null;
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeChild(child:DisplayObject):DisplayObject {
            var index = this.$children.indexOf(child);
            if (index >= 0) {
                return this.$doRemoveChild(index);
            }
            else {
                DEBUG && $error(1006);
                return null;
            }
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeChildAt(index:number):DisplayObject {
            index = +index | 0;
            if (index >= 0 && index < this.$children.length) {
                return this.$doRemoveChild(index);
            }
            else {
                DEBUG && $error(1007);
                return null;
            }
        }

        /**
         * @private
         */
        $doRemoveChild(index:number, notifyListeners:boolean = true):DisplayObject {
            index = +index | 0;
            var children = this.$children;
            var child:DisplayObject = children[index];
            this.$childRemoved(child, index);
            if (notifyListeners) {
                child.dispatchEventWith(Event.REMOVED, true);
            }
            if (this.$stage) {//在舞台上
                child.$onRemoveFromStage();
                var list = DisplayObjectContainer.$EVENT_REMOVE_FROM_STAGE_LIST
                while (list.length > 0) {
                    var childAddToStage = list.shift();
                    if (notifyListeners) {
                        childAddToStage.dispatchEventWith(Event.REMOVED_FROM_STAGE);
                    }
                    childAddToStage.$stage = null;
                }
            }
            var displayList = this.$displayList || this.$parentDisplayList;
            this.assignParentDisplayList(child, displayList, null);
            child.$propagateFlagsDown(sys.DisplayObjectFlags.DownOnAddedOrRemoved);
            child.$setParent(null);
            var indexNow = children.indexOf(child);
            children.splice(indexNow, 1);
            this.$propagateFlagsUp(sys.DisplayObjectFlags.InvalidBounds);
            return child;
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setChildIndex(child:DisplayObject, index:number):void {
            index = +index | 0;
            if (index < 0 || index >= this.$children.length) {
                index = this.$children.length - 1;
            }
            this.doSetChildIndex(child, index);
        }

        /**
         * @private
         */
        private doSetChildIndex(child:DisplayObject, index:number):void {
            var lastIndex = this.$children.indexOf(child);
            if (lastIndex < 0) {
                DEBUG && $error(1006);
            }
            if (lastIndex == index) {
                return;
            }
            this.$childRemoved(child, lastIndex);
            //从原来的位置删除
            this.$children.splice(lastIndex, 1);
            //放到新的位置
            this.$children.splice(index, 0, child);
            this.$childAdded(child, index);
            child.$invalidateTransform();
            this.$propagateFlagsUp(sys.DisplayObjectFlags.InvalidBounds);
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public swapChildrenAt(index1:number, index2:number):void {
            index1 = +index1 | 0;
            index2 = +index2 | 0;
            if (index1 >= 0 && index1 < this.$children.length && index2 >= 0 && index2 < this.$children.length) {
                this.doSwapChildrenAt(index1, index2);
            }
            else {
                DEBUG && $error(1007);
            }

        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public swapChildren(child1:DisplayObject, child2:DisplayObject):void {
            var index1 = this.$children.indexOf(child1);
            var index2 = this.$children.indexOf(child2);
            if (index1 == -1 || index2 == -1) {
                DEBUG && $error(1006);
            }
            else {
                this.doSwapChildrenAt(index1, index2);
            }
        }

        /**
         * @private
         */
        private doSwapChildrenAt(index1:number, index2:number):void {
            if (index1 > index2) {
                var temp = index2;
                index2 = index1;
                index1 = temp;
            }
            else if (index1 == index2) {
                return;
            }
            var list:Array<DisplayObject> = this.$children;
            var child1:DisplayObject = list[index1];
            var child2:DisplayObject = list[index2];
            this.$childRemoved(child1, index1);
            this.$childRemoved(child2, index2);
            list[index1] = child2;
            list[index2] = child1;
            this.$childAdded(child2, index1);
            this.$childAdded(child1, index2);
            child1.$invalidateTransform();
            child2.$invalidateTransform();
            this.$propagateFlagsUp(sys.DisplayObjectFlags.InvalidBounds);
        }

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public removeChildren():void {
            var children = this.$children;
            for (var i:number = children.length - 1; i >= 0; i--) {
                this.$doRemoveChild(i);
            }
        }

        /**
         * @private
         * 一个子项被添加到容器内，此方法不仅在操作addChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        $childAdded(child:DisplayObject, index:number):void {

        }

        /**
         * @private
         * 一个子项从容器内移除，此方法不仅在操作removeChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        $childRemoved(child:DisplayObject, index:number):void {

        }

        /**
         * @private
         */
        $onAddToStage(stage:Stage, nestLevel:number):void {
            super.$onAddToStage(stage, nestLevel);
            var children = this.$children;
            var length = children.length;
            nestLevel++;
            for (var i = 0; i < length; i++) {
                var child:DisplayObject = this.$children[i];
                child.$onAddToStage(stage, nestLevel);
            }
        }

        /**
         * @private
         *
         */
        $onRemoveFromStage():void {
            super.$onRemoveFromStage();
            var children = this.$children;
            var length = children.length;
            for (var i = 0; i < length; i++) {
                var child:DisplayObject = children[i];
                child.$onRemoveFromStage();
            }
        }


        /**
         * @private
         */
        $measureChildBounds(bounds:Rectangle):void {
            var children = this.$children;
            var length = children.length;
            if (length == 0) {
                return;
            }
            var xMin = 0, xMax = 0, yMin = 0, yMax = 0;
            var found:boolean = false;
            for (var i = -1; i < length; i++) {
                var childBounds = i == -1 ? bounds : children[i].$getTransformedBounds(this, $TempRectangle);
                if (childBounds.isEmpty()) {
                    continue;
                }
                if (found) {
                    xMin = Math.min(xMin, childBounds.x)
                    xMax = Math.max(xMax, childBounds.x + childBounds.width);
                    yMin = Math.min(yMin, childBounds.y);
                    yMax = Math.max(yMax, childBounds.y + childBounds.height);
                }
                else {
                    found = true;
                    xMin = childBounds.x;
                    xMax = xMin + childBounds.width;
                    yMin = childBounds.y;
                    yMax = yMin + childBounds.height;
                }
            }
            bounds.setTo(xMin, yMin, xMax - xMin, yMax - yMin);
        }

        $touchChildren:boolean = true;

        /**
         * @inheritDoc
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get touchChildren():boolean {
            return this.$getTouchChildren();
        }

        /**
         * @private
         *
         * @returns
         */
        $getTouchChildren():boolean {
            return this.$touchChildren;
        }

        public set touchChildren(value:boolean) {
            this.$setTouchChildren(!!value);
        }

        /**
         * @private
         */
        $setTouchChildren(value:boolean):boolean {
            if (this.$touchChildren == value) {
                return false;
            }
            this.$touchChildren = value;
            return true;
        }

        /**
         * @private
         * 标记此显示对象需要重绘。此方法会触发自身的cacheAsBitmap重绘。如果只是矩阵改变，自身显示内容并不改变，应该调用$invalidateTransform().
         * @param notiryChildren 是否标记子项也需要重绘。传入false或不传入，将只标记自身需要重绘。通常只有alpha属性改变会需要通知子项重绘。
         */
        $invalidate(notifyChildren?:boolean):void {
            super.$invalidate(notifyChildren);
            if (!notifyChildren) {
                return;
            }
            var cacheRoot = this.$displayList || this.$parentDisplayList;
            var children = this.$children;
            if (children) {
                for (var i = children.length - 1; i >= 0; i--) {
                    this.markChildDirty(children[i], cacheRoot);
                }
            }
        }

        /**
         * @private
         * 标记自身以及所有子项在父级中变换叠加的显示内容失效。此方法不会触发自身的cacheAsBitmap重绘。
         * 通常用于矩阵改变或从显示列表添加和移除时。若自身的显示内容已经改变需要重绘，应该调用$invalidate()。
         */
        $invalidateTransform():void {
            this.markChildDirty(this, this.$parentDisplayList);
        }

        /**
         * @private
         */
        private markChildDirty(child:DisplayObject, parentCache:egret.sys.DisplayList):void {
            if (child.$hasFlags(sys.DisplayObjectFlags.DirtyChildren)) {
                return;
            }
            child.$setFlags(sys.DisplayObjectFlags.DirtyChildren);
            var displayList = child.$displayList;
            if ((displayList || child.$renderRegion) && parentCache) {
                parentCache.markDirty(displayList || child);
            }
            if (displayList) {
                return;
            }
            var children = child.$children;
            if (children) {
                for (var i = children.length - 1; i >= 0; i--) {
                    this.markChildDirty(children[i], parentCache);
                }
            }
        }

        /**
         * @private
         */
        $cacheAsBitmapChanged():void {
            super.$cacheAsBitmapChanged();
            var cacheRoot = this.$displayList || this.$parentDisplayList;
            var children = this.$children;
            for (var i = children.length - 1; i >= 0; i--) {
                this.assignParentDisplayList(children[i], cacheRoot, cacheRoot);
            }
        }

        /**
         * @private
         */
        private assignParentDisplayList(child:DisplayObject, parentCache:egret.sys.DisplayList, newParent:egret.sys.DisplayList):void {
            child.$parentDisplayList = newParent;
            child.$setFlags(sys.DisplayObjectFlags.DirtyChildren);
            var displayList = child.$displayList;
            if ((child.$renderRegion || displayList) && parentCache) {
                parentCache.markDirty(displayList || child);
            }
            if (displayList) {
                return;
            }
            var children = child.$children;
            if (children) {
                for (var i = children.length - 1; i >= 0; i--) {
                    this.assignParentDisplayList(children[i], parentCache, newParent);
                }
            }
        }

        /**
         * @private
         */
        $hitTest(stageX:number, stageY:number):DisplayObject {
            if (!this.$visible) {
                return null;
            }
            var m = this.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;

            var rect = this.$scrollRect ? this.$scrollRect : this.$maskRect;
            if (rect && !rect.contains(localX, localY)) {
                return null;
            }

            if (this.$mask && !this.$mask.$hitTest(stageX, stageY)) {
                return null
            }
            var children = this.$children;
            var found = false;
            for (var i = children.length - 1; i >= 0; i--) {
                var child = children[i];
                if (child.$maskedObject) {
                    continue;
                }
                var target = child.$hitTest(stageX, stageY);
                if (target) {
                    found = true;
                    if (target.$touchEnabled) {
                        break;
                    }
                    else {
                        target = null;
                    }
                }
            }
            if (target) {
                if (this.$touchChildren) {
                    return target;
                }
                return this;
            }
            if (found) {
                return this;
            }
            return super.$hitTest(stageX, stageY);
        }

    }

    if (DEBUG) {
        egret.$markReadOnly(DisplayObjectContainer, "numChildren");
    }
}