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


module RES {

	/**
	 * @class RES.ResourceLoader
	 * @classdesc
	 * @extends egret.EventDispatcher
	 * @private
	 */
	export class ResourceLoader extends egret.EventDispatcher{
		/**
		 * 构造函数
		 * @method RES.ResourceLoader#constructor
		 */
		public constructor(){
			super();
		}
        /**
         * 最大并发加载数
         */
        public thread: number = 2;
        /**
         * 正在加载的线程计数
         */
        private loadingCount:number = 0;
        /**
         * 一项加载结束回调函数。无论加载成功或者出错都将执行回调函数。示例：callBack(resItem:ResourceItem):void;
		 * @member {Function} RES.ResourceLoader#callBack
         */
        public callBack:Function = null;
        /**
         * RES单例的引用
		 * @member {any} RES.ResourceLoader#resInstance
         */
        public resInstance:any = null;

		/**
		 * 当前组加载的项总个数,key为groupName
		 */
		private groupTotalDic:any = {};
		/**
		 * 已经加载的项个数,key为groupName
		 */
		private numLoadedDic:any = {};
		/**
		 * 正在加载的组列表,key为groupName
		 */
		private itemListDic:any = {};
		/**
		 * 加载失败的组,key为groupName
		 */
		private groupErrorDic:any = {};

        private retryTimesDic: any = {};
        public maxRetryTimes = 3;
        private failedList: Array<ResourceItem> = new Array<ResourceItem>();

		/**
		 * 优先级队列,key为priority，value为groupName列表
		 */
		private priorityQueue:any = {};
		/**
		 * 检查指定的组是否正在加载中
		 * @method RES.ResourceLoader#isGroupInLoading
		 * @param groupName {string}
		 * @returns {boolean}
		 */
		public isGroupInLoading(groupName:string):boolean{
			return this.itemListDic[groupName]!==undefined;
		}
		/**
		 * 开始加载一组文件
		 * @method RES.ResourceLoader#loadGroup
		 * @param list {egret.Array<ResourceItem>} 加载项列表
		 * @param groupName {string} 组名
		 * @param priority {number} 加载优先级
		 */
		public loadGroup(list:Array<ResourceItem>,groupName:string,priority:number=0):void{
			if(this.itemListDic[groupName]||!groupName)
				return;
			if(!list||list.length==0){
                egret.$warn(3201, groupName);
				var event:ResourceEvent = new ResourceEvent(ResourceEvent.GROUP_LOAD_ERROR);
				event.groupName = groupName;
				this.dispatchEvent(event);
				return;
			}
			if(this.priorityQueue[priority])
				this.priorityQueue[priority].push(groupName);
			else
				this.priorityQueue[priority] = [groupName];
			this.itemListDic[groupName] = list;
            var length:number = list.length;
            for(var i:number=0;i<length;i++){
                var resItem:ResourceItem = list[i];
				resItem.groupName = groupName;
			}
			this.groupTotalDic[groupName] = list.length;
			this.numLoadedDic[groupName] = 0;
			this.next();
		}
		/**
		 * 延迟加载队列
		 */
		private lazyLoadList:Array<ResourceItem> = new Array<ResourceItem>();
		/**
		 * 加载一个文件
		 * @method RES.ResourceLoader#loadItem
		 * @param resItem {egret.ResourceItem} 要加载的项
		 */
		public loadItem(resItem:ResourceItem):void{
			this.lazyLoadList.push(resItem);
			resItem.groupName = "";
			this.next();
		}
		/**
		 * 资源解析库字典类
		 */
		private analyzerDic:any = {};
		/**
		 * 加载下一项
		 */
		private next():void{
            while(this.loadingCount<this.thread) {
                var resItem:ResourceItem = this.getOneResourceItem();
                if(!resItem)
                    break;
                this.loadingCount++;
                if(resItem.loaded){
                    this.onItemComplete(resItem);
                }
                else{
					var analyzer:AnalyzerBase = this.resInstance.$getAnalyzerByType(resItem.type);
                    analyzer.loadFile(resItem,this.onItemComplete,this);
                }
            }
		}

		/**
		 * 当前应该加载同优先级队列的第几列
		 */
		private queueIndex:number = 0;
		/**
		 * 获取下一个待加载项
		 */
		private getOneResourceItem():ResourceItem{
            if (this.failedList.length > 0)
                return this.failedList.shift();
			var maxPriority:number = Number.NEGATIVE_INFINITY;
			for(var p in this.priorityQueue){
				maxPriority = Math.max(maxPriority,<number><any> p);
			}
			var queue:Array<any> = this.priorityQueue[maxPriority];
			if(!queue||queue.length==0){
				if(this.lazyLoadList.length==0)
					return null;
				//后请求的先加载，以便更快获取当前需要的资源
				return this.lazyLoadList.pop();
			}
			var length:number = queue.length;
			var list:Array<ResourceItem>;
			for(var i:number=0;i<length;i++){
				if(this.queueIndex>=length)
					this.queueIndex = 0;
				list = this.itemListDic[queue[this.queueIndex]];
				if(list.length>0)
					break;
				this.queueIndex++;
			}
			if(list.length==0)
				return null;
			return list.shift();
		}
		/**
		 * 加载结束
		 */
		private onItemComplete(resItem:ResourceItem):void{
            this.loadingCount--;
			var groupName:string = resItem.groupName;
			if(!resItem.loaded){//加载失败
                var times = this.retryTimesDic[resItem.name] || 1;
                if (times > this.maxRetryTimes) {
                    delete this.retryTimesDic[resItem.name];
                    ResourceEvent.dispatchResourceEvent(this.resInstance, ResourceEvent.ITEM_LOAD_ERROR, groupName, resItem);
                }
                else {
                    this.retryTimesDic[resItem.name] = times + 1;
                    this.failedList.push(resItem);
                    this.next();
                    return;
                }
			}

			if(groupName){
				this.numLoadedDic[groupName]++;
                var itemsLoaded:number = this.numLoadedDic[groupName];
                var itemsTotal:number = this.groupTotalDic[groupName];
				if(!resItem.loaded){
					this.groupErrorDic[groupName] = true;
				}
                ResourceEvent.dispatchResourceEvent(this.resInstance,ResourceEvent.GROUP_PROGRESS,groupName,resItem,itemsLoaded,itemsTotal);
				if(itemsLoaded==itemsTotal){
					var groupError:boolean = this.groupErrorDic[groupName];
					this.removeGroupName(groupName);
					delete this.groupTotalDic[groupName];
					delete this.numLoadedDic[groupName];
					delete this.itemListDic[groupName];
					delete this.groupErrorDic[groupName];
					if(groupError){
						ResourceEvent.dispatchResourceEvent(this,ResourceEvent.GROUP_LOAD_ERROR,groupName);
					}
					else{
						ResourceEvent.dispatchResourceEvent(this,ResourceEvent.GROUP_COMPLETE,groupName);
					}
				}
			}
            else{
                this.callBack.call(this.resInstance,resItem);
            }
			this.next();
		}
		/**
		 * 从优先级队列中移除指定的组名
		 */
		private removeGroupName(groupName:string):void{
			for(var p in this.priorityQueue){
				var queue:Array<any> = this.priorityQueue[p];
				var length:number = queue.length;
				var index:number = 0;
				var found:boolean = false;
                var length:number = queue.length;
                for(var i:number=0;i<length;i++){
                    var name:string = queue[i];
					if(name==groupName){
						queue.splice(index,1);
						found = true;
						break;
					}
					index++;
				}
				if(found){
					if(queue.length==0){
						delete this.priorityQueue[p];
					}
					break;
				}
			}
		}
	}
}
