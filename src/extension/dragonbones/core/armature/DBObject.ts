module dragonBones {

	export class DBObject{
		public name:string;
		
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
		
		/** @private */
		public _globalTransformMatrix:Matrix;
		
		/** @private */
		public _global:DBTransform;
		/**
		 * This DBObject instance global transform instance.
		 * @see dragonBones.objects.DBTransform
		 */
		public get global():DBTransform{
			return this._global;
		}
		
		/** @private */
		public _origin:DBTransform;
		/**
		 * This DBObject instance related to parent transform instance.
		 * @see dragonBones.objects.DBTransform
		 */
		public get origin():DBTransform{
			return this._origin;
		}
		
		/** @private */
		public _offset:DBTransform;
		/**
		 * This DBObject instance offset transform instance (For manually control).
		 * @see dragonBones.objects.DBTransform
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
		}
		
		/**
		 * Cleans up any resources used by this DBObject instance.
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
	}
}