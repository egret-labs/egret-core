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

/// <reference path="../../../egret/display/DisplayObject.ts"/>
/// <reference path="../../../egret/geom/Rectangle.ts"/>
/// <reference path="../../../../org/flexlite/domCore/IBitmapAsset.ts"/>
/// <reference path="../../../../org/flexlite/domCore/IInvalidateDisplay.ts"/>
/// <reference path="../../../egret/core/Injector.ts"/>
/// <reference path="supportClasses/DefaultSkinAdapter.ts"/>
/// <reference path="../core/ILayoutElement.ts"/>
/// <reference path="../core/ISkinAdapter.ts"/>
/// <reference path="../core/ISkinnableClient.ts"/>
/// <reference path="../core/UIComponent.ts"/>
/// <reference path="../events/UIEvent.ts"/>

module ns_egret {

	export class UIAsset extends UIComponent implements ISkinnableClient{
		public constructor(){
			super();
			this.mouseChildren = false;
		}
		
		private skinNameChanged:boolean = false;
		/**
		 * 外部显式设置了皮肤名
		 */		
		public skinNameExplicitlySet:any = false;
		
		public _skinName:any;

		/**
		 * 皮肤标识符。可以为Class,String,或DisplayObject实例等任意类型，具体规则由项目注入的素材适配器决定，
		 * 适配器根据此属性值解析获取对应的显示对象，并赋值给skin属性。
		 */	
		public get skinName():any{
			return this._skinName;
		}

		public set skinName(value:any):void{
			if(this._skinName==value)
				return;
			this._skinName = value;
			this.skinNameExplicitlySet = true;
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
		 */
		public get skin():DisplayObject{
			return this._skin;
		}
		
		/**
		 * 皮肤适配器解析skinName后回调函数
		 * @param skin 皮肤显示对象
		 * @param skinName 皮肤标识符
		 */		
		public onGetSkin(skin:any,skinName:any):void{
			if(this._skin!==skin)//如果皮肤是重用的，就不用执行添加和移除操作。{
				if(this._skin&&this._skin.parent==this){
					super.removeChild(this._skin);
				}
				this._skin = <DisplayObject> skin;
				if(this._skin){
					super.addChildAt(this._skin,0);
				}
			}
			super.createChildren();
			if(skinNameChanged){
				this.parseSkinName();
			}
			skinNameChanged = false;
			adapter:ISkinAdapter = skinAdapter;
			if(!adapter){
				try{
					this.adapter = this.skinAdapter = Injector.getInstance(ISkinAdapter);
				}
				catch(this.e:Error){
					if(!this.defaultSkinAdapter)
						this.defaultSkinAdapter = new DefaultSkinAdapter();
					this.adapter = this.defaultSkinAdapter;
				}
			}
			if(!_skinName){
				this.skinChnaged(null,this._skinName);
			}
			else{
				var reuseSkin:DisplayObject = this.skinReused?null:this._skin;
				this.skinReused = true;
				this.adapter.getSkin(this._skinName,this.skinChnaged,reuseSkin);
			}
			if(skinName!==_skinName)
				return;
			onGetSkin(skin,skinName);
			skinReused = false;
			if(hasEventListener(UIEvent.SKIN_CHANGED)){
				var event:UIEvent = new UIEvent(UIEvent.SKIN_CHANGED);
				this.dispatchEvent(event);
			}
			rect:Rectangle = new Rectangle();
			if(_skin is ILayoutElement){
				this.rect.width = (<ILayoutElement> (this._skin)).preferredWidth;
				this.rect.height = (<ILayoutElement> (this._skin)).preferredHeight;
			}
			else if(_skin is IBitmapAsset){
				this.rect.width = (<IBitmapAsset> (this._skin)).measuredWidth;
				this.rect.height = (<IBitmapAsset> (this._skin)).measuredHeight;
			}
			else{
				var oldScaleX:number = this._skin.scaleX;
				var oldScaleY:number = this._skin.scaleY;
				this._skin.scaleX = 1;
				this._skin.scaleY = 1;
				this.rect.width = this._skin.width;
				this.rect.height = this._skin.height;
				this._skin.scaleX = oldScaleX;
				this._skin.scaleY = oldScaleY;
			}
			super.updateDisplayList(unscaledWidth,unscaledHeight);
			if(_skin){
				if(this._maintainAspectRatio){
					var layoutBoundsX:number = 0;
					var layoutBoundsY:number = 0;
					if(isNaN(this.aspectRatio)){
						var rect:Rectangle = this.getMeasuredSize();
						if(rect.width==0||rect.height==0)
							this.aspectRatio = 0;
						else
							this.aspectRatio = rect.width/rect.height;
					}
					if(this.aspectRatio>0&&this.unscaledHeight>0&&this.unscaledWidth>0){
						var ratio:number = this.unscaledWidth/this.unscaledHeight;
						if(ratio>this.aspectRatio){
							var newWidth:number = this.unscaledHeight*this.aspectRatio;
							layoutBoundsX = Math.round((this.unscaledWidth-newWidth)*0.5);
							this.unscaledWidth = newWidth;
						}
						else{
							var newHeight:number = this.unscaledWidth/this.aspectRatio;
							layoutBoundsY = Math.round((this.unscaledHeight-newHeight)*0.5);
							this.unscaledHeight = newHeight;
						}
						
						if(this._skin instanceof ILayoutElement){
							if((<ILayoutElement> (this._skin)).includeInLayout){
								(<ILayoutElement> (this._skin)).setLayoutBoundsPosition(layoutBoundsX,layoutBoundsY);
							}
						}
						else{
							this._skin.x = layoutBoundsX;
							this._skin.y = layoutBoundsY;
						}
					}
				}
				if(this._skin instanceof ILayoutElement){
					if((<ILayoutElement> (this._skin)).includeInLayout){
						(<ILayoutElement> (this._skin)).setLayoutBoundsSize(this.unscaledWidth,this.unscaledHeight);
					}
				}
				else{
					this._skin.width = this.unscaledWidth;
					this._skin.height = this.unscaledHeight;
					if(this._skin instanceof IInvalidateDisplay)
						(<IInvalidateDisplay> (this._skin)).validateNow();
				}
			}
		}
		
		
		/**
		 * @inheritDoc
		 */		
		final dx_internal function addToDisplayList(child:DisplayObject):DisplayObject{
			return super.addChild(child);
		}
		/**
		 * 皮肤解析适配器
		 */		
		final dx_internal function addToDisplayListAt(child:DisplayObject,index:number):DisplayObject{
			return super.addChildAt(child,index);
		}
		/**
		 * 默认的皮肤解析适配器
		 */		
		final dx_internal function removeFromDisplayList(child:DisplayObject):DisplayObject{
			return super.removeChild(child);
		}
		
		private static const errorStr:string = /**
		 * 解析skinName
		 */;
		[Deprecated] 
		/**
		 * 皮肤发生改变
		 */		
		override public function addChild(child:DisplayObject):DisplayObject{
			throw(new Error(/**
		 * @inheritDoc
		 */+errorStr+/**
		 * 获取测量大小
		 */));
		}
		[Deprecated] 
		/**
		 * 是否保持皮肤的宽高比,默认为false。
		 */		
		override public function addChildAt(child:DisplayObject, index:number):DisplayObject{
			throw(new Error(/**
		 * 皮肤宽高比
		 */+errorStr+/**
		 * @inheritDoc
		 */));
		}
		[Deprecated] 
		/**
		 * 添加对象到显示列表,此接口仅预留给皮肤不为ISkin而需要内部创建皮肤子部件的情况,
		 * 如果需要管理子项，若有，请使用容器的addElement()方法，非法使用有可能造成无法自动布局。
		 */		
		override public function removeChild(child:DisplayObject):DisplayObject{
			throw(new Error(/**
		 * 添加对象到指定的索引,此接口仅预留给皮肤不为ISkin而需要内部创建皮肤子部件的情况,
		 * 如果需要管理子项，若有，请使用容器的addElementAt()方法，非法使用有可能造成无法自动布局。
		 */+errorStr+/**
		 * 从显示列表移除对象,此接口仅预留给皮肤不为ISkin而需要内部创建皮肤子部件的情况,
		 * 如果需要管理子项，若有，请使用容器的removeElement()方法,非法使用有可能造成无法自动布局。
		 */));
		}
		[Deprecated] 
		"在此组件中不可用，若此组件为容器类，请使用"		
		override public function removeChildAt(index:number):DisplayObject{
			throw(new Error(/**
		 * @copy org.flexlite.domUI.components.Group#addChild()
		 */+errorStr+"addChild()"));
		}
		[Deprecated] 
		"addElement()代替"		
		override public function setChildIndex(child:DisplayObject, index:number):void{
			throw(new Error(/**
		 * @copy org.flexlite.domUI.components.Group#addChildAt()
		 */+errorStr+"addChildAt()"));
		}
		[Deprecated] 
		"addElementAt()代替"		
		override public function swapChildren(child1:DisplayObject, child2:DisplayObject):void{
			throw(new Error(/**
		 * @copy org.flexlite.domUI.components.Group#removeChild()
		 */+errorStr+"removeChild()"));
		}
		[Deprecated] 
		"removeElement()代替"		
		override public function swapChildrenAt(index1:number, index2:number):void{
			throw(new Error(/**
		 * @copy org.flexlite.domUI.components.Group#removeChildAt()
		 */+errorStr+"removeChildAt()"));
		}
	}
}