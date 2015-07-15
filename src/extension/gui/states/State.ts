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
	 * @class egret.gui.State
	 * @classdesc
	 * State 类定义视图状态，即组件的特定视图。
	 * @extends egret.HashObject
	 */
	export class State extends HashObject{
		/**
		 * @method egret.gui.State#constructor
		 * @param properties {any} 
		 */
		public constructor(name:string,overrides:Array<IOverride>){
			super();
			this.name = name;
            this.overrides = overrides;
		}
		/**
		 * 已经初始化标志 
		 */		
		private initialized:boolean = false;

		/**
		 * 视图状态的名称。给定组件的状态名称必须唯一。必须设置此属性。
		 * @member egret.gui.State#name
		 */		
        public name: string = null;
		
		/**
		 * 该视图状态的覆盖，表现为实现 IOverride 接口的对象的数组。
		 * 这些覆盖在进入状态时按顺序应用，在退出状态时按相反的顺序删除。 
		 * @member egret.gui.State#overrides
		 */		
		public overrides:Array<IOverride>;
		/**
		 * 此视图状态作为 String 数组所属的状态组。 
		 * @member egret.gui.State#stateGroups
		 */		
		public stateGroups:Array<any>;
		/**
		 * 初始化视图
		 * @method egret.gui.State#initialize
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