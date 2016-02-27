//////////////////////////////////////////////////////////////////////////////////////
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


module dragonBones
{

	export class IKConstraint
	{
		private ikdata:IKData;
		private armature:Armature;
		
		public bones:Array<Bone>;
		public target:Bone;
		public bendDirection:number;
		public weight:number;
		
		public animationCacheBend:number=0;		
		public animationCacheWeight:number=-1;	
		
		public constructor (data:IKData,armatureData:Armature)
		{
			this.ikdata = data;
			this.armature = armatureData;
				
			this.weight = data.weight;
			this.bendDirection = (data.bendPositive?1:-1);
			this.bones = [];
			var bone:Bone;
			if(data.chain)
            {
				bone = armatureData.getBone(data.bones).parent;
				bone.isIKConstraint = true;
				this.bones.push(bone);
			}
			bone = armatureData.getBone(data.bones);
			bone.isIKConstraint = true;
			this.bones.push(bone);
			this.target = armatureData.getBone(data.target);
		}
		public dispose():void
		{
			
		}
		public compute():void
		{
			switch (this.bones.length) {
				case 1:
					var weig1:number = this.animationCacheWeight >= 0 ? this.animationCacheWeight : this.weight;
					this.compute1(this.bones[0], this.target, weig1);
					break;
				case 2:
					var bend:number = this.animationCacheBend != 0 ? this.animationCacheBend : this.bendDirection;
					var weig:number = this.animationCacheWeight >= 0 ? this.animationCacheWeight : this.weight;
					var tt:Point = this.compute2(this.bones[0], this.bones[1], this.target.global.x, this.target.global.y, bend, weig);
					this.bones[0].rotationIK = tt.x;
					this.bones[1].rotationIK = tt.y + tt.x;
					break;
			}
		}
        
		public compute1 (bone:Bone, target:Bone, weightA:number) : void 
        {
			var parentRotation:number = (!bone.inheritRotation || bone.parent == null) ? 0 : bone.parent.global.rotation;
			var rotation:number = bone.global.rotation;
			var rotationIK:number = Math.atan2(target.global.y - bone.global.y, target.global.x - bone.global.x);
			bone.rotationIK = rotation + (rotationIK - rotation) * weightA;
		}
        
		public compute2(parent:Bone, child:Bone, targetX:number,targetY:number, bendDirection:number, weightA:number):Point
		{
			//添加斜切后的算法，现在用的
			if (weightA == 0) {
				return new Point(parent.global.rotation,child.global.rotation);
			}
			var tt:Point = new Point();
			/**父的绝对坐标**/
			var p1:Point = new Point(parent.global.x,parent.global.y);
			/**子的绝对坐标**/
			var p2:Point = new Point(child.global.x,child.global.y);
			var psx:number = parent.global.scaleX;
			var psy:number = parent.global.scaleY;
			var csx:number = child.global.scaleX;
			var csy:number = child.global.scaleY;
			
			var cx:number = child.origin.x*psx;
			var cy:number = child.origin.y*psy;
			var initalRotation:number = Math.atan2(cy, cx);//差值等于子在父落点到父的角度
			
			var childX:number = p2.x-p1.x;
			var childY:number = p2.y-p1.y;
			/**d1的长度**/
			var len1:number = Math.sqrt(childX * childX + childY* childY);
			var parentAngle:number;
			var childAngle:number;
            
			outer:
			if (Math.abs(psx - psy) <= 0.001) 
            {
				var childlength:number = child.length;
				var len2:number = childlength*csx;
				targetX = targetX-p1.x;
				targetY = targetY-p1.y;
				var cosDenom:number = 2 * len1 * len2;
				if (cosDenom < 0.0001) 
                {
					var temp:number = Math.atan2(targetY, targetX);
					tt.x = temp  * weightA - initalRotation;
					tt.y = temp  * weightA + initalRotation; //+ tt.x ;
					this.normalize(tt.x);
					this.normalize(tt.y);
					return tt;
				}
				var cos:number = (targetX * targetX + targetY * targetY - len1 * len1 - len2 * len2) / cosDenom;
				if (cos < -1)
					cos = -1;
				else if (cos > 1)
					cos = 1;
				childAngle = Math.acos(cos) * bendDirection;//o2
				var adjacent:number = len1 + len2 * cos;  //ae
				var opposite:number = len2 * Math.sin(childAngle);//be
				parentAngle = Math.atan2(targetY * adjacent - targetX * opposite, targetX * adjacent + targetY * opposite);//o1
				tt.x = parentAngle * weightA-initalRotation;
				tt.y = childAngle* weightA+initalRotation;//+tt.x;
			}
            else
            {   //一旦父已经扭曲，子重新计算长度
				var l1:number = len1;
				var tx:number = targetX - p1.x;
				var ty:number = targetY - p1.y;
				var l2:number = child.length * child.origin.scaleX;//child.currentLocalTransform.scaleX;
				var a:number = psx * l2;
				var b:number = psy * l2;
				var ta:number = Math.atan2(ty, tx);
				var aa:number = a * a;
				var bb:number = b * b;
				var ll:number = l1 * l1;
				var dd:number = tx * tx + ty * ty;
				var c0:number = bb * ll + aa * dd - aa * bb;
				var c1:number = -2 * bb * l1;
				var c2:number = bb - aa;
				var d:number = c1 * c1 - 4 * c2 * c0;
				if (d >= 0) 
                {
					var q:number =Math.sqrt(d);
					if (c1 < 0)
                    {
                         q = -q;
                    }
					q = -(c1 + q) / 2;
					var r0:number = q / c2
					var r1:number = c0 / q;
					var r:number = Math.abs(r0) < Math.abs(r1) ? r0 : r1;
					if (r * r <= dd) 
                    {
						var y1:number = Math.sqrt(dd - r * r) * bendDirection;
						parentAngle = ta - Math.atan2(y1, r);
						childAngle = Math.atan2(y1 / psy, (r - l1) / psx);
						tt.x = parentAngle* weightA-initalRotation;
						tt.y = childAngle* weightA+initalRotation;//+tt.x;
						break outer;
					}
				}
				var minAngle:number = 0;
				var minDist:number = Number.MAX_VALUE;
				var minX:number = 0;
				var minY:number = 0;
				var maxAngle:number = 0;
				var maxDist:number = 0;
				var maxX:number = 0;
				var maxY:number = 0;
				var x2:number = l1 + a;
				var dist:number = x2 * x2;
				if (dist > maxDist) {
					maxAngle = 0;
					maxDist = dist;
					maxX = x2;
				}
				x2 = l1 - a;
				dist = x2 * x2;
				if (dist < minDist) {
					minAngle = Math.PI;
					minDist = dist;
					minX = x2;
				}
				var angle1:number = Math.acos(-a * l1 / (aa - bb));
				x2 = a * Math.cos(angle1) + l1;
				var y2:number = b * Math.sin(angle1);
				dist = x2 * x2 + y2 * y2;
				if (dist < minDist) {
					minAngle = angle1;
					minDist = dist;
					minX = x2;
					minY = y2;
				}
				if (dist > maxDist) {
					maxAngle = angle1;
					maxDist = dist;
					maxX = x2;
					maxY = y2;
				}
				if (dd <= (minDist + maxDist) / 2) {
					parentAngle = ta - Math.atan2(minY * bendDirection, minX);
					childAngle = minAngle * bendDirection;
				} else {
					parentAngle = ta - Math.atan2(maxY * bendDirection, maxX);
					childAngle = maxAngle * bendDirection;
				}
				tt.x = parentAngle* weightA-initalRotation;
				tt.y = childAngle* weightA+initalRotation;//;
			}
			this.normalize(tt.x);
			this.normalize(tt.y);
			return tt;
		}
		private normalize(rotation:number):void
		{
			if (rotation > Math.PI)
            {
                rotation -= Math.PI*2;
            }	
			else if (rotation < -Math.PI)
            {
               rotation += Math.PI*2; 
            }	
		}
	}
}