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
/// <reference path="../components/IItemRenderer.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.RendererExistenceEvent
	 * @classdesc
	 * 在DataGroup添加或删除项呈示器时分派的事件。
	 * @extends ns_egret.Event
	 */	
	export class RendererExistenceEvent extends Event{
		/**
		 * 添加了项呈示器 
		 * @constant ns_egret.RendererExistenceEvent.RENDERER_ADD
		 */		
		public static RENDERER_ADD:string = "rendererAdd";
		/**
		 * 移除了项呈示器 
		 * @constant ns_egret.RendererExistenceEvent.RENDERER_REMOVE
		 */		
		public static RENDERER_REMOVE:string = "rendererRemove";

		/**
		 * @method ns_egret.RendererExistenceEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 * @param renderer {IItemRenderer} 
		 * @param index {number} 
		 * @param data {any} 
		 */
		public constructor(type:string, bubbles:boolean = false,
											   cancelable:boolean = false,renderer:IItemRenderer = null, 
											   index:number = -1, data:any = null){
			super(type, bubbles, cancelable);
			
			this.renderer = renderer;
			this.index = index;
			this.data = data;
		}
		
		/**
		 * 呈示器的数据项目。 
		 * @member ns_egret.RendererExistenceEvent#data
		 */		
		public data:any;
		
		/**
		 * 指向已添加或删除项呈示器的位置的索引。 
		 * @member ns_egret.RendererExistenceEvent#index
		 */		
		public index:number;
		
		/**
		 * 对已添加或删除的项呈示器的引用。 
		 * @member ns_egret.RendererExistenceEvent#renderer
		 */		
		public renderer:IItemRenderer;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method ns_egret.RendererExistenceEvent.dispatchRendererExistenceEvent
         */
        public static dispatchRendererExistenceEvent(target:IEventDispatcher,type:string,renderer:IItemRenderer = null,
                                             index:number = -1, data:any = null):void{
            var eventClass:any = RendererExistenceEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.renderer = renderer;
            props.index = index;
            props.data = data;
            Event._dispatchByTarget(eventClass,target,type,false,props)
        }
	}
}