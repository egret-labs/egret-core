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
	 * @class egret.gui.ObjectCollection
	 * @classdesc
	 * Object的集合类数据结构包装器,通常作为Tree组件的数据源。
	 * @extends egret.EventDispatcher
	 * @implements egret.gui.ICollection
	 * @implements egret.gui.ITreeCollection
	 */
	export class ObjectCollection extends EventDispatcher 
		implements ICollection,ITreeCollection{
		/**
		 * 构造函数
		 * @method egret.gui.ObjectCollection#constructor
		 * @param childrenKey {string} 要从item中获取子项列表的属性名,属性值为一个数组或Vector。
		 * @param parentKey {string} 要从item中获取父级项的属性名
		 */		
		public constructor(childrenKey:string="children",parentKey:string="parent"){
			super();
			this.childrenKey = childrenKey;
			this.parentKey = parentKey;
		}
		/**
		 * 要从item中获取子项列表的属性名
		 */		
        private childrenKey: string = "children";
		/**
		 * 要从item中获取父级项的属性名
		 */		
        private parentKey: string = "parent";

        private _source: any = null;
		/**
		 * 数据源。注意：设置source会同时清空openNodes。
		 * @member egret.gui.ObjectCollection#source
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
		 * @member egret.gui.ObjectCollection#openNodes
		 */
		public get openNodes():Array<any>{
			return this._openNodes.concat();
		}
		public set openNodes(value:Array<any>){
			this._openNodes = value?value.concat():[];
			this.refresh();
		}
		
		/**
		 * @member egret.gui.ObjectCollection#length
		 */
		public get length():number{
			return this.nodeList.length;
		}
		/**
		 * @method egret.gui.ObjectCollection#getItemAt
		 * @param index {number} 
		 * @returns {any}
		 */
		public getItemAt(index:number):any{
			return this.nodeList[index];
		}
		/**
		 * @method egret.gui.ObjectCollection#getItemIndex
		 * @param item {any} 
		 * @returns {number}
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
		 * @method egret.gui.ObjectCollection#itemUpdated
		 * @param item {any} 
		 */
		public itemUpdated(item:any):void{
			var index:number = this.getItemIndex(item);
			if(index!=-1){
				this.dispatchCoEvent(CollectionEventKind.UPDATE,index,-1,[item]);
			}
		}
		
		/**
		 * 删除指定节点
		 * @method egret.gui.ObjectCollection#removeItem
		 * @param item {any} 
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
		 * @member egret.gui.ObjectCollection#showRoot
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
		 * @method egret.gui.ObjectCollection#hasChildren
		 * @param item {any} 
		 * @returns {boolean}
		 */		
		public hasChildren(item:any):boolean{
			if(item.hasOwnProperty(this.childrenKey))
				return item[this.childrenKey].length>0;
			return false;
		}
		/**
		 * @method egret.gui.ObjectCollection#isItemOpen
		 * @param item {any} 
		 * @returns {boolean}
		 */	
		public isItemOpen(item:any):boolean{
			return this._openNodes.indexOf(item)!=-1;
		}	
		/**
		 * @method egret.gui.ObjectCollection#expandItem
		 * @param item {any} 
		 * @param open {boolean} 
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
		 * @method egret.gui.ObjectCollection#getDepth
		 * @param item {any} 
		 * @returns {number}
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
		 * @method egret.gui.ObjectCollection#refresh
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
			CollectionEvent.dispatchCollectionEvent(this,CollectionEvent.COLLECTION_CHANGE,
                kind,location,oldLocation,items,oldItems)
		}
		/**
		 * 一个工具方法，给parent的子项以及子孙项赋值父级引用。
		 * @method egret.gui.ObjectCollection.assignParent
		 * @param parent {any} 要遍历子项的parent对象。
		 * @param childrenKey {string} 要从parent中获取子项列表的属性名,属性值为一个数组或Vector。
		 * @param parentKey {string} 要给子项赋值父级引用的属性名。
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