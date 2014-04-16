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

/// <reference path="../../../egret/events/Event.ts"/>
/// <reference path="../../../egret/events/EventDispatcher.ts"/>
/// <reference path="../../../egret/events/UncaughtErrorEvent.ts"/>
/// <reference path="../core/UIGlobals.ts"/>
/// <reference path="../events/UIEvent.ts"/>
/// <reference path="layoutClass/DepthQueue.ts"/>

module ns_egret {

	export class LayoutManager extends EventDispatcher{
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
			UIGlobals.stage.removeEventListener(Event.ENTER_FRAME,this.doPhasedInstantiationCallBack);
			UIGlobals.stage.removeEventListener(Event.RENDER, this.doPhasedInstantiationCallBack);
			if(UIGlobals.catchCallLaterExceptions){
				try{
					this.doPhasedInstantiation();
				}
				catch(this.e:Error){
					var errorEvent:UncaughtErrorEvent = new UncaughtErrorEvent("callLaterError",false,true,this.e.getStackTrace());
					UIGlobals.stage.dispatchEvent(errorEvent);
				}
			}
			else{
				this.doPhasedInstantiation();
			}
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
						client.dispatchEvent(new UIEvent(UIEvent.UPDATE_COMPLETE));
					client.updateCompletePendingFlag = false;
					client = this.updateCompleteQueue.pop();
				}
				
				this.dispatchEvent(new UIEvent(UIEvent.UPDATE_COMPLETE));
			}
		}
		/**
		 * 立即应用所有延迟的属性
		 */		
		public validateNow():void{
			var infiniteLoopGuard:number = 0;
			while (this.listenersAttached && infiniteLoopGuard++ < 100)
				this.doPhasedInstantiationCallBack();
		}
		/**
		 * 使大于等于指定组件层级的元素立即应用属性 
		 * @param target 要立即应用属性的组件
		 * @param skipDisplayList 是否跳过更新显示列表阶段
		 */			
		public validateClient(target:ILayoutManagerClient, skipDisplayList:boolean = false):void{
			
			var obj:ILayoutManagerClient;
			var i:number = 0;
			var done:boolean = false;
			var oldTargetLevel:number = this.targetLevel;
			
			if (this.targetLevel == number.MAX_VALUE)
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
			
			if (oldTargetLevel == number.MAX_VALUE){
				this.targetLevel = number.MAX_VALUE;
				if (!skipDisplayList){
					obj = <ILayoutManagerClient> (this.updateCompleteQueue.removeLargestChild(target));
					while (obj){
						if (!obj.initialized)
							obj.initialized = true;
						
						if (obj.hasEventListener(UIEvent.UPDATE_COMPLETE))
							obj.dispatchEvent(new UIEvent(UIEvent.UPDATE_COMPLETE));
						obj.updateCompletePendingFlag = false;
						obj = <ILayoutManagerClient> (this.updateCompleteQueue.removeLargestChild(target));
					}
				}
			}
		}

	}
}