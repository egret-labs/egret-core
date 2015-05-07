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


module dragonBones {

	/**
	 * @class dragonBones.SkinData
	 * @classdesc
	 * 皮肤数据，皮肤是由一些插槽组成，每个插槽都有一个骨骼控制，骨骼的运动带动插槽的运动形成动画，
	 * 插槽里可以放置显示对象，目前支持的显示对象有图片和子骨架两种
	 */
	export class SkinData{
		/**
		 * 皮肤数据的名字
		 * @member {string} dragonBones.SkinData#name
		 */
		public name:string;
		private _slotDataList:Array<SlotData>;

		/**
		 * 构造函数，实例化一个SkinData类
		 */
		public constructor(){
			this._slotDataList = [];
		}

		/**
		 * 释放资源
		 */
		public dispose():void{
			var i:number = this._slotDataList.length;
			while(i --){
				this._slotDataList[i].dispose();
			}
			this._slotDataList = null;
		}

		/**
		 * 根据插槽的名字获取插槽数据
		 * @param slotName 想要获取的插槽的名字
		 * @returns {*} 返回的插槽数据
		 */
		public getSlotData(slotName:string):SlotData{
			var i:number = this._slotDataList.length;
			while(i --){
				if(this._slotDataList[i].name == slotName){
					return this._slotDataList[i];
				}
			}
			return null;
		}

		/**
		 * 添加一个插槽数据
		 * @param slotData
		 */
		public addSlotData(slotData:SlotData):void{
			if(!slotData){
				throw new Error();
			}
			
			if (this._slotDataList.indexOf(slotData) < 0){
				this._slotDataList[this._slotDataList.length] = slotData;
			}
			else{
				throw new Error();
			}
		}

		/**
		 * 获取所有的插槽数据
		 * @returns {Array<SlotData>}
		 */
		public get slotDataList():Array<SlotData>{
			return this._slotDataList;
		}
	}
}