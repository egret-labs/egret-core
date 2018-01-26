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
		 * 正在加载的组列表,key为groupName
		 */
		private itemListDic: any = {};
		/**
		 * 加载失败的组,key为groupName
		 */
		private groupErrorDic: any = {};

		private retryTimesDic: any = {};
		public maxRetryTimes = 3;
		/**
		 * 优先级队列,key为priority，value为groupName列表
		 */
		private priorityQueue: any = {};
		private reporterDic: any = {};
		private dispatcherDic: any = {};
		private failedList: Array<ResourceInfo> = new Array<ResourceInfo>();
		private loadItemErrorDic: any = {};
		private errorDic: any = {};

		load(list: ResourceInfo[], groupName: string, priority: number, reporter?: PromiseTaskReporter): Promise<any> {
			const total = list.length;
			for (let i: number = 0; i < total; i++) {
				const resInfo: ResourceInfo = list[i];
				if (!resInfo.groupNames) {
					resInfo.groupNames = [];
				}
				resInfo.groupNames.push(groupName);
			}
			this.itemListDic[groupName] = list;
			this.groupTotalDic[groupName] = list.length;
			this.numLoadedDic[groupName] = 0;
			if (this.priorityQueue[priority])
				this.priorityQueue[priority].push(groupName);
			else
				this.priorityQueue[priority] = [groupName];
			this.reporterDic[groupName] = reporter;
			const dispatcher = new egret.EventDispatcher();
			this.dispatcherDic[groupName] = dispatcher;
			const promise = new Promise((reslove, reject) => {
				dispatcher.addEventListener("complete", reslove, null);
				dispatcher.addEventListener("error", function (e: egret.Event) {
					reject(e.data);
				}, null);
			});
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
				this.loadingCount++;
				this.loadResource(r)
					.then(response => {
						this.loadingCount--;
						host.save(r, response);
						const groupName: string = <string>(<string[]>r.groupNames).shift();
						if ((<string[]>r.groupNames).length == 0) {
							r.groupNames = undefined;
						}
						const reporter = this.reporterDic[groupName];
						this.numLoadedDic[groupName]++;
						const current = this.numLoadedDic[groupName];
						const total = this.groupTotalDic[groupName];
						if (reporter && reporter.onProgress) {
							reporter.onProgress(current, total);
						}
						if (current == total) {
							const groupError: boolean = this.groupErrorDic[groupName];
							this.removeGroupName(groupName);
							delete this.groupTotalDic[groupName];
							delete this.numLoadedDic[groupName];
							delete this.itemListDic[groupName];
							delete this.groupErrorDic[groupName];
							const dispatcher: egret.EventDispatcher = this.dispatcherDic[groupName];
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
						this.next();
					}).catch((error) => {
						this.loadingCount--;
						delete host.state[r.name];
						const times = this.retryTimesDic[r.name] || 1;
						if (times > this.maxRetryTimes) {
							delete this.retryTimesDic[r.name];
							const groupName: string = <string>(<string[]>r.groupNames).shift();
							if ((<string[]>r.groupNames).length == 0) {
								delete r.groupNames;
							}
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
								reporter.onProgress(current, total);
							}
							if (current == total) {
								const groupError = this.groupErrorDic[groupName];
								this.removeGroupName(groupName);
								delete this.groupTotalDic[groupName];
								delete this.numLoadedDic[groupName];
								delete this.itemListDic[groupName];
								delete this.groupErrorDic[groupName];
								const itemList = this.loadItemErrorDic[groupName];
								delete this.loadItemErrorDic[groupName];
								const dispatcher = this.dispatcherDic[groupName];
								dispatcher.dispatchEventWith("error", false, { itemList, error });
							}
							else {
								this.errorDic[groupName] = error;
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
		 * 从优先级队列中移除指定的组名
		 */
		private removeGroupName(groupName: string): void {
			for (let p in this.priorityQueue) {
				const queue: any[] = this.priorityQueue[p];
				let index: number = 0;
				let found: boolean = false;
				const length: number = queue.length;
				for (let i: number = 0; i < length; i++) {
					const name: string = queue[i];
					if (name == groupName) {
						queue.splice(index, 1);
						found = true;
						break;
					}
					index++;
				}
				if (found) {
					if (queue.length == 0) {
						delete this.priorityQueue[p];
					}
					break;
				}
			}
		}

		private queueIndex: number = 0;

		/**
		 * 获取下一个待加载项
		 */
		private getOneResourceInfo(): ResourceInfo | undefined {
			if (this.failedList.length > 0)
				return this.failedList.shift();
			let maxPriority: number = Number.NEGATIVE_INFINITY;
			for (let p in this.priorityQueue) {
				maxPriority = Math.max(maxPriority, <number><any>p);
			}
			const queue: any[] = this.priorityQueue[maxPriority];
			if (!queue || queue.length == 0) {
				return undefined;
			}
			const length: number = queue.length;
			let list: Array<ResourceInfo> = [];
			for (let i: number = 0; i < length; i++) {
				if (this.queueIndex >= length)
					this.queueIndex = 0;
				list = this.itemListDic[queue[this.queueIndex]];
				if (list.length > 0)
					break;
				this.queueIndex++;
			}
			if (list.length == 0)
				return undefined;
			return list.shift();
		}


		loadResource(r: ResourceInfo, p?: RES.processor.Processor) {

			if (!p) {
				if (FEATURE_FLAG.FIX_DUPLICATE_LOAD == 1) {
					const s = host.state[r.name];
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
			host.state[r.name] = 1;
			const promise = p.onLoadStart(host, r);
			r.promise = promise;
			return promise;
		}

		unloadResource(r: ResourceInfo) {
			const data = host.get(r);
			if (!data) {
				console.warn("尝试释放不存在的资源:", r.name);
				return Promise.resolve();
			}
			const p = processor.isSupport(r);
			if (p) {
				host.state[r.name] = 3;
				const promise = p.onRemoveStart(host, r);
				host.remove(r);
				return promise;
			}
			else {
				return Promise.resolve();
			}
		}
	}
}
