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

	export class TransformFrame extends Frame{
		//NaN:no tween, 10:auto tween, [-1, 0):ease in, 0:line easing, (0, 1]:ease out, (1, 2]:ease in out
		public tweenEasing:number;
		//旋转几圈
        public tweenRotate:number = 0;
		//补间是否对Scale起作用
        public tweenScale:boolean;
		public displayIndex:number = 0;
        //public blendMode:string = "normal";
		public visible:boolean;
		public zOrder:number;
		
		public global:DBTransform;
		public transform:DBTransform;
		public pivot:Point;
		public color:ColorTransform;
		public scaleOffset:Point;
		
		
		public constructor(){
			super();
			
			this.tweenEasing = 10;
			this.tweenRotate = 0;
			this.tweenScale = true;
			this.displayIndex = 0;
			this.visible = true;
			this.zOrder = NaN;
			
			this.global = new DBTransform();
			this.transform = new DBTransform();
			this.pivot = new Point();
			this.scaleOffset = new Point();
		}
		
		public dispose():void{
			super.dispose();
			this.global = null;
			this.transform = null;
			this.pivot = null;
			this.scaleOffset = null;
			this.color = null;
		}
	}
}