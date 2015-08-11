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
	 * @class RES.ResourceEvent
	 * @classdesc
	 * @extends egret.Event
	 */
	export class ResourceEvent extends egret.Event{
		/**
		 * 一个加载项加载失败事件。
		 * @constant {string} RES.ResourceEvent.ITEM_LOAD_ERROR
		 */
		public static ITEM_LOAD_ERROR:string = "itemLoadError";
		/**
		 * 配置文件加载并解析完成事件。注意：若有配置文件加载失败，将不会抛出此事件，若要处理配置加载失败，请同时监听CONFIG_LOAD_ERROR事件。
		 * @constant {string} RES.ResourceEvent.CONFIG_COMPLETE
		 */		
		public static CONFIG_COMPLETE:string = "configComplete";
		/**
		 * 配置文件加载失败事件
		 * @constant {string} RES.ResourceEvent.CONFIG_COMPLETE
		 */
		public static CONFIG_LOAD_ERROR:string = "configLoadError";
		/**
		 * 延迟加载组资源加载进度事件
		 * @constant {string} RES.ResourceEvent.GROUP_PROGRESS
		 */		
		public static GROUP_PROGRESS:string = "groupProgress";
		/**
		 * 延迟加载组资源加载完成事件。注意：若组内有资源项加载失败，将不会抛出此事件，若要处理组加载失败，请同时监听GROUP_LOAD_ERROR事件。
		 * @constant {string} RES.ResourceEvent.GROUP_COMPLETE
		 */		
		public static GROUP_COMPLETE:string = "groupComplete";
		/**
		 * 延迟加载组资源加载失败事件
		 * @constant {string} RES.ResourceEvent.GROUP_LOAD_ERROR
		 */
		public static GROUP_LOAD_ERROR:string = "groupLoadError";
		/**
		 * 构造函数
		 * @method RES.ResourceEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean}
		 * @private
		 */		
		public constructor(type:string, bubbles:boolean=false, cancelable:boolean=false){
			super(type, bubbles, cancelable);
		}
		/**
		 * 已经加载的文件数
		 * @member {number} RES.ResourceEvent#itemsLoaded
		 */
		public itemsLoaded:number=0;
		/**
		 * 要加载的总文件数
		 * @member {number} RES.ResourceEvent#itemsTotal
		 */
		public itemsTotal:number=0;
		/**
		 * 资源组名
		 * @member {string} RES.ResourceEvent#groupName
		 */		
		public groupName:string = "";
		/**
		 * 一次加载项加载结束的项信息对象
		 * @member {egret.ResourceItem} RES.ResourceEvent#resItem
		 */		
		public resItem:ResourceItem = null;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
		 * @method RES.ResourceEvent.dispatchResourceEvent
		 * @param target {egret.IEventDispatcher} 
		 * @param type {string} 
		 * @param groupName {string} 
		 * @param resItem {egret.ResourceItem} 
		 * @param itemsLoaded {number} 
		 * @param itemsTotal {number}
		 * @private
         */
        public static dispatchResourceEvent(target:egret.IEventDispatcher,type:string,
                                                    groupName:string="",resItem:ResourceItem=null,itemsLoaded:number=0,itemsTotal:number=0):boolean{
			var event:ResourceEvent = egret.Event.create(ResourceEvent, type);
			event.groupName = groupName;
			event.resItem = resItem;
			event.itemsLoaded = itemsLoaded;
			event.itemsTotal = itemsTotal;
			var result = target.dispatchEvent(event);
			egret.Event.release(event);
			return result;
        }
	}
}