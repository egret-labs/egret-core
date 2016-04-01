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


module eui {

    /**
     * @language en_US
     * An ViewStack navigator container consists of a collection of child
     * containers stacked on top of each other, where only one child
     * at a time is visible.
     * When a different child container is selected, it seems to replace
     * the old one because it appears in the same location.
     * However, the old child container still exists; it is just invisible.
     *
     * @event eui.CollectionEvent.COLLECTION_CHANGE Dispatched when the ICollection has been updated in some way.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ViewStackExample.ts
     */
    /**
     * @language zh_CN
     * ViewStack 导航器容器由一组彼此上下堆叠的子容器组成，其中一次只可以显示一个子容器。
     * 选择另一个子容器后，它将显示在原来子容器的位置处，所以看起来好像此子容器替换了原来的子容器。
     * 但是，原来的子容器仍然存在，只不过它现在处于不可见状态。
     *
     * @event eui.CollectionEvent.COLLECTION_CHANGE 以某种方式更新 ICollection 后分派。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample  extension/eui/components/ViewStackExample.ts
     */
    export class ViewStack extends Group implements ICollection {
        /**
         * @language en_US
         * Constructor.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
        }

        /**
         * @language en_US
         * The layout object for this container.
         * This object is responsible for the measurement and layout of
         * the visual elements in the container.
         *
         * @default eui.BasicLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 此容器的 layout 对象。此对象负责容器中可视元素的测量和布局。
         *
         * @default eui.BasicLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get layout():LayoutBase {
            return this.$layout;
        }

        /**
         * @private
         */
        private _selectedChild:egret.DisplayObject = null;
        /**
         * @language en_US
         * A reference to the currently visible child container.
         * The default is a reference to the first child.
         * If there are no children, this property is <code>null</code>.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对当前可见子容器的引用。默认设置为对第一个子容器的引用。如果没有子项，则此属性为 <code>null</code>。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selectedChild():egret.DisplayObject {
            var index = this.selectedIndex;
            if (index >= 0 && index < this.numChildren)
                return this.getChildAt(index);
            return null;
        }

        public set selectedChild(value:egret.DisplayObject) {
            var index = this.getChildIndex(value);
            if (index >= 0 && index < this.numChildren)
                this.setSelectedIndex(index);
        }

        /**
         * @private
         * 在属性提交前缓存选中项索引
         */
        private proposedSelectedIndex:number = ListBase.NO_PROPOSED_SELECTION;

        /**
         * @private
         */
        public _selectedIndex:number = -1;
        /**
         * @language en_US
         * The zero-based index of the currently visible child container.
         * Child indexes are in the range 0, 1, 2, ..., n - 1,
         * where <code>n</code> is the number of children.
         * The default value is 0, corresponding to the first child.
         * If there are no children, the value of this property is <code>-1</code>.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前可见子容器的从零开始的索引。子索引的范围是 0、1、2、...、n - 1，其中 <code>n</code> 是子项的数目。
         * 默认值是 0，对应于第一个子项。如果不存在子容器，则此属性的值为 -1。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selectedIndex():number {
            return this.proposedSelectedIndex != ListBase.NO_PROPOSED_SELECTION ? this.proposedSelectedIndex : this._selectedIndex;
        }

        public set selectedIndex(value:number) {
            value = +value|0;
            this.setSelectedIndex(value);
        }

        /**
         * @private
         * 设置选中项索引
         */
        private setSelectedIndex(value:number):void {
            if (value == this.selectedIndex) {
                return;
            }
            this.proposedSelectedIndex = value;
            this.invalidateProperties();
            PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedIndex");
        }

        /**
         * @private
         * 一个子项被添加到容器内，此方法不仅在操作addChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        $childAdded(child:egret.DisplayObject, index:number):void {
            super.$childAdded(child, index);
            this.showOrHide(child, false);
            var selectedIndex = this.selectedIndex;
            if (selectedIndex == -1) {
                this.setSelectedIndex(index);
            }
            else if (index <= this.selectedIndex && this.$stage) {
                this.setSelectedIndex(selectedIndex + 1);
            }
            CollectionEvent.dispatchCollectionEvent(this, CollectionEvent.COLLECTION_CHANGE,
                CollectionEventKind.ADD, index, -1, [child.name]);
        }

        /**
         * @private
         * 一个子项从容器内移除，此方法不仅在操作removeChild()时会被回调，在操作setChildIndex()或swapChildren时也会回调。
         * 当子项索引发生改变时，会先触发$childRemoved()方法，然后触发$childAdded()方法。
         */
        $childRemoved(child:egret.DisplayObject, index:number):void {
            super.$childRemoved(child, index);
            this.showOrHide(child, true);
            var selectedIndex = this.selectedIndex;
            if (index == selectedIndex) {
                if (this.numChildren > 0) {
                    if (index == 0) {
                        this.proposedSelectedIndex = 0;
                        this.invalidateProperties();
                    }
                    else
                        this.setSelectedIndex(0);
                }
                else
                    this.setSelectedIndex(-1);
            }
            else if (index < selectedIndex) {
                this.setSelectedIndex(selectedIndex - 1);
            }
            CollectionEvent.dispatchCollectionEvent(this, CollectionEvent.COLLECTION_CHANGE,
                CollectionEventKind.REMOVE, index, -1, [child.name]);
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            super.commitProperties();
            if (this.proposedSelectedIndex != ListBase.NO_PROPOSED_SELECTION) {
                this.commitSelection(this.proposedSelectedIndex);
                this.proposedSelectedIndex = ListBase.NO_PROPOSED_SELECTION;
            }
        }

        /**
         * @private
         * 
         * @param newIndex 
         */
        private commitSelection(newIndex:number):void {
            if (newIndex >= 0 && newIndex < this.numChildren) {
                this._selectedIndex = newIndex;
                if (this._selectedChild) {
                    this.showOrHide(this._selectedChild, false);
                }
                this._selectedChild = this.getElementAt(this._selectedIndex);
                this.showOrHide(this._selectedChild, true);
            }
            else {
                this._selectedChild = null;
                this._selectedIndex = -1;
            }
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * @private
         * 
         * @param child 
         * @param visible 
         */
        private showOrHide(child:egret.DisplayObject, visible:boolean):void {
            if (egret.is(child, "eui.UIComponent")) {
                (<eui.UIComponent><any>child).includeInLayout = visible;
            }
            child.visible = visible;
        }

        /**
         * @language en_US
         * number of children
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 子项数量
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get length():number {
            return this.$children.length;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getItemAt(index:number):any {
            var element:egret.DisplayObject = this.$children[index];
            return element ? element.name : "";
        }

        /**
         * @inheritDoc
         * 
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getItemIndex(item:any):number {
            var list = this.$children;
            var length = list.length;
            for (var i = 0; i < length; i++) {
                if (list[i].name == item) {
                    return i;
                }
            }
            return -1;
        }
    }

    registerBindable(ViewStack.prototype,"selectedIndex");

    if(DEBUG){
        egret.$markReadOnly(ViewStack,"length");
        egret.$markReadOnly(ViewStack,"layout");
    }
}