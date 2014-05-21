/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../../../egret/core/Injector.ts"/>
/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/display/DisplayObjectContainer.ts"/>
/// <reference path="../../../egret/geom/Rectangle.ts"/>
/// <reference path="supportClasses/DefaultSkinAdapter.ts"/>
/// <reference path="../core/IInvalidateDisplay.ts"/>
/// <reference path="../core/ILayoutElement.ts"/>
/// <reference path="../core/ISkinAdapter.ts"/>
/// <reference path="../core/ISkinnableClient.ts"/>
/// <reference path="../core/UIComponent.ts"/>
/// <reference path="../events/UIEvent.ts"/>

module ns_egret {

	/**
	 * @class ns_egret.UIAsset
	 * @classdesc
	 * 素材包装器。<p/>
	 * 注意：UIAsset仅在添skin时测量一次初始尺寸， 请不要在外部直接修改skin尺寸，
	 * 若做了引起skin尺寸发生变化的操作, 需手动调用UIAsset的invalidateSize()进行重新测量。
	 * @extends ns_egret.UIComponent
	 * @implements ns_egret.ISkinnableClient
	 */
	export class UIAsset extends UIComponent implements ISkinnableClient{
		/**
		 * @method ns_egret.UIAsset#constructor
		 */
		public constructor(){
			super();
			this.touchChildren = false;
		}
		
		private skinNameChanged:boolean = false;
		/**
		 * 外部显式设置了皮肤名
		 * @member ns_egret.UIAsset#_skinNameExplicitlySet
		 */		
		public _skinNameExplicitlySet:any = false;
		
		public _skinName:any;

		/**
		 * 皮肤标识符。可以为Class,String,或DisplayObject实例等任意类型，具体规则由项目注入的素材适配器决定，
		 * 适配器根据此属性值解析获取对应的显示对象，并赋值给skin属性。
		 * @member ns_egret.UIAsset#skinName
		 */	
		public get skinName():any{
			return this._skinName;
		}

		public set skinName(value:any){
			if(this._skinName==value)
				return;
			this._skinName = value;
			this._skinNameExplicitlySet = true;
			if(this.createChildrenCalled){
				this.parseSkinName();
			}
			else{
				this.skinNameChanged = true;
			}
		}
		
		public _skin:DisplayObject;
		/**
		 * 显示对象皮肤。
		 * @member ns_egret.UIAsset#skin
		 */
		public get skin():DisplayObject{
			return this._skin;
		}
		
		/**
		 * 皮肤适配器解析skinName后回调函数
		 * @method ns_egret.UIAsset#onGetSkin
		 * @param skin {any} 皮肤显示对象
		 * @param skinName {any} 皮肤标识符
		 */		
		public onGetSkin(skin:any,skinName:any):void{
			if(this._skin!==skin){//如果皮肤是重用的，就不用执行添加和移除操作。

				if(this._skin&&this._skin.parent==<DisplayObjectContainer><any>this){
					super.removeChild(this._skin);
				}
				this._skin = <DisplayObject> skin;
				if(this._skin){
					super.addChildAt(this._skin,0);
				}
			}
			this._aspectRatio = NaN;
			this.invalidateSize();
			this.invalidateDisplayList();
			if(this.stage)
				this.validateNow();
		}
		
		private createChildrenCalled:boolean = false;
		/**
		 * @method ns_egret.UIAsset#createChildren
		 */
		public createChildren():void{
			super.createChildren();
			if(this.skinNameChanged){
				this.parseSkinName();
			}
			this.createChildrenCalled = true;
		}
		
		/**
		 * 皮肤解析适配器
		 */		
		private static skinAdapter:ISkinAdapter;
		/**
		 * 默认的皮肤解析适配器
		 */	
		private static defaultSkinAdapter:DefaultSkinAdapter;
		
		private skinReused:boolean = false;
		/**
		 * 解析skinName
		 */		
		private parseSkinName():void{
			this.skinNameChanged = false;
			var adapter:ISkinAdapter = UIAsset.skinAdapter;
			if(!adapter){
				try{
					adapter = UIAsset.skinAdapter = Injector.getInstance("ISkinAdapter");
				}
				catch(e){
					if(!UIAsset.defaultSkinAdapter)
						UIAsset.defaultSkinAdapter = new DefaultSkinAdapter();
					adapter = UIAsset.defaultSkinAdapter;
				}
			}
			if(!this._skinName){
				this.skinChnaged(null,this._skinName);
			}
			else{
				var reuseSkin:DisplayObject = this.skinReused?null:this._skin;
				this.skinReused = true;
				adapter.getSkin(this._skinName,this.skinChnaged,this,reuseSkin);
			}
		}
		/**
		 * 皮肤发生改变
		 */		
		private skinChnaged(skin:any,skinName:any):void{
			if(skinName!==this._skinName)
				return;
			this.onGetSkin(skin,skinName);
			this.skinReused = false;
			if(this.hasEventListener(UIEvent.SKIN_CHANGED)){
                UIEvent.dispatchUIEvent(this,UIEvent.SKIN_CHANGED);
			}
		}
		
		/**
		 * @method ns_egret.UIAsset#measure
		 */
		public measure():void{
			super.measure();
			if(!this._skin)
				return;
			if(this._skin&&"includeInLayout" in this._skin&&!(<ILayoutElement><any> (this._skin)).includeInLayout)
				return;
			var rect:Rectangle = this.getMeasuredSize();
			this.measuredWidth = rect.width;
			this.measuredHeight = rect.height;
		}
		
		/**
		 * 获取测量大小
		 */		
		private getMeasuredSize():Rectangle{
			var rect:Rectangle = new Rectangle();
			if(this._skin&&"preferredWidth" in this._skin){
				rect.width = (<ILayoutElement><any> (this._skin)).preferredWidth;
				rect.height = (<ILayoutElement><any> (this._skin)).preferredHeight;
			}
			else{
				var oldScaleX:number = this._skin.scaleX;
				var oldScaleY:number = this._skin.scaleY;
				this._skin.scaleX = 1;
				this._skin.scaleY = 1;
				rect.width = this._skin.width;
				rect.height = this._skin.height;
				this._skin.scaleX = oldScaleX;
				this._skin.scaleY = oldScaleY;
			}
			return rect;
		}
		
		private _maintainAspectRatio:boolean = false;
		/**
		 * 是否保持皮肤的宽高比,默认为false。
		 * @member ns_egret.UIAsset#maintainAspectRatio
		 */
		public get maintainAspectRatio():boolean{
			return this._maintainAspectRatio;
		}

		public set maintainAspectRatio(value:boolean){
			if(this._maintainAspectRatio==value)
				return;
			this._maintainAspectRatio = value;
			this.invalidateDisplayList();
		}
		
		/**
		 * 皮肤宽高比
		 */
		public _aspectRatio:number = NaN;

		/**
		 * @method ns_egret.UIAsset#updateDisplayList
		 * @param unscaledWidth {number} 
		 * @param unscaledHeight {number} 
		 */
		public updateDisplayList(unscaledWidth:number, unscaledHeight:number):void{
			super.updateDisplayList(unscaledWidth,unscaledHeight);
			if(this._skin){
				if(this._maintainAspectRatio){
					var layoutBoundsX:number = 0;
					var layoutBoundsY:number = 0;
					if(isNaN(this._aspectRatio)){
						var rect:Rectangle = this.getMeasuredSize();
						if(rect.width==0||rect.height==0)
							this._aspectRatio = 0;
						else
							this._aspectRatio = rect.width/rect.height;
					}
					if(this._aspectRatio>0&&unscaledHeight>0&&unscaledWidth>0){
						var ratio:number = unscaledWidth/unscaledHeight;
						if(ratio>this._aspectRatio){
							var newWidth:number = unscaledHeight*this._aspectRatio;
							layoutBoundsX = Math.round((unscaledWidth-newWidth)*0.5);
							unscaledWidth = newWidth;
						}
						else{
							var newHeight:number = unscaledWidth/this._aspectRatio;
							layoutBoundsY = Math.round((unscaledHeight-newHeight)*0.5);
							unscaledHeight = newHeight;
						}
						
						if("setLayoutBoundsPosition" in this._skin){
							if((<ILayoutElement><any> (this._skin)).includeInLayout){
								(<ILayoutElement> <any>(this._skin)).setLayoutBoundsPosition(layoutBoundsX,layoutBoundsY);
							}
						}
						else{
							this._skin.x = layoutBoundsX;
							this._skin.y = layoutBoundsY;
						}
					}
				}
				if("setLayoutBoundsSize" in this._skin){
					if((<ILayoutElement><any> (this._skin)).includeInLayout){
						(<ILayoutElement><any> (this._skin)).setLayoutBoundsSize(unscaledWidth,unscaledHeight);
					}
				}
				else{
					this._skin.scaleX = unscaledWidth/this._skin.width;
					this._skin.scaleY = unscaledHeight/this._skin.height;
					if("validateNow" in this._skin)
						(<IInvalidateDisplay><any> (this._skin)).validateNow();
				}
			}
		}
		
		
		/**
		 * 添加对象到显示列表,此接口仅预留给皮肤不为ISkin而需要内部创建皮肤子部件的情况,
		 * 如果需要管理子项，若有，请使用容器的addElement()方法，非法使用有可能造成无法自动布局。
		 */		
		public _addToDisplayList(child:DisplayObject):DisplayObject{
			return super.addChild(child);
		}
		/**
		 * 添加对象到指定的索引,此接口仅预留给皮肤不为ISkin而需要内部创建皮肤子部件的情况,
		 * 如果需要管理子项，若有，请使用容器的addElementAt()方法，非法使用有可能造成无法自动布局。
		 */		
		public _addToDisplayListAt(child:DisplayObject,index:number):DisplayObject{
			return super.addChildAt(child,index);
		}
		/**
		 * 从显示列表移除对象,此接口仅预留给皮肤不为ISkin而需要内部创建皮肤子部件的情况,
		 * 如果需要管理子项，若有，请使用容器的removeElement()方法,非法使用有可能造成无法自动布局。
		 */		
		public _removeFromDisplayList(child:DisplayObject):DisplayObject{
			return super.removeChild(child);
		}
		
		private static errorStr:string = "在此组件中不可用，若此组件为容器类，请使用";
		/**
		 * @method ns_egret.UIAsset#addChild
         * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */		
		public addChild(child:DisplayObject):DisplayObject{
			throw(new Error("addChild()"+UIAsset.errorStr+"addElement()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#addChildAt
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */		
		public addChildAt(child:DisplayObject, index:number):DisplayObject{
			throw(new Error("addChildAt()"+UIAsset.errorStr+"addElementAt()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#removeChild
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @returns {DisplayObject}
		 */		
		public removeChild(child:DisplayObject):DisplayObject{
			throw(new Error("removeChild()"+UIAsset.errorStr+"removeElement()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#removeChildAt
		 * @deprecated
		 * @param index {number} 
		 * @returns {DisplayObject}
		 */		
		public removeChildAt(index:number):DisplayObject{
			throw(new Error("removeChildAt()"+UIAsset.errorStr+"removeElementAt()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#setChildIndex
		 * @deprecated
		 * @param child {DisplayObject} 
		 * @param index {number} 
		 */		
		public setChildIndex(child:DisplayObject, index:number):void{
			throw(new Error("setChildIndex()"+UIAsset.errorStr+"setElementIndex()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#swapChildren
		 * @deprecated
		 * @param child1 {DisplayObject} 
		 * @param child2 {DisplayObject} 
		 */		
		public swapChildren(child1:DisplayObject, child2:DisplayObject):void{
			throw(new Error("swapChildren()"+UIAsset.errorStr+"swapElements()代替"));
		}
		/**
		 * @method ns_egret.UIAsset#swapChildrenAt
		 * @deprecated
		 * @param index1 {number} 
		 * @param index2 {number} 
		 */		
		public swapChildrenAt(index1:number, index2:number):void{
			throw(new Error("swapChildrenAt()"+UIAsset.errorStr+"swapElementsAt()代替"));
		}
	}
}