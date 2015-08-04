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
     * @class dragonBones.DBObject
     * @classdesc
     * DBObject 是 Bone 和 Slot 的基类
     * @see dragonBones.Bone
     * @see dragonBones.Slot
     */
	export class DBObject{
		public name:string;

        /**
         * 存储额外的用户数据。
         * @member {any} dragonBones.DBObject#userData
         */
		public userData:any;

        /**
         * 是否继承父亲的旋转属性。
         * @member {boolean} dragonBones.DBObject#inheritRotation
         */
		public inheritRotation:boolean;

        /**
         * 是否继承父亲的缩放属性。
         * @member {boolean} dragonBones.DBObject#inheritScale
         */
		public inheritScale:boolean;

        /**
         * 是否继承父亲的平移属性。
         * @member {boolean} dragonBones.DBObject#inheritTranslation
         */
        public inheritTranslation:boolean;

        /** @private */
        public _global:DBTransform;
		/** @private */
		public _globalTransformMatrix:Matrix;

        public static _tempParentGlobalTransformMatrix:Matrix = new Matrix();
        public static _tempParentGlobalTransform:DBTransform = new DBTransform();

        /**
         * 相对世界坐标的 DBTransform 实例。
         * @member {DBTransform} dragonBones.DBObject#global
         */
		public get global():DBTransform{
			return this._global;
		}
		
		/** @private */
		public _origin:DBTransform;
        /**
         * 骨架数据中的原始的相对父亲的 DBTransform 实例。
         * @member {DBTransform} dragonBones.DBObject#origin
         */
		public get origin():DBTransform{
			return this._origin;
		}
		
		/** @private */
		public _offset:DBTransform;

        /**
         * 用于运行时动态调整的 DBTransform 实例。
         * @member {DBTransform} dragonBones.DBObject#offset
         */
		public get offset():DBTransform{
			return this._offset;
		}
		
		/** @private */
		public _visible:boolean;
		
		/** @private */
		public _armature:Armature;
		/**
		 * The armature this DBObject instance belongs to.
		 */
		public get armature():Armature{
			return this._armature;
		}
		/** @private */
		public _setArmature(value:Armature):void{
			this._armature = value;
		}
		
		/** @private */
		public _parent:Bone;
		/**
		 * Indicates the Bone instance that directly contains this DBObject instance if any.
		 */
		public get parent():Bone{
			return this._parent;
		}
		/** @private */
		public _setParent(value:Bone):void{
			this._parent = value;
		}
		
		public constructor(){
			this._globalTransformMatrix = new Matrix();
			
			this._global = new DBTransform();
			this._origin = new DBTransform();
			this._offset = new DBTransform();
			this._offset.scaleX = this._offset.scaleY = 1;
			
			this._visible = true;
			
			this._armature = null;
			this._parent = null;
			
			this.userData = null;

            this.inheritRotation = true;
            this.inheritScale = true;
            this.inheritTranslation = true;
		}

        /**
         * 清理使用的资源用于垃圾回收
         */
		public dispose():void{
			this.userData = null;
			
			this._globalTransformMatrix = null;
			this._global = null;
			this._origin = null;
			this._offset = null;
			
			this._armature = null;
			this._parent = null;
		}

        public _calculateRelativeParentTransform():void
        {

        }

        public _calculateParentTransform():any
        {
            if(this.parent && (this.inheritTranslation || this.inheritRotation || this.inheritScale))
            {
                var parentGlobalTransform:DBTransform = this._parent._globalTransformForChild;
                var parentGlobalTransformMatrix:Matrix = this._parent._globalTransformMatrixForChild;

                if(!this.inheritTranslation || !this.inheritRotation || !this.inheritScale)
                {
                    parentGlobalTransform = DBObject._tempParentGlobalTransform;
                    parentGlobalTransform.copy(this._parent._globalTransformForChild);
                    if(!this.inheritTranslation)
                    {
                        parentGlobalTransform.x = 0;
                        parentGlobalTransform.y = 0;
                    }
                    if(!this.inheritScale)
                    {
                        parentGlobalTransform.scaleX = 1;
                        parentGlobalTransform.scaleY = 1;
                    }
                    if(!this.inheritRotation)
                    {
                        parentGlobalTransform.skewX = 0;
                        parentGlobalTransform.skewY = 0;
                    }

                    parentGlobalTransformMatrix = DBObject._tempParentGlobalTransformMatrix;
                    TransformUtil.transformToMatrix(parentGlobalTransform, parentGlobalTransformMatrix, true);
                }
                return {parentGlobalTransform:parentGlobalTransform, parentGlobalTransformMatrix:parentGlobalTransformMatrix};
            }
            return null;
        }

        public _updateGlobal():any {
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
	}
}