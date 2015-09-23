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
	 * An <code>ICollectionView</code> is a view onto a collection of data.
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 */
	/**
	 * @language zh_CN
	 *
	 * <code>ICollection</code>是一个列表的集合类数据源对象的查看接口。
	 * @version Egret 2.4
	 * @version eui 1.0
	 * @platform Web,Native
	 */
	export interface ICollection extends egret.IEventDispatcher{
		/**
		 * @language en_US
		 * The number of items in this view.
		 * 0 means no items, while -1 means that the length is unknown.
         * @readOnly
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 此集合中的项目数。0 表示不包含项目。
         * @readOnly
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		length:number;
		/**
		 * @language en_US
		 * Gets the item at the specified index.
		 * @param index The index in the list from which to retrieve the item.
		 * @return The item at that index, or <code>null</code> if there is none.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 获取指定索引处的项目。
		 * @param index 要得到的项的指定位置。
		 * @return 在索引位置的项，如果没有该项则返回null。
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		getItemAt(index:number):any;
		/**
		 * @language en_US
		 * Returns the index of the item if it is in the list。-1 otherwise.
		 * @param item The item to find.
		 * @return The index of the item, or -1 if the item is not in the list.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		/**
		 * @language zh_CN
		 * 如果项目位于列表中,返回该项目的索引。否则返回-1。
		 * @param item 要查找的项。
		 * @return 项的索引，如果该项没有在列表中将返回-1.
		 * @version Egret 2.4
		 * @version eui 1.0
		 * @platform Web,Native
		 */
		getItemIndex(item:any):number;
	}
}

interface ICollection extends egret.IEventDispatcher {
	/**
	 *  此集合中的项目数。0 表示不包含项目。
	 *  @readOnly
	 */
	length:number;
}