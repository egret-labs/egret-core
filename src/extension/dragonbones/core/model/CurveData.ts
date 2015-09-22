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

	export class CurveData{
		private static SamplingTimes:number = 20;
		private static SamplingStep:number = 0.05;
		private _dataChanged:boolean = false;
		
		private _pointList:Array<any> = [];
		public sampling:Array<Point> = new Array<Point>(CurveData.SamplingTimes);
		
		public constructor(){
			for(var i:number=0; i < CurveData.SamplingTimes-1; i++){
				this.sampling[i] = new Point();
			}
		}
		
		public getValueByProgress(progress:number):number{
			if(this._dataChanged){
				this.refreshSampling();
			}
			for (var i:number = 0; i < CurveData.SamplingTimes-1; i++) {
				var point:Point = this.sampling[i];
				if (point.x >= progress) {
					if(i == 0){
						return point.y * progress / point.x;
					}
					else{
						var prevPoint:Point = this.sampling[i-1];
						return prevPoint.y + (point.y - prevPoint.y) * (progress - prevPoint.x) / (point.x - prevPoint.x);
					}
					
				}
			}
			return point.y + (1 - point.y) * (progress - point.x) / (1 - point.x);
		}
		
		public refreshSampling():void{
			for(var i:number = 0; i < CurveData.SamplingTimes-1; i++){
				this.bezierCurve(CurveData.SamplingStep * (i+1), this.sampling[i]);
			}
			this._dataChanged = false;
		}
		
		private bezierCurve(t:number, outputPoint:Point):void{	
			var l_t:number = 1-t;
			outputPoint.x = 3* this.point1.x*t*l_t*l_t + 3*this.point2.x*t*t*l_t + Math.pow(t,3);
			outputPoint.y = 3* this.point1.y*t*l_t*l_t + 3*this.point2.y*t*t*l_t + Math.pow(t,3);
		}
		
		public set pointList(value:Array<any>){
			this._pointList = value;
			this._dataChanged = true;
		}
		
		public get pointList():Array<any>{
			return this._pointList;
		}
		
		public isCurve():boolean{
			return this.point1.x != 0 || this.point1.y != 0 || this.point2.x != 1 || this.point2.y != 1;
		}
		public get point1():Point{
			return this.pointList[0];
		}
		public get point2():Point{
			return this.pointList[1];
		}
	}
}