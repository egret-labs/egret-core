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
	 * @class dragonBones.SlotData
	 * @classdesc
	 * 插槽数据，插槽是由骨骼控制的，可以装入显示对象的容器，显示对象可以是图片或者子骨架
	 * 插槽可插入一个或者多个显示对象，但是同一时刻只能显示一个显示对象
	 * 插槽支持关键帧动画，如果有多个显示对象，可以指定哪一帧显示哪一个显示对象
	 */
	export class SlotData{
		/**
		 * 插槽数据的名字
		 * @member {string} dragonBones.SlotData#name
		 */
		public name:string;
		/**
		 * 绑定的骨骼的名字，一个插槽仅受一个骨骼控制
		 * @member {string} dragonBones.SlotData#parent
		 */
		public parent:string;
		/**
		 * z轴排序，z轴是垂直于屏幕的轴，zOrder约小，越靠里
		 * 所以如果有重叠，zOrder大的插槽会挡住zOrder小的插槽
		 * @member {number} dragonBones.SlotData#zOrder
		 */
		public zOrder:number;
		/**
		 * 混合模式
		 * @member {string} dragonBones.SlotData#blendMode
		 */
		public blendMode:string;
		/**
		 * 初始的显示图片的序号
		 * @member {string} dragonBones.SlotData#displayIndex
		 */
		public displayIndex:number
		private _displayDataList:Array<DisplayData>;

		/**
		 * 构造函数，实例化一个SlotData类
		 */
		public constructor(){
			this._displayDataList = [];
			this.zOrder = 0;
		}

		/**
		 * 释放资源
		 */
		public dispose():void{
			this._displayDataList.length = 0;
		}

		/**
		 * 添加一个显示对象数据
		 * @param displayData
		 */
		public addDisplayData(displayData:DisplayData):void{
			if(!displayData){
				throw new Error();
			}
			if (this._displayDataList.indexOf(displayData) < 0){
				this._displayDataList[this._displayDataList.length] = displayData;
			}
			else{
				throw new Error();
			}
		}

		/**
		 * 根据显示对象的名字获取显示对象数据
		 * @param displayName 想要获取的显示对象的名字
		 * @returns {*} 返回显示对象昂数据，如果没有返回null
		 */
		public getDisplayData(displayName:string):DisplayData{
			var i:number = this._displayDataList.length;
			while(i --){
				if(this._displayDataList[i].name == displayName){
					return this._displayDataList[i];
				}
			}
			
			return null;
		}

		/**
		 * 获取所有的显示对象
		 * @returns {Array<DisplayData>}
		 */
		public get displayDataList():Array<DisplayData>{
			return this._displayDataList;
		}
	}
}