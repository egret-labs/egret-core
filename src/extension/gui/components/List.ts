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


module egret.gui {

    /**
     * @class egret.gui.List
     * @classdesc
     * 列表组件
     * @extends egret.gui.ListBase
     */
    export class List extends ListBase {
        public constructor() {
            super();

            this.useVirtualLayout = true;
        }

        /**
         * 创建容器的子元素
         */
        public createChildren():void {
            if (!this.itemRenderer)
                this.itemRenderer = DataGroup.defaultRendererFactory;
            super.createChildren();
        }

        /**
         * 是否使用虚拟布局,默认true
         * @member egret.gui.List#useVirtualLayout
         */
        public get useVirtualLayout():boolean {
            return this._getUseVirtualLayout();
        }

        /**
         * @inheritDoc
         */
        public set useVirtualLayout(value:boolean) {
            this._setUseVirtualLayout(value);
        }


        private _allowMultipleSelection:boolean = false;
        /**
         * 是否允许同时选中多项
         * @member egret.gui.List#allowMultipleSelection
         */
        public get allowMultipleSelection():boolean {
            return this._allowMultipleSelection;
        }

        public set allowMultipleSelection(value:boolean) {
            this._allowMultipleSelection = value;
        }

        private _selectedIndices:Array<number> = [];

        private _proposedSelectedIndices:Array<number>;

        /**
         * 当前选中的一个或多个项目的索引列表
         * @member egret.gui.List#selectedIndices
         */
        public get selectedIndices():Array<number> {
            if (this._proposedSelectedIndices)
                return this._proposedSelectedIndices;
            return this._selectedIndices;
        }

        public set selectedIndices(value:Array<number>) {
            this._setSelectedIndices(value, false);
        }

        /**
         * @member egret.gui.List#selectedIndex
         */
        public get selectedIndex():number {
            if (this._proposedSelectedIndices) {
                if (this._proposedSelectedIndices.length > 0)
                    return this._proposedSelectedIndices[0];
                return -1;
            }
            return this._getSelectedIndex();
        }

        public set selectedIndex(value:number) {
            this._setSelectedIndex(value);
        }

        /**
         * 当前选中的一个或多个项目的数据源列表
         * @member egret.gui.List#selectedItems
         */
        public get selectedItems():Array<Object> {
            var result:Array<Object> = [];
            var list:Array<number> = this.selectedIndices;
            if (list) {
                var count:number = list.length;

                for (var i:number = 0; i < count; i++)
                    result[i] = this.dataProvider.getItemAt(list[i]);
            }

            return result;
        }

        public set selectedItems(value:Array<Object>) {
            var indices:Array<number> = [];

            if (value) {
                var count:number = value.length;

                for (var i:number = 0; i < count; i++) {
                    var index:number = this.dataProvider.getItemIndex(value[i]);
                    if (index != -1) {
                        indices.splice(0, 0, index);
                    }
                    if (index == -1) {
                        indices = [];
                        break;
                    }
                }
            }
            this._setSelectedIndices(indices, false);
        }

        /**
         * 设置多个选中项
         */
        public _setSelectedIndices(value:Array<number>, dispatchChangeEvent:boolean = false):void {
            if (dispatchChangeEvent)
                this._dispatchChangeAfterSelection = (this._dispatchChangeAfterSelection || dispatchChangeEvent);

            if (value)
                this._proposedSelectedIndices = value;
            else
                this._proposedSelectedIndices = [];
            this.invalidateProperties();
        }

        /**
         * 处理对组件设置的属性
         * @method egret.gui.List#commitProperties
         */
        public commitProperties():void {
            super.commitProperties();
            if (this._proposedSelectedIndices) {
                this.commitSelection();
            }
        }

        /**
         * @method egret.gui.List#commitSelection
         * @param dispatchChangedEvents {boolean}
         * @returns {boolean}
         */
        public commitSelection(dispatchChangedEvents:boolean = true):boolean {
            var oldSelectedIndex:number = this._selectedIndex;
            if (this._proposedSelectedIndices) {
                this._proposedSelectedIndices = this._proposedSelectedIndices.filter(this.isValidIndex);

                if (!this.allowMultipleSelection && this._proposedSelectedIndices.length > 0) {
                    var temp:Array<number> = [];
                    temp.push(this._proposedSelectedIndices[0]);
                    this._proposedSelectedIndices = temp;
                }
                if (this._proposedSelectedIndices.length > 0) {
                    this._proposedSelectedIndex = this._proposedSelectedIndices[0];
                }
                else {
                    this._proposedSelectedIndex = -1;
                }
            }

            var retVal:boolean = super.commitSelection(false);

            if (!retVal) {
                this._proposedSelectedIndices = null;
                return false;
            }

            if (this.selectedIndex > ListBase.NO_SELECTION) {
                if (this._proposedSelectedIndices) {
                    if (this._proposedSelectedIndices.indexOf(this.selectedIndex) == -1)
                        this._proposedSelectedIndices.push(this.selectedIndex);
                }
                else {
                    this._proposedSelectedIndices = [this.selectedIndex];
                }
            }

            if (this._proposedSelectedIndices) {
                if (this._proposedSelectedIndices.indexOf(oldSelectedIndex) != -1)
                    this.itemSelected(oldSelectedIndex, true);
                this.commitMultipleSelection();
            }

            if (dispatchChangedEvents && retVal) {
                if (this._dispatchChangeAfterSelection) {
                    IndexChangeEvent.dispatchIndexChangeEvent(this,
                        IndexChangeEvent.CHANGE, oldSelectedIndex, this._selectedIndex)
                    this._dispatchChangeAfterSelection = false;
                }
                UIEvent.dispatchUIEvent(this, UIEvent.VALUE_COMMIT);
            }

            return retVal;
        }

        /**
         * 是否是有效的索引
         */
        private isValidIndex = (item:number, index:number, v:Array<number>):boolean => {
            return this.dataProvider && (item >= 0) && (item < this.dataProvider.length);
        }

        /**
         * 提交多项选中项属性
         */
        public commitMultipleSelection():void {
            var removedItems:Array<number> = [];
            var addedItems:Array<number> = [];
            var i:number;
            var count:number;

            if (this._selectedIndices.length > 0 && this._proposedSelectedIndices.length > 0) {
                count = this._proposedSelectedIndices.length;
                for (i = 0; i < count; i++) {
                    if (this._selectedIndices.indexOf(this._proposedSelectedIndices[i]) == -1)
                        addedItems.push(this._proposedSelectedIndices[i]);
                }
                count = this._selectedIndices.length;
                for (i = 0; i < count; i++) {
                    if (this._proposedSelectedIndices.indexOf(this._selectedIndices[i]) == -1)
                        removedItems.push(this._selectedIndices[i]);
                }
            }
            else if (this._selectedIndices.length > 0) {
                removedItems = this._selectedIndices;
            }
            else if (this._proposedSelectedIndices.length > 0) {
                addedItems = this._proposedSelectedIndices;
            }

            this._selectedIndices = this._proposedSelectedIndices;

            if (removedItems.length > 0) {
                count = removedItems.length;
                for (i = 0; i < count; i++) {
                    this.itemSelected(removedItems[i], false);
                }
            }

            if (addedItems.length > 0) {
                count = addedItems.length;
                for (i = 0; i < count; i++) {
                    this.itemSelected(addedItems[i], true);
                }
            }

            this._proposedSelectedIndices = null;
        }

        /**
         *
         * @param index
         * @returns {boolean}
         * @private
         */
        public _isItemIndexSelected(index:number):boolean {
            if (this._allowMultipleSelection)
                return this._selectedIndices.indexOf(index) != -1;

            return super._isItemIndexSelected(index);
        }

        public dataGroup_rendererAddHandler(event:RendererExistenceEvent):void {
            super.dataGroup_rendererAddHandler(event);

            var renderer:DisplayObject = <DisplayObject><any> (event.renderer);
            if (renderer == null)
                return;

            renderer.addEventListener(TouchEvent.TOUCH_BEGIN, this._item_touchBeginHandler, this);
            //由于ItemRenderer.mouseChildren有可能不为false，在鼠标按下时会出现切换素材的情况，
            //导致target变化而无法抛出原生的click事件,所以此处监听MouseUp来抛出ItemClick事件。
            renderer.addEventListener(TouchEvent.TOUCH_END, this._item_touchEndHandler, this);
        }

        /**
         * 数据源发生刷新
         */
        public dataProviderRefreshed():void {
            if (this._allowMultipleSelection) {
                return;
            }
            super.dataProviderRefreshed();
        }

        public dataGroup_rendererRemoveHandler(event:RendererExistenceEvent):void {
            super.dataGroup_rendererRemoveHandler(event);

            var renderer:DisplayObject = <DisplayObject><any> (event.renderer);
            if (renderer == null)
                return;

            renderer.removeEventListener(TouchEvent.TOUCH_BEGIN, this._item_touchBeginHandler, this);
            renderer.removeEventListener(TouchEvent.TOUCH_END, this._item_touchEndHandler, this);
        }

        /**
         * 是否捕获ItemRenderer以便在MouseUp时抛出ItemClick事件
         */
        public _captureItemRenderer:boolean = true;

        public _mouseDownItemRenderer:IItemRenderer = null;

        /**
         * 鼠标在项呈示器上按下
         * @method egret.gui.List#item_mouseDownHandler
         * @param event {TouchEvent}
         */
        public _item_touchBeginHandler(event:TouchEvent):void {
            if (event.$isDefaultPrevented)
                return;

            var itemRenderer:IItemRenderer = <IItemRenderer> (event.currentTarget);
            this._mouseDownItemRenderer = itemRenderer;
            UIGlobals.stage.addEventListener(TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
            UIGlobals.stage.addEventListener(Event.LEAVE_STAGE, this.stage_touchEndHandler, this);
        }

        /**
         * 计算当前的选中项列表
         */
        private calculateSelectedIndices(index:number):Array<number> {
            var interval:Array<number> = [];
            if (this._selectedIndices.length > 0) {
                if (this._selectedIndices.length == 1 && (this._selectedIndices[0] == index)) {
                    if (!this.requireSelection)
                        return interval;

                    interval.splice(0, 0, this._selectedIndices[0]);
                    return interval;
                }
                else {
                    var found:boolean = false;
                    for (var i = 0; i < this._selectedIndices.length; i++) {
                        if (this._selectedIndices[i] == index)
                            found = true;
                        else if (this._selectedIndices[i] != index)
                            interval.splice(0, 0, this._selectedIndices[i]);
                    }
                    if (!found) {
                        interval.splice(0, 0, index);
                    }
                    return interval;
                }
            }
            else {
                interval.splice(0, 0, index);
                return interval;
            }
        }

        /**
         * 鼠标在项呈示器上弹起，抛出ItemClick事件。
         */
        public _item_touchEndHandler(event:TouchEvent):void {
            var itemRenderer:IItemRenderer = <IItemRenderer> (event.currentTarget);
            if (itemRenderer != this._mouseDownItemRenderer)
                return;

            var newIndex:number;
            if (itemRenderer)
                newIndex = itemRenderer.itemIndex;
            else
                newIndex = this.dataGroup.getElementIndex(<IVisualElement> (event.currentTarget));

            if (this._allowMultipleSelection) {
                this._setSelectedIndices(this.calculateSelectedIndices(newIndex), true);
            }
            else {
                this._setSelectedIndex(newIndex, true);
            }
            if (!this._captureItemRenderer)
                return;
            this._dispatchListEvent(event, ListEvent.ITEM_CLICK, itemRenderer);
        }

        /**
         * 鼠标在舞台上弹起
         */
        private stage_touchEndHandler(event:Event):void {
            UIGlobals.stage.removeEventListener(TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
            UIGlobals.stage.removeEventListener(Event.LEAVE_STAGE, this.stage_touchEndHandler, this);
            this._mouseDownItemRenderer = null;
        }
    }
}