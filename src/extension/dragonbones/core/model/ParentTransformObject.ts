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
	 * optimized by freem-trg
 	 * Intermediate class for store the results of the parent transformation
 	 */
 	export class ParentTransformObject 
 	{
 		
 		public parentGlobalTransform:DBTransform;
 		public parentGlobalTransformMatrix:Matrix;
 		
 		/// Object pool to reduce GC load
 		private static _pool:ParentTransformObject[] = [];
 		private static _poolSize:number = 0;
 		
 		public constructor() 
 		{
 		}
 		
 		/// Method to set properties after its creation/pooling
 		public setTo(parentGlobalTransform:DBTransform, parentGlobalTransformMatrix:Matrix):ParentTransformObject
 		{
 			this.parentGlobalTransform = parentGlobalTransform;
 			this.parentGlobalTransformMatrix = parentGlobalTransformMatrix;
 			return this;
 		}
 		
 		/// Cleanup object and return it to the object pool
 		public release():void
 		{
 			ParentTransformObject.dispose(this);
 		}
 		
 		/// Create/take new clean object from the object pool
 		public static create():ParentTransformObject
 		{
 			if (ParentTransformObject._poolSize > 0)
 			{
 				ParentTransformObject._poolSize--;
 				return ParentTransformObject._pool.pop();
 			}
 			
 			return new ParentTransformObject();
 		}
 		
 		/// Cleanup object and return it to the object pool
 		public static dispose(parentTransformObject:ParentTransformObject):void
 		{
 			parentTransformObject.parentGlobalTransform = null;
 			parentTransformObject.parentGlobalTransformMatrix = null;
 			ParentTransformObject._pool[ParentTransformObject._poolSize++] = parentTransformObject;
 		}
 		
 	}
} 