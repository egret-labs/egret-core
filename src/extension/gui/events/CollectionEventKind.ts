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
	 * @class egret.gui.CollectionEventKind
	 * @classdesc
	 * 定义  CollectionEvent 类 kind 属性的有效值的常量。
	 * 这些常量指示对集合进行的更改类型。
	 */
	export class CollectionEventKind{
		/**
		 * 指示集合添加了一个或多个项目。 
		 * @constant egret.gui.CollectionEventKind.ADD
		 */		
		public static ADD:string = "add";
		/**
		 * 指示项目已从 CollectionEvent.oldLocation确定的位置移动到 location确定的位置。 
		 * @constant egret.gui.CollectionEventKind.MOVE
		 */		
		public static MOVE:string = "move";
		/**
		 * 指示集合应用了排序或/和筛选。
		 * @constant egret.gui.CollectionEventKind.REFRESH
		 */		
		public static REFRESH:string = "refresh";
		/**
		 * 指示集合删除了一个或多个项目。 
		 * @constant egret.gui.CollectionEventKind.REMOVE
		 */		
		public static REMOVE:string = "remove";
		/**
		 * 指示已替换由 CollectionEvent.location 属性确定的位置处的项目。 
		 * @constant egret.gui.CollectionEventKind.REPLACE
		 */		
		public static REPLACE:string = "replace";
		/**
		 * 指示集合已彻底更改，需要进行重置。 
		 * @constant egret.gui.CollectionEventKind.RESET
		 */		
		public static RESET:string = "reset";
		/**
		 * 指示集合中一个或多个项目进行了更新。受影响的项目将存储在  CollectionEvent.items 属性中。 
		 * @constant egret.gui.CollectionEventKind.UPDATE
		 */		
		public static UPDATE:string = "update";
		/**
		 * 指示集合中某个节点的子项列表已打开，通常应用于Tree的数据源XMLCollection。
		 * @constant egret.gui.CollectionEventKind.OPEN
		 */		
		public static OPEN:string = "open";
		/**
		 * 指示集合中某个节点的子项列表已关闭，通常应用于Tree的数据源XMLCollection。
		 * @constant egret.gui.CollectionEventKind.CLOSE
		 */		
		public static CLOSE:string = "close";
	}
}