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

	export class ColorTransformUtil{
		public static originalColor:ColorTransform = new ColorTransform();
		
		public static cloneColor(color:ColorTransform):ColorTransform{
			var c:ColorTransform = new ColorTransform();
			c.redMultiplier = color.redMultiplier;
			c.greenMultiplier = color.greenMultiplier;
			c.blueMultiplier = color.blueMultiplier;
			c.alphaMultiplier = color.alphaMultiplier;
			c.redOffset = color.redOffset;
			c.greenOffset = color.greenOffset;
			c.blueOffset = color.blueOffset;
			c.alphaOffset = color.alphaOffset;

			return c;
		}
		
		public static isEqual(color1:ColorTransform, color2:ColorTransform):boolean{
			return 	color1.alphaOffset == color2.alphaOffset &&
					color1.redOffset == color2.redOffset &&
					color1.greenOffset == color2.greenOffset &&
					color1.blueOffset == color2.blueOffset &&
					color1.alphaMultiplier == color2.alphaMultiplier &&
					color1.redMultiplier == color2.redMultiplier &&
					color1.greenMultiplier == color2.greenMultiplier &&
					color1.blueMultiplier == color2.blueMultiplier;
		}
		
		public static minus(color1:ColorTransform, color2:ColorTransform, outputColor:ColorTransform):void{
			outputColor.alphaOffset = color1.alphaOffset - color2.alphaOffset;
			outputColor.redOffset = color1.redOffset - color2.redOffset;
			outputColor.greenOffset = color1.greenOffset - color2.greenOffset;
			outputColor.blueOffset = color1.blueOffset - color2.blueOffset;
			
			outputColor.alphaMultiplier = color1.alphaMultiplier - color2.alphaMultiplier;
			outputColor.redMultiplier = color1.redMultiplier - color2.redMultiplier;
			outputColor.greenMultiplier = color1.greenMultiplier - color2.greenMultiplier;
			outputColor.blueMultiplier = color1.blueMultiplier - color2.blueMultiplier;
		}
		
		public constructor(){
		}
	}
}