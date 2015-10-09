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
	 * @class dragonBones.FastDBObject
	 * @classdesc
	 * FastDBObject 是 FastBone 和 FastSlot 的基类
	 * @see dragonBones.FastBone
	 * @see dragonBones.FastSlot
	 */
	export class FastDBObject{
		private _name:string;
		
		/**
		 * An object that can contain any user extra data.
		 */
		public userData:any;
		
		/**
		 * 
		 */
		public inheritRotation:boolean;
		
		/**
		 * 
		 */
		public inheritScale:boolean;
		
		/**
		 * 
		 */
		public inheritTranslation:boolean;
		
		/** @private */
		public _global:DBTransform;
		/** @private */
		public _globalTransformMatrix:Matrix;
		
		/** @private */
		public _globalBackup:DBTransform;
		/** @private */
		public _globalTransformMatrixBackup:Matrix;
		
		public static _tempParentGlobalTransform:DBTransform = new DBTransform();
		
		public _frameCache:FrameCache;
		
		/** @private */
		public updateByCache():void{
			this._global = this._frameCache.globalTransform;
			this._globalTransformMatrix = this._frameCache.globalTransformMatrix;
		}
		
		/** @private */
		public switchTransformToBackup():void{
			if(!this._globalBackup){
				this._globalBackup = new DBTransform();
				this._globalTransformMatrixBackup = new Matrix();
			}
			this._global = this._globalBackup;
			this._globalTransformMatrix = this._globalTransformMatrixBackup;
		}
		
		/**
		 * The armature this DBObject instance belongs to.
		 */
		public armature:FastArmature;
		
		/** @private */
		public _origin:DBTransform;
		
		/** @private */
		public _visible:boolean;
		
		/** @private */
		public _parent:FastBone;
		
		/** @private */
		public setParent(value:FastBone):void{
			this._parent = value;
		}
		
		public constructor(){
			this._globalTransformMatrix = new Matrix();
			
			this._global = new DBTransform();
			this._origin = new DBTransform();
			
			this._visible = true;
			
			this.armature = null;
			this._parent = null;
			
			this.userData = null;
			
			this.inheritRotation = true;
			this.inheritScale = true;
			this.inheritTranslation = true;
		}
		
		/**
		 * Cleans up any resources used by this DBObject instance.
		 */
		public dispose():void{
			this.userData = null;
			
			this._globalTransformMatrix = null;
			this._global = null;
			this._origin = null;
			
			this.armature = null;
			this._parent = null;
		}
		
		private static tempOutputObj:any = {};
		public _calculateParentTransform():any{
			if(this.parent && (this.inheritTranslation || this.inheritRotation || this.inheritScale)){
				var parentGlobalTransform:DBTransform = this._parent._global;
				var parentGlobalTransformMatrix:Matrix = this._parent._globalTransformMatrix;
				
				if(	!this.inheritTranslation && (parentGlobalTransform.x != 0 || parentGlobalTransform.y != 0) ||
					!this.inheritRotation && (parentGlobalTransform.skewX != 0 || parentGlobalTransform.skewY != 0) ||
					!this.inheritScale && (parentGlobalTransform.scaleX != 1 || parentGlobalTransform.scaleY != 1)){
					parentGlobalTransform = FastDBObject._tempParentGlobalTransform;
					parentGlobalTransform.copy(this._parent._global);
					if(!this.inheritTranslation){
						parentGlobalTransform.x = 0;
						parentGlobalTransform.y = 0;
					}
					if(!this.inheritScale){
						parentGlobalTransform.scaleX = 1;
						parentGlobalTransform.scaleY = 1;
					}
					if(!this.inheritRotation){
						parentGlobalTransform.skewX = 0;
						parentGlobalTransform.skewY = 0;
					}
					
					parentGlobalTransformMatrix = DBObject._tempParentGlobalTransformMatrix;
					TransformUtil.transformToMatrix(parentGlobalTransform, parentGlobalTransformMatrix);
				}
				FastDBObject.tempOutputObj.parentGlobalTransform = parentGlobalTransform;
				FastDBObject.tempOutputObj.parentGlobalTransformMatrix = parentGlobalTransformMatrix;
				return FastDBObject.tempOutputObj;
			}
			return null;
		}
		
		public _updateGlobal():any{
			this._calculateRelativeParentTransform();
			var output:any = this._calculateParentTransform();
			if(output != null){
				//计算父骨头绝对坐标
				var parentMatrix:Matrix = output.parentGlobalTransformMatrix;
				var parentGlobalTransform:DBTransform = output.parentGlobalTransform;
				//计算绝对坐标
				var x:number = this._global.x;
				var y:number = this._global.y;
				
				this._global.x = parentMatrix.a * x + parentMatrix.c * y + parentMatrix.tx;
				this._global.y = parentMatrix.d * y + parentMatrix.b * x + parentMatrix.ty;
				
				if(this.inheritRotation){
					this._global.skewX += parentGlobalTransform.skewX;
					this._global.skewY += parentGlobalTransform.skewY;
				}
				
				if(this.inheritScale){
					this._global.scaleX *= parentGlobalTransform.scaleX;
					this._global.scaleY *= parentGlobalTransform.scaleY;
				}

			}
			TransformUtil.transformToMatrix(this._global, this._globalTransformMatrix, true);
			return output;
		}
		
		public _calculateRelativeParentTransform():void{
		}
		
		public get name():string{
			return this._name;
		}
		public set name(value:string){
			this._name = value;
		}
		
		/**
		 * This DBObject instance global transform instance.
		 * @see dragonBones.DBTransform
		 */
		public get global():DBTransform{
			return this._global;
		}
		
		
		public get globalTransformMatrix():Matrix{
			return this._globalTransformMatrix;
		}
		
		/**
		 * This DBObject instance related to parent transform instance.
		 * @see dragonBones.DBTransform
		 */
		public get origin():DBTransform{
			return this._origin;
		}
		
		/**
		 * Indicates the Bone instance that directly contains this DBObject instance if any.
		 */
		public get parent():FastBone{
			return this._parent;
		}
		
		public get visible():boolean
		{
			return this._visible;
		}
		public set visible(value:boolean)
		{
			this._visible = value;
		}
		
		public set frameCache(cache:FrameCache){
			this._frameCache = cache;
		}
	}
}