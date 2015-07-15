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
	 * @class egret.gui.LayoutManager
	 * @classdesc
	 * 布局管理器
	 * @extends egret.EventDispatcher
	 */
	export class LayoutManager extends EventDispatcher{
		/**
		 * @method egret.gui.LayoutManager#constructor
		 */
		public constructor(){
			super();
		}
		
		private targetLevel:number = Number.MAX_VALUE;
		/**
		 * 需要抛出组件初始化完成事件的对象 
		 */		
		private updateCompleteQueue:DepthQueue = new DepthQueue();
		
		private invalidatePropertiesFlag:boolean = false;
		
		private invalidateClientPropertiesFlag:boolean = false;
		
		private invalidatePropertiesQueue:DepthQueue = new DepthQueue();
		/**
		 * 标记组件提交过属性
		 * @method egret.gui.LayoutManager#invalidateProperties
		 * @param client {ILayoutManagerClient} 
		 */		
		public invalidateProperties(client:ILayoutManagerClient):void{
			if(!this.invalidatePropertiesFlag){
				this.invalidatePropertiesFlag = true;
				if(!this.listenersAttached)
					this.attachListeners();
			}
			if (this.targetLevel <= client.nestLevel)
				this.invalidateClientPropertiesFlag = true;
			this.invalidatePropertiesQueue.insert(client);
		}
		
		/**
		 * 使提交的属性生效
		 */		
		private validateProperties():void{
			var client:ILayoutManagerClient = this.invalidatePropertiesQueue.shift();
			while(client){
				if (client.parent){
					client.validateProperties();
					if (!client.updateCompletePendingFlag){
						this.updateCompleteQueue.insert(client);
						client.updateCompletePendingFlag = true;
					}
				}        
				client = this.invalidatePropertiesQueue.shift();
			}
			if(this.invalidatePropertiesQueue.isEmpty())
				this.invalidatePropertiesFlag = false;
		}
		
		private invalidateSizeFlag:boolean = false;
		
		private invalidateClientSizeFlag:boolean = false;
		
		private invalidateSizeQueue:DepthQueue = new DepthQueue();
		/**
		 * 标记需要重新测量尺寸
		 * @method egret.gui.LayoutManager#invalidateSize
		 * @param client {ILayoutManagerClient} 
		 */		
		public invalidateSize(client:ILayoutManagerClient ):void{
			if(!this.invalidateSizeFlag){
				this.invalidateSizeFlag = true;
				if(!this.listenersAttached)
					this.attachListeners();
			}
			if (this.targetLevel <= client.nestLevel)
				this.invalidateClientSizeFlag = true;
			this.invalidateSizeQueue.insert(client);
		}
		/**
		 * 测量属性
		 */		
		private validateSize():void{
			var client:ILayoutManagerClient = this.invalidateSizeQueue.pop();
			while(client){
				if (client.parent){
					client.validateSize();
					if (!client.updateCompletePendingFlag){
						this.updateCompleteQueue.insert(client);
						client.updateCompletePendingFlag = true;
					}
				}      
				client = this.invalidateSizeQueue.pop();
			}
			if(this.invalidateSizeQueue.isEmpty())
				this.invalidateSizeFlag = false;
		}
		
		
		private invalidateDisplayListFlag:boolean = false;
		
		private invalidateDisplayListQueue:DepthQueue = new DepthQueue();
		/**
		 * 标记需要重新测量尺寸
		 * @method egret.gui.LayoutManager#invalidateDisplayList
		 * @param client {ILayoutManagerClient} 
		 */		
		public invalidateDisplayList(client:ILayoutManagerClient ):void{
			if(!this.invalidateDisplayListFlag){
				this.invalidateDisplayListFlag = true;
				if(!this.listenersAttached)
					this.attachListeners();
			}
			this.invalidateDisplayListQueue.insert(client);
		}
		/**
		 * 测量属性
		 */		
		private validateDisplayList():void{
			var client:ILayoutManagerClient = this.invalidateDisplayListQueue.shift();
			while(client){
				if (client.parent){
					client.validateDisplayList();
					if (!client.updateCompletePendingFlag){
						this.updateCompleteQueue.insert(client);
						client.updateCompletePendingFlag = true;
					}
				}      
				client = this.invalidateDisplayListQueue.shift();
			}
			if(this.invalidateDisplayListQueue.isEmpty())
				this.invalidateDisplayListFlag = false;
		}
		/** 
		 * 是否已经添加了事件监听
		 */		
		private listenersAttached:boolean = false;
		/**
		 * 添加事件监听
		 */		
		private attachListeners():void{
			UIGlobals.stage.addEventListener(Event.ENTER_FRAME,this.doPhasedInstantiationCallBack,this);
			UIGlobals.stage.addEventListener(Event.RENDER, this.doPhasedInstantiationCallBack,this);
			UIGlobals.stage.invalidate();
			this.listenersAttached = true;
		}
		
		/**
		 * 执行属性应用
		 */		
		private doPhasedInstantiationCallBack(event:Event=null):void{
			UIGlobals.stage.removeEventListener(Event.ENTER_FRAME,this.doPhasedInstantiationCallBack,this);
			UIGlobals.stage.removeEventListener(Event.RENDER, this.doPhasedInstantiationCallBack,this);
			this.doPhasedInstantiation();
		}
		
		private doPhasedInstantiation():void{
			if (this.invalidatePropertiesFlag){
				this.validateProperties();
			}
			if (this.invalidateSizeFlag){
				this.validateSize();
			}
			
			if (this.invalidateDisplayListFlag){
				this.validateDisplayList();
			}
			
			if (this.invalidatePropertiesFlag ||
				this.invalidateSizeFlag ||
				this.invalidateDisplayListFlag){
				this.attachListeners();
			}
			else{
				this.listenersAttached = false;
				var client:ILayoutManagerClient = this.updateCompleteQueue.pop();
				while (client){
					if (!client.initialized)
						client.initialized = true;
					if (client.hasEventListener(UIEvent.UPDATE_COMPLETE))
                        UIEvent.dispatchUIEvent(client,UIEvent.UPDATE_COMPLETE);
					client.updateCompletePendingFlag = false;
					client = this.updateCompleteQueue.pop();
				}
				UIEvent.dispatchUIEvent(this,UIEvent.UPDATE_COMPLETE);
			}
		}
		/**
		 * 立即应用所有延迟的属性
		 * @method egret.gui.LayoutManager#validateNow
		 */		
		public validateNow():void{
			var infiniteLoopGuard:number = 0;
			while (this.listenersAttached && infiniteLoopGuard++ < 100)
				this.doPhasedInstantiationCallBack();
		}
		/**
		 * 使大于等于指定组件层级的元素立即应用属性 
		 * @method egret.gui.LayoutManager#validateClient
		 * @param target {ILayoutManagerClient} 要立即应用属性的组件
		 * @param skipDisplayList {boolean} 是否跳过更新显示列表阶段
		 */			
		public validateClient(target:ILayoutManagerClient, skipDisplayList:boolean = false):void{
			
			var obj:ILayoutManagerClient;
			var i:number = 0;
			var done:boolean = false;
			var oldTargetLevel:number = this.targetLevel;
			
			if (this.targetLevel == Number.MAX_VALUE)
				this.targetLevel = target.nestLevel;
			
			while (!done){
				done = true;
				
				obj = <ILayoutManagerClient> (this.invalidatePropertiesQueue.removeSmallestChild(target));
				while (obj){
					if (obj.parent){
						obj.validateProperties();
						if (!obj.updateCompletePendingFlag){
							this.updateCompleteQueue.insert(obj);
							obj.updateCompletePendingFlag = true;
						}
					}
					obj = <ILayoutManagerClient> (this.invalidatePropertiesQueue.removeSmallestChild(target));
				}
				
				if (this.invalidatePropertiesQueue.isEmpty()){
					this.invalidatePropertiesFlag = false;
				}
				this.invalidateClientPropertiesFlag = false;
				
				obj = <ILayoutManagerClient> (this.invalidateSizeQueue.removeLargestChild(target));
				while (obj){
					if (obj.parent){
						obj.validateSize();
						if (!obj.updateCompletePendingFlag){
							this.updateCompleteQueue.insert(obj);
							obj.updateCompletePendingFlag = true;
						}
					}
					if (this.invalidateClientPropertiesFlag){
						obj = <ILayoutManagerClient> (this.invalidatePropertiesQueue.removeSmallestChild(target));
						if (obj){
							this.invalidatePropertiesQueue.insert(obj);
							done = false;
							break;
						}
					}
					
					obj = <ILayoutManagerClient> (this.invalidateSizeQueue.removeLargestChild(target));
				}
				
				if (this.invalidateSizeQueue.isEmpty()){
					this.invalidateSizeFlag = false;
				}
				this.invalidateClientPropertiesFlag = false;
				this.invalidateClientSizeFlag = false;
				
				if (!skipDisplayList){
					obj = <ILayoutManagerClient> (this.invalidateDisplayListQueue.removeSmallestChild(target));
					while (obj){
						if (obj.parent){
							obj.validateDisplayList();
							if (!obj.updateCompletePendingFlag){
								this.updateCompleteQueue.insert(obj);
								obj.updateCompletePendingFlag = true;
							}
						}
						if (this.invalidateClientPropertiesFlag){
							obj = <ILayoutManagerClient> (this.invalidatePropertiesQueue.removeSmallestChild(target));
							if (obj){
								this.invalidatePropertiesQueue.insert(obj);
								done = false;
								break;
							}
						}
						
						if (this.invalidateClientSizeFlag){
							obj = <ILayoutManagerClient> (this.invalidateSizeQueue.removeLargestChild(target));
							if (obj){
								this.invalidateSizeQueue.insert(obj);
								done = false;
								break;
							}
						}
						
						obj = <ILayoutManagerClient> (this.invalidateDisplayListQueue.removeSmallestChild(target));
					}
					
					
					if (this.invalidateDisplayListQueue.isEmpty()){
						this.invalidateDisplayListFlag = false;
					}
				}
			}
			
			if (oldTargetLevel == Number.MAX_VALUE){
				this.targetLevel = Number.MAX_VALUE;
				if (!skipDisplayList){
					obj = <ILayoutManagerClient> (this.updateCompleteQueue.removeLargestChild(target));
					while (obj){
						if (!obj.initialized)
							obj.initialized = true;
						
						if (obj.hasEventListener(UIEvent.UPDATE_COMPLETE))
                            UIEvent.dispatchUIEvent(obj,UIEvent.UPDATE_COMPLETE);
						obj.updateCompletePendingFlag = false;
						obj = <ILayoutManagerClient> (this.updateCompleteQueue.removeLargestChild(target));
					}
				}
			}
		}

	}
}