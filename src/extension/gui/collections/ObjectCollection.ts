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

/// <reference path="../../../egret/events/EventDispatcher.ts"/>
/// <reference path="ICollection.ts"/>
/// <reference path="ITreeCollection.ts"/>
/// <reference path="../events/CollectionEvent.ts"/>
/// <reference path="../events/CollectionEventKind.ts"/>

module ns_egret {

	export class ObjectCollection extends EventDispatcher 
		implements ICollection,ITreeCollection{
		/**
		 * 构造函数
		 * @param childrenKey 要从item中获取子项列表的属性名,属性值为一个数组或Vector。
		 * @param parentKey 要从item中获取父级项的属性名
		 */		
		public constructor(childrenKey:string="children",parentKey:string="parent"){
			super();
			this.childrenKey = childrenKey;
			this.parentKey = parentKey;
		}
		/**
		 * 要从item中获取子项列表的属性名
		 */		
		private childrenKey:string;
		/**
		 * 要从item中获取父级项的属性名
		 */		
		private parentKey:string;
		
		private _source:any;
		/**
		 * 数据源。注意：设置source会同时清空openNodes。
		 */
		public get source():any{
			return this._source;
		}

		public set source(value:any){
			this._source = value;
			this._openNodes = [];
			this.nodeList = [];
			if(this._source){
				if(this._showRoot){
					this.nodeList.push(this._source);
				}
				else{
					this._openNodes = [this._source];
					this.addChildren(this._source,this.nodeList);
				}
			}
			this.dispatchCoEvent(CollectionEventKind.RESET);
		}
		
		/**
		 * 要显示的节点列表
		 */		
		private nodeList:Array<any> = [];
		
		private _openNodes:Array<any> = [];
		/**
		 * 处于展开状态的节点列表
		 */
		public get openNodes():Array<any>{
			return this._openNodes.concat();
		}
		public set openNodes(value:Array<any>){
			this._openNodes = value?value.concat():[];
			this.refresh();
		}
		
		/**
		 * @inheritDoc
		 */
		public get length():number{
			return this.nodeList.length;
		}
		/**
		 * @inheritDoc
		 */
		public getItemAt(index:number):any{
			return this.nodeList[index];
		}
		/**
		 * @inheritDoc
		 */
		public getItemIndex(item:any):number{
			var length:number = this.nodeList.length;
			for(var i:number=0;i<length;i++){
				if(this.nodeList[i]===item){
					return i;
				}
			}
			return -1;
		}
		
		/**
		 * 通知视图，某个项目的属性已更新。
		 */
		public itemUpdated(item:any):void{
			var index:number = this.getItemIndex(item);
			if(index!=-1){
				this.dispatchCoEvent(CollectionEventKind.UPDATE,index,-1,[item]);
			}
		}
		
		/**
		 * 删除指定节点
		 */
		public removeItem(item:any):void{
			if(this.isItemOpen(item))
				this.closeNode(item);
			if(!item)
				return;
			var parent:any = item[this.parentKey];
			if(!parent)
				return;
			var list:Array<any> = parent[this.childrenKey];
			if(!list)
				return;
			var index:number = list.indexOf(item);
			if(index!=-1)
				list.splice(index,1);
			item[this.parentKey] = null;
			index = this.nodeList.indexOf(item);
			if(index!=-1){
				this.nodeList.splice(index,1);
				this.dispatchCoEvent(CollectionEventKind.REMOVE,index,-1,[item]);
			}
			
		}
		
		private _showRoot:boolean = false;
		/**
		 * 是否显示根节点,默认false。
		 */
		public get showRoot():boolean{
			return this._showRoot;
		}
		public set showRoot(value:boolean){
			if(this._showRoot==value)
				return;
			this._showRoot = value;
			if(this._source){
				if(this._showRoot){
					this.nodeList.splice(0,0,this._source);
				}
				else{
					this.nodeList.shift();
					if(this.openNodes.indexOf(this._source)==-1)
						this.openNodes.push(this._source);
				}
				this.refresh();
			}
		}
		
		/**
		 * 添加打开的节点到列表
		 */		
		private addChildren(parent:any,list:Array<any>):void{
			if(!parent.hasOwnProperty(this.childrenKey)||this._openNodes.indexOf(parent)==-1)
				return;
            var children:Array<any> = parent[this.childrenKey];
            var length:number = children.length;
			for(var i:number=0;i<length;i++){
                var child:any = children[i];
				list.push(child);
				this.addChildren(child, list);
			}
		}
		/**
		 * @inheritDoc
		 */		
		public hasChildren(item:any):boolean{
			if(item.hasOwnProperty(this.childrenKey))
				return item[this.childrenKey].length>0;
			return false;
		}
		/**
		 * @inheritDoc
		 */	
		public isItemOpen(item:any):boolean{
			return this._openNodes.indexOf(item)!=-1;
		}	
		/**
		 * @inheritDoc
		 */	
		public expandItem(item:any,open:boolean=true):void{
			if(open)
				this.openNode(item);
			else
				this.closeNode(item);
		}
		/**
		 * 打开一个节点
		 */		
		private openNode(item:any):void{
			if(this._openNodes.indexOf(item)==-1){
				this._openNodes.push(item);
				var index:number = this.nodeList.indexOf(item);
				if(index!=-1){
					var list:Array<any> = [];
					this.addChildren(item,list);
					var i:number = index;
					while(list.length){
						i++;
						var node:any = list.shift();
						this.nodeList.splice(i,0,node);
						this.dispatchCoEvent(CollectionEventKind.ADD,i,-1,[node]);
					}
					this.dispatchCoEvent("open",index,index,[item]);
				}
			}
		}
		/**
		 * 关闭一个节点
		 */		
		private closeNode(item:any):void{
			var index:number = this._openNodes.indexOf(item);
			if(index==-1)
				return;
			var list:Array<any> = [];
			this.addChildren(item,list);
			this._openNodes.splice(index,1);
			index = this.nodeList.indexOf(item);
			if(index!=-1){
				index++;
				while(list.length){
					var node:any = this.nodeList.splice(index,1)[0];
					this.dispatchCoEvent(CollectionEventKind.REMOVE,index,-1,[node]);
					list.shift();
				}
				index--;
				this.dispatchCoEvent(CollectionEventKind.CLOSE,index,index,[item]);
			}
		}
		/**
		 * @inheritDoc
		 */	
		public getDepth(item:any):number{
			var depth:number = 0;
			var parent:any = item[this.parentKey];
			while (parent){
				depth++;
				parent = parent[this.parentKey];
			}
			if(depth>0&&!this._showRoot)
				depth--;
			return depth;
		}
		/**
		 * 刷新数据源。
		 */		
		public refresh():void{
			this.nodeList = [];
			if(this._source){
				if(this._showRoot){
					this.nodeList.push(this._source);
				}
				this.addChildren(this._source,this.nodeList);
			}
			this.dispatchCoEvent(CollectionEventKind.REFRESH);
		}
		
		/**
		 * 抛出事件
		 */		
		private dispatchCoEvent(kind:string = null, location:number = -1,
										 oldLocation:number = -1, items:Array<any> = null,oldItems:Array<any>=null):void{
			var event:CollectionEvent = new CollectionEvent(CollectionEvent.COLLECTION_CHANGE,false,false,
				kind,location,oldLocation,items,oldItems);
			this.dispatchEvent(event);
		}
		/**
		 * 一个工具方法，给parent的子项以及子孙项赋值父级引用。
		 * @param parent 要遍历子项的parent对象。
		 * @param childrenKey 要从parent中获取子项列表的属性名,属性值为一个数组或Vector。
		 * @param parentKey 要给子项赋值父级引用的属性名。
		 */
		public static assignParent(parent:any,childrenKey:string="children",parentKey:string="parent"):void{
			if(!parent.hasOwnProperty(childrenKey))
				return;
            var children:Array<any> = parent[childrenKey];
            var length:number = children.length;
            for(var i:number=0;i<length;i++){
                var child:any = children[i];
				try{
					child[parentKey] = parent;
				}
				catch(e){}
				ObjectCollection.assignParent(child,childrenKey,parentKey);
			}
		}
	}
}