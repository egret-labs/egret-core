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
		private numLoadedDic: any = {};
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
		private findPriorityInDic(item: ResourceInfo) {
			for (let priority in this.itemListPriorityDic) {
				if (this.itemListPriorityDic[priority].indexOf(item) > -1)
					return parseInt(priority);
			}
			return undefined;
		}
		private updatelistPriority(list: ResourceInfo[], priority: number) {
			if (this.itemListPriorityDic[priority] == undefined) {
				this.itemListPriorityDic[priority] = [];
			}
			for (let item of list) {
				if (this.itemLoadDic[item.name] == 1) {
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
		load(list: ResourceInfo[], groupName: string, priority: number, reporter?: PromiseTaskReporter): Promise<any> {
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
			const promise = new Promise((reslove, reject) => {
				dispatcher.addEventListener("complete", reslove, null);
				dispatcher.addEventListener("error", function (e: egret.Event) {
					reject(e.data);
				}, null);
			});
			this.promiseHash[groupName] = promise;
			this.next();
			return promise;
		}

		private loadingCount: number = 0;
		public thread: number = 4;

		private next(): void {
			while (this.loadingCount < this.thread) {
				const r: ResourceInfo = <ResourceInfo>this.getOneResourceInfo();
				if (!r)
					break;
				this.itemLoadDic[r.name] = 1;
				this.loadingCount++;
				this.loadResource(r)
					.then(response => {
						this.loadingCount--;
						delete this.itemLoadDic[r.name];
						host.save(r, response);
						const groupNames: string[] = [];
						for (let groupName of <string[]>r.groupNames) {
							groupNames.push(groupName);
						}
						delete r.groupNames;
						for (let groupName of groupNames) {
							const reporter = this.reporterDic[groupName];
							this.numLoadedDic[groupName]++;
							const current = this.numLoadedDic[groupName];
							const total = this.groupTotalDic[groupName];
							if (reporter && reporter.onProgress) {
								reporter.onProgress(current, total, r);
							}
							if (current == total) {
								const groupError: boolean = this.groupErrorDic[groupName];
								delete this.groupTotalDic[groupName];
								delete this.numLoadedDic[groupName];
								delete this.reporterDic[groupName];
								delete this.groupErrorDic[groupName];
								delete this.promiseHash[groupName];
								const dispatcher: egret.EventDispatcher = this.dispatcherDic[groupName];
								delete this.dispatcherDic[groupName];
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
							}
						}
						this.next();
					}).catch((error) => {
						if (!error) {
							throw `${r.name} load fail`;
						}
						if (!error.__resource_manager_error__) {
							throw error;
						}
						delete this.itemLoadDic[r.name];
						this.loadingCount--;
						delete host.state[r.root + r.name];
						const times = this.retryTimesDic[r.name] || 1;
						if (times > this.maxRetryTimes) {
							delete this.retryTimesDic[r.name];
							const groupNames: string[] = [];
							for (let groupName of <string[]>r.groupNames) {
								groupNames.push(groupName);
							}
							delete r.groupNames;
							for (let groupName of groupNames) {
								if (!this.loadItemErrorDic[groupName]) {
									this.loadItemErrorDic[groupName] = [];
								}
								if (this.loadItemErrorDic[groupName].indexOf(r) == -1) {
									this.loadItemErrorDic[groupName].push(r);
								}
								this.groupErrorDic[groupName] = true;
								const reporter = this.reporterDic[groupName];
								this.numLoadedDic[groupName]++;
								const current = this.numLoadedDic[groupName];
								const total = this.groupTotalDic[groupName];
								if (reporter && reporter.onProgress) {
									reporter.onProgress(current, total, r);
								}
								if (current == total) {
									delete this.groupTotalDic[groupName];
									delete this.numLoadedDic[groupName];
									delete this.groupErrorDic[groupName];
									delete this.reporterDic[groupName];
									delete this.promiseHash[groupName];
									const itemList = this.loadItemErrorDic[groupName];
									delete this.loadItemErrorDic[groupName];
									const dispatcher = this.dispatcherDic[groupName];
									delete this.dispatcherDic[groupName];
									dispatcher.dispatchEventWith("error", false, { itemList, error });
								}
								else {
									this.errorDic[groupName] = error;
								}
							}
							this.next();
						}
						else {
							this.retryTimesDic[r.name] = times + 1;
							this.failedList.push(r);
							this.next();
							return;
						}
					})
			}
		}

		/**
		 * 获取下一个待加载项
		 */
		private getOneResourceInfo(): ResourceInfo | undefined {
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
				return this.getOneResourceInfo();
			}
			return list.shift();
		}


		loadResource(r: ResourceInfo, p?: RES.processor.Processor) {

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

		unloadResource(r: ResourceInfo) {
			const data = host.get(r);
			if (!data) {
				console.warn("尝试释放不存在的资源:", r.name);
				return false;
			}
			const p = processor.isSupport(r);
			if (p) {
				// host.state[r.root + r.name] = 3;
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
