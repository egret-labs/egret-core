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
/// <reference path="../core/IContainer.ts"/>
/// <reference path="../core/IStateClient.ts"/>

module ns_egret {

	export class State extends EventDispatcher{
		public constructor(properties:any=null){
			super();
			for (var p:string in properties){
				this[p] = properties[p];
			}
		}
		/**
		 * 已经初始化标志 
		 */		
		private initialized:boolean = false;
		/**
		 * 该视图状态所基于的视图状态的名称；
		 * 如果该视图状态不是基于已命名的视图状态，则为 null。
		 * 如果该值为 null，则该视图状态基于根状态（包括不是使用 State 类为组件定义的属性、样式、事件处理函数和子项）。 
		 */		
		public basedOn:string;
		
		/**
		 * 视图状态的名称。给定组件的状态名称必须唯一。必须设置此属性。
		 */		
		public name:string;
		
		/**
		 * 该视图状态的覆盖，表现为实现 IOverride 接口的对象的数组。
		 * 这些覆盖在进入状态时按顺序应用，在退出状态时按相反的顺序删除。 
		 */		
		public overrides:Array  = [];
		/**
		 * 此视图状态作为 String 数组所属的状态组。 
		 */		
		public stateGroups:Array  = [];
		/**
		 * 初始化视图
		 */		
		public initialize(parent:IStateClient):void{
			if (!this.initialized){
				this.initialized = true;
				for (var i:number = 0; i < this.overrides.length; i++){
					(<IOverride> (this.overrides[i])).initialize(parent);
				}
			}
		}
		/**
		 * 抛出进入视图状态事件
		 */		
		public dispatchEnterState():void{
			if (this.hasEventListener("enterState"))
				this.dispatchEvent(new Event("enterState"));
		}
		/**
		 * 抛出即将退出视图状态事件
		 */		
		public dispatchExitState():void{
			if (this.hasEventListener("exitState"))
				this.dispatchEvent(new Event("exitState"));
		}
	}
	
}
