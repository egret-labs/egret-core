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
/// <reference path="../core/IStateClient.ts"/>
/// <reference path="IOverride.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.State
	 * @classdesc
	 * State 类定义视图状态，即组件的特定视图。
	 * @extends ns_egret.HashObject
	 */
	export class State extends HashObject{
		/**
		 * @method ns_egret.State#constructor
		 * @param properties {any} 
		 */
		public constructor(properties:any=null){
			super();
			for (var p in properties){
				this[p] = properties[p];
			}
		}
		/**
		 * 已经初始化标志 
		 */		
		private initialized:boolean = false;

		/**
		 * 视图状态的名称。给定组件的状态名称必须唯一。必须设置此属性。
		 * @member ns_egret.State#name
		 */		
		public name:string;
		
		/**
		 * 该视图状态的覆盖，表现为实现 IOverride 接口的对象的数组。
		 * 这些覆盖在进入状态时按顺序应用，在退出状态时按相反的顺序删除。 
		 * @member ns_egret.State#overrides
		 */		
		public overrides:Array<any>  = [];
		/**
		 * 此视图状态作为 String 数组所属的状态组。 
		 * @member ns_egret.State#stateGroups
		 */		
		public stateGroups:Array<any>  = [];
		/**
		 * 初始化视图
		 * @method ns_egret.State#initialize
		 * @param parent {IStateClient} 
		 */		
		public initialize(parent:IStateClient):void{
			if (!this.initialized){
				this.initialized = true;
				for (var i:number = 0; i < this.overrides.length; i++){
					(<IOverride> (this.overrides[i])).initialize(parent);
				}
			}
		}
	}
	
}