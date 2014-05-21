/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../../egret/events/Event.ts"/>

module ns_egret {

    /**
     * @class ns_egret.CollectionEvent
     * @classdesc
     * 集合类型数据改变事件
     * @extends ns_egret.Event
     */
    export class CollectionEvent extends Event{
        /**
         * 集合类数据发生改变
         * @constant ns_egret.CollectionEvent.COLLECTION_CHANGE
         */
        public static COLLECTION_CHANGE:string = "collectionChange";

        /**
         * @method ns_egret.CollectionEvent#constructor
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
         * @member ns_egret.CollectionEvent#kind
         */
        public kind:string;
        /**
         * 受事件影响的项目的列表
         * @member ns_egret.CollectionEvent#items
         */
        public items:Array<any>;
        /**
         * 仅当kind的值为CollectionEventKind.REPLACE时，表示替换前的项目列表
         * @member ns_egret.CollectionEvent#oldItems
         */
        public oldItems:Array<any>;
        /**
         * 如果 kind 值为 CollectionEventKind.ADD、 CollectionEventKind.MOVE、
         * CollectionEventKind.REMOVE 或 CollectionEventKind.REPLACE，
         * CollectionEventKind.UPDATE
         * 则此属性为 items 属性中指定的项目集合中零号元素的的索引。
         * @member ns_egret.CollectionEvent#location
         */
        public location:number;
        /**
         * 如果 kind 的值为 CollectionEventKind.MOVE，
         * 则此属性为 items 属性中指定的项目在目标集合中原来位置的从零开始的索引。
         * @member ns_egret.CollectionEvent#oldLocation
         */
        public oldLocation:number;

        /**
         * 使用指定的EventDispatcher对象来抛出CollectionEvent事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.CollectionEvent.dispathByTarget
         */
        public static dispathCollectionEvent(target:IEventDispatcher,type:string,kind:string, location:number,
                                      oldLocation:number, items:Array<any>,oldItems:Array<any>):void{
            var eventClass:any = Event;
            var props:any = eventClass._props;
            if(!props)
                props = eventClass._props = {};
            props.kind = kind;
            props.location = location;
            props.oldLocation = oldLocation;
            props.items = items;
            props.oldItems = oldItems;
            Event._dispathByTarget(eventClass,target,type,false,props)
        }
    }
}