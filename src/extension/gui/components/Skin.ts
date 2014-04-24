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

/// <reference path="Group.ts"/>
/// <reference path="SkinnableComponent.ts"/>
/// <reference path="../core/ISkin.ts"/>
/// <reference path="../core/IStateClient.ts"/>
/// <reference path="../states/StateClientHelper.ts"/>

module ns_egret {

	export class Skin extends Group 
		implements IStateClient,ISkin{
		public constructor(){
			super();
			this.stateClientHelper = new StateClientHelper(this);
		}
		
		private _hostComponent:SkinnableComponent;

		/**
		 * 主机组件引用,仅当皮肤被应用后才会对此属性赋值 
		 */
		public get hostComponent():SkinnableComponent{
			return this._hostComponent;
		}

		public set hostComponent(value:SkinnableComponent){
			this._hostComponent = value;
		}
		
		public createChildren():void{
			super.createChildren();
			this.stateClientHelper.initializeStates();
		}
		
		/**
		 * @inheritDoc
		 */
		public commitProperties():void{
			super.commitProperties();
			if(this.stateClientHelper.currentStateChanged){
				this.stateClientHelper.commitCurrentState();
				this.commitCurrentState();
			}
		}
		
		//========================state相关函数===============start=========================
		
		private stateClientHelper:StateClientHelper;
		/**
		 * 为此组件定义的视图状态。
		 */
		public get states():Array{
			return this.stateClientHelper.states;
		}
		
		public set states(value:Array){
			this.stateClientHelper.states = value;
		}
		
		/**
		 * 组件的当前视图状态。
		 */
		public get currentState():string{
			return this.stateClientHelper.currentState;
		}
		public set currentState(value:string){
			this.stateClientHelper.currentState = value;

			if(this.stateClientHelper.currentStateChanged){
				if(this.initialized||this.parent){
					this.stateClientHelper.commitCurrentState();
					this.commitCurrentState();
				}
				else{
					this.invalidateProperties();
				}
			}
		}
		
		/**
		 * 返回是否含有指定名称的视图状态
		 * @param stateName 要检测的视图状态名称
		 */				
		public hasState(stateName:string):boolean{
			return this.stateClientHelper.hasState(stateName);
		}
		
		/**
		 * 应用当前的视图状态
		 */		
		public commitCurrentState():void{
			
		}
		
		//========================state相关函数===============end=========================
		
	}
}
