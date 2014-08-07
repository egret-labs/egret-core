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
	 * @class egret.gui.ICollection
	 * @interface
	 * @classdesc
	 * 列表的集合类数据源对象接口
	 * @extends egret.IEventDispatcher
	 */
	export interface ICollection extends IEventDispatcher{
		/**
		 * 此集合中的项目数。0 表示不包含项目，而 -1 表示长度未知。
		 * @member egret.gui.ICollection#length
		 */		
		length:number;
		/**
		 * 获取指定索引处的项目。
		 * @method egret.gui.ICollection#getItemAt
		 * @throws RangeError 如果索引小于 0 或大于长度。
		 * @param index {number} 
		 * @returns {any}
		 */		
		getItemAt(index:number):any;
		/**
		 * 如果项目位于列表中,返回该项目的索引。否则返回-1。
		 * @method egret.gui.ICollection#getItemIndex
		 * @param item {any} 
		 * @returns {number}
		 */		
		getItemIndex(item:any):number;
	}
}