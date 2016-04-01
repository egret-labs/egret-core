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
     * @private
     */
    const enum Keys {
        explicitWidth,
        explicitHeight,
    }

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
    export class UIComponent extends DisplayObjectContainer implements IUIComponent,ILayoutManagerClient,ILayoutElement,
        IInvalidating,IVisualElement,IStyleClient {

        public _UIC_Props_:UIComponentProperties;

        /**
         * 构造函数
         * @method egret.gui.UIComponent#constructor
         */
        public constructor() {
            super();
            this._UIC_Props_ = new egret.gui.UIComponentProperties();
            this.touchEnabled = true;
            this.addEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(Event.ADDED_TO_STAGE, this.checkInvalidateFlag, this);
            if (UIComponent.prototypeCanSet === undefined) {
                var chain:any = {};
                UIComponent.prototypeCanSet = (chain.__proto__ !== undefined);
            }
            //this.$renderRegion = new sys.Region();
        }

        /**
         * __proto__属性是否可以设置的标志，兼容IE9，IE10。
         */
        private static prototypeCanSet:boolean = undefined;

        /**
         * 添加到舞台
         */
        private onAddedToStage(e:Event):void {
            this.removeEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this._initialize();
            UIGlobals._initlize(this.stage);
            if (this._UIC_Props_._nestLevel > 0)
                this.checkInvalidateFlag();
        }

        /**
         * 组件 ID。此值将作为对象的实例名称，因此不应包含任何空格或特殊字符。应用程序中的每个组件都应具有唯一的 ID。
         * @constant egret.gui.UIComponent#id
         */
        public get id():string {
            return this._UIC_Props_._id;
        }

        public set id(value:string) {
            this._UIC_Props_._id = value;
        }

        /**
         * @member egret.gui.UIComponent#isPopUp
         */
        public get isPopUp():boolean {
            return this._UIC_Props_._isPopUp;
        }

        public set isPopUp(value:boolean) {
            this._UIC_Props_._isPopUp = value;
        }

        /**
         * @member egret.gui.UIComponent#owner
         */
        public get owner():any {
            return this._UIC_Props_._owner ? this._UIC_Props_._owner : this.parent;
        }

        /**
         * @method egret.gui.UIComponent#ownerChanged
         * @param value {any}
         */
        public ownerChanged(value:any):void {
            this._UIC_Props_._owner = value;
        }


        /**
         * @member egret.gui.UIComponent#updateCompletePendingFlag
         */
        public get updateCompletePendingFlag():boolean {
            return this._UIC_Props_._updateCompletePendingFlag;
        }

        public set updateCompletePendingFlag(value:boolean) {
            this._UIC_Props_._updateCompletePendingFlag = value;
        }


        /**
         * @member egret.gui.UIComponent#initialized
         */
        public get initialized():boolean {
            return this._UIC_Props_._initialized;
        }

        public set initialized(value:boolean) {
            if (this._UIC_Props_._initialized == value)
                return;
            this._UIC_Props_._initialized = value;
            if (value) {
                this.childrenCreated()
                UIEvent.dispatchUIEvent(this, UIEvent.CREATION_COMPLETE);
            }
        }

        /**
         * 初始化组件
         * @method egret.gui.UIComponent#_initialize
         */
        public _initialize():void {
            if (this._UIC_Props_._initializeCalled)
                return;
            if (UIGlobals.stage) {
                this.removeEventListener(Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            }
            this._UIC_Props_._initializeCalled = true;
            UIEvent.dispatchUIEvent(this, UIEvent.INITIALIZE);
            this.createChildren();
            this.invalidateProperties();
            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * 创建子项,子类覆盖此方法以完成组件子项的初始化操作，
         * 请务必调用super.createChildren()以完成父类组件的初始化
         * @method egret.gui.UIComponent#createChildren
         */
        public createChildren():void {

        }

        /**
         * 子项创建完成
         * @method egret.gui.UIComponent#childrenCreated
         */
        public childrenCreated():void {

        }


        /**
         * @member egret.gui.UIComponent#nestLevel
         */
        public get nestLevel():number {
            return this._UIC_Props_._nestLevel;
        }

        public set nestLevel(value:number) {
            if (this._UIC_Props_._nestLevel == value)
                return;
            this._UIC_Props_._nestLevel = value;

            if (this._UIC_Props_._nestLevel == 0)
                this.addEventListener(Event.ADDED_TO_STAGE, this.checkInvalidateFlag, this);
            else
                this.removeEventListener(Event.ADDED_TO_STAGE, this.checkInvalidateFlag, this);
            this._updateChildrenNestLevel();
        }

        /**
         * 更新子项的nestLevel属性
         */
        public _updateChildrenNestLevel():void {
            for (var i:number = this.numChildren - 1; i >= 0; i--) {
                var child:ILayoutManagerClient = <ILayoutManagerClient><any> (this.getChildAt(i));
                if (child && "nestLevel" in child) {
                    child.nestLevel = this._UIC_Props_._nestLevel + 1;
                }
            }
        }

        /**
         * 获取指定的名称的样式属性值
         */
        public getStyle(styleProp:string):any {
            var chain:any = this._UIC_Props_._styleProtoChain;
            if (!chain) {
                return undefined;
            }
            return chain[styleProp];
        }

        /**
         * 对此组件实例设置样式属性。在此组件上设置的样式会覆盖父级容器的同名样式。推荐在子项较少的组件上使用，尽量避免在全局调用此方法，有可能造成性能问题。
         */
        public setStyle(styleProp:string, newValue:any):void {
            var chain:any = this._UIC_Props_._styleProtoChain;
            if (!this._UIC_Props_._hasOwnStyleChain) {
                chain = this._createOwnStyleProtoChain(chain);
            }
            chain[styleProp] = newValue;
            this.styleChanged(styleProp);
            this.notifyStyleChangeInChildren(styleProp);
        }

        public styleChanged(styleProp:string):void {

        }

        /**
         * 通知子项列表样式发生改变
         */
        public notifyStyleChangeInChildren(styleProp:string):void {
            if (this._UIC_Props_._hasNoStyleChild) {
                return;
            }
            for (var i:number = this.numChildren - 1; i >= 0; i--) {
                var child:IStyleClient = <IStyleClient><any> (this.getChildAt(i));
                if (!child) {
                    continue;
                }
                if ("styleChanged" in child) {
                    child.styleChanged(styleProp);
                    child.notifyStyleChangeInChildren(styleProp);
                }
            }
        }

        public _createOwnStyleProtoChain(chain:any):any {
            this._UIC_Props_._hasOwnStyleChain = true;
            if (UIComponent.prototypeCanSet) {
                this._UIC_Props_._styleProtoChain = {};
                this._UIC_Props_._styleProtoChain.__proto__ = chain ? chain : UIComponent.emptyStyleChain;
            }
            else {
                this._UIC_Props_._styleProtoChain = this.createProtoChain(chain);
            }
            chain = this._UIC_Props_._styleProtoChain;
            if (!this._UIC_Props_._hasNoStyleChild) {
                for (var i:number = this.numChildren - 1; i >= 0; i--) {
                    var child:IStyleClient = <IStyleClient><any> (this.getChildAt(i));
                    if (child && "regenerateStyleCache" in child) {
                        child["regenerateStyleCache"](chain);
                    }
                }
            }
            return chain;
        }

        /**
         * 创建一个原型链节点
         */
        private createProtoChain(parentChain:any):any {
            function factory():void {
            };
            factory.prototype = parentChain;
            var childChain:Object = new factory();
            factory.prototype = null;
            return childChain
        }

        /**
         * 清除在此组件实例上设置过的指定样式名。
         */
        public clearStyle(styleProp:string):void {
            if (!this._UIC_Props_._hasOwnStyleChain) {
                return;
            }
            var chain:any = this._UIC_Props_._styleProtoChain;
            delete chain[styleProp];
            this.styleChanged(styleProp);
            this.notifyStyleChangeInChildren(styleProp);
        }

        private static emptyStyleChain:any = {};

        /**
         * 重新生成自身以及所有子项的原型链
         */
        public regenerateStyleCache(parentChain:any):void {
            if (!UIComponent.prototypeCanSet) {
                this.regenerateStyleCacheForIE(parentChain);
                return;
            }
            if (this._UIC_Props_._hasOwnStyleChain) {
                this._UIC_Props_._styleProtoChain.__proto__ = parentChain ? parentChain : UIComponent.emptyStyleChain;
            }
            else if (this._UIC_Props_._styleProtoChain != parentChain) {
                this._UIC_Props_._styleProtoChain = parentChain;
                for (var i:number = this.numChildren - 1; i >= 0; i--) {
                    var child:IStyleClient = <IStyleClient><any> (this.getChildAt(i));
                    if (child && "regenerateStyleCache" in child) {
                        child.regenerateStyleCache(parentChain);
                    }
                }
            }
        }

        /**
         * 兼容IE9，10的写法。
         */
        public regenerateStyleCacheForIE(parentChain:any):void {
            if (this._UIC_Props_._hasOwnStyleChain) {
                var chain:any = this._UIC_Props_._styleProtoChain;
                var childChain:any = this.createProtoChain(parentChain);
                for (var key in chain) {
                    if (chain.hasOwnProperty(key)) {
                        childChain[key] = chain[key];
                    }
                }
                this._UIC_Props_._styleProtoChain = childChain;
                parentChain = childChain;
            }
            else {
                this._UIC_Props_._styleProtoChain = parentChain;
            }
            if (!this._UIC_Props_._hasNoStyleChild) {
                for (var i:number = this.numChildren - 1; i >= 0; i--) {
                    var child:IStyleClient = <IStyleClient><any> this.getChildAt(i);
                    if (child && "regenerateStyleCacheForIE" in child) {
                        child["regenerateStyleCacheForIE"](parentChain);
                    }
                }
            }
        }


        /**
         * 添加对象到显示列表,此接口仅预留给框架内部使用
         * 如果需要管理子项，若有，请使用容器的addElement()方法，非法使用有可能造成无法自动布局。
         */
        public _addToDisplayList(child:DisplayObject, notifyListeners:boolean = true):DisplayObject {
            var index:number = this.numChildren;

            if (child.parent == this)
                index--;
            this._addingChild(child);
            this.$doAddChild(child, index, notifyListeners);
            this._childAdded(child);
            return child;
        }

        /**
         * 添加对象到显示列表,此接口仅预留给框架内部使用
         * 如果需要管理子项，若有，请使用容器的addElementAt()方法，非法使用有可能造成无法自动布局。
         */
        public _addToDisplayListAt(child:DisplayObject, index:number, notifyListeners:boolean = true):DisplayObject {
            this._addingChild(child);
            this.$doAddChild(child, index, notifyListeners);
            this._childAdded(child);
            return child;
        }

        /**
         * 添加对象到显示列表,此接口仅预留给框架内部使用
         * 如果需要管理子项，若有，请使用容器的removeElement()方法,非法使用有可能造成无法自动布局。
         */
        public _removeFromDisplayList(child:DisplayObject, notifyListeners:boolean = true):DisplayObject {
            var index = this.$children.indexOf(child);
            if (index >= 0) {
                this.$doRemoveChild(index, notifyListeners);
                this._childRemoved(child);
                return child;
            }
            else {
                egret.$error(1008);
                return null;
            }
        }

        /**
         * 从显示列表移除指定索引的子项,此接口仅预留给框架内部使用
         * 如果需要管理子项，若有，请使用容器的removeElementAt()方法,非法使用有可能造成无法自动布局。
         */
        public _removeFromDisplayListAt(index:number, notifyListeners:boolean = true):DisplayObject {
            if (index >= 0 && index < this.$children.length) {
                var child:DisplayObject = this.$doRemoveChild(index, notifyListeners);
                this._childRemoved(child);
                return child;
            }
            else {
                egret.$error(1007);
                return null;
            }
        }

        /**
         * GUI范围内，请不要调用任何addChild方法，若是容器，请用addElement,若需要包装普通显示对象，请把显示对象赋值给UIAsset.source。
         * @deprecated
         * @method egret.gui.UIComponent#addChild
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        public addChild(child:DisplayObject):DisplayObject {
            this._addingChild(child);
            super.addChild(child);
            this._childAdded(child);
            return child;
        }

        /**
         * GUI范围内，请不要调用任何addChildAt方法，若是容器，请用addElementAt,若需要包装普通显示对象，请把显示对象赋值给UIAsset.source。
         * @deprecated
         * @method egret.gui.UIComponent#addChildAt
         * @param child {DisplayObject}
         * @param index {number}
         * @returns {DisplayObject}
         */
        public addChildAt(child:DisplayObject, index:number):DisplayObject {
            this._addingChild(child);
            super.addChildAt(child, index);
            this._childAdded(child);
            return child;
        }

        /**
         * 即将添加一个子项
         */
        public _addingChild(child:DisplayObject):void {
            if (!child) {
                return;
            }
            if ("nestLevel" in child) {
                (<ILayoutManagerClient><any>child).nestLevel = this._UIC_Props_._nestLevel + 1;
            }
            if ("styleChanged" in child) {
                var chain:any = this._UIC_Props_._styleProtoChain;
                if (chain || ((<UIComponent>child)._UIC_Props_ && (<UIComponent>child)._UIC_Props_._styleProtoChain)) {
                    child["regenerateStyleCache"](chain);
                    child["styleChanged"](null);
                    child["notifyStyleChangeInChildren"](null);
                }
            }
        }

        /**
         * 已经添加一个子项
         */
        public _childAdded(child:DisplayObject):void {
            if (child instanceof UIComponent) {
                (<UIComponent><any> child)._initialize();
                (<UIComponent><any> child).checkInvalidateFlag();
            }
        }

        /**
         * GUI范围内，请不要调用任何removeChild方法，若是容器，请用removeElement
         * @deprecated
         * @method egret.gui.UIComponent#removeChild
         * @param child {DisplayObject}
         * @returns {DisplayObject}
         */
        public removeChild(child:DisplayObject):DisplayObject {
            super.removeChild(child);
            this._childRemoved(child);
            return child;
        }

        /**
         * GUI范围内，请不要调用任何removeChildAt方法，若是容器，请用removeElementAt
         * @deprecated
         * @method egret.gui.UIComponent#removeChildAt
         * @param index {number}
         * @returns {DisplayObject}
         */
        public removeChildAt(index:number):DisplayObject {
            var child:DisplayObject = super.removeChildAt(index);
            this._childRemoved(child);
            return child;
        }

        /**
         * 已经移除一个子项
         */
        public _childRemoved(child:DisplayObject):void {
            if (!child) {
                return;
            }
            if ("nestLevel" in child) {
                (<ILayoutManagerClient> <any>child).nestLevel = 0;
            }
        }

        /**
         * 检查属性失效标记并应用
         */
        private checkInvalidateFlag(event:Event = null):void {
            if (!UIGlobals._layoutManager)
                return;
            if (this._UIC_Props_._invalidatePropertiesFlag) {
                UIGlobals._layoutManager.invalidateProperties(this);
            }
            if (this._UIC_Props_._invalidateSizeFlag) {
                UIGlobals._layoutManager.invalidateSize(this);
            }
            if (this._UIC_Props_._invalidateDisplayListFlag) {
                UIGlobals._layoutManager.invalidateDisplayList(this);
            }
            if (this._UIC_Props_._validateNowFlag) {
                UIGlobals._layoutManager.validateClient(this);
                this._UIC_Props_._validateNowFlag = false;
            }
        }


        /**
         * @member egret.gui.UIComponent#enabled
         */
        public get enabled():boolean {
            return this._UIC_Props_._enabled;
        }

        public set enabled(value:boolean) {
            this._UIC_Props_._enabled = value;
        }


        /**
         * 组件宽度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
         */
        public set width(value:number) {
            this.$setWidth(value);
        }


        $setWidth(value:number):boolean {
            if (this._UIC_Props_._uiWidth == value && this.$getExplicitWidth() == value)
                return false;
            var result:boolean = super.$setWidth(value);
            if (isNaN(value))
                this.invalidateSize();
            else
                this._UIC_Props_._uiWidth = value;
            this.invalidateProperties();
            this.invalidateDisplayList();
            this.invalidateParentSizeAndDisplayList();

            return result;
        }

        /**
         * @member egret.gui.UIComponent#width
         */
        public get width():number {
            return this._UIC_Props_._uiWidth;
            //return isNaN(this.$getExplicitWidth()) ? super.$getWidth() : this._UIC_Props_._uiWidth;
        }


        /**
         * 组件高度,默认值为NaN,设置为NaN将使用组件的measure()方法自动计算尺寸
         */
        public set height(value:number) {
            this.$setHeight(value);
        }

        $setHeight(value:number):boolean {
            if (this._UIC_Props_._uiHeight == value && this.$getExplicitHeight() == value)
                return false;
            var result:boolean = super.$setHeight(value);
            if (isNaN(value))
                this.invalidateSize();
            else
                this._UIC_Props_._uiHeight = value;
            this.invalidateProperties();
            this.invalidateDisplayList();
            this.invalidateParentSizeAndDisplayList();

            return result;
        }

        /**
         * @member egret.gui.UIComponent#height
         */
        public get height():number {
            return this._UIC_Props_._uiHeight;
            //return isNaN(this.$getExplicitHeight()) ? super.$getHeight() : this._UIC_Props_._uiHeight;
        }

        $setScaleX(value:number):boolean {
            if (super.$setScaleX(value)) {
                this.invalidateParentSizeAndDisplayList();
                return true;
            }
            return false;
        }

        $setScaleY(value:number):boolean {
            if (super.$setScaleY(value)) {
                this.invalidateParentSizeAndDisplayList();
                return true;
            }
            return false
        }

        /**
         * @member egret.gui.UIComponent#minWidth
         */
        public get minWidth():number {
            return this._UIC_Props_._minWidth;
        }

        public set minWidth(value:number) {
            if (this._UIC_Props_._minWidth == value)
                return;
            this._UIC_Props_._minWidth = value;
            this.invalidateSize();
        }

        /**
         * @member egret.gui.UIComponent#maxWidth
         */
        public get maxWidth():number {
            return this._UIC_Props_._maxWidth;
        }

        public _getMaxWidth():number {
            return this._UIC_Props_._maxWidth;
        }

        public set maxWidth(value:number) {
            if (this._UIC_Props_._maxWidth == value)
                return;
            this._UIC_Props_._maxWidth = value;
            this.invalidateSize();
        }

        /**
         * @member egret.gui.UIComponent#minHeight
         */
        public get minHeight():number {
            return this._UIC_Props_._minHeight;
        }

        public set minHeight(value:number) {
            if (this._UIC_Props_._minHeight == value)
                return;
            this._UIC_Props_._minHeight = value;
            this.invalidateSize();
        }

        /**
         * @member egret.gui.UIComponent#maxHeight
         */
        public get maxHeight():number {
            return this._UIC_Props_._maxHeight;
        }

        public set maxHeight(value:number) {
            if (this._UIC_Props_._maxHeight == value)
                return;
            this._UIC_Props_._maxHeight = value;
            this.invalidateSize();
        }


        /**
         * 组件的默认宽度（以像素为单位）。此值由 measure() 方法设置。
         * @member egret.gui.UIComponent#measuredWidth
         */
        public get measuredWidth():number {
            return this._UIC_Props_._measuredWidth;
        }

        public set measuredWidth(value:number) {
            this._UIC_Props_._measuredWidth = value;
        }

        /**
         * 组件的默认高度（以像素为单位）。此值由 measure() 方法设置。
         * @member egret.gui.UIComponent#measuredHeight
         */
        public get measuredHeight():number {
            return this._UIC_Props_._measuredHeight;
        }

        public set measuredHeight(value:number) {
            this._UIC_Props_._measuredHeight = value;
        }

        /**
         * @method egret.gui.UIComponent#setActualSize
         * @param w {number}
         * @param h {number}
         */
        public setActualSize(w:number, h:number):void {
            var change:boolean = false;
            if (this._UIC_Props_._uiWidth != w) {
                this._UIC_Props_._uiWidth = w;
                change = true;
            }
            if (this._UIC_Props_._uiHeight != h) {
                this._UIC_Props_._uiHeight = h;
                change = true;
            }
            if (change) {
                this.invalidateDisplayList();
                this.dispatchResizeEvent();
            }
        }

        $setX(value:number):boolean {
            if (super.$setX(value)) {
                this.invalidateProperties();
                if (this._UIC_Props_._includeInLayout && this.parent && this.parent instanceof UIComponent)
                    (<UIComponent><any> (this.parent))._childXYChanged();
                return true;
            }

            return false;
        }

        $setY(value:number):boolean {
            if (super.$setY(value)) {
                this.invalidateProperties();
                if (this._UIC_Props_._includeInLayout && this.parent && this.parent instanceof UIComponent)
                    (<UIComponent><any> (this.parent))._childXYChanged();
                return true;
            }

            return false;
        }

        /**
         * @method egret.gui.UIComponent#invalidateProperties
         */
        public invalidateProperties():void {
            if (!this._UIC_Props_._invalidatePropertiesFlag) {
                this._UIC_Props_._invalidatePropertiesFlag = true;

                if (this.parent && UIGlobals._layoutManager)
                    UIGlobals._layoutManager.invalidateProperties(this);
            }
        }

        /**
         * @method egret.gui.UIComponent#validateProperties
         */
        public validateProperties():void {
            if (this._UIC_Props_._invalidatePropertiesFlag) {
                this.commitProperties();

                this._UIC_Props_._invalidatePropertiesFlag = false;
            }
        }


        /**
         * @method egret.gui.UIComponent#invalidateSize
         */
        public invalidateSize():void {
            if (!this._UIC_Props_._invalidateSizeFlag) {
                this._UIC_Props_._invalidateSizeFlag = true;

                if (this.parent && UIGlobals._layoutManager)
                    UIGlobals._layoutManager.invalidateSize(this);
            }
        }

        /**
         * @method egret.gui.UIComponent#validateSize
         * @param recursive {boolean}
         */
        public validateSize(recursive:boolean = false):void {
            if (recursive) {
                for (var i:number = 0; i < this.numChildren; i++) {
                    var child:DisplayObject = this.getChildAt(i);
                    if ("validateSize" in child)
                        (<ILayoutManagerClient> <any>child ).validateSize(true);
                }
            }
            if (this._UIC_Props_._invalidateSizeFlag) {
                var changed:boolean = this.measureSizes();
                if (changed) {
                    this.invalidateDisplayList();
                    this.invalidateParentSizeAndDisplayList();
                }
                this._UIC_Props_._invalidateSizeFlag = false;
            }
        }

        /**
         * 测量组件尺寸，返回尺寸是否发生变化
         */
        private measureSizes():boolean {
            var changed:boolean = false;

            if (!this._UIC_Props_._invalidateSizeFlag)
                return changed;

            if (!this.canSkipMeasurement()) {
                this.measure();
                if (this.measuredWidth < this.minWidth) {
                    this.measuredWidth = this.minWidth;
                }
                if (this.measuredWidth > this.maxWidth) {
                    this.measuredWidth = this.maxWidth;
                }
                if (this.measuredHeight < this.minHeight) {
                    this.measuredHeight = this.minHeight;
                }
                if (this.measuredHeight > this.maxHeight) {
                    this.measuredHeight = this.maxHeight
                }
            }
            if (isNaN(this._UIC_Props_._oldPreferWidth)) {
                this._UIC_Props_._oldPreferWidth = this.preferredWidth;
                this._UIC_Props_._oldPreferHeight = this.preferredHeight;
                changed = true;
            }
            else {
                if (this.preferredWidth != this._UIC_Props_._oldPreferWidth || this.preferredHeight != this._UIC_Props_._oldPreferHeight)
                    changed = true;
                this._UIC_Props_._oldPreferWidth = this.preferredWidth;
                this._UIC_Props_._oldPreferHeight = this.preferredHeight;
            }
            return changed;
        }


        /**
         * @method egret.gui.UIComponent#invalidateDisplayList
         */
        public invalidateDisplayList():void {
            if (!this._UIC_Props_._invalidateDisplayListFlag) {
                this._UIC_Props_._invalidateDisplayListFlag = true;

                if (this.parent && UIGlobals._layoutManager)
                    UIGlobals._layoutManager.invalidateDisplayList(this);

                this.$invalidateContentBounds();
            }
        }

        /**
         * @method egret.gui.UIComponent#validateDisplayList
         */
        public validateDisplayList():void {
            if (this._UIC_Props_._invalidateDisplayListFlag) {
                var unscaledWidth:number = 0;
                var unscaledHeight:number = 0;
                if (this._UIC_Props_._layoutWidthExplicitlySet) {
                    unscaledWidth = this._UIC_Props_._uiWidth;
                }
                else if (!isNaN(this.$getExplicitWidth())) {
                    unscaledWidth = this.$getExplicitWidth()
                }
                else {
                    unscaledWidth = this.measuredWidth;
                }
                if (this._UIC_Props_._layoutHeightExplicitlySet) {
                    unscaledHeight = this._UIC_Props_._uiHeight;
                }
                else if (!isNaN(this.$getExplicitHeight())) {
                    unscaledHeight = this.$getExplicitHeight();
                }
                else {
                    unscaledHeight = this.measuredHeight;
                }
                if (isNaN(unscaledWidth))
                    unscaledWidth = 0;
                if (isNaN(unscaledHeight))
                    unscaledHeight = 0;
                this.setActualSize(unscaledWidth, unscaledHeight);
                this.updateDisplayList(unscaledWidth, unscaledHeight);
                this._UIC_Props_._invalidateDisplayListFlag = false;
            }
        }


        /**
         * @method egret.gui.UIComponent#validateNow
         * @param skipDisplayList {boolean}
         */
        public validateNow(skipDisplayList:boolean = false):void {
            if (!this._UIC_Props_._validateNowFlag && UIGlobals._layoutManager != null)
                UIGlobals._layoutManager.validateClient(this, skipDisplayList);
            else
                this._UIC_Props_._validateNowFlag = true;
        }

        /**
         * 标记父级容器的尺寸和显示列表为失效
         * @method egret.gui.UIComponent#invalidateParentSizeAndDisplayList
         */
        public invalidateParentSizeAndDisplayList():void {
            if (!this.parent || !this._UIC_Props_._includeInLayout || !("invalidateSize" in this.parent))
                return;
            var p:IInvalidating = <IInvalidating><any>(this.parent);
            p.invalidateSize();
            p.invalidateDisplayList();
        }

        /**
         * 更新显示列表
         * @method egret.gui.UIComponent#updateDisplayList
         * @param unscaledWidth {number}
         * @param unscaledHeight {number}
         */
        public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void {
        }

        /**
         * 是否可以跳过测量尺寸阶段,返回true则不执行measure()方法
         */
        public canSkipMeasurement():boolean {
            return !isNaN(this.$getExplicitWidth()) && !isNaN(this.$getExplicitHeight());
        }

        /**
         * 提交属性，子类在调用完invalidateProperties()方法后，应覆盖此方法以应用属性
         */
        public commitProperties():void {
            if (this._UIC_Props_._oldWidth != this._UIC_Props_._uiWidth || this._UIC_Props_._oldHeight != this._UIC_Props_._uiHeight) {
                this.dispatchResizeEvent();
            }
            if (this._UIC_Props_._oldX != this.x || this._UIC_Props_._oldY != this.y) {
                this.dispatchMoveEvent();
            }
        }

        /**
         * 测量组件尺寸
         * @method egret.gui.UIComponent#measure
         */
        public measure():void {
            this._UIC_Props_._measuredHeight = 0;
            this._UIC_Props_._measuredWidth = 0;
        }

        /**
         *  抛出移动事件
         */
        private dispatchMoveEvent():void {
            if (this.hasEventListener(MoveEvent.MOVE)) {
                MoveEvent.dispatchMoveEvent(this, this._UIC_Props_._oldX, this._UIC_Props_._oldY);
            }
            this._UIC_Props_._oldX = this.x;
            this._UIC_Props_._oldY = this.y;
        }

        /**
         * 子项的xy位置发生改变
         */
        public _childXYChanged():void {

        }

        /**
         *  抛出尺寸改变事件
         */
        private dispatchResizeEvent():void {
            if (this.hasEventListener(ResizeEvent.RESIZE)) {
                ResizeEvent.dispatchResizeEvent(this, this._UIC_Props_._oldWidth, this._UIC_Props_._oldHeight);
            }
            this._UIC_Props_._oldWidth = this._UIC_Props_._uiWidth;
            this._UIC_Props_._oldHeight = this._UIC_Props_._uiHeight;
        }

        /**
         * @member egret.gui.UIComponent#includeInLayout
         */
        public get includeInLayout():boolean {
            return this._UIC_Props_._includeInLayout;
        }

        public set includeInLayout(value:boolean) {
            if (this._UIC_Props_._includeInLayout == value)
                return;
            this._UIC_Props_._includeInLayout = true;
            this.invalidateParentSizeAndDisplayList();
            this._UIC_Props_._includeInLayout = value;
        }


        /**
         * @member egret.gui.UIComponent#left
         */
        public get left():number {
            return this._UIC_Props_._left;
        }

        public set left(value:number) {
            if (this._UIC_Props_._left == value)
                return;
            this._UIC_Props_._left = value;
            this.invalidateParentSizeAndDisplayList();
        }

        /**
         * @member egret.gui.UIComponent#right
         */
        public get right():number {
            return this._UIC_Props_._right;
        }

        public set right(value:number) {
            if (this._UIC_Props_._right == value)
                return;
            this._UIC_Props_._right = value;
            this.invalidateParentSizeAndDisplayList();
        }

        /**
         * @member egret.gui.UIComponent#top
         */
        public get top():number {
            return this._UIC_Props_._top;
        }

        public set top(value:number) {
            if (this._UIC_Props_._top == value)
                return;
            this._UIC_Props_._top = value;
            this.invalidateParentSizeAndDisplayList();
        }

        /**
         * @member egret.gui.UIComponent#bottom
         */
        public get bottom():number {
            return this._UIC_Props_._bottom;
        }

        public set bottom(value:number) {
            if (this._UIC_Props_._bottom == value)
                return;
            this._UIC_Props_._bottom = value;
            this.invalidateParentSizeAndDisplayList();
        }


        /**
         * @member egret.gui.UIComponent#horizontalCenter
         */
        public get horizontalCenter():number {
            return this._UIC_Props_._horizontalCenter;
        }

        public set horizontalCenter(value:number) {
            if (this._UIC_Props_._horizontalCenter == value)
                return;
            this._UIC_Props_._horizontalCenter = value;
            this.invalidateParentSizeAndDisplayList();
        }

        /**
         * @member egret.gui.UIComponent#verticalCenter
         */
        public get verticalCenter():number {
            return this._UIC_Props_._verticalCenter;
        }

        public set verticalCenter(value:number) {
            if (this._UIC_Props_._verticalCenter == value)
                return;
            this._UIC_Props_._verticalCenter = value;
            this.invalidateParentSizeAndDisplayList();
        }


        /**
         * @member egret.gui.UIComponent#percentWidth
         */
        public get percentWidth():number {
            return this._UIC_Props_._percentWidth;
        }

        public set percentWidth(value:number) {
            if (this._UIC_Props_._percentWidth == value)
                return;
            this._UIC_Props_._percentWidth = value;
            this.invalidateParentSizeAndDisplayList();
        }


        /**
         * @member egret.gui.UIComponent#percentHeight
         */
        public get percentHeight():number {
            return this._UIC_Props_._percentHeight;
        }

        public set percentHeight(value:number) {
            if (this._UIC_Props_._percentHeight == value)
                return;
            this._UIC_Props_._percentHeight = value;
            this.invalidateParentSizeAndDisplayList();
        }

        /**
         * @method egret.gui.UIComponent#setLayoutBoundsSize
         * @param layoutWidth {number}
         * @param layoutHeight {number}
         */
        public setLayoutBoundsSize(layoutWidth:number, layoutHeight:number):void {
            if (isNaN(layoutWidth)) {
                this._UIC_Props_._layoutWidthExplicitlySet = false;
                layoutWidth = this.preferredWidth;
            }
            else {
                this._UIC_Props_._layoutWidthExplicitlySet = true;
            }
            if (isNaN(layoutHeight)) {
                this._UIC_Props_._layoutHeightExplicitlySet = false;
                layoutHeight = this.preferredHeight;
            }
            else {
                this._UIC_Props_._layoutHeightExplicitlySet = true;
            }

            this.setActualSize(layoutWidth / this.$getScaleX(), layoutHeight / this.$getScaleY());
        }

        /**
         * @method egret.gui.UIComponent#setLayoutBoundsPosition
         * @param x {number}
         * @param y {number}
         */
        public setLayoutBoundsPosition(x:number, y:number):void {
            if (this.$getScaleX() < 0) {
                x += this.layoutBoundsWidth;
            }
            if (this.$getScaleY() < 0) {
                y += this.layoutBoundsHeight;
            }
            var changed:boolean = false;
            if (this.$getX() != x) {
                this.$setX(x);
                changed = true;
            }
            if (this.$getY() != y) {
                this.$setY(y);
                changed = true;
            }
            if (changed) {
                this.dispatchMoveEvent();
            }
        }

        /**
         * @member egret.gui.UIComponent#preferredWidth
         */
        public get preferredWidth():number {
            var w:number = !isNaN(this.$getExplicitWidth()) ? this.$getExplicitWidth() : this._UIC_Props_._measuredWidth;
            var scaleX:number = this.$getScaleX();
            if (scaleX < 0) {
                scaleX = -scaleX;
            }
            return w * scaleX;
        }

        /**
         * @member egret.gui.UIComponent#preferredHeight
         */
        public get preferredHeight():number {
            var h:number = !isNaN(this.$getExplicitHeight()) ? this.$getExplicitHeight() : this._UIC_Props_._measuredHeight;
            var scaleY:number = this.$getScaleY();
            if (scaleY < 0) {
                scaleY = -scaleY;
            }
            return h * scaleY;
        }

        /**
         * @member egret.gui.UIComponent#preferredX
         */
        public get preferredX():number {
            if (this.$getScaleX() >= 0) {
                return this.$getX();
            }
            var w:number = this.preferredWidth;
            return this.$getX() - w;
        }

        /**
         * @member egret.gui.UIComponent#preferredY
         */
        public get preferredY():number {
            if (this.$getScaleY() >= 0) {
                return this.$getY();
            }
            var h:number = this.preferredHeight;
            return this.$getY() - h;
        }

        /**
         * @member egret.gui.UIComponent#layoutBoundsX
         */
        public get layoutBoundsX():number {
            if (this.$getScaleX() >= 0) {
                return this.$getX();
            }
            var w:number = this.layoutBoundsWidth;
            return this.$getX() - w;
        }

        /**
         * @member egret.gui.UIComponent#layoutBoundsY
         */
        public get layoutBoundsY():number {
            if (this.$getScaleY() >= 0) {
                return this.$getY();
            }
            var h:number = this.layoutBoundsHeight;
            return this.$getY() - h;
        }

        /**
         * @member egret.gui.UIComponent#layoutBoundsWidth
         */
        public get layoutBoundsWidth():number {
            var w:number = 0;
            if (this._UIC_Props_._layoutWidthExplicitlySet) {
                w = this._UIC_Props_._uiWidth;
            }
            else if (!isNaN(w = this.$getExplicitWidth())) {
            }
            else {
                w = this._UIC_Props_._measuredWidth;
            }
            var scaleX:number = this.$getScaleX();
            if (scaleX < 0) {
                scaleX = -scaleX;
            }
            return w * scaleX;
        }

        /**
         * 组件的布局高度,常用于父级的updateDisplayList()方法中
         * 按照：布局高度>外部显式设置高度>测量高度 的优先级顺序返回高度
         * @member egret.gui.UIComponent#layoutBoundsHeight
         */
        public get layoutBoundsHeight():number {
            var h:number = 0;
            if (this._UIC_Props_._layoutHeightExplicitlySet) {
                h = this._UIC_Props_._uiHeight;
            }
            else if (!isNaN(h = this.$getExplicitHeight())) {
            }
            else {
                h = this._UIC_Props_._measuredHeight;
            }
            var scaleY:number = this.$getScaleY();
            if (scaleY < 0) {
                scaleY = -scaleY;
            }
            return h * scaleY;
        }
    }
}