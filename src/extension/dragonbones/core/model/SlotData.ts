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

	export class SlotData{
		public name:string;
		public parent:string;
		public zOrder:number;
        public blendMode:string;
		
		private _displayDataList:Array<DisplayData>;
		
		public constructor(){
			this._displayDataList = [];
			this.zOrder = 0;
		}
		
		public dispose():void{
			var i:number = this._displayDataList.length;
			while(i --){
				this._displayDataList[i].dispose();
			}
			this._displayDataList = null;
		}
		
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
		
		public getDisplayData(displayName:string):DisplayData{
			var i:number = this._displayDataList.length;
			while(i --){
				if(this._displayDataList[i].name == displayName){
					return this._displayDataList[i];
				}
			}
			
			return null;
		}
		
		public get displayDataList():Array<DisplayData>{
			return this._displayDataList;
		}
	}
}