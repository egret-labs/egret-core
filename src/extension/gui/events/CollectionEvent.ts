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
     * @class egret.gui.CollectionEvent
     * @classdesc
     * 集合类型数据改变事件
     * @extends egret.Event
     */
    export class CollectionEvent extends Event{
        /**
         * 集合类数据发生改变
         * @constant egret.gui.CollectionEvent.COLLECTION_CHANGE
         */
        public static COLLECTION_CHANGE:string = "collectionChange";

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
        public constructor(type:string, bubbles:boolean = false,
                           cancelable:boolean = false,
                           kind:string = null, location:number = -1,
                           oldLocation:number = -1, items:Array<any> = null,oldItems:Array<any>=null){
            super(type, bubbles, cancelable);

            this.kind = kind;
            this.location = location;
            this.oldLocation = oldLocation;
            this.items = items ? items : [];
            this.oldItems = oldItems?oldItems:[];
        }
        /**
         * 指示发生的事件类型。此属性值可以是 CollectionEventKind 类中的一个值，也可以是 null，用于指示类型未知。
         * @member egret.gui.CollectionEvent#kind
         */
        public kind: string = null;
        /**
         * 受事件影响的项目的列表
         * @member egret.gui.CollectionEvent#items
         */
        public items: Array<any> = null;
        /**
         * 仅当kind的值为CollectionEventKind.REPLACE时，表示替换前的项目列表
         * @member egret.gui.CollectionEvent#oldItems
         */
        public oldItems: Array<any> = null;
        /**
         * 如果 kind 值为 CollectionEventKind.ADD、 CollectionEventKind.MOVE、
         * CollectionEventKind.REMOVE 或 CollectionEventKind.REPLACE，
         * CollectionEventKind.UPDATE
         * 则此属性为 items 属性中指定的项目集合中零号元素的的索引。
         * @member egret.gui.CollectionEvent#location
         */
        public location:number;
        /**
         * 如果 kind 的值为 CollectionEventKind.MOVE，
         * 则此属性为 items 属性中指定的项目在目标集合中原来位置的从零开始的索引。
         * @member egret.gui.CollectionEvent#oldLocation
         */
        public oldLocation:number;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.CollectionEvent.dispatchCollectionEvent
         */
        public static dispatchCollectionEvent(target:IEventDispatcher,type:string,kind:string = null, location:number = -1,
                                             oldLocation:number = -1, items:Array<any> = null,oldItems:Array<any>=null):boolean{

            var event:CollectionEvent = Event.create(CollectionEvent, type);
            event.kind = kind;
            event.location = location;
            event.oldLocation = oldLocation;
            event.items = items;
            event.oldItems = oldItems;
            var result = target.dispatchEvent(event);
            Event.release(event);
            return result;
        }

        public clean():void {
            super.clean();
            this.kind = null;
            this.items = null;
            this.oldItems = null;
            this.oldLocation = null;
        }
    }
}