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
/// <reference path="../../../egret/events/IEventDispatcher.ts"/>
/// <reference path="../core/ResourceItem.ts"/>

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
		 * 配置文件加载并解析完成事件
		 * @constant {string} RES.ResourceEvent.CONFIG_COMPLETE
		 */		
		public static CONFIG_COMPLETE:string = "configComplete";
		/**
		 * 延迟加载组资源加载进度事件
		 * @constant {string} RES.ResourceEvent.GROUP_PROGRESS
		 */		
		public static GROUP_PROGRESS:string = "groupProgress";
		/**
		 * 延迟加载组资源加载完成事件
		 * @constant {string} RES.ResourceEvent.GROUP_COMPLETE
		 */		
		public static GROUP_COMPLETE:string = "groupComplete";
		/**
		 * 构造函数
		 * @method RES.ResourceEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
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
		public groupName:string;
		/**
		 * 一次加载项加载结束的项信息对象
		 * @member {egret.ResourceItem} RES.ResourceEvent#resItem
		 */		
		public resItem:ResourceItem;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
		 * @method RES.ResourceEvent.dispatchResourceEvent
		 * @param target {egret.IEventDispatcher} 
		 * @param type {string} 
		 * @param groupName {string} 
		 * @param resItem {egret.ResourceItem} 
		 * @param itemsLoaded {number} 
		 * @param itemsTotal {number} 
         */
        public static dispatchResourceEvent(target:egret.IEventDispatcher,type:string,
                                                    groupName:string="",resItem:ResourceItem=null,itemsLoaded:number=0,itemsTotal:number=0):void{
            var eventClass:any = ResourceEvent;
            var props:any = egret.Event._getPropertyData(eventClass);
            props.groupName = groupName;
            props.resItem = resItem;
            props.itemsLoaded = itemsLoaded;
            props.itemsTotal = itemsTotal;
            egret.Event._dispatchByTarget(eventClass,target,type,props);
        }
	}
}