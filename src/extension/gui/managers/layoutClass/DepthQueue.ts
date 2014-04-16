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

/// <reference path="../../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../ILayoutManagerClient.ts"/>

module ns_egret {

	export class DepthQueue{
		public constructor(){
			super();
		}
		
		/**
		 * 深度队列
		 */
		private depthBins:Array = [];
		
		/**
		 * 最小深度
		 */
		private minDepth:number = 0;
		
		/**
		 * 最大深度
		 */
		private maxDepth:number = -1;
		/**
		 * 插入一个元素
		 */		
		public insert(client:ILayoutManagerClient):void{
			var depth:number = client.nestLevel;
			if (this.maxDepth < this.minDepth){
				this.minDepth = this.maxDepth = depth;
			}
			else{
				if (depth < this.minDepth)
					this.minDepth = depth;
				if (depth > this.maxDepth)
					this.maxDepth = depth;
			}
			
			var bin:DepthBin = this.depthBins[depth];
			
			if (!bin){
				bin = new DepthBin();
				this.depthBins[depth] = bin;
				bin.items[client] = true;
				bin.length++;
			}
			else{
				if (bin.items[client] == null){ 
					bin.items[client] = true;
					bin.length++;
				}
			}
		}
		/**
		 * 从队列尾弹出深度最大的一个对象
		 */		
		public pop():ILayoutManagerClient{
			var client:ILayoutManagerClient = null;
			
			if (this.minDepth <= this.maxDepth){
				var bin:DepthBin = this.depthBins[this.maxDepth];
				while (!bin || bin.length == 0){
					this.maxDepth--;
					if (this.maxDepth < this.minDepth)
						return null;
					bin = this.depthBins[this.maxDepth];
				}
				
				for (var key:any in bin.items ){
					client = <ILayoutManagerClient> key;
					this.remove(client, this.maxDepth);
					break;
				}
				
				while (!bin || bin.length == 0){
					this.maxDepth--;
					if (this.maxDepth < this.minDepth)
						break;
					bin = this.depthBins[this.maxDepth];
				}
				
			}
			
			return client;
		}
		/**
		 * 从队列首弹出深度最小的一个对象
		 */		
		public shift():ILayoutManagerClient{
			var client:ILayoutManagerClient = null;
			
			if (this.minDepth <= this.maxDepth){
				var bin:DepthBin = this.depthBins[this.minDepth];
				while (!bin || bin.length == 0){
					this.minDepth++;
					if (this.minDepth > this.maxDepth)
						return null;
					bin = this.depthBins[this.minDepth];
				}           
				
				for (var key:any in bin.items ){
					client = <ILayoutManagerClient> key;
					this.remove(client, this.minDepth);
					break;
				}
				
				while (!bin || bin.length == 0){
					this.minDepth++;
					if (this.minDepth > this.maxDepth)
						break;
					bin = this.depthBins[this.minDepth];
				}           
			}
			
			return client;
		}
		
		/**
		 * 移除大于等于指定组件层级的元素中最大的元素
		 */
		public removeLargestChild(client:ILayoutManagerClient ):any{
			var max:number = this.maxDepth;
			var min:number = client.nestLevel;
			
			while (min <= max){
				var bin:DepthBin = this.depthBins[max];
				if (bin && bin.length > 0){
					if (max == client.nestLevel){
						if (bin.items[client]){
							this.remove(<ILayoutManagerClient> client, max);
							return client;
						}
					}
					else{
						for (var key:any in bin.items ){
							if ((key instanceof DisplayObject) && (client instanceof DisplayObjectContainer)
								&&(<DisplayObjectContainer> client).contains(<DisplayObject> key)){
								this.remove(<ILayoutManagerClient> key, max);
								return key;
							}
						}
					}
					
					max--;
				}
				else{
					if (max == this.maxDepth)
						this.maxDepth--;
					max--;
					if (max < min)
						break;
				}           
			}
			
			return null;
		}
		
		/**
		 * 移除大于等于指定组件层级的元素中最小的元素
		 */
		public removeSmallestChild(client:ILayoutManagerClient ):any{
			var min:number = client.nestLevel;
			
			while (min <= this.maxDepth){
				var bin:DepthBin = this.depthBins[min];
				if (bin && bin.length > 0){   
					if (min == client.nestLevel){
						if (bin.items[client]){
							this.remove(<ILayoutManagerClient> client, min);
							return client;
						}
					}
					else{
						for (var key:any in bin.items){
							if ((key instanceof DisplayObject) && (client instanceof DisplayObjectContainer)
								&&(<DisplayObjectContainer> client).contains(<DisplayObject> key)){
								this.remove(<ILayoutManagerClient> key, min);
								return key;
							}
						}
					}
					
					min++;
				}
				else{
					if (min == this.minDepth)
						this.minDepth++;
					min++;
					if (min > this.maxDepth)
						break;
				}           
			}
			
			return null;
		}
		
		/**
		 * 移除一个元素
		 */
		public remove(client:ILayoutManagerClient,level:number=-1):ILayoutManagerClient{
			var depth:number = (level >= 0) ? level : client.nestLevel;
			var bin:DepthBin = this.depthBins[depth];
			if (bin && bin.items[client] != null){
				delete bin.items[client];
				bin.length--;
				return client;
			}
			return null;
		}
		
		/**
		 * 清空队列
		 */		
		public removeAll():void{
			this.depthBins.length = 0;
			this.minDepth = 0;
			this.maxDepth = -1;
		}
		/**
		 * 队列是否为空
		 */		
		public isEmpty():boolean{
			return this.minDepth > this.maxDepth;
		}
	}
}

/**
 * 列表项
 */
class DepthBin {
	public function DepthBin(){
		
	}
	public length:number;
	public items:any = {};
}