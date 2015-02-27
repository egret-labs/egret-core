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


module dragonBones {

	/**
	 * @class dragonBones.Timeline
	 * @classdesc
	 * 保存时间轴相关的数据，包括关键帧，持续时间，时间缩放
	 */
	export class Timeline{
		/**
		 * 持续时间，单位是帧
		 * @member {number} dragonBones.Timeline#duration
		 */
		public duration:number = 0;
		/**
		 * 时间缩放，设置为2，时间放慢一倍，设置为0.5，时间加快一倍，默认为1
		 * @member {number} dragonBones.Timeline#scale
		 */
		public scale:number;
		
		private _frameList:Array<Frame>;

		/**
		 * 初始化数据duration为0，scale为1
		 */
		public constructor(){
			this._frameList = [];
			this.duration = 0;
			this.scale = 1;
		}
		
		public dispose():void{
			var i:number = this._frameList.length;
			while(i --){
				this._frameList[i].dispose();
			}
			this._frameList = null;
		}

		/**
		 * 添加一个关键帧数据
		 * @param frame 关键帧数据
		 * @see extension.dragonbones.model.Frame
		 */
		public addFrame(frame:Frame):void{
			if(!frame){
				throw new Error();
			}
			
			if(this._frameList.indexOf(frame) < 0){
				this._frameList[this._frameList.length] = frame;
			}
			else{
				throw new Error();
			}
		}

		/**
		 * 获取关键帧列表
		 * @returns {Array<Frame>}
		 */
		public get frameList():Array<Frame>{
			return this._frameList;
		}
	}
}