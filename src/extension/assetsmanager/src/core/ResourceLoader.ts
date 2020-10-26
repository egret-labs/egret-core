//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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
	 * @private
	 */
	export class ResourceLoader {
		/**
		 * 当前组加载的项总个数,key为groupName
		 */
		private groupTotalDic: any = {};
		/**
		 * 已经加载的项个数,key为groupName
		 */
		private numLoadedDic: { [name: string]: number } = {};
		/**
		 * 加载失败的组,key为groupName
		 */
		private groupErrorDic: any = {};
		private retryTimesDic: any = {};
		public maxRetryTimes = 3;
		private reporterDic: any = {};
		private dispatcherDic: any = {};
		private failedList: Array<ResourceInfo> = new Array<ResourceInfo>();
		private loadItemErrorDic: any = {};
		private errorDic: any = {};
		/**
		 * 资源优先级队列，key为资源，value为优先级
		 */
		private itemListPriorityDic: { [priority: number]: ResourceInfo[] } = {};
		/**
		 * 资源是否在加载
		 */
		private itemLoadDic: { [name: string]: 1 } = {};
		private promiseHash: any = {};

		/**
		 * 延迟加载队列,getResByUrl ,getResAsync等方法存储队列
		 */
		private lazyLoadList: Array<ResourceInfo> = new Array<ResourceItem>();
		pushResItem(resInfo: ResourceInfo): Promise<any> {
			if (this.promiseHash[resInfo.root + resInfo.name]) {
				return this.promiseHash[resInfo.root + resInfo.name];
			}
			this.lazyLoadList.push(resInfo);
			this.itemListPriorityDic[Number.NEGATIVE_INFINITY] = this.lazyLoadList;
			this.updatelistPriority(this.lazyLoadList, Number.NEGATIVE_INFINITY);

			const dispatcher = new egret.EventDispatcher();
			this.dispatcherDic[resInfo.root + resInfo.name] = dispatcher;
			const promise = new Promise((resolve, reject) => {
				dispatcher.addEventListener("complete", function (e: egret.Event) {
					resolve(e.data);
				}, null);
				dispatcher.addEventListener("error", function (e: egret.Event) {
					reject(e.data);
				}, null);
			});
			this.promiseHash[resInfo.root + resInfo.name] = promise;
			this.loadNextResource();
			return promise;
		}
		/**
		 * 加载队列,存储组的队列
		 */
		pushResGroup(list: ResourceInfo[], groupName: string, priority: number, reporter?: PromiseTaskReporter): Promise<any> {
			if (this.promiseHash[groupName]) {
				return this.promiseHash[groupName];
			}
			const total = list.length;
			for (let i: number = 0; i < total; i++) {
				const resInfo: ResourceInfo = list[i];
				if (!resInfo.groupNames) {
					resInfo.groupNames = [];
				}
				resInfo.groupNames.push(groupName);
			}
			this.groupTotalDic[groupName] = list.length;
			this.numLoadedDic[groupName] = 0;
			this.updatelistPriority(list, priority);
			this.reporterDic[groupName] = reporter;
			const dispatcher = new egret.EventDispatcher();
			this.dispatcherDic[groupName] = dispatcher;
			const promise = new Promise((resolve, reject) => {
				dispatcher.addEventListener("complete", resolve, null);
				dispatcher.addEventListener("error", function (e: egret.Event) {
					reject(e.data);
				}, null);
			});
			this.promiseHash[groupName] = promise;
			this.loadNextResource();
			return promise;
		}
		/**
		 * 更新组的优先级顺序
		 * @param list 存储数据的队列
		 * @param priority 优先级
		 */
		private updatelistPriority(list: ResourceInfo[], priority: number) {
			if (this.itemListPriorityDic[priority] == undefined) {
				this.itemListPriorityDic[priority] = [];
			}
			for (let item of list) {
				if (this.itemLoadDic[item.root + item.name] == 1) {
					continue;
				}
				let oldPriority = this.findPriorityInDic(item);
				if (oldPriority == undefined) {
					this.itemListPriorityDic[priority].push(item);
				} else {
					if (oldPriority < priority) {
						this.itemListPriorityDic[priority].push(item);
						const index = this.itemListPriorityDic[oldPriority].indexOf(item);
						this.itemListPriorityDic[oldPriority].splice(index, 1);
					}
				}
			}
		}
		/**
		 * 搜索单项资源的优先级
		 * @param item 单项资源
		 */
		private findPriorityInDic(item: ResourceInfo) {
			for (let priority in this.itemListPriorityDic) {
				if (this.itemListPriorityDic[priority].indexOf(item) > -1)
					return parseInt(priority);
			}
			return undefined;
		}
		private loadingCount: number = 0;
		/**
		 * 最大线程数目
		 */
		public thread: number = 4;
		/**
		 * 加载下一项资源，线程控制
		 */
		private loadNextResource(): void {
			while (this.loadingCount < this.thread) {
				let isload = this.loadSingleResource();
				if (!isload) {
					break;
				}
			}
		}
		/**
		 * 加载单向资源
		 */
		private loadSingleResource(): boolean {
			let r: ResourceInfo = <ResourceInfo>this.getOneResourceInfoInGroup();
			if (!r) return false;
			this.itemLoadDic[r.root + r.name] = 1;
			this.loadingCount++;

			this.loadResource(r)
				.then(response => {
					this.loadingCount--;
					delete this.itemLoadDic[r.root + r.name];
					host.save(r, response);
					if (this.promiseHash[r.root + r.name]) {
						const dispatcher: egret.EventDispatcher = this.deleteDispatcher(r.root + r.name);
						dispatcher.dispatchEventWith("complete", false, response);
					}
					const groupNames = r.groupNames;
					if (groupNames) {
						delete r.groupNames;
						for (let groupName of groupNames) {
							if (this.setGroupProgress(groupName, r)) {
								this.loadGroupEnd(groupName);
							}
						}
					}
					this.loadNextResource();
				}).catch((error) => {
					if (!error) {
						throw `${r.name} load fail`;
					}
					if (!error.__resource_manager_error__) {
						throw error;
					}
					delete this.itemLoadDic[r.root + r.name];
					this.loadingCount--;
					delete host.state[r.root + r.name];
					const times = this.retryTimesDic[r.name] || 1;
					if (times > this.maxRetryTimes) {
						delete this.retryTimesDic[r.name];
						if (this.promiseHash[r.root + r.name]) {
							const dispatcher: egret.EventDispatcher = this.deleteDispatcher(r.root + r.name);
							dispatcher.dispatchEventWith("error", false, { r, error });
						}
						const groupNames = r.groupNames;
						if (groupNames) {
							delete r.groupNames;
							for (let groupName of groupNames) {
								if (!this.loadItemErrorDic[groupName]) {
									this.loadItemErrorDic[groupName] = [];
								}
								if (this.loadItemErrorDic[groupName].indexOf(r) == -1) {
									this.loadItemErrorDic[groupName].push(r);
								}
								this.groupErrorDic[groupName] = true;
								if (this.setGroupProgress(groupName, r)) {
									this.loadGroupEnd(groupName, error);
								}
								else {
									this.errorDic[groupName] = error;
								}
							}
						}
						this.loadNextResource();
					}
					else {
						this.retryTimesDic[r.name] = times + 1;
						this.failedList.push(r);
						this.loadNextResource();
						return;
					}
				})
			return true;
		}
		/**
		 * 获取下一个待加载项
		 */
		private getOneResourceInfoInGroup(): ResourceInfo | undefined {
			if (this.failedList.length > 0)
				return this.failedList.shift();
			let maxPriority: number = Number.NEGATIVE_INFINITY;
			for (let p in this.itemListPriorityDic) {
				maxPriority = Math.max(maxPriority, <number><any>p);
			}
			const list: any[] = this.itemListPriorityDic[maxPriority];
			if (!list) {
				return undefined;
			}
			if (list.length == 0) {
				delete this.itemListPriorityDic[maxPriority];
				return this.getOneResourceInfoInGroup();
			}
			return list.shift();
		}
		/**
		 * 设置组的加载进度，同时返回当前组是否加载完成
		 * @param groupName 组名
		 * @param r 加载完成的资源
		 */
		private setGroupProgress(groupName: string, r: ResourceInfo) {
			const reporter = this.reporterDic[groupName];
			this.numLoadedDic[groupName]++;
			const current = this.numLoadedDic[groupName];
			const total = this.groupTotalDic[groupName];
			if (reporter && reporter.onProgress) {
				reporter.onProgress(current, total, r);
			}
			return current == total;
		}
		/**
		 * 加载组的最后一项，同时派发事件
		 * @param groupName 组名
		 * @param lastError 最后一项是否成功，此项为错误信息
		 */
		private loadGroupEnd(groupName: string, lastError?: any) {
			delete this.groupTotalDic[groupName];
			delete this.numLoadedDic[groupName];
			delete this.reporterDic[groupName];
			const dispatcher = this.deleteDispatcher(groupName);

			if (!lastError) {
				const groupError: boolean = this.groupErrorDic[groupName];
				delete this.groupErrorDic[groupName];
				if (groupError) {
					const itemList = this.loadItemErrorDic[groupName];
					delete this.loadItemErrorDic[groupName];
					const error = this.errorDic[groupName];
					delete this.errorDic[groupName];
					dispatcher.dispatchEventWith("error", false, { itemList, error });
				}
				else {
					dispatcher.dispatchEventWith("complete");
				}
			} else {
				delete this.groupErrorDic[groupName];
				const itemList = this.loadItemErrorDic[groupName];
				delete this.loadItemErrorDic[groupName];
				dispatcher.dispatchEventWith("error", false, { itemList, error: lastError });
			}
		}
		/**
		 * 删除事件派发器，Promise的缓存，返回事件派发器
		 * @param groupName 组名或是root+name
		 */
		private deleteDispatcher(groupName: string) {
			delete this.promiseHash[groupName];
			const dispatcher = this.dispatcherDic[groupName];
			delete this.dispatcherDic[groupName];
			return dispatcher;
		}
		/**
		 * 加载资源
		 * @param r 资源信息 
		 * @param p 加载处理器
		 */
		private loadResource(r: ResourceInfo, p?: RES.processor.Processor) {
			if (!p) {
				if (FEATURE_FLAG.FIX_DUPLICATE_LOAD == 1) {
					const s = host.state[r.root + r.name];
					if (s == 2) {
						return Promise.resolve(host.get(r));
					}
					if (s == 1) {
						return r.promise as Promise<any>
					}
				}
				p = processor.isSupport(r);
			}
			if (!p) {
				throw new ResourceManagerError(2001, r.name, r.type);
			}
			host.state[r.root + r.name] = 1;
			const promise = p.onLoadStart(host, r);
			r.promise = promise;
			return promise;
		}
		/**
		 * 释放资源
		 * @param r 资源信息 
		 */
		unloadResource(r: ResourceInfo) {
			const data = host.get(r);
			if (!data) {
				console.warn("尝试释放不存在的资源:", r.name);
				return false;
			}
			const p = processor.isSupport(r);
			if (p) {
				p.onRemoveStart(host, r);
				host.remove(r);
				if (r.extra == 1) {
					config.removeResourceData(r);
				}
				return true;
			}
			else {
				return true;
			}
		}
	}
}
