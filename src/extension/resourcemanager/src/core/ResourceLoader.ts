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


		load(list: ResourceInfo[], reporter?: PromiseTaskReporter): Promise<ResourceInfo | ResourceInfo[]> {

			let current = 0;
			let total = 1;
			let mapper = (r: ResourceInfo) =>
				this.loadResource(r)
					.then(response => {
						host.save(r, response);
						current++;
						if (reporter && reporter.onProgress) {
							reporter.onProgress(current, total);
						}
						return response;
					})


			total = list.length;
			return Promise.all(list.map(mapper));
		};


		loadResource(r: ResourceInfo, p?: RES.processor.Processor) {

			if (!p) {
				if (FEATURE_FLAG.FIX_DUPLICATE_LOAD == 1) {
					let s = host.state[r.name];
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
			let promise = p.onLoadStart(host, r);
			r.promise = promise
			return promise;
		}

		unloadResource(r: ResourceInfo) {
			let data = host.get(r);
			if (!data) {
				console.warn("尝试释放不存在的资源:", r.name);
				return Promise.resolve();
			}
			let p = processor.isSupport(r);
			if (p) {
				host.state[r.name] = 3;
				let promise = p.onRemoveStart(host, r);
				host.remove(r);
				return promise;
			}
			else {
				return Promise.resolve();
			}
		}
	}
}
