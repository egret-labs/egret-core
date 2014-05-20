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

/// <reference path="../core/IContainer.ts"/>
/// <reference path="../core/IStateClient.ts"/>
/// <reference path="../events/StateChangeEvent.ts"/>
/// <reference path="State.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.StateClientHelper
	 * @classdesc
	 * 视图状态组件辅助工具类
	 */
	export class StateClientHelper{
		/**
		 * 构造函数
		 * @method ns_egret.StateClientHelper#constructor
		 * @param target {IStateClien} 
		 */		
		public constructor(target:IStateClient){
			this.target = target;
		}
		
		/**
		 * 具有视图状态功能的目标实例
		 */		
		private target:IStateClient;
		
		private _states:Array<any> = [];
		/**
		 * 为此组件定义的视图状态。
		 * @member ns_egret.StateClientHelper#states
		 */
		public get states():Array<any>{
			return this._states;
		}
		public set states(value:Array<any>){
			if(this._states == value)
				return;
			this._states = value;
			this._currentStateChanged = true;
			this.requestedCurrentState = this._currentState;
			if(!this.hasState(this.requestedCurrentState)){
				this.requestedCurrentState = this.getDefaultState();
			}
		}


		private _currentStateChanged:boolean;
		/**
		 * 当前视图状态发生改变的标志
		 * @member ns_egret.StateClientHelper#currentStateChanged
		 */
		public get currentStateChanged():boolean{
			return this._currentStateChanged;
		}

		
		private _currentState:string;
		/**
		 * 存储还未验证的视图状态 
		 */		
		private requestedCurrentState:string;
		/**
		 * 组件的当前视图状态。将其设置为 "" 或 null 可将组件重置回其基本状态。 
		 * @member ns_egret.StateClientHelper#currentState
		 */	
		public get currentState():string{
			if(this._currentStateChanged)
				return this.requestedCurrentState;
			return this._currentState?this._currentState:this.getDefaultState();
		}
		
		public set currentState(value:string){
			if(!value)
				value = this.getDefaultState();
			if (value != this.currentState &&value&&this.currentState){
				this.requestedCurrentState = value;
				this._currentStateChanged = true;
			}
		}
		
		/**
		 * 返回是否含有指定名称的视图状态
		 * @method ns_egret.StateClientHelper#hasState
		 * @param stateName {string} 要检测的视图状态名称
		 * @returns {boolean}
		 */	
		public hasState(stateName:string):boolean{
			if(!this._states)
				return false;
			if(typeof(this._states[0]) == "string")
				return this._states.indexOf(stateName)!=-1;
			return (this.getState(stateName) != null); 
		}
		
		/**
		 * 返回默认状态
		 */		
		private getDefaultState():string{
			if(this._states&&this._states.length>0){
				var state:any = this._states[0];
				if(typeof(state) == "string")
					return state;
				return state.name;
			}
			return null;
		}
		/**
		 * 应用当前的视图状态
		 * @method ns_egret.StateClientHelper#commitCurrentState
		 */
		public commitCurrentState():void{
			if(!this.currentStateChanged)
				return;
			this._currentStateChanged = false;
			if(typeof(this.states&&this.states[0]) == "string"){
				if(this.states.indexOf(this.requestedCurrentState)==-1)
					this._currentState = this.getDefaultState();
				else
					this._currentState = this.requestedCurrentState;
				return;
			}
			var destination:State = this.getState(this.requestedCurrentState);
			if(!destination){
				this.requestedCurrentState = this.getDefaultState();
			}
			var commonBaseState:string = this.findCommonBaseState(this._currentState, this.requestedCurrentState);
			var event:StateChangeEvent;
			var oldState:string = this._currentState ? this._currentState : "";
			if (this.target.hasEventListener(StateChangeEvent.CURRENT_STATE_CHANGING)) {
				event = new StateChangeEvent(StateChangeEvent.CURRENT_STATE_CHANGING);
				event.oldState = oldState;
				event.newState = this.requestedCurrentState ? this.requestedCurrentState : "";
				this.target.dispatchEvent(event);
			}
			
			this.removeState(this._currentState, commonBaseState);
			this._currentState = this.requestedCurrentState;
			
			if (this._currentState) {
				this.applyState(this._currentState, commonBaseState);
			}
			
			if (this.target.hasEventListener(StateChangeEvent.CURRENT_STATE_CHANGE)){
				event = new StateChangeEvent(StateChangeEvent.CURRENT_STATE_CHANGE);
				event.oldState = oldState;
				event.newState = this._currentState ? this._currentState : "";
				this.target.dispatchEvent(event);
			}
			
		}
		
		
		/**
		 * 通过名称返回视图状态
		 */		
		private getState(stateName:string):State{
			if (!this._states || !stateName)
				return null;
			
			for (var i:number = 0; i < this._states.length; i++){
				if (this._states[i].name == stateName)
					return this._states[i];
			}
			
			return null;
		}
		
		/**
		 * 返回两个视图状态的共同父级状态
		 */		
		private findCommonBaseState(state1:string, state2:string):string{
			var firstState:State = this.getState(state1);
			var secondState:State = this.getState(state2);
			
			if (!firstState || !secondState)
				return "";
			
			if (!firstState.basedOn && !secondState.basedOn)
				return "";
			
			var firstBaseStates:Array<any> = this.getBaseStates(firstState);
			var secondBaseStates:Array<any> = this.getBaseStates(secondState);
			var commonBase:string = "";
			
			while (firstBaseStates[firstBaseStates.length - 1] ==
				secondBaseStates[secondBaseStates.length - 1]){
				commonBase = firstBaseStates.pop();
				secondBaseStates.pop();
				
				if (!firstBaseStates.length || !secondBaseStates.length)
					break;
			}
			
			if (firstBaseStates.length &&
				firstBaseStates[firstBaseStates.length - 1] == secondState.name){
				commonBase = secondState.name;
			}
			else if (secondBaseStates.length &&
				secondBaseStates[secondBaseStates.length - 1] == firstState.name){
				commonBase = firstState.name;
			}
			
			return commonBase;
		}
		
		/**
		 * 获取指定视图状态的所有父级状态列表
		 */		
		private getBaseStates(state:State):Array<any>{
			var baseStates:Array<any> = [];
			
			while (state && state.basedOn){
				baseStates.push(state.basedOn);
				state = this.getState(state.basedOn);
			}
			
			return baseStates;
		}
		
		/**
		 * 移除指定的视图状态以及所依赖的所有父级状态，除了与新状态的共同状态外
		 */		
		private removeState(stateName:string, lastState:string):void{
			var state:State = this.getState(stateName);
			
			if (stateName == lastState)
				return;
			
			if (state){
				state.dispatchExitState();
				
				var overrides:Array<any> = state.overrides;
				
				for (var i:number = overrides.length; i; i--)
					overrides[i-1].remove(this.target);
				
				if (state.basedOn != lastState)
					this.removeState(state.basedOn, lastState);
			}
		}
		
		/**
		 * 应用新状态
		 */
		private applyState(stateName:string, lastState:string):void{
			var state:State = this.getState(stateName);
			
			if (stateName == lastState)
				return;
			
			if (state){
				if (state.basedOn != lastState)
					this.applyState(state.basedOn, lastState);
				
				var overrides:Array<any> = state.overrides;
				
				for (var i:number = 0; i < overrides.length; i++)
					overrides[i].apply(<IContainer><any>(this.target));
				
				state.dispatchEnterState();
			}
		}
		
		private initialized:boolean = false;
		/**
		 * 初始化所有视图状态
		 * @method ns_egret.StateClientHelper#initializeStates
		 */
		public initializeStates():void{
			if(this.initialized)
				return;
			this.initialized = true;
            if (typeof (this._states[0]) == "string")
                return;
			for (var i:number = 0; i < this._states.length; i++){
				var state:State = <State> (this._states[i]);
				if(!state)
					break;
				state.initialize(this.target);
			}
		}
	}
}