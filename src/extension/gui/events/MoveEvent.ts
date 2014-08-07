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
	 * @class egret.gui.MoveEvent
	 * @classdesc
	 * 移动事件
	 * @extends egret.Event
	 */
	export class MoveEvent extends Event{
		/**
		 * @constant egret.gui.MoveEvent.MOVE
		 */
		public static MOVE:string = "move";
		
		/**
		 * @method egret.gui.MoveEvent#constructor
		 * @param type {string} 
		 * @param oldX {number} 
		 * @param oldY {number} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 */
		public constructor(type:string, oldX:number = NaN, oldY:number = NaN, 
								  bubbles:boolean = false,
								  cancelable:boolean = false){
			super(type, bubbles, cancelable);
			
			this.oldX = oldX;
			this.oldY = oldY;
		}
		
		/**
		 * 旧的组件X
		 * @member egret.gui.MoveEvent#oldX
		 */
		public oldX:number;
		
		/**
		 * 旧的组件Y
		 * @member egret.gui.MoveEvent#oldY
		 */
		public oldY:number;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.MoveEvent.dispatchMoveEvent
         */
        public static dispatchMoveEvent(target:IEventDispatcher,oldX:number = NaN, oldY:number = NaN):void{
            var eventClass:any = MoveEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.oldX = oldX;
            props.oldY = oldY;
            Event._dispatchByTarget(eventClass,target,MoveEvent.MOVE,props);
        }
	}
}