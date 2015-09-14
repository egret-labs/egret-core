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
     * The CollectionEventKind class contains constants for the valid values
     * of the <code>CollectionEvent</code> class <code>kind</code> property.
     * These constants indicate the kind of change that was made to the collection.
     *
     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * 定义 <code>CollectionEvent</code> 类 <code>kind</code> 属性的有效值的常量。
     * 这些常量指示对集合进行的更改类型。

     * @version Egret 2.4
     * @version eui 1.0
     * @platform Web,Native
     */
    export class CollectionEventKind {
        /**
         * @language en_US
         * Indicates that the collection added an item or items.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示集合添加了一个或多个项目。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static ADD:string = "add";
        /**
         * @language en_US
         * Indicates that the collection applied a sort, a filter, or both.
         * This change can potentially be easier to handle than a RESET.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示集合应用了排序或/和筛选。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static REFRESH:string = "refresh";
        /**
         * @language en_US
         * Indicates that the collection removed an item or items.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示集合删除了一个或多个项目。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static REMOVE:string = "remove";
        /**
         * @language en_US
         * Indicates that the item at the position identified by the
         * CollectionEvent <code>location</code> property has been replaced.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示已替换由 CollectionEvent.location 属性确定的位置处的项目。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static REPLACE:string = "replace";
        /**
         * @language en_US
         * Indicates that the collection has changed so drastically that
         * a reset is required.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示集合已彻底更改，需要进行重置。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static RESET:string = "reset";
        /**
         * @language en_US
         * Indicates that one or more items were updated within the collection.
         * The affected item(s)
         * are stored in the <code>CollectionEvent.items</code> property.
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指示集合中一个或多个项目进行了更新。受影响的项目将存储在  CollectionEvent.items 属性中。
         * @version Egret 2.4
         * @version eui 1.0
         * @platform Web,Native
         */
        public static UPDATE:string = "update";
    }
}