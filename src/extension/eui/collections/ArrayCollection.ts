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

/// <reference path="../utils/registerproperty.ts" />
/// <reference path="../utils/registerbindable.ts" />

module eui {

    /**
     * @language en_US
     * The ArrayCollection class is a wrapper class that exposes an <code>any[]</code> as a collection that can be
     * accessed and manipulated using the methods and properties of the <code>ICollection</code> interfaces.
     * ArrayCollection can notify the view to update item when data source changed.
     *
     * @event eui.CollectionEvent.COLLECTION_CHANGE Dispatched when the ArrayCollection has been updated in some way.
     *
     * @defaultProperty source
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/collections/ArrayCollectionExample.ts
     */
    /**
     * @language zh_CN
     * ArrayCollection 类是数组的集合类数据结构包装器，可使用<code>ICollection</code>接口的方法和属性对其进行访问和处理。
     * 使用这种数据结构包装普通数组，能在数据源发生改变的时候主动通知视图刷新变更数据项。
     *
     * @event eui.CollectionEvent.COLLECTION_CHANGE 当 ArrayCollection 更新的的时候会派发此事件。
     *
     * @defaultProperty source
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     * @includeExample extension/eui/collections/ArrayCollectionExample.ts
     */
    export class ArrayCollection extends egret.EventDispatcher implements ICollection {
        /**
         * @language en_US
         * Constructor. <p/>
         * Creates a new ArrayCollection using the specified source array.
         * If no array is specified an empty array will be used.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 构造函数。<p/>
         * 用指定的原始数组创建一个 ArrayCollection 实例。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public constructor(source?:any[]) {
            super();
            if (source) {
                this._source = source;
            }
            else {
                this._source = [];
            }
        }

        /**
         * @private
         */
        private _source:any[];
        /**
         * @language en_US
         * The source of data in the ArrayCollection.
         * The ArrayCollection object does not represent any changes that you make
         * directly to the source array. Always use the ICollection methods to view the collection.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 数据源
         * 通常情况下请不要直接调用Array的方法操作数据源，否则对应的视图无法收到数据改变的通知。通常都是通过ICollection的接口方法来查看数据。
         * 若对数据源进行了修改，请手动调用refresh()方法刷新数据。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get source():any[] {
            return this._source;
        }

        public set source(value:any[]) {
            if (!value)
                value = [];
            this._source = value;
            this.dispatchCoEvent(CollectionEventKind.RESET);
        }

        /**
         * @language en_US
         * Applies the sort and filter to the view.
         * The ArrayCollection does not detect source data changes automatically,
         * so you must call the <code>refresh()</code>
         * method to update the view after changing the source data.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在对数据源进行排序或过滤操作后可以手动调用此方法刷新所有数据,以更新视图。
         * ArrayCollection 不会自动检原始数据进行了改变,所以你必须调用<code>refresh()</code>方法去更新显示。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public refresh():void {
            this.dispatchCoEvent(CollectionEventKind.REFRESH);
        }

        //--------------------------------------------------------------------------
        //
        // ICollection接口实现方法
        //
        //--------------------------------------------------------------------------

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public get length():number {
            return this._source.length;
        }

        /**
         * @language en_US
         * Adds the specified item to the end of the list.
         * Equivalent to <code>addItemAt(item, length)</code>.
         * @param item The item to add.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 向列表末尾添加指定项目。等效于 <code>addItemAt(item, length)</code>。
         * @param item 要被添加的项。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public addItem(item:any):void {
            this._source.push(item);
            this.dispatchCoEvent(CollectionEventKind.ADD, this._source.length - 1, -1, [item]);
        }

        /**
         * @language en_US
         * Adds the item at the specified index.
         * The index of any item greater than the index of the added item is increased by one.
         * If the the specified index is less than zero or greater than the length
         * of the list, a Error which code is 1007 is thrown.
         * @param item The item to place at the index.
         * @param index The index at which to place the item.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 在指定的索引处添加项目。
         * 任何大于已添加项目的索引的项目索引都会增加 1。
         * 如果指定的索引比0小或者比最大长度要大。则会抛出1007异常。
         * @param item 要添加的项
         * @param index 要添加的指定索引位置
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public addItemAt(item:any, index:number):void {
            if (index < 0 || index > this._source.length) {
                DEBUG && egret.$error(1007);
            }
            this._source.splice(index, 0, item);
            this.dispatchCoEvent(CollectionEventKind.ADD, index, -1, [item]);
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getItemAt(index:number):any {
            return this._source[index];
        }

        /**
         * @inheritDoc
         *
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public getItemIndex(item:any):number {
            var length:number = this._source.length;
            for (var i:number = 0; i < length; i++) {
                if (this._source[i] === item) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * @language en_US
         * Notifies the view that an item has been updated.
         * @param item The item within the view that was updated.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 通知视图，某个项目的属性已更新。
         * @param item 视图中需要被更新的项。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public itemUpdated(item:any):void {
            var index:number = this.getItemIndex(item);
            if (index != -1) {
                this.dispatchCoEvent(CollectionEventKind.UPDATE, index, -1, [item]);
            }
        }

        /**
         * @language en_US
         * Removes all items from the list.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 删除列表中的所有项目。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public removeAll():void {
            var items:any[] = this._source.concat();
            this._source.length = 0;
            this.dispatchCoEvent(CollectionEventKind.REMOVE, 0, -1, items);
        }

        /**
         * @language en_US
         * Removes the item at the specified index and returns it.
         * Any items that were after this index are now one index earlier.
         * @param index The index from which to remove the item.
         * @return The item that was removed.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 删除指定索引处的项目并返回该项目。原先位于此索引之后的所有项目的索引现在都向前移动一个位置。
         * @param index 要被移除的项的索引。
         * @return 被移除的项。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public removeItemAt(index:number):any {
            if (index < 0 || index >= this._source.length) {
                DEBUG && egret.$error(1007);
                return;
            }
            var item:any = this._source.splice(index, 1)[0];
            this.dispatchCoEvent(CollectionEventKind.REMOVE, index, -1, [item]);
            return item;
        }

        /**
         * @language en_US
         * Replaces the item at the specified index.
         * @param item The new item to be placed at the specified index.
         * @param index The index at which to place the item.
         * @return The item that was replaced, or <code>null</code> if none.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 替换在指定索引处的项目，并返回该项目。
         * @param item 要在指定索引放置的新的项。
         * @param index 要被替换的项的索引位置。
         * @return 被替换的项目，如果没有该项则返回<code>null</code> 。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public replaceItemAt(item:any, index:number):any {
            if (index < 0 || index >= this._source.length) {
                DEBUG && egret.$error(1007);
                return;
            }
            var oldItem:any = this._source.splice(index, 1, item)[0];
            this.dispatchCoEvent(CollectionEventKind.REPLACE, index, -1, [item], [oldItem]);
            return oldItem;
        }

        /**
         * @language en_US
         * Replaces all items with a new source data, this method can not reset the scroller position of view.
         * @param newSource new source data.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用新数据源替换原始数据源，此方法与直接设置source不同，它不会导致目标视图重置滚动位置。
         * @param newSource 新数据。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public replaceAll(newSource:any[]):void {
            if (!newSource)
                newSource = [];
            var newLength = newSource.length;
            var oldLength = this._source.length;
            for (var i = newLength; i < oldLength; i++) {
                this.removeItemAt(newLength);
            }
            for (i = 0; i < newLength; i++) {
                if (i >= oldLength)
                    this.addItemAt(newSource[i], i);
                else
                    this.replaceItemAt(newSource[i], i);
            }
            this._source = newSource;
        }

        /**
         * @private
         * 抛出事件
         */
        private dispatchCoEvent(kind:string, location?:number, oldLocation?:number, items?:any[], oldItems?:any[]):void {

            CollectionEvent.dispatchCollectionEvent(this, CollectionEvent.COLLECTION_CHANGE, kind, location, oldLocation, items, oldItems);
        }
    }

    registerProperty(ArrayCollection,"source","Array",true);

    if(DEBUG){
        egret.$markReadOnly(ArrayCollection,"length");
    }
}