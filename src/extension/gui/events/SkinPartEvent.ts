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
	 * @class egret.gui.SkinPartEvent
	 * @classdesc
	 * 皮肤组件附加移除事件
	 * @extends egret.Event
	 */
	export class SkinPartEvent extends Event{
		/**
		 * 附加皮肤公共子部件 
		 * @constant egret.gui.SkinPartEvent.PART_ADDED
		 */		
		public static PART_ADDED:string = "partAdded";
		/**
		 * 移除皮肤公共子部件 
		 * @constant egret.gui.SkinPartEvent.PART_REMOVED
		 */		
		public static PART_REMOVED:string = "partRemoved";
		
		/**
		 * @method egret.gui.SkinPartEvent#constructor
		 * @param type {string} 
		 * @param bubbles {boolean} 
		 * @param cancelable {boolean} 
		 * @param partName {string} 
		 * @param instance {any} 
		 */
		public constructor(type:string, bubbles:boolean = false,
									  cancelable:boolean = false,
									  partName:string = null, 
									  instance:any = null) {
			super(type, bubbles, cancelable);
			
			this.partName = partName;
			this.instance = instance;
		}
		
		/**
		 * 被添加或移除的皮肤组件实例
		 * @member egret.gui.SkinPartEvent#instance
		 */    
		public instance:any;
		
		/**
		 * 被添加或移除的皮肤组件的实例名
		 * @member egret.gui.SkinPartEvent#partName
		 */   
		public partName:string;

        /**
         * 使用指定的EventDispatcher对象来抛出事件对象。抛出的对象将会缓存在对象池上，供下次循环复用。
         * @method egret.gui.SkinPartEvent.dispatchSkinPartEvent
         */
        public static dispatchSkinPartEvent(target:IEventDispatcher,type:string,
                                            partName:string = null,instance:any = null):void{
            var eventClass:any = SkinPartEvent;
            var props:any = Event._getPropertyData(eventClass);
            props.partName = partName;
            props.instance = instance;
            Event._dispatchByTarget(eventClass,target,type,props);
        }
	}
}