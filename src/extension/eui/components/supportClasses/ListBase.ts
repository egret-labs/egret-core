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

module eui.sys {

    /**
     * @private
     */
    export const enum ListBaseKeys {
        /**
         * @private
         */
        requireSelection,
        /**
         * @private
         */
        requireSelectionChanged,
        /**
         * @private
         */
        proposedSelectedIndex,
        /**
         * @private
         */
        selectedIndex,
        /**
         * @private
         */
        dispatchChangeAfterSelection,
        /**
         * @private
         */
        pendingSelectedItem,
        /**
         * @private
         */
        selectedIndexAdjusted,
        /**
         * @private
         */
        touchDownItemRenderer
    }
}

module eui {

    /**
     * @language en_US
     * The ListBase class is the base class for list component.
     * It can display items of list as vertical or horizontal such as SELECT of HTML.
     * @event egret.Event.CHANGE Dispatched after the selection has changed.
     * This event is dispatched when the user interacts with the control.
     * @event egret.Event.CHANGING Dispatched when the selection is going to change.
     * Calling the <code>preventDefault()</code> method
     * on the event prevents the selection from changing.<p/>
     * This event is dispatched when the user interacts with the control.
     *
     * @event eui.ItemTapEvent.ITEM_TAP dispatched when the user tap an item in the control.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * ListBase 是列表控件基类。可显示垂直或水平的项目列表。其功能与 HTML 中的 SELECT 表单元素的功能相似。
     * @event egret.Event.CHANGE 选中的索引已经发生改变,注意：此事件仅在索引改变是由用户触摸操作引起时才抛出。
     * @event egret.Event.CHANGING 选中的索引即将发生改变，可以通过调用事件对象的 preventDefault() 方法来阻止改变。<p/>
     * 注意：此事件仅在索引改变是由用户触摸操作引起时才抛出。
     *
     * @event eui.ItemTapEvent.ITEM_TAP 项呈示器单击事件。
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class ListBase extends DataGroup {

        /**
         * @language en_US
         * Constructor.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$ListBase = {
                0: false,       //requireSelection
                1: false,       //requireSelectionChanged
                2: -2,          //proposedSelectedIndex
                3: -1,          //selectedIndex
                4: false,       //dispatchChangeAfterSelection
                5: undefined,   //pendingSelectedItem
                6: false,       //selectedIndexAdjusted
                7: null,        //touchDownItemRenderer
            };
        }

        /**
         * @private
         */
        $ListBase:Object;
        /**
         * @language en_US
         * Static constant representing the value "no selection".
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 未选中任何项时的索引值
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static NO_SELECTION:number = -1;

        /**
         * @language en_US
         * Static constant representing no proposed selection.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 未设置缓存选中项的值
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static NO_PROPOSED_SELECTION:number = -2;

        /**
         * @language en_US
         * If <code>true</code>, a data item must always be selected in the control.
         * If the value is <code>true</code>, the <code>selectedIndex</code> property
         * is always set to a value between 0 and (<code>dataProvider.length</code> - 1).
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果为 true，则控件中必须含有选中的数据项目。
         * 如果该值为 true，则始终将 selectedIndex 属性设置为 0 和 (dataProvider.length - 1) 之间的一个值。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get requireSelection():boolean {
            return this.$ListBase[sys.ListBaseKeys.requireSelection];
        }

        public set requireSelection(value:boolean) {
            value = !!value;
            var values = this.$ListBase;
            if (value === values[sys.ListBaseKeys.requireSelection]) {
                return;
            }
            values[sys.ListBaseKeys.requireSelection] = value;
            if (value) {
                values[sys.ListBaseKeys.requireSelectionChanged] = true;
                this.invalidateProperties();
            }
        }

        /**
         * @language en_US
         * he 0-based index of the selected item, or -1 if no item is selected.
         * Setting the <code>selectedIndex</code> property deselects the currently selected
         * item and selects the data item at the specified index.<p/>
         *
         * The value is always between -1 and (<code>dataProvider.length</code> - 1).
         * If items at a lower index than <code>selectedIndex</code> are
         * removed from the component, the selected index is adjusted downward
         * accordingly. <p/>
         *
         * If the selected item is removed, the selected index is set to:<p/>
         *
         * <ul>
         *   <li>-1 if <code>requireSelection == false</code> or there are no remaining items.</li>
         *   <li>0 if <code>requireSelection == true</code> and there is at least one item.</li>
         * </ul><p/>
         *
         * When the user changes the <code>selectedIndex</code> property by interacting with the control,
         * the control dispatches the <code>change</code> and <code>changing</code> events.
         * When you change the value of the <code>selectedIndex</code> property programmatically,
         * it does not dispatches the <code>change</code> and <code>changing</code> events.</p>
         *
         * @default -1
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 选中项目的基于 0 的索引。
         * 或者如果未选中项目，则为-1。设置 selectedIndex 属性会取消选择当前选定的项目并选择指定索引位置的数据项目。<p/>
         *
         * 这个值会之中在-1到<code>(dataProvider.length - 1)</code>之间。如果从该组件中删除一个低于
         * <code>selectedIndex</code>的值，则<code>selectedIndex</code>也会相应的调节选定的索引。<p/>
         *
         * 如果删除的项为当前选中项，则该值会变为：<p/>
         *
         * <ul>
         *    <li>-1: 如果 <code>requireSelection == false</code> 或者已经没有剩余项目。</li>
         *    <li> 0: 如果 <code>requireSelection == true</code> 并且当前至少还有一个剩余项目。</li>
         * </ul><p/>
         * 当用户通过与控件交互来更改 selectedIndex 属性时，此控件将分派 change 和 changing 事件。
         * 当以编程方式更改 selectedIndex 属性的值时，此控件不分派 change 和 changing 事件。
         *
         * @default -1
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selectedIndex():number {
            return this.$getSelectedIndex();
        }

        /**
         * @private
         * 
         * @returns 
         */
        $getSelectedIndex():number {
            var values = this.$ListBase;
            if (values[sys.ListBaseKeys.proposedSelectedIndex] != ListBase.NO_PROPOSED_SELECTION)
                return values[sys.ListBaseKeys.proposedSelectedIndex];
            return values[sys.ListBaseKeys.selectedIndex];
        }

        public set selectedIndex(value:number) {
            value = +value | 0;
            this.setSelectedIndex(value, false);
        }

        /**
         * @language en_US
         * Used internally to specify whether the selectedIndex changed programmatically or due to
         * user interaction.
         * @param value the new index need to select.
         * @param dispatchChangeEvent if true, the component will dispatch a "change" event if the
         * value has changed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由程序或者用户设置选中项。
         * @param value 索引值。
         * @param dispatchChangeEvent 当索引值发生改变，且该参数为true的时候，组件派发出一个“change”事件。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setSelectedIndex(value:number, dispatchChangeEvent?:boolean):void {
            if (value == this.selectedIndex) {
                return;
            }
            var values = this.$ListBase;
            if (dispatchChangeEvent)
                values[sys.ListBaseKeys.dispatchChangeAfterSelection] =
                    (values[sys.ListBaseKeys.dispatchChangeAfterSelection] || dispatchChangeEvent);
            values[sys.ListBaseKeys.proposedSelectedIndex] = value;
            this.invalidateProperties();
        }


        /**
         * @language en_US
         * The item that is currently selected.
         * Setting this property deselects the currently selected
         * item and selects the newly specified item.<p/>
         *
         * Setting <code>selectedItem</code> to an item that is not
         * in this component results in no selection,
         * and <code>selectedItem</code> being set to <code>undefined</code>.<p/>
         *
         * If the selected item is removed, the selected item is set to:<p/>
         * <ul>
         *   <li><code>undefined</code> if <code>requireSelection == false</code>
         *     or there are no remaining items.</li>
         *   <li>The first item if <code>requireSelection</code> = <code>true</code>
         *     and there is at least one item.</li>
         * </ul><p/>
         *
         * When the user changes the <code>selectedItem</code> property by interacting with the control,
         * the control dispatches the <code>change</code> and <code>changing</code> events.
         * When you change the value of the <code>selectedIndex</code> property programmatically,
         * it does not dispatches the <code>change</code> and <code>changing</code> events.</p>
         *
         * @default undefined
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 当前已选中的项目。设置此属性会取消选中当前选定的项目并选择新指定的项目。<p/>
         *
         * 如果设置的<code>selectedItem</code>不在当前列表里那么<code>selectedItem</code>将被设置
         * 为<code>undefined</code>。<p/>
         *
         * 如果选择项目被移除，那选择项会被设置为：<p/>
         * <ul>
         *   <li><code>undefined</code>: 如果 <code>requireSelection == false</code>
         *     或者已经没有剩余项。</li>
         *   <li>第一项: 当 <code>requireSelection == true</code>
         *     并且列表中还至少存有一项.</li>
         * </ul><p/>
         *
         * 当用户通过与控件交互来更改 selectedItem 属性时，此控件将分派 change 和 changing 事件。
         * 当以编程方式更改 selectedItem 属性的值时，此控件不分派 change 和 changing 事件。<p/>
         *
         * @default undefined
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get selectedItem():any {
            var values = this.$ListBase;
            if (values[sys.ListBaseKeys.pendingSelectedItem] !== undefined)
                return values[sys.ListBaseKeys.pendingSelectedItem];

            var selectedIndex = this.$getSelectedIndex();
            if (selectedIndex == ListBase.NO_SELECTION || this.$dataProvider == null)
                return undefined;

            return this.$dataProvider.length > selectedIndex ? this.$dataProvider.getItemAt(selectedIndex) : undefined;
        }

        public set selectedItem(value:any) {
            this.setSelectedItem(value, false);
        }

        /**
         * @language en_US
         * Used internally to specify whether the selectedItem changed programmatically or due to
         * user interaction.
         * @param value the new item need to select.
         * @param dispatchChangeEvent if true, the component will dispatch a "change" event if the
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由程序或用户设置选中项数据源。
         * @param value 要选中的项。
         * @param dispatchChangeEvent 当索引值发生改变，且该参数为true的时候，组件派发出一个“change”事件。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected setSelectedItem(value:any, dispatchChangeEvent:boolean = false):void {
            if (this.selectedItem === value)
                return;

            var values = this.$ListBase;
            if (dispatchChangeEvent)
                values[sys.ListBaseKeys.dispatchChangeAfterSelection] =
                    (values[sys.ListBaseKeys.dispatchChangeAfterSelection] || dispatchChangeEvent);

            values[sys.ListBaseKeys.pendingSelectedItem] = value;
            this.invalidateProperties();
        }

        /**
         * @language en_US
         * Processes the properties set on the component.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 处理对组件设置的属性
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            var dataProviderChanged = this.$dataProviderChanged;
            super.commitProperties();

            var values = this.$ListBase;
            var selectedIndex = this.$getSelectedIndex();
            var dataProvider = this.$dataProvider;
            if (dataProviderChanged) {
                if (selectedIndex >= 0 && dataProvider && selectedIndex < dataProvider.length)
                    this.itemSelected(selectedIndex, true);
                else if (this.requireSelection)
                    values[sys.ListBaseKeys.proposedSelectedIndex] = 0;
                else
                    this.setSelectedIndex(-1, false);
            }

            if (values[sys.ListBaseKeys.requireSelectionChanged]) {
                values[sys.ListBaseKeys.requireSelectionChanged] = false;

                if (values[sys.ListBaseKeys.requireSelection] &&
                    selectedIndex == ListBase.NO_SELECTION &&
                    dataProvider &&
                    dataProvider.length > 0) {
                    values[sys.ListBaseKeys.proposedSelectedIndex] = 0;
                }
            }

            if (values[sys.ListBaseKeys.pendingSelectedItem] !== undefined) {
                if (dataProvider)
                    values[sys.ListBaseKeys.proposedSelectedIndex] =
                        dataProvider.getItemIndex(values[sys.ListBaseKeys.pendingSelectedItem]);
                else
                    values[sys.ListBaseKeys.proposedSelectedIndex] = ListBase.NO_SELECTION;

                values[sys.ListBaseKeys.pendingSelectedItem] = undefined;
            }

            var changedSelection = false;
            if (values[sys.ListBaseKeys.proposedSelectedIndex] != ListBase.NO_PROPOSED_SELECTION)
                changedSelection = this.commitSelection();

            if (values[sys.ListBaseKeys.selectedIndexAdjusted]) {
                values[sys.ListBaseKeys.selectedIndexAdjusted] = false;
                if (!changedSelection) {
                    PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedIndex");
                }
            }
        }

        /**
         * @language en_US
         * Updates an item renderer for use or reuse.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 更新项呈示器，以备使用或重用
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public updateRenderer(renderer:IItemRenderer, itemIndex:number, data:any):IItemRenderer {
            this.itemSelected(itemIndex, this.$isItemIndexSelected(itemIndex));
            return super.updateRenderer(renderer, itemIndex, data);
        }

        /**
         * @language en_US
         * Called when an item is selected or deselected.
         * Subclasses must override this method to display the selection.
         * @param index The item index that was selected.
         * @param selected <code>true</code> if the item is selected,
         * and <code>false</code> if it is deselected.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 选中或取消选中项目时调用。子类必须覆盖此方法才可设置选中项。
         * @param index 已选中的项目索引。
         * @param selected <code>true</code>为选中，<code>false</code>取消选中
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected itemSelected(index:number, selected:boolean):void {
            var renderer = this.$indexToRenderer[index];
            if (renderer) {
                renderer.selected = selected;
            }
        }

        /**
         * @private
         * 返回指定索引是否等于当前选中索引
         */
        $isItemIndexSelected(index:number):boolean {
            return index == this.selectedIndex;
        }

        /**
         * @language en_US
         * The selection validation and commitment workhorse method.
         * Called to commit the pending selected index. This method dispatches
         * the "changing" event, and if the event is not cancelled,
         * commits the selection change and then dispatches the "change"
         * event.
         * @param dispatchChangedEvents if dispatch a "changed" event.
         * @return true if the selection was committed, or false if the selection
         * was cancelled.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 提交选中项属性。该方法会派发一个“changing”事件，如果该事件没有被阻止，
         * 该方法将会提交选择项病根据参数派发“change”事件。
         * @param dispatchChangedEvents 是否派发一个“changed”事件。
         * @return true 表示提交成功, false表示被取消
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitSelection(dispatchChangedEvents:boolean = true):boolean {
            var dataProvider = this.$dataProvider;
            var values = this.$ListBase;
            var maxIndex = dataProvider ? dataProvider.length - 1 : -1;
            var oldSelectedIndex = values[sys.ListBaseKeys.selectedIndex];
            var tmpProposedIndex = values[sys.ListBaseKeys.proposedSelectedIndex];
            if (tmpProposedIndex < ListBase.NO_SELECTION)
                tmpProposedIndex = ListBase.NO_SELECTION;
            if (tmpProposedIndex > maxIndex)
                tmpProposedIndex = maxIndex;
            if (values[sys.ListBaseKeys.requireSelection] && tmpProposedIndex == ListBase.NO_SELECTION &&
                dataProvider && dataProvider.length > 0) {
                values[sys.ListBaseKeys.proposedSelectedIndex] = ListBase.NO_PROPOSED_SELECTION;
                values[sys.ListBaseKeys.dispatchChangeAfterSelection] = false;
                return false;
            }


            if (values[sys.ListBaseKeys.dispatchChangeAfterSelection]) {
                var result = this.dispatchEventWith(egret.Event.CHANGING, false, true);
                if (!result) {
                    this.itemSelected(values[sys.ListBaseKeys.proposedSelectedIndex], false);
                    values[sys.ListBaseKeys.proposedSelectedIndex] = ListBase.NO_PROPOSED_SELECTION;
                    values[sys.ListBaseKeys.dispatchChangeAfterSelection] = false;
                    return false;
                }

            }

            values[sys.ListBaseKeys.selectedIndex] = tmpProposedIndex;
            values[sys.ListBaseKeys.proposedSelectedIndex] = ListBase.NO_PROPOSED_SELECTION;

            if (oldSelectedIndex != ListBase.NO_SELECTION)
                this.itemSelected(oldSelectedIndex, false);
            if (values[sys.ListBaseKeys.selectedIndex] != ListBase.NO_SELECTION)
                this.itemSelected(values[sys.ListBaseKeys.selectedIndex], true);

            //子类若需要自身抛出Change事件，而不是在此处抛出，可以设置dispatchChangedEvents为false
            if (dispatchChangedEvents) {
                if (values[sys.ListBaseKeys.dispatchChangeAfterSelection]) {
                    this.dispatchEventWith(egret.Event.CHANGE);
                    values[sys.ListBaseKeys.dispatchChangeAfterSelection] = false;
                }
                PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedIndex");
                PropertyEvent.dispatchPropertyEvent(this,PropertyEvent.PROPERTY_CHANGE,"selectedItem");
            }

            return true;
        }

        /**
         * @language en_US
         * Adjusts the selected index to account for items being added to or
         * removed from this component.
         * It does not dispatch a <code>change</code> event because the change did not
         * occur as a direct result of user-interaction.  Moreover,
         * it does not dispatch a <code>changing</code> event
         * or allow the cancellation of the selection.
         * It also does not call the <code>itemSelected()</code> method,
         * since the same item is selected;
         * @param newIndex The new index.
         * @param add <code>true</code> if an item was added to the component,
         *  and <code>false</code> if an item was removed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 仅调整选中索引值而不更新选中项,即在提交属性阶段itemSelected方法不会被调用，也不会触发changing和change事件。
         * @param newIndex 新索引。
         * @param add 如果已将项目添加到组件，则为<code>true</code>；如果已删除项目，则为<code>false</code>。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected adjustSelection(newIndex:number, add:boolean = false):void {
            var values = this.$ListBase;
            if (values[sys.ListBaseKeys.proposedSelectedIndex] != ListBase.NO_PROPOSED_SELECTION)
                values[sys.ListBaseKeys.proposedSelectedIndex] = newIndex;
            else
                values[sys.ListBaseKeys.selectedIndex] = newIndex;
            values[sys.ListBaseKeys.selectedIndexAdjusted] = true;
            this.invalidateProperties();
        }

        /**
         * @language en_US
         * Called when an item has been added to this component. Selection
         * and caret related properties are adjusted accordingly.
         * @param item The item being added.
         * @param index The index of the item being added.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 数据项添加
         * @param item 被添加的项。
         * @param index 被添加的项的索引。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected itemAdded(item:any, index:number):void {
            super.itemAdded(item, index);
            var selectedIndex = this.$getSelectedIndex();
            if (selectedIndex == ListBase.NO_SELECTION) {
                if (this.$ListBase[sys.ListBaseKeys.requireSelection])
                    this.adjustSelection(index, true);
            }
            else if (index <= selectedIndex) {
                this.adjustSelection(selectedIndex + 1, true);
            }
        }

        /**
         * @language en_US
         * Called when an item has been removed from this component.
         * Selection and caret related properties are adjusted
         * accordingly.
         * @param item The item being removed.
         * @param index The index of the item being removed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 数据项移除
         * @param item 被移除的项。
         * @param index 被移除的项的索引。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected itemRemoved(item:any, index:number):void {
            super.itemRemoved(item, index);
            if (this.selectedIndex == ListBase.NO_SELECTION)
                return;

            var selectedIndex = this.$getSelectedIndex();
            if (index == selectedIndex) {
                if (this.requireSelection && this.$dataProvider && this.$dataProvider.length > 0) {
                    if (index == 0) {
                        this.$ListBase[sys.ListBaseKeys.proposedSelectedIndex] = 0;
                        this.invalidateProperties();
                    }
                    else
                        this.setSelectedIndex(0, false);
                }
                else
                    this.adjustSelection(-1, false);
            }
            else if (index < selectedIndex) {
                this.adjustSelection(selectedIndex - 1, false);
            }
        }


        /**
         * @language en_US
         * Event Listener of source data changed.
         * @param The <code>egret.gui.CollectionEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 数据源改变事件处理。
         * @param event 事件 <code>egret.gui.CollectionEvent</code> 的对象。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onCollectionChange(event:CollectionEvent):void {
            super.onCollectionChange(event);
            if (event.kind == CollectionEventKind.RESET) {
                if (this.$dataProvider.length == 0) {
                    this.setSelectedIndex(ListBase.NO_SELECTION, false);
                }
            }
            else if (event.kind == CollectionEventKind.REFRESH) {
                this.dataProviderRefreshed();
            }
        }

        /**
         * @language en_US
         * Default response to dataProvider refresh events: clear the selection and caret.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 数据源刷新
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected dataProviderRefreshed():void {
            this.setSelectedIndex(ListBase.NO_SELECTION, false);
        }

        /**
         * @language en_US
         * Called when an item has been added to this component.
         * @param renderer the renderer being added.
         * @param index the index of renderer
         * @param item the data of renderer
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 项呈示器被添加
         * @param renderer 添加的项呈示器
         * @param index 项呈示器的索引
         * @param item 项呈示器对应的数据
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected rendererAdded(renderer:IItemRenderer, index:number, item:any):void {
            renderer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRendererTouchBegin, this);
            renderer.addEventListener(egret.TouchEvent.TOUCH_END, this.onRendererTouchEnd, this);
        }

        /**
         * @language en_US
         * Called when an item has been removed to this component.
         * @param renderer the renderer being removed.
         * @param index the index of renderer.
         * @param item the data of renderer.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 项呈示器被移除
         * @param renderer 移除的项呈示器
         * @param index 项呈示器的索引
         * @param item 项呈示器对应的数据
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected rendererRemoved(renderer:IItemRenderer, index:number, item:any):void {
            renderer.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onRendererTouchBegin, this);
            renderer.removeEventListener(egret.TouchEvent.TOUCH_END, this.onRendererTouchEnd, this);
        }

        /**
         * @language en_US
         * Handles <code>egret.TouchEvent.TOUCH_BEGIN</code> events from any of the
         * item renderers. This method handles <code>egret.TouchEvent.TOUCH_END</code>.
         * @param event The <code>egret.TouchEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 侦听项呈示器<code>egret.TouchEvent.TOUCH_BEGIN</code>事件的方法。同时会添加对舞台<code>egret.TouchEvent.TOUCH_END</code>
         * 事件的侦听。
         * @param event 事件<code>egret.TouchEvent</code>的对象。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onRendererTouchBegin(event:egret.TouchEvent):void {
            if (event.$isDefaultPrevented)
                return;
            this.$ListBase[sys.ListBaseKeys.touchDownItemRenderer] = <IItemRenderer> (event.$currentTarget);
            this.$stage.addEventListener(egret.TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
        }

        /**
         * @language en_US
         * Handles <code>egret.TouchEvent.TOUCH_END</code> events and dispatch <code>ItemTapEvent.ITEM_TAP</code> event.
         * @param event The <code>egret.TouchEvent</code> object.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 触摸在项呈示器上结束，抛出<code>ItemTapEvent.ITEM_TAP</code>事件。
         * @param event 事件<code>egret.TouchEvent</code>的对象。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onRendererTouchEnd(event:egret.TouchEvent):void {
            var itemRenderer = <IItemRenderer> (event.$currentTarget);
            var touchDownItemRenderer = this.$ListBase[sys.ListBaseKeys.touchDownItemRenderer];
            if (itemRenderer != touchDownItemRenderer)
                return;
            this.setSelectedIndex(itemRenderer.itemIndex, true);
            ItemTapEvent.dispatchItemTapEvent(this, ItemTapEvent.ITEM_TAP, itemRenderer);
        }

        /**
         * @private
         * 触摸在舞台上结束
         */
        private stage_touchEndHandler(event:egret.Event):void {
            var stage = <egret.Stage>event.$currentTarget;
            stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.stage_touchEndHandler, this);
            this.$ListBase[sys.ListBaseKeys.touchDownItemRenderer] = null;
        }
    }

    registerBindable(ListBase.prototype,"selectedIndex");

    registerBindable(ListBase.prototype,"selectedItem");
}