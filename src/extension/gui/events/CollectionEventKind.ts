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

module ns_egret {

	export class CollectionEventKind{
		/**
		 * 指示集合添加了一个或多个项目。 
		 */		
		public static ADD:string = "add";
		/**
		 * 指示项目已从 CollectionEvent.oldLocation确定的位置移动到 location确定的位置。 
		 */		
		public static MOVE:string = "move";
		/**
		 * 指示集合应用了排序或/和筛选。
		 */		
		public static REFRESH:string = "refresh";
		/**
		 * 指示集合删除了一个或多个项目。 
		 */		
		public static REMOVE:string = "remove";
		/**
		 * 指示已替换由 CollectionEvent.location 属性确定的位置处的项目。 
		 */		
		public static REPLACE:string = "replace";
		/**
		 * 指示集合已彻底更改，需要进行重置。 
		 */		
		public static RESET:string = "reset";
		/**
		 * 指示集合中一个或多个项目进行了更新。受影响的项目将存储在  CollectionEvent.items 属性中。 
		 */		
		public static UPDATE:string = "update";
		/**
		 * 指示集合中某个节点的子项列表已打开，通常应用于Tree的数据源XMLCollection。
		 */		
		public static OPEN:string = "open";
		/**
		 * 指示集合中某个节点的子项列表已关闭，通常应用于Tree的数据源XMLCollection。
		 */		
		public static CLOSE:string = "close";
	}
}