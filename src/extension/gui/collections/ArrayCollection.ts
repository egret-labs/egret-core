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


module egret.gui {

    /**
     * @class egret.gui.ArrayCollection
     * @classdesc
     * 数组的集合类数据结构包装器
     * 通常作为列表组件的数据源，使用这种数据结构包装普通数组，
     * 能在数据源发生改变的时候主动通知视图刷新变更的数据项
     * @extends egret.EventDispatcher
     * @implements egret.gui.ICollection
     */
    export class ArrayCollection extends EventDispatcher implements ICollection{
        /**
         * 构造函数
         * @method egret.gui.ArrayCollection#constructor
         * @param source {Array<any>} 数据源
         */
        public constructor(source:Array<any> = null){
            super();
            if(source){
                this._source = source;
            }
            else{
                this._source = [];
            }
        }

        /**
         *
         */
        private _source:Array<any>;
        /**
         * 数据源
         * 通常情况下请不要直接调用Array的方法操作数据源，否则对应的视图无法收到数据改变的通知。
         * 若对数据源进行了排序或过滤等操作，请手动调用refresh()方法刷新数据。<br/>
         * @member egret.gui.ArrayCollection#source
         */
        public get source():Array<any>{
            return this._source;
        }

        public set source(value:Array<any>){
            if(!value)
                value = [];
            this._source = value;
            this.dispatchCoEvent(CollectionEventKind.RESET);
        }
        /**
         * 在对数据源进行排序或过滤操作后可以手动调用此方法刷新所有数据,以更新视图。
         * @method egret.gui.ArrayCollection#refresh
         */
        public refresh():void{
            this.dispatchCoEvent(CollectionEventKind.REFRESH);
        }
        /**
         * 是否包含某项数据
         * @method egret.gui.ArrayCollection#contains
         * @param item {any}
         * @returns {boolean}
         */
        public contains(item:any):boolean{
            return this.getItemIndex(item)!=-1;
        }

        /**
         * 检测索引是否超出范围
         */
        private checkIndex(index:number):void{
            if(index<0||index>=this._source.length){
                throw new RangeError(getString(3002, index));
            }
        }

        //--------------------------------------------------------------------------
        //
        // ICollection接口实现方法
        //
        //--------------------------------------------------------------------------
        /**
         * @member egret.gui.ArrayCollection#length
         */
        public get length():number{
            return this._source.length;
        }
        /**
         * 向列表末尾添加指定项目。等效于 addItemAt(item, length)。
         * @method egret.gui.ArrayCollection#addItem
         * @param item {any}
         */
        public addItem(item:any):void{
            this._source.push(item);
            this.dispatchCoEvent(CollectionEventKind.ADD,this._source.length-1,-1,[item]);
        }
        /**
         * 在指定的索引处添加项目。
         * 任何大于已添加项目的索引的项目索引都会增加 1。
         * @method egret.gui.ArrayCollection#addItemAt
         * @throws RangeError 如果索引小于 0 或大于长度。
         * @param item {any}
         * @param index {number}
         */
        public addItemAt(item:any, index:number):void{
            if(index<0||index>this._source.length){
                throw new RangeError(getString(3002, index));
            }
            this._source.splice(index,0,item);
            this.dispatchCoEvent(CollectionEventKind.ADD,index,-1,[item]);
        }
        /**
         * 获取指定索引处的项目
         * @method egret.gui.ArrayCollection#getItemAt
         * @param index {number}
         * @returns {any}
         */
        public getItemAt(index:number):any{
            return this._source[index];
        }
        /**
         * 如果项目位于列表中,返回该项目的索引。否则返回-1。
         * @method egret.gui.ArrayCollection#getItemIndex
         * @param item {any}
         * @returns {number}
         */
        public getItemIndex(item:any):number{
            var length:number = this._source.length;
            for(var i:number=0;i<length;i++){
                if(this._source[i]===item){
                    return i;
                }
            }
            return -1;
        }
        /**
         * 通知视图，某个项目的属性已更新。
         * @method egret.gui.ArrayCollection#itemUpdated
         * @param item {any}
         */
        public itemUpdated(item:any):void{
            var index:number = this.getItemIndex(item);
            if(index!=-1){
                this.dispatchCoEvent(CollectionEventKind.UPDATE,index,-1,[item]);
            }
        }
        /**
         * 删除列表中的所有项目。
         * @method egret.gui.ArrayCollection#removeAll
         */
        public removeAll():void{
            var items:Array<any> = this._source.concat();
            this._source.length = 0;
            this.dispatchCoEvent(CollectionEventKind.REMOVE,0,-1,items);
        }
        /**
         * 删除指定索引处的项目并返回该项目。原先位于此索引之后的所有项目的索引现在都向前移动一个位置。
         * @method egret.gui.ArrayCollection#removeItemAt
         * @throws RangeError 如果索引小于 0 或大于长度。
         * @param index {number}
         * @returns {any}
         */
        public removeItemAt(index:number):any{
            this.checkIndex(index);
            var item:any = this._source.splice(index,1)[0];
            this.dispatchCoEvent(CollectionEventKind.REMOVE,index,-1,[item]);
            return item;
        }
        /**
         * 替换在指定索引处的项目，并返回该项目。
         * @method egret.gui.ArrayCollection#replaceItemAt
         * @throws RangeError 如果索引小于 0 或大于长度。
         * @param item {any}
         * @param index {number}
         * @returns {any}
         */
        public replaceItemAt(item:any, index:number):any{
            this.checkIndex(index);
            var oldItem:any = this._source.splice(index,1,item)[0];
            this.dispatchCoEvent(CollectionEventKind.REPLACE,index,-1,[item],[oldItem]);
            return oldItem;
        }
        /**
         * 用新数据源替换原始数据源，此方法与直接设置source不同，它不会导致目标视图重置滚动位置。
         * @method egret.gui.ArrayCollection#replaceAll
         * @param newSource {Array<any>} 新的数据源
         */
        public replaceAll(newSource:Array<any>):void{
            if(!newSource)
                newSource = [];
            var newLength:number = newSource.length;
            var oldLenght:number = this._source.length;
            for(var i:number = newLength;i<oldLenght;i++){
                this.removeItemAt(newLength);
            }
            for(i=0;i<newLength;i++){
                if(i>=oldLenght)
                    this.addItemAt(newSource[i],i);
                else
                    this.replaceItemAt(newSource[i],i);
            }
            this._source = newSource;
        }
        /**
         * 移动一个项目
         * 在oldIndex和newIndex之间的项目，
         * 若oldIndex小于newIndex,索引会减1
         * 若oldIndex大于newIndex,索引会加1
         * @method egret.gui.ArrayCollection#moveItemAt
         * @param oldIndex {number}
         * @param newIndex {number}
         * @returns {any}
         * @throws RangeError 如果索引小于 0 或大于长度。
         */
        public moveItemAt(oldIndex:number,newIndex:number):any{
            this.checkIndex(oldIndex);
            this.checkIndex(newIndex);
            var item:any = this._source.splice(oldIndex,1)[0];
            this._source.splice(newIndex,0,item);
            this.dispatchCoEvent(CollectionEventKind.MOVE,newIndex,oldIndex,[item]);
            return item;
        }

        /**
         * 抛出事件
         */
        private dispatchCoEvent(kind:string = null, location:number = -1,
                                oldLocation:number = -1, items:Array<any> = null,oldItems:Array<any>=null):void{

            CollectionEvent.dispatchCollectionEvent(this,CollectionEvent.COLLECTION_CHANGE,kind,location,oldLocation,items,oldItems);
        }
    }
}