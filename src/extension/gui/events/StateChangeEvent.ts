/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */


module egret.gui {

	/**
	 * @class egret.gui.StateChangeEvent
	 * @classdesc
	 * 视图状态改变事件
	 * @extends egret.Event
	 */	
	export class StateChangeEvent extends Event{
		/**
		 * 当前视图状态已经改变 
		 * @constant egret.gui.StateChangeEvent.CURRENT_STATE_CHANGE
		 */		
		public static CURRENT_STATE_CHANGE:string = "currentStateChange";
		/**
		 * 当前视图状态即将改变
		 * @constant egret.gui.StateChangeEvent.CURRENT_STATE_CHANGING
		 */		
		public static CURRENT_STATE_CHANGING:string = "currentStateChanging";
        /**
         * 状态过渡完成
         */
        public static STATE_CHANGE_COMPLETE:string = "stateChangeComplete";
		
		/**
		 * @method egret.gui.StateChangeEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 * @param oldState {string} 
		 * @param newState {string} 
		 */
		public constructor(type:string, bubbles:boolean = false,
										 cancelable:boolean = false,
										 oldState:string = null,
										 newState:string = null){
			super(type, bubbles, cancelable);
			
			this.oldState = oldState;
			this.newState = newState;
		}
		/**
		 * 组件正在进入的视图状态的名称。
		 * @member egret.gui.StateChangeEvent#newState
		 */		
        public newState: string = null;
		
		/**
		 * 组件正在退出的视图状态的名称。
		 * @member egret.gui.StateChangeEvent#oldState
		 */		
        public oldState: string = null;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.StateChangeEvent.dispatchStateChangeEvent
         */
        public static dispatchStateChangeEvent(target:IEventDispatcher,type:string,
                                               oldState:string = null,newState:string = null):void{
            var eventClass:any = StateChangeEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.oldState = oldState;
            props.newState = newState;
            Event._dispatchByTarget(eventClass,target,type,props);
        }
	}
	
}