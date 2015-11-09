declare module egret.gui {
    /**
     * @class egret.gui.ArrayCollection
     * @classdesc
     * 数组的集合类数据结构包装器
     * 通常作为列表组件的数据源，使用这种数据结构包装普通数组，
     * 能在数据源发生改变的时候主动通知视图刷新变更的数据项
     * @extends egret.EventDispatcher
     * @implements egret.gui.ICollection
     */
    class ArrayCollection extends EventDispatcher implements ICollection {
        /**
         * 构造函数
         * @method egret.gui.ArrayCollection#constructor
         * @param source {Array<any>} 数据源
         */
        constructor(source?: Array<any>);
        /**
         *
         */
        private _source;
        /**
         * 数据源
         * 通常情况下请不要直接调用Array的方法操作数据源，否则对应的视图无法收到数据改变的通知。
         * 若对数据源进行了排序或过滤等操作，请手动调用refresh()方法刷新数据。<br/>
         * @member egret.gui.ArrayCollection#source
         */
        source: Array<any>;
        /**
         * 在对数据源进行排序或过滤操作后可以手动调用此方法刷新所有数据,以更新视图。
         * @method egret.gui.ArrayCollection#refresh
         */
        refresh(): void;
        /**
         * 是否包含某项数据
         * @method egret.gui.ArrayCollection#contains
         * @param item {any}
         * @returns {boolean}
         */
        contains(item: any): boolean;
        /**
         * 检测索引是否超出范围
         */
        private checkIndex(index);
        /**
         * @member egret.gui.ArrayCollection#length
         */
        length: number;
        /**
         * 向列表末尾添加指定项目。等效于 addItemAt(item, length)。
         * @method egret.gui.ArrayCollection#addItem
         * @param item {any}
         */
        addItem(item: any): void;
        /**
         * 在指定的索引处添加项目。
         * 任何大于已添加项目的索引的项目索引都会增加 1。
         * @method egret.gui.ArrayCollection#addItemAt
         * @param item {any}
         * @param index {number}
         */
        addItemAt(item: any, index: number): void;
        /**
         * 获取指定索引处的项目
         * @method egret.gui.ArrayCollection#getItemAt
         * @param index {number}
         * @returns {any}
         */
        getItemAt(index: number): any;
        /**
         * 如果项目位于列表中,返回该项目的索引。否则返回-1。
         * @method egret.gui.ArrayCollection#getItemIndex
         * @param item {any}
         * @returns {number}
         */
        getItemIndex(item: any): number;
        /**
         * 通知视图，某个项目的属性已更新。
         * @method egret.gui.ArrayCollection#itemUpdated
         * @param item {any}
         */
        itemUpdated(item: any): void;
        /**
         * 删除列表中的所有项目。
         * @method egret.gui.ArrayCollection#removeAll
         */
        removeAll(): void;
        /**
         * 删除指定索引处的项目并返回该项目。原先位于此索引之后的所有项目的索引现在都向前移动一个位置。
         * @method egret.gui.ArrayCollection#removeItemAt
         * @param index {number}
         * @returns {any}
         */
        removeItemAt(index: number): any;
        /**
         * 替换在指定索引处的项目，并返回该项目。
         * @method egret.gui.ArrayCollection#replaceItemAt
         * @param item {any}
         * @param index {number}
         * @returns {any}
         */
        replaceItemAt(item: any, index: number): any;
        /**
         * 用新数据源替换原始数据源，此方法与直接设置source不同，它不会导致目标视图重置滚动位置。
         * @method egret.gui.ArrayCollection#replaceAll
         * @param newSource {Array<any>} 新的数据源
         */
        replaceAll(newSource: Array<any>): void;
        /**
         * 移动一个项目
         * 在oldIndex和newIndex之间的项目，
         * 若oldIndex小于newIndex,索引会减1
         * 若oldIndex大于newIndex,索引会加1
         * @method egret.gui.ArrayCollection#moveItemAt
         * @param oldIndex {number}
         * @param newIndex {number}
         * @returns {any}
         */
        moveItemAt(oldIndex: number, newIndex: number): any;
        /**
         * 抛出事件
         */
        private dispatchCoEvent(kind?, location?, oldLocation?, items?, oldItems?);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ICollection
     * @interface
     * @classdesc
     * 列表的集合类数据源对象接口
     * @extends egret.IEventDispatcher
     */
    interface ICollection extends IEventDispatcher {
        /**
         * 此集合中的项目数。0 表示不包含项目，而 -1 表示长度未知。
         * @member egret.gui.ICollection#length
         */
        length: number;
        /**
         * 获取指定索引处的项目。
         * @method egret.gui.ICollection#getItemAt
         * @param index {number}
         * @returns {any}
         */
        getItemAt(index: number): any;
        /**
         * 如果项目位于列表中,返回该项目的索引。否则返回-1。
         * @method egret.gui.ICollection#getItemIndex
         * @param item {any}
         * @returns {number}
         */
        getItemIndex(item: any): number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ITreeCollection
     * @interface
     * @classdesc
     * Tree组件的集合类数据源对象接口
     * @extends egret.gui.ICollection
     */
    interface ITreeCollection extends ICollection {
        /**
         * 检查指定的节点是否含有子节点
         * @method egret.gui.ITreeCollection#hasChildren
         * @param item {any} 要检查的节点
         * @returns {boolean}
         */
        hasChildren(item: any): boolean;
        /**
         * 指定的节点是否打开
         * @method egret.gui.ITreeCollection#isItemOpen
         * @param item {any}
         * @returns {boolean}
         */
        isItemOpen(item: any): boolean;
        /**
         * 打开或关闭一个节点
         * @method egret.gui.ITreeCollection#expandItem
         * @param item {any} 要打开或关闭的节点
         * @param open? {boolean} true表示打开节点，反之关闭。
         */
        expandItem(item: any, open?: boolean): void;
        /**
         * 获取节点的深度
         * @method egret.gui.ITreeCollection#getDepth
         * @param item {any}
         * @returns {number}
         */
        getDepth(item: any): number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ObjectCollection
     * @classdesc
     * Object的集合类数据结构包装器,通常作为Tree组件的数据源。
     * @extends egret.EventDispatcher
     * @implements egret.gui.ICollection
     * @implements egret.gui.ITreeCollection
     */
    class ObjectCollection extends EventDispatcher implements ICollection, ITreeCollection {
        /**
         * 构造函数
         * @method egret.gui.ObjectCollection#constructor
         * @param childrenKey {string} 要从item中获取子项列表的属性名,属性值为一个数组或Vector。
         * @param parentKey {string} 要从item中获取父级项的属性名
         */
        constructor(childrenKey?: string, parentKey?: string);
        /**
         * 要从item中获取子项列表的属性名
         */
        private childrenKey;
        /**
         * 要从item中获取父级项的属性名
         */
        private parentKey;
        private _source;
        /**
         * 数据源。注意：设置source会同时清空openNodes。
         * @member egret.gui.ObjectCollection#source
         */
        source: any;
        /**
         * 要显示的节点列表
         */
        private nodeList;
        private _openNodes;
        /**
         * 处于展开状态的节点列表
         * @member egret.gui.ObjectCollection#openNodes
         */
        openNodes: Array<any>;
        /**
         * @member egret.gui.ObjectCollection#length
         */
        length: number;
        /**
         * @method egret.gui.ObjectCollection#getItemAt
         * @param index {number}
         * @returns {any}
         */
        getItemAt(index: number): any;
        /**
         * @method egret.gui.ObjectCollection#getItemIndex
         * @param item {any}
         * @returns {number}
         */
        getItemIndex(item: any): number;
        /**
         * 通知视图，某个项目的属性已更新。
         * @method egret.gui.ObjectCollection#itemUpdated
         * @param item {any}
         */
        itemUpdated(item: any): void;
        /**
         * 删除指定节点
         * @method egret.gui.ObjectCollection#removeItem
         * @param item {any}
         */
        removeItem(item: any): void;
        private _showRoot;
        /**
         * 是否显示根节点,默认false。
         * @member egret.gui.ObjectCollection#showRoot
         */
        showRoot: boolean;
        /**
         * 添加打开的节点到列表
         */
        private addChildren(parent, list);
        /**
         * @method egret.gui.ObjectCollection#hasChildren
         * @param item {any}
         * @returns {boolean}
         */
        hasChildren(item: any): boolean;
        /**
         * @method egret.gui.ObjectCollection#isItemOpen
         * @param item {any}
         * @returns {boolean}
         */
        isItemOpen(item: any): boolean;
        /**
         * @method egret.gui.ObjectCollection#expandItem
         * @param item {any}
         * @param open {boolean}
         */
        expandItem(item: any, open?: boolean): void;
        /**
         * 打开一个节点
         */
        private openNode(item);
        /**
         * 关闭一个节点
         */
        private closeNode(item);
        /**
         * @method egret.gui.ObjectCollection#getDepth
         * @param item {any}
         * @returns {number}
         */
        getDepth(item: any): number;
        /**
         * 刷新数据源。
         * @method egret.gui.ObjectCollection#refresh
         */
        refresh(): void;
        /**
         * 抛出事件
         */
        private dispatchCoEvent(kind?, location?, oldLocation?, items?, oldItems?);
        /**
         * 一个工具方法，给parent的子项以及子孙项赋值父级引用。
         * @method egret.gui.ObjectCollection.assignParent
         * @param parent {any} 要遍历子项的parent对象。
         * @param childrenKey {string} 要从parent中获取子项列表的属性名,属性值为一个数组或Vector。
         * @param parentKey {string} 要给子项赋值父级引用的属性名。
         */
        static assignParent(parent: any, childrenKey?: string, parentKey?: string): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.UIComponent
     * @classdesc
     * 显示对象基类
     * @extends egret.DisplayObjectContainer
     * @implements egret.gui.IUIComponent
     * @implements egret.gui.ILayoutManagerClient
     * @implements egret.gui.ILayoutElement
     * @implements egret.gui.IInvalidating
     * @implements egret.gui.IVisualElement
     */
    class UIComponent extends DisplayObjectContainer implements IUIComponent, ILayoutManagerClient, ILayoutElement, IInvalidating, IVisualElement, IStyleClient {
        _UIC_Props_: UIComponentProperties;
        /**
         * 构造函数
         * @method egret.gui.UIComponent#constructor
         */
        constructor();
        /**
         * __proto__属性是否可以设置的标志，兼容IE9，IE10。
         */
        private static prototypeCanSet;
        /**
         * 添加到舞台
         */
        private onAddedToStage(e);
        /**
         * 组件 ID。此值将作为对象的实例名称，因此不应包含任何空格或特殊字符。应用程序中的每个组件都应具有唯一的 ID。
         * @constant egret.gui.UIComponent#id
         */
        id: string;
        /**
         * @member egret.gui.UIComponent#isPopUp
         */
        isPopUp: boolean;
        /**
         * @member egret.gui.UIComponent#owner
         */
        owner: any;
        /**
         * @method egret.gui.UIComponent#ownerChanged
         * @param value {any}
         */
        ownerChanged(value: any): void;
        /**
         * @member egret.gui.UIComponent#updateCompletePendingFlag
         */
        updateCompletePendingFlag: boolean;
        /**
         * @member egret.gui.UIComponent#initialized
         */
        initialized: boolean;
        /**
         * 初始化组件
         * @method egret.gui.UIComponent#_initialize
         */
        _initialize(): void;
        /**
         * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
         * 请务必调用super.createChildren()以完成父类组件的初始化
         * @method egret.gui.UIComponent#createChildren
         */
        createChildren(): void;
        /**
         * 子项创建完成
         * @method egret.gui.UIComponent#childrenCreated
         */
        childrenCreated(): void;
        /**
         * @member egret.gui.UIComponent#nestLevel
         */
        nestLevel: number;
        /**
         * 更新子项的nestLevel属性
         */
        _updateChildrenNestLevel(): void;
        /**
         * 获取指定的名称的样式属性值
         */
        getStyle(styleProp: string): any;
        /**
         * 对此组件实例设置样式属性。在此组件上设置的样式会覆盖父级容器的同名样式。推荐在子项较少的组件上使用，尽量避免在全局调用此方法，有可能造成性能问题。
         */
        setStyle(styleProp: string, newValue: any): void;
        styleChanged(styleProp: string): void;
        /**
         * 通知子项列表样式发生改变
         */
        notifyStyleChangeInChildren(styleProp: string): void;
        _createOwnStyleProtoChain(chain: any): any;
        /**
         * 创建一个原型链节点
         */
        private createProtoChain(parentChain);
        /**
         * 清除在此组件实例上设置过的指定样式名。
         */
        clearStyle(styleProp: string): void;
        private static emptyStyleChain;
        /**
         * 重新生成自身以及所有子项的原型链
         */
        regenerateStyleCache(parentChain: any): void;
        /**
         * 兼容IE9，10的写法。
         */
        regenerateStyleCacheForIE(parentChain: any): void;
        /**
         * 添加对象到显示列表,此接口仅预留给框架内部使用
         * 如果需要管理子项，若有，请使用容器的addElement()方法，非法使用有可能造成无法自动布局。
         */
        _addToDisplayList(child: DisplayObject, notifyListeners?: boolean): DisplayObject;
        /**
         * 添加对象到显示列表,此接口仅预留给框架内部使用
         * 如果需要管理子项，若有，请使用容器的addElementAt()方法，非法使用有可能造成无法自动布局。
         */
        _addToDisplayListAt(child: DisplayObject, index: number, notifyListeners?: boolean): DisplayObject;
        /**
         * 添加对象到显示列表,此接口仅预留给框架内部使用
         * 如果需要管理子项，若有，请使用容器的removeElement()方法,非法使用有可能造成无法自动布局。
         */
        _removeFromDisplayList(child: DisplayObject, notifyListeners?: boolean): DisplayObject;
        /**
         * 从显示列表移除指定索引的子项,此接口仅预留给框架内部使用
         * 如果需要管理子项，若有，请使用容器的removeElementAt()方法,非法使用有可能造成无法自动布局。
         */
        _removeFromDisplayListAt(index: number, notifyListeners?: boolean): DisplayObject;
        /**
         * GUI范围内，请不要调用任何addChild方法，若是容器，请用addElement,若需要包装普通显示对象，请把显示对象赋值给UIAsset.source。
         * @deprecated
         * @method egret.gui.UIComponent#addChild
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         * GUI范围内，请不要调用任何addChildAt方法，若是容器，请用addElementAt,若需要包装普通显示对象，请把显示对象赋值给UIAsset.source。
         * @deprecated
         * @method egret.gui.UIComponent#addChildAt
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
         * 即将添加一个子项
         */
        _addingChild(child: DisplayObject): void;
        /**
         * 已经添加一个子项
         */
        _childAdded(child: DisplayObject): void;
        /**
         * GUI范围内，请不要调用任何removeChild方法，若是容器，请用removeElement
         * @deprecated
         * @method egret.gui.UIComponent#removeChild
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         * GUI范围内，请不要调用任何removeChildAt方法，若是容器，请用removeElementAt
         * @deprecated
         * @method egret.gui.UIComponent#removeChildAt
         * @param index {number}
         * @returns {DisplayObject}
         */
        removeChildAt(index: number): DisplayObject;
        /**
         * 已经移除一个子项
         */
        _childRemoved(child: DisplayObject): void;
        /**
         * 检查属性失效标记并应用
         */
        private checkInvalidateFlag(event?);
        /**
         * @member egret.gui.UIComponent#enabled
         */
        enabled: boolean;
        /**
         * @member egret.gui.UIComponent#width
         */
        /**
         * 组件宽度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
         */
        width: number;
        $setWidth(value: number): boolean;
        /**
         * @member egret.gui.UIComponent#height
         */
        /**
         * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
         */
        height: number;
        $setHeight(value: number): boolean;
        $setScaleX(value: number): boolean;
        $setScaleY(value: number): boolean;
        /**
         * @member egret.gui.UIComponent#minWidth
         */
        minWidth: number;
        /**
         * @member egret.gui.UIComponent#maxWidth
         */
        maxWidth: number;
        _getMaxWidth(): number;
        /**
         * @member egret.gui.UIComponent#minHeight
         */
        minHeight: number;
        /**
         * @member egret.gui.UIComponent#maxHeight
         */
        maxHeight: number;
        /**
         * 组件的默认宽度（以像素为单位）。此值由 measure() 方法设置。
         * @member egret.gui.UIComponent#measuredWidth
         */
        measuredWidth: number;
        /**
         * 组件的默认高度（以像素为单位）。此值由 measure() 方法设置。
         * @member egret.gui.UIComponent#measuredHeight
         */
        measuredHeight: number;
        /**
         * @method egret.gui.UIComponent#setActualSize
         * @param w {number}
         * @param h {number}
         */
        setActualSize(w: number, h: number): void;
        $setX(value: number): boolean;
        $setY(value: number): boolean;
        /**
         * @method egret.gui.UIComponent#invalidateProperties
         */
        invalidateProperties(): void;
        /**
         * @method egret.gui.UIComponent#validateProperties
         */
        validateProperties(): void;
        /**
         * @method egret.gui.UIComponent#invalidateSize
         */
        invalidateSize(): void;
        /**
         * @method egret.gui.UIComponent#validateSize
         * @param recursive {boolean}
         */
        validateSize(recursive?: boolean): void;
        /**
         * 测量组件尺寸，返回尺寸是否发生变化
         */
        private measureSizes();
        /**
         * @method egret.gui.UIComponent#invalidateDisplayList
         */
        invalidateDisplayList(): void;
        /**
         * @method egret.gui.UIComponent#validateDisplayList
         */
        validateDisplayList(): void;
        /**
         * @method egret.gui.UIComponent#validateNow
         * @param skipDisplayList {boolean}
         */
        validateNow(skipDisplayList?: boolean): void;
        /**
         * 标记父级容器的尺寸和显示列表为失效
         * @method egret.gui.UIComponent#invalidateParentSizeAndDisplayList
         */
        invalidateParentSizeAndDisplayList(): void;
        /**
         * 更新显示列表
         * @method egret.gui.UIComponent#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * 是否可以跳过测量尺寸阶段,返回true则不执行measure()方法
         */
        canSkipMeasurement(): boolean;
        /**
         * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
         */
        commitProperties(): void;
        /**
         * 测量组件尺寸
         * @method egret.gui.UIComponent#measure
         */
        measure(): void;
        /**
         *  抛出移动事件
         */
        private dispatchMoveEvent();
        /**
         * 子项的xy位置发生改变
         */
        _childXYChanged(): void;
        /**
         *  抛出尺寸改变事件
         */
        private dispatchResizeEvent();
        /**
         * @member egret.gui.UIComponent#includeInLayout
         */
        includeInLayout: boolean;
        /**
         * @member egret.gui.UIComponent#left
         */
        left: number;
        /**
         * @member egret.gui.UIComponent#right
         */
        right: number;
        /**
         * @member egret.gui.UIComponent#top
         */
        top: number;
        /**
         * @member egret.gui.UIComponent#bottom
         */
        bottom: number;
        /**
         * @member egret.gui.UIComponent#horizontalCenter
         */
        horizontalCenter: number;
        /**
         * @member egret.gui.UIComponent#verticalCenter
         */
        verticalCenter: number;
        /**
         * @member egret.gui.UIComponent#percentWidth
         */
        percentWidth: number;
        /**
         * @member egret.gui.UIComponent#percentHeight
         */
        percentHeight: number;
        /**
         * @method egret.gui.UIComponent#setLayoutBoundsSize
         * @param layoutWidth {number}
         * @param layoutHeight {number}
         */
        setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void;
        /**
         * @method egret.gui.UIComponent#setLayoutBoundsPosition
         * @param x {number}
         * @param y {number}
         */
        setLayoutBoundsPosition(x: number, y: number): void;
        /**
         * @member egret.gui.UIComponent#preferredWidth
         */
        preferredWidth: number;
        /**
         * @member egret.gui.UIComponent#preferredHeight
         */
        preferredHeight: number;
        /**
         * @member egret.gui.UIComponent#preferredX
         */
        preferredX: number;
        /**
         * @member egret.gui.UIComponent#preferredY
         */
        preferredY: number;
        /**
         * @member egret.gui.UIComponent#layoutBoundsX
         */
        layoutBoundsX: number;
        /**
         * @member egret.gui.UIComponent#layoutBoundsY
         */
        layoutBoundsY: number;
        /**
         * @member egret.gui.UIComponent#layoutBoundsWidth
         */
        layoutBoundsWidth: number;
        /**
         * 组件的布局高度,常用于父级的updateDisplayList()方法中
         * 按照：布局高度>外部显式设置高度>测量高度 的优先级顺序返回高度
         * @member egret.gui.UIComponent#layoutBoundsHeight
         */
        layoutBoundsHeight: number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.SkinnableComponent
     * @classdesc
     * 复杂可设置外观组件的基类，接受ISkin类或任何显示对象作为皮肤。
     * 当皮肤为ISkin时，将自动匹配两个实例内同名的公开属性(显示对象)，
     * 并将皮肤的属性引用赋值到此类定义的同名属性(必须没有默认值)上,
     * 如果要对公共属性添加事件监听或其他操作，
     * 请覆盖partAdded()和partRemoved()方法
     * @extends egret.gui.UIComponent
     */
    class SkinnableComponent extends UIComponent implements ISkinnableClient {
        /**
         * 构造函数
         * @method egret.gui.SkinnableComponent#constructor
         */
        constructor();
        /**
         * 主机组件标识符。用于唯一确定一个组件的名称。
         * 用户自定义的组件若不对此属性赋值，将会继承父级的标识符定义。
         * @member {string} egret.gui.SkinnableComponent#hostComponentKey
         */
        hostComponentKey: string;
        /**
         * 外部显式设置了皮肤名
         */
        _skinNameExplicitlySet: any;
        _skinName: any;
        /**
         * 皮肤标识符。可以为Class,String,或DisplayObject实例等任意类型，具体规则由项目注入的素材适配器决定，
         * 适配器根据此属性值解析获取对应的显示对象，并赋值给skin属性。
         * @member {string} egret.gui.SkinnableComponent#skinName
         */
        skinName: any;
        _createChildrenCalled: boolean;
        /**
         * 创建该容器的子元素对象
         * @method egret.gui.SkinnableComponent#createChildren
         */
        createChildren(): void;
        /**
         * 皮肤解析适配器
         */
        private static skinAdapter;
        /**
         * 默认皮肤主题解析器
         */
        static _defaultTheme: Theme;
        /**
         * 解析skinName
         */
        private parseSkinName();
        /**
         * 获取皮肤适配器
         */
        private getSkinAdapter();
        _skin: any;
        /**
         * 皮肤对象实例。
         * @member egret.gui.SkinnableComponent#skin
         */
        skin: any;
        /**
         * 设置皮肤
         */
        _setSkin(skin: any): void;
        private skinLayoutEnabled;
        /**
         * 附加皮肤
         * @method egret.gui.SkinnableComponent#attachSkin
         * @param skin {any}
         */
        attachSkin(skin: any): void;
        /**
         * 匹配皮肤和主机组件的公共变量，并完成实例的注入。此方法在附加皮肤时会自动执行一次。
         * 若皮肤中含有延迟实例化的子部件，在子部件实例化完成时需要从外部再次调用此方法,完成注入。
         * @method egret.gui.SkinnableComponent#findSkinParts
         */
        findSkinParts(): void;
        /**
         * 卸载皮肤
         * @method egret.gui.SkinnableComponent#detachSkin
         * @param skin {any}
         */
        detachSkin(skin: any): void;
        /**
         * 若皮肤是ISkin,则调用此方法附加皮肤中的公共部件
         * @method egret.gui.SkinnableComponent#partAdded
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * 若皮肤是ISkin，则调用此方法卸载皮肤之前注入的公共部件
         * @method egret.gui.SkinnableComponent#partRemoved
         * @param partName {string}
         * @param instance {any}
         */
        partRemoved(partName: string, instance: any): void;
        private stateIsDirty;
        /**
         * 标记当前需要重新验证皮肤状态
         * @method egret.gui.SkinnableComponent#invalidateSkinState
         */
        invalidateSkinState(): void;
        /**
         * 子类覆盖此方法,应用当前的皮肤状态
         * @method egret.gui.SkinnableComponent#validateSkinState
         */
        validateSkinState(): void;
        private _autoMouseEnabled;
        /**
         * 在enabled属性发生改变时是否自动开启或禁用鼠标事件的响应。默认值为true。
         * @member egret.gui.SkinnableComponent#autoTouchEnabled
         */
        autoTouchEnabled: boolean;
        /**
         * 外部显式设置的mouseChildren属性值
         */
        private explicitMouseChildren;
        /**
         * @member egret.gui.SkinnableComponent#touchChildren
         */
        /**
         * @inheritDoc
         */
        touchChildren: boolean;
        /**
         * 外部显式设置的mouseEnabled属性值
         */
        private explicitMouseEnabled;
        /**
         * @member egret.gui.SkinnableComponent#touchEnabled
         */
        /**
         * @inheritDoc
         */
        touchEnabled: boolean;
        /**
         * @member egret.gui.SkinnableComponent#enabled
         */
        /**
         * @inheritDoc
         */
        enabled: boolean;
        $setEnabled(value: boolean): boolean;
        /**
         * 返回组件当前的皮肤状态名称,子类覆盖此方法定义各种状态名
         * @method egret.gui.SkinnableComponent#getCurrentSkinState
         * @returns {string}
         */
        getCurrentSkinState(): string;
        /**
         * 处理对组件设置的属性
         * @method egret.gui.SkinnableComponent#commitProperties
         */
        commitProperties(): void;
        /**
         *
         * @private
         */
        _childXYChanged(): void;
        /**
         * 计算组件的默认大小和（可选）默认最小大小
         */
        measure(): void;
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @method egret.gui.SkinnableComponent#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * 不支持此方法
         * @method egret.gui.SkinnableComponent#addChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#addChildAt
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#removeChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#removeChildAt
         * @deprecated
         * @param index {number}
         * @returns {DisplayObject}
         */
        removeChildAt(index: number): DisplayObject;
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#setChildIndex
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         */
        setChildIndex(child: DisplayObject, index: number): void;
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#swapChildren
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         */
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
         *  不支持此方法
         * @method egret.gui.SkinnableComponent#swapChildrenAt
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         */
        swapChildrenAt(index1: number, index2: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.SkinnableContainer
     * @classdesc
     * 可设置外观的容器的基类
     * @extends egret.gui.SkinnableComponent
     * @implements egret.gui.IVisualElementContainer
     */
    class SkinnableContainer extends SkinnableComponent implements IVisualElementContainer {
        /**
         * @method egret.gui.SkinnableContainer#constructor
         */
        constructor();
        /**
         * [SkinPart]实体容器
         * @member egret.gui.SkinnableContainer#contentGroup
         */
        contentGroup: Group;
        /**
         * 实体容器实例化之前缓存子对象的容器
         */
        _placeHolderGroup: Group;
        /**
         * 获取当前的实体容器
         */
        _getCurrentContentGroup(): Group;
        /**
         * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
         * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
         */
        elementsContent: Array<any>;
        /**
         */
        numElements: number;
        /**
         * 返回指定索引处的可视元素
         * @param index {number}
         * @returns {IVisualElement}
         */
        getElementAt(index: number): IVisualElement;
        /**
         * 将可视元素添加到此容器中
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        addElement(element: IVisualElement): IVisualElement;
        /**
         * 将可视元素添加到此容器中
         * @param element {IVisualElement}
         * @param index {number}
         * @returns {IVisualElement}
         */
        addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
         * 从此容器的子列表中删除指定的可视元素
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        removeElement(element: IVisualElement): IVisualElement;
        /**
         * 从容器中的指定索引位置删除可视元素
         * @param index {number}
         * @returns {IVisualElement}
         */
        removeElementAt(index: number): IVisualElement;
        /**
         * 删除容器中的所有子元素
         */
        removeAllElements(): void;
        /**
         * 获取子元素对象在容器中的索引值
         * @param element {IVisualElement}
         * @returns {number}
         */
        getElementIndex(element: IVisualElement): number;
        /**
         * 根据索引设置子元素的显示
         * @param element {IVisualElement}
         * @param index {number}
         */
        setElementIndex(element: IVisualElement, index: number): void;
        /**
         * 交换两个指定可视元素的索引
         * @param element1 {IVisualElement}
         * @param element2 {IVisualElement}
         */
        swapElements(element1: IVisualElement, element2: IVisualElement): void;
        /**
         * 交换容器中位于两个指定索引位置的可视元素
         * @param index1 {number}
         * @param index2 {number}
         */
        swapElementsAt(index1: number, index2: number): void;
        /**
         * contentGroup发生改变时传递的参数
         */
        private contentGroupProperties;
        /**
         * 此容器的布局对象
         * @member egret.gui.SkinnableContainer#layout
         */
        layout: LayoutBase;
        /**
         * @copy egret.gui.GroupBase#autoLayout
         */
        autoLayout: boolean;
        /**
         * [覆盖] 添加外观部件时调用
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * [覆盖] 正删除外观部件的实例时调用
         * @param partName {string}
         * @param instance {any}
         */
        partRemoved(partName: string, instance: any): void;
        /**
         * 容器添加元素事件
         */
        _contentGroup_elementAddedHandler(event: ElementExistenceEvent): void;
        /**
         * 容器移除元素事件
         */
        _contentGroup_elementRemovedHandler(event: ElementExistenceEvent): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Panel
     * @classdesc
     * 带有标题，内容区域的面板组件
     * @extends egret.gui.SkinnableContainer
     */
    class Panel extends SkinnableContainer {
        /**
         * 构造函数
         * @method egret.gui.Panel#constructor
         */
        constructor();
        /**
         * [SkinPart]标题显示对象
         * @member egret.gui.Panel#titleDisplay
         */
        titleDisplay: IDisplayText;
        private _title;
        /**
         * 标题内容改变
         */
        private titleChanged;
        /**
         * 标题文本内容
         * @member egret.gui.Panel#title
         */
        title: string;
        /**
         * [覆盖] 添加外观部件时调用
         * @param partName
         * @param instance
         */
        partAdded(partName: string, instance: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TitleWindow
     * @classdesc
     * 可移动窗口组件。注意，此窗口必须使用PopUpManager.addPopUp()弹出之后才能移动。
     * @extends egret.gui.Panel
     */
    class TitleWindow extends Panel {
        /**
         * @method egret.gui.TitleWindow#constructor
         */
        constructor();
        /**
         * 在窗体上按下时前置窗口
         */
        private onWindowMouseDown(event);
        /**
         * [SkinPart]关闭按钮
         * @member egret.gui.TitleWindow#closeButton
         */
        closeButton: Button;
        /**
         * [SkinPart]可移动区域
         * @member egret.gui.TitleWindow#moveArea
         */
        moveArea: DisplayObject;
        private _showCloseButton;
        /**
         * 是否显示关闭按钮,默认true。
         * @member egret.gui.TitleWindow#showCloseButton
         */
        showCloseButton: boolean;
        private _autoBackToStage;
        /**
         * 在拖拽窗口时，有可能把窗口完全拖出屏幕外，导致无法点中moveArea而不能拖回屏幕。
         * 此属性为true时，将会在拖拽结束时，自动调整窗口位置，使moveArea可以被再次点中。
         * 反之不调整。默认值为true。
         * @member egret.gui.TitleWindow#autoBackToStage
         */
        autoBackToStage: boolean;
        /**
         * [覆盖] 添加外观部件时调用
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * [覆盖] 正删除外观部件的实例时调用
         * @method egret.gui.TitleWindow#partRemoved
         * @param partName {string}
         * @param instance {any}
         */
        partRemoved(partName: string, instance: any): void;
        /**
         * @method egret.gui.TitleWindow#closeButton_clickHandler
         * @param event {TouchEvent}
         */
        closeButton_clickHandler(event: TouchEvent): void;
        /**
         * 鼠标按下时的偏移量
         */
        private _offsetPointX;
        private _offsetPointY;
        /**
         * 鼠标在可移动区域按下
         * @method egret.gui.TitleWindow#moveArea_mouseDownHandler
         * @param event {TouchEvent}
         */
        moveArea_mouseDownHandler(event: TouchEvent): void;
        /**
         * 鼠标拖拽时的移动事件
         * @method egret.gui.TitleWindow#moveArea_mouseMoveHandler
         * @param event {TouchEvent}
         */
        moveArea_mouseMoveHandler(event: TouchEvent): void;
        /**
         * 鼠标在舞台上弹起事件
         * @method egret.gui.TitleWindow#moveArea_mouseUpHandler
         * @param event {Event}
         */
        moveArea_mouseUpHandler(event: Event): void;
        /**
         * 调整窗口位置，使其可以在舞台中被点中
         */
        private adjustPosForStage();
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Alert
     * @classdesc
     * 弹出对话框，可能包含消息、标题、按钮（“确定”、“取消”、“是”和“否”的任意组合)。
     * @extends egret.gui.TitleWindow
     */
    class Alert extends TitleWindow {
        /**
         * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为firstButton。
         * @constant egret.gui.Alert.FIRST_BUTTON
         */
        static FIRST_BUTTON: string;
        /**
         * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为secondButton。
         * @constant egret.gui.Alert.SECOND_BUTTON
         */
        static SECOND_BUTTON: string;
        /**
         * 当对话框关闭时，closeEvent.detail的值若等于此属性,表示被点击的按钮为closeButton。
         * @constant egret.gui.Alert.CLOSE_BUTTON
         */
        static CLOSE_BUTTON: string;
        /**
         * 弹出Alert控件的静态方法。在Alert控件中选择一个按钮，将关闭该控件。
         * @method egret.gui.Alert.show
         * @param text {string} 要显示的文本内容字符串。
         * @param title {string} 对话框标题
         * @param closeHandler {Function} 按下Alert控件上的任意按钮时的回调函数。示例:closeHandler(event:CloseEvent);
         * event的detail属性包含 Alert.FIRST_BUTTON、Alert.SECOND_BUTTON和Alert.CLOSE_BUTTON。
         * @param firstButtonLabel {string} 第一个按钮上显示的文本。
         * @param secondButtonLabel {string} 第二个按钮上显示的文本，若为null，则不显示第二个按钮。
         * @param modal {boolean} 是否启用模态。即禁用弹出框以下的鼠标事件。默认true。
         * @param center {boolean} 是否居中。默认true。
         * @param thisObject {any} 回掉函数绑定的this对象
         * @returns {Alert}
         */
        static show(text?: string, title?: string, closeHandler?: Function, firstButtonLabel?: string, secondButtonLabel?: string, modal?: boolean, center?: boolean, thisObject?: any): Alert;
        /**
         * 构造函数，请通过静态方法Alert.show()来创建对象实例。
         * @method egret.gui.Alert#constructor
         */
        constructor();
        private _firstButtonLabel;
        /**
         * 第一个按钮上显示的文本
         * @member egret.gui.Alert#firstButtonLabel
         */
        firstButtonLabel: string;
        /**
         *
         * @type {string}
         * @private
         */
        private _secondButtonLabel;
        /**
         * 第二个按钮上显示的文本
         * @member egret.gui.Alert#secondButtonLabel
         */
        secondButtonLabel: string;
        /**
         *
         * @type {string}
         * @private
         */
        private _contentText;
        /**
         * 文本内容
         * @member egret.gui.Alert#contentText
         */
        contentText: string;
        /**
         * 对话框关闭回调函数
         */
        private closeHandler;
        /**
        * 对话框关闭回调函数对应的this对象
        */
        private thisObject;
        /**
         * 关闭事件
         */
        private onClose(event);
        /**
         * @method egret.gui.Alert#closeButton_clickHandler
         * @param event {TouchEvent}
         */
        closeButton_clickHandler(event: TouchEvent): void;
        private callCloseHandler(closeEvent);
        /**
         * [SkinPart]文本内容显示对象
         * @member egret.gui.Alert#contentDisplay
         */
        contentDisplay: IDisplayText;
        /**
         * [SkinPart]第一个按钮，通常是"确定"。
         * @member egret.gui.Alert#firstButton
         */
        firstButton: Button;
        /**
         * [SkinPart]第二个按钮，通常是"取消"。
         * @member egret.gui.Alert#secondButton
         */
        secondButton: Button;
        /**
         * 添加外观部件时调用
         * @method egret.gui.Alert#partAdded
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * 删除外观部件的实例时调用
         * @method egret.gui.Alert#partRemoved
         * @param partName {string}
         * @param instance {any}
         */
        partRemoved(partName: string, instance: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.BitmapLabel
     * @classdesc
     * 一行或多行不可编辑的位图文本控件
     * @extends egret.gui.UIComponent
     */
    class BitmapLabel extends UIComponent implements IDisplayText {
        private _bitmapText;
        /**
         * @method egret.gui.Label#constructor
         */
        constructor();
        /**
         * 一个验证阶段完成
         */
        private updateCompleteHandler(event);
        private _textChanged;
        private _text;
        /**
         * @member egret.gui.BitmapLabel#text
         * 设置或获取显示文本
         */
        text: string;
        private fontChanged;
        _font: any;
        /**
         * 位图字体标识符，可以是BitmapFont对象或者在资源表中的key。
         * @member egret.gui.BitmapLabel#font
         */
        font: any;
        private _isLetterSpacingChanged;
        _letterSpacing: number;
        /**
         * 字符之间的距离
         * @default 0
         * @param value
         */
        letterSpacing: number;
        _setLetterSpacing(value: number): void;
        private _isLineSpacingChanged;
        _lineSpacing: number;
        /**
         * 行与行之间的距离
         * @default 0
         * @param value
         */
        lineSpacing: number;
        _setLineSpacing(value: number): void;
        private createChildrenCalled;
        /**
         * 创建子对象
         */
        createChildren(): void;
        /**
         * 皮肤解析适配器
         */
        private static assetAdapter;
        /**
         * 解析source
         */
        private parseFont();
        /**
         * 获取资源适配器
         */
        private getAdapter();
        /**
         * 皮肤发生改变
         */
        private onFontChanged(bitmapFont, font);
        /**
         * 上一次测量的宽度
         */
        private lastUnscaledWidth;
        private _padding;
        /**
         * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
         * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
         * @member egret.gui.BitmapLabel#padding
         */
        padding: number;
        private _paddingLeft;
        /**
         * 文字距离左边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingLeft
         */
        paddingLeft: number;
        /**
         *
         * @type {number}
         * @private
         */
        private _paddingRight;
        /**
         * 文字距离右边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingRight
         */
        paddingRight: number;
        /**
         *
         * @type {number}
         * @private
         */
        private _paddingTop;
        /**
         * 文字距离顶部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingTop
         */
        paddingTop: number;
        /**
         *
         * @type {number}
         * @private
         */
        private _paddingBottom;
        /**
         * 文字距离底部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.BitmapLabel#paddingBottom
         */
        paddingBottom: number;
        /**
         * 计算  容器默认大小的最小值和最大值
         * @method egret.gui.BitmapLabel#measure
         */
        measure(): void;
        /**
         * 特殊情况，组件尺寸由父级决定，要等到父级UpdateDisplayList的阶段才能测量
         */
        private isSpecialCase();
        /**
         * 使用指定的宽度进行测量
         */
        private measureUsingWidth(w);
        /**
         * 通过设置此容器子项的位置和大小来响应大小更改
         * @method egret.gui.BitmapLabel#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        private checkBitmapText();
        /**
         * 处理对组件设置的属性
         */
        commitProperties(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ButtonBase
     * @classdesc
     * 按钮组件基类
     * @extends egret.gui.SkinnableComponent
     */
    class ButtonBase extends SkinnableComponent {
        /**
         * 构造函数
         * @method egret.gui.ButtonBase#constructor
         */
        constructor();
        /**
         * 已经开始过不断抛出buttonDown事件的标志
         */
        private _downEventFired;
        /**
         * 重发buttonDown事件计时器
         */
        private autoRepeatTimer;
        /**
         * [SkinPart]按钮上的文本标签
         * @member egret.gui.ButtonBase#labelDisplay
         */
        labelDisplay: IDisplayText;
        private _autoRepeat;
        /**
         * 指定在用户按住鼠标按键时是否重复分派 buttonDown 事件。
         * @member egret.gui.ButtonBase#autoRepeat
         */
        autoRepeat: boolean;
        private _repeatDelay;
        /**
         * 在第一个 buttonDown 事件之后，以及相隔每个 repeatInterval 重复一次 buttonDown 事件之前，需要等待的毫秒数。
         * @member egret.gui.ButtonBase#repeatDelay
         */
        repeatDelay: number;
        private _repeatInterval;
        /**
         * 用户在按钮上按住鼠标时，buttonDown 事件之间相隔的毫秒数。
         * @member egret.gui.ButtonBase#repeatInterval
         */
        repeatInterval: number;
        private _hovered;
        /**
         * 指示鼠标指针是否位于按钮上。
         * @member egret.gui.ButtonBase#hovered
         */
        hovered: boolean;
        private _keepDown;
        /**
         * 强制让按钮停在鼠标按下状态,此方法不会导致重复抛出buttonDown事件,仅影响皮肤State。
         * @method egret.gui.ButtonBase#_keepDown
         * @param down {boolean} 是否按下
         */
        _setKeepDown(down: boolean): void;
        private _label;
        /**
         * 要在按钮上显示的文本
         * @member egret.gui.ButtonBase#label
         */
        label: string;
        _getLabel(): string;
        _setLabel(value: string): void;
        private _mouseCaptured;
        /**
         * 指示第一次分派 MouseEvent.MOUSE_DOWN 时，是否按下鼠标以及鼠标指针是否在按钮上。
         * @member egret.gui.ButtonBase#mouseCaptured
         */
        mouseCaptured: boolean;
        private _stickyHighlighting;
        /**
         * 如果为 false，则按钮会在用户按下它时显示其鼠标按下时的外观，但在用户将鼠标拖离它时将改为显示鼠标经过的外观。
         * 如果为 true，则按钮会在用户按下它时显示其鼠标按下时的外观，并在用户将鼠标拖离时继续显示此外观。
         * @member egret.gui.ButtonBase#stickyHighlighting
         */
        stickyHighlighting: boolean;
        /**
         * 开始抛出buttonDown事件
         */
        private checkButtonDownConditions();
        /**
         * 添加鼠标事件监听
         * @method egret.gui.ButtonBase#addHandlers
         */
        addHandlers(): void;
        /**
         * 添加舞台鼠标弹起事件监听
         */
        private addStageMouseHandlers();
        /**
         * 移除舞台鼠标弹起事件监听
         */
        private removeStageMouseHandlers();
        /**
         * 按钮是否是按下的状态
         */
        private isDown();
        /**
         * 检查需要启用还是关闭重发计时器
         */
        private checkAutoRepeatTimerConditions(buttonDown);
        /**
         * 启动重发计时器
         */
        private startTimer();
        /**
         * 停止重发计时器
         */
        private stopTimer();
        /**
         * 鼠标事件处理
         * @method egret.gui.ButtonBase#mouseEventHandler
         * @param event {Event}
         */
        mouseEventHandler(event: Event): void;
        /**
         * 按钮弹起事件
         * @method egret.gui.ButtonBase#buttonReleased
         */
        buttonReleased(): void;
        /**
         * 按钮点击事件
         * @method egret.gui.ButtonBase#clickHandler
         * @param event {TouchEvent}
         */
        clickHandler(event: TouchEvent): void;
        /**
         * 舞台上鼠标弹起事件
         */
        private stage_mouseUpHandler(event);
        /**
         * 自动重发计时器首次延迟结束事件
         */
        private autoRepeat_timerDelayHandler(event);
        /**
         * 自动重发buttonDown事件
         */
        private autoRepeat_timerHandler(event);
        /**
         * 返回要应用到外观的状态的名称
         * @method egret.gui.ButtonBase#getCurrentSkinState
         * @returns {string}
         */
        getCurrentSkinState(): string;
        /**
         * 添加外观部件时调用
         * @param partName
         * @param instance
         */
        partAdded(partName: string, instance: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Button
     * @classdesc
     * 按钮控件
     * @extends egret.gui.ButtonBase
     */
    class Button extends ButtonBase {
        /**
         * @method egret.gui.Button#constructor
         */
        constructor();
        /**
         * [SkinPart]按钮上的文本标签
         * @member egret.gui.ButtonBase#labelDisplay
         */
        iconDisplay: UIAsset;
        private _icon;
        /**
         * 要在按钮上显示的图标
         * @member egret.gui.ButtonBase#icon
         */
        icon: any;
        /**
         *
         * @returns {any}
         * @private
         */
        _getIcon(): any;
        /**
         *
         * @param value
         * @private
         */
        _setIcon(value: any): void;
        /**
         * 添加外观部件时调用
         * @method egret.gui.ButtonBase#partAdded
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Skin
     * @classdesc
     * 含有视图状态功能的皮肤基类。
     * @extends egret.EventDispatcher
     * @implements egret.gui.IStateClient
     * @implements egret.gui.ISkin
     * @implements egret.gui.IContainer
     */
    class Skin extends EventDispatcher implements IStateClient, ISkin, IContainer {
        /**
         * 构造函数
         * @method egret.gui.Skin#constructor
         */
        constructor();
        /**
         * 组件的最大测量宽度,仅影响measuredWidth属性的取值范围。
         * @member egret.gui.Skin#maxWidth
         */
        maxWidth: number;
        /**
         * 组件的最小测量宽度,此属性设置为大于maxWidth的值时无效。仅影响measuredWidth属性的取值范围。
         * @member egret.gui.Skin#minWidth
         */
        minWidth: number;
        /**
         * 组件的最大测量高度,仅影响measuredHeight属性的取值范围。
         * @member egret.gui.Skin#maxHeight
         */
        maxHeight: number;
        /**
         * 组件的最小测量高度,此属性设置为大于maxHeight的值时无效。仅影响measuredHeight属性的取值范围。
         * @member egret.gui.Skin#minHeight
         */
        minHeight: number;
        _hasWidthSet: boolean;
        _width: number;
        /**
         * 组件宽度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
         * @member egret.gui.Skin#width
         */
        width: number;
        _hasHeightSet: boolean;
        _height: number;
        /**
         * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
         * @member egret.gui.Skin#height
         */
        height: number;
        /**
         * 组件的默认宽度（以像素为单位）。此值由 measure() 方法设置。
         * @member egret.gui.Skin#measuredWidth
         */
        _measuredWidth: number;
        measuredWidth: number;
        /**
         * 组件的默认高度（以像素为单位）。此值由 measure() 方法设置。
         * @member egret.gui.Skin#measuredHeight
         */
        measuredHeight: number;
        preferredWidth: number;
        preferredHeight: number;
        private _initialized;
        /**
         * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
         * 请务必调用super.createChildren()以完成父类组件的初始化
         * @method egret.gui.Skin#createChildren
         */
        createChildren(): void;
        private _hostComponent;
        /**
         * @member egret.gui.Skin#hostComponent
         */
        /**
         * @inheritDoc
         */
        hostComponent: SkinnableComponent;
        /**
         *
         * @param value
         * @private
         */
        _setHostComponent(value: SkinnableComponent): void;
        private _elementsContent;
        /**
         * 返回子元素列表
         */
        _getElementsContent(): Array<any>;
        /**
         * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
         * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
         */
        elementsContent: Array<any>;
        /**
         * @member egret.gui.Skin#numElements
         */
        numElements: number;
        /**
         * 如果存在视域，且传入的索引为 0，则返回该视域
         * @method egret.gui.Skin#getElementAt
         * @param index {number}
         * @returns {IVisualElement}
         */
        getElementAt(index: number): IVisualElement;
        private checkForRangeError(index, addingElement?);
        /**
         * 将可视元素添加到此容器中
         * @method egret.gui.Skin#addElement
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        addElement(element: IVisualElement): IVisualElement;
        /**
         * 将可视元素添加到此容器中
         * @method egret.gui.Skin#addElementAt
         * @param element {IVisualElement}
         * @param index {number}
         * @returns {IVisualElement}
         */
        addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
         * 从此容器的子列表中删除指定的可视元素
         * @method egret.gui.Skin#removeElement
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        removeElement(element: IVisualElement): IVisualElement;
        /**
         * 从容器中的指定索引位置删除可视元素
         * @method egret.gui.Skin#removeElementAt
         * @param index {number}
         * @returns {IVisualElement}
         */
        removeElementAt(index: number): IVisualElement;
        /**
         * 返回可视元素的索引位置
         * @method egret.gui.Skin#getElementIndex
         * @param element {IVisualElement}
         * @returns {number}
         */
        getElementIndex(element: IVisualElement): number;
        /**
         * 按照索引添加到容器
         * @method egret.gui.Skin#setElementIndex
         * @param element {IVisualElement}
         * @param index {number}
         */
        setElementIndex(element: IVisualElement, index: number): void;
        /**
         * 添加一个显示元素到容器
         * @param element {IVisualElement}
         * @param index {number}
         * @param notifyListeners {boolean}
         */
        _elementAdded(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        /**
         * 从容器移除一个显示元素
         * @param element {IVisualElement}
         * @param index {number}
         * @param notifyListeners {boolean}
         */
        _elementRemoved(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        private skinLayout;
        /**
         * 测量组件尺寸
         * @method egret.gui.Skin#measure
         */
        measure(): void;
        /**
         * 更新显示列表
         * @method egret.gui.Skin#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        private _states;
        /**
         * 为此组件定义的视图状态。
         * @member egret.StateClientHelper#states
         */
        states: Array<any>;
        _setStates(value: Array<any>): void;
        /**
         * 当前的过渡效果
         */
        private _currentTransition;
        private _transitions;
        /**
         *  一个 Transition 对象 Array，其中的每个 Transition 对象都定义一组效果，
         * 用于在视图状态发生更改时播放。
         */
        transitions: Array<Transition>;
        /**
         * 播放过渡效果的标志
         */
        private playStateTransition;
        private transitionFromState;
        private transitionToState;
        /**
         * 当前视图状态发生改变的标志
         */
        private currentStateChanged;
        private _currentState;
        /**
         * 存储还未验证的视图状态
         */
        private requestedCurrentState;
        /**
         * 组件的当前视图状态。将其设置为 "" 或 null 可将组件重置回其基本状态。
         * @member egret.StateClientHelper#currentState
         */
        currentState: string;
        /**
         * 返回是否含有指定名称的视图状态
         * @method egret.gui.Skin#hasState
         * @param stateName {string}
         * @returns {boolean}
         */
        hasState(stateName: string): boolean;
        /**
         * 返回默认状态
         */
        private getDefaultState();
        /**
         * 应用当前的视图状态。子类覆盖此方法在视图状态发生改变时执行相应更新操作。
         * @method egret.gui.Skin#commitCurrentState
         */
        commitCurrentState(): void;
        private transition_effectEndHandler(event);
        /**
         * 通过名称返回视图状态
         */
        private getState(stateName);
        /**
         * 移除指定的视图状态以及所依赖的所有父级状态，除了与新状态的共同状态外
         */
        private removeState(stateName);
        /**
         * 应用新状态
         */
        private applyState(stateName);
        private initialized;
        /**
         * 初始化所有视图状态
         * @method egret.StateClientHelper#initializeStates
         */
        initializeStates(): void;
        /**
         *  获取两个状态之间的过渡
         */
        private getTransition(oldState, newState);
        /**
         * 效果的总持续时间
         */
        private getTotalDuration(effect);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.StateSkin
     * @classdesc
     * 按钮组件的快速皮肤模板，能够快速制定哪个状态显示那个资源，实例化一次性专用的按钮皮肤。
     * @extends egret.gui.Skin
     */
    class ButtonSkin extends Skin {
        /**
         * 构造函数
         * @method egret.gui.StateSkin#constructor
         * @param upSkinName {any} 按钮弹起状态的要显示的资源名
         * @param downSkinName {any} 按钮按下状态的要显示的资源名
         * @param disabledSkinName {any} 按钮禁用状态的要显示的资源名
         */
        constructor(upSkinName?: any, downSkinName?: any, disabledSkinName?: any);
        /**
         *
         * @type {string[]}
         * @private
         */
        private static _skinParts;
        skinParts: Array<string>;
        private stateMap;
        private backgroundAsset;
        labelDisplay: Label;
        iconDisplay: UIAsset;
        /**
         * 创建容器的子对象
         * @inheritDoc
         */
        createChildren(): void;
        /**
         * @inheritDoc
         */
        commitCurrentState(): void;
        /**
         * 计算 Panel 容器默认大小的最小值和最大值
         */
        measure(): void;
        /**
         * 通过设置此容器子项的位置和大小来响应大小更改
         * @param unscaledWidth
         * @param unscaledHeight
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ToggleButtonBase
     * @classdesc
     * 切换按钮组件基类
     * @extends egret.gui.ButtonBase
     */
    class ToggleButtonBase extends ButtonBase {
        /**
         * 构造函数
         * @method egret.gui.ToggleButtonBase#constructor
         */
        constructor();
        /**
         *
         * @type {boolean}
         * @private
         */
        _selected: boolean;
        /**
         * 按钮处于按下状态时为 true，而按钮处于弹起状态时为 false。
         * @member egret.gui.ToggleButtonBase#selected
         */
        selected: boolean;
        /**
         *
         * @param value
         * @private
         */
        _setSelected(value: boolean): void;
        /**
         * 返回要应用到外观的状态的名称
         * @method egret.gui.ToggleButtonBase#getCurrentSkinState
         * @returns {string}
         */
        getCurrentSkinState(): string;
        /**
         * 是否根据鼠标事件自动变换选中状态,默认true。仅框架内使用。
         * @private
         */
        _autoSelected: boolean;
        /**
         * 当在用户单击按钮之后处理 MouseEvent.MOUSE_UP 事件时，将调用此方法
         */
        buttonReleased(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.CheckBox
     * @classdesc
     * 复选框
     * @extends egret.gui.ToggleButtonBase
     */
    class CheckBox extends ToggleButtonBase {
        /**
         * 构造函数
         * @method egret.gui.CheckBox#constructor
         */
        constructor();
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ClassFactory
     * @classdesc ClassFactory 实例是一个“工厂对象”，Egret 可用其生成其他类的实例，每个实例拥有相同的属性。
     * @extends egret.HashObject
     */
    class ClassFactory extends HashObject implements IFactory {
        /**
         * @method egret.gui.ClassFactory#constructor
         * @param generator {any} newInstance() 方法根据工厂对象生成对象时使用的 Class。
         */
        constructor(generator?: any);
        /**
         * newInstance() 方法根据工厂对象生成对象时使用的 Class。
         * @member egret.egret#generator
         */
        generator: any;
        /**
         * 生产一个新的实例
         * @method egret.egret#newInstance
         * @returns {any}
         */
        newInstance(): any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ItemRenderer
     * @classdesc
     * 项呈示器基类
     * @extends egret.gui.ButtonBase
     * @implements egret.gui.IItemRenderer
     */
    class ItemRenderer extends ButtonBase implements IItemRenderer {
        /**
         * 构造函数
         * @method egret.gui.ItemRenderer#constructor
         */
        constructor();
        private dataChangedFlag;
        private _data;
        /**
         * @member egret.gui.ItemRenderer#data
         */
        data: any;
        /**
         * 子类复写此方法以在data数据源发生改变时跟新显示列表。
         * 与直接复写_data的setter方法不同，它会确保在皮肤已经附加完成后再被调用。
         * @method egret.gui.ItemRenderer#dataChanged
         */
        dataChanged(): void;
        private _selected;
        /**
         * @member egret.gui.ItemRenderer#selected
         */
        selected: boolean;
        private _itemIndex;
        /**
         * @member egret.gui.ItemRenderer#itemIndex
         */
        itemIndex: number;
        /**
         * 处理对组件设置的属性
         * @method egret.gui.ItemRenderer#commitProperties
         */
        commitProperties(): void;
        /**
         * 返回要应用到呈示器的状态的名称
         * @method egret.gui.ItemRenderer#getCurrentSkinState
         * @returns {string}
         */
        getCurrentSkinState(): string;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.GroupBase
     * @classdesc
     * 自动布局容器基类
     * @extends egret.gui.UIComponent
     * @implements egret.gui.IViewport
     */
    class GroupBase extends UIComponent implements IViewport {
        /**
         * 构造函数
         * @method egret.gui.GroupBase#constructor
         */
        constructor();
        /**
         * 如果尚未设置布局对象，则 createChildren() 会为该容器指定默认布局对象 BasicLayout
         * @method egret.gui.GroupBase#createChildren
         */
        createChildren(): void;
        private _contentWidth;
        /**
         * 视域的内容的宽度
         * @member egret.gui.GroupBase#contentWidth
         */
        contentWidth: number;
        /**
         * 设置setContentWidth
         * @param value
         */
        private setContentWidth(value);
        private _contentHeight;
        /**
         * 视域的内容的高度
         * @member egret.gui.GroupBase#contentHeight
         */
        contentHeight: number;
        /**
         * 设置ContentHeight
         * @param value
         */
        private setContentHeight(value);
        /**
         * 设置 contentWidth 和 contentHeight 属性，此方法由Layout类调用
         * @method egret.gui.GroupBase#setContentSize
         * @private
         *
         * @param width {number}
         * @param height {number}
         */
        setContentSize(width: number, height: number): void;
        _layout: LayoutBase;
        /**
         * 此容器的布局对象
         * @member egret.gui.GroupBase#layout
         */
        layout: LayoutBase;
        _setLayout(value: LayoutBase): void;
        private _clipAndEnableScrolling;
        /**
         * 如果为 true，指定将子代剪切到视区的边界。如果为 false，则容器子代会从容器边界扩展过去，而不管组件的大小规范。默认false
         * @member egret.gui.GroupBase#clipAndEnableScrolling
         */
        clipAndEnableScrolling: boolean;
        private _autoLayout;
        /**
         * 如果为 true，则子项的位置和大小改变时，重新测量和布局。
         * 如果为 false，则仅当子项添加或者删除时，重新测量和布局。
         * @member egret.gui.GroupBase#autoLayout
         */
        autoLayout: boolean;
        private _horizontalScrollPosition;
        /**
         * 可视区域水平方向起始点
         * @member egret.gui.GroupBase#horizontalScrollPosition
         */
        horizontalScrollPosition: number;
        private _verticalScrollPosition;
        /**
         * 可视区域竖直方向起始点
         * @member egret.gui.GroupBase#verticalScrollPosition
         */
        verticalScrollPosition: number;
        /**
         * 滚动条位置改变
         */
        private scrollPositionChanged();
        /**
         * 更新可视区域
         * @param w {number}
         * @param h {number}
         */
        private updateScrollRect(w, h);
        /**
         * 计算组件的默认大小和（可选）默认最小大小
         * @method egret.gui.GroupBase#measure
         */
        measure(): void;
        /**
         * 在更新显示列表时是否需要更新布局标志
         */
        _layoutInvalidateDisplayListFlag: boolean;
        /**
         * 标记需要更新显示列表但不需要更新布局
         */
        _invalidateDisplayListExceptLayout(): void;
        /**
         * 标记组件，以便在稍后屏幕更新期间调用该组件的 updateDisplayList() 方法
         * @method egret.gui.GroupBase#invalidateDisplayList
         */
        invalidateDisplayList(): void;
        _childXYChanged(): void;
        /**
         * 在测量尺寸时是否需要测量布局的标志
         */
        _layoutInvalidateSizeFlag: boolean;
        /**
         * 标记需要更新显示列表但不需要更新布局
         */
        _invalidateSizeExceptLayout(): void;
        /**
         * 标记组件，以便在稍后屏幕更新期间调用该组件的 measure() 方法
         * @method egret.gui.GroupBase#invalidateSize
         */
        invalidateSize(): void;
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @param unscaledWidth
         * @param unscaledHeight
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * 此容器中的可视元素的数量。
         * @member egret.gui.GroupBase#numElements
         */
        numElements: number;
        /**
         * 返回指定索引处的可视元素。
         * @method egret.gui.GroupBase#getElementAt
         * @param index {number} 要检索的元素的索引。
         * @returns {IVisualElement}
         */
        getElementAt(index: number): IVisualElement;
        /**
         * 返回可视元素的索引位置。若不存在，则返回-1。
         * @method egret.gui.GroupBase#getElementIndex
         * @param element {IVisualElement} 可视元素。
         * @returns {number}
         */
        getElementIndex(element: IVisualElement): number;
        /**
         * 返回在容器可视区域内的布局元素索引列表,此方法忽略不是布局元素的普通的显示对象
         * @method egret.gui.GroupBase#getElementIndicesInView
         * @returns {number}
         */
        getElementIndicesInView(): Array<number>;
        /**
         * 在支持虚拟布局的容器中，设置容器内可见的子元素索引范围。此方法在不支持虚拟布局的容器中无效。
         * 通常在即将连续调用getVirtualElementAt()之前需要显式设置一次，以便容器提前释放已经不可见的子元素。
         * @method egret.gui.GroupBase#setVirtualElementIndicesInView
         * @param startIndex {number} 可视元素起始索引
         * @param endIndex {number} 可视元素结束索引
         */
        setVirtualElementIndicesInView(startIndex: number, endIndex: number): void;
        /**
         * 支持useVirtualLayout属性的布局类在updateDisplayList()中使用此方法来获取“处于视图中”的布局元素
         * @method egret.gui.GroupBase#getVirtualElementAt
         * @param index {number} 要检索的元素的索引。
         * @returns {IVisualElement}
         */
        getVirtualElementAt(index: number): IVisualElement;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.DataGroup
     * @classdesc
     * 数据项目的容器基类
     * 将数据项目转换为可视元素以进行显示。
     * @extends egret.gui.GroupBase
     */
    class DataGroup extends GroupBase {
        /**
         * 构造函数
         * @method egret.gui.DataGroup#constructor
         */
        constructor();
        /**
         * @method egret.gui.DataGroup.defaultRendererFactory
         * @param ClassFactory {any}
         */
        static defaultRendererFactory: ClassFactory;
        /**
         * 项呈示器的主机组件
         */
        _rendererOwner: IItemRendererOwner;
        private useVirtualLayoutChanged;
        /**
         * @member egret.gui.DataGroup#layout
         */
        /**
         * @inheritDoc
         */
        layout: LayoutBase;
        /**
         * 是否使用虚拟布局标记改变
         */
        private layout_useVirtualLayoutChangedHandler(event);
        /**
         * 存储当前可见的项呈示器索引列表
         */
        private virtualRendererIndices;
        /**
         * @method egret.gui.DataGroup#setVirtualElementIndicesInView
         * @param startIndex {number}
         * @param endIndex {number}
         */
        setVirtualElementIndicesInView(startIndex: number, endIndex: number): void;
        /**
         * @method egret.gui.DataGroup#getVirtualElementAt
         * @param index {number}
         * @returns {IVisualElement}
         */
        getVirtualElementAt(index: number): IVisualElement;
        private rendererToClassMap;
        private freeRenderers;
        /**
         * 释放指定索引处的项呈示器
         */
        private freeRendererByIndex(index);
        /**
         * 释放指定的项呈示器
         */
        private doFreeRenderer(renderer);
        /**
         * 是否创建了新的项呈示器标志
         */
        private createNewRendererFlag;
        /**
         * 标记组件，以便在稍后屏幕更新期间调用该组件的 measure() 方法
         * @method egret.gui.DataGroup#invalidateSize
         */
        invalidateSize(): void;
        /**
         * 为指定索引创建虚拟的项呈示器
         */
        private createVirtualRenderer(index);
        /**
         * 根据rendererClass创建一个Renderer,并添加到显示列表
         */
        private createOneRenderer(rendererFactory);
        /**
         * 设置项呈示器的默认皮肤
         */
        private setItemRenderSkinName(renderer);
        private cleanTimer;
        /**
         * 虚拟布局结束清理不可见的项呈示器
         */
        private finishVirtualLayout();
        /**
         * 延迟清理多余的在显示列表中的ItemRenderer。
         */
        private cleanAllFreeRenderer(event?);
        /**
         * @method egret.gui.DataGroup#getElementIndicesInView
         * @returns {number}
         */
        getElementIndicesInView(): Array<number>;
        /**
         * 更改是否使用虚拟布局
         */
        private changeUseVirtualLayout();
        private dataProviderChanged;
        private _dataProvider;
        /**
         * 列表数据源，请使用实现了ICollection接口的数据类型，例如ArrayCollection
         * @member egret.gui.DataGroup#dataProvider
         */
        dataProvider: ICollection;
        /**
         * 移除数据源监听
         */
        private removeDataProviderListener();
        /**
         * 数据源改变事件处理
         */
        private onCollectionChange(event);
        /**
         * 数据源添加项目事件处理
         */
        private itemAddedHandler(items, index);
        /**
         * 数据源移动项目事件处理
         */
        private itemMovedHandler(item, location, oldLocation);
        /**
         * 数据源移除项目事件处理
         */
        private itemRemovedHandler(items, location);
        /**
         * 添加一项
         */
        private itemAdded(item, index);
        /**
         * 移除一项
         */
        private itemRemoved(item, index);
        /**
         * 对象池字典
         */
        private recyclerDic;
        /**
         * 回收一个ItemRenderer实例
         */
        private recycle(renderer);
        /**
         * 更新当前所有项的索引
         */
        private resetRenderersIndices();
        /**
         * 数据源更新或替换项目事件处理
         */
        private itemUpdatedHandler(item, location);
        /**
         * 调整指定项呈示器的索引值
         */
        private resetRendererItemIndex(index);
        /**
         * 项呈示器改变
         */
        private itemRendererChanged;
        /**
         * 这里不直接使用Class类型是因为JS里不能用对象作为键，所以需要hashCode。而只有实例对象才有hashCode，Class无法作为键。
         */
        private _itemRenderer;
        /**
         * 用于数据项目的项呈示器。该类必须实现 IItemRenderer 接口。<br/>
         * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
         * @member egret.gui.DataGroup#itemRenderer
         */
        itemRenderer: IFactory;
        private itemRendererSkinNameChange;
        private _itemRendererSkinName;
        /**
         * 条目渲染器的可选皮肤标识符。在实例化itemRenderer时，若其内部没有设置过skinName,则将此属性的值赋值给它的skinName。
         * 注意:若itemRenderer不是ISkinnableClient，则此属性无效。
         * @member egret.gui.DataGroup#itemRendererSkinName
         */
        itemRendererSkinName: any;
        private _itemRendererFunction;
        /**
         * 为某个特定项目返回一个项呈示器Class的函数。<br/>
         * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。<br/>
         * 应该定义一个与此示例函数类似的呈示器函数： <br/>
         * function myItemRendererFunction(item:Object):IFactory
         * @member egret.gui.DataGroup#itemRendererFunction
         */
        itemRendererFunction: Function;
        /**
         * 为特定的数据项返回项呈示器的工厂实例
         */
        private itemToRendererClass(item);
        /**
         * @method egret.gui.DataGroup#createChildren
         * 设置默认的ItemRenderer
         * @private
         *
         */
        createChildren(): void;
        /**
         * 处理对组件设置的属性
         * @method egret.gui.DataGroup#commitProperties
         */
        commitProperties(): void;
        /**
         * 计算组件的默认大小和（可选）默认最小大小
         * @method egret.gui.DataGroup#measure
         */
        measure(): void;
        /**
         * 正在进行虚拟布局阶段
         */
        private virtualLayoutUnderway;
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @method egret.gui.DataGroup#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * 用于测试默认大小的数据
         */
        private typicalItem;
        private typicalItemChanged;
        /**
         * 确保测量过默认条目大小。
         */
        private ensureTypicalLayoutElement();
        /**
         * 测量项呈示器默认尺寸
         */
        private measureRendererSize();
        /**
         * 项呈示器的默认尺寸
         */
        private typicalLayoutRect;
        /**
         * 设置项目默认大小
         */
        private setTypicalLayoutRect(rect);
        /**
         * 索引到项呈示器的转换数组
         */
        private indexToRenderer;
        /**
         * 清理freeRenderer标志
         */
        private cleanFreeRenderer;
        /**
         * 移除所有项呈示器
         */
        private removeAllRenderers();
        /**
         * 为数据项创建项呈示器
         */
        private createRenderers();
        /**
         * 正在更新数据项的标志
         */
        private renderersBeingUpdated;
        /**
         * 更新项呈示器
         * @method egret.gui.DataGroup#updateRenderer
         * @param renderer {IItemRenderer}
         * @param itemIndex {number}
         * @param data {any}
         * @returns {IItemRenderer}
         */
        updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer;
        /**
         * 返回可在项呈示器中显示的 String。
         * 若DataGroup被作为SkinnableDataContainer的皮肤组件,此方法将不会执行，被SkinnableDataContainer.itemToLabel()所替代。
         * @method egret.gui.DataGroup#itemToLabel
         * @param item {any}
         * @returns {string}
         */
        itemToLabel(item: any): string;
        /**
         * 返回位于指定索引处的子显示对象实例
         * @method egret.gui.DataGroup#getElementAt
         * @param index {number}
         * @returns {IVisualElement}
         */
        getElementAt(index: number): IVisualElement;
        /**
         * 返回 element 实例的索引位置
         * @method egret.gui.DataGroup#getElementIndex
         * @param element {IVisualElement}
         * @returns {number}
         */
        getElementIndex(element: IVisualElement): number;
        /**
         * 获得对象容器的子对象总数
         * @member egret.gui.DataGroup#numElements
         */
        numElements: number;
        /**
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中
         * @method egret.gui.DataGroup#addChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         * 将一个 DisplayObject 子实例添加到该 DisplayObjectContainer 实例中
         * @method egret.gui.DataGroup#addChildAt
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
         * 从 DisplayObjectContainer 实例的子列表中删除指定的 child DisplayObject 实例
         * @method egret.gui.DataGroup#removeChild
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         * 从 DisplayObjectContainer 的子列表中指定的 index 位置删除子 DisplayObject
         * @method egret.gui.DataGroup#removeChildAt
         * @deprecated
         * @param index {number}
         * @returns {DisplayObject}
         */
        removeChildAt(index: number): DisplayObject;
        /**
         * 更改现有子项在显示对象容器中的位置
         * @method egret.gui.DataGroup#setChildIndex
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         */
        setChildIndex(child: DisplayObject, index: number): void;
        /**
         * 交换两个指定子对象的 Z 轴顺序（从前到后顺序）
         * @method egret.gui.DataGroup#swapChildren
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         */
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
         * 在子级列表中两个指定的索引位置，交换子对象的 Z 轴顺序（前后顺序）
         * @method egret.gui.DataGroup#swapChildrenAt
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         */
        swapChildrenAt(index1: number, index2: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.SkinnableDataContainer
     * @classdesc
     * 可设置外观的数据项目容器基类
     * @extends egret.gui.SkinnableComponent
     * @implements egret.gui.IItemRendererOwner
     */
    class SkinnableDataContainer extends SkinnableComponent implements IItemRendererOwner {
        /**
         * 构造函数
         * @method egret.gui.SkinnableDataContainer#constructor
         */
        constructor();
        /**
         * 更新项呈示器，以备使用或重用
         * @method egret.gui.SkinnableDataContainer#updateRenderer
         * @param renderer {IItemRenderer}
         * @param itemIndex {number}
         * @param data {any}
         * @returns {IItemRenderer}
         */
        updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer;
        /**
         * 返回可在项呈示器中显示的 String
         * @method egret.gui.SkinnableDataContainer#itemToLabel
         * @param item {any}
         * @returns {string}
         */
        itemToLabel(item: any): string;
        /**
         * [SkinPart]数据项目容器实体
         * @member egret.gui.SkinnableDataContainer#dataGroup
         */
        dataGroup: DataGroup;
        /**
         * dataGroup发生改变时传递的参数
         */
        _dataGroupProperties: any;
        /**
         * 列表数据源，请使用实现了ICollection接口的数据类型，例如ArrayCollection
         * @member egret.gui.SkinnableDataContainer#dataProvider
         */
        dataProvider: ICollection;
        _getDataProvider(): ICollection;
        _setDataProvider(value: ICollection): void;
        /**
         * 用于数据项目的项呈示器。该类必须实现 IItemRenderer 接口。 <br/>
         * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。
         * @member egret.gui.SkinnableDataContainer#itemRenderer
         */
        itemRenderer: IFactory;
        /**
         * 条目渲染器的可选皮肤标识符。在实例化itemRenderer时，若其内部没有设置过skinName,则将此属性的值赋值给它的skinName。
         * 注意:若itemRenderer不是ISkinnableClient，则此属性无效。
         * @member egret.gui.SkinnableDataContainer#itemRendererSkinName
         */
        itemRendererSkinName: any;
        /**
         * 为某个特定项目返回一个项呈示器Class的函数。 <br/>
         * rendererClass获取顺序：itemRendererFunction > itemRenderer > 默认ItemRenerer。 <br/>
         * 应该定义一个与此示例函数类似的呈示器函数： <br/>
         * function myItemRendererFunction(item:Object):IFactory
         * @member egret.gui.SkinnableDataContainer#itemRendererFunction
         */
        itemRendererFunction: Function;
        /**
         * 布局对象
         * @member egret.gui.SkinnableDataContainer#layout
         */
        layout: LayoutBase;
        _setLayout(value: LayoutBase): void;
        /**
         * @copy egret.gui.GroupBase#autoLayout
         */
        autoLayout: boolean;
        /**
         * [覆盖] 添加外观部件时调用
         * @method egret.gui.SkinnableDataContainer#partAdded
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * [覆盖] 正删除外观部件的实例时调用
         * @method egret.gui.SkinnableDataContainer#partRemoved
         * @param partName {string}
         * @param instance {any}
         */
        partRemoved(partName: string, instance: any): void;
        /**
         * 使用 EventDispatcher 对象注册事件侦听器对象，以使侦听器能够接收事件通知
         * @method egret.gui.SkinnableDataContainer#addEventListener
         * @param type {string}
         * @param listener {Function}
         * @param thisObject {any}
         * @param useCapture {boolean}
         * @param priority {number}
         */
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * 从 EventDispatcher 对象中删除侦听器
         * @method egret.gui.SkinnableDataContainer#removeEventListener
         * @param type {string}
         * @param listener {Function}
         * @param thisObject {any}
         * @param useCapture {boolean}
         */
        removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ListBase
     * @classdesc
     * 支持选择内容的所有组件的基类。
     * @extends egret.gui.SkinnableDataContainer
     */
    class ListBase extends SkinnableDataContainer {
        /**
         * 未选中任何项时的索引值
         * @constant egret.gui.ListBase.NO_SELECTION
         */
        static NO_SELECTION: number;
        /**
         * 未设置缓存选中项的值
         * @constant egret.gui.ListBase.NO_PROPOSED_SELECTION
         */
        static NO_PROPOSED_SELECTION: number;
        /**
         * 自定义的选中项
         * @constant egret.gui.ListBase.CUSTOM_SELECTED_ITEM
         */
        static CUSTOM_SELECTED_ITEM: number;
        /**
         * 构造函数
         * @method egret.gui.ListBase#constructor
         */
        constructor();
        /**
         * 正在进行所有数据源的刷新操作
         * @member egret.gui.ListBase#_doingWholesaleChanges
         */
        _doingWholesaleChanges: boolean;
        private dataProviderChanged;
        _setDataProvider(value: any): void;
        /**
         * 布局对象
         * @member egret.gui.ListBase#layout
         */
        /**
         * @inheritDoc
         */
        layout: LayoutBase;
        private _labelField;
        private labelFieldOrFunctionChanged;
        /**
         * 数据项如果是一个对象，此属性为数据项中用来显示标签文字的字段名称。
         * 若设置了labelFunction，则设置此属性无效。
         * @member egret.gui.ListBase#labelField
         */
        labelField: string;
        _setLabelField(value: string): void;
        private _labelFunction;
        /**
         * 用户提供的函数，在每个项目上运行以确定其标签。
         * 示例：function labelFunc(item:Object):String 。
         * @member egret.gui.ListBase#labelFunction
         */
        labelFunction: Function;
        _setLabelFunction(value: Function): void;
        _requireSelection: boolean;
        private requireSelectionChanged;
        /**
         * 如果为 true，则必须始终在控件中选中数据项目。<br/>
         * 如果该值为 true，则始终将 selectedIndex 属性设置为 0 和 (dataProvider.length - 1) 之间的一个值。
         * @member egret.gui.ListBase#requireSelection
         */
        requireSelection: boolean;
        _setRequireSelection(value: boolean): void;
        /**
         * 在属性提交前缓存真实的选中项的值
         */
        _proposedSelectedIndex: number;
        _selectedIndex: number;
        /**
         * 选中项目的基于 0 的索引。<br/>
         * 或者如果未选中项目，则为-1。设置 selectedIndex 属性会取消选择当前选定的项目并选择指定索引位置的数据项目。 <br/>
         * 当用户通过与控件交互来更改 selectedIndex 属性时，此控件将分派 change 和 changing 事件。<br/>
         * 当以编程方式更改 selectedIndex 属性的值时，此控件不分派 change 和 changing 事件。
         * @member egret.gui.ListBase#selectedIndex
         */
        selectedIndex: number;
        _getSelectedIndex(): number;
        /**
         * 是否允许自定义的选中项
         */
        _allowCustomSelectedItem: boolean;
        /**
         * 索引改变后是否需要抛出事件
         */
        _dispatchChangeAfterSelection: boolean;
        /**
         * 设置选中项
         */
        _setSelectedIndex(value: number, dispatchChangeEvent?: boolean): void;
        /**
         *  在属性提交前缓存真实选中项的数据源
         */
        _pendingSelectedItem: any;
        private _selectedItem;
        /**
         * 当前已选中的项目。设置此属性会取消选中当前选定的项目并选择新指定的项目。<br/>
         * 当用户通过与控件交互来更改 selectedItem 属性时，此控件将分派 change 和 changing 事件。<br/>
         * 当以编程方式更改 selectedItem 属性的值时，此控件不分派 change 和 changing 事件。
         * @member egret.gui.ListBase#selectedItem
         */
        selectedItem: any;
        /**
         * 设置选中项数据源
         * @method egret.gui.ListBase#_setSelectedItem
         * @param value {any}
         * @param dispatchChangeEvent {boolean}
         */
        _setSelectedItem(value: any, dispatchChangeEvent?: boolean): void;
        private _useVirtualLayout;
        /**
         * 是否使用虚拟布局,默认flase
         * @member egret.gui.ListBase#useVirtualLayout
         */
        useVirtualLayout: boolean;
        _getUseVirtualLayout(): boolean;
        _setUseVirtualLayout(value: boolean): void;
        /**
         * 处理对组件设置的属性
         * @method egret.gui.ListBase#commitProperties
         */
        commitProperties(): void;
        /**
         *  更新项呈示器文字标签
         */
        private updateRendererLabelProperty(itemIndex);
        /**
         * 添加外观部件时调用
         * @method egret.gui.ListBase#partAdded
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * 正删除外观部件的实例时调用
         * @method egret.gui.ListBase#partRemoved
         * @param partName {string}
         * @param instance {any}
         */
        partRemoved(partName: string, instance: any): void;
        /**
         * 更新项呈示器，以备使用或重用
         * @method egret.gui.ListBase#updateRenderer
         * @param renderer {IItemRenderer}
         * @param itemIndex {number}
         * @param data {any}
         * @returns {IItemRenderer}
         */
        updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer;
        /**
         * 如果有一个数据项目，则返回呈示器应该显示的正确文本，同时将 labelField 和 labelFunction 属性考虑在内
         * @method egret.gui.ListBase#itemToLabel
         * @param item {any}
         * @returns {string}
         */
        itemToLabel(item: any): string;
        /**
         * 选中或取消选中项目时调用。子类必须覆盖此方法才可设置选中项。
         * @method egret.gui.ListBase#itemSelected
         * @param index {number} 已选中的项目索引。
         * @param selected {boolean} true为选中，false取消选中
         */
        itemSelected(index: number, selected: boolean): void;
        /**
         * 返回指定索引是否等于当前选中索引
         */
        _isItemIndexSelected(index: number): boolean;
        /**
         * 提交选中项属性，返回是否成功提交，false表示被取消
         * @method egret.gui.ListBase#commitSelection
         * @param dispatchChangedEvents {boolean}
         * @returns {boolean}
         */
        commitSelection(dispatchChangedEvents?: boolean): boolean;
        private selectedIndexAdjusted;
        /**
         * 仅调整选中索引值而不更新选中项,即在提交属性阶段itemSelected方法不会被调用，也不会触发changing和change事件。
         * @method egret.gui.ListBase#adjustSelection
         * @param newIndex {number} 新索引。
         * @param add {boolean} 如果已将项目添加到组件，则为 true；如果已删除项目，则为 false。
         */
        adjustSelection(newIndex: number, add?: boolean): void;
        /**
         * 数据项添加
         * @method egret.gui.ListBase#itemAdded
         * @param index {number}
         */
        itemAdded(index: number): void;
        /**
         * 数据项移除
         * @method egret.gui.ListBase#itemRemoved
         * @param index {number}
         */
        itemRemoved(index: number): void;
        /**
         * 项呈示器被添加
         * @method egret.gui.ListBase#dataGroup_rendererAddHandler
         * @param event {RendererExistenceEvent}
         */
        dataGroup_rendererAddHandler(event: RendererExistenceEvent): void;
        /**
         * 项呈示器被移除
         * @method egret.gui.ListBase#dataGroup_rendererRemoveHandler
         * @param event {RendererExistenceEvent}
         */
        dataGroup_rendererRemoveHandler(event: RendererExistenceEvent): void;
        private static TYPE_MAP;
        /**
         * 项呈示器鼠标事件
         */
        private item_mouseEventHandler(event);
        /**
         * 抛出列表事件
         * @method egret.gui.ListBase#_dispatchListEvent
         * @param touchEvent {TouchEvent} 相关联的鼠标事件
         * @param type {string} 事件名称
         * @param itemRenderer {IItemRenderer} 关联的条目渲染器实例
         */
        _dispatchListEvent(touchEvent: TouchEvent, type: string, itemRenderer: IItemRenderer): void;
        /**
         * 数据源发生改变
         * @method egret.gui.ListBase#dataProvider_collectionChangeHandler
         * @param event {CollectionEvent}
         */
        dataProvider_collectionChangeHandler(event: CollectionEvent): void;
        /**
         * 数据源刷新
         */
        dataProviderRefreshed(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.List
     * @classdesc
     * 列表组件
     * @extends egret.gui.ListBase
     */
    class List extends ListBase {
        constructor();
        /**
         * 创建容器的子元素
         */
        createChildren(): void;
        /**
         * 是否使用虚拟布局,默认true
         * @member egret.gui.List#useVirtualLayout
         */
        /**
         * @inheritDoc
         */
        useVirtualLayout: boolean;
        private _allowMultipleSelection;
        /**
         * 是否允许同时选中多项
         * @member egret.gui.List#allowMultipleSelection
         */
        allowMultipleSelection: boolean;
        private _selectedIndices;
        private _proposedSelectedIndices;
        /**
         * 当前选中的一个或多个项目的索引列表
         * @member egret.gui.List#selectedIndices
         */
        selectedIndices: Array<number>;
        /**
         * @member egret.gui.List#selectedIndex
         */
        selectedIndex: number;
        /**
         * 当前选中的一个或多个项目的数据源列表
         * @member egret.gui.List#selectedItems
         */
        selectedItems: Array<Object>;
        /**
         * 设置多个选中项
         */
        _setSelectedIndices(value: Array<number>, dispatchChangeEvent?: boolean): void;
        /**
         * 处理对组件设置的属性
         * @method egret.gui.List#commitProperties
         */
        commitProperties(): void;
        /**
         * @method egret.gui.List#commitSelection
         * @param dispatchChangedEvents {boolean}
         * @returns {boolean}
         */
        commitSelection(dispatchChangedEvents?: boolean): boolean;
        /**
         * 是否是有效的索引
         */
        private isValidIndex;
        /**
         * 提交多项选中项属性
         */
        commitMultipleSelection(): void;
        /**
         *
         * @param index
         * @returns {boolean}
         * @private
         */
        _isItemIndexSelected(index: number): boolean;
        dataGroup_rendererAddHandler(event: RendererExistenceEvent): void;
        /**
         * 数据源发生刷新
         */
        dataProviderRefreshed(): void;
        dataGroup_rendererRemoveHandler(event: RendererExistenceEvent): void;
        /**
         * 是否捕获ItemRenderer以便在MouseUp时抛出ItemClick事件
         */
        _captureItemRenderer: boolean;
        _mouseDownItemRenderer: IItemRenderer;
        /**
         * 鼠标在项呈示器上按下
         * @method egret.gui.List#item_mouseDownHandler
         * @param event {TouchEvent}
         */
        _item_touchBeginHandler(event: TouchEvent): void;
        /**
         * 计算当前的选中项列表
         */
        private calculateSelectedIndices(index);
        /**
         * 鼠标在项呈示器上弹起，抛出ItemClick事件。
         */
        _item_touchEndHandler(event: TouchEvent): void;
        /**
         * 鼠标在舞台上弹起
         */
        private stage_touchEndHandler(event);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.DropDownListBase
     * @classdesc
     * 下拉列表控件基类
     * @extends egret.gui.List
     */
    class DropDownListBase extends List {
        /**
         * 构造函数
         * @method egret.gui.DropDownListBase#constructor
         */
        constructor();
        /**
         * [SkinPart]下拉区域显示对象
         * @member egret.gui.DropDownListBase#dropDown
         */
        dropDown: DisplayObject;
        /**
         * [SkinPart]下拉触发按钮
         * @member egret.gui.DropDownListBase#openButton
         */
        openButton: ButtonBase;
        /**
         * @constant egret.gui.DropDownListBase.PAGE_SIZE
         */
        static PAGE_SIZE: number;
        /**
         * 文本改变标志
         */
        _labelChanged: boolean;
        /**
         * @inheritDoc
         */
        _setDataProvider(value: ICollection): void;
        /**
         * @inheritDoc
         */
        _setLabelField(value: string): void;
        /**
         * @inheritDoc
         */
        _setLabelFunction(value: Function): void;
        private _dropDownController;
        /**
         * 下拉控制器
         * @member egret.gui.DropDownListBase#dropDownController
         */
        dropDownController: DropDownController;
        /**
         * 下拉列表是否已经已打开
         * @member egret.gui.DropDownListBase#isDropDownOpen
         */
        isDropDownOpen: boolean;
        private _userProposedSelectedIndex;
        /**
         * 处理对组件设置的属性
         * @method egret.gui.DropDownListBase#commitProperties
         */
        commitProperties(): void;
        /**
         * 添加外观部件时调用
         * @method egret.gui.DropDownListBase#partAdded
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * 正删除外观部件的实例时调用
         * @method egret.gui.DropDownListBase#partRemoved
         * @param partName {string}
         * @param instance {any}
         */
        partRemoved(partName: string, instance: any): void;
        /**
         * 返回要应用到外观的状态的名称
         * @method egret.gui.DropDownListBase#getCurrentSkinState
         * @returns {string}
         */
        getCurrentSkinState(): string;
        /**
         * @method egret.gui.DropDownListBase#commitSelection
         * @param dispatchChangedEvents {boolean}
         * @returns {boolean}
         */
        commitSelection(dispatchChangedEvents?: boolean): boolean;
        /**
         * @method egret.gui.DropDownListBase#_isItemIndexSelected
         * @param index {number}
         * @returns {boolean}
         */
        _isItemIndexSelected(index: number): boolean;
        /**
         * 打开下拉列表并抛出UIEvent.OPEN事件。
         * @method egret.gui.DropDownListBase#openDropDown
         */
        openDropDown(): void;
        /**
         * 关闭下拉列表并抛出UIEvent.CLOSE事件。
         * @method egret.gui.DropDownListBase#closeDropDown
         * @param commit {boolean}
         */
        closeDropDown(commit: boolean): void;
        /**
         * 更新选中项的提示文本
         * @method egret.gui.DropDownListBase#updateLabelDisplay
         * @param displayItem {any}
         */
        updateLabelDisplay(displayItem?: any): void;
        /**
         * 改变高亮的选中项
         * @param newIndex {number}
         * @param scrollToTop {boolean}
         */
        _changeHighlightedSelection(newIndex: number, scrollToTop?: boolean): void;
        dataProvider_collectionChangeHandler(event: CollectionEvent): void;
        /**
         * @method egret.gui.DropDownListBase#item_mouseDownHandler
         * @param event {TouchEvent}
         */
        _item_touchEndHandler(event: TouchEvent): void;
        /**
         * 控制器抛出打开列表事件
         */
        _dropDownController_openHandler(event: UIEvent): void;
        /**
         * 打开列表后组件一次失效验证全部完成
         */
        _open_updateCompleteHandler(event: UIEvent): void;
        /**
         * 控制器抛出关闭列表事件
         * @method egret.gui.DropDownListBase#dropDownController_closeHandler
         * @param event {UIEvent}
         */
        dropDownController_closeHandler(event: UIEvent): void;
        /**
         * 关闭列表后组件一次失效验证全部完成
         */
        private close_updateCompleteHandler(event);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.DropDownList
     * @classdesc
     * 不可输入的下拉列表控件。带输入功能的下拉列表控件，请使用ComboBox。
     * @extends egret.gui.DropDownListBase
     */
    class DropDownList extends DropDownListBase {
        /**
         * 构造函数
         * @method egret.gui.DropDownList#constructor
         */
        constructor();
        /**
         * [SkinPart]选中项文本
         * @member egret.gui.DropDownList#labelDisplay
         */
        labelDisplay: IDisplayText;
        private _prompt;
        /**
         * 当没有选中项时在DropDownList上要显示的字符串。<p/>
         * 它通常是一个类似于“请选择一项...”的文本。当下拉列表中的某个项目被选中后，会被替换为该选定项目中的文本。
         * @member egret.gui.DropDownList#prompt
         */
        prompt: string;
        /**
         * 添加外观部件时调用
         * @method egret.gui.DropDownList#partAdded
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @param displayItem
         */
        updateLabelDisplay(displayItem?: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TextBase
     * @classdesc
     * 文本基类,实现对文本的自动布局，样式属性设置。
     * @extends egret.gui.UIComponent
     * @implements egret.gui.IDisplayText
     */
    class TextBase extends UIComponent implements IDisplayText {
        /**
         * 构造函数
         * @method egret.gui.TextBase#constructor
         */
        constructor();
        /**
         * 默认的文本测量宽度
         * @constant egret.gui.TextBase.DEFAULT_MEASURED_WIDTH
         */
        static DEFAULT_MEASURED_WIDTH: number;
        /**
         * 默认的文本测量高度
         * @constant egret.gui.TextBase.DEFAULT_MEASURED_HEIGHT
         */
        static DEFAULT_MEASURED_HEIGHT: number;
        /**
         * 呈示此文本的内部 TextField
         */
        _textField: TextField;
        private allStyleChanged;
        /**
         * 检测对样式属性的更改
         * @param styleProp
         */
        styleChanged(styleProp: string): void;
        private fontFamilyChanged;
        private _fontFamily;
        /**
         * 字体名称 。默认值：SimSun
         * @member egret.gui.TextBase#fontFamily
         */
        fontFamily: string;
        _sizeChanged: boolean;
        private _size;
        /**
         * 字号大小,默认值30 。
         * @member egret.gui.TextBase#size
         */
        size: number;
        _focusEnabled: boolean;
        focusEnabled: boolean;
        /**
         * 设置此组件的焦点
         * @inheritDoc
         */
        setFocus(): void;
        private boldChanged;
        private _bold;
        /**
         * 是否显示为粗体，默认false。
         * @member egret.gui.TextBase#bold
         */
        bold: boolean;
        private italicChanged;
        private _italic;
        /**
         * 是否显示为斜体，默认false。
         * @member egret.gui.TextBase#italic
         */
        italic: boolean;
        private textAlignChanged;
        private _textAlign;
        /**
         * 文字的水平对齐方式 ,请使用HorizontalAlign中定义的常量。
         * 默认值：HorizontalAlign.LEFT。
         * @member egret.gui.TextBase#textAlign
         */
        textAlign: string;
        private verticalAlignChanged;
        private _verticalAlign;
        /**
         * 文字的垂直对齐方式 ,请使用VerticalAlign中定义的常量。
         * 默认值：VerticalAlign.TOP。
         * @member egret.gui.TextBase#verticalAlign
         */
        verticalAlign: string;
        private lineSpacingChanged;
        _lineSpacing: number;
        /**
         * 行间距
         * @member egret.gui.TextBase#lineSpacing
         */
        lineSpacing: number;
        _getLineSpacing(): number;
        _setLineSpacing(value: number): void;
        private textColorChanged;
        private _textColor;
        /**
         * 文本颜色
         * @member egret.gui.TextBase#textColor
         */
        textColor: number;
        /**
         * @member egret.gui.TextBase#_textChanged
         */
        _textChanged: boolean;
        _text: string;
        /**
         * 获得文体内容
         * @member egret.gui.TextBase#text
         */
        text: string;
        _textFlow: Array<egret.ITextElement>;
        _textFlowChanged: boolean;
        textFlow: Array<egret.ITextElement>;
        /**
         * 文本全部显示时的高度（无行间距）
         */
        textHeight: number;
        /**
         * 文本全部显示时宽
         */
        textWidth: number;
        /**
         * 创建组件的子对象
         */
        createChildren(): void;
        /**
         * 处理对组件设置的属性
         */
        commitProperties(): void;
        /**
         * 检查是否创建了textField对象，没有就创建一个。
         */
        private checkTextField();
        _createTextField(): void;
        _textFieldChanged(): void;
        /**
         * 计算组件的默认大小和（可选）默认最小大小
         */
        measure(): void;
        /**
         * 更新显示列表
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        $updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * 更新属性时调度 PropertyChangeEvent 的 Helper 方法
         * @param propertyName
         * @param oldValue
         * @param value
         */
        dispatchPropertyChangeEvent(propertyName: string, oldValue: any, value: any): void;
    }
}
declare module egret.gui {
    /**
     *
     */
    class EditableText extends TextBase implements IEditableText, IDisplayText, IViewport {
        constructor();
        private _selectable;
        /**
         * @inheritDoc
         */
        selectable: boolean;
        private _displayAsPassword;
        private displayAsPasswordChanged;
        /**
         * @inheritDoc
         */
        displayAsPassword: boolean;
        private pendingEditable;
        private _editable;
        private editableChanged;
        /**
         * @inheritDoc
         */
        editable: boolean;
        /**
         * @inheritDoc
         */
        enabled: boolean;
        private _maxChars;
        private maxCharsChanged;
        /**
         * @inheritDoc
         */
        maxChars: number;
        private _multiline;
        private multilineChanged;
        /**
         * @inheritDoc
         */
        multiline: boolean;
        private _restrict;
        private restrictChanged;
        /**
         * @deprecated
         * TextFiled里还没实现这个接口，等实现之后再去掉废弃标志。目前暂时不要使用它。
         */
        restrict: string;
        styleChanged(styleProp: string): void;
        _setLineSpacing(value: number): void;
        private _heightInLines;
        private heightInLinesChanged;
        /**
         * 控件的默认高度（以行为单位测量）。 若设置了multiline属性为false，则忽略此属性。
         */
        heightInLines: number;
        private _widthInChars;
        private widthInCharsChanged;
        /**
         * 控件的默认宽度（使用字号：size为单位测量）。 若同时设置了maxChars属性，将会根据两者测量结果的最小值作为测量宽度。
         */
        widthInChars: number;
        private _contentWidth;
        /**
         * @inheritDoc
         */
        contentWidth: number;
        private setContentWidth(value);
        private _contentHeight;
        /**
         * @inheritDoc
         */
        contentHeight: number;
        private setContentHeight(value);
        private _horizontalScrollPosition;
        /**
         * @inheritDoc
         */
        horizontalScrollPosition: number;
        private _verticalScrollPosition;
        /**
         * @inheritDoc
         */
        verticalScrollPosition: number;
        /**
         * 根据垂直像素位置获取对应的垂直滚动位置
         */
        private getScrollVByVertitcalPos(value);
        /**
         * 根据垂直滚动位置获取对应的垂直像位置
         */
        private getVerticalPosByScrollV(scrollV?);
        /**
         * @inheritDoc
         */
        getHorizontalScrollPositionDelta(navigationUnit?: number): number;
        /**
         * @inheritDoc
         */
        getVerticalScrollPositionDelta(navigationUnit?: number): number;
        /**
         * 返回指定偏移行数的滚动条偏移量
         */
        private getVScrollDelta(offsetLine?);
        private _clipAndEnableScrolling;
        /**
         * @inheritDoc
         */
        clipAndEnableScrolling: boolean;
        /**
         * 处理对组件设置的属性
         * @inheritDoc
         */
        commitProperties(): void;
        /**
         * 通过设置此容器子项的位置和大小来响应大小更改
         * @inheritDoc
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * 更新内容尺寸大小
         */
        private updateContentSize();
        /**
         * @inheritDoc
         */
        selectionBeginIndex: number;
        /**
         * @inheritDoc
         */
        selectionEndIndex: number;
        /**
         * @inheritDoc
         */
        caretIndex: number;
        /**
         * @inheritDoc
         */
        setSelection(beginIndex: number, endIndex?: number): void;
        /**
         * @inheritDoc
         */
        selectAll(): void;
        /**
         * heightInLines计算出来的默认高度。
         */
        private defaultHeight;
        /**
         * widthInChars计算出来的默认宽度。
         */
        private defaultWidth;
        /**
         * 计算  容器默认大小的最小值和最大值
         * @inheritDoc
         */
        measure(): void;
        /**
         * 创建文本显示对象
         */
        _createTextField(): void;
        private textField_changeHandler(event);
        private isValidating;
        /**
         *  @private
         */
        private textField_scrollHandler(event);
        /**
         * 即将输入文字
         */
        private textField_textInputHandler(event);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Group
     * @classdesc
     * 自动布局容器
     * @extends egret.gui.GroupBase
     * @implements egret.gui.IVisualElementContainer
     */
    class Group extends GroupBase implements IVisualElementContainer {
        /**
         * @method egret.gui.Group#constructor
         */
        constructor();
        /**
         * createChildren()方法已经执行过的标志
         */
        private createChildrenCalled;
        /**
         * 创建子对象
         * @method egret.gui.Group#createChildren
         */
        createChildren(): void;
        /**
         * elementsContent改变标志
         */
        private elementsContentChanged;
        private _elementsContent;
        /**
         * 返回子元素列表
         */
        _getElementsContent(): Array<any>;
        /**
         * 设置容器子对象数组 。数组包含要添加到容器的子项列表，之前的已存在于容器中的子项列表被全部移除后添加列表里的每一项到容器。
         * 设置该属性时会对您输入的数组进行一次浅复制操作，所以您之后对该数组的操作不会影响到添加到容器的子项列表数量。
         */
        elementsContent: Array<any>;
        /**
         * 设置容器子对象列表
         */
        private setElementsContent(value);
        /**
         * 获得容器中的子对象数
         * @member egret.gui.Group#numElements
         */
        numElements: number;
        /**
         * 返回指定索引处的可视元素
         * @method egret.gui.Group#getElementAt
         * @param index {number}
         * @returns {IVisualElement}
         */
        getElementAt(index: number): IVisualElement;
        private checkForRangeError(index, addingElement?);
        /**
         * 将可视元素添加到此容器中
         * @method egret.gui.Group#addElement
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        addElement(element: IVisualElement): IVisualElement;
        /**
         * 将可视元素添加到此容器中
         * @method egret.gui.Group#addElementAt
         * @param element {IVisualElement}
         * @param index {number}
         * @returns {IVisualElement}
         */
        addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
         * 从此容器的子列表中删除指定的可视元素
         * @method egret.gui.Group#removeElement
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        removeElement(element: IVisualElement): IVisualElement;
        /**
         * 从容器中的指定索引位置删除可视元素
         * @method egret.gui.Group#removeElementAt
         * @param index {number}
         * @returns {IVisualElement}
         */
        removeElementAt(index: number): IVisualElement;
        /**
         * 删除容器中的所有子元素
         * @method egret.gui.Group#removeAllElements
         */
        removeAllElements(): void;
        /**
         * 返回可视元素的索引位置
         * @method egret.gui.Group#getElementIndex
         * @param element {IVisualElement}
         * @returns {number}
         */
        getElementIndex(element: IVisualElement): number;
        /**
         * 在可视容器中更改现有可视元素的位置
         * @method egret.gui.Group#setElementIndex
         * @param element {IVisualElement}
         * @param index {number}
         */
        setElementIndex(element: IVisualElement, index: number): void;
        /**
         * 交换两个指定可视元素的索引
         * @method egret.gui.Group#swapElements
         * @param element1 {IVisualElement}
         * @param element2 {IVisualElement}
         */
        swapElements(element1: IVisualElement, element2: IVisualElement): void;
        /**
         * 交换容器中位于两个指定索引位置的可视元素
         * @method egret.gui.Group#swapElementsAt
         * @param index1 {number}
         * @param index2 {number}
         */
        swapElementsAt(index1: number, index2: number): void;
        /**
         * 添加一个显示元素到容器
         * @param element {IVisualElement}
         * @param index {number}
         * @param notifyListeners {boolean}
         */
        _elementAdded(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        /**
         * 从容器移除一个显示元素
         * @param element {IVisualElement}
         * @param index {number}
         * @param notifyListeners {boolean}
         */
        _elementRemoved(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        /**
         * 将可视元素添加到此容器中
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         * 将可视元素添加到此容器中
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**从此容器的子列表中删除指定的可视元素
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         * 从此容器的子列表中删除指定的可视元素
         * @method egret.gui.Group#removeChildAt
         * @deprecated
         * @param index {number}
         * @returns {DisplayObject}
         */
        removeChildAt(index: number): DisplayObject;
        /**
         * 在可视容器中更改现有可视元素的位置
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         */
        setChildIndex(child: DisplayObject, index: number): void;
        /**
         * 交换两个指定可视元素的索引
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         */
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
         * 交换容器中位于两个指定索引位置的可视元素
         * @method egret.gui.Group#swapChildrenAt
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         */
        swapChildrenAt(index1: number, index2: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Range
     * @classdesc
     * 范围选取组件,该组件包含一个值和这个值所允许的最大最小约束范围。
     * @extends egret.gui.SkinnableComponent
     */
    class Range extends SkinnableComponent {
        /**
         * 构造函数
         * @method egret.gui.Range#constructor
         */
        constructor();
        _maximum: number;
        /**
         * 最大有效值改变标志
         */
        private maxChanged;
        /**
         * 最大有效值
         * @member egret.gui.Range#maximum
         */
        maximum: number;
        _setMaximun(value: number): void;
        _minimum: number;
        /**
         * 最小有效值改变标志
         */
        private minChanged;
        /**
         * 最小有效值
         * @member egret.gui.Range#minimum
         */
        minimum: number;
        _setMinimun(value: number): void;
        private _stepSize;
        /**
         * 单步大小改变的标志
         */
        private stepSizeChanged;
        /**
         * 调用 changeValueByStep() 方法时 value 属性更改的单步大小。默认值为 1。<br/>
         * 除非 snapInterval 为 0，否则它必须是 snapInterval 的倍数。<br/>
         * 如果 stepSize 不是倍数，则会将它近似到大于或等于 snapInterval 的最近的倍数。<br/>
         * @member egret.gui.Range#stepSize
         */
        stepSize: number;
        private _value;
        private _changedValue;
        /**
         * 此范围的当前值改变标志
         */
        private valueChanged;
        /**
         * 此范围的当前值。
         * @member egret.gui.Range#value
         */
        value: number;
        _setValue(newValue: number): void;
        _getValue(): number;
        private _snapInterval;
        private snapIntervalChanged;
        private _explicitSnapInterval;
        /**
         * snapInterval 属性定义 value 属性的有效值。如果为非零，则有效值为 minimum 与此属性的整数倍数之和，且小于或等于 maximum。 <br/>
         * 例如，如果 minimum 为 10，maximum 为 20，而此属性为 3，则可能的有效值为 10、13、16、19 和 20。<br/>
         * 如果此属性的值为零，则仅会将有效值约束到介于 minimum 和 maximum 之间（包括两者）。<br/>
         * 此属性还约束 stepSize 属性（如果设置）的有效值。如果未显式设置此属性，但设置了 stepSize，则 snapInterval 将默认为 stepSize。<br/>
         * @member egret.gui.Range#snapInterval
         */
        snapInterval: number;
        /**
         * 处理对组件设置的属性
         * @method egret.gui.Range#commitProperties
         */
        commitProperties(): void;
        /**
         * 修正stepSize到最接近snapInterval的整数倍
         */
        private nearestValidSize(size);
        /**
         * 修正输入的值为有效值
         * @method egret.gui.Range#nearestValidValue
         * @param value {number} 输入值。
         * @param interval {number} snapInterval 的值，或 snapInterval 的整数倍数。
         * @returns {number}
         */
        nearestValidValue(value: number, interval: number): number;
        /**
         * 设置当前值。此方法假定调用者已经使用了 nearestValidValue() 方法来约束 value 参数
         * @method egret.gui.Range#setValue
         * @param value {number} value属性的新值
         */
        setValue(value: number): void;
        /**
         * 按 stepSize增大或减小当前值
         * @method egret.gui.Range#changeValueByStep
         * @param increase {boolean} 若为 true，则向value增加stepSize，否则减去它。
         */
        changeValueByStep(increase?: boolean): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TrackBase
     * @classdesc
     * TrackBase类是具有一个轨道和一个或多个滑块按钮的组件的一个基类，如 Slider 和 ScrollBar。
     * @extends egret.gui.Range
     */
    class TrackBase extends Range {
        /**
         * @method egret.gui.TrackBase#constructor
         */
        constructor();
        private _slideDuration;
        /**
         * 在轨道上单击以移动滑块时，滑动动画持续的时间（以毫秒为单位）。<br/>
         * 此属性用于 Slider 和 ScrollBar。对于 Slider，在轨道上的任何单击将导致生成使用此样式的一个动画，同时滑块将移到单击的位置。<br/>
         * 对于 ScrollBar，仅当按住 Shift 键并单击轨道时才使用此样式，这会导致滑块移到单击的位置。<br/>
         * 未按下 Shift 键时单击 ScrollBar 轨道将导致出现分页行为。<br/>
         * 按住 Shift 键并单击时，必须也对 ScrollBar 设置 smoothScrolling 属性才可以实现动画行为。<br/>
         * 此持续时间是整个滑过轨道的总时间，实际滚动会根据距离相应缩短。
         * @member egret.gui.TrackBase#slideDuration
         */
        slideDuration: number;
        /**
         * [SkinPart]实体滑块组件
         * @member egret.gui.TrackBase#thumb
         */
        thumb: Button;
        /**
         * [SkinPart]实体轨道组件
         * @member egret.gui.TrackBase#track
         */
        track: Button;
        /**
         * 最大有效值
         * @member egret.gui.TrackBase#maximum
         */
        /**
         * @inheritDoc
         */
        maximum: number;
        /**
         * 最小有效值
         * @member egret.gui.TrackBase#minimum
         */
        /**
         * @inheritDoc
         */
        minimum: number;
        /**
         * 此范围的当前值。
         * @member egret.gui.TrackBase#value
         */
        /**
         * @inheritDoc
         */
        value: number;
        /**
         * @method egret.gui.TrackBase#setValue
         * @param value {number}
         */
        setValue(value: number): void;
        /**
         * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值。
         * @method egret.gui.TrackBase#pointToValue
         * @param x {number} 相对于轨道原点的位置的x坐标。
         * @param y {number} 相对于轨道原点的位置的y坐标。
         * @returns {number}
         */
        pointToValue(x: number, y: number): number;
        /**
         * 按 stepSize 增大或减小 value
         * @method egret.gui.TrackBase#changeValueByStep
         * @param increase {boolean}
         */
        changeValueByStep(increase?: boolean): void;
        /**
         * 添加外观部件时调用
         * @method egret.gui.TrackBase#partAdded
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * 删除外观部件的实例时调用
         * @method egret.gui.TrackBase#partRemoved
         * @param partName {string}
         * @param instance {any}
         */
        partRemoved(partName: string, instance: any): void;
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @method egret.gui.TrackBase#updateDisplayList
         * @param w {number}
         * @param h {number}
         */
        updateDisplayList(w: number, h: number): void;
        /**
         * 记录鼠标在thumb上按下的位置
         * @type {number}
         * @private
         */
        _clickOffsetX: number;
        /**
         *
         * @type {number}
         * @private
         */
        _clickOffsetY: number;
        /**
         * 更新皮肤部件（通常为滑块）的大小和可见性。<br/>
         * 子类覆盖此方法以基于 minimum、maximum 和 value 属性更新滑块的大小、位置和可见性。
         * @method egret.gui.TrackBase#updateSkinDisplayList
         */
        updateSkinDisplayList(): void;
        /**
         * 添加到舞台时
         */
        private addedToStageHandler(event);
        /**
         * 轨道尺寸改变事件
         */
        private track_resizeHandler(event);
        /**
         * 滑块尺寸改变事件
         */
        private thumb_resizeHandler(event);
        /**
         * 滑块三个阶段的延迟布局更新完毕事件
         */
        private thumb_updateCompleteHandler(event);
        /**
         * 滑块按下事件
         * @method egret.gui.TrackBase#thumb_mouseDownHandler
         * @param event {TouchEvent}
         */
        thumb_mouseDownHandler(event: TouchEvent): void;
        /**
         * 当鼠标拖动thumb时，需要更新value的标记。
         */
        private needUpdateValue;
        /**
         * 拖动thumb过程中触发的EnterFrame事件
         */
        private onEnterFrame(event);
        /**
         * 当thumb被拖动时更新值，此方法每帧只被调用一次，比直接在鼠标移动事件里更新性能更高。
         * @method egret.gui.TrackBase#updateWhenMouseMove
         */
        updateWhenMouseMove(): void;
        /**
         *
         * @type {number}
         * @private
         */
        _moveStageX: number;
        /**
         *
         * @type {number}
         * @private
         */
        _moveStageY: number;
        /**
         * 鼠标移动事件
         * @method egret.gui.TrackBase#stage_mouseMoveHandler
         * @param event {TouchEvent}
         */
        stage_mouseMoveHandler(event: TouchEvent): void;
        /**
         * 鼠标弹起事件
         * @method egret.gui.TrackBase#stage_mouseUpHandler
         * @param event {Event}
         */
        stage_mouseUpHandler(event: Event): void;
        /**
         * 轨道被按下事件
         * @method egret.gui.TrackBase#track_mouseDownHandler
         * @param event {TouchEvent}
         */
        track_mouseDownHandler(event: TouchEvent): void;
        private mouseDownTarget;
        /**
         * 当在组件上按下鼠标时记录被按下的子显示对象
         */
        private mouseDownHandler(event);
        /**
         * 当鼠标弹起时，若不是在mouseDownTarget上弹起，而是另外的子显示对象上弹起时，额外抛出一个鼠标单击事件。
         */
        private stage_mouseUpSomewhereHandler(event);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.SliderBase
     * @classdesc
     * 滑块控件基类
     * @extends egret.gui.TrackBase
     */
    class SliderBase extends TrackBase {
        /**
         * 构造函数
         * @method egret.gui.SliderBase#constructor
         */
        constructor();
        /**
         * [SkinPart]轨道高亮显示对象
         * @member egret.gui.SliderBase#trackHighlight
         */
        trackHighlight: DisplayObject;
        private _showTrackHighlight;
        /**
         * 是否启用轨道高亮效果。默认值为true。
         * 注意，皮肤里的子部件trackHighlight要同时为非空才能显示高亮效果。
         * @member egret.gui.SliderBase#showTrackHighlight
         */
        showTrackHighlight: boolean;
        /**
         * 动画实例
         */
        private animator;
        private _pendingValue;
        /**
         * 释放鼠标按键时滑块将具有的值。无论liveDragging是否为true，在滑块拖动期间始终更新此属性。
         * 而value属性在当liveDragging为false时，只在鼠标释放时更新一次。
         * @member egret.gui.SliderBase#pendingValue
         */
        pendingValue: number;
        /**
         * 在 value 属性改变时为该属性设置后备存储，并调度 valueCommit 事件
         * @method egret.gui.SliderBase#setValue
         * @param value {number}
         */
        setValue(value: number): void;
        /**
         * 动画播放更新数值
         */
        _animationUpdateHandler(animation: Animation): void;
        /**
         * 动画播放结束时要到达的value。
         */
        private slideToValue;
        /**
         * 动画播放完毕
         */
        private animationEndHandler(animation);
        /**
         * 停止播放动画
         */
        private stopAnimation();
        /**
         * @method egret.gui.SliderBase#thumb_mouseDownHandler
         * @param event {TouchEvent}
         */
        thumb_mouseDownHandler(event: TouchEvent): void;
        private _liveDragging;
        /**
         * 如果为 true，则将在沿着轨道拖动滑块时，而不是在释放滑块按钮时，提交此滑块的值。
         * @member egret.gui.SliderBase#liveDragging
         */
        liveDragging: boolean;
        /**
         * @method egret.gui.SliderBase#updateWhenMouseMove
         */
        updateWhenMouseMove(): void;
        /**
         * @method egret.gui.SliderBase#stage_mouseUpHandler
         * @param event {Event}
         */
        stage_mouseUpHandler(event: Event): void;
        /**
         * @method egret.gui.SliderBase#track_mouseDownHandler
         * @param event {TouchEvent}
         */
        track_mouseDownHandler(event: TouchEvent): void;
        /**
         * 正删除外观部件的实例时调用
         * @method egret.gui.SliderBase#partAdded
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.HSlider
     * @classdesc
     * 水平滑块控件
     * @extends egret.gui.SliderBase
     */
    class HSlider extends SliderBase {
        /**
         * 构造函数
         * @method egret.gui.HSlider#constructor
         */
        constructor();
        /**
         * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值
         * @param x
         * @param y
         * @returns {number}
         */
        pointToValue(x: number, y: number): number;
        /**
         * 设置外观部件的边界，这些外观部件的几何图形不是完全由外观的布局指定的
         */
        updateSkinDisplayList(): void;
    }
}
declare module egret.gui {
    /**
     *  @classdesc
     * HScrollBar（水平 ScrollBar）控件可以在因数据太多而不能在显示区域中以水平方向完全显示时控制显示的数据部分。
     尽管可以使用 HScrollBar 控件作为独立控件，但通常将其结合作为另一组组件的一部分来提供滚动功能
     */
    class HScrollBar extends HSlider {
        private _thumbLengthRatio;
        /**
         *
         * @param width
         * @param contentWidth
         * @private
         */
        _setViewportMetric(width: number, contentWidth: number): void;
        /**
         * @deprecated
         */
        trackAlpha: number;
        /**
         * @deprecated
         */
        thumbAlpha: number;
        setPosition(value: number): void;
        getPosition(): number;
        /**
         *
         * @param value
         * @private
         */
        _setValue(value: number): void;
        /**
         * [覆盖] 更新 value 属性，并且如果 viewport 为非 null，则将其 horizontalScrollPosition 设置为 value
         * @param value
         */
        setValue(value: number): void;
        /**
         *
         * @param animation
         * @private
         */
        _animationUpdateHandler(animation: Animation): void;
        /**
         * 设置外观部件的边界，这些外观部件的几何图形不是完全由外观的布局指定的
         */
        updateSkinDisplayList(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IItemRenderer
     * @interface
     * @classdesc
     * 列表类组件的项呈示器接口
     * @extends egret.gui.ILayoutElement
     */
    interface IItemRenderer extends ILayoutElement {
        /**
         * 要呈示或编辑的数据。
         * @member egret.gui.IItemRenderer#data
         */
        data: any;
        /**
         * 如果项呈示器可以将其自身显示为已选中，则包含 true。
         * @member egret.gui.IItemRenderer#selected
         */
        selected: boolean;
        /**
         * 项呈示器的主机组件的数据提供程序中的项目索引。
         * @member egret.gui.IItemRenderer#itemIndex
         */
        itemIndex: number;
        /**
         * 要在项呈示器中显示的 String。
         * @member egret.gui.IItemRenderer#label
         */
        label: string;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IItemRendererOwner
     * @interface
     * @classdesc
     * 项呈示器的主机组件接口
     */
    interface IItemRendererOwner {
        /**
         * 更新项呈示器数据
         * @method egret.gui.IItemRendererOwner#updateRenderer
         * @param renderer {IItemRenderer}
         * @param itemIndex {number}
         * @param data {any}
         * @returns {IItemRenderer}
         */
        updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ITreeItemRenderer
     * @interface
     * @classdesc
     * 树状列表组件的项呈示器接口
     * @extends egret.gui.IItemRenderer
     */
    interface ITreeItemRenderer extends IItemRenderer {
        /**
         * 图标的皮肤名
         * @member egret.gui.ITreeItemRenderer#iconSkinName
         */
        iconSkinName: any;
        /**
         * 缩进深度。0表示顶级节点，1表示第一层子节点，以此类推。
         * @member egret.gui.ITreeItemRenderer#depth
         */
        depth: number;
        /**
         * 是否含有子节点。
         * @member egret.gui.ITreeItemRenderer#hasChildren
         */
        hasChildren: boolean;
        /**
         * 节点是否处于开启状态。
         * @member egret.gui.ITreeItemRenderer#opened
         */
        opened: boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Label
     * @classdesc
     * 一行或多行不可编辑的文本控件
     * @extends egret.gui.TextBase
     */
    class Label extends TextBase {
        /**
         * @method egret.gui.Label#constructor
         */
        constructor();
        /**
         * 一个验证阶段完成
         */
        private updateCompleteHandler(event);
        private _maxDisplayedLines;
        /**
         * 最大显示行数,0或负值代表不限制。
         * @member egret.gui.Label#maxDisplayedLines
         */
        maxDisplayedLines: number;
        /**
         * 上一次测量的宽度
         */
        private lastUnscaledWidth;
        private strokeColorChanged;
        private _strokeColor;
        /**
         * 表示文本的描边颜色。
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         * 默认值为 0x000000。
         * @member {number} egret.TextField#strokeColor
         */
        strokeColor: number;
        _setStrokeColor(value: number): void;
        private _stroke;
        private strokeChanged;
        /**
         * 表示描边宽度。
         * 0为没有描边。
         * 默认值为 0。
         * @member {number} egret.TextField#stroke
         */
        stroke: number;
        private _padding;
        /**
         * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
         * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
         * @member egret.gui.Label#padding
         */
        padding: number;
        private _paddingLeft;
        /**
         * 文字距离左边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.Label#paddingLeft
         */
        paddingLeft: number;
        private _paddingRight;
        /**
         * 文字距离右边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.Label#paddingRight
         */
        paddingRight: number;
        private _paddingTop;
        /**
         * 文字距离顶部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.Label#paddingTop
         */
        paddingTop: number;
        private _paddingBottom;
        /**
         * 文字距离底部边缘的空白像素,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.Label#paddingBottom
         */
        paddingBottom: number;
        /**
         * 处理对组件设置的属性
         * @method egret.gui.TextBase#commitProperties
         */
        commitProperties(): void;
        /**
         * 计算组件的默认大小和（可选）默认最小大小
         * @method egret.gui.Label#measure
         */
        measure(): void;
        /**
         * 特殊情况，组件尺寸由父级决定，要等到父级UpdateDisplayList的阶段才能测量
         */
        private isSpecialCase();
        /**
         * 使用指定的宽度进行测量
         */
        private measureUsingWidth(w);
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @method egret.gui.Label#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.PopUpAnchor
     * @classdesc
     * PopUpAnchor组件用于定位布局中的弹出控件或下拉控件
     * @extends egret.gui.UIComponent
     */
    class PopUpAnchor extends UIComponent {
        /**
         * 构造函数
         * @method egret.gui.PopUpAnchor#constructor
         */
        constructor();
        /**
         * popUp已经弹出的标志
         */
        private popUpIsDisplayed;
        /**
         * 自身已经添加到舞台标志
         */
        private addedToStage;
        private _popUpHeightMatchesAnchorHeight;
        /**
         * 如果为 true，则将popUp控件的高度设置为 PopUpAnchor的高度值。
         * @member egret.gui.PopUpAnchor#popUpHeightMatchesAnchorHeight
         */
        popUpHeightMatchesAnchorHeight: boolean;
        private _popUpWidthMatchesAnchorWidth;
        /**
         * 如果为true，则将popUp控件的宽度设置为PopUpAnchor的宽度值。
         * @member egret.gui.PopUpAnchor#popUpWidthMatchesAnchorWidth
         */
        popUpWidthMatchesAnchorWidth: boolean;
        private _displayPopUp;
        /**
         * 如果为 true，则将popUp对象弹出。若为false，关闭弹出的popUp。
         * @member egret.gui.PopUpAnchor#displayPopUp
         */
        displayPopUp: boolean;
        private _popUp;
        /**
         * 要弹出或移除的目标显示对象。
         * @member egret.gui.PopUpAnchor#popUp
         */
        popUp: IVisualElement;
        private _relativeToStage;
        private _popUpPosition;
        /**
         * popUp相对于PopUpAnchor的弹出位置。请使用PopUpPosition里定义的常量。默认值TOP_LEFT。
         * @member egret.gui.PopUpAnchor#popUpPosition
         */
        popUpPosition: string;
        /**
         * @method egret.gui.PopUpAnchor#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * 手动刷新popUp的弹出位置和尺寸。
         * @method egret.gui.PopUpAnchor#updatePopUpTransform
         */
        updatePopUpTransform(): void;
        /**
         * 计算popUp的弹出位置
         */
        private calculatePopUpPosition();
        /**
         * 正在播放动画的标志
         */
        private inAnimation;
        /**
         * 动画类实例
         */
        private animator;
        private _openDuration;
        /**
         * 窗口弹出的动画时间(以毫秒为单位)，设置为0则直接弹出窗口而不播放动画效果。默认值250。
         * @member egret.gui.PopUpAnchor#openDuration
         */
        openDuration: number;
        private _closeDuration;
        /**
         * 窗口关闭的动画时间(以毫秒为单位)，设置为0则直接关闭窗口而不播放动画效果。默认值150。
         * @member egret.gui.PopUpAnchor#closeDuration
         */
        closeDuration: number;
        /**
         * 动画开始播放触发的函数
         */
        private animationStartHandler(animation);
        /**
         * 动画播放过程中触发的更新数值函数
         */
        private animationUpdateHandler(animation);
        /**
         * 动画播放完成触发的函数
         */
        private animationEndHandler(animation);
        /**
         * 添加或移除popUp
         */
        private addOrRemovePopUp();
        /**
         * 移除并重置popUp
         */
        private removeAndResetPopUp();
        /**
         * 对popUp应用尺寸和位置调整
         */
        private applyPopUpTransform(unscaledWidth, unscaledHeight);
        /**
         * 开始播放动画
         */
        private startAnimation();
        private valueRange;
        /**
         * 创建动画轨迹
         */
        private createMotionPath();
        /**
         * 添加到舞台事件
         */
        private addedToStageHandler(event);
        /**
         * 延迟检查弹出状态，防止堆栈溢出。
         */
        private checkPopUpState();
        /**
         * 从舞台移除事件
         */
        private removedFromStageHandler(event);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ProgressBar
     * @classdesc
     * 进度条控件。
     * @extends egret.gui.Range
     */
    class ProgressBar extends Range {
        /**
         * @method egret.gui.ProgressBar#constructor
         */
        constructor();
        /**
         * [SkinPart]进度高亮显示对象。
         * @member egret.gui.ProgressBar#thumb
         */
        thumb: DisplayObject;
        /**
         * [SkinPart]轨道显示对象，用于确定thumb要覆盖的区域。
         * @member egret.gui.ProgressBar#track
         */
        track: DisplayObject;
        /**
         * [SkinPart]进度条文本
         * @member egret.gui.ProgressBar#labelDisplay
         */
        labelDisplay: Label;
        private _labelFunction;
        /**
         * 进度条文本格式化回调函数。示例：labelFunction(value:Number,maximum:Number):String;
         * @member egret.gui.ProgressBar#labelFunction
         */
        labelFunction: Function;
        /**
         * 将当前value转换成文本
         * @method egret.gui.ProgressBar#valueToLabel
         * @param value {number}
         * @param maximum {number}
         * @returns {string}
         */
        valueToLabel(value: number, maximum: number): string;
        private _slideDuration;
        /**
         * value改变时调整thumb长度的缓动动画时间，单位毫秒。设置为0则不执行缓动。默认值500。
         * @member egret.gui.ProgressBar#slideDuration
         */
        slideDuration: number;
        private _direction;
        /**
         * 进度条增长方向。请使用ProgressBarDirection定义的常量。默认值：ProgressBarDirection.LEFT_TO_RIGHT。
         * @member egret.gui.ProgressBar#direction
         */
        direction: string;
        /**
         * 动画实例
         */
        private animator;
        /**
         * 动画播放结束时要到达的value。
         */
        private slideToValue;
        /**
         * 进度条的当前值。
         * 注意：当组件添加到显示列表后，若slideDuration不为0。设置此属性，并不会立即应用。而是作为目标值，开启缓动动画缓慢接近。
         * 若需要立即重置属性，请先设置slideDuration为0，或者把组件从显示列表移除。
         * @member egret.gui.ProgressBar#value
         */
        value: number;
        private animationValue;
        /**
         * 动画播放更新数值
         */
        private animationUpdateHandler(animation);
        /**
         * @method egret.gui.ProgressBar#setValue
         * @param value {number}
         */
        setValue(value: number): void;
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @method egret.gui.ProgressBar#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * [覆盖] 添加外观部件时调用
         * @param partName
         * @param instance
         */
        partAdded(partName: string, instance: any): void;
        /**
         * [覆盖] 正删除外观部件的实例时调用
         * @param partName
         * @param instance
         */
        partRemoved(partName: string, instance: any): void;
        private trackResizedOrMoved;
        /**
         * track的位置或尺寸发生改变
         */
        private onTrackResizeOrMove(event);
        /**
         * 处理对组件设置的属性
         */
        commitProperties(): void;
        /**
         * 更新皮肤部件大小和可见性。
         * @method egret.gui.ProgressBar#updateSkinDisplayList
         */
        updateSkinDisplayList(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ProgressBarDirection
     * @classdesc
     * 定义进度条控件增长方向的常量
     */
    class ProgressBarDirection {
        /**
         * 水平从左到右增长
         * @constant egret.gui.ProgressBarDirection.LEFT_TO_RIGHT
         */
        static LEFT_TO_RIGHT: string;
        /**
         * 水平从右到左增长
         * @constant egret.gui.ProgressBarDirection.RIGHT_TO_LEFT
         */
        static RIGHT_TO_LEFT: string;
        /**
         * 竖直从上到下增长
         * @constant egret.gui.ProgressBarDirection.TOP_TO_BOTTOM
         */
        static TOP_TO_BOTTOM: string;
        /**
         * 竖直从下到上增长
         * @constant egret.gui.ProgressBarDirection.BOTTOM_TO_TOP
         */
        static BOTTOM_TO_TOP: string;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.RadioButton
     * @classdesc
     * RadioButton 组件使用户可在一组互相排斥的选择中做出一种选择
     * @extends egret.gui.ToggleButtonBase
     */
    class RadioButton extends ToggleButtonBase {
        /**
         * 构造函数
         * @method egret.gui.RadioButton#constructor
         */
        constructor();
        /**
         * 在RadioButtonGroup中的索引
         */
        _indexNumber: number;
        /**
         * 所属的RadioButtonGroup
         */
        _radioButtonGroup: RadioButtonGroup;
        /**
         * 组件是否可以接受用户交互。默认值为true。设置此属性将影响组内所有单选按钮
         * @member egret.gui.RadioButton#enabled
         */
        /**
         * @inheritDoc
         */
        enabled: boolean;
        /**
         * 存储根据groupName自动创建的RadioButtonGroup列表
         */
        private static automaticRadioButtonGroups;
        private _group;
        /**
         * 此单选按钮所属的组。同一个组的多个单选按钮之间互斥。
         * 若不设置此属性，则根据groupName属性自动创建一个唯一的RadioButtonGroup。
         * @member egret.gui.RadioButton#group
         */
        group: RadioButtonGroup;
        private groupChanged;
        private _groupName;
        /**
         * 所属组的名称,具有相同组名的多个单选按钮之间互斥。默认值:"radioGroup"。
         * 可以把此属性当做设置组的一个简便方式，作用与设置group属性相同,。
         * @member egret.gui.RadioButton#groupName
         */
        groupName: string;
        /**
         *
         * @param value
         * @private
         */
        _setSelected(value: boolean): void;
        private _value;
        /**
         * 与此单选按钮关联的自定义数据。
         * 当被点击时，所属的RadioButtonGroup对象会把此属性赋值给ItemClickEvent.item属性并抛出事件。
         * @member egret.gui.RadioButton#value
         */
        value: any;
        /**
         * 处理对组件设置的属性
         * @method egret.gui.RadioButton#commitProperties
         */
        commitProperties(): void;
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @method egret.gui.RadioButton#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * 当在用户单击按钮之后处理 MouseEvent.MOUSE_UP 事件时，将调用此方法
         * @method egret.gui.RadioButton#buttonReleased
         */
        buttonReleased(): void;
        /**
         * 添此单选按钮加到组
         */
        private addToGroup();
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.RadioButtonGroup
     * @classdesc
     * RadioButtonGroup 组件定义一组 RadioButton 组件，这些组件相互排斥；因此，用户每次只能选择一个 RadioButton 组件
     * @extends egret.EventDispatcher
     */
    class RadioButtonGroup extends EventDispatcher {
        /**
         * 构造函数
         * @method egret.gui.RadioButtonGroup#constructor
         */
        constructor();
        private static groupCount;
        /**
         * 组名
         */
        _name: string;
        /**
         * 单选按钮列表
         */
        private radioButtons;
        private _enabled;
        /**
         * 组件是否可以接受用户交互。默认值为true。设置此属性将影响组内所有单选按钮。
         * @member egret.gui.RadioButtonGroup#enabled
         */
        enabled: boolean;
        /**
         * 组内单选按钮数量
         * @member egret.gui.RadioButtonGroup#numRadioButtons
         */
        numRadioButtons: number;
        private _selectedValue;
        /**
         * 当前被选中的单选按钮的value属性值。注意，此属性仅当目标RadioButton在显示列表时有效。
         * @member egret.gui.RadioButtonGroup#selectedValue
         */
        selectedValue: any;
        private _selection;
        /**
         * 当前被选中的单选按钮引用,注意，此属性仅当目标RadioButton在显示列表时有效。
         * @member egret.gui.RadioButtonGroup#selection
         */
        selection: RadioButton;
        /**
         * 获取指定索引的单选按钮
         * @method egret.gui.RadioButtonGroup#getRadioButtonAt
         * @param index {number} 单选按钮的索引
         * @returns {RadioButton}
         */
        getRadioButtonAt(index: number): RadioButton;
        /**
         * 添加单选按钮到组内
         * @param instance {RadioButton}
         */
        _addInstance(instance: RadioButton): void;
        /**
         * 从组里移除单选按钮
         * @param instance {RadioButton}
         */
        _removeInstance(instance: RadioButton): void;
        /**
         * 执行从组里移除单选按钮
         */
        private doRemoveInstance(instance, addListener?);
        /**
         * 设置选中的单选按钮
         * @param value {RadioButton}
         * @param fireChange {boolean}
         */
        _setSelection(value: RadioButton, fireChange?: boolean): void;
        /**
         * 改变选中项
         */
        private changeSelection(index, fireChange?);
        /**
         * 单选按钮添加到显示列表
         */
        private radioButton_addedHandler(event);
        /**
         * 单选按钮从显示列表移除
         */
        private radioButton_removedHandler(event);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Rect
     * @classdesc
     * 矩形绘图元素。此组件可响应鼠标事件。
     * @extends egret.gui.UIComponent
     */
    class Rect extends UIComponent {
        /**
         * 构造函数
         * @method egret.gui.Rect#constructor
         */
        constructor();
        /**
         * @private
         */
        $graphics: Graphics;
        graphics: Graphics;
        $render(context: egret.sys.RenderContext): void;
        $hitTest(stageX: number, stageY: number): DisplayObject;
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
        private _fillColor;
        /**
         * 填充颜色
         * @member egret.gui.Rect#fillColor
         */
        fillColor: number;
        private _fillAlpha;
        /**
         * 填充透明度,默认值为0。
         * @member egret.gui.Rect#fillAlpha
         */
        fillAlpha: number;
        private _strokeColor;
        /**
         * 边框颜色,注意：当strokeAlpha为0时，不显示边框。
         * @member egret.gui.Rect#strokeColor
         */
        strokeColor: number;
        private _strokeAlpha;
        /**
         * 边框透明度，默认值为0。
         * @member egret.gui.Rect#strokeAlpha
         */
        strokeAlpha: number;
        private _strokeWeight;
        /**
         * 边框粗细(像素),注意：当strokeAlpha为0时，不显示边框。
         * @member egret.gui.Rect#strokeWeight
         */
        strokeWeight: number;
        /**
         * @see egret.DisplayObject.measureBounds
         * @returns {Rectangle}
         * @private
         */
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @method egret.gui.Rect#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module egret.gui {
    /**
     * @private
     */
    class ScrollerView extends DisplayObjectContainer {
        /**
         * @private
         */
        _ScrV_Props_: ScrollerViewProperties;
        /**
         * @language en_US
         * Start rolling threshold when the touch point from the initial touch point at a distance exceeding this value will trigger roll
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 开始滚动的阈值，当触摸点偏离初始触摸点的距离超过这个值时才会触发滚动
         * @version Egret 2.4
         * @platform Web,Native
         */
        scrollBeginThreshold: number;
        /**
         * @language en_US
         * Scrolling speed, the speed is required and the default speed ratio.
         * The range of scrollSpeed> 0 assigned to 2:00, the speed is 2 times the default speed
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 滚动速度，这个值为需要的速度与默认速度的比值。
         * 取值范围为 scrollSpeed > 0 赋值为 2 时，速度是默认速度的 2 倍
         * @version Egret 2.4
         * @platform Web,Native
         */
        scrollSpeed: number;
        /**
         * @language en_US
         * Whether to enable rebound, rebound When enabled, ScrollerView contents allowed to continue to drag the border after arriving at the end user drag operation, and then bounce back boundary position
         * @default true
         * @version Egret 2.4
         */
        /**
         * @language zh_CN
         * 是否启用回弹，当启用回弹后，ScrollView中内容在到达边界后允许继续拖动，在用户拖动操作结束后，再反弹回边界位置
         * @default true
         * @version Egret 2.4
         */
        bounces: boolean;
        /**
         * @language en_US
         * Create a egret.ScrollerView objects
         * @param content {egret.DisplayObject} You need to scroll object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.ScrollerView 对象
         * @param content {egret.DisplayObject} 需要滚动的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(content?: DisplayObject);
        /**
         * @private
         */
        _content: DisplayObject;
        /**
         * @language en_US
         * Set to scroll object
         * @param content {egret.DisplayObject} You need to scroll object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置需要滚动的对象
         * @param content {egret.DisplayObject} 需要滚动的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        setContent(content: DisplayObject): void;
        /**
         * @language en_US
         * Remove rolling objects
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 移除滚动的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeContent(): void;
        /**
         * @language en_US
         * Vertical scroll bar display policy, on / off / auto.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 垂直滚动条显示策略，on/off/auto。
         * @version Egret 2.4
         * @platform Web,Native
         */
        verticalScrollPolicy: string;
        /**
         * @language en_US
         * The horizontal scroll bar display policy, on / off / auto.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 水平滚动条显示策略，on/off/auto。
         * @version Egret 2.4
         * @platform Web,Native
         */
        horizontalScrollPolicy: string;
        /**
         * @language en_US
         * Gets or sets the horizontal scroll position
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取或设置水平滚动位置,
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        scrollLeft: number;
        /**
         * @language en_US
         * Gets or sets the vertical scroll position
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取或设置垂直滚动位置,
         * @returns {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        scrollTop: number;
        /**
         * @language en_US
         * Set scroll position
         * @param top {number} The vertical scroll position
         * @param left {number} The horizontal scroll position
         * @param isOffset {boolean} Optional parameter, the default is false, whether it is the amount of scrolling increase as top = 1 on behalf of one pixel scroll up
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置滚动位置
         * @param top {number} 垂直滚动位置
         * @param left {number} 水平滚动位置
         * @param isOffset {boolean} 可选参数，默认是false，是否是滚动增加量，如 top=1 代表往上滚动1像素
         * @version Egret 2.4
         * @platform Web,Native
         */
        setScrollPosition(top: number, left: number, isOffset?: boolean): void;
        /**
         * @private
         *
         * @param top
         * @param left
         */
        private _validatePosition(top?, left?);
        /**
         * @private
         * @inheritDoc
         */
        $setWidth(value: number): boolean;
        /**
         * @private
         * @inheritDoc
         */
        $setHeight(value: number): boolean;
        /**
         * @private
         *
         */
        _updateContentPosition(): void;
        /**
         * @private
         *
         * @returns
         */
        _checkScrollPolicy(): boolean;
        /**
         * @private
         *
         * @param policy
         * @param contentLength
         * @param viewLength
         * @returns
         */
        private __checkScrollPolicy(policy, contentLength, viewLength);
        /**
         * @private
         *
         * @returns
         */
        _addEvents(): void;
        /**
         * @private
         *
         * @returns
         */
        _removeEvents(): void;
        private _tempStage;
        /**
         * @private
         *
         * @param e
         */
        _onTouchBegin(e: TouchEvent): void;
        /**
         * @private
         */
        private delayTouchBeginEvent;
        /**
         * @private
         */
        private touchBeginTimer;
        /**
         * @private
         *
         * @param event
         */
        _onTouchBeginCapture(event: TouchEvent): void;
        /**
         * @private
         *
         * @param event
         * @returns
         */
        private _onTouchEndCapture(event);
        /**
         * @private
         *
         */
        private _onTouchBeginTimer();
        /**
         * @private
         *
         * @param event
         * @returns
         */
        private dispatchPropagationEvent(event);
        /**
         * @private
         *
         * @param event
         * @returns
         */
        _onTouchMove(event: TouchEvent): void;
        /**
         * @private
         *
         * @param event
         * @returns
         */
        _onTouchEnd(event: TouchEvent): void;
        /**
         * @private
         *
         * @param event
         * @returns
         */
        _onEnterFrame(event: Event): void;
        /**
         * @private
         *
         * @param e
         * @returns
         */
        private _logTouchEvent(e);
        /**
         * @private
         *
         * @param e
         * @returns
         */
        private _getPointChange(e);
        /**
         * @private
         *
         * @param e
         * @returns
         */
        private _calcVelocitys(e);
        /**
         * @private
         *
         * @returns
         */
        _getContentWidth(): number;
        /**
         * @private
         *
         * @returns
         */
        _getContentHeight(): number;
        /**
         * @language en_US
         * The left side of the maximum distance
         * @returns The left side of the maximum distance
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 距离左侧的最大值
         * @returns 距离左侧最大值
         * @version Egret 2.4
         * @platform Web,Native
         */
        getMaxScrollLeft(): number;
        /**
         * @language en_US
         * Above the maximum distance
         * @returns Above the maximum distance
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 距离上方最大值
         * @returns 距离上方最大值
         * @version Egret 2.4
         * @platform Web,Native
         */
        getMaxScrollTop(): number;
        /**
         * @private
         */
        private static weight;
        /**
         * @private
         *
         */
        private _moveAfterTouchEnd();
        /**
         * @private
         *
         * @param tw
         */
        private onTweenFinished(tw);
        /**
         * @private
         *
         * @returns
         */
        _onScrollStarted(): void;
        /**
         * @private
         *
         * @returns
         */
        _onScrollFinished(): void;
        /**
         * @language en_US
         * Set the scroll position above the distance
         * @param scrollTop Position above distance
         * @param duration Easing of time, in milliseconds
         * @returns Get tween vertical scrolling
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置滚动距离上方的位置
         * @param scrollTop 距离上方的位置
         * @param duration 缓动时间，毫秒单位
         * @returns 获取垂直滚动的tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        setScrollTop(scrollTop: number, duration?: number): void;
        /**
         * @language en_US
         * Set the scroll position from the left side
         * @param scrollLeft From the position on the left side
         * @param duration Get tween vertical scrolling
         * @returns Gets the horizontal scroll tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置滚动距离左侧的位置
         * @param scrollLeft 距离左侧的位置
         * @param duration 缓动时间，毫秒单位
         * @returns 获取水平滚动的tween
         * @version Egret 2.4
         * @platform Web,Native
         */
        setScrollLeft(scrollLeft: number, duration?: number): void;
        /**
         * @private
         *
         * @param pixelsPerMS
         * @param curPos
         * @param maxPos
         * @returns
         */
        private getAnimationDatas(pixelsPerMS, curPos, maxPos);
        /**
         * @private
         *
         * @param event
         * @returns
         */
        private cloneTouchEvent(event);
        /**
         * @private
         *
         * @returns
         */
        private throwNotSupportedError();
        /**
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         * @version Egret 2.4
         * @platform Web,Native
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         * @version Egret 2.4
         * @platform Web,Native
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         * @deprecated
         * @param index {number}
         * @returns {DisplayObject}
         * @version Egret 2.4
         * @platform Web,Native
         */
        removeChildAt(index: number): DisplayObject;
        /**
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        setChildIndex(child: DisplayObject, index: number): void;
        /**
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         * @version Egret 2.4
         * @platform Web,Native
         */
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         * @version Egret 2.4
         * @platform Web,Native
         */
        swapChildrenAt(index1: number, index2: number): void;
        $measureContentBounds(bounds: Rectangle): void;
        /**
         * @inheritDoc
         */
        $hitTest(stageX: number, stageY: number): DisplayObject;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Scroller
     * @classdesc
     * 滚动条组件
     * @extends egret.gui.UIComponent
     * @implements egret.gui.IVisualElementContainer
     */
    class Scroller extends SkinnableComponent implements IVisualElementContainer {
        _Scr_Props_: ScrollerProperties;
        /**
         * 构造函数
         * @method egret.gui.Scroller#constructor
         */
        constructor();
        /**
         * 是否启用回弹，当启用回弹后，Scroller中内容在到达边界后允许继续拖动，在用户拖动操作结束后，再反弹回边界位置
         * 默认值是 true
         */
        bounces: boolean;
        setContent(content: IViewport): void;
        _updateContentPosition(): void;
        getMaxScrollLeft(): number;
        getMaxScrollTop(): number;
        _getContentWidth(): number;
        _getContentHeight(): number;
        _onScrollStarted(): void;
        _onScrollFinished(): void;
        /**
         * [SkinPart]水平滚动条
         */
        horizontalScrollBar: HScrollBar;
        /**
         * [SkinPart]垂直滚动条
         */
        verticalScrollBar: VScrollBar;
        /**
         * 计算组件的默认大小和（可选）默认最小大小
         * @method egret.gui.Scroller#measure
         */
        measure(): void;
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * 垂直滚动条显示策略，参见ScrollPolicy类定义的常量。
         * @member egret.gui.Scroller#verticalScrollPolicy
         */
        verticalScrollPolicy: string;
        /**
         * 水平滚动条显示策略，参见ScrollPolicy类定义的常量。
         * @member egret.gui.Scroller#horizontalScrollPolicy
         */
        horizontalScrollPolicy: string;
        /**
         * 要滚动的视域组件。
         * @member egret.gui.Scroller#viewport
         */
        viewport: IViewport;
        /**
         * 安装并初始化视域组件
         */
        private installViewport();
        /**
         * 卸载视域组件
         */
        private uninstallViewport();
        /**
         *
         * @param e
         * @private
         */
        private _viewportChangedHandler(e);
        /**
         *
         * @param e
         * @private
         */
        private _scrollerChangedHandler(e);
        /**
         *
         * @param pos
         */
        private setViewportVScrollPosition(pos);
        private setViewportHScrollPosition(pos);
        /**
         * 缓动到水平滚动位置
         * @method egret.gui.Scroller#throwHorizontally
         * @param hspTo {number}
         * @param duration {number}
         */
        throwHorizontally(hspTo: number, duration?: number): void;
        /**
         * 缓动到垂直滚动位置
         * @method egret.gui.Scroller#throwVertically
         * @param vspTo {number}
         * @param duration {number}
         */
        throwVertically(vspTo: number, duration?: number): void;
        /**
         * 是否自动隐藏滚动条
         * @member egret.gui.Scroller#autoHideScrollBars
         */
        autoHideScrollBars: boolean;
        /**
         * 自动隐藏滚动条延时时间(毫秒)，当autoHideScrollBars为true时有效
         * @member egret.gui.Scroller#autoHideDelay
         */
        autoHideDelay: number;
        private setAutoHideTimer();
        private hideOrShow(show);
        /**
         * @member egret.gui.Scroller#numElements
         */
        numElements: number;
        /**
         * 抛出索引越界异常
         */
        private throwRangeError(index);
        /**
         * 如果存在视域，且传入的索引为 0，则返回该视域
         * @param index {number}
         * @returns {IVisualElement}
         */
        getElementAt(index: number): IVisualElement;
        /**
         * 如果传入的元素是视域，则返回 0
         * @param element {IVisualElement}
         * @returns {number}
         */
        getElementIndex(element: IVisualElement): number;
        /**
         * 确定指定显示对象是 DisplayObjectContainer 实例的子项还是该实例本身
         * @param element {IVisualElement}
         * @returns {boolean}
         */
        containsElement(element: IVisualElement): boolean;
        private throwNotSupportedError();
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        addElement(element: IVisualElement): IVisualElement;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param element {IVisualElement}
         * @param index {number}
         * @returns {IVisualElement}
         */
        addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        removeElement(element: IVisualElement): IVisualElement;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param index {number}
         * @returns {IVisualElement}
         */
        removeElementAt(index: number): IVisualElement;
        /**
         * Scroller 不支持该操作
         * @deprecated
         */
        removeAllElements(): void;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param element {IVisualElement}
         * @param index {number}
         */
        setElementIndex(element: IVisualElement, index: number): void;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param element1 {IVisualElement}
         * @param element2 {IVisualElement}
         */
        swapElements(element1: IVisualElement, element2: IVisualElement): void;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         */
        swapElementsAt(index1: number, index2: number): void;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param index {number}
         * @returns {DisplayObject}
         */
        removeChildAt(index: number): DisplayObject;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         */
        setChildIndex(child: DisplayObject, index: number): void;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         */
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
         * Scroller 不支持该操作
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         */
        swapChildrenAt(index1: number, index2: number): void;
        /**
         *
         * @private
         */
        _checkHbar(): void;
        /**
         *
         * @private
         */
        _checkVbar(): void;
        /**
         * 创建容器的子元素
         */
        createChildren(): void;
        /**
         * 若皮肤是ISkin,则调用此方法附加皮肤中的公共部件
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * 若皮肤是ISkin，则调用此方法卸载皮肤之前注入的公共部件
         * @method egret.gui.Scroller#partRemoved
         * @param partName {string}
         * @param instance {any}
         */
        partRemoved(partName: string, instance: any): void;
        _uninstallHorizontalScrollBar(): void;
        _uninstallVerticalScrollBar(): void;
        private hBarChanged(e);
        private vBarChanged(e);
    }
}
declare module egret.gui {
    /**
     * @private
     */
    class ScrollerProperties {
        _viewport: IViewport;
        _autoHideScrollBars: boolean;
        _autoHideTimer: number;
        _autoHideDelay: number;
        _autoHideShowAnimat: Animation;
        _animatTargetIsShow: boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Spacer
     * @classdesc
     * 占位组件,一个布局辅助类。
     * 自身完全不可见，但可以在父级容器的布局中分配空间，通常用于垂直和水平布局中，推挤其他组件。
     * @extends egret.gui.UIComponent
     */
    class Spacer extends UIComponent {
        /**
         * 构造函数
         * @method egret.gui.Spacer#constructor
         */
        constructor();
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TabBar
     * @classdesc
     * 选项卡组件
     * @extends egret.gui.ListBase
     */
    class TabBar extends List {
        /**
         * 构造函数
         * @method egret.gui.TabBar#constructor
         */
        constructor();
        /**
         * 创建容器的子元素
         */
        createChildren(): void;
        /**
         * requireSelection改变标志
         */
        private requireSelectionChanged_tabBar;
        /**
         * @method egret.gui.TabBar#requireSelection
         * @param value {boolean}
         */
        requireSelection: boolean;
        /**
         * @inheritDoc
         */
        _setDataProvider(value: ICollection): void;
        /**
         * 鼠标点击的选中项改变
         */
        private onIndexChanged(event);
        /**
         * ViewStack选中项发生改变
         */
        private onViewStackIndexChange(event);
        /**
         * 处理对组件设置的属性
         */
        commitProperties(): void;
        dataGroup_rendererAddHandler(event: RendererExistenceEvent): void;
        /**
         * 鼠标在项呈示器上弹起，抛出ItemClick事件。
         */
        _item_touchEndHandler(event: TouchEvent): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TabBarButton
     * @classdesc
     * 选项卡组件的按钮条目
     * @extends egret.gui.ToggleButtonBase
     * @implements egret.gui.IItemRenderer
     */
    class TabBarButton extends ToggleButtonBase implements IItemRenderer {
        constructor();
        private _allowDeselection;
        /**
         * 如果为 true，用户单击当前选定的按钮时即会将其取消选择。
         * 如果为 false，用户必须选择不同的按钮才可取消选择当前选定的按钮。
         * @member egret.gui.TabBarButton#allowDeselection
         */
        allowDeselection: boolean;
        private _data;
        /**
         * @member egret.gui.TabBarButton#data
         */
        data: any;
        private _itemIndex;
        /**
         * @member egret.gui.TabBarButton#itemIndex
         */
        itemIndex: number;
        /**
         * @inheritDoc
         */
        _setLabel(value: string): void;
        buttonReleased(): void;
    }
}
declare module egret.gui {
    class SkinnableTextBase extends SkinnableComponent {
        /**
         * 构造函数
         */
        constructor();
        _focusEnabled: boolean;
        /**
         * 是否能够自动获得焦点的标志
         */
        focusEnabled: boolean;
        private isFocus;
        /**
         * 焦点移入
         */
        private focusInHandler(event);
        /**
         * 焦点移出
         */
        private focusOutHandler(event);
        /**
         * [SkinPart]实体文本输入组件
         */
        textDisplay: IEditableText;
        /**
         * textDisplay改变时传递的参数
         */
        private textDisplayProperties;
        /**
         * [SkinPart]当text属性为空字符串时要显示的文本。
         */
        promptDisplay: IDisplayText;
        private _prompt;
        /**
         * 当text属性为空字符串时要显示的文本内容。 <p/>
         * 先创建文本控件时将显示提示文本。控件获得焦点时或控件的 text 属性为非空字符串时，提示文本将消失。
         * 控件失去焦点时提示文本将重新显示，但仅当未输入文本时（如果文本字段的值为空字符串）。<p/>
         * 对于文本控件，如果用户输入文本，但随后又将其删除，则控件失去焦点后，提示文本将重新显示。
         * 您还可以通过编程方式将文本控件的 text 属性设置为空字符串使提示文本重新显示。
         */
        prompt: string;
        /**
         * @inheritDoc
         */
        /**
         * @inheritDoc
         */
        maxWidth: number;
        /**
         * 文本颜色。
         */
        textColor: number;
        /**
         * 指定文本字段是否是密码文本字段。如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。
         * 如果为 false，则不会将文本字段视为密码文本字段。启用密码模式时，“剪切”和“复制”命令及其对应的键盘快捷键将不起作用。
         * 此安全机制可防止不良用户使用快捷键在无人看管的计算机上破译密码。
         */
        displayAsPassword: boolean;
        /**
         * 文本是否可编辑的标志。
         */
        editable: boolean;
        /**
         * 文本字段中最多可包含的字符数（即用户输入的字符数）。脚本可以插入比 maxChars 允许的字符数更多的文本；
         * maxChars 属性仅表示用户可以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。
         */
        maxChars: number;
        /**
         * 表示用户可输入到文本字段中的字符集。如果 restrict 属性的值为 null，则可以输入任何字符。
         * 如果 restrict 属性的值为空字符串，则不能输入任何字符。如果 restrict 属性的值为一串字符，
         * 则只能在文本字段中输入该字符串中的字符。从左向右扫描该字符串。可以使用连字符 (-) 指定一个范围。
         * 只限制用户交互；脚本可将任何文本放入文本字段中。此属性不与属性检查器中的“嵌入字体”选项同步。<p/>
         * 如果字符串以尖号 (ˆ) 开头，则先接受所有字符，然后从接受字符集中排除字符串中 ˆ 之后的字符。
         * 如果字符串不以尖号 (ˆ) 开头，则最初不接受任何字符，然后将字符串中的字符包括在接受字符集中。
         */
        restrict: string;
        /**
         * 一个布尔值，表示文本字段是否可选。值 true 表示文本可选。selectable 属性控制文本字段是否可选，
         * 而不控制文本字段是否可编辑。动态文本字段即使不可编辑，它也可能是可选的。如果动态文本字段是不可选的，
         * 则用户不能选择其中的文本。 <p/>
         * 如果 selectable 设置为 false，则文本字段中的文本不响应来自鼠标或键盘的选择命令，
         * 并且不能使用“复制”命令复制文本。如果 selectable 设置为 true，则可以使用鼠标或键盘选择文本字段中的文本，
         * 并且可以使用“复制”命令复制文本。即使文本字段是动态文本字段而不是输入文本字段，您也可以用这种方式选择文本。
         */
        selectable: boolean;
        /**
         * 当前所选内容中第一个字符从零开始的字符索引值。例如，第一个字符的索引值是 0，
         * 第二个字符的索引值是 1，依此类推。如果未选定任何文本，此属性为 caretIndex 的值
         */
        selectionBeginIndex: number;
        /**
         * 当前所选内容中最后一个字符从零开始的字符索引值。例如，第一个字符的索引值是 0，第二个字符的索引值是 1，
         * 依此类推。如果未选定任何文本，此属性为 caretIndex 的值。
         */
        selectionEndIndex: number;
        /**
         * 插入点（尖号）位置的索引。如果没有显示任何插入点，则在将焦点恢复到字段时，
         * 值将为插入点所在的位置（通常为插入点上次所在的位置，如果字段不曾具有焦点，则为 0）。
         */
        caretIndex: number;
        /**
         * 将第一个字符和最后一个字符的索引值（使用 beginIndex 和 endIndex 参数指定）指定的文本设置为所选内容。
         * 如果两个参数值相同，则此方法会设置插入点，就如同设置 caretIndex 属性一样。
         */
        setSelection(beginIndex: number, endIndex?: number): void;
        /**
         * 选中所有文本。
         */
        selectAll(): void;
        /**
         * 此文本组件所显示的文本。
         */
        text: string;
        _getText(): any;
        _setText(value: string): void;
        _getWidthInChars(): number;
        _setWidthInChars(value: number): void;
        _getHeightInLines(): number;
        _setHeightInLines(value: number): void;
        /**
         * 返回要应用到外观的状态的名称
         * @inheritDoc
         */
        getCurrentSkinState(): string;
        /**
         * 添加外观部件时调用
         * @inheritDoc
         */
        partAdded(partName: string, instance: any): void;
        /**
         * 正删除外观部件的实例时调用
         * @inheritDoc
         */
        partRemoved(partName: string, instance: any): void;
        /**
         * 设置此组件的焦点
         * @inheritDoc
         */
        setFocus(): void;
        /**
         * 当皮肤不为ISkinPartHost时，创建TextDisplay显示对象
         */
        _createTextDisplay(): void;
        /**
         * @inheritDoc
         */
        _removeSkinParts(): void;
        /**
         * textDisplay附加
         */
        private textDisplayAdded();
        /**
         * textDisplay移除
         */
        private textDisplayRemoved();
        /**
         * textDisplay文字改变事件
         */
        private textDisplay_changeHandler(event);
        /**
         * textDisplay文字即将改变事件
         */
        private textDisplay_changingHandler(event);
    }
}
declare module egret.gui {
    class TextArea extends SkinnableTextBase {
        /**
         * 构造函数
         */
        constructor();
        /**
         * 控件的默认宽度（使用字号：size为单位测量）。 若同时设置了maxChars属性，将会根据两者测量结果的最小值作为测量宽度。
         */
        widthInChars: number;
        /**
         * 控件的默认高度（以行为单位测量）。
         */
        heightInLines: number;
        /**
         * 水平滚动条策略改变标志
         */
        private horizontalScrollPolicyChanged;
        private _horizontalScrollPolicy;
        /**
         * 水平滚动条显示策略，参见ScrollPolicy类定义的常量。
         */
        horizontalScrollPolicy: string;
        /**
         * 垂直滚动条策略改变标志
         */
        private verticalScrollPolicyChanged;
        private _verticalScrollPolicy;
        /**
         * 垂直滚动条显示策略，参见ScrollPolicy类定义的常量。
         */
        verticalScrollPolicy: string;
        /**
         * [SkinPart]实体滚动条组件
         */
        scroller: Scroller;
        _setText(value: string): void;
        /**
         * 处理对组件设置的属性
         * @inheritDoc
         */
        commitProperties(): void;
        /**
         * 添加外观部件时调用
         * @inheritDoc
         */
        partAdded(partName: string, instance: any): void;
        /**
         * 创建外观部件的引用
         * @inheritDoc
         */
        createSkinParts(): void;
    }
}
declare module egret.gui {
    /**
     * TextInput 是一个文本输入控件，供用户输入和编辑单行统一格式文本
     * @classic
     */
    class TextInput extends SkinnableTextBase {
        /**
         * 构造函数
         */
        constructor();
        /**
         * 控件的默认宽度（使用字号：size为单位测量）。 若同时设置了maxChars属性，将会根据两者测量结果的最小值作为测量宽度。
         */
        widthInChars: number;
        _setText(value: string): void;
        /**
         * 添加外观部件时调用
         * @inheritDoc
         */
        partAdded(partName: string, instance: any): void;
        /**
         *  创建外观部件的引用
         * @inheritDoc
         */
        createSkinParts(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ToggleButton
     * @classdesc
     * 切换按钮
     * @extends egret.gui.ToggleButtonBase
     */
    class ToggleButton extends ToggleButtonBase {
        /**
         * 构造函数
         * @method egret.gui.ToggleButton#constructor
         */
        constructor();
        /**
         * [SkinPart]按钮上的文本标签
         * @member egret.gui.ButtonBase#labelDisplay
         */
        iconDisplay: UIAsset;
        private _icon;
        /**
         * 要在按钮上显示的图标
         * @member egret.gui.ButtonBase#icon
         */
        icon: any;
        _getIcon(): any;
        _setIcon(value: any): void;
        /**
         * [覆盖] 添加外观部件时调用
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ToggleSwitch
     * @classdesc
     * 开关按钮
     * @extends egret.gui.ToggleButtonBase
     */
    class ToggleSwitch extends ToggleButtonBase {
        /**
         * 构造函数
         * @method egret.gui.ToggleSwitch#constructor
         */
        constructor();
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TreeItemRenderer
     * @classdesc
     * Tree组件的项呈示器基类
     * @extends egret.gui.ItemRenderer
     * @implements egret.gui.ITreeItemRenderer
     */
    class TreeItemRenderer extends ItemRenderer implements ITreeItemRenderer {
        /**
         * 构造函数
         * @method egret.gui.TreeItemRenderer#constructor
         */
        constructor();
        private onItemMouseDown(event);
        /**
         * [SkinPart]图标显示对象
         * @member egret.gui.TreeItemRenderer#iconDisplay
         */
        iconDisplay: UIAsset;
        /**
         * [SkinPart]子节点开启按钮
         * @member egret.gui.TreeItemRenderer#disclosureButton
         */
        disclosureButton: ToggleButtonBase;
        /**
         * [SkinPart]用于调整缩进值的容器对象。
         * @member egret.gui.TreeItemRenderer#contentGroup
         */
        contentGroup: DisplayObject;
        /**
         *
         * @type {number}
         * @private
         */
        private _indentation;
        /**
         * 子节点相对父节点的缩进值，以像素为单位。默认17。
         * @member egret.gui.TreeItemRenderer#indentation
         */
        indentation: number;
        /**
         *
         * @type {null}
         * @private
         */
        private _iconSkinName;
        /**
         * @member egret.gui.TreeItemRenderer#iconSkinName
         */
        iconSkinName: any;
        /**
         *
         * @type {number}
         * @private
         */
        private _depth;
        /**
         * @member egret.gui.TreeItemRenderer#depth
         */
        depth: number;
        /**
         *
         * @type {boolean}
         * @private
         */
        private _hasChildren;
        /**
         * @member egret.gui.TreeItemRenderer#hasChildren
         */
        hasChildren: boolean;
        /**
         *
         * @type {boolean}
         * @private
         */
        private _isOpen;
        /**
         * @member egret.gui.TreeItemRenderer#opened
         */
        opened: boolean;
        /**
         * 添加外观部件时调用
         * @method egret.gui.TreeItemRenderer#partAdded
         * @param partName {string}
         * @param instance {any}
         */
        partAdded(partName: string, instance: any): void;
        /**
         * 删除外观部件的实例时调用
         * @method egret.gui.TreeItemRenderer#partRemoved
         * @param partName {string}
         * @param instance {any}
         */
        partRemoved(partName: string, instance: any): void;
        /**
         * 鼠标在disclosureButton上按下
         * @method egret.gui.TreeItemRenderer#disclosureButton_mouseDownHandler
         * @param event {TouchEvent}
         */
        disclosureButton_mouseDownHandler(event: TouchEvent): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Tree
     * @classdesc
     * 树状列表组件
     * @extends egret.gui.List
     */
    class Tree extends List {
        /**
         * 构造函数
         * @method egret.gui.Tree#constructor
         */
        constructor();
        static defaultTreeRendererFactory: ClassFactory;
        /**
         * 创建该容器的子元素对象
         * @method egret.gui.Tree#createChildren
         */
        createChildren(): void;
        /**
         * 更新项呈示器，以备使用或重用
         * @method egret.gui.Tree#updateRenderer
         * @param renderer {IItemRenderer}
         * @param itemIndex {number}
         * @param data {any}
         * @returns {IItemRenderer}
         */
        updateRenderer(renderer: IItemRenderer, itemIndex: number, data: any): IItemRenderer;
        /**
         * 根据数据项返回项呈示器中图标的skinName属性值
         * @method egret.gui.Tree#itemToIcon
         * @param data {any}
         * @returns {any}
         */
        itemToIcon(data: any): any;
        /**
         * @method egret.gui.Tree#dataGroup_rendererAddHandler
         * @param event {RendererExistenceEvent}
         */
        dataGroup_rendererAddHandler(event: RendererExistenceEvent): void;
        /**
         * 节点即将打开
         */
        private onItemOpening(event);
        /**
         * @method egret.gui.Tree#dataGroup_rendererRemoveHandler
         * @param event {RendererExistenceEvent}
         */
        dataGroup_rendererRemoveHandler(event: RendererExistenceEvent): void;
        /**
         * 图标字段或函数改变标志
         */
        private iconFieldOrFunctionChanged;
        private _iconField;
        /**
         * 数据项中用来确定图标skinName属性值的字段名称。另请参考UIAsset.skinName。
         * 若设置了iconFunction，则设置此属性无效。
         * @member egret.gui.Tree#iconField
         */
        iconField: string;
        private _iconFunction;
        /**
         * 用户提供的函数，在每个数据项目上运行以确定其图标的skinName值。另请参考UIAsset.skinName。
         * 示例：iconFunction(item:Object):Object
         * @member egret.gui.Tree#iconFunction
         */
        iconFunction: Function;
        /**
         * 打开或关闭一个节点,注意，此操作不会抛出open或close事件。
         * @method egret.gui.Tree#expandItem
         * @param item {any} 要打开或关闭的节点
         * @param open {boolean} true表示打开节点，反之关闭。
         */
        expandItem(item: any, open?: boolean): void;
        /**
         * 指定的节点是否打开
         * @method egret.gui.Tree#isItemOpen
         * @param item {any}
         * @returns {boolean}
         */
        isItemOpen(item: any): boolean;
        /**
         * @method egret.gui.Tree#dataProvider_collectionChangeHandler
         * @param event {CollectionEvent}
         */
        dataProvider_collectionChangeHandler(event: CollectionEvent): void;
        /**
         * 处理对组件设置的属性
         * @method egret.gui.Tree#commitProperties
         */
        commitProperties(): void;
        /**
         * 更新指定索引项的图标
         */
        private updateRendererIconProperty(itemIndex);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.UIAsset
     * @classdesc
     * 素材和非GUI显示对象包装器。<p/>
     * @extends egret.gui.UIComponent
     * @implements egret.gui.ISkinnableClient
     */
    class UIAsset extends UIComponent {
        /**
         * @method egret.gui.UIAsset#constructor
         * @param source {any} 素材标识符
         */
        constructor(source?: any, autoScale?: boolean);
        /**
         * 矩形区域，它定义素材对象的九个缩放区域。
         * 注意:此属性仅在source的解析结果为Texture并且fileMode为BitmapFillMode.SCALE时有效。
         * @member {egret.Texture} egret.gui.UIAsset#scale9Grid
         */
        scale9Grid: Rectangle;
        /**
         * 确定位图填充尺寸的方式。默认值：BitmapFillMode.SCALE。
         * 设置为 BitmapFillMode.REPEAT时，位图将重复以填充区域。
         * 设置为 BitmapFillMode.SCALE时，位图将拉伸以填充区域。
         * 注意:此属性仅在source的解析结果为Texture时有效
         * @member {egret.Texture} egret.gui.UIAsset#fillMode
         */
        fillMode: string;
        private sourceChanged;
        _source: any;
        /**
         * 素材标识符。可以为Class,String,或DisplayObject实例等任意类型，具体规则由项目注入的素材适配器决定，
         * 适配器根据此属性值解析获取对应的显示对象，并赋值给content属性。
         * @member egret.gui.UIAsset#source
         */
        source: any;
        _content: any;
        _contentIsTexture: boolean;
        /**
         * 解析source得到的对象，通常为显示对象或Texture。
         * @member egret.gui.UIAsset#content
         */
        content: any;
        private createChildrenCalled;
        /**
         * 创建该容器的子元素对象
         */
        createChildren(): void;
        /**
         * 皮肤解析适配器
         */
        private static assetAdapter;
        private contentReused;
        /**
         * 解析source
         */
        private parseSource();
        /**
         * 获取资源适配器
         */
        private getAdapter();
        /**
         * 皮肤发生改变
         */
        private contentChanged(content, source);
        /**
         * 计算组件的默认大小和（可选）默认最小大小
         */
        measure(): void;
        /**
         * 是自动否缩放content对象，以符合UIAsset的尺寸。默认值true。
         */
        autoScale: boolean;
        /**
         * 绘制对象和/或设置其子项的大小和位置
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
        /**
         * @private
         */
        $smoothing: boolean;
        /**
         * @language en_US
         * Whether or not the bitmap is smoothed when scaled.
         * @default true。
         * @version Egret 2.4
         * @platform Web
         */
        /**
         * @language zh_CN
         * 控制在缩放时是否对位图进行平滑处理。
         * @default true。
         * @version Egret 2.4
         * @platform Web
         */
        smoothing: boolean;
        /**
         * @private
         */
        $render(context: sys.RenderContext): void;
        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void;
        /**
         * 此方法不支持
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        addChild(child: DisplayObject): DisplayObject;
        /**
         * 此方法不支持
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         */
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        /**
         * 此方法不支持
         * @deprecated
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        removeChild(child: DisplayObject): DisplayObject;
        /**
         * 此方法不支持
         * @deprecated
         * @param index {number}
         * @returns {DisplayObject}
         */
        removeChildAt(index: number): DisplayObject;
        /**
         * 此方法不支持
         * @deprecated
         * @param child {DisplayObject}
         * @param index {number}
         */
        setChildIndex(child: DisplayObject, index: number): void;
        /**
         * 此方法不支持
         * @deprecated
         * @param child1 {DisplayObject}
         * @param child2 {DisplayObject}
         */
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        /**
         * 此方法不支持
         * @deprecated
         * @param index1 {number}
         * @param index2 {number}
         */
        swapChildrenAt(index1: number, index2: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.VSlider
     * @classdesc
     * 垂直滑块控件
     * @extends egret.gui.SliderBase
     */
    class VSlider extends SliderBase {
        /**
         * 构造函数
         * @method egret.gui.VSlider#constructor
         */
        constructor();
        /**
         * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值
         * @param x {number}
         * @param y {number}
         * @returns {number}
         */
        pointToValue(x: number, y: number): number;
        /**
         * 设置外观部件（通常为滑块）的边界，这些外观部件的几何图形不是完全由外观的布局指定的
         */
        updateSkinDisplayList(): void;
    }
}
declare module egret.gui {
    /**
     * @classic
     * VScrollBar（垂直 ScrollBar）控件可以在因数据太多而不能在显示区域中以垂直方向完全显示时控制显示的数据部分
     */
    class VScrollBar extends VSlider {
        constructor();
        private _thumbLengthRatio;
        /**
         *
         * @param height
         * @param contentHeight
         * @private
         */
        _setViewportMetric(height: number, contentHeight: number): void;
        /**
         * @deprecated
         */
        trackAlpha: number;
        /**
         * @deprecated
         */
        thumbAlpha: number;
        setPosition(value: number): void;
        getPosition(): number;
        _setValue(value: number): void;
        setValue(value: number): void;
        _animationUpdateHandler(animation: Animation): void;
        /**
         * 将相对于轨道的 x,y 像素位置转换为介于最小值和最大值（包括两者）之间的一个值
         * @param x {number}
         * @param y {number}
         * @returns {number}
         */
        pointToValue(x: number, y: number): number;
        /**
         * 设置外观部件（通常为滑块）的边界，这些外观部件的几何图形不是完全由外观的布局指定的
         */
        updateSkinDisplayList(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ViewStack
     * @classdesc
     * 层级堆叠容器,一次只显示一个子对象。
     * @extends egret.gui.Group
     * @implements egret.gui.IViewStack
     * @implements egret.gui.ICollection
     */
    class ViewStack extends Group implements IViewStack, ICollection {
        /**
         * 构造函数
         * @method egret.gui.ViewStack#constructor
         */
        constructor();
        /**
         * 此容器的布局对象为只读,默认限制为BasicLayout。
         * @member egret.gui.ViewStack#layout
         */
        layout: LayoutBase;
        private _createAllChildren;
        /**
         * 是否立即初始化化所有子项。false表示当子项第一次被显示时再初始化它。默认值false。
         * @member egret.gui.ViewStack#createAllChildren
         */
        createAllChildren: boolean;
        private _selectedChild;
        /**
         * 当前选中的子项
         * @member egret.gui.ViewStack#selectedChild
         */
        selectedChild: IVisualElement;
        /**
         * 未设置缓存选中项的值
         */
        private static NO_PROPOSED_SELECTION;
        /**
         * 在属性提交前缓存选中项索引
         */
        private proposedSelectedIndex;
        _selectedIndex: number;
        /**
         * 当前选中子项的索引
         * @member egret.gui.ViewStack#selectedIndex
         */
        selectedIndex: number;
        private notifyTabBar;
        /**
         * 设置选中项索引
         * @method egret.gui.ViewStack#_setSelectedIndex
         * @param value {number}
         * @param notifyListeners {boolean}
         */
        _setSelectedIndex(value: number, notifyListeners?: boolean): void;
        /**
         * 添加一个显示元素到容器
         * @param element {IVisualElement}
         * @param index {number}
         * @param notifyListeners {boolean}
         */
        _elementAdded(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        /**
         * 从容器移除一个显示元素
         * @param element {IVisualElement}
         * @param index {number}
         * @param notifyListeners {boolean}
         */
        _elementRemoved(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        /**
         * 子项显示列表顺序发生改变。
         */
        private childOrderingChanged;
        /**
         * 处理对组件设置的属性
         */
        commitProperties(): void;
        /**
         *
         * @param newIndex
         */
        private commitSelection(newIndex);
        /**
         * 子项数量
         * @member egret.gui.ViewStack#length
         */
        length: number;
        /**
         * @param index {number}
         * @returns {any}
         */
        getItemAt(index: number): any;
        /**
         * @param item {any}
         * @returns {number}
         */
        getItemIndex(item: any): number;
        /**
         * 抛出事件
         */
        private dispatchCoEvent(kind?, location?, oldLocation?, items?, oldItems?);
    }
}
declare module egret.gui {
    /**
     * @private
     */
    function $addTimer(listener: Function, thisObject: any, delay: number, ...args: any[]): number;
    /**
     * @private
     */
    function $clearTimer(key: number): void;
}
declare module egret.gui {
    /**
     * @private
     */
    class ScrollerEase {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor();
        /**
         *
         * @param amount
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static get(amount: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quintOut: Function;
        /**
         *
         * @param pow
         * @returns
         * @version Egret 2.4
         * @platform Web,Native
         */
        static getPowOut(pow: any): Function;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        static quartOut: Function;
    }
    /**
     * @private
     */
    class ScrollerTween extends EventDispatcher {
        /**
         * @private
         */
        private static _tweens;
        /**
         * @private
         */
        private static IGNORE;
        /**
         * @private
         */
        private static _plugins;
        /**
         * @private
         */
        private static _inited;
        /**
         * @private
         */
        private _target;
        /**
         * @private
         */
        private _useTicks;
        /**
         * @private
         */
        private ignoreGlobalPause;
        /**
         * @private
         */
        private loop;
        /**
         * @private
         */
        private pluginData;
        /**
         * @private
         */
        private _curQueueProps;
        /**
         * @private
         */
        private _initQueueProps;
        /**
         * @private
         */
        private _steps;
        /**
         * @private
         */
        private _actions;
        /**
         * @private
         */
        private paused;
        /**
         * @private
         */
        private duration;
        /**
         * @private
         */
        private _prevPos;
        /**
         * @private
         */
        private position;
        /**
         * @private
         */
        private _prevPosition;
        /**
         * @private
         */
        private _stepPosition;
        /**
         * @private
         */
        private passive;
        /**
         * @language en_US
         * Activate an object and add a ScrollerTween animation to the object
         * @param target {any} The object to be activated
         * @param props {any} Parameters, support loop onChange onChangeObj
         * @param pluginData {any} Write realized
         * @param override {boolean} Whether to remove the object before adding a tween, the default value false
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 激活一个对象，对其添加 ScrollerTween 动画
         * @param target {any} 要激活 ScrollerTween 的对象
         * @param props {any} 参数，支持loop(循环播放) onChange(变化函数) onChangeObj(变化函数作用域)
         * @param pluginData {any} 暂未实现
         * @param override {boolean} 是否移除对象之前添加的tween，默认值false
         * @version Egret 2.4
         * @platform Web,Native
         */
        static get(target: any, props?: any, pluginData?: any, override?: boolean): ScrollerTween;
        /**
         * @language en_US
         * Delete all ScrollerTween animations from an object
         * @param target The object whose ScrollerTween to be deleted
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 删除一个对象上的全部 ScrollerTween 动画
         * @param target  需要移除 ScrollerTween 的对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        static removeTweens(target: any): void;
        /**
         * @private
         *
         * @param delta
         * @param paused
         */
        private static tick(timeStamp, paused?);
        private static _lastTime;
        /**
         * @private
         *
         * @param tween
         * @param value
         */
        private static _register(tween, value);
        /**
         * 创建一个 egret.ScrollerTween 对象
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor(target: any, props: any, pluginData: any);
        /**
         * @private
         *
         * @param target
         * @param props
         * @param pluginData
         */
        private initialize(target, props, pluginData);
        /**
         * @private
         *
         * @param value
         * @param actionsMode
         * @returns
         */
        private setPosition(value);
        /**
         * @private
         *
         * @param startPos
         * @param endPos
         * @param includeStart
         */
        private _runActions(startPos, endPos, includeStart?);
        /**
         * @private
         *
         * @param step
         * @param ratio
         */
        private _updateTargetProps(step, ratio);
        /**
         * @language en_US
         * Whether setting is paused
         * @param value {boolean} Whether to pause
         * @returns ScrollerTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置是否暂停
         * @param value {boolean} 是否暂停
         * @returns Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        setPaused(value: boolean): ScrollerTween;
        /**
         * @private
         *
         * @param props
         * @returns
         */
        private _cloneProps(props);
        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _addStep(o);
        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _appendQueueProps(o);
        /**
         * @private
         *
         * @param o
         * @returns
         */
        private _addAction(o);
        /**
         * @language en_US
         * Modify the property of the specified display object to a specified value
         * @param props {Object} Property set of an object
         * @param duration {number} Duration
         * @param ease {egret.ScrollerEase} Easing algorithm
         * @returns {egret.ScrollerTween} ScrollerTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将指定显示对象的属性修改为指定值
         * @param props {Object} 对象的属性集合
         * @param duration {number} 持续时间
         * @param ease {egret.ScrollerEase} 缓动算法
         * @returns {egret.ScrollerTween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        to(props: any, duration?: number, ease?: Function): ScrollerTween;
        /**
         * @language en_US
         * Execute callback function
         * @param callback {Function} Callback method
         * @param thisObj {any} this action scope of the callback method
         * @param params {Array<any>} Parameter of the callback method
         * @returns {egret.ScrollerTween} ScrollerTween object itself
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 执行回调函数
         * @param callback {Function} 回调方法
         * @param thisObj {any} 回调方法this作用域
         * @param params {Array<any>} 回调方法参数
         * @returns {egret.ScrollerTween} Tween对象本身
         * @version Egret 2.4
         * @platform Web,Native
         */
        call(callback: Function, thisObj?: any, params?: Array<any>): ScrollerTween;
        /**
         * @method egret.ScrollerTween#tick
         * @param delta {number}
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        tick(delta: number): void;
    }
}
declare module egret.gui {
    /**
     * @private
     */
    class ScrollerViewProperties {
        /**
         * @private
         */
        _verticalScrollPolicy: string;
        /**
         * @private
         */
        _horizontalScrollPolicy: string;
        /**
         * @private
         */
        _scrollLeft: number;
        /**
         * @private
         */
        _scrollTop: number;
        /**
         * @private
         */
        _hCanScroll: boolean;
        /**
         * @private
         */
        _vCanScroll: boolean;
        /**
         * @private
         */
        _lastTouchPosition: egret.Point;
        /**
         * @private
         */
        _touchStartPosition: egret.Point;
        /**
         * @private
         */
        _scrollStarted: boolean;
        /**
         * @private
         */
        _lastTouchTime: number;
        /**
         * @private
         */
        _lastTouchEvent: TouchEvent;
        /**
         * @private
         */
        _velocitys: Array<{
            x: number;
            y: number;
        }>;
        /**
         * @private
         */
        _isHTweenPlaying: boolean;
        /**
         * @private
         */
        _isVTweenPlaying: boolean;
        /**
         * @private
         */
        _hScrollTween: ScrollerTween;
        /**
         * @private
         */
        _vScrollTween: ScrollerTween;
        /**
         * @private
         */
        _bounces: boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.DefaultAssetAdapter
     * @classdesc
     * 默认的IAssetAdapter接口实现
     * @implements egret.gui.IAssetAdapter
     */
    class DefaultAssetAdapter implements IAssetAdapter {
        /**
         * 构造函数
         * @method egret.gui.DefaultSkinAdapter#constructor
         */
        constructor();
        /**
         * 解析素材
         * @param source {any} 待解析的新素材标识符
         * @param compFunc {Function} 解析完成回调函数，示例：compFunc(content:any,source:any):void;
         * 回调参数content接受两种类型：DisplayObject或Texture。
         * @param thisObject {any} compFunc的this引用
         * @param oldContent any 旧的内容对象,传入值有可能为null。
         * 对于某些类型素材，例如MovieClip，可以重用传入的显示对象,只修改其数据再返回。
         */
        getAsset(source: any, compFunc: Function, thisObject: any, oldContent: any): void;
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.DefaultSkinAdapter
     * @classdesc
     * 默认的ISkinAdapter接口实现
     * @implements egret.gui.ISkinAdapter
     */
    class DefaultSkinAdapter implements ISkinAdapter {
        /**
         * 构造函数
         * @method egret.gui.DefaultSkinAdapter#constructor
         */
        constructor();
        /**
         * 获取皮肤显示对象
         * @method egret.gui.ISkinAdapter#getSkin
         * @param skinName {any} 待解析的皮肤标识符
         * @param hostComponentKey {string} 主机组件标识符
         * @returns {any} 皮肤对象实例
         */
        getSkin(skinName: any, hostComponentKey: string): any;
    }
}
declare module egret.gui {
    /**
     * @classdesc
     * 默认的IThemeAdapter接口实现
     * @implements egret.gui.IThemeAdapter
     */
    class DefaultThemeAdapter implements IThemeAdapter {
        /**
         * 构造函数
         */
        constructor();
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.DropDownController
     * @classdesc
     * 用于处理因用户交互而打开和关闭下拉列表的操作的控制器
     * @extends egret.EventDispatcher
     */
    class DropDownController extends EventDispatcher {
        /**
         * 构造函数
         * @method egret.gui.DropDownController#constructor
         */
        constructor();
        /**
         * 鼠标按下标志
         */
        private mouseIsDown;
        private _openButton;
        /**
         * 下拉按钮实例
         * @member egret.gui.DropDownController#openButton
         */
        openButton: ButtonBase;
        /**
         * 要考虑作为下拉列表的点击区域的一部分的显示对象列表。
         * 在包含项列出的任何组件内进行鼠标单击不会自动关闭下拉列表。
         * @member egret.gui.DropDownController#hitAreaAdditions
         */
        hitAreaAdditions: Array<DisplayObject>;
        private _dropDown;
        /**
         * 下拉区域显示对象
         * @member egret.gui.DropDownController#dropDown
         */
        dropDown: DisplayObject;
        private _isOpen;
        /**
         * 下拉列表已经打开的标志
         * @member egret.gui.DropDownController#isOpen
         */
        isOpen: boolean;
        private _closeOnResize;
        /**
         * 如果为 true，则在调整舞台大小时会关闭下拉列表。
         * @member egret.gui.DropDownController#closeOnResize
         */
        closeOnResize: boolean;
        private _rollOverOpenDelay;
        private rollOverOpenDelayTimer;
        /**
         * 指定滑过锚点按钮时打开下拉列表要等待的延迟（以毫秒为单位）。
         * 如果设置为 NaN，则下拉列表会在单击时打开，而不是在滑过时打开。默认值NaN
         * @member egret.gui.DropDownController#rollOverOpenDelay
         */
        rollOverOpenDelay: number;
        /**
         * 添加触发下拉列表打开的事件监听
         */
        private addOpenTriggers();
        /**
         * 移除触发下拉列表打开的事件监听
         */
        private removeOpenTriggers();
        /**
         * 添加触发下拉列表关闭的事件监听
         */
        private addCloseTriggers();
        /**
         * 移除触发下拉列表关闭的事件监听
         */
        private removeCloseTriggers();
        /**
         * 添加舞台尺寸改变的事件监听
         */
        private addCloseOnResizeTrigger();
        /**
         * 移除舞台尺寸改变的事件监听
         */
        private removeCloseOnResizeTrigger();
        /**
         * 检查鼠标是否在DropDown或者openButton区域内。
         */
        private isTargetOverDropDownOrOpenButton(target);
        /**
         * 打开下拉列表
         * @method egret.gui.DropDownController#openDropDown
         */
        openDropDown(): void;
        /**
         * 执行打开下拉列表
         */
        private openDropDownHelper();
        /**
         * 关闭下拉列表
         * @method egret.gui.DropDownController#closeDropDown
         * @param commit {boolean}
         */
        closeDropDown(commit: boolean): void;
        /**
         * openButton上按下鼠标事件
         * @method egret.gui.DropDownController#_openButton_buttonDownHandler
         * @param event {Event}
         */
        _openButton_buttonDownHandler(event: Event): void;
        /**
         * openButton上鼠标经过事件
         * @method egret.gui.DropDownController#_openButton_rollOverHandler
         * @param event {TouchEvent}
         */
        _openButton_rollOverHandler(event: TouchEvent): void;
        /**
         * openButton上鼠标移出事件
         */
        private openButton_rollOutHandler(event);
        /**
         * 到达鼠标移入等待延迟打开的时间。
         */
        private rollOverDelay_timerCompleteHandler(event);
        /**
         * 舞台上鼠标按下事件
         * @method egret.gui.DropDownController#stage_mouseDownHandler
         * @param event {Event}
         */
        stage_mouseDownHandler(event: Event): void;
        /**
         * 舞台上鼠标移动事件
         * @method egret.gui.DropDownController#stage_mouseMoveHandler
         * @param event {Event}
         */
        stage_mouseMoveHandler(event: Event): void;
        /**
         * 舞台上鼠标弹起事件
         * @method egret.gui.DropDownController#stage_mouseUpHandler_noRollOverOpenDelay
         * @param event {Event}
         */
        stage_mouseUpHandler_noRollOverOpenDelay(event: Event): void;
        /**
         * 舞台上鼠标弹起事件
         * @method egret.gui.DropDownController#stage_mouseUpHandler
         * @param event {Event}
         */
        stage_mouseUpHandler(event: Event): void;
        /**
         * 舞台尺寸改变事件
         * @method egret.gui.DropDownController#stage_resizeHandler
         * @param event {Event}
         */
        stage_resizeHandler(event: Event): void;
        /**
         * 舞台上鼠标滚轮事件
         */
        private stage_mouseWheelHandler(event);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.SkinBasicLayout
     * @classdesc
     * 皮肤简单布局类。
     * @extends egret.HashObject
     */
    class SkinBasicLayout extends HashObject {
        /**
         * 构造函数
         * @method egret.gui.SkinBasicLayout#constructor
         */
        constructor();
        private _target;
        /**
         * 目标布局对象
         * @member egret.gui.SkinBasicLayout#target
         */
        target: Skin;
        /**
         * 测量组件尺寸大小
         * @method egret.gui.SkinBasicLayout#measure
         */
        measure(): void;
        /**
         * 更新显示列表
         * @method egret.gui.SkinBasicLayout#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module egret.gui {
    class Theme {
        /**
         * 构造函数
         * @method egret.gui.PopUpManager#constructor
         */
        constructor(configURL: string);
        private static initialized;
        static load(configURL: string): void;
        private _configURL;
        private loadConfig(configURL);
        private onLoadComplete(text);
        private onLoadError(event);
        private skinMap;
        private delyList;
        private handleDelyList();
        getDefaultSkin(client: SkinnableComponent): any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IAssetAdapter
     * @interface
     * @classdesc
     * 素材适配器接口。
     * 若项目需要自定义UIAsset.source的解析规则，需要实现这个接口，
     */
    interface IAssetAdapter {
        /**
         * 解析素材
         * @param source {any} 待解析的新素材标识符
         * @param compFunc {Function} 解析完成回调函数，示例：compFunc(content:any,source:any):void;
         * 回调参数content接受两种类型：DisplayObject或Texture。
         * @param thisObject {any} compFunc的this引用
         * @param oldContent any 旧的内容对象,传入值有可能为null。
         * 对于某些类型素材，例如MovieClip，可以重用传入的显示对象,只修改其数据再返回。
         */
        getAsset(source: any, compFunc: (content: any, source: any) => void, thisObject: any, oldContent: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IContainer
     * @interface
     * @classdesc
     * 容器接口
     */
    interface IContainer {
        /**
         * 此容器中的可视元素的数量。
         * 可视元素包括实现 IVisualElement 接口的类，
         * @member egret.gui.IContainer#numElements
         */
        numElements: number;
        /**
         * 返回指定索引处的可视元素。
         * @method egret.gui.IContainer#getElementAt
         * @param index {number} 要检索的元素的索引。
         * @returns {IVisualElement}
         */
        getElementAt(index: number): IVisualElement;
        /**
         * 将可视元素添加到此容器中。
         * 如果添加的可视元素已有一个不同的容器作为父项，则该元素将会从其他容器中删除。
         * @method egret.gui.IContainer#addElement
         * @param element {IVisualElement} 要添加为此容器的子项的可视元素。
         * @returns {IVisualElement}
         */
        addElement(element: IVisualElement): IVisualElement;
        /**
         * 将可视元素添加到此容器中。该元素将被添加到指定的索引位置。索引 0 代表显示列表中的第一个元素。
         * 如果添加的可视元素已有一个不同的容器作为父项，则该元素将会从其他容器中删除。
         * @method egret.gui.IContainer#addElementAt
         * @param element {IVisualElement} 要添加为此可视容器的子项的元素。
         * @param index {number} 将该元素添加到的索引位置。如果指定当前占用的索引位置，则该位置以及所有更高位置上的子对象会在子级列表中上移一个位置。
         * @returns {IVisualElement}
         */
        addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
         * 从此容器的子列表中删除指定的可视元素。
         * 在该可视容器中，位于该元素之上的所有元素的索引位置都减少 1。
         * @method egret.gui.IContainer#removeElement
         * @param element {IVisualElement} 要从容器中删除的元素。
         * @returns {IVisualElement}
         */
        removeElement(element: IVisualElement): IVisualElement;
        /**
         * 从容器中的指定索引位置删除可视元素。
         * 在该可视容器中，位于该元素之上的所有元素的索引位置都减少 1。
         * @method egret.gui.IContainer#removeElementAt
         * @param index {number} 要删除的元素的索引。
         * @returns {IVisualElement}
         */
        removeElementAt(index: number): IVisualElement;
        /**
         * 返回可视元素的索引位置。若不存在，则返回-1。
         * @method egret.gui.IContainer#getElementIndex
         * @param element {IVisualElement} 可视元素。
         * @returns {number}
         */
        getElementIndex(element: IVisualElement): number;
        /**
         * 在可视容器中更改现有可视元素的位置。
         * @method egret.gui.IContainer#setElementIndex
         * @param element {IVisualElement} 要为其更改索引编号的元素。
         * @param index {number} 元素的最终索引编号。
         */
        setElementIndex(element: IVisualElement, index: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IDisplayText
     * @interface
     * @classdesc
     * 简单文本显示控件接口。
     * @extends egret.gui.IUIComponent
     */
    interface IDisplayText extends IUIComponent {
        /**
         * 此文本组件所显示的文本。
         * @member egret.gui.IDisplayText#text
         */
        text: string;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IEditableText
     * @interface
     * @classdesc
     * 可编辑文本控件接口
     * @extends egret.gui.IDisplayText
     */
    interface IEditableText extends IDisplayText {
        /**
         * 文本颜色。
         * @member egret.gui.IEditableText#textColor
         */
        textColor: number;
        /**
         * 指定文本字段是否是密码文本字段。如果此属性的值为 true，则文本字段被视为密码文本字段，
         * 并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
         * 启用密码模式时，“剪切”和“复制”命令及其对应的键盘快捷键将不起作用。
         * 此安全机制可防止不良用户使用快捷键在无人看管的计算机上破译密码。
         * @member egret.gui.IEditableText#displayAsPassword
         */
        displayAsPassword: boolean;
        /**
         * 文本是否可编辑的标志。
         * @member egret.gui.IEditableText#editable
         */
        editable: boolean;
        /**
         * 文本字段中最多可包含的字符数（即用户输入的字符数）。
         * 脚本可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可以输入多少文本。
         * 如果此属性的值为 0，则用户可以输入无限数量的文本。
         * @member egret.gui.IEditableText#maxChars
         */
        maxChars: number;
        /**
         * 表示字段是否为多行文本字段。如果值为 true，则文本字段为多行文本字段；
         * 如果值为 false，则文本字段为单行文本字段。在类型为 TextFieldType.INPUT 的字段中，
         * multiline 值将确定 Enter 键是否创建新行（如果值为 false，则将忽略 Enter 键）。
         * 如果将文本粘贴到其 multiline 值为 false 的 TextField 中，则文本中将除去新行。
         * @member egret.gui.IEditableText#multiline
         */
        multiline: boolean;
        /**
         * 表示用户可输入到文本字段中的字符集。如果 restrict 属性的值为 null，则可以输入任何字符。
         * 如果 restrict 属性的值为空字符串，则不能输入任何字符。如果 restrict 属性的值为一串字符，
         * 则只能在文本字段中输入该字符串中的字符。从左向右扫描该字符串。可以使用连字符 (-) 指定一个范围。
         * 只限制用户交互；脚本可将任何文本放入文本字段中。此属性不与属性检查器中的“嵌入字体”选项同步。 <p/>
         * 如果字符串以尖号 (ˆ) 开头，则先接受所有字符，然后从接受字符集中排除字符串中 ˆ 之后的字符。
         * 如果字符串不以尖号 (ˆ) 开头，则最初不接受任何字符，然后将字符串中的字符包括在接受字符集中。
         * @member egret.gui.IEditableText#restrict
         */
        restrict: string;
        /**
         * 一个布尔值，表示文本字段是否可选。值 true 表示文本可选。selectable 属性控制文本字段是否可选，
         * 而不控制文本字段是否可编辑。动态文本字段即使不可编辑，它也可能是可选的。
         * 如果动态文本字段是不可选的，则用户不能选择其中的文本。 <p/>
         * 如果 selectable 设置为 false，则文本字段中的文本不响应来自鼠标或键盘的选择命令，
         * 并且不能使用“复制”命令复制文本。如果 selectable 设置为 true，则可以使用鼠标或键盘选择文本字段中的文本，
         * 并且可以使用“复制”命令复制文本。即使文本字段是动态文本字段而不是输入文本字段，您也可以用这种方式选择文本。
         * @member egret.gui.IEditableText#selectable
         */
        selectable: boolean;
        /**
         * 当前所选内容中第一个字符从零开始的字符索引值。例如，第一个字符的索引值是 0，第二个字符的索引值是 1，
         * 依此类推。如果未选定任何文本，此属性为 caretIndex 的值。
         * @member egret.gui.IEditableText#selectionBeginIndex
         */
        selectionBeginIndex: number;
        /**
         * 当前所选内容中最后一个字符从零开始的字符索引值。例如，第一个字符的索引值是 0，第二个字符的索引值是 1，
         * 依此类推。如果未选定任何文本，此属性为 caretIndex 的值。
         * @member egret.gui.IEditableText#selectionEndIndex
         */
        selectionEndIndex: number;
        /**
         * 插入点（尖号）位置的索引。如果没有显示任何插入点，则在将焦点恢复到字段时，
         * 值将为插入点所在的位置（通常为插入点上次所在的位置，如果字段不曾具有焦点，则为 0）。<p/>
         * 选择范围索引是从零开始的（例如，第一个位置为 0、第二个位置为 1，依此类推）。
         * @member egret.gui.IEditableText#caretIndex
         */
        caretIndex: number;
        /**
         * 将第一个字符和最后一个字符的索引值（使用 beginIndex 和 endIndex 参数指定）指定的文本设置为所选内容。
         * 如果两个参数值相同，则此方法会设置插入点，就如同设置 caretIndex 属性一样。
         * @method egret.gui.IEditableText#setSelection
         * @param beginIndex {number} 所选内容中第一个字符从零开始的索引值（例如，第一个字符的索引值是 0，第二个字符的索引值是 1，依此类推）。
         * @param endIndex {number} 所选内容中最后一个字符从零开始的索引值。
         */
        setSelection(beginIndex: number, endIndex: number): void;
        /**
         * 选中所有文本。
         * @method egret.gui.IEditableText#selectAll
         */
        selectAll(): void;
        /**
         * 控件的默认宽度（使用字号：size为单位测量）。 若同时设置了maxChars属性，将会根据两者测量结果的最小值作为测量宽度。
         * @member egret.gui.IEditableText#widthInChars
         */
        widthInChars: number;
        /**
         * 控件的默认高度（以行为单位测量）。 若设置了multiline属性为false，则忽略此属性。
         * @member egret.gui.IEditableText#heightInLines
         */
        heightInLines: number;
        setFocus(): void;
    }
}
declare module egret.gui {
    /**
     * @classdesc
     * IFactory 接口定义工厂类（如 ClassFactory）必须实现的接口。
     * IFactory 类型的对象是“工厂对象”，Egret使用它来生成另一类的多个实例（每个实例具有相同的属性）。
     * @interface
     * @class egret.gui.IFactory
     * @extends egret.IHashObject
     */
    interface IFactory {
        /**
         * 创建某一类（由实现 IFactory 的类确定）的实例。
         * @method egret.gui.IFactory#newInstance
         * @returns {any}
         */
        newInstance(): any;
        hashCode: number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IInvalidateDisplay
     * @interface
     * @classdesc
     * 具有延迟应用属性功能的显示对象接口
     */
    interface IInvalidateDisplay {
        /**
         * 立即应用所有标记为延迟验证的属性
         * @method egret.gui.IInvalidateDisplay#validateNow
         */
        validateNow(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IInvalidating
     * @interface
     * @classdesc
     * 拥有失效验证机制组件接口
     */
    interface IInvalidating {
        /**
         * 标记提交过需要延迟应用的属性
         * @method egret.gui.IInvalidating#invalidateProperties
         */
        invalidateProperties(): void;
        /**
         * 标记提交过需要验证组件尺寸
         * @method egret.gui.IInvalidating#invalidateSize
         */
        invalidateSize(): void;
        /**
         * 标记需要验证显示列表
         * @method egret.gui.IInvalidating#invalidateDisplayList
         */
        invalidateDisplayList(): void;
        /**
         * 立即应用组件及其子项的所有属性
         * @method egret.gui.IInvalidating#validateNow
         * @param skipDisplayList? {boolean} 是否跳过显示列表验证阶段,默认false
         */
        validateNow(skipDisplayList?: boolean): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ILayoutElement
     * @interface
     * @classdesc
     * 可布局元素接口
     * @extends egret.IEventDispatcher
     */
    interface ILayoutElement extends IEventDispatcher {
        /**
         * 指定此组件是否包含在父容器的布局中。若为false，则父级容器在测量和布局阶段都忽略此组件。默认值为true。
         * 注意，visible属性与此属性不同，设置visible为false，父级容器仍会对其布局。
         * @member egret.gui.ILayoutElement#includeInLayout
         */
        includeInLayout: boolean;
        /**
         * 距父级容器离左边距离
         * @member egret.gui.ILayoutElement#left
         */
        left: number;
        /**
         * 距父级容器右边距离
         * @member egret.gui.ILayoutElement#right
         */
        right: number;
        /**
         * 距父级容器顶部距离
         * @member egret.gui.ILayoutElement#top
         */
        top: number;
        /**
         * 距父级容器底部距离
         * @member egret.gui.ILayoutElement#bottom
         */
        bottom: number;
        /**
         * 在父级容器中距水平中心位置的距离
         * @member egret.gui.ILayoutElement#horizontalCenter
         */
        horizontalCenter: number;
        /**
         * 在父级容器中距竖直中心位置的距离
         * @member egret.gui.ILayoutElement#verticalCenter
         */
        verticalCenter: number;
        /**
         * 相对父级容器宽度的百分比
         * @member egret.gui.ILayoutElement#percentWidth
         */
        percentWidth: number;
        /**
         * 相对父级容器高度的百分比
         * @member egret.gui.ILayoutElement#percentHeight
         */
        percentHeight: number;
        /**
         * 组件的首选x坐标,常用于父级的measure()方法中
         * @member egret.gui.ILayoutElement#preferredX
         */
        preferredX: number;
        /**
         * 组件的首选y坐标,常用于父级的measure()方法中
         * @member egret.gui.ILayoutElement#preferredY
         */
        preferredY: number;
        /**
         * 组件水平方向起始坐标
         * @member egret.gui.ILayoutElement#layoutBoundsX
         */
        layoutBoundsX: number;
        /**
         * 组件竖直方向起始坐标
         * @member egret.gui.ILayoutElement#layoutBoundsY
         */
        layoutBoundsY: number;
        /**
         * 组件的首选宽度,常用于父级的measure()方法中
         * 按照：外部显式设置宽度>测量宽度 的优先级顺序返回宽度
         * 注意:此数值已经包含了scaleX的值
         * @member egret.gui.ILayoutElement#preferredWidth
         */
        preferredWidth: number;
        /**
         * 组件的首选高度,常用于父级的measure()方法中
         * 按照：外部显式设置高度>测量高度 的优先级顺序返回高度
         * 注意:此数值已经包含了scaleY的值
         * @member egret.gui.ILayoutElement#preferredHeight
         */
        preferredHeight: number;
        /**
         * 组件的布局宽度,常用于父级的updateDisplayList()方法中
         * 按照：布局宽度>外部显式设置宽度>测量宽度 的优先级顺序返回宽度
         * 注意:此数值已经包含了scaleX的值
         * @member egret.gui.ILayoutElement#layoutBoundsWidth
         */
        layoutBoundsWidth: number;
        /**
         * 组件的布局高度,常用于父级的updateDisplayList()方法中
         * 按照：布局高度>外部显式设置高度>测量高度 的优先级顺序返回高度
         * 注意:此数值已经包含了scaleY的值
         * @member egret.gui.ILayoutElement#layoutBoundsHeight
         */
        layoutBoundsHeight: number;
        /**
         * 表示从注册点开始应用的对象的水平缩放比例（百分比）。默认注册点为 (0,0)。1.0 等于 100% 缩放。
         * @member egret.gui.ILayoutElement#scaleX
         */
        scaleX: number;
        /**
         * 表示从对象注册点开始应用的对象的垂直缩放比例（百分比）。默认注册点为 (0,0)。1.0 是 100% 缩放。
         * @member egret.gui.ILayoutElement#scaleY
         */
        scaleY: number;
        /**
         * 组件的最大测量宽度,仅影响measuredWidth属性的取值范围。
         * @member egret.gui.ILayoutElement#maxWidth
         */
        maxWidth: number;
        /**
         * 组件的最小测量宽度,此属性设置为大于maxWidth的值时无效。仅影响measuredWidth属性的取值范围。
         * @member egret.gui.ILayoutElement#minWidth
         */
        minWidth: number;
        /**
         * 组件的最大测量高度,仅影响measuredHeight属性的取值范围。
         * @member egret.gui.ILayoutElement#maxHeight
         */
        maxHeight: number;
        /**
         * 组件的最小测量高度,此属性设置为大于maxHeight的值时无效。仅影响measuredHeight属性的取值范围。
         * @member egret.gui.ILayoutElement#minHeight
         */
        minHeight: number;
        /**
         * 设置组件的布局宽高,此值应已包含scaleX,scaleY的值
         * @method egret.gui.ILayoutElement#setLayoutBoundsSize
         * @param width {number}
         * @param height {number}
         */
        setLayoutBoundsSize(width: number, height: number): void;
        /**
         * 设置组件的布局位置
         * @method egret.gui.ILayoutElement#setLayoutBoundsPosition
         * @param x {number}
         * @param y {number}
         */
        setLayoutBoundsPosition(x: number, y: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ISkin
     * @interface
     * @classdesc
     * 皮肤对象接口。只有实现此接口的皮肤会被匹配公开同名变量,并注入到主机组件上。
     */
    interface ISkin {
        /**
         * 主机组件引用,仅当皮肤被应用后才会对此属性赋值
         * @member egret.gui.ISkin#hostComponent
         */
        hostComponent: SkinnableComponent;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ISkinAdapter
     * @interface
     * @classdesc
     * 皮肤适配器接口。
     * 若项目需要自定义可设置外观组件的skinName属性的解析规则，需要实现这个接口，
     */
    interface ISkinAdapter {
        /**
         * 获取皮肤显示对象
         * @method egret.gui.ISkinAdapter#getSkin
         * @param skinName {any} 待解析的皮肤标识符
         * @param hostComponentKey {string} 主机组件标识符
         * @returns {any} 皮肤对象实例
         */
        getSkin(skinName: any, hostComponentKey: string): any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ISkinnableClient
     * @interface
     * @classdesc
     * 可设置外观的组件接口
     * @extends egret.gui.IVisualElement
     */
    interface ISkinnableClient extends IVisualElement {
        /**
         * 皮肤标识符。可以为Class,String,或DisplayObject实例等任意类型。
         * 具体规则由项目注入的ISkinAdapter决定，皮肤适配器将在运行时解析此标识符，然后返回皮肤对象给组件。
         * @member egret.gui.ISkinnableClient#skinName
         */
        skinName: any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IStateClient
     * @interface
     * @classdesc
     * 具有视图状态的组件接口
     * @extends egret.IEventDispatcher
     */
    interface IStateClient extends IEventDispatcher {
        /**
         * 组件的当前视图状态。将其设置为 "" 或 null 可将组件重置回其基本状态。
         * @member egret.gui.IStateClient#currentState
         */
        currentState: string;
        /**
         * 为此组件定义的视图状态。
         * @member egret.gui.IStateClient#states
         */
        states: Array<any>;
        /**
         * 返回是否含有指定名称的视图状态
         * @method egret.gui.IStateClient#hasState
         * @param stateName {string} 要检测的视图状态名称
         * @returns {boolean}
         */
        hasState(stateName: string): boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IStyleClient
     * @interface
     * @classdesc
     * 能够设置样式的组件接口
     */
    interface IStyleClient {
        /**
         * 获取指定的名称的样式属性值
         * @param styleProp 样式名称
         */
        getStyle(styleProp: String): any;
        /**
         * 对此组件实例设置样式属性。在此组件上设置的样式会覆盖父级容器的同名样式。
         * @param styleProp 样式名称
         * @param newValue 样式值
         */
        setStyle(styleProp: String, newValue: any): void;
        /**
         * 清除在此组件实例上设置过的指定样式名。
         * @param styleProp 样式名称
         */
        clearStyle(styleProp: string): void;
        /**
         * 组件上的样式发生改变
         * @param styleProp 发生改变的样式名称，若为null表示所有样式都发生了改变。
         */
        styleChanged(styleProp: string): void;
        /**
         * 通知项列表样式发生改变
         * @param styleProp 样式名称
         */
        notifyStyleChangeInChildren(styleProp: string): void;
        /**
         * 重新生成自身以及所有子项的原型链
         * @param parentChain
         */
        regenerateStyleCache(parentChain: any): void;
    }
}
declare module egret.gui {
    /**
     * @interface
     * @classdesc
     * 主题适配器接口。
     */
    interface IThemeAdapter {
        /**
         * 解析主题
         * @param url 待解析的主题url
         * @param compFunc 解析完成回调函数，示例：compFunc(e:egret.Event):void;
         * @param errorFunc 解析失败回调函数，示例：errorFunc():void;
         * @param thisObject 回调的this引用
         */
        getTheme(url: string, compFunc: Function, errorFunc: Function, thisObject: any): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IUIComponent
     * @interface
     * @classdesc
     * UI组件接口
     * @extends egret.gui.IVisualElement
     */
    interface IUIComponent extends IVisualElement {
        /**
         * 组件是否可以接受用户交互。
         * @member egret.gui.IUIComponent#enabled
         */
        enabled: boolean;
        /**
         * PopUpManager将其设置为true,以指示已弹出该组件。
         * @member egret.gui.IUIComponent#isPopUp
         */
        isPopUp: boolean;
        /**
         * 外部显式指定的高度
         * @member egret.gui.IUIComponent#explicitHeight
         */
        /**
         * 外部显式指定的宽度
         * @member egret.gui.IUIComponent#explicitWidth
         */
        /**
         * 设置组件的宽高，w,h均不包含scale值。此方法不同于直接设置width,height属性，
         * 不会影响显式标记尺寸属性widthExplicitlySet,_heightExplicitlySet
         * @method egret.gui.IUIComponent#setActualSize
         * @param newWidth {number}
         * @param newHeight {number}
         */
        setActualSize(newWidth: number, newHeight: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IUIStage
     * @interface
     * @classdesc
     * @extends egret.IEventDispatcher
     */
    interface IUIStage extends IEventDispatcher {
        /**
         * 弹出窗口层容器。
         * @member egret.gui.IUIStage#popUpContainer
         */
        popUpContainer: IContainer;
        /**
         * 工具提示层容器。
         * @member egret.gui.IUIStage#toolTipContainer
         */
        toolTipContainer: IContainer;
        /**
         * 鼠标样式层容器。
         * @member egret.gui.IUIStage#cursorContainer
         */
        cursorContainer: IContainer;
        /**
         * 舞台引用
         * @member egret.gui.IUIStage#stage
         */
        stage: Stage;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IViewStack
     * @interface
     * @classdesc
     * 层级堆叠容器接口
     */
    interface IViewStack {
        /**
         * 当前可见子元素的索引。索引从0开始。
         * @member egret.gui.IViewStack#selectedIndex
         */
        selectedIndex: number;
        /**
         * 当前可见的子元素。
         * @member egret.gui.IViewStack#selectedChild
         */
        selectedChild: IVisualElement;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IViewport
     * @interface
     * @classdesc
     * 支持视区的组件接口
     * @extends egret.gui.IVisualElement
     */
    interface IViewport extends IVisualElement {
        /**
         * 视域的内容的宽度。
         * 如果 clipAndEnabledScrolling 为 true， 则视域的 contentWidth 为水平滚动定义限制，
         * 且视域的实际宽度定义可见的内容量。要在内容中水平滚动， 请在 0 和 contentWidth - width
         * 之间更改 horizontalScrollPosition。
         * @member egret.gui.IViewport#contentWidth
         */
        contentWidth: number;
        /**
         * 视域的内容的高度。
         * 如果 clipAndEnabledScrolling 为 true，则视域的 contentHeight 为垂直滚动定义限制，
         * 且视域的实际高度定义可见的内容量。要在内容中垂直滚动，请在 0 和 contentHeight - height
         * 之间更改 verticalScrollPosition。
         * @member egret.gui.IViewport#contentHeight
         */
        contentHeight: number;
        /**
         * 可视区域水平方向起始点
         * @member egret.gui.IViewport#horizontalScrollPosition
         */
        horizontalScrollPosition: number;
        /**
         * 可视区域竖直方向起始点
         * @member egret.gui.IViewport#verticalScrollPosition
         */
        verticalScrollPosition: number;
        /**
         * 如果为 true，指定将子代剪切到视区的边界。如果为 false，则容器子代会从容器边界扩展过去，而不管组件的大小规范。默认false
         * @member egret.gui.IViewport#clipAndEnableScrolling
         */
        clipAndEnableScrolling: boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IVisualElement
     * @interface
     * @classdesc
     * 可视元素接口
     * @extends egret.gui.ILayoutElement
     */
    interface IVisualElement extends ILayoutElement {
        /**
         * 此IVisualElement对象的所有者。<br/>
         * 0.默认情况下，owner指向parent属性的值。<br/>
         * 1.当此对象被PopUpAnchor组件弹出时，owner指向PopUpAnchor<br/>
         * 2.当此对象作为皮肤内contentGroup的子项时，owner指向主机组件SkinnableContainer<br/>
         * 3.当此对象作为ItemRenderer时，owner指向DataGroup或者主机组件SkinnableDataContainer<br/>
         * 4.当此对象作为非显示对象容器IContainer的子项时,owner指向IContainer。
         * @member egret.gui.IVisualElement#owner
         */
        owner: any;
        /**
         * owner属性由框架内部管理，请不要自行改变它的值，否则可能引发未知的问题。
         * @method egret.gui.IVisualElement#ownerChanged
         * @param value {Object}
         */
        ownerChanged(value: Object): void;
        /**
         * 元素名称。此属性在TabNavigator里作为选项卡显示的字符串。
         * @member egret.gui.IVisualElement#name
         */
        name: string;
        /**
         * 此组件的父容器或组件。
         * 只有可视元素应该具有 parent 属性。
         * 非可视项目应该使用其他属性引用其所属对象。
         * 一般而言，非可视对象使用 owner 属性引用其所属对象。
         * @member egret.gui.IVisualElement#parent
         */
        parent: DisplayObjectContainer;
        /**
         * 控制此可视元素的可见性。如果为 true，则对象可见。
         * @member egret.gui.IVisualElement#visible
         */
        visible: boolean;
        /**
         * 表示指定对象的 Alpha 透明度值。有效值为 0（完全透明）到 1（完全不透明）。默认值为 1。alpha 设置为 0 的显示对象是活动的，即使它们不可见。
         * @member egret.gui.IVisualElement#alpha
         */
        alpha: number;
        /**
         * 组件宽度
         * @member egret.gui.IVisualElement#width
         */
        width: number;
        /**
         * 组件高度
         * @member egret.gui.IVisualElement#height
         */
        height: number;
        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 x 坐标。
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer
         * 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer
         * 的子级将继承逆时针旋转 90 度的坐标系。对象的坐标指的是注册点的位置。
         * @constant egret.gui.IVisualElement#x
         */
        x: number;
        /**
         * 表示 DisplayObject 实例相对于父级 DisplayObjectContainer 本地坐标的 y 坐标。
         * 如果该对象位于具有变形的 DisplayObjectContainer 内，则它也位于包含 DisplayObjectContainer
         * 的本地坐标系中。因此，对于逆时针旋转 90 度的 DisplayObjectContainer，该 DisplayObjectContainer
         * 的子级将继承逆时针旋转 90 度的坐标系。对象的坐标指的是注册点的位置。
         * @constant egret.gui.IVisualElement#y
         */
        y: number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IVisualElementContainer
     * @interface
     * @classdesc
     * 具有管理IVisualElement子显示对象的容器接口
     * @extends egret.gui.IVisualElement
     * @extends egret.gui.IContainer
     */
    interface IVisualElementContainer extends IVisualElement, IContainer {
        /**
         * 从容器中删除所有可视元素。
         * @method egret.gui.IVisualElementContainer#removeAllElements
         */
        removeAllElements(): void;
        /**
         * 交换两个指定可视元素的索引。所有其他元素仍位于相同的索引位置。
         * @method egret.gui.IVisualElementContainer#swapElements
         * @param element1 {IVisualElement} 第一个可视元素。
         * @param element2 {IVisualElement} 第二个可视元素。
         */
        swapElements(element1: IVisualElement, element2: IVisualElement): void;
        /**
         * 交换容器中位于两个指定索引位置的可视元素。所有其他可视元素仍位于相同的索引位置。
         * @method egret.gui.IVisualElementContainer#swapElementsAt
         * @param index1 {number} 第一个元素的索引。
         * @param index2 {number} 第二个元素的索引。
         */
        swapElementsAt(index1: number, index2: number): void;
    }
}
declare module egret.gui {
    class NavigationUnit {
        static DOWN: number;
        static END: number;
        static HOME: number;
        static LEFT: number;
        static PAGE_DOWN: number;
        static PAGE_LEFT: number;
        static PAGE_RIGHT: number;
        static PAGE_UP: number;
        static RIGHT: number;
        static UP: number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.PopUpPosition
     * @classdesc
     * 定义弹出位置的常量值。
     * 该常量决定目标对象相对于父级组件的弹出位置。
     */
    class PopUpPosition {
        /**
         * 在组件上方弹出
         * @constant egret.gui.PopUpPosition.ABOVE
         */
        static ABOVE: string;
        /**
         * 在组件下方弹出
         * @constant egret.gui.PopUpPosition.BELOW
         */
        static BELOW: string;
        /**
         * 在组件中心弹出
         * @constant egret.gui.PopUpPosition.CENTER
         */
        static CENTER: string;
        /**
         * 在组件左上角弹出
         * @constant egret.gui.PopUpPosition.TOP_LEFT
         */
        static TOP_LEFT: string;
        /**
         * 在组件左边弹出
         * @constant egret.gui.PopUpPosition.LEFT
         */
        static LEFT: string;
        /**
         * 在组件右边弹出
         * @constant egret.gui.PopUpPosition.RIGHT
         */
        static RIGHT: string;
        /**
         * 在屏幕中心弹出
         * @constant egret.gui.PopUpPosition.SCREEN_CENTER
         */
        static SCREEN_CENTER: string;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ScrollPolicy
     * @classdesc
     * 滚动条显示策略常量
     */
    class ScrollPolicy {
        /**
         * 如果子项超出父级的尺寸，则允许滚动，反之不允许滚动。
         * @constant egret.gui.ScrollPolicy.AUTO
         */
        static AUTO: string;
        /**
         * 从不允许滚动。
         * @constant egret.gui.ScrollPolicy.OFF
         */
        static OFF: string;
        /**
         * 总是允许滚动。
         * @constant egret.gui.ScrollPolicy.ON
         */
        static ON: string;
    }
}
declare module egret.gui {
    /**
     * @private
     */
    class UIComponentProperties {
        _id: string;
        _isPopUp: boolean;
        _owner: any;
        _updateCompletePendingFlag: boolean;
        _initialized: boolean;
        _nestLevel: number;
        _enabled: boolean;
        _uiWidth: number;
        _uiHeight: number;
        _minWidth: number;
        _maxWidth: number;
        _minHeight: number;
        _maxHeight: number;
        _measuredWidth: number;
        _measuredHeight: number;
        _left: number;
        _right: number;
        _top: number;
        _bottom: number;
        _horizontalCenter: number;
        _verticalCenter: number;
        _percentWidth: number;
        _percentHeight: number;
        _includeInLayout: boolean;
        /**
         * 属性提交前组件旧的宽度
         */
        _oldWidth: number;
        /**
         * 属性提交前组件旧的高度
         */
        _oldHeight: number;
        /**
         * 属性提交前组件旧的X
         * @member egret.gui.UIComponent#oldX
         */
        _oldX: number;
        /**
         * 属性提交前组件旧的Y
         * @member egret.gui.UIComponent#oldY
         */
        _oldY: number;
        /**
         * @member egret.gui.UIComponent#_invalidatePropertiesFlag
         */
        _invalidatePropertiesFlag: boolean;
        /**
         * @member egret.gui.UIComponent#_invalidateSizeFlag
         */
        _invalidateSizeFlag: boolean;
        /**
         * 上一次测量的首选宽度
         * @member egret.gui.UIComponent#_oldPreferWidth
         */
        _oldPreferWidth: number;
        /**
         * 上一次测量的首选高度
         * @member egret.gui.UIComponent#_oldPreferHeight
         */
        _oldPreferHeight: number;
        _invalidateDisplayListFlag: boolean;
        _validateNowFlag: boolean;
        /**
         * _initialize()方法被调用过的标志。
         */
        _initializeCalled: boolean;
        /**
         * 是否已经创建了自身的样式原型链
         */
        _hasOwnStyleChain: boolean;
        /**
         * 样式原型链引用
         */
        _styleProtoChain: any;
        /**
         * 一个性能优化的标志变量。某些子类可以设置为true显式表明自己不含有可设置样式的子项。
         */
        _hasNoStyleChild: boolean;
        /**
         * 父级布局管理器设置了组件的宽度标志，尺寸设置优先级：自动布局>显式设置>自动测量
         * @member egret.gui.UIComponent#_layoutWidthExplicitlySet
         */
        _layoutWidthExplicitlySet: boolean;
        /**
         * 父级布局管理器设置了组件的高度标志，尺寸设置优先级：自动布局>显式设置>自动测量
         * @member egret.gui.UIComponent#_layoutHeightExplicitlySet
         */
        _layoutHeightExplicitlySet: boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.UIGlobals
     * @classdesc
     */
    class UIGlobals {
        private static _stage;
        /**
         * 舞台引用，当第一个UIComponent添加到舞台时此属性被自动赋值
         * @member egret.gui.UIGlobals.stage
         */
        static stage: Stage;
        /**
         * 已经初始化完成标志
         */
        private static initlized;
        /**
         * 初始化管理器
         * @param stage {Stage}
         */
        static _initlize(stage: Stage): void;
        /**
         * 延迟渲染布局管理器
         */
        static _layoutManager: LayoutManager;
        /**
         * 系统管理器列表
         */
        static _uiStage: IUIStage;
        /**
         * 顶级应用容器
         * @member egret.gui.UIGlobals.uiStage
         */
        static uiStage: IUIStage;
    }
}
declare module egret.gui {
    /**
     * UIStage的虚拟子容器
     */
    class UILayer implements IContainer {
        /**
         * 构造函数
         * @param owner {IUIStage}
         * @param lowerBoundReference {string}
         * @param upperBoundReference {strin}
         */
        constructor(owner: IUIStage, lowerBoundReference: string, upperBoundReference: string);
        /**
         * 实体容器
         */
        private owner;
        /**
         * 容器下边界属性
         */
        private lowerBoundReference;
        /**
         * 容器上边界属性
         */
        private upperBoundReference;
        numElements: number;
        private raw_getElementAt;
        private raw_addElementAt;
        private raw_getElementIndex;
        private raw_removeElement;
        private raw_removeElementAt;
        private raw_setElementIndex;
        /**
         * 返回指定索引处的可视元素
         * @param index
         * @returns {IVisualElement}
         */
        getElementAt(index: number): IVisualElement;
        /**
         * 将可视元素添加到此容器中
         * @param element
         * @returns {IVisualElement}
         */
        addElement(element: IVisualElement): IVisualElement;
        /**
         * 将可视元素添加到此容器中
         * @param element
         * @param index
         * @returns {IVisualElement}
         */
        addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
         * 从此容器的子列表中删除指定的可视元素
         * @param element
         * @returns {IVisualElement}
         */
        removeElement(element: IVisualElement): IVisualElement;
        /**
         * 从容器中的指定索引位置删除可视元素
         * @param index
         * @returns {IVisualElement}
         */
        removeElementAt(index: number): IVisualElement;
        /**
         * 返回可视元素的索引位置
         * @param element
         * @returns {number}
         */
        getElementIndex(element: IVisualElement): number;
        /**
         * 在可视容器中更改现有可视元素的位置
         * @param element
         * @param index
         */
        setElementIndex(element: IVisualElement, index: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.UIStage
     * @classdesc
     * 系统管理器，应用程序顶级容器。
     * 通常情况下，一个程序应该只含有唯一的系统管理器,并且所有的组件都包含在它内部。
     * 它负责管理弹窗，鼠标样式，工具提示的显示层级，以及过滤鼠标和键盘事件为可以取消的。
     * @extends egret.gui.Group
     * @implements egret.gui.IUIStage
     */
    class UIStage extends Group implements IUIStage {
        /**
         * 构造函数
         * @method egret.gui.UIStage#constructor
         */
        constructor();
        /**
         * 添加到舞台
         */
        private onAddToStage(event?);
        /**
         * 从舞台移除
         */
        private onRemoveFromStage(event);
        /**
         * 舞台尺寸改变
         */
        private onResize(event?);
        private _autoResize;
        /**
         * 是否自动跟随舞台缩放。当此属性为true时，将强制让UIState始终与舞台保持相同大小。
         * 反之需要外部手动同步大小。默认值为true。
         * @member egret.gui.UIStage#autoResize
         */
        autoResize: boolean;
        /**
         * @constant egret.gui.UIStage#x
         */
        /**
         * @inheritDoc
         */
        x: number;
        /**
         * @constant egret.gui.UIStage#y
         */
        /**
         * @inheritDoc
         */
        y: number;
        /**
         * @member egret.gui.UIStage#width
         */
        /**
         * @inheritDoc
         */
        width: number;
        /**
         * @member egret.gui.UIStage#height
         */
        /**
         * @inheritDoc
         */
        height: number;
        /**
         * @member egret.gui.UIStage#scaleX
         */
        /**
         * @inheritDoc
         */
        scaleX: number;
        /**
         */
        /**
         * @inheritDoc
         */
        scaleY: number;
        /**
         * @param w {number}
         * @param h {number}
         */
        setActualSize(w: number, h: number): void;
        /**
         * @param x {number}
         * @param y {number}
         */
        setLayoutBoundsPosition(x: number, y: number): void;
        /**
         * @param layoutWidth {number}
         * @param layoutHeight {number}
         */
        setLayoutBoundsSize(layoutWidth: number, layoutHeight: number): void;
        /**
         * 布局对象,UIStage只接受BasicLayout
         * @member egret.gui.UIStage#layout
         */
        layout: LayoutBase;
        private _popUpContainer;
        /**
         * 弹出窗口层容器。
         * @member egret.gui.UIStage#popUpContainer
         */
        popUpContainer: IContainer;
        private _toolTipContainer;
        /**
         * 工具提示层容器。
         * @member egret.gui.UIStage#toolTipContainer
         */
        toolTipContainer: IContainer;
        private _cursorContainer;
        /**
         * 鼠标样式层容器。
         * @member egret.gui.UIStage#cursorContainer
         */
        cursorContainer: IContainer;
        private _noTopMostIndex;
        /**
         * 弹出窗口层的起始索引(包括)
         */
        private noTopMostIndex;
        private _topMostIndex;
        /**
         * 弹出窗口层结束索引(不包括)
         */
        private topMostIndex;
        private _toolTipIndex;
        /**
         * 工具提示层结束索引(不包括)
         */
        private toolTipIndex;
        private _cursorIndex;
        /**
         * 鼠标样式层结束索引(不包括)
         */
        private cursorIndex;
        /**
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        addElement(element: IVisualElement): IVisualElement;
        /**
         * @param element {IVisualElement}
         * @param index {number}
         * @returns {IVisualElement}
         */
        addElementAt(element: IVisualElement, index: number): IVisualElement;
        /**
         * @param element {IVisualElement}
         * @returns {IVisualElement}
         */
        removeElement(element: IVisualElement): IVisualElement;
        /**
         * @param index {number}
         * @returns {IVisualElement}
         */
        removeElementAt(index: number): IVisualElement;
        /**
         */
        removeAllElements(): void;
        /**
         * @param element {IVisualElement}
         * @param index {number}
         * @param notifyListeners {boolean}
         */
        _elementRemoved(element: IVisualElement, index: number, notifyListeners?: boolean): void;
        private raw_getElementAt(index);
        private raw_addElement(element);
        private raw_addElementAt(element, index);
        private raw_removeElement(element);
        private raw_removeElementAt(index);
        private raw_removeAllElements();
        private raw_getElementIndex(element);
        private raw_setElementIndex(element, index);
        private raw_swapElements(element1, element2);
        private raw_swapElementsAt(index1, index2);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Effect
     * @classdesc
     * 定义所有效果的基类
     * @extends egret.EventDispatcher
     */
    class Effect extends EventDispatcher implements IEffect {
        /**
         * @method egret.gui.Effect#constructor
         */
        constructor(target?: any);
        private _instances;
        private _isPaused;
        /**
         * 是否在逆转播放
         * @member egret.gui.Effect#playReversed
         */
        playReversed: boolean;
        private effectStopped;
        /**
         * 效果所属的复杂效果
         */
        _parentCompositeEffect: Effect;
        private _duration;
        durationExplicitlySet: boolean;
        /**
         * 效果的持续时间（以毫秒为单位）。
         * @member egret.gui.Effect#duration
         */
        duration: number;
        /**
         * 一个 Class 类型的对象，用于指定此效果类的效果实例类。
         * <p>Effect 类的所有子类都必须在其构造函数中设置此属性。</p>
         * @member egret.gui.Effect#instanceClass
         */
        instanceClass: any;
        /**
         * 如果当前正在播放效果的任一实例，则为 true；否则，则为 false。
         * @member egret.gui.Effect#isPlaying
         */
        isPlaying: boolean;
        /**
         * 是否处于暂停状态，当调用了paused()方法后此属性为true
         * @member egret.gui.Effect#isPaused
         */
        isPaused: Boolean;
        private _perElementOffset;
        /**
         * 在效果的第一个目标之后，其他效果目标的附加延迟（以毫秒为单位）。
         * 此值将添加到 startDelay 属性的值中。
         * @member egret.gui.Effect#perElementOffset
         */
        perElementOffset: number;
        /**
         * 效果的重复次数。可能的值为任何大于等于 0 的整数。
         * 值为 1 表示播放一次效果。值为 0 表示无限制地循环播放效果，直到通过调用 end() 方法停止播放。
         * @member egret.gui.Effect#repeatCount
         */
        repeatCount: number;
        /**
         * 重复播放效果前需要等待的时间（以毫秒为单位）。可能的值为任何大于等于 0 的整数。
         * @member egret.gui.Effect#repeatDelay
         */
        repeatDelay: number;
        /**
         * 开始播放效果前需要等待的时间（以毫秒为单位）。
         * 此值可以是任何大于或等于 0 的整数。
         * 如果使用 repeatCount 属性重复播放效果，则只在首次播放效果时应用 startDelay。
         * @member egret.gui.Effect#startDelay
         */
        startDelay: number;
        /**
         * 要应用此效果的对象。当效果触发器触发某个效果时，会自动将 target 属性设置为触发该效果的对象。
         * @member egret.gui.Effect#target
         */
        target: any;
        private _targets;
        /**
         * 一个对象 Array，这些对象都是效果的目标。播放效果时，会对各个目标并行执行效果。
         * 设置 target 属性将替换此 Array 中的所有对象。
         * 设置 targets 属性后，target 属性将返回此 Array 中的第一个项目。
         * @member egret.gui.Effect#targets
         */
        targets: Array<any>;
        private _playheadTime;
        /**
         * 效果的当前时间位置。此属性的值介于 0 和总持续时间（包括该效果的 startDelay、repeatCount 和 repeatDelay）之间。
         * @member egret.gui.Effect#playheadTime
         */
        playheadTime: number;
        /**
         * 获取一个目标对象 Array，并对每个目标调用 createInstance() 方法。
         * @method egret.gui.Effect#createInstances
         * @param targets 要使用此效果设置动画的对象的数组。
         * @return 效果的效果实例对象的数组，一个目标一个数组。
         */
        createInstances(targets?: Array<any>): Array<any>;
        /**
         * 创建一个效果实例并对其进行初始化。在播放效果实例前，使用此方法（而非 play() 方法）处理效果实例属性。
         *  <p>所创建的效果实例的类型由 instanceClass 属性指定。然后，使用 _initInstance() 方法初始化此实例。
         * 如果该实例是 EffectManager 在效果触发器触发此效果时创建的，
         * 则还需要调用 EffectInstance.initEffect() 方法进一步初始化此效果。</p>
         *  <p>调用 createInstance() 方法不会播放效果。对返回的效果实例调用 startEffect() 方法。</p>
         *  <p>Effect.play() 方法将自动调用此函数。 </p>
         * @method egret.gui.Effect#createInstance
         * @param target 要使用此效果为其设置动画的对象。
         * @return 效果的效果实例对象。
         */
        createInstance(target?: any): IEffectInstance;
        /**
         *  将效果的属性复制到效果实例。
         *  <p>创建自定义效果时覆盖此方法，将属性从 Effect 类复制到效果实例类。
         * 进行覆盖时，请调用 super.initInstance()。 </p>
         * @param EffectInstance 要初始化的效果实例。
         */
        _initInstance(instance: IEffectInstance): void;
        /**
         * 删除实例中的事件侦听器，然后从实例列表中删除该实例。
         * @method egret.gui.Effect#deleteInstance
         */
        deleteInstance(instance: IEffectInstance): void;
        /**
         * 开始播放效果。通常在调用 play() 方法之前先调用 end() 方法，以确保在开始播放新效果前已结束先前效果的所有实例。
         * @method egret.gui.Effect#play
         * @param targets 播放此效果的目标对象的数组。如果已指定此参数，则不会使用效果的 targets 属性。
         * @param playReversedFromEnd 如果为 true，则向后播放效果。
         * @return 效果的 EffectInstance 对象的数组，一个目标一个数组。
         */
        play(targets?: Array<any>, playReversedFromEnd?: boolean): Array<any>;
        /**
         * 暂停效果，直到调用 resume() 方法。
         * @method egret.gui.Effect#pause
         */
        pause(): void;
        /**
         * 停止播放效果，使效果目标保持当前状态。
         * 与调用 pause() 方法不同，无法先调用 stop() 方法再调用 resume() 方法。
         * 不过，您可以调用 play() 方法重新播放效果。
         * @method egret.gui.Effect#stop
         */
        stop(): void;
        /**
         * 在效果由 pause() 方法暂停后继续播放效果。
         * @method egret.gui.Effect#resume
         */
        resume(): void;
        /**
         * 逆序播放效果；如果当前正在播放效果，则从该效果的当前位置开始逆序播放。
         * @method egret.gui.Effect#reverse
         */
        reverse(): void;
        /**
         * 中断当前正在播放的效果，立即跳转到该效果的末尾。调用此方法将调用 EffectInstance.end() 方法。
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         * <p>如果将效果实例作为参数传递，则会中断此实例。
         * 如果没有传入参数，则该效果当前生成的所有效果实例都将中断。</p>
         * @method egret.gui.Effect#end
         */
        end(effectInstance?: IEffectInstance): void;
        /**
         * 当效果实例开始播放时调用此方法。
         */
        _effectStartHandler(event: EffectEvent): void;
        /**
         * 当效果实例已被 stop() 方法调用停止时调用。
         */
        _effectStopHandler(event: EffectEvent): void;
        /**
         * 当效果实例完成播放时调用。
         */
        _effectEndHandler(event: EffectEvent): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Animate
     * @classdesc
     * Animate 效果可设置各个值之间的任意属性集的动画。通过设置 motionPaths 属性，指定要设置动画的属性和值。
     * @extends egret.gui.Effect
     */
    class Animate extends Effect {
        /**
         * @method egret.gui.Animate#constructor
         */
        constructor(target?: any);
        private numUpdateListeners;
        private _motionPaths;
        /**
         * MotionPath 对象的 Array，其中的每个对象都带有正在设置动画的属性的名称以及该属性在动画过程中所采用的值。
         * 此 Array 优先于 Animate 的子类中所声明的任何属性。
         * 例如，如果此 Array 是直接在 Move 效果上设置的，则会忽略 Move 效果的任何属性（如 xFrom）。
         * @member egret.gui.Animate#motionPaths
         */
        motionPaths: Array<MotionPath>;
        private _easer;
        /**
         * 此效果的缓动行为，默认为Sine(.5)
         * @member egret.gui.Animate#easer
         */
        easer: IEaser;
        private _interpolator;
        /**
         * 此效果计算属性的起始值和结束值之间的值所用的插补器。
         * 默认情况下，NumberInterpolator 类处理内插值.
         * @member egret.gui.Animate#interpolator
         */
        interpolator: IInterpolator;
        private _repeatBehavior;
        /**
         * 一种重复效果的行为。RepeatBehavior类中定义的常量。默认为RepeatBehavior.LOOP
         * @member egret.gui.Animate#repeatBehavior
         */
        repeatBehavior: string;
        private _disableLayout;
        /**
         * 如果为 true，则对目标对象禁用任何布局约束。效果完成时，将还原这些属性。
         * @member egret.gui.Animate#disableLayout
         */
        disableLayout: boolean;
        /**
         * @method egret.gui.Animate#_initInstance
         */
        _initInstance(instance: IEffectInstance): void;
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
        /**
         * 派发动画事件
         */
        private animationEventHandler(event);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Power
     * @classdesc
     * Linear 类使用三个阶段定义缓动：加速、匀速运动和减速。
     * @implements egret.gui.IEaser
     */
    class Linear implements IEaser {
        /**
         * @param easeInFraction 在加速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
         * @param easeOutFraction 在减速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
         * @method egret.gui.Linear#constructor
         */
        constructor(easeInFraction?: number, easeOutFraction?: number);
        private _easeInFraction;
        /**
         * 在加速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
         */
        easeInFraction: number;
        private _easeOutFraction;
        /**
         * 在减速阶段中持续时间占总时间的百分比，在 0.0 和 1.0 之间。
         */
        easeOutFraction: number;
        ease(fraction: number): number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.AnimateTransform
     * @classdesc
     * AnimateTransform 效果控制目标对象上所有与转换相关的动画。
     * @extends egret.gui.Animate
     */
    class AnimateTransform extends Animate {
        /**
         * @method egret.gui.AnimateTransform#constructor
         */
        constructor(target?: any);
        /**
         * 指定在转换效果开始播放时，该效果是否围绕目标的中心发生。
         * 如果未设置该标志，转换中心将由此效果中的 transformX, transformY属性决定。
         * @member egret.gui.AnimateTransform#autoCenterTransform
         */
        autoCenterTransform: boolean;
        /**
         * 设置转换中心的 x 坐标（由 autoCenterTransform 属性覆盖时除外）。
         * @member egret.gui.AnimateTransform#transformX
         */
        transformX: number;
        /**
         * 设置转换中心的 y 坐标（由 autoCenterTransform 属性覆盖时除外）。
         * @member egret.gui.AnimateTransform#transformY
         */
        transformY: number;
        /**
         * 获取效果所属的复合效果
         */
        private getOwningParallelEffect();
        createInstance(target?: any): IEffectInstance;
        _effectStartHandler(event: EffectEvent): void;
        /**
         * 计算目标的转换中心
         */
        private computeTransformCenterForTarget(target, valueMap?);
        /**
         * 插入关键帧
         */
        private insertKeyframe(keyframes, newKF);
        /**
         * 添加一个运动路径
         * @param property
         * @param valueFrom
         * @param valueTo
         * @param valueBy
         * @private
         */
        _addMotionPath(property: string, valueFrom?: number, valueTo?: number, valueBy?: number): void;
        _initInstance(instance: IEffectInstance): void;
        /**子效果默认的缓动函数*/
        private static linearEaser;
        private getGlobalStartTime();
        private static sharedObjectMaps;
        private static sharedObjectRefcounts;
        /**
         * 获取共享的实例
         */
        private static getSharedInstance(topmostParallel, target);
        private static removeSharedInstance(topmostParallel, target);
        private static storeSharedInstance(topmostParallel, target, effectInstance);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.CompositeEffect
     * @classdesc
     * 复合效果的基类
     * @extends egret.gui.Effect
     */
    class CompositeEffect extends Effect {
        /**
         * @method egret.gui.CompositeEffect#constructor
         */
        constructor(target?: any);
        private childTargets;
        private _children;
        /**
         * 子效果的数组。
         * @member egret.gui.CompositeEffect#children
         */
        children: Array<Effect>;
        /**
         * 返回此效果的总持续时间。
         * @member egret.gui.CompositeEffect#compositeDuration
         */
        compositeDuration: number;
        createInstance(target?: any): IEffectInstance;
        createInstances(targets?: Array<any>): Array<any>;
        _initInstance(instance: IEffectInstance): void;
        /**
         * 将新的子效果添加到此复合效果。
         * @method egret.gui.CompositeEffect#addChild
         */
        addChild(childEffect: Effect): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.EffectInstance
     * @classdesc
     * 定义所有效果实例的基类
     * @extends egret.EventDispatcher
     */
    class EffectInstance extends EventDispatcher implements IEffectInstance {
        /**
         * @method egret.gui.EffectInstance#constructor
         */
        constructor(target: any);
        /**
         * startDelay和repeatDelay的计时器
         */
        _delayTimer: Timer;
        /**
         * delayTimer开始的时间
         */
        private delayStartTime;
        /**
         * 暂停时delayTimer经过的时间
         */
        private delayElapsedTime;
        /**
         * 是否显式设置了持续时间
         */
        durationExplicitlySet: boolean;
        /**
         * 实例对应效果的复杂效果的实例，如果不是复杂效果则为null
         */
        parentCompositeEffectInstance: EffectInstance;
        /**
         * 已播放实例的次数。
         */
        _playCount: number;
        /**
         * 调用end()方法结束时，防止效果重复的的标志
         */
        _stopRepeat: boolean;
        /**
         * 实际的持续时间包含startDelay，repeatDelay，repeatCount这些值
         */
        _actualDuration: number;
        private _duration;
        /**
         * 效果的持续时间（以毫秒为单位）。
         * @member egret.gui.EffectInstance#duration
         */
        duration: number;
        private _effect;
        /**
         * 创建此 IEffectInstance 对象的 IEffect 对象。
         * @member egret.gui.EffectInstance#effect
         */
        effect: IEffect;
        /**
         * 效果的当前时间位置。
         * 此属性的值介于 0 和总持续时间（包括该效果的 startDelay、repeatCount 和 repeatDelay）之间。
         * @member egret.gui.EffectInstance#playheadTime
         */
        playheadTime: number;
        _setPlayheadTime(value: number): void;
        private _playReversed;
        /**
         * 指定效果是否在反向播放，在播放之前设置此属性
         * @member egret.gui.EffectInstance#playReversed
         */
        playReversed: boolean;
        _setPlayReversed(value: boolean): void;
        private _repeatCount;
        /**
         * 效果的重复次数。可能的值为任何大于等于 0 的整数。
         * @member egret.gui.EffectInstance#repeatCount
         */
        repeatCount: number;
        private _repeatDelay;
        /**
         * 重复播放效果前需要等待的时间（以毫秒为单位）。
         * @member egret.gui.EffectInstance#repeatDelay
         */
        repeatDelay: number;
        private _startDelay;
        /**
         * 开始播放效果前需要等待的时间（以毫秒为单位）。
         * 此值可以是任何大于或等于 0 的整数。
         * 如果使用 repeatCount 属性重复播放效果，则只在首次播放该效果时应用 startDelay 属性。
         * @member egret.gui.EffectInstance#startDelay
         */
        startDelay: number;
        private _target;
        /**
         * 要应用此效果的对象。
         * @member egret.gui.EffectInstance#target
         */
        target: any;
        /**
         * 经过 startDelay 所占用的这段时间后，在目标上播放效果实例。
         * 由 Effect 类调用。在启动 EffectInstance 时，请使用此函数，而非 play() 方法。
         * @method egret.gui.EffectInstance#startEffect
         */
        startEffect(): void;
        /**
         * 在目标上播放效果实例。改为调用 startEffect() 方法，以在 EffectInstance 上开始播放效果。
         * <p>在 EffectInstance 的子类中，必须覆盖此方法。
         * 此覆盖必须调用 super.play() 方法，以便从目标中分派 effectStart 事件。</p>
         * @method egret.gui.EffectInstance#play
         */
        play(): void;
        /**
         * 暂停效果，直到调用 resume() 方法。
         * @method egret.gui.EffectInstance#pause
         */
        pause(): void;
        /**
         * 停止播放效果，使目标保持当前状态。
         * 您需要通过调用 Effect.stop() 方法来调用此方法。在实现过程中，它会调用 finishEffect() 方法。
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         * @method egret.gui.EffectInstance#stop
         */
        stop(): void;
        /**
         * 在效果由 pause() 方法暂停后继续播放效果。
         * @method egret.gui.EffectInstance#resume
         */
        resume(): void;
        /**
         * 从效果的当前位置开始反向播放效果。
         * @method egret.gui.EffectInstance#reverse
         */
        reverse(): void;
        /**
         * 中断当前播放的效果实例，立即跳转到效果的结束位置。
         * 通过调用 Effect.end() 方法可调用此方法。在实现过程中，它会调用 finishEffect() 方法。
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         * @method egret.gui.EffectInstance#end
         */
        end(): void;
        /**
         * 在完成效果播放时由 end() 方法调用。此函数将为效果目标分派 endEffect 事件。
         * @method egret.gui.EffectInstance#finishEffect
         */
        finishEffect(): void;
        /**
         * 每次完成重复效果的迭代播放后调用。
         * @method egret.gui.EffectInstance#finishRepeat
         */
        finishRepeat(): void;
        _playWithNoDuration(): void;
        private delayTimerHandler(event);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Fade
     * @classdesc
     * 淡入淡出效果
     * @extends egret.gui.Animate
     */
    class Fade extends Animate {
        /**
         * @method egret.gui.Fade#constructor
         */
        constructor(target?: any);
        /**
         * 效果开始的透明度
         * @member egret.gui.Fade#alphaFrom
         */
        alphaFrom: number;
        /**
         * 效果结束的透明度
         * @member egret.gui.Fade#alphaTo
         */
        alphaTo: number;
        _initInstance(instance: IEffectInstance): void;
    }
}
declare module egret.gui {
    interface IEffect extends IEventDispatcher {
        /**
         * 效果的持续时间（以毫秒为单位）。
         */
        duration: number;
        /**
         * 一个只读标志，如果当前正在播放效果的任一实例，则为 true；否则，则为 false。
         */
        isPlaying: boolean;
        /**
         * 在效果的第一个目标之后，其他效果目标的附加延迟（以毫秒为单位）。此值将添加到 startDelay 属性的值中。
         */
        perElementOffset: number;
        /**
         * 要应用此效果的对象。当效果触发器触发某个效果时，会自动将 target 属性设置为触发该效果的对象。
         */
        target: any;
        /**
         * 一个对象 Array，这些对象都是效果的目标。播放效果时，会对各个目标并行执行效果。
         * 设置 target 属性将替换此 Array 中的所有对象。
         * 设置 targets 属性后，target 属性将返回此 Array 中的第一个项目。
         */
        targets: Array<any>;
        /**
         * 效果的当前时间位置。此属性的值介于 0 和总持续时间（包括该效果的 startDelay、repeatCount 和 repeatDelay）之间。
         */
        playheadTime: number;
        /**
         * 获取一个目标对象 Array，并对每个目标调用 createInstance() 方法。
         *  @param targets 要使用此效果设置动画的对象的数组。
         *  @return 效果的效果实例对象的数组，一个目标一个数组。
         */
        createInstances(targets?: Array<any>): Array<any>;
        /**
         * 创建一个效果实例并对其进行初始化。在播放效果实例前，使用此方法（而非 play() 方法）处理效果实例属性。
         *  <p>所创建的效果实例的类型由 instanceClass 属性指定。然后，使用 _initInstance() 方法初始化此实例。
         * 如果该实例是 EffectManager 在效果触发器触发此效果时创建的，
         * 则还需要调用 EffectInstance.initEffect() 方法进一步初始化此效果。</p>
         *  <p>调用 createInstance() 方法不会播放效果。对返回的效果实例调用 startEffect() 方法。</p>
         *  <p>Effect.play() 方法将自动调用此函数。 </p>
         *  @param target 要使用此效果为其设置动画的对象。
         *  @return 效果的效果实例对象。
         */
        createInstance(target?: any): IEffectInstance;
        /**
         * 删除实例中的事件侦听器，然后从实例列表中删除该实例。
         */
        deleteInstance(instance: IEffectInstance): void;
        /**
         * 开始播放效果。通常在调用 play() 方法之前先调用 end() 方法，以确保在开始播放新效果前已结束先前效果的所有实例。
         * @param targets 播放此效果的目标对象的数组。如果已指定此参数，则不会使用效果的 targets 属性。
         * @param playReversedFromEnd 如果为 true，则向后播放效果。
         * @return 效果的 EffectInstance 对象的数组，一个目标一个数组。
         */
        play(targets?: Array<any>, playReversedFromEnd?: boolean): Array<any>;
        /**
         * 暂停效果，直到调用 resume() 方法。
         */
        pause(): void;
        /**
         * 停止播放效果，使效果目标保持当前状态。
         * 与调用 pause() 方法不同，无法先调用 stop() 方法再调用 resume() 方法。
         * 不过，您可以调用 play() 方法重新播放效果。
         */
        stop(): void;
        /**
         * 在效果由 pause() 方法暂停后继续播放效果。
         */
        resume(): void;
        /**
         * 逆序播放效果；如果当前正在播放效果，则从该效果的当前位置开始逆序播放。
         */
        reverse(): void;
        /**
         * 中断当前正在播放的效果，立即跳转到该效果的末尾。调用此方法将调用 EffectInstance.end() 方法。
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         * <p>如果将效果实例作为参数传递，则会中断此实例。
         * 如果没有传入参数，则该效果当前生成的所有效果实例都将中断。</p>
         */
        end(effectInstance?: IEffectInstance): void;
    }
}
declare module egret.gui {
    interface IEffectInstance {
        /**
         * 效果的持续时间（以毫秒为单位）。
         */
        duration: number;
        /**
         * 创建此 IEffectInstance 对象的 IEffect 对象。
         */
        effect: IEffect;
        /**
         * 效果的当前时间位置。
         * 此属性的值介于 0 和总持续时间（包括该效果的 startDelay、repeatCount 和 repeatDelay）之间。
         */
        playheadTime: number;
        /**
         * 效果的重复次数。可能的值为任何大于等于 0 的整数。
         */
        repeatCount: number;
        /**
         * 重复播放效果前需要等待的时间（以毫秒为单位）。
         */
        repeatDelay: number;
        /**
         * 开始播放效果前需要等待的时间（以毫秒为单位）。
         * 此值可以是任何大于或等于 0 的整数。
         * 如果使用 repeatCount 属性重复播放效果，则只在首次播放该效果时应用 startDelay 属性。
         */
        startDelay: number;
        /**
         * 要应用此效果的对象。
         */
        target: any;
        /**
         * 经过 startDelay 所占用的这段时间后，在目标上播放效果实例。
         * 由 Effect 类调用。在启动 EffectInstance 时，请使用此函数，而非 play() 方法。
         */
        startEffect(): void;
        /**
         * 在目标上播放效果实例。改为调用 startEffect() 方法，以在 EffectInstance 上开始播放效果。
         * <p>在 EffectInstance 的子类中，必须覆盖此方法。
         * 此覆盖必须调用 super.play() 方法，以便从目标中分派 effectStart 事件。</p>
         */
        play(): void;
        /**
         * 暂停效果，直到调用 resume() 方法。
         */
        pause(): void;
        /**
         * 停止播放效果，使目标保持当前状态。
         * 您需要通过调用 Effect.stop() 方法来调用此方法。在实现过程中，它会调用 finishEffect() 方法。
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         */
        stop(): void;
        /**
         * 在效果由 pause() 方法暂停后继续播放效果。
         */
        resume(): void;
        /**
         * 从效果的当前位置开始反向播放效果。
         */
        reverse(): void;
        /**
         * 中断当前播放的效果实例，立即跳转到效果的结束位置。
         * 通过调用 Effect.end() 方法可调用此方法。在实现过程中，它会调用 finishEffect() 方法。
         * <p>如果调用此方法来结束播放效果，效果实例将分派 effectEnd 事件。</p>
         */
        end(): void;
        /**
         * 在完成效果播放时由 end() 方法调用。此函数将为效果目标分派 endEffect 事件。
         */
        finishEffect(): void;
        /**
         * 每次完成重复效果的迭代播放后调用。
         */
        finishRepeat(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Move
     * @classdesc
     * Move 效果按 x 和 y 方向移动目标对象。
     * @extends egret.gui.AnimateTransform
     */
    class Move extends AnimateTransform {
        /**
         * @method egret.gui.Move#constructor
         */
        constructor(target?: any);
        /**
         * 按其修改目标的 y 位置的像素数目。此值可以为负值
         * @member egret.gui.Move#yBy
         */
        yBy: number;
        /**
         * 目标的初始 y 位置
         * @member egret.gui.Move#yFrom
         */
        yFrom: number;
        /**
         * 目标的最终 y 位置
         * @member egret.gui.Move#yTo
         */
        yTo: number;
        /**
         * 按其修改目标的 x 位置的像素数目
         * @member egret.gui.Move#xBy
         */
        xBy: number;
        /**
         * 目标的初始 x 位置
         * @member egret.gui.Move#xFrom
         */
        xFrom: number;
        /**
         * 目标的最终 x 位置
         * @member egret.gui.Move#xTo
         */
        xTo: number;
        createInstance(target?: any): IEffectInstance;
        _initInstance(instance: IEffectInstance): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Parallel
     * @classdesc
     * Parallel 效果同时播放多个子效果。
     * @extends egret.gui.CompositeEffect
     */
    class Parallel extends CompositeEffect {
        /**
         * @method egret.gui.Parallel#constructor
         */
        constructor(target?: any);
        compositeDuration: number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Rotate
     * @classdesc
     * Rotate 效果围绕转换中心旋转目标对象。
     * @extends egret.gui.AnimateTransform
     */
    class Rotate extends AnimateTransform {
        /**
         * @method egret.gui.Rotate#constructor
         */
        constructor(target?: any);
        /**
         * 目标对象的起始旋转角度
         * @member egret.gui.Rotate#angleFrom
         */
        angleFrom: number;
        /**
         * 目标对象的结束旋转角度
         * @member egret.gui.Rotate#angleTo
         */
        angleTo: number;
        /**
         * 旋转目标对象的度数
         * @member egret.gui.Rotate#angleBy
         */
        angleBy: number;
        createInstance(target?: any): IEffectInstance;
        _initInstance(instance: IEffectInstance): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Scale
     * @classdesc
     * Scale 效果围绕转换中心在 x 和 y 方向上缩放目标对象
     * @extends egret.gui.AnimateTransform
     */
    class Scale extends AnimateTransform {
        /**
         * @method egret.gui.Scale#constructor
         */
        constructor(target?: any);
        /**
         * 在 y 方向上的起始比例因子。
         * @member egret.gui.Scale#scaleYFrom
         */
        scaleYFrom: number;
        /**
         * 在 y 方向上的结束比例因子。
         * @member egret.gui.Scale#scaleYTo
         */
        scaleYTo: number;
        /**
         * 在 y 方向上按其缩放对象的因子。
         * @member egret.gui.Scale#scaleYBy
         */
        scaleYBy: number;
        /**
         * 在 x 方向上的起始比例因子。
         * @member egret.gui.Scale#scaleXFrom
         */
        scaleXFrom: number;
        /**
         * 在 x 方向上的结束比例因子。
         * @member egret.gui.Scale#scaleXTo
         */
        scaleXTo: number;
        /**
         * 在 x 方向上按其缩放对象的因子。
         * @member egret.gui.Scale#scaleXBy
         */
        scaleXBy: number;
        createInstance(target?: any): IEffectInstance;
        _initInstance(instance: IEffectInstance): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Sequence
     * @classdesc
     * Sequence 效果以子效果的添加顺序依次播放多个子效果。
     * @extends egret.gui.CompositeEffect
     */
    class Sequence extends CompositeEffect {
        /**
         * @method egret.gui.Sequence#constructor
         */
        constructor(target?: any);
        compositeDuration: number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.EaseInOutBase
     * @classdesc
     * EaseInOutBase 类是提供缓动功能的基类。
     * @implements egret.gui.IEaser
     */
    class EaseInOutBase implements IEaser {
        /**
         * @param easeInFraction 缓入过程所占动画播放时间的百分比。剩余即为缓出的时间。
         * 默认值为 EasingFraction.IN_OUT，它会缓入前一半时间，并缓出剩余的一半时间。
         * @method egret.gui.EaseInOutBase#constructor
         */
        constructor(easeInFraction?: number);
        private _easeInFraction;
        /**
         * 缓入过程所占动画播放时间的百分比。剩余即为缓出的时间。
         * 有效值为 0.0 到 1.0。
         */
        easeInFraction: number;
        ease(fraction: number): number;
        /**
         * 在动画的缓入阶段期间计算已经缓动部分要映射到的值。
         */
        _easeIn(fraction: number): number;
        /**
         * 在动画的缓出阶段期间计算已经缓动部分要映射到的值。
         */
        _easeOut(fraction: number): number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Sine
     * @classdesc
     * Sine 类使用 Sine 函数定义缓动功能。
     * @extends egret.gui.EaseInOutBase
     */
    class Sine extends EaseInOutBase {
        /**
         * @param easeInFraction 缓入过程所占动画播放时间的百分比。剩余即为缓出的时间。
         * @method egret.gui.Sine#constructor
         */
        constructor(easeInFraction?: number);
        /**
         * @inheritDoc
         */
        _easeIn(fraction: number): number;
        /**
         * @inheritDoc
         */
        _easeOut(fraction: number): number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Animation
     * @classdesc
     * Animation 类定义在指定的时间段上在属性的开始值和结束值之间发生的动画。
     */
    class Animation {
        private static TIMER_RESOLUTION;
        /**
         * @param updateFunction {Function} 动画更新时的回调函数,updateFunction(animation:Animation):void
         * @param thisObject {an}
         * @method egret.gui.Animation#constructor
         */
        constructor(updateFunction: (animation: Animation) => void, thisObject: any);
        private static defaultEaser;
        private _easer;
        /**
         * 此效果的缓动行为，默认为Sine(.5)
         * @member egret.gui.Animation#easer
         */
        easer: IEaser;
        private thisObject;
        /**
         * 动画开始播放时的回调函数,只会在首次延迟等待结束时触发一次,若有重复播放，之后将触发repeatFunction。
         * startFunction(animation:Animation):void
         * @member egret.gui.Animation#startFunction
         */
        startFunction: Function;
        /**
         * 动画播放结束时的回调函数,可以是正常播放结束，也可以是被调用了end()方法导致结束。注意：stop()方法被调用不会触发这个函数。
         * endFunction(animation:Animation):void
         * @member egret.gui.Animation#endFunction
         */
        endFunction: Function;
        /**
         * 动画更新时的回调函数,updateFunction(animation:Animation):void
         * @member egret.gui.Animation#updateFunction
         */
        updateFunction: Function;
        /**
         * 动画被停止的回调函数，即stop()方法被调用。stopFunction(animation:Animation):void
         * @member egret.gui.Animation#stopFunction
         */
        stopFunction: Function;
        /**
         * 动画重复的回调函数，repeatFunction(animation:Animation):void
         * @member egret.gui.Animation#repeatFunction
         */
        repeatFunction: Function;
        /**
         * 用于计算当前帧的时间
         */
        private static intervalTime;
        private static activeAnimations;
        private static timer;
        private id;
        private _doSeek;
        private _isPlaying;
        private _doReverse;
        private _invertValues;
        private startTime;
        private started;
        private cycleStartTime;
        private delayTime;
        private static delayedStartAnims;
        private delayedStartTime;
        /**
         * 直到 Animation 的当前帧，包含计算的值的对象。
         * 会使用属性名作为键，将这些值存储为 map 值。
         * @member egret.gui.Animation#currentValue
         */
        currentValue: any;
        /**
         * MotionPath 对象集，它定义随着时间的推移 Animation 将设置动画的属性和值。
         * @member egret.gui.Animation#motionPaths
         */
        motionPaths: Array<MotionPath>;
        private _playheadTime;
        /**
         * 动画的总计已过去时间，包括任何开始延迟和重复。
         * 对于播放了第一个循环的动画，此值将等于 cycleTime 的值。
         * @member egret.gui.Animation#playheadTime
         */
        playheadTime: number;
        /**
         * 如果为 true，则表示当前正在播放动画。
         * 除非已播放动画且尚未停止（以编程方式或自动）或暂停它，否则该值为 false。
         * @member egret.gui.Animation#isPlaying
         */
        isPlaying: boolean;
        /**
         * 动画的时长（以毫秒为单位），不计算由 repeatCount 属性定义的任何重复。
         * @member egret.gui.Animation#duration
         */
        duration: number;
        private _repeatBehavior;
        /**
         * 设置重复动画的行为。
         * 重复动画已将 repeatCount 属性设置为 0 或某个大于 1 的值。
         * 此值应该为 RepeatBehavior.LOOP（意味着每次动画按相同的顺序重复）
         * 或 RepeatBehavior.REVERSE（意味着对于每个迭代，动画都倒转方向）。
         * @member egret.gui.Animation#repeatBehavior
         */
        repeatBehavior: string;
        private _repeatCount;
        /**
         * 此动画重复的次数。值为 0 意味着它会无限期地重复。默认值为1
         * @member egret.gui.Animation#repeatCount
         */
        repeatCount: number;
        private _repeatDelay;
        /**
         * 在每次重复循环开始之前延迟的时间数量（以毫秒为单位）。
         * 将此值设置为一个非零数字会恰好在其结束值处结束上一个动画循环。
         * 但是，不延迟的重复可能会完全跳过该值，因为动画会从在一个循环的结尾附近平滑地过渡到越过下一个循环的开始处。
         * 必须将此属性设置为大于等于 0 的一个值。
         * @member egret.gui.Animation#repeatDelay
         */
        repeatDelay: number;
        private _startDelay;
        /**
         * 在动画开始之前等待的时间数量。必须将此属性设置为大于等于 0 的一个值。
         * @member egret.gui.Animation#startDelay
         */
        startDelay: number;
        /**
         * Animation 实例所用的插补器，用于计算属性的开始值和结束值之间的值。
         * @member egret.gui.Animation#interpolator
         */
        interpolator: IInterpolator;
        private _cycleTime;
        /**
         * 在当前周期动画中的当前毫秒位置。该值介于 0 和 duration 之间。
         * 动画的“周期”被定义为动画的单一重复，其中 repeatCount 属性用于定义将播放的周期数。
         * 使用 seek() 方法更改动画的位置。
         * @member egret.gui.Animation#cycleTime
         */
        cycleTime: number;
        private _cycleFraction;
        /**
         * 在已应用缓动之后，在动画中已过去的当前部分。
         * 此值在 0 和 1 之间。动画的“周期”被定义为动画的单一重复，其中 repeatCount 属性用于定义将播放的周期数。
         * @member egret.gui.Animation#cycleFraction
         */
        cycleFraction: number;
        private _playReversed;
        /**
         * 如果为 true，则反向播放动画。
         * 如果当前播放动画的方向与 playReversed 的指定值相反，则动画将以动态方式更改方向。
         * @member egret.gui.Animation#playReversed
         */
        playReversed: boolean;
        /**
         * 添加动画
         */
        private static addAnimation(animation);
        private static removeAnimationAt(index?);
        private static removeAnimation(animation);
        private static timerHandler(event);
        /**
         * 计算插补值，派发更新事件。如果动画结束了则返回true
         */
        private doInterval();
        /**
         * 通知目标对象更新动画
         */
        private sendUpdateEvent();
        /**
         * 发送动画事件
         */
        private sendAnimationEvent(eventType);
        /**
         * 计算当前值
         */
        private calculateValue(currentTime);
        private removeFromDelayedAnimations();
        /**
         * 中断动画，立即跳到动画的结尾，并对 animationTarget 调用 animationEnd() 函数。
         * @method egret.gui.Animation#end
         */
        end(): void;
        private static stopTimerIfDone();
        private addToDelayedAnimations(timeToDelay);
        /**
         * 开始动画。如果动画已在播放，则会首先停止它，然后播放它。
         * @method egret.gui.Animation#play
         */
        play(): void;
        /**
         * 前进到指定位置
         */
        private seek(playheadTime, includeStartDelay?);
        /**
         * 设置数组插补器
         */
        private setupInterpolation();
        /**
         * 从当前位置反向播放效果
         * @method egret.gui.Animation#reverse
         */
        reverse(): void;
        /**
         * 在调用 resume() 方法之前暂停该效果。如果在 resume() 之前调用 stop()，则无法继续该动画。
         * @method egret.gui.Animation#pause
         */
        pause(): void;
        private stopAnimation();
        /**
         * 停止播放动画，且结束时不调用 end() 方法。将对 animationTarget 调用 animationStop() 函数。
         * @method egret.gui.Animation#stop
         */
        stop(): void;
        /**
         * 在效果由 pause() 方法暂停后继续播放效果。
         * @method egret.gui.Animation#resume
         */
        resume(): void;
        private repeat(event?);
        private start(event?);
        private static startTime;
        private static _currentTime;
        private static pulse();
        private static currentTime;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Keyframe
     * @classdesc
     * Keyframe 类用于定义位于效果过程中某个特定时间的属性的值。
     */
    class Keyframe {
        /**
         * @param time 以毫秒为单位的时间，此关键帧的效果目标应该在此时间处具有 value 参数指定的值。
         * @param value 效果目标在给定的 time 处应该具有的值。
         * @param valueBy 可选参数，如果提供该可选参数，
         * 则可以通过将 valueBy 与 MotionPath 对象的关键帧集合中的前一个关键帧的 value 相加来动态地计算 value。
         * 如果是序列中的第一个 Keyframe，则会忽略此值
         * @method egret.gui.Keyframe#constructor
         */
        constructor(time?: number, value?: any, valueBy?: any);
        /**
         * 返回此 Keyframe 对象的副本。
         */
        clone(): Keyframe;
        /**
         * 效果目标的属性在 time 属性指定的时间处所应该具有的值。
         */
        value: any;
        /**
         * 以毫秒为单位的时间，此关键帧的效果目标应该在此时间处具有 value 属性指定的值。
         * 此时间与用此关键帧定义的效果的起始时间相关。
         */
        time: number;
        _timeFraction: number;
        /**
         * 对运动路径中前一个 Keyframe 对象与此 Keyframe 对象之间的运动所应用的缓动行为。
         * 默认情况下，缓动是线性的，或者根本就没有缓动。
         */
        easer: IEaser;
        /**
         * 用于计算此关键帧或前一个关键帧中的 value 的可选参数（如果已指定）。
         * 如果在前一个关键帧中未设置 value，但此关键帧中同时定义了 value 和 valueBy，
         * 则前一个关键帧中的 value 可以通过以此关键帧中的 value 减去此关键帧中的 valueBy 来计算。
         */
        valueBy: any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.MotionPath
     * @classdesc
     * MotionPath 类定义效果的 Keyframe 对象的集合，以及要设置动画的目标上属性的名称。
     */
    class MotionPath {
        /**
         * @param property 要设置动画的目标上属性的名称。
         * @method egret.gui.MotionPath#constructor
         */
        constructor(property?: string);
        /**
         * 要设置动画的效果目标上属性的名称。
         */
        property: string;
        interpolator: IInterpolator;
        /**
         * 表示属性在动画过程中所采用的时间/值对的 Keyframe 对象序列。
         */
        keyframes: Array<Keyframe>;
        /**
         * 返回此 MotionPath 对象的副本（包含每个关键帧的副本）。
         */
        clone(): MotionPath;
        /**
         * 计算每一个关键帧的timeFraction值
         */
        _scaleKeyframes(duration: number): void;
        /**
         * 给定已过去时间部分的情况下，计算并返回一个内插值。
         * 该函数决定该部分所处于的关键帧时间间隔，
         * 然后在该时间间隔内插补该时间间隔的定界关键帧值之间的值。
         * @param fraction 效果的总体持续时间部分（从 0.0 到 1.0 之间的值）。
         * @return 内插值
         */
        getValue(fraction: number): any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.RepeatBehavior
     * @classdesc
     * RepeatBehavior类用于定义效果的重复行为的常量
     */
    class RepeatBehavior {
        /**
         * 指定在每个迭代上重复的动画在前进方向上的进度。
         */
        static LOOP: string;
        /**
         * 指定重复动画应该在每个迭代上倒转方向。
         * 例如，反向动画在偶数迭代上向前播放，而在奇数迭代上反向播放。
         */
        static REVERSE: string;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.SimpleMotionPath
     * @classdesc
     * SimpleMotionPath 类是只有两个关键帧的MotionPath的简单实现
     * @extends egret.gui.MotionPath
     */
    class SimpleMotionPath extends MotionPath {
        /**
         * 您可以同时指定 valueFrom 和 valueTo 参数，
         * 也可以在指定 valueBy 参数的同时指定 valueFrom 或 valueTo 参数。
         * 如果忽略这些参数，则会从效果目标计算它们。
         * @param property 正在设置动画的属性的名称。
         * @param valueFrom 属性的初始值。
         * @param valueTo 属性的最终值。
         * @param valueBy 用于指定 delta 的可选参数，该 delta 用于计算 from 或 to 值（如果其中一个值被忽略）。
         * @method egret.gui.SimpleMotionPath#constructor
         */
        constructor(property?: string, valueFrom?: any, valueTo?: any, valueBy?: any);
        /**
         * 动画过程中属性的起始值。
         */
        valueFrom: any;
        /**
         * 已命名的属性将要设置动画的值。
         */
        valueTo: any;
        /**
         * 可指定用于计算 valueFrom 或 valueTo 值的 delta 的可选属性。
         */
        valueBy: any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Bounce
     * @classdesc
     * Bounce 类实现缓动功能，该功能模拟目标对象上的重力牵引和回弹目标对象。
     * @implements egret.gui.IEaser
     */
    class Bounce implements IEaser {
        /**
         * @method egret.gui.Bounce#constructor
         */
        constructor();
        ease(fraction: number): number;
        easeOut(t: number, b: number, c: number, d: number): number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Elastic
     * @classdesc
     * Elastic 类实现缓动功能，此时目标对象移动是由一个指数衰减正弦波定义的。
     * @implements egret.gui.IEaser
     */
    class Elastic implements IEaser {
        /**
         * @method egret.gui.Elastic#constructor
         */
        constructor();
        ease(fraction: number): number;
        easeOut(t: number, b: number, c: number, d: number, a?: number, p?: number): number;
    }
}
declare module egret.gui {
    interface IEaser {
        /**
         * 输入动画播放的当前时刻点，返回转换过后映射的时刻点。
         * @param fraction 动画播放的当前时刻点，从 0.0 到 1.0。
         */
        ease(fraction: number): number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.Power
     * @classdesc
     * Power 类通过使用多项式表达式定义缓动功能。
     * @extends egret.gui.EaseInOutBase
     */
    class Power extends EaseInOutBase {
        /**
         * @param easeInFraction 在加速阶段中整个持续时间的部分，在 0.0 和 1.0 之间。
         * @param exponent 在缓动计算中使用的指数。exponent 属性的值越大，加速和减速的速率越快。
         * @method egret.gui.Power#constructor
         */
        constructor(easeInFraction?: number, exponent?: number);
        private _exponent;
        /**
         * 在缓动计算中使用的指数。exponent 属性的值越大，加速和减速的速率越快。
         */
        exponent: number;
        /**
         * @inheritDoc
         */
        _easeIn(fraction: number): number;
        /**
         * @inheritDoc
         */
        _easeOut(fraction: number): number;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.AnimateInstance
     * @classdesc
     * AnimateInstance 类用于实现 Animate 效果的实例类
     * @extends egret.gui.EffectInstance
     */
    class AnimateInstance extends EffectInstance {
        /**
         * @method egret.gui.AnimateInstance#constructor
         */
        constructor(target: any);
        /**
         * animation实例
         */
        animation: Animation;
        /**
         * 样式属性的字典
         */
        private isStyleMap;
        private _seekTime;
        private reverseAnimation;
        private numUpdateListeners;
        private oldWidth;
        private oldHeight;
        private disabledConstraintsMap;
        private _motionPaths;
        /**
         * MotionPath 对象集，它定义随着时间的推移 Animation 将设置动画的属性和值。
         * @member egret.gui.AnimateInstance#motionPaths
         */
        motionPaths: Array<MotionPath>;
        /**
         * 如果为 true，则对目标对象禁用任何布局约束。效果完成时，将还原这些属性。
         * @member egret.gui.AnimateInstance#disableLayout
         */
        disableLayout: boolean;
        private _easer;
        /**
         * 此效果的缓动行为
         * @member egret.gui.AnimateInstance#easer
         */
        easer: IEaser;
        private _interpolator;
        /**
         * Animation 实例所用的插补器，用于计算属性的开始值和结束值之间的值。
         * @member egret.gui.AnimateInstance#interpolator
         */
        interpolator: IInterpolator;
        private _repeatBehavior;
        /**
         * 设置重复动画的行为。
         * 重复动画已将 repeatCount 属性设置为 0 或某个大于 1 的值。
         * 此值应该为 RepeatBehavior.LOOP（意味着每次动画按相同的顺序重复）
         * 或 RepeatBehavior.REVERSE（意味着对于每个迭代，动画都倒转方向）。
         * @member egret.gui.AnimateInstance#repeatBehavior
         */
        repeatBehavior: string;
        _setPlayReversed(value: boolean): void;
        /**
         *  @inheritDoc
         */
        playheadTime: number;
        /**
         * @inheritDoc
         */
        pause(): void;
        /**
         * @inheritDoc
         */
        stop(): void;
        /**
         * @inheritDoc
         */
        resume(): void;
        /**
         * @inheritDoc
         */
        reverse(): void;
        /**
         * @inheritDoc
         */
        end(): void;
        /**
         * @inheritDoc
         */
        startEffect(): void;
        /**
         * @inheritDoc
         */
        play(): void;
        /**
         * 应用动画对应的属性值
         * @method egret.gui.AnimateInstance#applyValues
         */
        applyValues(anim: Animation): void;
        _isValidValue(value: any): boolean;
        /**
         * 遍历motionPaths，用计算的值替换null。
         */
        private finalizeValues();
        animationStart(animation: Animation): void;
        animationUpdate(animation: Animation): void;
        animationRepeat(animation: Animation): void;
        private animationCleanup();
        animationEnd(animation: Animation): void;
        animationStop(animation: Animation): void;
        private noopAnimationHandler(event);
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        removeEventListener(type: string, listener: Function, useCapture?: boolean): void;
        private constraintsHolder;
        /**
         * 恢复布局属性
         */
        private reenableConstraint(name);
        /**
         * 恢复所有布局属性
         */
        private reenableConstraints();
        /**
         * 缓存布局属性
         */
        private cacheConstraint(name);
        /**
         * 缓存所有布局属性
         */
        private cacheConstraints();
        private setupParentLayout(enable);
        _setupStyleMapEntry(property: string): void;
        setValue(property: string, value: any): void;
        getCurrentValue(property: string): any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.AnimateTransformInstance
     * @classdesc
     * AnimateTransformInstance 类用于实现 AnimateTransform 效果的实例类
     * @extends egret.gui.AnimateInstance
     */
    class AnimateTransformInstance extends AnimateInstance {
        /**
         * @method egret.gui.AnimateTransformInstance#constructor
         */
        constructor(target: any);
        /**
         * 变换效果开始的标志
         */
        private started;
        private instanceStartTime;
        /**
         * 储存当前的属性值
         */
        private currentValues;
        /**
         * 如果为 true，则已经初始化与该转换相关的效果的此单一实例。
         * 此属性供 AnimateTransform 使用，以防止在将多个转换效果集成到此单一实例中时重复初始化该实例。
         */
        initialized: boolean;
        /**
         * 中心，此效果中的转换是围绕其发生的。特别是，旋转会围绕此点旋转，平移会移动此点，而缩放会以此点为中心进行缩放。
         * 如果 autoCenterTransform 为 true，则将忽略此属性。
         * 如果 autoCenterTransform 为 false 且未提供 transformCenter，则会使用目标对象的转换中心。
         * @member egret.gui.AnimateTransformInstance#transformCenter
         */
        transformCenter: Point;
        autoCenterTransform: boolean;
        startEffect(): void;
        private insertKeyframe(keyframes, newKF, startDelay?, first?);
        /**
         * 使用相对于最外侧的 parent 效果的开始时间，将一个 MotionPath 对象添加到此实例中的 MotionPath 对象集中。
         * 对于在与新的 MotionPath 对象相同的属性上起作用的此效果实例，
         * 如果已经存在一个 MotionPath 对象，则只会将新 MotionPath 的关键帧添加到现有 MotionPath 中。
         * @member egret.gui.AnimateTransformInstance#addMotionPath
         */
        addMotionPath(newMotionPath: MotionPath, newEffectStartTime?: number): void;
        play(): void;
        animationEnd(animation: Animation): void;
        /**
         * 更新转换中心
         */
        private updateTransformCenter();
        getCurrentValue(property: string): any;
        /**
         * 记录上次中心点的位置，当当前计算的中心点和上次位置相差不大时为了防止误差，
         * 就使用上次的值。
         */
        private lastTranslationPoint;
        private static position;
        applyValues(anim: Animation): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.CompositeEffectInstance
     * @classdesc
     * CompositeEffectInstance 类用于实现 CompositeEffect 类的实例类
     * @extends egret.gui.EffectInstance
     */
    class CompositeEffectInstance extends EffectInstance {
        /**
         * @method egret.gui.CompositeEffectInstance#constructor
         */
        constructor(target: any);
        /**
         * 正在播放或者等待播放的EffectInstances
         */
        _activeEffectQueue: Array<any>;
        /**
         * @inheritDoc
         */
        _actualDuration: number;
        private _playheadTime;
        /**
         * @inheritDoc
         */
        playheadTime: number;
        _setPlayheadTime(value: number): void;
        _childSets: Array<any>;
        /**
         * 不含重复次数的持续时间
         */
        _durationWithoutRepeat: number;
        _endEffectCalled: boolean;
        _timerAnimation: Animation;
        /**
         * @inheritDoc
         */
        play(): void;
        /**
         * @inheritDoc
         */
        pause(): void;
        /**
         * @inheritDoc
         */
        stop(): void;
        /**
         * @inheritDoc
         */
        end(): void;
        /**
         * @inheritDoc
         */
        resume(): void;
        /**
         * @inheritDoc
         */
        reverse(): void;
        /**
         * @inheritDoc
         */
        finishEffect(): void;
        /**
         * 向此 Composite 效果添加一组新的子效果。
         * Sequence 效果将按子效果组的添加顺序一次播放一个子效果组。
         * Parallel 效果将同时播放所有子效果组，而不考虑这些子效果组的添加顺序。
         */
        addChildSet(childSet: Array<any>): void;
        /**
         * @inheritDoc
         */
        _playWithNoDuration(): void;
        animationUpdate(animation: Animation): void;
        animationEnd(animation: Animation): void;
        /**
         * 在每个子效果完成播放时调用。子类必须实现此函数。
         */
        _onEffectEnd(childEffect: IEffectInstance): void;
        _effectEndHandler(event: EffectEvent): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.FadeInstance
     * @classdesc
     * FadeInstance 类用于实现 Fade 效果的实例类
     * @extends egret.gui.AnimateInstance
     */
    class FadeInstance extends AnimateInstance {
        /**
         * @method egret.gui.FadeInstance#constructor
         */
        constructor(target: any);
        /**
         * 介于 0.0 和 1.0 之间的 alpha 属性的初始值
         * @member egret.gui.FadeInstance#alphaFrom
         */
        alphaFrom: number;
        /**
         * 介于 0.0 和 1.0 之间的 alpha 属性的最终值
         * @member egret.gui.FadeInstance#alphaFrom
         */
        alphaTo: number;
        play(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ParallelInstance
     * @classdesc
     * ParallelInstance 类用于实现 Parallel 效果的实例类
     * @extends egret.gui.CompositeEffectInstance
     */
    class ParallelInstance extends CompositeEffectInstance {
        /**
         * @method egret.gui.ParallelInstance#constructor
         */
        constructor(target: any);
        /**
         * 已经完成的效果实例
         */
        private doneEffectQueue;
        /**
         * 等待播放的效果实例
         */
        private replayEffectQueue;
        private isReversed;
        private timer;
        /**
         * @inheritDoc
         */
        _durationWithoutRepeat: number;
        /**
         * @inheritDoc
         */
        _setPlayheadTime(value: number): void;
        /**
         * @inheritDoc
         */
        play(): void;
        /**
         * @inheritDoc
         */
        pause(): void;
        /**
         * @inheritDoc
         */
        stop(): void;
        /**
         * @inheritDoc
         */
        resume(): void;
        /**
         * @inheritDoc
         */
        reverse(): void;
        /**
         * @inheritDoc
         */
        end(): void;
        /**
         * @inheritDoc
         */
        _onEffectEnd(childEffect: IEffectInstance): void;
        private startTimer();
        private stopTimer();
        private timerHandler(event);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.SequenceInstance
     * @classdesc
     * SequenceInstance 类用于实现 Sequence 效果的实例类
     * @extends egret.gui.CompositeEffectInstance
     */
    class SequenceInstance extends CompositeEffectInstance {
        /**
         * @method egret.gui.SequenceInstance#constructor
         */
        constructor(target: any);
        /**
         * 已播放效果的持续时间
         */
        private currentInstanceDuration;
        /**
         * 当前播放的效果实例
         */
        private currentSet;
        private currentSetIndex;
        private isPaused;
        /**
         * @inheritDoc
         */
        _durationWithoutRepeat: number;
        /**
         * @inheritDoc
         */
        _setPlayheadTime(value: number): void;
        /**
         * @inheritDoc
         */
        play(): void;
        /**
         * @inheritDoc
         */
        pause(): void;
        /**
         * @inheritDoc
         */
        stop(): void;
        /**
         * @inheritDoc
         */
        resume(): void;
        /**
         * @inheritDoc
         */
        reverse(): void;
        /**
         * 中断当前正在播放的所有效果，跳过尚未开始播放的所有效果，并立即跳至最终的复合效果。
         * @method egret.gui.SequenceInstance#end
         */
        end(): void;
        /**
         * @inheritDoc
         */
        _onEffectEnd(childEffect: IEffectInstance): void;
        private playCurrentChildSet();
        private playNextChildSet(offset?);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TransformUtil
     */
    class TransformUtil {
        /**
         * 将显示对象按照给定的转换中心调整位置
         * @param obj 要转换的显示对象
         * @param transformCenter 转换中心点，以显示对象为坐标系
         * @param translation 新的转换中心的位置，以显示对象的父容器为坐标系
         * @param scaleX 新的缩放值scaleX，如果为NaN则不设置
         * @param scaleY 新的缩放值scaleY，如果为NaN则不设置
         * @param rotation 新的旋转角度，如果为NaN则不设置
         */
        static transformAround(obj: egret.DisplayObject, transformCenter: egret.Point, translation?: egret.Point, scaleX?: number, scaleY?: number, rotation?: number): void;
        static transformPointToParent(obj: egret.DisplayObject, localPosition?: egret.Point): egret.Point;
    }
}
declare module egret.gui {
    interface IInterpolator {
        /**
         * 如果有在 0.0 和 1.0 之间的某个动画的已过去部分，以及要插补的开始值和结束值，则返回内插值。
         * @param fraction 动画的已过去部分，在 0.0 和 1.0 之间。
         * @param startValue 插值的开始值。
         * @param endValue 插值的结束值。
         * @return 内插值。
         */
        interpolate(fraction: number, startValue: any, endValue: any): any;
        /**
         * 如果有一个基值和一个要添加到它的值，则返回该操作的结果。
         * @param baseValue 插值的开始值。
         * @param incrementValue  应用到 baseValue 的更改。
         * @return 内插值。
         */
        increment(baseValue: any, incrementValue: any): any;
        /**
         * 如果有一个基值和一个从其减去的值，则返回该减量操作的结果。
         * @param baseValue 插值的开始值。
         * @param decrementValue  应用到 baseValue 的更改。
         * @return  内插值。
         */
        decrement(baseValue: any, decrementValue: any): any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.NumberInterpolator
     * @classdesc
     * NumberInterpolator 类在表示为 number 实例的开始值和结束值之间提供插值。
     * @implements egret.gui.IInterpolator
     */
    class NumberInterpolator implements IInterpolator {
        /**
         * @method egret.gui.NumberInterpolator#constructor
         */
        constructor();
        private static theInstance;
        static getInstance(): NumberInterpolator;
        interpolate(fraction: number, startValue: any, endValue: any): any;
        increment(baseValue: any, incrementValue: any): any;
        decrement(baseValue: any, decrementValue: any): any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.CloseEvent
     * @classdesc
     * 窗口关闭事件
     * @extends egret.Event
     */
    class CloseEvent extends Event {
        /**
         * @constant egret.gui.CloseEvent.CLOSE
         */
        static CLOSE: string;
        /**
         * 构造函数
         * @method egret.gui.CloseEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param detail {any}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, detail?: any);
        /**
         * 触发关闭事件的细节。某些窗口组件用此属性来区分窗口中被点击的按钮。
         * @member egret.gui.CloseEvent#detail
         */
        detail: any;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.CloseEvent.dispatchCloseEvent
         */
        static dispatchCloseEvent(target: IEventDispatcher, type: string, detail?: any): boolean;
        clean(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.CollectionEvent
     * @classdesc
     * 集合类型数据改变事件
     * @extends egret.Event
     */
    class CollectionEvent extends Event {
        /**
         * 集合类数据发生改变
         * @constant egret.gui.CollectionEvent.COLLECTION_CHANGE
         */
        static COLLECTION_CHANGE: string;
        /**
         * @method egret.gui.CollectionEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param kind {string}
         * @param location {number}
         * @param oldLocation {number}
         * @param items {Array<any>}
         * @param oldItems {Array<any>}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, kind?: string, location?: number, oldLocation?: number, items?: Array<any>, oldItems?: Array<any>);
        /**
         * 指示发生的事件类型。此属性值可以是 CollectionEventKind 类中的一个值，也可以是 null，用于指示类型未知。
         * @member egret.gui.CollectionEvent#kind
         */
        kind: string;
        /**
         * 受事件影响的项目的列表
         * @member egret.gui.CollectionEvent#items
         */
        items: Array<any>;
        /**
         * 仅当kind的值为CollectionEventKind.REPLACE时，表示替换前的项目列表
         * @member egret.gui.CollectionEvent#oldItems
         */
        oldItems: Array<any>;
        /**
         * 如果 kind 值为 CollectionEventKind.ADD、 CollectionEventKind.MOVE、
         * CollectionEventKind.REMOVE 或 CollectionEventKind.REPLACE，
         * CollectionEventKind.UPDATE
         * 则此属性为 items 属性中指定的项目集合中零号元素的的索引。
         * @member egret.gui.CollectionEvent#location
         */
        location: number;
        /**
         * 如果 kind 的值为 CollectionEventKind.MOVE，
         * 则此属性为 items 属性中指定的项目在目标集合中原来位置的从零开始的索引。
         * @member egret.gui.CollectionEvent#oldLocation
         */
        oldLocation: number;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.CollectionEvent.dispatchCollectionEvent
         */
        static dispatchCollectionEvent(target: IEventDispatcher, type: string, kind?: string, location?: number, oldLocation?: number, items?: Array<any>, oldItems?: Array<any>): boolean;
        clean(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.CollectionEventKind
     * @classdesc
     * 定义  CollectionEvent 类 kind 属性的有效值的常量。
     * 这些常量指示对集合进行的更改类型。
     */
    class CollectionEventKind {
        /**
         * 指示集合添加了一个或多个项目。
         * @constant egret.gui.CollectionEventKind.ADD
         */
        static ADD: string;
        /**
         * 指示项目已从 CollectionEvent.oldLocation确定的位置移动到 location确定的位置。
         * @constant egret.gui.CollectionEventKind.MOVE
         */
        static MOVE: string;
        /**
         * 指示集合应用了排序或/和筛选。
         * @constant egret.gui.CollectionEventKind.REFRESH
         */
        static REFRESH: string;
        /**
         * 指示集合删除了一个或多个项目。
         * @constant egret.gui.CollectionEventKind.REMOVE
         */
        static REMOVE: string;
        /**
         * 指示已替换由 CollectionEvent.location 属性确定的位置处的项目。
         * @constant egret.gui.CollectionEventKind.REPLACE
         */
        static REPLACE: string;
        /**
         * 指示集合已彻底更改，需要进行重置。
         * @constant egret.gui.CollectionEventKind.RESET
         */
        static RESET: string;
        /**
         * 指示集合中一个或多个项目进行了更新。受影响的项目将存储在  CollectionEvent.items 属性中。
         * @constant egret.gui.CollectionEventKind.UPDATE
         */
        static UPDATE: string;
        /**
         * 指示集合中某个节点的子项列表已打开，通常应用于Tree的数据源XMLCollection。
         * @constant egret.gui.CollectionEventKind.OPEN
         */
        static OPEN: string;
        /**
         * 指示集合中某个节点的子项列表已关闭，通常应用于Tree的数据源XMLCollection。
         * @constant egret.gui.CollectionEventKind.CLOSE
         */
        static CLOSE: string;
    }
}
declare module egret.gui {
    class EffectEvent extends Event {
        /**
         * 动画播放结束
         */
        static EFFECT_END: string;
        /**
         * 动画播放被停止
         */
        static EFFECT_STOP: string;
        /**
         * 动画播放开始
         */
        static EFFECT_START: string;
        /**
         * 动画开始重复播放
         */
        static EFFECT_REPEAT: string;
        /**
         * 动画播放更新
         */
        static EFFECT_UPDATE: string;
        /**
         * 构造函数
         */
        constructor(eventType: string, bubbles?: boolean, cancelable?: boolean, effectInstance?: IEffectInstance);
        /**
         * 事件的效果实例对象。您可以使用此属性从事件侦听器中访问效果实例对象的属性。
         */
        effectInstance: IEffectInstance;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ElementExistenceEvent
     * @classdesc
     * Group添加或移除元素时分派的事件。
     * @extends egret.Event
     */
    class ElementExistenceEvent extends Event {
        /**
         * 元素添加
         * @constant egret.gui.ElementExistenceEvent.ELEMENT_ADD
         */
        static ELEMENT_ADD: string;
        /**
         * 元素移除
         * @constant egret.gui.ElementExistenceEvent.ELEMENT_REMOVE
         */
        static ELEMENT_REMOVE: string;
        /**
         * @member egret.gui.ElementExistenceEvent#constructor
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, element?: IVisualElement, index?: number);
        /**
         * 指向已添加或删除元素的位置的索引。
         * @member egret.gui.ElementExistenceEvent#index
         */
        index: number;
        /**
         * 对已添加或删除的视觉元素的引用。
         * @member egret.gui.ElementExistenceEvent#element
         */
        element: IVisualElement;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.ElementExistenceEvent.dispatchElementExistenceEvent
         */
        static dispatchElementExistenceEvent(target: IEventDispatcher, type: string, element?: IVisualElement, index?: number): boolean;
        clean(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IndexChangeEvent
     * @classdesc
     * 索引改变事件
     * @extends egret.Event
     */
    class IndexChangeEvent extends Event {
        /**
         * 指示索引已更改
         * @constant egret.gui.IndexChangeEvent.CHANGE
         */
        static CHANGE: string;
        /**
         * 指示索引即将更改,可以通过调用preventDefault()方法阻止索引发生更改
         * @constant egret.gui.IndexChangeEvent.CHANGING
         */
        static CHANGING: string;
        /**
         * @method egret.gui.IndexChangeEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param oldIndex {number}
         * @param newIndex {number}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, oldIndex?: number, newIndex?: number);
        /**
         * 进行更改之后的从零开始的索引。
         * @member egret.gui.IndexChangeEvent#newIndex
         */
        newIndex: number;
        /**
         * 进行更改之前的从零开始的索引。
         * @member egret.gui.IndexChangeEvent#oldIndex
         */
        oldIndex: number;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.IndexChangeEvent.dispatchIndexChangeEvent
         */
        static dispatchIndexChangeEvent(target: IEventDispatcher, type: string, oldIndex?: number, newIndex?: number, cancelable?: boolean): boolean;
        clean(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ListEvent
     * @classdesc
     * 列表事件
     * @extends egret.TouchEvent
     */
    class ListEvent extends TouchEvent {
        /**
         * 指示用户执行了将鼠标指针从控件中某个项呈示器上移开的操作
         * @constant egret.gui.ListEvent.ITEM_ROLL_OUT
         */
        static ITEM_ROLL_OUT: string;
        /**
         * 指示用户执行了将鼠标指针滑过控件中某个项呈示器的操作。
         * @constant egret.gui.ListEvent.ITEM_ROLL_OVER
         */
        static ITEM_ROLL_OVER: string;
        /**
         * 指示用户执行了将鼠标在某个项呈示器上单击的操作。
         * @constant egret.gui.ListEvent.ITEM_CLICK
         */
        static ITEM_CLICK: string;
        /**
         * @method egret.gui.ListEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param touchPointID {number}
         * @param stageX {number}
         * @param stageY {number}
         * @param ctrlKey {boolean}
         * @param altKey {boolean}
         * @param shiftKey {boolean}
         * @param buttonDown {boolean}
         * @param itemIndex {number}
         * @param item {any}
         * @param itemRenderer {IItemRenderer}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, touchPointID?: number, stageX?: number, stageY?: number);
        /**
         * 触发鼠标事件的项呈示器数据源项。
         * @member egret.gui.ListEvent#item
         */
        item: any;
        /**
         * 触发鼠标事件的项呈示器。
         * @member egret.gui.ListEvent#itemRenderer
         */
        itemRenderer: IItemRenderer;
        /**
         * 触发鼠标事件的项索引
         * @member egret.gui.ListEvent#itemIndex
         */
        itemIndex: number;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.ListEvent.dispatchListEvent
         */
        static dispatchListEvent(target: IEventDispatcher, type: string, touchEvent?: TouchEvent, itemIndex?: number, item?: any, itemRenderer?: IItemRenderer): boolean;
        clean(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.MoveEvent
     * @classdesc
     * 移动事件
     * @extends egret.Event
     */
    class MoveEvent extends Event {
        /**
         * @constant egret.gui.MoveEvent.MOVE
         */
        static MOVE: string;
        /**
         * @method egret.gui.MoveEvent#constructor
         * @param type {string}
         * @param oldX {number}
         * @param oldY {number}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * 旧的组件X
         * @member egret.gui.MoveEvent#oldX
         */
        oldX: number;
        /**
         * 旧的组件Y
         * @member egret.gui.MoveEvent#oldY
         */
        oldY: number;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.MoveEvent.dispatchMoveEvent
         */
        static dispatchMoveEvent(target: IEventDispatcher, oldX?: number, oldY?: number): boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.PopUpEvent
     * @classdesc
     * 弹出管理器事件
     * @extends egret.Event
     */
    class PopUpEvent extends Event {
        /**
         * 添加一个弹出框，在执行完添加之后抛出。
         * @constant egret.gui.PopUpEvent.ADD_POPUP
         */
        static ADD_POPUP: string;
        /**
         * 移除一个弹出框，在执行完移除之后抛出。
         * @constant egret.gui.PopUpEvent.REMOVE_POPUP
         */
        static REMOVE_POPUP: string;
        /**
         * 移动弹出框到最前，在执行完前置之后抛出。
         * @constant egret.gui.PopUpEvent.BRING_TO_FRONT
         */
        static BRING_TO_FRONT: string;
        /**
         * 构造函数
         * @method egret.gui.PopUpEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param popUp {IVisualElement}
         * @param modal {boolean}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, popUp?: IVisualElement, modal?: boolean);
        /**
         * 弹出框对象
         * @member egret.gui.PopUpEvent#popUp
         */
        popUp: IVisualElement;
        /**
         * 弹出窗口是否为模态，此属性仅在事件类型为ADD_POPUP时有效。
         * @member egret.gui.PopUpEvent#modal
         */
        modal: boolean;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.PopUpEvent.dispatchPopUpEvent
         */
        static dispatchPopUpEvent(target: IEventDispatcher, type: string, popUp?: IVisualElement, modal?: boolean): boolean;
        clean(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.PropertyChangeEvent
     * @classdesc
     * 对象的一个属性发生更改时传递到事件侦听器的事件
     * @extends egret.Event
     */
    class PropertyChangeEvent extends Event {
        /**
         * 属性改变
         * @constant egret.gui.PropertyChangeEvent.PROPERTY_CHANGE
         */
        static PROPERTY_CHANGE: string;
        /**
         * 构造函数
         * @method egret.gui.PropertyChangeEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param kind {string}
         * @param property {any}
         * @param oldValue {any}
         * @param newValue {any}
         * @param source {any}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, kind?: string, property?: any, oldValue?: any, newValue?: any, source?: any);
        /**
         * 指定更改的类型。可能的值为 PropertyChangeEventKind.UPDATE、PropertyChangeEventKind.DELETE 和 null。
         * @member egret.gui.PropertyChangeEvent#kind
         */
        kind: string;
        /**
         * 更改后的属性的值。
         * @member egret.gui.PropertyChangeEvent#newValue
         */
        newValue: any;
        /**
         * 更改后的属性的值。
         * @member egret.gui.PropertyChangeEvent#oldValue
         */
        oldValue: any;
        /**
         * 指定已更改属性的 String、QName 或 int。
         * @member egret.gui.PropertyChangeEvent#property
         */
        property: any;
        /**
         * 发生更改的对象。
         * @member egret.gui.PropertyChangeEvent#source
         */
        source: any;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.PropertyChangeEvent.dispatchPropertyChangeEvent
         */
        static dispatchPropertyChangeEvent(target: IEventDispatcher, kind?: string, property?: any, oldValue?: any, newValue?: any, source?: any): boolean;
        clean(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.PropertyChangeEventKind
     * @classdesc
     * PropertyChangeEventKind 类定义 PropertyChangeEvent 类的 kind 属性的常量值。
     */
    class PropertyChangeEventKind {
        /**
         * 指示该属性的值已更改。
         * @constant egret.gui.PropertyChangeEventKind.UPDATE
         */
        static UPDATE: string;
        /**
         * 指示该属性已从此对象中删除。
         * @constant egret.gui.PropertyChangeEventKind.DELETE
         */
        static DELETE: string;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.RendererExistenceEvent
     * @classdesc
     * 在DataGroup添加或删除项呈示器时分派的事件。
     * @extends egret.Event
     */
    class RendererExistenceEvent extends Event {
        /**
         * 添加了项呈示器
         * @constant egret.gui.RendererExistenceEvent.RENDERER_ADD
         */
        static RENDERER_ADD: string;
        /**
         * 移除了项呈示器
         * @constant egret.gui.RendererExistenceEvent.RENDERER_REMOVE
         */
        static RENDERER_REMOVE: string;
        /**
         * @method egret.gui.RendererExistenceEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param renderer {IItemRenderer}
         * @param index {number}
         * @param data {any}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, renderer?: IItemRenderer, index?: number, data?: any);
        /**
         * 呈示器的数据项目。
         * @member egret.gui.RendererExistenceEvent#data
         */
        data: any;
        /**
         * 指向已添加或删除项呈示器的位置的索引。
         * @member egret.gui.RendererExistenceEvent#index
         */
        index: number;
        /**
         * 对已添加或删除的项呈示器的引用。
         * @member egret.gui.RendererExistenceEvent#renderer
         */
        renderer: IItemRenderer;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.RendererExistenceEvent.dispatchRendererExistenceEvent
         */
        static dispatchRendererExistenceEvent(target: IEventDispatcher, type: string, renderer?: IItemRenderer, index?: number, data?: any): boolean;
        clean(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ResizeEvent
     * @classdesc
     * 尺寸改变事件
     * @extends egret.Event
     */
    class ResizeEvent extends Event {
        /**
         * @constant egret.gui.ResizeEvent.RESIZE
         */
        static RESIZE: string;
        /**
         * @method egret.gui.ResizeEvent#constructor
         * @param type {string}
         * @param oldWidth {number}
         * @param oldHeight {number}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * 旧的高度
         * @member egret.gui.ResizeEvent#oldHeight
         */
        oldHeight: number;
        /**
         * 旧的宽度
         * @member egret.gui.ResizeEvent#oldWidth
         */
        oldWidth: number;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.ResizeEvent.dispatchResizeEvent
         */
        static dispatchResizeEvent(target: IEventDispatcher, oldWidth?: number, oldHeight?: number): boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.SkinPartEvent
     * @classdesc
     * 皮肤组件附加移除事件
     * @extends egret.Event
     */
    class SkinPartEvent extends Event {
        /**
         * 附加皮肤公共子部件
         * @constant egret.gui.SkinPartEvent.PART_ADDED
         */
        static PART_ADDED: string;
        /**
         * 移除皮肤公共子部件
         * @constant egret.gui.SkinPartEvent.PART_REMOVED
         */
        static PART_REMOVED: string;
        /**
         * @method egret.gui.SkinPartEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param partName {string}
         * @param instance {any}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, partName?: string, instance?: any);
        /**
         * 被添加或移除的皮肤组件实例
         * @member egret.gui.SkinPartEvent#instance
         */
        instance: any;
        /**
         * 被添加或移除的皮肤组件的实例名
         * @member egret.gui.SkinPartEvent#partName
         */
        partName: string;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.SkinPartEvent.dispatchSkinPartEvent
         */
        static dispatchSkinPartEvent(target: IEventDispatcher, type: string, partName?: string, instance?: any): boolean;
        clean(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.StateChangeEvent
     * @classdesc
     * 视图状态改变事件
     * @extends egret.Event
     */
    class StateChangeEvent extends Event {
        /**
         * 当前视图状态已经改变
         * @constant egret.gui.StateChangeEvent.CURRENT_STATE_CHANGE
         */
        static CURRENT_STATE_CHANGE: string;
        /**
         * 当前视图状态即将改变
         * @constant egret.gui.StateChangeEvent.CURRENT_STATE_CHANGING
         */
        static CURRENT_STATE_CHANGING: string;
        /**
         * 状态过渡完成
         */
        static STATE_CHANGE_COMPLETE: string;
        /**
         * @method egret.gui.StateChangeEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param oldState {string}
         * @param newState {string}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, oldState?: string, newState?: string);
        /**
         * 组件正在进入的视图状态的名称。
         * @member egret.gui.StateChangeEvent#newState
         */
        newState: string;
        /**
         * 组件正在退出的视图状态的名称。
         * @member egret.gui.StateChangeEvent#oldState
         */
        oldState: string;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.StateChangeEvent.dispatchStateChangeEvent
         */
        static dispatchStateChangeEvent(target: IEventDispatcher, type: string, oldState?: string, newState?: string): boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TrackBaseEvent
     * @classdesc
     * 从TrackBase组件分派的事件。
     * @extends egret.Event
     */
    class TrackBaseEvent extends Event {
        /**
         * 正在拖拽滑块
         * @constant egret.gui.TrackBaseEvent.THUMB_DRAG
         */
        static THUMB_DRAG: string;
        /**
         * 滑块被按下
         * @constant egret.gui.TrackBaseEvent.THUMB_PRESS
         */
        static THUMB_PRESS: string;
        /**
         * 滑块被放开
         * @constant egret.gui.TrackBaseEvent.THUMB_RELEASE
         */
        static THUMB_RELEASE: string;
        /**
         * 构造函数
         * @method egret.gui.TrackBaseEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.TrackBaseEvent.dispatchTrackBaseEvent
         */
        static dispatchTrackBaseEvent(target: IEventDispatcher, type: string): boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TreeEvent
     * @classdesc
     * Tree事件
     * @extends egret.Event
     */
    class TreeEvent extends Event {
        /**
         * 节点关闭,注意：只有通过交互操作引起的节点关闭才会抛出此事件。
         * @constant egret.gui.TreeEvent.ITEM_CLOSE
         */
        static ITEM_CLOSE: string;
        /**
         * 节点打开,注意：只有通过交互操作引起的节点打开才会抛出此事件。
         * @constant egret.gui.TreeEvent.ITEM_OPEN
         */
        static ITEM_OPEN: string;
        /**
         * 子节点打开或关闭前一刻分派。可以调用preventDefault()方法阻止节点的状态改变。
         * @constant egret.gui.TreeEvent.ITEM_OPENING
         */
        static ITEM_OPENING: string;
        /**
         * @method egret.gui.TreeEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         * @param itemIndex {number}
         * @param item {any}
         * @param itemRenderer {ITreeItemRenderer}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, itemIndex?: number, item?: any, itemRenderer?: ITreeItemRenderer);
        /**
         * 触发鼠标事件的项呈示器数据源项。
         * @member egret.gui.TreeEvent#item
         */
        item: any;
        /**
         * 触发鼠标事件的项呈示器。
         * @member egret.gui.TreeEvent#itemRenderer
         */
        itemRenderer: ITreeItemRenderer;
        /**
         * 触发鼠标事件的项索引
         * @member egret.gui.TreeEvent#itemIndex
         */
        itemIndex: number;
        /**
         * 当事件类型为ITEM_OPENING时，true表示即将打开节点，反之关闭。
         * @member egret.gui.TreeEvent#opening
         */
        opening: boolean;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.TreeEvent.dispatchTreeEvent
         */
        static dispatchTreeEvent(target: IEventDispatcher, type: string, itemIndex?: number, item?: any, itemRenderer?: ITreeItemRenderer, opening?: boolean, bubbles?: boolean, cancelable?: boolean): boolean;
        clean(): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.UIEvent
     * @classdesc
     * UI事件
     * @extends egret.Event
     */
    class UIEvent extends Event {
        /**
         * @method egret.gui.UIEvent#constructor
         * @param type {string}
         * @param bubbles {boolean}
         * @param cancelable {boolean}
         */
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        /**
         * 组件初始化开始
         * @constant egret.gui.UIEvent.INITIALIZE
         */
        static INITIALIZE: string;
        /**
         * 组件创建完成
         * @constant egret.gui.UIEvent.CREATION_COMPLETE
         */
        static CREATION_COMPLETE: string;
        /**
         * 组件的一次三个延迟验证渲染阶段全部完成
         * @constant egret.gui.UIEvent.UPDATE_COMPLETE
         */
        static UPDATE_COMPLETE: string;
        /**
         * 当用户按下ButtonBase控件时分派。如果 autoRepeat属性为 true，则只要按钮处于按下状态，就将重复分派此事件。
         * @constant egret.gui.UIEvent.BUTTON_DOWN
         */
        static BUTTON_DOWN: string;
        /**
         * 改变结束
         * @constant egret.gui.UIEvent.CHANGE_END
         */
        static CHANGE_END: string;
        /**
         * 改变开始
         * @constant egret.gui.UIEvent.CHANGE_START
         */
        static CHANGE_START: string;
        /**
         * 正在改变中
         * @constant egret.gui.UIEvent.CHANGING
         */
        static CHANGING: string;
        /**
         * 值发生改变
         * @constant egret.gui.UIEvent.VALUE_COMMIT
         */
        static VALUE_COMMIT: string;
        /**
         * SkinnableComponent皮肤发生改变
         * @constant egret.gui.UIEvent.SKIN_CHANGED
         */
        static SKIN_CHANGED: string;
        /**
         * UIAsset的content属性解析完成
         * @constant egret.gui.UIEvent.CONTENT_CHANGED
         */
        static CONTENT_CHANGED: string;
        /**
         * 下拉框弹出事件
         * @constant egret.gui.UIEvent.OPEN
         */
        static OPEN: string;
        /**
         * 下拉框关闭事件
         * @constant egret.gui.UIEvent.CLOSE
         */
        static CLOSE: string;
        /**
         * UIMoveClip一次播放完成事件。仅当UIMovieClip.totalFrames>1时会抛出此事件。
         * @constant egret.gui.UIEvent.PLAY_COMPLETE
         */
        static PLAY_COMPLETE: string;
        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.UIEvent.dispatchUIEvent
         */
        static dispatchUIEvent(target: IEventDispatcher, type: string): boolean;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.LayoutBase
     * @classdesc
     * 容器布局基类
     * @extends egret.EventDispatcher
     */
    class LayoutBase extends EventDispatcher {
        /**
         * @method egret.gui.LayoutBase#constructor
         */
        constructor();
        private _target;
        /**
         * 目标容器
         * @member egret.gui.LayoutBase#target
         */
        target: GroupBase;
        private _useVirtualLayout;
        /**
         * 若要配置容器使用虚拟布局，请为与容器关联的布局的 useVirtualLayout 属性设置为 true。
         * 只有布局设置为 VerticalLayout、HorizontalLayout
         * 或 TileLayout 的 DataGroup 或 SkinnableDataContainer
         * 才支持虚拟布局。不支持虚拟化的布局子类必须禁止更改此属性。
         * @member egret.gui.LayoutBase#useVirtualLayout
         */
        useVirtualLayout: boolean;
        private _typicalLayoutRect;
        /**
         * 由虚拟布局所使用，以估计尚未滚动到视图中的布局元素的大小。
         * @member egret.gui.LayoutBase#typicalLayoutRect
         */
        typicalLayoutRect: Rectangle;
        /**
         * 滚动条位置改变
         * @method egret.gui.LayoutBase#scrollPositionChanged
         */
        scrollPositionChanged(): void;
        /**
         * 清理虚拟布局缓存的数据
         * @method egret.gui.LayoutBase#clearVirtualLayoutCache
         */
        clearVirtualLayoutCache(): void;
        /**
         * 在已添加布局元素之后且在验证目标的大小和显示列表之前，由目标调用。
         * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。
         * @method egret.gui.LayoutBase#elementAdded
         * @param index {number}
         */
        elementAdded(index: number): void;
        /**
         * 必须在已删除布局元素之后且在验证目标的大小和显示列表之前，由目标调用此方法。
         * 按元素状态缓存的布局（比如虚拟布局）可以覆盖此方法以更新其缓存。
         * @method egret.gui.LayoutBase#elementRemoved
         * @param index {number}
         */
        elementRemoved(index: number): void;
        /**
         * 测量组件尺寸大小
         * @method egret.gui.LayoutBase#measure
         */
        measure(): void;
        /**
         * 更新显示列表
         * @method egret.gui.LayoutBase#updateDisplayList
         * @param width {number}
         * @param height {number}
         */
        updateDisplayList(width: number, height: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.BasicLayout
     * @classdesc
     * 基本布局
     * @extends egret.gui.LayoutBase
     */
    class BasicLayout extends LayoutBase {
        /**
         * @method egret.gui.BasicLayout#constructor
         */
        constructor();
        /**
         * 此布局不支持虚拟布局，设置这个属性无效
         */
        useVirtualLayout: boolean;
        private _mouseWheelSpeed;
        /**
         * 鼠标滚轮每次滚动时目标容器的verticalScrollPosition
         * 或horizontalScrollPosition改变的像素距离。必须大于0， 默认值20。
         * @member egret.gui.BasicLayout#mouseWheelSpeed
         */
        mouseWheelSpeed: number;
        getElementBoundsLeftOfScrollRect(scrollRect: Rectangle): Rectangle;
        getElementBoundsRightOfScrollRect(scrollRect: Rectangle): Rectangle;
        getElementBoundsAboveScrollRect(scrollRect: Rectangle): Rectangle;
        getElementBoundsBelowScrollRect(scrollRect: Rectangle): Rectangle;
        /**
         *基于目标的内容测量其默认大小，并（可选）测量目标的默认最小大小
         */
        measure(): void;
        /**
         * 调整目标的元素的大小并定位这些元素
         * @param unscaledWidth
         * @param unscaledHeight
         */
        updateDisplayList(unscaledWidth: number, unscaledHeight: number): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ColumnAlign
     * @classdesc
     * ColumnAlign 类为 TileLayout 类的 columnAlign 属性定义可能的值。
     */
    class ColumnAlign {
        /**
         * 不将行两端对齐。
         * @constant egret.gui.ColumnAlign.LEFT
         */
        static LEFT: string;
        /**
         * 通过增大水平间隙将行两端对齐。
         * @constant egret.gui.ColumnAlign.JUSTIFY_USING_GAP
         */
        static JUSTIFY_USING_GAP: string;
        /**
         * 通过增大行高度将行两端对齐。
         * @constant egret.gui.ColumnAlign.JUSTIFY_USING_WIDTH
         */
        static JUSTIFY_USING_WIDTH: string;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.HorizontalLayout
     * @classdesc
     * 水平布局
     * @extends egret.gui.LayoutBase
     */
    class HorizontalLayout extends LayoutBase {
        /**
         * @method egret.gui.HorizontalLayout#constructor
         */
        constructor();
        private _horizontalAlign;
        /**
         * 布局元素的水平对齐策略。参考HorizontalAlign定义的常量。
         * 注意：此属性设置为CONTENT_JUSTIFY始终无效。当useVirtualLayout为true时，设置JUSTIFY也无效。
         * @member egret.gui.HorizontalLayout#horizontalAlign
         */
        horizontalAlign: string;
        private _verticalAlign;
        /**
         * 布局元素的竖直对齐策略。参考VerticalAlign定义的常量。
         * @member egret.gui.HorizontalLayout#verticalAlign
         */
        verticalAlign: string;
        private _gap;
        /**
         * 布局元素之间的水平空间（以像素为单位）
         * @member egret.gui.HorizontalLayout#gap
         */
        gap: number;
        private _padding;
        /**
         * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
         * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
         * @member egret.gui.HorizontalLayout#padding
         */
        padding: number;
        private _paddingLeft;
        /**
         * 容器的左边缘与布局元素的左边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.HorizontalLayout#paddingLeft
         */
        paddingLeft: number;
        private _paddingRight;
        /**
         * 容器的右边缘与布局元素的右边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.HorizontalLayout#paddingRight
         */
        paddingRight: number;
        private _paddingTop;
        /**
         * 容器的顶边缘与第一个布局元素的顶边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.HorizontalLayout#paddingTop
         */
        paddingTop: number;
        private _paddingBottom;
        /**
         * 容器的底边缘与最后一个布局元素的底边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.HorizontalLayout#paddingBottom
         */
        paddingBottom: number;
        /**
         * 标记目标容器的尺寸和显示列表失效
         */
        private invalidateTargetSizeAndDisplayList();
        /**
         * 基于目标的内容测量其默认大小，并（可选）测量目标的默认最小大小
         * @method egret.gui.HorizontalLayout#measure
         */
        measure(): void;
        /**
         * 测量使用虚拟布局的尺寸
         */
        private measureVirtual();
        /**
         * 测量使用真实布局的尺寸
         */
        private measureReal();
        /**
         * 调整目标的元素的大小并定位这些元素
         * @method egret.gui.HorizontalLayout#updateDisplayList
         * @param width {number}
         * @param height {number}
         */
        updateDisplayList(width: number, height: number): void;
        /**
         * 虚拟布局使用的子对象尺寸缓存
         */
        private elementSizeTable;
        /**
         * 获取指定索引的起始位置
         */
        private getStartPosition(index);
        /**
         * 获取指定索引的元素尺寸
         */
        private getElementSize(index);
        /**
         * 获取缓存的子对象尺寸总和
         */
        private getElementTotalSize();
        elementAdded(index: number): void;
        elementRemoved(index: number): void;
        /**
         * 如果 useVirtualLayout 为 true，则当布局目标改变时，布局目标可以使用此方法来清除已缓存布局信息
         */
        clearVirtualLayoutCache(): void;
        /**
         * 折半查找法寻找指定位置的显示对象索引
         */
        private findIndexAt(x, i0, i1);
        /**
         * 虚拟布局使用的当前视图中的第一个元素索引
         */
        private startIndex;
        /**
         * 虚拟布局使用的当前视图中的最后一个元素的索引
         */
        private endIndex;
        /**
         * 视图的第一个和最后一个元素的索引值已经计算好的标志
         */
        private indexInViewCalculated;
        /**
         * verticalScrollPosition 或 horizontalScrollPosition 属性更改时调用
         * @method egret.gui.HorizontalLayout#scrollPositionChanged
         */
        scrollPositionChanged(): void;
        /**
         * 获取视图中第一个和最后一个元素的索引,返回是否发生改变
         */
        private getIndexInView();
        /**
         * 子对象最大宽度
         */
        private maxElementHeight;
        /**
         * 更新使用虚拟布局的显示列表
         */
        private updateDisplayListVirtual(width, height);
        /**
         * 更新使用真实布局的显示列表
         */
        private updateDisplayListReal(width, height);
        /**
         * 为每个可变尺寸的子项分配空白区域
         * @param spaceForChildren {number}
         * @param spaceToDistribute {number}
         * @param totalPercent {number}
         * @param childInfoArray {Array<any>}
         */
        static flexChildrenProportionally(spaceForChildren: number, spaceToDistribute: number, totalPercent: number, childInfoArray: Array<any>): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.RowAlign
     * @classdesc
     * RowAlign 类为 TileLayout 类的 rowAlign 属性定义可能的值。
     */
    class RowAlign {
        /**
         * 不进行两端对齐。
         * @constant egret.gui.RowAlign.TOP
         */
        static TOP: string;
        /**
         * 通过增大垂直间隙将行两端对齐。
         * @constant egret.gui.RowAlign.JUSTIFY_USING_GAP
         */
        static JUSTIFY_USING_GAP: string;
        /**
         * 通过增大行高度将行两端对齐。
         * @constant egret.gui.RowAlign.JUSTIFY_USING_HEIGHT
         */
        static JUSTIFY_USING_HEIGHT: string;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TileLayout
     * @classdesc
     * 格子布局
     * @extends egret.gui.LayoutBase
     */
    class TileLayout extends LayoutBase {
        /**
         * 构造函数
         * @method egret.gui.TileLayout#constructor
         */
        constructor();
        /**
         * 标记horizontalGap被显式指定过
         */
        private explicitHorizontalGap;
        private _horizontalGap;
        /**
         * 列之间的水平空间（以像素为单位）。
         * @member egret.gui.TileLayout#horizontalGap
         */
        horizontalGap: number;
        /**
         * 标记verticalGap被显式指定过
         */
        private explicitVerticalGap;
        private _verticalGap;
        /**
         * 行之间的垂直空间（以像素为单位）。
         * @member egret.gui.TileLayout#verticalGap
         */
        verticalGap: number;
        private _columnCount;
        /**
         * 实际列计数。
         * @member egret.gui.TileLayout#columnCount
         */
        columnCount: number;
        private _requestedColumnCount;
        /**
         * 要显示的列数。设置为0表示自动确定列计数,默认值0。<br/>
         * 注意:当orientation为TileOrientation.COLUMNS(逐列排列元素)且taget被显式设置宽度时，此属性无效。
         * @member egret.gui.TileLayout#requestedColumnCount
         */
        requestedColumnCount: number;
        private _rowCount;
        /**
         * 实际行计数。
         * @member egret.gui.TileLayout#rowCount
         */
        rowCount: number;
        private _requestedRowCount;
        /**
         * 要显示的行数。设置为0表示自动确定行计数,默认值0。<br/>
         * 注意:当orientation为TileOrientation.ROWS(即逐行排列元素,此为默认值)且target被显式设置高度时，此属性无效。
         * @member egret.gui.TileLayout#requestedRowCount
         */
        requestedRowCount: number;
        /**
         * 外部显式指定的列宽
         */
        private explicitColumnWidth;
        private _columnWidth;
        /**
         * 实际列宽（以像素为单位）。 若未显式设置，则从根据最宽的元素的宽度确定列宽度。
         * @member egret.gui.TileLayout#columnWidth
         */
        /**
         */
        columnWidth: number;
        /**
         * 外部显式指定的行高
         */
        private explicitRowHeight;
        private _rowHeight;
        /**
         * 行高（以像素为单位）。 如果未显式设置，则从元素的高度的最大值确定行高度。
         * @member egret.gui.TileLayout#rowHeight
         */
        /**
         */
        rowHeight: number;
        private _padding;
        /**
         * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
         * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
         * @member egret.gui.TileLayout#padding
         */
        padding: number;
        private _paddingLeft;
        /**
         * 容器的左边缘与布局元素的左边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.TileLayout#paddingLeft
         */
        paddingLeft: number;
        private _paddingRight;
        /**
         * 容器的右边缘与布局元素的右边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.TileLayout#paddingRight
         */
        paddingRight: number;
        private _paddingTop;
        /**
         * 容器的顶边缘与第一个布局元素的顶边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.TileLayout#paddingTop
         */
        paddingTop: number;
        private _paddingBottom;
        /**
         * 容器的底边缘与最后一个布局元素的底边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.TileLayout#paddingBottom
         */
        paddingBottom: number;
        private _horizontalAlign;
        /**
         * 指定如何在水平方向上对齐单元格内的元素。
         * 支持的值有 HorizontalAlign.LEFT、HorizontalAlign.CENTER、
         * HorizontalAlign.RIGHT、HorizontalAlign.JUSTIFY。
         * 默认值：HorizontalAlign.JUSTIFY
         * @member egret.gui.TileLayout#horizontalAlign
         */
        horizontalAlign: string;
        private _verticalAlign;
        /**
         * 指定如何在垂直方向上对齐单元格内的元素。
         * 支持的值有 VerticalAlign.TOP、VerticalAlign.MIDDLE、
         * VerticalAlign.BOTTOM、VerticalAlign.JUSTIFY。
         * 默认值：VerticalAlign.JUSTIFY。
         * @member egret.gui.TileLayout#verticalAlign
         */
        verticalAlign: string;
        private _columnAlign;
        /**
         * 指定如何将完全可见列与容器宽度对齐。
         * 设置为 ColumnAlign.LEFT 时，它会关闭列两端对齐。在容器的最后一列和右边缘之间可能存在部分可见的列或空白。这是默认值。
         * 设置为 ColumnAlign.JUSTIFY_USING_GAP 时，horizontalGap 的实际值将增大，
         * 这样最后一个完全可见列右边缘会与容器的右边缘对齐。仅存在一个完全可见列时，
         * horizontalGap 的实际值将增大，这样它会将任何部分可见列推到容器的右边缘之外。
         * 请注意显式设置 horizontalGap 属性不会关闭两端对齐。它仅确定初始间隙值。两端对齐可能会增大它。
         * 设置为 ColumnAlign.JUSTIFY_USING_WIDTH 时，columnWidth 的实际值将增大，
         * 这样最后一个完全可见列右边缘会与容器的右边缘对齐。请注意显式设置 columnWidth 属性不会关闭两端对齐。
         * 它仅确定初始列宽度值。两端对齐可能会增大它。
         * @member egret.gui.TileLayout#columnAlign
         */
        columnAlign: string;
        private _rowAlign;
        /**
         * @member egret.gui.TileLayout#rowAlign
         */
        /**
         * 指定如何将完全可见行与容器高度对齐。
         * 设置为 RowAlign.TOP 时，它会关闭列两端对齐。在容器的最后一行和底边缘之间可能存在部分可见的行或空白。这是默认值。
         *
         * 设置为 RowAlign.JUSTIFY_USING_GAP 时，verticalGap 的实际值会增大，
         * 这样最后一个完全可见行底边缘会与容器的底边缘对齐。仅存在一个完全可见行时，verticalGap 的值会增大，
         * 这样它会将任何部分可见行推到容器的底边缘之外。请注意，显式设置 verticalGap
         * 不会关闭两端对齐，而只是确定初始间隙值。两端对齐接着可以增大它。
         *
         * 设置为 RowAlign.JUSTIFY_USING_HEIGHT 时，rowHeight 的实际值会增大，
         * 这样最后一个完全可见行底边缘会与容器的底边缘对齐。请注意，显式设置 rowHeight
         * 不会关闭两端对齐，而只是确定初始行高度值。两端对齐接着可以增大它。
         */
        rowAlign: string;
        private _orientation;
        /**
         * 指定是逐行还是逐列排列元素。
         * @member egret.gui.TileLayout#orientation
         */
        orientation: string;
        /**
         * 标记目标容器的尺寸和显示列表失效
         */
        private invalidateTargetSizeAndDisplayList();
        /**
         * 基于目标的内容测量其默认大小，并（可选）测量目标的默认最小大小
         */
        measure(): void;
        /**
         * 计算行和列的尺寸及数量
         */
        private calculateRowAndColumn(explicitWidth, explicitHeight);
        /**
         * 缓存的最大子对象宽度
         */
        private maxElementWidth;
        /**
         * 缓存的最大子对象高度
         */
        private maxElementHeight;
        /**
         * 更新最大子对象尺寸
         */
        private updateMaxElementSize();
        /**
         * 更新虚拟布局的最大子对象尺寸
         */
        private updateMaxElementSizeVirtual();
        /**
         * 更新真实布局的最大子对象尺寸
         */
        private updateMaxElementSizeReal();
        /**
         * 如果 useVirtualLayout 为 true，则当布局目标改变时，布局目标可以使用此方法来清除已缓存布局信息
         * @method egret.gui.TileLayout#clearVirtualLayoutCache
         */
        clearVirtualLayoutCache(): void;
        /**
         * 当前视图中的第一个元素索引
         */
        private startIndex;
        /**
         * 当前视图中的最后一个元素的索引
         */
        private endIndex;
        /**
         * 视图的第一个和最后一个元素的索引值已经计算好的标志
         */
        private indexInViewCalculated;
        /**
         * verticalScrollPosition 或 horizontalScrollPosition 属性更改时调用
         */
        scrollPositionChanged(): void;
        /**
         * 获取视图中第一个和最后一个元素的索引,返回是否发生改变
         */
        private getIndexInView();
        /**
         * 调整目标的元素的大小并定位这些元素
         * @param width {number}
         * @param height {number}
         */
        updateDisplayList(width: number, height: number): void;
        /**
         * 为单个元素布局
         */
        private sizeAndPositionElement(element, cellX, cellY, cellWidth, cellHeight);
        /**
         * 为两端对齐调整间隔或格子尺寸
         */
        private adjustForJustify(width, height);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.TileOrientation
     * @classdesc
     * TileOrientation 类为 TileLayout 类的 orientation 属性定义可能的值。
     */
    class TileOrientation {
        /**
         * 逐行排列元素。
         * @constant egret.gui.TileOrientation.ROWS
         */
        static ROWS: string;
        /**
         * 逐列排列元素。
         * @constant egret.gui.TileOrientation.COLUMNS
         */
        static COLUMNS: string;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.VerticalLayout
     * @classdesc
     * 垂直布局
     * @extends egret.gui.LayoutBase
     */
    class VerticalLayout extends LayoutBase {
        /**
         * @method egret.gui.VerticalLayout#constructor
         */
        constructor();
        private _horizontalAlign;
        /**
         * 布局元素的水平对齐策略。参考HorizontalAlign定义的常量。
         * @member egret.gui.VerticalLayout#horizontalAlign
         */
        horizontalAlign: string;
        private _verticalAlign;
        /**
         * 布局元素的竖直对齐策略。参考VerticalAlign定义的常量。
         * 注意：此属性设置为CONTENT_JUSTIFY始终无效。当useVirtualLayout为true时，设置JUSTIFY也无效。
         * @member egret.gui.VerticalLayout#verticalAlign
         */
        verticalAlign: string;
        private _gap;
        /**
         * 布局元素之间的垂直空间（以像素为单位）
         * @member egret.gui.VerticalLayout#gap
         */
        gap: number;
        private _padding;
        /**
         * 四个边缘的共同内边距。若单独设置了任一边缘的内边距，则该边缘的内边距以单独设置的值为准。
         * 此属性主要用于快速设置多个边缘的相同内边距。默认值：0。
         * @member egret.gui.VerticalLayout#padding
         */
        padding: number;
        private _paddingLeft;
        /**
         * 容器的左边缘与布局元素的左边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.VerticalLayout#paddingLeft
         */
        paddingLeft: number;
        private _paddingRight;
        /**
         * 容器的右边缘与布局元素的右边缘之间的最少像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.VerticalLayout#paddingRight
         */
        paddingRight: number;
        private _paddingTop;
        /**
         * 容器的顶边缘与第一个布局元素的顶边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.VerticalLayout#paddingTop
         */
        paddingTop: number;
        private _paddingBottom;
        /**
         * 容器的底边缘与最后一个布局元素的底边缘之间的像素数,若为NaN将使用padding的值，默认值：NaN。
         * @member egret.gui.VerticalLayout#paddingBottom
         */
        paddingBottom: number;
        /**
         * 标记目标容器的尺寸和显示列表失效
         */
        private invalidateTargetSizeAndDisplayList();
        /**
         * 基于目标的内容测量其默认大小，并（可选）测量目标的默认最小大小
         */
        measure(): void;
        /**
         * 测量使用虚拟布局的尺寸
         */
        private measureVirtual();
        /**
         * 测量使用真实布局的尺寸
         */
        private measureReal();
        /**
         * 调整目标的元素的大小并定位这些元素
         * @param width {number}
         * @param height {number}
         */
        updateDisplayList(width: number, height: number): void;
        /**
         * 虚拟布局使用的子对象尺寸缓存
         */
        private elementSizeTable;
        /**
         * 获取指定索引的起始位置
         */
        private getStartPosition(index);
        /**
         * 获取指定索引的元素尺寸
         */
        private getElementSize(index);
        /**
         * 获取缓存的子对象尺寸总和
         */
        private getElementTotalSize();
        /**
         * @param index {number}
         */
        elementAdded(index: number): void;
        /**
         * @param index {number}
         */
        elementRemoved(index: number): void;
        /**
         * 如果 useVirtualLayout 为 true，则当布局目标改变时，布局目标可以使用此方法来清除已缓存布局信息
         */
        clearVirtualLayoutCache(): void;
        /**
         * 折半查找法寻找指定位置的显示对象索引
         */
        private findIndexAt(y, i0, i1);
        /**
         * 虚拟布局使用的当前视图中的第一个元素索引
         */
        private startIndex;
        /**
         * 虚拟布局使用的当前视图中的最后一个元素的索引
         */
        private endIndex;
        /**
         * 视图的第一个和最后一个元素的索引值已经计算好的标志
         */
        private indexInViewCalculated;
        /**
         * verticalScrollPosition 或 horizontalScrollPosition 属性更改时调用
         */
        scrollPositionChanged(): void;
        /**
         * 获取视图中第一个和最后一个元素的索引,返回是否发生改变
         */
        private getIndexInView();
        /**
         * 子对象最大宽度
         */
        private maxElementWidth;
        /**
         * 更新使用虚拟布局的显示列表
         */
        private updateDisplayListVirtual(width, height);
        /**
         * 更新使用真实布局的显示列表
         */
        private updateDisplayListReal(width, height);
        /**
         * 为每个可变尺寸的子项分配空白区域
         * @method egret.gui.VerticalLayout.flexChildrenProportionally
         * @param spaceForChildren {number}
         * @param spaceToDistribute {number}
         * @param totalPercent {number}
         * @param childInfoArray {Array<any>}
         */
        static flexChildrenProportionally(spaceForChildren: number, spaceToDistribute: number, totalPercent: number, childInfoArray: Array<any>): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.ILayoutManagerClient
     * @interface
     * @classdesc
     * 使用布局管理器的组件接口
     * @extends egret.IEventDispatcher
     */
    interface ILayoutManagerClient extends IEventDispatcher {
        /**
         * 验证组件的属性
         * @method egret.gui.ILayoutManagerClient#validateProperties
         */
        validateProperties(): void;
        /**
         * 验证组件的尺寸
         * @method egret.gui.ILayoutManagerClient#validateSize
         * @param recursive? {boolean}
         */
        validateSize(recursive?: boolean): void;
        /**
         * 验证子项的位置和大小，并绘制其他可视内容
         * @method egret.gui.ILayoutManagerClient#validateDisplayList
         */
        validateDisplayList(): void;
        /**
         * 在显示列表的嵌套深度
         * @member egret.gui.ILayoutManagerClient#nestLevel
         */
        nestLevel: number;
        /**
         * 是否完成初始化。此标志只能由 LayoutManager 修改。
         * @member egret.gui.ILayoutManagerClient#initialized
         */
        initialized: boolean;
        /**
         * 一个标志，用于确定某个对象是否正在等待分派其updateComplete事件。此标志只能由 LayoutManager 修改。
         * @member egret.gui.ILayoutManagerClient#updateCompletePendingFlag
         */
        updateCompletePendingFlag: boolean;
        /**
         * 父级显示对象
         * @member egret.gui.ILayoutManagerClient#parent
         */
        parent: DisplayObjectContainer;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IPopUpManager
     * @interface
     * @classdesc
     * 窗口弹出管理器接口。若项目需要自定义弹出框管理器，请实现此接口
     */
    interface IPopUpManager extends IEventDispatcher {
        /**
         * 模态遮罩的填充颜色
         * @member egret.gui.IPopUpManager#modalColor
         */
        modalColor: number;
        /**
         * 模态遮罩的透明度
         * @member egret.gui.IPopUpManager#modalAlpha
         */
        modalAlpha: number;
        /**
         * 弹出一个窗口。<br/>
         * @method egret.gui.IPopUpManager#addPopUp
         * @param popUp {IVisualElement} 要弹出的窗口
         * @param modal? {boolean} 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
         * @param center? {boolean} 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
         */
        addPopUp(popUp: IVisualElement, modal?: boolean, center?: boolean): void;
        /**
         * 移除由addPopUp()方法弹出的窗口。
         * @method egret.gui.IPopUpManager#removePopUp
         * @param popUp {IVisualElement} 要移除的窗口
         */
        removePopUp(popUp: IVisualElement): void;
        /**
         * 将指定窗口居中显示
         * @method egret.gui.IPopUpManager#centerPopUp
         * @param popUp {IVisualElement} 要居中显示的窗口
         */
        centerPopUp(popUp: IVisualElement): void;
        /**
         * 将指定窗口的层级调至最前
         * @method egret.gui.IPopUpManager#bringToFront
         * @param popUp {IVisualElement} 要最前显示的窗口
         */
        bringToFront(popUp: IVisualElement): void;
        /**
         * 已经弹出的窗口列表
         * @member egret.gui.IPopUpManager#popUpList
         */
        popUpList: Array<any>;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.LayoutManager
     * @classdesc
     * 布局管理器
     * @extends egret.EventDispatcher
     */
    class LayoutManager extends EventDispatcher {
        /**
         * @method egret.gui.LayoutManager#constructor
         */
        constructor();
        private targetLevel;
        /**
         * 需要抛出组件初始化完成事件的对象
         */
        private updateCompleteQueue;
        private invalidatePropertiesFlag;
        private invalidateClientPropertiesFlag;
        private invalidatePropertiesQueue;
        /**
         * 标记组件提交过属性
         * @method egret.gui.LayoutManager#invalidateProperties
         * @param client {ILayoutManagerClient}
         */
        invalidateProperties(client: ILayoutManagerClient): void;
        /**
         * 使提交的属性生效
         */
        private validateProperties();
        private invalidateSizeFlag;
        private invalidateClientSizeFlag;
        private invalidateSizeQueue;
        /**
         * 标记需要重新测量尺寸
         * @method egret.gui.LayoutManager#invalidateSize
         * @param client {ILayoutManagerClient}
         */
        invalidateSize(client: ILayoutManagerClient): void;
        /**
         * 测量属性
         */
        private validateSize();
        private invalidateDisplayListFlag;
        private invalidateDisplayListQueue;
        /**
         * 标记需要重新测量尺寸
         * @method egret.gui.LayoutManager#invalidateDisplayList
         * @param client {ILayoutManagerClient}
         */
        invalidateDisplayList(client: ILayoutManagerClient): void;
        /**
         * 测量属性
         */
        private validateDisplayList();
        /**
         * 是否已经添加了事件监听
         */
        private listenersAttached;
        /**
         * 添加事件监听
         */
        private attachListeners();
        /**
         * 执行属性应用
         */
        private doPhasedInstantiationCallBack(event?);
        private doPhasedInstantiation();
        /**
         * 立即应用所有延迟的属性
         * @method egret.gui.LayoutManager#validateNow
         */
        validateNow(): void;
        /**
         * 使大于等于指定组件层级的元素立即应用属性
         * @method egret.gui.LayoutManager#validateClient
         * @param target {ILayoutManagerClient} 要立即应用属性的组件
         * @param skipDisplayList {boolean} 是否跳过更新显示列表阶段
         */
        validateClient(target: ILayoutManagerClient, skipDisplayList?: boolean): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.PopUpManager
     * @classdesc
     * 窗口弹出管理器<p/>
     * 若项目需要自定义弹出框管理器，请实现IPopUpManager接口
     */
    class PopUpManager {
        /**
         * 构造函数
         * @method egret.gui.PopUpManager#constructor
         */
        constructor();
        private static _impl;
        /**
         * 获取单例
         */
        private static getImpl();
        /**
         * 模态遮罩的填充颜色
         * @member egret.gui.PopUpManager#modalColor
         */
        static modalColor: number;
        /**
         * 模态遮罩的透明度
         * @member egret.gui.PopUpManager#modalAlpha
         */
        static modalAlpha: number;
        /**
         * 弹出一个窗口。<br/>
         * @method egret.gui.PopUpManager.addPopUp
         * @param popUp {IVisualElement} 要弹出的窗口
         * @param modal {boolean} 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
         * @param center {boolean} 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
         */
        static addPopUp(popUp: IVisualElement, modal?: boolean, center?: boolean): void;
        /**
         * 移除由addPopUp()方法弹出的窗口。
         * @method egret.gui.PopUpManager.removePopUp
         * @param popUp {IVisualElement} 要移除的窗口
         */
        static removePopUp(popUp: IVisualElement): void;
        /**
         * 将指定窗口居中显示
         * @method egret.gui.PopUpManager.centerPopUp
         * @param popUp {IVisualElement} 要居中显示的窗口
         */
        static centerPopUp(popUp: IVisualElement): void;
        /**
         * 将指定窗口的层级调至最前
         * @method egret.gui.PopUpManager.bringToFront
         * @param popUp {IVisualElement} 要最前显示的窗口
         */
        static bringToFront(popUp: IVisualElement): void;
        /**
         * 已经弹出的窗口列表
         * @member egret.gui.PopUpManager.popUpList
         */
        static popUpList: Array<any>;
        /**
         * 添加事件监听,参考PopUpEvent定义的常量。
         * @method egret.gui.PopUpManager.addEventListener
         * @param type {string}
         * @param listener {Function}
         * @param thisObject {any}
         * @param useCapture {boolean}
         * @param priority {number}
         */
        static addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void;
        /**
         * 移除事件监听,参考PopUpEvent定义的常量。
         * @method egret.gui.PopUpManager.removeEventListener
         * @param type {string}
         * @param listener {Function}
         * @param thisObject {any}
         * @param useCapture {boolean}
         */
        static removeEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.PopUpManagerImpl
     * @classdesc
     * 窗口弹出管理器实现类
     * @extends egret.EventDispatcher
     * @implements egret.gui.IPopUpManager
     */
    class PopUpManagerImpl extends EventDispatcher implements IPopUpManager {
        /**
         * 构造函数
         * @method egret.gui.PopUpManagerImpl#constructor
         */
        constructor();
        private _popUpList;
        /**
         * 已经弹出的窗口列表
         * @member egret.gui.PopUpManagerImpl#popUpList
         */
        popUpList: Array<any>;
        /**
         * 模态窗口列表
         */
        private popUpDataList;
        /**
         * 根据popUp获取对应的popUpData
         */
        private findPopUpData(popUp);
        private static REMOVE_FROM_UISTAGE;
        /**
         * 弹出一个窗口。<br/>
         * @method egret.gui.PopUpManagerImpl#addPopUp
         * @param popUp {IVisualElement} 要弹出的窗口
         * @param modal {boolean} 是否启用模态。即禁用弹出窗口所在层以下的鼠标事件。默认false。
         * @param center {boolean} 是否居中窗口。等效于在外部调用centerPopUp()来居中。默认true。
         */
        addPopUp(popUp: IVisualElement, modal?: boolean, center?: boolean): void;
        /**
         * 从舞台移除
         */
        private onRemoved(event);
        private _modalColor;
        /**
         * 模态遮罩的填充颜色
         * @member egret.gui.PopUpManagerImpl#modalColor
         */
        modalColor: number;
        private _modalAlpha;
        /**
         * 模态遮罩的透明度
         * @member egret.gui.PopUpManagerImpl#modalAlpha
         */
        modalAlpha: number;
        private invalidateModalFlag;
        /**
         * 标记一个UIStage的模态层失效
         */
        private invalidateModal();
        private validateModal(event);
        private modalMask;
        /**
         * 更新窗口模态效果
         */
        private updateModal(uiStage);
        /**
         * 移除由addPopUp()方法弹出的窗口。
         * @method egret.gui.PopUpManagerImpl#removePopUp
         * @param popUp {IVisualElement} 要移除的窗口
         */
        removePopUp(popUp: IVisualElement): void;
        /**
         * 将指定窗口居中显示
         * @method egret.gui.PopUpManagerImpl#centerPopUp
         * @param popUp {IVisualElement} 要居中显示的窗口
         */
        centerPopUp(popUp: IVisualElement): void;
        /**
         * 将指定窗口的层级调至最前
         * @method egret.gui.PopUpManagerImpl#bringToFront
         * @param popUp {IVisualElement} 要最前显示的窗口
         */
        bringToFront(popUp: IVisualElement): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.DepthQueue
     * @classdesc
     * 显示列表嵌套深度排序队列
     */
    class DepthQueue {
        /**
         * @method egret.gui.DepthQueue#constructor
         */
        constructor();
        /**
         * 深度队列
         */
        private depthBins;
        /**
         * 最小深度
         */
        private minDepth;
        /**
         * 最大深度
         */
        private maxDepth;
        /**
         * 插入一个元素
         * @method egret.gui.DepthQueue#insert
         * @param client {ILayoutManagerClient}
         */
        insert(client: ILayoutManagerClient): void;
        /**
         * 从队列尾弹出深度最大的一个对象
         * @method egret.gui.DepthQueue#pop
         * @returns {ILayoutManagerClient}
         */
        pop(): ILayoutManagerClient;
        /**
         * 从队列首弹出深度最小的一个对象
         * @method egret.gui.DepthQueue#shift
         * @returns {ILayoutManagerClient}
         */
        shift(): ILayoutManagerClient;
        /**
         * 移除大于等于指定组件层级的元素中最大的元素
         * @method egret.gui.DepthQueue#removeLargestChild
         * @param client {ILayoutManagerClient}
         * @returns {any}
         */
        removeLargestChild(client: ILayoutManagerClient): any;
        /**
         * 移除大于等于指定组件层级的元素中最小的元素
         * @method egret.gui.DepthQueue#removeSmallestChild
         * @param client {ILayoutManagerClient}
         * @returns {any}
         */
        removeSmallestChild(client: ILayoutManagerClient): any;
        /**
         * 移除一个元素
         * @method egret.gui.DepthQueue#remove
         * @param client {ILayoutManagerClient}
         * @param level {number}
         * @returns {ILayoutManagerClient}
         */
        remove(client: ILayoutManagerClient, level?: number): ILayoutManagerClient;
        /**
         * 清空队列
         * @method egret.gui.DepthQueue#removeAll
         */
        removeAll(): void;
        /**
         * 队列是否为空
         * @method egret.gui.DepthQueue#isEmpty
         * @returns {boolean}
         */
        isEmpty(): boolean;
    }
    /**
     * 列表项
     */
    class DepthBin {
        length: number;
        items: any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.OverrideBase
     * @classdesc
     * OverrideBase 类是视图状态所用的 override 类的基类。
     * @extends egret.HashObject
     * @implements egret.gui.IOverride
     */
    class OverrideBase extends HashObject implements IOverride {
        constructor();
        initialize(parent: IStateClient): void;
        apply(parent: IContainer): void;
        remove(parent: IContainer): void;
        /**
         * 从对象初始化，这是一个便利方法
         * @method egret.gui.OverrideBase#initializeFromObject
         * @param properties {any}
         * @returns {any}
         */
        initializeFromObject(properties: any): any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.AddItems
     * @classdesc
     * 添加显示元素
     * @extends egret.gui.OverrideBase
     */
    class AddItems extends OverrideBase {
        /**
         * 添加父级容器的底层
         * @constant egret.gui.AddItems.FIRST
         */
        static FIRST: string;
        /**
         * 添加在父级容器的顶层
         * @constant egret.gui.AddItems.LAST
         */
        static LAST: string;
        /**
         * 添加在相对对象之前
         * @constant egret.gui.AddItems.BEFORE
         */
        static BEFORE: string;
        /**
         * 添加在相对对象之后
         * @constant egret.gui.AddItems.AFTER
         */
        static AFTER: string;
        /**
         * 构造函数
         * @method egret.gui.AddItems#constructor
         */
        constructor(target: string, propertyName: string, position: string, relativeTo: string);
        /**
         * 要添加到的属性
         * @member egret.gui.AddItems#propertyName
         */
        propertyName: string;
        /**
         * 添加的位置
         * @member egret.gui.AddItems#position
         */
        position: string;
        /**
         * 相对的显示元素的实例名
         * @member egret.gui.AddItems#relativeTo
         */
        relativeTo: string;
        /**
         * 目标实例名
         * @member egret.gui.AddItems#target
         */
        target: string;
        /**
         * @method egret.gui.AddItems#initialize
         * @param parent {IStateClient}
         */
        initialize(parent: IStateClient): void;
        /**
         * @method egret.gui.AddItems#apply
         * @param parent {IContainer}
         */
        apply(parent: IContainer): void;
        /**
         * @method egret.gui.AddItems#remove
         * @param parent {IContainer}
         */
        remove(parent: IContainer): void;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.IOverride
     * @interface
     * @classdesc
     * IOverride 接口用于视图状态覆盖。State 类 overrides 属性数组中的所有条目均必须实现此接口。
     */
    interface IOverride {
        /**
         * 初始化覆盖。在第一次调用 apply() 方法之前调用此方法，因此将覆盖的一次性初始化代码放在此方法中。
         * @method egret.gui.IOverride#initialize
         * @param parent {IStateClient}
         */
        initialize(parent: IStateClient): void;
        /**
         * 应用覆盖。将保留原始值，以便以后可以在 remove() 方法中恢复该值。
         * @method egret.gui.IOverride#apply
         * @param parent {IContainer}
         */
        apply(parent: IContainer): void;
        /**
         * 删除覆盖。在 apply() 方法中记住的值将被恢复。
         * @method egret.gui.IOverride#remove
         * @param parent {IContainer}
         */
        remove(parent: IContainer): void;
    }
}
declare module egret.gui {
    class InterruptionBehavior {
        /**
         * 指定一个过渡（可中断另一个正在运行的过渡）在开始之前结束另一个过渡。
         * 通过对过渡中的所有效果调用 end() 方法来结束过渡。end() 方法导致所有效果到达结束状态。
         */
        static END: string;
        /**
         * 指定一个过渡（可中断另一个正在运行的过渡）在开始之前停止正在进行的其它过渡。
         * 通过对过渡中的所有效果调用 stop() 方法来停止过渡。
         */
        static STOP: string;
        constructor();
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.SetProperty
     * @classdesc
     * 设置属性
     * @extends egret.gui.OverrideBase
     */
    class SetProperty extends OverrideBase {
        /**
         * 构造函数
         * @method egret.gui.SetProperty#constructor
         */
        constructor(target: string, name: string, value: any);
        /**
         * 要修改的属性名
         * @member egret.gui.SetProperty#name
         */
        name: string;
        /**
         * 目标实例名
         * @member egret.gui.SetProperty#target
         */
        target: string;
        /**
         * 属性值
         * @member egret.gui.SetProperty#value
         */
        value: any;
        /**
         * 旧的属性值
         */
        private oldValue;
        /**
         * @method egret.gui.SetProperty#apply
         * @param parent {IContainer}
         */
        apply(parent: IContainer): void;
        /**
         * @method egret.gui.SetProperty#remove
         * @param parent {IContainer}
         */
        remove(parent: IContainer): void;
        /**
         * 设置属性值
         */
        private setPropertyValue(obj, name, value, valueForType);
        /**
         * 转成Boolean值
         */
        private toBoolean(value);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.SetStyle
     * @classdesc
     * 设置属性
     * @extends egret.gui.OverrideBase
     * @private
     */
    class SetStyle extends OverrideBase {
        /**
         * 构造函数
         * @method egret.gui.SetStyle#constructor
         */
        constructor(target: string, name: string, value: any);
        /**
         * 要修改的属性名
         * @member egret.gui.SetStyle#name
         */
        name: string;
        /**
         * 目标实例名
         * @member egret.gui.SetStyle#target
         */
        target: string;
        /**
         * 属性值
         * @member egret.gui.SetStyle#value
         */
        value: any;
        /**
         * 旧的属性值
         */
        private oldValue;
        /**
         * @method egret.gui.SetStyle#apply
         * @param parent {IContainer}
         */
        apply(parent: IContainer): void;
        /**
         * @method egret.gui.SetStyle#remove
         * @param parent {IContainer}
         */
        remove(parent: IContainer): void;
        /**
         * 设置属性值
         */
        private setStyleValue(obj, name, value, valueForType);
        /**
         * 转成Boolean值
         */
        private toBoolean(value);
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.State
     * @classdesc
     * State 类定义视图状态，即组件的特定视图。
     * @extends egret.HashObject
     */
    class State extends HashObject {
        /**
         * @method egret.gui.State#constructor
         * @param properties {any}
         */
        constructor(name: string, overrides: Array<IOverride>);
        /**
         * 已经初始化标志
         */
        private initialized;
        /**
         * 视图状态的名称。给定组件的状态名称必须唯一。必须设置此属性。
         * @member egret.gui.State#name
         */
        name: string;
        /**
         * 该视图状态的覆盖，表现为实现 IOverride 接口的对象的数组。
         * 这些覆盖在进入状态时按顺序应用，在退出状态时按相反的顺序删除。
         * @member egret.gui.State#overrides
         */
        overrides: Array<IOverride>;
        /**
         * 此视图状态作为 String 数组所属的状态组。
         * @member egret.gui.State#stateGroups
         */
        stateGroups: Array<any>;
        /**
         * 初始化视图
         * @method egret.gui.State#initialize
         * @param parent {IStateClient}
         */
        initialize(parent: IStateClient): void;
    }
}
declare module egret.gui {
    class Transition {
        constructor();
        /**
         * 应用过渡时要播放的 IEffect 对象。通常，它是一个包含多个效果的复合效果对象（如 Parallel 或 Sequence 效果）。
         */
        effect: IEffect;
        /**
         * 该字符串指定在应用过渡时要从中进行更改的视图状态。默认值为“*”，表示任何视图状态。
         * <p>可以将该属性设置为空字符串“”，它对应于基本视图状态。</p>
         */
        fromState: string;
        /**
         *  该字符串指定在应用过渡时要更改到的视图状态。默认值为“*”，表示任何视图状态。
         *
         *  <p>可以将该属性设置为空字符串“”，它对应于基本视图状态。</p>
         */
        toState: string;
        /**
         * 设置为 true 以指定该过渡应用于正向和逆向视图状态更改。
         * 因此，对于从视图状态 A 到视图状态 B 的更改以及从视图状态 B 到视图状态 A 的更改，使用该过渡。
         */
        autoReverse: boolean;
        /**
         * 该属性控制当前过渡中断时的行为方式。 InterruptionBehavior 类定义此属性的可能值。
         * 默认值为end
         */
        interruptionBehavior: string;
    }
}
declare module egret.gui {
    /**
     * @language en_US
     * Conduct mapping injection with class definition as the value.
     * @param whenAskedFor {any} whenAskedFor passes class definition or fully qualified name of the class as the key to map.
     * @param instantiateClass {any} adapterClass passes the class as a value to be mapped, and its constructor function must be empty.
     * @param named {string} named optional parameters, when the same class as the key needs to be mapped multiple rules, you can pass this parameter to distinguish between different maps.
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 以类定义为值进行映射注入。
     * @param whenAskedFor {any} whenAskedFor 传递类定义或类完全限定名作为需要映射的键。
     * @param instantiateClass {any} adapterClass 传递类作为需要映射的值，它的构造函数必须为空。
     * @param named {string} named 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。
     * @version Egret 2.4
     * @platform Web,Native
     */
    function mapClass(whenAskedFor: any, instantiateClass: any, named?: string): void;
    /**
     * @private
     * @param type
     * @returns {any}
     */
    function $getAdapter(whenAskedFor: string, named?: string): any;
    /**
     * @language en_US
     * Instance of values is mapped to the injection.
     * @method egret.Injector.mapValue
     * @param whenAskedFor {any} Fully qualified name of the class passed the class definition or needs to be mapped as a key.
     * @param useValue {any} Passing object instance as a value to be mapped.
     * @param named {string} named optional parameters, when the same class as the key needs to be mapped multiple rules, you can pass this parameter to distinguish between different maps.
     */
    /**
     * @language zh_CN
     * 以实例为值进行映射注入.
     * @method egret.Injector.mapValue
     * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
     * @param useValue {any} 传递对象实例作为需要映射的值。
     * @param named {string} named 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。
     */
    function mapValue(whenAskedFor: any, useValue: any, named?: string): void;
    /**
     * @language en_US
     * Injector
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    /**
     * @language zh_CN
     * 注入器
     * @version Egret 2.4
     * @platform Web,Native
     * @private
     */
    class Adapter {
        /**
         * @private
         * 储存类的映射规则
         */
        private mapClassDic;
        mapClass(whenAskedFor: any, instantiateClass: any, named?: string): void;
        /**
         * @private
         * 获取完全限定类名
         */
        private getKey(hostComponentKey);
        /**
         * @private
         */
        private mapValueDic;
        /**
         * 以实例为值进行映射注入,当用getInstance()请求单例时始终返回注入的这个实例。
         * @method egret.Injector.mapValue
         * @param whenAskedFor {any} 传递类定义或类的完全限定名作为需要映射的键。
         * @param useValue {any} 传递对象实例作为需要映射的值。
         * @param named {string} 可选参数，在同一个类作为键需要映射多条规则时，可以传入此参数区分不同的映射。在调用getInstance()方法时要传入同样的参数。
         */
        mapValue(whenAskedFor: any, useValue: any, named?: string): void;
        /**
         * @language en_US
         * Get a singleton mapped by the specified class. Note: This method always returns a globally unique instance, and will not create repeatedly.
         * @param clazz {any} Class definition or fully qualified name of the class
         * @param named {string} Optional. If this value is set when calling mapClass () mapping, the same character string needs to be import ed in order to obtain the corresponding singleton
         * @returns {any} Get a singleton mapped by the specified class
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取指定类映射的单例，注意:这个方法总是返回全局唯一的实例，不会重复创建。
         * @param clazz {any} 类定义或类的完全限定名
         * @param named {string} 可选参数，若在调用mapClass()映射时设置了这个值，则要传入同样的字符串才能获取对应的单例
         * @returns {any} 获取指定类映射的单例
         * @version Egret 2.4
         * @platform Web,Native
         */
        getInstance(clazz: any, named?: string): any;
    }
}
declare module egret.gui {
    /**
     * @class egret.gui.LayoutUtil
     * @classdesc
     * 布局工具类
     */
    class LayoutUtil {
        /**
         * 根据对象当前的xy坐标调整其相对位置属性，使其在下一次的父级布局中过程中保持当前位置不变。
         * @method egret.gui.LayoutUtil.adjustRelativeByXY
         * @param element {IVisualElement} 要调整相对位置属性的对象
         * @param parent {DisplayObjectContainer} element的父级容器。若不设置，则取element.parent的值。若两者的值都为空，则放弃调整。
         */
        static adjustRelativeByXY(element: IVisualElement, parent?: DisplayObjectContainer): void;
    }
}
declare module egret.gui {
    /**
     * 返回字符串所对应的全局唯一Rectangle对象。此方法主要为了减少scale9Grid属性的实例个数。
     * 参数的相同的九宫格数据使用此方法可以全局共享同一个Rectangle对象。
     * @param value {string} 以字符串形式表示Rectangle构造函数的四个参数:x，y，width，height。例如："7,7,46,46"。
     * @returns {string} 字符串对应的Rectangle实例。
     */
    function getScale9Grid(value: string): Rectangle;
}
declare module egret.gui {
    /**
     * 设置键值对的简便方法。此方法仅供exmlc编译器内部使用。
     */
    function setProperties(target: any, keys: Array<string>, values: Array<string>): any;
}
