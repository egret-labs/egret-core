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
     * @private
     */
    const enum Keys{
        useVirtualLayout,
        useVirtualLayoutChanged,
        rendererToClassMap,
        freeRenderers,
        createNewRendererFlag,
        itemRendererChanged,
        itemRenderer,
        itemRendererFunction,
        typicalItemChanged,
        typicalLayoutRect,
        cleanFreeRenderer,
        renderersBeingUpdated,
        typicalItem,
        itemRendererSkinName,
        itemRendererSkinNameChange
    }

    /**
     * @language en_US
     * The DataGroup class is the base container class for data items.
     * The DataGroup class converts data items to visual elements for display.
     * While this container can hold visual elements, it is often used only
     * to hold data items as children.
     *
     * @see eui.Group
     * @defaultProperty dataProvider
     * @includeExample  extension/eui/components/DataGroupExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * DataGroup 类将数据项目转换为可视元素以进行显示。
     * 尽管此容器可以包含可视元素，但它通常仅用于包含作为子项的数据项目。
     *
     * @see eui.Group
     * @see http://edn.egret.com/cn/index.php/article/index/id/527 数据容器
     * @see http://edn.egret.com/cn/index.php/article/index/id/528 数组集合 	 
     * @defaultProperty dataProvider
     * @includeExample  extension/eui/components/DataGroupExample.ts
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class DataGroup extends Group {

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
            this.$DataGroup = {
                0: true,      //useVirtualLayout
                1: false,     //useVirtualLayoutChanged
                2: {},        //rendererToClassMap
                3: {},        //freeRenderers
                4: false,     //createNewRendererFlag
                5: false,     //itemRendererChanged
                6: null,      //itemRenderer
                7: null,      //itemRendererFunction
                8: false,     //typicalItemChanged
                9: null,      //typicalLayoutRect
                10: false,    //cleanFreeRenderer
                11: false,    //renderersBeingUpdated
                12: null,     //typicalItem
                13: null,     //itemRendererSkinName
                14: false,    //itemRendererSkinNameChange
            };
        }

        $DataGroup:Object;

        /**
         * @copy eui.LayoutBase#useVirtualLayout
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get useVirtualLayout():boolean {
            return this.$layout ? this.$layout.$useVirtualLayout :
                this.$DataGroup[Keys.useVirtualLayout];
        }

        public set useVirtualLayout(value:boolean) {
            value = !!value;
            var values = this.$DataGroup;
            if (value === values[Keys.useVirtualLayout])
                return;

            values[Keys.useVirtualLayout] = value;
            if (this.$layout)
                this.$layout.useVirtualLayout = value;
        }

        /**
         * @private
         *
         * @param value
         */
        $setLayout(value:LayoutBase):boolean {
            if (value == this.$layout)
                return false;

            if (this.$layout) {
                this.$layout.setTypicalSize(0, 0);
                this.$layout.removeEventListener("useVirtualLayoutChanged", this.onUseVirtualLayoutChanged, this);
            }

            if (this.$layout && value && (this.$layout.$useVirtualLayout != value.$useVirtualLayout))
                this.onUseVirtualLayoutChanged();
            var result:boolean = super.$setLayout(value);
            if (value) {
                var rect = this.$DataGroup[Keys.typicalLayoutRect];
                if (rect) {
                    value.setTypicalSize(rect.width, rect.height);
                }
                value.useVirtualLayout = this.$DataGroup[Keys.useVirtualLayout];
                value.addEventListener("useVirtualLayoutChanged", this.onUseVirtualLayoutChanged, this);
            }

            return result;
        }

        /**
         * @private
         * 是否使用虚拟布局标记改变
         */
        private onUseVirtualLayoutChanged(event?:egret.Event):void {
            var values = this.$DataGroup;
            values[Keys.useVirtualLayoutChanged] = true;
            values[Keys.cleanFreeRenderer] = true;
            this.removeDataProviderListener();
            this.invalidateProperties();
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public setVirtualElementIndicesInView(startIndex:number, endIndex:number):void {
            if (!this.$layout || !this.$layout.$useVirtualLayout) {
                return;
            }
            var indexToRenderer = this.$indexToRenderer;
            var keys = Object.keys(indexToRenderer);
            var length = keys.length;
            for (var i = 0; i < length; i++) {
                var index = +keys[i];
                if (index < startIndex || index > endIndex) {
                    this.freeRendererByIndex(index);
                }
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getElementAt(index:number):egret.DisplayObject {
            return this.$indexToRenderer[index];
        }
        /**
         * @inheritDoc
         *
         * @version Egret 2.5.2
         * @version eui 1.0
         * @platform Web,Native
         */
        public getVirtualElementAt(index:number):UIComponent {
            index = +index | 0;
            if (index < 0 || index >= this.$dataProvider.length)
                return null;
            var renderer = this.$indexToRenderer[index];
            if (!renderer) {
                var item:any = this.$dataProvider.getItemAt(index);
                renderer = this.createVirtualRenderer(item);
                this.$indexToRenderer[index] = renderer;
                this.updateRenderer(renderer, index, item);
                var values = this.$DataGroup;
                if (values[Keys.createNewRendererFlag]) {
                    renderer.validateNow();
                    values[Keys.createNewRendererFlag] = false;
                    this.rendererAdded(renderer, index, item);
                }
            }
            return renderer;
        }

        /**
         * @private
         * 释放指定索引处的项呈示器
         */
        private freeRendererByIndex(index:number):void {
            var renderer = this.$indexToRenderer[index];
            if (renderer) {
                delete this.$indexToRenderer[index];
                this.doFreeRenderer(renderer);
            }
        }

        /**
         * @private
         *
         * @param renderer
         */
        private doFreeRenderer(renderer:IItemRenderer):void {
            var values = this.$DataGroup;
            var rendererClass = values[Keys.rendererToClassMap][renderer.$hashCode];
            var hashCode = rendererClass.$hashCode;
            if (!values[Keys.freeRenderers][hashCode]) {
                values[Keys.freeRenderers][hashCode] = [];
            }
            values[Keys.freeRenderers][hashCode].push(renderer);
            renderer.visible = false;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public invalidateSize():void {
            if (!this.$DataGroup[Keys.createNewRendererFlag]) {//虚拟布局时创建子项不需要重新验证
                super.invalidateSize();
            }
        }

        /**
         * @private
         * 为指定索引创建虚拟的项呈示器
         */
        private createVirtualRenderer(item:any):IItemRenderer {
            var renderer:IItemRenderer;
            var rendererClass = this.itemToRendererClass(item);
            var hashCode = rendererClass.$hashCode;
            var values = this.$DataGroup;
            var freeRenderers = values[Keys.freeRenderers];
            if (freeRenderers[hashCode] && freeRenderers[hashCode].length > 0) {
                renderer = freeRenderers[hashCode].pop();
                renderer.visible = true;
                return renderer;
            }
            values[Keys.createNewRendererFlag] = true;
            return this.createOneRenderer(rendererClass);
        }

        /**
         * @private
         * 根据rendererClass创建一个Renderer,并添加到显示列表
         */
        private createOneRenderer(rendererClass:any):IItemRenderer {
            var renderer = <IItemRenderer> (new rendererClass());
            var values = this.$DataGroup;
            values[Keys.rendererToClassMap][renderer.$hashCode] = rendererClass;
            if (!egret.is(renderer, "eui.IItemRenderer")) {
                return null;
            }
            this.addChild(renderer);
            if (values[Keys.itemRendererSkinName]) {
                this.setItemRenderSkinName(renderer,values[Keys.itemRendererSkinName]);
            }
            return renderer;
        }

        /**
         * @private
         * 设置项呈示器的默认皮肤
         */
        private setItemRenderSkinName(renderer:IItemRenderer,skinName:any):void {
            if (renderer && renderer instanceof Component) {
                var comp:Component = <Component> <any>renderer;
                if (!comp.$Component[sys.ComponentKeys.skinNameExplicitlySet]){
                    comp.skinName = skinName;
                    comp.$Component[sys.ComponentKeys.skinNameExplicitlySet] = false;
                }

            }
        }

        /**
         * @private
         */
        $dataProviderChanged:boolean = false;

        /**
         * @private
         */
        $dataProvider:ICollection = null;

        /**
         * @language en_US
         * The data provider for this DataGroup.
         * It must be an ICollection, such as ArrayCollection
         *
         * @see eui.ICollection
         * @see eui.ArrayCollection
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 列表数据源，请使用实现了ICollection接口的数据类型，例如 ArrayCollection
         *
         * @see eui.ICollection
         * @see eui.ArrayCollection
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get dataProvider():ICollection {
            return this.$dataProvider;
        }

        public set dataProvider(value:ICollection) {
            this.$setDataProvider(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setDataProvider(value:ICollection):boolean {
            if (this.$dataProvider == value)
                return false;
            this.removeDataProviderListener();
            this.$dataProvider = value;
            this.$dataProviderChanged = true;
            this.$DataGroup[Keys.cleanFreeRenderer] = true;
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();

            return true;
        }

        /**
         * @private
         * 移除数据源监听
         */
        private removeDataProviderListener():void {
            if (this.$dataProvider)
                this.$dataProvider.removeEventListener(CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this);
        }

        /**
         * @language en_US
         * Called when contents within the dataProvider changes.  We will catch certain
         * events and update our children based on that.
         *
         * @param event 事件<code>eui.CollectionEvent</code>的对象。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 数据源改变事件处理。
         *
         * @param event 事件<code>eui.CollectionEvent</code>的对象。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected onCollectionChange(event:CollectionEvent):void {
            switch (event.kind) {
                case CollectionEventKind.ADD:
                    this.itemAddedHandler(event.items, event.location);
                    break;
                case CollectionEventKind.REMOVE:
                    this.itemRemovedHandler(event.items, event.location);
                    break;
                case CollectionEventKind.UPDATE:
                case CollectionEventKind.REPLACE:
                    this.itemUpdatedHandler(event.items[0], event.location);
                    break;
                case CollectionEventKind.RESET:
                case CollectionEventKind.REFRESH:
                    if (this.$layout && this.$layout.$useVirtualLayout) {
                        var indexToRenderer = this.$indexToRenderer;
                        var keys = Object.keys(indexToRenderer);
                        var length = keys.length;
                        for (var i = 0; i < length; i++) {
                            var index = +keys[i];
                            this.freeRendererByIndex(index);
                        }
                    }
                    this.$dataProviderChanged = true;
                    this.invalidateProperties();
                    break;
            }

            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * @private
         * 数据源添加项目事件处理
         */
        private itemAddedHandler(items:any[], index:number):void {
            var length = items.length;
            for (var i = 0; i < length; i++) {
                this.itemAdded(items[i], index + i);
            }
            this.resetRenderersIndices();
        }

        /**
         * @private
         * 数据源移除项目事件处理
         */
        private itemRemovedHandler(items:any[], location:number):void {
            var length = items.length;
            for (var i = length - 1; i >= 0; i--) {
                this.itemRemoved(items[i], location + i);
            }

            this.resetRenderersIndices();
        }

        /**
         * @language en_US
         * Adds the item for the specified dataProvider item to this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param item The item that was added, the value of dataProvider[index].
         * @param index The index where the dataProvider item was added.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 添加一个指定的数据到数据源。
         *
         * 这个方法不应该由开发者直接调用，而用于本类自动内调用。
         *
         * @param item 添加的数据项。
         * @param index 被添加到的索引。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected itemAdded(item:any, index:number):void {
            if (this.$layout)
                this.$layout.elementAdded(index);

            if (this.$layout && this.$layout.$useVirtualLayout) {
                this.$indexToRenderer.splice(index, 0, null);
                return;
            }
            var renderer = this.createVirtualRenderer(item);
            this.$indexToRenderer.splice(index, 0, renderer);
            if (renderer) {
                this.updateRenderer(renderer, index, item);
                var values = this.$DataGroup;
                if (values[Keys.createNewRendererFlag]) {
                    values[Keys.createNewRendererFlag] = false;
                    this.rendererAdded(renderer, index, item);
                }
            }
        }

        /**
         * @language en_US
         * Removes the itemRenderer for the specified dataProvider item from this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param item The item that is being removed.
         * @param index The index of the item that is being removed.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 删除数据源中指定的项。
         *
         * 这个方法不应该由开发者直接调用，而用于本类自动内调用。
         *
         * @param item 移除的数据项。
         * @param index 被移除的索引。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected itemRemoved(item:any, index:number):void {
            if (this.$layout)
                this.$layout.elementRemoved(index);
            var oldRenderer = this.$indexToRenderer[index];

            if (this.$indexToRenderer.length > index)
                this.$indexToRenderer.splice(index, 1);

            if (oldRenderer) {
                if (this.$layout && this.$layout.$useVirtualLayout) {
                    this.doFreeRenderer(oldRenderer);
                }
                else {
                    this.rendererRemoved(oldRenderer, index, item);
                    this.removeChild(oldRenderer);
                }
            }
        }

        /**
         * @private
         * 更新当前所有项的索引
         */
        private resetRenderersIndices():void {
            var indexToRenderer = this.$indexToRenderer;
            if (indexToRenderer.length == 0)
                return;

            if (this.$layout && this.$layout.$useVirtualLayout) {
                var keys = Object.keys(indexToRenderer);
                var length = keys.length;
                for (var i = 0; i < length; i++) {
                    var index = +keys[i];
                    this.resetRendererItemIndex(index);
                }
            }
            else {
                var indexToRendererLength = indexToRenderer.length;
                for (index = 0; index < indexToRendererLength; index++) {
                    this.resetRendererItemIndex(index);
                }
            }
        }

        /**
         * @private
         * 数据源更新或替换项目事件处理
         */
        private itemUpdatedHandler(item:any, location:number):void {
            if (this.$DataGroup[Keys.renderersBeingUpdated]) {
                return;//防止无限循环
            }

            var renderer = this.$indexToRenderer[location];
            if (renderer)
                this.updateRenderer(renderer, location, item);
        }

        /**
         * @private
         * 调整指定项呈示器的索引值
         */
        private resetRendererItemIndex(index:number):void {
            var renderer = this.$indexToRenderer[index];
            if (renderer)
                renderer.itemIndex = index;
        }


        /**
         * @language en_US
         * The item renderer to use for data items.
         * The class must implement the IItemRenderer interface.
         * If defined, the <code>itemRendererFunction</code> property
         * takes precedence over this property.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于数据项目的项呈示器。您应该直接为此属性赋值自定义类的类定义，而不是一个实例。注意：该类必须实现 IItemRenderer 接口。<br/>
         * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get itemRenderer():any {
            return this.$DataGroup[Keys.itemRenderer];
        }

        public set itemRenderer(value:any) {
            var values = this.$DataGroup;
            if (values[Keys.itemRenderer] == value)
                return;
            values[Keys.itemRenderer] = value;
            values[Keys.itemRendererChanged] = true;
            values[Keys.typicalItemChanged] = true;
            values[Keys.cleanFreeRenderer] = true;
            this.removeDataProviderListener();
            this.invalidateProperties();
        }

        /**
         * @language en_US
         * The skinName property of the itemRenderer.This property will be passed to itemRenderer.skinName as default value,if you
         * did not set it explicitly.<br>
         * Note: This property is invalid if the itemRenderer is not a subclass of the Component class.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 条目渲染器的可选皮肤标识符。在实例化itemRenderer时，若其内部没有设置过skinName,则将此属性的值赋值给它的skinName。
         * 注意:若 itemRenderer 不是 Component 的子类，则此属性无效。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get itemRendererSkinName():any {
            return this.$DataGroup[Keys.itemRendererSkinName];
        }

        public set itemRendererSkinName(value:any) {
            var values = this.$DataGroup;
            if (values[Keys.itemRendererSkinName] == value)
                return;
            values[Keys.itemRendererSkinName] = value;
            if (this.$UIComponent[sys.UIKeys.initialized]) {
                values[Keys.itemRendererSkinNameChange] = true;
                this.invalidateProperties();
            }
        }

        /**
         * @language en_US
         * Function that returns an item renderer for a
         * specific item.
         *
         * If defined, this property
         * takes precedence over the <code>itemRenderer</code> property.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 为某个特定数据项返回一个项呈示器类定义的函数。
         * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get itemRendererFunction():(item:any)=>any {
            return this.$DataGroup[Keys.itemRendererFunction];
        }

        public set itemRendererFunction(value:(item:any)=>any) {
            var values = this.$DataGroup;
            if (values[Keys.itemRendererFunction] == value)
                return;
            values[Keys.itemRendererFunction] = value;
            values[Keys.itemRendererChanged] = true;
            values[Keys.typicalItemChanged] = true;
            this.removeDataProviderListener();
            this.invalidateProperties();
        }

        /**
         * @private
         * 为特定的数据项返回项呈示器的工厂实例
         */
        private itemToRendererClass(item:any):any {
            var rendererClass:any;
            var values = this.$DataGroup;
            if (values[Keys.itemRendererFunction]) {
                rendererClass = values[Keys.itemRendererFunction](item);
            }
            if (!rendererClass) {
                rendererClass = values[Keys.itemRenderer];
            }
            if (!rendererClass) {
                rendererClass = ItemRenderer;
            }
            if (!rendererClass.$hashCode) {
                rendererClass.$hashCode = egret.$hashCount++;
            }
            return rendererClass;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected createChildren():void {
            if (!this.$layout) {
                var layout:VerticalLayout = new VerticalLayout();
                layout.gap = 0;
                layout.horizontalAlign = JustifyAlign.CONTENT_JUSTIFY;
                this.$setLayout(layout);
            }
            super.createChildren();
        }


        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected commitProperties():void {
            var values = this.$DataGroup;
            if (values[Keys.itemRendererChanged] || this.$dataProviderChanged || values[Keys.useVirtualLayoutChanged]) {
                this.removeAllRenderers();
                if (this.$layout)
                    this.$layout.clearVirtualLayoutCache();
                this.setTypicalLayoutRect(null);
                values[Keys.useVirtualLayoutChanged] = false;
                values[Keys.itemRendererChanged] = false;
                if (this.$dataProvider)
                    this.$dataProvider.addEventListener(CollectionEvent.COLLECTION_CHANGE, this.onCollectionChange, this);
                if (this.$layout && this.$layout.$useVirtualLayout) {
                    this.invalidateSize();
                    this.invalidateDisplayList();
                }
                else {
                    this.createRenderers();
                }
                if (this.$dataProviderChanged) {
                    this.$dataProviderChanged = false;
                    this.scrollV = this.scrollH = 0;
                }
            }

            super.commitProperties();

            if (values[Keys.typicalItemChanged]) {
                values[Keys.typicalItemChanged] = false;
                if (this.$dataProvider && this.$dataProvider.length > 0) {
                    values[Keys.typicalItem] = this.$dataProvider.getItemAt(0);
                    this.measureRendererSize();
                }
            }

            if (values[Keys.itemRendererSkinNameChange]) {
                values[Keys.itemRendererSkinNameChange] = false;
                var skinName = values[Keys.itemRendererSkinName];
                var indexToRenderer = this.$indexToRenderer;
                var keys = Object.keys(indexToRenderer);
                var length = keys.length;
                for (var i = 0; i < length; i++) {
                    var index = keys[i];
                    this.setItemRenderSkinName(indexToRenderer[index],skinName);
                }
                var freeRenderers = values[Keys.freeRenderers];
                var keys = Object.keys(freeRenderers);
                var length = keys.length;
                for (var i = 0; i < length; i++) {
                    var hashCode = keys[i];
                    var list:IItemRenderer[] = freeRenderers[hashCode];
                    var length = list.length;
                    for (var i = 0; i < length; i++) {
                        this.setItemRenderSkinName(list[i],skinName);
                    }
                }
            }
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected measure():void {
            if (this.$layout && this.$layout.$useVirtualLayout) {
                this.ensureTypicalLayoutElement();
            }
            super.measure();
        }


        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
            var useVirtualLayout = (this.$layout && this.$layout.$useVirtualLayout);
            if (useVirtualLayout) {
                this.ensureTypicalLayoutElement();
            }
            super.updateDisplayList(unscaledWidth, unscaledHeight);
            var values = this.$DataGroup;
            if (useVirtualLayout) {
                //检查索引 0 处的项测量大小是否发生改变，若改变就重新计算 typicalLayoutRect
                var rect = values[Keys.typicalLayoutRect];
                if (rect) {
                    var renderer = this.$indexToRenderer[0];
                    if (renderer) {
                        var bounds = egret.$TempRectangle;
                        renderer.getPreferredBounds(bounds);
                        if (bounds.width != rect.width || bounds.height != rect.height) {
                            values[Keys.typicalLayoutRect] = null;
                        }
                    }
                }
            }
        }

        /**
         * @private
         * 确保测量过默认条目大小。
         */
        private ensureTypicalLayoutElement():void {
            if (this.$DataGroup[Keys.typicalLayoutRect])
                return;

            if (this.$dataProvider && this.$dataProvider.length > 0) {
                this.$DataGroup[Keys.typicalItem] = this.$dataProvider.getItemAt(0);
                this.measureRendererSize();
            }
        }

        /**
         * @private
         * 测量项呈示器默认尺寸
         */
        private measureRendererSize():void {
            var values = this.$DataGroup;
            if (!values[Keys.typicalItem]) {
                this.setTypicalLayoutRect(null);
                return;
            }
            var typicalRenderer = this.createVirtualRenderer(values[Keys.typicalItem]);
            if (!typicalRenderer) {
                this.setTypicalLayoutRect(null);
                return;
            }
            this.updateRenderer(typicalRenderer, 0, values[Keys.typicalItem]);
            typicalRenderer.validateNow();
            var bounds = egret.$TempRectangle;
            typicalRenderer.getPreferredBounds(bounds);
            var rect = new egret.Rectangle(0, 0, bounds.width, bounds.height);
            if (this.$layout && this.$layout.$useVirtualLayout) {
                if (values[Keys.createNewRendererFlag]) {
                    this.rendererAdded(typicalRenderer, 0, values[Keys.typicalItem]);
                }
                this.doFreeRenderer(typicalRenderer);
            }
            else {
                this.removeChild(typicalRenderer);
            }
            this.setTypicalLayoutRect(rect);
            values[Keys.createNewRendererFlag] = false;
        }

        /**
         * @private
         * 设置项目默认大小
         */
        private setTypicalLayoutRect(rect:egret.Rectangle):void {
            this.$DataGroup[Keys.typicalLayoutRect] = rect;
            if (this.$layout) {
                if (rect) {
                    this.$layout.setTypicalSize(rect.width, rect.height);
                }
                else {
                    this.$layout.setTypicalSize(0, 0);
                }
            }
        }


        /**
         * @private
         * 索引到项呈示器的转换数组
         */
        $indexToRenderer:IItemRenderer[] = [];

        /**
         * @private
         * 移除所有项呈示器
         */
        private removeAllRenderers():void {
            var indexToRenderer = this.$indexToRenderer;
            var keys = Object.keys(indexToRenderer);
            var length = keys.length;
            for (var i = 0; i < length; i++) {
                var index = keys[i];
                var renderer = indexToRenderer[index];
                if (renderer) {
                    this.rendererRemoved(renderer, renderer.itemIndex, renderer.data);
                    this.removeChild(renderer);
                }
            }
            this.$indexToRenderer = [];
            var values = this.$DataGroup;
            if (values[Keys.cleanFreeRenderer]) {
                var freeRenderers = values[Keys.freeRenderers];
                var keys = Object.keys(freeRenderers);
                var length = keys.length;
                for (var i = 0; i < length; i++) {
                    var hashCode = keys[i];
                    var list:IItemRenderer[] = freeRenderers[hashCode];
                    var length = list.length;
                    for (var i = 0; i < length; i++) {
                        renderer = list[i];
                        this.rendererRemoved(renderer, renderer.itemIndex, renderer.data);
                        this.removeChild(renderer);
                    }
                }
                values[Keys.freeRenderers] = {};
                values[Keys.rendererToClassMap] = {};
                values[Keys.cleanFreeRenderer] = false;
            }
        }

        /**
         * @private
         * 为数据项创建项呈示器
         */
        private createRenderers():void {
            if (!this.$dataProvider)
                return;
            var index = 0;
            var length = this.$dataProvider.length;
            for (var i = 0; i < length; i++) {
                var item = this.$dataProvider.getItemAt(i);
                var rendererClass = this.itemToRendererClass(item);
                var renderer:IItemRenderer = this.createOneRenderer(rendererClass);
                if (!renderer)
                    continue;
                this.$indexToRenderer[index] = renderer;
                this.updateRenderer(renderer, index, item);
                this.rendererAdded(renderer, index, item);
                index++;
            }
        }

        /**
         * @language en_US
         * Updates the renderer for reuse.
         * This method first prepares the item
         * renderer for reuse by cleaning out any stale properties
         * as well as updating it with new properties.<p/>
         *
         * The last thing this method should do is set the <code>data</code> property
         * of the item renderer.
         *
         * @param renderer The item renderer.
         * @param itemIndex The index of the data in the data provider.
         * @param data The data object this item renderer is representing.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 此方法首先会准备项呈示器以重用，方法是清除任何旧属性，同时使用新属性进行更新。<p/>
         *
         * 最后，此方法应对项呈示器设置 data 属性。
         *
         * @param renderer 项呈示器。
         * @param itemIndex 数据提供程序中的数据索引。
         * @param data 此项呈示器正在表示的数据对象。
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public updateRenderer(renderer:IItemRenderer, itemIndex:number, data:any):IItemRenderer {
            var values = this.$DataGroup;
            values[Keys.renderersBeingUpdated] = true;
            renderer.itemIndex = itemIndex;
            renderer.data = data;
            values[Keys.renderersBeingUpdated] = false;
            return renderer;
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get numElements():number {
            if (!this.$dataProvider)
                return 0;
            return this.$dataProvider.length;
        }


        /**
         * @language en_US
         * Adds the itemRenderer for the specified dataProvider item to this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param renderer The renderer that was added.
         * @param index The index where the dataProvider item was added.
         * @param item The item that was added, the value of dataProvider[index].
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 项呈示器被添加.
         *
         * 这个方法不能直接调用，它是由该类自身自动调用的。
         *
         * @param renderer 添加的项呈示器
         * @param index 项呈示器的索引
         * @param item 项呈示器对应的数据
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected rendererAdded(renderer:IItemRenderer, index:number, item:any):void {
        }

        /**
         * @language en_US
         * Removes the itemRenderer for the specified dataProvider item from this DataGroup.
         *
         * This method is called as needed by the DataGroup implementation,
         * it should not be called directly.
         *
         * @param renderer The renderer that is being removed.
         * @param index The index of the item that is being removed.
         * @param item The item that is being removed.
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 项呈示器被移除。
         * 这个方法不能直接调用，它是由该类自身自动调用的。
         *
         * @param renderer 移除的项呈示器
         * @param index 项呈示器的索引
         * @param item 项呈示器对应的数据
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        protected rendererRemoved(renderer:IItemRenderer, index:number, item:any):void {
        }
    }

    registerProperty(DataGroup, "itemRenderer", "Class");
    registerProperty(DataGroup, "itemRendererSkinName", "Class");
    registerProperty(DataGroup, "dataProvider", "eui.ICollection", true);
    if (DEBUG) {
        egret.$markReadOnly(DataGroup, "numElements");
    }
}
