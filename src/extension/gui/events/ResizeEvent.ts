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
	 * @class egret.gui.ResizeEvent
	 * @classdesc
	 * 尺寸改变事件
	 * @extends egret.Event
	 */
	export class ResizeEvent extends Event{
		/**
		 * @constant egret.gui.ResizeEvent.RESIZE
		 */
		public static RESIZE:string = "resize";
		
		/**
		 * @method egret.gui.ResizeEvent#constructor
		 * @param type {string} 
		 * @param oldWidth {number} 
		 * @param oldHeight {number} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 */
		public constructor(type:string,oldWidth:number = NaN, oldHeight:number = NaN,
									bubbles:boolean = false, cancelable:boolean = false){
			super(type, bubbles, cancelable);
			
			this.oldWidth = oldWidth;
			this.oldHeight = oldHeight;
		}
		
		/**
		 * 旧的高度 
		 * @member egret.gui.ResizeEvent#oldHeight
		 */
		public oldHeight:number;
		
		/**
		 * 旧的宽度 
		 * @member egret.gui.ResizeEvent#oldWidth
		 */
		public oldWidth:number;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.ResizeEvent.dispatchResizeEvent
         */
        public static dispatchResizeEvent(target:IEventDispatcher,oldWidth:number = NaN, oldHeight:number = NaN):void {
            var eventClass:any = ResizeEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.oldWidth = oldWidth;
            props.oldHeight = oldHeight;
            Event._dispatchByTarget(eventClass, target, ResizeEvent.RESIZE, props);
        }
	}
}